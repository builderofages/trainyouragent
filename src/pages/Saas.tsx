// src/pages/Saas.tsx
// v71: SaaS product catalog — the three productized SaaS offerings Grok
// Heavy recommended. Self-Serve Agent Builder is live; the other two are
// waitlist-only until paid demand validates them.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { RevealUp, StaggerChildren, HoverLift } from "@/components/motion";
import { fireEvent } from "@/lib/event";

type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  status: "live" | "waitlist";
  bullets: string[];
  cta: { label: string; to: string };
  /** lead source for waitlist signups */
  waitlistSource?: string;
};

const PRODUCTS: Product[] = [
  {
    slug: "agent-builder",
    name: "Self-Serve Agent Builder",
    tagline: "Build your own AI agent — unlimited drafts, embed anywhere.",
    price: "$99/mo",
    status: "live",
    bullets: [
      "Unlimited agents (free tier gets 1)",
      "Embeddable widget for your site",
      "Custom branding — your logo, your voice",
      "Save, share, iterate — version every agent",
      "Export the prompt anytime",
      "Transcript log + weekly tune-up suggestions",
    ],
    cta: { label: "See it · Start free trial →", to: "/saas/agent-builder" },
  },
  {
    slug: "vertical-playbook",
    name: "Vertical Playbook Library",
    tagline: "The full operating playbook for one niche — updated monthly.",
    price: "$49/mo per niche",
    status: "waitlist",
    bullets: [
      "Niche-specific voice scripts + chat flows",
      "Industry benchmarks (call duration, deflection, conversion)",
      "Copy-paste prompts for every channel",
      "Monthly updates from real deployments",
      "Slack channel with operators in your vertical",
    ],
    cta: { label: "Get notified →", to: "/saas#waitlist-vertical-playbook" },
    waitlistSource: "saas-vertical-playbook-waitlist",
  },
  {
    slug: "website-audit-pro",
    name: "AI Website Audit Pro",
    tagline: "Continuous AI-readiness scoring + per-audit deep dives.",
    price: "$79/mo + per-audit",
    status: "waitlist",
    bullets: [
      "Monthly automated AI-readiness scan of your site",
      "On-demand deep audits (per-audit pricing)",
      "Tracked over time — see your score improve",
      "Competitor benchmarking",
      "PDF export to share with stakeholders",
    ],
    cta: { label: "Get notified →", to: "/saas#waitlist-website-audit-pro" },
    waitlistSource: "saas-website-audit-pro-waitlist",
  },
];

