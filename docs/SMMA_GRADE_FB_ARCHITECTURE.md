# SMMA-Grade Meta Ads Architecture — TrainYourAgent

How a $20M+ agency for AI products structures the account. Built so you
just add budget and unpause — every other decision is already made.

---

## ACCOUNT-LEVEL HYGIENE

**Business Manager:** TrainYourAgent (already exists)
**Ad Account:** `act_1011542367743702` (already exists)
**Page:** TrainYourAgent (lock this — never serve under Citrusburn)
**Pixel:** TYA Pixel (waiting on `META_PIXEL_ID` capture)
**Domain Verified:** trainyouragent.com (verify in Brand Safety →
Domains; required for iOS 14.5+ conversions)
**Conversions API:** Wired via `/api/event` + dedupe by event_id
  (already shipped in v97 — once META_CAPI_ACCESS_TOKEN lands, mirroring
  fires automatically)
**Aggregated Event Measurement priority order (set in Events Manager):**
1. Lead (highest — what we optimize)
2. CompleteRegistration
3. InitiateCheckout
4. AddToCart
5. ViewContent
6. PageView
7-8: unused

---

## CAMPAIGN HIERARCHY (the structure that scales to $50K/day)

```
TYA_ACCOUNT
│
├── TYA_LEAD_APPLY_COLD_2026-Q2 (Campaign — CBO, Lead objective)
│   │
│   ├── AS_TampaBay-50mi_SMB-Owner_28-58_Broad (Ad Set #1)
│   │   ├── AD_19 — Hormozi $4.62/min counter (video)
│   │   ├── AD_01 — HVAC after-hours (video)
│   │   ├── AD_12 — Restaurant dinner rush (video)
│   │   ├── AD_16 — Pest control 9pm (video)
│   │   ├── AD_S_hvac-pain-photo (static)
│   │   ├── AD_S_legal-pain-photo (static)
│   │   ├── AD_S_dental-pain-photo (static)
│   │   └── (15-20 ads, mixed video+static, all 3 aspect ratios)
│   │
│   ├── AS_TampaBay-50mi_SMB-Owner_28-58_Interest-Stack (Ad Set #2 — same)
│   │   └── (same ads as Ad Set #1)
│   │
│   └── AS_LookalikeLead-1pct (Ad Set #3 — built post-500 Lead events)
│       └── (same ads as Ad Set #1)
│
├── TYA_LEAD_APPLY_WARM_RETARGET_2026-Q2 (Retargeting Campaign — CBO)
│   │
│   └── AS_VideoView75pct_30d (Ad Set)
│       └── (3-5 ads — strongest performers from cold + a different
│            "warm-only" closer ad)
│
└── TYA_BRAND_DEMO_VIDEO_2026-Q2 (Awareness Campaign — ThruPlay)
    │
    └── AS_TampaBay-50mi_SMB-Owner_28-58_Broad
        └── AD_20 — Founder operator-built
            (top-of-funnel awareness — feeds the retargeting pool)
```

---

## NAMING CONVENTIONS (lock this — it's how you read reports later)

### Campaigns
`TYA_<objective>_<surface>_<temp>_<period>`
- TYA = brand
- objective = LEAD | BRAND | ENGAGE | TRAFFIC
- surface = APPLY | DEMO | TRAIN
- temp = COLD | WARM | RETARGET
- period = 2026-Q2

Examples:
- `TYA_LEAD_APPLY_COLD_2026-Q2`
- `TYA_LEAD_APPLY_WARM_RETARGET_2026-Q2`
- `TYA_BRAND_DEMO_VIDEO_2026-Q2`

### Ad Sets
`AS_<geo>_<persona>_<age>_<targeting-mode>`
- AS = ad set
- geo = TampaBay-50mi | National | LookalikeLead-1pct | RetargetVV75
- persona = SMB-Owner | Operator | Founder
- age = 28-58
- targeting-mode = Broad | Interest-Stack | Lookalike

Examples:
- `AS_TampaBay-50mi_SMB-Owner_28-58_Broad`
- `AS_LookalikeLead-1pct_28-58`
- `AS_RetargetVV75_30d`

### Ads
`AD_<id>_<niche-or-cross>_<framework>_<treatment>_<aspect>`

Examples:
- `AD_19_cross_hormozi-counter_video_9x16`
- `AD_01_hvac_pain_video_9x16`
- `AD_S_hvac_pain_photo_1x1`
- `AD_S_legal_contrarian_editorial_4x5`

(S = static, no number prefix needed since unique filename is in scripts/upload-fb-creatives.sh)

---

## BUDGET TIERS (the only knob you turn)

### Tier 1 — Validation ($100/day)
- **Weeks 1-2.** CBO on cold campaign.
- 20 ads in one ad set. Let Andromeda pick winners off the first 200
  impressions per ad.
- **Kill threshold:** any ad with Hook Rate <25% at day 4 → pause.
- **Read:** day 4, day 7. Don't touch in between.

