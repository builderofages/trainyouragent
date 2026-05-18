// src/components/ShippedThisWeek.tsx — v65
// v65: switched from direct api.github.com fetch to /api/github-velocity
// server-side proxy. The unauthenticated GitHub REST API caps anonymous
// IPs at 60 req/hr, which caused "Commits cached — refresh in a few
// minutes." to render on warm pages. The proxy returns a trimmed list
// of the last 100 commits (sha, shortSha, message, author, date, url),
// already first-line truncated, so this component just slices the first 10.

import { useEffect, useState } from "react";

type Commit = {
  sha: string;
  message: string;
  date: string; // ISO
  url: string;
};

const REPO_BASE = "https://github.com/builderofages/trainyouragent/commit/";
const CACHE_KEY = "tya:shipped:cache:v3";
const CACHE_TS = "tya:shipped:ts:v3";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CACHE_MAX_AGE = 1000 * 60 * 30; // 30 min

function relTime(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day}d ago`;
  if (day < 30) return `${Math.floor(day / 7)}w ago`;
  return new Date(ms).toLocaleDateString();
}

function trunc(s: string, n: number) {
  s = (s || "").split("\n")[0] || "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default function ShippedThisWeek({ className = "" }: { className?: string }) {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [stale, setStale] = useState(false);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let alive = true;

    // Hydrate from cache first.
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as Commit[];
        if (Array.isArray(arr) && arr.length) setCommits(arr);
      }
    } catch { /* ignore */ }

    (async () => {
      try {
        // v65: server-side proxy. Trimmed payload (~20KB) with shortSha,
        // message, author, date, url already populated.
        const res = await fetch("/api/github-velocity", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          if (res.status === 403 || res.status === 429) {
            setStale(true);
            return;
          }
          throw new Error(`velocity ${res.status}`);
        }
        const data = (await res.json()) as {
          commits?: Array<{
            sha: string;
            message: string;
            date: string | null;
            url: string;
          }>;
          error?: string;
        };
        if (data.error || !Array.isArray(data.commits)) {
          throw new Error(data.error || "bad payload");
        }
        const list: Commit[] = data.commits.slice(0, 10).map((c) => ({
          sha: c.sha,
          message: c.message || "(no message)",
          date: c.date || new Date().toISOString(),
          url: c.url || `${REPO_BASE}${c.sha}`,
        }));
        if (!alive) return;
        setCommits(list);
        setStale(false);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
          localStorage.setItem(CACHE_TS, String(Date.now()));
        } catch { /* ignore */ }
      } catch (e) {
        if (!alive) return;
        // If we already rendered cache, just mark as stale.
        if (commits && commits.length) setStale(true);
        else setErr((e as Error).message || "fetch failed");
      }
    })();

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-label="Shipped this week"
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 ${className}`}
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[16px] font-semibold text-[#042C53]">
            Shipped this week
          </h3>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold tracking-[0.1em] uppercase">
            <span className="relative inline-flex w-1.5 h-1.5" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-70 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>
        <a
          href="https://github.com/builderofages/trainyouragent/commits/main"
          target="_blank"
          rel="noopener"
          className="text-[12px] text-[#185FA5] hover:text-[#042C53] font-medium"
        >
          All commits →
        </a>
      </div>

      {err && !commits && (
        <p className="text-[13px] text-slate-500">
          Commits cached — refresh in a few minutes.
        </p>
      )}

      {commits && commits.length > 0 && (
        <ul className="space-y-2.5">
          {commits.map((c) => (
            <li
              key={c.sha}
              className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 text-[13.5px]"
            >
              <span className="flex-shrink-0 w-20 text-slate-500 text-[12px] tabular-nums">
                {relTime(new Date(c.date).getTime())}
              </span>
              <span className="text-[#042C53] flex-1">{trunc(c.message, 70)}</span>
              <a
                href={c.url}
                target="_blank"
                rel="noopener"
                className="text-[11px] font-mono text-[#185FA5] hover:text-[#042C53] tabular-nums"
                aria-label={`View diff for commit ${c.sha.slice(0, 7)}`}
              >
                {c.sha.slice(0, 7)}
              </a>
            </li>
          ))}
        </ul>
      )}

      {commits === null && !err && (
        <ul className="space-y-2.5 animate-pulse" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="h-4 rounded bg-slate-100" />
          ))}
        </ul>
      )}

      {stale && (
        <p className="mt-4 text-[11px] text-slate-400">
          Commits cached — refresh in a few minutes.
        </p>
      )}
    </section>
  );
}
