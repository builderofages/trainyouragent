import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#E6F1FB" />
        <g fill="#0C447C">
          <circle cx="20" cy="27" r="7.5" />
          <circle cx="32" cy="21" r="8.5" />
          <circle cx="44" cy="27" r="7.5" />
          <circle cx="24" cy="40" r="7" />
          <circle cx="40" cy="40" r="7" />
          <rect x="29" y="44" width="6" height="11" rx="1.5" />
        </g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const Privacy = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/solutions" className="hover:text-[#042C53]">Solutions</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E]">Book a call</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-16 prose-content">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Legal</div>
        <h1 className="text-[42px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold text-[#042C53] mb-3">Privacy Policy</h1>
        <div className="text-[14px] text-slate-500 mb-10">Last updated: May 13, 2026</div>

        <div className="space-y-10 text-[16px] leading-[1.75] text-slate-700">
          <p>
            TrainYourAgent, Inc. ("TrainYourAgent," "we," "us") builds and operates AI voice and messaging agents for businesses. This policy explains what personal data we collect, how we use it, and the choices you have. We wrote it in plain English. If anything is unclear, email <a className="text-[#185FA5] underline" href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.
          </p>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">1. Who this applies to</h2>
            <p>
              This policy covers visitors to trainyouragent.com, prospects who contact us, customers of our platform, and end users whose calls or messages are handled by a TrainYourAgent agent that one of our customers deploys.
            </p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">2. What we collect</h2>
            <p className="mb-3"><strong className="text-[#042C53]">From website visitors:</strong> IP address, browser type, pages viewed, referring URL, and (if you submit a form) name, email, company, and phone.</p>
            <p className="mb-3"><strong className="text-[#042C53]">From customers:</strong> account email, billing details (processed by Stripe — we never see your full card number), agent configurations, business phone numbers, and integration credentials you authorize.</p>
            <p><strong className="text-[#042C53]">From end users (people calling a customer's agent):</strong> phone number, call audio, transcript, and any data the caller provides during the conversation (e.g., name, appointment time, address). This data is collected on behalf of our customer, who is the controller. We act as a processor.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">3. How we use it</h2>
            <p>We use personal data to operate the service, route calls, generate transcripts, sync with the integrations you authorize, bill correctly, prevent abuse, comply with the law, and improve product reliability. We do not sell personal data. We do not use customer or end-user data to train AI models — ours or anyone else's.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">4. Who we share it with</h2>
            <p className="mb-3">We share data only with subprocessors that need it to deliver the service. Our current subprocessors include:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>AWS</strong> — hosting and storage (us-east-1)</li>
              <li><strong>Twilio</strong> — voice routing and SMS</li>
              <li><strong>Anthropic</strong> — language model inference (zero-retention endpoint)</li>
              <li><strong>OpenAI</strong> — fallback inference (zero-retention endpoint)</li>
              <li><strong>ElevenLabs / Cartesia / Deepgram</strong> — speech synthesis and transcription</li>
              <li><strong>Stripe</strong> — billing</li>
              <li><strong>Vanta / Drata</strong> — compliance monitoring</li>
              <li><strong>Vercel</strong> — marketing site hosting</li>
            </ul>
            <p className="mt-3">Each subprocessor signs a DPA with us and is reviewed annually. The full current list is at <a className="text-[#185FA5] underline" href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> on request.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">5. Retention</h2>
            <p>Audio: 30 days by default, then deleted. Transcripts: 90 days by default, configurable. Account records and billing: retained while you have an active account plus the period required by law (typically 7 years for tax records). On termination, we export your data to you and delete our copy within 30 days.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">6. Your rights</h2>
            <p>If you're in the EU, UK, California, or another jurisdiction with a comprehensive privacy law, you have the right to access, correct, delete, and port your personal data, and to object to certain processing. To exercise any of these rights, email <a className="text-[#185FA5] underline" href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>. We respond within 30 days. For data we hold as a processor on behalf of a customer, we'll forward your request to the customer (the controller).</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">7. Cookies</h2>
            <p>We use a small set of essential cookies for site functionality and analytics (privacy-friendly: Plausible or equivalent — no Google Analytics). Details on the <Link to="/cookie-policy" className="text-[#185FA5] underline">Cookie Policy</Link> page.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">8. Security</h2>
            <p>See our <Link to="/security" className="text-[#185FA5] underline">Security page</Link> for the full posture: encryption, access controls, hosting region, incident response, and ongoing compliance work. No system is perfectly secure; if we discover a breach affecting you, we'll notify within 24 hours of confirmation.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">9. International transfers</h2>
            <p>Customer data is stored in AWS us-east-1 by default. If you're an EU customer, we use Standard Contractual Clauses and offer an EU hosting region on request.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">10. Children</h2>
            <p>Our service is not directed at anyone under 18. We don't knowingly collect data from minors. If you believe a minor has provided us data, email <a className="text-[#185FA5] underline" href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a> and we'll delete it.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">11. Changes</h2>
            <p>We'll post the new version here and update the "Last updated" date. Material changes get an email to active customers at least 14 days before they take effect.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">12. Contact</h2>
            <p>TrainYourAgent, Inc.<br />Tampa Bay, Florida, USA<br /><a className="text-[#185FA5] underline" href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a></p>
          </div>
        </div>
      </article>

      <footer className="border-t border-slate-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
