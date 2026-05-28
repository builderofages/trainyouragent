// src/pages/admin/TemplateGallery.tsx — v186
//
// Operator-grade gallery for the niche "free website" close tool.
//
// Features (v186):
//   • Soft unlock gate (passphrase, stored in localStorage — keeps the URL
//     uncrawlable for casual visitors; not real auth — this admin tool only
//     ever runs in the founder's hands)
//   • Persistence: company / city / email / phone / unlock all survive reload
//   • Recent prospects strip (last 20, one-tap to restore)
//   • Search filter over 25 niches (name / id / chips / subhead)
//   • 4 send channels per card: DM · Email · SMS · Link, each one-click
//   • Bulk export: paste many prospect names, get back a CSV of personalized
//     links + DMs, ready to drop into outbound tools
//   • Fully mobile-responsive

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { NICHE_SITES, ACTIVE_NICHE_SITES, type NicheSite } from "@/lib/nicheSiteTemplates";
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

// Soft unlock — bundled passphrase, intentional speed bump. Override with
// VITE_TYA_ADMIN_PIN at build time if desired.
const UNLOCK_PHRASE = (import.meta.env.VITE_TYA_ADMIN_PIN as string | undefined) || "tya";
const LS_KEYS = {
  unlock: "tya.admin.unlock.v1",
  company: "tya.admin.tg.company",
  city: "tya.admin.tg.city",
  email: "tya.admin.tg.email",
  phone: "tya.admin.tg.phone",
  recent: "tya.admin.tg.recent.v1",
  stats: "tya.admin.tg.stats.v1",
  adminToken: "tya.admin.tg.admin_token",
};

type StatEvent = { kind: string; niche: string; ts: number };
const STAT_CAP = 500;
function loadStats(): StatEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEYS.stats) || "[]") as StatEvent[]; } catch { return []; }
}
function appendStat(kind: string, niche: string) {
  if (typeof window === "undefined") return;
  try {
    const next = [{ kind, niche, ts: Date.now() }, ...loadStats()].slice(0, STAT_CAP);
    localStorage.setItem(LS_KEYS.stats, JSON.stringify(next));
  } catch { /* quota / privacy mode */ }
}

type RecentProspect = { co: string; city?: string; email?: string; phone?: string; ts: number };

function lsGet(k: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; }
}
function lsSet(k: string, v: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(k, v); } catch { /* quota / privacy mode */ }
}

