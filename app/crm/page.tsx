import { revalidatePath } from "next/cache";
import Link from "next/link";
import ScrollAlFinal from "./ScrollAlFinal";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  tenant_key: string | null;
  project_key: string | null;
  project_name: string | null;
  customer_phone: string | null;
  customer_name: string | null;
  stage: string | null;
  intent: string | null;
  priority: string | null;
  lead_score: number | null;
  assigned_vendor: string | null;
  last_message: string | null;
  last_contact_at: string | null;
  extracted?: Record<string, unknown> | null;
};

type Conversation = {
  id: string;
  lead_id: string | null;
  customer_phone: string | null;
  direction: string | null;
  message_text: string | null;
  created_at: string | null;
};

type BufferEvent = {
  id: string;
  tenant_key: string | null;
  project_key: string | null;
  customer_phone: string | null;
  message_type: string | null;
  message_text: string | null;
  media_mime_type: string | null;
  media_caption: string | null;
  created_at: string | null;
};

type BotControl = {
  id: string;
  tenant_key: string | null;
  scope: "global" | "phone" | string | null;
  customer_phone: string | null;
  paused: boolean | null;
  reason: string | null;
  updated_at: string | null;
};

type EvolutionStatus = {
  state: string;
  label: string;
};

type WhatsappLine = {
  id: string;
  instance_name: string;
  label: string;
  project_key: string | null;
  active: boolean | null;
};

type ProjectBrain = {
  project_key: string;
  project_name: string;
};

type Assignment = {
  id: string;
  project_key: string | null;
  vendor_key: string | null;
  vendor_name: string | null;
  vendor_phone: string | null;
  status: string | null;
  lead_score: number | null;
  created_at: string | null;
};

type MeetingRequest = {
  id: string;
  lead_id: string | null;
  project_key: string | null;
  customer_phone: string | null;
  assigned_vendor: string | null;
  requested_text: string | null;
  requested_start: string | null;
  requested_end: string | null;
  status: string | null;
  created_at: string | null;
};

type ApprovalItem = {
  id: string;
  customer_phone: string | null;
  status: string | null;
  reason: string | null;
  ai_suggestion?: string | null;
  approval_type?: string | null;
  payload?: Record<string, unknown> | null;
  created_at: string | null;
};

type ReportItem = {
  id: string;
  report_type: string | null;
  status: string | null;
  summary: string | null;
  payload?: Record<string, unknown> | null;
  created_at: string | null;
};

type CrmError = {
  id: string;
  node_name: string | null;
  error_message: string | null;
  created_at: string | null;
};

function crmConfig() {
  const host = headers().get("host") || "";
  const forcedTenant = process.env.CRM_TENANT;
  const isDocs = forcedTenant === "docs_realty" || forcedTenant === "docs-realty" || host.includes("docs-realty-crm");

  return {
    tenant: isDocs ? "docs-realty" : "ae_ventas",
    brand: isDocs ? "DOCS REALTY CRM" : "Automatizaciones Express CRM",
    spark: isDocs ? "D" : "AE",
    logo: isDocs ? "/docs-logo.png" : null,
    title: isDocs ? "Centro comercial" : "Centro comercial",
    publicUrl: isDocs ? "https://docs-realty-crm.vercel.app" : "https://automatizaciones-express.vercel.app",
    evolutionInstance: isDocs
      ? process.env.EVOLUTION_INSTANCE_PRUEBA || process.env.EVOLUTION_INSTANCE_DOCS || "docs_realty_prueba"
      : process.env.EVOLUTION_INSTANCE_AE || "ae_ventas",
  };
}

function tenantKey() {
  return crmConfig().tenant;
}

const stageLabels: Record<string, string> = {
  lead_nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  reunion: "Reunion",
  propuesta: "Propuesta",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

const stageOrder = ["lead_nuevo", "contactado", "calificado", "reunion", "propuesta"];

const meetingStatusLabels: Record<string, string> = {
  pending_human_confirmation: "Pendiente",
  confirmed: "Confirmada",
  completed: "Realizada",
  cancelled: "Cancelada",
};

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: key || "",
    Authorization: `Bearer ${key || ""}`,
    "Content-Type": "application/json",
  };
}

async function supabaseSelect<T>(table: string, query: string): Promise<T[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];

  try {
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: supabaseHeaders(),
      cache: "no-store",
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function getEvolutionStatus(instanceOverride?: string): Promise<EvolutionStatus> {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = instanceOverride || crmConfig().evolutionInstance;
  if (!apiUrl || !apiKey || !instance) return { state: "missing_config", label: "Sin configurar" };

  try {
    const response = await fetch(`${apiUrl}/instance/connectionState/${instance}`, {
      headers: { apikey: apiKey },
      cache: "no-store",
      // Sin esto, si Evolution esta lento el CRM entero se queda esperando.
      signal: AbortSignal.timeout(3500),
    });
    const data = await response.json();
    const state = String(data?.instance?.state || "unknown");
    if (state === "open") return { state, label: "WhatsApp conectado" };
    if (state === "connecting") return { state, label: "Esperando QR" };
    if (state === "close") return { state, label: "Desconectado" };
    return { state, label: "Estado pendiente" };
  } catch {
    return { state: "error", label: "Sin respuesta Evolution" };
  }
}

async function supabasePatch(table: string, query: string, body: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  if (!url) return;
  try {
    await fetch(`${url}/rest/v1/${table}?${query}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify(body),
    });
  } catch {}
}

async function supabaseInsert(table: string, body: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  if (!url) return;
  try {
    await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify(body),
    });
  } catch {}
}

async function supabaseDelete(table: string, query: string) {
  const url = process.env.SUPABASE_URL;
  if (!url) return;
  try {
    await fetch(`${url}/rest/v1/${table}?${query}`, {
      method: "DELETE",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
    });
  } catch {}
}

async function supabaseUpsert(table: string, body: Record<string, unknown>, onConflict = "tenant_key,scope,customer_phone") {
  const url = process.env.SUPABASE_URL;
  if (!url) return;
  try {
    await fetch(`${url}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
      method: "POST",
      headers: { ...supabaseHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(body),
    });
  } catch {}
}

async function supabaseRpc<T>(fn: string, body: Record<string, unknown>): Promise<T | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const response = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function getVendorByName(vendorName: string) {
  const cleanName = vendorName.trim();
  if (!cleanName) return null;
  const vendors = await supabaseSelect<Assignment>(
    "docs_lead_assignments",
    `select=*&tenant_key=eq.${tenantKey()}&vendor_name=eq.${encodeURIComponent(cleanName)}&order=created_at.desc&limit=1`,
  );
  return vendors[0] || null;
}

async function sendEvolutionText(phone: string, text: string) {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = crmConfig().evolutionInstance;
  const cleanPhone = phone.replace(/\D/g, "");
  if (!apiUrl || !apiKey || !cleanPhone) return false;

  const response = await fetch(`${apiUrl}/message/sendText/${instance}`, {
    method: "POST",
    headers: { apikey: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ number: cleanPhone, text }),
    cache: "no-store",
  });

  return response.ok;
}

function crmLeadUrl(leadId: string) {
  return `${crmConfig().publicUrl}${buildCrmUrl({ view: "chats", lead: leadId })}`;
}

async function assignVendorAction(formData: FormData) {
  "use server";
  const leadId = String(formData.get("lead_id") || "");
  const vendor = String(formData.get("vendor") || "").trim();
  if (!leadId || !vendor) return;

  const projectKey = String(formData.get("project_key") || "");
  const leadPhone = String(formData.get("customer_phone") || "");
  const leadMessage = String(formData.get("last_message") || "");
  const leadScore = Number(formData.get("lead_score") || 0);

  await supabasePatch("docs_leads", `id=eq.${leadId}`, { assigned_vendor: vendor, updated_at: new Date().toISOString() });
  await supabaseInsert("docs_lead_assignments", {
    tenant_key: tenantKey(),
    lead_id: leadId,
    project_key: projectKey,
    vendor_name: vendor,
    lead_score: leadScore,
    status: "assigned",
    payload: { customer_phone: leadPhone, last_message: leadMessage, crm_url: crmLeadUrl(leadId) },
  });
  await supabaseInsert("docs_approval_queue", {
    tenant_key: tenantKey(),
    approval_type: "vendor_notification",
    status: "sent_to_queue",
    ai_suggestion: `Nuevo lead asignado a ${vendor}: ${leadPhone || "sin telefono"}.`,
    payload: { lead_id: leadId, vendor_name: vendor, customer_phone: leadPhone, lead_score: leadScore, last_message: leadMessage, crm_url: crmLeadUrl(leadId) },
  });

  const vendorRecord = await getVendorByName(vendor);
  if (vendorRecord?.vendor_phone) {
    await sendEvolutionText(
      vendorRecord.vendor_phone,
      ["Nuevo lead asignado", `Telefono: ${leadPhone || "sin datos"}`, `Score: ${leadScore}`, leadMessage ? `Mensaje: ${leadMessage}` : "", `CRM: ${crmLeadUrl(leadId)}`].filter(Boolean).join("\n"),
    );
  }

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "chats", lead: leadId }));
}

