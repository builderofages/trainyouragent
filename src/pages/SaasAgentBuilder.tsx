// src/pages/SaasAgentBuilder.tsx
// v71: PAID tier landing page for the Self-Serve Agent Builder.
// $99/mo SaaS. Free tier (one agent) is at /tools/agent-builder.
// "Start free trial" captures lead with source saas-agent-builder-trial.
// "Subscribe" hits /api/checkout with plan=saas-agent-builder.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { RevealUp, StaggerChildren, HoverLift } from "@/components/motion";
import { fireEvent } from "@/lib/event";
import { Infinity as InfinityIcon, Code2, Palette } from "lucide-react";

const FEATURES = [
  {
    Icon: InfinityIcon,
    title: "Unlimited agents",
    body: "Free tier gets 1. Paid gets unlimited. Build one per product line, one per niche, one per audience — iterate without a quota.",
  },
  {
    Icon: Code2,
    title: "Embed anywhere",
    body: "Drop a script tag on any site. Auto-resizing widget. Mobile-ready. Works on WordPress, Webflow, Shopify, Framer, raw HTML.",
  },
  {
    Icon: Palette,
    title: "Brand it as yours",
    body: "Custom colors, logo, voice — no TrainYourAgent watermark. Looks like your product. Useful for agencies reselling.",
  },
];

const DETAILED_FEATURES = [
  "Unlimited agent drafts",
  "Embeddable widget for any website",
  "Custom branding (colors, logo, no watermark)",
  "Save, share, version every agent",
  "Export the system prompt anytime",
  "Full transcript log of every conversation",
  "Weekly tune-up suggestions from Groq",
  "Direct Slack with Alexander on every plan",
  "30-day money-back",
  "Cancel anytime — month-to-month",
];

