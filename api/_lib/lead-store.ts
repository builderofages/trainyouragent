// api/_lib/lead-store.ts
// v42: Supabase-backed lead + event store with an in-memory fallback so the
// site keeps working when env vars aren't provisioned (CI, local, first
// deploy before Supabase is wired). Public function signatures are preserved
// from v41 so admin endpoints don't need to change.

import { getSupabase, supabaseConfigured } from "./supabase.js";

// ---------- shared types ---------------------------------------------------

export type LeadRecord = {
  ts: number;            // ms epoch
  source: string;
  emailHash: string;     // masked: first 2 chars + *** + domain
  path?: string;
  ip?: string;           // truncated /24 for IPv4
};

// ---------- in-memory fallback --------------------------------------------

type MemStore = {
  leads: LeadRecord[];
  visitorPings: number[];
  routerCompleted: number[];
  bookings: number[];
  purchases: { ts: number; amount: number }[];
};

const g = globalThis as unknown as { __tya_lead_store__?: MemStore };
if (!g.__tya_lead_store__) {
  g.__tya_lead_store__ = {
    leads: [], visitorPings: [], routerCompleted: [], bookings: [], purchases: [],
  };
}
const mem: MemStore = g.__tya_lead_store__!;

const MAX_LEADS = 500;
const MAX_EVENTS = 5000;

// ---------- helpers --------------------------------------------------------

