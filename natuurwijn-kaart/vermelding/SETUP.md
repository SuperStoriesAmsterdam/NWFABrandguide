# vermelding — eigenaar-pagina setup

De pagina waar een winkel/zaak zijn eigen vermelding op de natuurwijn-kaart nakijkt en
aanvult. Per zaak een eigen link, geen account. Inzendingen gaan naar triage (Airtable),
goedgekeurde rijen synct Claude Code terug naar `venues.js` in git.

```
eigenaar vult in  →  intake (endpoint → airtable, status "pending")
                  →  jij keurt goed in airtable (status "approved")
                  →  sync-script leest approved → venues.js → git commit (status "live")
                  →  live op de kaart
```

Niets hiervan is live tot jij het aanzet. Deze branch is `claude/festive-goldberg-09b5b4`,
niet gemerged, niet gedeployed.

---

## wat er in deze oplevering zit

| bestand | wat |
|---|---|
| `natuurwijn-kaart/vermelding/index.html` | de eigenaar-pagina (mobiel-eerst, uit de goedgekeurde mockup) |
| `natuurwijn-kaart/vermelding/registry.js` | **gegenereerd**, deploybaar: per zaak slug + token-HASH + voorvul-data. Geen leesbare tokens. |
| `natuurwijn-kaart/vermelding/config.js` | zet hier de endpoint-URL in (leeg = demo-modus) |
| `scripts/vermelding/generate-registry.mjs` | maakt `registry.js` + de privé linklijst |
| `scripts/vermelding/sync-from-airtable.mjs` | leest approved rijen → werkt `venues.js` bij → commit |
| `scripts/vermelding/lib.mjs` | gedeelde helpers (slugs, hashing, venues lezen/schrijven) |
| `scripts/vermelding/intake-server/` | het ontvang-endpointje (Node, geen deps, Dockerfile) |
| `scripts/vermelding/.links.local.csv` | **gitignored**, plaintext links voor je mailing (zie hieronder) |
| `scripts/vermelding/.tokens.secret.json` | **gitignored**, plaintext tokens (zodat links stabiel blijven) |

De twee `.`-bestanden staan in `.gitignore` en worden dus nooit gecommit of gedeployed.

---

## 1. Airtable (intake + triage)

Maak in je NWFA-base een tabel, standaard **`Vermeldingen`** (of kies een naam en zet die
in de env als `AIRTABLE_TABLE`). Velden, exacte namen (de code mapt hierop):

| veldnaam | type | rol |
|---|---|---|
| `Name` | Single line text | naam van de zaak |
| `Slug` | Single line text | koppelt de rij aan de venue (niet wijzigen) |
| `Type` | Single line text | soort zaak (canoniek engels, bv. `Restaurant and a Bar`) |
| `Address` | Single line text | adres |
| `Website` | Single line text | |
| `Instagram` | Single line text | |
| `Story NL` | Long text | het verhaal (NL) |
| `Story EN` | Long text | het verhaal (EN) |
| `Selection` | Long text | "jullie selectie" (owner-veld) |
| `Why` | Long text | "waarom hierheen" (owner-veld) |
| `Hours` | Single line text | openingstijden (optioneel) |
| `Status` | Single select | opties: `pending`, `approved`, `live` |
| `Submitted At` | Date (incl. tijd) | gezet door het endpoint |
| `Synced At` | Date (incl. tijd) | gezet door het sync-script |
| `Raw JSON` | Long text | volledige inzending, voor als er iets mist |

**Triage:** nieuwe inzendingen komen binnen als `pending`. Jij leest ze na, corrigeert
waar nodig, en zet `Status` op `approved`. De rest doet het sync-script.

Maak een **personal access token** (airtable.com/create/tokens) met scope
`data.records:read` + `data.records:write` op precies deze base. Dat token gaat ALLEEN
naar de server (env), nooit in de frontend.

---

## 2. Het intake-endpoint (Coolify)

