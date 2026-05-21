// src/pages/Hire.tsx
// v71: "Hire the operator" — direct-hire landing page. Different from /pricing.
// Positioned for the Cuban/O'Leary reader who already knows they want to hire
// the operator. No deck. No SDR loop. No quarterly QBR. Just the work.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { RevealUp, StaggerChildren, HoverLift } from "@/components/motion";
import { fireEvent } from "@/lib/event";

const CAL_URL = "https://cal.com/trainyouragent/30min";

const COMMITMENTS = [
  "I show up to every Zoom myself.",
  "I write every commit myself.",
  "I respond to Slack within 4 business hours, every day.",
  "If I miss a deadline, every day late = 5% off the bill (cap: full project).",
  "If you cancel mid-build, you pay only for time spent and keep all code.",
];

const WHAT_YOU_GET = [
  "Direct line to the operator — no SDR, no account manager, no delivery team.",
  "Scoped in 30 minutes on a Zoom call.",
  "Shipped end-to-end in 30 days flat (or less).",
  "Code in your repo (or mine, your call).",
  "Public commits to a private branch — you see every ship.",
  "One operator: I write the prompts, wire the infra, deploy the agent, tune it weekly.",
  "Same multi-LLM architecture this site runs on.",
  "30-day money-back if I don't deliver.",
];

const PRICING_TIERS = [
  { name: "Custom voice agent",                         price: "$7,500 – $15,000",  note: "Twilio + Deepgram + Cartesia + Anthropic + your CRM." },
  { name: "Custom chat agent + CRM wiring",             price: "$5,000 – $10,000",  note: "Web + SMS + WhatsApp, qualified handoff to your team." },
  { name: "Internal tool / dashboard",                  price: "$4,000 – $12,000",  note: "Ops co-pilot, internal AI search, custom workflows." },
  { name: "Marketing infrastructure",                   price: "$8,000 – $20,000",  note: "Email + CAPI + funnel + content engine, wired together." },
  { name: "White-glove fix-everything engagement",      price: "$15,000 – $50,000", note: "30-day rebuild of your AI layer, end to end." },
];

const ARTIFACTS = [
  { label: "11 free working tools",       to: "/tools",            sub: "Voice script gen, cold DM gen, diagnose wizard, ROI calc, audit, agent builder, and 5 more." },
  { label: "15 niche playbooks",          to: "/playbooks",        sub: "HVAC, dental, law, roofing, real estate, restaurants, fitness, and 8 more." },
  { label: "70 long-form blog posts",     to: "/blog",             sub: "Deep dives on voice agents, RAG, agent eval harnesses, vendor due diligence." },
  { label: "569 live URLs",               to: "/api/sitemap.xml",  sub: "Full sitemap — every blog post, playbook, vertical, city, and tool." },
  { label: "Architecture receipts",       to: "/proof",            sub: "344+ commits in 91 days. Stack chart. Velocity graph. Multi-LLM fallback." },
  { label: "Voice agent in browser",      to: "/voice-demo",       sub: "Talk to a working AI agent right now. No signup." },
];

const BUDGET_OPTIONS = [
  { value: "5-15",  label: "$5K – $15K" },
  { value: "15-50", label: "$15K – $50K" },
  { value: "50+",   label: "$50K+" },
];

const TIMELINE_OPTIONS = [
  { value: "asap",  label: "ASAP — fire is on" },
  { value: "30",    label: "30 days" },
  { value: "60-90", label: "60–90 days" },
  { value: "rush",  label: "No rush — planning ahead" },
];

