// src/pages/portal/AgentSettings.tsx
// v76-a: Forms — business name, forwarding phone, voice persona (formal↔friendly
// slider, local-only for now), business hours, escalation rules notes, KB upload.

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { portalFetch, type Customer } from "@/lib/portal";
import { UploadCloud, Save } from "lucide-react";

const NAVY = "#042C53";
const CREAM = "#FAF6EE";

type Ctx = { customer: Customer | null; email: string };

const FIELD_LABEL = "block text-[11.5px] uppercase tracking-[0.14em] mb-1.5";
const INPUT_CLS = "w-full px-3 py-2.5 rounded-md border bg-white text-[14px]";
const INPUT_STYLE: React.CSSProperties = { borderColor: "rgba(4,44,83,0.18)", color: NAVY, fontFamily: "Inter Tight, system-ui, sans-serif" };

export default function PortalAgentSettings() {
  const { customer } = useOutletContext<Ctx>();
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [notes, setNotes] = useState("");
  // Local-only preferences (not persisted to tya_customers — would live in a
  // future `agent_preferences` table). Kept here so the form has presence.
  const [tone, setTone] = useState(50);
  const [hours, setHours] = useState("Mon–Fri 9am–6pm");
  const [escalation, setEscalation] = useState("Forward to (123) 456-7890 if caller mentions cancellation, refund, or asks for the owner.");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploads, setUploads] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (customer) {
      setBusinessName(customer.business_name || "");
      setBusinessPhone(customer.business_phone || "");
      setNotes(customer.notes || "");
    }
  }, [customer]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(null);
    try {
      const res = await portalFetch("/api/portal/update", {
        method: "POST",
        body: JSON.stringify({
          business_name: businessName,
          business_phone: businessPhone,
          notes: `${notes}\n\n---\nPreferences (v76a local):\ntone:${tone} hours:${hours}\nescalation:${escalation}`.trim(),
        }),
      });
      if (res.ok) {
        setSaved("Saved.");
      } else {
        const j = await res.json().catch(() => ({}));
        setSaved(`Couldn't save: ${(j as { error?: string }).error || res.statusText}`);
      }
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(null), 3000);
    }
  }

  async function onFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    setUploadError(null);
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await portalFetch("/api/portal/upload", { method: "POST", body: fd });
      if (res.ok) {
        const j = (await res.json().catch(() => ({}))) as { name?: string };
        setUploads((u) => [...u, j.name || f.name]);
      } else {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setUploadError(`${f.name}: ${j.error || res.statusText}`);
      }
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] leading-tight tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Agent <em className="not-italic" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: "italic" }}>settings</em>
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          Edit how your agent answers, escalates, and which knowledge it draws from.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <div className="rounded-xl border bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <div>
            <label className={FIELD_LABEL} style={{ color: "rgba(4,44,83,0.55)" }}>Business name</label>
            <input className={INPUT_CLS} style={INPUT_STYLE} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Plumbing" />
          </div>
          <div>
            <label className={FIELD_LABEL} style={{ color: "rgba(4,44,83,0.55)" }}>Forwarding phone</label>
            <input className={INPUT_CLS} style={INPUT_STYLE} value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="(123) 456-7890" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <label className={FIELD_LABEL} style={{ color: "rgba(4,44,83,0.55)" }}>
            Voice persona — tone
          </label>
          <div className="flex items-center gap-4">
            <span className="text-[12px]" style={{ color: "rgba(4,44,83,0.55)" }}>Formal</span>
            <input type="range" min={0} max={100} value={tone} onChange={(e) => setTone(Number(e.target.value))} className="flex-1" style={{ accentColor: NAVY }} />
            <span className="text-[12px]" style={{ color: "rgba(4,44,83,0.55)" }}>Friendly</span>
          </div>
          <div className="mt-2 text-[12px]" style={{ color: "rgba(4,44,83,0.55)" }}>
            Current: {tone < 33 ? "Formal · concise · professional" : tone < 67 ? "Balanced" : "Warm · conversational · uses first names"}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <div>
            <label className={FIELD_LABEL} style={{ color: "rgba(4,44,83,0.55)" }}>Business hours</label>
            <input className={INPUT_CLS} style={INPUT_STYLE} value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div>
            <label className={FIELD_LABEL} style={{ color: "rgba(4,44,83,0.55)" }}>Escalation rules</label>
            <textarea rows={2} className={INPUT_CLS} style={INPUT_STYLE} value={escalation} onChange={(e) => setEscalation(e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <label className={FIELD_LABEL} style={{ color: "rgba(4,44,83,0.55)" }}>Operational notes (shared with our ops team)</label>
          <textarea rows={3} className={INPUT_CLS} style={INPUT_STYLE} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know — naming quirks, common scripts, edge cases." />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[13.5px] font-medium disabled:opacity-60"
            style={{ background: NAVY, color: CREAM, fontFamily: "Inter Tight, system-ui, sans-serif" }}
          >
            <Save size={14} strokeWidth={1.75} />
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="text-[12.5px]" style={{ color: "rgba(4,44,83,0.6)" }}>{saved}</span>}
        </div>
      </form>

      <div className="mt-10 rounded-xl border bg-white p-5" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
        <div className="text-[15px] font-medium tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Knowledge base
        </div>
        <p className="mt-1 text-[13px]" style={{ color: "rgba(4,44,83,0.6)" }}>
          Upload PDFs, transcripts, SOPs, FAQs. We chunk + embed them into your agent's retrieval store.
        </p>
        <label className="mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 px-4 cursor-pointer hover:bg-black/[0.02]" style={{ borderColor: "rgba(4,44,83,0.18)" }}>
          <UploadCloud size={22} strokeWidth={1.5} style={{ color: NAVY }} />
          <span className="mt-2 text-[13px]" style={{ color: NAVY }}>
            {uploading ? "Uploading…" : "Drop files here or click to choose"}
          </span>
          <span className="text-[11.5px] mt-1" style={{ color: "rgba(4,44,83,0.55)" }}>Up to 25 MB per file</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {uploads.length > 0 && (
          <ul className="mt-3 space-y-1 text-[12.5px]" style={{ color: "rgba(4,44,83,0.7)" }}>
            {uploads.map((n, i) => (
              <li key={i}>✓ {n}</li>
            ))}
          </ul>
        )}
        {uploadError && <div className="mt-2 text-[12.5px]" style={{ color: "#b91c1c" }}>{uploadError}</div>}
      </div>
    </div>
  );
}
