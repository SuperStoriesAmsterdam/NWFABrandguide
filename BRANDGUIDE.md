# Natural Wine Festival A'dam — Brand Guide

> Green is Golden. United by Wine.

---

## 01 Brand Overview

**Full name:** Natural Wine Festival Amsterdam
**Short name:** NWFA / Natural Wine Festival A'dam
**Parent brand:** Green is Golden
**Location:** De Hallen, Amsterdam
**URL:** naturalwinefestival.nl
**Instagram:** @naturalwinefestival.ams

The Natural Wine Festival Amsterdam is a recurring festival celebrating natural wine culture — winemakers, food, workshops, tastings, and community. The brand identity is bold, illustrative, and unapologetically festive. It looks like a festival poster, not a corporate event.

---

## 02 Color System

Three colors. No gradients. No transparency. Every element uses one of these three.

| Token        | Hex       | Name           | Use                                                    |
|--------------|-----------|----------------|--------------------------------------------------------|
| `--navy`     | #233260   | Festival Navy  | Text, logo elements, dark backgrounds, illustration    |
| `--gold`     | #DBBB00   | Festival Gold  | Primary background, highlight, icon fills, accent text |
| `--green`    | #21B501   | Festival Green | Logo leaf, illustration accents, CTA buttons, badges   |
| `--white`    | #FFFFFF   | White          | Text on navy backgrounds, image borders                |

### Color modes

The brand operates in two distinct color modes:

**Gold mode** (primary — used for most materials)
- Gold background, navy text, green accents
- Festive, energetic, attention-grabbing
- Used for: posters, flyers, Instagram ads, story templates, website hero

**Navy mode** (secondary — used for contrast and information)
- Navy background, gold text, green accents
- Serious, readable, grounded
- Used for: digital flyer lower sections, thank-you cards, ticket confirmations, QR sections, story variants

### Color rules

- Gold and navy are always the dominant pair. Green is the accent — never the background.
- Green is used for: the grape leaf in the logo, CTA buttons, badge fills, seasonal decorative elements (snowflakes, sparkles), select illustration fills.
- On gold backgrounds: text is always navy. Never green text on gold.
- On navy backgrounds: text is always gold or white. Never green text on navy.
- Green text only appears inside green-filled shapes (e.g. the "UNITED BY WINE" banner, "BOOK NOW" button).
- No shadows, no gradients, no opacity. Flat color only.

---

## 03 Typography

### Fonts

**Vicky Black** (`fonts/Vicky-Black.woff2`)
The festival voice. A heavy, rounded, hand-drawn serif with massive personality. Lowercase by default — this is a deliberate choice. The font's character comes from its weight and imperfect curves, not from capitalization.

Used for: all headlines, poster text, social media text, event names, dates.

**Inter Variable** (`fonts/InterVariable.woff2`)
The information font. Clean, highly legible variable sans-serif. Used at smaller sizes for practical information.

Used for: body text, descriptions, metadata, navigation, fine print, website body copy.

### Type scale

| Token              | Size                       | Font         | Weight     | Case       | Use                                        |
|--------------------|----------------------------|--------------|------------|------------|--------------------------------------------|
| `--type-display`   | clamp(48px, 10vw, 120px)   | Vicky Black  | 900        | lowercase  | Festival name on posters, hero headlines   |
| `--type-headline`  | clamp(32px, 6vw, 72px)     | Vicky Black  | 900        | lowercase  | Section headlines, ad headlines            |
| `--type-h1`        | clamp(24px, 4vw, 48px)     | Vicky Black  | 900        | lowercase  | Page titles, event names                   |
| `--type-h2`        | 20px                       | Vicky Black  | 900        | lowercase  | Subheadings, card titles                   |
| `--type-date`      | clamp(24px, 5vw, 56px)     | Vicky Black  | 900        | Sentence   | Event dates — "Saturday 16 November '24"   |
| `--type-body`      | 16px                       | Inter        | 400        | Sentence   | Body text, descriptions                    |
| `--type-small`     | 14px                       | Inter        | 400        | Sentence   | Captions, fine print                       |
| `--type-label`     | 12px                       | Inter        | 600        | UPPERCASE  | Category labels, icon labels, metadata     |
| `--type-cta`       | 16px                       | Inter        | 700        | UPPERCASE  | Button text, calls to action               |

### The lowercase rule

Vicky Black headlines are written in **lowercase**. This is the brand's most distinctive typographic choice.

```
Do:   "ticket sales have started!"
Do:   "all day oysters and paired wines"
Do:   "2 free tickets to the festival"

Don't: "TICKET SALES HAVE STARTED!"
Don't: "All Day Oysters And Paired Wines"
Don't: "2 Free Tickets to the Festival"
```

