import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import ShopChrome from "@/components/ShopChrome";
import { ladeSettings } from "@/lib/settings";
import { ladeAktiveAddons } from "@/lib/addons";
import { hatStripe } from "@/lib/zahlung";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await ladeSettings();
  const domain = s.firma.domain || SITE.domain;
  const name = s.firma.name || "Homedeko Store";
  const beschreibung = s.texte.seo_beschreibung || SITE.beschreibung;
  const titelDefault = `${name} — Leinwandbilder, Fototapeten & Wallprints`;
  return {
    metadataBase: new URL(domain),
    title: { default: titelDefault, template: `%s | ${name}` },
    description: beschreibung,
    icons: { icon: "/logo.png" },
    openGraph: {
      type: "website", siteName: name, title: titelDefault, description: beschreibung,
      url: domain, locale: "de_DE",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image", title: titelDefault, description: beschreibung, images: ["/og.jpg"],
    },
  };
}

/* Header-Banner + Footer-Firmendaten kommen aus der DB und sollen IMMER aktuell
   sein → Layout bei jedem Request rendern. Die einzelnen Seiten bleiben davon
   unberührt (die haben ihr eigenes ISR/SSG). */
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, addons] = await Promise.all([ladeSettings(), ladeAktiveAddons()]);
  return (
    <html lang="de">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <CartProvider
          versandFreiAb={settings.versand.frei_ab}
          versandKosten={settings.versand.kosten}
          addons={addons.map((a) => ({ id: a.id, titel: a.titel, beschreibung: a.beschreibung, preis: Number(a.preis), vorausgewaehlt: a.vorausgewaehlt }))}
          mengenrabatt={settings.mengenrabatt}
        >
          <ShopChrome
            banner={settings.texte.banner}
            firmaName={settings.firma.name}
            versandFreiAb={settings.versand.frei_ab}
            versandKosten={settings.versand.kosten}
            stripeAktiv={hatStripe()}
          >
            {children}
          </ShopChrome>
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
