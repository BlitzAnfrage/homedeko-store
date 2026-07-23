"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShopSettings } from "@/lib/settings";

/* Speichert eine Gruppe und zeigt Status. */
function useSpeichern(key: string, onDone: () => void) {
  const [status, setStatus] = useState<"" | "busy" | "ok" | "fehler">("");
  const speichern = async (wert: unknown) => {
    setStatus("busy");
    const res = await fetch("/api/admin/einstellungen", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, wert }),
    });
    setStatus(res.ok ? "ok" : "fehler");
    if (res.ok) { setTimeout(() => setStatus(""), 2500); onDone(); }
  };
  return { status, speichern };
}

function Karte({ titel, hinweis, children }: { titel: string; hinweis?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-[#e5e2dc] p-5">
      <h2 className="text-[16px] font-semibold text-ink-strong">{titel}</h2>
      {hinweis && <p className="text-[12.5px] text-muted mt-0.5 mb-3">{hinweis}</p>}
      <div className={hinweis ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

function SpeichernLeiste({ status, onSave }: { status: string; onSave: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 mt-4">
      {status === "ok" && <span className="text-[13px] font-medium text-ok">✓ Gespeichert</span>}
      {status === "fehler" && <span className="text-[13px] font-medium text-bordeaux">Fehler beim Speichern</span>}
      <button onClick={onSave} disabled={status === "busy"}
        className="rounded-md bg-ink-strong text-white font-semibold px-5 py-2 text-[13.5px] disabled:opacity-50">
        {status === "busy" ? "Speichert …" : "Speichern"}
      </button>
    </div>
  );
}

function Feld({ label, value, onChange, type = "text", breit }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; breit?: boolean;
}) {
  return (
    <label className={`block ${breit ? "sm:col-span-2" : ""}`}>
      <span className="block text-[12.5px] font-semibold text-ink-strong mb-1">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} inputMode={type === "number" ? "decimal" : undefined}
        className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
    </label>
  );
}

/* ── Versand & Schwellen ──────────────────────────────────────────────── */
function VersandKarte({ v, onDone }: { v: ShopSettings["versand"]; onDone: () => void }) {
  const [s, setS] = useState(v);
  const { status, speichern } = useSpeichern("versand", onDone);
  return (
    <Karte titel="Versand & Schwellen" hinweis="Diese Werte steuern die Versandberechnung im Warenkorb und an der Kasse.">
      <div className="grid sm:grid-cols-2 gap-3">
        <Feld label="Gratisversand ab (€)" type="number" value={s.frei_ab} onChange={(x) => setS({ ...s, frei_ab: Number(x) || 0 })} />
        <Feld label="Versandkosten darunter (€)" type="number" value={s.kosten} onChange={(x) => setS({ ...s, kosten: Number(x) || 0 })} />
        <Feld label="Rückgabefrist (Tage)" type="number" value={s.ruecknahme_tage} onChange={(x) => setS({ ...s, ruecknahme_tage: Number(x) || 0 })} />
        <Feld label="Newsletter-Gutschein (%)" type="number" value={s.newsletter_prozent} onChange={(x) => setS({ ...s, newsletter_prozent: Number(x) || 0 })} />
      </div>
      <SpeichernLeiste status={status} onSave={() => speichern(s)} />
    </Karte>
  );
}

/* ── Firma & Kontakt ──────────────────────────────────────────────────── */
function FirmaKarte({ f, onDone }: { f: ShopSettings["firma"]; onDone: () => void }) {
  const [s, setS] = useState(f);
  const { status, speichern } = useSpeichern("firma", onDone);
  const set = (k: keyof typeof s) => (x: string) => setS({ ...s, [k]: x });
  return (
    <Karte titel="Firma & Kontakt" hinweis="Erscheint im Impressum und im Footer. Für einen rechtssicheren Shop bitte vollständig ausfüllen.">
      <div className="grid sm:grid-cols-2 gap-3">
        <Feld label="Firmenname" value={s.name} onChange={set("name")} />
        <Feld label="Inhaber / Geschäftsführer" value={s.inhaber} onChange={set("inhaber")} />
        <Feld label="Straße & Nr." value={s.strasse} onChange={set("strasse")} breit />
        <Feld label="PLZ" value={s.plz} onChange={set("plz")} />
        <Feld label="Ort" value={s.ort} onChange={set("ort")} />
        <Feld label="Land" value={s.land} onChange={set("land")} />
        <Feld label="E-Mail" type="email" value={s.email} onChange={set("email")} />
        <Feld label="Telefon" value={s.telefon} onChange={set("telefon")} />
        <Feld label="USt-IdNr." value={s.ustid} onChange={set("ustid")} />
        <Feld label="Registergericht" value={s.registergericht} onChange={set("registergericht")} />
        <Feld label="HRB-Nr." value={s.hrb} onChange={set("hrb")} />
        <Feld label="Domain" value={s.domain} onChange={set("domain")} />
      </div>
      <SpeichernLeiste status={status} onSave={() => speichern(s)} />
    </Karte>
  );
}

/* ── Banner & Texte ───────────────────────────────────────────────────── */
function TexteKarte({ t, onDone }: { t: ShopSettings["texte"]; onDone: () => void }) {
  const [s, setS] = useState(t);
  const { status, speichern } = useSpeichern("texte", onDone);
  const setBanner = (i: number, v: string) => setS({ ...s, banner: s.banner.map((b, idx) => idx === i ? v : b) });
  const bannerWeg = (i: number) => setS({ ...s, banner: s.banner.filter((_, idx) => idx !== i) });
  const bannerNeu = () => setS({ ...s, banner: [...s.banner, ""] });
  return (
    <Karte titel="Banner & Texte" hinweis="Die Banner-Zeilen laufen oben im Shop durch (Announcement-Bar).">
      <div className="space-y-2 mb-4">
        <span className="block text-[12.5px] font-semibold text-ink-strong">Banner-Zeilen (rotierend oben)</span>
        {s.banner.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input value={b} onChange={(e) => setBanner(i, e.target.value)}
              className="flex-1 rounded-md border border-[#dcd8d0] px-3 py-2 text-[14px] outline-none focus:border-bordeaux" />
            <button onClick={() => bannerWeg(i)} aria-label="Zeile löschen"
              className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-bordeaux hover:bg-bordeaux-soft shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
            </button>
          </div>
        ))}
        <button onClick={bannerNeu} className="text-[13px] font-semibold text-bordeaux hover:underline">+ Banner-Zeile</button>
      </div>
      <Feld label="Claim / Slogan" value={s.claim} onChange={(x) => setS({ ...s, claim: x })} breit />
      <div className="mt-3">
        <span className="block text-[12.5px] font-semibold text-ink-strong mb-1">SEO-Beschreibung (Google-Snippet)</span>
        <textarea value={s.seo_beschreibung} onChange={(e) => setS({ ...s, seo_beschreibung: e.target.value })} rows={3}
          className="w-full rounded-md border border-[#dcd8d0] px-3 py-2 text-[13.5px] outline-none focus:border-bordeaux resize-y" />
      </div>
      <SpeichernLeiste status={status} onSave={() => speichern(s)} />
    </Karte>
  );
}

