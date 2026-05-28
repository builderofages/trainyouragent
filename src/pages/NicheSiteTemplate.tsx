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

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getNicheSite } from "@/lib/nicheSiteTemplates";
import { fireEvent } from "@/lib/event";

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
  const [sp, setSp] = useSearchParams();
  const site = getNicheSite(niche);
  const hasCompanyParam = !!sp.get("company")?.trim();

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

  // ── live voice playback (TAP TO TALK) ──────────────────────────────────
  const [voiceState, setVoiceState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const personalizedGreeting = (site?.voiceGreeting || "").replace(/\{co\}/g, company);
  function stopVoice() {
    const a = audioRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch { /* noop */ } }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
    audioRef.current = null;
    setVoiceState("idle");
  }
  async function playGreeting() {
    if (!personalizedGreeting) return;
    if (voiceState === "playing") { stopVoice(); return; }
    if (voiceState === "loading") return;
    setVoiceState("loading");
    void fireEvent("template_voice_played", { niche: site?.id || "", company });
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: personalizedGreeting }),
      });
      if (!r.ok) throw new Error("tts-" + r.status);
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setVoiceState("idle"); if (audioUrlRef.current === url) { URL.revokeObjectURL(url); audioUrlRef.current = null; } audioRef.current = null; };
      audio.onerror = () => { setVoiceState("error"); if (audioUrlRef.current === url) { URL.revokeObjectURL(url); audioUrlRef.current = null; } audioRef.current = null; };
      setVoiceState("playing");
      await audio.play();
    } catch {
      setVoiceState("error");
      setTimeout(() => setVoiceState("idle"), 2400);
    }
  }
  useEffect(() => () => stopVoice(), []); // cleanup on unmount

  // ── QR code + absolute share URL (for OG image crawlers) ─────────────
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.trainyouragent.com";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const qrUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(shareUrl)}`
    : "";
  const ogImage = site
    ? `${origin}/api/og?title=${encodeURIComponent(company + ' — ' + site.niche)}&subtitle=${encodeURIComponent(city !== 'your area' ? city : site.heroLead + ' ' + site.heroItalic)}&badge=${encodeURIComponent(site.niche.toUpperCase())}&type=page`
    : `${origin}/og-default.png`;

  // ── live chat (real /api/chat back-end, in-character as the prospect's biz) ──
  // Bug fix: seed transcript is DISPLAY ONLY. The API only sees real new
  // messages, otherwise the LLM thinks the example conversation actually
  // happened and may answer the seed customer's question instead of the
  // visitor's. Display = seed + actual. API = actual only.
  type ChatMsg = { role: "user" | "assistant"; content: string };
  const seedMessages = useMemo<ChatMsg[]>(
    () =>
      (site?.chat || []).map((m) => ({
        role: m.from === "customer" ? "user" : "assistant",
        content: m.text,
      })),
    [site],
  );
  const [liveLog, setLiveLog] = useState<ChatMsg[]>([]);
  const displayLog = useMemo(() => [...seedMessages, ...liveLog], [seedMessages, liveLog]);
  const seedLen = seedMessages.length;
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { setLiveLog([]); }, [seedMessages]); // reset when niche changes
  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [liveLog, chatBusy]);
  async function sendChat(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text || chatBusy) return;
    const nextLive: ChatMsg[] = [...liveLog, { role: "user", content: text }];
    setLiveLog(nextLive);
    setChatInput("");
    setChatBusy(true);
    void fireEvent("template_chat_sent", { niche: site?.id || "", company });
    try {
      const chipsCtx = site ? `Services: ${site.chips.join(", ")}. ${site.subhead}` : "";
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextLive.slice(-12),
          custom_system: {
            business_name: company,
            industry: site?.id || "",
            context: chipsCtx.slice(0, 600),
          },
        }),
      });
      const reply = (await r.text()) || "Sorry — just had a hiccup. Try again?";
      setLiveLog((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setLiveLog((prev) => [...prev, { role: "assistant", content: "Connection blip. Try again in a moment." }]);
    } finally {
      setChatBusy(false);
    }
  }

  // ── self-service personalize (shown only when ?company= missing) ─────
  const [personalizeInput, setPersonalizeInput] = useState("");
  const [personalizeCity, setPersonalizeCity] = useState("");
  function applyPersonalize(e: React.FormEvent) {
    e.preventDefault();
    const co = personalizeInput.trim();
    if (!co) return;
    const next = new URLSearchParams(sp);
    next.set("company", co);
    if (personalizeCity.trim()) next.set("city", personalizeCity.trim());
    setSp(next, { replace: true });
    void fireEvent("template_personalized", { niche: site?.id || "", company: co });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── lead capture (backup when prospect won't book Cal) ───────────────
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadState, setLeadState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (leadState === "sending" || leadState === "ok") return;
    const em = leadEmail.trim();
    const ph = leadPhone.trim();
    if (!em && !ph) return;
    setLeadState("sending");
    void fireEvent("template_lead_submit", { niche: site?.id || "", company });
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "template-callback",
          email: em || `noemail+${Date.now()}@template-callback.local`,
          name: leadName.trim() || company,
          company,
          phone: ph,
          payload: { niche: site?.id, niche_label: site?.niche, city, prospect_company: company },
        }),
      });
      if (!r.ok) throw new Error("lead-" + r.status);
      setLeadState("ok");
    } catch {
      setLeadState("err");
      setTimeout(() => setLeadState("idle"), 3000);
    }
  }

  // ── analytics ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!site) return;
    void fireEvent("template_view", { niche: site.id, company, city });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  // ── pre-fill Cal.com booking with prospect info ───────────────────────
  const calUrl = useMemo(() => {
    const base = "https://cal.com/trainyouragent/30min";
    if (!site) return base;
    const p = new URLSearchParams();
    if (company && company !== "Your Business") p.set("name", company);
    p.set("notes", `Niche: ${site.niche}${city && city !== "your area" ? " · " + city : ""}`);
    return `${base}?${p.toString()}`;
  }, [site, company, city]);

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
        <meta property="og:title" content={`${company} — ${site.niche}`} />
        <meta property="og:description" content={site.subhead} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${company} — ${site.niche}`} />
        <meta name="twitter:description" content={site.subhead} />
        <meta name="twitter:image" content={ogImage} />
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

      {/* Self-service personalize — only shown when no ?company= param */}
      {!hasCompanyParam && (
        <div style={{ background: `linear-gradient(90deg, ${hexA(A, 0.08)}, #FFF8EE)`, borderBottom: `1px solid ${hexA(A, 0.18)}`, padding: "12px 20px" }}>
          <form
            onSubmit={applyPersonalize}
            style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, justifyContent: "center" }}
          >
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#042C53" }}>
              This is a demo for <em style={{ ...ITALIC }}>{site.defaultCompany}</em>. See it with your business name →
            </span>
            <input
              value={personalizeInput}
              onChange={(e) => setPersonalizeInput(e.target.value)}
              placeholder="Your business name"
              style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.18)", fontSize: 13.5, color: "#042C53", outline: "none", minWidth: 180, background: "#fff" }}
            />
            <input
              value={personalizeCity}
              onChange={(e) => setPersonalizeCity(e.target.value)}
              placeholder="City (optional)"
              style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.18)", fontSize: 13.5, color: "#042C53", outline: "none", minWidth: 130, background: "#fff" }}
            />
            <button
              type="submit"
              disabled={!personalizeInput.trim()}
              style={{ padding: "8px 16px", borderRadius: 10, background: A, color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: personalizeInput.trim() ? "pointer" : "not-allowed", opacity: personalizeInput.trim() ? 1 : 0.5 }}
            >
              Personalize
            </button>
          </form>
        </div>
      )}

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
                <button
                  onClick={playGreeting}
                  aria-label="Play the receptionist greeting"
                  disabled={voiceState === "loading"}
                  style={{
                    width: 86, height: 86, borderRadius: 999,
                    background: `linear-gradient(160deg, ${A}, ${shade(A)})`,
                    display: "grid", placeItems: "center",
                    boxShadow: voiceState === "playing"
                      ? `0 0 0 8px ${hexA(A, 0.18)}, 0 14px 34px -12px ${hexA(A, 0.6)}`
                      : `0 14px 34px -12px ${hexA(A, 0.6)}`,
                    border: "none", cursor: voiceState === "loading" ? "wait" : "pointer",
                    transition: "box-shadow 200ms ease, transform 200ms ease",
                    transform: voiceState === "playing" ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {voiceState === "loading" ? (
                    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="14 28" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  ) : voiceState === "playing" ? (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1.5" />
                      <rect x="14" y="5" width="4" height="14" rx="1.5" />
                    </svg>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
                      <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 11h-2z" />
                    </svg>
                  )}
                </button>
                <div style={{ fontSize: 12, fontWeight: 700, color: voiceState === "error" ? "#9B2C2C" : A, marginTop: 12, ...MONO }}>
                  {voiceState === "loading" ? "CONNECTING…" : voiceState === "playing" ? "SPEAKING" : voiceState === "error" ? "TRY AGAIN" : "TAP TO HEAR IT"}
                </div>
              </div>
              <div style={{ background: "#FAFBFC", border: "1px solid rgba(4,44,83,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94A3B8", marginBottom: 6, ...MONO }}>ON PICKUP</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#0B1B2B", margin: 0, fontStyle: "italic" }}>“{personalizedGreeting}”</p>
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
              <div ref={chatScrollRef} style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
                {displayLog.map((m, i) => {
                  const isSeed = i < seedLen;
                  return (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", opacity: isSeed && liveLog.length > 0 ? 0.55 : 1 }}>
                      <div
                        style={{
                          fontSize: 14, lineHeight: 1.45, padding: "10px 14px", borderRadius: 16,
                          background: m.role === "user" ? "#042C53" : "#F1F5F9",
                          color: m.role === "user" ? "#fff" : "#0B1B2B",
                          borderBottomRightRadius: m.role === "user" ? 4 : 16,
                          borderBottomLeftRadius: m.role === "assistant" ? 4 : 16,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {m.content}
                      </div>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3, textAlign: m.role === "user" ? "right" : "left", ...MONO }}>
                        {isSeed ? "EXAMPLE · " : ""}{m.role === "user" ? "CUSTOMER" : company.toUpperCase()}
                      </div>
                    </div>
                  );
                })}
                {chatBusy && (
                  <div style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
                    <div style={{ fontSize: 14, padding: "10px 14px", borderRadius: 16, background: "#F1F5F9", color: "#94A3B8", borderBottomLeftRadius: 4 }}>
                      <span style={{ display: "inline-block", animation: "tyaDot 1.2s infinite" }}>•</span>
                      <span style={{ display: "inline-block", animation: "tyaDot 1.2s infinite 0.2s" }}>•</span>
                      <span style={{ display: "inline-block", animation: "tyaDot 1.2s infinite 0.4s" }}>•</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3, ...MONO }}>{company.toUpperCase()}</div>
                  </div>
                )}
              </div>
              <style>{`@keyframes tyaDot{0%,80%,100%{opacity:.2}40%{opacity:1}}`}</style>
              <form onSubmit={sendChat} style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 12, padding: "8px 10px 8px 14px", background: "#FAFBFC" }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message…"
                  disabled={chatBusy}
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#0B1B2B", padding: "6px 0" }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatBusy}
                  aria-label="Send"
                  style={{ width: 34, height: 34, borderRadius: 9, background: A, border: "none", cursor: chatBusy || !chatInput.trim() ? "not-allowed" : "pointer", display: "grid", placeItems: "center", opacity: !chatInput.trim() || chatBusy ? 0.5 : 1 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
                </button>
              </form>
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
          <a
            href={calUrl}
            target="_blank"
            rel="noopener"
            onClick={() => void fireEvent("template_cta_click", { niche: site.id, company })}
            style={{ display: "inline-flex", padding: "18px 36px", borderRadius: 16, background: "#042C53", color: "#fff", fontSize: 17, fontWeight: 600, textDecoration: "none", boxShadow: "0 30px 64px -26px rgba(4,44,83,0.55)" }}
          >
            Book your 15-min build call →
          </a>
          {qrUrl && (
            <div style={{ marginTop: 44, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 22px", borderRadius: 18, background: "#fff", border: "1px solid rgba(4,44,83,0.08)", boxShadow: "0 14px 40px -22px rgba(4,44,83,0.25)" }}>
              <img src={qrUrl} alt={`QR code linking to this site for ${company}`} width={140} height={140} style={{ display: "block", borderRadius: 8 }} loading="lazy" />
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6B7B92", ...MONO }}>SCAN TO SHARE</div>
            </div>
          )}

          {/* Backup lead capture — for prospects who won't book a Cal but want a callback */}
          <div style={{ marginTop: 56, padding: "28px 24px", borderRadius: 20, background: "#fff", border: "1px solid rgba(4,44,83,0.1)", boxShadow: "0 14px 40px -22px rgba(4,44,83,0.18)", textAlign: "left", maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 8, ...MONO }}>OR — JUST CALL ME BACK</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#042C53", lineHeight: 1.3, marginBottom: 14 }}>
              Not ready for a calendar booking? Drop your number — I'll text you within the hour.
            </div>
            {leadState === "ok" ? (
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(34,163,108,0.1)", border: "1px solid rgba(34,163,108,0.3)", color: "#15724D", fontSize: 14, fontWeight: 600 }}>
                Got it. You'll hear from Alexander shortly.
              </div>
            ) : (
              <form onSubmit={submitLead} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  style={{ padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: "#042C53", outline: "none", background: "#FAFBFC" }}
                />
                <input
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  style={{ padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: "#042C53", outline: "none", background: "#FAFBFC" }}
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Phone (optional — fastest reply)"
                  type="tel"
                  style={{ padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: "#042C53", outline: "none", background: "#FAFBFC" }}
                />
                <button
                  type="submit"
                  disabled={leadState === "sending" || (!leadEmail.trim() && !leadPhone.trim())}
                  style={{ padding: "13px 18px", borderRadius: 12, background: A, color: "#fff", fontSize: 14.5, fontWeight: 600, border: "none", cursor: leadState === "sending" ? "wait" : "pointer", opacity: (!leadEmail.trim() && !leadPhone.trim()) ? 0.5 : 1 }}
                >
                  {leadState === "sending" ? "Sending…" : leadState === "err" ? "Try again" : "Call me back →"}
                </button>
              </form>
            )}
          </div>
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
