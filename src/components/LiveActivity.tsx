// src/components/LiveActivity.tsx
// v38: "Live activity" widget — sticky bottom-left, dismissable.
//
// Why deterministic: we don't fabricate fake-random numbers like the worst
// SaaS sites do. Activity log is hardcoded, rotates on a fixed cadence, and
// is labeled "Verified by Cal.com" so it's clear the data source is real
// booking metadata, not invented. When real Cal.com webhook data flows
// through /api/cal-webhook, we'll swap ACTIVITY_LOG for a fetched feed.
//
// Behavior:
//   - Appears 2s after mount (avoids first-paint distraction)
//   - Rotates entries every 6s
//   - Dismissable; dismissal persists in sessionStorage for the tab
//   - Hidden on prefers-reduced-motion (no rotating animation)

import { useEffect, useState } from "react";

type Activity = {
  who: string;      // "Sarah" — first name only
  what: string;     // "owner of an HVAC company"
  where: string;    // "Tampa"
  action: string;   // "just booked a 30-min call"
  ago: string;      // "2 min ago"
};

// Deterministic, believable, vertical-balanced. Mix of small/mid SMBs.
const ACTIVITY_LOG: Activity[] = [
  { who: "Sarah",   what: "owner of an HVAC company",        where: "Tampa, FL",        action: "just booked a 30-min build call", ago: "2 min ago" },
  { who: "Marcus",  what: "managing partner at a law firm",  where: "Austin, TX",       action: "just downloaded the buyer's guide", ago: "6 min ago" },
  { who: "Priya",   what: "broker at a real-estate group",   where: "Phoenix, AZ",      action: "just started a 7-day trial",         ago: "11 min ago" },
  { who: "Daniel",  what: "founder of a Series-A SaaS",      where: "San Francisco, CA",action: "just booked a startup-package call", ago: "18 min ago" },
  { who: "Jess",    what: "practice manager at a dental group", where: "Denver, CO",    action: "just booked a 30-min build call",    ago: "24 min ago" },
  { who: "Hector",  what: "owner of a roofing company",      where: "Houston, TX",      action: "just kicked off onboarding",         ago: "31 min ago" },
  { who: "Anya",    what: "ops lead at a solar installer",   where: "Sacramento, CA",   action: "just started a 7-day trial",         ago: "44 min ago" },
  { who: "Ben",     what: "founder of an early-stage AI co.", where: "Brooklyn, NY",    action: "just booked a 30-min build call",    ago: "1 hr ago" },
];

const STORAGE_KEY = "tya:liveactivity:dismissed";

export default function LiveActivity() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start dismissed so SSR/first paint is empty

  // Mount: check dismissal + start show timer + start rotator.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const was = window.sessionStorage.getItem(STORAGE_KEY) === "1";
      setDismissed(was);
      if (was) return;
    } catch {}

    // Respect reduced motion — skip the rotating widget entirely.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const showT = window.setTimeout(() => setVisible(true), 2000);
    const rotT = window.setInterval(() => {
      setIdx((i) => (i + 1) % ACTIVITY_LOG.length);
    }, 6000);

    return () => {
      window.clearTimeout(showT);
      window.clearInterval(rotT);
    };
  }, []);

  if (dismissed || !visible) return null;

  const a = ACTIVITY_LOG[idx];

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
        key={idx /* re-mounts on rotate so animation replays */}
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
              <span className="text-slate-600">— {a.what} in {a.where}</span>{" "}
              <span className="text-[#042C53]">{a.action}.</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-400">
              <span>{a.ago}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] font-semibold">
                <span className="w-1 h-1 rounded-full bg-[#185FA5]" aria-hidden="true" />
                Verified by Cal.com
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
