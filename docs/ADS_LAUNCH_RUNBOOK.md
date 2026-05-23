# Ads Launch Runbook — TrainYourAgent

How to take the assets you have (10 hero videos + 20 statics) and turn them
into a Meta campaign that books discovery calls at the Hormozi target of
15–25% landing-page → booked-call conversion.

**Time to first live ad: 90 minutes.** Most of that is account setup the
first time; subsequent launches take 20 minutes.

---

## What's already built for you

- `/apply` — the **dedicated paid-traffic landing page**. Every Meta ad
  points here. Hormozi pain stack + value equation + risk reversal + single
  CTA. `noindex,nofollow` so it doesn't compete with /hire or /vs in
  organic.
- `/api/lead` — Meta Pixel `Lead` event fires automatically on form submit
  + server-side mirror via CAPI for iOS 17+ tracking.
- 10 hero video prompts in `docs/HIGGSFIELD_PROMPT_PLAYBOOK.md` +
  `docs/HIGGSFIELD_30_DAY_AD_CALENDAR.md`.
- The branded wordmark @image_1 is in your Higgsfield library — re-use
  for every ad as the final card.

---

## Step 1 — Asset sizing matrix (re-fire each concept at 3 ratios)

The same ad concept needs to be **rendered three times** at different
aspect ratios so Meta serves the right asset to every placement. This is
where most agency ads die — they only ship 9:16 and lose Feed + Reels
because Meta auto-crops badly.

| Placement                               | Aspect | Pixels      | Notes                                          |
| --------------------------------------- | ------ | ----------- | ---------------------------------------------- |
| Instagram Reels, Stories, TikTok        | 9:16   | 1080 × 1920 | What you already have                          |
| Instagram Feed, Facebook Feed (best)    | 4:5    | 1080 × 1350 | **Highest-CTR placement in 2026**              |
| Instagram Feed, FB Feed (square fallback) | 1:1  | 1080 × 1080 | Use when 4:5 isn't available                   |
| Facebook right-column, Audience Network | 1.91:1 | 1200 × 628  | Lowest priority, but covers placements        |

**Action:** In GPT Image 2 + Higgsfield Marketing Studio, re-fire each of
your 8 proven static concepts at 4:5 and 1:1 (~14 credits each at 7 credits
per generation in GPT Image 2). Re-fire your top-3 video ads at 1:1 as
well. ~$30 in credits, 30 minutes of time.

---

## Step 2 — Set up the Meta tracking infrastructure (one-time)

You already have the code wired. You need to set the env vars in Vercel.

```bash
# In Vercel → Settings → Environment Variables:
META_PIXEL_ID=                  # Events Manager → your pixel → Pixel ID (15-16 digits)
META_CAPI_ACCESS_TOKEN=         # Events Manager → your pixel → Conversions API → Generate token
```

Then redeploy. Verify by opening `/apply` and checking the Network tab —
you should see `fbevents.js` load and a `PageView` fire.

---

## Step 3 — Campaign structure (Hormozi / Paid House / Andromeda-aware)

**One campaign. One ad set. 20 ads (10 video + 10 static).** This is the
post-Andromeda framework. Don't split-test ad sets — let Meta's algorithm
pick winners off micro-signals in the first 200 impressions.

```
Campaign: TYA – Apply – Cold (CBO ON, $100/day to start)
├── Ad Set: Operators 35–60mi Tampa, age 28–58, SMB owners
│   ├── Ad 01: Hormozi $94K pain hook       (video, 9:16)
│   ├── Ad 02: 11:47pm late-night operator  (video, 9:16)
│   ├── Ad 03: Cuban contrarian             (video, 9:16)
│   ├── Ad 04: Cardone every-zip-code       (video, 9:16)
│   ├── Ad 05: HVAC after-hours             (video, 9:16)
│   ├── Ad 06: Sunday-night dread           (video, 9:16)
│   ├── Ad 07: Outcome receipts             (video, 9:16)
│   ├── Ad 08: 30-sec demo style            (video, 9:16)
│   ├── Ad 09: Direct CTA ask               (video, 9:16)
│   ├── Ad 10: Founder confession           (video, 9:16)
│   ├── Static 01: STOP MISSING MONEY       (1:1 + 4:5)
│   ├── Static 02: $94K stat-hero           (1:1 + 4:5)
│   ├── Static 03: BEFORE/AFTER split       (1:1 + 4:5)
│   ├── Static 04: Cuban contrarian editorial (1:1 + 4:5)
│   ├── Static 05: THE RECEIPTS proof       (1:1 + 4:5)
│   ├── Static 06: AGENCY vs TYA comparison (1:1 + 4:5)
│   ├── Static 07: BOOK THE CALL CTA        (1:1 + 4:5)
│   ├── Static 08: HVAC IT IS 8 PM          (1:1 + 4:5)
│   ├── Static 09: (new) "Voicemail = expensive button"
│   └── Static 10: (new) "Your phone is leaking $4.62/min"
```

### Ad Set targeting

- **Geography:** 50mi radius of Tampa Bay (start). Expand only after week 4.
- **Age:** 28–58 (SMB owner sweet spot).
- **Detailed targeting:** "Small business owners," "Local service business,"
  "HVAC contractor," "Plumber," "Roofing contractor."
- **Lookalikes:** Once you have 500 `Lead` events in pixel, build a 1%
  Lookalike on Lead and add it as a separate ad set.
- **Placement:** Automatic placements (let the algorithm cut the dead ones).

### Optimization event

