// src/pages/Live.tsx
// v60 — public real-time event stream. Polls /api/recent-activity every 8s.
// HONESTY FIX: server returns only real events (no synthetic fillers). When
// the funnel is quiet this page renders an honest empty state with three
// CTAs the visitor can use to BE the first event.

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
// v63: honest empty-state CTAs that FIRE real events so the visitor sees
// their own action appear in the stream. The smarter version of Grok Heavy's
// "seed fake events" suggestion — no fakes, but the page never feels dead.
import { fireEvent } from "@/lib/event";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const SERIF_ITALIC = "'Playfair Display', Georgia, serif";

type ApiItem = {
  who?: string;
  what?: string;
  where?: string;
  action?: string;
  ago?: string;
};

type StreamItem = ApiItem & {
  id: string;
  receivedAt: number;
};

function hashKey(it: ApiItem): string {
  return `${it.who || ""}|${it.what || ""}|${it.where || ""}|${it.action || ""}|${it.ago || ""}`;
}

function loadFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("tya-fonts")) return;
  const l = document.createElement("link");
  l.id = "tya-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
  document.head.appendChild(l);
}

const MAX_VISIBLE = 50;
const POLL_MS = 8_000;

export default function Live() {
  const [items, setItems] = useState<StreamItem[]>([]);
  const [counter, setCounter] = useState(0);
  const [tickCount, setTickCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const seenRef = useRef<Set<string>>(new Set());
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    loadFonts();
    document.title = "Live — what's happening on trainyouragent.com right now";
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = "https://trainyouragent.com/live";
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "Live, anonymized event stream from trainyouragent.com — real events only, no simulated traffic. When this page is empty, the funnel is genuinely quiet.";
  }, []);

  // Poll loop.
  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const tick = async () => {
      if (cancelled) return;
      if (!paused) {
        try {
          const r = await fetch("/api/recent-activity", { headers: { accept: "application/json" } });
          if (r.ok) {
            const j = (await r.json()) as { ok?: boolean; items?: ApiItem[] };
            const incoming = Array.isArray(j.items) ? j.items : [];
            const fresh: StreamItem[] = [];
            for (const it of incoming) {
              const k = hashKey(it);
              if (seenRef.current.has(k)) continue;
              seenRef.current.add(k);
              fresh.push({ ...it, id: `${k}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, receivedAt: Date.now() });
            }
            if (fresh.length) {
              setItems((prev) => {
                const merged = [...fresh.reverse(), ...prev];
                return merged.slice(0, MAX_VISIBLE);
              });
              setCounter((c) => c + fresh.length);
            }
          }
        } catch { /* ignore network blips */ }
        setTickCount((n) => n + 1);
      }
      timer = window.setTimeout(tick, POLL_MS);
    };
    // Run once immediately, then poll.
    tick();
    return () => {
      cancelled = true;
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [paused]);

  const visitorsLabel = useMemo(() => {
    // We don't have a real "visitors today" number from the API. We display
    // the cumulative count of distinct events seen during this session so the
    // viewer can watch it tick up live without us fabricating a daily total.
    return counter;
  }, [counter]);

  const sessionAgeSec = Math.floor((Date.now() - sessionStartRef.current) / 1000);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-32 pb-24 px-5 sm:px-8">
        {/* HERO */}
        <section className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold tracking-[0.12em] uppercase mb-5">
            <span className="relative inline-flex w-2 h-2" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            Live now
          </div>
          <h1 className="text-[40px] sm:text-[56px] md:text-[68px] leading-[1.02] tracking-tight font-semibold" style={{ color: NAVY }}>
            What's happening{" "}
            <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
              right now.
            </span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-3xl">
            Every lead, every demo that fires through trainyouragent.com — anonymized, in real time. We don't track PII. We don't show emails or names. Just the type of action and a 2-letter initial.
          </p>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 p-4 sm:p-5 max-w-3xl text-[13.5px] leading-relaxed">
            <strong className="font-semibold">Real events only.</strong> No simulated traffic. If this page is empty, the funnel is genuinely quiet right now &mdash; that's the honesty tradeoff of building in public.
          </div>
        </section>

        {/* COUNTERS */}
        <section className="max-w-5xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Counter label="Events this session" value={visitorsLabel} accent />
          <Counter label="Poll interval" value={`${Math.round(POLL_MS / 1000)}s`} />
          <Counter label="Session age" value={formatDuration(sessionAgeSec)} />
        </section>

        {/* STREAM */}
        <section className="max-w-5xl mx-auto mt-10" aria-labelledby="stream-h">
          <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-1">
                Live event stream
              </div>
              <h2 id="stream-h" className="text-[24px] sm:text-[28px] font-semibold tracking-tight" style={{ color: NAVY }}>
                Last {MAX_VISIBLE} events · auto-updating
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#185FA5] font-medium"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <span className="text-slate-500">tick #{tickCount}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {items.length === 0 ? (
              <div className="p-8 sm:p-10 text-center">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">
                  Be the first event in the stream
                </div>
                <div className="text-[18px] sm:text-[20px] font-semibold mb-3" style={{ color: NAVY }}>
                  The funnel is quiet right now &mdash;{" "}
                  <span style={{ fontFamily: SERIF_ITALIC, fontStyle: "italic", fontWeight: 500 }}>
                    you can change that.
                  </span>
                </div>
                <div className="text-[14px] text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
                  Each of these actions registers a real event that you will see appear in this stream within ~8 seconds. No fake fillers, no synthetic motion.
                </div>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <Link
                    to="/voice-demo"
                    onClick={() => { void fireEvent("demo_used", { from: "/live", cta: "voice-demo" }, "live-empty-state"); }}
                    className="px-4 py-2.5 rounded-lg bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] min-h-[40px] inline-flex items-center"
                  >
                    Try the voice demo &rarr;
                  </Link>
                  <Link
                    to="/tools/website-audit"
                    onClick={() => { void fireEvent("tool_used", { from: "/live", cta: "website-audit" }, "live-empty-state"); }}
                    className="px-4 py-2.5 rounded-lg border border-[#185FA5] text-[#185FA5] text-[13px] font-semibold hover:bg-[#E6F1FB] min-h-[40px] inline-flex items-center"
                  >
                    Run an AI audit on your site &rarr;
                  </Link>
                  <a
                    href="/book"
                    onClick={() => { void fireEvent("router_lane_chosen", { from: "/live", cta: "book-call" }, "live-empty-state"); }}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-[13px] font-semibold hover:border-[#185FA5] min-h-[40px] inline-flex items-center"
                  >
                    Book a build call &rarr;
                  </a>
                </div>
                <p className="mt-5 text-[11.5px] text-slate-500 max-w-md mx-auto">
                  Your event arrives anonymized (2-letter initial only) — same as everyone else's.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="px-4 sm:px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                    style={{
                      animation: "tya-live-fade-in 480ms ease-out both",
                    }}
                  >
                    <span
                      className="mt-1.5 inline-flex w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: BLUE }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] leading-snug" style={{ color: NAVY }}>
                        <span className="font-semibold">{it.who || "??"}***</span>
                        {it.what ? <> &mdash; {it.what}</> : null}
                        {" "}<span className="text-slate-600">{it.action}</span>
                        {it.where ? <> &middot; <span className="text-slate-600">{it.where}</span></> : null}
                      </div>
                      <div className="text-[11.5px] text-slate-400 mt-0.5">{it.ago || "just now"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* DISCLOSURE */}
        <section className="max-w-5xl mx-auto mt-12">
          <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <summary className="cursor-pointer text-[15px] font-semibold" style={{ color: NAVY }}>
              How this works · what we collect · what we don't
            </summary>
            <div className="mt-3 space-y-2.5 text-[14px] text-slate-700 leading-relaxed">
              <p>
                The stream above pulls from <code className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[12px]">/api/recent-activity</code>, a public endpoint that returns the most recent anonymized signups, demo starts, and tool runs across the site.
              </p>
              <p>
                We strip PII server-side before any event hits this page. Email addresses are reduced to two-letter initials. We do not display names, IPs, user agents, or referrers.
              </p>
              <p>
                As of v60 (May 2026) the endpoint returns <strong>only real events</strong> from the lead store, within the last hour. We removed all synthetic / "plausible sample" fillers &mdash; if the funnel is quiet, this page is empty. That's the honest tradeoff and we'd rather show silence than fake motion.
              </p>
              <p>
                Full privacy + cookie practices: <Link to="/privacy" className="text-[#185FA5] underline underline-offset-2">/privacy</Link>. The full code for the endpoint is in the public repo at <a className="text-[#185FA5] underline underline-offset-2" href="https://github.com/builderofages/trainyouragent/blob/main/api/recent-activity.ts" target="_blank" rel="noopener">api/recent-activity.ts</a>.
              </p>
            </div>
          </details>
          <p className="mt-6 text-center text-[12px] text-slate-500">
            Built in public · <Link to="/proof" className="underline underline-offset-2">see the receipts</Link>
          </p>
        </section>
      </main>
      <FooterV44 />
      <style>{`
        @keyframes tya-live-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          li[style*="tya-live-fade-in"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function Counter({ label, value, accent = false }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500">{label}</div>
      <div
        className="mt-1 text-[36px] sm:text-[40px] leading-none font-semibold"
        style={{ color: accent ? BLUE : NAVY, fontFamily: SERIF_ITALIC }}
      >
        {value}
      </div>
    </div>
  );
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ${sec % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
