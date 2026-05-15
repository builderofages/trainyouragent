// src/pages/Press.tsx — v34
// Press kit. Brand assets, founder bio, press contact, "in the news" placeholders.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const PRESS_EMAIL = "press@trainyouragent.com";

/* ------------------------------------------------------------------ */
/*  Inline Prism Node logo (white + navy variants, downloadable as SVG) */
/* ------------------------------------------------------------------ */
const LOGO_NAVY_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#042C53" stroke-linecap="round" stroke-linejoin="round" width="256" height="256" aria-label="TrainYourAgent Prism Node">
  <g stroke-width="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
  <g stroke-width="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
  <circle cx="32" cy="32" r="3" fill="#042C53" stroke="none" />
</svg>`;

const LOGO_WHITE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" width="256" height="256" aria-label="TrainYourAgent Prism Node (white)">
  <g stroke-width="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
  <g stroke-width="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
  <circle cx="32" cy="32" r="3" fill="#FFFFFF" stroke="none" />
</svg>`;

const WORDMARK_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 80" width="480" height="80" aria-label="TrainYourAgent wordmark">
  <g fill="none" stroke="#042C53" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="4"><path d="M 32 14 L 58 40 L 32 66 L 6 40 Z" /></g>
    <g stroke-width="2.4"><path d="M 32 14 L 32 66" /><path d="M 6 40 L 58 40" /></g>
    <circle cx="32" cy="40" r="3" fill="#042C53" stroke="none" />
  </g>
  <text x="80" y="50" font-family="Inter Tight, system-ui, sans-serif" font-size="32" font-weight="600" fill="#042C53">TrainYourAgent</text>
