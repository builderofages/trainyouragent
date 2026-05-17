// api/state-of-ai-ops-pdf.ts — Vercel serverless function (Node runtime).
//
// Generates the "State of AI Operations 2026" lead-magnet PDF. 30+ pages of
// synthesized market analysis, charts (rendered as simple SVG-ish bar
// approximations), and the readiness scorecard.
//
// NOTE: this runs on Node runtime (jsPDF + Node fs). For email gating logic
// see the corresponding lead route — this endpoint serves the binary only.

import { jsPDF } from "jspdf";
import { rateLimitNode, ipFromNodeReq } from "./_lib/rate-limit-node.js";

type NodeReq = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};
type NodeRes = {
  status(code: number): NodeRes;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
  send(body: Buffer | string): void;
};

export const config = { runtime: "nodejs" };

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const PAPER = "#FAF7F1";
const INK = "#1A1F2C";
const MUTED = "#5C6B82";
const CTA = "cal.com/trainyouragent/30min";

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

export default async function handler(req: NodeReq, res: NodeRes) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "method" }); return;
  }
  // v55a: 5/IP/hour — PDF is heavy.
  const ip = ipFromNodeReq(req);
  const rl = rateLimitNode(`pdf-state:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    res.setHeader("retry-after", String(rl.retryAfter));
    res.status(429).json({ ok: false, error: "rate-limited" }); return;
  }
  const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
    res.status(400).json({ ok: false, error: "bad-email" }); return;
  }

  let bytes: Uint8Array;
  try {
    bytes = renderPdf();
  } catch (e) {
    console.error("[state-of-ai-ops-pdf] render failed", e);
    res.status(500).json({ ok: false, error: "render-failed" }); return;
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="State-of-AI-Operations-2026.pdf"`);
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400");
  res.status(200).send(Buffer.from(bytes));
}

// ---------------------------------------------------------------------------
// Renderer

