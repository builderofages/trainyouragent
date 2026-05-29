// src/pages/HQ.tsx — v181
//
// Unified TrainYourAgent operations dashboard (modules 2 + 3 of the build).
// One branded surface that merges the three ventures (TYA HQ + TYA bot + Ghost
// agency) into a single ops cockpit, in the website's brand (cream/navy/Playfair).
//
// Auth: shared-password gate via ?token= checked against VITE_ADMIN_TOKEN
// (same scheme as /admin — server endpoints re-check x-admin-token, so the
// client gate is convenience, not the security boundary). Per-person RBAC is a
// future upgrade; this ships a working cockpit today.
//
// Sections (in-page tabs):
//   • Overview   — live KPIs from /api/admin/metrics + /api/github-velocity + /api/health
//   • Leads      — federated leads from /api/admin/leads (TYA HQ + bot + Ghost in one feed)
//   • Niche Sites— the v180 template engine, browse + personalize + copy links
//   • Outreach   — compliant cold-email composer (CAN-SPAM/GDPR guardrails baked in)
//   • Ventures   — quick links to the three businesses + key external tools

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { NICHE_SITES } from "@/lib/nicheSiteTemplates";

const ADMIN_TOKEN: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_ADMIN_TOKEN) || "";

const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };

type Tab = "overview" | "leads" | "sites" | "outreach" | "ventures";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "leads", label: "Leads" },
  { id: "sites", label: "Niche Sites" },
  { id: "outreach", label: "Outreach" },
  { id: "ventures", label: "Ventures" },
];

export default function HQ() {
  const [tab, setTab] = useState<Tab>("overview");
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");

  // read ?token= once + load fonts
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;1,500&display=swap";
      document.head.appendChild(l);
    }
    const t = new URLSearchParams(window.location.search).get("token") || "";
    if (t && ADMIN_TOKEN && t === ADMIN_TOKEN) { setToken(t); setAuthed(true); }
  }, []);

  function tryUnlock() {
    if (ADMIN_TOKEN && pwInput === ADMIN_TOKEN) {
      setToken(pwInput); setAuthed(true);
      const u = new URL(window.location.href); u.searchParams.set("token", pwInput);
      window.history.replaceState({}, "", u.toString());
    } else {
      alert("Wrong password (must match VITE_ADMIN_TOKEN).");
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(180deg,#FFF8EE,#FAF6EE)", fontFamily: "'Inter Tight',system-ui,sans-serif", padding: 24 }}>
        <div style={{ width: 380, maxWidth: "92vw", background: "#fff", border: "1px solid rgba(4,44,83,0.1)", borderRadius: 20, padding: 30, boxShadow: "0 24px 60px -30px rgba(4,44,83,0.35)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <svg width="24" height="24" viewBox="0 0 32 32"><path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#042C53" strokeWidth="2.5" /><path d="M16 8 L24 16 L16 24 L8 16 Z" fill="#042C53" /></svg>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#042C53" }}>TrainYourAgent HQ</span>
          </div>
          <p style={{ fontSize: 13.5, color: "#5C6B7F", marginBottom: 16, lineHeight: 1.5 }}>Internal operations cockpit. Enter the admin password (your <code style={{ ...MONO, fontSize: 12 }}>ADMIN_TOKEN</code>).</p>
          <input
            type="password" value={pwInput} onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
            placeholder="Admin password"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(4,44,83,0.16)", fontSize: 15, marginBottom: 12, outline: "none", boxSizing: "border-box" }}
          />
          <button onClick={tryUnlock} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#042C53", color: "#fff", fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer" }}>Unlock HQ →</button>
          {!ADMIN_TOKEN && <p style={{ fontSize: 11.5, color: "#C53030", marginTop: 12 }}>VITE_ADMIN_TOKEN isn't set in this build — no password will work until it's configured in Vercel.</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFBFC", color: "#0B1B2B", fontFamily: "'Inter Tight',system-ui,-apple-system,sans-serif" }}>
      <Helmet><title>TYA HQ — Operations</title><meta name="robots" content="noindex, nofollow" /></Helmet>

      {/* top rail */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(4,44,83,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, color: "#042C53", textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 32 32"><path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke="#042C53" strokeWidth="2.5" /><path d="M16 8 L24 16 L16 24 L8 16 Z" fill="#042C53" /></svg>
            <span style={{ fontSize: 15, fontWeight: 700 }}>TYA HQ</span>
          </Link>
          <nav style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: 8 }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600,
                  background: tab === t.id ? "#042C53" : "transparent", color: tab === t.id ? "#fff" : "#42526E" }}>
                {t.label}
              </button>
            ))}
          </nav>
          <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#94A3B8", ...MONO }}>LIVE</span>
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        {tab === "overview" && <Overview token={token} />}
        {tab === "leads" && <Leads token={token} />}
        {tab === "sites" && <Sites />}
        {tab === "outreach" && <Outreach />}
        {tab === "ventures" && <Ventures />}
      </main>
    </div>
  );
}

