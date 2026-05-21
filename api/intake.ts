// api/intake.ts — v76-c
// Receives the /train/intake 4-step discovery questionnaire. Inserts to
// public.tya_intake, then fires a Resend notification to Alexander with a
// formatted summary. Responds with `{ ok: true }` so the React form can
// show its "thanks, we'll be in touch" confirmation.
//
// Hardening (mirrors api/lead.ts):
//   - 10 req / IP / hour rate limit
//   - CORS allowlist
//   - Honeypot field check
//   - RFC-5322-ish email validation
//   - HTML stripped from every human-controlled field
//   - 64 KB body cap (intake forms carry more payload than leads)
//
// Required env vars:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY  (otherwise the row is dropped — still 200)
//   RESEND_API_KEY                      (otherwise notification is skipped)
//   INTAKE_NOTIFY_TO                    (defaults to hello@trainyouragent.com)
//   INTAKE_NOTIFY_FROM                  (defaults to onboarding@resend.dev)

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { getSupabase } from "./_lib/supabase.js";
import { sendEmail } from "./_lib/resend.js";

export const config = { runtime: "edge" };

// v82: default NOTIFY_TO now trainyouragent@gmail.com instead of
// hello@trainyouragent.com. Reason: Resend in sandbox mode (no verified
// custom domain) can ONLY send to the account-owner's verified email,
// which is the gmail address. Sending to hello@trainyouragent.com fails
// silently with a 403 "domain not verified" error, dropping every lead.
// Using gmail guarantees Alexander receives every intake even with zero
// DNS setup — the fail-safe path. Override via INTAKE_NOTIFY_TO env var
// once the trainyouragent.com domain is verified in Resend.
const NOTIFY_TO = process.env.INTAKE_NOTIFY_TO || "trainyouragent@gmail.com";
const NOTIFY_FROM =
  process.env.INTAKE_NOTIFY_FROM ||
  "TrainYourAgent Intake <onboarding@resend.dev>";

const MAX_BODY_BYTES = 64 * 1024;
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

