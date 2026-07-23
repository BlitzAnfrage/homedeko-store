"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconCart, IconCheck, IconClose } from "./Icon";

export type BundleMotiv = { id: string; name: string; bild: string; preis: number; groesseLabel: string };
type Stufe = { ab: number; prozent: number };

/* Bundle direkt auf der Produktseite: klickbare Angebote („Kauf 2 & spar 20%"),
   das aktuelle Motiv ist Bild 1, weitere Motive wählt der Kunde in einem Sheet. */
export default function BundleBox({
  aktuell, weitere, stufen,
}: {
  aktuell: BundleMotiv;          // das Motiv dieser Produktseite (= Bild 1)
  weitere: BundleMotiv[];        // andere Motive zum Dazuwählen
  stufen: Stufe[];               // Mengenrabatt-Stufen (aktiv), aufsteigend
}) {
  const cart = useCart();
  const [zielAnzahl, setZielAnzahl] = useState<number | null>(null); // gewähltes Bundle
  const [zusatz, setZusatz] = useState<string[]>([]);                // IDs der Zusatzmotive
  const [imKorb, setImKorb] = useState(false);

  if (!stufen.length) return null;

  const motivById = (id: string) => weitere.find((m) => m.id === id);
  const gewaehlt = [aktuell, ...zusatz.map(motivById).filter(Boolean) as BundleMotiv[]];
  const prozentFuer = (anzahl: number) => {
    let p = 0; for (const s of stufen) if (anzahl >= s.ab) p = s.prozent; return p;
  };
  const summe = gewaehlt.reduce((s, m) => s + m.preis, 0);
  const prozent = prozentFuer(gewaehlt.length);
  const rabatt = Math.round(summe * (prozent / 100) * 100) / 100;
  const fehlt = zielAnzahl ? Math.max(0, zielAnzahl - gewaehlt.length) : 0;

  const bundleWaehlen = (ab: number) => {
    setImKorb(false);
    setZielAnzahl(ab);
    setZusatz([]); // frisch anfangen
  };
  const toggleZusatz = (id: string) => {
    setImKorb(false);
    setZusatz((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (zielAnzahl && prev.length + 1 >= zielAnzahl) return [...prev, id]; // erreicht → erlauben (mehr geht auch)
      return [...prev, id];
    });
  };

  const insWarenkorb = () => {
    for (const m of gewaehlt) {
      cart.add({ produktId: m.id, name: `Leinwandbild „${m.name}“`, bild: m.bild, variante: `Leinwand · ${m.groesseLabel}`, preis: m.preis, menge: 1 });
    }
    setImKorb(true);
  };

  return (
    <div className="mt-4 rounded-xl border-2 border-gold/40 overflow-hidden">
      <div className="bg-gold-soft px-4 py-2.5 flex items-center gap-2">
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
                <div className={`text-[13px] font-semibold ${aktiv ? "text-white" : "text-ok"}`}>& spar {s.prozent}%</div>
              </button>
            );
          })}
        </div>

        {/* Auswahl der weiteren Bilder — erscheint nach Bundle-Wahl */}
        {zielAnzahl && (
          <div className="mt-4 fade-in">
            <p className="text-[13px] text-ink mb-2">
              <b>Bild 1:</b> „{aktuell.name}" ist schon dabei.{" "}
              {fehlt > 0
                ? <>Wähle noch <b>{fehlt}</b> {fehlt === 1 ? "Motiv" : "Motive"}:</>
                : <span className="text-ok font-semibold">✓ Set komplett — du sparst {prozent}%!</span>}
            </p>

            <div className="grid grid-cols-4 gap-2 max-h-[240px] overflow-y-auto p-0.5">
              {weitere.map((m) => {
                const an = zusatz.includes(m.id);
                return (
                  <button key={m.id} onClick={() => toggleZusatz(m.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${an ? "border-bordeaux" : "border-transparent hover:border-line"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.bild} alt={m.name} loading="lazy" className="w-full h-full object-cover" />
                    {an && <span className="absolute inset-0 bg-bordeaux/15" />}
                    {an && <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-bordeaux text-white flex items-center justify-center"><IconCheck size={12} /></span>}
                  </button>
                );
              })}
            </div>

            {/* Set-Summe */}
            <div className="mt-3 rounded-lg bg-bg border border-line p-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">{gewaehlt.length} {gewaehlt.length === 1 ? "Bild" : "Bilder"} im Set</span>
                {prozent > 0 && <span className="font-bold text-ok">−{prozent}%</span>}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[20px] font-bold text-ink-strong">{euro(summe - rabatt)}</span>
                {rabatt > 0 && <span className="text-[14px] text-muted line-through">{euro(summe)}</span>}
                {rabatt > 0 && <span className="text-[12.5px] font-semibold text-ok">du sparst {euro(rabatt)}</span>}
              </div>
              <button onClick={insWarenkorb} disabled={gewaehlt.length < 2}
                className="btn-gold w-full py-3 text-[15px] mt-3 flex items-center justify-center gap-2 disabled:opacity-50">
                <IconCart size={18} /> {gewaehlt.length < 2 ? `Noch ${2 - gewaehlt.length} Bild wählen` : "Set in den Warenkorb"}
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
