// src/pages/portal/Support.tsx
// v76-a: Customer support ticket form. Submits to /api/portal/support which
// inserts a row + emails Alexander. Also surfaces direct email + Cal link.

import { useState } from "react";
import { portalFetch } from "@/lib/portal";
import { Send } from "lucide-react";

const NAVY = "#042C53";
const CREAM = "#FAF6EE";
const CAL_URL = "https://cal.com/trainyouragent/30min";

const INPUT_CLS = "w-full px-3 py-2.5 rounded-md border bg-white text-[14px]";
const INPUT_STYLE: React.CSSProperties = { borderColor: "rgba(4,44,83,0.18)", color: NAVY, fontFamily: "Inter Tight, system-ui, sans-serif" };

export default function PortalSupport() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!subject.trim() || !description.trim()) {
      setError("Subject and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await portalFetch("/api/portal/support", {
        method: "POST",
        body: JSON.stringify({ subject, description, priority }),
      });
      if (res.ok) {
        setDone(true);
        setSubject("");
        setDescription("");
        setPriority("normal");
      } else {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Couldn't submit ticket.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] leading-tight tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Support
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          Alexander reads every ticket personally. Reply within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form onSubmit={onSubmit} className="lg:col-span-2 rounded-xl border bg-white p-5 space-y-4" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          {done ? (
            <div>
              <div className="text-[15px] font-medium" style={{ fontFamily: "Inter Tight, system-ui, sans-serif", color: NAVY }}>
                Ticket received.
              </div>
              <p className="mt-2 text-[13px]" style={{ color: "rgba(4,44,83,0.7)" }}>
                We'll respond within 24 hours. Urgent issues page Alexander immediately.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-4 text-[12.5px] underline"
                style={{ color: NAVY }}
              >
                Open another ticket
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.14em] mb-1.5" style={{ color: "rgba(4,44,83,0.55)" }}>Subject</label>
                <input className={INPUT_CLS} style={INPUT_STYLE} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's going on?" />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.14em] mb-1.5" style={{ color: "rgba(4,44,83,0.55)" }}>Description</label>
                <textarea rows={6} className={INPUT_CLS} style={INPUT_STYLE} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Steps to reproduce, what you expected, what happened. Screenshots welcome via email reply." />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.14em] mb-1.5" style={{ color: "rgba(4,44,83,0.55)" }}>Priority</label>
                <select className={INPUT_CLS} style={INPUT_STYLE} value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                  <option value="low">Low — whenever</option>
                  <option value="normal">Normal — within 24h</option>
                  <option value="high">High — same day</option>
                  <option value="urgent">Urgent — agent down / lost revenue</option>
                </select>
              </div>
              {error && <div className="text-[13px]" style={{ color: "#b91c1c" }}>{error}</div>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[13.5px] font-medium disabled:opacity-60"
                style={{ background: NAVY, color: CREAM, fontFamily: "Inter Tight, system-ui, sans-serif" }}
              >
                <Send size={14} strokeWidth={1.75} />
                {submitting ? "Sending…" : "Submit ticket"}
              </button>
            </>
          )}
        </form>

        <aside className="rounded-xl border bg-white p-5 space-y-4" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <div>
            <div className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: "rgba(4,44,83,0.55)" }}>Direct email</div>
            <a className="mt-1 block text-[14px] underline" style={{ color: NAVY }} href="mailto:alexander@trainyouragent.com">
              alexander@trainyouragent.com
            </a>
            <div className="mt-1 text-[12px]" style={{ color: "rgba(4,44,83,0.55)" }}>Response within 24h</div>
          </div>
          <div>
            <div className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: "rgba(4,44,83,0.55)" }}>Schedule a call</div>
            <a className="mt-1 block text-[14px] underline" style={{ color: NAVY }} href={CAL_URL} target="_blank" rel="noreferrer">
              Pick a time on Cal.com →
            </a>
            <div className="mt-1 text-[12px]" style={{ color: "rgba(4,44,83,0.55)" }}>30-minute slots</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
