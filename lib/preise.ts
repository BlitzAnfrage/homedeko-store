/* Pricing-Engine Homedeko Store
   ALLE Preise stammen 1:1 aus „HDS Maße_Preise 26.pdf" (Juli 2026) — keine erfundenen
   Zahlen, keine Fake-Streichpreise. Versand DT: frei ab 60 €, darunter 8 €. */

export type Groesse = {
  label: string;      // z. B. "120 × 80 cm" oder "3 × 60 × 60 cm" oder "DIN A1"
  b?: number;         // Breite cm (Einzelpanel)
  h?: number;         // Höhe cm
  preis: number;      // Euro
  beliebt?: boolean;  // Merchandising-Markierung „Beliebteste Größe"
};

export type Produktart = "leinwand" | "poster" | "tapete" | "wallprint" | "set3";

export const VERSAND_FREI_AB = 60;
export const VERSAND_KOSTEN = 8;

/* ── Leinwandbilder ────────────────────────────────────────────── */
export const LEINWAND_QUADRAT: Groesse[] = [
  { label: "80 × 80 cm", b: 80, h: 80, preis: 99 },
  { label: "100 × 100 cm", b: 100, h: 100, preis: 149 },
  { label: "120 × 120 cm", b: 120, h: 120, preis: 219, beliebt: true },
  { label: "140 × 140 cm", b: 140, h: 140, preis: 299 },
];

/* Serie 14:9 — für Querformat-Motive (z. B. 3:2) */
export const LEINWAND_QUER: Groesse[] = [
  { label: "80 × 50 cm", b: 80, h: 50, preis: 69 },
  { label: "100 × 70 cm", b: 100, h: 70, preis: 109 },
  { label: "120 × 80 cm", b: 120, h: 80, preis: 149, beliebt: true },
  { label: "140 × 90 cm", b: 140, h: 90, preis: 189 },
];

/* ── Poster (120 g Bilderdruck matt) ───────────────────────────── */
export const POSTER_QUADRAT: Groesse[] = [
  { label: "50 × 50 cm", b: 50, h: 50, preis: 18 },
  { label: "60 × 60 cm", b: 60, h: 60, preis: 22 },
  { label: "80 × 80 cm", b: 80, h: 80, preis: 25, beliebt: true },
  { label: "100 × 100 cm", b: 100, h: 100, preis: 29 },
];

export const POSTER_DINA: Groesse[] = [
  { label: "DIN A3", b: 42, h: 30, preis: 18 },
  { label: "DIN A2", b: 59, h: 42, preis: 22 },
  { label: "DIN A1", b: 84, h: 59, preis: 25, beliebt: true },
  { label: "DIN A0", b: 119, h: 84, preis: 29 },
];

/* ── 3er-Kombis (3 Leinwände) ──────────────────────────────────── */
export const SET3_QUADRAT: Groesse[] = [
  { label: "3 × 40 × 40 cm", b: 40, h: 40, preis: 79 },
  { label: "3 × 50 × 50 cm", b: 50, h: 50, preis: 99 },
  { label: "3 × 60 × 60 cm", b: 60, h: 60, preis: 169, beliebt: true },
  { label: "3 × 70 × 70 cm", b: 70, h: 70, preis: 229 },
  { label: "3 × 80 × 80 cm", b: 80, h: 80, preis: 289 },
  { label: "3 × 90 × 90 cm", b: 90, h: 90, preis: 329 },
];

export const SET3_PANORAMA: Groesse[] = [
  { label: "3 × 40 × 20 cm", b: 40, h: 20, preis: 79 },
  { label: "3 × 60 × 20 cm", b: 60, h: 20, preis: 69 },
  { label: "3 × 70 × 30 cm", b: 70, h: 30, preis: 89 },
  { label: "3 × 60 × 30 cm", b: 60, h: 30, preis: 99 },
  { label: "3 × 90 × 30 cm", b: 90, h: 30, preis: 139 },
  { label: "3 × 80 × 40 cm", b: 80, h: 40, preis: 159 },
  { label: "3 × 120 × 40 cm", b: 120, h: 40, preis: 159, beliebt: true },
  { label: "3 × 100 × 40 cm", b: 100, h: 40, preis: 189 },
  { label: "3 × 120 × 50 cm", b: 120, h: 50, preis: 269 },
];

