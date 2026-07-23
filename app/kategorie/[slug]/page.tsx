import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KATEGORIEN, Produkt, WELT_FARBEN } from "@/lib/katalog";
import { ladeProdukteInKategorie, ladeProdukteVonArt } from "@/lib/katalog-db";
import { euro } from "@/lib/preise";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

/* Produktart-Kollektionen mit echten Fakten aus der HDS-PDF */
const ART_SEITEN: Record<string, { art: "leinwand" | "set3" | "tapete" | "wallprint"; name: string; claim: string; text: string }> = {
  leinwandbilder: {
    art: "leinwand", name: "Leinwandbilder", claim: "Fertig bespannt · 80 × 80 bis 140 × 140 cm",
    text: "Alle Leinwandbilder werden fertig bespannt geliefert: Echtholzrahmen aus Kiefer (ca. 2 cm), Struktur-Leinengewebe, montierter Zacken-Aufhänger. Der Druck ist licht- und UV-beständig, reflexionsfrei und lässt sich mit einem trockenen Baumwolltuch pflegen. Jedes Motiv gibt es zusätzlich als Poster ab 18 € — die komplette Preisliste findest du auf jeder Produktseite.",
  },
  "3er-sets": {
    art: "set3", name: "3er-Sets", claim: "Drei Leinwände, ein großer Auftritt",
    text: "Ein Motiv, drei Leinwände: Unsere 3er-Kombis machen aus einer Wand eine Galerie. Alle Panels kommen fertig bespannt auf Echtholzrahmen mit Aufhänger — von kompakt (3 × 40 × 40 cm für 79 €) bis raumfüllend (3 × 90 × 90 cm für 329 €).",
  },
  fototapeten: {
    art: "tapete", name: "Fototapeten", claim: "ERFURT-Digitalvlies · bis 390 × 260 cm",
    text: "Unsere Fototapeten werden auf 195 g ERFURT-Digitalvlies gedruckt — kratz-, scheuer- und reißfest, mit exzellentem Nahtverhalten und dimensionsstabil. Die Verarbeitung gelingt mit handelsüblichem Kleister oder im Kleistergerät; die Bahnbreite beträgt 150 cm, breitere Motive werden in Bahnen gedruckt. Sieben Größen von 180 × 120 cm (79 €) bis 390 × 260 cm (269 €).",
  },
  wallprints: {
    art: "wallprint", name: "Wallprints — selbstklebend", claim: "Tapezieren ohne Kleister · ab 69 €",
    text: "Der Wallprint ist unsere selbstklebende Fototapete: 150 g Qualitätsdruck auf weißem, PVC-freiem Vlies. Schutzfolie abziehen, auf staubfreien, tragfähigen Untergrund anbringen — fertig. Neun Größen von 120 × 80 cm (69 €) bis 390 × 260 cm (299 €), Bahnbreite 120 cm.",
  },
};

export function generateStaticParams() {
  return [
    ...Object.keys(ART_SEITEN).map((slug) => ({ slug })),
    ...KATEGORIEN.map((k) => ({ slug: k.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const art = ART_SEITEN[slug];
  if (art) {
    const prod = await ladeProdukteVonArt(art.art);
    const ab = prod.length ? Math.min(...prod.map((p) => p.ab)) : 0;
    return { title: `${art.name} ab ${euro(ab)} — ${art.claim}`, description: art.text.slice(0, 160), alternates: { canonical: `/kategorie/${slug}` } };
  }
  const kat = KATEGORIEN.find((k) => k.slug === slug);
  if (!kat) return {};
  return { title: `${kat.name} — Wandbilder & Fototapeten`, description: kat.beschreibung.slice(0, 160), alternates: { canonical: `/kategorie/${slug}` } };
}

export default async function KategorieSeite({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artSeite = ART_SEITEN[slug];
  const kat = KATEGORIEN.find((k) => k.slug === slug);
  if (!artSeite && !kat) notFound();

  let produkte: Produkt[];
  let titel: string, claim: string, text: string;
  if (artSeite) {
    produkte = await ladeProdukteVonArt(artSeite.art);
    titel = artSeite.name; claim = artSeite.claim; text = artSeite.text;
  } else {
    produkte = (await ladeProdukteInKategorie(kat!.slug)).filter((p) => p.art === "leinwand");
    titel = kat!.name; claim = kat!.claim; text = kat!.beschreibung;
  }
  const ab = produkte.length ? Math.min(...produkte.map((p) => p.ab)) : 0;
  const farbe = kat ? WELT_FARBEN[kat.slug] : { fg: "#8a6626", bg: "#f5edda" };

  return (
    <div className="pt-0 pb-10">
      {/* Farbiges Welt-Band (Branding-Schema) */}
      <header className="border-b border-line" style={{ background: `linear-gradient(180deg, ${farbe.bg}, transparent)` }}>
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-8">
          <nav className="text-[12.5px] text-muted mb-4 flex gap-1.5">
            <Link href="/" className="hover:text-ink">Start</Link><span>/</span><span className="text-ink">{titel}</span>
          </nav>
          <div className="max-w-3xl">
            <span className="chip mb-3" style={{ color: farbe.fg, background: "#ffffffcc" }}>{claim}</span>
            <h1 className="font-display text-4xl text-ink-strong" style={{ color: farbe.fg }}>{titel}</h1>
            <p className="mt-3 text-[15px] text-muted leading-relaxed">{text}</p>
            <p className="mt-2 text-[13.5px] font-semibold">
              {produkte.length} {artSeite ? "Produkte" : "Motive"} · ab {euro(ab)} · versandkostenfrei ab 60 €
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-8">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {produkte.map((p, i) => <ProductCard key={p.id} p={p} prio={i < 4} />)}
      </div>

      {!artSeite && (
        <p className="mt-8 text-[13.5px] text-muted max-w-3xl">
          Tipp: Jedes Motiv gibt es als Leinwandbild, Poster, 3er-Set, Fototapete und
          selbstklebenden Wallprint — die passende Ausführung wählst du direkt auf der Produktseite.
        </p>
      )}
      </div>
    </div>
  );
}
