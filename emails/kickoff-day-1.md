---
template: kickoff-day-1
esp: resend
trigger: stripe.checkout.session.completed
delay: 24h
from_name: "Alexander at TrainYourAgent"
from_email: "alexander@trainyouragent.com"
reply_to: "alexander@trainyouragent.com"
subject: "Day 1 of your build — here's the schedule"
preview: "Kickoff call in the next 48 hours, first draft by day 3, live on your line by day 7."
liquid_vars:
  - customer.first_name
  - customer.company
  - kickoff.cal_url
  - dashboard.url
  - support.slack_url
---

Hi {{ customer.first_name }},

Welcome aboard. Quick note from me so you know exactly what the next 7 days look like.

**This week, in order:**

- **Day 1 (today):** You'll get a calendar link from me to book the kickoff call. It's 30 minutes, just us — no sales reps, no account manager.
- **Day 2:** Kickoff call. We listen to current call recordings if you have them, walk through your script, and write back the build scope in plain English the same day.
- **Day 3:** First voice draft. You'll get 3 voice samples to pick from and the opening line we're going with.
- **Days 4-5:** Build. CRM and calendar wiring, monitoring, fallback routing.
- **Day 6:** Stress test. You and your team call in. We watch transcripts live and turn every weird response into a permanent guardrail.
- **Day 7:** Cutover at 9am ET. The agent goes live on {{ customer.company }}'s real line.

**Two links you'll want bookmarked:**

- Book the kickoff: {{ kickoff.cal_url }}
- Your dashboard (empty until day 7): {{ dashboard.url }}

If anything is unclear, reply to this email — it comes straight to me, not a help desk. There's also a Slack channel waiting for you at {{ support.slack_url }} once you accept the invite.

Excited to ship this.

— Alexander
Founder, TrainYourAgent
