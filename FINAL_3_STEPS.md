# Final 3 founder-only steps — 90 seconds total

What I did in this session vs. what's left:

## ✅ I shipped (no action needed)
- **v222** — 6 visual bugs killed on /template/[niche] (founder photo, before/after, integrations, neighbors, DAY 2 wrap, sticky nav contrast). Verified live on /template/hvac.
- **v223** — `/websites` SEO gallery + 25 `/template/*` URLs added to sitemap.xml, nav (Resources dropdown, NEW badge), footer Product column. Crawlers can now discover all 26 net-new high-intent landing pages.
- **v225** — Vercel envs: `SENDER_LEGAL_NAME=TrainYourAgent` and `SENDER_POSTAL_ADDRESS=TrainYourAgent, Los Angeles, CA (update before bulk send)` written to production via Vercel REST API. Confirmed via GET /env: 23→25 keys.

## ⚠️ Update the address placeholder
The `SENDER_POSTAL_ADDRESS` I set is a placeholder. CAN-SPAM requires a real physical address on commercial email. Before you fire any bulk email, replace with your real PO Box or business address:

→ https://vercel.com/builderofages/trainyouragent/settings/environment-variables
→ Edit `SENDER_POSTAL_ADDRESS` → put your real address → Save → redeploy.

## Step 1 — Run Supabase migrations v192 + v198

Open your Supabase SQL editor: https://supabase.com/dashboard/projects → click your TYA project → SQL Editor → New query.

**Paste this — RUN once:**

```sql
-- v192: niche-template close-tool prospect tracking + nurture state
create extension if not exists "pgcrypto";
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
  meta                      jsonb default '{}'::jsonb
);
create index if not exists template_sends_company_norm_idx on public.template_sends (prospect_company_norm, sent_at desc);
create index if not exists template_sends_niche_idx on public.template_sends (niche, sent_at desc);
create index if not exists template_sends_nurture_idx on public.template_sends (sent_at) where booked_at is null and nurture_stopped_reason is null;
create index if not exists template_sends_email_idx on public.template_sends (prospect_email) where prospect_email is not null;
alter table public.template_sends enable row level security;
drop policy if exists template_sends_service_role_all on public.template_sends;
create policy template_sends_service_role_all on public.template_sends for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
```

**Then paste this — RUN once:**

```sql
-- v198: TYA AUTOPILOT lead-sourcing infrastructure
create extension if not exists "pgcrypto";
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
alter table public.template_sends add column if not exists first_touch_sent_at timestamptz;
alter table public.sourcing_rules    enable row level security;
alter table public.sourced_prospects enable row level security;
drop policy if exists sourcing_rules_svc on public.sourcing_rules;
drop policy if exists sourced_prospects_svc on public.sourced_prospects;
create policy sourcing_rules_svc    on public.sourcing_rules    for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy sourced_prospects_svc on public.sourced_prospects for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
```

## Step 2 — Activate first sourcing rule (60 seconds)

After migrations are run, visit https://trainyouragent.com/admin/setup (use your ADMIN_TOKEN to sign in if prompted), pick your first niche + city, and click Activate. The cron at `0 14 * * *` will then start auto-sourcing prospects every day.

## Step 3 (optional, only if you want Google Places quality > OSM)

Set `GOOGLE_PLACES_API_KEY` in Vercel envs. Without it, autopilot falls back to OpenStreetMap Overpass (free, no key required) — it works, just lower coverage than Google.

---

**Why I couldn't do steps 1–2 autonomously:** Supabase Studio is a React SPA whose hydration model blocks the Chrome extension's content-script injection, and Supabase's public REST API doesn't accept raw SQL without either the separate Management API token or the DB password (neither is in your `SUPABASE_SERVICE_KEY`). The site code itself is shipped and waiting on these tables to exist.
