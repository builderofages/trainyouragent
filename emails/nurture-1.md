<!--
ESP: beehiiv (sequence) OR Resend
Trigger: Day 2 after newsletter signup
Variables:
  {{first_name}} — defaults to "hey"
  {{site_url}}   — https://trainyouragent.com
  {{cal_link}}   — https://cal.com/trainyouragent/30min
-->

Subject: What we shipped this week
Preheader: Three real builds, one of them broke spectacularly.

{{first_name | default: "Hey"}} —

Quick one. Here's what hit production this week at TrainYourAgent:

**1. Inbound intake for a 4-location dental group.** Replaced their answering service. First 72 hours: 142 calls handled, 38 booked appointments, 0 escalations. Average call cost: $0.11. Their old answering service was $4.20/call.

**2. After-hours overflow for an HVAC operator in Phoenix.** Pure overflow play — the agent picks up when the human dispatcher is on another line. Shipped Tuesday, broke Wednesday because the calendar API rate-limited us at 6am after a heatwave-driven call surge. Fixed by Thursday with a backoff queue. Lesson: always assume your downstream APIs will throttle you on the worst possible day.

**3. Outbound re-engagement for a med-spa chain.** Calls warm leads from the last 90 days who never booked. 1,200 calls dialed, 184 conversations, 31 booked. Cost per booked appointment: $7.40.

The HVAC build is the one I learned the most from. If you're vetting voice vendors, ask them: "what's your retry/backoff strategy when my downstream API rate-limits you mid-call?" If they look confused, they haven't been to production.

That's it for this week.

— Alexander
  TrainYourAgent

P.S. If you want to see what one of these builds looks like for your business, the calendar is here: {{cal_link}}
