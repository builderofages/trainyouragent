// api/reviews-public.ts — v238
//
// Public read-only endpoint that returns only APPROVED reviews from
// public.reviews. Drives the /customers page testimonial carousel.
//
// No auth. Aggressive cache (60s edge TTL) so it can serve from many
// regions without hammering Supabase.
//
// Returns: { ok: true, reviews: [{ name, company, niche, video_url, quote, ts }] }

import { getSupabase } from "./_lib/supabase.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

type Row = {
  name: string;
  company: string;
  niche: string;
  video_url: string | null;
  quote: string | null;
  ts: string;
};

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get("limit") || "20", 10)));
  const niche = (url.searchParams.get("niche") || "").trim();

  const sb = getSupabase();
  if (!sb) {
    return new Response(JSON.stringify({ ok: true, reviews: [], skipped: "supabase-not-configured" }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "public, max-age=60, s-maxage=60", ...cors.headers },
    });
  }

  try {
    let q = sb.from("reviews").select("name,company,niche,video_url,quote,ts").eq("status", "approved").eq("permission_granted", true).order("ts", { ascending: false }).limit(limit);
    if (niche) q = q.eq("niche", niche);
    const { data, error } = await q;
    if (error) {
      // Table likely not migrated yet — treat as empty, not error.
      return new Response(JSON.stringify({ ok: true, reviews: [], skipped: error.message || "table-missing" }), {
        status: 200,
        headers: { "content-type": "application/json", "cache-control": "public, max-age=30, s-maxage=30", ...cors.headers },
      });
    }
    return new Response(JSON.stringify({ ok: true, reviews: data as Row[] }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "public, max-age=60, s-maxage=60", ...cors.headers },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: true, reviews: [], skipped: String((e as Error).message || e) }), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "public, max-age=30, s-maxage=30", ...cors.headers },
    });
  }
}
