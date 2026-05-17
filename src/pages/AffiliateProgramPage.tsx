// src/pages/AffiliateProgramPage.tsx — v49

import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { withAttribution } from "@/lib/affiliate";

function setHead() {
  if (typeof document === "undefined") return;
  document.title = "Affiliate program — TrainYourAgent";
  const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", value);
  };
  setMeta("meta[name='description']", "name", "description", "20% recurring commission for 12 months. First 25 affiliates get locked-in 25% terms. Apply to the TrainYourAgent affiliate program.");
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = "https://trainyouragent.com/affiliate-program";
  if (!document.getElementById("tya-fonts")) {
    const l = document.createElement("link");
    l.id = "tya-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }
}

const STEPS = [
  { title: "Apply", body: "Tell us who you are and what audience you reach. We review every application by hand." },
  { title: "Get a tracking link", body: "Once approved you get a personalized ?aff= link plus a small set of pre-built deep links to specific pages." },
  { title: "Send qualified traffic", body: "Share the link wherever your audience already trusts you — newsletter, podcast, community, sales calls." },
  { title: "Get paid", body: "20% recurring commission for 12 months on every paying customer attributed to you, paid monthly via Stripe Connect." },
];

function AffiliateForm() {
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
          company: String(fd.get("audience") || ""),
          source: "affiliate-application",
          path: "/affiliate-program",
          payload: {
            channel: String(fd.get("channel") || ""),
            audience_size: String(fd.get("audience_size") || ""),
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
    return <div className="rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/30 p-6 text-[#042C53] text-[14px]">Got it. We will review your application and reply within 5 business days. If you are among the first 25 approved, you keep the 25% rate forever.</div>;
  }
  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <input name="name" required placeholder="Name" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="audience" required placeholder="Audience / publication / newsletter name" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <select name="channel" required defaultValue="" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="" disabled>Primary channel</option>
        <option>Newsletter</option>
        <option>Podcast</option>
        <option>YouTube</option>
        <option>Twitter / X</option>
        <option>LinkedIn</option>
        <option>Community / Discord / Slack</option>
        <option>Agency / consulting</option>
        <option>Other</option>
      </select>
      <input name="audience_size" placeholder="Audience size (rough is fine)" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <textarea name="why" required rows={3} placeholder="Why are you a good fit?" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button disabled={state === "sending"} className="px-6 py-3 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Apply →"}
        </button>
        {state === "error" && <span className="text-[12px] text-red-700">{err}</span>}
      </div>
    </form>
  );
}

export default function AffiliateProgramPage() {
  useEffect(() => { setHead(); }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Affiliate program · Beta</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] font-semibold text-[#042C53] tracking-tight">
            20% recurring for 12 months. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>First 25 lock in 25%.</span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            We are in beta. The first 25 affiliates approved get early access plus a locked-in 25% commission rate forever on every customer they refer.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">How it works</div>
          <h2 className="text-[26px] sm:text-[36px] font-semibold text-[#042C53] mb-8 leading-tight">Four steps.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-mono font-semibold mb-2">Step {String(i + 1).padStart(2, "0")}</div>
                <div className="text-[17px] font-semibold text-[#042C53] mb-2">{s.title}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">The terms</div>
          <h2 className="text-[22px] sm:text-[30px] font-semibold text-[#042C53] mb-4">The fine print, in plain English.</h2>
          <ul className="space-y-3">
            <Li>20% of every paying customer's net retainer, every month, for the first 12 months they remain a customer.</Li>
            <Li>First 25 affiliates approved keep 25% instead of 20%, forever, on every customer they ever refer.</Li>
            <Li>First-touch attribution, 90-day cookie. If two affiliates touch the same lead, the first one to refer wins.</Li>
            <Li>Paid monthly via Stripe Connect on the first business day of the following month, after the customer's invoice clears.</Li>
            <Li>Self-referrals, brand-bid PPC, and incentive offers (cashback, gift cards) are not eligible.</Li>
            <Li>You can stop any time. Earned commissions on existing customers continue for the full 12 months.</Li>
          </ul>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Apply</div>
          <h2 className="text-[26px] sm:text-[36px] font-semibold text-[#042C53] mb-3">Join the beta.</h2>
          <p className="text-[14px] text-slate-700 mb-6 leading-relaxed">Every application is reviewed by hand. We are looking for affiliates with a real audience of SMB operators or technical decision-makers.</p>
          <AffiliateForm />
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
