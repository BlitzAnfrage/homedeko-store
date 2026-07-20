import Link from "next/link";
import { Produkt, hauptbild, wohnbild, PRODUKTARTEN, KATEGORIEN, WELT_FARBEN } from "@/lib/katalog";
import { euro } from "@/lib/preise";

/* Dichte Produktkarte mit Hover-Bildwechsel (Ansicht → Wohnbeispiel),
   Welt-Farb-Chip und Favorit-Badge (Branding-Schema) */
export default function ProductCard({ p, prio }: { p: Produkt; prio?: boolean }) {
  const bild = hauptbild(p);
  const wb = wohnbild(p);
  const beliebt = p.groessen.find((g) => g.beliebt);
  const weltSlug = p.motiv.kategorien[0];
  const welt = KATEGORIEN.find((k) => k.slug === weltSlug);
  const farbe = WELT_FARBEN[weltSlug];
  return (
    <Link href={`/produkt/${p.id}`} className="card group flex flex-col overflow-hidden">
      <span className="relative block aspect-square overflow-hidden bg-bg">
        {bild && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={bild.klein} alt={p.name} loading={prio ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
        )}
        {wb && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={wb.klein} alt={`${p.motiv.name} — Wohnbeispiel`} loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {p.motiv.bestseller && p.art === "leinwand" && (
          <span className="absolute left-2.5 top-2.5 bg-bordeaux text-white text-[11px] font-bold tracking-wide px-2 py-1 rounded-[3px]">
            ♥ Favorit
          </span>
        )}
      </span>
      <span className="flex flex-col gap-1 p-3.5">
        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 min-w-0">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted truncate">{PRODUKTARTEN[p.art].name}</span>
          {welt && farbe && (
            <span className="chip self-start shrink-0 whitespace-nowrap" style={{ color: farbe.fg, background: farbe.bg }}>{welt.name.split(" & ")[0]}</span>
          )}
        </span>
        <span className="text-[15px] font-semibold leading-snug group-hover:text-gold-ink">{p.motiv.name}</span>
        <span className="text-[12.5px] text-muted leading-snug">{p.motiv.untertitel}</span>
        <span className="mt-1 text-[15px]">
          ab <span className="font-bold">{euro(p.ab)}</span>
          {p.posterAb
            ? <span className="text-[12px] text-ok font-medium"> · als Poster schon ab {euro(p.posterAb)}</span>
            : beliebt && <span className="text-[12px] text-muted"> · beliebt: {beliebt.label} für {euro(beliebt.preis)}</span>}
        </span>
      </span>
    </Link>
  );
}
