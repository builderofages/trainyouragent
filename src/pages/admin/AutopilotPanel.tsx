// src/pages/admin/AutopilotPanel.tsx — v200
//
// Operator UI for the lead-sourcing autopilot. Embedded in /admin/templates.
// Lets the operator create sourcing rules, see what the cron has done,
// trigger a manual "run now" on any rule, and peek at the raw discovery
// landing zone (sourced_prospects).
//
// Auth: pulls ADMIN_TOKEN from the same localStorage slot the gallery uses.

import { useEffect, useMemo, useState } from "react";
import { NICHE_SITES, ACTIVE_NICHE_SITES } from "@/lib/nicheSiteTemplates";

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

  const ago = (iso: string | null) => {
    if (!iso) return "—";
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60)    return "just now";
    if (s < 3600)  return `${Math.round(s / 60)}m ago`;
    if (s < 86400) return `${Math.round(s / 3600)}h ago`;
    return `${Math.round(s / 86400)}d ago`;
  };

  const totals = useMemo(() => {
    const enabled = rules.filter((r) => r.enabled).length;
    const totalAdded = rules.reduce((s, r) => s + (r.total_added || 0), 0);
    const promoted   = recent.filter((r) => r.promoted_at).length;
    const dups       = recent.filter((r) => r.skipped_reason === "dup").length;
    return { enabled, totalAdded, promoted, dups };
  }, [rules, recent]);

  if (!tokenOk) {
    return (
      <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: "#FAFBFC", border: "1px dashed rgba(4,44,83,0.18)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", marginBottom: 6, ...MONO }}>AUTOPILOT</div>
        <div style={{ fontSize: 13, color: "#5C6B7F" }}>Paste your ADMIN_TOKEN in the Server Activity panel above to enable lead-sourcing autopilot.</div>
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
        <button onClick={createRule} disabled={!city.trim() || creating} style={btn(true, !city.trim() || creating)}>
          {creating ? "Adding…" : "Add rule"}
        </button>
      </div>

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
