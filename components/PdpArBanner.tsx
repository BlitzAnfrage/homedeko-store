"use client";
/* Breiter AR-Banner direkt unter der Galerie — der Haupt-Trigger auf der PDP.
   Petrol-Signatur, unübersehbar. Ersetzt inhaltlich den alten Größenvergleich. */
import { useState } from "react";
import type { Produkt } from "@/lib/katalog";
import ArVorschau from "./ArVorschau";
import { IconCamera } from "./Icon";

export default function PdpArBanner({ p }: { p: Produkt }) {
  const [offen, setOffen] = useState(false);
  return (
    <>
      <div className="rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border"
        style={{ background: "var(--bordeaux-soft)", borderColor: "color-mix(in srgb, var(--bordeaux) 20%, transparent)" }}>
        <span className="shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white" style={{ background: "var(--bordeaux)" }}>
          <IconCamera size={24} />
        </span>
        <div className="flex-1">
          <div className="font-semibold text-[15.5px] text-ink-strong">Unsicher bei der Größe?</div>
          <div className="text-[13.5px] text-muted mt-0.5">
            Leg „{p.motiv.name}“ per Handykamera an deine echte Wand — maßstabsgetreu, in Sekunden.
          </div>
        </div>
        <button onClick={() => setOffen(true)} className="btn-ar px-6 py-3 text-[14.5px] flex items-center gap-2 shrink-0">
          <IconCamera size={18} /> Kamera öffnen
        </button>
      </div>
      <ArVorschau p={p} offen={offen} zu={() => setOffen(false)} />
    </>
  );
}