type Intake = {
  email: string;
  // Step 1 — about your business
  business_name?: string;
  industry?: string;
  employee_count?: string;
  monthly_call_volume?: string;
  avg_ticket_size?: string;
  primary_pain?: string;
  // Step 2 — current process
  current_call_handling?: string;
  common_questions?: string[];
  avg_call_duration?: string;
  booking_rate?: string;
  // Step 3 — your offer
  services?: Array<{ name?: string; price?: string }>;
  business_hours?: string;
  service_area_zips?: string;
  payment_methods?: string[];
  scheduling_system?: string;
  // Step 4 — knowledge upload (file metadata only — actual files would go to a
  // separate signed-URL upload endpoint in v77; here we capture names + sizes
  // so Alexander can ask the customer to email the files in a separate flow)
  uploaded_files?: Array<{ name?: string; size?: number; type?: string }>;
  // Honeypots
  website?: string;
  hp?: string;
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`intake:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.ok)
    return json({ ok: false, error: "rate-limited" }, 429, {
      ...cors.headers,
      ...rl.headers,
    });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES)
    return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: Intake;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad-json" }, 400, cors.headers);
  }

  // Honeypot — silently 200 so bots don't learn.
  if (
    (body.website && body.website.trim() !== "") ||
    (body.hp && body.hp.trim() !== "")
  ) {
    return json({ ok: true }, 200, cors.headers);
  }

  if (
    !body.email ||
    typeof body.email !== "string" ||
    !EMAIL_RE.test(body.email) ||
    body.email.length > 254
  ) {
    return json({ ok: false, error: "bad-email" }, 400, cors.headers);
  }

  const sanitized: Intake = {
    email: body.email.trim().toLowerCase(),
    business_name: clean(body.business_name, 200),
    industry: clean(body.industry, 120),
    employee_count: clean(body.employee_count, 40),
    monthly_call_volume: clean(body.monthly_call_volume, 40),
    avg_ticket_size: clean(body.avg_ticket_size, 40),
    primary_pain: clean(body.primary_pain, 2000),
    current_call_handling: clean(body.current_call_handling, 80),
    common_questions: cleanStringArray(body.common_questions, 10, 500),
    avg_call_duration: clean(body.avg_call_duration, 40),
    booking_rate: clean(body.booking_rate, 40),
    services: cleanServices(body.services),
    business_hours: clean(body.business_hours, 300),
    service_area_zips: clean(body.service_area_zips, 500),
    payment_methods: cleanStringArray(body.payment_methods, 12, 60),
    scheduling_system: clean(body.scheduling_system, 80),
    uploaded_files: cleanFiles(body.uploaded_files),
  };

  // Persist to Supabase if configured. We never fail the request on DB error
  // — the notification email is the higher-priority artifact for Alexander.
  let dbStatus: "ok" | "skipped" | "error" = "skipped";
  let dbError: string | undefined;
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from("tya_intake").insert({
        email: sanitized.email,
        business_name: sanitized.business_name || null,
        industry: sanitized.industry || null,
        employee_count: sanitized.employee_count || null,
        monthly_call_volume: sanitized.monthly_call_volume || null,
        avg_ticket_size: sanitized.avg_ticket_size || null,
        primary_pain: sanitized.primary_pain || null,
        current_call_handling: sanitized.current_call_handling || null,
        common_questions: sanitized.common_questions || null,
        avg_call_duration: sanitized.avg_call_duration || null,
        booking_rate: sanitized.booking_rate || null,
        services: sanitized.services || null,
        business_hours: sanitized.business_hours || null,
        service_area_zips: sanitized.service_area_zips || null,
        payment_methods: sanitized.payment_methods || null,
        scheduling_system: sanitized.scheduling_system || null,
        uploaded_files: sanitized.uploaded_files || null,
        source: "train-intake",
        payload: sanitized as unknown as Record<string, unknown>,
      });
      if (error) {
        dbStatus = "error";
        dbError = error.message;
        console.error("[api/intake] supabase insert error", error);
      } else {
        dbStatus = "ok";
      }
    } catch (e) {
      dbStatus = "error";
      dbError = (e as Error).message;
      console.error("[api/intake] supabase insert threw", e);
    }
  }

  // Fire the notification email — non-blocking but awaited so we know its
  // status in the response (handy for debugging).
  const subject = `[Intake] ${sanitized.business_name || sanitized.email} (${sanitized.industry || "n/a"})`;
  const html = renderIntakeEmail(sanitized);
  const emailResult = await sendEmail({
    to: NOTIFY_TO,
    subject,
    html,
    from: NOTIFY_FROM,
    tag: "intake",
  });

  return json(
    { ok: true, db: dbStatus, db_error: dbError, email: emailResult },
    200,
    { ...cors.headers, ...rl.headers },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────

function clean(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const out = v
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim()
    .slice(0, max);
  return out || undefined;
}

function cleanStringArray(v: unknown, maxItems: number, maxLen: number): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .slice(0, maxItems)
    .map((s) => clean(s, maxLen))
    .filter((s): s is string => !!s);
  return out.length ? out : undefined;
}

function cleanServices(
  v: unknown,
): Array<{ name?: string; price?: string }> | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.slice(0, 30).map((s) => {
    const obj = (s ?? {}) as { name?: unknown; price?: unknown };
    return {
      name: clean(obj.name, 200),
      price: clean(obj.price, 60),
    };
  }).filter((o) => o.name || o.price);
  return out.length ? out : undefined;
}

function cleanFiles(
  v: unknown,
): Array<{ name?: string; size?: number; type?: string }> | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.slice(0, 20).map((f) => {
    const obj = (f ?? {}) as { name?: unknown; size?: unknown; type?: unknown };
    const name = clean(obj.name, 200);
    const type = clean(obj.type, 100);
    const sizeNum = typeof obj.size === "number" ? obj.size : undefined;
    const size = typeof sizeNum === "number" && isFinite(sizeNum) && sizeNum >= 0
      ? Math.min(sizeNum, 50 * 1024 * 1024)
      : undefined;
    return { name, size, type };
  }).filter((f) => f.name);
  return out.length ? out : undefined;
}

function renderIntakeEmail(i: Intake): string {
  const esc = (s?: string) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const row = (k: string, v?: string) =>
    v && v.trim()
      ? `<tr><td style="padding:6px 12px 6px 0;color:#5A6A7C;vertical-align:top;font-size:13px;">${esc(k)}</td><td style="padding:6px 0;color:#0B1B2B;font-size:14px;">${esc(v)}</td></tr>`
      : "";
  const list = (k: string, arr?: string[]) =>
    arr && arr.length
      ? row(k, arr.map((x) => `• ${x}`).join("<br/>"))
      : "";
  const services =
    i.services && i.services.length
      ? i.services
          .map(
            (s) =>
              `• ${esc(s.name || "")}${s.price ? ` — ${esc(s.price)}` : ""}`,
          )
          .join("<br/>")
      : "";
  const files =
    i.uploaded_files && i.uploaded_files.length
      ? i.uploaded_files
          .map(
            (f) =>
              `• ${esc(f.name || "")}${f.size ? ` (${Math.round((f.size / 1024) * 10) / 10} KB)` : ""}${f.type ? ` · ${esc(f.type)}` : ""}`,
          )
          .join("<br/>")
      : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F6FAFE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Inter Tight',sans-serif;color:#0B1B2B;">
  <div style="max-width:680px;margin:0 auto;padding:28px 22px;background:#FFFFFF;">
    <div style="font-size:12px;color:#185FA5;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;margin-bottom:14px;">TrainYourAgent · /train/intake</div>
    <h1 style="font-size:22px;line-height:1.25;margin:0 0 18px 0;color:#042C53;font-weight:600;">New discovery questionnaire</h1>
    <p style="font-size:14px;color:#5A6A7C;margin:0 0 18px 0;">A prospect just completed the 4-step intake. Schedule a discovery call within 24h.</p>

    <h2 style="font-size:14px;color:#042C53;margin:18px 0 6px 0;border-bottom:1px solid #E6F1FB;padding-bottom:4px;">Contact</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${row("Email", i.email)}
      ${row("Business", i.business_name)}
    </table>

    <h2 style="font-size:14px;color:#042C53;margin:18px 0 6px 0;border-bottom:1px solid #E6F1FB;padding-bottom:4px;">Step 1 — About</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${row("Industry", i.industry)}
      ${row("Employees", i.employee_count)}
      ${row("Monthly calls", i.monthly_call_volume)}
      ${row("Avg ticket", i.avg_ticket_size)}
      ${row("Primary pain", i.primary_pain)}
    </table>

    <h2 style="font-size:14px;color:#042C53;margin:18px 0 6px 0;border-bottom:1px solid #E6F1FB;padding-bottom:4px;">Step 2 — Current process</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${row("How calls answered today", i.current_call_handling)}
      ${list("Top common questions", i.common_questions)}
      ${row("Avg call duration", i.avg_call_duration)}
      ${row("% booked", i.booking_rate)}
    </table>

    <h2 style="font-size:14px;color:#042C53;margin:18px 0 6px 0;border-bottom:1px solid #E6F1FB;padding-bottom:4px;">Step 3 — Offer</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${services ? row("Services", services) : ""}
      ${row("Business hours", i.business_hours)}
      ${row("Service area ZIPs", i.service_area_zips)}
      ${list("Payment methods", i.payment_methods)}
      ${row("Scheduling system", i.scheduling_system)}
    </table>

    <h2 style="font-size:14px;color:#042C53;margin:18px 0 6px 0;border-bottom:1px solid #E6F1FB;padding-bottom:4px;">Step 4 — Knowledge upload</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${files ? row("Files referenced", files) : row("Files referenced", "(none uploaded)")}
    </table>

    <p style="font-size:12px;color:#8A98A9;margin-top:22px;border-top:1px solid #E6F1FB;padding-top:14px;">Reply to this email to send Alexander's discovery-call link.</p>
  </div>
</body></html>`;
}

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}
