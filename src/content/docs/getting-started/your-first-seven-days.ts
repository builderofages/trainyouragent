import type { Doc } from "../../docs";

export const docFirstSevenDays: Doc = {
  slug: "your-first-seven-days",
  section: "Getting started",
  title: "Your first seven days",
  summary: "Day-by-day walkthrough of what happens between signing the statement of work and your agent taking its first real customer call.",
  targetWords: 700,
  body: `
## Why this matters

Most vendors in this space disappear for two weeks after you sign, then surface with a half-built bot and a list of questions. We do the opposite. The first seven days are the most active period of the engagement, and you should feel that energy. Here is what each day looks like.

## Day one — kickoff and scoping call

Within twenty-four hours of signing, you get a calendar invite for a sixty-minute kickoff. On that call we walk through the exact flows the agent will handle, the integrations it will touch, the voice and tone we want it to have, and the escalation rules for when a human needs to take over. You also hand off whatever assets exist — current scripts, your top fifty inbound questions, your CRM credentials, sample call recordings if you have them. Before you hang up, you have a one-page agent spec sent to your inbox.

## Day two — prompt and integration build

We build the first prompt set against the spec, wire the integrations we agreed on, and stand up the agent in a sandbox phone number or chat URL that only you can access. You will get a Slack channel or email thread that is the single place to discuss the build. Every change we ship is announced there with a timestamp and a short note on what changed.

## Day three — first sandbox test

By end of day three, you call the sandbox number yourself, try every flow you can think of, and try a few you would never ask a human to handle. We are listening live. Within the hour we triage what you found, fix the obvious misses, and send you back a list of items we cannot fix without more information from you.

## Day four — your team tests it

You hand the sandbox number to two or three people on your team. Receptionist, sales lead, ops manager — whoever will live with this agent in production. Ask them to break it. The goal of day four is to surface the questions only people who actually work the phones think to ask. We turn the patterns from those tests into another round of prompt updates.

## Day five — integration verification

By day five every integration we agreed to is wired and end-to-end tested. A booking from the agent actually lands on the right calendar with the right notes. A lead from the agent actually shows up in your CRM with the right source attribution. A handoff to a human actually rings the right person. We send you a short verification doc with screenshots of each path working.

## Day six — go-live rehearsal

Day six is a thirty-minute rehearsal call. You confirm the go-live time, the rollback plan, who is on call from your side and ours, and the exact wording of the customer-facing announcement if any. We freeze prompt changes from this point forward unless a customer call surfaces something genuinely broken. You should feel calm, not nervous, going into this call.

## Day seven — go live

We forward your real number to the agent. The agent takes its first real call. We are watching every call in real time for the first eight hours. You get a screenshot of the first successful interaction. If something does not feel right, we roll back inside ten minutes and tell you exactly what happened, no spin.

## After day seven

The pace shifts from build to tune. You get a weekly Friday summary email with call volume, handoff rate, top intents, and any prompt changes we shipped that week. The first thirty days typically include another two or three rounds of prompt tuning based on real production transcripts. After the first month, the agent should be running quietly in the background.

## What we ask from you

The single biggest predictor of a smooth first seven days is your responsiveness during the kickoff and sandbox phases. Reply within a few hours when we ask a question, surface every flow that matters before day three, and let your team actually stress-test the sandbox. We will do the rest.

## Common pitfalls and how we avoid them

Most launches that slip lose time in one of three places. The first is integrations that turn out to need permissions only the owner of the parent account can grant — calendar admins, CRM super-admins, payment processor owners. We ask for those credentials by name in the kickoff email, before day one, so nothing waits on a permissions hunt mid-week. The second is scope creep dressed up as a small ask. We will say so plainly when something is genuinely out of scope and propose either deferring it to a v2 or pricing it as an add-on. The third is review-by-committee. We strongly recommend one decision maker on your side for the build week, with stakeholders cc'd on the summary, not pulled into the prompt-by-prompt edits. You can broaden the review circle after launch when there is something concrete to react to.
`.trim(),
};
