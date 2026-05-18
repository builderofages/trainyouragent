// src/components/LoomEmbed.tsx — v67A
// Tiny wrapper around the Loom iframe with two important behaviors:
//   1. Auto-converts a share URL (https://www.loom.com/share/{id}) to the
//      embed form (https://www.loom.com/embed/{id}) so authors can drop in
//      whichever URL they happen to copy.
//   2. Renders an honest empty state when the url is missing/placeholder —
//      no broken iframes in production, no fake "demo coming soon" lies.
//
// Transcript: optional. If provided, renders inside a <details> with a
// download-as-.txt link.

import { useMemo } from "react";

type Props = {
  url: string;
  title?: string;
  aspectRatio?: number; // width / height — default 16/9
  transcript?: string;
};

const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

function toEmbedUrl(raw: string): string | null {
  const u = (raw || "").trim();
  if (!u) return null;
  // Already an embed URL.
  if (/^https?:\/\/(www\.)?loom\.com\/embed\//i.test(u)) return u;
  // Share URL → embed URL.
  const m = u.match(/^https?:\/\/(www\.)?loom\.com\/share\/([a-zA-Z0-9]+)(\?.*)?$/i);
  if (m) return `https://www.loom.com/embed/${m[2]}`;
  // Anything else (placeholder, garbage) → null so we render the empty state.
  return null;
}

export default function LoomEmbed({
  url,
  title = "Loom video",
  aspectRatio = 16 / 9,
  transcript,
}: Props) {
  const embedUrl = useMemo(() => toEmbedUrl(url), [url]);

  // Honest empty state when no URL is set yet.
  if (!embedUrl) {
    return (
      <div
        className="my-6 rounded-2xl border border-dashed p-6 text-center"
        style={{ borderColor: BLUE, background: TINT, color: NAVY }}
        role="status"
      >
        <div className="text-[13px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: BLUE }}>
          {title}
        </div>
        <div className="text-[14px] leading-relaxed">
          Loom coming soon — Alexander records demos weekly on Fridays.
        </div>
        <div className="mt-2 text-[12px] text-slate-600">
          Want a custom walkthrough for your business?{" "}
          <a
            href="https://cal.com/trainyouragent/30min"
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold"
            style={{ color: NAVY }}
          >
            Book a 30-min Zoom
          </a>
          .
        </div>
      </div>
    );
  }

  const paddingTop = `${(1 / aspectRatio) * 100}%`;
  const downloadHref = transcript
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`
    : null;

  return (
    <div className="my-6">
      <div
        className="relative w-full rounded-xl overflow-hidden bg-black"
        style={{ paddingTop }}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="fullscreen; clipboard-write"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>

      {transcript && transcript.trim().length > 0 && (
        <details
          className="mt-3 rounded-lg border border-slate-200 bg-white p-4"
          aria-label={`${title} transcript`}
        >
          <summary
            className="cursor-pointer text-[13px] font-semibold"
            style={{ color: NAVY }}
          >
            Transcript
          </summary>
          <div className="mt-3 text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap">
            {transcript}
          </div>
          {downloadHref && (
            <div className="mt-3">
              <a
                href={downloadHref}
                download={`${(title || "loom-transcript").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`}
                className="text-[12px] font-semibold underline"
                style={{ color: BLUE }}
              >
                Download transcript (.txt)
              </a>
            </div>
          )}
        </details>
      )}
    </div>
  );
}
