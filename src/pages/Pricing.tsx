import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RoiCalculator from "@/components/RoiCalculator";
import SmartPriceReveal from "@/components/SmartPriceReveal";
import NewsletterCapture from "@/components/NewsletterCapture";
import CalEmbed from "@/components/CalEmbed";
import ToastHost, { toast } from "@/components/Toast";
import SiteNav from "@/components/SiteNav";
import DashboardIllo from "@/components/illustrations/DashboardIllo";
import { ogUrl } from "@/lib/og";

// v48: vertical → recommended plan map for smart pricing.
// Used when /pricing?for=<slug> is present.
const FOR_MAP: Record<string, { plan: "founders" | "operators" | "scale"; label: string; reason: string }> = {
  hvac:          { plan: "operators", label: "HVAC operators",          reason: "weekend storm spikes + emergency call volume" },
  roofing:       { plan: "operators", label: "Roofing companies",       reason: "storm-season inbound bursts that bury a human receptionist" },
  legal:         { plan: "operators", label: "Law firms",               reason: "after-hours intake + qualified consultations" },
  "law-firm":    { plan: "operators", label: "Law firms",               reason: "after-hours intake + qualified consultations" },
  healthcare:    { plan: "operators", label: "Healthcare practices",    reason: "appointment scheduling + no-show reduction" },
  ecom:          { plan: "founders",  label: "Early-stage ecom",        reason: "pay-as-you-go fits low ticket + high inquiry volume" },
  ecommerce:     { plan: "founders",  label: "Early-stage ecom",        reason: "pay-as-you-go fits low ticket + high inquiry volume" },
  saas:          { plan: "founders",  label: "Pre-revenue SaaS",        reason: "build now, pay when calls come in" },
  startup:       { plan: "founders",  label: "Startup teams",           reason: "deferred build fee + founder Slack channel" },
  accounting:    { plan: "operators", label: "Accounting firms",        reason: "tax-season overflow + client onboarding" },
  agency:        { plan: "scale",     label: "Agencies",                reason: "multi-brand or multi-location call volume" },
  enterprise:    { plan: "scale",     label: "Enterprise ops",          reason: "SLA, dedicated engineer, custom integrations" },
  multilocation: { plan: "scale",     label: "Multi-location operators", reason: "shared brand voice across sites + analytics roll-up" },
  hotels:        { plan: "operators", label: "Independent hotels",      reason: "24/7 reservations + concierge overflow" },
  restaurants:   { plan: "operators", label: "Restaurants",             reason: "reservation + takeout call volume during service" },
  gym:           { plan: "operators", label: "Gyms & studios",          reason: "trial-class booking + membership inquiries" },
};

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "Book a 15-min Zoom";
const HERO_PHONE_TEL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
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

const PLANS = [
  {
    id: "founders",
    label: "Founders",
    forWho: "Pre-revenue or early-revenue startups. Build now, pay as you grow.",
    upfront: "$0",
    upfrontNote: "build fee deferred",
    monthly: "$0.18",
    monthlyUnit: "per minute answered",
    booking: "$25",
    bookingNote: "per booked appointment (optional add-on)",
    cta: "Apply for the founder lane",
    accent: false,
    perks: [
      "One agent, fully built and trained on your docs",
      "Live in 7 business days",
      "Founder Slack channel direct to Alexander",
      "Weekly tune-up for the first 90 days",
      "Pay only when calls come in",
    ],
  },
  {
    id: "operators",
    label: "Operators",
    forWho: "SMBs already paying humans to answer phones, qualify leads, or run support.",
    upfront: "$4,950",
    upfrontNote: "one-time build + integration",
    monthly: "$799",
    monthlyUnit: "per month, includes 4,000 minutes",
    booking: "$15",
    bookingNote: "per booked appointment after the included pool",
    cta: "Start the build",
    accent: true,
    perks: [
      "Multi-channel: voice + SMS + email + chat",
      "Live in 10–14 business days",
      "Native integration with your CRM, calendar, dispatch tool",
      "Weekly performance review with a real engineer",
      "Cancel any time — no contracts",
    ],
  },
  {
    id: "scale",
    label: "Scale",
    forWho: "Multi-location, multi-brand, or agency-scale operations.",
    upfront: "Custom",
    upfrontNote: "scoped from a 30-min call",
    monthly: "Custom",
    monthlyUnit: "volume-tiered",
    booking: "Custom",
    bookingNote: "tied to your conversion model",
    cta: "Get a custom quote",
    accent: false,
    perks: [
      "Unlimited agents across brands or locations",
      "Dedicated engineer + monthly architecture review",
      "Custom integrations, custom training data",
      "SLA-backed uptime, priority incident response",
      "BAA, DPA, SOC 2 evidence pack included",
    ],
  },
];

