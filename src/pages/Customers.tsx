// src/pages/Customers.tsx — route /customers
// v89: complete rewrite. Old version showed [TBD] placeholders in a 6x3
// logo grid and 4 case-study cards — brand-damaging signal that the
// company has no customers. New version flips the narrative: rather than
// fake a logo wall, pitch the Founding Customer Program. Scarcity-backed
// offer with permanent founding pricing for the first 10, founder Slack
// access, co-authored case study at launch, and 90-day money back.
//
// Honest, on-brand, converts. The page becomes a sales asset instead of
// a credibility-killer.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
// v134: 14-industry ROI showcase grid + Trustpilot scaffold replace the
// old empty-state placeholders without faking customers.
import IndustryShowcase from "@/components/IndustryShowcase";
import TrustpilotWidget from "@/components/TrustpilotWidget";
// v238: real customer reviews carousel pulling approved testimonials from
// public.reviews via /api/reviews-public. Graceful empty state.
import CustomerReviewsCarousel from "@/components/CustomerReviewsCarousel";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai/";

const FOUNDING_PERKS = [
  {
    n: "01",
    title: "Founding pricing — forever",
    body: "Lock in Operators tier at $997/mo (50% off the public $1,997/mo) and Founders lane at $0.29/min (down from $0.39/min) for the lifetime of your account. You never re-negotiate when we raise prices for everyone else.",
  },
  {
    n: "02",
    title: "Direct founder Slack — no SDR layer",
    body: "Private Slack channel with Alexander. Every script change, every voice tune, every escalation review — direct response, usually within the hour during business hours.",
  },
  {
    n: "03",
    title: "Co-authored case study at the 90-day mark",
    body: "We write the story together — the metrics, the friction, what broke, what worked. You get the asset to use for your own marketing. We use it (with your approval) on the public site as the named case study.",
  },
  {
    n: "04",
    title: "90-day money-back guarantee",
    body: "If your agent hasn't paid for itself in 90 days — measured against the missed-call baseline we agreed on in the kickoff — we refund every dollar. Founder lane: zero recouped, you keep the artifacts.",
  },
  {
    n: "05",
    title: "Weekly co-build session",
    body: "30-minute screen-share every week for the first 90 days. We tune scripts together in real time, look at transcripts, decide what to escalate, what to automate. You walk away with an agent that genuinely sounds like your team.",
  },
  {
    n: "06",
    title: "First crack at every new playbook",
    body: "We're shipping a new cornerstone agent every 2-3 weeks (voice receptionist, lead qualifier, ops copilot, compliance RAG, more). Founding customers get every new one wired into their stack at no extra build fee.",
  },
];

const IDEAL_FIT = [
  "You already pay a human (front desk, receptionist, admin) $2-8K/mo to answer phones or qualify leads.",
  "You're losing 30%+ of inbound calls outside business hours, on weekends, or during peak service windows.",
  "Your team is at capacity — adding another headcount feels wrong but the calls keep growing.",
  "You can identify the top 50-100 questions your customers ask. (You don't have to write them down — we will, on the kickoff.)",
  "You have a real calendar, real CRM, and real services. (We integrate with HubSpot, ServiceTitan, GoHighLevel, Stripe, Cal.com, Twilio natively.)",
  "You're willing to be quoted (anonymously is fine, named is preferred) once the agent is performing.",
];

const NOT_A_FIT = [
  "You're shopping for the cheapest possible AI receptionist. Vapi or Bland direct will be cheaper.",
  "You want a chatbot for a B2B SaaS funnel. We build for service businesses — phone + chat for inbound buyers, not lead nurture sequences.",
  "You need it live tomorrow. Our minimum is 7 business days (Founders) or 14 (Operators) end-to-end.",
  "You won't share even anonymized call data with us. We need to listen to 3-5 real recordings to train the agent.",
];

