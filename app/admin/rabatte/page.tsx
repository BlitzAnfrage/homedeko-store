import { ladeRabattcodes } from "@/lib/admin-data";
import RabatteVerwaltung from "./RabatteVerwaltung";

export const dynamic = "force-dynamic";

export default async function RabattePage() {
  const codes = await ladeRabattcodes();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Rabattcodes</h1>
        <p className="text-[14px] text-muted mt-0.5">
          Erstelle Gutschein-Codes. Kund:innen geben sie im Warenkorb ein — der Rabatt wird automatisch abgezogen.
        </p>
      </div>
      <RabatteVerwaltung codes={codes} />
    </div>
  );
}
