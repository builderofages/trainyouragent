// api/_lib/sign.ts — v192
// Edge-runtime HMAC-SHA256 signing for short URL-safe tokens.
// Used to mint stable opt-out / unsubscribe links inside outbound emails.
// 16-hex-char tag = 64 bits of entropy, plenty to defeat guessing.

const TAG_HEX_LEN = 16;

async function hmacHex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signTag(payload: string, secret: string): Promise<string> {
  if (!secret) return "";
  const full = await hmacHex(secret, payload);
  return full.slice(0, TAG_HEX_LEN);
}

export async function verifyTag(payload: string, tag: string, secret: string): Promise<boolean> {
  if (!secret || !tag || tag.length !== TAG_HEX_LEN) return false;
  const expected = await signTag(payload, secret);
  if (expected.length !== tag.length) return false;
  // Constant-time compare
  let r = 0;
  for (let i = 0; i < expected.length; i++) r |= expected.charCodeAt(i) ^ tag.charCodeAt(i);
  return r === 0;
}
