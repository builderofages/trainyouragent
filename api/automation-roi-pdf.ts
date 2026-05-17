// api/automation-roi-pdf.ts — v44
// Node runtime PDF generator for the Automation ROI tool.
// Same brand language as buyers-guide-pdf.ts.

import { jsPDF } from "jspdf";

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

export const config = { runtime: "nodejs" };

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const PAPER = "#FAF7F1";
const INK = "#1A1F2C";
const MUTED = "#5C6B82";
const CTA = "cal.com/trainyouragent/30min";

const TYA_PLAN_MONTHLY = 5000;
const HOURS_PER_YEAR_FTE = 2080;

function n(q: NodeReq["query"], key: string, dflt: number): number {
  const v = q[key];
  if (typeof v !== "string") return dflt;
  const f = parseFloat(v);
  return Number.isFinite(f) ? f : dflt;
}

export default async function handler(req: NodeReq, res: NodeRes) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "method" });
    return;
  }

  const employees = Math.max(0, n(req.query, "employees", 8));
  const salary    = Math.max(0, n(req.query, "salary", 72000));
  const hours     = Math.max(0, n(req.query, "hours", 10));
  const autoPct   = Math.min(100, Math.max(0, n(req.query, "auto", 60)));

  const hourly = salary / HOURS_PER_YEAR_FTE;
  const weeklyHoursSaved = employees * hours * (autoPct / 100);
  const monthlyHoursSaved = weeklyHoursSaved * 4.33;
  const monthlySavings = monthlyHoursSaved * hourly;
  const annualSavings = monthlySavings * 12;
  const tyaAnnual = TYA_PLAN_MONTHLY * 12;
  const netYr1 = annualSavings - tyaAnnual;
  const threeYrNet = netYr1 * 3;
  const roiPct = tyaAnnual === 0 ? 0 : Math.round((netYr1 / tyaAnnual) * 100);

  let pdf: Uint8Array;
  try {
    pdf = renderPdf({
      employees, salary, hours, autoPct,
      hourly, monthlyHoursSaved, monthlySavings, annualSavings,
      tyaAnnual, netYr1, threeYrNet, roiPct,
    });
  } catch (e) {
    console.error("[automation-roi-pdf] render failed", e);
    res.status(500).json({ ok: false, error: "render-failed" });
    return;
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="Automation-ROI-Report.pdf"`,
  );
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.status(200).send(Buffer.from(pdf));
}

type RenderInput = {
  employees: number; salary: number; hours: number; autoPct: number;
  hourly: number; monthlyHoursSaved: number; monthlySavings: number; annualSavings: number;
  tyaAnnual: number; netYr1: number; threeYrNet: number; roiPct: number;
};

function fmtMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}
function fmtNum(n: number): string {
  return Math.round(n).toLocaleString();
}

function renderPdf(d: RenderInput): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const CONTENT_W = W - M * 2;

  // ---- Cover ----
  paintBackground(doc, W, H);
  drawPrism(doc, M, M, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(NAVY);
  doc.text("TRAINYOURAGENT", M + 40, M + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(NAVY);
  doc.text("Automation ROI", M, H * 0.38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(22);
  doc.setTextColor(ACCENT);
  doc.text("Personalized report", M, H * 0.38 + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(MUTED);
  doc.text(
    `Built for: ${d.employees} employees · ${fmtMoney(d.salary)} avg salary · ${d.hours} hrs/wk · ${d.autoPct}% automation`,
    M,
    H * 0.38 + 60,
  );

  doc.setDrawColor(ACCENT);
  doc.setLineWidth(1);
  doc.line(M, H - M - 20, W - M, H - M - 20);
  doc.setFontSize(10);
  doc.setTextColor(ACCENT);
  doc.text(CTA, M, H - M - 6);

  // ---- Page 2: headline numbers ----
  doc.addPage();
  paintBackground(doc, W, H);
  headerBar(doc, W, M);
  let y = M + 60;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(NAVY);
  doc.text("The headline", M, y); y += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(INK);
  const intro = doc.splitTextToSize(
    `Based on your inputs, automating this work with TrainYourAgent saves your team ${fmtNum(d.monthlyHoursSaved)} hours per month — worth ${fmtMoney(d.annualSavings)} per year in reclaimed payroll.`,
    CONTENT_W,
  );
  intro.forEach((ln: string) => { doc.text(ln, M, y); y += 18; });
  y += 12;

  // KPI cards
  const cardW = (CONTENT_W - 16) / 3;
  drawKpiCard(doc, M,                    y, cardW, "MONTHLY HOURS SAVED",  fmtNum(d.monthlyHoursSaved), "hrs / month");
  drawKpiCard(doc, M + cardW + 8,        y, cardW, "ANNUAL LABOR SAVINGS", fmtMoney(d.annualSavings),   "year 1 steady state");
  drawKpiCard(doc, M + (cardW + 8) * 2,  y, cardW, "YEAR-1 NET",           fmtMoney(d.netYr1),          `after ${fmtMoney(d.tyaAnnual)} TYA cost`);
  y += 110;

  // Big ROI block
  doc.setFillColor(NAVY);
  doc.roundedRect(M, y, CONTENT_W, 80, 8, 8, "F");
  doc.setTextColor("#9BC3E8");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("3-YEAR ROI", M + 18, y + 22);
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(28);
  doc.text(`${d.roiPct}%  ·  ${fmtMoney(d.threeYrNet)} net`, M + 18, y + 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#BDDAF4");
  doc.text(`Assumes $${TYA_PLAN_MONTHLY.toLocaleString()}/mo TYA plan, sustained for 3 years, month-1 ramp.`, M + 18, y + 70);
  y += 100;

  // Inputs recap
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(NAVY);
  doc.text("Your inputs", M, y); y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(INK);
  [
    `Employees doing this work:  ${d.employees}`,
    `Average salary:             ${fmtMoney(d.salary)} / yr  (≈ ${fmtMoney(d.hourly)}/hr)`,
    `Hours / week per employee:  ${d.hours}`,
    `Projected automation %:     ${d.autoPct}%`,
  ].forEach((ln) => { doc.text(ln, M, y); y += 16; });

  footer(doc, W, H, M);

  // ---- Page 3: what to do next ----
  doc.addPage();
  paintBackground(doc, W, H);
  headerBar(doc, W, M);
  y = M + 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(NAVY);
  doc.text("What to do with this number", M, y); y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(INK);
  const blocks = [
    {
      h: "1. Take it to your CFO this week.",
      p: "Don't sit on this. The annual labor savings number above is the number that gets a project funded. Pair it with one anecdote about a specific employee who'd benefit and you have a 5-minute pitch.",
    },
    {
      h: "2. Validate the automation % with a pilot.",
      p: "Our standard pilot runs 14 days on a single workflow. We measure exactly how much of the current work the agent absorbs vs your stated assumption. You get the real number before committing.",
    },
    {
      h: "3. Calibrate quarterly.",
      p: "ROI compounds. Quarter 1 might land at 70% of the projection because of change management. Quarter 4 typically blows past the projection because adoption widens.",
    },
    {
      h: "4. Book a 30-minute working session.",
      p: `We'll show you exactly what an agent for your specific workflow looks like, and a 7-day rollout plan. ${CTA}`,
    },
  ];
  for (const b of blocks) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(NAVY);
    doc.text(b.h, M, y); y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);
    doc.setTextColor(INK);
    const lines = doc.splitTextToSize(b.p, CONTENT_W);
    lines.forEach((ln: string) => { doc.text(ln, M, y); y += 15; });
    y += 8;
  }

  footer(doc, W, H, M);

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

