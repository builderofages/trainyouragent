<!--
ESP: Resend (transactional, fired from api/cal-webhook.ts on BOOKING_CREATED)
Trigger: when a Cal.com booking is confirmed
Variables:
  {{first_name}}      — defaults to "hey"
  {{booking_date}}    — human-readable date+time, e.g. "Tue Mar 18 · 2:00pm ET"
  {{booking_join_url}} — Zoom/Meet link from cal.com payload
  {{call_type}}        — event-type title, e.g. "30 min scoping call"
  {{cal_reschedule_url}} — cal.com reschedule deep-link
-->

Subject: Locked in for {{booking_date}} — here's how to prep
Preheader: 5 minutes of prep makes the call 10x more useful.

{{first_name | default: "Hey"}} —

Confirmed for **{{booking_date}}**. Calendar invite landed in your inbox separately with the {{call_type}} details.

Five minutes of prep makes this 10x more useful. Before we hop on:

**1. Pick your top 3 inbound call types.** Not "every call we get" — the three that come up most often. (e.g. "new patient intake", "appointment reschedule", "billing question".) If you can give me rough percentages of total inbound volume, even better.

**2. Estimate your current call volume.** Daily or weekly count is fine. If you don't know exactly, take your best guess.

**3. Be honest about your current process.** Who answers the phone today? An in-house receptionist? An answering service? Voicemail-and-callback? It changes the math entirely.

**4. Bring one specific concern.** Whatever the thing is that's making you doubt this — bring it to the call. The good vendor sale is the one that respects the doubt.

The call link will be in your calendar invite. If anything changes on your end: {{cal_reschedule_url}}

Talk soon.

— Alexander Mills
  Founder, TrainYourAgent
