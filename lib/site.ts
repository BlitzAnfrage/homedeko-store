/* Zentrale Shop-Konfiguration Homedeko Store */
export const SITE = {
  name: "Homedeko Store",
  claim: "Kunst für deine Wände",
  domain: "https://homedeko-store.de", // Platzhalter — vor Go-Live anpassen
  beschreibung:
    "Kuratierte Wandbilder: Leinwandbilder, 3er-Sets, Fototapeten und selbstklebende Wallprints. In Handarbeit veredelte Motive, fertig bespannt, ab 18 €.",
};

/* Rückgabefrist — Kundenversprechen über dem gesetzlichen Minimum. */
export const RUECKGABE_TAGE = 30;

/* Rotierende ECHTE Vorteile für die Aktionsleiste — keine erfundenen Rabatte. */
export const VORTEILE = [
  "Versandkostenfrei ab 60 € (Deutschland)",
  "30 Tage Rückgaberecht — kostenlose Rücksendung",
  "Kauf auf Rechnung & Käuferschutz",
  "Fertig bespannt in Deutschland gefertigt",
];

export const USPS = [
  { icon: "truck", titel: "Versandkostenfrei ab 60 €", text: "Innerhalb Deutschlands — darunter pauschal 8 €." },
  { icon: "frame", titel: "In Deutschland gefertigt", text: "In Handarbeit bespannt — Echtholzrahmen Kiefer, ca. 2 cm." },
  { icon: "shield", titel: "30 Tage Rückgaberecht", text: "Kostenlose Rücksendung — kein Risiko beim Kauf." },
  { icon: "lock", titel: "Kauf auf Rechnung", text: "Sicher zahlen mit Käuferschutz." },
];

/* Trust-Zeile (kompakt, für Header-Band / Footer / CTA) — nur belegbare Fakten. */
export const TRUST_ZEILE = [
  "Kauf auf Rechnung",
  "Käuferschutz",
  "30 Tage Rückgaberecht",
  "In Deutschland gefertigt",
  "Versandkostenfrei ab 60 €",
];

/* Verfügbare Zahlungsarten (für Logo-Reihe). */
export const ZAHLARTEN = ["rechnung", "paypal", "klarna", "visa", "mastercard", "applepay"] as const;
