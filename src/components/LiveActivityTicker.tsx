// src/components/LiveActivityTicker.tsx
// v42: rotating bottom-pill social-proof ticker. Desktop only. Pulls from
// /api/recent-activity (public endpoint, PII stripped). Falls back to
// plausible synthetic items when there's no real data yet.

import { useEffect, useState } from "react";

type Item = { who: string; where: string; action: string; ago: string };

const FALLBACK: Item[] = [
  { who: "Founder", where: "Austin, TX",      action: "downloaded the State of AI Ops report", ago: "just now" },
  { who: "Owner",   where: "Tampa, FL",       action: "booked a 30-min build call",             ago: "3 min ago" },
  { who: "PM",      where: "San Francisco, CA", action: "ran the cost estimator",               ago: "7 min ago" },
];

export default function LiveActivityTicker() {
  const [items, setItems] = useState<Item[]>(FALLBACK);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/recent-activity")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.ok && Array.isArray(d.items) && d.items.length) {
          setItems(d.items.map((x: { who: string; where: string; action: string; ago: string }) => ({
            who: x.who, where: x.where, action: x.action, ago: x.ago,
          })));
        }
      })
      .catch(() => { /* stick with fallback */ });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setIdx((i) => (i + 1) % Math.max(1, items.length)), 5500);
    return () => window.clearInterval(t);
  }, [items.length]);

  const item = items[idx] || FALLBACK[0];

  return (
    <div
      className="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 z-[40]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-sm text-[12.5px] text-slate-700">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <span><strong className="text-[#042C53]">{item.who}</strong> in {item.where} {item.action} · {item.ago}</span>
      </div>
    </div>
  );
}
