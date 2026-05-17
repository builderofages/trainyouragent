// src/pages/tools/promptLibraryData.ts
// v44: 60 production prompts grouped by category.
// Real, usable, not placeholders.

export type Prompt = {
  id: string;
  title: string;
  useCase: string;
  category: "Sales" | "Ops" | "Marketing" | "Support";
  body: string;
};

export const PROMPTS: Prompt[] = [
  // ───────────────────── SALES (15) ─────────────────────
  {
    id: "s01",
    title: "Cold email v1",
    useCase: "First-touch cold email to a B2B buyer",
    category: "Sales",
    body: `You are an SDR writing the first cold email to {{persona}} at {{company}}.

Constraints:
- 90 words max, plain text, no markdown.
- Open with a specific observation about {{company}} pulled from {{insight}}.
- Tie that observation to one quantifiable pain we solve.
- Soft CTA: a 15-minute working session, propose two specific times next week.
- Sign off "—{{firstName}}".

Avoid: "I hope this finds you well", "quick question", "circling back", emojis, exclamation marks.

Output: the email body only.`,
  },
  {
    id: "s02",
    title: "Follow-up #3 (re-engage stalled)",
    useCase: "Reviving a stalled deal after no reply",
    category: "Sales",
    body: `Write a 70-word re-engagement email to {{firstName}} at {{company}}.

Context: we last spoke {{daysAgo}} days ago about {{topic}}. They went dark after {{lastStep}}.

Tone: confident, helpful, low pressure. Open by giving — share one concrete artifact (template, benchmark, or short loom). Close with a one-sentence ask: "still worth a conversation, or should I close the loop?"

Output: subject line + body, separated by ---.`,
  },
  {
    id: "s03",
    title: "Discovery call agenda",
    useCase: "Pre-meeting agenda sent the day before",
    category: "Sales",
    body: `Draft a 5-bullet agenda for a 30-min discovery call with {{company}}.

Goals: (1) confirm pain {{pain}}, (2) understand current workflow + tools, (3) quantify cost of inaction, (4) map decision process, (5) define a next step.

Format: numbered list. Include a 2-minute "what would success look like" question as bullet 1. Reserve last 5 minutes for next-step alignment.

Send-ready: open with "Here's how I'd suggest we use the 30 minutes — tweak before we meet:".`,
  },
  {
    id: "s04",
    title: "MEDDPICC scorecard",
    useCase: "Internal deal qualification scorecard",
    category: "Sales",
    body: `Score the following deal against MEDDPICC. For each letter, score 0–3 (0=unknown, 3=strong) and add one sentence of evidence pulled from the notes.

Letters: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition.

End with: (1) total /24, (2) the single biggest gap, (3) the next move to close it.

Notes:
"""
{{callNotes}}
"""`,
  },
  {
    id: "s05",
    title: "Objection: too expensive",
    useCase: "Handling price objection mid-deal",
    category: "Sales",
    body: `You are a senior AE. The prospect just said: "It's too expensive."

Return three responses, ranked by aggressiveness:
1. Curious (assume a misunderstanding of value).
2. Reframe (anchor to cost of inaction).
3. Direct (offer a smaller scoped pilot).

Each response: ≤45 words, ends with a question that moves the conversation forward.`,
  },
  {
    id: "s06",
    title: "LinkedIn DM (warm intro)",
    useCase: "DM after a mutual connection introduction",
    category: "Sales",
    body: `Write a 60-word LinkedIn DM to {{name}} after {{mutual}} introduced us.

Open by naming {{mutual}} and the specific context (event, project, mutual problem). One line about why I'm reaching out. End with a low-friction ask: "open to a 15-min call next week, or easier over email?"

No emojis. No "Hope this finds you well."`,
  },
  {
    id: "s07",
    title: "Demo recap email",
    useCase: "Same-day recap after a sales demo",
    category: "Sales",
    body: `Write a same-day demo recap for {{firstName}} at {{company}}.

Sections (each 1-2 sentences):
- What we covered
- What you flagged as the biggest unlock
- What we agreed on as next step
- One specific risk I'll de-risk before we talk again

Close with a clear next-step time block ({{proposedTimes}}).`,
  },
  {
    id: "s08",
    title: "Negotiation: discount asked",
    useCase: "Customer asks for a percentage discount",
    category: "Sales",
    body: `Prospect asked for {{percent}}% off. We can give up to {{maxConcession}}% but only with a trade.

Draft a reply that (1) doesn't reject outright, (2) names the trade we want (longer term, case study, multi-product), (3) anchors back to ROI of the current quote, (4) keeps optionality.

≤120 words. End with a yes/no question.`,
  },
  {
    id: "s09",
    title: "Multi-thread email",
    useCase: "Get introduced to an exec from a champion",
    category: "Sales",
    body: `Write a 50-word forwardable email I can send to my champion {{champion}}, asking them to introduce me to {{exec}}.

Include: (1) one specific reason {{exec}} would care, (2) one sentence about what success looks like, (3) a pre-drafted intro paragraph my champion can copy-paste.

Tone: confident, low effort to forward.`,
  },
  {
    id: "s10",
    title: "Account research brief",
    useCase: "Pre-call account research summary",
    category: "Sales",
    body: `Given the following data on {{company}}, produce a 200-word pre-call brief:

"""
{{accountData}}
"""

Sections:
- Company snapshot (size, stage, funding)
- Last 90 days: hiring signals, product launches, exec moves
- Probable top-3 priorities for {{persona}}
- Two hooks I can open with on the call
- One risk this account may be a poor fit`,
  },
  {
    id: "s11",
    title: "Competitive trap question",
    useCase: "Discovery question that exposes a weakness in the incumbent",
    category: "Sales",
    body: `My competitor is {{competitor}}. Their weak point is {{weakness}}.

Write three open-ended discovery questions I can ask without naming the competitor that will surface this weakness if it's present. Each question should sound neutral and curious, not loaded.

Format: numbered list, one sentence each.`,
  },
  {
    id: "s12",
    title: "Pricing email",
    useCase: "Sending pricing after a qualified discovery",
    category: "Sales",
    body: `Draft an email sending pricing to {{firstName}}.

Structure:
1. One-sentence reminder of what we're solving.
2. The number, expressed as monthly investment + total annual.
3. What's included (3 bullets).
4. What success looks like in 30/60/90 days.
5. Clear next step ("approve and we kick off Monday").

Avoid: walls of legalese, multiple options without a recommendation.`,
  },
  {
    id: "s13",
    title: "Lost deal autopsy",
    useCase: "Post-mortem on a deal we lost",
    category: "Sales",
    body: `Conduct a lost-deal autopsy. Inputs below.

"""
{{dealNotes}}
"""

Output:
- 3-sentence summary of what happened
- The single root cause (not symptoms)
- What we should have done at each of: first call, post-demo, negotiation
- What I'll change in my next 5 deals because of this one`,
  },
  {
    id: "s14",
    title: "Champion enablement kit",
    useCase: "Equip a champion to sell internally",
    category: "Sales",
    body: `Build a champion enablement pack for {{champion}} who is taking our solution to their CFO.

Output:
- 1-page business case (problem, solution, ROI, risk, next step)
- 5 FAQs the CFO will ask
- 3 numbers to memorize
- A pre-drafted Slack message to send their boss with the deck attached`,
  },
  {
    id: "s15",
    title: "Annual renewal pitch",
    useCase: "Renewal conversation with an existing customer",
    category: "Sales",
    body: `Draft a renewal pitch for {{customer}} who is up for renewal in {{daysUntilRenewal}} days.

Lead with delivered value (cite {{wins}}). Acknowledge any rough patches honestly. Propose the next phase (expand seats / add product / shift to multi-year). End with a specific 30-min meeting request.`,
  },

  // ───────────────────── OPS (15) ─────────────────────
  {
    id: "o01",
    title: "SOP writer",
    useCase: "Turn a verbal process description into a numbered SOP",
    category: "Ops",
    body: `Convert the following description into a standard operating procedure.

"""
{{description}}
"""

Output sections:
- Purpose (1 sentence)
- Owner role
- Trigger (when this SOP runs)
- Numbered steps (each with: action, tool, expected output, who)
- Failure modes + rollback
- Definition of done`,
  },
  {
    id: "o02",
    title: "Weekly ops review template",
    useCase: "Standing weekly business review",
    category: "Ops",
    body: `Generate this week's ops review based on the metrics below.

"""
{{metricsCsv}}
"""

Sections:
- Green / Yellow / Red dashboard (one line per metric)
- 3 things that worked
- 3 things that broke
- This week's one big bet
- Help needed (who, by when)`,
  },
  {
    id: "o03",
    title: "Hiring scorecard",
    useCase: "Build a structured scorecard for an open role",
    category: "Ops",
    body: `Build a hiring scorecard for the role: {{role}}.

Include:
- Mission (1 sentence, outcome-focused)
- 5 outcomes (year-1, measurable)
- 8 competencies (4 functional, 4 leadership)
- 10 interview questions mapped to competencies
- A red-flag list (signals to reject quickly)`,
  },
  {
    id: "o04",
    title: "Postmortem (blameless)",
    useCase: "Write a blameless postmortem after an incident",
    category: "Ops",
    body: `Write a blameless postmortem from these notes:

"""
{{incidentNotes}}
"""

Sections:
- Summary (what, when, impact)
- Timeline (UTC, action verbs only)
- Root cause (5 whys, not symptoms)
- What went well
- What went poorly
- Action items (owner + due date, all SMART)
- Lessons (separate from action items)`,
  },
  {
    id: "o05",
    title: "Vendor evaluation matrix",
    useCase: "Score 3 vendors against weighted criteria",
    category: "Ops",
    body: `Score {{vendors}} against these criteria with the given weights:

{{criteriaJson}}

Output a Markdown table with one row per vendor + a Score column. End with a 4-sentence recommendation, naming the winner and the single biggest risk in choosing them.`,
  },
  {
    id: "o06",
    title: "Quarterly OKR draft",
    useCase: "Translate strategy into OKRs",
    category: "Ops",
    body: `Convert the following strategy memo into 3 Objectives, each with 3 Key Results.

Strategy:
"""
{{strategy}}
"""

Rules:
- Objectives are qualitative, time-bound, ambitious.
- Key Results are quantitative, measurable, leading where possible.
- No more than one KR per Objective is a "deliverable" (vs. a metric).`,
  },
  {
    id: "o07",
    title: "Process audit",
    useCase: "Find waste in an existing workflow",
    category: "Ops",
    body: `Audit this workflow for waste:

"""
{{workflow}}
"""

Use the 8 wastes framework (defects, overproduction, waiting, non-utilized talent, transportation, inventory, motion, extra-processing).

For each waste, name: (1) where it occurs, (2) cost estimate, (3) one fix you'd ship first.`,
  },
  {
    id: "o08",
    title: "Meeting kill list",
    useCase: "Cut recurring meetings that don't earn their keep",
    category: "Ops",
    body: `Review my recurring meetings:

"""
{{meetingList}}
"""

For each, classify: KEEP / REPLACE-WITH-DOC / KILL / REDUCE-FREQUENCY.

Output a table with columns: Meeting, Verdict, Reasoning, Replacement (if not KEEP), Time saved/week.`,
  },
  {
    id: "o09",
    title: "Onboarding plan (first 30 days)",
    useCase: "Build a 30-day plan for a new hire",
    category: "Ops",
    body: `Draft a 30-day onboarding plan for a new {{role}}.

Structure:
- Day 1: people to meet, tools provisioned, first artifact to read.
- Week 1: outcome to deliver.
- Week 2: own a small workstream end-to-end.
- Week 3: shadow + lead one customer-facing moment.
- Week 4: present learnings + 90-day plan.

Add a "manager check-in" cadence (daily week 1, 2x week 2, weekly thereafter).`,
  },
  {
    id: "o10",
    title: "Capacity model",
    useCase: "Estimate headcount needs from forecast",
    category: "Ops",
    body: `Build a 12-month capacity model.

Inputs:
- Forecasted demand: {{demand}}
- Current FTE capacity: {{fte}}
- Productivity assumption: {{prodPerFte}}
- Hiring ramp: {{rampMonths}} months to full productivity

Output:
- Month-by-month table: demand, capacity, gap, hires triggered.
- The exact month we should start each hire.
- Two risks to the model + how to monitor them.`,
  },
  {
    id: "o11",
    title: "RACI matrix builder",
    useCase: "Clarify ownership on a cross-functional project",
    category: "Ops",
    body: `Build a RACI for this project:

Project: {{project}}
Stakeholders: {{stakeholders}}
Workstreams: {{workstreams}}

Output a Markdown table: rows = workstreams, columns = stakeholders. Fill in R/A/C/I. Each workstream should have exactly one A.`,
  },
  {
    id: "o12",
    title: "Quarterly retrospective",
    useCase: "Run a structured team retro for the quarter",
    category: "Ops",
    body: `Run a quarter-end retro using Start / Stop / Continue + a 4-letter sentiment dimension (HAPPY / SAD / MAD / GLAD).

Inputs:
"""
{{notes}}
"""

Output:
- Sentiment summary (one line per team)
- Top 3 Start
- Top 3 Stop
- Top 3 Continue
- The single "biggest unlock for next quarter" — pick one`,
  },
  {
    id: "o13",
    title: "Risk register",
    useCase: "Maintain a project risk register",
    category: "Ops",
    body: `Update the risk register for {{project}}.

Existing risks:
"""
{{existing}}
"""

New input:
"""
{{newInput}}
"""

For each risk: ID, description, likelihood (1-5), impact (1-5), score (LxI), owner, mitigation, current status. Sort by score descending. Flag any risk with score ≥16 as RED.`,
  },
  {
    id: "o14",
    title: "Decision memo (1-pager)",
    useCase: "Frame a decision for an exec stakeholder",
    category: "Ops",
    body: `Write a 1-page decision memo for {{stakeholder}}.

Sections:
- TL;DR (3 lines: the decision being asked, your recommendation, why)
- Context (5 bullets)
- Options (A/B/C — each with pros, cons, cost, risk)
- Recommendation (with the single tradeoff you're accepting)
- Ask (what you need from the stakeholder, by when)

Inputs:
"""
{{context}}
"""`,
  },
  {
    id: "o15",
    title: "Status update (weekly)",
    useCase: "Project status update for stakeholders",
    category: "Ops",
    body: `Write this week's project status update for {{project}}.

Format:
- Status: GREEN / YELLOW / RED + one-line rationale
- Last week: 3 wins
- Next week: 3 priorities
- Blockers: each blocker + the specific ask to unblock
- Numbers: 3 metrics moving in the right direction, 1 moving wrong way

Tone: factual, no hedging.`,
  },

  // ───────────────────── MARKETING (15) ─────────────────────
  {
    id: "m01",
    title: "Landing page hero",
    useCase: "Write the above-the-fold copy for a landing page",
    category: "Marketing",
    body: `Write the hero of a landing page for {{product}} targeting {{persona}}.

Output:
- Eyebrow (3 words, uppercase, category positioning)
- H1 (max 10 words, contains a verb)
- Subhead (max 25 words, includes a specific outcome + a specific timeframe)
- Primary CTA (max 4 words, action verb)
- Secondary CTA (max 4 words, lower commitment)
- 3 social proof bullets (each ≤ 8 words)`,
  },
  {
    id: "m02",
    title: "SEO cluster plan",
    useCase: "Build a topical cluster for a head term",
    category: "Marketing",
    body: `Build a topical SEO cluster for the head term: {{headTerm}}.

Output:
- 1 pillar page (3000+ words, name + outline)
- 8 cluster posts (each 1500 words, name + intent + primary keyword)
- Internal link map (which posts link to which)
- The single keyword we'd be foolish not to rank for in 90 days`,
  },
  {
    id: "m03",
    title: "Ad copy (Meta)",
    useCase: "Generate 5 variant ads for paid social",
    category: "Marketing",
    body: `Write 5 Meta ad variants for {{product}}.

Each variant has:
- Hook (≤ 7 words, scroll-stopper)
- Primary text (≤ 80 words, problem→specific outcome→CTA)
- Headline (≤ 6 words)
- Description (≤ 12 words)
- Image idea (1 sentence describing the visual)

Diversity rule: 1 question-led, 1 stat-led, 1 contrarian, 1 testimonial, 1 list-based.`,
  },
  {
    id: "m04",
    title: "Brand voice guide (one-pager)",
    useCase: "Compress brand voice into something a writer can use",
    category: "Marketing",
    body: `Synthesize this brand into a 1-page voice guide:

"""
{{brandInputs}}
"""

Sections:
- Personality (3 adjectives + 3 anti-adjectives)
- Lexicon: words we use / words we avoid (10 each)
- Sentence rhythm rules (avg length, max length, punctuation)
- Two before/after examples (rewrite the same sentence in the wrong then right voice)`,
  },
  {
    id: "m05",
    title: "Webinar promo email",
    useCase: "Drive registrations for a live webinar",
    category: "Marketing",
    body: `Write a webinar promo email for {{topic}} on {{date}}.

Audience: {{persona}}.

Structure:
- Subject line (≤ 8 words, includes a number or a specific outcome)
- Preheader (≤ 90 chars)
- Body (≤ 150 words): pain → 3 takeaways → speaker credibility → CTA
- Footer: calendar add link + unsubscribe`,
  },
  {
    id: "m06",
    title: "Press release",
    useCase: "Standard press release for a product launch",
    category: "Marketing",
    body: `Draft a press release announcing {{news}}.

Required sections, in order:
- Dateline (City, State — Month Day, Year)
- Lede (1 sentence: what + significance)
- Quote from CEO (≤ 40 words, no fluff)
- 3-paragraph body (what, why now, traction)
- Quote from customer (≤ 35 words, specific outcome)
- Boilerplate (4 sentences about the company)
- Press contact block`,
  },
  {
    id: "m07",
    title: "Tweet thread (educational)",
    useCase: "10-tweet thread that teaches a concept",
    category: "Marketing",
    body: `Write a 10-tweet educational thread on {{topic}}.

Rules:
- Tweet 1 must hook with a counterintuitive claim + a promise.
- Tweets 2-9 each teach one idea, with one concrete example.
- Tweet 10 is a soft CTA + a "if you found this useful, RT tweet 1" line.
- Each tweet ≤ 280 chars. No emojis except in tweet 1 if it helps the hook.`,
  },
  {
    id: "m08",
    title: "Case study outline",
    useCase: "Structure a customer case study from raw notes",
    category: "Marketing",
    body: `Turn this customer interview into a case study outline:

"""
{{interview}}
"""

Sections:
- TL;DR (3 metrics + 1 sentence)
- The customer (industry, size, role)
- The problem (before us, what it cost)
- The solution (what they implemented, in customer's words)
- The result (specific, dated metrics)
- The quote (the single most quotable line from the interview)`,
  },
  {
    id: "m09",
    title: "Newsletter intro",
    useCase: "Open this week's newsletter",
    category: "Marketing",
    body: `Write a 120-word newsletter intro for this week.

This week's theme: {{theme}}.

Rules:
- Open with a moment from this week (specific, personal).
- Bridge that moment to the theme.
- Tease what's inside the newsletter (3 bullets).
- Close with one question for the reader to think about.`,
  },
  {
    id: "m10",
    title: "Landing page FAQ",
    useCase: "Generate the FAQ section of a landing page",
    category: "Marketing",
    body: `Generate 8 FAQs for the {{product}} landing page.

Cover: pricing, security, onboarding time, integrations, what makes us different, who this isn't for, refund/cancel, what success looks like.

Each answer: ≤ 80 words. End with an answer that addresses the most common objection head-on.`,
  },
  {
    id: "m11",
    title: "Webinar abstract",
    useCase: "Speaker abstract for an industry conference",
    category: "Marketing",
    body: `Write a 150-word abstract for a 30-min conference talk titled "{{talkTitle}}".

Sections:
- Hook (one contrarian claim)
- The problem we'll address
- What attendees will leave with (3 takeaways)
- Who this talk is for (1 sentence)
- Speaker bio (3 sentences, third person, credentials + a specific number)`,
  },
  {
    id: "m12",
    title: "Content repurpose plan",
    useCase: "Turn one long-form asset into 10 channel-native pieces",
    category: "Marketing",
    body: `Take this long-form piece and produce a repurpose plan:

"""
{{sourceContent}}
"""

Output 10 derivative assets:
- 1 LinkedIn carousel (slides outlined)
- 1 X/Twitter thread (hook + 7 beats)
- 1 short-form video script (60 sec)
- 3 quote graphics (pulled verbatim)
- 1 email newsletter (subject + outline)
- 1 SlideShare-style PDF (5 slides)
- 1 podcast pitch (4 sentences)
- 1 community post (Reddit-appropriate tone)`,
  },
  {
    id: "m13",
    title: "Persona deep-dive",
    useCase: "One-page persona doc",
    category: "Marketing",
    body: `Build a 1-page persona for {{personaName}}.

Sections:
- A day in their life (4 sentences, time-stamped)
- The 3 things they get measured on
- Their top 3 pains (and what they currently do about each)
- The 3 sites/podcasts/Slacks they actually read
- Words they use vs words they hate
- The single best message-market-fit hook for them`,
  },
  {
    id: "m14",
    title: "Pricing page rewrite",
    useCase: "Tighten conversion on a pricing page",
    category: "Marketing",
    body: `Critique this pricing page copy and rewrite it:

"""
{{pricingCopy}}
"""

Output:
- 5 problems (each with the specific line)
- Rewritten plan card copy for each tier (max 12 lines per card)
- A "Most Popular" tier recommendation + why
- 5 FAQ rewrites focused on objections, not features`,
  },
  {
    id: "m15",
    title: "Campaign brief (1-pager)",
    useCase: "Brief a creative team on a new campaign",
    category: "Marketing",
    body: `Write a 1-page campaign brief for {{campaign}}.

Sections:
- Objective (1 SMART sentence)
- Audience (who, why now)
- Insight (the human truth we're acting on)
- Single-minded proposition (≤ 12 words)
- Tone (3 adjectives)
- Channels + deliverables (with deadlines)
- KPI + what we'd consider a failure
- Mandatories (legal, brand, anything that must appear)`,
  },

  // ───────────────────── SUPPORT (15) ─────────────────────
  {
    id: "u01",
    title: "Empathetic reply (frustrated user)",
    useCase: "First reply to an angry customer",
    category: "Support",
    body: `A customer wrote this angry message:

"""
{{message}}
"""

Write a first reply (≤ 120 words) that:
1. Acknowledges the specific impact (not the emotion abstractly).
2. Takes ownership without making excuses.
3. Names exactly what we're doing next, with a time commitment.
4. Offers one tangible gesture of repair (credit, expedite, escalation).
5. Closes with a direct line of contact for follow-up.`,
  },
  {
    id: "u02",
    title: "Bug report → engineer ticket",
    useCase: "Translate user message into engineering-ready ticket",
    category: "Support",
    body: `Convert this user report into an engineering bug ticket.

"""
{{userMessage}}
"""

Format:
- Title (verb-led, ≤ 12 words)
- Environment (browser, OS, version, plan tier if known)
- Steps to reproduce (numbered)
- Expected behavior
- Actual behavior
- Severity (P0/P1/P2/P3 with one-line justification)
- Customer impact (revenue / accounts / minutes affected)
- First questions to ask if we can't repro`,
  },
  {
    id: "u03",
    title: "Refund decision tree",
    useCase: "Decide and respond when a refund is requested",
    category: "Support",
    body: `Customer requested a refund. Here's the context:

"""
{{context}}
"""

Walk through a 3-question decision tree:
1. Is this a billing error? → full refund + apology.
2. Is this within stated policy (e.g., 14-day)? → full refund, no questions.
3. Is this outside policy? → propose alternative (credit, downgrade, pause).

Output the decision + the reply email.`,
  },
  {
    id: "u04",
    title: "Outage status update",
    useCase: "Public status page update during an incident",
    category: "Support",
    body: `Draft a status page update for an ongoing incident.

Inputs:
- Severity: {{severity}}
- Affected services: {{services}}
- Symptoms users see: {{symptoms}}
- Current state: {{state}}
- ETA: {{eta}}

Tone: clear, non-defensive, no jargon. ≤ 90 words. End with the time we'll post the next update (max 30 min out).`,
  },
  {
    id: "u05",
    title: "Knowledge base article",
    useCase: "Turn a resolved ticket into a KB article",
    category: "Support",
    body: `Turn this resolved ticket into a knowledge base article.

"""
{{ticket}}
"""

Format:
- H1 (question phrased as the user would search it)
- TL;DR (2 sentences)
- When this applies (bullet list)
- Steps (numbered, each ≤ 1 sentence)
- Screenshots needed (describe each)
- Related articles
- Last reviewed date`,
  },
  {
    id: "u06",
    title: "Churn save reply",
    useCase: "Customer says they're cancelling",
    category: "Support",
    body: `A customer just submitted a cancellation request with this reason:

"""
{{reason}}
"""

Draft a churn-save reply (≤ 130 words) that:
- Validates the reason without arguing.
- Asks one specific question to understand the root cause.
- Offers a relevant intervention (success call, downgrade, pause).
- Respects their decision if they still want to leave.
- Ends with a frictionless out (no dark patterns).`,
  },
  {
    id: "u07",
    title: "Feature request triage",
    useCase: "Route an incoming feature request",
    category: "Support",
    body: `Triage this feature request:

"""
{{request}}
"""

Output:
- Underlying job-to-be-done (1 sentence)
- Is there a workaround today? (yes/no + how)
- How many customers have asked for this (estimate)
- Effort estimate (S/M/L) with reasoning
- Verdict: SHIP / BACKLOG / WONT-DO + 2-sentence rationale
- Reply to send to the customer (warm, no overpromise)`,
  },
  {
    id: "u08",
    title: "Escalation summary",
    useCase: "Hand off a complex case to engineering or exec",
    category: "Support",
    body: `Write an escalation summary for the team taking over this case:

"""
{{caseNotes}}
"""

Required sections:
- Customer context (account, plan, ARR, key contacts)
- What's broken (2 sentences)
- What we've already tried (chronological)
- What we need from the escalation owner
- Customer's current mood + their stated next move if not resolved by {{deadline}}`,
  },
  {
    id: "u09",
    title: "Onboarding follow-up",
    useCase: "Check in 7 days after a customer signed up",
    category: "Support",
    body: `Write a 7-day onboarding check-in email to {{firstName}}.

Goals: (1) see if they've hit their first value moment, (2) surface any blocker, (3) point at the one thing that drives stickiness.

≤ 90 words. End with a single yes/no question (e.g., "want me to set up a 15-min onboarding session?").`,
  },
  {
    id: "u10",
    title: "Saved reply: password reset",
    useCase: "Reusable macro for password reset requests",
    category: "Support",
    body: `Write a reusable saved-reply for password reset requests.

Required:
- 60 words max.
- One sentence confirming we never see the password.
- 3-step process with the exact link/button labels.
- Note on what to do if the reset email doesn't arrive in 5 minutes.
- Sign off with the support team name + hours.`,
  },
  {
    id: "u11",
    title: "Customer health check",
    useCase: "Score an account's health quickly",
    category: "Support",
    body: `Score this account's health 1-10 and explain:

"""
{{accountSignals}}
"""

Signals to weight:
- Usage trend (last 30d vs prior 30d)
- Champion changes
- Support ticket volume + sentiment
- Last QBR sentiment
- Renewal proximity
- Expansion conversations

Output the score, the one signal driving it, and the one move I should make this week.`,
  },
  {
    id: "u12",
    title: "Incident postmortem reply",
    useCase: "Reply to an affected customer after a fix",
    category: "Support",
    body: `Write a personal reply to a customer affected by yesterday's incident.

Context:
- What broke: {{issue}}
- Duration of their exposure: {{duration}}
- Root cause (in plain English): {{cause}}
- What we changed so it can't happen again: {{fix}}

≤ 140 words. Specific, not corporate. Offer a credit equal to {{creditDays}} days.`,
  },
  {
    id: "u13",
    title: "FAQ from tickets",
    useCase: "Generate an FAQ from the last 100 tickets",
    category: "Support",
    body: `Generate a top-10 FAQ from this ticket sample:

"""
{{tickets}}
"""

Cluster by underlying question (not exact wording). For each:
- Question as the user would search it
- Frequency (rough count)
- Current canonical answer (or "needs answer")
- Whether the product should change to eliminate the question`,
  },
  {
    id: "u14",
    title: "Reply to feature ask we can't build",
    useCase: "Decline a feature request without burning trust",
    category: "Support",
    body: `Write a reply to a customer who asked for a feature we won't build.

Be honest. Don't say "great idea, we'll consider it" if we won't. Acknowledge the underlying job-to-be-done. Offer the closest workaround we do support. Leave the door open for a future revisit if conditions change.

≤ 110 words.`,
  },
  {
    id: "u15",
    title: "QBR talking points",
    useCase: "Prep talking points for a quarterly business review",
    category: "Support",
    body: `Build talking points for a QBR with {{customer}}.

Sections:
- 3 wins from the quarter (with the dollar / hour / outcome attached)
- 2 things that didn't go as planned + what we changed
- Roadmap items relevant to them next quarter
- 1 expansion conversation we'd like to open
- 1 ask from them (intro, case study, beta participation)

Length: bullet list, not paragraphs.`,
  },
];
