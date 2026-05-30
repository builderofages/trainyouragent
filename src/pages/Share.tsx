// src/pages/Share.tsx — v213
//
// Operator's one-click share tool. Type a prospect business name + city,
// pick a niche, get an instant personalized template URL with copy + share
// buttons + a QR + ready-to-paste DM/SMS/Email/LinkedIn templates.
//
// This is the multiplier: one operator → hundreds of personalized outbound
// touches per day. Skips the gallery, skips clicking around — single screen,
// type, copy, send.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ACTIVE_NICHE_SITES } from "@/lib/nicheSiteTemplates";

const NAVY = "#042C53";
const TEXT = "#0B1B2B";
const MUTED = "#5C6B7F";
const HAIRLINE = "rgba(4,44,83,0.08)";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };

export default function Share() {
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [nicheId, setNicheId] = useState(ACTIVE_NICHE_SITES[0]?.id || "cleaning");

  // load brand fonts once
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("tya-fonts")) return;
    const l = document.createElement("link");
    l.id = "tya-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }, []);

  const niche = useMemo(() => ACTIVE_NICHE_SITES.find((n) => n.id === nicheId) || ACTIVE_NICHE_SITES[0], [nicheId]);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.trainyouragent.com";
  const url = useMemo(() => {
    if (!niche) return "";
    const p = new URLSearchParams();
    if (company.trim()) p.set("company", company.trim());
    if (city.trim()) p.set("city", city.trim());
    const qs = p.toString();
    return `${origin}/template/${niche.id}${qs ? `?${qs}` : ""}`;
  }, [origin, niche, company, city]);

  const ready = company.trim().length > 1 && !!niche;
  const firstName = (company.trim().split(/[\s&,]/)[0] || "you");

  // share message templates — niche-aware
  const templates = useMemo(() => {
    if (!niche) return [];
    const co = company.trim() || "your business";
    const c = city.trim();
    const locStr = c ? ` in ${c}` : "";
    return [
      { label: "DM", body: `Hey — saw ${co}${locStr} and built a free demo site for you. Live AI receptionist on it, fully booked-call ready. 60-sec look: ${url}` },
      { label: "SMS", body: `Hi from TrainYourAgent — built ${co} a free demo site with a live AI receptionist. Takes 60s to see: ${url}` },
      { label: "Email", body: `Subject: Built ${co} a free demo (60-sec look)\n\nHi,\n\nI run TrainYourAgent — we build AI receptionists for ${niche.niche.toLowerCase()} businesses. I built ${co} a free demo site you can see in 60 seconds. Live voice + chat, your name on it:\n\n${url}\n\nNo signup. Reply if you'd like to keep it.\n\n—Alexander` },
      { label: "LinkedIn", body: `Quick note — built ${co} a free demo of an AI receptionist site this morning. Live voice + chat, your name on it: ${url}\n\nIf it's useful, I can wire it to your real number on a 15-min Zoom.` },
    ];
  }, [niche, company, city, url]);

  const qrUrl = ready ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(url)}` : "";

  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, key: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1400);
      }).catch(() => { /* clipboard blocked — fall through */ });
    }
  }
  function nativeShare() {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share?.({ title: `${company} — ${niche?.niche}`, text: templates[0]?.body, url }).catch(() => { /* dismissed */ });
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: TEXT, fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif", padding: "0 0 60px" }}>
      <Helmet>
        <title>Share a personalized demo · TrainYourAgent</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top rail */}
      <div style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "16px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke={NAVY} strokeWidth="2.5" />
              <path d="M16 8 L24 16 L16 24 L8 16 Z" fill={NAVY} />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>TrainYourAgent</span>
          </Link>
          <div style={{ display: "flex", gap: 14, fontSize: 13 }}>
            <Link to="/admin/templates" style={{ color: MUTED, textDecoration: "none" }}>Gallery</Link>
            <Link to="/websites" style={{ color: MUTED, textDecoration: "none" }}>Public directory</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header style={{ padding: "40px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 10, ...MONO }}>OPERATOR · ONE-CLICK SHARE</div>
        <h1 style={{ fontSize: "clamp(28px, 4.4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
          Pick a niche, type a name, <span style={{ ...ITALIC, color: "#185FA5" }}>hand them their site.</span>
        </h1>
        <p style={{ fontSize: 15, color: MUTED, marginTop: 12, maxWidth: 600, margin: "12px auto 0" }}>
          Personalized URL + QR + 4 ready-to-paste outreach templates. Built for high-volume operator outreach.
        </p>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 20px", display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 1.3fr)", gap: 24, alignItems: "start" }}>
        {/* INPUT panel */}
        <div style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 20, padding: "26px 24px", boxShadow: "0 12px 36px -22px rgba(4,44,83,0.18)" }}>
          <label style={{ display: "block", marginBottom: 18 }}>
            <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7, ...MONO }}>BUSINESS NAME</span>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. SparkleHouse Cleaning" autoFocus style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 15, color: NAVY, outline: "none", background: "#FAFBFC", boxSizing: "border-box" }} />
          </label>
          <label style={{ display: "block", marginBottom: 18 }}>
            <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7, ...MONO }}>CITY (OPTIONAL)</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Tampa" style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 15, color: NAVY, outline: "none", background: "#FAFBFC", boxSizing: "border-box" }} />
          </label>
          <label style={{ display: "block", marginBottom: 4 }}>
            <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7, ...MONO }}>NICHE</span>
            <select value={nicheId} onChange={(e) => setNicheId(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 15, color: NAVY, outline: "none", background: "#FAFBFC", boxSizing: "border-box", appearance: "none", cursor: "pointer" }}>
              {ACTIVE_NICHE_SITES.map((n) => (
                <option key={n.id} value={n.id}>{n.niche}</option>
              ))}
            </select>
          </label>
        </div>

        {/* OUTPUT panel */}
        <div style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 20, padding: "26px 24px", boxShadow: "0 12px 36px -22px rgba(4,44,83,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: NAVY, ...MONO }}>PERSONALIZED URL</span>
            {ready && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, color: "#15724D", ...MONO }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#22A36C" }} /> READY
            </span>}
          </div>

          {/* URL block */}
          <div style={{ background: "#FAFBFC", border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <code style={{ flex: 1, fontSize: 12.5, color: ready ? NAVY : "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ready ? url : "Type a business name above…"}</code>
            <button onClick={() => copy(url, "url")} disabled={!ready} style={{ padding: "8px 14px", borderRadius: 9, background: ready ? NAVY : "#E2E8F0", color: ready ? "#fff" : "#94A3B8", fontSize: 12.5, fontWeight: 700, border: "none", cursor: ready ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>
              {copied === "url" ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* Open + Native share + QR row */}
          <div style={{ display: "grid", gridTemplateColumns: "auto auto 1fr", gap: 10, alignItems: "center", marginBottom: 20 }}>
            <a href={ready ? url : "#"} target="_blank" rel="noopener" style={{ padding: "10px 16px", borderRadius: 10, background: ready ? "#185FA5" : "#E2E8F0", color: ready ? "#fff" : "#94A3B8", fontSize: 13, fontWeight: 700, textDecoration: "none", pointerEvents: ready ? "auto" : "none" }}>
              Open site →
            </a>
            <button onClick={nativeShare} disabled={!ready} style={{ padding: "10px 14px", borderRadius: 10, background: ready ? "#fff" : "#F1F5F9", color: ready ? NAVY : "#94A3B8", fontSize: 13, fontWeight: 600, border: `1px solid ${HAIRLINE}`, cursor: ready ? "pointer" : "not-allowed" }}>
              ↗ Share…
            </button>
            <div style={{ textAlign: "right", fontSize: 11, color: "#94A3B8", ...MONO }}>
              {ready && niche ? `${niche.niche.toUpperCase()}` : ""}
            </div>
          </div>

          {/* QR */}
          {ready && qrUrl && (
            <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 20px" }}>
              <div style={{ padding: 14, background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 14, boxShadow: "0 6px 22px -16px rgba(4,44,83,0.18)" }}>
                <img src={qrUrl} alt={`QR for ${company}`} width={180} height={180} loading="lazy" decoding="async" style={{ display: "block", borderRadius: 6 }} />
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 10.5, fontWeight: 700, color: "#6B7B92", ...MONO }}>SCAN OR SCREENSHOT</div>
              </div>
            </div>
          )}

          {/* Outreach templates */}
          {ready && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 10, ...MONO }}>READY-TO-SEND TEMPLATES</div>
              <div style={{ display: "grid", gap: 10 }}>
                {templates.map((t) => (
                  <div key={t.label} style={{ background: "#FAFBFC", border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", ...MONO }}>{t.label.toUpperCase()}</span>
                      <button onClick={() => copy(t.body, t.label)} style={{ fontSize: 11.5, fontWeight: 700, color: NAVY, background: "#fff", border: `1px solid ${HAIRLINE}`, padding: "5px 10px", borderRadius: 8, cursor: "pointer" }}>
                        {copied === t.label ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <pre style={{ margin: 0, fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 13, lineHeight: 1.5, color: TEXT, whiteSpace: "pre-wrap" }}>{t.body}</pre>
                  </div>
                ))}
              </div>
            </>
          )}

          {!ready && (
            <div style={{ padding: "20px 16px", textAlign: "center", color: MUTED, fontSize: 13.5, lineHeight: 1.55, background: "#FAFBFC", borderRadius: 12, border: `1px dashed ${HAIRLINE}` }}>
              <em style={ITALIC}>{firstName}</em>'s personalized site appears here as soon as you type the business name.
            </div>
          )}
        </div>
      </div>

      {/* hint footer */}
      <div style={{ maxWidth: 1100, margin: "20px auto 0", padding: "0 20px", fontSize: 12, color: "#94A3B8", textAlign: "center" }}>
        Tip: keep this tab open. Type → copy → paste → next prospect. ~10 seconds per outbound touch.
      </div>

      <style>{`
        @media (max-width: 720px) {
          .layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
