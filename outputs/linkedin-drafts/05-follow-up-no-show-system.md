# 05 — No-Show Recovery & Follow-Up System

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/follow-up-no-show-system`

---

The single highest-ROI agent we ship at TrainYourAgent isn't the receptionist. It's the no-show recovery loop.

Math: a med spa books 800 Botox appointments a quarter at $475 average. Industry no-show rate is ~22%. That's 176 no-shows × $475 = $83,600 of revenue evaporating per quarter on bookings the team already won.

Recover 40% of those no-shows and you net $33,440 in 90 days from inventory that already existed.

The recovery loop has 4 touches and is fully automated.

**Touch 1 — T-48 hours.** SMS confirmation with a one-tap reschedule link. ~7% of bookings reschedule here, which prevents the no-show in the first place.

**Touch 2 — T-2 hours.** Final reminder with parking instructions and the address. Most no-shows happen because the customer can't find the place — this fixes 30% of would-be no-shows.

**Touch 3 — T+15 minutes (after the slot starts).** AI voice agent calls. Friendly tone, no shaming. "Hey [name], we have you booked for [service] at [time] — running late or do you need to reschedule?" The voice agent re-books live on the call, into the same calendar slot if it's still open. Recovery rate at this touch: 18–28%.

**Touch 4 — T+72 hours.** Personalized win-back SMS with a small concession ("$25 toward your next visit if you book by Friday"). Recovery rate: 12–18%.

Stack: Twilio (voice + SMS) + Anthropic Claude (voice agent + personalization) + your booking system API + a Postgres state machine for the touch ladder.

Cost to build: $5,500. Ongoing: $349/mo + Twilio passthrough (~$0.18/min on voice touch, $0.0075/SMS).

The med spa above is running 41% recovery on Touch-3 alone. They added one more chair to their Saturday schedule because they could justify it on recovered revenue.

The hidden value: every touch generates clean data on why the no-show happened. Most operators discover their second-largest reason is something they could solve operationally (e.g. parking-garage signage, intake-form confusion) and stop bleeding the original 22% rate too.

Full playbook with the touch-ladder state machine + the SMS templates that actually convert: https://trainyouragent.com/capabilities/follow-up-no-show-system

— Alexander
