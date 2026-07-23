/* Zahlungs- & Mail-Infrastruktur. Alles „lazy" und optional: fehlen die Keys,
   liefern die Getter null und der Shop fällt sauber auf Vorkasse / kein-Mail
   zurück (Shop bleibt funktionsfähig). Nur serverseitig verwenden. */
import "server-only";
import Stripe from "stripe";
import { Resend } from "resend";

let _stripe: Stripe | null | undefined;
let _resend: Resend | null | undefined;

function echterKey(v: string | undefined): v is string {
  return !!v && v.trim().length > 10 && !v.includes("DEIN_") && !v.includes("xxx");
}

/** Stripe-Client oder null, wenn kein (echter) Secret-Key gesetzt ist. */
export function stripeClient(): Stripe | null {
  if (_stripe !== undefined) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  _stripe = echterKey(key) ? new Stripe(key, { apiVersion: "2026-06-24.dahlia" }) : null;
  return _stripe;
}

/** true, wenn Stripe voll konfiguriert ist (Secret + Publishable). */
export function hatStripe(): boolean {
  return echterKey(process.env.STRIPE_SECRET_KEY)
    && echterKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/** Resend-Client oder null, wenn kein API-Key gesetzt ist. */
export function resendClient(): Resend | null {
  if (_resend !== undefined) return _resend;
  const key = process.env.RESEND_API_KEY;
  _resend = echterKey(key) ? new Resend(key) : null;
  return _resend;
}

export function mailAbsender(): string | null {
  const from = process.env.RESEND_FROM;
  return echterKey(from) ? from : null;
}

export function basisUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
