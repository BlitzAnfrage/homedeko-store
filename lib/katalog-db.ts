/* DB-Overlay über den statischen Code-Katalog.
   ─────────────────────────────────────────────────────────────────────────
   Der Shop rendert weiterhin dieselben Produkt-Objekte wie zuvor (Form
   identisch mit PRODUKTE), aber Preise/Größen und Motiv-Felder werden – wenn
   Supabase erreichbar ist – aus der DB überschrieben und ausgeblendete Motive
   herausgefiltert. Fällt die DB aus, kommt der Code-Katalog UNVERÄNDERT zurück
   (der Shop ist nie kaputt).

   Nur serverseitig verwenden (Server-Components, Route-Handler). */
import "server-only";
import { supabaseServer } from "./supabase";
import {
  MOTIVE, PRODUKTE, KATEGORIEN, PRODUKTARTEN, WELT_FARBEN,
  type Produkt, type Motiv, type Ansicht,
} from "./katalog";
import {
  type Groesse, type Produktart,
  LEINWAND_QUADRAT, LEINWAND_QUER, POSTER_QUADRAT, POSTER_DINA,
  SET3_QUADRAT, SET3_PANORAMA, TAPETE, WALLPRINT,
} from "./preise";

export type { Produkt, Motiv, Ansicht };
export { KATEGORIEN, PRODUKTARTEN, WELT_FARBEN };

/* (art, format) → Preisstaffel-ID in der DB */
function staffelId(art: Produktart, format: "quadrat" | "quer"): string {
  switch (art) {
    case "leinwand": return format === "quadrat" ? "LEINWAND_QUADRAT" : "LEINWAND_QUER";
    case "poster":   return format === "quadrat" ? "POSTER_QUADRAT" : "POSTER_DINA";
    case "set3":     return format === "quadrat" ? "SET3_QUADRAT" : "SET3_PANORAMA";
    case "tapete":   return "TAPETE";
    case "wallprint":return "WALLPRINT";
  }
}

type MotivRow = { name: string | null; untertitel: string | null; intro: string | null; bestseller: boolean | null; aktiv: boolean };
type EigenesMotiv = {
  slug: string; name: string; untertitel: string; intro: string;
  format: "quadrat" | "quer"; kategorien: string[]; bestseller: boolean; aktiv: boolean;
};
type DBState = {
  staffeln: Map<string, Groesse[]>;
  motive: Map<string, MotivRow>;
  /* Preis-Ausnahmen je "<slug>::<art>" → ersetzt die Staffel für dieses Produkt */
  preisOverride: Map<string, Groesse[]>;
  /* DB-Bilder je Motiv-Slug (überschreiben/ergänzen die Code-Bilder) */
  bilder: Map<string, Ansicht[]>;
  /* Im Admin neu angelegte Motive (nicht im Code) */
  eigene: EigenesMotiv[];
  /* ausgeschaltete Varianten als Set von "<slug>::<art>" */
  variantenAus: Set<string>;
};

/* Standard-Staffel (Code-Werte) für ein neues Motiv, falls die DB-Staffel fehlt. */
function codeStaffel(art: Produktart, format: "quadrat" | "quer"): Groesse[] {
  switch (art) {
    case "leinwand": return format === "quadrat" ? LEINWAND_QUADRAT : LEINWAND_QUER;
    case "poster": return format === "quadrat" ? POSTER_QUADRAT : POSTER_DINA;
    case "set3": return format === "quadrat" ? SET3_QUADRAT : SET3_PANORAMA;
    case "tapete": return TAPETE;
    case "wallprint": return WALLPRINT;
  }
}

/* Baut die Produkte (leinwand/set3/tapete/wallprint) für ein eigenes Motiv. */
function baueEigeneProdukte(m: EigenesMotiv, db: DBState): Produkt[] {
  const motiv: Motiv = {
    slug: m.slug, name: m.name, untertitel: m.untertitel, intro: m.intro,
    format: m.format, kategorien: m.kategorien, bestseller: m.bestseller,
  };
  const bilder = db.bilder.get(m.slug) ?? [];
  return (["leinwand", "set3", "tapete", "wallprint"] as const).map((art) => {
    const info = PRODUKTARTEN[art];
    const groessen =
      db.preisOverride.get(`${m.slug}::${art}`)
      ?? db.staffeln.get(staffelId(art, m.format))
      ?? codeStaffel(art, m.format);
    const posterGroessen = art === "leinwand"
      ? (db.preisOverride.get(`${m.slug}::poster`) ?? db.staffeln.get(staffelId("poster", m.format)) ?? codeStaffel("poster", m.format))
      : undefined;
    return {
      id: `${info.slugPrefix}-${m.slug}`,
      art, motiv,
      name: `${info.name} „${m.name}“`,
      groessen, posterGroessen,
      ab: Math.min(...groessen.map((g) => g.preis)),
      posterAb: posterGroessen ? Math.min(...posterGroessen.map((g) => g.preis)) : undefined,
      bilder,
    };
  });
}

