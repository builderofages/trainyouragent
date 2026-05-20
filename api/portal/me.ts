// api/portal/me.ts
// v76-a: Return the current customer's row. Auth via Supabase JWT in
// `Authorization: Bearer <access_token>` header. RLS handles authorization.

export const config = { runtime: "edge" };

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") return json(405, { ok: false, error: "method_not_allowed" });
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json(401, { ok: false, error: "missing_auth" });
  if (!SUPA_URL || !SUPA_ANON) return json(503, { ok: false, error: "auth_not_configured" });

  const token = auth.slice("Bearer ".length);

  // PostgREST call with the customer's JWT — RLS scopes to their row only.
  const res = await fetch(
    `${SUPA_URL}/rest/v1/tya_customers?select=*&limit=1`,
    {
      headers: {
        apikey: SUPA_ANON,
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return json(res.status, { ok: false, error: "supabase_error", detail: text.slice(0, 200) });
  }

  const rows = (await res.json()) as unknown[];
  const customer = rows[0] || null;
  return json(200, { ok: true, customer });
}
