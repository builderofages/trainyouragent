// src/components/illustrations/ChatIllo.tsx
// Minimal speech bubbles + cursor blink.

import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function ChatIllo({ className, style }: Props) {
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
            .c-fade1 { animation: cFade 4s ease-in-out infinite; }
            .c-fade2 { animation: cFade 4s ease-in-out infinite; animation-delay: 1.3s; }
            .c-cursor { animation: cBlink 1.1s steps(2, end) infinite; }
          }
          @keyframes cFade { 0% { opacity: 0; transform: translateY(8px) } 10%,80% { opacity: 1; transform: translateY(0) } 100% { opacity: 0 } }
          @keyframes cBlink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        `}</style>
      </defs>

      {/* User bubble (left, tint) */}
      <g className="c-fade1">
        <rect x="20" y="30" width="170" height="48" rx="16" fill="#E6F1FB" />
        <rect x="36" y="48" width="100" height="6"  rx="3" fill="#185FA5" opacity="0.55" />
        <rect x="36" y="60" width="60"  height="6"  rx="3" fill="#185FA5" opacity="0.35" />
      </g>

      {/* Agent bubble (right, navy) */}
      <g className="c-fade2">
        <rect x="130" y="100" width="170" height="60" rx="16" fill="#042C53" />
        <rect x="146" y="118" width="130" height="6"  rx="3" fill="#FFFFFF" opacity="0.92" />
        <rect x="146" y="130" width="90"  height="6"  rx="3" fill="#FFFFFF" opacity="0.7" />
        <rect x="146" y="142" width="70"  height="6"  rx="3" fill="#FFFFFF" opacity="0.5" />
      </g>

      {/* Typing cursor */}
      <rect className="c-cursor" x="36" y="80" width="2.5" height="14" fill="#042C53" />
    </svg>
  );
}
