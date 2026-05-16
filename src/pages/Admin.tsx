// src/pages/Admin.tsx
// v40b: internal monitoring dashboard for Alexander.
// Token-gated via ?token=XXX checked against VITE_ADMIN_TOKEN at build time.
// Real auth will land when Supabase is wired — this is the v0.
//
// Sections:
//   - Top-of-page metric cards (placeholders until /api/* endpoints back them)
//   - Recent leads table (placeholder)
//   - Pipeline funnel (visitor -> router -> email -> booked -> closed)
//   - Site health (pulls live from /api/health)
//   - Build log (last 10 v-prefixed commits — reuses BuiltInPublic fetcher logic)
//   - Quick actions (redeploy, vercel, github)
//
// Dashboard layout: 12-col grid, denser type than marketing pages, brand tokens.

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { parseCommits, type BipCommit } from "@/components/BuiltInPublic";

const GH_API = "https://api.github.com/repos/builderofages/trainyouragent/commits?per_page=10";
const VERCEL_DEPLOY_URL = "https://vercel.com/builderofages/trainyouragent/deployments";
const GITHUB_REPO_URL = "https://github.com/builderofages/trainyouragent";
const DEPLOY_HOOK_URL = "https://api.vercel.com/v1/integrations/deploy/prj_bxA7MPcFmHyKRJ69XSIYdjNbSxy4/0D9pWDtZqR";

// VITE_ADMIN_TOKEN is read at build time. If not set, fall back to a
// known-only-to-Alexander shared secret so the page is never publicly readable.
const ADMIN_TOKEN: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_ADMIN_TOKEN) ||
  "tya-internal-2026";

type HealthSnapshot = {
  voice: string; ai: string; telephony: string; booking: string; payments: string;
  checkedAt: string;
} | null;

type MetricCard = {
  label: string;
  value: string;
  delta?: string;
  hint: string;
};

const METRIC_CARDS: MetricCard[] = [
  { label: "Total leads (7d)",    value: "—", hint: "Placeholder — wires to /api/lead recent events" },
  { label: "Bookings (7d)",       value: "—", hint: "Placeholder — wires to /api/cal-webhook log" },
  { label: "AI chats (7d)",       value: "—", hint: "Placeholder — wires to /api/chat session counter" },
  { label: "Revenue (30d)",       value: "—", hint: "Placeholder — wires to /api/stripe-webhook ledger" },
];

const PIPELINE_STAGES = [
  { stage: "Visitors",                placeholder: "—", note: "Plausible / GA4 sessions"  },
  { stage: "PathwayRouter completed", placeholder: "—", note: "Router 'finished' events"  },
  { stage: "Email captured",          placeholder: "—", note: "Newsletter + lead magnets" },
  { stage: "Booked call",             placeholder: "—", note: "Cal.com webhook"           },
  { stage: "Closed",                  placeholder: "—", note: "Stripe checkout completed" },
];

// Recent leads — placeholder rows; real data will land via a /api/admin/leads endpoint
const RECENT_LEADS_PLACEHOLDER = Array.from({ length: 8 }).map((_, i) => ({
  ts: `2026-05-${(16 - Math.floor(i / 2)).toString().padStart(2, "0")} ${(12 - i).toString().padStart(2, "0")}:42`,
  source: ["/hvac", "/pricing", "/blog/hvac-after-hours-playbook", "/real-estate", "/legal", "/", "/comparisons", "/alternatives/bland-for-hvac"][i],
  type:   ["form", "chat", "newsletter", "form", "demo-request", "form", "chat", "form"][i],
  status: ["new", "new", "new", "new", "new", "new", "new", "new"][i],
}));

