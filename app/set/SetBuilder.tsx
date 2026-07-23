"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconCheck, IconCart } from "@/components/Icon";

type SetGroesse = { label: string; preis: number; beliebt: boolean };
type SetMotiv = { id: string; name: string; untertitel: string; bild: string; groessen: SetGroesse[] };
type Stufe = { ab: number; prozent: number };

/* Ausgewähltes Set-Item: welches Motiv, welche Größe. */
type Wahl = { motivId: string; groesseIdx: number };

export default function SetBuilder({ motive, stufen, maxProzent, nurLeinwand }: {
  motive: SetMotiv[]; stufen: Stufe[]; maxProzent: number; nurLeinwand: boolean;
}) {
  const cart = useCart();
  const router = useRouter();
  const [wahl, setWahl] = useState<Wahl[]>([]);
  const [imKorb, setImKorb] = useState(false);

  const motivById = (id: string) => motive.find((m) => m.id === id)!;
  const istGewaehlt = (id: string) => wahl.some((w) => w.motivId === id);

  const toggle = (id: string) => {
    setImKorb(false);
    setWahl((prev) => {
      if (prev.some((w) => w.motivId === id)) return prev.filter((w) => w.motivId !== id);
      // Standardgröße = beliebteste, sonst erste
      const m = motivById(id);
      const gi = Math.max(0, m.groessen.findIndex((g) => g.beliebt));
      return [...prev, { motivId: id, groesseIdx: gi }];
    });
  };
  const setGroesse = (id: string, gi: number) => {
    setImKorb(false);
    setWahl((prev) => prev.map((w) => w.motivId === id ? { ...w, groesseIdx: gi } : w));
  };

  const { anzahl, summe, prozent, rabatt, gesamt, naechste } = useMemo(() => {
    const anzahl = wahl.length;
    const summe = wahl.reduce((s, w) => {
      const m = motivById(w.motivId);
      return s + (m.groessen[w.groesseIdx]?.preis ?? 0);
    }, 0);
    let prozent = 0;
    for (const st of stufen) if (anzahl >= st.ab) prozent = st.prozent;
    const rabatt = Math.round(summe * (prozent / 100) * 100) / 100;
    const naechste = stufen.find((st) => st.ab > anzahl) ?? null;
    return { anzahl, summe, prozent, rabatt, gesamt: summe - rabatt, naechste };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wahl, stufen]);

  const insWarenkorb = () => {
    for (const w of wahl) {
      const m = motivById(w.motivId);
      const g = m.groessen[w.groesseIdx];
      cart.add({
        produktId: m.id, name: `Leinwandbild „${m.name}“`, bild: m.bild,
        variante: `Leinwand · ${g.label}`, preis: g.preis, menge: 1,
      });
    }
    setImKorb(true);
  };

  const minAb = stufen[0]?.ab ?? 2;

  return (
    <>
      <header className="max-w-2xl mb-6">
        <div className="eyebrow mb-2">Kauf mehr, spar mehr</div>
        <h1 className="font-display text-4xl text-ink-strong">Stell dein Set zusammen</h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          Wähle deine Lieblingsmotive — ab <b>{minAb} Bildern</b> bekommst du automatisch Rabatt,
          bis zu <b>{maxProzent}%</b>. {nurLeinwand ? "Gilt für Leinwandbilder." : ""}
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Motiv-Gitter */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {motive.map((m) => {
            const gewaehlt = istGewaehlt(m.id);
            const w = wahl.find((x) => x.motivId === m.id);
            return (
              <div key={m.id} className={`card overflow-hidden transition-all ${gewaehlt ? "ring-2 ring-bordeaux" : ""}`}>
                <button onClick={() => toggle(m.id)} className="relative block w-full aspect-square overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.bild} alt={m.name} loading="lazy" className="w-full h-full object-cover" />
                  <span className={`absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center border-2 transition-colors ${gewaehlt ? "bg-bordeaux border-bordeaux text-white" : "bg-white/85 border-white text-transparent"}`}>
                    <IconCheck size={15} />
                  </span>
                </button>
                <div className="p-2.5">
                  <div className="font-semibold text-[13px] leading-tight truncate">{m.name}</div>
                  {gewaehlt && w ? (
                    <select value={w.groesseIdx} onChange={(e) => setGroesse(m.id, Number(e.target.value))}
                      className="mt-1.5 w-full rounded-md border border-line px-2 py-1.5 text-[12.5px] outline-none focus:border-bordeaux bg-white">
                      {m.groessen.map((g, i) => (
                        <option key={g.label} value={i}>{g.label} — {euro(g.preis)}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1.5 text-[12.5px] text-muted">ab {euro(m.groessen[0]?.preis ?? 0)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Set-Panel */}
        <aside className="card p-5 lg:sticky lg:top-[120px]">
          <h2 className="font-semibold text-[16px] mb-1">Dein Set</h2>

          {/* Stufen-Fortschritt */}
          <div className="my-4">
            <div className="flex items-end justify-between mb-2">
              <span className="text-[13px] text-muted">{anzahl} {anzahl === 1 ? "Bild" : "Bilder"} gewählt</span>
              {prozent > 0 && <span className="text-[15px] font-bold text-ok">−{prozent}%</span>}
            </div>
            <div className="flex gap-1.5">
              {stufen.map((st) => {
                const erreicht = anzahl >= st.ab;
                return (
                  <div key={st.ab} className="flex-1">
                    <div className={`h-1.5 rounded-full transition-colors ${erreicht ? "bg-ok" : "bg-line"}`} />
                    <div className={`text-[10.5px] mt-1 text-center font-semibold ${erreicht ? "text-ok" : "text-muted"}`}>{st.ab}+ = {st.prozent}%</div>
                  </div>
                );
              })}
            </div>
            {naechste && (
              <p className="mt-3 text-[12.5px] text-gold-ink bg-gold-soft rounded-md px-2.5 py-1.5 text-center">
                Noch <b>{naechste.ab - anzahl}</b> {naechste.ab - anzahl === 1 ? "Bild" : "Bilder"} für <b>−{naechste.prozent}%</b>
              </p>
            )}
          </div>

          {/* gewählte Liste */}
          {wahl.length > 0 ? (
            <ul className="space-y-2 border-t border-line pt-3 mb-3 max-h-[220px] overflow-y-auto">
              {wahl.map((w) => {
                const m = motivById(w.motivId);
                const g = m.groessen[w.groesseIdx];
                return (
                  <li key={w.motivId} className="flex items-center gap-2 text-[13px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.bild} alt="" className="h-9 w-9 rounded object-cover border border-line shrink-0" />
                    <span className="flex-1 min-w-0"><span className="block font-medium truncate">{m.name}</span><span className="block text-muted text-[11.5px]">{g.label}</span></span>
                    <span className="font-semibold shrink-0">{euro(g.preis)}</span>
                    <button onClick={() => toggle(m.id)} aria-label="Entfernen" className="text-muted hover:text-bordeaux shrink-0">✕</button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[13px] text-muted border-t border-line pt-3 mb-3">Noch nichts gewählt — tippe Motive an.</p>
          )}

          <dl className="space-y-1.5 text-[14px] border-t border-line pt-3">
            <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd>{euro(summe)}</dd></div>
            {rabatt > 0 && <div className="flex justify-between text-ok"><dt>Mengenrabatt ({prozent}%)</dt><dd>−{euro(rabatt)}</dd></div>}
            <div className="flex justify-between font-bold text-[16px] pt-1"><dt>Set-Preis</dt><dd>{euro(gesamt)}</dd></div>
          </dl>

          <button onClick={insWarenkorb} disabled={wahl.length === 0}
            className="btn-gold w-full py-3.5 text-[15px] mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
            <IconCart size={18} /> Set in den Warenkorb
          </button>
          {imKorb && (
            <div className="mt-3 fade-in flex items-center justify-between gap-2 rounded-md bg-ok-soft text-ok px-3 py-2 text-[13px] font-medium">
              <span className="flex items-center gap-1.5"><IconCheck size={15} /> Set hinzugefügt!</span>
              <button onClick={() => router.push("/warenkorb")} className="underline font-semibold">Zum Warenkorb</button>
            </div>
          )}
          {prozent > 0 && !imKorb && (
            <p className="mt-2 text-center text-[12.5px] text-ok font-medium">Du sparst {euro(rabatt)} mit diesem Set!</p>
          )}
        </aside>
      </div>
    </>
  );
}
