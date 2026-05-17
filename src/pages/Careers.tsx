// src/pages/Careers.tsx — v49 (rewritten)
// Real roles, real process, real self-pitch form.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { withAttribution } from "@/lib/affiliate";

const CAREERS_EMAIL = "careers@trainyouragent.com";

type Role = {
  id: string;
  title: string;
  status: string;
  location: string;
  comp: string;
  jd: string;
};

const ROLES: Role[] = [
  {
    id: "founding-engineer",
    title: "Founding Engineer",
    status: "On the radar — we would talk to you now",
    location: "Tampa or remote (US)",
    comp: "$170K–$230K + meaningful equity",
    jd: "You will own the platform end to end. Voice and chat orchestration, the eval harness, the customer-facing dashboards, and most of the internal tooling. Day one looks like shipping a fix to a production agent, scoping a new voice flow against a real customer transcript, and arguing about prompt structure with the founder for an hour. Day ninety looks like leading the build for our next two major agent products and hiring the second engineer. You write production TypeScript and at least one of Python or Go fluently, you have shipped systems that take real traffic, and you would rather ship one durable thing than three demos. You sit on customer calls. You answer the support email when it pings the engineering channel. We pay above market and we move fast because we are profitable, not because we are burning runway.",
  },
  {
    id: "ai-solutions-architect",
    title: "AI Solutions Architect",
    status: "On the radar — we would talk to you now",
    location: "Tampa or remote (US)",
    comp: "$140K–$190K + equity + variable",
    jd: "You sit between Alexander and the customer during the build week. You take the fuzzy scoping call, you turn it into a one-page spec by end of day, you build the sandbox in 48 hours, and you hand off a documented, working agent to delivery. You have built systems with prompts before — ideally in production, not in a notebook — and you can write enough TypeScript and SQL to wire integrations without engineering hand-holding. You are calm on a customer call when something on screen breaks. You write in English well enough that the customer thinks they are still working with the founder. You have high agency, low ego, and the instinct to ship the working version over the elegant version. This role is the single highest-leverage hire we can make.",
  },
  {
    id: "gtm-lead",
    title: "GTM Lead",
    status: "On the radar — we would talk to you now",
    location: "Tampa or remote (US)",
    comp: "$160K–$220K OTE + equity",
    jd: "You build and run the entire go-to-market motion. Inbound qualification, outbound to operator-led SMBs, partner program ramp, pricing experiments, and the weekly forecast call. You have closed business in the $5K–$50K ACV range before, ideally selling something technical to a non-technical buyer. You can write a cold email a real human will reply to and you can stand in front of a service-company owner and explain a voice agent without sounding like a vendor. You have an opinion on which tools belong in the stack and a stronger opinion that the only metric that matters is paid customers. You will work directly with the founder for the first six months and then build the team from there.",
  },
  {
    id: "customer-success-lead",
    title: "Customer Success Lead",
    status: "On the radar — we would talk to you now",
    location: "Tampa or remote (US)",
    comp: "$110K–$150K + equity",
    jd: "You own the post-launch relationship for every account. Weekly check-ins, monthly tuning reviews, escalation triage, and the quarterly business review that turns happy customers into multi-agent customers. You have run CS at a B2B SaaS or services company before and you know how to read a transcript, spot the agent's misses, and translate them into prompt updates. You are comfortable in our stack — you do not need to ship code but you do need to know which knob to turn. You answer the email yourself. You are the single point of contact for every account and you defend that boundary fiercely so customers always know exactly who to ping when something matters.",
  },
];

const VALUES = [
  { title: "Remote-eligible from day one.", body: "Tampa is home base and we love when people come through, but every role is remote-friendly from day one. No relocation pressure ever." },
  { title: "No-meeting Wednesdays.", body: "Wednesdays are heads-down. The only acceptable meeting on a Wednesday is a customer call that genuinely cannot move." },
  { title: "Ship daily.", body: "If you went a week without a measurable change in production, that was a planning week. We do not have many of those." },
  { title: "Equity for everyone.", body: "Every hire gets meaningful equity, vested on a standard 4-year schedule with a 1-year cliff. No second-class employees." },
  { title: "Async-default.", body: "Default to written, async, and recorded. Real-time meetings exist for genuine collaboration, not for status updates that could be a Loom." },
];

