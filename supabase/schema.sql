-- Run this in your Supabase SQL Editor.
-- It creates the two tables required by the app.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  zip_code text not null,
  project_type text not null,
  contractor_name text,
  notes text,
  welcome_sent_at timestamptz,
  followup_1_sent_at timestamptz,
  followup_2_sent_at timestamptz,
  submitted_at timestamptz not null default now()
);

alter table public.leads add column if not exists welcome_sent_at timestamptz;
alter table public.leads add column if not exists followup_1_sent_at timestamptz;
alter table public.leads add column if not exists followup_2_sent_at timestamptz;

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  homeowner_name text not null,
  homeowner_phone text,
  industry text not null,
  zip text not null,
  permit_issued_date date not null,
  permitted_valuation numeric not null,
  market_median numeric not null,
  deviation_percent integer not null,
  pricing_signal text not null check (pricing_signal in ('green', 'yellow', 'red')),
  findings jsonb not null default '[]'::jsonb,
  what_this_means text not null,
  recommended_actions jsonb not null default '[]'::jsonb
);

create table if not exists public.contractors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rate_submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  agreement_sent_at timestamptz,
  agreement_signed_at timestamptz,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'agreement_sent', 'active_partner', 'rejected')),

  legal_entity_name text not null,
  dba text,
  roc_license_number text not null,
  roc_classification text not null,
  license_expiration_date date not null,
  owner_principal_name text not null,
  direct_cell text not null,
  business_email text not null,
  business_address text not null,
  years_in_business integer not null,
  commercial_crew_count text not null,
  residential_crew_count text not null,
  average_weekly_install_capacity integer not null,
  current_backlog_weeks numeric not null,

  w9_url text not null,
  coi_url text not null,
  general_liability_coverage_amount text not null,
  workers_comp_policy_number text not null,
  bonding_capacity text,

  service_capabilities jsonb not null default '{}'::jsonb,
  execution_rate_card jsonb not null default '{}'::jsonb,
  permit_responsibility_confirmed boolean not null default false,
  inspection_responsibility_confirmed boolean not null default false,
  rate_lock_confirmed boolean not null default false,

  agreement_token uuid not null default gen_random_uuid(),
  agreement_signed_pdf_url text,
  agreement_signer_name text,
  agreement_signer_title text
);

alter table public.leads enable row level security;
alter table public.audits enable row level security;
alter table public.contractors enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.leads to anon;
grant select on table public.leads to authenticated;
grant insert, select on table public.audits to authenticated;
grant insert on table public.contractors to anon;
grant select, update on table public.contractors to authenticated;

drop policy if exists "Allow anon insert leads" on public.leads;
drop policy if exists "Allow anon select leads" on public.leads;
drop policy if exists "Allow anon insert audits" on public.audits;
drop policy if exists "Allow anon select audits" on public.audits;
drop policy if exists "Allow authenticated read leads" on public.leads;
drop policy if exists "Allow authenticated insert audits" on public.audits;
drop policy if exists "Allow authenticated read audits" on public.audits;
drop policy if exists "Allow anon insert contractors" on public.contractors;
drop policy if exists "Allow authenticated read contractors" on public.contractors;
drop policy if exists "Allow authenticated update contractors" on public.contractors;

-- Public users can submit lead requests.
create policy "Allow anon insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Signed-in analysts can read leads.
create policy "Allow authenticated read leads"
  on public.leads
  for select
  to authenticated
  using (true);

-- Signed-in analysts can create audits.
create policy "Allow authenticated insert audits"
  on public.audits
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated read audits"
  on public.audits
  for select
  to authenticated
  using (true);

create policy "Allow anon insert contractors"
  on public.contractors
  for insert
  to anon
  with check (status = 'pending_review');

create policy "Allow authenticated read contractors"
  on public.contractors
  for select
  to authenticated
  using (true);

create policy "Allow authenticated update contractors"
  on public.contractors
  for update
  to authenticated
  using (true)
  with check (true);

-- Public report access via RPC: only one audit row by id, limited columns.
create or replace function public.get_public_audit(audit_id uuid)
returns table (
  id uuid,
  created_at timestamptz,
  homeowner_name text,
  industry text,
  zip text,
  permit_issued_date date,
  permitted_valuation numeric,
  market_median numeric,
  deviation_percent integer,
  pricing_signal text,
  findings jsonb,
  what_this_means text,
  recommended_actions jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    a.id,
    a.created_at,
    a.homeowner_name,
    a.industry,
    a.zip,
    a.permit_issued_date,
    a.permitted_valuation,
    a.market_median,
    a.deviation_percent,
    a.pricing_signal,
    a.findings,
    a.what_this_means,
    a.recommended_actions
  from public.audits a
  where a.id = audit_id
  limit 1;
$$;

revoke all on function public.get_public_audit(uuid) from public;
grant execute on function public.get_public_audit(uuid) to anon, authenticated;

-- Contractor document storage bucket (W-9 / COI uploads)
insert into storage.buckets (id, name, public)
values ('contractor-docs', 'contractor-docs', true)
on conflict (id) do nothing;

drop policy if exists "Anon upload contractor docs" on storage.objects;
drop policy if exists "Public read contractor docs" on storage.objects;

create policy "Anon upload contractor docs"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'contractor-docs');

create policy "Public read contractor docs"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'contractor-docs');
