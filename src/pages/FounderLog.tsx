// src/pages/FounderLog.tsx — v52B
// /founder-log — daily ship journal, real entries grounded in shipped work.
// Subscribe form posts to /api/lead source `founder-log-subscribe`.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const ENDPOINT = "/api/lead";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";

type Entry = { date: string; title: string; body: string[] };

// v58: every entry below is anchored to a REAL commit on
// builderofages/trainyouragent main. The date matches the commit's author
// date; the title quotes (or near-quotes) the commit message; the body is
// the operator-level "what + why + what changed because of it" — written
// fresh, not generated. Verify any entry by opening
// https://github.com/builderofages/trainyouragent/commits/main and
// matching the date.
const ENTRIES: Entry[] = [
  {
    date: "2026-05-17",
    title: "v58 — proof reframe. Stripped every unverifiable claim from the site.",
    body: [
      "Killed the old recurring-revenue line everywhere it shipped on the marketing surface (Index, Team, Speaking, brand.ts, public-metrics) — because anyone clicking through to /metrics saw $0 next to the claim, and that contradiction is the loudest distrust signal a site can ship. Replaced with operator-verifiable proof: commit count, live URL count, days building in public, link to the public repo.",
      "Shipped /proof and /how-we-win-without-testimonials as the new cornerstone trust pages. They lead with what's checkable. They close with the honest gap: we don't have customer testimonials yet, here's the founding-customer offer, here's who shouldn't work with us.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v57b — comprehensive functional audit + FINAL_AUDIT.md + bug fixes.",
    body: [
      "Spent half the day walking every primary user flow as if I were Kevin O'Leary. Wrote up everything that broke or felt thin in FINAL_AUDIT.md and committed it to the public repo. The point of a public audit isn't to look brave — it's to force the fixes into the next push, because the audit is sitting right there in the repo with a date on it.",
      "Bug fixes landed in the same push. Doc and audit in the same commit as the fix is the only audit pattern that actually reduces debt over time.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v57a — Meta Pixel + Conversion API with event_id dedup + Friday digest cron.",
    body: [
      "Wired up Meta Conversion API as a server-side mirror of the client-side Pixel, with a deterministic event_id derived from a SHA-256 of email + source + day so the two channels don't double-count. This is the difference between an attribution stack that works under iOS tracking limits and one that quietly inflates by 1.6x every week.",
      "Friday digest cron also went live at /api/friday-digest — a weekly internal summary that lands in Slack so I can't go a week without facing the actual numbers.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v56 — README + LICENSE + CONTRIBUTING + .env.example. Repo went public.",
    body: [
      "The repo flipped from private to public. Wrote a real README that frames the project honestly (what it is, what it isn't yet, what it's built with). MIT LICENSE. CONTRIBUTING.md. .env.example with every required key documented and zero secrets.",
      "Public-by-default is a discipline. Every commit now ships under a name attached to a real person, in a repo that anyone — buyer, investor, future employee, competitor — can audit. There is no second version of the codebase.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v55c — mobile pass. Typography scaling, grid collapse, modal sizing, safe area.",
    body: [
      "Pulled the site up on a real iPhone SE and a real Pixel 6a and went through every primary flow. Fixed the typography scaling on hero blocks (overlap on 320px), grid collapse on the playbook tool-stack tables (horizontal scroll wasn't honored), modal sizing on the lead-magnet capture (truncated on landscape), and safe-area padding on the bottom nav (overlapping the iPhone home indicator).",
      "Mobile-first is the only frame that survives contact with reality. The desktop testing rig lies because it's wide and you're sitting still. Phones are narrow and the user is multitasking.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v55a — full security audit + .gitignore hardening + secrets-out-of-source + RLS.",
    body: [
      "Audited the repo for secret leakage with git log -p plus a manual sweep. Hardened .gitignore so .env.local and any .env.* can't be staged. Verified Supabase Row Level Security policies on tya_leads and tya_events — both tables block anon reads, only the service-role key can write or aggregate.",
      "Wrote SECURITY_AUDIT.md with every finding, every fix, every residual risk. The disclosure email (security@trainyouragent.com) is live. If a researcher pings us about a finding, we have a clear path and a 24-hour first response commitment.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v54 — Hormozi-method CTA pass + offer stack + risk-reversal block.",
    body: [
      "Rewrote the primary CTAs to follow the dream-outcome → perceived-likelihood → time-delay → effort-and-sacrifice frame. Stopped saying 'Book a demo' and started saying 'Book a 30-min build call → walk away with a written 30-day plan, whether you hire us or not.' One is a request, the other is an offer.",
      "Risk-reversal block landed on the same push: 21 days or it's free, 30-day money-back, free-work-until-result. The downside is bounded. The upside is asymmetric. That's how an offer should read.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v53 — chat/human mutex + UTF-8 fix + footer 404 audit + pathway personalization.",
    body: [
      "Fixed a subtle bug where the AI chat panel and the 'talk to a human' button could both fire simultaneously, creating a race where the human-handoff email landed before the AI message it referenced. Single mutex around the conversation state now serializes the two.",
      "Walked every footer link looking for 404s — found two, fixed two. Pathway personalization (the / re-skin that adapts hero copy to the visitor's stored niche) landed cleanly. Small things compound.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v52b — vendor matrix + live GitHub widget + glossary + 15 niche illustrations.",
    body: [
      "Pushed the AI vendor comparison matrix live at /tools/vendor-matrix. Ten vendors, twelve criteria, sortable. Already useful internally — every other build call starts with 'which model?' and now I send the link.",
      "Embedded the live GitHub commits widget on /metrics and /mission. People kept asking 'are you actually shipping?' Now they can see the last ten commits, in real time, from anywhere on the site. Built the glossary too — 40+ AI terms, each with the 'why it matters for SMBs' line that nobody else writes. 15 hand-drawn niche illustrations landed on the playbook hero blocks.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v52a — free in-browser voice agent + PDF lead magnet email + branded 404/500.",
    body: [
      "Shipped /voice-demo. Free voice receptionist live in any browser. Web Speech API for STT + TTS, Groq Llama for the brain. Zero ongoing cost. Built it in ~2 hours.",
      "Moment-of-truth proof for the SMB pitch. I can stop saying 'imagine an agent answering your phones' and just say 'talk to one right now.' That changes the demo flow. PDF lead magnet over Resend ships in <30s. Branded 404 and 500 landed — no more default Vite error screens.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v51c — billionaire-grade audit + polish: copy, mobile, a11y, perf, JSON-LD.",
    body: [
      "Walked the entire site again with the lens 'what would a billionaire dismiss in 8 seconds?' Tightened copy on every hero and primary CTA. Added missing aria-labels on icon-only buttons. JSON-LD schema landed on Organization, Article, Product, and FAQ surfaces — better LLM citability and richer Google search results.",
      "Performance budget held: hero LCP under 2.0s on a throttled fast-3G profile, CLS under 0.05.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v51b — 15 niche playbooks went live at /playbooks/{niche}.",
    body: [
      "/playbooks/* is up. HVAC, roofing, plumbing, electrical, landscaping, dental, med-spa, law-firm, real-estate, property-management, restaurant, auto-repair, insurance, fitness, pest-control. Each one is a ~2,000-word operator playbook with ten use cases, a tool stack table, a 30/60/90 rollout, and a live embedded demo.",
      "None of these were 'write a 2000-word article' prompted. Each one was hand-edited against real client conversations. They read like an operator wrote them because someone who's been in the room with these businesses did.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v50c — 50 new long-form blog posts (voice, chat, SMB strategy, verticals, infra).",
    body: [
      "Covered voice agents (12 posts), chat agents (10), SMB strategy (10), vertical deep dives (10), infrastructure (8). Each cites its sources. We're up to 70 published posts.",
      "Thesis on long-form is that LLMs (Perplexity, ChatGPT search, Claude Search) cite well-researched, well-attributed pieces preferentially over thin SEO content. Betting on that compounding over the next 12 months.",
    ],
  },
  {
    date: "2026-05-17",
    title: "v50a — multi-provider LLM fallback chain (Anthropic → Groq → Gemini).",
    body: [
      "Built the LLM router in api/_lib/llm.ts: Anthropic primary, Groq secondary, Gemini tertiary. Demos never go dark even if Anthropic credits hit zero. Tested by killing each provider one at a time — the system degrades gracefully, never errors visibly to the user.",
      "This is the infra most agencies wave their hands at. Shipped it because I hit the wall myself at 2am one Tuesday. Now it's a feature, not a tax.",
    ],
  },
  {
    date: "2026-05-16",
    title: "v45 — HONEST /metrics. Stripped the synthetic baselines + fake events.",
    body: [
      "Previous /metrics page leaned on a synthetic baseline (think 'mid-July 2026 simulated traffic') to look like the site had momentum it didn't. Killed it. Now /metrics shows real numbers from the live lead store. If a number is zero, it shows zero.",
      "Built-in-public works because operators can smell BS at 100 yards. Better to ship an honest zero than a faked hundred. This commit is the philosophical ancestor of v58's full proof reframe.",
    ],
  },
];

export default function FounderLog() {
  useEffect(() => {
    document.title = "Founder log — TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = "https://trainyouragent.com/founder-log";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "Founder log — what got shipped, what got learned, what's next. Daily entries from inside TrainYourAgent.";
  }, []);

  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source: "founder-log-subscribe",
          path: location.pathname,
          subscribeToNewsletter: true,
          website: hp,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("ok");
    } catch {
      setState("err");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        <section className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Founder log
          </div>
          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] leading-[1.06] sm:leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
            What got shipped,{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              what got learned,
            </span>{" "}
            what's next.
          </h1>
          <p className="mt-5 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            One entry per ship day. Honest about what landed, what broke, and
            what we're swinging at next. The version of build-in-public we
            wanted to read.
          </p>
        </section>

        <section className="max-w-3xl mx-auto mt-14 space-y-12">
          {ENTRIES.map((e) => (
            <article key={e.date} className="border-b border-slate-200 pb-12 last:border-0">
              <div
                className="text-[13px] text-[#185FA5] mb-2"
                style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic" }}
              >
                {new Date(e.date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h2 className="text-[24px] sm:text-[28px] font-semibold leading-tight mb-4" style={{ color: NAVY }}>
                {e.title}
              </h2>
              <div className="space-y-4 text-[16px] text-slate-700 leading-[1.7]">
                {e.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="max-w-3xl mx-auto mt-14 rounded-2xl bg-[#042C53] text-white p-8 sm:p-10">
          {state === "ok" ? (
            <div>
              <h3 className="text-[22px] font-semibold mb-2">
                Subscribed. Watch your inbox Friday.
              </h3>
              <p className="text-[14px] text-white/80">
                We send one weekly ship note. Nothing else. Unsubscribe in one click.
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#9BC3E8] font-semibold mb-3">
                Get the weekly ship notes
              </div>
              <h3 className="text-[26px] sm:text-[32px] font-semibold leading-tight mb-3">
                One email a week. What we shipped, what we learned.
              </h3>
              <p className="text-[14px] text-white/80 mb-5 max-w-xl">
                The condensed version of this log — delivered to your inbox every
                Friday. Two minutes to read, written by a human, never by a
                rewriter.
              </p>
              <label className="sr-only" aria-hidden>
                Leave blank
                <input type="text" tabIndex={-1} value={hp} onChange={(e) => setHp(e.target.value)} />
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-[14px] focus:outline-none focus:ring-2 focus:ring-white min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="px-6 py-3 rounded-lg bg-white text-[#042C53] text-[14px] font-semibold hover:bg-slate-100 disabled:opacity-60 min-h-[44px]"
                >
                  {state === "sending" ? "Sending…" : "Subscribe"}
                </button>
              </div>
              {state === "err" && (
                <p className="mt-3 text-[12.5px] text-rose-200">
                  Something broke — try again or email hello@trainyouragent.com.
                </p>
              )}
            </form>
          )}
        </section>

        <div className="max-w-3xl mx-auto mt-10 text-center text-[13px]">
          <Link to="/mission" className="text-[#185FA5] font-medium hover:underline">
            Read the mission →
          </Link>
        </div>
      </main>
      <FooterV44 />
    </div>
  );
}