async function createVendorAction(formData: FormData) {
  "use server";
  const vendorName = String(formData.get("vendor_name") || "").trim();
  const vendorPhone = String(formData.get("vendor_phone") || "").trim();
  if (!vendorName) return;

  await supabaseInsert("docs_lead_assignments", {
    tenant_key: tenantKey(),
    project_key: "general",
    vendor_key: vendorName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
    vendor_name: vendorName,
    vendor_phone: vendorPhone || null,
    status: "vendor_active",
    payload: { source: "crm_vendor_registry" },
  });

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "vendedores" }));
}

async function changeStageAction(formData: FormData) {
  "use server";
  const leadId = String(formData.get("lead_id") || "");
  const stage = String(formData.get("stage") || "");
  if (!leadId || !stage) return;
  await supabasePatch("docs_leads", `id=eq.${leadId}`, { stage, updated_at: new Date().toISOString() });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "chats", lead: leadId }));
}

async function createMeetingAction(formData: FormData) {
  "use server";
  const leadId = String(formData.get("lead_id") || "");
  if (!leadId) return;
  const requestedStartRaw = String(formData.get("requested_start") || "");
  const durationMinutes = Number(formData.get("duration_minutes") || 60);
  const requestedStart = requestedStartRaw ? new Date(requestedStartRaw).toISOString() : null;
  const requestedEnd = requestedStart ? new Date(new Date(requestedStart).getTime() + durationMinutes * 60000).toISOString() : null;

  await supabaseInsert("docs_visit_requests", {
    tenant_key: tenantKey(),
    lead_id: leadId,
    project_key: String(formData.get("project_key") || ""),
    customer_phone: String(formData.get("customer_phone") || ""),
    assigned_vendor: String(formData.get("assigned_vendor") || ""),
    requested_text: String(formData.get("requested_text") || "Reunion agendada desde CRM"),
    requested_start: requestedStart,
    requested_end: requestedEnd,
    status: "pending_human_confirmation",
  });
  await supabasePatch("docs_leads", `id=eq.${leadId}`, { stage: "reunion", updated_at: new Date().toISOString() });

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "chats", lead: leadId }));
}

async function createAgendaMeetingAction(formData: FormData) {
  "use server";
  const leadId = String(formData.get("lead_id") || "");
  const lead = leadId ? (await supabaseSelect<Lead>("docs_leads", `select=*&id=eq.${leadId}&limit=1`))[0] : null;
  if (!lead) return;

  const requestedStartRaw = String(formData.get("requested_start") || "");
  const durationMinutes = Number(formData.get("duration_minutes") || 60);
  const requestedStart = requestedStartRaw ? new Date(requestedStartRaw).toISOString() : null;
  const requestedEnd = requestedStart ? new Date(new Date(requestedStart).getTime() + durationMinutes * 60000).toISOString() : null;
  const vendor = String(formData.get("assigned_vendor") || lead.assigned_vendor || "");

  await supabaseInsert("docs_visit_requests", {
    tenant_key: tenantKey(),
    lead_id: lead.id,
    project_key: lead.project_key || "",
    customer_phone: lead.customer_phone || "",
    assigned_vendor: vendor,
    requested_text: String(formData.get("requested_text") || "Reunion creada desde agenda CRM"),
    requested_start: requestedStart,
    requested_end: requestedEnd,
    status: "pending_human_confirmation",
  });
  await supabasePatch("docs_leads", `id=eq.${lead.id}`, {
    stage: "reunion",
    assigned_vendor: vendor || lead.assigned_vendor,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "agenda" }));
}

async function updateMeetingStatusAction(formData: FormData) {
  "use server";
  const meetingId = String(formData.get("visit_id") || "");
  const status = String(formData.get("status") || "");
  if (!meetingId || !status) return;
  await supabasePatch("docs_visit_requests", `id=eq.${meetingId}`, { status, updated_at: new Date().toISOString() });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "agenda" }));
}

async function runLeadRouterAction() {
  "use server";
  const leadsToRoute = await supabaseSelect<Lead>(
    "docs_leads",
    `select=*&tenant_key=eq.${tenantKey()}&assigned_vendor=is.null&order=lead_score.desc&limit=40`,
  );
  const vendorRows = await supabaseSelect<Assignment>(
    "docs_lead_assignments",
    `select=*&tenant_key=eq.${tenantKey()}&status=eq.vendor_active&order=created_at.asc&limit=80`,
  );
  const vendors = vendorRows.filter((v) => v.vendor_name);
  if (!leadsToRoute.length || !vendors.length) {
    revalidatePath("/crm");
    redirect(buildCrmUrl({ view: "vendedores" }));
  }

  const assignedCounts = new Map<string, number>();
  const currentAssignments = await supabaseSelect<Assignment>(
    "docs_lead_assignments",
    `select=vendor_name&tenant_key=eq.${tenantKey()}&status=eq.assigned&limit=500`,
  );
  currentAssignments.forEach((item) => {
    if (item.vendor_name) assignedCounts.set(item.vendor_name, (assignedCounts.get(item.vendor_name) || 0) + 1);
  });

  for (const lead of leadsToRoute) {
    const selected = vendors.sort(
      (a, b) => (assignedCounts.get(a.vendor_name || "") || 0) - (assignedCounts.get(b.vendor_name || "") || 0),
    )[0];
    if (!selected?.vendor_name) continue;

    assignedCounts.set(selected.vendor_name, (assignedCounts.get(selected.vendor_name) || 0) + 1);
    await supabasePatch("docs_leads", `id=eq.${lead.id}`, { assigned_vendor: selected.vendor_name, updated_at: new Date().toISOString() });
    await supabaseInsert("docs_lead_assignments", {
      tenant_key: tenantKey(),
      lead_id: lead.id,
      project_key: lead.project_key || "",
      vendor_name: selected.vendor_name,
      vendor_phone: selected.vendor_phone || null,
      lead_score: lead.lead_score || 0,
      status: "assigned",
      payload: { source: "advanced_router", customer_phone: lead.customer_phone, last_message: lead.last_message, crm_url: crmLeadUrl(lead.id) },
    });
    if (selected.vendor_phone) {
      await sendEvolutionText(
        selected.vendor_phone,
        ["Nuevo lead asignado automaticamente", `Telefono: ${lead.customer_phone || "sin datos"}`, `Score: ${lead.lead_score || 0}`, lead.last_message ? `Mensaje: ${lead.last_message}` : "", `CRM: ${crmLeadUrl(lead.id)}`].filter(Boolean).join("\n"),
      );
    }
  }

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "vendedores" }));
}

async function generateFollowUpsAction() {
  "use server";
  const leads = await supabaseSelect<Lead>(`docs_leads`, `select=*&tenant_key=eq.${tenantKey()}&order=last_contact_at.asc&limit=120`);
  const pendingApprovals = await supabaseSelect<ApprovalItem>(
    "docs_approval_queue",
    `select=*&tenant_key=eq.${tenantKey()}&approval_type=eq.reactivation_followup&status=in.(pending,demo_pending)&limit=200`,
  );
  const pendingLeadIds = new Set(pendingApprovals.map((item) => String(item.payload?.lead_id || "")).filter(Boolean));
  const inactive = leads.filter((lead) => {
    if (!lead.last_contact_at) return false;
    if (pendingLeadIds.has(lead.id)) return false;
    return Date.now() - new Date(lead.last_contact_at).getTime() > 24 * 60 * 60 * 1000;
  }).slice(0, 25);

  for (const lead of inactive) {
    await supabaseInsert("docs_approval_queue", {
      tenant_key: tenantKey(),
      approval_type: "reactivation_followup",
      status: lead.extracted?.demo ? "demo_pending" : "pending",
      ai_suggestion: `Hola, como estas? Te escribo por la consulta que habias hecho. Queres que te pase mas info o preferis que te contacte un asesor?`,
      payload: { source: lead.extracted?.demo ? "demo_integral" : "crm_followup", customer_phone: lead.customer_phone, lead_id: lead.id, assigned_vendor: lead.assigned_vendor, last_message: lead.last_message, last_contact_at: lead.last_contact_at, crm_url: crmLeadUrl(lead.id) },
    });
  }

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "seguimiento" }));
}

async function approveQueuedMessageAction(formData: FormData) {
  "use server";
  const approvalId = String(formData.get("approval_id") || "");
  if (!approvalId) return;

  const item = (await supabaseSelect<ApprovalItem>(
    "docs_approval_queue",
    `select=*&tenant_key=eq.${tenantKey()}&id=eq.${approvalId}&limit=1`,
  ))[0];
  if (!item) return;

  const message = item.ai_suggestion || item.reason || "";
  const phone = String(item.customer_phone || item.payload?.customer_phone || "");
  const leadId = String(item.payload?.lead_id || "");
  const sent = phone && message ? await sendEvolutionText(phone, message) : false;

  await supabasePatch("docs_approval_queue", `id=eq.${approvalId}&tenant_key=eq.${tenantKey()}`, {
    status: sent ? "sent" : "send_failed",
    payload: {
      ...(item.payload || {}),
      sent_at: new Date().toISOString(),
      sent_ok: sent,
    },
    updated_at: new Date().toISOString(),
  });

  if (phone && message) {
    await supabaseInsert("docs_conversations", {
      tenant_key: tenantKey(),
      lead_id: leadId || null,
      project_key: String(item.payload?.project_key || "general"),
      customer_phone: phone,
      direction: "outbound",
      message_text: message,
      message_id: `approval-${approvalId}`,
      payload: { source: "approval_queue", approval_id: approvalId, sent_ok: sent },
    });
  }

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "seguimiento" }));
}

