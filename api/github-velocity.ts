// api/github-velocity.ts — v65
// Server-side cache + proxy for GitHub commit velocity used on /proof.
// v65 extends the response with the raw (trimmed) commit list, per-day
// buckets, longest streak, and most-active day so client components
// (CommitGraph, ShippedThisWeek, KPI cards) can share a single proxied
// fetch. Direct calls to api.github.com from the browser were getting
// CORS-throttled / rate-limited (60/hr per IP, unauthenticated).

export const config = { runtime: "edge" };

type RawCommit = {
  sha?: string;
  html_url?: string;
  commit?: { message?: string; author?: { name?: string; date?: string } };
};

type TrimmedCommit = {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string | null;
  url: string;
};

type Payload = {
  today: number;
  last7d: number;
  last30d: number;
  last91d: number;
  longestStreak: number;
  mostActiveDay: { day: string; count: number } | null;
  dayBuckets: Record<string, number>;
  commits: TrimmedCommit[];
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
    const token = (globalThis as { process?: { env?: Record<string, string> } })
      ?.process?.env?.GITHUB_TOKEN;
    if (token) headers.authorization = `Bearer ${token}`;

    const r = await fetch(REPO_URL, { headers });
    if (!r.ok) {
      return json({ error: `github-${r.status}` }, 502, "MISS");
    }
    const rawCommits = (await r.json()) as RawCommit[];
    if (!Array.isArray(rawCommits)) {
      return json({ error: "github-bad-payload" }, 502, "MISS");
    }

    // Trim each commit to the small set of fields the client uses. This
    // shrinks the payload from ~300KB to ~20KB.
    const commits: TrimmedCommit[] = rawCommits.map((c) => {
      const sha = c.sha || "";
      const rawMsg = c.commit?.message || "";
      const firstLine = rawMsg.split("\n")[0] || "";
      return {
        sha,
        shortSha: sha.slice(0, 7),
        message: firstLine.slice(0, 200),
        author: c.commit?.author?.name || "Unknown",
        date: c.commit?.author?.date || null,
        url: c.html_url || `https://github.com/builderofages/trainyouragent/commit/${sha}`,
      };
    });

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const sod = new Date(now);
    sod.setUTCHours(0, 0, 0, 0);
    const sodMs = sod.getTime();
    const weekAgo = now - 7 * day;
    const monthAgo = now - 30 * day;
    const ninetyOneAgo = now - 91 * day;

    let today = 0;
    let last7d = 0;
    let last30d = 0;

    // Build per-day buckets for the heatmap (last 91 days)
    const dayBuckets: Record<string, number> = {};
    for (const c of commits) {
      if (!c.date) continue;
      const t = new Date(c.date).getTime();
      if (Number.isNaN(t)) continue;
      if (t >= sodMs) today += 1;
      if (t >= weekAgo) last7d += 1;
      if (t >= monthAgo) last30d += 1;
      if (t < ninetyOneAgo) continue;
      const key = new Date(t).toISOString().slice(0, 10);
      dayBuckets[key] = (dayBuckets[key] || 0) + 1;
    }

    // Compute longest streak + most active day, walking 91 days back from today.
    let longestStreak = 0;
    let currentStreak = 0;
    let mostActiveDay: { day: string; count: number } | null = null;
    for (let i = 0; i < 91; i++) {
      const d = new Date(now - i * day);
      const key = d.toISOString().slice(0, 10);
      const count = dayBuckets[key] || 0;
      if (count > 0) {
        currentStreak += 1;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
      if (!mostActiveDay || count > mostActiveDay.count) {
        mostActiveDay = { day: key, count };
      }
    }

    const last91d = Object.values(dayBuckets).reduce((a, b) => a + b, 0);

    const data: Payload = {
      today,
      last7d,
      last30d,
      last91d,
      longestStreak,
      mostActiveDay,
      dayBuckets,
      commits,
      totalFetched: commits.length,
      generatedAt: new Date().toISOString(),
    };
    cache = { ts: now, data };
    return json(data, 200, "MISS");
  } catch {
    return json({ error: "github-unreachable" }, 502, "MISS");
  }
}
