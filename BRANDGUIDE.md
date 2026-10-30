# Natural Wine Festival A'dam: Brand Guide

> united by wine

Edition 05 · 28 feb + 1 mar '27 · De Hallen, Amsterdam

---

## 01 Brand overview

**Name:** natural wine festival a'dam. The wordmark is always lowercase and always carries a'dam.
**Short name:** NWFA
**Parent brand:** Green is Golden
**Location:** De Hallen, Amsterdam
**URL:** naturalwinefestival.nl
**Instagram:** @naturalwinefestival.ams
**Payoff:** united by wine

The festival is a two-day celebration of natural wine culture: winemakers, food, workshops, tastings and community. The identity this edition sits on a warm cream surface with a deep forest-green dark layer. Type is lowercase Figtree. The marks are hand-printed woodcut icons in navy, gold and green, and a pixel-bead (ministeck) language for poster and large-format use.

Reference files: the live site (naturalwinefestival.nl) and `social/social-system.html`. This document follows them.

---

## 02 Colour system

Each colour has one job.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#ECE6D6` | The dominant surface: site and most social posts |
| `--ink` | `#1B3326` | Forest-ink. Text on paper, and the dark layer: dark panels, announce post, hero ground |
| `--cream` | `#F0EAD9` | Text, frames and photo borders on dark panels (social posts) |
| `--amber` | `#eeba3f` | Calls to action, highlights, the payoff on dark panels |
| `--ochre` | `#9F6E29` | Eyebrow and label text on paper |
| `--green` | `#1c9055` | The payoff text on paper, and the green inside icons |
| `--navy` | `#233260` | The marks: woodcut icons and ministeck beads |
| `--navy-deep` | `#131f4a` | The ground of the navy posts: the hero variant and ticket sales |

Paper and ochre: `social/social-system.html` currently uses `#e7e1d0` and `#9a6628`. The site files (`index.html`, `winemakers.html`) use the values in the table. The social file still has to be aligned to the table.

### Rules

- Paper is the dominant surface. Ink is the dark layer.
- Navy appears inside the marks. Posts use no navy background. The exceptions are the hero post's navy variant and the ticket-sales post, on `--navy-deep`.
- Green is text on paper (the payoff) and the fill inside icons. It is never a background.
- The payoff on dark panels is amber. Measured contrast of amber `#eeba3f` on ink `#1B3326` is 7.58.
- The three golds differ and may keep differing: the woodcut icons use `#dbbb00`, the ministeck beads sit near `#f0b000` (measured on the hero image, approximate), and the site and posts use amber `#eeba3f`.
- Flat colour. The one gradient is the ministeck glow, on screen.
- Call to action on the website: a pill is fine. Social posts use no pills: the call to action sits on a brush stroke (see 07).

---

## 03 Typography

**Figtree** (`concept-assets/Figtree.woff2`) is the display and body face. Headlines are lowercase, weight 700, letter-spacing -.02em to -.03em, line-height .9 to .95.

**Vicky Black** (`concept-assets/Vicky-Black.woff2`) carries the payoff, "united by wine", and the descriptor line under the name of an award, for example "best under 30 contemporary sommelier" under "the natural". It is set lowercase and smaller than the name above it, and it is never used for headlines. Every Vicky rule has a Figtree fallback, so a Vicky line can never fall back to a serif.

The identity has no serif typeface.

**Labels and eyebrows:** uppercase, weight 700, letter-spacing .12em to .15em. On the site eyebrows are set in a monospace face; in social posts they are Figtree.

### Lockups

- Lead-in plus payoff (a short Figtree line whose last word is a Vicky word): the two lines sit at near-equal size. The Figtree line never exceeds the Vicky line.
- Brand name with tagline (home hero): the large Figtree name with a small Vicky payoff beneath it.

### Sizes in social posts

Sizes are in `cqw`, percent of the post's width.

| Element | Size |
|---|---|
| Label row (eyebrow) | 2.7cqw · 700 · uppercase · .12em |
| Maker or workshop name | 6.6cqw · 700 · lowercase |
| Region line | 3cqw · 700 · uppercase · .1em · ochre |
| Hero wordmark (one line) | 5.4cqw · 700 |
| Announce wordmark (stacked) | 7.4cqw · 700 |
| Payoff in hero / announce | 4.2cqw / 4.4cqw · Vicky |
| Ticket headline | 9cqw · 700 |

