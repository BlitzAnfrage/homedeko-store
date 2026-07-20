import type { MetadataRoute } from "next";
import { PRODUKTE, KATEGORIEN } from "@/lib/katalog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const statisch = ["", "/motive", "/versand",
    "/kategorie/leinwandbilder", "/kategorie/3er-sets", "/kategorie/fototapeten", "/kategorie/wallprints",
  ].map((p) => ({ url: SITE.domain + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));

  const kategorien = KATEGORIEN.map((k) => ({
    url: `${SITE.domain}/kategorie/${k.slug}`, changeFrequency: "weekly" as const, priority: 0.7,
  }));

  const produkte = PRODUKTE.map((p) => ({
    url: `${SITE.domain}/produkt/${p.id}`, changeFrequency: "weekly" as const, priority: 0.6,
  }));

  return [...statisch, ...kategorien, ...produkte];
}
