/**
 * Generates the French copy-review deliverable for the client:
 *
 *   docs/client-review/sbai-site-copy-review.pdf   (print, hand annotation)
 *   docs/client-review/sbai-site-copy-review.docx  (Word, Track Changes)
 *   scripts/output/copy-review.html                (source, for regeneration)
 *
 * Run with:  node scripts/generate-copy-review.mjs
 *
 * The content model lives in scripts/copy-model.mjs and reads messages/fr.json,
 * so the deliverable can be regenerated verbatim after any copy change.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TabStopType,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { pages, rowText, coverage } from "./copy-model.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs", "client-review");
const htmlDir = join(root, "scripts", "output");
mkdirSync(outDir, { recursive: true });
mkdirSync(htmlDir, { recursive: true });

const SITE_URL = "sbai-abdelhai.vercel.app";
const DOC_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

const b64 = (p) => readFileSync(join(root, p)).toString("base64");
const FONT_REGULAR = b64("scripts/fonts/ebgaramond-regular.ttf");
const FONT_ITALIC = b64("scripts/fonts/ebgaramond-italic.ttf");
const FONT_SEMIBOLD = b64("scripts/fonts/ebgaramond-semibold.ttf");
const FONT_MARCELLUS = b64("public/fonts/marcellus.woff2");
const LOGO_PATH = join(root, "public", "logo", "sbai-mono-charcoal.png");
const LOGO_B64 = b64("public/logo/sbai-mono-charcoal.png");

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

const esc = (t) =>
  String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Real line breaks for the \n that live inside some JSON strings. */
const withBreaks = (t) => esc(t).replace(/\n/g, "<br />");

const slug = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * One table per section. A section holding at least one paragraph gets the
 * wide "Texte actuel" column; a section of labels and CTAs stays compact.
 * Paragraph rows are italic and taller whatever the table they sit in.
 */
const hasLong = (rows) => rows.some((r) => r.long);

function tableHtml(rows) {
  const cls = hasLong(rows) ? "t-long" : "t-short";
  const body = rows
    .map((row) => {
      const note = row.note ? `<span class="note">${esc(row.note)}</span>` : "";
      const text = row.long
        ? `<em>${withBreaks(rowText(row))}</em>`
        : withBreaks(rowText(row));
      return `<tr class="${row.long ? "r-long" : "r-short"}">
        <td class="c-el">${esc(row.el)}${note}</td>
        <td class="c-txt">${text}</td>
        <td class="c-mod"></td>
      </tr>`;
    })
    .join("\n");

  return `<table class="${cls}">
    <thead><tr><th>Élément</th><th>Texte actuel</th><th>Modifications</th></tr></thead>
    <tbody>${body}</tbody>
  </table>`;
}

function pageHtml(page) {
  const sections = page.sections
    .map((section) => {
      const note = section.note
        ? `<p class="section-note">${esc(section.note)}</p>`
        : "";
      return `<div class="section">
        <p class="section-label">Section&nbsp;: ${esc(section.name)}</p>
        ${note}
        ${tableHtml(section.rows)}
      </div>`;
    })
    .join("\n");

  return `<section class="page" id="${slug(page.title)}">
    <h1>${esc(page.title)}</h1>
    <p class="page-url">${esc(page.url)}</p>
    ${page.intro ? `<p class="page-intro">${esc(page.intro)}</p>` : ""}
    ${sections}
  </section>`;
}

