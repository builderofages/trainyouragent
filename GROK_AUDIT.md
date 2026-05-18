# Grok Heavy — Critical Audit of trainyouragent.com

**Date:** 2026-05-18
**Auditor:** Grok Heavy (3-judge panel persona: Mark Cuban, Kevin O'Leary, Alex Hormozi)
**Subject:** trainyouragent.com — site, repo, offer, presentation
**Repo at time of audit:** `builderofages/trainyouragent` (PUBLIC) on `main`, commit `83e480f`
**Site version at audit:** v61 live; v62 in review; v63 in progress (this commit ships the recommendations)

---

## Executive summary

> "Smart. Built-in-public, open repo, live commit heatmap, honest zero metrics — this kid is shipping like I did in the 90s."
> — Cuban (paraphrased panel composite)

The panel was directionally **bullish on the operator** and **bearish on the presentation surface**.
- The code is, in the panel's framing, "billionaire-grade" for a one-person operation
- The architecture is correct, defensive, and not over-engineered
- The offer stack (Hormozi-style) is well-constructed: $21,500 bundled value, 21-day-or-free guarantee, money-back, no contract
- The blocker on every panel member's "10 minutes of attention" budget is the same: **zero customers, zero revenue**

The site presentation — not the product or the code — is what's blocking conversion.

---

## Panel verdicts

### Mark Cuban — "Built like '90s shipping. Need one paying customer."
Cuban respected:
- 340+ public commits on the open repo
- 88 ship-versions tracked in /changelog
- Public audits committed to the repo (FINAL_AUDIT.md, etc.)
- Transparent "no fake testimonials" stance on /proof
- Operator velocity visible in the commit heatmap

His hardest objection: zero customers / zero revenue. What unlocks 10 minutes of his attention:
1. One paying customer (named, with a number)
2. A 60-second video of the agent handling a real inbound call

### Kevin O'Leary — "Offer stack is right. Show me the cash."
O'Leary's read tracks Cuban's: the offer is correctly constructed. He singled out:
- The $21,500 bundled value stack on /pricing
- The 21-day delivery guarantee (free if missed)
- The "no contract, cancel any time" stance
- The honest 30-day money-back

Same blocker: he needs to see the first customer close before he extends attention.

### Alex Hormozi — "Risk reversal is real. Now stack proof."
Hormozi's read: the offer is structurally sound — the bundled value, the guarantees, the risk reversal block are all in the right place. What needs to happen next is **proof-stacking**: every honest piece of evidence should be more visible and more above-the-fold than it currently is.

---

## Architecture compliments (the win)

The panel separately reviewed the code and was unanimously positive.

- **`api/_lib/llm.ts`** — "Not junior — production reliability thinking." Multi-provider fallback (Anthropic → Groq → Gemini), correct timeout handling, defensive parsing.
- **`api/chat.ts`** — "Senior-level. Prompt injection defenses are tight. Not over-engineered — defensive and correct." System-prompt isolation, role-based message validation, body-size limits.
- **Stripe + Cal webhooks** — "Rock-solid." Constant-time HMAC verification, Origin-header rejection, body caps, rate limits, idempotency keys.
- **CORS + rate limiting** — Consistent across every endpoint; correct allowlist; honest 429 responses.

The conclusion: **the code is not the problem.** The site's surface presentation is.

---

## Top 10 ranked changes (Grok Heavy's prioritized list)

These are the recommendations ranked by impact-per-unit-effort.

| # | Change | Surface | Why |
|---|---|---|---|
| 1 | **Live voice demo embedded directly in Home hero** | `src/pages/Index.tsx` + new `HeroVoiceEmbed.tsx` | The 10x lever. Visitor lands → talks to a working AI agent in 5 seconds → leaves genuinely impressed instead of just-another-AI-pitch. |
| 2 | **Live KPIs from `/api/public-metrics` above the fold on Home** | `src/pages/Index.tsx` + new `LiveKpiStrip.tsx` | Move proof to the surface. Commits, live URLs, days building. Cache 30 min, never show "—". |
| 3 | **ROI calculator on `/pricing`** with plan recommendation | `src/pages/Pricing.tsx` + new `RoiInline.tsx` | "Based on your numbers, the Operator plan pays for itself in 23 days." Self-qualifies the buyer to a specific lane. |
| 4 | **Save `GROK_AUDIT.md` to repo root** | this file | Public audit. Trust signal. |
| 5 | **CSP `unsafe-inline` migration** | `vercel.json`, `index.html` | Security hardening. Migrate to nonce-based or remove inline scripts. |
| 6 | **`/live` honest empty state** | `src/pages/Live.tsx` | When empty, show "be the first" CTAs that fire real events the visitor sees appear. No fake fillers — that's the smarter version of Grok's "seed fake events" suggestion. |
| 7 | **Founding-customer case study placeholder** on `/proof` | `src/pages/Proof.tsx` | Reserved space for the first customer's named, measurable story. Honest emptiness today, ready for v64. |
| 8 | **Hero h1 variant rotation** (A/B without an A/B framework) | `src/pages/Index.tsx` | Three strong variants, deterministic per session, tracked via Meta Pixel/CAPI. |
| 9 | First customer case study → `/proof` (after v64 close) | `src/pages/Proof.tsx`, JSON to recent-activity | Drops in once the first customer closes. |
| 10 | Continue weekly commit cadence visible on `/proof` | already shipped (CommitGraph) | Stay consistent — Cuban's "shipping like '90s" comment is the moat. |

Items 1–8 ship in v63. Items 9–10 are continuous.

---

## The 10x conversion lever (quoted)

> "Embed a live, interactive voice demo (using the existing /voice-demo + Groq) directly in the hero section on the home page with the copy: 'Talk to your AI receptionist right now — tell it you need an HVAC tech tomorrow at 2pm.' One click, zero friction, instant proof. Everything else is secondary."
> — Grok Heavy

Why this is the unlock: every other change on this list is a marginal improvement. Putting a working AI voice agent in the hero is a category change in what the visitor experiences in the first 5 seconds. Trust, ability, and "this is real" all close at once. That's the lever.

---

## Known gaps deferred from v63

- **Full CSP nonce migration** is not safe to ship in one commit. v63 documents the gap, removes `'unsafe-inline'` from `style-src`/`script-src` only where it's safe given the current inline `<script>` tags in `index.html`. A complete migration requires refactoring the inline GA/Pixel bootstrap into external scripts with nonces. Tracked for v64.
- **First named customer case study.** v63 ships the placeholder. The named entry waits on the first close.

---

## Method

The panel review was conducted as a 3-judge composite persona, with each judge weighing in on the same set of artifacts: the live site, the public repo, the `/proof` page, `/pricing`, `/metrics`, and `/live`. The architecture review was conducted separately against the `api/` directory and the `src/lib/` helpers. The panel was given access to the public GitHub repo and the live site at `trainyouragent.com`.

This file is committed verbatim to the repo as part of v63. The recommendations above are mapped 1:1 to the v63 commit. If a recommendation does not ship in v63, it is listed under "Known gaps deferred."

— *Saved to repo root by the v63 ship process.*
