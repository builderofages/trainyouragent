// src/pages/Affiliates.tsx — v76-c
//
// Public affiliate program landing. New canonical /affiliates route alongside
// the existing /affiliate-program (kept for backlink continuity from v49).
// Same source of truth for the application: POSTs to /api/lead with
// source="affiliate-application", which is already in the allowlist.
//
// Differences from /affiliate-program:
//   - Tighter 3-card "how it works" (Refer / Track / Get paid)
//   - "Already approved?" link to /affiliates/portal (gated coming-soon, v77)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { withAttribution } from "@/lib/affiliate";

const HOW = [
  {
    n: "01",
    title: "Refer",
    body: "Share your tracking link wherever you already have trust — newsletter, podcast, agency client list, founder community.",
  },
  {
    n: "02",
    title: "Track",
    body: "Every click and conversion is attributed to you with first-touch + 90-day cookie. Real-time dashboard in your affiliate portal.",
  },
  {
    n: "03",
    title: "Get paid",
    body: "20% of every retainer, every month, for the first 12 months they stay a customer. Paid via Stripe Connect on the 1st of each month.",
  },
];

function ApplyForm() {
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
        body: JSON.stringify(
          withAttribution({
            email: String(fd.get("email") || ""),
            name: String(fd.get("name") || ""),
            company: String(fd.get("audience") || ""),
            source: "affiliate-application",
            path: "/affiliates",
            payload: {
              audience_description: String(fd.get("audience") || ""),
              expected_referral_volume: String(fd.get("volume") || ""),
            },
            website: "",
            hp: "",
          }),
        ),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState("sent");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e2: any) {
      setState("error");
      setErr(e2?.message || "Network error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/30 p-6 text-[#042C53] text-[14px]">
        Got it. We review every application by hand and reply within 5 business days. If you're among the first 25 approved, you keep 25% (not 20%) forever on every customer you refer.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <input
        name="name"
        required
        placeholder="Name"
        className="rounded-xl border border-slate-300 px-4 py-3 text-[14px]"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-xl border border-slate-300 px-4 py-3 text-[14px]"
      />
      <textarea
        name="audience"
        required
        rows={3}
        placeholder="Audience description — who do you reach, where, and how big?"
        className="rounded-xl border border-slate-300 px-4 py-3 text-[14px] sm:col-span-2"
      />
      <select
        name="volume"
        required
        defaultValue=""
        className="rounded-xl border border-slate-300 px-4 py-3 text-[14px] bg-white sm:col-span-2"
      >
        <option value="" disabled>
          Expected referral volume (next 90 days)
        </option>
        <option>1-3 referrals</option>
        <option>4-10 referrals</option>
        <option>11-25 referrals</option>
        <option>26-100 referrals</option>
        <option>100+ referrals</option>
      </select>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          disabled={state === "sending"}
          className="px-6 py-3 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Apply →"}
        </button>
        {state === "error" && <span className="text-[12px] text-red-700">{err}</span>}
      </div>
    </form>
  );
}

export default function Affiliates() {
  useEffect(() => {
    // no-op — Helmet manages title/canonical
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <Helmet>
        <title>Refer a business. Get 20% recurring for 12 months. — TrainYourAgent affiliates</title>
        <meta
          name="description"
          content="Refer a business to TrainYourAgent and earn 20% recurring commission for 12 months. First 25 approved keep 25% forever. Apply in 90 seconds."
        />
        <link rel="canonical" href="https://www.trainyouragent.com/affiliates" />
        <meta property="og:title" content="Refer a business. Get 20% recurring for 12 months." />
        <meta property="og:description" content="Apply to the TrainYourAgent affiliate program." />
        <meta property="og:url" content="https://www.trainyouragent.com/affiliates" />
      </Helmet>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="pt-32 pb-14 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/55 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Affiliate program · Beta
          </div>
          <h1 className="text-[44px] sm:text-[64px] leading-[1.04] font-semibold text-[#042C53] tracking-tight">
            Refer a business.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Get 20% recurring for 12 months.
            </span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[19px] text-slate-700 max-w-2xl leading-relaxed">
            One trained AI agent. One paying customer. 20% of every retainer for the first year they stick around. First 25 affiliates approved keep 25% forever.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E]"
            >
              Apply now →
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 bg-white text-[#042C53] text-[14px] font-semibold hover:border-[#185FA5]"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 cards */}
      <section id="how" className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">How it works</div>
          <h2 className="text-[26px] sm:text-[36px] font-semibold text-[#042C53] mb-9 leading-tight">
            Three steps. No invoicing, no chasing payment.
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {HOW.map((h) => (
              <div key={h.n} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#042C53]/30 hover:shadow-sm transition">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-mono font-semibold mb-2">{h.n}</div>
                <div className="text-[18px] font-semibold text-[#042C53] mb-2">{h.title}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{h.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F6FAFE] p-6">
            <div className="text-[13px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2">Math example</div>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              You refer one HVAC operator who signs a $999/mo retainer. You earn <strong className="text-[#042C53]">$199.80/mo for 12 months = $2,397.60</strong> on that one referral. Refer 5 retainers in a quarter and you're at ~$12K in annualized recurring revenue from this program alone.
            </p>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section className="px-5 sm:px-8 py-14 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">The terms</div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold text-[#042C53] mb-5">In plain English.</h2>
          <ul className="space-y-3">
            <Li>20% of every paying customer's net retainer, every month, for the first 12 months they remain active.</Li>
            <Li>First 25 affiliates approved keep 25% (not 20%) forever, on every customer they ever refer.</Li>
            <Li>First-touch attribution, 90-day cookie. If two affiliates touch the same lead, the first one wins.</Li>
            <Li>Paid via Stripe Connect on the first business day of the month, after the customer's invoice clears.</Li>
            <Li>Self-referrals, brand-bid PPC, and incentive offers (cashback, gift cards) are not eligible.</Li>
            <Li>You can stop any time. Earned commissions on existing customers continue for the full 12 months.</Li>
          </ul>
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Apply</div>
          <h2 className="text-[26px] sm:text-[36px] font-semibold text-[#042C53] mb-3">Join the beta.</h2>
          <p className="text-[14px] text-slate-700 mb-6 leading-relaxed">
            Every application is reviewed by hand. We're looking for affiliates with a real audience of SMB operators or technical decision-makers. Most replies in 5 business days.
          </p>
          <ApplyForm />

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-[13px] text-slate-700">
            <span className="font-semibold text-[#042C53]">Already approved?</span>{" "}
            <Link to="/affiliates/portal" className="text-[#185FA5] hover:underline font-semibold">
              Generate your tracking link →
            </Link>
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[14.5px] text-slate-700 leading-[1.7]">
      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 bg-[#185FA5]" />
      <span>{children}</span>
    </li>
  );
}
