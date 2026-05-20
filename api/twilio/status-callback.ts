// api/twilio/status-callback.ts
// v76-c: Twilio call-status webhook. Logs every call completion (and key
// lifecycle events) to public.tya_calls. Idempotent on CallSid — a duplicate
// fire from Twilio's at-least-once retry policy gets upserted, not duplicated.
//
// Twilio fires this webhook on every call status change if you set the
// StatusCallback param on the IncomingPhoneNumber. We care primarily about:
//   completed   — call ended cleanly (write durations/cost)
//   no-answer   — never picked up
//   busy        — caller got a busy signal
//   failed      — telco-side failure
//
// Required env vars:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY  (otherwise the handler logs and 200s)

import { getSupabase } from "../_lib/supabase.js";

export const config = { runtime: "edge" };

const FINAL_STATUSES = new Set([
  "completed",
  "busy",
  "no-answer",
  "failed",
  "canceled",
]);

export default async function handler(req: Request) {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("method not allowed", { status: 405 });
  }

  let params: URLSearchParams;
  if (req.method === "POST") {
    const raw = await req.text();
    params = new URLSearchParams(raw);
  } else {
    params = new URL(req.url).searchParams;
  }

  const callSid = params.get("CallSid") || "";
  const callStatus = params.get("CallStatus") || "unknown";
  const from = params.get("From") || params.get("Caller") || "";
  const to = params.get("To") || params.get("Called") || "";
  const durationStr = params.get("CallDuration") || params.get("Duration") || "0";
  const duration = parseInt(durationStr, 10) || 0;
  const recordingUrl = params.get("RecordingUrl") || "";
  const recordingDurationStr = params.get("RecordingDuration") || "";

  // Twilio retries on non-2xx, so any failure path still 200s — we never want
  // Twilio to mark the webhook as broken. Errors go to console for observability.
  if (!callSid) {
    return json({ ok: true, skipped: "no-call-sid" });
  }

  const sb = getSupabase();
  if (!sb) {
    console.warn("[twilio/status-callback] Supabase not configured — skipping log");
    return json({ ok: true, skipped: "supabase-not-configured" });
  }

  // Build outcome from CallStatus + duration heuristic. We don't have AI
  // summary here — the relay process writes that separately via the
  // /api/admin/calls/:sid endpoint (v77).
  const outcome = mapOutcome(callStatus, duration, !!recordingUrl);

  const meta: Record<string, unknown> = {};
  for (const [k, v] of params.entries()) meta[k] = v;

  // Upsert on twilio_call_sid (unique) — Twilio may fire 'ringing' then
  // 'in-progress' then 'completed' against the same SID.
  const row = {
    twilio_call_sid: callSid,
    caller_phone: from || null,
    to_phone: to || null,
    duration_sec: duration || null,
    outcome,
    recording_url: recordingUrl || null,
    meta,
  };

  try {
    const { error } = await sb
      .from("tya_calls")
      .upsert(row, { onConflict: "twilio_call_sid" });
    if (error) {
      console.error("[twilio/status-callback] upsert error", error);
      return json({ ok: true, db_error: error.message });
    }
  } catch (e) {
    console.error("[twilio/status-callback] upsert threw", e);
    return json({ ok: true, db_threw: (e as Error).message });
  }

  // Only "final" statuses count as billable / reportable events. The
  // upsert above runs for every status to keep the row hot.
  return json({
    ok: true,
    sid: callSid,
    status: callStatus,
    final: FINAL_STATUSES.has(callStatus),
    outcome,
    recordingDuration: recordingDurationStr || null,
  });
}

function mapOutcome(
  callStatus: string,
  durationSec: number,
  hasRecording: boolean,
): string {
  if (callStatus === "completed" && durationSec >= 25) return "qualified";
  if (callStatus === "completed" && durationSec > 0) return "voicemail";
  if (callStatus === "completed" && hasRecording) return "voicemail";
  if (callStatus === "no-answer" || callStatus === "busy") return "no-answer";
  if (callStatus === "failed" || callStatus === "canceled") return callStatus;
  return "unknown";
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