async function rejectQueuedMessageAction(formData: FormData) {
  "use server";
  const approvalId = String(formData.get("approval_id") || "");
  if (!approvalId) return;
  await supabasePatch("docs_approval_queue", `id=eq.${approvalId}&tenant_key=eq.${tenantKey()}`, {
    status: "rejected",
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "seguimiento" }));
}

async function createWeeklyReportAction() {
  "use server";
  const [leads, meetings, approvals, assignments] = await Promise.all([
    supabaseSelect<Lead>("docs_leads", `select=*&tenant_key=eq.${tenantKey()}&limit=1000`),
    supabaseSelect<MeetingRequest>("docs_visit_requests", `select=*&tenant_key=eq.${tenantKey()}&limit=1000`),
    supabaseSelect<ApprovalItem>("docs_approval_queue", `select=*&tenant_key=eq.${tenantKey()}&limit=1000`),
    supabaseSelect<Assignment>("docs_lead_assignments", `select=*&tenant_key=eq.${tenantKey()}&limit=1000`),
  ]);
  const hot = leads.filter((lead) => (lead.lead_score || 0) >= 85).length;
  const unassigned = leads.filter((lead) => !lead.assigned_vendor).length;
  const summary = [
    `Leads totales: ${leads.length}`,
    `Hot leads: ${hot}`,
    `Sin vendedor: ${unassigned}`,
    `Reuniones registradas: ${meetings.length}`,
    `Mensajes pendientes de aprobacion: ${approvals.filter((item) => item.status === "pending").length}`,
  ].join("\n");

  await supabaseInsert("docs_reports", {
    tenant_key: tenantKey(),
    report_type: "weekly_commercial",
    status: "ready",
    summary,
    payload: {
      by_stage: stageOrder.map((stage) => ({ stage, leads: leads.filter((lead) => (lead.stage || "lead_nuevo") === stage).length })),
      assignments: assignments.length,
      generated_at: new Date().toISOString(),
    },
  });

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "reportes" }));
}

async function saveMetaAdsConfigAction(formData: FormData) {
  "use server";
  const adAccountId = String(formData.get("ad_account_id") || "").trim();
  const pixelId = String(formData.get("pixel_id") || "").trim();
  const campaignNotes = String(formData.get("campaign_notes") || "").trim();

  await supabaseInsert("docs_reports", {
    tenant_key: tenantKey(),
    report_type: "meta_ads_config",
    status: adAccountId || pixelId ? "pending_validation" : "pending_credentials",
    summary: [
      adAccountId ? `Cuenta publicitaria: ${adAccountId}` : "Cuenta publicitaria pendiente",
      pixelId ? `Pixel: ${pixelId}` : "Pixel pendiente",
      campaignNotes || "Faltan permisos, eventos y estructura final de campanas.",
    ].join("\n"),
    payload: {
      ad_account_id: adAccountId || null,
      pixel_id: pixelId || null,
      campaign_notes: campaignNotes || null,
      source: "crm_meta_ads",
      created_from: "docs_realty_crm",
      created_at: new Date().toISOString(),
    },
  });

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "meta-ads" }));
}

async function cleanDemoData() {
  await supabaseDelete("docs_visit_requests", `customer_phone=like.5491111122*`);
  await supabaseDelete("docs_conversations", `customer_phone=like.5491111122*&tenant_key=eq.${tenantKey()}`);
  await supabaseDelete("docs_leads", `customer_phone=like.5491111122*&tenant_key=eq.${tenantKey()}`);
  await supabaseDelete("docs_lead_assignments", `vendor_key=like.demo_*&tenant_key=eq.${tenantKey()}`);
  await supabaseDelete("docs_reports", `status=eq.demo&tenant_key=eq.${tenantKey()}`);
  await supabaseDelete("docs_approval_queue", `status=eq.demo_pending&tenant_key=eq.${tenantKey()}`);
}

async function seedIntegralDemoAction() {
  "use server";
  const now = new Date();
  const old = new Date(now.getTime() - 49 * 60 * 60 * 1000).toISOString();
  const soon = new Date(now.getTime() + 30 * 60 * 60 * 1000).toISOString();

  await cleanDemoData();

  for (const vendor of [
    { vendor_key: "demo_alex", vendor_name: "Alex Demo" },
    { vendor_key: "demo_martin", vendor_name: "Martin Demo" },
  ]) {
    await supabaseInsert("docs_lead_assignments", {
      tenant_key: tenantKey(),
      project_key: "general",
      vendor_key: vendor.vendor_key,
      vendor_name: vendor.vendor_name,
      vendor_phone: null,
      status: "vendor_active",
      payload: { source: "demo_integral" },
    });
  }

  const demoLeads = [
    { customer_phone: "549111112201", customer_name: "Lead Demo Hot", stage: "lead_nuevo", intent: "asistente_24_7", priority: "alta", lead_score: 92, last_message: "Hola, necesito un bot para mi negocio que responda consultas todo el dia", last_contact_at: soon },
    { customer_phone: "549111112202", customer_name: "Lead Demo Medio", stage: "contactado", intent: "automatizacion_interna", priority: "media", lead_score: 74, last_message: "Quiero automatizar el seguimiento de clientes, cuanto sale?", last_contact_at: old },
    { customer_phone: "549111112203", customer_name: "Lead Demo Reunion", stage: "reunion", intent: "captacion_leads", priority: "alta", lead_score: 88, assigned_vendor: "Alex Demo", last_message: "Podemos tener una llamada esta semana para ver como funciona?", last_contact_at: now.toISOString() },
  ];

  for (const lead of demoLeads) {
    await supabaseInsert("docs_leads", { tenant_key: tenantKey(), project_key: "general", project_name: "General", source: "demo_integral", extracted: { demo: true }, payload: { source: "demo_integral" }, ...lead });
  }

  const createdLeads = await supabaseSelect<Lead>("docs_leads", `select=*&tenant_key=eq.${tenantKey()}&customer_phone=like.5491111122*&order=created_at.desc&limit=10`);
  for (const lead of createdLeads) {
    await supabaseInsert("docs_conversations", { tenant_key: tenantKey(), lead_id: lead.id, project_key: lead.project_key, customer_phone: lead.customer_phone, direction: "inbound", message_text: lead.last_message || "Consulta demo", message_id: `demo-${lead.customer_phone}`, payload: { source: "demo_integral" } });
  }

  const meetingLead = createdLeads.find((lead) => lead.customer_phone === "549111112203");
  if (meetingLead) {
    await supabaseInsert("docs_visit_requests", { tenant_key: tenantKey(), lead_id: meetingLead.id, project_key: "general", customer_phone: meetingLead.customer_phone, assigned_vendor: "Alex Demo", requested_text: "Llamada demo - sin Calendar real", requested_start: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), requested_end: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), status: "pending_human_confirmation", payload: { source: "demo_integral" } });
  }

  await supabaseInsert("docs_reports", { tenant_key: tenantKey(), report_type: "weekly_commercial", status: "demo", summary: "Demo semanal: 3 leads, 1 hot lead, 1 reunion pendiente, 1 lead inactivo para seguimiento.", payload: { source: "demo_integral" } });

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "config" }));
}

async function toggleGlobalBotAction(formData: FormData) {
  "use server";
  const current = String(formData.get("paused") || "") === "true";
  await supabaseUpsert("docs_bot_controls", { tenant_key: tenantKey(), scope: "global", customer_phone: "*", paused: !current, reason: !current ? "Pausado desde CRM" : "Reactivado desde CRM", updated_by: "crm", updated_at: new Date().toISOString() });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "config" }));
}

async function togglePhoneBotAction(formData: FormData) {
  "use server";
  const phone = String(formData.get("customer_phone") || "").trim();
  const current = String(formData.get("paused") || "") === "true";
  if (!phone) return;
  await supabaseUpsert("docs_bot_controls", { tenant_key: tenantKey(), scope: "phone", customer_phone: phone, paused: !current, reason: !current ? "Pausado por operador CRM" : "Reactivado por operador CRM", updated_by: "crm", updated_at: new Date().toISOString() });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "chats", phone }));
}

async function syncBufferEventsToLeadsAction() {
  "use server";
  const events = await supabaseSelect<BufferEvent>("docs_message_buffer_events", `select=*&tenant_key=eq.${tenantKey()}&order=created_at.asc&limit=250`);
  const realEvents = events.filter((event) => !isTestPhone(event.customer_phone) && event.customer_phone);
  const latestByPhone = new Map<string, BufferEvent>();
  realEvents.forEach((event) => { const phone = event.customer_phone || ""; latestByPhone.set(phone, event); });

  for (const event of Array.from(latestByPhone.values())) {
    const messageText = event.message_text || event.media_caption || event.media_mime_type || "Evento WhatsApp sin texto";
    await supabaseRpc("docs_realty_upsert_lead", {
      p_payload: { tenant_key: tenantKey(), project_key: "general", project_name: "General", customer_phone: event.customer_phone, stage: "lead_nuevo", intent: event.message_type || "consulta", priority: "media", lead_score: 35, source: "whatsapp", message_text: messageText, message_id: event.id, extracted: { imported_from_buffer: true, original_event_id: event.id, media_mime_type: event.media_mime_type } },
    });
  }

  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "chats" }));
}

