"use client";
/* Klient-Wrapper für die Home-Seite: hält den AR-Modal-State, rendert den Hero
   (mit AR-CTA) und die AR-Feature-Sektion, und öffnet ArVorschau mit einem
   Vorzeigemotiv (Goldtattoo). So bleibt page.tsx ein Server-Component. */
import { useState } from "react";
import Link from "next/link";
import type { Produkt } from "@/lib/katalog";
import HeroSlider from "./HeroSlider";
import ArVorschau from "./ArVorschau";
import { IconCamera } from "./Icon";

type Slide = React.ComponentProps<typeof HeroSlider>["slides"][number];

export default function ArHomeTeaser({
  slides, arProdukt, teaserBild, teaserMotiv,
}: {
  slides: Slide[];
  arProdukt: Produkt;
  teaserBild: string;
  teaserMotiv: string;
}) {
  const [offen, setOffen] = useState(false);
  const oeffnen = () => setOffen(true);

  return (
    <>
      <HeroSlider slides={slides} onAr={oeffnen} />

      {/* ── AR-Feature-Sektion (Petrol-Signatur) ── */}
      <section className="py-16 lg:py-20" style={{ background: "var(--bordeaux-soft)" }} data-reveal>
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[5fr_6fr] gap-10 items-center">
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase font-semibold mb-3" style={{ color: "var(--bordeaux)" }}>
              Kostenlos · direkt im Browser · keine App
            </div>
            <h2 className="font-display text-3xl lg:text-[40px] leading-tight text-ink-strong">
              Sieh jedes Motiv an <span className="display-italic" style={{ color: "var(--bordeaux)" }}>deiner</span> Wand.
            </h2>
            <p className="mt-4 text-[15.5px] text-muted max-w-lg leading-relaxed">
              Handy hochhalten, Motiv auflegen — maßstabsgetreu auf den Zentimeter.
              Bevor du kaufst, hängt es schon an deiner Wand.
            </p>
            <ol className="mt-6 space-y-3">
              {["Kamera öffnen", "Motiv platzieren", "Größe live wählen"].map((t, i) => (
                <li key={t} className="flex items-center gap-3 text-[14.5px] font-medium">
                  <span className="shrink-0 h-8 w-8 rounded-full text-white text-[14px] font-bold flex items-center justify-center" style={{ background: "var(--bordeaux)" }}>{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <button onClick={oeffnen} className="btn-ar px-8 py-4 text-[15.5px] mt-7 flex items-center gap-2.5">
              <IconCamera size={20} /> Jetzt an meiner Wand testen
            </button>
            <p className="mt-4 text-[12px] text-muted">Dein Foto bleibt auf deinem Gerät — es wird nichts hochgeladen.</p>
          </div>

          {/* Vorschau-Karte: echtes Wohnbeispiel mit realistisch platziertem Motiv */}
          <button onClick={oeffnen} className="relative block rounded-[20px] overflow-hidden border-8 border-white cursor-pointer group"
            style={{ boxShadow: "0 30px 70px -30px rgba(94,26,42,.4)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={teaserBild} alt={`${teaserMotiv} an der Wand`} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <span className="glas-hell absolute left-4 top-4"><IconCamera size={14} style={{ color: "var(--bordeaux)" }} /> Live-Vorschau</span>
            <span className="absolute right-4 bottom-4 glas-hell">„{teaserMotiv}“ · maßstabsgetreu</span>
          </button>
        </div>
      </section>

      <ArVorschau p={arProdukt} offen={offen} zu={() => setOffen(false)} />
    </>
  );
}
