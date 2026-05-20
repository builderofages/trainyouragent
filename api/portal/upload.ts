// api/portal/upload.ts
// v76-a: Knowledge-base file uploads. Multipart in, Supabase Storage out.
// Bucket `customer-knowledge`, scoped by customer email prefix so RLS can
// gate downloads if needed later.

export const config = { runtime: "edge" };

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const BUCKET = "customer-knowledge";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB per file

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function emailFromJwt(token: string): string {
  try {
    const payloadSeg = token.split(".")[1] || "";
    const b64 = payloadSeg.replace(/-/g, "+").replace(/_/g, "/");
    const j = JSON.parse(atob(b64));
    return String(j.email || "").toLowerCase();
  } catch {
    return "";
  }
}

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json(401, { ok: false, error: "missing_auth" });
  if (!SUPA_URL || !SUPA_ANON) return json(503, { ok: false, error: "auth_not_configured" });

  const token = auth.slice("Bearer ".length);
  const email = emailFromJwt(token);
  if (!email) return json(401, { ok: false, error: "no_email_in_jwt" });

  const ctype = req.headers.get("content-type") || "";
  if (!ctype.startsWith("multipart/form-data")) {
    return json(400, { ok: false, error: "expected_multipart" });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json(400, { ok: false, error: "missing_file" });
  if (file.size > MAX_BYTES) return json(413, { ok: false, error: "file_too_large", max_bytes: MAX_BYTES });

  // Path: {emailLocal}/{timestamp}_{safeName}
  const slug = email.replace(/[^a-z0-9]+/g, "_");
  const path = `${slug}/${Date.now()}_${safeFilename(file.name || "upload.bin")}`;

  // Use service key for storage write since storage RLS is bucket-level. We
  // gate on the JWT email above. Bucket is private so direct reads require
  // signed URLs.
  const writeKey = SUPA_SERVICE || SUPA_ANON;
  const res = await fetch(
    `${SUPA_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(path)}`,
    {
      method: "POST",
      headers: {
        apikey: writeKey,
        authorization: `Bearer ${writeKey}`,
        "content-type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: await file.arrayBuffer(),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return json(res.status, { ok: false, error: "storage_error", detail: text.slice(0, 200) });
  }

  return json(200, { ok: true, path, size: file.size, name: file.name });
}