// ── OVERVIEW ────────────────────────────────────────────────────────────────
function Overview({ token }: { token: string }) {
  const [m, setM] = useState<any>(null);
  const [gh, setGh] = useState<any>(null);
  const [health, setHealth] = useState<string>("checking…");
  // v206 — autopilot tile data
  const [ap, setAp] = useState<{ rows: any[]; summary: any } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/metrics?token=${encodeURIComponent(token)}`, { headers: { "x-admin-token": token }, cache: "no-store" })
      .then((r) => r.json()).then((d) => setM(d?.data || null)).catch(() => {});
    fetch("/api/github-velocity").then((r) => r.json()).then(setGh).catch(() => {});
    fetch("/api/health", { cache: "no-store" }).then((r) => setHealth(r.ok ? "operational" : "degraded")).catch(() => setHealth("unreachable"));
    fetch(`/api/admin/template-activity?token=${encodeURIComponent(token)}&days=7&limit=20`).then((r) => r.json()).then((d) => setAp(d?.ok ? d : null)).catch(() => {});
  }, [token]);

  const cards = [
    { label: "Leads · 7d", value: m?.leads7d ?? m?.leads?.["7d"] ?? "—" },
    { label: "Leads · 30d", value: m?.leads30d ?? m?.leads?.["30d"] ?? "—" },
    { label: "Bookings · 7d", value: m?.bookings7d ?? m?.bookings ?? "—" },
    { label: "Purchases · 30d", value: m?.purchases30d ?? m?.purchases ?? "—" },
    { label: "Public commits", value: gh?.totalCommits ?? gh?.total ?? "—" },
    { label: "Site health", value: health },
    { label: "Autopilot · 7d sent", value: ap?.summary?.total ?? "—" },
    { label: "Autopilot · 7d booked", value: ap?.summary?.booked ?? "—" },
  ];

  return (
    <div>
      <SectionHead eyebrow="OPERATIONS" title="Everything, " italic="one glance." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginTop: 8 }}>
        {cards.map((c) => (
          <div key={c.label} style={card()}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, ...MONO }}>{c.label.toUpperCase()}</div>
            <div style={{ fontSize: 34, fontWeight: 600, color: "#042C53", marginTop: 8, letterSpacing: "-0.02em", fontFamily: "'Playfair Display',serif" }}>{String(c.value)}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 18 }}>
        Lead + booking + purchase numbers are live from the federated lead store (TYA HQ, TYA bot, and Ghost all write here). Commits are live from the public GitHub repo. Zeros are real — no fake baselines.
      </p>
    </div>
  );
}

// ── LEADS ───────────────────────────────────────────────────────────────────
function Leads({ token }: { token: string }) {
  const [leads, setLeads] = useState<any[] | null>(null);
  const [err, setErr] = useState("");
  const [venture, setVenture] = useState<string>("all");

  useEffect(() => {
    fetch(`/api/admin/leads?token=${encodeURIComponent(token)}&limit=100`, { headers: { "x-admin-token": token }, cache: "no-store" })
      .then((r) => r.json()).then((d) => { if (d?.ok) setLeads(d.data || []); else setErr(d?.error || "failed"); })
      .catch((e) => setErr(String(e)));
  }, [token]);

  const ventures = useMemo(() => {
    const set = new Set<string>();
    (leads || []).forEach((l) => set.add(l.venture || "trainyouragent"));
    return ["all", ...Array.from(set)];
  }, [leads]);

  const rows = (leads || []).filter((l) => venture === "all" || (l.venture || "trainyouragent") === venture);

  return (
    <div>
      <SectionHead eyebrow="FEDERATED PIPELINE" title="Every lead, " italic="every venture." />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {ventures.map((v) => (
          <button key={v} onClick={() => setVenture(v)} style={{ padding: "7px 13px", borderRadius: 999, border: "1px solid rgba(4,44,83,0.12)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, background: venture === v ? "#042C53" : "#fff", color: venture === v ? "#fff" : "#42526E" }}>{v}</button>
        ))}
      </div>
      {err && <div style={{ ...card(), color: "#9B2C2C", fontSize: 13.5 }}>Couldn't load leads ({err}). Make sure ADMIN_TOKEN matches and there are leads in the store.</div>}
      {!err && leads === null && <div style={{ ...card(), color: "#94A3B8" }}>Loading leads…</div>}
      {!err && leads && rows.length === 0 && <div style={{ ...card(), color: "#5C6B7F" }}>No leads yet for this filter. They'll appear here the moment a form, chat, or voice capture fires — across all three ventures.</div>}
      {rows.length > 0 && (
        <div style={{ ...card(), padding: 0, overflow: "hidden" }}>
          {rows.map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, padding: "13px 18px", borderTop: i ? "1px solid rgba(4,44,83,0.06)" : "none", fontSize: 13.5 }}>
              <span style={{ fontWeight: 600, color: "#042C53" }}>{l.email || l.emailHash || "—"}</span>
              <span style={{ color: "#5C6B7F" }}>{l.source || "—"}</span>
              <span style={{ color: "#94A3B8", ...MONO, fontSize: 11 }}>{(l.venture || "TYA").toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NICHE SITES ───────────────────────────────────────────────────────────────
function Sites() {
  return (
    <div>
      <SectionHead eyebrow="FREE-WEBSITE CLOSE TOOL" title="Hand a prospect " italic="their site." />
      <p style={{ fontSize: 14.5, color: "#42526E", maxWidth: 640, marginBottom: 20 }}>{NICHE_SITES.length} premium niche templates with built-in voice + chat demos. Open the full customizer to personalize by company name and copy a send-ready link.</p>
      <Link to="/admin/templates" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 12, background: "#042C53", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", marginBottom: 24 }}>Open template customizer →</Link>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        {NICHE_SITES.map((n) => (
          <a key={n.id} href={`/template/${n.id}`} target="_blank" rel="noopener" style={{ ...card(), textDecoration: "none", display: "block", padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg, ${n.accent}33, ${n.accent}10)` }}>
              <img
                src={`https://image.pollinations.ai/prompt/${encodeURIComponent("professional photograph, " + n.niche.toLowerCase() + " business, magazine cover editorial")}?width=480&height=270&nologo=true&model=flux&seed=${Math.abs(n.id.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)) % 999999}`}
                alt={n.niche}
                loading="lazy" decoding="async"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(4,44,83,0.5) 100%)" }} />
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>{n.niche}</div>
              <div style={{ fontSize: 12, color: "#185FA5", marginTop: 4 }}>/template/{n.id} →</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── OUTREACH (module 3: compliant cold email) ──────────────────────────────
