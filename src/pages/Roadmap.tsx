// src/pages/Roadmap.tsx
// v50A: Public roadmap with voting (localStorage + /api/event analytics).
// 20 real items split across In progress / Next up / Considering.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const STORAGE_KEY = "tya_votes";

function BrainLogo({ size = 40 }: { size?: number }) {
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

type Column = "in_progress" | "next_up" | "considering";
type Item = {
  id: string;
  title: string;
  description: string;
  why: string;
  column: Column;
  baseVotes: number;
};

const ITEMS: Item[] = [
  // In progress (3)
  { id: "voice-v3-sub-500ms",    column: "in_progress", baseVotes: 142, title: "Voice agent v3 with sub-500ms response",      description: "End-to-end latency under 500ms for the median turn — TTS + STT + reasoning rewritten in parallel.", why: "Sub-second feels human; over a second feels like a robot. The current p50 is 980ms and operators are losing the close-rate edge to live agents." },
  { id: "hubspot-bidirectional", column: "in_progress", baseVotes: 118, title: "Native HubSpot bidirectional sync",            description: "Two-way sync of contacts, deals, notes, and calls — no Zapier in the middle.", why: "Half of operator-tier customers use HubSpot. Reading is fine via API today; writing back is where 'why did the agent not log my call?' tickets come from." },
  { id: "agent-ab-testing",      column: "in_progress", baseVotes:  97, title: "Agent A/B testing framework",                  description: "Route a % of calls/chats to variant B, measure book-rate and qualification accuracy, promote winners.", why: "Customers ship a new prompt and have no way to know if it actually performed better. This makes iteration measurable." },

  // Next up (5)
  { id: "outbound-campaigns",        column: "next_up", baseVotes: 86, title: "Outbound call campaigns",                       description: "Schedule outbound dialing into a list with retry rules, voicemail drops, and call-back routing.", why: "Inbound-only is half the agent value. Outbound unlocks the abandoned-form follow-up and renewal-call use cases." },
  { id: "slack-transcript-notifs",   column: "next_up", baseVotes: 71, title: "Slack notifications for agent transcripts",     description: "Per-channel rules: 'ping #sales when an agent qualifies a deal >$10k' kind of stuff.", why: "Operators want the team to feel the agent without having to log into a dashboard." },
  { id: "multilang-voice-es",        column: "next_up", baseVotes: 64, title: "Multi-language voice agents (Spanish first)",   description: "Spanish-native voice agent with code-switching tolerance for mixed-language inbound.", why: "Healthcare, automotive, and home services in TX/CA/FL leave 30%+ of inbound calls on the table without Spanish coverage." },
  { id: "agent-persona-library",     column: "next_up", baseVotes: 52, title: "Agent persona library",                         description: "Starter personas (warm-and-fast, dryly-professional, technical-deep) you can fork instead of writing from scratch.", why: "Most customers spend the first week tuning tone. A library shortens time-to-live by 5–7 days." },
  { id: "self-serve-onboarding",     column: "next_up", baseVotes: 49, title: "Self-serve onboarding (no founder call required)", description: "A guided flow that takes a customer from sign-up to first deployed agent without a Cal booking.", why: "Founder calls are the bottleneck. Self-serve doesn't replace high-touch — it widens the top of the funnel." },

  // Considering (12)
  { id: "white-label-agencies",      column: "considering", baseVotes: 88, title: "White-label deployment for agencies",       description: "Brand the dashboard, the customer portal, and the email notifications under the agency's mark.", why: "Multiple agency partners have asked. Unlocks a reseller motion without us building a separate sales team." },
  { id: "mobile-live-monitoring",    column: "considering", baseVotes: 67, title: "Mobile app for live monitoring",            description: "iOS/Android app to listen in on live calls, hand off to human, approve agent edits.", why: "Field operators want to take an agent live and not be chained to a desk to babysit it." },
  { id: "webhook-fanout-any-crm",    column: "considering", baseVotes: 61, title: "Webhook fan-out for any CRM",               description: "Generic webhook + transformer step so customers can wire to Pipedrive, Close, Zoho, FollowUpBoss, etc. themselves.", why: "Native integrations don't scale. A solid webhook story covers the long tail." },
  { id: "public-benchmarks",         column: "considering", baseVotes: 58, title: "Public benchmarks page (latency, accuracy)", description: "Real numbers, updated weekly, for latency p50/p95, intent-classification accuracy, and book-rate vs. live agents.", why: "Trust the metrics or don't buy from us. Most competitors hide their numbers — we shouldn't." },
  { id: "analytics-export",          column: "considering", baseVotes: 47, title: "Customer-facing analytics export",          description: "CSV / Looker / Tableau pulls of all agent activity + outcomes.", why: "Ops teams want to slice the data their way without having to ask us for a report." },
  { id: "sso-okta-azure",            column: "considering", baseVotes: 44, title: "SSO via Okta/Azure AD",                     description: "SAML + SCIM for enterprise IT teams that won't let you onboard without it.", why: "Required to close anything over 500 employees. Most deals at that size die at procurement without it." },
  { id: "voice-cloning-consent",     column: "considering", baseVotes: 39, title: "Custom voice cloning (with consent flow)",  description: "Clone a real person's voice for outbound — gated by explicit consent capture and a recorded disclosure.", why: "Personalization edge for renewals + win-backs. Done wrong it's a liability — that's why the consent flow is the product, not the cloning." },
  { id: "compliance-hipaa",          column: "considering", baseVotes: 36, title: "Compliance pack for HIPAA",                 description: "BAA, audit log retention, PHI redaction in transcripts, signed sub-processor list.", why: "Healthcare is a top-3 vertical for us but every deal stalls until the BAA paperwork ships." },
  { id: "compliance-finserv",        column: "considering", baseVotes: 31, title: "Compliance pack for financial services",    description: "SOC 2 Type II in audit, call-recording disclosures, PCI-aware redaction, regulator-friendly retention.", why: "Adjacent to HIPAA. Unlocks insurance, lending, wealth management." },
  { id: "open-source-sdk",           column: "considering", baseVotes: 28, title: "Open-source agent SDK",                     description: "OSS package developers can use to build their own agents on top of the TYA runtime.", why: "Developer trust + community contributions + a recruiting flywheel. Long-term moat, not a Q1 line item." },
  { id: "prompt-template-market",    column: "considering", baseVotes: 24, title: "Marketplace for prompts/templates",         description: "Buy-and-sell vertical-specific prompt packs (HVAC dispatcher, dental scheduler, etc.) with revenue share.", why: "Surface the work practitioners already do for each other. Gives operators a side income, gives buyers a head start." },
  { id: "annual-pricing-tier",       column: "considering", baseVotes: 19, title: "Annual pricing tier",                       description: "Pay-annual discount with a true-up at renewal.", why: "Lots of finance teams want a single annual PO instead of monthly Stripe charges." },
];

const COLUMNS: { id: Column; title: string; subtitle: string }[] = [
  { id: "in_progress", title: "In progress", subtitle: "Shipping in the next 4–6 weeks." },
  { id: "next_up",     title: "Next up",     subtitle: "Picked up after current cycle." },
  { id: "considering", title: "Considering", subtitle: "Voting helps us prioritize." },
];

export default function Roadmap() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [votes, setVotes] = useState<Record<string, true>>({});
  const [suggestion, setSuggestion] = useState({ title: "", description: "", email: "" });
  const [suggestState, setSuggestState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Public roadmap — TrainYourAgent";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setVotes(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  const upvote = useCallback((item: Item) => {
    setVotes((prev) => {
      if (prev[item.id]) return prev;
      const next = { ...prev, [item.id]: true as const };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      try {
        fetch("/api/event", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ event_type: "roadmap_upvote", source: "roadmap", meta: { itemId: item.id, itemTitle: item.title } }),
        }).catch(() => { /* ignore */ });
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestion.email || !suggestion.title) return;
    setSuggestState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: suggestion.email,
          source: "roadmap-suggestion",
          path: "/roadmap",
          payload: { title: suggestion.title, description: suggestion.description },
        }),
      });
      setSuggestState(r.ok ? "sent" : "error");
      if (r.ok) setSuggestion({ title: "", description: "", email: "" });
    } catch { setSuggestState("error"); }
  }

  const byColumn = useMemo(() => {
    const map: Record<Column, Item[]> = { in_progress: [], next_up: [], considering: [] };
    for (const it of ITEMS) map[it.column].push(it);
    for (const c of Object.keys(map) as Column[]) {
      map[c].sort((a, b) => (b.baseVotes + (votes[b.id] ? 1 : 0)) - (a.baseVotes + (votes[a.id] ? 1 : 0)));
    }
    return map;
  }, [votes]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Public roadmap</div>
          <h1 className="text-[32px] sm:text-[48px] md:text-[60px] leading-[1.06] sm:leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Vote on what we <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>build next.</span>
          </h1>
          <p className="mt-5 text-[16px] text-slate-600">
            Honest list of what's in flight, what's queued, and what we're thinking about. Upvotes are first-come; they help us pick the order, not the verdict.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4">
                <h2 className="text-[18px] font-semibold text-[#042C53]">{col.title}</h2>
                <p className="text-[12px] text-slate-600 mt-1">{col.subtitle}</p>
                <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-400 font-semibold">{byColumn[col.id].length} item{byColumn[col.id].length === 1 ? "" : "s"}</div>
              </div>
              <div className="space-y-3">
                {byColumn[col.id].map((it) => {
                  const voted = !!votes[it.id];
                  const count = it.baseVotes + (voted ? 1 : 0);
                  return (
                    <article key={it.id} className="rounded-xl border border-slate-200 p-4 hover:border-[#185FA5] transition">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => upvote(it)}
                          disabled={voted}
                          aria-label={voted ? `Voted for ${it.title}` : `Upvote ${it.title}`}
                          className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg border text-[13px] font-semibold transition ${voted ? "bg-[#185FA5] text-white border-[#185FA5] cursor-default" : "bg-white text-[#042C53] border-slate-300 hover:border-[#185FA5] hover:bg-[#E6F1FB]"}`}
                        >
                          <span aria-hidden="true">&#9650;</span>
                          <span>{count}</span>
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-semibold text-[#042C53] leading-snug">{it.title}</h3>
                          <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{it.description}</p>
                          <details className="mt-2 text-[12px] text-[#185FA5]">
                            <summary className="cursor-pointer hover:underline">Why?</summary>
                            <p className="mt-2 text-slate-700 leading-relaxed">{it.why}</p>
                          </details>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[24px] font-semibold text-[#042C53] mb-2">Suggest something</h2>
          <p className="text-[14px] text-slate-600 mb-6">Missing from the list? Tell us. We read every one and reply if it's a fit.</p>
          <form onSubmit={submitSuggestion} className="rounded-2xl border border-slate-200 p-6 space-y-4 bg-[#E6F1FB]/20">
            <label className="block">
              <span className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold">Title</span>
              <input type="text" required value={suggestion.title} onChange={(e) => setSuggestion((s) => ({ ...s, title: e.target.value }))} placeholder="Short, action-oriented (e.g. 'Native Salesforce sync')" className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#185FA5] focus:outline-none text-[14px]" />
            </label>
            <label className="block">
              <span className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold">Description</span>
              <textarea value={suggestion.description} onChange={(e) => setSuggestion((s) => ({ ...s, description: e.target.value }))} placeholder="What problem does it solve? Who needs it?" rows={4} className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#185FA5] focus:outline-none text-[14px]" />
            </label>
            <label className="block">
              <span className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold">Your email</span>
              <input type="email" required value={suggestion.email} onChange={(e) => setSuggestion((s) => ({ ...s, email: e.target.value }))} placeholder="you@company.com" className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#185FA5] focus:outline-none text-[14px]" />
            </label>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">We'll reply if it's a fit. No mailing list.</span>
              <button type="submit" disabled={suggestState === "sending"} className="px-5 py-2.5 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0A3D6E] disabled:opacity-60">
                {suggestState === "sending" ? "Sending..." : suggestState === "sent" ? "Thanks — we'll be in touch" : "Send suggestion"}
              </button>
            </div>
            {suggestState === "error" && <div className="text-[13px] text-rose-600">Something went wrong — try again or email hello@trainyouragent.com.</div>}
          </form>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
            <Link to="/changelog" className="hover:text-[#042C53]">Changelog</Link>
            <Link to="/portal" className="hover:text-[#042C53]">Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
