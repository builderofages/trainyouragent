// src/pages/DemoVideo.tsx
// Video gallery — 6 demo videos with thumbnail, duration, play, transcript.
// Loom embeds (placeholder URLs — swap with real recordings).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

type Video = {
  id: string;
  title: string;
  vertical: string;
  duration: string;
  embed: string;     // Loom embed URL
  blurb: string;
  transcript: string[]; // paragraphs
};

const VIDEOS: Video[] = [
  {
    id: "hvac-after-hours",
    title: "HVAC after-hours call → booked appointment",
    vertical: "HVAC",
    duration: "3 min",
    embed: "https://www.loom.com/embed/PLACEHOLDER-hvac",
    blurb:
      "Real call to a TrainYourAgent voice agent at 11:42 PM on a Tuesday. Customer's furnace went out. Watch the agent qualify, dispatch, and confirm without a human picking up.",
    transcript: [
      "Caller: Hey, my furnace just stopped, the house is freezing.",
      "Agent: I'm sorry to hear that — I can get a tech out tonight. Can I confirm the address on file is 412 Oakmont Drive?",
      "Caller: Yeah that's right.",
      "Agent: Got it. I'm dispatching our on-call tech. Estimated arrival is 47 minutes. After-hours service call is $189, applied toward repair if you proceed. Sound good?",
      "Caller: Yeah, please send someone.",
      "Agent: Confirmed. You'll get a text in 60 seconds with the tech's name and live ETA. Stay warm — anything else?",
    ],
  },
  {
    id: "healthcare-intake",
    title: "Healthcare patient intake — new patient flow",
    vertical: "Healthcare",
    duration: "4 min",
    embed: "https://www.loom.com/embed/PLACEHOLDER-healthcare",
    blurb:
      "Patient calls a primary care office to book a new-patient appointment. Agent handles insurance verification, demographics, and slot booking — HIPAA-compliant, no human in the loop.",
    transcript: [
      "Caller: Hi, I'd like to book a new patient appointment.",
      "Agent: Of course — let me grab a few details. Are you covered by insurance you'd like us to bill, or self-pay?",
      "Caller: Blue Cross Blue Shield.",
      "Agent: Great. Could you read me the member ID off the front of your card?",
      "Caller: It's XJW9-4421-882.",
      "Agent: Thanks — I see you're in-network with Dr. Patel. Earliest new-patient slot is Thursday March 14 at 10:20 AM. Want it?",
      "Caller: Yes please.",
      "Agent: Booked. You'll get a text with the patient intake form and parking instructions in 60 seconds.",
    ],
  },
  {
    id: "real-estate-buyer",
    title: "Real estate buyer qualification + showing",
    vertical: "Real Estate",
    duration: "3 min",
    embed: "https://www.loom.com/embed/PLACEHOLDER-realestate",
    blurb:
      "Inbound from a Zillow lead. Agent qualifies budget, pre-approval status, and timeline before booking the showing — saves the agent from chasing tire-kickers.",
    transcript: [
      "Caller: I'm interested in the listing on Bayshore Boulevard.",
      "Agent: Beautiful place — quick question, are you working with another agent or is this your first contact with our team?",
      "Caller: First contact.",
      "Agent: Perfect. To set up a showing, just a few things — what's your target budget range?",
      "Caller: 600 to 750.",
      "Agent: Great fit. Are you pre-approved with a lender yet?",
      "Caller: Yes, with Wells Fargo.",
      "Agent: Excellent. I have Jen available Saturday at 11 AM or 2 PM. Which works?",
    ],
  },
  {
    id: "legal-conflict",
    title: "Legal conflict-check + consultation booking",
    vertical: "Legal",
    duration: "3 min",
    embed: "https://www.loom.com/embed/PLACEHOLDER-legal",
    blurb:
      "Personal-injury intake call. Agent runs a conflict-of-interest check against the firm's matter database, qualifies the case type, and books the consultation if cleared.",
    transcript: [
      "Caller: I was in a car accident, looking for a lawyer.",
      "Agent: Sorry to hear that — I can help. First, the other party's name?",
      "Caller: Marcus Johnson.",
      "Agent: One moment while I check our conflicts… cleared. Was a police report filed?",
      "Caller: Yes.",
      "Agent: Great. We offer a free 30-minute consultation with our PI partner. Earliest is Wednesday at 2 PM. Want to book?",
    ],
  },
  {
    id: "agent-build",
    title: "Voice agent build walkthrough — concept to production",
    vertical: "Engineering",
    duration: "8 min",
    embed: "https://www.loom.com/embed/PLACEHOLDER-build",
    blurb:
      "Watch a TrainYourAgent engineer scope, build, and ship a voice agent in real time. Twilio number provisioning, ElevenLabs voice tuning, system prompt iteration, CRM webhook wiring.",
    transcript: [
      "We start with the Twilio console — provision a number, point inbound to our SIP endpoint.",
      "Then ElevenLabs voice selection — pick the voice, tune the stability + clarity sliders.",
      "System prompt next — we've got a vertical template; we tune the business-specific bits (hours, pricing, escalation rules).",
      "Wire the CRM — for ServiceTitan we hit the dispatch endpoint with structured output from the model.",
      "Test calls — internal QA with edge-case scripts. Spanish caller, angry caller, kid-on-the-phone caller.",
      "Cutover — flip the forwarding, watch the first 24 hours of live traffic in the dashboard.",
    ],
  },
  {
    id: "dashboard-tour",
    title: "Customer dashboard tour — what you actually see day-to-day",
    vertical: "Product",
    duration: "6 min",
    embed: "https://www.loom.com/embed/PLACEHOLDER-dashboard",
    blurb:
      "Tour of the TrainYourAgent customer dashboard. Live call log, transcripts + recordings, structured outputs, escalation queue, weekly tuning report.",
    transcript: [
      "Top of the dashboard — live call counter, today's volume, agents online.",
      "Call log — every call with caller ID, duration, outcome (booked / escalated / abandoned).",
      "Click any call — full transcript, audio recording, structured JSON output sent to your CRM.",
      "Escalation queue — flagged calls that need human review. Click to listen, leave notes.",
      "Weekly tuning report — what the agent got right, what it got wrong, what we're adjusting next week.",
      "Settings — voice, hours, escalation rules, integrations. Most teams change this stuff weekly in month one, monthly after.",
    ],
  },
];

