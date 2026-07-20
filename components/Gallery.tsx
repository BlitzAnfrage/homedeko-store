"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Ansicht, Produkt } from "@/lib/katalog";
import { IconCamera, IconChevron, IconClose } from "./Icon";
import ArVorschau from "./ArVorschau";

const TYP_LABEL: Record<string, string> = {
  ans: "Ansicht", "ans-hell": "Helle Ansicht", "ans-dunkel": "Dunkle Ansicht",
  wb: "Wohnbeispiel", det: "Detail", motiv: "Motiv",
};

export default function Gallery({ bilder, alt, arProdukt }: { bilder: Ansicht[]; alt: string; arProdukt?: Produkt }) {
  const [idx, setIdx] = useState(0);
  const [licht, setLicht] = useState(false);
  const [arOffen, setArOffen] = useState(false);
  const swipeRef = useRef<HTMLDivElement>(null);
  const lichtSwipeRef = useRef<HTMLDivElement>(null);

  const vor = useCallback(() => setIdx((i) => (i + 1) % bilder.length), [bilder.length]);
  const zurueck = useCallback(() => setIdx((i) => (i - 1 + bilder.length) % bilder.length), [bilder.length]);

  /* Thumbnail-Klick (Desktop) scrollt die Mobil-Swipe-Reihe mit */
  const zuBild = useCallback((i: number) => {
    setIdx(i);
    const el = swipeRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  /* Mobil-Swipe: aktives Bild aus der Scroll-Position ableiten */
  const onScroll = () => {
    const el = swipeRef.current;
    if (!el) return;
    const neu = Math.round(el.scrollLeft / el.clientWidth);
    if (neu !== idx) setIdx(neu);
  };

  useEffect(() => {
    if (!licht) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLicht(false);
      if (e.key === "ArrowRight") vor();
      if (e.key === "ArrowLeft") zurueck();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [licht, vor, zurueck]);

  if (!bilder.length) return null;
  const akt = bilder[idx];

  return (
    <div className="flex gap-3">
      {/* Vertikale Thumbnails — nur Desktop */}
      <div className="hidden sm:flex flex-col gap-2 w-[74px] shrink-0">
        {bilder.map((b, i) => (
          <button
            key={b.key} onClick={() => zuBild(i)}
            className={`opt overflow-hidden aspect-square ${i === idx ? "" : "opacity-80"}`}
            data-selected={i === idx} aria-label={TYP_LABEL[b.typ] ?? b.typ}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.klein} alt="" className="w-full h-full object-cover" loading={i > 3 ? "lazy" : "eager"} />
          </button>
        ))}
      </div>

      {/* Hauptbild-Bereich */}
      <div className="relative flex-1 min-w-0">
        {/* Swipe-Reihe: auf Mobil scrollbar (nativer Swipe), auf Desktop nur das aktive Bild */}
        <div
          ref={swipeRef} onScroll={onScroll}
          className="card overflow-hidden sm:overflow-hidden flex sm:block snap-x snap-mandatory overflow-x-auto sm:overflow-x-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {bilder.map((b, i) => (
            <button
              key={b.key}
              onClick={() => setLicht(true)}
              aria-label="Bild vergrößern"
              className={`snap-center shrink-0 w-full cursor-zoom-in ${i === idx ? "sm:block" : "sm:hidden"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.big} alt={alt} className="w-full aspect-square object-cover" loading={i < 2 ? "eager" : "lazy"} />
            </button>
          ))}
        </div>

        <span className="absolute left-3 top-3 bg-white/90 text-ink text-[11.5px] font-semibold px-2 py-1 rounded-[3px] border border-line pointer-events-none">
          {TYP_LABEL[akt.typ] ?? "Ansicht"}
        </span>
        {arProdukt && (
          <button
            onClick={() => setArOffen(true)}
            className="btn-ar puls-ring absolute right-3 top-3 flex items-center gap-2 text-[12.5px] px-3 py-2"
          >
            <IconCamera size={16} /> An deiner Wand ansehen
          </button>
        )}

        {/* Punkte — Mobil, spiegeln die Swipe-Position und springen bei Tap */}
        <div className="sm:hidden flex justify-center gap-1.5 mt-3">
          {bilder.map((b, i) => (
            <button key={b.key} onClick={() => zuBild(i)} aria-label={`Bild ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-5 bg-bordeaux" : "w-2 bg-line"}`} />
          ))}
        </div>
      </div>

      {/* Lightbox — mit Swipe */}
      {licht && (
        <div className="fixed inset-0 z-50 bg-black/92 flex flex-col" onClick={() => setLicht(false)}>
          <button className="absolute top-4 right-4 z-10 text-white/90 p-2" aria-label="Schließen"><IconClose size={26} /></button>
          {/* Desktop: Pfeile */}
          <button className="hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white/90 p-3 rotate-180" aria-label="Zurück" onClick={(e) => { e.stopPropagation(); zurueck(); }}>
            <IconChevron size={30} />
          </button>
          <button className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white/90 p-3" aria-label="Weiter" onClick={(e) => { e.stopPropagation(); vor(); }}>
            <IconChevron size={30} />
          </button>
          {/* Swipe-Reihe (Mobil) / aktives Bild (Desktop) */}
          <div
            ref={lichtSwipeRef}
            className="flex-1 flex snap-x snap-mandatory overflow-x-auto items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
            onScroll={(e) => { const el = e.currentTarget; setIdx(Math.round(el.scrollLeft / el.clientWidth)); }}
          >
            {bilder.map((b, i) => (
              <div key={b.key} className={`snap-center shrink-0 w-full h-full flex items-center justify-center px-3 ${i === idx ? "sm:flex" : "sm:hidden"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.big} alt={alt} className="max-h-[80vh] max-w-full object-contain" />
              </div>
            ))}
          </div>
          <div className="shrink-0 pb-6 pt-3 flex justify-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onClick={(e) => e.stopPropagation()}>
            {bilder.map((b, i) => (
              <button key={b.key} onClick={() => { setIdx(i); lichtSwipeRef.current?.scrollTo({ left: i * lichtSwipeRef.current.clientWidth, behavior: "smooth" }); }}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-[4px] border-2 ${i === idx ? "border-white" : "border-transparent opacity-60"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.klein} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {arProdukt && <ArVorschau p={arProdukt} offen={arOffen} zu={() => setArOffen(false)} />}
    </div>
  );
}
