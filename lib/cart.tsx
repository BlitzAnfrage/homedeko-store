"use client";
/* Warenkorb — React Context + localStorage (Muster aus der Shop-Blaupause) */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { VERSAND_FREI_AB, VERSAND_KOSTEN } from "./preise";

export type CartItem = {
  produktId: string;
  name: string;
  bild: string;
  variante: string;   // z. B. "Leinwand · 120 × 120 cm"
  preis: number;
  menge: number;
};

export type Rabatt = { code: string; typ: "prozent" | "fest"; wert: number; betrag: number };
export type Addon = { id: string; titel: string; beschreibung: string; preis: number; vorausgewaehlt?: boolean };
export type MengenrabattStufe = { ab: number; prozent: number };
export type MengenrabattConf = { aktiv: boolean; nur_leinwand: boolean; stufen: MengenrabattStufe[] };

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (index: number) => void;
  setMenge: (index: number, menge: number) => void;
  clear: () => void;
  summe: number;
  versand: number;
  rabatt: Rabatt | null;
  rabattBetrag: number;
  rabattAnwenden: (code: string) => Promise<{ ok: boolean; grund?: string }>;
  rabattEntfernen: () => void;
  /* Add-ons (Upsells) */
  addons: Addon[];                       // verfügbare Add-ons
  addonGewaehlt: (id: string) => boolean;
  addonToggle: (id: string) => void;
  addonSumme: number;                    // Summe der gewählten Add-ons
  gewaehlteAddons: Addon[];
  /* Mengenrabatt */
  mengenrabattProzent: number;
  mengenrabattBetrag: number;
  mengenrabattStufen: MengenrabattStufe[];
  anzahlBilder: number;                  // für „nimm noch eins dazu"
  naechsteStufe: MengenrabattStufe | null;
  gesamt: number;
  anzahl: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "homedeko-warenkorb-v1";
const RABATT_KEY = "homedeko-rabatt-v1";
const ADDON_KEY = "homedeko-addons-v1";

