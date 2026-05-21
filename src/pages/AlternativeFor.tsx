// src/pages/AlternativeFor.tsx
// v40b: programmatic SEO route — /alternatives/:competitor-for-:vertical
// Targets long-tail "alternative to X for Y industry" searches.
// 5 competitors x 10 verticals = 50 unique LPs from one component.
//
// Route param: useParams returns "competitor" + "vertical" because the
// path was registered as /alternatives/:competitor-for-:vertical in App.tsx.
//
// Validates both segments against allowlists, builds content from templates,
// emits FAQPage JSON-LD per combo, and reuses brand tokens + SiteNav.

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { VERTICAL_CONTENT } from "@/pages/VerticalPage";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const SITE_URL = "https://trainyouragent.com";

/* ------------------------------------------------------------------ */
/*  Brand logo (matches the rest of the site)                          */
/* ------------------------------------------------------------------ */
function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
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

/* ------------------------------------------------------------------ */
/*  Allowlists — anything outside these = 404                          */
/* ------------------------------------------------------------------ */
export const ALT_COMPETITORS = {
  bland:     { name: "Bland.ai",   url: "https://www.bland.ai",   tag: "developer-first voice API" },
  synthflow: { name: "Synthflow",  url: "https://synthflow.ai",   tag: "no-code voice agent builder" },
  vapi:      { name: "Vapi",       url: "https://vapi.ai",        tag: "voice agent platform with builder UI" },
  retell:    { name: "Retell",     url: "https://retellai.com",   tag: "voice infra for developers" },
  airagent:  { name: "Air.ai",     url: "https://air.ai",         tag: "outbound AI sales agent platform" },
  // v68: capture the two largest "vs TYA" search buckets
  zapier:    { name: "Zapier",     url: "https://zapier.com",     tag: "generic workflow automation glue" },
  intercom:  { name: "Intercom",   url: "https://intercom.com",   tag: "enterprise chat platform for B2B SaaS support" },
  // v76-B: top-5-most-trafficked competitor pages refresh — add Drift +
  // Voiceflow as competitor-only landing pages with their own copy.
  drift:     { name: "Drift",      url: "https://www.drift.com",  tag: "conversational marketing chat platform (Salesloft-owned)" },
  voiceflow: { name: "Voiceflow",  url: "https://www.voiceflow.com", tag: "drag-and-drop AI agent builder" },
} as const;

export type AltCompetitorKey = keyof typeof ALT_COMPETITORS;

export const ALT_VERTICALS = {
  "hvac":        { label: "HVAC",        nounPlural: "HVAC companies",   verticalSlug: "/hvac" },
  "healthcare":  { label: "Healthcare",  nounPlural: "practices",        verticalSlug: "/healthcare" },
  "real-estate": { label: "Real Estate", nounPlural: "agents and teams", verticalSlug: "/real-estate" },
  "legal":       { label: "Legal",       nounPlural: "law firms",        verticalSlug: "/legal" },
  "roofing":     { label: "Roofing",     nounPlural: "roofing companies",verticalSlug: "/roofing" },
  "solar":       { label: "Solar",       nounPlural: "solar installers", verticalSlug: "/solar" },
  "ecommerce":   { label: "E-commerce",  nounPlural: "DTC brands",       verticalSlug: "/ecommerce" },
  "hospitality": { label: "Hospitality", nounPlural: "hospitality operators", verticalSlug: "/hospitality" },
  "accounting":  { label: "Accounting",  nounPlural: "CPAs and bookkeepers",  verticalSlug: "/accounting" },
  "automotive":  { label: "Automotive",  nounPlural: "dealers and service centers", verticalSlug: "/automotive" },
} as const;

export type AltVerticalKey = keyof typeof ALT_VERTICALS;

export const ALL_ALTERNATIVE_SLUGS: string[] = (() => {
  const out: string[] = [];
  for (const c of Object.keys(ALT_COMPETITORS) as AltCompetitorKey[]) {
    for (const v of Object.keys(ALT_VERTICALS) as AltVerticalKey[]) {
      out.push(`${c}-for-${v}`);
    }
  }
  return out;
})();

/* ------------------------------------------------------------------ */
/*  parseSlug — pull competitor + vertical out of the URL              */
/*                                                                    */
/*  Supports either:                                                  */
/*    /alternatives/:competitor-for-:vertical (react-router native)    */
/*    /alternatives/:slug   (slug parsed manually)                     */
/* ------------------------------------------------------------------ */
function parseSlug(
  slugFromRouter: string | undefined,
  competitorFromRouter: string | undefined,
  verticalFromRouter: string | undefined,
): { competitor: AltCompetitorKey | null; vertical: AltVerticalKey | null } {
  // Path A: competitor + vertical came in as separate params
  if (competitorFromRouter && verticalFromRouter) {
    const c = competitorFromRouter.toLowerCase() as AltCompetitorKey;
    const v = verticalFromRouter.toLowerCase() as AltVerticalKey;
    return {
      competitor: c in ALT_COMPETITORS ? c : null,
      vertical:   v in ALT_VERTICALS   ? v : null,
    };
  }
  // Path B: single slug — split on the first "-for-"
  if (slugFromRouter) {
    const lower = slugFromRouter.toLowerCase();
    const idx = lower.indexOf("-for-");
    if (idx > 0) {
      const c = lower.slice(0, idx) as AltCompetitorKey;
      const v = lower.slice(idx + "-for-".length) as AltVerticalKey;
      return {
        competitor: c in ALT_COMPETITORS ? c : null,
        vertical:   v in ALT_VERTICALS   ? v : null,
      };
    }
    // v68: competitor-only slug (e.g. /alternatives/zapier, /alternatives/intercom)
    const c = lower as AltCompetitorKey;
    if (c in ALT_COMPETITORS) {
      return { competitor: c, vertical: null };
    }
  }
  return { competitor: null, vertical: null };
}

