import type { Doc } from "../../docs";

export const docIntegrationCalendly: Doc = {
  slug: "integrating-with-calendly-or-cal-com",
  section: "Integrations",
  title: "Integrating with Calendly or Cal.com",
  summary: "How we wire your agent into Calendly or Cal.com so the agent can check availability and book real appointments mid-conversation.",
  targetWords: 500,
  body: `
## What the agent can do

Once the integration is live, your agent can do four things with your calendar. It can read live availability across one or more event types. It can suggest specific times to a caller. It can book the appointment on behalf of the caller, capturing name, email, phone, and any custom intake questions you have set up. It can reschedule or cancel an existing booking when the customer asks, with all the same notifications firing as if the customer had done it themselves.

The booking lands in your calendar instantly. The customer gets the same confirmation email and reminders they would get from a manual booking. Your CRM gets the same webhook it would normally receive. Nothing about your existing calendar setup needs to change.

## Calendly setup

Calendly setup requires a paid Calendly account at the Standard plan or above, because we need API access. Inside Calendly, create a personal access token under your integrations settings, copy it into your TrainYourAgent dashboard, and point us at the event types you want the agent to book against. We support both individual user event types and team round-robin event types.

If you use Calendly's intake questions, we will map them to the agent's conversation slots one to one during scoping, so the agent collects the same information a human caller would type into the booking form.

## Cal.com setup

Cal.com setup is similar. Generate an API key inside the Cal.com developer settings, paste it into your TrainYourAgent dashboard, and tell us which event types should be bookable. Cal.com supports OAuth as well as API keys, and we will use OAuth if you prefer that authentication flow.

For Cal.com self-hosted instances, we can hit your private endpoint directly as long as it is reachable from our outbound IPs. We will send the IP list during the integration call.

## Conversation flow

A typical booking conversation looks like this. The agent confirms which event type the caller wants — consultation, follow-up, service visit. The agent reads live availability and suggests two or three times in the customer's stated time window. The caller picks one. The agent confirms name, email, and phone. The agent books. The agent reads back the confirmation and tells the caller to expect a confirmation email within a minute.

If the caller's preferred time is not available, the agent will not invent a slot. It will propose the closest available alternatives and let the caller choose. If the caller insists on an unavailable time, the agent will offer to take a message and hand the slot request to a human.

## Edge cases

If the calendar is fully booked for the next two weeks, the agent flags that to the caller upfront so the conversation does not waste time chasing a slot that does not exist. If the booking fails because the slot was just taken by another booker, the agent apologizes, re-checks availability, and tries again. If the caller wants a slot outside the bookable window — three months out, for example — the agent will offer to take a message instead.

## Verification

Before go-live, we run an end-to-end booking test on every event type and send you the confirmation emails so you can see what your customers will see.
`.trim(),
};
