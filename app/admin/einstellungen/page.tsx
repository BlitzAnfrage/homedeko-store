import { ladeSettings } from "@/lib/settings";
import EinstellungenEditor from "./EinstellungenEditor";

export const dynamic = "force-dynamic";

export default async function EinstellungenPage() {
  const settings = await ladeSettings();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Einstellungen</h1>
        <p className="text-[14px] text-muted mt-0.5">
          Versand, Firmendaten, Banner-Texte und Rechtstexte deines Shops. Änderungen wirken sofort.
        </p>
      </div>
      <EinstellungenEditor settings={settings} />
    </div>
  );
}
