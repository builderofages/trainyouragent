-- supabase/migrations/0001_init.sql
-- v42: persistent lead + event store. Replaces the ephemeral in-memory
-- lead-store on the Vercel edge. The service-role key is used to write
-- from /api/* — no RLS required on these tables because they are only
-- ever accessed server-side from trusted code.

create table if not exists public.leads (
  id            bigserial primary key,
  email         text        not null,
  source        text        not null,
  payload       jsonb,
  path          text,
  ip            text,
  created_at    timestamptz not null default now()
);

comment on table public.leads is 'Lead-capture rows from /api/lead. Email is stored masked (first 2 chars + *** + domain) before insert.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx     on public.leads (source);
create index if not exists leads_email_idx      on public.leads (email);

create table if not exists public.events (
  id            bigserial primary key,
  event_type    text        not null,
  source        text,
  meta          jsonb,
  amount_cents  bigint,
  created_at    timestamptz not null default now()
);

comment on table public.events is 'Funnel events (visit / router / booking / purchase). Used by /api/admin/funnel.';

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_event_type_idx on public.events (event_type);
create index if not exists events_source_idx     on public.events (source);

-- v42: pruning view -- keep the rolling 90 days hot, older rows can be
-- archived to a slower bucket later.
create or replace view public.events_recent as
  select * from public.events
   where created_at >= now() - interval '90 days';
