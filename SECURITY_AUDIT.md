# Security Audit — Known Gaps (as of v63, 2026-05-18)

This document tracks the security gaps that are **known and accepted** for the current ship version, with a remediation plan for the next version.

## 1. CSP `'unsafe-inline'` in `script-src` (deferred to v64)

**Severity:** medium
**File:** `vercel.json`
**Current state:**
```
script-src 'self' 'unsafe-inline' https://app.cal.com ...
```

**Why deferred:**
The Grok Heavy audit (see `GROK_AUDIT.md`) called this out as a hardening target. A safe migration requires:

1. Refactoring inline `<script>` blocks in `index.html` (currently 3, including the Google Tag Manager / Meta Pixel bootstrap and the WebSite JSON-LD blob) into external files OR injecting a per-request nonce
2. Vercel does not natively support per-request CSP nonces on static `index.html` served via the SPA rewrite. Migration likely requires either:
   - Moving inline scripts to external `.js` files served from `/public/` (loses ability to inject runtime values at build time without an environment-specific bundle), OR
   - Switching the `index.html` to be rendered by an edge function that injects a fresh nonce on every request
3. Both approaches require careful re-test of Meta Pixel CAPI deduplication and GA4 event firing

**v63 stance:** ship the audit, ship the gap-documentation, keep the CSP as-is. Full migration tracked for v64.

**Compensating controls already in place:**
- `frame-ancestors 'none'` — no clickjacking surface
- `object-src 'none'` — no Flash/embed surface
- `base-uri 'self'` — no base-tag hijack surface
- `upgrade-insecure-requests` — all subresources forced to HTTPS
- All API endpoints behind CORS allowlist, body caps, rate limits, idempotency keys
- Webhook endpoints (Stripe, Cal) use constant-time HMAC verification

## 2. `style-src 'unsafe-inline'` (deferred to v64)

**Severity:** low
**File:** `vercel.json`

Tailwind generates inline `<style>` tags at build time and many third-party embeds (Cal, Stripe) require inline styles. The remediation path is similar to script-src: per-request nonces via an edge-rendered `index.html`. Tracked for v64.

## 3. Inline `<script>` count in `index.html`

As of v63 there are 3 inline `<script>` tags in `index.html`:
- Line 85: JSON-LD organization schema
- Line 133: Meta Pixel / GA bootstrap
- Line 182: Vite module entry (`<script type="module" src="/src/main.tsx">`) — this is external and not inline, included here for completeness

The JSON-LD blob can be safely moved to an external static asset. The Meta Pixel bootstrap is the harder one — it needs the page-load timing to fire `PageView` before the React app mounts.

---

## Already-shipped security work (review record)

These are the items the Grok Heavy panel reviewed and signed off on:

- `api/_lib/llm.ts` — multi-provider fallback with correct timeout handling
- `api/chat.ts` — system-prompt isolation, role validation, body caps
- `api/stripe-webhook.ts` — constant-time HMAC, idempotency, Origin-header rejection
- `api/cal-webhook.ts` — same pattern, separate signing key
- `api/_lib/rate-limit.ts` — per-IP, per-endpoint limits, 429 with `Retry-After`
- `api/_lib/cors.ts` — strict allowlist, preflight handling
- All form endpoints — honeypot field, server-side input validation

— *Saved to repo root by the v63 ship process.*
