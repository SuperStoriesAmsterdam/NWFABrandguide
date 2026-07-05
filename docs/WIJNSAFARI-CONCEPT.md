# Wijn Safari — Concept

Werkdocument. Vastgelegd na de conceptsessie van 4 juli 2026. Beslissingen, geen opties. Schrap en stuur bij.

---

## Wat het is

Een ontdekkingsmotor die je met houvast door de beurs helpt en er het maximale uithaalt. Met 50+ makers is navigeren voor 90% van de bezoekers ondoenlijk.

Het schaarse ding op de beurs is niet het aanbod, het is **jouw gehemelte en je tijd**. Je proeft er realistisch een stuk of acht serieus voordat je smaak op is. De Safari beheert dat proefbudget: geen slots verspillen aan willekeur of aan de drie namen die je al kende.

## De twee polen

Een goede dag brengt allebei:

- **Thuis** — wijnen die je snapt en lekker vindt. Geven vertrouwen, ijken je gehemelte, bevestigen dat de tool je kent.
- **Omver** — wijnen die je nooit had verwacht te proeven, die een deur openzetten.

Ze hangen aan elkaar. Het anker (thuis) is het ijkpunt dat bepaalt waar "nieuwe wereld" voor déze persoon begint. Voor een beginner is zijn eerste oranjewijn omver, voor een kenner is dat een dinsdag.

## Kernprincipes

1. **Lees smaak alleen in-domein.** Wijnvoorkeur uit wijn (je favoriete wijnen), avontuurlijkheid uit gedrag. Geen eten-naar-wijn-proxies: die voelen slim en liegen (blauwe kaas voorspelt geen funk-voorliefde).
2. **Vraag niet naar wat de motor moet berekenen.** De bezoeker geeft een anker en een dosis, de motor curateert de wijnen. De maker geeft feiten, de motor leidt funk, complexiteit en smaak af.
3. **Dosis stuurt de bezoeker, inhoud stuurt de motor.** De bezoeker kiest hoe hard hij geduwd wil worden, niet welke wijnen. Zo kan hij zichzelf niet terugsturen naar de veilige drie en blijft de ontdekking heel.
4. **Bias-veilig labelen.** Iedereen zegt "avontuurlijk". Labels zo zetten dat geen kant het sukkel-antwoord is, anders meet de knop niks meer.
5. **Herspeelbaar = exploratie.** Mensen draaien het een paar keer. Geen enkele run hoeft "de echte jij" te vangen. De tool onthoudt je vorige runs en duwt je een stap verder, of biedt bewust de tegenovergestelde hoek.

## De interactie (de vragen)

Alles licht, want je draait het opnieuw. Een antwoord dat niet lekker uitpakt is geen fout, het is je volgende run.

- **Anker: "wijnen die je al lekker vindt."** Typ je favorieten, of tik een paar herkenbare stijlen aan. Kenners typen echte wijnen, twijfelaars tikken een stijl. Eén veld, degradeert netjes.
- **Kleurvoorkeur.** Een drinker-signaal (waar grijp jij naar), niet een maker-signaal.
- **Dosis-dial.** Van trefzeker naar het diepe in, met labels die beide kanten aantrekkelijk maken. Stuurt hoe ver de omver-sprong gaat.
- **Lens per run: glou-glou ↔ culinair.** Een tweede as, los van funky. Stemming van vandaag: makkelijk wegdrinken, of wijnen om te ontrafelen bij eten.

## De output

- **Een tasting flight met een boog.** Een paar ankers om te landen en te ijken, opbouwend naar één of twee echte omver-momenten.
- **Elke stop is een kraam, verankerd op de ene wijn van die maker die bij deze bezoeker past.** De motor kiest die wijn, de maker niet. Dit is dus geen vaste "must-try" (die bestaat niet in de praktijk).
- **Standnummer is laat-gebonden.** Toont "volgt" tot de plattegrond er is, vaak pas de laatste dag. Zodra het nummer is ingevuld schakelt de route en de kaart vanzelf aan. De voorkant verandert niet, er komt alleen een nummer en een pin bij.
- **Proefbudget-bewust.** Rond de acht stops als plafond.

