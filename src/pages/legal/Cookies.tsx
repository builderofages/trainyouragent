// src/pages/legal/Cookies.tsx
// v76-D: Cookie Policy.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "what", label: "1. What are cookies?" },
  { id: "categories", label: "2. Categories we use" },
  { id: "inventory", label: "3. Cookie inventory" },
  { id: "control", label: "4. How to control cookies" },
  { id: "dnt", label: "5. Do Not Track / GPC" },
  { id: "changes", label: "6. Changes" },
  { id: "contact", label: "7. Contact" },
];

type Cookie = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: "Strictly necessary" | "Analytics" | "Advertising" | "Preferences";
};

const COOKIES: Cookie[] = [
  // Necessary
  { name: "sb-access-token", provider: "Supabase (TYA)", purpose: "Keeps you signed in to the dashboard.", duration: "1 hour, refreshed silently", category: "Strictly necessary" },
  { name: "sb-refresh-token", provider: "Supabase (TYA)", purpose: "Renews your dashboard session without re-login.", duration: "30 days", category: "Strictly necessary" },
  { name: "tya-csrf", provider: "TYA", purpose: "Cross-site request forgery protection on form submissions.", duration: "Session", category: "Strictly necessary" },
  { name: "__cf_bm", provider: "Cloudflare (via Vercel edge)", purpose: "Bot management on edge endpoints.", duration: "30 minutes", category: "Strictly necessary" },
  { name: "tya-cookie-consent", provider: "TYA", purpose: "Remembers your cookie banner choices.", duration: "12 months", category: "Strictly necessary" },
  // Analytics
  { name: "_ga", provider: "Google Analytics 4", purpose: "Distinguishes unique users for aggregate site analytics. IP anonymization is on.", duration: "13 months", category: "Analytics" },
  { name: "_ga_<ID>", provider: "Google Analytics 4", purpose: "Persists session state for GA4.", duration: "13 months", category: "Analytics" },
  // Advertising
  { name: "_fbp", provider: "Meta Pixel", purpose: "Conversion measurement for Meta ads on the marketing site only.", duration: "90 days", category: "Advertising" },
  { name: "fr", provider: "Meta", purpose: "Set on facebook.com when the Pixel loads; not set on our origin.", duration: "90 days", category: "Advertising" },
  // Preferences
  { name: "tya-theme", provider: "TYA", purpose: "Remembers UI theme (light/dark) and dashboard sidebar collapse.", duration: "12 months", category: "Preferences" },
  { name: "tya-locale", provider: "TYA", purpose: "Remembers your preferred locale.", duration: "12 months", category: "Preferences" },
];

const CATEGORY_COPY: Record<Cookie["category"], string> = {
  "Strictly necessary": "Required for the site to work. Cannot be disabled.",
  "Analytics": "Help us understand how the marketing site is used. Aggregate only.",
  "Advertising": "Measure ad performance. Opt-in only outside the US; opt-out under CCPA via the banner.",
  "Preferences": "Remember settings to personalize your experience.",
};

export default function Cookies() {
  return (
    <LegalLayout
      slug="cookies"
      pageTitle="Cookie Policy"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="What cookies and similar technologies TrainYourAgent uses, why, how long, and how to opt out."
      toc={TOC}
      related={[
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "Full data-handling picture." },
        { to: "/legal/gdpr", label: "GDPR Notice", blurb: "EU/UK consent requirements." },
        { to: "/legal/ccpa", label: "CCPA Notice", blurb: "California opt-out rights." },
      ]}
      summary={
        <>
          <p>
            We use cookies in four buckets: <strong>strictly necessary</strong> (auth, security, your consent choice), <strong>analytics</strong> (Google Analytics 4 with IP anonymization), <strong>advertising</strong> (Meta Pixel for ad-conversion measurement on the marketing site only), and <strong>preferences</strong> (UI settings).
          </p>
          <p>
            EU/UK/CH visitors: analytics and advertising require your opt-in via our consent banner. US visitors: analytics is on by default; you can opt out of advertising via the banner or by setting Global Privacy Control (GPC) in your browser.
          </p>
          <p>
            <strong>Cookies are not used on the dashboard or inside customer agents beyond auth and CSRF.</strong> No analytics or advertising cookies fire on the dashboard.
          </p>
        </>
      }
    >
      <h2 id="what">1. What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. We also treat the following as &ldquo;cookies&rdquo; for this Policy: pixel tags, web beacons, localStorage, sessionStorage, IndexedDB entries, and SDK identifiers. The same consent rules apply regardless of the technology.
      </p>

      <h2 id="categories">2. Categories we use</h2>
      <ul>
        {(Object.keys(CATEGORY_COPY) as Cookie["category"][]).map((c) => (
          <li key={c}><strong>{c}.</strong> {CATEGORY_COPY[c]}</li>
        ))}
      </ul>

      <h2 id="inventory">3. Cookie inventory</h2>
      <p>
        Below is the full inventory live on trainyouragent.com as of the &ldquo;Last updated&rdquo; date above. If you see a cookie set that isn&apos;t listed here, email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> &mdash; that&apos;s a bug.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {COOKIES.map((c) => (
            <tr key={c.name}>
              <td><code>{c.name}</code></td>
              <td>{c.provider}</td>
              <td>{c.purpose}</td>
              <td>{c.duration}</td>
              <td>{c.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="control">4. How to control cookies</h2>
      <h3>4.1 The consent banner.</h3>
      <p>
        On first visit (and on demand from the cookie-settings link in the footer), you see a banner letting you accept all, reject non-essential, or pick categories. Your choice is stored in <code>tya-cookie-consent</code> for 12 months and re-prompted when our cookie set materially changes.
      </p>
      <h3>4.2 Browser controls.</h3>
      <p>
        All major browsers let you block or delete cookies. Useful pages:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" rel="noopener" target="_blank">Chrome</a></li>
        <li><a href="https://support.apple.com/HT201265" rel="noopener" target="_blank">Safari</a></li>
        <li><a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" rel="noopener" target="_blank">Firefox</a></li>
        <li><a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" rel="noopener" target="_blank">Edge</a></li>
      </ul>
      <h3>4.3 Per-category opt-outs.</h3>
      <ul>
        <li><strong>Analytics (GA4).</strong> Install Google&apos;s <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener" target="_blank">opt-out browser add-on</a>, or reject Analytics in our banner.</li>
        <li><strong>Advertising (Meta Pixel).</strong> Adjust your <a href="https://www.facebook.com/adpreferences/" rel="noopener" target="_blank">Meta ad preferences</a>, or reject Advertising in our banner.</li>
      </ul>

      <h2 id="dnt">5. Do Not Track / Global Privacy Control</h2>
      <p>
        Browser-level Do Not Track (DNT) signals do not have a consistent legal standard, but we honour <strong>Global Privacy Control (GPC)</strong> as a valid opt-out of &ldquo;sale&rdquo; and &ldquo;sharing&rdquo; under CCPA/CPRA (Cal. Civ. Code § 1798.135). When your browser sends a GPC signal we treat that as an opt-out of advertising cookies and any &ldquo;sharing&rdquo; under California law, without further action by you.
      </p>

      <h2 id="changes">6. Changes</h2>
      <p>
        We&apos;ll update this Policy when our cookie set changes. Material changes trigger a re-prompt of the consent banner. The &ldquo;Last updated&rdquo; date reflects the latest revision.
      </p>

      <h2 id="contact">7. Contact</h2>
      <p>
        Cookie questions: <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.
      </p>
    </LegalLayout>
  );
}
