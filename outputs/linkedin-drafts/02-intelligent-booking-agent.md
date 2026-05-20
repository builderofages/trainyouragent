# 02 — Intelligent Booking Agent

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/intelligent-booking-agent`

---

Double-booking destroys more service businesses than missed calls do.

Missed calls cost you revenue. Double-booked appointments cost you reviews, refunds, and the trust of the customers you already have.

I watched a med spa double-book three Botox appointments in one Saturday because the front-desk booked into Mindbody, the website booked into Calendly, and the inbound voicemail callback was rebooked manually into a paper calendar. Three customers showed up. Two left angry. One left a 1-star Google review that took six months of clean operations to dilute.

The fix isn't another booking tool. It's a booking agent that owns calendar state.

A booking agent that doesn't double-book is doing four things conventional schedulers don't.

1. **It writes to the calendar live, mid-call.** Not "I'll send you a confirmation." A real ICS event in your Cal.com, Acuity, Calendly, Square, Jobber, Housecall Pro, or ServiceTitan — created before the caller hangs up.

2. **It respects travel time.** Service business calendars are not 30-minute grid slots. A morning job in zip 33606 and a noon job in zip 33614 is 35 minutes of travel — the agent knows this and either pads the slot or declines it. We use Google Distance Matrix at booking time.

3. **It honors capacity rules.** Two techs in the field means two simultaneous jobs max. Three is overbooking, even if the calendar shows a free slot. The agent reads the rule from a config we write together in week 1.

4. **It rebooks under conflict.** When something slips (tech runs late, customer cancels), the agent walks the affected customers through reschedule options in their preferred channel — voice, SMS, or email — without you touching it.

Stack: Twilio + Anthropic Claude Sonnet + your scheduling API + a thin state layer in Postgres + a webhook listener for cancellations.

Build: $4,500–$7,500 depending on integration count. Ships in 14–21 days.

The med spa above hasn't double-booked since week 2 of deployment. That alone paid for the build in month one.

Full playbook with the exact API integration patterns, capacity-rule schema, and the rebooking-conflict eval suite: https://trainyouragent.com/capabilities/intelligent-booking-agent

— Alexander
