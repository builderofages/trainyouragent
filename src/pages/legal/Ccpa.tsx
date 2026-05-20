// src/pages/legal/Ccpa.tsx
// v76-D: CCPA / CPRA notice for California residents.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "who", label: "1. Who this is for" },
  { id: "rights", label: "2. Your California rights" },
  { id: "no-sale", label: "3. Do Not Sell or Share" },
  { id: "categories", label: "4. Categories of data" },
  { id: "exercise", label: "5. How to submit a request" },
  { id: "verification", label: "6. Verification" },
  { id: "agents", label: "7. Authorized agents" },
  { id: "metrics", label: "8. Request metrics" },
  { id: "contact", label: "9. Contact" },
];

export default function Ccpa() {
  return (
    <LegalLayout
      slug="ccpa"
      pageTitle="CCPA / CPRA Notice"
      lastUpdated="May 20, 2026"
      reviewedDate="May 20, 2026"
      metaDescription="Your California Consumer Privacy Act and CPRA rights when interacting with TrainYourAgent — plus the Do Not Sell or Share link."
      toc={TOC}
      related={[
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "Full data-handling picture." },
        { to: "/legal/dpa", label: "DPA", blurb: "Service-provider terms." },
        { to: "/legal/cookies", label: "Cookie Policy", blurb: "Includes GPC honoring." },
      ]}
      summary={
        <>
          <p>
            This is the plain-English picture of your California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) rights when you interact with TrainYourAgent.
          </p>
          <p>
            <strong>We do not sell personal information.</strong> We do not share it for cross-context behavioral advertising. The Meta Pixel on our marketing site is configured for measurement, not for audience-building or remarketing. We honour Global Privacy Control (GPC) as a valid opt-out.
          </p>
          <p>
            You have the right to know, access, correct, delete, opt out of any &ldquo;sale&rdquo; / &ldquo;sharing,&rdquo; limit the use of sensitive personal information, and not be retaliated against for exercising any right. Email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>; we respond within 45 days.
          </p>
        </>
      }
    >
      <h2 id="who">1. Who this is for</h2>
      <p>
        This Notice applies to California residents whose personal information we process. The binding processor terms for our business customers live in our <a href="/legal/dpa">DPA</a>; the controlling consumer-facing terms are this Notice and the <a href="/legal/privacy">Privacy Policy</a>.
      </p>

      <h2 id="rights">2. Your California rights</h2>
      <ul>
        <li><strong>Right to know.</strong> What categories of personal information we&apos;ve collected, sources, purposes, categories of third parties we&apos;ve disclosed to, and specific pieces of personal information (Cal. Civ. Code &sect; 1798.110, &sect; 1798.115).</li>
        <li><strong>Right to access.</strong> A copy of the specific pieces of personal information (&sect; 1798.110).</li>
        <li><strong>Right to correct.</strong> Inaccurate personal information (&sect; 1798.106).</li>
        <li><strong>Right to delete.</strong> Personal information we&apos;ve collected, subject to statutory exceptions (&sect; 1798.105).</li>
        <li><strong>Right to opt out of sale / sharing.</strong> Even though we don&apos;t sell or share, the right is preserved (&sect; 1798.120, &sect; 1798.135).</li>
        <li><strong>Right to limit use of sensitive personal information.</strong> Where applicable (&sect; 1798.121).</li>
        <li><strong>Right to non-retaliation</strong> for exercising any right (&sect; 1798.125).</li>
      </ul>

      <h2 id="no-sale">3. Do Not Sell or Share My Personal Information</h2>
      <p>
        TrainYourAgent does not sell personal information for money or other valuable consideration as defined by CCPA/CPRA. TrainYourAgent does not share personal information for cross-context behavioral advertising. The Meta Pixel on our marketing site is configured for measurement only and is loaded only with consent in jurisdictions that require opt-in; for California residents, the Pixel can be disabled via our cookie banner or by transmitting a <strong>Global Privacy Control (GPC)</strong> signal from your browser, which we honour automatically as a valid opt-out per the California AG&apos;s 2021 enforcement opinion (Civ. Code &sect; 1798.135(b)(1)).
      </p>
      <p>
        If you still wish to submit a formal &ldquo;Do Not Sell or Share&rdquo; request, email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> with the subject &ldquo;California &mdash; Do Not Sell or Share.&rdquo; We will confirm the opt-out within 15 business days.
      </p>

      <h2 id="categories">4. Categories of data (last 12 months)</h2>
      <table>
        <thead>
          <tr>
            <th>CCPA category (Civ. Code &sect; 1798.140(o))</th>
            <th>Collected?</th>
            <th>Disclosed for a business purpose?</th>
            <th>Sold / shared?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Identifiers (name, email, IP)</td><td>Yes</td><td>Yes &mdash; to sub-processors per the DPA</td><td>No</td></tr>
          <tr><td>Commercial information (purchase history, plan)</td><td>Yes</td><td>Yes &mdash; payment processor, accounting</td><td>No</td></tr>
          <tr><td>Internet / network activity (page views, events)</td><td>Yes</td><td>Yes &mdash; analytics, security</td><td>No</td></tr>
          <tr><td>Geolocation (coarse, from IP)</td><td>Yes</td><td>Yes &mdash; security, routing</td><td>No</td></tr>
          <tr><td>Audio (call recordings, agent voice synthesis)</td><td>Yes &mdash; if Customer enables recording on its agent</td><td>Yes &mdash; to STT/TTS sub-processors</td><td>No</td></tr>
          <tr><td>Professional / employment information</td><td>Yes &mdash; from public sources for B2B prospecting</td><td>Yes &mdash; CRM sub-processor</td><td>No</td></tr>
          <tr><td>Inferences (lead score, segment)</td><td>Yes</td><td>Yes &mdash; internal use</td><td>No</td></tr>
          <tr><td>Sensitive personal information (&sect; 1798.140(ae))</td><td>Not intentionally; if uploaded by Customer it is processed as a service provider only</td><td>n/a</td><td>No</td></tr>
        </tbody>
      </table>

      <h2 id="exercise">5. How to submit a request</h2>
      <ol>
        <li>Email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>. We respond within <strong>45 days</strong> (extendable once by 45 if reasonably necessary; we&apos;ll tell you).</li>
        <li>Include the request type, your full name, the email associated with any TYA account (if applicable), and the state of residence.</li>
        <li>For deletion requests, list the specific data or scope (&ldquo;all data,&rdquo; &ldquo;marketing emails,&rdquo; &ldquo;call recordings only,&rdquo; etc.).</li>
      </ol>

      <h2 id="verification">6. Verification</h2>
      <p>
        We verify requests by matching information you submit with information we already hold (e.g., account email and recent activity). For requests involving more sensitive information, we may require additional verification. We will only use verification information for verification and will delete it after.
      </p>

      <h2 id="agents">7. Authorized agents</h2>
      <p>
        You can authorize an agent to submit a request on your behalf. Include signed written permission and verifiable proof of the agent&apos;s authority (e.g., a power of attorney). We may contact you to verify directly.
      </p>

      <h2 id="metrics">8. Request metrics</h2>
      <p>
        Because TrainYourAgent receives fewer than 10 million California requests per year and processes data for fewer than 100,000 California consumers, we are not required to publish annual request metrics under 11 Cal. Code Regs. &sect; 7102. If we cross that threshold we will publish here.
      </p>

      <h2 id="contact">9. Contact</h2>
      <p>
        Privacy contact: <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a><br />
        Postal: TrainYourAgent LLC, Tampa Bay, Florida, USA<br />
        California consumers can also call us; a toll-free number is being provisioned and will be published here. In the meantime, please use email.
      </p>
    </LegalLayout>
  );
}
