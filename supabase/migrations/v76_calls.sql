-- supabase/migrations/v76_calls.sql
-- v76-c: tya_calls — log of every inbound voice call handled by Twilio +
-- ConversationRelay. Written by api/twilio/status-callback.ts when Twilio
-- fires the call-completed webhook. Used by the customer portal (v77) to
-- surface per-customer call history + transcripts + outcomes.

create table if not exists public.tya_calls (
  id                uuid        primary key default gen_random_uuid(),
  customer_id       uuid,
  twilio_call_sid   text        not null unique,
  caller_phone      text,
  to_phone          text,
  duration_sec      integer,
  transcript_text   text,
  outcome           text,       -- 'booked' | 'qualified' | 'escalated' | 'voicemail' | 'spam' | 'unknown'
  recording_url     text,
  ai_summary        text,
  cost_cents        integer,
  meta              jsonb,      -- raw Twilio status payload + relay metadata
  created_at        timestamptz not null default now()
);

comment on table public.tya_calls is
  'v76-c. One row per inbound voice call handled by the Twilio ConversationRelay bridge. Written by api/twilio/status-callback.ts on the Twilio status webhook.';

create index if not exists tya_calls_customer_id_idx on public.tya_calls(customer_id);
create index if not exists tya_calls_created_at_idx  on public.tya_calls(created_at desc);
create index if not exists tya_calls_outcome_idx     on public.tya_calls(outcome);
create index if not exists tya_calls_caller_idx      on public.tya_calls(caller_phone);
