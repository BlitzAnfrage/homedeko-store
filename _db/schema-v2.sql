-- ═══════════════════════════════════════════════════════════════════════
-- Homedeko Admin v2: Preis-Ausnahmen, eigene Motive, Bild-Overrides
-- Idempotent.
-- ═══════════════════════════════════════════════════════════════════════

-- ── Preis-Ausnahmen pro Motiv+Produktart ───────────────────────────────
-- Standard bleibt die zentrale Preisstaffel. Hier NUR Abweichungen:
-- key = "<motivSlug>::<art>" (z.B. "goldtattoo::leinwand"),
-- wert = komplettes groessen-Array, das die Staffel für dieses eine Produkt ersetzt.
create table if not exists preis_override (
  key         text primary key,          -- "<slug>::<art>"
  motiv_slug  text not null,
  art         text not null,             -- leinwand|poster|set3|tapete|wallprint
  groessen    jsonb not null default '[]',
  aktualisiert timestamptz not null default now()
);

-- ── Bild-Overrides / eigene Bilder pro Motiv ───────────────────────────
-- Ersetzt/ergänzt die aus dem Code-Manifest stammenden Bilder eines Motivs.
-- Liegt getrennt, damit Code-Motive und eigene Motive gleich behandelt werden.
create table if not exists motiv_bilder (
  id          uuid primary key default gen_random_uuid(),
  motiv_slug  text not null,
  url         text not null,             -- öffentliche Storage-URL
  typ         text not null default 'ans', -- ans|wb|det
  sortierung  int not null default 0,
  erstellt    timestamptz not null default now()
);
create index if not exists idx_motiv_bilder_slug on motiv_bilder (motiv_slug, sortierung);

-- ── Eigene (im Admin neu angelegte) Motive ─────────────────────────────
-- Code-Motive bleiben in lib/katalog.ts; NEUE Motive leben nur hier.
create table if not exists eigene_motive (
  slug        text primary key,
  name        text not null,
  untertitel  text not null default '',
  intro       text not null default '',
  format      text not null default 'quadrat',  -- quadrat|quer
  kategorien  jsonb not null default '[]',
  bestseller  boolean not null default false,
  aktiv       boolean not null default true,
  erstellt    timestamptz not null default now()
);

-- ── RLS ────────────────────────────────────────────────────────────────
alter table preis_override enable row level security;
alter table motiv_bilder  enable row level security;
alter table eigene_motive enable row level security;

drop policy if exists "public read preis_override" on preis_override;
create policy "public read preis_override" on preis_override for select using (true);

drop policy if exists "public read motiv_bilder" on motiv_bilder;
create policy "public read motiv_bilder" on motiv_bilder for select using (true);

drop policy if exists "public read eigene_motive" on eigene_motive;
create policy "public read eigene_motive" on eigene_motive for select using (true);
