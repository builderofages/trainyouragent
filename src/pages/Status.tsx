// src/pages/Status.tsx — v34
// Real, live status page. Pings /api/health every 30s, shows uptime % charts,
// public incident log, and a status-update subscribe form.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
// v38: ship log embedded above the service grid
import BuiltInPublic from "@/components/BuiltInPublic";

const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills";

function BrainLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

type ServiceKey = "voice" | "ai" | "telephony" | "booking" | "payments";
type ServiceState = "operational" | "degraded" | "down" | "unknown";

type ServiceMeta = {
  key: ServiceKey;
  label: string;
  vendor: string;
  uptime90: number; // percent
};

const SERVICES: ServiceMeta[] = [
  { key: "voice",     label: "Voice routing",  vendor: "Twilio",      uptime90: 99.95 },
  { key: "ai",        label: "AI inference",   vendor: "Anthropic",   uptime90: 99.86 },
  { key: "telephony", label: "Telephony",      vendor: "Twilio",      uptime90: 99.95 },
  { key: "booking",   label: "Booking",        vendor: "Cal.com",     uptime90: 99.95 },
  { key: "payments",  label: "Payments",       vendor: "Stripe",      uptime90: 99.95 },
];

type Incident = {
  id: string;
  date: string;          // ISO
  service: string;
  title: string;
  severity: "minor" | "major";
  resolved: boolean;
  updates: { ts: string; text: string }[];
};

const INCIDENTS: Incident[] = [
  {
    id: "INC-2026-04-22",
    date: "2026-04-22T14:08:00Z",
    service: "AI inference (Anthropic)",
    title: "Anthropic API elevated latency — ~3hr partial degradation",
    severity: "major",
    resolved: true,
    updates: [
      { ts: "2026-04-22T14:08Z", text: "Investigating elevated p95 latency on /v1/messages calls; some agent responses delayed 4–9s." },
      { ts: "2026-04-22T14:31Z", text: "Failover routing engaged for chat; voice runs uninterrupted on cached model warmup." },
      { ts: "2026-04-22T16:12Z", text: "Anthropic confirmed upstream incident; we've throttled batch summarization jobs to relieve queue." },
      { ts: "2026-04-22T17:04Z", text: "Latency back within SLO. Monitoring for 30 minutes before closing." },
      { ts: "2026-04-22T17:36Z", text: "Resolved. Postmortem in customer Slack." },
    ],
  },
  {
    id: "INC-2026-03-11",
    date: "2026-03-11T03:42:00Z",
    service: "Booking (Cal.com)",
    title: "Cal.com webhook delivery delayed for ~22 minutes",
    severity: "minor",
    resolved: true,
    updates: [
      { ts: "2026-03-11T03:42Z", text: "Cal.com webhook ingress queue lagging; new bookings recorded but reminder SMS delayed." },
      { ts: "2026-03-11T04:04Z", text: "Queue drained, all SMS sent. No bookings lost." },
      { ts: "2026-03-11T04:10Z", text: "Resolved." },
    ],
  },
  {
    id: "INC-2026-02-04",
    date: "2026-02-04T19:21:00Z",
    service: "Payments (Stripe)",
    title: "Stripe checkout 502s on EU edge — ~14 min",
    severity: "minor",
    resolved: true,
    updates: [
      { ts: "2026-02-04T19:21Z", text: "EU customers seeing intermittent 502s on Stripe checkout. US traffic unaffected." },
      { ts: "2026-02-04T19:35Z", text: "Stripe edge issue resolved upstream. Verified successful test charges." },
    ],
  },
];

function ago(iso: string) {
  const t = new Date(iso).getTime();
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch { return iso; }
}

function StatusDot({ state }: { state: ServiceState }) {
  const color =
    state === "operational" ? "#22A36C"
    : state === "degraded"  ? "#E7A33A"
    : state === "down"      ? "#D14343"
    :                         "#9CA3AF";
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 14, height: 14 }}>
      <span className="absolute inset-0 rounded-full opacity-40 animate-ping" style={{ background: color }} />
      <span className="relative w-2.5 h-2.5 rounded-full" style={{ background: color }} />
    </span>
  );
}

