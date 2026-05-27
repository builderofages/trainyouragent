// src/pages/admin/TemplateGallery.tsx — v180
//
// Internal gallery of the niche "free website" templates. Browse every niche,
// type a prospect's company name, and open/copy their personalized site link.
// This is the first module of the unified TYA admin dashboard.

import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { NICHE_SITES } from "@/lib/nicheSiteTemplates";

const ITALIC: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: "italic",
  fontWeight: 500,
};
const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  letterSpacing: "0.2em",
};

export default function TemplateGallery() {
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.trainyouragent.com";

  function buildUrl(id: string): string {
    const q = new URLSearchParams();
    if (company.trim()) q.set("company", company.trim());
    if (city.trim()) q.set("city", city.trim());
    const qs = q.toString();
    return `${origin}/template/${id}${qs ? `?${qs}` : ""}`;
  }

  async function copy(id: string) {
    try {
      await navigator.clipboard.writeText(buildUrl(id));
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked — link is still visible via Open */
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#0B1B2B", fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <Helmet>
        <title>Niche Site Templates — TYA Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* rail */}
      <div style={{ borderBottom: "1px solid rgba(4,44,83,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#042C53", textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#042C53" strokeWidth="2.5" />
              <path d="M16 8 L24 16 L16 24 L8 16 Z" fill="#042C53" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700 }}>TrainYourAgent</span>
          </Link>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", ...MONO }}>ADMIN · NICHE TEMPLATES</span>
        </div>
      </div>

      {/* header + customizer */}
      <header style={{ padding: "48px 24px 36px", background: "linear-gradient(180deg, #FFF8EE 0%, #FAF6EE 60%, #FFFFFF 100%)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", marginBottom: 12, ...MONO }}>FREE-WEBSITE CLOSE TOOL</div>
          <h1 style={{ fontSize: "clamp(32px, 5.5vw, 56px)", lineHeight: 1.04, letterSpacing: "-0.025em", fontWeight: 600, color: "#042C53", margin: 0, maxWidth: 820 }}>
            Hand any prospect{" "}
            <span style={{ ...ITALIC }}>their site, with their name on it.</span>
          </h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.55, color: "#42526E", maxWidth: 680, marginTop: 18 }}>
            Type the prospect's business name, pick their niche, and send the link. They see a premium site with a working voice agent + chatbot demo — branded to them. Closes the &ldquo;what would mine look like?&rdquo; objection in one tap.
          </p>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>COMPANY NAME</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. SparkleHouse Cleaning"
                style={{ width: 280, maxWidth: "70vw", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(4,44,83,0.16)", fontSize: 15, color: "#042C53", outline: "none" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>CITY</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Tampa"
                style={{ width: 160, maxWidth: "60vw", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(4,44,83,0.16)", fontSize: 15, color: "#042C53", outline: "none" }}
              />
            </label>
            <span style={{ fontSize: 13, color: "#94A3B8", paddingBottom: 12 }}>
              {company.trim() ? `Links now personalized to “${company.trim()}”.` : "Leave blank to preview with sample names."}
            </span>
          </div>
        </div>
      </header>

      {/* gallery grid */}
      <section style={{ padding: "8px 24px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {NICHE_SITES.map((n) => (
            <article key={n.id} style={{ background: "#fff", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 28px -16px rgba(4,44,83,0.16)", display: "flex", flexDirection: "column" }}>
              {/* mini hero preview */}
              <div style={{ padding: "22px 22px 20px", background: `linear-gradient(155deg, ${hexA(n.accent, 0.1)}, #FAF6EE)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }} aria-hidden="true">{n.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: n.accent, padding: "4px 9px", borderRadius: 999, background: hexA(n.accent, 0.12), ...MONO }}>{n.niche.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 19, lineHeight: 1.15, fontWeight: 600, color: "#042C53", letterSpacing: "-0.01em" }}>
                  {n.heroLead} <span style={{ ...ITALIC, color: n.accent }}>{n.heroItalic}</span>
                </div>
              </div>
              {/* body */}
              <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#5C6B7F", margin: 0 }}>{n.subhead}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {n.chips.slice(0, 3).map((c) => (
                    <span key={c} style={{ fontSize: 11, fontWeight: 600, color: "#042C53", padding: "4px 9px", borderRadius: 999, background: "#F1F5F9" }}>{c}</span>
                  ))}
                </div>
                <div style={{ marginTop: "auto", display: "flex", gap: 8, paddingTop: 6 }}>
                  <a
                    href={buildUrl(n.id)}
                    target="_blank"
                    rel="noopener"
                    style={{ flex: 1, textAlign: "center", padding: "11px 14px", borderRadius: 12, background: "#042C53", color: "#fff", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}
                  >
                    Open site →
                  </a>
                  <button
                    onClick={() => copy(n.id)}
                    style={{ padding: "11px 14px", borderRadius: 12, background: "#fff", color: "#042C53", fontSize: 13.5, fontWeight: 600, border: "1px solid rgba(4,44,83,0.16)", cursor: "pointer", minWidth: 92 }}
                  >
                    {copied === n.id ? "Copied ✓" : "Copy link"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