### Tier 2 — Scale to baseline ($200-500/day)
- **Weeks 3-4.** Only enter if Tier 1 CPL < $50 AND Lead → Booked
  Call rate > 15%.
- Bump CBO by 20% every 48 hours if metrics hold.
- Add second ad set: AS_Lookalike1pct (built once you have 500+ Lead
  events).
- **Kill threshold:** CTR drops below 1.0% OR CPL > $80 for 72hrs.

### Tier 3 — Aggressive ($1K-5K/day)
- **Week 5+.** Only with positive contribution margin proven.
- Add retargeting campaign (TYA_LEAD_APPLY_WARM_RETARGET).
- Add brand awareness campaign (TYA_BRAND_DEMO_VIDEO) at 15% of total
  spend.
- Geo-expand: 50mi → 200mi → state-wide → national.
- **Kill threshold:** Blended CAC > 30% of average customer LTV.

### Tier 4 — Aggregate operator ($10K+/day)
- Multi-ad-account structure required.
- Hire a media buyer or use Northbeam / Triple Whale for true MMM.
- Out of scope for this doc — pre-revenue at this tier.

---

## AUDIENCE STRATEGY

### Cold (broad-first, Andromeda's preferred mode)
- **Geo:** 50mi radius of Tampa (start). Expand only after week 4.
- **Age:** 28-58
- **Languages:** English, Spanish (Tampa-relevant)
- **Detailed Targeting Expansion:** ON (Andromeda's requirement)
- **Interests:** "Small business owners", "Local service business",
  "HVAC contractor", "Plumber", "Dentist", "Lawyer", "Roofing
  contractor", "Restaurant owner" — but ONLY if Detailed Targeting
  Expansion is on, otherwise these tank delivery.
- **Exclusions:** "Marketing agency", "Recruiter", "Real estate agent
  (employed by brokerage)", "Job seeker" — to keep CPM low.

### Lookalike (built once you have 500+ Lead pixel events)
- **Source:** `Lead` event, 90-day window
- **Size:** 1% to start. Expand to 1-3% then 3-5% as separate ad sets
  once 1% saturates.
- **Geo:** US (Lookalike auto-expands but geo-constrains to your seed
  country)

### Retargeting (after week 2)
- **Custom audiences:**
  1. Video viewers 75% in last 30 days
  2. /apply page visitors in last 14 days who didn't convert
  3. Engaged with Page in last 30 days (not customer)
- **Exclude:** Lead event in last 30 days (already in flow)

### Customer (after week 8)
- Upload paying-customer list as Custom Audience
- Build 1% Lookalike on this — highest-quality signal you can give Meta

---

## OPTIMIZATION EVENT — PICK THIS ONCE, DON'T CHANGE

**Optimization:** `Lead` (server-side via CAPI, dedupe by event_id)
**NOT:** Landing Page View (too cheap, optimizes for accidental clicks)
**NOT:** Click (Meta interprets too broadly)
**NOT:** Purchase (we don't have one on /apply — Stripe runs separately)

If pixel data is thin in week 1, temporarily fall back to "Highest Volume
of Conversions" optimization mode with Lead as the conversion goal — Meta
will use modeled conversions until the pixel has enough real signal.

---

## ATTRIBUTION SETTING

**7-day click + 1-day view** (Meta's current default — keep it)

Why not 28-day click: dramatically over-attributes; you can't compare
to GA4 cleanly. Keep both reports honest by using the same window.

---

## DELIVERY OPTIMIZATION — what Andromeda needs

1. **CBO at the campaign level** (not ABO — never let Andromeda's hands
   be tied)
2. **20 ads minimum per ad set** (Andromeda's signal floor)
3. **All 3 aspect ratios per concept** (lets Meta pick the best ratio
   per placement automatically)
4. **Automatic placements enabled** — Andromeda is smarter than you at
   picking which placement gets which ad
5. **Advantage+ Creative ON** — Andromeda will auto-iterate copy + crop
   + zoom for placement-specific delivery. This is the post-Andromeda
   killer feature; if you turn it off, you're playing in 2023 mode.
6. **NEVER edit a live ad** — Andromeda resets learning. Duplicate +
   edit + relaunch as a new ad if you must change anything.
7. **NEVER edit budgets in the first 4 days** — Andromeda is in learning
   phase. Budget changes restart it.
8. **NEVER A/B test ad sets in the first 30 days** — let CBO do it.

---

## REPORT CADENCE — what you actually look at

### Daily (5 min, 8am)
- Spend (vs. budget cap)
- Total Leads
- Cost per Lead (vs. target $50)
- Hook Rate on top 5 ads (vs. 25% kill threshold)

### Weekly (45 min, Monday morning)
- Use Paid House "Million a Month" column preset (already shipped in
  `docs/PAID_ADS_METRICS.md` via the plugin skill)
- Top 5 ads by spend × CTR × CPL — keep
- Bottom 5 ads — pause
- Lookalike vs. Broad — which is winning?
- Retargeting CPL (should be 30-50% of cold CPL — if not, the warm
  audience isn't actually warm)

### Monthly (2 hr, last Friday)
- Cohort analysis — when did Leads become Booked Calls? Closed Deals?
- Refresh creative — kill any ad with Hook Rate trending down 3 weeks
  in a row (creative fatigue)
- Audience expansion call (geo, age, lookalike size)

---

## CREATIVE REFRESH RULE

Andromeda kills ads when audience saturates. You'll see CTR decline +
Frequency climb above 3.5. Refresh signal:

| Frequency | Action |
|---|---|
| < 2.0 | Keep — still expanding reach |
| 2.0 - 3.5 | Watch — performance should still be holding |
| 3.5 - 5.0 | Refresh — duplicate ad, swap creative, relaunch fresh |
| > 5.0 | Kill — audience is saturated, cost will spike |

**Creative refresh velocity target:** 5 new ads per ad set per week
(once Tier 2). Don't refresh by editing existing ads — duplicate +
swap creative + relaunch as new ad ID.

---

## COMPETITOR SWIPE FILE — what to copy from who

### Direct competitors (AI agency space)
- **Goose AI** — facebook.com/goose.ai (CA-based, similar GTM)
- **Hyperbound** — facebook.com/hyperbound (SDR-AI)
- **AdaSupport** — facebook.com/adasupport (enterprise but framework
  steal-worthy)
- **GoHighLevel** — facebook.com/gohighlevel (massive ad spend, watch
  their hook formats — usually too long, but their thumbnail-stop
  technique is best in class)

### Adjacent (high-converting service-business ads)
- **Patriot Pest** — pest control ads, A+ tier
- **Mosquito Joe** — same — strong creative-refresh cadence
- **One Hour Heating & Air** — HVAC industry leader; their UGC-style
  homeowner-testimonial creatives are top quartile
- **Service Titan** — they market to ops; watch their B2B SaaS angle

### Awareness operators (study their video pacing)
- **Alex Hormozi** (Acquisition.com) — hook in 0.4s, value in 3s,
  asymmetric talking-head, NO music
- **Codie Sanchez** (Contrarian Thinking) — talking-head + b-roll +
  big-number overlay, pace ~140 words/min
- **Mr Beast** (philanthropy + AI tie-ins) — for visual energy reference
  only, not for direct copy

### How to use Meta Ad Library to swipe (free, no token needed)
1. https://www.facebook.com/ads/library
2. Search competitor's Page name
3. Filter: Active + Last 30 days
4. Sort by ad spend (proxy via number of versions running)
5. Screenshot top 5 ads each week
6. Drop into `ads/swipe/` directory
7. Analyze hook (first 0.4s), value drop (first 3s), CTA framework,
   end-card layout
8. Rebuild for our brand voice — never copy verbatim, always reframe

---

## KILL CRITERIA (printable cheat-sheet)

Print this. Pin it next to your monitor.

| Metric | Kill | Watch | Scale |
|---|---|---|---|
| **Hook Rate** | < 25% | 25–35% | > 35% |
| **CTR (all)** | < 1.0% | 1.0–1.5% | > 1.5% |
| **CPM (Tampa SMB)** | > $40 | $25–40 | < $25 |
| **Cost per Lead** | > $80 | $50–80 | < $50 |
| **Lead → Booked Call** | < 10% | 10–15% | > 15% |
| **Booked Call → Closed** | < 20% | 20–30% | > 30% |
| **Frequency** | > 5.0 | 3.5–5.0 | < 3.5 |

Any single ad in "Kill" column for 72 consecutive hours → pause.
Don't argue with the data. Andromeda is smarter than your gut.

---

## WHAT YOU LITERALLY NEED FROM ALEXANDER (in priority order)

1. **`FB_ACCESS_TOKEN`** — 60 seconds in Business Settings → System
   Users → "TYA Automation" → admin → Generate Token (60 day) → check
   `ads_management`, `pages_show_list`, `business_management`,
   `pages_manage_ads`. Copy the token, paste in chat, I do everything
   else.
2. **`META_PIXEL_ID`** — In Events Manager → click the TYA Pixel →
   copy the 15-16 digit ID at top of page. Paste in chat. I wire it.
3. **`META_CAPI_ACCESS_TOKEN`** — same Pixel page → Settings → Conversions
   API → Generate Access Token. Paste in chat. I wire it.
4. **`FB_PAGE_ID`** — auto-derived from `FB_ACCESS_TOKEN` via `GET
   /me/accounts` — I get this myself once you give me the token.

Once those 3 tokens land in chat, my pipeline:
1. `META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN` → Vercel env → redeploy
   → all GA4-instrumented events also fire to Meta with dedupe
2. `FB_ACCESS_TOKEN` → run `scripts/setup-fb-campaign.sh` → Campaign +
   Ad Set scaffolded as PAUSED
3. Then run `scripts/upload-fb-creatives.sh` → every image and video
   in `ads/static/` + `ads/video/` becomes a PAUSED draft ad under
   the named ad set
4. You unpause when ready. The budget is the only knob you turn.
