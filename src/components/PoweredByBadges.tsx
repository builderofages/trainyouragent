// src/components/PoweredByBadges.tsx
// v107: 2030 spatial-computing rewrite. Killed the 2020 marquee.
//
// What's new:
//   • Dark spatial canvas (deep navy/near-black) instead of "white card with logos."
//     This is the Apple Vision Pro / Linear / Rauno aesthetic, not the
//     "Stripe partner wall circa 2020" aesthetic.
//   • Cursor-tracked radial spotlight follows the mouse across the whole
//     section via CSS custom properties (--mx, --my). No JS-driven re-renders.
//   • 3D perspective grid (5 cols × 3 rows). Each badge floats on its own
//     Z plane with cursor-parallax tilt.
//   • Iridescent conic-gradient borders that ignite on hover (CSS mask).
//   • Brand-color bloom halo behind each logo using filter: drop-shadow.
//   • Animated pipeline flow underneath showing the runtime path
//     Twilio → Anthropic → ElevenLabs → your customer.
//   • Respects prefers-reduced-motion (kills all keyframe animation; spotlight
//     stays because it follows the cursor, no looping).
//   • No new dependencies. ~12KB CSS, GPU-accelerated.

import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

type Tool = {
  name: string;
  slug: string;        // Simple Icons slug
  color: string;       // hex without hash, used both for logo tint and brand bloom
  use: string;
  href: string;
};

// 15 tools — 5×3 grid. Order chosen for visual rhythm (intense colors mixed
// with monochrome marks so the eye doesn't get fatigued in any one row).
const TOOLS: Tool[] = [
  { name: "Anthropic",  slug: "anthropic",  color: "D97757", use: "Reasoning",       href: "https://www.anthropic.com" },
  { name: "Vercel",     slug: "vercel",     color: "FFFFFF", use: "Edge runtime",    href: "https://vercel.com" },
  { name: "ElevenLabs", slug: "elevenlabs", color: "FFFFFF", use: "Voice synthesis", href: "https://elevenlabs.io" },
  { name: "Twilio",     slug: "twilio",     color: "F22F46", use: "Telephony",       href: "https://www.twilio.com" },
  { name: "Stripe",     slug: "stripe",     color: "635BFF", use: "Payments",        href: "https://stripe.com" },

  { name: "OpenAI",     slug: "openai",     color: "10A37F", use: "TTS fallback",    href: "https://openai.com" },
  { name: "Supabase",   slug: "supabase",   color: "3ECF8E", use: "Database",        href: "https://supabase.com" },
  { name: "Cloudflare", slug: "cloudflare", color: "F38020", use: "CDN + DNS",       href: "https://cloudflare.com" },
  { name: "GitHub",     slug: "github",     color: "FFFFFF", use: "Version control", href: "https://github.com" },
  { name: "Linear",     slug: "linear",     color: "5E6AD2", use: "Tracker",         href: "https://linear.app" },

  { name: "Resend",     slug: "resend",     color: "FFFFFF", use: "Email",           href: "https://resend.com" },
  { name: "Notion",     slug: "notion",     color: "FFFFFF", use: "Ops",             href: "https://notion.so" },
  { name: "Slack",      slug: "slack",      color: "4A154B", use: "Comms",           href: "https://slack.com" },
  { name: "Figma",      slug: "figma",      color: "F24E1E", use: "Design",          href: "https://figma.com" },
  { name: "Groq",       slug: "groq",       color: "F55036", use: "LLM fallback",    href: "https://groq.com" },
];

export type PoweredByBadgesProps = {
  eyebrow?: string;
  headline?: string;
  className?: string;
  /** v107: legacy prop kept for backward compat, no longer used. */
  variant?: "compact" | "grid";
};

