// src/pages/Solutions.tsx
// Solutions hub. Six service pillars (matches the canonical Solutions
// dropdown in SiteNav). Each pillar shows tagline, "what you get", a
// "see it live" link, and a price point.
//
// Anchor IDs: #voice, #chat, #sites, #infra, #media, #growth (these match
// the hash links from SiteNav so the dropdown deep-links correctly).

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

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

type Pillar = {
  id: string;
  label: string;
  tagline: string;          // "what it does in 8 words"
  bullets: [string, string, string];
  seeItLive: { label: string; to: string };
  price: string;
};

const PILLARS: Pillar[] = [
  {
    id: "voice",
    label: "Voice Agents",
    tagline: "Phones answered in two rings, every time.",
    bullets: [
      "24/7 inbound + outbound on your existing business number",
      "Books, qualifies, dispatches into your CRM and calendar",
      "Human-handoff rules you control, transcript on every call",
    ],
    seeItLive: { label: "See it live (HVAC)", to: "/hvac" },
    price: "Starts at $1,997/mo + $4,950 build",
  },
  {
    id: "chat",
    label: "Chat Agents",
    tagline: "Web + SMS support that closes the loop.",
    bullets: [
      "On-site widget, SMS, WhatsApp — one shared knowledge base",
      "Books appointments, opens tickets, pushes to Slack on escalation",
      "Trained on your docs, pricing, returns policy — not the open internet",
    ],
    seeItLive: { label: "See it live (E-commerce)", to: "/ecommerce" },
    price: "Starts at $1,997/mo + $4,950 build",
  },
  {
    id: "sites",
    label: "Custom Websites",
    tagline: "Conversion-tuned sites built by operators.",
    bullets: [
      "Designed for the call, the booking, the checkout — not for awards",
      "Tracking, A/B, schema, speed budget — wired before launch",
      "Editable in Framer or shipped as React — your choice",
    ],
    seeItLive: { label: "See examples", to: "/case-studies" },
    price: "Starts at $4,500 one-time",
  },
  {
    id: "infra",
    label: "Business Infrastructure",
    tagline: "CRM, telephony, GTM stack — wired and shipped.",
    bullets: [
      "Twilio + your CRM + your booking + your billing, glued correctly",
      "Apollo + sequences + dialer + enrichment for outbound teams",
      "Internal dashboards + ops automations on n8n / Zapier / custom",
    ],
    seeItLive: { label: "See our stack", to: "/technology" },
    price: "Scoped per project · starts at $6,000",
  },
  {
    id: "media",
    label: "AI Media",
    tagline: "Generative video, image, audio — for ads and content.",
    bullets: [
      "UGC-style ad creative produced in batches per week",
      "Voice clones, podcast cuts, short-form social pipelines",
      "Brand-locked image + video systems (Midjourney, Sora, Runway)",
    ],
    seeItLive: { label: "Brief us", to: "/contact" },
    price: "Starts at $2,500/mo (creative subscription)",
  },
  {
    id: "growth",
    label: "Marketing & SEO",
    tagline: "Content engines, paid funnels, technical SEO.",
    bullets: [
      "Programmatic SEO + topical authority builds, ranked in 90 days",
      "Meta + Google paid funnels with our Meta CAPI pixel stack",
      "Conversion-optimized landing pages with weekly experiments",
    ],
    seeItLive: { label: "See the blog", to: "/blog" },
    price: "Starts at $3,500/mo retainer",
  },
];

const VERTICALS: Array<[string, string]> = [
  ["/hvac", "HVAC"],
  ["/healthcare", "Healthcare"],
  ["/real-estate", "Real Estate"],
  ["/legal", "Legal"],
  ["/ecommerce", "E-commerce"],
  ["/hospitality", "Hospitality"],
  ["/automotive", "Auto"],
  ["/solar", "Solar"],
  ["/roofing", "Roofing"],
  ["/spas", "Spas"],
];

