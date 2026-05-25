// src/pages/Apply.tsx — v173
//
// Founder rejected v110's dark-canvas treatment ("looks like AI garbage,
// not our sexy theme"). Rewritten to match the Index.tsx homepage system:
// cream/white surface, navy ink, Playfair Display italic accents.
//
// What survived from v110:
//   - Single-purpose money page for cold paid traffic (Meta/IG)
//   - 7-section structure: hero → pain counter → stack → proof → risk
//     reversal → disqualifier → FAQ → single CTA
//   - Live "$ lost since you landed" counter
//   - Hormozi stack-of-value pricing math
//   - Service / FAQ / Organization JSON-LD
//   - robots:noindex,nofollow (paid-traffic only, doesn't fight organic)
//   - No SiteNav — single CTA, no escape hatches
//
// What changed:
//   - Background: radial dark navy → cream-on-white with subtle tint band
//   - Body type: white-on-dark → navy ink on cream/white
//   - Accent color for italic Playfair: cyan-blue glow → brand navy + blue
//   - Pain counter: red-on-dark → deep red on warm cream (still high contrast)
//   - Risk reversal: green-on-dark → green ink on mint cream
//   - Cards: glass borders → cream cards with hairline navy borders
//
// Brand tokens (mirrors src/lib/brand.ts + Index.tsx):
//   navy        #042C53   primary brand
//   blue accent #185FA5   links / italic accent
//   ink         #0B1B2B   body text
//   cream       #FAF6EE   warm surface (matches /pricing right column)
//   bgSoft      #FAFBFC   subtle section bg
//   green       #22A36C   guarantee accent
//   red ink     #C53030   pain accent (used sparingly)

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

// Brand atoms — inline so this page renders correctly even if global CSS is stripped
const ITALIC: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: "italic",
  fontWeight: 500,
};
const EYEBROW = "text-[10.5px] uppercase font-semibold tracking-[0.22em]";
const EYEBROW_MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  color: "#185FA5",
  letterSpacing: "0.22em",
};