async function cleanTestEventsAction() {
  "use server";
  await supabaseDelete("docs_message_buffer_events", `customer_phone=like.54911111*&tenant_key=eq.${tenantKey()}`);
  await supabaseDelete("docs_conversations", `customer_phone=like.54911111*&tenant_key=eq.${tenantKey()}`);
  await supabaseDelete("docs_leads", `customer_phone=like.54911111*&tenant_key=eq.${tenantKey()}`);
  await cleanDemoData();
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "config" }));
}

async function disconnectWhatsAppAction(formData: FormData) {
  "use server";
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = String(formData.get("instance") || "") || crmConfig().evolutionInstance;
  if (!apiUrl || !apiKey || !instance) return;
  const headers = { apikey: apiKey };
  // Force logout (both verbs) then restart the instance so a stale/zombie socket
  // is dropped and Evolution starts emitting a fresh QR on the next load.
  for (const attempt of [
    { method: "DELETE", url: `${apiUrl}/instance/logout/${instance}` },
    { method: "POST", url: `${apiUrl}/instance/logout/${instance}` },
    { method: "POST", url: `${apiUrl}/instance/restart/${instance}` },
  ]) {
    try {
      await fetch(attempt.url, { method: attempt.method, headers, cache: "no-store" });
    } catch {
      // keep trying the next verb/endpoint
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  try {
    await fetch(`${apiUrl}/instance/connect/${instance}`, { headers, cache: "no-store" });
  } catch {
    // ignore
  }
  revalidatePath("/crm");
  redirect("/crm?view=config");
}

async function restartWhatsAppAction(formData: FormData) {
  "use server";
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = String(formData.get("instance") || "") || crmConfig().evolutionInstance;
  const headers = apiKey ? { apikey: apiKey } : undefined;

  // 1) Reset a nivel Evolution (logout + restart de la instancia).
  if (apiUrl && headers) {
    for (const attempt of [
      { method: "DELETE", url: `${apiUrl}/instance/logout/${instance}` },
      { method: "POST", url: `${apiUrl}/instance/logout/${instance}` },
      { method: "POST", url: `${apiUrl}/instance/restart/${instance}` },
    ]) {
      try {
        await fetch(attempt.url, { method: attempt.method, headers, cache: "no-store" });
      } catch {
        // seguir con el siguiente
      }
    }
  }

  // 2) Reinicio DURO del gateway evolution-api en Railway (destraba el estado "zombie open").
  //    Solo si estan cargadas las variables de Railway.
  const rwToken = process.env.RAILWAY_API_TOKEN;
  const serviceId = process.env.EVOLUTION_RAILWAY_SERVICE_ID;
  const envId = process.env.EVOLUTION_RAILWAY_ENV_ID;
  if (rwToken && serviceId && envId) {
    try {
      await fetch("https://backboard.railway.com/graphql/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${rwToken}` },
        cache: "no-store",
        body: JSON.stringify({
          query: "mutation($s:String!,$e:String!){ serviceInstanceRedeploy(serviceId:$s, environmentId:$e) }",
          variables: { s: serviceId, e: envId },
        }),
      });
    } catch {
      // ignore
    }
  }

  // 3) Pedir un QR fresco para que la pantalla lo muestre al recargar.
  await new Promise((r) => setTimeout(r, 2000));
  if (apiUrl && headers) {
    try {
      await fetch(`${apiUrl}/instance/connect/${instance}`, { headers, cache: "no-store" });
    } catch {
      // ignore
    }
  }
  revalidatePath("/crm");
  redirect("/crm?view=config");
}

async function updateLineBrainAction(formData: FormData) {
  "use server";
  const lineId = String(formData.get("line_id") || "");
  const projectKey = String(formData.get("project_key") || "");
  if (!lineId || !projectKey) return;
  await supabasePatch("docs_whatsapp_lines", `id=eq.${lineId}`, {
    project_key: projectKey,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "config" }));
}

async function createWhatsappLineAction(formData: FormData) {
  "use server";
  const label = String(formData.get("label") || "").trim();
  const instanceName = String(formData.get("instance_name") || "").trim();
  const projectKey = String(formData.get("project_key") || "");
  if (!label || !instanceName || !projectKey) return;
  await supabaseInsert("docs_whatsapp_lines", {
    tenant_key: tenantKey(),
    instance_name: instanceName,
    label,
    project_key: projectKey,
    active: true,
  });
  revalidatePath("/crm");
  redirect(buildCrmUrl({ view: "config" }));
}

function formatTime(value: string | null) {
  if (!value) return "--:--";
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(value));
}

function dateKey(value: string | Date | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function dayName(value: Date) {
  return new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }).format(value);
}

function monthName(value: Date) {
  return new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" }).format(value);
}

function displayName(lead: Lead) {
  if (lead.customer_name) return lead.customer_name;
  if (lead.customer_phone) return lead.customer_phone.replace("@s.whatsapp.net", "");
  return "Lead sin nombre";
}

function eventName(event: BufferEvent) {
  return event.customer_phone?.replace("@s.whatsapp.net", "") || "WhatsApp sin telefono";
}

function initials(label: string) {
  const clean = label.replace(/\D/g, "").length > 7 ? "Lead" : label;
  return clean.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "L";
}

function projectName(lead: Pick<Lead, "project_name" | "project_key">) {
  if (lead.project_name) return lead.project_name;
  if (lead.project_key && lead.project_key !== "general") return lead.project_key;
  return "General";
}

function stageName(stage: string | null) {
  return stageLabels[stage || "lead_nuevo"] || stage || "Sin estado";
}

function priorityTag(lead: Lead) {
  if ((lead.lead_score || 0) >= 85) return "Hot lead";
  if (lead.intent) return lead.intent;
  return lead.priority || "Sin etiqueta";
}

function buildCrmUrl(params: Record<string, string | null | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) qs.set(key, value); });
  return `/crm${qs.toString() ? `?${qs.toString()}` : ""}`;
}

function latestEventsByPhone(events: BufferEvent[]) {
  const map = new Map<string, BufferEvent>();
  events.forEach((event) => { const phone = event.customer_phone || "sin-telefono"; if (!map.has(phone)) map.set(phone, event); });
  return Array.from(map.values());
}

