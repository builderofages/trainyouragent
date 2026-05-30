# The exact path from 62/100 → 100/100

I (Claude) shipped every code-side lever this session. The remaining gap is **you-only work**. Here's the literal task list, ordered by impact.

---

## Why we're stuck at 62/100

Grok Heavy multi-POV audit (2026-05-30) said it cleanly:

> *"Site is transparently built and technically capable — but currently sells unproven promises. Fix proof and polish or it stays a founder experiment."*

The three points worth 38 score points are all **non-code**:

| Item | Grok's exact ask | Why I can't ship it |
|---|---|---|
| Real named customers | "Ship 5–10 real paying customers and publish named case studies with transcripts, booking metrics, ROI" | I cannot fabricate customers. The /reviews/submit flow exists and pays $200 Stripe credit — you need to get 3 SMB owners through it. |
| SOC 2 Type II | "Complete and publish SOC 2 Type II + full compliance pack + public uptime dashboard" | Requires a third-party auditor (Vanta, Drata, Tugboat — pick one). 4–6 month observation window. ~$25K–40K. |
| Real ARR/MRR data | "Publish ARR/churn dashboard on /metrics or /invest" | Requires real Stripe revenue flowing. /metrics page is already wired to read live Stripe — there's just nothing to display yet. |

---

## The execution sprint (founder-only)

### This week — 3 hours of your time max
1. **DM 30 SMB owners from your existing network** (HVAC, dental, salon, real estate, gym, hotel). Offer: "I'll build you a working AI receptionist this weekend. Free. The deal: if you like it, you give me a 60-second video testimonial + permission to use your booking metrics on my site."
2. **Book 3 from the 30.** Build their agents Sat/Sun.
3. **Record the 60-second testimonials.** Get screen-recordings of their Cal.com bookings flowing in. **This is the #1 lever across all 6 Grok POVs.** SMB-owner score jumps from 71 → 95. Investor score jumps from 39 → 70.

### Next 30 days
4. **Submit Vanta application** for SOC 2 Type II observation period start. Even being "in observation" is publicly displayable and worth +15 enterprise points.
5. **Publish a real BAA template** PDF on /security. I can scaffold the template; you need to have it reviewed by counsel and put your name on it.
6. **Get Trustpilot / Capterra / G2 / Software Advice listings live** with at least 5 reviews each. /reviews/submit drives traffic; you need to email past 3-month customers and ask.

### This quarter
7. **Hit 10 paid customers.** That unlocks the ARR display on /metrics being meaningful. At 10 customers × $1,997/mo, /metrics shows $20K MRR / $240K ARR run-rate. That alone takes the investor POV from 39 → 75.
8. **Hire one engineer + one solutions architect.** Removes the "founder-dependent delivery" Grok flagged (#2 of 5 top gaps).

---

## What I shipped this session (no founder dependency)

- Strip last "Alexander" mention from /pricing money path → "our build team"
- FAQPage Schema.org JSON-LD on /pricing (5 Q&As) — Google rich-snippet eligible
- Verified VerticalPage already has Service + FAQPage + BreadcrumbList schema
- Cut homepage from 17 → 12 sections (Grok UX score 65 → est. 78):
  - Killed redundant "About the platform" strip
  - Killed "More ways to see it work" link soup
  - Killed animated AnimatedStat bar (duplicated LiveKpiStrip)
  - Killed editorial vision pull-quote (moved to /about)
  - Killed homepage LeadMagnetForm (still on /resources)
- Saved verbatim Grok 6-POV audit (62/100) to `FINAL_AUDIT_v273.md`

---

## What will Grok score the site at after this ships?

My honest estimate without doing the case studies / SOC2 / ARR:
- **From 62 → 68**. ~6 points of pure code/UX polish. That's the ceiling for me alone.

With case studies: **78**. With case studies + SOC 2 observation start: **86**. With all three: **94-100**.

The path is clear. The only thing standing between you and 100/100 is 3 SMB owners on Zoom this weekend.

---

*Updated: 2026-05-30. Build: f11f885.*
