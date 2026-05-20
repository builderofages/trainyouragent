// src/pages/legal/Gdpr.tsx
// v76-D: GDPR notice for EU/UK visitors and customers.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "who", label: "1. Who this is for" },
  { id: "rights", label: "2. Your rights at a glance" },
  { id: "exercise", label: "3. How to exercise" },
  { id: "bases", label: "4. Lawful bases" },
  { id: "transfers", label: "5. International transfers" },
  { id: "complain", label: "6. Right to complain" },
  { id: "contact", label: "7. Contact" },
];

export default function Gdpr() {
  return (
    <LegalLayout
      slug="gdpr"
      pageTitle="GDPR Notice"
      lastUpdated="May 20, 2026"
      reviewedDate="May 20, 2026"
      metaDescription="Plain-English summary of EU and UK GDPR rights when interacting with TrainYourAgent."
      toc={TOC}
      related={[
        { to: "/legal/dpa", label: "DPA", blurb: "Binding processor terms for customers." },
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "Full data-handling picture." },
        { to: "/legal/sub-processors", label: "Sub-processors", blurb: "Who we share data with." },
      ]}
      summary={
        <>
          <p>
            This is the plain-English picture of your GDPR / UK GDPR rights when you interact with TrainYourAgent. The binding document for customers acting as controllers over their end-users&apos; data is the <a href="/legal/dpa">DPA</a>; for everyone the controlling document is the <a href="/legal/privacy">Privacy Policy</a>.
          </p>
          <p>
            <strong>You can ask us to access, correct, delete, port, restrict, or object to processing of your personal data, withdraw consent, and complain to your data-protection supervisory authority.</strong> Email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> to exercise any right; we respond within 30 days (extendable to 60 if complex).
          </p>
        </>
      }
    >
      <h2 id="who">1. Who this is for</h2>
      <p>
        This Notice applies if you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland and we process personal data about you, including via:
      </p>
      <ul>
        <li>Visiting trainyouragent.com;</li>
        <li>Receiving outreach from us;</li>
        <li>Being a Customer or a user of Customer&apos;s account;</li>
        <li>Interacting with an agent operated via the Services on behalf of a Customer.</li>
      </ul>
      <p>
        Where we process personal data about you on behalf of a Customer (e.g., you called a business and the business uses a TYA agent), the Customer is the controller and the binding terms with that Customer live in our <a href="/legal/dpa">DPA</a>. You can exercise rights with the Customer directly, or with us &mdash; we will route to the Customer where appropriate.
      </p>

      <h2 id="rights">2. Your rights at a glance</h2>
      <ul>
        <li><strong>Access (Art. 15)</strong> &mdash; a copy of the personal data we hold about you.</li>
        <li><strong>Rectification (Art. 16)</strong> &mdash; correct inaccurate or incomplete data.</li>
        <li><strong>Erasure (Art. 17)</strong> &mdash; deletion of data, subject to legal-retention carve-outs (tax, audit, defense of legal claims).</li>
        <li><strong>Restriction (Art. 18)</strong> &mdash; limit how we process while a dispute is resolved.</li>
        <li><strong>Portability (Art. 20)</strong> &mdash; receive data in a structured, machine-readable format.</li>
        <li><strong>Objection (Art. 21)</strong> &mdash; object to processing based on legitimate interests, including direct marketing.</li>
        <li><strong>Automated decisions (Art. 22)</strong> &mdash; not to be subject to solely automated decisions producing legal or similarly significant effects, with the right to human intervention.</li>
        <li><strong>Withdraw consent (Art. 7(3))</strong> &mdash; where processing is based on consent.</li>
        <li><strong>Complaint to a supervisory authority (Art. 77)</strong> &mdash; without prejudice to any other administrative or judicial remedy.</li>
      </ul>

      <h2 id="exercise">3. How to exercise</h2>
      <p>
        Email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> with enough information for us to identify you. We respond within <strong>30 days</strong>, extendable to 60 if the request is complex (we&apos;ll tell you). Requests are free unless manifestly unfounded or excessive.
      </p>
      <p>
        For verification we may ask for additional information; we will only use that information to verify the request and will not retain it longer than necessary. Where the data is held on behalf of a Customer, we may need to route the request through that Customer; we will tell you and not unreasonably delay.
      </p>

      <h2 id="bases">4. Lawful bases</h2>
      <p>
        We rely on the lawful bases summarized in the <a href="/legal/privacy#legal-bases">Privacy Policy &sect; 5</a>: contract (Art. 6(1)(b)), legitimate interests (Art. 6(1)(f)), consent (Art. 6(1)(a)), and legal obligation (Art. 6(1)(c)). For UK data subjects the equivalent UK GDPR bases apply.
      </p>

      <h2 id="transfers">5. International transfers</h2>
      <p>
        We transfer personal data to the United States for processing. We rely on:
      </p>
      <ul>
        <li>The EU&ndash;US Data Privacy Framework where the recipient is DPF-certified;</li>
        <li>The European Commission&apos;s 2021 Standard Contractual Clauses (Modules 2 / 3) where the recipient is not DPF-certified, together with supplementary measures (encryption, access controls, transparency);</li>
        <li>The UK International Data Transfer Addendum, and the Swiss FDPIC&apos;s adapted SCCs, where applicable.</li>
      </ul>
      <p>
        On request we&apos;ll provide a redacted copy of executed SCCs and our latest transfer impact assessment (TIA).
      </p>

      <h2 id="complain">6. Right to complain</h2>
      <p>
        You can lodge a complaint with the supervisory authority of your habitual residence, place of work, or place of alleged infringement. We&apos;d appreciate the chance to address concerns first by emailing <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>, but the right to complain is preserved either way.
      </p>
      <p>The European Data Protection Board maintains the EU/EEA authority list:</p>
      <ul>
        <li><a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener">EDPB &mdash; members list</a></li>
        <li><a href="https://ico.org.uk/" target="_blank" rel="noopener">UK Information Commissioner&apos;s Office (ICO)</a></li>
        <li><a href="https://www.edoeb.admin.ch/" target="_blank" rel="noopener">Swiss FDPIC</a></li>
      </ul>

      <h2 id="contact">7. Contact</h2>
      <p>
        <strong>Controller:</strong> TrainYourAgent LLC, Tampa Bay, Florida, USA. Privacy contact: <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.<br />
        <strong>EU representative under Art. 27:</strong> not currently appointed (below the threshold); we will appoint and publish here if and when triggered.
      </p>
    </LegalLayout>
  );
}
