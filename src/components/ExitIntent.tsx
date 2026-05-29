// src/components/ExitIntent.tsx — v209
//
// Fires the lead-magnet modal ONCE per visitor when they've actually engaged
// with the site, then signal they're leaving. The previous version fired the
// instant the cursor left the top of the viewport — so people clicking into
// the URL bar got hit immediately on landing. That felt aggressive.
//
// New trigger rules (all must be true):
//   1. At least 60s on page (gives them time to read)
//   2. Scroll depth ≥ 50% (proves engagement, not just a glance)
//   3. THEN either:
//        - desktop: cursor leaves top of viewport, or
//        - mobile: 90s total time + 50% depth (no mouse signal on touch)
//   4. Not shown / dismissed in the last 14 days (localStorage cooldown,
//      keyed by visitor — survives tab close, not just session)
//   5. Not shown on /admin*, /portal*, or any /template/* prospect page
//      (those audiences shouldn't see consumer-funnel lead magnets)
//
// Renders nothing itself — wrap it with the modal you want triggered.

import { useEffect, useState } from "react";

type Props = { children: (props: { open: boolean; close: () => void }) => React.ReactNode };

const STORAGE_KEY = "tya:exitintent:shown-v2";       // 14-day cooldown
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;        // 14 days
const MIN_TIME_MS = 60_000;                          // 60s before any trigger
const MOBILE_FALLBACK_MS = 90_000;                   // 90s on mobile w/ depth
const MIN_SCROLL_DEPTH = 0.5;                        // 50%

// Paths where exit-intent should never fire — keeps it off prospect/admin/portal
const SUPPRESS_PREFIXES = ["/admin", "/portal", "/template/", "/cnnct"];

function recentlyShown(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (!ts) return false;
    return Date.now() - ts < COOLDOWN_MS;
  } catch { return false; }
}
function markShown() {
  try { window.localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* quota / privacy */ }
}
function suppressedPath(): boolean {
  if (typeof window === "undefined") return true;
  const p = window.location.pathname || "/";
  return SUPPRESS_PREFIXES.some((pre) => p.startsWith(pre));
}

export default function ExitIntent({ children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (recentlyShown() || suppressedPath()) return;

    const startedAt = Date.now();
    let maxDepth = 0;
    let armed = false;       // becomes true once both time+depth conditions met

    const trigger = () => {
      if (open || recentlyShown()) return;
      markShown();
      setOpen(true);
    };

    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / Math.max(1, document.body.scrollHeight);
      if (depth > maxDepth) maxDepth = depth;
      // arm once we've cleared both gates
      if (!armed && Date.now() - startedAt >= MIN_TIME_MS && maxDepth >= MIN_SCROLL_DEPTH) {
        armed = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      // Desktop only: cursor leaving via the top edge, only when armed
      if (!armed) return;
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    // Mobile fallback poll: once at MOBILE_FALLBACK_MS, if depth ≥ threshold
    // AND user is currently above the fold (i.e. they scrolled back up to
    // bounce), fire. This avoids interrupting someone still reading.
    const mobileT = window.setTimeout(() => {
      if (maxDepth >= MIN_SCROLL_DEPTH && window.scrollY < window.innerHeight * 0.5) {
        trigger();
      }
    }, MOBILE_FALLBACK_MS);

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(mobileT);
    };
  }, [open]);

  // When the modal closes, treat dismissal as another reason to honor the
  // 14-day cooldown (already stored on trigger; this is belt-and-suspenders).
  const close = () => { markShown(); setOpen(false); };

  return <>{children({ open, close })}</>;
}
