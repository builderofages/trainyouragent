# 06 — Client Onboarding Agent

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/client-onboarding-agent`

---

The most overlooked margin lever in service businesses isn't sales or ops. It's onboarding.

A B2B SaaS client I shipped for last fall was activating new accounts at 37% within their first 14 days. Industry benchmark for their segment was 58%. The difference: the activation playbook was a 6-step process owned by no single person, often skipped entirely when their CS team got busy.

We replaced it with an onboarding agent.

Here's what the agent does, end to end:

**Day 0.** Immediately after Stripe webhook fires `subscription.created`, the agent sends a personalized welcome email (their name, their use case from the signup form, the 3 most relevant getting-started docs picked by RAG over our knowledge base). Not a template. The agent writes it.

**Day 1.** The agent checks if they've completed step 1 (in this case, connected their first integration). If not, it sends a 90-second Loom-style explainer video link plus a Calendly invite for a 15-minute setup call with a human if they want one.

**Day 3.** RAG-powered chat invitation: "Most teams at your stage hit a wall on [specific config]. Want to walk through it together?" — the specific-config text is picked by the agent based on what they've configured so far.

**Day 7.** Activation milestone check. If activated, congratulations + upsell hook for the next tier. If not, the agent escalates to a human CS rep with a 3-paragraph summary of where the customer is stuck (drawn from their event stream).

**Day 14.** Final touch — either a "you're activated, welcome to the long-term club" handoff to the account manager, or a churn-prevention call from a human, with the agent's diagnosis attached.

The SaaS client moved 14-day activation from 37% → 54% in the first 90 days post-deploy. At their LTV math ($4,200 LTV per activated account), that's ~$71K of new MRR per 1000 new signups, persistent.

Stack: Stripe webhooks + your product event stream + RAG over your help center + Anthropic Claude + Resend for email + Cal.com for the human-fallback path.

Cost to build: $7,500–$11,000 depending on event-stream complexity. Ships in 21–28 days.

Where teams get this wrong: they make it a chatbot in their app and expect the customer to come find it. The agent has to push, not wait — every touch is initiated by the system, not by the user.

Full playbook with the 5-touch ladder + the RAG-prompt patterns for personalization: https://trainyouragent.com/capabilities/client-onboarding-agent

— Alexander
