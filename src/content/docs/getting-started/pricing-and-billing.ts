import type { Doc } from "../../docs";

export const docPricing: Doc = {
  slug: "pricing-and-billing",
  section: "Getting started",
  title: "Pricing and how billing works",
  summary: "Honest breakdown of our build fee, monthly retainer, usage charges, and how invoices and renewals are handled.",
  targetWords: 500,
  body: `
## The three line items

Every TrainYourAgent engagement has the same three components on the invoice. A one-time build fee that covers scoping, prompt design, integrations, voice tuning, sandbox testing, and go-live. A monthly retainer that covers monitoring, prompt updates, light feature additions, and the human you can email when something needs to change. A usage charge for the underlying model and telephony costs, which we pass through at cost plus a small operational margin.

We do not nickel-and-dime you for support hours or "configuration changes". If the tweak takes us less than thirty minutes, it is included in the retainer. If it is a real new feature, we will say so and price it before we build it.

## Typical numbers

For a single voice agent answering one phone line, with two or three integrations and standard business hours coverage, expect roughly four thousand dollars to build and around five hundred to one thousand dollars per month, plus usage. For a chat agent with a knowledge base of a few hundred articles, expect roughly three thousand to build and around four hundred per month. For a multi-channel deployment with voice, chat, and back-office automation feeding the same CRM, expect ten to twenty thousand to build and one to three thousand per month. Usage typically runs ten to thirty cents per voice minute and a fraction of a cent per chat message, depending on the model.

## When you get billed

The build fee is invoiced when we sign the statement of work. Half up front, half at go-live. The monthly retainer starts the day the agent takes its first real customer interaction, not the day we signed the contract. Usage is billed monthly in arrears, with a detailed line-item PDF that breaks down minutes, messages, model calls, and telephony pass-through.

We invoice via Stripe. You can pay with ACH, wire, or card. Card payments include the standard processing fee. Net thirty terms are available on request once we have one month of clean payment history.

## What happens if you cancel

You can cancel any time. Give us thirty days notice and we will keep the agent running through the end of the notice period, freeze new charges, and hand you a clean export of every prompt, recording, transcript, and CRM mapping we built. There is no cancellation fee and no annual lock-in. The build fee is non-refundable once we have delivered a working sandbox.

## What is never an extra charge

Sandbox testing, the kickoff call, the weekly summary, the human reply when you email us, prompt updates inside the retainer scope, security questionnaires under twenty pages, and the data export on cancellation. If a vendor in this space is charging you for any of those, that is a flag.

## Annual prepay discount

If you pay twelve months of retainer up front, we take fifteen percent off the retainer line. The usage line is still billed monthly because we will not estimate that for you and force you to true up. Annual prepay is optional, never required, and you can switch back to monthly at the end of the term with no penalty.

## Multi-agent and volume pricing

After the first agent is live and stable, additional agents on the same account run at sixty percent of the standalone build fee, because most of the integration work is already done. The retainer for additional agents drops to roughly half. Volume discounts on the usage line kick in at fifty thousand voice minutes per month and at one million chat messages per month. We will quote those in writing before they apply.
`.trim(),
};
