import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUKTE, PRODUKTARTEN, KATEGORIEN, WELT_FARBEN } from "@/lib/katalog";
import { ladeKatalog, ladeProduktById } from "@/lib/katalog-db";
import { ladeSettings } from "@/lib/settings";
import {
  euro, INFO_LEINWAND, INFO_TAPETE, INFO_WALLPRINT,
} from "@/lib/preise";
import Gallery from "@/components/Gallery";
import BuyBox from "@/components/BuyBox";
import StickyKauf from "@/components/StickyKauf";
import ProductCard from "@/components/ProductCard";
import PdpArBanner from "@/components/PdpArBanner";
import { IconArrowRight, IconCheck } from "@/components/Icon";
import { SITE } from "@/lib/site";

/* Differenzierende Mini-Claims je Ausführung (keine erfundenen Zahlen) */
const NUTZEN: Record<string, string> = {
  leinwand: "Fertig bespannt, sofort aufhängen",
  set3: "Drei Teile, ein Auftritt",
  tapete: "Ganze Wand, bis 390 cm",
  wallprint: "Selbstklebend, ohne Kleister",
  poster: "Leichtes Budget, ab 18 €",
};

/* Seiten alle 60 s revalidieren → Admin-Änderungen (Preise/Motive) erscheinen
   spätestens nach 1 Min, ohne jede Anfrage die DB zu treffen. Zusätzlich
   löst das Admin nach dem Speichern eine sofortige Revalidierung aus. */
export const revalidate = 60;

export function generateStaticParams() {
  // volle ID-Liste (unabhängig von DB) für Vorab-Rendering
  return PRODUKTE.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await ladeProduktById(id);
  if (!p) return {};
  return {
    title: `${p.name} ab ${euro(p.ab)}`,
    description: `${p.motiv.intro.slice(0, 150)}… ✓ ab ${euro(p.ab)} ✓ versandkostenfrei ab 60 € ✓ alle Größen mit Sofortpreis.`,
    alternates: { canonical: `/produkt/${p.id}` },
  };
}

