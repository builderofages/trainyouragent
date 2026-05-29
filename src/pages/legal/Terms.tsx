// src/pages/legal/Terms.tsx
// v76-D: Terms of Service.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "acceptance", label: "1. Acceptance" },
  { id: "services", label: "2. The services" },
  { id: "accounts", label: "3. Accounts" },
  { id: "fees", label: "4. Fees & payment" },
  { id: "refunds", label: "5. Refunds" },
  { id: "ip", label: "6. Intellectual property & data" },
  { id: "aup", label: "7. Prohibited uses" },
  { id: "availability", label: "8. Service availability & SLA" },
  { id: "warranty", label: "9. Warranty disclaimer" },
  { id: "liability", label: "10. Limitation of liability" },
  { id: "indemnity", label: "11. Indemnification" },
  { id: "termination", label: "12. Term & termination" },
  { id: "law", label: "13. Governing law & disputes" },
  { id: "changes", label: "14. Changes to these Terms" },
  { id: "general", label: "15. General provisions" },
  { id: "contact", label: "16. Contact" },
];

export default function Terms() {
  return (
    <LegalLayout
      slug="terms"
      pageTitle="Terms of Service"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="Terms of Service for TrainYourAgent — Self-Serve SaaS, custom AI agent builds, and hire-the-operator engagements."
      toc={TOC}
      related={[
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "What we collect, why, and your rights." },
        { to: "/legal/aup", label: "Acceptable Use Policy", blurb: "What you can and can't do with TYA-trained agents." },
        { to: "/legal/refund", label: "Refund Policy", blurb: "Specific refund terms by product line." },
      ]}
      summary={
        <>
          <p>
            These Terms govern your use of TrainYourAgent (&ldquo;<strong>TYA</strong>,&rdquo; &ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>&rdquo;). We sell three things: a Self-Serve SaaS plan ($99/month Agent Builder), custom AI agent builds, and hire-the-operator engagements where we run the agent for you.
          </p>
          <p>
            <strong>You own your data and the weights of any agent we train for you.</strong> We own our platform, our code, and our base models. You pay us; we deliver. If we mess up, our total liability is capped at what you paid in the last 12 months. Disputes go to Florida arbitration (US customers) or your local consumer-protection venue if you have one.
          </p>
          <p>
            Plain-English summary is not the contract. The numbered sections below are.
          </p>
        </>
      }
    >
      <h2 id="acceptance">1. Acceptance</h2>
      <p>
        By creating a TrainYourAgent account, paying an invoice, accepting a Statement of Work, or otherwise using any TYA product, website, API, dashboard, voice agent, or messaging agent (the &ldquo;<strong>Services</strong>&rdquo;), you (&ldquo;<strong>Customer</strong>,&rdquo; &ldquo;<strong>you</strong>&rdquo;) agree to these Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;). If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have authority to bind that entity, and &ldquo;<strong>you</strong>&rdquo; refers to that entity.
      </p>
      <p>
        If you do not agree, do not use the Services. Continued use after a change to these Terms constitutes acceptance of the updated version (see Section 14).
      </p>

      <h2 id="services">2. The services</h2>
      <p>TYA currently offers three product lines, each governed by these Terms plus any product-specific order form, SOW, or SLA:</p>
      <ul>
        <li>
          <strong>Self-Serve SaaS — Agent Builder ($99/month).</strong> A multi-tenant web application that lets you configure, train, evaluate, and deploy an AI agent (voice, chat, or both) against your own scripts, knowledge base, and integrations. Self-Serve is offered on a best-effort basis with no SLA.
        </li>
        <li>
          <strong>Custom builds.</strong> Bespoke agent engineering engagements scoped via a written Statement of Work (&ldquo;<strong>SOW</strong>&rdquo;). Deliverables, acceptance criteria, milestones, and fees are defined in the SOW. The applicable SLA (see <a href="/legal/sla">Service Level Agreement</a>) applies once the agent is in production.
        </li>
        <li>
          <strong>Hire-the-operator.</strong> Managed-service engagements where TYA staff operate, monitor, and iterate on the agent on your behalf. Scope, headcount, hours, response targets, and reporting cadence are defined in the SOW.
        </li>
      </ul>
      <p>
        We may add, modify, or sunset features. Material removals from Self-Serve will be communicated at least 30 days in advance via the dashboard or email of record. Custom-build deliverables defined in an active SOW are not subject to sunset without your written agreement.
      </p>

      <h2 id="accounts">3. Accounts</h2>
      <p>
        To access the Services you must register an account. You agree to (a) provide accurate, current information, (b) keep credentials confidential, (c) be responsible for all activity under your account, and (d) notify us promptly at <a href="mailto:security@trainyouragent.com">security@trainyouragent.com</a> of any suspected unauthorized use.
      </p>
      <p>
        You are responsible for the actions of any user, contractor, or sub-contractor you grant access. You must not let anyone use your account who has not agreed to these Terms.
      </p>
      <p>
        You must be at least 18 years old, legally able to enter contracts in your jurisdiction, and not on any US or EU sanctions list, denied-party list, or located in a jurisdiction embargoed by the US Office of Foreign Assets Control (OFAC).
      </p>

      <h2 id="fees">4. Fees &amp; payment</h2>
      <p>
        Fees, billing cadence, currency, and renewal terms are stated on your order form, in the dashboard at signup, or in the applicable SOW. Unless stated otherwise:
      </p>
      <ul>
        <li>Self-Serve is billed monthly in advance via Stripe and renews automatically each month until cancelled.</li>
        <li>Custom builds are billed 50% on SOW execution and 50% on delivery (see <a href="/legal/refund">Refund Policy</a>).</li>
        <li>Hire-the-operator engagements are billed monthly in advance.</li>
        <li>All amounts are exclusive of taxes (sales, use, VAT, GST, etc.); you are responsible for those except taxes on our net income.</li>
        <li>Invoices not paid within 15 days of due date accrue interest at the lesser of 1.5% per month or the maximum allowed by law, and we may suspend the Services on 7 days&apos; written notice (email is sufficient).</li>
      </ul>
      <p>
        Stripe is our payment processor; TYA does not store full card numbers, CVVs, or bank account numbers on its own systems. Disputed charges should be raised with us before initiating a chargeback &mdash; we&apos;ll respond within 3 business days.
      </p>

      <h2 id="refunds">5. Refunds</h2>
      <p>
        Refund eligibility is governed by the <a href="/legal/refund">Refund Policy</a>. In short:
      </p>
      <ul>
        <li>Self-Serve SaaS: 7-day no-questions refund on first month only.</li>
        <li>Custom builds: 50% deposit non-refundable after kickoff call; 50% delivery payment refundable for 14 days if written acceptance criteria are not met.</li>
        <li>Hire-the-operator: per applicable SOW.</li>
      </ul>

      <h2 id="ip">6. Intellectual property &amp; data</h2>
      <h3>6.1 Customer ownership.</h3>
      <p>
        As between you and TYA, you own and retain all rights, title, and interest in: (a) Customer Data (anything you, your users, or your customers upload, transmit, or generate through the Services, including call recordings, transcripts, leads, and CRM records); (b) any agent configurations, prompts, and scripts you author; and (c) <strong>the trained model weights of any agent we fine-tune or train for you using your data under a custom-build SOW</strong>, subject to payment in full and the license-back described in Section 6.3.
      </p>
      <h3>6.2 TYA ownership.</h3>
      <p>
        TYA owns and retains all rights to: (a) the Services themselves, including all software, infrastructure, dashboards, APIs, documentation, and product designs; (b) base models we license from third parties (subject to those licenses); (c) any pre-existing libraries, frameworks, evaluation harnesses, and tooling; and (d) anonymized, aggregated usage statistics that do not identify you or any individual.
      </p>
      <h3>6.3 License-back.</h3>
      <p>
        You grant TYA a non-exclusive, worldwide, royalty-free license to access, host, process, transmit, display, and otherwise use Customer Data <em>solely</em> to provide, secure, support, and improve the Services for you. We do not use Customer Data to train our base models or any model offered to other customers without your explicit opt-in.
      </p>
      <h3>6.4 Feedback.</h3>
      <p>
        If you give us feedback or suggestions, we may use them without restriction or compensation, but we will not identify you as the source.
      </p>

      <h2 id="aup">7. Prohibited uses</h2>
      <p>
        You must not, and must not allow any third party to, use the Services to:
      </p>
      <ul>
        <li>Generate, transmit, or solicit content that is unlawful, defamatory, fraudulent, sexually explicit involving minors, or that incites violence;</li>
        <li>Impersonate any real person without that person&apos;s documented consent (including by cloning a voice);</li>
        <li>Send unsolicited mass messages or calls in violation of the TCPA (47 U.S.C. § 227), the CAN-SPAM Act, the UK PECR, the EU ePrivacy Directive, or any analogous law in your jurisdiction;</li>
        <li>Scrape, harvest, or otherwise extract data from any third-party platform in violation of that platform&apos;s terms or applicable computer-fraud laws;</li>
        <li>Reverse-engineer, decompile, or attempt to extract source code, model weights, or training data from the Services, except to the extent expressly permitted by applicable law (e.g., interoperability rights under EU Software Directive 2009/24/EC Art. 6);</li>
        <li>Use the Services in safety-critical contexts where failure could cause death, personal injury, or environmental damage (medical diagnosis, autonomous vehicles, critical infrastructure) without a separate written agreement;</li>
        <li>Resell or sublicense the Services without a written reseller, white-label, or partner agreement.</li>
      </ul>
      <p>
        The full list lives in the <a href="/legal/aup">Acceptable Use Policy</a>, which is incorporated into these Terms by reference. Enforcement actions (warning, suspension, termination, civil action) are described there.
      </p>

      <h2 id="availability">8. Service availability &amp; SLA</h2>
      <p>
        <strong>Self-Serve SaaS is provided on a best-effort basis with no uptime guarantee.</strong> We monitor uptime and publish historical data at <a href="/uptime">/uptime</a>, but Self-Serve does not include service credits.
      </p>
      <p>
        For custom builds in production and for hire-the-operator engagements, the applicable <a href="/legal/sla">Service Level Agreement</a> governs uptime targets, response times, and service-credit remedies. Where the SLA conflicts with these Terms on availability matters, the SLA controls.
      </p>

      <h2 id="warranty">9. Warranty disclaimer</h2>
      <p>
        TYA warrants that the Services will be provided with commercially reasonable skill and care. <strong>EXCEPT FOR THE LIMITED WARRANTY IN THIS SECTION, THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ANY WARRANTY ARISING FROM COURSE OF DEALING, USAGE, OR TRADE PRACTICE.</strong>
      </p>
      <p>
        AI systems make mistakes. Outputs can be inaccurate, biased, or inappropriate, and you must independently verify any output before relying on it for any decision affecting health, finances, legal rights, employment, or safety. Some jurisdictions do not allow exclusion of implied warranties; in those jurisdictions, the exclusions apply only to the maximum extent permitted by law.
      </p>

      <h2 id="liability">10. Limitation of liability</h2>
      <p>
        <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY (NOR ITS AFFILIATES, OFFICERS, OR EMPLOYEES) WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST REVENUE, LOST BUSINESS, LOST DATA, OR COST OF SUBSTITUTE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY.</strong>
      </p>
      <p>
        <strong>EACH PARTY&apos;S TOTAL CUMULATIVE LIABILITY UNDER THESE TERMS, FROM ALL CAUSES OF ACTION AND THEORIES OF LIABILITY (CONTRACT, TORT, STATUTE, OR OTHERWISE), IS LIMITED TO THE AMOUNTS YOU PAID TO TYA UNDER THESE TERMS IN THE 12 MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</strong>
      </p>
      <p>
        The above limits do not apply to: (a) your obligation to pay fees due; (b) either party&apos;s indemnification obligations under Section 11; (c) breach of confidentiality; (d) infringement of the other party&apos;s intellectual property; or (e) gross negligence, fraud, or willful misconduct.
      </p>
      <p>
        Some jurisdictions do not allow limitations on certain damages; in those jurisdictions, the limitations apply only to the maximum extent permitted by law.
      </p>

      <h2 id="indemnity">11. Indemnification</h2>
      <h3>11.1 By TYA.</h3>
      <p>
        TYA will defend and indemnify you against any third-party claim alleging that the Services, when used as authorized, infringe a US patent, copyright, or trade secret, and will pay damages or settlement amounts finally awarded against you in such a claim, provided you (i) promptly notify us in writing, (ii) give us sole control of the defense and settlement, and (iii) reasonably cooperate at our expense. If a claim is made or likely, we may at our option (a) procure rights for you to continue use, (b) replace or modify the Services to be non-infringing, or (c) terminate the affected Services and refund any prepaid unused fees. This Section states our sole liability and your sole remedy for IP claims.
      </p>
      <h3>11.2 By Customer.</h3>
      <p>
        You will defend and indemnify TYA against any third-party claim arising from (a) Customer Data; (b) your use of the Services in violation of these Terms, the AUP, or law; (c) your products, services, or business; or (d) calls, messages, or other communications sent via the Services to recipients in violation of TCPA, CAN-SPAM, GDPR, PECR, or analogous laws.
      </p>

      <h2 id="termination">12. Term &amp; termination</h2>
      <p>
        These Terms remain in effect for as long as you use the Services or have an active subscription, SOW, or unpaid invoice.
      </p>
      <ul>
        <li><strong>Termination for convenience.</strong> You may cancel Self-Serve at any time from the dashboard, effective at the end of the current billing month. Custom builds and hire-the-operator engagements terminate according to the applicable SOW.</li>
        <li><strong>Termination for cause.</strong> Either party may terminate immediately if the other materially breaches and fails to cure within 15 days of written notice (or 5 days for non-payment).</li>
        <li><strong>Suspension.</strong> We may suspend the Services without notice if continued use poses a security risk to us or any other customer, or violates the AUP in a manner that risks material harm to third parties.</li>
        <li><strong>Effect of termination.</strong> Upon termination, your right to use the Services ends, and we will: (i) provide you a 30-day window to export Customer Data through the dashboard or API; (ii) delete Customer Data from production systems within 60 days of termination (backup retention up to 90 days, per the <a href="/legal/dpa">DPA</a>); (iii) refund any prepaid unused fees if termination is for our uncured material breach. Sections that by their nature should survive (4, 5, 6, 9, 10, 11, 13, 15) survive termination.</li>
      </ul>

      <h2 id="law">13. Governing law &amp; disputes</h2>
      <h3>13.1 Governing law.</h3>
      <p>
        These Terms are governed by the laws of the State of Florida, USA, excluding its conflict-of-laws rules. The United Nations Convention on Contracts for the International Sale of Goods does not apply.
      </p>
      <h3>13.2 Arbitration (US customers).</h3>
      <p>
        Any dispute arising out of or relating to these Terms or the Services will be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, before a single arbitrator, seated in Hillsborough County, Florida, with each party bearing its own costs except as the arbitrator may award. Judgment on the award may be entered in any court of competent jurisdiction. <strong>You and TYA each waive any right to a jury trial and any right to participate in a class action.</strong> Either party may seek injunctive or equitable relief in court for IP misuse, breach of confidentiality, or breach of the AUP.
      </p>
      <h3>13.3 Customers in the EU, UK, and other consumer-protection jurisdictions.</h3>
      <p>
        Nothing in these Terms removes mandatory rights you have as a consumer or business under the laws of your habitual residence. You may bring proceedings in your local courts where required by law.
      </p>
      <h3>13.4 Time limit.</h3>
      <p>
        Any claim must be brought within one (1) year after the cause of action accrues, or it is permanently barred, except where prohibited by applicable law.
      </p>

      <h2 id="changes">14. Changes to these Terms</h2>
      <p>
        We may modify these Terms from time to time. If a change is material, we will give at least 30 days&apos; advance notice via email to the address of record and a banner in the dashboard. Non-material changes (e.g., typo fixes, clarifications) take effect on posting. The &ldquo;Last updated&rdquo; date at the top of this page reflects the latest revision. Continued use after the effective date constitutes acceptance; if you do not agree, you may terminate per Section 12.
      </p>

      <h2 id="general">15. General provisions</h2>
      <ul>
        <li><strong>Entire agreement.</strong> These Terms (with the Privacy Policy, AUP, DPA where applicable, SLA where applicable, and any order form or SOW) are the entire agreement between the parties and supersede any prior or contemporaneous agreements on the subject matter.</li>
        <li><strong>Order of precedence.</strong> In a conflict: (1) executed SOW; (2) order form; (3) DPA; (4) SLA; (5) these Terms; (6) AUP; (7) Privacy Policy.</li>
        <li><strong>Assignment.</strong> Neither party may assign these Terms without the other&apos;s consent, except that either party may assign to an affiliate or to a successor in connection with a merger or sale of substantially all assets.</li>
        <li><strong>Force majeure.</strong> Neither party is liable for failure to perform due to causes beyond reasonable control (acts of god, war, terrorism, pandemic, internet backbone outage, sanctions).</li>
        <li><strong>Notices.</strong> Notices to TYA: <a href="mailto:legal@trainyouragent.com">legal@trainyouragent.com</a>. Notices to Customer: the email of record. Notices are effective on transmission.</li>
        <li><strong>Independent contractors.</strong> The parties are independent contractors; nothing creates a partnership, joint venture, agency, or employment relationship.</li>
        <li><strong>No third-party beneficiaries.</strong> There are no third-party beneficiaries except as expressly stated.</li>
        <li><strong>Severability.</strong> If any provision is held unenforceable, the remainder remains in effect and the unenforceable provision is reformed to the minimum extent necessary.</li>
        <li><strong>No waiver.</strong> Failure to enforce a provision is not a waiver.</li>
        <li><strong>Government use.</strong> The Services are &ldquo;commercial computer software&rdquo; under FAR 12.212 and DFARS 227.7202; US government rights are limited to those granted by these Terms.</li>
        <li><strong>Export.</strong> You will comply with all applicable export-control and sanctions laws (US EAR, OFAC, EU 2021/821, UK ECJU).</li>
      </ul>

      <h2 id="contact">16. Contact</h2>
      <p>
        TrainYourAgent LLC, Tampa Bay, Florida, USA. Legal notices: <a href="mailto:legal@trainyouragent.com">legal@trainyouragent.com</a>. General contact: <a href="/contact">/contact</a>.
      </p>
    </LegalLayout>
  );
}
