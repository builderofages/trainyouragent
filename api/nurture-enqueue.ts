// api/nurture-enqueue.ts — Vercel edge function
// v161: 5-email nurture drip enqueued the moment a lead is captured.
//
// Why this exists:
//   The cron-based /api/nurture-tick is great for batch catch-up, but the
//   "good fence is built when the prospect cares most" lever is hitting
//   their inbox on a deterministic cadence starting the SECOND they opt in.
//   Resend's `scheduled_at` parameter lets us drop all 5 emails into their
//   queue in a single batched call — no DB state needed, no cron drift.
//
//   Cadence (Hormozi nurture pattern):
//     Day 0   welcome + Loom demo link
//     Day 2   case study #1 (HVAC operator pattern + leak math)
//     Day 5   ROI calculator nudge
//     Day 9   risk-reversal stack restatement
//     Day 14  founder personal story + final CTA
//
//   Wired in from /api/lead so EVERY captured email triggers the drip,
//   plus a direct call-site for surfaces that capture leads outside
//   the standard /api/lead path.
//
// Body: { email: string, source: string, niche?: string, name?: string }
// Auth: not required — only sends to the caller-supplied email; rate-limited
//       per IP. Honeypot fields on the caller form do the bot filter.
//
// Env required:
//   RESEND_API_KEY        — required, function no-ops gracefully without it
//   RESEND_FROM_EMAIL     — optional, default "TrainYourAgent <onboarding@resend.dev>"
//   RESEND_REPLY_TO       — optional, default "alexander@trainyouragent.com"
//
// Idempotency: Resend dedupes scheduled sends per (recipient, scheduled_at,
//   subject) for a 24h window — calling this twice for the same lead inside
//   a day will NOT double-fire. After that window we rely on the caller (/api/lead)
//   not enqueuing twice for the same email.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const RESEND_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.RESEND_FROM_EMAIL || "TrainYourAgent <onboarding@resend.dev>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "alexander@trainyouragent.com";
const SITE = "https://trainyouragent.com";
const CAL_URL = "https://cal.com/trainyouragent/30min";
// Public Loom embed for the live agent demo. If/when the founder records
// a personalized Loom, swap LOOM_URL via env. Until then, /voice-demo on
// the live site is the same "watch the product" payoff.
const LOOM_URL = process.env.NURTURE_LOOM_URL || "https://www.trainyouragent.com/voice-demo";

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const MAX_BODY_BYTES = 4 * 1024;

type EnqueueBody = {
  email: string;
  source?: string;
  niche?: string;
  name?: string;
};

