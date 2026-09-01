import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
// El workflow de n8n tarda ~35s (buffer de 12s + LLM). Damos aire para reenviar.
export const maxDuration = 60;

const FORWARD_TIMEOUT_MS = 45_000;
const LOOKUP_TIMEOUT_MS = 8_000;

/**
 * Relay del webhook de Evolution hacia n8n. Resuelve el direccionamiento LID.
 *
 * El problema: la cuenta está en modo LID. Evolution GUARDA los mensajes con
 * `key.remoteJid = "<id>@lid"`, pero cuando dispara el webhook lo NORMALIZA a
 * `<telefono>@s.whatsapp.net`. El workflow arma el destino de la respuesta a
 * partir de lo que llega por el webhook, así que responde al JID de teléfono —
 * y en modo LID eso crea un chat fantasma: Evolution acepta el envío (201 +
 * status PENDING) y WhatsApp nunca lo entrega. Verificado: enviar al `@lid`
 * llega, enviar al teléfono no.
 *
 * La solución: buscar el mensaje por su id en Evolution (que sí conserva el
 * `@lid`) y reescribir `key.remoteJid` con ese valor antes de reenviar.
 * `key.remoteJidAlt` se deja intacto con el teléfono, para que el workflow siga
 * derivando `customer_phone` correctamente (lo usa el CRM y el buffer).
 *
 * Resultado en el workflow:
 *   remote_jid     -> <id>@lid          (destino de la respuesta, entrega OK)
 *   customer_phone -> <telefono>        (identidad del lead, sin cambios)
 */

interface EvolutionKey {
  id?: string;
  remoteJid?: string;
  remoteJidAlt?: string;
  [k: string]: unknown;
}

async function fetchJson(url: string, init: RequestInit, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Busca en Evolution el `@lid` real de un mensaje, por su id.
 * Reintenta: Evolution puede disparar el webhook antes de persistir el mensaje,
 * y en ese caso la primera consulta vuelve vacía.
 */
async function lookupLid(apiUrl: string, apiKey: string, instance: string, messageId: string): Promise<string | null> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 700));

    const data = await fetchJson(
      `${apiUrl}/chat/findMessages/${instance}`,
      {
        method: "POST",
        headers: { apikey: apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ where: { key: { id: messageId } }, limit: 1 }),
      },
      LOOKUP_TIMEOUT_MS,
    );

    const records =
      (data as { messages?: { records?: Array<{ key?: EvolutionKey }> } })?.messages?.records ??
      (Array.isArray(data) ? (data as Array<{ key?: EvolutionKey }>) : []);

    const jid = records?.[0]?.key?.remoteJid;
    if (typeof jid === "string" && jid.endsWith("@lid")) return jid;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const target = process.env.N8N_WHATSAPP_WEBHOOK_URL;
  const secret = process.env.WA_RELAY_SECRET;
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;

  // Endpoint público (Evolution no puede autenticarse): exigimos secreto en la query.
  if (secret && request.nextUrl.searchParams.get("k") !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!target) {
    return NextResponse.json({ ok: false, error: "missing_N8N_WHATSAPP_WEBHOOK_URL" }, { status: 500 });
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (payload === null) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  let lidApplied: string | null = null;
  const data = payload.data as { key?: EvolutionKey } | undefined;
  const key = data?.key;
  const instance = typeof payload.instance === "string" ? payload.instance : "";

  // Solo intervenimos si el webhook trajo un JID de teléfono y tenemos con qué buscar.
  if (key?.id && instance && apiUrl && apiKey && !String(key.remoteJid || "").endsWith("@lid")) {
    const lid = await lookupLid(apiUrl, apiKey, instance, key.id);
    if (lid) {
      // remoteJidAlt queda con el teléfono: de ahí sale customer_phone.
      if (!key.remoteJidAlt && typeof key.remoteJid === "string") key.remoteJidAlt = key.remoteJid;
      key.remoteJid = lid;
      lidApplied = lid;
    }
  }

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      cache: "no-store",
    });
    return NextResponse.json({ ok: response.ok, lidApplied, upstream: response.status });
  } catch {
    // n8n ya recibió el request y sigue procesando aunque nos cortemos acá:
    // devolvemos 200 para que Evolution no reintente y duplique la respuesta.
    return NextResponse.json({ ok: true, lidApplied, upstream: "timeout" });
  }
}
