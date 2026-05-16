---
template: kickoff-day-3
esp: resend
trigger: stripe.checkout.session.completed
delay: 72h
from_name: "Alexander at TrainYourAgent"
from_email: "alexander@trainyouragent.com"
reply_to: "alexander@trainyouragent.com"
subject: "Your agent is being trained on your docs right now"
preview: "Voice samples + opening line + qualification script attached. Read time: 4 minutes."
liquid_vars:
  - customer.first_name
  - customer.company
  - agent.draft_url
  - agent.voice_sample_1_url
  - agent.voice_sample_2_url
  - agent.voice_sample_3_url
  - approve.url
---

Hi {{ customer.first_name }},

Quick midweek update. Your {{ customer.company }} agent is mid-build right now — here's what's done and what we need from you.

**Done:**

- Pulled in your scope notes from the kickoff call.
- Wired the qualification script and the escalation path.
- Drafted three voice samples (see below) and the opening line.
- Connected the CRM and calendar tokens you shared.

**Need from you (today if possible):**

- Pick a voice: [Sample 1]({{ agent.voice_sample_1_url }}) · [Sample 2]({{ agent.voice_sample_2_url }}) · [Sample 3]({{ agent.voice_sample_3_url }})
- Approve the full draft: {{ agent.draft_url }}
- Hit approve here when you're ready: {{ approve.url }}

If a voice sample isn't quite right or the opening line is off, just reply to this email and tell me in your own words what's wrong. We re-cut samples same day.

**What happens next:**

- Day 6: We do a live stress test — you and your team call in.
- Day 7 at 9am ET: Cutover. Your agent answers the real line.

— Alexander
