// src/components/CookieConsent.tsx — v229
//
// GDPR + CCPA compliant cookie consent banner. Shows on first visit, hides
// after the visitor makes a choice. Three primary actions:
//   - Accept all       (analytics + marketing + personalize)
//   - Reject all       (essential only)
//   - Customize        (granular per-category toggles)
//
// Plus persistent footer link "Cookie settings" that re-opens the panel.
// Stored decision lives in localStorage under tya_cookie_consent_v1.
//
// IMPORTANT: this banner is rendered by App.tsx globally. The actual GA4 +
// Meta Pixel + Resend tracking calls each check hasConsent() before firing
// — so a Reject-All visitor is truly anonymous until they explicitly opt in.

import { useEffect, useState } from "react";
import { acceptAll, rejectAll, setConsent, consentDecided, getConsent } from "@/lib/consent";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const TEXT = "#0B1B2B";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [personalize, setPersonalize] = useState(true);

  // Show on first visit (no decision yet). Also listen for an external open
  // event so the footer "Cookie settings" link can re-open.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const decided = consentDecided();
    if (!decided) {
      // Slight delay so it doesn't slam in over hero animation
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
    const handler = () => {
      const c = getConsent();
      if (c) {
        setAnalytics(c.analytics);
        setMarketing(c.marketing);
        setPersonalize(c.personalize);
      }
      setCustomize(true);
      setOpen(true);
    };
    window.addEventListener("tya:open-cookie-settings", handler);
    return () => window.removeEventListener("tya:open-cookie-settings", handler);
  }, []);

  if (!open) return null;

  const handleAccept = () => { acceptAll(); setOpen(false); };
  const handleReject = () => { rejectAll(); setOpen(false); };
  const handleSave = () => { setConsent({ analytics, marketing, personalize }); setOpen(false); };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          maxWidth: customize ? 760 : 720,
          width: "100%",
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(4,44,83,0.12)",
          boxShadow: "0 30px 80px -30px rgba(4,44,83,0.40), 0 12px 28px -12px rgba(4,44,83,0.18)",
          padding: customize ? "22px 26px 18px" : "20px 24px",
          color: TEXT,
          fontFamily: "'Inter Tight', system-ui, sans-serif",
        }}
      >
        {!customize ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
              <span aria-hidden style={{ fontSize: 26, lineHeight: 1 }}>🍪</span>
              <div style={{ flex: "1 1 380px", minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                  We use cookies to make TrainYourAgent work.
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "#42526E" }}>
                  Essential cookies are required for the site to function. Analytics, marketing, and personalization cookies are optional — you choose. Read our{" "}
                  <a href="/legal/cookies" style={{ color: ACCENT, textDecoration: "underline" }}>Cookie Policy</a> and{" "}
                  <a href="/legal/privacy" style={{ color: ACCENT, textDecoration: "underline" }}>Privacy Policy</a>.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setCustomize(true)}
                style={{ padding: "10px 16px", fontSize: 13.5, fontWeight: 600, color: NAVY, background: "transparent", border: "1px solid rgba(4,44,83,0.18)", borderRadius: 10, cursor: "pointer" }}
              >Customize</button>
              <button
                type="button"
                onClick={handleReject}
                style={{ padding: "10px 18px", fontSize: 13.5, fontWeight: 600, color: NAVY, background: "rgba(4,44,83,0.05)", border: "1px solid rgba(4,44,83,0.14)", borderRadius: 10, cursor: "pointer" }}
              >Reject all</button>
              <button
                type="button"
                onClick={handleAccept}
                style={{ padding: "10px 22px", fontSize: 13.5, fontWeight: 700, color: "#fff", background: NAVY, border: "none", borderRadius: 10, cursor: "pointer", boxShadow: "0 10px 22px -8px rgba(4,44,83,0.45)" }}
              >Accept all</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: NAVY }}>Cookie preferences</div>
              <button type="button" onClick={() => setCustomize(false)} aria-label="Back" style={{ background: "transparent", border: "none", color: "#6B7B92", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>← Back</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <CategoryRow label="Essential" body="Required for the site to function (auth, security, language). Cannot be disabled." enabled disabled />
              <CategoryRow label="Analytics" body="GA4 pageviews + custom events. Helps us understand which pages convert. Anonymized IPs, no cross-site tracking." enabled={analytics} onChange={setAnalytics} />
              <CategoryRow label="Marketing" body="Meta Pixel + retargeting cookies. Lets us show you relevant ads on Facebook/Instagram and measure ad ROI. Disable to opt out of retargeting." enabled={marketing} onChange={setMarketing} />
              <CategoryRow label="Personalization" body="Remembers your industry, business name, and visit context so we can tailor what we show you across visits." enabled={personalize} onChange={setPersonalize} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", paddingTop: 4 }}>
              <button type="button" onClick={handleReject} style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600, color: NAVY, background: "transparent", border: "1px solid rgba(4,44,83,0.18)", borderRadius: 10, cursor: "pointer" }}>Reject all</button>
              <button type="button" onClick={handleSave} style={{ padding: "10px 22px", fontSize: 13, fontWeight: 700, color: "#fff", background: NAVY, border: "none", borderRadius: 10, cursor: "pointer" }}>Save preferences</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ label, body, enabled, disabled, onChange }: { label: string; body: string; enabled: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", gap: 14, padding: "12px 14px", borderRadius: 12, background: "#F8FAFC", border: "1px solid rgba(4,44,83,0.08)", alignItems: "flex-start", cursor: disabled ? "not-allowed" : "pointer" }}>
      <input
        type="checkbox"
        checked={enabled}
        disabled={!!disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        style={{ marginTop: 3, width: 18, height: 18, accentColor: NAVY, cursor: disabled ? "not-allowed" : "pointer" }}
        aria-label={label}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
          {label}
          {disabled ? <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7B92", padding: "2px 8px", borderRadius: 999, background: "rgba(4,44,83,0.08)", letterSpacing: ".08em" }}>ALWAYS ON</span> : null}
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#42526E" }}>{body}</div>
      </div>
    </label>
  );
}
