// src/pages/Whitelabel.tsx — v52B
// /whitelabel — agency/MSP white-label program. Apply form → `/api/lead`
// source `whitelabel-apply`.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const ENDPOINT = "/api/lead";

const PROCESS = [
  { n: "01", t: "Apply", b: "5-minute form. We review within two business days. We approve agencies with at least three existing service customers and a real book of business." },
  { n: "02", t: "Sign", b: "Mutual NDA + reseller agreement. Standard terms, no exclusivity required, no minimums for the first 6 months." },
  { n: "03", t: "Branded portal stand-up", b: "We provision your branded portal in 7-10 business days. Your logo, your domain, your color palette, your pricing tiers. Your customers never see TrainYourAgent." },
  { n: "04", t: "First three client pilots", b: "We pair with you on the first three deals — kickoff, scoping, build, launch. You learn the playbook by doing it under our supervision." },
  { n: "05", t: "Operations training", b: "Two-day intensive: how to scope, how to price, how to handle objections, how to run the build. Recorded for your team to onboard new hires later." },
  { n: "06", t: "Ongoing support", b: "Monthly partner office hours, dedicated Slack channel, escalation path to engineering, quarterly business review with our team." },
];

const FEATURES = [
  { h: "Your brand, end-to-end", b: "Logo, domain, colors, voice and chat UI, customer-facing email templates, generated PDFs, dashboards. Nothing carries TYA branding." },
  { h: "Your pricing", b: "We set the wholesale rate, you set retail. Typical agency markups are 2.5-3.5x. You keep 100% of the difference." },
  { h: "Your contract", b: "Customers sign with you, pay you, get invoiced by you. We never have a customer relationship — you do." },
  { h: "Your support", b: "First-line support is yours. We handle infrastructure escalations and ship product. Your team owns the customer." },
  { h: "Our infrastructure", b: "Voice + chat agent stack, multi-vendor LLM fallback, telephony, observability, eval harness. You don't build any of it." },
  { h: "Our product team", b: "New capabilities ship continuously. You get them automatically as we release them. No version-pinning." },
];

const FAQ = [
  { q: "What's the wholesale economics?", a: "$7,500 white-label setup (one-time), $3,000/mo base, plus a per-active-agent fee that decreases with volume. Full numbers shared after a signed NDA." },
  { q: "Can I use my own LLM providers?", a: "Yes. We support BYO API keys for OpenAI, Anthropic, Groq, and Gemini. Useful if you've negotiated custom enterprise rates." },
  { q: "What happens if I want to leave?", a: "30-day notice, no penalties. We provide a full export of customer configurations and conversation history so you can transition cleanly." },
  { q: "Do you support custom voices and clones?", a: "Yes — premium voice cloning via ElevenLabs (signed consent required) or Cartesia is fully supported and white-labeled." },
  { q: "Is there a minimum customer commitment?", a: "No minimums for the first 6 months. After that, the program assumes you're growing toward 10+ active customers — otherwise the math doesn't work for either of us." },
];

