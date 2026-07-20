/* Zahlungsart-Logos als schlichte SVG-Badges (wiedererkennbar, dezent, on-brand).
   Kein Fremd-Asset, alles inline. Reihenfolge/Auswahl aus lib/site.ts ZAHLARTEN. */
const Badge = ({ children, w = 44 }: { children: React.ReactNode; w?: number }) => (
  <span
    className="inline-flex items-center justify-center bg-white border border-line rounded-[4px] h-7"
    style={{ width: w }}
    aria-hidden
  >
    {children}
  </span>
);

const T = { fontFamily: "ui-sans-serif, system-ui, sans-serif", fontWeight: 700 } as const;

const LOGOS: Record<string, React.ReactNode> = {
  rechnung: (
    <Badge w={54}>
      <span style={{ ...T, fontSize: 9, letterSpacing: "0.02em", color: "#3a352d" }}>RECHNUNG</span>
    </Badge>
  ),
  paypal: (
    <Badge>
      <span style={{ ...T, fontSize: 11, fontStyle: "italic" }}>
        <span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#009cde" }}>Pal</span>
      </span>
    </Badge>
  ),
  klarna: (
    <Badge>
      <span className="inline-flex items-center justify-center rounded-[3px] px-1.5" style={{ background: "#ffb3c7" }}>
        <span style={{ ...T, fontSize: 10, color: "#17120f" }}>Klarna.</span>
      </span>
    </Badge>
  ),
  visa: (
    <Badge>
      <span style={{ ...T, fontSize: 12, fontStyle: "italic", color: "#1a1f71", letterSpacing: "0.02em" }}>VISA</span>
    </Badge>
  ),
  mastercard: (
    <Badge>
      <svg width="34" height="21" viewBox="0 0 34 21" aria-hidden>
        <circle cx="13" cy="10.5" r="8" fill="#eb001b" />
        <circle cx="21" cy="10.5" r="8" fill="#f79e1b" fillOpacity="0.9" />
        <path d="M17 4.5a8 8 0 0 1 0 12 8 8 0 0 1 0-12Z" fill="#ff5f00" />
      </svg>
    </Badge>
  ),
  applepay: (
    <Badge>
      <span style={{ ...T, fontSize: 11, color: "#111" }}>&#63743;Pay</span>
    </Badge>
  ),
};

export default function PayLogos({ arten, className = "" }: { arten: readonly string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {arten.map((a) => (
        <span key={a}>{LOGOS[a]}</span>
      ))}
    </div>
  );
}
