"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconCheck, IconCart, IconClose } from "@/components/Icon";

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
  const [sheetOffen, setSheetOffen] = useState(false); // mobiles Detail-Sheet

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
              <div key={m.id} className={`card overflow-hidden transition-all duration-200 ${gewaehlt ? "ring-2 ring-bordeaux ring-offset-1" : ""}`}>
                <button onClick={() => toggle(m.id)} className="relative block w-full aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.bild} alt={m.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-300 ${gewaehlt ? "scale-[1.02]" : ""}`} />
                  {/* Auswahl: dezentes Overlay + Haken nur wenn gewählt (sonst kein Kreis) */}
                  <span className={`absolute inset-0 transition-opacity duration-200 ${gewaehlt ? "bg-bordeaux/10 opacity-100" : "opacity-0"}`} />
                  {gewaehlt && (
                    <span className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full flex items-center justify-center shadow-sm bg-bordeaux text-white ar-pop">
                      <IconCheck size={13} />
                    </span>
                  )}
                </button>
                <div className="p-2.5">
                  <div className="font-semibold text-[13px] leading-tight truncate">{m.name}</div>
                  {gewaehlt && w ? (
                    <select value={w.groesseIdx} onChange={(e) => setGroesse(m.id, Number(e.target.value))}
                      className="mt-1.5 w-full rounded-md border border-line pl-2.5 pr-7 py-1.5 text-[12.5px] outline-none focus:border-bordeaux bg-white appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%226%22%20viewBox=%220%200%2010%206%22%3E%3Cpath%20d=%22M1%201l4%204%204-4%22%20fill=%22none%22%20stroke=%22%237a7166%22%20stroke-width=%221.5%22/%3E%3C/svg%3E')] bg-[length:10px] bg-no-repeat bg-[right_0.6rem_center]">
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

        {/* Sticky Set-Panel — Desktop rechts */}
        <aside className="hidden lg:block card p-5 lg:sticky lg:top-[120px]">
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

      {/* ── Mobile Sticky-Bottom-Bar (immer sichtbar, sobald etwas gewählt) ── */}
      {wahl.length > 0 && (
        <>
          {/* Platzhalter, damit die Bar nichts überdeckt */}
          <div className="lg:hidden h-24" />

          {/* Detail-Sheet (Liste), von unten */}
          {sheetOffen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSheetOffen(false)}>
              <div className="absolute bottom-0 inset-x-0 bg-surface rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[16px]">Dein Set ({anzahl})</h3>
                  <button onClick={() => setSheetOffen(false)} aria-label="Schließen" className="p-1.5 text-muted"><IconClose size={22} /></button>
                </div>
                <div className="flex gap-1.5 mb-4">
                  {stufen.map((st) => {
                    const erreicht = anzahl >= st.ab;
                    return (
                      <div key={st.ab} className="flex-1">
                        <div className={`h-1.5 rounded-full ${erreicht ? "bg-ok" : "bg-line"}`} />
                        <div className={`text-[10.5px] mt-1 text-center font-semibold ${erreicht ? "text-ok" : "text-muted"}`}>{st.ab}+ = {st.prozent}%</div>
                      </div>
                    );
                  })}
                </div>
                <ul className="space-y-2 mb-4">
                  {wahl.map((w) => {
                    const m = motivById(w.motivId); const g = m.groessen[w.groesseIdx];
                    return (
                      <li key={w.motivId} className="flex items-center gap-2.5 text-[13.5px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.bild} alt="" className="h-10 w-10 rounded object-cover border border-line shrink-0" />
                        <span className="flex-1 min-w-0"><span className="block font-medium truncate">{m.name}</span><span className="block text-muted text-[12px]">{g.label}</span></span>
                        <span className="font-semibold shrink-0">{euro(g.preis)}</span>
                        <button onClick={() => toggle(m.id)} aria-label="Entfernen" className="h-8 w-8 flex items-center justify-center text-muted shrink-0"><IconClose size={16} /></button>
                      </li>
                    );
                  })}
                </ul>
                <dl className="space-y-1.5 text-[14px] border-t border-line pt-3">
                  <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd>{euro(summe)}</dd></div>
                  {rabatt > 0 && <div className="flex justify-between text-ok"><dt>Mengenrabatt ({prozent}%)</dt><dd>−{euro(rabatt)}</dd></div>}
                  <div className="flex justify-between font-bold text-[16px] pt-1"><dt>Set-Preis</dt><dd>{euro(gesamt)}</dd></div>
                </dl>
              </div>
            </div>
          )}

          {/* die Bar selbst */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-line shadow-[0_-8px_24px_-12px_rgba(0,0,0,.2)]">
            {naechste && (
              <button onClick={() => setSheetOffen(true)} className="w-full bg-gold-soft text-gold-ink text-[12.5px] font-medium py-1.5 text-center">
                Noch <b>{naechste.ab - anzahl}</b> {naechste.ab - anzahl === 1 ? "Bild" : "Bilder"} für <b>−{naechste.prozent}%</b> ↑
              </button>
            )}
            <div className="px-4 py-3 flex items-center gap-3">
              <button onClick={() => setSheetOffen(true)} className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold">{anzahl} {anzahl === 1 ? "Bild" : "Bilder"}</span>
                  {prozent > 0 && <span className="text-[11px] font-bold text-ok bg-ok-soft rounded px-1.5 py-0.5">−{prozent}%</span>}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[17px] font-bold text-ink-strong">{euro(gesamt)}</span>
                  {rabatt > 0 && <span className="text-[12px] text-muted line-through">{euro(summe)}</span>}
                  <span className="text-[11px] text-gold-ink underline">Details</span>
                </div>
              </button>
              <button onClick={insWarenkorb} className="btn-gold ml-auto px-5 py-3 text-[14.5px] flex items-center gap-2 shrink-0">
                <IconCart size={17} /> In den Warenkorb
              </button>
            </div>
          </div>
        </>
      )}

      {imKorb && (
        <div className="lg:hidden fixed bottom-24 inset-x-4 z-40 fade-in flex items-center justify-between gap-2 rounded-lg bg-ok text-white px-4 py-3 text-[14px] font-medium shadow-lg">
          <span className="flex items-center gap-1.5"><IconCheck size={17} /> Set hinzugefügt!</span>
          <button onClick={() => router.push("/warenkorb")} className="underline font-semibold">Zum Warenkorb</button>
        </div>
      )}
    </>
  );
}
