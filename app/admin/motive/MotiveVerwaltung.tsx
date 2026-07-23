"use client";
import { useState } from "react";
import type { MotivOverride } from "@/lib/admin-data";

type MotivMitBild = MotivOverride & { bild: string | null };

function MotivZeile({ m }: { m: MotivMitBild }) {
  const [aktiv, setAktiv] = useState(m.aktiv);
  const [bestseller, setBestseller] = useState(!!m.bestseller);
  const [name, setName] = useState(m.name ?? "");
  const [untertitel, setUntertitel] = useState(m.untertitel ?? "");
  const [intro, setIntro] = useState(m.intro ?? "");
  const [offen, setOffen] = useState(false);
  const [status, setStatus] = useState<"" | "ok" | "speichern">("");

  const patch = async (felder: Record<string, unknown>) => {
    await fetch("/api/admin/motive", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: m.slug, ...felder }),
    });
  };

  const toggleAktiv = async () => { const n = !aktiv; setAktiv(n); await patch({ aktiv: n }); };
  const toggleBestseller = async () => { const n = !bestseller; setBestseller(n); await patch({ bestseller: n }); };

  const texteSpeichern = async () => {
    setStatus("speichern");
    await patch({ name, untertitel, intro });
    setStatus("ok"); setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div className={`bg-white rounded-xl border transition-colors ${aktiv ? "border-[#e5e2dc]" : "border-[#e5e2dc] opacity-60"}`}>
      <div className="flex items-center gap-3 p-3">
        {m.bild ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={m.bild} alt={name} className="h-14 w-14 rounded-lg object-cover border border-line shrink-0" />
        ) : (
          <div className="h-14 w-14 rounded-lg bg-[#f2f0ec] shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[14.5px] text-ink-strong truncate">{name || m.slug}</span>
            {bestseller && <span className="text-[10.5px] font-bold uppercase tracking-wide text-gold-ink bg-gold-soft rounded px-1.5 py-0.5 shrink-0">Bestseller</span>}
          </div>
          <div className="text-[12.5px] text-muted truncate">{untertitel}</div>
        </div>

        {/* Bestseller-Stern */}
        <button onClick={toggleBestseller} title="Bestseller-Markierung"
          className={`shrink-0 h-9 w-9 rounded-md border text-[15px] ${bestseller ? "bg-gold-soft border-gold text-gold-ink" : "border-[#e0ddd6] text-muted hover:border-gold"}`}>
          {bestseller ? "★" : "☆"}
        </button>

        {/* Sichtbar-Toggle */}
        <button onClick={toggleAktiv} title={aktiv ? "Im Shop sichtbar" : "Ausgeblendet"}
          className={`shrink-0 relative h-6 w-11 rounded-full transition-colors ${aktiv ? "bg-ok" : "bg-[#d5d0c6]"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${aktiv ? "left-[22px]" : "left-0.5"}`} />
        </button>

        <button onClick={() => setOffen((o) => !o)} aria-label="Bearbeiten"
          className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md text-muted hover:bg-[#f2f0ec]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
        </button>
      </div>

      {offen && (
        <div className="border-t border-[#eee9e0] p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Untertitel</label>
              <input value={untertitel} onChange={(e) => setUntertitel(e.target.value)}
                className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
            </div>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Beschreibung</label>
            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4}
              className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[13.5px] leading-relaxed outline-none focus:border-bordeaux resize-y" />
          </div>
          <div className="flex items-center justify-end gap-3">
            {status === "ok" && <span className="text-[13px] font-medium text-ok">✓ Gespeichert</span>}
            <button onClick={texteSpeichern} disabled={status === "speichern"}
              className="rounded-md bg-ink-strong text-white font-semibold px-5 py-2 text-[13.5px] disabled:opacity-50">
              {status === "speichern" ? "Speichert …" : "Texte speichern"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MotiveVerwaltung({ motive }: { motive: MotivMitBild[] }) {
  const [filter, setFilter] = useState<"alle" | "aktiv" | "aus">("alle");
  const gefiltert = motive.filter((m) =>
    filter === "alle" ? true : filter === "aktiv" ? m.aktiv : !m.aktiv);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {([["alle", "Alle"], ["aktiv", "Sichtbar"], ["aus", "Ausgeblendet"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`text-[13px] font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
              filter === k ? "bg-ink-strong text-white border-ink-strong" : "bg-white border-[#e0ddd6] text-muted hover:border-[#cfc9bf]"
            }`}>
            {label}
          </button>
        ))}
        <span className="ml-auto text-[13px] text-muted">{gefiltert.length} Motive</span>
      </div>
      <div className="space-y-2.5">
        {gefiltert.map((m) => <MotivZeile key={m.slug} m={m} />)}
      </div>
    </div>
  );
}
