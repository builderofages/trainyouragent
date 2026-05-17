// src/pages/Reseller.tsx — v52B
// /reseller — resell the standard TYA offering, keep 30-40% of MRR.
// Apply form posts to `/api/lead` source `reseller-apply`.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const ENDPOINT = "/api/lead";

const TIERS = [
  {
    name: "Bronze",
    minimum: "3 active customers",
    payout: "30%",
    perks: [
      "Deal registration protection",
      "Inbound lead routing for your territory",
      "Sales collateral library",
      "Monthly partner office hours",
    ],
  },
  {
    name: "Silver",
    minimum: "10+ active customers",
    payout: "35%",
    perks: [
      "Everything in Bronze",
      "Dedicated partner manager",
      "Co-marketing budget ($1,500/quarter)",
      "Featured in partner directory",
    ],
  },
  {
    name: "Gold",
    minimum: "25+ active customers",
    payout: "40%",
    perks: [
      "Everything in Silver",
      "Custom pricing for enterprise deals",
      "Quarterly business review with leadership",
      "Influence on the public roadmap",
    ],
  },
];

const PROCESS = [
  { n: "01", t: "Apply", b: "Quick form. We approve based on existing book of business and territory fit. Decisions in 48 hours." },
  { n: "02", t: "First deal-reg", b: "Register your first opportunity in the partner portal. Reg lasts 90 days, renewable on activity." },
  { n: "03", t: "First won customer", b: "We support you through the sales cycle: discovery call assistance, scoping help, contract review." },
  { n: "04", t: "Quarterly QBR", b: "Once you're Silver+, we run a quarterly business review — pipeline, pricing, what to invest in next." },
  { n: "05", t: "Tier promotion", b: "Tiers re-evaluated quarterly. Hit the next count, get the next payout — retroactive to the start of the quarter." },
];

const FAQ = [
  { q: "How is this different from white-label?", a: "Resellers sell the TrainYourAgent-branded product. Customers see our brand, our portal, our support. You're our reseller, not our infrastructure provider. White-label is for agencies who want their own brand front-and-center; reseller is for agencies who want zero infrastructure overhead." },
  { q: "When do I get paid?", a: "30 days after the customer pays us. We send a single ACH on the 15th of every month for the prior month's earned commissions." },
  { q: "What's deal registration?", a: "When you find an opportunity, you register it in the partner portal. For the next 90 days, that account is yours — if anyone else closes them, you still get the commission. Standard channel practice." },
  { q: "What if my customer churns?", a: "Commissions stop the month they churn. We don't claw back paid commissions. If they come back later, the original registering partner gets the new commission unless the relationship has clearly transferred." },
  { q: "Is there a contract minimum?", a: "No multi-year commitments. The Bronze tier requires 3 active customers to maintain. Drop below for two consecutive quarters and we deactivate (you can re-apply anytime)." },
];

export default function Reseller() {
  useEffect(() => {
    document.title = "Reseller program — TrainYourAgent";
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
    canon.href = "https://trainyouragent.com/reseller";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "Resell TrainYourAgent. Keep 30-40% of MRR for the life of the customer. Three tiers, real deal-reg, no minimums.";
  }, []);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [territory, setTerritory] = useState("");
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
          company,
          source: "reseller-apply",
          path: location.pathname,
          payload: { territory, notes: notes.slice(0, 1500) },
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
        <section className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Reseller program
          </div>
          <h1 className="text-[40px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold" style={{ color: NAVY }}>
            Resell TrainYourAgent.{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              Keep 30% of MRR
            </span>{" "}
            for the life of the customer.
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            You bring the customer. We close, ship, and support. Commission
            paid monthly, recurring for the lifetime of the account.
          </p>

          <p className="mt-8 text-[15px] text-slate-700 max-w-3xl leading-relaxed">
            This is the traditional reseller program — designed for service
            agencies, IT consultancies, and operator networks who have trust
            with SMBs but no desire to operate AI infrastructure themselves.
            You introduce, we deliver, you collect.
          </p>
        </section>

        {/* Tiers */}
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-8" style={{ color: NAVY }}>
            Three tiers, transparent payouts
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-6 ${
                  i === 1
                    ? "border-[#185FA5] bg-[#E6F1FB] ring-1 ring-[#185FA5]/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <h3 className="text-[20px] font-semibold mb-1" style={{ color: NAVY }}>{t.name}</h3>
                <div className="text-[13px] text-slate-500 mb-4">{t.minimum}</div>
                <div className="text-[44px] font-semibold leading-none mb-1" style={{ color: NAVY, fontFamily: SERIF_ITALIC }}>
                  {t.payout}
                </div>
                <div className="text-[12px] uppercase tracking-[0.14em] text-slate-500 mb-5">recurring MRR</div>
                <ul className="space-y-2 text-[13.5px] text-slate-700">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2 items-start">
                      <span className="text-[#185FA5] mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-8" style={{ color: NAVY }}>
            What every partner gets
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { h: "Deal registration", b: "Register an opportunity, the account is protected for 90 days. No fear of internal sales beating you to it." },
              { h: "Lead routing", b: "Inbound leads in your geography and vertical get routed to you first. Geographic exclusivity at Silver+." },
              { h: "Sales materials", b: "Pitch decks, demo scripts, ROI calculators, case studies — all co-brandable. Stop building from scratch." },
              { h: "Monthly office hours", b: "Live group call with our sales leadership. Bring deal questions, hear what's working for other partners, learn the script." },
            ].map((x) => (
              <div key={x.h} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-[16px] font-semibold mb-2" style={{ color: NAVY }}>{x.h}</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-[28px] sm:text-[36px] font-semibold mb-8" style={{ color: NAVY }}>
            The 5-step process
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
                We review every application personally. You'll hear back within
                two business days.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#E6F1FB] p-8 sm:p-10">
              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>
                Apply
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-semibold mb-2" style={{ color: NAVY }}>
                Apply to the reseller program.
              </h2>
              <p className="text-[14px] text-slate-700 mb-6 max-w-2xl">
                Three-minute form. Decisions within 48 hours.
              </p>
              <form onSubmit={submit}>
                <label className="sr-only" aria-hidden>
                  Leave blank
                  <input type="text" tabIndex={-1} value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]" />
                  <input type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]" />
                  <input type="text" required placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]" />
                  <input type="text" placeholder="Geographic territory or vertical focus" value={territory} onChange={(e) => setTerritory(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]" />
                </div>
                <textarea rows={3} placeholder="Tell us about your existing customer base and why you're a fit." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] mb-3" />
                <button type="submit" disabled={state === "sending"} className="px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]">
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
          <Link to="/whitelabel" className="text-[#185FA5] font-medium hover:underline mr-6">
            White-label program (your brand) →
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
