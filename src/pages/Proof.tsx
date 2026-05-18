// v58 — /proof — the cornerstone trust page.
// Every number on this page is verifiable against a public source (GitHub,
// /api/sitemap.xml, the live site itself). Every architecture claim links to
// the actual file in the public repo. The closing section is the honest
// gap: pre-customer, founding-customer offer, with the disqualification
// list intact so the wrong-fit buyer self-deselects.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import ShippedThisWeek from "@/components/ShippedThisWeek";
import CommitGraph from "@/components/CommitGraph";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const REPO = "https://github.com/builderofages/trainyouragent";
const FIRST_COMMIT_MS = Date.parse("2025-11-07T20:25:45Z");
const ENDPOINT = "/api/lead";

type Velocity = {
  commitsLast7d: number | null;
  commitsLast30d: number | null;
  commitsToday: number | null;
  daysPublic: number | null;
};

function loadFonts() {
  if (document.getElementById("tya-fonts")) return;
  const l = document.createElement("link");
  l.id = "tya-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
  document.head.appendChild(l);
}

function useGitHubVelocity(): Velocity {
  const [v, setV] = useState<Velocity>({
    commitsLast7d: null,
    commitsLast30d: null,
    commitsToday: null,
    daysPublic: null,
  });
  useEffect(() => {
    const CACHE_KEY = "tya:velocity:v1";
    const CACHE_TS = "tya:velocity:ts:v1";
    const MAX_AGE = 1000 * 60 * 30;
    try {
      const ts = Number(localStorage.getItem(CACHE_TS) || "0");
      const raw = localStorage.getItem(CACHE_KEY);
      if (ts && raw && Date.now() - ts < MAX_AGE) {
        setV(JSON.parse(raw));
        return;
      }
    } catch { /* ignore */ }
    (async () => {
      try {
        const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
        const r = await fetch(
          `https://api.github.com/repos/builderofages/trainyouragent/commits?since=${since30}&per_page=100`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!r.ok) return;
        const commits = (await r.json()) as Array<{ commit?: { author?: { date?: string } } }>;
        const now = Date.now();
        const day = 86400000;
        const sod = new Date(); sod.setHours(0, 0, 0, 0);
        const commitsToday = commits.filter(c => {
          const d = c.commit?.author?.date ? new Date(c.commit.author.date).getTime() : 0;
          return d >= sod.getTime();
        }).length;
        const commitsLast7d = commits.filter(c => {
          const d = c.commit?.author?.date ? new Date(c.commit.author.date).getTime() : 0;
          return d >= now - 7 * day;
        }).length;
        const daysPublic = Math.max(1, Math.floor((now - FIRST_COMMIT_MS) / day));
        const next: Velocity = {
          commitsToday,
          commitsLast7d,
          commitsLast30d: commits.length,
          daysPublic,
        };
        setV(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
          localStorage.setItem(CACHE_TS, String(Date.now()));
        } catch { /* ignore */ }
      } catch { /* swallow */ }
    })();
  }, []);
  return v;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-[32px] font-semibold leading-none" style={{ color: NAVY, fontFamily: SERIF_ITALIC }}>
        {value}
      </div>
      {sub && <div className="mt-2 text-[12px] text-slate-500">{sub}</div>}
    </div>
  );
}