export default function Customers() {
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <Helmet>
        <title>Founding Customer Program — TrainYourAgent</title>
        <meta name="description" content="First 10 founding customers get 50% off Operators tier ($997/mo) for life, direct founder Slack, co-authored case study, and 90-day money-back guarantee. Service businesses only. Apply now." />
        <link rel="canonical" href="https://www.trainyouragent.com/customers" />
        <meta property="og:title" content="Founding Customer Program — TrainYourAgent" />
        <meta property="og:description" content="10 spots. 50% off forever. Direct founder Slack. 90-day money-back. Be one of the first." />
        <meta property="og:url" content="https://www.trainyouragent.com/customers" />
      </Helmet>

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="pt-32 pb-14 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/60 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#042C53] text-white text-[11px] font-semibold tracking-[0.16em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" />
            Founding Cohort · 10 spots · ~3 open
          </div>
          <h1 className="text-[34px] sm:text-[54px] md:text-[66px] leading-[1.05] tracking-tight font-semibold text-[#042C53] h1-balance break-words">
            Be one of our first ten{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>and pay half-price forever.</span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            We're picking 10 service-business operators to be the founding cohort. You get the same agent we'd ship to anyone, plus permanent founding pricing, direct founder Slack, weekly co-build sessions, and a 90-day money-back guarantee against a measurable baseline. We get a real-world reference. Both sides win.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#9CC4EC] font-semibold mb-1">Apply · 30-min discovery</span>
                <span>Book a founding-cohort interview →</span>
              </span>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-7 py-4 rounded-2xl border-2 border-[#042C53]/15 text-[#042C53] font-semibold text-[15px] hover:border-[#042C53]">
              Or DM the founder on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* v134: 14-vertical ROI showcase grid — replaces missing-logo wall.
          Honest social proof via specific industry math, no fake logos. */}
      {/* v238: real reviews from /api/reviews-public — empty-state CTA when unmigrated */}
      <CustomerReviewsCarousel />

      <IndustryShowcase />

      {/* THE OFFER */}
      <section className="px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">What founding customers get</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] leading-tight mb-9">
            Six things you don't get at the public price.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FOUNDING_PERKS.map((p) => (
              <article key={p.n} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#042C53]/30 hover:shadow-sm transition">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-mono font-semibold mb-2">{p.n}</div>
                <h3 className="text-[18px] font-semibold text-[#042C53] mb-2 leading-tight">{p.title}</h3>
                <p className="text-[14px] text-slate-700 leading-relaxed">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO FITS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">If this is you, apply</div>
            <h2 className="text-[24px] sm:text-[32px] font-semibold text-[#042C53] mb-6 leading-tight">Ideal founding-cohort fit</h2>
            <ul className="space-y-3">
              {IDEAL_FIT.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-slate-700 leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#22A36C]/15 text-[#22A36C] inline-flex items-center justify-center text-[11px] font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-3">Don't apply if this is you</div>
            <h2 className="text-[24px] sm:text-[32px] font-semibold text-slate-700 mb-6 leading-tight">Honest disqualifiers</h2>
            <ul className="space-y-3">
              {NOT_A_FIT.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-slate-600 leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-slate-200 text-slate-500 inline-flex items-center justify-center text-[11px] font-bold">×</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">The guarantee</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-5 leading-tight">
            If it doesn't pay for itself in 90 days,{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>we refund every dollar.</span>
          </h2>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-3">
            On the kickoff call we measure your missed-call baseline together — how many calls a week you drop, what they're worth on average, what you'd recover even at a 30% capture rate. That's the number you have to beat in 90 days.
          </p>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            If we don't beat it, you get the build fee back, you keep every script + transcript + prompt + recording we made for you, your number ports out within 5 business days, no clawback fight. Founder lane (the $0 upfront one): you've risked literally nothing.
          </p>
        </div>
      </section>

      {/* v134: Trustpilot scaffold — hidden until first review lands. Set
          VITE_TRUSTPILOT_VISIBLE=1 + VITE_TRUSTPILOT_BUSINESSUNIT_ID in
          Vercel env once a review exists, and the real widget renders. */}
      <section className="px-5 sm:px-8 py-12 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3 text-center">
            Reviews
          </div>
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-[#042C53] mb-5 leading-tight text-center">
            Public, verified, Trustpilot.
          </h2>
          <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6 text-center">
            We're a young company. Our Trustpilot profile is open and we ask every
            founding-cohort customer to leave a review at the 90-day mark — only
            after the agent has paid for itself against the kickoff baseline.
            No incentivized reviews, no fake reviews, no AI-written reviews.
            Just real operators when they have a real result to report.
          </p>
          <div className="max-w-md mx-auto">
            <TrustpilotWidget variant="card" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#042C53] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold mb-5">
            ~3 spots left.
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#DCEBFA] mb-3">
            30-minute discovery call. We map your inbound, your CRM, your stack. You leave with a written scope and a price — not a sales pitch.
          </p>
          <p className="text-[14px] text-[#A8C7E8] mb-8">If we're not a fit, we tell you on the call. Most of these end with a 'no' from one side or the other. That's the point.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#042C53] font-semibold hover:bg-[#DCEBFA]">
              Book a founding-cohort interview
              <span aria-hidden>→</span>
            </a>
            <a href="/pricing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-white/30 text-white hover:bg-white/10">
              See the public pricing first
            </a>
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
