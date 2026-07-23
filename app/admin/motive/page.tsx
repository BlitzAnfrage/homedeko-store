import { ladeMotive, ladeMotivBilder, ladePreisOverrides, ladeEigeneMotive, ladeVariantenAus } from "@/lib/admin-data";
import { motivBild, KATEGORIEN, PRODUKTARTEN, MOTIVE } from "@/lib/katalog";
import { LEINWAND_QUADRAT, LEINWAND_QUER, POSTER_QUADRAT, POSTER_DINA, SET3_QUADRAT, SET3_PANORAMA, TAPETE, WALLPRINT } from "@/lib/preise";
import MotiveVerwaltung from "./MotiveVerwaltung";

export const dynamic = "force-dynamic";

/* Standard-Größen je (art, format) — als Vorlage für neue Preis-Ausnahmen. */
function standardGroessen(art: string, format: string) {
  const q = format !== "quer";
  switch (art) {
    case "leinwand": return q ? LEINWAND_QUADRAT : LEINWAND_QUER;
    case "poster": return q ? POSTER_QUADRAT : POSTER_DINA;
    case "set3": return q ? SET3_QUADRAT : SET3_PANORAMA;
    case "tapete": return TAPETE;
    case "wallprint": return WALLPRINT;
    default: return [];
  }
}

export default async function MotivePage() {
  const [overrides, bilder, preisOv, eigene, variantenAus] = await Promise.all([
    ladeMotive(), ladeMotivBilder(), ladePreisOverrides(), ladeEigeneMotive(), ladeVariantenAus(),
  ]);
  const ausSet = new Set(variantenAus);

  // Preis-Ausnahmen je Motiv als {art: groessen[]} für den Editor
  const ausnahmenVon = (slug: string) =>
    Object.fromEntries(preisOv.filter((p) => p.motiv_slug === slug).map((p) => [p.art, p.groessen]));
  const variantenAusVon = (slug: string) =>
    ["leinwand", "set3", "tapete", "wallprint"].filter((art) => ausSet.has(`${slug}::${art}`));

  // Code-Motive mit Bild + zugehörigen DB-Bildern + Preis-Ausnahmen anreichern
  const codeMotive = overrides.map((m) => ({
    ...m,
    eigen: false,
    format: MOTIVE.find((x) => x.slug === m.slug)?.format ?? "quadrat",
    bild: motivBild(m.slug)?.klein ?? null,
    dbBilder: bilder.filter((b) => b.motiv_slug === m.slug),
    ausnahmen: Object.keys(ausnahmenVon(m.slug)),
    ausnahmeGroessen: ausnahmenVon(m.slug),
    variantenAus: variantenAusVon(m.slug),
  }));

  const eigeneMotive = eigene.map((m) => ({
    slug: m.slug, name: m.name, untertitel: m.untertitel, intro: m.intro,
    bestseller: m.bestseller, aktiv: m.aktiv, kategorien: m.kategorien,
    eigen: true, format: m.format,
    bild: bilder.find((b) => b.motiv_slug === m.slug)?.url ?? null,
    dbBilder: bilder.filter((b) => b.motiv_slug === m.slug),
    ausnahmen: Object.keys(ausnahmenVon(m.slug)),
    ausnahmeGroessen: ausnahmenVon(m.slug),
    variantenAus: variantenAusVon(m.slug),
  }));

  // Vorlagen-Größen als Plain-Objekt an den Client geben
  const vorlagen: Record<string, ReturnType<typeof standardGroessen>> = {};
  for (const art of ["leinwand", "poster", "set3", "tapete", "wallprint"]) {
    for (const format of ["quadrat", "quer"]) {
      vorlagen[`${art}::${format}`] = standardGroessen(art, format);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Motive & Produkte</h1>
        <p className="text-[14px] text-muted mt-0.5">
          Motive ein-/ausblenden, Texte & Bilder bearbeiten, eigene Preise setzen — oder ein ganz neues Motiv anlegen.
          Preise ohne Ausnahme kommen aus <b>Preise & Größen</b>.
        </p>
      </div>
      <MotiveVerwaltung
        motive={[...eigeneMotive, ...codeMotive]}
        kategorien={KATEGORIEN.map((k) => ({ slug: k.slug, name: k.name }))}
        produktarten={Object.entries(PRODUKTARTEN).map(([k, v]) => ({ art: k, name: v.name }))}
        vorlagen={vorlagen}
      />
    </div>
  );
}
