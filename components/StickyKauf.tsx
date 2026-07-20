"use client";
import { useEffect, useState } from "react";
import { euro } from "@/lib/preise";

/* Mobile Sticky-Kaufleiste: erscheint nach Scroll, springt zur Kaufbox */
export default function StickyKauf({ name, ab }: { name: string; ab: number }) {
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const h = () => setSichtbar(window.scrollY > 520);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  if (!sichtbar) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface border-t border-line p-3 flex items-center gap-3 fade-in">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold truncate">{name}</div>
        <div className="text-[12.5px] text-muted">ab {euro(ab)} · versandfrei ab 60 €</div>
      </div>
      <a href="#kaufbox" className="btn-gold px-5 py-3 text-[14px] shrink-0">Größe wählen</a>
    </div>
  );
}
