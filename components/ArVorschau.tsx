"use client";
/* AR-Wandvorschau v4 — Kamera-first wie eine echte Kamera-App:
   Öffnen → Sucher geht direkt auf. Die Führung passiert IM Bild: dezente
   Glas-Hinweise (2–3 m Abstand · gerade halten), Drittel-Raster, Live-Horizont-
   Linie (wird grün, wenn das Handy gerade ist) und ein großer Auslöser.
   Nach dem Schuss: Motiv maßstabsgetreu platzieren, Größe direkt wechseln, kaufen.
   Ohne Kamera (Desktop/HTTP): eleganter Foto-Upload statt Sucher. */
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { euro, Groesse } from "@/lib/preise";
import type { Produkt } from "@/lib/katalog";
import { IconCamera, IconCart, IconCheck, IconClose, IconMove, IconPerson, IconFrame } from "./Icon";

type Phase = "lade" | "sucher" | "upload" | "platzieren";

function vibrieren(ms: number) {
  try { navigator.vibrate?.(ms); } catch {}
}

export default function ArVorschau({ p, offen, zu }: { p: Produkt; offen: boolean; zu: () => void }) {
  const cart = useCart();
  const [phase, setPhase] = useState<Phase>("lade");
  const [foto, setFoto] = useState<string | null>(null);
  const [gIdx, setGIdx] = useState(() => Math.max(0, p.groessen.findIndex((g) => g.beliebt)));
  const [pos, setPos] = useState({ x: 50, y: 42 });
  const [wandCm, setWandCm] = useState(350);
  const [hinweisAus, setHinweisAus] = useState(false);
  const [funken, setFunken] = useState<{ dx: number; dy: number; l: number; t: number }[]>([]);
  const [gespeichert, setGespeichert] = useState(false);
  const [imKorb, setImKorb] = useState(false);
  const [neigung, setNeigung] = useState<{ beta: number; gamma: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const buehneRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  const groesse: Groesse = p.groessen[Math.min(gIdx, p.groessen.length - 1)];
  const ratio = (groesse.b ?? 1) / (groesse.h ?? 1);
  const motiv = p.bilder[0]?.big ?? "";
  const panels = p.art === "set3" ? 3 : 1;
  const gesamtCm = (groesse.b ?? 60) * panels + (panels - 1) * 5;
  const overlayPct = Math.min(96, (gesamtCm / wandCm) * 100);

  const kameraStoppen = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  /* Beim Öffnen: direkt in die Kamera. Klappt es nicht → Upload-Ansicht. */
  useEffect(() => {
    if (!offen) {
      kameraStoppen();
      setPhase("lade"); setFoto(null); setHinweisAus(false);
      setGespeichert(false); setNeigung(null);
      return;
    }
    let aktiv = true;
    (async () => {
      try {
        /* Max. 3 s auf die Kamera warten — sonst Upload-Fallback (hängt z. B.
           bei blockierten Berechtigungen oder fehlendem HTTPS) */
        const stream = await Promise.race([
          navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }),
          new Promise<never>((_, ablehnen) => setTimeout(() => ablehnen(new Error("Kamera-Timeout")), 3000)),
        ]);
        if (!aktiv) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        setPhase("sucher");
        requestAnimationFrame(() => {
          if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
        });
        setTimeout(() => setHinweisAus(true), 6500);
      } catch {
        if (aktiv) setPhase("upload");
      }
    })();
    return () => { aktiv = false; kameraStoppen(); };
  }, [offen, kameraStoppen]);

  /* Neigungssensor für die Horizont-Linie im Sucher */
  useEffect(() => {
    if (!offen || phase !== "sucher") return;
    const h = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      setNeigung({ beta: e.beta, gamma: e.gamma });
    };
    window.addEventListener("deviceorientation", h);
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === "function") DOE.requestPermission?.().catch(() => {});
    return () => window.removeEventListener("deviceorientation", h);
  }, [offen, phase]);

  if (!offen) return null;

  const gerade = neigung != null && Math.abs(neigung.gamma) < 4 && Math.abs(neigung.beta - 90) < 12;

  /* Auslöser: aktuellen Kamera-Frame einfrieren */
  const ausloesen = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    const B = Math.min(1600, v.videoWidth);
    c.width = B; c.height = Math.round(B * (v.videoHeight / v.videoWidth));
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    kameraStoppen();
    vibrieren(25);
    setFoto(c.toDataURL("image/jpeg", 0.92));
    setPhase("platzieren");
    setHinweisAus(false);
    setTimeout(() => setHinweisAus(true), 5200);
  };

  const fotoLaden = (e: React.ChangeEvent<HTMLInputElement>) => {
    const datei = e.target.files?.[0];
    if (!datei) return;
    const leser = new FileReader();
    leser.onload = () => {
      kameraStoppen();
      setFoto(String(leser.result));
      vibrieren(20);
      setPhase("platzieren");
      setHinweisAus(false);
      setTimeout(() => setHinweisAus(true), 5200);
    };
    leser.readAsDataURL(datei);
  };

  const dragStart = (e: React.PointerEvent) => {
    setHinweisAus(true);
    const b = buehneRef.current!.getBoundingClientRect();
    dragRef.current = { dx: (e.clientX - b.left) / b.width * 100 - pos.x, dy: (e.clientY - b.top) / b.height * 100 - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const dragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const b = buehneRef.current!.getBoundingClientRect();
    setPos({
      x: Math.min(96, Math.max(4, (e.clientX - b.left) / b.width * 100 - dragRef.current.dx)),
      y: Math.min(96, Math.max(4, (e.clientY - b.top) / b.height * 100 - dragRef.current.dy)),
    });
  };
  const dragEnde = () => { dragRef.current = null; };

  const speichern = async () => {
    if (!foto) return;
    const buehne = buehneRef.current!;
    const c = document.createElement("canvas");
    const B = 1280, H = Math.round(1280 * (buehne.clientHeight / buehne.clientWidth));
    c.width = B; c.height = H;
    const ctx = c.getContext("2d")!;
    const img = new Image();
    await new Promise((r) => { img.onload = r; img.src = foto; });
    const vr = img.width / img.height, br = B / H;
    const [sw0, sh0] = vr > br ? [img.height * br, img.height] : [img.width, img.width / br];
    ctx.drawImage(img, (img.width - sw0) / 2, (img.height - sh0) / 2, sw0, sh0, 0, 0, B, H);
    const m = new Image();
    await new Promise((r) => { m.onload = r; m.src = motiv; });
    const gesamtB = (overlayPct / 100) * B;
    const teilB = (gesamtB - (panels - 1) * 8) / panels;
    const teilH = teilB / ratio;
    ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    for (let i = 0; i < panels; i++) {
      const x = (pos.x / 100) * B - gesamtB / 2 + i * (teilB + 8);
      const y = (pos.y / 100) * H - teilH / 2;
      const mr = m.width / m.height, tr = teilB / teilH;
      let [sw, sh] = mr > tr ? [m.height * tr, m.height] : [m.width, m.width / tr];
      sw /= 1.32; sh /= 1.32;
      ctx.drawImage(m, (m.width - sw) / 2, (m.height - sh) / 2, sw, sh, x, y, teilB, teilH);
      ctx.save(); ctx.shadowColor = "transparent";
      const licht = ctx.createLinearGradient(x, y, x + teilB, y + teilH);
      licht.addColorStop(0, "rgba(255,255,255,.16)");
      licht.addColorStop(.4, "rgba(255,255,255,0)");
      licht.addColorStop(1, "rgba(0,0,0,.2)");
      ctx.fillStyle = licht; ctx.fillRect(x, y, teilB, teilH);
      ctx.restore();
    }
    const a = document.createElement("a");
    a.download = `homedeko-${p.motiv.slug}-${groesse.label.replace(/[^\w]+/g, "-")}.jpg`;
    a.href = c.toDataURL("image/jpeg", 0.9);
    a.click();
    setGespeichert(true); setTimeout(() => setGespeichert(false), 3000);
  };

  const inWarenkorb = () => {
    cart.add({
      produktId: p.id, name: p.name, bild: p.bilder[0]?.klein ?? "",
      variante: `${p.art === "set3" ? "3er-Set" : "Leinwand"} · ${groesse.label}`,
      preis: groesse.preis, menge: 1,
    });
    vibrieren(35);
    setFunken(Array.from({ length: 14 }, () => ({
      l: 46 + Math.random() * 8, t: 30 + Math.random() * 30,
      dx: (Math.random() - 0.5) * 260, dy: -40 - Math.random() * 160,
    })));
    setTimeout(() => setFunken([]), 900);
    setImKorb(true); setTimeout(() => setImKorb(false), 3200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/88 flex items-center justify-center p-3" onClick={zu}>
      <div className="bg-surface rounded-lg w-full max-w-3xl max-h-[94vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <div className="text-[15px] font-bold">„{p.motiv.name}“ an deiner Wand</div>
          <button onClick={zu} aria-label="Schließen" className="p-2 text-muted hover:text-ink"><IconClose size={22} /></button>
        </div>

        {/* Kamera startet … */}
        {phase === "lade" && (
          <div className="p-16 text-center text-muted text-[14px]">Kamera wird gestartet …</div>
        )}

        {/* ── Sucher (Kamera-first, Führung im Bild) ── */}
        {phase === "sucher" && (
          <div className="relative w-full aspect-[4/3] bg-ink-strong overflow-hidden">
            <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />

            {/* Drittel-Raster wie in der Kamera-App */}
            <span className="raster-linie left-1/3 top-0 bottom-0 w-px" />
            <span className="raster-linie left-2/3 top-0 bottom-0 w-px" />
            <span className="raster-linie top-1/3 left-0 right-0 h-px" />
            <span className="raster-linie top-2/3 left-0 right-0 h-px" />

            {/* Live-Horizont: dreht mit dem Handy, grün wenn gerade */}
            {neigung && (
              <div className="absolute left-0 right-0 top-1/2 flex justify-center pointer-events-none">
                <div className="horizont w-[42%]" data-ok={gerade}
                  style={{ transform: `rotate(${Math.max(-25, Math.min(25, -neigung.gamma))}deg)` }} />
              </div>
            )}

            {/* Dezente Hinweise im Bild — verschwinden von selbst */}
            <div className={`absolute top-3 inset-x-0 flex flex-wrap justify-center gap-2 px-3 transition-opacity duration-700 ${hinweisAus ? "opacity-0" : "opacity-100"}`}>
              <span className="glas"><IconPerson size={15} /> 2–3 m Abstand zur Wand</span>
              <span className="glas"><IconFrame size={15} /> Handy gerade & frontal</span>
            </div>
            {neigung && (
              <div className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none">
                <span className={`glas transition-colors ${gerade ? "!bg-ok/80" : ""}`}>
                  {gerade ? "✓ Gerade — jetzt auslösen" : "Linie waagerecht ausrichten"}
                </span>
              </div>
            )}

            {/* Auslöser-Zeile */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6">
              <button onClick={ausloesen} aria-label="Foto aufnehmen" className="ausloeser"><span /></button>
              <label className="glas cursor-pointer absolute right-4">
                Galerie
                <input type="file" accept="image/*" className="hidden" onChange={fotoLaden} />
              </label>
            </div>
          </div>
        )}

        {/* ── Upload-Fallback (Desktop / keine Kamera) ── */}
        {phase === "upload" && (
          <div className="p-8 sm:p-12 text-center fade-in">
            <h3 className="font-display text-2xl sm:text-[28px] text-ink-strong">Zeig uns deine Wand</h3>
            <p className="text-[14px] text-muted mt-2 max-w-md mx-auto leading-relaxed">
              Nimm mit dem Handy ein Foto auf oder lade eines hoch — danach legst du
              „{p.motiv.name}“ maßstabsgetreu darauf.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[13px] text-muted">
              <span className="inline-flex items-center gap-2"><IconPerson size={16} className="text-gold-ink" /> 2–3 m Abstand</span>
              <span className="inline-flex items-center gap-2"><IconFrame size={16} className="text-gold-ink" /> Gerade & frontal fotografieren</span>
            </div>
            <label className="btn-gold px-8 py-4 text-[15.5px] cursor-pointer inline-flex items-center gap-2.5 mt-7">
              <IconCamera size={20} /> Foto aufnehmen / hochladen
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={fotoLaden} />
            </label>
            <p className="mt-5 text-[11.5px] text-muted">Dein Foto bleibt auf deinem Gerät — es wird nichts hochgeladen.</p>
          </div>
        )}

        {/* ── Platzieren ── */}
        {phase === "platzieren" && foto && (
          <>
            <div ref={buehneRef} className="relative w-full aspect-[4/3] bg-ink-strong overflow-hidden select-none touch-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="Deine Wand" className="absolute inset-0 w-full h-full object-cover" />
              <div
                key={groesse.label}
                className="absolute cursor-move ar-pop"
                style={{
                  left: `${pos.x}%`, top: `${pos.y}%`, width: `${overlayPct}%`,
                  transform: "translate(-50%, -50%)", display: "flex", gap: 6,
                }}
                onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnde} onPointerCancel={dragEnde}
              >
                {Array.from({ length: panels }).map((_, i) => (
                  <span key={i} className="ar-motiv block flex-1 min-w-0 overflow-hidden rounded-[2px]"
                    style={{ aspectRatio: `${groesse.b ?? 1} / ${groesse.h ?? 1}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={motiv} alt="" draggable={false} className="w-full h-full object-cover" style={{ transform: "scale(1.32)" }} />
                  </span>
                ))}
              </div>
              <span className="absolute left-3 top-3 glas !py-1.5">
                {groesse.label} · {euro(groesse.preis)}
              </span>
              <div className={`absolute bottom-4 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-700 ${hinweisAus ? "opacity-0" : "opacity-100"}`}>
                <span className="glas"><IconMove size={15} /> Ziehen zum Platzieren — Größe unten antippen</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4 relative">
              <div>
                <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
                  Größe antippen — skaliert maßstabsgetreu
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.groessen.map((g, i) => (
                    <button key={g.label} className="opt px-3 py-1.5 text-[12.5px] font-semibold" data-selected={i === gIdx}
                      onClick={() => { vibrieren(12); setGIdx(i); }}>
                      {g.label} · {euro(g.preis)}{g.beliebt ? " ★" : ""}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] text-muted mb-1">
                  <span>Ich stehe näher</span><span>Feinjustierung Abstand</span><span>Ich stehe weiter weg</span>
                </div>
                <input type="range" min={220} max={520} step={10} value={wandCm} onChange={(e) => setWandCm(Number(e.target.value))}
                  className="w-full accent-[#b18435]" aria-label="Abstand feinjustieren" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 relative">
                <button onClick={inWarenkorb} className="btn-gold flex-1 py-3.5 text-[15px] flex items-center justify-center gap-2">
                  <IconCart size={18} /> {groesse.label} in den Warenkorb — {euro(groesse.preis)}
                </button>
                <button onClick={speichern} className="btn-ghost px-5 py-3.5 text-[14px]">Vorschau speichern</button>
                {funken.map((f, i) => (
                  <span key={i} className="funke" style={{ left: `${f.l}%`, top: `${f.t}%`, "--dx": `${f.dx}px`, "--dy": `${f.dy}px` } as React.CSSProperties}>✦</span>
                ))}
              </div>
              {imKorb && (
                <p className="fade-in flex items-center gap-2 text-[13.5px] font-medium text-ok"><IconCheck size={16} /> Im Warenkorb!</p>
              )}
              {gespeichert && (
                <p className="fade-in flex items-center gap-2 text-[13.5px] font-medium text-ok"><IconCheck size={16} /> Vorschau-Bild gespeichert.</p>
              )}
              <div className="flex gap-4 text-[12.5px] text-muted">
                <label className="underline cursor-pointer">
                  Anderes Foto
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={fotoLaden} />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
