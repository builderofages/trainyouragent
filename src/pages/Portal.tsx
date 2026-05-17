// src/pages/Portal.tsx
// v50A: Customer portal scaffold — post-purchase dashboard.
// /portal?token=... gates the demo data. /portal alone shows magic-link signin.
// All numbers are clearly labeled demo data — honest until real billing wires up.

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

type AgentStatus = "Discovery" | "Build" | "Live";
const STATUS_PILL: Record<AgentStatus, string> = {
  Discovery: "bg-amber-100 text-amber-800 border-amber-200",
  Build:     "bg-blue-100 text-blue-800 border-blue-200",
  Live:      "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const DEMO_BUILDS: { name: string; status: AgentStatus; updatedAt: string }[] = [
  { name: "Inbound voice agent — sales line",      status: "Live",      updatedAt: "2 hours ago" },
  { name: "Web chat — discovery + booking",        status: "Build",     updatedAt: "yesterday" },
  { name: "Outbound follow-up — abandoned demos",  status: "Discovery", updatedAt: "3 days ago" },
];

const DEMO_ACTIVITY: { when: string; channel: "voice" | "chat"; action: string; preview: string }[] = [
  { when: "8 min ago",  channel: "voice", action: "booked",     preview: "30-min discovery with R. Patel · Tue 2pm CT" },
  { when: "23 min ago", channel: "chat",  action: "qualified",  preview: "Service Co · 14 trucks · HVAC · ready in 30d" },
  { when: "1 hr ago",   channel: "voice", action: "triaged",    preview: "Existing customer — routed to billing" },
  { when: "2 hr ago",   channel: "chat",  action: "booked",     preview: "Walk-through with M. Chen · Wed 11am ET" },
  { when: "4 hr ago",   channel: "voice", action: "qualified",  preview: "Roofing · 6 crews · storm-restoration lead" },
  { when: "yesterday",  channel: "chat",  action: "triaged",    preview: "Spam — flagged, no human touched" },
];

const DEMO_INVOICES: { id: string; date: string; amount: string; status: "Paid" | "Open" | "Past Due" }[] = [
  { id: "INV-2026-0142", date: "May 1, 2026",  amount: "$5,000.00", status: "Paid" },
  { id: "INV-2026-0129", date: "Apr 1, 2026",  amount: "$5,000.00", status: "Paid" },
  { id: "INV-2026-0116", date: "Mar 1, 2026",  amount: "$5,000.00", status: "Paid" },
  { id: "INV-2026-0103", date: "Feb 1, 2026",  amount: "$5,000.00", status: "Paid" },
];

const INVOICE_PILL: Record<string, string> = {
  Paid:       "bg-emerald-100 text-emerald-800 border-emerald-200",
  Open:       "bg-blue-100 text-blue-800 border-blue-200",
  "Past Due": "bg-rose-100 text-rose-800 border-rose-200",
};

