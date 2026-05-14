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

const SECTIONS: Array<{ h: string; b: string }> = [
  { h: "1. Acceptance", b: "By using TrainYourAgent's website, dashboard, agents, or any related service, you agree to these Terms of Service ('Terms'). If you don't agree, don't use the service. If you're using the service for an organization, you represent that you have authority to bind that organization to these Terms." },
  { h: "2. The service", b: "TrainYourAgent builds, configures, and operates AI voice and messaging agents on behalf of customers. The agent answers your business's calls and messages, follows the scripts and integrations you configure, and routes outcomes to the CRM and calendaring tools you connect. Specific capabilities, limits, and SLAs are described in your order form or written agreement." },
  { h: "3. Your account", b: "You're responsible for keeping login credentials secure, configuring your agent accurately, and ensuring the people on your team who use the dashboard are authorized. You're responsible for the legality of the calls and messages your agent makes — e.g., compliance with TCPA, state recording-consent laws, and applicable do-not-call lists." },
  { h: "4. Acceptable use", b: "You will not use the service to: (a) impersonate a person without disclosure where required by law, (b) make calls to numbers on a do-not-call list, (c) generate or transmit unlawful, defamatory, or harassing content, (d) infringe intellectual property, (e) attempt to reverse-engineer the service, or (f) resell or sublicense the service without our written consent." },
  { h: "5. Fees and payment", b: "Pricing is set in your order form. Subscriptions auto-renew until cancelled. Usage overages are billed monthly. All fees are non-refundable except as required by law or as stated in your order form. We may change pricing for new terms with 30 days' notice; current customers' pricing is locked for the duration of any prepaid term." },
  { h: "6. Customer data and intellectual property", b: "You own your data, your agent's configurations, your scripts, and your customer records. We own our platform, infrastructure, and the underlying models we license. You grant us a limited license to process your data solely to deliver the service. We do not train AI models on your data." },
  { h: "7. Confidentiality", b: "Each party agrees to protect the other's non-public business information with the same care it gives its own confidential information, and to use it only as necessary to perform under these Terms. This obligation survives termination." },
  { h: "8. Warranties and disclaimer", b: "We warrant that we'll provide the service with commercially reasonable care and skill. EXCEPT AS EXPRESSLY STATED, THE SERVICE IS PROVIDED 'AS IS' AND WE DISCLAIM ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. AI agents can make mistakes; you remain responsible for any decision a human would otherwise make." },
  { h: "9. Limitation of liability", b: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY IS LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES, OR FOR LOST PROFITS OR LOST REVENUE. EACH PARTY'S TOTAL LIABILITY UNDER THESE TERMS IS CAPPED AT THE AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM. THIS CAP DOES NOT APPLY TO YOUR PAYMENT OBLIGATIONS OR EITHER PARTY'S INDEMNIFICATION OBLIGATIONS." },
  { h: "10. Indemnification", b: "You'll defend and indemnify us against third-party claims arising from your misuse of the service, violation of law, or breach of these Terms. We'll defend and indemnify you against third-party IP claims that the service itself infringes a US patent, copyright, or trade secret." },
  { h: "11. Termination", b: "Either party may terminate for convenience with 30 days' written notice (annual contracts continue through the prepaid term). Either party may terminate immediately for the other's material breach if not cured within 15 days of notice. On termination, we export your data and delete our copy within 30 days." },
  { h: "12. Subprocessors and security", b: "Our current subprocessors and security posture are described on our Security and Privacy pages. We'll notify customers of material subprocessor changes at least 30 days in advance for in-scope environments." },
  { h: "13. Changes to the Terms", b: "We may update these Terms; if a change is material, we'll email active customers at least 14 days before it takes effect. Continued use after the effective date constitutes acceptance." },
  { h: "14. Governing law", b: "These Terms are governed by the laws of the State of Florida, USA, without regard to conflict of laws. Disputes are resolved in the state or federal courts located in Hillsborough County, Florida, and the parties consent to that exclusive jurisdiction." },
  { h: "15. Contact", b: "Questions or notices: legal@trainyouragent.com. TrainYourAgent, Inc., Tampa Bay, Florida, USA." },
];

const Terms = () => {
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

      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Legal</div>
        <h1 className="text-[42px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold text-[#042C53] mb-3">Terms of Service</h1>
        <div className="text-[14px] text-slate-500 mb-10">Last updated: May 13, 2026</div>

        <div className="space-y-8 text-[16px] leading-[1.75] text-slate-700">
          <p className="italic text-slate-600">These Terms exist so you and we both know what we're signing up for. Plain language where the law lets us; precise legal language where it doesn't.</p>
          {SECTIONS.map((s, i) => (
            <div key={i}>
              <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">{s.h}</h2>
              <p>{s.b}</p>
            </div>
          ))}
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

export default Terms;
