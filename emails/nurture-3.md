<!--
ESP: beehiiv (sequence) OR Resend
Trigger: Day 10 after newsletter signup
Variables:
  {{first_name}} — defaults to "hey"
  {{cal_link}}   — https://cal.com/trainyouragent/30min
-->

Subject: Inside an active TrainYourAgent build
Preheader: A real customer, real numbers, real lessons.

{{first_name | default: "Hey"}} —

Promised case studies. Here's one we shipped six weeks ago — anonymized at the customer's request, but every number is real.

**The customer.** A 12-location auto repair group in the Southeast. ~3,200 inbound calls a month. Half the calls are status checks ("is my car ready?") and the other half are appointment-shaping ("can you look at this noise it's making?").

**The problem.** Their service writers were spending 40% of their billable hours on the phone. Customer satisfaction was fine. Revenue per writer was 22% below industry average because of phone load.

**The build.** Two agents:
- *Status agent* — handles "is my car ready" by reading from their shop management system. Average call: 47 seconds. Cost: $0.04. Replaces what was a 2-3 minute human call.
- *Intake agent* — handles new appointment booking and existing-appointment shaping. Hands off to a human writer when the diagnosis sounds complex. Hand-off rate: 18%.

**The numbers, week 6.**
- 1,847 calls handled by AI in week 6 (up from 0 in week 0)
- Service writer phone time down 64%
- Same writers booking 31% more revenue
- Customer-satisfaction score: +4 points (turns out humans don't love being put on hold)

**What I learned.** The intake agent's transfer logic is what made or broke this build. We rewrote it three times in the first two weeks. The first version transferred too aggressively (every "weird noise" became a human call). The second version barely transferred at all (caused refund-worthy misdiagnosis). The third version handed off whenever confidence dropped below a threshold AND the customer used emotional language. That's the version in production.

This is the kind of work we do. If you have a pile of inbound and not enough humans to answer it: {{cal_link}}

— Alexander
  TrainYourAgent
