// src/pages/tools/ToolLayout.tsx
// v41: shared chrome for the 5 free tools under /tools.
// Brand tokens: navy #042C53, blue #185FA5, Inter Tight + Playfair italic.

import { type ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";

const FONT = "'Inter Tight', system-ui, -apple-system, sans-serif";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";

export const NAVY = "#042C53";
export const BLUE = "#185FA5";
export const TINT = "#E6F1FB";

type Props = {
  eyebrow: string;
  title: string;
  italicTail?: string; // playfair italic tail rendered after title
  subtitle?: string;
  children: ReactNode;
};

// v61: titles passed in sometimes end with an em-dash (because the visual
// hero composes title + italicTail). Strip trailing dash/whitespace before
// composing the <title> so we never produce "Foo — — TrainYourAgent Tools".
function cleanTitle(t: string, tail?: string): string {
  const base = t.replace(/[\s—–\-:·]+$/u, "").trim();
  const t2 = tail ? `${base} ${tail.replace(/[\s—–\-:·]+$/u, "").trim()}` : base;
  return t2.replace(/\s+/g, " ").trim();
}

export default function ToolLayout({ eyebrow, title, italicTail, subtitle, children }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = `${cleanTitle(title, italicTail)} — TrainYourAgent Tools`;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    // v48: dynamic OG image for every tool page
    const cleanedTitle = cleanTitle(title, italicTail);
    const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent(cleanedTitle)}&subtitle=${encodeURIComponent(subtitle || "Free tool — TrainYourAgent")}&type=tool`;
    const sM = (sel: string, a: "name"|"property", k: string, v: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(a, k); document.head.appendChild(el); }
      el.setAttribute("content", v);
    };
    sM("meta[property='og:title']", "property", "og:title", `${cleanedTitle} — TrainYourAgent`);
    if (subtitle) sM("meta[property='og:description']", "property", "og:description", subtitle);
    sM("meta[property='og:image']", "property", "og:image", ogImage);
    sM("meta[property='og:image:width']", "property", "og:image:width", "1200");
    sM("meta[property='og:image:height']", "property", "og:image:height", "630");
    sM("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    sM("meta[name='twitter:image']", "name", "twitter:image", ogImage);
  }, [title, italicTail, subtitle]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: FONT }}>
      {/* Top bar — v61: PrismNode glyph + wordmark for visual consistency with SiteNav */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="TrainYourAgent home"
          >
            <span
              className="inline-flex items-center justify-center flex-shrink-0"
              style={{ width: 26, height: 26, color: NAVY }}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
                <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
                <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
                <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold tracking-tight" style={{ color: NAVY }}>
              TrainYourAgent
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-[13px]" aria-label="Tools nav">
            <Link to="/" className="text-slate-700 hover:text-[#042C53]">Back to site</Link>
            <Link to="/tools" className="text-slate-700 hover:text-[#042C53]">All tools</Link>
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-full bg-[#042C53] text-white hover:bg-[#0A3D6E] min-h-[36px] inline-flex items-center"
            >
              Book a call
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-6">
        <div
          className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-4"
          style={{ color: BLUE }}
        >
          {eyebrow}
        </div>
        <h1
          className="text-[32px] sm:text-[44px] font-semibold leading-[1.05] tracking-[-0.02em]"
          style={{ color: NAVY }}
        >
          {title}
          {italicTail && (
            <>
              {" "}
              <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500, color: BLUE }}>
                {italicTail}
              </span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mt-4 text-[16px] sm:text-[18px] text-slate-700 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </section>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">{children}</main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-[12px] text-slate-500 flex flex-wrap gap-4 justify-between">
          <span>© {new Date().getFullYear()} TrainYourAgent · Free tools</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-slate-700">About</Link>
            <Link to="/pricing" className="hover:text-slate-700">Pricing</Link>
            <Link to="/contact" className="hover:text-slate-700">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
