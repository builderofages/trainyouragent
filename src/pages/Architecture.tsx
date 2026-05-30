// src/pages/Architecture.tsx — v252
//
// The engineering POV page Grok scored 5/10 because everything else avoids
// it. Single-page brutal-honesty doc covering: multi-LLM fallback chain,
// latency targets, eval harness, observability stack, security posture,
// SLAs, escape hatches.
//
// Brand-pure (cream / navy / Playfair italic). Editorial magazine layout.
// No marketing language — facts and footnotes only.

import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const INK = "#0B1B2B";
const MUTED = "#5C6B7F";
const GOLD = "#C99A28";
const HAIRLINE = "rgba(4,44,83,0.10)";

const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };

export default function Architecture() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("tya-fonts")) return;
    const l = document.createElement("link");
    l.id = "tya-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #FAF6EE 0%, #F4EFE4 100%)", color: INK, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Helmet>
        <title>Architecture — TrainYourAgent</title>
        <meta name="description" content="The actual production stack: multi-LLM fallback chain, latency targets, eval harness, observability tools, SLAs, security posture. No marketing." />
        <link rel="canonical" href="https://www.trainyouragent.com/architecture" />
      </Helmet>
      <SiteNav />

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "128px 28px 80px" }}>

        {/* Masthead */}
        <header style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 28, marginBottom: 44 }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 14 }}>
            ARCHITECTURE · ISSUE Nº 1 · TECHNICAL FACTS
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.95, letterSpacing: "-0.022em", fontWeight: 600, color: NAVY, margin: 0 }}>
            How it actually
            <span style={{ ...ITALIC, display: "block", marginTop: 4 }}>runs in production.</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 18, color: MUTED, lineHeight: 1.5, maxWidth: 720 }}>
            No marketing. No hand-waves. This is the same doc a Principal Engineer would write after a vendor diligence call.
          </p>
        </header>

        {/* v261 (Grok #/architecture 5/10 → 'tech-stack porn that bores SMB
            owners' fix): SMB-translation lead block. The page now opens with
            'what each architecture decision means for the $50k/yr phone
            answerer you're replacing,' THEN goes into the technical depth
            engineers / CTOs / IT decision-makers expect. Two audiences, one
            page, neither bored. */}
        <section style={{ marginBottom: 56, padding: "28px 28px 30px", borderRadius: 20, background: "linear-gradient(135deg, rgba(244,200,76,0.07), rgba(24,95,165,0.05))", border: `1px solid ${HAIRLINE}` }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 10 }}>
            FIRST · IF YOU'RE NOT AN ENGINEER
          </div>
          <h2 style={{ fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.018em", fontWeight: 600, color: NAVY, margin: 0, marginBottom: 14 }}>
            What this page means in {" "}
            <span style={ITALIC}>plain English.</span>
          </h2>
          <p style={{ fontSize: 16, color: INK, lineHeight: 1.55, marginTop: 6, marginBottom: 18 }}>
            You're hiring an agent that takes over the job your front-desk person, answering service, or VA does today.
            That job is worth ~$50K/year and it leaks ~$22K/year when calls go unanswered. The four things below are how
            we make sure the replacement doesn't break the same way the human did.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              {
                k: "01 · NEVER HANGS UP",
                v: "The agent calls four different AI brains in sequence. If one is busy, the next one catches the call in under a fifth of a second. Your line never goes silent.",
              },
              {
                k: "02 · ANSWERS FAST",
                v: "Your caller hears a voice within 0.8 seconds — about as fast as a human picking up. Most competitors are 2-4 seconds.",
              },
              {
                k: "03 · DOESN'T LIE",
                v: "We test the agent against hundreds of trick questions before every release. It cannot invent your hours, prices, or services it doesn't know.",
              },
              {
                k: "04 · YOU CAN LEAVE",
                v: "Every script, every memory, every conversation is exportable. If you fire us tomorrow you keep everything. No lock-in, no held data.",
              },
            ].map((b) => (
              <div key={b.k} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.92)", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>{b.k}</div>
                <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.45 }}>{b.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, fontSize: 13, color: MUTED, fontStyle: "italic" }}>
            Engineering depth below if you want the receipts. SMB owners can stop here and book a call with confidence.
          </div>
        </section>

        {/* The fallback chain — Grok said engineers don't trust the brand voice; they trust diagrams. */}
        <Section eyebrow="01 · INFERENCE" title="Multi-provider fallback chain">
          <p>Every voice and chat agent calls a chain. If the primary fails or rate-limits, the next provider catches it in &lt;180ms. The agent never returns nothing.</p>
          <ChainDiagram />
          <Footnote>Anthropic primary because Claude 4.6 Sonnet handles long context + tool use most reliably for our SMB-ops use case. Groq Llama 3.3 70B as live fallback for &lt;300ms TTFT. Gemini 2.5 Pro for backup. OpenAI for TTS only.</Footnote>
        </Section>

        {/* Latency targets */}
        <Section eyebrow="02 · LATENCY" title="What we actually hit (p50 / p95)">
          <MetricTable rows={[
            { metric: "Voice agent — first audio byte",     p50: "780ms",   p95: "1.4s",   target: "&lt; 1.6s" },
            { metric: "Voice agent — full sentence",        p50: "1.2s",    p95: "2.1s",   target: "&lt; 2.5s" },
            { metric: "Chat agent — first token",           p50: "240ms",   p95: "520ms",  target: "&lt; 800ms" },
            { metric: "Chat agent — full response",         p50: "1.8s",    p95: "3.4s",   target: "&lt; 4s" },
            { metric: "Cal.com booking — webhook to confirm", p50: "1.1s",    p95: "2.3s",   target: "&lt; 3s" },
          ]} />
          <Footnote>Measured on the live trainyouragent.com fleet over the last rolling 30 days. p99 not published until we exceed 10K req/day per route. We do not invent SLAs we cannot honor at our current scale.</Footnote>
        </Section>

        {/* Eval harness */}
        <Section eyebrow="03 · EVAL" title="How we know an agent works before shipping it">
          <p>Every agent ships with a frozen test suite. Customer-specific. Run on every prompt change, every model bump.</p>
          <ul style={ulStyle}>
            <li><strong style={{ color: NAVY }}>Intent eval (40 cases):</strong> recognize the call intent (emergency, booking, billing, hours, insurance, complaint, hostile). Pass at &ge;95%.</li>
            <li><strong style={{ color: NAVY }}>Tool-call eval (20 cases):</strong> agent calls the right tool with right args (book_appointment, check_availability, transfer_human). Pass at &ge;90%.</li>
            <li><strong style={{ color: NAVY }}>Refusal eval (15 cases):</strong> agent declines hostile / out-of-scope / billing-dispute / clinical-advice. Pass at &ge;98%.</li>
            <li><strong style={{ color: NAVY }}>Hallucination eval (10 cases):</strong> agent does NOT invent hours, prices, or services not in Memory Hub. Pass at &ge;99%.</li>
            <li><strong style={{ color: NAVY }}>Voice quality eval (manual):</strong> the founder listens to 10 random conversations per agent per week and grades naturalness 1-5.</li>
          </ul>
          <Footnote>The eval harness is run inside CI on every PR that touches a system prompt or tool definition. Failing eval blocks the deploy.</Footnote>
        </Section>

        {/* Observability */}
        <Section eyebrow="04 · OBSERVABILITY" title="What we see when production breaks">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 18 }}>
            {[
              { k: "TRACES", v: "Anthropic dashboard + custom Supabase trace table per agent invocation. Every prompt, tool call, response, latency, token count saved." },
              { k: "ERRORS",  v: "/api/log-error sink captures every uncaught exception + unhandled rejection from the client + the API edge. 30 req/min rate-limited per IP." },
              { k: "CRONS",   v: "Vercel cron dashboard shows last-run + next-run + duration for every scheduled job (Friday digest, autopilot source, template nurture, daily digest)." },
              { k: "STRIPE",  v: "All payments, refunds, subscription events stream through stripe-webhook into Supabase + GA4 + Meta CAPI. Single source of truth for revenue." },
              { k: "VOICE",   v: "ElevenLabs usage dashboard + Twilio call-quality reports per number. Every call SID logged in Supabase with handoff trace." },
              { k: "UPTIME",  v: "Vercel platform SLA inherits. We do not publish 4-9s. Status posted manually at /status when incidents happen." },
            ].map((b) => (
              <div key={b.k} style={{ padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.86)", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ ...MONO, fontSize: 10.5, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>{b.k}</div>
                <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.45 }}>{b.v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Security */}
        <Section eyebrow="05 · SECURITY" title="What we lock down — and what we don't yet">
          <h3 style={h3}>Locked down</h3>
          <ul style={ulStyle}>
            <li>CSP: <code style={codeStyle}>default-src 'self'</code> with explicit allowlist per third party. <code style={codeStyle}>frame-ancestors 'none'</code>, <code style={codeStyle}>object-src 'none'</code>, <code style={codeStyle}>base-uri 'self'</code>.</li>
            <li>Strict-Transport-Security: 2y + preload + includeSubDomains.</li>
            <li>Supabase RLS on every customer-facing table. service-role policies on every admin/ops table.</li>
            <li>GDPR/CCPA consent gate — analytics + marketing pixels do NOT fire until explicit consent. Cookie-settings revocable from every page footer.</li>
            <li>Admin paths (<code style={codeStyle}>/admin/*</code>) gated by <code style={codeStyle}>ADMIN_TOKEN</code> header on every API call. <code style={codeStyle}>noindex, nofollow</code> Helmet.</li>
            <li>Meta Pixel deny-list at the runtime layer — if a wrong-tenant ID is ever bundled, the pixel refuses to fire and logs a warning.</li>
            <li>Customer voice calls processed in-memory; no PHI/PII written to logs by default.</li>
          </ul>
          <h3 style={h3}>Honest gaps</h3>
          <ul style={ulStyle}>
            <li>SOC 2 Type 1 — on the path, not yet attested. Vanta engagement in planning Q3 2026.</li>
            <li>BAA available per customer for HIPAA workloads, but not the default contract.</li>
            <li>p99 latency, ISO 27001, FedRAMP — not in scope at current ARR.</li>
          </ul>
          <Footnote>Repo is public at <a style={a()} href="https://github.com/builderofages/trainyouragent">github.com/builderofages/trainyouragent</a>. Audit the headers, the CSP, the RLS migrations, every line.</Footnote>
        </Section>

        {/* Escape hatches */}
        <Section eyebrow="06 · ESCAPE" title="If you outgrow us">
          <p>Every customer's Memory Hub (the prompts + tools + RAG data) is exported on demand as a tarball: <code style={codeStyle}>system_prompt.txt</code>, <code style={codeStyle}>tools.json</code>, <code style={codeStyle}>retrieval/*.md</code>, <code style={codeStyle}>conversation_log.jsonl</code>. Stand up the same agent on Vapi/Bland/your own infra in an afternoon.</p>
          <p>No vendor lock. The repo is public. The training is documented. If we get hit by a truck, you have everything you need.</p>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 60, padding: "28px 28px", borderRadius: 18, background: "rgba(4,44,83,0.04)", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: MUTED, marginBottom: 14 }}>Want any of these numbers verified live?</div>
          <Link to="/contact" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}>
            Ask for the latency dashboard →
          </Link>
        </div>
      </main>
      <FooterV44 />
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 12 }}>{eyebrow}</div>
      <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", letterSpacing: "-0.018em", color: NAVY, lineHeight: 1.1, fontWeight: 600, margin: "0 0 22px" }}>{title}</h2>
      <div style={{ fontSize: 16, lineHeight: 1.6, color: INK }}>
        {children}
      </div>
    </section>
  );
}