function buildHtml() {
  const toc = pages
    .map(
      (p) =>
        `<li><span class="toc-title">${esc(p.title)}</span><span class="toc-url">${esc(p.url)}</span></li>`,
    )
    .join("\n");

  const lines = Array.from({ length: 16 }, () => `<div class="wline"></div>`).join(
    "\n",
  );

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>SBAI Immobilier — Révision des textes du site web</title>
<style>
@font-face { font-family: "EB Garamond"; font-style: normal; font-weight: 400;
  src: url(data:font/ttf;base64,${FONT_REGULAR}) format("truetype"); }
@font-face { font-family: "EB Garamond"; font-style: italic; font-weight: 400;
  src: url(data:font/ttf;base64,${FONT_ITALIC}) format("truetype"); }
@font-face { font-family: "EB Garamond"; font-style: normal; font-weight: 600;
  src: url(data:font/ttf;base64,${FONT_SEMIBOLD}) format("truetype"); }
@font-face { font-family: "Marcellus"; font-style: normal; font-weight: 400;
  src: url(data:font/woff2;base64,${FONT_MARCELLUS}) format("woff2"); }

@page { size: A4; margin: 25mm; }

:root {
  --ink: #1c1b18;
  --muted: #6f6a5e;
  --line: #b9b4a7;
  --gold: #8a6f3c;
  --mod-bg: #f6f5f1;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "EB Garamond", Garamond, "Palatino Linotype", Georgia, serif;
  font-size: 11pt;
  line-height: 1.45;
  color: var(--ink);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ---------- cover ---------- */
.cover {
  height: 247mm;                 /* A4 height minus the 25mm margins */
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  page-break-after: always;
}
.cover img { width: 52mm; margin: 0 auto 22mm; }
.cover h1 {
  font-family: "Marcellus", "EB Garamond", serif;
  font-size: 26pt;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.25;
  margin: 0 0 10mm;
}
.cover .rule { width: 28mm; height: 1px; background: var(--gold); margin: 0 auto 10mm; }
.cover .sub { font-size: 13pt; color: var(--muted); margin: 0 0 4mm; }
.cover .note {
  font-size: 11pt; font-style: italic; color: var(--muted);
  max-width: 110mm; margin: 14mm auto 0; line-height: 1.6;
}
.cover .url {
  margin-top: 24mm; font-size: 10pt; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--gold);
}

/* ---------- table of contents ---------- */
.toc { page-break-after: always; }
.toc h2, .page h1 {
  font-family: "Marcellus", "EB Garamond", serif;
  font-weight: 400;
}
.toc h2 { font-size: 18pt; margin: 0 0 8mm; letter-spacing: 0.04em; }
.toc ol { list-style: none; counter-reset: toc; padding: 0; margin: 0; }
.toc li {
  counter-increment: toc;
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 8mm; padding: 3.2mm 0; border-bottom: 0.5pt dotted var(--line);
}
.toc li::before {
  content: counter(toc, upper-roman) ".";
  width: 12mm; color: var(--gold); font-size: 10pt; flex: none;
}
.toc .toc-title { flex: 1; font-size: 12pt; }
.toc .toc-url { font-size: 9pt; color: var(--muted); text-align: right; max-width: 70mm; }
.toc .hint {
  margin-top: 10mm; font-size: 10pt; font-style: italic; color: var(--muted);
  line-height: 1.6;
}

/* ---------- page sections ---------- */
.page { page-break-before: always; }
.page h1 {
  font-size: 18pt; text-transform: uppercase; letter-spacing: 0.08em;
  margin: 0 0 2mm; color: var(--ink);
}
.page-url {
  font-size: 10pt; color: var(--gold); margin: 0 0 6mm;
  padding-bottom: 3mm; border-bottom: 0.5pt solid var(--line);
}
.page-intro {
  font-size: 10.5pt; font-style: italic; color: var(--muted);
  margin: 0 0 7mm; line-height: 1.6;
}

.section { margin-bottom: 4mm; }
.section-label {
  font-size: 9pt; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); margin: 0 0 2mm;
  page-break-after: avoid;
}
.section-note {
  font-size: 9.5pt; font-style: italic; color: var(--muted); margin: 0 0 2mm;
  page-break-after: avoid;
}

/* ---------- tables ---------- */
table {
  width: 100%; border-collapse: collapse; margin: 0;
  page-break-inside: auto;
}
th, td {
  border: 0.5pt solid var(--line);
  padding: 1.5mm 2.2mm;
  vertical-align: top;
  font-size: 9.5pt;
  line-height: 1.42;
}
th {
  font-size: 8.5pt; letter-spacing: 0.09em; text-transform: uppercase;
  font-weight: 600; color: var(--muted); text-align: left;
  background: #efece4;
  padding: 1.2mm 2.2mm;
}
/* Label rows must never be cut in half. Paragraph rows are allowed to flow
   across a page break — forcing them whole pushed several pages of blank
   space into the document. */
