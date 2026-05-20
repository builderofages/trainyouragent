// src/pages/legal/Aup.tsx
// v76-D: Acceptable Use Policy.

import LegalLayout from "@/components/legal/LegalLayout";

const TOC = [
  { id: "scope", label: "1. Scope" },
  { id: "core", label: "2. Core rules" },
  { id: "voice", label: "3. Voice-specific rules" },
  { id: "messaging", label: "4. Messaging-specific rules" },
  { id: "weights", label: "5. Model weights, prompts, benchmarks" },
  { id: "enforcement", label: "6. Enforcement" },
  { id: "report", label: "7. Reporting abuse" },
];

export default function Aup() {
  return (
    <LegalLayout
      slug="aup"
      pageTitle="Acceptable Use Policy"
      lastUpdated="May 20, 2026"
      reviewedDate="May 20, 2026"
      metaDescription="What you can and can't do with TrainYourAgent-trained agents — voice, messaging, model weights, and benchmarks."
      toc={TOC}
      related={[
        { to: "/legal/terms", label: "Terms of Service", blurb: "Master contract incorporating this policy." },
        { to: "/legal/ai-use", label: "AI Use Policy", blurb: "What we do and don't do with AI." },
        { to: "/legal/privacy", label: "Privacy Policy", blurb: "Data handling on our side." },
      ]}
      summary={
        <>
          <p>
            This is the &ldquo;don&apos;t do bad things with our agents&rdquo; document. It&apos;s short on purpose so there&apos;s no ambiguity.
          </p>
          <p>
            <strong>Don&apos;t</strong>: impersonate real people without their written consent, run unconsented voice clones, blast unsolicited mass calls or texts in violation of TCPA/CAN-SPAM/PECR, harass anyone, scrape protected platforms, use the service for illegal activity, try to extract our model weights, or publish benchmark numbers about our service without our written permission.
          </p>
          <p>
            We enforce in this order: warning &rarr; suspension &rarr; termination &rarr; civil action. Egregious violations skip steps.
          </p>
        </>
      }
    >
      <h2 id="scope">1. Scope</h2>
      <p>
        This Acceptable Use Policy (&ldquo;<strong>AUP</strong>&rdquo;) applies to all use of TrainYourAgent (&ldquo;<strong>TYA</strong>&rdquo;) products: Self-Serve SaaS, custom builds, hire-the-operator, and any APIs, agents, or tooling we provide. The AUP is incorporated into the <a href="/legal/terms">Terms of Service</a> and binds Customer, its end users, and anyone Customer authorizes to access the Services.
      </p>

      <h2 id="core">2. Core rules</h2>
      <p>You must not, and must not let any third party, use the Services to:</p>
      <ol>
        <li>
          <strong>Impersonate any real person without that person&apos;s documented consent.</strong> This includes cloning a real person&apos;s voice (whether their voice is recorded in an audio file you upload, in a publicly available recording, or in a real-time call) for any output the listener could mistake for the real person. Clear AI disclosure plus consent is the minimum baseline.
        </li>
        <li>
          <strong>Generate or transmit content that is unlawful, defamatory, hateful, or harassing</strong>, that incites violence, or that constitutes child sexual abuse material (CSAM) or non-consensual intimate imagery (NCII). CSAM and NCII trigger immediate termination and reporting to appropriate authorities (e.g., NCMEC in the US).
        </li>
        <li>
          <strong>Run unsolicited mass outreach in violation of law.</strong> This includes TCPA (47 U.S.C. § 227) for US phone/text, CAN-SPAM for US email, the FTC Telemarketing Sales Rule, the Federal/State Do Not Call registries, the UK PECR, the EU ePrivacy Directive, and CASL in Canada.
        </li>
        <li>
          <strong>Scrape, harvest, or otherwise extract data from any third-party platform</strong> in violation of that platform&apos;s terms, the Computer Fraud and Abuse Act (18 U.S.C. § 1030), the UK Computer Misuse Act 1990, or analogous laws.
        </li>
        <li>
          <strong>Process personal data without a lawful basis</strong> under GDPR Art. 6 (or equivalent), or use the Services to make solely-automated decisions producing legal or similarly significant effects on individuals (GDPR Art. 22) without a documented exception.
        </li>
        <li>
          <strong>Use the Services for fraud</strong>, including pretexting, romance scams, fake-charity solicitations, fake-IRS or fake-bank calls, or any social-engineering scheme.
        </li>
        <li>
          <strong>Run the Services against minors under 16</strong> without verified parental consent, or in any way that violates COPPA, the UK Age-Appropriate Design Code, or the EU&apos;s Digital Services Act provisions for minors.
        </li>
        <li>
          <strong>Use the Services in safety-critical contexts</strong> where failure could cause death, personal injury, or environmental damage (medical diagnosis without clinician oversight, autonomous vehicles, critical infrastructure operations), absent a separate written agreement and a documented risk-management plan.
        </li>
        <li>
          <strong>Use the Services against TYA itself</strong>: do not use the Services or any data inside them to develop, train, or improve a competing product, service, or model.
        </li>
        <li>
          <strong>Bypass rate limits, security controls, or access controls</strong>, or share API keys outside the authorized tenant.
        </li>
      </ol>

      <h2 id="voice">3. Voice-specific rules</h2>
      <ul>
        <li>
          <strong>Two-party consent recording.</strong> Where your jurisdiction requires all-party consent to record a call (e.g., California, Florida, Illinois, Massachusetts, Pennsylvania, Washington, Maryland; many EU jurisdictions), you must obtain and document that consent &mdash; the agent&apos;s opening line must state recording. We provide a built-in disclosure template; turning it off is a violation of this AUP.
        </li>
        <li>
          <strong>Identification.</strong> The agent must identify itself as an AI when asked, on first interaction with a new user, and any time the user could plausibly believe they&apos;re talking to a human. This is also required by the EU AI Act Art. 50 transparency obligations and California SB 1001 in commercial / political contexts.
        </li>
        <li>
          <strong>STIR/SHAKEN.</strong> US calls must originate from numbers that are properly attested under STIR/SHAKEN. TYA&apos;s telephony partner (Twilio) handles attestation; do not use the Services with spoofed caller-ID.
        </li>
        <li>
          <strong>Do Not Call.</strong> Suppress against the US Federal Do Not Call Registry and any state DNC list applicable to the recipient before placing outbound calls. The dashboard offers DNC suppression as a setting; using the Services for outbound without it enabled is a violation.
        </li>
        <li>
          <strong>Calling windows.</strong> Outbound calls must respect 8&nbsp;a.m.&ndash;9&nbsp;p.m. local time of the called party (TCPA), plus any stricter state law (e.g., Florida 8&nbsp;a.m.&ndash;8&nbsp;p.m. Sundays).
        </li>
      </ul>

      <h2 id="messaging">4. Messaging-specific rules</h2>
      <ul>
        <li>
          <strong>SMS prior express written consent</strong> for marketing messages (TCPA / FCC TCR rules). Carrier-level filtering is unforgiving; ignoring TCR registration leads to immediate suspension.
        </li>
        <li>
          <strong>Honor STOP/HELP keywords</strong> end-to-end within 5 minutes (preferably immediately). HELP responses must include the program name, frequency, &ldquo;Msg &amp; Data Rates May Apply,&rdquo; and contact info.
        </li>
        <li>
          <strong>Email</strong> must include a working unsubscribe link, a valid postal address, accurate sender identification, and a non-misleading subject line (CAN-SPAM § 5).
        </li>
        <li>
          <strong>Web-form scraping or LinkedIn-style automation</strong> is prohibited unless the source platform&apos;s terms or a written API license permit it.
        </li>
      </ul>

      <h2 id="weights">5. Model weights, prompts, benchmarks</h2>
      <ul>
        <li>
          <strong>Do not attempt to extract</strong> TYA&apos;s model weights, system prompts, internal evaluation harnesses, or other Confidential Information of TYA, including by prompt injection or model inversion.
        </li>
        <li>
          <strong>Do not publish benchmark numbers</strong> comparing the Services to other vendors without TYA&apos;s prior written consent. We&apos;re happy to support legitimate comparative research with the right methodology; <a href="mailto:research@trainyouragent.com">research@trainyouragent.com</a>.
        </li>
        <li>
          <strong>Custom-build weights you own</strong> (per <a href="/legal/terms">Terms § 6.1</a>) may be exported under your SOW and used per its terms.
        </li>
      </ul>

      <h2 id="enforcement">6. Enforcement</h2>
      <p>We enforce in tiers, with the right to skip steps for egregious violations:</p>
      <ol>
        <li><strong>Warning.</strong> Email to the account owner describing the violation and required remediation.</li>
        <li><strong>Suspension.</strong> Account or feature suspension on 48 hours&apos; notice; immediate for ongoing harm.</li>
        <li><strong>Termination.</strong> Termination per the <a href="/legal/terms">Terms § 12</a>, with deletion of Customer Data per the <a href="/legal/dpa">DPA</a>.</li>
        <li><strong>Civil action and referral.</strong> For violations causing material harm to TYA, third parties, or the public &mdash; including any TCPA-class-action exposure created for TYA by Customer&apos;s misuse &mdash; we reserve all legal and equitable remedies and may refer matters to law enforcement.</li>
      </ol>
      <p>
        We will tell you what rule we believe was violated, with the evidence we can share without compromising the investigation or any third party&apos;s privacy. You may dispute by replying within 7 days; we will review in good faith.
      </p>

      <h2 id="report">7. Reporting abuse</h2>
      <p>
        See something? Email <a href="mailto:abuse@trainyouragent.com">abuse@trainyouragent.com</a> with as much detail as you can share. For urgent issues (active harm in progress), use the subject line prefix &ldquo;URGENT ABUSE:&rdquo; and we will triage within 4 business hours.
      </p>
    </LegalLayout>
  );
}
