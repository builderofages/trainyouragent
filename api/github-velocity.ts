// api/github-velocity.ts — v66
// HONEST. No more per_page caps reported as totals.
// Pulls REAL totals via pagination Link header + weekly buckets via
// GitHub's stats/participation. Direct calls to api.github.com from the
// browser were getting rate-limited (60/IP/hr unauthenticated); the proxy
// also lets us paginate cheaply by only fetching the LAST page once we've
// read the Link header from page 1.

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
  // HONEST totals
  totalCommits: number;
  last1Week: number;
  last4Weeks: number;
  last13Weeks: number;
  last52Weeks: number;
  todayCount: number;

  // Heatmap data
  weeklyAll: number[]; // 52 weekly counts oldest->newest
  dayBuckets: Record<string, number>; // last ~100 commits, per-day count

  // Most active week
  mostActiveWeek: { weeksAgo: number; count: number } | null;

  // Latest commits for ShippedThisWeek widget
  commits: TrimmedCommit[];

  // Honest disclosure
  methodology: {
    totalCommits: string;
    weeklyBuckets: string;
    dayBuckets: string;
    cacheTTL: string;
  };
  generatedAt: string;
};

const REPO = "builderofages/trainyouragent";

// In-memory cache. Vercel edge keeps warm instances for a short window, so
// most page loads will hit a cached value here. Cold starts re-fetch.
let cache: { ts: number; data: Payload } | null = null;
const TTL_MS = 30 * 60 * 1000; // 30 minutes

function json(body: unknown, status = 200, cacheStatus = "MISS") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
      "x-cache": cacheStatus,
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
    },
  });
}

async function ghFetch(path: string): Promise<Response> {
  const url = `https://api.github.com${path}`;
  const headers: Record<string, string> = {
    "user-agent": "TrainYourAgent-Site/1.0 (+https://trainyouragent.com)",
    accept: "application/vnd.github+json",
  };
  const token = (globalThis as { process?: { env?: Record<string, string> } })
    ?.process?.env?.GITHUB_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;
  return fetch(url, { headers });
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
    // 1. Get latest 100 commits for ShippedThisWeek + per-day buckets
    const latestR = await ghFetch(`/repos/${REPO}/commits?per_page=100`);
    if (!latestR.ok) {
      return json({ error: `github-commits-${latestR.status}` }, 502, "MISS");
    }
    const latestRaw = (await latestR.json()) as RawCommit[];
    if (!Array.isArray(latestRaw)) {
      return json({ error: "github-bad-payload" }, 502, "MISS");
    }

    const latestCommits: TrimmedCommit[] = latestRaw.map((c) => {
      const sha = c.sha || "";
      const rawMsg = c.commit?.message || "";
      const firstLine = rawMsg.split("\n")[0] || "";
      return {
        sha,
        shortSha: sha.slice(0, 7),
        message: firstLine.slice(0, 200),
        author: c.commit?.author?.name || "Unknown",
        date: c.commit?.author?.date || null,
        url: c.html_url || `https://github.com/${REPO}/commit/${sha}`,
      };
    });

    // 2. Get REAL total via pagination Link header. GitHub returns a "Link"
    // header containing rel="last" — we only need to fetch the last page
    // (not all pages) to compute the exact total.
    let totalCommits = latestCommits.length;
    const linkHeader = latestR.headers.get("link") || "";
    const lastMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    if (lastMatch) {
      const lastPage = parseInt(lastMatch[1], 10);
      if (lastPage > 1) {
        const lastR = await ghFetch(`/repos/${REPO}/commits?per_page=100&page=${lastPage}`);
        if (lastR.ok) {
          const lastPageCommits = (await lastR.json()) as RawCommit[];
          if (Array.isArray(lastPageCommits)) {
            totalCommits = (lastPage - 1) * 100 + lastPageCommits.length;
          } else {
            totalCommits = lastPage * 100;
          }
        } else {
          // Conservative fallback: assume last page is full.
          totalCommits = lastPage * 100;
        }
      }
    }

    // 3. Weekly participation (52 weeks of weekly commit counts)
    // Note: GitHub computes this async; first call can return 202 with an
    // empty body. Retry once after a brief delay.
    let weeklyAll: number[] = [];
    const partR = await ghFetch(`/repos/${REPO}/stats/participation`);
    if (partR.ok) {
      const part = (await partR.json()) as { all?: number[] };
      if (part && Array.isArray(part.all)) weeklyAll = part.all;
    }
    if (weeklyAll.length === 0 || weeklyAll.every((n) => n === 0)) {
      await new Promise((r) => setTimeout(r, 1500));
      const partR2 = await ghFetch(`/repos/${REPO}/stats/participation`);
      if (partR2.ok) {
        const part2 = (await partR2.json()) as { all?: number[] };
        if (part2 && Array.isArray(part2.all)) weeklyAll = part2.all;
      }
    }

    // 4. Compute REAL numbers from participation (last 52 weeks)
    const last1Week = weeklyAll.slice(-1).reduce((a, b) => a + b, 0);
    const last4Weeks = weeklyAll.slice(-4).reduce((a, b) => a + b, 0);
    const last13Weeks = weeklyAll.slice(-13).reduce((a, b) => a + b, 0); // ≈ 91 days
    const last52Weeks = weeklyAll.reduce((a, b) => a + b, 0);

    // 5. Per-day buckets from the latest 100 (for "today" precision + heatmap intensity)
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const dayBuckets: Record<string, number> = {};
    let todayCount = 0;
    for (const c of latestCommits) {
      if (!c.date) continue;
      const t = new Date(c.date).getTime();
      if (Number.isNaN(t)) continue;
      const key = new Date(t).toISOString().slice(0, 10);
      dayBuckets[key] = (dayBuckets[key] || 0) + 1;
      if (t >= todayMs) todayCount += 1;
    }

    // 6. Find most-active week from participation
    let mostActiveWeek: { weeksAgo: number; count: number } | null = null;
    weeklyAll.forEach((count, idx) => {
      const weeksAgo = weeklyAll.length - 1 - idx;
      if (!mostActiveWeek || count > mostActiveWeek.count) {
        mostActiveWeek = { weeksAgo, count };
      }
    });

    const data: Payload = {
      totalCommits,
      last1Week,
      last4Weeks,
      last13Weeks,
      last52Weeks,
      todayCount,
      weeklyAll,
      dayBuckets,
      mostActiveWeek,
      commits: latestCommits,
      methodology: {
        totalCommits: "via /commits pagination Link header (Last-page * 100 + count of last page)",
        weeklyBuckets: "via /stats/participation (52 weekly counts, GitHub-computed)",
        dayBuckets: "derived from latest 100 commits only (per-day count, recent activity)",
        cacheTTL: "30 min server-side + client localStorage v4",
      },
      generatedAt: new Date().toISOString(),
    };
    cache = { ts: now, data };
    return json(data, 200, "MISS");
  } catch (e) {
    return json({ error: "github-unreachable", message: String(e) }, 502, "MISS");
  }
}
