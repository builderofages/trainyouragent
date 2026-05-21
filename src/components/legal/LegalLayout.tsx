// src/components/legal/LegalLayout.tsx
// v76-D: shared layout for /legal/* pages.
// Navy hero w/ eyebrow + h1 + last-updated, ToC, plain-English summary slot,
// formal legal body, related-docs cross-link, back-to-index.

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import FooterV44 from "@/components/FooterV44";

const CAL_URL = "https://cal.com/trainyouragent/30min";

export type TocItem = { id: string; label: string };

export interface LegalLayoutProps {
  slug: string;                  // e.g. "terms"
  pageTitle: string;             // e.g. "Terms of Service"
  eyebrow?: string;              // overrides default "LEGAL · <PAGE NAME>"
  lastUpdated: string;           // ISO or human, displayed as-is
  reviewedDate?: string;         // for the disclaimer line
  summary: React.ReactNode;      // plain-English summary at top
  toc?: TocItem[];               // table of contents
  children: React.ReactNode;     // formal body
  related?: Array<{ to: string; label: string; blurb?: string }>;
  metaDescription?: string;
}

function BrainLogo({ size = 40 }: { size?: number }) {
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

export default function LegalLayout({
  slug,
  pageTitle,
  eyebrow,
  lastUpdated,
  reviewedDate,
  summary,
  toc,
  children,
  related,
  metaDescription,
}: LegalLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const canonical = useMemo(
    () => `https://trainyouragent.com/legal/${slug}`,
    [slug],
  );

  const effectiveEyebrow =
    eyebrow ?? `LEGAL · ${pageTitle.toUpperCase()}`;

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <Helmet>
        <title>{`${pageTitle} | TrainYourAgent`}</title>
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${pageTitle} | TrainYourAgent`} />
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Top nav (kept simple — full nav lives on marketing pages) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/legal" className="hover:text-[#042C53]">Legal index</Link>
            <Link to="/solutions" className="hover:text-[#042C53]">Solutions</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E]"
            >
              Book a call
            </a>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span
              className="block w-4 h-px bg-[#042C53] relative"
              style={{
                boxShadow: mobileOpen
                  ? "none"
                  : "0 -5px 0 #042C53, 0 5px 0 #042C53",
                transform: mobileOpen ? "rotate(45deg)" : "none",
              }}
            />
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 px-5 py-3 space-y-3 text-[14px] text-slate-700 bg-white">
            <Link to="/legal" className="block">Legal index</Link>
            <Link to="/solutions" className="block">Solutions</Link>
            <Link to="/security" className="block">Security</Link>
            <Link to="/pricing" className="block">Pricing</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="block">Book a call</a>
          </div>
        )}
      </nav>

      {/* Navy hero */}
      <header className="bg-[#042C53] text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.22em] font-semibold text-[#9BC3E8] mb-4">
            {effectiveEyebrow}
          </div>
          <h1 className="text-[30px] sm:text-[44px] md:text-[56px] leading-[1.06] sm:leading-[1.04] tracking-tight font-semibold mb-5 h1-balance break-words">
            {pageTitle}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/80">
            <div>
              Last updated:{" "}
              <span className="text-white font-medium">{lastUpdated}</span>
            </div>
            {reviewedDate ? (
              <div>
                Last reviewed:{" "}
                <span className="text-white font-medium">{reviewedDate}</span>
              </div>
            ) : null}
            <Link to="/legal" className="text-[#9BC3E8] hover:text-white underline decoration-white/30">
              All legal documents
            </Link>
          </div>
        </div>
      </header>

      {/* Disclaimer band */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3 text-[13px] text-amber-900 leading-snug">
          <strong>Plain-English disclaimer.</strong> This is the current version.
          We&apos;re a small company. Document last reviewed{" "}
          {reviewedDate ?? lastUpdated}. Recommend running by your own counsel
          for your jurisdiction before relying on any clause for a binding
          obligation.
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* Plain-English summary card */}
        <section
          aria-label="Plain-English summary"
          className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 mb-10"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">
            Plain-English summary
          </div>
          <div className="text-[15.5px] leading-[1.7] text-slate-800 space-y-3">
            {summary}
          </div>
        </section>

        {/* ToC */}
        {toc && toc.length > 0 ? (
          <nav
            aria-label="Table of contents"
            className="mb-10 rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">
              On this page
            </div>
            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[14px] text-slate-700 list-decimal pl-5">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="hover:text-[#042C53] underline decoration-slate-300 hover:decoration-[#042C53]"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {/* Body */}
        <article
          className="legal-prose-body prose prose-slate max-w-none text-[15px] sm:text-[16px] leading-[1.7] sm:leading-[1.75] text-slate-700
                     prose-headings:text-[#042C53] prose-headings:font-semibold
                     prose-h2:text-[20px] sm:prose-h2:text-[24px] prose-h2:mt-10 sm:prose-h2:mt-12 prose-h2:mb-3
                     prose-h3:text-[17px] sm:prose-h3:text-[18px] prose-h3:mt-6 sm:prose-h3:mt-7 prose-h3:mb-2
                     prose-strong:text-[#042C53]
                     prose-a:text-[#185FA5] prose-a:no-underline hover:prose-a:underline
                     prose-a:break-words
                     prose-p:break-words
                     prose-table:text-[13px] sm:prose-table:text-[14px] prose-th:bg-slate-50 prose-th:text-[#042C53]
                     prose-li:my-1
                     prose-hr:my-10"
        >
          {children}
        </article>

        {/* Related docs */}
        {related && related.length > 0 ? (
          <section className="mt-16 pt-8 border-t border-slate-200">
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-4">
              Related documents
            </div>
            <ul className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <li key={r.to} className="rounded-xl border border-slate-200 bg-white p-4">
                  <Link
                    to={r.to}
                    className="text-[15px] font-semibold text-[#042C53] hover:underline"
                  >
                    {r.label}
                  </Link>
                  {r.blurb ? (
                    <div className="text-[13.5px] text-slate-600 mt-1.5 leading-snug">
                      {r.blurb}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 text-[13px] text-slate-500">
          Questions about this document? Email{" "}
          <a
            href="mailto:legal@trainyouragent.com"
            className="text-[#185FA5] hover:underline"
          >
            legal@trainyouragent.com
          </a>{" "}
          or visit{" "}
          <Link to="/legal" className="text-[#185FA5] hover:underline">
            the legal index
          </Link>
          .
        </div>
      </main>

      <FooterV44 />
    </div>
  );
}
