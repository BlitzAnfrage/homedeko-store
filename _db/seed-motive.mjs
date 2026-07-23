/* Seedet alle Motive aus lib/katalog.ts als motive_override in Supabase.
   Parst das MOTIVE-Array direkt aus dem Quelltext (reines JS im Array-Body),
   damit kein TS-Toolchain nötig ist. ENV: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY */
import { readFileSync } from "node:fs";

const SB_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB_URL || !KEY) { console.error("ENV SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlt"); process.exit(1); }

const src = readFileSync(new URL("../lib/katalog.ts", import.meta.url), "utf8");
// Array-Literal zwischen "export const MOTIVE: Motiv[] = [" und der schließenden "];"
const start = src.indexOf("export const MOTIVE");
const eq = src.indexOf("=", start);            // nach dem Typ "Motiv[]"
const bracket = src.indexOf("[", eq);          // erstes [ NACH dem =
// passende schließende Klammer per Tiefenzählung finden
let depth = 0, end = -1;
for (let i = bracket; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const arrLit = src.slice(bracket, end + 1);
// Zu JS auswerten (Array enthält nur JS-Objektliterale, keine TS-Typen)
const MOTIVE = new Function(`return ${arrLit};`)();
console.log(`Gelesen: ${MOTIVE.length} Motive`);

const rows = MOTIVE.map((m) => ({
  slug: m.slug, name: m.name, untertitel: m.untertitel, intro: m.intro,
  bestseller: !!m.bestseller, aktiv: true, kategorien: m.kategorien,
}));

const res = await fetch(`${SB_URL}/rest/v1/motive_override`, {
  method: "POST",
  headers: {
    apikey: KEY, Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify(rows),
});
console.log("Status:", res.status, res.statusText);
if (!res.ok) { console.log(await res.text()); process.exit(1); }
console.log(`${rows.length} Motive geseedet.`);
