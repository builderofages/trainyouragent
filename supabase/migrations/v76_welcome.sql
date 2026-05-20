-- supabase/migrations/v76_welcome.sql
-- v76-c: tya_welcome_sent — dedupe ledger for the 5-touch paid-customer
-- welcome flow (api/cron/welcome-flow.ts). One row per (customer, template).
-- UNIQUE constraint guarantees we never send the same template twice if the
-- cron retries or runs twice in a window. Mirrors the v52a pattern used by
-- tya_nurture_sent for the unpaid-lead nurture sequence.
--
-- Expects public.tya_customers to exist (created by the Stripe webhook flow).

create table if not exists public.tya_welcome_sent (
  id            uuid        primary key default gen_random_uuid(),
  customer_id   uuid        not null,
  email         text        not null,
  template      text        not null,   -- 'welcome' | 'discovery-reminder' | 'kb-nudge' | 'eval-schedule' | 'launch-checklist'
  sent_at       timestamptz not null default now(),
  unique(customer_id, template)
);

comment on table public.tya_welcome_sent is
  'v76-c. /api/cron/welcome-flow dedupe ledger. (customer_id, template) unique. One row per paid-signup welcome touch successfully sent via Resend.';

create index if not exists tya_welcome_sent_email_idx     on public.tya_welcome_sent(email);
create index if not exists tya_welcome_sent_template_idx  on public.tya_welcome_sent(template);
create index if not exists tya_welcome_sent_sent_at_idx   on public.tya_welcome_sent(sent_at desc);
create index if not exists tya_welcome_sent_customer_idx  on public.tya_welcome_sent(customer_id);

-- Best-effort FK — silently skip if tya_customers doesn't exist yet so this
-- migration can run before the customers table is created.
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'tya_customers') then
    if not exists (select 1 from pg_constraint where conname = 'tya_welcome_sent_customer_id_fkey') then
      alter table public.tya_welcome_sent
        add constraint tya_welcome_sent_customer_id_fkey
        foreign key (customer_id) references public.tya_customers(id) on delete cascade;
    end if;
  end if;
end $$;

-- Companion intake table (v76-c) — stores the 4-step discovery questionnaire
-- submitted at /train/intake. Written by api/intake.ts.
create table if not exists public.tya_intake (
  id                    uuid        primary key default gen_random_uuid(),
  email                 text        not null,
  business_name         text,
  industry              text,
  employee_count        text,
  monthly_call_volume   text,
  avg_ticket_size       text,
  primary_pain          text,
  current_call_handling text,
  common_questions      jsonb,      -- array of strings
  avg_call_duration     text,
  booking_rate          text,
  services              jsonb,      -- array of {name, price}
  business_hours        text,
  service_area_zips     text,
  payment_methods       jsonb,      -- array of strings
  scheduling_system     text,
  uploaded_files        jsonb,      -- array of {name, size, type}
  source                text        default 'train-intake',
  payload               jsonb,
  created_at            timestamptz not null default now()
);

comment on table public.tya_intake is
  'v76-c. Discovery questionnaire submissions from /train/intake. Written by api/intake.ts. Triggers a Resend notification to Alexander on every insert.';

create index if not exists tya_intake_email_idx      on public.tya_intake(email);
create index if not exists tya_intake_created_at_idx on public.tya_intake(created_at desc);
create index if not exists tya_intake_industry_idx   on public.tya_intake(industry);
