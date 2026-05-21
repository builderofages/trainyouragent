// src/pages/MediaKit.tsx — v47A

import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";

function PrismNode({ size = 64, stroke = "#042C53", dot = "#042C53", bg = "transparent" }: { size?: number; stroke?: string; dot?: string; bg?: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-2xl"
      style={{ width: size + 24, height: size + 24, background: bg, color: stroke }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: size, height: size }}>
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill={dot} stroke="none" />
      </svg>
    </span>
  );
}

const VARIANTS = [
  { name: "Navy on white", bg: "#FFFFFF", stroke: "#042C53", dot: "#042C53" },
  { name: "Navy on tint", bg: "#E6F1FB", stroke: "#042C53", dot: "#042C53" },
  { name: "White on navy", bg: "#042C53", stroke: "#FFFFFF", dot: "#FFFFFF" },
  { name: "Blue on white", bg: "#FFFFFF", stroke: "#185FA5", dot: "#185FA5" },
  { name: "White on blue", bg: "#185FA5", stroke: "#FFFFFF", dot: "#FFFFFF" },
  { name: "Ink on fog", bg: "#F6FAFE", stroke: "#0B1B2B", dot: "#0B1B2B" },
];

const COLORS = [
  { name: "Prism Navy", hex: "#042C53", text: "#FFFFFF" },
  { name: "Signal Blue", hex: "#185FA5", text: "#FFFFFF" },
  { name: "Sky Tint", hex: "#E6F1FB", text: "#042C53" },
  { name: "Fog", hex: "#F6FAFE", text: "#042C53" },
  { name: "Ink", hex: "#0B1B2B", text: "#FFFFFF" },
  { name: "Confirm", hex: "#22A36C", text: "#FFFFFF" },
];

const BOILERPLATES = [
  { label: "25 words", body: "TrainYourAgent builds production AI agents and infrastructure for small and mid-market businesses. Voice agents, chat agents, full GTM stack. Operator-led, founded 2022, Tampa, FL." },
  { label: "50 words", body: "TrainYourAgent is an operator-led AI services company building production voice agents, chat agents, and full go-to-market infrastructure for small and mid-market businesses. Founded in 2022 by Alexander Mills, the company is headquartered in Tampa, FL and ships AI that closes calls, books appointments, and stays online when the founder is asleep." },
  { label: "100 words", body: "TrainYourAgent is an operator-led AI services company building production-grade voice agents, chat agents, and end-to-end go-to-market infrastructure for small and mid-market businesses. Founded in 2022 in Tampa, FL by Alexander Mills — a former welder and agency operator — the company exists to install the AI layer that mid-market businesses keep being promised and rarely receive. TrainYourAgent ships agents that answer the phone, qualify the lead, book the appointment, and escalate to a human when the situation needs one. Customers span HVAC, healthcare, legal, hospitality, real estate, and home services across the United States." },
  { label: "250 words", body: "TrainYourAgent is an operator-led AI services company founded in 2022 by Alexander Mills. The company designs, builds, and operates production AI agents for small and mid-market businesses — voice agents that answer the phone, qualify the lead, book the appointment, and escalate to a human when the situation calls for it; chat agents that handle support and lead loops on web and SMS; and the underlying go-to-market infrastructure (CRM, telephony, payments, analytics) that makes those agents actually useful in a real business. The thesis is simple: every offline business is about to need an AI layer over its phone, its inbox, and its operations, and the right team to install that layer looks more like a battle-tested operator than a research lab. Alexander brings a non-traditional founder path — welder, market trader, agency operator — that maps unusually well to the customer base, which is mostly skeptical, mostly non-technical, and almost entirely uninterested in AI hype. The company is headquartered in Tampa, FL and serves customers across HVAC, healthcare, legal, hospitality, real estate, automotive, and home services in the United States. TrainYourAgent ships in public on a near-weekly cadence, publishes its own metrics, and runs its own customer-facing voice agent as a live demo of what it sells. For press inquiries email press@trainyouragent.com; for sales hello@trainyouragent.com. The team replies within 24 hours, no PR firm in between." },
];

