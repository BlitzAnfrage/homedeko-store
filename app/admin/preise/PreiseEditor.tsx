"use client";
import { useState } from "react";
import type { Preisstaffel } from "@/lib/admin-data";

type Groesse = Preisstaffel["groessen"][number];

const ART_LABEL: Record<string, string> = {
  leinwand: "Leinwand", poster: "Poster", set3: "3er-Set", tapete: "Tapete", wallprint: "Wallprint",
};

function StaffelKarte({ staffel }: { staffel: Preisstaffel }) {
  const [zeilen, setZeilen] = useState<Groesse[]>(staffel.groessen);
  const [status, setStatus] = useState<"" | "speichern" | "ok" | "fehler">("");
  const [offen, setOffen] = useState(false);

  const aendern = (i: number, feld: keyof Groesse, wert: string | boolean) => {
    setZeilen((z) => z.map((g, idx) => idx === i ? { ...g, [feld]: wert } : g));
    setStatus("");
  };
  const beliebtSetzen = (i: number) => {
    // nur eine Größe darf „beliebt“ sein
    setZeilen((z) => z.map((g, idx) => ({ ...g, beliebt: idx === i ? !g.beliebt : false })));
    setStatus("");
  };
  const zeileWeg = (i: number) => { setZeilen((z) => z.filter((_, idx) => idx !== i)); setStatus(""); };
  const zeileNeu = () => { setZeilen((z) => [...z, { label: "", b: undefined, h: undefined, preis: 0 }]); setStatus(""); };

  const speichern = async () => {
    setStatus("speichern");
    const res = await fetch("/api/admin/preise", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: staffel.id, groessen: zeilen }),
    });
    setStatus(res.ok ? "ok" : "fehler");
    if (res.ok) setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e5e2dc] overflow-hidden">
      <button onClick={() => setOffen((o) => !o)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#faf9f7]">
        <div>
          <span className="text-[15px] font-semibold text-ink-strong">{staffel.titel}</span>
          <span className="ml-2 text-[12px] font-medium text-muted bg-[#f2f0ec] rounded px-1.5 py-0.5">{ART_LABEL[staffel.produktart] ?? staffel.produktart}</span>
          <span className="ml-2 text-[12.5px] text-muted">{zeilen.length} Größen</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-muted transition-transform ${offen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {offen && (
        <div className="border-t border-[#eee9e0] px-5 py-4">
          <div className="hidden sm:grid grid-cols-[1fr_70px_70px_90px_70px_36px] gap-2 text-[11.5px] font-semibold uppercase tracking-wide text-muted px-1 mb-1.5">
            <span>Bezeichnung</span><span>Breite</span><span>Höhe</span><span>Preis €</span><span>Beliebt</span><span></span>
          </div>
          <div className="space-y-2">
            {zeilen.map((g, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_70px_70px_90px_70px_36px] gap-2 items-center">
                <input value={g.label} onChange={(e) => aendern(i, "label", e.target.value)} placeholder="z.B. 80 × 80 cm"
                  className="col-span-2 sm:col-span-1 rounded-md border border-[#dcd8d0] px-2.5 py-2 text-[14px] outline-none focus:border-bordeaux" />
                <input value={g.b ?? ""} onChange={(e) => aendern(i, "b", e.target.value)} placeholder="cm" inputMode="numeric"
                  className="rounded-md border border-[#dcd8d0] px-2.5 py-2 text-[14px] outline-none focus:border-bordeaux" />
                <input value={g.h ?? ""} onChange={(e) => aendern(i, "h", e.target.value)} placeholder="cm" inputMode="numeric"
                  className="rounded-md border border-[#dcd8d0] px-2.5 py-2 text-[14px] outline-none focus:border-bordeaux" />
                <input value={g.preis} onChange={(e) => aendern(i, "preis", e.target.value)} inputMode="decimal"
                  className="rounded-md border border-[#dcd8d0] px-2.5 py-2 text-[14px] font-semibold outline-none focus:border-bordeaux" />
                <button onClick={() => beliebtSetzen(i)} title="Als beliebteste Größe markieren"
                  className={`h-9 rounded-md border text-[12px] font-semibold ${g.beliebt ? "bg-gold text-white border-gold" : "border-[#dcd8d0] text-muted hover:border-gold"}`}>
                  {g.beliebt ? "★" : "☆"}
                </button>
                <button onClick={() => zeileWeg(i)} aria-label="Zeile löschen"
                  className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-bordeaux hover:bg-bordeaux-soft">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button onClick={zeileNeu} className="text-[13.5px] font-semibold text-bordeaux hover:underline">+ Größe hinzufügen</button>
            <div className="flex items-center gap-3">
              {status === "ok" && <span className="text-[13px] font-medium text-ok">✓ Gespeichert</span>}
              {status === "fehler" && <span className="text-[13px] font-medium text-bordeaux">Fehler beim Speichern</span>}
              <button onClick={speichern} disabled={status === "speichern"}
                className="rounded-md bg-ink-strong text-white font-semibold px-5 py-2 text-[13.5px] disabled:opacity-50">
                {status === "speichern" ? "Speichert …" : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreiseEditor({ staffeln }: { staffeln: Preisstaffel[] }) {
  return (
    <div className="space-y-3">
      {staffeln.map((s) => <StaffelKarte key={s.id} staffel={s} />)}
    </div>
  );
}
