// src/pages/ApiDocsPage.tsx — v49
// Public API documentation for external builders.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { withAttribution } from "@/lib/affiliate";

type Endpoint = {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  requestSchema?: string;
  responseSchema: string;
  curl: string;
  notes?: string;
};

const ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/lead",
    title: "Submit a lead",
    description: "Server-side intake for any TrainYourAgent form. Honeypot fields and a tight allowlist of source values are enforced. Rate-limited to 5 requests per IP per hour.",
    requestSchema: `{
  "email":      "string  // required, RFC-ish email",
  "name":       "string  // optional, <=120 chars",
  "company":    "string  // optional, <=200 chars",
  "phone":      "string  // optional, <=40 chars",
  "source":     "string  // required, must be in allowlist",
  "payload":    "object  // optional, structured form data",
  "path":       "string  // optional, page path the form was on",
  "subscribeToNewsletter": "boolean  // optional",
  "attribution": "object // optional, first-touch UTM data",
  "website":    "string  // honeypot — MUST be empty",
  "hp":         "string  // honeypot — MUST be empty"
}`,
    responseSchema: `{
  "ok": true
}
// or on failure
{
  "ok": false,
  "error": "rate-limited" | "bad-source" | "bad-email" | "missing-fields" | "too-large" | "method"
}`,
    curl: `curl -X POST https://trainyouragent.com/api/lead \\
  -H 'content-type: application/json' \\
  -d '{
    "email": "ops@yourcompany.com",
    "name": "Jane Operator",
    "company": "Yourco",
    "source": "contact-form",
    "path": "/contact",
    "payload": { "use_case": "voice agent for HVAC dispatch" },
    "website": "",
    "hp": ""
  }'`,
    notes: "Source allowlist includes: newsletter, contact-form, demo-request, partner-apply, careers-self-pitch, investor-inquiry, docs-feedback, api-access-request, affiliate-application, and many more. See the source list section below.",
  },
  {
    method: "POST",
    path: "/api/event",
    title: "Record a lightweight event",
    description: "Fire-and-forget telemetry pixel. Lower friction than /api/lead — no email required. Used internally for site-visit, scroll-depth, and intent signals.",
    requestSchema: `{
  "event_type": "string  // required, must be in allowlist",
  "path":       "string  // optional, page path",
  "session":    "string  // optional, opaque session id",
  "props":      "object  // optional, small structured payload"
}`,
    responseSchema: `{ "ok": true }`,
    curl: `curl -X POST https://trainyouragent.com/api/event \\
  -H 'content-type: application/json' \\
  -d '{
    "event_type": "site_visit",
    "path": "/pricing",
    "props": { "ref": "twitter" }
  }'`,
  },
  {
    method: "GET",
    path: "/api/public-metrics",
    title: "Public business + website metrics",
    description: "Snapshot of the numbers that power the /metrics page. Updated continuously from the lead store and a small founder-curated business stats block.",
    responseSchema: `{
  "ok": true,
  "generatedAt": "ISO timestamp",
  "business": {
    "yearsInAi":      "number",
    "mrrFloorUsd":    "number",
    "livePages":      "number",
    "blogPosts":      "number",
    "shipsThisYear":  "number"
  },
  "websiteKpi": {
    "leadsLast30d":      "number",
    "leadsLast7d":       "number",
    "leadsLast24h":      "number",
    "demosBookedLast30d":"number",
    "purchasesLast30d":  "number"
  },
  "signupSeries": [{ "day": "YYYY-MM-DD", "count": "number" }],
  "live":   { "uptime": "string", "responseTimeMs": "number" },
  "events": [{ "ts": "number", "type": "string", "maskedSource": "string" }]
}`,
    curl: `curl https://trainyouragent.com/api/public-metrics`,
  },
  {
    method: "GET",
    path: "/api/recent-activity",
    title: "Recent activity ticker",
    description: "Anonymized stream of recent leads, bookings, and site activity. Used by the live activity ticker on the homepage.",
    responseSchema: `{
  "ok": true,
  "items": [
    {
      "ts": "number  // unix ms",
      "type": "lead | booking | visit | tool",
      "label": "string  // human-readable, e.g. 'Operator in Tampa booked a call'",
      "city": "string  // coarse, city only"
    }
  ]
}`,
    curl: `curl https://trainyouragent.com/api/recent-activity`,
  },
  {
    method: "GET",
    path: "/api/og",
    title: "Dynamic OG image generator",
    description: "Server-side rendered Open Graph image for share previews. Returns a PNG sized 1200x630. Two type variants — default and trust — control the layout.",
    requestSchema: `Query string parameters:
  title    string   // required, primary text
  subtitle string   // optional, secondary text
  type     string   // optional, 'default' | 'trust'
  badge    string   // optional, small uppercase tag in top-left`,
    responseSchema: `Content-Type: image/png
A 1200x630 PNG suitable for og:image and twitter:image tags.`,
    curl: `curl "https://trainyouragent.com/api/og?title=Voice%20agents%20that%20answer&subtitle=Built%20for%20operators&type=default&badge=LIVE" -o og.png`,
  },
];

const SOURCES_LIST = [
  "newsletter", "newsletter-floater", "newsletter-page", "blog-cta", "buyers-guide",
  "contact", "contact-form", "demo-request", "roi-calc", "pathway-router",
  "tool:cost-estimator", "tool:roi-calculator", "tool:prompt-critic",
  "tool:scenario-generator", "tool:latency-simulator", "tool:prompt-library",
  "tool:model-selector", "tool:automation-roi",
  "community-win", "partner-apply", "report-state-of-ai-ops-2026",
  "demo:objections", "demo:sop", "demo:seo",
  "agency-partner", "trial-request", "research-partners", "status-subscribe",
  "industry_faq", "implementation_timeline", "multi_step_form", "exit_popup",
  "lead_gate_completion", "faq_section",
  "press-inquiry", "speaking-request", "podcast-guest-request",
  "security-questionnaire-request", "gdpr-deletion-request",
  "enterprise-security-call", "local-city-request",
  "docs-feedback", "api-access-request", "investor-inquiry",
  "affiliate-application", "careers-self-pitch",
];

