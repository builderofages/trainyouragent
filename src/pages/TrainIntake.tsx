// src/pages/TrainIntake.tsx — v76-c
//
// 4-step discovery questionnaire that feeds POST /api/intake. Submits into
// public.tya_intake and fires a Resend notification to Alexander with the
// summary. Step 4 collects file metadata only (name/size/type) — the actual
// file upload pipeline lives in v77.
//
// UX notes:
//   - Steps are pure state — back/next never loses entered data.
//   - Top progress bar shows 1/4 through 4/4.
//   - Submit is gated on email + business_name (everything else optional).
//   - On success we show the "Thanks, we'll be in touch within 24h" confirmation.

import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

type IntakeState = {
  // contact
  email: string;
  // Step 1
  business_name: string;
  industry: string;
  employee_count: string;
  monthly_call_volume: string;
  avg_ticket_size: string;
  primary_pain: string;
  // Step 2
  current_call_handling: string;
  common_questions: string[]; // length 5
  avg_call_duration: string;
  booking_rate: string;
  // Step 3
  services: Array<{ name: string; price: string }>;
  business_hours: string;
  service_area_zips: string;
  payment_methods: string[];
  scheduling_system: string;
  // Step 4
  uploaded_files: Array<{ name: string; size: number; type: string }>;
};

const INDUSTRIES = [
  "HVAC", "Plumbing", "Roofing", "Electrical", "Landscaping",
  "Dental", "Medical / Med Spa", "Veterinary",
  "Law firm", "Accounting / Bookkeeping", "Insurance",
  "Real estate", "Property management",
  "Restaurant / Bar", "Gym / Fitness", "Hotel / Hospitality",
  "Auto repair", "Pest control",
  "E-commerce", "SaaS", "Other",
];
const EMPLOYEE_BUCKETS = ["Just me", "2-5", "6-15", "16-50", "51-200", "200+"];
const CALL_VOLUME = ["<50/mo", "50-200/mo", "200-500/mo", "500-1500/mo", "1500-5000/mo", "5000+/mo"];
const TICKET_SIZES = ["<$100", "$100-$300", "$300-$800", "$800-$2,500", "$2,500-$10K", "$10K+"];
const CALL_HANDLING = [
  "In-house staff during business hours",
  "Answering service / call center",
  "Voicemail",
  "Mobile cell — owner picks up",
  "None — calls go unanswered",
  "Mix of the above",
];
const CALL_DURATIONS = ["<1 min", "1-3 min", "3-7 min", "7-15 min", "15+ min", "Varies wildly"];
const BOOKING_RATES = ["<10%", "10-25%", "25-50%", "50-75%", "75%+", "Don't know"];
const PAYMENT_METHODS = ["Card on file", "Card on completion", "Check", "Cash", "ACH/Bank transfer", "Invoice (Net-30)", "Financing", "Insurance / 3rd-party billing"];
const SCHEDULING_SYSTEMS = ["Cal.com", "Acuity", "Calendly", "Square Appointments", "Jobber", "Housecall Pro", "ServiceTitan", "Google Calendar (manual)", "Paper / whiteboard", "Custom internal tool", "None"];

const STEPS = ["About your business", "Current process", "Your offer", "Knowledge upload"];

const INITIAL: IntakeState = {
  email: "",
  business_name: "",
  industry: "",
  employee_count: "",
  monthly_call_volume: "",
  avg_ticket_size: "",
  primary_pain: "",
  current_call_handling: "",
  common_questions: ["", "", "", "", ""],
  avg_call_duration: "",
  booking_rate: "",
  services: [{ name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }],
  business_hours: "",
  service_area_zips: "",
  payment_methods: [],
  scheduling_system: "",
  uploaded_files: [],
};

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 15;