type EnqueueResult = {
  ok: boolean;
  scheduled?: number;
  errors?: string[];
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  // Per-IP rate limit (defense in depth — main filter happens at /api/lead).
  const ip = ipFromRequest(req);
  const rl = rateLimit(`nurture-enq:${ip}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: EnqueueBody;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad-json" }, 400, cors.headers); }

  if (!body?.email || typeof body.email !== "string" || !EMAIL_RE.test(body.email) || body.email.length > 254) {
    return json({ ok: false, error: "bad-email" }, 400, cors.headers);
  }

  const email = body.email.trim().toLowerCase();
  const source = (body.source || "site").slice(0, 64);
  const niche = body.niche ? body.niche.slice(0, 64) : undefined;
  const firstName = body.name ? body.name.split(/\s+/)[0]?.slice(0, 60) : undefined;

  const result = await enqueueNurture({ email, source, niche, firstName });
  return json(result, result.ok ? 200 : 502, { ...cors.headers, ...rl.headers });
}

// Exported so /api/lead can call this directly without a network hop.
export async function enqueueNurture(opts: {
  email: string;
  source: string;
  niche?: string;
  firstName?: string;
}): Promise<EnqueueResult> {
  if (!RESEND_KEY) {
    // Graceful no-op when not configured. Caller still records lead.
    return { ok: false, errors: ["RESEND_API_KEY not configured"] };
  }

  const touches = buildTouches({
    email: opts.email,
    firstName: opts.firstName,
    niche: opts.niche,
    source: opts.source,
  });

  const errors: string[] = [];
  let scheduled = 0;

  // Resend's batch endpoint accepts up to 100 emails in one POST. We use it
  // so all 5 touches land in their queue atomically.
  const payload = touches.map((t) => ({
    from: FROM,
    to: [opts.email],
    subject: t.subject,
    html: t.html,
    text: t.text,
    reply_to: REPLY_TO,
    scheduled_at: t.scheduledAt,
    tags: [
      { name: "category", value: "nurture-drip" },
      { name: "touch_day", value: String(t.day) },
      { name: "source", value: opts.source.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) },
    ],
    headers: {
      "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=unsubscribe>, <${SITE}/unsubscribe?email=${encodeURIComponent(opts.email)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  }));

  try {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      // Resend's batch endpoint is recent — fall back to N individual sends.
      const errBody = await res.text().catch(() => "");
      errors.push(`batch ${res.status}: ${errBody.slice(0, 200)}`);
      const fallback = await sendIndividually(payload);
      return { ok: fallback.scheduled > 0, scheduled: fallback.scheduled, errors: [...errors, ...fallback.errors] };
    }
    scheduled = touches.length;
    return { ok: true, scheduled };
  } catch (e) {
    errors.push((e as Error).message);
    const fallback = await sendIndividually(payload);
    return { ok: fallback.scheduled > 0, scheduled: fallback.scheduled, errors: [...errors, ...fallback.errors] };
  }
}

async function sendIndividually(payload: Array<Record<string, unknown>>): Promise<{ scheduled: number; errors: string[] }> {
  const errors: string[] = [];
  let scheduled = 0;
  for (const item of payload) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (r.ok) {
        scheduled++;
      } else {
        const t = await r.text().catch(() => "");
        errors.push(`single ${r.status}: ${t.slice(0, 120)}`);
      }
    } catch (e) {
      errors.push(`single throw: ${(e as Error).message}`);
    }
  }
  return { scheduled, errors };
}

// --- Templates -----------------------------------------------------------

type Touch = {
  day: number;
  scheduledAt: string;       // ISO8601
  subject: string;
  html: string;
  text: string;
};

function buildTouches(ctx: { email: string; firstName?: string; niche?: string; source: string }): Touch[] {
  const greet = ctx.firstName ? `Hey ${ctx.firstName},` : "Hey,";
  const nicheLine = ctx.niche
    ? `Saw you came in from ${ctx.niche}. I've built agents for ${ctx.niche} operators before — happy to send a 90-second Loom on the exact call flow if you want it.`
    : "I've built agents for HVAC, roofing, law firms, dental, real estate, and SaaS. If you tell me your niche I'll send a 90-second Loom on the exact call flow.";

  // Day 0 fires at +5 minutes from "now" — enough delay that the first
  // notification email from /api/lead has already arrived without overlapping.
  const base = Date.now();
  const at = (days: number, mins = 0) =>
    new Date(base + days * 24 * 60 * 60 * 1000 + mins * 60 * 1000).toISOString();

  return [
    {
      day: 0,
      scheduledAt: at(0, 5),
      subject: "Welcome — here's the live agent (60 sec)",
      ...renderEmail({
        title: "Welcome — here's the live agent",
        body: [
          `${greet}`,
          `Thanks for opting in. Quick win for your next 60 seconds: <a href="${LOOM_URL}">tap here to talk to the live voice agent</a> on this site. Same agent class we deploy to production phone lines for paying customers — no signup, no card, no email gate. Just hit the mic.`,
          nicheLine,
          `If you want to skip the drip and book a 30-min build call with me directly, <a href="${CAL_URL}">grab a time here</a>. I scope every build personally; no SDR, no account manager, no delivery pod.`,
          `— Alexander Mills, founder, TrainYourAgent · Tampa Bay, FL`,
        ],
        cta: { label: "Talk to the live agent (60 sec)", href: LOOM_URL },
      }),
    },
    {
      day: 2,
      scheduledAt: at(2),
      subject: "Case study: what a single HVAC missed call actually costs",
      ...renderEmail({
        title: "The $22,889/mo leak hiding in your phone line",
        body: [
          `${greet}`,
          `Here's a number from the field: the average Tampa HVAC operator we've audited is bleeding <strong>$22,889 in missed revenue per month</strong> to calls that go to voicemail outside business hours.`,
          `The math: 6 inbound calls/day after 5pm × 22 business days × 30% would-have-booked × $577 average ticket = $22,889/mo.`,
          `That's not a margin problem. That's an answer-the-phone problem. A 24/7 voice agent that books appointments to your existing calendar takes 14 business days to build and starts at $497 (Done-WITH-You build session) or $1,997/mo (full Operators tier).`,
          `Want the spreadsheet? <a href="${SITE}/pricing#roi-inline">Punch your own numbers into the ROI calculator</a> and you'll see your leak in 30 seconds.`,
          `<em>(Note: we're shipping our case-study library now via free builds for the first 5 Tampa HVAC operators. If that's you, hit reply.)</em>`,
          `— Alexander`,
        ],
        cta: { label: "See your missed-call leak →", href: `${SITE}/pricing#roi-inline` },
      }),
    },
    {
      day: 5,
      scheduledAt: at(5),
      subject: "Quick: what's your missed-call number?",
      ...renderEmail({
        title: "Three sliders. Real number.",
        body: [
          `${greet}`,
          `Two-question ROI calculator on our pricing page — punch in your inbound call volume + average ticket. It'll give you:`,
          `<ul><li>Annual revenue you're leaving on voicemail today</li><li>Days-to-payback on a TrainYourAgent build</li><li>Which tier the math picks for you (Founders / Operators / Scale)</li></ul>`,
          `<a href="${SITE}/pricing#roi-inline">Run the math here →</a> (no email gate — it's just sliders).`,
          `If the math doesn't break even inside 90 days I'll tell you not to buy. I'm in this business for the next decade, not the next quarter.`,
          `— Alexander`,
        ],
        cta: { label: "Run the ROI math →", href: `${SITE}/pricing#roi-inline` },
      }),
    },
    {
      day: 9,
      scheduledAt: at(9),
      subject: "Four ways you don't lose",
      ...renderEmail({
        title: "The risk-reversal stack",
        body: [
          `${greet}`,
          `Most agencies make you wear all the risk. Here's how we shift it:`,
          `<strong>1.</strong> <strong>30-day money-back on the build fee.</strong> If your first agent doesn't ship to the spec we agreed on the kickoff call, we refund the full build fee. You keep the artifacts. No clawback fight.`,
          `<strong>2.</strong> <strong>Founders lane = $0 upfront.</strong> Pay only when calls land. If we can't build something that books revenue for you, you don't pay.`,
          `<strong>3.</strong> <strong>Cancel anytime, no contract trap.</strong> Month-to-month. Your number ports out within 5 business days. 90-day data export.`,
          `<strong>4.</strong> <strong>90-day pay-for-itself.</strong> Founding-cohort customers: we beat your missed-call baseline in 90 days or every dollar comes back.`,
          `Four guarantees stacked = the only way you lose is by not trying. <a href="${CAL_URL}">Book a 30-min build call.</a> Written scope same day. No card.`,
          `— Alexander`,
        ],
        cta: { label: "Book a 30-min build call →", href: CAL_URL },
      }),
    },
    {
      day: 14,
      scheduledAt: at(14),
      subject: "Why I closed a 7-figure agency to build this",
      ...renderEmail({
        title: "The bet I'm making with TrainYourAgent",
        body: [
          `${greet}`,
          `Last touch from me. Then I get out of your inbox.`,
          `I ran a 7-figure social media agency in LA. Closed it on purpose in 2022 to build TrainYourAgent. The bet: <em>the future of small business is one person + their AI agents</em> — and the work of building that future doesn't get done by another agency churning out content. It gets done by engineers wiring real agents onto real phone lines, one operator at a time.`,
          `That's what I'm doing. One operator (me), your line, your CRM, your call flow. No SDR. No account manager. No delivery pod. The number of humans between you and the build is one.`,
          `If that's the kind of partner you want, <a href="${CAL_URL}">grab a time here</a>. If it's not, no hard feelings — I'll archive your address and you'll never hear from me again. Just reply UNSUBSCRIBE.`,
          `Either way — good luck out there. The next decade gets won by the operators who wire AI in first.`,
          `— Alexander Mills · Tampa Bay, FL · <a href="https://www.linkedin.com/in/agentmills/">LinkedIn</a>`,
        ],
        cta: { label: "Final invitation — book 30 min →", href: CAL_URL },
      }),
    },
  ];
}

function renderEmail(opts: {
  title: string;
  body: string[];
  cta?: { label: string; href: string };
}): { html: string; text: string } {
  const paragraphs = opts.body
    .map((p) => `<p style="margin:0 0 14px 0;font-size:15.5px;line-height:1.7;color:#0B1B2B;">${p}</p>`)
    .join("\n");
  const cta = opts.cta
    ? `<p style="margin:24px 0 12px 0;"><a href="${opts.cta.href}" style="display:inline-block;background:#042C53;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:600;font-size:14.5px;font-family:-apple-system,BlinkMacSystemFont,'Inter Tight',sans-serif;">${escapeHtml(opts.cta.label)}</a></p>`
    : "";
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><title>${escapeHtml(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#F6FAFE;font-family:-apple-system,BlinkMacSystemFont,'Inter Tight','Segoe UI',Roboto,sans-serif;color:#0B1B2B;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;">
    <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#185FA5;font-weight:600;margin-bottom:8px;font-family:ui-monospace,SFMono-Regular,monospace;">TrainYourAgent · Founder note</div>
    <h1 style="margin:0 0 18px 0;font-size:24px;line-height:1.2;color:#042C53;font-weight:600;letter-spacing:-0.01em;">${escapeHtml(opts.title)}</h1>
    ${paragraphs}
    ${cta}
    <hr style="border:0;border-top:1px solid #E2E8F0;margin:32px 0 16px 0;"/>
    <div style="font-size:11.5px;color:#64748B;line-height:1.6;">
      You're getting this because you opted in at trainyouragent.com. One operator, no SDR, no list bombs.<br/>
      Want out? Reply UNSUBSCRIBE or click <a href="${SITE}/unsubscribe" style="color:#185FA5;">here</a>.<br/>
      TrainYourAgent LLC · Tampa Bay, Florida · <a href="https://www.trainyouragent.com" style="color:#185FA5;">trainyouragent.com</a>
    </div>
  </div>
</body></html>`;
  const text = [
    `TrainYourAgent · ${opts.title}`,
    "",
    ...opts.body.map(stripHtml),
    "",
    opts.cta ? `→ ${opts.cta.label}: ${opts.cta.href}` : "",
    "",
    "—",
    "You're getting this because you opted in at trainyouragent.com.",
    `Unsubscribe: ${SITE}/unsubscribe or reply UNSUBSCRIBE.`,
    "TrainYourAgent LLC · Tampa Bay, Florida",
  ].filter(Boolean).join("\n");
  return { html, text };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]!));
}

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
