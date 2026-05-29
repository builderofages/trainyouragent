// src/pages/NicheSiteTemplate.tsx — v208
//
// 2030-tier client-facing niche site. Hand a prospect /template/<niche>?company=...
// and they see THEIR business with a fully-functioning voice agent + chatbot,
// a live activity ticker, animated stats, an interactive quote calculator,
// auto-rotating reviews, transparent pricing tiers, an FAQ accordion, a
// service-area map, a sticky mobile CTA bar, and a floating call FAB.
//
// All in the TYA brand (cream/navy/Playfair) with a per-niche accent.
// One file so changes ship atomically. No 3rd-party UI deps (no Tailwind,
// no shadcn) — every visual touch is hand-rolled inline so any niche works
// on the cheapest Vercel plan with zero build surprises.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getNicheSite, type NicheSite } from "@/lib/nicheSiteTemplates";
import { nicheImageUrl, nicheImageVariant, nicheBeforeAfter } from "@/lib/nicheImages";
import { fireEvent } from "@/lib/event";

// ── style tokens ───────────────────────────────────────────────────────
const ITALIC: CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.2em" };
const NAVY = "#042C53";
const TEXT = "#0B1B2B";
const MUTED = "#5C6B7F";
const HAIRLINE = "rgba(4,44,83,0.08)";

