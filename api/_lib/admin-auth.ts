// api/_lib/admin-auth.ts
// Shared token gate for /api/admin/* endpoints.
// Accepts ?token=... query param OR x-admin-token header.
// Matches against env ADMIN_TOKEN, falls back to hardcoded v41 secret if unset.

const FALLBACK_TOKEN = "tya-internal-2026";

export function adminToken(): string {
  return process.env.ADMIN_TOKEN || FALLBACK_TOKEN;
}

export function checkAdmin(req: Request): boolean {
  const url = new URL(req.url);
  const qp = url.searchParams.get("token") || "";
  const hdr = req.headers.get("x-admin-token") || "";
  const expected = adminToken();
  if (!expected) return false;
  return qp === expected || hdr === expected;
}

export function unauthorized(extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}
