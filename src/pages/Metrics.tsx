// src/pages/Metrics.tsx — v58 (PROOF REFRAME)
// Public metrics dashboard. Real numbers only — no baselines, no fake events.
// Order reflects what's ACTUALLY verifiable about us today:
//   (1) Operator velocity — live GitHub data, the only proof we have today
//   (2) Business — founder-stated, treated as claims not audited financials
//   (3) Website — live, pulled from the lead store, may be 0 (and that's OK)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
// v76-B: DashboardIllo (placeholder "+38% MoM" stylized chart) removed —
// directly contradicted the copy 40px above it ("we don't inflate numbers,
// invent customers, or fake activity"). Replaced with real CommitGraph
// pulling 52 weekly buckets from /api/github-velocity.
import CommitGraph from "@/components/CommitGraph";
// v52B: live GitHub commits feed
import ShippedThisWeek from "@/components/ShippedThisWeek";

const NAVY = "#042C53";
const BLUE = "#185FA5";

type WebsiteKpi = {
  leadsLast30d: number;
  leadsLast7d: number;
  leadsLast24h: number;
  demosBookedLast30d: number;
  purchasesLast30d: number;
  storeSize: { leads: number; events: number };
  backend: string;
};
type Business = {
  yearsInAi: number;
  livePages: number;
  blogPosts: number;
  totalCommits: number;
  niches: number;
};
type SeriesPoint = { day: string; count: number };
type EventRow = { ts: number; type: string; maskedSource: string };
type Payload = {
  ok: boolean;
  generatedAt: string;
  business: Business;
  websiteKpi: WebsiteKpi;
  signupSeries: SeriesPoint[];
  live: { uptime: string; responseTimeMs: number };
  events: EventRow[];
  meta: { source: string; note: string };
};

