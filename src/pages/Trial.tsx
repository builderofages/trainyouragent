// src/pages/Trial.tsx — route /trial
// v38: 7-day live-trial offer page.
//
// Flow:
//   1) Hero pitches the 7-day trial
//   2) Four-step explainer (scope → build → live → decide)
//   3) "What you get during the trial" 6-bullet list
//   4) Email gate → POSTs to /api/lead with source:"trial-request"
//   5) Primary CTA → Cal.com (talk to Alexander first)
//
// /api/lead already exists and handles arbitrary {source, email, name, …}.

import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const STEPS = [
  { n: "01", h: "30-min scope call", b: "We listen to your current call flow, look at recordings if you've got them, and write back your trial scope in plain English the same day." },
  { n: "02", h: "We build in 5 days", b: "Voice + chat scripts, model config, CRM and calendar wiring, monitoring. You see drafts within the first 48 hours." },
  { n: "03", h: "Live on your line for 7 days", b: "Number port or SIP redirect. Every call, transcript, and booking flows to a dashboard you can watch in real time." },
  { n: "04", h: "Decide on day 7", b: "Keep it (we move to month-to-month), iterate (we extend by 7 days, no charge), or walk (we take it down, you keep the transcripts)." },
];

const WHAT_YOU_GET = [
  "A live voice agent on a dedicated test number, configured to your industry.",
  "Dashboard with every call transcript, booking, and quality score.",
  "Daily Loom from Alexander walking through what shipped that day.",
  "Direct Slack channel with the build team — no tickets, no support tiers.",
  "CRM + calendar integration (HubSpot, GoHighLevel, ServiceTitan, Cal.com).",
  "Full export at the end of the 7 days — transcripts, configs, you own all of it.",
];

const Trial = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "7-day live trial — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "Watch our agent run your business for 7 days. Free. Scope on a call, we build in 5 days, you watch it answer your real traffic for a week.");
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErr(null);
    setSubmitting(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "trial-request", email: email.trim(), name: name.trim(), vertical: vertical.trim() }),
      });
      if (!r.ok && r.status !== 204) throw new Error(`api ${r.status}`);
      setDone(true);
    } catch (e: any) {
      setErr("Couldn't reach the server — please try again or just book the call below.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-28">
        {/* HERO */}
        <section className="px-5 sm:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> 7-day live trial · No charge
            </div>
            <h1 className="text-[clamp(40px,6.5vw,84px)] leading-[1.02] tracking-tight font-semibold text-[#042C53] mb-6">
              Watch our agent run your business for{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>7 days. Free.</span>
            </h1>
            <p className="text-[19px] text-slate-700 max-w-2xl mx-auto leading-relaxed">
              Scope on a 30-minute call. We build in 5 days. You watch it answer your real phone line for a week. Decide on day 7.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">
                Start the trial — talk to Alexander first →
              </a>
              <a href="#trial-form" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">
                Or get the trial details by email
              </a>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#185FA5] font-semibold mb-3">How it works</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">
              Four steps. One week. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Live on your line.</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl bg-white border border-slate-200 p-5">
                  <div className="text-[#185FA5] font-mono text-[12px] tracking-wide mb-3">{s.n}</div>
                  <div className="text-[16px] font-semibold text-[#042C53] mb-2">{s.h}</div>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="px-5 sm:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#185FA5] font-semibold mb-3">What you get during the trial</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">
              Six concrete things. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Day one.</span>
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {WHAT_YOU_GET.map((g, i) => (
                <li key={i} className="rounded-2xl bg-white border border-slate-200 p-5 flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[14px] text-[#042C53] leading-relaxed">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* EMAIL GATE */}
        <section id="trial-form" className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
          <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.10)]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Get the trial details</div>
            <h2 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-3">
              Drop your email — Alexander reads every one.
            </h2>
            <p className="text-[15px] text-slate-600 mb-6">
              You'll get a 4-minute video walking through what the trial looks like and a calendar link to scope your build.
            </p>
            {done ? (
              <div className="rounded-2xl bg-[#E5F4EC] border border-[#22A36C]/30 px-5 py-4 text-[14px] text-[#1F7E55]">
                Got it. Check your inbox in the next minute — and if you want to skip the wait,{" "}
                <a href={CAL_URL} target="_blank" rel="noopener" className="font-semibold underline">book directly here</a>.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[15px] text-[#042C53] placeholder-slate-400 focus:border-[#185FA5] focus:outline-none"
                  autoComplete="name"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[15px] text-[#042C53] placeholder-slate-400 focus:border-[#185FA5] focus:outline-none"
                  autoComplete="email"
                />
                <input
                  type="text"
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  placeholder="Industry (HVAC, clinic, brokerage, startup, …)"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[15px] text-[#042C53] placeholder-slate-400 focus:border-[#185FA5] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3.5 rounded-xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send me the trial details →"}
                </button>
                {err && <div className="text-[13px] text-[#9C2A2A]">{err}</div>}
                <div className="text-[12px] text-slate-400">
                  No spam. No drip sequence dressed up as a "course." Just the trial details.
                </div>
              </form>
            )}
          </div>
        </section>

        {/* CLOSER */}
        <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[32px] sm:text-[48px] leading-[1.05] tracking-tight font-semibold">
              Or just <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>book the call.</span>
            </h2>
            <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
              The trial starts with a 30-minute conversation. Whether you want to start today or in six weeks, the call is the right first step.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">
                Book a 30-min build call →
              </a>
              <Link to="/customers" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">
                See who's already on us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/customers" className="hover:text-[#042C53]">Customers</Link>
            <Link to="/testimonials" className="hover:text-[#042C53]">Testimonials</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent LLC</div>
        </div>
      </footer>
    </div>
  );
};

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22A36C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default Trial;
