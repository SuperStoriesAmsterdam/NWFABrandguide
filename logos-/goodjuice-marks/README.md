# Good Juice ministeck-marks

De kraaltjes-marks van Good Juice (by NWFA): navy op een goudveld, vierkant app-icoon,
met een zachte goud-naar-groen gloed en wat gouden sparkle-kraaltjes. De digitale (scherm)
laag van de NWFA-merktaal; naast de linocut-cirkels voor print. Zie `BRANDGUIDE.md` §05.

Palet: navy `#233260` · goud `#DBBB00` · groen `#1C9055` · wit (alleen als sparkle-highlight).

## De zes marks

| Mark | Bestand | Plek in de app |
|------|---------|----------------|
| Druiven & blad | `goodjuice-grapes-umbrella-*` | paraplu-merk · intro / keuzescherm |
| De kop | `goodjuice-kop-somm-*` | de somm |
| Kerkraam | `goodjuice-church-tastingnotes-*` | proefnotities |
| Fles & blad | `goodjuice-bottle-leaves-*` | het NWFA-logo (hand + fles + druivenbladeren) |
| Ticket | `goodjuice-hand-ticket-*` | ticketverkoop |
| Prijsbeker | `goodjuice-award-natural2027-*` | NWFA Natural 2027 award |

Elke mark komt in de maatladder **1024 · 512 · 256 · 128 · 64 px**, PNG, schone 256-kleuren-export.
`goodjuice-marks.zip` bevat alle zes × alle formaten.

De fles- en ticket-marks zijn getraceerd van de echte NWFA-illustraties
(`logos-/logo-primary.svg`, `social/marks/ticket-illustration.png`) en daarna in ministeck gezet.

## gj-download.js

Herbruikbaar download-blok voor Claude-artifacts (de pagina moet `capabilities: { downloads: true }`
declareren). Logica + stijl zitten in de module; de bestands-payload geef je per doc mee.

```html
<div id="dl"></div>
<script src="gj-download.js"></script>
<script>
  GJDownload.mount('#dl', {
    filename: 'goodjuice-marks.zip',
    data: ZIP_BASE64,        // base64 | Blob | Uint8Array | () => een daarvan
    title: 'Alle marks downloaden',
    subtitle: 'Zes marks &middot; 1024&rarr;64 px &middot; PNG'
  });
</script>
```
