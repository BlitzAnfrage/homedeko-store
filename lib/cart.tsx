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

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (index: number) => void;
  setMenge: (index: number, menge: number) => void;
  clear: () => void;
  summe: number;
  versand: number;
  gesamt: number;
  anzahl: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "homedeko-warenkorb-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (geladen) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, geladen]);

  const api = useMemo<CartCtx>(() => {
    const summe = items.reduce((s, i) => s + i.preis * i.menge, 0);
    const versand = items.length ? versandkosten(summe) : 0;
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
      clear: () => setItems([]),
      summe, versand, gesamt: summe + versand,
      anzahl: items.reduce((s, i) => s + i.menge, 0),
    };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart außerhalb des CartProviders");
  return ctx;
}
