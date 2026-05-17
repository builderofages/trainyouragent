// src/pages/Accessibility.tsx — v47A

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";

const EMAIL = "accessibility@trainyouragent.com";

const CURRENT = [
  { h: "Keyboard navigation", p: "All interactive elements across every public route are reachable and operable with keyboard alone. Skip-to-content links appear on every page; tab order follows visual reading order; focus is trapped correctly inside modals and dialogs." },
  { h: "Screen reader support", p: "Interactive controls expose accessible names via aria-label, aria-labelledby, or visible text. Form fields are programmatically associated with labels. Icon-only buttons include text alternatives. Live regions announce form errors and chat replies." },
  { h: "Color contrast", p: "All text and interactive elements meet WCAG 2.1 AA contrast minimums — 4.5:1 for body copy, 3:1 for large text and UI components. Brand primaries (#042C53 navy, #185FA5 blue) hit AAA against white." },
  { h: "Motion and animation", p: "Decorative motion respects prefers-reduced-motion. Our SectionDivider animation, hero gradients, and page transitions all degrade to static rendering when the OS-level setting is on. No content auto-plays, auto-scrolls, or auto-rotates without user control." },
  { h: "Touch targets", p: "Interactive elements have a minimum 44×44 px hit area on touch screens, including footer links and inline action buttons." },
  { h: "Focus indicators", p: "All focusable elements have a visible focus indicator with at least 3:1 contrast against adjacent colors. Default browser outlines are preserved where they meet the standard; custom rings are applied where they don't." },
];

const GAPS = [
  "Some decorative SVG illustrations on landing pages lack descriptive alt-text fallbacks — being remediated in v48.",
  "The interactive ROI calculator does not yet announce calculated values to screen readers — being fixed in v47B with an aria-live region.",
  "A handful of legacy industry pages still use a 4.4:1 contrast ratio on a single secondary-text color; the next style-token migration will lift those to AA.",
];

export default function Accessibility() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Accessibility · TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    injectJsonLdMany([
      { id: "a11y-org", data: organizationLd() },
      { id: "a11y-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Trust Center", url: "/trust-center" }, { name: "Accessibility", url: "/accessibility" },
      ]) },
    ]);
  }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Accessibility statement</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            We build for <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>everyone.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            TrainYourAgent targets WCAG 2.1 Level AA across every public surface. This page is the honest snapshot of where we are, where we fall short, and how to reach us if something on this site doesn't work for you.
          </p>
          <p className="mt-3 text-[13px] text-slate-500">
            Last self-audited: 2026-05-16. Next planned third-party audit: Q1 2027.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Current state</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            What works today.
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {CURRENT.map((c) => (
              <article key={c.h} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-[18px] font-semibold text-[#042C53]">{c.h}</h3>
                <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">{c.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Known gaps</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-6">
            Where we're not yet there.
          </h2>
          <p className="text-[14px] text-slate-600 mb-6">
            We track every accessibility issue as a first-class bug. The list below is what we know about and have prioritized for upcoming releases.
          </p>
          <ul className="space-y-3">
            {GAPS.map((g) => (
              <li key={g} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-[14px] text-slate-700">
                {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Report an issue</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">
            Found something we missed?
          </h2>
          <p className="text-[15px] text-slate-700 leading-relaxed">
            Email <a href={`mailto:${EMAIL}`} className="underline text-[#185FA5]">{EMAIL}</a> with the page URL, the assistive technology you're using (screen reader name + version, switch device, voice control, etc.), and what failed. We respond within 2 business days and ship critical accessibility fixes within 7 days.
          </p>
          <p className="mt-4 text-[13px] text-slate-600">
            We treat accessibility regressions as Severity-2 incidents — same priority as a feature that's broken for everyone.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Looking ahead</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">Roadmap.</h2>
          <ul className="space-y-3 text-[14.5px] text-slate-700">
            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#185FA5] flex-shrink-0" /><span>Q3 2026 — complete remediation of the known gaps listed above.</span></li>
            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#185FA5] flex-shrink-0" /><span>Q4 2026 — internal automated a11y scanning wired into CI for every PR.</span></li>
            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#185FA5] flex-shrink-0" /><span>Q1 2027 — first annual third-party WCAG audit. Report published here.</span></li>
            <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#185FA5] flex-shrink-0" /><span>Ongoing — accessibility as a release-blocker for any new public-facing surface.</span></li>
          </ul>
          <div className="mt-10 flex gap-3 flex-wrap">
            <Link to="/trust-center" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#042C53] text-[#042C53] font-semibold text-[14px] hover:bg-[#042C53] hover:text-white">Back to Trust Center</Link>
            <Link to="/security" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-semibold text-[14px] hover:border-[#185FA5] hover:text-[#185FA5]">Security →</Link>
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
