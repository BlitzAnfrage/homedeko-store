import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Speichert eine Einstellungs-Gruppe. Body: { key, wert }
   key ∈ versand | firma | texte | rechtstexte */
const ERLAUBT = ["versand", "firma", "texte", "rechtstexte", "zahlung", "mengenrabatt"];

export async function PUT(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.key || !ERLAUBT.includes(b.key) || typeof b.wert !== "object") {
    return NextResponse.json({ fehler: "key (versand|firma|texte|rechtstexte) und wert erforderlich." }, { status: 400 });
  }

  const { error } = await sb.from("shop_settings").upsert({ key: b.key, wert: b.wert });
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
