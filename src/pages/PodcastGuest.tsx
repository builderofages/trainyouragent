// src/pages/PodcastGuest.tsx — v47A
// Book Alexander as a podcast guest. Topic angles + booking form.

import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, personLd, breadcrumbLd } from "@/lib/jsonld";

const EMAIL = "podcast@trainyouragent.com";

const ANGLES = [
  {
    h: "Voice agents in production — the failure modes nobody talks about",
    hook: "Most voice-agent demos work. Most voice-agent deployments don't. Why?",
    qs: [
      "What's the difference between a demo that closes a deal and a production agent that survives a Monday morning?",
      "Walk me through the first thirty seconds of a real customer call your agent answered last week.",
      "Where do voice agents reliably fail — and how do you design escalation paths customers actually trust?",
    ],
  },
  {
    h: "From welder to AI founder",
    hook: "A founder origin story that doesn't start at Stanford.",
    qs: [
      "What did welding teach you that helps you sell AI today?",
      "Was there a moment you knew you were done with the trades?",
      "What's the hardest thing about going from operator to founder?",
    ],
  },
  {
    h: "The AI agency economic model nobody is writing about",
    hook: "Service businesses are eating early AI software. Here's the math.",
    qs: [
      "Why are AI services beating AI SaaS into the SMB segment?",
      "How do you price an agent build? What's the unit economics?",
      "Will agency margins survive when the platforms commoditize the model layer?",
    ],
  },
  {
    h: "Building in public — 90 days, 35+ pages, one founder",
    hook: "A live case study of AI-augmented dev velocity.",
    qs: [
      "What does shipping with Claude as a coding partner actually look like day-to-day?",
      "What did you have to give up to ship this fast?",
      "What's the next thing AI tooling needs to make a one-person company a hundred-person company?",
    ],
  },
  {
    h: "The honest case against AI hype",
    hook: "An AI founder argues most AI isn't working — and explains where it is.",
    qs: [
      "What categories of AI investment are you certain will return less than promised?",
      "Where is AI quietly already paying back ten-to-one?",
      "What advice do you give SMB owners drowning in AI vendor pitches?",
    ],
  },
  {
    h: "Tampa Bay's quiet AI scene",
    hook: "Why Florida might quietly be the third coast of AI.",
    qs: [
      "Who's actually shipping AI products in Tampa right now?",
      "What does the talent stack look like outside Silicon Valley and New York?",
      "What infrastructure is missing for Tampa to become a real AI hub?",
    ],
  },
  {
    h: "Why every business becomes an AI business — and what that means for owners",
    hook: "The 'AI transformation' framing is wrong. Here's the right one.",
    qs: [
      "What's the bad version of 'every business is an AI business' and what's the right version?",
      "What's the first AI surface area a service business should change?",
      "Which industries get reorganized hardest in the next 5 years?",
    ],
  },
  {
    h: "Customer acquisition for AI service companies",
    hook: "How do you sell something the market doesn't fully understand yet?",
    qs: [
      "What's working for outbound right now in the AI services space?",
      "How do you talk price to a buyer who's never bought AI before?",
      "What's the one play you wish more AI agency founders would steal?",
    ],
  },
];

function Form() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("host") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("show") || ""),
      source: "podcast-guest-request",
      payload: {
        show: String(fd.get("show") || ""),
        host: String(fd.get("host") || ""),
        audience: String(fd.get("audience") || ""),
        dates: String(fd.get("dates") || ""),
        url: String(fd.get("url") || ""),
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
      <input name="show" required placeholder="Show name"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="host" required placeholder="Your name (host)"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="audience" placeholder="Audience size or downloads/episode"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="dates" required placeholder="Recording dates you're considering"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="url" placeholder="Show URL (optional)"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <textarea name="notes" rows={4} placeholder="Format, length, what excites you about this episode"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"}
          className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Send podcast invite"}
        </button>
        {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Got it — reply within 24h.</span>}
        {state === "error" && <span className="text-[13px] text-rose-600">Couldn't send ({err}). Email {EMAIL}.</span>}
        <span className="text-[12px] text-slate-500">Reply within 24h. Alexander reads every invite.</span>
      </div>
    </form>
  );
}

export default function PodcastGuest() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Book Alexander as a podcast guest · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Book Alexander as a podcast guest")}&subtitle=${encodeURIComponent("Building an AI company in public — 336 commits, 564 live URLs")}&type=trust&badge=PODCAST`;
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
      { id: "podcast-person", data: personLd() },
      { id: "podcast-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Podcast guest", url: "/podcast-guest" },
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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Podcast guest · Alexander Mills</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            A guest who shows up <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>prepared.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Alexander Mills — founder of TrainYourAgent, former welder, former agency operator. Hot mic on AI for SMBs, voice agents, building in public, and the path from blue-collar to AI founder. Eight pre-written episode angles below, each with a hook and three host-ready questions. Steal them, riff on them, or pitch your own.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ANGLES */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Episode angles</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Eight episodes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Pre-built.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {ANGLES.map((a) => (
              <article key={a.h} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-[18px] font-semibold text-[#042C53] leading-snug">{a.h}</h3>
                <p className="mt-2 text-[13px] italic text-slate-600">{a.hook}</p>
                <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Host questions</div>
                <ul className="mt-2 space-y-2 text-[13.5px] text-slate-700">
                  {a.qs.map((q) => (
                    <li key={q} className="flex items-start gap-2.5">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#185FA5] flex-shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* PAST APPEARANCES */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Past appearances</div>
          <p className="text-[18px] sm:text-[22px] text-[#042C53] max-w-2xl mx-auto leading-snug">
            We're early — would love to be your guest.
          </p>
          <p className="mt-3 text-[14px] text-slate-600">
            Pitches: <a href={`mailto:${EMAIL}`} className="underline text-[#185FA5]">{EMAIL}</a>
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* FORM */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Invite Alexander on your show</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Send the invite.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: Alexander reads every invite personally. You'll get a reply within 24 hours confirming or scheduling — and a follow-up email with bio, headshot, and recording tech.
          </p>
          <Form />
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
