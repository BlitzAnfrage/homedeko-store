-- ═══════════════════════════════════════════════════════════════════════
-- Admin v4: Add-ons (Upsells) + Mengenrabatt
-- ═══════════════════════════════════════════════════════════════════════

-- Add-ons: optionale Zusatzleistungen, die der Kunde im Warenkorb ankreuzt.
create table if not exists addons (
  id            uuid primary key default gen_random_uuid(),
  titel         text not null,               -- "Versicherter Versand"
  beschreibung  text not null default '',    -- kurzer Zusatztext
  preis         numeric not null default 0,  -- Aufpreis in €
  aktiv         boolean not null default true,
  vorausgewaehlt boolean not null default false, -- im Warenkorb schon angehakt?
  sortierung    int not null default 0,
  erstellt      timestamptz not null default now()
);

alter table addons enable row level security;
drop policy if exists "public read addons" on addons;
create policy "public read addons" on addons for select using (true);

-- Mengenrabatt-Staffel liegt in shop_settings (key='mengenrabatt') als JSON:
--   { aktiv: bool, nur_leinwand: bool, stufen: [{ab: 2, prozent: 20}, ...] }
insert into shop_settings (key, wert) values
  ('mengenrabatt', '{
    "aktiv": false,
    "nur_leinwand": false,
    "stufen": [
      {"ab": 2, "prozent": 20},
      {"ab": 3, "prozent": 30}
    ]
  }'::jsonb)
on conflict (key) do nothing;

-- Beispiel-Add-ons als Startvorlage (aktiv=false, damit nichts ungewollt live geht)
insert into addons (titel, beschreibung, preis, aktiv, sortierung) values
  ('Versicherter Versand', 'Volle Absicherung bei Transportschäden — Ersatz ohne Diskussion.', 8.99, false, 10),
  ('Geschenkverpackung', 'Hochwertig verpackt mit Grußkarte — perfekt zum Verschenken.', 4.90, false, 20),
  ('Express-Produktion', 'Deine Bestellung wird bevorzugt gefertigt und versendet.', 12.00, false, 30)
on conflict do nothing;
