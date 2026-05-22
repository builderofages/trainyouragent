// src/components/VoiceAgent.tsx
// v52a / v91: In-browser voice agent demo. Premium TTS where it counts,
// free fallback where it doesn't.
//   - STT: Web Speech API (Chrome / Edge / Safari iOS 14.5+) — FREE
//   - LLM: /api/chat with mode="voice-receptionist" — Anthropic → Groq → Gemini
//   - TTS: /api/tts → OpenAI TTS (~$0.015/min) → ElevenLabs ($0.18/min equiv)
//          → window.speechSynthesis (free fallback if no premium keys set)
//
// State machine: idle -> listening -> thinking -> speaking -> idle
// Designed to be lazy-loaded so it doesn't bloat the main entry chunk.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Turn = { role: "user" | "agent"; text: string; ts: number };
type Status = "idle" | "listening" | "thinking" | "speaking" | "error";

const SUGGESTIONS = [
  "My A/C just died and I need someone out today.",
  "What are your hours, and do you take Anthem?",
  "I want to schedule a quote for a new water heater.",
];

const SYSTEM_NAME = "TrainYourAgent Receptionist";

/** Pick the best browser voice we can find. Prefers en-US, natural-sounding. */
function pickBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferOrder = [
    "Samantha",                 // macOS / iOS — warm female
    "Google US English",        // Chrome desktop
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Microsoft Zira - English (United States)",
    "Karen",                    // en-AU but pleasant
  ];
  for (const name of preferOrder) {
    const v = voices.find((x) => x.name === name);
    if (v) return v;
  }
  // Otherwise: any en-US voice marked as default, then any en-* voice.
  return (
    voices.find((v) => v.lang === "en-US" && v.default) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

// Web Speech API types — lib.dom doesn't always include them in older TS
// configs, and we're targeting Chrome/Edge/Safari which all expose them
// through window.SpeechRecognition or window.webkitSpeechRecognition.
type SpeechRecognitionLike = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((e: Event) => void) | null;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: ((e: Event) => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognitionLike };
    webkitSpeechRecognition?: { new (): SpeechRecognitionLike };
  }
}