/* ------------------------------------------------------------------ */
/*  Per-combo content builders                                         */
/* ------------------------------------------------------------------ */
function buildFaq(competitorName: string, verticalLabel: string, nounPlural: string) {
  return [
    {
      q: `Is TrainYourAgent really a ${competitorName} alternative for ${verticalLabel.toLowerCase()} businesses?`,
      a: `Yes. ${competitorName} is a great DIY platform — we're done-for-you. ${verticalLabel} operators come to us when they want a working agent shipped in 14 days with native integrations to the tools their team already uses, instead of a console they have to learn and configure themselves.`,
    },
    {
      q: `How does pricing compare for a ${verticalLabel.toLowerCase()} ${nounPlural.endsWith('s') ? 'business' : 'practice'}?`,
      a: `${competitorName} bills per-minute and you build the agent yourself. We bundle the build, the tuning, the integrations, and the runtime into $199–$999/mo depending on volume. For most ${verticalLabel.toLowerCase()} operators under ~4,000 minutes/month, our pricing comes out comparable or cheaper once you include the cost of building it on a DIY platform.`,
    },
    {
      q: `What integrations do you ship for ${verticalLabel.toLowerCase()}?`,
      a: `${verticalLabel}-specific integrations are wired Day 1 — ${verticalLabel === "HVAC" ? "ServiceTitan, Housecall Pro, Jobber" : verticalLabel === "Healthcare" ? "Athena, eClinicalWorks, DrChrono, Epic open APIs (plus BAA)" : verticalLabel === "Real Estate" ? "Follow Up Boss, KvCORE, Sierra Interactive, Boomtown" : verticalLabel === "Legal" ? "Clio, MyCase, PracticePanther" : verticalLabel === "Roofing" ? "AccuLynx, JobNimbus, Roofr, CompanyCam" : verticalLabel === "Solar" ? "Aurora Solar, Enerflo, Solo, OpenSolar" : verticalLabel === "E-commerce" ? "Shopify, Klaviyo, Gorgias, Zendesk, Recharge" : verticalLabel === "Hospitality" ? "SevenRooms, Resy, OpenTable, Cloudbeds, Mews" : verticalLabel === "Accounting" ? "Karbon, TaxDome, Canopy, QuickBooks" : "CDK, Reynolds, Dealertrack, Tekion"}. On ${competitorName} those would all be webhooks you wire yourself.`,
    },
    {
      q: `How long does it take to go live versus ${competitorName}?`,
      a: `14 days from kickoff to a live agent answering real calls. With ${competitorName}, time-to-live depends entirely on how much engineering time your team has to invest in the build. Most operators we talk to spent 4–8 weeks on a DIY platform before they came to us.`,
    },
  ];
}

function buildHeroParagraph(competitor: { name: string; tag: string }, verticalLabel: string, nounPlural: string) {
  return `${verticalLabel} ${nounPlural} pick ${competitor.name} because it's a ${competitor.tag} — and then most of them realize the platform is the easy part. The hard part is the integrations, the prompt tuning, the failure modes, and the ${verticalLabel.toLowerCase()}-specific edge cases. We ship the working agent in 14 days, tuned weekly by a real engineer, with your CRM and dispatch stack already wired. That's the alternative.`;
}

/* ------------------------------------------------------------------ */
/*  v68: COMPETITOR-ONLY content (no vertical attached)                */
/*  Used when slug is just a competitor name like /alternatives/zapier */
/* ------------------------------------------------------------------ */
type CompetitorOnlySection = { h: string; body: string };
type CompetitorOnlyContent = {
  hero: string;
  sections: CompetitorOnlySection[];
  faq: { q: string; a: string }[];
  // v76-B: link to the matching cornerstone playbook so visitors can see
  // exactly what TYA's offering looks like in production, not just how we
  // compare in the abstract.
  cornerstone?: { slug: string; label: string };
};

