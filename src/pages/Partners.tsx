// src/pages/Partners.tsx
// v41: /partners — referral program landing page.

import { useEffect, useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FONT = "'Inter Tight', system-ui, -apple-system, sans-serif";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

const STEPS = [
  { n: 1, title: "Apply", body: "Tell us who you'd refer. Approval in 48h. No fees, no exclusivity." },
  { n: 2, title: "Share a link",  body: "Send your referral link or co-sign a warm intro. We close it, you get credit." },
  { n: 3, title: "Earn 20% MRR", body: "Paid monthly for 12 months on every customer that signs. ACH, Wise, or Stripe Connect." },
];

const TIERS = [
  {
    name: "Affiliate", price: "20% MRR · 12 mo",
    body: "Anyone with a relevant network. Refer warm leads, we close — paid monthly.",
    perks: ["20% MRR for 12 months", "Co-branded landing page", "Quarterly partner call"],
  },
  {
    name: "Reseller", price: "30% MRR · 24 mo",
    body: "Agencies, consultants, fractional CTOs. You own the relationship, we white-glove the build.",
    perks: ["30% MRR for 24 months", "Dedicated Slack channel", "Solutions engineer on demand"],
    highlight: true,
  },
  {
    name: "White-label", price: "Custom",
    body: "Run TYA as your own brand. Full reseller pricing, your name on the dashboard.",
    perks: ["Custom margin (50%+)", "Brandable admin UI", "Co-marketing budget"],
  },
];

// Use existing brand-colored boxes as logo placeholders.
const LOGO_PLACEHOLDERS = [
  "Studio North", "Agency Forge", "Loop Labs", "Quint Group",
  "Castle & Co", "Northbound", "Foundry", "Bright Stack",
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
          source: "partner-apply",
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
      <Header />

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-4" style={{ color: BLUE }}>
          Partners
        </div>
        <h1 className="text-[36px] sm:text-[60px] font-semibold leading-[1.02] tracking-[-0.02em]" style={{ color: NAVY }}>
          Refer a customer, earn{" "}
          <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
            20% MRR for 12 months.
          </span>
        </h1>
        <p className="mt-5 text-[17px] text-slate-600 max-w-2xl">
          The simplest referral program in B2B AI. No tiers to unlock, no quotas, no exclusivity.
          Send us a warm lead — we'll close it — you get paid monthly.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h2 className="text-[24px] font-semibold mb-6" style={{ color: NAVY }}>How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 p-5">
              <div className="text-[44px] font-semibold leading-none mb-2" style={{ color: BLUE }}>{s.n}</div>
              <div className="text-[16px] font-semibold mb-1" style={{ color: NAVY }}>{s.title}</div>
              <div className="text-[13px] text-slate-600 leading-snug">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h2 className="text-[24px] font-semibold mb-6" style={{ color: NAVY }}>Partner tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border p-5 sm:p-6 flex flex-col"
              style={{
                background: t.highlight ? TINT : "white",
                borderColor: t.highlight ? BLUE : "#e2e8f0",
              }}
            >
              <div className="text-[12px] uppercase tracking-[0.15em] font-semibold mb-1" style={{ color: BLUE }}>
                {t.name}
              </div>
              <div className="text-[20px] font-semibold mb-2" style={{ color: NAVY }}>{t.price}</div>
              <div className="text-[13px] text-slate-700 mb-4 leading-snug">{t.body}</div>
              <ul className="space-y-1.5 text-[13px] text-slate-700">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2"><span style={{ color: BLUE }}>✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Logo wall placeholder */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 border-t border-slate-200">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-6">
          Partners in the pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LOGO_PLACEHOLDERS.map((n) => (
            <div key={n} className="aspect-[3/1] flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[13px] font-semibold tracking-tight" style={{ color: NAVY }}>{n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Apply */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-200">
        <h2 className="text-[24px] font-semibold mb-2" style={{ color: NAVY }}>Apply</h2>
        <p className="text-[14px] text-slate-600 mb-6">
          We review every application personally. Approval in 48 hours.
        </p>
        {state === "done" ? (
          <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 text-[14px]">
            Got it — we'll be in touch within 48 hours.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3" aria-label="Partner application">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" aria-label="Your name"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" aria-label="Email"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
            </div>
            <input
              type="text" value={company} onChange={(e) => setCo(e.target.value)}
              placeholder="Company / agency" aria-label="Company or agency"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={800}
              placeholder="Who would you refer? What's your network look like?"
              aria-label="Notes"
              className="w-full p-4 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {err && <div role="alert" className="text-[12px] text-red-600">{err}</div>}
            {state === "error" && <div role="alert" className="text-[12px] text-red-600">Couldn't send — try again.</div>}
            <button
              type="submit" disabled={state === "sending"}
              className="px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
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