.r-short { page-break-inside: avoid; }
.c-el { color: var(--muted); font-size: 9pt; }
.c-el .note {
  display: block; margin-top: 0.8mm; font-size: 8pt;
  font-style: italic; color: var(--gold); line-height: 1.3;
}
.c-mod { background: var(--mod-bg); }

.t-short th:nth-child(1), .t-short td:nth-child(1) { width: 22%; }
.t-short th:nth-child(2), .t-short td:nth-child(2) { width: 36%; }
.t-short th:nth-child(3), .t-short td:nth-child(3) { width: 42%; }

.t-long th:nth-child(1), .t-long td:nth-child(1) { width: 18%; }
.t-long th:nth-child(2), .t-long td:nth-child(2) { width: 52%; }
.t-long th:nth-child(3), .t-long td:nth-child(3) { width: 30%; }

/* ~28pt of writing room on a label row, a little more on a paragraph. */
.r-short td { height: 9.5mm; }
.r-long td { height: 11.5mm; }

/* ---------- closing pages ---------- */
.notes { page-break-before: always; }
.notes h1 {
  font-family: "Marcellus", "EB Garamond", serif; font-weight: 400;
  font-size: 18pt; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 2mm;
}
.notes .lead {
  font-size: 10.5pt; font-style: italic; color: var(--muted);
  margin: 0 0 8mm; padding-bottom: 3mm; border-bottom: 0.5pt solid var(--line);
}
.wline { border-bottom: 0.5pt solid var(--line); height: 10mm; }
.sign { margin-top: 16mm; font-size: 11pt; }
.sign p { margin: 0 0 12mm; }
</style>
</head>
<body>

<div class="cover">
  <img src="data:image/png;base64,${LOGO_B64}" alt="Logo SBAI Immobilier" />
  <h1>SBAI Immobilier<br />Révision des textes du site web</h1>
  <div class="rule"></div>
  <p class="sub">Version ${esc(DOC_DATE)} — pour révision de M. Sbai Abdelhai</p>
  <p class="note">Toutes les modifications reçues seront intégrées dans une version 2 du site.</p>
  <p class="url">${esc(SITE_URL)}</p>
</div>

<div class="toc">
  <h2>Sommaire</h2>
  <ol>${toc}</ol>
  <p class="hint">
    Chaque page du site fait l'objet d'une section. Les textes y apparaissent dans
    l'ordre où ils se lisent à l'écran, de haut en bas. La colonne
    « Modifications » vous est réservée : rature, reformulation, remarque — tout
    est utile.
  </p>
</div>

${pages.map(pageHtml).join("\n")}

<div class="notes">
  <h1>Notes générales</h1>
  <p class="lead">
    Ton, voix de la marque, mots à privilégier, mots à bannir, formulations
    récurrentes à revoir : notez ici tout ce qui dépasse une page en particulier.
  </p>
  ${lines}
  <div class="sign">
    <p>Reçu et validé le _____________________ par M. Sbai Abdelhai</p>
    <p>Signature : _________________________________________________</p>
  </div>
</div>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// PDF (Chromium print-to-PDF, cover rendered without header/footer)
// ---------------------------------------------------------------------------

const HEADER_TEMPLATE = `
<div style="width:100%;padding:0 25mm;font-family:Georgia,serif;font-size:8pt;color:#8a8578;">
  <table style="width:100%;border:0;"><tr>
    <td style="text-align:left;">SBAI Immobilier — Révision textes</td>
    <td style="text-align:right;">page <span class="pageNumber"></span>/<span class="totalPages"></span></td>
  </tr></table>
</div>`;

const FOOTER_TEMPLATE = `
<div style="width:100%;padding:0 25mm;font-family:Georgia,serif;font-size:8pt;color:#8a8578;text-align:center;">
  <span class="pageNumber"></span>
</div>`;

