// src/components/illustrations/NetworkIllo.tsx
// Subtle nodes-and-edges network. Pulses lightly; respects reduced-motion.
// Brand colors only. aria-hidden — purely decorative.

import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function NetworkIllo({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id="netGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#185FA5" stopOpacity="0.18" />
          <stop offset="1" stopColor="#185FA5" stopOpacity="0" />
        </radialGradient>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .n-pulse { animation: nPulse 3.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
            .n-pulse-2 { animation-delay: 1.2s; }
            .n-pulse-3 { animation-delay: 2.4s; }
            .n-edge   { animation: nEdge 4s ease-in-out infinite; stroke-dasharray: 4 6; }
          }
          @keyframes nPulse { 0%,100% { transform: scale(1); opacity: .9 } 50% { transform: scale(1.25); opacity: 1 } }
          @keyframes nEdge  { 0%,100% { stroke-dashoffset: 0 } 50% { stroke-dashoffset: 20 } }
        `}</style>
      </defs>

      <rect width="320" height="200" fill="url(#netGlow)" />

      <g stroke="#185FA5" strokeOpacity="0.45" strokeWidth="1.2" fill="none" className="n-edge">
        <line x1="60"  y1="50"  x2="160" y2="100"/>
        <line x1="260" y1="40"  x2="160" y2="100"/>
        <line x1="40"  y1="140" x2="160" y2="100"/>
        <line x1="280" y1="150" x2="160" y2="100"/>
        <line x1="160" y1="100" x2="200" y2="170"/>
      </g>

      <g fill="#185FA5">
        <circle cx="60"  cy="50"  r="6" className="n-pulse" />
        <circle cx="260" cy="40"  r="6" className="n-pulse n-pulse-2" />
        <circle cx="40"  cy="140" r="6" className="n-pulse n-pulse-3" />
        <circle cx="280" cy="150" r="6" className="n-pulse n-pulse-2" />
        <circle cx="200" cy="170" r="6" className="n-pulse n-pulse-3" />
      </g>

      <circle cx="160" cy="100" r="14" fill="#042C53" />
      <circle cx="160" cy="100" r="5"  fill="#E6F1FB" />
    </svg>
  );
}
