"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { euro } from "@/lib/preise";

type Groesse = { label: string; b?: number; h?: number; preis: number; beliebt?: boolean };
type DBBild = { id: string; url: string; typ: string; sortierung: number };
type MotivItem = {
  slug: string; name: string | null; untertitel: string | null; intro: string | null;
  bestseller: boolean | null; aktiv: boolean; kategorien: string[] | null;
  eigen: boolean; format: string; bild: string | null; dbBilder: DBBild[]; ausnahmen: string[];
  ausnahmeGroessen: Record<string, Groesse[]>; variantenAus: string[];
};
type Props = {
  motive: MotivItem[];
  kategorien: { slug: string; name: string }[];
  produktarten: { art: string; name: string }[];
  vorlagen: Record<string, Groesse[]>;
};

/* ── Bild-Verwaltung eines Motivs ─────────────────────────────────────── */
function BilderTab({ slug, bilder, onChange }: { slug: string; bilder: DBBild[]; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [fehler, setFehler] = useState("");

  const hochladen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateien = Array.from(e.target.files ?? []);
    if (!dateien.length) return;
    setBusy(true); setFehler("");
    for (const datei of dateien) {
      const fd = new FormData();
      fd.append("file", datei);
      fd.append("motivSlug", slug);
      fd.append("typ", "ans");
      const res = await fetch("/api/admin/bilder", { method: "POST", body: fd });
      if (!res.ok) { setFehler((await res.json()).fehler ?? "Upload fehlgeschlagen."); break; }
    }
    setBusy(false);
    e.target.value = "";
    onChange();
  };

  const loeschen = async (bild: DBBild) => {
    if (!confirm("Bild wirklich löschen?")) return;
    await fetch(`/api/admin/bilder?id=${bild.id}&url=${encodeURIComponent(bild.url)}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {bilder.map((b) => (
          <div key={b.id} className="relative group aspect-square rounded-lg overflow-hidden border border-[#e5e2dc]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => loeschen(b)} aria-label="Löschen"
              className="absolute top-1 right-1 h-7 w-7 flex items-center justify-center rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
            </button>
            <span className="absolute bottom-1 left-1 text-[9px] font-semibold uppercase bg-black/55 text-white rounded px-1 py-0.5">{b.typ}</span>
          </div>
        ))}
        <label className={`aspect-square rounded-lg border-2 border-dashed border-[#cfc9bf] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-bordeaux hover:bg-bordeaux-soft transition-colors ${busy ? "opacity-50 pointer-events-none" : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="text-muted"><path d="M12 5v14M5 12h14" /></svg>
          <span className="text-[11px] font-medium text-muted">{busy ? "lädt …" : "Bild"}</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={hochladen} disabled={busy} />
        </label>
      </div>
      {fehler && <p className="text-[12.5px] text-bordeaux font-medium">{fehler}</p>}
      <p className="text-[12px] text-muted">Erstes Bild = Hauptansicht im Shop. JPG/PNG/WebP, max. 10 MB. „wb“ = Wohnbeispiel.</p>
    </div>
  );
}

/* ── Varianten & Preise eines Motivs ──────────────────────────────────── */
function PreiseTab({ motiv, produktarten, vorlagen, onChange }: {
  motiv: MotivItem; produktarten: Props["produktarten"]; vorlagen: Props["vorlagen"]; onChange: () => void;
}) {
  const arten = produktarten.filter((pa) => pa.art !== "poster");
  const [art, setArt] = useState("leinwand");
  const format = motiv.format || "quadrat";
  const hatAusnahme = motiv.ausnahmen.includes(art);
  const varianteAus = motiv.variantenAus.includes(art);

  // Startzeilen: vorhandene Ausnahme > Standard-Vorlage
  const startZeilen = () => motiv.ausnahmeGroessen[art] ?? vorlagen[`${art}::${format}`] ?? [];
  const [zeilen, setZeilen] = useState<Groesse[]>(startZeilen);
  const [status, setStatus] = useState<"" | "ok" | "busy">("");

  const artWechsel = (a: string) => {
    setArt(a); setStatus("");
    setZeilen(motiv.ausnahmeGroessen[a] ?? vorlagen[`${a}::${format}`] ?? []);
  };

  const setFeld = (i: number, feld: keyof Groesse, v: string | boolean) =>
    setZeilen((z) => z.map((g, idx) => idx === i ? { ...g, [feld]: v } : g));
  const beliebtSetzen = (i: number) =>
    setZeilen((z) => z.map((g, idx) => ({ ...g, beliebt: idx === i ? !g.beliebt : false })));
  const zeileWeg = (i: number) => setZeilen((z) => z.filter((_, idx) => idx !== i));
  const zeileNeu = () => setZeilen((z) => [...z, { label: "", b: undefined, h: undefined, preis: 0 }]);

  const varianteToggle = async () => {
    await fetch("/api/admin/variante", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivSlug: motiv.slug, art, aus: !varianteAus }),
    });
    onChange();
  };
  const speichern = async () => {
    setStatus("busy");
    await fetch("/api/admin/preis-override", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivSlug: motiv.slug, art, groessen: zeilen }),
    });
    setStatus("ok"); setTimeout(() => setStatus(""), 2000); onChange();
  };
  const zuruecksetzen = async () => {
    await fetch(`/api/admin/preis-override?key=${motiv.slug}::${art}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div>
      {/* Varianten-Umschalter */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {arten.map((pa) => {
          const aus = motiv.variantenAus.includes(pa.art);
          return (
            <button key={pa.art} onClick={() => artWechsel(pa.art)}
              className={`text-[12.5px] font-medium rounded-full px-3 py-1.5 border transition-colors relative ${art === pa.art ? "bg-ink-strong text-white border-ink-strong" : `bg-white border-[#e0ddd6] hover:border-[#cfc9bf] ${aus ? "text-[#c0392b] line-through" : "text-muted"}`}`}>
              {pa.name}
              {motiv.ausnahmen.includes(pa.art) && !aus && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold" title="Eigener Preis" />}
            </button>
          );
        })}
      </div>

      {/* An/Aus-Schalter für diese Variante */}
      <div className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 mb-3 ${varianteAus ? "border-[#e8c9c4] bg-[#fbf1ef]" : "border-ok/30 bg-ok-soft"}`}>
        <span className="text-[13px] font-medium">
          {varianteAus
            ? <span className="text-[#c0392b]">Diese Variante ist im Shop <b>ausgeschaltet</b> — nicht kaufbar.</span>
            : <span className="text-ok">Diese Variante ist im Shop <b>verfügbar</b>.</span>}
        </span>
        <button onClick={varianteToggle}
          className={`shrink-0 relative h-6 w-11 rounded-full transition-colors ${varianteAus ? "bg-[#d5d0c6]" : "bg-ok"}`}
          aria-label="Variante an/aus">
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${varianteAus ? "left-0.5" : "left-[22px]"}`} />
        </button>
      </div>

      {/* Größen-Editor (nur wenn Variante an) */}
      {!varianteAus && (
        <>
          <p className="text-[12.5px] text-muted mb-2">
            {hatAusnahme
              ? "Eigene Größen & Preise für dieses Produkt (weicht von „Preise & Größen“ ab)."
              : "Standard: Größen/Preise aus „Preise & Größen“. Bearbeite hier, um NUR für dieses Motiv abzuweichen — Größen hinzufügen, umbenennen, löschen."}
          </p>
          <div className="hidden sm:grid grid-cols-[1fr_60px_60px_80px_54px_32px] gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted px-1 mb-1">
            <span>Bezeichnung</span><span>Breite</span><span>Höhe</span><span>Preis €</span><span>Top</span><span></span>
          </div>
          <div className="space-y-1.5">
            {zeilen.map((g, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_60px_60px_80px_54px_32px] gap-1.5 items-center">
                <input value={g.label} onChange={(e) => setFeld(i, "label", e.target.value)} placeholder="z.B. 80 × 80 cm"
                  className="col-span-2 sm:col-span-1 rounded-md border border-[#dcd8d0] px-2.5 py-1.5 text-[13.5px] outline-none focus:border-bordeaux" />
                <input value={g.b ?? ""} onChange={(e) => setFeld(i, "b", e.target.value)} placeholder="cm" inputMode="numeric"
                  className="rounded-md border border-[#dcd8d0] px-2 py-1.5 text-[13.5px] outline-none focus:border-bordeaux" />
                <input value={g.h ?? ""} onChange={(e) => setFeld(i, "h", e.target.value)} placeholder="cm" inputMode="numeric"
                  className="rounded-md border border-[#dcd8d0] px-2 py-1.5 text-[13.5px] outline-none focus:border-bordeaux" />
                <input value={g.preis} onChange={(e) => setFeld(i, "preis", e.target.value)} inputMode="decimal"
                  className="rounded-md border border-[#dcd8d0] px-2 py-1.5 text-[13.5px] font-semibold outline-none focus:border-bordeaux" />
                <button onClick={() => beliebtSetzen(i)} title="Beliebteste Größe"
                  className={`h-8 rounded-md border text-[13px] ${g.beliebt ? "bg-gold text-white border-gold" : "border-[#dcd8d0] text-muted hover:border-gold"}`}>{g.beliebt ? "★" : "☆"}</button>
                <button onClick={() => zeileWeg(i)} aria-label="Größe löschen"
                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted hover:text-bordeaux hover:bg-bordeaux-soft">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 mt-3">
            <button onClick={zeileNeu} className="text-[12.5px] font-semibold text-bordeaux hover:underline">+ Größe hinzufügen</button>
            <div className="flex items-center gap-3">
              {hatAusnahme && <button onClick={zuruecksetzen} className="text-[12px] font-medium text-muted hover:text-bordeaux">Zurück zum Standard</button>}
              {status === "ok" && <span className="text-[12.5px] font-medium text-ok">✓ Gespeichert</span>}
              <button onClick={speichern} disabled={status === "busy"}
                className="rounded-md bg-ink-strong text-white font-semibold px-4 py-1.5 text-[13px] disabled:opacity-50">
                {status === "busy" ? "Speichert …" : "Größen & Preise speichern"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Eine Motiv-Zeile mit Tabs ────────────────────────────────────────── */
function MotivZeile({ m, kategorien, produktarten, vorlagen, onChange }: {
  m: MotivItem; kategorien: Props["kategorien"]; produktarten: Props["produktarten"]; vorlagen: Props["vorlagen"]; onChange: () => void;
}) {
  const router = useRouter();
  const [aktiv, setAktiv] = useState(m.aktiv);
  const [bestseller, setBestseller] = useState(!!m.bestseller);
  const [name, setName] = useState(m.name ?? "");
  const [untertitel, setUntertitel] = useState(m.untertitel ?? "");
  const [intro, setIntro] = useState(m.intro ?? "");
  const [tab, setTab] = useState<"" | "texte" | "bilder" | "preise">("");
  const [status, setStatus] = useState<"" | "ok" | "busy">("");

  const api = m.eigen ? "/api/admin/eigene-motive" : "/api/admin/motive";

  const patch = async (felder: Record<string, unknown>) => {
    await fetch(api, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: m.slug, ...felder }) });
  };
  const toggleAktiv = async () => { const n = !aktiv; setAktiv(n); await patch({ aktiv: n }); onChange(); };
  const toggleBestseller = async () => { const n = !bestseller; setBestseller(n); await patch({ bestseller: n }); onChange(); };
  const texteSpeichern = async () => {
    setStatus("busy"); await patch({ name, untertitel, intro }); setStatus("ok"); setTimeout(() => setStatus(""), 2000); onChange();
  };
  const motivLoeschen = async () => {
    if (!confirm(`Motiv „${name}“ und alle seine Bilder wirklich löschen?`)) return;
    await fetch(`/api/admin/eigene-motive?slug=${m.slug}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div className={`bg-white rounded-xl border ${aktiv ? "border-[#e5e2dc]" : "border-[#e5e2dc] opacity-60"}`}>
      <div className="flex items-center gap-3 p-3">
        {m.bild
          ? /* eslint-disable-next-line @next/next/no-img-element */
            <img src={m.bild} alt={name} className="h-14 w-14 rounded-lg object-cover border border-line shrink-0" />
          : <div className="h-14 w-14 rounded-lg bg-[#f2f0ec] shrink-0 flex items-center justify-center text-muted text-[10px]">kein Bild</div>}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[14.5px] text-ink-strong truncate">{name || m.slug}</span>
            {m.eigen && <span className="text-[10px] font-bold uppercase tracking-wide text-bordeaux bg-bordeaux-soft rounded px-1.5 py-0.5 shrink-0">Eigen</span>}
            {bestseller && <span className="text-[10px] font-bold uppercase tracking-wide text-gold-ink bg-gold-soft rounded px-1.5 py-0.5 shrink-0">Bestseller</span>}
            {m.ausnahmen.length > 0 && <span className="text-[10px] font-medium text-gold-ink shrink-0" title="Preis-Ausnahmen aktiv">★ {m.ausnahmen.length} Preis-Ausnahme{m.ausnahmen.length > 1 ? "n" : ""}</span>}
            {m.variantenAus.length > 0 && <span className="text-[10px] font-medium text-[#c0392b] shrink-0" title="Ausgeschaltete Varianten">{m.variantenAus.length} Variante{m.variantenAus.length > 1 ? "n" : ""} aus</span>}
          </div>
          <div className="text-[12.5px] text-muted truncate">{untertitel}</div>
        </div>
        <button onClick={toggleBestseller} title="Bestseller" className={`shrink-0 h-9 w-9 rounded-md border text-[15px] ${bestseller ? "bg-gold-soft border-gold text-gold-ink" : "border-[#e0ddd6] text-muted hover:border-gold"}`}>{bestseller ? "★" : "☆"}</button>
        <button onClick={toggleAktiv} title={aktiv ? "Sichtbar" : "Ausgeblendet"} className={`shrink-0 relative h-6 w-11 rounded-full transition-colors ${aktiv ? "bg-ok" : "bg-[#d5d0c6]"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${aktiv ? "left-[22px]" : "left-0.5"}`} />
        </button>
        <button onClick={() => setTab((t) => t ? "" : "texte")} aria-label="Bearbeiten" className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md text-muted hover:bg-[#f2f0ec]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
        </button>
      </div>

      {tab && (
        <div className="border-t border-[#eee9e0]">
          {/* Tab-Leiste */}
          <div className="flex items-center gap-1 px-3 pt-3">
            {([["texte", "Texte"], ["bilder", "Bilder"], ["preise", "Preise"]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`text-[13px] font-medium rounded-md px-3 py-1.5 transition-colors ${tab === k ? "bg-[#f2f0ec] text-ink-strong" : "text-muted hover:bg-[#f7f6f4]"}`}>{label}</button>
            ))}
            {m.eigen && <button onClick={motivLoeschen} className="ml-auto text-[12.5px] font-medium text-bordeaux hover:underline px-2">Motiv löschen</button>}
          </div>

          <div className="p-4">
            {tab === "texte" && (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Untertitel</label>
                    <input value={untertitel} onChange={(e) => setUntertitel(e.target.value)} className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Beschreibung</label>
                  <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[13.5px] leading-relaxed outline-none focus:border-bordeaux resize-y" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  {status === "ok" && <span className="text-[13px] font-medium text-ok">✓ Gespeichert</span>}
                  <button onClick={texteSpeichern} disabled={status === "busy"} className="rounded-md bg-ink-strong text-white font-semibold px-5 py-2 text-[13.5px] disabled:opacity-50">{status === "busy" ? "Speichert …" : "Texte speichern"}</button>
                </div>
              </div>
            )}
            {tab === "bilder" && <BilderTab slug={m.slug} bilder={m.dbBilder} onChange={onChange} />}
            {tab === "preise" && <PreiseTab motiv={m} produktarten={produktarten} vorlagen={vorlagen} onChange={onChange} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Neues-Motiv-Formular ─────────────────────────────────────────────── */
function NeuesMotiv({ kategorien, onDone }: { kategorien: Props["kategorien"]; onDone: () => void }) {
  const [offen, setOffen] = useState(false);
  const [name, setName] = useState("");
  const [untertitel, setUntertitel] = useState("");
  const [intro, setIntro] = useState("");
  const [format, setFormat] = useState("quadrat");
  const [kats, setKats] = useState<string[]>([]);
  const [fehler, setFehler] = useState("");
  const [busy, setBusy] = useState(false);

  const anlegen = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setFehler("");
    const res = await fetch("/api/admin/eigene-motive", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, untertitel, intro, format, kategorien: kats }),
    });
    setBusy(false);
    if (res.ok) { setName(""); setUntertitel(""); setIntro(""); setKats([]); setOffen(false); onDone(); }
    else setFehler((await res.json()).fehler ?? "Fehler.");
  };

  if (!offen) {
    return (
      <button onClick={() => setOffen(true)} className="w-full rounded-xl border-2 border-dashed border-[#cfc9bf] py-4 text-[14px] font-semibold text-bordeaux hover:border-bordeaux hover:bg-bordeaux-soft transition-colors">
        + Neues Motiv anlegen
      </button>
    );
  }
  return (
    <form onSubmit={anlegen} className="bg-white rounded-xl border border-bordeaux/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-ink-strong">Neues Motiv</h2>
        <button type="button" onClick={() => setOffen(false)} className="text-[13px] text-muted hover:text-ink">Abbrechen</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="z.B. Goldene Welle" className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Untertitel</label>
          <input value={untertitel} onChange={(e) => setUntertitel(e.target.value)} placeholder="Kurzbeschreibung" className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Beschreibung</label>
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} placeholder="Ausführlicher Text fürs Produkt" className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[13.5px] outline-none focus:border-bordeaux resize-y" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-md border border-[#dcd8d0] px-2.5 py-2 text-[14px] outline-none focus:border-bordeaux bg-white">
            <option value="quadrat">Quadratisch</option>
            <option value="quer">Querformat</option>
          </select>
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Welten / Kategorien</label>
          <div className="flex flex-wrap gap-1.5">
            {kategorien.map((k) => (
              <button type="button" key={k.slug} onClick={() => setKats((s) => s.includes(k.slug) ? s.filter((x) => x !== k.slug) : [...s, k.slug])}
                className={`text-[12px] rounded-full px-2.5 py-1 border transition-colors ${kats.includes(k.slug) ? "bg-bordeaux text-white border-bordeaux" : "bg-white border-[#e0ddd6] text-muted hover:border-[#cfc9bf]"}`}>{k.name}</button>
            ))}
          </div>
        </div>
      </div>
      {fehler && <p className="text-[13px] text-bordeaux font-medium mb-3">{fehler}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy || !name} className="rounded-md bg-bordeaux text-white font-semibold px-5 py-2.5 text-[14px] disabled:opacity-50">{busy ? "Wird angelegt …" : "Motiv anlegen"}</button>
        <span className="text-[12.5px] text-muted">Bilder & Preise fügst du danach beim Motiv hinzu.</span>
      </div>
    </form>
  );
}

