import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Motiv-Override aktualisieren. Body: { slug, ...felder } */
export async function PATCH(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.slug) return NextResponse.json({ fehler: "slug erforderlich." }, { status: 400 });

  const patch: Record<string, unknown> = { aktualisiert: new Date().toISOString() };
  if ("aktiv" in b) patch.aktiv = !!b.aktiv;
  if ("bestseller" in b) patch.bestseller = b.bestseller === null ? null : !!b.bestseller;
  if ("name" in b) patch.name = b.name?.trim() || null;
  if ("untertitel" in b) patch.untertitel = b.untertitel?.trim() || null;
  if ("intro" in b) patch.intro = b.intro?.trim() || null;

  const { error } = await sb.from("motive_override").update(patch).eq("slug", b.slug);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
