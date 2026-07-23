"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { euro } from "@/lib/preise";
import type { Addon } from "@/lib/addons";
import type { MengenrabattSettings, MengenrabattStufe } from "@/lib/settings";

/* ── Add-ons ──────────────────────────────────────────────────────────── */
function AddonZeile({ a, onChange }: { a: Addon; onChange: () => void }) {
  const [titel, setTitel] = useState(a.titel);
  const [beschreibung, setBeschreibung] = useState(a.beschreibung);
  const [preis, setPreis] = useState(String(a.preis));
  const [aktiv, setAktiv] = useState(a.aktiv);
  const [vor, setVor] = useState(a.vorausgewaehlt);
  const [offen, setOffen] = useState(false);
  const [status, setStatus] = useState<"" | "ok" | "busy">("");

  const patch = async (felder: Record<string, unknown>) => {
    await fetch("/api/admin/addons", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, ...felder }) });
  };
  const toggleAktiv = async () => { const n = !aktiv; setAktiv(n); await patch({ aktiv: n }); onChange(); };
  const speichern = async () => {
    setStatus("busy");
    await patch({ titel, beschreibung, preis: Number(preis) || 0, vorausgewaehlt: vor });
    setStatus("ok"); setTimeout(() => setStatus(""), 2000); onChange();
  };
  const loeschen = async () => {
    if (!confirm(`„${titel}“ wirklich löschen?`)) return;
    await fetch(`/api/admin/addons?id=${a.id}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div className={`bg-white rounded-xl border ${aktiv ? "border-[#e5e2dc]" : "border-[#e5e2dc] opacity-60"}`}>
      <div className="flex items-center gap-3 p-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[14.5px] text-ink-strong truncate">{titel}</span>
            <span className="text-[13px] font-semibold text-gold-ink shrink-0">+{euro(Number(preis) || 0)}</span>
            {vor && <span className="text-[10px] font-bold uppercase tracking-wide text-ok bg-ok-soft rounded px-1.5 py-0.5 shrink-0">vorausgewählt</span>}
          </div>
          {beschreibung && <div className="text-[12.5px] text-muted truncate">{beschreibung}</div>}
        </div>
        <button onClick={toggleAktiv} title={aktiv ? "Sichtbar" : "Aus"} className={`shrink-0 relative h-6 w-11 rounded-full transition-colors ${aktiv ? "bg-ok" : "bg-[#d5d0c6]"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${aktiv ? "left-[22px]" : "left-0.5"}`} />
        </button>
        <button onClick={() => setOffen((o) => !o)} aria-label="Bearbeiten" className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md text-muted hover:bg-[#f2f0ec]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
        </button>
      </div>
      {offen && (
        <div className="border-t border-[#eee9e0] p-4 space-y-3">
          <div className="grid sm:grid-cols-[1fr_120px] gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Titel</label>
              <input value={titel} onChange={(e) => setTitel(e.target.value)} className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Aufpreis €</label>
              <input value={preis} onChange={(e) => setPreis(e.target.value)} inputMode="decimal" className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] font-semibold outline-none focus:border-bordeaux" />
            </div>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Beschreibung</label>
            <input value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[13.5px] outline-none focus:border-bordeaux" />
          </div>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" checked={vor} onChange={(e) => setVor(e.target.checked)} className="h-4 w-4 accent-bordeaux" />
            Im Warenkorb schon angehakt (aktiv vorausgewählt)
          </label>
          <div className="flex items-center justify-between gap-3">
            <button onClick={loeschen} className="text-[12.5px] font-medium text-bordeaux hover:underline">Löschen</button>
            <div className="flex items-center gap-3">
              {status === "ok" && <span className="text-[12.5px] font-medium text-ok">✓ Gespeichert</span>}
              <button onClick={speichern} disabled={status === "busy"} className="rounded-md bg-ink-strong text-white font-semibold px-4 py-1.5 text-[13px] disabled:opacity-50">{status === "busy" ? "…" : "Speichern"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NeuesAddon({ onDone }: { onDone: () => void }) {
  const [offen, setOffen] = useState(false);
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [preis, setPreis] = useState("");
  const [busy, setBusy] = useState(false);

  const anlegen = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/addons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titel, beschreibung, preis: Number(preis) || 0, aktiv: true }) });
    setBusy(false);
    if (res.ok) { setTitel(""); setBeschreibung(""); setPreis(""); setOffen(false); onDone(); }
  };

  if (!offen) return <button onClick={() => setOffen(true)} className="w-full rounded-xl border-2 border-dashed border-[#cfc9bf] py-3.5 text-[14px] font-semibold text-bordeaux hover:border-bordeaux hover:bg-bordeaux-soft transition-colors">+ Neues Extra anlegen</button>;
  return (
    <form onSubmit={anlegen} className="bg-white rounded-xl border border-bordeaux/30 p-4 space-y-3">
      <div className="grid sm:grid-cols-[1fr_120px] gap-3">
        <input value={titel} onChange={(e) => setTitel(e.target.value)} required placeholder="z.B. Geschenkverpackung" className="rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
        <input value={preis} onChange={(e) => setPreis(e.target.value)} placeholder="Preis €" inputMode="decimal" className="rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
      </div>
      <input value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="Kurze Beschreibung (optional)" className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[13.5px] outline-none focus:border-bordeaux" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy || !titel} className="rounded-md bg-bordeaux text-white font-semibold px-5 py-2 text-[13.5px] disabled:opacity-50">{busy ? "…" : "Anlegen"}</button>
        <button type="button" onClick={() => setOffen(false)} className="text-[13px] text-muted hover:text-ink">Abbrechen</button>
      </div>
    </form>
  );
}

/* ── Mengenrabatt ─────────────────────────────────────────────────────── */
function MengenrabattEditor({ mr, onDone }: { mr: MengenrabattSettings; onDone: () => void }) {
  const [aktiv, setAktiv] = useState(mr.aktiv);
  const [nurLeinwand, setNurLeinwand] = useState(mr.nur_leinwand);
  const [stufen, setStufen] = useState<MengenrabattStufe[]>(mr.stufen?.length ? mr.stufen : [{ ab: 2, prozent: 20 }]);
  const [status, setStatus] = useState<"" | "ok" | "busy">("");

  const setStufe = (i: number, feld: keyof MengenrabattStufe, v: string) =>
    setStufen((s) => s.map((st, idx) => idx === i ? { ...st, [feld]: Number(v) || 0 } : st));
  const stufeWeg = (i: number) => setStufen((s) => s.filter((_, idx) => idx !== i));
  const stufeNeu = () => setStufen((s) => [...s, { ab: (s[s.length - 1]?.ab ?? 1) + 1, prozent: 10 }]);

  const speichern = async () => {
    setStatus("busy");
    const sortiert = [...stufen].filter((s) => s.ab > 0).sort((a, b) => a.ab - b.ab);
    await fetch("/api/admin/einstellungen", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "mengenrabatt", wert: { aktiv, nur_leinwand: nurLeinwand, stufen: sortiert } }) });
    setStatus("ok"); setTimeout(() => setStatus(""), 2000); onDone();
  };

  return (
    <section className="bg-white rounded-xl border border-[#e5e2dc] p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[16px] font-semibold text-ink-strong">Mengenrabatt</h2>
        <button onClick={() => setAktiv((a) => !a)} className={`relative h-6 w-11 rounded-full transition-colors ${aktiv ? "bg-ok" : "bg-[#d5d0c6]"}`} aria-label="Mengenrabatt an/aus">
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${aktiv ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>
      <p className="text-[12.5px] text-muted mb-3">„Kauf mehr, spar mehr“ — je mehr Bilder im Warenkorb, desto höher der Rabatt. {aktiv ? "" : "(aktuell aus)"}</p>

      <div className="hidden sm:grid grid-cols-[1fr_1fr_32px] gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted px-1 mb-1">
        <span>Ab Anzahl Bilder</span><span>Rabatt %</span><span></span>
      </div>
      <div className="space-y-2">
        {stufen.map((st, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
            <input value={st.ab} onChange={(e) => setStufe(i, "ab", e.target.value)} inputMode="numeric" placeholder="ab 2" className="rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
            <input value={st.prozent} onChange={(e) => setStufe(i, "prozent", e.target.value)} inputMode="numeric" placeholder="20" className="rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] font-semibold outline-none focus:border-bordeaux" />
            <button onClick={() => stufeWeg(i)} aria-label="Stufe löschen" className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-bordeaux hover:bg-bordeaux-soft">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
            </button>
          </div>
        ))}
      </div>
      <button onClick={stufeNeu} className="mt-2 text-[13px] font-semibold text-bordeaux hover:underline">+ Stufe hinzufügen</button>

      <label className="flex items-center gap-2 text-[13px] cursor-pointer mt-4">
        <input type="checkbox" checked={nurLeinwand} onChange={(e) => setNurLeinwand(e.target.checked)} className="h-4 w-4 accent-bordeaux" />
        Nur Leinwandbilder zählen (Poster/Tapeten ausgenommen)
      </label>

      <div className="flex items-center justify-end gap-3 mt-4">
        {status === "ok" && <span className="text-[13px] font-medium text-ok">✓ Gespeichert</span>}
        <button onClick={speichern} disabled={status === "busy"} className="rounded-md bg-ink-strong text-white font-semibold px-5 py-2 text-[13.5px] disabled:opacity-50">{status === "busy" ? "Speichert …" : "Mengenrabatt speichern"}</button>
      </div>
    </section>
  );
}

export default function UpsellsVerwaltung({ addons, mengenrabatt }: { addons: Addon[]; mengenrabatt: MengenrabattSettings }) {
  const router = useRouter();
  const onDone = () => router.refresh();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-[16px] font-semibold text-ink-strong mb-1">Extras (Add-ons)</h2>
        <p className="text-[12.5px] text-muted mb-3">Zusatzleistungen, die der Kunde im Warenkorb ankreuzt.</p>
        <div className="space-y-2.5">
          {addons.map((a) => <AddonZeile key={a.id} a={a} onChange={onDone} />)}
          <NeuesAddon onDone={onDone} />
        </div>
      </div>
      <MengenrabattEditor mr={mengenrabatt} onDone={onDone} />
    </div>
  );
}
