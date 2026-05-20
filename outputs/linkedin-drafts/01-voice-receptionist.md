# 01 — Voice Receptionist

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/voice-receptionist`

---

I watched an HVAC operator in Phoenix lose $14,200 in one month to missed calls.

He had a Google ads budget bigger than his payroll. Trucks branded, techs trained, a 4.8-star review average. And a 14% voicemail-to-callback rate after 5pm.

The math on missed calls is brutal once you sit with it.

The average service business misses 8–15 calls a week. Lunch hours, after-hours, weekends, when the front-desk is on the other line. Each one of those is a customer who Googled "HVAC near me" and clicked the second result.

Conventional fixes all fail in their own way.

An answering service charges $1.50–$3.00 per call and takes a message. Booking rate on those callbacks: 8–12%. CallRail's auto-attendant is glorified voicemail. The new wave of "AI receptionist" SaaS tools sound robotic because they ship with a generic prompt and never see your actual call transcripts.

Here's what's different now.

A trained voice agent on Twilio + Deepgram Nova-3 + Claude 3.5 Sonnet + Cartesia Sonic-2, with a Pinecone-indexed knowledge base of your service menu, your real pricing, your real escalation rules — books at 35–55% on missed calls. We tone-train it on 2 hours of your own call recordings so the first 15 seconds don't tip the caller off.

The HVAC operator above moved from 14% callback to 47% booked agent calls in week 2.

- Month-1 new revenue captured: $14,200
- Cost to operate: $499/mo
- Payback: 6 days

The build itself starts at $4,500 and ships in 14–21 days. That's the entire playbook.

The thing most operators get wrong: they ship a chatbot and call it an agent. The difference is whether it was trained on your actual business. We sit with you for 2 hours, transcribe your real calls, and the model learns your cadence — not a vendor's idea of how an HVAC dispatcher should sound.

Full playbook with the exact stack, eval rubric, and ROI math: https://trainyouragent.com/capabilities/voice-receptionist

— Alexander
