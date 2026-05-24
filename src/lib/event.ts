// src/lib/event.ts
// v42: tiny client helper for firing funnel events to /api/event (Supabase).
// v132: dual-write — every event now ALSO pushes to window.gtag so GA4 lights
// up automatically. One change here turns on GA4 tracking for every existing
// call site (site_visit, leak_ticker_*, pathway_*, lead_*, etc) without
// touching any of them.
// - never throws (best-effort)
// - dedupes "site_visit" once per sessionStorage tab
// - rate-aware: silently drops on 429

const SESSION_VISIT_KEY = "tya:event:site_visit";

declare global {
  interface Window {
    gtag?: ((command: "event" | "config" | "set" | "js", ...args: unknown[]) => void) & {
      loaded?: boolean;
      disabled?: boolean;
    };
  }
}

function mirrorToGtag(
  event_type: string,
  meta?: Record<string, string | number | boolean>,
  source?: string,
): void {
  try {
    if (typeof window === "undefined") return;
    const g = window.gtag;
    if (!g || g.disabled) return;
    // GA4 event params: snake_case, primitive values only. Strip undefined.
    const params: Record<string, string | number | boolean> = {};
    if (source) params.source = source;
    if (meta) {
      for (const [k, v] of Object.entries(meta)) {
        if (v === undefined || v === null) continue;
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          params[k] = v;
        }
      }
    }
    g("event", event_type, params);
  } catch {
    /* never break the UI on a logging failure */
  }
}

export async function fireEvent(
  event_type: string,
  meta?: Record<string, string | number | boolean>,
  source?: string,
): Promise<void> {
  // v132: mirror to GA4 synchronously — fire-and-forget, won't block /api/event.
  mirrorToGtag(event_type, meta, source);
  try {
    await fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event_type, source, meta }),
      keepalive: true,
    });
  } catch {
    // intentionally swallowed — never break the UI on a logging failure.
  }
}

export function fireSiteVisitOnce(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(SESSION_VISIT_KEY)) return;
    window.sessionStorage.setItem(SESSION_VISIT_KEY, "1");
    void fireEvent("site_visit", { path: window.location.pathname });
  } catch {
    /* sessionStorage disabled — still fire, just unguarded */
    void fireEvent("site_visit");
  }
}
