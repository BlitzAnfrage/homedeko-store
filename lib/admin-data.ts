/* Server-seitige Datenzugriffe fürs Admin-Center (service_role, umgeht RLS).
   Alle Funktionen fangen Fehler ab und liefern sinnvolle Defaults, damit das
   Admin auch bei leerer DB nicht crasht. */
import "server-only";
import { supabaseServer } from "./supabase";

export type Preisstaffel = {
  id: string; titel: string; produktart: string; sortierung: number;
  groessen: { label: string; b?: number; h?: number; preis: number; beliebt?: boolean }[];
};

export type Rabattcode = {
  id: string; code: string; typ: "prozent" | "fest"; wert: number;
  mindestwert: number; aktiv: boolean; gueltig_ab: string | null;
  gueltig_bis: string | null; max_nutzungen: number | null; genutzt: number; erstellt: string;
};

export type MotivOverride = {
  slug: string; name: string | null; untertitel: string | null; intro: string | null;
  bestseller: boolean | null; aktiv: boolean; kategorien: string[] | null;
};

export type Bestellung = {
  id: string; nummer: string; status: string; kunde: Record<string, unknown>;
  items: unknown[]; summe: number; versand: number; rabatt_code: string | null;
  rabatt_betrag: number; gesamt: number; zeitpunkt: string;
};

export async function ladePreisstaffeln(): Promise<Preisstaffel[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("preisstaffeln").select("*").order("sortierung");
  return (data as Preisstaffel[]) ?? [];
}

export async function ladeRabattcodes(): Promise<Rabattcode[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("rabattcodes").select("*").order("erstellt", { ascending: false });
  return (data as Rabattcode[]) ?? [];
}

export async function ladeMotive(): Promise<MotivOverride[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("motive_override").select("*").order("slug");
  return (data as MotivOverride[]) ?? [];
}

export type PreisOverride = { key: string; motiv_slug: string; art: string; groessen: { label: string; b?: number; h?: number; preis: number; beliebt?: boolean }[] };
export type MotivBild = { id: string; motiv_slug: string; url: string; typ: string; sortierung: number };
export type EigenesMotiv = { slug: string; name: string; untertitel: string; intro: string; format: string; kategorien: string[]; bestseller: boolean; aktiv: boolean };

export async function ladePreisOverrides(): Promise<PreisOverride[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("preis_override").select("*");
  return (data as PreisOverride[]) ?? [];
}

export async function ladeMotivBilder(): Promise<MotivBild[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("motiv_bilder").select("*").order("sortierung");
  return (data as MotivBild[]) ?? [];
}

export async function ladeEigeneMotive(): Promise<EigenesMotiv[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("eigene_motive").select("*").order("erstellt", { ascending: false });
  return (data as EigenesMotiv[]) ?? [];
}

/* Ausgeschaltete Varianten als Liste von "<slug>::<art>". */
export async function ladeVariantenAus(): Promise<string[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("variante_aus").select("key");
  return (data ?? []).map((r) => r.key);
}

/* Alle Shop-Einstellungen als key→wert-Map (für den Admin-Editor). */
export async function ladeSettingsMap(): Promise<Record<string, unknown>> {
  const sb = supabaseServer();
  if (!sb) return {};
  const { data } = await sb.from("shop_settings").select("key,wert");
  const map: Record<string, unknown> = {};
  for (const r of data ?? []) map[r.key] = r.wert;
  return map;
}

export async function ladeBestellungen(limit = 100): Promise<Bestellung[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("bestellungen").select("*").order("zeitpunkt", { ascending: false }).limit(limit);
  return (data as Bestellung[]) ?? [];
}

export async function dashboardKennzahlen() {
  const sb = supabaseServer();
  if (!sb) return { bestellungen: 0, umsatz: 0, offene: 0, rabatte: 0, motiveAktiv: 0, motiveGesamt: 0 };

  const [best, rab, mot] = await Promise.all([
    sb.from("bestellungen").select("gesamt,status"),
    sb.from("rabattcodes").select("aktiv"),
    sb.from("motive_override").select("aktiv"),
  ]);

  const bestellungen = best.data ?? [];
  const umsatz = bestellungen
    .filter((b) => b.status !== "storniert")
    .reduce((s, b) => s + Number(b.gesamt || 0), 0);
  const offene = bestellungen.filter((b) => b.status === "neu").length;
  const rabatte = (rab.data ?? []).filter((r) => r.aktiv).length;
  const motive = mot.data ?? [];

  return {
    bestellungen: bestellungen.length,
    umsatz,
    offene,
    rabatte,
    motiveAktiv: motive.filter((m) => m.aktiv).length,
    motiveGesamt: motive.length,
  };
}
