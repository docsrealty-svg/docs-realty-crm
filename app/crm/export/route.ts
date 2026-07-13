export const dynamic = "force-dynamic";

type Lead = {
  id: string;
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
};

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

async function getLeads(): Promise<Lead[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];

  try {
    const response = await fetch(`${url}/rest/v1/docs_leads?select=*&tenant_key=eq.ae_ventas&order=last_contact_at.desc&limit=1000`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function GET() {
  const leads = await getLeads();
  const headers = [
    "id",
    "project_key",
    "project_name",
    "customer_phone",
    "customer_name",
    "stage",
    "intent",
    "priority",
    "lead_score",
    "assigned_vendor",
    "last_message",
    "last_contact_at",
  ];
  const rows = leads.map((lead) => headers.map((key) => csvCell(lead[key as keyof Lead])).join(","));
  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ae-ventas-leads.csv"`,
    },
  });
}
