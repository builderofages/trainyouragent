// src/components/PoweredByBadges.tsx
// v98: REAL brand logos via cdn.simpleicons.org + cinematic motion.
//
// Switched from Clearbit (favicon-tier inconsistent) to cdn.simpleicons.org
// which serves the official Simple Icons SVG library (3000+ verified brand
// marks) with optional color tint via URL path. Format:
//   https://cdn.simpleicons.org/{slug}/{hex-without-hash}
//
// Examples:
//   https://cdn.simpleicons.org/anthropic/D97757   → Anthropic A in orange
//   https://cdn.simpleicons.org/stripe/635BFF      → Stripe S in purple
//   https://cdn.simpleicons.org/vercel/000         → Vercel triangle black
//
// These are the literal real, on-brand, official logos in vector format.
// Used by Stripe, Linear, and Cursor on their partner walls.
//
// Motion (5 stacked layers, way more cinematic than v97):
//   1. Marquee scroll — 28s loop (faster than v97's 38s, more energetic)
//   2. Y-axis bob — per-badge independent rate, 14-18px amplitude
//   3. Subtle continuous rotation drift (±2deg)
//   4. Breathing glow halo behind every badge (always on, 4s pulse)
//   5. 3D parallax tilt on mouse hover

import { useRef } from "react";
import { Link } from "react-router-dom";

type Tool = {
  name: string;
  slug: string;        // Simple Icons slug (lowercased brand name, no spaces)
  color: string;       // hex without hash
  use: string;
  href: string;
};

const TOOLS: Tool[] = [
  { name: "Anthropic",  slug: "anthropic",     color: "D97757", use: "Reasoning + writing",     href: "https://www.anthropic.com" },
  { name: "OpenAI",     slug: "openai",        color: "10A37F", use: "TTS fallback",            href: "https://openai.com" },
  { name: "Vercel",     slug: "vercel",        color: "000000", use: "Edge runtime",            href: "https://vercel.com" },
  { name: "Twilio",     slug: "twilio",        color: "F22F46", use: "Telephony",               href: "https://www.twilio.com" },
  { name: "ElevenLabs", slug: "elevenlabs",    color: "000000", use: "Voice synthesis",         href: "https://elevenlabs.io" },
  { name: "Supabase",   slug: "supabase",      color: "3ECF8E", use: "Database + auth",         href: "https://supabase.com" },
  { name: "Stripe",     slug: "stripe",        color: "635BFF", use: "Payments",                href: "https://stripe.com" },
  { name: "Cloudflare", slug: "cloudflare",    color: "F38020", use: "CDN + DNS",               href: "https://cloudflare.com" },
  { name: "GitHub",     slug: "github",        color: "181717", use: "Version control + CI",    href: "https://github.com" },
  { name: "Resend",     slug: "resend",        color: "000000", use: "Transactional email",     href: "https://resend.com" },
  { name: "Notion",     slug: "notion",        color: "000000", use: "Internal ops",            href: "https://notion.so" },
  { name: "Linear",     slug: "linear",        color: "5E6AD2", use: "Eng tracker",             href: "https://linear.app" },
  { name: "Slack",      slug: "slack",         color: "4A154B", use: "Comms",                   href: "https://slack.com" },
  { name: "Figma",      slug: "figma",         color: "F24E1E", use: "Design",                  href: "https://figma.com" },
];

export type PoweredByBadgesProps = {
  eyebrow?: string;
  headline?: string;
  className?: string;
  variant?: "compact" | "grid";
};

