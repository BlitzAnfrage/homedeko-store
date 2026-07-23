import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import ShopChrome from "@/components/ShopChrome";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Homedeko Store — Leinwandbilder, Fototapeten & Wallprints",
    template: "%s | Homedeko Store",
  },
  description: SITE.beschreibung,
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <ShopChrome>{children}</ShopChrome>
        </CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebSite",
          name: SITE.name, url: SITE.domain,
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${SITE.domain}/suche?q={suchbegriff}` },
            "query-input": "required name=suchbegriff",
          },
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "OnlineStore",
          name: SITE.name, url: SITE.domain, logo: `${SITE.domain}/logo.png`,
          description: SITE.beschreibung,
        }) }} />
      </body>
    </html>
  );
}
