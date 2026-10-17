// Shared helpers for the vermelding (owner-page) tooling.
// Used by generate-registry.mjs, the intake server, and sync-from-airtable.mjs.
import crypto from 'node:crypto';
import fs from 'node:fs';

// Fields the owner page prefills / reads back. Order is intentional (matches the form).
export const PREFILL_FIELDS = [
  'name', 'type', 'address', 'website', 'instagram',
  'story_nl', 'story_en', 'pick', 'pick_why', 'hours',
];

// Load window.VENUES from the site data file without executing arbitrary JS.
export function loadVenues(venuesPath) {
  const src = fs.readFileSync(venuesPath, 'utf8');
  const m = src.match(/window\.VENUES\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!m) throw new Error('Could not find window.VENUES array in ' + venuesPath);
  return JSON.parse(m[1]);
}

// Rewrite venues.js preserving the one-record-per-line format and the header comment.
export function writeVenues(venuesPath, venues) {
  const src = fs.readFileSync(venuesPath, 'utf8');
  const headerMatch = src.match(/^([\s\S]*?)window\.VENUES\s*=\s*\[/);
  const header = headerMatch ? headerMatch[1] : '';
  const body = venues.map((v) => JSON.stringify(v)).join(',\n');
  fs.writeFileSync(venuesPath, `${header}window.VENUES = [\n${body}\n];\n`);
}

export function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/&/g, ' en ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'venue';
}

// Deterministic unique slug per venue, keyed by name (+ index on collision).
export function buildSlugs(venues) {
  const seen = new Map();
  return venues.map((v, i) => {
    let base = slugify(v.name);
    if (seen.has(base)) base = `${base}-${i}`;
    seen.set(base, true);
    return base;
  });
}

export function newToken() {
  // 16 random bytes -> 22-char url-safe string. Unguessable; this is the real secret.
  return crypto.randomBytes(16).toString('base64url');
}

export function sha256hex(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex');
}
