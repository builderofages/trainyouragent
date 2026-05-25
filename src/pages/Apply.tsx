// src/pages/Apply.tsx — v110
//
// The MONEY PAGE. Dedicated landing page for cold paid Meta/IG traffic.
// Every other page on the site serves multiple audiences. This page serves
// ONE: a cold operator who clicked a paid ad and has 30 seconds to decide
// whether to book a call.
//
// Hormozi $100M Offers + Cardone 10X urgency + Cuban contrarian + O'Leary
// numbers-discipline — every section earns its place against the
// 15-25% paid-traffic-to-booked-call benchmark.
//
// Structure (every block has a single job):
//   1. ATF HERO — one promise, one number, one CTA. No nav distraction.
//   2. SECONDS-OF-PAIN COUNTER — "while you read this, you missed X calls"
//   3. THE STACK (value equation) — what you get / what it costs / why now
//   4. PROOF — verifiable receipts only. No fake testimonials.
//   5. RISK REVERSAL — every fear named + neutralized
//   6. WHO THIS IS NOT FOR — Hormozi disqualification (raises desire)
//   7. THE CHOICE — single CTA, no nav, no escape hatch
//
// Mobile-first, dark canvas (matches v107/v108 spatial vocabulary).
// Helmet sets robots:noindex,nofollow so this page is paid-traffic-only —
// it doesn't compete in organic SEO with /hire or /vs.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { injectJsonLdMany, organizationLd, faqPageLd, serviceLd } from "@/lib/jsonld";

const CAL_URL = "https://cal.com/trainyouragent/30min";

const PAIN_BULLETS = [
  "You miss 1 in 4 inbound calls.",
  "Each missed call is worth $400–$2,400.",
  "Your competitors picked up the one you dropped.",
  "Your phone is the bottleneck. Not your marketing.",
];

const STACK = [
  { label: "Custom voice agent, built end-to-end", value: 8500 },
  { label: "Wired into your phone number + CRM + calendar", value: 3500 },
  { label: "Multi-provider LLM fallback (Anthropic → Groq → OpenAI)", value: 2200 },
  { label: "21-day production cutover. Founder direct line.", value: 4800 },
  { label: "Monthly operations + monitoring + model refresh", value: 2400 },
];

const RISK_REVERSAL = [
  { h: "30-day money-back", b: "Don't like it after a month? Full refund. We eat the build cost." },
  { h: "90-day pay-for-itself", b: "If the agent hasn't paid for itself in 90 days, we refund the build fee." },
  { h: "No annual contract", b: "Month-to-month. Cancel anytime. You keep the agent." },
  { h: "Founder picks up at 2am", b: "Direct line to me. Not a Slack channel. Not a CSM. The operator who built it." },
];

const FAQS = [
  { q: "How fast can I be live?", a: "21 days from intake to your real phone line." },
  { q: "What does it cost?", a: "$4,950 one-time build + $1,997/month (5,000 included minutes)." },
  { q: "Will customers know it's AI?", a: "Most won't. The voice is conversational and the prompt is bespoke for your business. We disclose 'AI assistant' on open in regulated industries." },
  { q: "Do I own it if I cancel?", a: "Yes. Prompts, integrations, scripts — all documented to you. No platform lock-in." },
];