### Fonts on pages viewed from disk

Pages that are opened over `file://` carry both fonts inline as base64 in the `@font-face`. A `url()` reference does not load there.

---

## 04 Logo system

### The logo

The logo is the church emblem (`logos-/logo-church-tuned.svg`) next to the wordmark. It sits left of the wordmark in the site navigation on every page.

Colours in the file: navy-blue `#28417c`, gold `#dbbb00`, green `#1c9055`.

### Wordmark

The wordmark is set in Figtree 700, lowercase, stacked:

```
natural
wine
festival
a'dam
```

The payoff "united by wine" sits beneath it in Vicky.

### Variants and related marks

- `logos-/logo-dark-church.svg`: the original church emblem (original palette `#233260`, `#dbbb00`, `#21b501`).
- `logos-/logo-icon.svg`: the hand-and-bottle illustration as an icon.
- `concept-assets/badge.svg`: the hand-and-bottle illustration without a wordmark. The ministeck "fles & blad" mark is traced from it.
- Clear space around the logo: the height of the "a" in a'dam.


---

## 05 Icons

Hand-drawn woodcut icons: bold outlines, flat fills, rough edges, no clean vector, no gradients, no 3D. They do the wayfinding in the site and in social posts.

### Sets

| Set | Folder | Palette | Used for |
|---|---|---|---|
| Site set | `icons-set/` (16) | ink `#1B3326`, amber `#eeba3f`, green `#1c9055` | The site: floor plan, specials |
| Social set | `concept-assets/` (`ico-*`, `win-*`, `badge.svg`) and `social/marks/` (`ico-tasting-noleaf`, `ico-sake`, `ico-eat-drink-pair-love`) | navy `#233260`, gold `#dbbb00`, green `#21b501` | Social posts |
| Originals | `icons-/` (17) | navy, gold, green | Source files |
| Tuned variants | `icons-tuned/` (8) | ink and amber | Variants |

`social/marks/ico-tasting-noleaf.svg` is the tasting icon without the vine leaf behind the bottle. Social posts use it for the bottle icon.

### Site set

Round badges: sake, oyster, mind, tasting, shipment, mini-market, market-badge, eat-drink-pair-love.

| Icon | Subject | Use |
|---|---|---|
| tasting | Bottle and glass | Tasting, the maker label in posts |
| mind | Head with grapes | Workshops. A masterclass is a workshop. The brain icon is not used for workshops. |
| oyster | Oyster | Oyster bar |
| eat-drink-pair-love | Food and drink | Restaurant, pairings. Navy ground with gold lettering, in the site set (`icons-set/`) and in social posts (`social/marks/ico-eat-drink-pair-love.svg`). |
| mini-market, market-badge | Market goods | Mini market |
| sake | Sake | Sake tasting. Also in the social set (`social/marks/ico-sake.svg`). |
| shipment | Box | Delivery |

### Venue icons (optional)

The church-window emblems tie an activity to the venue, De Hallen. They stay in the system as an optional layer and are used where a post or page gives the venue room to show.

The plate lettering inside the windows is Vicky Black. The windows read "workshops", "gems", "mini market" and "buy direct"; the dinner window has no "invite only" and the gems window has no "enoteca naturista". The originals in `icons-/` still carry the old lettering.

| Activity | Site set (`icons-set/`) | Original (`icons-/`) | Social set (`concept-assets/`) |
|---|---|---|---|
| Winemakers | `winemakers.svg` | `icon-church -thewinemakers.svg` | `win-winemakers.svg` |
| Workshops | `workshops.svg` | `icon-church-workshops&Masterclasses.svg` | `win-workshops.svg` |
| Winemakers dinner | `dinner.svg` | `icon-church-winemakersdinner.svg` | `win-dinner.svg` |
| Mini market | `market.svg` | `icon-church-market.svg` | `win-market.svg` |
| Gems | `gems.svg` | `icon-church-gemsbar.svg` | `win-gems.svg` |
| Bar brut nature | `brut.svg` | `icon-church-BarBrutNature.svg` | `win-brut.svg` |
| Buy direct | `winestore.svg` | `icon-church-WinestoreXL.svg` | `win-store.svg` |
| Camping culinair | `camping.svg` | `icon-church-campingCulinair.svg` | `win-camping.svg` |

