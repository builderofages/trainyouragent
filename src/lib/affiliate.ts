// src/lib/affiliate.ts — v49
// First-touch UTM / affiliate attribution. Reads utm_source/medium/campaign + ref/aff
// from the URL on first visit and persists to localStorage so every later
// /api/lead submission can attach attribution. NEVER overwrites once set.

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
  aff?: string;
  landing?: string;
  referrer?: string;
  ts?: string;
};

const KEY = "tya_attribution";
const MAX_LEN = 200;

function clean(v: string | null): string | undefined {
  if (!v) return undefined;
  return v.replace(/[^A-Za-z0-9_\-./:?=&%]/g, "").slice(0, MAX_LEN);
}

/** Initialize attribution capture. Call once at app boot. Safe to call repeatedly. */
export function initAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return; // first-touch only
    const params = new URLSearchParams(window.location.search);
    const a: Attribution = {
      utm_source: clean(params.get("utm_source")),
      utm_medium: clean(params.get("utm_medium")),
      utm_campaign: clean(params.get("utm_campaign")),
      utm_term: clean(params.get("utm_term")),
      utm_content: clean(params.get("utm_content")),
      ref: clean(params.get("ref")),
      aff: clean(params.get("aff")),
      landing: window.location.pathname.slice(0, MAX_LEN),
      referrer: clean(document.referrer),
      ts: new Date().toISOString(),
    };
    // Only persist if at least one meaningful field is set, or always record the landing
    window.localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* ignore — private mode, full storage, etc. */
  }
}

/** Read stored attribution (or null). Safe for SSR. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

/** Merge attribution into an existing payload object for /api/lead. */
export function withAttribution<T extends Record<string, unknown>>(payload: T): T & { attribution?: Attribution } {
  const a = getAttribution();
  if (!a) return payload;
  return { ...payload, attribution: a };
}
