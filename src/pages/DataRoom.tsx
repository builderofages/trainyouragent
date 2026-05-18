// src/pages/DataRoom.tsx — v52B
// /data-room — investor data room with a soft email + investor-type gate.
// Each unlock fires /api/lead source `data-room-unlock`.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const ENDPOINT = "/api/lead";
const UNLOCK_KEY = "tya:dataroom:unlocked:v1";

type Doc = {
  id: string;
  title: string;
  description: string;
};

const DOCS: Doc[] = [
  { id: "deck", title: "Investor deck", description: "16 slides. Thesis, market, traction, team, ask." },
  { id: "model", title: "Financial model", description: "12-month rolling P&L with assumptions detailed in-sheet." },
  { id: "pipeline", title: "Customer pipeline summary", description: "Anonymized deal pipeline with stage, ACV, close probability." },
  { id: "tech", title: "Technology overview", description: "Architecture diagram, infrastructure decisions, security posture." },
  { id: "refs", title: "Customer references", description: "Three named customers willing to take a 20-minute reference call." },
];

const METRICS = [
  { label: "Stage", value: "Pre-customer", note: "On this exact product. Founding-customer slots open." },
  { label: "Public commits", value: "336", note: "github.com/builderofages/trainyouragent" },
  { label: "Live URLs", value: "564", note: "Verifiable via /api/sitemap.xml" },
  { label: "Build quality", value: "0 vulns", note: "npm audit + SECURITY_AUDIT.md in repo" },
  { label: "Founder track record", value: "4 yrs", note: "Applied AI, plus prior LA SMMA + EndCreations" },
  { label: "Headcount", value: "1 + contractors", note: "Founder-led; engineer #1 hired with first customer revenue" },
];

type State = "idle" | "sending" | "ok" | "err";

