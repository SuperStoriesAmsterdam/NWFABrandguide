#!/usr/bin/env node
// One-way sync: approved Airtable rows -> venues.js -> git commit.
// This is the triage->git step (LOCKED CMS architecture: Airtable is intake+triage only,
// venues.js in git is the source of truth; Claude Code runs this sync).
//
//   node scripts/vermelding/sync-from-airtable.mjs            # live: read Airtable, write, commit
//   node scripts/vermelding/sync-from-airtable.mjs --dry-run  # show what would change, write nothing
//   node scripts/vermelding/sync-from-airtable.mjs --from-json fixture.json  # test without Airtable
//
// Env (live mode): AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE (default "Vermeldingen").
// It reads rows with Status = "approved", applies them, then sets those rows to "live".
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadVenues, writeVenues, buildSlugs } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const VENUES_PATH = path.join(ROOT, 'natuurwijn-kaart', 'data', 'venues.js');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const fromJsonIdx = args.indexOf('--from-json');
const FROM_JSON = fromJsonIdx > -1 ? args[fromJsonIdx + 1] : null;

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || 'Vermeldingen';

// Airtable column -> venue field. Owner fields + allowed corrections.
const COL_TO_FIELD = {
  Name: 'name', Type: 'type', Address: 'address', Website: 'website',
  Instagram: 'instagram', 'Story NL': 'story_nl', 'Story EN': 'story_en',
  Selection: 'pick', Why: 'pick_why', Hours: 'hours',
};

function normWebsite(v) {
  v = String(v).trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : 'https://' + v.replace(/^\/+/, '');
}
function normInstagram(v) {
  v = String(v).trim();
  if (!v) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return 'https://instagram.com/' + v.replace(/^@/, '').replace(/^\/+/, '');
}

// --- fetch approved rows ---
async function fetchApproved() {
  if (FROM_JSON) {
    const data = JSON.parse(fs.readFileSync(FROM_JSON, 'utf8'));
    return Array.isArray(data) ? data : data.records || [];
  }
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    throw new Error('Set AIRTABLE_TOKEN + AIRTABLE_BASE_ID, or use --from-json <file>.');
  }
  const out = [];
  let offset = '';
  do {
    const u = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`);
    u.searchParams.set('filterByFormula', '{Status}="approved"');
    u.searchParams.set('pageSize', '100');
    if (offset) u.searchParams.set('offset', offset);
    const res = await fetch(u, { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
    if (!res.ok) throw new Error('Airtable ' + res.status + ' ' + (await res.text()).slice(0, 300));
    const j = await res.json();
    out.push(...j.records);
    offset = j.offset || '';
  } while (offset);
  return out;
}

async function markLive(ids) {
  if (FROM_JSON || !ids.length) return;
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10).map((id) => ({ id, fields: { Status: 'live', 'Synced At': new Date().toISOString() } }));
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: batch, typecast: true }),
    });
    if (!res.ok) throw new Error('Airtable PATCH ' + res.status + ' ' + (await res.text()).slice(0, 300));
  }
}

(async function main() {
  const venues = loadVenues(VENUES_PATH);
  const slugs = buildSlugs(venues);
  const slugToIdx = new Map(slugs.map((s, i) => [s, i]));

  const rows = await fetchApproved();
  console.log(`approved rows: ${rows.length}`);

  const changedSummary = [];
  const appliedIds = [];

  for (const row of rows) {
    const f = row.fields || row;
    const slug = f.Slug || f.slug;
    const idx = slug != null ? slugToIdx.get(slug) : undefined;
    if (idx === undefined) { console.warn(`! skip: no venue for slug "${slug}" (row ${row.id || '?'})`); continue; }
    const v = venues[idx];
    const changes = [];

    for (const [col, field] of Object.entries(COL_TO_FIELD)) {
      let val = f[col];
      if (val == null || String(val).trim() === '') continue;
      val = String(val).trim();
      if (field === 'website') val = normWebsite(val);
      if (field === 'instagram') val = normInstagram(val);
      if (v[field] !== val) { changes.push(`${field}`); v[field] = val; }
    }

    if (changes.length) {
      changedSummary.push(`  ${v.name} [${slug}]: ${changes.join(', ')}`);
      if (row.id) appliedIds.push(row.id);
    }
  }

  if (!changedSummary.length) { console.log('nothing to apply.'); return; }
  console.log('changes:\n' + changedSummary.join('\n'));

  if (DRY) { console.log('\n--dry-run: venues.js NOT written, nothing committed, Airtable untouched.'); return; }

  writeVenues(VENUES_PATH, venues);
  console.log(`wrote ${path.relative(ROOT, VENUES_PATH)}`);

  // regenerate registry so the owner pages prefill the latest data
  execFileSync('node', [path.join(HERE, 'generate-registry.mjs')], { stdio: 'inherit', cwd: ROOT });

  // commit (venues.js + registry.js only)
  execFileSync('git', ['-C', ROOT, 'add', 'natuurwijn-kaart/data/venues.js', 'natuurwijn-kaart/vermelding/registry.js'], { stdio: 'inherit' });
  const msg = `kaart: sync ${changedSummary.length} approved owner submission(s) from airtable`;
  execFileSync('git', ['-C', ROOT, 'commit', '-m', msg], { stdio: 'inherit' });
  console.log('committed.');

  await markLive(appliedIds);
  console.log(`marked ${appliedIds.length} row(s) live in airtable.`);
})().catch((e) => { console.error(e.message); process.exit(1); });
