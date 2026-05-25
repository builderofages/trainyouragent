// v166: graceful empty-state always shows productive CTA instead of dead pill.
import { useEffect, useState } from "react";

/**
 * TrustpilotWidget (v166)
 *
 * Scaffold for the Trustpilot review widget. Stays hidden until at least
 * one published review exists on our profile so we never display an empty
 * "0 reviews · No rating yet" embed that screams "we have no customers."
 *
 * Strategy:
 * - We just created the Trustpilot account. Zero reviews on day 1.
 * - Asking founding-cohort customers to leave reviews starting at the
 *   90-day mark.
 * - When the first review lands, set VITE_TRUSTPILOT_VISIBLE=1 in Vercel
 *   env (or flip `forceVisible` here to true) and the real Trustpilot
 *   TrustBox embed renders.
 * - Until then this component renders a small "Reviews coming soon"
 *   pill that links to the empty profile so people can find us when
 *   they search externally.
 *
 * Set VITE_TRUSTPILOT_BUSINESSUNIT_ID when you have your real
 * BusinessUnit ID from Trustpilot dashboard → Settings → Profile.
 *
 * Embed reference: https://support.trustpilot.com/hc/en-us/articles/115011421468
 */

const PROFILE_URL = "https://www.trustpilot.com/review/trainyouragent.com";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: Element, immediate?: boolean) => void };
  }
}

export default function TrustpilotWidget({
  forceVisible = false,
  variant = "card",
}: {
  forceVisible?: boolean;
  variant?: "card" | "inline-pill";
}) {
  const visible =
    forceVisible || import.meta.env.VITE_TRUSTPILOT_VISIBLE === "1";
  const businessUnitId =
    import.meta.env.VITE_TRUSTPILOT_BUSINESSUNIT_ID || "";
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!visible || !businessUnitId) return;
    if (window.Trustpilot) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector(
      'script[src*="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true), {
        once: true,
      });
      return;
    }
    const s = document.createElement("script");
    s.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    s.async = true;
    s.onload = () => setScriptReady(true);
    document.head.appendChild(s);
  }, [visible, businessUnitId]);

  // v166: Pre-launch state — graceful empty-state with a PRODUCTIVE CTA
  // ("be one of the first 5 testimonials"). Never a dead pill, never an
  // empty embed, never fake stars. The widget always sells something.
  if (!visible || !businessUnitId) {
    if (variant === "inline-pill") {
      return (
        <a
          href="/apply"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6FAFE] border border-[#185FA5]/30 text-[12px] text-[#042C53] hover:border-[#042C53] hover:bg-white transition-colors font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          First 5 testimonials = free · be one of them &rarr;
        </a>
      );
    }
    return (
      <div className="rounded-2xl border border-[#185FA5]/25 bg-gradient-to-br from-[#F6FAFE] to-white p-6 sm:p-7 text-center shadow-[0_2px_20px_-8px_rgba(24,95,165,0.15)]">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="relative inline-flex w-2 h-2" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">
            Founding cohort · open seats
          </span>
        </div>
        <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#042C53] mb-2 leading-tight">
          First 5 testimonials = free build credit
        </h3>
        <p className="text-[14px] text-slate-700 leading-relaxed mb-4 max-w-[440px] mx-auto">
          We will not display fake stars. We are deliberately taking only 5
          founding-cohort customers per quarter — and crediting their build
          fee in exchange for a public review at the 90-day mark.
        </p>
        <a
          href="/apply"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#185FA5] transition-colors"
        >
          Apply for the founding cohort &rarr;
        </a>
        <p className="text-[11px] text-slate-500 mt-3">
          Our Trustpilot profile is{" "}
          <a
            className="underline decoration-[#042C53]/40 hover:text-[#042C53]"
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          — open and ready.
        </p>
      </div>
    );
  }

  // Live state — real Trustpilot TrustBox (Micro Review Count, light theme)
  return (
    <div
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="5419b6ffb0d04a076446a9af"
      data-businessunit-id={businessUnitId}
      data-style-height="20px"
      data-style-width="100%"
      data-theme="light"
      ref={(el) => {
        if (el && scriptReady && window.Trustpilot) {
          window.Trustpilot.loadFromElement(el, true);
        }
      }}
    >
      <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
