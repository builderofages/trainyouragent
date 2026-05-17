import type { Doc } from "../../docs";

export const docChatMetrics: Doc = {
  slug: "chat-agent-metrics",
  section: "Chat agents",
  title: "Chat agent metrics that matter",
  summary: "A short list of metrics that actually predict business value, and a longer list of vanity metrics worth ignoring.",
  targetWords: 600,
  body: `
## The four metrics that matter

The vast majority of chat agent decisions can be made from four numbers. Containment rate is the percentage of conversations the agent resolved end to end without a human handoff. Conversion rate is the percentage of conversations that ended in the desired outcome — a demo booked, an order placed, a ticket filed, whatever success looks like for that surface. Time to resolution is the median number of turns from the customer's first message to the moment they either got their answer or were handed off. Customer satisfaction is a single end-of-conversation thumbs up or thumbs down with an optional text comment.

If you only ever look at four numbers, look at those four. Everything else either rolls up into one of them or is a vanity metric pretending to be useful.

## What "good" looks like

For a well-built chat agent on a healthy knowledge base, expect containment rates between sixty and eighty percent in the first month, climbing toward eighty-five percent after a few rounds of tuning. Expect conversion rates that are at least equal to your existing human-staffed chat baseline, and frequently double it because the agent is available around the clock. Expect median time to resolution under three turns for simple lookups and under eight turns for booking or complex multi-step flows. Expect satisfaction in the eighty to ninety percent positive range — anything lower means the prompt or the knowledge base needs work.

## Metrics to ignore

Total messages handled is a vanity metric. It rewards a chatty agent over a helpful one. Intent recognition accuracy in isolation is a vanity metric — it does not matter that the agent correctly classified the intent if it then failed to act on it. Token spend per conversation is interesting for cost forecasting but tells you nothing about quality. Average session duration is genuinely misleading — both very short sessions and very long sessions can mean failure.

## How to read containment

Containment looks simple but has nuance. A conversation that ends because the customer gave up and closed the tab is not a contained conversation, even though no human was involved. We instrument the agent to detect drop-off patterns — sudden silences after a question, repeated rephrasing of the same ask, explicit frustration language — and exclude those from the containment numerator. The honest containment number is usually five to ten percent lower than the naive number, and it is the one we report.

## How to read conversion

The single biggest predictor of chat conversion is whether the conversion event happens inside the chat window or after the customer leaves it. In-window conversion — the agent itself collects the form fill, books the appointment, takes the payment — converts at three to five times the rate of post-chat conversion, where the agent answers questions and then asks the customer to go fill out a form on a different page. Wherever possible, complete the action inside the chat.

## The one custom metric worth building

Beyond the four standard metrics, the single most useful custom metric is escalation reason. Every time a conversation is handed to a human, the agent should tag the reason — knowledge gap, integration failure, sensitive topic, customer demand, model uncertainty. The histogram of escalation reasons tells you exactly where to spend the next round of tuning. If forty percent of escalations are knowledge gaps, you have a content problem. If forty percent are integration failures, you have an engineering problem.

## Reporting cadence

We share the four core metrics in the Friday weekly summary, broken down by intent and by surface. Once a month we share a longer report that includes escalation reasons, a sample of contained conversations, and a sample of escalated conversations with our notes on what we will tune next.
`.trim(),
};
