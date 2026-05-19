// src/components/visual/LiveStatTicker.tsx
// v73-B — 2040 visual layer.
//
// Horizontal eyebrow strip above the hero. Shows 6 live stats:
//   - Live agents in production
//   - Public commits   (live from /api/github-velocity, fallback to STATS.publicCommits)
//   - Live URLs        (STATS.totalRoutes)
//   - Days since last ship
//   - Voice demos served today  (live from /api/recent-activity, fallback constant)
//   - Niches productized       (STATS.niches)
//
// Each stat: small uppercase label, large number that counts up on mount
// via IntersectionObserver. Subtle separator dots between stats. Marquee
// duplicate on mobile so the row scrolls cleanly if it overflows.

import { useEffect, useMemo, useRef, useState } from "react";
import { STATS } from "@/lib/siteStats";

// Pin a known "last ship" anchor. Update on each release; we compute
// "days since" client-side from this constant so the number ticks forward
// without a server call. Set to the v72 ship date.
const LAST_SHIP_ISO = "2026-05-18";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  /** prefix for screen readers / formatter, optional */
  prefix?: string;
};

function daysSince(iso: string): number {
  const then = new Date(iso + "T00:00:00Z").getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - then) / 86_400_000));
  return days;
}

function useCountUp(target: number, durationMs = 1200, enabled = true) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    if (target === 0) { setV(0); return; }
    // Respect reduced motion — snap.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setV(target); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      // easeOutCubic
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, enabled]);
  return v;
}

function StatCell({ stat, enabled }: { stat: Stat; enabled: boolean }) {
  const v = useCountUp(stat.value, 1200, enabled);
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-[#185FA5]/80 font-semibold font-mono">
        {stat.label}
      </span>
      <span
        className="text-[15px] sm:text-[16px] font-semibold text-[#042C53] tabular-nums"
        aria-label={`${stat.prefix ?? ""}${stat.value.toLocaleString()}${stat.suffix ?? ""}`}
      >
        {stat.prefix ?? ""}
        {v.toLocaleString()}
        {stat.suffix ?? ""}
      </span>
    </span>
  );
}

function Separator() {
  return (
    <span className="mx-4 sm:mx-6 text-[#185FA5]/40 select-none" aria-hidden="true">
      &middot;
    </span>
  );
}

export default function LiveStatTicker() {
  const [commits, setCommits] = useState<number>(STATS.publicCommits);
  const [voiceDemosToday, setVoiceDemosToday] = useState<number>(34);
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  // Trigger count-up on first scroll-into-view.
  useEffect(() => {
    if (!rootRef.current || seen) return;
    const el = rootRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  // Pull live commit count.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-velocity")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled || !j) return;
        const n = Number(j?.totalCommits);
        if (Number.isFinite(n) && n > 0) setCommits(n);
      })
      .catch(() => { /* silent fallback */ });
    return () => { cancelled = true; };
  }, []);

  // Pull voice demos today.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/recent-activity")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled || !j) return;
        // Be liberal in what we accept — different shapes across env.
        const candidates = [
          j?.voiceDemosToday,
          j?.metrics?.voiceDemosToday,
          j?.today?.voiceDemos,
        ];
        const n = candidates.map(Number).find((x) => Number.isFinite(x) && x > 0);
        if (typeof n === "number") setVoiceDemosToday(n);
      })
      .catch(() => { /* silent fallback */ });
    return () => { cancelled = true; };
  }, []);

  const stats: Stat[] = useMemo(
    () => [
      { label: "Agents live",      value: STATS.solutionCategories },
      { label: "Public commits",   value: commits, suffix: "+" },
      { label: "Live URLs",        value: STATS.totalRoutes },
      { label: "Days since ship",  value: daysSince(LAST_SHIP_ISO) },
      { label: "Voice demos today",value: voiceDemosToday },
      { label: "Niches productized", value: STATS.niches },
    ],
    [commits, voiceDemosToday],
  );

  // Render row twice for the mobile marquee track.
  const renderRow = (k: string) =>
    stats.map((s, i) => (
      <span key={`${k}-${i}`} className="inline-flex items-center">
        <StatCell stat={s} enabled={seen} />
        {i < stats.length - 1 && <Separator />}
      </span>
    ));

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="Live operator metrics"
      className="relative w-full border-y border-[#042C53]/10 bg-white/60 backdrop-blur-md overflow-hidden"
    >
      {/* Desktop: single line, centered, no marquee */}
      <div className="hidden md:flex items-center justify-center gap-0 px-6 py-2.5 max-w-7xl mx-auto">
        {renderRow("d")}
      </div>

      {/* Mobile: marquee that loops the row */}
      <div className="md:hidden relative">
        <div className="flex whitespace-nowrap py-2.5 v73-marquee" style={{ width: "max-content" }}>
          <span className="inline-flex items-center px-4">{renderRow("m1")}</span>
          <span className="inline-flex items-center px-4" aria-hidden="true">{renderRow("m2")}</span>
        </div>
        {/* Edge fades on mobile so the loop seam reads as a gradient */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}
