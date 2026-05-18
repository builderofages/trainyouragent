// api/recent-activity.ts — Vercel edge function. Public (no auth) feed of
// recent activity with PII stripped. Used by the LiveActivity pill and by
// /live to render a real-time stream of up to 50 events.
//
// v60 HONESTY FIX:
//   - Removed all synthetic / "plausible sample" fillers.
//   - Returns ONLY real events drawn from the lead store.
//   - When the funnel is quiet, returns an empty array with a `note` field
//     so the client can render an honest empty state.
//   - Only events within the last hour are returned (the old "live" stream
//     was rendering anything in the ring buffer, sometimes hours old).
//
// Same contract as before: GET → { ok, items: [...], source, note? }

import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { getLeads } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

const MAX_ITEMS = 50;
const WINDOW_MS = 60 * 60 * 1000; // last hour only

// Tool / source → human action string. NEVER fabricates an industry, name,
// or location — only the type of action is humanized. The masked email
// initials and the source are the only real per-event signals we surface.
function humanize(source: string): string {
  if (source.startsWith("report-")) return "downloaded the State of AI Ops report";
  if (source === "tool:website-audit") return "ran the AI website audit";
  if (source === "tool:agent-builder") return "built a personalized agent demo";
  if (source === "tool:cost-estimator") return "ran the cost estimator";
  if (source === "tool:roi-calculator" || source === "tool:automation-roi" || source === "roi-calc") return "ran the ROI calculator";
  if (source === "tool:prompt-critic") return "graded a prompt";
  if (source === "tool:scenario-generator") return "generated automation scenarios";
  if (source === "tool:latency-simulator") return "ran the latency simulator";
  if (source === "tool:prompt-library") return "browsed the prompt library";
  if (source === "tool:model-selector") return "ran the LLM model selector";
  if (source === "tool:vendor-matrix") return "compared AI vendors";
  if (source.startsWith("tool:")) return "used a free tool";
  if (source.startsWith("demo:")) return "tried a live demo";
  if (source.startsWith("lead-magnet-")) return "downloaded a playbook PDF";
  if (source.startsWith("newsletter")) return "subscribed to the newsletter";
  if (source === "buyers-guide") return "downloaded the buyers guide";
  if (source === "pathway-router") return "started a session";
  if (source === "demo-request") return "requested a demo";
  if (source === "contact" || source === "contact-form") return "started a discovery thread";
  if (source === "founding-customer-apply") return "applied for a founding-customer slot";
  if (source === "founder-log-subscribe") return "subscribed to the founder log";
  if (source === "trial-request") return "started a 7-day trial";
  return "completed an activity";
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

  const cutoff = Date.now() - WINDOW_MS;
  const real = getLeads(MAX_ITEMS)
    .filter((l) => l.ts >= cutoff)
    .slice(0, MAX_ITEMS)
    .map((l) => ({
      // 2-char initial from the masked email local part — never the full name.
      who: l.emailHash.split("@")[0]?.slice(0, 2).toUpperCase() || "??",
      what: "",
      where: "",
      action: humanize(l.source),
      ago: timeAgo(l.ts),
      source: l.source,
    }));

  if (real.length === 0) {
    return json(
      {
        ok: true,
        items: [],
        source: "live",
        note: "No recent activity in the last hour.",
      },
      200,
      {
        ...cors.headers,
        "cache-control": "public, max-age=8, s-maxage=8",
      },
    );
  }

  return json(
    {
      ok: true,
      items: real,
      source: "live",
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
