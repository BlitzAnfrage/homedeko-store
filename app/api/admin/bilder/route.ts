import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Bild-Verwaltung pro Motiv.
   POST (multipart): file, motivSlug, typ  → lädt nach Storage + Eintrag in motiv_bilder
   DELETE: ?id=<uuid>&url=<storage-url>     → löscht Eintrag + Storage-Objekt */

const BUCKET = "motive";

export async function POST(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  const motivSlug = String(form?.get("motivSlug") ?? "").trim();
  const typ = String(form?.get("typ") ?? "ans").trim();
  if (!file || !motivSlug) {
    return NextResponse.json({ fehler: "file und motivSlug erforderlich." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ fehler: "Nur Bilddateien erlaubt." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const pfad = `${motivSlug}/${typ}-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const up = await sb.storage.from(BUCKET).upload(pfad, bytes, {
    contentType: file.type, upsert: false,
  });
  if (up.error) return NextResponse.json({ fehler: up.error.message }, { status: 500 });

  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(pfad);
  const url = pub.publicUrl;

  // höchste Sortierung + 1
  const { data: vorhanden } = await sb.from("motiv_bilder").select("sortierung").eq("motiv_slug", motivSlug).order("sortierung", { ascending: false }).limit(1);
  const sort = (vorhanden?.[0]?.sortierung ?? -1) + 1;

  const { data: row, error } = await sb.from("motiv_bilder")
    .insert({ motiv_slug: motivSlug, url, typ, sortierung: sort })
    .select().single();
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, bild: row });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const params = new URL(req.url).searchParams;
  const id = params.get("id");
  const url = params.get("url");
  if (!id) return NextResponse.json({ fehler: "id erforderlich." }, { status: 400 });

  // Storage-Objekt löschen (Pfad aus der public-URL ableiten)
  if (url) {
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx >= 0) {
      const pfad = url.slice(idx + marker.length);
      await sb.storage.from(BUCKET).remove([pfad]).catch(() => {});
    }
  }
  const { error } = await sb.from("motiv_bilder").delete().eq("id", id);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
