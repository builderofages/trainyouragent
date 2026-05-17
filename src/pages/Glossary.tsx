// src/pages/Glossary.tsx — v52B
// /glossary — 44 AI terms with the "why it matters for SMBs" line that nobody
// else writes. Sticky alphabet nav, client-side search.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";

type Term = { term: string; def: string; why: string };

const TERMS: Term[] = [
  { term: "A2P 10DLC", def: "Application-to-person 10-digit-long-code registration — the US carrier-mandated process for sending SMS from a business number. Required for legitimate text messaging at any volume.", why: "If you skip this, your outbound texts get filtered into oblivion. We register every voice agent's SMS sender to keep delivery above 95%." },
  { term: "Agent", def: "An LLM-driven system that uses tools, holds state across multiple steps, and executes actions on behalf of a user. Not a chatbot — chatbots respond, agents do.", why: "When you hear 'AI agent' on a sales call, the only thing that matters is whether it can take an action (book the appointment) or just talk about it." },
  { term: "AHT", def: "Average handle time — total time spent on a customer interaction including talk time and after-call work. Standard contact-center metric.", why: "Voice agents have an AHT of 90-120 seconds for typical SMB inquiries vs 4-7 minutes for a human. That's where the ROI starts." },
  { term: "BPM", def: "Business process management — the discipline of mapping, automating, and improving the steps in a business workflow.", why: "An AI agent is a single BPM step. Pretending it's a whole solution is how pilots die." },
  { term: "Cartesia", def: "A voice synthesis (TTS) provider known for sub-100ms first-audio latency, making it the leading choice for real-time voice agents in 2026.", why: "If your voice agent feels laggy and robotic, the TTS provider is usually the bottleneck. Cartesia is what we default to." },
  { term: "CCaaS", def: "Contact-center-as-a-service — cloud-hosted call-center platforms like Five9, NICE, and Genesys. Increasingly bundling AI agent features.", why: "If you already run a CCaaS, your AI agent should plug into it, not replace it. Most SMBs don't need one." },
  { term: "CES", def: "Customer effort score — a one-question survey measuring how hard it was for the customer to get what they needed.", why: "Voice agents that route well drop CES because customers don't have to repeat themselves. That's a measurable win." },
  { term: "Context window", def: "The maximum amount of text (measured in tokens) an LLM can consider in a single inference call. GPT-4 has 128K, Claude has 200K, Gemini has 1M+.", why: "If your knowledge base is huge, you need a model that can ingest it. Otherwise you're stuck building RAG pipelines." },
  { term: "Convai", def: "A platform for building voice-driven conversational AI for games and immersive applications.", why: "Mostly gaming-focused, but the latency techniques bleed into mainstream voice agent work." },
  { term: "CPaaS", def: "Communications-platform-as-a-service — programmable telephony and messaging APIs like Twilio, Vonage, and Plivo. The plumbing under most voice agents.", why: "Your AI agent doesn't talk to the phone network directly. CPaaS handles that. Twilio is the default for a reason." },
  { term: "CSAT", def: "Customer satisfaction score — typically a 1-5 or 1-7 rating asked after a support interaction.", why: "If your voice agent's CSAT is above 4.2, you're in production. Below 3.8, something in the prompt or escalation logic needs work." },
  { term: "Deflection rate", def: "The percentage of customer inquiries resolved by automation without escalating to a human.", why: "The single most important chat-agent metric. 60% is the floor for a well-built agent on a defined task; 85% is the ceiling without sacrificing CSAT." },
  { term: "Eval harness", def: "A test framework that runs an LLM or agent against a curated dataset (the 'golden dataset') to measure accuracy, regressions, and behavior over time.", why: "Without an eval harness, you have no way to know whether your prompt change made things better or worse. We ship one with every build." },
  { term: "ElevenLabs", def: "A text-to-speech provider known for natural prosody and high-fidelity voice cloning. The other dominant choice alongside Cartesia.", why: "Higher fidelity than Cartesia, slightly higher latency. Pick ElevenLabs if your brand voice matters more than ms." },
  { term: "Embedding", def: "A vector representation of text (or other data) that captures semantic meaning. The basis for RAG and similarity search.", why: "If you ever want your agent to recall a relevant FAQ from a 500-doc knowledge base, embeddings are how it finds them." },
  { term: "Fine-tuning", def: "Updating an LLM's weights with custom training data to make it better at a specific domain or task.", why: "Most SMBs don't need fine-tuning. Good prompting + RAG covers 95% of cases. We almost never recommend it for a first build." },
  { term: "Function calling", def: "A model capability where the LLM emits a structured function call (e.g., `bookAppointment({date: ...})`) that your code then executes. The bridge between conversation and action.", why: "This is the line between a chatbot and an agent. If the model can call your booking API, the agent can book the appointment." },
  { term: "Function chaining", def: "Stringing together multiple function calls so the output of one feeds into the next. Lets agents execute multi-step workflows.", why: "Lookup customer → check inventory → book appointment → send SMS. Each step is a function. Chaining is how the agent does the whole thing in one call." },
  { term: "Golden dataset", def: "A hand-curated set of test inputs and expected outputs used to evaluate an LLM or agent's behavior across releases.", why: "Without a golden dataset, you cannot tell if a model upgrade broke anything. We maintain one for every production agent." },
  { term: "Hallucination", def: "When an LLM generates plausible-sounding but factually incorrect output. The single biggest reason buyers distrust AI.", why: "Customer-facing agents must be grounded (RAG, function calling) so they cannot make up answers. We never deploy an agent that can freelance." },
  { term: "HITL", def: "Human-in-the-loop — workflow design where a human reviews or approves AI output before it ships.", why: "For drafts (emails, summaries) HITL works great. For real-time customer calls, HITL kills latency. Know which mode you're in." },
  { term: "IVR", def: "Interactive voice response — the press-1-for-sales menu trees that have plagued business phone systems since the 1990s.", why: "The whole point of a voice agent is to delete the IVR. If you're replacing one, this is the metric: did the IVR survival rate drop?" },
  { term: "JSON mode", def: "A model output mode that guarantees responses conform to valid JSON, often against a specified schema.", why: "Critical for any agent that has to populate a CRM, fire a webhook, or generate structured data. Without JSON mode, you're parsing prose." },
  { term: "LangGraph", def: "A library for building stateful, multi-step agent workflows as directed graphs. Owned by LangChain.", why: "Useful when you have branching agent logic. Overkill for a one-shot Q&A agent. Don't reach for it on day one." },
  { term: "Latency", def: "Total response time from input to output. Measured in ms for voice, seconds for chat.", why: "Voice agents above 1500ms feel broken to humans. Below 800ms feels alive. That single number sells or sinks the demo." },
  { term: "MCP", def: "Model Context Protocol — Anthropic's open standard for connecting LLMs to external tools and data sources. Like USB-C for AI agents.", why: "If your CRM has an MCP server, your agent can talk to it without custom integration work. The ecosystem is exploding in 2026." },
  { term: "Multi-agent", def: "An architecture where multiple specialized agents collaborate (one researches, one writes, one critiques). As opposed to a single generalist agent.", why: "Sometimes the right pattern, often premature complexity. Start with one agent. Add a second only when one provably can't do the job." },
  { term: "Orchestration", def: "The layer that decides which agent, model, or tool runs at each step of a workflow. The conductor of the AI stack.", why: "When something goes wrong in production, it's almost always the orchestration layer. Invest in observability there first." },
  { term: "Pipecat", def: "An open-source framework for building real-time voice and multimodal agents, originally from Daily.co.", why: "Solid choice if you're building voice in-house. We use it for custom-stack clients who want full control." },
  { term: "Prompt injection", def: "A user input crafted to override or manipulate the system instructions of an LLM. The XSS of the agent era.", why: "Every customer-facing agent needs prompt-injection defenses. Otherwise a clever user can make it leak secrets or take unauthorized actions." },
  { term: "RAG", def: "Retrieval-augmented generation — fetching relevant documents from a knowledge base and including them in the LLM prompt so the model can answer from your data rather than its training.", why: "Almost every SMB agent we build is a RAG agent under the hood. It's how the agent knows your prices, hours, and policies." },
  { term: "SIP trunk", def: "A virtual phone line that connects a business phone system to the public phone network over the internet.", why: "Voice agents need a SIP trunk to receive real phone calls. Twilio sells them by the minute. Standard plumbing." },
  { term: "SOC 2", def: "An audit framework for service organizations covering security, availability, processing integrity, confidentiality, and privacy.", why: "Enterprise procurement won't sign without it. SMBs rarely ask. Know which buyer you're selling to." },
  { term: "Speech synthesis", def: "Text-to-speech — turning words into audio. The other half of voice agents (the first half is STT).", why: "Cheap synthesis sounds robotic. Premium synthesis (ElevenLabs, Cartesia) sounds human. The pricing gap is shrinking fast." },
  { term: "Streaming", def: "Returning the model's response token-by-token as it's generated rather than waiting for the full response. Critical for voice and chat UX.", why: "If you've ever watched ChatGPT type its answer, you've seen streaming. Without it, voice agents would feel like talking to a satellite phone." },
  { term: "STT", def: "Speech-to-text — converting spoken audio into text the LLM can process. Whisper, Deepgram, AssemblyAI are the leaders.", why: "STT errors compound. If the agent mis-hears 'Tuesday' as 'twos day,' the rest of the conversation derails. Pick a provider with good word-error-rate metrics." },
  { term: "Temperature", def: "A model parameter (0-2) that controls randomness. Lower = more deterministic, higher = more creative.", why: "Voice agents and structured-output tasks: temperature 0-0.3. Creative writing or brainstorming: 0.7+. Setting it wrong is a very common bug." },
  { term: "Tokens", def: "The chunks of text an LLM processes. Roughly 4 characters per token in English. Pricing is per-token, in and out.", why: "Cost forecasting hinges on token counts. A 60-second call might use 2,000 tokens. At $5 per million, that's a tenth of a cent. Cheap." },
  { term: "Tool use", def: "Generic term for an LLM's ability to invoke external code (function calling, web search, code execution). The capability that makes agents possible.", why: "If a vendor demos a 'smart chatbot' without tool use, it's a chatbot. Walk away." },
  { term: "TTFB", def: "Time to first byte — server-side metric for how fast a response starts streaming. Includes all server processing.", why: "Network and infra optimization, not model choice. Worth measuring once. Then ignore unless something breaks." },
  { term: "TTFT", def: "Time to first token — how quickly an LLM starts streaming its response after receiving the prompt. The latency that the user actually feels.", why: "TTFT below 500ms feels instant. Above 1500ms feels broken. The single most important latency metric for voice and chat." },
  { term: "TTS", def: "Text-to-speech (same as speech synthesis). See entries for ElevenLabs and Cartesia.", why: "The voice your agent uses. Spend the extra few cents per minute on premium TTS — it's the difference between a sale and a hang-up." },
  { term: "Twilio", def: "The dominant CPaaS provider — programmable telephony, SMS, and email. The phone-network plumbing under most voice agent stacks.", why: "If you want a phone number that your voice agent can answer, you go through Twilio. There are alternatives. None as battle-tested." },
  { term: "Vapi", def: "An end-to-end platform for building voice AI agents — bundles STT, LLM, TTS, and telephony into a single API.", why: "Fastest way to ship a working voice agent if you don't want to wire it yourself. Slightly less flexible than a custom Pipecat stack." },
  { term: "Voice cloning", def: "Creating a synthetic TTS voice that matches a real person's voice from a short recording. Both ElevenLabs and Cartesia support this.", why: "Useful for celebrity-fronted brands or founder-led marketing audio. Misuse risks are real — every reputable provider requires consent." },
  { term: "WebRTC", def: "A browser-native protocol for real-time audio, video, and data. The backbone of in-browser voice demos.", why: "Our free /voice-demo runs on WebRTC. Zero install, zero plugins, works in any modern browser." },
  { term: "Whisper", def: "OpenAI's open-source speech-to-text model. Industry-standard accuracy, available as both a hosted API and a self-hostable model.", why: "Default STT for most modern voice agents. Free if you self-host, $0.006/min hosted." },
];

