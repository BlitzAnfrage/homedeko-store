"use client";
/* Scroll-Reveal — fail-safe: blendet [data-reveal]-Sektionen sanft ein.
   Sicherheit: Der Inhalt ist per CSS standardmäßig sichtbar. Erst hier wird die
   Versteck-Logik aktiviert (html.reveal-an) — und mehrere Notbremsen sorgen dafür,
   dass NIE etwas dauerhaft unsichtbar bleibt, falls der Observer nicht feuert. */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const alleZeigen = () => els.forEach((el) => el.classList.add("is-in"));

    // Ohne Observer / bei reduzierter Bewegung: sofort alles zeigen, gar nicht verstecken.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) { alleZeigen(); return; }

    // Versteck-Logik aktivieren und Observer starten.
    html.classList.add("reveal-an");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => {
      // Alles was schon (fast) im Viewport ist, sofort sichtbar — kein Warten auf Scroll.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.1) el.classList.add("is-in");
      else io.observe(el);
    });

    // Notbremse: falls doch etwas hängt, nach 2,5 s garantiert alles zeigen.
    const notbremse = setTimeout(alleZeigen, 2500);

    return () => { io.disconnect(); clearTimeout(notbremse); };
  }, [pathname]);

  return null;
}
