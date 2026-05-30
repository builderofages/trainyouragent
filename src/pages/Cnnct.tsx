// src/pages/Cnnct.tsx — v197
//
// Quiet sister-site page for CNNCT.ai. Deliberately understated:
//   • Single column, short, no flexing
//   • TYA cream/navy brand — visitors should feel "still on TYA"
//   • Frames CNNCT as a sister COMMUNITY, not a sister PRODUCT line
//   • One outbound link to cnnct.ai, one inbound link back to TYA
//   • No nav for CNNCT inside TYA, no logo wall, no founder bio re-pitch
//   • Indexable so cnnct.ai's brand search can find this; canonical points
//     at cnnct.ai itself so we don't compete with their own domain

import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.2em" };

export default function Cnnct() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#0B1B2B", fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>CNNCT.ai — sister community to TrainYourAgent</title>
        <meta name="description" content="CNNCT.ai is a sister community to TrainYourAgent — a separate brand and separate product. TrainYourAgent stays focused on building AI agents for real businesses. This page is a quiet acknowledgement, not a pitch." />
        <link rel="canonical" href="https://www.cnnct.ai" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <SiteNav />

      <main style={{ flex: 1, padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", marginBottom: 12, ...MONO }}>SISTER COMMUNITY</div>

          <h1 style={{ fontSize: "clamp(34px, 5.5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600, color: "#042C53", margin: 0 }}>
            CNNCT is its own thing —{" "}
            <span style={{ ...ITALIC }}>this is just a small nod.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#42526E", marginTop: 22 }}>
            TrainYourAgent's job is to ship AI agents for real businesses. That's the whole focus of this site, and that's the work being shipped daily.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#42526E", marginTop: 16 }}>
            <strong style={{ color: "#0B1B2B", fontWeight: 600 }}>CNNCT.ai</strong> is a sister community — a separate brand, separate product, separate audience. The two share a founder and a zip code; that's about it. If you found your way here from CNNCT, welcome; if you found your way here from TYA and the name is new, you can ignore this page entirely without missing anything about the agents work.
          </p>

          <div style={{ marginTop: 36, padding: "24px 26px", background: "#FAFBFC", border: "1px solid rgba(4,44,83,0.08)", borderRadius: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6B7B92", marginBottom: 10, ...MONO }}>IF YOU'RE LOOKING FOR CNNCT</div>
            <a
              href="https://www.cnnct.ai"
              target="_blank"
              rel="noopener"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 600, color: "#042C53", textDecoration: "none", padding: "12px 18px", borderRadius: 12, background: "#fff", border: "1px solid rgba(4,44,83,0.16)" }}
            >
              Visit cnnct.ai <span style={{ color: "#185FA5" }}>→</span>
            </a>
          </div>

          <div style={{ marginTop: 28, padding: "24px 26px", background: "linear-gradient(155deg, #FFF8EE, #FAF6EE)", border: "1px solid rgba(4,44,83,0.08)", borderRadius: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6B7B92", marginBottom: 10, ...MONO }}>IF YOU'RE HERE FOR THE AGENTS</div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "#42526E", margin: "0 0 14px" }}>
              Voice receptionists, chat agents, the close tool, the 25-niche template library, the operator dashboard. That's TrainYourAgent.
            </p>
            <Link
              to="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none", padding: "11px 18px", borderRadius: 12, background: "#042C53" }}
            >
              Back to TrainYourAgent →
            </Link>
          </div>

          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#94A3B8", marginTop: 36 }}>
            No cross-marketing. No co-branded funnel. No bundle. Just two ventures that happen to share an operator.
          </p>
        </div>
      </main>

      <FooterV44 />
    </div>
  );
}
