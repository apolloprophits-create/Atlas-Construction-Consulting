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
          if (s.includes('"') || s.includes(',') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
          return s;
        })
        .join(',')
    )
    .join('\n');
}

function safeName(value) {
  return String(value || '').replace(/[^A-Za-z0-9._-]+/g, '_');
}

function extractPdfLinks(html, pageUrl) {
  const links = [];
  const re = /href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let url = m[1];
    try {
      url = new URL(url, pageUrl).toString();
    } catch {
      // keep raw
    }
    links.push(url);
  }
  return [...new Set(links)];
}

function extractInternalLinks(html, pageUrl) {
  const links = [];
  const re = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1];
    if (!raw || raw.startsWith('javascript:') || raw.startsWith('#')) continue;
    try {
      const u = new URL(raw, pageUrl);
      if (u.hostname === 'apps-secure.phoenix.gov') links.push(u.toString());
    } catch {
      // ignore invalid URLs
    }
  }
  return [...new Set(links)];
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AtlasPermitPDFBot/1.0)'
    },
    redirect: 'follow'
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function downloadFile(url, filePath) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AtlasPermitPDFBot/1.0)'
    },
    redirect: 'follow'
  });
  if (!response.ok) throw new Error(`PDF HTTP ${response.status}`);
  const arr = new Uint8Array(await response.arrayBuffer());
  fs.writeFileSync(filePath, arr);
}

async function main() {
  const inputPath = process.argv[2] || '/Users/cashletesports/Desktop/HVAC Permits/Top_50_Fixed_For_Agent.csv';
  const outputDir = process.argv[3] || '/Users/cashletesports/Desktop/HVAC Permits';

  const absInput = path.resolve(inputPath);
  const absOut = path.resolve(outputDir);

  if (!fs.existsSync(absInput)) {
    console.error(`Input file not found: ${absInput}`);
    process.exit(1);
  }

  fs.mkdirSync(absOut, { recursive: true });

  const csvText = fs.readFileSync(absInput, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(csvText);
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.some((c) => String(c || '').trim() !== ''));
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  if (idx.Full_Permit_Number === undefined || idx.Permit_Type === undefined || idx.Permit_Number_Only === undefined) {
    console.error('Missing required columns. Need: Permit_Type, Permit_Number_Only, Full_Permit_Number');
    process.exit(1);
  }

  const logRows = [[
    'full_permit_number',
    'permit_details_url',
    'pdf_count_found',
    'pdf_files_saved',
    'status',
    'note'
  ]];

  for (const row of data) {
    const permit = String(row[idx.Full_Permit_Number] || '').trim();
    if (!permit) continue;
    const permitType = String(row[idx.Permit_Type] || '').trim();
    const permitNumberOnly = String(row[idx.Permit_Number_Only] || '').trim();

    const planReviewCandidates = [
      `https://apps-secure.phoenix.gov/PDD/Search/PlanReviews?permitNum=${encodeURIComponent(permit)}`,
      `https://apps-secure.phoenix.gov/PDD/Search/PlanReviews?permitType=${encodeURIComponent(permitType)}&permitNumber=${encodeURIComponent(permitNumberOnly)}`,
      `https://apps-secure.phoenix.gov/PDD/Search/PlanReviews?type=${encodeURIComponent(permitType)}&number=${encodeURIComponent(permitNumberOnly)}`
    ];

    try {
      const visited = new Set();
      const queue = [...planReviewCandidates];
      const pdfSet = new Set();
      let firstUrl = planReviewCandidates[0];

      while (queue.length > 0 && visited.size < 12) {
        const url = queue.shift();
        if (!url || visited.has(url)) continue;
        visited.add(url);
        if (visited.size === 1) firstUrl = url;

        const html = await fetchHtml(url);
        for (const pdf of extractPdfLinks(html, url)) pdfSet.add(pdf);

        // Crawl a shallow set of internal links that often contain document tables.
        for (const link of extractInternalLinks(html, url)) {
          const lower = link.toLowerCase();
          if (
            lower.includes('/pdd/search/planreviews') ||
            lower.includes('/pdd/search/permitdetails') ||
            lower.includes('planreview') ||
            lower.includes('document') ||
            lower.includes('attachment')
          ) {
            if (!visited.has(link)) queue.push(link);
          }
        }
      }

      const pdfLinks = [...pdfSet];

      if (pdfLinks.length === 0) {
        logRows.push([permit, firstUrl, '0', '', 'no_pdf_found', 'No PDF links found from PlanReviews search path']);
        continue;
      }

      const saved = [];
      for (let i = 0; i < pdfLinks.length; i += 1) {
        const suffix = pdfLinks.length === 1 ? '' : `__${String(i + 1).padStart(2, '0')}`;
        const fileName = `${safeName(permit)}${suffix}.pdf`;
        const dest = path.join(absOut, fileName);
        await downloadFile(pdfLinks[i], dest);
        saved.push(fileName);
      }

      logRows.push([permit, firstUrl, String(pdfLinks.length), saved.join(' | '), 'ok', '']);
    } catch (error) {
      logRows.push([
        permit,
        planReviewCandidates[0],
        '0',
        '',
        'error',
        error instanceof Error ? error.message : String(error)
      ]);
    }
  }

  const logPath = path.join(absOut, 'permit_pdf_pull_log.csv');
  fs.writeFileSync(logPath, toCsv(logRows), 'utf8');
  console.log(`Done. Log: ${logPath}`);
}

await main();
