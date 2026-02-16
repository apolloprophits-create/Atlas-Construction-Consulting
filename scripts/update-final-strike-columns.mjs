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
          if (s.includes('"') || s.includes(',') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
          return s;
        })
        .join(',')
    )
    .join('\n');
}

function normalize(v) {
  return String(v || '').replace(/\s+/g, ' ').trim().toUpperCase();
}

function main() {
  const filePath = process.argv[2] || '/Users/cashletesports/Desktop/HVAC Permits/HVAC_Final_Strike_List.csv';
  const abs = path.resolve(filePath);
  const raw = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  const header = rows[0];
  const data = rows.slice(1);

  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const newCols = ['Total Tonnage', 'Unit Count', 'Engineer Name', 'Engineer Firm', 'Primary Owner Contact', 'Design Intent', 'Electrical Sync'];

  const mergedHeader = [...header];
  for (const c of newCols) {
    if (!mergedHeader.includes(c)) mergedHeader.push(c);
  }

  const outRows = [mergedHeader];

  for (const row of data) {
    const mapped = Object.fromEntries(header.map((h, i) => [h, row[i] ?? '']));
    const addr = normalize(mapped.address);

    if (addr === normalize('819 E BUCKEYE RD') || addr === normalize('7400 W BUCKEYE RD')) {
      mapped['Total Tonnage'] = mapped['Total Tonnage'] || 'ACCESS BLOCKED (No public LPRM PDF)';
      mapped['Unit Count'] = mapped['Unit Count'] || 'ACCESS BLOCKED';
      mapped['Engineer Name'] = mapped['Engineer Name'] || 'ACCESS BLOCKED';
      mapped['Engineer Firm'] = mapped['Engineer Firm'] || 'ACCESS BLOCKED';
      mapped['Primary Owner Contact'] = mapped['Primary Owner Contact'] || 'PENDING (ACC lookup/manual)';
      mapped['Design Intent'] = mapped['Design Intent'] || 'PENDING (Need plan set)';
      mapped['Electrical Sync'] = mapped['Electrical Sync'] || 'PENDING (Need equipment schedule)';
    } else {
      mapped['Total Tonnage'] = mapped['Total Tonnage'] || '';
      mapped['Unit Count'] = mapped['Unit Count'] || '';
      mapped['Engineer Name'] = mapped['Engineer Name'] || '';
      mapped['Engineer Firm'] = mapped['Engineer Firm'] || '';
      mapped['Primary Owner Contact'] = mapped['Primary Owner Contact'] || '';
      mapped['Design Intent'] = mapped['Design Intent'] || '';
      mapped['Electrical Sync'] = mapped['Electrical Sync'] || '';
    }

    outRows.push(mergedHeader.map((h) => mapped[h] ?? ''));
  }

  fs.writeFileSync(abs, toCsv(outRows), 'utf8');
  console.log(`Updated: ${abs}`);
}

main();
