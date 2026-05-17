import type { Doc } from "../../docs";

export const docVoiceBestPractices: Doc = {
  slug: "voice-agent-best-practices",
  section: "Voice agents",
  title: "Voice agent best practices",
  summary: "Hard-earned guidance for building voice agents that customers trust and your team is willing to defend.",
  targetWords: 700,
  body: `
## Start with the opening line, not the system prompt

The first six seconds of every call decide whether the customer believes the agent. Spend a disproportionate amount of time on the opening — the greeting, the disclosure if your industry requires one, the question that invites the caller to state their reason for calling. If the opening lands, you have earned the next thirty seconds. If it does not, the caller is already mentally hunting for the operator key.

A good opening is short, names your business, and offers one clear next step. Avoid stacking three questions, avoid robotic chime sounds, and avoid the phrase "your call is important to us" — that exact phrase is statistically the moment most callers hang up.

## Pick a voice that is one notch less perfect than the best on offer

The current best TTS voices are technically incredible and sound slightly too good to be true. Customers notice. We typically pick the second-best voice in any vendor's lineup — the one with a small amount of natural breathiness, a hint of regional accent, and a slightly imperfect cadence. It pulls the agent out of the uncanny valley and into the "competent receptionist" zone.

Match the voice to the brand. A premium home services company should not sound like a discount call center. A healthcare clinic should sound calm and unhurried. A logistics dispatch line should sound brisk and confident. The voice is a brand decision, not a checkbox.

## Disclose AI when your industry requires it

Some industries — healthcare, legal, insurance, finance, anything with a fiduciary or regulated relationship — require you to disclose that the caller is speaking with an automated system. Get a clear answer from your counsel on what is required for your jurisdiction and your industry, then bake the disclosure into the opening line. Done well, the disclosure does not hurt conversion. Done as an afterthought, it sounds defensive.

## Write prompts in production English, not prompt-engineering jargon

The system prompt should read like an onboarding doc you would hand to a new receptionist. State the role, the goal, the boundaries, the escalation rules, and a small number of concrete examples. Avoid prompt-engineering ceremony like "you are a world-class expert" or "let's think step by step". The current generation of models does not need that and the extra tokens add latency.

## Build for the call that goes wrong

Most of the engineering effort should be spent on the unhappy path. The caller who interrupts mid-sentence. The caller who is angry. The caller who asks a question your agent does not have an answer to. The caller who needs to escalate to a human now, not in five minutes. Every agent we ship has a "graceful handoff" path that the orchestrator can trigger at any time, and a fallback voice prompt for when an upstream service times out.

## Keep state minimal and explicit

The agent should know exactly three things at any moment: who is calling, what they have asked for so far, and which step of which flow they are in. Larger context windows do not save you here — they make the agent more likely to hallucinate facts it half-remembers from earlier in the call. Keep the working memory short, write the important facts to a structured slot, and pass that slot to the next turn rather than relying on the model to re-derive it.

## Measure what matters and ignore the rest

Track containment rate — the percentage of calls the agent handled end to end without a human handoff. Track time to first booking — how quickly a booking-flow call results in an actual calendar event. Track caller satisfaction with a simple one-question post-call survey. Do not get distracted by vanity metrics like total minutes, intent recognition accuracy in isolation, or model token counts.

## Tune from real transcripts, not imagined edge cases

Every week, pull a random ten percent of real call transcripts and read them end to end. The misses you find in real audio will be different from the misses you imagined when you wrote the prompts. Most prompt updates after the first month should be driven by something you saw in a real transcript, not by something a stakeholder thought of in a meeting.
`.trim(),
};
