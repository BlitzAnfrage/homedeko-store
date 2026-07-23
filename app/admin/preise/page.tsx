import { ladePreisstaffeln } from "@/lib/admin-data";
import PreiseEditor from "./PreiseEditor";

export const dynamic = "force-dynamic";

export default async function PreisePage() {
  const staffeln = await ladePreisstaffeln();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Preise & Größen</h1>
        <p className="text-[14px] text-muted mt-0.5">
          Passe Preise, Maße und die „Beliebt“-Markierung an. Änderungen wirken sofort im Shop.
        </p>
      </div>
      {staffeln.length === 0 ? (
        <div className="rounded-lg border border-[#e5e2dc] bg-white p-6 text-[14px] text-muted">
          Keine Preisstaffeln gefunden. Ist die DB geseedet?
        </div>
      ) : (
        <PreiseEditor staffeln={staffeln} />
      )}
    </div>
  );
}
