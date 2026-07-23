-- ═══════════════════════════════════════════════════════════════════════
-- Homedeko Store — Admin-DB-Schema (Supabase / Postgres)
-- Idempotent: kann mehrfach ausgeführt werden.
-- ═══════════════════════════════════════════════════════════════════════

-- ── Preisstaffeln ──────────────────────────────────────────────────────
-- Ein Satz = eine benannte Serie (z.B. LEINWAND_QUADRAT). Die einzelnen
-- Größen liegen als JSONB-Array, damit die App sie 1:1 wie im Code nutzt.
create table if not exists preisstaffeln (
  id          text primary key,           -- z.B. "LEINWAND_QUADRAT"
  titel       text not null,              -- Anzeigename im Admin
  produktart  text not null,              -- leinwand|poster|set3|tapete|wallprint
  groessen    jsonb not null default '[]',-- [{label,b,h,preis,beliebt}]
  sortierung  int not null default 0,
  aktualisiert timestamptz not null default now()
);

-- ── Globale Shop-Einstellungen (Versand etc.) ──────────────────────────
create table if not exists shop_settings (
  key   text primary key,
  wert  jsonb not null
);

-- ── Motiv-Overrides ────────────────────────────────────────────────────
-- Nur Felder, die im Admin geändert werden, überschreiben den Code-Default.
-- So bleibt die Bild-/Katalog-Zuordnung im Code unangetastet.
create table if not exists motive_override (
  slug         text primary key,          -- entspricht MOTIVE[].slug
  name         text,                      -- null = Code-Default nutzen
  untertitel   text,
  intro        text,
  bestseller   boolean,                   -- null = Code-Default
  aktiv        boolean not null default true, -- false = im Shop ausgeblendet
  kategorien   jsonb,                     -- null = Code-Default
  aktualisiert timestamptz not null default now()
);

-- ── Rabattcodes ────────────────────────────────────────────────────────
create table if not exists rabattcodes (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,     -- z.B. "SOMMER10" (immer UPPERCASE)
  typ           text not null,            -- "prozent" | "fest"
  wert          numeric not null,         -- 10 = 10% oder 10 €
  mindestwert   numeric not null default 0,   -- Mindestbestellwert €
  aktiv         boolean not null default true,
  gueltig_ab    timestamptz,
  gueltig_bis   timestamptz,
  max_nutzungen int,                       -- null = unbegrenzt
  genutzt       int not null default 0,
  erstellt      timestamptz not null default now()
);

-- ── Bestellungen ───────────────────────────────────────────────────────
create table if not exists bestellungen (
  id         uuid primary key default gen_random_uuid(),
  nummer     text unique not null,
  status     text not null default 'neu', -- neu|bezahlt|versandt|storniert
  kunde      jsonb not null,
  items      jsonb not null,
  summe      numeric not null,
  versand    numeric not null default 0,
  rabatt_code text,
  rabatt_betrag numeric not null default 0,
  gesamt     numeric not null,
  zeitpunkt  timestamptz not null default now()
);

create index if not exists idx_bestellungen_zeit on bestellungen (zeitpunkt desc);
create index if not exists idx_bestellungen_status on bestellungen (status);

-- ── Row Level Security ─────────────────────────────────────────────────
-- Alle Admin-Zugriffe laufen serverseitig über den service_role-Key, der
-- RLS umgeht. Öffentliche (anon) Lesezugriffe erlauben wir gezielt dort,
-- wo der Shop-Frontend sie braucht (Preise, Motive, aktive Rabattcodes).
alter table preisstaffeln   enable row level security;
alter table shop_settings   enable row level security;
alter table motive_override enable row level security;
alter table rabattcodes     enable row level security;
alter table bestellungen    enable row level security;

-- Öffentliches Lesen: Preise, Settings, Motive (Shop rendert damit)
drop policy if exists "public read preise" on preisstaffeln;
create policy "public read preise" on preisstaffeln for select using (true);

drop policy if exists "public read settings" on shop_settings;
create policy "public read settings" on shop_settings for select using (true);

drop policy if exists "public read motive" on motive_override;
create policy "public read motive" on motive_override for select using (true);

-- Rabattcodes: anon darf NICHT die ganze Tabelle lesen (Codes wären sonst
-- alle sichtbar). Prüfung läuft serverseitig via service_role. Keine SELECT-Policy.

-- Bestellungen: kein öffentlicher Zugriff. Nur service_role (serverseitig).
