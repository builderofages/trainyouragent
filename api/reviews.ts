// api/reviews.ts — v233
//
// Public testimonial submission endpoint. Writes to public.reviews table
// (creates one if not yet migrated — gracefully skips if Supabase isn't
// configured). Also emails the founder a notification so it doesn't sit
// unseen.
//
// Schema (run once in Supabase SQL Editor — gracefully optional):
//   create table public.reviews (
//     id uuid primary key default gen_random_uuid(),
//     name text not null,
//     company text not null,
//     email text not null,
//     niche text not null,
//     video_url text,
//     quote text,
//     permission_granted boolean not null default false,
//     source text,
//     status text not null default 'pending',
//     ts timestamptz not null default now()
//   );
//   create index reviews_status_ts_idx on public.reviews (status, ts desc);
//   alter table public.reviews enable row level security;
//   create policy reviews_svc on public.reviews
//     for all using (auth.role() = 'service_role')
//     with check (auth.role() = 'service_role');
//
// Rate limit: 5 submissions per IP per hour — enough for one customer
// fixing typos, blocks spam.

import { getSupabase } from "./_lib/supabase.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const bucket = new Map<string, { n: number; resetAt: number }>();
function tooMany(key: string, max = 5, windowMs = 3_600_000): boolean {
  const now = Date.now();
  const e = bucket.get(key);
  if (!e || e.resetAt < now) { bucket.set(key, { n: 1, resetAt: now + windowMs }); return false; }
  if (++e.n > max) return true;
  return false;
}

function ipOf(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function trunc(s: string | null | undefined, n: number): string | null {
  if (!s) return null;
  return String(s).slice(0, n);
}

function jsonOk(o: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(o), { status: 200, headers: { "content-type": "application/json", ...headers } });
}
function jsonErr(msg: string, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify({ ok: false, error: msg }), { status, headers: { "content-type": "application/json", ...headers } });
}

async function notifyFounder(payload: Record<string, unknown>): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "TrainYourAgent <hello@trainyouragent.com>";
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: "trainyouragent@gmail.com",
        subject: `[Review submitted] ${payload.company} (${payload.niche})`,
        html: `<h2>New testimonial submission</h2>
<p><strong>Name:</strong> ${payload.name}<br>
<strong>Company:</strong> ${payload.company}<br>
<strong>Email:</strong> ${payload.email}<br>
<strong>Niche:</strong> ${payload.niche}<br>
<strong>Permission granted:</strong> ${payload.permission_granted}</p>
${payload.video_url ? `<p><strong>Video:</strong> <a href="${payload.video_url}">${payload.video_url}</a></p>` : ""}
${payload.quote ? `<blockquote>${String(payload.quote).replace(/\n/g, "<br>")}</blockquote>` : ""}
<p><a href="https://trainyouragent.com/admin/templates">Review in admin →</a></p>`,
      }),
    });
  } catch { /* silent — email is nice-to-have */ }
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return jsonErr("method-not-allowed", 405, cors.headers);

  const ip = ipOf(req);
  if (tooMany(ip)) return jsonErr("rate-limited", 429, cors.headers);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return jsonErr("bad-json", 400, cors.headers); }

  const name = trunc(body.name as string, 140);
  const company = trunc(body.company as string, 200);
  const email = trunc(body.email as string, 240);
  const niche = trunc(body.niche as string, 64) || "unknown";
  const video_url = trunc(body.video_url as string, 600);
  const quote = trunc(body.quote as string, 2000);
  const permission_granted = !!body.permission_granted;
  const source = trunc(body.source as string, 80) || "/reviews/submit";

  if (!name || !company || !email) return jsonErr("missing-required", 400, cors.headers);
  if (!email.includes("@")) return jsonErr("bad-email", 400, cors.headers);
  if (!permission_granted) return jsonErr("permission-required", 400, cors.headers);
  if (!video_url && !quote) return jsonErr("need-video-or-quote", 400, cors.headers);

  const row = {
    name, company, email, niche, video_url, quote,
    permission_granted, source, status: "pending" as const,
  };

  // Best-effort persistence — silent if table doesn't exist yet.
  try {
    const sb = getSupabase();
    if (sb) void sb.from("reviews").insert(row);
  } catch { /* ignore */ }

  // Notify the founder so it doesn't sit unseen.
  void notifyFounder(row);

  // Log to stdout for Vercel observability even if Supabase isn't ready.
  // eslint-disable-next-line no-console
  console.log("[review-submit]", JSON.stringify({ company, niche, has_video: !!video_url, has_quote: !!quote, ip }));

  return jsonOk({ ok: true, queued: true }, cors.headers);
}
