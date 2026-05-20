// src/pages/legal/Refund.tsx
// v76-D: Refund Policy.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "saas", label: "1. Self-Serve SaaS ($99/month)" },
  { id: "custom", label: "2. Custom builds" },
  { id: "hire", label: "3. Hire-the-operator" },
  { id: "process", label: "4. Refund request process" },
  { id: "chargebacks", label: "5. Chargebacks & disputes" },
  { id: "non-refundable", label: "6. Non-refundable items" },
  { id: "consumer", label: "7. Consumer-protection rights" },
];

export default function Refund() {
  return (
    <LegalLayout
      slug="refund"
      pageTitle="Refund Policy"
      lastUpdated="May 20, 2026"
      reviewedDate="May 20, 2026"
      metaDescription="Refund terms for TrainYourAgent — Self-Serve SaaS, custom builds, and hire-the-operator engagements."
      toc={TOC}
      related={[
        { to: "/legal/terms", label: "Terms of Service", blurb: "Master commercial agreement." },
        { to: "/legal/sla", label: "Service Level Agreement", blurb: "Credits for missed uptime/response targets." },
      ]}
      summary={
        <>
          <p>
            We try to be fair, written down, in advance &mdash; so you know what you&apos;re buying:
          </p>
          <ul>
            <li><strong>Self-Serve SaaS ($99/month):</strong> 7-day no-questions-asked refund on your <em>first</em> month only. No refunds on subsequent months &mdash; cancel anytime from the dashboard and you won&apos;t be charged the next month.</li>
            <li><strong>Custom builds:</strong> 50% deposit is non-refundable after the kickoff call. The 50% delivery payment is refundable for 14 days if the agent fails to meet the written acceptance criteria in your SOW.</li>
            <li><strong>Hire-the-operator:</strong> per the specific SOW.</li>
          </ul>
          <p>
            Request a refund by emailing <a href="mailto:billing@trainyouragent.com">billing@trainyouragent.com</a> with the order ID and reason. We respond within 3 business days.
          </p>
        </>
      }
    >
      <h2 id="saas">1. Self-Serve SaaS &mdash; Agent Builder ($99/month)</h2>
      <ul>
        <li><strong>First-month refund window.</strong> You may request a full refund within <strong>7 days</strong> of your first charge by emailing <a href="mailto:billing@trainyouragent.com">billing@trainyouragent.com</a>. No reason required.</li>
        <li><strong>Subsequent months.</strong> No refunds on prior months once the billing cycle closes. Cancel anytime from the dashboard or by emailing us; cancellation takes effect at the end of the current month and you keep access until then.</li>
        <li><strong>Annual prepay.</strong> If you prepay annually and cancel mid-term, you are refunded a pro-rata amount for unused full months minus a 10% administrative fee, except where prohibited by law.</li>
        <li><strong>Account closure for cause.</strong> If we terminate your account for breach of the AUP, fees are non-refundable. If we terminate for our own uncured material breach, we refund prepaid unused fees.</li>
      </ul>

      <h2 id="custom">2. Custom builds</h2>
      <ul>
        <li><strong>50/50 payment structure.</strong> Custom builds bill 50% on SOW execution and 50% on delivery. The first 50% is non-refundable once the kickoff call has occurred &mdash; this covers scoping, discovery, voice/script design, and the initial agent prototype.</li>
        <li><strong>Delivery payment &mdash; 14-day acceptance window.</strong> The second 50% is refundable for 14 days from the delivery date if the agent fails to meet the written acceptance criteria stated in the SOW. To exercise, email <a href="mailto:billing@trainyouragent.com">billing@trainyouragent.com</a> within the 14 days with the specific criteria that were missed and the evidence (call recordings, transcripts, evaluation outputs). We will work to remediate within 14 additional days; if we cannot meet the criteria after that, we refund the delivery payment.</li>
        <li><strong>Out-of-scope changes.</strong> Changes outside the SOW are quoted separately and follow the same 50/50 structure.</li>
        <li><strong>Hardware / third-party costs.</strong> Pass-through costs (telephony minutes, LLM tokens, voice synthesis usage, additional SaaS seats) are non-refundable once incurred.</li>
      </ul>

      <h2 id="hire">3. Hire-the-operator</h2>
      <ul>
        <li>Refund terms are defined in the applicable SOW. Default: monthly retainer paid in advance, non-refundable for the current month after the start of that month&apos;s engagement; cancellable for any future month on 14 days&apos; notice.</li>
        <li>If TYA materially fails to meet the deliverables defined in the SOW, you may request a pro-rata refund for the affected month; we respond within 3 business days.</li>
      </ul>

      <h2 id="process">4. Refund request process</h2>
      <ol>
        <li>Email <a href="mailto:billing@trainyouragent.com">billing@trainyouragent.com</a> from the email of record on the account. Include: <strong>order ID</strong> or last 4 digits of the card used, <strong>product line</strong>, <strong>reason</strong>, and (for custom builds) any supporting evidence.</li>
        <li>We respond within <strong>3 business days</strong> with a decision or a request for more information.</li>
        <li>If approved, refunds post back to the original payment method within 5&ndash;10 business days, depending on your bank.</li>
        <li>If denied, the response will explain why and identify any next step (e.g., remediation window).</li>
      </ol>

      <h2 id="chargebacks">5. Chargebacks &amp; disputes</h2>
      <p>
        Please contact us before initiating a chargeback. Chargebacks filed without first contacting us cost everyone time and, in some cases, trigger account suspension while we investigate. We track every refund-eligible dispute and almost always pay legitimate refunds faster than a card network can resolve a chargeback.
      </p>

      <h2 id="non-refundable">6. Non-refundable items</h2>
      <ul>
        <li>Third-party pass-through usage (telephony minutes, LLM tokens, voice synthesis seconds) once consumed;</li>
        <li>Work performed under a signed SOW after kickoff (the first 50% on custom builds);</li>
        <li>Subscriptions outside the first-month window;</li>
        <li>Fees waived as part of a discount or promotion (the original undiscounted amount remains non-refundable).</li>
      </ul>

      <h2 id="consumer">7. Consumer-protection rights</h2>
      <p>
        Nothing in this Refund Policy limits any mandatory consumer-protection right you have under the law of your habitual residence. EU consumers benefit from the 14-day cooling-off right under the Consumer Rights Directive (2011/83/EU) for distance contracts; UK consumers under the Consumer Contracts Regulations 2013. You expressly request that we begin performance of the digital service before the cooling-off period ends if you start using the Services immediately; you acknowledge that consequently you lose the cooling-off right per Art. 16(m) of the Directive.
      </p>
    </LegalLayout>
  );
}
