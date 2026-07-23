"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Reveal from "./Reveal";

/* Blendet den Shop-Rahmen (Header/Footer/Reveal) im Admin-Bereich aus —
   /admin hat sein eigenes Layout. Banner/Firma/Versand kommen als Props vom
   Server-Layout (das die Settings lädt). */
export default function ShopChrome({
  children, banner, firmaName, versandFreiAb, versandKosten,
}: {
  children: React.ReactNode;
  banner?: string[];
  firmaName?: string;
  versandFreiAb?: number;
  versandKosten?: number;
}) {
  const path = usePathname();
  const istAdmin = path?.startsWith("/admin");

  if (istAdmin) return <>{children}</>;

  return (
    <>
      <Header banner={banner} />
      <main>{children}</main>
      <Footer firmaName={firmaName} versandFreiAb={versandFreiAb} versandKosten={versandKosten} />
      <Reveal />
    </>
  );
}
