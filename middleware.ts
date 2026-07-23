/* Bewacht /admin/* — ohne gültiges Admin-Cookie → Redirect auf /admin/login.
   Die Login-Seite selbst und die Login-API sind ausgenommen. */
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, istGueltig } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login-Seite + Login-API immer erlauben (sonst Redirect-Schleife)
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const ok = await istGueltig(req.cookies.get(ADMIN_COOKIE)?.value);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("weiter", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // gilt für alle Admin-Seiten und geschützte Admin-APIs
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