function CopyChip({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch {}
      }}
      className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-[10px] uppercase tracking-[0.12em] font-semibold transition"
      aria-label={`Copy ${value}`}>
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function MediaKit() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Media Kit · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Media Kit — logos, bios, screenshots")}&subtitle=${encodeURIComponent("Everything press, podcasters & analysts need")}&type=trust&badge=MEDIA`;
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
      { id: "mk-org", data: organizationLd() },
      { id: "mk-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Press", url: "/press" }, { name: "Media Kit", url: "/media-kit" },
      ]) },
    ]);
  }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Media kit</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Logos, colors, type, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>boilerplate.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Everything a writer, editor, or designer needs to render TrainYourAgent correctly in a story, slide, or chyron. If you need a format we haven't published, email <a href="mailto:press@trainyouragent.com" className="underline text-[#185FA5]">press@trainyouragent.com</a>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {/* v78: ZIP packs not yet bundled — replaced 404 download links
                with email-request CTAs so the page never breaks on click. */}
            <a href="mailto:press@trainyouragent.com?subject=Logo+pack+request"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E]">
              Request the logo pack
            </a>
            <a href="mailto:press@trainyouragent.com?subject=Founder+headshots+request"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-semibold text-[14px] hover:border-[#185FA5] hover:text-[#185FA5]">
              Founder headshots
            </a>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* LOGO VARIANTS */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Logo variants</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">The Prism Node — six color treatments.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VARIANTS.map((v) => (
              <div key={v.name} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-40 flex items-center justify-center" style={{ background: v.bg }}>
                  <PrismNode size={88} stroke={v.stroke} dot={v.dot} bg="transparent" />
                </div>
                <div className="bg-white p-4">
                  <div className="text-[13px] font-semibold text-[#042C53]">{v.name}</div>
                  <div className="text-[11px] text-slate-500 mt-1 tabular-nums">stroke {v.stroke} · dot {v.dot}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* COLORS */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Brand colors</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">Hex codes, copy-to-clipboard.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COLORS.map((c) => (
              <div key={c.hex} className="rounded-2xl overflow-hidden border border-slate-200">
                <div className="h-24 flex items-end p-3" style={{ background: c.hex, color: c.text }}>
                  <span className="text-[12px] font-semibold tabular-nums inline-flex items-center">{c.hex}<CopyChip value={c.hex} /></span>
                </div>
                <div className="p-3 bg-white">
                  <div className="text-[13px] font-semibold text-[#042C53]">{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* TYPOGRAPHY */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Typography</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">Type system.</h2>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">UI · Body · Headings</div>
              <div className="text-[40px] leading-tight text-[#042C53] font-semibold" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Inter Tight</div>
              <div className="text-[13px] text-slate-600 mt-3">Weights used: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold). Google Fonts, free license. Loaded via stylesheet.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">Display accents</div>
              <div className="text-[40px] leading-tight text-[#042C53]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Playfair Display</div>
              <div className="text-[13px] text-slate-600 mt-3">Italic only — 500 (Medium Italic) and 600 (Semibold Italic). Used sparingly inside headlines, never for body. Google Fonts, free license.</div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* HEADSHOTS */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-10">
          <div>
            <div className="rounded-3xl overflow-hidden aspect-[4/5] flex items-center justify-center text-white text-center p-6"
              style={{ background: "linear-gradient(135deg, #042C53, #185FA5)" }}>
              <div>
                <PrismNode size={56} stroke="#FFFFFF" dot="#FFFFFF" bg="transparent" />
                <div className="mt-4 text-[14px] font-semibold">Hi-res photos available</div>
                <div className="text-[12px] text-white/70 mt-1 max-w-[220px] mx-auto">Formal, candid, on-stage — three full-resolution shots, RGB and CMYK.</div>
              </div>
            </div>
            {/* v78: ZIP not packaged yet — email request instead. */}
            <a href="mailto:press@trainyouragent.com?subject=Founder+headshots+request"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E]">
              Request headshots
            </a>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Founder</div>
            <h3 className="text-[28px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-3">Alexander Mills — Founder.</h3>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              Tampa, FL. Reachable for press at <a href="mailto:press@trainyouragent.com" className="underline text-[#185FA5]">press@trainyouragent.com</a>. Photo credit on use: "Courtesy of TrainYourAgent." Free for editorial use; commercial use by permission.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* BOILERPLATES */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Boilerplate</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">Four lengths. Use what fits.</h2>
          <div className="space-y-5">
            {BOILERPLATES.map((b) => (
              <div key={b.label} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">{b.label}</div>
                <p className="text-[14.5px] text-slate-700 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