const SORTED = TERMS.slice().sort((a, b) => a.term.localeCompare(b.term));
const LETTERS = Array.from(new Set(SORTED.map((t) => t.term[0].toUpperCase()))).sort();
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Glossary() {
  const [q, setQ] = useState("");

  useEffect(() => {
    document.title = "AI glossary — TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = "https://trainyouragent.com/glossary";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = `${TERMS.length}+ AI terms defined in plain English, with the "why it matters for SMBs" line that nobody else writes.`;
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SORTED;
    return SORTED.filter(
      (t) =>
        t.term.toLowerCase().includes(needle) ||
        t.def.toLowerCase().includes(needle) ||
        t.why.toLowerCase().includes(needle)
    );
  }, [q]);

  const grouped = useMemo(() => {
    const out: Record<string, Term[]> = {};
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      (out[letter] ||= []).push(t);
    }
    return out;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        <section className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Glossary</div>
          <h1 className="text-[40px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
            AI terms,{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              finally explained.
            </span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            {TERMS.length} terms across voice, chat, infrastructure, and metrics.
            Each one has the definition and the why-it-matters-for-SMBs line that
            nobody else writes.
          </p>

          <div className="mt-8 max-w-md">
            <input
              type="search"
              placeholder="Search the glossary…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              aria-label="Search the glossary"
            />
          </div>
        </section>

        <div className="max-w-6xl mx-auto mt-12 grid lg:grid-cols-[1fr_140px] gap-10">
          {/* Definitions */}
          <section className="max-w-3xl">
            {Object.keys(grouped).length === 0 && (
              <p className="text-[15px] text-slate-600">No matches for "{q}". Try a broader term.</p>
            )}
            {Object.entries(grouped).map(([letter, items]) => (
              <div key={letter} id={`letter-${letter}`} className="mb-12">
                <h2
                  className="text-[36px] font-semibold mb-5 sticky top-20 bg-white/95 backdrop-blur py-2 -mx-2 px-2"
                  style={{ color: BLUE, fontFamily: SERIF_ITALIC, fontStyle: "italic" }}
                >
                  {letter}
                </h2>
                <dl className="space-y-7">
                  {items.map((t) => (
                    <div key={t.term} id={slugify(t.term)} className="scroll-mt-24">
                      <dt className="text-[19px] font-semibold mb-1.5" style={{ color: NAVY }}>
                        {t.term}
                      </dt>
                      <dd className="text-[15px] text-slate-700 leading-[1.65] mb-2">{t.def}</dd>
                      <dd className="text-[13.5px] text-[#185FA5] leading-relaxed border-l-2 border-[#E6F1FB] pl-3">
                        <span className="uppercase tracking-[0.14em] text-[11px] font-semibold mr-1.5">Why it matters:</span>
                        {t.why}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>

          {/* Sticky alphabet nav (right rail on lg+) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Jump to</div>
              <nav className="grid grid-cols-4 gap-1.5" aria-label="Alphabet jump nav">
                {LETTERS.map((l) => (
                  <a
                    key={l}
                    href={`#letter-${l}`}
                    className="text-center text-[13px] py-1.5 rounded-md text-[#042C53] hover:bg-[#E6F1FB] font-semibold"
                  >
                    {l}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-[13px]">
          <Link to="/learn" className="text-[#185FA5] font-medium hover:underline">
            More learning resources →
          </Link>
        </div>
      </main>
      <FooterV44 />
    </div>
  );
}
