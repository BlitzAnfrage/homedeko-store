"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Übersicht", icon: "grid" },
  { href: "/admin/preise", label: "Preise & Größen", icon: "tag" },
  { href: "/admin/rabatte", label: "Rabattcodes", icon: "ticket" },
  { href: "/admin/motive", label: "Motive & Produkte", icon: "image" },
  { href: "/admin/upsells", label: "Upsells & Rabatte", icon: "plus" },
  { href: "/admin/bestellungen", label: "Bestellungen", icon: "box" },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: "gear" },
];

function Icon({ name }: { name: string }) {
  const p: Record<string, string> = {
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    tag: "M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.83 11l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83zM7 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
    ticket: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z",
    image: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm3 3.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM5 19l5-6 3 4 3-3 4 5z",
    box: "M21 8V21H3V8M1 3h22v5H1zM10 12h4",
    plus: "M12 5v14M5 12h14",
    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={p[name] ?? p.grid} />
    </svg>
  );
}

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  const [offen, setOffen] = useState(false);

  const abmelden = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  const aktiv = (href: string) =>
    href === "/admin" ? path === "/admin" : path.startsWith(href);

  const NavListe = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} onClick={() => setOffen(false)}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors ${
            aktiv(l.href) ? "bg-white text-ink-strong shadow-sm" : "text-[#5c5750] hover:bg-white/60"
          }`}>
          <span className={aktiv(l.href) ? "text-bordeaux" : "text-[#8a847b]"}><Icon name={l.icon} /></span>
          {l.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-[#e5e2dc] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-[17px] text-ink-strong">Homedeko</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-bordeaux bg-bordeaux-soft px-1.5 py-0.5 rounded">Admin</span>
        </div>
        <button onClick={() => setOffen((o) => !o)} aria-label="Menü" className="p-1.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </div>
      {offen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black/30" onClick={() => setOffen(false)}>
          <div className="absolute top-[52px] left-0 right-0 bg-[#f6f6f7] border-b border-[#e5e2dc] p-4" onClick={(e) => e.stopPropagation()}>
            {NavListe}
            <button onClick={abmelden} className="mt-3 w-full text-left rounded-md px-3 py-2 text-[14px] font-medium text-[#5c5750] hover:bg-white/60">Abmelden</button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-[#ecebe8] border-r border-[#e0ddd6] px-3 py-5">
        <div className="flex items-center gap-2 px-3 mb-6">
          <span className="font-display text-[19px] text-ink-strong">Homedeko</span>
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-bordeaux bg-bordeaux-soft px-1.5 py-0.5 rounded">Admin</span>
        </div>
        {NavListe}
        <div className="mt-auto pt-4 border-t border-[#e0ddd6]">
          <a href="/" target="_blank" className="flex items-center gap-2 rounded-md px-3 py-2 text-[13.5px] text-[#5c5750] hover:bg-white/60">
            Shop ansehen ↗
          </a>
          <button onClick={abmelden} className="w-full text-left rounded-md px-3 py-2 text-[13.5px] font-medium text-[#5c5750] hover:bg-white/60">Abmelden</button>
        </div>
      </aside>
    </>
  );
}
