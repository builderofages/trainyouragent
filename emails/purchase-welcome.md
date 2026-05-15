<!--
ESP: Resend (transactional, fired from api/stripe-webhook.ts on checkout.session.completed)
Trigger: after successful Stripe purchase
Variables:
  {{first_name}}    — defaults to "hey"
  {{plan_name}}     — Stripe plan label, e.g. "Operators" or "Founders Build"
  {{cal_link}}      — https://cal.com/trainyouragent/30min  (kickoff link)
  {{dashboard_url}} — https://trainyouragent.com/dashboard
  {{support_email}} — hello@trainyouragent.com
-->

Subject: Welcome aboard — here's day-1 through day-7
Preheader: What we'll do together this week.

{{first_name | default: "Hey"}} —

Welcome to TrainYourAgent. Your **{{plan_name}}** is live.

Here's the next seven days, in order:

**Day 1 (today)** — Book your kickoff call: {{cal_link}}. We do this same-week so we're not losing momentum. Pick the earliest slot that works.

**Day 2** — You'll get a short questionnaire from us by email asking for: your top 3 call types, sample transcripts (if you have any), the calendar / CRM / ticketing systems we'll need to integrate with, and the phone number we'll be replacing or augmenting.

**Day 3-4 (kickoff call)** — 60-minute working session. We map your call types to agent skills, agree on the success metric, and lock the integration stack. You'll meet the engineer who will actually build your agent (it's a small team — there's no off-shore handoff).

**Day 5** — First agent build is in your private staging environment. You can call in and test it. We're not aiming for perfection on Day 5 — we're aiming for the first pass that lets us see what's going to need tuning.

**Day 6-7** — We tune based on your feedback. By end of Day 7 you should have an agent that's good enough to start handling a fraction of your real call volume in shadow mode (running alongside your humans, not replacing them yet).

After that, we step into a 2-week production cutover with you.

Anything you need before the kickoff: hit reply, or {{support_email}}.

Excited to build with you.

— Alexander Mills
  Founder, TrainYourAgent
  Tampa Bay, FL
