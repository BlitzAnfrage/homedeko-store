import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/* Speicherschicht Stufe 1 (Blaupause): lokale JSON-Datei — sofort lauffähig.
   Für den Live-Betrieb später auf Supabase/Webhook umstellen (ENV BESTELL_WEBHOOK_URL). */
const DATEI = path.join(process.cwd(), "_data", "bestellungen.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.items?.length || !body?.kunde?.email) {
      return NextResponse.json({ fehler: "Unvollständige Bestellung." }, { status: 400 });
    }

    const nummer = "HD-" + Date.now().toString(36).toUpperCase();
    const bestellung = {
      nummer,
      zeitpunkt: new Date().toISOString(),
      status: "neu",
      kunde: body.kunde,
      items: body.items,
      summe: body.summe,
      versand: body.versand,
      gesamt: body.gesamt,
    };

    let alle: unknown[] = [];
    try { alle = JSON.parse(fs.readFileSync(DATEI, "utf8")); } catch {}
    alle.push(bestellung);
    fs.mkdirSync(path.dirname(DATEI), { recursive: true });
    fs.writeFileSync(DATEI, JSON.stringify(alle, null, 1));

    const webhook = process.env.BESTELL_WEBHOOK_URL;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bestellung),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, nummer });
  } catch {
    return NextResponse.json({ fehler: "Bestellung konnte nicht gespeichert werden." }, { status: 500 });
  }
}
