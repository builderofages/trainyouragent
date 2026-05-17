# Security Audit — 2026-05-17 (v55a)

Author: automated pre-public-release audit
Repo: `builderofages/trainyouragent`
Branch: `main`
Pre-audit commit: `4fbfe43`
Target: pre-public GitHub flip

## Git history secret scan

Scans run across the full commit history (`git log -p --all`) for known
provider secret patterns and high-entropy strings near env-var-looking names.

| Pattern                            | Hits in history | Hits in current tree   | Notes                                                                                                 |
|------------------------------------|-----------------|------------------------|-------------------------------------------------------------------------------------------------------|
| `sk-ant-api...` (Anthropic)        | 0               | 0 real (2 doc examples)| `INTEGRATIONS_SETUP.md` references the prefix as a placeholder example — no real key.                 |
| `sk_live_...` (Stripe live)        | 0               | 0                      |                                                                                                       |
| `sk_test_...` (Stripe test)        | 0               | 0                      |                                                                                                       |
| `whsec_...` (Stripe webhook)       | 0               | 0                      |                                                                                                       |
| `gsk_...` (Groq)                   | 0               | 0                      |                                                                                                       |
| `AIza...` (Google)                 | 0               | 0                      |                                                                                                       |
| `sb_secret_...` (Supabase)         | 0               | 0                      |                                                                                                       |
| `re_...` (Resend)                  | 0               | 0                      |                                                                                                       |
| `ghp_...` / `github_pat_...`       | 0               | 0                      |                                                                                                       |
| `BEGIN PRIVATE KEY`                | 0               | 0                      |                                                                                                       |
| `AKIA...` (AWS access key)         | 0               | 0                      |                                                                                                       |
| `vercel_...`                       | 0               | 0                      |                                                                                                       |

**Result: NO third-party provider secrets found in git history.**

## Source-code secrets (hardcoded backdoors)

Three hardcoded shared-secret tokens were discovered in source. These are
not third-party keys but are credentials nonetheless, and once the repo
goes public they become permanent backdoors. All three were removed in
this audit pass.

