// src/pages/ServerError.tsx
// v52a: Branded 500 page. Wired to /500 in App.tsx.
// Used as the fallback when a server-rendered route blows up. We also set
// <meta name="robots" content="noindex"> so crawlers don't index error pages.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

function PrismMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="#042C53" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
      <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
      <circle cx="32" cy="32" r="3" fill="#042C53" stroke="none" />
    </svg>
  );
}

const ESCAPES = [
  { to: "/", label: "Home", note: "Start over from the top." },
  { to: "/playbooks", label: "Playbooks", note: "15 niche operator playbooks." },
  { to: "/tools", label: "Free tools", note: "ROI calculator, prompt critic, more." },
  { to: "/book", label: "Book a call", note: "Talk to a real human (Alexander)." },
];

const MAILTO = `mailto:hello@trainyouragent.com?subject=${encodeURIComponent(
  "500 error on TrainYourAgent"
)}&body=${encodeURIComponent(
  "Hi Alexander,\n\nI hit a 500 error on this URL: " +
    (typeof location !== "undefined" ? location.href : "(unknown)") +
    "\n\nWhat I was trying to do:\n\n\nThanks!\n"
)}`;

export default function ServerError() {
  useEffect(() => {
    document.title = "500 — TrainYourAgent";
    let robots = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const prev = robots.getAttribute("content") || "";
    robots.setAttribute("content", "noindex, nofollow");
    return () => {
      robots?.setAttribute("content", prev || "index, follow");
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B] flex flex-col"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <SiteNav />

      <main id="main" className="flex-1 flex items-center justify-center px-5 py-20 pt-32">
        <div className="max-w-3xl w-full text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            500 · Server error
          </div>
          <h1 className="text-[56px] sm:text-[88px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Something{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              went sideways.
            </span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-600 leading-relaxed max-w-xl mx-auto">
            Alexander has been notified. Try refreshing the page first — if it keeps breaking,
            here are four places to land while we sort it out.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-3 text-left">
            {ESCAPES.map((e) => (
              <Link
                key={e.to}
                to={e.to}
                className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#185FA5] hover:bg-[#F6FAFE] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><PrismMark size={20} /></div>
                  <div>
                    <div className="text-[16px] font-semibold text-[#042C53] group-hover:text-[#185FA5] transition">
                      {e.label}
                    </div>
                    <div className="text-[13px] text-slate-500 mt-0.5">{e.note}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[14px]">
            <button
              type="button"
              onClick={() => location.reload()}
              className="px-5 py-2.5 rounded-full bg-[#042C53] text-white font-semibold hover:bg-[#0A3E73] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#185FA5]/30"
            >
              Refresh the page
            </button>
            <a
              href={MAILTO}
              className="px-5 py-2.5 rounded-full border border-slate-300 text-[#042C53] font-semibold hover:border-[#185FA5] hover:bg-[#F6FAFE] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
            >
              Report this issue
            </a>
          </div>

          <p className="mt-10 text-[12px] text-slate-400">
            If you got here by clicking a link, that's on us — let us know and we'll fix it.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between text-[12px] text-slate-500">
          <div className="flex items-center gap-2">
            <PrismMark size={20} />
            <span>© 2026 TrainYourAgent LLC</span>
          </div>
          <span>Tampa Bay, FL</span>
        </div>
      </footer>
    </div>
  );
}
