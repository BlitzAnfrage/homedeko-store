import Link from "next/link";
import { IconCheck } from "@/components/Icon";
import { ladeSettings } from "@/lib/settings";
import { stripeClient } from "@/lib/zahlung";
import CartLeeren from "./CartLeeren";

export const dynamic = "force-dynamic";
export const metadata = { title: "Danke für deine Bestellung", robots: { index: false } };

export default async function DankeSeite({ searchParams }: { searchParams: Promise<{ nr?: string; sid?: string }> }) {
  const { nr, sid } = await searchParams;
  const settings = await ladeSettings();
  const bank = settings.zahlung;

  // Nach Stripe-Zahlung: Session laden, um Bestellnummer/Status zu zeigen
  let stripeBezahlt = false;
  let stripeEmail = "";
  if (sid) {
    const stripe = stripeClient();
    if (stripe) {
      try {
        const s = await stripe.checkout.sessions.retrieve(sid);
        stripeBezahlt = s.payment_status === "paid";
        stripeEmail = s.customer_email ?? s.customer_details?.email ?? "";
      } catch { /* ignore */ }
    }
  }

  const hatBank = !!(bank.bank_iban || bank.bank_inhaber);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ok-soft text-ok mb-5">
        <IconCheck size={30} />
      </span>
      <h1 className="font-display text-3xl text-ink-strong mb-3">Danke für deine Bestellung!</h1>

      {sid ? (
        // ── Stripe ──
        <>
          <CartLeeren />
          {stripeBezahlt
            ? <p className="text-[15px] mb-2 text-ok font-semibold">Deine Zahlung ist eingegangen.</p>
            : <p className="text-[15px] mb-2">Deine Zahlung wird verarbeitet.</p>}
          <p className="text-[14.5px] text-muted leading-relaxed mb-8 max-w-lg mx-auto">
            Wir haben deine Bestellung erhalten{stripeEmail ? <> und eine Bestätigung an <b>{stripeEmail}</b> geschickt</> : ""}.
            Dein Wandbild wird jetzt produziert und versendet.
          </p>
        </>
      ) : (
        // ── Vorkasse ──
        <>
          {nr && <p className="text-[15px] mb-2">Deine Bestellnummer: <b>{nr}</b></p>}
          <p className="text-[14.5px] text-muted leading-relaxed mb-6 max-w-lg mx-auto">
            Wir haben deine Bestellung erhalten. Bitte überweise den Betrag mit dem
            Verwendungszweck <b>{nr}</b> — nach Zahlungseingang produzieren und versenden wir dein Wandbild.
          </p>
          {hatBank ? (
            <div className="card p-5 text-left max-w-md mx-auto mb-8">
              <div className="text-[12.5px] font-semibold uppercase tracking-wide text-muted mb-2">Bankverbindung</div>
              <dl className="space-y-1 text-[14px]">
                {bank.bank_inhaber && <div className="flex justify-between gap-4"><dt className="text-muted">Kontoinhaber</dt><dd className="font-medium text-right">{bank.bank_inhaber}</dd></div>}
                {bank.bank_iban && <div className="flex justify-between gap-4"><dt className="text-muted">IBAN</dt><dd className="font-mono font-semibold text-right">{bank.bank_iban}</dd></div>}
                {bank.bank_bic && <div className="flex justify-between gap-4"><dt className="text-muted">BIC</dt><dd className="font-mono text-right">{bank.bank_bic}</dd></div>}
                {bank.bank_name && <div className="flex justify-between gap-4"><dt className="text-muted">Bank</dt><dd className="text-right">{bank.bank_name}</dd></div>}
                {nr && <div className="flex justify-between gap-4 border-t border-line pt-1.5 mt-1.5"><dt className="text-muted">Verwendungszweck</dt><dd className="font-semibold text-right">{nr}</dd></div>}
              </dl>
            </div>
          ) : (
            <div className="card p-5 max-w-md mx-auto mb-8 text-[13.5px] text-muted">
              Du erhältst die Zahlungsdaten per E-Mail.
            </div>
          )}
        </>
      )}

      <Link href="/motive" className="btn-ghost px-6 py-3 text-[14.5px] inline-block">Weiter stöbern</Link>
    </div>
  );
}