export default function TrainIntake() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<IntakeState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, submitted]);

  const canAdvance = useMemo(() => {
    if (step === 0) return !!state.email && !!state.business_name;
    return true;
  }, [step, state.email, state.business_name]);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setErr("");
    try {
      const payload = {
        ...state,
        common_questions: state.common_questions.map((q) => q.trim()).filter(Boolean),
        services: state.services.map((s) => ({ name: s.name.trim(), price: s.price.trim() })).filter((s) => s.name || s.price),
        website: "", hp: "",
      };
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(`HTTP ${r.status} ${txt.slice(0, 200)}`);
      }
      setSubmitted(true);
    } catch (e: any) {
      setErr(e?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <Helmet>
        <title>Discovery questionnaire — TrainYourAgent</title>
        <meta
          name="description"
          content="4-step discovery questionnaire. Tell us about your business and we'll book a discovery call within 24 hours to start training your AI agent."
        />
        <link rel="canonical" href="https://www.trainyouragent.com/train/intake" />
        <meta property="og:title" content="Discovery questionnaire — TrainYourAgent" />
        <meta property="og:description" content="4-step intake. We respond within 24h with a discovery-call invite." />
        <meta property="og:url" content="https://www.trainyouragent.com/train/intake" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-28 pb-8 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/40 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Discovery questionnaire</div>
          <h1 className="text-[34px] sm:text-[48px] leading-[1.05] font-semibold text-[#042C53] tracking-tight">
            Tell us about your business.
          </h1>
          <p className="mt-4 text-[16px] text-slate-700 max-w-2xl">
            4 short steps. Takes about 8 minutes. We respond within 24 hours with a discovery-call invite — no waitlist, no qualification call before the discovery call.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <>
              <ProgressBar step={step} steps={STEPS} />
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                {step === 0 && <Step1 state={state} setState={setState} />}
                {step === 1 && <Step2 state={state} setState={setState} />}
                {step === 2 && <Step3 state={state} setState={setState} />}
                {step === 3 && <Step4 state={state} setState={setState} />}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={step === 0 || submitting}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="px-5 py-3 rounded-2xl border border-slate-300 bg-white text-[#042C53] text-[14px] font-semibold disabled:opacity-40"
                >
                  ← Back
                </button>
                {err && <span className="text-[12px] text-red-700">{err}</span>}
                {step < 3 ? (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => setStep((s) => Math.min(3, s + 1))}
                    className="px-6 py-3 rounded-2xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting || !state.email || !state.business_name}
                    onClick={submit}
                    className="px-6 py-3 rounded-2xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50"
                  >
                    {submitting ? "Sending…" : "Submit intake →"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <SuccessPanel email={state.email} businessName={state.business_name} />
          )}
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ step, steps }: { step: number; steps: string[] }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-[#185FA5]">
        <span>Step {step + 1} of {steps.length}</span>
        <span className="text-slate-500 normal-case tracking-normal">{steps[step]}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-[#185FA5] transition-all duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — About
// ─────────────────────────────────────────────────────────────────────────────

function Step1({ state, setState }: { state: IntakeState; setState: (s: IntakeState) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#042C53]">About your business</h2>
      <Grid>
        <Field label="Your email *">
          <input type="email" required value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} placeholder="you@business.com" className={inputCls} />
        </Field>
        <Field label="Business name *">
          <input type="text" required value={state.business_name} onChange={(e) => setState({ ...state, business_name: e.target.value })} placeholder="Acme HVAC" className={inputCls} />
        </Field>
      </Grid>
      <Grid>
        <Field label="Industry">
          <select value={state.industry} onChange={(e) => setState({ ...state, industry: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {INDUSTRIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Employee count">
          <select value={state.employee_count} onChange={(e) => setState({ ...state, employee_count: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {EMPLOYEE_BUCKETS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </Grid>
      <Grid>
        <Field label="Current monthly inbound call volume">
          <select value={state.monthly_call_volume} onChange={(e) => setState({ ...state, monthly_call_volume: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {CALL_VOLUME.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Average ticket / job size">
          <select value={state.avg_ticket_size} onChange={(e) => setState({ ...state, avg_ticket_size: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {TICKET_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </Grid>
      <Field label="What's the primary pain you're trying to fix? (2-4 sentences)">
        <textarea rows={4} value={state.primary_pain} onChange={(e) => setState({ ...state, primary_pain: e.target.value })} placeholder="e.g. We miss 8-12 calls per week after hours. Customers go to the next HVAC company on Google. We've tried an answering service but they take messages instead of booking jobs." className={inputCls} />
      </Field>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Current process
// ─────────────────────────────────────────────────────────────────────────────

function Step2({ state, setState }: { state: IntakeState; setState: (s: IntakeState) => void }) {
  function updateQuestion(i: number, v: string) {
    const next = state.common_questions.slice();
    next[i] = v;
    setState({ ...state, common_questions: next });
  }
  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#042C53]">Current process</h2>
      <Field label="How are calls answered today?">
        <select value={state.current_call_handling} onChange={(e) => setState({ ...state, current_call_handling: e.target.value })} className={inputCls}>
          <option value="">Select…</option>
          {CALL_HANDLING.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <div>
        <label className="block text-[13px] font-semibold text-[#042C53] mb-2">Top 5 most common caller questions</label>
        <div className="space-y-2">
          {state.common_questions.map((q, i) => (
            <input
              key={i}
              value={q}
              onChange={(e) => updateQuestion(i, e.target.value)}
              placeholder={`Question ${i + 1} (e.g. "How much does ___ cost?")`}
              className={inputCls}
            />
          ))}
        </div>
      </div>
      <Grid>
        <Field label="Average call duration">
          <select value={state.avg_call_duration} onChange={(e) => setState({ ...state, avg_call_duration: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {CALL_DURATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Of inbound calls, what % get booked?">
          <select value={state.booking_rate} onChange={(e) => setState({ ...state, booking_rate: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {BOOKING_RATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </Grid>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Your offer
// ─────────────────────────────────────────────────────────────────────────────

function Step3({ state, setState }: { state: IntakeState; setState: (s: IntakeState) => void }) {
  function updateService(i: number, field: "name" | "price", v: string) {
    const next = state.services.slice();
    next[i] = { ...next[i], [field]: v };
    setState({ ...state, services: next });
  }
  function addService() {
    if (state.services.length >= 12) return;
    setState({ ...state, services: [...state.services, { name: "", price: "" }] });
  }
  function togglePayment(p: string) {
    const has = state.payment_methods.includes(p);
    const next = has ? state.payment_methods.filter((x) => x !== p) : [...state.payment_methods, p];
    setState({ ...state, payment_methods: next });
  }
  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#042C53]">Your offer</h2>
      <div>
        <label className="block text-[13px] font-semibold text-[#042C53] mb-2">Services + prices</label>
        <div className="space-y-2">
          {state.services.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input value={s.name} onChange={(e) => updateService(i, "name", e.target.value)} placeholder={`Service ${i + 1}`} className={`${inputCls} col-span-2`} />
              <input value={s.price} onChange={(e) => updateService(i, "price", e.target.value)} placeholder="Price" className={inputCls} />
            </div>
          ))}
        </div>
        <button type="button" onClick={addService} className="mt-3 text-[12px] text-[#185FA5] font-semibold hover:underline">+ Add another service</button>
      </div>
      <Grid>
        <Field label="Business hours">
          <input value={state.business_hours} onChange={(e) => setState({ ...state, business_hours: e.target.value })} placeholder="M-F 8a-6p, Sat 9a-2p" className={inputCls} />
        </Field>
        <Field label="Scheduling system">
          <select value={state.scheduling_system} onChange={(e) => setState({ ...state, scheduling_system: e.target.value })} className={inputCls}>
            <option value="">Select…</option>
            {SCHEDULING_SYSTEMS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </Grid>
      <Field label="Service area ZIP codes (comma-separated)">
        <input value={state.service_area_zips} onChange={(e) => setState({ ...state, service_area_zips: e.target.value })} placeholder="33602, 33603, 33604, 33605" className={inputCls} />
      </Field>
      <div>
        <label className="block text-[13px] font-semibold text-[#042C53] mb-2">Payment methods accepted</label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((p) => {
            const on = state.payment_methods.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePayment(p)}
                className={`px-3 py-1.5 rounded-full border text-[12px] transition ${
                  on
                    ? "bg-[#042C53] text-white border-[#042C53]"
                    : "bg-white text-slate-700 border-slate-300 hover:border-[#185FA5]"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Knowledge upload (file metadata only)
// ─────────────────────────────────────────────────────────────────────────────

function Step4({ state, setState }: { state: IntakeState; setState: (s: IntakeState) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [overTotalSize, setOverTotalSize] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setOverTotalSize(false);
    const incoming = Array.from(files).slice(0, MAX_FILES);
    const accepted = incoming
      .filter((f) => f.size <= MAX_FILE_BYTES)
      .map((f) => ({ name: f.name, size: f.size, type: f.type || "" }));
    const merged = [...state.uploaded_files, ...accepted].slice(0, MAX_FILES);
    const total = merged.reduce((acc, f) => acc + f.size, 0);
    if (total > 80 * 1024 * 1024) setOverTotalSize(true);
    setState({ ...state, uploaded_files: merged });
  }

  function removeAt(i: number) {
    const next = state.uploaded_files.slice();
    next.splice(i, 1);
    setState({ ...state, uploaded_files: next });
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold text-[#042C53]">Knowledge upload</h2>
      <p className="text-[14px] text-slate-700 leading-relaxed">
        Optional. Drop in any PDFs, docs, FAQ sheets, pricing sheets, SOPs, or previous call recordings you already have. We only capture file names here — Alexander will follow up with a secure upload link once we schedule the discovery call.
      </p>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#185FA5] bg-slate-50 hover:bg-[#E6F1FB]/40 transition px-6 py-10 text-center"
      >
        <div className="text-[15px] font-semibold text-[#042C53]">Drop files here or click to choose</div>
        <div className="text-[12px] text-slate-600 mt-2">PDFs, Word docs, MP3/WAV recordings, screenshots. Up to {MAX_FILES} files, 25 MB each.</div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.md,.csv,.xls,.xlsx,.mp3,.wav,.m4a,.png,.jpg,.jpeg"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {state.uploaded_files.length > 0 && (
        <ul className="space-y-1.5">
          {state.uploaded_files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between text-[13px] bg-white border border-slate-200 rounded-xl px-3 py-2">
              <span className="truncate"><span className="font-medium text-[#042C53]">{f.name}</span> <span className="text-slate-500">· {prettySize(f.size)}{f.type ? ` · ${f.type}` : ""}</span></span>
              <button type="button" onClick={() => removeAt(i)} className="text-[12px] text-red-600 hover:underline ml-3">remove</button>
            </li>
          ))}
        </ul>
      )}
      {overTotalSize && (
        <div className="text-[12px] text-amber-700">
          Heads up — you've selected a lot of files. We'll capture the file names now and send a secure upload link in our reply for the actual data.
        </div>
      )}
      <div className="text-[12px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
        Nothing here? That's fine. Most clients send their files in the discovery call. Just hit submit and we'll go from there.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success
// ─────────────────────────────────────────────────────────────────────────────

function SuccessPanel({ email, businessName }: { email: string; businessName: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#185FA5]/30 bg-[#E6F1FB]/60 p-7 sm:p-9">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Submitted</div>
      <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] leading-tight mb-3">Thanks{businessName ? `, ${businessName}` : ""}.</h2>
      <p className="text-[15px] text-slate-700 leading-relaxed mb-3">
        We received your intake. Alexander will personally reply within 24 hours to <span className="font-semibold text-[#042C53]">{email}</span> with a discovery-call link.
      </p>
      <p className="text-[14px] text-slate-700 leading-relaxed mb-5">
        On that call we'll transcribe your real business — top 100 questions, your tone, your service menu — and start building. No prep deck needed. Just show up and talk to me like I'm a new hire.
      </p>
      <div className="flex flex-wrap gap-3">
        <a href="https://cal.com/trainyouragent/30min" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E]">
          Or grab a slot now →
        </a>
        <Link to="/train" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-300 bg-white text-[#042C53] text-[14px] font-semibold hover:border-[#185FA5]">
          ← Back to /train
        </Link>
      </div>

      {/* v83: backup contact rail — if for any reason the intake email
          notification doesn't reach Alexander (Resend sandbox limit,
          DNS issue, edge case) the visitor has a direct human path. */}
      <div className="mt-6 pt-5 border-t border-[#185FA5]/20">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">If you don't hear back in 24h</div>
        <div className="text-[13px] text-slate-700 leading-relaxed">
          DM the founder on{" "}
          <a href="https://www.linkedin.com/in/agentmills/" target="_blank" rel="noopener noreferrer" className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/40 underline-offset-2 font-semibold">
            LinkedIn
          </a>
          {" "}or email{" "}
          <a href="mailto:trainyouragent@gmail.com?subject=Discovery%20intake%20follow-up" className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/40 underline-offset-2 font-semibold">
            trainyouragent@gmail.com
          </a>
          {" "}directly. Alexander reads every one.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// shared bits
// ─────────────────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-[14px] bg-white focus:outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-[#042C53] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function prettySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
