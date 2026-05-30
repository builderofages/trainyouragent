// src/pages/admin/Cockpit.tsx — v231
//
// Single-pane operational cockpit. One URL the founder visits to see
// EVERYTHING that matters in one screen:
//   - Site liveness + last deploy status
//   - Env completeness (Supabase, Stripe, Resend, Meta Pixel, etc)
//   - Autopilot status (rules, last run, prospects)
//   - Lead pipeline (sends, opens, bookings — today/week)
//   - Action items — "what needs YOUR attention right now"
//   - Recent client errors (if migration is run)
//   - Quick links to deeper admin pages
//
// Auth: ADMIN_TOKEN in localStorage (set via /admin/setup or paste below).
// All API hits use x-admin-token header.

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const HAIRLINE = "rgba(4,44,83,0.08)";
const MUTED = "#5C6B7F";
const GOOD = "#15724D";
const WARN = "#9B2C2C";
const PEND = "#9F580A";
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };

type Check = { name: string; status: "ok" | "warn" | "fail" | "skip"; note?: string };
type HealthData = { ok: boolean; checks: Check[]; envs?: { name: string; present: boolean }[] };

export default function Cockpit() {
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("tya_admin_token") || "";
  });
  const [tokenInput, setTokenInput] = useState("");
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthErr, setHealthErr] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [activity, setActivity] = useState<{ kind: string; label: string; ts: number }[] | null>(null);
  const [errors, setErrors] = useState<{ ts: string; kind: string; msg: string; url: string }[] | null>(null);
  const [pingResult, setPingResult] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    fetch("/api/admin/health", { headers: { "x-admin-token": token, accept: "application/json" } })
      .then(async (r) => {
        const j = (await r.json()) as HealthData & { error?: string };
        if (cancelled) return;
        if (!r.ok || j.error) {
          setHealthErr(j.error || `${r.status}`);
          setHealth(null);
        } else {
          setHealthErr("");
          setHealth(j);
        }
        setLastFetched(Date.now());
      })
      .catch((e) => !cancelled && setHealthErr(String(e?.message || e)))
      .finally(() => !cancelled && setLoading(false));

    // v234: recent client errors in parallel — gracefully empty if table missing
    fetch("/api/admin/recent-errors?limit=10", { headers: { "x-admin-token": token, accept: "application/json" } })
      .then(async (r) => r.ok ? r.json() : null)
      .then((j) => {
        if (cancelled || !j) return;
        setErrors((j.errors || []).map((e: { ts: string; kind: string; msg: string; url: string }) => ({ ts: e.ts, kind: e.kind, msg: e.msg, url: e.url })));
      })
      .catch(() => { /* silent */ });

    // v232: also fetch recent activity tail in parallel
    fetch("/api/admin/template-activity?limit=12", { headers: { "x-admin-token": token, accept: "application/json" } })
      .then(async (r) => r.ok ? r.json() : null)
      .then((j) => {
        if (cancelled || !j) return;
        const items: { kind: string; label: string; ts: number }[] = [];
        for (const s of (j.sends || []).slice(0, 12)) {
          items.push({
            kind: s.booked_at ? "booking" : s.opened_at ? "open" : "send",
            label: `${s.booked_at ? "Booked" : s.opened_at ? "Opened" : "Sent"} — ${s.prospect_company || "?"} (${s.niche_label || s.niche || "?"})`,
            ts: new Date(s.booked_at || s.opened_at || s.sent_at || Date.now()).getTime(),
          });
        }
        items.sort((a, b) => b.ts - a.ts);
        setActivity(items.slice(0, 10));
      })
      .catch(() => { /* silent — activity is optional */ });
    return () => { cancelled = true; };
  }, [token, lastFetched === 0 ? 1 : 0]);

  // v232: auto-refresh every 60s when toggle is on
  useEffect(() => {
    if (!token || !autoRefresh) return;
    const id = setInterval(() => setLastFetched(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [token, autoRefresh]);

  function saveToken(e: React.FormEvent) {
    e.preventDefault();
    const t = tokenInput.trim();
    if (!t) return;
    try { window.localStorage.setItem("tya_admin_token", t); } catch {}
    setToken(t);
  }
  function clearToken() {
    try { window.localStorage.removeItem("tya_admin_token"); } catch {}
    setToken("");
  }
  function refresh() { setLastFetched(Date.now()); }

  // Derive action items from health checks. Founder sees: "do these 3 things".
  const actionItems = useMemo(() => {
    if (!health) return [] as { label: string; href?: string; severity: "fail" | "warn" }[];
    const out: { label: string; href?: string; severity: "fail" | "warn" }[] = [];
    for (const c of health.checks || []) {
      if (c.status === "fail") out.push({ label: `${c.name}${c.note ? ` — ${c.note}` : ""}`, severity: "fail" });
      else if (c.status === "warn") out.push({ label: `${c.name}${c.note ? ` — ${c.note}` : ""}`, severity: "warn" });
    }
    return out;
  }, [health]);

  // ── unauth state ───────────────────────────────────────────────
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter Tight', system-ui, sans-serif", padding: 24 }}>
        <Helmet><title>Cockpit · TrainYourAgent</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <div style={{ maxWidth: 460, margin: "10vh auto 0", padding: 32, borderRadius: 18, border: `1px solid ${HAIRLINE}`, boxShadow: "0 18px 48px -22px rgba(4,44,83,0.22)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 10, ...MONO }}>OPERATOR LOGIN</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: NAVY, lineHeight: 1.1, margin: "0 0 12px" }}>
            Cockpit access <span style={ITALIC}>required.</span>
          </h1>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 20 }}>
            Paste your <code style={{ background: "#F1F4F8", padding: "2px 6px", borderRadius: 6, fontSize: 12 }}>ADMIN_TOKEN</code> (the same value you set in Vercel envs). Stored locally on this device only.
          </p>
          <form onSubmit={saveToken} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="password" autoComplete="off" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="ADMIN_TOKEN" style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${HAIRLINE}`, fontSize: 14, color: NAVY, outline: "none", background: "#FAFBFC" }} />
            <button type="submit" disabled={!tokenInput.trim()} style={{ padding: "12px 16px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: tokenInput.trim() ? "pointer" : "not-allowed", opacity: tokenInput.trim() ? 1 : 0.5 }}>Unlock cockpit →</button>
          </form>
          <div style={{ marginTop: 14, fontSize: 12.5, color: MUTED, textAlign: "center" }}>
            <Link to="/admin/setup" style={{ color: ACCENT, textDecoration: "underline" }}>First-time setup wizard →</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── authed view ────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter Tight', system-ui, sans-serif", color: "#0B1B2B", paddingBottom: 80 }}>
      <Helmet><title>Cockpit · TrainYourAgent</title><meta name="robots" content="noindex, nofollow" /></Helmet>

      {/* Top rail */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${HAIRLINE}`, padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="22" height="22" viewBox="0 0 32 32"><path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke={NAVY} strokeWidth="2.5" /><path d="M16 8 L24 16 L16 24 L8 16 Z" fill={NAVY} /></svg>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Cockpit</div>
          <div style={{ fontSize: 10.5, color: MUTED, ...MONO }}>OPERATOR</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ accentColor: NAVY }} />
            Auto 60s
          </label>
          <button onClick={refresh} disabled={loading} style={{ padding: "8px 14px", fontSize: 12.5, fontWeight: 700, background: "#F1F4F8", color: NAVY, border: "none", borderRadius: 999, cursor: loading ? "wait" : "pointer" }}>{loading ? "Refreshing…" : "Refresh"}</button>
          <button onClick={clearToken} style={{ padding: "8px 14px", fontSize: 12.5, fontWeight: 700, background: "transparent", color: MUTED, border: `1px solid ${HAIRLINE}`, borderRadius: 999, cursor: "pointer" }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 22px" }}>

        {/* ── ACTION ITEMS — top priority ─────────────────────── */}
        <section style={{ marginBottom: 26 }}>
          <SectionHeader title="What needs your attention" subtitle="Auto-derived from live health check. Fix these first." />
          {!health && !healthErr && <SkeletonBars n={3} />}
          {healthErr && <ErrorCard msg={healthErr} />}
          {health && actionItems.length === 0 && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Dot color={GOOD} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Everything healthy.</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>Nothing requires your attention. Autopilot is running.</div>
                </div>
              </div>
            </Card>
          )}
          {health && actionItems.length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {actionItems.map((a, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <Dot color={a.severity === "fail" ? WARN : PEND} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: a.severity === "fail" ? WARN : PEND }}>
                        {a.severity === "fail" ? "BLOCKED" : "ATTENTION"}
                      </div>
                      <div style={{ fontSize: 14, color: NAVY, lineHeight: 1.5, marginTop: 4 }}>{a.label}</div>
                    </div>
                    {a.href && <a href={a.href} style={{ color: ACCENT, textDecoration: "underline", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Open →</a>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── ENV CHECKLIST ──────────────────────────────────── */}
        {health?.envs && health.envs.length > 0 && (
          <section style={{ marginBottom: 26 }}>
            <SectionHeader title="Env vars" subtitle="Required Vercel environment variables." />
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                {health.envs.map((e) => (
                  <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: e.present ? "rgba(21,114,77,0.08)" : "rgba(155,44,44,0.06)" }}>
                    <Dot color={e.present ? GOOD : WARN} />
                    <div style={{ ...MONO, fontSize: 11.5, color: NAVY, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: e.present ? GOOD : WARN }}>{e.present ? "SET" : "MISSING"}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12.5, color: MUTED }}>
                Manage at{" "}
                <a href="https://vercel.com/builderofages/trainyouragent/settings/environment-variables" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "underline" }}>
                  Vercel → Settings → Environment Variables →
                </a>
              </div>
            </Card>
          </section>
        )}

        {/* ── ALL CHECKS — raw health detail ─────────────────── */}
        {health && (
          <section style={{ marginBottom: 26 }}>
            <SectionHeader title="System checks" subtitle={`${health.checks?.filter((c) => c.status === "ok").length || 0}/${health.checks?.length || 0} passing.`} />
            <Card>
              <div style={{ display: "grid", gap: 0 }}>
                {(health.checks || []).map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i === (health.checks || []).length - 1 ? "none" : `1px solid ${HAIRLINE}` }}>
                    <Dot color={c.status === "ok" ? GOOD : c.status === "warn" ? PEND : c.status === "fail" ? WARN : MUTED} />
                    <div style={{ fontSize: 13.5, color: NAVY, fontWeight: 600, flex: 1 }}>{c.name}</div>
                    {c.note && <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic", maxWidth: 480, textAlign: "right" }}>{c.note}</div>}
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: c.status === "ok" ? GOOD : c.status === "warn" ? PEND : c.status === "fail" ? WARN : MUTED, minWidth: 48, textAlign: "right" }}>{c.status.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* ── RECENT ACTIVITY ─────────────────────────────────── */}
        {token && (
          <section style={{ marginBottom: 26 }}>
            <SectionHeader title="Recent activity" subtitle="Last 10 sends, opens, and bookings from template_sends." />
            <Card>
              {activity === null ? <SkeletonBars n={4} /> : activity.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Dot color={MUTED} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>No activity yet.</div>
                    <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>Either migrations haven't been run, or no prospects have hit a /template/[niche] link yet. <Link to="/admin/setup" style={{ color: ACCENT, textDecoration: "underline" }}>Setup wizard →</Link></div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 0 }}>
                  {activity.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i === activity.length - 1 ? "none" : `1px solid ${HAIRLINE}` }}>
                      <Dot color={a.kind === "booking" ? GOOD : a.kind === "open" ? ACCENT : PEND} />
                      <div style={{ fontSize: 13, color: NAVY, fontWeight: 600, flex: 1 }}>{a.label}</div>
                      <div style={{ fontSize: 11.5, color: MUTED, ...MONO, letterSpacing: 0 }}>{relTime(a.ts)}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}

        {/* ── PIXEL DENY-LIST WARNING (v238) ───────────────── */}
        {token && (() => {
          const pixelId = (typeof window !== "undefined" && (import.meta as { env?: { VITE_META_PIXEL_ID?: string } }).env?.VITE_META_PIXEL_ID) || "";
          const denied = pixelId === "1324902062303919";
          if (!denied) return null;
          return (
            <section style={{ marginBottom: 26 }}>
              <Card>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <Dot color={WARN} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: WARN, marginBottom: 4 }}>
                      META PIXEL DENY-LISTED
                    </div>
                    <div style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.5, marginBottom: 8 }}>
                      Bundled Pixel ID <code style={{ background: "#F1F4F8", padding: "1px 6px", borderRadius: 6, fontSize: 12 }}>{pixelId}</code> belongs to the Shopify/saintrizz business and is blocked by client-side deny-list. Pixel events are NOT firing — by design, until you replace with a TYA-dedicated pixel.
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.45 }}>
                      Fix: create a dedicated pixel in Events Manager (TYA business 4275946662728840), then update <code>VITE_META_PIXEL_ID</code> + <code>META_PIXEL_ID</code> in Vercel envs.{" "}
                      <a href="https://business.facebook.com/events_manager2/list?business_id=4275946662728840" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "underline" }}>Open Events Manager →</a>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          );
        })()}

        {/* ── RECENT CLIENT ERRORS ─────────────────────────── */}
        {token && (
          <section style={{ marginBottom: 26 }}>
            <SectionHeader title="Recent client errors" subtitle="Last 10 uncaught exceptions + unhandled promise rejections from prod." />
            <Card>
              {errors === null ? <SkeletonBars n={3} /> : errors.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Dot color={GOOD} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>No errors in the last window.</div>
                    <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>Either the site is clean, or the client_errors table isn't migrated yet (paste v234 SQL).</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 0 }}>
                  {errors.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 0", borderBottom: i === errors.length - 1 ? "none" : `1px solid ${HAIRLINE}` }}>
                      <Dot color={WARN} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: NAVY, fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.kind}: {e.msg}</div>
                        <div style={{ fontSize: 11.5, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.url}</div>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, ...MONO, letterSpacing: 0, whiteSpace: "nowrap" }}>{relTime(new Date(e.ts).getTime())}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}

        {/* ── ACTIONS ─────────────────────────────────────── */}
        {token && (
          <section style={{ marginBottom: 26 }}>
            <SectionHeader title="Quick actions" subtitle="One-click ops triggers." />
            <Card>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <button
                  onClick={async () => {
                    setPingResult("Pinging…");
                    try {
                      const r = await fetch("/api/sitemap-ping", { headers: { "x-admin-token": token } });
                      const j = await r.json();
                      if (!r.ok || !j.ok) { setPingResult(`Failed: ${j.error || r.status}`); return; }
                      const bing = (j.results || []).find((x: { engine: string; status: number | string }) => x.engine === "bing");
                      setPingResult(`Bing ${bing?.status || "?"}, IndexNow ${(j.results || []).find((x: { engine: string }) => x.engine === "indexnow")?.status || "?"}`);
                    } catch (e) {
                      setPingResult(`Error: ${(e as Error).message || "unknown"}`);
                    }
                  }}
                  style={{ padding: "10px 18px", borderRadius: 999, background: NAVY, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}
                >Ping Bing + IndexNow</button>
                {pingResult && <span style={{ fontSize: 12.5, color: MUTED, ...MONO, letterSpacing: 0 }}>{pingResult}</span>}
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 18px", borderRadius: 999, background: "#F1F4F8", color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
                >Google Search Console →</a>
              </div>
            </Card>
          </section>
        )}

        {/* ── QUICK NAV ──────────────────────────────────────── */}
        <section>
          <SectionHeader title="Deeper admin" subtitle="Drill into specific surfaces." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            <QuickLink to="/admin/setup" title="Setup wizard" sub="Migrations · env vars · first rule" />
            <QuickLink to="/admin/templates" title="Niche templates" sub="25 industry sites + activity" />
            <QuickLink to="/admin/metrics" title="Metrics (founder)" sub="Raw numbers, no narrative" />
            <QuickLink to="/admin" title="Admin home" sub="Original admin index" />
            <QuickLink to="/websites" title="Public gallery" sub="The /websites page visitors see" />
            <QuickLink to="/portal/leads" title="Leads portal" sub="Customer-facing pipeline" />
          </div>
        </section>

        {/* Footer note */}
        <div style={{ marginTop: 40, fontSize: 12, color: MUTED, textAlign: "center" }}>
          Health refresh: {lastFetched ? new Date(lastFetched).toLocaleTimeString() : "—"}
        </div>
      </div>
    </div>
  );
}

