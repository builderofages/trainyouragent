import type { Doc } from "../../docs";

export const docWhatWeDo: Doc = {
  slug: "what-trainyouragent-does",
  section: "Getting started",
  title: "What TrainYourAgent does",
  summary: "A plain-language overview of what we build, who we build it for, and how we are different from off-the-shelf bots.",
  targetWords: 600,
  body: `
## In one sentence

TrainYourAgent builds and operates custom AI agents for small and mid-sized businesses. We deliver voice agents that answer your phones, chat agents that handle your inbound web traffic, and back-office agents that take the repetitive computer work off your team. We then run the whole thing for you so you never see a config file.

## Who we work with

Most of our customers are operators running businesses between five and three hundred employees. They have a real revenue line, a real phone number that rings, and a real team that is being pulled away from high-value work to handle calls, messages, and data entry. They have usually tried a chatbot platform, found it disappointing, and want something that actually understands their offer.

We work across home services, healthcare clinics, professional services, hospitality, logistics, and retail. We do not work with consumer apps, generic productivity tools, or anyone looking for "an AI strategy" without a concrete problem to solve. We are an execution shop, not a consultancy.

## What we build

A typical engagement includes one or more of the following. A voice agent that answers your main business line, handles common questions, qualifies callers, books appointments on your calendar, and transfers genuine hot leads to a human within seconds. A chat agent that sits on your website and handles the same flow for typed conversation. A back-office agent that watches your inbox, your CRM, or your spreadsheet and takes action on patterns we agree on in advance.

Everything we deliver is trained on your scripts, your pricing, your product catalog, your booking rules, and your escalation procedures. The agent should sound like the best version of the person you would hire if you could find them.

## How we are different

The market has many voice agent platforms. Most of them sell you a self-serve dashboard, hand you a list of features, and expect you to figure it out. The result is a half-built agent that nobody on your team trusts. We do the opposite.

We scope the agent on a call with you. We build the first version in a sandbox where you can call in and test it. We tune the prompts, the voice, the latency, and the integrations until the agent passes your gauntlet. We deploy it. We monitor it. When something breaks or a customer asks something the agent did not expect, we are the ones who fix it.

You get a working agent, a real human you can email when you have a question, and a weekly summary of what the agent did. You do not get a login screen and a wiki.

## What we do not do

We do not train models on your customer data. We do not white-label other vendors and resell them at markup. We do not use stock voices that sound like a phone tree from 2009. We do not lock you in with proprietary scripting languages or annual contracts that hide cancellation fees.

## What it costs

Pricing is value-based and depends on the scope of the agent, the integrations required, and how many minutes or sessions you expect each month. There is a one-time build fee and a monthly retainer. The typical first engagement lands somewhere between three thousand and twelve thousand dollars setup and a few hundred to a few thousand monthly. See the pricing doc for the honest breakdown.

## What success looks like in the first month

Within thirty days of going live, most customers see the agent handle at least sixty percent of incoming inquiries end to end. That number climbs as we tune. You should also see a measurable reduction in missed calls after hours, a noticeable bump in booked appointments per week, and a clear line in your CRM showing which leads came in via the agent versus a human. If those numbers are not moving in the right direction in the first month, that is on us to fix, not on you to explain.
`.trim(),
};
