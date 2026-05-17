// src/components/illustrations/VoiceWaveIllo.tsx
// Animated voice waveform — looped sweep, brand colors only.

import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

const BARS = 28;

export default function VoiceWaveIllo({ className, style }: Props) {
  // pseudo-random but deterministic heights for the wave silhouette
  const heights = Array.from({ length: BARS }, (_, i) => {
    const v = Math.sin(i * 0.78) * 0.5 + Math.cos(i * 0.31) * 0.35 + Math.sin(i * 1.6) * 0.2;
    return 20 + Math.abs(v) * 50; // 20..70
  });

  return (
    <svg
      viewBox="0 0 320 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .v-bar { animation: vBar 1.8s ease-in-out infinite; transform-origin: 50% 50%; transform-box: fill-box; }
          }
          @keyframes vBar { 0%,100% { transform: scaleY(0.55) } 50% { transform: scaleY(1) } }
        `}</style>
      </defs>

      <g fill="#185FA5">
        {heights.map((h, i) => {
          const x = 10 + i * 11;
          const y = 60 - h / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="5"
              height={h}
              rx="2.5"
              className="v-bar"
              style={{ animationDelay: `${(i * 60) % 1800}ms`, fill: i % 4 === 0 ? "#042C53" : "#185FA5" }}
            />
          );
        })}
      </g>
    </svg>
  );
}
