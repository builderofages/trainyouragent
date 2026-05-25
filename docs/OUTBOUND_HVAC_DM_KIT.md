# Outbound HVAC DM Kit — First 10 Free Builds (Tampa Bay)

**Goal:** Land customer #1 with a free build in 14 days. Trade the build for a named, on-camera testimonial + logo + 90-day metric story. That single asset unlocks /customers, /proof, and every paid ad you run.

**Cost:** ~$200 in Twilio/ElevenLabs/Anthropic over 90 days × 1 customer.
**ROI math:** Even if the customer churns at day 91, you have the case-study asset that turns $20/day Meta into qualified leads at 2-5× the conversion rate of a zero-proof page.

---

## Targeting (Apollo / Sales Navigator / Google Maps)

**Vertical:** HVAC operators
**Geo:** Tampa Bay metro (Tampa, St. Petersburg, Clearwater, Brandon, Largo, Wesley Chapel)
**Size:** 5-25 employees (small enough to feel the missed-call pain, big enough to have a real budget by month 3)
**Channels to find them:**
1. Google Maps → "HVAC Tampa Bay" → sort by rating 4.0-4.7 (4.8+ are already winning, sub-4.0 are gone)
2. Yelp same filters
3. Apollo: title contains "owner" OR "president" OR "operations manager", industry "HVAC", geo "Tampa Bay FL"
4. LinkedIn Sales Nav: same as Apollo
5. Local FB groups: "Tampa HVAC", "Florida Contractors" — find owner profiles

**Pull 50 names + LinkedIn URLs + business phone numbers. Spreadsheet them.**

---

## LinkedIn DM Template (Cold)

> Hey {firstName} — quick one. I noticed {Company} averages {X} weekly reviews on Google (impressive for {city}) but the closing time on your line is "5 PM weekdays" — meaning every emergency call after that is going to your competitor's voicemail (and they're picking up at 6:47).
>
> I build AI voice agents for HVAC operators in the Tampa area. They answer 24/7, qualify the call (emergency vs. quote), book the truck, and text the dispatcher. Live in 7 days.
>
> I'm picking 5 Tampa HVAC operators for a **free build** in exchange for a 60-day on-camera testimonial if it works. No catch. You own the prompts, recordings, and number. If it doesn't book one real appointment in 30 days, we kill it.
>
> 15 min on Zoom this week? https://cal.com/trainyouragent/30min

**Variables to swap per prospect:**
- `{X}` — count their Google reviews (takes 5 sec per prospect)
- `{Company}` — exact business name
- `{city}` — Tampa / Brandon / Clearwater / etc
- `5 PM` — their actual closing time from Google listing

**Send rate:** 10/day for 5 days = 50 DMs/week. Expect 8-15% reply rate = 4-7 replies. Expect 30-40% reply-to-call conversion = 1-3 booked calls. Expect 30-50% call-to-customer = 1 free build by end of week 2.

---

## Cold Email Variant (Same Prospect, 2 Days After LinkedIn DM)

**Subject:** Saw your reviews on Google — quick HVAC AI question

> {firstName},
>
> Followed up on LinkedIn last week but inboxes are noisy. Real quick:
>
> {Company} has {X} 5-star Google reviews. The pattern across Tampa HVAC accounts I've audited: 30-40% of incoming calls hit voicemail after 5pm, and 60-70% of those callers book with whoever picks up next.
>
> I'm running a free build program for 5 Tampa HVAC operators — I deploy an AI voice agent on your existing number that answers 24/7, qualifies the call, books emergency dispatches, and texts your tech. You own everything. 7 days to live.
>
> No catch beyond a 60-day on-camera testimonial if it works the way I claim.
>
> Reply with "tell me more" and I'll send a 4-min Loom showing exactly what it'd do for {Company} on your real call patterns.
>
> — Alexander
> Founder, TrainYourAgent
> alexander@trainyouragent.com · cal.com/trainyouragent/30min

---

## SMS Variant (After Email Open With No Reply)

> {firstName} — Alexander from TrainYourAgent. Sent a note about an AI voice agent for {Company}'s after-hours calls — free 7-day build in exchange for a testimonial. Got 30 sec to look at a 4-min Loom? I think it'd be a fit for {Company}.

---

## Call Script (If They Pick Up Cal.com Slot)

