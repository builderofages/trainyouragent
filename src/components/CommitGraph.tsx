// src/components/CommitGraph.tsx
// v59 — 90-day commit heatmap (GitHub-style) for /proof.
// Pure SVG, no library. Fetches commits from the public repo, buckets them by
// day, and renders a 13-week × 7-day grid. Honors prefers-reduced-motion.

import { useEffect, useMemo, useState } from "react";

const REPO = "builderofages/trainyouragent";
const DAYS = 91; // 13 weeks × 7 days

const NAVY = "#042C53";
const BLUE = "#185FA5";

const CELL = 14;
const GAP = 3;
const RADIUS = 3;

// 5 buckets: 0, 1, 2-4, 5-9, 10+
const COLORS = ["#EEF2F7", "#C8DDF1", "#7FB1DF", "#3984C8", NAVY];

function bucket(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return 4;
}

type CommitRow = { commit?: { author?: { date?: string } } };

type CellData = { date: Date; key: string; count: number };

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isoKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDayLong(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function pluralize(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export default function CommitGraph({ days = DAYS }: { days?: number }) {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const CACHE_KEY = "tya:commitgraph:v1";
    const CACHE_TS = "tya:commitgraph:ts:v1";
    const MAX_AGE = 1000 * 60 * 30; // 30 min
    try {
      const ts = Number(localStorage.getItem(CACHE_TS) || "0");
      const raw = localStorage.getItem(CACHE_KEY);
      if (ts && raw && Date.now() - ts < MAX_AGE) {
        setCounts(JSON.parse(raw));
        return;
      }
    } catch { /* ignore */ }
    (async () => {
      try {
        const since = new Date(Date.now() - days * 86400000).toISOString();
        // GitHub max per_page is 100. 90 days easily fits for our cadence.
        // If we ever sustain >100 commits/90d, paginate.
        const url = `https://api.github.com/repos/${REPO}/commits?since=${encodeURIComponent(since)}&per_page=100`;
        const r = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok) throw new Error(`http-${r.status}`);
        const rows = (await r.json()) as CommitRow[];
        const c: Record<string, number> = {};
        for (const row of rows) {
          const d = row.commit?.author?.date;
          if (!d) continue;
          const k = isoKey(startOfDay(new Date(d)));
          c[k] = (c[k] || 0) + 1;
        }
        setCounts(c);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(c));
          localStorage.setItem(CACHE_TS, String(Date.now()));
        } catch { /* ignore */ }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "fetch-failed");
      }
    })();
  }, [days]);

  const { cells, weeks } = useMemo(() => {
    const today = startOfDay(new Date());
    const cells: CellData[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = isoKey(d);
      cells.push({ date: d, key, count: counts?.[key] ?? 0 });
    }
    // Pad front to start on a Sunday column.
    const leading = cells[0].date.getDay(); // 0=Sun..6=Sat
    const pad: (CellData | null)[] = new Array(leading).fill(null);
    const all: (CellData | null)[] = [...pad, ...cells];
    // Pad tail so length % 7 === 0
    while (all.length % 7 !== 0) all.push(null);
    const weeks: (CellData | null)[][] = [];
    for (let i = 0; i < all.length; i += 7) weeks.push(all.slice(i, i + 7));
    return { cells, weeks };
  }, [counts, days]);

  // Stats
  const stats = useMemo(() => {
    let total = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let bestDay: { date: Date; count: number } | null = null;
    for (const c of cells) {
      total += c.count;
      if (c.count > 0) {
        currentStreak += 1;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
      if (!bestDay || c.count > bestDay.count) bestDay = { date: c.date, count: c.count };
    }
    return { total, longestStreak, bestDay };
  }, [cells]);

  const width = weeks.length * (CELL + GAP) + 24;
  const height = 7 * (CELL + GAP) + 24;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">
            Last {days} days · live from GitHub
          </div>
          <h3 className="mt-0.5 text-[18px] font-semibold" style={{ color: NAVY }}>
            Commit heatmap
          </h3>
        </div>
        <a
          href={`https://github.com/${REPO}/commits`}
          target="_blank"
          rel="noopener"
          className="text-[12px] text-[#185FA5] hover:text-[#042C53] underline underline-offset-2"
        >
          View on GitHub ↗
        </a>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <svg
          role="img"
          aria-label={`Commit heatmap for the last ${days} days`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: "block", minWidth: width }}
        >
          {/* Cells */}
          {weeks.map((wk, x) =>
            wk.map((cell, y) => {
              if (!cell) return null;
              const cx = x * (CELL + GAP);
              const cy = y * (CELL + GAP);
              const b = bucket(cell.count);
              const fill = COLORS[b];
              const title =
                cell.count === 0
                  ? `${formatDayLong(cell.date)} — no commits`
                  : `${formatDayLong(cell.date)} — ${pluralize(cell.count, "commit", "commits")}`;
              return (
                <g key={`${x}-${y}`}>
                  <rect
                    x={cx}
                    y={cy}
                    width={CELL}
                    height={CELL}
                    rx={RADIUS}
                    ry={RADIUS}
                    fill={fill}
                    stroke={b === 0 ? "rgba(15,23,42,0.06)" : "rgba(4,44,83,0.08)"}
                    strokeWidth={1}
                  >
                    <title>{title}</title>
                  </rect>
                </g>
              );
            }),
          )}
          {/* Legend */}
          <g transform={`translate(0, ${7 * (CELL + GAP) + 8})`}>
            <text x={0} y={10} fontSize={10} fill="#64748B" fontFamily="'Inter Tight', sans-serif">
              Less
            </text>
            {COLORS.map((c, i) => (
              <rect
                key={i}
                x={32 + i * (CELL + 4)}
                y={0}
                width={CELL}
                height={CELL}
                rx={RADIUS}
                ry={RADIUS}
                fill={c}
                stroke="rgba(15,23,42,0.06)"
                strokeWidth={1}
              />
            ))}
            <text
              x={32 + COLORS.length * (CELL + 4) + 6}
              y={10}
              fontSize={10}
              fill="#64748B"
              fontFamily="'Inter Tight', sans-serif"
            >
              More
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
        <Stat label={`Commits in last ${days} days`} value={String(stats.total)} />
        <Stat label="Longest streak" value={`${stats.longestStreak} ${stats.longestStreak === 1 ? "day" : "days"}`} />
        <Stat
          label="Most-active day"
          value={
            stats.bestDay && stats.bestDay.count > 0
              ? `${formatDayLong(stats.bestDay.date)} · ${stats.bestDay.count}`
              : "—"
          }
        />
      </div>
      {err && (
        <div className="mt-3 text-[12px] text-slate-500">
          Live data temporarily unavailable. Showing cached values where possible.
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-slate-500">{label}</div>
      <div className="mt-0.5 text-[16px] font-semibold" style={{ color: BLUE }}>{value}</div>
    </div>
  );
}