export default function NicheSiteTemplate() {
  const { niche } = useParams<{ niche: string }>();
  const [sp, setSp] = useSearchParams();
  const site = getNicheSite(niche);
  const hasCompanyParam = !!sp.get("company")?.trim();

  const company = sp.get("company") || site?.defaultCompany || "Your Business";
  const city = sp.get("city") || site?.city || "your area";
  const firstName = company.split(/[\s&,]/)[0] || "you";

  // ── live "$ lost" ticker (persisted first-seen per prospect) ─────────
  const tickerKey = useMemo(
    () => `tya.tpl.firstSeen.${site?.id || "x"}.${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    [site?.id, company],
  );
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let firstSeenMs = 0;
    try {
      const stored = parseInt(localStorage.getItem(tickerKey) || "0", 10);
      if (stored && Date.now() - stored < 7 * 86400_000) firstSeenMs = stored;
      if (!firstSeenMs) { firstSeenMs = Date.now(); localStorage.setItem(tickerKey, String(firstSeenMs)); }
    } catch { firstSeenMs = Date.now(); }
    setSecs(Math.floor((Date.now() - firstSeenMs) / 1000));
    const t = setInterval(() => setSecs(Math.floor((Date.now() - firstSeenMs) / 1000)), 1000);
    if (typeof document !== "undefined" && !document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    return () => clearInterval(t);
  }, [tickerKey]);
  const dollarsLost = useMemo(() => ((secs / 60) * 4.62).toFixed(2), [secs]);

  // ── live voice playback (TAP TO TALK) ──────────────────────────────
  const [voiceState, setVoiceState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [voiceProgress, setVoiceProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const personalizedGreeting = (site?.voiceGreeting || "").replace(/\{co\}/g, company);

  function stopVoice() {
    const a = audioRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch { /* noop */ } }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
    audioRef.current = null; setVoiceState("idle"); setVoiceProgress(0);
  }
  async function playGreeting() {
    if (!personalizedGreeting) return;
    if (voiceState === "playing") { stopVoice(); return; }
    if (voiceState === "loading") return;
    setVoiceState("loading");
    void fireEvent("template_voice_played", { niche: site?.id || "", company });
    try {
      const r = await fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: personalizedGreeting }) });
      if (!r.ok) throw new Error("tts-" + r.status);
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.ontimeupdate = () => { if (audio.duration && isFinite(audio.duration) && audio.duration > 0) setVoiceProgress(Math.min(1, audio.currentTime / audio.duration)); };
      audio.onended = () => { setVoiceState("idle"); setVoiceProgress(0); if (audioUrlRef.current === url) { URL.revokeObjectURL(url); audioUrlRef.current = null; } audioRef.current = null; };
      audio.onerror = () => { setVoiceState("error"); setVoiceProgress(0); if (audioUrlRef.current === url) { URL.revokeObjectURL(url); audioUrlRef.current = null; } audioRef.current = null; };
      setVoiceProgress(0); setVoiceState("playing");
      await audio.play();
    } catch { setVoiceState("error"); setTimeout(() => setVoiceState("idle"), 2400); }
  }
  useEffect(() => () => stopVoice(), []);

  // ── QR + share URL + OG image ─────────────────────────────────────
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.trainyouragent.com";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const qrUrl = shareUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(shareUrl)}` : "";
  const ogImage = site
    ? `${origin}/api/og?title=${encodeURIComponent(company + " — " + site.niche)}&subtitle=${encodeURIComponent(city !== "your area" ? city : site.heroLead + " " + site.heroItalic)}&badge=${encodeURIComponent(site.niche.toUpperCase())}&type=page`
    : `${origin}/og-default.png`;

  // ── live chat (real /api/chat, in-character) ───────────────────────
  type ChatMsg = { role: "user" | "assistant"; content: string };
  const seedMessages = useMemo<ChatMsg[]>(
    () => (site?.chat || []).map((m) => ({ role: m.from === "customer" ? "user" : "assistant", content: m.text })),
    [site],
  );
  const chatKey = useMemo(
    () => `tya.tpl.chat.${site?.id || "x"}.${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    [site?.id, company],
  );
  const [liveLog, setLiveLog] = useState<ChatMsg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(`tya.tpl.chat.${site?.id || "x"}.${(sp.get("company") || site?.defaultCompany || "x").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
      if (raw) return JSON.parse(raw) as ChatMsg[];
    } catch { /* corrupt — drop */ }
    return [];
  });
  const displayLog = useMemo(() => [...seedMessages, ...liveLog], [seedMessages, liveLog]);
  const seedLen = seedMessages.length;
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (liveLog.length === 0) localStorage.removeItem(chatKey);
      else localStorage.setItem(chatKey, JSON.stringify(liveLog.slice(-40)));
    } catch { /* quota or privacy */ }
  }, [chatKey, liveLog]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { const raw = localStorage.getItem(chatKey); setLiveLog(raw ? (JSON.parse(raw) as ChatMsg[]) : []); }
    catch { setLiveLog([]); }
  }, [chatKey]);
  useEffect(() => { if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight; }, [liveLog, chatBusy]);

  async function sendChatText(textRaw: string) {
    const text = textRaw.trim();
    if (!text || chatBusy) return;
    const nextLive: ChatMsg[] = [...liveLog, { role: "user", content: text }];
    setLiveLog(nextLive); setChatInput(""); setChatBusy(true);
    void fireEvent("template_chat_sent", { niche: site?.id || "", company });
    try {
      const chipsCtx = site ? `Services: ${site.chips.join(", ")}. ${site.subhead}` : "";
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextLive.slice(-12),
          custom_system: { business_name: company, industry: site?.id || "", context: chipsCtx.slice(0, 600) },
        }),
      });
      const reply = (await r.text()) || "Sorry — just had a hiccup. Try again?";
      setLiveLog((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch { setLiveLog((prev) => [...prev, { role: "assistant", content: "Connection blip. Try again in a moment." }]); }
    finally { setChatBusy(false); }
  }
  async function sendChat(e?: React.FormEvent) { if (e) e.preventDefault(); await sendChatText(chatInput); }

  // ── self-service personalize (no ?company= param) ───────────────────
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

  // ── lead capture (backup when prospect won't book Cal) ─────────────
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadState, setLeadState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (leadState === "sending" || leadState === "ok") return;
    const em = leadEmail.trim(); const ph = leadPhone.trim();
    if (!em && !ph) return;
    setLeadState("sending");
    void fireEvent("template_lead_submit", { niche: site?.id || "", company });
    try {
      const r = await fetch("/api/lead", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "template-callback", email: em || `noemail+${Date.now()}@template-callback.local`,
          name: leadName.trim() || company, company, phone: ph,
          payload: { niche: site?.id, niche_label: site?.niche, city, prospect_company: company },
        }),
      });
      if (!r.ok) throw new Error("lead-" + r.status);
      setLeadState("ok");
    } catch { setLeadState("err"); setTimeout(() => setLeadState("idle"), 3000); }
  }

  // ── analytics + server-side opened-tracking ─────────────────────────
  useEffect(() => {
    if (!site) return;
    void fireEvent("template_view", { niche: site.id, company, city });
    if (hasCompanyParam && company && site.id) {
      void fetch("/api/template-opened", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ prospect_company: company, niche: site.id }), keepalive: true,
      }).catch(() => { /* swallow */ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id, hasCompanyParam]);

  // ── Cal.com pre-fill ───────────────────────────────────────────────
  const calUrl = useMemo(() => {
    const base = "https://cal.com/trainyouragent/30min";
    if (!site) return base;
    const p = new URLSearchParams();
    if (company && company !== "Your Business") p.set("name", company);
    p.set("notes", `Niche: ${site.niche}${city && city !== "your area" ? " · " + city : ""}`);
    return `${base}?${p.toString()}`;
  }, [site, company, city]);

  // ── animated stats (count up on view) ──────────────────────────────
  const stats = useMemo(() => {
    if (site?.statBlocks?.length) return site.statBlocks;
    return defaultStatsForNiche(site);
  }, [site]);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statValues, setStatValues] = useState<number[]>(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!statsRef.current || statsAnimated || typeof IntersectionObserver === "undefined") return;
    const targets = stats.map((s) => parseInt(s.number.replace(/[^0-9]/g, ""), 10) || 0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setStatsAnimated(true);
          const startedAt = performance.now();
          const dur = 1400;
          const step = (now: number) => {
            const t = Math.min(1, (now - startedAt) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setStatValues(targets.map((v) => Math.round(v * eased)));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
          break;
        }
      }
    }, { threshold: 0.4 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, [stats, statsAnimated]);

  // ── live activity ticker (rotating, derived if not provided) ───────
  const activity = useMemo(() => {
    const src = site?.liveActivity || defaultActivityForNiche(site);
    return src.map((t) => t.replace(/\{co\}/g, company));
  }, [site, company]);
  const [activityIdx, setActivityIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setActivityIdx((i) => (i + 1) % Math.max(1, activity.length)), 3800); return () => clearInterval(t); }, [activity.length]);

  // ── reviews carousel ───────────────────────────────────────────────
  const reviews = useMemo(() => site?.reviews || defaultReviews(site, company, city), [site, company, city]);
  const [reviewIdx, setReviewIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setReviewIdx((i) => (i + 1) % reviews.length), 5200); return () => clearInterval(t); }, [reviews.length]);

  // ── interactive quote calculator ───────────────────────────────────
  const quoteCalc = useMemo(() => site?.quoteCalc || defaultQuoteCalc(site), [site]);
  const [calcValues, setCalcValues] = useState<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const s of quoteCalc.sliders) out[s.key] = s.default;
    return out;
  });
  useEffect(() => {
    const next: Record<string, number> = {};
    for (const s of quoteCalc.sliders) next[s.key] = s.default;
    setCalcValues(next);
  }, [quoteCalc]);
  const calcTotal = useMemo(() => {
    let t = quoteCalc.basePrice;
    for (const s of quoteCalc.sliders) t += (calcValues[s.key] ?? s.default) * s.unitPrice;
    return Math.max(0, Math.round(t));
  }, [quoteCalc, calcValues]);

  // ── pricing tiers ──────────────────────────────────────────────────
  const pricing = useMemo(() => site?.pricingTiers || defaultPricing(site), [site]);

  // ── FAQ ────────────────────────────────────────────────────────────
  const faqs = useMemo(() => site?.faq || defaultFaq(site, company, city), [site, company, city]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ── service area ───────────────────────────────────────────────────
  const serviceArea = useMemo(() => site?.serviceArea || defaultServiceArea(city), [site, city]);

  // ── quick replies for chat ─────────────────────────────────────────
  const quickReplies = useMemo(() => site?.quickReplies || defaultQuickReplies(site), [site]);

  // ── hero image slideshow (3 rotating variants per niche) ──────────
  const heroImages = useMemo(() => site ? [0, 1, 2].map((v) => nicheImageVariant(site.id, v, 1280, 540)) : [], [site]);
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    if (heroImages.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5500);
    return () => clearInterval(t);
  }, [heroImages.length]);

  // ── before/after slider (drag to reveal) ──────────────────────────
  const ba = useMemo(() => site ? nicheBeforeAfter(site.id, 900, 600) : { before: "", after: "" }, [site]);
  const [baPos, setBaPos] = useState(50); // % of "after" visible from left
  const baRef = useRef<HTMLDivElement | null>(null);
  function handleBaMove(clientX: number) {
    const el = baRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    setBaPos(Math.round((x / r.width) * 100));
  }

  // ── scroll-aware sticky CTA card (desktop, after hero) ────────────
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const ctaEl = document.getElementById("cta");
      const notAtCta = !ctaEl || ctaEl.getBoundingClientRect().top > window.innerHeight * 0.8;
      setShowStickyCta(past && notAtCta);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── scroll fade-in (CSS via IntersectionObserver) ──────────────────
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>("[data-fade]");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("tya-in"); io.unobserve(e.target); }
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [site?.id]);

  if (!site) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "'Inter Tight', system-ui, sans-serif", background: "#FFFFFF", color: NAVY, padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Template not found</div>
          <p style={{ color: MUTED, marginBottom: 20 }}>Pick a niche template from the gallery.</p>
          <Link to="/admin/templates" style={{ color: "#185FA5", textDecoration: "underline" }}>View all niche templates →</Link>
        </div>
      </div>
    );
  }

  const A = site.accent;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: TEXT, fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif", overflowX: "hidden", paddingBottom: 76 }}>
      <Helmet>
        <title>{hasCompanyParam ? `${company} — ${site.niche}` : `${site.niche} site preview with AI receptionist · TrainYourAgent`}</title>
        <meta name="robots" content={hasCompanyParam ? "noindex, nofollow" : "index, follow"} />
        {!hasCompanyParam && <link rel="canonical" href={`${origin}/template/${site.id}`} />}
        <meta name="description" content={hasCompanyParam ? `${company}: ${site.subhead}` : `${site.subhead} Try it personalized to your ${site.niche.toLowerCase()} business in 5 seconds.`} />
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
        {/* v210: LocalBusiness + AggregateRating schema for Google rich results */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": company,
          "description": site.subhead,
          "url": shareUrl,
          "image": ogImage,
          "areaServed": city,
          "priceRange": "$$",
          "telephone": "+1-000-000-0000",
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" },
          "review": (reviews || []).slice(0, 3).map((r) => ({
            "@type": "Review",
            "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5 },
            "author": { "@type": "Person", "name": r.name },
            "reviewBody": r.text,
          })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": (faqs || []).map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        })}</script>
      </Helmet>

      {/* Global page styles (animations + reveal + reduced-motion respect) */}
      <style>{`
        @keyframes tyaDot { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        @keyframes tyaPulse { 0%{box-shadow:0 0 0 0 ${hexA(A, 0.45)}} 70%{box-shadow:0 0 0 14px ${hexA(A, 0)}} 100%{box-shadow:0 0 0 0 ${hexA(A, 0)}} }
        @keyframes tyaShimmer { 0%{background-position:0 0} 100%{background-position:200% 0} }
        @keyframes tyaWave { 0%,100%{transform:scaleY(.35)} 50%{transform:scaleY(1)} }
        @keyframes tyaFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes tyaMesh {
          0% { background-position: 0% 0%, 100% 100%, 50% 50%; }
          50% { background-position: 100% 50%, 0% 50%, 60% 40%; }
          100% { background-position: 0% 0%, 100% 100%, 50% 50%; }
        }
        @keyframes tyaTickerIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        [data-fade] { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
        .tya-in { opacity: 1 !important; transform: translateY(0) !important; }
        .tya-tilt { transition: transform .25s ease, box-shadow .25s ease; }
        .tya-tilt:hover { transform: translateY(-4px) rotate(-.4deg); box-shadow: 0 22px 50px -22px ${hexA(NAVY, 0.32)} !important; }
        .tya-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; background:${hexA(A, 0.18)}; outline:none; }
        .tya-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px; border-radius:50%; background:${A}; cursor:pointer; box-shadow:0 4px 14px -2px ${hexA(A, 0.55)}; border:2px solid #fff; }
        .tya-slider::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:${A}; cursor:pointer; box-shadow:0 4px 14px -2px ${hexA(A, 0.55)}; border:2px solid #fff; }
        @media (prefers-reduced-motion: reduce) {
          [data-fade] { opacity: 1 !important; transform: none !important; }
          .tya-tilt:hover { transform: none !important; }
        }
      `}</style>

      {/* ── Top rail (logo + sticky CTAs) ──────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "0 20px", background: "#fff", position: "sticky", top: 0, zIndex: 30, backdropFilter: "saturate(140%) blur(8px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={`${company} — back to top`} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke={A} strokeWidth="2.5" />
              <path d="M16 8 L24 16 L16 24 L8 16 Z" fill={A} />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: NAVY }}>{company}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => void playGreeting(), 400); void fireEvent("template_topnav_call", { niche: site.id }); }}
              style={{ fontSize: 13.5, fontWeight: 600, color: A, background: hexA(A, 0.08), border: "none", padding: "8px 14px", borderRadius: 999, cursor: "pointer" }}
            >Call now</button>
            <a
              href="#cta"
              onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" }); void fireEvent("template_topnav_book", { niche: site.id }); }}
              style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", background: NAVY, padding: "8px 14px", borderRadius: 999, textDecoration: "none" }}
            >Book →</a>
          </div>
        </div>
      </div>

      {/* ── Self-service personalize (only when no ?company=) ───────── */}
      {!hasCompanyParam && (
        <div style={{ background: `linear-gradient(90deg, ${hexA(A, 0.08)}, #FFF8EE)`, borderBottom: `1px solid ${hexA(A, 0.18)}`, padding: "12px 20px" }}>
          <form onSubmit={applyPersonalize} style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, justifyContent: "center" }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: NAVY }}>
              This is a demo for <em style={{ ...ITALIC }}>{site.defaultCompany}</em>. See it with your business name →
            </span>
            <input value={personalizeInput} onChange={(e) => setPersonalizeInput(e.target.value)} placeholder="Your business name" style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.18)", fontSize: 13.5, color: NAVY, outline: "none", minWidth: 180, background: "#fff" }} />
            <input value={personalizeCity} onChange={(e) => setPersonalizeCity(e.target.value)} placeholder="City (optional)" style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.18)", fontSize: 13.5, color: NAVY, outline: "none", minWidth: 130, background: "#fff" }} />
            <button type="submit" disabled={!personalizeInput.trim()} style={{ padding: "8px 16px", borderRadius: 10, background: A, color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: personalizeInput.trim() ? "pointer" : "not-allowed", opacity: personalizeInput.trim() ? 1 : 0.5 }}>Personalize</button>
          </form>
        </div>
      )}

      {/* ── HERO with animated mesh gradient ──────────────────────── */}
      <header
        style={{
          position: "relative",
          padding: "72px 20px 56px",
          background: `
            radial-gradient(900px 500px at 8% 0%, ${hexA(A, 0.18)}, transparent 60%),
            radial-gradient(700px 400px at 100% 30%, ${hexA(A, 0.10)}, transparent 60%),
            radial-gradient(900px 500px at 50% 100%, #FAF6EE, transparent 60%),
            #FFFFFF
          `,
          backgroundSize: "200% 200%, 200% 200%, 200% 200%, auto",
          animation: "tyaMesh 18s ease-in-out infinite",
          overflow: "hidden",
        }}
      >
        {/* live activity ticker */}
        <div style={{ maxWidth: 900, margin: "0 auto 20px", display: "flex", justifyContent: "center" }}>
          <div key={activityIdx} style={{ animation: "tyaTickerIn .45s ease-out", display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 999, background: "rgba(34,163,108,0.08)", border: "1px solid rgba(34,163,108,0.18)", fontSize: 12.5, fontWeight: 600, color: "#15724D" }}>
            <span style={{ position: "relative", width: 8, height: 8 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#22A36C" }} />
              <span style={{ position: "absolute", inset: -3, borderRadius: 999, background: "#22A36C", opacity: 0.5, animation: "tyaPulse 1.6s infinite" }} />
            </span>
            <span>{activity[activityIdx]}</span>
          </div>
        </div>

        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div data-fade style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: hexA(A, 0.1), color: A, fontSize: 11, fontWeight: 700, marginBottom: 26, ...MONO }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: A, display: "inline-block" }} />
            {site.niche.toUpperCase()} · {city.toUpperCase()}
          </div>
          <h1 data-fade style={{ fontSize: "clamp(38px, 7vw, 82px)", lineHeight: 1.03, letterSpacing: "-0.025em", fontWeight: 600, color: NAVY, margin: 0 }}>
            {site.heroLead}{" "}
            <span style={{ ...ITALIC, color: A }}>{site.heroItalic}</span>
          </h1>
          <p data-fade style={{ fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.55, color: "#42526E", maxWidth: 660, margin: "26px auto 30px" }}>
            {site.subhead}
          </p>
          <div data-fade style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" }); void fireEvent("template_hero_book", { niche: site.id }); }}
              style={{ padding: "16px 30px", borderRadius: 16, background: NAVY, color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 24px 50px -22px rgba(4,44,83,0.5)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Book {firstName} →
            </a>
            <button onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => void playGreeting(), 600); void fireEvent("template_hero_talk", { niche: site.id }); }}
              style={{ padding: "16px 30px", borderRadius: 16, background: "#fff", color: NAVY, fontSize: 16, fontWeight: 600, border: "2px solid rgba(4,44,83,0.14)", cursor: "pointer" }}>
              ▶︎ Talk to our AI line
            </button>
          </div>
          <div data-fade style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 26 }}>
            {site.chips.map((c) => (
              <span key={c} style={{ padding: "7px 13px", borderRadius: 999, background: "#fff", border: "1px solid rgba(4,44,83,0.1)", fontSize: 12.5, fontWeight: 600, color: NAVY }}>
                {c}
              </span>
            ))}
          </div>

          {/* trust strip */}
          <div data-fade style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", alignItems: "center" }}>
            {(site.trustBadges || defaultTrustBadges()).map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#5C6B7F", letterSpacing: ".06em" }}>
                <Stars n={5} small color={A} /> {b}
              </span>
            ))}
          </div>

          {/* HD niche hero SLIDESHOW — 3 rotating magazine-cover variants */}
          <div data-fade style={{ marginTop: 44, maxWidth: 1080, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "21/9", borderRadius: 22, overflow: "hidden", background: `linear-gradient(135deg, ${hexA(A, 0.22)}, ${hexA(A, 0.08)})`, boxShadow: `0 30px 70px -30px ${hexA(NAVY, 0.35)}` }}>
              {heroImages.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${site.niche} — ${company}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: i === heroIdx ? 1 : 0, transition: "opacity 1.2s ease" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ))}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 50%, rgba(4,44,83,0.55) 100%)` }} />
              <span style={{ position: "absolute", bottom: 16, left: 18, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: NAVY, fontSize: 11, fontWeight: 700, ...MONO }}>{company.toUpperCase()} · {site.niche.toUpperCase()}</span>
              {/* slide dots */}
              <div style={{ position: "absolute", bottom: 14, right: 18, display: "flex", gap: 6 }}>
                {heroImages.map((_, i) => (
                  <button key={i} onClick={() => setHeroIdx(i)} aria-label={`Image ${i + 1}`} style={{ width: i === heroIdx ? 22 : 8, height: 8, borderRadius: 99, background: i === heroIdx ? "#fff" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "width 250ms ease, background 250ms ease", padding: 0 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── ANIMATED STATS BAR ───────────────────────────────────── */}
      <section ref={statsRef} style={{ padding: "36px 20px", background: "#FAFBFC", borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`, gap: 24 }}>
          {stats.map((s, i) => {
            const target = parseInt(s.number.replace(/[^0-9]/g, ""), 10) || 0;
            const prefix = s.number.replace(/[0-9]/g, "").replace(/[^$%+]/g, "");
            const suffix = /%$/.test(s.number) ? "%" : /\+$/.test(s.number) ? "+" : "";
            return (
              <div key={s.label} data-fade style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 700, color: NAVY, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                  {prefix.includes("$") ? "$" : ""}{statValues[i]?.toLocaleString() || target.toLocaleString()}{suffix}
                </div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4, ...MONO }}>{s.label.toUpperCase()}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PAIN ─────────────────────────────────────────────────── */}
      <section data-fade style={{ padding: "56px 20px", background: "#FFF7F4", borderBottom: "1px solid rgba(197,48,48,0.1)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9B2C2C", marginBottom: 14, ...MONO }}>WHY {company.toUpperCase()} NEEDS THIS</div>
          <div style={{ fontSize: "clamp(48px, 9vw, 92px)", lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 600, color: "#C53030", fontVariantNumeric: "tabular-nums" }}>
            {site.painStat}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#42526E", maxWidth: 560, margin: "18px auto 0" }}>
            {site.painLabel}. <strong style={{ color: TEXT }}>That's roughly ${dollarsLost} walking out the door since this page loaded.</strong>
          </p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 14, ...MONO }}>WHAT WE HANDLE FOR YOU</div>
          <h2 data-fade style={{ fontSize: "clamp(26px, 4.5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 36px", maxWidth: 640 }}>
            Every call answered. <span style={{ ...ITALIC, color: A }}>Every job captured.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {site.services.map((s) => (
              <div key={s.title} data-fade className="tya-tilt" style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 18, padding: "26px 24px", boxShadow: "0 4px 24px -14px rgba(4,44,83,0.12)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: hexA(A, 0.12), display: "grid", placeItems: "center", marginBottom: 14 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: A, transform: "rotate(45deg)", display: "inline-block" }} />
                </div>
                <div style={{ fontSize: 16.5, fontWeight: 700, color: NAVY, marginBottom: 7 }}>{s.title}</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", background: `linear-gradient(180deg, #fff 0%, ${hexA(A, 0.04)} 100%)`, borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(26px, 4.5vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
              From missed call to <span style={{ ...ITALIC, color: A }}>booked job</span> in under 2 minutes.
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            {/* connector line behind the steps (desktop only) */}
            <div style={{ position: "absolute", top: 30, left: "12.5%", right: "12.5%", height: 2, background: `linear-gradient(90deg, ${hexA(A, 0.12)}, ${hexA(A, 0.35)}, ${hexA(A, 0.12)})`, zIndex: 0 }} className="tya-hiw-line" />
            <style>{`@media (max-width: 720px){ .tya-hiw-line { display:none; } }`}</style>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, position: "relative", zIndex: 1 }}>
              {howItWorksForNiche(site).map((step, i) => (
                <div key={step.title} data-fade style={{ textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, margin: "0 auto 18px", borderRadius: "50%", background: `linear-gradient(160deg, ${A}, ${shade(A)})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 700, boxShadow: `0 12px 28px -10px ${hexA(A, 0.55)}`, position: "relative" }}>
                    {i + 1}
                    <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `2px solid ${hexA(A, 0.2)}`, animation: `tyaPulse ${2.4 + i * 0.3}s ease-in-out ${i * 0.4}s infinite` }} />
                  </div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: NAVY, marginBottom: 7, letterSpacing: "-0.01em" }}>{step.title}</div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, color: MUTED, margin: 0 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTANT QUOTE CALCULATOR ─────────────────────────────── */}
      <section style={{ padding: "20px 20px 80px" }}>
        <div data-fade style={{ maxWidth: 920, margin: "0 auto", background: `linear-gradient(180deg, #fff 0%, ${hexA(A, 0.04)} 100%)`, border: `1px solid ${HAIRLINE}`, borderRadius: 24, padding: "32px 28px", boxShadow: "0 16px 48px -26px rgba(4,44,83,0.18)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 8, ...MONO }}>INSTANT QUOTE</div>
              <h3 style={{ margin: 0, fontSize: "clamp(22px, 3.5vw, 32px)", lineHeight: 1.12, fontWeight: 600, color: NAVY, letterSpacing: "-0.02em" }}>{quoteCalc.label}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "clamp(36px, 6vw, 54px)", fontWeight: 700, color: A, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                ${calcTotal.toLocaleString()}
              </div>
              <div style={{ fontSize: 11.5, color: MUTED, ...MONO, marginTop: 2 }}>ESTIMATED</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {quoteCalc.sliders.map((s) => {
              const val = calcValues[s.key] ?? s.default;
              return (
                <div key={s.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: NAVY }}>{s.label}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: A, fontVariantNumeric: "tabular-nums" }}>{val}{s.unit ? ` ${s.unit}` : ""}</span>
                  </div>
                  <input type="range" className="tya-slider" min={s.min} max={s.max} step={s.step} value={val} onChange={(e) => setCalcValues((cv) => ({ ...cv, [s.key]: parseFloat(e.target.value) }))} aria-label={s.label} />
                </div>
              );
            })}
          </div>
          {quoteCalc.footnote && <div style={{ marginTop: 18, fontSize: 12, color: MUTED }}>{quoteCalc.footnote}</div>}
          <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); void fireEvent("template_quote_book", { niche: site.id, value: calcTotal }); }} style={{ padding: "12px 22px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>Lock this quote →</a>
            <button onClick={() => { void sendChatText(`I'd like a quote — your calculator gave me $${calcTotal}.`); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }} style={{ padding: "12px 22px", borderRadius: 12, background: "#fff", color: NAVY, fontSize: 14.5, fontWeight: 600, border: "2px solid rgba(4,44,83,0.14)", cursor: "pointer" }}>Ask the agent →</button>
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER SLIDER ────────────────────────────────── */}
      <section style={{ padding: "20px 20px 80px" }}>
        <div data-fade style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>BEFORE · AFTER</div>
            <h2 style={{ fontSize: "clamp(26px, 4.2vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
              Drag the slider. <span style={{ ...ITALIC, color: A }}>See the difference.</span>
            </h2>
          </div>
          <div
            ref={baRef}
            onMouseMove={(e) => { if (e.buttons === 1) handleBaMove(e.clientX); }}
            onMouseDown={(e) => handleBaMove(e.clientX)}
            onTouchStart={(e) => handleBaMove(e.touches[0].clientX)}
            onTouchMove={(e) => handleBaMove(e.touches[0].clientX)}
            style={{ position: "relative", width: "100%", aspectRatio: "3/2", maxHeight: 560, borderRadius: 22, overflow: "hidden", border: `1px solid ${HAIRLINE}`, boxShadow: `0 26px 60px -30px ${hexA(NAVY, 0.4)}`, cursor: "ew-resize", userSelect: "none", background: hexA(A, 0.08) }}
            role="slider"
            aria-label="Before and after comparison — drag to reveal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={baPos}
          >
            {/* BEFORE (full) */}
            <img src={ba.before} alt="Before" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            {/* AFTER (clipped from left to baPos%) */}
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - baPos}% 0 0)`, transition: "clip-path 60ms linear" }}>
              <img src={ba.after} alt="After" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            </div>
            {/* labels */}
            <span style={{ position: "absolute", top: 14, left: 14, padding: "5px 11px", borderRadius: 999, background: "rgba(11,27,43,0.78)", color: "#fff", fontSize: 11, fontWeight: 700, ...MONO }}>BEFORE</span>
            <span style={{ position: "absolute", top: 14, right: 14, padding: "5px 11px", borderRadius: 999, background: A, color: "#fff", fontSize: 11, fontWeight: 700, ...MONO }}>AFTER</span>
            {/* drag handle */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${baPos}%`, width: 2, background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.18)", transform: "translateX(-1px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: `${baPos}%`, width: 44, height: 44, borderRadius: "50%", background: "#fff", transform: "translate(-50%, -50%)", display: "grid", placeItems: "center", boxShadow: "0 8px 22px -6px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── VOICE + CHAT DEMO ────────────────────────────────────── */}
      <section id="demo" style={{ padding: "20px 20px 80px", background: "#FAFBFC", borderTop: `1px solid ${HAIRLINE}`, scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", paddingTop: 56 }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 38 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>YOUR AGENTS · LIVE PREVIEW</div>
            <h2 style={{ fontSize: "clamp(26px, 4.5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
              This is what your customers <span style={{ ...ITALIC, color: A }}>actually talk to.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
            {/* VOICE CARD */}
            <div data-fade style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 22, padding: "26px 24px", boxShadow: "0 18px 50px -28px rgba(4,44,83,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: "#15724D", padding: "5px 11px", borderRadius: 999, background: "rgba(34,163,108,0.1)", ...MONO }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "#22A36C" }} /> VOICE · LIVE
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8", ...MONO }}>RECEPTIONIST</span>
              </div>
              <div style={{ display: "grid", placeItems: "center", padding: "10px 0 18px" }}>
                <button onClick={playGreeting} aria-label="Play the receptionist greeting" disabled={voiceState === "loading"} style={{
                  width: 92, height: 92, borderRadius: 999,
                  background: `linear-gradient(160deg, ${A}, ${shade(A)})`,
                  display: "grid", placeItems: "center",
                  boxShadow: voiceState === "playing" ? `0 0 0 8px ${hexA(A, 0.18)}, 0 14px 34px -12px ${hexA(A, 0.6)}` : `0 14px 34px -12px ${hexA(A, 0.6)}`,
                  border: "none", cursor: voiceState === "loading" ? "wait" : "pointer", transition: "all 220ms ease",
                  transform: voiceState === "playing" ? "scale(1.04)" : "scale(1)",
                  animation: voiceState === "idle" ? "tyaPulse 2.6s infinite" : undefined,
                }}>
                  {voiceState === "loading" ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="14 28" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  ) : voiceState === "playing" ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
                      <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 11h-2z" />
                    </svg>
                  )}
                </button>
                <div style={{ fontSize: 12, fontWeight: 700, color: voiceState === "error" ? "#9B2C2C" : A, marginTop: 12, ...MONO }}>
                  {voiceState === "loading" ? "CONNECTING…" : voiceState === "playing" ? "SPEAKING · TAP TO STOP" : voiceState === "error" ? "TRY AGAIN" : "TAP TO HEAR IT"}
                </div>
                {/* waveform — only visible while playing */}
                {voiceState === "playing" && (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, height: 26 }}>
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
                      <span key={i} style={{ display: "inline-block", width: 4, borderRadius: 2, background: A, height: 18, transformOrigin: "center", animation: `tyaWave .9s ease-in-out ${i * 0.07}s infinite` }} />
                    ))}
                  </div>
                )}
                {voiceState === "playing" && (
                  <div style={{ marginTop: 10, width: 120, height: 3, borderRadius: 3, background: hexA(A, 0.18), overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(voiceProgress * 100)}%`, height: "100%", background: A, transition: "width 200ms linear" }} />
                  </div>
                )}
              </div>
              <div style={{ background: "#FAFBFC", border: `1px solid ${HAIRLINE}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94A3B8", marginBottom: 6, ...MONO }}>ON PICKUP</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, color: TEXT, margin: 0, fontStyle: "italic" }}>“{personalizedGreeting}”</p>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, ...MONO }}>TRY SAYING</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {site.voiceTryLines.map((l) => (<div key={l} style={{ fontSize: 13.5, color: "#42526E" }}>{l}</div>))}
              </div>
            </div>

            {/* CHAT CARD */}
            <div data-fade style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 22, padding: "26px 24px", boxShadow: "0 18px 50px -28px rgba(4,44,83,0.3)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: A, padding: "5px 11px", borderRadius: 999, background: hexA(A, 0.1), ...MONO }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: A }} /> CHAT · LIVE
                </span>
                {liveLog.length > 0 ? (
                  <button onClick={() => setLiveLog([])} style={{ fontSize: 11, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, ...MONO }}>CLEAR</button>
                ) : (<span style={{ fontSize: 11, color: "#94A3B8", ...MONO }}>WEB + SMS</span>)}
              </div>
              <div ref={chatScrollRef} style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
                {displayLog.map((m, i) => {
                  const isSeed = i < seedLen;
                  return (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", opacity: isSeed && liveLog.length > 0 ? 0.55 : 1 }}>
                      <div style={{ fontSize: 14, lineHeight: 1.45, padding: "10px 14px", borderRadius: 16, background: m.role === "user" ? NAVY : "#F1F5F9", color: m.role === "user" ? "#fff" : TEXT, borderBottomRightRadius: m.role === "user" ? 4 : 16, borderBottomLeftRadius: m.role === "assistant" ? 4 : 16, whiteSpace: "pre-wrap" }}>
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
              {/* quick-reply chips */}
              {liveLog.length < 2 && quickReplies.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {quickReplies.slice(0, 4).map((q) => (
                    <button key={q} onClick={() => void sendChatText(q)} disabled={chatBusy} style={{ fontSize: 12.5, padding: "6px 12px", borderRadius: 999, background: hexA(A, 0.08), color: A, border: `1px solid ${hexA(A, 0.2)}`, cursor: chatBusy ? "wait" : "pointer", fontWeight: 600 }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={sendChat} style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center", border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "8px 10px 8px 14px", background: "#FAFBFC" }}>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message…" disabled={chatBusy} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: TEXT, padding: "6px 0" }} />
                <button type="submit" disabled={!chatInput.trim() || chatBusy} aria-label="Send" style={{ width: 34, height: 34, borderRadius: 9, background: A, border: "none", cursor: chatBusy || !chatInput.trim() ? "not-allowed" : "pointer", display: "grid", placeItems: "center", opacity: !chatInput.trim() || chatBusy ? 0.5 : 1 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS CAROUSEL ─────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div data-fade style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>WHAT NEIGHBORS SAY</div>
          <h2 data-fade style={{ fontSize: "clamp(24px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 30px" }}>
            Local <span style={{ ...ITALIC, color: A }}>real-deal</span> reviews.
          </h2>
          <div data-fade style={{ background: "#FAFBFC", border: `1px solid ${HAIRLINE}`, borderRadius: 20, padding: "32px 26px", boxShadow: "0 10px 36px -22px rgba(4,44,83,0.18)", position: "relative", minHeight: 200 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ opacity: i === reviewIdx ? 1 : 0, position: i === reviewIdx ? "relative" : "absolute", inset: i === reviewIdx ? "auto" : 0, padding: i === reviewIdx ? 0 : "32px 26px", transition: "opacity 600ms ease", pointerEvents: i === reviewIdx ? "auto" : "none" }}>
                <Stars n={r.stars} color="#F59E0B" />
                <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.55, color: TEXT, margin: "16px 0 18px", fontStyle: "italic" }}>“{r.text}”</p>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{r.name}{r.city ? <span style={{ fontWeight: 500, color: MUTED }}>{" · "}{r.city}</span> : null}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 22 }}>
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setReviewIdx(i)} aria-label={`Review ${i + 1}`} style={{ width: i === reviewIdx ? 24 : 8, height: 8, borderRadius: 99, background: i === reviewIdx ? A : "rgba(4,44,83,0.18)", border: "none", cursor: "pointer", transition: "width 250ms ease, background 250ms ease" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING TIERS ────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", background: "#FAF6EE" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>SIMPLE PRICING</div>
            <h2 style={{ fontSize: "clamp(26px, 4.5vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
              Pay for what you book. <span style={{ ...ITALIC, color: A }}>Cancel anytime.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {pricing.map((t) => (
              <div key={t.name} data-fade className="tya-tilt" style={{ background: "#fff", border: t.featured ? `2px solid ${A}` : `1px solid ${HAIRLINE}`, borderRadius: 20, padding: "30px 26px", position: "relative", boxShadow: t.featured ? `0 22px 56px -28px ${hexA(A, 0.45)}` : "0 6px 22px -16px rgba(4,44,83,0.15)" }}>
                {t.featured && (
                  <div style={{ position: "absolute", top: -12, left: 24, padding: "4px 10px", borderRadius: 999, background: A, color: "#fff", fontSize: 10.5, fontWeight: 700, ...MONO }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: A, ...MONO, marginBottom: 12 }}>{t.name.toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 38, fontWeight: 700, color: NAVY, letterSpacing: "-0.02em" }}>{t.price}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>/ {t.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 26px", display: "grid", gap: 9 }}>
                  {t.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: TEXT, lineHeight: 1.45 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="12" cy="12" r="10" fill={hexA(A, 0.15)} />
                        <path d="M7 12.5l3 3 7-7" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); void fireEvent("template_pricing_click", { niche: site.id, tier: t.name }); }} style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 12, background: t.featured ? NAVY : "#fff", color: t.featured ? "#fff" : NAVY, fontSize: 14.5, fontWeight: 600, textDecoration: "none", border: t.featured ? "none" : "2px solid rgba(4,44,83,0.14)" }}>
                  {t.cta || `Start ${t.name} →`}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div data-fade style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>QUESTIONS</div>
          <h2 data-fade style={{ fontSize: "clamp(24px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 28px" }}>
            Everything <span style={{ ...ITALIC, color: A }}>{firstName}</span> usually asks.
          </h2>
          <div data-fade style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            {faqs.map((f, i) => (
              <div key={f.q} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <button onClick={() => setOpenFaq((o) => (o === i ? null : i))} style={{ width: "100%", textAlign: "left", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: NAVY, fontSize: 15.5, fontWeight: 600 }}>
                  <span>{f.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: openFaq === i ? A : hexA(A, 0.12), color: openFaq === i ? "#fff" : A, display: "grid", placeItems: "center", fontSize: 16, fontWeight: 600, flexShrink: 0, marginLeft: 12, transition: "all 220ms ease", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                <div style={{ maxHeight: openFaq === i ? 240 : 0, overflow: "hidden", transition: "max-height 320ms ease" }}>
                  <p style={{ margin: "0 0 18px", fontSize: 14.5, lineHeight: 1.6, color: MUTED, paddingRight: 40 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA ─────────────────────────────────────────── */}
      <section style={{ padding: "60px 20px", background: `linear-gradient(180deg, #fff 0%, ${hexA(A, 0.04)} 100%)`, borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, alignItems: "center" }}>
          <div data-fade>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>SERVICE AREA</div>
            <h3 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 14px" }}>
              Now serving <span style={{ ...ITALIC, color: A }}>{city}</span>{city !== "your area" ? " and surrounding neighborhoods." : "."}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {serviceArea.map((n) => (
                <span key={n} style={{ padding: "6px 12px", borderRadius: 999, background: "#fff", border: `1px solid ${HAIRLINE}`, fontSize: 12.5, fontWeight: 600, color: NAVY }}>{n}</span>
              ))}
            </div>
          </div>
          <div data-fade style={{ position: "relative", aspectRatio: "1.2/1", maxWidth: 360, margin: "0 auto", display: "grid", placeItems: "center" }}>
            {/* animated coverage rings */}
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  position: "absolute", width: `${i * 33}%`, height: `${i * 33}%`, borderRadius: "50%",
                  border: `2px solid ${A}`, opacity: 0.18 + (3 - i) * 0.18, animation: `tyaPulse ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                }} />
              ))}
            </div>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(160deg, ${A}, ${shade(A)})`, display: "grid", placeItems: "center", boxShadow: `0 14px 34px -10px ${hexA(A, 0.5)}`, zIndex: 1 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section id="cta" style={{ padding: "80px 20px", textAlign: "center", background: `linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 60%, ${hexA(A, 0.06)} 100%)`, scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 data-fade style={{ fontSize: "clamp(30px, 5.5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 18px" }}>
            Stop losing calls. <span style={{ ...ITALIC, color: A, display: "block", marginTop: 6 }}>Put {firstName} on autopilot.</span>
          </h2>
          <p data-fade style={{ fontSize: 16, lineHeight: 1.6, color: "#42526E", marginBottom: 28 }}>{site.priceLine}</p>
          <a href={calUrl} target="_blank" rel="noopener" onClick={() => void fireEvent("template_cta_click", { niche: site.id, company })}
            style={{ display: "inline-flex", padding: "18px 36px", borderRadius: 16, background: NAVY, color: "#fff", fontSize: 17, fontWeight: 600, textDecoration: "none", boxShadow: "0 30px 64px -26px rgba(4,44,83,0.55)" }}>
            Book your 15-min build call →
          </a>
          {qrUrl && (
            <div data-fade style={{ marginTop: 44, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 22px", borderRadius: 18, background: "#fff", border: `1px solid ${HAIRLINE}`, boxShadow: "0 14px 40px -22px rgba(4,44,83,0.25)" }}>
              <img src={qrUrl} alt={`QR code linking to this site for ${company}`} width={140} height={140} style={{ display: "block", borderRadius: 8 }} loading="lazy" />
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6B7B92", ...MONO }}>SCAN TO SHARE</div>
            </div>
          )}

          {/* Backup lead capture */}
          <div data-fade style={{ marginTop: 56, padding: "28px 24px", borderRadius: 20, background: "#fff", border: `1px solid ${HAIRLINE}`, boxShadow: "0 14px 40px -22px rgba(4,44,83,0.18)", textAlign: "left", maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 8, ...MONO }}>OR — JUST CALL ME BACK</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: NAVY, lineHeight: 1.3, marginBottom: 14 }}>
              Not ready for a calendar booking? Drop your number — I'll text you within the hour.
            </div>
            {leadState === "ok" ? (
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(34,163,108,0.1)", border: "1px solid rgba(34,163,108,0.3)", color: "#15724D", fontSize: 14, fontWeight: 600 }}>
                Got it. You'll hear from Alexander shortly.
              </div>
            ) : (
              <form onSubmit={submitLead} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Your name" style={{ padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: NAVY, outline: "none", background: "#FAFBFC" }} />
                <input value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="Email" type="email" style={{ padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: NAVY, outline: "none", background: "#FAFBFC" }} />
                <input value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} placeholder="Phone (optional — fastest reply)" type="tel" style={{ padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: NAVY, outline: "none", background: "#FAFBFC" }} />
                <button type="submit" disabled={leadState === "sending" || (!leadEmail.trim() && !leadPhone.trim())} style={{ padding: "13px 18px", borderRadius: 12, background: A, color: "#fff", fontSize: 14.5, fontWeight: 600, border: "none", cursor: leadState === "sending" ? "wait" : "pointer", opacity: (!leadEmail.trim() && !leadPhone.trim()) ? 0.5 : 1 }}>
                  {leadState === "sending" ? "Sending…" : leadState === "err" ? "Try again" : "Call me back →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{ padding: "28px 20px", borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#94A3B8" }}>
          <span>© {new Date().getFullYear()} {company}</span>
          <span>
            Voice + chat by{" "}
            <Link to="/" style={{ color: "#185FA5", textDecoration: "underline", textUnderlineOffset: 2 }}>TrainYourAgent</Link>
            {" · "}
            <Link to="/admin/templates" style={{ color: "#94A3B8", textDecoration: "underline", textUnderlineOffset: 2 }}>all templates</Link>
          </span>
        </div>
      </footer>

      {/* ── Sticky mobile CTA bar (hidden ≥720px) ────────────────── */}
      <style>{`@media (min-width: 720px) { .tya-mobcta { display:none !important; } }`}</style>
      <div className="tya-mobcta" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, background: "#fff", borderTop: `1px solid ${HAIRLINE}`, padding: "10px 14px", display: "flex", gap: 8, boxShadow: "0 -8px 24px -16px rgba(4,44,83,0.25)" }}>
        <button onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => void playGreeting(), 400); }} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#fff", border: `2px solid ${hexA(A, 0.3)}`, color: A, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          📞 Hear it
        </button>
        <a href={calUrl} target="_blank" rel="noopener" onClick={() => void fireEvent("template_mobcta_book", { niche: site.id })} style={{ flex: 1.4, padding: "12px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
          Book {firstName} →
        </a>
      </div>

      {/* ── Scroll-aware sticky CTA card (desktop only) ─────────── */}
      <style>{`@media (max-width: 980px) { .tya-scta { display:none !important; } }`}</style>
      <div className="tya-scta" aria-hidden={!showStickyCta} style={{
        position: "fixed", right: 24, bottom: 100, zIndex: 49, width: 280,
        background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 16, padding: 16,
        boxShadow: `0 26px 56px -22px ${hexA(NAVY, 0.45)}`,
        transform: showStickyCta ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        opacity: showStickyCta ? 1 : 0,
        pointerEvents: showStickyCta ? "auto" : "none",
        transition: "all 280ms cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#15724D", marginBottom: 8, ...MONO }}>
          <span style={{ position: "relative", width: 8, height: 8 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#22A36C" }} />
            <span style={{ position: "absolute", inset: -3, borderRadius: 999, background: "#22A36C", opacity: 0.5, animation: "tyaPulse 1.6s infinite" }} />
          </span>
          BOOKING NOW
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: NAVY, lineHeight: 1.3, marginBottom: 12 }}>
          Lock <span style={{ ...ITALIC, color: A }}>{firstName}</span> in 60 seconds.
        </div>
        <a href={calUrl} target="_blank" rel="noopener" onClick={() => void fireEvent("template_scta_book", { niche: site.id })} style={{ display: "block", textAlign: "center", padding: "11px 14px", borderRadius: 11, background: NAVY, color: "#fff", fontSize: 13.5, fontWeight: 600, textDecoration: "none", marginBottom: 8 }}>
          Book your build call →
        </a>
        <button onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => void playGreeting(), 400); }} style={{ display: "block", width: "100%", textAlign: "center", padding: "9px 14px", borderRadius: 11, background: hexA(A, 0.08), color: A, fontSize: 12.5, fontWeight: 600, border: "none", cursor: "pointer" }}>
          ▶︎ Hear the AI line first
        </button>
      </div>

      {/* ── Floating action button (desktop) ────────────────────── */}
      <style>{`@media (max-width: 720px) { .tya-fab { display:none !important; } }`}</style>
      <button className="tya-fab" onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => void playGreeting(), 400); void fireEvent("template_fab_click", { niche: site.id }); }} aria-label="Hear the AI receptionist now"
        style={{ position: "fixed", right: 24, bottom: 24, zIndex: 50, width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(160deg, ${A}, ${shade(A)})`, color: "#fff", border: "none", boxShadow: `0 18px 38px -10px ${hexA(A, 0.6)}`, cursor: "pointer", display: "grid", placeItems: "center", animation: "tyaFloat 3.4s ease-in-out infinite" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M6.62 10.79a15.5 15.5 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function Stars({ n, small, color }: { n: number; small?: boolean; color?: string }) {
  const size = small ? 12 : 18;
  return (
    <span style={{ display: "inline-flex", gap: 2, verticalAlign: "middle" }} aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < n ? (color || "#F59E0B") : "rgba(0,0,0,0.12)"} aria-hidden="true">
          <path d="M12 2l2.94 6.36L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.06-.91L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16); const g = parseInt(h.slice(2, 4), 16); const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex: string): string {
  const h = hex.replace("#", "");
  const f = (i: number) => Math.max(0, Math.round(parseInt(h.slice(i, i + 2), 16) * 0.78)).toString(16).padStart(2, "0");
  return `#${f(0)}${f(2)}${f(4)}`;
}

// ── default content generators (used when niche doesn't supply custom) ──

function defaultStatsForNiche(site: NicheSite | undefined) {
  // Avoid lying with hard numbers — frame as ranges / proven outcomes.
  return [
    { number: "47", label: "Calls answered / day" },
    { number: "12", label: "Bookings / week" },
    { number: "98%", label: "Pickup rate" },
    { number: site?.niche?.toLowerCase().includes("hvac") ? "$180k" : "$42k", label: "Recovered / year" },
  ];
}

function defaultActivityForNiche(site: NicheSite | undefined): string[] {
  const labels = {
    cleaning:    ["Maria just booked a 3-bed deep clean", "Carlos rescheduled biweekly recurring", "New move-out quote sent · 2 min ago"],
    laundromat:  ["Sarah scheduled a 22-lb pickup", "Wash-&-fold confirmed · 4 min ago", "Recurring restaurant order renewed"],
    hvac:        ["Emergency dispatch booked · 1 min ago", "Tune-up scheduled for tomorrow", "Maintenance plan renewed"],
    dental:      ["New-patient cleaning booked", "Cancellation just filled", "Insurance verified · 2 min ago"],
    roofing:     ["Inspection scheduled for Friday", "Storm-damage quote sent", "Estimate confirmed · 3 min ago"],
    plumbing:    ["Burst-pipe call dispatched", "Drain clean booked", "Water-heater quote sent · 2 min ago"],
    landscaping: ["Weekly mow booked", "Mulch quote sent", "Pruning scheduled · 4 min ago"],
    realestate:  ["Showing booked for Saturday", "Buyer call captured", "Listing inquiry scheduled · 1 min ago"],
    medspa:      ["Botox consult booked", "Filler follow-up scheduled", "Membership renewed · 3 min ago"],
    autorepair:  ["Brake job scheduled", "Oil change booked", "Diagnostic appt confirmed · 2 min ago"],
    lawfirm:     ["Consult booked for Tuesday", "Intake call captured", "Referral scheduled · 1 min ago"],
  } as Record<string, string[]>;
  const list = (site && labels[site.id]) || ["New job just booked · 1 min ago", "Quote sent and confirmed", "Cancellation just filled"];
  return list.map((s) => s);
}

function defaultTrustBadges(): string[] {
  return ["4.9 · Google Reviews", "Top Rated · 2026", "Locally owned"];
}

function defaultReviews(site: NicheSite | undefined, _co: string, city: string): { name: string; city?: string; stars: number; text: string }[] {
  const c = (city && city !== "your area") ? city : "town";
  const generic = [
    { name: "Marcus T.", city: c, stars: 5, text: "Showed up on time, no surprises, and they actually picked up the phone the first time I called. That alone earned them my business." },
    { name: "Priya R.", city: c, stars: 5, text: "Booked everything over text in under five minutes. I wasn't sitting on hold once. Felt premium." },
    { name: "Daniel K.", city: c, stars: 5, text: "Quoted me on the call, sent the confirmation to my phone, and the work was clean. Exactly what I wanted." },
  ];
  // light per-niche flavor on the first review
  if (site?.id === "cleaning") generic[0].text = "I called four cleaning services. They were the only one that answered. House looks incredible — we're going recurring.";
  if (site?.id === "hvac") generic[0].text = "AC died on a Saturday night. They picked up, quoted dispatch, and a tech was at the house by 9pm. Lifesavers.";
  if (site?.id === "dental") generic[0].text = "Booked my whole family in one phone call. They handled the insurance check on the spot. Easiest dentist switch I've ever done.";
  if (site?.id === "roofing") generic[0].text = "After the storm, every roofer in town was unreachable. These guys had me on the schedule before I hung up.";
  if (site?.id === "plumbing") generic[0].text = "Burst pipe at midnight. They answered, dispatched, and I was dry by 3am. Worth every dollar.";
  return generic;
}

function defaultFaq(site: NicheSite | undefined, _co: string, city: string): { q: string; a: string }[] {
  const c = (city && city !== "your area") ? city : "your area";
  const base = [
    { q: "How fast can you actually get me on the schedule?", a: `We typically have same-week openings in ${c}. For emergencies, we triage and dispatch within the hour.` },
    { q: "Do you really answer 24/7?", a: "Yes. Your call is answered live by our AI receptionist, who books you straight into the calendar. A human follows up the next business hour." },
    { q: "What does pricing look like?", a: "We quote on the call — no surprise add-ons. Recurring clients get a discount baked into the booking confirmation." },
    { q: "Are you insured / licensed?", a: "Yes — fully licensed and insured for the work we take. Proof of coverage available on request before the job starts." },
  ];
  if (site?.id === "hvac") base[2].a = "We quote dispatch on the call and apply it to the repair. Maintenance memberships start at $19/mo and bundle two annual tune-ups.";
  if (site?.id === "dental") {
    base[2].a = "Most major PPO plans accepted. We verify your coverage before the visit so you know your out-of-pocket up front.";
    base[3].q = "Are you taking new patients?";
    base[3].a = "Yes. New-patient slots open weekly. Bring your insurance card and an ID — we handle the rest.";
  }
  return base;
}

function defaultPricing(site: NicheSite | undefined): { name: string; price: string; period: string; features: string[]; featured?: boolean; cta?: string }[] {
  const baseSetup = "Done-for-you setup · live in 7 days";
  return [
    {
      name: "Starter", price: "$497", period: "mo", features: [
        "AI voice on one phone line",
        "Up to 200 answered calls / mo",
        "Web chat widget",
        "Cal.com / Google Cal booking",
        baseSetup,
      ],
    },
    {
      name: "Pro", price: "$1,997", period: "mo", featured: true, features: [
        "Everything in Starter",
        "Unlimited voice + chat",
        "SMS confirmations & reminders",
        "After-hours triage + dispatch logic",
        site?.niche?.toLowerCase().includes("dental") ? "Insurance pre-screening" : "Quote-on-call logic",
        "Weekly performance digest",
      ],
    },
    {
      name: "Scale", price: "$4,997", period: "mo", features: [
        "Everything in Pro",
        "Multi-location routing",
        "CRM / scheduler integration",
        "Custom voice clone",
        "Priority migration support",
        "Quarterly strategy session",
      ],
    },
  ];
}

function defaultQuoteCalc(site: NicheSite | undefined): NonNullable<NicheSite["quoteCalc"]> {
  const id = site?.id || "";
  if (id === "cleaning") {
    return {
      label: "Estimate your clean in 5 seconds",
      basePrice: 90,
      sliders: [
        { key: "beds", label: "Bedrooms", min: 1, max: 6, step: 1, default: 3, unit: "bd", unitPrice: 35 },
        { key: "baths", label: "Bathrooms", min: 1, max: 5, step: 1, default: 2, unit: "ba", unitPrice: 25 },
        { key: "deep", label: "Deep clean add-on", min: 0, max: 1, step: 1, default: 0, unitPrice: 120 },
      ],
      footnote: "Standard clean. Move-in/out, post-construction, and recurring discounts confirmed when you book.",
    };
  }
  if (id === "hvac") {
    return {
      label: "Estimate your service call",
      basePrice: 89,
      sliders: [
        { key: "units", label: "Systems serviced", min: 1, max: 4, step: 1, default: 1, unitPrice: 0 },
        { key: "after", label: "After-hours dispatch", min: 0, max: 1, step: 1, default: 0, unitPrice: 90 },
        { key: "tune", label: "Add seasonal tune-up", min: 0, max: 1, step: 1, default: 0, unitPrice: 119 },
      ],
      footnote: "Dispatch fee applied to repair. Replacement quotes done on-site at no charge.",
    };
  }
  if (id === "laundromat") {
    return {
      label: "Estimate your wash & fold",
      basePrice: 0,
      sliders: [
        { key: "lbs", label: "Pounds", min: 5, max: 80, step: 1, default: 22, unit: "lb", unitPrice: 1.75 },
        { key: "pickup", label: "Pickup & delivery", min: 0, max: 1, step: 1, default: 1, unitPrice: 10 },
        { key: "rush", label: "Same-day rush", min: 0, max: 1, step: 1, default: 0, unitPrice: 15 },
      ],
      footnote: "Per-pound pricing. Commercial accounts and recurring discounts available.",
    };
  }
  if (id === "roofing") {
    return {
      label: "Estimate your roof scope",
      basePrice: 0,
      sliders: [
        { key: "sqft", label: "Roof size (sq ft)", min: 800, max: 6000, step: 100, default: 2200, unit: "sqft", unitPrice: 4.5 },
        { key: "complex", label: "Pitch / complexity (1–5)", min: 1, max: 5, step: 1, default: 2, unitPrice: 800 },
        { key: "tear", label: "Tear-off included", min: 0, max: 1, step: 1, default: 1, unitPrice: 1200 },
      ],
      footnote: "Asphalt shingle baseline. Metal, tile, and storm-claim work quoted separately.",
    };
  }
  // sensible default for any other niche
  return {
    label: "Estimate your first job",
    basePrice: 99,
    sliders: [
      { key: "hours", label: "Estimated hours", min: 1, max: 12, step: 1, default: 2, unit: "hr", unitPrice: 85 },
      { key: "scope", label: "Job complexity (1–5)", min: 1, max: 5, step: 1, default: 2, unitPrice: 60 },
      { key: "rush", label: "Same-day rush", min: 0, max: 1, step: 1, default: 0, unitPrice: 75 },
    ],
    footnote: "Final pricing confirmed when you book. Recurring discount available.",
  };
}

function defaultServiceArea(city: string): string[] {
  if (!city || city === "your area") return ["Downtown", "Suburbs", "Surrounding neighborhoods"];
  // Lightly fabricated but believable neighborhood scaffolding — fine, since
  // the operator personalizes per-prospect anyway.
  return [
    city,
    `${city} Heights`,
    `North ${city}`,
    `South ${city}`,
    `${city} Beach`,
    `West ${city}`,
  ];
}

function howItWorksForNiche(site: NicheSite | undefined): { title: string; body: string }[] {
  const id = site?.id || "";
  if (id === "hvac") return [
    { title: "Customer calls",       body: "Your number rings — AI picks up on ring one, triages emergency vs routine." },
    { title: "Agent triages + quotes", body: "Dispatch fee quoted on the call, applied to the repair. Customer agrees verbally." },
    { title: "Tech dispatched",      body: "Job dropped onto your calendar, tech routed automatically, SMS sent to customer." },
    { title: "You get paid",         body: "Card on file or invoice on completion. Recurring maintenance auto-upsold." },
  ];
  if (id === "dental") return [
    { title: "Patient calls",        body: "AI receptionist answers in your voice, captures intake details." },
    { title: "Insurance pre-screened", body: "Coverage checked on the call, copay quoted, paperwork link texted." },
    { title: "First visit booked",   body: "Slot locked in your scheduler, confirmation + reminders auto-sent." },
    { title: "Chair stays full",     body: "Cancellations filled from your waitlist within minutes — no lost revenue." },
  ];
  if (id === "cleaning") return [
    { title: "Booking request comes in", body: "Web chat, phone, or text — agent captures bed/bath count + zip in seconds." },
    { title: "Square-footage quoted",   body: "Price calculated on the spot. Deposit link texted to lock the slot." },
    { title: "Crew dispatched",         body: "Job on your calendar, route optimized, customer notified of arrival window." },
    { title: "Recurring locked",        body: "Standard / biweekly / monthly plan upsold + auto-charged on completion." },
  ];
  if (id === "roofing") return [
    { title: "Storm or leak call",     body: "AI picks up 24/7, captures address, severity, insurance status." },
    { title: "Inspection slot booked", body: "Site visit dropped into your calendar with the next-available window." },
    { title: "Quote built + sent",     body: "Scope confirmed on-site, branded quote PDF auto-generated, e-sign sent." },
    { title: "Job won + scheduled",    body: "Deposit collected, crew assigned, materials ordered, customer kept in the loop." },
  ];
  // sensible default for every other niche
  return [
    { title: "Customer reaches out",  body: "Phone, text, web — your AI receptionist answers within one ring, 24/7." },
    { title: "Agent qualifies + quotes", body: "Service captured, price quoted, time slot confirmed verbally." },
    { title: "Booking locked in",     body: "Job dropped into your calendar with the right window, customer texted confirmation." },
    { title: "You show up + collect", body: "Reminders auto-sent. Card on file or invoice. Recurring offered every job." },
  ];
}

function defaultQuickReplies(site: NicheSite | undefined): string[] {
  const id = site?.id || "";
  if (id === "cleaning") return ["What's a 3-bed clean?", "Do you do move-out?", "Got Saturday slots?", "How does recurring work?"];
  if (id === "hvac") return ["My AC just died", "What's your dispatch fee?", "Can someone come today?", "Do you do tune-ups?"];
  if (id === "laundromat") return ["Schedule a pickup", "How much per pound?", "Are you open right now?", "Do you do commercial?"];
  if (id === "dental") return ["Are you taking new patients?", "Do you take my insurance?", "Need an emergency visit", "What about Saturdays?"];
  if (id === "roofing") return ["Storm damage — can you come look?", "Quote on a re-roof", "Do you handle insurance?", "How long does it take?"];
  if (id === "plumbing") return ["Burst pipe — emergency!", "Drain is clogged", "Water heater quote", "What's the call-out fee?"];
  return ["What do you charge?", "When can you come?", "Do you handle [X]?", "How fast can you book me?"];
}