async function buildPdf(htmlPath, pdfPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, {
    waitUntil: "load",
  });
  await page.evaluate(() => document.fonts.ready);

  const common = {
    format: "A4",
    printBackground: true,
    margin: { top: "25mm", right: "25mm", bottom: "25mm", left: "25mm" },
  };

  const cover = await page.pdf({ ...common, pageRanges: "1" });
  const body = await page.pdf({
    ...common,
    pageRanges: "2-",
    displayHeaderFooter: true,
    headerTemplate: HEADER_TEMPLATE,
    footerTemplate: FOOTER_TEMPLATE,
  });
  await browser.close();

  const merged = await PDFDocument.create();
  for (const buf of [cover, body]) {
    const src = await PDFDocument.load(buf);
    const copied = await merged.copyPages(src, src.getPageIndices());
    copied.forEach((p) => merged.addPage(p));
  }
  merged.setTitle("SBAI Immobilier — Révision des textes du site web");
  merged.setAuthor("SBAI Abdelhai & Associés");
  merged.setSubject(`Révision des textes du site — version ${DOC_DATE}`);
  const bytes = await merged.save();
  writeFileSync(pdfPath, bytes);
  return merged.getPageCount();
}

// ---------------------------------------------------------------------------
// DOCX
// ---------------------------------------------------------------------------

const FONT = "Garamond";
const GREY = "6F6A5E";
const GOLD = "8A6F3C";
const INK = "1C1B18";
const LINE = "B9B4A7";
const TWIP_CM = 567;
const USABLE = 16 * TWIP_CM; // A4 (21cm) minus 2×2.5cm margins

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const ALL_BORDERS = {
  top: border,
  bottom: border,
  left: border,
  right: border,
  insideHorizontal: border,
  insideVertical: border,
};

const pct = (...parts) => parts.map((p) => Math.round(USABLE * p));

function cell(children, { width, shading, ...rest } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 110, right: 110 },
    verticalAlign: VerticalAlign.TOP,
    ...(shading
      ? { shading: { type: ShadingType.CLEAR, fill: shading, color: "auto" } }
      : {}),
    children,
    ...rest,
  });
}

function docxTable(rows) {
  const widths = hasLong(rows) ? pct(0.22, 0.48, 0.3) : pct(0.22, 0.36, 0.42);

  const head = new TableRow({
    tableHeader: true,
    children: ["Élément", "Texte actuel", "Modifications"].map((label, i) =>
      cell(
        [
          new Paragraph({
            spacing: { line: 240 },
            children: [
              new TextRun({
                text: label.toUpperCase(),
                font: FONT,
                size: 17,
                bold: true,
                color: GREY,
                characterSpacing: 12,
              }),
            ],
          }),
        ],
        { width: widths[i], shading: "EFECE4" },
      ),
    ),
  });

  const bodyRows = rows.map((row) => {
    const elChildren = [
      new Paragraph({
        spacing: { line: 300 },
        children: [
          new TextRun({ text: row.el, font: FONT, size: 19, color: GREY }),
        ],
      }),
    ];
    if (row.note) {
      elChildren.push(
        new Paragraph({
          spacing: { line: 260, before: 40 },
          children: [
            new TextRun({
              text: row.note,
              font: FONT,
              size: 16,
              italics: true,
              color: GOLD,
            }),
          ],
        }),
      );
    }

    // \n inside a JSON string becomes a real line break in the document.
    const paragraphs = String(rowText(row))
      .split("\n")
      .map(
        (line, i) =>
          new Paragraph({
            spacing: { line: 360, before: i ? 40 : 0 },
            children: [
              new TextRun({
                text: line,
                font: FONT,
                size: 20,
                italics: row.long,
                color: INK,
              }),
            ],
          }),
      );

    return new TableRow({
      cantSplit: true,
      // ≈30pt of writing room on a label row, a little more on a paragraph.
      height: { value: row.long ? 640 : 600, rule: "atLeast" },
      children: [
        cell(elChildren, { width: widths[0] }),
        cell(paragraphs, { width: widths[1] }),
        cell([new Paragraph({ text: "" })], {
          width: widths[2],
          shading: "F6F5F1",
        }),
      ],
    });
  });

  return new Table({
    width: { size: USABLE, type: WidthType.DXA },
    columnWidths: widths,
    borders: ALL_BORDERS,
    rows: [head, ...bodyRows],
  });
}

