// api/cron/sourced-purge.ts — v199
//
// Google Places API TOS § 5.1(b): "You will not cache or store any Google
// Places data for longer than 30 days, except for limited place IDs that
// can be cached indefinitely for identity purposes."
//
// We do retain template_sends indefinitely (operator's own outreach
// record, derived data) but we MUST purge the raw sourced_prospects
// landing zone after 30 days.
//
// Also purges sourced_prospects rows that were never promoted (dup or
// no-contact) after 7 days — those are pure noise after dedupe.
//
// Runs weekly via vercel.json.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
}

export default async function handler(req: Request): Promise<Response> {
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401);
  if (!supabaseConfigured()) return j({ ok: true, purged: 0, reason: "supabase-not-configured" });
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString();
  const sevenDaysAgo  = new Date(Date.now() - 7  * 86400_000).toISOString();

  // 1) Everything older than 30 days — TOS hard limit.
  const r1 = await sb
    .from("sourced_prospects")
    .delete({ count: "exact" })
    .lt("created_at", thirtyDaysAgo);

  // 2) Stale dup/no-contact rows older than 7 days that never promoted.
  const r2 = await sb
    .from("sourced_prospects")
    .delete({ count: "exact" })
    .is("promoted_at", null)
    .not("skipped_reason", "is", null)
    .lt("created_at", sevenDaysAgo);

  return j({
    ok: true,
    ts: new Date().toISOString(),
    purged_30d_tos: r1.count ?? 0,
    purged_7d_stale: r2.count ?? 0,
    errors: [r1.error?.message, r2.error?.message].filter(Boolean),
  });
}
