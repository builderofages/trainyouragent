// v58 — /how-we-win-without-testimonials
// The honest case for working with us before we have customer testimonials.
// Pre-customer signal -> first-customer advantage -> proven architecture ->
// operator pedigree -> bounded-downside risk-reversal -> honest disqualification.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const CAL_URL = "https://cal.com/trainyouragent/30min";

function loadFonts() {
  if (document.getElementById("tya-fonts")) return;
  const l = document.createElement("link");
  l.id = "tya-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
  document.head.appendChild(l);
}

type Section = { eyebrow: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    eyebrow: "01 · Asymmetric incentive",
    title: "The first-customer advantage.",
    body: (
      <>
        <p>
          The first 10 customers get something the 100th customer can never have:
          locked-in founding pricing for the lifetime of the engagement, a direct
          line to Alexander (no SDR, no support tier, no ticket queue), custom-built
          (not templated) implementation, and a named case-study slot on{" "}
          <Link to="/proof" className="text-[#185FA5] underline underline-offset-2">/proof</Link>{" "}
          once we have results to show.
        </p>
        <p>
          That's a real economic incentive. The founding-customer pricing alone is
          worth more over a 24-month horizon than most consulting engagements cost.
          The trade is straightforward: you tolerate a smaller customer list in
          exchange for terms nobody else will ever get.
        </p>
      </>
    ),
  },
  {
    eyebrow: "02 · Battle-tested code, fresh customer list",
    title: "You're not the experiment — the architecture is proven.",
    body: (
      <>
        <p>
          Multi-provider LLM fallback chain (Anthropic → Groq → Gemini). Webhook
          signature verification on Stripe and Cal. Per-IP rate limiting on every
          public endpoint. Server-side prompt composition against injection.
          Strict CSP, HSTS preload, Permissions-Policy locked down. 336 commits
          showing build quality, all in a public repo you can read line by line.
        </p>
        <p>
          The CODE is battle-tested even if the customer roster is empty.
          That's the asymmetry: you're getting infrastructure that wouldn't
          look out of place at a Series-B SaaS company, deployed for a
          founding-customer price by an operator whose calendar isn't yet full.
        </p>
      </>
    ),
  },
  {
    eyebrow: "03 · Operator pedigree, not generic founder",
    title: "Specific industries beat 'I've done a bit of everything.'",
    body: (
      <>
        <p>
          Alexander spent years at one of the largest social-media-marketing
          agencies in Los Angeles, shipping campaigns for global brands and
          household-name talent. Then he founded EndCreations, building
          infrastructure for the gaming industry — a category that polished
          operators never touch because the buyers don't look like the buyers
          they're used to.
        </p>
        <p>
          The pattern: walk into industries the polished operators ignore, learn
          how the work actually gets done, and rebuild it. Four years deep in
          applied AI now, through every model release and capability jump. That's
          the operator behind the product. The bio holds up under reference checks —
          ask, on the call, and Alexander will line up a former colleague to
          take a 15-minute call with you.
        </p>
      </>
    ),
  },
  {
    eyebrow: "04 · Risk reversal makes this asymmetric",
    title: "The downside is bounded — the upside is not.",
    body: (
      <>
        <p>
          21 days from kickoff to a working agent in production, or it's free.
          30-day money-back on the first month of operating fees, no questions
          asked. Free-work-until-result on a pre-agreed success metric. No
          12-month contract trap, no clawback, no procurement runaround on
          cancellation.
        </p>
        <p>
          Compare the downside scenarios: with a SOC-2'd vendor and a 12-month
          MSA, the worst case is an 11-month claw-back of a six-figure spend that
          your CFO is still mad about. With us, the worst case is 21 days of
          your time. That's the asymmetric trade-off the founding-customer
          offer is built on.
        </p>
      </>
    ),
  },
  {
    eyebrow: "05 · Honest disqualification",
    title: "Who shouldn't work with us.",
    body: (
      <>
        <p>
          We're not for everyone. Specifically, we're not for:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-2 text-[15px] text-slate-700">
          <li>
            Companies that need a vendor with 500 customer logos on the homepage
            to feel safe. The signal you're optimizing for doesn't exist here yet.
          </li>
          <li>
            Companies that need a six-month procurement process with three rounds
            of legal review and a 47-question security questionnaire. Our cycle
            is faster than that, by design.
          </li>
          <li>
            Companies that don't want to be hands-on for the first 30 days.
            Founding-customer engagements require real iteration with you, not
            a turnkey handoff. If you can't put 2 hours a week into the build
            for the first month, the result won't be what either of us want.
          </li>
        </ul>
        <p className="mt-4">
          If any of those describe you, please don't book a call. We'd rather
          you find a vendor that fits than waste both of our time. The site is
          built to disqualify the wrong fits before the call, not to convert
          everyone.
        </p>
        <p>
          We're for operators who can read this page and recognize themselves
          in it — operators who care more about whether the work gets done than
          whether the vendor looks like every other vendor they've already
          worked with.
        </p>
      </>
    ),
  },
];

export default function HowWeWin() {
  useEffect(() => {
    document.title = "Why work with us before we have testimonials? — TrainYourAgent";
    loadFonts();
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = "https://trainyouragent.com/how-we-win-without-testimonials";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "The honest case for hiring a pre-customer AI shop: first-customer advantage, proven architecture, bounded downside, operator pedigree, and who shouldn't work with us.";
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        {/* HERO */}
        <section className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            The honest case
          </div>
          <h1 className="text-[36px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-tight font-semibold" style={{ color: NAVY }}>
            Why work with us before we have customer{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              testimonials?
            </span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[19px] text-slate-700 leading-relaxed max-w-3xl">
            The short version: because the founding-customer trade is asymmetric.
            The long version is below, in five sections, each making a claim that
            holds up under sceptical reading.
          </p>
          <p className="mt-4 text-[14px] text-slate-500">
            For the raw proof — commits, code, audits, sitemap — see{" "}
            <Link to="/proof" className="text-[#185FA5] underline underline-offset-2">/proof</Link>.
            This page is the case; that page is the evidence.
          </p>
        </section>

        {/* SECTIONS */}
        <section className="max-w-4xl mx-auto mt-16 space-y-14">
          {SECTIONS.map((s) => (
            <article key={s.eyebrow} className="border-l-2 border-[#185FA5] pl-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
                {s.eyebrow}
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight mb-4" style={{ color: NAVY }}>
                {s.title}
              </h2>
              <div className="text-[15.5px] text-slate-700 leading-[1.78] space-y-3">
                {s.body}
              </div>
            </article>
          ))}
        </section>

        {/* CLOSING CTA */}
        <section className="max-w-4xl mx-auto mt-20">
          <div className="rounded-3xl bg-[#042C53] text-white p-7 sm:p-10">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">
              If you read this and recognize yourself
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-semibold mb-4 tracking-tight">
              Talk to Alexander directly.
            </h2>
            <p className="text-[15px] sm:text-[16px] text-white/85 leading-[1.7] max-w-2xl mb-6">
              30-minute build call. No SDR, no qualification gate, no slideware.
              You bring the operational problem, we sketch the agent on the call,
              and you walk away with a written 30-day plan whether you hire us or not.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-6 py-3.5 rounded-xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 transition text-center"
              >
                Book a 30-min build call →
              </a>
              <Link
                to="/proof"
                className="px-6 py-3.5 rounded-xl border border-white/40 text-white font-semibold text-[15px] hover:bg-white/10 transition text-center"
              >
                See the receipts first
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterV44 />
    </div>
  );
}