const DemoVideo = () => {
  const [openTranscript, setOpenTranscript] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Demo videos — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", n);
        document.head.appendChild(el);
      }
      el.setAttribute("content", c);
    };
    setMeta(
      "description",
      "Real customer calls and product walkthroughs. HVAC after-hours, healthcare intake, real-estate qualification, legal conflict-checks, build walkthrough, dashboard tour.",
    );
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav />

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            See it run
          </div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Real calls.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Real customers. No staging.
            </span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            Every video below is a real interaction with a TrainYourAgent
            agent — anonymized for the customer's privacy, but otherwise
            untouched. Pick the one that matches your business.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
          {VIDEOS.map((v) => (
            <article
              key={v.id}
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-[#185FA5] hover:shadow-[0_8px_40px_-15px_rgba(4,44,83,0.25)] transition flex flex-col"
            >
              {/* Player / thumbnail */}
              <div className="aspect-video bg-[#042C53] relative overflow-hidden">
                {playing === v.id ? (
                  <iframe
                    src={`${v.embed}?autoplay=1`}
                    className="w-full h-full"
                    frameBorder={0}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={v.title}
                  />
                ) : (
                  <button
                    onClick={() => setPlaying(v.id)}
                    className="absolute inset-0 flex flex-col items-center justify-center group bg-gradient-to-br from-[#042C53] to-[#0A3D6E] hover:from-[#0A3D6E] hover:to-[#042C53] transition"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-2xl transition">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M5 3 L18 11 L5 19 Z" fill="#042C53" />
                      </svg>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[11px] font-mono text-white/85 bg-black/40 px-2 py-1 rounded">
                      {v.duration}
                    </div>
                    <div className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#9CC4EC] bg-black/40 px-2 py-1 rounded">
                      {v.vertical}
                    </div>
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mb-2 leading-tight">
                  {v.title}
                </h2>
                <p className="text-[14px] text-slate-700 leading-relaxed mb-4 flex-1">
                  {v.blurb}
                </p>

                <button
                  onClick={() =>
                    setOpenTranscript(openTranscript === v.id ? null : v.id)
                  }
                  className="text-left text-[12px] font-semibold text-[#185FA5] hover:text-[#042C53] inline-flex items-center gap-1.5"
                >
                  {openTranscript === v.id ? "Hide transcript" : "Read transcript"}
                  <span className={`transition-transform ${openTranscript === v.id ? "rotate-180" : ""}`}>
                    ↓
                  </span>
                </button>

                {openTranscript === v.id && (
                  <div className="mt-4 rounded-2xl bg-[#F6FAFE] border border-slate-200 p-4 text-[13px] text-slate-700 leading-relaxed space-y-2">
                    {v.transcript.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">
            Or skip the videos
          </div>
          <h2
            className="text-[28px] sm:text-[44px] leading-tight font-medium mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
          >
            "Call us live. Same agent."
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${HERO_PHONE_TEL}`}
              className="px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow"
            >
              Call us: {HERO_PHONE_DISPLAY} →
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-[14px] hover:bg-white/15"
            >
              Or book a 30-min call
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoVideo;
