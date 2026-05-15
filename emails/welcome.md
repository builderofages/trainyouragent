<!--
ESP: beehiiv (transactional automation) OR Resend
Trigger: fires immediately on newsletter signup (api/lead.ts -> beehiiv subscribe)
Variables:
  {{first_name}} — defaults to "there"
  {{email}}      — recipient email
  {{site_url}}   — https://trainyouragent.com
  {{cal_link}}   — https://cal.com/trainyouragent/30min
  {{guide_url}}  — https://trainyouragent.com/api/buyers-guide-pdf?email={{email}}
-->

Subject: Welcome to TrainYourAgent — what to expect.
Preheader: One email a week. Real builds, real numbers, no fluff.

Hey {{first_name | default: "there"}},

Welcome aboard. You just signed up for the TrainYourAgent newsletter — a quick note on what to expect:

**One email a week.** Tuesday morning, US Eastern. No more, occasionally less.

**Three flavors.** Build notes (what we shipped this week and what broke), teardowns (a real AI-voice deployment we picked apart for lessons), and the occasional opinion piece when the market does something dumb.

**No course funnel.** I'm not selling a $2,000 program. I run an AI voice agency in Tampa Bay. The newsletter is how I think out loud, and how I let people decide if we'd be the right fit when they're ready to buy.

Two things you can do right now:

1. Grab the free buyer's guide if you haven't already → {{guide_url}}
2. If you want to talk to me directly, the calendar is open → {{cal_link}}

Reply to this email any time. It comes to my actual inbox.

— Alexander Mills
  Founder, TrainYourAgent
  Tampa Bay, FL