export function maskEmail(email: string): string {
  if (!email || typeof email !== "string") return "***";
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

function truncateIp(ip: string): string {
  if (!ip) return "";
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::";
  const parts = ip.split(".");
  if (parts.length === 4) return parts.slice(0, 3).join(".") + ".0";
  return "";
}

// ---------- writes ---------------------------------------------------------

export function recordLead(input: {
  email: string;
  source: string;
  path?: string;
  ip?: string;
  payload?: unknown;
}): void {
  const masked = maskEmail(input.email);
  const truncIp = input.ip ? truncateIp(input.ip) : undefined;
  const rec: LeadRecord = {
    ts: Date.now(),
    source: input.source,
    emailHash: masked,
    path: input.path,
    ip: truncIp,
  };
  // Always keep an in-memory copy for fast local reads / fallback.
  mem.leads.unshift(rec);
  if (mem.leads.length > MAX_LEADS) mem.leads.length = MAX_LEADS;

  // Best-effort persist to Supabase. Never block on it.
  const sb = getSupabase();
  if (sb) {
    void sb.from("tya_leads").insert({
      email: masked,
      source: input.source,
      payload: (input.payload as Record<string, unknown>) ?? null,
      path: input.path ?? null,
      ip: truncIp ?? null,
    }).then(({ error }) => {
      if (error) console.error("[lead-store] supabase insert failed", error.message);
    });
  }
}

export function recordEvent(
  kind: string,
  meta?: { source?: string; amount?: number; data?: Record<string, unknown> },
): void {
  const now = Date.now();
  // memory bookkeeping for the funnel charts that read the legacy shape
  if (kind === "site_visit" || kind === "visit") {
    mem.visitorPings.push(now);
    if (mem.visitorPings.length > MAX_EVENTS) mem.visitorPings.splice(0, mem.visitorPings.length - MAX_EVENTS);
  } else if (kind === "router_email_gate" || kind === "router") {
    mem.routerCompleted.push(now);
    if (mem.routerCompleted.length > MAX_EVENTS) mem.routerCompleted.splice(0, mem.routerCompleted.length - MAX_EVENTS);
  } else if (kind === "booking_created" || kind === "booking") {
    mem.bookings.push(now);
    if (mem.bookings.length > MAX_EVENTS) mem.bookings.splice(0, mem.bookings.length - MAX_EVENTS);
  } else if (kind === "purchase_completed") {
    mem.purchases.push({ ts: now, amount: meta?.amount ?? 0 });
    if (mem.purchases.length > MAX_EVENTS) mem.purchases.splice(0, mem.purchases.length - MAX_EVENTS);
  }

  const sb = getSupabase();
  if (sb) {
    void sb.from("tya_events").insert({
      event_type: kind,
      source: meta?.source ?? null,
      meta: meta?.data ?? null,
      amount_cents: typeof meta?.amount === "number" ? Math.round(meta.amount) : null,
    }).then(({ error }) => {
      if (error) console.error("[lead-store] supabase event insert failed", error.message);
    });
  }
}

export function recordPurchase(amount: number): void {
  recordEvent("purchase_completed", { amount });
}

// ---------- reads ----------------------------------------------------------

export function getLeads(limit = 100): LeadRecord[] {
  // Memory is always up-to-date for current isolate. The /api/admin/leads
  // route is best-effort; for the canonical list users should query
  // Supabase directly via SQL.
  return mem.leads.slice(0, limit);
}

// v58: async variant that unions the in-memory store with whatever the
// canonical Supabase tables hold. This is what the public-metrics endpoint
// now uses so reads don't go to zero just because the Vercel function
// isolate was cold and the in-memory ring was empty.
export async function getLeadsAsync(limit = 100): Promise<LeadRecord[]> {
  const sb = getSupabase();
  if (!sb) return mem.leads.slice(0, limit);
  try {
    const { data, error } = await sb
      .from("tya_leads")
      .select("created_at, source, email, path, ip")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return mem.leads.slice(0, limit);
    const sbRows: LeadRecord[] = (data as Array<{
      created_at: string; source: string; email: string; path: string | null; ip: string | null;
    }>).map(r => ({
      ts: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
      source: r.source ?? "unknown",
      emailHash: r.email ?? "***",
      path: r.path ?? undefined,
      ip: r.ip ?? undefined,
    }));
    // Union by (ts, source, emailHash) — dedupe Supabase + memory.
    const seen = new Set<string>();
    const merged: LeadRecord[] = [];
    for (const r of [...mem.leads, ...sbRows]) {
      const key = `${r.ts}|${r.source}|${r.emailHash}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(r);
    }
    merged.sort((a, b) => b.ts - a.ts);
    return merged.slice(0, limit);
  } catch {
    return mem.leads.slice(0, limit);
  }
}

// v58: async metrics that derive counts from the unioned lead set above so
// /api/public-metrics doesn't show zeros just because the function isolate
// is cold. Bookings/purchases still come from memory (event aggregation
// from Supabase will land in a future commit; this one closes the most
// visible gap).
export async function getMetricsAsync() {
  const DAY = 24 * 60 * 60 * 1000;
  const leads = await getLeadsAsync(500);
  const leadsTs = leads.map((l) => l.ts);
  const leads24h = withinMs(leadsTs, DAY);
  const leads7d  = withinMs(leadsTs, 7 * DAY);
  const leads30d = withinMs(leadsTs, 30 * DAY);

  const bookings24h = withinMs(mem.bookings, DAY);
  const bookings7d  = withinMs(mem.bookings, 7 * DAY);
  const bookings30d = withinMs(mem.bookings, 30 * DAY);

  const purchases30d = mem.purchases.filter((p) => p.ts >= Date.now() - 30 * DAY);
  const revenue30d   = purchases30d.reduce((a, b) => a + (Number(b.amount) || 0), 0);

  return {
    leads:    { "24h": leads24h, "7d": leads7d, "30d": leads30d },
    bookings: { "24h": bookings24h, "7d": bookings7d, "30d": bookings30d },
    purchases:{ "30d": purchases30d.length },
    revenue:  { "30d": revenue30d, mrrEstimate: revenue30d },
    storeSize: { leads: leads.length, events: mem.visitorPings.length },
    backend: supabaseConfigured() ? "supabase+memory" : "memory-only",
    generatedAt: new Date().toISOString(),
  };
}

function withinMs(arr: number[], ms: number): number {
  const cutoff = Date.now() - ms;
  let n = 0;
  for (const t of arr) if (t >= cutoff) n++;
  return n;
}

export function getMetrics() {
  const DAY = 24 * 60 * 60 * 1000;
  const leadsTs = mem.leads.map((l) => l.ts);
  const leads24h = withinMs(leadsTs, DAY);
  const leads7d  = withinMs(leadsTs, 7 * DAY);
  const leads30d = withinMs(leadsTs, 30 * DAY);

  const bookings24h = withinMs(mem.bookings, DAY);
  const bookings7d  = withinMs(mem.bookings, 7 * DAY);
  const bookings30d = withinMs(mem.bookings, 30 * DAY);

  const purchases30d = mem.purchases.filter((p) => p.ts >= Date.now() - 30 * DAY);
  const revenue30d   = purchases30d.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const mrrEstimate  = revenue30d;

  return {
    leads:    { "24h": leads24h, "7d": leads7d, "30d": leads30d },
    bookings: { "24h": bookings24h, "7d": bookings7d, "30d": bookings30d },
    purchases:{ "30d": purchases30d.length },
    revenue:  { "30d": revenue30d, mrrEstimate },
    storeSize: { leads: mem.leads.length, events: mem.visitorPings.length },
    backend: supabaseConfigured() ? "supabase+memory" : "memory-only",
    generatedAt: new Date().toISOString(),
  };
}

export function getFunnel() {
  const DAY = 24 * 60 * 60 * 1000;
  const visit  = withinMs(mem.visitorPings, 7 * DAY);
  const router = withinMs(mem.routerCompleted, 7 * DAY);
  const cutoff = Date.now() - 7 * DAY;
  const email  = mem.leads.filter((l) => l.ts >= cutoff).length;
  const book   = withinMs(mem.bookings, 7 * DAY);
  const purch  = mem.purchases.filter((p) => p.ts >= cutoff).length;

  const cutoff30 = Date.now() - 30 * DAY;
  const bySource: Record<string, number> = {};
  for (const l of mem.leads) {
    if (l.ts < cutoff30) continue;
    bySource[l.source] = (bySource[l.source] || 0) + 1;
  }

  const rate = (a: number, b: number) => b === 0 ? 0 : Math.round((a / b) * 1000) / 10;

  return {
    stages: { visit, router, email, book, purchase: purch },
    conversion: {
      visit_to_router:    rate(router, visit),
      router_to_email:    rate(email, router),
      email_to_book:      rate(book, email),
      book_to_purchase:   rate(purch, book),
      visit_to_purchase:  rate(purch, visit),
    },
    bySource,
    backend: supabaseConfigured() ? "supabase+memory" : "memory-only",
    generatedAt: new Date().toISOString(),
  };
}
