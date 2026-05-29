// api/log-error.ts — v229
//
// Lightweight client-side error sink. Posts go to Vercel logs (stdout) + a
// best-effort Supabase insert into a `client_errors` table if it exists.
// No PII captured — the client side already truncates message+stack. The
// goal is "stop flying blind", not "rebuild Sentry".
//
// Rate limited per-IP at the edge: 30 req / minute (one page-load is
// capped at 5 errors client-side already).
//
// Schema (run once if you want DB persistence — optional, logs work without):
//   create table public.client_errors (
//     id uuid primary key default gen_random_uuid(),
//     ts timestamptz not null default now(),
//     kind text, msg text, stack text, url text, ua text, ip text
//   );
//   create index client_errors_ts_idx on public.client_errors (ts desc);
//   alter table public.client_errors enable row level security;
//   create policy client_errors_svc on public.client_errors for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

import { getSupabase } from "./_lib/supabase.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

// In-memory leaky bucket — survives between requests on the same edge instance.
// Edge functions are recycled so this is best-effort, not security.
const bucket = new Map<string, { n: number; resetAt: number }>();
function tooMany(key: string, max = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = bucket.get(key);
  if (!entry || entry.resetAt < now) {
    bucket.set(key, { n: 1, resetAt: now + windowMs });
    return false;
  }
  if (++entry.n > max) return true;
  return false;
}

function ipOf(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function trunc(s: string | null | undefined, n: number): string {
  if (!s) return "";
  return String(s).slice(0, n);
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405, headers: cors.headers });
  }

  const ip = ipOf(req);
  if (tooMany(ip)) {
    return new Response(JSON.stringify({ ok: false, error: "rate-limited" }), {
      status: 429,
      headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const row = {
    kind: trunc(body.kind as string, 64) || "error",
    msg: trunc(body.msg as string, 600),
    stack: trunc(body.stack as string, 1800),
    url: trunc(body.url as string, 400),
    ua: trunc(body.ua as string, 220),
    ip,
  };

  // Always log to stdout — Vercel surfaces this in the function logs panel
  // even without a database. This is the minimum-viable observability.
  // eslint-disable-next-line no-console
  console.log("[client-error]", JSON.stringify(row));

  // Best-effort persistence — silent if table doesn't exist or env unset.
  try {
    const sb = getSupabase();
    if (sb) {
      void sb.from("client_errors").insert(row);
    }
  } catch { /* ignore */ }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json", ...cors.headers },
  });
}
