"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconCart, IconCheck } from "./Icon";

export type BundleGroesse = { label: string; preis: number; beliebt?: boolean };
export type BundleMotiv = { id: string; name: string; bild: string; groessen: BundleGroesse[] };
type Stufe = { ab: number; prozent: number };

/* Startgröße = beliebteste, sonst erste. */
function startGroesse(m: BundleMotiv) {
  const i = m.groessen.findIndex((g) => g.beliebt);
  return i >= 0 ? i : 0;
}

/* Bundle direkt auf der Produktseite: klickbare Angebote („Kauf 2 & spar 20%"),
   das aktuelle Motiv ist Bild 1, weitere Motive wählt der Kunde in einer großen,
   seitlich scrollbaren Reihe — je Motiv mit eigener Größen-Auswahl. */
export default function BundleBox({
  aktuell, weitere, stufen,
}: {
  aktuell: BundleMotiv;
  weitere: BundleMotiv[];
  stufen: Stufe[];
}) {
  const cart = useCart();
  const [zielAnzahl, setZielAnzahl] = useState<number | null>(null);
  // Zusatzmotive mit je gewähltem Größen-Index
  const [zusatz, setZusatz] = useState<Record<string, number>>({});
  // Größe von Bild 1 (das aktuelle Motiv)
  const [gIdxAktuell, setGIdxAktuell] = useState(() => startGroesse(aktuell));
  const [imKorb, setImKorb] = useState(false);
  const [sichtbar, setSichtbar] = useState(8); // wie viele Motive im Gitter zeigen

  if (!stufen.length) return null;

  const zusatzIds = Object.keys(zusatz);
  const gewaehltAnzahl = 1 + zusatzIds.length;
  const prozentFuer = (n: number) => { let p = 0; for (const s of stufen) if (n >= s.ab) p = s.prozent; return p; };
  const prozent = prozentFuer(gewaehltAnzahl);

  const preisAktuell = aktuell.groessen[gIdxAktuell]?.preis ?? 0;
  const preisZusatz = zusatzIds.reduce((s, id) => {
    const m = weitere.find((x) => x.id === id); return s + (m?.groessen[zusatz[id]]?.preis ?? 0);
  }, 0);
  const summe = preisAktuell + preisZusatz;
  const rabatt = Math.round(summe * (prozent / 100) * 100) / 100;
  const fehlt = zielAnzahl ? Math.max(0, zielAnzahl - gewaehltAnzahl) : 0;

  const bundleWaehlen = (ab: number) => { setImKorb(false); setZielAnzahl(ab); setZusatz({}); };
  const toggleMotiv = (m: BundleMotiv) => {
    setImKorb(false);
    setZusatz((prev) => {
      const kopie = { ...prev };
      if (m.id in kopie) delete kopie[m.id];
      else kopie[m.id] = startGroesse(m);
      return kopie;
    });
  };
  const setZusatzGroesse = (id: string, gi: number) => setZusatz((prev) => ({ ...prev, [id]: gi }));

  const insWarenkorb = () => {
    const ga = aktuell.groessen[gIdxAktuell];
    cart.add({ produktId: aktuell.id, name: `Leinwandbild „${aktuell.name}“`, bild: aktuell.bild, variante: `Leinwand · ${ga.label}`, preis: ga.preis, menge: 1 });
    for (const id of zusatzIds) {
      const m = weitere.find((x) => x.id === id); if (!m) continue;
      const g = m.groessen[zusatz[id]];
      cart.add({ produktId: m.id, name: `Leinwandbild „${m.name}“`, bild: m.bild, variante: `Leinwand · ${g.label}`, preis: g.preis, menge: 1 });
    }
    setImKorb(true);
  };

  const groessenSelect = (m: BundleMotiv, wert: number, onChange: (i: number) => void) => (
    <select value={wert} onChange={(e) => onChange(Number(e.target.value))}
      onClick={(e) => e.stopPropagation()}
      className="w-full rounded-md border border-line pl-2.5 pr-7 py-1.5 text-[12.5px] outline-none focus:border-bordeaux bg-white appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%226%22%20viewBox=%220%200%2010%206%22%3E%3Cpath%20d=%22M1%201l4%204%204-4%22%20fill=%22none%22%20stroke=%22%237a7166%22%20stroke-width=%221.5%22/%3E%3C/svg%3E')] bg-[length:10px] bg-no-repeat bg-[right_0.6rem_center]">
      {m.groessen.map((g, i) => <option key={g.label} value={i}>{g.label} — {euro(g.preis)}</option>)}
    </select>
  );

  return (
    /* KEIN overflow-hidden hier: auf iOS Safari friert overflow-hidden + border-radius
       das horizontale Scrollen eines Nachfahren ein. Rundecken via rounded-xl bleiben;
       der Header bekommt seine eigene obere Rundung. */
    <div className="mt-4 rounded-xl border-2 border-gold/40">
      <div className="bg-gold-soft px-4 py-2.5 flex items-center gap-2 rounded-t-[10px]">
        <span className="text-[15px]">🎨</span>
        <span className="text-[13.5px] font-bold text-gold-ink">Set-Angebot: Mehr Bilder, mehr sparen</span>
      </div>

      <div className="p-4">
        {/* Bundle-Buttons */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${stufen.length}, minmax(0,1fr))` }}>
          {stufen.map((s) => {
            const aktiv = zielAnzahl === s.ab;
            return (
              <button key={s.ab} onClick={() => bundleWaehlen(s.ab)}
                className={`rounded-lg border-2 px-2 py-3 text-center transition-all ${aktiv ? "border-bordeaux bg-bordeaux text-white" : "border-line bg-white hover:border-bordeaux/50"}`}>
                <div className={`text-[15px] font-bold ${aktiv ? "text-white" : "text-ink-strong"}`}>Kauf {s.ab}</div>
                <div className={`text-[13px] font-semibold ${aktiv ? "text-white" : "text-ok"}`}>&amp; spar {s.prozent}%</div>
              </button>
            );
          })}
        </div>

        {zielAnzahl && (
          <div className="mt-4 fade-in">
            <p className="text-[13px] text-ink mb-2.5">
              {fehlt > 0
                ? <>Noch <b>{fehlt}</b> {fehlt === 1 ? "Motiv" : "Motive"} wählen — tipp die Bilder an:</>
                : <span className="text-ok font-semibold">✓ Set komplett — du sparst {prozent}%!</span>}
            </p>

            {/* Bild 1: das aktuelle Motiv, mit Größen-Auswahl */}
            <div className="flex items-center gap-3 rounded-lg bg-bg border border-line p-2.5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={aktuell.bild} alt={aktuell.name} className="h-16 w-16 rounded-md object-cover border border-line shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-bordeaux bg-bordeaux-soft rounded px-1.5 py-0.5">Bild 1</span>
                  <span className="text-[13.5px] font-semibold truncate">{aktuell.name}</span>
                </div>
                {groessenSelect(aktuell, gIdxAktuell, setGIdxAktuell)}
              </div>
            </div>

            {/* Weitere Motive — NORMALES Gitter, das mit der Seite mitscrollt.
                KEIN eigener Scroll-Container (overflow-x/touch-action/snap) →
                auf iOS gibt es nichts, was haken kann. */}
            <div className="grid grid-cols-2 gap-3">
              {weitere.slice(0, sichtbar).map((m) => {
                const an = m.id in zusatz;
                return (
                  <div key={m.id} className={`rounded-xl border-2 transition-colors ${an ? "border-bordeaux" : "border-line"}`}>
                    <button onClick={() => toggleMotiv(m)} className="relative block w-full aspect-square overflow-hidden rounded-t-[10px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.bild} alt={m.name} loading="lazy" className="w-full h-full object-cover" />
                      {an && <span className="absolute inset-0 bg-bordeaux/15" />}
                      <span className={`absolute top-1.5 right-1.5 h-6 w-6 rounded-full flex items-center justify-center shadow-sm ${an ? "bg-bordeaux text-white" : "bg-white/85 text-ink"}`}>
                        {an ? <IconCheck size={13} /> : <span className="text-[16px] leading-none font-light">+</span>}
                      </span>
                    </button>
                    <div className="p-2">
                      <div className="text-[12.5px] font-semibold leading-tight truncate mb-1.5">{m.name}</div>
                      {an ? (
                        <>
                          {groessenSelect(m, zusatz[m.id], (gi) => setZusatzGroesse(m.id, gi))}
                          <button onClick={() => toggleMotiv(m)} className="mt-1 w-full text-[11.5px] font-medium text-muted hover:text-bordeaux">Entfernen</button>
                        </>
                      ) : (
                        <button onClick={() => toggleMotiv(m)} className="w-full text-[12px] font-semibold text-bordeaux border border-bordeaux/40 rounded-md py-1.5 hover:bg-bordeaux-soft">Hinzufügen</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {sichtbar < weitere.length && (
              <button onClick={() => setSichtbar((n) => n + 8)} className="mt-3 w-full text-[13px] font-semibold text-bordeaux border border-bordeaux/30 rounded-md py-2 hover:bg-bordeaux-soft">
                Weitere Motive anzeigen ({weitere.length - sichtbar})
              </button>
            )}

            {/* Set-Summe */}
            <div className="mt-3 rounded-lg bg-bg border border-line p-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">{gewaehltAnzahl} {gewaehltAnzahl === 1 ? "Bild" : "Bilder"} im Set</span>
                {prozent > 0 && <span className="font-bold text-ok">−{prozent}%</span>}
              </div>
              <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                <span className="text-[20px] font-bold text-ink-strong">{euro(summe - rabatt)}</span>
                {rabatt > 0 && <span className="text-[14px] text-muted line-through">{euro(summe)}</span>}
                {rabatt > 0 && <span className="text-[12.5px] font-semibold text-ok">du sparst {euro(rabatt)}</span>}
              </div>
              <button onClick={insWarenkorb} disabled={gewaehltAnzahl < 2}
                className="btn-gold w-full py-3 text-[15px] mt-3 flex items-center justify-center gap-2 disabled:opacity-50">
                <IconCart size={18} /> {gewaehltAnzahl < 2 ? `Noch ${2 - gewaehltAnzahl} Bild wählen` : "Set in den Warenkorb"}
              </button>
              {imKorb && (
                <p className="mt-2 text-center text-[13px] font-semibold text-ok flex items-center justify-center gap-1.5"><IconCheck size={15} /> Set hinzugefügt!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
