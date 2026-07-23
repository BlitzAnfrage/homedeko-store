/* Shop-Einstellungen aus der DB (shop_settings) mit Code-Fallback.
   Gleiche Philosophie wie katalog-db: fällt Supabase aus, kommen die
   Standard-Werte zurück → Shop nie kaputt. Nur serverseitig verwenden. */
import "server-only";
import { supabaseServer } from "./supabase";

export type VersandSettings = {
  frei_ab: number; kosten: number; ruecknahme_tage: number; newsletter_prozent: number;
};
export type FirmaSettings = {
  name: string; inhaber: string; strasse: string; plz: string; ort: string; land: string;
  email: string; telefon: string; ustid: string; registergericht: string; hrb: string; domain: string;
};
export type TexteSettings = {
  banner: string[]; claim: string; seo_beschreibung: string;
};
export type RechtstexteSettings = {
  impressum: string; datenschutz: string; agb: string; widerruf: string;
};
export type ZahlungSettings = {
  /* Bankverbindung für Vorkasse — wird dem Kunden nach Bestellung angezeigt. */
  bank_inhaber: string; bank_iban: string; bank_bic: string; bank_name: string;
};
export type MengenrabattStufe = { ab: number; prozent: number };
export type MengenrabattSettings = {
  aktiv: boolean; nur_leinwand: boolean; stufen: MengenrabattStufe[];
};
export type ShopSettings = {
  versand: VersandSettings;
  firma: FirmaSettings;
  texte: TexteSettings;
  rechtstexte: RechtstexteSettings;
  zahlung: ZahlungSettings;
  mengenrabatt: MengenrabattSettings;
};

/* Code-Defaults — greifen, wenn die DB nichts liefert. */
export const DEFAULT_SETTINGS: ShopSettings = {
  versand: { frei_ab: 60, kosten: 8, ruecknahme_tage: 30, newsletter_prozent: 10 },
  firma: {
    name: "Homedeko Store", inhaber: "", strasse: "", plz: "", ort: "", land: "Deutschland",
    email: "", telefon: "", ustid: "", registergericht: "", hrb: "", domain: "https://homedeko-store.de",
  },
  texte: {
    banner: [
      "Versandkostenfrei ab 60 € (Deutschland)",
      "30 Tage Rückgaberecht — kostenlose Rücksendung",
      "Kauf auf Rechnung & Käuferschutz",
      "Fertig bespannt in Deutschland gefertigt",
    ],
    claim: "Kunst für deine Wände",
    seo_beschreibung: "Kuratierte Wandbilder: Leinwandbilder, 3er-Sets, Fototapeten und selbstklebende Wallprints. In Handarbeit veredelte Motive, fertig bespannt, ab 18 €.",
  },
  rechtstexte: { impressum: "", datenschutz: "", agb: "", widerruf: "" },
  zahlung: { bank_inhaber: "", bank_iban: "", bank_bic: "", bank_name: "" },
  mengenrabatt: { aktiv: false, nur_leinwand: false, stufen: [{ ab: 2, prozent: 20 }, { ab: 3, prozent: 30 }] },
};

/* Lädt alle Einstellungen und merged sie über die Defaults (fehlende Keys
   fallen auf den Default zurück, damit neue Felder nie undefined sind). */
export async function ladeSettings(): Promise<ShopSettings> {
  const sb = supabaseServer();
  if (!sb) return DEFAULT_SETTINGS;
  try {
    const { data, error } = await sb.from("shop_settings").select("key,wert");
    if (error || !data) return DEFAULT_SETTINGS;
    const map = new Map(data.map((r) => [r.key, r.wert]));
    return {
      versand: { ...DEFAULT_SETTINGS.versand, ...(map.get("versand") as object ?? {}) },
      firma: { ...DEFAULT_SETTINGS.firma, ...(map.get("firma") as object ?? {}) },
      texte: { ...DEFAULT_SETTINGS.texte, ...(map.get("texte") as object ?? {}) },
      rechtstexte: { ...DEFAULT_SETTINGS.rechtstexte, ...(map.get("rechtstexte") as object ?? {}) },
      zahlung: { ...DEFAULT_SETTINGS.zahlung, ...(map.get("zahlung") as object ?? {}) },
      mengenrabatt: { ...DEFAULT_SETTINGS.mengenrabatt, ...(map.get("mengenrabatt") as object ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