export default function Apply() {
  // Live "$ lost since you landed" counter — preserved from v110
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    injectJsonLdMany([
      { id: "apply-org", data: organizationLd() },
      { id: "apply-faq", data: faqPageLd(FAQS.map((f) => ({ question: f.q, answer: f.a }))) },
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
    // Load brand fonts if not already on page (this page may render without SiteNav loading them)
    if (typeof document !== "undefined" && !document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    return () => clearInterval(t);
  }, []);

  // ~$4.62 / minute pain math (22 calls/day × 25% miss rate × $1,200 avg call value)
  const dollarsLost = ((secs / 60) * 4.62).toFixed(2);
  const stackTotal = STACK.reduce((n, s) => n + s.value, 0);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "#FFFFFF",
        color: "#0B1B2B",
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

      {/* Minimal top rail — no full SiteNav by design (kill escape hatches) */}
      <div className="px-5 sm:px-8 border-b" style={{ borderColor: "rgba(4,44,83,0.06)" }}>
        <div className="max-w-[1080px] mx-auto py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-[#042C53]">
            {/* Diamond mark — inline SVG so brand always renders even if remote fonts blocked */}
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#042C53" strokeWidth="2.5" />
              <path d="M16 8 L24 16 L16 24 L8 16 Z" fill="#042C53" />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight">TrainYourAgent</span>
          </Link>
          <div className={EYEBROW} style={EYEBROW_MONO}>APPLY · 3 SPOTS / MONTH</div>
        </div>
      </div>

      {/* ATF HERO — cream warm gradient band, navy serif headline */}
      <header
        className="px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28"
        style={{
          background:
            "linear-gradient(180deg, #FFF8EE 0%, #FAF6EE 55%, #FFFFFF 100%)",
        }}
      >
        <div className="max-w-[920px] mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 ${EYEBROW}`}
            style={{
              background: "rgba(34,163,108,0.10)",
              color: "#15724D",
              letterSpacing: "0.22em",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22A36C" }} />
            LIVE · AGENTS IN PRODUCTION
          </div>
          <h1
            className="font-semibold mb-7"
            style={{
              fontSize: "clamp(42px, 8vw, 92px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "#042C53",
              textWrap: "balance" as React.CSSProperties["textWrap"],
            }}
          >
            Your phone will be answered in 21 days.{" "}
            <span style={{ ...ITALIC, color: "#042C53" }}>
              If it doesn&rsquo;t book one real appointment, you pay nothing.
            </span>
          </h1>
          <p
            className="max-w-[680px] mx-auto mb-10"
            style={{
              fontSize: "clamp(17px, 2.2vw, 21px)",
              lineHeight: 1.55,
              color: "#42526E",
            }}
          >
            We build a custom AI voice agent, wire it into your real phone
            number, and operate it for you.{" "}
            <strong style={{ color: "#042C53" }}>
              No platform. No SDR. No 6-month onboarding.
            </strong>{" "}
            $4,950 build + $1,997/month. 30-day money-back.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="w-full sm:w-auto px-9 py-5 rounded-2xl font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "#042C53",
                color: "#FFFFFF",
                fontSize: "16.5px",
                boxShadow: "0 28px 60px -25px rgba(4,44,83,0.45)",
              }}
            >
              Book your 15-min discovery call →
            </a>
          </div>
          <p className="text-[12.5px]" style={{ color: "#6B7B92" }}>
            Direct line to the founder. No SDR. No pitch. If you&rsquo;re not a fit, I tell you on the call.
          </p>
        </div>
      </header>

      {/* LIVE PAIN COUNTER — warm cream band, deep red number */}
      <section
        className="px-5 sm:px-8 py-16 sm:py-20"
        style={{
          background: "#FFF7F4",
          borderTop: "1px solid rgba(197,48,48,0.10)",
          borderBottom: "1px solid rgba(197,48,48,0.10)",
        }}
      >
        <div className="max-w-[760px] mx-auto text-center">
          <div
            className={`inline-block mb-4 ${EYEBROW}`}
            style={{
              color: "#9B2C2C",
              letterSpacing: "0.22em",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            LIVE · WHILE YOU READ THIS
          </div>
          <div
            className="font-semibold"
            style={{
              fontSize: "clamp(56px, 10vw, 104px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#C53030",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ${dollarsLost}
          </div>
          <p
            className="mt-6 max-w-[560px] mx-auto"
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#42526E",
            }}
          >
            Average U.S. SMB loses ~$4.62 per minute to missed inbound calls
            (~22 calls/day × 25% miss rate × $1,200 average call value).{" "}
            <strong style={{ color: "#0B1B2B" }}>
              That counter is real-time since you opened this page.
            </strong>
          </p>
        </div>
      </section>

      {/* PAIN STACK — white bg navy ink */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[760px] mx-auto">
          <div className={`mb-4 ${EYEBROW}`} style={EYEBROW_MONO}>
            WHY YOU&rsquo;RE HERE
          </div>
          <h2
            className="font-semibold mb-8 max-w-[640px]"
            style={{
              fontSize: "clamp(28px, 5vw, 46px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#042C53",
            }}
          >
            You don&rsquo;t have a marketing problem.{" "}
            <span style={{ ...ITALIC, color: "#042C53" }}>
              You have a pickup problem.
            </span>
          </h2>
          <ul className="space-y-4">
            {PAIN_BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3"
                style={{ fontSize: "17px", lineHeight: 1.55, color: "#0B1B2B" }}
              >
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5"
                  style={{ background: "#C53030" }}
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE STACK — value equation, cream cards on subtle bg */}
      <section
        className="px-5 sm:px-8 py-20 sm:py-28"
        style={{
          background: "#FAFBFC",
          borderTop: "1px solid rgba(4,44,83,0.06)",
          borderBottom: "1px solid rgba(4,44,83,0.06)",
        }}
      >
        <div className="max-w-[760px] mx-auto">
          <div
            className={`mb-4 ${EYEBROW}`}
            style={{
              color: "#15724D",
              letterSpacing: "0.22em",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            THE STACK · WHAT YOU GET
          </div>
          <h2
            className="font-semibold mb-10"
            style={{
              fontSize: "clamp(28px, 5vw, 46px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#042C53",
            }}
          >
            ${stackTotal.toLocaleString()} of value.{" "}
            <span style={{ ...ITALIC, color: "#22A36C" }}>For $4,950.</span>
          </h2>
          <div className="space-y-3">
            {STACK.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between gap-6 p-5 rounded-2xl"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(4,44,83,0.08)",
                }}
              >
                <div
                  className="flex-1"
                  style={{ fontSize: "15.5px", lineHeight: 1.45, color: "#0B1B2B" }}
                >
                  {s.label}
                </div>
                <div
                  className="font-semibold"
                  style={{
                    fontSize: "17px",
                    color: "#042C53",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ${s.value.toLocaleString()}
                </div>
              </div>
            ))}
            <div
              className="flex items-baseline justify-between gap-6 p-5 rounded-2xl mt-6"
              style={{
                background: "rgba(34,163,108,0.08)",
                border: "1px solid rgba(34,163,108,0.20)",
              }}
            >
              <div className="font-semibold" style={{ fontSize: "16px", color: "#042C53" }}>
                Bundled value
              </div>
              <div
                className="font-semibold line-through"
                style={{
                  fontSize: "20px",
                  color: "rgba(11,27,43,0.40)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ${stackTotal.toLocaleString()}
              </div>
            </div>
            <div
              className="flex items-baseline justify-between gap-6 p-6 rounded-2xl"
              style={{
                background: "linear-gradient(160deg, rgba(34,163,108,0.14), rgba(34,163,108,0.02))",
                border: "1px solid rgba(34,163,108,0.32)",
              }}
            >
              <div className="font-semibold" style={{ fontSize: "18px", color: "#042C53" }}>
                Your one-time build
              </div>
              <div
                className="font-semibold leading-none"
                style={{
                  fontSize: "34px",
                  color: "#15724D",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                $4,950
              </div>
            </div>
            <p
              className="mt-5"
              style={{ fontSize: "13.5px", lineHeight: 1.6, color: "#6B7B92" }}
            >
              Then $1,997/month to operate. Includes 5,000 minutes. $0.40/min overage.
              No annual contract. Cancel anytime. You keep the agent.
            </p>
          </div>
        </div>
      </section>

      {/* PROOF — verifiable receipts only */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[920px] mx-auto">
          <div className={`mb-4 ${EYEBROW}`} style={EYEBROW_MONO}>
            THE RECEIPTS · ALL VERIFIABLE
          </div>
          <h2
            className="font-semibold mb-10"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#042C53",
            }}
          >
            We won&rsquo;t show you fake testimonials.{" "}
            <span style={{ ...ITALIC, color: "#185FA5" }}>Here&rsquo;s what&rsquo;s real.</span>
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
                  background: "#FFFFFF",
                  border: "1px solid rgba(4,44,83,0.08)",
                }}
              >
                <div
                  className="font-semibold leading-none"
                  style={{
                    fontSize: "clamp(28px, 4vw, 36px)",
                    letterSpacing: "-0.02em",
                    color: "#042C53",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="font-medium mt-2"
                  style={{ fontSize: "14px", color: "#0B1B2B" }}
                >
                  {s.l}
                </div>
                <div className="mt-1" style={{ fontSize: "11.5px", color: "#94A3B8" }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7" style={{ fontSize: "13.5px", color: "#6B7B92" }}>
            Verify any of these:{" "}
            <Link to="/proof" style={{ color: "#185FA5", textDecoration: "underline", textUnderlineOffset: 2 }}>
              /proof
            </Link>{" · "}
            <a href="/sitemap.xml" style={{ color: "#185FA5", textDecoration: "underline", textUnderlineOffset: 2 }}>
              /sitemap.xml
            </a>{" · "}
            <a
              href="https://github.com/builderofages/trainyouragent"
              target="_blank"
              rel="noopener"
              style={{ color: "#185FA5", textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              GitHub
            </a>
          </p>
        </div>
      </section>

      {/* RISK REVERSAL — mint cream band */}
      <section
        className="px-5 sm:px-8 py-20 sm:py-28"
        style={{
          background: "#F0FBF6",
          borderTop: "1px solid rgba(34,163,108,0.15)",
          borderBottom: "1px solid rgba(34,163,108,0.15)",
        }}
      >
        <div className="max-w-[820px] mx-auto">
          <div
            className={`mb-4 ${EYEBROW}`}
            style={{
              color: "#15724D",
              letterSpacing: "0.22em",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            RISK REVERSAL · 4 PROMISES
          </div>
          <h2
            className="font-semibold mb-10"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#042C53",
            }}
          >
            We carry the risk.{" "}
            <span style={{ ...ITALIC, color: "#22A36C" }}>Not you.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RISK_REVERSAL.map((r) => (
              <div
                key={r.h}
                className="p-6 rounded-2xl"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(34,163,108,0.20)",
                }}
              >
                <div
                  className="font-semibold tracking-tight"
                  style={{ fontSize: "16px", color: "#042C53" }}
                >
                  {r.h}
                </div>
                <p
                  className="mt-2"
                  style={{ fontSize: "14px", lineHeight: 1.55, color: "#42526E" }}
                >
                  {r.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S NOT FOR — Hormozi disqualification */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[760px] mx-auto">
          <div
            className={`mb-4 ${EYEBROW}`}
            style={{
              color: "#9B2C2C",
              letterSpacing: "0.22em",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            DON&rsquo;T APPLY IF
          </div>
          <h2
            className="font-semibold mb-8"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#042C53",
            }}
          >
            This isn&rsquo;t for everyone.{" "}
            <span style={{ ...ITALIC, color: "#C53030" }}>Save us both the time.</span>
          </h2>
          <ul className="space-y-4" style={{ fontSize: "16px", lineHeight: 1.55, color: "#0B1B2B" }}>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#C53030" }}>✗</span>
              You receive fewer than 100 inbound calls/month. The math doesn&rsquo;t work below that.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#C53030" }}>✗</span>
              You want to &ldquo;evaluate vendors&rdquo; for six months. We&rsquo;re not on that timeline.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#C53030" }}>✗</span>
              You want a self-serve flow editor you can poke at. Buy Bland or Synthflow.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: "#C53030" }}>✗</span>
              You think AI is going to replace your salespeople and run the company. It isn&rsquo;t. It picks up the phone.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-5 sm:px-8 py-20 sm:py-28"
        style={{
          background: "#FAFBFC",
          borderTop: "1px solid rgba(4,44,83,0.06)",
          borderBottom: "1px solid rgba(4,44,83,0.06)",
        }}
      >
        <div className="max-w-[760px] mx-auto">
          <div className={`mb-6 ${EYEBROW}`} style={EYEBROW_MONO}>FAQ</div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="p-5 sm:p-6 rounded-2xl"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(4,44,83,0.08)",
                }}
              >
                <summary
                  className="cursor-pointer font-semibold tracking-tight list-none flex items-start gap-3"
                  style={{ fontSize: "16.5px", color: "#042C53" }}
                >
                  <span className="mt-0.5" style={{ color: "#185FA5" }}>→</span>
                  <span>{f.q}</span>
                </summary>
                <p
                  className="mt-3 pl-6"
                  style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#42526E" }}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* THE CHOICE — single CTA, cream band, navy button */}
      <section
        className="px-5 sm:px-8 py-24 sm:py-32 text-center"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 60%, #FFF8EE 100%)",
        }}
      >
        <div className="max-w-[640px] mx-auto">
          <div className={`mb-5 ${EYEBROW}`} style={EYEBROW_MONO}>ONE CHOICE</div>
          <h2
            className="font-semibold mb-7"
            style={{
              fontSize: "clamp(34px, 6vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#042C53",
            }}
          >
            Keep losing calls.{" "}
            <span style={{ ...ITALIC, color: "#185FA5", display: "block", marginTop: 6 }}>
              Or book the call.
            </span>
          </h2>
          <p
            className="mb-9"
            style={{ fontSize: "16px", lineHeight: 1.6, color: "#42526E" }}
          >
            15 minutes. Direct line to the founder. No pitch.
            <br />
            If you&rsquo;re not a fit, I&rsquo;ll tell you on the call.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-10 py-6 rounded-2xl font-semibold transition-all hover:-translate-y-1"
            style={{
              background: "#042C53",
              color: "#FFFFFF",
              fontSize: "18px",
              boxShadow: "0 32px 70px -28px rgba(4,44,83,0.55)",
            }}
          >
            Book your 15-min discovery call →
          </a>
          <p className="mt-7" style={{ fontSize: "12px", color: "#94A3B8" }}>
            3 spots available this month. 2 are spoken for.
          </p>
        </div>
      </section>

      {/* Minimal footer — money page, no full site footer */}
      <footer
        className="px-5 sm:px-8 py-12"
        style={{ borderTop: "1px solid rgba(4,44,83,0.06)" }}
      >
        <div
          className="max-w-[760px] mx-auto text-center"
          style={{ fontSize: "12px", color: "#94A3B8" }}
        >
          © 2026 TrainYourAgent LLC · Tampa Bay, FL ·{" "}
          <Link
            to="/"
            style={{
              color: "#185FA5",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            trainyouragent.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
