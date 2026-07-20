# Branding-Schema Homedeko Store

**Markenidee: „Galerie mit Gefühl"** — kuratierte Kunst, warm und sinnlich statt
steril. Die Farbwelt kommt direkt aus der Motiv-Kollektion (Bordeaux-Mandalas,
Gold-Ornamente, Terrakotta-Orient, Petrol-Rosetten, Rosé-Blüten).

## 1. Farbpalette

### Basis (ruhige Galerie-Bühne — Bilder sind die Stars)
| Token | Wert | Einsatz |
|---|---|---|
| `--bg` | `#faf7f2` | Seitenhintergrund (warmes Creme) |
| `--surface` | `#ffffff` | Karten, Header |
| `--ink` / `--ink-strong` | `#262019` / `#1a1511` | Text / Headlines, Preise |
| `--muted` | `#7a7166` | Nebentexte |
| `--line` | `#eae3d7` | Rahmen |

### Emotion & Verkauf
| Token | Wert | Bedeutung / Einsatz |
|---|---|---|
| `--bordeaux` | `#7c2237` (deep `#5e1a2a`) | **Markenfarbe Emotion**: Aktionsleiste, Favorit-Badges, italic Headline-Akzente |
| `--gold` | `#b18435` (bright `#caa04f`) | **Kauf-Farbe**: alle Kauf-CTAs, Eyebrows, Akzente |
| `--terra` | `#c06542` | Wärme: Ferne Welten, Panorama-Band |
| `--petrol` | `#256b70` | Frische/Kontrast: Abstrakt & Modern, Trust-Icons |
| `--rose` | `#b25277` | Sinnlichkeit: Blumen & Natur |
| `--sepia` | `#8a6a45` | Patina: Vintage & Nostalgie |
| `--ok` | `#2e7d43` | Ersparnis & Versandvorteil (immer grün, nie rot) |

### Welt-Farben (farbcodierte Motiv-Welten = Orientierung + Emotion)
Gold & Glanz → Gold · Mandalas & Ornamente → Bordeaux · Vintage & Nostalgie →
Sepia · Blumen & Natur → Rosé · Abstrakt & Modern → Petrol · Ferne Welten → Terra.
Chips, Kategorie-Header und Mega-Menü tragen die jeweilige Welt-Farbe (Text auf
`*-soft`-Tint). Quelle: `WELT_FARBEN` in `lib/katalog.ts`.

## 2. Typografie
- **Display: Playfair Display** — H1/H2, Preishighlights; *Italic* für emotionale
  Akzente und Sublines („*Wände, die Gefühle wecken.*")
- **UI/Fließtext: Inter** — Karten, Buttons, Navigation
- **Eyebrow**: 11px, versal, 0.22em Sperrung, Gold — über jeder Sektion
- Preise immer dunkel (`--ink-strong`), nie rot; Ersparnis-/Frei-Hinweise grün

## 3. Verkaufselemente (nur echte Aussagen)
1. **Aktionsleiste**: Bordeaux-Verlauf, Creme-Text, rotierende echte Vorteile,
   goldener „Bestseller →"-Link. Slot für echte Aktion mit Countdown vorbereitet.
2. **Größen-Kacheln mit Preis je Größe** + goldenes „Beliebt"-Badge (vorausgewählt)
3. **Poster-Anker**: grüner Hinweis „als Poster schon ab 18 €" auf jeder Leinwand-Karte
4. **Favorit-Badge** (Bordeaux) statt unbelegtem „Bestseller"-Claim
5. **Frachtfrei-Mechanik**: grüner Fortschrittsbalken im Warenkorb, Live-Hinweis in der Kaufbox
6. **Wohnraum-Inszenierung**: Hover-Bildwechsel auf Wohnbeispiel, Wohnbeispiel-Mosaik, Panorama-Band
7. **Trust-Stack am CTA**: Versandregel, UV-Druck, Widerrufsrecht (alles belegbar)

## 4. Stil-Regeln
- Karten weiß, 1-px-Rahmen, 6px-Radius, keine Schatten; Bild-Zoom nur sanft (1.04)
- Kein Rot im Kaufprozess; Urgency nur mit echten Daten
- Sektionen wechseln zwischen Creme, Weiß und zarten Farb-Tints (blush/gold-soft)
- Footer: Ink-Schwarz mit **Gradient-Brandlinie** (Bordeaux→Gold→Terra) als Abschluss
