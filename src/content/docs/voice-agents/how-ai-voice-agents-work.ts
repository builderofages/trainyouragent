import type { Doc } from "../../docs";

export const docHowVoiceWorks: Doc = {
  slug: "how-ai-voice-agents-work",
  section: "Voice agents",
  title: "How AI voice agents work",
  summary: "End-to-end view of the stack underneath a modern voice agent — telephony, speech recognition, language model, voice synthesis, and the orchestration glue between them.",
  targetWords: 800,
  body: `
## The big picture

A modern AI voice agent is not a single piece of software. It is a chain of five components running in sequence, every two hundred milliseconds, for the entire length of a call. When you hear a friend tell you they "built a bot in an afternoon", what they actually mean is they wired five mature services together with a thin layer of orchestration code. Knowing what each component does is the difference between an agent that feels alive and one that feels like a phone tree.

## The five layers

\`\`\`
                  +-----------------+
                  | 1. Telephony    |   carrier, SIP trunk, audio in/out
                  +--------+--------+
                           |
                           v
                  +-----------------+
                  | 2. STT          |   speech-to-text, streaming
                  +--------+--------+
                           |
                           v
                  +-----------------+
                  | 3. LLM          |   reasoning, tool calls, memory
                  +--------+--------+
                           |
                           v
                  +-----------------+
                  | 4. TTS          |   text-to-voice, prosody
                  +--------+--------+
                           |
                           v
                  +-----------------+
                  | 5. Orchestrator |   barge-in, turn-taking, fallback
                  +-----------------+
\`\`\`

## Layer one: telephony

Your customer dials a phone number. That number is provisioned through a SIP carrier — Twilio, Telnyx, Plivo, or similar — and the audio stream is forwarded to your agent service as a low-latency real-time bidirectional connection. The carrier handles ringing, call setup, recording compliance, regional number rules, and the boring billing details. Your agent service only sees audio bytes flowing in and out. The carrier is also where you handle warm transfer to a human, hold music, voicemail drop, and call recording.

## Layer two: speech-to-text

Incoming audio is streamed to a speech-to-text service that returns partial transcripts every few hundred milliseconds. Deepgram, Whisper, AssemblyAI, and the major cloud providers all offer streaming endpoints. Streaming matters because batch transcription waits for the speaker to stop talking, which adds a full second of dead air to every turn. With streaming, the agent has a draft transcript almost instantly and can start thinking about its response before the caller has finished the sentence.

## Layer three: the language model

The transcript flows into a language model with a system prompt that describes who the agent is, what it can do, what it must never do, and which tools it has access to. The model decides whether to answer directly, ask a clarifying question, look something up via a tool call, or hand off to a human. Tool calls are how the agent actually does things in the real world — query the CRM, check inventory, book a calendar slot, charge a card, send a confirmation text.

Good agents are not one giant prompt. They are a small main prompt that delegates specific tasks to small, well-tested sub-prompts. A booking flow, a returns flow, a complaint-routing flow — each is its own focused prompt that the main agent invokes when the conversation enters that territory.

## Layer four: text-to-speech

The model's response text is sent to a voice synthesis service that returns audio. ElevenLabs, Cartesia, PlayHT, and the major cloud TTS engines are the common choices. Streaming TTS matters as much as streaming STT — you want the first phoneme to leave the speakers before the model has finished generating the full sentence, otherwise the caller hears a noticeable pause after every turn.

Voice choice matters more than people expect. A voice that sounds slightly too perfect lands in the uncanny valley and customers hang up. A voice with a small amount of natural variation, the right speaking pace, and accurate prosody will pass for a human in most short interactions.

## Layer five: the orchestrator

The orchestrator is the glue layer where all the unsexy real-world problems live. Barge-in detection — what happens when the caller starts talking while the agent is mid-sentence. Turn-taking — knowing when a pause means "your turn" versus "I am still thinking." Backchanneling — the little "mm-hmm" and "right" sounds that humans use to signal they are still on the line. Timeouts, retries, fallback voice prompts when an upstream service is down, and a graceful exit when something genuinely cannot be handled.

This is the layer that separates a demo from a production agent. The first four layers are off-the-shelf. The orchestrator is where the work lives, and where most vendors cut corners. When you hear a voice agent that "just feels alive", you are hearing a well-built orchestrator more than anything else.

## Latency budget

A natural conversation has roughly a five hundred millisecond turn-around between one person finishing and the other starting. Once you exceed eight hundred milliseconds, the caller starts to feel the lag. Once you exceed one full second, the caller starts to think the line dropped. The latency budget for a voice agent is therefore extremely tight, and every layer above has to be tuned to hit it.
`.trim(),
};
