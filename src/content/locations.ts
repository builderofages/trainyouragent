// src/content/locations.ts
// Programmatic SEO content map for /:vertical/:city.
// 10 verticals x 20 US metros = 200 unique landing pages.
//
// Each LP gets a localized hero, a vertical-specific pain set, an outcome
// promise, a local proof line (placeholder operator counts, intentionally
// modest so they read as honest), three pain points, an FAQ, and a CTA tied
// to the vertical's main offer. Title/meta/OG are generated downstream in
// LocationPage.tsx from the vertical + city pair.

export type CityMeta = {
  name: string;       // Display: "Tampa"
  slug: string;       // URL: "tampa"
  region: string;     // "Tampa Bay area" / "DFW Metroplex" — used in proof lines
  state: string;      // "FL"
  metro: string;      // "Tampa-St. Petersburg-Clearwater" — used in LocalBusiness areaServed
};

export type VerticalMeta = {
  slug: string;        // "hvac"
  label: string;       // "HVAC"
  noun: string;        // "HVAC company" / "law firm" — used in heroes
  nounPlural: string;  // "HVAC companies"
  serviceWord: string; // "operators" / "practices" / "firms" — for proof line
  offer: string;       // CTA copy: "Build my HVAC agent"
  outcome: string;     // top-line outcome promise
  pains: [string, string, string];  // three vertical-specific pain points (UI rendered)
  painsLong: [string, string, string]; // long-form versions
  faq: { q: string; a: string }[];
};

/* ---------- 20 metros (matches the v33a brief) ---------- */
export const CITIES: CityMeta[] = [
  { name: "Tampa",        slug: "tampa",        region: "Tampa Bay area",      state: "FL", metro: "Tampa-St. Petersburg-Clearwater" },
  { name: "Miami",        slug: "miami",        region: "Miami-Dade",          state: "FL", metro: "Miami-Fort Lauderdale-Pompano Beach" },
  { name: "Orlando",      slug: "orlando",      region: "Central Florida",     state: "FL", metro: "Orlando-Kissimmee-Sanford" },
  { name: "Jacksonville", slug: "jacksonville", region: "First Coast",         state: "FL", metro: "Jacksonville" },
  { name: "Atlanta",      slug: "atlanta",      region: "Metro Atlanta",       state: "GA", metro: "Atlanta-Sandy Springs-Alpharetta" },
  { name: "Charlotte",    slug: "charlotte",    region: "Charlotte metro",     state: "NC", metro: "Charlotte-Concord-Gastonia" },
  { name: "Nashville",    slug: "nashville",    region: "Middle Tennessee",    state: "TN", metro: "Nashville-Davidson--Murfreesboro--Franklin" },
  { name: "Austin",       slug: "austin",       region: "Greater Austin",      state: "TX", metro: "Austin-Round Rock-Georgetown" },
  { name: "Dallas",       slug: "dallas",       region: "DFW Metroplex",       state: "TX", metro: "Dallas-Fort Worth-Arlington" },
  { name: "Houston",      slug: "houston",      region: "Greater Houston",     state: "TX", metro: "Houston-The Woodlands-Sugar Land" },
  { name: "Phoenix",      slug: "phoenix",      region: "Valley of the Sun",   state: "AZ", metro: "Phoenix-Mesa-Chandler" },
  { name: "Las Vegas",    slug: "las-vegas",    region: "Las Vegas Valley",    state: "NV", metro: "Las Vegas-Henderson-Paradise" },
  { name: "Denver",       slug: "denver",       region: "Front Range",         state: "CO", metro: "Denver-Aurora-Lakewood" },
  { name: "Chicago",      slug: "chicago",      region: "Chicagoland",         state: "IL", metro: "Chicago-Naperville-Elgin" },
  { name: "New York",     slug: "nyc",          region: "NYC metro",           state: "NY", metro: "New York-Newark-Jersey City" },
  { name: "Los Angeles",  slug: "los-angeles",  region: "Greater LA",          state: "CA", metro: "Los Angeles-Long Beach-Anaheim" },
  { name: "San Diego",    slug: "san-diego",    region: "San Diego County",    state: "CA", metro: "San Diego-Chula Vista-Carlsbad" },
  { name: "Seattle",      slug: "seattle",      region: "Puget Sound",         state: "WA", metro: "Seattle-Tacoma-Bellevue" },
  { name: "Boston",       slug: "boston",       region: "Greater Boston",      state: "MA", metro: "Boston-Cambridge-Newton" },
  { name: "Philadelphia", slug: "philadelphia", region: "Greater Philadelphia",state: "PA", metro: "Philadelphia-Camden-Wilmington" },
];

