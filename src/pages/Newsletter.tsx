// src/pages/Newsletter.tsx
// /newsletter — dedicated landing page for the email list.

import { Helmet } from "react-helmet";
import NewsletterCapture from "@/components/NewsletterCapture";

const FONT = "'Inter Tight', system-ui, sans-serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";

const SAMPLE_ISSUES = [
  {
    n: "001",
    date: "May 5, 2026",
    title: "The build that paid for itself in 11 days",
    teaser:
      "An after-hours HVAC voice agent on commodity infra. $4,800 to ship, $1,400/mo to run. Recovered $62k of monthly revenue that was previously going to voicemail.",
  },
  {
    n: "002",
    date: "May 12, 2026",
    title: "Why your Cartesia bill is 3x what it should be",
    teaser:
      "Three TTS billing mistakes we found auditing client accounts last month — including one that quietly bills you for SSML markup characters.",
  },
  {
    n: "003",
    date: "May 19, 2026",
    title: "The 4-question script that beat our 11-question script",
    teaser:
      "We A/B-tested two intake flows for a roofing client. The shorter one converted 41% better. The full transcripts and the prompt diff.",
  },
];

export default function Newsletter() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <Helmet>
        <title>Newsletter — Train Your Agent</title>
        <meta
          name="description"
          content="Once a week. Real builds, real numbers. The actual AI agents we shipped this week, what they cost, what they moved."
        />
      </Helmet>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-10">
        <div
          className="text-[12px] uppercase tracking-[0.18em] font-semibold mb-4"
          style={{ color: BLUE }}
        >
          The Train Your Agent Newsletter
        </div>
        <h1
          className="text-[44px] sm:text-[64px] font-semibold leading-[1.02] tracking-[-0.02em] mb-6"
          style={{ color: NAVY }}
        >
          Once a week. <br />
          Real builds, real numbers.
        </h1>
        <p className="text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-2xl mb-8">
          Every Tuesday morning, one email. The agent we shipped this week, the
          stack we used, what it cost to build, what it cost to run, and what it
          moved for the client. No thought-leadership. No "5 ways AI will
          change…". Just the work.
        </p>

        <div className="max-w-2xl">
          <NewsletterCapture
            variant="card"
            heading="Get Issue 002 in your inbox Tuesday."
            sub="Free. Unsubscribe in one click. ~3,800 founders and operators read it."
          />
        </div>

        <div className="mt-6 text-[13px] text-slate-500">
          What you get: 1 build per week · ~5-minute read · numbers and code, not opinions
        </div>
      </section>

      {/* Sample issues */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16 border-t border-slate-200">
        <div
          className="text-[12px] uppercase tracking-[0.18em] font-semibold mb-3"
          style={{ color: BLUE }}
        >
          Recent issues
        </div>
        <h2
          className="text-[32px] sm:text-[40px] font-semibold leading-tight mb-10"
          style={{ color: NAVY }}
        >
          What it actually looks like.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_ISSUES.map((iss) => (
            <div
              key={iss.n}
              className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-[#185FA5] transition-colors"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                Issue {iss.n} · {iss.date}
              </div>
              <h3
                className="text-[18px] font-semibold leading-snug mb-3"
                style={{ color: NAVY }}
              >
                {iss.title}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                {iss.teaser}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded sample (full text of Issue 001) */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-16 border-t border-slate-200">
        <div
          className="text-[12px] uppercase tracking-[0.18em] font-semibold mb-2"
          style={{ color: BLUE }}
        >
          Read a full issue
        </div>
        <h2
          className="text-[28px] sm:text-[36px] font-semibold leading-tight mb-2"
          style={{ color: NAVY }}
        >
          Issue 001: The build that paid for itself in 11 days
        </h2>
        <div className="text-[13px] text-slate-500 mb-8">May 5, 2026</div>

        <article className="prose prose-slate prose-lg max-w-none
                            prose-headings:font-semibold prose-headings:tracking-[-0.01em]
                            prose-h3:text-[20px] prose-h3:mt-8
                            prose-strong:text-[#042C53]
                            prose-a:text-[#185FA5]">
          <p>
            <strong>The intro.</strong> Last Tuesday I shipped an after-hours
            voice agent for an HVAC shop in Phoenix. Their old setup was a
            voicemail box. Their new setup is a 90-second AI triage that books
            jobs into ServiceTitan while everyone sleeps. The shop spent $4,800
            to build it and pays $1,400/month to run it. It recouped its build
            cost on day eleven. Here's the math.
          </p>

          <h3>The build (numbers)</h3>
          <p>
            The shop gets ~487 after-hours calls a month. Pre-AI, voicemail
            converted ~22% of them into booked jobs. The rest hung up or hired
            the next shop on Google. Post-AI:
          </p>
          <ul>
            <li>100% of calls answered</li>
            <li>18% triaged as emergencies — paged the on-call tech via SMS</li>
            <li>41% booked into the next-day morning slot</li>
            <li>59% capture rate overall, vs 22% baseline</li>
          </ul>
          <p>
            Average ticket value is $487. Historical close rate on a booked
            appointment is 70%. So the after-hours channel went from $36k/mo
            gross to $98k/mo gross. Net of AI cost ($1,400), that's an extra
            ~$60k/mo to the bottom line. Build cost ($4,800) recouped on day
            eleven of operation.
          </p>
          <p>
            Stack: Twilio (telephony) → Pipecat on Fly.io (orchestration) →
            Deepgram Nova-3 (STT) → GPT-4.1-mini (LLM) → Cartesia Sonic (TTS) →
            ServiceTitan webhook (dispatch). Total per-minute cost: ~$0.084.
            Average call duration: 2:40. Cost per booked job: $0.31.
          </p>

          <h3>The lesson</h3>
          <p>
            I almost over-built this. My first script asked the caller eleven
            questions to "fully understand the issue." Booking rate was 19%. I
            cut it down to four questions plus an address. Booking rate jumped
            to 41%. The customer in panic mode at 11pm doesn't want to be
            interviewed. They want to be told someone is coming.
          </p>
          <p>
            <strong>The principle:</strong> in a voice context, every question
            is friction. Every confident statement is value. Default to asking
            less, promising more, and letting the human technician handle the
            nuance on arrival.
          </p>

          <h3>The link</h3>
          <p>
            Full write-up with the system prompt, the dispatch logic, and the
            failure modes we hit:{" "}
            <a href="/blog/hvac-after-hours-playbook">
              The HVAC After-Hours Playbook
            </a>
            .
          </p>
          <p>
            See you next Tuesday.
            <br />— Alexander
          </p>
        </article>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-16 border-t border-slate-200">
        <NewsletterCapture
          variant="card"
          heading="Get the next one."
          sub="Tuesdays. ~5-minute read. One real build, the numbers, the stack."
        />
      </section>
    </div>
  );
}
