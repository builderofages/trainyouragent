// src/pages/ReviewsSubmit.tsx — v233
//
// Social proof flywheel. Customers paste a video URL (Loom / YouTube /
// LinkedIn / a real testimonial) + their name + niche → POST to
// /api/reviews → admin reviews + publishes to /customers + the matching
// /template/[niche] page automatically.
//
// Why this is the missing piece:
//   The site's JSON-LD claims aggregateRating 4.9, but we have zero
//   public proof. Buyers look for it. This page is the cheapest way to
//   start collecting real proof — no Trustpilot account, no logo licensing.
//
// Auto-approve OFF by default. Admin reviews at /admin/templates → Reviews
// tab (next ship). Until then, submissions land in Supabase + we get a
// notification email. Manual publish from admin.

import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { ACTIVE_NICHE_SITES } from "@/lib/nicheSiteTemplates";
import { fireEvent } from "@/lib/event";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const TEXT = "#0B1B2B";
const MUTED = "#5C6B7F";
const HAIRLINE = "rgba(4,44,83,0.08)";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };

type FormState = "idle" | "sending" | "ok" | "err";

export default function ReviewsSubmit() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("hvac");
  const [videoUrl, setVideoUrl] = useState("");
  const [quote, setQuote] = useState("");
  const [permission, setPermission] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim() || !permission) return;
    if (!videoUrl.trim() && !quote.trim()) {
      setErrMsg("Either a video URL or a written quote is required.");
      setState("err");
      return;
    }
    setState("sending");
    setErrMsg("");
    try {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          niche,
          video_url: videoUrl.trim() || null,
          quote: quote.trim() || null,
          permission_granted: !!permission,
          source: "/reviews/submit",
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setErrMsg(j?.error || `Server returned ${r.status}`);
        setState("err");
        return;
      }
      void fireEvent("review_submitted", { niche, has_video: !!videoUrl.trim() });
      setState("ok");
    } catch (e) {
      setErrMsg(String((e as Error).message || e));
      setState("err");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: TEXT, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Helmet>
        <title>Share your TrainYourAgent story · Submit a testimonial</title>
        <meta name="description" content="Customers: share your TrainYourAgent results. Submit a video testimonial or a written quote. We'll review and publish on /customers." />
        <link rel="canonical" href="https://www.trainyouragent.com/reviews/submit" />
      </Helmet>
      <SiteNav />

      <section className="px-5 sm:px-8 pt-28 sm:pt-32 pb-14 sm:pb-20 max-w-3xl mx-auto">
        <div className="text-[11px] font-semibold tracking-[0.18em] uppercase font-mono mb-3" style={{ color: ACCENT }}>
          OPERATOR FAVOR · $200 STRIPE CREDIT
        </div>
        <h1 className="text-[34px] sm:text-[48px] font-semibold leading-[1.05] mb-4" style={{ color: NAVY }}>
          Tell the next operator what the agent did for{" "}
          <span style={ITALIC}>your shop.</span>
        </h1>
        <p className="text-[15.5px] sm:text-[17px] text-slate-700 leading-relaxed mb-6">
          Your call volume, your numbers, your before/after. A 30-second Loom on camera is best — written quote works too. We'll review, lightly edit for length, and publish on <Link to="/customers" style={{ color: ACCENT, textDecoration: "underline" }}>/customers</Link> plus your industry's template page so the next HVAC/dental/salon owner lands on it.
        </p>

        {/* v258 (Grok #3): Grok flagged this page 3/10 — "isolated high-friction
            form with zero incentive, context, or preview." Add the incentive
            (Stripe credit on publish), the context (one of 3 lanes), and a
            visible preview link. */}
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(244,200,76,0.10), rgba(24,95,165,0.05))",
            border: `1px solid ${HAIRLINE}`,
            marginBottom: 28,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <div className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: "0.16em", fontWeight: 700, color: "#C99A28", marginBottom: 4 }}>
              WHAT YOU GET WHEN WE PUBLISH
            </div>
            <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>
              $200 Stripe credit applied to your next invoice · backlink from <Link to="/customers" style={{ color: ACCENT }}>/customers</Link> to your business URL · we share the case study post on LinkedIn and tag you.
            </div>
          </div>
          <Link
            to="/customers"
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: NAVY,
              color: "#FFFFFF",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            See examples →
          </Link>
        </div>

        {state === "ok" ? (
          <div style={{ padding: 28, borderRadius: 18, background: "rgba(21,114,77,0.08)", border: "1px solid rgba(21,114,77,0.32)", color: "#15724D" }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Got it. Thank you.</div>
            <div style={{ fontSize: 14, lineHeight: 1.55 }}>Alexander will review your submission within 48h. If anything needs clarification you'll get an email. Otherwise it goes live on <Link to="/customers" style={{ color: ACCENT, textDecoration: "underline" }}>/customers</Link> in 2-3 business days.</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row label="Your name">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Mills" style={inputStyle} />
            </Row>
            <Row label="Business name">
              <input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Smith Heating & Cooling" style={inputStyle} />
            </Row>
            <Row label="Email (for follow-up)">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@yourbusiness.com" style={inputStyle} />
            </Row>
            <Row label="Industry">
              <select value={niche} onChange={(e) => setNiche(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {ACTIVE_NICHE_SITES.map((s) => (
                  <option key={s.id} value={s.id}>{s.niche}</option>
                ))}
              </select>
            </Row>
            <Row label="Video testimonial URL" subtitle="Loom, YouTube unlisted, LinkedIn post, anywhere with a public link. Optional but converts 3-5x better than written.">
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.loom.com/share/…" type="url" style={inputStyle} />
            </Row>
            <Row label="Or a written quote" subtitle="40-120 words. What changed for your business? Be specific — 'booked 12 jobs that would've gone to voicemail' beats 'great service.'">
              <textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="In the first month we…" rows={5} style={{ ...inputStyle, fontFamily: "'Inter Tight', system-ui, sans-serif", resize: "vertical", minHeight: 110 }} />
            </Row>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: "#F8FAFC", border: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
              <input type="checkbox" required checked={permission} onChange={(e) => setPermission(e.target.checked)} style={{ marginTop: 2, width: 18, height: 18, accentColor: NAVY }} />
              <div style={{ fontSize: 13, lineHeight: 1.5, color: TEXT }}>
                <strong style={{ color: NAVY }}>Permission to publish:</strong> I give TrainYourAgent permission to publish my name, business name, industry, and submission on its public site (including /customers and the matching industry template page). I can revoke this anytime by emailing trainyouragent@gmail.com.
              </div>
            </label>
            {state === "err" && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(155,44,44,0.08)", border: "1px solid rgba(155,44,44,0.28)", color: "#9B2C2C", fontSize: 13.5 }}>
                {errMsg || "Something went wrong. Try again."}
              </div>
            )}
            <button
              type="submit"
              disabled={state === "sending" || !permission || !name.trim() || !company.trim() || !email.trim() || (!videoUrl.trim() && !quote.trim())}
              style={{ padding: "14px 22px", borderRadius: 14, background: NAVY, color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: state === "sending" ? "wait" : "pointer", opacity: (!permission || !name.trim() || !company.trim() || !email.trim() || (!videoUrl.trim() && !quote.trim())) ? 0.55 : 1 }}
            >
              {state === "sending" ? "Sending…" : "Submit testimonial →"}
            </button>
            <div style={{ fontSize: 12, color: MUTED, ...MONO, letterSpacing: 0, marginTop: 4 }}>
              We never sell or share submissions. Reviewed by Alexander personally before publication.
            </div>
          </form>
        )}
      </section>

      <FooterV44 />
    </div>
  );
}

function Row({ label, subtitle, children }: { label: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{label}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.45 }}>{subtitle}</div>}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 11,
  border: `1px solid ${HAIRLINE}`,
  fontSize: 14.5,
  color: NAVY,
  outline: "none",
  background: "#FAFBFC",
  width: "100%",
  boxSizing: "border-box",
};
