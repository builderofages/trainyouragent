// src/pages/DocsPage.tsx — v49
// One component handles BOTH /docs (index) and /docs/:slug (single doc).
// Renders a lightweight markdown-ish syntax: ##/### headings, paragraphs,
// fenced code blocks (```), and bullet lists (lines starting with - or *).

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { DOCS, DOCS_BY_SLUG, SECTIONS, docsBySection, type Doc } from "@/content/docs";
import { withAttribution } from "@/lib/affiliate";

const NAVY = "#042C53";
const BLUE = "#185FA5";

/* --------------------------------------------------------------------- */
/*  Renderer                                                              */
/* --------------------------------------------------------------------- */

type Block =
  | { kind: "h2"; text: string; id: string }
  | { kind: "h3"; text: string; id: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "pre"; text: string };

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function parseBody(body: string): Block[] {
  const lines = body.split(/\r?\n/);
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      // fenced code block
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing fence
      blocks.push({ kind: "pre", text: buf.join("\n") });
      continue;
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      blocks.push({ kind: "h2", text, id: slugify(text) });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      blocks.push({ kind: "h3", text, id: slugify(text) });
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    // paragraph: collect until blank line or block-starter
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("```") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ kind: "p", text: buf.join(" ").trim() });
  }
  return blocks;
}

function RenderedBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="docs-prose">
      {blocks.map((b, i) => {
        if (b.kind === "h2") return <h2 key={i} id={b.id} className="text-[24px] sm:text-[28px] font-semibold text-[#042C53] mt-10 mb-3 scroll-mt-24" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>{b.text}</h2>;
        if (b.kind === "h3") return <h3 key={i} id={b.id} className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mt-7 mb-2 scroll-mt-24">{b.text}</h3>;
        if (b.kind === "p") return <p key={i} className="text-[15.5px] text-slate-700 leading-[1.75] my-4">{b.text}</p>;
        if (b.kind === "ul") return <ul key={i} className="my-4 space-y-2 pl-1">{b.items.map((it, j) => (<li key={j} className="flex items-start gap-2.5 text-[15.5px] text-slate-700 leading-[1.7]"><span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 bg-[#185FA5]" /><span>{it}</span></li>))}</ul>;
        if (b.kind === "ol") return <ol key={i} className="my-4 space-y-2 pl-1 list-decimal list-inside">{b.items.map((it, j) => (<li key={j} className="text-[15.5px] text-slate-700 leading-[1.7]">{it}</li>))}</ol>;
        if (b.kind === "pre") return <pre key={i} className="my-5 p-4 rounded-xl bg-[#0B1B2B] text-[#E6F1FB] text-[12.5px] leading-relaxed overflow-x-auto"><code>{b.text}</code></pre>;
        return null;
      })}
    </div>
  );
}

/* --------------------------------------------------------------------- */
/*  Meta                                                                  */
/* --------------------------------------------------------------------- */

function setHead(title: string, description: string, canonical: string, jsonLd?: object[]) {
  if (typeof document === "undefined") return;
  document.title = title;
  const setMeta = (sel: string, attr: "name" | "property", key: string, value: string) => {
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", value);
  };
  setMeta("meta[name='description']", "name", "description", description);
  setMeta("meta[property='og:title']", "property", "og:title", title);
  setMeta("meta[property='og:description']", "property", "og:description", description);
  setMeta("meta[property='og:type']", "property", "og:type", "article");
  setMeta("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
  // canonical
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = canonical;
  // remove old jsonLd
  document.querySelectorAll("script[data-docs-jsonld]").forEach((n) => n.parentElement?.removeChild(n));
  if (jsonLd && jsonLd.length) {
    for (const obj of jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-docs-jsonld", "1");
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
    }
  }
  if (!document.getElementById("tya-fonts")) {
    const l = document.createElement("link");
    l.id = "tya-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }
}

/* --------------------------------------------------------------------- */
/*  Index page                                                            */
/* --------------------------------------------------------------------- */

function DocsIndex() {
  useEffect(() => {
    setHead(
      "Docs — TrainYourAgent",
      "Help center for TrainYourAgent. Getting started, voice agents, chat agents, and integration guides.",
      "https://trainyouragent.com/docs",
      [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://trainyouragent.com/" },
            { "@type": "ListItem", position: 2, name: "Docs", item: "https://trainyouragent.com/docs" },
          ],
        },
      ],
    );
  }, []);

  const grouped = docsBySection();

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Docs · Help center</div>
          <h1 className="text-[40px] sm:text-[64px] leading-[1.02] font-semibold text-[#042C53] tracking-tight">
            How TrainYourAgent <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually works.</span>
          </h1>
          <p className="mt-5 text-[17px] sm:text-[18px] text-slate-700 max-w-2xl leading-relaxed">
            Twelve docs across four sections. Plain language. No marketing copy disguised as documentation.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          {SECTIONS.map((s) => (
            <div key={s.key} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.06)]">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">{s.key}</div>
              <div className="text-[14.5px] text-slate-600 mb-4 leading-relaxed">{s.description}</div>
              <ul className="space-y-3">
                {(grouped[s.key] || []).map((d) => (
                  <li key={d.slug}>
                    <Link to={`/docs/${d.slug}`} className="group block">
                      <div className="text-[16px] font-semibold text-[#042C53] group-hover:text-[#185FA5] transition-colors">{d.title}</div>
                      <div className="text-[13px] text-slate-500 leading-snug mt-0.5">{d.summary}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-14 bg-[#F6FAFE] border-t border-slate-200/70">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-[#042C53] mb-3">Did not find what you needed?</h2>
          <p className="text-[15px] text-slate-700 leading-relaxed mb-5">Email <a className="underline" href="mailto:alexander@trainyouragent.com">alexander@trainyouragent.com</a> and we will write the missing doc.</p>
          <Link to="/contact" className="inline-block px-6 py-3 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E]">Contact us →</Link>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}

/* --------------------------------------------------------------------- */
/*  Single doc page                                                       */
/* --------------------------------------------------------------------- */

function DocPage({ doc }: { doc: Doc }) {
  const blocks = useMemo(() => parseBody(doc.body), [doc.body]);
  const toc = useMemo(() => blocks.filter((b) => b.kind === "h2" || b.kind === "h3") as Array<{ kind: "h2" | "h3"; text: string; id: string }>, [blocks]);

  useEffect(() => {
    const url = `https://trainyouragent.com/docs/${doc.slug}`;
    setHead(
      `${doc.title} — TrainYourAgent docs`,
      doc.summary,
      url,
      [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: doc.title,
          description: doc.summary,
          mainEntityOfPage: url,
          author: { "@type": "Organization", name: "TrainYourAgent" },
          publisher: { "@type": "Organization", name: "TrainYourAgent" },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://trainyouragent.com/" },
            { "@type": "ListItem", position: 2, name: "Docs", item: "https://trainyouragent.com/docs" },
            { "@type": "ListItem", position: 3, name: doc.section, item: "https://trainyouragent.com/docs" },
            { "@type": "ListItem", position: 4, name: doc.title, item: url },
          ],
        },
      ],
    );
  }, [doc]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="pt-28 pb-8 px-5 sm:px-8 border-b border-slate-200/70 bg-[#F6FAFE]/60">
        <div className="max-w-5xl mx-auto">
          <nav className="text-[12.5px] text-slate-600 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#042C53]">Home</Link>
            <span className="mx-2 text-slate-400">/</span>
            <Link to="/docs" className="hover:text-[#042C53]">Docs</Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-700">{doc.section}</span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-[#042C53] font-medium">{doc.title}</span>
          </nav>
          <h1 className="text-[30px] sm:text-[44px] leading-[1.1] font-semibold text-[#042C53] tracking-tight">{doc.title}</h1>
          <p className="mt-3 text-[15px] sm:text-[16px] text-slate-700 max-w-3xl leading-relaxed">{doc.summary}</p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12">
          <article className="min-w-0">
            <RenderedBody blocks={blocks} />
            <FeedbackBlock slug={doc.slug} />
            <NextPrev doc={doc} />
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">On this page</div>
              <ul className="space-y-2 border-l border-slate-200 pl-4">
                {toc.map((h) => (
                  <li key={h.id} className={h.kind === "h3" ? "pl-3" : ""}>
                    <a href={`#${h.id}`} className="text-[13px] text-slate-600 hover:text-[#042C53] block leading-snug">{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}

function FeedbackBlock({ slug }: { slug: string }) {
  const [sent, setSent] = useState<"helpful" | "not" | null>(null);
  const [busy, setBusy] = useState(false);
  async function send(helpful: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withAttribution({
          email: "anonymous-docs-feedback@trainyouragent.com",
          source: "docs-feedback",
          path: typeof window !== "undefined" ? window.location.pathname : `/docs/${slug}`,
          payload: { slug, helpful },
          website: "", hp: "",
        })),
      });
    } catch { /* swallow */ }
    setSent(helpful ? "helpful" : "not");
    setBusy(false);
  }
  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="text-[13px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">Was this helpful?</div>
      {sent ? (
        <div className="text-[14px] text-slate-700">
          {sent === "helpful" ? "Thanks — we will keep this one in the index." : "Got it. We will revisit this doc and tighten it up."}
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => send(true)} disabled={busy} className="px-4 py-2 rounded-xl bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60">Yes</button>
          <button onClick={() => send(false)} disabled={busy} className="px-4 py-2 rounded-xl bg-white text-[#042C53] text-[13px] font-semibold border border-slate-300 hover:border-[#042C53] disabled:opacity-60">No</button>
        </div>
      )}
    </div>
  );
}

function NextPrev({ doc }: { doc: Doc }) {
  const idx = DOCS.findIndex((d) => d.slug === doc.slug);
  const prev = idx > 0 ? DOCS[idx - 1] : null;
  const next = idx < DOCS.length - 1 ? DOCS[idx + 1] : null;
  return (
    <div className="mt-10 grid sm:grid-cols-2 gap-4">
      {prev ? (
        <Link to={`/docs/${prev.slug}`} className="rounded-2xl border border-slate-200 p-5 hover:border-[#185FA5] block">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Previous</div>
          <div className="text-[15px] font-semibold text-[#042C53]">{prev.title}</div>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={`/docs/${next.slug}`} className="rounded-2xl border border-slate-200 p-5 hover:border-[#185FA5] block sm:text-right">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Next</div>
          <div className="text-[15px] font-semibold text-[#042C53]">{next.title}</div>
        </Link>
      ) : <span />}
    </div>
  );
}

/* --------------------------------------------------------------------- */
/*  Router                                                                */
/* --------------------------------------------------------------------- */

export default function DocsPage() {
  const { slug } = useParams<{ slug?: string }>();
  if (!slug) return <DocsIndex />;
  const doc = DOCS_BY_SLUG[slug];
  if (!doc) {
    return (
      <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        <SiteNav active="resources" />
        <div className="max-w-3xl mx-auto pt-32 pb-24 px-5 text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">404 · Doc not found</div>
          <h1 className="text-[36px] font-semibold text-[#042C53] mb-3">That doc does not exist (yet).</h1>
          <p className="text-[15px] text-slate-700 mb-6">Browse the full index or email us with what you were looking for.</p>
          <Link to="/docs" className="inline-block px-6 py-3 rounded-2xl bg-[#042C53] text-white text-[14px] font-semibold">All docs →</Link>
        </div>
        <FooterV44 />
      </div>
    );
  }
  return <DocPage doc={doc} />;
}
