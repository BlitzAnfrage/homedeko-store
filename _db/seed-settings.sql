-- ═══════════════════════════════════════════════════════════════════════
-- Standard-Shop-Einstellungen. upsert-fähig: überschreibt nur, wenn noch
-- nicht vom Admin geändert (on conflict do nothing → Admin-Werte bleiben).
-- ═══════════════════════════════════════════════════════════════════════

insert into shop_settings (key, wert) values
  -- Versand & Schwellen
  ('versand', '{
    "frei_ab": 60,
    "kosten": 8,
    "ruecknahme_tage": 30,
    "newsletter_prozent": 10
  }'::jsonb),

  -- Firmen- & Kontaktdaten (fürs Impressum + Footer)
  ('firma', '{
    "name": "Homedeko Store",
    "inhaber": "",
    "strasse": "",
    "plz": "",
    "ort": "",
    "land": "Deutschland",
    "email": "",
    "telefon": "",
    "ustid": "",
    "registergericht": "",
    "hrb": "",
    "domain": "https://homedeko-store.de"
  }'::jsonb),

  -- Banner / kurze Texte
  ('texte', '{
    "banner": [
      "Versandkostenfrei ab 60 € (Deutschland)",
      "30 Tage Rückgaberecht — kostenlose Rücksendung",
      "Kauf auf Rechnung & Käuferschutz",
      "Fertig bespannt in Deutschland gefertigt"
    ],
    "claim": "Kunst für deine Wände",
    "seo_beschreibung": "Kuratierte Wandbilder: Leinwandbilder, 3er-Sets, Fototapeten und selbstklebende Wallprints. In Handarbeit veredelte Motive, fertig bespannt, ab 18 €."
  }'::jsonb),

  -- Rechtstexte (leer = Platzhalter im Shop; Admin füllt sie)
  ('rechtstexte', '{
    "impressum": "",
    "datenschutz": "",
    "agb": "",
    "widerruf": ""
  }'::jsonb)
on conflict (key) do nothing;

-- alte ungenutzte Einzelkeys aufräumen (durch "versand" ersetzt)
delete from shop_settings where key in ('versand_frei_ab', 'versand_kosten');