// v76-B: top-5 competitor-only pages refreshed with 2026-current pricing
// and a "where TrainYourAgent wins" cornerstone deep-link per spec.
//
// Pricing notes (all verified as of v76-B / 2026-05):
//   Zapier:    Free $0 · Pro $29.99/mo · Team $103.50/mo · Enterprise (call)
//              + per-task billing on Pro/Team tiers.
//   Intercom:  Essential $39/seat · Advanced $99/seat · Expert $139/seat ·
//              Fin AI ~$0.99/resolution.
//   Drift:     Premium $2,500/mo · Advanced $5,000/mo · Enterprise (custom).
//              Now owned by Salesloft; merger pushed pricing further upmarket.
//   Voiceflow: Sandbox Free · Pro $60/editor/mo · Teams $250/editor/mo ·
//              Enterprise (custom). Builder-only — you ship and host the agent.
//   Bland.ai:  $0.09/min on shared infra · $0.13/min on dedicated · Enterprise
//              (custom + monthly minimums). Developer-first voice API only —
//              you build the prompts, eval harness, and CRM glue yourself.
export const COMPETITOR_ONLY_CONTENT: Partial<Record<AltCompetitorKey, CompetitorOnlyContent>> = {
  zapier: {
    hero: "Zapier is generic glue — it wires SaaS tools to each other and waits for you to design every step. TrainYourAgent ships a vertical-specific AI agent that answers the phone, qualifies the lead, books the appointment, and writes back to your CRM in 21 days. Different category, different outcome.",
    cornerstone: { slug: "ops-copilot", label: "Ops Copilot — automation that decides at runtime" },
    sections: [
      {
        h: "Workflow automation vs vertical AI agents.",
        body: "Zapier is a horizontal automation platform: triggers, actions, paths, filters. It's powerful, but it assumes you already know the workflow and can decompose it into ~12 steps per Zap. TrainYourAgent isn't a workflow builder — it's a deployed AI agent built for one industry at a time (HVAC, healthcare, real estate, legal). The agent decides what to do at runtime based on the conversation, not based on a static if/then graph.",
      },
      {
        h: "Generic glue vs CRM-wired voice + chat.",
        body: "On Zapier you connect your CRM, your calendar, your dialer, your SMS — and then you build the logic. With TrainYourAgent the voice/chat agent ships pre-wired to ServiceTitan, Housecall Pro, Follow Up Boss, Clio, Athena, Shopify, and 40+ vertical-specific systems. Day 1 the agent can read a customer's history, book the right tech, and write the call summary back to the deal record.",
      },
      {
        h: "Design-every-step vs 21-day deploy.",
        body: "Zapier's cost is mostly your time: most teams spend 3–6 months building, debugging, and maintaining their Zap library. TrainYourAgent ships a complete production agent in 21 days, tuned weekly by a real engineer. No Zap maintenance, no broken authentications at 2am, no \"works for everything except the case that just came in.\"",
      },
    ],
    faq: [
      {
        q: "Can TrainYourAgent replace my Zapier workflows?",
        a: "For the customer-facing parts — yes. The voice agent handles inbound calls, the chat agent handles inbound web/SMS, and both write back to your CRM. For backoffice automation (e.g. \"when a new contact lands in HubSpot, add a row to Google Sheets\"), Zapier is still the right tool. Most customers keep both.",
      },
      {
        q: "How is pricing different in 2026?",
        a: "Zapier (2026): Free, Pro $29.99/mo, Team $103.50/mo, Enterprise custom — all metered by tasks-per-month on top of the seat fee. Teams running real workflow volume routinely hit $300–$2,000/mo just in Zapier task overage. TrainYourAgent: $799/mo all-in for the operator tier — the build, the integrations, the runtime, the weekly tuning, no per-task surprise bill at the end of the month.",
      },
      {
        q: "Do you offer a Zapier-style step builder?",
        a: "No — by design. We don't think \"design every step\" is the right product for service businesses. We think \"hire an agent that already knows your industry\" is the right product. If you want to build Zaps, use Zapier.",
      },
    ],
  },
  intercom: {
    hero: "Intercom is the enterprise chat platform for B2B SaaS support — Fin AI, Inbox, Help Center, Surveys, the works. TrainYourAgent is voice + chat AI for service-business inbound: HVAC, dental, law, real estate. Different ICP, different price point, different surface area.",
    cornerstone: { slug: "lead-qualification-agent", label: "Lead Qualification Agent — chat + voice in one brain" },
    sections: [
      {
        h: "Enterprise B2B SaaS support vs SMB service-business inbound.",
        body: "Intercom is built for product-led SaaS companies with thousands of support tickets per week. Their pricing reflects that ($39–$139/seat/mo, plus Fin AI usage at ~$0.99/resolution). TrainYourAgent is built for service businesses (HVAC, dental, legal, real estate, roofing) where the inbound is calls and leads — not support tickets — and the operator is a 5-50 person team that needs answers booked, not deflected.",
      },
      {
        h: "Chat-only vs voice + chat in one agent.",
        body: "Intercom is fundamentally a web/in-app messaging platform. Voice (Fin Voice) is a recent add-on and still seat-priced. TrainYourAgent ships voice and chat as one agent from Day 1 — the same brain answers the phone, the website chat, and the SMS. Customers don't have to repeat themselves across channels, and the agent has one unified conversation history per contact.",
      },
      {
        h: "$39-$139/seat/mo + Fin usage vs $799/mo all-in.",
        body: "Intercom (2026): Essential $39/seat, Advanced $99/seat, Expert $139/seat — plus Fin resolutions at ~$0.99 each. A 10-seat support org runs $15K-$30K/yr before Fin usage. TrainYourAgent: voice + chat agent from $799/mo all-in — the build, the integrations, the runtime, the weekly tuning. For a service business under ~3K conversations/mo, our pricing is roughly 5-10× cheaper than the equivalent Intercom + Fin setup.",
      },
    ],
    faq: [
      {
        q: "Is TrainYourAgent a real Intercom alternative?",
        a: "If you're a B2B SaaS company with a help center, a product, and 10K MRR worth of support tickets — no, stay on Intercom. If you're a service business (HVAC, dental, real estate, etc.) and you bought Intercom because someone told you you needed a chat widget — yes, we're the better fit at a tenth of the cost.",
      },
      {
        q: "Do you have a Help Center / ticket inbox / surveys?",
        a: "No — we don't try to replace Intercom's surface area. We ship voice + chat AI agents that answer, qualify, and book. If you need a help center, articles, NPS surveys, and a seat-based inbox for a support team, that's Intercom's territory and we won't try to compete there.",
      },
      {
        q: "How long does it take to switch?",
        a: "21 days from kickoff. We wire the voice agent to your phone number, the chat agent to your website, and both to your CRM. You keep Intercom running for whatever support workflows still need it (often none, for service businesses) and we cut over the inbound traffic.",
      },
    ],
  },
  drift: {
    hero: "Drift (now part of Salesloft) is conversational marketing for B2B revenue teams — chat playbooks, ABM routing, calendar drops. TrainYourAgent is voice + chat AI for SMB service businesses where the buyer wants to book, not nurture. Different motion, an order of magnitude different price point.",
    cornerstone: { slug: "intelligent-booking-agent", label: "Intelligent Booking Agent — qualify and drop a calendar link in one turn" },
    sections: [
      {
        h: "Salesloft-era enterprise pricing vs SMB-friendly all-in.",
        body: "Since the Salesloft acquisition, Drift's price ladder has moved further upmarket: Premium starts around $2,500/mo, Advanced around $5,000/mo, Enterprise is custom and typically lands $7K-$15K/mo for mid-market deployments. That math works for a $50M+ ARR B2B SaaS sales org. It doesn't work for a 5-person HVAC company that just wants the phone answered and the appointment booked.",
      },
      {
        h: "Marketing-team playbooks vs operator-grade booking + dispatch.",
        body: "Drift's surface area is built for marketing: playbooks, routing, ABM enrichment, meeting drops for SDRs. TrainYourAgent's surface area is built for operations: a voice + chat agent that knows your service area, your pricing tiers, your tech availability, your dispatch SLAs, and writes the booking back to ServiceTitan or Housecall Pro before the call ends. Same conversational-AI category, opposite end of the funnel.",
      },
      {
        h: "Voice as an afterthought vs voice + chat in one brain.",
        body: "Drift is web chat first; voice is a recent integration layer. TrainYourAgent's voice and chat run on the same brain — the agent that picks up your phone is the same agent answering the SMS reply two hours later, with full context. Drift's voice is mostly meeting reminders; ours actually qualifies, books, and reschedules.",
      },
    ],
    faq: [
      {
        q: "Is TrainYourAgent a real Drift alternative for a service business?",
        a: "Yes — and a much cheaper one. If you're an SMB service business that bought Drift because someone said you needed conversational marketing, you almost certainly bought 10× more product than you'll use. We give you the booking, the qualification, and the CRM write-back at ~10% of the loaded Drift cost.",
      },
      {
        q: "We're a B2B SaaS company with an SDR team — should we switch?",
        a: "Probably not. If your motion is high-ACV, multi-stakeholder, ABM-driven enterprise SaaS sales — Drift's playbook + Salesloft sequencing tooling is the right stack. We're built for service-business inbound and outbound (call, qualify, book), not for orchestrating a 12-week B2B sales cycle.",
      },
      {
        q: "How fast can we cut over?",
        a: "21 days. We wire the voice agent to your existing number, the chat to your site, and both to your CRM (HubSpot, Salesforce, ServiceTitan, Follow Up Boss, etc.). Drift keeps running until cutover day — no gap in coverage.",
      },
    ],
  },
  voiceflow: {
    hero: "Voiceflow is a drag-and-drop builder — you design every node, you host the agent, you maintain the model glue. TrainYourAgent is the opposite product: we train the agent on your business and ship it live in 21 days. You don't open a builder. You don't hire someone to learn one. You get the working agent.",
    cornerstone: { slug: "voice-receptionist", label: "Voice Receptionist — trained, deployed, supervised" },
    sections: [
      {
        h: "Build-your-own vs done-for-you.",
        body: "Voiceflow (2026): Sandbox Free, Pro $60/editor/mo, Teams $250/editor/mo, Enterprise custom. The platform itself is solid — it's the workload that costs you. Voiceflow assumes your team has someone who can design the conversation graph, write the prompts, set up the KB, wire the channels, run evals, and maintain it weekly. For most SMBs that's a 3-month internal project. TrainYourAgent is the alternative: we do all of that, ship in 21 days, and tune weekly.",
      },
      {
        h: "Drag-and-drop nodes vs trained-on-your-business agent.",
        body: "Voiceflow's product is a builder. TrainYourAgent's product is an outcome. We don't sell you a tool to design the agent — we sell you the trained, deployed, supervised agent itself. If your operator wants to be in a Voiceflow canvas every week, Voiceflow is the right product. If your operator wants the phone answered and the booking made, we are.",
      },
      {
        h: "Voiceflow + your team vs our team.",
        body: "On Voiceflow the per-seat editor cost is the smaller line item. The bigger one is the engineer or AI consultant time to use it — typically $5K-$20K to design, build, and tune the first agent, then 5-10 hours/week to maintain. TrainYourAgent rolls all of that into $799-$1,499/mo. No internal hire, no consultant retainer, no canvas maintenance.",
      },
    ],
    faq: [
      {
        q: "We already have a Voiceflow agent — can you take it over?",
        a: "Yes. Most clients we migrate from a builder platform spent 3-6 months getting to a half-working agent. We extract the parts of the KB and prompts worth keeping, fold them into our training pipeline, and replace the surface in 2-3 weeks. Faster than a build-from-scratch.",
      },
      {
        q: "Do you offer a builder UI like Voiceflow?",
        a: "No — by design. We've found that handing operators a builder is what causes agents to stagnate and decay. We keep the canvas internal, ship you the result, and own the weekly tuning. If you want to be in a canvas, stay on Voiceflow.",
      },
      {
        q: "How is total cost different?",
        a: "Voiceflow license: $60-$250/editor/mo. Realistic loaded cost to ship one production agent on Voiceflow with internal time: $8K-$15K build + 5-10 hrs/week ongoing. TrainYourAgent: $4,950 build + $799/mo all-in for the operator tier, zero internal headcount required. Comparable or cheaper, faster to live.",
      },
    ],
  },
  bland: {
    hero: "Bland.ai is a developer-first voice API — fast inference, low per-minute pricing ($0.09-$0.13/min), and a clean SDK. The catch: you build the prompts, the eval harness, the CRM glue, the failure modes, and the weekly tuning. TrainYourAgent ships the trained, integrated, supervised agent on top of comparable infrastructure in 21 days.",
    cornerstone: { slug: "voice-receptionist", label: "Voice Receptionist — the full stack, not just the API" },
    sections: [
      {
        h: "$0.09-$0.13/min vs $799/mo all-in.",
        body: "Bland.ai (2026): $0.09/min shared, $0.13/min dedicated, custom for enterprise with monthly minimums. The per-minute price is excellent — but it's only the cost of the inference. The real loaded cost on Bland is your engineer's time: prompt iteration, eval harness, integration to your CRM and calendar, failure-mode handling, weekly tuning. Most teams spend 4-8 weeks and 80-200 engineering hours getting to a production-ready agent on Bland. TrainYourAgent rolls that engineering into the $799/mo tier and ships in 21 days.",
      },
      {
        h: "Voice API vs trained business agent.",
        body: "Bland's product is the API surface: stable, low-latency, programmable. TrainYourAgent's product is what you build on top of an API surface: the discovery, the knowledge base, the persona tuning, the integration to ServiceTitan / Athena / Clio / Follow Up Boss, the weekly retraining loop. If you have an in-house AI engineer who wants to own all of that, Bland is the right pick. If you don't, you're paying for an API and getting a chatbot — and that's the gap we close.",
      },
      {
        h: "DIY platform vs done-for-you with optional hand-off.",
        body: "Bland is correct that the platform should be the smaller part of the cost — that's why their pricing is what it is. We agree. But for service businesses without an AI engineer on staff, the platform isn't the bottleneck — the build is. TrainYourAgent does the build, runs it for you, and (if you ever want to take it in-house) hands you the prompts, the eval set, and the integrations as part of the export. You can move to Bland later. Most don't.",
      },
    ],
    faq: [
      {
        q: "We have a developer — should we just use Bland directly?",
        a: "If your developer has time to own prompt iteration, eval harnesses, CRM integrations, weekly tuning, and 2am failover responses — yes, Bland is a strong pick at the per-minute price. If they have other things to ship, the loaded cost of doing it all on Bland will exceed our $799/mo within 3-4 months. We've onboarded several teams who started on Bland and switched after a quarter.",
      },
      {
        q: "What's the per-minute cost on TrainYourAgent?",
        a: "Operator tier: 4,000 minutes/mo included in the $799 base, then $0.18/min over. We run on Bland-class infrastructure under the hood (and on Vapi/Retell-class infra for builds that need it) — the markup over raw inference is the build, the integrations, the tuning, and the supervision.",
      },
      {
        q: "Can we migrate from Bland to you and keep our number?",
        a: "Yes. Number porting in 5 business days. We import your existing prompts and KB, retrain on the call transcripts you already have, and cut over on a date you choose. Most Bland → TrainYourAgent migrations are 14-21 days end-to-end.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
const AlternativeFor = () => {
  const params = useParams<{ slug?: string; competitor?: string; vertical?: string }>();
  const { competitor: cKey, vertical: vKey } = parseSlug(params.slug, params.competitor, params.vertical);
  const [navScrolled, setNavScrolled] = useState(false);

  const cMeta = cKey ? ALT_COMPETITORS[cKey] : null;
  const vMeta = vKey ? ALT_VERTICALS[vKey] : null;
  // v68: competitor-only mode (e.g. /alternatives/zapier)
  const competitorOnly = cMeta && !vMeta ? COMPETITOR_ONLY_CONTENT[cKey as AltCompetitorKey] ?? null : null;
  // Reuse VerticalPage's rich content map for "why {vertical} businesses choose us" bullets
  const richContent = vMeta ? VERTICAL_CONTENT[vMeta.verticalSlug] : null;

  const faq = useMemo(() => {
    if (!cMeta) return [];
    if (vMeta) return buildFaq(cMeta.name, vMeta.label, vMeta.nounPlural);
    if (competitorOnly) return competitorOnly.faq;
    return [];
  }, [cMeta, vMeta, competitorOnly]);

  useEffect(() => {
    if (typeof document === "undefined" || !cMeta) return;
    // Render path requires either a vertical OR a competitor-only content map.
    if (!vMeta && !competitorOnly) return;

    const title = vMeta
      ? `TrainYourAgent vs ${cMeta.name} for ${vMeta.label} businesses — alternative for ${vMeta.nounPlural}`
      : `TrainYourAgent vs ${cMeta.name} — the honest ${cMeta.name} alternative`;
    const desc = vMeta
      ? `Looking for a ${cMeta.name} alternative for your ${vMeta.label.toLowerCase()} business? TrainYourAgent ships a done-for-you AI agent in 14 days with native ${vMeta.label.toLowerCase()}-stack integrations. Honest comparison and pricing inside.`
      : `Looking for a ${cMeta.name} alternative? TrainYourAgent is a vertical-specific voice + chat AI agent — wired to your CRM, deployed in 21 days. Honest comparison and pricing inside.`;
    const url = vMeta
      ? `${SITE_URL}/alternatives/${cKey}-for-${vKey}`
      : `${SITE_URL}/alternatives/${cKey}`;

    document.title = title;

    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }

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

    setMeta("description", desc);
    setProp("og:title", title);
    setProp("og:description", desc);
    setProp("og:url", url);
    setProp("og:type", "website");
    setMeta("twitter:card", "summary_large_image");
    // v79: per-page OG image via /api/og dynamic renderer.
    const ogImage = vMeta
      ? `${SITE_URL}/api/og?title=${encodeURIComponent(`TrainYourAgent vs ${cMeta.name}`)}&eyebrow=${encodeURIComponent(`FOR ${vMeta.label.toUpperCase()}`)}&kicker=${encodeURIComponent("Honest alternative · 21-day ship · operator-led")}&type=alternative`
      : `${SITE_URL}/api/og?title=${encodeURIComponent(`The honest ${cMeta.name} alternative`)}&eyebrow=${encodeURIComponent("ALTERNATIVES · TRAINYOURAGENT")}&kicker=${encodeURIComponent("Vertical-specific · CRM-wired · 21-day ship")}&type=alternative`;
    setProp("og:image", ogImage);
    setProp("og:image:width", "1200");
    setProp("og:image:height", "630");
    setMeta("twitter:image", ogImage);
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = url;

    // FAQPage JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    let scriptEl = document.getElementById("alt-faq-jsonld") as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = "alt-faq-jsonld";
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      // Leave the JSON-LD in place; the next render will overwrite it.
    };
  }, [cMeta, vMeta, competitorOnly, cKey, vKey, faq]);

  useEffect(() => {
    const f = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  // 404 fallback
  // 404 fallback (v68): when slug is unknown, render the actual list of
  //                     valid alternative slugs so the page becomes a
  //                     discovery surface instead of a dead end.
  if (!cMeta || (!vMeta && !competitorOnly)) {
    const competitorSlugs = Object.keys(ALT_COMPETITORS) as AltCompetitorKey[];
    const requested = params.slug ?? `${params.competitor ?? ""}${params.vertical ? `-for-${params.vertical}` : ""}`;
    return (
      <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        <SiteNav active="comparisons" />
        <section className="pt-32 pb-12 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Page not found</div>
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#042C53] mb-4 tracking-tight">
              We don't have a page for <span className="font-mono text-[#185FA5]">{requested || "that"}</span> — yet.
            </h1>
            <p className="text-[15px] sm:text-[16px] text-slate-700 max-w-2xl mb-8 leading-relaxed">
              Here are the alternative pages we DO have. Pick the one that matches what you're shopping for, or book a call and we'll talk through your stack directly.
            </p>

            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mb-3">Compare us to a competitor</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {competitorSlugs.map((c) => (
                <Link
                  key={c}
                  to={`/alternatives/${c}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[13px] font-medium hover:bg-[#D6E7F6]"
                >
                  /alternatives/{c}
                </Link>
              ))}
            </div>

            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mb-3">Or by competitor + industry (50 pages)</h2>
            <div className="flex flex-wrap gap-2 mb-8 max-h-64 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
              {ALL_ALTERNATIVE_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  to={`/alternatives/${slug}`}
                  className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[12px] font-medium hover:text-[#185FA5] border border-slate-200"
                >
                  {slug}
                </Link>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link to="/comparisons" className="px-4 py-2 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[14px] font-medium">All comparisons</Link>
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[14px] font-medium">Book a call</a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // v68: competitor-only render path (e.g. /alternatives/zapier)
  if (competitorOnly && cMeta) {
    return (
      <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        <SiteNav active="comparisons" />

        {/* HERO */}
        <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/40 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              {cMeta.name} alternative
            </div>
            <h1
              className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold text-[#042C53] tracking-tight mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
            >
              TrainYourAgent vs {cMeta.name}.
            </h1>
            <p className="text-[17px] sm:text-[19px] leading-[1.55] text-slate-700 max-w-3xl mb-7">
              {competitorOnly.hero}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] shadow-sm"
              >
                Book a 30-min build call
              </a>
              <Link
                to="/comparisons"
                className="px-5 py-3 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[14px] font-medium hover:bg-[#D6E7F6]"
              >
                All comparisons
              </Link>
              <a
                href={cMeta.url}
                target="_blank"
                rel="noopener nofollow"
                className="px-5 py-3 rounded-full border border-slate-300 text-slate-700 text-[14px] font-medium hover:bg-slate-50"
              >
                Visit {cMeta.name} →
              </a>
            </div>
          </div>
        </section>

        {/* THREE SECTIONS */}
        <section className="py-14 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {competitorOnly.sections.map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-6 bg-white">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">0{i + 1}</div>
                <div className="text-[18px] font-semibold text-[#042C53] mb-3">{s.h}</div>
                <div className="text-[14px] leading-[1.6] text-slate-700">{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-5 sm:px-8 bg-[#E6F1FB]/40">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
            >
              Common questions about switching from {cMeta.name}.
            </h2>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <details key={i} className="rounded-xl bg-white border border-slate-200 px-5 py-4 group">
                  <summary className="cursor-pointer text-[15px] font-semibold text-[#042C53] list-none flex justify-between items-center">
                    <span>{f.q}</span>
                    <span className="text-[#185FA5] group-open:rotate-45 transition-transform text-[20px] leading-none">+</span>
                  </summary>
                  <div className="mt-3 text-[14px] leading-[1.6] text-slate-700">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* v76-B: matching cornerstone playbook link — visitor lands on
            the alternative page comparing TYA to a competitor, then has
            one click into "here's the production playbook that replaces
            what that competitor sells you." */}
        {competitorOnly.cornerstone && (
          <section className="py-12 px-5 sm:px-8 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-slate-200 p-6 sm:p-7 bg-gradient-to-br from-[#F6FAFE] to-white">
                <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#185FA5] font-mono mb-2">
                  Where TrainYourAgent wins
                </div>
                <div className="text-[20px] sm:text-[22px] font-semibold text-[#042C53] mb-2">
                  See the production playbook this competitor doesn't ship.
                </div>
                <p className="text-[14.5px] leading-[1.6] text-slate-700 mb-4">
                  Every {cMeta.name} alternative page links to the matching
                  cornerstone playbook so you can see exactly what we deploy
                  — not just how we compare on a feature grid.
                </p>
                <Link
                  to={`/capabilities/${competitorOnly.cornerstone.slug}`}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#042C53] hover:text-[#185FA5]"
                >
                  {competitorOnly.cornerstone.label} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
            >
              See it deployed for your business in 21 days.
            </h2>
            <p className="text-[15px] text-slate-600 mb-7 max-w-xl mx-auto">
              30 minutes. We map your inbound, your CRM, your stack. You leave with a build plan and a price — not a sales pitch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="inline-block px-7 py-3.5 rounded-full bg-[#042C53] text-white text-[15px] font-medium hover:bg-[#0A3D6E] shadow-sm"
              >
                Book a 30-min build call →
              </a>
              {/* v81: alternative pages compete with competitor demo pages.
                  Give visitors a way to actually HEAR our agent before
                  committing to a sales call. */}
              <Link
                to="/voice-demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#042C53]/20 text-[#042C53] text-[15px] font-medium hover:border-[#042C53]"
              >
                <span className="relative inline-flex w-2 h-2" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                Hear a live agent → 60 sec
              </Link>
            </div>
            <div className="mt-6 text-[12px] text-slate-500">
              <Link to="/comparisons" className="underline">All comparisons</Link>
              {" · "}
              <Link to="/pricing" className="underline">Pricing</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // vMeta guaranteed below this point
  if (!vMeta) return null;

  const heroPara = buildHeroParagraph(cMeta, vMeta.label, vMeta.nounPlural);
  // Pull 3 vertical bullets from VERTICAL_CONTENT.tools[].outcome (with fallback)
  const verticalBullets: string[] = richContent
    ? richContent.tools.slice(0, 3).map((t) => `${t.name} — ${t.outcome}`)
    : [
        `${vMeta.label}-specific agent flows trained on your scripts, your pricing, your escalation rules.`,
        `Native integrations to the tools ${vMeta.nounPlural} actually use — not generic webhooks.`,
        `Weekly tuning by a real engineer based on your real call transcripts.`,
      ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <SiteNav active="comparisons" />

      {/* ----------------------------------------------------------- */}
      {/*  HERO                                                       */}
      {/* ----------------------------------------------------------- */}
      <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/40 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            {cMeta.name} alternative · for {vMeta.label.toLowerCase()}
          </div>
          <h1
            className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold text-[#042C53] tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            TrainYourAgent vs {cMeta.name} for {vMeta.label} businesses.
          </h1>
          <p className="text-[17px] sm:text-[19px] leading-[1.55] text-slate-700 max-w-3xl mb-7">
            {heroPara}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] shadow-sm"
            >
              Book a 30-min build call
            </a>
            <Link
              to={vMeta.verticalSlug}
              className="px-5 py-3 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[14px] font-medium hover:bg-[#D6E7F6]"
            >
              See our {vMeta.label.toLowerCase()} agent
            </Link>
            <a
              href={cMeta.url}
              target="_blank"
              rel="noopener nofollow"
              className="px-5 py-3 rounded-full border border-slate-300 text-slate-700 text-[14px] font-medium hover:bg-slate-50"
            >
              Visit {cMeta.name} →
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  3-COL COMPARISON TABLE                                     */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-2 tracking-tight">
            Three ways a {vMeta.label.toLowerCase()} business can solve the phone problem.
          </h2>
          <p className="text-[15px] text-slate-600 mb-8 max-w-2xl">Pick the column that matches how your team actually wants to spend its time.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* US */}
            <div className="rounded-2xl p-6 bg-[#042C53] text-white">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#9BC3E8] font-semibold mb-2">Recommended</div>
              <div className="text-[18px] font-semibold mb-3">TrainYourAgent</div>
              <div className="text-[13px] text-[#C6DDF1] mb-4">Custom build · done-for-you · 14-day ship</div>
              <ul className="space-y-2 text-[13.5px] leading-[1.55] text-white/90">
                <li>• Agent built FOR your {vMeta.label.toLowerCase()} business</li>
                <li>• Native CRM + dispatch integrations on Day 1</li>
                <li>• Weekly tuning by a real engineer</li>
                <li>• $199–$999/mo all-in, no per-minute surprises</li>
                <li>• 14 days kickoff → live traffic</li>
              </ul>
            </div>
            {/* COMPETITOR */}
            <div className="rounded-2xl p-6 bg-white border border-slate-200">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">DIY platform</div>
              <div className="text-[18px] font-semibold text-[#042C53] mb-3">{cMeta.name}</div>
              <div className="text-[13px] text-slate-600 mb-4">{cMeta.tag}</div>
              <ul className="space-y-2 text-[13.5px] leading-[1.55] text-slate-700">
                <li>• You build, you maintain, you tune</li>
                <li>• Integrations are webhooks you wire yourself</li>
                <li>• Per-minute pricing — variable, hard to forecast</li>
                <li>• Support is community + docs</li>
                <li>• Time-to-live depends on your team's bandwidth</li>
              </ul>
            </div>
            {/* HIRING */}
            <div className="rounded-2xl p-6 bg-white border border-slate-200">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">Hiring</div>
              <div className="text-[18px] font-semibold text-[#042C53] mb-3">Full-time CSR / answering service</div>
              <div className="text-[13px] text-slate-600 mb-4">$3,500–$5,500/mo loaded cost per FTE</div>
              <ul className="space-y-2 text-[13.5px] leading-[1.55] text-slate-700">
                <li>• Single-threaded — one call at a time</li>
                <li>• Off at nights, weekends, holidays</li>
                <li>• Turnover, training cost, PTO, sick days</li>
                <li>• Doesn't scale on a storm / surge day</li>
                <li>• Won't integrate to your CRM</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  WHY {VERTICAL} BUSINESSES CHOOSE US                        */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8 bg-[#E6F1FB]/40">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            Why {vMeta.label.toLowerCase()} businesses choose us over {cMeta.name}.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {verticalBullets.map((bullet, i) => {
              const [name, ...rest] = bullet.split(" — ");
              const outcome = rest.join(" — ");
              return (
                <div key={i} className="rounded-2xl p-6 bg-white border border-slate-200">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">0{i + 1}</div>
                  <div className="text-[16px] font-semibold text-[#042C53] mb-2">{name}</div>
                  <div className="text-[14px] leading-[1.55] text-slate-700">{outcome || bullet}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  PRICING SNIPPET                                            */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-4 tracking-tight">
            What it costs.
          </h2>
          <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Starter</div>
                <div className="text-[24px] font-semibold text-[#042C53]">$199<span className="text-[14px] text-slate-500 font-normal">/mo</span></div>
                <div className="text-[13px] text-slate-600 mt-1">Single agent, &lt;1K min/mo, core integrations</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Operators</div>
                <div className="text-[24px] font-semibold text-[#042C53]">$499<span className="text-[14px] text-slate-500 font-normal">/mo</span></div>
                <div className="text-[13px] text-slate-600 mt-1">Full {vMeta.label.toLowerCase()} stack wired, 4K min, weekly tuning</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Scale</div>
                <div className="text-[24px] font-semibold text-[#042C53]">$999<span className="text-[14px] text-slate-500 font-normal">/mo</span></div>
                <div className="text-[13px] text-slate-600 mt-1">Multi-location, multi-agent, dedicated engineer</div>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-200 text-[13px] text-slate-600">
              No setup fee. Month-to-month. Build + run included — no separate per-minute add-on like {cMeta.name}.
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  FAQ                                                        */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8 bg-[#E6F1FB]/40">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            Common questions about switching from {cMeta.name}.
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details key={i} className="rounded-xl bg-white border border-slate-200 px-5 py-4 group">
                <summary className="cursor-pointer text-[15px] font-semibold text-[#042C53] list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-[#185FA5] group-open:rotate-45 transition-transform text-[20px] leading-none">+</span>
                </summary>
                <div className="mt-3 text-[14px] leading-[1.6] text-slate-700">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  CTA                                                        */}
      {/* ----------------------------------------------------------- */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            See it built for your {vMeta.label.toLowerCase()} business in 14 days.
          </h2>
          <p className="text-[15px] text-slate-600 mb-7 max-w-xl mx-auto">
            30 minutes. We map your stack, your call patterns, your escalation rules. You leave with a build plan and a price — not a sales pitch.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="inline-block px-7 py-3.5 rounded-full bg-[#042C53] text-white text-[15px] font-medium hover:bg-[#0A3D6E] shadow-sm"
          >
            Book a 30-min build call →
          </a>
          <div className="mt-6 text-[12px] text-slate-500">
            <Link to="/comparisons" className="underline">All comparisons</Link>
            {" · "}
            <Link to={`/vs/${cKey === "airagent" ? "air-ai" : cKey}`} className="underline">TrainYourAgent vs {cMeta.name}</Link>
            {" · "}
            <Link to={vMeta.verticalSlug} className="underline">{vMeta.label} home</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlternativeFor;
