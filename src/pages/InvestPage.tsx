// src/pages/InvestPage.tsx — v49
// Founder-led, honest investor page. Not actively raising.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { withAttribution } from "@/lib/affiliate";

function setHead() {
  if (typeof document === "undefined") return;
  document.title = "Investing in TrainYourAgent";
  const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", value);
  };
  setMeta("meta[name='description']", "name", "description", "We are not raising right now. We are raising attention. If you back operator-led AI agency-layer companies, here is the honest pitch.");
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = "https://trainyouragent.com/invest";
  if (!document.getElementById("tya-fonts")) {
    const l = document.createElement("link");
    l.id = "tya-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }
}

const PITCH = [
  { title: "Current stage", body: "$20K+ MRR, four years building AI agents, two years operating TrainYourAgent as a real production business with paying SMB customers. Tampa-based. Profitable on a cash basis." },
  { title: "What we are building", body: "The AI agency-OS for SMBs. Voice agents, chat agents, back-office agents — packaged, deployed, and operated end to end by us so the customer never sees a config file." },
  { title: "Why now", body: "The post-Claude-4 inflection has dropped per-agent build cost by an order of magnitude and pushed reliability into the territory where SMB operators will trust the output. The market is forming around delivery, not platforms." },
  { title: "What we would do with capital", body: "Two founding engineers, one solutions architect, one GTM lead. Tighten the build process from days to hours, push margin from project-grade to product-grade, and lock in the first hundred multi-agent accounts." },
  { title: "Unfair advantage", body: "Founder who shipped agents before agents were a category. Welder's instinct for executing under constraint. Speed: from inbound request to working sandbox in 48 hours, while the rest of the market is still scheduling a demo call." },
];

function InvestForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = withAttribution({
      email: String(fd.get("email") || ""),
      name: String(fd.get("name") || ""),
      company: String(fd.get("fund") || ""),
      source: "investor-inquiry",
      path: "/invest",
      payload: {
        check_size: String(fd.get("check_size") || ""),
        thesis: String(fd.get("thesis") || ""),
      },
      website: "", hp: "",
    });
    setState("sending");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState("sent");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e2: any) {
      setState("error"); setErr(e2?.message || "Network error");
    }
  }
  if (state === "sent") {
    return (
      <div className="rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/30 p-6 text-[#042C53]">
        <div className="text-[16px] font-semibold mb-1">Thanks.</div>
        <div className="text-[14px] leading-relaxed">Alexander reviews every investor email personally. Reply within 5 business days.</div>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <input name="name" required placeholder="Your name" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="fund" required placeholder="Fund / firm" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <select name="check_size" required defaultValue="" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="" disabled>Check size range</option>
        <option>under $50K (angel)</option>
        <option>$50K – $250K</option>
        <option>$250K – $1M</option>
        <option>$1M – $5M (seed lead)</option>
        <option>over $5M</option>
      </select>
      <textarea name="thesis" rows={4} required placeholder="Thesis fit — what makes us interesting to you?" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button disabled={state === "sending"} className="px-6 py-3 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send →"}
        </button>
        {state === "error" && <span className="text-[12px] text-red-700">{err}</span>}
      </div>
    </form>
  );
}

export default function InvestPage() {
  useEffect(() => { setHead(); }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#042C53] to-[#0A3D6E] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-4">Investing in TrainYourAgent</div>
          <h1 className="text-[40px] sm:text-[64px] lg:text-[78px] leading-[1.02] font-semibold tracking-tight">
            We are not raising right now. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>We are raising attention.</span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[19px] text-white/85 max-w-3xl leading-relaxed">
            If you back operator-led AI companies at the agency layer, we want to know you. Send an email; we will reply.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">The pitch in five bullets</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] mb-8 leading-tight">Short and honest.</h2>
          <div className="space-y-5">
            {PITCH.map((p, i) => (
              <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-5">
                <span className="flex-shrink-0 text-[18px] font-mono font-semibold text-[#185FA5] mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-[17px] font-semibold text-[#042C53] mb-1">{p.title}</div>
                  <div className="text-[14.5px] text-slate-700 leading-relaxed">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">If you would like to invest</div>
          <h2 className="text-[26px] sm:text-[36px] font-semibold text-[#042C53] mb-3 leading-tight">Send Alexander a note.</h2>
          <p className="text-[14.5px] text-slate-700 mb-6 leading-relaxed">
            We will reply within five business days. There is no data room yet — we will share what is appropriate to share after a first conversation.
          </p>
          <InvestForm />
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[14px] text-slate-600 leading-relaxed mb-4">Prefer to read first?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/mission" className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#042C53] text-[13.5px] font-semibold text-[#042C53]">Mission</Link>
            <Link to="/metrics" className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#042C53] text-[13.5px] font-semibold text-[#042C53]">Public metrics</Link>
            <Link to="/about" className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#042C53] text-[13.5px] font-semibold text-[#042C53]">About</Link>
            <Link to="/customers" className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#042C53] text-[13.5px] font-semibold text-[#042C53]">Customers</Link>
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
