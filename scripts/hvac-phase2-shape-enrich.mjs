import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const SHAPE_SEARCH_URL = 'https://shapephx.phoenix.gov/s/pdd-case-search';
const TRASH_TERMS = ['radio', 'swap', 't-mobile', 'antenna', 'water tap'];
const MANUAL = 'Needs Manual Plan Request';

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

function normalize(v) {
  return String(v || '').replace(/\s+/g, ' ').trim();
}

function parseMoney(raw) {
  const n = Number(String(raw || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function extractBetween(text, leftLabel) {
  const escaped = leftLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = text.match(new RegExp(`${escaped}\\s*[:\\-]?\\s*([^\\n]{2,140})`, 'i'));
  return normalize(m?.[1] || '');
}

function isLikelyValidName(name) {
  const n = normalize(name);
  if (!n) return false;
  if (n.length < 3) return false;
  if (/error|exception|not found|undefined|null/i.test(n)) return false;
  return true;
}

function extractTonnage(text) {
  const hits = [];
  const re = /(\d+(?:\.\d+)?)\s*[- ]?\s*tons?/gi;
  let m;
  while ((m = re.exec(text)) !== null) hits.push(`${m[1]} ton`);
  return [...new Set(hits)].join(' | ');
}

function extractRtuCount(text) {
  const explicit = text.match(/(\d+)\s*rtu/gi) || [];
  if (explicit.length > 0) {
    const nums = explicit.map((s) => s.match(/\d+/)?.[0]).filter(Boolean);
    return nums.join(' | ');
  }
  return '';
}

function parseTonnageTotal(tonnageSpecs) {
  const vals = String(tonnageSpecs || '')
    .split('|')
    .map((s) => {
      const m = s.match(/(\d+(?:\.\d+)?)/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n) && n > 0);
  return vals.reduce((a, b) => a + b, 0);
}

function gradeLead(lead) {
  const valuation = parseMoney(lead.valuation_for_fees);
  const text = `${lead.description} ${lead.owner_name} ${lead.mechanical_engineer} ${lead.search_notes}`.toLowerCase();
  if (valuation <= 0 || /n\/a/.test(String(lead.valuation_for_fees).toLowerCase())) return 'Trash';
  if (TRASH_TERMS.some((k) => text.includes(k))) return 'Trash';
  const hasOwner = normalize(lead.owner_name) !== '' && normalize(lead.owner_name) !== normalize(MANUAL);
  const toBeBid = /to be bid/i.test(`${lead.status} ${lead.search_notes}`);
  const totalTons = parseTonnageTotal(lead.tonnage_specs);
  if (valuation >= 50000 && totalTons >= 50 && toBeBid && hasOwner) return 'Grade A+';
  const commercialScope = /(commercial|industrial|warehouse|core\s*&\s*shell|tenant improvement|ti|investor)/i.test(text);
  if (valuation >= 10000 && valuation < 50000 && commercialScope) return 'Grade B';
  return 'Review';
}

async function searchProject(page, projectNumber) {
  const notes = [];
  try {
    await page.goto(SHAPE_SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1400);

    const searchInputSelectors = [
      'input[placeholder*="Search" i]',
      'input[aria-label*="Search" i]',
      'input[type="search"]',
      'input[name*="search" i]',
      'input[id*="search" i]'
    ];

    let filled = false;
    for (const sel of searchInputSelectors) {
      const el = await page.$(sel);
      if (!el) continue;
      await el.fill('');
      await el.type(projectNumber, { delay: 15 });
      await page.keyboard.press('Enter').catch(() => {});
      filled = true;
      break;
    }
    if (!filled) {
      return { ok: false, notes: 'No search input found', ownerName: '', ownerAddress: '', engineer: '', tonnage: '', rtuCount: '', engineerFirm: '', ownerContact: '' };
    }

    await page.waitForTimeout(2500);

    const projectLink = await page.$(`a:has-text("${projectNumber}")`);
    if (projectLink) {
      await Promise.allSettled([
        page.waitForLoadState('networkidle', { timeout: 15000 }),
        projectLink.click()
      ]);
      await page.waitForTimeout(1200);
    } else {
      notes.push('Project link not found; using current page text only');
    }

    const tabs = ['Contacts', 'Related', 'Plan Reviews', 'Plan Review'];
    for (const t of tabs) {
      const tab = await page.$(`a:has-text("${t}"), button:has-text("${t}")`);
      if (tab) {
        await Promise.allSettled([
          page.waitForLoadState('networkidle', { timeout: 10000 }),
          tab.click()
        ]);
        await page.waitForTimeout(900);
      }
    }

    const pageText = normalize(await page.locator('body').innerText());
    const ownerName =
      extractBetween(pageText, 'Primary Owner') ||
      extractBetween(pageText, 'Owner') ||
      extractBetween(pageText, 'Property Owner');
    const ownerAddress = extractBetween(pageText, 'Mailing Address') || extractBetween(pageText, 'Owner Address');
    const engineer =
      extractBetween(pageText, 'Mechanical Engineer') ||
      extractBetween(pageText, 'Engineer of Record') ||
      extractBetween(pageText, 'Design Professional');

    const pdfLinks = await page.$$eval('a[href]', (as) =>
      as.map((a) => a.getAttribute('href') || '').filter((h) => /\.pdf(\?|$)/i.test(h))
    );
    const resolvedPdfs = [...new Set(pdfLinks.map((h) => {
      try {
        return new URL(h, window.location.origin).toString();
      } catch {
      return h;
    }
  }))];

    let tonnage = '';
    let rtuCount = '';
    let engineerFirm = '';
    let ownerContact = '';
    if (resolvedPdfs.length > 0) {
      const pdfUrl = resolvedPdfs[0];
      const pdfRes = await page.context().request.get(pdfUrl);
      if (pdfRes.ok()) {
        const raw = Buffer.from(await pdfRes.body()).toString('latin1');
        tonnage = extractTonnage(raw);
        rtuCount = extractRtuCount(raw);
      } else {
        notes.push(`PDF request failed (${pdfRes.status()})`);
      }
    } else {
      notes.push('No PDF links found in SHAPE record');
    }

    return {
      ok: true,
      notes: notes.join(' | '),
      ownerName,
      ownerAddress,
      engineer,
      tonnage,
      rtuCount,
      engineerFirm,
      ownerContact
    };
  } catch (error) {
    return {
      ok: false,
      notes: error instanceof Error ? error.message : String(error),
      ownerName: '',
      ownerAddress: '',
      engineer: '',
      tonnage: '',
      rtuCount: '',
      engineerFirm: '',
      ownerContact: ''
    };
  }
}

async function main() {
  const phase1Csv = process.argv[2] || '/Users/cashletesports/Desktop/HVAC Permits/HVAC_Whale_Leads_Phase1.csv';
  const outDirArg = process.argv[3] || '/Users/cashletesports/Desktop/HVAC Permits';
  const headed = process.argv.includes('--headed');

  const raw = fs.readFileSync(path.resolve(phase1Csv), 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.some((c) => normalize(c)));
  const idx = Object.fromEntries(header.map((h, i) => [normalize(h), i]));

  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext();
  const page = await context.newPage();

  const finalRows = [[
    'address',
    'valuation',
    'owner_name',
    'owner_address',
    'mechanical_engineer',
    'engineer_firm',
    'primary_owner_contact',
    'tonnage_specs',
    'total_tonnage',
    'unit_count',
    'rtu_count',
    'full_permit_number',
    'project_number',
    'lead_grade',
    'status',
    'description',
    'search_notes'
  ]];

  for (const row of data) {
    const projectNumber = normalize(row[idx.project_number]);
    const fullPermit = normalize(row[idx.full_permit_number]);
    const valuation = normalize(row[idx.valuation_for_fees]);
    const address = normalize(row[idx.address]);
    const status = normalize(row[idx.status]);
    const description = normalize(row[idx.description]);
    const ownerFromPhase1 = normalize(row[idx.owner]);

    const lookupKey = projectNumber || fullPermit;
    const details = lookupKey
      ? await searchProject(page, lookupKey)
      : { ok: false, notes: 'No project/permit lookup key', ownerName: '', ownerAddress: '', engineer: '', tonnage: '', rtuCount: '', engineerFirm: '', ownerContact: '' };

    const tonnageSpecs = normalize(details.tonnage) || MANUAL;
    const rtuCount = normalize(details.rtuCount) || MANUAL;
    const totalTonnage = tonnageSpecs === MANUAL ? MANUAL : String(parseTonnageTotal(tonnageSpecs));
    const unitCount = rtuCount === MANUAL ? MANUAL : rtuCount;

    const enriched = {
      address,
      valuation_for_fees: valuation,
      owner_name: isLikelyValidName(details.ownerName) ? details.ownerName : ownerFromPhase1,
      owner_address: normalize(details.ownerAddress) || MANUAL,
      mechanical_engineer: normalize(details.engineer) || MANUAL,
      engineer_firm: normalize(details.engineerFirm) || MANUAL,
      primary_owner_contact: normalize(details.ownerContact) || MANUAL,
      tonnage_specs: tonnageSpecs,
      total_tonnage: totalTonnage,
      unit_count: unitCount,
      rtu_count: rtuCount,
      full_permit_number: fullPermit,
      project_number: projectNumber || MANUAL,
      status: status || MANUAL,
      description,
      search_notes: normalize(details.notes) || MANUAL
    };

    if (!enriched.owner_name) enriched.owner_name = MANUAL;
    const grade = gradeLead(enriched);

    finalRows.push([
      enriched.address,
      enriched.valuation_for_fees,
      enriched.owner_name,
      enriched.owner_address,
      enriched.mechanical_engineer,
      enriched.engineer_firm,
      enriched.primary_owner_contact,
      enriched.tonnage_specs,
      enriched.total_tonnage,
      enriched.unit_count,
      enriched.rtu_count,
      enriched.full_permit_number,
      enriched.project_number,
      grade,
      enriched.status,
      enriched.description,
      enriched.search_notes
    ]);
  }

  const outDir = path.resolve(outDirArg);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'HVAC_Final_Strike_List.csv');
  fs.writeFileSync(outPath, toCsv(finalRows), 'utf8');

  await context.close();
  await browser.close();

  console.log(`Done.
Output: ${outPath}
Rows: ${finalRows.length - 1}`);
}

await main();
