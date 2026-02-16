import fs from 'node:fs';
import path from 'node:path';

const API_URL = 'https://data.phoenix.gov/resource/8v72-v977.json';
const GHOST_KEYWORDS = ['radio', 'swap', 'antenna', 't-mobile', 'water tap', 'like-for-like'];
const URGENT_KEYWORDS = ['100-ton', 'chiller', 'cooling tower', 'industrial warehouse'];

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

function normalize(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseMoney(raw) {
  const n = Number(String(raw || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function parseDate(raw) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function hasAnyKeyword(text, keywords) {
  const hay = normalize(text).toLowerCase();
  return keywords.some((k) => hay.includes(k.toLowerCase()));
}

function listKeywords(text, keywords) {
  const hay = normalize(text).toLowerCase();
  return keywords.filter((k) => hay.includes(k.toLowerCase()));
}

function getField(obj, keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') return normalize(obj[k]);
  }
  return '';
}

async function fetchApiRows(days, minValuation) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const where = `valuation_for_fees > ${minValuation} AND issued_date >= '${cutoff}'`;
  const params = new URLSearchParams({
    $select:
      'permit_number,permit_type,valuation_for_fees,issued_date,description,address,owner,contractor,project_number,city,status',
    $where: where,
    $limit: '5000'
  });
  const url = `${API_URL}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`API request failed (${res.status})`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('API returned non-array payload');
  return data;
}

function mapFromFallbackCsv(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  if (rows.length < 2) return [];

  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [normalize(h), i]));

  return rows.slice(1).filter((r) => r.some((c) => normalize(c))).map((r) => {
    const permitType = normalize(r[idx.Permit_Type] ?? '');
    const permitNumberOnly = normalize(r[idx.Permit_Number_Only] ?? '');
    const fullPermit = normalize(r[idx.Full_Permit_Number] ?? '');
    return {
      permit_type: permitType || 'Mechanical',
      permit_number: fullPermit || (permitType && permitNumberOnly ? `${permitType}-${permitNumberOnly}` : permitNumberOnly),
      valuation_for_fees: parseMoney(r[idx.Valuation] ?? '').toString(),
      issued_date: '',
      description: normalize(r[idx.Strategy] ?? ''),
      address: normalize(r[idx.Address] ?? ''),
      owner: normalize(r[idx.Owner] ?? ''),
      contractor: '',
      project_number: '',
      city: 'PHOENIX',
      status: ''
    };
  });
}

function buildWhales(records, days, minValuation) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const whales = [];

  for (const row of records) {
    const permitType = getField(row, ['permit_type', 'Permit_Type']);
    const valuation = parseMoney(getField(row, ['valuation_for_fees', 'Valuation']));
    const issuedRaw = getField(row, ['issued_date', 'Issue Date']);
    const issuedDate = parseDate(issuedRaw);
    const description = getField(row, ['description', 'Strategy']);
    const address = getField(row, ['address', 'Address']);
    const owner = getField(row, ['owner', 'Owner']);
    const contractor = getField(row, ['contractor', 'Contractor']);
    const projectNumber = getField(row, ['project_number', 'Project Number']);
    const city = getField(row, ['city', 'City']) || 'PHOENIX';
    const status = getField(row, ['status', 'Status']);
    const permitNumber = getField(row, ['permit_number', 'Full_Permit_Number']) || getField(row, ['Permit_Number_Only']);

    const searchable = [description, owner, contractor, permitType].join(' | ');

    const mechanicalMatch = /mechanical|lprm|mech/i.test(permitType || searchable);
    if (!mechanicalMatch) continue;
    if (valuation <= minValuation) continue;
    if (issuedDate && issuedDate < cutoff) continue;
    if (hasAnyKeyword(searchable, GHOST_KEYWORDS)) continue;

    const urgentHits = listKeywords(searchable, URGENT_KEYWORDS);
    whales.push({
      full_permit_number: permitNumber,
      permit_type: permitType,
      project_number: projectNumber,
      issued_date: issuedDate ? issuedDate.toISOString() : issuedRaw,
      valuation_for_fees: valuation.toFixed(2),
      description,
      address,
      city,
      owner,
      contractor,
      status,
      priority_flag: urgentHits.length ? 'URGENT WHALE' : 'WHALE',
      urgent_terms: urgentHits.join('|')
    });
  }

  whales.sort((a, b) => {
    const d = new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime();
    if (!Number.isNaN(d) && d !== 0) return d;
    return Number(b.valuation_for_fees) - Number(a.valuation_for_fees);
  });

  return whales;
}

async function main() {
  const outputDir = process.argv[2] || '/Users/cashletesports/Desktop/HVAC Permits';
  const fallbackCsv = process.argv[3] || '/Users/cashletesports/Desktop/HVAC Permits/Top_50_Fixed_For_Agent.csv';
  const daysArg = process.argv.find((a) => a.startsWith('--days=')) || '--days=30';
  const minArg = process.argv.find((a) => a.startsWith('--minValuation=')) || '--minValuation=10000';
  const days = Number(daysArg.split('=')[1]) || 30;
  const minValuation = Number(minArg.split('=')[1]) || 50000;

  let source = 'api';
  let data = [];
  try {
    data = await fetchApiRows(days, minValuation);
  } catch (error) {
    source = 'csv_fallback';
    data = mapFromFallbackCsv(fallbackCsv);
    console.warn(`API unavailable, using fallback CSV: ${error instanceof Error ? error.message : String(error)}`);
  }

  const whales = buildWhales(data, days, minValuation);

  const outDir = path.resolve(outputDir);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'HVAC_Whale_Leads_Phase1.csv');
  const logPath = path.join(outDir, 'HVAC_Whale_Leads_Phase1_meta.json');

  const rows = [
    [
      'full_permit_number',
      'permit_type',
      'project_number',
      'issued_date',
      'valuation_for_fees',
      'description',
      'address',
      'city',
      'owner',
      'contractor',
      'status',
      'priority_flag',
      'urgent_terms'
    ],
    ...whales.map((r) => [
      r.full_permit_number,
      r.permit_type,
      r.project_number,
      r.issued_date,
      r.valuation_for_fees,
      r.description,
      r.address,
      r.city,
      r.owner,
      r.contractor,
      r.status,
      r.priority_flag,
      r.urgent_terms
    ])
  ];

  fs.writeFileSync(outPath, toCsv(rows), 'utf8');
  fs.writeFileSync(
    logPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        source,
        records_in: data.length,
        records_out: whales.length,
        endpoint: API_URL,
        days,
        min_valuation: minValuation
      },
      null,
      2
    )
  );

  console.log(`Done.
Source: ${source}
Output: ${outPath}
Rows: ${whales.length}
Meta: ${logPath}`);
}

await main();