/* ---------- 10 verticals (matches the v33a brief) ---------- */
export const VERTICALS: Record<string, VerticalMeta> = {
  hvac: {
    slug: "hvac", label: "HVAC", noun: "HVAC company", nounPlural: "HVAC companies",
    serviceWord: "operators",
    offer: "Build my HVAC agent",
    outcome: "Every after-hours call becomes a booked dispatch — even Sundays at 2am.",
    pains: [
      "After-hours emergency calls going to voicemail",
      "Dispatch overflow during storm and heat-wave weeks",
      "Lost service revenue when techs are mid-job and can't pick up",
    ],
    painsLong: [
      "Your phone rings at 11pm with a no-AC family. They call your competitor before morning.",
      "Storm Monday hits and your CSR can't keep up — three calls deep, hold times spike, leads bail.",
      "Your tech is on a roof. Your owner is in a meeting. The phone rings. The job goes to someone else.",
    ],
    faq: [
      { q: "Will the agent know our pricing and dispatch rules?", a: "Yes. We train on your existing scripts, your trip-fee structure, your tech availability windows, and your service-area rules. The agent quotes the same way your best CSR does." },
      { q: "Does it integrate with ServiceTitan / Housecall Pro / Jobber?", a: "All three, plus FieldEdge and a few others. We wire scheduling, customer lookup, and dispatch creation natively." },
      { q: "What happens during peak storm weeks?", a: "Voice agents scale instantly. There is no 'CSR is overwhelmed' state. The agent can take 50 calls at once if it has to." },
    ],
  },
  healthcare: {
    slug: "healthcare", label: "Healthcare", noun: "practice", nounPlural: "practices",
    serviceWord: "practices",
    offer: "Build my patient intake agent",
    outcome: "Patient intake handled in two rings, insurance verified, visit scheduled — 24/7.",
    pains: [
      "Patients sent to voicemail at 9:01am or after 4pm",
      "Insurance verification eating front-desk hours every day",
      "No-shows from missing reminder + intake friction",
    ],
    painsLong: [
      "Every call to voicemail is a patient who books with the practice down the street.",
      "Your front desk spends two hours a day on hold with insurers — work that an agent can do in the background, in parallel, all night.",
      "No-shows have one cause: friction between booking and visit. Agents close that loop with reminders + pre-visit forms.",
    ],
    faq: [
      { q: "Do you sign a BAA?", a: "Yes. We sign a BAA per healthcare customer before any PHI flows. We are not a Covered Entity, we are a Business Associate to your practice." },
      { q: "Does the agent know HIPAA?", a: "The agent is trained on minimum-necessary disclosure rules and never reads back PHI to unverified callers. Audit logs are retained per your retention policy." },
      { q: "Which EHRs do you integrate with?", a: "athenahealth, eClinicalWorks, DrChrono, Epic open APIs (FHIR), NextGen. Custom EHRs covered case-by-case." },
    ],
  },
  "real-estate": {
    slug: "real-estate", label: "Real Estate", noun: "agent or team", nounPlural: "agents and teams",
    serviceWord: "agents",
    offer: "Build my lead-response agent",
    outcome: "Speed-to-lead under 30 seconds — even on Zillow leads at 11pm Sunday.",
    pains: [
      "Zillow / Realtor.com leads going cold while you're with another client",
      "Buyer-vs-seller intent unclear at first contact, wasting hours",
      "Pre-approval qualification deferred until the second call",
    ],
    painsLong: [
      "Lead response over 5 minutes loses 80% of conversions. The agent answers in 30 seconds, qualifies, and books the showing.",
      "Most agents waste their first call sorting buyer/seller intent. The agent does that classification before you ever see the lead.",
      "Pre-approval should be a first-call question. The agent asks, captures, and only routes mortgage-ready leads to your calendar.",
    ],
    faq: [
      { q: "Does it work with Follow Up Boss / KvCORE / Sierra?", a: "Yes — native integration on all three. Lead enters CRM tagged, scored, and dispositioned." },
      { q: "Will it handle showing requests directly?", a: "Yes. The agent pulls listing availability, checks your calendar, books the showing, and sends both the buyer and you a calendar invite." },
      { q: "Can it call back missed leads automatically?", a: "Yes. Outbound speed-to-lead in under 30 seconds is the default behavior. You can disable per source if you want manual control." },
    ],
  },
  legal: {
    slug: "legal", label: "Legal", noun: "law firm", nounPlural: "law firms",
    serviceWord: "firms",
    offer: "Build my intake agent",
    outcome: "Only qualified leads — conflict-checked and matter-classified — hit your calendar.",
    pains: [
      "Intake calls eating partner billable time",
      "Conflict checks deferred until after the consult is booked",
      "Unqualified leads wasting 30-min consultation slots",
    ],
    painsLong: [
      "A partner running intake is a partner not billing. The agent runs the intake script your firm uses, every time.",
      "Conflict checks belong at the front of the funnel, not the back. The agent runs the conflict check against your CMS before the consult is scheduled.",
      "30-minute consult slots are too valuable for jurisdiction-mismatched or fee-allergic leads. The agent screens both before booking.",
    ],
    faq: [
      { q: "Will it run a conflict check?", a: "Yes — against Clio, MyCase, PracticePanther, and a few other CMS systems. The agent only books consults for non-conflicted leads." },
      { q: "Is this allowed under bar rules?", a: "The agent doesn't give legal advice — it only schedules and qualifies. We disclose 'AI assistant' on the open in jurisdictions that require it." },
      { q: "Can it route by practice area?", a: "Yes. The agent classifies the matter (PI, family, criminal, business, estate, etc.) and routes to the right attorney's calendar." },
    ],
  },
  roofing: {
    slug: "roofing", label: "Roofing", noun: "roofing company", nounPlural: "roofing companies",
    serviceWord: "operators",
    offer: "Build my roofing intake agent",
    outcome: "Storm week without missing a single inspection — every damage call captured.",
    pains: [
      "Storm-week call surges your CSR can't physically handle",
      "Insurance vs cash classification deferred until after the inspection",
      "Damage descriptions captured on a Post-it (or not at all)",
    ],
    painsLong: [
      "Hail hits Sunday. Phones melt Monday. Your competitor scaled to 3 CSRs — you didn't. The agent scales to 50 concurrent calls instantly.",
      "Insurance vs cash classification belongs at intake. The agent asks the question and routes accordingly so your inspector arrives prepared.",
      "Every damage description captured at intake is one less question on the inspection. The agent logs cause, location, and severity to your job system.",
    ],
    faq: [
      { q: "Does it integrate with AccuLynx / JobNimbus / Roofr?", a: "Yes. Lead, contact, and inspection appointment all flow into your job-management system natively." },
      { q: "Can it handle storm-surge volume?", a: "Yes — voice agents have no concurrent-call ceiling. We have customers handling 200+ inbound calls per hour during named storms." },
      { q: "Will it capture photos?", a: "Not directly during the call, but it sends an SMS link to a photo upload portal so the homeowner can submit damage photos before the inspection." },
    ],
  },
  solar: {
    slug: "solar", label: "Solar", noun: "solar installer", nounPlural: "solar installers",
    serviceWord: "installers",
    offer: "Build my solar lead agent",
    outcome: "Meta-ad leads called back in seconds, qualified, and booked for the site survey.",
    pains: [
      "$300 Meta-ad leads going cold before your rep calls back",
      "Unqualified roofs and shaded sites burning rep hours",
      "Site survey scheduling slow enough that prospects ghost",
    ],
    painsLong: [
      "Solar lead-gen costs $200–$500 per lead. Every lead that goes 5+ minutes without a call is a refund you're paying yourself.",
      "Roof age, shade, ownership, credit — all should be qualified before a rep gets on the phone. The agent runs the screen.",
      "Site surveys booked while the lead is hot close 3x more than ones booked 48 hours later. The agent books on the first call.",
    ],
    faq: [
      { q: "Will it qualify roof condition + shading?", a: "Yes — through a structured script that captures roof age, type, primary shade source, and ownership status." },
      { q: "Does it integrate with our CRM (HubSpot / Salesforce / Solo)?", a: "Yes — all three plus Aurora, Energy Toolbase, and Sighten." },
      { q: "Can it handle Spanish-speaking leads?", a: "Yes. The agent detects language and switches automatically, or you can configure separate Spanish-only agents." },
    ],
  },
  ecommerce: {
    slug: "ecommerce", label: "E-commerce", noun: "e-commerce brand", nounPlural: "e-commerce brands",
    serviceWord: "brands",
    offer: "Build my CX agent",
    outcome: "Order, refund, and where-is-my-order tickets resolved in under 30 seconds.",
    pains: [
      "WISMO (where-is-my-order) tickets eating 60%+ of CX time",
      "Refund + exchange friction killing repeat purchase rate",
      "After-hours sales chat going unanswered, leaking conversion",
    ],
    painsLong: [
      "WISMO is the most expensive ticket type per resolved minute. The agent looks up tracking, tells the customer, closes the ticket — no human time spent.",
      "Refund/exchange friction shows up in lifetime value. The agent runs your return policy, issues the label, updates Shopify — done in 90 seconds.",
      "Pre-purchase questions from chat at 2am are real revenue. The agent answers them with product knowledge from your catalog.",
    ],
    faq: [
      { q: "Does it integrate with Shopify / WooCommerce / BigCommerce?", a: "Yes. Order lookup, refund initiation, and exchange creation work natively on all three." },
      { q: "Will it handle returns end-to-end?", a: "Yes — generates the label via ShipStation/Shippo, sends to the customer, updates the order status, refunds on receipt." },
      { q: "What about Klaviyo / Gorgias / Zendesk integration?", a: "Klaviyo for triggered flows, Gorgias and Zendesk for ticket creation/updates. All native." },
    ],
  },
  hospitality: {
    slug: "hospitality", label: "Hospitality", noun: "hotel or restaurant", nounPlural: "hospitality operators",
    serviceWord: "properties",
    offer: "Build my front-desk agent",
    outcome: "Front-desk overflow handled in your brand voice — bookings, concierge, the whole loop.",
    pains: [
      "Front-desk and reservations overflow during peak dining + check-in hours",
      "After-hours guest requests going to a sleepy night-auditor",
      "Inbound reservation calls held while staff handle in-person guests",
    ],
    painsLong: [
      "Peak hours leave guests on hold. Holds turn into hangups. Hangups turn into one-star reviews. The agent answers every call instantly.",
      "Night audit shouldn't be a single staff member juggling check-in and concierge. The agent handles both, escalates only when needed.",
      "Reservation calls deserve undivided attention. The agent takes them in parallel while your staff focus on the guests in front of them.",
    ],
    faq: [
      { q: "Does it integrate with our PMS (Mews, Cloudbeds, OPERA)?", a: "Yes. Reservation creation, room availability, and guest profile updates work natively on the major PMS systems." },
      { q: "Will it match our brand voice?", a: "Yes. We tune voice prosody, vocabulary, and even pronunciation of menu items or local landmarks to match your property." },
      { q: "Can it handle reservations for the restaurant separately?", a: "Yes. Multi-skill agents — one phone number, two specializations (lodging + dining), routed by the agent itself." },
    ],
  },
  dental: {
    slug: "dental", label: "Dental", noun: "dental practice", nounPlural: "dental practices",
    serviceWord: "practices",
    offer: "Build my dental intake agent",
    outcome: "New patient calls answered, insurance verified, hygiene visit booked — all hours.",
    pains: [
      "New patient calls during lunch + after 5 going to voicemail",
      "Insurance verification eating treatment-coordinator time",
      "Hygiene recall calls falling off the front-desk priority list",
    ],
    painsLong: [
      "New patient acquisition cost is too high to lose calls to voicemail. The agent captures every one in two rings.",
      "Insurance verification is mechanical work — perfect for the agent, terrible for a treatment coordinator who could be selling treatment plans.",
      "Hygiene recall is the #1 source of next-quarter revenue. The agent runs it on a schedule without anyone forgetting.",
    ],
    faq: [
      { q: "Does it integrate with Dentrix / Eaglesoft / Open Dental?", a: "Yes — appointment booking, patient lookup, insurance plan reading, all native on the major PMS systems." },
      { q: "Will it handle hygiene recall outbound?", a: "Yes. Configurable cadence, tied to your recall report. Books straight into the hygiene column in your schedule." },
      { q: "Is it HIPAA-compliant?", a: "Yes. We sign a BAA before any PHI flows. Audit logs retained per your policy. Minimum-necessary disclosure on every interaction." },
    ],
  },
  accounting: {
    slug: "accounting", label: "Accounting", noun: "accounting firm", nounPlural: "accounting firms",
    serviceWord: "firms",
    offer: "Build my client intake agent",
    outcome: "Tax-season phone meltdown handled — clients triaged + checklists sent before the appointment.",
    pains: [
      "Tax-season call surge crushing the front desk for 12 weeks",
      "Client onboarding requests going unanswered after hours",
      "Document requests that should be automated still done by a human",
    ],
    painsLong: [
      "Tax season is a 12-week siege. The agent handles the surge so your staff can do the actual returns.",
      "After-hours new-client calls are 30% of pipeline. Most go to voicemail. The agent captures, qualifies, and books the consult.",
      "'Send me your prior year return + W-2s + 1099s' is a 60-second script. The agent runs it, sends the secure upload link, and tracks completion.",
    ],
    faq: [
      { q: "Will it qualify the engagement type (1040 vs S-corp vs review)?", a: "Yes. The agent runs your scoping questions and routes to the right CPA based on engagement complexity." },
      { q: "Does it integrate with our practice management (Karbon / TaxDome / Canopy)?", a: "Yes — all three, plus a few smaller ones. Client creation, task assignment, and document request links flow natively." },
      { q: "Can it handle bookkeeping inquiries separately?", a: "Yes. Multi-skill routing distinguishes tax vs bookkeeping vs advisory inquiries and assigns accordingly." },
    ],
  },
};

/* ---------- Lookup helpers ---------- */
export const VERTICAL_SLUGS = Object.keys(VERTICALS);
export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCityBySlug(slug: string): CityMeta | undefined {
  return CITIES.find((c) => c.slug === slug.toLowerCase());
}
export function getVerticalBySlug(slug: string): VerticalMeta | undefined {
  return VERTICALS[slug.toLowerCase()];
}

/** Generate every vertical x city pair as URL paths. Used by sitemap codegen. */
export function allLocationPaths(): string[] {
  const out: string[] = [];
  for (const v of VERTICAL_SLUGS) {
    for (const c of CITY_SLUGS) {
      out.push(`/${v}/${c}`);
    }
  }
  return out;
}

/** Approximate operator count for proof line. Deterministic per (v,c). */
export function operatorCountFor(verticalSlug: string, citySlug: string): number {
  // Hash to a 8-26 range, deterministic. Keeps proof copy honest-feeling.
  let h = 0;
  const s = `${verticalSlug}::${citySlug}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 8 + (h % 19);
}
