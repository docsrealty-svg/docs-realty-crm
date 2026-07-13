create table if not exists docs_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  project_key text not null,
  project_name text,
  customer_phone text,
  customer_name text,
  customer_email text,
  stage text default 'lead_nuevo',
  intent text,
  priority text default 'media',
  lead_score numeric default 0,
  assigned_vendor text,
  source text default 'whatsapp',
  last_message text,
  last_contact_at timestamptz default now(),
  extracted jsonb default '{}',
  payload jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists docs_leads_unique_active
on docs_leads(tenant_key, project_key, customer_phone);

create table if not exists docs_conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  lead_id uuid references docs_leads(id) on delete cascade,
  project_key text,
  customer_phone text,
  direction text,
  message_text text,
  message_id text,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists docs_message_buffer (
  buffer_key text primary key,
  tenant_key text not null,
  project_key text,
  customer_phone text,
  current_message_id text,
  latest_message_id text,
  messages_text text,
  messages_json jsonb default '[]',
  updated_at timestamptz default now()
);

create table if not exists docs_message_buffer_events (
  id uuid primary key default gen_random_uuid(),
  buffer_key text not null,
  tenant_key text not null,
  project_key text,
  customer_phone text,
  message_id text,
  message_type text,
  message_text text,
  media_id text,
  media_url text,
  media_mime_type text,
  media_caption text,
  created_at timestamptz default now()
);

create index if not exists docs_message_buffer_events_lookup
on docs_message_buffer_events(buffer_key, created_at desc);

create table if not exists docs_lead_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  lead_id uuid references docs_leads(id) on delete cascade,
  project_key text,
  vendor_key text,
  vendor_name text,
  vendor_phone text,
  lead_score numeric,
  sla_minutes integer,
  status text default 'assigned',
  payload jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists docs_visit_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  lead_id uuid references docs_leads(id) on delete cascade,
  project_key text,
  customer_phone text,
  assigned_vendor text,
  requested_text text,
  requested_start timestamptz,
  requested_end timestamptz,
  calendar_event_id text,
  status text default 'pending_human_confirmation',
  payload jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists docs_approval_queue (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  approval_type text not null,
  status text default 'pending',
  ai_suggestion text,
  payload jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists docs_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_key text not null,
  report_type text not null,
  status text default 'draft',
  summary text,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists docs_errors (
  id uuid primary key default gen_random_uuid(),
  tenant_key text,
  workflow text,
  error_message text,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

create or replace function docs_realty_upsert_lead(p_payload jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_lead_id uuid;
begin
  insert into docs_leads (
    tenant_key, project_key, project_name, customer_phone, customer_name, customer_email,
    stage, intent, priority, lead_score, source, last_message, last_contact_at, extracted, payload
  )
  values (
    p_payload->>'tenant_key',
    p_payload->>'project_key',
    p_payload->>'project_name',
    p_payload->>'customer_phone',
    p_payload->>'customer_name',
    p_payload->>'customer_email',
    coalesce(p_payload->>'stage','lead_nuevo'),
    p_payload->>'intent',
    coalesce(p_payload->>'priority','media'),
    coalesce((p_payload->>'lead_score')::numeric,0),
    coalesce(p_payload->>'source','whatsapp'),
    p_payload->>'message_text',
    now(),
    coalesce(p_payload->'extracted','{}'::jsonb),
    p_payload
  )
  on conflict (tenant_key, project_key, customer_phone)
  do update set
    customer_name = coalesce(excluded.customer_name, docs_leads.customer_name),
    customer_email = coalesce(excluded.customer_email, docs_leads.customer_email),
    stage = excluded.stage,
    intent = excluded.intent,
    priority = excluded.priority,
    lead_score = greatest(docs_leads.lead_score, excluded.lead_score),
    last_message = excluded.last_message,
    last_contact_at = now(),
    extracted = docs_leads.extracted || excluded.extracted,
    payload = excluded.payload,
    updated_at = now()
  returning id into v_lead_id;

  insert into docs_conversations(
    tenant_key, lead_id, project_key, customer_phone, direction, message_text, message_id, payload
  )
  values (
    p_payload->>'tenant_key',
    v_lead_id,
    p_payload->>'project_key',
    p_payload->>'customer_phone',
    'inbound',
    p_payload->>'message_text',
    p_payload->>'message_id',
    p_payload
  );

  return jsonb_build_object('lead_id', v_lead_id);
end;
$$;
