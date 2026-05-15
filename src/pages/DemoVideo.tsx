// src/pages/DemoVideo.tsx
// v34 — 6 founder-recorded demo video scripts.
// Each card: thumbnail concept (rendered as styled placeholder), title, hook,
// "Coming soon" date OR <video>/Loom embed when videoUrl is set, plus a
// <details> "View script" with the full beat-by-beat script.
// Real builds, real calls, no actors. Recorded by Alexander Mills.

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

type ScriptBeat = {
  time: string;       // e.g., "0:00 — 0:05"
  visual: string;     // what's on screen
  vo: string;         // what Alexander says (or what plays)
};

type DemoVideoItem = {
  id: string;
  title: string;            // <= 8 words
  hook: string;             // first 3 seconds
  cta: { label: string; href: string };
  duration: string;         // e.g., "75s"
  recordingDate: string;    // e.g., "May 22"
  thumbnail: {
    accent: string;         // gradient hex stops
    badge: string;          // top-left chip
    overlay: string;        // big center text
    sub: string;            // small subline
  };
  beats: ScriptBeat[];
  videoUrl?: string;        // when set, render <video> or iframe; else placeholder
  videoKind?: "mp4" | "loom" | "youtube";
};

const VIDEOS: DemoVideoItem[] = [
  {
    id: "voice-agent-live-build",
    title: "Build A Voice Agent For HVAC In 5 Minutes",
    hook: "I'm spinning up a voice agent that handles after-hours HVAC calls. Live. Five minutes. Watch.",
    cta: { label: "Book a 30-min build call", href: CAL_URL },
    duration: "75s",
    recordingDate: "May 22, 2026",
    thumbnail: {
      accent: "linear-gradient(135deg,#042C53 0%,#0A3D6E 60%,#185FA5 100%)",
      badge: "LIVE BUILD",
      overlay: "5 MINUTES",
      sub: "Blank agent → live phone call",
    },
    beats: [
      { time: "0:00 — 0:05", visual: "Face cam, full screen", vo: "I'm spinning up a voice agent that handles after-hours HVAC calls. Live. Five minutes. Watch." },
      { time: "0:05 — 0:15", visual: "TrainYourAgent dashboard, blank agent template, cursor on system prompt", vo: "Twilio number provisioned — already done, that's 30 seconds. ElevenLabs voice picked. This is the system prompt." },
      { time: "0:15 — 0:30", visual: "Paste in HVAC vertical template, edit 3 fields: service area, after-hours fee, on-call cell", vo: "Vertical template loaded. I'm changing three things — service area, after-hours fee, on-call tech's cell. That's it." },
      { time: "0:30 — 0:35", visual: "Click Deploy", vo: "Deployed. Live number is hot." },
      { time: "0:35 — 1:05", visual: "iPhone on speaker — real call to the agent", vo: "Caller: 'Furnace just stopped, house is freezing.' Agent: 'I can dispatch a tech tonight. Confirm address 412 Oakmont?' Caller: 'Yeah.' Agent: '$189 after-hours fee, applied to repair if you proceed.' Caller: 'Yes please.' Agent: 'Confirmed. ETA 47 min. Text incoming.'" },
      { time: "1:05 — 1:12", visual: "Slack notification + CRM dispatch row appears", vo: "Slack ping. Booking in the CRM. Tech got the dispatch SMS. End to end." },
      { time: "1:12 — 1:15", visual: "Face cam — CTA", vo: "If you run an HVAC shop and you're paying an answering service, book a call. I'll build yours on the call." },
    ],
  },
  {
    id: "ai-chat-on-real-site",
    title: "Claude Chat Reads Our Docs Live On-Site",
    hook: "This chat widget answers a pricing question it was never trained on. Watch how.",
    cta: { label: "Book a 30-min call", href: CAL_URL },
    duration: "65s",
    recordingDate: "May 24, 2026",
    thumbnail: {
      accent: "linear-gradient(135deg,#0A3D6E 0%,#185FA5 60%,#9CC4EC 100%)",
      badge: "ON-SITE CHAT",
      overlay: "READS DOCS LIVE",
      sub: "Claude + retrieval, 1.2s response",
    },
    beats: [
      { time: "0:00 — 0:05", visual: "Browser on trainyouragent.com, chat bubble bottom-right", vo: "This chat widget answers a pricing question it was never trained on. Watch how." },
      { time: "0:05 — 0:12", visual: "Open chat widget — branded, on-site, not third-party", vo: "Powered by Claude. Lives on our own infra. No Intercom, no Drift, no per-seat tax." },
      { time: "0:12 — 0:30", visual: "Type: 'Price for a voice agent doing 5,000 calls/mo with ServiceTitan?'", vo: "That's not a pricing-page answer. That's a derived answer." },
      { time: "0:30 — 0:50", visual: "Response streams in with 3 citation pills linked to docs", vo: "It just hit our docs, our pricing model, and our integrations index in real time. Three citations. Each links to the source." },
      { time: "0:50 — 1:00", visual: "Open DevTools Network tab — show Claude API call + 3 retrieval calls", vo: "One Claude API call, three retrieval calls. 1.2 seconds total. Costs us about a tenth of a cent." },
      { time: "1:00 — 1:05", visual: "Face cam — CTA", vo: "Want this on your site, reading your docs, with your brand? Book a call." },
    ],
  },
  {
    id: "custom-website-build",
    title: "Blank Repo To Live Client Site In 10 Minutes",
    hook: "Blank Vite repo to live client site. Ten minutes. The actual stack we ship every week.",
    cta: { label: "Book a 30-min call", href: CAL_URL },
    duration: "90s",
    recordingDate: "May 27, 2026",
    thumbnail: {
      accent: "linear-gradient(135deg,#042C53 0%,#1A1A1A 60%,#185FA5 100%)",
      badge: "TIME-LAPSE",
      overlay: "10:00 → 0:00",
      sub: "Vite · React · TS · Tailwind · Vercel",
    },
    beats: [
      { time: "0:00 — 0:05", visual: "Cold open: empty VS Code, terminal cursor", vo: "Blank Vite repo to live client site. Ten minutes. The actual stack we ship every week." },
      { time: "0:05 — 0:15", visual: "Time-lapse: npm create vite@latest → React + TS + Tailwind", vo: "Vite, React, TypeScript, Tailwind. Same stack as trainyouragent.com. Boring on purpose — boring deploys, fast pages." },
      { time: "0:15 — 0:35", visual: "Time-lapse: paste internal component library — SiteNav, Hero, ROICalculator, Footer", vo: "Internal component library. Nav, hero, ROI calc, contact form, footer. Already wired to Cal.com and our backend." },
      { time: "0:35 — 0:55", visual: "Type client copy into hero. Plumbing company, Tampa. Logo + brand color dropped in", vo: "Client is a Tampa plumbing company. Their logo, their colors, their service area. Two minutes of copy." },
      { time: "0:55 — 1:10", visual: "Terminal: git push → Vercel deploys in 38 seconds, custom domain attached", vo: "Push to main. Vercel deploys in 38 seconds. Custom domain in another 30." },
      { time: "1:10 — 1:25", visual: "Live site loads on phone + desktop. Lighthouse: 98 / 100 / 100 / 100", vo: "Lighthouse: 98 performance, 100 accessibility, 100 best practices, 100 SEO. Out of the box." },
      { time: "1:25 — 1:30", visual: "Face cam — CTA", vo: "Need a site that ships this week, not next quarter? Book a call. We quote in 24 hours." },
    ],
  },
  {
    id: "business-infrastructure-end-to-end",
    title: "One Call Triggers CRM, Stripe, Slack, Calendar",
    hook: "One real customer call. Watch four systems light up in 12 seconds.",
    cta: { label: "Map your stack on a call", href: CAL_URL },
    duration: "85s",
    recordingDate: "May 29, 2026",
    thumbnail: {
      accent: "linear-gradient(135deg,#185FA5 0%,#042C53 50%,#0A3D6E 100%)",
      badge: "END-TO-END",
      overlay: "12 SECONDS",
      sub: "HubSpot · Stripe · Slack · Cal.com",
    },
    beats: [
      { time: "0:00 — 0:05", visual: "Multi-window layout: iPhone TL, Slack TR, HubSpot BL, Stripe BR", vo: "One real customer call. Watch four systems light up in 12 seconds." },
      { time: "0:05 — 0:15", visual: "Live call to the agent — roof inspection booking", vo: "Caller: 'Need a roof inspection for insurance.' Agent: 'Address?' Caller: '1240 Bayshore.' Agent: 'Saturday 9 or 11?' Caller: 'Nine.' Agent: '$149 to hold — credit card?'" },
      { time: "0:15 — 0:30", visual: "Caller reads test card. Cut to dashboards.", vo: "Watch the dashboards. I'll narrate." },
      { time: "0:30 — 0:38", visual: "HubSpot pings — new contact, deal opened at $149", vo: "HubSpot: contact created, deal opened, source tagged voice agent inbound." },
      { time: "0:38 — 0:46", visual: "Stripe popup — payment intent succeeded $149", vo: "Stripe: payment intent captured. $149. Money is real." },
      { time: "0:46 — 0:54", visual: "Slack #bookings channel pulses with the booking", vo: "Slack: ops channel pinged. Crew sees it on their phones." },
      { time: "0:54 — 1:05", visual: "Cal.com slot fills, Google Calendar invite to crew lead", vo: "Cal.com: slot held. Crew lead's calendar updated. Customer got confirmation text + email." },
      { time: "1:05 — 1:18", visual: "Face cam", vo: "No human touched any of that. Twelve seconds. Four systems. One happy customer. This is what we wire for every client." },
      { time: "1:18 — 1:25", visual: "CTA card", vo: "Want this stack wired for your business? Book a call — we'll map your integrations on the call." },
    ],
  },
  {
    id: "ai-media-production",
    title: "30-Second HVAC Ad Built With AI: $14",
    hook: "This 30-second HVAC ad cost $14 and took 22 minutes. Made entirely with AI.",
    cta: { label: "Get a finished ad by Friday", href: CAL_URL },
    duration: "75s",
    recordingDate: "May 31, 2026",
    thumbnail: {
      accent: "linear-gradient(135deg,#0A3D6E 0%,#185FA5 50%,#F5C24A 100%)",
      badge: "AI MEDIA",
      overlay: "$14 · 22 MIN",
      sub: "Script · Voice · Footage · Music · Edit",
    },
    beats: [
      { time: "0:00 — 0:05", visual: "Cold open — finished 30-sec ad plays end to end, no narration", vo: "[Ad audio plays: Tampa B-roll, VO 'When your AC dies in August, every minute matters…', logo end card]" },
      { time: "0:05 — 0:08", visual: "Cut to face cam", vo: "That ad cost $14 and took 22 minutes. Made entirely with AI. Here's the build." },
      { time: "0:08 — 0:20", visual: "Claude conversation — script generation, 3 variants, picks one", vo: "Step one: script. Gave Claude the brand, offer, target customer. Three variants in 90 seconds. Picked one." },
      { time: "0:20 — 0:35", visual: "ElevenLabs voice generation, professional voice, 30 seconds rendered", vo: "Step two: voiceover. ElevenLabs, professional voice — 30 seconds finished. $0.30." },
      { time: "0:35 — 0:48", visual: "Runway / Sora video generation + Pexels stock B-roll", vo: "Step three: footage. Half generated in Runway, half from Pexels. Six clips, $8 in credits." },
      { time: "0:48 — 0:58", visual: "CapCut timeline, Suno music dropped on track 2", vo: "Step four: music from Suno, $4. Edit in CapCut — 12 minutes." },
      { time: "0:58 — 1:08", visual: "On-screen tally: $14 total, 22 min total", vo: "Total cash: $14. Total time: 22 minutes. Old way — agency, voice talent, video shoot — $4,000 and three weeks." },
      { time: "1:08 — 1:15", visual: "Face cam — CTA", vo: "We do this for clients every week. Want a finished ad to test by Friday? Book a call." },
    ],
  },
  {
    id: "programmatic-seo-at-scale",
    title: "200 SEO Landing Pages Built And Ranking Fast",
    hook: "200 landing pages, all ranking in Google. Built in one prompt. Here's the loop.",
    cta: { label: "Get the buyer's guide", href: "/buyers-guide" },
    duration: "80s",
    recordingDate: "Jun 3, 2026",
    thumbnail: {
      accent: "linear-gradient(135deg,#042C53 0%,#185FA5 60%,#9CC4EC 100%)",
      badge: "PROGRAMMATIC SEO",
      overlay: "200 PAGES · 1 PROMPT",
      sub: "Indexed in 22 days, no backlinks",
    },
    beats: [
      { time: "0:00 — 0:05", visual: "Browser address bar — type trainyouragent.com/hvac/tampa", vo: "200 landing pages, all ranking in Google. Built in one prompt. Here's the loop." },
      { time: "0:05 — 0:15", visual: "Scroll /hvac/tampa — local hero, vertical copy, FAQ schema visible in source", vo: "HVAC, Tampa. Real page. Local hero, vertical-specific copy, structured data, FAQ schema. Static-rendered." },
      { time: "0:15 — 0:25", visual: "URL swap: /plumbing/orlando, /roofing/jacksonville, /legal/miami", vo: "Plumbing, Orlando. Roofing, Jacksonville. Legal, Miami. Same shape, different cells in the matrix." },
      { time: "0:25 — 0:42", visual: "Terminal — verticals.json, cities.json, prompt template, build log of 200+ routes", vo: "Loop: JSON of verticals. JSON of cities. One Claude prompt template. Build script does the cross-product, generates markdown, Vite static-renders on push." },
      { time: "0:42 — 0:58", visual: "Google Search Console — 47 pages indexed in 22 days, avg position 8", vo: "Search Console — 47 pages indexed in 22 days. Average position 8 for long-tail queries. No backlinks, no link farms. Real pages humans want to land on." },
      { time: "0:58 — 1:12", visual: "Face cam", vo: "Cost to add 50 more cities tomorrow: $4 in Claude tokens and a git push. Cost to add a new vertical: same. This is how you compound." },
      { time: "1:12 — 1:20", visual: "CTA card — buyer's guide", vo: "Want this loop running for your business? Get the buyer's guide — full playbook is in there." },
    ],
  },
];

