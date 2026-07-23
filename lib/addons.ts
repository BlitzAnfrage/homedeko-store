/* Add-ons (Upsells) laden. Öffentlich nur aktive, im Admin alle.
   Berechnung des Mengenrabatts. Nur serverseitig. */
import "server-only";
import { supabaseServer } from "./supabase";
import type { MengenrabattSettings } from "./settings";

export type Addon = {
  id: string; titel: string; beschreibung: string; preis: number;
  aktiv: boolean; vorausgewaehlt: boolean; sortierung: number;
};

/** Nur aktive Add-ons (für den Shop). */
export async function ladeAktiveAddons(): Promise<Addon[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("addons").select("*").eq("aktiv", true).order("sortierung");
  return (data as Addon[]) ?? [];
}

/** Alle Add-ons (für den Admin). */
export async function ladeAlleAddons(): Promise<Addon[]> {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data } = await sb.from("addons").select("*").order("sortierung");
  return (data as Addon[]) ?? [];
}

/** Berechnet den Mengenrabatt-Prozentsatz für eine Anzahl Bilder. */
export function mengenrabattProzent(anzahlBilder: number, mr: MengenrabattSettings): number {
  if (!mr.aktiv || !mr.stufen?.length) return 0;
  // höchste passende Stufe (ab <= anzahl)
  const passend = mr.stufen
    .filter((s) => anzahlBilder >= s.ab)
    .sort((a, b) => b.prozent - a.prozent)[0];
  return passend ? passend.prozent : 0;
}
