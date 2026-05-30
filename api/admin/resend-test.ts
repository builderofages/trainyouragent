// api/admin/resend-test.ts — v274
//
// One-shot Resend smoke test. Sends a one-line transactional email so the
// founder can confirm the domain is verified + the API key is live without
// triggering a real lead-magnet flow.
//
// POST /api/admin/resend-test
//   headers: x-admin-token: <ADMIN_TOKEN>  (or ?token=...)
//   body:    { "to": "you@example.com" }
//
// Returns: { ok: true, id, provider } on success, or { ok: false, error }.
//
// Auth: ADMIN_TOKEN required — same gate as every other /api/admin/* route.

import { sendEmail } from "../_lib/resend.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

function j(o: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...headers } });
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401, cors.headers);

  if (req.method !== "POST") {
    return j({ ok: false, error: "method-not-allowed", hint: "POST { to: 'you@example.com' }" }, 405, cors.headers);
  }

  let body: { to?: string } = {};
  try { body = (await req.json()) as { to?: string }; } catch { return j({ ok: false, error: "bad-json" }, 400, cors.headers); }
  const to = String(body.to || "").trim();
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return j({ ok: false, error: "invalid-to", hint: "Pass a valid email address in body.to" }, 400, cors.headers);
  }

  const stamp = new Date().toISOString();
  const result = await sendEmail({
    to,
    subject: `TrainYourAgent — Resend domain check (${stamp.slice(0, 19)}Z)`,
    html: `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0B1B2B;padding:24px;">
      <p style="font-size:15px;line-height:1.55;margin:0 0 10px 0;">
        This is a Resend smoke-test from <strong>trainyouragent.com</strong>. If you can read it, the API key is live and the sending domain is verified end-to-end.
      </p>
      <p style="font-size:12px;color:#5A6A7C;margin:0;">Sent at ${stamp}.</p>
    </body></html>`,
    text: `Resend smoke-test from trainyouragent.com. If you can read it, the API key is live and the sending domain is verified end-to-end. Sent at ${stamp}.`,
    tag: "admin-resend-test",
  });

  if (!result.ok) {
    return j({ ok: false, provider: result.provider, error: result.error || "send-failed" }, 502, cors.headers);
  }
  return j({ ok: true, provider: result.provider, id: result.id, to, sentAt: stamp }, 200, cors.headers);
}
