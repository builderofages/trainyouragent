// src/components/illustrations/DashboardIllo.tsx
// Abstract dashboard: bars + sparkline + KPI dot.

import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function DashboardIllo({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .d-bar  { animation: dBarGrow 2.2s cubic-bezier(.2,.7,.3,1) infinite alternate; transform-origin: bottom center; transform-box: fill-box; }
            .d-spark { stroke-dasharray: 260; stroke-dashoffset: 260; animation: dSpark 3.4s ease-out infinite; }
            .d-dot  { animation: dPulse 2.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
          }
          @keyframes dBarGrow { from { transform: scaleY(.7) } to { transform: scaleY(1) } }
          @keyframes dSpark   { 0% { stroke-dashoffset: 260 } 60%,100% { stroke-dashoffset: 0 } }
          @keyframes dPulse   { 0%,100% { transform: scale(1); opacity: .9 } 50% { transform: scale(1.25); opacity: 1 } }
        `}</style>
      </defs>

      {/* card frame */}
      <rect x="10" y="14" width="300" height="172" rx="14" fill="#FFFFFF" stroke="#185FA5" strokeOpacity="0.2"/>

      {/* eyebrow */}
      <rect x="26" y="32" width="60" height="6" rx="3" fill="#185FA5" opacity="0.5"/>
      <rect x="26" y="46" width="120" height="10" rx="3" fill="#042C53"/>

      {/* KPI dot */}
      <circle className="d-dot" cx="282" cy="44" r="6" fill="#22A36C" />

      {/* bars */}
      <g fill="#185FA5">
        <rect className="d-bar" x="28"  y="120" width="14" height="40" rx="3" style={{ animationDelay: "0ms" }} />
        <rect className="d-bar" x="50"  y="100" width="14" height="60" rx="3" style={{ animationDelay: "150ms" }} />
        <rect className="d-bar" x="72"  y="115" width="14" height="45" rx="3" style={{ animationDelay: "300ms" }} />
        <rect className="d-bar" x="94"  y="86"  width="14" height="74" rx="3" style={{ animationDelay: "450ms" }} fill="#042C53" />
        <rect className="d-bar" x="116" y="98"  width="14" height="62" rx="3" style={{ animationDelay: "600ms" }} />
        <rect className="d-bar" x="138" y="78"  width="14" height="82" rx="3" style={{ animationDelay: "750ms" }} fill="#042C53" />
      </g>

      {/* sparkline */}
      <polyline
        className="d-spark"
        points="172,140 192,118 212,128 232,98 252,108 272,82 292,90"
        fill="none"
        stroke="#185FA5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="292" cy="90" r="3.5" fill="#042C53" />
    </svg>
  );
}
