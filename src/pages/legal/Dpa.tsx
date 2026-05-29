// src/pages/legal/Dpa.tsx
// v76-D: Data Processing Agreement.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "definitions", label: "1. Definitions" },
  { id: "roles", label: "2. Roles & scope" },
  { id: "purposes", label: "3. Purposes & subject matter" },
  { id: "instructions", label: "4. Processor obligations" },
  { id: "subprocessors", label: "5. Sub-processors" },
  { id: "security", label: "6. Security measures (Annex II)" },
  { id: "dsrs", label: "7. Data subject requests" },
  { id: "breach", label: "8. Breach notification" },
  { id: "audit", label: "9. Audits" },
  { id: "transfers", label: "10. International transfers" },
  { id: "deletion", label: "11. Return / deletion" },
  { id: "liability", label: "12. Liability" },
  { id: "general", label: "13. General" },
  { id: "annex1", label: "Annex I — Processing details" },
  { id: "annex2", label: "Annex II — Security measures" },
  { id: "annex3", label: "Annex III — Sub-processors" },
];

export default function Dpa() {
  return (
    <LegalLayout
      slug="dpa"
      pageTitle="Data Processing Agreement"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="TrainYourAgent's Data Processing Agreement (DPA) compliant with GDPR Art. 28 and CCPA service-provider standard."
      toc={TOC}
      related={[
        { to: "/legal/sub-processors", label: "Sub-processor list", blurb: "Live, named third-party processors." },
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "Controller-side processing." },
        { to: "/legal/terms", label: "Terms of Service", blurb: "Master commercial agreement." },
      ]}
      summary={
        <>
          <p>
            This Data Processing Agreement (&ldquo;<strong>DPA</strong>&rdquo;) is the legal addendum that covers TYA processing personal data on your behalf. It satisfies GDPR Article 28, UK GDPR Article 28, and the CCPA/CPRA &ldquo;service provider&rdquo; standard (Cal. Civ. Code § 1798.140(ag)).
          </p>
          <p>
            <strong>You are the controller, we are the processor.</strong> You decide what data is processed and why; we process it on your documented instructions and don&apos;t use it for anything else. We notify you of personal-data breaches within 72 hours of discovery, give you 30 days&apos; advance notice of sub-processor changes (with a right to object), and delete or return your data within 60 days of termination.
          </p>
          <p>
            By using the Services, you accept this DPA as part of the Terms. A countersigned PDF is available on request (<a href="mailto:legal@trainyouragent.com">legal@trainyouragent.com</a>). For paid enterprise customers we will execute on your paper if you prefer.
          </p>
        </>
      }
    >
      <h2 id="definitions">1. Definitions</h2>
      <p>
        Capitalized terms not defined here have the meanings given in the Terms of Service or in GDPR Article 4. &ldquo;<strong>Applicable Data Protection Law</strong>&rdquo; means the GDPR, the UK GDPR, the UK Data Protection Act 2018, the Swiss FADP, the CCPA/CPRA, and any other privacy or data-protection law applicable to the processing.
      </p>

      <h2 id="roles">2. Roles &amp; scope</h2>
      <p>
        For all Customer Data processed under the Services, Customer is the &ldquo;Controller&rdquo; (and CCPA &ldquo;Business&rdquo;) and TYA is the &ldquo;Processor&rdquo; (and CCPA &ldquo;Service Provider&rdquo;). Where Customer is itself a processor for an upstream controller, TYA acts as a sub-processor and Customer represents that it has the authority to engage TYA on those terms.
      </p>
      <p>
        This DPA applies for as long as TYA processes Customer Data. It is incorporated into and forms part of the Terms of Service. In a conflict between the Terms and this DPA on personal-data matters, this DPA controls.
      </p>

      <h2 id="purposes">3. Purposes &amp; subject matter</h2>
      <p>
        See <strong>Annex I</strong> below for processing details (subject matter, duration, nature and purpose, categories of data subjects, categories of personal data, and frequency of transfer). The purpose is, in summary, to deliver the Services to Customer.
      </p>

      <h2 id="instructions">4. Processor obligations</h2>
      <p>TYA will:</p>
      <ol>
        <li>Process Customer Data only on Customer&apos;s documented instructions (the Terms, this DPA, configuration in the dashboard, and any other written instruction reasonably related to the Services), including transfers, unless required by law &mdash; in which case TYA will inform Customer beforehand unless that law prohibits it on grounds of public interest;</li>
        <li>Ensure personnel authorized to process Customer Data are bound by confidentiality;</li>
        <li>Implement the technical and organisational measures described in Annex II;</li>
        <li>Assist Customer in fulfilling its obligations under Articles 32&ndash;36 GDPR (security, breach, DPIA, prior consultation), at Customer&apos;s cost where this exceeds reasonable assistance;</li>
        <li>Make available all information necessary to demonstrate compliance and allow for audits as described in Section 9;</li>
        <li>Not sell or share Customer Data, not combine it with data from other sources for any purpose other than providing the Services, and not retain or use it outside the direct business relationship with Customer (CCPA § 1798.140(ag)(1)).</li>
      </ol>
      <p>
        TYA will notify Customer if, in its opinion, an instruction infringes Applicable Data Protection Law.
      </p>

      <h2 id="subprocessors">5. Sub-processors</h2>
      <p>
        Customer grants TYA general authorization to engage sub-processors, subject to the conditions below. The current list of authorized sub-processors is at <a href="/legal/sub-processors">/legal/sub-processors</a> and is incorporated as <strong>Annex III</strong>.
      </p>
      <ul>
        <li>TYA will impose data-protection terms on each sub-processor that are no less protective than this DPA;</li>
        <li>TYA remains liable for sub-processor acts and omissions as if they were TYA&apos;s own;</li>
        <li>TYA will give Customer at least 30 days&apos; prior written notice of additions or replacements of sub-processors (RSS feed or email subscription via <a href="/legal/sub-processors">/legal/sub-processors</a>);</li>
        <li>Customer may object on reasonable data-protection grounds within the notice period; if the parties cannot resolve the objection, Customer may terminate the affected Services without penalty and receive a pro-rata refund of prepaid unused fees.</li>
      </ul>

      <h2 id="security">6. Security measures (Annex II)</h2>
      <p>
        TYA implements the technical and organisational measures listed in <strong>Annex II</strong>. Customer acknowledges those measures are appropriate to the risk, taking into account the state of the art, costs of implementation, and the nature, scope, context, and purposes of processing (GDPR Art. 32).
      </p>

      <h2 id="dsrs">7. Data subject requests</h2>
      <p>
        TYA will, taking into account the nature of the processing, assist Customer by appropriate technical and organisational measures, insofar as possible, to fulfil Customer&apos;s obligation to respond to data-subject requests under Chapter III GDPR or CCPA. If TYA receives a data-subject request directly relating to Customer Data, TYA will forward it to Customer without undue delay and will not respond except to confirm receipt or as required by law.
      </p>
      <p>
        For Self-Serve customers, TYA provides self-service export and deletion in the dashboard. For larger requests, contact <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.
      </p>

      <h2 id="breach">8. Breach notification</h2>
      <p>
        TYA will notify Customer without undue delay and in any event within <strong>72 hours of discovery</strong> of a personal-data breach involving Customer Data, providing:
      </p>
      <ul>
        <li>The nature of the breach including, where possible, categories and approximate number of data subjects and records concerned;</li>
        <li>The contact point for further information;</li>
        <li>Likely consequences and the measures taken or proposed to address the breach, including, where appropriate, measures to mitigate adverse effects.</li>
      </ul>
      <p>
        Initial notice may be partial; TYA will update Customer as information becomes available. Notification by TYA is not an acknowledgement of fault or liability.
      </p>

      <h2 id="audit">9. Audits</h2>
      <p>
        TYA will make available to Customer, on written request no more than once per 12-month period:
      </p>
      <ul>
        <li>Its most recent independent attestation reports (e.g., SOC 2 Type II) and external penetration-test summary;</li>
        <li>Written responses to a reasonable security/privacy questionnaire of up to 100 questions;</li>
        <li>For enterprise customers under signed NDA, a one-day remote audit of TYA&apos;s privacy and security controls relevant to the Services, at Customer&apos;s expense, on at least 60 days&apos; advance notice and outside of TYA&apos;s production environment.</li>
      </ul>
      <p>
        Audit rights of Customer&apos;s competent supervisory authority (e.g., a national data-protection authority) are preserved as required by law.
      </p>

      <h2 id="transfers">10. International transfers</h2>
      <p>
        TYA processes Customer Data primarily in the United States. Where TYA transfers personal data from the EEA, UK, or Switzerland to a third country not covered by an adequacy decision, the parties will rely on the European Commission&apos;s 2021 Standard Contractual Clauses (Modules 2 or 3 as applicable), the UK International Data Transfer Addendum, and the Swiss FDPIC&apos;s adapted SCCs, in each case incorporated by reference. The Annexes to those Clauses are populated by the corresponding sections of this DPA.
      </p>

      <h2 id="deletion">11. Return / deletion</h2>
      <p>
        On termination or expiry of the Services, TYA will, at Customer&apos;s choice, return or delete all Customer Data, including copies, within 60 days, unless retention is required by law. For 30 days post-termination Customer can self-serve export via the dashboard or API. Backup snapshots containing Customer Data expire within 90 days of the deletion event.
      </p>

      <h2 id="liability">12. Liability</h2>
      <p>
        Each party&apos;s liability under this DPA is subject to the limitations and exclusions in the Terms of Service, except that nothing in this DPA limits a data subject&apos;s rights against either party under GDPR Article 82 or analogous law.
      </p>

      <h2 id="general">13. General</h2>
      <ul>
        <li><strong>Order of precedence</strong> for personal-data matters: SCCs (where incorporated) {'>'} this DPA {'>'} Terms.</li>
        <li><strong>Governing law</strong>: as in the Terms, subject to mandatory data-protection-law venue rules.</li>
        <li><strong>Amendment</strong>: TYA may update this DPA from time to time to reflect changes in law or sub-processor list, with 30 days&apos; prior notice for material changes.</li>
        <li><strong>Signature</strong>: by accepting the Terms, executing an order form or SOW, or otherwise using the Services on or after the effective date above, the parties agree to be bound by this DPA.</li>
      </ul>

      <hr />

      <h2 id="annex1">Annex I &mdash; Processing details</h2>
      <h3>A. List of parties</h3>
      <ul>
        <li><strong>Controller (data exporter)</strong>: Customer, as identified in the order form or account record.</li>
        <li><strong>Processor (data importer)</strong>: TrainYourAgent LLC, Tampa Bay, Florida, USA. Contact: <a href="mailto:legal@trainyouragent.com">legal@trainyouragent.com</a>.</li>
      </ul>
      <h3>B. Description of the transfer</h3>
      <ul>
        <li><strong>Categories of data subjects</strong>: Customer&apos;s end-users, leads, prospects, and customers who interact with an agent operated via the Services; Customer personnel who administer the account.</li>
        <li><strong>Categories of personal data</strong>: name, contact details (email, phone), voice recordings, transcripts, written messages, IP address, device data, CRM-record fields Customer chooses to provide, integration credentials (encrypted), any data Customer uploads into a knowledge base.</li>
        <li><strong>Sensitive data</strong>: not intentionally processed. If Customer chooses to upload sensitive data, the Customer warrants it has a lawful basis to do so and TYA processes it under the security measures in Annex II.</li>
        <li><strong>Frequency</strong>: continuous, for the duration of the Services.</li>
        <li><strong>Nature of processing</strong>: hosting, storage, transmission, model inference, transcription, synthesis, analytics, support, security monitoring, backups.</li>
        <li><strong>Purpose</strong>: providing the Services to Customer.</li>
        <li><strong>Duration of processing</strong>: as set out in the Terms and the Privacy Policy retention table.</li>
      </ul>
      <h3>C. Competent supervisory authority</h3>
      <p>
        For data exports from the EU, the supervisory authority of Customer&apos;s primary establishment; from the UK, the Information Commissioner&apos;s Office (ICO); from Switzerland, the Federal Data Protection and Information Commissioner (FDPIC).
      </p>

      <h2 id="annex2">Annex II &mdash; Security measures</h2>
      <p>TYA implements the following technical and organisational measures:</p>
      <ul>
        <li><strong>Pseudonymisation &amp; encryption</strong>: TLS 1.2+ in transit on all customer-facing endpoints; AES-256 at rest on databases and object storage; integration credentials encrypted with envelope encryption.</li>
        <li><strong>Confidentiality</strong>: role-based access control, least privilege, MFA on all administrative access, just-in-time access reviews quarterly.</li>
        <li><strong>Integrity</strong>: audit logs for administrative actions, change-management process for production deploys, signed commits required for protected branches.</li>
        <li><strong>Availability &amp; resilience</strong>: multi-region edge hosting (Vercel), daily backups, point-in-time recovery (Supabase), documented disaster-recovery runbook with RTO ≤ 4h, RPO ≤ 24h.</li>
        <li><strong>Regular testing</strong>: annual external penetration test, continuous dependency-vulnerability scanning, static-analysis on every PR.</li>
        <li><strong>Vendor management</strong>: written DPAs with each sub-processor, SOC 2 review at onboarding and annually.</li>
        <li><strong>Personnel</strong>: confidentiality agreements, background checks for staff with production access, security training at hire and annually.</li>
        <li><strong>Incident response</strong>: documented 24-hour triage runbook, named on-call rotation, 72-hour customer-breach-notification commitment.</li>
        <li><strong>Data minimization</strong>: retention defaults set per the Privacy Policy, automated deletion of expired data, dashboard controls for Customer-configurable retention.</li>
        <li><strong>Physical security</strong>: production data is hosted in cloud providers with SOC 2 / ISO 27001 certified facilities (Vercel, Supabase, AWS-backed providers). TYA has no on-premise data center.</li>
      </ul>

      <h2 id="annex3">Annex III &mdash; Sub-processors</h2>
      <p>
        The current sub-processor list lives at <a href="/legal/sub-processors">/legal/sub-processors</a> and is updated at least 30 days before any change takes effect.
      </p>
    </LegalLayout>
  );
}