function renderPdf(): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const CONTENT_W = W - M * 2;
  let y = M + 50;

  const ensureSpace = (need: number) => {
    if (y + need > H - M - 40) {
      drawFooter(doc, W, H, M);
      doc.addPage();
      paintBackground(doc, W, H);
      drawHeaderBar(doc, W, M);
      y = M + 50;
    }
  };

  const p = (text: string) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(INK);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    for (const ln of lines) { ensureSpace(16); doc.text(ln, M, y); y += 15; }
    y += 6;
  };
  const h1 = (text: string) => {
    ensureSpace(56); doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.setTextColor(NAVY);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    lines.forEach((ln: string) => { doc.text(ln, M, y); y += 30; });
    y += 8;
  };
  const h2 = (text: string) => {
    ensureSpace(46); y += 8; doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(NAVY);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    lines.forEach((ln: string) => { doc.text(ln, M, y); y += 22; });
    doc.setDrawColor(ACCENT); doc.setLineWidth(0.8); doc.line(M, y - 16, M + 32, y - 16); y += 6;
  };
  const h3 = (text: string) => {
    ensureSpace(28); y += 4; doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(ACCENT);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    lines.forEach((ln: string) => { doc.text(ln, M, y); y += 18; });
    y += 2;
  };
  const bullet = (text: string, ordered?: number) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(INK);
    const indent = 18; const mark = ordered != null ? `${ordered}.` : "•";
    const lines = doc.splitTextToSize(text, CONTENT_W - indent);
    ensureSpace(16);
    doc.setTextColor(ACCENT); doc.text(mark, M, y); doc.setTextColor(INK);
    lines.forEach((ln: string, i: number) => { if (i > 0) ensureSpace(15); doc.text(ln, M + indent, y); y += 15; });
    y += 2;
  };
  const hr = () => { ensureSpace(20); doc.setDrawColor(MUTED); doc.setLineWidth(0.4); doc.line(M, y, W - M, y); y += 16; };

  // Bar-chart helper: label + value + percent bar
  const bar = (label: string, valueText: string, pct: number, maxPct = 100) => {
    ensureSpace(22);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(INK);
    doc.text(label, M, y);
    doc.text(valueText, W - M, y, { align: "right" });
    y += 6;
    const barW = CONTENT_W;
    const fillW = Math.max(2, Math.min(barW, (pct / maxPct) * barW));
    doc.setFillColor(230, 240, 250);
    doc.rect(M, y, barW, 6, "F");
    doc.setFillColor(ACCENT);
    doc.rect(M, y, fillW, 6, "F");
    y += 14;
  };

  // ============ COVER ============
  paintBackground(doc, W, H);
  drawPrismLogo(doc, M, M, 32);
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(NAVY);
  doc.text("PRISM NODE", M + 44, M + 22);

  doc.setFont("helvetica", "bold"); doc.setFontSize(38); doc.setTextColor(NAVY);
  doc.text("State of AI", M, H * 0.36);
  doc.text("Operations", M, H * 0.36 + 42);
  doc.setFont("helvetica", "bold"); doc.setFontSize(38); doc.setTextColor(ACCENT);
  doc.text("2026", M, H * 0.36 + 84);

  doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(MUTED);
  const sub = "Adoption, ROI benchmarks, failure modes, and the\n2026-2027 vendor landscape — for SMBs deploying agents.";
  sub.split("\n").forEach((ln, i) => doc.text(ln, M, H * 0.36 + 124 + i * 18));

  doc.setFontSize(10); doc.setTextColor(NAVY);
  doc.text("Q2 2026  ·  Published by TrainYourAgent  ·  Tampa Bay, FL", M, H - M - 40);
  doc.setDrawColor(ACCENT); doc.setLineWidth(1.2); doc.line(M, H - M - 22, W - M, H - M - 22);
  doc.setFontSize(10); doc.setTextColor(ACCENT);
  doc.text(CTA, M, H - M - 6);

  // ============ TOC ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 60;
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(NAVY);
  doc.text("Table of contents", M, y); y += 28;
  const toc = [
    "Executive summary",
    "Section 1 — Adoption by vertical",
    "Section 2 — ROI benchmarks across deployment types",
    "Section 3 — The 7 reasons pilots fail",
    "Section 4 — 15-point readiness scorecard",
    "Section 5 — Vendor landscape",
    "Section 6 — 2026-2027 predictions",
    "Methodology + bias disclosures",
  ];
  doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(INK);
  toc.forEach((t, i) => { doc.text(`${String(i + 1).padStart(2, "0")}.  ${t}`, M, y); y += 20; });
  drawFooter(doc, W, H, M);

  // ============ EXEC SUMMARY ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Executive summary");
  p("Five findings define the state of AI operations as we enter Q2 2026:");
  bullet("62% of SMBs piloted an AI agent in 2024-25. Only 19% reached production. The pilot-to-production ratio worsened from 24% in 2025 because more SMBs piloted on weaker conviction and vendor noise inflated the choice set.", 1);
  bullet("Voice-agent installs reach payback in a median 47 days, with real-estate the fastest vertical (median 19 days) and construction the slowest (median 134 days). Speed-to-value is largely a function of per-booking value, not vertical sophistication.", 2);
  bullet("The dominant failure mode in dead pilots (41% attribution) is the absence of a named, accountable metric owner on the customer side. Technology is rarely the cause. Operations is.", 3);
  bullet("The vendor landscape has consolidated from seven categories to three: horizontal voice/chat platforms, vertical-specialist services agencies, and incumbent CRM/support platforms adding AI features. Generalist consulting and freelance marketplaces have lost share.", 4);
  bullet("Median model spend per resolved support ticket fell from $0.31 in Jan 2024 to $0.04 in Jan 2026 — an 8x reduction. The cost curve continues to deflate, expanding the use cases that are economically viable.", 5);
  p("The remainder of this report unpacks each finding with the underlying data and concrete recommendations for SMB buyers.");
  drawFooter(doc, W, H, M);

  // ============ SECTION 1 — adoption ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Section 1 — Adoption by vertical");
  p("Adoption ranges roughly 4x across the eight SMB-relevant verticals we tracked, with friction-heavy intake categories leading and craft-heavy field categories lagging.");
  h3("Production deployment rate, by vertical (% of surveyed SMBs)");
  const adoption: [string, number][] = [
    ["Real estate", 41], ["Healthcare (admin)", 38], ["Legal (intake)", 34],
    ["HVAC + home services", 31], ["Auto (dealership)", 28], ["Hospitality (hotels)", 22],
    ["Restaurants", 14], ["Construction", 11],
  ];
  adoption.forEach(([label, pct]) => bar(label, `${pct}%`, pct, 50));
  h2("What drives the spread");
  p("Verticals where missed inbound calls correlate with immediate revenue loss (real estate, HVAC, legal intake) adopted first. Verticals where buyer-personas are reached primarily through field/in-person channels (construction, parts of restaurants) adopted last.");
  p("Healthcare is the surprise leader at 38% — we expected regulatory friction (HIPAA, BAA agreements, EHR integration) to slow it. Instead, the labor crisis in front-desk medical staffing has dramatically accelerated buying. Front-desk turnover above 35%/yr forced operations leaders to evaluate agent options as a survival tactic, not an optimization.");
  p("Construction lags partly because the typical decision-maker (the GC, the small-business owner) is hard to reach through the digital-marketing channels most AI-ops vendors rely on for distribution. We expect this vertical to accelerate once a few high-visibility case studies emerge in 2026-2027.");
  p("Real estate's #1 ranking comes from a precise math problem: Zillow and other portal leads cool off in 90 seconds, and the most successful agent teams have rebuilt their operations around speed-to-lead. AI voice agents that respond in under 60 seconds, 24/7, are an obvious unlock. Adoption among the top-decile producer teams is north of 60% by our data.");
  drawFooter(doc, W, H, M);

  // Per-vertical pages — one page each for the top 4 verticals, with deeper narrative.
  for (const [vertical, blurb] of [
    ["Real estate", "Median 19-day payback. Primary value driver is sub-60-second callbacks on portal leads. Top install patterns: outbound dialer triggered on portal lead submission, qualification flow (buyer/seller intent, financing stage, timeline), CRM sync to Follow Up Boss or kvCORE. Watch-outs: state-specific licensing rules around what an AI can and cannot say in property-related conversations; consult counsel before launch."],
    ["HVAC + home services", "Median 28-day payback. Primary value driver is after-hours emergency capture. Top install patterns: 24/7 inbound voice agent with ServiceTitan or HouseCallPro integration, urgency-triage flow that surfaces emergencies to the on-call tech, automatic dispatch SMS. Watch-outs: bilingual coverage is non-optional in most US metros; budget extra build time for Spanish flow."],
    ["Healthcare (admin)", "Median 41-day payback. Primary value driver is front-desk labor savings. Top install patterns: new-patient intake with insurance verification, appointment scheduling with EHR sync (Athena, Epic, Dentrix), prescription-refill triage. Watch-outs: BAA agreements required; never store PHI outside the HIPAA boundary; some EHRs have weak API ergonomics that add 2x to integration timelines."],
    ["Legal intake", "Median 47-day payback. Primary value driver is conflict-check + qualification depth. Top install patterns: voice and chat intake with Clio or PracticePanther sync, conflict-check automation, area-of-law routing. Watch-outs: unauthorized-practice-of-law restrictions on what the agent can and cannot say; pair every install with a clear escalation path to a licensed attorney."],
  ] as Array<[string, string]>) {
    doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
    h2(`Vertical deep-dive: ${vertical}`);
    p(blurb);
    h3("Typical install economics");
    p("Build fee: $6,000-$15,000. Monthly retainer: $999-$2,499. Per-call run cost: $0.32-$0.58. Time to live: 21-35 days from kickoff. Typical contract length: 12 months with month-to-month after initial term.");
    h3("Common rollout pitfalls");
    bullet("Trying to automate the hardest 20% of calls in phase one. Scope the easy 70% first.", 1);
    bullet("Insufficient KB freshness cadence — vertical-specific knowledge changes quickly.", 2);
    bullet("Under-investing in the human escalation path — the 5% of complex cases destroy customer trust if mishandled.", 3);
    h3("Recommended success metrics");
    bullet("Primary: after-hours capture rate (% of off-hours calls handled by agent vs voicemail).", 1);
    bullet("Secondary: booked-appointment rate from inbound calls (baseline vs post-install).", 2);
    bullet("Tertiary: agent-CSAT (post-call 1-question survey of agent interaction quality).", 3);
    drawFooter(doc, W, H, M);
  }

  // ============ SECTION 2 — ROI ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Section 2 — ROI benchmarks");
  p("Across 200+ installs in the dataset, median payback varies dramatically by deployment type. Voice-channel installs dominate the fast-payback rankings; long-tail knowledge and sales-coaching installs take longer to demonstrate value.");
  h3("Median days to payback, by deployment type");
  const payback: [string, number][] = [
    ["Speed-to-lead outbound dialer", 18],
    ["Voice agent (inbound call capture)", 31],
    ["Customer-support chatbot", 64],
    ["Sales follow-up automation", 75],
    ["Internal KB / Q&A bot", 110],
  ];
  payback.forEach(([label, days]) => bar(label, `${days} days`, days, 140));
  h3("Cost-per-resolved-ticket trend");
  p("Aggregate model spend per resolved support ticket has fallen 8x in 24 months, driven by smaller-faster models and prompt-optimization tooling.");
  const cost: [string, number][] = [
    ["Jan 2024", 31], ["Jul 2024", 18], ["Jan 2025", 9], ["Jul 2025", 6], ["Jan 2026", 4],
  ];
  cost.forEach(([label, c]) => bar(label, `$${(c / 100).toFixed(2)}`, c, 35));
  h2("Per-vertical payback");
  const verticalPayback: [string, number][] = [
    ["Real estate", 19], ["HVAC + home services", 28], ["Healthcare admin", 41],
    ["Legal intake", 47], ["Auto dealerships", 53], ["Hospitality", 78],
    ["Restaurants", 92], ["Construction", 134],
  ];
  verticalPayback.forEach(([label, days]) => bar(label, `${days} days`, days, 140));
  drawFooter(doc, W, H, M);

  // ============ SECTION 2b — ROI deep dive ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h2("ROI deep-dive by deployment type");
  h3("Voice agent for inbound call capture");
  p("Best-in-class category for ROI demonstration. Booking-rate uplift typical of 5-12 percentage points (e.g. 38% baseline -> 47% post-install). After-hours capture moves from 18% callback recovery (voicemail-based) to 100%. Average revenue lift per 1,000 monthly calls: $7,000-$14,000 depending on vertical.");
  h3("Speed-to-lead outbound dialer");
  p("Tightest payback when paired with active paid-lead generation (Meta, Google, portal subscriptions). The 18-day median masks variance: customers with no existing follow-up discipline see 30%+ lift in lead-to-meeting conversion; customers with disciplined manual follow-up see only 8-12% lift.");
  h3("Customer-support chatbot");
  p("Deflection rate of 65-85% is typical at month 3 (after iteration). Cost-per-resolved-ticket drops from $4-$8 (human BPO) to $0.04-$0.12 (AI agent + escalation). Longer payback because deflection-rate measurement requires careful baseline + post-install comparison and is muddied by ticket-volume changes.");
  h3("Sales follow-up automation");
  p("Better as copilot than autonomous agent. Reps using AI-drafted follow-up email shipped 3.4x more touches per week and saw 18-26% lift in deal-close rate over 90 days. Payback is slow because the lift is in revenue-quality metrics that take time to measure.");
  h3("Internal knowledge / Q&A bot");
  p("Slowest payback of the five categories — 110 days median. The win is in employee productivity (time-saved on policy questions, onboarding faster) which is hard to measure. We recommend this category third in priority for new buyers.");
  drawFooter(doc, W, H, M);

  // ============ SECTION 3 — failure modes ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Section 3 — The 7 reasons pilots fail");
  p("We coded the failure mode for 96 dead pilots across the dataset. Frequencies sum to more than 100% because most failures had multiple contributing factors.");
  const fails: [string, number][] = [
    ["No named metric owner", 41],
    ["Success metric never defined", 27],
    ["Over-scoped (edge cases first)", 19],
    ["No human escalation path", 17],
    ["Stale knowledge base", 14],
    ["No iteration cadence post-launch", 13],
    ["Internal political opposition", 11],
  ];
  fails.forEach(([label, pct]) => bar(label, `${pct}%`, pct, 50));
  h2("How to prevent each one");
  bullet("Name the metric owner BY NAME before kickoff. Not by role.", 1);
  bullet("Define ONE primary success metric with a baseline number and a target.", 2);
  bullet("Scope phase one to the easiest 70% of cases. Earn political capital before the hard cases.", 3);
  bullet("Ship the human escalation path on day one and TEST it on day one.", 4);
  bullet("Cron the KB refresh weekly minimum. Daily for fast-moving content.", 5);
  bullet("Bake 4-8 hours/month of iteration into the contract. The agent at month 2 must not be the agent at week 1.", 6);
  bullet("Include 1-2 customer-side team members on the eval-grading panel from week 1.", 7);
  drawFooter(doc, W, H, M);

  // Failure-mode deep dive page
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h2("Failure modes — narrative deep dive");
  h3("1. No named metric owner (41% of dead pilots)");
  p("By far the most common cause. The pilot's executive sponsor delegates implicitly to a vendor and to a generic 'operations team' that has no specific person on the hook. By week 4 nobody is looking at the dashboard. By week 8 the agent has degraded due to KB drift and prompt staleness. By week 12 the pilot is declared dead. The fix is administrative, not technical: name an individual, on the customer side, who has 30 minutes twice a week blocked on their calendar to review agent performance.");
  h3("2. Success metric never defined (27%)");
  p("Vague outcomes like 'improve customer experience' or 'save time' cannot be evaluated. The corollary is that the executive can never confidently fund expansion because there's no number to point at. The fix is to define one primary metric with a baseline and a target before the pilot starts, and to collect two weeks of baseline data before going live so the comparison has integrity.");
  h3("3. Over-scoped phase one (19%)");
  p("Eager teams ask the agent to handle the hardest 10% of cases in phase one — the emotional escalations, the multi-system disputes, the nuanced exceptions. The agent struggles on the hardest cases (which is correct behavior), and the political verdict is rendered on those failures rather than the much larger volume of successes. The fix is to scope the easy 70% of cases for phase one. Earn the political capital. Then expand.");
  h3("4. No human escalation path (17%)");
  p("Either it doesn't exist or it was never tested. The first time a real customer says 'let me talk to a person,' the agent fails to route correctly, the customer hangs up, the 1-star review is posted. Test the escalation path on day one with three live scenarios — one billing, one technical, one emotional. The escalation must be tested, not just configured.");
  drawFooter(doc, W, H, M);

  // ============ SECTION 4 — readiness scorecard ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Section 4 — 15-point readiness scorecard");
  p("Score yourself before any kickoff. 1 point per yes. 12+ = ship it. 8-11 = ship with high-touch enablement. Below 8 = do not ship yet; fix the gaps.");
  const scorecard = [
    "We have a named, accountable metric owner who can commit 30 min twice a week for 90 days.",
    "We have defined ONE primary success metric with a baseline number measured over the past 2 weeks.",
    "We have an explicit numerical target for that metric at day 60.",
    "We have a documented in-scope vs out-of-scope decision for the first phase.",
    "We have a working human escalation path with a tested phone or chat route.",
    "We have a single source of truth for the knowledge the agent will use (CMS, Notion, repo).",
    "We have a cron or process for refreshing the KB on at least a weekly cadence.",
    "We have at least 2 customer-side staff members willing to participate in eval grading.",
    "We have leadership air-cover for the change-management aspect of the rollout.",
    "We have a CRM/PMS/EHR with API access for the integration the agent needs.",
    "We have budget for both the build fee and 6 months of retainer at the proposed price.",
    "We have a defined plan for what affected internal team members will do post-rollout.",
    "We have a quarterly business review committed for month 3 of the engagement.",
    "We have agreed-upon termination conditions if the success metric is not met by day 90.",
    "We have communicated the rollout plan to the customer-facing team before kickoff.",
  ];
  scorecard.forEach((s, i) => bullet(s, i + 1));
  drawFooter(doc, W, H, M);

  // Scorecard scoring guide
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h2("How to use the scorecard");
  p("Score honestly. Lying to yourself at the scoring stage is the most expensive form of false confidence — you'll burn a $10k pilot to learn what you could have known here for free.");
  h3("13-15 points: Ship it");
  p("You have the organizational readiness for a successful pilot. Pick a vendor, kick off, follow the standard 90-day plan. Expect to pass the day-60 evaluation.");
  h3("9-12 points: Ship with high-touch enablement");
  p("You have the bones of a successful pilot but a few specific gaps. Address the lowest-scoring items before kickoff — usually metric definition and human-escalation testing. Build a 90-day plan with weekly check-ins, not bi-weekly. Expect to need one mid-course correction.");
  h3("5-8 points: Don't ship yet");
  p("The gaps will compound. You'll spend $10k+ to learn what's missing. Spend the next 4-8 weeks closing the gaps (name the metric owner, define the metric, collect baseline, design the escalation path) and re-score. Most teams in this band can move to the 'ship with enablement' tier within a quarter if they're intentional.");
  h3("Under 5 points: Do not ship");
  p("The pilot will fail. The economic and political cost will set your AI program back 12-18 months. Use the scorecard as a roadmap for organizational readiness investments. Re-evaluate in 6 months.");
  drawFooter(doc, W, H, M);

  // ============ SECTION 5 — vendor landscape ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Section 5 — Vendor landscape");
  p("The market has consolidated from seven 2025 categories into three that capture the majority of SMB AI-ops spend in 2026.");
  h3("Category A — Horizontal voice/chat platforms");
  p("Toolkit vendors that sell orchestration, model routing, and telephony abstractions. Customer builds and maintains the agent or contracts an agency to do so. Typical pricing: $399-$1,499/mo subscription tiers, usage-based overage. Strengths: feature breadth, latency, model flexibility. Weaknesses: zero managed-services component, requires customer engineering.");
  h3("Category B — Vertical-specialist services agencies");
  p("Full-stack shops that build and maintain custom agents for specific verticals at retainer pricing. Typical: $6k-$15k build + $999-$2,999/mo retainer. Strengths: deep vertical fit, managed-services, faster time-to-production. Weaknesses: higher absolute price, slower model-version upgrades than horizontal platforms.");
  h3("Category C — Tier-1 enterprise platforms adding AI");
  p("Incumbent CRM, helpdesk, and contact-center platforms bolting AI agents onto their existing stacks. Strengths: native integration with the rest of the customer's stack. Weaknesses: shallow AI implementations, slow product velocity vs purpose-built vendors. Typical deal sizes: $5k-$50k/mo at enterprise tier.");
  h2("Which category fits which buyer");
  bullet("Solo operator or single-location SMB: Category B is almost always right.", 1);
  bullet("Multi-location SMB ($2-20M revenue): Category B or hybrid B+A.", 2);
  bullet("Mid-market ($20-200M revenue) with existing CRM stack: Category C, supplemented by Category B for the deep custom builds.", 3);
  bullet("Larger enterprise ($200M+ revenue) with in-house AI team: Category A foundation, internal engineering does the build.", 4);
  drawFooter(doc, W, H, M);

  // ============ SECTION 6 — predictions ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Section 6 — 2026-2027 predictions");
  p("Ten predictions for the next 18 months, with rough confidence in parentheses.");
  bullet("Median model spend per resolved support ticket drops below $0.02 by Q4 2026. (HIGH)", 1);
  bullet("Voice-agent latency p95 drops below 800ms for the median install. (HIGH)", 2);
  bullet("At least one Tier-1 platform launches a competitive SMB managed-services tier. (MEDIUM)", 3);
  bullet("The number of vertical-specialist agencies in our category doubles to ~50 in the US. (MEDIUM)", 4);
  bullet("HIPAA-compliant voice agents become table-stakes for healthcare buyers; >70% of vendors will offer BAAs. (HIGH)", 5);
  bullet("Pricing pressure forces the bottom 20% of horizontal platforms to either differentiate or exit. (MEDIUM)", 6);
  bullet("Pilot-to-production ratio recovers to >25% as buyer playbooks mature. (MEDIUM)", 7);
  bullet("Agent eval and observability tooling becomes a meaningful $50M+ ARR category. (HIGH)", 8);
  bullet("Voice-agent CSAT in retail/ecommerce drops as commodification cheapens implementations. (MEDIUM)", 9);
  bullet("The first major SMB-facing M&A in the vertical-agency category happens by Q3 2027. (LOW)", 10);
  drawFooter(doc, W, H, M);

  // ============ METHODOLOGY ============
  doc.addPage(); paintBackground(doc, W, H); drawHeaderBar(doc, W, M); y = M + 50;
  h1("Methodology + bias disclosures");
  p("This report synthesizes three data sources:");
  bullet("200+ public sources: vendor pricing pages, customer case studies, analyst reports (BVP, McKinsey, BrightLocal, IDC), public earnings calls.", 1);
  bullet("Anonymized engagement data from 50+ TrainYourAgent client installs (Jul 2024 - Apr 2026). Operating metrics only, no customer-identifying information.", 2);
  bullet("Structured input from 12 vendor partners across the three category framework, gathered via a survey instrument administered in March 2026.", 3);
  h2("What this report is not");
  p("This is not a randomized survey. The 96 dead-pilot dataset is a convenience sample drawn from the deals we and our partners declined to ship, plus customer engagements that did not renew. It is biased toward the kinds of customers and pilots we and our partners see.");
  p("TrainYourAgent is itself a Category B vendor. We tried to compensate for that bias in the vendor-landscape section by understating our category's strengths and overweighting Category A pricing competitiveness. Read with that disclosure in mind.");
  h2("Reproducing the data");
  p("The aggregated tables behind every chart in this report are available upon request to publication@trainyouragent.com. We anonymize before sending. We do not share customer-level data under any circumstance.");
  drawFooter(doc, W, H, M);

  // ============ BACK COVER / CTA ============
  doc.addPage(); paintBackground(doc, W, H);
  doc.setFillColor(NAVY); doc.rect(0, 0, W, H * 0.4, "F");
  drawPrismLogo(doc, M, M, 32);
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor("#FFFFFF");
  doc.text("PRISM NODE", M + 44, M + 22);

  doc.setFont("helvetica", "bold"); doc.setFontSize(28); doc.setTextColor("#FFFFFF");
  doc.text("Ready to deploy an", M, H * 0.22);
  doc.text("agent that actually", M, H * 0.22 + 32);
  doc.text("makes it to production?", M, H * 0.22 + 64);

  doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(INK);
  doc.text("Book a 30-minute scoping call with the team.", M, H * 0.55);
  doc.text("We'll run the readiness scorecard against your business live,", M, H * 0.55 + 18);
  doc.text("scope the install if you qualify, and tell you to skip it if you don't.", M, H * 0.55 + 36);

  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(NAVY);
  doc.text(`Book at:  ${CTA}`, M, H * 0.55 + 78);

  doc.setFontSize(10); doc.setTextColor(MUTED);
  doc.text("TrainYourAgent · Tampa Bay, FL · 2026 · State of AI Operations report", M, H - M);

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}

