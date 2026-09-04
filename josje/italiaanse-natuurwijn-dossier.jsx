import { useState, useEffect, useRef } from "react";

// ── Palet ────────────────────────────────────────────────
const C = {
  bordeauxDeep: "#3A0E16",
  bordeaux: "#5A1722",
  wine: "#7E2433",
  amber: "#C8772E",
  terracotta: "#A8492A",
  gold: "#C39A4E",
  cream: "#F8F2E6",
  parchment: "#F0E7D5",
  ink: "#231A16",
  muted: "#7C6B5C",
  line: "#E1D5C0",
};
const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";

// ── Helpers ──────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(26px)",
        transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1700, className = "", style }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(value * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  const formatted = val.toLocaleString("nl-NL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function Amphora({ size = 64, color = "currentColor", stroke = 1.4, style }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 64 96" fill="none" style={style}>
      <path d="M25 7h14" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <path d="M27 8c0 6-3 9-3 13M37 8c0 6 3 9 3 13" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <path
        d="M24 21C11 29 9 48 17 64c4 13 8 21 15 23 7-2 11-10 15-23 8-16 6-35-7-43"
        stroke={color}
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <path d="M24 25c-9 0-13 11-8 17M40 25c9 0 13 11 8 17" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

function Eyebrow({ n, label, dark }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span style={{ color: C.gold, fontFamily: SERIF }} className="text-lg font-semibold">
        {n}
      </span>
      <span style={{ background: dark ? "rgba(248,242,230,.28)" : C.line }} className="h-px w-12" />
      <span
        style={{ color: dark ? "rgba(248,242,230,.72)" : C.muted, letterSpacing: "0.22em" }}
        className="text-xs font-semibold uppercase"
      >
        {label}
      </span>
    </div>
  );
}

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-6xl px-6 sm:px-10 ${className}`}>{children}</div>
);

// ── Data ─────────────────────────────────────────────────
const MARKETS = [
  {
    title: "Natuur- & biowijn",
    sub: "De groeimarkt",
    stats: [
      ["+33,83%", "jaarlijkse groei NL (CAGR)"],
      ["190+", "natuurwijnlocaties in NL"],
      ["8.000+", "locaties wereldwijd, 2025"],
    ],
  },
  {
    title: "Wijnprofessionals",
    sub: "Het B2B-netwerk",
    stats: [
      ["1.400+", "speciaalzaken & slijterijen"],
      ["16.000+", "restaurants"],
      ["15.000", "oplage Perswijn"],
    ],
  },
  {
    title: "Italië-liefhebbers",
    sub: "De cultuurmarkt",
    stats: [
      ["120.000", "lezers per editie Italië-media"],
      ["1.300+", "Italiaanse restaurants"],
      ["50.000", "bezoekers Italië Evenement"],
    ],
  },
];

const COMPARE = [
  ["Specifiek Italiaanse natuurwijn", "Het hele boek", "Nee — algemeen", "Nee — mix van landen"],
  ["Natuurwijnen geproefd", "Duizenden", "Enkele tientallen", "Beperkt"],
  ["Wijnmakers bezocht", "Honderden, heel Italië", "Nauwelijks", "Beperkt"],
  ["In Italië gewoond", "4 jaar", "Nee", "Nee"],
  ["Kwalificatie", "IW Ambassador + IW Scholar", "—", "Sommelier"],
];

const THEMES = [
  {
    t: "Oranjewijn",
    d: "Superpopulair in wijnbars en betere restaurants. Sinds 2025 officiële DOC-status voor gemacereerde witte wijnen in Collio.",
  },
  {
    t: "Wijn in amfora",
    d: "Eeuwenoude terracotta-traditie, in Friuli herleefd en als een olievlek over Italië verspreid. Er zijn inmiddels eigen congressen en beurzen aan gewijd.",
  },
  {
    t: "Oude stokken",
    d: "Jancis Robinson startte de Old Vine Registry; er wordt gelobbyd voor een eigen wijncategorie. Nog geen enkel boek behandelt dit in de diepte.",
  },
  {
    t: "Vergeten druiven",
    d: "Natuurwijnmakers als bewaarders die bijna verloren rassen aan de vergetelheid ontrukken — erfgoed én biodiversiteit.",
  },
];

const REACH = [
  ["Lancering & B2B", "Wine Professional", "Boeklancering gekoppeld aan masterclass; verkend wordt een ticketbundel — gegarandeerde basisafname onder restaurateurs, sommeliers en importeurs."],
  ["Media & publiek", "Il Giornale + Italië Evenement", "Vaste gastredacteur; mediapartner bij verschijning: redactie, interview, nieuwsbrief van 19.000+ en een podium voor 50.000 Italië-fans."],
  ["Retail & importeurs", "Zuiver · Vleck · Vinum Naturale e.a.", "Warme connecties voor bundeldeals, signeersessies en directe verkoop via webshops en winkels — de wijnmakers uit het boek zitten in hún portfolio."],
  ["Events & tour", "Vi.No.So en meer", "Gerichte promotietour langs de toonaangevende (natuur)wijn- en Italië-evenementen, met live proeverijen naast de makers uit het boek."],
];

// ── App ──────────────────────────────────────────────────
export default function Dossier() {
  return (
    <div style={{ background: C.cream, color: C.ink, fontFamily: SANS }} className="min-h-screen w-full overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&display=swap');
        html{scroll-behavior:smooth}
        ::selection{background:${C.amber};color:#fff}
      `}</style>

      {/* Header */}
      <header
        style={{ background: "rgba(58,14,22,.92)", borderBottom: "1px solid rgba(201,154,78,.25)", backdropFilter: "blur(6px)" }}
        className="sticky top-0 z-20"
      >
        <Container className="flex items-center justify-between py-3.5">
          <span style={{ color: C.cream, fontFamily: SERIF, letterSpacing: "0.04em" }} className="text-sm font-medium">
            Divino&nbsp;Natura
          </span>
          <span style={{ color: "rgba(248,242,230,.6)", letterSpacing: "0.18em" }} className="hidden text-[11px] font-semibold uppercase sm:block">
            Uitgeefdossier
          </span>
        </Container>
      </header>

      {/* Hero */}
      <section style={{ background: `radial-gradient(120% 90% at 80% 0%, ${C.bordeaux} 0%, ${C.bordeauxDeep} 60%)`, color: C.cream }} className="relative">
        <Amphora
          size={340}
          color="rgba(201,154,78,.12)"
          style={{ position: "absolute", right: "-40px", top: "10%", pointerEvents: "none" }}
        />
        <Container className="relative py-24 sm:py-32">
          <Reveal>
            <Eyebrow n="" label="Italiaanse natuurwijn · het dossier" dark />
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: SERIF, lineHeight: 0.98 }} className="max-w-4xl text-5xl font-medium sm:text-7xl">
              De markt beweegt.
              <br />
              <span style={{ color: C.amber }}>Het boek bestaat nog niet.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ color: "rgba(248,242,230,.82)" }} className="mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
              Er is geen boek over Italiaanse natuurwijn — niet in het Nederlands, niet in het Engels. En er is in Nederland
              precies één auteur met zowel de kwalificaties als de kilometers om het te schrijven.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ borderTop: "1px solid rgba(201,154,78,.3)" }} className="mt-12 flex flex-wrap gap-x-12 gap-y-4 pt-7">
              <div>
                <div style={{ fontFamily: SERIF, color: C.amber }} className="text-2xl">Josje van Oostrom</div>
                <div style={{ color: "rgba(248,242,230,.6)" }} className="text-sm">Italiaans sommelier · Divino Natura</div>
              </div>
              <div>
                <div style={{ fontFamily: SERIF, color: C.amber }} className="text-2xl">Manuscript gereed</div>
                <div style={{ color: "rgba(248,242,230,.6)" }} className="text-sm">~90.000 woorden · negen thema's</div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 01 — De verschuiving */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="01" label="De verschuiving" /></Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: SERIF }} className="max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">
              Terwijl conventionele wijn terrein verliest, groeit natuurwijn structureel.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { v: 9, dec: 0, pre: "–", suf: "%", lab: "Wereldwijde consumptie conventionele wijn (OIV)", neg: true },
              { v: 60, dec: 0, pre: "+", suf: "%", lab: "Natuurwijnlocaties wereldwijd, 2021 → 2024" },
              { v: 8000, dec: 0, pre: "", suf: "+", lab: "Locaties wereldwijd in 2025 (horeca & retail)" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 90}>
                <div style={{ background: i === 0 ? C.parchment : C.bordeaux, color: i === 0 ? C.ink : C.cream }} className="h-full rounded-2xl p-8">
                  <div style={{ fontFamily: SERIF, color: s.neg ? C.terracotta : i === 0 ? C.wine : C.amber }} className="text-5xl font-medium sm:text-6xl">
                    <CountUp value={s.v} decimals={s.dec} prefix={s.pre} suffix={s.suf} />
                  </div>
                  <p style={{ color: i === 0 ? C.muted : "rgba(248,242,230,.78)" }} className="mt-4 text-sm leading-relaxed">
                    {s.lab}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 02 — Nederland */}
      <section style={{ background: C.parchment }} className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="02" label="Nederland — koploper" /></Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 style={{ fontFamily: SERIF }} className="text-3xl font-medium leading-tight sm:text-4xl">
                Nederland behoort — samen met Italië — tot de snelste stijgers ter wereld.
              </h2>
              <p style={{ color: C.muted }} className="mt-6 text-base leading-relaxed">
                Het natuurwijnpubliek concentreert zich in stedelijke hubs en wordt gedreven door millennials en Gen Z: een
                loyale, premium doelgroep die bewust meer betaalt per fles. Precies waar conventionele wijnboeken terrein
                verliezen, opent zich de markt van de bewuste consument die het échte verhaal achter de fles zoekt.
              </p>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { v: 1276.9, dec: 1, pre: "+", suf: "%", lab: "Groei natuurwijnlocaties NL, 2016 → 2024" },
                { v: 33.83, dec: 2, pre: "", suf: "%", lab: "Samengestelde jaarlijkse groei (CAGR)" },
                { v: 190, dec: 0, pre: "", suf: "+", lab: "Geregistreerde locaties in Nederland" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div style={{ background: C.cream, border: `1px solid ${C.line}` }} className="rounded-2xl p-7">
                    <div style={{ fontFamily: SERIF, color: C.wine }} className="text-4xl font-medium sm:text-5xl">
                      <CountUp value={s.v} decimals={s.dec} prefix={s.pre} suffix={s.suf} />
                    </div>
                    <p style={{ color: C.muted }} className="mt-3 text-sm leading-relaxed">{s.lab}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 03 — Het kruispunt */}
      <section style={{ background: `linear-gradient(180deg, ${C.bordeaux} 0%, ${C.bordeauxDeep} 100%)`, color: C.cream }} className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="03" label="Het kruispunt" dark /></Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: SERIF }} className="max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">
              Dit boek staat op het snijpunt van drie uiterst actieve markten.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {MARKETS.map((m, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ background: "rgba(248,242,230,.05)", border: "1px solid rgba(201,154,78,.25)" }} className="flex h-full flex-col rounded-2xl p-8">
                  <span style={{ color: C.gold, letterSpacing: "0.18em" }} className="text-[11px] font-semibold uppercase">{m.sub}</span>
                  <h3 style={{ fontFamily: SERIF, color: C.cream }} className="mt-2 text-2xl font-medium">{m.title}</h3>
                  <div style={{ borderTop: "1px solid rgba(201,154,78,.2)" }} className="mt-6 space-y-4 pt-5">
                    {m.stats.map(([v, l], j) => (
                      <div key={j}>
                        <div style={{ fontFamily: SERIF, color: C.amber }} className="text-2xl">{v}</div>
                        <div style={{ color: "rgba(248,242,230,.66)" }} className="text-xs">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 04 — Het gat */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="04" label="Het gat in de markt" /></Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: SERIF }} className="max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">
              Er is wel ínteresse, maar geen autoriteit. Tot nu toe.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.wine}` }}>
                    <th className="py-4 pr-4 font-medium" style={{ color: C.muted }} />
                    <th className="py-4 px-4" style={{ fontFamily: SERIF, color: C.wine, fontSize: "1.05rem" }}>Josje van Oostrom</th>
                    <th className="py-4 px-4 font-medium" style={{ color: C.muted }}>NL · 2021</th>
                    <th className="py-4 px-4 font-medium" style={{ color: C.muted }}>BE</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td className="py-4 pr-4 font-medium" style={{ color: C.ink }}>{row[0]}</td>
                      <td className="py-4 px-4" style={{ background: "rgba(200,119,46,.08)", color: C.ink, fontWeight: 500 }}>{row[1]}</td>
                      <td className="py-4 px-4" style={{ color: C.muted }}>{row[2]}</td>
                      <td className="py-4 px-4" style={{ color: C.muted }}>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ color: C.muted }} className="mt-6 max-w-3xl text-sm leading-relaxed">
              De bestaande titels zijn algemeen, consumentgericht of behandelen meerdere landen door elkaar. Geen ervan is
              gebouwd op jaren reizen, wonen en proeven in Italië zelf.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 05 — De auteur */}
      <section style={{ background: C.parchment }} className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="05" label="De auteur" /></Reveal>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 style={{ fontFamily: SERIF }} className="text-3xl font-medium leading-tight sm:text-4xl">
                De enige in Nederland met zowel de internationale titels als de geleefde ervaring.
              </h2>
              <p style={{ color: C.muted }} className="mt-6 text-base leading-relaxed">
                Josje is als enige in Nederland zowel <strong style={{ color: C.ink }}>Italian Wine Ambassador</strong> (de
                prestigieuze opleiding van Vinitaly, waarvoor weinigen de eerste keer slagen) als{" "}
                <strong style={{ color: C.ink }}>Italian Wine Scholar met highest honours</strong>. Ze reisde heel Italië door,
                bezocht alle wijngebieden en honderden wijnmakers, en raakte onderweg bekeerd tot de natuurwijn.
              </p>
              <p style={{ color: C.muted }} className="mt-4 text-base leading-relaxed">
                Daarna woonde ze vier jaar in Italië, bezocht de natuurwijnbeurzen en proefde duizenden natuurwijnen. In
                Nederland verzorgt ze masterclasses, lezingen, cursussen, wijnreizen en events.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-5">
              {[
                ["Heel Italië", "doorgereisd, alle wijngebieden"],
                ["4 jaar", "in Italië gewoond"],
                ["Duizenden", "natuurwijnen geproefd"],
                ["Honderden", "wijnmakers persoonlijk bezocht"],
              ].map(([v, l], i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ background: C.cream, border: `1px solid ${C.line}` }} className="h-full rounded-2xl p-6">
                    <div style={{ fontFamily: SERIF, color: C.wine }} className="text-3xl font-medium">{v}</div>
                    <p style={{ color: C.muted }} className="mt-2 text-sm leading-snug">{l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 06 — De thema's */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="06" label="Thema's die internationaal in trek zijn" /></Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: SERIF }} className="max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">
              Niet de hele wijnkaart — maar precies de onderwerpen waar de wijnwereld nú naar kijkt.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {THEMES.map((t, i) => (
              <Reveal key={i} delay={i * 90}>
                <div style={{ background: C.cream, border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.amber}` }} className="flex h-full gap-5 rounded-2xl p-7">
                  <Amphora size={34} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 style={{ fontFamily: SERIF, color: C.wine }} className="text-xl font-medium">{t.t}</h3>
                    <p style={{ color: C.muted }} className="mt-2 text-sm leading-relaxed">{t.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 07 — De slagkracht */}
      <section style={{ background: `linear-gradient(180deg, ${C.bordeaux} 0%, ${C.bordeauxDeep} 100%)`, color: C.cream }} className="py-20 sm:py-28">
        <Container>
          <Reveal><Eyebrow n="07" label="De slagkracht — netwerk & afzet" dark /></Reveal>
          <Reveal delay={60}>
            <h2 style={{ fontFamily: SERIF }} className="max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">
              Het boek komt niet koud op de markt — het komt binnen via warme kanalen.
            </h2>
          </Reveal>
          <div className="mt-14 space-y-px overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(201,154,78,.25)" }}>
            {REACH.map((r, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ background: "rgba(248,242,230,.04)" }} className="grid gap-4 p-7 sm:grid-cols-12 sm:items-baseline">
                  <span style={{ color: C.gold, letterSpacing: "0.16em" }} className="text-[11px] font-semibold uppercase sm:col-span-3">{r[0]}</span>
                  <h3 style={{ fontFamily: SERIF, color: C.cream }} className="text-lg font-medium sm:col-span-3">{r[1]}</h3>
                  <p style={{ color: "rgba(248,242,230,.72)" }} className="text-sm leading-relaxed sm:col-span-6">{r[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Slot — De vraag */}
      <section style={{ background: C.bordeauxDeep, color: C.cream }} className="relative py-28 sm:py-36">
        <Amphora size={300} color="rgba(201,154,78,.10)" style={{ position: "absolute", left: "-30px", bottom: "0", pointerEvents: "none" }} />
        <Container className="relative">
          <Reveal>
            <p style={{ color: C.gold, letterSpacing: "0.2em" }} className="text-xs font-semibold uppercase">De vraag</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: SERIF, lineHeight: 1.05 }} className="mt-7 max-w-4xl text-4xl font-medium sm:text-6xl">
              Op welk moment wordt het voor u interessant om een boek over Italiaanse natuurwijn uit te geven?
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ color: "rgba(248,242,230,.82)" }} className="mt-8 max-w-2xl text-lg leading-relaxed">
              De markt is er. De expertise is er. Een compleet manuscript ligt klaar. De vorm — omvang, opzet, uitvoering —
              ontwerpen we graag samen.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ borderTop: "1px solid rgba(201,154,78,.3)" }} className="mt-14 flex flex-wrap items-end gap-x-12 gap-y-6 pt-8">
              <div>
                <div style={{ fontFamily: SERIF, color: C.amber }} className="text-2xl">Josje van Oostrom</div>
                <div style={{ color: "rgba(248,242,230,.62)" }} className="text-sm">Divino Natura · Wijk bij Duurstede</div>
              </div>
              <a href="mailto:divinonatura@gmail.com" style={{ color: C.cream }} className="text-sm underline-offset-4 hover:underline">
                divinonatura@gmail.com
              </a>
              <span style={{ color: "rgba(248,242,230,.62)" }} className="text-sm">06 – 24 15 76 88</span>
            </div>
          </Reveal>
        </Container>
      </section>

      <footer style={{ background: C.bordeauxDeep, color: "rgba(248,242,230,.4)", borderTop: "1px solid rgba(201,154,78,.15)" }} className="py-8">
        <Container className="text-center text-xs">
          Uitgeefdossier · Italiaanse natuurwijn · Cijfers o.b.v. OIV en Raisin-marktrapport 2025
        </Container>
      </footer>
    </div>
  );
}
