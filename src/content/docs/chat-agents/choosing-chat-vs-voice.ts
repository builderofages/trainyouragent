import type { Doc } from "../../docs";

export const docChatVsVoice: Doc = {
  slug: "choosing-chat-vs-voice",
  section: "Chat agents",
  title: "Choosing a chat agent vs voice",
  summary: "How to decide whether your first AI agent should answer calls, sit on your website, or both — based on where your customers actually are.",
  targetWords: 600,
  body: `
## Start where your customers already are

The right channel is the one your customers are already using. If most of your inbound demand comes through a phone number on the back of a service truck, a Google Business Profile, or a paid search ad with a click-to-call button, voice is the right first agent. If most of your inbound demand comes through a website form, a help desk widget, or a product page after hours, chat is the right first agent. Look at your last ninety days of inbound contact channels and pick the bigger one. Do not pick the trendier one.

## Where voice wins

Voice wins for any situation where the customer wants resolution in this conversation, not a follow-up. Service dispatching, emergency triage, urgent appointment booking, lost-package issues, and anything where the caller would otherwise be put on hold. Voice also wins when the customer demographic skews older, when literacy or typing speed is uneven, and when the conversation involves multiple back-and-forth turns that would feel slow over text.

Voice also wins when the call is already mid-stream — a customer has already dialed your main line and is sitting on hold. Replacing that hold with a competent agent that can answer the first question and free a human for the second question is a near-instant upgrade.

## Where chat wins

Chat wins for any situation where the customer is browsing, comparing, or researching, especially outside business hours. Pre-purchase product questions, software trials, scheduling visits a few days out, and any flow that benefits from sending the customer a link, a screenshot, or a structured comparison table. Chat also wins for low-stakes support questions where the customer is happy to wait thirty seconds for an answer if it is correct.

Chat scales without the unit economics of voice. A chat agent can handle hundreds of concurrent conversations at marginal cost. A voice agent can handle hundreds of concurrent calls, but each call costs telephony minutes that add up.

## Where chat loses

Chat loses for anything urgent. A burst pipe at midnight is not a chat conversation. Chat also loses for sensitive emotional conversations — complaints, refunds, escalations — where the absence of voice prosody makes the agent feel cold even when the wording is right. Hand those to a human or to a voice agent.

## When the answer is both

Most mature businesses end up with both, but in sequence. The first agent should be whichever channel produces more inbound today. The second agent should be the other channel, scoped to fill the gap. Once both are live, the most useful pattern is a shared knowledge base and a shared CRM mapping so a customer who started in chat can be handed to a voice agent or a human without losing context.

## The honest gut check

If your team is currently missing calls or letting voicemails pile up, start with voice. If your team is currently buried in low-effort email and web form replies, start with chat. If your team is buried in both, start with whichever has the higher revenue impact per resolved interaction. We will help you calculate that on the scoping call.

## What to avoid

Do not build a chat widget no one will use to "test the technology". Do not buy a voice agent and pipe it to a number you do not advertise. Both of those experiments tend to die because there is no real volume to learn from. Pick the channel that has demand, deploy a real agent on it, learn from real conversations.
`.trim(),
};
