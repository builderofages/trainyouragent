// api/buyers-guide-pdf.ts — Vercel serverless function (Node runtime).
//
// Generates a branded PDF of "The AI Voice Buyer's Guide" on demand. Pulls
// the body from public/buyers-guide.md so we maintain one source of truth.
//
// NOTE on runtime: this endpoint runs on the **Node runtime**, not edge.
// `jspdf` and `fs/promises` aren't available in Vercel's edge isolates.
// If we ever need this on edge, switch to a pre-rendered PDF (see
// scripts/build-buyers-guide-pdf.mjs which can be wired into the build to
// produce public/buyers-guide.pdf at deploy time).
//
// REQUIRES env: none (the public markdown source ships with the build).
//
// Query params:
//   ?email=...   — used only for tracking/log; the PDF body is identical
//                  across all callers, so there's no PII embedded.
//
// Response:
//   200 application/pdf — Content-Disposition: attachment.
//   400/500 application/json on error.
//
// Brand:
//   navy   #042C53
//   accent #185FA5
//   paper  #FAF7F1 (warm paper)

import { readFile } from "node:fs/promises";
import path from "node:path";
import { jsPDF } from "jspdf";

// Vercel Node serverless runtime. Don't pull in @vercel/node types — define
// the minimal request/response shape we use so we don't add a build-time dep.
type NodeReq = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
};
type NodeRes = {
  status(code: number): NodeRes;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
  send(body: Buffer | string): void;
};

export const config = { runtime: "nodejs20.x" };

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const PAPER = "#FAF7F1";
const INK = "#1A1F2C";
const MUTED = "#5C6B82";

const CTA = "cal.com/trainyouragent/30min";
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

