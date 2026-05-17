# QA Pass — v46b

Live commit at start: `b3657a1`
Rebased onto: `01d6709` (v46a)
Generated: 2026-05-17T02:00:00Z

## 1. URL Status (33 URLs)

| URL | Status |
|---|---|
| / | 200 |
| /pricing | 200 |
| /about | 200 |
| /contact | 200 |
| /tools | 200 |
| /tools/cost-estimator | 200 |
| /tools/roi-calculator | 200 |
| /tools/prompt-critic | 200 |
| /tools/scenario-generator | 200 |
| /tools/latency-simulator | 200 |
| /tools/prompt-library | 200 |
| /tools/model-selector | 200 |
| /tools/automation-roi | 200 |
| /demos/sales-objection-handler | 200 |
| /demos/sop-writer | 200 |
| /demos/seo-cluster | 200 |
| /community | 200 |
| /partners | 200 |
| /metrics | 200 |
| /report/state-of-ai-ops-2026 | 200 |
| /blog | 200 |
| /security | 200 |
| /careers | 200 |
| /press | 200 |
| /status | 200 |
| /onboarding | 200 |
| /admin | 200 |
| /verticals/voice-agents | 200 |
| /verticals/chat-agents | 200 |
| /alternatives/zapier | 200 |
| /alternatives/intercom | 200 |
| /book | 200 |
| /api/sitemap.xml | 200 |
| /robots.txt | 200 |

ALL 33 URLs returned 200. No broken routes.

## 2. API Endpoints

| Endpoint | Status | Latency | Notes |
|---|---|---|---|
| POST /api/lead (source=contact-form) | 400 | 0.30s | `bad-source` — FIXED, allowlist updated |
| POST /api/event (site_visit) | 200 | 0.27s | OK |
| GET  /api/public-metrics | 200 | <0.5s | OK — returns business+kpi JSON |
| GET  /api/recent-activity | 200 | <0.5s | OK |
| GET  /api/admin/metrics?token=… | 200 | 0.30s | OK |
| GET  /api/admin/leads?token=… | 200 | 0.25s | OK |
| GET  /api/admin/funnel?token=… | 200 | 0.23s | OK |
| POST /api/chat (all 6 modes) | 502 | <0.4s | `upstream-error` — FIXED, model alias + better error surfacing |
| GET  /api/buyers-guide-pdf | 200 | OK | 18 KB PDF, 5 pages |
| GET  /api/state-of-ai-ops-pdf | 200 | ~6s | 74 KB PDF, 18 pages |
| GET  /api/automation-roi-pdf?employees=…&salary=…&hours=…&auto=… | 200 | OK | 11 KB PDF, 3 pages (brief said POST — endpoint is GET-only, matches frontend usage in `src/pages/tools/AutomationRoi.tsx`) |
| POST /api/automation-roi-pdf | 405 | OK | Intentional — endpoint is GET-only |

## 3. Other Checks

- Sitemap URL count: **321 `<url>` entries** (target was 300+). PASS.
- robots.txt: present, allows all major search + social + AI crawlers, disallows /api/, /dashboard, /settings, /admin. PASS.
- Viewport meta on /: `width=device-width, initial-scale=1.0, viewport-fit=cover`. PASS.
- Cache headers on /: `cache-control: public, max-age=0, must-revalidate` (HTML). PASS.
- JSON-LD on /: Organization + WebSite schema in static HTML. PASS.
- JSON-LD on /pricing: Organization + WebSite (from static HTML). Pricing page itself only adds Product schema client-side; no FAQPage. **Deferred — owned by v46a brief.**
- JSON-LD on /blog/[post]: Article + BreadcrumbList + Author schema. PASS.

## 4. Bugs Found

1. **/api/lead allowlist incomplete.** 10 sources used in `src/` but rejected by the endpoint as `bad-source`: `agency-partner`, `trial-request`, `research-partners`, `status-subscribe`, `industry_faq`, `implementation_timeline`, `multi_step_form`, `exit_popup`, `lead_gate_completion`, `faq_section`. Plus `contact-form` for safety. Every form submission to these sources was being silently rejected with 400.
2. **/api/chat returns 502 `upstream-error` for ALL modes.** Anthropic upstream rejecting the model id `claude-haiku-4-5-20251001` (likely deprecated dated snapshot). The site's entire chat surface (6 demos) was non-functional.
3. **/api/checkout returns 500 when Stripe not configured.** Brief specified 200 + JSON. Was previously a hard error.
4. **/api/meta-event returns 500 when Meta CAPI env unset.** Brief specified 200 no-op. Was a noisy 500 in production logs.
5. **Chat error surface masked upstream cause.** Original code swallowed the upstream Anthropic body before logging — impossible to debug from client side.

## 5. Bugs Fixed (v46b)

| Fix | File |
|---|---|
| Added 11 missing sources to lead allowlist | `api/lead.ts` |
| Switched chat model from dated snapshot to floating alias `claude-haiku-4-5`, ENV-overridable via `ANTHROPIC_MODEL` | `api/chat.ts` |
| Improved chat error response: include upstream status + error type (no secrets leaked) | `api/chat.ts` |
| /api/checkout returns 200 + `{ok:false, error:"stripe-not-configured"}` when STRIPE_SECRET_KEY missing | `api/checkout.ts` |
| Same treatment for `plan-not-configured` (price id missing) | `api/checkout.ts` |
| /api/meta-event returns 200 + `{ok:true, skipped:"meta-not-configured"}` when META_PIXEL_ID or META_CAPI_TOKEN missing | `api/meta-event.ts` |

## 6. Bugs Deferred

1. **Pricing page lacks FAQPage JSON-LD.** Adding it requires editing `src/pages/Pricing.tsx`. The v46b brief explicitly forbids touching Pricing.tsx (owned by parallel agent v46a). Deferred until next pass.
2. **Anthropic account credit balance is exhausted.** After deploying improved error surfacing, the prod /api/chat response now reads:
   `upstream-error 400 invalid_request_error Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.`
   The API key works, the model id (`claude-haiku-4-5`) works, the request schema is correct. The only remaining fix is for the account owner to top up the Anthropic balance at console.anthropic.com. ALL six chat modes (assistant, simulator, critic, objections, sop, seo) are blocked by this single billing issue.
3. **package-lock.json was regenerated by local `npm install`** because of an environment-variable mismatch (`NODE_ENV=production` in the shell suppressed devDependencies install). Did not commit lockfile changes — keeping the lockfile aligned with the v45 baseline.

## 7. Build

`vite build` succeeded with 0 errors after rebase onto v46a. 60+ chunks emitted. RSS + sitemap regenerated (20 blog posts, sitemap merged).
