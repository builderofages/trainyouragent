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

// v247: each tool carries its own brand color so we can render a clean
// letter-mark badge. cdn.simpleicons.org/{slug} was 404-ing intermittently
// for twilio/groq/openai which leaked the alt text 'Twilio log' onto the
// rendered page. Letter marks never miss.
const TOOLS: (Tool & { color: string; mark: string })[] = [
  { name: "Anthropic",  slug: "anthropic",  use: "Reasoning",       href: "https://www.anthropic.com", color: "#D4754C", mark: "A" },
  { name: "Vercel",     slug: "vercel",     use: "Edge runtime",    href: "https://vercel.com",        color: "#000000", mark: "▲" },
  { name: "ElevenLabs", slug: "elevenlabs", use: "Voice synthesis", href: "https://elevenlabs.io",     color: "#111111", mark: "EL" },
  { name: "Twilio",     slug: "twilio",     use: "Telephony",       href: "https://www.twilio.com",    color: "#F22F46", mark: "T" },
  { name: "Stripe",     slug: "stripe",     use: "Payments",        href: "https://stripe.com",        color: "#635BFF", mark: "S" },
  { name: "OpenAI",     slug: "openai",     use: "TTS fallback",    href: "https://openai.com",        color: "#10A37F", mark: "AI" },
  { name: "Supabase",   slug: "supabase",   use: "Database",        href: "https://supabase.com",      color: "#3FCF8E", mark: "S" },
  { name: "Cloudflare", slug: "cloudflare", use: "CDN + DNS",       href: "https://cloudflare.com",    color: "#F38020", mark: "CF" },
  { name: "GitHub",     slug: "github",     use: "Version control", href: "https://github.com",        color: "#1B1F23", mark: "GH" },
  { name: "Groq",       slug: "groq",       use: "LLM fallback",    href: "https://groq.com",          color: "#F55036", mark: "G" },
  { name: "Resend",     slug: "resend",     use: "Email",           href: "https://resend.com",        color: "#000000", mark: "R" },
  { name: "Linear",     slug: "linear",     use: "Tracker",         href: "https://linear.app",        color: "#5E6AD2", mark: "L" },
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
      style={{ background: "#FFFFFF", borderTop: "1px solid rgba(4,44,83,0.06)", borderBottom: "1px solid rgba(4,44,83,0.06)" }}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
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
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "26px 16px 22px",
                borderRadius: 16,
                /* v276b: subtle brand-tinted gradient backplate instead of flat white. */
                background: `linear-gradient(180deg, ${t.color}06 0%, #FFFFFF 60%)`,
                border: `1px solid ${t.color}1F`,
                textDecoration: "none",
                color: "#042C53",
                transition: "border-color 220ms ease, transform 220ms cubic-bezier(0.22,1,0.36,1), box-shadow 220ms ease, background 220ms ease",
                transitionDelay: `${i * 22}ms`,
                cursor: "pointer",
                minHeight: 132,
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${t.color}66`;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 22px 44px -22px ${t.color}55, 0 4px 12px -6px ${t.color}1A`;
                e.currentTarget.style.background = `linear-gradient(180deg, ${t.color}10 0%, #FFFFFF 70%)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${t.color}1F`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = `linear-gradient(180deg, ${t.color}06 0%, #FFFFFF 60%)`;
              }}
            >
              {/* v276b: premium icon backplate — bigger (60px), more depth,
                  brand-tinted inner glow, subtle ring. Real brand SVG inside. */}
              <div
                style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: "#FFFFFF",
                  border: `1px solid ${t.color}24`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 10px 26px -10px ${t.color}66, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.4)`,
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  /* v272b: same-origin /icons/ served from public/ — fetched
                     at build time by scripts/fetch-brand-icons.mjs from
                     jsdelivr/unpkg/simpleicons mirrors. Rock-solid because
                     it's same-origin static assets, not a third-party CDN
                     at runtime. Falls back to letter-mark via onError. */
                  src={`/icons/${t.slug}.svg`}
                  style={{
                    width: 32,
                    height: 32,
                    objectFit: "contain",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = "inline-flex";
                  }}
                />
                <span
                  aria-hidden
                  style={{
                    display: "none",
                    position: "absolute",
                    inset: 0,
                    background: t.color,
                    color: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: t.mark.length > 1 ? 16 : 20,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.mark}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#042C53" }}>
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#7B8AA0",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontWeight: 600,
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
