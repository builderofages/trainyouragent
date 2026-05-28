// src/pages/admin/Setup.tsx — v203
//
// One-page setup wizard. Walks the operator through the manual steps that
// flip the v192-v202 autopilot infrastructure from "deployed code" to
// "running machine":
//   1. Run the Supabase migrations (copy-paste SQL to the editor)
//   2. Set required env vars in Vercel (with deep links)
//   3. Paste ADMIN_TOKEN into this device's localStorage
//   4. Live health check shows you what's still red
//   5. (Optional) Create your first autopilot sourcing rule
//
// Every step has a copy button, a "Done" toggle, and a live status pull.
// Designed so the operator can finish setup in ~6 minutes without leaving
// this page (except to switch tabs to Supabase + Vercel).

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.2em" };

// SQL for the two migrations. Embedded as strings so the operator can copy
// in one click — no need to find the files in the repo.
const MIG_V192 = `-- v192_template_sends.sql — niche-template close tool tracking
create extension if not exists "pgcrypto";

create table if not exists public.template_sends (
  id                        uuid primary key default gen_random_uuid(),
  prospect_company          text not null,
  prospect_company_norm     text generated always as (lower(prospect_company)) stored,
  prospect_city             text,
  prospect_email            text,
  prospect_phone            text,
  prospect_name             text,
  niche                     text not null,
  niche_label               text,
  channel                   text not null,
  operator_id               text,
  sent_at                   timestamptz not null default now(),
  opened_at                 timestamptz,
  booked_at                 timestamptz,
  last_nurture_template     text,
  last_nurture_at           timestamptz,
  nurture_stopped_reason    text,
  cal_booking_uid           text,
  cal_attendee_email        text,
  meta                      jsonb default '{}'::jsonb
);
create index if not exists template_sends_company_norm_idx
  on public.template_sends (prospect_company_norm, sent_at desc);
create index if not exists template_sends_niche_idx
  on public.template_sends (niche, sent_at desc);
create index if not exists template_sends_nurture_idx
  on public.template_sends (sent_at)
  where booked_at is null and nurture_stopped_reason is null;
create index if not exists template_sends_email_idx
  on public.template_sends (prospect_email)
  where prospect_email is not null;
alter table public.template_sends enable row level security;
drop policy if exists template_sends_service_role_all on public.template_sends;
create policy template_sends_service_role_all on public.template_sends
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');`;

const MIG_V198 = `-- v198_autopilot_sourcing.sql — lead sourcing autopilot
create extension if not exists "pgcrypto";

create table if not exists public.sourcing_rules (
  id                uuid primary key default gen_random_uuid(),
  niche             text not null,
  niche_label       text,
  city              text not null,
  state             text,
  country           text default 'US',
  radius_meters     int default 25000,
  query_string      text,
  cadence_hours     int not null default 24,
  max_per_run       int not null default 10,
  enabled           boolean not null default true,
  last_run_at       timestamptz,
  last_run_added    int default 0,
  last_run_error    text,
  total_added       int default 0,
  created_at        timestamptz not null default now(),
  notes             text
);
create index if not exists sourcing_rules_due_idx
  on public.sourcing_rules (enabled, last_run_at);

create table if not exists public.sourced_prospects (
  id                uuid primary key default gen_random_uuid(),
  rule_id           uuid references public.sourcing_rules(id) on delete set null,
  source            text not null,
  source_id         text not null,
  prospect_company  text not null,
  prospect_company_norm text generated always as (lower(prospect_company)) stored,
  city              text,
  state             text,
  address           text,
  phone             text,
  email             text,
  website           text,
  niche             text,
  niche_label       text,
  raw               jsonb,
  promoted_at       timestamptz,
  promoted_send_id  uuid,
  skipped_reason    text,
  created_at        timestamptz not null default now()
);
create unique index if not exists sourced_prospects_unique_source
  on public.sourced_prospects (source, source_id);
create index if not exists sourced_prospects_company_norm
  on public.sourced_prospects (prospect_company_norm);
create index if not exists sourced_prospects_promoted_idx
  on public.sourced_prospects (promoted_at desc nulls last);

alter table public.template_sends
  add column if not exists first_touch_sent_at timestamptz;

alter table public.sourcing_rules    enable row level security;
alter table public.sourced_prospects enable row level security;
drop policy if exists sourcing_rules_svc on public.sourcing_rules;
drop policy if exists sourced_prospects_svc on public.sourced_prospects;
create policy sourcing_rules_svc    on public.sourcing_rules    for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy sourced_prospects_svc on public.sourced_prospects for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');`;

type StepKey = "mig1" | "mig2" | "envs" | "token" | "rule";
type Health = { ok: boolean; overall: "ok" | "warn" | "fail"; fails: number; warns: number; checks: { name: string; status: string; note?: string }[] } | null;

