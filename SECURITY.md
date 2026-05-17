# Security Policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in TrainYourAgent
(`trainyouragent.com`, the public website, or this repository), please
**email** the maintainer rather than opening a public GitHub issue:

> **security@trainyouragent.com**

(Also accepted: `hello@trainyouragent.com` with subject `[SECURITY]`.)

Please include:

- A clear description of the issue and impact
- Steps to reproduce (PoC where possible)
- The affected URL, endpoint, or commit SHA
- Your name / handle if you'd like credit

We aim to acknowledge reports within **72 hours** and to resolve confirmed
vulnerabilities within **14 days** for high-severity issues.

We will **not** pursue legal action against good-faith researchers who:

- Do not exfiltrate, modify, or delete user data
- Do not degrade the production service (no DoS testing)
- Give us reasonable time to remediate before public disclosure

## Scope

In scope:

- `trainyouragent.com` and `www.trainyouragent.com`
- The Vercel-hosted API endpoints under `/api/*`
- The source in this repository

Out of scope:

- Third-party services we integrate with (Cal.com, Stripe, Supabase, etc.) —
  please report those upstream
- Social-engineering against the maintainer
- Physical attacks
- Findings on staging / preview deployments that don't reproduce on prod

## Hardening summary (as of v55a)

- All third-party secrets live in Vercel project env vars, never in source
- Webhook receivers verify HMAC signatures (Cal.com `x-cal-signature-256`,
  Stripe `stripe-signature` with timestamp tolerance) in constant time
- Edge functions are rate-limited per-IP
- Admin endpoints (`/api/admin/*`) are gated behind `ADMIN_TOKEN` and
  rate-limited before the token check
- Supabase tables have Row-Level Security enabled; anon role has no access
- CSP, HSTS, X-Frame-Options, Referrer-Policy and Permissions-Policy are
  enforced via `vercel.json`

See `SECURITY_AUDIT.md` for the latest full audit notes.
