// src/pages/legal/Sla.tsx
// v76-D: Service Level Agreement.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "scope", label: "1. Scope" },
  { id: "definitions", label: "2. Definitions" },
  { id: "uptime", label: "3. Uptime commitment" },
  { id: "response", label: "4. Support response targets" },
  { id: "credits", label: "5. Service credits" },
  { id: "claim", label: "6. Credit claim process" },
  { id: "exclusions", label: "7. Exclusions" },
  { id: "maintenance", label: "8. Planned maintenance" },
  { id: "reporting", label: "9. Reporting" },
  { id: "changes", label: "10. Changes" },
];

export default function Sla() {
  return (
    <LegalLayout
      slug="sla"
      pageTitle="Service Level Agreement"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="TrainYourAgent's Service Level Agreement for custom builds and hire-the-operator engagements — uptime, response, credits."
      toc={TOC}
      related={[
        { to: "/legal/terms", label: "Terms of Service", blurb: "Master commercial agreement." },
        { to: "/legal/dpa", label: "DPA", blurb: "Data-processing terms." },
        { to: "/uptime", label: "Public uptime report", blurb: "Historical performance data." },
      ]}
      summary={
        <>
          <p>
            <strong>This SLA applies to custom builds in production and to hire-the-operator engagements only.</strong> Self-Serve SaaS at $99/month is best-effort with no service credits &mdash; we publish historical uptime at <a href="/uptime">/uptime</a> for transparency, but there is no monthly guarantee.
          </p>
          <p>
            For in-scope services: <strong>99.5% monthly uptime</strong>. <strong>P1 response in 4 business hours</strong>, P2 in 1 business day, P3 in 3 business days. Miss the uptime target and we credit 10% of that month&apos;s fee for every 0.5% below 99.5%, capped at 50%.
          </p>
        </>
      }
    >
      <h2 id="scope">1. Scope</h2>
      <p>
        This Service Level Agreement (&ldquo;<strong>SLA</strong>&rdquo;) applies to (a) custom-build agents that have entered production under an executed Statement of Work and have completed acceptance, and (b) hire-the-operator engagements. Self-Serve SaaS subscriptions are not covered by this SLA &mdash; they are provided on a best-effort basis per the <a href="/legal/terms">Terms § 8</a>.
      </p>
      <p>
        Where this SLA conflicts with the Terms on availability or response matters, this SLA controls. Where an executed SOW contains a different SLA, the SOW controls.
      </p>

      <h2 id="definitions">2. Definitions</h2>
      <ul>
        <li><strong>Service Month.</strong> A calendar month in which the in-scope service is provided.</li>
        <li><strong>Total Minutes.</strong> The number of minutes in a Service Month.</li>
        <li><strong>Downtime.</strong> A continuous period of at least 5 minutes during which the in-scope service is unavailable for production use as a result of TYA&apos;s production environment or operations. Determined from TYA&apos;s monitoring; Customer may dispute with its own logs.</li>
        <li><strong>Uptime Percentage.</strong> (Total Minutes &minus; Downtime Minutes) &divide; Total Minutes &times; 100.</li>
        <li><strong>Severity</strong> &mdash; see Section 4.</li>
        <li><strong>Business Hours.</strong> 9:00 a.m. &ndash; 6:00 p.m. US Eastern Time, Monday&ndash;Friday, excluding US federal holidays.</li>
      </ul>

      <h2 id="uptime">3. Uptime commitment</h2>
      <p>
        TYA targets <strong>99.5% Uptime Percentage</strong> per Service Month for in-scope services. This is approximately 3 hours, 39 minutes of allowable Downtime per 30-day month.
      </p>

      <h2 id="response">4. Support response targets</h2>
      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Definition</th>
            <th>Initial response target</th>
            <th>Update cadence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>P1 &mdash; Critical</strong></td>
            <td>Service is fully unavailable in production, OR an agent is causing harm to end users or to third parties (e.g., placing erroneous calls).</td>
            <td>4 Business Hours</td>
            <td>Hourly until resolved</td>
          </tr>
          <tr>
            <td><strong>P2 &mdash; High</strong></td>
            <td>Major feature impaired with no reasonable workaround. Production continues but at reduced quality.</td>
            <td>1 Business Day</td>
            <td>Daily until resolved</td>
          </tr>
          <tr>
            <td><strong>P3 &mdash; Normal</strong></td>
            <td>Bug, configuration question, or feature request with a workaround.</td>
            <td>3 Business Days</td>
            <td>As progress warrants</td>
          </tr>
          <tr>
            <td><strong>P4 &mdash; Low</strong></td>
            <td>Cosmetic issue, documentation request, general question.</td>
            <td>5 Business Days</td>
            <td>As progress warrants</td>
          </tr>
        </tbody>
      </table>
      <p>
        File a ticket at <a href="mailto:support@trainyouragent.com">support@trainyouragent.com</a> with the proposed severity, a short description, the agent ID, and (for P1) a phone number for the on-call escalation. TYA may re-classify severity in good faith; Customer may dispute via reply.
      </p>

      <h2 id="credits">5. Service credits</h2>
      <h3>5.1 Uptime credits.</h3>
      <table>
        <thead>
          <tr>
            <th>Monthly Uptime Percentage</th>
            <th>Service credit (as % of that month&apos;s fee)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>&lt; 99.5% but &ge; 99.0%</td><td>10%</td></tr>
          <tr><td>&lt; 99.0% but &ge; 98.5%</td><td>20%</td></tr>
          <tr><td>&lt; 98.5% but &ge; 98.0%</td><td>30%</td></tr>
          <tr><td>&lt; 98.0% but &ge; 97.5%</td><td>40%</td></tr>
          <tr><td>&lt; 97.5%</td><td>50% (cap)</td></tr>
        </tbody>
      </table>
      <h3>5.2 Response-target credits.</h3>
      <p>
        If TYA misses an initial-response target on a P1 ticket twice in a Service Month, Customer is entitled to a credit of 5% of that month&apos;s fee per missed P1.
      </p>
      <h3>5.3 Cap.</h3>
      <p>
        Total credits in any Service Month are capped at 50% of that month&apos;s fee. Service credits are Customer&apos;s sole and exclusive remedy for missed SLA targets and are not refundable in cash, except where the affected service is terminated and prepaid unused fees remain.
      </p>

      <h2 id="claim">6. Credit claim process</h2>
      <ol>
        <li>Email <a href="mailto:billing@trainyouragent.com">billing@trainyouragent.com</a> within 30 days of the end of the affected Service Month.</li>
        <li>Include: the affected agent or service, the dates and times of incidents, and your monitoring evidence (where available).</li>
        <li>TYA responds within 10 Business Days with a credit determination.</li>
        <li>Approved credits are applied to the next month&apos;s invoice.</li>
      </ol>

      <h2 id="exclusions">7. Exclusions</h2>
      <p>Downtime caused by the following does not count against the Uptime Percentage:</p>
      <ul>
        <li>Planned Maintenance (see Section 8);</li>
        <li>Force majeure events (acts of god, war, terrorism, civil unrest, pandemic, internet backbone outage, sanctions);</li>
        <li>Customer-caused issues, including misconfiguration, exceeding agreed rate limits, suspension under the <a href="/legal/aup">AUP</a>, or non-payment;</li>
        <li>Third-party dependencies outside TYA&apos;s control where the dependency is operating outside its own published SLA (e.g., Twilio, Anthropic, Cartesia, Deepgram, Vercel, Supabase, Stripe, the public PSTN, end-user ISPs, US PSTN carriers, EU mobile carriers). Where the third-party outage affects multiple TYA customers and is attributable to TYA&apos;s vendor selection, TYA will use commercially reasonable efforts to recover credits from the vendor and pass them to Customer pro-rata;</li>
        <li>Issues caused by Customer&apos;s code, integrations, or third-party tools, including misuse of TYA APIs;</li>
        <li>Beta features, expressly marked as such.</li>
      </ul>

      <h2 id="maintenance">8. Planned maintenance</h2>
      <p>
        TYA may schedule planned maintenance windows with at least <strong>7 days&apos; advance notice</strong> via email of record and a dashboard banner. Standard windows are Sundays 02:00&ndash;05:00 US Eastern Time. Emergency maintenance for security or stability may occur with shorter notice; TYA will minimize duration and communicate impact.
      </p>

      <h2 id="reporting">9. Reporting</h2>
      <p>
        Real-time and historical uptime is published at <a href="/uptime">/uptime</a> and at <a href="/status">/status</a>. Enterprise customers can request a monthly SLA report; email <a href="mailto:support@trainyouragent.com">support@trainyouragent.com</a>.
      </p>

      <h2 id="changes">10. Changes</h2>
      <p>
        TYA may update this SLA with 60 days&apos; advance notice for material changes. Reductions in service level apply only at renewal of the underlying SOW or annual term.
      </p>
    </LegalLayout>
  );
}