| Location                          | Token                | Action taken                                                                                                                                                |
|-----------------------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/pages/Admin.tsx`             | `tya-internal-2026`  | Removed fallback. `VITE_ADMIN_TOKEN` now required; without it the page rejects every token. **Also: this string was being shipped in the client bundle.**   |
| `api/_lib/admin-auth.ts`          | `tya-internal-2026`  | Removed `FALLBACK_TOKEN`. Server now fails closed when `ADMIN_TOKEN` env is unset. Added constant-time comparison.                                          |
| `api/stripe-setup.ts`             | `tya-init-2026`      | Removed hardcoded `INIT_TOKEN`. Now reads `STRIPE_SETUP_INIT_TOKEN` env; fails closed when unset.                                                           |

## .gitignore hardening

The `.gitignore` previously covered `.env*` and editor files but missed:
`.vercel/`, `build/`, `.next/`, `.turbo/`, `*.pem`, `*.key`, `*.p12`,
`secrets.json`, `credentials.json`, `service-account.json`,
`google-credentials*.json`. All added in this pass.

Currently tracked env-ish files: `.env.example` only (safe — placeholders).

## API endpoint table

All endpoints in `/api/` audited for: rate limiting, CORS, signature
verification, authentication. Fixes applied this pass marked with `*`.

| endpoint                          | rate-limited | CORS  | sig-verified | token-gated | notes                                                                              |
|-----------------------------------|--------------|-------|--------------|-------------|------------------------------------------------------------------------------------|
| `chat.ts`                         | yes (30/h)   | yes   | n/a          | n/a         | Multi-provider, niche allowlist, mode allowlist.                                   |
| `lead.ts`                         | yes (5/h)    | yes   | n/a          | n/a         | Honeypot, source allowlist, payload sanitization, body size cap.                   |
| `event.ts`                        | yes (60/h)   | yes   | n/a          | n/a         | Event-type allowlist.                                                              |
| `checkout.ts`                     | yes (10/h)   | yes   | n/a          | n/a         | Plan allowlist; success/cancel URLs hardcoded server-side.                         |
| `cal-webhook.ts`                  | yes (120/h)  | none  | yes (HMAC)   | secret      | Constant-time HMAC-SHA256, browser-origin reject.                                  |
| `stripe-webhook.ts`               | yes (240/h)  | none  | yes (HMAC)   | secret      | Stripe signature with timestamp tolerance, browser-origin reject.                  |
| `meta-event.ts`                   | yes          | yes   | n/a          | n/a         | Server-side CAPI mirror.                                                           |
| `booking-abandoned.ts`            | yes          | yes   | n/a          | n/a         |                                                                                    |
| `og.ts`                           | yes (120/h)* | n/a   | n/a          | n/a         | * added in v55a.                                                                   |
| `public-metrics.ts`               | yes (120/h)* | yes   | n/a          | n/a         | * added in v55a. Cache-friendly.                                                   |
| `recent-activity.ts`              | yes (120/h)* | yes   | n/a          | n/a         | * added in v55a. PII-stripped output.                                              |
| `buyers-guide-pdf.ts`             | yes (5/h)*   | n/a   | n/a          | n/a         | * added in v55a via new `rate-limit-node.ts`.                                      |
| `state-of-ai-ops-pdf.ts`          | yes (5/h)*   | n/a   | n/a          | n/a         | * added in v55a.                                                                   |
| `automation-roi-pdf.ts`           | yes (5/h)*   | n/a   | n/a          | n/a         | * added in v55a.                                                                   |
| `nurture-tick.ts`                 | yes (30/h)*  | n/a   | n/a          | yes         | * added in v55a (rate-limit BEFORE token check, defeats brute-force).              |
| `stripe-setup.ts`                 | yes (10/h)*  | n/a   | n/a          | yes*        | * v55a removed hardcoded token; now env-only. Rate limit added.                    |
| `admin/leads.ts`                  | yes (60/h)*  | n/a   | n/a          | yes         | * v55a. Rate limit BEFORE checkAdmin.                                              |
| `admin/metrics.ts`                | yes (60/h)*  | n/a   | n/a          | yes         | * v55a.                                                                            |
| `admin/funnel.ts`                 | yes (60/h)*  | n/a   | n/a          | yes         | * v55a.                                                                            |
| `health.ts`                       | no           | n/a   | n/a          | n/a         | Static-ish health probe, no state mutation. Acceptable.                            |
| `sitemap.xml.ts`                  | no           | n/a   | n/a          | n/a         | Public sitemap, cache-heavy. Acceptable.                                           |

Additional hardening in `api/_lib/admin-auth.ts`:

- Hardcoded fallback `FALLBACK_TOKEN` removed (was `tya-internal-2026`).
- Added constant-time comparison (`safeEqual`) to defeat timing oracles.
- Now fails closed when `ADMIN_TOKEN` env is unset.

## CSP audit

Current `Content-Security-Policy` (in `vercel.json`):

- `default-src 'self'`
- `script-src` allowlist: Cal.com, ElevenLabs, Stripe.js, GTM/GA, FB pixel, Plausible. Includes `'unsafe-inline'` (required for shadcn/Vite hydration).
- `connect-src` allowlist: matches script-src; explicit Supabase + WSS.
- `frame-ancestors 'none'` — clickjacking-safe.
- `object-src 'none'`, `base-uri 'self'`, `form-action 'self' https://hooks.stripe.com`.
- `upgrade-insecure-requests` set.
- **No `'unsafe-eval'`** — verified.

Other headers (in `vercel.json`):

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricts geolocation, camera, mic, payment, USB, magnetometer, gyroscope, interest-cohort
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `/api/*` is `noindex, nofollow` + `no-store`.

CSP and headers pass the audit unchanged. (Status: no fixes needed.)

## Supabase RLS

Migrations before this pass:

- `0001_init.sql` — creates `public.leads`, `public.events`. No RLS.
- `0002_nurture.sql` — creates `public.tya_nurture_sent`. No RLS.

Comment in `0001_init.sql` claimed "no RLS required" because writes are
server-side. Accurate for the writer, but the public anon key (which is
visible to anyone running the front-end) would allow direct reads if RLS
were off.

**Action this pass: added `0003_rls_policies.sql`.**

- Enables RLS on `tya_leads`, `tya_events`, `tya_nurture_sent`.
- Also enables RLS on stale `leads` / `events` if they still exist.
- No policies for `anon` / `authenticated` → all access denied by default.
- Service-role key (server-side only) bypasses RLS as designed.

