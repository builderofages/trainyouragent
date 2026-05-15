import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

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

const CHANNELS = [
  {
    label: "Book a 30-minute build call",
    sub: "Fastest path. We scope your use case, show a live build, and you leave with a written plan.",
    cta: "Open Cal.com",
    href: CAL_URL,
    accent: true,
  },
  {
    label: "Email the founder",
    sub: "Reach Alexander directly. Replies within one business day, usually same day.",
    cta: "hello@trainyouragent.com",
    href: "mailto:hello@trainyouragent.com",
  },
  {
    label: "LinkedIn DM",
    sub: "Message Alexander on LinkedIn — DM the word AGENT for a live build walkthrough.",
    cta: "Open LinkedIn",
    href: LINKEDIN_URL,
  },
  {
    label: "Enterprise / partnerships",
    sub: "Procurement, security review, BAA, MSA, or co-selling — route here for the right thread.",
    cta: "partners@trainyouragent.com",
    href: "mailto:partners@trainyouragent.com",
  },
];

const Contact = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sent, setSent] = useState(false);

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No backend wired yet — direct user to email so nothing is lost.
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const company = String(data.get("company") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const use = String(data.get("use") || "");
    const body = `Name: ${name}%0D%0ACompany: ${company}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AUse case:%0D%0A${use}`;
    window.location.href = `mailto:hello@trainyouragent.com?subject=Build%20request%20from%20${encodeURIComponent(name || "site")}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* NAV — canonical service nav */}
      <SiteNav />

      <section className="pt-28 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Contact</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Talk to the people who <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>build</span> it.
          </h1>
          <p className="mt-5 text-[18px] text-slate-600 max-w-2xl leading-relaxed">
            No SDRs. No qualifying form mazes. You get the founder and the engineer who's going to put the agent live for you.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          {CHANNELS.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener" : undefined}
              className={`group block rounded-2xl p-7 border transition ${c.accent ? "bg-[#042C53] text-white border-[#042C53] hover:bg-[#0A3D6E]" : "bg-white border-slate-200 hover:border-[#185FA5] hover:shadow-sm"}`}
            >
              <div className={`text-[13px] uppercase tracking-[0.12em] font-semibold mb-2 ${c.accent ? "text-[#9CC4EC]" : "text-[#185FA5]"}`}>{c.label}</div>
              <div className={`text-[16px] leading-relaxed mb-5 ${c.accent ? "text-white/90" : "text-slate-700"}`}>{c.sub}</div>
              <div className={`text-[14px] font-medium inline-flex items-center gap-2 ${c.accent ? "text-white" : "text-[#042C53]"}`}>
                {c.cta}
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-5xl mx-auto bg-[#F6FAFE] border border-slate-200 rounded-2xl p-7 sm:p-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Send a build request</div>
              <h2 className="text-[26px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-4">
                Tell us what you'd put on autopilot first.
              </h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-6">
                We read every one. If we can build it well, you'll get a Loom back showing the build before you book a call. If we can't, we'll tell you and point you somewhere honest.
              </p>
              <div className="text-[13px] text-slate-600 space-y-2">
                <div><span className="font-semibold text-[#042C53]">Headquarters.</span> Tampa Bay, Florida.</div>
                <div><span className="font-semibold text-[#042C53]">Hours.</span> Mon–Fri, 8am–7pm ET. After hours via email; we triage every morning.</div>
                <div><span className="font-semibold text-[#042C53]">Response.</span> Same business day for new builds. Within 1 hour for active customers in business hours.</div>
              </div>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input name="name" required placeholder="Your name" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <input name="company" placeholder="Company (optional)" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <input name="email" type="email" required placeholder="Work email" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <input name="phone" placeholder="Phone (optional)" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <textarea name="use" required rows={5} placeholder="What do you want the agent to do? E.g. 'Answer after-hours calls and book appointments into ServiceTitan.'" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5] resize-none" />
              <button type="submit" className="mt-2 px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] transition">
                {sent ? "Opening your email…" : "Send build request"}
              </button>
              <div className="text-[11px] text-slate-500 leading-relaxed mt-1">
                By submitting you agree to our <Link to="/privacy" className="underline">privacy policy</Link>. We don't share your details with anyone outside the team building your agent.
              </div>
            </form>
          </div>
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
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">Book a call</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
