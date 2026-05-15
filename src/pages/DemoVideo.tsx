import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

// Drop a real Loom or YouTube embed URL here when you record one.
// Loom:    https://www.loom.com/embed/<id>
// YouTube: https://www.youtube.com/embed/<id>
// Wistia:  https://fast.wistia.net/embed/iframe/<id>
const VIDEO_EMBED_URL = ""; // SWAP — empty = renders the "live call" CTA card instead

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
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

const DemoVideo = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "See it run — TrainYourAgent";
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">See it run</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Two minutes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Real call. No staging.</span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            Watch a TrainYourAgent voice agent handle a real inbound call end-to-end — qualify, book, dispatch, log. Or skip the video and call us live below.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          {VIDEO_EMBED_URL ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-[0_20px_60px_-20px_rgba(4,44,83,0.35)]">
              <iframe src={VIDEO_EMBED_URL} title="TrainYourAgent demo" allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 w-full h-full" />
            </div>
          ) : (
            <div className="rounded-3xl bg-gradient-to-br from-[#042C53] to-[#0A3D6E] text-white p-10 sm:p-14 text-center shadow-[0_20px_60px_-20px_rgba(4,44,83,0.35)]">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-4">Founder Loom incoming</div>
              <h2 className="text-[28px] sm:text-[40px] leading-[1.06] tracking-tight font-semibold max-w-2xl mx-auto">
                Recording the founder walkthrough <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>this week.</span>
              </h2>
              <p className="mt-5 text-[16px] text-white/85 max-w-xl mx-auto leading-relaxed">
                In the meantime, the fastest way to see what we'd build for you is to call our live agent or book a 30-minute build call.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${HERO_PHONE_TEL}`} className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">Call live: {HERO_PHONE_DISPLAY}</a>
                <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">Book a build call</a>
              </div>
            </div>
          )}

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { h: "What you'll see", b: "Live inbound call → qualification → booking → CRM write → SMS confirmation. End-to-end." },
              { h: "Run by", b: "Real production stack — Twilio, Claude/GPT routing, Deepgram, ElevenLabs. Same setup we'd ship for you." },
              { h: "After watching", b: "Book a 30-min build call. We'll show you the same flow built for YOUR business, live." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-6">
                <div className="text-[14px] font-semibold text-[#042C53] mb-2">{c.h}</div>
                <div className="text-[13px] text-slate-600 leading-relaxed">{c.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link><a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a></div>
        </div>
      </footer>
    </div>
  );
};

export default DemoVideo;
