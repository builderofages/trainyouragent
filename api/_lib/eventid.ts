// api/_lib/eventid.ts
// v57a: shared event_id generation for Meta Pixel + Conversion API dedup.
//
// Meta dedupes browser-pixel and server-side CAPI events when they share the
// same `event_id`. We expose two helpers:
//
//   genEventId(prefix?) — random UUID, optionally prefixed.
//   deterministicEventId(prefix, key) — stable hash of (prefix, key) so the
//     same upstream identifier (Stripe session id, Cal booking uid, lead id)
//     always maps to the same event_id even across retries.
//
// Both are edge-runtime safe (no Node 'crypto', only Web Crypto / globalThis).

export function genEventId(prefix?: string): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${uuid}` : uuid;
}

/** Deterministic SHA-256-based event_id. Same key always produces same id. */
export async function deterministicEventId(prefix: string, key: string): Promise<string> {
  const data = new TextEncoder().encode(`${prefix}:${key}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}_${hex.slice(0, 32)}`;
}

/** Hash a string for Meta CAPI PII fields (lowercase + trim before hashing). */
export async function sha256Lower(s: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(String(s).trim().toLowerCase()),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
