// src/components/LiveActivity.tsx
// v61 HONESTY FIX: previously a hardcoded "Sarah / Hector / Marcus" rotator.
// That contradicted the /live page's "Real events only" promise. Now:
//   - Fetches /api/recent-activity (the same honest feed the ticker uses).
//   - If the feed has zero items, the component renders NOTHING.
//   - Rotation only kicks in when there are >=2 real items.
//   - Dismissable; dismissal persists in sessionStorage for the tab.
//   - Hidden on prefers-reduced-motion (no rotating animation).

import { useEffect, useState } from "react";

type Activity = {
  who: string;
  where: string;
  action: string;
  ago: string;
};

const STORAGE_KEY = "tya:liveactivity:dismissed";

export default function LiveActivity() {
  const [items, setItems] = useState<Activity[]>([]);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const was = window.sessionStorage.getItem(STORAGE_KEY) === "1";
      setDismissed(was);
      if (was) return;
    } catch {}

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const showT = window.setTimeout(() => setVisible(true), 2000);
    return () => { window.clearTimeout(showT); };
  }, []);

  // Fetch real activity ONLY. No synthetic fallback.
  useEffect(() => {
    let alive = true;
    fetch("/api/recent-activity")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.ok && Array.isArray(d.items) && d.items.length) {
          setItems(
            d.items.map((x: { who: string; where: string; action: string; ago: string }) => ({
              who: x.who, where: x.where, action: x.action, ago: x.ago,
            })),
          );
        }
        setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  // Rotate only when we have >=2 items.
  useEffect(() => {
    if (!visible || dismissed || items.length < 2) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => window.clearInterval(t);
  }, [visible, dismissed, items.length]);

  // Credibility gate: render nothing if dismissed, hidden, or empty.
  if (dismissed || !visible || !loaded || items.length === 0) return null;

  const a = items[idx];
  if (!a) return null;

  const onDismiss = () => {
    setDismissed(true);
    try { window.sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 max-w-[340px] hidden sm:block"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <div
        className="rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_-15px_rgba(4,44,83,0.25)] px-4 py-3 pr-9 relative animate-[fadein_.45s_ease-out]"
        key={idx}
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss live activity"
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full text-slate-400 hover:text-[#042C53] hover:bg-slate-100 text-[14px] leading-none flex items-center justify-center"
        >
          ×
        </button>
        <div className="flex items-start gap-3">
          <span
            className="w-2 h-2 rounded-full bg-[#22A36C] mt-2 flex-shrink-0 animate-pulse"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="text-[13px] text-[#042C53] leading-snug">
              <span className="font-semibold">{a.who}</span>{" "}
              <span className="text-slate-600">— in {a.where}</span>{" "}
              <span className="text-[#042C53]">{a.action}.</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-400">
              <span>{a.ago}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] font-semibold">
                <span className="w-1 h-1 rounded-full bg-[#185FA5]" aria-hidden="true" />
                Real activity feed
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
