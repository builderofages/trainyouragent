// src/lib/meta-pixel.ts
// v57a: client-side Meta Pixel wrapper. Generates a shared `event_id` for
// each fire and stores it in sessionStorage so the server-side CAPI mirror
// can match it for dedup (per Meta's spec:
// https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events).
//
// This file is the thin "fire + remember" API. The richer wrapper at
// src/lib/metaPixel.ts (camelCase) handles the full server-side mirror and
// is preferred for new code. This file exists for parity with the v57a spec.

import { pixelEvents, fireMetaEvent } from "./metaPixel";

export type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Schedule"
  | "Purchase"
  | "CompleteRegistration";

type FbqFn = ((...args: unknown[]) => void) & { disabled?: boolean };

function getFbq(): FbqFn | null {
  if (typeof window === "undefined") return null;
  const fbq = (window as { fbq?: FbqFn }).fbq;
  if (!fbq || fbq.disabled) return null;
  return fbq;
}

/** Generate (or reuse) an event_id and stash it in sessionStorage. */
export function eventIdFor(eventName: StandardEvent, key?: string): string {
  const slot = key ? `tya:eid:${eventName}:${key}` : `tya:eid:${eventName}:${Date.now()}`;
  if (typeof sessionStorage !== "undefined") {
    const existing = sessionStorage.getItem(slot);
    if (existing) return existing;
  }
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `tya-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  try { sessionStorage?.setItem(slot, id); } catch { /* private mode */ }
  return id;
}

/**
 * Fire a client-side standard event with a stable event_id. Does NOT call
 * the server-side CAPI mirror — for end-to-end dedup, use fireMetaEvent
 * from src/lib/metaPixel.ts which fires both with the same id.
 */
export function fireClient(
  eventName: StandardEvent,
  params?: Record<string, string | number | boolean>,
  opts?: { eventId?: string; key?: string },
): string {
  const eventId = opts?.eventId || eventIdFor(eventName, opts?.key);
  const fbq = getFbq();
  if (fbq) {
    try {
      fbq("track", eventName, params || {}, { eventID: eventId });
    } catch { /* non-fatal */ }
  }
  return eventId;
}

/** Re-export the dual-fire helpers so consumers have one import surface. */
export { fireMetaEvent, pixelEvents };
