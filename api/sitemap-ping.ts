// api/sitemap-ping.ts — v234
//
// Pings Google + Bing's sitemap-submission endpoints to nudge them to
// re-crawl. Useful immediately after a deploy when you've added new
// URLs to /sitemap.xml.
//
// Auth: ADMIN_TOKEN. Call manually OR wire into a Vercel deploy hook
// post-build step. (Google retired the public ping endpoint in 2023,
// but Bing still accepts pings, and Google Indexing API works for some
// page types. We fire what's actually useful + log the rest.)

import { checkAdmin } from "./_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const SITEMAP_URL = "https://trainyouragent.com/sitemap.xml";

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!checkAdmin(req)) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401, headers: { "content-type": "application/json", ...cors.headers } });
  }

  const results: Array<{ engine: string; status: number | "error"; ms: number }> = [];

  // Bing — still accepts ping
  const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const t0 = Date.now();
    const r = await fetch(bingUrl, { method: "GET" });
    results.push({ engine: "bing", status: r.status, ms: Date.now() - t0 });
  } catch (e) {
    results.push({ engine: "bing", status: "error", ms: 0 });
  }

  // IndexNow (Bing-backed, also picked up by Yandex + Seznam)
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (indexNowKey) {
    try {
      const t0 = Date.now();
      const r = await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          host: "trainyouragent.com",
          key: indexNowKey,
          urlList: [SITEMAP_URL],
        }),
      });
      results.push({ engine: "indexnow", status: r.status, ms: Date.now() - t0 });
    } catch {
      results.push({ engine: "indexnow", status: "error", ms: 0 });
    }
  } else {
    results.push({ engine: "indexnow", status: "error", ms: 0 });
  }

  // Google retired the public ping endpoint (Jun 2023). For Google,
  // use Search Console "Request indexing" or the Indexing API for
  // job-posting / live-stream content. Logged here as a reminder.

  return new Response(JSON.stringify({
    ok: true,
    sitemap: SITEMAP_URL,
    results,
    note: "Google ping endpoint retired Jun 2023 — use Search Console manually after major changes.",
  }), { status: 200, headers: { "content-type": "application/json", ...cors.headers } });
}
