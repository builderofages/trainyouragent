// src/components/PoweredByBadges.tsx — v167
//
// Killed the v107 dark-spatial 3D grid (user audit: "looks generic, ruins
// premium feel"). Premium = restraint, not spatial AR theater on a white-bg
// editorial site. Now: a tight, single-rail runtime strip that matches the
// Index hero treatment — cream/white background, navy text, brand-color
// monochrome marks, hover-only chromatic ignite. Stripe/Linear/Vercel
// footer aesthetic, not "Bento dashboard demo."

import { useEffect, useRef } from "react";

type Tool = {
  name: string;
  slug: string;     // simpleicons.org slug
  use: string;
  href: string;
};

const TOOLS: Tool[] = [
  { name: "Anthropic",  slug: "anthropic",  use: "Reasoning",       href: "https://www.anthropic.com" },
  { name: "Vercel",     slug: "vercel",     use: "Edge runtime",    href: "https://vercel.com" },
  { name: "ElevenLabs", slug: "elevenlabs", use: "Voice synthesis", href: "https://elevenlabs.io" },
  { name: "Twilio",     slug: "twilio",     use: "Telephony",       href: "https://www.twilio.com" },
  { name: "Stripe",     slug: "stripe",     use: "Payments",        href: "https://stripe.com" },
  { name: "OpenAI",     slug: "openai",     use: "TTS fallback",    href: "https://openai.com" },
  { name: "Supabase",   slug: "supabase",   use: "Database",        href: "https://supabase.com" },
  { name: "Cloudflare", slug: "cloudflare", use: "CDN + DNS",       href: "https://cloudflare.com" },
  { name: "GitHub",     slug: "github",     use: "Version control", href: "https://github.com" },
  { name: "Groq",       slug: "groq",       use: "LLM fallback",    href: "https://groq.com" },
  { name: "Resend",     slug: "resend",     use: "Email",           href: "https://resend.com" },
  { name: "Linear",     slug: "linear",     use: "Tracker",         href: "https://linear.app" },
];

export type PoweredByBadgesProps = {
  eyebrow?: string;
  headline?: string;
  className?: string;
  variant?: "compact" | "grid"; // legacy prop, ignored
};

export default function PoweredByBadges({
  eyebrow = "PRODUCTION RUNTIME",
  headline,
  className = "",
}: PoweredByBadgesProps) {
  const railRef = useRef<HTMLDivElement>(null);

  // v167: subtle scroll-reveal — fade + lift, no spatial theatrics
  useEffect(() => {
    const el = railRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && el.classList.add("tya-rail--in")),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className={`relative py-20 sm:py-24 px-5 sm:px-8 ${className}`}
      aria-label="Production runtime stack"
      style={{ background: "#FAFBFC", borderTop: "1px solid rgba(4,44,83,0.06)", borderBottom: "1px solid rgba(4,44,83,0.06)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <div
            className="inline-block text-[10.5px] uppercase font-semibold mb-3"
            style={{ letterSpacing: "0.22em", color: "#185FA5", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            {eyebrow}
          </div>
          <h2
            className="text-[26px] sm:text-[34px] leading-[1.1] tracking-tight font-semibold"
            style={{ color: "#042C53", fontFamily: "'Inter Tight', system-ui, sans-serif" }}
          >
            Real infrastructure.{" "}
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 }}>
              Not no-code resold.
            </span>
          </h2>
          <p
            className="mt-3 text-[14.5px] leading-relaxed max-w-xl mx-auto"
            style={{ color: "#5C6B7F" }}
          >
            {headline ||
              "12 production services wired through one pipeline. Built in this codebase. Live on your phone line in 21 days."}
          </p>
        </div>

        <div
          ref={railRef}
          className="tya-rail"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
            gap: 8,
            opacity: 0,
            transform: "translateY(10px)",
            transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {TOOLS.map((t, i) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tya-tool"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "20px 12px",
                borderRadius: 12,
                background: "#FFFFFF",
                border: "1px solid rgba(4,44,83,0.08)",
                textDecoration: "none",
                color: "#042C53",
                transition: "border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
                transitionDelay: `${i * 18}ms`,
                cursor: "pointer",
                minHeight: 96,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(71,85,105,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 30px -16px rgba(15,23,42,0.12)";
                const brand = e.currentTarget.querySelector(".tya-tool__icon-brand") as HTMLImageElement | null;
                const rest  = e.currentTarget.querySelector(".tya-tool__icon-rest")  as HTMLImageElement | null;
                if (brand) brand.style.opacity = "1";
                if (rest)  rest.style.opacity  = "0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(15,23,42,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                const brand = e.currentTarget.querySelector(".tya-tool__icon-brand") as HTMLImageElement | null;
                const rest  = e.currentTarget.querySelector(".tya-tool__icon-rest")  as HTMLImageElement | null;
                if (brand) brand.style.opacity = "0";
                if (rest)  rest.style.opacity  = "1";
              }}
            >
              {/* v168b: graphite (#475569) at rest — NOT navy. User audit said
                  the all-navy treatment made the whole section "too blue."
                  Hover swap to real brand color via second <img> + CSS opacity. */}
              <div style={{ width: 22, height: 22, position: "relative" }}>
                <img
                  src={`https://cdn.simpleicons.org/${t.slug}/475569`}
                  alt={`${t.name} logo`}
                  width={22}
                  height={22}
                  loading="lazy"
                  className="tya-tool__icon-rest"
                  style={{ display: "block", position: "absolute", inset: 0, transition: "opacity 240ms ease" }}
                />
                <img
                  src={`https://cdn.simpleicons.org/${t.slug}`}
                  alt=""
                  aria-hidden="true"
                  width={22}
                  height={22}
                  loading="lazy"
                  className="tya-tool__icon-brand"
                  style={{ display: "block", position: "absolute", inset: 0, opacity: 0, transition: "opacity 240ms ease" }}
                />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.005em" }}>
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {t.use}
              </div>
            </a>
          ))}
        </div>

        <div
          className="mt-10 sm:mt-12 text-center text-[12.5px]"
          style={{ color: "#94A3B8" }}
        >
          Multi-provider fallback chain (Anthropic → Groq → Gemini → OpenAI) keeps the line answered when any one provider rate-limits.
        </div>
      </div>

      <style>{`
        .tya-rail--in { opacity: 1 !important; transform: translateY(0) !important; }
        @media (prefers-reduced-motion: reduce) {
          .tya-rail { opacity: 1 !important; transform: none !important; }
          .tya-tool { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
