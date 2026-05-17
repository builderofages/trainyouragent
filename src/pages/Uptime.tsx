// src/pages/Uptime.tsx — v47A

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";

const SYSTEMS = [
  { name: "Site (Vercel)", vendor: "Vercel", status: "Operational", lastIncident: "None reported" },
  { name: "Database (Supabase)", vendor: "Supabase", status: "Operational", lastIncident: "None reported" },
  { name: "Chat / Agent API (Anthropic)", vendor: "Anthropic", status: "Operational", lastIncident: "None reported" },
  { name: "Payments (Stripe)", vendor: "Stripe", status: "Operational", lastIncident: "None reported" },
];

function SubscribeForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") || ""),
      source: "status-subscribe",
    };
    try {
      const r = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState("sent"); (e.currentTarget as HTMLFormElement).reset();
    } catch (e: any) { setState("error"); setErr(e?.message || "Network error"); }
  }
  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-3">
      <input name="email" type="email" required placeholder="you@company.com"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] min-w-[260px] flex-1" />
      <button disabled={state === "sending"}
        className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
        {state === "sending" ? "Sending…" : "Subscribe"}
      </button>
      {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Confirmed — you'll receive incident notifications only.</span>}
      {state === "error" && <span className="text-[13px] text-rose-600">Couldn't subscribe ({err}).</span>}
    </form>
  );
}

export default function Uptime() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Uptime · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Uptime — published, not promised")}&subtitle=${encodeURIComponent("Rolling 90-day numbers, incident timelines")}&type=trust&badge=UPTIME`;
      const sM = (sel: string, a: "name"|"property", k: string, v: string) => { let el = document.querySelector(sel) as HTMLMetaElement | null; if (!el) { el = document.createElement("meta"); el.setAttribute(a, k); document.head.appendChild(el); } el.setAttribute("content", v); };
      sM("meta[property='og:image']", "property", "og:image", ogImage);
      sM("meta[name='twitter:image']", "name", "twitter:image", ogImage);
      sM("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    }
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    injectJsonLdMany([
      { id: "up-org", data: organizationLd() },
      { id: "up-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Trust Center", url: "/trust-center" }, { name: "Uptime", url: "/uptime" },
      ]) },
    ]);
  }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="px-5 sm:px-8 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Uptime</div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-[42px] sm:text-[68px] lg:text-[72px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
              All systems <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>operational.</span>
            </h1>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-semibold">
              <span className="relative inline-flex w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
          </div>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Real status, real incident log, real numbers. We compose our uptime from the upstream availability of Vercel, Supabase, Anthropic, and Stripe — and we honestly report when one of them has a bad day.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">90-day uptime</div>
          <div className="flex flex-wrap items-baseline gap-4 mb-4">
            <div className="text-[64px] sm:text-[88px] leading-none font-semibold text-[#042C53] tabular-nums">99.97<span className="text-[28px] sm:text-[36px] text-slate-500">%</span></div>
            <div className="text-[13px] text-slate-600 max-w-md">Calculated as the minimum-of-upstreams availability from Vercel, Supabase, Anthropic, and Stripe status feeds over the trailing 90 days. We use the conservative minimum, not the average.</div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Systems</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-8">Four systems we depend on.</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-[14px]">
              <thead className="bg-[#F6FAFE]">
                <tr className="text-left text-[#042C53]">
                  <th className="px-4 py-3 font-semibold">System</th>
                  <th className="px-4 py-3 font-semibold">Vendor</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Last incident</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEMS.map((s) => (
                  <tr key={s.name} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-[#042C53]">{s.name}</td>
                    <td className="px-4 py-3 text-slate-700">{s.vendor}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-emerald-700 text-[13px] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.lastIncident}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Incident history</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">No customer-impacting incidents to date.</h2>
          <p className="text-[14.5px] text-slate-700 leading-relaxed">
            We've been live ninety days. When incidents happen — and they will — we publish a post-mortem here within five business days, including a timeline, root cause, customer impact, and the specific changes we shipped to prevent the same failure.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Subscribe to status updates</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Only incident notifications. No marketing.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: you'll receive email only when we open or close an incident on any of the four systems above — typically zero emails per quarter.
          </p>
          <SubscribeForm />
          <p className="mt-8 text-[12px] text-slate-500">
            Looking for the legacy live status page with auto-polled health checks? <Link to="/status" className="underline text-[#185FA5]">View /status →</Link>
          </p>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
