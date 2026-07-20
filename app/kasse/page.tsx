"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/preise";
import { IconLock } from "@/components/Icon";

const FELD = "w-full border border-line rounded-[4px] bg-surface px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent";

export default function KasseSeite() {
  const cart = useCart();
  const router = useRouter();
  const [sende, setSende] = useState(false);
  const [fehler, setFehler] = useState("");

  const absenden = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart.items.length) return;
    setSende(true); setFehler("");
    const fd = new FormData(e.currentTarget);
    const kunde = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/bestellung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kunde, items: cart.items, summe: cart.summe, versand: cart.versand, gesamt: cart.gesamt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.fehler ?? "Unbekannter Fehler");
      cart.clear();
      router.push(`/danke?nr=${encodeURIComponent(data.nummer)}`);
    } catch (err) {
      setFehler(err instanceof Error ? err.message : "Bestellung konnte nicht übermittelt werden.");
      setSende(false);
    }
  };

  if (!cart.items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-ink-strong mb-3">Kasse</h1>
        <p className="text-muted mb-6">Dein Warenkorb ist leer.</p>
        <Link href="/motive" className="btn-gold px-6 py-3 inline-block text-[14.5px]">Motive entdecken</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-10">
      <h1 className="font-display text-3xl text-ink-strong mb-6">Kasse</h1>
      <div className="grid lg:grid-cols-[7fr_4fr] gap-8 items-start">
        <form onSubmit={absenden} className="card p-5 lg:p-6 space-y-4">
          <h2 className="font-semibold text-[16px]">Liefer- & Rechnungsadresse</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="vorname" required placeholder="Vorname *" className={FELD} autoComplete="given-name" />
            <input name="nachname" required placeholder="Nachname *" className={FELD} autoComplete="family-name" />
          </div>
          <input name="email" type="email" required placeholder="E-Mail-Adresse *" className={FELD} autoComplete="email" inputMode="email" autoCapitalize="off" enterKeyHint="next" />
          <input name="telefon" type="tel" inputMode="tel" placeholder="Telefon (optional, für Rückfragen)" className={FELD} autoComplete="tel" />
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <input name="strasse" required placeholder="Straße *" className={FELD} autoComplete="address-line1" />
            <input name="hausnummer" required placeholder="Nr. *" className={FELD} autoComplete="address-line2" />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <input name="plz" required placeholder="PLZ *" className={FELD} autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" enterKeyHint="next" />
            <input name="ort" required placeholder="Ort *" className={FELD} autoComplete="address-level2" />
          </div>
          <textarea name="anmerkung" placeholder="Anmerkung zur Bestellung (optional)" rows={3} className={FELD} />

          <div className="rounded-[4px] bg-bg border border-line px-4 py-3 text-[13.5px] text-muted leading-relaxed">
            <b className="text-ink">Zahlung per Vorkasse (Überweisung):</b> Nach dem Absenden
            erhältst du deine Bestellbestätigung mit allen Zahlungsdaten. Deine Bestellung
            wird nach Zahlungseingang produziert und versendet.
          </div>

          {fehler && <p className="text-[13.5px] text-red-700">{fehler}</p>}

          <button disabled={sende} className="btn-gold w-full py-4 text-[16px] disabled:opacity-60">
            {sende ? "Wird übermittelt …" : `Zahlungspflichtig bestellen — ${euro(cart.gesamt)}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-muted">
            <IconLock size={14} /> Deine Daten werden SSL-verschlüsselt übertragen.
          </p>
        </form>

        <aside className="card p-5 lg:sticky lg:top-[140px]">
          <h2 className="font-semibold text-[15px] mb-3">Deine Bestellung</h2>
          <ul className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <li key={item.produktId + item.variante} className="flex gap-3 text-[13.5px]">
                {item.bild && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.bild} alt="" className="h-14 w-14 rounded-[4px] object-cover border border-line shrink-0" />
                )}
                <span className="flex-1 min-w-0">
                  <span className="block font-medium leading-snug">{item.menge} × {item.name}</span>
                  <span className="block text-muted">{item.variante}</span>
                </span>
                <span className="font-semibold shrink-0">{euro(item.preis * item.menge)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 text-[14px] border-t border-line pt-3">
            <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd>{euro(cart.summe)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Versand</dt><dd>{cart.versand === 0 ? "kostenlos" : euro(cart.versand)}</dd></div>
            <div className="flex justify-between font-bold text-[15.5px] pt-1"><dt>Gesamt</dt><dd>{euro(cart.gesamt)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
