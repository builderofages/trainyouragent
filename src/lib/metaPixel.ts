// src/lib/metaPixel.ts
// Thin wrapper around the Meta Pixel + server-side CAPI mirror
// (api/meta-event.ts). Every fire goes to BOTH the browser pixel and the
// server, sharing the same `event_id` so Meta dedupes correctly.
//
// All functions are no-ops when the pixel ID isn't configured (the inline
// gate in index.html replaces window.fbq with a stub in that case).

export type PixelUser = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  external_id?: string;
};

export type PixelCustomData = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { disabled?: boolean; queue?: unknown[] };
    __TYA_PIXEL_ID__?: string;
  }
}

const SERVER_ENDPOINT = "/api/meta-event";

function isPixelEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.__TYA_PIXEL_ID__) && !window.fbq?.disabled;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback — RFC4122-ish, good enough for dedup.
  return "tya-" + Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
}

function readFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const out: { fbp?: string; fbc?: string } = {};
  document.cookie.split(";").forEach((c) => {
    const [k, v] = c.trim().split("=");
    if (k === "_fbp") out.fbp = v;
    if (k === "_fbc") out.fbc = v;
  });
  return out;
}

/**
 * Fire a Meta Pixel event on BOTH the browser pixel and the server-side CAPI
 * mirror. Both fires share the same `event_id` so Meta dedupes per their
 * server-side spec (https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events).
 */
export async function fireMetaEvent(
  eventName: "Lead" | "Schedule" | "Purchase" | "InitiateCheckout" | "Contact" | "ViewContent" | "Subscribe" | "CompleteRegistration",
  opts: {
    user?: PixelUser;
    customData?: PixelCustomData;
    eventId?: string;
  } = {},
): Promise<{ event_id: string; ok: boolean }> {
  const event_id = opts.eventId || newEventId();
  const sourceUrl = typeof window !== "undefined" ? window.location.href : undefined;

  // Browser pixel — fire only if enabled and fbq is present.
  if (isPixelEnabled() && typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      const customData = opts.customData ? sanitizeForPixel(opts.customData) : undefined;
      window.fbq("track", eventName, customData || {}, { eventID: event_id });
    } catch {
      // pixel errors are non-fatal — keep going to server fire
    }
  }

  // Server CAPI mirror — fire even if the pixel is off (CAPI is the primary
  // truth source for ad-block / iOS17 / Safari ITP).
  try {
    const fb = readFbCookies();
    await fetch(SERVER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        event_id,
        event_source_url: sourceUrl,
        user: { ...opts.user, ...fb },
        custom_data: opts.customData,
      }),
      keepalive: true, // survive page transitions
    });
    return { event_id, ok: true };
  } catch {
    return { event_id, ok: false };
  }
}

function sanitizeForPixel(d: PixelCustomData): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(d)) {
    if (v == null) continue;
    out[k] = v as string | number | boolean;
  }
  return out;
}

/**
 * Specialized helpers for the three pixel events the v32 site cares about.
 * Each returns the shared event_id so callers can pass it through to Stripe
 * metadata or Cal booking metadata for end-to-end dedup if needed.
 */
export const pixelEvents = {
  lead: (user?: PixelUser, custom?: PixelCustomData) =>
    fireMetaEvent("Lead", { user, customData: custom }),
  schedule: (user?: PixelUser, custom?: PixelCustomData) =>
    fireMetaEvent("Schedule", { user, customData: custom }),
  purchase: (user?: PixelUser, value?: number, currency = "USD", custom?: PixelCustomData) =>
    fireMetaEvent("Purchase", {
      user,
      customData: { value, currency, ...(custom || {}) },
    }),
};
