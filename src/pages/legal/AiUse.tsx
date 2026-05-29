// src/pages/legal/AiUse.tsx
// v76-D: AI Use Policy — new for 2026.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "what", label: "1. What AI we use" },
  { id: "models", label: "2. Models & providers" },
  { id: "what-we-dont", label: "3. What we DON'T do" },
  { id: "transparency", label: "4. Transparency & disclosure" },
  { id: "eu-ai-act", label: "5. EU AI Act categorization" },
  { id: "human-review", label: "6. Right to human review" },
  { id: "training-opt-in", label: "7. Optional training on your data" },
  { id: "incidents", label: "8. AI incident reporting" },
  { id: "changes", label: "9. Changes" },
];

export default function AiUse() {
  return (
    <LegalLayout
      slug="ai-use"
      pageTitle="AI Use Policy"
      lastUpdated="May 29, 2026"
      reviewedDate="May 29, 2026"
      metaDescription="How TrainYourAgent uses AI in its products — which models, what we don't do, EU AI Act categorization, and your right to human review."
      toc={TOC}
      related={[
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "Data we collect and how we use it." },
        { to: "/legal/dpa", label: "DPA", blurb: "Processor terms covering your business data." },
        { to: "/legal/aup", label: "Acceptable Use Policy", blurb: "Your rules for using TYA agents." },
      ]}
      summary={
        <>
          <p>
            We use third-party AI models inside our products. We don&apos;t train base models &mdash; we route to providers like Anthropic, Groq, Cohere, Deepgram, and Cartesia, and fine-tune on top where the SOW calls for it.
          </p>
          <p>
            <strong>We do not train any model offered to other customers on your Customer Data without your explicit, written opt-in.</strong> We do not sell your business data to model providers. Customer-owned fine-tuned weights stay yours per the <a href="/legal/terms">Terms § 6.1</a>.
          </p>
          <p>
            Under the EU AI Act, our voice and chat agents are <strong>limited-risk</strong> AI systems with transparency obligations: the agent identifies as AI when asked, on first interaction, and any time a user could plausibly think they&apos;re talking to a human. You can request human review of any agent decision that affects you.
          </p>
        </>
      }
    >
      <h2 id="what">1. What AI we use</h2>
      <p>Across our product surface, AI shows up in these forms:</p>
      <ul>
        <li><strong>Conversational LLM responses</strong> &mdash; the agent generates voice and chat replies in real time.</li>
        <li><strong>Retrieval-Augmented Generation (RAG)</strong> &mdash; the agent retrieves relevant chunks from your knowledge base before responding.</li>
        <li><strong>Speech-to-text (STT)</strong> &mdash; we transcribe caller audio in real time.</li>
        <li><strong>Text-to-speech (TTS)</strong> &mdash; we synthesize the agent&apos;s voice from text.</li>
        <li><strong>Voice cloning</strong> &mdash; only if you explicitly opt in <strong>and</strong> upload a consent recording from the person being cloned (see Section 7 and the <a href="/legal/aup">AUP</a>).</li>
        <li><strong>Embeddings</strong> &mdash; we vectorize content for semantic search and routing.</li>
        <li><strong>Evaluation</strong> &mdash; we use LLMs to score agent outputs against rubrics during build, test, and continuous QA.</li>
      </ul>

      <h2 id="models">2. Models &amp; providers</h2>
      <p>
        We do not host or maintain our own foundation models. We route to the providers below; specific routing is configured per agent based on quality, latency, cost, and Customer preferences.
      </p>
      <ul>
        <li><strong>Anthropic (Claude family)</strong> &mdash; primary LLM for most reasoning, conversation, and tool-use. US-hosted. Anthropic acts as our sub-processor under written terms; their commercial inference does not train Anthropic models on customer prompts.</li>
        <li><strong>Groq (open-weight models hosted on Groq LPUs)</strong> &mdash; latency-sensitive paths, fallback. US-hosted.</li>
        <li><strong>Cohere (embeddings)</strong> &mdash; document embeddings. US / Canada hosting.</li>
        <li><strong>Deepgram</strong> &mdash; streaming speech-to-text. US-hosted.</li>
        <li><strong>Cartesia</strong> &mdash; text-to-speech. US-hosted.</li>
        <li><strong>Pinecone</strong> &mdash; vector database for retrieval. US-hosted.</li>
      </ul>
      <p>
        For the live, named sub-processor list with locations and certifications, see <a href="/legal/sub-processors">/legal/sub-processors</a>.
      </p>

      <h2 id="what-we-dont">3. What we DON&apos;T do</h2>
      <ul>
        <li>
          <strong>We do not train our base models</strong> &mdash; we don&apos;t have base models. We don&apos;t fine-tune Anthropic&apos;s, Groq-hosted, Cohere&apos;s, Deepgram&apos;s, or Cartesia&apos;s base models.
        </li>
        <li>
          <strong>We do not train any model offered to other customers on your Customer Data without your explicit, written opt-in.</strong>
        </li>
        <li>
          <strong>We do not sell Customer Data to model providers</strong> or anyone else. Section 6 of the Privacy Policy lists the only legitimate disclosure categories.
        </li>
        <li>
          <strong>We do not use Customer call recordings or transcripts for prospect outreach</strong>, demo material, marketing content, or case studies without specific written permission for the specific use.
        </li>
        <li>
          <strong>We do not use the Services to deceive about being human</strong> in any context where deception would mislead, harm, or coerce the user.
        </li>
        <li>
          <strong>We do not deploy biometric categorization, social scoring, predictive policing, or any other use prohibited under EU AI Act Art. 5.</strong>
        </li>
      </ul>

      <h2 id="transparency">4. Transparency &amp; disclosure</h2>
      <ul>
        <li>
          <strong>AI identification on request.</strong> If a user asks &ldquo;Am I talking to a human?&rdquo; (or any reasonable variant), the agent must answer truthfully. This is a hardcoded behavior and cannot be configured off.
        </li>
        <li>
          <strong>First-interaction disclosure.</strong> The agent identifies itself as an AI on first interaction with a new user in the same session. We provide a default opening line (&ldquo;Hi, I&apos;m an AI assistant calling on behalf of [Customer].&rdquo;); Customer may localize but must keep the AI disclosure.
        </li>
        <li>
          <strong>Recording disclosure.</strong> Where Customer&apos;s jurisdiction requires consent to record (two-party-consent states / many EU jurisdictions), the agent must state recording in the opening line.
        </li>
        <li>
          <strong>Synthetic-media labeling.</strong> Audio or video generated by the Services intended for distribution beyond the immediate caller must be labeled as AI-generated, in line with the EU AI Act Art. 50(2) and similar transparency requirements coming online in US states (e.g., California AB 2655 for political deepfakes).
        </li>
      </ul>

      <h2 id="eu-ai-act">5. EU AI Act categorization</h2>
      <p>
        Under Regulation (EU) 2024/1689 (the &ldquo;AI Act&rdquo;), our agents are <strong>limited-risk AI systems</strong> intended to interact with natural persons. The applicable obligations under Art. 50 are:
      </p>
      <ul>
        <li>Transparency &mdash; users are informed they&apos;re interacting with an AI (covered in Section 4).</li>
        <li>Synthetic-content marking &mdash; outputs intended for public distribution carry machine-readable provenance (we&apos;re working with the C2PA standard for this).</li>
        <li>No use for prohibited practices (Art. 5).</li>
      </ul>
      <p>
        <strong>Our agents are not &ldquo;high-risk AI systems&rdquo; under Annex III</strong> in their default configuration: they are not deployed in employment screening, credit scoring, biometric identification, critical infrastructure, education access, law enforcement, migration / border, or judicial / democratic processes. If Customer configures the Services for any Annex III use case, Customer assumes the role of &ldquo;deployer&rdquo; (and may be re-classified as &ldquo;provider&rdquo; if substantially modified), with the corresponding obligations under the AI Act. Notify us at <a href="mailto:legal@trainyouragent.com">legal@trainyouragent.com</a>; in some cases we will decline the use case.
      </p>
      <p>
        General-Purpose AI Model obligations under Chapter V apply to the foundation-model providers (Anthropic, Groq) upstream of us, not to TYA.
      </p>

      <h2 id="human-review">6. Right to human review</h2>
      <p>
        If an agent decision affects you in a meaningful way (e.g., denial of a booking, escalation route, eligibility determination configured by Customer), you have the right to request human review by Customer&apos;s human staff. The agent will provide an escalation path (&ldquo;Would you like me to connect you to a human?&rdquo;) on request.
      </p>
      <p>
        Where the decision constitutes solely-automated processing producing legal or similarly significant effects under GDPR Art. 22, Customer (as controller) is responsible for ensuring a documented exception applies and that a meaningful right to human intervention is preserved.
      </p>

      <h2 id="training-opt-in">7. Optional training on your data</h2>
      <p>
        Customer may opt in to a model-improvement program by separate written agreement, which will specify:
      </p>
      <ul>
        <li>Which Customer Data is in scope (we recommend redacted transcripts only);</li>
        <li>The specific training run, model, and provider;</li>
        <li>Whether the resulting weights are Customer-exclusive or pooled;</li>
        <li>Compensation, if any;</li>
        <li>Withdrawal rights.</li>
      </ul>
      <p>
        Voice-cloning of a person&apos;s voice requires a separate signed consent from that person, retained for the lifetime of the cloned voice plus 7 years.
      </p>

      <h2 id="incidents">8. AI incident reporting</h2>
      <p>
        If an agent output causes a serious incident (defined under EU AI Act Art. 73 as: death of a person, serious harm to a person&apos;s health, serious and irreversible disruption of critical infrastructure, infringement of fundamental rights, serious harm to property or the environment), Customer must notify TYA within 24 hours at <a href="mailto:ai-incident@trainyouragent.com">ai-incident@trainyouragent.com</a>. TYA will assist Customer in any required reporting to relevant authorities.
      </p>

      <h2 id="changes">9. Changes</h2>
      <p>
        AI moves fast. We&apos;ll update this Policy as the underlying providers, models, and applicable law change. Material changes get 30 days&apos; advance notice via the dashboard and email of record.
      </p>
    </LegalLayout>
  );
}
