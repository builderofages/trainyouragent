// api/twilio/voice-webhook.ts
// v76-c: Twilio voice webhook. Returns TwiML that connects the inbound PSTN
// call to a Twilio ConversationRelay session (Twilio's WebSocket bridge to
// our LLM). The LLM endpoint defaults to a placeholder relay URL configured
// by env so Alexander can point it at his hosted relay once spun up.
//
// Behaviour:
//   - If TWILIO_RELAY_WSS_URL is set, return ConversationRelay TwiML.
//   - Otherwise return a graceful voicemail TwiML so the line never goes dark.
//
// Twilio configuration:
//   In Twilio console → Phone Numbers → Active Numbers → [number] → Voice:
//     A CALL COMES IN  →  Webhook  →  https://trainyouragent.com/api/twilio/voice-webhook  (HTTP POST)
//     CALL STATUS CHANGES → Webhook → https://trainyouragent.com/api/twilio/status-callback (HTTP POST)
//
// Required env vars:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN  (validate request signature in prod)
//   TWILIO_RELAY_WSS_URL                   (the WS endpoint hosting our LLM relay)
//
// Optional env vars:
//   TWILIO_WELCOME_GREETING                (override the default greeting)
//   TWILIO_TTS_VOICE                       (e.g. "Polly.Joanna", "en-US-Neural2-D")
//   TWILIO_TTS_PROVIDER                    (Google | Amazon | Cartesia | ElevenLabs)
//
// LLM provider: ConversationRelay calls back into our control plane over the
// websocket. The LLM fallback chain (Anthropic → Groq → Gemini) is used by
// the relay process — see api/_lib/llm.ts. This handler only produces TwiML.

import {
  buildConversationRelayTwiml,
  buildFallbackVoicemailTwiml,
} from "../../src/lib/twilio.js";

export const config = { runtime: "edge" };

const RELAY_WSS_URL = process.env.TWILIO_RELAY_WSS_URL || "";
const WELCOME =
  process.env.TWILIO_WELCOME_GREETING ||
  "Hi, thanks for calling. I'm an AI assistant — I can help you book service, answer questions about pricing or hours, or get you to a human. How can I help?";
const TTS_VOICE = process.env.TWILIO_TTS_VOICE || "Polly.Joanna";
const TTS_PROVIDER =
  (process.env.TWILIO_TTS_PROVIDER as
    | "Google"
    | "Amazon"
    | "Cartesia"
    | "ElevenLabs"
    | undefined) || "Amazon";
const VOICEMAIL_FALLBACK =
  "Hi, you've reached TrainYourAgent. We can't take your call right now — please leave a short message and we'll get right back to you.";

export default async function handler(req: Request) {
  // Twilio sends application/x-www-form-urlencoded POSTs. We accept GET too
  // for easy curl-debugging.
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("method not allowed", { status: 405 });
  }

  // Parse Twilio params so we can echo CallSid into the relay URL — useful
  // for the LLM relay to look up customer/account context.
  let params: URLSearchParams;
  if (req.method === "POST") {
    const raw = await req.text();
    params = new URLSearchParams(raw);
  } else {
    params = new URL(req.url).searchParams;
  }
  const callSid = params.get("CallSid") || "";
  const from = params.get("From") || "";
  const to = params.get("To") || "";

  let twiml: string;
  if (RELAY_WSS_URL) {
    // Pass CallSid/From/To as query params so the relay can correlate the
    // WebSocket session with the inbound call.
    const wssUrl = appendQuery(RELAY_WSS_URL, {
      callSid,
      from,
      to,
    });
    twiml = buildConversationRelayTwiml({
      websocketUrl: wssUrl,
      welcomeGreeting: WELCOME,
      voice: TTS_VOICE,
      ttsProvider: TTS_PROVIDER,
      transcriptionProvider: "Deepgram",
    });
  } else {
    // Graceful fallback so the line never goes dark while Alexander wires
    // the relay endpoint up. Records a voicemail and hangs up.
    twiml = buildFallbackVoicemailTwiml({
      message: VOICEMAIL_FALLBACK,
      recordingCallback: "https://www.trainyouragent.com/api/twilio/status-callback",
    });
  }

  return new Response(twiml, {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function appendQuery(url: string, extra: Record<string, string>): string {
  const hasQ = url.includes("?");
  const sep = hasQ ? "&" : "?";
  const qs = Object.entries(extra)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  if (!qs) return url;
  return `${url}${sep}${qs}`;
}