## Architectuur

- **Safari is één ervaring bovenop de TrueSomm-smaaklaag, geen apart brein.** Die laag houdt de kennis (welke wijn lijkt op welke), de match, en het geheugen (je groeiende profiel). Safari is een onderdeel van TrueSomm, niet het gezicht ervan.
- **Splitsing feiten / afgeleide coördinaten.** Makers geven alleen feiten. De motor leidt de interpretatieve coördinaten af (funk, complexiteit, smaak, sprong-afstand). Een curator met smaak doet een lichte correctieronde en vist de ~20% eruit die de motor misrekent. Dat is de kwaliteitspoort.
- **Naam.** De guide heet **The Natural Wineguide**. "TrueSomm" (de smaaklaag eronder) staat nog ter discussie: "somm" is precies het vakjargon en de drempel waar we van weg bewegen.

## Data / intake

Via Airtable (intake), daarna sync naar git als bron van waarheid die de Safari leest. Alleen feiten, dropdowns en vinkjes, dood-simpel voor een publiek met lage tool-literacy. Circa 250 wijnen.

**Maker** (één keer per deelnemer)
- naam
- land / streek
- e-mail (logistiek)
- standnummer — *leeg tot het laatst; het veld dat later de kaart aanzet*

**Wijn** (één rij per wijn, gekoppeld aan de maker)
- wijnnaam / cuvée
- jaartal — *jaar, of NV*
- kleur/type — *dropdown: wit · rood · rosé · oranje · bubbels*
- druiven — *multi-select + vrij typen; leidt single variety vs blend automatisch af*
- wijngaard — *optioneel, alleen bij single-vineyard*
- methode — *vinkjes: skin contact · pét-nat · amfora/qvevri · houtrijping · geen bijzonderheden*
- sulfiet — *dropdown: niets toegevoegd · een beetje bij bottelen*
- landbouw — *dropdown: biologisch · biodynamisch · in omschakeling*
- alcohol % — *optioneel; laag leunt naar glou, hoog naar culinair*
- prijsband — *dropdown, indicatieve winkelprijs per fles*

**Prijs.** Geen exact bedrag maar een band met één referent (indicatieve winkelprijs per fles): € tot ~18 · €€ 18–30 · €€€ 30–50 · €€€€ 50+ (ranges tunebaar). Prijs stuurt de smaak-match niet, want goedkoop is niet minder funky. Het is een zachte filter en verwachting ("laat me betaalbare ontdekkingen zien").

De provenance-velden (wijngaard, jaartal, methode) doen dubbel werk: een deel voedt de match, een deel voedt het verhaal dat een wijn tot vondst maakt ("8000 jaar qvevri, één wijngaard in Kakheti, 2021").

## Bewaren

**"Mail mij mijn safari."** De bezoeker krijgt een link, opent die op zijn telefoon bij de ingang, en past 'm daar aan. Lost in één klap op: bewaren, wisselen van laptop naar telefoon, en het mailadres voor de aanloop naar het festival. Geen account, geen wachtwoord. Het geheugen zelf leeft in de smaaklaag.

## Nog open

- **Naam** voor de smaaklaag eronder (guide zelf = The Natural Wineguide).
- **Default-mix thuis/omver.** De bezoeker zet 'm zelf via de dosis, maar de standaardverhouding kiezen we nog.
- **De boog.** Opbouwen naar de omver-klap aan het eind, of vroeg een klap geven en daarna laten landen.
- **"Wijzigen" op de dag** = de live herijking. Na de eerste slok: te veel, zachter, of juist wilder, en de rest beweegt mee.
- **Ranges** voor de prijsbanden en de gangbare-druivenlijst: tunebaar bij het inrichten van Airtable.