- **Lead** (server-side via CAPI).
- **NOT** "Landing Page View" — too cheap, optimizes for accidental clicks.

### Budget

- **CBO at $100/day** for week 1. Don't touch it.
- **$200/day** week 2 if CPL is under $50.
- **$500/day** week 3 if CPL is under $50 AND booked-call rate is over 15%.
- **Kill any ad** with hook rate (3-sec views / impressions) under 25% by
  day 4. Andromeda kills it for you if you don't.

---

## Step 4 — Reading the metrics (Paid House "Million a Month" preset)

Build a custom column preset in Ads Manager:

1. Impressions
2. CTR (all)
3. CPM
4. Hook Rate (3-sec video views / impressions) — **the single most important metric**
5. Cost per Lead
6. Lead → Booked Call rate (manual, track in spreadsheet)
7. Booked Call → Closed Deal rate (manual)
8. CAC (cost to acquire one paying customer)

### Decision thresholds

| Metric                | Kill   | Watch | Scale  |
| --------------------- | ------ | ----- | ------ |
| Hook Rate             | < 25%  | 25–35% | > 35% |
| CTR (all)             | < 1.0% | 1.0–1.5% | > 1.5% |
| CPM (Tampa SMB)       | > $40  | $25–40 | < $25 |
| Cost per Lead         | > $80  | $50–80 | < $50 |
| Lead → Booked Call    | < 10%  | 10–15% | > 15% |
| Booked Call → Closed  | < 20%  | 20–30% | > 30% |

If you hit Scale on Hook Rate + CTR + CPL for any ad, **batch that exact
concept across 5 avatar variations** (Higgsfield supports avatar swap on
a single project) and run all 5 as separate ads in the same set. That's
how you go from one winner to a winning ad set.

---

## Step 5 — The first 7 days

| Day | Action                                                                   |
| --- | ------------------------------------------------------------------------ |
| 0   | Set Meta + GA4 env vars. Deploy. Verify pixel fires on /apply.           |
| 1   | Upload all 20 ads. Launch campaign at $100/day CBO. Walk away.           |
| 2   | Don't touch. Algorithm is learning.                                       |
| 3   | Don't touch. Algorithm is learning.                                       |
| 4   | First read. Kill any ad with Hook Rate < 25% or zero leads.              |
| 5   | Second read. Bump budget on top-3 ads if CPL is good.                    |
| 6   | Add a Retargeting ad set: anyone who watched 75% of any ad → /apply.     |
| 7   | Full week-1 report. Decide: pause / hold / scale to $200/day.            |

---

## Step 6 — The landing page math

The `/apply` page is built to convert cold paid traffic at 15-25% to a
booked call. If your conversion is below that, the bottleneck is the
**page**, not the ads. Most common issues + fixes:

| Symptom                                | Likely cause                          | Fix                                                  |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| CTR > 2% but CR < 5%                   | Page promise doesn't match the ad      | Match the hero h1 to your top-performing ad         |
| CR > 10% but no booked calls           | Cal.com booking page is broken         | Test on mobile + desktop                            |
| Bounce > 70%                           | Page too slow on mobile                | Run PageSpeed Insights, kill any blocking script    |
| Booked calls but no shows              | No SMS reminder set up                 | Enable Cal.com SMS reminder (3hr + 30min before)    |

---

## Step 7 — Customer #1 close playbook

This is the part nobody writes runbooks for. When a real operator books
the call:

1. **Day before the call** — Send them a Loom of a TYA voice agent
   answering a sample call. ~3 minutes. Specific to their industry.
2. **On the call** — 15 minutes. No deck. No pitch. Ask:
   - "How many calls a week do you currently miss?"
   - "What happens when you miss one — does the customer call back or call someone else?"
   - "What's a missed call worth to your business on average?"
   - "If I built you an agent that picked up every one, what would it be worth?"
3. **End of call** — Send the agreement via Stripe Checkout the same hour.
   $4,950 build fee. Stripe handles the receipt + ACH option.
4. **Day 1 of build** — Send them the Discovery questionnaire from
   `/train/intake`. Schedule the cutover for day 21.
5. **Day 21** — Cutover ceremony on Zoom. Their number rings, the agent
   picks up, they hear it work, they sign off. Operations start day 22.

---

## What to NOT do

- Don't run on LinkedIn ads. CPM is 5–8× Meta and B2B SMB operators
  don't decision-make there.
- Don't run TikTok ads until you've burned $5K on Meta and have data.
- Don't split-test ad sets in the first 30 days. Let Andromeda pick.
- Don't change creative more than once per week. The algorithm needs
  signal time.
- Don't lower the offer. The price is the price. Hormozi: the only
  acceptable response to "can you do it cheaper" is "no, I can do it
  faster."

---

## When you have your first 3 customers

- Build a real testimonial wall at `/customers` (replace the founding cohort
  placeholder copy with actual operator quotes + real metrics).
- Record a 90-second case study Loom for each customer and add to
  `/case-studies/<slug>`.
- Build a new ad concept using the customer's actual numbers — that's the
  highest-converting creative you'll ever run.

---

## When you have your first 10 customers

- Lookalike audience (1% Lead-based, then expand to 1–3% and 3–5% as
  separate ad sets).
- Launch retargeting on Google Display + YouTube to anyone who hit /apply
  but didn't book.
- Hire a part-time setter to handle the inbound on calls that booked but
  didn't qualify (offer them a free ROI audit).

That's the whole playbook. Everything else is execution.
