// src/pages/AgencyPartner.tsx
// White-label / partner program page for AI agencies that want to run
// TrainYourAgent's voice + chat + infra under their own brand.
// Routed from PathwayRouter when the visitor selects "Agency".

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const FORM_ENDPOINT = "/api/lead";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

type Tier = {
  id: string;
  name: string;
  clients: string;
  monthly: string;
  margin: string;
  perks: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    clients: "1–4 clients",
    monthly: "$0/mo",
    margin: "60% you / 40% us",
    perks: [
      "White-label voice + chat builds (your brand on every call)",
      "Shared Slack with our engineering team",
      "Monthly office hours with the founder",
      "Co-branded sales collateral (decks, one-pagers, ROI calc)",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    clients: "5–19 clients",
    monthly: "$1,500/mo",
    margin: "65% you / 35% us",
    highlight: true,
    perks: [
      "Everything in Starter",
      "Dedicated partner engineer (your direct contact)",
      "Priority build queue — 7 day SLA on new client launches",
      "Volume pricing on minutes, SMS, and infrastructure",
      "Quarterly joint-marketing co-op ($2K/qtr toward your campaigns)",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    clients: "20+ clients",
    monthly: "Custom",
    margin: "70% you / 30% us",
    perks: [
      "Everything in Growth",
      "Multi-tenant partner dashboard with sub-account billing",
      "Reseller MSA + white-label legal (terms, DPA, BAA under your brand)",
      "Co-engineered features — we ship to your roadmap",
      "Direct-to-founder line, weekly review",
    ],
  },
];

const STEPS = [
  {
    n: "01",
    h: "You sell. We build.",
    b: "You close the agency engagement under your brand. We scope, build, and ship the agent inside our infra — invisible to the client.",
  },
  {
    n: "02",
    h: "We run. You bill.",
    b: "Voice, chat, CRM, telephony — all running on TrainYourAgent infrastructure with your domain, your dashboard, your phone number. Client sees you.",
  },
  {
    n: "03",
    h: "You keep most of the revenue.",
    b: "60–70% of every monthly retainer + setup fee lands in your account. We handle the per-minute infrastructure cost, the model bills, the on-call rotation.",
  },
];

const AgencyPartner = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", agency: "", clients: "" });

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Agency Partner Program — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", n);
        document.head.appendChild(el);
      }
      el.setAttribute("content", c);
    };
    setMeta(
      "description",
      "White-label TrainYourAgent's voice, chat, and infrastructure stack under your own brand. 60-70% revenue share. Built for AI agencies running 5+ client engagements.",
    );
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          source: "agency-partner",
          meta: { agency: form.agency, clients: form.clients },
        }),
      }).catch(() => {});
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav />

      {/* HERO */}
      <section className="relative pt-32 pb-16 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)",
            }}
          />
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Agency Partner Program
          </div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.0] tracking-tight font-semibold text-[#042C53]">
            Run TrainYourAgent's voice + chat + infra{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              under your own brand.
            </span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            You sell. We build. You bill. Keep 60–70% of every retainer while
            we handle the per-minute infrastructure, the model bills, the
            on-call rotation, and the weekly tuning your clients never see.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#apply"
              className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15"
            >
              Apply to partner →
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]"
            >
              Talk to the founder
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            How it works
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Three steps from{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              signed contract to live agent.
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] hover:shadow-[0_8px_40px_-15px_rgba(4,44,83,0.25)] transition"
              >
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
                  Step {s.n}
                </div>
                <h3 className="text-[22px] font-semibold text-[#042C53] mb-3 leading-tight">
                  {s.h}
                </h3>
                <p className="text-[14px] text-slate-700 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVENUE SPLIT */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#042C53] to-[#0A3D6E] text-white p-8 sm:p-12 shadow-[0_30px_80px_-30px_rgba(4,44,83,0.5)]">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">
            Revenue split
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold mb-6">
            60% / 40% standard.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Up to 70% at scale.
            </span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-[15px] text-white/85 leading-relaxed">
            <div>
              <div className="text-[42px] font-semibold text-white mb-1">60%</div>
              <div>Yours on every monthly retainer at the Starter tier.</div>
            </div>
            <div>
              <div className="text-[42px] font-semibold text-white mb-1">100%</div>
              <div>
                Of every setup fee. Every build, every onboarding, every kickoff
                — yours to keep.
              </div>
            </div>
            <div>
              <div className="text-[42px] font-semibold text-white mb-1">0</div>
              <div>
                Per-minute risk. We absorb model + telephony cost overruns above
                90th-percentile usage.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Partner tiers
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Pick where you start.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Move up as you grow.
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className={`rounded-3xl p-7 transition flex flex-col ${
                  t.highlight
                    ? "bg-[#042C53] text-white border-2 border-[#185FA5] shadow-[0_20px_60px_-20px_rgba(4,44,83,0.4)] scale-[1.02]"
                    : "bg-white border border-slate-200 hover:border-[#185FA5]"
                }`}
              >
                {t.highlight && (
                  <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#9CC4EC] mb-2">
                    Most popular
                  </div>
                )}
                <div
                  className={`text-[12px] uppercase tracking-[0.14em] font-semibold mb-2 ${
                    t.highlight ? "text-[#9CC4EC]" : "text-[#185FA5]"
                  }`}
                >
                  {t.clients}
                </div>
                <h3
                  className={`text-[28px] font-semibold mb-1 ${
                    t.highlight ? "text-white" : "text-[#042C53]"
                  }`}
                >
                  {t.name}
                </h3>
                <div
                  className={`text-[15px] mb-1 ${
                    t.highlight ? "text-white/80" : "text-slate-600"
                  }`}
                >
                  Platform fee · {t.monthly}
                </div>
                <div
                  className={`text-[13px] font-semibold mb-5 ${
                    t.highlight ? "text-[#9CC4EC]" : "text-[#042C53]"
                  }`}
                >
                  Revenue split: {t.margin}
                </div>
                <ul
                  className={`space-y-2.5 text-[14px] mb-6 leading-relaxed ${
                    t.highlight ? "text-white/90" : "text-slate-700"
                  }`}
                >
                  {t.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${
                          t.highlight ? "bg-[#22A36C]" : "bg-[#185FA5]"
                        }`}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className={`mt-auto block text-center px-5 py-3 rounded-2xl font-semibold text-[14px] transition ${
                    t.highlight
                      ? "bg-white text-[#042C53] hover:bg-slate-100"
                      : "bg-[#042C53] text-white hover:bg-[#0A3D6E]"
                  }`}
                >
                  Apply for {t.name} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Partner dashboard
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-3">
            One pane of glass for{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              every client account.
            </span>
          </h2>
          <p className="text-[16px] text-slate-700 max-w-3xl leading-relaxed mb-8">
            Live MRR per client, agent uptime, weekly call volume, dispute
            queue, payout schedule. Everything you need to manage 40 clients
            from your laptop.
          </p>
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-[0_20px_60px_-20px_rgba(4,44,83,0.18)]">
            <div className="grid sm:grid-cols-4 gap-4 mb-6">
              {[
                ["Live MRR", "$48,250"],
                ["Active clients", "23"],
                ["Calls this week", "11,482"],
                ["Your payout (Mar)", "$28,950"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-[#F6FAFE] p-4 border border-slate-100">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-1">
                    {k}
                  </div>
                  <div className="text-[22px] font-semibold text-[#042C53]">{v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 bg-[#F6FAFE] text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                <div>Client</div>
                <div>MRR</div>
                <div className="hidden sm:block">Calls/wk</div>
                <div>Status</div>
              </div>
              {[
                ["Acme HVAC", "$2,400", "812", "Healthy"],
                ["BlueDoor Realty", "$1,800", "402", "Healthy"],
                ["North Loop Legal", "$3,200", "298", "Tuning"],
                ["Sunrise Spa", "$1,200", "190", "Healthy"],
                ["Pacific Solar", "$2,100", "521", "Healthy"],
              ].map(([c, m, w, s]) => (
                <div
                  key={c}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 text-[14px] border-t border-slate-100 items-center"
                >
                  <div className="text-[#042C53] font-medium">{c}</div>
                  <div className="text-slate-700">{m}</div>
                  <div className="hidden sm:block text-slate-700">{w}</div>
                  <div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        s === "Healthy"
                          ? "bg-[#E6F1FB] text-[#185FA5]"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 mt-4 text-center">
              Sample data — your live dashboard provisions on Day 1.
            </div>
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="px-5 sm:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Apply
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-4">
            Tell us about your agency.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              We respond inside one business day.
            </span>
          </h2>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-8">
            We accept ~5 new partners per quarter so the engineering team can
            actually ship for the existing ones. If you're not a fit this
            quarter, we'll tell you instead of stringing you along.
          </p>

          {submitted ? (
            <div className="rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/30 p-6 text-[#042C53]">
              <div className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#185FA5] mb-2">
                Application received
              </div>
              <div className="text-[18px] font-semibold mb-2">
                Thanks — we'll be in touch within one business day.
              </div>
              <div className="text-[14px] text-slate-700">
                In the meantime, book a 30-min intro:{" "}
                <a
                  href={CAL_URL}
                  target="_blank"
                  rel="noopener"
                  className="underline font-semibold"
                >
                  cal.com/trainyouragent
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_8px_40px_-15px_rgba(4,44,83,0.18)] space-y-5"
            >
              <div>
                <label className="block text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                  Work email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@youragency.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                  Agency name
                </label>
                <input
                  required
                  type="text"
                  value={form.agency}
                  onChange={(e) => setForm({ ...form, agency: e.target.value })}
                  placeholder="Your Agency Co."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                  Monthly client volume
                </label>
                <select
                  required
                  value={form.clients}
                  onChange={(e) => setForm({ ...form, clients: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] bg-white focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20"
                >
                  <option value="">How many clients do you serve today?</option>
                  <option value="0-4">0–4 clients</option>
                  <option value="5-19">5–19 clients</option>
                  <option value="20-49">20–49 clients</option>
                  <option value="50+">50+ clients</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Apply to partner →"}
              </button>
              <p className="text-[12px] text-slate-500 text-center">
                We'll never share your info. Reviewed by a human, not a CRM
                workflow.
              </p>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— United States</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#042C53]">
              Terms
            </Link>
            <Link to="/security" className="hover:text-[#042C53]">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgencyPartner;
