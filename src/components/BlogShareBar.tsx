// src/components/BlogShareBar.tsx
// v41: Twitter + LinkedIn share buttons. Intent URLs only — no SDK, no tracking.

type Props = { title: string; slug: string };

export default function BlogShareBar({ title, slug }: Props) {
  const url = `https://trainyouragent.com/blog/${slug}`;
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // soft visual feedback
      const el = document.getElementById("tya-copy-label");
      if (el) {
        const orig = el.textContent;
        el.textContent = "Copied ✓";
        setTimeout(() => { el.textContent = orig || "Copy link"; }, 1500);
      }
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 my-6">
      <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mr-1">Share</span>
      <a
        href={tw} target="_blank" rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[12px] text-slate-700 min-h-[36px]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </a>
      <a
        href={li} target="_blank" rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[12px] text-slate-700 min-h-[36px]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
        LinkedIn
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[12px] text-slate-700 min-h-[36px]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span id="tya-copy-label">Copy link</span>
      </button>
    </div>
  );
}
