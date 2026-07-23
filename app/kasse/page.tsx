import { hatStripe } from "@/lib/zahlung";
import KasseForm from "./KasseForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Kasse", robots: { index: false } };

export default function KasseSeite() {
  return <KasseForm stripeAktiv={hatStripe()} />;
}