function Receipt({
  claim,
  link,
  linkLabel,
  detail,
}: {
  claim: string;
  link: string;
  linkLabel: string;
  detail: string;
}) {
  const isExternal = link.startsWith("http");
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-[15px] font-semibold text-[#042C53]">{claim}</div>
      <p className="mt-1.5 text-[14px] text-slate-700 leading-[1.65]">{detail}</p>
      {isExternal ? (
        <a
          href={link}
          target="_blank"
          rel="noopener"
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[#185FA5] hover:text-[#042C53] font-medium"
        >
          {linkLabel} <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <Link to={link} className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[#185FA5] hover:text-[#042C53] font-medium">
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </li>
  );
}

function FoundingCustomerForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          source: "founding-customer-apply",
          path: location.pathname,
          website: hp,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("ok");
    } catch {
      setState("err");
    }
  };

  if (state === "ok") {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-emerald-900">
        <div className="font-semibold text-[16px]">Got it. Alexander will reply within 24 hours.</div>
        <p className="text-[14px] mt-1.5 opacity-90">
          If you're a fit, you'll be in the first 10 — locked-in pricing, direct line, named on this page once we have results to show.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <input
        type="text"
        name="website"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px" }}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/70 text-[14px]"
        />
        <input
          type="text"
          placeholder="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/70 text-[14px]"
        />
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full px-6 py-3.5 rounded-xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 transition disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Apply for a founding-customer slot"}
      </button>
      {state === "err" && (
        <p className="text-[13px] text-red-200">Network blip. Try again in a moment.</p>
      )}
      <p className="text-[12px] text-white/70">
        Direct to Alexander. No SDR funnel, no nurture sequence. One reply, within 24 hours.
      </p>
    </form>
  );
}

export default function Proof() {
  const v = useGitHubVelocity();

  useEffect(() => {
    document.title = "Proof — not pitches. | TrainYourAgent";
    loadFonts();
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = "https://trainyouragent.com/proof";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "Pre-customer in this exact configuration. Every claim on this page links to the receipt — public commits, architecture diffs, security audits, the live sitemap. No testimonials yet — here's everything that IS verifiable.";
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        {/* HERO */}
        <section className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold tracking-[0.12em] uppercase mb-5">
            Pre-customer · Founding slots open
          </div>
          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] leading-[1.02] tracking-tight font-semibold" style={{ color: NAVY }}>
            Proof —{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              not pitches.
            </span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-3xl">
            We're pre-customer in this exact site/product configuration. Here's everything verifiable about how we ship — every claim links to the receipt.
          </p>
          <p className="mt-4 text-[14px] text-slate-500 max-w-3xl">
            If you're used to vendor pages with logo walls and testimonial carousels, this won't feel like one. It's not supposed to. The signal you're looking for is whether the operator behind this is the kind of person you want building agents for your business — and the only honest way to demonstrate that today is to show the receipts for how we ship.
          </p>
        </section>

        {/* A. OPERATOR VELOCITY */}
        <section className="max-w-5xl mx-auto mt-16" aria-labelledby="velocity-h">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
            Section A
          </div>
          <h2 id="velocity-h" className="text-[28px] sm:text-[36px] font-semibold tracking-tight" style={{ color: NAVY }}>
            Operator velocity — live from GitHub.
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 max-w-3xl">
            Every number below is checkable against{" "}
            <a href={REPO} target="_blank" rel="noopener" className="text-[#185FA5] underline underline-offset-2">
              {REPO.replace("https://", "")}
            </a>. If you don't trust the cached number, click through and count.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <Stat label="Commits today" value={v.commitsToday === null ? "—" : String(v.commitsToday)} sub="resets at local midnight" />
            <Stat label="Commits last 7d" value={v.commitsLast7d === null ? "—" : String(v.commitsLast7d)} sub="all on main" />
            <Stat label="Commits last 30d" value={v.commitsLast30d === null ? "—" : String(v.commitsLast30d)} sub="sustained ship rate" />
            <Stat label="Days building public" value={v.daysPublic === null ? "—" : String(v.daysPublic)} sub="since first commit" />
          </div>
          {/* v59: live 90-day commit heatmap, GitHub-style */}
          <div className="mt-6">
            <CommitGraph />
          </div>
          <div className="mt-6">
            <ShippedThisWeek />
          </div>
        </section>

        {/* B. ARCHITECTURE PROOF */}
        <section className="max-w-5xl mx-auto mt-20" aria-labelledby="arch-h">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
            Section B
          </div>
          <h2 id="arch-h" className="text-[28px] sm:text-[36px] font-semibold tracking-tight" style={{ color: NAVY }}>
            Architecture proof — every claim links to the code.
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 max-w-3xl">
            Most agency pages say "we use best-in-class infra." This is the diff. Click any link to read the actual implementation in the public repo.
          </p>
          <ul className="mt-6 space-y-3">
            <Receipt
              claim="Multi-provider LLM fallback chain (Anthropic → Groq → Gemini)."
              detail="Demos never go dark when one provider hits rate limits or runs out of credits. The router degrades gracefully, never errors visibly to the user."
              link={`${REPO}/blob/main/api/_lib/llm.ts`}
              linkLabel="Read api/_lib/llm.ts"
            />
            <Receipt
              claim="Stripe webhook signature verification, using the official SDK."
              detail="Every Stripe event is verified against the signing secret before any state mutates. No naive 'trust the POST body' anti-pattern."
              link={`${REPO}/blob/main/api/stripe-webhook.ts`}
              linkLabel="Read api/stripe-webhook.ts"
            />
            <Receipt
              claim="Cal.com webhook HMAC verification on booking events."
              detail="Inbound booking webhooks are signature-checked. A spoofed booking can't poison the lead store or trigger downstream notifications."
              link={`${REPO}/blob/main/api/cal-webhook.ts`}
              linkLabel="Read api/cal-webhook.ts"
            />
            <Receipt
              claim="Per-IP rate limiting on every public endpoint."
              detail="A single dumb token-bucket implementation, applied everywhere. 5 req/IP/hour on the lead form. 120 req/IP/hour on /api/public-metrics. Edge-runtime friendly."
              link={`${REPO}/blob/main/api/_lib/rate-limit.ts`}
              linkLabel="Read api/_lib/rate-limit.ts"
            />
            <Receipt
              claim="Strict CSP, HSTS preload, Permissions-Policy — all in vercel.json."
              detail="default-src 'self' with an explicit allowlist for Cal, Stripe, ElevenLabs, Plausible. frame-ancestors 'none'. HSTS with includeSubDomains and preload. Browser features locked down."
              link={`${REPO}/blob/main/vercel.json`}
              linkLabel="Read vercel.json"
            />
            <Receipt
              claim="Visitor pathway personalization — niche-aware hero copy."
              detail="A small React context tracks the visitor's pathway choice (niche, role, intent) across page loads. Used by Index, ContextPill, and the playbook pages to swap copy without flashing default content."
              link={`${REPO}/blob/main/src/lib/visitorContext.tsx`}
              linkLabel="Read src/lib/visitorContext.tsx"
            />
            <Receipt
              claim="Server-side prompt engineering against injection."
              detail="The chat endpoint composes the system prompt server-side and never trusts user-supplied roles or system messages from the client. Untrusted content is fenced and quoted before being sent to the model."
              link={`${REPO}/blob/main/api/chat.ts`}
              linkLabel="Read api/chat.ts"
            />
            <Receipt
              claim="Supabase Row Level Security on lead and event tables."
              detail="anon role can't read tya_leads or tya_events. Service-role key is held only in Vercel env. The lead-store falls back to in-memory if Supabase isn't provisioned, so the site never goes dark on a config issue."
              link={`${REPO}/blob/main/api/_lib/lead-store.ts`}
              linkLabel="Read api/_lib/lead-store.ts"
            />
          </ul>
        </section>

        {/* C. SCALE */}
        <section className="max-w-5xl mx-auto mt-20" aria-labelledby="scale-h">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
            Section C
          </div>
          <h2 id="scale-h" className="text-[28px] sm:text-[36px] font-semibold tracking-tight" style={{ color: NAVY }}>
            Page + content scale.
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 max-w-3xl">
            Every count below is countable. Click through to verify.
          </p>
          <ul className="mt-6 space-y-3">
            <Receipt
              claim="564 live URLs across the site."
              detail="Every URL is in the sitemap. Open the file and count if you want — that's the point of publishing it."
              link="/api/sitemap.xml"
              linkLabel="Open /api/sitemap.xml"
            />
            <Receipt
              claim="70 long-form blog posts."
              detail="Operator playbooks, voice/chat agent deep dives, vertical analysis, infrastructure write-ups. Each cites its sources."
              link="/blog"
              linkLabel="Browse /blog"
            />
            <Receipt
              claim="15 hand-edited niche playbooks with cited industry data."
              detail="HVAC, roofing, plumbing, electrical, landscaping, dental, med-spa, law-firm, real-estate, property-management, restaurant, auto-repair, insurance, fitness, pest-control. ~2,000 words each. Written against real operator conversations, not generated."
              link="/playbooks"
              linkLabel="Browse /playbooks"
            />
            <Receipt
              claim="9 free working tools — all client-side, all useful, all under 90 seconds."
              detail="Cost estimator, ROI calculator, prompt critic, scenario generator, latency simulator, prompt library, model selector, automation ROI, vendor matrix."
              link="/tools"
              linkLabel="Use a tool"
            />
            <Receipt
              claim="7 live AI demo modes via Groq's free tier."
              detail="Voice agent in the browser (Web Speech + Groq Llama), sales objection handler, SOP writer, SEO cluster generator, and more. Real model calls, zero ongoing cost to us, zero account-creation friction for you."
              link="/demos"
              linkLabel="Try a demo"
            />
          </ul>
        </section>

        {/* D. SECURITY POSTURE */}
        <section className="max-w-5xl mx-auto mt-20" aria-labelledby="security-h">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
            Section D
          </div>
          <h2 id="security-h" className="text-[28px] sm:text-[36px] font-semibold tracking-tight" style={{ color: NAVY }}>
            Security posture — auditable artifacts.
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 max-w-3xl">
            We don't claim SOC 2. We're a one-person company. What we have are real audit artifacts in the repo, a real disclosure email, and a real zero in the right places.
          </p>
          <ul className="mt-6 space-y-3">
            <Receipt
              claim="Full security audit, committed to the repo."
              detail="Walked the codebase for secret leakage, RLS gaps, missing rate limits, header config, and dependency risk. Every finding logged with the fix or the residual-risk note."
              link={`${REPO}/blob/main/SECURITY_AUDIT.md`}
              linkLabel="Read SECURITY_AUDIT.md"
            />
            <Receipt
              claim="Vulnerability disclosure policy."
              detail="security@trainyouragent.com. 24-hour first response commitment. No bug-bounty payouts yet (we're pre-customer), but real triage."
              link={`${REPO}/blob/main/SECURITY.md`}
              linkLabel="Read SECURITY.md"
            />
            <Receipt
              claim="Most recent functional + security re-audit."
              detail="Walked every primary user flow as if a sophisticated customer were buying. Every gap and bug captured in the file before pushing the fix."
              link={`${REPO}/blob/main/FINAL_AUDIT.md`}
              linkLabel="Read FINAL_AUDIT.md"
            />
            <Receipt
              claim="0 secrets in the git history."
              detail="Anyone cloning the repo can confirm: no .env files committed, no API keys in source, no service-role keys leaked in older commits. .env.example documents every required variable with a placeholder."
              link={`${REPO}/blob/main/.env.example`}
              linkLabel="Read .env.example"
            />
            <Receipt
              claim="0 npm audit vulnerabilities at last build."
              detail="Output committed in the security audit. The dependency tree is kept clean; we don't ship with known-vulnerable packages."
              link={`${REPO}/blob/main/SECURITY_AUDIT.md`}
              linkLabel="See audit output"
            />
          </ul>
        </section>

        {/* E. THE HONEST GAP */}
        <section className="max-w-5xl mx-auto mt-24">
          <div className="rounded-3xl bg-[#042C53] text-white p-7 sm:p-10">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">
              The honest gap
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-semibold tracking-tight mb-5">
              We don't have customer testimonials.{" "}
              <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
                Yet.
              </span>
            </h2>
            <p className="text-[15px] sm:text-[16px] text-white/85 leading-[1.75] max-w-3xl mb-4">
              We don't have a press kit of named logos. We don't have a deck of customer quotes. What we have is what's above on this page: operator velocity, sophisticated architecture, working product, honest accounting.
            </p>
            <p className="text-[15px] sm:text-[16px] text-white/85 leading-[1.75] max-w-3xl mb-6">
              The first 10 customers get founding-customer treatment — direct line to Alexander, locked-in pricing for the life of the engagement, custom-built (not templated) implementation, and named on this page as case studies once we have results to show.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-[18px] font-semibold mb-3">
                Be one of the first 10.
              </h3>
              <FoundingCustomerForm />
            </div>
            <p className="text-[13px] text-white/70 mt-6">
              Prefer to read the longer case? <Link to="/how-we-win-without-testimonials" className="underline underline-offset-2 text-white">/how-we-win-without-testimonials</Link>
            </p>
          </div>
        </section>

        <p className="max-w-5xl mx-auto mt-10 text-center text-[12px] text-slate-500">
          Last reviewed by Alexander Mills. Every link on this page is live as of the deploy you're looking at — if anything 404s, that's a bug in production and I want to know about it.
        </p>
      </main>
      <FooterV44 />
    </div>
  );
}
