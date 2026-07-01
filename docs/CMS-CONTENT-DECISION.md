# CMS & Content — Natural Wine Festival A'dam

> ⚠️ SUPERSEDED (2026-07-01) by `STACK-CONVENTION.md`. The CMS direction below
> (data-as-files, no Astro/Sanity) is no longer the plan: the site now runs on Astro +
> Sveltia (git-based CMS). Airtable is kept only as the public intake form + triage, with a
> one-way Claude-Code sync into git/Sveltia. Kept for history. Forms-routing and email
> nuance still hold.
>
> How content is managed for the custom static site, and where forms point.
> Decided May 2026. Companion to `MARKETING-TECH-STACK.md` and `REDESIGN-PLAN.md`.

## Principle — how *little* CMS, not which CMS

The question isn't "which CMS" — it's "how little can we get away with." For a once-a-year event the honest answer is **almost none**. Two reasons:

1. **~80% of our "content" is structured data, not prose.** The winemakers register (~60 rows) and the programme (~25 workshops) are *tables* — the right tool is a spreadsheet/Airtable, not a headless CMS.
2. **GHL already owns the dynamic layer.** Forms, leads, newsletter, automations live in GHL. So the site only manages *display content*, which is small and seasonal (updated once a year + line-up reveals).

**Decision: no headless CMS (Sanity), no framework re-platform (Astro). Data-as-files + a friendly intake surface → a light build → the Label templates → existing GitHub → Coolify pipeline.**

## Where content lives

| Content type | Lives in | Why |
|---|---|---|
| **Winemakers register** (~60) | **Airtable** *(default)* or `data/winemakers.json` | Structured fields, photo attachments, validation, easy editing |
| **Programme / workshops** (~25) | same as register | Same table logic (title, time, host, room, description) |
| **Journal / editorial** (manifesto pieces) | **Markdown in the repo** | Low volume, prose, diffable |
| **About / dinner / market / FAQ / practical** | **In code** (Label templates) | Rarely changes |

A **tiny build step** renders the Label components from this data → commit/publish → **GitHub → Coolify** rebuilds. No database, no monthly CMS licence, fully owned.

> Note the nuance: a *minimal build* (data → templates) is **not** the same beast as "Astro + Sanity." We can have a light generator without a headless CMS service and without a full framework platform.

## The variable that decides Airtable vs. JSON-in-repo

**Who edits the line-up, and does it need to be live-instant?**

- **Only Super Stories / dev-side, seasonally** → `JSON/Markdown in the repo`. Edit → push → live. Maximally minimal.
- **Non-technical partners edit year-round, or makers submit their own data** → **Airtable** as single source of truth, with an intake form (below). A webhook or "publish" button triggers the Coolify rebuild.

**Default recommendation: Airtable** for register + programme — because of the single-source-of-truth bonus below.

## Forms — route by *what they capture*

We work with forms throughout — but they point at different systems by purpose:

| Form captures… | POSTs to | Why |
|---|---|---|
| **People** — newsletter, professionals/trade, sponsors, "notify me" | **GHL** | They're contacts → CRM record + tags + automation |
| **Content/data** — winemaker profile (region, farming, sulphur, photo), workshop submission | **Airtable** | It's a register row, not a lead; native structured fields + uploads |

Per the stack rule: forms are **on-brand (Label-styled) and POST via API** — never the default GHL/Airtable iframe pasted onto the premium site.

## The single-source-of-truth bonus

One register row — `oller del mas · catalonia · biodynamic · <20 mg/l` — feeds **three outputs**:

1. the **register section** on the homepage,
2. the individual **winemaker page**,
3. the **maker-reveal Instagram post** (social Route 1).

The maker fills in the intake form once → it becomes a row → website profile and IG label both roll out of it. We never re-type disclosure data, and Route 1 becomes scalable.

## Email — recap (from the stack doc)

- **Marketing / lifecycle email** (announcements, reveals, countdowns, post-event) → **GHL**.
- **Transactional email** (ticket, QR, order confirmation) → **stays on Eventix**.

### Open tracking — yes, but trust clicks, not opens
GHL tracks opens, clicks, bounces, unsubscribes, replies, and can automate off them. **But open tracking is unreliable**: it uses a pixel, and since Apple Mail Privacy Protection (2021) Apple Mail pre-loads it for everyone → inflated/false opens; image-blocking clients hide real ones.

- **Opens** → directional trend only (A vs B), not truth.
- **Clicks** → the real engagement signal, and they feed the attribution chain (click → UTM → site → GHL tag → Eventix purchase webhook → revenue).
- *Opens for vibes, clicks for decisions, the purchase webhook for the truth.*

## Why not Sanity / Astro

- **Sanity** = a hosted headless CMS with its own schema/studio/API/hosting/billing/learning curve — built for content-heavy, multi-editor, high-velocity products. We have ~85 seasonal structured records + a few static pages. Like buying a forklift to move a bookshelf once a year.
- **Astro** = a fine static framework, but adopting it now means re-platforming the hand-built Label HTML into a component toolchain. If we want light templating from data, a minimal generator covers it without the full platform.

## Open / next

- Decide **Airtable vs JSON-in-repo** (depends on the editor/cadence question above). Leaning Airtable.
- Define the **Airtable schema**: winemakers (name, region, country, farming, added yeast, sulphur, importer, photo, blurb, link) + programme (title, time, host, room, description, type).
- Build the **winemaker intake form** (on-brand → Airtable) and the **newsletter/trade forms** (on-brand → GHL API).
- Wire the **publish → Coolify rebuild** trigger (webhook or manual button).
- Confirm one register row can template both a site profile and an IG label from the same fields.
