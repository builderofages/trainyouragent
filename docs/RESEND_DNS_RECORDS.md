# Resend DNS Records — trainyouragent.com

**Captured:** May 24, 2026 (v133)
**Resend domain ID:** `3cc799cf-b61a-46b8-a47f-6efa9a237525`
**Region:** us-east-1 (North Virginia)

Paste these 4 records into your DNS host for `trainyouragent.com`. Once
all four propagate (usually 5-30 minutes for most registrars, up to 24h
worst case), come back to https://resend.com/domains/trainyouragent.com
and click "Verify DNS Records" — all four turn green and Resend can send
production email from the domain.

## 1. DKIM (TXT) — REQUIRED

| Field | Value |
| --- | --- |
| **Type** | `TXT` |
| **Name** | `resend._domainkey` |
| **Value** | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8TztZC4xetaFPOXN8acnLpe6VhffJSlFfNr1SZbvbFBHndy9de35zKuUF4uFIf+gKtq3J+cO7ZSa64Zzl1qVk7XeKSLvssjBNKL+YSJa8RYUNqFJi2vbuViFQ3o7s391jZJa9tAdd1cIa9/s512E5TNbpGp7g+Dpqx9T+bttibQIDAQAB` |
| **TTL** | `Auto` (or 3600) |

Cryptographically signs every outbound email so receivers can verify it
really came from Resend on your behalf. Without DKIM = inbox → spam.

## 2. SPF (TXT) — REQUIRED

| Field | Value |
| --- | --- |
| **Type** | `TXT` |
| **Name** | `send` |
| **Value** | `v=spf1 include:amazonses.com ~all` |
| **TTL** | `Auto` (or 3600) |

Tells receiving mail servers "Resend (via Amazon SES) is allowed to send
on behalf of this domain." Pairs with DKIM for deliverability.

## 3. Return-Path (MX) — REQUIRED

| Field | Value |
| --- | --- |
| **Type** | `MX` |
| **Name** | `send` |
| **Value** | `feedback-smtp.us-east-1.amazonses.com` |
| **Priority** | `10` |
| **TTL** | `Auto` (or 3600) |

Routes bounce notifications back to Resend so it can track delivery
quality and prune dead addresses automatically.

## 4. Inbound MX (MX) — OPTIONAL

| Field | Value |
| --- | --- |
| **Type** | `MX` |
| **Name** | `@` |
| **Value** | `inbound-smtp.us-east-1.amazonaws.com` |
| **Priority** | `0` |
| **TTL** | `Auto` (or 3600) |

**Only add this if you want Resend to receive inbound email at
trainyouragent.com addresses** (e.g. for parsing replies into your app).
If you already have Google Workspace or another inbox provider handling
`@trainyouragent.com` mail, **DO NOT add this MX** — it will hijack
your inbound mail. The first three records are enough for sending only.

## DNS host instructions

**Cloudflare:**
DNS → trainyouragent.com → Records → Add record → choose Type → paste
Name and Content → keep "Proxy status" set to **DNS only** (gray cloud)
for all four records → Save.

**Namecheap:**
Domain List → Manage → Advanced DNS → Add New Record → Type → fill Name
and Value → Save.

**GoDaddy:**
My Products → DNS → Add → pick Type → fill fields → Save.

**Vercel (if domain is managed there):**
Project → Settings → Domains → trainyouragent.com → DNS Records → Add.

## After verification

The site will start sending from `hello@trainyouragent.com` (or
`alexander@trainyouragent.com` — whichever you set in Vercel env). All
existing `/api/lead`, intake confirmations, welcome sequences, Friday
digests, and Stripe receipt followups will flow through your real
domain instead of the Resend sandbox.
