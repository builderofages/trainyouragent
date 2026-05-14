// api/lead.ts — Vercel serverless function. Receives lead form submissions.
// REQUIRES env: RESEND_API_KEY (or swap to Postmark/Mailchimp), optional SLACK_WEBHOOK_URL

export const config = { runtime: "edge" };

type Lead = {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: string;        // "newsletter" | "buyers-guide" | "configurator" | "contact" | "demo-request" | "roi-calc"
  payload?: unknown;     // any extra context
  path?: string;
  ts?: string;
};

const RESEND_KEY = process.env.RESEND_API_KEY;
const SLACK_URL = process.env.SLACK_WEBHOOK_URL;
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || "hello@trainyouragent.com";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "leads@trainyouragent.com";

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  let body: Lead;
  try { body = await req.json(); } catch { return json({ ok: false, error: "bad-json" }, 400); }
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

  await Promise.allSettled(tasks);
  return json({ ok: true });
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
    l.payload && `\nPayload:\n${JSON.stringify(l.payload, null, 2)}`,
  ].filter(Boolean).join("\n");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
