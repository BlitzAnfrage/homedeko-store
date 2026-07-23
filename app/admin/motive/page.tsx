import { ladeMotive } from "@/lib/admin-data";
import { motivBild } from "@/lib/katalog";
import MotiveVerwaltung from "./MotiveVerwaltung";

export const dynamic = "force-dynamic";

export default async function MotivePage() {
  const motive = await ladeMotive();
  // Vorschaubild je Motiv serverseitig auflösen (aus dem Bild-Manifest)
  const mitBild = motive.map((m) => ({ ...m, bild: motivBild(m.slug)?.klein ?? null }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Motive & Produkte</h1>
        <p className="text-[14px] text-muted mt-0.5">
          Blende Motive im Shop ein/aus, markiere Bestseller und bearbeite Namen & Texte. Jedes Motiv gibt es als Leinwand, Poster, 3er-Set & Tapete.
        </p>
      </div>
      <MotiveVerwaltung motive={mitBild} />
    </div>
  );
}
