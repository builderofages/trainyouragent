-- supabase/migrations/v277_admin_audit.sql
-- v277 — admin endpoint audit log.
--
-- Every checkAdmin() call (api/_lib/admin-auth.ts) writes a row here.
-- Lets the operator see who hit which admin endpoint when, from which IP,
-- with what user-agent, and whether it succeeded. Critical visibility for
-- detecting brute-force attempts, unexpected access patterns, or
-- forgotten browser tabs hammering /api/admin/health.
--
-- Idempotent. Safe to re-run. Service-role-only via RLS.

create table if not exists public.admin_audit (
  id     uuid primary key default gen_random_uuid(),
  ts     timestamptz not null default now(),
  ip     text not null,
  path   text not null,
  method text not null,
  ok     boolean not null,
  ua     text
);

create index if not exists admin_audit_ts_idx on public.admin_audit (ts desc);
create index if not exists admin_audit_ip_idx on public.admin_audit (ip, ts desc);
create index if not exists admin_audit_failed_idx on public.admin_audit (ok, ts desc) where ok = false;

alter table public.admin_audit enable row level security;
drop policy if exists admin_audit_svc on public.admin_audit;
create policy admin_audit_svc on public.admin_audit for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Optional housekeeping: auto-delete audit rows older than 90 days so the
-- table doesn't grow unbounded. Run this as a cron in Supabase Scheduler
-- if you want it; otherwise harmless to leave manual.
-- delete from public.admin_audit where ts < now() - interval '90 days';