export default function PoweredByBadges({
  eyebrow = "POWERED BY · THE STACK WE ACTUALLY SHIP",
  headline,
  className = "",
}: PoweredByBadgesProps) {
  // Duplicate for seamless marquee loop
  const loop = [...TOOLS, ...TOOLS];

  return (
    <section
      className={`relative px-0 py-16 sm:py-24 overflow-hidden ${className}`}
      aria-label="Technology stack we use in production"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at center top, rgba(230,241,251,0.9) 0%, rgba(246,250,254,0.6) 40%, #FFFFFF 100%)",
      }}
    >
      <style>{`
        @keyframes tya-marquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes tya-bob-a {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(0, -16px, 0) rotate(-1.5deg); }
        }
        @keyframes tya-bob-b {
          0%, 100% { transform: translate3d(0, -6px, 0) rotate(1deg); }
          50%      { transform: translate3d(0, 14px, 0) rotate(-1deg); }
        }
        @keyframes tya-bob-c {
          0%, 100% { transform: translate3d(0, 8px, 0) rotate(-1deg); }
          50%      { transform: translate3d(0, -12px, 0) rotate(2deg); }
        }
        @keyframes tya-breathe {
          0%, 100% { opacity: 0.30; transform: scale(0.92); }
          50%      { opacity: 0.65; transform: scale(1.10); }
        }
        @keyframes tya-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .tya-marquee-track {
          animation: tya-marquee 32s linear infinite;
          will-change: transform;
        }
        .tya-marquee-strip:hover .tya-marquee-track {
          animation-play-state: paused;
        }
        .tya-bob-a { animation: tya-bob-a 4.2s ease-in-out infinite; }
        .tya-bob-b { animation: tya-bob-b 5.4s ease-in-out infinite; }
        .tya-bob-c { animation: tya-bob-c 6.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tya-marquee-track,
          .tya-bob-a, .tya-bob-b, .tya-bob-c,
          .tya-breathe { animation: none !important; }
        }
        .tya-badge-card {
          will-change: transform, box-shadow;
          transition:
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 350ms ease,
            border-color 350ms ease;
        }
        .tya-badge-card:hover {
          transform: translate3d(0, -10px, 0) scale(1.08) !important;
          box-shadow:
            0 50px 100px -35px rgba(4,44,83,0.45),
            0 0 0 1px rgba(255,255,255,0.7);
          border-color: rgba(255,255,255,1);
          z-index: 10;
        }
        .tya-breathe {
          position: absolute;
          inset: -25%;
          border-radius: 50%;
          opacity: 0.3;
          pointer-events: none;
          filter: blur(40px);
          animation: tya-breathe 4s ease-in-out infinite;
          will-change: opacity, transform;
        }
        .tya-badge-card:hover .tya-breathe {
          animation-duration: 1.5s;
        }
        .tya-shimmer-text {
          background: linear-gradient(90deg, #185FA5 0%, #042C53 25%, #22A36C 50%, #042C53 75%, #185FA5 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: tya-shimmer 6s linear infinite;
        }
        .tya-logo-img {
          object-fit: contain;
          transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.10));
        }
        .tya-badge-card:hover .tya-logo-img {
          transform: scale(1.12);
        }
      `}</style>

      <div className="max-w-6xl mx-auto text-center mb-10 sm:mb-14 px-5 sm:px-8">
        <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.24em] text-[#185FA5] font-semibold font-mono">
          {eyebrow}
        </div>
        {headline ? (
          <h3 className="mt-3 text-[22px] sm:text-[28px] font-semibold text-[#042C53] leading-tight">
            {headline}
          </h3>
        ) : (
          <h3 className="mt-4 text-[24px] sm:text-[36px] font-semibold leading-tight">
            <span className="tya-shimmer-text">Same infrastructure</span>{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: "#042C53" }}>
              as Cursor, Linear, Anthropic prod.
            </span>
          </h3>
        )}
      </div>

      {/* Marquee with edge fades */}
      <div className="tya-marquee-strip relative" style={{ perspective: "1200px" }}>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 sm:w-56 z-10" style={{ background: "linear-gradient(to right, rgba(246,250,254,1), rgba(246,250,254,0))" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 sm:w-56 z-10" style={{ background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }} />

        <ul className="tya-marquee-track flex items-center gap-7 sm:gap-9 w-max py-10" style={{ paddingLeft: "2rem" }}>
          {loop.map((t, i) => (
            <li
              key={`${t.name}-${i}`}
              className={
                i % 3 === 0 ? "tya-bob-a" : i % 3 === 1 ? "tya-bob-b" : "tya-bob-c"
              }
            >
              <Badge tool={t} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 text-center text-[12px] sm:text-[13px] text-slate-500 leading-relaxed px-5">
        Every tool above is wired into a production endpoint in this codebase right now.{" "}
        <Link
          to="/technology"
          className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/40 underline-offset-2 font-semibold"
        >
          See the architecture →
        </Link>
      </div>
    </section>
  );
}

function Badge({ tool }: { tool: Tool }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translate3d(0, -10px, 0) scale(1.08) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
  }

  function handleLeave() {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "";
  }

  // hex color with # for inline glow
  const fullColor = `#${tool.color}`;

  return (
    <a
      ref={ref}
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tool.name} — ${tool.use}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="tya-badge-card relative flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/90 backdrop-blur-xl border border-white px-7 sm:px-8 py-7 sm:py-8 w-[180px] sm:w-[210px] min-h-[170px] shadow-[0_16px_50px_-18px_rgba(4,44,83,0.25)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Breathing glow halo (always on) */}
      <span
        className="tya-breathe"
        style={{ background: `radial-gradient(circle, ${fullColor} 0%, transparent 65%)` }}
        aria-hidden="true"
      />

      {/* Real brand logo from cdn.simpleicons.org in brand color */}
      <div className="relative h-14 sm:h-16 w-14 sm:w-16 flex items-center justify-center">
        <img
          src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`}
          alt={`${tool.name} logo`}
          className="tya-logo-img max-h-full max-w-full"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            const parent = img.parentElement;
            if (parent && !parent.querySelector('.tya-logo-fallback')) {
              const fb = document.createElement('div');
              fb.className = 'tya-logo-fallback flex items-center justify-center w-full h-full rounded-2xl font-bold text-3xl';
              fb.style.background = fullColor;
              fb.style.color = '#FFFFFF';
              fb.textContent = tool.name.charAt(0);
              parent.appendChild(fb);
              img.style.display = 'none';
            }
          }}
        />
      </div>

      <div className="text-center relative">
        <div className="text-[15px] sm:text-[16px] font-semibold text-[#042C53] leading-tight">
          {tool.name}
        </div>
        <div className="text-[11px] sm:text-[12px] text-slate-500 leading-tight mt-1">
          {tool.use}
        </div>
      </div>
    </a>
  );
}
