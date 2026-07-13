import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type EvolutionPayload = Record<string, unknown>;

function evolutionConfig() {
  return {
    apiUrl: process.env.EVOLUTION_API_URL || "",
    apiKey: process.env.EVOLUTION_API_KEY || "",
    instance: process.env.EVOLUTION_INSTANCE_AE || process.env.EVOLUTION_INSTANCE_PRUEBA || "ae_ventas",
  };
}

function readPath(data: EvolutionPayload, path: string[]) {
  return path.reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, data);
}

function extractBase64(data: EvolutionPayload) {
  const candidates = [
    readPath(data, ["base64"]),
    readPath(data, ["qrcode", "base64"]),
    readPath(data, ["qrcode"]),
    readPath(data, ["code"]),
  ];
  const value = candidates.find((candidate) => typeof candidate === "string" && candidate.length > 80);
  if (!value || typeof value !== "string") return "";
  return value.startsWith("data:image") ? value : `data:image/png;base64,${value}`;
}

function extractPairingCode(data: EvolutionPayload) {
  const candidates = [
    readPath(data, ["pairingCode"]),
    readPath(data, ["instance", "pairingCode"]),
    readPath(data, ["qrcode", "pairingCode"]),
  ];
  const value = candidates.find((c) => typeof c === "string" && c.length >= 6);
  return typeof value === "string" ? value : "";
}

function svg(message: string, detail = "") {
  const body = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">
      <rect width="260" height="260" rx="18" fill="#f8f7f2"/>
      <rect x="22" y="22" width="216" height="216" rx="16" fill="#ffffff" stroke="#e3dce9"/>
      <circle cx="130" cy="104" r="34" fill="#d8f3df"/>
      <path d="M112 103c0-12 9-21 21-21s21 9 21 21-9 21-21 21c-4 0-8-1-11-3l-12 4 4-11c-1-3-2-7-2-11z" fill="#1f9d62"/>
      <text x="130" y="164" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#19171f">${message}</text>
      <text x="130" y="188" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#7d748a">${detail}</text>
    </svg>
  `);
  return `data:image/svg+xml;charset=utf-8,${body}`;
}

async function getEvolutionQr() {
  const { apiUrl, apiKey, instance } = evolutionConfig();
  if (!apiUrl || !apiKey) {
    return { state: "missing_config", image: svg("Sin configurar", "Faltan variables Evolution"), pairingCode: "" };
  }

  const headers = { apikey: apiKey };
  const statusResponse = await fetch(`${apiUrl}/instance/connectionState/${instance}`, { headers, cache: "no-store" });
  const statusData = (await statusResponse.json().catch(() => ({}))) as EvolutionPayload;
  const state = String(readPath(statusData, ["instance", "state"]) || "unknown");

  // "open" = connected. (disconnectionReasonCode is a stale field that lingers after a
  // successful reconnect, so it is NOT reliable for detecting a dead session. To force a
  // fresh QR when connected, use the "Desconectar / Reset" button, which resets the socket.)
  if (state === "open") {
    return { state, image: svg("WhatsApp conectado", instance), pairingCode: "" };
  }

  // disconnected/connecting: ask Evolution for a fresh QR / pairing code
  const qrResponse = await fetch(`${apiUrl}/instance/connect/${instance}`, { headers, cache: "no-store" });
  const qrData = (await qrResponse.json().catch(() => ({}))) as EvolutionPayload;
  const image = extractBase64(qrData);
  const pairingCode = extractPairingCode(qrData);

  if (image) return { state: "connecting", image, pairingCode };
  if (pairingCode) return { state: "connecting", image: svg("Vincular por codigo", pairingCode), pairingCode };

  // No socket and no QR yet: prompt a reset.
  return { state, image: svg("Toca Reconectar", "Sesion sin socket, reinicia abajo"), pairingCode: "" };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getEvolutionQr();
    if (request.nextUrl.searchParams.get("format") === "json") {
      return NextResponse.json({ state: result.state, pairingCode: result.pairingCode, ok: true });
    }

    if (result.image.startsWith("data:image/svg")) {
      const svgText = decodeURIComponent(result.image.replace("data:image/svg+xml;charset=utf-8,", ""));
      return new NextResponse(svgText, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
      });
    }

    const base64 = result.image.replace(/^data:image\/\w+;base64,/, "");
    return new NextResponse(Buffer.from(base64, "base64"), {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  } catch {
    const fallback = decodeURIComponent(svg("Error QR", "No se pudo consultar Evolution").replace("data:image/svg+xml;charset=utf-8,", ""));
    return new NextResponse(fallback, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
    });
  }
}

// Reset the WhatsApp session: force logout (both verbs) and restart the instance,
// so Evolution drops a stale/zombie socket and starts emitting a fresh QR.
export async function POST() {
  const { apiUrl, apiKey, instance } = evolutionConfig();
  if (!apiUrl || !apiKey) {
    return NextResponse.json({ ok: false, error: "missing_evolution_config" }, { status: 400 });
  }

  const headers = { apikey: apiKey };
  const attempts = [
    { method: "DELETE", url: `${apiUrl}/instance/logout/${instance}` },
    { method: "POST", url: `${apiUrl}/instance/logout/${instance}` },
    { method: "POST", url: `${apiUrl}/instance/restart/${instance}` },
  ];

  let anyOk = false;
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, { method: attempt.method, headers, cache: "no-store" });
      if (response.ok) anyOk = true;
    } catch {
      // keep trying the next verb/endpoint
    }
  }

  // Give the socket a moment, then request a fresh QR so the UI can render it.
  await new Promise((r) => setTimeout(r, 1500));
  try {
    await fetch(`${apiUrl}/instance/connect/${instance}`, { headers, cache: "no-store" });
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: anyOk, state: "reconnecting" });
}