/* ── Fototapeten ───────────────────────────────────────────────── */
export const TAPETE: Groesse[] = [
  { label: "180 × 120 cm", b: 180, h: 120, preis: 79 },
  { label: "225 × 150 cm", b: 225, h: 150, preis: 109 },
  { label: "270 × 180 cm", b: 270, h: 180, preis: 149 },
  { label: "300 × 200 cm", b: 300, h: 200, preis: 179, beliebt: true },
  { label: "330 × 220 cm", b: 330, h: 220, preis: 209 },
  { label: "360 × 240 cm", b: 360, h: 240, preis: 239 },
  { label: "390 × 260 cm", b: 390, h: 260, preis: 269 },
];

export const WALLPRINT: Groesse[] = [
  { label: "120 × 80 cm", b: 120, h: 80, preis: 69 },
  { label: "150 × 100 cm", b: 150, h: 100, preis: 79 },
  { label: "180 × 120 cm", b: 180, h: 120, preis: 89 },
  { label: "225 × 150 cm", b: 225, h: 150, preis: 129, beliebt: true },
  { label: "270 × 180 cm", b: 270, h: 180, preis: 169 },
  { label: "300 × 200 cm", b: 300, h: 200, preis: 199 },
  { label: "330 × 220 cm", b: 330, h: 220, preis: 239 },
  { label: "360 × 240 cm", b: 360, h: 240, preis: 269 },
  { label: "390 × 260 cm", b: 390, h: 260, preis: 299 },
];

export function euro(n: number): string {
  return (n ?? 0).toLocaleString("de-DE") + " €";
}

export function versandkosten(warenwert: number): number {
  return warenwert >= VERSAND_FREI_AB ? 0 : VERSAND_KOSTEN;
}

/* Produktinfos aus der HDS-PDF (Standardtexte) */
export const INFO_LEINWAND = {
  eigenschaften: ["Fertig bespannt", "Inkl. Zacken-Aufhänger"],
  material: ["Echtholzrahmen Kiefer, ca. 2 cm", "Struktur-Leinengewebe"],
  druck: ["Licht- und UV-beständig", "Reflexionsfrei", "Brillante Motivwiedergabe"],
  pflege: ["Mit trockenem Baumwolltuch abwischbar"],
};

export const INFO_TAPETE = {
  material: [
    "Vliestapete aus Zellstoff- und Textilfasern, kombiniert mit polymeren Bindemitteln",
    "195 g hochwertiger Qualitätsdruck auf ERFURT-Digitalvlies (kratz-, scheuer- und reißfest)",
  ],
  druck: ["Auflösung: 150 dpi", "Beschnitt: 3 mm (umlaufend)"],
  verarbeitung: [
    "Exzellentes Nahtverhalten und dimensionsstabil",
    "Lässt sich mit handelsüblichem Kleister verarbeiten",
    "Verarbeitung im Kleistergerät möglich",
    "Bahnbreite: 150 cm — breitere Motive werden in Bahnen gedruckt",
  ],
};

export const INFO_WALLPRINT = {
  material: [
    "150 g hochwertiger Qualitätsdruck auf Vliestapete, weiß (PVC-frei)",
    "Vliestapete aus Zellstoff- und Textilfasern, kombiniert mit polymeren Bindemitteln",
  ],
  druck: ["Auflösung: 150 dpi", "Beschnitt: 3 mm (umlaufend)"],
  verarbeitung: [
    "Selbstklebend: Schutzfolie abziehen und anbringen",
    "Auf staubfreien, tragfähigen Untergrund achten",
    "Exzellentes Nahtverhalten und dimensionsstabil",
    "Bahnbreite: 120 cm — breitere Motive werden in Bahnen gedruckt",
  ],
};
