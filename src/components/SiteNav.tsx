// src/components/SiteNav.tsx
// Canonical service navigation for TrainYourAgent.com.
// Used by every top-level page (Index, About, Pricing, Security, Contact,
// Solutions, Technology, etc.). Hover-dropdowns on desktop, accordion on mobile.
//
// Drop-in usage:
//   import SiteNav from "@/components/SiteNav";
//   <SiteNav active="pricing" />
//
// `active` is an optional hint to bold the current section.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";

/* ------------------------------------------------------------------ */
/*  Prism Node logo (matches BrainLogo used everywhere else)          */
/* ------------------------------------------------------------------ */
function BrainLogo({ size = 36 }: { size?: number }) {
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


/* ------------------------------------------------------------------ */
/*  Nav data                                                          */
/* ------------------------------------------------------------------ */
type LinkItem = { label: string; to: string; sub?: string; badge?: string };

// v73-FINAL: Solutions dropdown reframed around the flagship Train Your Agent method.
// /train sits at the top (FLAGSHIP), /everything-ai is the breadth map,
// then 3 visible cornerstone playbooks + "see all 10" + 2 keeper categories.
// Capped at 8 items max per Grok's restraint guidance.
const SOLUTIONS: LinkItem[] = [
  { label: "Train Your Agent · the method", to: "/train",                badge: "FLAGSHIP", sub: "Discovery → Knowledge Base → Fine-tune → Eval → Production. 21 days." },
  { label: "Everything-AI · all capabilities", to: "/everything-ai",                       sub: "The full category map — agents, marketing, training, tooling, builds." },
  { label: "Voice receptionist",             to: "/capabilities/voice-receptionist",       sub: "24/7 phone coverage that books, qualifies, escalates — sounds like your best front-desk." },
  { label: "Intelligent booking agent",      to: "/capabilities/intelligent-booking-agent",sub: "Calendar-aware agent that never double-books and respects every constraint you have." },
  { label: "Lead qualification agent",       to: "/capabilities/lead-qualification-agent", sub: "Inbound triage + routing on the first touch — no more dead lead piles." },
  { label: "See all 10 cornerstone playbooks →", to: "/everything-ai" },
  { label: "Custom AI builds",               to: "/solutions#custom",   sub: "Your specific business problem, scoped, shipped, owned." },
  { label: "Self-serve & developer tools",   to: "/saas",               sub: "Build your own agent. $99/mo. Live today." },
];

const INDUSTRIES: LinkItem[] = [
  { label: "HVAC",         to: "/hvac" },
  { label: "Healthcare",   to: "/healthcare" },
  { label: "Real Estate",  to: "/real-estate" },
  { label: "Legal",        to: "/legal" },
  { label: "E-commerce",   to: "/ecommerce" },
  { label: "Hospitality",  to: "/hospitality" },
  { label: "Auto",         to: "/automotive" },
  { label: "Solar",        to: "/solar" },
  { label: "Roofing",      to: "/roofing" },
  { label: "Spas",         to: "/spas" },
  { label: "More →",       to: "/solutions" },
];

const RESOURCES: LinkItem[] = [
  // v81: voice demo surfaced at top of Resources so it's reachable from
  // every page on the site, not just home. Free in-browser AI agent —
  // the single best "let me try it" lever we have.
  { label: "Hear a live AI agent",  to: "/voice-demo",  badge: "DEMO",     sub: "Talk to the agent in your browser. Web Speech API + Groq Llama 3.3. Free, no signup." },
  // v223: 25 instant-personalize websites gallery (the close-tool money pages)
  { label: "Industry websites",     to: "/websites",    badge: "NEW",      sub: "25 production-grade industry sites you can personalize in 5 seconds — see your business name live." },
  // v252: engineering-facts page — the Senior Engineer POV's #1 ask
  { label: "Architecture",          to: "/architecture", badge: "TECH",    sub: "Multi-LLM fallback, p50/p95 latency, eval harness, observability, security posture. No marketing." },
  // v88: Proof + Live metrics removed from nav per founder direction —
  // the "build-in-public" framing was reading as dev journal rather than
  // established company. Routes still exist for SEO; no longer linked.
  { label: "Customers",      to: "/customers",   sub: "Operators running TrainYourAgent on real production traffic." },
  { label: "Testimonials",   to: "/testimonials",sub: "Quotes from founders, operators, and clinic owners." },
  { label: "Blog",           to: "/blog",        sub: "Operator playbooks + AI infrastructure deep dives." },
  { label: "Learn AI",       to: "/learn",       sub: "Free mini-courses + the Operator Cohort." },
  { label: "Buyer's Guide",  to: "/resources",   sub: "How to evaluate AI vendors without getting taken." },
  { label: "ROI Calculator", to: "/calculators", sub: "Estimate the dollar impact in two minutes." },
  { label: "Case Studies",   to: "/case-studies",sub: "Wins from production agents already shipped." },
  { label: "Newsletter",     to: "/newsletter",  sub: "Weekly. Operators only. No fluff." },
];


/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
type DropdownKey = "solutions" | "industries" | "resources" | null;

export type SiteNavProps = {
  active?: "solutions" | "industries" | "resources" | "pricing" | "about" | "trial" | "comparisons" | "playbooks";
};

export default function SiteNav({ active }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<DropdownKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<DropdownKey>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenDesktop(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // v55C: lock body scroll while mobile drawer is open so the page underneath
  // doesn't scroll-bleed when the user pans the nav.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : prev;
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Hover-intent helpers — short delay before close so users can travel
  // diagonally into the dropdown without it disappearing.
  const openWithIntent = (key: DropdownKey) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDesktop(key);
  };
  const closeWithIntent = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenDesktop(null), 140);
  };


  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/60"
            : "bg-transparent"
        }`}
        style={{
          top: "var(--tya-pill-h, 0px)",
          fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">
              TrainYourAgent
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 text-[14px] text-slate-700">
            {/* Solutions — v69: 8 categories, two-column wide */}
            <DesktopDropdown
              label="Solutions"
              isOpen={openDesktop === "solutions"}
              isActive={active === "solutions"}
              onOpen={() => openWithIntent("solutions")}
              onClose={closeWithIntent}
              items={SOLUTIONS}
              columns={2}
              wide
            />
            {/* Industries */}
            <DesktopDropdown
              label="Industries"
              isOpen={openDesktop === "industries"}
              isActive={active === "industries"}
              onOpen={() => openWithIntent("industries")}
              onClose={closeWithIntent}
              items={INDUSTRIES}
              columns={2}
            />
            {/* v51B: niche playbook system, surfaced top-level */}
            <Link
              to="/playbooks"
              className={`hover:text-[#042C53] inline-flex items-center gap-1.5 ${active === "playbooks" ? "text-[#042C53] font-semibold" : ""}`}
            >
              Playbooks
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[10px] uppercase tracking-[0.1em] font-semibold">
                New
              </span>
            </Link>
            {/* Resources */}
            <DesktopDropdown
              label="Resources"
              isOpen={openDesktop === "resources"}
              isActive={active === "resources"}
              onOpen={() => openWithIntent("resources")}
              onClose={closeWithIntent}
              items={RESOURCES}
            />
            {/* v170: hard <a href> instead of <Link to> so a stale lazy chunk
                cannot white-screen the user mid-navigation to /pricing. */}
            <a
              href="/pricing"
              className={`hover:text-[#042C53] ${active === "pricing" ? "text-[#042C53] font-semibold" : ""}`}
            >
              Pricing
            </a>
            {/* v72: SaaS / Hire / Trial removed from top-level nav to fix Book-a-Call wrap. SaaS lives inside Solutions dropdown. Hire is reachable via /about + footer. Trial CTA lives on /pricing. */}
            <Link
              to="/about"
              className={`hover:text-[#042C53] ${active === "about" ? "text-[#042C53] font-semibold" : ""}`}
            >
              About
            </Link>
            {/* v77: Proof + Live moved into Resources dropdown to de-clutter
                the top bar. Top-level is now 6 items + CTA instead of 8 + CTA. */}
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-5 py-2.5 rounded-full bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] shadow-sm transition whitespace-nowrap min-w-[120px] text-center"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className="block w-5 h-px bg-[#042C53] relative transition-transform"
              style={{
                boxShadow: mobileOpen ? "none" : "0 -6px 0 #042C53, 0 6px 0 #042C53",
                transform: mobileOpen ? "rotate(45deg)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100dvh-64px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col gap-1 text-[15px]">
              <MobileSection
                label="Solutions"
                open={mobileSection === "solutions"}
                onToggle={() => setMobileSection((s) => (s === "solutions" ? null : "solutions"))}
                items={SOLUTIONS}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileSection
                label="Industries"
                open={mobileSection === "industries"}
                onToggle={() => setMobileSection((s) => (s === "industries" ? null : "industries"))}
                items={INDUSTRIES}
                onNavigate={() => setMobileOpen(false)}
              />
              <MobileSection
                label="Resources"
                open={mobileSection === "resources"}
                onToggle={() => setMobileSection((s) => (s === "resources" ? null : "resources"))}
                items={RESOURCES}
                onNavigate={() => setMobileOpen(false)}
              />
              <Link
                to="/playbooks"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg text-[#042C53] font-medium hover:bg-[#F6FAFE] inline-flex items-center gap-2"
              >
                Playbooks
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[10px] uppercase tracking-[0.1em] font-semibold">
                  New
                </span>
              </Link>
              {/* v170: hard <a href> — full-page nav avoids lazy-chunk stale-hash white screen */}
              <a
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg text-[#042C53] font-medium hover:bg-[#F6FAFE]"
              >
                Pricing
              </a>
              {/* v72: mobile SaaS / Hire / Trial removed from top-level. SaaS reachable via Solutions accordion; Hire via /about + footer; Trial via /pricing. */}
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg text-[#042C53] font-medium hover:bg-[#F6FAFE]"
              >
                About
              </Link>
              <Link
                to="/proof"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg text-[#042C53] font-medium hover:bg-[#F6FAFE]"
              >
                Proof
              </Link>
              <Link
                to="/metrics"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg text-[#042C53] font-medium hover:bg-[#F6FAFE] inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live metrics
              </Link>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-[#042C53] text-white text-center font-semibold hover:bg-[#0A3D6E] shadow-sm"
              >
                Book a Call
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer so page content sits below fixed nav (parent pages can opt out
          by setting their own pt-* on the first section, but this prevents
          stacking-context surprises) */}
    </>
  );
}


/* ------------------------------------------------------------------ */
/*  Desktop dropdown                                                  */
/* ------------------------------------------------------------------ */
function DesktopDropdown({
  label,
  isOpen,
  isActive,
  onOpen,
  onClose,
  items,
  columns = 1,
  wide = false,
}: {
  label: string;
  isOpen: boolean;
  isActive?: boolean;
  onOpen: () => void;
  onClose: () => void;
  items: LinkItem[];
  columns?: 1 | 2;
  wide?: boolean;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={`flex items-center gap-1 hover:text-[#042C53] ${
          isActive || isOpen ? "text-[#042C53] font-semibold" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onFocus={onOpen}
        onClick={onOpen}
      >
        {label}
        <span className="text-[10px] mt-0.5 opacity-70" aria-hidden>
          ▾
        </span>
      </button>
      {isOpen && (
        <div
          className={`absolute top-full left-0 pt-3 ${wide && columns === 2 ? "min-w-[560px]" : wide ? "min-w-[440px]" : columns === 2 ? "min-w-[380px]" : "min-w-[280px]"}`}
        >
          <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_-15px_rgba(4,44,83,0.25)] p-2">
            <div className={columns === 2 ? "grid grid-cols-2 gap-1" : "flex flex-col gap-0.5"}>
              {items.map((item) => (
                <Link
                  key={item.label + item.to}
                  to={item.to}
                  className="block rounded-lg px-3 py-2.5 hover:bg-[#F6FAFE] transition group"
                >
                  <div className="text-[14px] font-semibold text-[#042C53] group-hover:text-[#185FA5] flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#042C53] text-white text-[9px] font-bold tracking-[0.12em]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.sub && (
                    <div className="text-[12px] text-slate-600 mt-0.5 leading-snug">
                      {item.sub}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile accordion section                                          */
/* ------------------------------------------------------------------ */
function MobileSection({
  label,
  open,
  onToggle,
  items,
  onNavigate,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  items: LinkItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-3 text-[#042C53] font-semibold"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{label}</span>
        <span className={`text-[#185FA5] transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="pb-2">
          {items.map((item) => (
            <Link
              key={item.label + item.to}
              to={item.to}
              onClick={onNavigate}
              className="block px-5 py-2.5 text-[14px] text-slate-700 hover:text-[#042C53] hover:bg-[#F6FAFE] rounded-lg"
            >
              {item.label}
              {item.sub && (
                <span className="block text-[12px] text-slate-600 leading-snug">
                  {item.sub}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
