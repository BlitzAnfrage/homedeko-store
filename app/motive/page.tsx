import type { Metadata } from "next";
import Link from "next/link";
import { PRODUKTE } from "@/lib/katalog";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Alle Motive — 24 kuratierte Wandbilder",
  description: "Die komplette Homedeko-Kollektion: 24 handverlesene Motive, jedes als Leinwandbild, Poster, 3er-Set, Fototapete und Wallprint erhältlich.",
  alternates: { canonical: "/motive" },
};

export default function MotiveSeite() {
  const produkte = PRODUKTE.filter((p) => p.art === "leinwand");
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-10">
      <nav className="text-[12.5px] text-muted mb-4 flex gap-1.5">
        <Link href="/" className="hover:text-ink">Start</Link><span>/</span><span className="text-ink">Alle Motive</span>
      </nav>
      <header className="max-w-3xl mb-8">
        <div className="eyebrow mb-2">Die komplette Kollektion</div>
        <h1 className="font-display text-4xl text-ink-strong">Alle 24 Motive</h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          Kuratiert statt beliebig: Jedes Motiv unserer Kollektion gibt es als fertig
          bespanntes Leinwandbild, als Poster, 3er-Set, Fototapete und selbstklebenden
          Wallprint. Klick dich rein — alle Größen und Preise stehen auf der Produktseite.
        </p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {produkte.map((p, i) => <ProductCard key={p.id} p={p} prio={i < 4} />)}
      </div>
    </div>
  );
}
