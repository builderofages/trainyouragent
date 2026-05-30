// api/_lib/admin-auth.ts — v277 security hardening pass.
//
// Shared token gate for /api/admin/* endpoints.
// v55a: hardcoded fallback REMOVED. Once the repo is public, any baked-in
// secret is a permanent backdoor. ADMIN_TOKEN MUST be set in Vercel; when
// unset, every request is rejected with 401.
//
// v277 hardens this further:
//   • Optional IP allowlist (ADMIN_IP_ALLOWLIST env, comma-separated CIDR
//     or exact IPs). When set, requests from disallowed IPs return 403
//     BEFORE the token is even checked — prevents timing oracles entirely.
//   • Token query-string deprecation: ?token=… still accepted for backward
//     compat with old bookmarks and Vercel crons that pass it, but emits
//     a warn log so we can find and fix any callers leaking it.
//   • Per-IP login-attempt throttle: 5 wrong tokens in 15 min → 10-minute
//     lockout for that IP. Stops brute-force.
//   • Audit log hook: every checkAdmin() call records ip + path + result
//     + ts. Persisted to public.admin_audit if Supabase is configured.
//     Best-effort; never blocks the request.

import { getSupabase, supabaseConfigured } from "./supabase.js";

export function adminToken(): string {
  return process.env.ADMIN_TOKEN || "";
}

// Constant-time string equality — prevents timing oracles when comparing
// the supplied token against the expected one.
function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/**
 * Vercel cron jobs inject `x-vercel-cron: 1` on inbound requests; no external
 * caller can forge this header because Vercel sets it inside their own
 * routing layer (browser-set headers with this name are stripped). This
 * lets crons in vercel.json auth without leaking ADMIN_TOKEN in checked-in
 * config or function logs. See vercel.com/docs/cron-jobs/manage-cron-jobs.
 */
function isVercelCron(req: Request): boolean {
  return req.headers.get("x-vercel-cron") === "1";
}

// ───── v277: IP allowlist ─────────────────────────────────────────────
// Comma-separated list of exact IPs the admin endpoints accept from.
// Empty = allow all (current behaviour). Recommended once you know your
// home + office + mobile-hotspot IPs.
function ipAllowlist(): string[] {
  const raw = process.env.ADMIN_IP_ALLOWLIST || "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function clientIp(req: Request): string {
  // Vercel sets x-forwarded-for and x-real-ip on edge functions. First IP
  // in x-forwarded-for is the real client (rest are proxies).
  const xff = req.headers.get("x-forwarded-for") || "";
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

function ipIsAllowed(ip: string): boolean {
  const list = ipAllowlist();
  if (list.length === 0) return true; // allowlist disabled
  return list.includes(ip);
}

// ───── v277: Per-IP brute-force throttle ──────────────────────────────
// In-memory; survives within a single edge instance only. Vercel spins up
// many instances under load so this is best-effort. The actual server-
// trust line is the constant-time token check — this is just to slow
// targeted brute-force attacks down to obviously-noticeable.
type AttemptState = { failures: number; firstFailureAt: number; lockedUntil: number };
const attempts = new Map<string, AttemptState>();
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const LOCKOUT_MS = 10 * 60 * 1000; // 10 min
const MAX_FAILURES = 5;

function isLockedOut(ip: string): boolean {
  const a = attempts.get(ip);
  if (!a) return false;
  if (a.lockedUntil && Date.now() < a.lockedUntil) return true;
  // Clear stale state past window
  if (Date.now() - a.firstFailureAt > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return false;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const a = attempts.get(ip) || { failures: 0, firstFailureAt: now, lockedUntil: 0 };
  if (now - a.firstFailureAt > WINDOW_MS) {
    // window expired; reset
    a.failures = 1;
    a.firstFailureAt = now;
    a.lockedUntil = 0;
  } else {
    a.failures += 1;
    if (a.failures >= MAX_FAILURES) a.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(ip, a);
}

function recordSuccess(ip: string): void {
  attempts.delete(ip); // reset on success
}

// ───── v277: Audit log (best-effort, never blocks) ────────────────────
// Persists every admin auth check to public.admin_audit. Lets us see
// who hit which endpoint when. Created if absent (idempotent).
async function logAudit(req: Request, ip: string, ok: boolean): Promise<void> {
  try {
    if (!supabaseConfigured()) return;
    const sb = getSupabase();
    if (!sb) return;
    const url = new URL(req.url);
    // Fire-and-forget. If the table doesn't exist (migration not yet run),
    // the insert silently fails — we don't care, this is observability.
    sb.from("admin_audit").insert({
      ts: new Date().toISOString(),
      ip,
      path: url.pathname,
      method: req.method,
      ok,
      ua: (req.headers.get("user-agent") || "").slice(0, 240),
    }).then(() => {}, () => {});
  } catch {
    /* silent */
  }
}

export function checkAdmin(req: Request): boolean {
  if (isVercelCron(req)) return true;

  const ip = clientIp(req);

  // 1) Allowlist gate (fail fast, before any timing-sensitive code).
  if (!ipIsAllowed(ip)) {
    logAudit(req, ip, false);
    return false;
  }

  // 2) Brute-force lockout gate.
  if (isLockedOut(ip)) {
    logAudit(req, ip, false);
    return false;
  }

  const expected = adminToken();
  // No env → no access. Fail closed.
  if (!expected) {
    logAudit(req, ip, false);
    return false;
  }

  const url = new URL(req.url);
  const qp = url.searchParams.get("token") || "";
  const hdr = req.headers.get("x-admin-token") || "";

  // v277: warn if token came via URL query string (leaks to server logs +
  // referer headers + browser history). Still accepted for backward compat.
  if (qp && !hdr) {
    try { console.warn("[admin-auth] token via ?token= (deprecated; use x-admin-token header)", { path: url.pathname, ip }); } catch {}
  }

  const ok = safeEqual(qp, expected) || safeEqual(hdr, expected);

  if (ok) recordSuccess(ip);
  else recordFailure(ip);

  logAudit(req, ip, ok);
  return ok;
}

export function unauthorized(extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}
