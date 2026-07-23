import type { Metadata } from "next";
import { IconCheck } from "@/components/Icon";
import { ladeSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Versand & Lieferung",
  description: "Alle Infos zu Versand und Lieferung im Homedeko Store.",
  alternates: { canonical: "/versand" },
};

export const revalidate = 60;

export default async function VersandSeite() {
  const { versand } = await ladeSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-10">
      <h1 className="font-display text-4xl text-ink-strong mb-6">Versand & Lieferung</h1>
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-[16px] mb-3">Versandkosten (Deutschland)</h2>
        <ul className="space-y-2.5">
          {[`Ab ${versand.frei_ab} € Bestellwert: versandkostenfrei`, `Unter ${versand.frei_ab} € Bestellwert: pauschal ${versand.kosten} €`].map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[15px]">
              <span className="text-ok mt-0.5"><IconCheck size={17} /></span>{t}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4 text-[14.5px] leading-relaxed text-muted">
        <p>
          Leinwandbilder werden fertig bespannt und sorgfältig verpackt verschickt —
          inklusive montiertem Zacken-Aufhänger, damit dein Bild direkt an die Wand kann.
        </p>
        <p>
          Fototapeten und Wallprints werden gerollt geliefert. Bei Motiven über der
          Bahnbreite (150 cm bzw. 120 cm) wird das Motiv passgenau in Bahnen gedruckt.
        </p>
        <p>
          Fragen zu deiner Lieferung? Schreib uns — die Kontaktdaten findest du im Impressum.
        </p>
      </div>
    </div>
  );
}
