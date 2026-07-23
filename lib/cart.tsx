"use client";
/* Warenkorb — React Context + localStorage (Muster aus der Shop-Blaupause) */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { versandkosten } from "./preise";

export type CartItem = {
  produktId: string;
  name: string;
  bild: string;
  variante: string;   // z. B. "Leinwand · 120 × 120 cm"
  preis: number;
  menge: number;
};

export type Rabatt = { code: string; typ: "prozent" | "fest"; wert: number; betrag: number };

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
  gesamt: number;
  anzahl: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "homedeko-warenkorb-v1";
const RABATT_KEY = "homedeko-rabatt-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [rabatt, setRabatt] = useState<Rabatt | null>(null);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const r = localStorage.getItem(RABATT_KEY);
      if (r) setRabatt(JSON.parse(r));
    } catch {}
    setGeladen(true);
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

  const summe = items.reduce((s, i) => s + i.preis * i.menge, 0);

  /* Rabatt bei jeder Warenwert-Änderung serverseitig neu berechnen, damit der
     abgezogene Betrag stimmt (z.B. Menge geändert) und ein ungültig gewordener
     Code (Mindestwert unterschritten) automatisch entfernt wird. */
  useEffect(() => {
    if (!geladen || !rabatt) return;
    let aktiv = true;
    (async () => {
      const r = await pruefeRabatt(rabatt.code, summe);
      if (!aktiv) return;
      if (!r.gueltig) setRabatt(null);
      else if (r.betrag !== rabatt.betrag) setRabatt({ code: r.code, typ: r.typ, wert: r.wert, betrag: r.betrag });
    })();
    return () => { aktiv = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summe, geladen]);

  const api = useMemo<CartCtx>(() => {
    const versand = items.length ? versandkosten(summe) : 0;
    const rabattBetrag = rabatt ? Math.min(rabatt.betrag, summe) : 0;
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
        const r = await pruefeRabatt(code, summe);
        if (!r.gueltig) return { ok: false, grund: r.grund };
        setRabatt({ code: r.code, typ: r.typ, wert: r.wert, betrag: r.betrag });
        return { ok: true };
      },
      rabattEntfernen: () => setRabatt(null),
      gesamt: Math.max(0, summe - rabattBetrag) + versand,
      anzahl: items.reduce((s, i) => s + i.menge, 0),
    };
  }, [items, summe, rabatt]);

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
