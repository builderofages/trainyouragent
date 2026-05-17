// api/_lib/rate-limit-node.ts
// v55a: rate limiter for Node-runtime Vercel functions (PDF generators etc).
// Shares the same global bucket map as the edge limiter (`__tya_buckets__`)
// so cross-runtime use stays cohesive when both run in the same isolate.
//
// Usage:
//   import { rateLimitNode, ipFromNodeReq } from "./_lib/rate-limit-node";
//   const ip = ipFromNodeReq(req);
//   const rl = rateLimitNode(`pdf:${ip}`, { limit: 5, windowMs: 60*60*1000 });
//   if (!rl.ok) { res.setHeader('retry-after', rl.retryAfter); return res.status(429).json({...}); }

type Bucket = { count: number; reset: number };
const buckets: Map<string, Bucket> = (globalThis as any).__tya_buckets__ || new Map();
(globalThis as any).__tya_buckets__ = buckets;

let lastPrune = 0;
function prune(now: number) {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
}

export type NodeRateLimitResult = {
  ok: boolean;
  remaining: number;
  reset: number;
  retryAfter: number;
};

export function rateLimitNode(
  key: string,
  opts: { limit: number; windowMs: number },
): NodeRateLimitResult {
  const now = Date.now();
  prune(now);
  let b = buckets.get(key);
  if (!b || b.reset <= now) {
    b = { count: 0, reset: now + opts.windowMs };
    buckets.set(key, b);
  }
  b.count += 1;
  const ok = b.count <= opts.limit;
  const remaining = Math.max(0, opts.limit - b.count);
  const retryAfter = Math.ceil((b.reset - now) / 1000);
  return { ok, remaining, reset: b.reset, retryAfter };
}

// Vercel Node runtime request: minimal duck-typing — just headers + connection.
type AnyNodeReq = {
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

export function ipFromNodeReq(req: AnyNodeReq): string {
  const h = req.headers || {};
  const xff = h["x-forwarded-for"];
  if (typeof xff === "string" && xff) return xff.split(",")[0]!.trim();
  if (Array.isArray(xff) && xff.length) return String(xff[0]).split(",")[0]!.trim();
  const xri = h["x-real-ip"];
  if (typeof xri === "string" && xri) return xri.trim();
  const cf = h["cf-connecting-ip"];
  if (typeof cf === "string" && cf) return cf.trim();
  return req.socket?.remoteAddress || "unknown";
}
