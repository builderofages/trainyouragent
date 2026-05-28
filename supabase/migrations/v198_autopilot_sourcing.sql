-- supabase/migrations/v198_autopilot_sourcing.sql
-- v198 — TYA AUTOPILOT: lead-sourcing infrastructure.
--
-- The operator defines a "sourcing rule" once (e.g. "every 6h, find me 25 NEW
-- roofers in the Tampa Bay area I haven't contacted yet"). The cron then:
--   1. Hits a data source (OpenStreetMap Overpass by default, Google Places if
--      GOOGLE_PLACES_API_KEY is set)
--   2. Normalizes to sourced_prospects (raw landing zone)
--   3. Dedupes against template_sends.prospect_company_norm
--   4. Promotes new ones to template_sends with channel='autosourced'
--   5. The existing nurture cron then fires a Day-0 first-touch email +
--      Day-3 + Day-7 follow-ups
--
-- Net effect: operator sets the rule once, prospects auto-flow into the
-- outbound pipeline 24/7, follow-ups are automatic, bookings attribute back.
-- The company genuinely runs itself for top-of-funnel.
--
-- Run this in Supabase SQL editor after v192.

create extension if not exists "pgcrypto";

-- Operator-defined sourcing rule. One row per saved "campaign".
create table if not exists public.sourcing_rules (
  id                uuid primary key default gen_random_uuid(),
  -- What to find
  niche             text not null,                  -- matches NicheSite.id
  niche_label       text,
  -- Where
  city              text not null,                  -- "Tampa, FL" or "Austin, TX"
  state             text,                           -- "FL"
  country           text default 'US',
  radius_meters     int default 25000,              -- 25km default
  -- Source ranking
  query_string      text,                           -- override Places query, e.g. "independent roofing contractor"
  -- Cadence
  cadence_hours     int not null default 24,        -- run every N hours; 0 = paused
  max_per_run       int not null default 10,        -- soft cap on new prospects per run
  enabled           boolean not null default true,
  -- Bookkeeping
  last_run_at       timestamptz,
  last_run_added    int default 0,
  last_run_error    text,
  total_added       int default 0,
  created_at        timestamptz not null default now(),
  -- Optional operator note
  notes             text
);
create index if not exists sourcing_rules_due_idx
  on public.sourcing_rules (enabled, last_run_at);

-- Raw landing zone from data sources. Sourced_prospects is the audit log of
-- everything the autopilot found, BEFORE we promote to template_sends.
-- One row per (source, source_id) — natural dedupe on the data side.
create table if not exists public.sourced_prospects (
  id                uuid primary key default gen_random_uuid(),
  rule_id           uuid references public.sourcing_rules(id) on delete set null,
  source            text not null,                  -- 'osm' | 'google-places' | 'manual'
  source_id         text not null,                  -- e.g. OSM node ID or Google place_id
  prospect_company  text not null,
  prospect_company_norm text generated always as (lower(prospect_company)) stored,
  city              text,
  state             text,
  address           text,
  phone             text,
  email             text,
  website           text,
  niche             text,
  niche_label       text,
  raw               jsonb,                          -- whatever the source returned
  promoted_at       timestamptz,                    -- when we wrote to template_sends
  promoted_send_id  uuid,                           -- template_sends.id we created
  skipped_reason    text,                           -- 'dup' | 'no-contact' | ...
  created_at        timestamptz not null default now()
);
create unique index if not exists sourced_prospects_unique_source
  on public.sourced_prospects (source, source_id);
create index if not exists sourced_prospects_company_norm
  on public.sourced_prospects (prospect_company_norm);
create index if not exists sourced_prospects_promoted_idx
  on public.sourced_prospects (promoted_at desc nulls last);

-- Mark template_sends rows that came from autopilot, and gate Day-0
-- first-touch so it only ever fires once per prospect.
alter table public.template_sends
  add column if not exists first_touch_sent_at timestamptz;

-- Lock to service-role only. UI hits a server-side admin API.
alter table public.sourcing_rules    enable row level security;
alter table public.sourced_prospects enable row level security;
drop policy if exists sourcing_rules_svc on public.sourcing_rules;
drop policy if exists sourced_prospects_svc on public.sourced_prospects;
create policy sourcing_rules_svc    on public.sourcing_rules    for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy sourced_prospects_svc on public.sourced_prospects for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