### Rules

- Round badges are shown inside a circle with a navy border.
- Icons stay at 48px or larger.
- Labels under icons are lowercase Figtree.
- New icons match the woodcut style. A third illustration style is not added.

---

## 06 Ministeck marks

The pixel-bead language: navy beads on a gold field, on a visible grid, with a soft gold-to-green glow and a few gold sparkle beads. Colours: navy `#233260`, gold, green `#1c9055`. Exported at 256 colours so the glow stays clean.

Ministeck is the form-language of edition 05. It is used at poster and large-format size, and the grape cluster is the hero image of the edition. Social posts use the woodcut icons, which rhyme with the beads: the same navy, gold and green, the same grid, the same silhouettes.

The same marks serve as square app icons for Good Juice (by NWFA).

### The six marks

| Mark | Subject | File |
|---|---|---|
| Druiven & blad | Grape cluster with leaves, the umbrella mark | `goodjuice-grapes-umbrella-*` |
| De kop | Head with grapes, the somm | `goodjuice-kop-somm-*` |
| Kerkraam | Church rosette | `goodjuice-church-tastingnotes-*` |
| Fles & blad | Hand, bottle and leaves | `goodjuice-bottle-leaves-*` |
| Ticket | Hand with ticket | `goodjuice-hand-ticket-*` |
| Prijsbeker | Trophy, NWFA Natural 2027 | `goodjuice-award-natural2027-*` |

Each mark exists at 1024, 512, 256, 128 and 64px, as PNG. The files are in `logos-/goodjuice-marks/`, with `goodjuice-marks.zip` holding all six at all sizes. The six marks, with a download for each, sit at the top of `social/social-system.html`.

The source PNGs are 1024px at 72 dpi, too low for print. For poster and large-format use the grape cluster is rebuilt from its bead grid as a print master: `goodjuice-grapes-umbrella.svg` (vector, infinite resolution) and `goodjuice-grapes-umbrella-6000.png` (6000 × 6000). The guide page offers both as downloads on the grape. The same reconstruction works on the other five marks when print versions are needed.

### In the hero post

The hero post shows the grape as a circle (clip 46.5%) on a flat ground, so the navy corners of the bead image do not show.

---

## 07 Social posts

Posts are 1080 × 1080 (also 1080 × 1350 for 4:5) and stories are 1080 × 1920. In the reference file a post is a square container and all sizes are in `cqw`.

### The frame

Posts on a flat ground carry an inner frame: inset 4cqw, border .5cqw, in ink on paper and in cream on dark panels. Padding inside the frame is 5.5cqw.

### The feed

The feed opens with the **hero post** and the **announce post**. They are always posted together. Row two and beyond alternate maker posts, workshop posts and the system posts below.

### Post types

**Hero.** The ministeck grape as a circle on ink or on deep navy, inside the cream frame. Wordmark in one line bottom left, the Vicky payoff beneath it, the date bottom right. The proportions below are measured on the post, in percent of the post's width, and they are the reference for every post built on the same layout.

| Element | Size and position |
|---|---|
| Frame | inset 4 from the edge, border .5, padding inside 5.5 |
| Circle | 64 wide, left 18, top 11. Visible circle ends at 72.8 from the top. |
| Wordmark | one line, Figtree 700, size 5.4, letter-spacing -.02em, left edge at 9.9, top at 78.3 |
| Payoff | Vicky, 4.2, top at 85.9, 2.2 below the wordmark, left edge at 9.9, amber |
| Date | Figtree 700, 2.7, uppercase, letter-spacing .12em, right edge at 9.9, bottom aligned with the payoff row |
| Text block | ends 9.9 above the bottom edge. The wordmark starts 5.5 below the visible circle |


**Announce.** Ink ground, frame. Top: "edition 05" left and the date right. Bottom left: the stacked wordmark, with the Vicky payoff in amber. No image.

**Makers.** Paper ground, frame. Label row: "the makers" left, the bottle icon right (8cqw). A photo in a .5cqw ink border. Name in lowercase. Under it: region and country code, for example `lazio, it`, in ochre caps.