export default function Saas() {
  const [waitlistOpen, setWaitlistOpen] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "SaaS Products — TrainYourAgent";
    const m = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (m) m.setAttribute("content", "Three productized SaaS offerings from TrainYourAgent. Self-Serve Agent Builder is live at $99/mo. Vertical Playbook Library and AI Website Audit Pro coming soon — join the waitlist.");
    // Open the matching waitlist if hash present
    const h = window.location.hash || "";
    if (h.startsWith("#waitlist-")) {
      setWaitlistOpen(h.replace("#waitlist-", ""));
    }
  }, []);

  async function submitWaitlist(e: FormEvent, source: string) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setErr("Real email please."); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
          path: "/saas",
        }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (j?.ok) {
        setDone(source);
        setEmail("");
        void fireEvent("lead_submit", { source }, "saas-waitlist");
      } else {
        setErr("Submission failed. Try email: alexander@trainyouragent.com");
      }
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <SiteNav />

      <section className="relative pt-28 sm:pt-36 pb-12 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
        </div>
        <div className="max-w-5xl mx-auto">
          <RevealUp y={18}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Self-serve tier · part of the Everything-AI platform
            </div>
          </RevealUp>
          <RevealUp y={22} duration={0.7}>
            <h1 className="text-[30px] sm:text-[48px] md:text-[60px] lg:text-[70px] leading-[1.08] sm:leading-[1.04] lg:leading-[1.02] tracking-tight font-semibold text-[#042C53] h1-balance break-words">
              Self-serve the same agents we build for enterprise.{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Or have us build them for you.</span>
            </h1>
          </RevealUp>
          <RevealUp y={16} delay={0.05}>
            <p className="mt-6 text-[17px] sm:text-[19px] text-slate-700 max-w-3xl leading-relaxed">
              Three productized tiers built on the platform behind every TrainYourAgent build. Start at $49/mo, or skip ahead to a custom deploy with the operator.
            </p>
          </RevealUp>
          {/* v72: band above product grid — keep the premium custom-build path visible */}
          <RevealUp y={12} delay={0.1}>
            <div className="mt-7 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-[13.5px] text-slate-700">
              <span className="text-slate-500">Prefer we build it?</span>
              <Link to="/pricing" className="font-semibold text-[#042C53] hover:text-[#185FA5] inline-flex items-center gap-1">See custom builds →</Link>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-5" delay={0.06}>
            {PRODUCTS.map((p) => (
              <HoverLift key={p.slug}>
                <div
                  id={`waitlist-${p.slug}`}
                  className={`flex flex-col h-full p-6 sm:p-7 rounded-2xl border-2 transition-shadow ${
                    p.status === "live"
                      ? "bg-white border-[#042C53] shadow-lg shadow-[#042C53]/10"
                      : "bg-white border-slate-200 hover:border-[#042C53]/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {p.status === "live" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22A36C]/10 text-[#22A36C] text-[10.5px] font-bold uppercase tracking-[0.12em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Live today
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10.5px] font-bold uppercase tracking-[0.12em]">
                        In development · Get notified
                      </span>
                    )}
                  </div>
                  <div className="text-[20px] sm:text-[22px] font-semibold text-[#042C53] leading-tight">{p.name}</div>
                  <div className="mt-2 text-[14px] text-slate-600 leading-snug">{p.tagline}</div>
                  <div className="mt-5 text-[28px] sm:text-[32px] font-semibold text-[#185FA5]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {p.price}
                  </div>
                  <ul className="mt-5 space-y-2.5 flex-1">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13.5px] text-slate-700 leading-snug">
                        <span className="flex-shrink-0 text-[#042C53] mt-0.5">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {p.status === "live" ? (
                      <Link
                        to={p.cta.to}
                        className="block text-center px-5 py-3 rounded-xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] transition"
                      >
                        {p.cta.label}
                      </Link>
                    ) : done === p.waitlistSource ? (
                      <div className="text-center px-5 py-3 rounded-xl bg-[#E6F1FB] text-[#042C53] font-semibold text-[14px]">
                        You're on the list. Watch your inbox.
                      </div>
                    ) : waitlistOpen === p.slug ? (
                      <form onSubmit={(e) => submitWaitlist(e, p.waitlistSource!)} className="space-y-2">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          maxLength={254}
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-[14px] focus:border-[#042C53] focus:ring-2 focus:ring-[#042C53]/20 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full px-5 py-2.5 rounded-lg bg-[#042C53] text-white font-semibold text-[13px] hover:bg-[#0A3D6E] disabled:opacity-60"
                        >
                          {submitting ? "Saving…" : "Join waitlist"}
                        </button>
                        {err && waitlistOpen === p.slug && <div className="text-[12px] text-red-700">{err}</div>}
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setWaitlistOpen(p.slug)}
                        className="block w-full text-center px-5 py-3 rounded-xl bg-white border-2 border-[#042C53] text-[#042C53] font-semibold text-[14px] hover:bg-[#E6F1FB] transition"
                      >
                        {p.cta.label}
                      </button>
                    )}
                  </div>
                </div>
              </HoverLift>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* v72: band below product grid — keeps the /hire path discoverable */}
      <section className="px-5 sm:px-8 pb-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F6FAFE] border border-[#DCEBFA] text-[13.5px] text-slate-700">
            <span className="text-slate-500">Want the operator to architect it?</span>
            <Link to="/hire" className="font-semibold text-[#042C53] hover:text-[#185FA5] inline-flex items-center gap-1">Hire him direct →</Link>
          </div>
        </div>
      </section>

      {/* WHY SaaS callout */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 bg-[#F6FAFE]">
        <div className="max-w-3xl mx-auto text-center">
          <RevealUp y={16}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">Why SaaS, not just services</div>
            <h2 className="text-[26px] sm:text-[36px] tracking-tight font-semibold text-[#042C53] leading-tight">
              You shouldn't need a 30-day engagement{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>to ship an agent.</span>
            </h2>
            <p className="mt-5 text-[16px] text-slate-700">
              The custom-build engagement is for serious operators with specific problems. These SaaS tiers are for everyone else — the founder who needs an agent on their site this week, the agency reseller, the in-house team that wants to iterate themselves.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <HoverLift>
                <Link to="/saas/agent-builder" className="px-6 py-3.5 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] inline-flex items-center gap-2">
                  Start with Agent Builder · free trial →
                </Link>
              </HoverLift>
              <HoverLift>
                <Link to="/hire" className="px-6 py-3.5 rounded-2xl bg-white border-2 border-[#042C53] text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB] inline-flex items-center gap-2">
                  Or hire the operator →
                </Link>
              </HoverLift>
            </div>
          </RevealUp>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
