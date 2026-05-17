-- supabase/migrations/0003_rls_policies.sql
-- v55a: enable Row-Level Security on all TYA tables. With RLS enabled and
-- NO policies defined for `anon` / `authenticated` roles, access is denied
-- by default. The service-role key (used only from /api/* server code)
-- bypasses RLS, so the lead-store / nurture endpoints keep working.
--
-- Rationale: once the repo is public, anyone could discover the Supabase
-- project URL + anon key by inspecting the deployed app. RLS-by-default
-- ensures that even with the anon key in hand, nothing leaks.

-- Enable RLS on every TYA table.
alter table public.tya_leads enable row level security;
alter table public.tya_events enable row level security;
alter table public.tya_nurture_sent enable row level security;

-- Backward compatibility: if a stale `public.leads` / `public.events` table
-- still exists from 0001_init.sql before the rename, lock those too.
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'leads') then
    execute 'alter table public.leads enable row level security';
  end if;
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'events') then
    execute 'alter table public.events enable row level security';
  end if;
end $$;

-- NO POLICIES are created for anon / authenticated. That means RLS denies
-- every operation from those roles. Only the service-role key (used in
-- /api/* server code through SUPABASE_SERVICE_KEY) bypasses RLS.
--
-- If we ever want to expose a row to the browser later, add an explicit
-- policy like:
--   create policy "anon can read public stats" on public.tya_events
--     for select to anon using (event_type = 'public_stat');

comment on table public.tya_leads is
  'RLS enabled; service-role only. See migrations/0003_rls_policies.sql.';
comment on table public.tya_nurture_sent is
  'RLS enabled; service-role only. See migrations/0003_rls_policies.sql.';