const para = (text, opts = {}) =>
  new Paragraph({
    alignment: opts.align,
    spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: opts.line ?? 300 },
    border: opts.border,
    pageBreakBefore: opts.pageBreakBefore,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: opts.size ?? 22,
        bold: opts.bold,
        italics: opts.italics,
        color: opts.color ?? INK,
        allCaps: opts.caps,
        characterSpacing: opts.spacing,
      }),
    ],
  });

/** Every site page starts on a fresh Word page, as in the PDF. */
function docxPage(page) {
  const out = [
    new Paragraph({
      pageBreakBefore: true,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 60, line: 300 },
      children: [
        new TextRun({
          text: page.title.toUpperCase(),
          font: FONT,
          size: 36,
          color: INK,
          characterSpacing: 24,
        }),
      ],
    }),
    para(page.url, {
      size: 20,
      color: GOLD,
      after: 200,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } },
    }),
  ];

  if (page.intro) out.push(para(page.intro, { size: 21, italics: true, color: GREY, after: 240 }));

  for (const section of page.sections) {
    out.push(
      para(`Section : ${section.name}`, {
        size: 18,
        color: GREY,
        caps: true,
        spacing: 20,
        before: 240,
        after: 80,
      }),
    );
    if (section.note)
      out.push(para(section.note, { size: 19, italics: true, color: GREY, after: 100 }));

    out.push(docxTable(section.rows));
    out.push(new Paragraph({ text: "", spacing: { after: 120 } }));
  }
  return out;
}

