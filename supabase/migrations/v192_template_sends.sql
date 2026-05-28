-- supabase/migrations/v192_template_sends.sql
-- v192 — niche-template close-tool prospect tracking + nurture state.
--
-- One row per "send" event (operator handed a prospect their personalized
-- /template/[niche] link via DM/Email/SMS/Share/Link copy). We then track:
--   • opened_at   — set when the prospect actually loads /template/[niche]
--                   with a matching ?company= param
--   • booked_at   — set when a matching Cal.com booking webhook fires
--   • last_nurture_template — which Day-3 / Day-7 follow-up has been sent
--
-- This drives:
--   1. The "Recent activity" panel in /admin/templates (was-opened, was-booked)
--   2. /api/cron/template-nurture — sends Day-3 + Day-7 follow-ups to
--      anyone with an email/phone who hasn't booked
--   3. Attribution loop — operator sees DM → open → booking flow per niche
--
-- Run this manually in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.template_sends (
  id                        uuid primary key default gen_random_uuid(),
  -- Prospect identity
  prospect_company          text not null,
  prospect_company_norm     text generated always as (lower(prospect_company)) stored,
  prospect_city             text,
  prospect_email            text,
  prospect_phone            text,
  prospect_name             text,
  -- Send context
  niche                     text not null,                  -- e.g. "real-estate"
  niche_label               text,                           -- e.g. "Real Estate"
  channel                   text not null,                  -- 'dm' | 'email' | 'sms' | 'share' | 'link' | 'open'
  operator_id               text,                           -- nullable for v1; future multi-operator
  -- Lifecycle timestamps
  sent_at                   timestamptz not null default now(),
  opened_at                 timestamptz,
  booked_at                 timestamptz,
  -- Nurture state
  last_nurture_template     text,                           -- 'day3' | 'day7'
  last_nurture_at           timestamptz,
  nurture_stopped_reason    text,                           -- 'booked' | 'opted_out' | 'manual'
  -- Booking attribution (from Cal webhook)
  cal_booking_uid           text,
  cal_attendee_email        text,
  -- Misc
  meta                      jsonb default '{}'::jsonb
);

-- For "find recent sends per prospect" + nurture queries
create index if not exists template_sends_company_norm_idx
  on public.template_sends (prospect_company_norm, sent_at desc);
create index if not exists template_sends_niche_idx
  on public.template_sends (niche, sent_at desc);
-- For nurture cron: "sends in Day-3 / Day-7 window, no booking, no nurture yet"
create index if not exists template_sends_nurture_idx
  on public.template_sends (sent_at)
  where booked_at is null and nurture_stopped_reason is null;
-- For Cal webhook match-back: most-recent send per email
create index if not exists template_sends_email_idx
  on public.template_sends (prospect_email)
  where prospect_email is not null;

-- RLS: lock to service-role only. The /admin/templates dashboard hits this
-- via a server-side admin API (`/api/admin/template-activity`) which holds
-- the service key — clients never touch this table directly.
alter table public.template_sends enable row level security;
drop policy if exists template_sends_service_role_all on public.template_sends;
create policy template_sends_service_role_all on public.template_sends
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
