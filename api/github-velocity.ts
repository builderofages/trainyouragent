// api/github-velocity.ts — v64
// Server-side cache + proxy for GitHub commit velocity used on /proof.
// Why this exists: the previous client-side fetch directly to api.github.com
// hit the unauthenticated 60-req/hour-per-IP rate limit on warm pages and
// rendered "see GitHub" fallback strings instead of real numbers. This
// endpoint coalesces traffic through ONE outbound call every 30 minutes
// (in-memory cache, warm Vercel function), so the KPI cards always show
// real commit counts.

export const config = { runtime: "edge" };

type Commit = { commit?: { author?: { date?: string } } };

type Payload = {
  today: number;
  last7d: number;
  last30d: number;
  totalFetched: number;
  generatedAt: string;
};

// In-memory cache. Vercel edge keeps warm instances for a short window, so
// most page loads will hit a cached value here. Cold starts re-fetch.
let cache: { ts: number; data: Payload } | null = null;
const TTL_MS = 30 * 60 * 1000; // 30 minutes

const REPO_URL =
  "https://api.github.com/repos/builderofages/trainyouragent/commits?per_page=100";

function json(body: unknown, status = 200, cacheStatus = "MISS") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // vercel.json forces no-store on /api/(.*) — these are still useful
      // for any proxy/CDN that doesn't override, and document intent.
      "cache-control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
      "x-cache": cacheStatus,
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, OPTIONS",
      },
    });
  }

  if (cache && Date.now() - cache.ts < TTL_MS) {
    return json(cache.data, 200, "HIT");
  }

  try {
    const headers: Record<string, string> = {
      "user-agent": "TrainYourAgent-Site/1.0 (+https://trainyouragent.com)",
      accept: "application/vnd.github+json",
    };
    // If a GITHUB_TOKEN env var is configured, use it to lift the rate limit.
    // Optional — works without it via the IP-quota of the Vercel edge node.
    const token = (globalThis as { process?: { env?: Record<string, string> } })
      ?.process?.env?.GITHUB_TOKEN;
    if (token) headers.authorization = `Bearer ${token}`;

    const r = await fetch(REPO_URL, { headers });
    if (!r.ok) {
      return json({ error: `github-${r.status}` }, 502, "MISS");
    }
    const commits = (await r.json()) as Commit[];
    if (!Array.isArray(commits)) {
      return json({ error: "github-bad-payload" }, 502, "MISS");
    }

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const sod = new Date(now);
    sod.setUTCHours(0, 0, 0, 0);
    const sodMs = sod.getTime();
    const weekAgo = now - 7 * day;
    const monthAgo = now - 30 * day;

    let today = 0;
    let last7d = 0;
    let last30d = 0;
    for (const c of commits) {
      const dStr = c.commit?.author?.date;
      if (!dStr) continue;
      const t = new Date(dStr).getTime();
      if (Number.isNaN(t)) continue;
      if (t >= sodMs) today += 1;
      if (t >= weekAgo) last7d += 1;
      if (t >= monthAgo) last30d += 1;
    }

    const data: Payload = {
      today,
      last7d,
      last30d,
      totalFetched: commits.length,
      generatedAt: new Date().toISOString(),
    };
    cache = { ts: now, data };
    return json(data, 200, "MISS");
  } catch {
    return json({ error: "github-unreachable" }, 502, "MISS");
  }
}
