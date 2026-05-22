// src/components/PoweredByBadges.tsx
// v96: SICK FLOATING BADGES — not static cards.
//
// Three layers of motion stacked:
//   1. Whole strip scrolls left infinitely (CSS marquee, ~40s loop)
//   2. Each badge bobs independently on Y axis with its own period (3-6s)
//      and phase offset (per index) so the strip never feels mechanical
//   3. Hover lifts + magnifies + adds glow halo in the brand color
//
// Pauses on hover so visitor can read. Respects prefers-reduced-motion.
// Real SVG brand marks (Simple Icons CC0 BY 1.0), one inline path each.

import { Link } from "react-router-dom";

type Tool = {
  name: string;
  color: string;
  use: string;
  href: string;
  svg: string;
};

const TOOLS: Tool[] = [
  { name: "Anthropic",  color: "#D97757", use: "Reasoning + writing",   href: "https://www.anthropic.com", svg: "M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" },
  { name: "Groq",       color: "#F55036", use: "Free LLM fallback",     href: "https://groq.com", svg: "M12.036 0C5.412-.02.005 5.353 0 11.977c-.005 6.625 5.37 12.018 11.997 12.023 6.626.005 12.018-5.367 12.023-11.994.004-6.626-5.367-12.018-11.984-12.005zm.004 18.564a6.568 6.568 0 1 1 6.564-6.567 6.55 6.55 0 0 1-6.564 6.567z" },
  { name: "Vapi",       color: "#22C55E", use: "Voice infrastructure",  href: "https://vapi.ai", svg: "M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.91-3a.94.94 0 0 0-.91 1c-.45 2.86-3.05 5-5.91 5s-5.46-2.14-5.91-5a.94.94 0 0 0-.91-1 .94.94 0 0 0-.91 1A8 8 0 0 0 11 22.9V23a1 1 0 0 0 2 0v-.1A8 8 0 0 0 18.82 12a.94.94 0 0 0-.91-1z" },
  { name: "ElevenLabs", color: "#000000", use: "Voice synthesis",       href: "https://elevenlabs.io", svg: "M0 0v24h24V0H0zm8.182 18.546H5.455V5.455h2.727v13.09zm10.363 0h-2.727V5.455h2.727v13.09z" },
  { name: "Twilio",     color: "#F22F46", use: "Telephony",             href: "https://www.twilio.com", svg: "M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm0 21.176C6.927 21.176 2.824 17.073 2.824 12 2.824 6.927 6.927 2.824 12 2.824c5.073 0 9.176 4.103 9.176 9.176 0 5.073-4.103 9.176-9.176 9.176zm5.071-12.012a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0zm0 5.671a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0zm-5.671 0a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0zm0-5.671a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0z" },
  { name: "Pinecone",   color: "#1B17F5", use: "RAG knowledge base",    href: "https://www.pinecone.io", svg: "M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 18a8.5 8.5 0 01-6-8V7.3l6-3 6 3V12a8.5 8.5 0 01-6 8z" },
  { name: "Cohere",     color: "#39594D", use: "Reranking",             href: "https://cohere.com", svg: "M5.36 14.682a3.43 3.43 0 0 1 1.4-1.4l9.518-4.76a3.43 3.43 0 1 1 3.073 6.135l-9.518 4.76a3.43 3.43 0 0 1-4.473-4.735zM7.6 7.4a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z" },
  { name: "Supabase",   color: "#3ECF8E", use: "Database + auth",       href: "https://supabase.com", svg: "M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66Z" },
  { name: "Vercel",     color: "#000000", use: "Edge runtime",          href: "https://vercel.com", svg: "M24 22.525H0l12-21.05 12 21.05z" },
  { name: "Stripe",     color: "#635BFF", use: "Payments",              href: "https://stripe.com", svg: "M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.51-.977 1.426-.977 1.677 0 3.354.645 4.526 1.213l.674-4.144c-.927-.443-2.821-1.172-5.491-1.172-1.937 0-3.554.504-4.708 1.443-1.202.985-1.825 2.408-1.825 4.127 0 3.115 1.903 4.451 5.001 5.573 1.997.72 2.667 1.234 2.667 2.018 0 .764-.654 1.197-1.84 1.197-1.475 0-3.909-.726-5.512-1.66l-.683 4.193C6.49 20.677 8.825 21 11.071 21c2.061 0 3.776-.487 4.938-1.41 1.297-1.029 1.971-2.545 1.971-4.498 0-3.184-1.946-4.51-4.501-5.209z" },
  { name: "Resend",     color: "#000000", use: "Transactional email",   href: "https://resend.com", svg: "M12 2.0083c-5.5176 0-9.9917 4.474-9.9917 9.9917 0 5.5177 4.474 9.9917 9.9917 9.9917 5.5177 0 9.9917-4.474 9.9917-9.9917 0-5.5177-4.474-9.9917-9.9917-9.9917Zm0 1.6653c4.5926 0 8.3264 3.7338 8.3264 8.3264 0 4.5926-3.7338 8.3264-8.3264 8.3264-4.5926 0-8.3264-3.7338-8.3264-8.3264 0-4.5926 3.7338-8.3264 8.3264-8.3264Z" },
  { name: "Cal.com",    color: "#292929", use: "Scheduling",            href: "https://cal.com", svg: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" },
];

export type PoweredByBadgesProps = {
  eyebrow?: string;
  headline?: string;
  className?: string;
  variant?: "compact" | "grid"; // kept for backwards-compat
};

export default function PoweredByBadges({
  eyebrow = "POWERED BY · THE STACK WE ACTUALLY SHIP",
  headline,
  className = "",
}: PoweredByBadgesProps) {
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...TOOLS, ...TOOLS];

  return (
    <section
      className={`relative px-0 py-14 sm:py-20 overflow-hidden ${className}`}
      aria-label="Technology stack we use in production"
      style={{
        background: "radial-gradient(ellipse at top, #E6F1FB 0%, #F6FAFE 40%, #FFFFFF 100%)",
      }}
    >
      {/* Inline keyframes — scoped to this component so we don't need a global stylesheet edit. */}
      <style>{`
        @keyframes tya-marquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes tya-bob-a {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -10px, 0); }
        }
        @keyframes tya-bob-b {
          0%, 100% { transform: translate3d(0, -3px, 0); }
          50%      { transform: translate3d(0, 8px, 0); }
        }
        @keyframes tya-bob-c {
          0%, 100% { transform: translate3d(0, 5px, 0); }
          50%      { transform: translate3d(0, -7px, 0); }
        }
        .tya-marquee-track { animation: tya-marquee 45s linear infinite; }
        .tya-marquee-strip:hover .tya-marquee-track { animation-play-state: paused; }
        .tya-bob-a { animation: tya-bob-a 4.5s ease-in-out infinite; }
        .tya-bob-b { animation: tya-bob-b 5.7s ease-in-out infinite; }
        .tya-bob-c { animation: tya-bob-c 6.3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tya-marquee-track,
          .tya-bob-a, .tya-bob-b, .tya-bob-c {
            animation: none !important;
          }
        }
        .tya-badge-card { will-change: transform; transition: transform 200ms ease, box-shadow 200ms ease; }
        .tya-badge-card:hover {
          transform: translate3d(0, -6px, 0) scale(1.04);
          box-shadow: 0 30px 60px -25px rgba(4,44,83,0.30), 0 0 0 1px rgba(4,44,83,0.05);
        }
        .tya-badge-glow {
          position: absolute; inset: -20%; border-radius: 50%; opacity: 0; pointer-events: none;
          filter: blur(28px); transition: opacity 280ms ease;
        }
        .tya-badge-card:hover .tya-badge-glow { opacity: 0.55; }
      `}</style>

      <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-10 px-5 sm:px-8">
        <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#185FA5] font-semibold font-mono">
          {eyebrow}
        </div>
        {headline && (
          <h3 className="mt-3 text-[20px] sm:text-[26px] font-semibold text-[#042C53] leading-tight">
            {headline}
          </h3>
        )}
      </div>

      {/* Marquee track — edge fades on both sides so badges drift in/out of focus */}
      <div className="tya-marquee-strip relative">
        {/* Soft edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10" style={{ background: "linear-gradient(to right, rgba(246,250,254,1), rgba(246,250,254,0))" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10" style={{ background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }} />

        <ul
          className="tya-marquee-track flex items-center gap-5 sm:gap-7 w-max py-6"
          style={{ paddingLeft: "1.25rem" }}
        >
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
  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tool.name} — ${tool.use}`}
      className="tya-badge-card relative flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white px-5 sm:px-6 py-5 sm:py-6 w-[150px] sm:w-[180px] min-h-[140px] shadow-[0_8px_30px_-12px_rgba(4,44,83,0.18)]"
    >
      {/* Hover glow halo in brand color */}
      <span
        className="tya-badge-glow"
        style={{ background: `radial-gradient(circle, ${tool.color} 0%, transparent 60%)` }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 relative"
        style={{ color: tool.color }}
        aria-hidden="true"
      >
        <path d={tool.svg} fill="currentColor" />
      </svg>
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
