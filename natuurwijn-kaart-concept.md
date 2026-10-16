# natuurwijn-kaart als meetbaar wervingsasset

concept-uitleg, bedoeld om te delen met de online-advertising / attributie-chat. geen live-wijziging; dit beschrijft waar de kaart heen gaat en hoe ze te meten valt.

- datum: 16 oktober 2026
- hoort bij: `natuurwijn-kaart-ux-plan.html` (visueel plan + mockups) en `natuurwijn-kaart-seo-keywords.md` (keyword-validatie + attributie-detail §4b)

---

## wat het is

naturalwinefestival.nl heeft een natuurwijn-kaart: 225 natuurwijn-adressen in nederland (bars, restaurants, winkels) op een interactieve kaart. die kaart wordt uitgebreid van een adreslijst naar twee dingen tegelijk: een culturele gids van de nederlandse natuurwijn-scene, en een meetbaar wervingsasset dat het hele jaar het juiste publiek binnenhaalt.

## het doel

autoriteit claimen is het middel. de opbrengst is een warm, gesegmenteerd publiek dat we het hele jaar bezitten (consumenten-lijst in loops) en dat festivaltickets koopt als de verkoop opengaat. de kaart wordt een wervingsmachine die toevallig ook een gids is.

## de trechter

**verkeer → adres → ticket.**

- **verkeer:** vindbare pagina's (stad-gidsen, routes) trekken het hele jaar de juiste mensen. wie "wijnbar amsterdam" zoekt is precies het festivalpubliek.
- **adres:** opt-ins die in de content zelf zitten vangen dat verkeer als e-mail, zelf-segmenterend op stad, in loops.
- **ticket:** als de kaartverkoop opengaat verkopen we aan een warme, gesegmenteerde lijst in plaats van aan een koude markt.

regel: elke pagina brengt verkeer binnen of vangt een adres. doet ze geen van beide, dan bouwen we haar niet.

## de bouwstenen (en hun rol in de trechter)

- **rijkere pins** · elke venue-popup krijgt een kort verhaal (wie erachter zit) en een tip (wat te bestellen). dit is de unieke content die de stad-gidsen uit "dun" houdt. schrijfmodel: ai draft uit bestaande data, de eigenaar corrigeert via een mailing (staat klaar in notion). verkeer-rol via de gidsen; relatietouch die delen en links oplevert.
- **maken-filter** · een vierde filter naast drinken/eten/kopen dat de nederlandse makers toont als eigen pin-type. haakt aan het terroir-thema.
- **routes** · gecureerde crawls (bv. de jordaan-crawl) als genummerd pad over de kaart, deelbaar via een link. capture-rol: "stuur me dit gidsje" is de sterkste adres-vanger per bezoeker.
- **agenda** · een "wanneer"-weergave met proeverijen, openingen, releases. capture-rol: "mail me proeverijen in [stad]" is de sterkste opt-in, zelf-segmenterend op stad. gevuld via een formulier naar alle partijen, met een triage-stap.

## de vindbare laag (SEO)

de kaart is nu één javascript-widget, dus onvindbaar voor zoek. de winst is dezelfde data projecteren als statische pagina's:

- **stad-gidsen** ("natuurwijn in amsterdam") die ook de grote generieke vraag bedienen. gevalideerd: wijnbar amsterdam ~1900/mnd, wijnproeverij amsterdam ~1600, tegen natuurwijnbar amsterdam ~10. de vraag zit op de brede term; de pagina moet die eerlijk bedienen.
- **route-pagina's** als echte url's (/routes/...), schema-markup (LocalBusiness / Event), en **llms.txt** zodat chatgpt en perplexity de kaart als bron gebruiken.
- **domein-keuze (vastgelegd):** alles komt als submap onder naturalwinefestival.nl, geen los domein of subdomein, zodat de autoriteit het hoofddomein en de tickets voedt.

## meetbaarheid & attributie (voor de advertising-strategie)

elke pagina is een trackbaar meetpunt, niet alleen een landing. de keten:

**pagina (pageview + opt-in event) → e-mail (loops) → ticket (eventix).**

- **pagina-laag:** pageviews + source/medium per gids/route via gtm (container al live: GTM-PSRD55F). meet of seo en ads de pagina's vullen.
- **opt-in-laag (de conversie die telt):** elke opt-in is een discreet event dat naar loops schrijft, met de pagina als source-tag en een stad-tag op het contact. zo weet je welke pagina/stad/route een adres opleverde.
- **ticket-laag:** eventix is de ticketbron; match op e-mail of een utm/discount-code vanuit de loops-mail sluit de lus.

trackbare conversie per pagina-type:

| pagina | primair opt-in event | secundaire signalen |
|---|---|---|
| stad-gids | `agenda_optin` (stad-tag) | pageviews, klik-naar-venue, klik-naar-ticket |
| agenda-pagina | `agenda_optin` + `event_reminder_optin` | agenda-views, event-klik |
| route-pagina | `route_guide_optin` (route-tag) | deep-link-shares |
| national pillar | `newsletter_optin` (zacht) | scroll-diepte, doorklik naar gids |

**dashboard-metriek:** rangschik pagina's op **opt-ins per 100 pageviews** (capture-rate), niet op pageviews alleen. een pagina met minder verkeer maar hoge opt-in-rate (route, proeverij) verdient budget boven een pagina met veel verkeer en lage rate.

**eerlijk over de meetgrens:** pagina → loops is 1st-party en hard te meten. loops → eventix leunt op e-mail-match of code, dus dat deel is een attributie-schatting, geen deterministische 1-op-1 tracking. behandel het in het dashboard als attributie, niet als zekerheid.

## status

- visueel plan + mockups: klaar (prototype, niets live).
- keyword-validatie met echte data (dataforseo): klaar. echte clusters zijn amsterdam (107 venues), rotterdam (32), utrecht (13), den haag (16); de rest is te dun voor een eigen stad-gids.
- bouw begint met de rijkere pins (de tekstlaag die alles voedt), op een branch, staging eerst, niet live.
- afhankelijkheid: de schaalbare vorm (stad-gidsen gegenereerd uit de venue-data) komt met de geplande astro-migratie; de rijkere pins en routes kunnen op de huidige kaart vooruit.