`scripts/vermelding/intake-server/` is een piepklein Node-servicetje zonder dependencies.
Het valideert de token server-side tegen `registry.js`, doet basale anti-spam (honeypot,
te-snel-ingevuld, rate limit per IP, veldlengtes) en schrijft een `pending`-rij naar
Airtable.

**Deploy op Coolify** (zelfde server als de rest):
1. Nieuwe resource → Docker / Dockerfile, wijzend naar deze repo.
2. **Base Directory** = `/`, **Dockerfile Location** =
   `scripts/vermelding/intake-server/Dockerfile` (de build-context moet de repo-root zijn,
   want de Dockerfile kopieert ook `registry.js` mee).
3. Environment variables (zie `intake-server/.env.example`):
   - `AIRTABLE_TOKEN` = je token
   - `AIRTABLE_BASE_ID` = de base-id (`app…`)
   - `AIRTABLE_TABLE` = `Vermeldingen`
   - `ALLOW_ORIGIN` = `https://naturalwinefestival.nl` (alleen het formulier van de site mag posten)
   - `REGISTRY_URL` = `https://naturalwinefestival.nl/natuurwijn-kaart/vermelding/registry.js`
     (optioneel; hiermee pakt de service nieuwe venues op zonder opnieuw te builden)
   - `PORT` = `8788`
4. Zet er een (sub)domein op, bv. `vermelding-intake.superstories.com`, met https.
5. Check: `GET https://…/health` geeft `{"ok":true,"venues":223}`.

**Zonder Airtable-env draait de service in LOG-ONLY-modus**: hij valideert en antwoordt
`ok`, maar schrijft niets (alleen een console-log). Handig om eerst de frontend-flow te testen.

Daarna: zet de URL in `natuurwijn-kaart/vermelding/config.js`:
```js
window.VERMELDING_CONFIG = { ENDPOINT: 'https://vermelding-intake.superstories.com/intake' };
```
Zolang `ENDPOINT` leeg is, draait het formulier in **demo-modus** (verstuurt niets, toont
wel het bedankscherm). Zo kun je de pagina veilig rondsturen ter review.

---

## 3. De links voor je mailing genereren

```bash
node scripts/vermelding/generate-registry.mjs
```

Dit schrijft:
- `natuurwijn-kaart/vermelding/registry.js` — deploybaar (alleen hashes + voorvul-data).
- `scripts/vermelding/.links.local.csv` — **plaintext links**, per zaak één rij
  (`name, slug, token, url`). Dit bestand is gitignored; gebruik het om je mailmerge te vullen.
  Deel het niet en deploy het niet.

Elke link ziet eruit als:
```
https://naturalwinefestival.nl/natuurwijn-kaart/vermelding/?v=<slug>&t=<token>
```

**Tokens zijn stabiel.** Het script bewaart ze in `scripts/vermelding/.tokens.secret.json`
en hergebruikt ze bij elke run, zodat links blijven werken. Alleen nieuwe venues krijgen
een nieuwe token. Wil je alles roteren (alle oude links ongeldig maken): verwijder
`.tokens.secret.json` en draai opnieuw.

Andere base-URL nodig (bv. staging)? `VERMELDING_BASE_URL=... node scripts/vermelding/generate-registry.mjs`.

---

## 4. Approved inzendingen terug naar de kaart (sync)

```bash
# eerst kijken wat er zou veranderen, zonder iets te schrijven:
AIRTABLE_TOKEN=… AIRTABLE_BASE_ID=… node scripts/vermelding/sync-from-airtable.mjs --dry-run

# echt toepassen: schrijft venues.js, regenereert registry.js, commit, zet rijen op "live"
AIRTABLE_TOKEN=… AIRTABLE_BASE_ID=… node scripts/vermelding/sync-from-airtable.mjs
```

