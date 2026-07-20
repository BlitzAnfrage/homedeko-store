"use client";
/* Newsletter-Gutschein — Entry-Offer (10 % auf den ersten Einkauf).
   Baut die E-Mail-Liste, gibt Erstkäufern den letzten Schubs. On-brand (Bordeaux).
   Speichert die Anmeldung über /api/newsletter (lokale JSON-Ablage). */
import { useState } from "react";
import { IconArrowRight, IconCheck } from "./Icon";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [sende, setSende] = useState(false);

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSende(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setOk(true); setSende(false);
  };

  return (
    <section className="py-16 lg:py-20" style={{ background: "var(--bordeaux)" }} data-reveal>
      <div className="mx-auto max-w-2xl px-4 text-center text-white">
        <div className="text-[11px] tracking-[0.24em] uppercase font-semibold text-gold-bright mb-3">
          Willkommens-Geschenk
        </div>
        <h2 className="font-display text-3xl lg:text-[40px] leading-tight">
          <span className="display-italic text-gold-bright">10 %</span> auf deinen ersten Einkauf
        </h2>
        <p className="mt-3 text-[15px] text-white/80 max-w-md mx-auto leading-relaxed">
          Melde dich zum Newsletter an und erhalte deinen Gutschein sofort per E-Mail —
          plus neue Motive und Aktionen als Erste·r.
        </p>

        {ok ? (
          <div className="mt-7 inline-flex items-center gap-2.5 bg-white/12 rounded-[6px] px-5 py-3.5 text-[15px] font-medium">
            <IconCheck size={20} className="text-gold-bright" />
            Fast geschafft — bestätige die E-Mail in deinem Postfach, dann kommt dein Gutschein.
          </div>
        ) : (
          <form onSubmit={absenden} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Deine E-Mail-Adresse"
              className="flex-1 rounded-[6px] px-4 py-3.5 text-[15px] text-ink bg-white outline-none"
            />
            <button disabled={sende} className="btn-gold px-6 py-3.5 text-[15px] flex items-center justify-center gap-2 disabled:opacity-60">
              {sende ? "…" : <>Gutschein sichern <IconArrowRight size={16} /></>}
            </button>
          </form>
        )}
        <p className="mt-4 text-[11.5px] text-white/55">
          Jederzeit abbestellbar. Kein Spam — versprochen.
        </p>
      </div>
    </section>
  );
}
