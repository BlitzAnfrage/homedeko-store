import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Eigene Motive verwalten.
   POST:   { name, untertitel, intro, format, kategorien, bestseller } → anlegen
   PATCH:  { slug, ...felder } → ändern
   DELETE: ?slug=<slug> → löschen (inkl. Bilder + Preis-Ausnahmen) */

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  const name = String(b?.name ?? "").trim();
  if (!name) return NextResponse.json({ fehler: "Name erforderlich." }, { status: 400 });

  const basis = slugify(name) || "motiv";
  // eindeutigen Slug sichern (Kollision mit Code-Motiven vermeiden → Präfix "m-")
  const slug = `m-${basis}`;

  const row = {
    slug, name,
    untertitel: String(b.untertitel ?? "").trim(),
    intro: String(b.intro ?? "").trim(),
    format: b.format === "quer" ? "quer" : "quadrat",
    kategorien: Array.isArray(b.kategorien) ? b.kategorien : [],
    bestseller: !!b.bestseller,
    aktiv: b.aktiv !== false,
  };
  const { data, error } = await sb.from("eigene_motive").insert(row).select().single();
  if (error) {
    const msg = error.code === "23505" ? "Ein Motiv mit ähnlichem Namen existiert bereits." : error.message;
    return NextResponse.json({ fehler: msg }, { status: 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, motiv: data });
}

export async function PATCH(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.slug) return NextResponse.json({ fehler: "slug erforderlich." }, { status: 400 });

  const patch: Record<string, unknown> = {};
  for (const f of ["name", "untertitel", "intro", "format"] as const) {
    if (f in b) patch[f] = String(b[f] ?? "").trim();
  }
  if ("kategorien" in b) patch.kategorien = Array.isArray(b.kategorien) ? b.kategorien : [];
  if ("bestseller" in b) patch.bestseller = !!b.bestseller;
  if ("aktiv" in b) patch.aktiv = !!b.aktiv;

  const { error } = await sb.from("eigene_motive").update(patch).eq("slug", b.slug);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ fehler: "slug erforderlich." }, { status: 400 });

  // zugehörige Bilder aus Storage + DB, Preis-Ausnahmen, dann Motiv
  const { data: bilder } = await sb.from("motiv_bilder").select("url").eq("motiv_slug", slug);
  const pfade = (bilder ?? []).map((x) => {
    const m = "/object/public/motive/";
    const i = x.url.indexOf(m);
    return i >= 0 ? x.url.slice(i + m.length) : null;
  }).filter(Boolean) as string[];
  if (pfade.length) await sb.storage.from("motive").remove(pfade).catch(() => {});

  await sb.from("motiv_bilder").delete().eq("motiv_slug", slug);
  await sb.from("preis_override").delete().eq("motiv_slug", slug);
  const { error } = await sb.from("eigene_motive").delete().eq("slug", slug);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
