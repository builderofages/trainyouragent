-- supabase/migrations/v100_venture_federation.sql
-- v100/v101: Federated lead intake across 3 ventures sharing one Supabase
-- backend — TrainYourAgent (trainyouragent.com), Ghost Agency (cnnct.ai),
-- and TYAhq (tyahq.com). One CRM, one nurture loop, one admin dashboard;
-- each lead tagged with the venture it came from so we can filter, route,
-- and attribute downstream actions.
--
-- Safe to re-run: every column add is IF NOT EXISTS.

-- 1. Add venture + brand columns to tya_leads. Default 'tya' keeps every
--    historical row attributed to TrainYourAgent.
alter table public.tya_leads
  add column if not exists venture     text not null default 'tya',
  add column if not exists brand_url   text,
  add column if not exists cross_sell  boolean not null default false;

-- 2. Same for tya_events so a Ghost Agency booking shows up tagged.
alter table public.tya_events
  add column if not exists venture     text not null default 'tya';

-- 3. Hard allowlist of venture codes — keeps a typo from creating a 4th
--    silent bucket. Check constraint instead of an enum so we can add new
--    ventures without a migration.
do $$
begin
  if not exists (select 1 from pg_constraint
                 where conname = 'tya_leads_venture_chk') then
    alter table public.tya_leads
      add constraint tya_leads_venture_chk
      check (venture in ('tya','ghost','tyahq'));
  end if;
  if not exists (select 1 from pg_constraint
                 where conname = 'tya_events_venture_chk') then
    alter table public.tya_events
      add constraint tya_events_venture_chk
      check (venture in ('tya','ghost','tyahq'));
  end if;
end $$;

-- 4. Indexes — every admin query filters by venture first.
create index if not exists tya_leads_venture_idx
  on public.tya_leads (venture, created_at desc);
create index if not exists tya_events_venture_idx
  on public.tya_events (venture, created_at desc);

-- 5. Per-venture views so admin dashboards / nurture loops can SELECT
--    without remembering the venture filter.
create or replace view public.tya_leads_tya   as
  select * from public.tya_leads where venture = 'tya';
create or replace view public.tya_leads_ghost as
  select * from public.tya_leads where venture = 'ghost';
create or replace view public.tya_leads_tyahq as
  select * from public.tya_leads where venture = 'tyahq';

-- 6. Unified view for the cross-venture admin: everything sorted by recency.
create or replace view public.unified_leads as
  select id, email, source, venture, brand_url, cross_sell, path, ip,
         payload, created_at
    from public.tya_leads
   order by created_at desc;

comment on view  public.unified_leads is
  'Cross-venture lead feed for /admin dashboards. Filter by venture column.';
comment on column public.tya_leads.venture is
  'Source venture: tya | ghost | tyahq. Defaults tya for backward compat.';
comment on column public.tya_leads.brand_url is
  'Origin domain (trainyouragent.com / cnnct.ai / tyahq.com). Useful when same email shows up across 3.';
comment on column public.tya_leads.cross_sell is
  'True when the same email already exists under a different venture — surfaces upsell candidates.';
