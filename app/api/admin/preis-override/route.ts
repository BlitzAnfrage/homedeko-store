import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";

/* Preis-Ausnahme pro Produkt (Motiv+Art) setzen oder entfernen.
   PUT: { motivSlug, art, groessen }  → setzt/überschreibt die Ausnahme
   DELETE: ?key=<slug>::<art>         → entfernt die Ausnahme (zurück zur Staffel) */

export async function PUT(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.motivSlug || !b?.art || !Array.isArray(b.groessen)) {
    return NextResponse.json({ fehler: "motivSlug, art und groessen erforderlich." }, { status: 400 });
  }

  const groessen = b.groessen.map((g: Record<string, unknown>) => ({
    label: String(g.label ?? "").trim(),
    b: g.b != null && g.b !== "" ? Number(g.b) : undefined,
    h: g.h != null && g.h !== "" ? Number(g.h) : undefined,
    preis: Math.max(0, Number(g.preis) || 0),
    ...(g.beliebt ? { beliebt: true } : {}),
  })).filter((g: { label: string }) => g.label.length > 0);

  const key = `${b.motivSlug}::${b.art}`;
  const { error } = await sb.from("preis_override").upsert({
    key, motiv_slug: b.motivSlug, art: b.art, groessen, aktualisiert: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ fehler: "key erforderlich." }, { status: 400 });
  const { error } = await sb.from("preis_override").delete().eq("key", key);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
