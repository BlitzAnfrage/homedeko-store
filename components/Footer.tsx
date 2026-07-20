import Link from "next/link";
import Image from "next/image";
import { KATEGORIEN } from "@/lib/katalog";
import { TRUST_ZEILE, ZAHLARTEN } from "@/lib/site";
import PayLogos from "./PayLogos";
import { IconCheck, IconLock } from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-ink-strong text-white/80 mt-20">
      <div className="brandlinie" />
      {/* Trust-Band über dem Footer */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]">
          {TRUST_ZEILE.map((t) => (
            <span key={t} className="flex items-center gap-2 text-white/80">
              <span className="text-gold-bright"><IconCheck size={15} /></span>{t}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Image src="/logo.png" alt="Homedeko Store" width={180} height={48} className="h-10 w-auto" style={{ filter: "invert(1)" }} />
          <p className="mt-4 text-[13.5px] leading-relaxed">
            Kuratierte Wandbilder — als Leinwand fertig bespannt, als Poster,
            Fototapete oder selbstklebender Wallprint. Ausgewählte Motive statt
            endloser Kataloge.
          </p>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-white/60">
            <IconLock size={15} /> Sichere, SSL-verschlüsselte Bestellung
          </p>
        </div>
        <div>
          <div className="text-gold-bright font-semibold text-[14px] mb-3">Sortiment</div>
          <ul className="space-y-2 text-[13.5px]">
            <li><Link className="hover:text-white" href="/kategorie/leinwandbilder">Leinwandbilder</Link></li>
            <li><Link className="hover:text-white" href="/kategorie/3er-sets">3er-Sets</Link></li>
            <li><Link className="hover:text-white" href="/kategorie/fototapeten">Fototapeten</Link></li>
            <li><Link className="hover:text-white" href="/kategorie/wallprints">Wallprints (selbstklebend)</Link></li>
            <li><Link className="hover:text-white" href="/motive">Alle Motive</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-gold-bright font-semibold text-[14px] mb-3">Motiv-Welten</div>
          <ul className="space-y-2 text-[13.5px]">
            {KATEGORIEN.map((k) => (
              <li key={k.slug}><Link className="hover:text-white" href={`/kategorie/${k.slug}`}>{k.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-gold-bright font-semibold text-[14px] mb-3">Service & Rechtliches</div>
          <ul className="space-y-2 text-[13.5px]">
            <li><Link className="hover:text-white" href="/versand">Versand & Lieferung</Link></li>
            <li><Link className="hover:text-white" href="/widerruf">Widerrufsrecht</Link></li>
            <li><Link className="hover:text-white" href="/agb">AGB</Link></li>
            <li><Link className="hover:text-white" href="/datenschutz">Datenschutz</Link></li>
            <li><Link className="hover:text-white" href="/impressum">Impressum</Link></li>
          </ul>
          <p className="mt-5 text-[12.5px] text-white/55">
            Versandkostenfrei ab 60 € (Deutschland) — darunter pauschal 8 €.
          </p>
        </div>
      </div>
      {/* Zahlungsarten */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12.5px] text-white/55">Sicher bezahlen mit</span>
          <PayLogos arten={ZAHLARTEN} />
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[12.5px] text-white/50">
        © {new Date().getFullYear()} Homedeko Store · Alle Preise inkl. MwSt.
      </div>
    </footer>
  );
}
