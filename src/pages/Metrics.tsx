// src/pages/Metrics.tsx
// v44: public metrics dashboard. Pulls /api/public-metrics, renders KPI cards,
// 30-day SVG line chart, live status pills, last-10 events table.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

type Kpi = { signups: number; demosBooked: number; payingCustomers: number; mrrEstimate: number };
type SeriesPoint = { day: string; count: number };
type EventRow = { ts: number; type: string; maskedSource: string };
type Payload = {
  ok: boolean;
  generatedAt: string;
  kpi: Kpi;
  signupSeries: SeriesPoint[];
  live: { uptime: string; responseTimeMs: number; demosShippedThisWeek: number; openJobs: number };
  events: EventRow[];
};

export default function Metrics() {
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Public metrics — TrainYourAgent";
      // Inject brand font
      if (!document.getElementById("tya-fonts")) {
        const l = document.createElement("link");
        l.id = "tya-fonts";
        l.rel = "stylesheet";
        l.href =
          "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
        document.head.appendChild(l);
      }
    }

    let cancelled = false;
    fetch("/api/public-metrics")
      .then((r) => {
        if (!r.ok) throw new Error("status " + r.status);
        return r.json();
      })
      .then((j: Payload) => { if (!cancelled) setData(j); })
      .catch((e) => { if (!cancelled) setErr(String(e?.message || e)); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">
        Skip to main content
      </a>
      <SiteNav />

      <main id="main" className="pt-32 pb-24 px-5 sm:px-8">
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
            <span className="text-[12px] text-slate-500">
              Updated {data ? relTime(new Date(data.generatedAt).getTime()) : "just now"}
            </span>
          </div>
          <h1 className="text-[40px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
            We're building in public.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Here are the numbers.
            </span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-600 max-w-2xl">
            Live signups, demos, customers, and MRR. The same dashboard we look at internally — no marketing fluff, no inflated metrics.
          </p>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {err && (
          <div role="alert" className="max-w-6xl mx-auto rounded-xl bg-red-50 border border-red-200 p-4 text-[13px] text-red-700">
            Couldn't load live metrics: {err}. Try again in a minute.
          </div>
        )}

        {/* KPI grid */}
        <section className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Key metrics">
          <Kpi label="Signups" value={data?.kpi.signups} sub="all-time" />
          <Kpi label="Demos booked" value={data?.kpi.demosBooked} sub="all-time" />
          <Kpi label="Paying customers" value={data?.kpi.payingCustomers} sub="current" />
          <Kpi label="MRR estimate" value={data?.kpi.mrrEstimate} sub="USD / month" money />
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* Chart */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[20px] font-semibold" style={{ color: NAVY }}>30-day signups</h2>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
              Daily count
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            {data ? <SignupChart series={data.signupSeries} /> : <ChartSkeleton />}
            {data && (
              <details className="mt-3">
                <summary className="text-[12.5px] text-slate-500 cursor-pointer hover:text-slate-700">
                  View 30-day data as a table
                </summary>
                <table className="mt-2 text-[12.5px] w-full">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-1">Day</th>
                      <th className="py-1">Signups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.signupSeries.map((p) => (
                      <tr key={p.day}>
                        <td className="py-1">{p.day}</td>
                        <td className="py-1">{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            )}
          </div>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* Live status pills */}
        <section className="max-w-6xl mx-auto" aria-label="Live status">
          <h2 className="text-[20px] font-semibold mb-3" style={{ color: NAVY }}>Live status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatusPill
              label="Site uptime"
              value={data?.live.uptime === "operational" ? "Operational" : data?.live.uptime ?? "Loading…"}
              ok={data?.live.uptime === "operational"}
            />
            <StatusPill
              label="Avg response time"
              value={data ? `${data.live.responseTimeMs} ms` : "Loading…"}
              ok={!data ? undefined : data.live.responseTimeMs < 250}
            />
            <StatusPill
              label="Demos shipped this week"
              value={data ? String(data.live.demosShippedThisWeek) : "—"}
              ok={true}
            />
            <Link to="/careers" className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#185FA5] block">
              <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">Open jobs</div>
              <div className="mt-1 text-[20px] font-semibold" style={{ color: NAVY }}>
                {data?.live.openJobs ?? "—"} →
              </div>
              <div className="text-[12px] text-slate-500">View careers</div>
            </Link>
          </div>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* Last 10 events */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-semibold mb-3" style={{ color: NAVY }}>Last 10 events</h2>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-2.5 font-semibold uppercase tracking-[0.1em] text-[11px]">When</th>
                  <th className="px-4 py-2.5 font-semibold uppercase tracking-[0.1em] text-[11px]">Type</th>
                  <th className="px-4 py-2.5 font-semibold uppercase tracking-[0.1em] text-[11px]">Source</th>
                </tr>
              </thead>
              <tbody>
                {data?.events.map((e, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">{relTime(e.ts)}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[11px] font-semibold uppercase tracking-[0.06em]">
                        {e.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 font-mono text-[12px]">{e.maskedSource}</td>
                  </tr>
                ))}
                {!data && (
                  <tr>
                    <td className="px-4 py-6 text-slate-400 text-center" colSpan={3}>Loading…</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-slate-500">
            Sources are categorized, not identified. We never expose visitor emails or identities on this page.
          </p>
        </section>

        <div className="max-w-6xl mx-auto mt-16 rounded-2xl bg-[#042C53] text-white p-6 sm:p-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#9BC3E8] font-semibold mb-2">
            Built in public
          </div>
          <h3 className="text-[26px] font-semibold mb-2">
            Numbers go up when the product earns it.
          </h3>
          <p className="text-[14px] text-white/80 max-w-2xl mb-5">
            We publish this page because we're confident in what we ship. Want to be on it next month?
          </p>
          <Link to="/contact" className="inline-flex items-center px-5 py-3 rounded-lg bg-white text-[#042C53] text-[14px] font-semibold min-h-[44px]">
            Book a 30-min build call →
          </Link>
        </div>
      </main>

      <FooterV44 />
    </div>
  );
}

// ─────────────────────────── pieces ───────────────────────────

function Kpi({ label, value, sub, money }: { label: string; value: number | undefined; sub: string; money?: boolean }) {
  const display = value == null
    ? "—"
    : money
      ? "$" + value.toLocaleString()
      : value.toLocaleString();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-[30px] sm:text-[34px] font-semibold leading-none" style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}>
        {display}
      </div>
      <div className="mt-2 text-[12px] text-slate-500">{sub}</div>
    </div>
  );
}

function StatusPill({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  const colorClass =
    ok === true ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    ok === false ? "text-amber-700 bg-amber-50 border-amber-200" :
    "text-slate-700 bg-slate-50 border-slate-200";
  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold opacity-80">{label}</div>
      <div className="mt-1 text-[18px] font-semibold">{value}</div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-48 w-full bg-slate-50 rounded animate-pulse" />
  );
}

function SignupChart({ series }: { series: SeriesPoint[] }) {
  const W = 760;
  const H = 220;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const iW = W - padL - padR;
  const iH = H - padT - padB;
  const max = Math.max(1, ...series.map((p) => p.count));
  const step = iW / Math.max(1, series.length - 1);
  const pts = series.map((p, i) => ({
    x: padL + i * step,
    y: padT + iH - (p.count / max) * iH,
    raw: p,
  }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x.toFixed(1)} ${padT + iH} L ${pts[0].x.toFixed(1)} ${padT + iH} Z`;
  const total = series.reduce((a, b) => a + b.count, 0);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`30-day signup line chart, total ${total} signups across the period, peak day ${max}`}
    >
      <title>30-day signups</title>
      <defs>
        <linearGradient id="tya-area-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.35" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padL} x2={padL + iW} y1={padT + iH * f} y2={padT + iH * f} stroke="#E2E8F0" strokeDasharray="3 4" strokeWidth="0.6" />
      ))}
      <line x1={padL} x2={padL + iW} y1={padT + iH} y2={padT + iH} stroke="#CBD5E1" strokeWidth="0.8" />

      {/* y labels */}
      <text x="6" y={padT + 10} fontSize="10" fill="#5C6B82">{max}</text>
      <text x="6" y={padT + iH} fontSize="10" fill="#5C6B82">0</text>

      {/* area */}
      <path d={area} fill="url(#tya-area-grad)" />
      {/* line */}
      <path d={path} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={NAVY} />
      ))}
      {/* x-axis: show first / middle / last day */}
      {[0, Math.floor(series.length / 2), series.length - 1].map((i) => (
        <text key={i} x={pts[i].x} y={padT + iH + 14} fontSize="10" fill="#5C6B82" textAnchor="middle">
          {series[i].day.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function relTime(ts: number): string {
  const ms = Date.now() - ts;
  if (ms < 0) return "just now";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
