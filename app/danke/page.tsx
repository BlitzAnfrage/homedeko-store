"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconCheck } from "@/components/Icon";

function Inhalt() {
  const nr = useSearchParams().get("nr");
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ok-soft text-ok mb-5">
        <IconCheck size={30} />
      </span>
      <h1 className="font-display text-3xl text-ink-strong mb-3">Danke für deine Bestellung!</h1>
      {nr && <p className="text-[15px] mb-2">Deine Bestellnummer: <b>{nr}</b></p>}
      <p className="text-[14.5px] text-muted leading-relaxed mb-8">
        Wir haben deine Bestellung erhalten. Du bekommst in Kürze eine Bestätigung
        mit allen Zahlungsdaten an deine E-Mail-Adresse. Nach Zahlungseingang wird
        dein Wandbild produziert und versendet.
      </p>
      <Link href="/motive" className="btn-ghost px-6 py-3 text-[14.5px] inline-block">Weiter stöbern</Link>
    </div>
  );
}

export default function DankeSeite() {
  return <Suspense fallback={null}><Inhalt /></Suspense>;
}