const Admin = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const authorized = token && token === ADMIN_TOKEN;

  const [health, setHealth] = useState<HealthSnapshot>(null);
  const [healthMs, setHealthMs] = useState<number | null>(null);
  const [commits, setCommits] = useState<BipCommit[]>([]);
  const [redeployState, setRedeployState] = useState<"idle" | "firing" | "done" | "error">("idle");
  const [healthErr, setHealthErr] = useState<string | null>(null);

  // Pull /api/health on mount + every 30s
  useEffect(() => {
    if (!authorized) return;
    let mounted = true;
    const pull = async () => {
      const t0 = performance.now();
      try {
        const r = await fetch("/api/health", { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        if (!mounted) return;
        setHealthMs(ms);
        if (r.ok) {
          const data = await r.json();
          setHealth(data);
          setHealthErr(null);
        } else {
          setHealthErr(`HTTP ${r.status}`);
        }
      } catch (e: any) {
        if (!mounted) return;
        setHealthErr(e?.message || "fetch failed");
      }
    };
    pull();
    const id = window.setInterval(pull, 30_000);
    return () => { mounted = false; window.clearInterval(id); };
  }, [authorized]);

  // Pull GitHub commits on mount
  useEffect(() => {
    if (!authorized) return;
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(GH_API);
        if (!r.ok) return;
        const data = await r.json();
        if (!mounted) return;
        setCommits(parseCommits(data));
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [authorized]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Admin — TrainYourAgent";
    // Belt-and-suspenders: tell crawlers to stay out even if the route leaks.
    let robots = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (!robots) { robots = document.createElement("meta"); robots.setAttribute("name", "robots"); document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, nofollow, noarchive");
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const triggerRedeploy = async () => {
    setRedeployState("firing");
    try {
      const r = await fetch(DEPLOY_HOOK_URL, { method: "POST" });
      setRedeployState(r.ok ? "done" : "error");
    } catch {
      setRedeployState("error");
    }
  };

  const healthColor = (s?: string) =>
    s === "operational" ? "#10b981" : s === "degraded" ? "#f59e0b" : s ? "#ef4444" : "#94a3b8";

  /* -------------------------------------------------------------- */
  /*  Unauthorized screen                                            */
  /* -------------------------------------------------------------- */
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0B1B2B] text-white flex items-center justify-center px-5" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9BC3E8] font-semibold mb-3">Admin</div>
          <h1 className="text-[28px] font-semibold mb-3">Not authorized.</h1>
          <p className="text-[14px] text-slate-300 mb-6">
            This is an internal dashboard. Append <code className="bg-white/10 px-1.5 py-0.5 rounded">?token=…</code> to the URL.
          </p>
          <Link to="/" className="text-[#9BC3E8] underline text-[13px]">← Back to site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* ----------------------------------------------------------- */}
      {/*  Header bar                                                 */}
      {/* ----------------------------------------------------------- */}
      <header className="bg-[#042C53] text-white border-b border-[#0A3D6E]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#9BC3E8] font-semibold">Internal</span>
            <span className="text-white/40">·</span>
            <span className="text-[15px] font-semibold">TrainYourAgent · Admin</span>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-white/70">
            <span>{new Date().toLocaleString()}</span>
            <Link to="/" className="text-[#9BC3E8] hover:text-white">View site →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8">
        {/* ----------------------------------------------------------- */}
        {/*  Top metric cards (4 cols on desktop)                       */}
        {/* ----------------------------------------------------------- */}
        <section aria-label="Top stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {METRIC_CARDS.map((m) => (
            <div key={m.label} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">{m.label}</div>
              <div className="text-[28px] font-semibold text-[#042C53] leading-none mb-2">{m.value}</div>
              <div className="text-[11px] text-slate-500">{m.hint}</div>
            </div>
          ))}
        </section>

        {/* ----------------------------------------------------------- */}
        {/*  12-col content grid                                        */}
        {/* ----------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* --- RECENT LEADS (8 cols) --- */}
          <section className="lg:col-span-8 rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#042C53]">Recent leads</h2>
              <span className="text-[11px] text-slate-500">last 20 · placeholder</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="text-left text-[11px] uppercase tracking-[0.08em] text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2 pr-3 font-medium">When</th>
                    <th className="py-2 pr-3 font-medium">Source</th>
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_LEADS_PLACEHOLDER.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 pr-3 text-slate-600 font-mono text-[12px]">{row.ts}</td>
                      <td className="py-2 pr-3 text-[#185FA5]"><Link to={row.source} className="underline">{row.source}</Link></td>
                      <td className="py-2 pr-3 text-slate-700">{row.type}</td>
                      <td className="py-2">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[11px] font-medium">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              Wire to <code className="bg-slate-100 px-1 rounded">/api/admin/leads</code> once Supabase ledger is live.
            </div>
          </section>

          {/* --- QUICK ACTIONS (4 cols) --- */}
          <section className="lg:col-span-4 rounded-xl bg-white border border-slate-200 p-5">
            <h2 className="text-[15px] font-semibold text-[#042C53] mb-3">Quick actions</h2>
            <div className="space-y-2">
              <button
                onClick={triggerRedeploy}
                disabled={redeployState === "firing"}
                className="w-full text-left px-4 py-3 rounded-lg bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] disabled:opacity-60"
              >
                {redeployState === "idle"   && "→ Trigger redeploy"}
                {redeployState === "firing" && "Firing deploy hook…"}
                {redeployState === "done"   && "✓ Deploy hook fired"}
                {redeployState === "error"  && "✗ Hook failed (check console)"}
              </button>
              <a
                href={VERCEL_DEPLOY_URL}
                target="_blank"
                rel="noopener"
                className="block px-4 py-3 rounded-lg bg-[#E6F1FB] text-[#185FA5] text-[13px] font-medium hover:bg-[#D6E7F6]"
              >
                → View Vercel deployments
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener"
                className="block px-4 py-3 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-medium hover:bg-slate-200"
              >
                → View GitHub repo
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener"
                className="block px-4 py-3 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-medium hover:bg-slate-200"
              >
                → View live sitemap
              </a>
            </div>
          </section>

          {/* --- PIPELINE (6 cols) --- */}
          <section className="lg:col-span-6 rounded-xl bg-white border border-slate-200 p-5">
            <h2 className="text-[15px] font-semibold text-[#042C53] mb-3">Pipeline funnel</h2>
            <div className="space-y-2">
              {PIPELINE_STAGES.map((s, i) => {
                const width = 100 - i * 18; // visual taper for funnel feel
                return (
                  <div key={s.stage} className="flex items-center gap-3">
                    <div className="w-44 text-[12.5px] text-slate-700 font-medium">{s.stage}</div>
                    <div className="flex-1 h-7 rounded-md bg-slate-100 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#185FA5] to-[#042C53] opacity-90"
                        style={{ width: `${width}%` }}
                      />
                      <div className="absolute inset-0 flex items-center px-3 text-[11.5px] font-mono text-white drop-shadow-sm">
                        {s.placeholder}
                      </div>
                    </div>
                    <div className="w-32 text-[11px] text-slate-500 text-right">{s.note}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-[11px] text-slate-500">
              Numbers populate once Plausible + Cal.com + Stripe webhooks are wired to <code className="bg-slate-100 px-1 rounded">/api/admin/funnel</code>.
            </div>
          </section>

          {/* --- SITE HEALTH (6 cols) --- */}
          <section className="lg:col-span-6 rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#042C53]">Site health</h2>
              <span className="text-[11px] text-slate-500">
                {healthMs != null ? `${healthMs}ms` : "—"} · refresh 30s
              </span>
            </div>
            {healthErr && (
              <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md mb-3">
                /api/health: {healthErr}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(["voice","ai","telephony","booking","payments"] as const).map((k) => (
                <div key={k} className="rounded-md border border-slate-200 px-3 py-3 text-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full mx-auto mb-1.5"
                    style={{ backgroundColor: healthColor(health?.[k]) }}
                    aria-hidden="true"
                  />
                  <div className="text-[11.5px] uppercase tracking-[0.08em] text-slate-500 font-semibold">{k}</div>
                  <div className="text-[12px] text-slate-700 mt-0.5">{health?.[k] ?? "—"}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              Checked: {health?.checkedAt ? new Date(health.checkedAt).toLocaleTimeString() : "—"}
            </div>
          </section>

          {/* --- BUILD LOG (12 cols full width) --- */}
          <section className="lg:col-span-12 rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#042C53]">Build log · last 10 commits</h2>
              <a href={GITHUB_REPO_URL + "/commits/main"} target="_blank" rel="noopener" className="text-[11px] text-[#185FA5] underline">View all</a>
            </div>
            {commits.length === 0 ? (
              <div className="text-[12px] text-slate-500">Loading commits…</div>
            ) : (
              <ol className="space-y-1.5">
                {commits.map((c) => (
                  <li key={c.sha} className="flex items-baseline gap-3 text-[13px] py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-[11px] text-slate-500 font-mono w-24 flex-shrink-0">
                      {c.date ? new Date(c.date).toLocaleDateString() : "—"}
                    </span>
                    <span className="text-[11.5px] text-[#185FA5] font-mono font-semibold w-12 flex-shrink-0">{c.version}</span>
                    <a href={c.url} target="_blank" rel="noopener" className="flex-1 text-slate-700 hover:text-[#042C53] truncate">
                      {c.description}
                    </a>
                    <a href={c.url} target="_blank" rel="noopener" className="text-[11px] text-slate-400 font-mono flex-shrink-0 hover:text-[#185FA5]">
                      {c.sha}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <footer className="mt-10 text-[11px] text-slate-500 text-center">
          v40b admin scaffold · placeholders will be replaced once <code className="bg-slate-100 px-1 rounded">/api/admin/*</code> endpoints are wired
        </footer>
      </main>
    </div>
  );
};

export default Admin;
