// src/pages/legal/SubProcessors.tsx
// v76-D: Sub-processor list.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "notice", label: "Notice & change policy" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "ai-models", label: "AI models & inference" },
  { id: "voice-comm", label: "Voice & communications" },
  { id: "payments", label: "Payments" },
  { id: "ops", label: "Sales & ops tooling" },
  { id: "objection", label: "How to object" },
];

type SubProcessor = {
  name: string;
  purpose: string;
  data: string;
  location: string;
  certs: string;
};

const INFRA: SubProcessor[] = [
  { name: "Vercel", purpose: "Hosting, edge serverless functions, CDN.", data: "Marketing site traffic, dashboard traffic, request logs.", location: "Global edge (origin US); EU edge for EU requests.", certs: "SOC 2 Type II, ISO 27001, GDPR" },
  { name: "Supabase", purpose: "Postgres database, auth, object storage.", data: "Account data, configuration, agent state, Customer Data uploads.", location: "US (us-east-1 primary).", certs: "SOC 2 Type II, HIPAA-eligible" },
  { name: "Cloudflare (via Vercel)", purpose: "Edge bot management, WAF.", data: "Request metadata.", location: "Global edge.", certs: "SOC 2 Type II, ISO 27001, PCI DSS" },
];

const AI: SubProcessor[] = [
  { name: "Anthropic", purpose: "Primary LLM inference (Claude family).", data: "Prompts, retrieved context, generated outputs. Not used to train Anthropic models.", location: "US.", certs: "SOC 2 Type II, ISO 27001, HIPAA-eligible (Enterprise plans)" },
  { name: "Groq", purpose: "Latency-sensitive open-model LLM inference and fallback.", data: "Prompts, outputs.", location: "US.", certs: "SOC 2 Type II" },
  { name: "Cohere", purpose: "Document embeddings for RAG.", data: "Document chunks for embedding.", location: "US / Canada.", certs: "SOC 2 Type II" },
  { name: "Pinecone", purpose: "Vector database for retrieval.", data: "Embedding vectors and metadata.", location: "US (configurable: EU on Enterprise).", certs: "SOC 2 Type II, ISO 27001, HIPAA-eligible" },
];

const VOICE: SubProcessor[] = [
  { name: "Twilio", purpose: "Telephony (PSTN, SIP), SMS.", data: "Phone numbers, call audio (transient), SMS bodies.", location: "US.", certs: "SOC 2 Type II, ISO 27001, PCI DSS, HIPAA-eligible" },
  { name: "Deepgram", purpose: "Streaming speech-to-text.", data: "Call audio, transcripts.", location: "US.", certs: "SOC 2 Type II, HIPAA-eligible" },
  { name: "Cartesia", purpose: "Text-to-speech synthesis.", data: "Generated speech text (transient).", location: "US.", certs: "SOC 2 Type II (in progress, attestation expected 2026)" },
];

const PAY: SubProcessor[] = [
  { name: "Stripe", purpose: "Payment processing, invoicing.", data: "Cardholder data (Stripe-tokenized), name, email, billing address.", location: "US, EU.", certs: "SOC 1, SOC 2, PCI DSS Level 1, ISO 27001" },
];

const OPS: SubProcessor[] = [
  { name: "Resend", purpose: "Transactional email delivery.", data: "Recipient email, message body, delivery metadata.", location: "US / EU.", certs: "SOC 2 Type II" },
  { name: "Cal.com", purpose: "Booking & scheduling.", data: "Scheduling metadata, booker email, attendee details.", location: "US.", certs: "SOC 2 Type II, GDPR" },
  { name: "Google Analytics 4 (Google LLC)", purpose: "Aggregate site analytics on marketing site only.", data: "Pseudonymous identifiers, page-view events, IP anonymized.", location: "US / EU.", certs: "ISO 27001, DPF-certified" },
  { name: "Meta (Meta Pixel)", purpose: "Ad-conversion measurement on marketing site only.", data: "Pseudonymous event IDs, page URL, hashed email for matching where consented.", location: "US.", certs: "DPF-certified" },
];

function Table({ rows }: { rows: SubProcessor[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Purpose</th>
          <th>Data categories</th>
          <th>Location</th>
          <th>Certifications</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td><strong>{r.name}</strong></td>
            <td>{r.purpose}</td>
            <td>{r.data}</td>
            <td>{r.location}</td>
            <td>{r.certs}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function SubProcessors() {
  return (
    <LegalLayout
      slug="sub-processors"
      pageTitle="Sub-processor list"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="Live list of TrainYourAgent's sub-processors: name, purpose, data categories, location, and certifications."
      toc={TOC}
      related={[
        { to: "/legal/dpa", label: "DPA", blurb: "Sub-processor governance terms." },
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "What we collect and share." },
        { to: "/legal/ai-use", label: "AI Use Policy", blurb: "Model-specific commitments." },
      ]}
      summary={
        <>
          <p>
            This is the live, named list of third parties we use to process Customer Data. Updates are posted here at least <strong>30 days before they take effect</strong>; customers may object on reasonable data-protection grounds per <a href="/legal/dpa">DPA § 5</a>.
          </p>
          <p>
            To get notified of changes, email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> &mdash; we maintain a quiet announcement list.
          </p>
        </>
      }
    >
      <h2 id="notice">Notice &amp; change policy</h2>
      <p>
        TYA gives at least 30 days&apos; prior notice for additions or replacements of sub-processors. The notice runs from the date of update on this page or the date of email notice, whichever is earlier. Customers may object on reasonable data-protection grounds within the notice window; if the parties cannot resolve the objection, the affected service may be terminated without penalty per <a href="/legal/dpa">DPA § 5</a>.
      </p>

      <h2 id="infrastructure">Infrastructure</h2>
      <Table rows={INFRA} />

      <h2 id="ai-models">AI models &amp; inference</h2>
      <Table rows={AI} />
      <p className="text-[14px] text-slate-500 mt-2">
        All AI providers above are contractually prohibited from using Customer-Data-derived prompts to train their public models. See the <a href="/legal/ai-use">AI Use Policy</a>.
      </p>

      <h2 id="voice-comm">Voice &amp; communications</h2>
      <Table rows={VOICE} />

      <h2 id="payments">Payments</h2>
      <Table rows={PAY} />
      <p className="text-[14px] text-slate-500 mt-2">
        TYA does not store full PAN, CVV, or bank-account numbers. Stripe handles those under PCI DSS Level 1.
      </p>

      <h2 id="ops">Sales &amp; operations tooling</h2>
      <Table rows={OPS} />
      <p className="text-[14px] text-slate-500 mt-2">
        GA4 and Meta Pixel fire on the marketing site only. They are not loaded inside the customer dashboard or inside agents.
      </p>

      <h2 id="objection">How to object</h2>
      <p>
        Email <a href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> with subject &ldquo;Sub-processor objection&rdquo; and identify the sub-processor and your data-protection ground. We&apos;ll respond within 5 business days and work in good faith to resolve. If unresolvable, you may terminate the affected service per the <a href="/legal/dpa">DPA</a>.
      </p>
    </LegalLayout>
  );
}
