# 03 — Lead Qualification & Routing Agent

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/lead-qualification-agent`

---

Most B2B and high-ticket SMB businesses leak 30–60% of their pipeline at the lead-qualification stage.

Not because the leads are bad. Because the qualification is slow.

Inbound lead hits the contact form at 11:47pm Tuesday. SDR doesn't see it until 9am Wednesday. By then the prospect has filled the same form on two competitor sites and the conversation has moved on without you.

A lead qualification agent closes that window.

The job is 60 seconds long: read the inbound submission, enrich it with public data (LinkedIn, Clearbit-style firmographics), ask the prospect 3–5 disqualifying questions over chat or callback, score the lead against your ICP, and route — to a calendar slot, to a human SDR, or to a "thanks, we're not the right fit" deflection.

Done right, the inbound prospect goes from form-fill to booked discovery call in under 4 minutes. At 11:47pm on a Tuesday.

The stack we use:

- **Trigger:** webhook on your form submission (Typeform / HubSpot / website POST)
- **Enrichment:** Clearbit + LinkedIn sales-nav scrape (with consent path) + your CRM history if they're a known account
- **Qualifying conversation:** Anthropic Claude over voice (Twilio) or chat (web widget) — 3–5 questions max, branched by industry
- **Scoring:** rule-based + LLM-judged against your ICP definition we co-author in week 1
- **Routing:** Cal.com / Chili Piper / direct round-robin to your SDR pool, or "polite no" deflection

Real numbers from a SaaS client in week 4 of deployment:

- Inbound to booked-call time: 4h 12m → 6 min (median)
- Show rate on AI-booked calls: 71% (vs 54% baseline)
- SDR time saved per qualified lead: 18 minutes
- Hot leads that didn't sleep over the weekend: 100%

Build cost: $5,500. Ongoing: $399/mo + LLM passthrough (~$0.04/qualification). Ships in 18 days.

The single biggest mistake teams make: trying to qualify with a chatbot that asks 12 questions. Nobody answers 12 questions in a chat window. We test 4 questions, branch by industry, drop the 5th if score is already high enough.

Full playbook with the scoring rubric template + the 3 questions that disqualify 80% of bad-fit leads: https://trainyouragent.com/capabilities/lead-qualification-agent

— Alexander
