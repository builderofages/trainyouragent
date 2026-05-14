// src/components/StatCounter.tsx
// Animated number counter that ticks up when scrolled into view.
// Use for proof-strip stats — converts way better than static numbers.

import { useEffect, useRef, useState } from "react";

type Props = {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;     // ms
  decimals?: number;
  label?: string;
  display?: "default" | "playfair";
};

export default function StatCounter({ end, prefix = "", suffix = "", duration = 1400, decimals = 0, label, display = "playfair" }: Props) {
  const [v, setV] = useState(0);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting && !seen) setSeen(true); });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(end * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [seen, end, duration]);

  return (
    <div ref={ref}>
      <div
        className="text-[40px] sm:text-[56px] leading-none tracking-tight font-semibold text-[#042C53]"
        style={{ fontFamily: display === "playfair" ? "'Playfair Display', serif" : "inherit" }}
      >
        {prefix}{v.toFixed(decimals)}{suffix}
      </div>
      {label && <div className="mt-2 text-[13px] text-slate-600 leading-snug" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>{label}</div>}
    </div>
  );
}
