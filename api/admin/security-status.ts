// api/admin/security-status.ts — v278
//
// Reads from public.admin_audit (created by v277 migration) to surface a
// live security overview for the cockpit's new Security panel:
//   - Total admin calls today + failed-auth count today
//   - Last 10 failed-auth attempts (ip, path, ts, ua) so the operator can
//     spot brute-force patterns at a glance
//   - Distinct IPs seen on successful admin calls in the last 7 days
//     (the implicit allowlist — useful when actually setting ADMIN_IP_ALLOWLIST)
//   - Env-var presence map for the security-relevant configs
//
// Auth: ADMIN_TOKEN required (same gate as every /api/admin/*).
// Read-only. No writes. Safe to call repeatedly.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdminAsync, unauthorized } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200, cors: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(o), {
    status, headers: { "content-type": "application/json", "cache-control": "no-cache", ...cors },
  });
}

type AuditRow = {
  ts: string;
  ip: string;
  path: string;
  method: string;
  ok: boolean;
  ua: string | null;
};

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!(await checkAdminAsync(req))) return unauthorized(cors.headers);

  // Env-var posture is always returned (doesn't depend on Supabase).
  const env = {
    adminToken:        !!process.env.ADMIN_TOKEN,
    adminIpAllowlist:  !!process.env.ADMIN_IP_ALLOWLIST,
    adminIpCount:      (process.env.ADMIN_IP_ALLOWLIST || "").split(",").map((s) => s.trim()).filter(Boolean).length,
    supabase:          supabaseConfigured(),
    stripe:            !!process.env.STRIPE_SECRET_KEY,
    stripeWebhook:     !!process.env.STRIPE_WEBHOOK_SECRET,
    resend:            !!process.env.RESEND_API_KEY,
    resendWebhook:     !!process.env.RESEND_WEBHOOK_SECRET,
    anthropic:         !!process.env.ANTHROPIC_API_KEY,
    elevenlabs:        !!process.env.ELEVENLABS_API_KEY,
    metaPixel:         !!process.env.META_PIXEL_ID,
    metaCapi:          !!process.env.META_CAPI_ACCESS_TOKEN,
  };

  if (!supabaseConfigured()) {
    return j({ ok: true, env, audit: { skipped: "supabase-not-configured" } }, 200, cors.headers);
  }

  const sb = getSupabase();
  if (!sb) {
    return j({ ok: true, env, audit: { skipped: "supabase-init-failed" } }, 200, cors.headers);
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 7 * 86400_000);

  try {
    // Three parallel queries. Each one falls back to [] gracefully if the
    // admin_audit table hasn't been migrated yet (v277). Cockpit panel
    // shows "audit table missing — run v277_admin_audit.sql" in that case.
    const [todayR, failedR, weekIpsR] = await Promise.all([
      sb.from("admin_audit").select("ok").gte("ts", todayStart.toISOString()),
      sb.from("admin_audit").select("ts, ip, path, method, ok, ua").eq("ok", false).order("ts", { ascending: false }).limit(10),
      sb.from("admin_audit").select("ip").eq("ok", true).gte("ts", weekAgo.toISOString()),
    ]);

    const tableMissing = (r: { error: { message: string } | null } | { error: null }): boolean =>
      !!(r.error && /find the table|does not exist|schema cache/i.test((r.error as { message: string }).message));

    if (tableMissing(todayR) || tableMissing(failedR) || tableMissing(weekIpsR)) {
      return j({
        ok: true,
        env,
        audit: {
          skipped: "table-missing",
          hint: "Run supabase/migrations/v277_admin_audit.sql in your Supabase SQL editor.",
        },
      }, 200, cors.headers);
    }

    const todayRows = (todayR.data as { ok: boolean }[]) || [];
    const todayTotal = todayRows.length;
    const todayFailed = todayRows.filter((r) => !r.ok).length;

    const failedAttempts = ((failedR.data as AuditRow[]) || []).map((r) => ({
      ts: r.ts,
      ip: r.ip,
      path: r.path,
      method: r.method,
      ua: (r.ua || "").slice(0, 80),
    }));

    const ipsRows = (weekIpsR.data as { ip: string }[]) || [];
    const ipFreq = new Map<string, number>();
    for (const r of ipsRows) ipFreq.set(r.ip, (ipFreq.get(r.ip) || 0) + 1);
    const distinctIps7d = Array.from(ipFreq.entries())
      .map(([ip, hits]) => ({ ip, hits }))
      .sort((a, b) => b.hits - a.hits);

    return j({
      ok: true,
      env,
      audit: {
        todayTotal,
        todayFailed,
        failedAttempts,
        distinctIps7d,
        distinctIpCount7d: distinctIps7d.length,
      },
    }, 200, cors.headers);
  } catch (e) {
    return j({ ok: true, env, audit: { skipped: "query-failed", detail: String((e as Error).message || e) } }, 200, cors.headers);
  }
}