/* ── Hauptkomponente ──────────────────────────────────────────────────── */
export default function MotiveVerwaltung({ motive, kategorien, produktarten, vorlagen }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"alle" | "aktiv" | "aus" | "eigen">("alle");
  const aktualisieren = () => router.refresh();

  const gefiltert = motive.filter((m) =>
    filter === "alle" ? true : filter === "aktiv" ? m.aktiv : filter === "aus" ? !m.aktiv : m.eigen);

  return (
    <div className="space-y-4">
      <NeuesMotiv kategorien={kategorien} onDone={aktualisieren} />

      <div className="flex items-center gap-2">
        {([["alle", "Alle"], ["aktiv", "Sichtbar"], ["aus", "Ausgeblendet"], ["eigen", "Eigene"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`text-[13px] font-medium rounded-full px-3.5 py-1.5 border transition-colors ${filter === k ? "bg-ink-strong text-white border-ink-strong" : "bg-white border-[#e0ddd6] text-muted hover:border-[#cfc9bf]"}`}>{label}</button>
        ))}
        <span className="ml-auto text-[13px] text-muted">{gefiltert.length} Motive</span>
      </div>

      <div className="space-y-2.5">
        {gefiltert.map((m) => (
          <MotivZeile key={m.slug} m={m} kategorien={kategorien} produktarten={produktarten} vorlagen={vorlagen} onChange={aktualisieren} />
        ))}
      </div>
    </div>
  );
}
