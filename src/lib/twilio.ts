// src/lib/twilio.ts
// v76-c: Typed Twilio REST wrapper. Uses fetch() against the Twilio public
// API directly — no SDK dependency, so it works in Edge runtime + browser-free
// environments. Server-only: do not import from the React client bundle.
//
// Env vars (read by callers, not by this module — keeps the helper pure):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_PHONE_POOL_NUMBER   — the default outgoing number for SMS
//
// Auth: Twilio REST API uses HTTP Basic with sid:authToken. We build the
// header once per call (Edge runtime has no Buffer; we use btoa()).

export type TwilioAuth = {
  accountSid: string;
  authToken: string;
};

export type TwilioPhoneNumber = {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  voiceUrl: string | null;
  smsUrl: string | null;
  capabilities: { voice?: boolean; sms?: boolean; mms?: boolean };
};

export type ProvisionOptions = {
  /** ISO 3166-1 alpha-2 country code, defaults to "US". */
  countryCode?: string;
  /** Optional area code preference (e.g. "813" for Tampa). */
  areaCode?: string;
  /** Optional friendly name applied after purchase. */
  friendlyName?: string;
  /** Optional voice webhook (auto-applied after purchase). */
  voiceUrl?: string;
  /** Optional SMS webhook (auto-applied after purchase). */
  smsUrl?: string;
  /** Optional status-callback URL (call lifecycle). */
  statusCallback?: string;
};

export type SmsOptions = {
  to: string;
  body: string;
  /** Defaults to env TWILIO_PHONE_POOL_NUMBER. */
  from?: string;
  /** Optional Twilio Messaging Service SID (overrides from). */
  messagingServiceSid?: string;
  statusCallback?: string;
};

const TWILIO_BASE = "https://api.twilio.com/2010-04-01";

/** Build the Basic-auth header. Edge-safe (uses btoa, not Buffer). */
function basicAuth(auth: TwilioAuth): string {
  const raw = `${auth.accountSid}:${auth.authToken}`;
  // btoa is defined in Edge runtime + browsers. For Node fallback, we lazily
  // build using Buffer if needed.
  const encoded =
    typeof btoa === "function"
      ? btoa(raw)
      : Buffer.from(raw, "utf8").toString("base64");
  return `Basic ${encoded}`;
}

function fromUrlEncoded(body: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) {
    if (v != null && v !== "") params.set(k, v);
  }
  return params.toString();
}