export default function Metrics() {
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // v66: live-override the static `business.totalCommits` (which is hand-
  // bumped each release) with the real number from /api/github-velocity.
  const [liveTotalCommits, setLiveTotalCommits] = useState<number | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Public metrics — TrainYourAgent";
      {
        const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Built in public — real numbers")}&subtitle=${encodeURIComponent("Live MRR, leads, uptime — no inflation")}&type=trust&badge=METRICS`;
        const sM = (sel: string, a: "name"|"property", k: string, v: string) => { let el = document.querySelector(sel) as HTMLMetaElement | null; if (!el) { el = document.createElement("meta"); el.setAttribute(a, k); document.head.appendChild(el); } el.setAttribute("content", v); };
        sM("meta[property='og:image']", "property", "og:image", ogImage);
        sM("meta[name='twitter:image']", "name", "twitter:image", ogImage);
        sM("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
      }
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
      .then((r) => { if (!r.ok) throw new Error("status " + r.status); return r.json(); })
      .then((j: Payload) => { if (!cancelled) setData(j); })
      .catch((e) => { if (!cancelled) setErr(String(e?.message || e)); });
    // v66: pull the real total from the velocity proxy (pagination Link header).
    fetch("/api/github-velocity")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => {
        if (cancelled || !j) return;
        if (typeof j.totalCommits === "number") setLiveTotalCommits(j.totalCommits);
      })
      .catch(() => { /* ignore */ });
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
          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] leading-[1.06] sm:leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
            We're building in public.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Here are the numbers.
            </span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-600 max-w-2xl">
            Real metrics from the live lead store. We don't inflate numbers, invent customers, or fake activity. If a number is small, it's small.
          </p>
          <p className="mt-3 text-[13.5px] text-slate-500 max-w-2xl border-l-2 border-amber-300 pl-3 bg-amber-50/40 py-2 rounded-r">
            We publish this page because we'd rather you see honest zeros than fake hundreds. Pre-customer in this exact site/product configuration — see <Link to="/proof" className="text-[#185FA5] underline underline-offset-2">/proof</Link> for what IS verifiable about how we ship.
          </p>
          {/* v76-B: real GitHub velocity chart — 52 weekly buckets, live
              from /api/github-velocity. Replaces the placeholder "+38% MoM"
              stylized chart that contradicted the no-inflation copy above. */}
          <div className="mt-8">
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-2 font-mono">
              Public commits · last 52 weeks · live from GitHub
            </div>
            <CommitGraph />
          </div>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {err && (
          <div role="alert" className="max-w-6xl mx-auto rounded-xl bg-red-50 border border-red-200 p-4 text-[13px] text-red-700">
            Couldn't load live metrics: {err}. Try again in a minute.
          </div>
        )}

        {/* v58: OPERATOR VELOCITY (the only real proof today) — leads the page */}
        <section className="max-w-6xl mx-auto" aria-label="Operator velocity">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[20px] font-semibold" style={{ color: NAVY }}>
              Operator velocity <span className="text-slate-500 font-normal text-[14px]">— the only real proof we have today</span>
            </h2>
            <span className="text-[11px] uppercase tracking-[0.14em] text-emerald-600 font-semibold">
              Live · GitHub
            </span>
          </div>
          <p className="text-[14px] text-slate-600 max-w-3xl mb-4">
            Every number below is checkable against the public repo at{" "}
            <a href="https://github.com/builderofages/trainyouragent" target="_blank" rel="noopener" className="text-[#185FA5] underline underline-offset-2">github.com/builderofages/trainyouragent</a>.
            This is what "building in public" actually looks like — not a brand value, a data feed.
          </p>
          <GitHubVelocityCards />
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* v52B: Live GitHub commits feed */}
        <section className="max-w-6xl mx-auto mb-10" aria-label="Recent commits">
          <ShippedThisWeek />
        </section>

        {/* Business snapshot — v58: clearly labeled as founder claims */}
        <section className="max-w-6xl mx-auto" aria-label="Business snapshot">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[20px] font-semibold" style={{ color: NAVY }}>
              The business <span className="text-slate-500 font-normal text-[14px]">— founder claims, not audited financials</span>
            </h2>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
              Founder-stated
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Kpi label="Years in AI" value={data?.business.yearsInAi} sub="founder track record" />
            <Kpi label="Live URLs" value={data?.business.livePages} sub="verifiable via /sitemap.xml" />
            <Kpi label="Blog posts" value={data?.business.blogPosts} sub="long-form, published" />
            <Kpi label="Total commits" value={liveTotalCommits ?? data?.business.totalCommits} sub="live via /api/github-velocity" />
            <Kpi label="Niche playbooks" value={data?.business.niches} sub="hand-edited operator content" />
          </div>
          <p className="mt-3 text-[12px] text-slate-500">
            Founder-stated as of the last disclosure. Treat as the founder's claims, not as audited financials. Customer-revenue metrics are intentionally absent until paying customers are live on this exact product — see <Link to="/proof" className="text-[#185FA5] underline">/proof</Link> for the full picture.
          </p>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* Website KPIs (live, can be 0) */}
        <section className="max-w-6xl mx-auto" aria-label="Live website metrics">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[20px] font-semibold" style={{ color: NAVY }}>This website, right now</h2>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
              Live from the store ({data?.websiteKpi.backend ?? "loading…"})
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Kpi label="Leads 24h" value={data?.websiteKpi.leadsLast24h} sub="from this site" />
            <Kpi label="Leads 7d" value={data?.websiteKpi.leadsLast7d} sub="from this site" />
            <Kpi label="Leads 30d" value={data?.websiteKpi.leadsLast30d} sub="from this site" />
            <Kpi label="Demos booked 30d" value={data?.websiteKpi.demosBookedLast30d} sub="via Cal.com" />
            <Kpi label="Purchases 30d" value={data?.websiteKpi.purchasesLast30d} sub="via Stripe" />
          </div>
          <p className="mt-3 text-[12px] text-slate-500">
            Pulled from {data?.websiteKpi.backend ?? "the store"} at request time. Today shows what's actually flowing through the site — even if that number is zero.
          </p>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* Chart */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[20px] font-semibold" style={{ color: NAVY }}>30-day signups (real)</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <Link to="/careers" className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#185FA5] block">
              <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">Hiring?</div>
              <div className="mt-1 text-[18px] font-semibold" style={{ color: NAVY }}>
                View open roles →
              </div>
            </Link>
          </div>
        </section>

        <SectionDivider className="my-10 max-w-6xl mx-auto" />

        {/* Last 10 events */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-semibold mb-3" style={{ color: NAVY }}>Last 10 real events</h2>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-[13px] min-w-[440px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-2.5 font-semibold uppercase tracking-[0.1em] text-[11px]">When</th>
                  <th className="px-4 py-2.5 font-semibold uppercase tracking-[0.1em] text-[11px]">Type</th>
                  <th className="px-4 py-2.5 font-semibold uppercase tracking-[0.1em] text-[11px]">Source</th>
                </tr>
              </thead>
              <tbody>
                {data?.events.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-slate-400 text-center" colSpan={3}>
                      No real events yet. Be the first — try a <Link to="/tools" className="text-[#185FA5] underline">tool</Link> or <Link to="/contact" className="text-[#185FA5] underline">book a call</Link>.
                    </td>
                  </tr>
                )}
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
          </div>
          <p className="mt-3 text-[12px] text-slate-500">
            Sources are categorized (e.g. <code>tool:cost-estimator</code>), never identified. We never expose visitor emails or identities here.
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
            We publish this page because we'd rather be honest about a small start than fake to look big.
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

