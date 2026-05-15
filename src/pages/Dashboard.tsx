import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pixelEvents } from "@/lib/metaPixel";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

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

const PREVIEW = [
  { h: "Live calls",       v: "Stream of in-flight calls with transcript + outcome",          tag: "Real-time" },
  { h: "Pipeline",         v: "Bookings, deflections, escalations — by hour, day, week",       tag: "Analytics" },
  { h: "Cost & quality",   v: "Cost per call, agent quality score, customer sentiment",        tag: "Insights" },
  { h: "Tuning",           v: "Edit scripts, prompts, escalation rules — diff and roll back",  tag: "Control" },
  { h: "Integrations",     v: "Health check on every CRM/calendar/dispatch wire",              tag: "Ops" },
  { h: "Audit + exports",  v: "Every call, every action — export as CSV or via API",           tag: "Compliance" },
];

const Dashboard = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Dashboard — TrainYourAgent";
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  // v32: Stripe checkout success → fire Meta Pixel `Purchase` event (browser
  // pixel + server CAPI mirror with shared event_id). Stripe sends the buyer
  // here via SUCCESS_URL=/dashboard?checkout=ok. Fire once per session — we
  // stash the event_id in sessionStorage so a refresh on the success page
  // doesn't double-count.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "ok") return;
    const KEY = "tya:purchase-fired";
    if (window.sessionStorage.getItem(KEY)) return;
    window.sessionStorage.setItem(KEY, "1");
    pixelEvents
      .purchase(undefined, undefined, "USD", { content_name: "stripe-checkout" })
      .catch(() => { /* non-fatal */ });
  }, []);

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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Customer dashboard</div>
          <h1 className="text-[42px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Where you'll <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>watch the agent run.</span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-3xl leading-relaxed">
            Every customer gets a dashboard with live call streams, transcripts, outcomes, cost-per-call, quality scoring, and one-click tuning. Below is a preview of what lands when your build is live.
          </p>
          <div className="mt-7 inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F6FAFE] border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#22A36C]" />
            <span className="text-[14px] text-slate-700">Customer login coming with v1 dashboard release. For now, weekly reports land in your inbox.</span>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREVIEW.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2">{p.tag}</div>
              <div className="text-[17px] font-semibold text-[#042C53] mb-2">{p.h}</div>
              <div className="text-[13px] text-slate-600 leading-relaxed">{p.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[32px] sm:text-[48px] leading-[1.04] tracking-tight font-semibold">
            Want a live walkthrough <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>of a real customer dashboard?</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/85 max-w-2xl mx-auto leading-relaxed">Book a 30-minute build call and we'll screen-share an active customer view (anonymized).</p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="mt-7 inline-block px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow">Book a build call →</a>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link><a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a></div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
