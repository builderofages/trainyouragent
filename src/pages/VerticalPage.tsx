import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import AgentSimulator, { VERTICAL_SCENARIOS } from "@/components/AgentSimulator";
// v38: filtered Wall of Love on every vertical page
import WallOfLove from "@/components/WallOfLove";
// v89: missed-call ROI calculator — highest-converting widget for service
// business verticals. Visitor self-quantifies what they're losing.
import MissedCallROI from "@/components/MissedCallROI";
// v88: tech stack badges so vertical SEO arrivals see real infra credibility.
import PoweredByBadges from "@/components/PoweredByBadges";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills";
const HERO_PHONE_DISPLAY = "Book a 15-min Zoom";
const HERO_PHONE_TEL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

type LaneId = "startup" | "smb" | "agency" | "ops";

type VerticalConfig = {
  label: string; eyebrow: string; headline1: string; headline2: string; sub: string;
  bullets: string[]; transcript: string[]; integrations: string[]; pricePoint: string;
};

const V: Record<string, VerticalConfig> = {
  "/healthcare": {
    label: "Healthcare",
    eyebrow: "For practices, clinics, and multi-location groups",
    headline1: "Patient intake that doesn't",
    headline2: "send people to voicemail.",
    sub: "Your agent answers in two rings, verifies insurance, schedules the visit, and routes urgent symptoms to a human. BAA per customer. HIPAA-aware architecture. We are not a Covered Entity ourselves.",
    bullets: ["After-hours triage with human escalation rules you control","Insurance verification + intake forms before the visit","Native integration with athena, eClinicalWorks, DrChrono, Epic open APIs","BAA signed before any PHI flows"],
    transcript: ["Caller: Hi, I'm trying to schedule for next week.","Agent: Of course — can I get your full name and date of birth?","Caller: Sarah Lee, March 12, 1989.","Agent: Found you, Sarah. I see your Aetna PPO is still on file. Returning patient?","Caller: Yes, I had a visit last year.","Agent: We have Tuesday at 9:40 with Dr. Patel or Thursday at 2:15 with Dr. Kim. Which works?"],
    integrations: ["Athena","eClinicalWorks","Epic open API","DrChrono","Twilio HIPAA","Cal.com"],
    pricePoint: "Operators plan + BAA add-on",
  },
  "/legal": {
    label: "Legal", eyebrow: "For solo and multi-attorney firms",
    headline1: "Intake that filters", headline2: "before you spend a minute.",
    sub: "Conflict checks, jurisdiction filters, matter classification, and triage to the right attorney. Your agent runs the qualifying questions so you don't burn billable time on a no-fit lead.",
    bullets: ["Automatic conflict check against your CMS","Jurisdiction + practice-area routing","Engagement letter triggered on qualified leads","Native integration with Clio, MyCase, PracticePanther"],
    transcript: ["Caller: I think I have a slip-and-fall case.","Agent: Where did it happen?","Caller: Grocery store in Florida, last Tuesday.","Agent: Did you see a doctor for any injuries?","Caller: Yes, the same day.","Agent: That helps. Let me book you with Sarah Reyes, our senior PI attorney — Tuesday at 10 work?"],
    integrations: ["Clio","MyCase","PracticePanther","Lawmatics","DocuSign","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/real-estate": {
    label: "Real Estate", eyebrow: "For agents, teams, and brokerages",
    headline1: "Every lead answered,", headline2: "every showing booked.",
    sub: "Speed-to-lead in seconds, not hours. Your agent qualifies buyer/seller intent, verifies pre-approval, and books showings — even from Zillow leads at 11pm Sunday.",
    bullets: ["Speed-to-lead under 30 seconds, 24/7","Buyer vs seller intent classification","Pre-approval qualification questions","Native integration with Follow Up Boss, KvCORE, Sierra Interactive"],
    transcript: ["Agent: Hi, this is Lex calling from Coastal Realty. You looked at the listing on Maple Street?","Caller: Yeah, is it still available?","Agent: It is. Working with an agent currently?","Caller: No.","Agent: Pre-approval in place, or still early?","Caller: I'm pre-approved up to 450.","Agent: Saturday 10am or Sunday 1pm showing. Which works?"],
    integrations: ["Follow Up Boss","KvCORE","Sierra Interactive","Boomtown","MLS APIs","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/hvac": {
    label: "HVAC", eyebrow: "For service companies, multi-tech teams, and franchises",
    headline1: "Every after-hours call", headline2: "becomes a booked job.",
    sub: "Storm Monday at 6am. AC dies on a Sunday at 2pm. Your agent picks up, qualifies emergency vs routine, prices the dispatch, and books the tech truck.",
    bullets: ["Emergency vs routine classification with your pricing logic","Real-time tech availability lookup","Native integration with ServiceTitan, Housecall Pro, Jobber","Surge-proof for storm season"],
    transcript: ["Caller: AC stopped working and it's 95 degrees in the house.","Agent: That's miserable. Current customer?","Caller: Yes, you did our install two years ago.","Agent: I see your unit on file. Emergency same-day dispatch trip fee is $189, applied to any repair. Tech 12 minutes from you — 3:45 work?","Caller: Yes, please."],
    integrations: ["ServiceTitan","Housecall Pro","Jobber","FieldEdge","Twilio","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/roofing": {
    label: "Roofing", eyebrow: "For storm-chasers, residential, and commercial",
    headline1: "Storm week without", headline2: "missing a single call.",
    sub: "Hail hits, phones melt. Your agent qualifies insurance vs cash, books the inspection, captures damage description, and triages emergencies.",
    bullets: ["Insurance vs cash classification at intake","Storm-surge capacity that doesn't crack","Native integration with AccuLynx, JobNimbus, Roofr","Inspection scheduling with photos and damage description capture"],
    transcript: ["Caller: We had hail Sunday and I think we have damage.","Agent: Insurance claim or cash repair?","Caller: Probably insurance.","Agent: Filed yet?","Caller: Not yet.","Agent: We'll come document the damage first. Tuesday 9am or Wednesday 11am?"],
    integrations: ["AccuLynx","JobNimbus","Roofr","CompanyCam","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/solar": {
    label: "Solar", eyebrow: "For installers, EPC, and consumer brands",
    headline1: "Lead qual before", headline2: "your closer's coffee.",
    sub: "Inbound from a meta ad doesn't deserve six hours of voicemail tag. Your agent qualifies roof orientation, utility, current bill, and books the site survey while the lead is still hot.",
    bullets: ["Utility + bill + orientation qual at intake","Site survey booking with installer availability","Native integration with Aurora, Enerflo, Solo","SMS follow-up sequence if the call drops"],
    transcript: ["Caller: I saw your ad about solar.","Agent: Awesome. Average monthly electric bill?","Caller: Around $280.","Agent: South-facing roof?","Caller: South, mostly.","Agent: Site survey Thursday 4pm or Saturday 10am?"],
    integrations: ["Aurora Solar","Enerflo","Solo","OpenSolar","HubSpot","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/accounting": {
    label: "Accounting", eyebrow: "For CPAs, bookkeepers, and tax-season surges",
    headline1: "Tax season without", headline2: "burning out your bench.",
    sub: "Every January through April your phones explode. Your agent runs intake, classifies client type, schedules the appointment, and triages emergencies.",
    bullets: ["Client type classification (individual, S-corp, LLC, sole prop)","Document checklist sent over SMS before appointment","Native integration with Karbon, TaxDome, Canopy","Returning vs new client routing"],
    transcript: ["Caller: I need someone to do my taxes this year.","Agent: Personal or business?","Caller: Both — S-corp and personal.","Agent: $850 combined. Send our checklist and book intake?","Caller: That works."],
    integrations: ["Karbon","TaxDome","Canopy","QuickBooks","Stripe","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/automotive": {
    label: "Automotive", eyebrow: "For dealers, service centers, and multi-location",
    headline1: "Service-bay scheduling", headline2: "that doesn't lose the work.",
    sub: "Every inbound about a service appointment gets answered, qualified for warranty, and booked into the right bay — without your service writer pausing the customer in front of them.",
    bullets: ["Warranty vs out-of-pocket triage","Loaner / shuttle / waiting-room options at booking","Native integration with CDK, Reynolds, Dealertrack","Make/model/VIN capture"],
    transcript: ["Caller: I need an oil change and my check engine light is on.","Agent: Year, make, model?","Caller: 2019 Camry.","Agent: Powertrain warranty?","Caller: I think so.","Agent: Tuesday 8am with loaner, or Thursday 7:30am waiting?"],
    integrations: ["CDK","Reynolds & Reynolds","Dealertrack","Tekion","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/spas": {
    label: "Spas", eyebrow: "For day spas, med spas, and wellness studios",
    headline1: "Booking + waitlist", headline2: "without losing the vibe.",
    sub: "Your agent answers in your tone, books treatments, manages waitlists, and protects revenue from no-shows with deposit logic — at the calm pace your clients expect.",
    bullets: ["Treatment + provider preference matching","Deposit + cancellation policy enforcement","Native integration with Mindbody, Boulevard, Vagaro","Waitlist with auto-fill on cancellations"],
    transcript: ["Caller: I'd like to book a 90-minute massage this weekend.","Agent: Saturday or Sunday?","Caller: Saturday.","Agent: 11am with Maya or 4pm with Devon. We hold with a $40 deposit — text you a payment link?"],
    integrations: ["Mindbody","Boulevard","Vagaro","Square","Stripe","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/hotels": {
    label: "Hotels", eyebrow: "For boutique, mid-scale, and multi-property",
    headline1: "Front-desk overflow", headline2: "answered by your brand.",
    sub: "Every call routed off the front desk gets your tone, your information, your booking link — not a generic IVR that ages your brand badly.",
    bullets: ["Concierge questions (parking, breakfast, check-in, amenities)","Direct-booking handoff to your PMS","Native integration with Cloudbeds, Mews, Opera","Multi-language (EN/ES/FR baseline)"],
    transcript: ["Caller: What time is check-in?","Agent: 4pm. Early sometimes available — put a request on your reservation?","Caller: Yes please, name's Carla Rivera.","Agent: Got you, Carla. Anything else — parking, breakfast, gym hours?"],
    integrations: ["Cloudbeds","Mews","Opera Cloud","RoomRaccoon","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/bars-nightclubs": {
    label: "Bars & Nightclubs", eyebrow: "For venues, lounges, and event nightlife",
    headline1: "Reservations + tables", headline2: "while the bar is loud.",
    sub: "Your agent picks up when the host can't — books tables, holds VIP requests, manages the waitlist, and texts guests when they're up.",
    bullets: ["Reservation + waitlist + table-hold logic","VIP / minimum-spend handling","Native integration with SevenRooms, Resy, OpenTable","SMS-first guest comms"],
    transcript: ["Caller: Table for six at 9pm Friday?","Agent: VIP table with $750 minimum, or general at 10pm. Which?","Caller: VIP.","Agent: Done — texting deposit link. Bottle picked out?"],
    integrations: ["SevenRooms","Resy","OpenTable","Tock","Toast","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/logistics": {
    label: "Logistics", eyebrow: "For carriers, brokers, and last-mile",
    headline1: "Driver comms + dispatch", headline2: "at the speed of the load.",
    sub: "Your agent answers driver check-calls, runs status updates, and handles standard exceptions — freeing dispatchers to make the calls that actually need a human.",
    bullets: ["Driver check-call automation","Standard exception triage (delays, detention, late loads)","Native integration with McLeod, TMW, Trucker Tools","Multilingual driver support (EN/ES)"],
    transcript: ["Driver: BOL 4471 — at the receiver, 30-minute wait.","Agent: 30-minute detention starting now. Logging and notifying broker. Anything else?","Driver: That's it."],
    integrations: ["McLeod","TMW","Trucker Tools","Truckstop","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/gym": {
    label: "Fitness", eyebrow: "For studios, gyms, and multi-location chains",
    headline1: "Memberships + classes", headline2: "answered in your brand.",
    sub: "From the front desk you can't always staff to the inbound class question at 9pm — your agent runs intake, books trials, and handles cancellations on policy.",
    bullets: ["Membership inquiry + trial booking","Class waitlist + reschedule logic","Native integration with Mindbody, Wellness Living, Glofox","Cancellation policy enforcement"],
    transcript: ["Caller: Do you have a free trial?","Agent: 7-day pass is free for new members. Saturday 8am Yoga or Sunday 9am HIIT?","Caller: Saturday Yoga.","Agent: Booked. Texting check-in details."],
    integrations: ["Mindbody","Wellness Living","Glofox","Zen Planner","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/ecommerce": {
    label: "E-commerce", eyebrow: "For DTC, marketplaces, and Shopify Plus",
    headline1: "Support that converts —", headline2: "not just deflects.",
    sub: "Your store gets a chat + voice agent that knows your SKUs, your shipping windows, your return policy, and your discount logic. Shoppers get answers in their language; you get higher AOV and lower refund rate.",
    bullets: [
      "Shopify / WooCommerce / BigCommerce native — order lookup, refunds, tracking, swaps",
      "Pre-purchase questions answered in the cart with discount code attribution",
      "Native integration with Klaviyo, Gorgias, Zendesk, Recharge",
      "Multi-language (EN/ES/FR/DE) and 24/7 — no overnight ticket queue",
    ],
    transcript: [
      "Caller: I ordered the running shoes a week ago and they haven't shipped.",
      "Agent: Pulling up your order — order #44712, Hyperion Trail in size 10. Sorry about that. Carrier picked up Tuesday and is currently in transit, ETA Saturday.",
      "Caller: Can I change the size to 10.5?",
      "Agent: It's already with the carrier so I can't change it in flight, but the moment it arrives I'll auto-create a free size-swap return and ship the 10.5 today on a Saturday-delivery — sound good?",
      "Caller: Yes, perfect.",
    ],
    integrations: ["Shopify","Klaviyo","Gorgias","Zendesk","Recharge","ShipStation","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/hospitality": {
    label: "Hospitality", eyebrow: "For hotels, restaurants, resorts, and venues",
    headline1: "Front-of-house overflow,", headline2: "answered in your brand.",
    sub: "Reservations, concierge questions, room service, group bookings, lost-and-found — your agent handles it in your tone, in the guest's language, 24/7. Front-desk staff stay focused on the guest who's standing right in front of them.",
    bullets: [
      "Reservations + waitlist + table holds across SevenRooms, Resy, OpenTable, Tock",
      "Concierge questions (parking, breakfast, check-in, amenities, late checkout)",
      "Direct-booking handoff to your PMS (Cloudbeds, Mews, Opera Cloud)",
      "Multi-language baseline (EN/ES/FR) with on-brand voice cloning",
    ],
    transcript: [
      "Caller: Hi, I'd like to book a table for four on Saturday at 7.",
      "Agent: Of course. Indoor, patio, or chef's counter?",
      "Caller: Patio if you have it.",
      "Agent: I have 7:15 on the patio under the heat lamps — same name as your last visit, the Calderon party?",
      "Caller: Yes that's me.",
      "Agent: Booked. Texting you the confirmation now. Anything for the occasion — anniversary, birthday?",
    ],
    integrations: ["SevenRooms","Resy","OpenTable","Cloudbeds","Mews","Opera Cloud","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/solutions": {
    label: "Custom", eyebrow: "Don't see your industry?",
    headline1: "Custom agents for", headline2: "anything humans answer.",
    sub: "If your team is currently answering something repetitive, we can build an agent for it. Gaming, content, SaaS, ecommerce, advisory, moderation — anything.",
    bullets: ["Custom training data + scripts","Custom integrations (REST, webhook, or direct DB)","Custom voice + tone","Custom escalation rules"],
    transcript: ["Agent: Thanks for calling. How can I help today?"],
    integrations: ["Anything you use","Custom build","REST + webhook"],
    pricePoint: "Custom — Scale plan",
  },
};

/* ------------------------------------------------------------------ */
/*  VERTICAL_CONTENT — rich per-niche content for the top 8 verticals  */
/*                                                                    */
/*  Each entry adds:                                                  */
/*    painPoint  — in their language, not jargon                       */
/*    tools      — 3 specific named tools we ship + the outcome        */
/*    caseStudy  — placeholder for Alexander to fill in [Customer]/[Y] */
/*    cta        — vertical-specific CTA copy                          */
/*                                                                    */
/*  When the current slug has an entry here, the VerticalPage renders */
/*  an extra "Built for {industry}" block beneath the integrations    */
/*  strip. Falls back gracefully for slugs without an entry.          */
/* ------------------------------------------------------------------ */
type RichContent = {
  painPoint: { headline: string; body: string };
  tools: { name: string; outcome: string }[];
  caseStudy: string;       // contains [Customer] and [Y] for Alexander to replace
  cta: { primary: string; secondary: string };
};

export const VERTICAL_CONTENT: Record<string, RichContent> = {
  "/hvac": {
    painPoint: {
      headline: "Sunday at 2pm in July. The AC dies. Your phone rings — and rings.",
      body: "Every after-hours call you miss is a competitor's truck in your customer's driveway tomorrow morning. The on-call tech can't answer because he's already in someone's attic. The answering service flubbed the address last week and you ate a $400 truck-roll. Your CSR is on PTO. Storm season is in three weeks.",
    },
    tools: [
      { name: "After-hours emergency triage agent", outcome: "Picks up in under three rings, classifies emergency vs routine on your pricing logic, books the dispatch with your trip-fee disclosure, and texts the on-call tech the address + customer history before the truck rolls." },
      { name: "ServiceTitan / Housecall Pro / Jobber dispatch sync", outcome: "Live tech availability lookup against the actual schedule — no double-booking, no calling back to confirm, no manual ticket creation. The job is in the system before you hang up." },
      { name: "Storm-surge auto-scaling", outcome: "When call volume spikes 10x during a heat event or freeze, the agent absorbs it without a single missed call. Your CSRs handle the white-glove customers; the agent absorbs the surge." },
    ],
    caseStudy: "After we shipped the after-hours dispatch agent for [Customer], a Tampa-area HVAC company with 14 trucks, they captured [Y]% more after-hours emergency tickets in their first storm event and recovered roughly $[Y]K in jobs that would have gone to voicemail.",
    cta: {
      primary: "Stop missing after-hours emergency calls. Book a 30-minute build call.",
      secondary: "Or call us live and see how we'd answer your phones.",
    },
  },
  "/healthcare": {
    painPoint: {
      headline: "Your front desk is drowning. Patients hang up. Stars drop. Repeat.",
      body: "Average call wait is six minutes. The voicemail box fills by 2pm. New-patient inquiries drop off the funnel because nobody calls back the same day. Your insurance verification team is two FTE behind, and nobody's caught up since flu season. Meanwhile your Yelp reviews are about the phones.",
    },
    tools: [
      { name: "Patient intake + insurance verification agent", outcome: "Answers in two rings, verifies eligibility against the payor in real time, captures intake forms over SMS before the visit, and routes urgent symptoms to a human under the rules YOU control. BAA signed before any PHI flows." },
      { name: "Athena / eClinicalWorks / Epic open-API booking", outcome: "Books straight into the right provider's panel based on payor mix, location, and acuity. No staff transcription, no double-booking, no follow-up calls to confirm." },
      { name: "Recall + no-show recovery cadence", outcome: "Auto-runs the 24h confirm + 2h reminder + same-day rebook flow over voice + SMS. No-show rate drops 30-50% in the first 60 days for most clinics." },
    ],
    caseStudy: "After we shipped patient intake for [Customer], a multi-location primary-care group, their average call wait dropped from [Y] to under 30 seconds and new-patient capture climbed [Y]% in the first quarter — without adding a single front-desk FTE.",
    cta: {
      primary: "Stop sending patients to voicemail. Book a 30-minute build call.",
      secondary: "Or talk to a real person on our line.",
    },
  },
  "/real-estate": {
    painPoint: {
      headline: "Zillow lead drops at 11pm Sunday. By Monday at 9am it's dead.",
      body: "Speed-to-lead under five minutes triples your contact rate. Yours is currently four hours, eight on weekends. The lead-gen spend is real — Zillow, Realtor, paid social, ISA team — and the ROI is leaking out the bottom because you can't pick up the phone fast enough. The good leads are already in someone else's CRM by the time you call.",
    },
    tools: [
      { name: "Speed-to-lead voice + SMS agent", outcome: "Calls and texts inside 30 seconds of any inbound — Zillow, Realtor, your site, Facebook lead form. Qualifies buyer vs seller, captures pre-approval status, and books the showing or listing appointment before the lead can browse to a competitor." },
      { name: "Follow Up Boss / KvCORE / Sierra Interactive native sync", outcome: "Two-way sync, not a webhook duct-taped together. Lead source, conversation transcript, qualification answers, and booked showing all land in the right CRM stage automatically." },
      { name: "Long-cycle nurture cadence", outcome: "Most leads aren't ready today — the agent runs the 30/60/90/180-day touch cadence over voice + SMS so the lead is warm when they finally are ready, instead of sitting in a stale CRM tag." },
    ],
    caseStudy: "After we shipped speed-to-lead for [Customer], a Tampa-area team running $[Y]K/mo in Zillow spend, their contact-rate on inbound leads jumped from [Y]% to [Y]% and they closed [Y] additional deals in the first quarter that would otherwise have aged out.",
    cta: {
      primary: "Stop losing the 11pm lead. Book a 30-minute build call.",
      secondary: "Or call our line — we'll qualify you the same way.",
    },
  },
  "/legal": {
    painPoint: {
      headline: "You bill at $450/hr. You're answering intake calls for $0/hr.",
      body: "Half your inbound is unqualified — wrong jurisdiction, wrong practice area, conflicts, or just price-shoppers. The other half are great leads who got voicemail and went to the firm down the street. Your paralegal does intake, but she's also doing real work, so the queue builds. The lead form on your site? Last reply was Tuesday.",
    },
    tools: [
      { name: "Intake + conflict-check agent", outcome: "Runs your conflict check against the CMS in real time, filters by jurisdiction and practice area, captures the matter facts, and triages to the right attorney. Sends you a fully-summarized intake before you ever pick up." },
      { name: "Clio / MyCase / PracticePanther native integration", outcome: "Creates the contact, opens the matter, attaches the intake summary, and triggers the engagement letter automation — all before the lead's coffee gets cold." },
      { name: "Engagement-letter trigger on qualified leads", outcome: "Auto-generates and sends the engagement letter via DocuSign for qualified matters, with payment plan capture for retainer collection. Closes the loop without partner involvement." },
    ],
    caseStudy: "After we shipped intake for [Customer], a multi-attorney PI firm, qualified-lead-to-signed-retainer conversion lifted from [Y]% to [Y]% and partners stopped fielding intake calls entirely — recovering an estimated [Y] billable hours per month across the firm.",
    cta: {
      primary: "Stop burning billables on intake. Book a 30-minute build call.",
      secondary: "Or DM Alexander on LinkedIn — fastest path.",
    },
  },
  "/ecommerce": {
    painPoint: {
      headline: "WISMO tickets are eating your margin and your team's morale.",
      body: "60-70% of your support volume is 'where is my order?' — questions a customer could answer themselves if your tracking page worked. Your CX team is burning out on tier-1 questions while real escalations sit in the queue. Refund rate is creeping because the size-chart question isn't getting answered in the cart. Klaviyo flows convert, but pre-purchase questions die in a chat widget that nobody answers after 6pm.",
    },
    tools: [
      { name: "Pre-purchase chat agent in the cart", outcome: "Answers sizing, fit, shipping, returns, and discount-code questions in the cart with full SKU + policy context. Recovers carts that would otherwise abandon and lifts AOV on bundle/upsell suggestions." },
      { name: "Shopify / Gorgias / Klaviyo native order agent", outcome: "Resolves WISMO, processes returns + exchanges + refunds against your policy, and triggers the right Klaviyo flow — without a CX agent touching the ticket. Slashes tier-1 ticket volume 60-80%." },
      { name: "Multi-language voice + chat 24/7", outcome: "EN/ES/FR/DE/PT baseline. International shoppers get same-language answers at 3am, your overnight ticket queue empties itself, and your CSAT in non-English markets stops being the bottom of your dashboard." },
    ],
    caseStudy: "After we shipped the support agent for [Customer], a 9-figure DTC apparel brand, tier-1 ticket volume dropped [Y]% in 60 days and CSAT held at [Y]+ — letting them shrink the seasonal CX hire from [Y] heads to [Y].",
    cta: {
      primary: "Stop drowning in WISMO tickets. Book a 30-minute build call.",
      secondary: "Or see the agent live in our chat widget.",
    },
  },
  "/hospitality": {
    painPoint: {
      headline: "The phone rings during the dinner rush. Nobody catches it.",
      body: "Walk-ins are stacking, the host is in the weeds, the bartender is ringing in tabs, and the phone is on its fourth ring. That's a covered table for Saturday at 7 — gone. OTA fees are eating 15-20% of your room revenue but direct bookings drop because nobody answers the phone with your brand voice. Concierge questions from in-house guests interrupt the front desk every six minutes.",
    },
    tools: [
      { name: "Reservation + waitlist agent", outcome: "Picks up when the host is in the weeds. Books reservations into SevenRooms / Resy / OpenTable / Tock, manages the waitlist, sends 'your table is up' SMS, and protects you from no-shows with deposit logic on prime times." },
      { name: "Direct-booking + concierge agent for hotels", outcome: "Answers in your brand tone, handles parking + breakfast + check-in + amenity questions, and converts looker-callers into direct bookings via your PMS — pulling revenue back from OTAs at the moment of decision." },
      { name: "Multi-language guest comms", outcome: "EN/ES/FR/PT baseline with on-brand voice cloning. International guests get same-language answers, your front desk stops translating, and your TripAdvisor reviews about communication start improving." },
    ],
    caseStudy: "After we shipped the reservation + concierge agent for [Customer], a boutique 80-room property in Miami Beach, direct bookings climbed [Y]% in the first quarter (recovering an estimated $[Y]K from OTA commissions) and front-desk after-call work dropped [Y] hours per week.",
    cta: {
      primary: "Stop letting the dinner-rush phone ring out. Book a 30-minute build call.",
      secondary: "Or hear the agent answer our own line.",
    },
  },
  "/roofing": {
    painPoint: {
      headline: "Hail event Sunday night. By Tuesday your phones are unmanageable.",
      body: "Storm-chasers are already door-knocking your zip codes. Insurance-claim leads need to be called back inside the hour or they sign with someone else. Your sales reps are in the field, your office is one CSR who's drowning, and the inbound from your paid spend is hitting voicemail. Storm season is your year — and you can't afford a missed call.",
    },
    tools: [
      { name: "Storm-surge inbound agent", outcome: "Absorbs 10x call volume during storm events without a single missed call. Classifies insurance vs cash, captures damage description + photo upload via SMS, and books the inspection inside the same call." },
      { name: "AccuLynx / JobNimbus / Roofr native pipeline sync", outcome: "Creates the lead, attaches the intake notes, schedules the inspection on the right rep's calendar, and triggers the carrier-comms flow for insurance claims — all before your sales rep gets back from his current job." },
      { name: "Insurance-claim follow-up cadence", outcome: "Auto-runs the carrier-adjuster + supplement + completion-photo cadence over voice + SMS. Closes the gap between inspection and signed contract without a sales coordinator involved." },
    ],
    caseStudy: "After we shipped the storm-event agent for [Customer], a residential roofer in DFW, they captured [Y]% more inbound leads during their first major hail event post-launch and added an estimated $[Y]K in claim-funded contracts in the 30 days following.",
    cta: {
      primary: "Stop losing storm-week leads to voicemail. Book a 30-minute build call.",
      secondary: "Or call us live — same way your customers will.",
    },
  },
  "/solar": {
    painPoint: {
      headline: "Meta lead drops at 9pm. Your closer calls Monday morning. Lead is dead.",
      body: "You spend $200-$400 per lead on paid social. The best ones are time-sensitive — they just got their summer electric bill and they're shopping right now. By Monday they've already scheduled a site survey with the competitor who called them in 90 seconds. Your inside sales team is qualifying through a trickle of cold-feeling leads because the warm ones aged out over the weekend.",
    },
    tools: [
      { name: "Sub-60-second qualification agent", outcome: "Calls and texts inside 60 seconds of any inbound from Meta / Google / your site. Qualifies utility, average bill, roof orientation + shading, and homeownership in under three minutes — then books the site survey on the right rep's calendar." },
      { name: "Aurora / Enerflo / Solo native pipeline sync", outcome: "Pushes qualified leads with full intake into your existing system, including utility data and rough sizing — so your closer walks into the appointment with a real proposal already roughed in." },
      { name: "Long-cycle nurture for not-ready-now leads", outcome: "Most solar leads aren't ready today. The agent runs the 30/60/90-day SMS + voice nurture cadence so the lead converts when their next utility bill lands, instead of going dead in your CRM." },
    ],
    caseStudy: "After we shipped the speed-to-lead agent for [Customer], a residential solar installer running $[Y]K/mo in Meta spend, their lead-to-set rate climbed from [Y]% to [Y]% and cost-per-set dropped [Y]% within 60 days — the same paid spend now feeds twice the booked surveys.",
    cta: {
      primary: "Stop losing $300 leads to slow callbacks. Book a 30-minute build call.",
      secondary: "Or call our line — we'll qualify you the same way.",
    },
  },
};

type LaneOverlay = { tag: string; ctaPrimary: string; ctaSecondary: string };
const LANE_OVERLAY: Record<LaneId, LaneOverlay> = {
  startup: { tag: "Founder lane", ctaPrimary: "Apply for the founder lane", ctaSecondary: "Book a 30-min build call" },
  smb:     { tag: "Operator lane", ctaPrimary: "Start the build",            ctaSecondary: "Book a 15-min Zoom" },
  agency:  { tag: "Partner lane",  ctaPrimary: "Become a partner",           ctaSecondary: "Book a partnership call" },
  ops:     { tag: "Scale lane",    ctaPrimary: "Get a custom quote",         ctaSecondary: "Book an architecture call" },
};
const LANE_IDS: LaneId[] = ["startup","smb","agency","ops"];

/* ------------------------------------------------------------------ */
/* v40a: FAQPage JSON-LD per vertical — earns Google rich snippets    */
/* 5 industry-specific Q&As per top vertical (HVAC, Healthcare,       */
/* Real Estate, Legal, Roofing, Solar, E-commerce, Hospitality).       */
/* ------------------------------------------------------------------ */
type FAQ = { q: string; a: string };
const FAQ_BY_VERTICAL: Record<string, FAQ[]> = {
  "/hvac": [
    { q: "How much does an AI voice agent cost for an HVAC company?", a: "Our HVAC Operators plan is $799/mo with a $2,950 build fee. That includes after-hours emergency triage, dispatch sync with ServiceTitan or Housecall Pro, and 3,000 included minutes per month (about 5x what most 14-truck shops use). Custom multi-location builds run $1,499–$2,500/mo." },
    { q: "Can the agent handle emergency after-hours dispatch?", a: "Yes. The agent triages emergency vs routine inside the first 20 seconds using your pricing logic, captures address and system type, pages the on-call tech over SMS, and confirms ETA back to the caller within 60 seconds. PagerDuty escalation kicks in if the tech doesn't acknowledge in 4 minutes." },
    { q: "Does it integrate with ServiceTitan or Housecall Pro?", a: "Native integration with both, plus Jobber, FieldEdge, and Service Fusion. The agent reads tech availability in real time, books the dispatch directly into the schedule, and creates the work order with full customer history — no double-entry, no manual ticket creation." },
    { q: "How long does it take to train the agent on our pricing?", a: "14 days from kickoff to live traffic. Day 1 we scope your dispatch fees, after-hours premiums, and service area zip codes. Days 2–7 we build and tune. Days 8–10 sandbox testing with your team. Days 11–14 we shadow your existing intake, then cut over." },
    { q: "What if a customer asks something the agent doesn't know?", a: "The agent uses a strict 'I'll have a human follow up' fallback when it hits a question outside its scope, captures the question and customer details, and pages your CSR's Slack with the full context. Customer always gets a callback inside the SLA you set — usually under 30 minutes during business hours." },
  ],
  "/healthcare": [
    { q: "Is the agent HIPAA-compliant?", a: "Yes — for customers who sign a BAA with us. We are not a Covered Entity, we operate as a Business Associate. Our stack uses BAA-eligible vendors only: Twilio HIPAA SKU, Deepgram Enterprise, OpenAI Enterprise with Zero Data Retention or Anthropic Enterprise, ElevenLabs Enterprise, and Supabase with the HIPAA add-on. PHI is encrypted in transit and at rest, redacted before any analytics layer, and access-logged for 7 years." },
    { q: "Will it work with Athena, eClinicalWorks, or Epic?", a: "Yes. We have native integrations with Athena, eClinicalWorks, DrChrono, and any EHR with an open FHIR API including Epic. The agent reads provider schedules, books into the right panel based on payor mix and acuity, and verifies insurance eligibility against the payor before booking." },
    { q: "Can it triage urgent symptoms to a live nurse?", a: "Yes. We build escalation rules with your clinical lead — chest pain, suicidal ideation, severe bleeding, etc. — that immediately transfer the call to your on-call clinician with full context, or route directly to 911 instructions when criteria are met. You control the escalation thresholds." },
    { q: "How long does setup take for a multi-location practice?", a: "Typical timeline: 21 days for a single location, 35–45 days for a multi-location group. The longer timeline accounts for BAA negotiation, payor list configuration per location, and provider panel mapping. The agent goes live in shadow mode first, then full cutover." },
    { q: "What happens to no-shows and recall outreach?", a: "The agent runs the 24-hour confirm, 2-hour reminder, and same-day rebook flow over voice and SMS. Most clinics see no-show rates drop 30–50% in the first 60 days. Recall cadence is fully configurable — annual exams, 6-month cleanings, post-procedure follow-ups." },
  ],
  "/real-estate": [
    { q: "How fast does the agent respond to a Zillow or Realtor.com lead?", a: "Under 30 seconds, 24/7. We hook directly into your lead source webhooks (Zillow, Realtor.com, Facebook lead forms, your site) so the moment a lead drops, the agent calls and texts in parallel. Speed-to-lead under 5 minutes triples your contact rate vs the industry average of 4+ hours." },
    { q: "Does it integrate with Follow Up Boss or KvCORE?", a: "Native two-way sync with Follow Up Boss, KvCORE, Sierra Interactive, Boomtown, and CINC. Lead source, full conversation transcript, qualification answers, and booked showings all land in the right CRM stage automatically. No webhook duct-tape." },
    { q: "Can it qualify pre-approval before booking a showing?", a: "Yes. The agent asks pre-approval status, price range, and timeline as part of intake. If they're not pre-approved, the agent routes them to your lender partner or your team's qualification flow. If they are, it books the showing directly with your or your team's calendar." },
    { q: "What about long-cycle leads who aren't ready to buy yet?", a: "The agent runs the 30/60/90/180-day nurture cadence over voice and SMS automatically. Most leads aren't ready today — the agent keeps them warm so when they are, they call you, not the next agent who pitched them." },
    { q: "How much does it cost for a single agent vs a team?", a: "Single agent / solo: $499/mo + $1,950 build. Team (3–10 agents): $1,499/mo + $4,950 build with per-agent CRM routing. Brokerage tier with custom branding and per-team reporting: $2,500+/mo, scoped per office." },
  ],
  "/legal": [
    { q: "Can the agent run a conflict check before booking the intake?", a: "Yes. The agent queries your CMS (Clio, MyCase, PracticePanther, Lawmatics) against the caller's name and any opposing party they mention. Conflicts are flagged before the call ends; clean intakes route directly to the right attorney's calendar with a full intake summary attached." },
    { q: "How does it handle jurisdiction and practice-area filters?", a: "We configure the agent with your jurisdictions, practice areas, and matter-type rules during build. The agent qualifies the caller's location and matter, then either books with the right attorney or politely declines and refers — no partner time wasted on unqualified intakes." },
    { q: "Does it work with Clio, MyCase, or PracticePanther?", a: "Native integration with all three, plus Lawmatics for intake, DocuSign for engagement letters, and LawPay for retainer collection. The agent creates the contact, opens the matter, attaches the intake summary, and triggers the engagement-letter automation — all before the lead's coffee gets cold." },
    { q: "What about attorney-client privilege on the call?", a: "Recordings and transcripts are stored under your firm's tenant with role-based access control. We can configure attorney-only access on specific matter types. Per-call audit logs satisfy most state bar record-keeping requirements; we can also set automatic deletion after your retention period." },
    { q: "How much do firms typically spend on this?", a: "Solo and small firms: $799/mo + $2,950 build. Multi-attorney PI or family firms: $1,499/mo + $4,950 build with conflict-check integration. Most firms recover the cost inside the first month by stopping partners from answering intake calls." },
  ],
  "/roofing": [
    { q: "Can the agent handle storm-surge call volume without dropping calls?", a: "Yes. Our infrastructure auto-scales to 10x normal volume during named storm events. We've shipped agents that absorbed 800+ calls in a single hail-event afternoon without a missed call. Your CSRs handle the white-glove customers; the agent absorbs the surge." },
    { q: "Does it integrate with AccuLynx, JobNimbus, or Roofr?", a: "Native integration with all three, plus CompanyCam for damage photo capture and Hover for measurements. The agent books the inspection, captures damage description, and creates the job in your CRM with the right tags for insurance vs cash routing." },
    { q: "How does it qualify insurance vs cash repairs?", a: "First-line question after the damage description. Insurance claims get routed to your insurance specialist with claim status capture (filed, not filed, adjuster scheduled). Cash repairs get fast-tracked to your sales team with a pre-qualified inspection slot." },
    { q: "Can it capture damage details and photos before the inspection?", a: "Yes. The agent walks the homeowner through a structured damage description (areas affected, age of roof, leak status) and texts a photo upload link they can use from their phone before the truck rolls. Saves your inspector 15+ minutes per visit." },
    { q: "How long does setup take during peak storm season?", a: "We can ship an emergency build in 7 days if you're already in a named storm event. Standard timeline is 14 days from kickoff. Most roofers onboard us in spring before the season starts." },
  ],
  "/solar": [
    { q: "Can the agent qualify leads from Meta or Google ads?", a: "Yes. The agent qualifies utility provider, average monthly bill, roof orientation, and homeownership inside the first 90 seconds. Qualified leads book a site survey directly with your installer's calendar; unqualified leads get a polite decline and a referral to financing partners if appropriate." },
    { q: "Does it integrate with Aurora, Enerflo, or OpenSolar?", a: "Native integration with Aurora Solar, Enerflo, Solo, and OpenSolar. The agent passes utility, bill, and roof data into your design pipeline so your designers walk into a fully-scoped site survey with everything they need." },
    { q: "How does it handle the long sales cycle for solar?", a: "Solar has a 60–180 day average close cycle. The agent runs a structured nurture cadence: site survey confirmation, post-proposal check-in, financing follow-up, install scheduling reminders. Most installers see contact rate on warm leads stay above 70% across the cycle." },
    { q: "What's the typical cost for a solar installer?", a: "Single-location installers: $799/mo + $2,950 build. Multi-state installers with HubSpot or Salesforce integration: $1,499/mo + $4,950 build. EPC and larger consumer brands: $2,500+/mo, scoped per company." },
    { q: "Can it follow up if the call drops or the homeowner hangs up?", a: "Yes. Dropped or hung-up calls automatically trigger an SMS follow-up inside 60 seconds, a second SMS at 24 hours, and a third call attempt at 48 hours. Most solar leads are intercepted by competitors who didn't follow up — this is the highest-leverage feature for the vertical." },
  ],
  "/ecommerce": [
    { q: "How much does an AI chat agent cost for a Shopify store?", a: "Our DTC plan starts at $499/mo + $2,950 build. That covers the on-site chat widget, SMS, and WhatsApp under one shared brain, plus native Shopify, Klaviyo, and Gorgias integrations. Volume above 15,000 chats/mo moves to the $1,499/mo Operators+ tier." },
    { q: "Will it cut WISMO (where is my order) tickets?", a: "Yes — typically 60–80% reduction in tier-1 ticket volume within 60 days. The agent resolves WISMO, processes refunds and exchanges against your policy, and triggers the right Klaviyo flow, all without a CX agent touching the ticket. Real escalations get human attention faster because tier-1 isn't clogging the queue." },
    { q: "Does it work with Gorgias, Zendesk, or Klaviyo?", a: "Native integration with Gorgias, Zendesk, Klaviyo, Recharge, and ShipStation. Conversations and resolutions sync back to your helpdesk; subscription changes hit Recharge directly; abandoned-cart and post-purchase flows trigger the right Klaviyo journey based on the conversation outcome." },
    { q: "What languages does it support out of the box?", a: "English, Spanish, French, German, and Portuguese in baseline. The agent auto-detects language on first message and stays in that language. Additional languages (Italian, Dutch, Japanese) available on Operators+ tier." },
    { q: "Can it handle pre-purchase questions in the cart?", a: "Yes — this is where it pays for itself fastest. The agent answers sizing, fit, shipping windows, return policy, and discount-code questions in the cart with full SKU and policy context. Most stores see AOV lift 5–12% from the upsell and recovery surface area." },
  ],
  "/hospitality": [
    { q: "Can the agent answer the phone during the dinner rush?", a: "Yes — that's exactly the use case. When your host is in the weeds, the agent picks up, books reservations into SevenRooms / Resy / OpenTable / Tock, manages the waitlist, and sends 'your table is up' SMS messages. The host stays focused on the guest standing in front of them." },
    { q: "Does it integrate with SevenRooms, Resy, or OpenTable?", a: "Native two-way integration with SevenRooms, Resy, OpenTable, Tock, and Toast. Live availability, table-hold logic, deposit collection on prime times, and full guest history (last visit, preferences, special occasions) all sync automatically." },
    { q: "Can it handle direct hotel bookings instead of OTA fees?", a: "Yes. The agent answers concierge questions (parking, breakfast, check-in, late checkout) in your brand tone, then converts the looker into a direct booking via your PMS (Cloudbeds, Mews, Opera Cloud). Most boutique properties recover 8–15% of OTA-bound revenue this way." },
    { q: "What languages does the agent speak for international guests?", a: "English, Spanish, French, and Portuguese in baseline. Voice cloning means each language sounds like the same brand person, not five different voices. Additional languages on Operators+ tier — most properties add Mandarin and German." },
    { q: "How does it handle no-shows and cancellation policies?", a: "Configurable per restaurant. The agent enforces your deposit and cancellation policy at booking time, runs a 24-hour confirm + 2-hour reminder cadence, and automatically rebooks the table from the waitlist if the guest cancels inside the window." },
  ],
};

// v76-D: /legal is now the legal-document index; the legal-services vertical
// lives at /legal-services. We normalize so the V map keyed on /legal still
// resolves, and the schema/canonical use the public path.
const normalizeVerticalPath = (p: string): string =>
  p === "/legal-services" ? "/legal" : p;

const VerticalPage = () => {
  const location = useLocation();
  const verticalKey = normalizeVerticalPath(location.pathname);
  const config = V[verticalKey] || V["/solutions"];
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lane, setLane] = useState<LaneId | null>(null);
  const [trIdx, setTrIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("tya:pathway");
      if (saved && LANE_IDS.includes(saved as LaneId)) setLane(saved as LaneId);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    const title = `${config.label} — AI agents that work — TrainYourAgent`;
    document.title = title;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    const setProp = (p: string, c: string) => {
      let el = document.querySelector(`meta[property='${p}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", p); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", config.sub);
    // v79: complete Open Graph + Twitter card so social shares to a
    // vertical hub (/hvac, /healthcare, etc.) render a brand-correct
    // preview card instead of falling back to the site-default homepage
    // OG image. Was the biggest social-share polish gap on the site.
    const _rawPath = (typeof window !== "undefined" ? window.location.pathname : "/").replace(/\/$/, "") || "/";
    const _pageUrl = `https://trainyouragent.com${_rawPath}`;
    const _ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent(`${config.label} AI agents`)}&eyebrow=${encodeURIComponent(`INDUSTRY · ${config.label.toUpperCase()}`)}&kicker=${encodeURIComponent("Voice + chat · CRM-wired · 21-day ship")}&type=vertical`;
    setProp("og:title", title);
    setProp("og:description", config.sub);
    setProp("og:url", _pageUrl);
    setProp("og:type", "website");
    setProp("og:image", _ogImage);
    setProp("og:image:width", "1200");
    setProp("og:image:height", "630");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", config.sub);
    setMeta("twitter:image", _ogImage);

    // v33a: Service + FAQPage schema for vertical hubs.
    const schemaId = "tya-schema-vertical";
    document.getElementById(schemaId)?.remove();
    const rawSlug = (typeof window !== "undefined" ? window.location.pathname : "/").replace(/\/$/, "") || "/";
    const slug = normalizeVerticalPath(rawSlug);
    const url = `https://trainyouragent.com${rawSlug}`;
    const s = document.createElement("script");
    s.id = schemaId;
    s.type = "application/ld+json";
    const verticalFaqs = FAQ_BY_VERTICAL[slug] || [];
    const graph: Record<string, unknown>[] = [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        serviceType: `${config.label} AI Voice Agent`,
        name: `${config.label} AI agents`,
        description: config.sub,
        provider: { "@id": "https://trainyouragent.com/#org" },
        areaServed: { "@type": "Country", name: "United States" },
        offers: {
          "@type": "Offer",
          url: "https://trainyouragent.com/pricing",
          priceCurrency: "USD",
          price: "799",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://trainyouragent.com" },
          { "@type": "ListItem", position: 2, name: "Industries", item: "https://trainyouragent.com/solutions" },
          { "@type": "ListItem", position: 3, name: config.label, item: url },
        ],
      },
    ];
    // v40a: per-vertical FAQPage for rich snippet eligibility
    if (verticalFaqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: verticalFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
    document.head.appendChild(s);
    return () => { document.getElementById(schemaId)?.remove(); };
  }, [config]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setTrIdx(0);
    const id = setInterval(() => setTrIdx((i) => (i + 1) % (config.transcript.length + 4)), 2200);
    return () => clearInterval(id);
  }, [config]);

  const overlay = lane ? LANE_OVERLAY[lane] : null;
  const visibleTranscript = useMemo(() => config.transcript.slice(0, Math.min(trIdx, config.transcript.length)), [config, trIdx]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* NAV — canonical service nav */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="industries" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {overlay && (
        <div className="bg-[#042C53] text-white text-center text-[12px] sm:text-[13px] py-2 px-4 fixed top-[60px] left-0 right-0 z-40">
          You're viewing this through the <span className="font-semibold text-[#9CC4EC]">{overlay.tag}</span>. Copy and CTAs adapted.
          <button onClick={() => { setLane(null); try { window.localStorage.removeItem("tya:pathway"); } catch {} }} className="ml-3 underline text-white/70 hover:text-white">Reset</button>
        </div>
      )}

      <section className={`px-5 sm:px-8 pb-16 ${overlay ? "pt-36" : "pt-32"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">{config.eyebrow}</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            {config.headline1} <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>{config.headline2}</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">{config.sub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">{overlay ? overlay.ctaPrimary : "Book a build call"} →</a>
            {/* v81: replaced "Book a 15-min Zoom" duplicate-cal CTA with a
                direct link to /voice-demo — the in-browser live AI voice
                receptionist. Audit caught that every vertical landing page
                sent visitors to Cal.com with no path to actually hear the
                product. Now any SEO arrival can talk to the agent in one
                click without leaving the site. Falls back to Web Speech
                API + Groq, $0 per conversation. */}
            <Link to="/voice-demo" className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53] inline-flex items-center justify-center gap-2">
              <span className="relative inline-flex w-2 h-2" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Hear a live AI agent → 60 sec
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">What we build for {config.label}</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
              The version that <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually ships.</span>
            </h2>
            <ul className="space-y-3 text-[15px] text-slate-700">
              {config.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 bg-[#185FA5]" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" /> {config.pricePoint}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">Live sample · {config.label}</div>
              <div className="flex items-center gap-2 text-[11px] text-[#22A36C]"><span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Streaming</div>
            </div>
            <div className="space-y-3 min-h-[260px]">
              {visibleTranscript.map((line, i) => (
                <div key={i} className="text-[14px] leading-relaxed text-slate-800 animate-[fadein_0.4s_ease-out]">
                  <span className={`font-semibold ${line.startsWith("Agent") || line.startsWith("Driver") ? "text-[#185FA5]" : "text-[#042C53]"}`}>
                    {line.split(":")[0]}:
                  </span>{" "}{line.split(":").slice(1).join(":")}
                </div>
              ))}
              {visibleTranscript.length < config.transcript.length && (
                <div className="text-[13px] text-slate-400 italic flex items-center gap-2">
                  <span className="inline-block w-1 h-3 bg-slate-300 animate-pulse" /> Agent typing...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Integrations</div>
          <h2 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-6">
            Wires into the stack <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>you already pay for.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {config.integrations.map((i, k) => (
              <span key={k} className="px-4 py-2 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] font-medium">{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* v34: vertical-aware AgentSimulator — only mounts for slugs we have scenarios for */}
      {(() => {
        const slug = verticalKey.replace(/^\//, "");
        if (!VERTICAL_SCENARIOS[slug]) return null;
        return (
          <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
            <div className="max-w-5xl mx-auto">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Try it yourself</div>
              <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
                Three real {config.label.toLowerCase()} calls. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Type one. Watch the agent answer.</span>
              </h2>
              <AgentSimulator vertical={slug} />
            </div>
          </section>
        );
      })()}

      {/* v89: missed-call ROI calculator — vertical-specific defaults.
          Visitor self-quantifies revenue loss → primary conversion lever
          on every vertical landing page. */}
      <MissedCallROI
        vertical={
          (["hvac","roofing","dental","legal","real-estate","plumbing"] as const).includes(
            (config.label.toLowerCase().replace(" ", "-") as any)
          )
            ? (config.label.toLowerCase().replace(" ", "-") as any)
            : "default"
        }
      />

      {/* v89: tech stack credibility for vertical SEO arrivals. */}
      <PoweredByBadges variant="grid" eyebrow={`THE STACK YOUR ${config.label.toUpperCase()} AGENT RUNS ON`} />

      {/* Rich per-niche block — only renders for slugs present in VERTICAL_CONTENT */}
      {VERTICAL_CONTENT[verticalKey] && (() => {
        const rc = VERTICAL_CONTENT[verticalKey];
        return (
          <>
            {/* Pain point */}
            <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
              <div className="max-w-5xl mx-auto">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">
                  In your language
                </div>
                <h2 className="text-[28px] sm:text-[44px] leading-[1.1] tracking-tight font-semibold mb-5">
                  {rc.painPoint.headline}
                </h2>
                <p className="text-[17px] text-white/85 leading-relaxed max-w-3xl">
                  {rc.painPoint.body}
                </p>
              </div>
            </section>

            {/* Tools we ship */}
            <section className="px-5 sm:px-8 py-20">
              <div className="max-w-6xl mx-auto">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
                  What we ship for {config.label}
                </div>
                <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">
                  Three tools.{" "}
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                    Built for the work you actually do.
                  </span>
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {rc.tools.map((t, i) => (
                    <div key={i} className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] transition">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">
                        Tool 0{i + 1}
                      </div>
                      <div className="text-[18px] font-semibold text-[#042C53] mb-3 leading-snug">
                        {t.name}
                      </div>
                      <div className="text-[14px] text-slate-700 leading-relaxed">
                        {t.outcome}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* v46a: WallOfLove now ships honest early-days commitments,
                not fake per-vertical testimonials. Vertical prop is kept
                for the day real quotes land. */}
            <WallOfLove
              vertical={config.label}
              eyebrow="Why operators give us a shot"
              title="We're early. Here's what we promise instead."
              background="white"
            />

            {/* Case study placeholder */}
            <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
              <div className="max-w-4xl mx-auto">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
                  Case in point
                </div>
                <blockquote
                  className="text-[22px] sm:text-[30px] leading-[1.3] tracking-tight text-[#042C53] font-medium"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                >
                  "{rc.caseStudy}"
                </blockquote>
                <div className="mt-5 text-[12px] text-slate-600 tracking-[0.12em] uppercase">
                  Production deployment · {config.label}
                </div>
              </div>
            </section>

            {/* Vertical-specific CTA */}
            <section className="px-5 sm:px-8 py-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-[28px] sm:text-[40px] leading-[1.15] tracking-tight font-semibold text-[#042C53]">
                  {rc.cta.primary}
                </h2>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={CAL_URL}
                    target="_blank"
                    rel="noopener"
                    className="px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15"
                  >
                    Book a 30-min build call →
                  </a>
                  <a
                    href={HERO_PHONE_TEL} target="_blank" rel="noopener"
                    className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]"
                  >
                    {rc.cta.secondary}
                  </a>
                </div>
              </div>
            </section>
          </>
        );
      })()}

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">What we hear most</div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            The doubts <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>we answer on every call.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { h: "AI sounds robotic and customers hate it.", b: "Not in 2026. Top-tier voice models with prosody tuning sound human. Most callers don't realize." },
              { h: "It can't handle our edge cases.",          b: "The agent handles the 80% confidently and escalates the 20% to a named human — your senior staff, your on-call line." },
              { h: "I don't want to be locked in.",            b: "Month-to-month after the build. Your data, your agent config, your call history — you own all of it. Export with one click." },
              { h: "What about a bad call going viral?",       b: "Every call has a transcript and a quality score. Outlier behavior gets flagged before it gets repeated. Plus a deterministic fallback for the worst case." },
            ].map((o, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="text-[15px] font-semibold text-[#042C53] mb-2">"{o.h}"</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{o.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] sm:text-[56px] leading-[1.04] tracking-tight font-semibold">
            Ready for a {config.label} agent <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>that actually ships?</span>
          </h2>
          <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">Thirty-minute build call. You leave with a written plan and a price.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">{overlay ? overlay.ctaPrimary : "Book a build call"} →</a>
            <a href={HERO_PHONE_TEL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">{HERO_PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link to="/learn" className="hover:text-[#042C53]">Learn</Link>
            <Link to="/careers" className="hover:text-[#042C53]">Careers</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
            <Link to="/press" className="hover:text-[#042C53]">Press</Link>
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>

      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default VerticalPage;