function setHead() {
  if (typeof document === "undefined") return;
  document.title = "API docs — TrainYourAgent";
  const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", value);
  };
  setMeta("meta[name='description']", "name", "description", "Public API documentation for TrainYourAgent — leads, events, metrics, recent activity, and OG image endpoints.");
  let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = "https://trainyouragent.com/api-docs";
  if (!document.getElementById("tya-fonts")) {
    const l = document.createElement("link");
    l.id = "tya-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }
}

function MethodBadge({ m }: { m: "GET" | "POST" }) {
  const cls = m === "GET" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-blue-100 text-blue-800 border-blue-200";
  return <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${cls}`}>{m}</span>;
}

function CodeBlock({ text }: { text: string }) {
  return (
    <pre className="p-4 rounded-xl bg-[#0B1B2B] text-[#E6F1FB] text-[12.5px] leading-relaxed overflow-x-auto"><code>{text}</code></pre>
  );
}

function ApiAccessForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = withAttribution({
      email: String(fd.get("email") || ""),
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      source: "api-access-request",
      path: "/api-docs",
      payload: { use_case: String(fd.get("use_case") || ""), volume: String(fd.get("volume") || "") },
      website: "", hp: "",
    });
    setState("sending");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState("sent");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e2: any) {
      setState("error");
      setErr(e2?.message || "Network error");
    }
  }
  if (state === "sent") {
    return <div className="rounded-2xl bg-[#E6F1FB] border border-[#185FA5]/30 p-6 text-[#042C53] text-[14px]">Got it. Alexander reviews every API access request and will reply within 5 business days.</div>;
  }
  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      <input name="name" required placeholder="Name" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="company" placeholder="Company" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <input name="volume" placeholder="Expected request volume / month" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <textarea name="use_case" required rows={3} placeholder="What are you building?" className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] sm:col-span-2" />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button disabled={state === "sending"} className="px-6 py-3 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Request access →"}
        </button>
        {state === "error" && <span className="text-[12px] text-red-700">{err}</span>}
      </div>
    </form>
  );
}

export default function ApiDocsPage() {
  useEffect(() => { setHead(); }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-32 pb-10 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">API · Public endpoints</div>
          <h1 className="text-[40px] sm:text-[60px] leading-[1.04] font-semibold text-[#042C53] tracking-tight">
            Build on TrainYourAgent. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Five honest endpoints.</span>
          </h1>
          <p className="mt-5 text-[16px] sm:text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            The endpoints below are public. Lead intake, lightweight event telemetry, public business metrics, the recent-activity ticker, and our dynamic Open Graph image generator. No API key required for any of them — they are designed to be safe to call from a static site or a script.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-5">
          {ENDPOINTS.map((e) => (
            <details key={e.path} className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
              <summary className="cursor-pointer list-none p-6 sm:p-7 flex items-start justify-between gap-4 hover:bg-[#F6FAFE]">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <MethodBadge m={e.method} />
                    <code className="text-[14px] sm:text-[15px] font-mono text-[#042C53] font-semibold break-all">{e.path}</code>
                  </div>
                  <div className="text-[16px] font-semibold text-[#042C53]">{e.title}</div>
                  <div className="text-[13.5px] text-slate-600 mt-1 leading-snug">{e.description}</div>
                </div>
                <span className="text-[12px] text-[#185FA5] font-semibold flex-shrink-0 mt-1">expand ▾</span>
              </summary>
              <div className="px-6 sm:px-7 pb-7 space-y-5 border-t border-slate-100">
                {e.requestSchema && (
                  <div className="pt-5">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Request</div>
                    <CodeBlock text={e.requestSchema} />
                  </div>
                )}
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Response</div>
                  <CodeBlock text={e.responseSchema} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Example</div>
                  <CodeBlock text={e.curl} />
                </div>
                {e.notes && (
                  <div className="text-[13px] text-slate-600 leading-relaxed border-l-2 border-[#185FA5]/30 pl-3">{e.notes}</div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-10 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Source allowlist</div>
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-[#042C53] mb-3">Accepted <code className="text-[18px] font-mono">source</code> values for <code className="text-[18px] font-mono">/api/lead</code></h2>
          <p className="text-[14px] text-slate-700 mb-4 leading-relaxed">
            Anything not in this list returns <code className="font-mono">{`{ ok: false, error: "bad-source" }`}</code> and is logged.
          </p>
          <div className="flex flex-wrap gap-2">
            {SOURCES_LIST.map((s) => (
              <code key={s} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[12px] font-mono text-[#042C53]">{s}</code>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">API key</div>
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-[#042C53] mb-3">Want a real API key?</h2>
          <p className="text-[14px] text-slate-700 mb-5 leading-relaxed">
            The public endpoints above are intentionally limited. If you are building something serious and need higher rate limits, private endpoints, or webhook delivery, request access below.
          </p>
          <ApiAccessForm />
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 bg-[#042C53] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[22px] sm:text-[28px] font-semibold mb-2">Read the docs next.</h2>
          <p className="text-[14px] text-white/85 mb-5">If you are evaluating us, the help center walks through what we ship.</p>
          <Link to="/docs" className="inline-block px-6 py-3 rounded-2xl bg-white text-[#042C53] text-[14px] font-semibold hover:bg-[#E6F1FB]">Docs →</Link>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
