// src/lib/consent.ts — v229
//
// Single source of truth for visitor consent. GDPR/CCPA compliance gate that
// every analytics + marketing call must check before firing. Without an
// explicit affirmative consent, we MUST NOT fire GA4, Meta Pixel, or any
// other non-essential tracker. Essential cookies (auth, CSRF, language)
// don't need consent.
//
// Storage key:  tya_cookie_consent_v1   (versioned so we can re-prompt
//               if our category list changes in the future)
//
// Shape:
//   {
//     essential: true,        // always true — site won't work without
//     analytics: boolean,     // GA4, pageviews, custom events
//     marketing: boolean,     // Meta Pixel, retargeting, conversion APIs
//     personalize: boolean,   // visitor context, niche memory, etc
//     ts: number,             // Date.now() when set
//     v: 1,                   // schema version
//   }
//
// If the user has not yet consented, every category returns false. Banner
// renders. Once they consent (or reject), banner hides until storage clears
// or schema bumps.

export type ConsentCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  personalize: boolean;
  ts: number;
  v: 1;
};

const KEY = "tya_cookie_consent_v1";

function safeRead(): ConsentCategories | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentCategories;
    if (parsed && parsed.v === 1 && typeof parsed.ts === "number") return parsed;
    return null;
  } catch { return null; }
}

export function hasConsent(category: "analytics" | "marketing" | "personalize"): boolean {
  const c = safeRead();
  if (!c) return false;
  return !!c[category];
}

export function consentDecided(): boolean {
  return safeRead() !== null;
}

export function getConsent(): ConsentCategories | null { return safeRead(); }

export function setConsent(partial: Partial<Omit<ConsentCategories, "essential" | "ts" | "v">>): ConsentCategories {
  const next: ConsentCategories = {
    essential: true,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    personalize: !!partial.personalize,
    ts: Date.now(),
    v: 1,
  };
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore quota / privacy mode */ }
    try {
      window.dispatchEvent(new CustomEvent("tya:consent-changed", { detail: next }));
    } catch { /* IE polyfill skip */ }
  }
  return next;
}

export function acceptAll(): ConsentCategories {
  return setConsent({ analytics: true, marketing: true, personalize: true });
}
export function rejectAll(): ConsentCategories {
  return setConsent({ analytics: false, marketing: false, personalize: false });
}

/** Subscribe to consent changes. Returns unsubscribe fn. */
export function onConsentChange(cb: (c: ConsentCategories) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<ConsentCategories>).detail);
  window.addEventListener("tya:consent-changed", handler as EventListener);
  return () => window.removeEventListener("tya:consent-changed", handler as EventListener);
}
