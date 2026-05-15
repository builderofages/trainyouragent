import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const PILLARS = [
  {
    label: "Encryption",
    body: "TLS 1.2+ in transit, AES-256 at rest. Every audio recording, transcript, and customer record is encrypted on the storage layer before it touches disk. Keys are managed by AWS KMS and rotated automatically.",
  },
  {
    label: "Access control",
    body: "Single sign-on with SAML / OIDC for every customer over $2k/mo. Role-based permissions inside the dashboard. Every engineer with production access uses hardware security keys (no SMS 2FA, no app codes).",
  },
  {
    label: "Hosting",
    body: "Primary infrastructure on AWS us-east-1 with multi-AZ failover. Voice routing rides Twilio's PCI-DSS Level 1 and HIPAA-eligible network. No data leaves North America unless you explicitly enable a non-US region.",
  },
  {
    label: "Data residency",
    body: "Customer audio is retained 30 days by default for QA, then deleted. Transcripts are retained per your settings (default 90 days, configurable to 0). You can purge any customer's record on demand within 24 hours.",
  },
  {
    label: "Vendor chain",
    body: "Every subprocessor that touches customer data is listed publicly and reviewed annually. We sign DPAs with all of them and we publish our list — no surprise third parties.",
  },
  {
    label: "Incident response",
    body: "24/7 on-call rotation with PagerDuty. We commit to notifying affected customers within 24 hours of confirmed breach, with a written postmortem within 7 days.",
  },
];

const COMPLIANCE = [
  {
    title: "SOC 2 Type II",
    status: "In evaluation",
    body: "We're working with a Big 4 auditor and Vanta to complete SOC 2 Type II in 2026. SOC 2 means an independent CPA firm audits how we handle customer data against five trust criteria: security, availability, processing integrity, confidentiality, and privacy. The report tells your security team — in their language — exactly how we protect data.",
  },
  {
    title: "HIPAA (for healthcare customers)",
    status: "BAA available",
    body: "We sign a Business Associate Agreement with healthcare customers before any PHI flows. We are not a Covered Entity ourselves. Our voice stack runs on Twilio's HIPAA-eligible network with BAAs from every subprocessor in the chain. Recordings of PHI conversations are encrypted, access-logged, and retained per your written policy.",
  },
  {
    title: "GDPR / CCPA",
    status: "Compliant",
    body: "We honor data subject access requests within 30 days. We don't sell personal data, ever. Our DPA includes Standard Contractual Clauses for any EU customer data, even though we default to US-only hosting.",
  },
  {
    title: "PCI-DSS",
    status: "Out of scope (by design)",
    body: "Our agents do not collect, store, or transmit credit card numbers. If a caller offers card details on a call, the agent is trained to redirect them to a secure payment link instead. This keeps you out of PCI scope and us out of card data entirely.",
  },
];

const FAQ = [
  {
    q: "Can I use this in a regulated environment before SOC 2 is done?",
    a: "Yes. SOC 2 is an audit of practices we already follow. Our security controls — encryption, access management, vendor review, incident response — are already in place. SOC 2 just gives your security team a third-party document that says so. Most of our customers in healthcare, legal, and finance go live under our DPA + BAA before our SOC 2 report is finalized.",
  },
  {
    q: "Where exactly does my call audio live?",
    a: "Audio is captured by Twilio (or your existing telephony if we're white-labeling), streamed to our voice pipeline, transcribed, and stored encrypted in AWS S3 (us-east-1). Default retention is 30 days for audio, 90 days for transcripts. You can override either to 0 retention. We never train any model on your data.",
  },
  {
    q: "Do you train AI models on my data?",
    a: "No. Your call audio, transcripts, and customer records are never used to train any model — ours or our LLM providers'. We use the zero-retention API endpoints from Anthropic and OpenAI for every inference call.",
  },
  {
    q: "What if a model provider has an outage?",
    a: "Every agent has a fallback model. If Claude is down, we route to GPT-4. If both are down, the agent falls back to a deterministic script that handles the most common 80% of calls and texts a human. You never drop a call to a busy signal.",
  },
  {
    q: "Can I get an audit log of every action my agent took?",
    a: "Yes. Every call, transcript, booking, CRM write, and SMS is logged with timestamp, agent version, model used, and outcome. Logs are accessible in your dashboard and exportable as CSV or via API.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "On cancellation, we export everything to you (audio, transcripts, configurations) and delete our copy within 30 days. You'll get written confirmation when deletion completes.",
  },
];

const Security = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* NAV — canonical service nav */}
      <SiteNav />

      <section className="pt-28 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Security & Compliance</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Built for security reviews <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>that actually happen.</span>
          </h1>
          <p className="mt-5 text-[18px] text-slate-600 max-w-3xl leading-relaxed">
            Our customers ship in regulated verticals — healthcare clinics, law firms, financial advisors, multi-site operators. So our security posture has to survive an InfoSec questionnaire, not just look good on a marketing page. This page is the questionnaire.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-[13px]">
            <span className="px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-medium">SOC 2 Type II — in evaluation</span>
            <span className="px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-medium">HIPAA BAA available</span>
            <span className="px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-medium">GDPR & CCPA</span>
            <span className="px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-medium">AES-256 / TLS 1.2+</span>
            <span className="px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] font-medium">Zero data training</span>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 bg-[#F6FAFE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">How we protect data</div>
          <h2 className="text-[28px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">Six pillars, no marketing fluff.</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PILLARS.map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="text-[13px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2">{p.label}</div>
                <div className="text-[15px] text-slate-700 leading-relaxed">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Compliance, in plain English</div>
          <h2 className="text-[28px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            What each acronym actually means for you.
          </h2>
          <div className="space-y-4">
            {COMPLIANCE.map((c, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-7">
                <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                  <h3 className="text-[20px] font-semibold text-[#042C53]">{c.title}</h3>
                  <span className="text-[12px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold px-3 py-1 rounded-full bg-[#E6F1FB]">{c.status}</span>
                </div>
                <div className="text-[15px] text-slate-700 leading-relaxed">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Questions security teams actually ask</div>
          <h2 className="text-[28px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-white border border-slate-200 rounded-xl p-5 group">
                <summary className="cursor-pointer text-[16px] font-medium text-[#042C53] flex items-start justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="text-[#185FA5] flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3 text-[15px] text-slate-700 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-[#042C53] rounded-2xl p-10 text-white">
          <h2 className="text-[26px] sm:text-[32px] leading-tight font-semibold mb-3">Need our security package for your review?</h2>
          <p className="text-[16px] text-white/85 mb-6 leading-relaxed max-w-2xl">
            Email <a href="mailto:security@trainyouragent.com" className="underline">security@trainyouragent.com</a> and we'll send our latest pen test summary, subprocessor list, DPA, BAA template, and the SOC 2 evidence binder we're building toward. Usually back to you within 1 business day.
          </p>
          <a href="mailto:security@trainyouragent.com" className="inline-block px-5 py-3 rounded-full bg-white text-[#042C53] text-[14px] font-medium hover:bg-slate-100 transition">
            Request security package &rarr;
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">Book a call</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Security;
