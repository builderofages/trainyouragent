// src/lib/verticals.ts — v47B
// 4 product verticals for the /local/{citySlug}/{verticalSlug} programmatic SEO layer.

export type Vertical = {
  slug: string;
  displayName: string;
  oneLine: string;
  buyerPersona: string;
  painPoint: string;
  outcomeMetric: string;
  pricingAnchor: string;
  whatsIncluded: [string, string, string];
};

export const VERTICALS: Vertical[] = [
  {
    slug: "voice-agents",
    displayName: "AI Voice Agents",
    oneLine: "Always-on phone agents that answer, qualify, and book.",
    buyerPersona: "owner-operators and ops leads at multi-line SMBs",
    painPoint: "missed calls and overflow that drag down booking rates after hours and during lunch",
    outcomeMetric: "cost per answered call",
    pricingAnchor: "$1,997/mo",
    whatsIncluded: [
      "Custom voice persona trained on your scripts and FAQs",
      "Live transfer to a human plus SMS handoff",
      "Full call recordings, transcripts, and CRM sync",
    ],
  },
  {
    slug: "chat-agents",
    displayName: "AI Chat Agents",
    oneLine: "Website chat that qualifies, answers, and routes leads in seconds.",
    buyerPersona: "marketing leads and revenue ops at lead-volume SMBs",
    painPoint: "slow speed-to-lead and tab-juggling reps that lose hot inbound to faster competitors",
    outcomeMetric: "leads qualified per session",
    pricingAnchor: "$1,997/mo",
    whatsIncluded: [
      "Embedded site widget with brand-matched look and feel",
      "Knowledge base trained on your docs, pricing, and policies",
      "Live human handoff plus Slack and email routing",
    ],
  },
  {
    slug: "ai-receptionist",
    displayName: "AI Receptionist",
    oneLine: "A full virtual front desk that picks up, screens, books, and notifies.",
    buyerPersona: "practice managers, GMs, and front-office leads",
    painPoint: "front-desk turnover and unpredictable call volume that keeps the phones ringing into voicemail",
    outcomeMetric: "appointments booked per week",
    pricingAnchor: "$1,997/mo",
    whatsIncluded: [
      "24/7 inbound coverage with calendar booking and confirmation",
      "Multi-line, multi-location routing with smart escalation",
      "Daily digest, end-of-shift summary, and ops dashboard",
    ],
  },
  {
    slug: "ai-sales-agent",
    displayName: "AI Sales Agent",
    oneLine: "Outbound voice and chat that qualifies, follows up, and books real meetings.",
    buyerPersona: "founders, sales leaders, and revops at pipeline-hungry SMBs",
    painPoint: "leads going cold because SDR coverage can't keep up with the top of funnel",
    outcomeMetric: "meetings booked per 100 dials",
    pricingAnchor: "$1,499/mo",
    whatsIncluded: [
      "Outbound voice and SMS sequences with consented contact lists",
      "Live objection handling and dynamic discovery scripts",
      "Direct calendar booking plus CRM activity logging",
    ],
  },
];

export const VERTICAL_BY_SLUG: Record<string, Vertical> = Object.fromEntries(VERTICALS.map((v) => [v.slug, v]));

export function getVertical(slug: string | undefined): Vertical | undefined {
  if (!slug) return undefined;
  return VERTICAL_BY_SLUG[slug];
}