function paintBackground(doc: jsPDF, W: number, H: number) {
  doc.setFillColor(PAPER);
  doc.rect(0, 0, W, H, "F");
}
function headerBar(doc: jsPDF, W: number, M: number) {
  doc.setDrawColor(ACCENT);
  doc.setLineWidth(0.6);
  doc.line(M, M + 30, W - M, M + 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(ACCENT);
  doc.text("TRAINYOURAGENT · AUTOMATION ROI REPORT", M, M + 22);
}
function footer(doc: jsPDF, W: number, H: number, M: number) {
  doc.setDrawColor("#E2E8F0");
  doc.setLineWidth(0.5);
  doc.line(M, H - M - 18, W - M, H - M - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text("trainyouragent.com · book at cal.com/trainyouragent/30min", M, H - M - 4);
}
function drawPrism(doc: jsPDF, x: number, y: number, size: number) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;
  doc.setDrawColor(NAVY);
  doc.setLineWidth(2);
  doc.lines(
    [
      [r, -r], [r, r], [-r, r], [-r, -r],
    ],
    cx - r,
    cy,
    [1, 1],
    "S",
    true,
  );
  doc.setLineWidth(1.2);
  doc.line(cx, cy - r, cx, cy + r);
  doc.line(cx - r, cy, cx + r, cy);
  doc.setFillColor(NAVY);
  doc.circle(cx, cy, 1.6, "F");
}
function drawKpiCard(doc: jsPDF, x: number, y: number, w: number, label: string, value: string, sub: string) {
  doc.setFillColor("#FFFFFF");
  doc.setDrawColor("#E2E8F0");
  doc.roundedRect(x, y, w, 96, 6, 6, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED);
  doc.text(label, x + 14, y + 22);
  doc.setFontSize(20);
  doc.setTextColor(NAVY);
  doc.text(value, x + 14, y + 56);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(sub, x + 14, y + 80);
}
