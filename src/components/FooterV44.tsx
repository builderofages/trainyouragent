// src/components/FooterV44.tsx
// v44: full-width navy footer with 4-column grid + status pill.
// v76-D: added Legal column (11 docs), collapsible on mobile to avoid bloat.

import { useState } from "react";
import { Link } from "react-router-dom";

const PRODUCT = [
  { label: "Solutions", to: "/solutions" },
  { label: "Playbooks (15 niches)", to: "/playbooks" },
  // v223: 25 instant-personalize industry sites — the close tool
  { label: "Industry sites (25 niches)", to: "/websites" },
  { label: "Pricing", to: "/pricing" },
  // v71: productized self-serve SaaS catalog
  { label: "SaaS catalog", to: "/saas" },
  { label: "Agent Builder ($99/mo)", to: "/saas/agent-builder" },
  // v71: direct-hire (custom build engagement)
  { label: "Hire the operator", to: "/hire" },
  { label: "Trial", to: "/trial" },
  { label: "Integrations", to: "/integrations" },
  { label: "Live demos", to: "/demos" },
  { label: "Free tools", to: "/tools" },
  { label: "AI website audit", to: "/tools/website-audit" },
];

const RESOURCES = [
  { label: "Docs", to: "/docs" },
  { label: "API docs", to: "/api-docs" },
  { label: "Customers", to: "/customers" },
  { label: "Case studies", to: "/case-studies" },
  { label: "Blog", to: "/blog" },
  { label: "Learn AI", to: "/learn" },
  { label: "Glossary", to: "/glossary" },
  { label: "Founder log", to: "/founder-log" },
  { label: "Vendor matrix", to: "/tools/vendor-matrix" },
  { label: "Cities (Local)", to: "/local" },
  { label: "Buyer's guide", to: "/resources" },
  { label: "State of AI Ops 2026", to: "/report/state-of-ai-ops-2026" },
  // v59: real-time public event stream
  { label: "Live (real-time stream)", to: "/live" },
];

const COMPANY = [
  { label: "About", to: "/about" },
  { label: "Mission", to: "/mission" },
  { label: "Team", to: "/team" },
  { label: "Careers", to: "/careers" },
  { label: "Invest", to: "/invest" },
  // v78: consolidated the two affiliate links into one. The old
  // "Affiliate" (singular) entry pointed at /affiliate-program (the
  // legacy v49 page) and "Affiliates (new)" pointed at /affiliates
  // (the canonical v76-c page) — having both was duplicative and the
  // legacy slug 404'd for some visitors. Single canonical link now.
  { label: "Affiliate program", to: "/affiliates" },
  { label: "Press", to: "/press" },
  { label: "Speaking", to: "/speaking" },
  { label: "Podcast", to: "/podcast-guest" },
  { label: "Media kit", to: "/media-kit" },
  // v76-a: customer portal access — direct URL or footer-only (not in top nav).
  { label: "Customer login", to: "/portal/login" },
];

const TRUST = [
  { label: "Proof", to: "/proof" },
  { label: "How we win (no testimonials)", to: "/how-we-win-without-testimonials" },
  { label: "Trust Center", to: "/trust-center" },
  { label: "Security", to: "/security" },
  { label: "Compliance", to: "/compliance" },
  { label: "Accessibility", to: "/accessibility" },
  { label: "Uptime", to: "/uptime" },
  { label: "Public metrics", to: "/metrics" },
];

// v76-D: complete legal surface — 11 docs + index, all under /legal/*.
const LEGAL = [
  { label: "Legal index", to: "/legal" },
  { label: "Terms of Service", to: "/legal/terms" },
  { label: "Privacy Policy", to: "/legal/privacy" },
  { label: "Cookie Policy", to: "/legal/cookies" },
  { label: "Data Processing Agreement", to: "/legal/dpa" },
  { label: "Acceptable Use Policy", to: "/legal/aup" },
  { label: "Refund Policy", to: "/legal/refund" },
  { label: "AI Use Policy", to: "/legal/ai-use" },
  { label: "Service Level Agreement", to: "/legal/sla" },
  { label: "Sub-processors", to: "/legal/sub-processors" },
  { label: "GDPR Notice", to: "/legal/gdpr" },
  { label: "CCPA / CPRA Notice", to: "/legal/ccpa" },
];

// v57A: internal-only links — surfaced for the team, not for SEO traffic.
const INTERNAL = [
  { label: "Email domain verify", to: "/verify-email-domain" },
];

