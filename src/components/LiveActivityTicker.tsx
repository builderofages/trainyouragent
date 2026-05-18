// src/components/LiveActivityTicker.tsx
// v61: HONEST-ONLY. The ticker now renders ONLY real events from
// /api/recent-activity. If the API returns no items, the component
// renders nothing. No "Sarah / Hector / Marcus / Founder" fallbacks.
// Throttled (15s first-show, 35–45s rotation), hover-pause, session
// dismiss, desktop-only.

import { useEffect, useRef, useState } from "react";

type Item = { who: string; where: string; action: string; ago: string };

const DISMISS_KEY = "tya_live_activity_dismissed";
const FIRST_SHOW_MS = 15_000;
const ROTATION_MIN_MS = 35_000;
const ROTATION_MAX_MS = 45_000;

function dismissedThisSession(): boolean {
  if (typeof window === "undefined") return false;
  try { return sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
}
function markDismissed() {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
}

export default function LiveActivityTicker() {
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<number | null>(null);

  // First-show delay so the ticker doesn't pop in immediately.
  useEffect(() => {
    if (dismissedThisSession()) { setDismissed(true); return; }
    const t = window.setTimeout(() => setVisible(true), FIRST_SHOW_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Fetch real activity ONLY. No synthetic fallback.
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
        setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  // Throttled rotation — only when we have >1 real item.
  useEffect(() => {
    if (!visible || paused || items.length <= 1 || dismissed) return;
    const schedule = () => {
      const ms = ROTATION_MIN_MS + Math.floor(Math.random() * (ROTATION_MAX_MS - ROTATION_MIN_MS));
      timerRef.current = window.setTimeout(() => {
        setIdx((i) => (i + 1) % items.length);
        schedule();
      }, ms);
    };
    schedule();
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [visible, paused, items.length, dismissed]);

  // The credibility gate: if there's no real activity, render nothing.
  if (dismissed || !visible || !loaded || items.length === 0) return null;
  const item = items[idx];
  if (!item) return null;

  return (
    <div
      className="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 z-[40]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-sm text-[12.5px] text-slate-700">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <span><strong className="text-[#042C53]">{item.who}</strong> in {item.where} {item.action} · {item.ago}</span>
        <button
          type="button"
          onClick={() => { markDismissed(); setDismissed(true); }}
          aria-label="Dismiss activity ticker"
          className="ml-1 text-slate-400 hover:text-[#042C53] text-[14px] leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