async function buildDocx(docxPath) {
  const contentHeader = new Header({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: USABLE }],
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "SBAI Immobilier — Révision textes",
            font: FONT,
            size: 17,
            color: GREY,
          }),
          new TextRun({ text: "\tpage ", font: FONT, size: 17, color: GREY }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 17, color: GREY }),
          new TextRun({ text: "/", font: FONT, size: 17, color: GREY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 17, color: GREY }),
        ],
      }),
    ],
  });

  const contentFooter = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 17, color: GREY }),
        ],
      }),
    ],
  });

  const pageSetup = {
    page: {
      size: { width: 11906, height: 16838 },
      margin: {
        top: 1417,
        right: 1417,
        bottom: 1417,
        left: 1417,
        header: 850,
        footer: 850,
      },
    },
  };

  // --- cover (own section: no header, no footer) ---
  const cover = {
    properties: pageSetup,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2600, after: 900 },
        children: [
          new ImageRun({
            type: "png",
            data: readFileSync(LOGO_PATH),
            transformation: { width: 190, height: 48 },
          }),
        ],
      }),
      para("SBAI IMMOBILIER", {
        align: AlignmentType.CENTER,
        size: 46,
        spacing: 30,
        after: 120,
      }),
      para("Révision des textes du site web", {
        align: AlignmentType.CENTER,
        size: 46,
        after: 400,
      }),
      para(`Version ${DOC_DATE} — pour révision de M. Sbai Abdelhai`, {
        align: AlignmentType.CENTER,
        size: 24,
        color: GREY,
        after: 500,
      }),
      para(
        "Toutes les modifications reçues seront intégrées dans une version 2 du site.",
        { align: AlignmentType.CENTER, size: 21, italics: true, color: GREY, after: 900 },
      ),
      para(SITE_URL.toUpperCase(), {
        align: AlignmentType.CENTER,
        size: 19,
        color: GOLD,
        spacing: 30,
      }),
    ],
  };

  // --- table of contents + all pages + closing notes ---
  const toc = [
    para("SOMMAIRE", { size: 34, spacing: 24, after: 240 }),
    ...pages.flatMap((p, i) => [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: USABLE }],
        spacing: { after: 60, line: 300 },
        border: { bottom: { style: BorderStyle.DOTTED, size: 3, color: LINE, space: 4 } },
        children: [
          new TextRun({ text: `${romanNumeral(i + 1)}.  `, font: FONT, size: 19, color: GOLD }),
          new TextRun({ text: p.title, font: FONT, size: 24, color: INK }),
          new TextRun({ text: "\t", font: FONT, size: 18 }),
          new TextRun({ text: p.url, font: FONT, size: 17, color: GREY }),
        ],
      }),
    ]),
    para(
      "Chaque page du site fait l'objet d'une section. Les textes y apparaissent dans l'ordre où ils se lisent à l'écran, de haut en bas. La colonne « Modifications » vous est réservée : rature, reformulation, remarque — tout est utile. Dans Word, activez « Révision → Suivi des modifications » pour que vos changements apparaissent en couleur.",
      { size: 20, italics: true, color: GREY, before: 300 },
    ),
  ];

  const notes = [
    new Paragraph({ children: [new PageBreak()] }),
    para("NOTES GÉNÉRALES", { size: 36, spacing: 24, after: 60 }),
    para(
      "Ton, voix de la marque, mots à privilégier, mots à bannir, formulations récurrentes à revoir : notez ici tout ce qui dépasse une page en particulier.",
      {
        size: 21,
        italics: true,
        color: GREY,
        after: 300,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } },
      },
    ),
    ...Array.from(
      { length: 16 },
      () =>
        new Paragraph({
          spacing: { after: 200, line: 360 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: LINE, space: 4 } },
          children: [new TextRun({ text: "", font: FONT, size: 22 })],
        }),
    ),
    para("Reçu et validé le _____________________ par M. Sbai Abdelhai", {
      size: 22,
      before: 600,
      after: 400,
    }),
    para("Signature : _________________________________________________", { size: 22 }),
  ];

  const content = {
    properties: pageSetup,
    headers: { default: contentHeader },
    footers: { default: contentFooter },
    children: [...toc, ...pages.flatMap(docxPage), ...notes],
  };

  const doc = new Document({
    title: "SBAI Immobilier — Révision des textes du site web",
    subject: `Révision des textes du site — version ${DOC_DATE}`,
    creator: "SBAI Abdelhai & Associés",
    description: "Relecture des textes français du site sbai-abdelhai.vercel.app",
    features: {
      // Word opens the file with Track Changes already recording, and refreshes
      // the PAGE / NUMPAGES fields in the header on open.
      trackRevisions: true,
      updateFields: true,
    },
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22, color: INK },
          paragraph: { spacing: { line: 300 } },
        },
      },
    },
    sections: [cover, content],
  });

  const buffer = await Packer.toBuffer(doc);
  writeFileSync(docxPath, buffer);
}

function romanNumeral(n) {
  const map = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, sym] of map) while (n >= v) (out += sym), (n -= v);
  return out;
}

// ---------------------------------------------------------------------------

async function main() {
  const htmlPath = join(htmlDir, "copy-review.html");
  writeFileSync(htmlPath, buildHtml(), "utf8");

  const pdfPath = join(outDir, "sbai-site-copy-review.pdf");
  const docxPath = join(outDir, "sbai-site-copy-review.docx");

  const pageCount = await buildPdf(htmlPath, pdfPath);
  await buildDocx(docxPath);

  const c = coverage();
  console.log(`HTML  → ${htmlPath}`);
  console.log(`PDF   → ${pdfPath} (${pageCount} pages)`);
  console.log(`DOCX  → ${docxPath}`);
  console.log(
    `\nSections : ${pages.length} · lignes de texte : ${c.rows}` +
      `\nClés fr.json couvertes : ${c.used}/${c.total} (${((100 * c.used) / c.total).toFixed(1)} %)` +
      (c.missing.length ? `\nNon reprises : ${c.missing.join(", ")}` : ""),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
