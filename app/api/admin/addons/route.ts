import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Add-ons verwalten. POST=anlegen, PATCH=ändern, DELETE=löschen. */
export async function POST(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  const titel = String(b?.titel ?? "").trim();
  if (!titel) return NextResponse.json({ fehler: "Titel erforderlich." }, { status: 400 });

  const { data, error } = await sb.from("addons").insert({
    titel,
    beschreibung: String(b.beschreibung ?? "").trim(),
    preis: Math.max(0, Number(b.preis) || 0),
    aktiv: b.aktiv !== false,
    vorausgewaehlt: !!b.vorausgewaehlt,
    sortierung: Number(b.sortierung) || 0,
  }).select().single();
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, addon: data });
}

export async function PATCH(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.id) return NextResponse.json({ fehler: "id erforderlich." }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if ("titel" in b) patch.titel = String(b.titel ?? "").trim();
  if ("beschreibung" in b) patch.beschreibung = String(b.beschreibung ?? "").trim();
  if ("preis" in b) patch.preis = Math.max(0, Number(b.preis) || 0);
  if ("aktiv" in b) patch.aktiv = !!b.aktiv;
  if ("vorausgewaehlt" in b) patch.vorausgewaehlt = !!b.vorausgewaehlt;
  if ("sortierung" in b) patch.sortierung = Number(b.sortierung) || 0;

  const { error } = await sb.from("addons").update(patch).eq("id", b.id);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ fehler: "id erforderlich." }, { status: 400 });
  const { error } = await sb.from("addons").delete().eq("id", id);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
