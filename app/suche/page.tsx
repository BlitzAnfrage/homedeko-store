"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { suche } from "@/lib/katalog";
import ProductCard from "@/components/ProductCard";

function Ergebnisse() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const treffer = suche(q);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-10">
      <nav className="text-[12.5px] text-muted mb-4 flex gap-1.5">
        <Link href="/" className="hover:text-ink">Start</Link><span>/</span><span className="text-ink">Suche</span>
      </nav>
      <h1 className="font-display text-3xl text-ink-strong mb-1">
        {q ? <>Suche: „{q}"</> : "Suche"}
      </h1>
      <p className="text-[14px] text-muted mb-7">
        {q ? `${treffer.length} Treffer` : "Gib oben einen Suchbegriff ein — z. B. Gold, Mandala, Vintage."}
      </p>
      {treffer.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {treffer.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : q ? (
        <div className="card p-8 text-center max-w-xl">
          <p className="text-[15px] font-semibold mb-2">Dazu haben wir leider nichts gefunden.</p>
          <p className="text-[13.5px] text-muted mb-5">Probiere es mit einem allgemeineren Begriff — oder stöbere in der Kollektion.</p>
          <Link href="/motive" className="btn-gold px-6 py-3 text-[14px] inline-block">Alle Motive ansehen</Link>
        </div>
      ) : null}
    </div>
  );
}

export default function SuchSeite() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted">Suche lädt …</div>}>
      <Ergebnisse />
    </Suspense>
  );
}
