// src/components/PoweredByBadges.tsx
// v97: REAL brand logos via Clearbit logo CDN + 3D parallax + magnetic hover.
//
// Why Clearbit: every brand's actual rendered logo as a PNG/SVG, served from
// https://logo.clearbit.com/{domain}. No more approximated SVG paths that
// look like generic icons. These are the literal real brand marks.
//
// Motion layers (4 stacked, way more dramatic than v96):
//   1. Infinite horizontal marquee (35s loop, pauses on hover)
//   2. Each badge bobs on Y at independent rate (3 rhythms × index modulo)
//   3. Mouse-driven 3D parallax tilt on hover (CSS perspective + rotateY/X)
//   4. Brand-color radial glow halo that pulses on hover
//
// Glassmorphism cards. Soft drop shadow. Edge-fade gradient on both sides
// so badges drift in/out of focus like a conveyor. Respects reduced-motion.

import { useRef } from "react";
import { Link } from "react-router-dom";

type Tool = {
  name: string;
  domain: string;      // Clearbit lookup
  color: string;
  use: string;
  href: string;
};

const TOOLS: Tool[] = [
  { name: "Anthropic",  domain: "anthropic.com",   color: "#D97757", use: "Reasoning + writing",     href: "https://www.anthropic.com" },
  { name: "Groq",       domain: "groq.com",        color: "#F55036", use: "Free LLM fallback",       href: "https://groq.com" },
  { name: "Vapi",       domain: "vapi.ai",         color: "#22C55E", use: "Voice infrastructure",    href: "https://vapi.ai" },
  { name: "ElevenLabs", domain: "elevenlabs.io",   color: "#000000", use: "Voice synthesis",         href: "https://elevenlabs.io" },
  { name: "Twilio",     domain: "twilio.com",      color: "#F22F46", use: "Telephony",               href: "https://www.twilio.com" },
  { name: "Pinecone",   domain: "pinecone.io",     color: "#1B17F5", use: "RAG knowledge base",      href: "https://www.pinecone.io" },
  { name: "Cohere",     domain: "cohere.com",      color: "#39594D", use: "Reranking",               href: "https://cohere.com" },
  { name: "Supabase",   domain: "supabase.com",    color: "#3ECF8E", use: "Database + auth",         href: "https://supabase.com" },
  { name: "Vercel",     domain: "vercel.com",      color: "#000000", use: "Edge runtime",            href: "https://vercel.com" },
  { name: "Stripe",     domain: "stripe.com",      color: "#635BFF", use: "Payments",                href: "https://stripe.com" },
  { name: "Resend",     domain: "resend.com",      color: "#000000", use: "Transactional email",     href: "https://resend.com" },
  { name: "Cal.com",    domain: "cal.com",         color: "#292929", use: "Scheduling",              href: "https://cal.com" },
  { name: "OpenAI",     domain: "openai.com",      color: "#10A37F", use: "TTS fallback",            href: "https://openai.com" },
  { name: "GitHub",     domain: "github.com",      color: "#181717", use: "Version control + CI",    href: "https://github.com" },
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
      className={`relative px-0 py-14 sm:py-20 overflow-hidden ${className}`}
      aria-label="Technology stack we use in production"
      style={{
        background: "radial-gradient(ellipse at top, #E6F1FB 0%, #F6FAFE 40%, #FFFFFF 100%)",
      }}
    >
      <style>{`
        @keyframes tya-marquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes tya-bob-a { 0%,100% { transform: translate3d(0, 0, 0); }    50% { transform: translate3d(0, -12px, 0); } }
        @keyframes tya-bob-b { 0%,100% { transform: translate3d(0, -4px, 0); } 50% { transform: translate3d(0, 10px, 0); } }
        @keyframes tya-bob-c { 0%,100% { transform: translate3d(0, 6px, 0); }  50% { transform: translate3d(0, -8px, 0); } }
        @keyframes tya-glow-pulse {
          0%, 100% { opacity: 0; transform: scale(0.95); }
          50%      { opacity: 0.6; transform: scale(1.08); }
        }
        .tya-marquee-track {
          animation: tya-marquee 38s linear infinite;
          will-change: transform;
        }
        .tya-marquee-strip:hover .tya-marquee-track { animation-play-state: paused; }
        .tya-bob-a { animation: tya-bob-a 4.5s ease-in-out infinite; }
        .tya-bob-b { animation: tya-bob-b 5.7s ease-in-out infinite; }
        .tya-bob-c { animation: tya-bob-c 6.3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tya-marquee-track,
          .tya-bob-a, .tya-bob-b, .tya-bob-c { animation: none !important; }
        }
        .tya-badge-3d {
          perspective: 800px;
          transform-style: preserve-3d;
        }
        .tya-badge-card {
          will-change: transform, box-shadow;
          transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1);
          transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease, border-color 350ms ease;
        }
        .tya-badge-card:hover {
          transform: translate3d(0, -8px, 0) scale(1.06);
          box-shadow: 0 40px 80px -30px rgba(4,44,83,0.40), 0 0 0 1px rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.95);
        }
        .tya-badge-glow {
          position: absolute; inset: -30%; border-radius: 50%; opacity: 0; pointer-events: none;
          filter: blur(36px);
          transition: opacity 320ms ease;
        }
        .tya-badge-card:hover .tya-badge-glow {
          opacity: 0.65;
          animation: tya-glow-pulse 2s ease-in-out infinite;
        }
        .tya-logo-img {
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));
          transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tya-badge-card:hover .tya-logo-img {
          transform: scale(1.08) translateZ(20px);
        }
      `}</style>

      <div className="max-w-6xl mx-auto text-center mb-10 sm:mb-12 px-5 sm:px-8">
        <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] text-[#185FA5] font-semibold font-mono">
          {eyebrow}
        </div>
        {headline ? (
          <h3 className="mt-3 text-[22px] sm:text-[28px] font-semibold text-[#042C53] leading-tight">
            {headline}
          </h3>
        ) : (
          <h3 className="mt-4 text-[22px] sm:text-[32px] font-semibold text-[#042C53] leading-tight">
            Same infrastructure as{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Cursor, Linear, Anthropic prod.
            </span>
          </h3>
        )}
      </div>

      {/* Marquee with edge fades */}
      <div className="tya-marquee-strip relative tya-badge-3d">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 z-10" style={{ background: "linear-gradient(to right, rgba(246,250,254,1), rgba(246,250,254,0))" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 z-10" style={{ background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }} />

        <ul className="tya-marquee-track flex items-center gap-6 sm:gap-8 w-max py-8" style={{ paddingLeft: "1.5rem" }}>
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

      <div className="mt-8 text-center text-[12px] sm:text-[13px] text-slate-500 leading-relaxed px-5">
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

  // v97: mouse-driven 3D parallax tilt
  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translate3d(0, -8px, 0) scale(1.06) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  }

  function handleLeave() {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "";
  }

  return (
    <a
      ref={ref}
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tool.name} — ${tool.use}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="tya-badge-card relative flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/85 backdrop-blur-xl border border-white px-6 sm:px-7 py-6 sm:py-7 w-[170px] sm:w-[200px] min-h-[160px] shadow-[0_12px_40px_-15px_rgba(4,44,83,0.22)]"
    >
      {/* Brand-color glow halo */}
      <span
        className="tya-badge-glow"
        style={{ background: `radial-gradient(circle, ${tool.color} 0%, transparent 65%)` }}
        aria-hidden="true"
      />

      {/* Real brand logo via Clearbit CDN */}
      <div className="relative h-12 sm:h-14 w-12 sm:w-14 flex items-center justify-center">
        <img
          src={`https://logo.clearbit.com/${tool.domain}?size=128`}
          alt={`${tool.name} logo`}
          className="tya-logo-img max-h-full max-w-full"
          loading="lazy"
          onError={(e) => {
            // If Clearbit fails for any reason, fall back to a colored brand letter.
            const img = e.currentTarget;
            const parent = img.parentElement;
            if (parent && !parent.querySelector('.tya-logo-fallback')) {
              const fb = document.createElement('div');
              fb.className = 'tya-logo-fallback flex items-center justify-center w-full h-full rounded-2xl font-bold text-2xl';
              fb.style.background = tool.color;
              fb.style.color = '#FFFFFF';
              fb.textContent = tool.name.charAt(0);
              parent.appendChild(fb);
              img.style.display = 'none';
            }
          }}
        />
      </div>

      <div className="text-center relative">
        <div className="text-[14px] sm:text-[15px] font-semibold text-[#042C53] leading-tight">
          {tool.name}
        </div>
        <div className="text-[11px] sm:text-[12px] text-slate-500 leading-tight mt-1">
          {tool.use}
        </div>
      </div>
    </a>
  );
}
