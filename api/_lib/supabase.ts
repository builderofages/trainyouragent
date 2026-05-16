// api/_lib/supabase.ts
// v42: typed Supabase client used by the lead store. Falls back to a `null`
// client when env vars are unset so the build (and local dev without keys)
// keeps working. Callers must check `getSupabase()` and gracefully degrade.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

let _client: SupabaseClient | null | undefined;

/** Lazily build a service-role client. Returns null if env is not configured. */
export function getSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client;
  if (!URL || !SERVICE_KEY) {
    _client = null;
    return null;
  }
  try {
    _client = createClient(URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-tya-source": "api-edge" } },
    });
  } catch {
    _client = null;
  }
  return _client;
}

export function supabaseConfigured(): boolean {
  return !!(URL && SERVICE_KEY);
}

// --- Schema typing ---------------------------------------------------------

export type LeadRow = {
  id?: number;
  email: string;        // stored masked
  source: string;
  payload: Record<string, unknown> | null;
  path: string | null;
  ip: string | null;    // truncated /24 already
  created_at?: string;
};

export type EventRow = {
  id?: number;
  event_type: string;   // 'site_visit' | 'router_view' | 'router_lane_chosen' | 'router_email_gate' | 'booking_created' | 'purchase_completed' | ...
  source: string | null;
  meta: Record<string, unknown> | null;
  amount_cents: number | null; // populated for purchase events; null otherwise
  created_at?: string;
};
