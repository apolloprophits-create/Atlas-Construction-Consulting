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

async function fillPermitType(page, permitType) {
  const typeSelectors = [
    'select[name*="permitType" i]',
    'select[id*="permitType" i]',
    'select[name*="type" i]',
    'select[id*="type" i]'
  ];

  for (const sel of typeSelectors) {
    const el = await page.$(sel);
    if (!el) continue;
    const options = await el.$$('option');
    let matched = false;
    for (const option of options) {
      const value = (await option.getAttribute('value')) || '';
      const text = ((await option.textContent()) || '').trim();
      if (value.toUpperCase() === permitType.toUpperCase() || text.toUpperCase().includes(permitType.toUpperCase())) {
        await page.selectOption(sel, { value });
        matched = true;
        break;
      }
    }
    if (matched) return true;
  }

  const typeInputSelectors = [
    'input[name*="permitType" i]',
    'input[id*="permitType" i]',
    'input[name*="type" i]',
    'input[id*="type" i]',
    'input[aria-label*="type" i]',
    '[role="combobox"][aria-label*="type" i]'
  ];
  for (const sel of typeInputSelectors) {
    const el = await page.$(sel);
    if (!el) continue;
    await el.fill('');
    await el.type(permitType);
    await page.keyboard.press('Enter').catch(() => {});
    return true;
  }
  return false;
}

async function fillPermitNumber(page, permitNumber) {
  const numberSelectors = [
    'input[name*="permitNumber" i]',
    'input[id*="permitNumber" i]',
    'input[name*="permitNum" i]',
    'input[id*="permitNum" i]',
    'input[name*="number" i]',
    'input[id*="number" i]',
    'input[aria-label*="permit number" i]',
    'input[placeholder*="permit" i]'
  ];
  for (const sel of numberSelectors) {
    const el = await page.$(sel);
    if (!el) continue;
    await el.fill('');
    await el.type(permitNumber);
    return true;
  }
  return false;
}

async function fillFullPermit(page, fullPermit) {
  const fullSelectors = [
    'input[name*="permit" i]',
    'input[id*="permit" i]',
    'input[aria-label*="permit" i]',
    'input[placeholder*="permit" i]'
  ];
  for (const sel of fullSelectors) {
    const el = await page.$(sel);
    if (!el) continue;
    await el.fill('');
    await el.type(fullPermit);
    return true;
  }
  return false;
}

async function clickSearch(page) {
  const buttons = [
    'button:has-text("Search")',
    'input[type="submit"][value*="Search" i]',
    'button[id*="search" i]',
    'button[name*="search" i]'
  ];
  for (const sel of buttons) {
    const el = await page.$(sel);
    if (el) {
      await Promise.allSettled([
        page.waitForLoadState('networkidle', { timeout: 12000 }),
        el.click()
      ]);
      return true;
    }
  }
  return false;
}

async function extractPdfLinks(page) {
  const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.getAttribute('href') || '').filter(Boolean));
  const links = new Set();
  for (const href of hrefs) {
    try {
      const u = new URL(href, location.origin).toString();
      if (u.toLowerCase().includes('.pdf')) links.add(u);
    } catch {
      // ignore malformed
    }
  }
  return [...links];
}

async function main() {
  const inputPath = process.argv[2] || '/Users/cashletesports/Desktop/HVAC Permits/Top_50_Fixed_For_Agent.csv';
  const outputDir = process.argv[3] || '/Users/cashletesports/Desktop/HVAC Permits';
  const visible = process.argv.includes('--headed');

  const absInput = path.resolve(inputPath);
  const absOut = path.resolve(outputDir);
  fs.mkdirSync(absOut, { recursive: true });

  const raw = fs.readFileSync(absInput, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.some((c) => String(c || '').trim() !== ''));
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const required = ['Permit_Type', 'Permit_Number_Only', 'Full_Permit_Number'];
  for (const col of required) {
    if (idx[col] === undefined) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  const browser = await chromium.launch({ headless: !visible });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const logRows = [[
    'full_permit_number',
    'status',
    'pdf_count_found',
    'pdf_files_saved',
    'note'
  ]];

  for (const row of data) {
    const permitType = String(row[idx.Permit_Type] || '').trim();
    const permitNumber = String(row[idx.Permit_Number_Only] || '').trim();
    const fullPermit = String(row[idx.Full_Permit_Number] || '').trim();

    try {
      await page.goto('https://apps-secure.phoenix.gov/PDD/Search/PlanReviews', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(800);

      const filledType = await fillPermitType(page, permitType);
      const filledNumber = await fillPermitNumber(page, permitNumber);
      let usedFullFallback = false;
      if (!filledType || !filledNumber) {
        usedFullFallback = await fillFullPermit(page, fullPermit);
      }

      if ((!filledType || !filledNumber) && !usedFullFallback) {
        logRows.push([fullPermit, 'error', '0', '', 'Could not find permit type/number fields or full permit input']);
        continue;
      }

      const searched = await clickSearch(page);
      if (!searched) {
        logRows.push([fullPermit, 'error', '0', '', 'Could not find Search button']);
        continue;
      }

      await page.waitForTimeout(2000);

      // Click any likely "details" links to expose attachments.
      const detailCandidates = await page.$$('a:has-text("Details"), a:has-text("View"), a:has-text("Plan"), a:has-text("Review")');
      for (const link of detailCandidates.slice(0, 3)) {
        await Promise.allSettled([
          page.waitForLoadState('networkidle', { timeout: 8000 }),
          link.click()
        ]);
        await page.waitForTimeout(600);
      }

      const pdfLinks = await extractPdfLinks(page);
      if (pdfLinks.length === 0) {
        const note = usedFullFallback ? 'No PDF links after search (used full permit fallback input)' : 'No PDF links after search';
        logRows.push([fullPermit, 'no_pdf_found', '0', '', note]);
        continue;
      }

      const savedFiles = [];
      for (let i = 0; i < pdfLinks.length; i += 1) {
        const suffix = pdfLinks.length === 1 ? '' : `__${String(i + 1).padStart(2, '0')}`;
        const filename = `${safeName(fullPermit)}${suffix}.pdf`;
        const target = path.join(absOut, filename);

        const res = await context.request.get(pdfLinks[i]);
        if (!res.ok()) continue;
        const buf = Buffer.from(await res.body());
        fs.writeFileSync(target, buf);
        savedFiles.push(filename);
      }

      if (savedFiles.length === 0) {
        logRows.push([fullPermit, 'no_pdf_downloaded', String(pdfLinks.length), '', 'Links found but downloads failed']);
      } else {
        logRows.push([fullPermit, 'ok', String(pdfLinks.length), savedFiles.join(' | '), '']);
      }
    } catch (err) {
      logRows.push([fullPermit, 'error', '0', '', err instanceof Error ? err.message : String(err)]);
    }
  }

  const logPath = path.join(absOut, 'permit_pdf_pull_log_playwright.csv');
  fs.writeFileSync(logPath, toCsv(logRows), 'utf8');

  await context.close();
  await browser.close();
  console.log(`Done. Log: ${logPath}`);
}

await main();
