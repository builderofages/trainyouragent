# Grok Heavy Re-Audit — trainyouragent.com (post v258-v265 fixes)

**Run:** 2026-05-30 via grok.com SuperGrok Heavy mode
**Thought time:** 1m 16s
**Sources cited:** 252
**Captured verbatim via Chrome MCP screenshots**

---

## Score movement

**Before (initial audit):** 5.5/10 average
**After (post v258-v265):** 6.56/10 average

Page-by-page delta:

| Page | Before | After | Delta |
|---|---|---|---|
| / | 6/10 | **5/10** | -1 (SPA shell + vague title) |
| /pricing | 8/10 | **9/10** | +1 (ROI calc + 3-lane simplify) |
| /architecture | 5/10 | **6/10** | +1 (SMB intro helped) |
| /websites | 4/10 | **5/10** | +1 (reposition helped) |
| /template/hvac | 6/10 | **8/10** | +2 (targeted and useful) |
| /reviews/submit | 3/10 | **8/10** | +5 ($200 incentive worked) |
| /customers | 5/10 | **5.5/10** | +0.5 (proof block helped, SPA cripples) |
| /integrations | 7/10 | **6/10** | -1 (Grok now sees SPA bug here too) |

---

## 3 killers status (post-fixes, verbatim)

1. **JS-heavy SPA serving near-empty HTML: STILL ACTIVE.** Home, architecture, websites, customers, integrations, and hvac template all return near-empty shells or static fallbacks (only title + stylesheet). Pricing is the sole fully-rendered page. This tanks SEO, initial load, bots, and bounce rates.

2. **Vague Everything-AI positioning: STILL ACTIVE.** Homepage title and meta unchanged ("TrainYourAgent — Everything-AI for SMBs & Startups"). Subpages sharpened to AI voice/messaging receptionists for service SMBs (HVAC calls, bookings, CRM), but the broad label lingers and dilutes focus.

3. **Sparse social proof: CLOSED.** Pricing now has real metrics ($22k/mo average leak from 12 Tampa HVAC audits, 39 operators evaluated this quarter). /reviews/submit adds $200 Stripe credit incentive + backlink. Case studies referenced; visibility still limited by SPA on proof-heavy pages.

---

## Reality check on killer #2

Grok cited the OLD homepage title verbatim. My v259 ship changed the static `<title>` to "AI Receptionist for HVAC, Dental, Salon — Answers Calls, Books Jobs · TrainYourAgent" and I verified live via Chrome MCP. Two possibilities:

1. Grok's web-search tool hit a CDN edge cache that hadn't propagated yet
2. Grok's tool reads the static fetched HTML but doesn't parse `<title>` reliably under load

Either way, the new title IS live in production — confirmed in tab metadata. Killer #2 may be a perception issue not a reality issue, but visibility is what matters for crawlers.

---

## Reality check on killer #1

Grok's wording: "return near-empty shells or static fallbacks (only title + stylesheet)." The v259/v260 noscript hero content IS in the response, but Grok's tool treats `<noscript>` as fallback-only, not as primary content.

The fix isn't more noscript. The fix is putting real content INSIDE the React mount div (`<div id="root">`) so:
- Crawlers see real h1, subhead, CTAs, bullets as primary content
- React hydrates over it once JS executes (no flicker if structure matches)
- Tools that don't execute JS or parse noscript still get real positioning

This is what v266 ships.

---

## Next 3 things Grok says would 2x conversions (verbatim)

1. **Migrate every page to proper SSR/SSG immediately.** Zero-tolerance for empty initial HTML. Fix load, SEO, bots, mobile, and first-second trust or watch bounces destroy everything.

2. **Kill "Everything-AI" cold.** New homepage hero and title: "AI Voice Receptionists for HVAC, Dental, Plumbers & Service Pros — Answer Calls in 2 Rings, Book Jobs Live, Integrate Your CRM. Live in 7 Days or Refund." Make specificity inescapable.

3. **Flood the site with 8+ named, quantified case studies and video testimonials.** Put $ ROI screenshots, before/after metrics, and customer logos on homepage + /customers above the fold. Turn the /reviews/submit incentive into a content engine. Proof scarcity is now the only remaining soft spot.

---

## What v266 will ship

1. **Real content inside #root, not just noscript.** Prerender writes the hero h1/subhead/CTAs/bullets directly inside `<div id="root">…</div>` so crawlers see actual content as the primary DOM, not a fallback. React hydrates over it on mount.

2. **Cache-bust headers on prerendered HTML.** Add `Cache-Control: public, s-maxage=60` so Vercel edge cache invalidates within a minute of new deploys.

3. **Explicitly include / in the prerender route list** (currently homepage uses base dist/index.html — should be its own dist/0/index.html or similar).

What's still **founder-only** (not mine to do):
- Get 8 named customer case studies (need real customers signing off)
- Record video testimonials (same)
- Full Next.js migration (multi-day refactor)

But the inside-#root content fix WILL satisfy the spirit of Grok's killer #1: crawlers will see real positioning per route in the primary DOM.

---

## Founder note: which Grok recommendation NOT to ship

Grok suggested: "AI Voice Receptionists for HVAC, Dental, Plumbers & Service Pros — Answer Calls in 2 Rings, Book Jobs Live, Integrate Your CRM. Live in 7 Days or Refund."

This contradicts your "stop messing my site" lock on the visible homepage hero. Your existing hero ("Your phone will be answered in 21 days. If it doesn't book one real appointment, you pay nothing.") is what I will NOT touch without your explicit greenlight. The static `<title>` + OG + per-route hero — all fair game and shipped.

If you DO want to swap the visible hero to Grok's specific language, say the word and I'll ship it.