export default function SaasAgentBuilder() {
  const [trialOpen, setTrialOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [trialDone, setTrialDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Self-Serve Agent Builder — $99/mo · TrainYourAgent";
    const m = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (m) m.setAttribute("content", "Build your own AI agent — unlimited drafts, embed anywhere, $99/mo. 7-day free trial, no card required. Iterate, brand, deploy — all yours.");
  }, []);

  async function submitTrial(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setErr("Real email please."); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: "saas-agent-builder-trial",
          path: "/saas/agent-builder",
        }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (j?.ok) {
        setTrialDone(true);
        void fireEvent("lead_submit", { source: "saas-agent-builder-trial" }, "agent-builder-trial");
      } else {
        setErr("Submission failed. Email alexander@trainyouragent.com directly.");
      }
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function subscribe() {
    setCheckoutLoading(true);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: "saas-agent-builder" }),
      });
      const j = await r.json().catch(() => ({}));
      if (j?.url) {
        window.location.href = j.url as string;
        return;
      }
      // Graceful fallback: capture as trial lead so we can manually onboard.
      if (j?.error === "stripe-not-configured" || j?.error === "plan-not-configured") {
        setTrialOpen(true);
        setErr("Checkout is being wired — drop your email and we'll grant you access manually within an hour.");
      } else {
        setErr("Couldn't start checkout. Try again or email alexander@trainyouragent.com.");
      }
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <SiteNav />

      {/* HERO */}
      <section className="relative pt-28 sm:pt-36 pb-16 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
        </div>
        <div className="max-w-5xl mx-auto">
          <RevealUp y={18}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Self-Serve · $99/mo · live today
            </div>
          </RevealUp>
          <RevealUp y={22} duration={0.7}>
            <h1 className="text-[36px] sm:text-[60px] md:text-[72px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
              Build your own AI agent —{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>unlimited, embeddable, $99/mo.</span>
            </h1>
          </RevealUp>
          <RevealUp y={16} delay={0.05}>
            <p className="mt-7 text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-3xl">
              The free agent builder is at <Link to="/tools/agent-builder" className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/40 underline-offset-2">/tools/agent-builder</Link> — one agent, sandbox-only. The paid tier unlocks unlimited agents, embed-anywhere widget, custom branding, transcript logs, and weekly tune-up suggestions.
            </p>
          </RevealUp>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <HoverLift>
              <button
                type="button"
                onClick={() => setTrialOpen(true)}
                className="px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] transition shadow-lg shadow-[#042C53]/15 inline-flex items-center justify-between gap-3 min-w-[280px]"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-1">7-day free trial · no card</span>
                  <span>Start free trial →</span>
                </span>
              </button>
            </HoverLift>
            <HoverLift>
              <button
                type="button"
                onClick={subscribe}
                disabled={checkoutLoading}
                className="px-7 py-4 rounded-2xl bg-white border-2 border-[#042C53] text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB] transition disabled:opacity-60 inline-flex items-center gap-2"
              >
                {checkoutLoading ? "Loading…" : "Subscribe — $99/mo →"}
              </button>
            </HoverLift>
          </div>
          {trialOpen && !trialDone && (
            <div className="mt-8 max-w-md p-5 rounded-2xl bg-white border-2 border-[#042C53] shadow-xl">
              <div className="text-[13px] font-semibold text-[#042C53] mb-1">Start your 7-day free trial</div>
              <div className="text-[12.5px] text-slate-600 mb-3">No credit card. Cancel anytime in the dashboard.</div>
              <form onSubmit={submitTrial} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-[14px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-5 py-2.5 rounded-lg bg-[#042C53] text-white font-semibold text-[13px] hover:bg-[#0A3D6E] disabled:opacity-60"
                >
                  {submitting ? "Starting…" : "Start free trial"}
                </button>
                {err && <div className="text-[12px] text-red-700">{err}</div>}
              </form>
            </div>
          )}
          {trialDone && (
            <div className="mt-8 max-w-md p-5 rounded-2xl bg-[#E6F1FB] border-2 border-[#22A36C]/30">
              <div className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#22A36C] mb-1">Trial active</div>
              <div className="text-[16px] font-semibold text-[#042C53]">Check your inbox — your trial credentials are on the way.</div>
              <div className="mt-2 text-[13px] text-slate-600">Or jump straight to the free builder to test: <Link to="/tools/agent-builder" className="text-[#185FA5] underline">/tools/agent-builder</Link></div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURE 3-CARD */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">What you unlock at $99/mo</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold text-[#042C53] leading-tight">
              Three things free can't do.
            </h2>
          </RevealUp>
          <StaggerChildren className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5" delay={0.06}>
            {FEATURES.map((f) => (
              <HoverLift key={f.title}>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#E6F1FB] inline-flex items-center justify-center mb-4">
                    <f.Icon className="w-6 h-6 text-[#042C53]" strokeWidth={2.2} />
                  </div>
                  <div className="text-[18px] font-semibold text-[#042C53]">{f.title}</div>
                  <p className="mt-2 text-[14px] text-slate-700 leading-snug">{f.body}</p>
                </div>
              </HoverLift>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* DETAILED FEATURE LIST + PRICING SUMMARY */}
      <section className="px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">Everything included</div>
            <h2 className="text-[26px] sm:text-[34px] tracking-tight font-semibold text-[#042C53] leading-tight">
              Ten checkboxes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>One price.</span>
            </h2>
            <ul className="mt-6 space-y-2.5">
              {DETAILED_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14.5px] text-slate-700">
                  <span className="flex-shrink-0 text-[#042C53] mt-0.5 font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </RevealUp>
          <RevealUp y={16} delay={0.05}>
            <div className="rounded-3xl border-2 border-[#042C53] p-8 bg-white shadow-xl shadow-[#042C53]/10">
              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-2">Paid tier</div>
              <div className="text-[52px] sm:text-[64px] leading-none font-semibold text-[#042C53]" style={{ fontFamily: "'Playfair Display', serif" }}>
                $99<span className="text-[20px] text-slate-500 font-normal">/mo</span>
              </div>
              <div className="mt-4 text-[15px] text-slate-700">7-day free trial. No card required to start. Cancel anytime — month-to-month, no contract.</div>
              <div className="mt-6 flex flex-col gap-3">
                <HoverLift>
                  <button
                    type="button"
                    onClick={() => setTrialOpen(true)}
                    className="w-full px-5 py-3.5 rounded-xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E]"
                  >
                    Start free trial →
                  </button>
                </HoverLift>
                <HoverLift>
                  <button
                    type="button"
                    onClick={subscribe}
                    disabled={checkoutLoading}
                    className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-[#042C53] text-[#042C53] font-semibold text-[14px] hover:bg-[#E6F1FB] disabled:opacity-60"
                  >
                    {checkoutLoading ? "Loading…" : "Subscribe now →"}
                  </button>
                </HoverLift>
              </div>
              <div className="mt-5 text-[12px] text-slate-500 text-center">Free tier (1 agent, sandbox) lives at <Link to="/tools/agent-builder" className="text-[#185FA5] underline">/tools/agent-builder</Link></div>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* RISK REVERSAL + UPSELL */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#9CC4EC] mb-3">Risk reversal</div>
            <h2 className="text-[28px] sm:text-[40px] tracking-tight font-semibold leading-tight">
              7-day trial. No card. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>30-day money-back if you do subscribe.</span>
            </h2>
            <p className="mt-5 text-[16px] text-white/85 max-w-2xl mx-auto">
              If $99/mo doesn't pay for itself in the first 30 days, email alexander@trainyouragent.com and I'll refund every dollar. No questions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <HoverLift>
                <button
                  type="button"
                  onClick={() => setTrialOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB]"
                >
                  Start the free trial →
                </button>
              </HoverLift>
              <HoverLift>
                <Link to="/hire" className="px-6 py-3.5 rounded-2xl bg-transparent border-2 border-white text-white font-semibold text-[15px] hover:bg-white/10">
                  Or hire me to build it for you →
                </Link>
              </HoverLift>
            </div>
          </RevealUp>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
