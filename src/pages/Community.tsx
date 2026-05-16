// src/pages/Community.tsx
// v41: /community — Discord/Slack join, events grid, recent wins, "submit a win" form.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FONT = "'Inter Tight', system-ui, -apple-system, sans-serif";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

const EVENTS = [
  { date: "2026-06-04", title: "Voice agents 101 — live workshop", host: "Alexander Mills", kind: "Workshop" },
  { date: "2026-06-18", title: "After-hours playbook clinic", host: "Sara Chen", kind: "Clinic" },
  { date: "2026-07-09", title: "Building your first AI receptionist", host: "Jordan Pak", kind: "Workshop" },
  { date: "2026-07-23", title: "Community office hours", host: "TYA Team", kind: "AMA" },
];

const WINS = [
  { who: "HVAC owner, Phoenix", quote: "After-hours bookings went from 2 to 19 per month. Agent paid for itself in week 2." },
  { who: "Real estate brokerage, Austin", quote: "Cut lead-response time from 14h to 90s. Closed two extra deals in March." },
  { who: "Med spa, Miami", quote: "Stopped losing weekend bookings. ~$11K extra MRR within 60 days." },
];

export default function Community() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [win, setWin]     = useState("");
  const [state, setState] = useState<"idle"|"sending"|"done"|"error">("idle");
  const [err, setErr]     = useState<string|null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Community — TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErr("Please enter a valid email."); return;
    }
    if (!win.trim() || win.trim().length < 10) {
      setErr("Tell us what happened — at least a sentence."); return;
    }
    setErr(null); setState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email, name,
          source: "community-win",
          path: "/community",
          payload: { win },
          website: "", hp: "",
        }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <Header />

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-4" style={{ color: BLUE }}>
          Community
        </div>
        <h1 className="text-[36px] sm:text-[60px] font-semibold leading-[1.02] tracking-[-0.02em]" style={{ color: NAVY }}>
          Join 1,200+ AI operators{" "}
          <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
            building in public.
          </span>
        </h1>
        <p className="mt-5 text-[17px] text-slate-600 max-w-2xl">
          Operators, agency owners, and SMB founders shipping real AI workflows. Show what's working,
          steal what works for others.
        </p>
      </section>

      {/* CTA strip */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-12">
        <a
          href="[TBD discord invite]"
          className="rounded-2xl p-5 sm:p-6 text-white"
          style={{ background: NAVY }}
          aria-label="Join Discord (link coming soon)"
        >
          <div className="text-[12px] uppercase tracking-[0.18em] font-semibold text-[#9BC3E8] mb-2">Discord</div>
          <div className="text-[20px] font-semibold mb-1">Join the Discord</div>
          <div className="text-[13px] text-white/80">Day-of-week threads, build logs, weekly office hours.</div>
          <div className="text-[12px] text-[#9BC3E8] mt-3">Invite coming next week →</div>
        </a>
        <a
          href="[TBD slack invite]"
          className="rounded-2xl p-5 sm:p-6"
          style={{ background: TINT, color: NAVY }}
          aria-label="Join Slack (link coming soon)"
        >
          <div className="text-[12px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-2">Slack</div>
          <div className="text-[20px] font-semibold mb-1">Or hop in the Slack</div>
          <div className="text-[13px] text-slate-700">For folks who already live in Slack all day.</div>
          <div className="text-[12px] text-[#185FA5] mt-3">Invite coming next week →</div>
        </a>
      </section>

      {/* Events grid */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h2 className="text-[24px] font-semibold mb-6" style={{ color: NAVY }}>Upcoming events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EVENTS.map((e) => (
            <div key={e.title} className="rounded-xl border border-slate-200 p-4 bg-white">
              <div className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">{e.kind}</div>
              <div className="text-[15px] font-semibold mb-2" style={{ color: NAVY }}>{e.title}</div>
              <div className="text-[12px] text-slate-600">{new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
              <div className="text-[12px] text-slate-500">Hosted by {e.host}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent wins */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 border-t border-slate-200">
        <h2 className="text-[24px] font-semibold mb-6" style={{ color: NAVY }}>Recent wins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {WINS.map((w, i) => (
            <blockquote key={i} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
              <div className="text-[15px] text-slate-800 leading-snug italic mb-3">"{w.quote}"</div>
              <div className="text-[12px] text-slate-500">{w.who}</div>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Submit a win */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-200">
        <h2 className="text-[24px] font-semibold mb-2" style={{ color: NAVY }}>Submit your win</h2>
        <p className="text-[14px] text-slate-600 mb-6">
          Shipped something with AI that moved a real number? Send it. We highlight the best ones in our weekly newsletter.
        </p>
        {state === "done" ? (
          <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 text-[14px]">
            Got it — thanks. We'll be in touch if it's a fit for the newsletter.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3" aria-label="Submit a community win">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" aria-label="Your name"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" aria-label="Email"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
            </div>
            <textarea
              value={win} onChange={(e) => setWin(e.target.value)} rows={5} maxLength={1200}
              placeholder="What did you ship, and what number moved?"
              aria-label="What you shipped"
              className="w-full p-4 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {err && <div role="alert" className="text-[12px] text-red-600">{err}</div>}
            {state === "error" && <div role="alert" className="text-[12px] text-red-600">Couldn't send — try again.</div>}
            <button
              type="submit" disabled={state === "sending"}
              className="px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              {state === "sending" ? "Submitting…" : "Submit my win"}
            </button>
          </form>
        )}
        <div className="mt-10 text-[13px] text-slate-500">
          New here? <Link to="/start" className="text-[#185FA5] underline">Start at /start</Link> · or <Link to="/tools" className="text-[#185FA5] underline">try a free tool</Link>.
        </div>
      </section>

      <Footer />
    </div>
  );
}
