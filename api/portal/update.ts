// api/portal/update.ts
// v76-a: Update fields on the customer's own row. RLS enforces ownership at
// the DB layer; this handler additionally whitelists writable columns so
// billing / subscription fields stay read-only from the portal.

export const config = { runtime: "edge" };

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

const WRITABLE = new Set([
  "business_name",
  "business_phone",
  "twilio_number",
  "notes",
]);

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json(401, { ok: false, error: "missing_auth" });
  if (!SUPA_URL || !SUPA_ANON) return json(503, { ok: false, error: "auth_not_configured" });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "bad_json" });
  }

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (WRITABLE.has(k)) patch[k] = v;
  }
  if (!Object.keys(patch).length) {
    return json(400, { ok: false, error: "no_writable_fields" });
  }

  const token = auth.slice("Bearer ".length);

  // We need the user's email to scope the update. Decode the JWT payload
  // (no verification — RLS at the DB does verification via Supabase auth).
  let email = "";
  try {
    const payloadSeg = token.split(".")[1] || "";
    const b64 = payloadSeg.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(b64));
    email = String(json.email || "").toLowerCase();
  } catch {
    return json(401, { ok: false, error: "bad_jwt" });
  }
  if (!email) return json(401, { ok: false, error: "no_email_in_jwt" });

  const url = `${SUPA_URL}/rest/v1/tya_customers?email=eq.${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: SUPA_ANON,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return json(res.status, { ok: false, error: "supabase_error", detail: text.slice(0, 200) });
  }

  const rows = (await res.json()) as unknown[];
  return json(200, { ok: true, customer: rows[0] || null });
}
