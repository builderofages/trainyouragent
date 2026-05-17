// api/lead.ts — Vercel serverless function. Receives lead form submissions.
// Notifies via Resend + Slack, AND forwards newsletter signups to beehiiv.
//
// Required env vars (Vercel project settings):
//   RESEND_API_KEY          (optional — internal email notification)
//   SLACK_WEBHOOK_URL       (optional — internal Slack ping)
//   LEAD_NOTIFY_TO          (optional — defaults to hello@trainyouragent.com)
//   LEAD_NOTIFY_FROM        (optional — defaults to leads@trainyouragent.com)
//   BEEHIIV_API_KEY         (required for newsletter forwarding)
//   BEEHIIV_PUB_ID          (required for newsletter forwarding — pub_xxx format)
//
// Hardening (v30):
//   - 5 req / IP / hour rate limit
//   - CORS allowlist
//   - Honeypot field check (`website` / `hp` — must be empty)
//   - RFC-5322-ish email validation
//   - HTML stripped from name/company/payload before notifications
//   - Source allowlist
//   - Body size cap

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { recordLead } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

type Lead = {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: string;
  payload?: unknown;
  path?: string;
  ts?: string;
  subscribeToNewsletter?: boolean;
  // v49: first-touch UTM / affiliate attribution
  attribution?: Record<string, unknown>;
  // Honeypots — must be empty/absent. Bots fill every visible field.
  website?: string;
  hp?: string;
};

const RESEND_KEY = process.env.RESEND_API_KEY;
const SLACK_URL = process.env.SLACK_WEBHOOK_URL;
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || "hello@trainyouragent.com";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "leads@trainyouragent.com";
const BEEHIIV_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB = process.env.BEEHIIV_PUB_ID;

const NEWSLETTER_SOURCES = new Set([
  "newsletter",
  "newsletter-floater",
  "newsletter-page",
  "blog-cta",
]);

// Allowlist — every lead `source` we accept. Reject anything else.
const ALLOWED_SOURCES = new Set([
  "newsletter",
  "newsletter-floater",
  "newsletter-page",
  "blog-cta",
  "buyers-guide",
  "contact",
  "contact-form",
  "demo-request",
  "roi-calc",
  "pathway-router",
  // v41: free-tool lead magnets
  "tool:cost-estimator",
  "tool:roi-calculator",
  "tool:prompt-critic",
  "tool:scenario-generator",
  "tool:latency-simulator",
  // v44: three new client-side tools
  "tool:prompt-library",
  "tool:model-selector",
  "tool:automation-roi",
  // v41: community + partners
  "community-win",
  "partner-apply",
  // v42: report lead magnet + demos
  "report-state-of-ai-ops-2026",
  "demo:objections",
  "demo:sop",
  "demo:seo",
  // v46b: discovered missing — wired in src/ but rejected by allowlist
  "agency-partner",
  "trial-request",
  "research-partners",
  "status-subscribe",
  "industry_faq",
  "implementation_timeline",
  "multi_step_form",
  "exit_popup",
  "lead_gate_completion",
  "faq_section",
  // v47A: trust + authority infrastructure
  "press-inquiry",
  "speaking-request",
  "podcast-guest-request",
  "security-questionnaire-request",
  "gdpr-deletion-request",
  "enterprise-security-call",
  // v47B: local SEO city request
  "local-city-request",
  // v49: docs / api-docs / mission / invest / affiliate / careers
  "docs-feedback",
  "api-access-request",
  "investor-inquiry",
  "affiliate-application",
  "careers-self-pitch",
]);