const HIRING_STEPS = [
  { step: 1, title: "Portfolio review", body: "Send us links to two or three things you shipped. Code, writing, agents, products — whatever you are proudest of. We respond within 5 business days. If we are not a fit we will say so honestly. No black holes." },
  { step: 2, title: "1-hour Alex call", body: "If your work resonates, you get a 60-minute video call with the founder. Two questions get asked: what is the best thing you have shipped, and what would you do in your first 30 days here. No trick questions, no behavioral framework theater." },
  { step: 3, title: "Paid 4-hour test project", body: "A scoped, real project — something we would actually ship — that takes about four hours. You get paid market rate for the time, regardless of whether you get the offer. No whiteboarding, no take-home that turns into a 40-hour death march." },
  { step: 4, title: "Team chat + decision", body: "A 45-minute call with the rest of the team you would work with. A decision in writing within 2 weeks of the first call. If we make an offer, it is final-stage — no last-minute compensation surprises." },
];

function SelfPitchForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withAttribution({
          email: String(fd.get("email") || ""),
          name: String(fd.get("name") || ""),
          source: "careers-self-pitch",
          path: "/careers",
          payload: {
            role_youd_build: String(fd.get("role") || ""),
            why: String(fd.get("why") || ""),
          },
          website: "", hp: "",
        })),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState("sent");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e2: any) { setState("error"); setErr(e2?.message || "Network error"); }
  }
  if (state === "sent") {
    return <div className="rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/30 p-6 text-[#042C53] text-[14px]">Thanks. Alexander reads every self-pitch personally. We respond within 5 business days, even if it is a polite no.</div>;
  }
  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <input name="name" required placeholder="Name" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="role" required placeholder="The role you would build" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <textarea name="why" rows={5} required placeholder="One paragraph — why you, why now?" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button disabled={state === "sending"} className="px-6 py-3 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send pitch →"}
        </button>
        {state === "error" && <span className="text-[12px] text-red-700">{err}</span>}
      </div>
    </form>
  );
}

const Careers = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Careers — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "We are hiring builders who want to ship the agency layer of AI. Founding Engineer, AI Solutions Architect, GTM Lead, Customer Success Lead.");
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://trainyouragent.com/careers";
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Careers</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            We are hiring builders who want to ship the <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>agency layer of AI.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Tampa-based, remote-friendly, profitable from day one. We sell agents to real businesses and we deliver them end-to-end — no demo lab, no roadmap theater. If you would rather ship one real thing than pitch ten, read on.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#roles" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">See open roles →</a>
            <a href={`mailto:${CAREERS_EMAIL}`} className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">Email careers@</a>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Five honest commitments</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            How we work. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>None of them are "passion."</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-[18px] font-semibold text-[#042C53] mb-2">{v.title}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Open roles</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-3">
            Four roles. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>All of them ship.</span>
          </h2>
          <p className="text-[14.5px] text-slate-600 mb-10 max-w-2xl">We are pre-seed and growing carefully. Every role below is "on the radar — we would talk to you now." If your background lines up, do not wait for a job posting.</p>
          <div className="space-y-5">
            {ROLES.map((r) => (
              <article key={r.id} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.08)]">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                  <h3 className="text-[24px] font-semibold text-[#042C53]">{r.title}</h3>
                  <a href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Application — " + r.title)}`} className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[12px] font-semibold hover:bg-[#0A3D6E]">Apply →</a>
                </div>
                <div className="flex flex-wrap gap-3 text-[12px] text-slate-500 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200">{r.status}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200">{r.location}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200">{r.comp}</span>
                </div>
                <p className="text-[14.5px] text-slate-700 leading-[1.75]">{r.jd}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">How we hire</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-3">
            Four steps. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>No whiteboarding.</span>
          </h2>
          <p className="text-[14.5px] text-slate-600 mb-10 max-w-2xl">Decision in writing within 2 weeks of the first call. The test project is paid at market rate.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIRING_STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-mono font-semibold mb-2">Step {String(s.step).padStart(2, "0")}</div>
                <div className="text-[18px] font-semibold text-[#042C53] mb-2">{s.title}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Don't see your role?</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-3 leading-tight">
            Pitch us the one you would build.
          </h2>
          <p className="text-[14.5px] text-slate-700 mb-6 leading-relaxed">
            We have made room for the right person more than once. Tell us the role, tell us why, and we will reply within 5 business days.
          </p>
          <SelfPitchForm />
        </div>
      </section>

      <FooterV44 />
    </div>
  );
};

export default Careers;