Exceptions where uppercase/sentence case IS used:
- **"GREEN is GOLDEN"** — the parent brand tagline, always in this exact mixed case
- **"UNITED BY WINE"** — the festival tagline, always uppercase inside its banner
- **"WINEMAKERS"**, **"WORKSHOPS"**, **"RESTAURANT"**, **"MINI MARKET"** — icon labels in uppercase Inter
- **Event dates** — sentence case in Vicky Black: "Saturday 16 November '24"
- **"De Hallen Amsterdam"** — location name, sentence case in Inter
- **CTA buttons** — uppercase Inter: "BOOK NOW", "LINK TO POST"

### Line height and spacing

- Vicky Black display/headline: line-height 0.95 — lines should nearly touch
- Vicky Black stacked headlines: break aggressively — one or two words per line for maximum impact
- Inter body: line-height 1.5
- Inter labels: line-height 1.2, letter-spacing +0.06em

---

## 04 Logo System

### Primary logo

The primary logo (`logos/logo-primary.svg`) is an illustrated composition: a hand holding a wine bottle with a grape leaf growing from it. Built from all three brand colors:
- Hand and bottle outline: navy
- Bottle fill and leaf: green
- Leaf detail and accents: green + navy

This illustration is used at large scale on posters and ads, always paired with the wordmark text.

### Church icon

The church icon (`logos/logo-icon.svg` and `logos/logo-dark-church.svg`) is the festival's secondary mark — a stylized church/venue silhouette with the wine bottle integrated. This references the De Hallen venue architecture.

Three-color construction:
- Outer ring and structural elements: navy
- Inner details and fills: green
- Accent elements: gold

Used for: favicon, social avatars, small-format branding, app icons.

### Wordmark

The festival name is set in Vicky Black, lowercase, stacked aggressively:

```
Natural
Wine
Festival
A'dam
```

Always accompanied by "GREEN is GOLDEN" above in Inter (green text, with "is" smaller or lighter).

### Logo color rules

- On gold backgrounds: navy + green logo (standard)
- On navy backgrounds: white + green logo (inverted)
- The logo is never shown in a single color
- The grape leaf is always green — never navy, never gold
- Minimum clear space around the logo: equal to the height of the "A" in "A'dam"

---

## 05 Illustration System

The brand uses a set of custom hand-drawn illustrations in a consistent style: bold outlines in navy, filled areas in green and gold. They feel hand-printed, almost like linocuts — rough edges, no perfect curves.

### Icon set

All icons follow the same construction: navy circle border (with navy stroke), content illustrated in the three brand colors.

| Icon file                              | Subject           | Use                          |
|----------------------------------------|-------------------|------------------------------|
| `icon-church-*`                        | Venue variants    | Activity-specific church icons |
| `icon-Tasting.svg`                     | Wine glass        | Tasting sessions             |
| `icon-Brain.svg`                       | Brain/head        | Workshops, education         |
| `icon-EatDrinkPairLove.svg`            | Food + drink      | Restaurant, pairings         |
| `icon-MiniMarket.svg`                  | Market goods      | Mini market                  |
| `icon-Oyster.svg`                      | Oyster            | Oyster bar                   |
| `icon-Sake.svg`                        | Sake              | Sake tasting                 |
| `icon-Shipment.svg`                    | Shipping          | Delivery, logistics          |
| `icon-food-yellow.svg`                 | Cutlery           | Food/restaurant              |
| `icon-mind.svg`                        | Mind/thought      | Workshops, masterclasses     |

### Illustration rules

- All illustrations use the same 3-color palette — no additional colors
- Navy outlines, green and gold fills
- Style is hand-drawn, imperfect, woodcut-like
- Icons are always shown inside a circle with a navy border
- Below each icon: a label in uppercase Inter
- Illustrations are never shown at less than 48px diameter
- New illustrations must match the existing hand-drawn style — no clean vector, no gradients, no 3D

---

## 06 Layout Principles

### Poster / flyer layout (vertical)

The festival's signature layout for posters and flyers follows a clear hierarchy:

1. **"GREEN is GOLDEN"** — small, top-left, green text
2. **"Natural Wine Festival A'dam"** — Vicky Black, lowercase, stacked, navy — with logo illustration to the right
3. **"UNITED BY WINE"** — banner/ribbon in green with white text
4. **Date** — Vicky Black, navy, sentence case
5. **Supplementary info** — Inter, smaller, navy
6. **Icon row** — 3-4 activity icons with labels
7. **Location** — pin icon + "De Hallen Amsterdam"
8. **URL** — bottom bar, navy on gold or gold on navy

### Social media templates

**Winemaker template:**
- Gold border, navy inner frame
- Photo fills most of the frame
- "WINEMAKER" badge top-left (rotated, white on navy)
- Winemaker name + region bottom, Vicky Black on gold bar

**Market template:**
- Navy border
- Photo with price tag icon overlay (green + gold)
- Vendor name + "@ GREEN is GOLDEN MARKET" bottom bar

