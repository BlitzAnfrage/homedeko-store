"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Rabattcode } from "@/lib/admin-data";
import { euro } from "@/lib/preise";

function leererCode() {
  return { code: "", typ: "prozent" as "prozent" | "fest", wert: 10, mindestwert: 0, gueltig_bis: "", max_nutzungen: "" };
}

export default function RabatteVerwaltung({ codes }: { codes: Rabattcode[] }) {
  const router = useRouter();
  const [neu, setNeu] = useState(leererCode());
  const [fehler, setFehler] = useState("");
  const [busy, setBusy] = useState(false);

  const anlegen = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setFehler("");
    const res = await fetch("/api/admin/rabatte", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(neu),
    });
    setBusy(false);
    const data = await res.json();
    if (res.ok) { setNeu(leererCode()); router.refresh(); }
    else setFehler(data.fehler ?? "Fehler.");
  };

  const umschalten = async (c: Rabattcode) => {
    await fetch("/api/admin/rabatte", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, aktiv: !c.aktiv }),
    });
    router.refresh();
  };

  const loeschen = async (c: Rabattcode) => {
    if (!confirm(`Code „${c.code}“ wirklich löschen?`)) return;
    await fetch(`/api/admin/rabatte?id=${c.id}`, { method: "DELETE" });
    router.refresh();
  };

  const rabattText = (c: Rabattcode) =>
    c.typ === "prozent" ? `${c.wert} %` : euro(c.wert);

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
      {/* Neuer Code */}
      <form onSubmit={anlegen} className="bg-white rounded-xl border border-[#e5e2dc] p-5">
        <h2 className="text-[15px] font-semibold text-ink-strong mb-3">Neuer Rabattcode</h2>

        <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Code</label>
        <input value={neu.code} onChange={(e) => setNeu({ ...neu, code: e.target.value.toUpperCase() })}
          placeholder="z.B. SOMMER10" required
          className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] font-semibold tracking-wide outline-none focus:border-bordeaux mb-3" />

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Art</label>
            <select value={neu.typ} onChange={(e) => setNeu({ ...neu, typ: e.target.value as "prozent" | "fest" })}
              className="w-full rounded-md border border-[#dcd8d0] px-2.5 py-2 text-[14px] outline-none focus:border-bordeaux bg-white">
              <option value="prozent">Prozent %</option>
              <option value="fest">Fester Betrag €</option>
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Wert</label>
            <input value={neu.wert} onChange={(e) => setNeu({ ...neu, wert: Number(e.target.value) })} inputMode="decimal"
              className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Mindestwert €</label>
            <input value={neu.mindestwert} onChange={(e) => setNeu({ ...neu, mindestwert: Number(e.target.value) })} inputMode="decimal"
              className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Max. Nutzungen</label>
            <input value={neu.max_nutzungen} onChange={(e) => setNeu({ ...neu, max_nutzungen: e.target.value })} placeholder="∞" inputMode="numeric"
              className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
          </div>
        </div>

        <label className="block text-[12.5px] font-semibold text-ink-strong mb-1">Gültig bis (optional)</label>
        <input type="date" value={neu.gueltig_bis} onChange={(e) => setNeu({ ...neu, gueltig_bis: e.target.value })}
          className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux mb-4" />

        {fehler && <p className="text-[13px] text-bordeaux font-medium mb-3">{fehler}</p>}
        <button type="submit" disabled={busy}
          className="w-full rounded-md bg-bordeaux text-white font-semibold py-2.5 text-[14px] disabled:opacity-50">
          {busy ? "Wird angelegt …" : "Code anlegen"}
        </button>
      </form>

      {/* Liste */}
      <div className="bg-white rounded-xl border border-[#e5e2dc] overflow-hidden">
        {codes.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-muted">Noch keine Rabattcodes. Lege links den ersten an.</div>
        ) : (
          <div className="divide-y divide-[#eee9e0]">
            {codes.map((c) => {
              const abgelaufen = c.gueltig_bis && new Date(c.gueltig_bis) < new Date();
              return (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[15px] text-ink-strong tracking-wide">{c.code}</span>
                      <span className="text-[12.5px] font-semibold text-bordeaux bg-bordeaux-soft rounded px-1.5 py-0.5">−{rabattText(c)}</span>
                      {!c.aktiv && <span className="text-[11px] font-medium text-muted bg-[#f2f0ec] rounded px-1.5 py-0.5">Deaktiviert</span>}
                      {abgelaufen && <span className="text-[11px] font-medium text-amber-700 bg-amber-50 rounded px-1.5 py-0.5">Abgelaufen</span>}
                    </div>
                    <div className="text-[12.5px] text-muted mt-0.5">
                      {c.mindestwert > 0 && `ab ${euro(c.mindestwert)} · `}
                      {c.max_nutzungen ? `${c.genutzt}/${c.max_nutzungen} genutzt` : `${c.genutzt}× genutzt`}
                      {c.gueltig_bis && ` · bis ${new Date(c.gueltig_bis).toLocaleDateString("de-DE")}`}
                    </div>
                  </div>
                  <button onClick={() => umschalten(c)}
                    className={`shrink-0 relative h-6 w-11 rounded-full transition-colors ${c.aktiv ? "bg-ok" : "bg-[#d5d0c6]"}`}
                    aria-label={c.aktiv ? "Deaktivieren" : "Aktivieren"}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${c.aktiv ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                  <button onClick={() => loeschen(c)} aria-label="Löschen"
                    className="shrink-0 h-8 w-8 flex items-center justify-center rounded-md text-muted hover:text-bordeaux hover:bg-bordeaux-soft">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