/* DB-Zustand einmal pro Aufruf laden. Next cached den Server-Component-Render,
   deshalb ist kein zusätzliches In-Memory-Caching nötig. */
async function ladeDBState(): Promise<DBState | null> {
  const sb = supabaseServer();
  if (!sb) return null;
  try {
    const [staffelRes, motivRes, preisOvRes, bilderRes, eigeneRes, variantenRes] = await Promise.all([
      sb.from("preisstaffeln").select("id,groessen"),
      sb.from("motive_override").select("slug,name,untertitel,intro,bestseller,aktiv"),
      sb.from("preis_override").select("key,groessen"),
      sb.from("motiv_bilder").select("motiv_slug,url,typ,sortierung").order("sortierung"),
      sb.from("eigene_motive").select("*").order("erstellt", { ascending: false }),
      sb.from("variante_aus").select("key"),
    ]);
    if (staffelRes.error || motivRes.error) return null;

    const staffeln = new Map<string, Groesse[]>();
    for (const s of staffelRes.data ?? []) {
      if (Array.isArray(s.groessen) && s.groessen.length) staffeln.set(s.id, s.groessen as Groesse[]);
    }
    const motive = new Map<string, MotivRow>();
    for (const m of motivRes.data ?? []) motive.set(m.slug, m);

    const preisOverride = new Map<string, Groesse[]>();
    for (const p of preisOvRes.data ?? []) {
      if (Array.isArray(p.groessen) && p.groessen.length) preisOverride.set(p.key, p.groessen as Groesse[]);
    }

    const bilder = new Map<string, Ansicht[]>();
    for (const b of bilderRes.data ?? []) {
      const liste = bilder.get(b.motiv_slug) ?? [];
      liste.push({ key: b.url, typ: b.typ, w: 0, h: 0, big: b.url, klein: b.url });
      bilder.set(b.motiv_slug, liste);
    }

    const eigene: EigenesMotiv[] = (eigeneRes.data as EigenesMotiv[]) ?? [];
    const variantenAus = new Set<string>((variantenRes.data ?? []).map((v) => v.key));

    return { staffeln, motive, preisOverride, bilder, eigene, variantenAus };
  } catch {
    return null;
  }
}

/* Ein Produkt mit DB-Daten überlagern (neue, unabhängige Kopie).
   Reihenfolge Preise: Produkt-Ausnahme (preis_override) > zentrale Staffel > Code. */
function ueberlagereProdukt(p: Produkt, db: DBState): Produkt {
  const ovKey = `${p.motiv.slug}::${p.art}`;
  const groessen =
    db.preisOverride.get(ovKey)
    ?? db.staffeln.get(staffelId(p.art, p.motiv.format))
    ?? p.groessen;
  const posterGroessen = p.posterGroessen
    ? db.preisOverride.get(`${p.motiv.slug}::poster`)
      ?? db.staffeln.get(staffelId("poster", p.motiv.format))
      ?? p.posterGroessen
    : undefined;

  const ov = db.motive.get(p.motiv.slug);
  const motiv: Motiv = ov
    ? {
        ...p.motiv,
        name: ov.name ?? p.motiv.name,
        untertitel: ov.untertitel ?? p.motiv.untertitel,
        intro: ov.intro ?? p.motiv.intro,
        bestseller: ov.bestseller ?? p.motiv.bestseller,
      }
    : p.motiv;

  // DB-Bilder ersetzen die Code-Bilder, wenn welche hochgeladen wurden
  const dbBilder = db.bilder.get(p.motiv.slug);
  const bilder = dbBilder && dbBilder.length ? dbBilder : p.bilder;

  const info = PRODUKTARTEN[p.art];
  return {
    ...p,
    motiv,
    name: `${info.name} „${motiv.name}“`,
    groessen,
    posterGroessen,
    bilder,
    ab: Math.min(...groessen.map((g) => g.preis)),
    posterAb: posterGroessen ? Math.min(...posterGroessen.map((g) => g.preis)) : undefined,
  };
}

