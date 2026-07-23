import { NextResponse } from "next/server";
import { bestellungAnlegen, berechneBetraege, type BestellItem } from "@/lib/bestellung";
import { hatStripe, stripeClient, basisUrl } from "@/lib/zahlung";

/* Checkout-Einstieg.
   - Stripe konfiguriert → Stripe-Checkout-Session (Bestellung entsteht im Webhook).
   - Sonst (Vorkasse) → Bestellung sofort speichern + Bestätigungsmail.
   Alle Beträge (Mengenrabatt, Gutschein, Add-ons, Versand) werden serverseitig
   über berechneBetraege bestimmt — dem Client wird nichts geglaubt. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.items?.length || !body?.kunde?.email) {
      return NextResponse.json({ fehler: "Unvollständige Bestellung." }, { status: 400 });
    }
    const items = body.items as BestellItem[];
    const kunde = body.kunde as Record<string, string>;
    const rabattCode = body.rabattCode ?? null;
    const addonIds = Array.isArray(body.addonIds) ? body.addonIds : [];

    // ── Stripe-Weg ──────────────────────────────────────────────
    const stripe = stripeClient();
    if (hatStripe() && stripe) {
      const b = await berechneBetraege(items, rabattCode, addonIds);

      const line_items = items.map((i) => ({
        quantity: i.menge,
        price_data: { currency: "eur", unit_amount: Math.round(i.preis * 100), product_data: { name: `${i.name} — ${i.variante}` } },
      }));
      // Add-ons als eigene Positionen
      for (const a of b.addons) {
        line_items.push({ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(Number(a.preis) * 100), product_data: { name: a.titel } } });
      }
      if (b.versand > 0) {
        line_items.push({ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(b.versand * 100), product_data: { name: "Versand" } } });
      }

      // Mengenrabatt + Gutschein als EIN Coupon (amount_off)
      let discounts: { coupon: string }[] | undefined;
      const rabattGesamt = b.mengenrabattBetrag + b.rabatt.betrag;
      if (rabattGesamt > 0) {
        const coupon = await stripe.coupons.create({ amount_off: Math.round(rabattGesamt * 100), currency: "eur", duration: "once", name: "Rabatt" });
        discounts = [{ coupon: coupon.id }];
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        discounts,
        customer_email: kunde.email,
        success_url: `${basisUrl()}/danke?sid={CHECKOUT_SESSION_ID}`,
        cancel_url: `${basisUrl()}/kasse`,
        metadata: {
          kunde: JSON.stringify(kunde),
          items: JSON.stringify(items),
          rabattCode: rabattCode ?? "",
          addonIds: JSON.stringify(addonIds),
        },
      });

      return NextResponse.json({ ok: true, stripeUrl: session.url });
    }

    // ── Vorkasse-Weg ────────────────────────────────────────────
    const res = await bestellungAnlegen({ kunde, items, summe: 0, versand: 0, rabattCode, addonIds, zahlart: "vorkasse", bezahlt: false });
    if (!res.ok) return NextResponse.json({ fehler: res.fehler }, { status: 500 });
    return NextResponse.json({ ok: true, nummer: res.nummer, gesamt: res.gesamt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bestellung konnte nicht verarbeitet werden.";
    return NextResponse.json({ fehler: msg }, { status: 500 });
  }
}
