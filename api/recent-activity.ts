// api/recent-activity.ts — Vercel edge function. Public (no auth) feed of
// the last few activities with PII stripped. Used by the LiveActivity pill
// at the bottom of every page so real activity (when there is any) shows
// up; falls back to plausible synthetic items so the ticker is never empty.

import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { getLeads } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

const SYNTHETIC = [
  { who: "Sarah",  what: "owner of an HVAC company",        where: "Tampa, FL",        action: "downloaded the State of AI Ops report" },
  { who: "Marcus", what: "managing partner at a law firm",   where: "Austin, TX",       action: "booked a 30-min build call" },
  { who: "Priya",  what: "broker at a real-estate group",    where: "Phoenix, AZ",      action: "started a 7-day trial" },
  { who: "Daniel", what: "founder of a Series-A SaaS",       where: "San Francisco, CA",action: "ran the cost estimator" },
  { who: "Jess",   what: "practice manager at a dental group", where: "Denver, CO",     action: "booked a discovery call" },
];

const CITY_BY_DOMAIN: Record<string, string> = {
  "gmail.com":  "Austin, TX",
  "outlook.com":"Boston, MA",
  "yahoo.com":  "Phoenix, AZ",
};

function humanize(source: string, masked: string): { action: string; where: string } {
  const dom = masked.split("@")[1] || "";
  const where = CITY_BY_DOMAIN[dom] || "Tampa, FL";
  if (source.startsWith("report-")) return { action: "downloaded the State of AI Ops report", where };
  if (source.startsWith("tool:") || source.startsWith("demo:")) return { action: "tried a live demo", where };
  if (source.startsWith("newsletter")) return { action: "subscribed to the newsletter", where };
  if (source === "buyers-guide") return { action: "downloaded the buyers guide", where };
  if (source === "pathway-router") return { action: "started a session", where };
  if (source === "demo-request") return { action: "requested a demo", where };
  if (source === "contact") return { action: "started a discovery thread", where };
  return { action: "completed an activity", where };
}

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "GET") return json({ ok: false, error: "method" }, 405, cors.headers);

  // v55a: 120/IP/hour — public ticker feed.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`ract:${ip}`, { limit: 120, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const real = getLeads(50).slice(0, 5).map((l) => {
    const { action, where } = humanize(l.source, l.emailHash);
    return {
      who: l.emailHash.split("@")[0]?.slice(0, 2).toUpperCase() || "??",
      what: "",
      where,
      action,
      ago: timeAgo(l.ts),
    };
  });

  const items = real.length
    ? real
    : SYNTHETIC.map((s, i) => ({ ...s, ago: ["just now", "2 min ago", "8 min ago", "21 min ago", "1 hr ago"][i] }));

  return json({ ok: true, items, source: real.length ? "live" : "synthetic" }, 200, {
    ...cors.headers,
    "cache-control": "public, max-age=30, s-maxage=30",
  });
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
