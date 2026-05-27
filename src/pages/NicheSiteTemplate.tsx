// src/pages/NicheSiteTemplate.tsx — v180
//
// Renders a complete premium one-page "free website" for a niche, in the TYA
// brand (cream/navy/Playfair). Company name + city are swappable via URL so
// you can hand a prospect THEIR site instantly:
//   /template/cleaning?company=Sparkle%20Co&city=Tampa
//
// Sections: top rail · hero · proof chips · missed-call pain · services ·
// VOICE AGENT demo card · CHATBOT demo card · pricing CTA · footer.
// No SiteNav (this is a standalone client-facing asset, not part of the marketing site).

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getNicheSite, NICHE_SITES } from "@/lib/nicheSiteTemplates";

const ITALIC: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: "italic",
  fontWeight: 500,
};
const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  letterSpacing: "0.2em",
};

export default function NicheSiteTemplate() {
  const { niche } = useParams<{ niche: string }>();
  const [sp] = useSearchParams();
  const site = getNicheSite(niche);

  // Live "$ lost" ticker for the pain block
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    if (typeof document !== "undefined" && !document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    return () => clearInterval(t);
  }, []);

  const company = sp.get("company") || site?.defaultCompany || "Your Business";
  const city = sp.get("city") || site?.city || "your area";
  const dollarsLost = useMemo(() => ((secs / 60) * 4.62).toFixed(2), [secs]);

  if (!site) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "'Inter Tight', system-ui, sans-serif", background: "#FFFFFF", color: "#042C53", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Template not found</div>
          <p style={{ color: "#5C6B7F", marginBottom: 20 }}>Pick a niche template from the gallery.</p>
          <Link to="/admin/templates" style={{ color: "#185FA5", textDecoration: "underline" }}>View all niche templates →</Link>
        </div>
      </div>
    );
  }

  const A = site.accent;

  return (
    <div
      style={{ minHeight: "100vh", background: "#FFFFFF", color: "#0B1B2B", fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif", overflowX: "hidden" }}
    >
      <Helmet>
        <title>{company} — {site.niche}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={`${company}: ${site.subhead}`} />
      </Helmet>

      {/* Top rail */}
      <div style={{ borderBottom: "1px solid rgba(4,44,83,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke={A} strokeWidth="2.5" />
              <path d="M16 8 L24 16 L16 24 L8 16 Z" fill={A} />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "#042C53" }}>{company}</span>
          </div>
          <a href="tel:+1" onClick={(e) => e.preventDefault()} style={{ fontSize: 13, fontWeight: 600, color: A, textDecoration: "none" }}>
            Call now →
          </a>
        </div>
      </div>

      {/* HERO */}
      <header style={{ padding: "72px 20px 64px", background: `linear-gradient(180deg, ${hexA(A, 0.06)} 0%, #FAF6EE 55%, #FFFFFF 100%)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: hexA(A, 0.1), color: A, fontSize: 11, fontWeight: 700, marginBottom: 26, ...MONO }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: A, display: "inline-block" }} />
            {site.niche.toUpperCase()} · {city.toUpperCase()}
          </div>
          <h1 style={{ fontSize: "clamp(38px, 7vw, 78px)", lineHeight: 1.03, letterSpacing: "-0.025em", fontWeight: 600, color: "#042C53", margin: 0 }}>
            {site.heroLead}{" "}
            <span style={{ ...ITALIC, color: A }}>{site.heroItalic}</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.55, color: "#42526E", maxWidth: 640, margin: "26px auto 30px" }}>
            {site.subhead}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <button style={{ padding: "16px 30px", borderRadius: 16, background: "#042C53", color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 24px 50px -22px rgba(4,44,83,0.5)" }}>
              Book {company.split(" ")[0]} →
            </button>
            <button style={{ padding: "16px 30px", borderRadius: 16, background: "#fff", color: "#042C53", fontSize: 16, fontWeight: 600, border: "2px solid rgba(4,44,83,0.14)", cursor: "pointer" }}>
              Talk to our AI line
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 26 }}>
            {site.chips.map((c) => (
              <span key={c} style={{ padding: "7px 13px", borderRadius: 999, background: "#fff", border: "1px solid rgba(4,44,83,0.1)", fontSize: 12.5, fontWeight: 600, color: "#042C53" }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* PAIN */}
      <section style={{ padding: "56px 20px", background: "#FFF7F4", borderTop: "1px solid rgba(197,48,48,0.1)", borderBottom: "1px solid rgba(197,48,48,0.1)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9B2C2C", marginBottom: 14, ...MONO }}>WHY {company.toUpperCase()} NEEDS THIS</div>
          <div style={{ fontSize: "clamp(48px, 9vw, 92px)", lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 600, color: "#C53030", fontVariantNumeric: "tabular-nums" }}>
            {site.painStat}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#42526E", maxWidth: 540, margin: "18px auto 0" }}>
            {site.painLabel}. <strong style={{ color: "#0B1B2B" }}>That's roughly ${dollarsLost} walking out the door since this page loaded.</strong>
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "72px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 14, ...MONO }}>WHAT WE HANDLE FOR YOU</div>
          <h2 style={{ fontSize: "clamp(26px, 4.5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600, color: "#042C53", margin: "0 0 36px", maxWidth: 640 }}>
            Every call answered.{" "}
            <span style={{ ...ITALIC, color: A }}>Every job captured.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
            {site.services.map((s) => (
              <div key={s.title} style={{ background: "#fff", border: "1px solid rgba(4,44,83,0.08)", borderRadius: 18, padding: "24px 22px", boxShadow: "0 4px 24px -14px rgba(4,44,83,0.12)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: hexA(A, 0.1), display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: A, transform: "rotate(45deg)", display: "inline-block" }} />
                </div>
                <div style={{ fontSize: 16.5, fontWeight: 700, color: "#042C53", marginBottom: 7 }}>{s.title}</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#5C6B7F", margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOICE + CHAT DEMO */}
      <section style={{ padding: "20px 20px 80px", background: "#FAFBFC", borderTop: "1px solid rgba(4,44,83,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingTop: 56 }}>
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>YOUR AGENTS · LIVE PREVIEW</div>
            <h2 style={{ fontSize: "clamp(26px, 4.5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600, color: "#042C53", margin: 0 }}>
              This is what your customers{" "}
              <span style={{ ...ITALIC, color: A }}>actually talk to.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {/* VOICE CARD */}
            <div style={{ background: "#fff", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 22, padding: "26px 24px", boxShadow: "0 18px 50px -28px rgba(4,44,83,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: "#15724D", padding: "5px 11px", borderRadius: 999, background: "rgba(34,163,108,0.1)", ...MONO }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "#22A36C", display: "inline-block" }} /> VOICE · LIVE
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8", ...MONO }}>RECEPTIONIST</span>
              </div>
              <div style={{ display: "grid", placeItems: "center", padding: "10px 0 18px" }}>
                <div style={{ width: 86, height: 86, borderRadius: 999, background: `linear-gradient(160deg, ${A}, ${shade(A)})`, display: "grid", placeItems: "center", boxShadow: `0 14px 34px -12px ${hexA(A, 0.6)}` }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
                    <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 11h-2z" />
                  </svg>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: A, marginTop: 12, ...MONO }}>TAP TO TALK</div>
              </div>
              <div style={{ background: "#FAFBFC", border: "1px solid rgba(4,44,83,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94A3B8", marginBottom: 6, ...MONO }}>ON PICKUP</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#0B1B2B", margin: 0, fontStyle: "italic" }}>“{site.voiceGreeting}”</p>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, ...MONO }}>TRY SAYING</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {site.voiceTryLines.map((l) => (
                  <div key={l} style={{ fontSize: 13.5, color: "#42526E" }}>{l}</div>
                ))}
              </div>
            </div>

            {/* CHAT CARD */}
            <div style={{ background: "#fff", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 22, padding: "26px 24px", boxShadow: "0 18px 50px -28px rgba(4,44,83,0.3)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: A, padding: "5px 11px", borderRadius: 999, background: hexA(A, 0.1), ...MONO }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: A, display: "inline-block" }} /> CHAT · LIVE
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8", ...MONO }}>WEB + SMS</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {site.chat.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.from === "customer" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                    <div
                      style={{
                        fontSize: 14, lineHeight: 1.45, padding: "10px 14px", borderRadius: 16,
                        background: m.from === "customer" ? "#042C53" : "#F1F5F9",
                        color: m.from === "customer" ? "#fff" : "#0B1B2B",
                        borderBottomRightRadius: m.from === "customer" ? 4 : 16,
                        borderBottomLeftRadius: m.from === "agent" ? 4 : 16,
                      }}
                    >
                      {m.text}
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3, textAlign: m.from === "customer" ? "right" : "left", ...MONO }}>
                      {m.from === "customer" ? "CUSTOMER" : company.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 12, padding: "10px 14px", background: "#FAFBFC" }}>
                <span style={{ fontSize: 13.5, color: "#94A3B8", flex: 1 }}>Type a message…</span>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: A, display: "grid", placeItems: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", textAlign: "center", background: `linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 60%, ${hexA(A, 0.06)} 100%)` }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(30px, 5.5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600, color: "#042C53", margin: "0 0 18px" }}>
            Stop losing calls.{" "}
            <span style={{ ...ITALIC, color: A, display: "block", marginTop: 6 }}>Put {company.split(" ")[0]} on autopilot.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#42526E", marginBottom: 28 }}>{site.priceLine}</p>
          <a href="https://cal.com/trainyouragent/30min" target="_blank" rel="noopener" style={{ display: "inline-flex", padding: "18px 36px", borderRadius: 16, background: "#042C53", color: "#fff", fontSize: 17, fontWeight: 600, textDecoration: "none", boxShadow: "0 30px 64px -26px rgba(4,44,83,0.55)" }}>
            Book your 15-min build call →
          </a>
        </div>
      </section>

      {/* Footer — discreet TYA attribution */}
      <footer style={{ padding: "28px 20px", borderTop: "1px solid rgba(4,44,83,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#94A3B8" }}>
          <span>© {new Date().getFullYear()} {company}</span>
          <span>
            Voice + chat by{" "}
            <Link to="/" style={{ color: "#185FA5", textDecoration: "underline", textUnderlineOffset: 2 }}>TrainYourAgent</Link>
            {" · "}
            <Link to="/admin/templates" style={{ color: "#94A3B8", textDecoration: "underline", textUnderlineOffset: 2 }}>all templates</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

// hex + alpha helper (accent → rgba string)
function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
// darken an accent ~18% for gradient depth
function shade(hex: string): string {
  const h = hex.replace("#", "");
  const f = (i: number) => Math.max(0, Math.round(parseInt(h.slice(i, i + 2), 16) * 0.78)).toString(16).padStart(2, "0");
  return `#${f(0)}${f(2)}${f(4)}`;
}
