import Rechtsseite from "@/components/Rechtsseite";
import { ladeSettings } from "@/lib/settings";

export const metadata = { title: "AGB", robots: { index: false } };
export const revalidate = 60;

export default async function Seite() {
  const s = await ladeSettings();
  return <Rechtsseite titel="Allgemeine Geschäftsbedingungen" inhalt={s.rechtstexte.agb} />;
}