export default function Apply() {
  // v110: live "seconds since you landed" counter. Used to compute pain math.
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    injectJsonLdMany([
      { id: "apply-org", data: organizationLd() },
      { id: "apply-faq", data: faqPageLd(FAQS.map((f) => ({ question: f.q, answer: f.a }))) },
      // v161-verify: Service schema — Google rich result for "AI voice agent setup"
      {
        id: "apply-service",
        data: serviceLd({
          name: "AI Voice Agent — Production Build + Operations",
          description: "Custom AI voice agent built end-to-end. Wired into your phone number, CRM, and calendar. Multi-provider LLM fallback. 21-day production cutover. $4,950 build + $1,997/month operations. 30-day money-back, 90-day pay-for-itself guarantee.",
          url: "https://trainyouragent.com/apply",
          serviceType: "AI Voice Agent Setup, Training, and Operations",
          areaServedName: "United States",
        }),
      },
    ]);
    return () => clearInterval(t);
  }, []);

  // U.S. SMB average inbound calls = ~22/day = ~1 every 65 min. At 25% miss
  // rate × $1,200 average call value, every minute you don't have an agent
  // running burns ~$4.62. The counter below shows live "$ lost since you
  // landed on this page" using that math.
  const dollarsLost = ((secs / 60) * 4.62).toFixed(2);

  const stackTotal = STACK.reduce((n, s) => n + s.value, 0);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(1200px 800px at 50% 0%, rgba(4,44,83,0.95) 0%, rgba(2,12,24,1) 65%)",
        fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif",
      }}
    >
      <Helmet>
        <title>Apply — TrainYourAgent · Production voice agent in 21 days</title>
        <meta
          name="description"
          content="Cold paid traffic landing page. Apply to have a custom AI voice agent built, wired into your phone line, and operated end-to-end in 21 days. $4,950 + $1,997/month. 30-day money-back."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://trainyouragent.com/apply" />
      </Helmet>

      {/* No SiteNav by design — kill every escape from this page. */}
      <div className="px-5 sm:px-8">
        <div className="max-w-[680px] mx-auto pt-10 pb-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-[14px] font-semibold tracking-tight text-white/80 hover:text-white">
              TrainYourAgent
            </Link>
            <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#9CC4EC]">
              APPLY · 3 SPOTS / MONTH
            </div>
          </div>
        </div>
      </div>

      {/* ATF HERO */}
      <header className="px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-[820px] mx-auto text-center">
          <div className="inline-block px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-[11px] uppercase tracking-[0.2em] font-mono text-[#9CC4EC] mb-7">
            FOR OPERATORS WHO MISS CALLS
          </div>
          <h1
            className="text-[clamp(40px,8vw,92px)] leading-[0.98] tracking-[-0.025em] font-semibold mb-7"
            style={{ textWrap: "balance" as React.CSSProperties["textWrap"] }}
          >
            Your phone gets answered{" "}
            <em
              className="italic font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: "#85B7EB" }}
            >
              in 21 days.
            </em>{" "}
            Every single call.
          </h1>
          <p className="text-[clamp(17px,2.4vw,22px)] leading-[1.5] text-white/75 max-w-[640px] mx-auto mb-10">
            We build a custom AI voice agent, wire it into your real phone
            number, and operate it for you. <strong className="text-white">No platform. No SDR. No 6-month onboarding.</strong>{" "}
            $4,950 build + $1,997/month. 30-day money-back.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="w-full sm:w-auto px-9 py-5 rounded-2xl bg-white text-[#042C53] font-semibold text-[17px] hover:bg-[#E6F1FB] shadow-[0_40px_80px_-30px_rgba(133,183,235,0.85)] transition-all hover:-translate-y-0.5"
            >
              Book your 15-min discovery call →
            </a>
          </div>
          <p className="text-[12px] text-white/55">
            Direct line to the founder. No SDR. No pitch. If you're not a fit, I tell you on the call.
          </p>
        </div>
      </header>

      {/* LIVE PAIN COUNTER */}
      <section className="px-5 sm:px-8 py-14 sm:py-20 border-y border-white/8" style={{ background: "rgba(197,48,48,0.05)" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="inline-block text-[10.5px] uppercase tracking-[0.22em] font-mono text-[#FFB4B4] mb-4">
            LIVE · WHILE YOU READ THIS
          </div>
          <div className="text-[clamp(48px,9vw,96px)] font-semibold leading-none tracking-[-0.025em] text-[#FFB4B4]" style={{ fontVariantNumeric: "tabular-nums" }}>
            ${dollarsLost}
          </div>
          <p className="mt-5 text-[15px] sm:text-[17px] text-white/72 leading-relaxed max-w-[560px] mx-auto">
            Average U.S. SMB loses ~$4.62 per minute to missed inbound calls
            (~22 calls/day × 25% miss rate × $1,200 average call value).{" "}
            <strong className="text-white">That counter is real-time since you opened this page.</strong>
          </p>
        </div>
      </section>

      {/* PAIN STACK */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#9CC4EC] mb-4">
            WHY YOU'RE HERE
          </div>
          <h2 className="text-[clamp(28px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-8 max-w-[640px]">
            You don't have a marketing problem.{" "}
            <em className="italic font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#85B7EB" }}>
              You have a pickup problem.
            </em>
          </h2>
          <ul className="space-y-4">
            {PAIN_BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[17px] leading-[1.5]">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C53030] mt-2.5" />
                <span className="text-white/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE STACK — value equation */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 border-y border-white/8">
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#85EBC8] mb-4">
            THE STACK · WHAT YOU GET
          </div>
          <h2 className="text-[clamp(28px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-10">
            ${stackTotal.toLocaleString()} of value.{" "}
            <em className="italic font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#85EBC8" }}>
              For $4,950.
            </em>
          </h2>
          <div className="space-y-3">
            {STACK.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between gap-6 p-5 rounded-2xl"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-[14px] sm:text-[15.5px] text-white/85 leading-snug flex-1">{s.label}</div>
                <div className="text-[15px] sm:text-[17px] font-semibold text-white font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>
                  ${s.value.toLocaleString()}
                </div>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-6 p-5 rounded-2xl mt-6" style={{ background: "rgba(62,207,142,0.10)", border: "1px solid rgba(62,207,142,0.25)" }}>
              <div className="text-[15px] sm:text-[17px] font-semibold text-white">Bundled value</div>
              <div className="text-[18px] sm:text-[22px] font-semibold text-white/40 font-mono line-through" style={{ fontVariantNumeric: "tabular-nums" }}>
                ${stackTotal.toLocaleString()}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-6 p-6 rounded-2xl" style={{ background: "linear-gradient(160deg, rgba(133,235,200,0.18), rgba(62,207,142,0.05))", border: "1px solid rgba(133,235,200,0.35)" }}>
              <div className="text-[17px] sm:text-[19px] font-semibold text-white">Your one-time build</div>
              <div className="text-[28px] sm:text-[36px] font-semibold text-[#85EBC8] font-mono leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                $4,950
              </div>
            </div>
            <p className="text-[13.5px] text-white/55 mt-5 leading-relaxed">
              Then $1,997/month to operate. Includes 5,000 minutes. $0.40/min overage.
              No annual contract. Cancel anytime. You keep the agent.
            </p>
          </div>
        </div>
      </section>

      {/* PROOF — verifiable receipts only */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[920px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#9CC4EC] mb-4">
            THE RECEIPTS · ALL VERIFIABLE
          </div>
          <h2 className="text-[clamp(28px,5vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-10">
            We won't show you fake testimonials.{" "}
            <em className="italic font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#85B7EB" }}>
              Here's what's real.
            </em>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: "344+", l: "public commits", sub: "in 91 days" },
              { n: "569", l: "live URLs", sub: "shipped in production" },
              { n: "4 yrs", l: "applied AI", sub: "since GPT-3 alpha" },
              { n: "21 days", l: "intake → live", sub: "guaranteed" },
            ].map((s) => (
              <div
                key={s.l}
                className="p-5 sm:p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-[28px] sm:text-[36px] font-semibold text-white leading-none tracking-[-0.02em]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {s.n}
                </div>
                <div className="text-[13px] sm:text-[14px] text-white/80 font-medium mt-2">{s.l}</div>
                <div className="text-[11px] text-white/45 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
          <p className="mt-7 text-[13.5px] text-white/55">
            Verify any of these:{" "}
            <Link to="/proof" className="text-[#85B7EB] underline underline-offset-2">/proof</Link>{" · "}
            <a href="/sitemap.xml" className="text-[#85B7EB] underline underline-offset-2">/sitemap.xml</a>{" · "}
            <a href="https://github.com/builderofages/trainyouragent" target="_blank" rel="noopener" className="text-[#85B7EB] underline underline-offset-2">GitHub</a>
          </p>
        </div>
      </section>

      {/* RISK REVERSAL */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 border-y border-white/8" style={{ background: "rgba(133,235,200,0.04)" }}>
        <div className="max-w-[820px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#85EBC8] mb-4">
            RISK REVERSAL · 4 PROMISES
          </div>
          <h2 className="text-[clamp(28px,5vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-10">
            We carry the risk.{" "}
            <em className="italic font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#85EBC8" }}>
              Not you.
            </em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RISK_REVERSAL.map((r) => (
              <div
                key={r.h}
                className="p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(160deg, rgba(133,235,200,0.07), rgba(62,207,142,0.01))",
                  border: "1px solid rgba(133,235,200,0.18)",
                }}
              >
                <div className="text-[16px] font-semibold text-white tracking-tight">{r.h}</div>
                <p className="text-[14px] leading-[1.55] text-white/70 mt-2">{r.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S NOT FOR — Hormozi disqualification */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#FFB4B4] mb-4">
            DON'T APPLY IF
          </div>
          <h2 className="text-[clamp(28px,5vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-8">
            This isn't for everyone.{" "}
            <em className="italic font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#FFB4B4" }}>
              Save us both the time.
            </em>
          </h2>
          <ul className="space-y-4 text-[16px] leading-[1.55] text-white/78">
            <li className="flex items-start gap-3"><span className="text-[#FFB4B4] mt-0.5">✗</span> You receive fewer than 100 inbound calls/month. The math doesn't work below that.</li>
            <li className="flex items-start gap-3"><span className="text-[#FFB4B4] mt-0.5">✗</span> You want to "evaluate vendors" for six months. We're not on that timeline.</li>
            <li className="flex items-start gap-3"><span className="text-[#FFB4B4] mt-0.5">✗</span> You want a self-serve flow editor you can poke at. Buy Bland or Synthflow.</li>
            <li className="flex items-start gap-3"><span className="text-[#FFB4B4] mt-0.5">✗</span> You think AI is going to replace your salespeople and run the company. It isn't. It picks up the phone.</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 border-y border-white/8">
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#9CC4EC] mb-4">
            FAQ
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="p-5 sm:p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <summary className="cursor-pointer text-[15.5px] sm:text-[16.5px] font-semibold text-white tracking-tight list-none flex items-start gap-3">
                  <span className="text-[#85B7EB] mt-0.5">→</span>
                  <span>{f.q}</span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-white/70 pl-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* THE CHOICE */}
      <section className="px-5 sm:px-8 py-24 sm:py-32 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#9CC4EC] mb-5">
            ONE CHOICE
          </div>
          <h2 className="text-[clamp(32px,6vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-7">
            Keep losing calls.{" "}
            <em className="italic font-normal block mt-2" style={{ fontFamily: "'Playfair Display', serif", color: "#85B7EB" }}>
              Or book the call.
            </em>
          </h2>
          <p className="text-[16px] leading-[1.6] text-white/72 mb-9">
            15 minutes. Direct line to the founder. No pitch.<br />
            If you're not a fit, I'll tell you on the call.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-10 py-6 rounded-2xl bg-white text-[#042C53] font-semibold text-[18px] hover:bg-[#E6F1FB] shadow-[0_40px_80px_-30px_rgba(133,183,235,0.85)] transition-all hover:-translate-y-1"
          >
            Book your 15-min discovery call →
          </a>
          <p className="text-[12px] text-white/45 mt-7">
            3 spots available this month. 2 are spoken for.
          </p>
        </div>
      </section>

      {/* Minimal footer — no full site footer, this is a money page */}
      <footer className="px-5 sm:px-8 py-12 border-t border-white/8">
        <div className="max-w-[760px] mx-auto text-center text-[12px] text-white/45">
          © 2026 TrainYourAgent LLC · Tampa Bay, FL ·{" "}
          <Link to="/" className="text-white/70 hover:text-white underline underline-offset-2">trainyouragent.com</Link>
        </div>
      </footer>
    </div>
  );
}
