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
import type { Groesse, Produktart } from "./preise";

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

type DBState = {
  staffeln: Map<string, Groesse[]>;
  motive: Map<string, { name: string | null; untertitel: string | null; intro: string | null; bestseller: boolean | null; aktiv: boolean }>;
};

/* DB-Zustand einmal pro Aufruf laden. Next cached den Server-Component-Render,
   deshalb ist kein zusätzliches In-Memory-Caching nötig. */
async function ladeDBState(): Promise<DBState | null> {
  const sb = supabaseServer();
  if (!sb) return null;
  try {
    const [staffelRes, motivRes] = await Promise.all([
      sb.from("preisstaffeln").select("id,groessen"),
      sb.from("motive_override").select("slug,name,untertitel,intro,bestseller,aktiv"),
    ]);
    if (staffelRes.error || motivRes.error) return null;

    const staffeln = new Map<string, Groesse[]>();
    for (const s of staffelRes.data ?? []) {
      if (Array.isArray(s.groessen) && s.groessen.length) staffeln.set(s.id, s.groessen as Groesse[]);
    }
    const motive = new Map<string, DBState["motive"] extends Map<string, infer V> ? V : never>();
    for (const m of motivRes.data ?? []) motive.set(m.slug, m);

    return { staffeln, motive };
  } catch {
    return null;
  }
}

/* Ein Produkt mit DB-Daten überlagern (neue, unabhängige Kopie). */
function ueberlagereProdukt(p: Produkt, db: DBState): Produkt {
  const groessen = db.staffeln.get(staffelId(p.art, p.motiv.format)) ?? p.groessen;
  const posterGroessen = p.posterGroessen
    ? db.staffeln.get(staffelId("poster", p.motiv.format)) ?? p.posterGroessen
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

  const info = PRODUKTARTEN[p.art];
  return {
    ...p,
    motiv,
    name: `${info.name} „${motiv.name}“`,
    groessen,
    posterGroessen,
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

/* ── Öffentliche async-API (spiegelt lib/katalog, aber DB-überlagert) ── */

export async function ladeKatalog(): Promise<Produkt[]> {
  const db = await ladeDBState();
  if (!db) return PRODUKTE;
  return PRODUKTE
    .filter((p) => istAktiv(p.motiv.slug, db))
    .map((p) => ueberlagereProdukt(p, db));
}

export async function ladeProduktById(id: string): Promise<Produkt | undefined> {
  const db = await ladeDBState();
  const p = PRODUKTE.find((x) => x.id === id);
  if (!p) return undefined;
  // Detailseite zeigt das Produkt auch, wenn das Motiv ausgeblendet ist? Nein:
  // ausgeblendete Motive sollen nicht kaufbar sein.
  if (db && !istAktiv(p.motiv.slug, db)) return undefined;
  return db ? ueberlagereProdukt(p, db) : p;
}

export async function ladeMotiveAktiv(): Promise<Motiv[]> {
  const db = await ladeDBState();
  const liste = db ? MOTIVE.filter((m) => istAktiv(m.slug, db)) : MOTIVE;
  if (!db) return liste;
  return liste.map((m) => {
    const ov = db.motive.get(m.slug);
    return ov
      ? { ...m, name: ov.name ?? m.name, untertitel: ov.untertitel ?? m.untertitel, intro: ov.intro ?? m.intro, bestseller: ov.bestseller ?? m.bestseller }
      : m;
  });
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
