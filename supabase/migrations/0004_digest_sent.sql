-- supabase/migrations/0004_digest_sent.sql
-- v57a: track Friday digest sends per recipient/week so the cron is idempotent.
-- If the cron retries (Vercel does this), we won't double-send the digest.

create table if not exists public.tya_digest_sent (
  id          bigserial primary key,
  week_end    date        not null,         -- YYYY-MM-DD, the Friday of the digest
  email       text        not null,
  recipients  integer,                       -- total fan-out for that run
  commits     integer,                       -- shipped-this-week count for that run
  posts       integer,                       -- new posts count for that run
  status      text        not null default 'sent',
  error       text,
  created_at  timestamptz not null default now()
);

create unique index if not exists tya_digest_sent_week_email_idx
  on public.tya_digest_sent (week_end, email);

create index if not exists tya_digest_sent_week_idx
  on public.tya_digest_sent (week_end);

alter table public.tya_digest_sent enable row level security;
-- No policies => default deny for anon/authenticated. Service role bypasses RLS.
