// src/components/illustrations/TrustShieldIllo.tsx
// Minimal shield + check + radiating arcs.

import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function TrustShieldIllo({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .t-arc1 { animation: tArc 3.6s ease-in-out infinite; transform-origin: 110px 115px; }
            .t-arc2 { animation: tArc 3.6s ease-in-out infinite; transform-origin: 110px 115px; animation-delay: 1.2s; }
            .t-arc3 { animation: tArc 3.6s ease-in-out infinite; transform-origin: 110px 115px; animation-delay: 2.4s; }
            .t-chk  { stroke-dasharray: 40; stroke-dashoffset: 40; animation: tCheck 2.2s ease-in-out 0.4s infinite; }
          }
          @keyframes tArc   { 0% { opacity: 0; transform: scale(0.85) } 30% { opacity: .85 } 100% { opacity: 0; transform: scale(1.25) } }
          @keyframes tCheck { 0% { stroke-dashoffset: 40 } 40%,100% { stroke-dashoffset: 0 } }
        `}</style>
      </defs>

      {/* radiating arcs */}
      <g fill="none" stroke="#185FA5" strokeOpacity="0.5" strokeWidth="1.4">
        <circle className="t-arc1" cx="110" cy="115" r="78" />
        <circle className="t-arc2" cx="110" cy="115" r="78" />
        <circle className="t-arc3" cx="110" cy="115" r="78" />
      </g>

      {/* shield body */}
      <path
        d="M 110 38 L 168 62 L 168 122 C 168 158 138 184 110 196 C 82 184 52 158 52 122 L 52 62 Z"
        fill="#E6F1FB"
        stroke="#042C53"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* check */}
      <polyline
        className="t-chk"
        points="80,118 102,140 142,96"
        fill="none"
        stroke="#042C53"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
