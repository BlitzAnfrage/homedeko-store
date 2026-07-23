import { ladeAlleAddons } from "@/lib/addons";
import { ladeSettings } from "@/lib/settings";
import UpsellsVerwaltung from "./UpsellsVerwaltung";

export const dynamic = "force-dynamic";

export default async function UpsellsPage() {
  const [addons, settings] = await Promise.all([ladeAlleAddons(), ladeSettings()]);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-ink-strong">Upsells & Rabatte</h1>
        <p className="text-[14px] text-muted mt-0.5">
          Extras zum Ankreuzen (z.B. versicherter Versand) und Mengenrabatt (mehr Bilder = mehr Rabatt).
        </p>
      </div>
      <UpsellsVerwaltung addons={addons} mengenrabatt={settings.mengenrabatt} />
    </div>
  );
}
