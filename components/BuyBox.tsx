"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { euro, VERSAND_FREI_AB, Groesse } from "@/lib/preise";
import { RUECKGABE_TAGE, ZAHLARTEN } from "@/lib/site";
import type { Produkt } from "@/lib/katalog";
import { IconCamera, IconCart, IconCheck, IconMinus, IconPlus, IconShield } from "./Icon";
import ArVorschau from "./ArVorschau";
import PayLogos from "./PayLogos";

/* Kaufbox v2: jede Größe zeigt das Motiv maßstabsgetreu — als Mini-Vorschau in
   der Kachel und groß in der Live-Wandvorschau (echte Motivbilder, echte Proportionen). */
export default function BuyBox({ p }: { p: Produkt }) {
  const cart = useCart();
  const hatPoster = !!p.posterGroessen?.length;
  const [art, setArt] = useState<"haupt" | "poster">("haupt");
  const [gIdx, setGIdx] = useState(() => {
    const i = p.groessen.findIndex((g) => g.beliebt);
    return i >= 0 ? i : 0;
  });
  const [menge, setMenge] = useState(1);
  const [zugefuegt, setZugefuegt] = useState(false);
  const [arOffen, setArOffen] = useState(false);

  const groessen: Groesse[] = art === "poster" && p.posterGroessen ? p.posterGroessen : p.groessen;
  const groesse = groessen[Math.min(gIdx, groessen.length - 1)];
  const gesamt = groesse.preis * menge;
  const frei = gesamt >= VERSAND_FREI_AB;

  const motivBild = p.bilder[0]?.klein ?? "";
  const panels = p.art === "set3" && art === "haupt" ? 3 : 1;

  /* Bemaßungs-Vorschau: Bildhöhe skaliert relativ zur größten Größe der Serie */
  const ratio = (groesse.b ?? 1) / (groesse.h ?? 1);
  const maxH = Math.max(...groessen.map((g) => g.h ?? 1));
  const imgH = Math.max(60, Math.round(172 * ((groesse.h ?? 1) / maxH)));
  const imgW = Math.round(imgH * ratio);
  const totalW = panels * imgW + (panels - 1) * 6;

  const artLabel = useMemo(() => {
    if (art === "poster") return "Poster (120 g matt)";
    switch (p.art) {
      case "leinwand": return "Leinwand";
      case "set3": return "3er-Set Leinwand";
      case "tapete": return "Fototapete";
      case "wallprint": return "Wallprint selbstklebend";
      default: return "";
    }
  }, [art, p.art]);

  const wechselArt = (a: "haupt" | "poster") => {
    setArt(a);
    const ziel = a === "poster" && p.posterGroessen ? p.posterGroessen : p.groessen;
    const i = ziel.findIndex((g) => g.beliebt);
    setGIdx(i >= 0 ? i : 0);
  };

  const inWarenkorb = () => {
    cart.add({
      produktId: p.id,
      name: `${artLabel === "Leinwand" ? "Leinwandbild" : artLabel} „${p.motiv.name}“`,
      bild: motivBild,
      variante: `${artLabel} · ${groesse.label}`,
      preis: groesse.preis,
      menge,
    });
    setZugefuegt(true);
    setTimeout(() => setZugefuegt(false), 3500);
  };

  return (
    <div className="card p-5 lg:p-6" id="kaufbox">
      {/* Produktart-Umschalter (Leinwand ↔ Poster im selben Angebotssatz) */}
      {hatPoster && (
        <div className="mb-5">
          <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Ausführung</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="opt px-3 py-2.5 text-[14px] font-semibold" data-selected={art === "haupt"} onClick={() => wechselArt("haupt")}>
              Leinwand <span className="block text-[11.5px] font-normal text-muted">fertig bespannt</span>
            </button>
            <button className="opt px-3 py-2.5 text-[14px] font-semibold" data-selected={art === "poster"} onClick={() => wechselArt("poster")}>
              Poster <span className="block text-[11.5px] font-normal text-muted">120 g Bilderdruck matt</span>
            </button>
          </div>
        </div>
      )}

      {/* Bemaßungs-Vorschau: gewählte Größe mit echten Maßlinien */}
      <div className="mb-4">
        <div className="masse bg-bg border border-line rounded-[6px] px-4 py-4">
          <div className="flex items-center justify-center gap-3" style={{ minHeight: 196 }}>
            <div className="flex items-center gap-1.5 self-center" style={{ height: imgH }}>
              <span className="mass-text" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                {groesse.h} cm
              </span>
              <span className="mass-linie mass-v block h-full" />
            </div>
            <div>
              <div className="flex items-end gap-1.5">
                {Array.from({ length: panels }).map((_, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={i} src={motivBild} alt={`${p.motiv.name} — ${groesse.label}`}
                    className="motiv-img object-cover rounded-[3px]"
                    style={{ width: imgW, height: imgH }} />
                ))}
              </div>
              <span className="mass-linie mass-h block mt-2" style={{ width: totalW }} />
              <div className="mass-text text-center mt-1" style={{ width: totalW }}>
                {panels > 1 ? `3 × ${groesse.b} cm` : `${groesse.b} cm`}
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setArOffen(true)}
          className="btn-ar mt-2 w-full flex items-center justify-center gap-2.5 py-3 text-[14.5px]">
          <IconCamera size={19} /> Live an deiner Wand ansehen
        </button>
      </div>

      {/* Größen-Kacheln mit Mini-Motiv in echter Proportion */}
      <div className="mb-5">
        <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Größe wählen</div>
        <div className="grid grid-cols-2 gap-2">
          {groessen.map((g, i) => {
            const s = Math.min(30 / (g.h ?? 50), 44 / (panels * (g.b ?? 50)));
            return (
              <button key={g.label} className="opt px-2.5 py-2.5 text-left" data-selected={i === gIdx} onClick={() => setGIdx(i)}>
                <span className="flex items-center gap-2.5">
                  <span className="flex items-end gap-[2px] w-[48px] justify-center shrink-0" style={{ height: 32 }}>
                    {Array.from({ length: panels }).map((_, pi) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img key={pi} src={motivBild} alt="" aria-hidden
                        className="object-cover rounded-[1px] border border-line"
                        style={{ width: (g.b ?? 50) * s, height: (g.h ?? 50) * s }} />
                    ))}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold leading-tight">{g.label}</span>
                      {g.beliebt && <span className="text-[9.5px] font-bold uppercase tracking-wide bg-gold text-white rounded-[3px] px-1 py-0.5">Beliebt</span>}
                    </span>
                    <span className="block text-[12.5px] text-muted mt-0.5">{euro(g.preis)}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menge + Preis */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center border border-line rounded-[4px]">
          <button className="px-3 py-2.5 text-muted hover:text-ink" aria-label="Menge verringern" onClick={() => setMenge((m) => Math.max(1, m - 1))}><IconMinus size={16} /></button>
          <span className="w-8 text-center text-[15px] font-semibold">{menge}</span>
          <button className="px-3 py-2.5 text-muted hover:text-ink" aria-label="Menge erhöhen" onClick={() => setMenge((m) => m + 1)}><IconPlus size={16} /></button>
        </div>
        <div className="text-right">
          <div className="text-[26px] font-bold text-ink-strong leading-none">{euro(gesamt)}</div>
          <div className="text-[12px] text-muted mt-1">inkl. MwSt.{frei ? "" : " zzgl. Versand"}</div>
        </div>
      </div>

      {/* Versand-Hinweis */}
      <div className={`rounded-[4px] px-3 py-2 mb-4 text-[13px] font-medium ${frei ? "bg-ok-soft text-ok" : "bg-gold-soft text-gold-ink"}`}>
        {frei
          ? "Versandkostenfrei innerhalb Deutschlands"
          : `Noch ${euro(VERSAND_FREI_AB - gesamt)} bis zum Gratisversand (sonst 8 €)`}
      </div>

      {/* CTA */}
      <button onClick={inWarenkorb} className="btn-gold w-full py-4 text-[16px] flex items-center justify-center gap-2.5">
        <IconCart size={20} /> In den Warenkorb
      </button>
      {zugefuegt && (
        <div className="mt-3 fade-in flex items-center justify-between gap-3 rounded-[4px] bg-ok-soft text-ok px-3 py-2.5 text-[13.5px] font-medium">
          <span className="flex items-center gap-2"><IconCheck size={17} /> Im Warenkorb!</span>
          <Link href="/warenkorb" className="underline font-semibold">Zur Kasse</Link>
        </div>
      )}

      {/* 30-Tage-Versprechen prominent (Risikoumkehr) */}
      <div className="mt-4 flex items-center gap-3 rounded-[6px] border border-ok/30 bg-ok-soft px-3.5 py-2.5">
        <span className="text-ok shrink-0"><IconShield size={22} /></span>
        <span className="text-[13px] leading-snug">
          <b className="text-ink-strong">{RUECKGABE_TAGE} Tage Rückgaberecht</b> — kostenlose Rücksendung, kein Risiko beim Kauf.
        </span>
      </div>

      {/* Trust am CTA */}
      <ul className="mt-3 space-y-2 text-[13px]">
        {["Versandkostenfrei ab 60 € (DE) — sonst 8 €",
          p.art === "tapete" || p.art === "wallprint"
            ? "Qualitätsdruck, 150 dpi — dimensionsstabil"
            : "In Handarbeit gefertigt · licht- & UV-beständig",
          "Kauf auf Rechnung & Käuferschutz"].map((t) => (
          <li key={t} className="flex items-start gap-2 text-muted">
            <span className="text-ok mt-0.5"><IconCheck size={15} /></span>{t}
          </li>
        ))}
      </ul>

      {/* Zahlungsart-Logos */}
      <div className="mt-3.5 pt-3.5 border-t border-line">
        <PayLogos arten={ZAHLARTEN} />
      </div>

      <ArVorschau p={p} offen={arOffen} zu={() => setArOffen(false)} />
    </div>
  );
}