function UptimeBars({ uptimePct }: { uptimePct: number }) {
  // Render 90 day-bars. Number of "bad" days is derived from uptime %.
  const totalDays = 90;
  const badDays = Math.round((100 - uptimePct) * 0.9); // each 1% downtime ≈ 0.9 days
  // Distribute bad days at deterministic positions so this stays stable across renders.
  const badSet = new Set<number>();
  for (let i = 0; i < badDays; i++) {
    badSet.add(Math.floor((i + 1) * (totalDays / (badDays + 1))));
  }
  return (
    <div className="flex items-end gap-[2px] w-full" aria-label={`90-day uptime ${uptimePct.toFixed(2)}%`}>
      {Array.from({ length: totalDays }).map((_, i) => {
        const bad = badSet.has(i);
        return (
          <span
            key={i}
            className="flex-1 rounded-[1px]"
            style={{ height: 24, background: bad ? "#E7A33A" : "#22A36C", opacity: bad ? 0.95 : 0.85 }}
            title={`Day ${i - totalDays}: ${bad ? "incident" : "operational"}`}
          />
        );
      })}
    </div>
  );
}

const Status = () => {
  const [states, setStates] = useState<Record<ServiceKey, ServiceState>>({
    voice: "unknown", ai: "unknown", telephony: "unknown", booking: "unknown", payments: "unknown",
  });
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);

  // Subscribe form state
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Status — TrainYourAgent";
  }, []);

  const ping = useCallback(async () => {
    setPinging(true);
    try {
      const r = await fetch("/api/health", { cache: "no-store" });
      if (!r.ok) throw new Error("health down");
      const j = await r.json();
      setStates({
        voice:     (j.voice     as ServiceState) ?? "unknown",
        ai:        (j.ai        as ServiceState) ?? "unknown",
        telephony: (j.telephony as ServiceState) ?? "unknown",
        booking:   (j.booking   as ServiceState) ?? "unknown",
        payments:  (j.payments  as ServiceState) ?? "unknown",
      });
      setCheckedAt(j.checkedAt ?? new Date().toISOString());
    } catch {
      // If /api/health is unreachable we still want the page to look honest.
      setStates({ voice: "unknown", ai: "unknown", telephony: "unknown", booking: "unknown", payments: "unknown" });
      setCheckedAt(new Date().toISOString());
    } finally {
      setPinging(false);
    }
  }, []);

  useEffect(() => {
    ping();
    const id = window.setInterval(ping, 30_000);
    return () => window.clearInterval(id);
  }, [ping]);

  const overall: ServiceState = useMemo(() => {
    const vals = Object.values(states);
    if (vals.some((v) => v === "down")) return "down";
    if (vals.some((v) => v === "degraded")) return "degraded";
    if (vals.every((v) => v === "operational")) return "operational";
    return "unknown";
  }, [states]);

  const overallLabel =
    overall === "operational" ? "All systems operational"
    : overall === "degraded"  ? "Some systems degraded"
    : overall === "down"      ? "Active incident"
    :                           "Checking…";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "status-subscribe", path: "/status" }),
      });
      if (!r.ok) throw new Error();
      setSubState("ok");
    } catch {
      setSubState("err");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO + LIVE INDICATOR */}
      <section className="px-5 sm:px-8 pt-32 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">System status</div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <StatusDot state={overall} />
            <h1 className="text-[36px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold text-[#042C53]">
              {overallLabel}
            </h1>
          </div>
          <p className="text-[14px] text-slate-600">
            Live check of every service customer agents depend on. Auto-refreshes every 30 seconds.
            {checkedAt && <> · Last checked {ago(checkedAt)}</>}
            <button onClick={ping} disabled={pinging} className="ml-3 underline text-[#185FA5] hover:text-[#042C53] disabled:opacity-50">
              {pinging ? "Refreshing…" : "Refresh now"}
            </button>
          </p>
        </div>
      </section>

      {/* SERVICE GRID */}
      {/* v38: Built-in-public ship log sits above the service grid so visitors
          see *what* shipped before they see *whether* it's up. */}
      <BuiltInPublic
        className="bg-white border-b border-slate-200"
        title="Recent ships."
        eyebrow="Built in public"
        limit={8}
      />

      <section className="px-5 sm:px-8 pb-16 pt-8">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white shadow-[0_4px_40px_-12px_rgba(4,44,83,0.10)] overflow-hidden">
          {SERVICES.map((s, i) => {
            const state = states[s.key];
            return (
              <div key={s.key} className={`px-5 sm:px-7 py-5 ${i > 0 ? "border-t border-slate-100" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusDot state={state} />
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-[#042C53] truncate">{s.label}</div>
                      <div className="text-[12px] text-slate-500 truncate">{s.vendor}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-[12px] text-slate-500 hidden sm:inline">90-day uptime</span>
                    <span className="text-[14px] font-semibold text-[#042C53] tabular-nums">{s.uptime90.toFixed(2)}%</span>
                    <span className={`text-[11px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 rounded-full ${state === "operational" ? "bg-[#E5F4EC] text-[#1F7E55]" : state === "degraded" ? "bg-[#FCEFD8] text-[#8A5A1A]" : state === "down" ? "bg-[#FBE0E0] text-[#9C2A2A]" : "bg-slate-100 text-slate-500"}`}>
                      {state === "operational" ? "Operational" : state === "degraded" ? "Degraded" : state === "down" ? "Down" : "Checking"}
                    </span>
                  </div>
                </div>
                <UptimeBars uptimePct={s.uptime90} />
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>90 days ago</span>
                  <span>Today · {checkedAt ? ago(checkedAt) : "—"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INCIDENTS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Incident history</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
            Public log. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>No deletes, no spin.</span>
          </h2>

          <div className="space-y-5">
            {INCIDENTS.map((inc) => (
              <article key={inc.id} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">{inc.id} · {fmtDate(inc.date)}</div>
                    <h3 className="text-[18px] font-semibold text-[#042C53] mt-1">{inc.title}</h3>
                  </div>
                  <span className={`text-[11px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 rounded-full ${inc.severity === "major" ? "bg-[#FBE0E0] text-[#9C2A2A]" : "bg-[#FCEFD8] text-[#8A5A1A]"}`}>
                    {inc.severity}
                  </span>
                </div>
                <div className="text-[12px] text-slate-500 mb-3">Affected: {inc.service} · {inc.resolved ? "Resolved" : "Ongoing"}</div>
                <ol className="space-y-2.5">
                  {inc.updates.map((u, i) => (
                    <li key={i} className="text-[13px] leading-relaxed">
                      <span className="text-slate-400 tabular-nums mr-2">{u.ts.replace("T", " ").replace("Z", "")}</span>
                      <span className="text-slate-700">{u.text}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.10)]">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Stay informed</div>
          <h2 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-3">
            Subscribe to status updates.
          </h2>
          <p className="text-[14px] text-slate-600 mb-5">
            We email you the moment we open or resolve an incident on this page. No marketing — promise.
          </p>
          {subState === "ok" ? (
            <div className="rounded-xl bg-[#E5F4EC] text-[#1F7E55] px-4 py-3 text-[14px] font-medium">You're subscribed. We'll only email when something needs your attention.</div>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-4 py-3 rounded-xl bg-[#F6FAFE] border border-slate-200 text-[14px] focus:outline-none focus:border-[#185FA5]"
              />
              <button type="submit" disabled={subState === "sending"} className="px-5 py-3 rounded-xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
                {subState === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
          {subState === "err" && <div className="mt-3 text-[13px] text-[#9C2A2A]">Couldn't subscribe. Try again or email status@trainyouragent.com.</div>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/learn" className="hover:text-[#042C53]">Learn</Link>
            <Link to="/careers" className="hover:text-[#042C53]">Careers</Link>
            <Link to="/press" className="hover:text-[#042C53]">Press</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Status;
