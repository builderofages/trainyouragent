import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { injectJsonLdMany, organizationLd, personLd } from "@/lib/jsonld";
import PathwayRouter from "@/components/PathwayRouter";
// v63: live voice demo embedded directly in hero — the 10x conversion lever
// called out in the Grok Heavy audit.
import HeroVoiceEmbed from "@/components/HeroVoiceEmbed";
// v63: live KPI strip above the fold pulling /api/public-metrics
import LiveKpiStrip from "@/components/LiveKpiStrip";
// v63: deterministic per-session hero h1 variant rotation (A/B without an A/B framework)
import { fireEvent } from "@/lib/event";
// v53: visitor-context personalization — Home re-skins per niche/lane.
import { useVisitor, nicheDisplayName } from "@/lib/visitorContext";
import { getPlaybook } from "@/lib/playbooks";
// v38: trust signals — testimonial wall, built-in-public.
import WallOfLove from "@/components/WallOfLove";
// v61: ShipsCounter removed from Home — proof strip uses verifiable real numbers instead.
// v42: site-visit funnel event
import { fireSiteVisitOnce } from "@/lib/event";
// v44: hero illustration, footer redesign, animated dividers, count-up
import HeroIllustration from "@/components/HeroIllustration";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { useCountUp } from "@/hooks/useCountUp";
import NetworkIllo from "@/components/illustrations/NetworkIllo";
// v52B: free in-browser voice agent CTA + buyer's-guide email opt-in
import LeadMagnetForm from "@/components/LeadMagnetForm";
// v54: Hormozi-style risk reversal block (4 promises)
import RiskReversalBlock from "@/components/RiskReversalBlock";
// v69: generic Hell→Heaven block (above the fold, visible to all visitors)
import HellHeavenBlock from "@/components/HellHeavenBlock";
// v69: motion primitives for stagger reveal + hover lift
import { RevealUp, StaggerChildren, HoverLift } from "@/components/motion";
// v69: single source of truth for all stat claims
import { STATS } from "@/lib/siteStats";
// v71: 8-capability hero chip row — fixes Grok's "voice-heavy" ding by making
// the Everything-AI breadth visible above the fold without a scroll.
import HeroCapabilityChips from "@/components/HeroCapabilityChips";
/// v73: restrained 2040 visual layer — mesh gradient + drift particles only.
// v77: LiveStatTicker import removed — it was colliding with the fixed nav
// and duplicating the numbers already shown in the navy eyebrow strip.
import MeshGradientBackdrop from "@/components/visual/MeshGradientBackdrop";
import ParticleDrift from "@/components/visual/ParticleDrift";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills/";

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

const VERTICALS = [
  { slug: "/healthcare",    label: "Healthcare",   note: "Patient intake. BAA per customer." },
  { slug: "/legal",         label: "Legal",        note: "Intake, conflict checks, scheduling." },
  { slug: "/real-estate",   label: "Real Estate",  note: "Lead capture. Showing schedules." },
  { slug: "/hvac",          label: "HVAC",         note: "After-hours dispatch. Booking." },
  { slug: "/roofing",       label: "Roofing",      note: "Storm-season surge. Quotes." },
  { slug: "/solar",         label: "Solar",        note: "Lead qual. Site survey booking." },
  { slug: "/accounting",    label: "Accounting",   note: "Tax-season intake. Client triage." },
  { slug: "/automotive",    label: "Automotive",   note: "Service bay scheduling." },
];

const CAPABILITIES = [
  { h: "Marketing",       b: "Campaigns, content engines, conversion funnels — operated by agents." },
  { h: "Lead Gen",        b: "Outbound at agency scale, inbound qualified before your rep picks up." },
  { h: "Creative",        b: "Brand systems, landing pages, founder-grade copy." },
  { h: "Infrastructure",  b: "Agent stacks, model routing, fallback logic, telephony." },
  { h: "Research",        b: "Markets, competitors, ICPs. Synthesized into action." },
  { h: "Building",        b: "Voice agents, chat agents, internal tools, dashboards." },
  { h: "Scaling",         b: "From first ten customers to thousand-customer ops layer." },
  { h: "Optimizing",      b: "Conversion lifts, cost-per-call, agent accuracy — measured weekly." },
];