function lsGet(k: string): string { try { return localStorage.getItem(k) ?? ""; } catch { return ""; } }
function lsSet(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* noop */ } }

export default function Setup() {
  const [done, setDone] = useState<Record<StepKey, boolean>>({
    mig1: lsGet("tya.setup.mig1") === "1",
    mig2: lsGet("tya.setup.mig2") === "1",
    envs: lsGet("tya.setup.envs") === "1",
    token: lsGet("tya.admin.tg.admin_token") !== "",
    rule: lsGet("tya.setup.rule") === "1",
  });
  function mark(k: StepKey, v: boolean) {
    setDone((p) => ({ ...p, [k]: v }));
    if (k === "mig1" || k === "mig2" || k === "envs" || k === "rule") lsSet(`tya.setup.${k}`, v ? "1" : "0");
  }
  const [token, setToken] = useState(lsGet("tya.admin.tg.admin_token"));
  useEffect(() => { lsSet("tya.admin.tg.admin_token", token); mark("token", token.trim().length > 0); /* eslint-disable-next-line */ }, [token]);

  const [health, setHealth] = useState<Health>(null);
  const [hLoading, setHLoading] = useState(false);
  const [hErr, setHErr] = useState<string | null>(null);
  async function pingHealth() {
    if (!token.trim()) { setHErr("Paste ADMIN_TOKEN first."); return; }
    setHLoading(true); setHErr(null);
    try {
      const r = await fetch(`/api/admin/health?token=${encodeURIComponent(token.trim())}`);
      if (!r.ok) { setHErr(`http-${r.status}`); return; }
      setHealth(await r.json());
    } catch (e) { setHErr((e as Error).message); }
    finally     { setHLoading(false); }
  }

  const allDone = Object.values(done).every(Boolean);
  const pct = Math.round((Object.values(done).filter(Boolean).length / 5) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#0B1B2B", fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <Helmet>
        <title>TYA · Autopilot setup</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* rail */}
      <div style={{ borderBottom: "1px solid rgba(4,44,83,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: NAVY, textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke={NAVY} strokeWidth="2.5" /><path d="M16 8 L24 16 L16 24 L8 16 Z" fill={NAVY} /></svg>
            <span style={{ fontSize: 15, fontWeight: 700 }}>TrainYourAgent</span>
          </Link>
          <Link to="/admin/templates" style={{ fontSize: 12.5, color: ACCENT, textDecoration: "none" }}>Open /admin/templates →</Link>
        </div>
      </div>

      {/* HERO */}
      <header style={{ padding: "48px 24px 28px", background: "linear-gradient(180deg, #FFF8EE 0%, #FAF6EE 60%, #FFFFFF 100%)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 12, ...MONO }}>AUTOPILOT · SETUP</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: 0 }}>
            Flip the autopilot live —{" "}
            <span style={ITALIC}>5 steps, 6 minutes.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: "#42526E", marginTop: 16, maxWidth: 640 }}>
            All the v192-v202 code is deployed. These are the only manual steps to flip it on. Each step has a copy button and a Done toggle (persisted on this device). When all five are green, the autopilot runs itself.
          </p>
          {/* Progress bar */}
          <div style={{ marginTop: 22, height: 6, borderRadius: 999, background: "rgba(4,44,83,0.08)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#15724D" : ACCENT, transition: "width 300ms ease" }} />
          </div>
          <div style={{ fontSize: 12, color: "#6B7B92", marginTop: 6 }}>{pct}% complete · {Object.values(done).filter(Boolean).length} of 5 steps</div>
        </div>
      </header>

      <main style={{ padding: "20px 24px 80px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Step 1 — Migration 1 */}
          <Step n={1} title="Run the close-tool migration in Supabase" done={done.mig1} onToggle={(v) => mark("mig1", v)}>
            <p style={p()}>Open the <a href="https://supabase.com/dashboard/project/_/sql/new" target="_blank" rel="noopener" style={a()}>Supabase SQL Editor</a>, paste, run.</p>
            <CodeBlock label="v192_template_sends.sql" code={MIG_V192} />
          </Step>

          {/* Step 2 — Migration 2 */}
          <Step n={2} title="Run the autopilot-sourcing migration" done={done.mig2} onToggle={(v) => mark("mig2", v)}>
            <p style={p()}>Same Supabase SQL editor — paste, run. Adds the sourcing_rules + sourced_prospects tables that drive lead discovery.</p>
            <CodeBlock label="v198_autopilot_sourcing.sql" code={MIG_V198} />
          </Step>

          {/* Step 3 — Vercel envs */}
          <Step n={3} title="Set the required env vars in Vercel" done={done.envs} onToggle={(v) => mark("envs", v)}>
            <p style={p()}>Open <a href="https://vercel.com/dashboard" target="_blank" rel="noopener" style={a()}>Vercel</a> → your trainyouragent project → Settings → Environment Variables. Add:</p>
            <EnvList items={[
              { k: "SUPABASE_URL",            note: "from Supabase → Settings → API" },
              { k: "SUPABASE_SERVICE_KEY",    note: "from Supabase → Settings → API (service_role)" },
              { k: "ADMIN_TOKEN",             note: "any long random string — also paste below in Step 4" },
              { k: "RESEND_API_KEY",          note: "from resend.com → API Keys" },
              { k: "SENDER_LEGAL_NAME",       note: "e.g. 'TrainYourAgent LLC'" },
              { k: "SENDER_POSTAL_ADDRESS",   note: "REQUIRED by CAN-SPAM — use your PO Box / virtual mailbox / LLC registered agent address" },
              { k: "CAL_WEBHOOK_SECRET",      note: "from Cal.com → Settings → Developer → Webhooks" },
              { k: "ELEVENLABS_API_KEY",      note: "voice playback — already set if /voice-demo works" },
              { k: "ANTHROPIC_API_KEY",       note: "live chat in templates — already set if /chat works" },
              { k: "RESEND_WEBHOOK_SECRET",   note: "Optional but recommended — Resend → Webhooks → signing secret" },
              { k: "GOOGLE_PLACES_API_KEY",   note: "Optional — pay-per-call SMB discovery. Without it, OSM Overpass is free fallback." },
            ]} />
            <p style={{ ...p(), color: "#94A3B8", fontSize: 12.5, marginTop: 12 }}>After adding any env, redeploy: Vercel → Deployments → ⋯ → Redeploy.</p>
          </Step>

          {/* Step 4 — ADMIN_TOKEN paste */}
          <Step n={4} title="Paste your ADMIN_TOKEN here (stored on this device only)" done={done.token} onToggle={(v) => { if (v && !token.trim()) return; mark("token", v); }}>
            <p style={p()}>Paste the EXACT same string you put in Vercel as ADMIN_TOKEN. Used by the gallery + this page to call admin endpoints.</p>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ADMIN_TOKEN value"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: "1px solid rgba(4,44,83,0.16)", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            />
          </Step>

          {/* Step 5 — Health check */}
          <Step n={5} title="Live health check — make sure everything's green" done={!!health && health.overall === "ok"} onToggle={() => { /* derived */ }}>
            <p style={p()}>Pings every service + checks tables exist + cron sentinels. Run this AFTER steps 1-4. Anything red tells you exactly what's still missing.</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button onClick={pingHealth} disabled={hLoading || !token.trim()} style={btn(true, hLoading || !token.trim())}>
                {hLoading ? "Checking…" : "Run health check"}
              </button>
              {hErr && <span style={{ alignSelf: "center", color: "#9B2C2C", fontSize: 13 }}>{hErr}</span>}
            </div>
            {health && (
              <div style={{ background: "#FAFBFC", border: "1px solid rgba(4,44,83,0.08)", borderRadius: 11, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={pill(health.overall)}>{health.overall.toUpperCase()}</span>
                  <span style={{ fontSize: 13, color: "#5C6B7F" }}>{health.fails} fail · {health.warns} warn · {(health.checks.length - health.fails - health.warns)} ok</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <tbody>
                    {health.checks.map((c, i) => (
                      <tr key={i} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(4,44,83,0.05)" }}>
                        <td style={{ padding: "6px 8px", width: 60 }}>
                          <span style={dot(c.status)}>{c.status}</span>
                        </td>
                        <td style={{ padding: "6px 8px", color: NAVY, fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: "6px 8px", color: "#6B7B92" }}>{c.note || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Step>

          {/* Done CTA */}
          <div style={{ marginTop: 12, padding: "26px 28px", background: allDone ? "linear-gradient(155deg, rgba(34,163,108,0.08), #FAF6EE)" : "linear-gradient(155deg, #FFF8EE, #FAF6EE)", border: `1px solid ${allDone ? "rgba(34,163,108,0.18)" : "rgba(4,44,83,0.1)"}`, borderRadius: 18, textAlign: "center" }}>
            {allDone ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#15724D", marginBottom: 8, ...MONO }}>SETUP COMPLETE</div>
                <h2 style={{ fontSize: 26, fontWeight: 600, color: NAVY, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
                  Autopilot is live. <span style={ITALIC}>Add your first sourcing rule.</span>
                </h2>
                <Link to="/admin/templates" style={{ display: "inline-flex", padding: "13px 26px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                  Open /admin/templates → Autopilot panel →
                </Link>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 8, ...MONO }}>WHEN ALL 5 ARE GREEN</div>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: NAVY, margin: 0, letterSpacing: "-0.01em" }}>
                  The autopilot runs itself — source, send, follow up, attribute, opt out.
                </h2>
                <p style={{ fontSize: 14, color: "#5C6B7F", marginTop: 12, marginBottom: 0 }}>
                  Stuck? Email <a href="mailto:trainyouragent@gmail.com" style={a()}>trainyouragent@gmail.com</a> with the health-check JSON pasted in.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── presentational atoms ──────────────────────────────────────────────
function Step({ n, title, done, onToggle, children }: { n: number; title: string; done: boolean; onToggle: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <section style={{ background: "#fff", border: `1px solid ${done ? "rgba(34,163,108,0.2)" : "rgba(4,44,83,0.1)"}`, borderRadius: 16, padding: "20px 22px", boxShadow: done ? "0 6px 28px -20px rgba(34,163,108,0.3)" : "0 6px 28px -20px rgba(4,44,83,0.1)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 999, background: done ? "#15724D" : "rgba(4,44,83,0.08)", color: done ? "#fff" : NAVY, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {done ? "✓" : n}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: NAVY, margin: "2px 0 0", letterSpacing: "-0.005em" }}>{title}</h3>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7B92", cursor: "pointer", flexShrink: 0 }}>
          <input type="checkbox" checked={done} onChange={(e) => onToggle(e.target.checked)} />
          Done
        </label>
      </div>
      <div style={{ marginLeft: 44 }}>{children}</div>
    </section>
  );
}
function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* noop */ } }
  return (
    <div style={{ position: "relative", marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#0B1B2B", borderRadius: "10px 10px 0 0" }}>
        <span style={{ fontSize: 11, color: "#9BC3E8", ...MONO }}>{label}</span>
        <button onClick={copy} style={{ padding: "5px 11px", fontSize: 11, fontWeight: 600, background: copied ? "#15724D" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {copied ? "Copied ✓" : "Copy SQL"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: 14, background: "#0F2440", color: "#D6E3F0", borderRadius: "0 0 10px 10px", overflowX: "auto", fontSize: 11.5, lineHeight: 1.5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", maxHeight: 240 }}>
        {code}
      </pre>
    </div>
  );
}
function EnvList({ items }: { items: { k: string; note: string }[] }) {
  return (
    <div style={{ background: "#FAFBFC", border: "1px solid rgba(4,44,83,0.06)", borderRadius: 11, padding: 14, marginTop: 4 }}>
      {items.map((it) => (
        <div key={it.k} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, padding: "6px 0", borderTop: "1px solid rgba(4,44,83,0.04)" }}>
          <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12.5, color: NAVY, fontWeight: 600 }}>{it.k}</code>
          <span style={{ fontSize: 12, color: "#6B7B92", textAlign: "right" }}>{it.note}</span>
        </div>
      ))}
    </div>
  );
}
function p(): React.CSSProperties { return { fontSize: 14, color: "#42526E", lineHeight: 1.55, margin: "0 0 10px" }; }
function a(): React.CSSProperties { return { color: ACCENT, textDecoration: "underline", textUnderlineOffset: 2 }; }
function btn(primary: boolean, disabled: boolean): React.CSSProperties {
  return {
    padding: "10px 18px", borderRadius: 11,
    background: disabled ? "#F1F5F9" : (primary ? NAVY : "#fff"),
    color: disabled ? "#94A3B8" : (primary ? "#fff" : NAVY),
    fontSize: 13.5, fontWeight: 600,
    border: primary ? "none" : "1px solid rgba(4,44,83,0.14)",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
function pill(status: "ok" | "warn" | "fail"): React.CSSProperties {
  const map = { ok: ["rgba(34,163,108,0.12)", "#15724D"], warn: ["rgba(245,158,11,0.14)", "#92400E"], fail: ["rgba(155,44,44,0.12)", "#9B2C2C"] } as const;
  const [bg, fg] = map[status];
  return { fontSize: 10.5, fontWeight: 700, padding: "3px 11px", borderRadius: 999, background: bg, color: fg, ...MONO };
}
function dot(status: string): React.CSSProperties {
  const map: Record<string, [string, string]> = { ok: ["rgba(34,163,108,0.12)", "#15724D"], warn: ["rgba(245,158,11,0.14)", "#92400E"], fail: ["rgba(155,44,44,0.12)", "#9B2C2C"], skip: ["rgba(148,163,184,0.18)", "#64748B"] };
  const [bg, fg] = map[status] || map.skip;
  return { display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 9.5, fontWeight: 700, background: bg, color: fg, ...MONO };
}
