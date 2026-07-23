import { NextResponse } from "next/server";
import { stripeClient } from "@/lib/zahlung";
import { bestellungAnlegen, type BestellItem } from "@/lib/bestellung";

/* Stripe ruft diesen Endpunkt nach erfolgreicher Zahlung auf. Wir prüfen die
   Signatur, lesen die Bestell-Nutzdaten aus der Session-Metadata und legen die
   (bezahlte) Bestellung an — inkl. Mailversand. Nur checkout.session.completed. */
export async function POST(req: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ fehler: "Stripe nicht konfiguriert." }, { status: 400 });

  const sig = req.headers.get("stripe-signature");
  const payload = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig!, secret);
  } catch (err) {
    return NextResponse.json({ fehler: `Signatur ungültig: ${err instanceof Error ? err.message : ""}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: Record<string, string>; customer_email?: string };
    const m = session.metadata ?? {};
    try {
      const kunde = m.kunde ? JSON.parse(m.kunde) : {};
      const items = (m.items ? JSON.parse(m.items) : []) as BestellItem[];
      const addonIds = m.addonIds ? JSON.parse(m.addonIds) : [];
      if (items.length && kunde.email) {
        await bestellungAnlegen({
          kunde, items, summe: 0, versand: 0,
          rabattCode: m.rabattCode || null,
          addonIds,
          zahlart: "stripe",
          bezahlt: true,
        });
      }
    } catch { /* fehlerhafte Metadata nie den Webhook 500en lassen → Stripe würde retryen */ }
  }

  return NextResponse.json({ received: true });
}