const FAQ_ITEMS = [
  { q: "Is this an off-the-shelf chatbot?", a: "No. Off-the-shelf bots say 'I can help with that' and stop. Our agents pull customer history, follow your exact qualification script, and close the loop — booking, ticket, CRM update, all of it." },
  { q: "How fast can a startup get live?",  a: "Days, not quarters. Most startups we work with are answering live calls within seven business days of kickoff." },
  { q: "Will my agent sound like a robot?", a: "No. We use top-tier voice models with prosody tuning. Most callers don't realize. We disclose 'AI assistant' on the open when your industry requires it." },
  { q: "What about data + security?",       a: "TLS in transit, AES-256 at rest, US hosting, zero training on your data, HIPAA BAA available, SOC 2 in evaluation." },
];

function AnimatedStat({ value, suffix = "", prefix = "", label, decimals = 0, href }: { value: number; suffix?: string; prefix?: string; label: string; decimals?: number; href?: string }) {
  const { value: v, ref } = useCountUp<HTMLDivElement>(value, 1500);
  const display = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  const inner = (
    <>
      <div ref={ref} className="text-[40px] sm:text-[56px] leading-none tracking-tight font-semibold text-[#042C53]" style={{ fontFamily: "'Playfair Display', serif" }}>
        {prefix}{display}{suffix}
      </div>
      <div className="mt-2 text-[13px] text-slate-600 leading-snug">{label}</div>
    </>
  );
  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener" className="block hover:opacity-80 transition">
          {inner}
        </a>
      );
    }
    return <Link to={href} className="block hover:opacity-80 transition">{inner}</Link>;
  }
  return <div>{inner}</div>;
}

// v76-B: 50/50 hero h1 A/B framework per spec.
//
// Why this exists: v75 audit flagged that we were guessing on hero copy.
// v76-B locks in two candidate h1s and lets click-through data decide:
//
//   A = "AI that runs the part of your business that used to run you."
//       (the current v73-FINAL flagship h1)
//   B = "More appointments. Fewer missed calls. Live in 21 days."
//       (the previous high-converting concrete-outcomes h1)
//
// Implementation details from the v76-B spec:
//   - Random on mount, 50/50 split between A and B
//   - Sticky per-visitor via localStorage key `tya_hero_variant` so a
//     returning visitor always sees the variant they were first bucketed
//     into (avoids cross-session contamination of the test)
//   - Impressions logged to /api/lead source `hero-ab-impression-{variant}`
//   - CTA clicks logged to /api/lead source `hero-ab-cta-click-{variant}`
//
// Removed the v63 three-variant + sessionStorage rotation in favor of
// the spec's two-variant + localStorage approach so the data is cleaner.
type HeroVariantId = "A" | "B";
type HeroVariant = {
  id: HeroVariantId;
  headlineHtml: JSX.Element;
};

const HERO_VARIANTS: HeroVariant[] = [
  {
    id: "A",
    headlineHtml: (
      <>
        AI that runs the part of your business{" "}
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>that used to run you.</span>
      </>
    ),
  },
  {
    id: "B",
    headlineHtml: (
      <>
        More appointments. Fewer missed calls.{" "}
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Live in 21 days.</span>
      </>
    ),
  },
];

const HERO_AB_STORAGE_KEY = "tya_hero_variant";

function pickHeroVariant(): HeroVariant {
  if (typeof window === "undefined") return HERO_VARIANTS[0];
  try {
    const existing = window.localStorage.getItem(HERO_AB_STORAGE_KEY);
    if (existing === "A" || existing === "B") {
      const found = HERO_VARIANTS.find((v) => v.id === existing);
      if (found) return found;
    }
    // 50/50 random — Math.random() < 0.5 → A, else B
    const v = HERO_VARIANTS[Math.random() < 0.5 ? 0 : 1];
    window.localStorage.setItem(HERO_AB_STORAGE_KEY, v.id);
    return v;
  } catch {
    // localStorage disabled / private mode — still bucket but don't persist
    return HERO_VARIANTS[Math.random() < 0.5 ? 0 : 1];
  }
}

// v76-B: fire-and-forget telemetry for the hero A/B test. Spec called
// these `hero-ab-impression` / `hero-ab-cta-click` to /api/lead, but
// /api/lead enforces an email + source allowlist (it's the real lead
// store), so we route telemetry through /api/event which is the
// codebase's canonical anonymous-event endpoint. Same downstream
// store, no email required. Best-effort, never throws.
function logHeroAbEvent(
  kind: "impression" | "cta-click",
  variant: HeroVariantId,
): void {
  try {
    void fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_type: `hero-ab-${kind}`,
        source: `hero-ab-${kind}-${variant}`,
        meta: { variant, kind, path: "/" },
      }),
      keepalive: true,
    });
  } catch {
    /* swallow — never break the UI on a logging failure */
  }
}