</svg>`;

function downloadSvg(name: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function BrainLogo({ size = 28, color = "#042C53" }: { size?: number; color?: string }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const PALETTE = [
  { name: "Prism Navy",   hex: "#042C53", text: "#FFFFFF", note: "Primary brand color. Headlines, CTAs, navy backgrounds." },
  { name: "Signal Blue",  hex: "#185FA5", text: "#FFFFFF", note: "Accent + interactive states. Eyebrows, links, highlight bullets." },
  { name: "Sky Tint",     hex: "#E6F1FB", text: "#042C53", note: "Surfaces, cards on navy hero, secondary backgrounds." },
  { name: "Fog",          hex: "#F6FAFE", text: "#042C53", note: "Page section backgrounds." },
  { name: "Ink",          hex: "#0B1B2B", text: "#FFFFFF", note: "Body copy on white." },
  { name: "Confirm",      hex: "#22A36C", text: "#FFFFFF", note: "Live / operational status." },
];

const TALKS: { date: string; title: string; venue: string }[] = [
  { date: "2026-04-18", title: "How operator agencies will swallow vertical SaaS", venue: "Tampa Bay AI Meetup (keynote)" },
  { date: "2026-03-02", title: "Voice agents in production: latency, cost, and the math nobody shows you", venue: "AI Tinkerers (Miami)" },
  { date: "2026-01-21", title: "From welder to AI agency: the operator path into AI", venue: "The Operator Podcast (guest)" },
];

const Press = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Press — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "TrainYourAgent press kit — brand assets, founder bio, press contact.");
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Press kit</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Brand assets, founder bio, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>press contact.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            For interviews, podcast bookings, or quick fact-checks: <a href={`mailto:${PRESS_EMAIL}`} className="underline text-[#185FA5]">{PRESS_EMAIL}</a>. Usually under 24 hours.
          </p>
        </div>
      </section>

      {/* BRAND ASSETS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Brand assets</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            The Prism Node. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Use it. Don't redraw it.</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center text-center">
              <div className="h-32 flex items-center justify-center mb-4"><BrainLogo size={96} color="#042C53" /></div>
              <div className="text-[13px] font-semibold text-[#042C53] mb-1">Logo · Navy</div>
              <div className="text-[11px] text-slate-500 mb-3">Use on white or light backgrounds.</div>
              <button onClick={() => downloadSvg("trainyouragent-logo-navy.svg", LOGO_NAVY_SVG)} className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[12px] font-semibold hover:bg-[#0A3D6E]">Download SVG</button>
            </div>
            <div className="rounded-2xl bg-[#042C53] border border-[#042C53] p-6 flex flex-col items-center text-center">
              <div className="h-32 flex items-center justify-center mb-4"><BrainLogo size={96} color="#FFFFFF" /></div>
              <div className="text-[13px] font-semibold text-white mb-1">Logo · White</div>
              <div className="text-[11px] text-white/60 mb-3">Use on dark backgrounds.</div>
              <button onClick={() => downloadSvg("trainyouragent-logo-white.svg", LOGO_WHITE_SVG)} className="px-4 py-2 rounded-full bg-white text-[#042C53] text-[12px] font-semibold hover:bg-[#E6F1FB]">Download SVG</button>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center text-center">
              <div className="h-32 flex items-center justify-center mb-4">
                <div className="flex items-center gap-2.5">
                  <BrainLogo size={40} color="#042C53" />
                  <span className="text-[28px] font-semibold text-[#042C53]">TrainYourAgent</span>
                </div>
              </div>
              <div className="text-[13px] font-semibold text-[#042C53] mb-1">Wordmark</div>
              <div className="text-[11px] text-slate-500 mb-3">Logo + name lockup.</div>
              <button onClick={() => downloadSvg("trainyouragent-wordmark.svg", WORDMARK_SVG)} className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[12px] font-semibold hover:bg-[#0A3D6E]">Download SVG</button>
            </div>
          </div>

          {/* COLOR PALETTE */}
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Color palette</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PALETTE.map((c) => (
              <div key={c.hex} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                <div className="h-20 flex items-end p-3" style={{ background: c.hex, color: c.text }}>
                  <span className="text-[12px] font-semibold tabular-nums">{c.hex}</span>
                </div>
                <div className="p-3">
                  <div className="text-[13px] font-semibold text-[#042C53]">{c.name}</div>
                  <div className="text-[11px] text-slate-500 leading-snug mt-1">{c.note}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[12px] text-slate-500 max-w-3xl leading-relaxed">
            Type system: <span className="text-[#042C53] font-semibold">Inter Tight</span> (UI + body) and <span className="text-[#042C53] font-semibold" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Playfair Display Italic</span> (display accents). Both Google Fonts; load via stylesheet, no licensing fee.
          </p>
        </div>
      </section>

      {/* FOUNDER BIO */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12">
          <div>
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#042C53] to-[#185FA5] aspect-[4/5] flex items-center justify-center text-white text-center p-6">
              <div>
                <BrainLogo size={56} color="#FFFFFF" />
                <div className="mt-4 text-[14px] font-semibold">Hi-res photo</div>
                <div className="text-[12px] text-white/70 mt-1">Email <a href={`mailto:${PRESS_EMAIL}`} className="underline">{PRESS_EMAIL}</a> for the full-resolution founder portrait.</div>
              </div>
            </div>
            <div className="mt-4 text-[12px] text-slate-500">Photo credit: TrainYourAgent. Free to use editorially with attribution.</div>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Founder bio</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6">
              Alexander Mills — <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>founder, TrainYourAgent.</span>
            </h2>
            <div className="space-y-5 text-[15px] sm:text-[16px] text-slate-700 leading-relaxed">
              <p>
                Alexander Mills is the founder of TrainYourAgent. Before AI he was a welder, a market trader, and the operator of a Los Angeles social-media agency that spent its years finding out the hard way which kinds of work scale and which kinds eat their owners. That agency, EndCreations, taught him the unglamorous parts of running a service business — pricing, delivery, escalations, the way a single bad invoice can ruin a quarter — long before "AI agency" was a category that existed.
              </p>
              <p>
                He started TrainYourAgent in Tampa to build the thing he kept wishing existed when he was buying AI tools as an operator: a partner that ships the agents, wires the stack, and stays on the call when something breaks. The company's bet is that every offline business is about to need an AI layer over its phone, its inbox, and its operations — and that the right team to install that layer looks more like an operator than a research lab.
              </p>
              <p>
                Today he writes and teaches publicly about voice agents, agency economics, and what it takes to ship AI in production for businesses that aren't named after a Greek god. He lives in Tampa Bay, answers his own customer calls every week, and is loud on <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="underline text-[#185FA5]">LinkedIn</a> about what works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IN THE NEWS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">In the news</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
            Coverage. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>(More to come.)</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-dashed border-slate-300 p-6 text-center">
                <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400 font-semibold mb-2">Featured in</div>
                <div className="text-[16px] font-semibold text-slate-400">[TBD]</div>
                <div className="text-[12px] text-slate-400 mt-2">Slot reserved for incoming coverage.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT TALKS */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Recent talks &amp; podcasts</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
            On stage and on the mic.
          </h2>
          <ul className="space-y-3">
            {TALKS.map((t, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 rounded-2xl border border-slate-200 bg-white">
                <div>
                  <div className="text-[15px] font-semibold text-[#042C53]">{t.title}</div>
                  <div className="text-[12px] text-slate-500 mt-1">{t.venue}</div>
                </div>
                <div className="text-[12px] text-slate-500 tabular-nums">{t.date}</div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[12px] text-slate-500">Looking to book Alexander? Email <a href={`mailto:${PRESS_EMAIL}`} className="underline">{PRESS_EMAIL}</a>.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/learn" className="hover:text-[#042C53]">Learn</Link>
            <Link to="/careers" className="hover:text-[#042C53]">Careers</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Press;
