"use client";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconCheck } from "./Icon";

/* Upsells im Warenkorb: Mengenrabatt-Hinweis („nimm noch eins dazu") + Add-ons
   zum Ankreuzen. Zeigt nichts, wenn nichts konfiguriert ist. */
export default function WarenkorbUpsells() {
  const cart = useCart();

  return (
    <>
      {/* Mengenrabatt-Verführung */}
      {cart.naechsteStufe && (
        <div className="mb-4 rounded-lg border border-gold/40 bg-gold-soft px-3.5 py-2.5 text-[13px]">
          <b className="text-gold-ink">Mehr nehmen, mehr sparen:</b>{" "}
          Noch <b>{cart.naechsteStufe.ab - cart.anzahlBilder}</b>{" "}
          {cart.naechsteStufe.ab - cart.anzahlBilder === 1 ? "Bild" : "Bilder"} dazu und du sparst{" "}
          <b>{cart.naechsteStufe.prozent}%</b> auf alle.
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