**0:00 — Opener**
> Hey {firstName}, Alexander. Thanks for the 15. Before I pitch anything — quick context: I've audited 12 HVAC accounts in Tampa this quarter. The pattern is brutal. After-hours calls hit voicemail, callers redial Hayman or Allied within 90 seconds, you lose the job. Sound familiar?

**0:30 — Diagnostic (let them talk)**
> Walk me through what happens at {Company} when someone calls at 8 PM with a broken AC.

**3:00 — Position**
> What I do is build the AI voice agent that takes that call. Picks up on ring 2. Greets in your brand. Qualifies emergency vs. quote. Books the truck on your calendar. Texts your on-call tech. Logs the transcript. 24/7. Live in 7 days.

**5:00 — Free-build pitch**
> I'm picking 5 Tampa HVAC operators for a free build. I eat the cost — about $200 over 90 days in Twilio + AI fees. The deal: you record a 5-min on-camera testimonial at day 60 if it works. If it doesn't book one real emergency in 30 days, we kill it, no clawback. You own the prompts + the number.

**6:30 — Close**
> If we can ship by next Friday, the agent is taking calls 6 nights before the next storm hits. Pull up your calendar — what's the soonest we can do a 60-min kickoff?

---

## Free-Build Deliverable Spec (What You Ship)

**Day 0 (kickoff, 60 min)**
- Record 3 of their existing calls (with permission) — opener, qualification, objection-handling style
- Pull their docs: pricing, service area, emergency rates, brands serviced
- Get their dispatcher's number + ServiceTitan/HCP login

**Day 1-3 (build)**
- Vapi or ElevenLabs voice with their accent/tone match
- System prompt: HVAC receptionist persona + their service rules
- Twilio number provisioning OR call-forward their existing line
- ServiceTitan webhook for booking (or Cal.com fallback)
- SMS-to-dispatcher integration

**Day 4-5 (test)**
- 10 dry-run calls with you playing the caller
- Tune the script based on what breaks
- Stress-test edge cases (price haggle, wrong area, voicemail loop)

**Day 6 (cutover)**
- Live on their number after 5 PM
- Dashboard set up: calls/day, booked/day, escalated/day, missed/day

**Day 7-30 (tune)**
- Daily transcript review (you, ~15 min/day)
- Weekly prompt updates
- Slack channel with the owner for instant feedback

**Day 30 milestone**
- "Did it book at least one real emergency appointment?" → if yes, send testimonial request email + Loom recording prompt
- If no, kill it, send a "what we learned" email + apology

---

## Testimonial Capture (Day 60)

**Loom request email:**
> {firstName} — we hit day 60 today. The agent has handled {N} after-hours calls, booked {B} emergencies, and your AOV is up {pct}%. Mind doing a 5-min Loom for me?
>
> I'll send you 3 questions, you record on Loom, send me the link. I'll cut the highlight reel and send you the final 90-sec version for your approval before anything goes public.
>
> The 3 questions:
> 1. What was the before-state at {Company} — what specifically was the missed-call problem?
> 2. What changed once the agent went live? Tell me about the first emergency call it booked.
> 3. Who would you tell another HVAC owner to NOT use this for, and who would you tell to definitely try it?
>
> In exchange: your build stays free as long as you want it, no monthly. If you want to keep it past 90 days I'll give you the at-cost runtime price ($349/mo, my actual Twilio + AI cost).

---

## Mass-Send Tooling Setup (1 hour, do once)

1. **LinkedIn:** Use Sales Nav saved search → export to Phantombuster → CSV → manual send (don't automate sends, LinkedIn will throttle). Cap 10/day.
2. **Email:** Instantly.ai or Smartlead. 3 inbox warmup for 14 days first. Cap 30/day per inbox.
3. **SMS:** OpenPhone or RingCentral — manual send for the first 50, automate after you've proven the script.
4. **CRM:** Spreadsheet for the first 50. After customer #3, upgrade to HubSpot free tier or Close.com.

---

## When to Walk Away From a Prospect

- They want to negotiate on the free build → not a buyer, just a tire-kicker
- They demand to own the LLM/voice keys → you can't deliver, refer them out
- They say "send me a proposal" → they want to ghost; ask for a 15-min call instead
- They've already tried 2+ AI voice tools → they'll be a problem customer, decline
- They have <5 employees → not big enough to ship the case study you need

Target: 1 free build LIVE by day 14, 3 free builds LIVE by day 30, 1 paying conversion by day 60.
