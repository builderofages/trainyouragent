// src/components/FooterV44.tsx
// v44: full-width navy footer with 4-column grid + status pill.

import { Link } from "react-router-dom";

const PRODUCT = [
  { label: "Solutions", to: "/solutions" },
  { label: "Pricing", to: "/pricing" },
  { label: "Trial", to: "/trial" },
  { label: "Integrations", to: "/integrations" },
  { label: "Live demos", to: "/demos" },
  { label: "Free tools", to: "/tools" },
];

const RESOURCES = [
  { label: "Customers", to: "/customers" },
  { label: "Case studies", to: "/case-studies" },
  { label: "Blog", to: "/blog" },
  { label: "Learn AI", to: "/learn" },
  { label: "Buyer's guide", to: "/resources" },
  { label: "State of AI Ops 2026", to: "/report/state-of-ai-ops-2026" },
];

const COMPANY = [
  { label: "About", to: "/about" },
  { label: "Team", to: "/team" },
  { label: "Careers", to: "/careers" },
  { label: "Press", to: "/press" },
  { label: "Security", to: "/security" },
  { label: "Public metrics", to: "/metrics" },
];

const CONNECT = [
  { label: "Book a call", to: "https://cal.com/trainyouragent/30min", ext: true },
  { label: "Contact", to: "/contact" },
  { label: "Newsletter", to: "/newsletter" },
  { label: "Status", to: "/status" },
  { label: "Community", to: "/community" },
  { label: "Partners", to: "/partners" },
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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10">
          {/* Brand block */}
          <div>
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
          <Col title="Connect" items={CONNECT} />
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-[12.5px] text-white/65">
          <div>© {new Date().getFullYear()} TrainYourAgent LLC · Tampa Bay, FL · Built by humans</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-white min-h-[24px] inline-block">Privacy</Link>
            <Link to="/terms" className="hover:text-white min-h-[24px] inline-block">Terms</Link>
            <Link to="/security" className="hover:text-white min-h-[24px] inline-block">Security</Link>
            <Link to="/status" className="hover:text-white min-h-[24px] inline-block">Status</Link>
            <Link to="/cookie-policy" className="hover:text-white min-h-[24px] inline-block">Cookies</Link>
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