function Outreach() {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [niche, setNiche] = useState(NICHE_SITES[0].id);
  const [copied, setCopied] = useState(false);

  const site = NICHE_SITES.find((n) => n.id === niche)!;
  const firstName = contact.trim().split(" ")[0] || "there";
  const co = company.trim() || "your business";
  const templateUrl = `https://www.trainyouragent.com/template/${niche}?company=${encodeURIComponent(company.trim() || site.defaultCompany)}`;

  const email = `Subject: a question about ${co}'s missed calls

Hi ${firstName},

I build AI phone + chat agents for ${site.niche.toLowerCase()} businesses — they answer every call, book jobs, and quote on the spot, 24/7.

I actually mocked up what one would look like for ${co}:
${templateUrl}

If catching the calls you're currently missing is worth a 15-minute look, here's my calendar: https://cal.com/trainyouragent/30min

If not, no worries at all — just reply "no thanks" and I won't follow up.

Alexander Mills
Founder, TrainYourAgent
Tampa Bay, FL · alexander@trainyouragent.com
Reply STOP or "unsubscribe" to opt out. TrainYourAgent LLC, Tampa Bay, FL.`;

  return (
    <div>
      <SectionHead eyebrow="OUTREACH · COMPLIANT BY DESIGN" title="Cold email that " italic="stays legal." />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,1fr) minmax(300px,1.2fr)", gap: 20, alignItems: "start" }}>
        {/* composer inputs + compliance */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <Field label="PROSPECT COMPANY"><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="SparkleHouse Cleaning" style={inp()} /></Field>
            <Field label="CONTACT NAME"><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Maria" style={inp()} /></Field>
            <Field label="NICHE">
              <select value={niche} onChange={(e) => setNiche(e.target.value)} style={inp()}>
                {NICHE_SITES.map((n) => <option key={n.id} value={n.id}>{n.niche}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ ...card(), background: "#F0FBF6", border: "1px solid rgba(34,163,108,0.2)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#15724D", marginBottom: 10, ...MONO }}>COMPLIANCE CHECKLIST (CAN-SPAM + GDPR)</div>
            {[
              "Real sender identity (name + company)",
              "Physical postal address in footer",
              "Clear, honest subject line — no deception",
              "One-click opt-out (STOP / unsubscribe)",
              "Honor opt-outs within 10 business days",
              "B2B role inboxes only — no scraped personal emails",
            ].map((c) => (
              <div key={c} style={{ display: "flex", gap: 8, fontSize: 13, color: "#0B1B2B", padding: "3px 0" }}>
                <span style={{ color: "#22A36C" }}>✓</span> {c}
              </div>
            ))}
            <p style={{ fontSize: 11.5, color: "#5C6B7F", marginTop: 10, lineHeight: 1.5 }}>This template bakes in the legal requirements, but I'm not a lawyer — have counsel bless your suppression-list process before sending at volume, especially to EU/CA recipients.</p>
          </div>
        </div>
        {/* generated email */}
        <div>
          <div style={{ ...card(), padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(4,44,83,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", ...MONO }}>GENERATED · READY TO SEND</span>
              <button onClick={() => { navigator.clipboard?.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
                style={{ padding: "6px 12px", borderRadius: 8, background: "#042C53", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                {copied ? "Copied ✓" : "Copy email"}
              </button>
            </div>
            <pre style={{ margin: 0, padding: "18px 18px", fontSize: 13, lineHeight: 1.6, color: "#0B1B2B", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "ui-monospace,Menlo,monospace" }}>{email}</pre>
          </div>
          <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 12, lineHeight: 1.5 }}>
            Sending: paste into your sequencer (Apollo, Instantly) or send via Resend. I keep the actual send manual on purpose — automated bulk sending without a warmed domain + verified suppression list is how you get blacklisted. Lead lists: I have 50 pre-built Tampa HVAC prospects in <code style={{ ...MONO, fontSize: 11 }}>docs/TAMPA_HVAC_50_PROSPECTS.csv</code> — say the word and I'll expand to your other niches.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── VENTURES ──────────────────────────────────────────────────────────────────
function Ventures() {
  const items = [
    { name: "TrainYourAgent", desc: "Flagship — AI voice + chat agents for SMBs. This site.", href: "/", live: true },
    { name: "TYA Bot / Agent Builder", desc: "$99/mo self-serve agent builder SaaS.", href: "/saas", live: true },
    { name: "Ghost Agency", desc: "Done-for-you agency arm. Leads federate into this dashboard.", href: "/hire", live: true },
    { name: "Stripe", desc: "Payments — LIVE. Real charges flowing.", href: "https://dashboard.stripe.com", live: true, ext: true },
    { name: "Vercel", desc: "Hosting + deploys.", href: "https://vercel.com/tya2023s-projects/trainyouragent", live: true, ext: true },
    { name: "Resend", desc: "Email — trainyouragent.com verified + sending.", href: "https://resend.com/emails", live: true, ext: true },
  ];
  return (
    <div>
      <SectionHead eyebrow="THE EMPIRE" title="Three ventures, " italic="one cockpit." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        {items.map((v) => (
          <a key={v.name} href={v.href} target={v.ext ? "_blank" : undefined} rel="noopener" style={{ ...card(), textDecoration: "none", display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15.5, fontWeight: 700, color: "#042C53" }}>{v.name}</span>
              {v.live && <span style={{ fontSize: 10, fontWeight: 700, color: "#15724D", padding: "3px 8px", borderRadius: 999, background: "rgba(34,163,108,0.1)", ...MONO }}>LIVE</span>}
            </div>
            <p style={{ fontSize: 13, color: "#5C6B7F", marginTop: 8, lineHeight: 1.5 }}>{v.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── shared atoms ──────────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, italic }: { eyebrow: string; title: string; italic: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", marginBottom: 8, ...MONO }}>{eyebrow}</div>
      <h1 style={{ fontSize: "clamp(26px,4vw,40px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: "#042C53", margin: 0 }}>
        {title}<span style={ITALIC}>{italic}</span>
      </h1>
    </div>
  );
}
function card(): React.CSSProperties {
  return { background: "#fff", border: "1px solid rgba(4,44,83,0.08)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 4px 24px -16px rgba(4,44,83,0.12)" };
}
function inp(): React.CSSProperties {
  return { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid rgba(4,44,83,0.16)", fontSize: 14, color: "#042C53", outline: "none", boxSizing: "border-box", background: "#fff" };
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6B7B92", ...MONO }}>{label}</span>
      {children}
    </label>
  );
}