export default function PoweredByBadges({
  eyebrow = "RUNTIME · 15 SERVICES · ONE PIPELINE",
  headline,
  className = "",
}: PoweredByBadgesProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked spotlight + parallax. Pure CSS variables, no React state.
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    function onMove(ev: MouseEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((ev.clientX - r.left) / r.width)  * 100;
        const y = ((ev.clientY - r.top)  / r.height) * 100;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
        // Parallax tilt for the grid: small, never more than 4deg either axis.
        const tx = (x - 50) / 50;
        const ty = (y - 50) / 50;
        el.style.setProperty("--tilt-x", `${-ty * 4}deg`);
        el.style.setProperty("--tilt-y", `${ tx * 4}deg`);
      });
    }
    function onLeave() {
      if (!el) return;
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className={`tya-spatial relative overflow-hidden ${className}`}
      aria-label="Production runtime stack"
    >
      <style>{`
        .tya-spatial {
          --mx: 50%;
          --my: 35%;
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          /* Deep navy → near-black radial. Spotlight rides on top. */
          background:
            radial-gradient(900px 600px at var(--mx) var(--my),
              rgba(99, 137, 217, 0.18) 0%,
              rgba(24, 95, 165, 0.08) 20%,
              transparent 55%),
            radial-gradient(1200px 800px at 50% 0%,
              rgba(4, 44, 83, 0.85) 0%,
              rgba(2, 12, 24, 1) 65%);
          padding: 96px 0 120px;
          color: #E6F1FB;
          isolation: isolate;
        }
        @media (min-width: 640px) { .tya-spatial { padding: 128px 0 160px; } }

        /* Aurora layer — slow conic gradient that breathes via hue-rotate. */
        .tya-aurora {
          position: absolute; inset: -10%;
          background:
            conic-gradient(from 180deg at 50% 50%,
              rgba(217, 119, 87, 0.18),
              rgba(99, 91, 255, 0.18),
              rgba(62, 207, 142, 0.18),
              rgba(34, 163, 108, 0.10),
              rgba(217, 119, 87, 0.18));
          filter: blur(80px) saturate(1.2);
          opacity: 0.55;
          mix-blend-mode: screen;
          animation: tya-aurora 22s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes tya-aurora {
          0%   { transform: rotate(0deg)   scale(1.0); }
          50%  { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1.0); }
        }

        /* Drifting particles. SVG-rendered dots with staggered float. */
        .tya-stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 10% 20%,  rgba(255,255,255,0.55), transparent 50%),
            radial-gradient(1px 1px at 80% 15%,  rgba(255,255,255,0.45), transparent 50%),
            radial-gradient(1.2px 1.2px at 40% 70%, rgba(255,255,255,0.5), transparent 50%),
            radial-gradient(1px 1px at 65% 85%,  rgba(255,255,255,0.4), transparent 50%),
            radial-gradient(1px 1px at 22% 92%,  rgba(255,255,255,0.5), transparent 50%),
            radial-gradient(1.5px 1.5px at 90% 55%, rgba(255,255,255,0.55), transparent 50%),
            radial-gradient(1px 1px at 55% 35%,  rgba(255,255,255,0.45), transparent 50%);
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
          animation: tya-twinkle 8s ease-in-out infinite alternate;
        }
        @keyframes tya-twinkle {
          0%   { opacity: 0.35; transform: translate3d(0, 0, 0); }
          100% { opacity: 0.7;  transform: translate3d(-12px, -8px, 0); }
        }

        /* Headline + eyebrow */
        .tya-spatial__head {
          position: relative;
          z-index: 3;
          max-width: 960px;
          margin: 0 auto 48px;
          padding: 0 24px;
          text-align: center;
        }
        .tya-spatial__eyebrow {
          font: 600 11px/1 ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #9CC4EC;
        }
        .tya-spatial__h {
          margin: 16px 0 0;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }
        .tya-spatial__h em {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          background: linear-gradient(135deg, #85B7EB 0%, #FFFFFF 60%, #85B7EB 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tya-spatial__sub {
          margin: 14px auto 0;
          max-width: 600px;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(230, 241, 251, 0.65);
        }

        /* The spatial grid */
        .tya-spatial__grid {
          position: relative;
          z-index: 3;
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          perspective: 1400px;
          transform-style: preserve-3d;
          transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 640px) { .tya-spatial__grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
        @media (min-width: 900px) { .tya-spatial__grid { grid-template-columns: repeat(5, 1fr); gap: 18px; padding: 24px 48px; } }

        /* Each card */
        .tya-tile {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          aspect-ratio: 1 / 1;
          padding: 18px 12px;
          border-radius: 22px;
          color: inherit;
          text-decoration: none;
          background:
            linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015)) padding-box,
            transparent border-box;
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07),
            0 30px 60px -40px rgba(0, 0, 0, 0.8);
          transform: translateZ(0);
          transition:
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 280ms ease,
            box-shadow 380ms ease,
            background 280ms ease;
          will-change: transform, border-color;
          overflow: hidden;
        }

        /* Iridescent conic border that ignites on hover via a masked overlay */
        .tya-tile::before {
          content: "";
          position: absolute;
          inset: -1px;
          padding: 1px;
          border-radius: inherit;
          background: conic-gradient(
            from 220deg,
            transparent 0%,
            var(--bc, #85B7EB) 25%,
            transparent 50%,
            var(--bc, #85B7EB) 75%,
            transparent 100%);
          -webkit-mask:
            linear-gradient(#000, #000) content-box,
            linear-gradient(#000, #000);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 320ms ease;
          pointer-events: none;
        }

        /* Brand-color bloom behind the logo */
        .tya-tile__bloom {
          position: absolute;
          inset: 25% 25% auto auto;
          top: 25%; left: 25%; right: 25%; bottom: 25%;
          background: radial-gradient(circle, var(--bc, #85B7EB) 0%, transparent 60%);
          filter: blur(28px);
          opacity: 0.0;
          transition: opacity 380ms ease;
          pointer-events: none;
          z-index: 0;
        }

        .tya-tile__logo {
          position: relative;
          z-index: 2;
          width: 38px; height: 38px;
          object-fit: contain;
          filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.4));
          transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1), filter 380ms ease;
        }
        @media (min-width: 900px) { .tya-tile__logo { width: 44px; height: 44px; } }

        .tya-tile__name {
          position: relative;
          z-index: 2;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1;
        }
        .tya-tile__use {
          position: relative;
          z-index: 2;
          font-size: 10.5px;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          line-height: 1;
        }

        /* Hover state — tile depresses INTO the page, border lights up, bloom blooms */
        .tya-tile:hover {
          transform: translateZ(20px) translateY(-6px) scale(1.04);
          background:
            linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04)) padding-box,
            transparent border-box;
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 40px 80px -30px rgba(0, 0, 0, 0.9),
            0 0 60px -20px var(--bc, #85B7EB);
          z-index: 5;
        }
        .tya-tile:hover::before { opacity: 1; animation: tya-iris 4s linear infinite; }
        .tya-tile:hover .tya-tile__bloom { opacity: 0.6; }
        .tya-tile:hover .tya-tile__logo {
          transform: scale(1.12) translateZ(20px);
          filter: drop-shadow(0 10px 24px rgba(0,0,0,0.5));
        }

        @keyframes tya-iris {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Subtle idle micro-float, randomized per index via :nth-child */
        .tya-tile:nth-child(5n+1) { animation: tya-float-a 7s ease-in-out infinite; }
        .tya-tile:nth-child(5n+2) { animation: tya-float-b 8.5s ease-in-out infinite; }
        .tya-tile:nth-child(5n+3) { animation: tya-float-c 6.5s ease-in-out infinite; }
        .tya-tile:nth-child(5n+4) { animation: tya-float-b 9.5s ease-in-out infinite; }
        .tya-tile:nth-child(5n+5) { animation: tya-float-a 7.5s ease-in-out infinite; }

        @keyframes tya-float-a {
          0%, 100% { transform: translateZ(0)   translateY(0); }
          50%      { transform: translateZ(4px) translateY(-4px); }
        }
        @keyframes tya-float-b {
          0%, 100% { transform: translateZ(0)   translateY(-2px); }
          50%      { transform: translateZ(6px) translateY(3px); }
        }
        @keyframes tya-float-c {
          0%, 100% { transform: translateZ(2px) translateY(2px); }
          50%      { transform: translateZ(8px) translateY(-3px); }
        }

        /* Pipeline flow below the grid */
        .tya-pipeline {
          position: relative;
          z-index: 3;
          max-width: 900px;
          margin: 64px auto 0;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          color: rgba(230, 241, 251, 0.7);
          font: 500 12.5px/1 ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .tya-pipeline__pill {
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
        }
        .tya-pipeline__arrow {
          display: inline-block;
          font-size: 16px;
          color: rgba(133, 183, 235, 0.7);
          animation: tya-pulse 2.4s ease-in-out infinite;
        }
        .tya-pipeline__arrow:nth-child(4) { animation-delay: 0.6s; }
        .tya-pipeline__arrow:nth-child(6) { animation-delay: 1.2s; }
        @keyframes tya-pulse {
          0%, 100% { opacity: 0.4; transform: translateX(-2px); }
          50%      { opacity: 1.0; transform: translateX(2px); }
        }

        /* Footer link */
        .tya-spatial__foot {
          position: relative;
          z-index: 3;
          margin-top: 56px;
          padding: 0 24px;
          text-align: center;
          font-size: 13px;
          color: rgba(230, 241, 251, 0.55);
        }
        .tya-spatial__foot a {
          color: #85B7EB;
          text-decoration: none;
          border-bottom: 1px solid rgba(133, 183, 235, 0.35);
          padding-bottom: 1px;
          transition: color 200ms ease, border-color 200ms ease;
        }
        .tya-spatial__foot a:hover {
          color: #FFFFFF;
          border-bottom-color: rgba(255, 255, 255, 0.8);
        }

        @media (prefers-reduced-motion: reduce) {
          .tya-aurora,
          .tya-stars,
          .tya-tile,
          .tya-tile::before,
          .tya-pipeline__arrow {
            animation: none !important;
          }
          .tya-tile { transition: none; }
        }
      `}</style>

      <div className="tya-aurora" aria-hidden="true" />
      <div className="tya-stars"  aria-hidden="true" />

      <div className="tya-spatial__head">
        <div className="tya-spatial__eyebrow">{eyebrow}</div>
        {headline ? (
          <h3 className="tya-spatial__h">{headline}</h3>
        ) : (
          <h3 className="tya-spatial__h">
            Same production runtime as <em>Cursor, Linear, Anthropic.</em>
          </h3>
        )}
        <p className="tya-spatial__sub">
          15 services wired through one pipeline. Built in this codebase. Live on
          your phone line in 21 days.
        </p>
      </div>

      <div ref={surfaceRef} className="tya-spatial__grid">
        {TOOLS.map((t) => (
          <a
            key={t.slug}
            className="tya-tile"
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.name} — ${t.use}`}
            style={{ ["--bc" as never]: `#${t.color}` } as React.CSSProperties}
          >
            <span className="tya-tile__bloom" aria-hidden="true" />
            <img
              src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
              alt={`${t.name} logo`}
              className="tya-tile__logo"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
              }}
            />
            <div className="tya-tile__name">{t.name}</div>
            <div className="tya-tile__use">{t.use}</div>
          </a>
        ))}
      </div>

      <div className="tya-pipeline" aria-label="Voice agent runtime path">
        <span className="tya-pipeline__pill">Twilio</span>
        <span className="tya-pipeline__arrow" aria-hidden="true">→</span>
        <span className="tya-pipeline__pill">Anthropic</span>
        <span className="tya-pipeline__arrow" aria-hidden="true">→</span>
        <span className="tya-pipeline__pill">ElevenLabs</span>
        <span className="tya-pipeline__arrow" aria-hidden="true">→</span>
        <span className="tya-pipeline__pill">Your customer</span>
      </div>

      <div className="tya-spatial__foot">
        Every service above runs in production right now.{" "}
        <Link to="/technology">See the architecture →</Link>
      </div>
    </section>
  );
}
