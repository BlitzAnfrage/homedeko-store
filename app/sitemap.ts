import type { MetadataRoute } from "next";
import { KATEGORIEN } from "@/lib/katalog";
import { ladeKatalog } from "@/lib/katalog-db";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statisch = ["", "/motive", "/versand",
    "/kategorie/leinwandbilder", "/kategorie/3er-sets", "/kategorie/fototapeten", "/kategorie/wallprints",
  ].map((p) => ({ url: SITE.domain + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));

  const kategorien = KATEGORIEN.map((k) => ({
    url: `${SITE.domain}/kategorie/${k.slug}`, changeFrequency: "weekly" as const, priority: 0.7,
  }));

  // nur aktive (nicht ausgeblendete) Produkte in die Sitemap
  const produkte = (await ladeKatalog()).map((p) => ({
    url: `${SITE.domain}/produkt/${p.id}`, changeFrequency: "weekly" as const, priority: 0.6,
  }));

  return [...statisch, ...kategorien, ...produkte];
}