**Ad/story template:**
- Full gold or navy background
- Vicky Black headline centered, lowercase
- Illustration element (hand + ticket, etc.)
- CTA at bottom

### Grid and spacing

- Base unit: 8px
- Card padding: 24px
- Section spacing: 48px
- No rounded corners on structural elements — borders are square
- Icon circles are the exception — they are naturally round
- Borders: 2-3px navy where used (thicker than typical, matches the illustrative weight)

---

## 07 Photography

### Style

Event photography is documentary and warm. Real people, real wine, real moments. Never staged.

Subjects:
- People tasting, talking, laughing
- Wine glasses, bottles — in use, not composed
- Festival atmosphere — crowds, light, movement
- Food preparation, market stalls
- Winemakers in vineyards (for winemaker profiles)

### Treatment

- Photos are used at full saturation — no desaturation, no filters
- On social templates: photos are framed by colored borders (gold or navy)
- Photos are never overlaid with color tints
- Text over photos: use a solid color bar (gold or navy) beneath the text — never directly on the image without a solid background
- Photo-heavy layouts alternate with illustration-heavy layouts

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

---

## 08 The "UNITED BY WINE" Banner

This is a recurring brand element — a horizontal banner/ribbon shape containing the tagline.

- Shape: a wide rectangle with angled/pointed ends (like a ribbon or pennant)
- Fill: green (#21B501)
- Text: "UNITED BY WINE" in white, uppercase Inter Bold
- Placement: always between the festival name and the date
- Never use this banner for any other text
- The banner should always be horizontally centered

---

## 09 Voice and Tone

### The brand sounds like:

A friend inviting you to something great. Not a corporation selling tickets.

### Writing rules:

- Headlines in lowercase — the font does the shouting
- Short, punchy sentences
- Exclamation marks are welcome but not required
- "A'dam" not "Amsterdam" in marketing materials (Inter body text can use full name)
- First person plural where appropriate — "we" not "the organization"
- No industry jargon — "natural wine" is already niche enough
- Food and drink descriptions: sensory, specific, appetizing

```
Do:   "ticket sales have started!"
Do:   "all day oysters and paired wines"
Do:   "thank you and salut!"

Don't: "We are pleased to announce that tickets are now available"
Don't: "Curated selection of biodynamic offerings"
Don't: "An unmissable oenological experience"
```

### Taglines and fixed phrases

- **"Green is Golden"** — parent brand, always in this case
- **"United by Wine"** — festival tagline, always uppercase when in the banner
- **"A'dam"** — the city abbreviation, with apostrophe

---

## 10 Digital Specifications

### Web

- Primary background: gold (#DBBB00)
- Nav bar: navy background, gold/white text
- Links: navy, underline on hover
- Buttons: green background, white uppercase text, no border-radius
- Cards: navy border (2px), gold background, navy text
- Footer: navy background, gold text

### Social media sizes

- Instagram post: 1080 x 1080px (square) or 1080 x 1350px (4:5)
- Instagram story: 1080 x 1920px
- Facebook event cover: 1920 x 1005px

### Favicon

Use `logo-icon.svg` (church icon) at 32x32 and 180x180 (Apple touch).

---

## 11 Assets

### Fonts in use
```
fonts/Vicky-Black.woff2         — display, headlines, all large text
fonts/InterVariable.woff2       — body, labels, navigation, fine print
```

### Logo files
```
logos/logo-primary.svg          — hand + bottle + leaf illustration
logos/logo-icon.svg             — church icon (3-color)
logos/logo-dark-church.svg      — church icon (dark variant)
```

### Icon files
```
icons/icon-Brain.svg
icons/icon-EatDrinkPairLove.svg
icons/icon-MiniMarket.svg
icons/icon-Oyster.svg
icons/icon-Sake.svg
icons/icon-Shipment.svg
icons/icon-Tasting.svg
icons/icon-church-*.svg         — 8 venue activity variants
icons/icon-food-yellow.svg
icons/icon-mind.svg
```

### Photography
```
photography/                    — ~95 event photos from previous editions
```

### References
```
references/ads-/               — Instagram ad examples (7 files)
references/layout-/            — Print layout examples (5 files)
references/social-/            — Social media template examples (5 files)
```

---

## 12 What Not To Do

- Never use a white background — it's always gold or navy
- Never use green as a background color
- Never use Vicky Black in uppercase for headlines (exception: fixed phrases like "GREEN is GOLDEN")
- Never place text directly on a photo without a solid color bar
- Never use additional colors outside the three-color system
- Never use gradients, shadows, or transparency
- Never use rounded corners on rectangular elements
- Never use a different illustration style alongside the existing icons
- Never use stock photography — only real event/winemaker photos
- Never write headlines in title case

---

*This document is the single source of truth for the Natural Wine Festival Amsterdam visual identity. If something is unclear, ask Peter.*
