import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

/* Speichert die Größen einer Preisstaffel. Body: { id, groessen: [...] } */
export async function PUT(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });

  const body = await req.json().catch(() => null);
  if (!body?.id || !Array.isArray(body.groessen)) {
    return NextResponse.json({ fehler: "id und groessen erforderlich." }, { status: 400 });
  }

  // Validierung: jede Größe braucht label + preis >= 0
  const groessen = body.groessen.map((g: Record<string, unknown>) => ({
    label: String(g.label ?? "").trim(),
    b: g.b != null && g.b !== "" ? Number(g.b) : undefined,
    h: g.h != null && g.h !== "" ? Number(g.h) : undefined,
    preis: Math.max(0, Number(g.preis) || 0),
    ...(g.beliebt ? { beliebt: true } : {}),
  })).filter((g: { label: string }) => g.label.length > 0);

  const { error } = await sb.from("preisstaffeln")
    .update({ groessen, aktualisiert: new Date().toISOString() })
    .eq("id", body.id);

  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, anzahl: groessen.length });
}
