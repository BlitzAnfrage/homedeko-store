/* Admin-Passwortschutz — leichtgewichtig, ohne User-DB.
   Login: Passwort == ADMIN_PASSWORT → wir setzen ein httpOnly-Cookie, dessen
   Wert eine HMAC-Signatur des Passworts ist (kein Klartext im Cookie).
   Die Middleware prüft nur die Signatur. Web-Crypto → läuft auch im Edge. */

const COOKIE = "hds_admin";

function enc(s: string) { return new TextEncoder().encode(s); }

async function hmac(passwort: string): Promise<string> {
  const secret = process.env.ADMIN_PASSWORT || "";
  const key = await crypto.subtle.importKey(
    "raw", enc(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc("homedeko-admin-v1"));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

/** Erwarteter Cookie-Wert bei korrektem ADMIN_PASSWORT. */
export async function erwarteterToken(): Promise<string> {
  return hmac(process.env.ADMIN_PASSWORT || "");
}

/** Prüft ein eingegebenes Passwort und liefert bei Erfolg den Cookie-Wert. */
export async function tokenFuerPasswort(passwort: string): Promise<string | null> {
  const soll = process.env.ADMIN_PASSWORT || "";
  if (!soll || passwort !== soll) return null;
  return hmac(passwort);
}

/** Prüft, ob ein Cookie-Wert gültig ist (konstantzeit-ähnlich). */
export async function istGueltig(cookieWert: string | undefined): Promise<boolean> {
  if (!cookieWert) return false;
  const soll = await erwarteterToken();
  if (cookieWert.length !== soll.length) return false;
  let diff = 0;
  for (let i = 0; i < soll.length; i++) diff |= cookieWert.charCodeAt(i) ^ soll.charCodeAt(i);
  return diff === 0;
}

export const ADMIN_COOKIE = COOKIE;