const CONNECT = [
  { label: "Book a call", to: "https://cal.com/trainyouragent/30min", ext: true },
  { label: "Contact", to: "/contact" },
  { label: "Newsletter", to: "/newsletter" },
  { label: "Status", to: "/status" },
  { label: "Community", to: "/community" },
  { label: "Partners", to: "/partners" },
  { label: "White-label", to: "/whitelabel" },
  { label: "Reseller", to: "/reseller" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Customer portal", to: "/portal/login" },
];

function PrismMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#E6F1FB" }}
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

export default function FooterV44() {
  return (
    <footer
      className="bg-[#042C53] text-white"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14 mb-safe">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-x-6 gap-y-8 md:gap-10">
          {/* Brand block spans full width on mobile so its long paragraph reads cleanly */}
          <style>{`@media (max-width: 767px) { footer .brand-col-mobile-full { grid-column: 1 / -1; } }`}</style>
          {/* Brand block */}
          <div className="brand-col-mobile-full">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4" aria-label="TrainYourAgent home">
              <PrismMark size={32} />
              <span className="text-[17px] font-semibold tracking-tight">TrainYourAgent</span>
            </Link>
            <p className="text-[14px] text-white/80 leading-relaxed max-w-xs">
              The operating layer for everything AI in your business. Voice agents, GTM
              infrastructure, brand systems — built by operators, not a chatbot company.
            </p>
            {/* v46a: real trust details — founder, email, location */}
            <div className="mt-5 space-y-1.5 text-[13px] text-white/75">
              <div>
                Founded 2022 · <span className="text-white">Tampa Bay, FL</span>
              </div>
              <div>
                <a href="mailto:alexander@trainyouragent.com" className="hover:text-white underline decoration-white/30">
                  alexander@trainyouragent.com
                </a>
              </div>
              <div>Replies within 4 business hours</div>
            </div>
            <Link
              to="/status"
              className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium hover:bg-white/10 min-h-[28px]"
              aria-label="System status"
            >
              <span className="relative inline-flex w-2 h-2" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              All systems operational
            </Link>
          </div>

          <Col title="Product" items={PRODUCT} />
          <Col title="Resources" items={RESOURCES} />
          <Col title="Company" items={COMPANY} />
          <Col title="Trust" items={TRUST} />
          <Col title="Connect" items={CONNECT} />
          {/* v76-D: collapsible Legal column to avoid mobile footer bloat. */}
          <CollapsibleCol title="Legal" items={LEGAL} />
          {/* v78: "Internal tools" column hidden from prod — was leaking
              admin-only utilities like /verify-email-domain to public site
              visitors. Only renders in dev. */}
          {import.meta.env.DEV && (
            <Col title="Internal tools" items={INTERNAL} />
          )}
        </div>

        {/* v197 — sister-site nod. Tiny line, no logo, no chest-thumping.
             TYA is the focus; CNNCT just gets a quiet acknowledgement. */}
        <div className="mt-10 pt-5 border-t border-white/10 text-[12px] text-white/45">
          Sister community — <Link to="/cnnct" className="hover:text-white/80 underline decoration-white/20 underline-offset-2">CNNCT.ai</Link>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-[12.5px] text-white/65">
          <div>© {new Date().getFullYear()} TrainYourAgent LLC · Tampa Bay, FL · Built by humans</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/legal/privacy" className="hover:text-white min-h-[24px] inline-block">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-white min-h-[24px] inline-block">Terms</Link>
            <Link to="/legal" className="hover:text-white min-h-[24px] inline-block">Legal</Link>
            <Link to="/trust-center" className="hover:text-white min-h-[24px] inline-block">Trust</Link>
            <Link to="/security" className="hover:text-white min-h-[24px] inline-block">Security</Link>
            <Link to="/status" className="hover:text-white min-h-[24px] inline-block">Status</Link>
            <Link to="/legal/cookies" className="hover:text-white min-h-[24px] inline-block">Cookies</Link>
            <Link to="/metrics" className="hover:text-white min-h-[24px] inline-block">Metrics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, items }: { title: string; items: { label: string; to: string; ext?: boolean }[] }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#9BC3E8] mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {items.map((i) =>
          i.ext ? (
            <li key={i.label}>
              <a
                href={i.to}
                target="_blank"
                rel="noopener"
                className="text-[13.5px] text-white/80 hover:text-white inline-block min-h-[24px]"
              >
                {i.label}
              </a>
            </li>
          ) : (
            <li key={i.label}>
              <Link
                to={i.to}
                className="text-[13.5px] text-white/80 hover:text-white inline-block min-h-[24px]"
              >
                {i.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

// v76-D: same as Col but collapses on mobile behind a chevron button to keep
// the footer compact on small screens. On md+ it renders open and the button
// is hidden.
function CollapsibleCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string; ext?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {/* Mobile: button toggles open. Desktop: static header. */}
      <button
        type="button"
        className="md:cursor-default md:pointer-events-none w-full text-left flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#9BC3E8] mb-4 min-h-[24px]"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`footer-col-${title.toLowerCase()}`}
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="md:hidden text-[14px] leading-none transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          {"▾"}
        </span>
      </button>
      <ul
        id={`footer-col-${title.toLowerCase()}`}
        className={`space-y-2.5 ${open ? "block" : "hidden"} md:block`}
      >
        {items.map((i) =>
          i.ext ? (
            <li key={i.label}>
              <a
                href={i.to}
                target="_blank"
                rel="noopener"
                className="text-[13.5px] text-white/80 hover:text-white inline-block min-h-[24px]"
              >
                {i.label}
              </a>
            </li>
          ) : (
            <li key={i.label}>
              <Link
                to={i.to}
                className="text-[13.5px] text-white/80 hover:text-white inline-block min-h-[24px]"
              >
                {i.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
