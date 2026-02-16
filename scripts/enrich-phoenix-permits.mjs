import fs from 'node:fs';
import path from 'node:path';

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
    } else if (ch === '\r') {
      // ignore
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const s = String(value ?? '');
          if (s.includes('"') || s.includes(',') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        })
        .join(',')
    )
    .join('\n');
}

function normalize(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return normalize(m?.[1] || '');
}

function extractFieldByLabel(html, label) {
  const re = new RegExp(`${label}[\\s\\S]{0,240}?>([^<]{2,120})<`, 'i');
  const m = html.match(re);
  return normalize(m?.[1] || '');
}

function extractEmail(html) {
  const m = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return normalize(m?.[0] || '');
}

function extractPhone(html) {
  const m = html.match(/(?:\+1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  return normalize(m?.[0] || '');
}

function extractPdfLinks(html, pageUrl) {
  const links = [];
  const re = /href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href = m[1];
    try {
      href = new URL(href, pageUrl).toString();
    } catch {
      // keep raw if URL parse fails
    }
    links.push(href);
  }
  return [...new Set(links)];
}

async function scrapePermit(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AtlasPermitBot/1.0; +https://atlasconstructionintelligence.com)'
      },
      redirect: 'follow'
    });

    const html = await response.text();
    const pageTitle = extractTitle(html);
    const ownerName = extractFieldByLabel(html, 'Owner');
    const ownerPhone = extractFieldByLabel(html, 'Phone') || extractPhone(html);
    const ownerEmail = extractFieldByLabel(html, 'Email') || extractEmail(html);
    const pdfLinks = extractPdfLinks(html, url);

    return {
      status: response.status,
      ok: response.ok,
      pageTitle,
      ownerName,
      ownerPhone,
      ownerEmail,
      pdfLinks,
      note: response.ok ? 'ok' : `http_${response.status}`
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      pageTitle: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      pdfLinks: [],
      note: `fetch_error:${error instanceof Error ? error.message : String(error)}`
    };
  }
}

async function main() {
  const inputPath = process.argv[2] || 'output/hvac_master9.csv';
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : Number.POSITIVE_INFINITY;

  const absInput = path.resolve(inputPath);
  if (!fs.existsSync(absInput)) {
    console.error(`Input file not found: ${absInput}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absInput, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  if (rows.length < 2) {
    console.error('Input CSV has no data rows.');
    process.exit(1);
  }

  const header = rows[0];
  const dataRows = rows.slice(1);
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  if (idx.permit_details_url === undefined) {
    console.error('Input CSV missing "permit_details_url" column. Re-run filter first.');
    process.exit(1);
  }

  const outRows = [];
  const runRows = dataRows.slice(0, Number.isFinite(limit) ? limit : dataRows.length);

  for (let i = 0; i < runRows.length; i += 1) {
    const row = runRows[i];
    const url = row[idx.permit_details_url];
    const result = url ? await scrapePermit(url) : { status: 0, ok: false, pageTitle: '', ownerName: '', ownerPhone: '', ownerEmail: '', pdfLinks: [], note: 'missing_url' };

    outRows.push([
      ...row,
      result.ok ? 'ok' : 'review',
      String(result.status),
      result.pageTitle,
      result.ownerName,
      result.ownerPhone,
      result.ownerEmail,
      result.pdfLinks.join(' | '),
      result.note
    ]);
  }

  const outHeader = [
    ...header,
    'enrichment_status',
    'http_status',
    'page_title',
    'owner_name_scraped',
    'owner_phone_scraped',
    'owner_email_scraped',
    'submission_pdf_urls',
    'enrichment_note'
  ];

  const outDir = path.resolve('output');
  fs.mkdirSync(outDir, { recursive: true });

  const base = path.basename(absInput, path.extname(absInput));
  const outPath = path.join(outDir, `${base}_enriched.csv`);
  fs.writeFileSync(outPath, toCsv([outHeader, ...outRows]));

  console.log(`Done.
Input: ${absInput}
Rows processed: ${runRows.length}
Output: ${outPath}`);
}

await main();