/* Ist ein Motiv im Shop sichtbar? (default: ja, wenn kein DB-Eintrag) */
function istAktiv(slug: string, db: DBState | null): boolean {
  if (!db) return true;
  const ov = db.motive.get(slug);
  return ov ? ov.aktiv : true;
}

/* Ist eine konkrete Variante (Motiv+Art) ausgeschaltet? */
function varianteAus(slug: string, art: string, db: DBState | null): boolean {
  return db ? db.variantenAus.has(`${slug}::${art}`) : false;
}

/* ── Öffentliche async-API (spiegelt lib/katalog, aber DB-überlagert) ── */

export async function ladeKatalog(): Promise<Produkt[]> {
  const db = await ladeDBState();
  if (!db) return PRODUKTE;
  const codeProdukte = PRODUKTE
    .filter((p) => istAktiv(p.motiv.slug, db) && !varianteAus(p.motiv.slug, p.art, db))
    .map((p) => ueberlagereProdukt(p, db));
  // eigene, im Admin angelegte Motive dazu (nur aktive, ohne ausgeschaltete Varianten)
  const eigeneProdukte = db.eigene
    .filter((m) => m.aktiv)
    .flatMap((m) => baueEigeneProdukte(m, db))
    .filter((p) => !varianteAus(p.motiv.slug, p.art, db));
  return [...eigeneProdukte, ...codeProdukte];
}

export async function ladeProduktById(id: string): Promise<Produkt | undefined> {
  const db = await ladeDBState();

  // zuerst Code-Katalog
  const p = PRODUKTE.find((x) => x.id === id);
  if (p) {
    // ausgeblendetes Motiv ODER ausgeschaltete Variante = nicht kaufbar
    if (db && (!istAktiv(p.motiv.slug, db) || varianteAus(p.motiv.slug, p.art, db))) return undefined;
    return db ? ueberlagereProdukt(p, db) : p;
  }
  // sonst eigenes Motiv?
  if (db) {
    const eigene = db.eigene.filter((m) => m.aktiv)
      .flatMap((m) => baueEigeneProdukte(m, db))
      .filter((x) => !varianteAus(x.motiv.slug, x.art, db));
    return eigene.find((x) => x.id === id);
  }
  return undefined;
}

export async function ladeMotiveAktiv(): Promise<Motiv[]> {
  const db = await ladeDBState();
  if (!db) return MOTIVE;
  const code = MOTIVE.filter((m) => istAktiv(m.slug, db)).map((m) => {
    const ov = db.motive.get(m.slug);
    return ov
      ? { ...m, name: ov.name ?? m.name, untertitel: ov.untertitel ?? m.untertitel, intro: ov.intro ?? m.intro, bestseller: ov.bestseller ?? m.bestseller }
      : m;
  });
  const eigene: Motiv[] = db.eigene.filter((m) => m.aktiv).map((m) => ({
    slug: m.slug, name: m.name, untertitel: m.untertitel, intro: m.intro,
    format: m.format, kategorien: m.kategorien, bestseller: m.bestseller,
  }));
  return [...eigene, ...code];
}

export async function ladeProdukteInKategorie(katSlug: string): Promise<Produkt[]> {
  const alle = await ladeKatalog();
  return alle.filter((p) => p.motiv.kategorien.includes(katSlug));
}

export async function ladeProdukteVonArt(art: Produktart): Promise<Produkt[]> {
  const alle = await ladeKatalog();
  return alle.filter((p) => p.art === art);
}

/* Volltextsuche über den DB-überlagerten Katalog (nur aktive Motive). */
export async function sucheKatalog(begriff: string): Promise<Produkt[]> {
  const q = begriff.toLowerCase().trim();
  if (!q) return [];
  const woerter = q.split(/\s+/);
  const alle = await ladeKatalog();
  return alle.filter((p) => {
    const text = [p.name, p.motiv.name, p.motiv.untertitel, p.motiv.intro,
      ...p.motiv.kategorien.map((k) => KATEGORIEN.find((x) => x.slug === k)?.name ?? "")]
      .join(" ").toLowerCase();
    return woerter.every((w) => text.includes(w));
  });
}