const MAX_BODY_BYTES = 16 * 1024; // 16 KB is plenty for a lead form
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  // Rate limit — 5 req per IP per hour.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  // Body size cap.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: Lead;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad-json" }, 400, cors.headers);
  }

  // Honeypot — silently 200 so bots don't learn.
  if ((body.website && body.website.trim() !== "") || (body.hp && body.hp.trim() !== "")) {
    return json({ ok: true }, 200, cors.headers);
  }

  if (!body.email || !body.source) {
    return json({ ok: false, error: "missing-fields" }, 400, cors.headers);
  }
  if (!ALLOWED_SOURCES.has(body.source)) {
    return json({ ok: false, error: "bad-source" }, 400, cors.headers);
  }
  if (typeof body.email !== "string" || !EMAIL_RE.test(body.email) || body.email.length > 254) {
    return json({ ok: false, error: "bad-email" }, 400, cors.headers);
  }

  // Sanitize all human-controlled strings before they hit notifications/email.
  body.email = body.email.trim().toLowerCase();
  body.name = clean(body.name, 120);
  body.company = clean(body.company, 200);
  body.phone = clean(body.phone, 40);
  body.path = clean(body.path, 500);
  // v49: fold first-touch attribution into payload.attribution so it persists with the lead
  if (body.attribution && typeof body.attribution === "object") {
    const sanitizedAttribution = sanitizePayload(body.attribution);
    const existingPayload = body.payload;
    if (existingPayload && typeof existingPayload === "object" && !Array.isArray(existingPayload)) {
      body.payload = { ...(existingPayload as Record<string, unknown>), attribution: sanitizedAttribution };
    } else if (existingPayload === undefined || existingPayload === null) {
      body.payload = { attribution: sanitizedAttribution };
    } else {
      body.payload = { value: existingPayload, attribution: sanitizedAttribution };
    }
    delete body.attribution;
  }
  body.payload = sanitizePayload(body.payload);
  body.ts = new Date().toISOString();

  const subject = `[Lead · ${body.source}] ${body.name || body.email}`;
  const text = formatLead(body);

  const tasks: Promise<unknown>[] = [];

  if (RESEND_KEY) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: NOTIFY_FROM, to: NOTIFY_TO, subject, text }),
      })
    );
  }

  if (SLACK_URL) {
    tasks.push(
      fetch(SLACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `:bell: *${subject}*\n\`\`\`${text}\`\`\`` }),
      })
    );
  }

  const wantsNewsletter = body.subscribeToNewsletter === true || NEWSLETTER_SOURCES.has(body.source);
  if (wantsNewsletter && BEEHIIV_KEY && BEEHIIV_PUB) {
    tasks.push(forwardToBeehiiv(body));
  }

  // v41: record in admin store so /api/admin/* surfaces it.
  try {
    recordLead({ email: body.email, source: body.source, path: body.path, ip });
  } catch { /* never block the lead path on store errors */ }

  await Promise.allSettled(tasks);
  return json({ ok: true }, 200, { ...cors.headers, ...rl.headers });
}

async function forwardToBeehiiv(lead: Lead): Promise<unknown> {
  const url = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB}/subscriptions`;
  const utm: Record<string, string> = {};
  if (lead.path) utm.utm_source = "trainyouragent.com";
  if (lead.source) utm.utm_medium = lead.source;
  if (lead.path) utm.utm_campaign = lead.path;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BEEHIIV_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: lead.email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      referring_site: lead.path
        ? `https://trainyouragent.com${lead.path}`
        : undefined,
      custom_fields: lead.name
        ? [{ name: "name", value: lead.name }]
        : undefined,
    }),
  });
}

function formatLead(l: Lead): string {
  return [
    `Source: ${l.source}`,
    `Email:  ${l.email}`,
    l.name && `Name:   ${l.name}`,
    l.company && `Co:     ${l.company}`,
    l.phone && `Phone:  ${l.phone}`,
    l.path && `Path:   ${l.path}`,
    l.ts && `Time:   ${l.ts}`,
    typeof l.subscribeToNewsletter === "boolean" && `NL:     ${l.subscribeToNewsletter}`,
    l.payload && `\nPayload:\n${JSON.stringify(l.payload, null, 2)}`,
  ].filter(Boolean).join("\n");
}

// Strip HTML/control chars, collapse whitespace, cap length.
function clean(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const out = v
    .replace(/<[^>]*>/g, "")        // strip tags
    .replace(/[\r\n\t]+/g, " ")     // collapse newlines (prevent header injection)
    .replace(/[\x00-\x1f\x7f]/g, "") // control chars
    .trim()
    .slice(0, max);
  return out || undefined;
}

function sanitizePayload(p: unknown): unknown {
  if (p == null) return undefined;
  if (typeof p === "string") return clean(p, 4000);
  if (typeof p === "number" || typeof p === "boolean") return p;
  if (Array.isArray(p)) return p.slice(0, 50).map(sanitizePayload);
  if (typeof p === "object") {
    const out: Record<string, unknown> = {};
    let n = 0;
    for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
      if (n++ > 50) break;
      const cleanKey = String(k).replace(/[^\w.-]/g, "").slice(0, 64);
      if (!cleanKey) continue;
      out[cleanKey] = sanitizePayload(v);
    }
    return out;
  }
  return undefined;
}

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}
