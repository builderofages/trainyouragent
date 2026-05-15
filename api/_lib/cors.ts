// api/_lib/cors.ts
// Shared CORS handler — strict allowlist. We do NOT echo arbitrary origins.
//
// Allowed origins: production apex + www, and localhost:5173 for Vite dev.
// Same-origin requests (no Origin header) always pass through and get no
// CORS headers — the browser doesn't need them.

export const ALLOWED_ORIGINS = new Set<string>([
  "https://trainyouragent.com",
  "https://www.trainyouragent.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export type CorsDecision = {
  // True if the request should be allowed to proceed. False -> respond 403.
  allowed: boolean;
  // Headers to attach to the eventual response (Access-Control-Allow-*).
  headers: Record<string, string>;
  // True if this was an OPTIONS preflight — caller should short-circuit.
  isPreflight: boolean;
};

export function corsCheck(req: Request): CorsDecision {
  const origin = req.headers.get("origin");
  const isPreflight = req.method === "OPTIONS";

  // Same-origin (no Origin header) — always allow, no CORS headers needed.
  if (!origin) {
    return { allowed: true, headers: {}, isPreflight };
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    return { allowed: false, headers: {}, isPreflight };
  }

  const headers: Record<string, string> = {
    "access-control-allow-origin": origin,
    "vary": "origin",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
  return { allowed: true, headers, isPreflight };
}

// Build a 204 preflight response.
export function preflightResponse(headers: Record<string, string>): Response {
  return new Response(null, { status: 204, headers });
}

// Build a 403 forbidden response for disallowed origins.
export function forbiddenResponse(): Response {
  return new Response(JSON.stringify({ ok: false, error: "forbidden-origin" }), {
    status: 403,
    headers: { "content-type": "application/json" },
  });
}
