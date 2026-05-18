// src/lib/caseStudies.ts — v67A
// JSON-driven case study registry. Empty today (we don't have a named
// customer yet) but the _example entry documents the schema and renders
// end-to-end so the template is verifiable in production before customer
// #1 lands.

export type BeforeAfterMetric = {
  metric: string;
  value: string;
};

export type DeltaMetric = {
  label: string;
  before: string;
  after: string;
  delta: string;
};

export type CaseStudy = {
  slug: string;
  customerName: string;
  customerTitle: string;
  companyName: string;
  niche: string;            // matches playbook slug when possible
  city: string;
  state: string;
  oneLineOutcome: string;
  closedDate: string;       // ISO date
  buildLengthDays: number;
  agentType: string;
  before: BeforeAfterMetric[];
  after: BeforeAfterMetric[];
  quote: string;
  metrics: DeltaMetric[];
  photoUrl?: string;
  logoUrl?: string;
  loomUrl?: string;
  technicalStack: string[];
  honestNote?: string;
  narrativeIntro?: string;
  narrativeBody?: string;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  _example: {
    slug: "_example",
    customerName: "Example Customer",
    customerTitle: "Owner",
    companyName: "Example HVAC Co.",
    niche: "hvac",
    city: "Tampa",
    state: "FL",
    oneLineOutcome:
      "Example outcome: a real customer's headline metric will replace this string the day they close.",
    closedDate: "2026-05-18",
    buildLengthDays: 21,
    agentType: "voice receptionist",
    before: [
      { metric: "After-hours pickup rate", value: "12%" },
      { metric: "Hours/wk on phones (owner)", value: "9 hrs" },
      { metric: "Booked appts/week from calls", value: "14" },
    ],
    after: [
      { metric: "After-hours pickup rate", value: "98%" },
      { metric: "Hours/wk on phones (owner)", value: "1 hr" },
      { metric: "Booked appts/week from calls", value: "29" },
    ],
    quote:
      "This is the template quote. The real one — verbatim, on the record — will replace this when customer #1 signs off on being named publicly.",
    metrics: [
      { label: "After-hours pickup", before: "12%", after: "98%", delta: "+86 pts" },
      { label: "Booked calls/week", before: "14", after: "29", delta: "+107%" },
      { label: "Owner phone time", before: "9 hrs", after: "1 hr", delta: "-89%" },
    ],
    photoUrl: undefined,
    logoUrl: undefined,
    loomUrl: "",
    technicalStack: [
      "ServiceTitan",
      "Twilio",
      "Anthropic Claude",
      "Cal.com",
      "Resend",
    ],
    honestNote:
      "This is a template entry, not a real customer. The day customer #1 agrees to be named, this record is deleted and replaced with their verified numbers.",
    narrativeIntro:
      "Paragraph one describes the customer's situation before we engaged: the operational pain, the failed alternatives they tried, and the cost of the status quo in time, money, and missed revenue.",
    narrativeBody:
      "Paragraph two describes what was actually built: the integrations stitched together, the rules the agent enforces, the human-in-the-loop handoffs, and the way it slotted into their existing dispatch / CRM / calendar without rip-and-replace.",
  },
};

export const CASE_STUDY_SLUGS: string[] = Object.keys(CASE_STUDIES);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}

export function listPublishedCaseStudies(): CaseStudy[] {
  // Hide _example from the public index — it's a template, not a real case.
  return Object.values(CASE_STUDIES).filter((c) => c.slug !== "_example");
}
