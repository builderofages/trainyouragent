import { useEffect, useState } from "react";

/**
 * TrustpilotWidget (v134)
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

  // Pre-launch state — small honest pill, no fake stars, no zero-review embed
  if (!visible || !businessUnitId) {
    if (variant === "inline-pill") {
      return (
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[12px] text-slate-600 hover:border-[#042C53]/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Trustpilot reviews coming soon · we just opened the account
        </a>
      );
    }
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">
          Trustpilot
        </div>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          Reviews start landing as our founding cohort hits the 90-day mark.
          Our public profile is{" "}
          <a
            className="underline decoration-[#042C53]/40 hover:text-[#042C53]"
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          — open and ready for the first review.
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
