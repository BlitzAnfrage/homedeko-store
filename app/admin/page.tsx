import Link from "next/link";
import { dashboardKennzahlen } from "@/lib/admin-data";
import { euro } from "@/lib/preise";
import { hatSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function Kachel({ label, wert, hinweis, href }: { label: string; wert: string; hinweis?: string; href?: string }) {
  const inner = (
    <div className="bg-white rounded-xl border border-[#e5e2dc] p-5 h-full hover:border-[#d5d0c6] transition-colors">
      <div className="text-[13px] font-medium text-muted">{label}</div>
      <div className="mt-1.5 text-[26px] font-bold text-ink-strong leading-none">{wert}</div>
      {hinweis && <div className="mt-1.5 text-[12.5px] text-muted">{hinweis}</div>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const k = await dashboardKennzahlen();
  const konfiguriert = hatSupabase();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Übersicht</h1>
        <p className="text-[14px] text-muted mt-0.5">Willkommen zurück. Hier steuerst du deinen Shop.</p>
      </div>

      {!konfiguriert && (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13.5px] text-amber-900">
          Supabase ist nicht konfiguriert — Kennzahlen bleiben leer. Bitte ENV-Variablen setzen.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kachel label="Umsatz gesamt" wert={euro(k.umsatz)} hinweis={`${k.bestellungen} Bestellungen`} href="/admin/bestellungen" />
        <Kachel label="Offene Bestellungen" wert={String(k.offene)} hinweis="Status „neu“" href="/admin/bestellungen" />
        <Kachel label="Aktive Rabattcodes" wert={String(k.rabatte)} href="/admin/rabatte" />
        <Kachel label="Sichtbare Motive" wert={`${k.motiveAktiv} / ${k.motiveGesamt}`} href="/admin/motive" />
      </div>

      <div className="mt-8">
        <h2 className="text-[15px] font-semibold text-ink-strong mb-3">Schnellzugriff</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/admin/preise", titel: "Preise & Größen", text: "Preisstaffeln für Leinwand, Poster, Sets & Tapeten bearbeiten." },
            { href: "/admin/rabatte", titel: "Rabattcode anlegen", text: "Neuen Gutschein-Code mit Prozent- oder Fest-Rabatt erstellen." },
            { href: "/admin/motive", titel: "Motive verwalten", text: "Motive ein-/ausblenden, Texte & Bestseller-Markierung pflegen." },
            { href: "/admin/bestellungen", titel: "Bestellungen", text: "Eingegangene Bestellungen ansehen und Status setzen." },
          ].map((s) => (
            <Link key={s.href} href={s.href}
              className="bg-white rounded-xl border border-[#e5e2dc] p-4 hover:border-bordeaux/40 transition-colors">
              <div className="text-[14.5px] font-semibold text-ink-strong">{s.titel}</div>
              <div className="mt-1 text-[13px] text-muted leading-snug">{s.text}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