const FAQ = [
  { q: "Will I get my money back if it doesn't work?", a: "Yes. 30-day money-back guarantee on the build fee: if your first agent doesn't ship to the spec we agreed on the kickoff call, we refund the full build fee, you keep the artifacts, and there's no clawback fight. After the build is accepted, monthly usage fees are pay-as-you-go and cancel any time. Per-minute and per-booking charges are non-refundable once incurred." },
  { q: "How fast will it actually be live?", a: "Founders lane: live in 7 business days. Operators lane: 10–14 business days end-to-end. If we slip past day 14 on Operators without an integration we flagged on the kickoff, the build fee is refunded — no quibbling." },
  { q: "What if I don't like the voice or the script?", a: "We send 3 voice samples and the full opener/qualification script for your sign-off BEFORE cutover. Nothing goes live until you approve in writing. You can re-pick the voice and re-tune scripts in-flight without a fee, weekly, forever." },
  { q: "Do you build for my industry?", a: "Today we ship for HVAC, roofing, legal, healthcare, real estate, accounting, automotive, solar, gym, spas, hotels, restaurants, logistics, and bars/nightclubs. If your industry isn't on the list, ask on the call — we've built outside our 14 standard verticals 6 times this year." },
  { q: "Do I own the agent? Or does TYA?", a: "You own the prompts, scripts, recordings, and the phone number. We host and operate the runtime. If you ever leave, we send you everything in a zip + a transcript export, and we pay for the porting of your number." },
  { q: "Who hosts and maintains it?", a: "We host on US-region infrastructure (Vercel, Supabase, Twilio, ElevenLabs/Vapi). We maintain the model versions, prompt drift fixes, telephony failover, and the dashboard. You don't manage uptime — that's our job." },
  { q: "Can you match my brand voice?", a: "Yes — that's most of the discovery call. You send us 3-10 recordings (sales calls, support calls, or just a voice memo) and we tune prosody, pacing, fillers, and vocabulary to match. Beats the 'generic AI bot' tell." },
  { q: "Will it work with my CRM?", a: "Native integrations with HubSpot, ServiceTitan, GoHighLevel, Stripe, Cal.com, Twilio. Custom integrations via webhook or Zapier for the long tail. We do the wiring in the build phase — you don't write code." },
  { q: "What happens if I cancel?", a: "Cancel any time from the dashboard or by email. You're billed for the month in progress (no proration, no early-termination fee). Number ports out within 5 business days. Data export available for 90 days post-cancel." },
  { q: "Why no fake five-tier feature checklist?", a: "Because AI voice agents aren't a SaaS product where every tier unlocks one more dropdown. The work is: build it once, tune it weekly, charge for what runs through it. That's three honest lanes — Founders, Operators, Scale — not eleven boxes." },
  { q: "What does the build fee actually cover?", a: "Discovery (we listen to your existing calls), agent training on YOUR docs/scripts/pricing/tone, voice tuning, telephony provisioning, integrations to your CRM and calendar, stress testing, cutover, and the first 30 days of tuning. Not 'a chatbot deployment.'" },
  { q: "Free trial?", a: "Yes. Seven business days of live calls handled by your agent before the first invoice. If it doesn't perform, you walk and we keep nothing." },
  { q: "Do you take equity?", a: "Sometimes, for the right startup. Defer cash, take a small piece, build the agent, ride the growth. Mention it on the call." },
];

