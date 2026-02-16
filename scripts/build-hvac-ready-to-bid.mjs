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
          if (s.includes('"') || s.includes(',') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        })
        .join(',')
    )
    .join('\n');
}

function n(v) {
  return String(v || '').replace(/\s+/g, ' ').trim();
}

function money(v) {
  const m = Number(String(v || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(m) ? m : 0;
}

function dateValue(v) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function hasGhost(text) {
  return /(radio|antenna|t-mobile|swap|like-for-like|water tap)/i.test(text);
}

function hasHvacScope(text) {
  return /(hvac|mechanical|rtu|chiller|cooling|heating|ventilation|duct|split system|air handler|condensing|furnace|heat pump)/i.test(text);
}

function buildStrategyMap(pathToTop50) {
  const map = new Map();
  if (!fs.existsSync(pathToTop50)) return map;
  const rows = parseCsv(fs.readFileSync(pathToTop50, 'utf8').replace(/^\uFEFF/, ''));
  if (rows.length < 2) return map;
  const header = rows[0].map(n);
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (const r of rows.slice(1)) {
    const full = n(r[idx.Full_Permit_Number]);
    const strategy = n(r[idx.Strategy]);
    if (full && strategy) map.set(full, strategy);
  }
  return map;
}

function main() {
  const permitsCsv = process.argv[2] || '/Users/cashletesports/.Trash/Permits (3).csv';
  const top50Csv = process.argv[3] || '/Users/cashletesports/Desktop/HVAC Permits/Top_50_Fixed_For_Agent.csv';
  const outDir = process.argv[4] || '/Users/cashletesports/Desktop/HVAC Permits';
  const limitArg = process.argv.find((a) => a.startsWith('--limit=')) || '--limit=50';
  const limit = Number(limitArg.split('=')[1]) || 50;

  const absPermits = path.resolve(permitsCsv);
  const absTop50 = path.resolve(top50Csv);
  const absOutDir = path.resolve(outDir);
  fs.mkdirSync(absOutDir, { recursive: true });

  const strategyMap = buildStrategyMap(absTop50);
  const rows = parseCsv(fs.readFileSync(absPermits, 'utf8').replace(/^\uFEFF/, ''));
  const headerIndex = rows.findIndex((r) => n(r[0]) === 'Type' && n(r[1]) === 'Number');
  if (headerIndex < 0) throw new Error('Header row not found in permits CSV');
  const header = rows[headerIndex].map(n);
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const selected = [];
  for (const r of rows.slice(headerIndex + 1)) {
    if (!r.some((c) => n(c))) continue;
    const type = n(r[idx.Type]);
    const num = n(r[idx.Number]);
    const permit = type && num ? `${type}-${num}` : num;
    const valuation = money(r[idx.Valuation]);
    if (valuation < 10000) continue;

    const owner = n(r[idx.Owner]);
    const address = n(r[idx.Address]);
    const phone = n(r[idx['Cont Phone']]);
    const issueDate = n(r[idx['Issue Date']]);
    const subdivision = n(r[idx.Subdivision]);
    const contractor = n(r[idx.Contractor]);
    const planNum = n(r[idx['Plan Num']]);

    const mechanicalMatch = /(LPRM|MECH|MECHANICAL)/i.test(type);
    if (!mechanicalMatch) continue;

    const strategy = strategyMap.get(permit) || '';
    const baseScope = strategy || [planNum, subdivision, contractor].filter(Boolean).join(' | ');
    const scope = n(baseScope) || 'Needs Manual Scope Verification';

    const hay = [scope, owner, address, contractor, subdivision].join(' | ');
    if (hasGhost(hay)) continue;
    if (!hasHvacScope(scope)) continue;

    selected.push({
      permit,
      permitNumberOnly: num,
      type,
      valuation,
      scope,
      address,
      owner,
      phone: phone || 'Needs Manual ACC Lookup',
      issueDate
    });
  }

  selected.sort((a, b) => {
    if (b.valuation !== a.valuation) return b.valuation - a.valuation;
    return dateValue(b.issueDate) - dateValue(a.issueDate);
  });

  const top = selected.slice(0, limit);
  const outRows = [
    [
      'Permit Number',
      'Permit Type',
      'Valuation (Must be $10k+)',
      'Description (Scope of work)',
      'Address',
      'Owner Name',
      'Owner Phone Number',
      'Date Filed'
    ],
    ...top.map((x) => [
      x.permitNumberOnly,
      x.type,
      x.valuation.toFixed(2),
      x.scope,
      x.address,
      x.owner,
      x.phone,
      x.issueDate
    ])
  ];

  const outPath = path.join(absOutDir, 'HVAC_READY_TO_BID.csv');
  fs.writeFileSync(outPath, toCsv(outRows), 'utf8');
  console.log(`Created: ${outPath}\nRows: ${top.length}`);
}

main();