const Index = () => {
  const { niche } = useVisitor();
  const playbook = niche ? getPlaybook(niche) : undefined;
  const nicheName = playbook ? playbook.displayName : nicheDisplayName(niche);
  // v63: pick once per mount so SSR/hydration is stable and the variant doesn't
  // jitter on re-render. fireEvent records the variant for downstream attribution.
  const heroVariant = useMemo(() => pickHeroVariant(), []);
  const [pathwayOpen, setPathwayOpen] = useState(false);

  useEffect(() => {
    fireSiteVisitOnce();
    // v63: record which hero variant this visitor saw (best-effort, never throws)
    void fireEvent("router_view", { hero_variant: heroVariant.id }, "home-hero-variant");
    // v76-B: log impression to /api/lead for the hero A/B test so we can
    // join it against downstream CTA clicks / leads / bookings.
    logHeroAbEvent("impression", heroVariant.id);
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "TrainYourAgent — Everything-AI for SMBs & Startups";

    // v48: dynamic OG image override
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("TrainYourAgent · Everything-AI for SMBs & Startups")}&subtitle=${encodeURIComponent("Voice + chat agents that actually run your business")}&type=page`;
      const setMP = (n: string, c: string) => {
        let el = document.querySelector(`meta[property='${n}']`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement("meta"); el.setAttribute("property", n); document.head.appendChild(el); }
        el.setAttribute("content", c);
      };
      const setMN = (n: string, c: string) => {
        let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
        el.setAttribute("content", c);
      };
      setMP("og:image", ogImage);
      setMN("twitter:image", ogImage);
      setMN("twitter:card", "summary_large_image");
    }

    // v47A: organization + person JSON-LD on the home page
    injectJsonLdMany([
      { id: "home-org", data: organizationLd() },
      { id: "home-person", data: personLd() },
    ]);

    // v33a: page-level FAQPage schema (Org + WebSite already in index.html).
    const id = "tya-schema-index";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B] overflow-x-hidden" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* v33a a11y: skip-to-content link — first focusable element */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">
        Skip to main content
      </a>

      {/* NAV — canonical service nav */}
      <SiteNav />

      {/* v77: header de-clutter — LiveStatTicker pulled (it was colliding
          with the fixed nav and duplicating numbers already in the navy
          eyebrow strip below). The strip below is the canonical proof line. */}

      {/* v73: brand-anchor eyebrow — flagship positioning above hero.
          v77: pushed below the fixed nav height so it sits in the right place. */}
      <div className="w-full bg-[#042C53] text-white" style={{ marginTop: "calc(var(--tya-pill-h, 0px) + 64px)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2 text-center text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold font-mono text-[#E6F1FB]">
          {/* v76-B: read both numbers from STATS so the eyebrow + the
              LiveStatTicker above it can never disagree. */}
          Train Your Agent · {STATS.cornerstonePlaybooks} productionized playbooks · {STATS.totalRoutes} live URLs ·{" "}
          <a href="/train" className="underline decoration-[#A8C7E8]/60 decoration-1 underline-offset-2 hover:text-white">See the method</a>
        </div>
      </div>

      {/* HERO */}
      {/* v77: pt-24 -> pt-8 sm:pt-12 because the eyebrow strip above is now
          correctly positioned below the fixed nav (was previously hiding under
          the nav, which forced extra hero pt to compensate). */}
      <main id="main">
      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 px-5 sm:px-8 overflow-hidden">
        {/* v73: 2040 visual layer behind hero content. */}
        <MeshGradientBackdrop />
        <ParticleDrift count={22} />
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Live · Agents in production
            </div>
            {/* v80: hero h1 unwrapped from RevealUp. The y-translate animation
                was creating subpixel anti-aliasing during transition that read
                as a gray-fade flash on first paint. h1 now renders at final
                position from frame 0 with zero animation. The page's other
                sections still have scroll-triggered reveals; only the
                above-the-fold hero is static. */}
            <h1
              className="text-[30px] sm:text-[48px] md:text-[64px] lg:text-[80px] leading-[1.05] sm:leading-[1.0] lg:leading-[0.98] tracking-tight font-semibold text-[#042C53] h1-balance break-words"
              data-hero-variant={heroVariant.id}
            >
              {heroVariant.headlineHtml}
            </h1>
            {/* v71: 8-capability chip row — Everything-AI breadth in one glance,
                no scroll required. Fixes the only visible ding Grok Heavy flagged
                on the v69 reframe. */}
            <HeroCapabilityChips />
            <p className="mt-7 text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-2xl">
              {/* v69: WHAT + HOW in customer terms. Everything-AI breadth (8 categories).
                  No "operator", no "4 years", no founder name. Operator-velocity proof
                  is demoted to a small "Why us" strip below the Hell→Heaven block. */}
              {playbook ? (
                <>
                  Voice agents that answer your phone 24/7. Chat agents that qualify your <span className="text-[#042C53] font-medium">{nicheName.toLowerCase()}</span> leads. Marketing AI that fills your calendar. Brand systems, infrastructure, custom builds — the full AI layer for your business, deployed in <span className="text-[#042C53] font-medium">21 days</span>. Pay only when it earns.
                </>
              ) : (
                <>
                  Voice agents that answer your phone 24/7. Chat agents that qualify your leads. Marketing AI that books your calendar. Infrastructure builds, brand systems, internal tooling — the full AI layer for your business, deployed in <span className="text-[#042C53] font-medium">21 days</span>. Pay only when it earns.
                </>
              )}
            </p>
            {playbook && (
              <div className="mt-6">
                <Link
                  to={`/playbooks/${playbook.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] shadow"
                >
                  Built for {nicheName} → see the playbook
                </Link>
              </div>
            )}
            {/* v61: removed ShipsCounter — proof strip below has verifiable, sourced numbers */}
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <HoverLift>
                <Link
                  to="/tools/agent-builder"
                  // v76-B: log primary hero CTA click against the A/B
                  // variant so we can compute per-variant CTR.
                  onClick={() => logHeroAbEvent("cta-click", heroVariant.id)}
                  className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] transition shadow-lg shadow-[#042C53]/15 flex items-center justify-between gap-3 min-w-[260px]"
                >
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-1">Primary action · 30 seconds</span>
                    <span>Build your own AI agent →</span>
                  </span>
                </Link>
              </HoverLift>
            </div>
            {/* v61: ONE secondary link — talk to a real AI agent. Other CTAs moved below the hero. */}
            <div className="mt-4">
              <Link
                to="/voice-demo"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#185FA5] hover:text-[#042C53]"
              >
                <span className="relative inline-flex w-2 h-2" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                or talk to a real AI agent in your browser →
              </Link>
            </div>

            {/* v69: founder-credential strip REMOVED from hero — moved below
                the Hell→Heaven block as a small "About the operator" callout.
                Hero is now 100% about the customer outcome. */}
          </div>

          {/* v63: 10x conversion lever — live voice demo embedded directly in
              the hero. Visitor lands → sees a working AI agent in 5 seconds →
              can talk to it without signing up. */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <HeroIllustration className="hidden lg:block absolute -right-10 -top-10 w-[420px] h-[420px] pointer-events-none opacity-60 -z-10" />
            <HeroIllustration className="lg:hidden absolute inset-0 pointer-events-none opacity-20 -z-10" />
            <HeroVoiceEmbed />
          </div>
        </div>

        {/* v63: pathway router demoted to a slide-down "personalize this site"
            expander below the hero so the live demo gets the prime real estate. */}
        <div className="max-w-7xl mx-auto mt-10 sm:mt-14">
          <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
            <button
              type="button"
              onClick={() => setPathwayOpen((o) => !o)}
              aria-expanded={pathwayOpen}
              className="w-full flex items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold">
                  Personalize this site
                </span>
                <span className="hidden sm:inline text-[13px] text-slate-600">
                  Tell us your role + industry → we'll re-skin the rest of the page.
                </span>
              </div>
              <span
                className={`text-[#185FA5] text-[20px] leading-none transition-transform ${pathwayOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {pathwayOpen && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <PathwayRouter />
                <div className="mt-3 text-center text-[12px] text-slate-600">
                  Four years deep in AI · Every major model
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* v73: TRAINED-AGENT DIFFERENCE — 3-column comparison surfacing the
          "we don't bolt LLMs on, we train" brand wedge above the fold. */}
      <section className="relative px-5 sm:px-8 py-14 sm:py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] mb-3 font-mono">
              What makes a TrainYourAgent agent different
            </div>
            <h2 className="text-[28px] sm:text-[40px] md:text-[48px] leading-[1.05] tracking-tight font-semibold text-[#042C53]">
              An <span className="font-serif italic">untrained</span> agent sounds like a chatbot.
              <br className="hidden sm:block" />
              A <span className="font-serif italic">trained</span> agent sounds like your best employee.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {/* Chatbot column */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">Off-the-shelf chatbot</div>
              <div className="text-[22px] font-semibold text-slate-700 mb-5">Generic, brittle</div>
              <ul className="space-y-3 text-[14px] text-slate-700">
                {[
                  "Knows your offer",
                  "Handles edge cases",
                  "Books correctly",
                  "Sounds like you",
                  "Escalates appropriately",
                  "Learns from conversations",
                ].map((row, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-[12px] font-bold">×</span>
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Off-the-shelf AI column */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-700 mb-2">Off-the-shelf AI</div>
              <div className="text-[22px] font-semibold text-amber-900 mb-5">Plausible, shallow</div>
              <ul className="space-y-3 text-[14px] text-slate-700">
                {[
                  "Knows your offer",
                  "Handles edge cases",
                  "Books correctly",
                  "Sounds like you",
                  "Escalates appropriately",
                  "Learns from conversations",
                ].map((row, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[14px] font-bold">~</span>
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trained Agent column — flagship */}
            <div className="rounded-2xl border-2 border-[#042C53] bg-gradient-to-br from-[#E6F1FB] to-white p-6 shadow-sm relative">
              <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-[#042C53] text-white text-[10px] font-semibold tracking-[0.16em] uppercase">Flagship</div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] mb-2">Trained Agent</div>
              <div className="text-[22px] font-semibold text-[#042C53] mb-5">
                <span className="font-serif italic">Trained</span> on your business
              </div>
              <ul className="space-y-3 text-[14px] text-slate-800">
                {[
                  "Knows your offer",
                  "Handles edge cases",
                  "Books correctly",
                  "Sounds like you",
                  "Escalates appropriately",
                  "Learns from conversations",
                ].map((row, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#22A36C] text-white text-[12px] font-bold">✓</span>
                    <span className="font-medium">{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="/train"
              className="inline-flex items-center gap-2 text-[#042C53] hover:text-[#185FA5] text-[16px] sm:text-[17px]"
            >
              <span>See the </span>
              <span className="font-serif italic text-[18px] sm:text-[20px]">5-step training method</span>
              <span aria-hidden className="text-[#185FA5]">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* v69: HELL → HEAVEN — generic, visible to ALL visitors above the fold.
          Niche-personalized version still renders further down when a niche
          is set in VisitorContext. */}
      <HellHeavenBlock />

      {/* v69: small "About the operator" strip — founder/operator chrome
          demoted from hero to a supporting signal here. */}
      <section className="px-5 sm:px-8 py-6 sm:py-7 bg-white border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-700">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold">
            About the operator
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span>
            Built by <strong className="font-semibold text-[#042C53]">Alexander Mills</strong> in Tampa Bay, FL
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span>{STATS.yearsInAI} yrs deep in AI</span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <Link to="/proof" className="text-[#185FA5] font-medium hover:underline">
            {STATS.publicCommits}+ public commits — see the receipts →
          </Link>
        </div>
      </section>

      {/* v63: LIVE KPI STRIP — real numbers pulled from /api/public-metrics,
          above the fold. Closes Grok Heavy's "move /metrics + /proof numbers
          to home page above fold" callout. */}
      <LiveKpiStrip />

      {/* v61: "More ways to see it work" — secondary CTAs demoted from hero */}
      <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 text-[13.5px]">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold">More ways to see it work</span>
          <Link to="/tools/website-audit" className="text-[#185FA5] font-medium hover:underline">Audit your site in 30 sec →</Link>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <Link to="/demos/sales-objection-handler" className="text-[#185FA5] font-medium hover:underline">Sales objection handler →</Link>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <Link to="/demos/sop-writer" className="text-[#185FA5] font-medium hover:underline">SOP writer →</Link>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <Link to="/demos/seo-cluster" className="text-[#185FA5] font-medium hover:underline">SEO cluster generator →</Link>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <Link to="/book" className="text-[#185FA5] font-medium hover:underline">Book a 30-min build call →</Link>
        </div>
      </section>

      {/* v44: animated section divider */}
      <SectionDivider />

      {/* PROOF STRIP — count-up animated; every number is publicly verifiable.
          v69: numbers now reference STATS (single source of truth). */}
      <section className="px-5 sm:px-8 py-14 border-y border-slate-200 bg-white">
        <RevealUp>
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <AnimatedStat value={STATS.yearsInAI}     suffix=" yrs" label="In applied AI · every major model shift" />
            <AnimatedStat value={STATS.publicCommits} suffix="+"    label="Public commits · on GitHub" href="https://github.com/builderofages/trainyouragent/commits/main" />
            <AnimatedStat value={STATS.totalRoutes}                 label="Live URLs · in production" href="/sitemap.xml" />
            <AnimatedStat value={STATS.playbooks}                   label="Niche playbooks · real cited data" href="/playbooks" />
          </div>
        </RevealUp>
      </section>

      <SectionDivider />

      {/* v53: NICHE STATS — only renders when a niche is set in VisitorContext */}
      {playbook && (
        <section className="px-5 sm:px-8 py-12 sm:py-16 bg-[#F6FAFE] border-b border-slate-200/70">
          <div className="max-w-6xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              {nicheName} · industry signal
            </div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8 max-w-3xl">
              Three numbers that explain why your phones are the bottleneck.
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {playbook.stats.slice(0, 3).map((s, i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5">
                  <div className="text-[14px] text-slate-700 leading-relaxed">{s.label}</div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold">
                    Source · {s.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* v53: HELL → HEAVEN — niche-specific pain vs outcome */}
      {playbook && (
        <section className="px-5 sm:px-8 py-14 sm:py-20 bg-white border-b border-slate-200/70">
          <div className="max-w-6xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              {nicheName} · before vs after
            </div>
            <h2 className="text-[26px] sm:text-[40px] md:text-[48px] leading-[1.04] tracking-tight font-semibold text-[#042C53] mb-10 max-w-4xl">
              From the hell most {nicheName.toLowerCase()} shops are stuck in{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                to the heaven a built agent puts you in.
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-7">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-4">
                  Today (the hell)
                </div>
                <ul className="space-y-4">
                  {playbook.comparison.slice(0, 4).map((c, i) => (
                    <li key={i} className="flex gap-3 text-[14px] text-slate-700 leading-relaxed">
                      <span aria-hidden="true" className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span><span className="font-semibold text-slate-800">{c.row}:</span> {c.without}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-[#042C53] text-white p-7 shadow-[0_30px_80px_-20px_rgba(4,44,83,0.45)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-4">
                  With a TrainYourAgent build (the heaven)
                </div>
                <ul className="space-y-4">
                  {playbook.comparison.slice(0, 4).map((c, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-white/90">
                      <span aria-hidden="true" className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span><span className="font-semibold text-white">{c.row}:</span> {c.withTya}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-5 border-t border-white/15 flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/playbooks/${playbook.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#042C53] text-[13px] font-semibold hover:bg-slate-100"
                  >
                    Read the {nicheName} playbook →
                  </Link>
                  <Link
                    to={`/book?utm_source=context&utm_campaign=${playbook.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-[13px] font-semibold hover:bg-white/15"
                  >
                    Talk to a {nicheName} AI builder →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* v38: WALL OF LOVE — sits between proof strip and Capabilities */}
      <WallOfLove
        eyebrow="Wall of love"
        title="Operators don't recommend things lightly."
      />

      {/* CAPABILITIES */}
      <section className="px-5 sm:px-8 py-14 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 items-center mb-12">
            <div className="max-w-3xl">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Everything AI</div>
              <h2 className="text-[28px] sm:text-[40px] md:text-[48px] leading-[1.08] sm:leading-[1.05] tracking-tight font-semibold text-[#042C53]">
                Not a chatbot company. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>The operating layer</span> for everything AI in your business.
              </h2>
            </div>
            <div className="hidden lg:block">
              <NetworkIllo style={{ width: "100%", maxWidth: 360, height: "auto", margin: "0 auto" }} />
            </div>
          </div>
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3" delay={0.05}>
            {CAPABILITIES.map((c, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-8px_rgba(4,44,83,0.18)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-[15px] font-semibold text-[#042C53] mb-2">{c.h}</div>
                <div className="text-[13px] text-slate-600 leading-relaxed">{c.b}</div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* STARTUP SPOTLIGHT */}
      <section className="px-5 sm:px-8 py-14 sm:py-24 bg-[#042C53] text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#BDDAF4] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6 border border-white/15">For Founders</div>
            <h2 className="text-[30px] sm:text-[44px] md:text-[56px] leading-[1.04] tracking-tight font-semibold">
              Building a startup? <br /><span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>You should not be answering phones.</span>
            </h2>
            <p className="mt-6 text-[18px] text-white/85 leading-relaxed max-w-xl">
              Voice agents, GTM infrastructure, brand systems, internal tooling — we build the layer that lets you go heads-down on the product.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/contact?lane=startup" className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">Apply for the Founder lane → $0 upfront, live in 7 days</Link>
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">Book a 30-min build call instead</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { h: "Voice + chat agents", b: "Inbound, outbound, support. Live in days." },
              { h: "GTM infra",           b: "Lead enrichment, sequences, CRM wiring." },
              { h: "Brand systems",        b: "Logo, type, voice, site." },
              { h: "Internal tooling",    b: "Dashboards, ops scripts, AI co-pilots." },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-[14px] font-semibold mb-1.5">{x.h}</div>
                <div className="text-[12px] text-white/70 leading-relaxed">{x.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="px-5 sm:px-8 py-14 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Currently live in</div>
            <h2 className="text-[26px] sm:text-[36px] md:text-[44px] leading-tight font-semibold text-[#042C53]">
              Built for your industry. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Not the average of all of them.</span>
            </h2>
          </div>
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3" delay={0.05}>
            {VERTICALS.map((v, i) => (
              <Link key={i} to={v.slug} className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#042C53] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.2)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-semibold text-[#042C53] mb-1">{v.label}</div>
                    <div className="text-[12px] text-slate-600 leading-relaxed">{v.note}</div>
                  </div>
                  <span className="text-[#185FA5] text-[18px] transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="px-5 sm:px-8 py-14 sm:py-24 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] border border-slate-200 flex items-center justify-center">
              <BrainLogo size={140} />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-[15px] font-semibold text-[#042C53]">Alexander Mills</div>
              <div className="text-[13px] text-slate-600">Founder · TrainYourAgent</div>
              <div className="text-[13px] text-slate-600">Tampa Bay, Florida</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="text-[13px] text-[#042C53] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">LinkedIn</a>
                <span className="text-slate-300">·</span>
                <a href={CAL_URL} target="_blank" rel="noopener" className="text-[13px] text-[#042C53] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">Book a call</a>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Founder-led</div>
            <h2 className="text-[26px] sm:text-[36px] md:text-[44px] leading-[1.08] tracking-tight font-semibold text-[#042C53] mb-6">
              Built by someone who's <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>been shipping for a decade.</span>
            </h2>
            <div className="text-[16px] text-slate-700 leading-[1.75] space-y-4">
              <p>Alexander Mills is the founder of TrainYourAgent — a Tampa-based AI company building the voice and chat agents that actually run service businesses.</p>
              <p>Before AI, Alexander built across categories most founders never touch: shipping social campaigns for global brands and household-name talent at one of the world's largest social media marketing agencies in Los Angeles, then founding EndCreations to build infrastructure for the gaming industry. The pattern: walk into industries the polished operators ignore, learn how the work actually gets done, and rebuild it.</p>
              <p>He's now four years deep in applied AI — through every model release, every tool shift, every capability jump — and ships the same way he always has: faster than anyone you've met, with a thesis you can argue with.</p>
              <p>That thesis: AI isn't a feature. It's the evolutionary step that takes humans out of cubicles. The next decade of business gets won by the operators who wire it into the work first. TrainYourAgent is the agency that wires it for them.</p>
              <p>Alexander runs TrainYourAgent and a portfolio of related ventures from Tampa Bay, Florida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION — editorial pull quote */}
      <section className="px-5 sm:px-8 py-16 sm:py-28 bg-[#FAFBFC] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#185FA5] font-semibold mb-8">Why we're building this</div>
          <div className="relative">
            <span aria-hidden="true" className="absolute -left-2 sm:-left-8 -top-6 text-[60px] sm:text-[120px] leading-none text-[#185FA5]/15 font-serif select-none">"</span>
            <blockquote className="relative text-[19px] sm:text-[22px] leading-[1.55] text-[#0B1B2B] font-normal" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
              <p className="mb-5">
                AI isn't a feature. It's the evolutionary step humans have been waiting for — the one that takes us out of cubicles and away from paperwork, back into the work we were built for: <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#042C53" }}>building, dreaming, evolving.</span>
              </p>
              <p className="mb-5">
                The companies that get this right won't just be more efficient. They'll write the next chapter of what business looks like.
              </p>
              <p className="text-[#042C53] font-medium">
                We're here to make sure every founder, every operator, every business is first in line.
              </p>
            </blockquote>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-200 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#185FA5] to-[#042C53] flex-shrink-0" aria-hidden="true" />
            <div>
              <div className="text-[15px] font-semibold text-[#042C53]">Alexander Mills</div>
              <div className="text-[12px] text-slate-600 tracking-wide">Founder · TrainYourAgent · Tampa Bay, FL</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-14 sm:py-24 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Questions buyers actually ask</div>
          <h2 className="text-[26px] sm:text-[36px] md:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">FAQ</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
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

      {/* v54: THE OFFER, ON ONE PAGE — Hormozi you-get/you-don't-get */}
      <section className="px-5 sm:px-8 py-14 sm:py-24 bg-white border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">The offer, on one page</div>
          <h2 className="text-[28px] sm:text-[44px] md:text-[52px] leading-[1.04] tracking-tight font-semibold text-[#042C53] mb-10 max-w-4xl">
            What's in the box —{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              and what's not.
            </span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* YOU GET */}
            <div className="rounded-3xl bg-[#042C53] text-white p-7 sm:p-9 shadow-[0_30px_80px_-20px_rgba(4,44,83,0.4)]">
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                <span aria-hidden="true" className="text-[14px]">✓</span>
                <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#9CC4EC]">You get</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Production AI voice OR chat agent (your pick), live in 21 days",
                  "Wiring into your CRM, calendar, and phone stack — we do the integration work",
                  "Weekly transcript review + script tuning for the first 90 days",
                  "Direct Slack or email line to the founder (no SDR layer, no account manager)",
                  "Real-time dashboard — calls answered, booked, escalated, missed",
                  "30-day money-back guarantee, no clawback fight",
                  "Month-to-month after that — no multi-year contract trap",
                  "If your agent doesn't book a real appointment in 21 days, we work free until it does",
                ].map((line) => (
                  <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-white/95">
                    <span aria-hidden="true" className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-[#22A36C] text-white text-[11px] font-bold flex items-center justify-center">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* YOU DON'T GET */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-7 sm:p-9">
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white border border-slate-300">
                <span aria-hidden="true" className="text-[14px] text-slate-500">×</span>
                <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-600">You don't get</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "A demo with a hand-off to a faceless 'delivery team'",
                  "A 90-day implementation slog with weekly status calls",
                  "Generic templates that aren't tuned to your business",
                  "Surprise upsells once you're past the contract date",
                  "A multi-year contract you can't cancel",
                  "A bot that says 'I'm not able to help with that' 90% of the time",
                  "An SDR pretending to be a builder on the first call",
                  "Vendor lock-in — you own the prompts, scripts, and number",
                ].map((line) => (
                  <li key={line} className="flex gap-3 text-[14.5px] leading-relaxed text-slate-700">
                    <span aria-hidden="true" className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-slate-300 text-white text-[11px] font-bold flex items-center justify-center">×</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-5 items-center rounded-3xl bg-[#E6F1FB] border border-[#185FA5]/15 p-6 sm:p-7">
            <div className="text-[15px] sm:text-[16px] text-[#0B1B2B] leading-relaxed">
              <strong className="text-[#042C53]">Starts at $0 upfront on the Founder lane,</strong> $1,500/mo+ on Operators. Most operators land on $5K/mo for full coverage. Pricing on the discovery call — written scope same day.
            </div>
            <Link
              to="/book"
              className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[14.5px] hover:bg-[#0A3D6E] shadow-lg whitespace-nowrap"
            >
              Book your build call → leave with a written plan
            </Link>
          </div>
        </div>
      </section>

      {/* v54: RISK REVERSAL — four promises in plain English */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-5xl mx-auto">
          <RiskReversalBlock variant="light" />
        </div>
      </section>

      {/* v52B: LEAD MAGNET — buyer's guide opt-in */}
      <section className="px-5 sm:px-8 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <LeadMagnetForm
            source="lead-magnet-buyers-guide"
            title="Get the AI Operations Playbook"
            subtitle="30 pages on what's working in AI agents in 2026 — voice, chat, ROI benchmarks, the 7 reasons most pilots die. Free PDF, emailed in ~30 seconds."
            bullets={[
              "Adoption by vertical (8 categories with real numbers)",
              "ROI benchmarks across 5 deployment types",
              "The 15-point readiness scorecard for your business",
              "Vendor landscape — three-category framework",
            ]}
          />
        </div>
      </section>

      {/* CLOSER */}
      <section className="px-5 sm:px-8 py-14 sm:py-24 bg-[#042C53] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-[32px] sm:text-[48px] md:text-[64px] leading-[1.02] tracking-tight font-semibold">
            Ready to put AI <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually to work?</span>
          </h2>
          <p className="mt-6 text-[18px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            Thirty minutes with the founder. You walk out with a written agent plan, a real number, and a 21-day delivery date. No card. No SDR. No obligation.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={playbook ? `/book?utm_source=context&utm_campaign=${playbook.slug}` : "/book"}
              className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 transition shadow-lg"
            >
              {playbook ? `Book your ${nicheName} build call → 30-min scoping, free` : "Book a 30-min build call → leave with a written plan"}
            </Link>
            <Link to="/voice-demo" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15 transition">Talk to a live AI agent in your browser → 60 sec, no signup</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15 transition">Or DM the founder on LinkedIn</a>
          </div>
          <p className="mt-5 text-[13px] text-white/60">
            Limited to 12 new builds per quarter — the founder personally scopes every one.
          </p>
        </div>
      </section>

      </main>

      {/* v44: redesigned footer */}
      <FooterV44 />
    </div>
  );
};

export default Index;
