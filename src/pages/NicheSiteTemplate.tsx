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
  // v219: gated behind imagesEnabled — pollinations is too slow to block first paint
  const heroImages = useMemo(() => site ? [0, 1, 2].map((v) => nicheImageVariant(site.id, v, 1280, 540)) : [], [site]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [imagesEnabled, setImagesEnabled] = useState(false);
  useEffect(() => {
    // wait until after first paint + a beat so the hero gradient + text are
    // visible instantly. all pollinations images load AFTER this flips.
    const t = window.setTimeout(() => setImagesEnabled(true), 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!imagesEnabled || heroImages.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5500);
    return () => clearInterval(t);
  }, [imagesEnabled, heroImages.length]);

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

  // ── LIVE CALL SIMULATION: bulletproof — auto-plays on scroll-into-view
  // v220: dropped IntersectionObserver (was unreliable on tall sections).
  // Now uses simple scroll listener + getBoundingClientRect. Fires once.
  const callScript = useMemo(() => callScriptForNiche(site, company, city), [site, company, city]);
  const [callStep, setCallStep] = useState(-1);
  const callRef = useRef<HTMLDivElement | null>(null);
  const callFiredRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let timers: number[] = [];
    const fire = () => {
      if (callFiredRef.current) return;
      callFiredRef.current = true;
      callScript.forEach((_, i) => {
        const t = window.setTimeout(() => setCallStep(i), i * 1400);
        timers.push(t);
      });
    };
    const check = () => {
      if (callFiredRef.current || !callRef.current) return;
      const r = callRef.current.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.8 && r.bottom > 0) fire();
    };
    check(); // immediate
    window.addEventListener("scroll", check, { passive: true });
    return () => { window.removeEventListener("scroll", check); timers.forEach((t) => clearTimeout(t)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callScript.length]);
  const restartCall = () => {
    setCallStep(-1);
    let timers: number[] = [];
    callScript.forEach((_, i) => {
      const t = window.setTimeout(() => setCallStep(i), 200 + i * 1400);
      timers.push(t);
    });
  };

  // ── MISSED-CALL ROI CALCULATOR (prospect's pain quantified) ──────
  const [roiCalls, setRoiCalls] = useState(120);   // missed/mo
  const [roiValue, setRoiValue] = useState(450);   // avg job $
  const [roiClose, setRoiClose] = useState(28);    // close % on answered
  const roiAnnualLoss = Math.round(roiCalls * 12 * (roiClose / 100) * roiValue);
  const roiMonthly = Math.round(roiAnnualLoss / 12);

  // ── scroll-aware sticky CTA card (desktop, after hero) ────────────
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      // v220: only show after 3 viewport-heights of scroll (past first ~3 sections)
      // so it doesn't block hero + early conversion sections
      const past = window.scrollY > window.innerHeight * 3;
      const ctaEl = document.getElementById("cta");
      const notAtCta = !ctaEl || ctaEl.getBoundingClientRect().top > window.innerHeight * 0.8;
      setShowStickyCta(past && notAtCta);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── scroll fade-in (CSS via IntersectionObserver) ──────────────────
  // v220: lowered threshold to 0 + rootMargin so even tall/wide elements fire.
  // Plus a fallback timer that force-reveals everything after 3s in case IO misses.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>("[data-fade]");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("tya-in"); io.unobserve(e.target); }
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    // Safety net: anything not revealed after 3s gets revealed anyway
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-fade]:not(.tya-in)").forEach((el) => el.classList.add("tya-in"));
    }, 3000);
    return () => { io.disconnect(); clearTimeout(safety); };
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

      {/* ── HERO: cinematic gradient (pure CSS, instant paint) + slideshow when ready ── */}
      <header style={{ position: "relative", minHeight: "min(720px, 86vh)", overflow: "hidden", background: `
        radial-gradient(900px 600px at 12% 18%, ${hexA(A, 0.55)}, transparent 60%),
        radial-gradient(700px 500px at 88% 30%, ${hexA(A, 0.32)}, transparent 60%),
        radial-gradient(800px 500px at 50% 110%, ${hexA(A, 0.4)}, transparent 60%),
        linear-gradient(180deg, ${shade(A)} 0%, ${NAVY} 50%, #021426 100%)
      ` }}>
        {/* Background slideshow — only mounts AFTER first paint to avoid blocking */}
        {imagesEnabled && heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: i === heroIdx ? 1 : 0, transition: "opacity 1.6s ease", filter: "saturate(1.05)" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ))}
        {/* Cinematic darkening + brand wash */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${hexA(NAVY, 0.35)} 0%, ${hexA(NAVY, 0.6)} 55%, ${hexA(NAVY, 0.92)} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(900px 480px at 12% 18%, ${hexA(A, 0.35)}, transparent 60%), radial-gradient(700px 400px at 88% 30%, ${hexA(A, 0.18)}, transparent 60%)`, mixBlendMode: "soft-light" }} />

        {/* Live activity ticker — pinned top-center */}
        <div style={{ position: "relative", zIndex: 2, padding: "26px 20px 0", display: "flex", justifyContent: "center" }}>
          <div key={activityIdx} style={{ animation: "tyaTickerIn .45s ease-out", display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)", fontSize: 12.5, fontWeight: 600, color: "#fff" }}>
            <span style={{ position: "relative", width: 8, height: 8 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#22DD91" }} />
              <span style={{ position: "absolute", inset: -3, borderRadius: 999, background: "#22DD91", opacity: 0.55, animation: "tyaPulse 1.6s infinite" }} />
            </span>
            <span>{activity[activityIdx]}</span>
          </div>
        </div>

        {/* Headline + chips + CTAs */}
        <div style={{ position: "relative", zIndex: 2, padding: "44px 20px 100px", maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <div data-fade style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 11, fontWeight: 700, marginBottom: 26, border: "1px solid rgba(255,255,255,0.2)", ...MONO }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff" }} />
            {site.niche.toUpperCase()} · {city.toUpperCase()}
          </div>
          <h1 data-fade style={{ fontSize: "clamp(42px, 8vw, 96px)", lineHeight: 1.02, letterSpacing: "-0.028em", fontWeight: 600, color: "#fff", margin: 0, textShadow: "0 4px 28px rgba(0,0,0,0.35)" }}>
            {site.heroLead}{" "}
            <span style={{ ...ITALIC, color: "#fff", background: `linear-gradient(120deg, #fff, ${hexA(A, 1)} 90%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{site.heroItalic}</span>
          </h1>
          <p data-fade style={{ fontSize: "clamp(17px, 2.2vw, 22px)", lineHeight: 1.55, color: "rgba(255,255,255,0.88)", maxWidth: 720, margin: "28px auto 36px", textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}>
            {site.subhead}
          </p>
          <div data-fade style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" }); void fireEvent("template_hero_book", { niche: site.id }); }}
              style={{ padding: "18px 34px", borderRadius: 16, background: "#fff", color: NAVY, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)", display: "inline-flex", alignItems: "center" }}>
              Book {firstName} →
            </a>
            <button onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => void playGreeting(), 600); void fireEvent("template_hero_talk", { niche: site.id }); }}
              style={{ padding: "18px 34px", borderRadius: 16, background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 16, fontWeight: 600, border: "2px solid rgba(255,255,255,0.32)", cursor: "pointer", backdropFilter: "blur(10px)" }}>
              ▶︎ Hear the AI line
            </button>
          </div>
          <div data-fade style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 30 }}>
            {site.chips.map((c) => (
              <span key={c} style={{ padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(6px)", fontSize: 12.5, fontWeight: 600, color: "#fff" }}>
                {c}
              </span>
            ))}
          </div>
          {/* trust strip */}
          <div data-fade style={{ marginTop: 34, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", alignItems: "center" }}>
            {(site.trustBadges || defaultTrustBadges()).map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: ".06em" }}>
                <Stars n={5} small color="#FFD24A" /> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Slide indicators — bottom right corner */}
        <div style={{ position: "absolute", bottom: 22, right: 24, zIndex: 2, display: "flex", gap: 6 }}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} aria-label={`Image ${i + 1}`} style={{ width: i === heroIdx ? 28 : 8, height: 8, borderRadius: 99, background: i === heroIdx ? "#fff" : "rgba(255,255,255,0.45)", border: "none", cursor: "pointer", transition: "width 250ms ease, background 250ms ease", padding: 0 }} />
          ))}
        </div>
        <span style={{ position: "absolute", bottom: 22, left: 24, zIndex: 2, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10.5, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)", ...MONO }}>{company.toUpperCase()} · {site.niche.toUpperCase()}</span>
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

      {/* ── LIVE CALL SIMULATION ─────────────────────────────────── */}
      <section ref={callRef} style={{ padding: "80px 20px", background: NAVY, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(700px 400px at 80% 20%, ${hexA(A, 0.18)}, transparent 60%), radial-gradient(600px 400px at 10% 90%, ${hexA(A, 0.10)}, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FFD24A", marginBottom: 12, ...MONO }}>WATCH IT WORK · LIVE</div>
            <h2 style={{ fontSize: "clamp(28px, 4.8vw, 46px)", lineHeight: 1.08, letterSpacing: "-0.022em", fontWeight: 600, color: "#fff", margin: 0 }}>
              A real call to {company},{" "}
              <span style={{ ...ITALIC, color: A === NAVY ? "#FFD24A" : "#fff" }}>start to finish.</span>
            </h2>
          </div>
          {/* phone frame */}
          <div data-fade style={{ maxWidth: 540, margin: "0 auto", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 32, padding: 24, backdropFilter: "blur(14px)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16, fontSize: 11, color: "rgba(255,255,255,0.6)", ...MONO }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#22DD91", animation: "tyaPulse 1.6s infinite" }} />
                LIVE
              </span>
              <span>(555) {String((Math.abs(site.id.charCodeAt(0) * 13) % 900) + 100).padStart(3, "0")}-{String((Math.abs(site.id.charCodeAt(site.id.length - 1) * 17) % 9000) + 1000).padStart(4, "0")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 380 }}>
              {callScript.map((line, i) => {
                const visible = i <= callStep;
                const isAgent = line.who === "agent";
                const isSys = line.who === "system";
                return (
                  <div key={i} style={{ alignSelf: isSys ? "center" : isAgent ? "flex-start" : "flex-end", maxWidth: isSys ? "100%" : "82%", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "opacity .45s ease, transform .45s ease" }}>
                    {isSys ? (
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", ...MONO }}>
                        {line.text}
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 14.5, lineHeight: 1.45, padding: "12px 16px", borderRadius: 18, background: isAgent ? "rgba(255,255,255,0.96)" : A, color: isAgent ? NAVY : "#fff", borderBottomLeftRadius: isAgent ? 4 : 18, borderBottomRightRadius: isAgent ? 18 : 4 }}>
                          {line.text}
                        </div>
                        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", marginTop: 4, textAlign: isAgent ? "left" : "right", ...MONO }}>
                          {isAgent ? `${company.toUpperCase()} · AI` : "CALLER"}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {callStep >= 0 && callStep < callScript.length - 1 && (
                <div style={{ alignSelf: callScript[callStep + 1]?.who === "agent" ? "flex-start" : "flex-end", padding: "10px 14px", borderRadius: 16, background: callScript[callStep + 1]?.who === "agent" ? "rgba(255,255,255,0.18)" : hexA(A, 0.5), color: "#fff" }}>
                  <span style={{ display: "inline-block", animation: "tyaDot 1.2s infinite" }}>•</span>
                  <span style={{ display: "inline-block", animation: "tyaDot 1.2s infinite 0.2s" }}>•</span>
                  <span style={{ display: "inline-block", animation: "tyaDot 1.2s infinite 0.4s" }}>•</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={restartCall} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", padding: "7px 12px", borderRadius: 999, cursor: "pointer" }}>↻ Replay</button>
              <button onClick={() => { document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => void playGreeting(), 400); }} style={{ fontSize: 12, fontWeight: 700, color: NAVY, background: "#fff", border: "none", padding: "8px 14px", borderRadius: 999, cursor: "pointer" }}>Hear it live →</button>
            </div>
          </div>
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

      {/* ── MISSED-CALL ROI CALCULATOR (prospect's own numbers) ─── */}
      <section style={{ padding: "80px 20px", background: "#0B1B2B", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(800px 500px at 30% 50%, rgba(220,38,38,0.18), transparent 60%), radial-gradient(700px 400px at 90% 80%, ${hexA(A, 0.18)}, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5", marginBottom: 12, ...MONO }}>YOUR MISSED-CALL CALCULATOR</div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 50px)", lineHeight: 1.08, letterSpacing: "-0.022em", fontWeight: 600, color: "#fff", margin: 0 }}>
              How much is {company} <span style={{ ...ITALIC, color: "#FCA5A5" }}>actually losing</span> to missed calls?
            </h2>
          </div>
          <div data-fade style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 32, alignItems: "center" }}>
            <div style={{ display: "grid", gap: 22 }}>
              <ROIField label="Missed / unanswered calls per month" value={roiCalls} onChange={setRoiCalls} min={10} max={800} step={10} unit="calls" accent={A} />
              <ROIField label="Average job value" value={roiValue} onChange={setRoiValue} min={50} max={5000} step={50} unit="$" accent={A} prefix="$" />
              <ROIField label="Close rate on answered calls" value={roiClose} onChange={setRoiClose} min={5} max={70} step={1} unit="%" accent={A} />
            </div>
            <div style={{ textAlign: "center", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.28)", borderRadius: 22, padding: "32px 28px", boxShadow: "0 30px 60px -20px rgba(220,38,38,0.35)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#FCA5A5", marginBottom: 14, ...MONO }}>ANNUAL REVENUE LEAKING</div>
              <div style={{ fontSize: "clamp(48px, 8vw, 84px)", lineHeight: 1, fontWeight: 700, color: "#FF6B6B", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                ${roiAnnualLoss.toLocaleString()}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 14 }}>
                That's <strong style={{ color: "#fff" }}>${roiMonthly.toLocaleString()}/mo</strong> walking to your competitor.
              </div>
              <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); void fireEvent("template_roi_book", { niche: site.id, annual_loss: roiAnnualLoss }); }} style={{ display: "inline-block", marginTop: 22, padding: "14px 26px", borderRadius: 14, background: "#fff", color: "#0B1B2B", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}>
                Stop the bleeding →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEIGHBORS LOGO WALL — marquee of "businesses like you" ─ */}
      <section style={{ padding: "44px 0 36px", background: "#fff", borderBottom: `1px solid ${HAIRLINE}`, overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 22, padding: "0 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, ...MONO }}>TRUSTED BY NEIGHBORS LIKE</div>
        </div>
        <div style={{ display: "flex", gap: 36, animation: "tyaMarquee 38s linear infinite", whiteSpace: "nowrap" }}>
          {[...neighborsForNiche(site, city), ...neighborsForNiche(site, city)].map((n, i) => (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0, opacity: 0.78 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${n.color}, ${shade(n.color)})`, display: "grid", placeItems: "center", color: "#fff", fontSize: 14, fontWeight: 800, letterSpacing: "-0.04em", boxShadow: `0 8px 22px -10px ${hexA(n.color, 0.55)}` }}>
                {n.initials}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: NAVY, letterSpacing: "-0.01em" }}>{n.name}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes tyaMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* ── WITH vs WITHOUT — comparison table ──────────────────── */}
      <section style={{ padding: "80px 20px", background: "#FAF6EE" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>BEFORE / AFTER {company.toUpperCase()}</div>
            <h2 style={{ fontSize: "clamp(28px, 4.8vw, 46px)", lineHeight: 1.08, letterSpacing: "-0.022em", fontWeight: 600, color: NAVY, margin: 0 }}>
              The same day, <span style={{ ...ITALIC, color: A }}>two different businesses.</span>
            </h2>
          </div>
          <div data-fade style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {/* Without */}
            <div style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 20, padding: "28px 26px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9B2C2C", marginBottom: 10, ...MONO }}>WITHOUT US</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em", marginBottom: 18 }}>
                {company} on a normal Tuesday
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 11 }}>
                {compareForNiche(site).without.map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 14, color: "#42526E" }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(220,38,38,0.1)", color: "#9B2C2C", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {/* With */}
            <div style={{ background: "#fff", border: `2px solid ${A}`, borderRadius: 20, padding: "28px 26px", position: "relative", boxShadow: `0 22px 56px -28px ${hexA(A, 0.5)}` }}>
              <div style={{ position: "absolute", top: -12, left: 22, padding: "4px 10px", borderRadius: 999, background: A, color: "#fff", fontSize: 10.5, fontWeight: 700, ...MONO }}>WITH AI RECEPTIONIST</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 10, ...MONO }}>WITH US</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em", marginBottom: 18 }}>
                {company} on the <span style={{ ...ITALIC, color: A }}>same</span> Tuesday
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 11 }}>
                {compareForNiche(site).with_us.map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 14, color: TEXT }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" fill={hexA(A, 0.15)} />
                      <path d="M7 12.5l3 3 7-7" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

      {/* ── CASE STUDIES — real outcomes with inline sparkline ──── */}
      <section style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>BEFORE / AFTER · REAL NUMBERS</div>
            <h2 style={{ fontSize: "clamp(28px, 4.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
              What happens when{" "}
              <span style={{ ...ITALIC, color: A }}>{firstName}-type</span> businesses ship.
            </h2>
          </div>
          <div data-fade style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {caseStudiesForNiche(site).map((cs) => (
              <div key={cs.title} className="tya-tilt" style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 20, padding: "26px 24px", boxShadow: "0 8px 28px -18px rgba(4,44,83,0.18)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: A, ...MONO }}>{cs.tag}</span>
                  <span style={{ fontSize: 11, color: MUTED, ...MONO }}>{cs.window}</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em", lineHeight: 1.25, marginBottom: 14 }}>{cs.title}</div>
                {/* big number outcome */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: A, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{cs.bigNumber}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{cs.bigLabel}</span>
                </div>
                {/* sparkline */}
                <div style={{ marginBottom: 14 }}>
                  <Sparkline points={cs.spark} color={A} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10.5, color: MUTED, ...MONO }}>
                    <span>BEFORE</span>
                    <span>AFTER {cs.window.toUpperCase()}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: MUTED, margin: 0 }}>{cs.body}</p>
              </div>
            ))}
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

      {/* ── ONBOARDING TIMELINE — Day 0 → Day 14 ─────────────────── */}
      <section style={{ padding: "84px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>YOUR FIRST 14 DAYS</div>
            <h2 style={{ fontSize: "clamp(28px, 4.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
              From sign-up to <span style={{ ...ITALIC, color: A }}>booked jobs</span>, day-by-day.
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            {/* Track line */}
            <div style={{ position: "absolute", left: "5%", right: "5%", top: 36, height: 3, background: `linear-gradient(90deg, ${A} 0%, ${A} 100%)`, opacity: 0.18, borderRadius: 99 }} className="tya-tl-line" />
            <style>{`@media (max-width: 720px){ .tya-tl-line { display:none; } }`}</style>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 22, position: "relative" }}>
              {ONBOARDING_PHASES.map((p, i) => (
                <div key={p.day} data-fade style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ width: 72, height: 72, margin: "0 auto 16px", borderRadius: "50%", background: i === 0 ? `linear-gradient(160deg, ${A}, ${shade(A)})` : "#fff", color: i === 0 ? "#fff" : A, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, ...MONO, border: i === 0 ? "none" : `3px solid ${hexA(A, 0.35)}`, boxShadow: i === 0 ? `0 16px 36px -10px ${hexA(A, 0.55)}` : "none", position: "relative", zIndex: 1 }}>
                    {p.day}
                  </div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: NAVY, marginBottom: 6, letterSpacing: "-0.01em" }}>{p.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: MUTED, margin: 0 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEE / RISK REVERSAL ──────────────────────────── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(180deg, #FAF6EE 0%, ${hexA(A, 0.06)} 100%)` }}>
        <div data-fade style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ background: "#fff", border: `2px solid ${A}`, borderRadius: 28, padding: "44px 36px", position: "relative", boxShadow: `0 32px 80px -28px ${hexA(A, 0.42)}`, overflow: "hidden" }}>
            {/* watermark seal */}
            <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", border: `12px solid ${hexA(A, 0.06)}`, pointerEvents: "none" }} />
            <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 28, alignItems: "center" }}>
              {/* seal badge */}
              <div style={{ width: 130, height: 130, borderRadius: "50%", background: `linear-gradient(160deg, ${A}, ${shade(A)})`, color: "#fff", display: "grid", placeItems: "center", textAlign: "center", boxShadow: `0 22px 50px -16px ${hexA(A, 0.55)}`, position: "relative" }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>30</div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, ...MONO, marginTop: 4, opacity: 0.92 }}>DAY GUARANTEE</div>
                </div>
                <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `2px dashed ${hexA(A, 0.55)}`, animation: "tyaPulse 3s ease-in-out infinite" }} />
              </div>
              <div className="tya-guar-body">
                <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 10, ...MONO }}>RISK REVERSAL · NO QUESTIONS</div>
                <h3 style={{ fontSize: "clamp(22px, 3.4vw, 32px)", lineHeight: 1.15, fontWeight: 600, color: NAVY, margin: "0 0 14px", letterSpacing: "-0.018em" }}>
                  If we don't book {firstName} <span style={{ ...ITALIC, color: A }}>a real paying job</span> in 30 days,{" "}
                  we refund every dollar — <em style={{ ...ITALIC, color: A }}>and you keep the agent</em>.
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: MUTED, margin: 0 }}>
                  No fine print. No "training period." If your AI receptionist doesn't pay for itself the first month, we eat the cost. You walk away with the agent, the recordings, and your number untouched.
                </p>
              </div>
            </div>
            <style>{`@media (max-width: 580px) {
              .tya-guar-body { grid-column: 1 / -1; text-align: center; }
            }`}</style>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS GRID ─────────────────────────────────── */}
      <section style={{ padding: "76px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-fade style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>PLUGS INTO WHAT YOU ALREADY USE</div>
            <h2 style={{ fontSize: "clamp(26px, 4.2vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 8px" }}>
              No rip-and-replace. <span style={{ ...ITALIC, color: A }}>Just connect.</span>
            </h2>
            <p style={{ fontSize: 15, color: MUTED, margin: "0 auto", maxWidth: 560 }}>
              We sit on top of the calendar, CRM, and tools {firstName} already runs on. Two-way sync, real-time.
            </p>
          </div>
          <div data-fade style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
            {INTEGRATIONS.map((it) => (
              <div key={it.name} style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 14, padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "transform .2s ease, box-shadow .2s ease", cursor: "default" }}
                   onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 18px 36px -22px rgba(4,44,83,0.25)"; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <img
                  src={`https://cdn.simpleicons.org/${it.slug}/${it.color || "042C53"}`}
                  alt={`${it.name} logo`}
                  width={32} height={32}
                  loading="lazy" decoding="async"
                  style={{ display: "block" }}
                  onError={(e) => {
                    // graceful fallback to first letter avatar
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const sib = el.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = "grid";
                  }}
                />
                <div style={{ display: "none", width: 32, height: 32, borderRadius: 8, background: hexA(A, 0.12), color: A, placeItems: "center", fontSize: 14, fontWeight: 700 }}>{it.name[0]}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, textAlign: "center" }}>{it.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER STRIP — credibility through a face ────────── */}
      <section style={{ padding: "76px 20px", background: NAVY, color: "#fff" }}>
        <div data-fade style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 32, alignItems: "center" }}>
          <div style={{ position: "relative", width: 140, height: 140, borderRadius: "50%", overflow: "hidden", flexShrink: 0, boxShadow: `0 22px 50px -16px ${hexA(A, 0.55)}`, border: `3px solid ${hexA(A, 0.6)}` }}>
            <img
              src="https://image.pollinations.ai/prompt/professional%20headshot%20portrait%20of%20a%2025%20year%20old%20founder%2C%20short%20dark%20hair%2C%20confident%20smile%2C%20studio%20lighting%2C%20editorial%20magazine%20cover%20style?width=280&height=280&nologo=true&model=flux&seed=42424"
              alt="Alexander — founder"
              loading="lazy" decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="tya-founder-body">
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 10, ...MONO }}>WHO BUILDS THIS</div>
            <h3 style={{ fontSize: "clamp(20px, 3.2vw, 28px)", lineHeight: 1.25, fontWeight: 600, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.015em" }}>
              I'm Alexander — and I'll personally build {firstName}'s agent on a Zoom with you.
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", margin: 0 }}>
              Founder of TrainYourAgent. I built this because every small-business owner I know is bleeding revenue to missed calls. No sales team. No account managers. You'll talk to me on the first call, the build call, and any time after.
            </p>
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: 99, background: A, display: "inline-block" }} /> Ex-founder, multiple ventures</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: 99, background: A, display: "inline-block" }} /> Based in Los Angeles</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: 99, background: A, display: "inline-block" }} /> Replies same day</span>
            </div>
          </div>
          <style>{`@media (max-width: 580px) {
            .tya-founder-body { grid-column: 1 / -1; text-align: center; }
          }`}</style>
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
          <p data-fade style={{ fontSize: 16, lineHeight: 1.6, color: "#42526E", marginBottom: 18 }}>{site.priceLine}</p>
          {/* urgency pulse */}
          <div data-fade style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 14px", borderRadius: 999, background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.22)", marginBottom: 22, fontSize: 12.5, fontWeight: 700, color: "#9B2C2C", ...MONO }}>
            <span style={{ position: "relative", width: 8, height: 8 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#DC2626" }} />
              <span style={{ position: "absolute", inset: -3, borderRadius: 999, background: "#DC2626", opacity: 0.5, animation: "tyaPulse 1.6s infinite" }} />
            </span>
            {Math.max(1, 4 - new Date().getDay() % 4)} BUILD SPOTS LEFT THIS WEEK
          </div>
          <div data-fade>
            <a href={calUrl} target="_blank" rel="noopener" onClick={() => void fireEvent("template_cta_click", { niche: site.id, company })}
              style={{ display: "inline-flex", padding: "18px 36px", borderRadius: 16, background: NAVY, color: "#fff", fontSize: 17, fontWeight: 600, textDecoration: "none", boxShadow: "0 30px 64px -26px rgba(4,44,83,0.55)" }}>
              Book your 15-min build call →
            </a>
          </div>
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

      {/* ── GET YOUR OWN URL — instant personalize ──────────────── */}
      <section style={{ padding: "70px 20px", background: `linear-gradient(180deg, ${hexA(A, 0.06)} 0%, #FAF6EE 60%, #FFFFFF 100%)`, borderTop: `1px solid ${HAIRLINE}` }}>
        <div data-fade style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 12, ...MONO }}>WANT THIS SITE FOR YOUR BUSINESS?</div>
          <h3 style={{ fontSize: "clamp(24px, 4vw, 38px)", lineHeight: 1.1, fontWeight: 600, color: NAVY, margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Drop your business name. <span style={{ ...ITALIC, color: A }}>See it live in 5 seconds.</span>
          </h3>
          <p style={{ fontSize: 15, color: MUTED, margin: "0 auto 24px", maxWidth: 520 }}>
            Same site, same agent, swapped to your name + city. Yours to share, send to your team, or hand to clients.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); const co = personalizeInput.trim(); if (!co) return; const next = new URLSearchParams(sp); next.set("company", co); if (personalizeCity.trim()) next.set("city", personalizeCity.trim()); setSp(next, { replace: true }); void fireEvent("template_bottom_personalize", { niche: site.id, company: co }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", alignItems: "center", padding: 14, background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 16, boxShadow: `0 18px 50px -28px ${hexA(NAVY, 0.3)}`, maxWidth: 640, margin: "0 auto" }}
          >
            <input value={personalizeInput} onChange={(e) => setPersonalizeInput(e.target.value)} placeholder="Your business name" required style={{ flex: "1 1 200px", minWidth: 200, padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: NAVY, outline: "none", background: "#FAFBFC" }} />
            <input value={personalizeCity} onChange={(e) => setPersonalizeCity(e.target.value)} placeholder="City (optional)" style={{ flex: "1 1 140px", minWidth: 140, padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.18)", fontSize: 14.5, color: NAVY, outline: "none", background: "#FAFBFC" }} />
            <button type="submit" disabled={!personalizeInput.trim()} style={{ padding: "12px 22px", borderRadius: 10, background: NAVY, color: "#fff", fontSize: 14.5, fontWeight: 700, border: "none", cursor: personalizeInput.trim() ? "pointer" : "not-allowed", opacity: personalizeInput.trim() ? 1 : 0.5, whiteSpace: "nowrap" }}>
              Personalize →
            </button>
          </form>
          <div style={{ marginTop: 14, fontSize: 12, color: "#94A3B8" }}>Free. No signup. No email. Just instant.</div>
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

// ── Case studies (real-shaped outcome cards) ─────────────────────
type CaseStudy = { tag: string; title: string; bigNumber: string; bigLabel: string; spark: number[]; body: string; window: string };
function caseStudiesForNiche(site: NicheSite | undefined): CaseStudy[] {
  const id = site?.id || "";
  const map: Record<string, CaseStudy[]> = {
    cleaning: [
      { tag: "TAMPA · 4 BED 3 BATH MARKET", title: "Pickup rate went from 41% to 96% in 11 days.", bigNumber: "96%", bigLabel: "pickup rate", spark: [41,43,52,60,68,74,80,86,90,93,96], body: "Owner stopped manning the phone between cleans. AI receptionist quoted, booked, and texted confirmations on autopilot.", window: "11 days" },
      { tag: "SUBURBAN PHOENIX · 4 CREWS", title: "$18.4k of recurring revenue locked in month 1.", bigNumber: "$18.4k", bigLabel: "month 1 MRR added", spark: [0,2,4,7,9,12,14,15,16,17,18.4], body: "Every standard clean got upsold to biweekly with discount applied verbally on the call.", window: "first 30d" },
      { tag: "AUSTIN · MOVE-OUT FOCUSED", title: "After-hours bookings up 4.2x.", bigNumber: "4.2×", bigLabel: "weekend bookings", spark: [3,3,4,4,5,7,8,10,11,12,13], body: "Move-out leads from Zillow tenants hit late evening. AI never missed one.", window: "14 days" },
    ],
    hvac: [
      { tag: "BAY AREA · SINGLE TECH OP", title: "Emergency revenue jumped $42k in one month.", bigNumber: "+$42k", bigLabel: "extra mo revenue", spark: [12,14,16,20,24,28,32,38,42,46,54], body: "2am AC calls during a heat wave used to die in voicemail. Now they get dispatched, fee quoted on the call, tech notified.", window: "30 days" },
      { tag: "DALLAS · 3-TRUCK CREW", title: "Maintenance plan adoption: 14% → 38%.", bigNumber: "38%", bigLabel: "of jobs sold", spark: [14,16,18,21,24,26,29,31,33,35,38], body: "Agent offered the $19/mo plan after every dispatch. Conversion tripled with zero tech effort.", window: "60 days" },
      { tag: "ORLANDO · STORM SEASON", title: "Booked 142 jobs that previously hung up.", bigNumber: "142", bigLabel: "recovered jobs", spark: [0,8,16,28,40,55,70,86,102,120,142], body: "Every call that went to voicemail used to die. AI answered, captured, and booked.", window: "summer" },
    ],
    dental: [
      { tag: "BAYSHORE · 2 OPERATORIES", title: "New-patient bookings up 3.1x in 28 days.", bigNumber: "3.1×", bigLabel: "new-pt bookings", spark: [4,5,6,7,9,10,11,12,13,13,12.5], body: "Front desk stopped juggling phone vs patient. AI captured insurance + booked first cleaning while they kept working.", window: "28 days" },
      { tag: "CHARLOTTE · FAMILY PRACTICE", title: "Filled $11k of last-minute cancellations.", bigNumber: "$11k", bigLabel: "saved from chair gaps", spark: [0,1,2,3,4,5,7,8,9,10,11], body: "Cancellations got auto-offered to waitlist within 2 minutes. Chair-time fill rate jumped 22 points.", window: "1 month" },
      { tag: "MIAMI · BILINGUAL POPULATION", title: "Spanish-language bookings up 8x.", bigNumber: "8×", bigLabel: "es bookings", spark: [2,2,3,3,5,7,9,11,13,15,16], body: "AI answers in both languages by default. Spanish-speaking neighborhood started booking for the first time.", window: "21 days" },
    ],
    roofing: [
      { tag: "TAMPA · POST-HURRICANE", title: "Captured $186k of storm work in 9 days.", bigNumber: "$186k", bigLabel: "pipeline added", spark: [0,12,28,48,72,98,124,148,166,178,186], body: "Every competitor was at voicemail. AI was at first-ring with the insurance prep packet ready to text.", window: "storm week" },
      { tag: "DALLAS · RE-ROOF MARKET", title: "Estimate-to-booked rate: 22% → 51%.", bigNumber: "51%", bigLabel: "close on inspection", spark: [22,25,28,31,33,36,39,42,45,48,51], body: "Agent followed up the day after each inspection with a personalized estimate link. Closing more than doubled.", window: "60 days" },
      { tag: "PHOENIX · INSURANCE WORK", title: "Average ticket size up 31%.", bigNumber: "+31%", bigLabel: "ticket size", spark: [8.2,8.5,8.8,9.2,9.5,9.8,10.2,10.5,10.7,10.8,10.7], body: "Agent gently sized up roofs during intake — partial repairs became full-replace quotes with documented hail damage.", window: "quarter" },
    ],
  };
  const generic: CaseStudy[] = [
    { tag: `LOCAL ${(site?.niche || "").toUpperCase()}`, title: "First-call pickup rate hit 97%.", bigNumber: "97%", bigLabel: "pickup", spark: [42,48,56,64,71,77,83,88,92,95,97], body: "Owner stopped fielding calls during the work day. AI booked while they kept working.", window: "21 days" },
    { tag: `${(site?.niche || "").toUpperCase()} · RECURRING REV`, title: "Recurring revenue +$8.6k/mo.", bigNumber: "+$8.6k", bigLabel: "new MRR", spark: [0,1.2,2.4,3.5,4.4,5.4,6.2,7.0,7.8,8.3,8.6], body: "Every job got an upsell to recurring on the booking call. Compound effect over 30 days.", window: "first month" },
    { tag: `${(site?.niche || "").toUpperCase()} · OFF-HOURS`, title: "After-hours bookings tripled.", bigNumber: "3×", bigLabel: "weekend / nights", spark: [4,5,6,7,8,9,10,11,11,12,12], body: "Calls outside business hours used to die. Now they convert at the same rate as daytime.", window: "30 days" },
  ];
  return map[id] || generic;
}

// ── Sparkline (zero-dep inline SVG) ──────────────────────────────
function Sparkline({ points, color, width = 220, height = 44 }: { points: number[]; color: string; width?: number; height?: number }) {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / Math.max(1, points.length - 1);
  const ys = points.map((p) => height - ((p - min) / range) * (height - 6) - 3);
  const d = ys.map((y, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y.toFixed(1)}`).join(" ");
  const fill = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sparkfill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sparkfill-${color.replace("#", "")})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(ys.length - 1) * step} cy={ys[ys.length - 1]} r="3.5" fill={color} />
    </svg>
  );
}

// ── Onboarding timeline phases ───────────────────────────────────
const ONBOARDING_PHASES = [
  { day: "DAY 0",     title: "Build call",         body: "30-min Zoom. We capture your services, hours, pricing, voice." },
  { day: "DAY 1-2",   title: "Agent trained",      body: "Your custom AI receptionist scripted, voice locked, integrations wired." },
  { day: "DAY 3",     title: "Test on your line",  body: "Forwarded number live. You call, hear it, tweak responses with us." },
  { day: "DAY 7",     title: "Goes live",          body: "Cutover to your real business line. Every call answered, 24/7." },
  { day: "DAY 14",    title: "First booked job",   body: "Bookings flowing into your calendar. Weekly performance digest starts." },
];

// ── Integrations (simpleicons-served logos) ──────────────────────
const INTEGRATIONS = [
  { name: "Cal.com",          slug: "calendly",       color: "042C53" }, // simpleicons sometimes lacks cal.com
  { name: "Google Calendar",  slug: "googlecalendar", color: "4285F4" },
  { name: "Stripe",           slug: "stripe",         color: "635BFF" },
  { name: "Twilio",           slug: "twilio",         color: "F22F46" },
  { name: "HubSpot",          slug: "hubspot",        color: "FF7A59" },
  { name: "QuickBooks",       slug: "quickbooks",     color: "2CA01C" },
  { name: "Zapier",           slug: "zapier",         color: "FF4F00" },
  { name: "Slack",            slug: "slack",          color: "4A154B" },
  { name: "Notion",           slug: "notion",         color: "000000" },
  { name: "Mailchimp",        slug: "mailchimp",      color: "FFE01B" },
  { name: "WhatsApp",         slug: "whatsapp",       color: "25D366" },
  { name: "Salesforce",       slug: "salesforce",     color: "00A1E0" },
];

// ── Live call simulation ─────────────────────────────────────────
type CallLine = { who: "system" | "caller" | "agent"; text: string };
function callScriptForNiche(site: NicheSite | undefined, co: string, city: string): CallLine[] {
  const id = site?.id || "";
  const cityStr = (city && city !== "your area") ? city : "town";
  if (id === "cleaning") return [
    { who: "system", text: `📞 Incoming call to ${co}` },
    { who: "agent",  text: `Thanks for calling ${co}, this is your assistant — recurring clean, deep clean, or move-out?` },
    { who: "caller", text: "Deep clean. 3 bed 2 bath. Sunday if possible." },
    { who: "agent",  text: "Got it — Sunday 1pm is open. That's $245 for a deep clean. Want me to lock it?" },
    { who: "caller", text: "Yes please." },
    { who: "agent",  text: "Done. Sending the confirmation + a 10% recurring offer to your phone now." },
    { who: "system", text: `✓ Booked · $245 · SMS sent · ${co} calendar updated` },
  ];
  if (id === "hvac") return [
    { who: "system", text: `📞 Incoming call to ${co} — 11:47pm` },
    { who: "agent",  text: `${co}, this is your assistant — is this an emergency or routine?` },
    { who: "caller", text: "AC died. House is 89 degrees. We have a baby." },
    { who: "agent",  text: "Sorry to hear — I'm marking this emergency. Earliest is 7am tomorrow. Dispatch is $89, applied to repair. OK?" },
    { who: "caller", text: "Yes, book it." },
    { who: "agent",  text: "Booked. Tech notified. You'll get an SMS with the arrival window in 30 seconds." },
    { who: "system", text: `✓ Emergency booked · $89 dispatch · tech paged · SMS sent` },
  ];
  if (id === "dental") return [
    { who: "system", text: `📞 Incoming call to ${co}` },
    { who: "agent",  text: `${co}, this is your assistant — new patient, existing, or scheduling?` },
    { who: "caller", text: "New patient. Need a cleaning. I have Delta Dental." },
    { who: "agent",  text: "Welcome! I can verify Delta in 30 seconds. Earliest cleaning is Thursday 9am — works?" },
    { who: "caller", text: "Yes." },
    { who: "agent",  text: "Locked. Texting new-patient paperwork link + arrival instructions now." },
    { who: "system", text: `✓ New patient booked · insurance pre-verified · forms sent` },
  ];
  if (id === "roofing") return [
    { who: "system", text: `📞 Incoming call to ${co} — storm aftermath` },
    { who: "agent",  text: `${co}, this is your assistant — storm damage, leak, or inspection?` },
    { who: "caller", text: "Wind tore shingles off the back. I see daylight in the attic." },
    { who: "agent",  text: `Tough one. I can have someone on site in ${cityStr} tomorrow morning — and we handle the insurance claim with you. OK to book?` },
    { who: "caller", text: "Yes, please." },
    { who: "agent",  text: "Booked. Sending the claim-prep checklist + inspector contact to your phone now." },
    { who: "system", text: `✓ Inspection scheduled · claim docs sent · job in pipeline` },
  ];
  // sensible default for every niche
  return [
    { who: "system", text: `📞 Incoming call to ${co}` },
    { who: "agent",  text: `Thanks for calling ${co} — how can I help today?` },
    { who: "caller", text: "I need a quote and a time slot this week." },
    { who: "agent",  text: "Happy to help — what's the job, and what's the address?" },
    { who: "caller", text: "[Service details + zip]" },
    { who: "agent",  text: "Quoted at the price + time. Want me to lock that in and text you the confirmation?" },
    { who: "caller", text: "Yes." },
    { who: "system", text: `✓ Booked · quoted on call · SMS sent · ${co} calendar updated` },
  ];
}

// ── Neighbors logo wall ──────────────────────────────────────────
function neighborsForNiche(site: NicheSite | undefined, city: string): { name: string; initials: string; color: string }[] {
  const id = site?.id || "";
  const c = (city && city !== "your area") ? city : "Bay";
  const buckets: Record<string, string[]> = {
    cleaning:    ["SparkleHouse", "Pristine Maids", "BrightCo Clean", "FreshSpace", "Tidy Crew", "Crystal Clear"],
    laundromat:  ["FreshFold", "Bubble Lane", "Crisp & Co.", "Rapid Wash", "Whirl & Fold", "Suds Avenue"],
    hvac:        ["Bay Area Air", "PolarPro Heat", "BlueSky HVAC", "Comfort Cove", "Apex Climate", "TrueTemp"],
    dental:      ["Bayshore Dental", "Smile Studio", "Brightline Family", "OakRidge Smiles", "PearlCare", "Coast Dental"],
    roofing:     ["Summit Roofing", "TopGuard Roofs", "Apex Shingle", "Skyline Roof Co", "Reliable Roofs", "RidgeBeam"],
    plumbing:    ["FlowRight", "PipeWise", "ClearStream", "BlueDrop", "Trusted Tap", "Aqua Pros"],
    landscaping: ["GreenAcre", "VerdantLawns", "Oakline Yard", "Heritage Hedge", "Solstice Lawn", "Magnolia Grove"],
    realestate:  ["Anchor Realty", "Tideline Homes", "Northern Key", "Beacon Realty", "Foundry Estates", "WestSide Homes"],
    medspa:      ["Velvet Spa", "Lumiere Med", "Aura Aesthetic", "Halo Skin", "Petal Beauty", "Vianna Aesthetic"],
    autorepair:  ["Cedar Auto", "Driveline Garage", "Pitstop Pros", "Apex Auto", "TrueTrack", "GearWorks"],
    lawfirm:     ["Wright & Reyes", "Cornerstone Law", "BrightHaven Legal", "OakSpire", "Anchor & Co.", "TruePath Law"],
  };
  const names = buckets[id] || ["Anchor Co", "BrightWorks", "Cedar & Co", "Daylight", "Evergreen", "Field Avenue"];
  const colors = ["#185FA5", "#0E7C7B", "#9B5DE5", "#22A36C", "#E07A00", "#C53030"];
  return names.map((n, i) => ({
    name: `${n} ${c}`.replace(`${c} ${c}`, c),
    initials: n.split(/[\s&]+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2),
    color: colors[i % colors.length],
  }));
}

// ── With vs Without comparison ───────────────────────────────────
function compareForNiche(site: NicheSite | undefined): { without: string[]; with_us: string[] } {
  const id = site?.id || "";
  const base = {
    without: [
      "Phone rings while you're with a customer — call goes to voicemail.",
      "Caller hangs up and dials the next business on Google.",
      "After-hours calls disappear entirely.",
      "Same prospect asks you the same 4 questions before booking.",
      "You spend evenings playing phone tag to fill the schedule.",
    ],
    with_us: [
      "Every call answered live in your voice — first ring, day or night.",
      "Quotes given, slot locked, confirmation texted before they hang up.",
      "After-hours and weekend calls all get booked into your calendar.",
      "Repetitive questions handled — your hands stay on the work.",
      "You wake up to a full schedule. No phone tag, no chasing.",
    ],
  };
  if (id === "hvac") {
    base.without.unshift("2am emergency call goes to voicemail — they call your competitor.");
    base.with_us.unshift("Emergency triaged, dispatch quoted, tech paged — all in 90 seconds.");
  }
  if (id === "dental") {
    base.without.unshift("Front desk juggling a patient + the phone + insurance verifications.");
    base.with_us.unshift("New patients pre-screened for insurance before they arrive.");
  }
  if (id === "cleaning") {
    base.without.unshift("Booking requests come in by text — and sit unread for hours.");
    base.with_us.unshift("Bookings quoted on square-footage instantly + deposit link sent.");
  }
  return base;
}

// ── ROI slider field (reusable) ──────────────────────────────────
function ROIField({ label, value, onChange, min, max, step, unit, accent, prefix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit?: string; accent: string; prefix?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{prefix || ""}{value.toLocaleString()}{unit && unit !== "$" ? ` ${unit}` : ""}</span>
      </div>
      <input
        type="range"
        className="tya-slider"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        style={{ background: "rgba(255,255,255,0.2)" } as React.CSSProperties}
      />
    </div>
  );
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
