// src/pages/Press.tsx — v47A
// Full press + media kit page: hero, downloads, story angles, interview form.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";

const PRESS_EMAIL = "press@trainyouragent.com";

function BrainLogo({ size = 28, color = "#042C53" }: { size?: number; color?: string }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: size, height: size }}>
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const DOWNLOADS = [
  { title: "Logo pack", desc: "Prism Node SVG · Navy, white, mono, full wordmark.",
    href: "/press/logos.zip", size: "0.4 MB · ZIP" },
  { title: "Founder headshots", desc: "Hi-res photos of Alexander Mills — formal, candid, on-stage.",
    href: "/press/founder-headshots.zip", size: "12.6 MB · ZIP" },
  { title: "Brand guidelines", desc: "Colors, type system, voice, do's and don'ts (1-page PDF).",
    href: "/press/brand-guidelines.pdf", size: "0.6 MB · PDF" },
  { title: "Boilerplate one-pager", desc: "25, 50, 100, and 250-word company descriptions.",
    href: "/press/boilerplate.pdf", size: "0.3 MB · PDF" },
];

const ANGLES = [
  {
    h: "The trillion-dollar opportunity in SMB AI",
    p: "Enterprise gets the headlines, but the 33 million small and mid-sized businesses in the US are where AI will actually compound — and where almost no vendor is meeting them on their terms. Alexander has spent two years selling AI into HVAC, dental, legal, roofing, and hospitality shops. He can walk through the real economics: what they'll pay, what breaks, what makes them stick, and why the next Salesforce-scale company won't come from a research lab.",
  },
  {
    h: "From welding to AI: an unconventional founder path",
    p: "Most AI founders are PhDs from Stanford or ex-Google. Alexander welded steel, ran a market stand, and operated a social-media agency before AI ate the world. The arc from blue-collar trades to building voice agents for blue-collar businesses is the rare authentic operator story in a category dominated by academics. There's a real argument here about who actually ships AI that works in real businesses — and it's not who you think.",
  },
  {
    h: "Why voice agents are the breakout AI use case of 2026",
    p: "Text-based chatbots got the spotlight in 2023–24. The quiet shift in 2026 is voice — phone agents that pick up, qualify leads, book appointments, and never call out sick. The infrastructure (sub-second latency, naturalistic turn-taking, full-stack telephony) finally works. Alexander can show live demos, share real customer transcripts (with permission), and explain why this is the first AI category SMBs will pay $500–$3,000/mo for without flinching.",
  },
  {
    h: "Building in public: shipping a website with 35+ pages in 90 days",
    p: "TrainYourAgent's site is itself a story — every commit is public, every page is shipped openly, and the velocity (45+ versions in three months) is rare in any category. There's an angle for tech and startup outlets about what AI-augmented dev looks like in practice, the role of Claude as a coding collaborator, and what a one-founder company can ship when the leverage is real.",
  },
  {
    h: "The Tampa Bay AI scene nobody is covering",
    p: "Miami gets the crypto coverage. Austin gets the venture coverage. But Tampa Bay is quietly assembling a layer of AI operators, fintech founders, and biotech researchers that nobody outside Florida is writing about. Alexander runs a Tampa AI meetup, knows the operators by name, and can point a reporter at five or six other companies worth covering before he ever talks about his own.",
  },
  {
    h: "The honest case against AI hype — what actually works for SMBs",
    p: "Contrarian angle for outlets that are tired of breathless AI coverage. Alexander will say on the record what most founders won't: most generative AI doesn't yet drive SMB revenue, voice agents fail more often than anyone admits, and the 'AI transformation' pitch is mostly slideware. He'll also explain the narrow set of use cases that genuinely return $10 for every $1 spent — and why those are boring.",
  },
];

function InterviewForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("outlet") || ""),
      source: "press-inquiry",
      payload: {
        outlet: String(fd.get("outlet") || ""),
        deadline: String(fd.get("deadline") || ""),
        topic: String(fd.get("topic") || ""),
      },
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
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
      <input name="name" required placeholder="Your name"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="outlet" required placeholder="Outlet / publication"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="deadline" placeholder="Deadline (e.g. Friday 5pm ET)"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <textarea name="topic" required rows={4} placeholder="What's the story?"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"}
          className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Request interview"}
        </button>
        {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Got it — Alexander will reply within 24h.</span>}
        {state === "error" && <span className="text-[13px] text-rose-600">Couldn't send ({err}). Email {PRESS_EMAIL} directly.</span>}
        <span className="text-[12px] text-slate-500">Usually under 24 hours. No PR firm — you'll hear from the founder.</span>
      </div>
    </form>
  );
}

export default function Press() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Press · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Press — quotes, coverage, contact")}&subtitle=${encodeURIComponent("Alexander Mills, available for comment")}&type=trust&badge=PRESS`;
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
      { id: "press-org", data: organizationLd() },
      { id: "press-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Press", url: "/press" },
      ]) },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Press · TrainYourAgent</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            For interviews, quotes, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>and bylines.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Alexander Mills and the team are available for interviews, quotes, and bylines about AI for SMBs, the future of voice agents, building in public, and the path from welder to AI founder. Email <a href={`mailto:${PRESS_EMAIL}`} className="underline text-[#185FA5]">{PRESS_EMAIL}</a> — replies within 24 hours.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* PRESS KIT DOWNLOADS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Press kit · quick grab</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-8">
            Everything you need, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>one click each.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOWNLOADS.map((d) => (
              <a key={d.title} href={d.href} download
                className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5] transition group">
                <div className="text-[14px] font-semibold text-[#042C53] group-hover:text-[#185FA5]">{d.title}</div>
                <div className="text-[12px] text-slate-600 mt-1.5 leading-snug">{d.desc}</div>
                <div className="mt-3 text-[11px] text-slate-500 uppercase tracking-[0.12em] font-semibold">{d.size}</div>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-slate-500 max-w-3xl">
            Need a format we don't have here? Email <a href={`mailto:${PRESS_EMAIL}`} className="underline">{PRESS_EMAIL}</a> and we'll send it within the day.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* STORY ANGLES */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Story angles</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Six stories worth telling. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Pre-pitched, pre-sourced.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {ANGLES.map((a) => (
              <article key={a.h} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-[18px] font-semibold text-[#042C53] leading-snug">{a.h}</h3>
                <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">{a.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* RECENT MENTIONS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Recent mentions</div>
          <p className="text-[18px] sm:text-[22px] text-[#042C53] max-w-2xl mx-auto leading-snug">
            We're early — be the first to cover us.
          </p>
          <p className="mt-3 text-[14px] text-slate-600">
            Pitches: <a href={`mailto:${PRESS_EMAIL}`} className="underline text-[#185FA5]">{PRESS_EMAIL}</a>
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* INTERVIEW FORM */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Request an interview</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Tell us about the story.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: Alexander reads every press inquiry personally. You'll get a reply within 24 hours — confirming the slot, suggesting a time, or politely declining if the fit isn't right.
          </p>
          <InterviewForm />
        </div>
      </section>

      <SectionDivider />

      {/* CROSS-LINKS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
          <Link to="/speaking" className="block rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] transition">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Speaking</div>
            <h3 className="text-[20px] font-semibold text-[#042C53]">Book Alexander to speak →</h3>
            <p className="mt-2 text-[14px] text-slate-700">Keynotes, panels, workshops on AI for real businesses.</p>
          </Link>
          <Link to="/podcast-guest" className="block rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] transition">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Podcast guest</div>
            <h3 className="text-[20px] font-semibold text-[#042C53]">Book Alexander as a podcast guest →</h3>
            <p className="mt-2 text-[14px] text-slate-700">Eight pre-written topic angles with host questions ready to go.</p>
          </Link>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
