/* Serverseitige Rabattbetrag-Berechnung (für Stripe-Coupon-Erzeugung).
   Gibt 0 zurück, wenn der Code ungültig/abgelaufen/aufgebraucht ist. */
import "server-only";
import { supabaseServer } from "./supabase";

export async function pruefeRabattBetrag(code: string, summe: number): Promise<number> {
  const sb = supabaseServer();
  if (!sb || !code) return 0;
  const { data: rc } = await sb.from("rabattcodes").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!rc || !rc.aktiv || summe < Number(rc.mindestwert || 0)) return 0;
  if (rc.gueltig_bis && new Date(rc.gueltig_bis) < new Date()) return 0;
  if (rc.max_nutzungen != null && rc.genutzt >= rc.max_nutzungen) return 0;
  return rc.typ === "prozent"
    ? Math.round(summe * (Number(rc.wert) / 100) * 100) / 100
    : Math.min(summe, Number(rc.wert));
}
