// api/_lib/lead-store.ts
// Ephemeral in-memory lead store. On Vercel edge each isolate keeps its own
// copy — fine for v41 (we'll swap in Supabase in v42). Pinned to globalThis
// so HMR / module-reload doesn't wipe it within an isolate's lifetime.

export type LeadRecord = {
  ts: number;            // ms epoch
  source: string;
  emailHash: string;     // masked: first 2 chars + *** + domain
  path?: string;
  ip?: string;           // truncated /24 for IPv4 — privacy nicety
};

type Store = {
  leads: LeadRecord[];           // newest-first, capped at 500
  visitorPings: number[];        // ms epochs
  routerCompleted: number[];     // ms epochs
  bookings: number[];            // ms epochs
  purchases: { ts: number; amount: number }[];
};

const g = globalThis as any;
if (!g.__tya_lead_store__) {
  g.__tya_lead_store__ = {
    leads: [],
    visitorPings: [],
    routerCompleted: [],
    bookings: [],
    purchases: [],
  } as Store;
}
const store: Store = g.__tya_lead_store__;

const MAX_LEADS = 500;
const MAX_EVENTS = 5000;

export function maskEmail(email: string): string {
  if (!email || typeof email !== "string") return "***";
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const head = local.slice(0, 2);
  return `${head}***@${domain}`;
}

export function recordLead(input: {
  email: string;
  source: string;
  path?: string;
  ip?: string;
}): void {
  const rec: LeadRecord = {
    ts: Date.now(),
    source: input.source,
    emailHash: maskEmail(input.email),
    path: input.path,
    ip: input.ip ? truncateIp(input.ip) : undefined,
  };
  store.leads.unshift(rec);
  if (store.leads.length > MAX_LEADS) store.leads.length = MAX_LEADS;
}

export function recordEvent(kind: "visit" | "router" | "booking"): void {
  const now = Date.now();
  const list =
    kind === "visit"   ? store.visitorPings   :
    kind === "router"  ? store.routerCompleted :
                         store.bookings;
  list.push(now);
  if (list.length > MAX_EVENTS) list.splice(0, list.length - MAX_EVENTS);
}

export function recordPurchase(amount: number): void {
  store.purchases.push({ ts: Date.now(), amount });
  if (store.purchases.length > MAX_EVENTS) {
    store.purchases.splice(0, store.purchases.length - MAX_EVENTS);
  }
}

export function getLeads(limit = 100): LeadRecord[] {
  return store.leads.slice(0, limit);
}

function withinMs(arr: number[], ms: number): number {
  const cutoff = Date.now() - ms;
  let n = 0;
  for (const t of arr) if (t >= cutoff) n++;
  return n;
}

export function getMetrics() {
  const DAY = 24 * 60 * 60 * 1000;
  const leadsTs = store.leads.map((l) => l.ts);
  const leads24h = withinMs(leadsTs, DAY);
  const leads7d  = withinMs(leadsTs, 7 * DAY);
  const leads30d = withinMs(leadsTs, 30 * DAY);

  const bookings24h = withinMs(store.bookings, DAY);
  const bookings7d  = withinMs(store.bookings, 7 * DAY);
  const bookings30d = withinMs(store.bookings, 30 * DAY);

  const purchases30d = store.purchases.filter((p) => p.ts >= Date.now() - 30 * DAY);
  const revenue30d   = purchases30d.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  // crude MRR estimate: assume 30d revenue ~ monthly recurring
  const mrrEstimate  = revenue30d;

  return {
    leads:    { "24h": leads24h, "7d": leads7d, "30d": leads30d },
    bookings: { "24h": bookings24h, "7d": bookings7d, "30d": bookings30d },
    purchases:{ "30d": purchases30d.length },
    revenue:  { "30d": revenue30d, mrrEstimate },
    storeSize: { leads: store.leads.length, events: store.visitorPings.length },
    generatedAt: new Date().toISOString(),
  };
}

export function getFunnel() {
  const DAY = 24 * 60 * 60 * 1000;
  const visit  = withinMs(store.visitorPings, 7 * DAY);
  const router = withinMs(store.routerCompleted, 7 * DAY);
  const cutoff = Date.now() - 7 * DAY;
  const email  = store.leads.filter((l) => l.ts >= cutoff).length;
  const book   = withinMs(store.bookings, 7 * DAY);
  const purch  = store.purchases.filter((p) => p.ts >= cutoff).length;

  // by-source — last 30d
  const cutoff30 = Date.now() - 30 * DAY;
  const bySource: Record<string, number> = {};
  for (const l of store.leads) {
    if (l.ts < cutoff30) continue;
    bySource[l.source] = (bySource[l.source] || 0) + 1;
  }

  const rate = (a: number, b: number) =>
    b === 0 ? 0 : Math.round((a / b) * 1000) / 10; // 1 dp

  return {
    stages: {
      visit, router, email, book, purchase: purch,
    },
    conversion: {
      visit_to_router:    rate(router, visit),
      router_to_email:    rate(email, router),
      email_to_book:      rate(book, email),
      book_to_purchase:   rate(purch, book),
      visit_to_purchase:  rate(purch, visit),
    },
    bySource,
    generatedAt: new Date().toISOString(),
  };
}

function truncateIp(ip: string): string {
  // IPv4: drop last octet. IPv6: keep first 4 hextets.
  if (!ip) return "";
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::";
  const parts = ip.split(".");
  if (parts.length === 4) return parts.slice(0, 3).join(".") + ".0";
  return "";
}
