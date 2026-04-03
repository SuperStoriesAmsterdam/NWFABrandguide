# Natural Wine Festival A'dam — Redesign Plan

## Uitgangspunt

De huidige site (WordPress/Salient) heeft goede content maar draagt het merk niet. De winemaker profielen zijn sterk, de workshops zijn concreet, het dinner is compleet — maar de visuele identiteit (Vicky Black, custom iconen, kleurensysteem) leeft nergens op de site. Dit plan beschrijft wat de nieuwe site moet zijn.

---

## 1. Sitemap (nieuw)

```
HOME
├── Winemakers (overzicht + detail per maker)
├── Programme
│   ├── Workshops
│   ├── Winemaker's Dinner
│   ├── Tastings
│   └── Market
├── Tickets (embedded of branded Eventix flow)
├── About
│   ├── The Festival
│   └── For Professionals
└── Contact / FAQ
```

### Wat verandert
- "A bit more context" en "Participate" (beide 404) verdwijnen
- Programme wordt een sectie met alles — workshops, dinner, tastings, market
- Professionals wordt een sub van About, niet een los nav-item
- Tickets krijgt een eigen pagina in plaats van een externe redirect

---

## 2. Homepage

De homepage is de poster. Niet een WordPress template met blokken — een poster die digitaal ademt.

### Secties (van boven naar beneden)

**Hero**
- Volledige viewport hoogte
- Festivalnnaam in display font, groot, lowercase
- Datum + locatie in mono
- Eén CTA: "get your tickets"
- Eventueel: achtergrond eventfoto met navy overlay

**Highlights strip**
- 4 kolommen, elk met een custom icoon + label
- Winemakers · Workshops · Restaurant · Market
- Klikbaar naar de betreffende sectie

**Winemaker preview**
- 6 makers in een grid met foto, naam, regio
- "See all 60+ winemakers →" link
- Foto's zijn het verschil — geen kale kaartjes

**Programme teaser**
- 3 uitgelichte workshops met naam, spreker, korte beschrijving
- Winemaker's Dinner als apart blok (menu preview)
- Tijdlijn van de dag: 13.00–22.00 visueel

**Quote / filosofie**
- De "terroirists / punks of wine" tekst
- Groot, typografisch, Vicky Black
- Geen achtergrondafbeelding — laat de typografie werken

**Partners**
- Logo strip, klein, aan de onderkant

**Footer**
- Socials, contact, nieuwsbrief signup
- Festival data + locatie

---

## 3. Winemakers

### Overzicht
- Grid met kaarten: **foto + naam + regio + land**
- Filter per land (bestaand, werkt goed)
- Optioneel: zoekbalk
- Kaarten moeten visueel zijn — de hero foto van de maker is het eerste wat je ziet

### Detail pagina
- Hero: grote foto (vineyard of portret)
- Naam + regio + land (mono labels)
- Verhaal (2-3 alinea's, body font)
- Foto carousel (bestaand, goed)
- Wijnlijst (als beschikbaar): namen van wijnen die ze meebrengen
- Links: website + Instagram (bestaand)
- "Back to all winemakers" link

---

## 4. Programme

Eén pagina die het hele programma toont als een tijdlijn / agenda.

### Tijdlijn
```
13.00  Doors open — tastings begin
13.00  Oyster bar & food court open
14.00  Workshop: Montsant Masterclass
15.00  Workshop: Talha Wine
16.00  Workshop: Cider & Perry
17.00  Workshop: To SO2 or Not
18.15  Last tasting round
18.30  Workshop: Meditation Wine
19.00  Winemaker's Dinner
22.00  Festival closes
```

- Elke workshop klikbaar naar detail
- Visueel: verticale tijdlijn met iconen per activiteitstype
- Custom iconen voor Tasting, Workshop, Restaurant, Market

### Workshop detail
- Spreker naam + foto
- Beschrijving
- Duur + tijdstip
- Niveau (beginner / experienced)
- "Book after ticket purchase" — uitleg hoe het werkt
- Geen losse booking flow meer — alles via één duidelijke uitleg

### Winemaker's Dinner
- Apart blok binnen Programme
- Menu volledig uitgeschreven (al aanwezig, sterk)
- Prijs + BYOB uitleg
- Booking instructie

---

## 5. Tickets

In plaats van een kale redirect naar Eventix:

- Eigen pagina op de site
- Uitleg wat er in je ticket zit (de 4 punten)
- Prijzen zichtbaar op de site zelf
- Eventix widget embedded (niet redirect)
- Aparte sectie voor Professional tickets
- FAQ: "wat als ik workshops wil booken?" → uitleg

---

## 6. About

### The Festival
- Korte oorsprongsgeschiedenis
- Filosofie / visie (de terroirists tekst)
- Foto's van vorige edities
- Team / organisatie (optioneel)
- Partners met links

### For Professionals
- Wat de pro-dag inhoudt
- Eigen datum (als die verschilt)
- Separate ticket info
- Contact voor trade inquiries

---

## 7. Technische richting

### Optie A: Static build (aanbevolen)
- HTML/CSS/JS, geen framework
- Winemaker data als JSON of Markdown files
- Gebouwd met Claude Code
- Deploy via GitHub → Coolify
- CMS-vrij — content updates via git

**Voordeel:** Snel, on-brand, geen WordPress overhead
**Nadeel:** Content updates vereisen git kennis (of een eenvoudige admin tool)

### Optie B: Headless CMS + static frontend
- Frontend: static HTML/CSS
- Content: Notion of Sanity als CMS
- Build: Claude Code genereert pages vanuit CMS data
- Deploy: GitHub → Coolify

**Voordeel:** Niet-technische mensen kunnen content updaten
**Nadeel:** Extra laag, meer setup

### Optie C: WordPress met custom theme
- Huidige platform behouden
- Custom theme gebouwd op de brandguide tokens
- Voordeel: team kent WordPress
- Nadeel: performance, de theme beperkt altijd

---

## 8. Design principes voor de site

1. **De typografie IS het design** — geen stock graphics, geen generieke hero images met overlays
2. **Iconen als navigatie** — de custom set (tasting, workshop, market, etc.) wordt het visuele navigatiesysteem
3. **Foto's zijn documentair** — echte festivalfoto's, winemaker portretten, geen stock
4. **Kleur is systeem** — navy/gold (of navy/groen, afhankelijk van gekozen richting) op elke pagina consistent
5. **Mono voor data** — alle tijden, datums, labels, filters in monospace
6. **Mobile first** — 70%+ van festivalticket-kopers zit op telefoon
7. **Snelheid** — geen 5 tracking scripts, geen zware WordPress plugins. Lighthouse 90+

---

## 9. Prioriteiten

### Must have (launch)
- Homepage als poster
- Winemaker overzicht met foto's
- Winemaker detail pages
- Programme / tijdlijn
- Ticket pagina met embedded Eventix
- Mobile responsive

### Should have (snel na launch)
- Workshop detail pages
- Winemaker's Dinner pagina
- Nieuwsbrief signup
- FAQ

### Nice to have (iteratie)
- Zoekfunctie winemakers
- Interactieve plattegrond De Hallen
- "My programme" — bezoekers selecteren workshops
- Vorige edities archief

---

*Dit plan is de brief voor de site-build. De brandguide richting die we kiezen bepaalt de visuele uitvoering. De content bestaat grotendeels al — het gaat om herpresentatie, niet om herschrijven.*
