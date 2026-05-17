// src/pages/Speaking.tsx — v47A
// Book Alexander to speak — topics, audiences, formats, booking form.

import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, personLd, breadcrumbLd } from "@/lib/jsonld";

const SPEAKING_EMAIL = "speaking@trainyouragent.com";

const TOPICS = [
  {
    h: "Voice agents for SMBs: what works, what fails",
    p: "A grounded look at the actual production reality of voice agents in 2026 — latency budgets, intent collapse, escalation design, and the specific failure modes that vendors don't put on their landing pages. Includes live demos and real call recordings from production agents.",
    fit: "AI conferences · Operator meetups · Vendor user groups",
  },
  {
    h: "Building an AI agency from $0 to $20K MRR in 12 months",
    p: "An honest playbook on what it actually takes to bootstrap an AI services company — pricing, packaging, sales motion, the deals to walk away from, and the operational debt nobody warns you about. No survivorship-bias hero arc, no growth-hack tricks.",
    fit: "Founder communities · YC alumni events · SaaStr-style stages",
  },
  {
    h: "The Everything-AI thesis: why every business becomes an AI business",
    p: "The 30-year arc from spreadsheets to internet to mobile to AI — and why the mid-market businesses that punted on the first three waves don't get to punt on this one. Why the platform shift is bigger than mobile, and what it implies for capital allocation, hiring, and operating model design.",
    fit: "VC partner offsites · Board retreats · Executive briefings",
  },
  {
    h: "From welder to AI founder: blue-collar to white-collar transition stories",
    p: "A personal narrative about leaving the trades to build a tech company — what skills transferred, what didn't, what it's like to negotiate a $50K AI contract using the same instincts you'd use to bid on a steel job. Aimed at audiences that are tired of the Stanford-dropout pitch.",
    fit: "University lectures · Trade-school commencements · Career-pivot communities",
  },
  {
    h: "Honest AI: separating signal from hype for non-technical buyers",
    p: "A buyer-side talk for non-technical executives, owners, and procurement teams — how to evaluate AI vendors, what claims to ignore, what numbers actually matter, what 'AI' means once you peel the marketing off. Includes a printable evaluation rubric and live red-team of three vendor pitches.",
    fit: "Chamber of commerce · SMB associations · Procurement summits",
  },
];

const AUDIENCES = [
  "VC partner offsites and LP days",
  "SMB associations and chambers of commerce",
  "AI conferences (technical and operator-focused tracks)",
  "Podcasts and audio-first shows",
  "University lectures and executive education",
  "Vendor user groups and customer summits",
];

const FORMATS = [
  { label: "20-minute keynote", note: "Tight thesis talk. Best for conference plenary slots." },
  { label: "45-minute talk + Q&A", note: "Deeper material with live demos. Half-hour talk, fifteen minutes of Q&A." },
  { label: "Half-day workshop", note: "Hands-on session — typically capped at 30 participants, includes worksheets and live builds." },
  { label: "Fireside chat", note: "Moderated, off-script. Best when the host has strong opinions and wants to push back." },
  { label: "Panel", note: "One of multiple voices, ideally with a sharp moderator and at least one disagreement." },
];

function BookingForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("event") || ""),
      source: "speaking-request",
      payload: {
        event: String(fd.get("event") || ""),
        date: String(fd.get("date") || ""),
        audience: String(fd.get("audience") || ""),
        format: String(fd.get("format") || ""),
        budget: String(fd.get("budget") || ""),
        notes: String(fd.get("notes") || ""),
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
      <input name="event" required placeholder="Event name"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="date" required placeholder="Date or month"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="audience" placeholder="Audience size (e.g. 200, 1500)"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <select name="format" required defaultValue=""
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="" disabled>Format</option>
        <option>20-minute keynote</option>
        <option>45-minute talk + Q&A</option>
        <option>Half-day workshop</option>
        <option>Fireside chat</option>
        <option>Panel</option>
      </select>
      <select name="budget" defaultValue=""
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="">Budget range (optional)</option>
        <option>Under $2,500 (community/non-profit)</option>
        <option>$2,500–$5,000</option>
        <option>$5,000–$10,000</option>
        <option>$10,000+</option>
      </select>
      <textarea name="notes" rows={4} placeholder="Anything else we should know?"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"}
          className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Request a speaking slot"}
        </button>
        {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Got it — Alexander will reply within 2 business days.</span>}
        {state === "error" && <span className="text-[13px] text-rose-600">Couldn't send ({err}). Email {SPEAKING_EMAIL} directly.</span>}
        <span className="text-[12px] text-slate-500">Reply within 2 business days. We say yes more than people expect.</span>
      </div>
    </form>
  );
}

export default function Speaking() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Book Alexander · Speaking · TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    injectJsonLdMany([
      { id: "speaking-person", data: personLd() },
      { id: "speaking-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Speaking", url: "/speaking" },
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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Book Alexander</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Speaking, panels, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>and workshops</span> on AI for real businesses.
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Alexander Mills is a founder, operator, and former tradesman who has spent the last two years putting AI agents into production for small and mid-market businesses. He speaks honestly about what works, what doesn't, and what's coming — without the hype or the academic detachment.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* TOPICS */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Topics</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Five talks ready to ship. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>All tailorable.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {TOPICS.map((t) => (
              <article key={t.h} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-[18px] font-semibold text-[#042C53] leading-snug">{t.h}</h3>
                <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">{t.p}</p>
                <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Best fit</div>
                <div className="text-[13px] text-[#042C53] mt-0.5">{t.fit}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* AUDIENCE + FORMAT */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Audience fit</div>
            <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-6">Where Alexander lands well.</h3>
            <ul className="space-y-2.5">
              {AUDIENCES.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#185FA5] flex-shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Format options</div>
            <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-6">Pick the shape that fits.</h3>
            <ul className="space-y-3">
              {FORMATS.map((f) => (
                <li key={f.label} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="text-[14px] font-semibold text-[#042C53]">{f.label}</div>
                  <div className="text-[12.5px] text-slate-600 leading-snug mt-1">{f.note}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* BOOKING FORM */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Request a speaking slot</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Tell us about the event.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: Alexander reviews every request personally. You'll get a reply within 2 business days with availability, a proposed talk outline, and a clear fee (or a confirmation it's a fit for our community-rate slate).
          </p>
          <BookingForm />
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
