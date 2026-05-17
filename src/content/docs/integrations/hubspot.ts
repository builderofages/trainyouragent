import type { Doc } from "../../docs";

export const docIntegrationHubspot: Doc = {
  slug: "integrating-with-hubspot",
  section: "Integrations",
  title: "Integrating with HubSpot",
  summary: "How we wire your TrainYourAgent agent into HubSpot so every conversation creates the right contact, deal, and activity record.",
  targetWords: 500,
  body: `
## What gets created in HubSpot

When the agent has a meaningful conversation, we create or update three things in HubSpot. First, a contact record using the email or phone number the caller provided, with name, company, and any qualification fields the agent captured during the conversation. Second, an activity entry on that contact's timeline with the full transcript or recording, the call duration, the intent, and the outcome. Third, a deal record on the relevant pipeline if the conversation crossed the qualification threshold you defined during scoping.

If the contact already exists, we update rather than duplicate. Match logic prefers email, falls back to phone, and finally to name plus company. Any field the agent learns that was previously empty is filled in. Any field that was previously filled is left alone unless you tell us otherwise.

## What you need to provide

We need a HubSpot user with the right scopes. The user does not need to be a paid seat, but it does need API access. Specifically: contacts read and write, companies read and write, deals read and write, timeline event create, and engagements create. We will send you a short checklist and a screenshot of the exact permissions screen.

We do not need your full admin credentials. We use a private app token that you generate inside HubSpot and paste into your TrainYourAgent dashboard. The token can be rotated or revoked at any time and we use a separate token per environment so the sandbox never touches production data.

## Field mapping

During scoping we map the agent's conversation slots to HubSpot properties. A handful of standard fields are mapped automatically — first name, last name, email, phone, company. Custom fields like "service requested", "estimated value", "preferred callback time", or "marketing source" are mapped one to one, and we will create the corresponding HubSpot property if it does not already exist. You will get a one-page mapping document that you sign off before go-live.

## Deal stage and pipeline rules

You pick the pipeline and the entry stage. The agent will create the deal in the stage you specified. If the conversation surfaces a clear hot-buyer signal — explicit purchase intent, a specific budget, a date for the buying decision — the agent can advance the deal to a "qualified" stage automatically. We do not move deals past qualified without a human in the loop.

## What we do not do

We do not delete records. We do not change deal owners. We do not unsubscribe contacts from your marketing email lists. We do not edit deals that already exist beyond the very specific timeline entries we add. If your team wants the agent to do any of those things, we will scope it as a separate integration with explicit guardrails.

## Verification

Before go-live, we run a sandbox test that exercises every field in every flow, and we send you a short Loom showing the resulting HubSpot records. You can ask for any field mapping change at that point with no rework cost.
`.trim(),
};
