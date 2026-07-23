"use client";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconCheck } from "./Icon";

/* Upsells im Warenkorb: prominenter Mengenrabatt-Fortschritt + Add-ons
   zum Ankreuzen. Zeigt nichts, wenn nichts konfiguriert ist. */
export default function WarenkorbUpsells() {
  const cart = useCart();
  const stufen = cart.mengenrabattStufen;

  return (
    <>
      {/* Mengenrabatt-Fortschritt (Klartext, keine Kürzel) */}
      {stufen.length > 0 && (
        <div className="mb-4 rounded-xl border border-gold/40 bg-gold-soft p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-semibold text-gold-ink">
              {cart.mengenrabattProzent > 0 ? `Du sparst gerade ${cart.mengenrabattProzent}%` : "Mehr Bilder, mehr sparen"}
            </span>
            {cart.mengenrabattBetrag > 0 && <span className="text-[13px] font-bold text-ok">−{euro(cart.mengenrabattBetrag)}</span>}
          </div>
          {/* Klartext-Stufen als Chips */}
          <div className="flex flex-wrap gap-1.5">
            {stufen.map((st) => {
              const erreicht = cart.anzahlBilder >= st.ab;
              return (
                <span key={st.ab} className={`text-[12px] font-semibold rounded-full px-2.5 py-1 border ${erreicht ? "bg-ok text-white border-ok" : "bg-white text-gold-ink border-gold/30"}`}>
                  {erreicht && "✓ "}{st.ab} Bilder = {st.prozent}% Rabatt
                </span>
              );
            })}
          </div>
          {cart.naechsteStufe && (
            <p className="mt-2.5 text-[12.5px] text-gold-ink">
              Leg noch <b>{cart.naechsteStufe.ab - cart.anzahlBilder}</b>{" "}
              {cart.naechsteStufe.ab - cart.anzahlBilder === 1 ? "Bild" : "Bilder"} dazu und spar <b>{cart.naechsteStufe.prozent}%</b> auf alle.
            </p>
          )}
        </div>
      )}

      {/* Add-ons */}
      {cart.addons.length > 0 && (
        <div className="mb-4">
          <div className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">Extras</div>
          <div className="space-y-2">
            {cart.addons.map((a) => {
              const an = cart.addonGewaehlt(a.id);
              return (
                <button key={a.id} onClick={() => cart.addonToggle(a.id)}
                  className={`w-full flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${an ? "border-ok/50 bg-ok-soft" : "border-line hover:border-[#cfc9bf]"}`}>
                  <span className={`mt-0.5 h-4 w-4 rounded-[4px] border flex items-center justify-center shrink-0 ${an ? "bg-ok border-ok text-white" : "border-[#cfc9bf] bg-white"}`}>
                    {an && <IconCheck size={11} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-semibold text-ink-strong">{a.titel}</span>
                      <span className="text-[13.5px] font-semibold text-gold-ink shrink-0">+{euro(a.preis)}</span>
                    </span>
                    {a.beschreibung && <span className="block text-[12px] text-muted leading-snug mt-0.5">{a.beschreibung}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
