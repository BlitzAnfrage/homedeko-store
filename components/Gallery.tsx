"use client";
import { useCallback, useEffect, useState } from "react";
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

  const vor = useCallback(() => setIdx((i) => (i + 1) % bilder.length), [bilder.length]);
  const zurueck = useCallback(() => setIdx((i) => (i - 1 + bilder.length) % bilder.length), [bilder.length]);

  useEffect(() => {
    if (!licht) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLicht(false);
      if (e.key === "ArrowRight") vor();
      if (e.key === "ArrowLeft") zurueck();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [licht, vor, zurueck]);

  if (!bilder.length) return null;
  const akt = bilder[idx];

  return (
    <div className="flex gap-3">
      {/* Vertikale Thumbnails */}
      <div className="hidden sm:flex flex-col gap-2 w-[74px] shrink-0">
        {bilder.map((b, i) => (
          <button
            key={b.key}
            onClick={() => setIdx(i)}
            className={`opt overflow-hidden aspect-square ${i === idx ? "" : "opacity-80"}`}
            data-selected={i === idx}
            aria-label={TYP_LABEL[b.typ] ?? b.typ}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.klein} alt="" className="w-full h-full object-cover" loading={i > 3 ? "lazy" : "eager"} />
          </button>
        ))}
      </div>

      {/* Hauptbild */}
      <div className="relative flex-1 min-w-0">
        <button className="card block w-full overflow-hidden cursor-zoom-in" onClick={() => setLicht(true)} aria-label="Bild vergrößern">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={akt.big} alt={alt} className="w-full aspect-square object-cover fade-in" key={akt.key} />
        </button>
        <span className="absolute left-3 top-3 bg-white/90 text-ink text-[11.5px] font-semibold px-2 py-1 rounded-[3px] border border-line">
          {TYP_LABEL[akt.typ] ?? "Ansicht"}
        </span>
        {arProdukt && (
          <button
            onClick={(e) => { e.stopPropagation(); setArOffen(true); }}
            className="btn-ar puls-ring absolute right-3 top-3 flex items-center gap-2 text-[12.5px] px-3 py-2"
          >
            <IconCamera size={16} /> An deiner Wand ansehen
          </button>
        )}
        {/* Mobile Punkte */}
        <div className="sm:hidden flex justify-center gap-1.5 mt-3">
          {bilder.map((b, i) => (
            <button key={b.key} onClick={() => setIdx(i)} aria-label={`Bild ${i + 1}`}
              className={`h-2 w-2 rounded-full ${i === idx ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {licht && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLicht(false)}>
          <button className="absolute top-4 right-4 text-white/90 p-2" aria-label="Schließen"><IconClose size={26} /></button>
          <button className="absolute left-2 lg:left-6 text-white/90 p-3 rotate-180" aria-label="Zurück" onClick={(e) => { e.stopPropagation(); zurueck(); }}>
            <IconChevron size={30} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={akt.big} alt={alt} className="max-h-[86vh] max-w-[88vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-2 lg:right-6 text-white/90 p-3" aria-label="Weiter" onClick={(e) => { e.stopPropagation(); vor(); }}>
            <IconChevron size={30} />
          </button>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
            {bilder.map((b, i) => (
              <button key={b.key} onClick={() => setIdx(i)} className={`h-12 w-12 overflow-hidden rounded-[4px] border-2 ${i === idx ? "border-white" : "border-transparent opacity-60"}`}>
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
