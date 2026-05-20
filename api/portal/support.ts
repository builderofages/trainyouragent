// api/portal/support.ts
// v76-a: Customer support ticket intake. Inserts a row in
// `tya_support_tickets` (RLS scoped to the customer email) and emails
// Alexander via Resend so a human responds within 24h.

import { sendEmail } from "../_lib/resend.js";

export const config = { runtime: "edge" };

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const NOTIFY_TO = process.env.SUPPORT_NOTIFY_TO || "alexander@trainyouragent.com";

const PRIORITIES = new Set(["low", "normal", "high", "urgent"]);

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function emailFromJwt(token: string): string {
  try {
    const payloadSeg = token.split(".")[1] || "";
    const b64 = payloadSeg.replace(/-/g, "+").replace(/_/g, "/");
    const j = JSON.parse(atob(b64));
    return String(j.email || "").toLowerCase();
  } catch {
    return "";
  }
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json(401, { ok: false, error: "missing_auth" });
  if (!SUPA_URL || !SUPA_ANON) return json(503, { ok: false, error: "db_not_configured" });

  const token = auth.slice("Bearer ".length);
  const email = emailFromJwt(token);
  if (!email) return json(401, { ok: false, error: "no_email_in_jwt" });

  let body: { subject?: string; description?: string; priority?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "bad_json" });
  }

  const subject = String(body.subject || "").trim().slice(0, 200);
  const description = String(body.description || "").trim().slice(0, 5000);
  const priority = String(body.priority || "normal").toLowerCase();

  if (!subject || !description) return json(400, { ok: false, error: "missing_fields" });
  if (!PRIORITIES.has(priority)) return json(400, { ok: false, error: "bad_priority" });

  const ins = await fetch(`${SUPA_URL}/rest/v1/tya_support_tickets`, {
    method: "POST",
    headers: {
      apikey: SUPA_ANON,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify({
      customer_email: email,
      subject,
      description,
      priority,
    }),
  });

  if (!ins.ok) {
    const text = await ins.text().catch(() => "");
    return json(ins.status, { ok: false, error: "supabase_error", detail: text.slice(0, 200) });
  }

  // Fire-and-forget email notification to Alexander.
  sendEmail({
    to: NOTIFY_TO,
    subject: `[Portal] ${priority.toUpperCase()} · ${subject}`,
    html: `
      <h2>New customer support ticket</h2>
      <p><strong>From:</strong> ${esc(email)}</p>
      <p><strong>Priority:</strong> ${esc(priority)}</p>
      <p><strong>Subject:</strong> ${esc(subject)}</p>
      <hr/>
      <pre style="white-space:pre-wrap;font-family:inherit;">${esc(description)}</pre>
    `,
    text: `From: ${email}\nPriority: ${priority}\nSubject: ${subject}\n\n${description}`,
    tag: "portal-support",
  }).catch(() => {});

  return json(200, { ok: true });
}
