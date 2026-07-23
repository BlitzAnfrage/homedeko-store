import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const STATUS = ["neu", "bezahlt", "versandt", "storniert"];

/* Bestellstatus setzen. Body: { id, status } */
export async function PATCH(req: Request) {
  const sb = supabaseServer();
  if (!sb) return NextResponse.json({ fehler: "DB nicht konfiguriert." }, { status: 500 });
  const b = await req.json().catch(() => null);
  if (!b?.id || !STATUS.includes(b?.status)) {
    return NextResponse.json({ fehler: "id und gültiger status erforderlich." }, { status: 400 });
  }
  const { error } = await sb.from("bestellungen").update({ status: b.status }).eq("id", b.id);
  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
