# Stack convention — Natural Wine Festival A'dam

> The locked technical convention for this site. Decided 2026-07-01.
> Supersedes the CMS/stack sections of `CMS-CONTENT-DECISION.md` and `CMS-WORKFLOW.md`
> (both described an Airtable + **Sanity** content path; Sanity is dropped, Airtable is
> kept only as the intake surface). The marketing/attribution layer in
> `MARKETING-TECH-STACK.md` still stands.

## The decision, in one line

**NWFA runs on the SuperStories Astro + Sveltia stack.** Content lives as
markdown/JSON in the site's own git repo, edited through Sveltia at `/admin`, built by
Astro, deployed GitHub → Coolify. No Sanity.

**Intake flow (the recommended default):**

```
Distributor/host           Airtable                  Claude-Code sync         Sveltia / git            Astro
────────────────           ────────                  ────────────────         ─────────────            ─────
fills public form   →   lands as a row          →   on "approved":       →   draft in the repo   →   renders
(no login, mobile,      + triage grid (PM            small 1-way script       PM polishes:            site,
 photo upload)          fixes typos, asks for        pulls the row + photo,   NL translation,         live ~60s
                        better photo, marks          resizes it, commits      focal point, link
                        "approved")                  as a Sveltia draft;      workshop↔host,
                                                     row then freezes         publish
```

Why this shape: **Airtable owns the annoying part** (public no-login form, mobile photo
upload, spam handling, a triage grid) that is expensive to rebuild ourselves — this is a
back-of-house B2B form the public never sees, so off-brand is fine. **Git/Sveltia owns the
source of truth** and the on-brand render. The only thing we build is the small one-way
sync script — fast and cheap in Claude Code, no re-typing, no overbuild.

A fully on-brand custom intake form on the site itself is nicer but reintroduces upload +
spam + moderation to build. That is a **v2 option, not needed for edition 1.**

The full playbook for this stack is the canonical
`ProprietarySuperStories/websites/recipes/astro-sveltia-workflow.md` (identical copies
also at Builds root and in `WholenessWorkWebsite/`). Follow it verbatim.

## What changed from the earlier plan

- **Sanity is dropped.** No hosted headless CMS. Sveltia (git-based, open-source, no
  monthly fee, no vendor lock-in) owns the editable content instead.
- **Airtable stays — but only as the intake surface, not as a content store.** It keeps
  the public form + triage grid it is best at. It no longer syncs into Sanity or acts as a
  source of truth; a small one-way Claude-Code script exports an approved row into git as a
  Sveltia draft, after which the Airtable row freezes.
- **The source of truth moved from Airtable/Sanity to git.** One content system now: git
  holds the truth, Sveltia is the editor. Airtable is upstream of it, one direction only.

## The stack

| Layer | Tool | Role |
|---|---|---|
| **Site / pages** | **Astro** (static, `build: { format: 'directory' }`) | Ports the hand-built Label design into `.astro` pages + content collections |
| **CMS / editor** | **Sveltia** at `/admin` | Git-based editor; `config.yml` mirrors the Astro collections 1:1, plain-language labels grouped by page |
| **Content store** | **GitHub** | Source of truth — markdown/JSON in the repo, full history, client-ownable |
| **Distributor / host intake** | **Airtable** (public form + triage) → **Claude-Code one-way sync** → git | Airtable's public no-login form + photo upload + triage grid; a small script exports approved rows into git as Sveltia drafts. Dead simple for low tool-literacy submitters (see memory `nwfa-distributor-literacy`). A fully on-brand custom form is a v2 option |
| **Host** | **Coolify** (Dockerfile: node build → nginx serve) | Rebuilds on every commit, SSL included |
| **DNS** | **Cloudflare** (A record → Coolify IP, grey cloud) | DNS only, not Cloudflare Pages |
| **Ticketing** | **Eventix** *(stays)* | Tickets, Winemaker's Dinner, workshops, QR, door scan |
| **CRM / marketing / attribution** | **GoHighLevel** *(stays)* | CRM, marketing email, automations, attribution — per `MARKETING-TECH-STACK.md` |

## How the two form types differ (important)

Two different "forms," routed by what they capture — do not conflate them:

- **People / leads** (newsletter, trade, sponsors, "notify me") → on-brand form **POSTs
  to the GHL API**. They become CRM contacts. Never a pasted GHL iframe.
- **Content / register rows** (winemaker profile, workshop submission) → **Airtable form**,
  then the one-way Claude-Code sync into git/Sveltia. This is the content-intake path, not
  a lead path.

## Deploy loop

- Dev/design changes: edit repo → push → Coolify rebuilds → live.
- Content edits: Sveltia save → commit → rebuild → live (~1–10 min).
- Intake submissions: Airtable form → approve → sync commits a draft → PM polishes in
  Sveltia → publish.

## Still open

- Build the one-way Airtable → git sync script (pull approved row + attachment, resize the
  image, commit as a Sveltia draft in the collection's format).
- Astro port of the current hand-built Label HTML pages.
- Sveltia GitHub OAuth helper setup (per the workflow doc, step 6).
- Optional v2: a fully on-brand custom intake form to replace the Airtable form.
