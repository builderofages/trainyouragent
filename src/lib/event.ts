// src/lib/event.ts
// v42: tiny client helper for firing funnel events to /api/event.
// - never throws (best-effort)
// - dedupes "site_visit" once per sessionStorage tab
// - rate-aware: silently drops on 429

const SESSION_VISIT_KEY = "tya:event:site_visit";

export async function fireEvent(
  event_type: string,
  meta?: Record<string, string | number | boolean>,
  source?: string,
): Promise<void> {
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