export function CartProvider({
  children,
  versandFreiAb = VERSAND_FREI_AB,
  versandKosten = VERSAND_KOSTEN,
  addons = [],
  mengenrabatt = { aktiv: false, nur_leinwand: false, stufen: [] },
}: {
  children: React.ReactNode;
  versandFreiAb?: number;
  versandKosten?: number;
  addons?: Addon[];
  mengenrabatt?: MengenrabattConf;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [rabatt, setRabatt] = useState<Rabatt | null>(null);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const r = localStorage.getItem(RABATT_KEY);
      if (r) setRabatt(JSON.parse(r));
      const a = localStorage.getItem(ADDON_KEY);
      if (a) setAddonIds(JSON.parse(a));
      else {
        // vorausgewählte Add-ons initial anhaken
        const vor = addons.filter((x) => x.vorausgewaehlt).map((x) => x.id);
        if (vor.length) setAddonIds(vor);
      }
    } catch {}
    setGeladen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (geladen) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, geladen]);

  useEffect(() => {
    if (!geladen) return;
    try {
      if (rabatt) localStorage.setItem(RABATT_KEY, JSON.stringify(rabatt));
      else localStorage.removeItem(RABATT_KEY);
    } catch {}
  }, [rabatt, geladen]);

  useEffect(() => {
    if (geladen) try { localStorage.setItem(ADDON_KEY, JSON.stringify(addonIds)); } catch {}
  }, [addonIds, geladen]);

  const summe = items.reduce((s, i) => s + i.preis * i.menge, 0);

  /* Rabatt bei jeder Warenwert-Änderung serverseitig neu berechnen, damit der
     abgezogene Betrag stimmt (z.B. Menge geändert) und ein ungültig gewordener
     Code (Mindestwert unterschritten) automatisch entfernt wird. */
  useEffect(() => {
    if (!geladen || !rabatt) return;
    let aktiv = true;
    (async () => {
      // Gutschein auf den Warenwert NACH Mengenrabatt prüfen
      const zaehlt = (it: CartItem) => !mengenrabatt.nur_leinwand || /leinwand/i.test(it.variante) || /leinwand/i.test(it.produktId);
      const bilder = items.filter(zaehlt).reduce((s, i) => s + i.menge, 0);
      let mp = 0;
      if (mengenrabatt.aktiv) for (const st of [...(mengenrabatt.stufen ?? [])].sort((a, b) => a.ab - b.ab)) if (bilder >= st.ab) mp = st.prozent;
      const basis = items.filter(zaehlt).reduce((s, i) => s + i.preis * i.menge, 0);
      const warenNachMR = Math.max(0, summe - Math.round(basis * (mp / 100) * 100) / 100);
      const r = await pruefeRabatt(rabatt.code, warenNachMR);
      if (!aktiv) return;
      if (!r.gueltig) setRabatt(null);
      else if (r.betrag !== rabatt.betrag) setRabatt({ code: r.code, typ: r.typ, wert: r.wert, betrag: r.betrag });
    })();
    return () => { aktiv = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summe, geladen, mengenrabatt]);

  const api = useMemo<CartCtx>(() => {
    // Anzahl „Bilder" für den Mengenrabatt (optional nur Leinwände)
    const zaehltFuerRabatt = (it: CartItem) =>
      !mengenrabatt.nur_leinwand || /leinwand/i.test(it.variante) || /leinwand/i.test(it.produktId);
    const anzahlBilder = items.filter(zaehltFuerRabatt).reduce((s, i) => s + i.menge, 0);

    // Mengenrabatt-Stufe bestimmen
    const stufen = [...(mengenrabatt.stufen ?? [])].sort((a, b) => a.ab - b.ab);
    let mrProzent = 0;
    if (mengenrabatt.aktiv) {
      for (const st of stufen) if (anzahlBilder >= st.ab) mrProzent = st.prozent;
    }
    // Basis für Mengenrabatt = nur die zählenden Positionen
    const rabattBasis = items.filter(zaehltFuerRabatt).reduce((s, i) => s + i.preis * i.menge, 0);
    const mengenrabattBetrag = Math.round(rabattBasis * (mrProzent / 100) * 100) / 100;

    // nächste Stufe (für „nimm noch eins dazu")
    const naechsteStufe = mengenrabatt.aktiv
      ? (stufen.find((st) => st.ab > anzahlBilder) ?? null)
      : null;

    // Add-ons
    const gewaehlteAddons = addons.filter((a) => addonIds.includes(a.id));
    const addonSumme = gewaehlteAddons.reduce((s, a) => s + Number(a.preis || 0), 0);

    // Warenwert nach Mengenrabatt (Basis für Gutschein-Code + Gratisversand)
    const warenNachMR = Math.max(0, summe - mengenrabattBetrag);
    const rabattBetrag = rabatt ? Math.min(rabatt.betrag, warenNachMR) : 0;
    const versand = items.length ? (warenNachMR >= versandFreiAb ? 0 : versandKosten) : 0;

    const gesamt = Math.max(0, warenNachMR - rabattBetrag) + addonSumme + versand;

    return {
      items,
      add: (item) =>
        setItems((prev) => {
          const idx = prev.findIndex(
            (i) => i.produktId === item.produktId && i.variante === item.variante
          );
          if (idx >= 0) {
            const kopie = [...prev];
            kopie[idx] = { ...kopie[idx], menge: kopie[idx].menge + item.menge };
            return kopie;
          }
          return [...prev, item];
        }),
      remove: (index) => setItems((prev) => prev.filter((_, i) => i !== index)),
      setMenge: (index, menge) =>
        setItems((prev) => prev.map((it, i) => (i === index ? { ...it, menge: Math.max(1, menge) } : it))),
      clear: () => { setItems([]); setRabatt(null); },
      summe, versand, rabatt, rabattBetrag,
      rabattAnwenden: async (code: string) => {
        const r = await pruefeRabatt(code, warenNachMR);
        if (!r.gueltig) return { ok: false, grund: r.grund };
        setRabatt({ code: r.code, typ: r.typ, wert: r.wert, betrag: r.betrag });
        return { ok: true };
      },
      rabattEntfernen: () => setRabatt(null),
      addons,
      addonGewaehlt: (id) => addonIds.includes(id),
      addonToggle: (id) => setAddonIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
      addonSumme, gewaehlteAddons,
      mengenrabattProzent: mrProzent, mengenrabattBetrag,
      mengenrabattStufen: mengenrabatt.aktiv ? stufen : [],
      anzahlBilder, naechsteStufe,
      gesamt,
      anzahl: items.reduce((s, i) => s + i.menge, 0),
    };
  }, [items, summe, rabatt, versandFreiAb, versandKosten, addons, addonIds, mengenrabatt]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

async function pruefeRabatt(code: string, warenwert: number): Promise<{
  gueltig: boolean; grund?: string; code: string; typ: "prozent" | "fest"; wert: number; betrag: number;
}> {
  try {
    const res = await fetch("/api/rabatt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, warenwert }),
    });
    return await res.json();
  } catch {
    return { gueltig: false, grund: "Netzwerkfehler.", code, typ: "prozent", wert: 0, betrag: 0 };
  }
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart außerhalb des CartProviders");
  return ctx;
}
