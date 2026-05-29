// src/pages/admin/AutopilotPanel.tsx — v200
//
// Operator UI for the lead-sourcing autopilot. Embedded in /admin/templates.
// Lets the operator create sourcing rules, see what the cron has done,
// trigger a manual "run now" on any rule, and peek at the raw discovery
// landing zone (sourced_prospects).
//
// Auth: pulls ADMIN_TOKEN from the same localStorage slot the gallery uses.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { NICHE_SITES, ACTIVE_NICHE_SITES } from "@/lib/nicheSiteTemplates";

// shared "2h ago" helper — used by both demo + live render paths
const ago = (iso: string | null): string => {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};

const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.2em" };

type Rule = {
  id: string;
  niche: string;
  niche_label: string | null;
  city: string;
  state: string | null;
  radius_meters: number;
  query_string: string | null;
  cadence_hours: number;
  max_per_run: number;
  enabled: boolean;
  last_run_at: string | null;
  last_run_added: number | null;
  last_run_error: string | null;
  total_added: number | null;
  created_at: string;
  notes: string | null;
};
type Sourced = {
  id: string;
  prospect_company: string;
  city: string | null;
  niche: string;
  niche_label: string | null;
  source: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  promoted_at: string | null;
  skipped_reason: string | null;
  created_at: string;
};

