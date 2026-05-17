import type { Doc } from "../../docs";

export const docIntegrationStripe: Doc = {
  slug: "integrating-with-stripe",
  section: "Integrations",
  title: "Integrating with Stripe",
  summary: "How we wire your agent into Stripe so it can take payments, look up subscriptions, send invoices, and handle billing questions safely.",
  targetWords: 500,
  body: `
## What the agent can do

Once connected to Stripe, your agent can do four things on your behalf. It can charge a card or take a payment using a secure payment link generated on the fly during the conversation. It can look up an existing customer or subscription and answer questions about plan, next billing date, or last payment. It can send a Stripe-hosted invoice for a specific amount with a memo line tied to the conversation. It can issue a refund up to a configurable limit, with anything above the limit routed to a human for approval.

What the agent cannot do — by design — is read or transmit card numbers. The agent never sees your customer's card. The customer either pays via a secure link the agent sends them, or via a hosted checkout page they reach through a short URL the agent reads out loud.

## What you need to provide

You need a Stripe account in good standing and a restricted API key with the right scopes. We will send you a short list of the exact scopes to enable inside the Stripe dashboard, typically read access to customers and subscriptions, write access to payment links and invoices, and limited refund permissions. We never need your full secret key. Generating a restricted key takes about three minutes inside Stripe's dashboard.

We also need to know which Stripe products and prices the agent is allowed to sell. We map these to the agent's conversation flows during scoping. A misconfigured price mapping is the single most common Stripe integration mistake, so we triple-check this before go-live.

## How payments work in a conversation

A typical payment conversation goes like this. The agent confirms what the customer wants to buy and the amount. The agent confirms the customer's email. The agent generates a Stripe payment link tied to that customer and that exact amount, sends it via SMS or email, and waits up to two minutes for the payment webhook to confirm completion. Once the webhook fires, the agent confirms the payment back to the customer and moves on. If the payment fails or times out, the agent offers to try again or transfers to a human.

## Refunds and disputes

For refunds, you set a maximum amount the agent can refund autonomously — typically one to two hundred dollars. Anything above that limit gets routed to a human. The agent never handles dispute responses directly because those carry legal and reputational risk that should always stay in human hands.

## Webhooks

We listen to Stripe webhooks for payment success, payment failure, subscription created, subscription updated, and refund completed. Each webhook updates the corresponding HubSpot or CRM record so your team has a single view of the customer's payment state without needing to log into Stripe.

## Security

We follow PCI scope-minimization best practices. The agent never sees card data. All API calls run over TLS. The restricted API key is rotated quarterly and stored encrypted at rest. You can revoke the key inside Stripe at any time and the integration will fail safely without leaking sensitive data.
`.trim(),
};
