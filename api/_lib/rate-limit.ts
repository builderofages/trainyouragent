// api/_lib/rate-limit.ts
// In-memory IP rate limiter for Vercel edge functions.
//
// NOTE: edge-function instances are ephemeral and per-region — this is a
// best-effort limiter, fine for a low-traffic marketing site (a few hundred
// reqs/min worst case). Upgrade to Upstash Ratelimit (REST, no extra deps via
// fetch()) when traffic scales or when you need a single source of truth.
//
// Usage:
//   import { rateLimit, ipFromRequest } from "./_lib/rate-limit";
//   const ip = ipFromRequest(req);
//   const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
//   if (!rl.ok) return new Response("rate-limited", { status: 429, headers: rl.headers });

type Bucket = { count: number; reset: number };

// Module-scoped map. On Vercel edge each isolate keeps its own, which is OK for
// our threat model (slow down a single attacker per region).
const buckets: Map<string, Bucket> = (globalThis as any).__tya_buckets__ || new Map();
(globalThis as any).__tya_buckets__ = buckets;

// Periodic prune so the map can't grow unbounded.
let lastPrune = 0;
function prune(now: number) {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  reset: number;
  headers: Record<string, string>;
};

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  prune(now);
  let b = buckets.get(key);
  if (!b || b.reset <= now) {
    b = { count: 0, reset: now + opts.windowMs };
    buckets.set(key, b);
  }
  b.count += 1;
  const remaining = Math.max(0, opts.limit - b.count);
  const ok = b.count <= opts.limit;
  const headers: Record<string, string> = {
    "x-ratelimit-limit": String(opts.limit),
    "x-ratelimit-remaining": String(remaining),
    "x-ratelimit-reset": String(Math.floor(b.reset / 1000)),
  };
  if (!ok) headers["retry-after"] = String(Math.ceil((b.reset - now) / 1000));
  return { ok, remaining, reset: b.reset, headers };
}

// Best-effort client IP extraction. Vercel sets x-forwarded-for and
// x-real-ip; fall back to a constant so the limiter still throttles
// the unknown bucket rather than silently disabling itself.
export function ipFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "unknown";
}
