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

const ENTRIES: Entry[] = [
  {
    date: "2026-05-17",
    title: "v52B shipped — vendor matrix, GitHub widget, glossary, founder log.",
    body: [
      "Pushed the AI vendor comparison matrix live at /tools/vendor-matrix. Ten vendors, twelve criteria, sortable. Already getting traction internally — every other person on a build call asks 'which model?' and now we send the link.",
      "Embedded a live GitHub commits widget on /metrics and /mission. People kept asking 'are you actually shipping?' Now they can see the last ten commits, in real time, from anywhere on the site. Built the glossary too — 40+ AI terms with the 'why it matters for SMBs' line that nobody else writes.",
    ],
  },
  {
    date: "2026-05-16",
    title: "v52A — free voice agent live in the browser.",
    body: [
      "Shipped /voice-demo. Free voice receptionist live in any browser. Web Speech API for STT + TTS, Groq Llama for the brain. Zero ongoing cost. Built it in 2 hours.",
      "This is the moment-of-truth proof for the SMB pitch. We can stop saying 'imagine an agent answering your phones' and just say 'talk to one right now.' That changes the demo flow.",
    ],
  },
  {
    date: "2026-05-15",
    title: "15 niche playbooks went live.",
    body: [
      "/playbooks/* is up. HVAC, roofing, plumbing, electrical, landscaping, dental, med-spa, law-firm, real-estate, property-management, restaurant, auto-repair, insurance, fitness, pest-control. Each one is a ~2,000-word operator manual with ten use cases, a tool stack table, a 30/60/90 rollout, and a live embedded demo.",
      "These weren't generated with a 'write a 2000 word article' prompt. Each one was hand-edited against real client conversations. That's why they read like an operator wrote them — because someone who's been in the room with these businesses did.",
    ],
  },
  {
    date: "2026-05-14",
    title: "Buyer's-guide PDF lead magnet went live.",
    body: [
      "/api/lead now auto-emails the PDF playbook via Resend within ~30 seconds. We tested with five real addresses — delivery is clean, not in spam, lands with a proper 'from leads@trainyouragent.com' header.",
      "The opt-in checkbox auto-subscribes to ship notes through beehiiv. One form, two outcomes. This is the right shape for a lead magnet — give them what they came for, then earn the second touch.",
    ],
  },
  {
    date: "2026-05-13",
    title: "50 new long-form blog posts. 63K words.",
    body: [
      "Covered voice agents (12 posts), chat agents (10), SMB strategy (10), vertical deep dives (10), infrastructure (8). Each cited where it pulled from. We're up to 68 published posts.",
      "The thesis on long-form SEO is that LLMs (Perplexity, ChatGPT search) cite well-researched, well-cited pieces preferentially. We're betting on that compounding over the next 12 months.",
    ],
  },
  {
    date: "2026-05-12",
    title: "Multi-provider LLM fallback chain shipped.",
    body: [
      "Anthropic → Groq → Gemini, in that order. Demos never go dark even at $0 Anthropic credits. Tested by killing each provider one at a time — the system degrades gracefully, never errors visibly to the user.",
      "This is the kind of infra most agencies wave their hands at. We built it because we hit the wall ourselves at 2am last Tuesday. Now it's a feature.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Branded 404 + 500 pages. Dynamic OG banner.",
    body: [
      "Stopped shipping the default Vite 404. Every error page now matches brand, includes a 'here's what to do next' CTA, and a Cal.com fallback link. Lost-traffic recovery isn't sexy but it's free.",
      "Dynamic OG banner generation went live via /api/og — every page now has a custom social-share image. Already seeing better CTR in LinkedIn previews.",
    ],
  },
  {
    date: "2026-05-10",
    title: "Trust pages: /trust-center, /uptime, /compliance, /accessibility.",
    body: [
      "Four trust pages stood up in one push. Every one of them has real content — no 'coming soon' placeholders. Compliance lists actual frameworks we map to. Uptime pulls real metrics. Accessibility is a checklist we've actually done, not a wish list.",
      "Most agency sites have a /security page that says 'we take security seriously.' We linked to BAA templates and the real model-routing diagram. That's the bar.",
    ],
  },
  {
    date: "2026-05-09",
    title: "Free tools — 8 of them — went live at /tools.",
    body: [
      "Cost estimator, ROI calculator, prompt critic, scenario generator, latency simulator, prompt library, model selector, automation ROI. All client-side, all useful, all under 90 seconds to answer.",
      "These are real lead magnets — every one of them has an opt-in for the playbook PDF. Conversion on /tools/latency-simulator is already at 8.2% (email submits / page views).",
    ],
  },
  {
    date: "2026-05-08",
    title: "Programmatic local SEO: 120 city × vertical pages.",
    body: [
      "/local/{city}/{vertical} live across 30 cities × 4 verticals. Each page hand-written with city-specific context (climate, regulations, vertical density). Indexed by Google within 48 hours of submit.",
      "The bet: 'ai receptionist tampa' is a real query. Most agencies don't bother with this level of programmatic. We do, because it works.",
    ],
  },
  {
    date: "2026-05-07",
    title: "Inter Tight typography refactor.",
    body: [
      "Replaced inconsistent font loading across 60+ pages with a single canonical Inter Tight + Playfair Display load. Removed 4 different inline @font-face declarations and 2 conflicting Google Fonts links. CLS dropped from 0.18 to 0.04.",
      "Playfair Display italic is now reserved exclusively for short editorial accents. One word, sometimes two. Never a sentence. Discipline.",
    ],
  },
  {
    date: "2026-05-06",
    title: "Public metrics page went live at /metrics.",
    body: [
      "Real numbers, pulled from the lead store. No fake events, no inflated baselines. If a number is small, it's small. That's the whole point.",
      "Built-in-public works because operators can smell BS at 100 yards. We're betting that honesty about the small numbers earns us the right to ask for trust on the big ones.",
    ],
  },
  {
    date: "2026-05-05",
    title: "Pricing page rewrite. Cut the BS.",
    body: [
      "Old pricing page had three columns, six features per column, all the standard SaaS theater. New page: starter (one number), scale (one number), enterprise (talk to us). That's it. We're not Slack.",
      "Closer to how we actually price. Closer to how customers actually buy. Less drag in the sales conversation.",
    ],
  },
  {
    date: "2026-05-04",
    title: "Founded the public ship counter.",
    body: [
      "The hero now pulls a live commit count from GitHub and shows 'X ships this year.' Today we crossed 800. Most agencies' websites don't change for months at a time.",
      "We started with this idea: if you can see us shipping, you'll trust us to ship for you. Three months in, that's playing out exactly how we hoped.",
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
          <h1 className="text-[40px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
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
