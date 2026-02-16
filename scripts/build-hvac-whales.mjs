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

function normalize(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseMoney(raw) {
  const cleaned = String(raw || '').replace(/[^0-9.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseDate(raw) {
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

function looksLikeMechanical(typeValue) {
  const t = normalize(typeValue).toLowerCase();
  return t === 'lprm' || t.includes('mech') || t.includes('mechanical');
}

const rejectKeywords = ['radio', 'swap', 't-mobile', 'antenna'];
const urgentKeywords = ['100-ton', 'chiller', 'cooling tower', 'industrial build'];

function keywordHits(text, keywords) {
  const hay = normalize(text).toLowerCase();
  return keywords.filter((k) => hay.includes(k.toLowerCase()));
}

function pickValue(row, idx, candidates) {
  for (const key of candidates) {
    if (idx[key] !== undefined) return normalize(row[idx[key]]);
  }
  return '';
}

function main() {
  const inputPath = process.argv[2];
  const outputDirArg = process.argv[3] || path.resolve('output');
  const daysArg = process.argv.find((a) => a.startsWith('--days=')) || '--days=30';
  const minValueArg = process.argv.find((a) => a.startsWith('--minValuation=')) || '--minValuation=50000';
  const days = Number(daysArg.split('=')[1]) || 30;
  const minValuation = Number(minValueArg.split('=')[1]) || 50000;

  if (!inputPath) {
    console.error('Usage: node scripts/build-hvac-whales.mjs "<input-csv>" "<output-dir>" [--days=30] [--minValuation=50000]');
    process.exit(1);
  }

  const absInput = path.resolve(inputPath);
  if (!fs.existsSync(absInput)) {
    console.error(`Input CSV not found: ${absInput}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absInput, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  if (rows.length < 2) {
    console.error('CSV has no usable rows.');
    process.exit(1);
  }

  let headerRowIndex = 0;
  const firstHeader = rows[0].map((h) => normalize(h).toLowerCase());
  const hasModernHeader = firstHeader.includes('permit_type') || firstHeader.includes('full_permit_number');
  if (!hasModernHeader) {
    headerRowIndex = rows.findIndex((r) => normalize(r[0]).toLowerCase() === 'type' && normalize(r[1]).toLowerCase() === 'number');
  }
  if (headerRowIndex < 0) {
    console.error('Could not find a recognizable permit header row.');
    process.exit(1);
  }

  const header = rows[headerRowIndex].map((h) => normalize(h));
  const dataRows = rows.slice(headerRowIndex + 1).filter((r) => r.some((c) => normalize(c) !== ''));
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const whaleRows = [];

  for (const row of dataRows) {
    const type = pickValue(row, idx, ['Permit_Type', 'permit_type', 'Type', 'type']);
    const permitNumber = pickValue(row, idx, ['Permit_Number_Only', 'permit_number', 'Number', 'number']);
    const issueDateRaw = pickValue(row, idx, ['Issue Date', 'issued_date', 'issue_date', 'Date']);
    const valuationRaw = pickValue(row, idx, ['Valuation', 'valuation_for_fees', 'valuation']);
    const owner = pickValue(row, idx, ['Owner', 'owner']);
    const address = pickValue(row, idx, ['Address', 'address']);
    const contractor = pickValue(row, idx, ['Contractor', 'contractor']);
    const planNum = pickValue(row, idx, ['Plan Num', 'plan_doc_name', 'plan_num']);
    const city = pickValue(row, idx, ['City', 'city']) || 'PHOENIX';
    const projectNumber = pickValue(row, idx, ['project_number', 'Project Number']);
    const strategy = pickValue(row, idx, ['Strategy', 'strategy']);
    const fullPermitFromFile = pickValue(row, idx, ['Full_Permit_Number', 'full_permit_number']);

    const issueDate = parseDate(issueDateRaw);
    if (issueDate && issueDate < cutoff) continue;

    const valuation = parseMoney(valuationRaw);
    if (valuation < minValuation) continue;

    if (!looksLikeMechanical(type)) continue;

    const scopeText = [type, owner, address, contractor, planNum].join(' | ');
    const rejectHits = keywordHits(scopeText, rejectKeywords);
    if (rejectHits.length > 0) continue;

    const urgentHits = keywordHits(scopeText, urgentKeywords);
    const priorityFlag = urgentHits.length > 0 ? 'URGENT WHALE' : 'WHALE';

    const fullPermitNumber = fullPermitFromFile || (type && permitNumber ? `${type}-${permitNumber}` : permitNumber);

    whaleRows.push({
      fullPermitNumber,
      permitType: type,
      permitNumber,
      issueDate: issueDate ? issueDate.toISOString() : '',
      valuation: valuation.toFixed(2),
      owner,
      address,
      city,
      contractor,
      projectNumber,
      strategy,
      planDocName: planNum,
      priorityFlag,
      keyScopeTerms: urgentHits.join('|')
    });
  }

  whaleRows.sort((a, b) => {
    const byDate = new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    if (byDate !== 0) return byDate;
    return Number(b.valuation) - Number(a.valuation);
  });

  const outRows = [
    [
      'full_permit_number',
      'permit_type',
      'permit_number',
      'project_number',
      'issue_date',
      'valuation_for_fees',
      'owner',
      'address',
      'city',
      'contractor',
      'plan_doc_name',
      'strategy',
      'priority_flag',
      'key_scope_terms'
    ],
    ...whaleRows.map((r) => [
      r.fullPermitNumber,
      r.permitType,
      r.permitNumber,
      r.projectNumber,
      r.issueDate,
      r.valuation,
      r.owner,
      r.address,
      r.city,
      r.contractor,
      r.planDocName,
      r.strategy,
      r.priorityFlag,
      r.keyScopeTerms
    ])
  ];

  const outDir = path.resolve(outputDirArg);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'HVAC_Whale_Leads_Today.csv');
  fs.writeFileSync(outPath, toCsv(outRows));

  console.log(`Done.
Input: ${absInput}
Output: ${outPath}
Rows: ${whaleRows.length}
Filters: mechanical + valuation >= ${minValuation} + issued in last ${days} days + ghost-lead reject keywords`);
}

main();
