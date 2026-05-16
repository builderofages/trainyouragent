// api/booking-abandoned.ts — Vercel edge function. Abandoned-booking recovery.
//
// Called when a visitor opens the Cal.com embed but closes without confirming,
// OR (browser beforeunload) when they had a time selected but didn't finish.
// We tag the lead in beehiiv with "abandoned-booking-{vertical}", queue a
// 30-min-delay nudge email via Resend, and log the drop to Slack.
//
// Resend doesn't expose a native delay parameter for transactional sends, so
// we use the `scheduled_at` parameter (now supported on the v2 API). If the
// account isn't on a tier that supports scheduling, the send still fires
// immediately — which is the safer fallback for a recovery flow.
//
// REQUIRES env: BEEHIIV_API_KEY, BEEHIIV_PUB_ID, RESEND_API_KEY, SLACK_WEBHOOK_URL
// Optional env: LEAD_NOTIFY_FROM (default leads@trainyouragent.com)
//
// Hardening:
//   - CORS allowlist (called from our own pages only)
//   - Rate limit (10 / IP / hour — abandoners come back, but not 100x/hour)
//   - Body size cap
//   - Email validation
//   - Vertical + dropoffStep allowlists so the beehiiv tag can't be polluted

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const BEEHIIV_KEY = process.env.BEEHIIV_API_KEY || "";
const BEEHIIV_PUB = process.env.BEEHIIV_PUB_ID || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const SLACK_URL = process.env.SLACK_WEBHOOK_URL || "";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "leads@trainyouragent.com";

const KICKOFF_LINK = "https://cal.com/trainyouragent/30min";
const MAX_BODY_BYTES = 4 * 1024;
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const NUDGE_DELAY_MS = 30 * 60 * 1000; // 30 minutes

const ALLOWED_VERTICALS = new Set([
  "general", "healthcare", "legal", "real-estate", "hvac", "roofing",
  "solar", "accounting", "automotive", "spas", "hotels", "bars-nightclubs",
  "logistics", "gym", "fitness",
]);

const ALLOWED_STEPS = new Set([
  "opened", "picked-time", "filled-form", "unknown",
]);

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`abandon:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: { email?: string; vertical?: string; dropoffStep?: string };
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad-json" }, 400, cors.headers); }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: "bad-email" }, 400, cors.headers);
  }

  const vertical = ALLOWED_VERTICALS.has(body.vertical || "") ? body.vertical! : "general";
  const step = ALLOWED_STEPS.has(body.dropoffStep || "") ? body.dropoffStep! : "unknown";
  const tag = `abandoned-booking-${vertical}`;

  const tasks: Promise<unknown>[] = [];

  if (BEEHIIV_KEY && BEEHIIV_PUB) {
    tasks.push(fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEEHIIV_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        tags: [tag],
      }),
    }));
  }

  if (RESEND_KEY) {
    const scheduledAt = new Date(Date.now() + NUDGE_DELAY_MS).toISOString();
    // v42: soft re-engage. Lead with the report (no commitment), then offer
    // the call as the secondary CTA. Drops the "you didn't finish" framing
    // because it tested badly — too guilt-inducing.
    const subject = "Sending you the State of AI Ops 2026 report";
    const text = [
      "Hey,",
      "",
      "Saw you were looking around earlier — figured I'd send something more",
      "useful than a 'did you forget?' nudge. Our 30-page State of AI",
      "Operations 2026 report just came out. It covers:",
      "",
      "  • Adoption + payback benchmarks across 8 verticals",
      "  • The 7 reasons pilots fail (and how to avoid each)",
      "  • Our 15-point readiness scorecard",
      "  • The 2026-2027 vendor landscape",
      "",
      "Free, no further commitment:",
      "  https://trainyouragent.com/report/state-of-ai-ops-2026",
      "",
      "If after reading it you'd like a 30-min scoping conversation, the",
      `calendar is here: ${KICKOFF_LINK}`,
      "",
      "Either way, happy to answer any single specific question by reply.",
      "",
      "— Alexander Mills",
      "  Founder, TrainYourAgent",
    ].join("\n");

    tasks.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: email,
        subject,
        text,
        scheduled_at: scheduledAt,
      }),
    }));
  }

  if (SLACK_URL) {
    tasks.push(fetch(SLACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `:hourglass_flowing_sand: *abandoned-booking* — ${email}\n` +
              `Vertical: ${vertical}\nStep: ${step}\nTag: ${tag}\n` +
              `Nudge queued for: +30m`,
      }),
    }));
  }

  await Promise.allSettled(tasks);
  return json({ ok: true, tag }, 200, { ...cors.headers, ...rl.headers });
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
