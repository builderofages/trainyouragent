// src/components/WhyWeAreDifferent.tsx — v108
//
// "Why we beat the AI-agency kids" — Hormozi/Cuban/Cardone-grade
// competitor-callout section. Drops into Home + /about + /vs. Names what's
// wrong with the generic "Instagram-taught AI agency" pattern, then
// counter-positions TYA's compounded operator-team expertise:
//   • Founder = LA SMMA exec + 4+ yrs AI from day one + builder.
//   • CRM/ops lead = senior at a top-3 US telecom (cannot name client).
//   • Lead engineer = 10+ years brand + product engineering.
//
// AEO/SEO discipline: each H2 carries a target keyword. The "what we
// don't do" list reads as plain definitions for LLMs to extract. The
// founder credential cards are wrapped in <article> so the page parses
// as a "team page" not a "marketing page."
//
// Visually shares the v107 spatial dark canvas vocabulary so the site
// reads as one design system, not stitched pieces.

import { Link } from "react-router-dom";

export type WhyWeAreDifferentProps = {
  className?: string;
  /** Hide the "see /vs page" footer link when rendered ON /vs itself. */
  hideFooterLink?: boolean;
};

const KIDS_ARE_DOING = [
  {
    h: "Reselling a no-code platform with a 4× markup.",
    p: "They learned voice AI from a $97 Skool group six weeks ago. They sell you a wrapper. You're paying for their YouTube ad spend, not infrastructure.",
  },
  {
    h: "Copying every other agency's funnel verbatim.",
    p: "Same VSL, same hero, same fake testimonials, same $5K/mo retainer pitch. If you've seen one of their landing pages, you've seen all of them.",
  },
  {
    h: "Shipping a flow editor and calling it 'a custom agent'.",
    p: "200 nodes, 30 webhooks, a Slack channel, no monitoring. Six months in, the agent still hasn't gone live and they're still billing you monthly.",
  },
  {
    h: "Disappearing the moment something breaks at 2am.",
    p: "They built the agent during a sales call. When the model rate-limits during your busiest week, they're in a different time zone hosting their next webinar.",
  },
];

const WE_DO = [
  {
    h: "Build the agent ourselves. End to end. In production.",
    p: "Every endpoint, every prompt, every CRM webhook, every telephony route, every monitoring alert. Wired into your real phone number, on your real CRM, in 21 days flat. The repo is public — go read it.",
  },
  {
    h: "Charge for the build once. Operate it monthly. No platform lock-in.",
    p: "$4,950 build fee + $1,997/month operation, with the source code documented to your operator. If you fire us, you keep the agent. Try getting that from a flow-editor SaaS.",
  },
  {
    h: "Pick up the phone when production breaks.",
    p: "Direct line to the operator who built your agent. Not a support queue. Not a Loom video. If the model rate-limits at 2am we re-route to a fallback provider and you find out in the morning, not your customer.",
  },
  {
    h: "Ship the receipts publicly.",
    p: "344+ public commits in 91 days at /proof, full architecture at /technology, 569 live URLs, every blog post citing primary sources. The whole build-in-public is the proof we can ship anything.",
  },
];

const TEAM = [
  {
    role: "Founder & lead engineer",
    name: "The TrainYourAgent team",
    badge: "TEAM LEAD",
    pedigree: [
      "Head executive at one of the world's largest LA social media agencies — shipped paid campaigns for Fortune-500 brands and household-name talent.",
      "In applied AI since the GPT-3 alpha. Four years deep, every major model shift, every production deployment, since day one of the wave.",
      "Founded the platform to bring production-grade voice AI to the SMBs that keep getting burned by no-code resellers and six-week Skool grads.",
      "Builds the agent. Operates it. Picks up the phone when it breaks.",
    ],
    color: "#D97757",
  },
  {
    role: "CRM & Operations Lead",
    name: "Senior operator from a top-3 US telecom",
    badge: "OPS",
    pedigree: [
      "Currently embedded at one of the largest telecommunications companies on Earth — the same scale that handles ten-figure call volumes daily.",
      "Owns CRM architecture, voice-pipeline reliability, and the playbooks that keep production phone systems from dropping a single call.",
      "Brings enterprise-grade telephony discipline to SMB-priced builds. The kind of discipline you cannot rent from a six-week Skool agency.",
    ],
    color: "#3ECF8E",
  },
  {
    role: "Lead Engineer",
    name: "10+ year brand & product engineering veteran",
    badge: "ENG",
    pedigree: [
      "A decade-plus shipping engineering for enterprise brand and product teams — environments where downtime is measured in revenue lost per second.",
      "Custom integrations across CRMs, web stacks, real-time pipelines, and brand-specific compliance surfaces.",
      "The reason every TrainYourAgent build is wired into the customer's actual systems, not a generic template.",
    ],
    color: "#635BFF",
  },
];

