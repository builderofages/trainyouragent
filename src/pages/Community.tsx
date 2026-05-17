// src/pages/Community.tsx
// v46a: HONEST early-community page. No fabricated operator counts, no
// fake events with invented host names. Replaces fake "1,200+ operators"
// claim with truthful early-days framing + a real waitlist signup.

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FONT = "'Inter Tight', system-ui, -apple-system, sans-serif";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

const CAL_URL = "https://cal.com/trainyouragent/30min";

// What members ACTUALLY get when invites open.
const WHAT_YOU_GET = [
  { h: "Weekly build logs from Alexander", b: "What shipped, what broke, what's next — straight from the founder, no sanitized marketing." },
  { h: "Office hours, twice a month", b: "Bring your AI build stuck point. We work through it on screen-share with anyone who wants to watch." },
  { h: "Prompt + agent script library", b: "Real prompts from production agents — scrubbed of client data — that you can copy into your own stack." },
  { h: "First look at new tools", b: "Members get early access to anything we release on /tools before it hits the public site." },
];

export default function Community() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState("");
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
    setErr(null); setState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email, name,
          source: "community-waitlist",
          path: "/community",
          payload: { role },
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
          Community · Early days
        </div>
        <h1 className="text-[36px] sm:text-[60px] font-semibold leading-[1.02] tracking-[-0.02em]" style={{ color: NAVY }}>
          We're early.{" "}
          <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
            Be one of the first.
          </span>
        </h1>
        <p className="mt-5 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
          No big-number boasts. We're standing up the community in public — invites
          go out a batch at a time as Discord and Slack get wired up. If you're
          an operator, founder, or builder shipping with AI, put your name down
          and we'll send the invite the day it's live.
        </p>
      </section>

      {/* Honest status block — replaces fake CTA tiles */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-12">
        <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: TINT, borderColor: "#BDDAF4", color: NAVY }}>
          <div className="text-[12px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>
            Honest status
          </div>
          <div className="text-[16px] sm:text-[17px] leading-relaxed text-slate-800 max-w-3xl">
            Discord and Slack invites haven't gone live yet — Alexander is building both spaces
            in the open and seeding them with the first 50 operators by hand. The waitlist below
            is the door. We'll never auto-quote a "1,200 member" number we haven't earned.
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E]"
            >
              Talk to Alexander now
            </a>
            <Link
              to="/metrics"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-[#042C53] text-[14px] font-semibold border border-slate-300 hover:border-[#185FA5]"
            >
              See our live numbers
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h2 className="text-[24px] sm:text-[28px] font-semibold mb-6" style={{ color: NAVY }}>What members get on day one</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WHAT_YOU_GET.map((w) => (
            <div key={w.h} className="rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div className="text-[16px] font-semibold mb-2" style={{ color: NAVY }}>{w.h}</div>
              <div className="text-[14px] text-slate-700 leading-relaxed">{w.b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-200">
        <h2 className="text-[24px] sm:text-[28px] font-semibold mb-2" style={{ color: NAVY }}>Get the invite</h2>
        <p className="text-[14px] text-slate-700 mb-6">
          One line about what you're building or running so we batch you with the right operators on day one.
        </p>
        {state === "done" ? (
          <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 text-[14px]">
            Got you. We'll email you the moment invites open.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3" aria-label="Community waitlist">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" aria-label="Your name"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[16px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" aria-label="Email"
                className="px-4 py-3 rounded-lg border border-slate-300 text-[16px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              />
            </div>
            <input
              type="text" value={role} onChange={(e) => setRole(e.target.value)} maxLength={140}
              placeholder="What are you building or running? (one line)"
              aria-label="Role / what you're building"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[16px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {err && <div role="alert" className="text-[13px] text-red-700">{err}</div>}
            {state === "error" && <div role="alert" className="text-[13px] text-red-700">Couldn't send — try again.</div>}
            <button
              type="submit" disabled={state === "sending"}
              className="px-6 py-3 rounded-xl bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              {state === "sending" ? "Submitting…" : "Put me on the list"}
            </button>
          </form>
        )}
        <div className="mt-10 text-[14px] text-slate-600">
          New here? <Link to="/start" className="text-[#185FA5] underline">Start at /start</Link> · or <Link to="/tools" className="text-[#185FA5] underline">try a free tool</Link>.
        </div>
      </section>

      <Footer />
    </div>
  );
}
