// src/pages/VoiceDemo.tsx
// v52a: Free, in-browser voice agent demo page at /voice-demo.

import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { injectJsonLdMany } from "@/lib/jsonld";

const VoiceAgent = lazy(() => import("@/components/VoiceAgent"));

const CAL_URL = "https://cal.com/trainyouragent/30min";

function PrismMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="#042C53" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
      <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
      <circle cx="32" cy="32" r="3" fill="#042C53" stroke="none" />
    </svg>
  );
}

export default function VoiceDemo() {
  useEffect(() => {
    document.title = "Talk to a live AI voice agent — TrainYourAgent";

    const desc =
      "Talk to a real AI voice agent right now, free, in your browser. No signup, no install. Powered by Web Speech + Groq Llama 3.3 70B with multi-provider fallback.";
    let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    injectJsonLdMany([
      {
        id: "ld-voice-demo-page",
        data: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "TrainYourAgent — Free Voice Agent Demo",
          url: "https://trainyouragent.com/voice-demo",
          description: desc,
          isPartOf: { "@id": "https://trainyouragent.com/#website" },
        },
      },
      {
        id: "ld-voice-demo-app",
        data: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "TrainYourAgent Voice Receptionist Demo",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          url: "https://trainyouragent.com/voice-demo",
        },
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />

      <main id="main" className="pt-28 pb-24">
        <section className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F1FB] text-[12px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-5">
              <PrismMark size={14} /> Live demo · No signup
            </div>
            <h1 className="text-[32px] sm:text-[48px] md:text-[64px] leading-[1.06] sm:leading-[1.04] tracking-tight font-semibold text-[#042C53] max-w-3xl mx-auto">
              Talk to our AI agent{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                right now.
              </span>
            </h1>
            <p className="mt-5 text-[18px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tap the mic. Talk to a real AI voice receptionist trained for service businesses.
              This is the same agent class we deploy on production phone lines — running for free
              in your browser using the Web Speech API and our multi-provider LLM fallback.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="h-[480px] rounded-2xl bg-[#F6FAFE] border border-[#E6F1FB] flex items-center justify-center text-slate-500">
                Loading voice agent…
              </div>
            }
          >
            <VoiceAgent />
          </Suspense>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            <Feature
              h="100% browser"
              b="Web Speech API for STT and TTS. No backend audio pipeline. Zero ongoing cost."
            />
            <Feature
              h="LLM fallback chain"
              b="Anthropic → Groq → Gemini. If one provider rate-limits, the next answers. No dead air."
            />
            <Feature
              h="Production-grade prompts"
              b="The voice receptionist prompt is the same one we ship for HVAC, dental, salon, and legal lines."
            />
          </div>

          <div className="mt-14 p-7 rounded-2xl bg-[#042C53] text-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 opacity-20" aria-hidden>
              <svg width="240" height="240" viewBox="0 0 64 64" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
                <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
                <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
                <circle cx="32" cy="32" r="3" fill="#FFFFFF" stroke="none" />
              </svg>
            </div>
            <div className="relative max-w-2xl">
              <h2 className="text-[26px] sm:text-[32px] font-semibold leading-tight">
                Want one of these answering{" "}
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                  your
                </span>{" "}
                phone?
              </h2>
              <p className="mt-3 text-[15px] text-[#E6F1FB] leading-relaxed">
                The browser demo is a taste. Production voice agents at TrainYourAgent run on
                Vapi or ElevenLabs with sub-700ms latency, full CRM integration, transfer-to-human,
                and HIPAA-grade logging when you need it. Talk to a human about your use case.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/book"
                  className="inline-flex items-center px-5 py-3 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-[#E6F1FB] transition"
                >
                  Book a call →
                </a>
                <a
                  href={CAL_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center px-5 py-3 rounded-full border border-white/30 text-white text-[14px] hover:bg-white/10 transition"
                >
                  Open Cal.com directly
                </a>
                <Link
                  to="/playbooks"
                  className="inline-flex items-center px-5 py-3 rounded-full border border-white/30 text-white text-[14px] hover:bg-white/10 transition"
                >
                  Niche playbooks
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-10 text-[12px] text-slate-400 text-center max-w-xl mx-auto leading-relaxed">
            Voice demo requires Chrome, Edge, or Safari on iOS 14.5+. Audio is processed locally
            in your browser — we only send the transcribed text to our LLM endpoint. We don't
            store the recording. Rate-limited to keep the demo free.
          </p>
        </section>
      </main>
    </div>
  );
}

function Feature({ h, b }: { h: string; b: string }) {
  return (
    <div className="p-5 rounded-2xl border border-[#E6F1FB] bg-white">
      <div className="text-[15px] font-semibold text-[#042C53] mb-1.5">{h}</div>
      <div className="text-[13px] text-slate-600 leading-relaxed">{b}</div>
    </div>
  );
}
