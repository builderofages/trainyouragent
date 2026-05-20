-- v76-a: customer portal — `tya_customers` table + RLS
-- Spec: passwordless magic-link auth (Supabase), customers see only their own row.
-- One row per paying customer; agent_status drives the training pipeline UI.

create table if not exists tya_customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  stripe_customer_id text,
  subscription_tier text check (subscription_tier in ('saas-agent-builder', 'voice-receptionist', 'custom-build', 'hire-operator')),
  subscription_status text check (subscription_status in ('trial', 'active', 'past_due', 'canceled')) default 'trial',
  agent_status text check (agent_status in ('intake', 'discovery', 'knowledge-base', 'fine-tune', 'eval', 'production')) default 'intake',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  business_name text,
  business_phone text,
  twilio_number text,
  notes text
);

alter table tya_customers enable row level security;

-- Customers can read their own row (matched by auth JWT email claim).
drop policy if exists "Customers see their own row" on tya_customers;
create policy "Customers see their own row" on tya_customers
  for select using (auth.jwt() ->> 'email' = email);

-- Customers can update a subset of their own fields. Server-side `api/portal/update.ts`
-- additionally whitelists writable columns so subscription/billing fields stay read-only here.
drop policy if exists "Customers update their own row" on tya_customers;
create policy "Customers update their own row" on tya_customers
  for update using (auth.jwt() ->> 'email' = email);

-- Updated-at trigger
create or replace function tya_customers_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tya_customers_touch on tya_customers;
create trigger trg_tya_customers_touch
  before update on tya_customers
  for each row execute function tya_customers_touch_updated_at();

-- ---------------------------------------------------------------------------
-- Support tickets (used by /portal/support form)
-- ---------------------------------------------------------------------------
create table if not exists tya_support_tickets (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  subject text not null,
  description text not null,
  priority text check (priority in ('low', 'normal', 'high', 'urgent')) default 'normal',
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  created_at timestamptz default now()
);

alter table tya_support_tickets enable row level security;
drop policy if exists "Customers see their own tickets" on tya_support_tickets;
create policy "Customers see their own tickets" on tya_support_tickets
  for select using (auth.jwt() ->> 'email' = customer_email);

drop policy if exists "Customers create their own tickets" on tya_support_tickets;
create policy "Customers create their own tickets" on tya_support_tickets
  for insert with check (auth.jwt() ->> 'email' = customer_email);

-- ---------------------------------------------------------------------------
-- Storage bucket for customer knowledge-base uploads
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('customer-knowledge', 'customer-knowledge', false)
on conflict (id) do nothing;
