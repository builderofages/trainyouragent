// scripts/build-buyers-guide-pdf.mjs
//
// Pre-renders public/buyers-guide.md into a static public/buyers-guide.pdf so
// the file is available even when the on-demand /api/buyers-guide-pdf endpoint
// is rate-limited or cold. Same renderer logic as api/buyers-guide-pdf.ts.
//
// Run:  node scripts/build-buyers-guide-pdf.mjs
// Hook into vercel build by adding to package.json scripts:
//   "build": "node scripts/build-buyers-guide-pdf.mjs && vite build"

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const PAPER = "#FAF7F1";
const INK = "#1A1F2C";
const MUTED = "#5C6B82";
const CTA = "cal.com/trainyouragent/30min";

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let buf = [];
  let listIndex = 0;
  const flushPara = () => {
    if (!buf.length) return;
    const text = buf.join(" ").trim();
    if (text) blocks.push({ kind: "p", text });
    buf = [];
  };
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) { flushPara(); listIndex = 0; continue; }
    if (/^---+$/.test(line.trim())) { flushPara(); blocks.push({ kind: "hr" }); continue; }
    let m;
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

function stripInline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
}

function paintBackground(doc, W, H) {
  doc.setFillColor(PAPER);
  doc.rect(0, 0, W, H, "F");
}

function drawHeaderBar(doc, W, M) {
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

function drawFooter(doc, W, H, M) {
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

function drawPrismLogo(doc, x, y, size) {
  const s = size;
  doc.setFillColor(NAVY);
  doc.triangle(x, y + s, x + s / 2, y, x + s, y + s, "F");
  doc.setFillColor(ACCENT);
  doc.triangle(x + s / 2, y, x + s, y + s, x + s / 2, y + s * 0.55, "F");
}

function renderPdf(md) {
  const blocks = parseMarkdown(md);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const CONTENT_W = W - M * 2;

  paintBackground(doc, W, H);
  drawPrismLogo(doc, M, M, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(NAVY);
  doc.text("PRISM NODE", M + 44, M + 22);
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
  doc.setDrawColor(ACCENT);
  doc.setLineWidth(1.2);
  doc.line(M, H - M - 22, W - M, H - M - 22);
  doc.setFontSize(10);
  doc.setTextColor(ACCENT);
  doc.text(CTA, M, H - M - 6);

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
    .map(b => stripInline(b.text));
  const seen = new Set();
  const uniqueToc = tocItems.filter(t => seen.has(t) ? false : (seen.add(t), true));
  uniqueToc.forEach((t, i) => {
    doc.text(`${String(i + 1).padStart(2, "0")}.  ${t}`, M, y);
    y += 20;
  });
  drawFooter(doc, W, H, M);

  doc.addPage();
  paintBackground(doc, W, H);
  drawHeaderBar(doc, W, M);
  y = M + 50;

  const ensureSpace = (need) => {
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
        doc.splitTextToSize(stripInline(b.text), CONTENT_W).forEach(ln => { doc.text(ln, M, y); y += 28; });
        y += 8; break;
      }
      case "h2": {
        ensureSpace(40); y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(17);
        doc.setTextColor(NAVY);
        doc.splitTextToSize(stripInline(b.text), CONTENT_W).forEach(ln => { doc.text(ln, M, y); y += 22; });
        doc.setDrawColor(ACCENT); doc.setLineWidth(0.8);
        doc.line(M, y - 16, M + 32, y - 16);
        y += 6; break;
      }
      case "h3": {
        ensureSpace(28); y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(ACCENT);
        doc.splitTextToSize(stripInline(b.text), CONTENT_W).forEach(ln => { doc.text(ln, M, y); y += 18; });
        y += 2; break;
      }
      case "p": {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(INK);
        for (const ln of doc.splitTextToSize(stripInline(b.text), CONTENT_W)) {
          ensureSpace(16); doc.text(ln, M, y); y += 15;
        }
        y += 6; break;
      }
      case "li": {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(INK);
        const bullet = b.ordered ? `${b.index ?? "•"}.` : "•";
        const indent = 18;
        const lines = doc.splitTextToSize(stripInline(b.text), CONTENT_W - indent);
        ensureSpace(16);
        doc.setTextColor(ACCENT); doc.text(bullet, M, y);
        doc.setTextColor(INK);
        lines.forEach((ln, i) => {
          if (i > 0) ensureSpace(15);
          doc.text(ln, M + indent, y); y += 15;
        });
        y += 2; break;
      }
      case "em": {
        ensureSpace(20);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(MUTED);
        doc.splitTextToSize(stripInline(b.text), CONTENT_W).forEach(ln => { doc.text(ln, M, y); y += 14; });
        y += 6; break;
      }
      case "hr": {
        ensureSpace(20);
        doc.setDrawColor(MUTED); doc.setLineWidth(0.4);
        doc.line(M, y, W - M, y);
        y += 16; break;
      }
    }
  }

  drawFooter(doc, W, H, M);
  return new Uint8Array(doc.output("arraybuffer"));
}

const md = await readFile(path.join(ROOT, "public", "buyers-guide.md"), "utf8");
const bytes = renderPdf(md);
const out = path.join(ROOT, "public", "buyers-guide.pdf");
await writeFile(out, bytes);
console.log(`[buyers-guide] wrote ${out} (${bytes.length} bytes)`);
