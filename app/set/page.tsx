import type { Metadata } from "next";
import Link from "next/link";
import { ladeProdukteVonArt } from "@/lib/katalog-db";
import { ladeSettings } from "@/lib/settings";
import { hauptbild } from "@/lib/katalog";
import SetBuilder from "./SetBuilder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stell dein Set zusammen — Mengenrabatt sichern",
  description: "Kombiniere mehrere Wandbilder und spare: je mehr du zusammenstellst, desto höher dein Rabatt.",
  alternates: { canonical: "/set" },
};

export default async function SetSeite() {
  const [produkte, settings] = await Promise.all([
    ladeProdukteVonArt("leinwand"),
    ladeSettings(),
  ]);
  const mr = settings.mengenrabatt;

  // schlankes Datenmodell für den Client
  const motive = produkte.map((p) => ({
    id: p.id,
    name: p.motiv.name,
    untertitel: p.motiv.untertitel,
    bild: hauptbild(p)?.klein ?? "",
    groessen: p.groessen.map((g) => ({ label: g.label, preis: g.preis, beliebt: !!g.beliebt })),
  }));

  const stufen = [...(mr.stufen ?? [])].sort((a, b) => a.ab - b.ab);
  const maxProzent = stufen.length ? Math.max(...stufen.map((s) => s.prozent)) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-12">
      <nav className="text-[12.5px] text-muted mb-4 flex gap-1.5">
        <Link href="/" className="hover:text-ink">Start</Link><span>/</span><span className="text-ink">Set zusammenstellen</span>
      </nav>

      {!mr.aktiv ? (
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl text-ink-strong mb-3">Set zusammenstellen</h1>
          <div className="card p-6 text-[14.5px] text-muted">
            Der Mengenrabatt ist derzeit nicht aktiv. Sobald er im Shop aktiviert ist,
            kannst du hier mehrere Bilder kombinieren und sparen.
          </div>
        </div>
      ) : (
        <SetBuilder motive={motive} stufen={stufen} maxProzent={maxProzent} nurLeinwand={mr.nur_leinwand} />
      )}
    </div>
  );
}
