// api/tts.ts — Vercel edge function. Premium text-to-speech.
//
// v91: kills the robotic browser-native window.speechSynthesis voice on
// /voice-demo by routing TTS through real TTS providers.
//
// Provider chain (same pattern as /api/chat):
//   1. OpenAI TTS    — $0.015/min, sounds like ChatGPT voice mode (alloy/nova)
//   2. ElevenLabs    — $0.18/min equiv, best-in-class for production
//   3. (fallback)    — frontend reverts to window.speechSynthesis if 503
//
// Hardening:
//   - 30 messages / IP / hour rate limit (TTS is per-character expensive)
//   - 1500 char max input (~30 seconds of speech, plenty for receptionist replies)
//   - CORS allowlist
//   - Provider keys never logged
//   - Returns audio/mpeg or audio/wav directly to <audio> tag

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const MAX_INPUT_CHARS = 1500;
const TIMEOUT_MS = 15_000;

// OpenAI TTS: 6 voices, alloy is warmest. tts-1 is fast, tts-1-hd is higher quality
// but ~2x latency. For receptionist back-and-forth we want fast.
const OPENAI_MODEL = process.env.OPENAI_TTS_MODEL || "tts-1";
const OPENAI_VOICE = process.env.OPENAI_TTS_VOICE || "alloy";

// ElevenLabs voice IDs (verified production IDs from ElevenLabs voice library):
//   Charlotte: XB0fDUnXU5powFXDhCwa — smooth, sultry, confident female (BRAND DEFAULT)
//   Sarah:     EXAVITQu4vr4xnSDxMaL — warm, professional young female
//   Bella:     EXAVITQu4vr4xnSDxMaL — soft, expressive young female
//   Rachel:    21m00Tcm4TlvDq8ikWAM — calm, professional female
// v92: Charlotte picked as default — founder direction: "hot woman's voice, sexy
// assistant, not too sexual." Charlotte is the closest match in the ElevenLabs
// stock library: poised, confident, slight rasp, professional edge.
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "XB0fDUnXU5powFXDhCwa";
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5";

function withTimeout(p: Promise<Response>): Promise<Response> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
    p.then((r) => { clearTimeout(t); resolve(r); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405,
      headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const ip = ipFromRequest(req);
  const rl = rateLimit(`tts:${ip}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: "rate-limited" }), {
      status: 429,
      headers: { "content-type": "application/json", ...cors.headers, ...rl.headers },
    });
  }

  let body: { text?: string; voice?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "bad-json" }), {
      status: 400,
      headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const text = String(body.text || "").trim();
  if (!text) {
    return new Response(JSON.stringify({ ok: false, error: "missing-text" }), {
      status: 400,
      headers: { "content-type": "application/json", ...cors.headers },
    });
  }
  if (text.length > MAX_INPUT_CHARS) {
    return new Response(JSON.stringify({ ok: false, error: "too-long", max: MAX_INPUT_CHARS }), {
      status: 413,
      headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  // ── PROVIDER CHAIN ─────────────────────────────────────────────────────────
  // v92: ElevenLabs PRIMARY (founder has account + voice picked = Charlotte).
  // OpenAI TTS is secondary fallback (still cheaper if ElevenLabs runs out
  // of monthly char budget). Browser TTS is last-resort.
  // 1) ElevenLabs — primary (best human voice, Charlotte = sultry-professional)
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      const voiceId = body.voice || ELEVENLABS_VOICE_ID;
      const r = await withTimeout(fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY,
            "content-type": "application/json",
            accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: ELEVENLABS_MODEL,
            voice_settings: {
              stability: 0.4,
              similarity_boost: 0.85,
              style: 0.2,
              use_speaker_boost: true,
            },
          }),
        },
      ));
      if (r.ok) {
        const buf = await r.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "content-type": "audio/mpeg",
            "cache-control": "public, max-age=3600",
            "x-tts-provider": "elevenlabs",
            ...cors.headers,
            ...rl.headers,
          },
        });
      }
    } catch {
      // fall through
    }
  }

  // 2) OpenAI TTS — fallback (if ElevenLabs char budget exhausted or key missing)
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await withTimeout(fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          voice: body.voice || OPENAI_VOICE,
          input: text,
          response_format: "mp3",
          speed: 1.05,
        }),
      }));
      if (r.ok) {
        const buf = await r.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "content-type": "audio/mpeg",
            "cache-control": "public, max-age=3600",
            "x-tts-provider": "openai",
            ...cors.headers,
            ...rl.headers,
          },
        });
      }
    } catch {
      // fall through
    }
  }

  // 3) No TTS provider configured / both failed → 503, frontend reverts to
  //    window.speechSynthesis. Demo never goes silent.
  return new Response(JSON.stringify({
    ok: false,
    error: "tts-unavailable",
    hint: "Set OPENAI_API_KEY or ELEVENLABS_API_KEY in Vercel env to enable premium TTS. Frontend will fall back to browser native voice.",
  }), {
    status: 503,
    headers: { "content-type": "application/json", ...cors.headers, ...rl.headers },
  });
}