async function twilioFetch(
  auth: TwilioAuth,
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const headers: Record<string, string> = {
    Authorization: basicAuth(auth),
    Accept: "application/json",
  };
  if (init.body && typeof init.body === "string") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  const res = await fetch(`${TWILIO_BASE}/Accounts/${auth.accountSid}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Twilio ${res.status}: ${txt.slice(0, 300)}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST PHONE NUMBERS
// ─────────────────────────────────────────────────────────────────────────────

export async function listPhoneNumbers(
  auth: TwilioAuth,
): Promise<TwilioPhoneNumber[]> {
  const json = (await twilioFetch(
    auth,
    "/IncomingPhoneNumbers.json?PageSize=100",
  )) as {
    incoming_phone_numbers?: Array<{
      sid: string;
      phone_number: string;
      friendly_name: string;
      voice_url: string | null;
      sms_url: string | null;
      capabilities: { voice?: boolean; SMS?: boolean; MMS?: boolean };
    }>;
  };
  return (json.incoming_phone_numbers || []).map((n) => ({
    sid: n.sid,
    phoneNumber: n.phone_number,
    friendlyName: n.friendly_name,
    voiceUrl: n.voice_url,
    smsUrl: n.sms_url,
    capabilities: {
      voice: !!n.capabilities?.voice,
      sms: !!n.capabilities?.SMS,
      mms: !!n.capabilities?.MMS,
    },
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVISION A NEW PHONE NUMBER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Two-step provision: (1) search AvailablePhoneNumbers for a free voice+sms
 * number in the requested country/area-code, (2) POST to IncomingPhoneNumbers
 * to purchase it and (in the same request) wire up the webhooks.
 */
export async function provisionPhoneNumber(
  auth: TwilioAuth,
  opts: ProvisionOptions = {},
): Promise<TwilioPhoneNumber> {
  const country = (opts.countryCode || "US").toUpperCase();
  const searchPath =
    `/AvailablePhoneNumbers/${country}/Local.json` +
    (opts.areaCode ? `?AreaCode=${encodeURIComponent(opts.areaCode)}&VoiceEnabled=true&SmsEnabled=true&PageSize=5` : `?VoiceEnabled=true&SmsEnabled=true&PageSize=5`);
  const search = (await twilioFetch(auth, searchPath)) as {
    available_phone_numbers?: Array<{ phone_number: string }>;
  };
  const candidate = search.available_phone_numbers?.[0]?.phone_number;
  if (!candidate) {
    throw new Error(
      `Twilio: no available numbers for country=${country} areaCode=${opts.areaCode || "any"}`,
    );
  }

  const body = fromUrlEncoded({
    PhoneNumber: candidate,
    FriendlyName: opts.friendlyName || `TYA-${new Date().toISOString().slice(0, 10)}`,
    VoiceUrl: opts.voiceUrl,
    VoiceMethod: opts.voiceUrl ? "POST" : undefined,
    SmsUrl: opts.smsUrl,
    SmsMethod: opts.smsUrl ? "POST" : undefined,
    StatusCallback: opts.statusCallback,
    StatusCallbackMethod: opts.statusCallback ? "POST" : undefined,
  });

  const purchase = (await twilioFetch(auth, "/IncomingPhoneNumbers.json", {
    method: "POST",
    body,
  })) as {
    sid: string;
    phone_number: string;
    friendly_name: string;
    voice_url: string | null;
    sms_url: string | null;
    capabilities: { voice?: boolean; SMS?: boolean; MMS?: boolean };
  };

  return {
    sid: purchase.sid,
    phoneNumber: purchase.phone_number,
    friendlyName: purchase.friendly_name,
    voiceUrl: purchase.voice_url,
    smsUrl: purchase.sms_url,
    capabilities: {
      voice: !!purchase.capabilities?.voice,
      sms: !!purchase.capabilities?.SMS,
      mms: !!purchase.capabilities?.MMS,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURE INBOUND WEBHOOK (update existing number)
// ─────────────────────────────────────────────────────────────────────────────

export async function configureInboundWebhook(
  auth: TwilioAuth,
  numberSid: string,
  webhooks: {
    voiceUrl?: string;
    smsUrl?: string;
    statusCallback?: string;
  },
): Promise<TwilioPhoneNumber> {
  const body = fromUrlEncoded({
    VoiceUrl: webhooks.voiceUrl,
    VoiceMethod: webhooks.voiceUrl ? "POST" : undefined,
    SmsUrl: webhooks.smsUrl,
    SmsMethod: webhooks.smsUrl ? "POST" : undefined,
    StatusCallback: webhooks.statusCallback,
    StatusCallbackMethod: webhooks.statusCallback ? "POST" : undefined,
  });
  const updated = (await twilioFetch(
    auth,
    `/IncomingPhoneNumbers/${numberSid}.json`,
    { method: "POST", body },
  )) as {
    sid: string;
    phone_number: string;
    friendly_name: string;
    voice_url: string | null;
    sms_url: string | null;
    capabilities: { voice?: boolean; SMS?: boolean; MMS?: boolean };
  };
  return {
    sid: updated.sid,
    phoneNumber: updated.phone_number,
    friendlyName: updated.friendly_name,
    voiceUrl: updated.voice_url,
    smsUrl: updated.sms_url,
    capabilities: {
      voice: !!updated.capabilities?.voice,
      sms: !!updated.capabilities?.SMS,
      mms: !!updated.capabilities?.MMS,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND SMS
// ─────────────────────────────────────────────────────────────────────────────

export async function sendSms(
  auth: TwilioAuth,
  opts: SmsOptions,
): Promise<{ sid: string; status: string }> {
  if (!opts.to) throw new Error("twilio.sendSms: missing 'to'");
  if (!opts.body) throw new Error("twilio.sendSms: missing 'body'");
  if (!opts.from && !opts.messagingServiceSid) {
    throw new Error("twilio.sendSms: provide either 'from' or 'messagingServiceSid'");
  }
  const body = fromUrlEncoded({
    To: opts.to,
    Body: opts.body.slice(0, 1600), // SMS hard cap (10 concatenated segments)
    From: opts.from,
    MessagingServiceSid: opts.messagingServiceSid,
    StatusCallback: opts.statusCallback,
  });
  const json = (await twilioFetch(auth, "/Messages.json", {
    method: "POST",
    body,
  })) as { sid: string; status: string };
  return { sid: json.sid, status: json.status };
}

// ─────────────────────────────────────────────────────────────────────────────
// TwiML — minimal builder used by the voice webhook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a TwiML <Response><Connect><ConversationRelay/></Connect></Response>
 * payload. ConversationRelay is Twilio's WebSocket bridge between the PSTN
 * leg and an LLM endpoint we host. It handles ASR + TTS for us.
 *
 * Reference: https://www.twilio.com/docs/voice/twiml/connect/conversationrelay
 */
export function buildConversationRelayTwiml(opts: {
  websocketUrl: string;          // wss://… endpoint we control
  welcomeGreeting?: string;
  voice?: string;                // e.g. "en-US-Neural2-D" or "Polly.Joanna"
  ttsProvider?: "Google" | "Amazon" | "Cartesia" | "ElevenLabs";
  transcriptionProvider?: "Deepgram" | "Google" | "Default";
}): string {
  const xml = (s: string) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const attrs: Record<string, string> = {
    url: xml(opts.websocketUrl),
  };
  if (opts.welcomeGreeting) attrs.welcomeGreeting = xml(opts.welcomeGreeting);
  if (opts.voice) attrs.voice = xml(opts.voice);
  if (opts.ttsProvider) attrs.ttsProvider = opts.ttsProvider;
  if (opts.transcriptionProvider)
    attrs.transcriptionProvider = opts.transcriptionProvider;
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Connect>\n    <ConversationRelay ${attrStr} />\n  </Connect>\n</Response>`;
}

/** Plain TwiML fallback for when ConversationRelay is unavailable. */
export function buildFallbackVoicemailTwiml(opts: {
  message: string;
  recordingCallback?: string;
}): string {
  const xml = (s: string) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const rec = opts.recordingCallback
    ? `<Record maxLength="120" action="${xml(opts.recordingCallback)}" method="POST" playBeep="true" />`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say voice="Polly.Joanna">${xml(opts.message)}</Say>\n  ${rec}\n  <Hangup/>\n</Response>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — env loaders so api/* handlers don't repeat boilerplate
// ─────────────────────────────────────────────────────────────────────────────

export function getTwilioAuthFromEnv(): TwilioAuth | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";
  if (!accountSid || !authToken) return null;
  return { accountSid, authToken };
}

export function twilioConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
}
