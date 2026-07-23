"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { IconCheck, IconClose } from "./Icon";

/* Rabattcode-Eingabe im Warenkorb. Prüft serverseitig (Codes bleiben geheim). */
export default function RabattFeld() {
  const cart = useCart();
  const [code, setCode] = useState("");
  const [fehler, setFehler] = useState("");
  const [busy, setBusy] = useState(false);
  const [offen, setOffen] = useState(false);

  const anwenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true); setFehler("");
    const r = await cart.rabattAnwenden(code.trim());
    setBusy(false);
    if (r.ok) { setCode(""); setOffen(false); }
    else setFehler(r.grund ?? "Code ungültig.");
  };

  if (cart.rabatt) {
    return (
      <div className="mb-4 flex items-center justify-between gap-2 rounded-md bg-ok-soft border border-ok/30 px-3 py-2.5">
        <span className="flex items-center gap-2 text-[13.5px] font-medium text-ok min-w-0">
          <IconCheck size={16} /> Code <b className="font-mono">{cart.rabatt.code}</b> aktiv
        </span>
        <button onClick={cart.rabattEntfernen} aria-label="Rabatt entfernen" className="text-ok/70 hover:text-ok shrink-0"><IconClose size={17} /></button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!offen ? (
        <button onClick={() => setOffen(true)} className="text-[13.5px] font-semibold text-bordeaux hover:underline">
          Rabattcode eingeben
        </button>
      ) : (
        <form onSubmit={anwenden}>
          <div className="flex gap-2">
            <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setFehler(""); }}
              placeholder="RABATTCODE" autoFocus
              className="flex-1 rounded-md border border-line px-3 py-2 text-[14px] font-medium tracking-wide outline-none focus:border-bordeaux uppercase" />
            <button type="submit" disabled={busy || !code.trim()}
              className="rounded-md bg-ink-strong text-white font-semibold px-4 py-2 text-[13.5px] disabled:opacity-50 shrink-0">
              {busy ? "…" : "Einlösen"}
            </button>
          </div>
          {fehler && <p className="mt-1.5 text-[12.5px] text-bordeaux font-medium">{fehler}</p>}
        </form>
      )}
    </div>
  );
}