export default function Portal() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const customerName = params.get("name") || "Operator";
  const [navScrolled, setNavScrolled] = useState(false);
  const [signinEmail, setSigninEmail] = useState("");
  const [signinState, setSigninState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [prefsEmail, setPrefsEmail] = useState("");
  const [prefsState, setPrefsState] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const [prefsFreq, setPrefsFreq] = useState("weekly");
  const [prefsBilling, setPrefsBilling] = useState(true);
  const [prefsSecurity, setPrefsSecurity] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = token ? `Portal — ${customerName} · TrainYourAgent` : "Customer portal — TrainYourAgent";
    // v51c: portal is private — noindex
    let robots = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (!robots) { robots = document.createElement("meta"); robots.setAttribute("name", "robots"); document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, nofollow, noarchive");
    return () => {
      const r = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
      if (r) r.setAttribute("content", "index, follow, max-image-preview:large, max-snippet:-1");
    };
  }, [token, customerName]);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!signinEmail) return;
    setSigninState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: signinEmail, source: "portal-magic-link", path: "/portal" }),
      });
      setSigninState(r.ok ? "sent" : "error");
    } catch { setSigninState("error"); }
  }

  async function savePrefs(e: React.FormEvent) {
    e.preventDefault();
    if (!prefsEmail) return;
    setPrefsState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: prefsEmail,
          source: "portal-preferences",
          path: "/portal",
          payload: { frequency: prefsFreq, billingContact: prefsBilling, securityContact: prefsSecurity },
        }),
      });
      setPrefsState(r.ok ? "saved" : "error");
    } catch { setPrefsState("error"); }
  }

  const nav = useMemo(() => (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
        <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
      </div>
    </nav>
  ), [navScrolled]);

  if (!token) {
    return (
      <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        {nav}
        <section className="pt-32 pb-20 px-5 sm:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Customer portal</div>
            <h1 className="text-[36px] leading-[1.05] tracking-tight font-semibold text-[#042C53]">
              Sign in to your <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>portal.</span>
            </h1>
            <p className="mt-4 text-[15px] text-slate-600">We'll email you a one-time sign-in link. No password to remember.</p>
            <form onSubmit={sendMagicLink} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold">Work email</span>
                <input type="email" required value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} placeholder="you@company.com" className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#185FA5] focus:outline-none text-[15px]" />
              </label>
              <button type="submit" disabled={signinState === "sending"} className="w-full px-5 py-3 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0A3D6E] disabled:opacity-60">
                {signinState === "sending" ? "Sending..." : signinState === "sent" ? "Link sent — check your inbox" : "Send magic link"}
              </button>
              {signinState === "error" && <div className="text-[13px] text-rose-600">Something went wrong — try again or email support@trainyouragent.com.</div>}
            </form>
            <div className="mt-8 text-[13px] text-slate-600">
              Don't have an account yet? <Link to="/pricing" className="text-[#185FA5] underline">See pricing</Link> or <a href={CAL_URL} target="_blank" rel="noopener" className="text-[#185FA5] underline">book a call</a>.
            </div>
            <div className="mt-10 p-4 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-900">
              <strong>Preview the portal:</strong>{" "}
              <Link to="/portal?token=demo&name=Demo+Co" className="underline">/portal?token=demo</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {nav}

      <section className="pt-32 pb-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Customer portal</div>
          <h1 className="text-[40px] sm:text-[52px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Welcome back, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>{customerName}.</span>
          </h1>
          <p className="mt-4 text-[15px] text-slate-600 max-w-2xl">
            Your agents, your activity, your invoices — all in one place. (Demo data — your real portal will look like this.)
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-semibold text-[#042C53] mb-4">Active builds</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {DEMO_BUILDS.map((b, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#185FA5] transition">
                <div className="text-[15px] font-semibold text-[#042C53] mb-3 leading-snug">{b.name}</div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className={`px-2.5 py-0.5 rounded-full border font-semibold ${STATUS_PILL[b.status]}`}>{b.status}</span>
                  <span className="text-slate-600">{b.updatedAt}</span>
                </div>
                <a href="#" className="mt-4 inline-block text-[13px] text-[#185FA5] hover:underline">View progress &rarr;</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-semibold text-[#042C53] mb-4">Recent agent activity</h2>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">When</th>
                  <th className="text-left px-4 py-3 font-medium">Channel</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                  <th className="text-left px-4 py-3 font-medium">Preview</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ACTIVITY.map((a, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-[#E6F1FB]/40">
                    <td className="px-4 py-3 text-slate-600">{a.when}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ${a.channel === "voice" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>{a.channel}</span>
                    </td>
                    <td className="px-4 py-3 text-[#042C53] font-medium">{a.action}</td>
                    <td className="px-4 py-3 text-slate-700">{a.preview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-semibold text-[#042C53] mb-4">Invoices</h2>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Invoice</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {DEMO_INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-t border-slate-100 hover:bg-[#E6F1FB]/40">
                    <td className="px-4 py-3 font-mono text-[#042C53]">{inv.id}</td>
                    <td className="px-4 py-3 text-slate-700">{inv.date}</td>
                    <td className="px-4 py-3 font-semibold">{inv.amount}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${INVOICE_PILL[inv.status]}`}>{inv.status}</span></td>
                    <td className="px-4 py-3"><a href="#" className="text-[#185FA5] hover:underline">Download PDF &rarr;</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 p-6 bg-[#E6F1FB]/30">
            <h2 className="text-[18px] font-semibold text-[#042C53] mb-4">Your team</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#042C53] text-white flex items-center justify-center font-semibold">AM</div>
              <div>
                <div className="font-semibold text-[#042C53]">Alexander Mills</div>
                <div className="text-[13px] text-slate-600">Founder &amp; principal engineer</div>
              </div>
            </div>
            <div className="text-[13px] text-slate-700 space-y-1">
              <div>Email: <a href="mailto:alexander@trainyouragent.com" className="text-[#185FA5] hover:underline">alexander@trainyouragent.com</a></div>
              <div>Slack: <a href="#" className="text-[#185FA5] hover:underline">#{customerName.toLowerCase().replace(/\s+/g, "-")}-tya</a></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-[18px] font-semibold text-[#042C53] mb-4">Need help?</h2>
            <p className="text-[14px] text-slate-700 mb-4">
              Support is humans, not a chatbot wall. Most replies in under an hour during business hours.
            </p>
            <div className="space-y-2 text-[13px]">
              <div><a href="mailto:support@trainyouragent.com" className="text-[#185FA5] hover:underline">support@trainyouragent.com</a></div>
              <div><a href={CAL_URL} target="_blank" rel="noopener" className="text-[#185FA5] hover:underline">Book an emergency call (15-min)</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-semibold text-[#042C53] mb-4">Update preferences</h2>
          <form onSubmit={savePrefs} className="rounded-2xl border border-slate-200 p-6 grid md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold">Email on file</span>
              <input type="email" required value={prefsEmail} onChange={(e) => setPrefsEmail(e.target.value)} placeholder="you@company.com" className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#185FA5] focus:outline-none text-[14px]" />
            </label>
            <label className="block">
              <span className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold">Email digest frequency</span>
              <select value={prefsFreq} onChange={(e) => setPrefsFreq(e.target.value)} className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#185FA5] focus:outline-none text-[14px] bg-white">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="off">Off — only critical alerts</option>
              </select>
            </label>
            <label className="flex items-start gap-3 text-[14px] text-slate-700">
              <input type="checkbox" checked={prefsBilling} onChange={(e) => setPrefsBilling(e.target.checked)} className="mt-1" />
              <span>Receive billing notices at this email (invoices, payment failures, plan changes)</span>
            </label>
            <label className="flex items-start gap-3 text-[14px] text-slate-700">
              <input type="checkbox" checked={prefsSecurity} onChange={(e) => setPrefsSecurity(e.target.checked)} className="mt-1" />
              <span>Receive security alerts at this email (new sign-ins, key rotations, integration changes)</span>
            </label>
            <div className="md:col-span-2 flex items-center justify-between">
              <span className="text-[12px] text-slate-600">We never sell your email. <Link to="/privacy" className="underline">Privacy policy</Link>.</span>
              <button type="submit" disabled={prefsState === "sending"} className="px-5 py-2.5 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0A3D6E] disabled:opacity-60">
                {prefsState === "sending" ? "Saving..." : prefsState === "saved" ? "Saved" : "Save preferences"}
              </button>
            </div>
            {prefsState === "error" && <div className="md:col-span-2 text-[13px] text-rose-600">Something went wrong — try again.</div>}
          </form>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
            <Link to="/roadmap" className="hover:text-[#042C53]">Roadmap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
