---
template: kickoff-day-7
esp: resend
trigger: stripe.checkout.session.completed
delay: 168h
from_name: "Alexander at TrainYourAgent"
from_email: "alexander@trainyouragent.com"
reply_to: "alexander@trainyouragent.com"
subject: "Your agent goes live tomorrow at 9am ET — here's what to expect"
preview: "Cutover plan, fallback plan, and the dashboard link. 24-hour countdown."
liquid_vars:
  - customer.first_name
  - customer.company
  - agent.phone_number
  - dashboard.url
  - support.slack_url
  - status.url
---

Hi {{ customer.first_name }},

Tomorrow at 9am ET your {{ customer.company }} agent picks up the phone for the first time. Here's the plan.

**Cutover sequence (9:00–9:15 ET):**

1. We update the SIP route so calls to {{ agent.phone_number }} hit the agent.
2. We dial in twice ourselves to confirm the route is healthy.
3. I send you a Loom confirming we're live, with a link to the dashboard: {{ dashboard.url }}

**What happens on the dashboard:**

- Every call appears within 30 seconds of hanging up — transcript, audio, booking outcome, and a quality score.
- We're watching the same dashboard for the first 72 hours, so if anything looks off we catch it before you do.

**Fallback plan:**

- If the agent ever fails a call (rare — every escalation path is double-routed), the call falls back to a deterministic IVR you'll have already approved. Nothing ever drops.
- For the first 7 days post-launch we monitor at 5-minute granularity. After that it's hourly.

**Stay in touch:**

- Slack channel: {{ support.slack_url }} (this is your direct line — reply there, not to support@).
- Live status: {{ status.url }} (we publish every incident, no spin).

This is the part where six months of "AI demos" you've sat through finally turn into a phone line that just works. See you on the other side of 9am.

— Alexander
Founder, TrainYourAgent