// ── tiny atoms ──────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${HAIRLINE}`, padding: 18, boxShadow: "0 1px 0 rgba(4,44,83,0.02)" }}>{children}</div>;
}
function Dot({ color }: { color: string }) {
  return <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: color, flexShrink: 0 }} />;
}
function SkeletonBars({ n }: { n: number }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ height: 52, borderRadius: 14, background: "linear-gradient(90deg, rgba(4,44,83,0.05), rgba(4,44,83,0.10), rgba(4,44,83,0.05))", backgroundSize: "200% 100%", animation: "tyaSkeleton 1.4s linear infinite" }} />
      ))}
      <style>{`@keyframes tyaSkeleton { 0%{background-position:0% 0%} 100%{background-position:-200% 0%} }`}</style>
    </div>
  );
}
function ErrorCard({ msg }: { msg: string }) {
  return (
    <Card>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Dot color={WARN} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: WARN }}>Health check failed</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4, ...MONO, letterSpacing: 0 }}>{msg}</div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 8 }}>Likely: ADMIN_TOKEN mismatch, or Supabase migrations not yet run. Visit <Link to="/admin/setup" style={{ color: ACCENT, textDecoration: "underline" }}>Setup</Link>.</div>
        </div>
      </div>
    </Card>
  );
}
function relTime(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 45) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function QuickLink({ to, title, sub }: { to: string; title: string; sub: string }) {
  return (
    <Link to={to} style={{ display: "block", padding: 16, borderRadius: 12, border: `1px solid ${HAIRLINE}`, background: "#fff", textDecoration: "none", transition: "border-color .15s ease, transform .15s ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = HAIRLINE; }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{title}</div>
      <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4 }}>{sub}</div>
    </Link>
  );
}
