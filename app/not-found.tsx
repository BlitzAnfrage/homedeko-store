import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="font-display text-[64px] leading-none text-bordeaux mb-2">404</div>
      <h1 className="font-display text-3xl text-ink-strong mb-3">Diese Seite gibt es nicht (mehr).</h1>
      <p className="text-[14.5px] text-muted leading-relaxed mb-8 max-w-md mx-auto">
        Vielleicht wurde das Motiv umbenannt oder der Link ist veraltet. Stöber
        in unserer Kollektion — dein neues Lieblingsbild ist bestimmt dabei.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/motive" className="btn-gold px-6 py-3 text-[14.5px]">Alle Motive ansehen</Link>
        <Link href="/" className="btn-ghost px-6 py-3 text-[14.5px]">Zur Startseite</Link>
      </div>
    </div>
  );
}
