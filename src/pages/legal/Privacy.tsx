// src/pages/legal/Privacy.tsx
// v76-D: Privacy Policy.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "who", label: "1. Who we are" },
  { id: "scope", label: "2. Scope" },
  { id: "categories", label: "3. Data we collect" },
  { id: "purposes", label: "4. How we use data" },
  { id: "legal-bases", label: "5. Legal bases (GDPR/UK GDPR)" },
  { id: "share", label: "6. Who we share with" },
  { id: "retention", label: "7. Retention periods" },
  { id: "rights", label: "8. Your rights" },
  { id: "transfers", label: "9. International transfers" },
  { id: "security", label: "10. Security" },
  { id: "cookies", label: "11. Cookies & similar tech" },
  { id: "ai", label: "12. AI use" },
  { id: "children", label: "13. Children" },
  { id: "changes", label: "14. Changes" },
  { id: "contact", label: "15. Contact" },
];

export default function Privacy() {
  return (
    <LegalLayout
      slug="privacy"
      pageTitle="Privacy Policy"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="How TrainYourAgent collects, uses, shares, and retains personal information across our website, dashboard, and AI agents."
      toc={TOC}
      related={[
        { to: "/legal/cookies", label: "Cookie Policy", blurb: "Full cookie inventory + opt-out." },
        { to: "/legal/gdpr", label: "GDPR Notice", blurb: "Plain-English summary of EU/UK rights." },
        { to: "/legal/ccpa", label: "CCPA Notice", blurb: "Plain-English summary of California rights." },
      ]}
      summary={
        <>
          <p>
            We collect what we need to deliver the service: account info you give us, business data you upload, call recordings and transcripts your agent generates, payment info handled by Stripe, and standard analytics (Google Analytics 4 and the Meta Pixel) on our marketing site.
          </p>
          <p>
            <strong>We don&apos;t sell personal information.</strong> We don&apos;t train our base models on your data. We share data with the sub-processors listed at <a href="/legal/sub-processors">/legal/sub-processors</a> &mdash; the same vendors most B2B SaaS uses (Vercel, Supabase, Stripe, Anthropic, etc.).
          </p>
          <p>
            EU/UK customers: GDPR Articles 15&ndash;22 rights apply. California consumers: CCPA Sections 1798.100&ndash;.150 rights apply. To exercise any right, email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>; we respond within 30 days (or sooner if law requires).
          </p>
        </>
      }
    >
      <h2 id="who">1. Who we are</h2>
      <p>
        TrainYourAgent LLC (&ldquo;<strong>TYA</strong>,&rdquo; &ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>&rdquo;) operates trainyouragent.com and the related dashboard and agent platform. Our registered office is in Tampa Bay, Florida, USA. We are the &ldquo;controller&rdquo; of the personal data described in this Policy for our marketing site, our prospect outreach, our customer accounts, and our internal operations. When we process personal data of <em>your</em> end-users on your behalf inside the Services, we act as your &ldquo;processor&rdquo; under our <a href="/legal/dpa">Data Processing Agreement</a>.
      </p>

      <h2 id="scope">2. Scope</h2>
      <p>
        This Policy covers the personal information we collect through:
      </p>
      <ul>
        <li>The marketing website (trainyouragent.com) and any sub-domains;</li>
        <li>The customer dashboard (app.trainyouragent.com when live; today the dashboard lives at trainyouragent.com/dashboard);</li>
        <li>Our APIs, webhooks, and voice/messaging agents we operate or host;</li>
        <li>Email, calendar, and call-recording integrations you authorize;</li>
        <li>Sales, support, and onboarding communications (email, chat, scheduled calls).</li>
      </ul>

      <h2 id="categories">3. Data we collect</h2>
      <h3>3.1 You give us</h3>
      <ul>
        <li><strong>Account info:</strong> name, work email, company name, role, billing address, password hash.</li>
        <li><strong>Payment info:</strong> we use Stripe; we receive tokenized references and the last 4 digits of card or bank-account numbers, never the full PAN or routing number.</li>
        <li><strong>Business data:</strong> anything you upload to train, configure, or run your agent &mdash; scripts, knowledge bases, CRM exports, contact lists, recordings, transcripts, integration credentials (encrypted at rest).</li>
        <li><strong>Support content:</strong> emails, chat messages, screenshots, ticket attachments.</li>
      </ul>
      <h3>3.2 We collect automatically</h3>
      <ul>
        <li><strong>Device &amp; usage:</strong> IP address, user-agent, referrer, pages viewed, timestamps, broad geolocation derived from IP, session ID.</li>
        <li><strong>Analytics:</strong> Google Analytics 4 (GA4) collects pseudonymous identifiers and event data on the marketing site. We have IP anonymization on. We do not use GA4 advertising features.</li>
        <li><strong>Conversion tracking:</strong> the Meta Pixel fires on the marketing site to measure ad performance. Visitors can opt out of advertising cookies via our cookie banner (see <a href="/legal/cookies">Cookie Policy</a>).</li>
        <li><strong>Product analytics:</strong> in the dashboard we record events such as &ldquo;agent created,&rdquo; &ldquo;call answered,&rdquo; &ldquo;model swapped&rdquo; to operate, secure, debug, and improve the Services.</li>
      </ul>
      <h3>3.3 From third parties</h3>
      <ul>
        <li><strong>Stripe</strong> &mdash; payment status, invoice IDs.</li>
        <li><strong>Cal.com</strong> &mdash; booking events, scheduled-call metadata.</li>
        <li><strong>Public sources</strong> &mdash; LinkedIn, company websites, news articles for prospect research, as permitted under those sources&apos; terms.</li>
        <li><strong>Twilio, Deepgram, Cartesia</strong> &mdash; call audio, transcripts, voice-synthesis logs related to your agent runs.</li>
      </ul>
      <h3>3.4 Sensitive categories.</h3>
      <p>
        We do not intentionally collect Article 9 &ldquo;special category&rdquo; data (racial origin, health, biometrics, etc.) or CCPA &ldquo;sensitive personal information.&rdquo; If you upload such data into the Services as part of business data, we process it strictly as your processor under the DPA and do not use it for any other purpose.
      </p>

      <h2 id="purposes">4. How we use data</h2>
      <ul>
        <li>Provide, operate, secure, and maintain the Services;</li>
        <li>Train and tune <em>your</em> agent on your data, on your instructions;</li>
        <li>Process payments and prevent fraud;</li>
        <li>Send transactional email (receipts, alerts, security notices) &mdash; you cannot opt out of these while you have an account;</li>
        <li>Send product updates, marketing email, and outbound prospecting &mdash; you can opt out at any time via the unsubscribe link or by emailing <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>;</li>
        <li>Provide support, respond to inquiries, and run user-research interviews you opt into;</li>
        <li>Detect, prevent, and respond to abuse, security incidents, and unlawful activity;</li>
        <li>Comply with our legal obligations (tax, accounting, lawful requests).</li>
      </ul>
      <p>
        <strong>We do not use Customer Data to train our base models or any model offered to other customers without your explicit opt-in.</strong> See Section 12 and the <a href="/legal/ai-use">AI Use Policy</a>.
      </p>

      <h2 id="outbound-sources">4.5 Outbound prospect data sources (v199)</h2>
      <p>
        We operate a B2B outbound prospecting engine that identifies small-business prospects from <strong>publicly available</strong> sources, contacts them by email about our service, and stops contacting them on first request. We process this data under <strong>GDPR Art. 6(1)(f) legitimate interests</strong> and <strong>CCPA's B2B exemption</strong>, and we apply the following safeguards:
      </p>
      <ul>
        <li><strong>Sources we use:</strong> OpenStreetMap (Overpass API, ODbL license &mdash; attribution at <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">openstreetmap.org/copyright</a>), Google Places API (per Google's Places API Terms of Service), and public business directories. We never scrape behind logins, never bypass paywalls, and never collect personal social-media data.</li>
        <li><strong>What we collect about a prospect business:</strong> business name, address, phone, website, and a single business email when listed publicly &mdash; or a pattern-guessed business address (<code>info@domain</code>) flagged as unverified, gated by reputation safeguards (Section 4.6).</li>
        <li><strong>Retention:</strong> raw discovery results are purged after 30 days to comply with Google Places ToS &sect; 5.1(b). Outreach records (whether we sent, when, whether they opened or booked) are retained for legitimate business records and tax compliance.</li>
        <li><strong>Opt-out:</strong> every outbound email carries an HMAC-signed one-click unsubscribe link AND a Gmail-native <code>List-Unsubscribe</code> header (RFC 8058). Honored immediately and forever &mdash; one click stops every future email from us to that address.</li>
        <li><strong>Right to be forgotten (GDPR Art. 17 / CCPA &sect; 1798.105):</strong> email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> to have your prospect record hard-deleted within 30 days.</li>
        <li><strong>Bounces &amp; complaints:</strong> hard-bounced addresses and ESP-reported complaints automatically stop the sequence; we never re-engage.</li>
      </ul>

      <h2 id="email-safeguards">4.6 Email reputation safeguards</h2>
      <p>
        Pattern-guessed email addresses (e.g. <code>info@domain.com</code> derived from a public website) are gated by default &mdash; we do not send to them until either (a) the operator explicitly opts in via <code>SEND_TO_PATTERN_GUESSES=1</code> after their sending domain has aged with verified-only volume, or (b) the prospect has actually opened a previous link from us (proving the address exists). This protects deliverability for verified prospects and reduces the risk of mistaken contact.
      </p>

      <h2 id="legal-bases">5. Legal bases (GDPR / UK GDPR)</h2>
      <p>For EU and UK data subjects, we rely on the following GDPR Article 6 bases:</p>
      <ul>
        <li><strong>Contract (Art. 6(1)(b))</strong> &mdash; account creation, billing, providing the Services.</li>
        <li><strong>Legitimate interests (Art. 6(1)(f))</strong> &mdash; product analytics, security monitoring, prospect outreach to business contacts, fraud prevention. We balance these against your rights and offer opt-outs where appropriate.</li>
        <li><strong>Consent (Art. 6(1)(a))</strong> &mdash; non-essential cookies, marketing email to consumer-level identifiers (where required by ePrivacy law), and any opt-in for model improvement on your data.</li>
        <li><strong>Legal obligation (Art. 6(1)(c))</strong> &mdash; tax records, lawful access requests.</li>
      </ul>

      <h2 id="share">6. Who we share with</h2>
      <p>We share personal data with the categories below; the live, named list lives at <a href="/legal/sub-processors">/legal/sub-processors</a> and is updated at least 30 days before changes take effect.</p>
      <ul>
        <li><strong>Sub-processors (vendors).</strong> Hosting (Vercel), database/auth (Supabase), payments (Stripe), transactional email (Resend), scheduling (Cal.com), LLM inference (Anthropic, Groq, Cohere), speech (Deepgram, Cartesia), telephony (Twilio), vector DB (Pinecone). Each is bound by a written DPA and processes data only on documented instructions.</li>
        <li><strong>Professional advisors.</strong> Lawyers, auditors, accountants, insurers &mdash; under confidentiality.</li>
        <li><strong>Business transfers.</strong> In a merger, acquisition, financing, or sale of substantially all assets, data may transfer to the successor; we will notify you and the successor will be bound by terms at least as protective as this Policy.</li>
        <li><strong>Authorities.</strong> Where required by valid legal process; we will challenge overbroad requests where lawful.</li>
        <li><strong>With your direction.</strong> Integrations you authorize (e.g., HubSpot, GHL, your CRM) receive data on your instructions.</li>
      </ul>
      <p>
        <strong>We do not sell personal information for money or other valuable consideration as defined by CCPA, CPRA, or any analogous state law, and we do not share personal information for cross-context behavioral advertising.</strong> The Meta Pixel on the marketing site is configured for measurement, not for audience-building or remarketing.
      </p>

      <h2 id="retention">7. Retention periods</h2>
      <table>
        <thead>
          <tr><th>Data category</th><th>Default retention</th></tr>
        </thead>
        <tbody>
          <tr><td>Marketing website analytics (GA4 event data)</td><td>14 months</td></tr>
          <tr><td>Marketing-form submissions / prospect records</td><td>24 months after last interaction</td></tr>
          <tr><td>Account data while subscribed</td><td>Duration of subscription + 60 days</td></tr>
          <tr><td>Customer Data (Customer-controlled)</td><td>Per your dashboard settings; deleted from production within 60 days of account closure, backups expire within 90 days</td></tr>
          <tr><td>Call recordings &amp; transcripts</td><td>90 days default; configurable to 7&ndash;365 days per Customer setting</td></tr>
          <tr><td>Billing &amp; tax records</td><td>7 years (US IRS / state requirements)</td></tr>
          <tr><td>Security logs</td><td>13 months</td></tr>
          <tr><td>Support tickets</td><td>3 years after closure</td></tr>
        </tbody>
      </table>

      <h2 id="rights">8. Your rights</h2>
      <p>Subject to verification of identity, you can ask us to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you (GDPR Art. 15; CCPA § 1798.110).</li>
        <li><strong>Correct</strong> inaccurate or incomplete data (GDPR Art. 16; CCPA § 1798.106).</li>
        <li><strong>Delete</strong> data, subject to legal-retention carve-outs (GDPR Art. 17; CCPA § 1798.105).</li>
        <li><strong>Port</strong> data in a structured, machine-readable format (GDPR Art. 20; CCPA § 1798.130(a)(2)).</li>
        <li><strong>Restrict</strong> or <strong>object</strong> to processing based on legitimate interests, including profiling (GDPR Art. 18, 21).</li>
        <li><strong>Opt out</strong> of marketing email at any time via the unsubscribe link.</li>
        <li><strong>Opt out</strong> of &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; (we don&apos;t do either, but the right is preserved).</li>
        <li><strong>Withdraw consent</strong> where processing is based on consent; withdrawal does not affect processing before withdrawal.</li>
        <li><strong>Lodge a complaint</strong> with your local data-protection supervisory authority (EU/UK).</li>
      </ul>
      <p>
        To exercise any right, email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> with enough information for us to identify you. We respond within 30 days (extendable to 60 if the request is complex; we&apos;ll tell you). Requests are free unless manifestly unfounded or excessive.
      </p>
      <p>
        We will not discriminate against you for exercising any privacy right. Authorized agents may submit requests on your behalf with signed written permission and identity verification.
      </p>

      <h2 id="transfers">9. International transfers</h2>
      <p>
        Our primary hosting is in the United States. For EU/UK/Swiss data subjects, we transfer personal data to the US relying on the EU&ndash;US Data Privacy Framework (DPF) where the recipient is DPF-certified, and otherwise on the European Commission&apos;s 2021 Standard Contractual Clauses (Modules 2 and 3 as applicable) with supplementary measures (encryption in transit and at rest, access controls, transparency reporting). The UK International Data Transfer Addendum and the Swiss FDPIC SCCs apply where required.
      </p>
      <p>
        On request, we&apos;ll provide a redacted copy of executed SCCs and our latest transfer impact assessment (TIA).
      </p>

      <h2 id="security">10. Security</h2>
      <p>
        See our <a href="/security">Security overview</a> and the <a href="/legal/dpa">DPA Annex II</a> for full technical and organisational measures. Highlights: TLS 1.2+ in transit, AES-256 at rest, MFA on all administrative access, least-privilege role-based access control, vendor SOC 2 review, 24-hour incident-response runbook, annual external penetration test, and bug-bounty program (in setup).
      </p>

      <h2 id="cookies">11. Cookies &amp; similar tech</h2>
      <p>
        See the <a href="/legal/cookies">Cookie Policy</a> for the full inventory and consent mechanism.
      </p>

      <h2 id="ai">12. AI use</h2>
      <p>
        Our use of AI is governed by the <a href="/legal/ai-use">AI Use Policy</a>. In short: we use third-party LLMs (Anthropic, open models via Groq), speech models (Deepgram, Cartesia), and embedding models (Cohere). We disclose AI nature when asked. We do not use Customer Data to improve our base models or any model offered to other customers without your explicit, opt-in consent.
      </p>

      <h2 id="children">13. Children</h2>
      <p>
        The Services are not intended for anyone under 16, and we do not knowingly collect personal data from children. If we discover we have collected such data, we will delete it. Parents or guardians can contact <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.
      </p>

      <h2 id="changes">14. Changes</h2>
      <p>
        We will update this Policy from time to time. If we make material changes, we&apos;ll notify customers at least 30 days in advance via email and a dashboard banner. The &ldquo;Last updated&rdquo; date reflects the latest revision.
      </p>

      <h2 id="contact">15. Contact</h2>
      <p>
        <strong>Controller:</strong> TrainYourAgent LLC, Tampa Bay, Florida, USA.<br />
        <strong>Privacy contact:</strong> <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.<br />
        <strong>EU/UK representative:</strong> not appointed (we currently fall below the Art. 27 threshold; we will appoint and publish if and when triggered).
      </p>
    </LegalLayout>
  );
}
