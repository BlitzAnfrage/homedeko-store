"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Reveal from "./Reveal";

/* Blendet den Shop-Rahmen (Header/Footer/Reveal) im Admin-Bereich aus —
   /admin hat sein eigenes Layout. */
export default function ShopChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const istAdmin = path?.startsWith("/admin");

  if (istAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Reveal />
    </>
  );
}
