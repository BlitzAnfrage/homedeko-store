import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

/* Öffentliche Rabatt-Prüfung fürs Warenkorb-Frontend.
   Body: { code, warenwert } → { gueltig, typ, wert, betrag, ... } oder Grund. */
export async function POST(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ gueltig: false, grund: "Nicht verfügbar." }, { status: 200 });

  const b = await req.json().catch(() => null);
  const code = String(b?.code ?? "").trim().toUpperCase();
  const warenwert = Math.max(0, Number(b?.warenwert) || 0);
  if (!code) return NextResponse.json({ gueltig: false, grund: "Kein Code." });

  const { data } = await sb.from("rabattcodes").select("*").eq("code", code).maybeSingle();
  if (!data) return NextResponse.json({ gueltig: false, grund: "Code nicht gefunden." });
  if (!data.aktiv) return NextResponse.json({ gueltig: false, grund: "Code ist nicht aktiv." });

  const jetzt = new Date();
  if (data.gueltig_ab && new Date(data.gueltig_ab) > jetzt)
    return NextResponse.json({ gueltig: false, grund: "Code ist noch nicht gültig." });
  if (data.gueltig_bis && new Date(data.gueltig_bis) < jetzt)
    return NextResponse.json({ gueltig: false, grund: "Code ist abgelaufen." });
  if (data.max_nutzungen != null && data.genutzt >= data.max_nutzungen)
    return NextResponse.json({ gueltig: false, grund: "Code ist aufgebraucht." });
  if (warenwert < Number(data.mindestwert || 0))
    return NextResponse.json({ gueltig: false, grund: `Mindestbestellwert ${data.mindestwert} € nicht erreicht.` });

  const betrag = data.typ === "prozent"
    ? Math.round(warenwert * (Number(data.wert) / 100) * 100) / 100
    : Math.min(warenwert, Number(data.wert));

  return NextResponse.json({
    gueltig: true, code: data.code, typ: data.typ, wert: Number(data.wert), betrag,
  });
}
