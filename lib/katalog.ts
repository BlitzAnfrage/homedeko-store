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
  /* ── 59 neue Motive (WeTransfer-Lieferung) — Namen/Texte aus Motiv abgeleitet ── */
  {
    slug: "goldene-arabeske", name: "Goldene Arabeske", untertitel: "Barocke Ornamentbordüre auf Feuergrund",
    format: "quer", kategorien: ["gold-glanz", "mandalas-ornamente"], bestseller: true, abgeleitet: true,
    intro: "Ein warmes Zusammenspiel aus Bernstein, Rostorange und tiefem Rot, gerahmt von fein ziselierten Barock-Ornamenten in den Ecken. Der craquelierte Untergrund verleiht dem Motiv die Anmutung eines antiken, goldgeprägten Buchdeckels. Ein leuchtendes Statement-Stück, das Wohnzimmer und Eingangsbereich mit sattem Kolorit veredelt.",
  },
  {
    slug: "briefe-aus-fernen-tagen", name: "Briefe aus fernen Tagen", untertitel: "Dreiteilige Vintage-Collage mit Schrift und Briefmarken",
    format: "quer", kategorien: ["vintage-nostalgie", "abstrakt-modern"], abgeleitet: true,
    intro: "Ein dreiteiliges Ensemble aus alten Handschriften, brasilianischen Briefmarken und vergilbten Bankdokumenten in warmen Ocker- und Sepiatönen. Die Patina erzählt von Reisen, Korrespondenz und vergangenen Jahrzehnten. Perfekt für Arbeitszimmer, Bibliothek oder ein nostalgisch eingerichtetes Wohnzimmer.",
  },
  {
    slug: "helle-ranke", name: "Helle Ranke", untertitel: "Verschlungenes Ornament in Beige und Taupe",
    format: "quadrat", kategorien: ["mandalas-ornamente", "abstrakt-modern"], abgeleitet: true,
    intro: "Kunstvoll verschlungene Akanthus-Ranken in gedecktem Beige, Kupfer und Grau, gelegt auf einen hell verwitterten Steinuntergrund. Die zurückhaltende Farbigkeit wirkt edel und ruhig zugleich. Ein zeitloses Motiv für Schlafzimmer oder Flur, das jeden Raum sanft strukturiert.",
  },
  {
    slug: "obst-trio", name: "Obst-Trio", untertitel: "Birne, Weintrauben und Apfel in Aquarell",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Drei aquarellierte Fruchtstudien — eine goldene Birne, blaue Weintrauben und ein leuchtend roter Apfel — vereint zu einem harmonischen Triptychon. Die warmen Farben auf sanftem Hintergrund strahlen küchenwarme Behaglichkeit aus. Ein Klassiker für Küche und Essbereich.",
  },
  {
    slug: "rote-handschrift", name: "Rote Handschrift", untertitel: "Alte Schreibschrift auf glühendem Rot",
    format: "quadrat", kategorien: ["vintage-nostalgie", "abstrakt-modern"], abgeleitet: true,
    intro: "Geschwungene alte Schreibschrift in tiefem Schwarz auf einem lodernden Grund aus Rot und Orange. Die körnige Struktur und die verblassten Zeilen geben dem Motiv eine geheimnisvolle, fast dramatische Tiefe. Ein ausdrucksstarker Blickfang für moderne Wohn- und Arbeitsräume.",
  },
  {
    slug: "urban-rot", name: "Urban Rot", untertitel: "Dreiteilige Grunge-Collage in Rot und Schwarz",
    format: "quer", kategorien: ["abstrakt-modern", "vintage-nostalgie"], bestseller: true, abgeleitet: true,
    intro: "Ein dreiteiliges Grunge-Ensemble aus abgerissenen Plakaten, Schriftfragmenten und Schablonen-Ziffern in kraftvollem Rot und Schwarz. Die raue Streetart-Ästhetik bringt urbane Energie an die Wand. Ideal für loftartige Wohnräume, Studios und moderne Interieurs.",
  },
  {
    slug: "getuepfelter-zackenbarsch", name: "Getüpfelter Zackenbarsch", untertitel: "Historische Fischtafel Plectropoma maculatum",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Eine historische Fischtafel des blau getüpfelten Zackenbarsches Plectropoma maculatum, fein koloriert in Ocker- und Sandtönen. Das weiße Passepartout unterstreicht den edlen Charakter der alten Naturillustration. Ein maritimes Sammlerstück für Bad, Flur oder maritim gestaltete Räume.",
  },
  {
    slug: "oranger-korallenbarsch", name: "Oranger Korallenbarsch", untertitel: "Leuchtender Tropenfisch mit blauen Tupfen",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Ein leuchtend oranger Tropenfisch mit zarten blauen Tupfen und gelb gesäumten Flossen, gezeichnet als historische Naturstudie. Die kräftige Farbigkeit auf hellem Grund wirkt lebendig und dennoch nostalgisch. Ein Juwel aus der Südsee für helle Wohnräume und Badezimmer.",
  },
  {
    slug: "gruener-lippfisch", name: "Grüner Lippfisch", untertitel: "Historische Fischtafel Chilinus trilobatus",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Die historische Fischtafel Chilinus trilobatus zeigt einen prachtvollen Lippfisch mit smaragdgrünem Kopf, roten Musterungen und silbrig schimmernden Schuppen. Das feine Passepartout hebt die botanische Präzision der Illustration hervor. Ein farbenfrohes Naturstück für Wohnzimmer, Bad oder Studierzimmer.",
  },
  {
    slug: "goldener-buddha", name: "Goldener Buddha", untertitel: "Meditierender Buddha in warmem Goldlicht",
    format: "quadrat", kategorien: ["ferne-welten", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Ein meditierender Buddha in warmem Goldlicht, umgeben von kunstvoll geschnitzten Ornamenten und sanfter Patina. Die goldbraunen Töne strahlen Ruhe, Achtsamkeit und fernöstliche Gelassenheit aus. Ein harmonisches Motiv für Meditations- und Wellnessräume, Schlafzimmer oder ruhige Rückzugsorte.",
  },
  {
    slug: "bugatti-rennlegende", name: "Bugatti Rennlegende", untertitel: "Blauer Vorkriegs-Rennwagen auf Grunge-Blau",
    format: "quer", kategorien: ["vintage-nostalgie"], bestseller: true, abgeleitet: true,
    intro: "Ein blauer Vorkriegs-Rennwagen prescht aus einer Collage aus alten Poststempeln und vergilbten Dokumenten hervor. Kühle Blautöne treffen auf warme Patina und erzeugen eine kraftvolle, nostalgische Stimmung. Ein markantes Statement-Motiv für Herrenzimmer, Büro oder ein Wohnzimmer mit Charakter.",
  },
  {
    slug: "rote-dahlie-brief", name: "Rote Dahlie", untertitel: "Rote Dahlienblüte auf altem Schriftgrund",
    format: "quadrat", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Eine üppige Dahlienblüte in intensivem Rot entfaltet sich über handgeschriebenen Briefzeilen und alten Poststempeln. Das satte Karminrot verleiht dem Motiv Wärme und Leidenschaft, während die Vintage-Schrift für nostalgische Tiefe sorgt. Ein ausdrucksstarker Blickfang für Schlafzimmer, Flur oder Essbereich.",
  },
  {
    slug: "feuerdrache-naga", name: "Feuerdrache Naga", untertitel: "Asiatischer Drachenkopf in Feuer und Eis",
    format: "quadrat", kategorien: ["ferne-welten"], bestseller: true, abgeleitet: true,
    intro: "Ein kunstvoll geschnitzter asiatischer Drachenkopf erwacht zwischen glühender Lava und eisiger Steinstruktur zum Leben. Die dramatische Kombination aus feurigem Orange und kühlem Grau macht dieses Motiv zu einem mystischen Kraftpaket. Ideal für moderne Wohnräume, Loft oder als eindrucksvolles Solitär im Eingangsbereich.",
  },
  {
    slug: "barocke-standuhr", name: "Barocke Standuhr", untertitel: "Prunkvolle antike Uhr auf warmer Patina",
    format: "quadrat", kategorien: ["vintage-nostalgie", "gold-glanz"], abgeleitet: true,
    intro: "Eine prunkvolle barocke Standuhr mit goldener Figur und ziseliertem Gehäuse thront vor rissiger Wand und alten Schriftzeilen. Warme Rot-, Braun- und Goldtöne erzeugen eine würdevolle, historische Atmosphäre. Ein zeitloses Motiv für Wohnzimmer, Bibliothek oder klassisch eingerichtete Räume.",
  },
  {
    slug: "traumvogel", name: "Traumvogel", untertitel: "Zarter Vogel im Flug in weichem Blaugrau",
    format: "quer", kategorien: ["blumen-natur", "abstrakt-modern"], abgeleitet: true,
    intro: "Ein zarter Vogel breitet im weichen Blaugrau seine Flügel aus, umgeben von aquarellartig verschwimmenden Farbschleiern. Die traumhaft leichte, fast schwebende Stimmung wirkt beruhigend und poetisch. Perfekt für Schlafzimmer, Wellnessbereich oder ruhige Rückzugsorte.",
  },
  {
    slug: "zellen-im-aufbau-blau", name: "Zellstruktur Blau", untertitel: "Abstrakte Zellmuster in Türkis und Bernstein",
    format: "quadrat", kategorien: ["abstrakt-modern"], abgeleitet: true,
    intro: "Organische Zellstrukturen in leuchtendem Türkis, tiefem Blau und bernsteinfarbenen Akzenten fließen wie unter Wasser über die Fläche. Die abstrakte Fluid-Art-Optik erzeugt Tiefe und moderne Eleganz. Ein frischer Blickfang für Wohnzimmer, Bad oder ein modernes Büro.",
  },
  {
    slug: "packard-oldtimer", name: "Packard Oldtimer", untertitel: "Klassischer Packard vor warmer Patina",
    format: "quer", kategorien: ["vintage-nostalgie"], bestseller: true, abgeleitet: true,
    intro: "Ein eleganter Packard-Oldtimer glänzt in warmen Creme- und Kupfertönen vor einer rostig-patinierten Wand. Chromdetails und weiße Reifen erwecken den Glamour einer vergangenen Automobil-Ära. Ein stilvolles Panorama-Motiv für Herrenzimmer, Büro oder über das Sofa.",
  },
  {
    slug: "alhambra-ornament", name: "Alhambra Ornament", untertitel: "Orientalische Sternrosette in Rost und Gold",
    format: "quer", kategorien: ["ferne-welten", "mandalas-ornamente"], abgeleitet: true,
    intro: "Eine kunstvolle orientalische Sternrosette entfaltet ihre geometrische Präzision vor warmem Rost- und Goldgrund mit alten Schriftzeilen. Die maurische Ornamentik strahlt Wärme und morgenländischen Zauber aus. Ein edles Motiv für Wohnzimmer, Flur oder Räume mit orientalischem Flair.",
  },
  {
    slug: "liebende-typo", name: "Liebende", untertitel: "Abstraktes Gesichtsprofil in Rot und Sepia",
    format: "quer", kategorien: ["abstrakt-modern", "vintage-nostalgie"], abgeleitet: true,
    intro: "Aus rissiger Struktur und verschlungenen Schriftzeilen tritt ein zartes Gesichtsprofil hervor, umspielt von feurigem Rot und warmem Sepia. Die abstrakte Komposition erzählt leise von Nähe und Emotion. Ein romantisch-modernes Motiv für Schlafzimmer, Wohnzimmer oder intime Rückzugsräume.",
  },
  {
    slug: "antike-prunkuhr-triptychon", name: "Prunkuhr Triptychon", untertitel: "Antike Uhr auf Sepia, dreiteilig",
    format: "quer", kategorien: ["vintage-nostalgie", "gold-glanz"], abgeleitet: true,
    intro: "Eine kunstvoll verzierte antike Uhr mit goldenen Schnitzereien breitet sich über ein dreiteiliges Sepia-Arrangement voller architektonischer Andeutungen aus. Warme Braun- und Goldtöne verleihen dem Motiv nostalgische Würde. Ein imposantes Statement für Wohnzimmer, Bibliothek oder Eingangsbereich.",
  },
  {
    slug: "geometrisches-spiel", name: "Geometrisches Spiel", untertitel: "Rautenmuster in Rot, Pink und Gold",
    format: "quer", kategorien: ["abstrakt-modern"], abgeleitet: true,
    intro: "Ein dynamisches Rautenmuster aus überlagerten Dreiecken, das in warmen Rot-, Pink- und Goldtönen leuchtet und von einer feinen Craquelé-Textur durchzogen wird. Die kraftvolle Farbigkeit macht dieses moderne Grafikmotiv zum energiegeladenen Blickfang für Wohnzimmer, Flur oder Büro.",
  },
  {
    slug: "kathedralen-decke", name: "Kathedralen-Decke", untertitel: "Vergoldetes Sternengewölbe aus Holz",
    format: "quadrat", kategorien: ["mandalas-ornamente", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Der symmetrische Blick empor in ein historisches Holzgewölbe, dessen sternförmige Streben mit goldenen Sonnen, Wappen und geschnitzten Köpfen verziert sind. Warme Braun-, Gold- und Türkistöne verleihen dem Motiv sakrale Tiefe und machen es zum imposanten Mittelpunkt über Esstisch oder im Treppenhaus.",
  },
  {
    slug: "flammende-rose", name: "Flammende Rose", untertitel: "Rote Rose mit Schrift auf Ornamentgrund",
    format: "quadrat", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Eine glühend rote Rose in vollem Aufblühen, überlagert von zarter Schreibschrift und einem nostalgischen Ornamentgrund. Das warme Zusammenspiel aus Rot, Orange und Goldtönen strahlt Leidenschaft und Romantik aus und setzt im Schlafzimmer oder Wohnbereich einen sinnlichen Akzent.",
  },
  {
    slug: "goldener-bodhisattva", name: "Goldene Bodhisattva", untertitel: "Goldene Bodhisattva-Figur mit Wolkenrelief",
    format: "quadrat", kategorien: ["ferne-welten", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Eine kunstvoll vergoldete Bodhisattva-Figur, meditativ vor einem fein ziselierten Wolkenrelief thronend. Das satte Gold vor warmem Braun strahlt Ruhe und fernöstliche Erhabenheit aus und schafft im Wohnzimmer, Meditationsraum oder Eingangsbereich eine würdevolle Atmosphäre.",
  },
  {
    slug: "prunkschild", name: "Prunkschild", untertitel: "Antiker Zierschild in Silber und Kupfer",
    format: "quadrat", kategorien: ["vintage-nostalgie", "mandalas-ornamente"], abgeleitet: true,
    intro: "Ein historischer Rundschild mit reich gravierten Ranken, feinen Silbereinlagen und kupferfarbenen Nieten, freigestellt vor hellem Passepartout. Das detailverliebte Sammlerstück verbindet handwerkliche Eleganz mit musealem Charme und passt in Arbeitszimmer, Bibliothek oder Herrenzimmer.",
  },
  {
    slug: "sonnenuntergang-am-meer", name: "Sonnenuntergang am Meer", untertitel: "Glühende Sonne über Dünengras und Strand",
    format: "quadrat", kategorien: ["blumen-natur"], abgeleitet: true,
    intro: "Eine glühende Sonne versinkt über Meer und Strand, während sich Dünengräser als Silhouetten in den feurig orange-roten Himmel zeichnen. Die warme, ruhige Stimmung dieses Naturmotivs bringt Weite und Urlaubsgefühl in Wohnzimmer oder Schlafzimmer.",
  },
  {
    slug: "rote-zellstruktur", name: "Rote Zellstruktur", untertitel: "Fluid-Art Zellmuster in Rot und Schwarz",
    format: "quadrat", kategorien: ["abstrakt-modern"], abgeleitet: true,
    intro: "Ein faszinierendes Fluid-Art-Motiv aus organischen Zellstrukturen in tiefem Rot, durchzogen von schwarzen Adern und cremefarbenen Highlights. Die lebendige, fast biologische Textur wirkt kraftvoll modern und setzt in Wohnzimmer oder Loft einen ausdrucksstarken Akzent.",
  },
  {
    slug: "papageifisch", name: "Papageifisch", untertitel: "Historische Illustration eines bunten Riffisches",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Eine detailreiche historische Illustration eines tropischen Papageifisches in leuchtendem Grün, Rot und Türkis, gerahmt von einem klassischen weißen Passepartout. Das nostalgische Naturmotiv verströmt maritimen Sammler-Charme und schmückt Bad, Flur oder Studierzimmer.",
  },
  {
    slug: "kugelfisch", name: "Kugelfisch", untertitel: "Historische Illustration eines getupften Kugelfisches",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Ein charmanter Kugelfisch in warmen Braun- und Goldtönen, weiß getupft und mit fein gefächerten Flossen, aus einer historischen naturkundlichen Tafel. Vor dem klassischen weißen Passepartout wirkt das Motiv als liebevolles Vintage-Detail in Bad, Kinderzimmer oder Galeriewand.",
  },
  {
    slug: "biene-am-nektar", name: "Biene am Nektar", untertitel: "Honigbiene auf leuchtend gelber Blüte",
    format: "quer", kategorien: ["blumen-natur"], abgeleitet: true,
    intro: "Eine Honigbiene in beeindruckender Makro-Nahaufnahme, sammelnd auf dem goldgelben Herz einer leuchtenden Blüte. Die warmen Gelbtöne und die feine Detailschärfe bringen sommerliche Lebendigkeit in Küche, Wintergarten oder Wohnzimmer.",
  },
  {
    slug: "schmetterling-poesie", name: "Schmetterling Poesie", untertitel: "Türkiser Schmetterling auf Vintage-Schrift",
    format: "quer", kategorien: ["blumen-natur", "vintage-nostalgie"], abgeleitet: true,
    intro: "Ein filigraner Schmetterling in zartem Türkis und Mintgrün entfaltet seine Flügel über vergilbter Handschrift und feinen Patina-Rissen. Die Kombination aus botanischer Illustration und nostalgischem Papiergrund verleiht dem Motiv eine poetische, verspielte Note. Ein leichter Blickfang für Schlafzimmer, Flur oder ein romantisch eingerichtetes Wohnzimmer.",
  },
  {
    slug: "alhambra-arabeske", name: "Alhambra Arabeske", untertitel: "Orientalisches Stuck-Ornament in warmem Sandton",
    format: "quer", kategorien: ["ferne-welten", "mandalas-ornamente"], abgeleitet: true,
    intro: "Ein Detail der maurischen Stuckkunst der Alhambra, dessen ineinander verwobene Arabesken und Sternmuster in warmen Sand- und Honigtönen leuchten. Die feine, symmetrische Reliefstruktur erzählt von jahrhundertealter Handwerkskunst aus dem Orient. Ein ruhiges, edles Motiv für Wohnzimmer, Eingangsbereich oder ein mediterran inspiriertes Interieur.",
  },
  {
    slug: "gelbe-lilie", name: "Gelbe Lilie", untertitel: "Zarte gelbe Lilienblüte auf Weiß",
    format: "quadrat", kategorien: ["blumen-natur"], abgeleitet: true,
    intro: "Eine Gruppe voll erblühter Lilien in sanftem Buttergelb hebt sich klar vor reinweißem Grund ab, umrahmt von einem dezenten Passepartout. Frisches Grün und die feinen Staubgefäße geben dem Motiv botanische Präzision und lichte Eleganz. Perfekt für Schlafzimmer, Küche oder jeden hellen, freundlichen Wohnraum.",
  },
  {
    slug: "rote-lilie", name: "Rote Lilie", untertitel: "Leuchtend rote Lilienblüte auf Weiß",
    format: "quadrat", kategorien: ["blumen-natur"], abgeleitet: true,
    intro: "Kräftig rote Lilien entfalten sich in voller Pracht vor lichtem Weiß, ihre satten Blütenblätter und filigranen Staubgefäße fangen jedes Detail ein. Das dezente Passepartout mit feiner roter Linie unterstreicht die Klarheit der Komposition. Ein ausdrucksstarker Farbakzent für Wohnzimmer, Esszimmer oder Flur.",
  },
  {
    slug: "goldenes-tribal-ornament", name: "Goldenes Tribal-Ornament", untertitel: "Filigranes Goldornament auf schwarzem Stein",
    format: "quer", kategorien: ["gold-glanz", "mandalas-ornamente"], abgeleitet: true,
    intro: "Ein kunstvoll geschwungenes Tribal-Ornament in schimmerndem Gold breitet sich symmetrisch vor dunklem Steingrund aus. Die Patina und die feinen Flammenlinien geben dem Motiv Tiefe, Dramatik und einen edlen, maskulinen Charakter. Ein starker Blickfang für moderne Wohnräume, Büro oder einen stilvollen Eingangsbereich.",
  },
  {
    slug: "orientalische-buchkunst", name: "Orientalische Buchkunst", untertitel: "Verzierte persische Buchmalerei in Gold und Blau",
    format: "quer", kategorien: ["ferne-welten", "gold-glanz"], abgeleitet: true,
    intro: "Eine reich illuminierte orientalische Buchseite entfaltet ein Meer aus goldenen Ranken, tiefblauen Medaillons und leuchtend orangefarbenen Feldern. Die feine Symmetrie und die satten Farben zeugen von der Pracht persischer Buchkunst. Ein warmes, opulentes Motiv für Wohnzimmer, Bibliothek oder ein orientalisch inspiriertes Ambiente.",
  },
  {
    slug: "oldtimer-nostalgie", name: "Oldtimer Nostalgie", untertitel: "Gelber Oldtimer auf Vintage-Grund",
    format: "quer", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Ein eleganter Oldtimer in warmem Gelb mit Weißwandreifen steht vor einem gealterten Grund aus Patina und alter Handschrift. Der nostalgische Grafik-Stil verleiht dem klassischen Automobil einen künstlerischen, erzählerischen Charakter. Ein charmantes Motiv für Wohnzimmer, Herrenzimmer oder ein Büro mit Sammlerflair.",
  },
  {
    slug: "bronzespiegel-patina", name: "Bronzespiegel Patina", untertitel: "Antiker Bronzeschild in Türkis-Patina",
    format: "quadrat", kategorien: ["vintage-nostalgie", "mandalas-ornamente"], abgeleitet: true,
    intro: "Ein antiker Bronzespiegel mit konzentrischen Ornamenten schimmert in tiefem Türkis und grünspaniger Patina. Die kreisrunde Symmetrie und die feinen Reliefspiralen erzeugen eine meditative, geheimnisvolle Wirkung. Ein ruhiges, edles Motiv für Wohnzimmer, Meditationsraum oder einen stilvollen Flur.",
  },
  {
    slug: "aus-frueheren-jahrhunderten-blau", name: "Aus früheren Jahrhunderten", untertitel: "Asiatische Reliefkunst in Türkis, Triptychon",
    format: "quer", kategorien: ["ferne-welten", "vintage-nostalgie"], abgeleitet: true,
    intro: "Ein dreiteiliges Motiv vereint asiatische Reliefkunst in tiefem Türkis und Smaragdgrün: verschlungene Ornamente, eine wehrhafte Tempelfigur und feine Vogel- und Rankenmuster. Die Patina und die kräftigen Blaugrüntöne verleihen dem Werk eine mystische, jahrhundertealte Aura. Ein ausdrucksstarkes Statement für Wohnzimmer, Flur oder ein fernöstlich inspiriertes Interieur.",
  },
  {
    slug: "goldene-relieftoene-triptychon", name: "Goldene Relieftöne", untertitel: "Orientalische Goldornamente, warmes Triptychon",
    format: "quer", kategorien: ["gold-glanz", "ferne-welten"], abgeleitet: true,
    intro: "Ein warmes Triptychon fängt drei Detailaufnahmen kunstvoller Goldornamente ein, von filigraner Reliefarbeit bis zu barocken Ranken in Bernstein- und Kupfertönen. Die weiche Patina und das satte Licht schaffen eine gediegene, orientalische Stimmung. Ein harmonisches Set für Wohnzimmer, Esszimmer oder einen einladenden Eingangsbereich.",
  },
  {
    slug: "orientalische-pracht", name: "Orientalische Pracht", untertitel: "Goldenes Ornament auf warmem Rostrot",
    format: "quadrat", kategorien: ["mandalas-ornamente", "ferne-welten"], bestseller: true, abgeleitet: true,
    intro: "Ein prachtvolles orientalisches Ornament in leuchtendem Gold entfaltet sich vor tiefem Rostrot und warmen Bronzetönen. Filigrane Ranken und ein zentrales Medaillon erinnern an kostbare Buchdeckel und morgenländische Handwerkskunst. Ein warmer Blickfang für Wohnzimmer, Flur oder ein stimmungsvolles Esszimmer.",
  },
  {
    slug: "barocke-konsole", name: "Barocke Konsole", untertitel: "Vergoldete Rokoko-Schnitzerei mit Patina",
    format: "quadrat", kategorien: ["vintage-nostalgie", "gold-glanz"], abgeleitet: true,
    intro: "Eine kunstvoll geschnitzte, vergoldete Wandkonsole im Rokoko-Stil, umspielt von Blumengirlanden und weicher Patina. Warme Gold- und Rosttöne treffen auf verwaschene handschriftliche Zeilen und schaffen eine nostalgisch-elegante Stimmung. Ideal für klassisch eingerichtete Wohnräume und Eingangsbereiche.",
  },
  {
    slug: "flugzeuglegende", name: "Flugzeuglegende", untertitel: "Historisches Flugzeug in warmem Sepia",
    format: "quer", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Eine legendäre Propellermaschine im dynamischen Aquarell-Grunge-Stil. Warme Sepia-, Gold- und Rosttöne mit spritzigen Farbakzenten geben dem Motiv Kraft und Geschichte. Ein markanter Blickfang für Herrenzimmer, Büro oder das Zuhause von Luftfahrt-Enthusiasten.",
  },
  {
    slug: "arabische-welt-blau", name: "Arabische Welt", untertitel: "Orientalisches Tor in Türkis und Petrol",
    format: "quadrat", kategorien: ["ferne-welten"], abgeleitet: true,
    intro: "Ein orientalisches Spitzbogentor taucht geheimnisvoll aus kühlen Türkis- und Petroltönen auf, überlagert von zarten kalligrafischen Schriftzügen. Die verwitterte Struktur und das träumerische Blau schaffen Tiefe und Fernweh. Perfekt für Schlafzimmer, Bad oder jeden Raum, der Ruhe und Weite ausstrahlen soll.",
  },
  {
    slug: "goldene-figur", name: "Goldene Figur", untertitel: "Archaische Goldstatue auf warmem Grund",
    format: "quadrat", kategorien: ["gold-glanz", "ferne-welten"], abgeleitet: true,
    intro: "Eine archaisch anmutende Figur aus glänzendem Gold mit ausdrucksstarkem Gesicht und stilisiertem Schmuck. Warme Ocker- und Brauntöne sowie verwaschene Schriftzeilen unterstreichen den musealen, geheimnisvollen Charakter. Ein außergewöhnliches Sammlerstück für Wohnzimmer, Galeriewand oder Arbeitszimmer.",
  },
  {
    slug: "grosses-tor", name: "Großes Tor", untertitel: "Ornamentales Holztor in warmem Terrakotta",
    format: "quadrat", kategorien: ["ferne-welten", "vintage-nostalgie"], abgeleitet: true,
    intro: "Ein mächtiges, reich geschnitztes Holztor in warmen Terrakotta- und Bernsteintönen, überlagert von handschriftlichen Zeilen und alten Poststempeln. Der Rundbogen und die geometrischen Schnitzereien erzählen von fernen Orten und vergangenen Zeiten. Ein stimmungsvoller Blickfang für Flur, Wohnzimmer oder Bibliothek.",
  },
  {
    slug: "goldenes-antlitz", name: "Goldenes Antlitz", untertitel: "Barocke Maske in leuchtendem Gold",
    format: "quadrat", kategorien: ["gold-glanz", "vintage-nostalgie"], bestseller: true, abgeleitet: true,
    intro: "Ein barockes Frauenantlitz aus vergoldeter Schnitzerei, gerahmt von schwungvollen Akanthusblättern und feinen Ornamenten. Leuchtendes Gold und warme Bernsteintöne verleihen dem Motiv edlen Glanz und museale Tiefe. Ein prunkvoller Blickfang für repräsentative Wohnräume, Salon oder Eingangsbereich.",
  },
  {
    slug: "alter-glanz", name: "Alter Glanz", untertitel: "Schloss und Schnitzfries in warmem Gold",
    format: "quadrat", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Ein prunkvolles Schloss taucht sepiafarben hinter einem kunstvollen Schnitzfries auf, darunter verblasste handschriftliche Zeilen. Warme Gold-, Ocker- und Rosttöne erzeugen eine nostalgische, ehrwürdige Atmosphäre. Ideal für klassisch-elegante Wohnzimmer, Arbeitszimmer oder Bibliotheken.",
  },
  {
    slug: "spanische-wand", name: "Spanische Wand", untertitel: "Maurisches Ornamentmuster in Rost und Kupfer",
    format: "quer", kategorien: ["mandalas-ornamente", "ferne-welten"], abgeleitet: true,
    intro: "Ein kunstvoll geschnitztes maurisches Ornamentmuster mit Sternen und floralen Motiven in warmen Rost-, Kupfer- und Bernsteintönen. Das rhythmische Geflecht und die weiche Patina erinnern an die Paläste Andalusiens. Ein warmer, strukturreicher Blickfang für Wohnzimmer, Flur oder Esszimmer.",
  },
  {
    slug: "alter-charme", name: "Alter Charme", untertitel: "Oldtimer-Cabrio vor Vintage-Zeitungscollage",
    format: "quer", kategorien: ["vintage-nostalgie"], bestseller: true, abgeleitet: true,
    intro: "Ein eleganter Oldtimer mit glänzendem Chromgrill und cremefarbener Karosserie vor einer nostalgischen Zeitungs- und Plakatcollage. Warme Braun-, Beige- und Sepiatöne mit roten Akzenten wecken den Charme der goldenen Automobilära. Ein stilvoller Blickfang für Herrenzimmer, Büro oder das Wohnzimmer von Liebhabern klassischer Fahrzeuge.",
  },
  {
    slug: "antike-duellpistolen", name: "Antike Duellpistolen", untertitel: "Zwei historische Pistolen auf Kupfergrund",
    format: "quadrat", kategorien: ["vintage-nostalgie", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Zwei kunstvoll gravierte Pistolen aus vergangener Zeit ruhen auf einem warmen Untergrund aus Kupfer-, Rost- und Bronzetönen, überlagert von zarter alter Handschrift. Die feine Ziselierung und das gealterte Metall verleihen dem Motiv eine edle Sammler-Aura. Ein markanter Blickfang für Herrenzimmer, Arbeitszimmer oder eine klassisch eingerichtete Bibliothek.",
  },
  {
    slug: "antike-glasgefaesse", name: "Antike Glasgefäße", untertitel: "Zwei historische Gläser auf Sepia-Pergament",
    format: "quadrat", kategorien: ["vintage-nostalgie"], abgeleitet: true,
    intro: "Zwei zart schimmernde Gläser aus der Antike stehen dicht beieinander, ihr grünlich-goldener Schimmer vor einem warmen Grund aus Sepia, Ocker und feiner alter Schrift. Die Patina und das gedämpfte Licht schaffen eine stille, nostalgische Eleganz. Ein feinsinniges Stillleben für Esszimmer, Leseecke oder Flur.",
  },
  {
    slug: "goettliche-figur", name: "Göttliche Figur", untertitel: "Antike Steinmaske in Erdtönen mit Schrift",
    format: "quadrat", kategorien: ["ferne-welten", "vintage-nostalgie"], abgeleitet: true,
    intro: "Eine altehrwürdige Steinfigur mit spiralförmigen Ornamenten und rätselhaftem Blick tritt aus einem verwitterten Grund aus Grün-, Grau- und Erdtönen hervor, durchzogen von handschriftlichen Zeilen. Das Motiv strahlt archaische Kraft und geheimnisvolle Tiefe aus. Ein charaktervoller Blickfang für Wohnräume mit Sinn für ferne Kulturen.",
  },
  {
    slug: "goldener-waechter", name: "Goldener Wächter", untertitel: "Balinesische Tempelfigur in Gold und Glut",
    format: "quer", kategorien: ["ferne-welten", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Eine reich verzierte Tempelfigur aus Bali leuchtet in warmem Gold und glühendem Kupfer vor dunklem, geheimnisvollem Grund. Die filigranen Schnitzereien und das dramatische Licht verleihen dem Motiv eine kraftvolle, sakrale Präsenz. Ein imposanter Blickfang für Wohnzimmer, Wellness-Bereich oder Meditationsraum.",
  },
  {
    slug: "tempelwaechter", name: "Tempelwächter", untertitel: "Chinesischer Löwe vor rotem Tempeltor",
    format: "quadrat", kategorien: ["ferne-welten", "vintage-nostalgie"], abgeleitet: true,
    intro: "Ein steinerner chinesischer Wächterlöwe hält vor einem geschwungenen Tempeldach Wache, eingebettet in warme Rost-, Rot- und Brauntöne mit fein verwitterter Textur. Die nebelige Tiefe und der morbide Charme lassen fernöstliche Ruhe spürbar werden. Ein stimmungsvoller Blickfang für Wohnräume, Flur oder Meditationsecke.",
  },
  {
    slug: "aztekischer-sonnenstein", name: "Aztekischer Sonnenstein", untertitel: "Kalenderstein in Rost und Gold",
    format: "quer", kategorien: ["ferne-welten", "mandalas-ornamente"], abgeleitet: true,
    intro: "Der mächtige aztekische Kalenderstein entfaltet seine kreisrunde Symbolik in warmen Rost-, Rot- und Goldtönen, das Sonnengesicht im Zentrum von unzähligen Glyphen umringt. Die steinerne Struktur und die satte Farbglut verleihen dem Motiv monumentale Wirkung. Ein kraftvoller Blickfang für Wohnzimmer oder Räume mit Fernweh-Charakter.",
  },
  {
    slug: "goldener-lotus", name: "Goldener Lotus", untertitel: "Ornamentale Lotusblüte in Gold auf Schwarz",
    format: "quadrat", kategorien: ["mandalas-ornamente", "gold-glanz"], bestseller: true, abgeleitet: true,
    intro: "Eine kunstvoll stilisierte Lotusblüte entfaltet ihre feinen Ornamentlinien in Gold, Kupfer und Bronze vor tiefschwarzem Steinschimmer. Symmetrie, Patina und warmer Metallglanz verbinden sich zu einem meditativen Blickfang. Ideal für Schlafzimmer, Yoga-Raum oder eine ruhige Wohnzimmerwand.",
  },
  {
    slug: "orientalische-textilkunst", name: "Orientalische Textilkunst", untertitel: "Bestickter Wandbehang aus Indien in Rot",
    format: "quer", kategorien: ["ferne-welten", "mandalas-ornamente"], abgeleitet: true,
    intro: "Ein prachtvoll bestickter Wandbehang aus Gujarat zeigt drei runde Medaillons inmitten dichter Blüten- und Paisley-Ornamentik in sattem Rot, Orange und Gold. Die handwerkliche Fülle und die warmen Farben verströmen orientalische Opulenz. Ein dekoratives Glanzstück für Wohnzimmer, Esszimmer oder stilvollen Flur.",
  },
  {
    slug: "golden-rust", name: "Golden Rust", untertitel: "Abstrakte Rost-Textur in Gold und Feuer",
    format: "quadrat", kategorien: ["abstrakt-modern", "gold-glanz"], abgeleitet: true,
    intro: "Eine abstrakte Fläche aus rissiger Patina glüht in warmen Gold-, Bernstein- und Feuertönen, als würde flüssiges Metall langsam erkalten. Die organische Textur und der leuchtende Kern verleihen dem Motiv moderne Eleganz mit Tiefe. Ein ausdrucksstarker Blickfang für Wohnzimmer, Büro oder Loft.",
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
