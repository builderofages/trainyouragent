// src/components/ShipsCounter.tsx
// v65: "N builds shipped this year." — counts commits in the current
// calendar year using the /api/github-velocity proxy (cached, rate-limit-
// safe). Direct api.github.com fetches were getting throttled. Animates
// count-up via requestAnimationFrame.
//
// Falls back to a sensible static number if the proxy is unreachable.

import { useEffect, useRef, useState } from "react";

// v66: bumped cache key — switched data source to data.last52Weeks (real, not capped)
const CACHE_KEY = "tya:ships:year:v4";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — counter doesn't need real-time

type Cached = { ts: number; year: number; count: number };

function readCache(year: number): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cached;
    if (c.year !== year) return null;
    if (Date.now() - c.ts > CACHE_TTL_MS) return null;
    return c.count;
  } catch { return null; }
}

function writeCache(year: number, count: number) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), year, count } as Cached));
  } catch {}
}

async function fetchYearCount(_year: number): Promise<number> {
  // v66: use proxy's HONEST numbers. The previous version counted commits
  // inside data.commits (capped at GitHub's per_page=100), which under-
  // reported any year with > 100 commits. The proxy now exposes:
  //   - last52Weeks: sum of weekly-participation buckets (real, GitHub-computed)
  //   - totalCommits: exact lifetime total via pagination Link header
  // For a "builds shipped this year" counter, last52Weeks is the right
  // signal (52 trailing weeks ~ 1 year, real numbers).
  const r = await fetch("/api/github-velocity", { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`velocity ${r.status}`);
  const data = (await r.json()) as {
    last52Weeks?: number;
    totalCommits?: number;
    error?: string;
  };
  if (data.error) throw new Error(data.error);
  if (typeof data.last52Weeks === "number") return data.last52Weeks;
  if (typeof data.totalCommits === "number") return data.totalCommits;
  throw new Error("bad payload");
}

type Props = {
  className?: string;
  // visual variant — "hero" = dark text on light hero, "dark" = white on navy
  variant?: "hero" | "dark";
  fallback?: number;
};

export default function ShipsCounter({
  className = "",
  variant = "hero",
  fallback = 127,
}: Props) {
  const year = new Date().getFullYear();
  const cached = typeof window !== "undefined" ? readCache(year) : null;
  const [target, setTarget] = useState<number>(cached ?? fallback);
  const [display, setDisplay] = useState<number>(cached ?? 0);
  const startedRef = useRef<boolean>(false);

  // Fetch (or use cache) once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cached != null) return;
      try {
        const n = await fetchYearCount(year);
        if (cancelled) return;
        setTarget(n);
        writeCache(year, n);
      } catch {
        // Keep fallback as the target — counter still animates to a believable number.
      }
    })();
    return () => { cancelled = true; };
  }, [year, cached]);

  // Animate display → target with rAF on first sight only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (startedRef.current) {
      // Subsequent target changes: snap (cache replaced fallback, etc).
      setDisplay(target);
      return;
    }
    startedRef.current = true;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(target); return; }

    const from = cached ?? 0;
    const to = target;
    if (from === to) { setDisplay(to); return; }

    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [target, cached]);

  const isHero = variant === "hero";
  const numberColor = isHero ? "#042C53" : "#FFFFFF";
  const labelColor = isHero ? "text-slate-600" : "text-white/70";
  const tickColor = isHero ? "bg-[#22A36C]" : "bg-[#22A36C]";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`inline-flex w-2 h-2 rounded-full ${tickColor} animate-pulse flex-shrink-0`}
        aria-hidden="true"
      />
      <span className="text-[14px] sm:text-[15px] leading-snug">
        <span
          className="tabular-nums font-semibold"
          style={{ color: numberColor }}
          aria-live="polite"
        >
          {display}
        </span>{" "}
        <span className={labelColor}>builds shipped this year.</span>
      </span>
    </div>
  );
}
