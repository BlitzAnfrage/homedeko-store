import type { Metadata } from "next";
import { IconCheck } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Versand & Lieferung",
  description: "Versandkostenfrei ab 60 € innerhalb Deutschlands — darunter pauschal 8 €. Alle Infos zu Versand und Lieferung im Homedeko Store.",
  alternates: { canonical: "/versand" },
};

export default function VersandSeite() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-10">
      <h1 className="font-display text-4xl text-ink-strong mb-6">Versand & Lieferung</h1>
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-[16px] mb-3">Versandkosten (Deutschland)</h2>
        <ul className="space-y-2.5">
          {["Ab 60 € Bestellwert: versandkostenfrei", "Unter 60 € Bestellwert: pauschal 8 €"].map((t) => (
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