export default function VoiceAgent() {
  const [status, setStatus] = useState<Status>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [interim, setInterim] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(true);
  const [voicesReady, setVoicesReady] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Detect browser support up front.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
  }, []);

  // Voice list loads async on some browsers (Chrome).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => {
      voiceRef.current = pickBestVoice();
      setVoicesReady(true);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Auto-scroll transcript.
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [turns, interim]);

  // v91: TTS pipeline.
  // Primary path: hit /api/tts → OpenAI TTS (sounds like ChatGPT voice mode)
  //   or ElevenLabs (best-in-class). Plays the returned audio/mpeg via an
  //   HTMLAudioElement. Sounds human, no more 2010-GPS robot.
  // Fallback path: if /api/tts returns 503 (no keys configured), revert to
  //   browser-native window.speechSynthesis so demo never goes silent.
  const speak = useCallback((text: string): Promise<void> => {
    return new Promise(async (resolve) => {
      if (!text) { resolve(); return; }

      // Try premium TTS first.
      try {
        const r = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (r.ok) {
          const buf = await r.arrayBuffer();
          const url = URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" }));
          const audio = new Audio(url);
          audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
          audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
          await audio.play().catch(() => resolve());
          return;
        }
        // r.status === 503 → fall through to browser TTS
      } catch {
        // network error → fall through
      }

      // Fallback: browser-native (robotic but always works).
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = voiceRef.current || pickBestVoice();
      if (v) u.voice = v;
      u.rate = 1.02;
      u.pitch = 1.0;
      u.volume = 1.0;
      u.lang = (v?.lang) || "en-US";
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }, []);

  const askAgent = useCallback(
    async (userText: string) => {
      setStatus("thinking");
      const next: Turn[] = [...turns, { role: "user", text: userText, ts: Date.now() }];
      setTurns(next);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "voice-receptionist",
            messages: next
              .slice(-12)
              .map((t) => ({
                role: t.role === "user" ? "user" : "assistant",
                content: t.text,
              })),
          }),
        });
        const text = (await res.text()).trim() || "Sorry — I couldn't catch that. Could you say it again?";
        const prov = res.headers.get("x-llm-provider") || "";
        if (prov) setProvider(prov);

        setTurns((prev) => [...prev, { role: "agent", text, ts: Date.now() }]);
        setStatus("speaking");
        await speak(text);
        setStatus("idle");
      } catch (e) {
        setErrorMsg((e as Error).message || "Network error");
        setStatus("error");
      }
    },
    [turns, speak]
  );

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    // If TTS is speaking, stop it so we don't pick up our own audio.
    if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    let finalText = "";
    rec.onstart = () => {
      setStatus("listening");
      setErrorMsg("");
      setInterim("");
    };
    rec.onresult = (e) => {
      let inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i] as ArrayLike<{ transcript: string }> & { isFinal: boolean };
        if (r.isFinal) finalText += r[0].transcript;
        else inter += r[0].transcript;
      }
      setInterim(inter);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setErrorMsg("Microphone access blocked. Please allow mic access and try again.");
      } else if (e.error === "no-speech") {
        setErrorMsg("Didn't catch that — tap and try again.");
      } else {
        setErrorMsg(`Mic error: ${e.error}`);
      }
      setStatus("error");
    };
    rec.onend = () => {
      const text = finalText.trim();
      setInterim("");
      if (text) {
        void askAgent(text);
      } else if (status === "listening") {
        setStatus("idle");
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      // Some browsers throw if start() is called twice.
      setStatus("idle");
    }
  }, [askAgent, status]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    setStatus("idle");
    setInterim("");
  }, []);

  const reset = useCallback(() => {
    stopListening();
    setTurns([]);
    setProvider("");
    setErrorMsg("");
  }, [stopListening]);

  const sendSuggestion = useCallback(
    async (text: string) => {
      if (status === "listening") stopListening();
      await askAgent(text);
    },
    [askAgent, status, stopListening]
  );

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch { /* ignore */ }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  if (!supported) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl border border-slate-200 bg-white">
        <h2 className="text-xl font-semibold text-[#042C53] mb-2">Browser not supported</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          The free voice demo uses the Web Speech API, which works in <strong>Chrome</strong>,
          <strong> Edge</strong>, and <strong>Safari on iOS 14.5+</strong>. On unsupported browsers,
          try our text-only demos instead.
        </p>
        <a
          href="/demos/sales-objection-handler"
          className="mt-4 inline-block px-5 py-2.5 rounded-full bg-[#042C53] text-white text-sm font-semibold hover:bg-[#0A3E73] transition"
        >
          Try the text demos →
        </a>
      </div>
    );
  }

  const buttonLabel =
    status === "listening"
      ? "Listening… tap to stop"
      : status === "thinking"
      ? "Thinking…"
      : status === "speaking"
      ? "Speaking…"
      : "Tap to start";

  return (
    <div className="w-full max-w-3xl mx-auto" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <style>{`
        @keyframes tya-pulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%      { transform: scale(1.07); opacity: 0.92; }
        }
        @keyframes tya-wave {
          0%, 100% { transform: scaleY(0.4); }
          50%      { transform: scaleY(1.0); }
        }
        @keyframes tya-dot {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40%           { opacity: 1;    transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tya-anim { animation: none !important; }
        }
      `}</style>

      {/* Transcript */}
      <div
        ref={transcriptRef}
        className="min-h-[180px] max-h-[280px] overflow-y-auto rounded-2xl bg-[#F6FAFE] border border-[#E6F1FB] p-5 mb-6 flex flex-col gap-3"
        aria-live="polite"
      >
        {turns.length === 0 && status === "idle" && (
          <p className="text-slate-500 text-sm italic text-center my-auto">
            Your conversation with the {SYSTEM_NAME.toLowerCase()} will appear here.
          </p>
        )}
        {turns.map((t, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] leading-snug ${
              t.role === "user"
                ? "self-end bg-[#185FA5] text-white rounded-br-md"
                : "self-start bg-white text-[#042C53] border border-[#E6F1FB] rounded-bl-md"
            }`}
          >
            {t.text}
          </div>
        ))}
        {interim && (
          <div className="self-end max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[#185FA5]/50 text-white text-[15px] italic">
            {interim}
          </div>
        )}
        {status === "thinking" && (
          <div className="self-start flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-[#E6F1FB]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="tya-anim inline-block w-2 h-2 rounded-full bg-[#185FA5]"
                style={{
                  animation: prefersReducedMotion ? "none" : `tya-dot 1.2s infinite ${i * 0.15}s ease-in-out`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mic button + status */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={status === "listening" ? stopListening : startListening}
          disabled={status === "thinking" || status === "speaking"}
          aria-label={buttonLabel}
          className="relative w-32 h-32 rounded-full flex items-center justify-center text-white shadow-xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#185FA5]/40 disabled:cursor-wait"
          style={{
            background:
              status === "listening"
                ? "linear-gradient(135deg,#E11D48,#9F1239)"
                : status === "speaking"
                ? "linear-gradient(135deg,#10B981,#047857)"
                : status === "thinking"
                ? "linear-gradient(135deg,#185FA5,#042C53)"
                : "linear-gradient(135deg,#185FA5,#042C53)",
          }}
        >
          {status === "listening" && !prefersReducedMotion && (
            <>
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(225,29,72,0.35)",
                  animation: "tya-pulse 1.4s ease-in-out infinite",
                }}
              />
              <span
                aria-hidden
                className="absolute -inset-3 rounded-full border-2 border-[#E11D48]/40"
                style={{ animation: "tya-pulse 1.8s ease-in-out infinite 0.2s" }}
              />
            </>
          )}
          {status === "speaking" ? (
            <div className="relative z-10 flex items-end gap-1 h-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1.5 bg-white rounded-full"
                  style={{
                    height: 28,
                    transformOrigin: "center",
                    animation: prefersReducedMotion
                      ? "none"
                      : `tya-wave 0.9s ease-in-out infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <svg className="relative z-10 w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        <div className="mt-4 text-[13px] uppercase tracking-[0.18em] font-semibold text-[#185FA5]">
          {buttonLabel}
        </div>

        {errorMsg && (
          <div className="mt-3 text-[13px] text-rose-700 max-w-md text-center">{errorMsg}</div>
        )}

        {provider && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F1FB] text-[12px] text-[#042C53]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Powered by {providerLabel(provider)}
          </div>
        )}

        {turns.length > 0 && (
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-[12px] text-slate-500 underline hover:text-[#042C53]"
          >
            Reset conversation
          </button>
        )}
      </div>

      {/* Try saying */}
      <div className="mt-8">
        <div className="text-[12px] uppercase tracking-[0.18em] font-semibold text-slate-500 mb-3 text-center">
          Try saying
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendSuggestion(s)}
              disabled={status === "thinking" || status === "speaking" || status === "listening"}
              className="px-4 py-2 rounded-full border border-slate-300 bg-white text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-[#F6FAFE] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>
        {!voicesReady && (
          <p className="mt-3 text-[12px] text-slate-400 text-center italic">
            Loading voices…
          </p>
        )}
      </div>
    </div>
  );
}

function providerLabel(p: string): string {
  if (p.includes("groq")) return "Groq · Llama 3.3 70B";
  if (p.includes("anthropic")) return "Anthropic · Claude";
  if (p.includes("gemini")) return "Google · Gemini";
  if (p === "offline") return "Offline mode";
  return p;
}
