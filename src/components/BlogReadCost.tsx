// src/components/BlogReadCost.tsx
// v41: read-time + "Time you'd spend doing this manually" hover tip.
// Pulls word count from DOM after mount so it works for any MDX post.

import { useEffect, useState } from "react";

const WPM = 230;

type Props = { text?: string; slug?: string };

export default function BlogReadCost({ text }: Props) {
  const [minutes, setMinutes] = useState<number>(estimateFromText(text || ""));

  useEffect(() => {
    if (typeof document === "undefined") return;
    // Recompute from the rendered article body once MDX is mounted.
    const article = document.querySelector("article .prose") as HTMLElement | null;
    if (article && article.innerText) {
      const words = article.innerText.split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.round(words / WPM));
      setMinutes(mins);
    }
  }, []);

  const manualHours = Math.max(1, Math.round(minutes * 60 / 60)); // joke: read-min × 60 in min == that many hours
  // Above produces minutes*60/60 = minutes. We want minutes × 60 in MINUTES → hours = minutes.
  // Spec asked: hours = read time × 60 (joke conversion). minutes × 60 minutes / 60 = minutes hours.

  return (
    <div className="mb-8 inline-flex items-center gap-2 group relative">
      <span
        className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full cursor-help"
        tabIndex={0}
        aria-describedby="tya-readcost-tip"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <strong>{minutes} min read</strong>
        <span className="text-slate-400">·</span>
        <span className="underline decoration-dotted decoration-slate-400">cost to read?</span>
      </span>

      <div
        id="tya-readcost-tip"
        role="tooltip"
        className="absolute left-0 top-full mt-2 w-72 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"
      >
        <div className="rounded-lg bg-[#042C53] text-white text-[12px] px-3 py-2 leading-snug shadow-lg">
          <strong>{minutes} min</strong> to read this. Time you'd spend
          doing this manually: <strong>~{manualHours} hours</strong>.
        </div>
      </div>
    </div>
  );
}

function estimateFromText(s: string): number {
  if (!s) return 3;
  const words = s.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
