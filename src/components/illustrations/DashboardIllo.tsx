// src/components/illustrations/DashboardIllo.tsx
// v61: polished "compounding growth" dashboard — labeled axes, compounding
// curve over data-feel bars, growth pill, status row. No longer reads as a
// gray-bar wireframe.

import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";
const MIST = "#DCEBFA";
const GREEN = "#22A36C";

export default function DashboardIllo({ className, style }: Props) {
  // Compounding-growth bar heights (left → right, "agents running")
  const bars = [
    { x: 32,  h: 22, label: "M1" },
    { x: 62,  h: 32, label: "M2" },
    { x: 92,  h: 46, label: "M3" },
    { x: 122, h: 60, label: "M4" },
    { x: 152, h: 80, label: "M5" },
    { x: 182, h: 102, label: "M6" },
  ];

  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.28" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={NAVY} />
          <stop offset="100%" stopColor={BLUE} />
        </linearGradient>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .d-bar { animation: dBarGrow 1.4s cubic-bezier(.2,.7,.3,1) both; transform-origin: bottom center; transform-box: fill-box; }
            .d-line { stroke-dasharray: 320; stroke-dashoffset: 320; animation: dLine 2.0s .35s ease-out forwards; }
            .d-fill { opacity: 0; animation: dFade 1.4s .9s ease-out forwards; }
            .d-dot { opacity: 0; transform-origin: center; transform-box: fill-box; animation: dDot 0.6s 1.6s ease-out forwards; }
          }
          @keyframes dBarGrow { from { transform: scaleY(.05) } to { transform: scaleY(1) } }
          @keyframes dLine { to { stroke-dashoffset: 0 } }
          @keyframes dFade { to { opacity: 1 } }
          @keyframes dDot { from { opacity: 0; transform: scale(.4) } 60% { opacity: 1; transform: scale(1.25) } to { opacity: 1; transform: scale(1) } }
        `}</style>
      </defs>

      {/* card frame */}
      <rect x="6" y="8" width="308" height="204" rx="16" fill="#FFFFFF" stroke={BLUE} strokeOpacity="0.18" />

      {/* header strip */}
      <g>
        {/* eyebrow */}
        <rect x="22" y="22" width="66" height="6" rx="3" fill={BLUE} opacity="0.45" />
        {/* title bar */}
        <rect x="22" y="34" width="142" height="11" rx="3" fill={NAVY} />
        {/* growth pill */}
        <rect x="232" y="22" width="68" height="22" rx="11" fill="#E5F6EE" />
        <circle cx="244" cy="33" r="3.5" fill={GREEN} />
        <text x="252" y="36.5" fontFamily="'Inter Tight', system-ui, sans-serif" fontSize="10" fontWeight="700" fill={GREEN}>+38% MoM</text>
      </g>

      {/* chart frame */}
      <g>
        {/* horizontal gridlines */}
        <line x1="24" y1="86" x2="296" y2="86" stroke="#E6EEF6" strokeWidth="1" />
        <line x1="24" y1="120" x2="296" y2="120" stroke="#E6EEF6" strokeWidth="1" />
        <line x1="24" y1="154" x2="296" y2="154" stroke="#E6EEF6" strokeWidth="1" />
        {/* baseline */}
        <line x1="24" y1="188" x2="296" y2="188" stroke="#CFDCE9" strokeWidth="1.2" />

        {/* bars */}
        {bars.map((b, i) => (
          <g key={i}>
            <rect
              className="d-bar"
              x={b.x}
              y={188 - b.h}
              width="22"
              height={b.h}
              rx="3"
              fill="url(#barFill)"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          </g>
        ))}

        {/* compounding curve area + line */}
        <path
          className="d-fill"
          d="M 43 174 Q 73 158 90 142 T 132 110 T 175 78 T 217 56 T 260 36 T 290 28 L 290 188 L 43 188 Z"
          fill="url(#dashFill)"
        />
        <path
          className="d-line"
          d="M 43 174 Q 73 158 90 142 T 132 110 T 175 78 T 217 56 T 260 36 T 290 28"
          fill="none"
          stroke={NAVY}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* leading dot */}
        <g className="d-dot">
          <circle cx="290" cy="28" r="5" fill="#FFFFFF" stroke={NAVY} strokeWidth="2" />
          <circle cx="290" cy="28" r="2.2" fill={NAVY} />
        </g>
      </g>

      {/* footer status row */}
      <g transform="translate(0, 196)">
        <circle cx="28" cy="0" r="3" fill={GREEN} />
        <rect x="36" y="-4" width="92" height="7" rx="2" fill={NAVY} opacity="0.7" />
        <rect x="138" y="-4" width="58" height="7" rx="2" fill={BLUE} opacity="0.5" />
        <rect x="204" y="-4" width="46" height="7" rx="2" fill={BLUE} opacity="0.35" />
        <rect x="258" y="-4" width="38" height="7" rx="2" fill={BLUE} opacity="0.35" />
      </g>
    </svg>
  );
}
