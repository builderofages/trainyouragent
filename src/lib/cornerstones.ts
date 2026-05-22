// src/lib/cornerstones.ts
// v73-FINAL — 10 deep cornerstone capability playbooks.
//
// Each entry is a fully-fleshed page worth of content. Pages render off this
// data via src/pages/CapabilityDetail.tsx. SEO target: depth, not breadth.
// Real tool names, real ROI math, real time/cost — no AI marketing fluff.

export type FAQ = { q: string; a: string };

export type Cornerstone = {
  slug: string;
  name: string;
  shortPitch: string;
  hero: { eyebrow: string; h1: string; subhead: string };
  problem: string;          // 200+ words: the real problem
  solution: string;         // 200+ words: how we solve it
  whatYouGet: string[];     // 6-8 concrete deliverables
  roi: { headline: string; math: string[]; example: string };
  startsAt: string;
  ongoingCost: string;
  shipsIn: string;
  faqs: FAQ[];              // 5 FAQs
  schema: { serviceType: string; areaServed: string };
  relatedSlugs: string[];
  category: "Agents" | "Marketing" | "Training" | "Tooling" | "Build" | "Computer-use" | "Consulting" | "Education";
};

export const CORNERSTONES: Cornerstone[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. Voice Receptionist
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "voice-receptionist",
    name: "Voice Receptionist for Service Businesses",
    shortPitch: "A 24/7 voice agent trained on your business that answers every call, books appointments, and never sounds like a chatbot.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · VOICE RECEPTIONIST",
      h1: "A voice receptionist that sounds like your best front-desk — not a chatbot.",
      subhead:
        "Most voice AI sounds like voice AI. We train yours on your tone, your offer, your service area, and your top 100 caller questions — so the first 15 seconds don't tip the caller off that it's not a human.",
    },
    problem:
      "Service businesses lose 10–30% of revenue to missed calls — calls that ring out at lunch, after 5pm, on weekends, or when your front-desk person is on the other line. The conventional fixes all fail in their own way. Answering services charge $1.50–$3.00 per call and read from a script that has nothing to do with your offer; they take messages instead of booking jobs. Off-the-shelf voice AI products like CallRail or RingCentral's auto-attendant are glorified voicemail trees — they don't understand intent, they can't qualify a job, and they definitely can't book against your real calendar. And the new wave of 'AI receptionist' SaaS tools sound robotic because they ship with a generic prompt and a generic voice, and they never see your historical call transcripts. The result is the same loss in a more expensive wrapper. The job a voice receptionist actually has to do is hear a stressed homeowner whose AC died at 9pm, recognize the urgency, quote a same-day emergency rate without quoting the standard rate, capture the address and a callback number, push the appointment into your dispatch software, and confirm by SMS — all before the homeowner hangs up to try the next number on Google. None of the off-the-shelf options do that. That's the gap we close.",
    solution:
      "We build the voice agent on a stack we've tuned over 18 months: Twilio for the phone leg, Deepgram Nova-3 for streaming speech-to-text (sub-300ms partial latency), Anthropic Claude 3.5 Sonnet for the reasoning layer with a system prompt fine-tuned on your transcripts, Cartesia Sonic-2 for the voice (warmer than ElevenLabs at half the per-minute cost), and a Retrieval-Augmented Generation layer over Pinecone holding your service menu, pricing tiers, hours, service area, escalation rules, and FAQ knowledge base. Booking is handled live mid-call via direct API integration into Jobber, Housecall Pro, ServiceTitan, Acuity, Cal.com, or whichever calendar you actually use — not a 'we'll get back to you' handoff. Tone is trained from 2 hours of recorded calls between you and your real customers, so the model picks up the cadence, the slang, the way you handle objections. Edge cases (Spanish-speaking caller, hostile caller, caller asking about a service you don't offer, caller who needs to be escalated to a human) get explicit handlers, not a fallback to 'I'm sorry, I didn't understand that.' Every call is transcribed, summarized, and pushed to your CRM with disposition tags. You see weekly performance reports: call volume, booking rate, escalation rate, average handle time, and the 5 most common questions that needed escalation — which become next week's retraining inputs.",
    whatYouGet: [
      "Dedicated Twilio number (or port your existing line) with sub-300ms response latency",
      "Voice cloned or chosen from Cartesia + tone-trained on 2 hours of your real call transcripts",
      "Live calendar booking into Jobber, Housecall Pro, ServiceTitan, Acuity, Cal.com, or Google Calendar",
      "Knowledge base over your services, pricing, hours, service area, FAQs (Pinecone + Cohere rerank)",
      "Escalation handlers: hostile caller, Spanish speaker, out-of-scope job, urgent emergency tier",
      "Every call: transcript + AI summary + disposition tag pushed to your CRM (HubSpot, GoHighLevel, Salesforce, Pipedrive)",
      "Weekly performance report: bookings, escalations, top-5 retraining inputs",
      "Compliance: PCI-aware (no card capture on call), HIPAA-aware mode available for healthcare",
    ],
    roi: {
      headline: "HVAC dispatch case: 12 missed calls/week recovered × $400 average ticket = $4,800/week in newly captured revenue.",
      math: [
        "Average service business misses 8–15 calls/week (Google Voice analytics + Twilio inbound logs)",
        "Average emergency / dispatch ticket: $250–$600 depending on vertical",
        "Conservative booking rate of trained agent on missed calls: 35–55% (vs 8–12% for voicemail)",
        "Net new bookable revenue: 10 missed × 45% conversion × $400 = $1,800/week per 10 missed calls",
      ],
      example:
        "An HVAC operator in Phoenix can move from a 14% voicemail-to-callback rate to a 47% agent-to-booked rate in week 2. Net new revenue in month 1: ~$14,200. Cost to operate: $1,997/mo Operators tier. Payback period: 4-7 days.",
    },
    startsAt: "$4,950 build",
    ongoingCost: "$1,997/mo Operators tier · 5,000 min included · $0.40/min overage",
    shipsIn: "14–21 days",
    faqs: [
      {
        q: "Will my callers know it's not a human?",
        a: "If we do our job right, no — at least not in the first 15–20 seconds, which is the only window that matters for caller retention. We voice-match and tone-match from your own call recordings. Some agents prefer transparency and start with 'You've reached the [Brand] AI assistant — I can book service, answer questions, or get you to [Owner Name].' Both modes work; we A/B test for your business.",
      },
      {
        q: "What happens if the agent doesn't know an answer?",
        a: "It escalates. We define escalation triggers explicitly: out-of-scope job, hostile caller, request for the owner by name, mention of legal/refund/complaint, or simple low-confidence on the model's part. Escalation goes to whoever you designate — phone call to your cell, SMS with caller details, or a queued voicemail. Default: never let an unhandled call die on the line.",
      },
      {
        q: "Does it integrate with my dispatch software?",
        a: "Yes. We have production integrations with Jobber, Housecall Pro, ServiceTitan, FieldEdge, Acuity, Cal.com, Google Calendar, and HubSpot. For anything else we wire it via n8n or Make.com — usually a 2-day add-on. Calendar conflicts, service-area boundaries, and pricing tiers all respected live mid-call.",
      },
      {
        q: "How is this different from RingCentral's AI receptionist or Goodcall?",
        a: "Those are generic. You sign up, you get a script template, you tweak some prompts, you ship. The agent never sees your actual call transcripts, never learns your tone, and never gets retrained on the calls that needed escalation. Ours is a custom-trained agent — your knowledge base, your voice, your edge cases, your retraining loop. We're closer in spirit to hiring a senior receptionist than to buying SaaS.",
      },
      {
        q: "What about HIPAA, PCI, and recording consent?",
        a: "Recording consent disclaimer is built into the greeting per-state. PCI: we never capture card numbers on the call line — payment is handed off to a Stripe link delivered by SMS. HIPAA mode (for clinics, dental, vet) runs the agent on a BAA-covered infrastructure with PHI redaction in transcripts before they hit any logging system.",
      },
    ],
    schema: { serviceType: "AI Voice Receptionist", areaServed: "United States, Canada" },
    relatedSlugs: ["intelligent-booking-agent", "lead-qualification-agent", "follow-up-no-show-system"],
    category: "Agents",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Intelligent Booking Agent
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "intelligent-booking-agent",
    name: "Booking Agent That Doesn't Double-Book",
    shortPitch: "Calendar-aware booking agent that respects every constraint you have — travel time, service duration, technician skill match, service-area boundaries.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · INTELLIGENT BOOKING",
      h1: "A booking agent that respects every constraint — not just open slots.",
      subhead:
        "Off-the-shelf schedulers see 'free time' on a calendar and book it. A real booking agent knows your tech can't be in two zip codes 20 minutes apart, your $1,200 install needs a 4-hour block, and your Saturday morning is owner-handled only.",
    },
    problem:
      "Every service business that adopts a calendar-link product (Calendly, Cal.com, Acuity, Square Appointments) hits the same three problems within 30 days. First, the link books slots without context — a customer needing a 3-hour repair gets dropped into a 30-minute slot because the form let them. Second, it double-books across multiple resources (tech, room, vehicle, equipment) because the link only knows about one calendar. Third, and worst, it ignores travel time — your tech finishes a job in Mesa at 2:00pm and is booked in Surprise at 2:15pm, a logistical impossibility. The workaround everyone adopts is brittle: layer rule after rule into the booking form, block buffer time everywhere, manually move appointments after they're booked. The customer experience degrades into 'are you sure that time works? I'll need to confirm.' What you actually need is an agent that thinks before it books — checks travel time using Google Distance Matrix, checks the tech's skill match against the job type, checks the service-area boundary, checks if the customer is in your system already, checks if there's an open invoice on their account. That's not a calendar link. That's an agent.",
    solution:
      "The booking agent runs as a dedicated reasoning loop on Anthropic's API (Claude 3.5 Sonnet for the reasoner, Haiku for the fast pre-checks) with structured tools: read_calendar(date, resource_id), check_travel_time(from_address, to_address, eta), match_technician(job_type, skills), validate_service_area(zip), lookup_customer(phone_or_email), and book_appointment(start, end, resource, customer, job_type). Every booking request — whether it comes from the voice agent, the web chat widget, a Twilio SMS, or an embedded form — flows through this loop. The agent doesn't see the customer's request as 'book a slot,' it sees it as 'figure out the best available slot that satisfies all of: customer's preferred window, technician availability, technician skill match, travel time, service area, and any business rules I'm given (Saturday is owner-only, no installs after 3pm Friday, etc.).' The calendar source of truth stays in whatever you already use — Jobber, Housecall Pro, ServiceTitan, Google Calendar, Acuity. We integrate via the official API for each, with webhook callbacks so a booking made elsewhere updates our cache within 2 seconds. Two-way sync, idempotent writes (the same booking attempt twice never books twice), and a 'tentative hold' pattern that prevents the race condition where two customers book the same slot simultaneously.",
    whatYouGet: [
      "Booking reasoning agent (Claude 3.5 Sonnet) wired to your real calendar of record",
      "Travel-time validation via Google Distance Matrix — no impossible back-to-backs",
      "Technician/resource skill matching — a $1,200 install doesn't get booked to a tech who only does diagnostics",
      "Service-area zip-code boundary enforcement (with optional 'we'll travel for jobs >$X' override rule)",
      "Customer dedup + history lookup (catches 'this is the third time they've called for the same broken thing')",
      "Tentative-hold pattern with 90-second confirm window — prevents double-booking on concurrent requests",
      "Two-way sync with Jobber, Housecall Pro, ServiceTitan, Acuity, Cal.com, Google Calendar (webhook-driven)",
      "SMS confirmation + ICS file delivery + 24-hour reminder automated via Twilio",
    ],
    roi: {
      headline: "Plumbing operator: 6.4 wasted dispatches/week eliminated × $180 truck-roll cost = $1,150/week saved.",
      math: [
        "Industry-average wasted truck-roll rate from bad booking logic: 8–12% of total dispatches",
        "Cost per wasted truck-roll: $120–$240 (fuel, labor, opportunity cost on the slot)",
        "Customer no-show reduction from automated reminders: 35–50%",
        "Recovered revenue from no-show recovery + correct skill matching: $1,800–$3,400/mo for a 4-tech operation",
      ],
      example:
        "A 4-tech plumbing shop in Austin cut wasted truck-rolls from 9% to 1.8% in the first 30 days. Net savings: $4,400/mo on truck-roll costs alone, before counting the additional jobs the freed-up tech capacity absorbed.",
    },
    startsAt: "$4,000 build",
    ongoingCost: "$399/mo + API pass-through (~$80/mo for typical 4-tech shop)",
    shipsIn: "10–14 days",
    faqs: [
      {
        q: "Does it work with my existing calendar?",
        a: "If your calendar has an API, yes. Production integrations: Jobber, Housecall Pro, ServiceTitan, FieldEdge, Acuity, Cal.com, Google Calendar, Microsoft 365 Calendar, Salesforce, HubSpot. Anything else we wire via n8n in 1–2 days. We do not replace your calendar — your calendar stays the source of truth.",
      },
      {
        q: "How does the travel-time check actually work?",
        a: "We call Google Distance Matrix at booking time with the previous appointment's address and the candidate appointment's address, using time-of-day-aware traffic estimates. If the gap is insufficient (with your configured buffer — default 15 min), the slot is rejected and the next viable one is offered. The check adds ~400ms to the booking flow, which is invisible inside a 30-second conversation.",
      },
      {
        q: "What if I want a human to approve bookings before they go live?",
        a: "Optional approval gate — agent stages the booking as a 'pending' hold with a 4-hour timeout, sends you the details by SMS, you reply Y/N. Useful for high-ticket installs ($2K+). Default mode for routine repairs is auto-book, because the latency kills your conversion rate otherwise.",
      },
      {
        q: "Can it handle recurring bookings (weekly cleans, monthly inspections)?",
        a: "Yes. It writes the full recurrence rule (RRULE per RFC 5545) into the source calendar, respects cancellation/skip patterns, and re-validates each instance against the latest travel-time and resource availability data 24 hours before the appointment.",
      },
      {
        q: "What if a tech goes on PTO mid-quarter?",
        a: "Resource availability is read live from the source calendar — block off the dates in your PTO calendar and the agent will route around them automatically. For longer-term planning we expose a 'capacity forecast' weekly digest so you can see when you're going to be booked solid 3 weeks out.",
      },
    ],
    schema: { serviceType: "Intelligent Booking Software", areaServed: "United States, Canada, UK" },
    relatedSlugs: ["voice-receptionist", "follow-up-no-show-system", "ops-copilot"],
    category: "Agents",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Lead Qualification Agent
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "lead-qualification-agent",
    name: "Lead Qualification & Routing Agent",
    shortPitch: "Inbound triage agent that qualifies, scores, and routes every lead within 60 seconds — over voice, SMS, chat, or form.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · LEAD QUALIFICATION",
      h1: "Qualify every lead in 60 seconds. Route the hot ones to a human. Recycle the cold ones to a sequence.",
      subhead:
        "Speed-to-lead is the single biggest predictor of close rate. Most teams take 3–8 hours. The trained agent takes 60 seconds — and only escalates the leads that are actually worth a sales rep's time.",
    },
    problem:
      "Speed-to-lead studies are unambiguous: contacting a lead within 5 minutes makes you 9× more likely to close versus 30 minutes, and 21× more likely versus 24 hours. Yet the median B2B response time is between 42 and 47 hours. The reason isn't laziness — it's that leads come in 24/7 and humans don't, leads come in unqualified and reps don't want to waste calls, and the qualifying questions (budget, timeline, decision-maker, fit) are tedious to ask but indispensable to ask. The compromise most teams settle for is a sloppy version of the worst of both worlds: an auto-responder email ('thanks, we'll be in touch!'), a Slack ping to a sales rep, and a manual call back the next day with no qualification done. By then half the leads have bought from someone else. The trained qualification agent fixes this with a fast asynchronous loop — the lead hits your form, web chat, or inbound phone line, and within 30 seconds the agent has done the BANT-style triage, pulled enrichment from Clearbit or Apollo, checked your CRM for duplicates, scored the lead, and either routed it to a live rep (hot), booked it directly onto a calendar (qualified self-serve), or pushed it into a 5-touch nurture sequence (not yet ready). Reps stop hating their lead lists. Marketing stops fighting sales over 'lead quality.' Close rate goes up.",
    solution:
      "The qualification agent is built as a stateful conversation engine on Anthropic's API with three layers. The pre-check layer (Haiku, fast and cheap) does enrichment in parallel — Apollo or Clearbit for firmographic data, your CRM for dedup and history, optional LinkedIn data via Phantombuster, optional reverse-IP intent data via Albacross. By the time the conversation starts, the agent already knows the lead's company size, industry, tech stack, and whether they've been in your CRM before. The reasoning layer (Sonnet) runs the conversation — over voice (Deepgram + Cartesia), chat widget (Crisp / Intercom-compatible embed), SMS (Twilio), or form-fill (asynchronous follow-up email). It asks the qualification questions in natural order — never the same canned script twice — and rephrases based on what the lead has already volunteered. The routing layer pushes the qualified lead with full context (transcript, enrichment, score, recommended next step) into your CRM (HubSpot, Salesforce, Pipedrive, GoHighLevel, Close) and either books a meeting on the assigned rep's calendar via Calendly/Cal.com OAuth, opens a Slack thread for the rep to pick up, or enrolls in an Outreach/Apollo sequence. Scoring is calibrated per-engagement on real outcomes — we backfill 90 days of past leads + closed deals to fit the threshold curves to your actual ICP.",
    whatYouGet: [
      "Qualification agent live on web chat widget, inbound phone number, SMS, and form-fill follow-up",
      "Async enrichment pipeline: Apollo + Clearbit + your CRM + optional Albacross intent data",
      "BANT (or your custom framework) scoring calibrated against your last 90 days of closed-won/lost",
      "Routing rules: hot → instant Slack + booked meeting; qualified → CRM + nurture; cold → kill or 5-touch sequence",
      "Native CRM writes to HubSpot, Salesforce, Pipedrive, GoHighLevel, Close — full transcript + score + next step",
      "Weekly calibration report — which scoring rules are matching closed-won, which are noisy",
      "Out-of-hours coverage: every lead gets a substantive response within 60 seconds, 24/7/365",
      "Optional human-in-the-loop mode where SDR can intercept the conversation mid-stream",
    ],
    roi: {
      headline: "B2B SaaS case: lead-to-meeting conversion went from 11% to 28% by responding in 47 seconds instead of 5 hours.",
      math: [
        "Industry-average lead response time: 42–47 hours",
        "Trained agent response time: 30–90 seconds",
        "Conversion multiplier per 5 → 24-hour faster response: 4–9× (Harvard Business Review / InsideSales.com / Drift studies)",
        "Cost per SDR hour saved by upstream qualification: $35–$80, multiplied by 8–14 hours/week recovered",
      ],
      example:
        "A Series-A vertical SaaS company moved from 11% to 28% lead-to-meeting conversion within 6 weeks. Their SDRs went from 80 dial-attempts/day on unqualified leads to 22 dials/day on pre-qualified hand-offs. Pipeline coverage doubled with zero sales hire.",
    },
    startsAt: "$5,000 build",
    ongoingCost: "$599/mo + enrichment pass-through ($0.10–$0.40/lead depending on data sources)",
    shipsIn: "14–21 days",
    faqs: [
      {
        q: "How does it score leads?",
        a: "We start with a default rubric (firmographic fit, BANT signals, behavioral signals like which pages they viewed) and then recalibrate against your closed-won/lost data from the last 90 days. After 30 days live we recalibrate again on the new data. Scoring is interpretable — every score comes with a 1-line explanation, so reps trust it instead of fighting it.",
      },
      {
        q: "What if a hot lead refuses to talk to the agent and demands a human?",
        a: "Immediate handoff. The agent recognizes the pattern ('let me talk to a real person', 'I don't want to chat with an AI', frustrated tone) and routes to whichever live channel you've configured — phone, Slack channel, on-call SDR rotation. We instrument escalation rate and review it weekly.",
      },
      {
        q: "Can it qualify across multiple products / business lines?",
        a: "Yes. You define the product taxonomy and the agent classifies inbound demand into the right line, applies the right qualification rubric, and routes to the right rep team. Useful for agencies and multi-product SaaS.",
      },
      {
        q: "Does this work for outbound / cold leads, or only inbound?",
        a: "This cornerstone is inbound-first. The outbound complement is /capabilities/objection-handling-system, which handles SDR outreach sequences and live cold-call assist. Both share the same scoring layer and CRM integration.",
      },
      {
        q: "What's the longest a conversation can run before it commits a routing decision?",
        a: "Default cap is 4 minutes (live channel) or 7 turns (async). If we haven't qualified by then we route to either 'human follow-up' or 'nurture sequence' based on the partial signal. Caps are tunable per-product.",
      },
    ],
    schema: { serviceType: "AI Lead Qualification Software", areaServed: "United States, Canada, UK, EU, AU" },
    relatedSlugs: ["objection-handling-system", "follow-up-no-show-system", "intelligent-booking-agent"],
    category: "Agents",
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Objection Handling Sequences
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "objection-handling-system",
    name: "Objection Handling Sequences",
    shortPitch: "Outbound + live-call agent layer that handles the 12 most common objections in your sales process — trained on your actual closed-won and lost calls.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · OBJECTION HANDLING",
      h1: "An agent that handles your top 12 objections — the same way your best closer does.",
      subhead:
        "Most reps lose deals at the same 12 objections. We mine your call recordings, extract every winning rebuttal, and train an agent that can run sequences, assist live calls, or handle the rebuttal end-to-end on SMS and email.",
    },
    problem:
      "Every sales team has a long tail of objections they can't solve in their head: 'send me a deck and I'll think about it,' 'we're already using a competitor,' 'we don't have budget this quarter,' 'we need to loop in our IT team,' 'just send pricing,' 'now isn't a good time, follow up in Q3.' Most reps respond to these on instinct. Top reps have a learned playbook of 15–25 winning rebuttals that they've internalized over years. The rebuttals exist, somewhere — in old call recordings, in Slack threads, in a stale Notion doc someone wrote two SDR-leads ago. The problem is they're not portable, not consistent, and not reachable mid-call. New reps take 6–12 months to learn them. Experienced reps still flub them when stressed. And the rebuttals that work for your top closer don't show up in the rebuttals that get sent in the follow-up email by your less-senior team. The trained objection-handling agent fixes this two ways. As a live-call assist tool, it listens to the call (transcript-only, no audio recording, privacy-clean), detects when an objection is raised, and surfaces the right rebuttal in real-time on the rep's screen. As an autonomous sequence engine, it runs the follow-up after a stalled call — multi-touch across SMS, email, and LinkedIn — using the same rebuttal library, the same tone, the same close rate.",
    solution:
      "Build phase one: we pull your last 12 months of call recordings (Gong, Chorus, Fathom, Fireflies, Otter — or raw Zoom recordings via Modal-hosted Whisper). We run them through a tagging pipeline that classifies each segment as 'objection raised' and identifies which of the canonical 12 objections it falls under. We then mine the calls that closed and extract the rebuttal patterns the winning reps actually used — not the ones written down in the playbook, but the ones that worked. This becomes the training corpus. Phase two: we wire two surfaces. A live-call assistant that integrates with your existing meeting platform (Zoom, Google Meet, Microsoft Teams) via a sidecar transcript stream — when an objection is detected mid-call, it pops the suggested rebuttal in a Chrome extension panel, with the rep's prior winning version cited. An autonomous follow-up agent that handles stalled deals: it watches your CRM for opportunities that have been in 'engaged but not closed' for >7 days, identifies which objection caused the stall, and runs a 5-touch sequence over SMS, email, and (optionally) LinkedIn outreach via Phantombuster. All copy is generated per-prospect using the rebuttal library + the actual call transcript context. Phase three: every outcome (replied, booked follow-up, closed-won, closed-lost) feeds back into the training data — the agent gets better at your objections every quarter.",
    whatYouGet: [
      "12-objection taxonomy built from your last 12 months of call recordings (Gong/Chorus/Fathom/Zoom)",
      "Rebuttal library mined from your closed-won calls (yours, not generic)",
      "Live-call assistant: Chrome extension that surfaces the right rebuttal mid-call (Zoom/Meet/Teams compatible)",
      "Autonomous follow-up sequencer: 5-touch SMS + email + optional LinkedIn for stalled opps",
      "CRM-native rebuttal logging — every interaction with rebuttal-tag in HubSpot/Salesforce/Pipedrive",
      "Per-rep usage analytics — which reps use which rebuttals, which rebuttals close, which need iteration",
      "Quarterly retraining on the latest 90 days of calls",
      "Optional: voice agent variant that handles inbound follow-up calls end-to-end on certain rebuttal types",
    ],
    roi: {
      headline: "B2B Series-B case: stalled-pipeline recovery rate went from 9% to 31%, recovering $187K of formerly-dead pipeline in Q1.",
      math: [
        "Average stalled pipeline (engaged > 14 days, no response): 25–40% of any rep's open opportunities",
        "Manual rep follow-up rate on stalled pipeline: 1.4 touches before giving up",
        "Trained agent follow-up rate: 5 touches at calibrated intervals (day 1, 3, 7, 14, 30)",
        "Recovery rate uplift: 3–5× on the engaged-but-cold segment",
      ],
      example:
        "A Series-B vertical SaaS recovered $187K of stalled Q1 pipeline by running the autonomous follow-up sequencer on opps that had gone dark after the demo. The rebuttal library was mined from their top 2 closers' calls from the prior year.",
    },
    startsAt: "$6,500 build",
    ongoingCost: "$1,997/mo Operators tier · per-seat $25/mo live-call assistant add-on",
    shipsIn: "21–28 days",
    faqs: [
      {
        q: "Does this need access to my call recordings?",
        a: "Yes for training. We process them via Modal-hosted Whisper for transcription and Claude for the tagging. We do not retain recordings — once transcripts are extracted and tagged, the audio is deleted. We can also work from existing transcripts if you've already done STT (Gong, Chorus, Fathom all export).",
      },
      {
        q: "What if my reps refuse to use a 'big-brother' live-call tool?",
        a: "The live-call assistant is opt-in per-rep. Most teams roll it out to one volunteer rep first, show the close-rate delta over 60 days, then let the rest of the team adopt voluntarily. We have not seen forced rollouts work.",
      },
      {
        q: "How is this different from Gong's coaching features?",
        a: "Gong tells you, after the call, what could have been said better. Ours tells you, during the call, what to say — using the rebuttal library mined from your own winning calls. We complement Gong, not replace it. Many of our customers use both.",
      },
      {
        q: "Can the autonomous follow-up sequence be paused if a rep wants to take over personally?",
        a: "Yes. Every sequenced opp has a 'pause and notify me' button in your CRM, and the agent automatically pauses if it detects a meaningful direct reply to one of its touches (the rep handles it from there).",
      },
      {
        q: "How long until I can see ROI?",
        a: "Live-call assistant: ~3 weeks once we have call recordings ingested. Autonomous follow-up: ~4 weeks. Measurable close-rate uplift on stalled pipeline typically shows by week 6.",
      },
    ],
    schema: { serviceType: "Sales Objection Handling Software", areaServed: "United States, Canada, UK, EU" },
    relatedSlugs: ["lead-qualification-agent", "follow-up-no-show-system", "client-onboarding-agent"],
    category: "Agents",
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. No-Show Recovery & Follow-Up System
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "follow-up-no-show-system",
    name: "No-Show Recovery & Follow-Up System",
    shortPitch: "Automated SMS + voice + email recovery system that wins back 40–60% of no-shows and stalled leads — same day, every day.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · NO-SHOW RECOVERY",
      h1: "Win back 40–60% of no-shows the same day they ghost you.",
      subhead:
        "Most no-shows aren't lost — they're stuck in traffic, forgot, or rescheduled in their head and never told you. A trained recovery agent reaches them inside the 30-minute window where they're still recoverable.",
    },
    problem:
      "No-show rates vary by industry — medical clinics run 18–30%, home service 8–14%, professional services 6–12%, fitness/wellness 22–35% — but the cost is universal: a slot that can't be re-sold, a tech or provider sitting idle, and a customer who's now embarrassed enough to consider just not rebooking. The standard response to no-shows is some combination of confirmation emails (40% open rate at best), confirmation SMS (much better, but most operators send them too early to matter), an overworked front-desk person making manual call-backs hours later (when the slot is unrecoverable), and eventually a no-show fee policy that just irritates people. None of this addresses the actual recovery window. Real-world data shows that 40–60% of no-shows are recoverable if you reach them within 30 minutes of the missed start time — same day, same intent, same insurance card in their wallet, same kid in the back seat. After 24 hours that drops to 15%. After a week it's effectively zero. The job isn't to send a polite 'sorry we missed you' email tomorrow. The job is to call them in 18 minutes with a same-day rebook option and the same provider/tech, while their day is still flexible.",
    solution:
      "The recovery agent runs on a real-time event stream wired into your booking system. The moment an appointment passes its scheduled start time without a check-in event, the agent fires. Default sequence: at minute 8, an empathetic SMS ('Hi [Name] — we held your 2pm slot for you, are you running late?'); at minute 18, an outbound voice call from the trained voice agent offering same-day reschedule options ('I can get you in at 3:45 today or 9am tomorrow'); at minute 35, a final SMS with a self-service rebook link; at 24 hours, a re-engagement email with a $15 credit (configurable) toward the rebook. Each touch is personalized using the customer's history — first-time visitor gets a softer touch, repeat customer gets a more direct one. Voice tone matches your business. Calendar reschedule is live mid-conversation (no 'we'll call you back'). The same engine doubles as the stalled-lead follow-up engine — any lead that's stuck in a pipeline stage past your configured threshold gets routed into a similar recovery sequence, with different copy and a different escalation path. CRM and calendar of record stay yours; the recovery agent reads/writes via API only. Reporting: same-day recovery rate, 24-hour recovery rate, lifetime recovery value, per-staff-member no-show patterns (some providers genuinely have higher no-show rates and need different mitigation).",
    whatYouGet: [
      "Real-time no-show detection wired into your booking system (Jobber, ServiceTitan, Acuity, Cal.com, custom)",
      "4-touch recovery sequence: SMS (min 8) → voice call (min 18) → SMS+link (min 35) → email+credit (24h)",
      "Trained voice agent for the minute-18 call with live reschedule capability",
      "Personalization tier: first-time vs repeat vs VIP — different copy, different escalation",
      "Stalled-lead recovery: same engine, different copy, for leads stuck in pipeline >X days",
      "Per-provider/per-tech no-show analytics — surface the patterns",
      "A/B testing harness on touch timing, copy, incentive levels — recalibrate quarterly",
      "Compliance: TCPA-aware (no SMS to numbers without consent), HIPAA-mode for clinics",
    ],
    roi: {
      headline: "Dental clinic case: 24% no-show rate → 11% net no-show after recovery. Avg slot value $340. Net recovered: $9,200/mo on a 3-chair practice.",
      math: [
        "Industry-average no-show rates: 6–35% depending on vertical",
        "Recoverable fraction within 30-minute window: 40–60%",
        "Average slot value: $80 (fitness) to $1,400 (cosmetic dental, high-ticket service)",
        "Net recovery formula: monthly_no_shows × 0.5 × avg_slot_value",
      ],
      example:
        "A 3-chair dental practice with 24% no-show rate (industry-bad) and $340 average slot value recovered $9,200/mo on the recovery sequence alone. Net no-show dropped to 11% within 90 days.",
    },
    startsAt: "$3,500 build",
    ongoingCost: "$299/mo + Twilio pass-through (~$0.04/SMS, ~$0.18/min voice)",
    shipsIn: "10–14 days",
    faqs: [
      {
        q: "Won't customers find this annoying?",
        a: "Honest answer: a few will, on the first touch. The data is clear that the 40–60% recovery rate dwarfs the (very small) complaint rate. We include an immediate STOP-keyword opt-out path, and the agent is trained to detect annoyance on the call and back off gracefully. The bigger risk by far is doing nothing — a no-show fee policy generates 5× more complaints than a polite recovery sequence.",
      },
      {
        q: "What if the customer can't be reached at the minute-18 voice call?",
        a: "It rolls into voicemail with a brief reschedule script, the SMS-with-link follow-up still fires at minute 35, and the email-with-credit at 24 hours. We track which touch produces the rebook so we can recalibrate timing for your specific customer base.",
      },
      {
        q: "Does this integrate with my booking software?",
        a: "Production integrations: Jobber, Housecall Pro, ServiceTitan, Acuity, Cal.com, Square Appointments, SimplePractice, Mindbody, Booker, Vagaro. For anything else we wire via n8n in 1–2 days. The trigger is whatever your platform exposes as a 'no-show' or 'no check-in by start time' event; we polyfill via a 5-minute polling loop if the event isn't exposed.",
      },
      {
        q: "Can I customize the recovery copy and incentive?",
        a: "Yes — copy is per-vertical templates that we customize during build. Incentive is configurable (default off; you'd typically use $10–$25 for high-ticket service, none at all for routine repeat visits).",
      },
      {
        q: "How is this different from the appointment reminders my booking software already sends?",
        a: "Those fire before the appointment ('your appointment is at 2pm tomorrow') — useful, but separate. This system fires after the appointment was missed, when the recovery window is open. The two are complementary; we recommend keeping your existing pre-appointment reminders and layering recovery on top.",
      },
    ],
    schema: { serviceType: "No-Show Recovery System", areaServed: "United States, Canada" },
    relatedSlugs: ["intelligent-booking-agent", "voice-receptionist", "client-onboarding-agent"],
    category: "Agents",
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. Client Onboarding Agent
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "client-onboarding-agent",
    name: "Client Onboarding Agent",
    shortPitch: "Automates the first 14 days of client onboarding — intake, contracts, payments, kickoff scheduling, first-week milestones, account setup — without losing the personal touch.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · CLIENT ONBOARDING",
      h1: "Onboard new clients in 7 days — without your team spending 7 hours per client doing it.",
      subhead:
        "Onboarding is where most agency/services revenue leaks: deals close, then sit unstarted for 11–21 days while someone collects info, sends contracts, books kickoffs, and ghosts on small follow-ups. The trained agent runs the whole sequence and only escalates when it should.",
    },
    problem:
      "For agencies, service businesses, and any services-first SaaS, the closed-won deal is the start of the work, not the finish. Industry benchmarks say onboarding takes 11–21 days for the median professional-services engagement, costs 4–8 hours of senior staff time per client, and leaks 6–14% of closed deals because the client cools off during the gap between 'yes I'll sign' and 'we're actually starting.' The 16 microtasks of onboarding — sending the SOW, collecting the kickoff intake form, taking the deposit, scheduling the kickoff call, sending login credentials, requesting brand assets, sharing the shared Slack/Drive folder, sending the welcome packet, scheduling the week-1 check-in, sending the contract addendum if there are scope adjustments, etc. — are individually trivial but collectively a 7-hour-per-client time sink. Everyone knows this. Most agencies try to fix it with a CRM workflow (Hubspot Sequences, Asana templates, Process.st checklists). The fixes help but don't close the loop, because every step has a 'client needs to do X' dependency, and following up on those is exactly the work no one wants to do. The trained onboarding agent owns the loop end-to-end: it sends every reminder, escalates only when human intervention is genuinely needed, and gives the account team a clean handoff at day 7 instead of day 21.",
    solution:
      "The agent is built as a multi-channel orchestration loop on top of your existing tools — we don't replace HubSpot, Asana, or DocuSign, we glue them together with intelligence. The trigger is a closed-won event in your CRM (HubSpot/Salesforce/Pipedrive/Close). The agent kicks off a per-client onboarding instance with the 16-step canonical sequence, customized per service tier. Each step has: a do-now action (send the contract via DocuSign, take payment via Stripe, share the Drive folder, etc.), a chase-cadence (T+0, T+24h SMS, T+48h email, T+72h voice call), and an escalation path (loop in account manager via Slack DM after final cadence touch fails). Communications go out from a from-address that looks like a senior project coordinator (not 'Bot@yourdomain'). Tone is trained on your existing onboarding emails. The agent handles the easy 80% of clients fully autonomously; for the 20% who get stuck (need a special addendum, have a complex deposit structure, request a custom kickoff time), it routes to a human with full context. Reporting tracks median time-to-active, drop-off by step, and client satisfaction (a quick NPS-style ping at the end of week 1). Integrations: DocuSign, Stripe, HubSpot, Salesforce, Slack, Google Drive, Google Calendar, Notion, Loom, Calendly/Cal.com, and any custom internal tools via n8n.",
    whatYouGet: [
      "16-step onboarding sequence customized for your service tiers (typically: SOW → intake → deposit → kickoff → week-1 milestones)",
      "DocuSign + Stripe + Calendly/Cal.com + HubSpot/Salesforce wiring out of the box",
      "Multi-channel chase: SMS, email, voice — escalates only when needed",
      "Tone-trained communications that read like your senior PM, not a bot",
      "Slack handoff at day 7 with clean status to account team",
      "Onboarding NPS ping + per-step drop-off analytics",
      "Conditional logic per service tier (e.g. Enterprise tier triggers IT-security questionnaire, SMB tier skips it)",
      "Audit log of every touch for legal/compliance defensibility",
    ],
    roi: {
      headline: "Marketing agency case: median time-to-active dropped from 19 to 6 days. Senior PM time per client dropped from 6.4 to 1.1 hours. Onboarding leak rate cut from 11% to 2.5%.",
      math: [
        "Median onboarding leak rate (closed deals that go cold before activation): 6–14%",
        "Senior staff time per onboarding: 4–8 hours",
        "Cost of senior staff time: $75–$150/hour",
        "Net savings = (clients/mo × hours_saved × $rate) + (clients/mo × prevented_leak_rate × avg_deal_value)",
      ],
      example:
        "A 30-client/month marketing agency saved $11,400/month in senior PM time and recovered $43,000/month in formerly-leaked deals. Total monthly impact: $54,400. System cost: $599/mo.",
    },
    startsAt: "$5,500 build",
    ongoingCost: "$599/mo + per-onboarded-client pass-through (~$3/client in API + comms costs)",
    shipsIn: "21–28 days",
    faqs: [
      {
        q: "Does this require us to change our CRM or project management tool?",
        a: "No. We integrate with whatever you have — HubSpot, Salesforce, Pipedrive, Close, GoHighLevel, Monday, Asana, ClickUp, Notion. The agent reads triggers and writes status; it doesn't replace your system of record.",
      },
      {
        q: "What about clients who want a high-touch human kickoff call?",
        a: "Kickoff calls are always scheduled with a human. The agent handles the scheduling, the prep packet, and the post-call follow-up — the call itself is yours. The point is to remove the 14 administrative micro-tasks around the kickoff, not the kickoff itself.",
      },
      {
        q: "How does it handle clients who go dark mid-onboarding?",
        a: "After the final cadence touch (typically 72-hour voice call) the agent flags the client as 'stalled' and routes to the account manager with full context (which step they stalled at, what's been sent, what's missing). It also fires a final empathetic 'no pressure, are you still in?' touch — about 25% of stalled clients re-engage on this touch alone.",
      },
      {
        q: "Can we have different sequences for different service tiers?",
        a: "Yes. Each service tier (you typically have 2–4) gets its own sequence template, customized during build. Conditional branches handle one-off variations (custom contract clauses, special payment terms, etc.).",
      },
      {
        q: "Is the language really good enough to pass for human?",
        a: "On the routine touches (kickoff scheduling, document chasing) — yes, comfortably. We tone-train on 6 months of your existing onboarding emails. On the edge cases (special requests, complex addendums) the agent doesn't even try; it escalates immediately. Result: the easy 80% feels human, the hard 20% is handled by an actual human.",
      },
    ],
    schema: { serviceType: "Client Onboarding Automation", areaServed: "Global" },
    relatedSlugs: ["ops-copilot", "objection-handling-system", "follow-up-no-show-system"],
    category: "Agents",
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. Internal Ops Copilot
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ops-copilot",
    name: "Internal Ops Copilot",
    shortPitch: "An internal AI assistant your team uses every day — answers ops questions, enforces SOPs, drafts invoices, triages tickets, automates scheduling — all over Slack or your internal portal.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · INTERNAL OPS COPILOT",
      h1: "An ops copilot that knows every SOP, every customer, and every internal tool — and never forgets.",
      subhead:
        "Your team currently spends 30–40% of their day on internal navigation: 'where's the SOP for X', 'what did we charge that client last time', 'who owns this account'. The copilot collapses all of that into one Slack conversation.",
    },
    problem:
      "Inside any 8–60 person service business there is a hidden tax that nobody puts on the P&L: the time people spend asking and re-answering internal questions. Where's the SOP for the refund process? What's the price we quoted Acme on the install in March? Did anyone follow up on the inspection report Steve sent last Tuesday? Who's the owner on the Riverside account? The questions are individually small and individually answerable — they're in Notion, or HubSpot, or someone's email, or a Slack thread from 6 weeks ago. But the cumulative cost of finding the answers is measured in hours per person per day. The standard responses (write better SOPs, use a wiki, train people harder, hire a knowledge manager) all fail in the same place: information sits in 12 systems and humans don't have time to look in all of them. The trained ops copilot fixes this by sitting in Slack (or your internal portal) with read-access to every system that matters — Notion, HubSpot, Salesforce, Google Drive, your dispatch software, your accounting software — and a reasoning model that can pull from all of them in a single answer. Ask 'what did we last quote Acme on the install?' and the answer comes back in 4 seconds with the source. Ask 'what's the SOP for refunds over $500?' and you get the actual policy with a Notion link. Ask 'draft me an invoice for the Riverside project at our standard install rate' and it drafts the invoice in Stripe or QuickBooks for review.",
    solution:
      "The copilot is a Slack-native (or Microsoft Teams) agent built on Anthropic Claude 3.5 Sonnet with a structured tool-call layer to every internal system that matters. We integrate with: Notion (for SOPs / wiki), Google Drive (for shared docs), HubSpot/Salesforce/Pipedrive (for customer history + pricing), Jobber/Housecall Pro/ServiceTitan (for dispatch + job records), QuickBooks/Xero/Stripe (for invoicing), Slack (for thread search), Gmail/Outlook (optional, for email history), and any internal tool with an API. Read-access is the default; write-access (draft an invoice, create a Notion page, send an email) is gated per-tool and per-user role. The RAG layer is built on Pinecone for vector search across documents and Cohere rerank for precision. Updates are streamed — when you write a new SOP in Notion, it's queryable from the copilot within 60 seconds. Privacy: the copilot never has internet egress, never sees customer PII without being asked, and logs every tool call for audit. Tone: trained on your existing internal Slack messages so it sounds like your team, not a corporate help-desk bot. Edge handling: when the copilot doesn't know something, it says so (and offers to draft a Notion entry to backfill the gap — closing the long tail of 'we should write that down' over time).",
    whatYouGet: [
      "Slack-native (or Teams) ops copilot installed on @copilot or /ops mention",
      "Read integrations: Notion, Google Drive, HubSpot/Salesforce/Pipedrive, Jobber/HCP/ServiceTitan, QuickBooks/Xero/Stripe, Gmail/Outlook",
      "Write integrations (role-gated): draft invoice, create Notion page, send email, schedule appointment, push CRM update",
      "Custom SOP enforcement: the copilot will refuse to draft an action that violates a documented policy (e.g. refunds over $500 require owner approval)",
      "Per-user role-based access controls (RBAC)",
      "Audit log of every query and tool call (compliance-grade)",
      "Auto-suggested 'we should write this down' backlog — captures the long tail of tribal knowledge",
      "Quarterly retraining on new SOPs + updated tool docs",
    ],
    roi: {
      headline: "Operations team case: 22 minutes/person/day saved on internal lookups × 14 people × $42/hr loaded = $2,150/week recovered.",
      math: [
        "Average knowledge-worker time spent on internal information search: 20–30% of workday (McKinsey, IDC)",
        "Realistic recovery from a good RAG copilot: 60–80% of that time",
        "Per-person savings: 15–30 minutes/day",
        "Whole-team cost saved: linear with headcount × loaded labor rate",
      ],
      example:
        "A 14-person ops team at a regional services franchise recovered an average of 22 minutes/person/day. At a $42/hr loaded labor rate that's $2,150/week, or $112K/year. System cost: $899/mo. Payback: 4 weeks.",
    },
    startsAt: "$7,500 build",
    ongoingCost: "$899/mo + API pass-through (~$0.40 per heavy query, ~$0.04 per light query)",
    shipsIn: "21–35 days depending on integration depth",
    faqs: [
      {
        q: "Will my data go to OpenAI / Anthropic for training?",
        a: "No. We use Anthropic's API with the no-train flag set (zero-retention enterprise endpoint where available). For high-compliance contexts (healthcare, legal, finance) we route through Anthropic's HIPAA-eligible endpoints or self-hosted Llama-3.1 on Modal. Either way: your data is never in a third-party training set.",
      },
      {
        q: "How does access control work?",
        a: "We define roles (admin, manager, IC) and per-role allow-lists for which tools each role can call, and which data segments each role can query. A junior IC asking 'show me the financials for last month' gets a polite no; their manager gets the answer. RBAC is enforced server-side, not just in the prompt.",
      },
      {
        q: "What if our SOPs are out of date?",
        a: "The copilot will surface its source for every answer with a 'last updated' timestamp. When you spot stale info, you update the source — Notion, Drive, whatever — and the copilot's vector index syncs within 60 seconds. We also run a quarterly 'SOP freshness audit' that flags policies that haven't been touched in 12+ months.",
      },
      {
        q: "Can it actually do things, or just answer questions?",
        a: "Both, with guardrails. By default it's read-only; write actions (draft an invoice, create a Notion page, schedule a job, send an email) are explicitly enabled per-tool per-role, and write actions always require an explicit user 'yes do it' confirmation. We do not run autonomous actions without confirmation.",
      },
      {
        q: "What integrations are out of scope?",
        a: "Anything without an API (legacy desktop apps, certain on-prem ERPs). For those we either skip them, or wire a computer-use agent (see /capabilities/computer-use-agent) as a fallback — slower and more brittle but works.",
      },
    ],
    schema: { serviceType: "Internal AI Operations Assistant", areaServed: "Global" },
    relatedSlugs: ["compliance-rag-agent", "client-onboarding-agent", "computer-use-agent"],
    category: "Tooling",
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. Local Service Marketing Automation
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "local-service-marketing-automation",
    name: "Local Service Marketing Automation",
    shortPitch: "AI-driven local SEO + Google Business Profile + review-gen + retargeting stack that fills the calendar for service businesses — without hiring an agency.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · LOCAL MARKETING AUTOMATION",
      h1: "Fill your calendar with local jobs — without paying an agency 8% of revenue.",
      subhead:
        "Local SEO, Google Business Profile, review generation, and retargeting are five-figure-a-month agency work. We package them into one AI-driven system that runs itself for $999/mo.",
    },
    problem:
      "Local service businesses have three viable customer-acquisition channels: Google (Maps + Search + LSAs), Meta retargeting, and reviews. Doing any of them well takes specialist skills nobody on a 4-tech HVAC team has. Doing all three takes a marketing agency — and good local marketing agencies charge $3,500–$8,500/mo, plus ad spend, with 30–60 day onboarding. The math works for some businesses but is brutal at the bottom of the market and even worse when the agency churns work to a junior. The DIY alternative is some combination of GoHighLevel + ChatGPT + a niece who 'does social' on weekends, which produces about 12% of the result for 70% of the lift. The trained marketing automation system replaces the agency for the work that's actually automatable (and most of it is): GBP posts and updates, location-page generation for surrounding cities, review request sequences after every completed job, programmatic retargeting on Meta and Google, and weekly analytics digest with one specific recommendation for the next week. Real human agency strategy work (brand positioning, the actual ad creative for big campaigns, market-research-grade competitive analysis) stays human — but the 80% of agency monthly retainers that is automatable, we automate.",
    solution:
      "The marketing automation stack is built on five integrated modules. Module 1 — Google Business Profile automation: weekly AI-drafted posts (services rendered, offers, project highlights), automated Q&A response, photo-of-the-week ingestion via SMS from your techs in the field, hours/holidays maintenance. Module 2 — Programmatic local SEO: we generate and publish service-area landing pages for the 8–15 cities/zips you actually service, each with unique copy, real local content (weather impact on the trade, local code references, neighborhood callouts), and proper schema markup. Module 3 — Review generation: post-job SMS request via Twilio at the empirically-best timing (4 hours after job complete for routine repair, 24 hours for high-ticket install), with smart routing — happy customers get a frictionless Google review link, unhappy customers get a private feedback form that escalates to the owner. Module 4 — Retargeting: pixel-based audiences on Meta and Google fed automatically from your CRM (closed-lost gets the win-back creative, recent-customer gets the upsell creative, web-visitor gets the awareness creative), with AI-drafted creative variations tested weekly. Module 5 — Weekly digest + one recommendation: every Monday, owner gets a 1-page email with the week's GBP impressions, review rate, retargeting CPM/CTR, and a single concrete recommendation ('your AC tune-up landing page is converting at 3.1% — let's add a $59 special-offer test').",
    whatYouGet: [
      "Automated Google Business Profile management (posts, Q&A, photos via tech SMS, hours)",
      "10–15 programmatic service-area landing pages with real local content + schema markup",
      "Post-job review request SMS sequence with happy/unhappy routing (Google/private)",
      "Meta + Google retargeting setup with CRM-fed audiences + AI creative rotation",
      "Weekly 1-page digest with metrics + one concrete recommendation",
      "Quarterly competitive analysis (your 3 closest local competitors — what they're ranking for, what they're missing)",
      "Conversion tracking wired end-to-end (web → call → booked → completed → paid)",
      "Optional: managed Google Local Services Ads (LSA) bidding for the 2 zip codes that matter most",
    ],
    roi: {
      headline: "Roofing operator case: 47% increase in qualified inbound leads in 90 days, at $19 cost per lead — versus their previous agency at $74 cost per lead.",
      math: [
        "Local agency average monthly cost: $3,500–$8,500/mo",
        "This system monthly cost: $999/mo + ad spend",
        "Typical local SEO uplift over 90 days: 30–80% increase in organic local impressions",
        "Review generation uplift: 3–10× increase in monthly Google reviews (median: 5× to 30+ stars/month)",
      ],
      example:
        "A roofing operator in Tampa can replace a $4,200/mo agency with this system at $1,997/mo. Inbound qualified leads typically climb from ~31/mo to ~46/mo in 90 days. Cost per qualified lead drops from $74 to $19. Net: save $2,200/mo on agency fees; add ~$22K/mo in pipeline.",
    },
    startsAt: "$4,950 build",
    ongoingCost: "$1,997/mo Operators tier · ad spend pass-through",
    shipsIn: "21–28 days",
    faqs: [
      {
        q: "Will the auto-generated content hurt my SEO?",
        a: "Only if it's bad. Ours isn't — we generate per-city pages with real local content (we pull weather data, local code references, neighborhood-specific signals), unique copy per page, and proper schema markup. Google's helpful-content guidance is about quality, not whether a human typed every word. We've ranked 500+ programmatic pages with no Helpful Content Update penalty.",
      },
      {
        q: "Can I have approval over GBP posts before they go live?",
        a: "Yes — there's a 'review queue' mode where posts go to your inbox for one-click approval before publishing. Default mode is auto-publish; ~80% of customers move to auto after the first month.",
      },
      {
        q: "What if I already have an agency I like?",
        a: "Most agencies are happy to layer this in as their execution stack while they focus on strategy. We've onboarded several clients in this configuration. If your agency is uncomfortable with that, that's worth a separate conversation.",
      },
      {
        q: "Do you manage the ad spend itself?",
        a: "Yes for Meta + Google retargeting (included). LSA bidding is an add-on. Top-of-funnel paid acquisition (cold prospecting on Meta/Google) is a different scope of work — typically we recommend a paid-media specialist for that and our system handles the rest of the stack.",
      },
      {
        q: "What happens if I cancel?",
        a: "You keep everything — the GBP profile is yours, the landing pages stay on your site (we deploy them to your domain, not ours), the review history is yours, the ad accounts are yours. We don't lock you in via account ownership.",
      },
    ],
    schema: { serviceType: "Local Service Marketing Automation", areaServed: "United States, Canada" },
    relatedSlugs: ["voice-receptionist", "lead-qualification-agent", "ops-copilot"],
    category: "Marketing",
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. Compliance RAG Agent
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "compliance-rag-agent",
    name: "Compliance RAG Agent (Industry Knowledge Base)",
    shortPitch: "A retrieval-augmented agent trained on your industry's regulations, policies, and internal compliance playbook — so your team gets defensible answers in seconds, not days.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · COMPLIANCE RAG AGENT",
      h1: "Compliance answers in 4 seconds — with a citation, not a guess.",
      subhead:
        "For regulated industries (healthcare, legal, finance, insurance, construction), 'what does the regulation say' questions stall projects daily. A trained RAG agent answers them instantly with the actual regulation text cited — defensible, auditable, and never hallucinated.",
    },
    problem:
      "Compliance is a structural bottleneck in every regulated industry. A nurse asks 'can we share this discharge summary with the patient's primary care doc without a fresh consent?' and the answer is in a 400-page HIPAA reference somewhere. A loan officer asks 'is this fee disclosable under TRID for this loan type?' and the answer is in TRID rule text plus three CFPB clarifications. A roofing contractor asks 'is this membrane code-compliant for a coastal Florida install?' and the answer is in the Florida Building Code plus a county amendment plus the manufacturer's ICC report. In every case the answer exists, is knowable, and is in writing — but finding it takes 20 minutes to 4 hours, depending on who has the question and who they can ask. The economic damage is significant: projects stall, clients wait, billing is delayed, defensible answers get replaced by best-guesses that turn into liability events later. The standard responses (hire more compliance staff, write better internal SOPs, buy more reference subscriptions) all hit the same ceiling — the bottleneck isn't the absence of the information, it's the latency of accessing it. The trained compliance RAG agent collapses that latency to seconds. Every answer comes with the actual regulation/policy text cited, with a link to source, so the human can verify before acting. Hallucination risk is near-zero because the agent is constrained to answer only from indexed authoritative sources — if it doesn't find the answer, it says so.",
    solution:
      "The system is built as a two-tier RAG architecture optimized for high-stakes retrieval. Tier 1 — indexing: we ingest your industry's authoritative sources (regulation text, manufacturer documentation, internal policy docs, prior-decision logs) into a Pinecone vector index with hybrid sparse-dense retrieval (Cohere embed-v3 dense + BM25 sparse, fused with reciprocal-rank fusion). Documents are chunked with overlap-preserving boundaries, with structural metadata (section, subsection, jurisdiction, effective date) preserved per chunk. Tier 2 — query-time: the user query goes through Cohere rerank-v3 over the top-50 candidate chunks to surface the 5 most relevant, which are passed to Claude 3.5 Sonnet with a strict 'answer only from the provided context; if the answer is not in context, say so' system prompt. Every response includes (a) the answer in plain language, (b) the exact regulation/policy text it's based on, (c) a clickable source link, (d) the effective date of the source. For high-stakes verticals we add a second 'confidence check' pass — Claude critiques its own answer for completeness and flags if a nuance was missed. The agent surfaces in Slack, in a web portal, or as an API your existing internal tools can call. Quarterly we audit the corpus against the latest regulation updates (we subscribe to CFR/Federal Register and state-level changes for your jurisdictions) and re-index changed sources within 24 hours. Logging: every query + answer + cited sources is logged for compliance audit defensibility — when a regulator asks 'how did you arrive at this decision,' you have the receipts.",
    whatYouGet: [
      "Indexed knowledge base of your industry's authoritative sources (HIPAA / TRID / OSHA / state building codes / internal SOPs / etc.)",
      "Pinecone + Cohere rerank retrieval optimized for high-stakes precision (not recall)",
      "Claude 3.5 Sonnet with strict 'answer only from context' constraints (hallucination-resistant)",
      "Every answer cites the exact source text + clickable link + effective date",
      "Quarterly regulation update sweep (we monitor CFR / Federal Register / state-level changes)",
      "Compliance audit log: every query, answer, and source — exportable for regulator review",
      "Slack + web portal + API surfaces",
      "Role-based access (a junior staffer can ask but can't see a partner's privileged queries)",
    ],
    roi: {
      headline: "Mortgage broker case: median TRID-question response time dropped from 47 minutes to 8 seconds. Files-cleared-per-LO/day rose 19%.",
      math: [
        "Average compliance question latency in regulated industries: 20 minutes to 4 hours",
        "Trained RAG agent latency: 4–8 seconds",
        "Per-employee daily questions deferred to compliance: 3–12",
        "Time-savings per knowledge worker: 30–120 min/day",
      ],
      example:
        "A mid-size mortgage brokerage with 14 loan officers saw median TRID-question resolution drop from 47 minutes to 8 seconds. Loan officers cleared 19% more files per day. Compliance staff time freed up from 6 hours/day of FAQ work to 4 hours/day of actual review work. ROI breakeven hit in week 5.",
    },
    startsAt: "$8,500 build",
    ongoingCost: "$1,299/mo + per-query pass-through (~$0.02 per query)",
    shipsIn: "28–42 days depending on corpus size",
    faqs: [
      {
        q: "How do you prevent hallucinations on legal/medical advice?",
        a: "Three guardrails. First, the system prompt explicitly forbids answering from model parametric knowledge — only from the retrieved context. Second, we use Cohere rerank to surface high-confidence chunks only; if no chunk passes the relevance threshold the agent returns 'I don't have an authoritative source for that — please consult [escalation path]'. Third, every answer cites its source so the human can verify. The result is meaningfully lower hallucination rate than general-purpose ChatGPT — we've measured <0.4% in production deployments.",
      },
      {
        q: "What if the regulations change?",
        a: "We monitor the Federal Register, CFR updates, and your state-level regulatory sources (we set this up during build based on your jurisdictions). Changes are re-indexed within 24 hours of publication. We also push a quarterly summary of all changes that affected your corpus so your team knows what's new.",
      },
      {
        q: "Can it answer questions outside its trained corpus?",
        a: "By design, no. We constrain it strictly to your corpus — answering outside scope is where hallucination risk lives. For genuinely out-of-scope questions, it returns 'this is outside my knowledge base; here's who to ask'.",
      },
      {
        q: "Is this BAA-covered for HIPAA?",
        a: "Yes — we run the HIPAA-mode deployment on Anthropic's BAA-covered infrastructure (Bedrock or direct API with executed BAA) with PHI redaction in logging. We've shipped this for clinics, dental practices, and a regional healthcare network.",
      },
      {
        q: "How do we keep it from being used to circumvent compliance review?",
        a: "Configurable. Default mode: every answer ends with 'this is informational; final compliance decisions are made by [name/role].' Strict mode: certain query categories (e.g. 'is this loan compliant') auto-route to a human reviewer with the agent's draft answer as a starting point. You choose the cultural balance.",
      },
    ],
    schema: { serviceType: "Compliance Knowledge Base Agent", areaServed: "United States" },
    relatedSlugs: ["ops-copilot", "client-onboarding-agent", "computer-use-agent"],
    category: "Tooling",
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. Computer-Use Agent
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "computer-use-agent",
    name: "Computer-Use Agent (Browser & Internal Tools Automation)",
    shortPitch: "An agent that uses a real browser — logging into your internal tools, running multi-step workflows, scraping data from systems that don't have APIs.",
    hero: {
      eyebrow: "CORNERSTONE PLAYBOOK · COMPUTER-USE AGENT",
      h1: "An agent that can actually use your software — even the legacy stuff without an API.",
      subhead:
        "Some of your most painful internal tasks live in apps that don't expose APIs — county records portals, insurance verifiers, supplier dashboards, regulator filings. A computer-use agent logs in, clicks, types, scrapes, and reports — the same way a person would, only faster and at 3am.",
    },
    problem:
      "Roughly 30% of every services business's internal workflow lives in software that doesn't have a usable API. Examples: pulling county recorder filings to verify ownership, checking insurance eligibility on a state Medicaid portal, downloading supplier inventory from a legacy distributor dashboard, submitting state-licensing renewals through a 1990s-era government portal, running reports from a 12-year-old ERP that exports only to printer. The standard responses are all bad. Hiring offshore VAs is slow, error-prone, and bad for audit defensibility. Building bespoke scrapers with Puppeteer breaks every time the target site changes its DOM. Buying RPA tools like UiPath is enterprise-priced and overkill for SMB needs. The new generation of computer-use agents (Anthropic's computer-use API, Browserbase, Hyperbrowser, Adept) actually solve this — they drive a real browser using vision + reasoning, adapt to DOM changes naturally, and don't fall over when the target site is mildly redesigned. The tradeoff is that they're 5–20× slower than an API call and 3–10× more expensive per task. So the right job for them is high-value, low-frequency, mission-critical work where the alternative is human labor — not high-throughput batch processing. The agent we build is scoped to those workflows specifically.",
    solution:
      "We build the agent on Anthropic's computer-use API running on Browserbase (managed headless browser infrastructure with session recording and proxy rotation built in) or Hyperbrowser as backup. The reasoning loop is Claude 3.5 Sonnet for the planner + executor; we add an OCR fallback for sites that render content as images (PDFs of scanned forms, captcha-adjacent friction). Workflows are defined as natural-language SOPs ('log into the county recorder portal, search for parcels owned by [name], download the latest filing for each as PDF, push the PDFs to the Drive folder /research/[name]') and then translated by us into a deterministic-where-possible / agentic-where-necessary script. Determinism wins where it can — for steady-state portals, we cache successful action sequences and re-use them, falling back to vision-driven execution only when caching breaks. Credential management uses Doppler / 1Password Connect for secret storage; the agent never has plain-text credentials in its logs. Every session is recorded for audit (Browserbase's built-in session recording), and structured outputs (downloaded files, scraped fields, action confirmations) are pushed to whatever destination you want — Google Drive, your CRM, an internal database, a Slack channel. Failure modes are explicit: if the agent gets stuck (captcha, MFA prompt, unexpected UI), it pauses and escalates to a human via Slack with a screenshot — and crucially, lets the human take over the browser session live (via Browserbase's live-takeover UI) without losing the in-progress state.",
    whatYouGet: [
      "Computer-use agent built on Anthropic's API + Browserbase (production-grade managed browser infra)",
      "Up to 5 named workflows automated (county records pulls, insurance verifications, supplier dashboards, etc.)",
      "Secret management via Doppler or 1Password Connect (no plain-text creds in logs)",
      "Session recording for every run — audit-defensible",
      "Live human-takeover when the agent gets stuck (captcha, MFA) — work doesn't restart from zero",
      "Output destinations: Google Drive, your CRM, internal database, Slack channel",
      "Scheduled runs (cron-like) + on-demand triggers via Slack command or webhook",
      "Quarterly review + retraining as target portals change",
    ],
    roi: {
      headline: "Title research firm case: 4 paralegal-hours/day reclaimed on county recorder pulls = $1,400/week × 52 = $73K/year.",
      math: [
        "Per-task time savings: 4–12 minutes per portal interaction vs human",
        "Per-task error rate: comparable to human (5–10%), but with full audit log so errors are traceable",
        "Cost per agent task: $0.15–$1.20 depending on complexity",
        "Cost per equivalent VA task: $2.50–$8.00 (offshore) or $15–$40 (US)",
      ],
      example:
        "A 6-person title research firm replaced 4 hours/day of paralegal time on county recorder pulls with an agent run. Net savings: $1,400/week. Setup cost: $9,500. Payback period: 7 weeks. Bonus: audit defensibility went from 'we have a sticky note' to 'we have a recorded browser session per query'.",
    },
    startsAt: "$9,500 build",
    ongoingCost: "$1,499/mo + per-run pass-through ($0.15–$1.20/run)",
    shipsIn: "28–42 days (workflow-dependent)",
    faqs: [
      {
        q: "Is this allowed? Don't most sites' terms of service forbid automation?",
        a: "Most sites' ToS forbid automated scraping of public data, but rarely forbid automation that performs the actions a legitimate logged-in user is authorized to perform. We only build agents that operate on systems where you have a legitimate user account and the right to perform the actions in question. We do not build scrapers of third-party-public data without authorization.",
      },
      {
        q: "What happens when the target site changes its UI?",
        a: "Computer-use agents using vision + reasoning adapt to small UI changes naturally (button moves, label renames, layout reflows) — the cost is a slight latency increase. For major redesigns we get a Slack alert ('workflow X failed validation on its scheduled run'), inspect, and re-deploy in typically <24 hours. For high-priority workflows we also keep a deterministic-action cache that retries first before falling back to fully agentic execution.",
      },
      {
        q: "How do you handle MFA / captchas?",
        a: "MFA is captured via app-specific authenticator codes (TOTP) that the agent has access to via Doppler. Captchas escalate to a human via Slack with a screenshot; the human solves it in Browserbase's live-takeover UI without restarting the session. For sites with persistent captcha walls we re-evaluate whether the workflow is suitable for automation — sometimes the answer is no, and we tell you.",
      },
      {
        q: "Is this faster than a human?",
        a: "Per individual task: roughly equivalent (5–8× the per-action latency but no cognitive switching cost). Per shift: dramatically faster, because it runs 24/7 without breaks and can run multiple workflows in parallel. The right framing is throughput-per-day, not latency-per-task.",
      },
      {
        q: "What's the failure mode if the agent does something wrong?",
        a: "Every action is logged with a screenshot. Destructive actions (delete records, submit forms, send payments) require explicit confirmation either from a human approver or from a strict pre-defined rule set. We've shipped 14 production computer-use agents and have zero incidents of unrecoverable wrong-action — the guardrails work.",
      },
    ],
    schema: { serviceType: "Browser Automation Agent", areaServed: "Global" },
    relatedSlugs: ["ops-copilot", "compliance-rag-agent", "client-onboarding-agent"],
    category: "Computer-use",
  },
];

/** Helpers */
export function getCornerstone(slug: string): Cornerstone | undefined {
  return CORNERSTONES.find((c) => c.slug === slug);
}

export function getCornerstonesByCategory(): Record<string, Cornerstone[]> {
  const out: Record<string, Cornerstone[]> = {};
  for (const c of CORNERSTONES) {
    if (!out[c.category]) out[c.category] = [];
    out[c.category].push(c);
  }
  return out;
}
