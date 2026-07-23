import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

/* Rabattcodes verwalten. POST=anlegen, PATCH=ändern, DELETE=löschen. */

function normCode(c: unknown) {
  return String(c ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  const code = normCode(b?.code);
  if (!code) return NextResponse.json({ fehler: "Code erforderlich." }, { status: 400 });
  if (!["prozent", "fest"].includes(b?.typ)) return NextResponse.json({ fehler: "Ungültiger Typ." }, { status: 400 });

  const row = {
    code,
    typ: b.typ,
    wert: Math.max(0, Number(b.wert) || 0),
    mindestwert: Math.max(0, Number(b.mindestwert) || 0),
    aktiv: b.aktiv !== false,
    gueltig_bis: b.gueltig_bis || null,
    max_nutzungen: b.max_nutzungen ? Number(b.max_nutzungen) : null,
  };
  const { data, error } = await sb.from("rabattcodes").insert(row).select().single();
  if (error) {
    const msg = error.code === "23505" ? "Dieser Code existiert bereits." : error.message;
    return NextResponse.json({ fehler: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true, code: data });
}

export async function PATCH(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.id) return NextResponse.json({ fehler: "id erforderlich." }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if ("aktiv" in b) patch.aktiv = !!b.aktiv;
  if ("wert" in b) patch.wert = Math.max(0, Number(b.wert) || 0);
  if ("mindestwert" in b) patch.mindestwert = Math.max(0, Number(b.mindestwert) || 0);
  if ("typ" in b && ["prozent", "fest"].includes(b.typ)) patch.typ = b.typ;
  if ("gueltig_bis" in b) patch.gueltig_bis = b.gueltig_bis || null;
  if ("max_nutzungen" in b) patch.max_nutzungen = b.max_nutzungen ? Number(b.max_nutzungen) : null;

  const { error } = await sb.from("rabattcodes").update(patch).eq("id", b.id);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ fehler: "id erforderlich." }, { status: 400 });
  const { error } = await sb.from("rabattcodes").delete().eq("id", id);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
