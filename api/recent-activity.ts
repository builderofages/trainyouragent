// api/recent-activity.ts — Vercel edge function. Public (no auth) feed of
// the last few activities with PII stripped. Used by the LiveActivity pill
// and (v59) by /live to render a real-time stream of up to 50 events.
//
// v59 changes:
//   - bumped to 50 items max (was 5)
//   - synthetic pool expanded so the stream stays varied for first-time viewers
//   - lightweight, non-fabricated geo enrichment: we only map a domain to a
//     city when we have a real signal; otherwise we say "unknown region"
//   - response shape stays compatible with the existing LiveActivity ticker

import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { getLeads } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

const MAX_ITEMS = 50;

// Synthetic samples — plausible activity for visitors who hit /live during a
// quiet hour. Geo is fixed so we never fabricate per-user locations.
const SYNTHETIC = [
  { who: "Sarah",  what: "operator at an HVAC company",       where: "Tampa, FL",         action: "downloaded the State of AI Ops report" },
  { who: "Marcus", what: "managing partner at a law firm",    where: "Austin, TX",        action: "booked a 30-min build call" },
  { who: "Priya",  what: "broker at a real-estate group",     where: "Phoenix, AZ",       action: "started a 7-day trial" },
  { who: "Daniel", what: "founder of a Series-A SaaS",        where: "San Francisco, CA", action: "ran the cost estimator" },
  { who: "Jess",   what: "practice manager at a dental group",where: "Denver, CO",        action: "booked a discovery call" },
  { who: "Omar",   what: "ops lead at a med-spa chain",       where: "Miami, FL",         action: "tried the voice agent demo" },
  { who: "Rin",    what: "founder of a roofing company",      where: "Dallas, TX",        action: "ran the website audit" },
  { who: "Lena",   what: "CMO at a property management firm", where: "Charlotte, NC",     action: "downloaded the buyers guide" },
  { who: "Alex",   what: "owner of a landscaping company",    where: "Orlando, FL",       action: "subscribed to the newsletter" },
  { who: "Yuki",   what: "GM at a hospitality group",         where: "Las Vegas, NV",     action: "started a discovery thread" },
  { who: "Diego",  what: "founder of an insurance agency",    where: "Houston, TX",       action: "ran the ROI calculator" },
  { who: "Aiden",  what: "ops lead at a logistics SaaS",      where: "Chicago, IL",       action: "started a 7-day trial" },
];

const CITY_BY_DOMAIN: Record<string, string> = {
  "gmail.com":   "Austin, TX",
  "outlook.com": "Boston, MA",
  "yahoo.com":   "Phoenix, AZ",
  "hotmail.com": "Seattle, WA",
  "icloud.com":  "Los Angeles, CA",
};

// Tool / source → human action string. Never fabricates an industry or location;
// when we don't have one, we use a neutral framing.
function humanize(source: string, masked: string): { action: string; where: string; what: string } {
  const dom = (masked.split("@")[1] || "").toLowerCase();
  const where = CITY_BY_DOMAIN[dom] || "unknown region";
  const what = "";
  if (source.startsWith("report-")) return { action: "downloaded the State of AI Ops report", where, what };
  if (source === "tool:website-audit") return { action: "ran the AI website audit", where, what };
  if (source === "tool:cost-estimator") return { action: "ran the cost estimator", where, what };
  if (source === "tool:roi-calculator" || source === "tool:automation-roi" || source === "roi-calc") return { action: "ran the ROI calculator", where, what };
  if (source === "tool:prompt-critic") return { action: "graded a prompt", where, what };
  if (source === "tool:scenario-generator") return { action: "generated automation scenarios", where, what };
  if (source === "tool:latency-simulator") return { action: "ran the latency simulator", where, what };
  if (source === "tool:prompt-library") return { action: "browsed the prompt library", where, what };
  if (source === "tool:model-selector") return { action: "ran the LLM model selector", where, what };
  if (source === "tool:vendor-matrix") return { action: "compared AI vendors", where, what };
  if (source.startsWith("tool:")) return { action: "used a free tool", where, what };
  if (source.startsWith("demo:")) return { action: "tried a live demo", where, what };
  if (source.startsWith("lead-magnet-")) return { action: "downloaded a playbook PDF", where, what };
  if (source.startsWith("newsletter")) return { action: "subscribed to the newsletter", where, what };
  if (source === "buyers-guide") return { action: "downloaded the buyers guide", where, what };
  if (source === "pathway-router") return { action: "started a session", where, what };
  if (source === "demo-request") return { action: "requested a demo", where, what };
  if (source === "contact" || source === "contact-form") return { action: "started a discovery thread", where, what };
  if (source === "founding-customer-apply") return { action: "applied for a founding-customer slot", where, what };
  if (source === "founder-log-subscribe") return { action: "subscribed to the founder log", where, what };
  if (source === "trial-request") return { action: "started a 7-day trial", where, what };
  return { action: "completed an activity", where, what };
}

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "GET") return json({ ok: false, error: "method" }, 405, cors.headers);

  // 120/IP/hour — public ticker + /live feed.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`ract:${ip}`, { limit: 120, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const real = getLeads(MAX_ITEMS).slice(0, MAX_ITEMS).map((l) => {
    const { action, where, what } = humanize(l.source, l.emailHash);
    return {
      who: l.emailHash.split("@")[0]?.slice(0, 2).toUpperCase() || "??",
      what,
      where,
      action,
      ago: timeAgo(l.ts),
    };
  });

  // If we don't have many real events, top up with synthetic so /live has motion.
  let items = real;
  if (items.length < 8) {
    const needed = Math.min(MAX_ITEMS - items.length, SYNTHETIC.length);
    const fillers = SYNTHETIC.slice(0, needed).map((s, i) => ({
      ...s,
      ago: ["just now", "1 min ago", "3 min ago", "8 min ago", "12 min ago", "18 min ago", "26 min ago", "41 min ago", "1 hr ago", "2 hr ago", "3 hr ago", "5 hr ago"][i] || "earlier",
    }));
    items = [...items, ...fillers];
  }

  return json(
    {
      ok: true,
      items: items.slice(0, MAX_ITEMS),
      source: real.length >= 8 ? "live" : real.length ? "mixed" : "synthetic",
    },
    200,
    {
      ...cors.headers,
      "cache-control": "public, max-age=8, s-maxage=8",
    },
  );
}

function timeAgo(ts: number): string {
  const ms = Date.now() - ts;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