export default function Hire() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [need, setNeed] = useState("");
  const [budget, setBudget] = useState("5-15");
  const [timeline, setTimeline] = useState("30");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Hire the operator — TrainYourAgent";
    const m = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (m) m.setAttribute("content", "Hire Alexander as your AI build team. One operator. Any AI system. 30 days flat or less. 344+ public commits in 91 days. 569 live URLs. Direct hire — no SDR, no account manager.");

    // v76-B: per-page dynamic OG image so /hire previews on LinkedIn /
    // Twitter / Slack with a unique card, not the site-wide fallback.
    const ogImage =
      "https://www.trainyouragent.com/api/og" +
      "?title=" + encodeURIComponent("Hire the operator") +
      "&eyebrow=" + encodeURIComponent("DIRECT HIRE") +
      "&kicker=" + encodeURIComponent("One builder. Any AI system. 30 days flat.") +
      "&type=page";
    const setProp = (p: string, c: string) => {
      let el = document.querySelector(`meta[property='${p}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", p); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    const setName = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setProp("og:image", ogImage);
    setProp("og:image:width", "1200");
    setProp("og:image:height", "630");
    setName("twitter:image", ogImage);
    setName("twitter:card", "summary_large_image");
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setErr("Real email please."); return; }
    if (!need.trim()) { setErr("Tell me what you want built."); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          company: company.trim() || undefined,
          source: "hire-operator",
          path: "/hire",
          payload: {
            need: need.trim().slice(0, 2000),
            budget,
            timeline,
          },
        }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (j?.ok) {
        setDone(true);
        void fireEvent("lead_submit", { source: "hire-operator", budget, timeline }, "hire-form");
      } else {
        setErr("Submission failed. Email alexander@trainyouragent.com directly.");
      }
    } catch {
      setErr("Network error. Email alexander@trainyouragent.com directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <SiteNav />

      {/* HERO */}
      <section className="relative pt-28 sm:pt-36 pb-16 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
        </div>
        <div className="max-w-5xl mx-auto">
          <RevealUp y={18} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Direct hire · one operator
            </div>
          </RevealUp>
          <RevealUp y={22} duration={0.7}>
            <h1 className="text-[30px] sm:text-[50px] md:text-[64px] lg:text-[72px] leading-[1.06] sm:leading-[1.04] lg:leading-[1.02] tracking-tight font-semibold text-[#042C53] h1-balance break-words">
              Hire the operator who built{" "}
              <Link to="/proof" className="underline decoration-[#185FA5]/40 hover:decoration-[#042C53] underline-offset-4">
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>this site</span>
              </Link>
              .
            </h1>
          </RevealUp>
          <RevealUp y={16} duration={0.6} delay={0.05}>
            <p className="mt-7 text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-3xl">
              344+ public commits in 91 days. 569 live URLs. 11 working tools. Multi-LLM fallback in production. Stripe wired. Supabase wired. Cal.com wired. Resend wired. If you need an AI system built for your business — custom voice agent, internal tool, marketing infra, dashboard, anything — you're hiring the person whose receipts are public.
            </p>
          </RevealUp>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <HoverLift>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] transition shadow-lg shadow-[#042C53]/15 inline-flex items-center justify-between gap-3 min-w-[280px]"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-1">30 minutes · free scope call</span>
                  <span>Book the 30-min build call →</span>
                </span>
              </a>
            </HoverLift>
            <HoverLift>
              <Link
                to="/proof"
                className="px-6 py-4 rounded-2xl bg-white border-2 border-[#042C53] text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB] transition inline-flex items-center gap-2"
              >
                See the public receipts →
              </Link>
            </HoverLift>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 bg-[#F6FAFE]">
        <div className="max-w-5xl mx-auto">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">What you get when you hire me</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold text-[#042C53] leading-tight">
              One operator. Direct line. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>End-to-end.</span>
            </h2>
          </RevealUp>
          <StaggerChildren className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4" delay={0.05}>
            {WHAT_YOU_GET.map((item) => (
              <div key={item} className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-slate-200">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E6F1FB] text-[#042C53] inline-flex items-center justify-center text-[14px] font-bold mt-0.5">✓</span>
                <span className="text-[15px] text-slate-700 leading-snug">{item}</span>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* PRICING STRUCTURE */}
      <section className="px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">Pricing structure · transparent</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold text-[#042C53] leading-tight">
              Discovery is free. The build is{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>scoped on the call.</span>
            </h2>
            <p className="mt-4 text-[16px] text-slate-700 max-w-2xl">
              50% on kickoff. 50% on ship. No retainers, no contracts past the project. The ranges below are real — I'll quote the exact number after the 30-minute scope call.
            </p>
          </RevealUp>
          <div className="mt-10 rounded-2xl border border-slate-200 overflow-hidden">
            {PRICING_TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_2fr] gap-2 sm:gap-6 px-5 sm:px-7 py-5 ${i % 2 === 0 ? "bg-white" : "bg-[#F6FAFE]"} ${i < PRICING_TIERS.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <div className="font-semibold text-[#042C53] text-[15px] sm:text-[16px]">{t.name}</div>
                <div className="font-mono text-[14px] sm:text-[15px] text-[#185FA5]">{t.price}</div>
                <div className="text-[13.5px] sm:text-[14px] text-slate-600 leading-snug">{t.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 inline-flex flex-wrap items-center gap-3 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-semibold">Discovery + scope: free</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-semibold">50% kickoff · 50% on ship</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-semibold">No retainers</span>
          </div>
        </div>
      </section>

      {/* 5 COMMITMENTS */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 bg-[#042C53] text-white">
        <div className="max-w-5xl mx-auto">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#9CC4EC] mb-3">The 5 commitments</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold leading-tight">
              In writing. Enforced by{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>a money penalty.</span>
            </h2>
          </RevealUp>
          <StaggerChildren className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4" delay={0.05}>
            {COMMITMENTS.map((c, i) => (
              <div key={c} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="flex-shrink-0 text-[28px] font-semibold text-[#9CC4EC]" style={{ fontFamily: "'Playfair Display', serif" }}>{i + 1}</span>
                <span className="text-[15px] text-white/90 leading-snug">{c}</span>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* REAL ARTIFACTS */}
      <section className="px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">Real artifacts I've shipped</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold text-[#042C53] leading-tight">
              The receipts. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>All public.</span>
            </h2>
          </RevealUp>
          <StaggerChildren className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.05}>
            {ARTIFACTS.map((a) => (
              <HoverLift key={a.label}>
                <Link
                  to={a.to}
                  className="block p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#042C53]/40 hover:shadow-lg hover:shadow-[#042C53]/10 transition h-full"
                >
                  <div className="text-[15px] font-semibold text-[#042C53]">{a.label} →</div>
                  <div className="mt-2 text-[13.5px] text-slate-600 leading-snug">{a.sub}</div>
                </Link>
              </HoverLift>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" className="px-5 sm:px-8 py-16 sm:py-24 bg-[#F6FAFE]">
        <div className="max-w-3xl mx-auto">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">Apply to hire</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold text-[#042C53] leading-tight">
              Tell me what you want built.
            </h2>
            <p className="mt-4 text-[16px] text-slate-700">
              Alexander reviews every hire inquiry personally. Expect a reply within 4 business hours.
            </p>
          </RevealUp>
          {done ? (
            <div className="mt-10 p-8 rounded-2xl bg-white border-2 border-[#22A36C]/30">
              <div className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#22A36C] mb-2">Received</div>
              <div className="text-[20px] font-semibold text-[#042C53]">Got it. Expect a reply within 4 business hours.</div>
              <div className="mt-3 text-[14px] text-slate-600">
                If it's urgent: alexander@trainyouragent.com — direct line.
              </div>
              <div className="mt-6 flex gap-3">
                <a href={CAL_URL} target="_blank" rel="noopener" className="px-5 py-3 rounded-xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E]">
                  Book the 30-min call now →
                </a>
                <Link to="/proof" className="px-5 py-3 rounded-xl bg-white border border-slate-300 text-[#042C53] text-[14px] font-semibold hover:border-[#042C53]">
                  See the receipts
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={120}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[15px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">Email *</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[15px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label className="block">
                <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">Company</span>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[15px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                  placeholder="Company name"
                />
              </label>
              <label className="block">
                <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">What do you want built? *</span>
                <textarea
                  required
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[15px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none resize-y"
                  placeholder="Describe the system, the customer or workflow it serves, and what 'shipped' looks like."
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">Budget range</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[15px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                  >
                    {BUDGET_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">Timeline</span>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[15px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                  >
                    {TIMELINE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              {err && <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{err}</div>}
              <HoverLift>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15 transition disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send hire inquiry →"}
                </button>
              </HoverLift>
              <p className="text-[12.5px] text-slate-500">
                Alexander reviews every hire inquiry personally. Expect a reply within 4 business hours.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* WHY THIS PAGE EXISTS — honest framing */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-4">Why this page exists</div>
            <blockquote
              className="text-[24px] sm:text-[32px] leading-[1.3] text-[#042C53] font-medium"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              "If you're reading this, you probably already know whether you want to hire me. This page exists for the people who do. No deck. No SDR loop. No quarterly check-in. Just the work."
            </blockquote>
            <div className="mt-6 text-[14px] text-slate-600">— Alexander</div>
          </RevealUp>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <HoverLift>
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-3.5 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] inline-flex items-center gap-2">
                Book the 30-min call →
              </a>
            </HoverLift>
            <HoverLift>
              <a href="#apply" className="px-6 py-3.5 rounded-2xl bg-white border-2 border-[#042C53] text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB] inline-flex items-center gap-2">
                Or fill the form →
              </a>
            </HoverLift>
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
