"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { euro, VERSAND_FREI_AB } from "@/lib/preise";
import { ZAHLARTEN } from "@/lib/site";
import PayLogos from "@/components/PayLogos";
import { IconArrowRight, IconCheck, IconLock, IconMinus, IconPlus, IconTrash } from "@/components/Icon";

export default function WarenkorbSeite() {
  const cart = useCart();
  const fehltZuFrei = Math.max(0, VERSAND_FREI_AB - cart.summe);
  const fortschritt = Math.min(100, (cart.summe / VERSAND_FREI_AB) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-10">
      <h1 className="font-display text-3xl text-ink-strong mb-6">Dein Warenkorb</h1>

      {cart.items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[16px] font-semibold mb-2">Dein Warenkorb ist noch leer.</p>
          <p className="text-[14px] text-muted mb-6">Lass dich von unseren Bestsellern inspirieren.</p>
          <Link href="/motive" className="btn-gold px-6 py-3.5 text-[15px] inline-block">Motive entdecken</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[7fr_4fr] gap-8 items-start">
          <div className="space-y-3">
            {cart.items.map((item, i) => (
              <div key={item.produktId + item.variante} className="card p-4 flex gap-4">
                {item.bild && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.bild} alt={item.name} className="h-24 w-24 rounded-[4px] object-cover border border-line shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] leading-snug">{item.name}</div>
                  <div className="text-[13px] text-muted mt-0.5">{item.variante}</div>
                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center border border-line rounded-[4px]">
                      <button className="h-11 w-11 flex items-center justify-center text-muted hover:text-ink" aria-label="Menge verringern" onClick={() => cart.setMenge(i, item.menge - 1)}><IconMinus size={16} /></button>
                      <span className="w-7 text-center text-[14px] font-semibold">{item.menge}</span>
                      <button className="h-11 w-11 flex items-center justify-center text-muted hover:text-ink" aria-label="Menge erhöhen" onClick={() => cart.setMenge(i, item.menge + 1)}><IconPlus size={16} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[16px]">{euro(item.preis * item.menge)}</span>
                      <button className="h-11 w-11 flex items-center justify-center text-muted hover:text-ink" aria-label="Entfernen" onClick={() => cart.remove(i)}><IconTrash size={19} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5 lg:sticky lg:top-[140px]">
            {/* Frachtfrei-Fortschritt */}
            <div className="mb-4">
              {fehltZuFrei > 0 ? (
                <p className="text-[13.5px] mb-2">Noch <b>{euro(fehltZuFrei)}</b> bis zum Gratisversand</p>
              ) : (
                <p className="text-[13.5px] text-ok font-semibold mb-2">Versandkostenfrei — geschafft!</p>
              )}
              <div className="h-2 rounded-full bg-bg border border-line overflow-hidden">
                <div className="h-full bg-ok transition-all" style={{ width: `${fortschritt}%` }} />
              </div>
            </div>

            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd className="font-semibold">{euro(cart.summe)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Versand (DE)</dt><dd className="font-semibold">{cart.versand === 0 ? "kostenlos" : euro(cart.versand)}</dd></div>
              <div className="flex justify-between border-t border-line pt-2.5 text-[16px]"><dt className="font-bold">Gesamt</dt><dd className="font-bold">{euro(cart.gesamt)}</dd></div>
            </dl>
            <p className="text-[12px] text-muted mt-1.5">inkl. MwSt.</p>

            <Link href="/kasse" className="btn-gold w-full py-4 text-[15.5px] mt-4 flex items-center justify-center gap-2">
              Zur Kasse <IconArrowRight size={17} />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-muted">
              <IconLock size={14} /> Sichere, SSL-verschlüsselte Bestellung
            </p>

            {/* Trust-Stack */}
            <ul className="mt-4 space-y-2 text-[12.5px] border-t border-line pt-4">
              {["30 Tage Rückgaberecht — kostenlose Rücksendung", "Kauf auf Rechnung & Käuferschutz", "In Deutschland gefertigt"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-muted">
                  <span className="text-ok"><IconCheck size={14} /></span>{t}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-line">
              <PayLogos arten={ZAHLARTEN} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
