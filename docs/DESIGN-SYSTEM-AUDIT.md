# NWFA — design-system audit (inconsistencies)

Scope: the 10 live pages (index + 9 subpages). Baseline for building one design system.
Date: 2026-09-04. Palette/nav/amber/dates already unified in a first pass; this maps what still diverges.

Severity: 🔴 breaks one-system feel · 🟠 visible drift · 🟡 minor/cleanup

---

## LOCKED DECISIONS (Peter, 2026-09-04)
- **01 nav** — ✅ **B** (in-wrap: nav edges align with content; +trade; wordmark→home; back-link on detail pages).
- **02 type scale + Vicky** — ⏳ awaiting (2–3 h1 sizes; Vicky for the payoff only, everywhere).
- **03 footer** — ✅ **dark block sitewide** (index switches from the paper `.foot` to the dark `.pfoot`).
- **04 closing ochre band** — ✅ **marketing pages only** (home, about, natural-wine). Add to natural-wine; keep off detail/list pages.
- **05 stat-bar** — ✅ **specstrip style** is the one component (label above, value below, cell dividers, optional stamp cell). Principle: **top rule aligns with the bottom edge of an adjacent image.**
- **06 icons** — ✅ keep colour (contrast element), **palette-tuned** version (yellow→amber, navy→ink, green stays). Card layout ⏳ (proposed **B ledger rows**); placement ⏳ (what's-on grid vs section-header emblems).
- **07 container** — ✅ **DONE.** One width 1280 + `--gutter:clamp(24px,5vw,64px)` everywhere.
- **content** — growers 40+, classes→workshops (15+), edition #5 history fixed. Dinner day/time ⏳ (info-kit = Sun 28 Feb 19:00–22:30 vs page's "night before").

---

## A · Layout & container 🔴
| page | max-width | gutter |
|---|---|---|
| index | 1180px | `var(--gutter)` = `max(56px,5vw)` |
| all 9 subpages | 1280px | fixed 46px |

**Decision needed:** one container token. Proposal: `--maxw:1280px; --gutter:clamp(24px,5vw,64px)` everywhere; retire the 1180/56 split on index.

## B · Navigation 🔴
Three implementations: index `.nav` (full-bleed), 8 pages `.top` (inside wrap), workshops `.topbar` (full-width bordered). Link sets differ: index has no "trade"; subpages have trade; movia/montsant carry a back-link.
**Decision:** one nav component (markup + CSS), one link set, one responsive rule. Detail pages get an optional back-link slot.

## C · Type scale (headings) 🔴
h1 max size is invented per page: index 76 · about/winemakers 84 · for-pro/participate 92 · natural-wine 74 · montsant 108 · dinner 118 · movia 148.
**Decision:** a fixed display scale (e.g. `--h1`, `--h2`, `--h3` clamps) and map every page onto it. Pick 2–3 sizes, not 8.

## D · Stat / spec bars 🟠
Different component per page: index `.specstrip` (5 cols + stamp), about `.stats` (4 cells), winemakers/workshops own stat rows, dinner `.c` cells. All do the same job (label + value row).
**Decision:** one `stat-bar` component with N cells + optional stamp/CTA cell.

## E · Footers 🟠
Two designs: index `.foot` (paper, Vicky "united by wine"), subpages `.pfoot` (dark ink block). 
**Decision:** one footer. Likely the dark `.pfoot` sitewide, or the paper `.foot` sitewide — pick one.

## F · Closing CTA band 🟠
index + about have the loud ochre "take your place / come meet them" band. Other subpages end differently (own footer only).
**Decision:** decide whether the ochre close is on every page or only the marketing pages.

## G · Section rhythm 🟡
index uses fixed `104px` section padding; about/others use `vh`-based (`7vh`, `3vh`…). Mixed systems → uneven spacing between pages.
**Decision:** one spacing scale (px or a `--space-*` set).

## H · "united by wine" payoff 🟡
index sets it in **Vicky** (display script, ochre). about sets "united by wine." as a plain Figtree h1. Same phrase, two treatments.
**Decision:** one rule for the payoff lockup.

## I · Amber-mark rule 🟡
Applied everywhere, but *what* gets marked varies: index counts (60+/300+/25+), about times, winemakers "22", cards sulphur, workshops "7", montsant time.
**Decision:** write the rule down — "mark the one scarce datum per module" — and apply it the same way.

## J · Colour token cleanup 🟡
about.html footer still uses old paper `rgba(231,225,208,…)` (rest of site is new `#ECE6D6` / `236,230,214`).
**Fix:** swap the two occurrences.

---

## Content / data inconsistencies (not design, but surfaced) 🔴
1. **Growers count:** homepage + winemakers say **60+**, info-kit says **40+**. Pick one.
2. **Edition number vs history:** page says **edition #5**, but the about history reads "sold-out pilot 2022 + editions 2023 and 2024" — that implies ~edition 4. The count doesn't add up. Confirm the true edition number and the history line.
3. **Two-day hours not reconciled:** homepage specstrip says `doors 13:00–22:00`; about stats say `tasting 13:00–18:15 / food & bar 13:00–22:00` — single-day figures. The real schedule (info-kit) is per-day: Sun 28 Feb 11:00–13:00 pros only → 13:00–18:15 all; Mon 1 Mar 10:00–16:00 trade. The marketing pages need to represent two days.
4. **for-professionals framing:** trade day is **Monday 1 March** specifically; the page should say so, not a generic date.