export default function TemplateGallery() {
  // ─── unlock gate ───────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<boolean>(() => lsGet(LS_KEYS.unlock) === "1");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === UNLOCK_PHRASE.toLowerCase()) {
      lsSet(LS_KEYS.unlock, "1");
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1800);
    }
  }

  // ─── persisted inputs ──────────────────────────────────────────────────
  const [company, setCompany] = useState<string>(() => lsGet(LS_KEYS.company));
  const [city, setCity] = useState<string>(() => lsGet(LS_KEYS.city));
  const [email, setEmail] = useState<string>(() => lsGet(LS_KEYS.email));
  const [phone, setPhone] = useState<string>(() => lsGet(LS_KEYS.phone));
  useEffect(() => { lsSet(LS_KEYS.company, company); }, [company]);
  useEffect(() => { lsSet(LS_KEYS.city, city); }, [city]);
  useEffect(() => { lsSet(LS_KEYS.email, email); }, [email]);
  useEffect(() => { lsSet(LS_KEYS.phone, phone); }, [phone]);

  // ─── recent prospects ─────────────────────────────────────────────────
  const [recent, setRecent] = useState<RecentProspect[]>(() => {
    try { return JSON.parse(lsGet(LS_KEYS.recent, "[]")) as RecentProspect[]; } catch { return []; }
  });
  function pushRecent() {
    const co = company.trim();
    if (!co) return;
    setRecent((prev) => {
      const next = [
        { co, city: city.trim() || undefined, email: email.trim() || undefined, phone: phone.trim() || undefined, ts: Date.now() },
        ...prev.filter((r) => r.co.toLowerCase() !== co.toLowerCase()),
      ].slice(0, 20);
      lsSet(LS_KEYS.recent, JSON.stringify(next));
      return next;
    });
  }
  function restoreRecent(r: RecentProspect) {
    setCompany(r.co);
    setCity(r.city || "");
    setEmail(r.email || "");
    setPhone(r.phone || "");
  }
  function clearRecent() {
    setRecent([]);
    lsSet(LS_KEYS.recent, "[]");
  }

  // ─── native Web Share availability (mobile-first) ─────────────────────
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof (navigator as { share?: unknown }).share === "function");
  }, []);

  // ─── server-side prospect tracking (ADMIN_TOKEN required) ────────────
  const [adminToken, setAdminToken] = useState<string>(() => lsGet(LS_KEYS.adminToken));
  useEffect(() => { lsSet(LS_KEYS.adminToken, adminToken); }, [adminToken]);

  type ActivityRow = {
    id: string;
    prospect_company: string;
    prospect_city: string | null;
    prospect_email: string | null;
    niche: string;
    niche_label: string | null;
    channel: string;
    sent_at: string;
    opened_at: string | null;
    booked_at: string | null;
    last_nurture_template: string | null;
    nurture_stopped_reason: string | null;
  };
  type ActivitySummary = {
    window_days: number;
    total: number;
    opened: number;
    booked: number;
    pending_nurture: number;
  };
  const [activity, setActivity] = useState<{ rows: ActivityRow[]; summary: ActivitySummary | null }>({ rows: [], summary: null });
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  async function refreshActivity() {
    if (!adminToken.trim()) return;
    setActivityLoading(true);
    setActivityError(null);
    try {
      const r = await fetch(`/api/admin/template-activity?token=${encodeURIComponent(adminToken.trim())}&limit=60&days=30`);
      const json = await r.json();
      if (!r.ok || !json.ok) { setActivityError(json.error || `http-${r.status}`); return; }
      setActivity({ rows: json.rows || [], summary: json.summary || null });
    } catch (e) {
      setActivityError((e as Error).message);
    } finally {
      setActivityLoading(false);
    }
  }
  // Auto-pull on first load (if token present) + every 60s while tab visible.
  useEffect(() => {
    if (!adminToken.trim()) return;
    refreshActivity();
    const t = setInterval(() => { if (document.visibilityState === "visible") refreshActivity(); }, 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  // Server-side log-send helper. Fire-and-forget. Silent if not configured.
  async function serverLogSend(n: NicheSite, channel: string) {
    if (!adminToken.trim()) return;
    const co = company.trim() || n.defaultCompany;
    try {
      await fetch(`/api/template-send?token=${encodeURIComponent(adminToken.trim())}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prospect_company: co,
          prospect_city:    city.trim(),
          prospect_email:   email.trim(),
          prospect_phone:   phone.trim(),
          niche:            n.id,
          niche_label:      n.niche,
          channel,
        }),
        keepalive: true,
      });
    } catch { /* never block the operator UI on logging */ }
  }

  // ─── operator weekly stats (local, last 7 days) ──────────────────────
  const [stats, setStats] = useState<StatEvent[]>(() => loadStats());
  const weekStats = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = stats.filter((s) => s.ts >= cutoff);
    const total = recent.length;
    const byKind: Record<string, number> = {};
    const byNiche: Record<string, number> = {};
    recent.forEach((s) => {
      byKind[s.kind] = (byKind[s.kind] || 0) + 1;
      byNiche[s.niche] = (byNiche[s.niche] || 0) + 1;
    });
    const topNiche = Object.entries(byNiche).sort((a, b) => b[1] - a[1])[0];
    return { total, byKind, topNiche };
  }, [stats]);
  function clearStats() {
    setStats([]);
    try { localStorage.removeItem(LS_KEYS.stats); } catch { /* noop */ }
  }

  // ─── search ───────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!q) return ACTIVE_NICHE_SITES;
    return ACTIVE_NICHE_SITES.filter(
      (n) =>
        n.niche.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.chips.some((c) => c.toLowerCase().includes(q)) ||
        n.subhead.toLowerCase().includes(q)
    );
  }, [q]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.trainyouragent.com";

  // ─── builders ─────────────────────────────────────────────────────────
  function buildUrl(id: string): string {
    const params = new URLSearchParams();
    if (company.trim()) params.set("company", company.trim());
    if (city.trim()) params.set("city", city.trim());
    const qs = params.toString();
    return `${origin}/template/${id}${qs ? `?${qs}` : ""}`;
  }
  function buildDm(n: NicheSite): string {
    const co = company.trim() || n.defaultCompany;
    const cityPart = city.trim() ? ` in ${city.trim()}` : "";
    return [
      `${co} — built you a free preview of what a 2026 ${n.niche.toLowerCase()} site looks like, with an AI phone line that answers 24/7 and books ${n.chips[0].toLowerCase()} automatically. Stops the after-hours bleed${cityPart}.`,
      "",
      `60-sec look: ${buildUrl(n.id)}`,
    ].join("\n");
  }
  function buildEmailSubject(n: NicheSite): string {
    const co = company.trim() || n.defaultCompany;
    return `Free preview site for ${co}`;
  }
  function buildEmailBody(n: NicheSite): string {
    const co = company.trim() || n.defaultCompany;
    const cityPart = city.trim() ? ` ${city.trim()}` : "";
    return [
      `Hi —`,
      ``,
      `Built a free preview of what a modern ${n.niche.toLowerCase()} site could look like for ${co}, with an AI phone line that answers 24/7 and books ${n.chips[0].toLowerCase()} automatically. ${n.painLabel.charAt(0).toUpperCase()}${n.painLabel.slice(1)} — this stops that.`,
      ``,
      `Take a look (60 sec): ${buildUrl(n.id)}`,
      ``,
      `If it's useful, happy to walk you through how we'd ship it live on your${cityPart} number in 10 days.`,
      ``,
      `— Alexander`,
      `TrainYourAgent`,
    ].join("\n");
  }

  // ─── clipboard / channel actions ──────────────────────────────────────
  const [flash, setFlash] = useState<string | null>(null); // id+"|"+kind
  function blink(id: string, kind: string) {
    setFlash(`${id}|${kind}`);
    setTimeout(() => setFlash(null), 1600);
  }
  function trackAction(kind: string, niche: string) {
    appendStat(kind, niche);
    setStats((prev) => [{ kind, niche, ts: Date.now() }, ...prev].slice(0, STAT_CAP));
  }
  async function copyText(id: string, kind: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      blink(id, kind);
      pushRecent();
      const tracked = kind === "dm" ? "dm" : kind === "link" ? "link" : kind;
      trackAction(tracked, id);
      void fireEvent("tg_copy", { kind, niche: id, company: company.trim() });
      const niche = NICHE_SITES.find((n) => n.id === id);
      if (niche) void serverLogSend(niche, tracked);
    } catch { /* clipboard blocked */ }
  }
  function openSite(id: string) {
    pushRecent();
    trackAction("open", id);
    void fireEvent("tg_open_site", { niche: id, company: company.trim() });
    const niche = NICHE_SITES.find((n) => n.id === id);
    if (niche) void serverLogSend(niche, "open");
    window.open(buildUrl(id), "_blank", "noopener");
  }
  function openEmail(n: NicheSite) {
    pushRecent();
    trackAction("email", n.id);
    void fireEvent("tg_send_email", { niche: n.id, company: company.trim() });
    void serverLogSend(n, "email");
    const to = email.trim();
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(buildEmailSubject(n))}&body=${encodeURIComponent(buildEmailBody(n))}`;
    window.location.href = url;
  }
  function openSms(n: NicheSite) {
    pushRecent();
    trackAction("sms", n.id);
    void fireEvent("tg_send_sms", { niche: n.id, company: company.trim() });
    void serverLogSend(n, "sms");
    const num = phone.trim().replace(/[^\d+]/g, "");
    const url = `sms:${num}?body=${encodeURIComponent(buildDm(n))}`;
    window.location.href = url;
  }
  async function shareNative(n: NicheSite) {
    pushRecent();
    trackAction("share", n.id);
    void fireEvent("tg_share_native", { niche: n.id, company: company.trim() });
    void serverLogSend(n, "share");
    const co = company.trim() || n.defaultCompany;
    try {
      await navigator.share({
        title: `${co} — ${n.niche}`,
        text: `Built you a free preview of what a 2026 ${n.niche.toLowerCase()} site looks like, with an AI phone line that answers 24/7.`,
        url: buildUrl(n.id),
      });
    } catch { /* user cancelled the share sheet — no-op */ }
  }

  // ─── bulk export ──────────────────────────────────────────────────────
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkNiche, setBulkNiche] = useState<string>(ACTIVE_NICHE_SITES[0]?.id || "cleaning");
  const [bulkNames, setBulkNames] = useState("");
  // Parse paste as CSV — accepts `name`, `name,email`, `name,email,phone`,
  // `name,email,phone,city`. Tabs treated as commas (Excel/Sheets paste).
  // Quoted fields supported.
  function parseCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQuote) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') { inQuote = false; }
        else { cur += c; }
      } else {
        if (c === '"') inQuote = true;
        else if (c === "," || c === "\t") { out.push(cur); cur = ""; }
        else cur += c;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  }
  type BulkRow = { co: string; em: string; ph: string; cy: string; url: string; dm: string };
  const bulkRows = useMemo<BulkRow[]>(() => {
    const lines = bulkNames.split("\n").map((s) => s.replace(/\r$/, "").trim()).filter(Boolean);
    // Skip a header row if it looks like one
    const startIdx = lines[0] && /\b(name|company|email|phone)\b/i.test(lines[0]) ? 1 : 0;
    const n = NICHE_SITES.find((x) => x.id === bulkNiche);
    if (!n) return [];
    const fallbackCity = city.trim();
    return lines.slice(startIdx).map((raw) => {
      const cols = parseCsvLine(raw);
      const co = (cols[0] || "").trim();
      const em = (cols[1] || "").trim();
      const ph = (cols[2] || "").trim();
      const cy = (cols[3] || "").trim() || fallbackCity;
      const params = new URLSearchParams();
      if (co) params.set("company", co);
      if (cy) params.set("city", cy);
      const url = `${origin}/template/${n.id}?${params.toString()}`;
      const dm = [
        `${co} — built you a free preview of what a 2026 ${n.niche.toLowerCase()} site looks like, with an AI phone line that answers 24/7 and books ${n.chips[0].toLowerCase()} automatically. Stops the after-hours bleed${cy ? ` in ${cy}` : ""}.`,
        "",
        `60-sec look: ${url}`,
      ].join("\n");
      return { co, em, ph, cy, url, dm };
    }).filter((r) => r.co);
  }, [bulkNames, bulkNiche, city, origin]);
  const bulkWithContact = useMemo(() => bulkRows.filter((r) => r.em || r.ph).length, [bulkRows]);
  function copyBulk(kind: "links" | "csv" | "dms") {
    if (bulkRows.length === 0) return;
    const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
    let text = "";
    if (kind === "links") text = bulkRows.map((r) => r.url).join("\n");
    else if (kind === "csv") text = "company,email,phone,city,url\n" + bulkRows.map((r) => `${q(r.co)},${q(r.em)},${q(r.ph)},${q(r.cy)},${r.url}`).join("\n");
    else text = bulkRows.map((r) => `--- ${r.co} ---\n${r.dm}`).join("\n\n");
    navigator.clipboard.writeText(text).then(() => blink("bulk", kind)).catch(() => {});
  }
  const [bulkQueueState, setBulkQueueState] = useState<"idle" | "firing" | "done" | "noToken">("idle");
  const [bulkQueueProgress, setBulkQueueProgress] = useState<{ sent: number; failed: number }>({ sent: 0, failed: 0 });
  async function queueAllToServer() {
    if (bulkRows.length === 0) return;
    if (!adminToken.trim()) { setBulkQueueState("noToken"); setTimeout(() => setBulkQueueState("idle"), 2400); return; }
    const niche = NICHE_SITES.find((x) => x.id === bulkNiche);
    if (!niche) return;
    setBulkQueueState("firing");
    setBulkQueueProgress({ sent: 0, failed: 0 });
    let sent = 0, failed = 0;
    // Sequential to avoid hammering the Supabase service-role; tiny stagger
    // between inserts.
    for (const r of bulkRows) {
      try {
        const res = await fetch(`/api/template-send?token=${encodeURIComponent(adminToken.trim())}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            prospect_company: r.co,
            prospect_city:    r.cy,
            prospect_email:   r.em,    // pulled from CSV column 2 if present
            prospect_phone:   r.ph,    // pulled from CSV column 3 if present
            niche:            niche.id,
            niche_label:      niche.niche,
            channel:          "bulk-queue",
          }),
          keepalive: true,
        });
        if (res.ok) sent++; else failed++;
      } catch { failed++; }
      setBulkQueueProgress({ sent, failed });
    }
    void fireEvent("tg_bulk_queue", { count: bulkRows.length, niche: niche.id });
    setBulkQueueState("done");
    refreshActivity();
    setTimeout(() => setBulkQueueState("idle"), 4000);
  }

  // ─── unlock screen ────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(180deg, #FFF8EE, #FAF6EE)", fontFamily: "'Inter Tight', system-ui, sans-serif", padding: 24 }}>
        <Helmet><title>TYA Admin</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <form onSubmit={tryUnlock} style={{ maxWidth: 360, width: "100%", background: "#fff", border: "1px solid rgba(4,44,83,0.08)", borderRadius: 20, padding: 30, boxShadow: "0 20px 60px -28px rgba(4,44,83,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#042C53" strokeWidth="2.5" /><path d="M16 8 L24 16 L16 24 L8 16 Z" fill="#042C53" /></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>TrainYourAgent</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", marginBottom: 8, ...MONO }}>ADMIN · PRIVATE</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#042C53", margin: "0 0 8px", letterSpacing: "-0.01em" }}>This area is private.</h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: "#5C6B7F", margin: "0 0 18px" }}>Enter the passphrase to continue.</p>
          <input
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            type="password"
            autoFocus
            placeholder="Passphrase"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${pinError ? "#9B2C2C" : "rgba(4,44,83,0.16)"}`, fontSize: 15, color: "#042C53", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
          />
          <button type="submit" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "#042C53", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>Unlock</button>
          {pinError && <div style={{ marginTop: 10, fontSize: 12.5, color: "#9B2C2C", textAlign: "center" }}>That's not it. Try again.</div>}
        </form>
      </div>
    );
  }

  // ─── main UI ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#0B1B2B", fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <Helmet>
        <title>Niche Site Templates — TYA Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* rail */}
      <div style={{ borderBottom: "1px solid rgba(4,44,83,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#042C53", textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#042C53" strokeWidth="2.5" /><path d="M16 8 L24 16 L16 24 L8 16 Z" fill="#042C53" /></svg>
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
            Type the prospect's business name, pick their niche, and send the link by DM, email, or SMS. They see a premium site with a working voice agent + chatbot demo — branded to them. Closes the &ldquo;what would mine look like?&rdquo; objection in one tap.
          </p>

          {/* prospect inputs */}
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, maxWidth: 980 }}>
            <Field label="Company name" value={company} setValue={setCompany} placeholder="e.g. SparkleHouse Cleaning" />
            <Field label="City" value={city} setValue={setCity} placeholder="Tampa" />
            <Field label="Email (for ✉)" value={email} setValue={setEmail} placeholder="prospect@email.com" type="email" />
            <Field label="Phone (for 💬)" value={phone} setValue={setPhone} placeholder="+1 813 555 0142" type="tel" />
            <Field label="Find a niche" value={query} setValue={setQuery} placeholder="cleaning, law, roof…" />
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: "#94A3B8" }}>
            {company.trim() ? `Links personalized to “${company.trim()}”. ` : "Leave blank to preview with sample names. "}
            {q ? `${visible.length} of ${ACTIVE_NICHE_SITES.length} niches.` : `${ACTIVE_NICHE_SITES.length} niches available.`}
            {(company || city || email || phone) && (
              <button
                onClick={() => { setCompany(""); setCity(""); setEmail(""); setPhone(""); }}
                style={{ marginLeft: 10, background: "none", border: "none", color: "#185FA5", cursor: "pointer", padding: 0, font: "inherit", textDecoration: "underline" }}
              >
                clear fields
              </button>
            )}
          </div>

          {/* weekly stats */}
          {weekStats.total > 0 && (
            <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "stretch" }}>
              <StatPill label="THIS WEEK" value={weekStats.total} sub="actions" />
              <StatPill label="DMS" value={weekStats.byKind.dm || 0} />
              <StatPill label="EMAIL" value={weekStats.byKind.email || 0} />
              <StatPill label="SMS" value={weekStats.byKind.sms || 0} />
              <StatPill label="SHARES" value={weekStats.byKind.share || 0} />
              <StatPill label="OPENS" value={weekStats.byKind.open || 0} />
              {weekStats.topNiche && (
                <StatPill label="TOP NICHE" valueText={NICHE_SITES.find(n => n.id === weekStats.topNiche![0])?.niche || weekStats.topNiche[0]} sub={`${weekStats.topNiche[1]}×`} />
              )}
              <button onClick={clearStats} title="Reset weekly stats" style={{ marginLeft: "auto", fontSize: 11, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", alignSelf: "center" }}>reset</button>
            </div>
          )}

          {/* admin token + server-side recent activity */}
          <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: "#fff", border: "1px solid rgba(4,44,83,0.1)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", ...MONO }}>SERVER ACTIVITY</span>
              <span style={{ fontSize: 12.5, color: "#5C6B7F" }}>
                {activity.summary
                  ? `Last ${activity.summary.window_days}d: ${activity.summary.total} sent · ${activity.summary.opened} opened · ${activity.summary.booked} booked · ${activity.summary.pending_nurture} pending nurture`
                  : adminToken.trim()
                    ? (activityLoading ? "Loading…" : (activityError ? `Error: ${activityError}` : "No data yet."))
                    : "Paste ADMIN_TOKEN to see server-side prospect tracking (who opened, who booked)."}
              </span>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="ADMIN_TOKEN"
                style={{ marginLeft: "auto", padding: "7px 11px", borderRadius: 9, border: "1px solid rgba(4,44,83,0.16)", fontSize: 12, color: "#042C53", outline: "none", width: 180, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              />
              <button
                onClick={refreshActivity}
                disabled={!adminToken.trim() || activityLoading}
                style={{ padding: "7px 11px", borderRadius: 9, background: "#042C53", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: adminToken.trim() && !activityLoading ? "pointer" : "not-allowed", opacity: adminToken.trim() && !activityLoading ? 1 : 0.5 }}
              >
                {activityLoading ? "…" : "Refresh"}
              </button>
            </div>
            {activity.rows.length > 0 && (
              <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid rgba(4,44,83,0.06)", borderRadius: 10, background: "#FAFBFC" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", textAlign: "left", color: "#6B7B92", fontWeight: 700 }}>
                      <th style={{ padding: "8px 10px" }}>Company</th>
                      <th style={{ padding: "8px 10px" }}>Niche</th>
                      <th style={{ padding: "8px 10px" }}>Via</th>
                      <th style={{ padding: "8px 10px" }}>Sent</th>
                      <th style={{ padding: "8px 10px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.rows.map((r) => {
                      const ago = (iso: string | null) => {
                        if (!iso) return "";
                        const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
                        if (s < 60) return "just now";
                        if (s < 3600) return `${Math.round(s / 60)}m ago`;
                        if (s < 86400) return `${Math.round(s / 3600)}h ago`;
                        return `${Math.round(s / 86400)}d ago`;
                      };
                      const status = r.booked_at
                        ? <span style={{ color: "#15724D", fontWeight: 600 }}>BOOKED · {ago(r.booked_at)}</span>
                        : r.opened_at
                          ? <span style={{ color: "#1E3A5F", fontWeight: 600 }}>OPENED · {ago(r.opened_at)}{r.last_nurture_template ? ` · ${r.last_nurture_template} sent` : ""}</span>
                          : <span style={{ color: "#94A3B8" }}>SENT{r.last_nurture_template ? ` · ${r.last_nurture_template} sent` : ""}</span>;
                      return (
                        <tr key={r.id} style={{ borderTop: "1px solid rgba(4,44,83,0.06)" }}>
                          <td style={{ padding: "8px 10px", color: "#042C53", fontWeight: 500 }}>
                            {r.prospect_company}
                            {r.prospect_city && <span style={{ color: "#94A3B8", fontWeight: 400 }}> · {r.prospect_city}</span>}
                          </td>
                          <td style={{ padding: "8px 10px", color: "#5C6B7F" }}>{r.niche_label || r.niche}</td>
                          <td style={{ padding: "8px 10px", color: "#5C6B7F", textTransform: "uppercase", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10.5, letterSpacing: "0.1em" }}>{r.channel}</td>
                          <td style={{ padding: "8px 10px", color: "#5C6B7F" }}>{ago(r.sent_at)}</td>
                          <td style={{ padding: "8px 10px" }}>{status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* recent prospects */}
          {recent.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>RECENT PROSPECTS</span>
                <button onClick={clearRecent} style={{ fontSize: 11, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>clear all</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {recent.map((r) => (
                  <button
                    key={r.co + "_" + r.ts}
                    onClick={() => restoreRecent(r)}
                    title={`Restore ${r.co}${r.city ? " · " + r.city : ""}`}
                    style={{ fontSize: 12.5, fontWeight: 500, color: "#042C53", padding: "6px 11px", borderRadius: 999, background: "#fff", border: "1px solid rgba(4,44,83,0.14)", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    {r.co}{r.city ? <span style={{ color: "#94A3B8", marginLeft: 6 }}>· {r.city}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* gallery grid */}
      <section style={{ padding: "8px 24px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {visible.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "60px 20px", textAlign: "center", color: "#5C6B7F", border: "1px dashed rgba(4,44,83,0.16)", borderRadius: 20, background: "#FAFBFC" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#042C53", marginBottom: 6 }}>No niche matches “{query}”.</div>
              <div style={{ fontSize: 13 }}>Try a broader term, or <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "#185FA5", cursor: "pointer", padding: 0, font: "inherit", textDecoration: "underline" }}>clear the search</button>.</div>
            </div>
          )}
          {visible.map((n) => {
            const dmFlash = flash === `${n.id}|dm`;
            const linkFlash = flash === `${n.id}|link`;
            return (
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
                <div style={{ padding: "18px 22px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#5C6B7F", margin: 0 }}>{n.subhead}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {n.chips.slice(0, 3).map((c) => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, color: "#042C53", padding: "4px 9px", borderRadius: 999, background: "#F1F5F9" }}>{c}</span>
                    ))}
                  </div>
                  {/* actions */}
                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, paddingTop: 6 }}>
                    <button
                      onClick={() => openSite(n.id)}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "#042C53", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}
                    >
                      Open site →
                    </button>
                    {canShare ? (
                      <button
                        onClick={() => shareNative(n)}
                        title="Open your phone's share sheet — Messages, Mail, WhatsApp, AirDrop, LinkedIn…"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: n.accent, color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2v13M12 2l-4 4M12 2l4 4M5 12v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Share via…
                      </button>
                    ) : (
                      <button
                        onClick={() => copyText(n.id, "dm", buildDm(n))}
                        title="Copy a ready-to-send LinkedIn/SMS message with the link"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: n.accent, color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}
                      >
                        {dmFlash ? "DM copied ✓" : "Copy DM"}
                      </button>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: canShare ? "repeat(4, 1fr)" : "repeat(3, 1fr)", gap: 6 }}>
                      {canShare && (
                        <ChannelBtn
                          onClick={() => copyText(n.id, "dm", buildDm(n))}
                          disabled={false}
                          title="Copy the DM text"
                          flashOk={dmFlash}
                          label={dmFlash ? "✓" : "DM"}
                          icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        />
                      )}
                      <ChannelBtn
                        onClick={() => openEmail(n)}
                        disabled={!email.trim()}
                        title={email.trim() ? `Email to ${email.trim()}` : "Add the prospect's email above to enable"}
                        flashOk={false}
                        label="Email"
                        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4v10h16V8l-8 5-8-5zm0-2 8 5 8-5H4z" /></svg>}
                      />
                      <ChannelBtn
                        onClick={() => openSms(n)}
                        disabled={false}
                        title={phone.trim() ? `SMS to ${phone.trim()}` : "Open SMS (pick recipient from your contacts)"}
                        flashOk={false}
                        label="SMS"
                        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7l-5 4V4z" /></svg>}
                      />
                      <ChannelBtn
                        onClick={() => copyText(n.id, "link", buildUrl(n.id))}
                        disabled={false}
                        title="Copy the link only (no message)"
                        flashOk={linkFlash}
                        label={linkFlash ? "✓" : "Link"}
                        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1.41 1.41M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1.41-1.41" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* bulk export */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 20, background: "#FAFBFC", overflow: "hidden" }}>
          <button
            onClick={() => setBulkOpen((v) => !v)}
            style={{ width: "100%", padding: "18px 22px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", ...MONO }}>BULK</span>
              <span style={{ display: "block", fontSize: 16, fontWeight: 600, color: "#042C53", marginTop: 4 }}>
                Paste many prospect names — get back personalized links + DMs in one shot.
              </span>
            </span>
            <span style={{ fontSize: 22, color: "#94A3B8", transform: bulkOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>+</span>
          </button>
          {bulkOpen && (
            <div style={{ padding: "0 22px 22px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>NICHE</span>
                  <select
                    value={bulkNiche}
                    onChange={(e) => setBulkNiche(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.16)", fontSize: 13.5, color: "#042C53", background: "#fff" }}
                  >
                    {ACTIVE_NICHE_SITES.map((n) => (<option key={n.id} value={n.id}>{n.niche}</option>))}
                  </select>
                </div>
                <textarea
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder={"One prospect per line. CSV columns optional:\n\ncompany,email,phone,city\n\nSparkleHouse Cleaning,owner@sparklehouse.com,+18135550142,Tampa\nFreshFold Laundry,info@freshfold.com,,St. Pete\nAcme Roofing\n\n(Excel/Sheets paste works — tabs treated as commas. Header row is optional.)"}
                  rows={10}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(4,44,83,0.16)", fontSize: 14, color: "#042C53", outline: "none", boxSizing: "border-box", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", resize: "vertical" }}
                />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>
                    OUTPUT · {bulkRows.length} ROW{bulkRows.length === 1 ? "" : "S"}
                    {bulkRows.length > 0 && (
                      <span style={{ marginLeft: 8, color: bulkWithContact > 0 ? "#15724D" : "#94A3B8" }}>
                        · {bulkWithContact} W/ CONTACT
                      </span>
                    )}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <BulkBtn onClick={() => copyBulk("links")} disabled={!bulkRows.length}>{flash === "bulk|links" ? "Copied ✓" : "Copy links"}</BulkBtn>
                    <BulkBtn onClick={() => copyBulk("csv")} disabled={!bulkRows.length}>{flash === "bulk|csv" ? "Copied ✓" : "Copy CSV"}</BulkBtn>
                    <BulkBtn onClick={() => copyBulk("dms")} disabled={!bulkRows.length}>{flash === "bulk|dms" ? "Copied ✓" : "Copy DMs"}</BulkBtn>
                    <button
                      onClick={queueAllToServer}
                      disabled={!bulkRows.length || bulkQueueState === "firing"}
                      title={adminToken.trim() ? "Log every prospect to the server so the nurture cron picks them up. You still send the DM yourself — this just primes the follow-up sequence." : "Paste ADMIN_TOKEN above first"}
                      style={{
                        padding: "7px 11px", borderRadius: 10,
                        background: !bulkRows.length || bulkQueueState === "firing" ? "#F1F5F9" : "#15724D",
                        color: !bulkRows.length || bulkQueueState === "firing" ? "#94A3B8" : "#fff",
                        fontSize: 12, fontWeight: 600, border: "none",
                        cursor: !bulkRows.length || bulkQueueState === "firing" ? "not-allowed" : "pointer",
                      }}
                    >
                      {bulkQueueState === "firing" ? `Logging ${bulkQueueProgress.sent}/${bulkRows.length}…`
                        : bulkQueueState === "done" ? `Queued ${bulkQueueProgress.sent}${bulkQueueProgress.failed ? ` (${bulkQueueProgress.failed} failed)` : ""} ✓`
                        : bulkQueueState === "noToken" ? "Need ADMIN_TOKEN"
                        : "Queue all to server"}
                    </button>
                  </div>
                </div>
                <div style={{ background: "#fff", border: "1px solid rgba(4,44,83,0.12)", borderRadius: 12, padding: 12, height: 254, overflowY: "auto", fontSize: 12.5, color: "#42526E", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {bulkRows.length === 0 && <div style={{ color: "#94A3B8", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>Paste names (or CSV) on the left to see personalized links here. Rows with an email column will get auto Day-3 + Day-7 nurture follow-ups via Resend.</div>}
                  {bulkRows.map((r, i) => (
                    <div key={`${r.co}_${i}`} style={{ marginBottom: 10, wordBreak: "break-all" }}>
                      <div style={{ color: "#042C53", fontWeight: 600 }}>
                        {r.co}
                        {r.cy && <span style={{ color: "#94A3B8", fontWeight: 400 }}> · {r.cy}</span>}
                      </div>
                      {(r.em || r.ph) && (
                        <div style={{ fontSize: 11, color: "#15724D", marginTop: 1 }}>
                          {r.em && <span>✉ {r.em}</span>}
                          {r.em && r.ph && <span style={{ color: "#94A3B8" }}> · </span>}
                          {r.ph && <span>☎ {r.ph}</span>}
                        </div>
                      )}
                      <a href={r.url} target="_blank" rel="noopener" style={{ color: "#185FA5", textDecoration: "underline", fontSize: 11.5 }}>{r.url}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── tiny presentational helpers ────────────────────────────────────────
function Field(props: { label: string; value: string; setValue: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>{props.label.toUpperCase()}</span>
      <input
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder={props.placeholder}
        type={props.type || "text"}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(4,44,83,0.16)", fontSize: 15, color: "#042C53", outline: "none", boxSizing: "border-box", background: "#fff" }}
      />
    </label>
  );
}

function ChannelBtn(props: { onClick: () => void; disabled: boolean; title: string; flashOk: boolean; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      style={{
        padding: "9px 6px", borderRadius: 10,
        background: props.flashOk ? "#15724D" : "#fff",
        color: props.flashOk ? "#fff" : (props.disabled ? "#C5CDD8" : "#042C53"),
        fontSize: 12, fontWeight: 600,
        border: `1px solid ${props.flashOk ? "#15724D" : "rgba(4,44,83,0.14)"}`,
        cursor: props.disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
      }}
    >
      <span style={{ opacity: 0.8 }}>{props.icon}</span>
      {props.label}
    </button>
  );
}

function StatPill(props: { label: string; value?: number; valueText?: string; sub?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 12, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2, minWidth: 80 }}>
      <span style={{ fontSize: 9.5, fontWeight: 700, color: "#6B7B92", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.2em" }}>{props.label}</span>
      <span style={{ fontSize: 18, fontWeight: 600, color: "#042C53", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
        {props.valueText ?? props.value}
        {props.sub && <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8", marginLeft: 6 }}>{props.sub}</span>}
      </span>
    </div>
  );
}

function BulkBtn(props: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ padding: "7px 11px", borderRadius: 10, background: props.disabled ? "#F1F5F9" : "#042C53", color: props.disabled ? "#94A3B8" : "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: props.disabled ? "not-allowed" : "pointer" }}
    >
      {props.children}
    </button>
  );
}

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
