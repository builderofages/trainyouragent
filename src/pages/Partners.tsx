// src/pages/Partners.tsx
// v46a: HONEST partner program — waitlist, not invented tiers/logos.
// We do not have a published, paying partner program yet. Rather than
// dangle a "20% MRR for 12 months" promise we can't yet operationally
// deliver, we surface what we WILL do for early partners and collect
// real interest.

import { useEffect, useState, type FormEvent } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

const FONT = "'Inter Tight', system-ui, -apple-system, sans-serif";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

const CAL_URL = "https://cal.com/trainyouragent/30min";

const EARLY_PARTNER_PRINCIPLES = [
  {
    h: "Cash, not points.",
    b: "When the program launches it will be a flat revenue share paid monthly via ACH or Stripe Connect. We'll publish the exact percentage once we've run it through a few partners and know it's sustainable. We won't promise a number before we've tested it.",
  },
  {
    h: "One contract, plain English.",
    b: "Two pages, no exclusivity, no quotas, no clawback if the customer churns after 90 days. If that's not the contract you'd sign yourself, we won't ask you to sign it.",
  },
  {
    h: "Your name on the build, if you want it.",
    b: "Reseller partners can run TrainYourAgent under their brand. Your dashboard, your invoice, our engineering. Co-marketing where it makes sense.",
  },
  {
    h: "Real time with the founder.",
    b: "Partners get a direct Slack DM with Alexander, a monthly partner roadmap call, and a heads-up on every release before public launch.",
  },
];

export default function Partners() {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [company, setCo]    = useState("");
  const [note, setNote]     = useState("");
  const [state, setState]   = useState<"idle"|"sending"|"done"|"error">("idle");
  const [err, setErr]       = useState<string|null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Partners — TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr("Enter a valid email."); return; }
    setErr(null); setState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email, name, company,
          source: "partner-waitlist",
          path: "/partners",
          payload: { note },
          website: "", hp: "",
        }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <SiteNav />

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-4" style={{ color: BLUE }}>
          Partners · Building the program
        </div>
        <h1 className="text-[36px] sm:text-[60px] font-semibold leading-[1.02] tracking-[-0.02em]" style={{ color: NAVY }}>
          We're building the partner program{" "}
          <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
            in public.
          </span>
        </h1>
        <p className="mt-5 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
          The first version will go to a small group of agencies, fractional CTOs,
          and consultants we already know and trust. If you'd refer customers to
          a small, founder-led AI build shop based in Tampa Bay, get on the list —
          you'll get the contract draft before anyone else and direct input on
          rates and terms.
        </p>
      </section>

      {/* Honest status */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-12">
        <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: TINT, borderColor: "#BDDAF4" }}>
          <div className="text-[12px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>
            What we are NOT doing
          </div>
          <ul className="text-[15px] sm:text-[16px] leading-relaxed text-slate-800 space-y-2 max-w-3xl">
            <li>· Publishing a "20% MRR for 12 months" rate before we've tested it.</li>
            <li>· Posting fake partner logos to look bigger than we are.</li>
            <li>· Spinning up Affiliate / Reseller / White-label tier theater.</li>
            <li>· Asking you to sign exclusivity or hit quotas.</li>
          </ul>
        </div>
      </section>

      {/* What we WILL do */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h2 className="text-[24px] sm:text-[28px] font-semibold mb-6" style={{ color: NAVY }}>What we WILL do for early partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EARLY_PARTNER_PRINCIPLES.map((p) => (
            <div key={p.h} className="rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div className="text-[16px] font-semibold mb-2" style={{ color: NAVY }}>{p.h}</div>
              <div className="text-[14px] text-slate-700 leading-relaxed">{p.b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist apply */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-200">
        <h2 className="text-[24px] sm:text-[28px] font-semibold mb-2" style={{ color: NAVY }}>Get on the early-partner list</h2>
        <p className="text-[14px] text-slate-700 mb-6">
          Alexander reads every application personally. Reply within 2 business days.
        </p>
        {state === "done" ? (
          <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 text-[14px]">
            Got it — we'll be in touch within 2 business days. In the meantime,{" "}
            <a href={CAL_URL} target="_blank" rel="noopener" className="underline font-semibold">book a 30-min call</a>{" "}
            if you want to talk now.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3" aria-label="Partner waitlist">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" aria-label="Your name"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[16px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" aria-label="Email"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[16px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
            </div>
            <input
              type="text" value={company} onChange={(e) => setCo(e.target.value)}
              placeholder="Company / agency" aria-label="Company or agency"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[16px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={800}
              placeholder="Who would you refer? What's your network look like? (one paragraph is enough)"
              aria-label="Notes"
              className="w-full p-4 rounded-lg border border-slate-300 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {err && <div role="alert" className="text-[13px] text-red-700">{err}</div>}
            {state === "error" && <div role="alert" className="text-[13px] text-red-700">Couldn't send — try again.</div>}
            <button
              type="submit" disabled={state === "sending"}
              className="px-6 py-3 rounded-xl bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              {state === "sending" ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
}