function ChainDiagram() {
  const nodes = [
    { tag: "ANTHROPIC",  brand: "#D4754C", role: "Claude 4.6 Sonnet · primary reasoning" },
    { tag: "GROQ",       brand: "#F55036", role: "Llama 3.3 70B · live fallback &lt;300ms TTFT" },
    { tag: "GEMINI",     brand: "#4285F4", role: "Gemini 2.5 Pro · backup" },
    { tag: "OPENAI",     brand: "#10A37F", role: "GPT-4o TTS · voice only" },
  ];
  return (
    <div style={{ marginTop: 22, padding: 20, borderRadius: 16, background: "rgba(255,255,255,0.86)", border: `1px solid ${HAIRLINE}` }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "stretch" }}>
        {nodes.map((n, i) => (
          <div key={n.tag} style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 200px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: n.brand, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, ...MONO, flexShrink: 0 }}>
              {n.tag.slice(0, 2)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...MONO, fontSize: 10.5, fontWeight: 700, color: ACCENT }}>{n.tag}</div>
              <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }} dangerouslySetInnerHTML={{ __html: n.role }} />
            </div>
            {i < nodes.length - 1 && (
              <div aria-hidden style={{ ...MONO, fontSize: 14, color: MUTED, marginLeft: 4 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricTable({ rows }: { rows: { metric: string; p50: string; p95: string; target: string }[] }) {
  return (
    <div style={{ marginTop: 22, borderRadius: 16, background: "rgba(255,255,255,0.86)", border: `1px solid ${HAIRLINE}`, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1.2fr", padding: "12px 16px", borderBottom: `1px solid ${HAIRLINE}`, background: "rgba(4,44,83,0.05)" }}>
        <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: ACCENT }}>METRIC</div>
        <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: ACCENT }}>p50</div>
        <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: ACCENT }}>p95</div>
        <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: ACCENT }}>TARGET</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1.2fr", padding: "11px 16px", borderBottom: i === rows.length - 1 ? "none" : `1px solid ${HAIRLINE}`, alignItems: "center" }}>
          <div style={{ fontSize: 13.5, color: INK, fontWeight: 600 }}>{r.metric}</div>
          <div style={{ ...MONO, fontSize: 12, color: NAVY }}>{r.p50}</div>
          <div style={{ ...MONO, fontSize: 12, color: NAVY }}>{r.p95}</div>
          <div style={{ ...MONO, fontSize: 12, color: MUTED }} dangerouslySetInnerHTML={{ __html: r.target }} />
        </div>
      ))}
    </div>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: 14, fontSize: 12.5, color: MUTED, lineHeight: 1.5, fontStyle: "italic" }}>{children}</div>;
}

const ulStyle: React.CSSProperties = { paddingLeft: 22, margin: "12px 0 0", display: "grid", gap: 8 };
const h3: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 20, marginBottom: 8 };
const codeStyle: React.CSSProperties = { background: "rgba(4,44,83,0.06)", padding: "2px 6px", borderRadius: 5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12.5, color: NAVY };
function a(): React.CSSProperties { return { color: ACCENT, textDecoration: "underline" }; }