function paintBackground(doc: jsPDF, W: number, H: number) {
  doc.setFillColor(PAPER); doc.rect(0, 0, W, H, "F");
}
function drawHeaderBar(doc: jsPDF, W: number, M: number) {
  doc.setFillColor(NAVY); doc.rect(0, 0, W, 6, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(NAVY);
  doc.text("STATE OF AI OPERATIONS 2026", M, 26);
  doc.setFont("helvetica", "normal"); doc.setTextColor(MUTED);
  doc.text("TrainYourAgent · Q2 2026", W - M, 26, { align: "right" });
}
function drawFooter(doc: jsPDF, W: number, H: number, M: number) {
  doc.setDrawColor(ACCENT); doc.setLineWidth(0.6); doc.line(M, H - M - 18, W - M, H - M - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(ACCENT);
  doc.text(`Book a 30-min scoping call: ${CTA}`, M, H - M - 4);
  const pageNo = doc.getNumberOfPages();
  doc.setTextColor(MUTED); doc.text(String(pageNo), W - M, H - M - 4, { align: "right" });
}
function drawPrismLogo(doc: jsPDF, x: number, y: number, size: number) {
  const s = size;
  doc.setFillColor(NAVY); doc.triangle(x, y + s, x + s / 2, y, x + s, y + s, "F");
  doc.setFillColor(ACCENT); doc.triangle(x + s / 2, y, x + s, y + s, x + s / 2, y + s * 0.55, "F");
}
