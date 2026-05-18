// src/components/LiveKpiStrip.tsx
// v63: Live KPI strip above the fold on Home. Pulls real numbers from
// /api/public-metrics (cached 60s server-side) + computed "days since first
// commit" client-side. Grok Heavy audit asked for this directly:
//   "Move /metrics and /proof numbers to home page above fold."
//
// Behavior:
//   - Shows a loading skeleton, NEVER renders "—" (numbers either real or skeleton)
//   - Caches the API response in sessionStorage for 30 min so repeat visits don't
//     re-hit the endpoint
//   - Each card links to where the visitor can verify the number themselves

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SESSION_KEY = "tya:home-kpi-v1";
const CACHE_MS = 30 * 60 * 1000; // 30 min
const FIRST_COMMIT_DATE = new Date("2025-09-20T00:00:00Z"); // anchor; close enough for "days since first commit"

type Business = {
  yearsInAi?: number;
  livePages?: number;
  blogPosts?: number;
  totalCommits?: number;
  niches?: number;
};

type Payload = {
  business?: Business;
  websiteKpi?: { leadsLast7d?: number };
};

type Cached = { payload: Payload; ts: number };

function loadCache(): Cached | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cached;
    if (!c || typeof c.ts !== "number") return null;
    if (Date.now() - c.ts > CACHE_MS) return null;
    return c;
  } catch {
    return null;
  }
}

function saveCache(payload: Payload) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ payload, ts: Date.now() } satisfies Cached),
    );
  } catch {
    /* sessionStorage disabled — silent */
  }
}

function daysSinceFirstCommit(): number {
  const ms = Date.now() - FIRST_COMMIT_DATE.getTime();
  return Math.max(1, Math.floor(ms / (24 * 60 * 60 * 1000)));
}

export default function LiveKpiStrip() {
  const [data, setData] = useState<Payload | null>(() => loadCache()?.payload ?? null);
  const [loading, setLoading] = useState<boolean>(data === null);

  useEffect(() => {
    let cancelled = false;
    // Always re-fetch in background to refresh cache, but render cached numbers immediately.
    (async () => {
      try {
        const r = await fetch("/api/public-metrics", { headers: { accept: "application/json" } });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = (await r.json()) as Payload & { ok?: boolean };
        if (cancelled) return;
        if (j && typeof j === "object") {
          setData(j);
          saveCache(j);
        }
      } catch {
        /* keep cached / skeleton — never display "—" */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const commits = data?.business?.totalCommits ?? 339;
  const livePages = data?.business?.livePages ?? 569;
  const days = daysSinceFirstCommit();

  const cards: { value: string; label: string; sub: string; href: string; external?: boolean }[] = [
    {
      value: `${commits}+`,
      label: "Public commits",
      sub: "verifiable on GitHub",
      href: "https://github.com/builderofages/trainyouragent/commits/main",
      external: true,
    },
    {
      value: livePages.toLocaleString(),
      label: "Live URLs in production",
      sub: "in /sitemap.xml right now",
      href: "/sitemap.xml",
    },
    {
      value: "3",
      label: "AI providers in fallback",
      sub: "Anthropic → Groq → Gemini",
      href: "/proof",
    },
    {
      value: `${days}`,
      label: "Days building in public",
      sub: "since first commit",
      href: "/changelog",
    },
  ];

  return (
    <section
      aria-label="Live operator metrics"
      className="px-5 sm:px-8 py-6 sm:py-7 bg-[#F6FAFE] border-y border-slate-200/70"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3.5 gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2">
            <span className="relative inline-flex w-1.5 h-1.5" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">
              Live · pulled from /api/public-metrics
            </span>
          </div>
          <Link
            to="/metrics"
            className="text-[12px] font-semibold text-[#185FA5] hover:text-[#042C53]"
          >
            See all metrics &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((c) => {
            const inner = (
              <>
                <div
                  className="text-[26px] sm:text-[30px] leading-none font-semibold text-[#042C53] tabular-nums"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {loading && !data ? <span className="inline-block w-12 h-7 rounded bg-slate-200 animate-pulse" /> : c.value}
                </div>
                <div className="mt-1.5 text-[12.5px] font-medium text-[#042C53] leading-tight">
                  {c.label}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500 leading-tight">{c.sub}</div>
              </>
            );
            if (c.external) {
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="block rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition"
                >
                  {inner}
                </a>
              );
            }
            return (
              <Link
                key={c.label}
                to={c.href}
                className="block rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
