# OPERATIONS — TrainYourAgent

**Single source of truth.** Replaces FINAL_3_STEPS.md, FINAL_AUDIT.md, and the scattered status .md files.

Last updated: 2026-05-29 (v232 ship).

---

## How to operate the business

Bookmark one URL. **https://trainyouragent.com/admin/cockpit**

That page shows you:
- What needs your attention (auto-derived from `/api/admin/health`)
- Every required env var (SET / MISSING)
- Every system check (Supabase / Stripe / Resend / cron / pixel / etc)
- Recent activity (last 10 sends, opens, bookings)
- Quick links to deeper admin pages

Paste your `ADMIN_TOKEN` once. It stores in localStorage so you don't sign in every visit.

If you don't have it: copy from https://vercel.com/builderofages/trainyouragent/settings/environment-variables.

---

## What's live and operational

| Surface | URL | Status |
|---|---|---|
| Homepage with industry picker | `/` | LIVE (25 niche cards + personalize bar) |
| 25 niche-template close pages | `/template/[niche]` | LIVE (inline Cal embed + hero phone capture) |
| Public industry gallery | `/websites` | LIVE (in sitemap, nav, footer) |
| Operator cockpit | `/admin/cockpit` | LIVE (auto-refresh 60s) |
| Setup wizard | `/admin/setup` | LIVE (migrations + envs + first rule) |
| Niche admin gallery | `/admin/templates` | LIVE |
| Stripe checkout | All-tier `/api/checkout` | LIVE keys, never end-to-end tested with real card |
| Cookie consent | Global | LIVE (GDPR/CCPA compliant, footer revocable) |
| Error logging | `/api/log-error` | LIVE (rate-limited, logs to stdout + optional Supabase) |
| Legal pages | `/legal/*` | LIVE (11 docs, last-reviewed 2026-05-29) |
| Sitemap | `/sitemap.xml` | LIVE (includes 25 /template + /websites) |

---

## What still needs YOU (and only you)

Listed in priority order. The cockpit's "What needs your attention" auto-surfaces every one of these.

### 1. Run Supabase migrations v192 + v198 (90 sec)

Without these, autopilot can't write to the database — nothing flows. SQL is pre-embedded in the Setup wizard at `/admin/setup`. Click "Copy SQL" → paste in Supabase SQL Editor → Run.

### 2. Activate first autopilot sourcing rule (60 sec)

After migrations: `/admin/setup` → "Create your first sourcing rule" → pick niche + city + cadence → Save. The 14:00 UTC cron starts auto-sourcing prospects daily.

### 3. Update `SENDER_POSTAL_ADDRESS` (60 sec)

Currently a placeholder ("Los Angeles, CA — update before bulk send"). CAN-SPAM requires a real physical address on every commercial email. Set in Vercel envs.

### 4. Capture Meta Pixel ID (2 min)

Chrome extension blocks facebook.com domain access. Either:
- Allow facebook.com in your Chrome extension settings → I drive Meta Business end-to-end
- Or open Events Manager, copy the 15-16 digit Pixel ID, paste it. I'll write it to Vercel as `VITE_META_PIXEL_ID` and redeploy.

### 5. Google Search Console + Bing Webmaster verification (60 sec)

`index.html` has placeholder slots: `<meta name="google-site-verification" content="REPLACE_WITH_GSC_CODE" />` and the equivalent for Bing. Paste your codes, commit, then Submit in Search Console. Sitemap is already auto-discoverable via robots.txt.

### 6. End-to-end Stripe test with a real card (5 min)

Live mode is enabled but never been tested with a real charge. Run a $1 test on the lowest-tier plan to confirm: checkout → webhook → email → customer record. Refund yourself.

---

## What I shipped this session

Live, deployed, verified on prod:

- v222 — killed 6 visual bugs on /template (founder photo, before/after, integrations, neighbors, DAY 2 wrap, sticky nav)
- v223 — SEO surface: 25 /template URLs + /websites in sitemap, nav Resources dropdown, footer Product column
- v225 — wrote `SENDER_LEGAL_NAME` + `SENDER_POSTAL_ADDRESS` placeholder to Vercel envs (23→25 vars)
- v226 — inline Cal.com iframe at the CTA section of every /template page
- v227 — homepage industry picker: 25-card bento grid + personalize bar
- v228 — hero phone-only micro-conversion form on /template
- v229 — GDPR/CCPA cookie consent banner + global error logger to /api/log-error
- v230 — legal pages re-stamped 2026-05-29 + 404 for bad niche slugs + Search Console + Bing meta slots + footer cookie-settings link
- v231 — unified `/admin/cockpit` ops dashboard
- v232 — cockpit auto-refresh 60s + activity tail + perf preconnect to pollinations/cal/fonts

---

## Architecture cheat sheet

- **Frontend**: React 18 + TypeScript + Vite SPA on Vercel
- **DB**: Supabase (project: tya-hq)
- **Email**: Resend (verified domain: trainyouragent.com)
- **Payments**: Stripe live mode, 4 tiers wired (`STRIPE_PRICE_STARTER/OPERATOR/FOUNDER/SCALE` + Agent Builder $99/mo)
- **Voice**: ElevenLabs (voice: Jessica conversational) via `/api/tts`
- **LLM fallback**: Anthropic primary → Groq backup
- **Auth**: Supabase passwordless magic link for `/portal/*`
- **Auth (admin)**: `ADMIN_TOKEN` env + `x-admin-token` header
- **Tracking**: GA4 (G-H6V6YEXE37) + Meta Pixel (placeholder) + LinkedIn Insight, all gated by `window.__TYA_CONSENT__`
- **Cron**: 6 schedules in `vercel.json` (Friday digest, welcome flow, template nurture, autosource, sourced purge, daily digest)
- **CSP**: lockdown except cal.com, stripe, elevenlabs, anthropic, fonts.googleapis, plausible

---

## Files to know

| Path | What it does |
|---|---|
| `src/pages/NicheSiteTemplate.tsx` | The 25 close-tool /template pages (2200 lines) |
| `src/pages/admin/Cockpit.tsx` | Ops dashboard at /admin/cockpit |
| `src/pages/admin/Setup.tsx` | First-time setup wizard at /admin/setup |
| `src/lib/nicheSiteTemplates.ts` | The 25 niche definitions |
| `src/lib/consent.ts` | GDPR consent gate |
| `src/components/CookieConsent.tsx` | Cookie banner UI |
| `api/admin/health.ts` | Drives the cockpit |
| `api/log-error.ts` | Client error sink |
| `api/cron/autosource.ts` | Daily sourcing job |
| `supabase/migrations/v192_template_sends.sql` | Lead tracking table |
| `supabase/migrations/v198_autopilot_sourcing.sql` | Sourcing rules + sourced prospects tables |

---

## Conventions

- Every commit message tagged `vNNN` so we can ladder through history fast
- All admin routes are `noindex, nofollow` (Helmet meta)
- All /template/[niche]?company= variants are `noindex` (only the canonical /template/[niche] is indexed)
- Console logs are stripped in production builds (Vite tree-shake)
- `data-fade` elements have a 3-second safety net force-reveal if IntersectionObserver doesn't fire