Het script leest rijen met `Status = approved`, koppelt ze via `Slug` aan de juiste venue,
werkt de owner-velden + goedgekeurde correcties bij in `venues.js`, commit (`venues.js` +
`registry.js`), en zet de verwerkte rijen op `Status = live` met een `Synced At`.
Daarna push/merge jij zoals altijd en deployt de site.

Testen zonder Airtable: `node scripts/vermelding/sync-from-airtable.mjs --from-json <fixture.json> --dry-run`.

---

## 5. Veiligheid

- Geen secrets in de frontend. `registry.js` bevat alleen sha256-hashes van tokens; de
  echte tokens staan enkel in `.tokens.secret.json` + `.links.local.csv` (beide gitignored)
  en in de persoonlijke mail van de ontvanger.
- Tokenvalidatie gebeurt client-side (zachte poort) én server-side bij submit (harde poort,
  hash-vergelijking). Een inzending met verkeerde token wordt geweigerd (403).
- Elke inzending landt als `pending`; niets gaat de kaart op zonder jouw goedkeuring.
- De privacy-regel staat op het formulier: geen wachtwoorden/sleutels/betaalgegevens.
- Dit is een productie-formulier: er staat **geen** annotate/review-widget op.

---

## 6. Wat wél getest is, en wat nog niet

**Lokaal end-to-end getest (werkt):**
- Frontend: geldige link → voorgevuld formulier + preview; prefill van naam/type/adres/
  website/instagram/verhaal NL+EN; live preview-update; demo-submit → bedankscherm; ongeldige
  token → nette foutpagina. Mobiel (375px) gescreenshot, matcht de mockup. Fonts laden.
- Endpoint (log-only): `/health`, geldige submit, verkeerde token (403), honeypot (stil
  geaccepteerd, niets geschreven), te-snel (429), onbekende venue (404).
- Sync: slug-matching, veld-mapping, normalisatie (website/instagram), dry-run; en de
  `venues.js`-herschrijver round-trip (223 venues, format en header intact).

**Nog niet getest (heeft jouw infra nodig — ik heb geen Airtable/Coolify-toegang):**
- De echte Airtable-schrijf vanuit het endpoint (nu log-only gevalideerd; de REST-call staat
  klaar, veldnamen moeten in Airtable exact overeenkomen met §1).
- De echte Airtable-lees + `mark live` in het sync-script (met `--from-json` wél gevalideerd).
- De Coolify-deploy zelf (Dockerfile is er, niet gebouwd in deze omgeving).

---

## 7. Open punten voor jou

1. **De twee owner-velden op de live kaart.** `kaart.html` toont nu één owner-veld, `pick`,
   onder het label "de tip" (`kaart.html` rond regel 550). De mockup heeft er twee: "jullie
   selectie" en "waarom hierheen". Mapping die ik aanhoud: "jullie selectie" → `pick` (wordt
   dus meteen zichtbaar als "de tip"), "waarom hierheen" → `pick_why` (nieuw veld, **nog niet
   gerenderd** op de kaart). Ook `hours` is nieuw en wordt nog niet getoond. Om "waarom
   hierheen" (en de exacte labels "jullie selectie"/"waarom hierheen", en evt. openingstijden)
   op de kaart te tonen is een kleine aanpassing in `kaart.html` nodig. Dat valt buiten deze
   opdracht (kaart niet aanraken) en wacht op jouw go: het raakt de live kaart. Zeg maar of ik
   dat in een aparte sessie oppak.
2. **Soort-zaak mapping.** Het formulier biedt 5 NL-opties; "maker / wijngaard" stuurt de
   nieuwe type-waarde `Winemaker`, die nog niet in het type-systeem van de kaart zit. Check of
   je die wil ondersteunen of dat makers een ander type krijgen.
3. **Contact-adres.** Op de foutpagina's staat `hallo@naturalwinefestival.nl` als mailadres.
   Pas aan als dat anders moet.
4. **Subdomein + CORS.** Kies het endpoint-subdomein en zet `ALLOW_ORIGIN` strak op de
   site-origin voordat je live gaat.
