-- Atlas Supabase verification checks (read-only)
-- Run in Supabase SQL Editor after running schema.sql

-- 1) Required tables
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('leads', 'audits')
order by table_name;

-- 2) Leads policies (must include anon INSERT)
select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'leads'
order by policyname;

-- 3) Audits policies (must include authenticated INSERT/SELECT)
select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'audits'
order by policyname;

-- 4) Public RPC for report view
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name = 'get_public_audit';
