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
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMoney(raw) {
  const cleaned = String(raw || '').replace(/[^0-9.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseIssueDate(raw) {
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d;
  return new Date('1970-01-01T00:00:00Z');
}

function inferCity(addressRaw) {
  const address = String(addressRaw || '');
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const city = parts[parts.length - 2];
    if (city && city.length <= 40) return city.toUpperCase();
  }
  return 'PHOENIX';
}

function inferProjectType(rowObj, valuation) {
  const text = normalize([rowObj.Subdivision, rowObj.Owner, rowObj.Contractor, rowObj.Type].join(' | '));
  if (/\bllc\b|\binc\b|\bcorp\b|\bcompany\b|\bcenter\b|\bplaza\b|\bpark\b|\bcity of\b/.test(text)) {
    return 'Commercial';
  }
  if (valuation >= 20000) return 'Commercial';
  return 'Residential';
}

const negativePatterns = [
  /\bplumb(?:ing)?\b/i,
  /\bsewer\b/i,
  /\bwater heater\b/i,
  /\bbackflow\b/i,
  /\blighting\b/i,
  /\boutlet\b/i,
  /\blow voltage\b/i,
  /\bsolar(?: pv)?\b/i,
  /\broof(?:ing)?\b/i,
  /\bsiding\b/i,
  /\bfence\b/i,
  /\bdrywall\b/i,
  /\bfire\b/i,
  /\bsprinkler\b/i,
  /\balarm\b/i,
  /\bsign\b/i
];

const hvacSignalPatterns = [
  // Tier A: equipment / trade
  /\brtu\b/i,
  /\bchiller\b/i,
  /\bfurnace\b/i,
  /\bheat pump\b/i,
  /\bboiler\b/i,
  /\bair handler\b/i,
  /\bahu\b/i,
  /\bcondensing unit\b/i,
  /\bmini[- ]split\b/i,
  /\bvav\b/i,
  /\bvrf\b/i,
  /\bmechanical permit\b/i,
  /\bhvac swap\b/i,
  /\bac replacement\b/i,
  /\brefrigeration\b/i,

  // Brand names
  /\btrane\b/i,
  /\bcarrier\b/i,
  /\blennox\b/i,
  /\byork\b/i,
  /\bmitsubishi\b/i,
  /\bdaikin\b/i,
  /\brheem\b/i,
  /\bgoodman\b/i,

  // Contractor/license signals
  /\bc-?20\b/i,
  /\br-?39\b/i,
  /\bc-?39\b/i,
  /\bs-?1\b/i,
  /\bs-?2\b/i,
  /\bclass [ab] mechanical\b/i,
  /\bh3-i\b/i,
  /\bmc[- ]?\d{2,}\b/i,
  /\bhvac-r\b/i,
  /\bmechanical\b/i,
  /\bair conditioning\b/i,
  /\bheating (?:&|and) cooling\b/i,
  /\bclimate control\b/i,
  /\bthermal services\b/i,
  /\bsheet metal\b/i,
  /\bgoettl\b/i,
  /\bservice champions\b/i,
  /\bars\/rescue rooter\b/i,
  /\bone hour heating(?: &| and) air\b/i,
  /\bhorizon services\b/i,
  /\bdel-?air\b/i,

  // Components / units
  /\bduct(?:work|ing)?\b/i,
  /\bventilation\b/i,
  /\bexhaust fan\b/i,
  /\bcoil\b/i,
  /\bcompressor\b/i,
  /\bline set\b/i,
  /\brefrigerant\b/i,
  /\bthermostat\b/i,
  /\bbas\b/i,
  /\b\d+[- ]?ton\b/i,
  /\b\d+[- ]?tons\b/i,
  /\bbtu\b/i,
  /\bseer\b/i,
  /\bafue\b/i,
  /\bcfm\b/i,

  // Action verbs
  /\bchange[- ]out\b/i,
  /\breplacement\b/i,
  /\bretrofit\b/i,
  /\bsplit system\b/i,
  /\bair handler install\b/i,
  /\bac swap\b/i,

  // Abbreviations / short forms
  /\bmech\b/i,
  /\brepl\b/i,
  /\bswap\b/i,
  /\bchangeout\b/i,
  /\bfcu\b/i,
  /\bc-?20\b/i,
  /\bh-?3\b/i,
  /\bcoil\b/i,
  /\bcondenser\b/i,
  /\bfurnace\b/i,
  /\bheat pump\b/i
];

const highPriorityPatterns = [
  /\brtu\b/i,
  /\bchiller\b/i,
  /\bfurnace\b/i,
  /\bheat pump\b/i,
  /\bboiler\b/i,
  /\bair handler\b/i,
  /\bahu\b/i,
  /\bcondensing unit\b/i,
  /\bmini[- ]split\b/i,
  /\bvav\b/i,
  /\bvrf\b/i,
  /\bmechanical permit\b/i,
  /\bhvac swap\b/i,
  /\bac replacement\b/i,
  /\brefrigeration\b/i,
  /\bc-?20\b/i,
  /\br-?39\b/i,
  /\bc-?39\b/i,
  /\bs-?1\b/i,
  /\bs-?2\b/i,
  /\bclass [ab] mechanical\b/i,
  /\bh3-i\b/i,
  /\bmc[- ]?\d{2,}\b/i,
  /\bhvac-r\b/i,
  /\bmechanical\b/i,
  /\bair conditioning\b/i,
  /\bheating (?:&|and) cooling\b/i,
  /\bclimate control\b/i,
  /\bthermal services\b/i,
  /\bsheet metal\b/i,
  /\bchange[- ]out\b/i,
  /\breplacement\b/i,
  /\bretrofit\b/i,
  /\bsplit system\b/i,
  /\bair handler install\b/i,
  /\bac swap\b/i
];

const brandOnlyPatterns = [
  /\btrane\b/i,
  /\bcarrier\b/i,
  /\blennox\b/i,
  /\byork\b/i,
  /\bmitsubishi\b/i,
  /\bdaikin\b/i,
  /\brheem\b/i,
  /\bgoodman\b/i,
  /\bgoettl\b/i,
  /\bservice champions\b/i,
  /\bars\/rescue rooter\b/i,
  /\bone hour heating(?: &| and) air\b/i,
  /\bhorizon services\b/i,
  /\bdel-?air\b/i
];

const contextualPairGroups = [
  [/\bunit\b/i, /\broof\b/i, 'unit+roof'],
  [/\bsplit\b/i, /\bsystem\b/i, 'split+system'],
  [/\bcoil\b/i, /\bgas\b/i, 'coil+gas'],
  [/\bduct(?:work|ing)?\b/i, /\bventilation\b/i, 'duct+ventilation'],
  [/\bexhaust\b/i, /\bfan\b/i, 'exhaust+fan'],
  [/\bclimate\b/i, /\bcontrol\b/i, 'climate+control']
];

// "Secondary hooks" to avoid false negatives:
// if these appear, move to HVAC Review rather than Trash.
const secondaryHookPatterns = [
  /\ba\/?c\.?\b/i,
  /\bmech(?:anical)?\b/i,
  /\brepl(?:acement)?\b/i,
  /\bswap\b/i,
  /\brtu\b/i,
  /\bahu\b/i,
  /\bfcu\b/i,
  /\bc-?20\b/i,
  /\bh-?3\b/i,
  /\bcondensing\b/i,
  /\bventilation\b/i,
  /\bductwork\b/i,
  /\bthermostat\b/i,
  /\bgas line\b/i,
  /\bseer\b/i,
  /\bbtu\b/i,
  /\bafue\b/i,
  /\bchangeout\b/i,
  /\bcoil\b/i,
  /\bcondenser\b/i,
  /\bfurnace\b/i,
  /\bheat pump\b/i
];

function getSignals(text) {
  const signals = [];
  for (const pattern of hvacSignalPatterns) {
    if (pattern.test(text)) signals.push(pattern.source.replace(/\\b/g, ''));
  }
  return [...new Set(signals)];
}

function getContextPairs(text) {
  const pairs = [];
  for (const [a, b, label] of contextualPairGroups) {
    if (a.test(text) && b.test(text)) pairs.push(label);
  }
  return pairs;
}

function getNegatives(text) {
  const found = [];
  for (const pattern of negativePatterns) {
    if (pattern.test(text)) found.push(pattern.source.replace(/\\b/g, ''));
  }
  return [...new Set(found)];
}

function getSecondaryHooks(text) {
  const found = [];
  for (const pattern of secondaryHookPatterns) {
    if (pattern.test(text)) found.push(pattern.source.replace(/\\b/g, ''));
  }
  return [...new Set(found)];
}

function classifyLead(rowObj) {
  const searchable = normalize(
    [rowObj.Type, rowObj.Use, rowObj.Subdivision, rowObj.Contractor, rowObj['Plan Num'], rowObj.Owner, rowObj.Address].join(' | ')
  );
  const valuation = parseMoney(rowObj.Valuation);
  const signals = getSignals(searchable);
  const contextPairs = getContextPairs(searchable);
  const negatives = getNegatives(searchable);
  const secondaryHooks = getSecondaryHooks(searchable);
  const highSignals = highPriorityPatterns.filter((p) => p.test(searchable));
  const brandSignals = brandOnlyPatterns.filter((p) => p.test(searchable));
  const hasMechanicalOnly = /\bmechanical\b/i.test(searchable) && signals.length <= 1;
  const tonnageMatch = /\b([1-9]|[1-4][0-9]|50)\s*[- ]?\s*tons?\b/i.test(searchable);

  // Negative filter first when there is little/no HVAC context.
  if (negatives.length > 0 && signals.length === 0 && contextPairs.length === 0) {
    return { bucket: 'trash', priority: 'Trash', reason: `negative=${negatives.join('|')}`, signals: [] };
  }

  // Tier A: instant HVAC match
  if (tonnageMatch && negatives.length === 0) {
    return { bucket: 'hvac', priority: 'High Priority', reason: 'tonnage_auto_master', signals: ['tonnage'] };
  }

  if (highSignals.length > 0 && negatives.length === 0) {
    return { bucket: 'hvac', priority: 'High Priority', reason: 'tier_a', signals };
  }

  // Brand-only signal needs context to avoid false positives.
  if (brandSignals.length > 0 && negatives.length === 0) {
    if (contextPairs.length > 0 || highSignals.length > 0 || /hvac|mechanical|air|cooling|heating|refriger/.test(searchable)) {
      return { bucket: 'hvac', priority: 'Medium Priority', reason: 'brand_with_context', signals };
    }
    return { bucket: 'review', priority: 'Medium Priority - Review', reason: 'brand_only', signals };
  }

  // Tier B: contextual pair logic
  if (contextPairs.length >= 2 || (contextPairs.length >= 1 && negatives.length === 0)) {
    return { bucket: 'hvac', priority: 'Medium Priority', reason: 'tier_b', signals: contextPairs };
  }

  // Tier C: mechanical valuation catch-all
  if (hasMechanicalOnly) {
    if (valuation > 20000) {
      return {
        bucket: 'hvac',
        priority: 'Large Mechanical/Potential Commercial HVAC',
        reason: 'tier_c',
        signals: ['mechanical', 'valuation>20000']
      };
    }
    if (valuation >= 4000 && valuation <= 15000) {
      return {
        bucket: 'hvac',
        priority: 'Likely Residential Change-out',
        reason: 'tier_c',
        signals: ['mechanical', 'valuation_4000_15000']
      };
    }
    if (valuation < 1000) {
      return { bucket: 'review', priority: 'Low Value/Service Call', reason: 'tier_c_low', signals: ['mechanical', 'low_valuation'] };
    }
  }

  // Mechanical safety net requested:
  // valuation > $5,000 + mechanical/mech => HVAC Review
  if (valuation > 5000 && /\bmech(?:anical)?\b/i.test(searchable)) {
    return {
      bucket: 'review',
      priority: 'HVAC Review - Mechanical Safety Net',
      reason: 'mechanical_over_5000',
      signals: ['mechanical', 'valuation>5000']
    };
  }

  // Secondary hooks requested:
  // if present but not high-confidence, keep in review (not trash).
  if (secondaryHooks.length > 0) {
    return {
      bucket: 'review',
      priority: 'HVAC Review - Secondary Hook',
      reason: 'secondary_hook',
      signals: secondaryHooks
    };
  }

  // Mixed / ambiguous
  if (signals.length > 0 || contextPairs.length > 0) {
    return {
      bucket: negatives.length ? 'review' : 'hvac',
      priority: negatives.length ? 'Medium Priority - Review' : 'Medium Priority',
      reason: negatives.length ? `mixed_negative=${negatives.join('|')}` : 'context_signal',
      signals: [...signals, ...contextPairs]
    };
  }

  return { bucket: 'trash', priority: 'Trash', reason: 'no_hvac_signal', signals: [] };
}

function dedupeByAddressWithin30Days(records) {
  const sorted = [...records].sort((a, b) => b.issueDateObj - a.issueDateObj);
  const kept = [];
  const indexByAddress = new Map();

  for (const r of sorted) {
    const key = normalize(r.address);
    if (!key) {
      kept.push(r);
      continue;
    }

    const existingIndex = indexByAddress.get(key);
    if (existingIndex === undefined) {
      indexByAddress.set(key, kept.length);
      kept.push(r);
      continue;
    }

    const existing = kept[existingIndex];
    const dayDiff = Math.abs(existing.issueDateObj - r.issueDateObj) / (1000 * 60 * 60 * 24);

    if (dayDiff <= 30) {
      const mergedSignals = new Set([...existing.keyScopeTerms.split('|').filter(Boolean), ...r.keyScopeTerms.split('|').filter(Boolean)]);
      const mergedPermits = new Set([...existing.permitIds.split('|').filter(Boolean), r.fullPermitNumber || r.permitId]);
      const winner = existing.valuation >= r.valuation ? existing : r;

      const merged = {
        ...winner,
        permitIds: Array.from(mergedPermits).join('|'),
        keyScopeTerms: Array.from(mergedSignals).join('|')
      };
      kept[existingIndex] = merged;
    } else {
      indexByAddress.set(key, kept.length);
      kept.push(r);
    }
  }

  return kept;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: npm run filter:hvac -- "<input-csv-path>"');
    process.exit(1);
  }

  const absInput = path.resolve(inputPath);
  if (!fs.existsSync(absInput)) {
    console.error(`Input file not found: ${absInput}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absInput, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  if (rows.length < 3) {
    console.error('CSV is too short.');
    process.exit(1);
  }

  const headerIndex = rows.findIndex((r) => r[0] === 'Type' && r[1] === 'Number');
  if (headerIndex === -1) {
    console.error('Could not find header row (Type, Number, ...).');
    process.exit(1);
  }

  const header = rows[headerIndex];
  const dataRows = rows.slice(headerIndex + 1).filter((r) => r.some((c) => String(c || '').trim() !== ''));
  const asObj = (r) => Object.fromEntries(header.map((h, i) => [h, r[i] || '']));

  const hvac = [];
  const review = [];
  const trash = [];

  for (const row of dataRows) {
    const obj = asObj(row);
    const issueDateObj = parseIssueDate(obj['Issue Date']);
    const valuation = parseMoney(obj.Valuation);
    const city = inferCity(obj.Address);
    const projectType = inferProjectType(obj, valuation);
    const classification = classifyLead(obj);

    const permitTypeCode = String(obj.Type || '').trim();
    const permitId = String(obj.Number || '').trim();
    const fullPermitNumber = permitTypeCode && permitId ? `${permitTypeCode}-${permitId}` : permitId;
    const permitDetailsUrl = fullPermitNumber
      ? `https://apps-secure.phoenix.gov/PDD/Search/PermitDetails?permitNum=${encodeURIComponent(fullPermitNumber)}`
      : '';

    const mapped = {
      permitTypeCode,
      permitId,
      fullPermitNumber,
      permitIds: fullPermitNumber || permitId,
      address: obj.Address,
      city,
      issueDate: obj['Issue Date'],
      issueDateObj,
      projectType,
      valuation,
      contractor: obj.Contractor,
      planDocName: obj['Plan Num'],
      permitDetailsUrl,
      keyScopeTerms: classification.signals.join('|'),
      priority: classification.priority,
      reason: classification.reason
    };

    if (classification.bucket === 'hvac') hvac.push(mapped);
    else if (classification.bucket === 'review') review.push(mapped);
    else trash.push(mapped);
  }

  const dedupedHvac = dedupeByAddressWithin30Days(hvac);

  const byNewestThenValue = (a, b) => {
    if (b.issueDateObj - a.issueDateObj !== 0) return b.issueDateObj - a.issueDateObj;
    return b.valuation - a.valuation;
  };

  dedupedHvac.sort(byNewestThenValue);
  review.sort(byNewestThenValue);
  trash.sort(byNewestThenValue);

  const masterHeader = [
    'permit_type_code',
    'permit_id',
    'full_permit_number',
    'permit_details_url',
    'merged_permit_ids',
    'address',
    'city',
    'issue_date',
    'project_type',
    'valuation',
    'contractor',
    'plan_doc_name',
    'key_scope_terms',
    'priority',
    'reason'
  ];

  const toOutRow = (r) => [
    r.permitTypeCode,
    r.permitId,
    r.fullPermitNumber,
    r.permitDetailsUrl,
    r.permitIds,
    r.address,
    r.city,
    r.issueDate,
    r.projectType,
    r.valuation.toFixed(2),
    r.contractor,
    r.planDocName,
    r.keyScopeTerms,
    r.priority,
    r.reason
  ];

  const outDir = path.resolve('output');
  fs.mkdirSync(outDir, { recursive: true });

  const hvacPath = path.join(outDir, 'hvac_master9.csv');
  const reviewPath = path.join(outDir, 'hvac_review.csv');
  const trashPath = path.join(outDir, 'hvac_trash.csv');
  const summaryPath = path.join(outDir, 'hvac_filter_summary.json');

  fs.writeFileSync(hvacPath, toCsv([masterHeader, ...dedupedHvac.map(toOutRow)]));
  fs.writeFileSync(reviewPath, toCsv([masterHeader, ...review.map(toOutRow)]));
  fs.writeFileSync(trashPath, toCsv([masterHeader, ...trash.map(toOutRow)]));

  const summary = {
    source_file: absInput,
    total_rows: dataRows.length,
    hvac_master_rows: dedupedHvac.length,
    hvac_review_rows: review.length,
    trash_rows: trash.length,
    generated_at: new Date().toISOString(),
    notes: [
      'Sorted by Issue Date (newest first) then Valuation (highest first).',
      'Deduped by same address within 30 days into merged_permit_ids.',
      'Use hvac_master9.csv as primary lead list.'
    ]
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`Done.
Source: ${absInput}
Total rows: ${dataRows.length}
HVAC master rows: ${dedupedHvac.length}
HVAC review rows: ${review.length}
Trash rows: ${trash.length}
Files:
- ${hvacPath}
- ${reviewPath}
- ${trashPath}
- ${summaryPath}`);
}

main();
