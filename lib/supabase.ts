/* Supabase-Clients für Homedeko Store.
   - supabaseServer(): service_role, umgeht RLS — NUR in Server-Code (API-Routen,
     Server-Components, Admin). Niemals an den Client geben.
   - supabasePublic(): anon-Key, respektiert RLS — für öffentliches Lesen.
   Beide sind „lazy": fehlt die ENV, wird null geliefert, damit der Build und
   Code-Fallbacks (statischer Katalog) weiter funktionieren. */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _server: SupabaseClient | null | undefined;
let _public: SupabaseClient | null | undefined;

export function supabaseServer(): SupabaseClient | null {
  if (_server !== undefined) return _server;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  _server = url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
  return _server;
}

export function supabasePublic(): SupabaseClient | null {
  if (_public !== undefined) return _public;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  _public = url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
  return _public;
}

/** true, wenn die Supabase-Anbindung konfiguriert ist. */
export function hatSupabase(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