export default function AutopilotPanel({ adminToken }: { adminToken: string }) {
  const [rules, setRules]     = useState<Rule[]>([]);
  const [recent, setRecent]   = useState<Sourced[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState<string | null>(null);
  const [busy, setBusy]       = useState<string | null>(null); // rule.id currently running
  const tokenOk = adminToken.trim().length > 0;

  async function load() {
    if (!tokenOk) return;
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`/api/admin/sourcing-rules?token=${encodeURIComponent(adminToken.trim())}`);
      const j = await r.json();
      if (!r.ok || !j.ok) { setErr(j.error || `http-${r.status}`); return; }
      setRules(j.rules || []); setRecent(j.recent || []);
    } catch (e) { setErr((e as Error).message); }
    finally     { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [adminToken]);
  // Slow auto-refresh — autopilot runs every 6h, no need for 60s polling.
  useEffect(() => {
    if (!tokenOk) return;
    const t = setInterval(() => { if (document.visibilityState === "visible") load(); }, 5 * 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [adminToken]);

  // ── Create-rule form ─────────────────────────────────────────────────
  const [niche, setNiche]     = useState(ACTIVE_NICHE_SITES[0]?.id || "cleaning");
  const [city, setCity]       = useState("");
  const [cadenceH, setCadH]   = useState(24);
  const [maxRun, setMaxRun]   = useState(10);
  const [creating, setCreating] = useState(false);
  // v204 — dry-run preview before committing a rule
  type Preview = {
    discovered: number;
    with_verified_email: number;
    with_pattern_guess_email_possible: number;
    with_phone: number;
    already_contacted_skip: number;
    would_promote_new: number;
    data_source: string;
    preview: Array<{ company: string; phone?: string; email?: string; website?: string; emailSource?: string }>;
  };
  const [preview, setPreview]   = useState<Preview | null>(null);
  const [previewing, setPrev]   = useState(false);
  async function previewRule() {
    if (!tokenOk || !niche || !city.trim()) return;
    setPrev(true); setPreview(null); setErr(null);
    try {
      const n = NICHE_SITES.find((x) => x.id === niche);
      const r = await fetch(`/api/sourcing/discover?token=${encodeURIComponent(adminToken.trim())}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          niche, niche_label: n?.niche || niche, city: city.trim(),
          max: maxRun, dry_run: true,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) { setErr(j.error || `preview-http-${r.status}`); return; }
      setPreview(j as Preview);
    } catch (e) { setErr((e as Error).message); }
    finally     { setPrev(false); }
  }
  async function createRule() {
    if (!tokenOk || !niche || !city.trim()) return;
    setCreating(true);
    try {
      const n = NICHE_SITES.find((x) => x.id === niche);
      const r = await fetch(`/api/admin/sourcing-rules?token=${encodeURIComponent(adminToken.trim())}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          niche, niche_label: n?.niche || niche, city: city.trim(),
          cadence_hours: cadenceH, max_per_run: maxRun,
        }),
      });
      if (r.ok) {
        setCity(""); setCadH(24); setMaxRun(10);
        await load();
      } else {
        const j = await r.json().catch(() => ({}));
        setErr(j.error || `create-http-${r.status}`);
      }
    } finally { setCreating(false); }
  }

  async function toggleRule(id: string, enabled: boolean) {
    await fetch(`/api/admin/sourcing-rules?token=${encodeURIComponent(adminToken.trim())}&op=update`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    });
    await load();
  }
  async function deleteRule(id: string) {
    if (!confirm("Delete this sourcing rule? Historical sourced_prospects stay; only the rule and future runs stop.")) return;
    await fetch(`/api/admin/sourcing-rules?token=${encodeURIComponent(adminToken.trim())}&op=delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }
  async function runNow(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await fetch(`/api/sourcing/discover?token=${encodeURIComponent(adminToken.trim())}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rule_id: id }),
      });
      await load();
    } finally { setBusy(null); }
  }

  const totals = useMemo(() => {
    const enabled = rules.filter((r) => r.enabled).length;
    const totalAdded = rules.reduce((s, r) => s + (r.total_added || 0), 0);
    const promoted   = recent.filter((r) => r.promoted_at).length;
    const dups       = recent.filter((r) => r.skipped_reason === "dup").length;
    return { enabled, totalAdded, promoted, dups };
  }, [rules, recent]);

  // v207 — DEMO MODE: when no ADMIN_TOKEN is set, render the full UI with
  // realistic sample data so the operator can SEE what the autopilot looks
  // like running before they commit to setup. Everything is read-only with
  // a clear "DEMO" badge so it can't be mistaken for live state.
  if (!tokenOk) {
    const demoRules: Rule[] = [
      { id: "demo-1", niche: "roofing",     niche_label: "Roofing",     city: "Tampa, FL",         state: "FL", radius_meters: 25000, query_string: null, cadence_hours: 24, max_per_run: 10, enabled: true,  last_run_at: new Date(Date.now() - 3.5 * 3600_000).toISOString(), last_run_added: 7,  last_run_error: null, total_added: 142, created_at: new Date(Date.now() - 14 * 86400_000).toISOString(), notes: null },
      { id: "demo-2", niche: "real-estate", niche_label: "Real Estate", city: "St. Petersburg, FL",state: "FL", radius_meters: 25000, query_string: null, cadence_hours: 24, max_per_run: 10, enabled: true,  last_run_at: new Date(Date.now() - 6   * 3600_000).toISOString(), last_run_added: 4,  last_run_error: null, total_added: 98,  created_at: new Date(Date.now() - 12 * 86400_000).toISOString(), notes: null },
      { id: "demo-3", niche: "med-spa",     niche_label: "Med Spa",     city: "Sarasota, FL",      state: "FL", radius_meters: 25000, query_string: null, cadence_hours: 48, max_per_run: 10, enabled: true,  last_run_at: new Date(Date.now() - 18  * 3600_000).toISOString(), last_run_added: 3,  last_run_error: null, total_added: 67,  created_at: new Date(Date.now() - 9  * 86400_000).toISOString(), notes: null },
      { id: "demo-4", niche: "law-firm",    niche_label: "Law Firm",    city: "Tampa, FL",         state: "FL", radius_meters: 25000, query_string: null, cadence_hours: 48, max_per_run: 8,  enabled: false, last_run_at: new Date(Date.now() - 3   * 86400_000).toISOString(), last_run_added: 0,  last_run_error: null, total_added: 22,  created_at: new Date(Date.now() - 5  * 86400_000).toISOString(), notes: null },
    ];
    const demoRecent: Sourced[] = [
      { id: "d1", prospect_company: "Bay Area Roofers",       city: "Tampa",    niche: "roofing",     niche_label: "Roofing",     source: "osm",           phone: "+1 813 555 0142", email: "info@bayarearoofers.com",     website: "https://bayarearoofers.com",    promoted_at: new Date(Date.now() - 2 * 3600_000).toISOString(), skipped_reason: null,  created_at: new Date(Date.now() - 2 * 3600_000).toISOString() },
      { id: "d2", prospect_company: "Sunshine Roof Pros",     city: "Tampa",    niche: "roofing",     niche_label: "Roofing",     source: "google-places", phone: null,              email: null,                          website: "https://sunshineroofs.com",     promoted_at: new Date(Date.now() - 2 * 3600_000).toISOString(), skipped_reason: null,  created_at: new Date(Date.now() - 2 * 3600_000).toISOString() },
      { id: "d3", prospect_company: "Premium Roofing Tampa",  city: "Tampa",    niche: "roofing",     niche_label: "Roofing",     source: "osm",           phone: "+1 813 555 0188", email: null,                          website: "https://premiumroofingtampa.com",promoted_at: null,                                              skipped_reason: "dup", created_at: new Date(Date.now() - 3 * 3600_000).toISOString() },
      { id: "d4", prospect_company: "Bayfront Realty Group",  city: "St. Pete", niche: "real-estate", niche_label: "Real Estate", source: "google-places", phone: "+1 727 555 0166", email: "hello@bayfrontrealty.com",    website: "https://bayfrontrealty.com",    promoted_at: new Date(Date.now() - 5 * 3600_000).toISOString(), skipped_reason: null,  created_at: new Date(Date.now() - 5 * 3600_000).toISOString() },
      { id: "d5", prospect_company: "Glow Aesthetics MedSpa", city: "Sarasota", niche: "med-spa",     niche_label: "Med Spa",     source: "osm",           phone: null,              email: "info@glowaesthetics.com",     website: "https://glowaesthetics.com",    promoted_at: new Date(Date.now() - 17* 3600_000).toISOString(), skipped_reason: null,  created_at: new Date(Date.now() - 17* 3600_000).toISOString() },
    ];
    const demoTotals = { enabled: 3, totalAdded: 329, promoted: 4, dups: 1 };

    return (
      <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: "#fff", border: "1px solid rgba(4,44,83,0.1)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", ...MONO }}>AUTOPILOT · LEAD SOURCING</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#9B2C2C", padding: "3px 9px", borderRadius: 999, ...MONO }}>DEMO</span>
          <span style={{ fontSize: 12.5, color: "#5C6B7F" }}>
            Sample data — paste ADMIN_TOKEN above (or hit Setup wizard) to see your real rules.
          </span>
        </div>
        <div style={{ marginBottom: 10, padding: "10px 14px", background: "linear-gradient(90deg, rgba(245,158,11,0.08), #FFF8EE)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 10, fontSize: 12.5, color: "#92400E" }}>
          <strong>This is what your autopilot looks like running.</strong> {demoTotals.enabled} active rules · {demoTotals.totalAdded} prospects total sourced · last batch {demoTotals.promoted} new / {demoTotals.dups} dup. Real version comes alive when you finish the <Link to="/admin/setup" style={{ color: "#92400E", textDecoration: "underline" }}>setup wizard</Link>.
        </div>

        <div style={{ overflowX: "auto", marginBottom: 14, opacity: 0.92 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#F1F5F9", color: "#6B7B92", textAlign: "left", fontWeight: 700 }}>
                <th style={th()}>Niche · City</th>
                <th style={th()}>Cadence</th>
                <th style={th()}>Last run</th>
                <th style={th()}>Total sourced</th>
                <th style={th()}></th>
              </tr>
            </thead>
            <tbody>
              {demoRules.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid rgba(4,44,83,0.06)", opacity: r.enabled ? 1 : 0.55 }}>
                  <td style={td()}>
                    <div style={{ fontWeight: 600, color: "#042C53" }}>{r.niche_label}</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{r.city}</div>
                  </td>
                  <td style={td()}>{r.cadence_hours}h · max {r.max_per_run}</td>
                  <td style={td()}>{ago(r.last_run_at)} · +{r.last_run_added}</td>
                  <td style={td()}>{r.total_added}</td>
                  <td style={td()}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <span style={{ ...btn(false, true), padding: "5px 9px", fontSize: 11 }}>Demo</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details open>
          <summary style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>RECENT DISCOVERY (sample) — raw landing zone before dedupe</summary>
          <div style={{ marginTop: 8, maxHeight: 260, overflowY: "auto", border: "1px solid rgba(4,44,83,0.06)", borderRadius: 10, background: "#FAFBFC" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                {demoRecent.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid rgba(4,44,83,0.05)" }}>
                    <td style={{ ...td(), color: "#042C53", fontWeight: 500 }}>{r.prospect_company}<span style={{ color: "#94A3B8", fontWeight: 400 }}> · {r.city}</span></td>
                    <td style={td()}>{r.niche_label}</td>
                    <td style={td()}>{r.source}</td>
                    <td style={td()}>{r.email || (r.website ? `(${new URL(r.website).hostname})` : "—")}</td>
                    <td style={td()}>
                      {r.promoted_at
                        ? <span style={{ color: "#15724D", fontWeight: 600 }}>PROMOTED · {ago(r.promoted_at)}</span>
                        : r.skipped_reason
                          ? <span style={{ color: "#94A3B8" }}>SKIPPED · {r.skipped_reason}</span>
                          : <span style={{ color: "#94A3B8" }}>(pending)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div style={{ marginTop: 14, padding: "14px 16px", background: "#042C53", borderRadius: 12, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontSize: 13.5, color: "#fff" }}>Like what you see? Flip the autopilot live in 5 steps, ~6 minutes.</span>
          <Link to="/admin/setup" style={{ padding: "9px 18px", borderRadius: 9, background: "#fff", color: "#042C53", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Open setup wizard →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: "#fff", border: "1px solid rgba(4,44,83,0.1)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", ...MONO }}>AUTOPILOT · LEAD SOURCING</span>
        <span style={{ fontSize: 12.5, color: "#5C6B7F" }}>
          {totals.enabled} active rule{totals.enabled === 1 ? "" : "s"} · {totals.totalAdded} total prospects sourced · last 40 raw: {totals.promoted} new / {totals.dups} dup
        </span>
        <button onClick={load} disabled={loading} style={btn(false, loading)}>{loading ? "…" : "Refresh"}</button>
      </div>
      {err && <div style={{ fontSize: 12.5, color: "#9B2C2C", marginBottom: 10 }}>Error: {err}</div>}

      {/* CREATE FORM */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, alignItems: "end", marginBottom: 14, padding: 12, background: "#FAFBFC", borderRadius: 10, border: "1px solid rgba(4,44,83,0.06)" }}>
        <Field label="Niche">
          <select value={niche} onChange={(e) => setNiche(e.target.value)} style={inp()}>
            {ACTIVE_NICHE_SITES.map((n) => (<option key={n.id} value={n.id}>{n.niche}</option>))}
          </select>
        </Field>
        <Field label="City">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Tampa, FL" style={inp()} />
        </Field>
        <Field label="Run every (h)">
          <input type="number" min={1} max={720} value={cadenceH} onChange={(e) => setCadH(parseInt(e.target.value, 10) || 24)} style={inp()} />
        </Field>
        <Field label="Per run (max 20)">
          <input type="number" min={1} max={20} value={maxRun} onChange={(e) => setMaxRun(Math.min(20, parseInt(e.target.value, 10) || 10))} style={inp()} />
        </Field>
        <button onClick={previewRule} disabled={!city.trim() || previewing} style={btn(false, !city.trim() || previewing)} title="See what this rule would find without saving it">
          {previewing ? "…" : "Preview"}
        </button>
        <button onClick={createRule} disabled={!city.trim() || creating} style={btn(true, !city.trim() || creating)}>
          {creating ? "Adding…" : "Add rule"}
        </button>
      </div>

      {/* PREVIEW RESULT */}
      {preview && (
        <div style={{ marginBottom: 14, padding: 14, background: "#FAFBFC", borderRadius: 10, border: "1px solid rgba(4,44,83,0.1)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#185FA5", ...MONO }}>PREVIEW · {preview.data_source.toUpperCase()}</span>
            <span style={{ fontSize: 12.5, color: "#5C6B7F" }}>
              <strong style={{ color: "#042C53" }}>{preview.discovered}</strong> found · <strong style={{ color: "#15724D" }}>{preview.with_verified_email}</strong> w/ verified email · <strong style={{ color: "#92400E" }}>{preview.with_pattern_guess_email_possible}</strong> guessable · <strong style={{ color: "#94A3B8" }}>{preview.already_contacted_skip}</strong> dup-skip · <strong style={{ color: "#042C53" }}>{preview.would_promote_new}</strong> would queue
            </span>
            <button onClick={() => setPreview(null)} style={{ marginLeft: "auto", fontSize: 11, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>clear</button>
          </div>
          {preview.preview.length > 0 ? (
            <div style={{ maxHeight: 200, overflowY: "auto", fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              {preview.preview.map((p, i) => (
                <div key={i} style={{ padding: "4px 0", borderTop: i === 0 ? "none" : "1px solid rgba(4,44,83,0.04)" }}>
                  <span style={{ color: "#042C53", fontWeight: 600 }}>{p.company}</span>
                  <span style={{ color: p.emailSource === "discovered" ? "#15724D" : p.emailSource === "pattern-guess" ? "#92400E" : "#94A3B8", marginLeft: 8 }}>
                    {p.email ? `✉ ${p.email}` : p.website ? `↪ ${p.website}` : "no contact"}
                  </span>
                  {p.phone && <span style={{ color: "#6B7B92", marginLeft: 8 }}>☎ {p.phone}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#94A3B8" }}>No new prospects matched (all {preview.discovered} already contacted, or none found). Try a different city or broader query.</div>
          )}
        </div>
      )}

      {/* RULES TABLE */}
      {rules.length === 0 ? (
        <div style={{ fontSize: 13, color: "#94A3B8", padding: "12px 0" }}>
          No rules yet. Add one above — e.g. "roofing in Tampa, FL, every 24h, 10 per run" — and the cron will source + auto-fire the Day-0 email to prospects with verified emails (pattern-guesses gated by default for sender-reputation protection).
        </div>
      ) : (
        <div style={{ overflowX: "auto", marginBottom: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#F1F5F9", color: "#6B7B92", textAlign: "left", fontWeight: 700 }}>
                <th style={th()}>Niche · City</th>
                <th style={th()}>Cadence</th>
                <th style={th()}>Last run</th>
                <th style={th()}>Total sourced</th>
                <th style={th()}></th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid rgba(4,44,83,0.06)", opacity: r.enabled ? 1 : 0.55 }}>
                  <td style={td()}>
                    <div style={{ fontWeight: 600, color: "#042C53" }}>{r.niche_label || r.niche}</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{r.city}{r.state ? ` · ${r.state}` : ""}</div>
                  </td>
                  <td style={td()}>{r.cadence_hours}h · max {r.max_per_run}</td>
                  <td style={td()}>
                    {r.last_run_error
                      ? <span style={{ color: "#9B2C2C" }}>err: {r.last_run_error.slice(0, 28)}</span>
                      : `${ago(r.last_run_at)}${r.last_run_added != null ? ` · +${r.last_run_added}` : ""}`}
                  </td>
                  <td style={td()}>{r.total_added || 0}</td>
                  <td style={td()}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button onClick={() => runNow(r.id)} disabled={busy === r.id} style={btn(false, busy === r.id)} title="Manual run now (bypasses cadence)">{busy === r.id ? "…" : "Run"}</button>
                      <button onClick={() => toggleRule(r.id, !r.enabled)} style={btn(false, false)} title={r.enabled ? "Pause" : "Resume"}>{r.enabled ? "Pause" : "Resume"}</button>
                      <button onClick={() => deleteRule(r.id)} style={{ ...btn(false, false), color: "#9B2C2C", border: "1px solid rgba(155,44,44,0.2)" }} title="Delete rule">×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RECENT SOURCED (raw) */}
      {recent.length > 0 && (
        <details>
          <summary style={{ cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#6B7B92", ...MONO }}>RECENT DISCOVERY ({recent.length}) — raw landing zone, before dedupe</summary>
          <div style={{ marginTop: 8, maxHeight: 220, overflowY: "auto", border: "1px solid rgba(4,44,83,0.06)", borderRadius: 10, background: "#FAFBFC" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid rgba(4,44,83,0.05)" }}>
                    <td style={{ ...td(), color: "#042C53", fontWeight: 500 }}>{r.prospect_company}{r.city ? <span style={{ color: "#94A3B8", fontWeight: 400 }}> · {r.city}</span> : null}</td>
                    <td style={td()}>{r.niche_label || r.niche}</td>
                    <td style={td()}>{r.source}</td>
                    <td style={td()}>{r.email || (r.website ? `(${new URL(r.website).hostname})` : "—")}</td>
                    <td style={td()}>
                      {r.promoted_at
                        ? <span style={{ color: "#15724D", fontWeight: 600 }}>PROMOTED · {ago(r.promoted_at)}</span>
                        : r.skipped_reason
                          ? <span style={{ color: "#94A3B8" }}>SKIPPED · {r.skipped_reason}</span>
                          : <span style={{ color: "#94A3B8" }}>(pending)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

// ── tiny presentational atoms ────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7B92", ...MONO }}>{label.toUpperCase()}</span>
      {children}
    </label>
  );
}
function inp(): React.CSSProperties {
  return { padding: "8px 10px", borderRadius: 9, border: "1px solid rgba(4,44,83,0.16)", fontSize: 13, color: "#042C53", outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" };
}
function btn(primary: boolean, disabled: boolean): React.CSSProperties {
  return {
    padding: "8px 11px", borderRadius: 9,
    background: disabled ? "#F1F5F9" : (primary ? "#042C53" : "#fff"),
    color: disabled ? "#94A3B8" : (primary ? "#fff" : "#042C53"),
    fontSize: 12, fontWeight: 600,
    border: primary ? "none" : "1px solid rgba(4,44,83,0.14)",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
function th(): React.CSSProperties { return { padding: "8px 10px", fontSize: 10.5, ...MONO }; }
function td(): React.CSSProperties { return { padding: "8px 10px", color: "#5C6B7F", verticalAlign: "top" }; }
