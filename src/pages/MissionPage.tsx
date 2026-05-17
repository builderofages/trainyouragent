// src/pages/MissionPage.tsx — v49
// Public mission page. No fundraising. The substance carries the scale.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
// v52B: live GitHub commits widget — proof we ship between thesis and roadmap
import ShippedThisWeek from "@/components/ShippedThisWeek";

function setHead() {
  if (typeof document === "undefined") return;
  document.title = "Mission — TrainYourAgent";
  const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", value);
  };
  setMeta("meta[name='description']", "name", "description", "Take humans out of cubicles. Put them into the work only humans can do. Our mission, our thesis, the roadmap.");
  setMeta("meta[property='og:title']", "property", "og:title", "Mission — TrainYourAgent");
  setMeta("meta[property='og:description']", "property", "og:description", "Take humans out of cubicles. Put them into the work only humans can do.");
  setMeta("meta[property='og:type']", "property", "og:type", "website");
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = "https://trainyouragent.com/mission";
  if (!document.getElementById("tya-fonts")) {
    const l = document.createElement("link");
    l.id = "tya-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }
}

const ROADMAP = [
  { label: "Q3 2026", text: "100 paying customers, $100K MRR." },
  { label: "Q4 2026", text: "Voice agent v3 with sub-500ms response." },
  { label: "Q1 2027", text: "Partner program live with 25 agencies." },
  { label: "Q2 2027", text: "SOC 2 Type 1 + first enterprise design partner." },
  { label: "Q3 2027", text: "Series seed close." },
];

export default function MissionPage() {
  useEffect(() => { setHead(); }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-32 pb-16 px-5 sm:px-8 bg-gradient-to-b from-[#042C53] to-[#0A3D6E] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-4">Mission · TrainYourAgent</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[84px] leading-[1.02] font-semibold tracking-tight">
            Take humans out of cubicles. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Put them into the work only humans can do.</span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[20px] text-white/85 max-w-3xl leading-relaxed">
            We are building the operating layer for AI agents in small and mid-sized businesses. The promise is simple — repetitive call-handling, message-triage, and data-entry are done by software. People do the work that requires judgment, taste, and care.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">The problem</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-5 leading-tight">Most of human work is repetitive.</h2>
          <p className="text-[16px] text-slate-700 leading-[1.75]">
            The average front-office employee in a small or mid-sized business spends more than half of every working day on tasks a competent AI agent now does better. Answering the same question for the seventieth time. Logging the same field into the same CRM. Routing the same call to the same person. The cost is not just the salary line — it is the human cost of intelligent people doing repetitive work, and the customer cost of waiting in a queue because the team is buried in the queue ahead of them. The technology to fix this exists. The question is who will assemble it for a business that does not have a machine learning team. That is the gap we fill.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">The thesis</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-5 leading-tight">By 2030, every SMB will run on a stack of specialized AI agents.</h2>
          <p className="text-[16px] text-slate-700 leading-[1.75] mb-4">
            That stack will not be one giant general-purpose assistant. It will be a small set of focused, well-tuned agents — one that answers the phones, one that handles inbound chat, one that watches the inbox and routes the right thread to the right human, one that keeps the CRM honest. Each one trained on the specific business it serves, each one delivered as a product, not as a project.
          </p>
          <p className="text-[16px] text-slate-700 leading-[1.75] mb-4">
            We build that stack. Voice, chat, ops, sales, support. Packaged so a twelve-person company can deploy in days, not months. Delivered with a human who knows the customer by name. Operated by us, not by a self-serve dashboard that nobody on the customer's team has time to learn.
          </p>
          <p className="text-[16px] text-slate-700 leading-[1.75]">
            The infrastructure exists. The platforms exist. What does not exist yet is the company that puts it together for the operator who has a real business to run and no patience for ceremony. We are going to be the operating system for that — the layer the next million SMBs run their AI on, the same way the last million ran their books on QuickBooks and their email on Google.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">Why us</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-5 leading-tight">A welder who became an AI founder is the right person to build this.</h2>
          <p className="text-[16px] text-slate-700 leading-[1.75] mb-4">
            Alexander Mills is the founder of TrainYourAgent. His operating background spans manufacturing, capital markets, and digital media — including leading social strategy at one of the world's largest social media marketing agencies in Los Angeles. He started shipping AI software because the businesses he worked with — service companies, contractors, clinics, dispatch operations — were drowning in repetitive computer work that nobody had the time or budget to fix.
          </p>
          <p className="text-[16px] text-slate-700 leading-[1.75] mb-4">
            He spent four years building AI agents before the rest of the market noticed there was a market. He has scoped, built, and shipped agents for dozens of operators. He answers his own customer support email. He still answers a real customer call every week, and the company will lose a great deal more than it gains the day he stops.
          </p>
          <p className="text-[16px] text-slate-700 leading-[1.75]">
            That perspective matters here. Most of the AI agent market is being built by people who have never been on the receiving end of a half-built tool. We have. The instinct to build software that operators actually deploy, rather than software that demos well at a conference, is the difference between the platforms that survive this cycle and the ones that do not.
          </p>
        </div>
      </section>

      {/* v52B: live GitHub commits — proof we ship, between thesis and roadmap */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <ShippedThisWeek />
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">How we get there</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-6 leading-tight">The honest near-term roadmap.</h2>
          <ol className="space-y-4">
            {ROADMAP.map((r) => (
              <li key={r.label} className="flex items-start gap-4">
                <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center min-w-[88px] px-3 py-1.5 rounded-full bg-[#042C53] text-white text-[12px] font-mono font-semibold tracking-wider">{r.label}</span>
                <span className="text-[15.5px] text-slate-700 leading-relaxed pt-1">{r.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">Want to be part of it?</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-8 leading-tight">Three ways in.</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <Cta title="Hire us" body="Deploy a real AI agent for your business in days, not months. We scope, build, and operate the whole thing." href="/contact" cta="Get a build →" />
            <Cta title="Join us" body="We are hiring builders who want to ship the agency layer of AI. See open roles and the kind of work we do." href="/careers" cta="Open roles →" />
            <Cta title="Invest" body="We are not actively raising. If you back operator-led companies in the AI-agency layer, we want to know you." href="/invest" cta="Investor page →" />
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}

function Cta({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <Link to={href} className="rounded-3xl border border-slate-200 bg-white p-6 hover:border-[#185FA5] hover:shadow-[0_8px_40px_-12px_rgba(4,44,83,0.12)] transition-all block">
      <div className="text-[18px] font-semibold text-[#042C53] mb-2">{title}</div>
      <p className="text-[14px] text-slate-700 leading-relaxed mb-4 min-h-[80px]">{body}</p>
      <span className="text-[13px] text-[#185FA5] font-semibold">{cta}</span>
    </Link>
  );
}
