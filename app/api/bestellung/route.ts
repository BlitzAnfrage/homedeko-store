import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

/* Bestellung anlegen → Supabase (dauerhaft, auch auf Netlify).
   Rabatt wird serverseitig erneut geprüft (nie dem Client-Betrag vertrauen)
   und der Nutzungszähler des Codes erhöht. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.items?.length || !body?.kunde?.email) {
      return NextResponse.json({ fehler: "Unvollständige Bestellung." }, { status: 400 });
    }

    const sb = supabaseServer();
    if (!sb) return NextResponse.json({ fehler: "Speicher nicht verfügbar." }, { status: 500 });

    const summe = Number(body.summe) || 0;
    const versand = Number(body.versand) || 0;

    // Rabatt serverseitig verifizieren (Client-Betrag ignorieren)
    let rabattCode: string | null = null;
    let rabattBetrag = 0;
    if (body.rabattCode) {
      const { data: rc } = await sb.from("rabattcodes").select("*").eq("code", String(body.rabattCode).toUpperCase()).maybeSingle();
      if (rc && rc.aktiv && summe >= Number(rc.mindestwert || 0)
          && (!rc.gueltig_bis || new Date(rc.gueltig_bis) >= new Date())
          && (rc.max_nutzungen == null || rc.genutzt < rc.max_nutzungen)) {
        rabattCode = rc.code;
        rabattBetrag = rc.typ === "prozent"
          ? Math.round(summe * (Number(rc.wert) / 100) * 100) / 100
          : Math.min(summe, Number(rc.wert));
        // Nutzungszähler +1
        await sb.from("rabattcodes").update({ genutzt: Number(rc.genutzt) + 1 }).eq("id", rc.id);
      }
    }

    const gesamt = Math.max(0, summe - rabattBetrag) + versand;
    const nummer = "HD-" + Date.now().toString(36).toUpperCase();

    const { error } = await sb.from("bestellungen").insert({
      nummer, status: "neu",
      kunde: body.kunde, items: body.items,
      summe, versand, rabatt_code: rabattCode, rabatt_betrag: rabattBetrag, gesamt,
    });
    if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

    const webhook = process.env.BESTELL_WEBHOOK_URL;
    if (webhook) {
      fetch(webhook, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nummer, kunde: body.kunde, items: body.items, gesamt }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, nummer, gesamt, rabattBetrag });
  } catch {
    return NextResponse.json({ fehler: "Bestellung konnte nicht gespeichert werden." }, { status: 500 });
  }
}
