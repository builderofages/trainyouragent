// src/components/MetaPixel.tsx
// v57a: optional component that ensures the Meta Pixel base code is mounted
// (no-op if it's already on the page from index.html). Reads VITE_META_PIXEL_ID
// at build time. When unset, mounts nothing — the inline gate in index.html
// also short-circuits, so there's no broken pixel and no console noise.

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { loaded?: boolean; disabled?: boolean };
    __TYA_PIXEL_ID__?: string;
  }
}

const PIXEL_ID =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env: Record<string, string> }).env?.VITE_META_PIXEL_ID) ||
  "";

function bootPixel(id: string) {
  if (typeof window === "undefined") return;
  if (window.fbq && window.fbq.loaded) return;
  // Standard Meta Pixel base code (snippet v2.9.197). Mirrors the inline
  // script in index.html — keeping both means the pixel always boots even
  // if a route is loaded before head hydration completes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function (f: any, b: any, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e);
    t.async = true;
    t.defer = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq?.("init", id);
  window.fbq?.("track", "PageView");
  window.__TYA_PIXEL_ID__ = id;
}

/**
 * Mount once in App.tsx. Idempotent. If the inline script in index.html has
 * already booted the pixel (the normal path), this is a no-op.
 */
export default function MetaPixel(): null {
  useEffect(() => {
    if (!PIXEL_ID || PIXEL_ID.length < 6) return;
    if (typeof window === "undefined") return;
    // Wait for idle so we never block first paint.
    const start = () => bootPixel(PIXEL_ID);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(start, { timeout: 2500 });
    } else {
      setTimeout(start, 1500);
    }
  }, []);
  return null;
}