function Kpi({ label, value, sub, money }: { label: string; value: number | undefined; sub: string; money?: boolean }) {
  const display = value == null
    ? "—"
    : money
      ? "$" + value.toLocaleString()
      : value.toLocaleString();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-[28px] sm:text-[30px] font-semibold leading-none" style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}>
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
  return <div className="h-48 w-full bg-slate-50 rounded animate-pulse" />;
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
  const area = pts.length > 1
    ? `${path} L ${pts[pts.length - 1].x.toFixed(1)} ${padT + iH} L ${pts[0].x.toFixed(1)} ${padT + iH} Z`
    : "";
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
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padL} x2={padL + iW} y1={padT + iH * f} y2={padT + iH * f} stroke="#E2E8F0" strokeDasharray="3 4" strokeWidth="0.6" />
      ))}
      <line x1={padL} x2={padL + iW} y1={padT + iH} y2={padT + iH} stroke="#CBD5E1" strokeWidth="0.8" />
      <text x="6" y={padT + 10} fontSize="10" fill="#5C6B82">{max}</text>
      <text x="6" y={padT + iH} fontSize="10" fill="#5C6B82">0</text>
      {area && <path d={area} fill="url(#tya-area-grad)" />}
      <path d={path} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={NAVY} />
      ))}
      {[0, Math.floor(series.length / 2), series.length - 1].map((i) => (
        <text key={i} x={pts[i].x} y={padT + iH + 14} fontSize="10" fill="#5C6B82" textAnchor="middle">
          {series[i].day.slice(5)}
        </text>
      ))}
    </svg>
  );
}

// v58: live GitHub commit velocity — pulled from the public REST API,
// cached to localStorage for 30 min so reloads don't burn rate-limit.
function GitHubVelocityCards() {
  const [stats, setStats] = useState<{
    last7d: number | null;
    last30d: number | null;
    today: number | null;
    daysPublic: number | null;
  }>({ last7d: null, last30d: null, today: null, daysPublic: null });

  useEffect(() => {
    // v66: bumped cache key to v4 — payload shape changed, see api/github-velocity.ts
    const CACHE_KEY = "tya:velocity:v4";
    const CACHE_TS = "tya:velocity:ts:v4";
    const MAX_AGE = 1000 * 60 * 30;

    try {
      const ts = Number(localStorage.getItem(CACHE_TS) || "0");
      const raw = localStorage.getItem(CACHE_KEY);
      if (ts && raw && Date.now() - ts < MAX_AGE) {
        setStats(JSON.parse(raw));
        return;
      }
    } catch { /* ignore */ }

    (async () => {
      try {
        // v65: server-side proxy via /api/github-velocity (cached, rate-
        // limit-safe). Replaces previous direct api.github.com fetch.
        const r = await fetch("/api/github-velocity", {
          headers: { Accept: "application/json" },
        });
        if (!r.ok) return;
        const data = (await r.json()) as {
          todayCount?: number;
          last1Week?: number;
          last4Weeks?: number;
          error?: string;
        };
        if (data.error || typeof data.todayCount !== "number") return;
        const now = Date.now();
        const day = 86400000;
        const firstCommit = new Date("2025-11-07T20:25:45Z").getTime();
        const daysPublic = Math.max(1, Math.floor((now - firstCommit) / day));
        const next = {
          last7d: data.last1Week ?? 0,
          last30d: data.last4Weeks ?? 0,
          today: data.todayCount ?? 0,
          daysPublic,
        };
        setStats(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
          localStorage.setItem(CACHE_TS, String(Date.now()));
        } catch { /* ignore */ }
      } catch { /* swallow */ }
    })();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Kpi label="Commits today" value={stats.today ?? undefined} sub="builderofages/trainyouragent" />
      <Kpi label="Commits last 7d" value={stats.last7d ?? undefined} sub="all on main, all public" />
      <Kpi label="Commits last 30d" value={stats.last30d ?? undefined} sub="ship rate, sustained" />
      <Kpi label="Days building public" value={stats.daysPublic ?? undefined} sub="since first commit" />
      <p className="col-span-2 sm:col-span-4 text-[12px] text-slate-500 mt-1">
        Pulled live from the GitHub REST API. Open <a href="https://github.com/builderofages/trainyouragent/commits/main" target="_blank" rel="noopener" className="text-[#185FA5] underline">/commits/main</a> to verify any number above. Cached client-side for 30 min so we don't burn anyone's rate limit.
      </p>
    </div>
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
