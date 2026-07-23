-- ═══════════════════════════════════════════════════════════════════════
-- Seed: Preisstaffeln + Shop-Settings aus dem Code-Katalog in die DB.
-- Motive werden separat per Skript geseedet (aus lib/katalog.ts).
-- upsert-fähig: bei erneutem Lauf werden Werte überschrieben.
-- ═══════════════════════════════════════════════════════════════════════

insert into shop_settings (key, wert) values
  ('versand_frei_ab', '60'::jsonb),
  ('versand_kosten', '8'::jsonb)
on conflict (key) do nothing;

insert into preisstaffeln (id, titel, produktart, sortierung, groessen) values
('LEINWAND_QUADRAT', 'Leinwand — Quadrat', 'leinwand', 10, '[
  {"label":"80 × 80 cm","b":80,"h":80,"preis":99},
  {"label":"100 × 100 cm","b":100,"h":100,"preis":149},
  {"label":"120 × 120 cm","b":120,"h":120,"preis":219,"beliebt":true},
  {"label":"140 × 140 cm","b":140,"h":140,"preis":299}
]'::jsonb),
('LEINWAND_QUER', 'Leinwand — Querformat', 'leinwand', 11, '[
  {"label":"80 × 50 cm","b":80,"h":50,"preis":69},
  {"label":"100 × 70 cm","b":100,"h":70,"preis":109},
  {"label":"120 × 80 cm","b":120,"h":80,"preis":149,"beliebt":true},
  {"label":"140 × 90 cm","b":140,"h":90,"preis":189}
]'::jsonb),
('POSTER_QUADRAT', 'Poster — Quadrat', 'poster', 20, '[
  {"label":"50 × 50 cm","b":50,"h":50,"preis":18},
  {"label":"60 × 60 cm","b":60,"h":60,"preis":22},
  {"label":"80 × 80 cm","b":80,"h":80,"preis":25,"beliebt":true},
  {"label":"100 × 100 cm","b":100,"h":100,"preis":29}
]'::jsonb),
('POSTER_DINA', 'Poster — DIN A', 'poster', 21, '[
  {"label":"DIN A3","b":42,"h":30,"preis":18},
  {"label":"DIN A2","b":59,"h":42,"preis":22},
  {"label":"DIN A1","b":84,"h":59,"preis":25,"beliebt":true},
  {"label":"DIN A0","b":119,"h":84,"preis":29}
]'::jsonb),
('SET3_QUADRAT', '3er-Set — Quadrat', 'set3', 30, '[
  {"label":"3 × 40 × 40 cm","b":40,"h":40,"preis":79},
  {"label":"3 × 50 × 50 cm","b":50,"h":50,"preis":99},
  {"label":"3 × 60 × 60 cm","b":60,"h":60,"preis":169,"beliebt":true},
  {"label":"3 × 70 × 70 cm","b":70,"h":70,"preis":229},
  {"label":"3 × 80 × 80 cm","b":80,"h":80,"preis":289},
  {"label":"3 × 90 × 90 cm","b":90,"h":90,"preis":329}
]'::jsonb),
('SET3_PANORAMA', '3er-Set — Panorama', 'set3', 31, '[
  {"label":"3 × 40 × 20 cm","b":40,"h":20,"preis":79},
  {"label":"3 × 60 × 20 cm","b":60,"h":20,"preis":69},
  {"label":"3 × 70 × 30 cm","b":70,"h":30,"preis":89},
  {"label":"3 × 60 × 30 cm","b":60,"h":30,"preis":99},
  {"label":"3 × 90 × 30 cm","b":90,"h":30,"preis":139},
  {"label":"3 × 80 × 40 cm","b":80,"h":40,"preis":159},
  {"label":"3 × 120 × 40 cm","b":120,"h":40,"preis":159,"beliebt":true},
  {"label":"3 × 100 × 40 cm","b":100,"h":40,"preis":189},
  {"label":"3 × 120 × 50 cm","b":120,"h":50,"preis":269}
]'::jsonb),
('TAPETE', 'Fototapete', 'tapete', 40, '[
  {"label":"180 × 120 cm","b":180,"h":120,"preis":79},
  {"label":"225 × 150 cm","b":225,"h":150,"preis":109},
  {"label":"270 × 180 cm","b":270,"h":180,"preis":149},
  {"label":"300 × 200 cm","b":300,"h":200,"preis":179,"beliebt":true},
  {"label":"330 × 220 cm","b":330,"h":220,"preis":209},
  {"label":"360 × 240 cm","b":360,"h":240,"preis":239},
  {"label":"390 × 260 cm","b":390,"h":260,"preis":269}
]'::jsonb),
('WALLPRINT', 'Wallprint (selbstklebend)', 'wallprint', 50, '[
  {"label":"120 × 80 cm","b":120,"h":80,"preis":69},
  {"label":"150 × 100 cm","b":150,"h":100,"preis":79},
  {"label":"180 × 120 cm","b":180,"h":120,"preis":89},
  {"label":"225 × 150 cm","b":225,"h":150,"preis":129,"beliebt":true},
  {"label":"270 × 180 cm","b":270,"h":180,"preis":169},
  {"label":"300 × 200 cm","b":300,"h":200,"preis":199},
  {"label":"330 × 220 cm","b":330,"h":220,"preis":239},
  {"label":"360 × 240 cm","b":360,"h":240,"preis":269},
  {"label":"390 × 260 cm","b":390,"h":260,"preis":299}
]'::jsonb)
on conflict (id) do update set
  titel = excluded.titel, produktart = excluded.produktart,
  sortierung = excluded.sortierung, groessen = excluded.groessen,
  aktualisiert = now();