// v46a: what's actually in the box on day one — kills "what do I get?" friction.
const DELIVERABLES = [
  { n: "01", h: "Kickoff call with the founder", b: "30-min Zoom with Alexander. We listen to 3 of your existing calls, write the scope back to you in writing the same day. No SDR layer." },
  { n: "02", h: "Scoped SOW (one page, plain English)", b: "Exactly what we'll build, what integrations get wired, what success looks like at day 14 and day 30. Signed before any code is written." },
  { n: "03", h: "Working agent in 14 days or less", b: "Voice + chat agent answering on a test number, trained on your docs, integrated with your CRM and calendar. You stress-test it before any real traffic." },
  { n: "04", h: "Voice + handoff training (your team)", b: "60-min screen-share to teach your front-desk / dispatch / sales team when the agent escalates, how transcripts land, and where to tune scripts themselves." },
  { n: "05", h: "30-day post-launch tuning included", b: "Weekly script + prompt updates for 30 days at zero extra cost. We watch every call. After that it's $299/mo for ongoing tuning, optional." },
];

const Pricing = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const forKey = (searchParams.get("for") || "").toLowerCase();
  const recommendation = useMemo(() => FOR_MAP[forKey] || null, [forKey]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    const title = recommendation
      ? `Pricing for ${recommendation.label} — TrainYourAgent`
      : "Pricing — TrainYourAgent";
    document.title = title;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    const setMetaProp = (n: string, c: string) => {
      let el = document.querySelector(`meta[property='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    const desc = "Three honest lanes: Founders, Operators, Scale. Pay for what runs through your agent, not for tier-feature theater. Free 7-day live trial.";
    setMeta("description", desc);

    const ogImage = ogUrl({
      title: recommendation ? `Pricing for ${recommendation.label}` : "Pricing that scales with you",
      subtitle: "Founders · Operators · Scale — three honest lanes",
      type: "page",
    });
    setMetaProp("og:title", title);
    setMetaProp("og:description", desc);
    setMetaProp("og:image", ogImage);
    setMetaProp("og:image:width", "1200");
    setMetaProp("og:image:height", "630");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:image", ogImage);

    // v33a: Product/Offer schema for the three pricing lanes.
    const id = "tya-schema-pricing";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "TrainYourAgent — AI Voice Agents",
      description: "AI voice + messaging agents for SMBs and startups. Three lanes: Founders (pay-as-you-go), Operators ($799/mo + 4,000 minutes), Scale (custom).",
      brand: { "@type": "Brand", name: "TrainYourAgent" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "9999",
        offerCount: 3,
        offers: [
          {
            "@type": "Offer",
            name: "Founders",
            description: "Pre-revenue or early-revenue startups. Pay only when calls come in.",
            price: "0",
            priceCurrency: "USD",
            url: "https://trainyouragent.com/pricing#founders",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Operators",
            description: "SMBs already paying humans to answer phones. Includes 4,000 minutes / mo.",
            price: "799",
            priceCurrency: "USD",
            url: "https://trainyouragent.com/pricing#operators",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Scale",
            description: "Multi-location, multi-brand, agency-scale operations. Custom pricing.",
            priceCurrency: "USD",
            url: "https://trainyouragent.com/pricing#scale",
            availability: "https://schema.org/InStock",
          },
        ],
      },
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, [recommendation]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* NAV — canonical service nav */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="pricing" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Pricing</div>
          {recommendation ? (
            <>
              <h1 className="text-[40px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
                Pricing for{" "}
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                  {recommendation.label.toLowerCase()}.
                </span>
              </h1>
              <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl mx-auto leading-relaxed">
                Same three honest lanes. We just point you at the one most teams in your shape land on.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[44px] sm:text-[72px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
                Three lanes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Zero theater.</span>
              </h1>
              <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl mx-auto leading-relaxed">
                We charge for what your agent actually does — calls answered, appointments booked, problems solved. Not tier-feature checkboxes you'll never use.
              </p>
            </>
          )}
          {recommendation && (
            <div
              className="mt-7 mx-auto max-w-3xl rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/20 px-5 py-4 text-left flex items-start gap-3"
              role="note"
            >
              <span
                aria-hidden="true"
                className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#185FA5] text-white text-[14px] font-bold mt-0.5"
              >
                ★
              </span>
              <div className="text-[14.5px] text-[#042C53] leading-relaxed">
                <span className="font-semibold">Recommended for {recommendation.label}:</span>{" "}
                <span className="font-semibold capitalize">{recommendation.plan}</span> — based on typical {recommendation.reason}.
              </div>
            </div>
          )}
          <div className="mt-10 max-w-2xl mx-auto opacity-90">
            <DashboardIllo style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          {PLANS.map((p) => {
            const isRecommended = recommendation && recommendation.plan === p.id;
            return (
            <div key={p.id} className={`relative rounded-3xl p-8 border transition-all duration-300 ${p.accent ? "bg-[#042C53] text-white border-[#042C53] shadow-2xl shadow-[#042C53]/15 lg:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(24,95,165,0.45)]" : "bg-white text-[#0B1B2B] border-slate-200 hover:border-[#185FA5] hover:shadow-[0_20px_50px_-15px_rgba(24,95,165,0.25)] hover:-translate-y-0.5"} ${isRecommended ? "ring-4 ring-[#22A36C]/40 ring-offset-2 ring-offset-white" : ""}`}>
              {p.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#22A36C] text-white text-[11px] font-semibold tracking-[0.12em] uppercase shadow-lg">Most Popular</div>
              )}
              {isRecommended && !p.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#22A36C] text-white text-[11px] font-semibold tracking-[0.12em] uppercase shadow-lg">Recommended for you</div>
              )}
              <div className={`text-[12px] uppercase tracking-[0.18em] font-semibold mb-2 ${p.accent ? "text-[#9CC4EC]" : "text-[#185FA5]"}`}>{p.label}</div>
              <div className={`text-[15px] leading-relaxed mb-6 ${p.accent ? "text-white/85" : "text-slate-700"}`}>{p.forWho}</div>

              <div className={`grid grid-cols-3 gap-3 mb-8 pb-6 border-b ${p.accent ? "border-white/15" : "border-slate-200"}`}>
                <div>
                  <div className={`text-[24px] font-semibold tracking-tight ${p.accent ? "text-white" : "text-[#042C53]"}`}>{p.upfront}</div>
                  <div className={`text-[11px] mt-1 ${p.accent ? "text-white/65" : "text-slate-600"}`}>{p.upfrontNote}</div>
                </div>
                <div>
                  <div className={`text-[24px] font-semibold tracking-tight ${p.accent ? "text-white" : "text-[#042C53]"}`}>{p.monthly}</div>
                  <div className={`text-[11px] mt-1 ${p.accent ? "text-white/65" : "text-slate-600"}`}>{p.monthlyUnit}</div>
                </div>
                <div>
                  <div className={`text-[24px] font-semibold tracking-tight ${p.accent ? "text-white" : "text-[#042C53]"}`}>{p.booking}</div>
                  <div className={`text-[11px] mt-1 ${p.accent ? "text-white/65" : "text-slate-600"}`}>{p.bookingNote}</div>
                </div>
              </div>

              <ul className={`space-y-2.5 text-[14px] mb-8 ${p.accent ? "text-white/90" : "text-slate-700"}`}>
                {p.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${p.accent ? "bg-[#9CC4EC]" : "bg-[#185FA5]"}`} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <a href={CAL_URL} target="_blank" rel="noopener"
                 className={`block w-full text-center px-5 py-3.5 rounded-full font-semibold text-[14px] transition ${p.accent ? "bg-white text-[#042C53] hover:bg-slate-100" : "bg-[#042C53] text-white hover:bg-[#0A3D6E]"}`}>
                {p.cta} →
              </a>
            </div>
          );
          })}
        </div>
      </section>

      {/* v46a: trust rail under the plan cards — what's in the box, money-back, SSL */}
      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#185FA5] mb-1.5">Money-back</div>
            <div className="text-[14px] text-slate-800 leading-snug">30-day refund on the build fee if our first agent doesn't ship to your spec. No clawback fight.</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#185FA5] mb-1.5">Payments handled by Stripe</div>
            <div className="text-[14px] text-slate-800 leading-snug">SSL secured · TLS 1.3 · We never see or store your card. Stripe processes every charge.</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#185FA5] mb-1.5">No surprise contract</div>
            <div className="text-[14px] text-slate-800 leading-snug">One page, plain English, cancel any time, no auto-renewal lock-in, your data exports on request.</div>
          </div>
        </div>
      </section>

      {/* v46a: deliverables — "what you actually get when you sign up" */}
      <section className="px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">What you actually get when you sign up</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">
            Five concrete deliverables. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Not a sales process.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {DELIVERABLES.map((d) => (
              <div key={d.n} className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5]/40 hover:shadow-[0_4px_24px_-12px_rgba(4,44,83,0.18)] transition">
                <div className="text-[11px] font-mono tracking-wide text-[#185FA5] mb-1">{d.n}</div>
                <div className="text-[16px] font-semibold text-[#042C53] mb-1.5 leading-snug">{d.h}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{d.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 sm:py-24 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Free 7-day live trial</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53]">
              Real calls. Real outcomes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Before the first invoice.</span>
            </h2>
          </div>
          <div className="text-[16px] text-slate-700 leading-relaxed">
            We build your agent, point your forwarded line at it, and let it run live for seven business days. You see exactly what it handled, what it routed to humans, and what it booked. If you don't like what you see, you walk. We keep nothing. We've never had a free-trial customer not convert.
          </div>
        </div>
      </section>

      {/* v42: smart price reveal */}
      <section className="px-5 sm:px-8 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <SmartPriceReveal />
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="px-5 sm:px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">ROI calculator</div>
            <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53]">
              Run your own numbers. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>See payback in days.</span>
            </h2>
          </div>
          <RoiCalculator onEmailCaptured={async (d) => { toast(`Report sent to ${d.email}`, "ok"); }} />
        </div>
      </section>

      {/* INLINE CAL */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Book direct</div>
            <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53]">
              Pick a time. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Talk to a builder.</span>
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[12.5px] text-amber-900">
              <span aria-hidden>•</span>
              Calendar fills 7-10 days out — book before Friday for a slot this month.
            </div>
          </div>
          <CalEmbed height={680} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <NewsletterCapture variant="card" />
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">FAQ</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">Questions we get on every call.</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-2xl p-6 open:border-[#185FA5]/60 open:shadow-sm">
                <summary className="cursor-pointer flex items-start justify-between gap-4 text-[17px] font-medium text-[#042C53]">
                  <span>{f.q}</span>
                  <span className="text-[#185FA5] flex-shrink-0 text-[20px] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-4 text-[15px] text-slate-700 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] sm:text-[56px] leading-[1.04] tracking-tight font-semibold">
            Stop pricing. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Start shipping.</span>
          </h2>
          <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            Thirty-minute build call. We scope your use case, give you a real number on the spot, and you decide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">Book a 30-min build call →</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">Or DM Alexander on LinkedIn</a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
      <ToastHost />
    </div>
  );
};

export default Pricing;