**Workshops.** The maker layout on an ink ground. Label "workshops" (no time), the bottle-and-head icon right, a photo in a cream border, the workshop name, and the host's name in amber caps.

**What's included.** Ink ground, frame. A grid of icon plates (tasting, workshops, oysters, kitchen, market) and "all day" in Vicky, amber.

**Manifesto and countdown.** Ink ground. The manifesto line is lowercase Figtree with an amber highlight on the key words. The countdown is a large "t–30" with the bottle icon top right and the date beneath.

**Ticket.** A full-bleed photo with a dark scrim (gradient from rgba(16,22,16,.25) to .8). Eyebrow "tickets live" in amber, headline "take your place →" at 9cqw, and the price on a brush stroke.

**Ticket sales.** The hero layout on `--navy-deep`: the same frame, the same circle (64 wide, left 18, top 11) holding the ministeck ticket mark. The headline "ticket sales have started!" takes the wordmark's place, one line, Figtree 700 at 5.4, with "started!" in amber. Under it, in the payoff's row, the price on the brush stroke (text 3.8, stroke 7.5 high) bottom left, and the date bottom right at 2.7. The headline never grows past 5.4: at that size it already fills the full width of the frame.

### The brush stroke

Social posts mark a price or call to action with a hand-painted amber stroke. It has two layers: an amber `#eeba3f` stroke, and under it a copy in `#c8901c` shifted a few pixels down and right. The stroke is rotated -1.5°. Text sits on it in ink, Figtree 700, lowercase. The stroke is one closed shape. Nothing crosses the text.

### Avatar and handle

The Instagram icon is the ministeck "fles & blad" mark: `social/marks/nwfa-instagram-icon-1024.png`, 1024 × 1024, which Instagram crops to a circle. The profile name is "natural wine festival a'dam".

---

## 08 Photography

### Style

Event photography is documentary and warm. Real people, real wine, real moments. Never staged.

Subjects:
- People tasting, talking, laughing
- Wine glasses and bottles in use, uncomposed
- Festival atmosphere: crowds, light, movement
- Food preparation, market stalls
- Winemakers in vineyards (for winemaker profiles)

### Treatment

- Photos are used at full saturation: no desaturation, no filters
- On social templates: photos sit in a bordered frame, in an ink border on paper posts and a cream border on dark posts
- Photos are never overlaid with color tints
- Text over photos: set it on a dark scrim gradient that starts transparent and ends at the text, as in the ticket post
- Photo-heavy layouts alternate with illustration-heavy layouts
- Only photography from the festival and its winemakers is used

### File naming

```
{context}-{subject}-{number}.{ext}

Examples:
event-tasting-01.jpg
event-crowd-01.jpg
winemaker-portrait-01.jpg
food-preparation-01.jpg
venue-interior-01.jpg
```

The existing files in `photography-/` (91) carry camera names such as `HOI_1536.jpg`. The naming convention applies to new files.

---

## 09 Digital specifications

### Web

- Background: paper `#ECE6D6`, text ink `#1B3326`
- Eyebrows: monospace, uppercase, letter-spaced, in ochre
- Highlights: amber
- Buttons: pills are fine on the website
- Navigation: the church logo left of the wordmark

### Social media sizes

- Instagram post: 1080 × 1080px (square) or 1080 × 1350px (4:5)
- Instagram story: 1080 × 1920px
- Facebook event cover: 1920 × 1005px

### Review tool

Pages in review carry the annotation widget (`annotate.js`). It is removed before production.

---

## 10 Assets

```
concept-assets/        Figtree.woff2, Vicky-Black.woff2, ico-*, win-*, badge.svg, photo-*
fonts-/                Vicky-Black.woff2, InterVariable.woff2
logos-/                logo-church-tuned.svg, logo-dark-church.svg, logo-icon.svg
logos-/goodjuice-marks/   six ministeck marks, five sizes each, zip, README
icons-set/             the site icon set (16)
icons-/                original icons (17)
icons-tuned/           tuned variants (8)
social/marks/          hero and downloadable marks, ico-tasting-noleaf.svg
photography-/          event photography (91 files)
```

---

*This document follows `social/social-system.html` and the live site. If something is unclear, ask Peter.*