function VideoFrame({ video }: { video: DemoVideoItem }) {
  const [playing, setPlaying] = useState(false);

  if (video.videoUrl && playing) {
    if (video.videoKind === "mp4") {
      return (
        <video
          src={video.videoUrl}
          controls
          autoPlay
          className="w-full h-full object-cover bg-black"
        />
      );
    }
    return (
      <iframe
        src={video.videoUrl}
        className="w-full h-full"
        frameBorder={0}
        allow="autoplay; fullscreen"
        allowFullScreen
        title={video.title}
      />
    );
  }

  // Placeholder thumbnail = the thumbnail concept rendered visually
  return (
    <button
      onClick={() => video.videoUrl && setPlaying(true)}
      className="absolute inset-0 flex flex-col items-center justify-center group transition overflow-hidden"
      style={{ background: video.thumbnail.accent }}
      aria-label={video.videoUrl ? `Play ${video.title}` : `Thumbnail for ${video.title}`}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-6">
        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold text-[#9CC4EC] mb-3">
          {video.thumbnail.badge}
        </div>
        <div
          className="text-white font-semibold leading-none"
          style={{ fontSize: "clamp(28px, 5vw, 52px)", letterSpacing: "-0.02em" }}
        >
          {video.thumbnail.overlay}
        </div>
        <div className="mt-3 text-[12px] sm:text-[13px] text-white/80 max-w-xs mx-auto">
          {video.thumbnail.sub}
        </div>
      </div>

      {video.videoUrl && (
        <div className="absolute z-10 w-16 h-16 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-2xl transition top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M5 3 L18 11 L5 19 Z" fill="#042C53" />
          </svg>
        </div>
      )}

      <div className="absolute bottom-3 right-3 text-[11px] font-mono text-white/85 bg-black/40 px-2 py-1 rounded">
        {video.duration}
      </div>
    </button>
  );
}

const DemoVideo = () => {
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
      "Real builds, real calls, no actors. Voice agent live build, on-site Claude chat, custom website in 10 minutes, end-to-end CRM/Stripe/Slack/calendar wiring, AI-made ads, programmatic SEO at scale.",
    );
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav />

      <section className="pt-32 pb-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            See the work
          </div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Real builds.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Real calls. No actors.
            </span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            Each video is recorded by Alexander shipping live — screen-shared
            from production builds, with the customer-facing systems running.
            Scripts below every card so you can see exactly what's coming.
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
              <div className="aspect-video bg-[#042C53] relative overflow-hidden">
                <VideoFrame video={v} />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mb-2 leading-tight">
                  {v.title}
                </h2>
                <p
                  className="text-[15px] text-slate-700 leading-relaxed mb-4 flex-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                >
                  &ldquo;{v.hook}&rdquo;
                </p>

                <div className="flex items-center justify-between mb-4 text-[12px]">
                  {v.videoUrl ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live recording
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[#185FA5] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
                      Coming soon — recording {v.recordingDate}
                    </span>
                  )}
                  <a
                    href={v.cta.href}
                    target={v.cta.href.startsWith("http") ? "_blank" : undefined}
                    rel={v.cta.href.startsWith("http") ? "noopener" : undefined}
                    className="text-[#042C53] font-semibold hover:underline"
                  >
                    {v.cta.label} →
                  </a>
                </div>

                <details className="group rounded-2xl bg-[#F6FAFE] border border-slate-200">
                  <summary className="cursor-pointer list-none px-4 py-3 text-[12px] font-semibold text-[#185FA5] hover:text-[#042C53] flex items-center justify-between">
                    <span>View script</span>
                    <span className="transition-transform group-open:rotate-180">↓</span>
                  </summary>
                  <div className="px-4 pb-4 pt-1 space-y-3 text-[13px] text-slate-700 leading-relaxed">
                    {v.beats.map((b, i) => (
                      <div key={i} className="grid grid-cols-[80px_1fr] gap-3">
                        <div className="font-mono text-[11px] text-[#185FA5] pt-0.5">
                          {b.time}
                        </div>
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">
                            On screen
                          </div>
                          <div className="mb-1.5">{b.visual}</div>
                          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">
                            Voice
                          </div>
                          <div className="italic text-slate-800">{b.vo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
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
