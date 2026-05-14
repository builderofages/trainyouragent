import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#E6F1FB" />
        <g fill="#0C447C">
          <circle cx="20" cy="27" r="7.5" /><circle cx="32" cy="21" r="8.5" /><circle cx="44" cy="27" r="7.5" />
          <circle cx="24" cy="40" r="7" /><circle cx="40" cy="40" r="7" /><rect x="29" y="44" width="6" height="11" rx="1.5" />
        </g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const DemoRequest = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", use: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Request a Live Demo — TrainYourAgent";
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}%0D%0ACompany: ${form.company}%0D%0AEmail: ${form.email}%0D%0APhone: ${form.phone}%0D%0AUse case:%0D%0A${form.use}`;
    window.location.href = `mailto:hello@trainyouragent.com?subject=Live%20demo%20request%20from%20${encodeURIComponent(form.name)}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Or book Cal.com →</a>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Live demo</div>
          <h1 className="text-[42px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Want to <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>hear it before you buy it?</span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-700 leading-relaxed">
            We'll build a 5-minute demo agent for your exact use case and call it in front of you on a Zoom. Same agent, your tone, your scripts, your test calls. Usually within 48 hours of your request.
          </p>

          {!sent ? (
            <form onSubmit={submit} className="mt-10 rounded-3xl bg-[#F6FAFE] border border-slate-200 p-7 sm:p-10 grid gap-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="Work email" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
              <textarea value={form.use} onChange={(e) => setForm({ ...form, use: e.target.value })} required rows={5} placeholder="What use case should we demo? (e.g., 'After-hours HVAC dispatch booking calls with ServiceTitan.')" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5] resize-none" />
              <button type="submit" className="mt-2 px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow">Request the demo →</button>
              <div className="text-[11px] text-slate-500 leading-relaxed mt-1">By submitting you agree to our <Link to="/privacy" className="underline">privacy policy</Link>.</div>
            </form>
          ) : (
            <div className="mt-10 rounded-3xl bg-[#F6FAFE] border border-slate-200 p-10 text-center">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Submitted</div>
              <h2 className="text-[26px] sm:text-[34px] font-semibold text-[#042C53] leading-tight mb-3">We'll be back within one business day.</h2>
              <p className="text-[14px] text-slate-700 max-w-md mx-auto leading-relaxed">Want to skip the wait? Book a Cal.com 30-min build call right now and we'll do it live.</p>
              <a href={CAL_URL} target="_blank" rel="noopener" className="mt-5 inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow">Book a build call</a>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3 text-[14px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#22A36C] animate-pulse" />
            <span>Or just call us right now and hear it live:</span>
            <a href={`tel:${HERO_PHONE_TEL}`} className="text-[#042C53] font-semibold hover:underline">{HERO_PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoRequest;
