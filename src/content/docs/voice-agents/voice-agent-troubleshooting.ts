import type { Doc } from "../../docs";

export const docVoiceTroubleshooting: Doc = {
  slug: "voice-agent-troubleshooting",
  section: "Voice agents",
  title: "Voice agent troubleshooting",
  summary: "The most common voice agent failure modes, what causes them, and how to fix them fast.",
  targetWords: 600,
  body: `
## The agent feels slow

If the agent feels sluggish, look at the latency budget layer by layer. Start with speech-to-text first-byte latency, then look at the language model time to first token, then the time to first audio out of the TTS engine. In our experience, the single most common cause of slow agents is a TTS service that is not streaming. Switch to streaming TTS first, then look at the LLM call.

If the language model is slow, check whether you are sending more context than you need to. A bloated system prompt with two thousand tokens of background information will cost you two hundred milliseconds on every turn. Trim the prompt, move the rarely-used reference material into a retrieval tool the model can call only when it needs it.

## The agent talks over the caller

This is almost always an orchestrator-level barge-in detection bug. The voice activity detection threshold is too high, or the agent's playback is not being interrupted when speech is detected. Lower the threshold, confirm the orchestrator immediately pauses TTS playback when speech-onset is fired, and add a short cool-down so a quick laugh or a "uh-huh" does not constantly interrupt the agent. Test by deliberately interrupting the agent on every prompt and verifying it yields cleanly.

## The agent mishears specific words

If the agent consistently mishears a particular product name, model number, or proper noun, that is a transcription accuracy problem at the speech-to-text layer. Most major STT providers support a "hints" or "vocabulary boost" feature where you can pre-load the model with the terms it should expect. Add your top fifty domain-specific terms there. For phone numbers, addresses, and dates, use the STT provider's structured output mode rather than free-form transcription.

## The agent hallucinates facts

If the agent invents information — wrong prices, wrong hours, wrong policy — the cause is almost always that the prompt asks the model to be helpful without giving it a way to answer the question correctly. The fix is a retrieval tool. Move the source of truth out of the prompt and into a tool the model can call. Then add a guardrail: if the tool returns nothing, the model should say it does not have that information and offer to take a message or transfer to a human.

## The handoff to a human breaks

If the warm transfer keeps failing, the cause is almost always a misconfigured SIP transfer at the telephony layer. Verify the destination number is in the correct E.164 format, verify the carrier supports the transfer type you are using, and verify there is no firewall rule blocking the SIP REFER. For chronic transfer failures, fall back to dialing the human's number from a fresh outbound call and bridging the two, rather than relying on a carrier-side transfer.

## The agent works in the sandbox but fails in production

The most common cause is a credential or environment difference. Production keys for the CRM, the calendar, the payment processor, and the SMS provider are different from the sandbox keys. Build a pre-launch checklist that hits every integration once with the production credentials before you flip the forwarding live. The second most common cause is real-world audio — bad cell connections, background noise, hold music bleeding into the line. Stress-test with a real cell phone in a noisy room before you go live.

## Nothing else worked

Pull the last ten calls that exhibited the problem. Read the transcripts end to end. The pattern will reveal itself within the first three. Most of the time the fix is a small prompt change, not a system rewrite.
`.trim(),
};
