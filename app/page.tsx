import Link from "next/link";
import {
  KATEGORIEN, MOTIVE, PRODUKTE, motivBild, motivWohnbild, produkteVonArt, WELT_FARBEN,
} from "@/lib/katalog";
import { euro, INFO_LEINWAND } from "@/lib/preise";
import { USPS } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import ArHomeTeaser from "@/components/ArHomeTeaser";
import Newsletter from "@/components/Newsletter";
import { IconArrowRight, IconCheck, IconFrame, IconLock, IconShield, IconTruck } from "@/components/Icon";

/* USP-Icons in Emotionsfarben (BRANDING.md) */
const USP_ICONS: Record<string, { icon: React.ReactNode; farbe: string }> = {
  truck: { icon: <IconTruck size={22} />, farbe: "text-ok" },
  frame: { icon: <IconFrame size={22} />, farbe: "text-sepia" },
  shield: { icon: <IconShield size={22} />, farbe: "text-ok" },
  lock: { icon: <IconLock size={22} />, farbe: "text-bordeaux" },
};

export default function Home() {
  const lieblinge = PRODUKTE.filter((p) => p.art === "leinwand" && p.motiv.bestseller);
  const monat = PRODUKTE.find((p) => p.id === "leinwandbild-goldtattoo")!;
  const monatBild = motivBild("goldtattoo");

  /* Szene = Wohnbeispiel eines Motivs (Raumtiefe), davor schwebt EIN ANDERES Motiv
     derselben Stimmung → zeigt zwei Motive statt Dopplung. */
  const heroMotiv = (slug: string) => {
    const prod = PRODUKTE.find((x) => x.id === `leinwandbild-${slug}`);
    return {
      motiv: motivBild(slug)?.big ?? "",
      motivName: prod?.motiv.name ?? "",
      ab: prod?.ab ?? 99,
      href: `/produkt/leinwandbild-${slug}`,
    };
  };
  const slides = [
    {
      szene: motivWohnbild("geometrie-eins")?.big ?? "", ...heroMotiv("edle-waffe"),
      stimmung: "Stimmung: Dramatisch",
      zeile1: "Kunst, die man", akzent: "spürt", zeile2: "— nicht nur sieht.",
      sub: "Vintage-Fundstücke mit Patina und Geschichte, veredelt wie Museumsstücke — fertig bespannt an deine Wand.",
      ctaHref: "/kategorie/vintage-nostalgie", cta: "Vintage & Nostalgie",
    },
    {
      szene: motivWohnbild("rosa-rose-struktur")?.big ?? "", ...heroMotiv("bluetentraum-grunge"),
      stimmung: "Stimmung: Romantisch",
      zeile1: "Wände, die", akzent: "Geschichten", zeile2: "erzählen.",
      sub: "Pfingstrosen auf Terrakotta, Rosen auf Büttenpapier — Blumenbilder mit rauer Kante statt Kitsch.",
      ctaHref: "/kategorie/blumen-natur", cta: "Blumen & Natur",
    },
    {
      szene: motivWohnbild("rosette-fresko")?.big ?? "", ...heroMotiv("arabische-tueren"),
      stimmung: "Stimmung: Fernweh",
      zeile1: "Farben, die", akzent: "Fernweh", zeile2: "wecken.",
      sub: "Von der Alhambra bis zum Glockenpavillon: Weltarchitektur in warmem Terrakotta und Gold.",
      ctaHref: "/kategorie/ferne-welten", cta: "Ferne Welten",
    },
  ].filter((s) => s.szene && s.motiv);

  const moods = [
    { wort: "Dramatisch", slug: "vintage-nostalgie", motiv: "edle-waffe", text: "Patina, Tiefe, Geschichte" },
    { wort: "Golden", slug: "gold-glanz", motiv: "abstrakt-fliessend", text: "Glanz, der Licht einfängt" },
    { wort: "Lebendig", slug: "mandalas-ornamente", motiv: "rosette-pink-orange", text: "Farbe mit Zentrum & Ruhe" },
    { wort: "Romantisch", slug: "blumen-natur", motiv: "rosa-rose-struktur", text: "Blüten ohne Kitsch" },
  ].map((m) => ({ ...m, bild: motivBild(m.motiv) })).filter((m) => m.bild);

  const arten = [
    { p: produkteVonArt("leinwand"), titel: "Leinwandbilder", href: "/kategorie/leinwandbilder", slug: "goldtattoo" },
    { p: produkteVonArt("set3"), titel: "3er-Sets", href: "/kategorie/3er-sets", slug: "bluetentraum-grunge" },
    { p: produkteVonArt("tapete"), titel: "Fototapeten", href: "/kategorie/fototapeten", slug: "arabische-tueren" },
    { p: produkteVonArt("wallprint"), titel: "Wallprints", href: "/kategorie/wallprints", slug: "rosette-tuerkis" },
  ];

  const panoTuer = motivWohnbild("fernoestlicher-tempel-eins");
  const wohnbeispiele = ["geometrie-eins", "edle-waffe", "tausend-arme", "gute-zeiten", "rosette-pink-orange", "abstrakt-fliessend", "arabische-tueren", "bluetentraum-grunge"]
    .map((slug) => ({ slug, motiv: MOTIVE.find((m) => m.slug === slug)!, bild: motivWohnbild(slug) }))
    .filter((x) => x.bild);

  const faq = [
    { f: "Wie werden die Leinwandbilder geliefert?", a: "Fertig bespannt auf einem Echtholzrahmen aus Kiefer (ca. 2 cm) mit Struktur-Leinengewebe — inklusive montiertem Zacken-Aufhänger. Auspacken, aufhängen, fertig." },
    { f: "Was kostet der Versand?", a: "Innerhalb Deutschlands versenden wir ab 60 € Bestellwert kostenlos, darunter pauschal für 8 €." },
    { f: "Ist der Druck lichtbeständig?", a: "Ja — alle Motive werden licht- und UV-beständig gedruckt, reflexionsfrei und mit brillanter Motivwiedergabe. Zur Pflege genügt ein trockenes Baumwolltuch." },
    { f: "Wie verarbeite ich die Fototapete?", a: "Unsere Fototapeten (195 g ERFURT-Digitalvlies) lassen sich mit handelsüblichem Kleister verarbeiten — auch im Kleistergerät. Die Bahnbreite beträgt 150 cm; breitere Motive werden in Bahnen gedruckt. Wallprints sind selbstklebend: Schutzfolie abziehen und auf staubfreiem, tragfähigem Untergrund anbringen." },
    { f: "In welchen Größen gibt es die Motive?", a: "Leinwandbilder von 80 × 80 bis 140 × 140 cm, Poster von 50 × 50 bis 100 × 100 cm bzw. DIN A3 bis A0, 3er-Sets bis 3 × 90 × 90 cm und Fototapeten von 180 × 120 bis 390 × 260 cm. Auf jeder Produktseite siehst du alle Größen mit Preis — und das Motiv maßstabsgetreu an der Wand." },
  ];

  return (
    <>
      {/* ── 1+2 · Heller Hero + Marquee + 4 · AR-Feature-Sektion (Client-Wrapper) ── */}
      <ArHomeTeaser
        slides={slides}
        arProdukt={monat}
        teaserBild={motivWohnbild("goldtattoo")?.big ?? ""}
        teaserMotiv="Goldtattoo"
      />

      {/* ── 3 · USP-Leiste ── */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {USPS.map((u) => (
            <div key={u.titel} className="flex items-start gap-3">
              <span className={`${USP_ICONS[u.icon].farbe} mt-0.5`}>{USP_ICONS[u.icon].icon}</span>
              <span>
                <span className="block text-[13.5px] font-semibold">{u.titel}</span>
                <span className="block text-[12.5px] text-muted leading-snug">{u.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 · Motiv des Monats (hell, Passepartout) ── */}
      <section className="bg-bordeaux-soft" data-reveal>
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          {monatBild && (
            <Link href={`/produkt/${monat.id}`} className="passepartout lift block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={monatBild.big} alt={monat.name} className="w-full object-cover rounded-[4px]" />
            </Link>
          )}
          <div>
            <div className="eyebrow mb-3">Motiv des Monats · Juli</div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight text-ink-strong">
              „Goldtattoo<span className="display-italic text-bordeaux">“</span>
            </h2>
            <p className="display-italic text-[17px] text-bordeaux mt-2">Goldenes Ornament auf schwarzem Schiefer</p>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/80 max-w-lg">{monat.motiv.intro}</p>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-3xl text-ink-strong">ab {euro(monat.ab)}</span>
              <span className="text-[13.5px] text-ok font-medium">als Poster schon ab {euro(monat.posterAb ?? 18)}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/produkt/${monat.id}`} className="btn-gold px-7 py-3.5 text-[15px]">Zum Motiv</Link>
              <Link href="/kategorie/gold-glanz" className="btn-ghost px-7 py-3.5 text-[15px]">Mehr Gold & Glanz</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 · Stimmungs-Navigation (Mood-Cards square) ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16" data-reveal>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="eyebrow mb-2">Wie soll sich dein Raum anfühlen?</div>
          <h2 className="font-display text-3xl lg:text-4xl text-ink-strong">
            Kauf nach <span className="display-italic text-bordeaux">Gefühl</span>, nicht nach Katalog.
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {moods.map((m) => (
            <Link key={m.wort} href={`/kategorie/${m.slug}`} className="mood lift aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.bild!.klein} alt={m.wort} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="mood-wort">
                <span className="font-display display-italic text-2xl lg:text-3xl block">{m.wort}</span>
                <span className="text-[12.5px] text-white/85">{m.text}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {KATEGORIEN.map((k) => {
            const f = WELT_FARBEN[k.slug];
            return (
              <Link key={k.slug} href={`/kategorie/${k.slug}`} className="chip lift" style={{ color: f.fg, background: f.bg }}>
                {k.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 5 · Lieblingsmotive als Scroller ── */}
      <section id="bestseller" className="mx-auto max-w-7xl px-4 pt-16 scroll-mt-24" data-reveal>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="eyebrow mb-2">Handverlesen von unserer Redaktion</div>
            <h2 className="font-display text-3xl text-ink-strong">
              Unsere <span className="display-italic text-bordeaux">Lieblingsmotive</span>
            </h2>
          </div>
          <Link href="/motive" className="hidden sm:inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold-ink hover:underline shrink-0">
            Alle 24 Motive <IconArrowRight size={16} />
          </Link>
        </div>
        <div className="snap-row">
          {lieblinge.map((p, i) => (
            <div key={p.id} className="w-[262px] sm:w-[300px] lift">
              <ProductCard p={p} prio={i < 3} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 8 · Kollektions-Mosaik: 24 zeigen statt behaupten (hell) ── */}
      <section className="bg-gold-soft mt-16 py-16 lg:py-20" data-reveal>
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="eyebrow mb-4">Unser Versprechen</div>
          <p className="font-display display-italic text-3xl lg:text-[40px] leading-snug text-ink-strong">
            Keine 10.000 Bilder. Sondern 24, in die man sich <span className="text-bordeaux">verlieben</span> kann.
          </p>
          <p className="mt-4 text-[15px] text-ink/70 max-w-2xl mx-auto leading-relaxed">
            Jedes Motiv ist ein aufwendig veredeltes Einzelstück — und jedes gibt es als
            Leinwand, Poster, XXL-Fototapete oder selbstklebenden Wallprint.
          </p>
          {/* Mosaik aller 24 Motive — die Kuratierung zum Anfassen */}
          <div className="mt-9 grid grid-cols-6 lg:grid-cols-8 gap-1.5">
            {MOTIVE.map((m) => {
              const b = motivBild(m.slug);
              return (
                <Link key={m.slug} href={`/produkt/leinwandbild-${m.slug}`}
                  className="relative aspect-square rounded-[3px] overflow-hidden hover:z-10 hover:scale-[1.08] transition-transform duration-300"
                  title={m.name}>
                  {b && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={b.klein} alt={m.name} loading="lazy" className="w-full h-full object-cover" />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-9 flex items-center justify-center divide-x divide-line">
            {[["24", "kuratierte Motive"], ["4", "Produktarten"], ["33", "Größen je Motiv (bis zu)"]].map(([z, t]) => (
              <div key={t} className="px-6">
                <div className="zahl-display" style={{ color: "var(--ink-strong)" }}>{z}</div>
                <div className="mt-1.5 text-[12.5px] text-muted">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 · Produktarten kompakt ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16" data-reveal>
        <div className="eyebrow mb-2">Ein Motiv, vier Möglichkeiten</div>
        <h2 className="font-display text-3xl text-ink-strong mb-6">Wie soll dein Motiv an die Wand?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {arten.map((a) => {
            const bild = motivBild(a.slug);
            const ab = Math.min(...a.p.map((x) => x.ab));
            return (
              <Link key={a.titel} href={a.href} className="card lift group overflow-hidden">
                {bild && (
                  <span className="zoomwrap block aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bild.klein} alt={a.titel} loading="lazy" className="w-full h-full object-cover" />
                  </span>
                )}
                <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 p-4">
                  <span className="font-semibold text-[15px] group-hover:text-gold-ink">{a.titel}</span>
                  <span className="text-[13.5px] font-semibold text-gold-ink whitespace-nowrap">ab {euro(ab)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 10 · Panorama Fototapeten (Text in heller Glas-Karte) ── */}
      {panoTuer && (
        <section className="mt-16 relative" data-reveal>
          <div className="relative h-[360px] lg:h-[440px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={panoTuer.big} alt="Fototapete Fernöstlicher Tempel im Wohnraum" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />
            <div className="relative mx-auto max-w-7xl px-4 h-full flex flex-col justify-center">
              <div className="max-w-md bg-white/92 backdrop-blur rounded-[10px] p-6 lg:p-8" style={{ boxShadow: "0 30px 70px -34px rgba(94,26,42,.3)" }}>
                <div className="text-[11px] tracking-[0.22em] uppercase font-semibold text-gold-ink mb-3">Ganze Wände, ein Motiv</div>
                <h2 className="font-display text-3xl lg:text-4xl leading-tight text-ink-strong">
                  Fototapeten bis <span className="display-italic text-bordeaux">390 cm</span> Breite
                </h2>
                <p className="mt-3 text-[14.5px] text-muted leading-relaxed">
                  Reißfestes ERFURT-Digitalvlies, exzellentes Nahtverhalten — oder als
                  selbstklebender Wallprint ganz ohne Kleister. Ab 69 €.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link href="/kategorie/fototapeten" className="btn-gold px-6 py-3 text-[14.5px]">Fototapeten</Link>
                  <Link href="/kategorie/wallprints" className="btn-ghost px-6 py-3 text-[14.5px]">Wallprints</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 9 · Qualität ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 grid lg:grid-cols-2 gap-8 items-center" data-reveal>
        {motivBild("goldtattoo") && (
          <div className="rounded-md overflow-hidden border border-line order-2 lg:order-1 lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRODUKTE.find((p) => p.id === "leinwandbild-goldtattoo")!.bilder.find((b) => b.typ === "det")?.big ?? monatBild!.big} alt="Leinwandstruktur im Detail" className="w-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="order-1 lg:order-2">
          <div className="eyebrow mb-2">In Deutschland gefertigt · in Handarbeit</div>
          <h2 className="font-display text-3xl text-ink-strong mb-1.5">
            Kein Massendruck. <span className="display-italic text-bordeaux">Manufaktur</span>.
          </h2>
          <p className="text-[15px] text-muted mb-5 leading-relaxed max-w-lg">
            Jede Leinwand wird bei uns einzeln auf einen Echtholzrahmen aus Kiefer
            aufgezogen und von Hand bespannt — kein Fließband. Der Druck ist licht-
            und UV-beständig, reflexionsfrei und für Jahrzehnte gemacht.
          </p>
          <ul className="space-y-3">
            {[...INFO_LEINWAND.eigenschaften, ...INFO_LEINWAND.material, ...INFO_LEINWAND.druck].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[14.5px]">
                <span className="text-ok mt-0.5"><IconCheck size={17} /></span>{t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="chip" style={{ color: "#8a6626", background: "#f5edda" }}>🇩🇪 Made in Germany</span>
            <span className="chip" style={{ color: "#7c2237", background: "#f7e9ec" }}>♦ Manufaktur-Qualität</span>
            <span className="chip" style={{ color: "#2e7d43", background: "#e8f3ea" }}>30 Tage Rückgaberecht</span>
          </div>
        </div>
      </section>

      {/* ── 10 · Wohnbeispiel-Mosaik ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16" data-reveal>
        <div className="text-center mb-7">
          <div className="eyebrow mb-2">Zuhause bei unseren Motiven</div>
          <h2 className="font-display text-3xl text-ink-strong">
            So sieht das <span className="display-italic text-bordeaux">bei dir</span> aus
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 [grid-auto-rows:1fr]">
          {wohnbeispiele.map((w, i) => (
            <Link key={w.slug} href={`/produkt/leinwandbild-${w.slug}`}
              className={`card lift group overflow-hidden ${i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}`}>
              <span className="zoomwrap block h-full min-h-[160px] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i === 0 || i === 5 ? w.bild!.big : w.bild!.klein} alt={`${w.motiv.name} — Wohnbeispiel`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute left-3 bottom-3 bg-black/55 text-white text-[12.5px] font-medium px-2.5 py-1 rounded-[4px] backdrop-blur-sm">
                  „{w.motiv.name}“
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter-Gutschein ── */}
      <div className="mt-16"><Newsletter /></div>

      {/* ── 11 · FAQ ── */}
      <section className="mx-auto max-w-4xl px-4 pt-16" data-reveal>
        <div className="text-center mb-7">
          <div className="eyebrow mb-2">Gut zu wissen</div>
          <h2 className="font-display text-3xl text-ink-strong">Häufige Fragen</h2>
        </div>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.f} className="card px-5 py-4 group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-[15px] font-semibold">
                {f.f}
                <span className="text-gold-ink transition-transform group-open:rotate-90"><IconArrowRight size={16} /></span>
              </summary>
              <p className="mt-3 text-[14px] text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org", "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question", name: f.f,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ── 12 · SEO-Block ── */}
      <section className="mx-auto max-w-4xl px-4 pt-16 text-[14px] leading-relaxed text-muted space-y-4">
        <h2 className="font-display text-2xl text-ink-strong">Wandbilder online kaufen im Homedeko Store</h2>
        <p>
          Im Homedeko Store findest du <Link href="/kategorie/leinwandbilder" className="text-gold-ink underline">Leinwandbilder</Link>,{" "}
          <Link href="/kategorie/3er-sets" className="text-gold-ink underline">mehrteilige Leinwand-Sets</Link>,{" "}
          <Link href="/kategorie/fototapeten" className="text-gold-ink underline">Fototapeten</Link> und{" "}
          <Link href="/kategorie/wallprints" className="text-gold-ink underline">selbstklebende Wallprints</Link> —
          alle aus einer kuratierten Kollektion von 24 Motiven. Statt dich durch zehntausende Bilder zu
          klicken, wählst du nach Stimmung: <Link href="/kategorie/gold-glanz" className="text-gold-ink underline">Gold &amp; Glanz</Link>,{" "}
          <Link href="/kategorie/vintage-nostalgie" className="text-gold-ink underline">Vintage &amp; Nostalgie</Link>,{" "}
          <Link href="/kategorie/mandalas-ornamente" className="text-gold-ink underline">Mandalas &amp; Ornamente</Link>,{" "}
          <Link href="/kategorie/blumen-natur" className="text-gold-ink underline">Blumen &amp; Natur</Link>,{" "}
          <Link href="/kategorie/abstrakt-modern" className="text-gold-ink underline">Abstrakt &amp; Modern</Link> oder{" "}
          <Link href="/kategorie/ferne-welten" className="text-gold-ink underline">Ferne Welten</Link>.
        </p>
        <p>
          Jedes Leinwandbild wird fertig bespannt auf einem Echtholzrahmen aus Kiefer geliefert —
          inklusive Zacken-Aufhänger. Der Druck ist licht- und UV-beständig, reflexionsfrei und
          in Größen von 80 × 80 cm bis 140 × 140 cm erhältlich. Poster gibt es bereits ab 18 €,
          sodass du jedes Motiv auch mit kleinem Budget testen kannst — und auf jeder Produktseite
          siehst du das Motiv maßstabsgetreu neben einem Sofa, damit die Größe garantiert passt.
        </p>
        <p>
          Für große Auftritte sorgen unsere Fototapeten auf 195-g-ERFURT-Digitalvlies mit bis zu
          390 cm Breite: kratzfest, reißfest und mit exzellentem Nahtverhalten. Wer nicht kleistern
          möchte, greift zum selbstklebenden Wallprint — Schutzfolie abziehen, andrücken, fertig.
        </p>
        <p>
          Ab 60 € Bestellwert liefern wir innerhalb Deutschlands versandkostenfrei. Und weil jedes
          Motiv als Leinwand, Poster, Tapete und Wallprint erhältlich ist, findest du für jeden Raum
          und jedes Budget das passende Format — vom DIN-A3-Poster bis zur raumhohen Wand.
        </p>
      </section>

      {/* ── 13 · Meistgesucht ── */}
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-4">
        <div className="text-[12.5px] text-muted mb-2 font-semibold uppercase tracking-[0.14em]">Meistgesucht</div>
        <div className="flex flex-wrap gap-2">
          {["Gold", "Mandala", "Rose", "Vintage", "Türkis", "Buddha", "Abstrakt", "Orient", "Uhr"].map((b) => (
            <Link key={b} href={`/suche?q=${encodeURIComponent(b)}`} className="btn-ghost px-3.5 py-1.5 text-[13px]">{b}</Link>
          ))}
        </div>
      </section>
    </>
  );
}