export default async function ProduktSeite({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await ladeProduktById(id);
  if (!p) notFound();

  const kats = p.motiv.kategorien
    .map((k) => KATEGORIEN.find((x) => x.slug === k))
    .filter(Boolean) as { slug: string; name: string }[];

  // Nebenlisten aus dem DB-überlagerten Katalog (blendet inaktive Motive aus)
  const alle = await ladeKatalog();
  const andereArten = alle.filter((x) => x.motiv.slug === p.motiv.slug && x.id !== p.id);
  const aehnlich = alle.filter(
    (x) => x.art === p.art && x.motiv.slug !== p.motiv.slug &&
      x.motiv.kategorien.some((k) => p.motiv.kategorien.includes(k))
  ).slice(0, 4);
  const wohnbilder = p.bilder.filter((b) => b.typ === "wb").slice(0, 4);

  // Bundle: andere Leinwand-Motive zum Dazuwählen + Mengenrabatt-Stufen
  const settings = await ladeSettings();
  const mr = settings.mengenrabatt;
  const bundleStufen = mr.aktiv ? [...(mr.stufen ?? [])].sort((a, b) => a.ab - b.ab) : [];
  const bundleMotive = bundleStufen.length
    ? alle.filter((x) => x.art === "leinwand" && x.id !== p.id).map((x) => ({
        id: x.id, name: x.motiv.name, bild: x.bilder[0]?.klein ?? "",
        groessen: x.groessen.map((g) => ({ label: g.label, preis: g.preis, beliebt: !!g.beliebt })),
      }))
    : [];

  const info = p.art === "tapete" ? INFO_TAPETE : p.art === "wallprint" ? INFO_WALLPRINT : INFO_LEINWAND;
  const infoZeilen = Object.values(info).flat();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.bilder.slice(0, 3).map((b) => SITE.domain + b.big),
    description: p.motiv.intro,
    brand: { "@type": "Brand", name: "Homedeko Store" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: p.ab,
      highPrice: Math.max(...p.groessen.map((g) => g.preis)),
      offerCount: p.groessen.length + (p.posterGroessen?.length ?? 0),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-5 pb-10">
      {/* Breadcrumb */}
      <nav className="text-[12.5px] text-muted mb-5 flex flex-wrap gap-1.5">
        <Link href="/" className="hover:text-ink">Start</Link><span>/</span>
        {kats[0] && (<><Link href={`/kategorie/${kats[0].slug}`} className="hover:text-ink">{kats[0].name}</Link><span>/</span></>)}
        <span className="text-ink">{p.name}</span>
      </nav>

      {/* Auf Mobil: Galerie → Titel+Kaufbox → dann Wissens-Content.
          Auf Desktop: klassisches 2-Spalten-Grid (Content links, Kaufbox rechts). */}
      <div className="flex flex-col lg:grid lg:grid-cols-[7fr_5fr] gap-8 lg:gap-12 items-start">
        {/* Galerie — auf Mobil zuerst, auf Desktop oben in der linken Spalte */}
        <div className="order-1 lg:hidden w-full">
          <Gallery bilder={p.bilder} alt={p.name} arProdukt={p} />
        </div>

        {/* Linke Content-Spalte */}
        <div className="order-3 lg:order-none space-y-8 min-w-0 w-full">
          {/* Galerie auf Desktop hier (auf Mobil oben ausgelagert) */}
          <div className="hidden lg:block">
            <Gallery bilder={p.bilder} alt={p.name} arProdukt={p} />
          </div>

          {/* AR-Banner — Haupt-Trigger direkt unter der Galerie */}
          <PdpArBanner p={p} />

          <section>
            <h2 className="font-display text-2xl text-ink-strong mb-3">Über dieses Motiv</h2>
            <p className="text-[15px] leading-relaxed text-ink">{p.motiv.intro}</p>
            {p.motiv.abgeleitet && (
              <p className="mt-2 text-[12px] text-muted">Motivname redaktionell vergeben.</p>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink-strong mb-4">Material & Verarbeitung</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {infoZeilen.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14px]">
                  <span className="text-ok mt-0.5 shrink-0"><IconCheck size={16} /></span>{t}
                </li>
              ))}
            </ul>
          </section>

          {/* Preistabelle — eingeklappt, ganz unten (BuyBox zeigt Preise interaktiv) */}
          <details className="card group">
            <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-4 text-[15px] font-semibold">
              Alle Größen & Preise ansehen
              <span className="text-gold-ink group-open:rotate-90 transition-transform"><IconArrowRight size={16} /></span>
            </summary>
            <div className="border-t border-line overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-bg text-left text-[12.5px] uppercase tracking-[0.1em] text-muted">
                    <th className="px-4 py-2.5 font-semibold">Größe</th>
                    <th className="px-4 py-2.5 font-semibold">Ausführung</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {p.groessen.map((g) => (
                    <tr key={g.label} className="border-t border-line">
                      <td className="px-4 py-2.5 font-medium">{g.label}{g.beliebt ? " ★" : ""}</td>
                      <td className="px-4 py-2.5 text-muted">{PRODUKTARTEN[p.art].name}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{euro(g.preis)}</td>
                    </tr>
                  ))}
                  {p.posterGroessen?.map((g) => (
                    <tr key={g.label} className="border-t border-line">
                      <td className="px-4 py-2.5 font-medium">{g.label}</td>
                      <td className="px-4 py-2.5 text-muted">Poster, 120 g matt</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{euro(g.preis)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[12.5px] text-muted px-4 py-3">★ beliebteste Größe · Alle Preise inkl. MwSt. · Versandkostenfrei ab 60 € (DE), darunter 8 €.</p>
            </div>
          </details>

          {/* „gibt es auch als" — visuelle Format-Cards, ganz unten */}
          {andereArten.length > 0 && (
            <section>
              <div className="eyebrow mb-2">Ein Motiv, viele Möglichkeiten</div>
              <h2 className="font-display text-2xl text-ink-strong mb-4">„{p.motiv.name}“ gibt es auch als</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {andereArten.map((a) => (
                  <Link key={a.id} href={`/produkt/${a.id}`} className="card lift group overflow-hidden">
                    <span className="zoomwrap block aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.bilder[0]?.klein} alt={PRODUKTARTEN[a.art].name} loading="lazy" className="w-full h-full object-cover" />
                    </span>
                    <span className="block p-3">
                      <span className="block font-semibold text-[14px] group-hover:text-gold-ink">{PRODUKTARTEN[a.art].name}</span>
                      <span className="block text-[11.5px] text-muted leading-snug mt-0.5">{NUTZEN[a.art] ?? ""}</span>
                      <span className="block text-[13.5px] font-semibold text-gold-ink mt-1.5">ab {euro(a.ab)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Kaufspalte — auf Mobil direkt nach der Galerie (order-2), auf Desktop rechts */}
        <div className="order-2 lg:order-none space-y-4 w-full">
          <div>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {kats.map((k) => {
                const farbe = WELT_FARBEN[k.slug] ?? { fg: "#8a6626", bg: "#f5edda" };
                return (
                  <Link key={k.slug} href={`/kategorie/${k.slug}`} className="chip" style={{ color: farbe.fg, background: farbe.bg }}>
                    {k.name}
                  </Link>
                );
              })}
              {p.motiv.bestseller && <span className="chip" style={{ color: "#fff", background: "#7c2237" }}>♥ Favorit</span>}
            </div>
            <h1 className="font-display text-[30px] leading-tight text-ink-strong">{p.name}</h1>
            <p className="text-[14.5px] text-muted mt-1.5">{p.motiv.untertitel}</p>
          </div>

          <BuyBox p={p} bundleMotive={bundleMotive} bundleStufen={bundleStufen} />
        </div>
      </div>

      {/* Wohnbeispiele groß */}
      {wohnbilder.length > 0 && (
        <section className="mt-16">
          <div className="eyebrow mb-2">In echten Räumen</div>
          <h2 className="font-display text-2xl lg:text-3xl text-ink-strong mb-6">„{p.motiv.name}" bei dir zuhause</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {wohnbilder.map((b) => (
              <div key={b.key} className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.big} alt={`${p.motiv.name} — Wohnbeispiel`} loading="lazy" className="w-full h-full object-cover aspect-square" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ähnliche Motive */}
      {aehnlich.length > 0 && (
        <section className="mt-16">
          <div className="eyebrow mb-2">Das könnte dir auch gefallen</div>
          <h2 className="font-display text-2xl lg:text-3xl text-ink-strong mb-6">Ähnliche Motive</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {aehnlich.map((a) => <ProductCard key={a.id} p={a} />)}
          </div>
        </section>
      )}

      <StickyKauf name={p.name} ab={p.ab} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: SITE.domain },
          ...(kats[0] ? [{ "@type": "ListItem", position: 2, name: kats[0].name, item: `${SITE.domain}/kategorie/${kats[0].slug}` }] : []),
          { "@type": "ListItem", position: kats[0] ? 3 : 2, name: p.name, item: `${SITE.domain}/produkt/${p.id}` },
        ],
      }) }} />
    </div>
  );
}
