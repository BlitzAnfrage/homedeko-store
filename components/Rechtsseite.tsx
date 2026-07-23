import type { FirmaSettings } from "@/lib/settings";

/* Rechtsseite: zeigt den im Admin gepflegten Text. Ist er leer, kommt beim
   Impressum ein aus den Firmendaten generierter Basis-Block, sonst ein
   Platzhalter-Hinweis. Zeilenumbrüche im Text werden erhalten. */
export default function Rechtsseite({
  titel, inhalt, firma, istImpressum,
}: {
  titel: string;
  inhalt?: string;
  firma?: FirmaSettings;
  istImpressum?: boolean;
}) {
  const hatText = inhalt && inhalt.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-10">
      <h1 className="font-display text-4xl text-ink-strong mb-6">{titel}</h1>

      {hatText ? (
        <div className="text-[14.5px] leading-relaxed text-ink whitespace-pre-wrap">{inhalt}</div>
      ) : istImpressum && firma && (firma.name || firma.strasse) ? (
        <div className="text-[14.5px] leading-relaxed text-ink space-y-4">
          <div>
            <div className="font-semibold text-ink-strong">Angaben gemäß § 5 TMG</div>
            <p className="mt-1 whitespace-pre-line">
              {[firma.name, firma.inhaber, firma.strasse, [firma.plz, firma.ort].filter(Boolean).join(" "), firma.land]
                .filter(Boolean).join("\n")}
            </p>
          </div>
          {(firma.telefon || firma.email) && (
            <div>
              <div className="font-semibold text-ink-strong">Kontakt</div>
              {firma.telefon && <p className="mt-1">Telefon: {firma.telefon}</p>}
              {firma.email && <p>E-Mail: {firma.email}</p>}
            </div>
          )}
          {firma.ustid && (
            <div>
              <div className="font-semibold text-ink-strong">Umsatzsteuer-ID</div>
              <p className="mt-1">{firma.ustid}</p>
            </div>
          )}
          {(firma.registergericht || firma.hrb) && (
            <div>
              <div className="font-semibold text-ink-strong">Registereintrag</div>
              <p className="mt-1">{[firma.registergericht, firma.hrb].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-6 border-accent bg-accent-soft/40">
          <p className="text-[14.5px] leading-relaxed">
            <b>Noch nicht befüllt:</b> Diese Seite wird im Admin-Bereich unter
            <b> Einstellungen → Rechtstexte</b> mit den geprüften Rechtstexten befüllt
            (z. B. über einen Rechtstexte-Service wie e-recht24, IT-Recht Kanzlei oder Händlerbund).
          </p>
        </div>
      )}
    </div>
  );
}
