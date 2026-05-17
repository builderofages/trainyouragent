// api/_lib/admin-auth.ts
// Shared token gate for /api/admin/* endpoints.
// Accepts ?token=... query param OR x-admin-token header.
// v55a: hardcoded fallback REMOVED. Once the repo is public, any baked-in
// secret is a permanent backdoor. ADMIN_TOKEN MUST be set in Vercel; when
// unset, every request is rejected with 401.

export function adminToken(): string {
  return process.env.ADMIN_TOKEN || "";
}

// Constant-time string equality — prevents timing oracles when comparing
// the supplied token against the expected one.
function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function checkAdmin(req: Request): boolean {
  const expected = adminToken();
  // No env → no access. Fail closed.
  if (!expected) return false;
  const url = new URL(req.url);
  const qp = url.searchParams.get("token") || "";
  const hdr = req.headers.get("x-admin-token") || "";
  return safeEqual(qp, expected) || safeEqual(hdr, expected);
}

export function unauthorized(extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}
