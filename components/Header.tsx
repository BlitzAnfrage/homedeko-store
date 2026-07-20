"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { VORTEILE } from "@/lib/site";
import { KATEGORIEN, MOTIVE, motivBild, WELT_FARBEN } from "@/lib/katalog";
import { IconCart, IconCheck, IconChevron, IconClose, IconMenu, IconSearch } from "./Icon";

const NAV = [
  { href: "/kategorie/leinwandbilder", label: "Leinwandbilder" },
  { href: "/kategorie/3er-sets", label: "3er-Sets" },
  { href: "/kategorie/fototapeten", label: "Fototapeten" },
  { href: "/kategorie/wallprints", label: "Wallprints" },
];

export default function Header() {
  const { anzahl } = useCart();
  const router = useRouter();
  const [vorteil, setVorteil] = useState(0);
  const [mega, setMega] = useState(false);
  const [mobil, setMobil] = useState(false);
  const [q, setQ] = useState("");
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setVorteil((v) => (v + 1) % VORTEILE.length), 3800);
    return () => clearInterval(t);
  }, []);

  const suchen = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { router.push(`/suche?q=${encodeURIComponent(q.trim())}`); setMobil(false); }
  };

  const megaAuf = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMega(true); };
  const megaZu = () => { megaTimer.current = setTimeout(() => setMega(false), 120); };

  return (
    <header className="sticky top-0 z-40">
      {/* Aktionsleiste — Bordeaux-Verlauf, rotierende echte Vorteile, Gold-Link */}
      <div className="bar-aktion text-[13px] py-2 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-4">
          <span key={vorteil} className="fade-in inline-flex items-center gap-2 tracking-wide">
            <span className="text-gold-bright"><IconCheck size={15} /></span>
            {VORTEILE[vorteil]}
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <Link href="/#bestseller" className="hidden sm:inline hover:underline whitespace-nowrap">
            Zu den Lieblingsmotiven →
          </Link>
        </div>
      </div>

      {/* Hauptzeile */}
      <div className="bg-surface border-b border-line">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-4 lg:gap-8 h-[72px]">
          <button className="lg:hidden p-2 -ml-2" aria-label="Menü öffnen" onClick={() => setMobil(true)}>
            <IconMenu size={24} />
          </button>
          <Link href="/" className="shrink-0" aria-label="Homedeko Store — Startseite">
            <Image src="/logo.png" alt="Homedeko Store" width={190} height={52} priority className="h-10 lg:h-12 w-auto" />
          </Link>

          <form onSubmit={suchen} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Motiv suchen — z. B. Gold, Mandala, Rose …"
              className="w-full border border-line rounded-[4px] bg-bg px-4 py-2.5 text-[14px] outline-none focus:border-accent"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-muted hover:text-ink" aria-label="Suchen">
              <IconSearch size={19} />
            </button>
          </form>

          <div className="flex-1 md:hidden" />

          <Link href="/warenkorb" className="relative flex items-center gap-2 p-2 hover:text-accent-ink" aria-label="Warenkorb">
            <IconCart size={24} />
            <span className="hidden lg:block text-[14px] font-medium">Warenkorb</span>
            {anzahl > 0 && (
              <span className="absolute -top-0.5 left-6 lg:left-5 bg-accent text-white text-[11px] font-bold rounded-full min-w-[19px] h-[19px] flex items-center justify-center px-1">
                {anzahl}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigationszeile */}
      <nav className="bg-surface/95 backdrop-blur border-b border-line hidden lg:block" onMouseLeave={megaZu}>
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-7 h-12 text-[14px] font-medium">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-accent-ink py-3">{n.label}</Link>
          ))}
          <button
            className="flex items-center gap-1 hover:text-accent-ink py-3"
            onMouseEnter={megaAuf} onClick={() => setMega((m) => !m)}
          >
            Motiv-Welten <IconChevron size={14} className={`transition-transform ${mega ? "rotate-90" : ""}`} />
          </button>
          <Link href="/motive" className="hover:text-accent-ink py-3">Alle Motive</Link>
        </div>

        {mega && (
          <div className="absolute left-0 right-0 bg-surface border-b border-line fade-in" onMouseEnter={megaAuf} onMouseLeave={megaZu}>
            <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-6 gap-4">
              {KATEGORIEN.map((k) => {
                const beispiel = MOTIVE.find((m) => m.kategorien[0] === k.slug) ?? MOTIVE.find((m) => m.kategorien.includes(k.slug));
                const bild = beispiel ? motivBild(beispiel.slug) : undefined;
                const farbe = WELT_FARBEN[k.slug];
                return (
                  <Link key={k.slug} href={`/kategorie/${k.slug}`} className="card p-3 group" onClick={() => setMega(false)}>
                    {bild && (
                      <span className="zoomwrap block rounded-[4px] overflow-hidden mb-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bild.klein} alt={k.name} className="aspect-square object-cover w-full" loading="lazy" />
                      </span>
                    )}
                    <span className="chip mb-1.5" style={{ color: farbe.fg, background: farbe.bg }}>{k.name}</span>
                    <span className="block text-[12px] text-muted mt-0.5">{k.claim}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Slide-in */}
      {mobil && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobil(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-surface overflow-y-auto fade-in">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <Image src="/logo.png" alt="Homedeko Store" width={150} height={40} className="h-9 w-auto" />
              <button onClick={() => setMobil(false)} aria-label="Menü schließen" className="p-2"><IconClose size={22} /></button>
            </div>
            <form onSubmit={suchen} className="p-4 border-b border-line relative">
              <input
                value={q} onChange={(e) => setQ(e.target.value)} placeholder="Motiv suchen …"
                className="w-full border border-line rounded-[4px] bg-bg px-4 py-2.5 text-[14px] outline-none focus:border-accent"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-muted" aria-label="Suchen"><IconSearch size={18} /></button>
            </form>
            <div className="p-2">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setMobil(false)} className="block px-3 py-3 text-[15px] font-medium border-b border-line">{n.label}</Link>
              ))}
              <div className="px-3 pt-4 pb-1 eyebrow">Motiv-Welten</div>
              {KATEGORIEN.map((k) => (
                <Link key={k.slug} href={`/kategorie/${k.slug}`} onClick={() => setMobil(false)} className="block px-3 py-2.5 text-[14.5px] border-b border-line last:border-0">{k.name}</Link>
              ))}
              <Link href="/motive" onClick={() => setMobil(false)} className="block px-3 py-3 text-[15px] font-medium">Alle Motive</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
