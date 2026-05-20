// src/components/visual/LiveStatTicker.tsx
// v76-B — bug-fix: every ticker number now reads from STATS (siteStats.ts),
// the single source of truth. The previous version pulled commits from
// /api/github-velocity which produced "191" on home while the navy eyebrow
// strip 40px below showed "569 LIVE URLS" from STATS — a visible mismatch.
//
// Per v76-B spec, the ticker now shows exactly 6 stats, all sourced from
// STATS so the eyebrow / hero / footer / metrics page all agree:
//
//   AGENTS LIVE 3 · 569 LIVE URLS · 350+ PUBLIC COMMITS ·
//   10 CORNERSTONE PLAYBOOKS · 15 NICHE PLAYBOOKS · 4 YRS IN APPLIED AI
//
// Time-bound metrics carry an explicit "TODAY" prefix per spec (none in
// this ticker right now — all six are cumulative). The github-velocity and
// recent-activity fetches are removed because they introduced number drift.

import { useEffect, useMemo, useRef, useState } from "react";
import { STATS } from "@/lib/siteStats";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  /** prefix for screen readers / formatter, optional */
  prefix?: string;
};

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

  // v76-B: ALL ticker values now come from STATS so the ticker can never
  // disagree with the eyebrow strip below it ("569 LIVE URLS") or with
  // any other page on the site.
  //
  // Spec order: AGENTS LIVE 3 · 569 LIVE URLS · 350+ PUBLIC COMMITS ·
  //             10 CORNERSTONE PLAYBOOKS · 15 NICHE PLAYBOOKS · 4 YRS IN APPLIED AI
  //
  // "AGENTS LIVE" maps to STATS.agentsLive (the count of cornerstone
  // playbook implementations actually running in production today — 3),
  // distinct from STATS.solutionCategories (the breadth of Everything-AI
  // categories, 8). Using a dedicated key fixes the previous bug where
  // the ticker showed 8 here, contradicting the "3 agents in production"
  // claim elsewhere.
  const stats: Stat[] = useMemo(
    () => [
      { label: "Agents live",            value: STATS.agentsLive },
      { label: "Live URLs",              value: STATS.totalRoutes },
      { label: "Public commits",         value: STATS.publicCommits, suffix: "+" },
      { label: "Cornerstone playbooks",  value: STATS.cornerstonePlaybooks },
      { label: "Niche playbooks",        value: STATS.niches },
      { label: "Yrs in applied AI",      value: STATS.yearsInAI },
    ],
    [],
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