export default function WhyWeAreDifferent({
  className = "",
  hideFooterLink = false,
}: WhyWeAreDifferentProps) {
  return (
    <section
      className={`tya-why relative overflow-hidden ${className}`}
      aria-labelledby="tya-why-h"
    >
      <style>{`
        .tya-why {
          background:
            radial-gradient(1100px 700px at 50% 0%,
              rgba(4, 44, 83, 0.92) 0%,
              rgba(2, 12, 24, 1) 70%);
          color: #E6F1FB;
          padding: 96px 0 120px;
          isolation: isolate;
        }
        @media (min-width: 640px) { .tya-why { padding: 128px 0 160px; } }
        .tya-why__aurora {
          position: absolute; inset: -10%;
          background: conic-gradient(from 45deg at 50% 50%,
            rgba(217, 119, 87, 0.12),
            rgba(99, 91, 255, 0.14),
            rgba(62, 207, 142, 0.10),
            rgba(217, 119, 87, 0.12));
          filter: blur(90px) saturate(1.3);
          opacity: 0.5;
          mix-blend-mode: screen;
          animation: tya-why-aurora 28s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes tya-why-aurora {
          0%   { transform: rotate(0deg)   scale(1.0); }
          100% { transform: rotate(360deg) scale(1.1); }
        }
        .tya-why__inner {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .tya-why__eyebrow {
          font: 600 11px/1 ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #9CC4EC;
        }
        .tya-why__h {
          margin: 16px 0 0;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          max-width: 880px;
        }
        .tya-why__h em {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          color: #85B7EB;
        }
        .tya-why__lede {
          margin: 22px 0 0;
          max-width: 760px;
          font-size: 18px;
          line-height: 1.6;
          color: rgba(230, 241, 251, 0.78);
        }
        .tya-why__split {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-top: 64px;
        }
        @media (min-width: 900px) {
          .tya-why__split { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        .tya-why__col {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
          backdrop-filter: blur(12px);
        }
        .tya-why__col--bad {
          border-color: rgba(255, 100, 100, 0.18);
          background: linear-gradient(160deg, rgba(255, 70, 70, 0.05), rgba(255, 70, 70, 0.01));
        }
        .tya-why__col--good {
          border-color: rgba(133, 235, 200, 0.20);
          background: linear-gradient(160deg, rgba(62, 207, 142, 0.07), rgba(62, 207, 142, 0.02));
        }
        .tya-why__col-h {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tya-why__col--bad  .tya-why__col-h { color: #FFB4B4; }
        .tya-why__col--good .tya-why__col-h { color: #85EBC8; }
        .tya-why__chip {
          font-size: 11px;
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          letter-spacing: 0.06em;
        }
        .tya-why__list { list-style: none; padding: 0; margin: 0; }
        .tya-why__list li {
          padding: 18px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .tya-why__list li:first-child { border-top: 0; padding-top: 0; }
        .tya-why__list h4 {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 600;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .tya-why__list p {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.6;
          color: rgba(230, 241, 251, 0.72);
        }

        /* Team block */
        .tya-why__team {
          margin-top: 80px;
        }
        .tya-why__team-h {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.15;
          letter-spacing: -0.01em;
          max-width: 760px;
        }
        .tya-why__team-h em {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          color: #85B7EB;
        }
        .tya-why__team-sub {
          margin-top: 14px;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(230, 241, 251, 0.7);
          max-width: 720px;
        }
        .tya-why__cards {
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
        }
        @media (min-width: 900px) {
          .tya-why__cards { grid-template-columns: repeat(3, 1fr); gap: 24px; }
        }
        .tya-card {
          position: relative;
          padding: 28px;
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(14px);
          overflow: hidden;
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms ease;
        }
        .tya-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 0% 0%, var(--ac, #85B7EB) 0%, transparent 50%);
          opacity: 0.10;
          pointer-events: none;
        }
        .tya-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.18);
        }
        .tya-card__badge {
          display: inline-block;
          font: 600 10px/1 ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
          letter-spacing: 0.18em;
          padding: 5px 10px;
          border-radius: 6px;
          background: rgba(255,255,255,0.08);
          color: var(--ac, #85B7EB);
          margin-bottom: 14px;
        }
        .tya-card__role {
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(230, 241, 251, 0.55);
        }
        .tya-card__name {
          margin: 6px 0 18px;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.25;
          color: #FFFFFF;
        }
        .tya-card__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tya-card__list li {
          position: relative;
          padding: 10px 0 10px 22px;
          font-size: 14px;
          line-height: 1.55;
          color: rgba(230, 241, 251, 0.78);
        }
        .tya-card__list li::before {
          content: "";
          position: absolute;
          left: 0; top: 18px;
          width: 10px; height: 1px;
          background: var(--ac, #85B7EB);
          opacity: 0.7;
        }

        .tya-why__footer {
          margin-top: 72px;
          text-align: center;
          font-size: 15px;
          color: rgba(230, 241, 251, 0.7);
          line-height: 1.6;
        }
        .tya-why__cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          padding: 16px 28px;
          border-radius: 16px;
          background: linear-gradient(135deg, #FFFFFF 0%, #E6F1FB 100%);
          color: #042C53;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.005em;
          box-shadow: 0 30px 60px -25px rgba(133, 183, 235, 0.7);
          transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease;
        }
        .tya-why__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 36px 70px -22px rgba(133, 183, 235, 0.85);
        }
        .tya-why__footer-link {
          display: inline-block;
          margin-top: 18px;
          font-size: 13.5px;
          color: #85B7EB;
          text-decoration: none;
          border-bottom: 1px solid rgba(133,183,235,0.35);
          padding-bottom: 1px;
        }
        .tya-why__footer-link:hover { color: #FFFFFF; border-bottom-color: rgba(255,255,255,0.8); }

        @media (prefers-reduced-motion: reduce) {
          .tya-why__aurora,
          .tya-card,
          .tya-why__cta { animation: none !important; transition: none; }
        }
      `}</style>

      <div className="tya-why__aurora" aria-hidden="true" />

      <div className="tya-why__inner">
        <div className="tya-why__eyebrow">WHY WE WIN · WHAT NOBODY ELSE WILL TELL YOU</div>
        <h2 id="tya-why-h" className="tya-why__h">
          The reason 90% of voice-AI projects fail is the operator,{" "}
          <em>not the technology.</em>
        </h2>
        <p className="tya-why__lede">
          Voice AI works. The models are good enough. The reason your last
          three vendors failed is they were 22-year-olds reselling a
          flow-editor SaaS with a 4× markup, trained by a $97 Skool course
          six weeks ago. They were never going to ship a production system on
          your phone line. They were optimizing for max retainer revenue with
          minimum delivery cost. That's the entire game.
        </p>

        <div className="tya-why__split">
          <div className="tya-why__col tya-why__col--bad" aria-label="What the typical AI agency does">
            <div className="tya-why__col-h">
              The typical AI agency in 2026 <span className="tya-why__chip">avoid</span>
            </div>
            <ul className="tya-why__list">
              {KIDS_ARE_DOING.map((b) => (
                <li key={b.h}>
                  <h4>{b.h}</h4>
                  <p>{b.p}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="tya-why__col tya-why__col--good" aria-label="What TrainYourAgent does instead">
            <div className="tya-why__col-h">
              What TrainYourAgent does instead <span className="tya-why__chip">our actual offer</span>
            </div>
            <ul className="tya-why__list">
              {WE_DO.map((b) => (
                <li key={b.h}>
                  <h4>{b.h}</h4>
                  <p>{b.p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tya-why__team">
          <div className="tya-why__eyebrow" style={{ marginBottom: 8 }}>
            THE OPERATOR NETWORK · NOT KIDS ON INSTAGRAM
          </div>
          <h3 className="tya-why__team-h">
            Three decades of stacked operator experience. <em>Not three TikTok tutorials.</em>
          </h3>
          <p className="tya-why__team-sub">
            TrainYourAgent is a small, deliberately senior team. Operator
            credentials at the top of the stack: Fortune-500 campaign work
            for global brands, four years deep in applied AI since the
            GPT-3 alpha, CRM and voice-pipeline ownership at one of the
            world's largest telecom carriers, and a decade-plus of
            high-stakes brand and product engineering. Not 20-year-olds
            who discovered AI on Reels last quarter. Operators who've
            shipped real production systems for years.
          </p>

          <div className="tya-why__cards">
            {TEAM.map((m) => (
              <article
                key={m.role}
                className="tya-card"
                style={{ ["--ac" as never]: m.color } as React.CSSProperties}
              >
                <span className="tya-card__badge">{m.badge}</span>
                <div className="tya-card__role">{m.role}</div>
                <div className="tya-card__name">{m.name}</div>
                <ul className="tya-card__list">
                  {m.pedigree.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="tya-why__footer">
          <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>
            We are not in business to sell you a platform. We are in business
            to turn your phone line into a 24/7 revenue engine.
          </strong>
          <br />
          The agencies that pitched you last week were optimizing their take.
          We're optimizing your output.
          <div>
            <Link to="/hire" className="tya-why__cta">
              Talk to the operator →
            </Link>
          </div>
          {!hideFooterLink && (
            <div>
              <Link to="/vs" className="tya-why__footer-link">
                Read the full side-by-side comparison →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