**Operator action required: run this migration in production Supabase**
before flipping the repo public.

## Dependencies

`npm audit --omit=dev` (production): **0 vulnerabilities** after this pass.

Pre-audit state had 1 critical: `jspdf <= 4.2.0` (10 CVEs ranging from
path-traversal to PDF injection to DoS). Bumped to `^4.2.1` in
`package.json`. API surface used (`new jsPDF()` + text/line/rect/etc.) is
unchanged in 4.x; build verified.

## Bundle scan

After `npx vite build`, scanned `dist/assets/*.js` for server-secret names
(`ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `STRIPE_SECRET`,
`SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `CAL_WEBHOOK_SECRET`,
`ADMIN_TOKEN`) and provider key prefixes (`sk-ant-api`, `sk_live_`,
`whsec_`, `gsk_`, `sb_secret_`).

Pre-fix: `tya-internal-2026` (admin token fallback) found in
`dist/assets/Admin-*.js`. **Removed.** Re-build clean.

After fix: zero hits on any server-secret name or third-party-key prefix.

## Rotation list — KEYS TO ROTATE BEFORE GOING PUBLIC

Although no third-party provider secret was ever committed to git, the
three internal shared-secret tokens listed below were in source. Because
git history is permanent once the repo is public, **rotate them** so the
old values lose meaning.

| # | Secret                          | Current value                | Why it must rotate                                                                                                       | Rotate where                                                                                              |
|---|---------------------------------|------------------------------|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| 1 | `ADMIN_TOKEN` (server)          | `tya-internal-2026`          | Was hardcoded as fallback in `api/_lib/admin-auth.ts` AND shipped in the client bundle via `src/pages/Admin.tsx`.        | Vercel → Project Settings → Environment Variables → `ADMIN_TOKEN` (Production + Preview). Pick a new random string (`openssl rand -hex 24`). |
| 2 | `VITE_ADMIN_TOKEN` (client)     | `tya-internal-2026`          | Same value as #1 — the front-end needed it for the `?token=` URL check. Must match new server value.                     | Vercel → Project Settings → Environment Variables → `VITE_ADMIN_TOKEN` (Production + Preview). Set to the same new value as `ADMIN_TOKEN`. |
| 3 | `STRIPE_SETUP_INIT_TOKEN`       | (was `tya-init-2026`)        | Was hardcoded in `api/stripe-setup.ts`. With the live Stripe key set, an attacker who guessed this could create products / prices in your account. | Vercel → `STRIPE_SETUP_INIT_TOKEN` (Production). Pick a new random string and only set it when you next need to run setup. Unset afterwards. |

Vercel-stored third-party secrets (Anthropic, Groq, Stripe live, Stripe
webhook signing, Resend, Supabase service, Cal.com webhook secret,
Beehiiv, Meta CAPI, Google APIs) **do not need rotation** for the
public-flip — they were never in the source. If you want belt-and-braces
hygiene before opening up the repo, rotating any/all of them is cheap and
doesn't hurt; pick based on blast-radius (Stripe live → highest blast).

## Pre-public checklist

- [ ] Run `supabase/migrations/0003_rls_policies.sql` against production Supabase
- [ ] Set new `ADMIN_TOKEN` in Vercel (Production + Preview)
- [ ] Set matching `VITE_ADMIN_TOKEN` in Vercel (Production + Preview)
- [ ] Set `STRIPE_SETUP_INIT_TOKEN` only when you need to re-run setup; unset afterwards
- [ ] `vercel --prod` to redeploy with new env values
- [ ] Verify `/admin?token=<new>` works; `/admin?token=tya-internal-2026` is rejected (401)
- [ ] Curl `/api/admin/metrics` without token → 401; with new token → 200
- [ ] Curl `/api/stripe-setup?init_token=tya-init-2026` → 401 (old token now meaningless)
- [ ] Re-run git history scan (should still be clean — no new commits with secrets)
- [ ] Confirm `SECURITY.md` is present at repo root with disclosure email
- [ ] Flip GitHub repo visibility to **public**
- [ ] (Optional but recommended) enable GitHub `secret-scanning` and `push protection` on the repo
- [ ] (Optional) connect Dependabot for the new public repo
