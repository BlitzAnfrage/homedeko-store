import { ladeBestellungen } from "@/lib/admin-data";
import BestellListe from "./BestellListe";

export const dynamic = "force-dynamic";

export default async function BestellungenPage() {
  const bestellungen = await ladeBestellungen();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Bestellungen</h1>
        <p className="text-[14px] text-muted mt-0.5">Alle eingegangenen Bestellungen. Klicke eine an, um Details zu sehen und den Status zu setzen.</p>
      </div>
      <BestellListe bestellungen={bestellungen} />
    </div>
  );
}
