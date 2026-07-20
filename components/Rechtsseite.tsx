/* Platzhalter-Layout für Rechtsseiten — Inhalte MÜSSEN vor Go-Live durch
   geprüfte Rechtstexte des Betreibers ersetzt werden. */
export default function Rechtsseite({ titel }: { titel: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-10">
      <h1 className="font-display text-4xl text-ink-strong mb-6">{titel}</h1>
      <div className="card p-6 border-accent bg-accent-soft/40">
        <p className="text-[14.5px] leading-relaxed">
          <b>Platzhalter:</b> Diese Seite wird vor dem Go-Live mit den geprüften
          Rechtstexten des Shop-Betreibers befüllt (z. B. über einen
          Rechtstexte-Service wie IT-Recht Kanzlei oder Händlerbund).
        </p>
      </div>
    </div>
  );
}
