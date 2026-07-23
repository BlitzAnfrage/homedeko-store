-- ═══════════════════════════════════════════════════════════════════════
-- Admin v3: Varianten je Motiv einzeln ausschalten
-- ═══════════════════════════════════════════════════════════════════════

-- Ausgeschaltete Produkt-Varianten. Ist ein (motiv_slug, art)-Paar hier
-- eingetragen, existiert diese Variante im Shop NICHT (nicht kaufbar, keine
-- Produktseite, kein "auch als"-Link). Standard = alle 4 Varianten aktiv.
create table if not exists variante_aus (
  key         text primary key,           -- "<motivSlug>::<art>"
  motiv_slug  text not null,
  art         text not null,
  erstellt    timestamptz not null default now()
);

alter table variante_aus enable row level security;
drop policy if exists "public read variante_aus" on variante_aus;
create policy "public read variante_aus" on variante_aus for select using (true);
