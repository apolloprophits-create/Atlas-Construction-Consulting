import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function htmlForCsv(title, rows) {
  const header = rows[0] || [];
  const data = rows.slice(1);
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #111; }
    h1 { margin: 0 0 10px; font-size: 18px; }
    p.meta { margin: 0 0 14px; color: #555; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid #ddd; padding: 6px; font-size: 10px; vertical-align: top; word-wrap: break-word; }
    th { background: #f4f6f8; text-align: left; }
    tr:nth-child(even) td { background: #fafafa; }
  </style>
</head>
<body>
  <h1>${esc(title)}</h1>
  <p class="meta">Generated: ${new Date().toISOString()}</p>
  <table>
    <thead>
      <tr>${header.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${data.map((r) => `<tr>${header.map((_, i) => `<td>${esc(r[i] ?? '')}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;
}

async function convert(csvPath, pdfPath) {
  const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  const html = htmlForCsv(path.basename(csvPath), rows);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    printBackground: true,
    format: 'A4',
    landscape: true,
    margin: { top: '10mm', right: '8mm', bottom: '10mm', left: '8mm' }
  });
  await browser.close();
}

async function main() {
  const csvPaths = process.argv.slice(2);
  if (csvPaths.length === 0) {
    console.error('Usage: node scripts/csv-to-pdf.mjs "<file1.csv>" ["file2.csv"...]');
    process.exit(1);
  }

  for (const csvPathInput of csvPaths) {
    const absCsv = path.resolve(csvPathInput);
    if (!fs.existsSync(absCsv)) {
      console.error(`Missing CSV: ${absCsv}`);
      continue;
    }
    const pdfPath = absCsv.replace(/\.csv$/i, '.pdf');
    await convert(absCsv, pdfPath);
    console.log(`Created: ${pdfPath}`);
  }
}

await main();
