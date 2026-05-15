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
  // If true, also enroll the email in the beehiiv newsletter publication.
  // Newsletter components and the floater set this to true.
  // Other forms (contact, demo-request) leave it falsy.
  subscribeToNewsletter?: boolean;
};

const RESEND_KEY = process.env.RESEND_API_KEY;
const SLACK_URL = process.env.SLACK_WEBHOOK_URL;
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || "hello@trainyouragent.com";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "leads@trainyouragent.com";
const BEEHIIV_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB = process.env.BEEHIIV_PUB_ID;

// Sources that should always be enrolled in the newsletter, regardless of flag.
const NEWSLETTER_SOURCES = new Set([
  "newsletter",
  "newsletter-floater",
  "newsletter-page",
  "blog-cta",
]);

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  let body: Lead;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "bad-json" }, 400);
  }
  if (!body.email || !body.source) return json({ ok: false, error: "missing-fields" }, 400);

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

  // Beehiiv enrollment — only when explicitly opted in OR the source is a newsletter form.
  const wantsNewsletter = body.subscribeToNewsletter === true || NEWSLETTER_SOURCES.has(body.source);
  if (wantsNewsletter && BEEHIIV_KEY && BEEHIIV_PUB) {
    tasks.push(forwardToBeehiiv(body));
  }

  await Promise.allSettled(tasks);
  return json({ ok: true });
}

async function forwardToBeehiiv(lead: Lead): Promise<unknown> {
  // https://developers.beehiiv.com/docs/api/v2/subscriptions/create
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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
