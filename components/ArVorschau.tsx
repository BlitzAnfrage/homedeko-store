"use client";
/* AR-Wandvorschau v5 — Kamera-first wie eine echte Kamera-App:
   Öffnen → Sucher geht direkt auf, vollflächig. Die Führung ist rein visuell,
   ohne Text: Drittel-Raster, mitdrehende Wasserwaage-Linie und ein grünes Glühen,
   sobald das Handy gerade gehalten wird. Ein großer Auslöser.
   Nach dem Schuss: Motiv platzieren, Motiv direkt wechseln, Größe wählen und per
   Zwei-Finger-Zoom / Regler an die eigene Wand anpassen (das Handy kann die
   Entfernung nicht messen — der Nutzer justiert selbst), dann kaufen.
   Ohne Kamera (Desktop/HTTP): eleganter Foto-Upload statt Sucher. */
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { euro, Groesse } from "@/lib/preise";
import { MOTIVE, produktById, motivBild, type Produkt } from "@/lib/katalog";
import { IconCamera, IconCart, IconCheck, IconClose, IconMove } from "./Icon";

type Phase = "lade" | "sucher" | "upload" | "platzieren";

function vibrieren(ms: number) {
  try { navigator.vibrate?.(ms); } catch {}
}

export default function ArVorschau({ p, offen, zu }: { p: Produkt; offen: boolean; zu: () => void }) {
  const cart = useCart();
  const [phase, setPhase] = useState<Phase>("lade");
  const [foto, setFoto] = useState<string | null>(null);
  /* aktives Motiv im AR — Start = übergebenes Produkt, im Platzieren wechselbar */
  const [motivSlug, setMotivSlug] = useState(p.motiv.slug);
  const [gIdx, setGIdx] = useState(() => Math.max(0, p.groessen.findIndex((g) => g.beliebt)));
  const [pos, setPos] = useState({ x: 50, y: 42 });
  /* Manuelle Feinskalierung des Motivs (1 = maßstabsgetreu). Ersetzt die vom
     Handy NICHT messbare Wand-Entfernung: Nutzer zieht/pincht größer/kleiner,
     um „näher/weiter" auszugleichen. */
  const [skala, setSkala] = useState(1);
  const wandCm = 350; // angenommene sichtbare Wandbreite bei üblichem Foto-Abstand
  const [hinweisAus, setHinweisAus] = useState(false);
  const [funken, setFunken] = useState<{ dx: number; dy: number; l: number; t: number }[]>([]);
  const [gespeichert, setGespeichert] = useState(false);
  const [imKorb, setImKorb] = useState(false);
  const [neigung, setNeigung] = useState<{ beta: number; gamma: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const buehneRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  /* Pinch-Zoom: aktive Finger + Startdistanz/Startskala für Zwei-Finger-Geste */
  const zeigerRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ dist: number; skala: number } | null>(null);

  /* Aktives Produkt = Leinwand-Version des gewählten Motivs (im AR immer Leinwand). */
  const aktP = produktById(`leinwandbild-${motivSlug}`) ?? p;
  const groesse: Groesse = aktP.groessen[Math.min(gIdx, aktP.groessen.length - 1)];
  const ratio = (groesse.b ?? 1) / (groesse.h ?? 1);
  const motiv = aktP.bilder[0]?.big ?? "";
  const panels = aktP.art === "set3" ? 3 : 1;
  const gesamtCm = (groesse.b ?? 60) * panels + (panels - 1) * 5;
  const overlayPct = Math.min(98, Math.max(12, (gesamtCm / wandCm) * 100 * skala));

  const kameraStoppen = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  /* Beim Öffnen: direkt in die Kamera. Klappt es nicht → Upload-Ansicht. */
  /* Hintergrund-Scroll sperren, solange das AR-Fenster offen ist (iOS-fest) */
  useEffect(() => {
    if (!offen) return;
    const y = window.scrollY;
    const s = document.body.style;
    s.position = "fixed"; s.top = `-${y}px`; s.left = "0"; s.right = "0"; s.overflow = "hidden";
    return () => {
      s.position = ""; s.top = ""; s.left = ""; s.right = ""; s.overflow = "";
      window.scrollTo(0, y);
    };
  }, [offen]);

  useEffect(() => {
    if (!offen) {
      kameraStoppen();
      setPhase("lade"); setFoto(null); setHinweisAus(false);
      setGespeichert(false); setNeigung(null);
      setMotivSlug(p.motiv.slug); setSkala(1); setPos({ x: 50, y: 42 });
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

  /* Neigungssensor für die Horizont-Linie im Sucher.
     iOS 13+ braucht requestPermission() nach einer NUTZER-GESTE (Tap) — deshalb
     wird der Listener hier gebunden, aber die iOS-Freigabe passiert im Tap-Handler
     sensorAnfordern() (unten). Auf Android/älterem iOS feuert der Sensor direkt. */
  useEffect(() => {
    if (!offen || phase !== "sucher") return;
    const h = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      setNeigung({ beta: e.beta, gamma: e.gamma });
    };
    window.addEventListener("deviceorientation", h);
    return () => window.removeEventListener("deviceorientation", h);
  }, [offen, phase]);

  const sensorAnfordern = useCallback(async () => {
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === "function") {
      try { await DOE.requestPermission(); } catch {}
    }
  }, []);

  if (!offen) return null;

  // großzügige Toleranz: „gerade genug", damit der grüne Rand realistisch erreichbar ist
  const gerade = neigung != null && Math.abs(neigung.gamma) < 8 && Math.abs(neigung.beta - 90) < 22;
  const sensorMoeglich = typeof window !== "undefined"
    && typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === "function";

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

  const fingerDist = () => {
    const [a, b] = [...zeigerRef.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const dragStart = (e: React.PointerEvent) => {
    setHinweisAus(true);
    zeigerRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (zeigerRef.current.size === 2) {
      // zweiter Finger → Pinch beginnt, Einzel-Drag pausiert
      dragRef.current = null;
      pinchRef.current = { dist: fingerDist(), skala };
      return;
    }
    const rect = buehneRef.current!.getBoundingClientRect();
    dragRef.current = { dx: (e.clientX - rect.left) / rect.width * 100 - pos.x, dy: (e.clientY - rect.top) / rect.height * 100 - pos.y };
  };
  const dragMove = (e: React.PointerEvent) => {
    if (zeigerRef.current.has(e.pointerId)) zeigerRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // Pinch: Motiv größer/kleiner ziehen (= „näher/weiter" ausgleichen)
    if (pinchRef.current && zeigerRef.current.size >= 2) {
      const faktor = fingerDist() / pinchRef.current.dist;
      setSkala(Math.min(2.6, Math.max(0.45, pinchRef.current.skala * faktor)));
      return;
    }
    if (!dragRef.current) return;
    const rect = buehneRef.current!.getBoundingClientRect();
    setPos({
      x: Math.min(96, Math.max(4, (e.clientX - rect.left) / rect.width * 100 - dragRef.current.dx)),
      y: Math.min(96, Math.max(4, (e.clientY - rect.top) / rect.height * 100 - dragRef.current.dy)),
    });
  };
  const dragEnde = (e: React.PointerEvent) => {
    zeigerRef.current.delete(e.pointerId);
    if (zeigerRef.current.size < 2) pinchRef.current = null;
    if (zeigerRef.current.size === 0) dragRef.current = null;
  };

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
    a.download = `homedeko-${aktP.motiv.slug}-${groesse.label.replace(/[^\w]+/g, "-")}.jpg`;
    a.href = c.toDataURL("image/jpeg", 0.9);
    a.click();
    setGespeichert(true); setTimeout(() => setGespeichert(false), 3000);
  };

  const inWarenkorb = () => {
    cart.add({
      produktId: aktP.id, name: aktP.name, bild: aktP.bilder[0]?.klein ?? "",
      variante: `Leinwand · ${groesse.label}`,
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
    <div className="fixed inset-0 z-50 bg-black/88 flex items-stretch sm:items-center justify-center sm:p-3" onClick={zu}>
      <div className="bg-surface w-full h-full sm:h-auto sm:rounded-lg sm:max-w-3xl sm:max-h-[94vh] overflow-y-auto relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <div className="text-[15px] font-bold">„{aktP.motiv.name}“ an deiner Wand</div>
          <button onClick={zu} aria-label="Schließen" className="p-2 text-muted hover:text-ink"><IconClose size={22} /></button>
        </div>

        {/* Kamera startet … */}
        {phase === "lade" && (
          <div className="p-16 text-center text-muted text-[14px]">Kamera wird gestartet …</div>
        )}

        {/* ── Sucher (Kamera-first) — vollflächig & interaktiv ── */}
        {phase === "sucher" && (
          <div className="relative flex-1 bg-ink-strong overflow-hidden">
            <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />

            {/* Ausricht-Rahmen mit Eck-Marken (weiß) */}
            <div className="absolute inset-4 pointer-events-none rounded-[10px] border-2 transition-opacity duration-300"
              style={{ borderColor: "rgba(255,255,255,.5)", opacity: gerade ? 0 : 1 }} />
            {["left-4 top-4 border-l-2 border-t-2 rounded-tl-[10px]", "right-4 top-4 border-r-2 border-t-2 rounded-tr-[10px]",
              "left-4 bottom-4 border-l-2 border-b-2 rounded-bl-[10px]", "right-4 bottom-4 border-r-2 border-b-2 rounded-br-[10px]"].map((c) => (
              <span key={c} className={`absolute ${c} h-8 w-8 pointer-events-none transition-opacity duration-300`}
                style={{ borderColor: "#fff", opacity: gerade ? 0 : 1 }} />
            ))}

            {/* GRÜNES GLÜHEN wenn gerade gehalten — reines visuelles Signal, kein Text */}
            {gerade && <div className="gerade-glow rounded-[6px]" />}

            {/* Drittel-Raster dezent */}
            <span className="raster-linie left-1/3 top-0 bottom-0 w-px" />
            <span className="raster-linie left-2/3 top-0 bottom-0 w-px" />
            <span className="raster-linie top-1/3 left-0 right-0 h-px" />
            <span className="raster-linie top-2/3 left-0 right-0 h-px" />

            {/* Wasserwaage-Linie: dreht mit dem Handy, grün wenn gerade */}
            {neigung && (
              <div className="absolute left-0 right-0 top-1/2 flex justify-center pointer-events-none">
                <div className="horizont w-[50%]" data-ok={gerade}
                  style={{ transform: `rotate(${Math.max(-25, Math.min(25, -neigung.gamma))}deg)` }} />
              </div>
            )}

            {/* iOS: einmaliger Tap, um die Wasserwaage (Neigungssensor) zu aktivieren */}
            {sensorMoeglich && !neigung && (
              <button onClick={sensorAnfordern}
                className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[13px] font-semibold px-4 py-2 rounded-full">
                Wasserwaage aktivieren
              </button>
            )}

            {/* Auslöser groß + Galerie */}
            <div className="absolute bottom-7 inset-x-0 flex items-center justify-center">
              <button onClick={ausloesen} aria-label="Foto aufnehmen"
                className={`ausloeser ${gerade ? "!border-[var(--ok)]" : ""}`}><span /></button>
              <label className="glas cursor-pointer absolute right-5 bottom-4">
                Galerie
                <input type="file" accept="image/*" className="hidden" onChange={fotoLaden} />
              </label>
            </div>
          </div>
        )}

        {/* ── Upload-Screen (Desktop / keine Kamera) — clean & premium ── */}
        {phase === "upload" && (
          <div className="fade-in flex-1 flex flex-col">
            {/* großes stimmungsvolles Vorschaubild — füllt oben */}
            <div className="relative flex-1 min-h-[300px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={motiv} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute left-6 bottom-6 right-6 text-white">
                <div className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gold-bright mb-2">Live an deiner Wand</div>
                <h3 className="font-display text-[28px] sm:text-3xl leading-[1.15]">So sieht „{aktP.motiv.name}“ bei dir aus</h3>
              </div>
            </div>
            {/* Aktionsbereich unten — fest */}
            <div className="p-6 sm:p-8 text-center shrink-0">
              <p className="text-[14.5px] text-muted max-w-md mx-auto leading-relaxed">
                Lade ein Foto deiner Wand hoch — das Motiv wird maßstabsgetreu daraufgelegt,
                in deiner gewählten Größe.
              </p>
              <label className="btn-gold w-full sm:w-auto px-8 py-4 text-[15.5px] cursor-pointer inline-flex items-center justify-center gap-2.5 mt-5">
                <IconCamera size={20} /> Foto aufnehmen oder hochladen
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={fotoLaden} />
              </label>
              <p className="mt-4 text-[11.5px] text-muted">Dein Foto bleibt auf deinem Gerät — es wird nichts hochgeladen.</p>
            </div>
          </div>
        )}

        {/* ── Platzieren ── */}
        {phase === "platzieren" && foto && (
          <>
            <div ref={buehneRef} className="relative w-full shrink-0 aspect-[4/3] bg-ink-strong overflow-hidden select-none touch-none">
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
                <span className="glas"><IconMove size={15} /> Ziehen zum Platzieren · zwei Finger zum Zoomen</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4 relative">
              {/* Motiv wechseln — horizontale Scroll-Reihe aller Motive */}
              <div>
                <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Motiv wechseln</div>
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {MOTIVE.map((m) => {
                    const mb = motivBild(m.slug);
                    return (
                      <button key={m.slug} onClick={() => { vibrieren(10); setMotivSlug(m.slug); }}
                        className={`shrink-0 h-14 w-14 rounded-[6px] overflow-hidden border-2 transition-all ${m.slug === motivSlug ? "border-bordeaux scale-105" : "border-transparent opacity-70"}`}
                        aria-label={m.name}>
                        {mb && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={mb.klein} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Feinanpassung: gleicht Foto-Abstand aus (näher/weiter) — das Handy
                  kann Entfernung nicht messen, also justiert der Nutzer selbst. */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted">An deine Wand anpassen</span>
                  <button onClick={() => setSkala(1)} disabled={Math.abs(skala - 1) < 0.02}
                    className="text-[11.5px] font-semibold text-bordeaux disabled:opacity-30 disabled:cursor-default">Maßstab zurücksetzen</button>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { vibrieren(8); setSkala((s) => Math.max(0.45, +(s - 0.1).toFixed(2))); }}
                    aria-label="Kleiner" className="opt h-10 w-10 shrink-0 flex items-center justify-center text-[20px] font-bold leading-none">−</button>
                  <input type="range" min={0.45} max={2.6} step={0.01} value={skala}
                    onChange={(e) => setSkala(+e.target.value)}
                    className="ar-skala flex-1" aria-label="Motiv-Größe an der Wand" />
                  <button onClick={() => { vibrieren(8); setSkala((s) => Math.min(2.6, +(s + 0.1).toFixed(2))); }}
                    aria-label="Größer" className="opt h-10 w-10 shrink-0 flex items-center justify-center text-[20px] font-bold leading-none">+</button>
                </div>
                <p className="mt-1.5 text-[11.5px] text-muted">Bild schief oder zu groß? Zieh es mit zwei Fingern oder nutz den Regler, bis es zu deiner Wand passt.</p>
              </div>
              <div>
                <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Größe wählen</div>
                <div className="grid grid-cols-2 gap-2">
                  {aktP.groessen.map((g, i) => (
                    <button key={g.label} className="opt relative px-3 py-2 text-left text-[13px] font-semibold" data-selected={i === gIdx}
                      onClick={() => { vibrieren(12); setGIdx(i); }}>
                      {g.beliebt && <span className="absolute right-2 top-2 text-[8.5px] font-bold uppercase tracking-wide bg-gold text-white rounded-[3px] px-1 py-0.5">Top</span>}
                      <span className="block whitespace-nowrap">{g.label}</span>
                      <span className="block text-muted font-normal text-[12.5px]">{euro(g.preis)}</span>
                    </button>
                  ))}
                </div>
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
