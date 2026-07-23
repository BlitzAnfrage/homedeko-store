"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Bestellung } from "@/lib/admin-data";
import { euro } from "@/lib/preise";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  neu:       { label: "Neu",       cls: "bg-blue-50 text-blue-700 border-blue-200" },
  bezahlt:   { label: "Bezahlt",   cls: "bg-ok-soft text-ok border-ok/30" },
  versandt:  { label: "Versandt",  cls: "bg-[#f2f0ec] text-ink border-[#e0ddd6]" },
  storniert: { label: "Storniert", cls: "bg-bordeaux-soft text-bordeaux border-bordeaux/30" },
};
const STATUS_FOLGE = ["neu", "bezahlt", "versandt", "storniert"];

function StatusChip({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.neu;
  return <span className={`text-[11.5px] font-semibold rounded-full border px-2 py-0.5 ${m.cls}`}>{m.label}</span>;
}

function Detail({ b, onStatus }: { b: Bestellung; onStatus: (s: string) => void }) {
  const kunde = b.kunde as Record<string, string>;
  const items = (b.items as { name: string; variante?: string; menge: number; preis: number }[]) ?? [];
  return (
    <div className="border-t border-[#eee9e0] p-4 bg-[#faf9f7]">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted mb-1.5">Kunde</div>
          <div className="text-[14px] text-ink-strong">{kunde?.vorname} {kunde?.nachname}</div>
          <div className="text-[13px] text-muted">{kunde?.email}</div>
          {kunde?.strasse && <div className="text-[13px] text-muted mt-1">{kunde.strasse}<br />{kunde.plz} {kunde.ort}</div>}
        </div>
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted mb-1.5">Status setzen</div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FOLGE.map((s) => (
              <button key={s} onClick={() => onStatus(s)}
                className={`text-[12.5px] font-medium rounded-md border px-2.5 py-1.5 transition-colors ${
                  b.status === s ? (STATUS_META[s]?.cls ?? "") + " font-semibold" : "bg-white border-[#e0ddd6] text-muted hover:border-[#cfc9bf]"
                }`}>
                {STATUS_META[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted mb-1.5">Artikel</div>
        <div className="space-y-1">
          {items.map((it, i) => (
            <div key={i} className="flex justify-between text-[13.5px]">
              <span className="text-ink">{it.menge}× {it.name} <span className="text-muted">{it.variante}</span></span>
              <span className="font-medium">{euro(it.preis * it.menge)}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-[#eee9e0] space-y-0.5 text-[13.5px]">
          <div className="flex justify-between text-muted"><span>Zwischensumme</span><span>{euro(b.summe)}</span></div>
          {b.rabatt_betrag > 0 && <div className="flex justify-between text-ok"><span>Rabatt {b.rabatt_code && `„${b.rabatt_code}“`}</span><span>−{euro(b.rabatt_betrag)}</span></div>}
          <div className="flex justify-between text-muted"><span>Versand</span><span>{b.versand === 0 ? "kostenlos" : euro(b.versand)}</span></div>
          <div className="flex justify-between font-bold text-ink-strong text-[15px] pt-0.5"><span>Gesamt</span><span>{euro(b.gesamt)}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function BestellListe({ bestellungen }: { bestellungen: Bestellung[] }) {
  const router = useRouter();
  const [offen, setOffen] = useState<string | null>(null);

  const setzeStatus = async (b: Bestellung, status: string) => {
    await fetch("/api/admin/bestellungen", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, status }),
    });
    router.refresh();
  };

  if (bestellungen.length === 0) {
    return <div className="rounded-xl border border-[#e5e2dc] bg-white p-8 text-center text-[14px] text-muted">Noch keine Bestellungen eingegangen.</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e2dc] overflow-hidden divide-y divide-[#eee9e0]">
      {bestellungen.map((b) => (
        <div key={b.id}>
          <button onClick={() => setOffen((o) => (o === b.id ? null : b.id))}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#faf9f7]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[13.5px] text-ink-strong">{b.nummer}</span>
                <StatusChip status={b.status} />
              </div>
              <div className="text-[12.5px] text-muted mt-0.5">
                {new Date(b.zeitpunkt).toLocaleDateString("de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                {" · "}{(b.kunde as Record<string, string>)?.email}
              </div>
            </div>
            <span className="font-bold text-[15px] text-ink-strong shrink-0">{euro(b.gesamt)}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-muted transition-transform shrink-0 ${offen === b.id ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {offen === b.id && <Detail b={b} onStatus={(s) => setzeStatus(b, s)} />}
        </div>
      ))}
    </div>
  );
}
