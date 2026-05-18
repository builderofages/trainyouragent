// src/components/CommitGraph.tsx — v66
// HONEST weekly heatmap: each cell = one week (52 cells = 1 year), color
// intensity proportional to commits/week. The old per-day heatmap was
// derived from the latest 100 commits and reported "100 commits in last 91
// days" — that was just the GitHub API per_page cap, not the real number.
// /api/github-velocity now returns:
//   - weeklyAll: 52 weekly commit counts (from GitHub /stats/participation)
//   - totalCommits: exact total via pagination Link header
//   - mostActiveWeek: { weeksAgo, count }
//   - last13Weeks: real 13-week sum
// Cache key bumped to v4 to flush stale v3 dayBuckets-shaped data.

import { useEffect, useMemo, useState } from "react";

const REPO = "builderofages/trainyouragent";

const NAVY = "#042C53";
const BLUE = "#185FA5";

const CELL = 14;
const GAP = 3;
const RADIUS = 3;

// 5 buckets, color intensity scaled vs. weeklyMax
const COLORS = ["#EEF2F7", "#C8DDF1", "#7FB1DF", "#3984C8", NAVY];

function bucketByMax(n: number, max: number): number {
  if (n <= 0 || max <= 0) return 0;
  const r = n / max;
  if (r <= 0.05) return 1;
  if (r <= 0.25) return 2;
  if (r <= 0.6) return 3;
  return 4;
}

type Payload = {
  totalCommits?: number;
  weeklyAll?: number[];
  mostActiveWeek?: { weeksAgo: number; count: number } | null;
  last13Weeks?: number;
  error?: string;
};

export default function CommitGraph() {
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // v66: bumped cache key to v4 to flush stale v3 dayBuckets-shaped data.
    const CACHE_KEY = "tya:commitgraph:v4";
    const CACHE_TS = "tya:commitgraph:ts:v4";
    const MAX_AGE = 1000 * 60 * 30;
    try {
      const ts = Number(localStorage.getItem(CACHE_TS) || "0");
      const raw = localStorage.getItem(CACHE_KEY);
      if (ts && raw && Date.now() - ts < MAX_AGE) {
        const parsed = JSON.parse(raw) as Payload;
        if (parsed && Array.isArray(parsed.weeklyAll) && parsed.weeklyAll.length > 0) {
          setData(parsed);
          return;
        }
      }
    } catch { /* ignore */ }

    (async () => {
      try {
        const r = await fetch("/api/github-velocity", {
          headers: { Accept: "application/json" },
        });
        if (!r.ok) throw new Error(`velocity ${r.status}`);
        const payload = (await r.json()) as Payload;
        if (payload.error || !Array.isArray(payload.weeklyAll)) {
          throw new Error(payload.error || "bad payload");
        }
        setData(payload);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
          localStorage.setItem(CACHE_TS, String(Date.now()));
        } catch { /* ignore */ }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "fetch-failed");
      }
    })();
  }, []);

  const { weeklyAll, weeklyMax, mostActiveWeek, totalCommits, avgPerWeek } = useMemo(() => {
    const weeks = data?.weeklyAll ?? [];
    const max = weeks.reduce((m, n) => (n > m ? n : m), 0);
    const last13 = data?.last13Weeks ?? weeks.slice(-13).reduce((a, b) => a + b, 0);
    const avg = Math.round(last13 / 13);
    return {
      weeklyAll: weeks,
      weeklyMax: max,
      mostActiveWeek: data?.mostActiveWeek ?? null,
      totalCommits: data?.totalCommits ?? null,
      avgPerWeek: avg,
    };
  }, [data]);

  // Layout: 52 cells in a single row (or wrap to 2 rows on narrow).
  // We render as 1 row × 52 cols, plus quarterly labels.
  const cols = weeklyAll.length || 52;
  const width = cols * (CELL + GAP) + 8;
  const height = CELL + 28;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">
            Weeks this year · live from GitHub
          </div>
          <h3 className="mt-0.5 text-[18px] font-semibold" style={{ color: NAVY }}>
            Weekly commit heatmap
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
          aria-label="Weekly commit heatmap, last 52 weeks"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: "block", minWidth: width }}
        >
          {weeklyAll.map((count, i) => {
            const cx = i * (CELL + GAP);
            const b = bucketByMax(count, weeklyMax);
            const fill = COLORS[b];
            const weeksAgo = weeklyAll.length - 1 - i;
            const label =
              weeksAgo === 0
                ? `This week — ${count} commit${count === 1 ? "" : "s"}`
                : `${weeksAgo}w ago — ${count} commit${count === 1 ? "" : "s"}`;
            return (
              <g key={i}>
                <rect
                  x={cx}
                  y={0}
                  width={CELL}
                  height={CELL}
                  rx={RADIUS}
                  ry={RADIUS}
                  fill={fill}
                  stroke={b === 0 ? "rgba(15,23,42,0.06)" : "rgba(4,44,83,0.08)"}
                  strokeWidth={1}
                >
                  <title>{label}</title>
                </rect>
              </g>
            );
          })}
          {/* Legend */}
          <g transform={`translate(0, ${CELL + 12})`}>
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
        <Stat
          label="Total commits"
          value={totalCommits === null ? "—" : String(totalCommits)}
        />
        <Stat
          label="Most-active week"
          value={
            mostActiveWeek && mostActiveWeek.count > 0
              ? `${mostActiveWeek.weeksAgo === 0 ? "this week" : `${mostActiveWeek.weeksAgo}w ago`} · ${mostActiveWeek.count}`
              : "—"
          }
        />
        <Stat
          label="Avg / week (last 13w)"
          value={avgPerWeek > 0 ? String(avgPerWeek) : "—"}
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
