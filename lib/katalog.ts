/* Katalog Homedeko Store — 24 Motive × 4 Produktarten ≈ 96 Produkte.
   Motivnamen stammen aus den HDS-Bilddateien; mit „abgeleitet: true“ markierte
   Namen wurden aus dem Motiv abgeleitet, weil die Lieferdaten keinen deutschen
   Namen enthielten (bitte vom Kunden bestätigen lassen). */
import bilder from "./bilder.generated.json";
import {
  Groesse, Produktart, LEINWAND_QUADRAT, LEINWAND_QUER, POSTER_QUADRAT,
  POSTER_DINA, SET3_QUADRAT, SET3_PANORAMA, TAPETE, WALLPRINT,
} from "./preise";

export type Ansicht = { key: string; typ: string; w: number; h: number; big: string; klein: string };

export type Motiv = {
  slug: string;
  name: string;
  untertitel: string;
  format: "quadrat" | "quer";
  kategorien: string[];
  intro: string;          // Unikat-Text je Motiv
  bestseller?: boolean;
  abgeleitet?: boolean;   // Name wurde von uns abgeleitet, nicht aus Lieferdaten
};

export const MOTIVE: Motiv[] = [
  {
    slug: "goldtattoo", name: "Goldtattoo", untertitel: "Goldenes Ornament auf schwarzem Schiefer",
    format: "quadrat", kategorien: ["gold-glanz", "mandalas-ornamente"], bestseller: true,
    intro: "Ein flügelartiges Ornament in schimmerndem Gold liegt auf tiefschwarzem Schiefergrund — „Goldtattoo“ ist das Statement-Piece für Wohnzimmer, Flur oder Schlafzimmer mit dunkler Wand. Die metallischen Verläufe von sattem Gold bis zu hellem Roségold geben dem Motiv je nach Lichteinfall eine andere Tiefe.",
  },
  {
    slug: "edle-waffe", name: "Edle Waffe", untertitel: "Steinschlosspistole & Kalligrafie in Stahlblau",
    format: "quadrat", kategorien: ["vintage-nostalgie"], bestseller: true,
    intro: "Eine historische Steinschlosspistole verschmilzt mit barocker Kalligrafie und rissiger Wandtextur zu einem düster-eleganten Vintage-Motiv in Stahlblau und Sepia. „Edle Waffe“ wirkt wie ein Fundstück aus einer alten Sammlung — perfekt für Arbeitszimmer, Bibliothek oder Herrenzimmer.",
  },
  {
    slug: "antikes-pistolenpaar", name: "Antikes Pistolenpaar", untertitel: "Zwei Steinschlosspistolen auf Kupfergrund",
    format: "quadrat", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Zwei kunstvoll verzierte Steinschlosspistolen ruhen übereinander auf einem Grund aus verwittertem Kupfer und Rost — durchzogen von feinen Schriftzügen wie aus einem alten Manuskript. Ein warmes, maskulines Sammlerstück-Motiv in Kupfer, Braun und Cognac.",
  },
  {
    slug: "gute-zeiten", name: "Gute Zeiten", untertitel: "Antike Reiseuhr in Silber & Gold",
    format: "quadrat", kategorien: ["vintage-nostalgie"], bestseller: true,
    intro: "Das fein gravierte Zifferblatt einer antiken Reiseuhr, gerahmt von vergoldeten Ornamenten, auf hellem Marmorgrund. „Gute Zeiten“ bringt leise Nostalgie und edle Materialität an die Wand — ein Motiv, das in Wohnzimmer wie Büro Ruhe ausstrahlt.",
  },
  {
    slug: "acht-nach-neun", name: "Acht nach neun", untertitel: "Barocke Prunkuhr auf rissigem Grund",
    format: "quadrat", kategorien: ["vintage-nostalgie"],
    intro: "Eine barocke Prunkuhr mit vergoldetem Sonnengesicht und römischem Zifferblatt steht vor einer dramatisch rissigen Wand in Weiß und Rostrot. „Acht nach neun“ ist das Motiv für alle, die Patina lieben — opulent, warm und voller Details, die man erst beim zweiten Hinsehen entdeckt.",
  },
  {
    slug: "collage-barocktisch", name: "Collage Barocktisch", untertitel: "Vergoldete Schnitzkunst & Kalligrafie",
    format: "quadrat", kategorien: ["vintage-nostalgie", "gold-glanz"],
    intro: "Die vergoldete Zarge eines barocken Konsolentischs mit Marmorplatte, überlagert von zarter Spitze und goldener Kalligrafie auf cremefarbenem Grund. Eine helle, festliche Collage, die Altbau-Charme und Schlossflair in moderne Räume holt.",
  },
  {
    slug: "bouton-vintage-eins", name: "Bouton Vintage – Eins", untertitel: "Verwitterte Blütenrosette auf Altholz",
    format: "quadrat", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Eine geschnitzte Blütenrosette, von Zeit und Wetter gezeichnet, auf grauem Altholz mit abblätternder Farbe. Das Motiv lebt von seiner ehrlichen Patina — Shabby-Chic in seiner edelsten Form, ideal zu Landhaus- und Vintage-Einrichtungen.",
  },
  {
    slug: "bouton-vintage-zwei", name: "Bouton Vintage – Zwei", untertitel: "Antiker Sammlerknopf in Stahlblau",
    format: "quadrat", kategorien: ["vintage-nostalgie"],
    intro: "Ein antiker Knopf aus Stahl und Perlmutt in extremer Vergrößerung: Die gefächerte Rosette mit funkelndem Strass-Kern wird zum grafischen Kunstwerk in kühlem Blaugrau. Ein ungewöhnliches Detail-Motiv, das Betrachter regelmäßig rätseln lässt — und genau deshalb im Gedächtnis bleibt.",
  },
  {
    slug: "bouton-vintage-drei", name: "Bouton Vintage – Drei", untertitel: "Sternenknopf mit Perlmutt-Sonne",
    format: "quadrat", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Ein sternenübersäter Metallknopf mit strahlender Perlmutt-Blüte im Zentrum — fotografiert wie ein Schmuckstück, inszeniert wie eine kleine Sonne. Die warmen Kupfer- und Silbertöne machen „Bouton Vintage – Drei“ zum charmanten Blickfang in Flur, Küche oder Ankleide.",
  },
  {
    slug: "geometrie-eins", name: "Geometrie Eins", untertitel: "Rotes Ornament-Mandala",
    format: "quadrat", kategorien: ["mandalas-ornamente"], bestseller: true,
    intro: "Ein fein gezeichnetes Mandala aus verschlungenen Ornamenten glüht in satten Rot- und Pinktönen. „Geometrie Eins“ bringt Energie und Wärme in jeden Raum — besonders stark über Sofa oder Bett als Farbakzent auf neutraler Wand.",
  },
  {
    slug: "rosette-pink-orange", name: "Rosette in Pink und Orange", untertitel: "Mandala auf leuchtendem Farbnebel",
    format: "quadrat", kategorien: ["mandalas-ornamente"],
    intro: "Dasselbe kunstvolle Ornament, neu erzählt: Vor einem funkelnden Farbnebel aus Türkis, Violett, Pink und Orange entfaltet sich die Rosette wie ein Feuerwerk. Ein Motiv mit Galaxie-Tiefe, das moderne und Boho-Einrichtungen gleichermaßen trägt.",
  },
  {
    slug: "rosette-tuerkis", name: "Rosette Türkis", untertitel: "Steinrelief in Türkis & Mint",
    format: "quadrat", kategorien: ["mandalas-ornamente"],
    intro: "Ein gemeißeltes Blütenrelief, getaucht in leuchtendes Türkis mit feinen Rissen und Verwitterungsspuren. Die Mischung aus Stein-Textur und Wasserfarben-Frische macht „Rosette Türkis“ zum perfekten Motiv für Bad, Schlafzimmer und alle Räume, die Ruhe vertragen.",
  },
  {
    slug: "kreismuster", name: "Kreismuster", untertitel: "Grafische Spiralen in Smaragd & Petrol",
    format: "quadrat", kategorien: ["mandalas-ornamente", "abstrakt-modern"],
    intro: "Unzählige konzentrische Kreise überlagern sich zu einem hypnotischen Muster in Smaragd, Petrol und Türkis. „Kreismuster“ ist Grafik-Design fürs Wohnzimmer — lebendig, ohne unruhig zu werden, und ein starker Partner für Holz und Messing.",
  },
  {
    slug: "rosette-fresko", name: "Rosette Fresko", untertitel: "Tempeldecke in warmem Terrakotta",
    format: "quadrat", kategorien: ["mandalas-ornamente", "ferne-welten"],
    intro: "Wie der Blick nach oben in einer alten Tempelkuppel: Steinerne Ornamentringe kreisen um eine zentrale Blüte, übergossen von warmem Terrakotta- und Goldlicht, durchsetzt mit historischen Schriftspuren. Ein Motiv wie eine Reiseerinnerung — warm, erdig, zeitlos.",
  },
  {
    slug: "stucco-ceiling", name: "Stucco Ceiling", untertitel: "Stuckdecke der Alhambra, Granada",
    format: "quadrat", kategorien: ["mandalas-ornamente", "ferne-welten"],
    intro: "Die weltberühmte Muqarnas-Stuckdecke aus dem Patio de los Leones der Alhambra in Granada — ein Wunderwerk maurischer Baukunst in Creme, Gold und Königsblau. Architektur-Liebhaber bekommen hier ein Stück Weltkulturerbe an die eigene Wand.",
  },
  {
    slug: "arabische-tueren", name: "Arabische Türen", untertitel: "Orientalische Holzpaneele in Orange",
    format: "quadrat", kategorien: ["ferne-welten"], bestseller: true,
    intro: "Kunstvoll intarsierte Türflügel mit orientalischen Sternmustern, getaucht in glühendes Orange und warmes Kupfer. „Arabische Türen“ bringt die Wärme eines Souks nach Hause — ein Motiv, das mit Rattan, Leder und dunklem Holz großartig harmoniert.",
  },
  {
    slug: "fernoestlicher-tempel-eins", name: "Fernöstlicher Tempel Eins", untertitel: "Glockenpavillon in Rostrot — Querformat",
    format: "quer", kategorien: ["ferne-welten"],
    intro: "Ein chinesischer Glockenpavillon mit geschwungenem Dach, eingebettet in dramatisch verwitterte Wandtexturen in Rostrot und Umbra. Das einzige Querformat-Motiv unserer Kollektion — wie gemacht für die breite Wand über dem Sideboard oder Bett.",
  },
  {
    slug: "tausend-arme", name: "Tausend Arme", untertitel: "Goldene Guanyin-Statue",
    format: "quadrat", kategorien: ["ferne-welten", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Die tausendarmige Guanyin in schimmerndem Gold, aufgefächert wie ein Pfauenrad vor erdigem Grund. Ein kraftvolles, spirituelles Motiv für Yoga-Raum, Schlafzimmer oder Eingangsbereich — Ruhe und Opulenz in einem Bild.",
  },
  {
    slug: "rosa-rose-struktur", name: "Rosa Rose Struktur", untertitel: "Rosenblüte auf Büttenpapier",
    format: "quadrat", kategorien: ["blumen-natur"],
    intro: "Eine voll erblühte Rose in sattem Rosa, verschmolzen mit der Knitterstruktur handgeschöpften Papiers. Das Motiv wirkt wie ein übermaltes Aquarell — romantisch, aber mit moderner Textur, ideal für Schlafzimmer und Ankleide.",
  },
  {
    slug: "bluetentraum-grunge", name: "Blütentraum Grunge", untertitel: "Pfingstrosen auf Terrakotta-Grund",
    format: "quadrat", kategorien: ["blumen-natur"], bestseller: true,
    intro: "Üppige Pfingstrosen in Magenta und Beerenrot leuchten vor einem verwitterten Grund aus Terrakotta, Apricot und dunklem Weinrot. „Blütentraum Grunge“ verbindet Blumenromantik mit rauer Textur — erhältlich in heller und dunkler Bildstimmung.",
  },
  {
    slug: "bunte-kreise", name: "Bunte Kreise", untertitel: "Farbtupfen in Orange, Rot & Gold",
    format: "quadrat", kategorien: ["abstrakt-modern"],
    intro: "Hunderte Farbtupfen in Orange, Rot, Koralle und Gold verdichten sich zu einem warmen Farbteppich mit Craquelé-Struktur. Ein fröhliches, energiegeladenes Abstrakt-Motiv, das Küche, Esszimmer und Kinderzimmer sofort freundlicher macht.",
  },
  {
    slug: "simple-streifen", name: "Simple Streifen – aber schön", untertitel: "Chevron-Grafik in Gelb & Schwarz",
    format: "quadrat", kategorien: ["abstrakt-modern"],
    intro: "Fischgrät-Streifen in leuchtendem Gelb, Orange und Tiefschwarz, gebrochen durch Grunge-Texturen — Industrial-Grafik mit Augenzwinkern. Der Name ist Programm: simpel, aber mit enormer Wirkung, besonders in modernen Lofts und Arbeitszimmern.",
  },
  {
    slug: "elemente-des-lebens", name: "Elemente des Lebens", untertitel: "Organische Zellstruktur in Gold & Grün",
    format: "quadrat", kategorien: ["abstrakt-modern"],
    intro: "Wie unter dem Mikroskop: Organische Zellen aus flüssiger Farbe fließen in Gold, Oliv, Smaragd und Türkis ineinander. „Elemente des Lebens“ ist moderne Fluid-Art mit Tiefenwirkung — ein ruhiger, edler Farbakzent für Wohnzimmer und Praxis.",
  },
  {
    slug: "abstrakt-fliessend", name: "Abstrakt Fließend", untertitel: "Fluid-Art in Gold & Perlweiß",
    format: "quadrat", kategorien: ["abstrakt-modern", "gold-glanz"], bestseller: true,
    intro: "Flüssiges Gold trifft auf Perlweiß und Bronze: Marmorierte Farbströme fließen über die Leinwand wie geschmolzenes Edelmetall. Ein Luxus-Motiv ohne Kitsch — die perfekte Wahl über Sideboard, Kamin oder Bett, wenn es edel und modern zugleich sein soll.",
  },
];

/* ── Kategorien (Motiv-Welten) ─────────────────────────────────── */
export type Kategorie = { slug: string; name: string; claim: string; beschreibung: string };

/* Welt-Farben (BRANDING.md): jede Motiv-Welt trägt ihre Farbe in Chips,
   Kategorie-Headern und Mega-Menü — Text (fg) auf zartem Tint (bg). */
export const WELT_FARBEN: Record<string, { fg: string; bg: string }> = {
  "gold-glanz": { fg: "#8a6626", bg: "#f5edda" },
  "mandalas-ornamente": { fg: "#7c2237", bg: "#f7e9ec" },
  "vintage-nostalgie": { fg: "#7c5e3c", bg: "#f3ece1" },
  "blumen-natur": { fg: "#a34468", bg: "#f9ecf2" },
  "abstrakt-modern": { fg: "#4a5568", bg: "#eceef1" },
  "ferne-welten": { fg: "#b05a37", bg: "#f8ece5" },
};

export const KATEGORIEN: Kategorie[] = [
  { slug: "gold-glanz", name: "Gold & Glanz", claim: "Edle Metallic-Motive mit Tiefenwirkung",
    beschreibung: "Motive mit Gold, Bronze und Metallic-Verläufen — von Fluid-Art bis Ornament. Diese Bilder leben vom Licht: Je nach Tageszeit schimmern sie anders und geben dunklen wie hellen Wänden sofort Galerie-Charakter." },
  { slug: "mandalas-ornamente", name: "Mandalas & Ornamente", claim: "Kunstvolle Rosetten und Muster",
    beschreibung: "Fein gezeichnete Mandalas, historische Rosetten und grafische Muster — Motive mit Zentrum und Ruhe. Ideal für alle, die Symmetrie lieben: über dem Sofa, im Schlafzimmer oder als Paar im Flur." },
  { slug: "vintage-nostalgie", name: "Vintage & Nostalgie", claim: "Patina, Sammlerstücke, Geschichten",
    beschreibung: "Antike Uhren, historische Waffen, verwitterte Fundstücke: Motive mit Geschichte und Patina, fotografiert und veredelt wie Museumsstücke. Für Räume mit Charakter — Bibliothek, Arbeitszimmer, Altbau." },
  { slug: "blumen-natur", name: "Blumen & Natur", claim: "Florale Motive mit Textur",
    beschreibung: "Rosen und Pfingstrosen, verschmolzen mit Papier- und Grunge-Texturen — Blumenbilder ohne Kitsch. Romantik mit moderner Kante für Schlafzimmer, Ankleide und Wohnzimmer." },
  { slug: "abstrakt-modern", name: "Abstrakt & Modern", claim: "Farbe, Fluss und Grafik",
    beschreibung: "Fluid-Art, Farbtupfen, grafische Streifen: abstrakte Motive, die Farbe in den Raum bringen, ohne laut zu werden. Die einfachste Art, einer neutralen Einrichtung einen Charakter zu geben." },
  { slug: "ferne-welten", name: "Ferne Welten", claim: "Orient, Fernost & Weltarchitektur",
    beschreibung: "Von der Alhambra bis zum chinesischen Glockenpavillon: Motive, die Fernweh an die Wand bringen. Warme Erdtöne und Gold — perfekt zu Naturmaterialien wie Rattan, Leinen und dunklem Holz." },
];

/* ── Produktarten ──────────────────────────────────────────────── */
export const PRODUKTARTEN: Record<Produktart, { name: string; kurz: string; slugPrefix: string }> = {
  leinwand: { name: "Leinwandbild", kurz: "Leinwand", slugPrefix: "leinwandbild" },
  poster: { name: "Poster", kurz: "Poster", slugPrefix: "poster" },
  tapete: { name: "Fototapete", kurz: "Fototapete", slugPrefix: "fototapete" },
  wallprint: { name: "Wallprint (selbstklebend)", kurz: "Wallprint", slugPrefix: "wallprint" },
  set3: { name: "3er-Set Leinwand", kurz: "3er-Set", slugPrefix: "3er-set" },
};

export type Produkt = {
  id: string;              // z. B. “leinwandbild-goldtattoo”
  art: Produktart;
  motiv: Motiv;
  name: string;            // “Leinwandbild „Goldtattoo””
  groessen: Groesse[];
  posterGroessen?: Groesse[]; // nur bei art=leinwand: Poster im selben Angebotssatz
  ab: number;              // niedrigster Preis der Haupt-Ausführung
  posterAb?: number;       // niedrigster Poster-Preis (Angebotssatz-Hinweis)
  bilder: Ansicht[];
};

const manifest = bilder as Record<string, { views: Ansicht[] }>;

function groessenFuer(art: Produktart, format: "quadrat" | "quer"): Groesse[] {
  switch (art) {
    case "leinwand": return format === "quadrat" ? LEINWAND_QUADRAT : LEINWAND_QUER;
    case "poster": return format === "quadrat" ? POSTER_QUADRAT : POSTER_DINA;
    case "tapete": return TAPETE;
    case "wallprint": return WALLPRINT;
    case "set3": return format === "quadrat" ? SET3_QUADRAT : SET3_PANORAMA;
  }
}

function baueProdukt(motiv: Motiv, art: Exclude<Produktart, "poster">): Produkt {
  const groessen = groessenFuer(art, motiv.format);
  const posterGroessen = art === "leinwand" ? groessenFuer("poster", motiv.format) : undefined;
  const info = PRODUKTARTEN[art];
  return {
    id: `${info.slugPrefix}-${motiv.slug}`,
    art, motiv,
    name: `${info.name} „${motiv.name}“`,
    groessen, posterGroessen,
    ab: Math.min(...groessen.map((g) => g.preis)),
    posterAb: posterGroessen ? Math.min(...posterGroessen.map((g) => g.preis)) : undefined,
    bilder: manifest[motiv.slug]?.views ?? [],
  };
}

export const PRODUKTE: Produkt[] = MOTIVE.flatMap((m) =>
  (["leinwand", "set3", "tapete", "wallprint"] as const).map((art) => baueProdukt(m, art))
);

export function produktById(id: string): Produkt | undefined {
  return PRODUKTE.find((p) => p.id === id);
}

export function motivBySlug(slug: string): Motiv | undefined {
  return MOTIVE.find((m) => m.slug === slug);
}

export function produkteInKategorie(katSlug: string): Produkt[] {
  return PRODUKTE.filter((p) => p.motiv.kategorien.includes(katSlug));
}

export function produkteVonArt(art: Produktart): Produkt[] {
  return PRODUKTE.filter((p) => p.art === art);
}

export function hauptbild(p: Produkt): Ansicht | undefined {
  return p.bilder[0];
}

export function motivBild(slug: string): Ansicht | undefined {
  return manifest[slug]?.views[0];
}

export function motivWohnbild(slug: string): Ansicht | undefined {
  const views = manifest[slug]?.views ?? [];
  return views.find((v) => v.typ === "wb") ?? views[0];
}

export function wohnbild(p: Produkt): Ansicht | undefined {
  return p.bilder.find((b) => b.typ === "wb") ?? p.bilder[1] ?? p.bilder[0];
}

export function suche(begriff: string): Produkt[] {
  const q = begriff.toLowerCase().trim();
  if (!q) return [];
  const woerter = q.split(/\s+/);
  return PRODUKTE.filter((p) => {
    const text = [p.name, p.motiv.name, p.motiv.untertitel, p.motiv.intro,
      ...p.motiv.kategorien.map((k) => KATEGORIEN.find((x) => x.slug === k)?.name ?? "")]
      .join(" ").toLowerCase();
    return woerter.every((w) => text.includes(w));
  });
}
