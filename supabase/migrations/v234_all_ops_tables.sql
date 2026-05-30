-- supabase/migrations/v234_all_ops_tables.sql
-- v234 — ONE PASTE, EVERY OPS TABLE.
--
-- Replaces piecemeal copy-paste of v192, v198, plus the embedded schemas
-- in api/log-error.ts and api/reviews.ts. Run this ONCE in the Supabase
-- SQL Editor and every operational surface lights up:
--   • template_sends            — prospect tracking + nurture state (v192)
--   • sourcing_rules            — operator-defined autopilot rules (v198)
--   • sourced_prospects         — raw landing zone from data sources (v198)
--   • reviews                   — customer testimonial submissions (v233)
--   • client_errors             — client-side error sink (v229)
--
-- Idempotent: every CREATE uses IF NOT EXISTS. Safe to re-run.
-- Locked to service-role only via RLS — your /admin/* APIs read+write,
-- public clients never touch these tables directly.

create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────────────
-- template_sends — v192
-- One row per "send" event (operator gave a prospect a personalized
-- /template/[niche] URL). Drives the admin activity panel + nurture cron
-- + booking attribution.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.template_sends (
  id                        uuid primary key default gen_random_uuid(),
  prospect_company          text not null,
  prospect_company_norm     text generated always as (lower(prospect_company)) stored,
  prospect_city             text,
  prospect_email            text,
  prospect_phone            text,
  prospect_name             text,
  niche                     text not null,
  niche_label               text,
  channel                   text not null,
  operator_id               text,
  sent_at                   timestamptz not null default now(),
  opened_at                 timestamptz,
  booked_at                 timestamptz,
  last_nurture_template     text,
  last_nurture_at           timestamptz,
  nurture_stopped_reason    text,
  cal_booking_uid           text,
  cal_attendee_email        text,
  first_touch_sent_at       timestamptz,
  meta                      jsonb default '{}'::jsonb
);
create index if not exists template_sends_company_norm_idx on public.template_sends (prospect_company_norm, sent_at desc);
create index if not exists template_sends_niche_idx on public.template_sends (niche, sent_at desc);
create index if not exists template_sends_nurture_idx on public.template_sends (sent_at) where booked_at is null and nurture_stopped_reason is null;
create index if not exists template_sends_email_idx on public.template_sends (prospect_email) where prospect_email is not null;

alter table public.template_sends enable row level security;
drop policy if exists template_sends_svc on public.template_sends;
create policy template_sends_svc on public.template_sends for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────────────────
-- sourcing_rules — v198
-- Operator-defined autopilot campaign: "every 24h find me 10 new HVAC
-- contractors in Tampa I haven't contacted yet."
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.sourcing_rules (
  id                uuid primary key default gen_random_uuid(),
  niche             text not null,
  niche_label       text,
  city              text not null,
  state             text,
  country           text default 'US',
  radius_meters     int default 25000,
  query_string      text,
  cadence_hours     int not null default 24,
  max_per_run       int not null default 10,
  enabled           boolean not null default true,
  last_run_at       timestamptz,
  last_run_added    int default 0,
  last_run_error    text,
  total_added       int default 0,
  created_at        timestamptz not null default now(),
  notes             text
);
create index if not exists sourcing_rules_due_idx on public.sourcing_rules (enabled, last_run_at);

alter table public.sourcing_rules enable row level security;
drop policy if exists sourcing_rules_svc on public.sourcing_rules;
create policy sourcing_rules_svc on public.sourcing_rules for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────────────────
-- sourced_prospects — v198
-- Raw landing zone from data sources (OSM Overpass / Google Places / manual).
-- Promoted to template_sends after dedup.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.sourced_prospects (
  id                uuid primary key default gen_random_uuid(),
  rule_id           uuid references public.sourcing_rules(id) on delete set null,
  source            text not null,
  source_id         text not null,
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
  raw               jsonb,
  promoted_at       timestamptz,
  promoted_send_id  uuid,
  skipped_reason    text,
  created_at        timestamptz not null default now()
);
create unique index if not exists sourced_prospects_unique_source on public.sourced_prospects (source, source_id);
create index if not exists sourced_prospects_company_norm on public.sourced_prospects (prospect_company_norm);
create index if not exists sourced_prospects_promoted_idx on public.sourced_prospects (promoted_at desc nulls last);

alter table public.sourced_prospects enable row level security;
drop policy if exists sourced_prospects_svc on public.sourced_prospects;
create policy sourced_prospects_svc on public.sourced_prospects for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────────────────
-- reviews — v233
-- Public testimonial submissions from /reviews/submit. Status:
-- 'pending' on insert, 'approved' / 'rejected' after manual review.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  company             text not null,
  email               text not null,
  niche               text not null,
  video_url           text,
  quote               text,
  permission_granted  boolean not null default false,
  source              text,
  status              text not null default 'pending',
  ts                  timestamptz not null default now()
);
create index if not exists reviews_status_ts_idx on public.reviews (status, ts desc);
create index if not exists reviews_niche_idx on public.reviews (niche, status);

alter table public.reviews enable row level security;
drop policy if exists reviews_svc on public.reviews;
create policy reviews_svc on public.reviews for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────────────────
-- client_errors — v229
-- Client-side error sink. /api/log-error pipes window.onerror +
-- unhandledrejection into here so production stops flying blind.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.client_errors (
  id     uuid primary key default gen_random_uuid(),
  ts     timestamptz not null default now(),
  kind   text,
  msg    text,
  stack  text,
  url    text,
  ua     text,
  ip     text
);
create index if not exists client_errors_ts_idx on public.client_errors (ts desc);

alter table public.client_errors enable row level security;
drop policy if exists client_errors_svc on public.client_errors;
create policy client_errors_svc on public.client_errors for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────────────────
-- DONE.
-- After running this, /admin/cockpit will turn green: template_sends,
-- sourcing_rules, reviews, and client_errors all land in the DB.
-- ──────────────────────────────────────────────────────────────────────
