#!/usr/bin/env node
// Vermelding intake service. Receives owner-form submissions, validates the token
// server-side against registry.js, applies basic anti-spam, and writes a "pending"
// row to Airtable for triage. No Airtable secrets ever reach the frontend.
//
// Run: PORT=8788 node server.mjs   (see .env.example / SETUP.md for the env vars)
// Dependency-free: Node 18+ (global fetch, crypto, http).
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 8788);
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*';
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || 'Vermeldingen';
// registry source: a local file (REGISTRY_PATH) and/or a URL (REGISTRY_URL, e.g. the
// deployed registry.js). If REGISTRY_URL is set it is refreshed periodically so new
// venues/tokens are picked up without redeploying this service.
const REGISTRY_PATH = process.env.REGISTRY_PATH
  || path.resolve(HERE, '..', '..', '..', 'natuurwijn-kaart', 'vermelding', 'registry.js');
const REGISTRY_URL = process.env.REGISTRY_URL || '';
const REGISTRY_REFRESH_MS = Number(process.env.REGISTRY_REFRESH_MS || 15 * 60 * 1000);

const MAX_BODY = 24 * 1024;          // 24KB request cap
const MAX_FIELD = 2000;              // per-field char cap
const MIN_FILL_MS = 2000;            // reject near-instant submits
const RATE_MAX = 8;                  // submissions per IP per window
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Owner-editable fields -> Airtable column names. Adjust the right-hand side to
// match your Airtable field names exactly (see SETUP.md).
const FIELD_MAP = {
  name: 'Name', type: 'Type', address: 'Address', website: 'Website',
  instagram: 'Instagram', story_nl: 'Story NL', story_en: 'Story EN',
  pick: 'Selection', pick_why: 'Why', hours: 'Hours',
};

// --- load registry (token hashes) ---
function parseRegistry(src) {
  const m = src.match(/window\.VENUE_REGISTRY\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!m) throw new Error('Could not parse registry source');
  return JSON.parse(m[1]);
}
let REGISTRY = parseRegistry(fs.readFileSync(REGISTRY_PATH, 'utf8'));

async function refreshFromUrl() {
  if (!REGISTRY_URL) return;
  try {
    const res = await fetch(REGISTRY_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('status ' + res.status);
    const next = parseRegistry(await res.text());
    if (Object.keys(next).length) { REGISTRY = next; console.log('[registry] refreshed from URL: %d venues', Object.keys(next).length); }
  } catch (e) {
    console.error('[registry] refresh failed, keeping current:', e.message);
  }
}
if (REGISTRY_URL) { refreshFromUrl(); setInterval(refreshFromUrl, REGISTRY_REFRESH_MS); }
const sha256hex = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

// --- naive in-memory rate limit (fine for one small instance) ---
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RATE_MAX;
}

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

async function writeToAirtable(venueName, slug, p) {
  const fields = { Name: venueName, Slug: slug, Status: 'pending', 'Submitted At': new Date().toISOString() };
  for (const [k, col] of Object.entries(FIELD_MAP)) if (p[k]) fields[col] = p[k];
  fields['Raw JSON'] = JSON.stringify(p).slice(0, 9000);

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  if (!res.ok) throw new Error('Airtable ' + res.status + ' ' + (await res.text()).slice(0, 300));
}

const server = http.createServer((req, res) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';

  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true, venues: Object.keys(REGISTRY).length });
  if (req.method !== 'POST' || !req.url.startsWith('/intake')) return send(res, 404, { error: 'not found' });

  let body = '', tooBig = false;
  req.on('data', (c) => { body += c; if (body.length > MAX_BODY) { tooBig = true; req.destroy(); } });
  req.on('end', async () => {
    if (tooBig) return send(res, 413, { error: 'too large' });
    let p;
    try { p = JSON.parse(body); } catch { return send(res, 400, { error: 'bad json' }); }

    // anti-spam: honeypot filled -> pretend success, write nothing
    if (p.company) return send(res, 200, { ok: true });
    if (typeof p.loadedMs === 'number' && p.loadedMs < MIN_FILL_MS) return send(res, 429, { error: 'too fast' });
    if (rateLimited(ip)) return send(res, 429, { error: 'rate limited' });

    // token validation (the hard gate)
    const entry = REGISTRY[p.slug];
    if (!entry) return send(res, 404, { error: 'unknown venue' });
    if (sha256hex(p.token || '') !== entry.h) return send(res, 403, { error: 'bad token' });

    // clamp field lengths
    for (const k of Object.keys(FIELD_MAP)) if (typeof p[k] === 'string') p[k] = p[k].slice(0, MAX_FIELD);
    const venueName = (entry.d && entry.d.name) || p.name || p.slug;

    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
      console.log('[intake] LOG-ONLY (no Airtable env). venue=%s slug=%s', venueName, p.slug);
      console.log(JSON.stringify(p));
      return send(res, 200, { ok: true, mode: 'log-only' });
    }
    try {
      await writeToAirtable(venueName, p.slug, p);
      console.log('[intake] wrote pending row for %s (%s)', venueName, p.slug);
      return send(res, 200, { ok: true });
    } catch (e) {
      console.error('[intake] airtable error:', e.message);
      return send(res, 502, { error: 'intake store failed' });
    }
  });
});

server.listen(PORT, () => {
  console.log(`vermelding intake on :${PORT}  venues=${Object.keys(REGISTRY).length}  airtable=${AIRTABLE_TOKEN ? 'on' : 'LOG-ONLY'}`);
});
