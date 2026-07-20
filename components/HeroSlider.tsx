"use client";
/* Kino-Hero v5 — lebendige Galerie-Szene: helles Text-Panel links auf Creme,
   rechts ein großes Wohnbeispiel-Foto (Ken-Burns) mit davor schwebendem Motiv +
   Preis-Tag. Wechselt zwischen 3 Stimmungen. Marquee-Fries hell darunter. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { euro } from "@/lib/preise";
import { IconArrowRight, IconCamera, IconCheck, IconChevron } from "./Icon";

type Slide = {
  szene: string;       // großes Wohnbeispiel-Foto (Held rechts)
  motiv: string;       // freigestelltes Motiv (schwebt davor)
  motivName: string;
  ab: number;
  href: string;        // Ziel des schwebenden Motivs
  stimmung: string;
  zeile1: string;
  akzent: string;
  zeile2: string;
  sub: string;
  ctaHref: string;
  cta: string;
};

const MARQUEE = [
  "Fertig bespannt inkl. Aufhänger", "Versandkostenfrei ab 60 €", "Poster schon ab 18 €",
  "Licht- & UV-beständiger Druck", "Bis 390 cm als Fototapete", "24 kuratierte Motive",
];

export default function HeroSlider({ slides, onAr }: { slides: Slide[]; onAr?: () => void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);
  const s = slides[idx];

  return (
    <>
      <section className="hero-buehne relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[46fr_54fr] items-center gap-8 lg:gap-4 min-h-[560px] lg:min-h-[640px] py-12 lg:py-0">
          {/* Text-Panel links */}
          <div key={"t" + idx} className="stagger max-w-xl relative z-10 lg:py-16">
            <div className="eyebrow">{s.stimmung}</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] leading-[1.05] text-ink-strong mt-4">
              {s.zeile1} <span className="display-italic text-bordeaux">{s.akzent}</span>
              {s.zeile2 && <><br />{s.zeile2}</>}
            </h1>
            <p className="mt-4 text-[16px] lg:text-[17px] text-muted max-w-md leading-relaxed">{s.sub}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={s.ctaHref} className="btn-gold px-7 py-3.5 text-[15px]">{s.cta}</Link>
              <button onClick={onAr} className="btn-ar px-7 py-3.5 text-[15px] flex items-center gap-2.5">
                <IconCamera size={19} /> Erst an deiner Wand sehen
              </button>
            </div>
            <Link href="/motive" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold-ink hover:underline">
              Alle 24 Motive ansehen <IconArrowRight size={15} />
            </Link>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-muted">
              {["Versandkostenfrei ab 60 €", "Fertig bespannt", "Poster ab 18 €"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-ok"><IconCheck size={15} /></span>{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Galerie-Szene rechts */}
          <div className="relative h-[360px] sm:h-[440px] lg:h-[640px] -mx-4 lg:mx-0">
            {/* Held-Foto (Wohnbeispiel) mit Ken-Burns, sanft ins Panel überblendet */}
            <div className="absolute inset-0 overflow-hidden lg:rounded-l-[28px]">
              {slides.map((sl, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={sl.szene} src={sl.szene} alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${i === idx ? "hero-szene opacity-100" : "opacity-0"}`} />
              ))}
              {/* weicher Creme-Verlauf an der linken Kante → nahtloser Übergang ins Panel */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, var(--bg) 0%, transparent 24%)" }} />
            </div>

            {/* schwebendes Motiv davor, mit Preis-Tag */}
            <Link key={"m" + idx} href={s.href}
              className="hero-reveal absolute left-4 lg:left-2 bottom-8 lg:bottom-16 w-[46%] max-w-[300px] group">
              <span className="hero-float block bg-white p-2 lg:p-2.5 rounded-[6px]"
                style={{ boxShadow: "0 40px 80px -30px rgba(26,21,17,.6)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.motiv} alt={s.motivName} className="w-full aspect-square object-cover rounded-[3px]" />
              </span>
              <span className="hero-tag absolute -bottom-4 -right-3 text-[13px] flex items-center gap-2">
                „{s.motivName}“ · <span className="text-bordeaux font-bold">ab {euro(s.ab)}</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Slide-Punkte + Scroll-Pfeil */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2.5 z-10">
          <div className="flex justify-center gap-2.5">
            {slides.map((sl, i) => (
              <button key={sl.szene} onClick={() => setIdx(i)} aria-label={`Stimmung ${sl.stimmung}`}
                className={`h-[5px] rounded-full transition-all duration-500 ${i === idx ? "w-9 bg-bordeaux" : "w-4 bg-ink/15 hover:bg-ink/30"}`} />
            ))}
          </div>
          <span className="scroll-pfeil text-ink/40 rotate-90"><IconChevron size={18} /></span>
        </div>
      </section>

      {/* Heller Marquee-Fries */}
      <div className="marquee bg-gold-soft border-y border-line py-2.5 text-[12.5px] font-medium tracking-[0.04em] text-ink">
        <div className="marquee-spur">
          {[0, 1].map((wdh) => (
            <span key={wdh} className="inline-flex shrink-0">
              {MARQUEE.map((t) => (
                <span key={t + wdh} className="inline-flex items-center">
                  <span>{t}</span>
                  <span className="mx-6 text-gold">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="brandlinie" />
    </>
  );
}