export default function Whitelabel() {
  useEffect(() => {
    document.title = "White-label program — TrainYourAgent";
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
    canon.href = "https://trainyouragent.com/whitelabel";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "Run TrainYourAgent as your own AI service line — fully white-labeled. Your brand, your pricing, our infrastructure.";
  }, []);

  // Form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          company: agency,
          source: "whitelabel-apply",
          path: location.pathname,
          payload: { agency, customers: size, notes: notes.slice(0, 1500) },
          website: hp,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("ok");
    } catch {
      setState("err");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        {/* Hero */}
        <section className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            White-label program
          </div>
          <h1 className="text-[40px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold" style={{ color: NAVY }}>
            Run TrainYourAgent as{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              your own AI service line.
            </span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            Your brand, your domain, your pricing, your contract. Our voice and
            chat infrastructure underneath. Your customers never see us, your
            team never builds it, your margin is whatever you decide.
          </p>

          <div className="mt-10 space-y-6 text-[16px] text-slate-700 leading-[1.7] max-w-3xl">
            <p>
              Most agencies who try to add AI as a service line discover three
              expensive truths within the first 90 days: voice infrastructure is
              harder than it looks, model costs swing wildly without observability,
              and customer expectations are higher than any single LLM can meet.
              By month four, they're losing money on every account.
            </p>
            <p>
              The white-label program exists so you don't have to build that
              stack. You bring the customer relationship — sales conversations,
              scoping, account management, the boring brilliant work of running
              an agency. We bring the infrastructure that actually answers the
              phone at 2am and tells the customer the right thing.
            </p>
            <p>
              You keep the relationship. We power the infrastructure. The math
              works because we run dozens of these and you'd be running one.
            </p>
          </div>
        </section>

        {/* What you get */}
        <section className="max-w-5xl mx-auto mt-20">
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-8" style={{ color: NAVY }}>
            What you get
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.h} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-[16px] font-semibold mb-2" style={{ color: NAVY }}>{f.h}</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">{f.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Economics */}
        <section className="max-w-4xl mx-auto mt-20 rounded-2xl bg-[#042C53] text-white p-8 sm:p-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#9BC3E8] font-semibold mb-4">
            The economics
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-6 leading-tight">
            $7,500 setup. $3,000/mo base. Per-agent fee on top.
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 text-[14px]">
            <div>
              <div className="text-[28px] font-semibold text-white" style={{ fontFamily: SERIF_ITALIC }}>$7,500</div>
              <div className="text-white/75">One-time setup. Branded portal, domain wiring, ops training.</div>
            </div>
            <div>
              <div className="text-[28px] font-semibold text-white" style={{ fontFamily: SERIF_ITALIC }}>$3,000/mo</div>
              <div className="text-white/75">Base platform. Includes 3 active agent slots.</div>
            </div>
            <div>
              <div className="text-[28px] font-semibold text-white" style={{ fontFamily: SERIF_ITALIC }}>$450/agent</div>
              <div className="text-white/75">Per-active-agent fee above 3. Drops with volume.</div>
            </div>
          </div>
          <p className="mt-6 text-[14px] text-white/85 leading-relaxed">
            Charge your customers whatever the market will bear. Typical resale
            pricing is $1,800–$4,500/mo per active agent. With 10 customers
            you're at ~$30K MRR on us, ~$22K margin. With 30, you're at six
            figures monthly with one person managing the program.
          </p>
        </section>

        {/* Process */}
        <section className="max-w-5xl mx-auto mt-20">
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-8" style={{ color: NAVY }}>
            The 6-step process
          </h2>
          <ol className="space-y-5">
            {PROCESS.map((s) => (
              <li key={s.n} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#E6F1FB] flex items-center justify-center font-semibold text-[14px]" style={{ color: NAVY }}>
                  {s.n}
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold mb-1" style={{ color: NAVY }}>{s.t}</h3>
                  <p className="text-[15px] text-slate-700 leading-relaxed">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Apply form */}
        <section id="apply" className="max-w-3xl mx-auto mt-20">
          {state === "ok" ? (
            <div className="rounded-2xl bg-[#E6F1FB] p-8 sm:p-10">
              <h2 className="text-[28px] font-semibold mb-3" style={{ color: NAVY }}>
                Application received.
              </h2>
              <p className="text-[15px] text-slate-700">
                We review every application personally. You'll hear from us
                within two business days. If we're a fit, the next step is a
                45-minute scoping call.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#E6F1FB] p-8 sm:p-10">
              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>
                Apply
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-semibold mb-2" style={{ color: NAVY }}>
                Apply for the white-label program.
              </h2>
              <p className="text-[14px] text-slate-700 mb-6 max-w-2xl">
                Five-minute form. We approve agencies with an existing book of
                business and the operational maturity to run customer-facing AI.
              </p>
              <form onSubmit={submit}>
                <label className="sr-only" aria-hidden>
                  Leave blank
                  <input type="text" tabIndex={-1} value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="you@agency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Agency name"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                  />
                  <select
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
                  >
                    <option value="">Current customer count…</option>
                    <option>1–5 customers</option>
                    <option>6–15 customers</option>
                    <option>16–50 customers</option>
                    <option>50+ customers</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  placeholder="What kinds of customers do you serve? What AI work have you done before?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] mb-3"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
                >
                  {state === "sending" ? "Sending…" : "Submit application →"}
                </button>
                {state === "err" && (
                  <p className="mt-3 text-[12.5px] text-red-700">Something broke — try again or email alexander@trainyouragent.com.</p>
                )}
              </form>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mt-20">
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-8" style={{ color: NAVY }}>
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group bg-white border border-slate-200 rounded-2xl p-5 open:border-[#185FA5]/60">
                <summary className="cursor-pointer flex items-start justify-between gap-4 text-[16px] font-medium" style={{ color: NAVY }}>
                  <span>{f.q}</span>
                  <span className="text-[#185FA5] flex-shrink-0 text-[18px] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14.5px] text-slate-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="max-w-3xl mx-auto mt-12 text-center text-[13px]">
          <Link to="/reseller" className="text-[#185FA5] font-medium hover:underline mr-6">
            Reseller program (non-white-label) →
          </Link>
          <Link to="/partners" className="text-[#185FA5] font-medium hover:underline">
            All partner programs →
          </Link>
        </div>
      </main>
      <FooterV44 />
    </div>
  );
}
