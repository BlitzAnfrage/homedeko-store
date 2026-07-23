import type { MetadataRoute } from "next";
import { ladeSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await ladeSettings();
  const domain = s.firma.domain || SITE.domain;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/warenkorb", "/kasse", "/danke", "/suche"] }],
    sitemap: domain + "/sitemap.xml",
  };
}
