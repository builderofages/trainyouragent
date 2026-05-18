// src/lib/looms.ts — v67A
// Stable slug-based registry of Loom videos. Alexander records demos every
// Friday and drops a real URL in here — no code change required to mount
// the video where it's already referenced (e.g. /proof, /voice-demo).
//
// Schema mirrors the LoomEmbed component props. `url: ""` means "not
// recorded yet" — the component renders an honest "coming soon" placeholder
// instead of a broken iframe.

export type LoomEntry = {
  url: string;          // share or embed URL — both are accepted
  title: string;        // human-readable title
  transcript?: string;  // optional transcript text
  aspectRatio?: number; // default 16/9
};

export const LOOMS: Record<string, LoomEntry> = {
  "architecture-walkthrough": {
    url: "",
    title: "Architecture walkthrough (3 min)",
    transcript: "",
  },
  "voice-agent-real-call": {
    url: "",
    title: "Voice agent handles a real HVAC call (45 sec)",
  },
  "chat-agent-real-conversation": {
    url: "",
    title: "Chat agent handles a real inbound conversation (60 sec)",
  },
  "founder-intro": {
    url: "",
    title: "Founder intro — who we build for and why (90 sec)",
  },
  "agent-builder-walkthrough": {
    url: "",
    title: "Agent builder walkthrough (2 min)",
  },
};

export function getLoom(slug: string): LoomEntry | undefined {
  return LOOMS[slug];
}
