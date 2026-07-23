import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Produkt-Variante (Motiv+Art) an-/ausschalten.
   POST { motivSlug, art, aus }  → aus=true blendet aus, aus=false blendet ein */
export async function POST(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.motivSlug || !b?.art) {
    return NextResponse.json({ fehler: "motivSlug und art erforderlich." }, { status: 400 });
  }
  const key = `${b.motivSlug}::${b.art}`;

  if (b.aus) {
    const { error } = await sb.from("variante_aus").upsert({ key, motiv_slug: b.motivSlug, art: b.art });
    if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  } else {
    const { error } = await sb.from("variante_aus").delete().eq("key", key);
    if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