const Solutions = () => {
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
    document.title = "Solutions — TrainYourAgent";
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
      "Voice agents, chat agents, custom websites, business infrastructure, AI media, marketing & SEO. The full operating layer for SMBs and startups.",
    );
  }, []);

  // Smooth-scroll to hash anchors when the user lands via /solutions#voice etc.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      // Defer one tick so the layout has settled.
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav active="solutions" />

      {/* HERO */}
      <section className="relative pt-32 pb-16 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-60"
            style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }}
          />
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Solutions
          </div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.0] tracking-tight font-semibold text-[#042C53]">
            Six pillars.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              One operating layer.
            </span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Pick the pillar you need first. Most customers start with one and add the others as the
            agents start paying for themselves. Every pillar ships in days, not quarters — built by
            the engineer who'll show up on the call.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15"
            >
              Book a 30-min build call →
            </a>
            {/* v170: <a href> not <Link> — full-page nav, no lazy-chunk risk */}
            <a
              href="/pricing"
              className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]"
            >
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {PILLARS.map((p) => (
              <article
                key={p.id}
                id={p.id}
                className="scroll-mt-28 rounded-3xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] hover:shadow-[0_8px_40px_-15px_rgba(4,44,83,0.25)] transition flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
                      Pillar
                    </div>
                    <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#042C53] leading-tight">
                      {p.label}
                    </h2>
                  </div>
                  <BrainLogo size={32} />
                </div>
                <p
                  className="text-[16px] text-slate-700 leading-snug mb-5"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  {p.tagline}
                </p>
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">
                  What you get
                </div>
                <ul className="space-y-2 mb-5 text-[14px] text-slate-700">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 bg-[#185FA5]" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="text-[12px] text-[#042C53] font-semibold">{p.price}</div>
                  <Link
                    to={p.seeItLive.to}
                    className="text-[13px] font-semibold text-[#185FA5] hover:text-[#042C53] inline-flex items-center gap-1"
                  >
                    {p.seeItLive.label} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE PACKAGE */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            How we package this
          </div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
            Most customers start with{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              one pillar that pays back fast,
            </span>{" "}
            then add the rest.
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">
                Step 1
              </div>
              <div className="text-[16px] font-semibold text-[#042C53] mb-2">
                Land the agent that recovers revenue
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                For most SMBs that's voice — every missed after-hours call is a competitor's job.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">
                Step 2
              </div>
              <div className="text-[16px] font-semibold text-[#042C53] mb-2">
                Wire the infrastructure underneath
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                CRM sync, telephony, booking, billing. The plumbing that makes the agent stick.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">
                Step 3
              </div>
              <div className="text-[16px] font-semibold text-[#042C53] mb-2">
                Pour fuel: site, media, paid, SEO
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Now that calls convert, we feed the funnel — site, media, paid, organic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY SHORTCUT */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            By industry
          </div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
            Built for your industry.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Not the average of all of them.
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {VERTICALS.map(([slug, label]) => (
              <Link
                key={slug}
                to={slug}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-[#F6FAFE] transition"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSER */}
      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] sm:text-[56px] leading-[1.04] tracking-tight font-semibold">
            Pick the pillar.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              We ship the build.
            </span>
          </h2>
          <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            Thirty-minute build call. You leave with a written plan, a price, and a kickoff date.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg"
            >
              Book a 30-min build call →
            </a>
            {/* v170: <a href> for full-page nav safety */}
            <a
              href="/pricing"
              className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15"
            >
              See pricing
            </a>
          </div>
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
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#042C53]">
              Terms
            </Link>
            <Link to="/security" className="hover:text-[#042C53]">
              Security
            </Link>
            <Link to="/contact" className="hover:text-[#042C53]">
              Contact
            </Link>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener"
              className="hover:text-[#042C53]"
            >
              LinkedIn
            </a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent LLC</div>
        </div>
      </footer>
    </div>
  );
};

export default Solutions;
