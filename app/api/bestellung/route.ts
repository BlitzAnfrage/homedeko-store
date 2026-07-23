import { NextResponse } from "next/server";
import { bestellungAnlegen, type BestellItem } from "@/lib/bestellung";
import { hatStripe, stripeClient, basisUrl } from "@/lib/zahlung";

/* Checkout-Einstieg.
   - Stripe konfiguriert → erstellt eine Stripe-Checkout-Session, gibt deren URL
     zurück (Kunde wird dorthin geleitet, Bestellung entsteht erst im Webhook).
   - Sonst (Vorkasse) → Bestellung sofort speichern + Bestätigungsmail mit
     Bankdaten, Rückgabe der Bestellnummer. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.items?.length || !body?.kunde?.email) {
      return NextResponse.json({ fehler: "Unvollständige Bestellung." }, { status: 400 });
    }
    const items = body.items as BestellItem[];
    const kunde = body.kunde as Record<string, string>;
    const summe = Number(body.summe) || 0;
    const versand = Number(body.versand) || 0;
    const rabattCode = body.rabattCode ?? null;

    // ── Stripe-Weg ──────────────────────────────────────────────
    const stripe = stripeClient();
    if (hatStripe() && stripe) {
      // Rabatt als negativer „Coupon" ist komplex — wir bilden den Rabatt als
      // anteilige Reduktion je Position ab, indem wir eine Rabatt-Zeile ergänzen.
      const line_items = items.map((i) => ({
        quantity: i.menge,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(i.preis * 100),
          product_data: { name: `${i.name} — ${i.variante}` },
        },
      }));
      if (versand > 0) {
        line_items.push({
          quantity: 1,
          price_data: { currency: "eur", unit_amount: Math.round(versand * 100), product_data: { name: "Versand" } },
        });
      }

      // Rabatt via Stripe-Coupon (einmalig, amount_off)
      let discounts: { coupon: string }[] | undefined;
      if (rabattCode) {
        const { pruefeRabattBetrag } = await import("@/lib/rabatt-pruefung");
        const betrag = await pruefeRabattBetrag(rabattCode, summe);
        if (betrag > 0) {
          const coupon = await stripe.coupons.create({ amount_off: Math.round(betrag * 100), currency: "eur", duration: "once", name: `Rabatt ${rabattCode}` });
          discounts = [{ coupon: coupon.id }];
        }
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        discounts,
        customer_email: kunde.email,
        success_url: `${basisUrl()}/danke?sid={CHECKOUT_SESSION_ID}`,
        cancel_url: `${basisUrl()}/kasse`,
        metadata: {
          // Bestell-Nutzdaten kompakt für den Webhook (Stripe-Limit 500 Zeichen/Wert)
          kunde: JSON.stringify(kunde).slice(0, 500),
          rabattCode: rabattCode ?? "",
          summe: String(summe),
          versand: String(versand),
        },
        // vollständige Items separat, da metadata-Werte begrenzt sind
        payment_intent_data: { metadata: { items: JSON.stringify(items).slice(0, 500) } },
      });

      // Items + kunde vollständig zwischenspeichern (metadata reicht nicht) →
      // wir hängen sie an die Session-Metadata über ein separates Feld an.
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          kunde: JSON.stringify(kunde),
          items: JSON.stringify(items),
          rabattCode: rabattCode ?? "",
          summe: String(summe),
          versand: String(versand),
        },
      }).catch(() => {});

      return NextResponse.json({ ok: true, stripeUrl: session.url });
    }

    // ── Vorkasse-Weg ────────────────────────────────────────────
    const res = await bestellungAnlegen({ kunde, items, summe, versand, rabattCode, zahlart: "vorkasse", bezahlt: false });
    if (!res.ok) return NextResponse.json({ fehler: res.fehler }, { status: 500 });
    return NextResponse.json({ ok: true, nummer: res.nummer, gesamt: res.gesamt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bestellung konnte nicht verarbeitet werden.";
    return NextResponse.json({ fehler: msg }, { status: 500 });
  }
}