/* ── Rechtstexte ──────────────────────────────────────────────────────── */
function RechtstexteKarte({ r, onDone }: { r: ShopSettings["rechtstexte"]; onDone: () => void }) {
  const [s, setS] = useState(r);
  const { status, speichern } = useSpeichern("rechtstexte", onDone);
  const felder: { k: keyof typeof s; label: string }[] = [
    { k: "impressum", label: "Impressum" },
    { k: "datenschutz", label: "Datenschutzerklärung" },
    { k: "agb", label: "AGB" },
    { k: "widerruf", label: "Widerrufsbelehrung" },
  ];
  const [offen, setOffen] = useState<string>("impressum");
  return (
    <Karte titel="Rechtstexte" hinweis="Impressum, Datenschutz, AGB, Widerruf. Leere Felder zeigen im Shop einen Platzhalter. Tipp: mit einem kostenlosen Generator (z.B. e-recht24) erstellen und hier einfügen.">
      <div className="flex gap-1.5 flex-wrap mb-3">
        {felder.map((f) => (
          <button key={f.k} onClick={() => setOffen(f.k)}
            className={`text-[13px] font-medium rounded-md px-3 py-1.5 transition-colors ${offen === f.k ? "bg-[#f2f0ec] text-ink-strong" : "text-muted hover:bg-[#f7f6f4]"}`}>
            {f.label}{s[f.k] ? " ✓" : ""}
          </button>
        ))}
      </div>
      {felder.map((f) => offen === f.k && (
        <textarea key={f.k} value={s[f.k]} onChange={(e) => setS({ ...s, [f.k]: e.target.value })} rows={12}
          placeholder={`${f.label}-Text hier einfügen …`}
          className="w-full rounded-md border border-[#dcd8d0] px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-bordeaux resize-y font-mono" />
      ))}
      <SpeichernLeiste status={status} onSave={() => speichern(s)} />
    </Karte>
  );
}

export default function EinstellungenEditor({ settings }: { settings: ShopSettings }) {
  const router = useRouter();
  const onDone = () => router.refresh();
  return (
    <div className="space-y-4 max-w-3xl">
      <VersandKarte v={settings.versand} onDone={onDone} />
      <FirmaKarte f={settings.firma} onDone={onDone} />
      <TexteKarte t={settings.texte} onDone={onDone} />
      <RechtstexteKarte r={settings.rechtstexte} onDone={onDone} />
    </div>
  );
}
