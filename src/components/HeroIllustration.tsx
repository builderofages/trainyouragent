// src/components/HeroIllustration.tsx
// v44: animated SVG of the Prism Node with orbit particles + soft blue halo.
// All animation is CSS, gated behind prefers-reduced-motion.

import { useId } from "react";

export default function HeroIllustration({ className = "" }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  const grad = `g-${gid}`;
  const glow = `gl-${gid}`;
  return (
    <div className={className} aria-hidden="true">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes tya-pulse-${gid} { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.04); opacity: 1; } }
          @keyframes tya-orbit-${gid}  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes tya-orbit-rev-${gid} { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes tya-twinkle-${gid} { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          .tya-pulse-${gid} { transform-origin: 160px 160px; animation: tya-pulse-${gid} 4.5s ease-in-out infinite; }
          .tya-orbit-${gid} { transform-origin: 160px 160px; animation: tya-orbit-${gid} 18s linear infinite; }
          .tya-orbit-rev-${gid} { transform-origin: 160px 160px; animation: tya-orbit-rev-${gid} 26s linear infinite; }
          .tya-twinkle-${gid} { animation: tya-twinkle-${gid} 2.8s ease-in-out infinite; }
        }
      `}</style>
      <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id={grad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BDDAF4" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#E6F1FB" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E6F1FB" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={glow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#185FA5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#185FA5" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* halo */}
        <circle cx="160" cy="160" r="150" fill={`url(#${grad})`} />
        <circle cx="160" cy="160" r="90" fill={`url(#${glow})`} />

        {/* outer orbit ring */}
        <g className={`tya-orbit-${gid}`}>
          <circle cx="160" cy="160" r="120" fill="none" stroke="#185FA5" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="280" cy="160" r="4" fill="#185FA5" />
          <circle cx="100" cy="60"  r="3" fill="#185FA5" opacity="0.7" />
        </g>

        {/* inner orbit ring (reverse) */}
        <g className={`tya-orbit-rev-${gid}`}>
          <circle cx="160" cy="160" r="78" fill="none" stroke="#042C53" strokeOpacity="0.18" strokeWidth="1" />
          <circle cx="82"  cy="160" r="3" fill="#042C53" />
          <circle cx="238" cy="160" r="2.5" fill="#042C53" opacity="0.6" />
        </g>

        {/* Prism Node core (pulses gently) */}
        <g className={`tya-pulse-${gid}`} stroke="#042C53" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 160 90 L 230 160 L 160 230 L 90 160 Z" strokeWidth="4" />
          <path d="M 160 90 L 160 230" strokeWidth="2.4" />
          <path d="M 90 160 L 230 160" strokeWidth="2.4" />
          <circle cx="160" cy="160" r="6" fill="#042C53" stroke="none" />
        </g>

        {/* twinkles */}
        <g fill="#185FA5">
          <circle cx="60"  cy="220" r="2" className={`tya-twinkle-${gid}`} />
          <circle cx="260" cy="80"  r="1.6" className={`tya-twinkle-${gid}`} style={{ animationDelay: "1.2s" }} />
          <circle cx="240" cy="240" r="1.8" className={`tya-twinkle-${gid}`} style={{ animationDelay: "0.6s" }} />
          <circle cx="80"  cy="80"  r="1.4" className={`tya-twinkle-${gid}`} style={{ animationDelay: "1.8s" }} />
        </g>
      </svg>
    </div>
  );
}
