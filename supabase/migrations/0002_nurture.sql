-- supabase/migrations/0002_nurture.sql
-- v52a: dedupe table for the 5-touch nurture sequence (api/nurture-tick.ts).
-- One row per (lead, touch_day). UNIQUE constraint guarantees we never send
-- the same touch twice if the cron retries or runs twice in a window.
--
-- NOTE on table name: production uses `public.tya_leads` (renamed from the
-- 0001_init.sql `public.leads`). If your DB still has the old name, run:
--   alter table public.leads rename to tya_leads;
-- before applying this migration.

create table if not exists public.tya_nurture_sent (
  id          uuid primary key default gen_random_uuid(),
  lead_id     bigint not null,
  email       text   not null,
  touch_day   int    not null,
  sent_at     timestamptz not null default now(),
  unique(lead_id, touch_day)
);

-- Best-effort FK — silently skip if tya_leads doesn't exist yet so this
-- migration can run before the rename happens.
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'tya_leads') then
    if not exists (select 1 from pg_constraint where conname = 'tya_nurture_sent_lead_id_fkey') then
      alter table public.tya_nurture_sent
        add constraint tya_nurture_sent_lead_id_fkey
        foreign key (lead_id) references public.tya_leads(id) on delete cascade;
    end if;
  end if;
end $$;

create index if not exists tya_nurture_sent_email_idx     on public.tya_nurture_sent(email);
create index if not exists tya_nurture_sent_touch_day_idx on public.tya_nurture_sent(touch_day);
create index if not exists tya_nurture_sent_sent_at_idx   on public.tya_nurture_sent(sent_at desc);

comment on table public.tya_nurture_sent is
  '/api/nurture-tick dedupe ledger. (lead_id, touch_day) unique. Cascade-deletes when a lead row is removed.';
