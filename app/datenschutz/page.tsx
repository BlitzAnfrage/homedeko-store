import Rechtsseite from "@/components/Rechtsseite";
import { ladeSettings } from "@/lib/settings";

export const metadata = { title: "Datenschutzerklärung", robots: { index: false } };
export const revalidate = 60;

export default async function Seite() {
  const s = await ladeSettings();
  return <Rechtsseite titel="Datenschutzerklärung" inhalt={s.rechtstexte.datenschutz} />;
}