function isTestPhone(phone: string | null) {
  if (!phone) return true;
  return /^54911111/.test(phone);
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams?: { lead?: string; phone?: string; q?: string; filter?: string; stage?: string; view?: string; cal?: string };
}) {
  const config = crmConfig();
  const q = (searchParams?.q || "").trim().toLowerCase();
  const filter = searchParams?.filter || "todos";
  const stageFilter = searchParams?.stage || "";
  const allowedViews = ["chats", "embudo", "vendedores", "agenda", "seguimiento", "reportes", "meta-ads", "config"];
  const view = allowedViews.includes(searchParams?.view || "") ? searchParams?.view || "chats" : "chats";
  const calendarMode = ["dia", "semana", "mes", "ano"].includes(searchParams?.cal || "") ? searchParams?.cal || "semana" : "semana";

  // Antes esto eran 13 consultas encadenadas con await: el navegador esperaba la suma de
  // todas en cada click. Ahora van en paralelo y las que son de una sola vista solo se
  // piden cuando esa vista esta abierta.
  const necesitaSeguimiento = view === "seguimiento";
  const necesitaMetaAds = view === "meta-ads";
  const necesitaConfig = view === "config";
  const vacio = <T,>() => Promise.resolve([] as T[]);

  const [
    allLeads,
    allBufferEvents,
    botControls,
    assignments,
    meetingRequests,
    approvalQueue,
    reports,
    metaReports,
    errorLogs,
    evolutionStatus,
    whatsappLines,
    projectBrains,
  ] = await Promise.all([
    supabaseSelect<Lead>("docs_leads", `select=*&tenant_key=eq.${tenantKey()}&order=last_contact_at.desc&limit=120`),
    supabaseSelect<BufferEvent>("docs_message_buffer_events", `select=*&tenant_key=eq.${tenantKey()}&order=created_at.desc&limit=160`),
    supabaseSelect<BotControl>("docs_bot_controls", `select=*&tenant_key=eq.${tenantKey()}&order=updated_at.desc&limit=200`),
    supabaseSelect<Assignment>("docs_lead_assignments", `select=*&tenant_key=eq.${tenantKey()}&order=created_at.desc&limit=80`),
    supabaseSelect<MeetingRequest>("docs_visit_requests", `select=*&tenant_key=eq.${tenantKey()}&order=created_at.desc&limit=80`),
    necesitaSeguimiento
      ? supabaseSelect<ApprovalItem>("docs_approval_queue", `select=*&tenant_key=eq.${tenantKey()}&order=created_at.desc&limit=80`)
      : vacio<ApprovalItem>(),
    necesitaSeguimiento
      ? supabaseSelect<ReportItem>("docs_reports", `select=*&tenant_key=eq.${tenantKey()}&report_type=eq.weekly_commercial&order=created_at.desc&limit=12`)
      : vacio<ReportItem>(),
    necesitaMetaAds
      ? supabaseSelect<ReportItem>("docs_reports", `select=*&tenant_key=eq.${tenantKey()}&report_type=eq.meta_ads_config&order=created_at.desc&limit=8`)
      : vacio<ReportItem>(),
    necesitaConfig ? supabaseSelect<CrmError>("docs_errors", "select=*&order=created_at.desc&limit=8") : vacio<CrmError>(),
    getEvolutionStatus(),
    necesitaConfig
      ? supabaseSelect<WhatsappLine>("docs_whatsapp_lines", `select=*&tenant_key=eq.${tenantKey()}&order=created_at.asc&limit=20`)
      : vacio<WhatsappLine>(),
    necesitaConfig
      ? supabaseSelect<ProjectBrain>("docs_project_knowledge", `select=project_key,project_name&tenant_key=eq.${tenantKey()}&order=project_name.asc&limit=20`)
      : vacio<ProjectBrain>(),
  ]);
  // Un estado de Evolution por linea: solo en Config, que es donde se muestran.
  const lineStatuses = await Promise.all(whatsappLines.map((line) => getEvolutionStatus(line.instance_name)));
  const bufferEvents = allBufferEvents.filter((event) => !isTestPhone(event.customer_phone));

  const leads = allLeads.filter((lead) => {
    const haystack = `${displayName(lead)} ${lead.customer_phone || ""} ${lead.intent || ""} ${lead.priority || ""}`.toLowerCase();
    if (q && !haystack.includes(q)) return false;
    if (filter === "hot" && (lead.lead_score || 0) < 85) return false;
    if (filter === "sin-vendedor" && lead.assigned_vendor) return false;
    if (stageFilter && (lead.stage || "lead_nuevo") !== stageFilter) return false;
    return true;
  });

  const activeLead = leads.find((lead) => lead.id === searchParams?.lead) || leads[0] || null;
  const eventGroups = latestEventsByPhone(bufferEvents);
  const activePhone = searchParams?.phone || activeLead?.customer_phone || eventGroups[0]?.customer_phone || "";
  // El nodo de n8n que registra la respuesta del bot NO escribe lead_id (cuelga del envio
  // de Evolution, donde no puede resolverlo), asi que filtrar por lead_id dejaba afuera
  // justo la mitad del bot. El telefono si lo escriben las dos puntas: filtramos por ahi.
  const conversationPhone = (activeLead?.customer_phone || activePhone || "").replace(/[^0-9]/g, "");
  const conversationFilter = conversationPhone && activeLead
    ? `or=(customer_phone.eq.${conversationPhone},lead_id.eq.${activeLead.id})`
    : conversationPhone
      ? `customer_phone=eq.${conversationPhone}`
      : activeLead
        ? `lead_id=eq.${activeLead.id}`
        : "";
  // Se piden los 120 MAS RECIENTES (desc) y despues se dan vuelta: con asc, un chat de
  // mas de 120 mensajes mostraba los mas viejos y nunca los nuevos.
  const conversationRows = conversationFilter
    ? await supabaseSelect<Conversation>("docs_conversations", `select=*&${conversationFilter}&order=created_at.desc&limit=120`)
    : [];
  // n8n graba la respuesta del bot unos milisegundos ANTES que el mensaje entrante del
  // mismo turno (van por ramas paralelas), asi que por created_at puro la respuesta
  // aparecia arriba de la pregunta. Se le suma 1,5s a los outbound solo para ordenar.
  const ordenDe = (m: Conversation) =>
    new Date(m.created_at || 0).getTime() + (m.direction === "outbound" ? 1500 : 0);
  const conversations = [...conversationRows].sort((a, b) => ordenDe(a) - ordenDe(b));
  const eventsForPhone = bufferEvents.filter((event) => event.customer_phone === activePhone).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = allLeads.filter((lead) => (lead.last_contact_at || "").startsWith(today)).length;
  const hotCount = allLeads.filter((lead) => (lead.lead_score || 0) >= 85).length;
  const unassignedCount = allLeads.filter((lead) => !lead.assigned_vendor).length;
  const meetingCount = allLeads.filter((lead) => lead.stage === "reunion").length;
  const globalBotControl = botControls.find((control) => control.scope === "global" && control.customer_phone === "*");
  const globalBotPaused = Boolean(globalBotControl?.paused);
  const phoneBotControl = botControls.find((control) => control.scope === "phone" && control.customer_phone === activePhone);
  const phoneBotPaused = Boolean(phoneBotControl?.paused);

  const metrics = [
    { label: "Leads CRM", value: String(allLeads.length), detail: `${todayCount} hoy` },
    { label: "Eventos WhatsApp", value: String(bufferEvents.length), detail: `${allBufferEvents.length} total tecnico` },
    { label: "Hot leads", value: String(hotCount), detail: `${unassignedCount} sin vendedor` },
    { label: "Reuniones", value: String(meetingCount), detail: "en agenda CRM" },
  ];

  const stageCounts = stageOrder.map((key) => ({ key, label: stageLabels[key], count: allLeads.filter((lead) => (lead.stage || "lead_nuevo") === key).length }));

  const vendorRegistry = Array.from(
    new Map(
      assignments
        .filter((a) => a.vendor_name)
        .map((a) => [a.vendor_name as string, { name: a.vendor_name as string, phone: a.vendor_phone || "", status: a.status || "vendor_active", assignedCount: allLeads.filter((lead) => lead.assigned_vendor === a.vendor_name).length }]),
    ).values(),
  );
  const allVendorNames = Array.from(new Set([...allLeads.map((l) => l.assigned_vendor).filter(Boolean), ...assignments.map((a) => a.vendor_name).filter(Boolean)])) as string[];
  const visibleVendors = vendorRegistry.length > 0
    ? vendorRegistry
    : allVendorNames.map((name) => ({ name, phone: "", status: "vendor_active", assignedCount: allLeads.filter((l) => l.assigned_vendor === name).length }));

  const rawEventsToConvert = bufferEvents.filter((event) => event.customer_phone).length;
  const testEventsCount = allBufferEvents.filter((event) => isTestPhone(event.customer_phone)).length;
  const inactiveLeads = allLeads.filter((lead) => {
    if (!lead.last_contact_at) return false;
    return Date.now() - new Date(lead.last_contact_at).getTime() > 24 * 60 * 60 * 1000;
  });
  const calendarNow = new Date();
  const weekStart = new Date(calendarNow);
  weekStart.setDate(calendarNow.getDate() - ((calendarNow.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const datedMeetings = meetingRequests
    .filter((meeting) => meeting.requested_start)
    .sort((a, b) => String(a.requested_start).localeCompare(String(b.requested_start)));
  const todayMeetings = datedMeetings.filter((meeting) => dateKey(meeting.requested_start) === dateKey(calendarNow));
  const monthMeetings = datedMeetings.filter((meeting) => {
    const date = new Date(meeting.requested_start || "");
    return date.getFullYear() === calendarNow.getFullYear() && date.getMonth() === calendarNow.getMonth();
  });
  const yearMonths = Array.from({ length: 12 }, (_, index) => ({
    index,
    label: new Intl.DateTimeFormat("es-AR", { month: "short", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(calendarNow.getFullYear(), index, 1)),
    meetings: datedMeetings.filter((meeting) => {
      const date = new Date(meeting.requested_start || "");
      return date.getFullYear() === calendarNow.getFullYear() && date.getMonth() === index;
    }),
  }));

  const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const navItems = [
    { key: "chats", title: "Chats", icon: <svg {...iconProps}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></svg> },
    { key: "embudo", title: "Embudo", icon: <svg {...iconProps}><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" /></svg> },
    { key: "vendedores", title: "Vendedores", icon: <svg {...iconProps}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { key: "agenda", title: "Agenda", icon: <svg {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg> },
    { key: "seguimiento", title: "Seguimiento", icon: <svg {...iconProps}><path d="M4 21V4a1 1 0 0 1 1-1h11l-2 5 2 5H5" /></svg> },
    { key: "reportes", title: "Reportes", icon: <svg {...iconProps}><path d="M3 3v18h18M7 14l4-4 4 4 5-6" /></svg> },
    { key: "meta-ads", title: "Meta Ads", icon: <svg {...iconProps}><path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M15 8a4 4 0 0 1 0 8" /></svg> },
    { key: "config", title: "Config", icon: <svg {...iconProps}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
  ];

  return (
    <main className={styles.shell}>
      <style>{`a[aria-label="Hablar por WhatsApp"]{display:none!important}`}</style>

      <aside className={styles.rail} aria-label="Navegacion CRM">
        <div className={styles.railBrand}>
          {config.logo ? (
            <img src={config.logo} alt={config.brand} className={styles.railLogo} />
          ) : (
            <div className={styles.spark}>{config.spark}</div>
          )}
        </div>
        <nav className={styles.railNav}>
          {navItems.map((item) => (
            <a
              className={`${styles.railButton} ${view === item.key ? styles.railButtonActive : ""}`}
              href={buildCrmUrl({ view: item.key })}
              aria-label={item.title}
              title={item.title}
              key={item.key}
            >
              <span className={styles.railIcon}>{item.icon}</span>
              <span className={styles.railLabel}>{item.title}</span>
            </a>
          ))}
        </nav>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar} id="resumen">
          <div>
            <p className={styles.eyebrow}>{config.brand}</p>
            <h1>{config.title}</h1>
          </div>
          <div className={styles.topActions}>
            <span className={globalBotPaused ? styles.pauseDot : styles.liveDot}>
              {globalBotPaused ? "Bot global pausado" : "Supabase conectado"}
            </span>
            <form action={toggleGlobalBotAction}>
              <input type="hidden" name="paused" value={globalBotPaused ? "true" : "false"} />
              <button className={globalBotPaused ? styles.warningButton : styles.secondaryButton} type="submit">
                {globalBotPaused ? "Reactivar bot global" : "Pausar bot global"}
              </button>
            </form>
            <a className={styles.secondaryButton} href="/crm/export">Exportar CSV</a>
          </div>
        </header>

        <section className={styles.metricsGrid} aria-label="Metricas principales">
          {metrics.map((metric) => (
            <article className={styles.metric} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          ))}
        </section>

        {view === "chats" && (
        <section className={styles.mainGrid}>
          <aside className={styles.inbox}>
            <form className={styles.searchBox} action="/crm">
              <input type="hidden" name="view" value="chats" />
              <span>Q</span>
              <input name="q" defaultValue={searchParams?.q || ""} aria-label="Buscar leads" placeholder="Buscar telefono, rubro o etiqueta" />
            </form>
            <div className={styles.filters}>
              <Link className={filter === "todos" ? styles.filterActive : ""} href={buildCrmUrl({ view: "chats" })}>Todos</Link>
              <Link className={filter === "hot" ? styles.filterActive : ""} href={buildCrmUrl({ view: "chats", filter: "hot" })}>Hot</Link>
              <Link className={filter === "sin-vendedor" ? styles.filterActive : ""} href={buildCrmUrl({ view: "chats", filter: "sin-vendedor" })}>Sin vendedor</Link>
            </div>
            <div className={styles.leadList}>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <a
                    className={`${styles.leadItem} ${activeLead?.id === lead.id ? styles.leadActive : ""}`}
                    href={buildCrmUrl({ view: "chats", lead: lead.id, q: searchParams?.q, filter, stage: stageFilter })}
                    key={lead.id}
                  >
                    <div className={`${styles.avatar} ${styles.green}`}>{initials(displayName(lead))}</div>
                    <div className={styles.leadCopy}>
                      <div className={styles.leadTopline}>
                        <strong>{displayName(lead)}</strong>
                        <span>{formatTime(lead.last_contact_at)}</span>
                      </div>
                      <p>{lead.last_message || "Sin ultimo mensaje registrado"}</p>
                      <div className={styles.tags}>
                        <span>{stageName(lead.stage)}</span>
                        <span>{priorityTag(lead)}</span>
                      </div>
                    </div>
                    {(lead.lead_score || 0) >= 85 && <b className={styles.unread}>!</b>}
                  </a>
                ))
              ) : eventGroups.length > 0 ? (
                eventGroups.map((event) => (
                  <a
                    className={`${styles.leadItem} ${activePhone === event.customer_phone ? styles.leadActive : ""}`}
                    href={buildCrmUrl({ view: "chats", phone: event.customer_phone || "" })}
                    key={event.customer_phone || event.id}
                  >
                    <div className={`${styles.avatar} ${styles.blue}`}>{initials(eventName(event))}</div>
                    <div className={styles.leadCopy}>
                      <div className={styles.leadTopline}>
                        <strong>{eventName(event)}</strong>
                        <span>{formatTime(event.created_at)}</span>
                      </div>
                      <p>{event.message_text || event.media_caption || event.media_mime_type || "Evento WhatsApp sin texto"}</p>
                      <div className={styles.tags}>
                        <span>{event.message_type || "mensaje"}</span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <strong>No hay actividad WhatsApp todavia</strong>
                  <p>Cuando entren consultas por WhatsApp, van a aparecer aca con estado y score.</p>
                </div>
              )}
            </div>
          </aside>

          <section className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <div className={`${styles.avatar} ${styles.green}`}>{activeLead ? initials(displayName(activeLead)) : "W"}</div>
              <div>
                <h2>{activeLead ? displayName(activeLead) : activePhone ? activePhone : "Sin lead seleccionado"}</h2>
                <p>
                  {activeLead
                    ? `${stageName(activeLead.stage)} - WhatsApp - ${activeLead.assigned_vendor || "sin vendedor"}`
                    : activePhone
                      ? "Evento WhatsApp todavia no convertido a lead"
                      : "Esperando consultas reales desde WhatsApp"}
                </p>
              </div>
              {activePhone && (
                <form action={togglePhoneBotAction}>
                  <input type="hidden" name="customer_phone" value={activePhone} />
                  <input type="hidden" name="paused" value={phoneBotPaused ? "true" : "false"} />
                  <button className={phoneBotPaused ? styles.warningButton : styles.secondaryButton} type="submit">
                    {phoneBotPaused ? "Reactivar este numero" : "Pausar este numero"}
                  </button>
                </form>
              )}
            </div>

            <div className={styles.thread} id="hilo-chat">
              <ScrollAlFinal selector="#hilo-chat" clave={`${activeLead?.id || ""}-${activePhone}-${conversations.length}`} />
              <span className={styles.dayPill}>{activeLead ? "Conversacion CRM" : "Eventos WhatsApp"}</span>
              {/* Si un hilo no tiene respuestas, decimos por que en vez de dejarlo mudo. */}
              {(globalBotPaused || phoneBotPaused) && (
                <div className={styles.emptyState}>
                  <strong>{globalBotPaused ? "El bot global esta pausado" : "El bot esta pausado para este numero"}</strong>
                  <p>No va a responder hasta que lo reactives con el boton de arriba.</p>
                </div>
              )}
              {conversations.length > 0 && !conversations.some((m) => m.direction === "outbound") && (
                <div className={styles.emptyState}>
                  <strong>Este chat no tiene respuestas registradas</strong>
                  <p>Hasta el 01/09/2026 las respuestas del bot no se guardaban: las de antes de esa fecha solo existen en WhatsApp.</p>
                </div>
              )}
              {conversations.length > 0 ? (
                conversations.map((message) => (
                  <div className={`${styles.bubbleRow} ${message.direction === "outbound" ? styles.agent : styles.client}`} key={message.id}>
                    <div className={styles.bubble}>
                      {(message.message_text || "Mensaje sin texto").split("\n").map((line) => <p key={line}>{line}</p>)}
                      <time>{formatTime(message.created_at)}</time>
                    </div>
                  </div>
                ))
              ) : eventsForPhone.length > 0 ? (
                eventsForPhone.map((event) => (
                  <div className={`${styles.bubbleRow} ${styles.client}`} key={event.id}>
                    <div className={styles.bubble}>
                      <p>{event.message_text || event.media_caption || event.media_mime_type || "Evento WhatsApp sin texto"}</p>
                      <time>{formatTime(event.created_at)}</time>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <strong>Sin mensajes para mostrar</strong>
                  <p>El historial sale de docs_conversations; los eventos crudos de docs_message_buffer_events.</p>
                </div>
              )}
            </div>
          </section>

          <aside className={styles.leadPanel}>
            <div className={styles.leadScore}>
              <span>Interes IA</span>
              <strong>{activeLead?.lead_score || 0}</strong>
              <small>Prioridad comercial estimada</small>
            </div>
            <dl>
              <div><dt>Estado</dt><dd>{activeLead ? stageName(activeLead.stage) : "Evento crudo"}</dd></div>
              <div><dt>Interes</dt><dd>{activeLead?.intent || "Sin datos"}</dd></div>
              <div><dt>Telefono</dt><dd>{activeLead?.customer_phone?.replace("@s.whatsapp.net", "") || activePhone || "Sin datos"}</dd></div>
              <div><dt>Vendedor</dt><dd>{activeLead?.assigned_vendor || "Sin asignar"}</dd></div>
            </dl>

            {activeLead ? (
              <div className={styles.actionStack}>
                <form action={assignVendorAction}>
                  <input type="hidden" name="lead_id" value={activeLead.id} />
                  <input type="hidden" name="project_key" value={activeLead.project_key || ""} />
                  <input type="hidden" name="lead_score" value={activeLead.lead_score || 0} />
                  <input type="hidden" name="customer_phone" value={activeLead.customer_phone || ""} />
                  <input type="hidden" name="last_message" value={activeLead.last_message || ""} />
                  {visibleVendors.length > 0 ? (
                    <select name="vendor" defaultValue={activeLead.assigned_vendor || ""} required>
                      <option value="" disabled>Elegir vendedor</option>
                      {visibleVendors.map((vendor) => <option value={vendor.name} key={vendor.name}>{vendor.name}</option>)}
                    </select>
                  ) : (
                    <input name="vendor" placeholder="Nombre vendedor" required />
                  )}
                  <button type="submit">Asignar vendedor</button>
                </form>
                <form action={changeStageAction}>
                  <input type="hidden" name="lead_id" value={activeLead.id} />
                  <select name="stage" defaultValue={activeLead.stage || "lead_nuevo"}>
                    {Object.entries(stageLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                  <button type="submit">Actualizar estado</button>
                </form>
                <form action={createMeetingAction}>
                  <input type="hidden" name="lead_id" value={activeLead.id} />
                  <input type="hidden" name="project_key" value={activeLead.project_key || ""} />
                  <input type="hidden" name="customer_phone" value={activeLead.customer_phone || ""} />
                  <input type="hidden" name="assigned_vendor" value={activeLead.assigned_vendor || ""} />
                  <input name="requested_start" type="datetime-local" aria-label="Fecha y hora de reunion" />
                  <select name="duration_minutes" defaultValue="60" aria-label="Duracion">
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                  <input name="requested_text" placeholder="Nota de reunion" />
                  <button type="submit">Agendar reunion</button>
                </form>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <strong>Acciones deshabilitadas</strong>
                <p>Para asignar vendedor, cambiar estado o agendar reunion primero tiene que existir un registro en docs_leads.</p>
              </div>
            )}

            <div className={styles.smartTags}>
              {activeLead ? (
                <>
                  {(globalBotPaused || phoneBotPaused) && <span>Bot pausado</span>}
                  <span>{priorityTag(activeLead)}</span>
                  <span>{activeLead.intent || "Sin intent"}</span>
                </>
              ) : (
                <>
                  {(globalBotPaused || phoneBotPaused) && <span>Bot pausado</span>}
                  <span>WhatsApp buffer</span>
                </>
              )}
            </div>
          </aside>
        </section>
        )}

        {view === "embudo" && (
        <section className={styles.kanban} aria-label="Embudo comercial">
          {stageCounts.map((stage) => (
            <article className={styles.column} key={stage.key}>
              <header>
                <Link href={buildCrmUrl({ stage: stage.key })}>{stage.label}</Link>
                <b>{stage.count}</b>
              </header>
              {allLeads
                .filter((lead) => (lead.stage || "lead_nuevo") === stage.key)
                .slice(0, 8)
                .map((lead) => (
                  <div className={styles.pipelineCard} key={lead.id}>
                    <Link href={buildCrmUrl({ view: "chats", lead: lead.id, stage: stage.key })}>
                      <strong>{displayName(lead)}</strong>
                      <small>{lead.assigned_vendor || "sin vendedor"}</small>
                    </Link>
                    <form className={styles.compactForm} action={changeStageAction}>
                      <input type="hidden" name="lead_id" value={lead.id} />
                      <select name="stage" defaultValue={lead.stage || "lead_nuevo"} aria-label="Mover lead">
                        {Object.entries(stageLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                      </select>
                      <button type="submit">Mover</button>
                    </form>
                  </div>
                ))}
              {stage.count === 0 && <p className={styles.emptyColumn}>Sin leads</p>}
            </article>
          ))}
        </section>
        )}

        {view !== "chats" && view !== "embudo" && (
        <section className={styles.opsGrid} aria-label="Modulos comerciales">
          {view === "vendedores" && (
          <article className={styles.opsPanel}>
            <header>
              <div><span>Vendedores</span><h2>Derivacion comercial</h2></div>
              <b>{visibleVendors.length}</b>
            </header>
            <form className={styles.inlineForm} action={createVendorAction}>
              <input name="vendor_name" placeholder="Nombre del vendedor" required />
              <input name="vendor_phone" placeholder="WhatsApp interno" />
              <button type="submit">Agregar vendedor</button>
            </form>
            <div className={styles.rowItem}>
              <strong>Enrutador avanzado</strong>
              <span>Asigna leads sin vendedor por score y carga del equipo. Si el vendedor tiene WhatsApp cargado, tambien lo notifica.</span>
              <form className={styles.compactForm} action={runLeadRouterAction}>
                <span>{unassignedCount} leads sin vendedor</span>
                <button type="submit">Ejecutar enrutador</button>
              </form>
            </div>
            {visibleVendors.length > 0 ? (
              visibleVendors.map((vendor) => (
                <div className={styles.rowItem} key={vendor.name}>
                  <strong>{vendor.name}</strong>
                  <span>{vendor.assignedCount} leads asignados{vendor.phone ? ` - ${vendor.phone}` : ""}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>Todavia no hay vendedores cargados. Agregalos aca para poder asignar leads y preparar notificaciones.</p>
            )}
          </article>
          )}

          {view === "agenda" && (
          <article className={styles.opsPanel}>
            <header>
              <div><span>Agenda</span><h2>Calendario comercial</h2></div>
              <b>{meetingRequests.length}</b>
            </header>
            <div className={styles.statusStrip}>
              <span>CRM conectado a visitas internas</span>
              <span>Google Calendar pendiente de credencial</span>
              <span>Prueba end-to-end pendiente</span>
            </div>
            <form className={styles.agendaForm} action={createAgendaMeetingAction}>
              <select name="lead_id" defaultValue="" required>
                <option value="" disabled>Elegir lead</option>
                {allLeads.map((lead) => (
                  <option value={lead.id} key={lead.id}>{displayName(lead)} - {stageName(lead.stage)}</option>
                ))}
              </select>
              <select name="assigned_vendor" defaultValue="">
                <option value="">Sin vendedor</option>
                {visibleVendors.map((vendor) => <option value={vendor.name} key={vendor.name}>{vendor.name}</option>)}
              </select>
              <input name="requested_start" type="datetime-local" aria-label="Fecha y hora" />
              <select name="duration_minutes" defaultValue="60" aria-label="Duracion">
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
              <select name="status" defaultValue="pending_human_confirmation" aria-label="Estado">
                {Object.entries(meetingStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <input name="requested_text" placeholder="Nota interna de reunion" />
              <button type="submit">Crear reunion</button>
            </form>
            <nav className={styles.calendarTabs} aria-label="Vistas de agenda">
              <Link className={calendarMode === "dia" ? styles.calendarTabActive : ""} href={buildCrmUrl({ view: "agenda", cal: "dia" })}>Dia</Link>
              <Link className={calendarMode === "semana" ? styles.calendarTabActive : ""} href={buildCrmUrl({ view: "agenda", cal: "semana" })}>Semana</Link>
              <Link className={calendarMode === "mes" ? styles.calendarTabActive : ""} href={buildCrmUrl({ view: "agenda", cal: "mes" })}>Mes</Link>
              <Link className={calendarMode === "ano" ? styles.calendarTabActive : ""} href={buildCrmUrl({ view: "agenda", cal: "ano" })}>Ano</Link>
            </nav>
            <section className={styles.calendarBoard} aria-label="Calendario CRM">
              {calendarMode === "dia" && (
                <div className={styles.dayBoard}>
                  <header><strong>Hoy</strong><span>{dayName(calendarNow)}</span></header>
                  {todayMeetings.length > 0 ? todayMeetings.map((meeting) => (
                    <div className={styles.calendarEvent} key={meeting.id}>
                      <strong>{formatTime(meeting.requested_start)} - {meeting.customer_phone || "Sin telefono"}</strong>
                      <span>{meeting.assigned_vendor || "sin vendedor"} · {meetingStatusLabels[meeting.status || ""] || meeting.status || "pendiente"}</span>
                    </div>
                  )) : <p className={styles.emptyColumn}>Sin visitas para hoy</p>}
                </div>
              )}
              {calendarMode === "semana" && (
                <div className={styles.weekBoard}>
                  {weekDays.map((day) => {
                    const meetings = datedMeetings.filter((meeting) => dateKey(meeting.requested_start) === dateKey(day));
                    return (
                      <div className={styles.weekDay} key={dateKey(day)}>
                        <header><strong>{dayName(day)}</strong><span>{meetings.length}</span></header>
                        {meetings.length > 0 ? meetings.map((meeting) => (
                          <div className={styles.calendarEvent} key={meeting.id}>
                            <strong>{formatTime(meeting.requested_start)}</strong>
                            <span>{meeting.customer_phone || "Sin telefono"}</span>
                            <small>{meeting.assigned_vendor || "sin vendedor"}</small>
                          </div>
                        )) : <p className={styles.emptyColumn}>Libre</p>}
                      </div>
                    );
                  })}
                </div>
              )}
              {calendarMode === "mes" && (
                <div className={styles.monthBoard}>
                  <header><strong>{monthName(calendarNow)}</strong><span>{monthMeetings.length} visitas</span></header>
                  {monthMeetings.length > 0 ? monthMeetings.map((meeting) => (
                    <div className={styles.calendarEvent} key={meeting.id}>
                      <strong>{formatDateTime(meeting.requested_start)} - {meeting.customer_phone || "Sin telefono"}</strong>
                      <span>{meeting.assigned_vendor || "sin vendedor"} · {meetingStatusLabels[meeting.status || ""] || meeting.status || "pendiente"}</span>
                    </div>
                  )) : <p className={styles.emptyColumn}>Sin visitas este mes</p>}
                </div>
              )}
              {calendarMode === "ano" && (
                <div className={styles.yearBoard}>
                  {yearMonths.map((month) => (
                    <div className={styles.monthCard} key={month.index}>
                      <strong>{month.label}</strong>
                      <span>{month.meetings.length}</span>
                      <small>{month.meetings.length === 1 ? "visita" : "visitas"}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>
            {meetingRequests.length > 0 ? (
              meetingRequests.slice(0, 24).map((meeting) => (
                <div className={styles.rowItem} key={meeting.id}>
                  <strong>{meeting.customer_phone || "Sin telefono"} - {formatDateTime(meeting.requested_start)}</strong>
                  <span>{meeting.assigned_vendor || "sin vendedor"} - {meetingStatusLabels[meeting.status || ""] || meeting.status || "pendiente"}</span>
                  {meeting.requested_text && <small>{meeting.requested_text}</small>}
                  <form className={styles.compactForm} action={updateMeetingStatusAction}>
                    <input type="hidden" name="visit_id" value={meeting.id} />
                    <select name="status" defaultValue={meeting.status || "pending_human_confirmation"} aria-label="Cambiar estado">
                      {Object.entries(meetingStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                    <button type="submit">Actualizar</button>
                  </form>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>Sin reuniones registradas. Crea la primera desde esta agenda.</p>
            )}
          </article>
          )}

          {view === "seguimiento" && (
          <article className={styles.opsPanel}>
            <header>
              <div><span>Seguimiento</span><h2>Reactivacion</h2></div>
              <b>{inactiveLeads.length + approvalQueue.length}</b>
            </header>
            <div className={styles.rowItem}>
              <strong>{inactiveLeads.length} leads inactivos</strong>
              <span>Mas de 24 horas sin contacto registrado</span>
            </div>
            <form className={styles.compactForm} action={generateFollowUpsAction}>
              <span>Prepara mensajes de reactivacion para aprobacion humana antes de enviar.</span>
              <button type="submit">Generar seguimientos</button>
            </form>
            <div className={styles.rowItem}>
              <strong>{approvalQueue.length} mensajes en cola</strong>
              <span>Esperando aprobacion humana antes de enviar</span>
            </div>
            {approvalQueue.slice(0, 8).map((item) => (
              <div className={styles.rowItem} key={item.id}>
                <strong>{item.approval_type || "Aprobacion pendiente"}</strong>
                <span>{item.ai_suggestion || item.reason || item.status || "pendiente"}</span>
                {(item.status === "pending" || item.status === "demo_pending") && (
                  <div className={styles.configActions}>
                    <form action={approveQueuedMessageAction}>
                      <input type="hidden" name="approval_id" value={item.id} />
                      <button className={styles.primaryButton} type="submit">Aprobar y enviar</button>
                    </form>
                    <form action={rejectQueuedMessageAction}>
                      <input type="hidden" name="approval_id" value={item.id} />
                      <button className={styles.warningButton} type="submit">Descartar</button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </article>
          )}

          {view === "reportes" && (
          <article className={styles.opsPanel}>
            <header>
              <div><span>Reportes</span><h2>Resumen operativo</h2></div>
              <b>{allLeads.length}</b>
            </header>
            <form className={styles.compactForm} action={createWeeklyReportAction}>
              <span>Genera snapshot semanal con leads, reuniones, pendientes y etapas del embudo.</span>
              <button type="submit">Generar reporte</button>
            </form>
            {stageCounts.map((item) => (
              <div className={styles.rowItem} key={item.key}>
                <strong>{item.label}</strong>
                <span>{item.count} leads</span>
              </div>
            ))}
            {reports.slice(0, 5).map((report) => (
              <div className={styles.rowItem} key={report.id}>
                <strong>{formatDateTime(report.created_at)} - {report.status || "ready"}</strong>
                <span>{report.summary || "Reporte sin resumen"}</span>
              </div>
            ))}
          </article>
          )}

          {view === "meta-ads" && (
          <article className={styles.opsPanel}>
            <header>
              <div><span>Meta Ads</span><h2>Gestion comercial</h2></div>
              <b>{metaReports.length}</b>
            </header>
            <div className={styles.statusStrip}>
              <span>Cuenta publicitaria pendiente</span>
              <span>Pixel/eventos pendientes</span>
              <span>Optimizacion mensual pendiente de permisos</span>
            </div>
            <form className={styles.metaForm} action={saveMetaAdsConfigAction}>
              <input name="ad_account_id" placeholder="ID cuenta publicitaria" />
              <input name="pixel_id" placeholder="ID pixel Meta" />
              <input name="campaign_notes" placeholder="Campanas, publicos o permisos" />
              <button type="submit">Guardar config</button>
            </form>
            <div className={styles.rowItem}>
              <strong>Setup vendido</strong>
              <span>Campanas separadas por proyecto, publicos objetivo, pixel de seguimiento y eventos de conversion.</span>
            </div>
            <div className={styles.rowItem}>
              <strong>Gestion completa integral</strong>
              <span>Campanas diferenciadas por Albardon y Fregatas, publicos segmentados, creativos por desarrollo y optimizacion continua.</span>
            </div>
            <div className={styles.rowItem}>
              <strong>Eventos esperados</strong>
              <span>Lead generado, WhatsApp iniciado, visita solicitada, visita confirmada y reserva/interes comercial alto.</span>
            </div>
            {metaReports.length > 0 ? (
              metaReports.map((item) => (
                <div className={styles.rowItem} key={item.id}>
                  <strong>{formatDateTime(item.created_at)} - {item.status || "pendiente"}</strong>
                  <span>{item.summary || "Configuracion Meta registrada"}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>Todavia no hay cuenta publicitaria cargada. La solapa queda lista para registrar permisos y conectar metricas reales.</p>
            )}
          </article>
          )}

          {view === "config" && (
          <article className={styles.opsPanel}>
            <header>
              <div><span>Config</span><h2>Sistema</h2></div>
              <b>{errorLogs.length}</b>
            </header>
            <div className={styles.rowItem}>
              <strong>Lineas de WhatsApp</strong>
              <span>{whatsappLines.length} numero(s) conectados a este CRM. Cada uno usa el cerebro que elijas, y podes agregar mas cuando el cliente sume numeros nuevos.</span>
            </div>
            <div className={styles.qrGrid}>
              {whatsappLines.map((line, i) => {
                const status = lineStatuses[i] || { state: "unknown", label: "Sin datos" };
                return (
                  <section className={styles.qrCard} aria-label={`Conexion WhatsApp ${line.label}`} key={line.id}>
                    <div className={styles.qrHeader}>
                      <div>
                        <span>{line.label}</span>
                        <strong>{status.label}</strong>
                      </div>
                      <Link className={styles.qrRefresh} href={buildCrmUrl({ view: "config" })}>Actualizar</Link>
                    </div>
                    <img src={`/api/whatsapp-qr?instance=${encodeURIComponent(line.instance_name)}`} alt={`QR para conectar ${line.label}`} />
                    <form className={styles.compactForm} action={updateLineBrainAction}>
                      <input type="hidden" name="line_id" value={line.id} />
                      <select name="project_key" defaultValue={line.project_key || ""} aria-label={`Cerebro de ${line.label}`}>
                        {projectBrains.map((brain) => (
                          <option value={brain.project_key} key={brain.project_key}>{brain.project_name}</option>
                        ))}
                      </select>
                      <button className={styles.secondaryButton} type="submit">Guardar cerebro</button>
                    </form>
                    <form action={restartWhatsAppAction}>
                      <input type="hidden" name="instance" value={line.instance_name} />
                      <button className={styles.disconnectButton} type="submit" style={{ background: "#1f9d62", color: "#fff", fontWeight: 700 }}>
                        Reiniciar (nuevo QR)
                      </button>
                    </form>
                    <form action={disconnectWhatsAppAction}>
                      <input type="hidden" name="instance" value={line.instance_name} />
                      <button className={styles.disconnectButton} type="submit">Desconectar</button>
                    </form>
                    <small>
                      {status.state === "open"
                        ? "Para cambiar el telefono, desconecta primero y volves a escanear."
                        : "Escanear desde WhatsApp > Dispositivos vinculados."}
                    </small>
                  </section>
                );
              })}
            </div>
            <div className={styles.rowItem}>
              <strong>Agregar numero nuevo</strong>
              <span>Para cuando el cliente sume otro numero mas adelante (una casa, otro desarrollo, etc).</span>
            </div>
            <form className={styles.metaForm} action={createWhatsappLineAction}>
              <input name="label" placeholder="Nombre (ej: Casa Vila Marina)" required />
              <input name="instance_name" placeholder="ID interno (ej: docs-vilamarina)" required />
              <select name="project_key" defaultValue="" required aria-label="Cerebro del numero nuevo">
                <option value="" disabled>Elegir cerebro</option>
                {projectBrains.map((brain) => (
                  <option value={brain.project_key} key={brain.project_key}>{brain.project_name}</option>
                ))}
              </select>
              <button type="submit">Agregar numero</button>
            </form>
            <div className={styles.rowItem}>
              <strong>Bot global</strong>
              <span>{globalBotPaused ? "pausado" : "activo"}</span>
            </div>
            <form className={styles.inlineForm} action={toggleGlobalBotAction}>
              <input type="hidden" name="paused" value={globalBotPaused ? "true" : "false"} />
              <button className={globalBotPaused ? styles.warningButton : styles.secondaryButton} type="submit">
                {globalBotPaused ? "Reactivar bot global" : "Pausar bot global"}
              </button>
            </form>
            <div className={styles.rowItem}>
              <strong>Eventos crudos WhatsApp</strong>
              <span>{rawEventsToConvert} reales para sincronizar - {testEventsCount} eventos internos ocultos</span>
            </div>
            <div className={styles.configActions}>
              <form action={syncBufferEventsToLeadsAction}>
                <button className={styles.primaryButton} type="submit">Convertir eventos a leads</button>
              </form>
              <form action={cleanTestEventsAction}>
                <button className={styles.warningButton} type="submit">Limpiar eventos internos</button>
              </form>
            </div>
            <div className={styles.rowItem}>
              <strong>Datos internos de ensayo</strong>
              <span>Carga datos temporales para probar derivacion, agenda, seguimiento y reportes sin credenciales finales del cliente.</span>
            </div>
            <form className={styles.inlineForm} action={seedIntegralDemoAction}>
              <button className={styles.primaryButton} type="submit">Cargar ensayo integral</button>
            </form>
            {errorLogs.length > 0 && (
              <div className={styles.rowItem}>
                <strong>Ultimo error</strong>
                <span>{errorLogs[0].node_name || errorLogs[0].error_message || "registrado"}</span>
              </div>
            )}
          </article>
          )}
        </section>
        )}
      </section>
    </main>
  );
}