export default async function handler(req: NodeReq, res: NodeRes) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "method" });
    return;
  }

  const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
    res.status(400).json({ ok: false, error: "bad-email" });
    return;
  }

  let md: string;
  try {
    const p = path.join(process.cwd(), "public", "buyers-guide.md");
    md = await readFile(p, "utf8");
  } catch (e) {
    console.error("[buyers-guide-pdf] failed to read source", e);
    res.status(500).json({ ok: false, error: "source-missing" });
    return;
  }

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = renderPdf(md);
  } catch (e) {
    console.error("[buyers-guide-pdf] render failed", e);
    res.status(500).json({ ok: false, error: "render-failed" });
    return;
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="The-AI-Voice-Buyers-Guide.pdf"`,
  );
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400");
  res.status(200).send(Buffer.from(pdfBytes));
}

// --- Renderer ---------------------------------------------------------------

type Block =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "li"; text: string; ordered?: boolean; index?: number }
  | { kind: "hr" }
  | { kind: "em"; text: string };

function parseMarkdown(md: string): Block[] {
  const lines = md.split(/\r?\n/);
  const blocks: Block[] = [];
  let listIndex = 0;
  let buf: string[] = [];

  const flushPara = () => {
    if (!buf.length) return;
    const text = buf.join(" ").trim();
    if (text) blocks.push({ kind: "p", text });
    buf = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) { flushPara(); listIndex = 0; continue; }
    if (/^---+$/.test(line.trim())) { flushPara(); listIndex = 0; blocks.push({ kind: "hr" }); continue; }

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^#\s+(.*)$/))) { flushPara(); blocks.push({ kind: "h1", text: m[1] }); continue; }
    if ((m = line.match(/^##\s+(.*)$/))) { flushPara(); blocks.push({ kind: "h2", text: m[1] }); continue; }
    if ((m = line.match(/^###\s+(.*)$/))) { flushPara(); blocks.push({ kind: "h3", text: m[1] }); continue; }
    if ((m = line.match(/^(\d+)\.\s+(.*)$/))) {
      flushPara();
      listIndex = parseInt(m[1], 10);
      blocks.push({ kind: "li", text: m[2], ordered: true, index: listIndex });
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) { flushPara(); blocks.push({ kind: "li", text: m[1] }); continue; }
    if (/^\*[^*]+\*$/.test(line.trim())) {
      flushPara();
      blocks.push({ kind: "em", text: line.trim().slice(1, -1) });
      continue;
    }
    buf.push(line.trim());
  }
  flushPara();
  return blocks;
}

// Strip markdown emphasis/links for plain rendering, keep readable text.
function stripInline(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
}

function renderPdf(md: string): Uint8Array {
  const blocks = parseMarkdown(md);
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56; // margin
  const CONTENT_W = W - M * 2;

  // ---- Cover page --------------------------------------------------------
  paintBackground(doc, W, H);

  // Logo block — simple "Prism Node" geometric mark + wordmark in navy.
  drawPrismLogo(doc, M, M, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(NAVY);
  doc.text("PRISM NODE", M + 44, M + 22);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(NAVY);
  doc.text("The AI Voice", M, H * 0.42);
  doc.text("Buyer's Guide", M, H * 0.42 + 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(MUTED);
  const sub = "What to look for, what to refuse to pay for, and the seven\nquestions every vendor dodges.";
  sub.split("\n").forEach((ln, i) => doc.text(ln, M, H * 0.42 + 80 + i * 18));

  doc.setFontSize(10);
  doc.setTextColor(NAVY);
  doc.text("By the team at TrainYourAgent  ·  Tampa Bay, FL  ·  2026 edition", M, H - M - 40);

  // Cover footer line
  doc.setDrawColor(ACCENT);
  doc.setLineWidth(1.2);
  doc.line(M, H - M - 22, W - M, H - M - 22);
  doc.setFontSize(10);
  doc.setTextColor(ACCENT);
  doc.text(CTA, M, H - M - 6);

  // ---- Table of contents -------------------------------------------------
  doc.addPage();
  paintBackground(doc, W, H);
  drawHeaderBar(doc, W, M);
  let y = M + 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(NAVY);
  doc.text("Table of contents", M, y);
  y += 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(INK);
  const tocItems = blocks
    .filter(b => b.kind === "h2" || b.kind === "h1")
    .filter(b => !/Table of contents/i.test((b as any).text))
    .map(b => stripInline((b as any).text));
  // Dedupe
  const seen = new Set<string>();
  const uniqueToc = tocItems.filter(t => (seen.has(t) ? false : (seen.add(t), true)));
  uniqueToc.forEach((t, i) => {
    doc.text(`${String(i + 1).padStart(2, "0")}.  ${t}`, M, y);
    y += 20;
  });
  drawFooter(doc, W, H, M);

  // ---- Body --------------------------------------------------------------
  doc.addPage();
  paintBackground(doc, W, H);
  drawHeaderBar(doc, W, M);
  y = M + 50;

  const ensureSpace = (need: number) => {
    if (y + need > H - M - 40) {
      drawFooter(doc, W, H, M);
      doc.addPage();
      paintBackground(doc, W, H);
      drawHeaderBar(doc, W, M);
      y = M + 50;
    }
  };

  for (const b of blocks) {
    switch (b.kind) {
      case "h1": {
        ensureSpace(48);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(NAVY);
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W);
        lines.forEach((ln: string) => { doc.text(ln, M, y); y += 28; });
        y += 8;
        break;
      }
      case "h2": {
        ensureSpace(40);
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(17);
        doc.setTextColor(NAVY);
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W);
        lines.forEach((ln: string) => { doc.text(ln, M, y); y += 22; });
        // accent underline
        doc.setDrawColor(ACCENT);
        doc.setLineWidth(0.8);
        doc.line(M, y - 16, M + 32, y - 16);
        y += 6;
        break;
      }
      case "h3": {
        ensureSpace(28);
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(ACCENT);
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W);
        lines.forEach((ln: string) => { doc.text(ln, M, y); y += 18; });
        y += 2;
        break;
      }
      case "p": {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(INK);
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W);
        for (const ln of lines) { ensureSpace(16); doc.text(ln, M, y); y += 15; }
        y += 6;
        break;
      }
      case "li": {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(INK);
        const bullet = b.ordered ? `${b.index ?? "•"}.` : "•";
        const indent = 18;
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W - indent);
        ensureSpace(16);
        doc.setTextColor(ACCENT);
        doc.text(bullet, M, y);
        doc.setTextColor(INK);
        lines.forEach((ln: string, i: number) => {
          if (i > 0) ensureSpace(15);
          doc.text(ln, M + indent, y);
          y += 15;
        });
        y += 2;
        break;
      }
      case "em": {
        ensureSpace(20);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(MUTED);
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W);
        lines.forEach((ln: string) => { doc.text(ln, M, y); y += 14; });
        y += 6;
        break;
      }
      case "hr": {
        ensureSpace(20);
        doc.setDrawColor(MUTED);
        doc.setLineWidth(0.4);
        doc.line(M, y, W - M, y);
        y += 16;
        break;
      }
    }
  }

  drawFooter(doc, W, H, M);

  // jsPDF returns an ArrayBuffer when output("arraybuffer") is called.
  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}

function paintBackground(doc: jsPDF, W: number, H: number) {
  doc.setFillColor(PAPER);
  doc.rect(0, 0, W, H, "F");
}

function drawHeaderBar(doc: jsPDF, W: number, M: number) {
  doc.setFillColor(NAVY);
  doc.rect(0, 0, W, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(NAVY);
  doc.text("THE AI VOICE BUYER'S GUIDE", M, 26);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED);
  doc.text("TrainYourAgent · 2026", W - M, 26, { align: "right" });
}

function drawFooter(doc: jsPDF, W: number, H: number, M: number) {
  doc.setDrawColor(ACCENT);
  doc.setLineWidth(0.6);
  doc.line(M, H - M - 18, W - M, H - M - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(ACCENT);
  doc.text(`Book a 30-min scoping call: ${CTA}`, M, H - M - 4);
  const pageNo = doc.getNumberOfPages();
  doc.setTextColor(MUTED);
  doc.text(String(pageNo), W - M, H - M - 4, { align: "right" });
}

// A small geometric "prism" mark — three triangles forming a rotated cube
// silhouette. Not pixel-perfect to a brand asset, just a tasteful placeholder
// that reads as a logo on the cover.
function drawPrismLogo(doc: jsPDF, x: number, y: number, size: number) {
  const s = size;
  doc.setFillColor(NAVY);
  doc.triangle(x, y + s, x + s / 2, y, x + s, y + s, "F");
  doc.setFillColor(ACCENT);
  doc.triangle(x + s / 2, y, x + s, y + s, x + s / 2, y + s * 0.55, "F");
}