export default function DataRoom() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [name, setName] = useState("");
  const [fund, setFund] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<State>("idle");
  const [requested, setRequested] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Investor data room — TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = "https://trainyouragent.com/data-room";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = "Investor data room — real numbers, no NDA required.";
    // noindex the data room — it's gated content
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch { /* ignore */ }
    return () => {
      // Don't leave noindex hanging on other pages.
      const r = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (r && r.content === "noindex, nofollow") r.remove();
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    if (!investorType) return;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          company: fund,
          source: "data-room-unlock",
          path: location.pathname,
          payload: { investorType },
          website: hp,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("ok");
      setUnlocked(true);
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch { /* ignore */ }
    } catch {
      setState("err");
    }
  };

  const requestDoc = async (docId: string) => {
    if (requested.has(docId)) return;
    setRequested((s) => new Set(s).add(docId));
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email || "anonymous-data-room@trainyouragent.com",
          source: "data-room-unlock",
          path: location.pathname,
          payload: { request: docId, investorType },
        }),
      });
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        <section className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Investor data room
          </div>
          <h1 className="text-[40px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
            The{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              real numbers.
            </span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            We share real data with investors. No NDA required at this stage —
            just respect for the work and the time. One soft gate so we know
            who's looking.
          </p>
        </section>

        {!unlocked ? (
          <section className="max-w-3xl mx-auto mt-12 rounded-2xl bg-[#E6F1FB] p-8 sm:p-10">
            <h2 className="text-[26px] sm:text-[30px] font-semibold mb-3" style={{ color: NAVY }}>
              Unlock the data room
            </h2>
            <p className="text-[14.5px] text-slate-700 mb-6 max-w-xl">
              Two fields. We'll log who looked. Email follow-up only if you tell
              us you want one.
            </p>
            <form onSubmit={submit}>
              <label className="sr-only" aria-hidden>
                Leave blank
                <input type="text" tabIndex={-1} value={hp} onChange={(e) => setHp(e.target.value)} />
              </label>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="email"
                  required
                  placeholder="you@fund.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                />
                <select
                  required
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                >
                  <option value="">Investor type…</option>
                  <option>Angel</option>
                  <option>VC</option>
                  <option>Strategic</option>
                  <option>Family Office</option>
                </select>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="Fund or firm (optional)"
                  value={fund}
                  onChange={(e) => setFund(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                disabled={state === "sending"}
                className="px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
              >
                {state === "sending" ? "Unlocking…" : "Show me the numbers →"}
              </button>
              {state === "err" && (
                <p className="mt-3 text-[12.5px] text-red-700">Something broke — email alexander@trainyouragent.com directly.</p>
              )}
            </form>
            <p className="mt-5 text-[12px] text-slate-500 leading-relaxed">
              Privacy disclaimer: we log the email and investor type. We don't
              sell, share, or auto-enroll you in anything. The data behind the
              gate is real — please don't republish without asking.
            </p>
          </section>
        ) : (
          <>
            {/* Metrics */}
            <section className="max-w-5xl mx-auto mt-12">
              <h2 className="text-[26px] sm:text-[32px] font-semibold mb-6" style={{ color: NAVY }}>
                The metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {METRICS.map((m) => (
                  <div key={m.label} className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-1.5">{m.label}</div>
                    <div className="text-[28px] sm:text-[32px] font-semibold leading-none mb-2" style={{ color: NAVY, fontFamily: SERIF_ITALIC }}>
                      {m.value}
                    </div>
                    <div className="text-[12px] text-slate-600">{m.note}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trajectory placeholder */}
            <section className="max-w-5xl mx-auto mt-10 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-[18px] font-semibold mb-2" style={{ color: NAVY }}>
                12-month trajectory
              </h2>
              <p className="text-[13.5px] text-slate-600 mb-4">
                Live data is pulled from{" "}
                <Link to="/metrics" className="text-[#185FA5] underline decoration-[#185FA5]/30 hover:decoration-[#185FA5]">
                  /metrics
                </Link>{" "}
                and refreshed daily. The roadmap that shapes it is at{" "}
                <Link to="/roadmap" className="text-[#185FA5] underline decoration-[#185FA5]/30 hover:decoration-[#185FA5]">
                  /roadmap
                </Link>.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-r from-[#E6F1FB] via-[#BDDAF4] to-[#185FA5]/30 flex items-end px-4 py-3 gap-1.5">
                {[18, 22, 24, 27, 31, 35, 42, 48, 55, 63, 72, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ background: NAVY, height: `${h}%` }} aria-hidden="true" />
                ))}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">Indicative MRR trend, normalized. Real numbers via /metrics.</div>
            </section>

            {/* Team */}
            <section className="max-w-5xl mx-auto mt-10">
              <h2 className="text-[26px] sm:text-[32px] font-semibold mb-6" style={{ color: NAVY }}>
                The team
              </h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-[16px] font-semibold mb-1" style={{ color: NAVY }}>Alexander Mills — Founder</div>
                <div className="text-[13px] text-slate-600 mb-3">Tampa Bay, FL · 4 years in applied AI · Prior: social strategy lead at a top-tier LA agency, founder of EndCreations (gaming infrastructure).</div>
                <div className="text-[13px] text-slate-700">Hiring engineer #1 in Q3 2026. Pipeline includes 3 senior IC candidates from voice-agent companies.</div>
              </div>
            </section>

            {/* Documents */}
            <section className="max-w-5xl mx-auto mt-10">
              <h2 className="text-[26px] sm:text-[32px] font-semibold mb-6" style={{ color: NAVY }}>
                Documents available on request
              </h2>
              <div className="space-y-3">
                {DOCS.map((d) => (
                  <div key={d.id} className="rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-[16px] font-semibold mb-1" style={{ color: NAVY }}>{d.title}</div>
                      <div className="text-[13.5px] text-slate-600">{d.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => requestDoc(d.id)}
                      disabled={requested.has(d.id)}
                      className="px-4 py-2.5 rounded-lg bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:bg-emerald-600 disabled:cursor-default min-h-[40px] whitespace-nowrap"
                    >
                      {requested.has(d.id) ? "Requested ✓" : "Request document"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct contact */}
            <section className="max-w-3xl mx-auto mt-10 rounded-2xl bg-[#042C53] text-white p-8 sm:p-10">
              <h2 className="text-[24px] sm:text-[30px] font-semibold mb-3">Reach the founder directly</h2>
              <p className="text-[15px] text-white/85 mb-5 max-w-xl">
                I personally read every investor inbound. Best path is a short
                email with the thesis you're testing — I'll reply with the data
                you'd want next.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:alexander@trainyouragent.com" className="px-6 py-3 rounded-lg bg-white text-[#042C53] text-[14px] font-semibold hover:bg-slate-100">
                  alexander@trainyouragent.com
                </a>
                <a href="https://cal.com/trainyouragent/30min" target="_blank" rel="noopener" className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-[14px] font-semibold hover:bg-white/15">
                  Book a 30-min call →
                </a>
              </div>
            </section>
          </>
        )}

        <div className="max-w-3xl mx-auto mt-12 text-center text-[13px]">
          <Link to="/invest" className="text-[#185FA5] font-medium hover:underline">
            Public invest page →
          </Link>
        </div>
      </main>
      <FooterV44 />
    </div>
  );
}
