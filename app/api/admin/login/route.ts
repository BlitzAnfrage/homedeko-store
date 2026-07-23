import { NextResponse } from "next/server";
import { ADMIN_COOKIE, tokenFuerPasswort } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { passwort } = await req.json().catch(() => ({ passwort: "" }));
  const token = await tokenFuerPasswort(String(passwort ?? ""));
  if (!token) {
    return NextResponse.json({ fehler: "Falsches Passwort." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 Tage
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
