// src/lib/portal.ts
// v76-a: Shared portal helpers — typed customer row + authed fetch wrapper
// that injects the current Supabase access token into Authorization.

import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier =
  | "saas-agent-builder"
  | "voice-receptionist"
  | "custom-build"
  | "hire-operator";

export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";

export type AgentStatus =
  | "intake"
  | "discovery"
  | "knowledge-base"
  | "fine-tune"
  | "eval"
  | "production";

export type Customer = {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier | null;
  subscription_status: SubscriptionStatus | null;
  agent_status: AgentStatus | null;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  business_phone: string | null;
  twilio_number: string | null;
  notes: string | null;
};

export const AGENT_STAGES: { key: AgentStatus; label: string; blurb: string }[] = [
  { key: "discovery", label: "Discovery", blurb: "We map your workflow, edge cases, and brand voice on a 60-minute call." },
  { key: "knowledge-base", label: "Knowledge base", blurb: "We ingest your SOPs, scripts, and FAQs into a vector store the agent retrieves from." },
  { key: "fine-tune", label: "Fine-tune", blurb: "We train an evaluator + tune retrieval + prompt the agent on your top 50 real conversations." },
  { key: "eval", label: "Eval", blurb: "Side-by-side blind tests against your best human operator. We ship at >=90% match." },
  { key: "production", label: "Production", blurb: "Twilio number live, escalation rules active, you get the keys to this dashboard." },
];

export const TIER_LABEL: Record<SubscriptionTier, string> = {
  "saas-agent-builder": "Agent Builder (self-serve)",
  "voice-receptionist": "Voice Receptionist",
  "custom-build": "Custom Build",
  "hire-operator": "Hire an Operator",
};

export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function portalFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (init.body && !headers.has("content-type") && !(init.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }
  return fetch(path, { ...init, headers });
}

export async function fetchMe(): Promise<Customer | null> {
  const res = await portalFetch("/api/portal/me", { method: "GET" });
  if (!res.ok) return null;
  const j = (await res.json()) as { ok: boolean; customer: Customer | null };
  return j.customer;
}