// 10 FAQ pool per vertical. LocalPage picks 3 by hash(city+vertical).
export const FAQ_POOL: Record<string, { q: string; a: string }[]> = {
  "voice-agents": [
    { q: "How fast can you launch a voice agent for our business?", a: "Most SMB voice agents go live in 7-10 business days. Discovery is one call, build is a week, launch is a soft rollout where we keep humans in the loop until your transfer rate is clean." },
    { q: "Will it sound robotic to my customers?", a: "No. We use modern low-latency voice models tuned for natural cadence, and we re-record any line that doesn't land. Most callers can't tell on the first 30 seconds, which is what matters." },
    { q: "What happens when the agent can't answer something?", a: "It transfers to a real human on your team, with a one-line summary of what the caller already said, so the human never has to ask the same question twice." },
    { q: "Does it integrate with our CRM and calendar?", a: "Yes. We push to HubSpot, Salesforce, GoHighLevel, and most major CRMs, and we book directly into Google Calendar, Outlook, Cal.com, and Calendly." },
    { q: "Can it handle multiple locations on one phone tree?", a: "Yes. We route by what the caller says, not by IVR menus. Multi-location setups are the most common deployment we ship." },
    { q: "What does the call recording and transcript flow look like?", a: "Every call is recorded, transcribed, and dropped into your CRM and a shared dashboard. You get a daily digest email so the ops lead can spot patterns without listening to every call." },
    { q: "Is it HIPAA compliant if we're a healthcare practice?", a: "Yes. We sign a BAA, run on HIPAA-eligible infrastructure, and we lock down PHI in transcripts and storage. Walk through our compliance page for the details." },
    { q: "What if we need to change a script after launch?", a: "Script edits go live in under an hour. You either send us the change or use the self-serve editor in your dashboard. No engineering ticket required." },
    { q: "How are calls priced after the base monthly fee?", a: "We meter call minutes at cost-plus, and we publish the rate per minute in your contract. There are no usage spikes that surprise you at the end of the month." },
    { q: "Can the agent answer in Spanish or another language?", a: "Yes. We support English plus Spanish out of the box, and we can add additional languages on request. The agent detects the caller's language and switches automatically." },
  ],
  "chat-agents": [
    { q: "How long does it take to deploy a chat agent on our site?", a: "We get most chat agents live in 5-7 business days. We train on your existing pages, FAQs, and pricing, then embed a single script tag on your site." },
    { q: "Will it disrupt the visual design of our website?", a: "No. We match your brand colors, typography, and tone of voice. The widget feels like part of your site, not a third-party chatbot." },
    { q: "What happens when a visitor asks something the agent doesn't know?", a: "It hands off to a human on your team via Slack, email, or live chat, and it captures the lead so nothing falls through the cracks." },
    { q: "Can it qualify leads before they hit our calendar?", a: "Yes. We run discovery questions you define, score the lead, and either book directly into your calendar or route the hottest leads to your sales team for a human follow-up." },
    { q: "Does it work on mobile?", a: "Yes. The widget is fully responsive and we test it across iOS Safari, Chrome on Android, and the major in-app browsers used by Instagram and TikTok." },
    { q: "Can we see what visitors are asking?", a: "Yes. Every conversation is searchable, taggable, and exportable. The product team usually finds 3-5 net-new objections in the first 30 days of transcripts." },
    { q: "Does it integrate with HubSpot or Salesforce?", a: "Yes. We push qualified conversations as contacts or leads, and we attach the transcript as a note so your reps walk into the next call already briefed." },
    { q: "Will the agent make things up?", a: "No. It answers from your knowledge base, and when it doesn't know, it says so and offers a human handoff. We test for hallucination on every deploy." },
    { q: "How much does it cost beyond the base subscription?", a: "Most teams stay flat on the base. We meter only at extreme volume, and we publish the per-message rate in writing so there are no surprise invoices." },
    { q: "Can it handle multilingual visitors?", a: "Yes. English and Spanish are included, and we can add more on request. The agent auto-detects the visitor's language and replies in kind." },
  ],
  "ai-receptionist": [
    { q: "Can the AI receptionist book directly into our calendar?", a: "Yes. We connect to Google Calendar, Outlook, Cal.com, Calendly, and most practice-management systems. The agent confirms slots and sends reminders on its own." },
    { q: "What happens if a caller insists on a human?", a: "It transfers them, with the caller's name, reason for calling, and any details already collected, so the human picks up cold-start and never has to ask twice." },
    { q: "Does it work for multi-location businesses?", a: "Yes. We route by stated location, by ZIP code, or by service requested, and we keep a separate calendar and team routing per site." },
    { q: "How does after-hours coverage work?", a: "The agent answers, books appointments inside your business hours, and either schedules a callback or sends an SMS confirmation, so the first thing the team sees in the morning is a clean inbox." },
    { q: "What if our staff want to review every call?", a: "You get full recordings, transcripts, and a daily digest. Most managers spot-check the first 10 calls per week and then move to weekly summaries." },
    { q: "How long until we're live?", a: "Most receptionist deployments go live in 10-14 business days. We over-test before launch because the front desk is your first impression." },
    { q: "Can it screen out spam and robocalls?", a: "Yes. We filter known spam patterns and short-circuit obvious robocalls so they never reach your team or your transcripts." },
    { q: "How do we change scripts after launch?", a: "Edits go live in under an hour. Most teams change scripts as they learn what callers actually ask, and we don't gatekeep updates." },
    { q: "Is it HIPAA compliant?", a: "Yes. We sign a BAA, restrict PHI in transcripts, and run on HIPAA-eligible infrastructure. Practice managers vet us against their compliance officer's checklist." },
    { q: "How is it priced?", a: "Flat monthly base plus per-minute usage at cost-plus, published in your contract. No surprise overage charges." },
  ],
  "ai-sales-agent": [
    { q: "Is this a true outbound dialer or a fancy auto-responder?", a: "It's a true outbound voice agent. It places consented calls, runs discovery, handles objections, and books meetings directly. We are not a sequencing tool." },
    { q: "How do you handle consent and compliance?", a: "We require opt-in lists, we honor DNC, and we record state-by-state to satisfy two-party-consent rules. We never call cold-purchased lists." },
    { q: "How fast can it follow up on inbound leads?", a: "Under 60 seconds from form submit. Speed-to-lead is the biggest unlock for most pipelines, and the agent runs 24/7 so no lead waits until Monday morning." },
    { q: "Will it sound like a sales bot?", a: "No. The voice is conversational, the discovery is natural, and the agent listens, paraphrases, and adjusts. Most prospects don't realize until well into the call." },
    { q: "What if the prospect raises an objection we haven't seen before?", a: "It logs the objection, handles it with a fallback, and surfaces it in your dashboard so your team can add the right answer for next time." },
    { q: "Does it book directly or hand off to an SDR?", a: "Either. You choose. Most teams have the agent book directly for repeat-pattern conversations and hand off to a human for complex deals." },
    { q: "How does it know what to say about our product?", a: "We train on your pitch deck, your sales scripts, your battlecards, and your top objections. We rehearse before launch and rewrite anything that doesn't land." },
    { q: "Can it run multilingual outbound?", a: "Yes. English and Spanish are included, and we can add more on request. The agent auto-detects the prospect's language preference." },
    { q: "How is success measured?", a: "Meetings booked per 100 dials, plus held-meeting rate. We publish both in your dashboard and review them with you on a weekly call." },
    { q: "What is the ramp time to break-even?", a: "Most teams break even on the monthly base inside the first 30 days from booked meetings alone. We benchmark against the SDR you would have hired instead." },
  ],
};
