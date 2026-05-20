# 04 — Objection Handling Sequences

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/objection-handling-system`

---

Your sales team handles the same 12 objections every week.

I'll just show you the list from a roofing client we shipped last quarter:

1. "I want to think about it"
2. "I need to talk to my spouse"
3. "We're getting other quotes"
4. "It's too expensive"
5. "Insurance is going to cover this — why am I paying anything?"
6. "Can you do it cheaper?"
7. "I had a bad experience with [competitor]"
8. "What if it leaks again?"
9. "We don't have it in the budget this quarter"
10. "Is the warranty really good?"
11. "I want to wait until spring"
12. "I need to check the BBB / Google reviews first"

You've heard every one of these. Your closer has heard them so often the response is muscle memory. But the closer isn't on every call — and the new SDR on week 3 hasn't built the muscle memory yet, so 40% of objections that should be reversible turn into "I'll get back to you" → ghost.

That's the gap the objection-handling system closes.

Here's how we build it.

**Step 1.** We pull 200 of your closed-won calls and 100 of your closed-lost calls. Whisper them through AssemblyAI. Extract the moments where an objection surfaced and the response that worked (or didn't).

**Step 2.** Cluster the objections into the 10–15 patterns. Tag each with the win/loss outcome and the language pattern that produced it. This becomes the training set.

**Step 3.** Build the response library — not as prompts, as conversation flows. Each objection has 2–3 graded responses ranging from soft empathy to direct close, picked at runtime based on the prospect's tone (we score warmth via the LLM in real time).

**Step 4.** Deploy in two places: (a) the AI agent's voice/chat flow handles them directly, (b) a Slack-side closer copilot whispers the recommended response to your human reps live during the call.

The roofing client above moved closed-won rate from 22% to 31% in 90 days. Average deal size was $14K. Net new revenue: ~$340K/quarter for an ops business doing ~$4M ARR.

Build: $6,500 (includes the 300-call transcription + clustering). Ships in 21–28 days.

The thing that surprises operators most: the responses we use are the operator's own language, lifted verbatim from their closed-won calls. We don't write sales scripts. We extract them.

Full playbook with the 12-objection taxonomy + the clustering methodology: https://trainyouragent.com/capabilities/objection-handling-system

— Alexander
