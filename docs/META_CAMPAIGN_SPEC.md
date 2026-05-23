# Meta Campaign Spec — TrainYourAgent / Apply / Cold

**Audience:** SMB operators in Tampa Bay losing inbound calls.
**Goal:** 15–25% landing-page → booked discovery call.
**Account:** `1011542367743702` (your existing TYA Meta ads account).
**Doc owner:** Alexander (founder, sole approver).
**Last updated:** 2026-05-23.

---

## 0. Pre-flight — verify before you touch the Create button

Three things to confirm in Business Manager. **If any of these are wrong,
fix them first before creating anything.** This is the OCD discipline that
separates a 10-yr media buyer from a 6-week Skool grad.

| Item                  | Must be                                                            |
| --------------------- | ------------------------------------------------------------------ |
| Facebook Page         | **TrainYourAgent** (NOT Citrusburn, NOT any past project)           |
| Instagram account     | **@trainyouragent** (linked under Business Manager → Accounts)      |
| Pixel                 | **TrainYourAgent Pixel** — copy the 15-16 digit ID into Vercel env `META_PIXEL_ID` |
| Conversions API       | Token generated under that pixel — into Vercel env `META_CAPI_ACCESS_TOKEN` |
| Domain verified       | **trainyouragent.com** verified under Business Settings → Brand Safety → Domains |
| Ad account currency   | USD                                                                 |
| Payment method        | Active card on file. (You'll be billed during the run.)             |

> **Citrusburn lock-out:** When creating the campaign, the "Page" picker
> in the Ad Set step **defaults to the most recently used Page**. That's
> likely Citrusburn right now. **Manually switch to TrainYourAgent every
> time.** If you forget, Meta will spend your TYA budget showing ads
> branded as Citrusburn. Catastrophic.

---

## 1. Campaign

| Field                  | Value                                                             |
| ---------------------- | ----------------------------------------------------------------- |
| **Name**               | `TYA_LEAD_APPLY_COLD_2026-Q2`                                     |
| Buying type            | Auction                                                           |
| Objective              | **Leads** (or "Sales" if Leads-with-website not available)        |
| Special ad categories  | None                                                              |
| Campaign budget (CBO)  | **ON** — `$100.00 / day` to start                                 |
| Budget schedule        | Run indefinitely                                                  |
| Bid strategy           | Highest volume (lowest cost)                                      |
| Attribution setting    | **7-day click + 1-day view**                                      |

**Naming convention** (use for every TYA campaign forever):
```
{brand}_{objective}_{funnel-stage}_{audience}_{quarter}
       └ TYA       └ LEAD          └ APPLY    └ COLD      └ 2026-Q2
```

For retargeting later: `TYA_LEAD_APPLY_RT-VV75_2026-Q2` (RT = retargeting,
VV75 = video-view 75% audience).

---

## 2. Ad Set — single ad set, broad targeting, let Andromeda pick

| Field                  | Value                                                             |
| ---------------------- | ----------------------------------------------------------------- |
| **Name**               | `TYA_AS_TampaBay-50mi_SMB-Owner_28-58_Broad`                      |
| Performance goal       | **Maximize number of conversions**                                |
| Pixel                  | TrainYourAgent Pixel                                              |
| Conversion event       | **Lead** (must be set up under that pixel + fire on /apply form submit) |
| Cost-per-result goal   | **Leave empty** (let the algorithm price-discover)                 |
| Schedule               | Start tomorrow 06:00 ET. End: never. Ad scheduling: all hours.    |
| Audience type          | New audience                                                       |
| Location               | **Tampa, Florida, US — 50 mi radius**                              |
| Age                    | **28 – 58**                                                       |
| Gender                 | All                                                                |
| Languages              | English (All), Spanish (All)                                       |
| **Detailed targeting** | Include any of: `Small business owners`, `Local service business`, `HVAC contractor`, `Plumbing contractor`, `Electrician`, `Roofing contractor`, `Restaurant owner`, `Fitness business owner` |
| Advantage detailed targeting | **ON** (lets the algorithm broaden into adjacent interests) |
| Exclusions             | Exclude employees of TrainYourAgent (custom audience, build once)  |
| Placements             | **Advantage+ placements (automatic)** — let Meta serve everywhere  |
| Optimization           | Conversions                                                        |
| Attribution            | 7-day click, 1-day view                                            |

**Why broad, not narrow:** Andromeda (Meta's post-2024 ranking system)
performs best with a large addressable pool. Narrow interest targeting
strangles the algorithm's ability to find the right signal in your
creative. The signal lives in the creative now, not the targeting.

---

## 3. The 14 Ads — one ad per concept, OCD-named, all pointing at `/apply`

### Naming convention

```
{ad#}_{concept-slug}_{aspect-ratio}_{date-shipped}
```

Example: `01_StopMissingMoney_9-16_20260523`

### Per-ad assignment table

| Ad # | Name                                       | Asset format     | Aspect    | From your Higgsfield/GPT-Image library |
| ---- | ------------------------------------------ | ---------------- | --------- | -------------------------------------- |
| 01   | `01_StopMissingMoney_9-16_20260523`        | Static image     | 9:16      | "STOP MISSING MONEY." navy             |
| 02   | `02_StopMissingMoney_1-1_20260523`         | Static image     | 1:1       | "STOP MISSING MONEY." square (just rendered) |
| 03   | `03_94K-StatHero_9-16_20260523`            | Static image     | 9:16      | "$94,000 / PER YEAR LOST" white        |
| 04   | `04_94K-StatHero_1-1_20260523`             | Static image     | 1:1       | "$94,000" square (just rendered)       |
| 05   | `05_BeforeAfter_9-16_20260523`             | Static image     | 9:16      | BEFORE 12 / AFTER 47 red-green         |
| 06   | `06_CubanContrarian_9-16_20260523`         | Static image     | 9:16      | "Voice AI didn't fail you" editorial   |
| 07   | `07_Receipts_9-16_20260523`                | Static image     | 9:16      | "THE RECEIPTS · 344+ commits" stack    |
| 08   | `08_AgencyVsTYA_9-16_20260523`             | Static image     | 9:16      | "AN AI AGENCY vs TRAINYOURAGENT" black |
| 09   | `09_BookTheCall_9-16_20260523`             | Static image     | 9:16      | "BOOK THE CALL." green CTA             |
| 10   | `10_BookTheCall_1-1_20260523`              | Static image     | 1:1       | "BOOK THE CALL." square (just rendered) |
| 11   | `11_HVAC-8PM_9-16_20260523`                | Static image     | 9:16      | "HVAC OWNERS: IT IS 8 PM" navy         |
| 12   | `12_FounderConfession_9-16_20260523`       | Video (8s)       | 9:16      | Higgsfield Ad #5 — founder kitchen     |
| 13   | `13_LateNightOperator_9-16_20260523`       | Video (8s)       | 9:16      | Higgsfield Ad #6 — 11:47pm navy        |
| 14   | `14_CubanContrarianVideo_9-16_20260523`    | Video (8s)       | 9:16      | Higgsfield Ad #8 — coffee bar          |

> Six more videos (#7 Cardone, #9 Sunday-night, #10 voicemail) are still
> rendering in your Higgsfield queue. Add them as Ads 15-20 once they land.

### Per-ad copy (paste this into the Ad creation panel)

**Universal across all 14 ads:**

| Field                  | Value                                                             |
| ---------------------- | ----------------------------------------------------------------- |
| Identity (Facebook Page) | **TrainYourAgent** ← MANUALLY SET, do not trust default          |
| Identity (Instagram)   | **@trainyouragent** ← MANUALLY SET                                |
| Format                 | Single image or video                                             |
| Destination            | Website                                                            |
| Website URL            | `https://trainyouragent.com/apply?utm_source=meta&utm_medium=paid&utm_campaign=TYA_LEAD_APPLY_COLD_2026-Q2&utm_content={{ad.name}}` |
| Display link           | `trainyouragent.com/apply`                                        |
| Call to action button  | **Apply Now** (or "Book Now" if Apply isn't available)            |
| Languages              | English, Spanish                                                  |

**Primary text** (the text above the creative — vary per ad concept):

```
Ad 01–04 (Hormozi pain):
  You're losing one out of every four inbound calls.
  Every missed call is worth $400–$2,400.
  Your competitor picked up the one you dropped.
  We build a voice agent that answers every single call. 21 days flat. $4,950 build + $1,997/mo. 30-day money-back.

Ad 05 (Before/After):
  Three months ago this operator missed 41 calls in a week.
  Today their AI agent answers every one of them.
  Same phone number. Same business. The only thing that changed is who picks up.

Ad 06 + 14 (Cuban contrarian):
  Voice AI didn't fail you. Your vendor did.
  Every "AI agency" you've talked to in 2026 is a six-week Skool grad reselling a no-code platform. We are not that.
  We build the agent. We operate it. We pick up the phone at 2am.

Ad 07 (Receipts):
  Not testimonials. Receipts.
  344+ public commits in 91 days. 569 live URLs in production. 4 years applied AI since the GPT-3 alpha. 21 days from intake to your live phone line.
  Every claim is verifiable. trainyouragent.com/proof

Ad 08 (Agency vs TYA):
  An "AI agency" vs an AI builder.
  They: resell a no-code platform. We: build it.
  They: 6 months and counting. We: 21 days flat.
  They: ghost when it breaks. We: founder picks up at 2am.

Ad 09 + 10 (Book the call):
  15 minutes. Direct line to the founder. No SDR. No pitch.
  If a voice agent doesn't fix your problem, I'll tell you on the call.
  trainyouragent.com/apply

Ad 11 (HVAC niche):
  HVAC owners: it's 8pm. Their furnace just died. They're calling every shop in town.
  Whoever picks up first wins the job.
  Our voice agent picks up in 3 rings. Books the emergency. You wake up to revenue.

Ad 12 (Founder confession video):
  I built TrainYourAgent because every operator I met was getting sold AI platforms they couldn't deploy.
  I'm the engineer. I do the build. I operate it. I pick up the phone when it breaks.
  21 days from intake to your live line.

Ad 13 (Late-night operator video):
  It's 11:47 on a Tuesday and your phone is ringing right now.
  An AI agent could be booking that job while you sleep.
  Stop missing money.
```

**Headline (≤27 chars):** `Phone answered in 21 days.`
**Description (≤27 chars):** `$4,950 + $1,997/mo. Refund.`

**Common error to avoid:** Meta will autosuggest Multiple Text Optimization
("would you like to test variations?"). **Turn this OFF.** It rewrites
your copy with AI and you lose the Hormozi voice you've earned.

---

## 4. Tracking — the pixel side

The runtime is already wired (`api/meta-event.ts` + `api/meta-capi-send.ts`).
The two env vars you need to set in Vercel before launch:

```
META_PIXEL_ID            = (15-16 digit ID from Events Manager)
META_CAPI_ACCESS_TOKEN   = (token from Events Manager → CAPI → Generate)
```

**Test the wire end-to-end before launching:**

1. Open Events Manager → Test Events.
2. Hit `https://trainyouragent.com/apply` in an incognito tab.
3. Submit the booking form.
4. You should see:
   - `PageView` event from browser pixel (~1s)
   - `Lead` event from browser pixel (~1s on submit)
   - `Lead` event from CAPI (server-side, deduplicated against the browser one — same event_id)
   - "Deduplicated" badge on the server-side row

If the dedupe badge isn't showing, the event_id isn't matching and you're
double-counting. Fix before launch.

---

## 5. Daily / weekly cadence — what to actually look at

### Daily (5 min, 9am ET)

- Ads Manager → custom column preset (build once, save):
  `Impressions | Hook Rate | CTR (all) | CPM | Cost per Result | Results`
- Sort by Cost per Result ascending. Anything > $80 CPL after 200 impressions = kill.
- Sort by Hook Rate descending. Top 3 ads get 2× budget bump.

### Weekly (45 min, every Monday 8am ET)

- Pull the ad set's full report. Look at:
  - Frequency (alarm > 2.5 — refresh creative)
  - Audience size remaining
  - Cost per Lead by placement
  - Lead → Booked Call rate (from Cal.com)
  - Booked Call → Closed Deal rate (manual)
- Add new creative: 1–2 ads per week based on which concept won.
- Kill any ad below the kill thresholds. Don't agonize. Andromeda kills
  them for you if you delay.

### Monthly (90 min)

- Review CAC (cost to acquire one paying customer).
- If CAC < $400, scale budget 2×.
- If CAC > $1,200, pause and audit landing page + offer.
- Build 1% Lookalike on Lead audience (need 100+ leads).

---

## 6. The kill thresholds (Paid House standard, post-Andromeda)

| Metric                | Kill threshold (after 200 impressions) |
| --------------------- | -------------------------------------- |
| Hook Rate             | < 25%                                  |
| CTR (all)             | < 1.0%                                 |
| CPM                   | > $40                                  |
| Cost per Lead         | > $80                                  |
| Frequency             | > 2.5 (refresh creative)               |

Anything above the **scale** thresholds (Hook Rate > 35%, CTR > 1.5%,
CPL < $50) gets a 2× budget bump within 24 hours.

---

## 7. The OCD asset library naming convention

Save every rendered ad to a folder structure like this on Drive / iCloud:

```
TrainYourAgent / Ads / 2026-Q2 / Cold-Apply /
├── 01_StopMissingMoney_9-16.png
├── 02_StopMissingMoney_1-1.png
├── 03_94K-StatHero_9-16.png
├── 04_94K-StatHero_1-1.png
├── 05_BeforeAfter_9-16.png
├── 06_CubanContrarian_9-16.png
├── 07_Receipts_9-16.png
├── 08_AgencyVsTYA_9-16.png
├── 09_BookTheCall_9-16.png
├── 10_BookTheCall_1-1.png
├── 11_HVAC-8PM_9-16.png
├── 12_FounderConfession_9-16.mp4
├── 13_LateNightOperator_9-16.mp4
└── 14_CubanContrarianVideo_9-16.mp4
```

When you batch-upload to Ads Manager, the filename → ad name mapping is
automatic if you name them right.

---

## 8. What to NOT do (the OCD discipline that separates pros from kids)

- **Do not** create the campaign before verifying TrainYourAgent Page is selected. The Page defaults to the most recently used Page (likely Citrusburn right now). If you forget, Meta serves TYA's ads from Citrusburn's identity. Catastrophic. Re-check at the Identity step.
- **Do not** turn on Advantage+ Creative ("AI-generated text variations"). It rewrites your copy. You'll lose the voice.
- **Do not** launch with placements limited to "Stories + Reels" only. The 4:5 / 1:1 Feed placements are where intent buyers are in 2026.
- **Do not** start the ad set as Scheduled-for-now if it's after 4pm ET. Meta's algorithm needs a fresh day for learning-phase signal. Always schedule for 06:00 ET next day.
- **Do not** mix conversion events. Lock to **Lead** for this whole campaign. Don't change to Purchase mid-flight — the algo restarts learning.
- **Do not** edit the targeting in the first 7 days. Every edit = learning-phase reset = wasted spend.
- **Do not** turn on "Multi-text variation testing." It's noise, not signal.

---

## 9. Quick-launch checklist (5 minutes)

```
[ ] Verify Facebook Page = TrainYourAgent (not Citrusburn)
[ ] Verify Pixel = TrainYourAgent Pixel
[ ] Set Vercel env: META_PIXEL_ID + META_CAPI_ACCESS_TOKEN
[ ] Redeploy. Verify PageView + Lead events fire on /apply
[ ] Create campaign:    TYA_LEAD_APPLY_COLD_2026-Q2 (CBO $100/day)
[ ] Create ad set:      TYA_AS_TampaBay-50mi_SMB-Owner_28-58_Broad
[ ] Upload 14 creatives, name per the table above
[ ] Set destination = https://trainyouragent.com/apply (+ UTMs)
[ ] CTA = Apply Now
[ ] Schedule start = tomorrow 06:00 ET
[ ] Save as DRAFT
[ ] Review in Ads Manager preview — every ad shows TrainYourAgent identity
[ ] Click Publish
```

Total: ~25 minutes the first time, ~10 minutes for the next campaign.

---

## When you have the Pixel ID and CAPI token

Send them and I'll set the env vars in Vercel myself, redeploy, and test
the pixel end-to-end. The campaign goes live the same day.
