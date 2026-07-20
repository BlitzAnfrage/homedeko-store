/* Schlichte einfarbige SVG-Icons mit festen Maßen (Blaupausen-Regel: nie Emojis) */
type P = { size?: number; className?: string; style?: React.CSSProperties };
const S = (size = 20) => ({ width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" });

export const IconCart = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2.4l2.2 11.2a1.4 1.4 0 0 0 1.4 1.1h7.6a1.4 1.4 0 0 0 1.4-1.1L20 8H6" /></svg>
);
export const IconSearch = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" /></svg>
);
export const IconTruck = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M2 7h11v9H2zM13 10h4.5L20 13v3h-7" /><circle cx="6.5" cy="17.5" r="1.6" /><circle cx="16.5" cy="17.5" r="1.6" /></svg>
);
export const IconFrame = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><rect x="4" y="4" width="16" height="16" /><rect x="8" y="8" width="8" height="8" /></svg>
);
export const IconSun = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></svg>
);
export const IconShield = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M12 3 5 5.5v6c0 4.3 2.9 7.4 7 9.5 4.1-2.1 7-5.2 7-9.5v-6z" /><path d="m9 11.5 2.2 2.2L15.5 9.5" /></svg>
);
export const IconCheck = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="m4.5 12.5 5 5L19.5 7" /></svg>
);
export const IconChevron = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="m8.5 5 7 7-7 7" /></svg>
);
export const IconClose = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M5 5l14 14M19 5 5 19" /></svg>
);
export const IconMenu = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M4 6.5h16M4 12h16M4 17.5h16" /></svg>
);
export const IconRuler = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><rect x="3" y="9" width="18" height="6" rx="1" /><path d="M7 9v3M11 9v3M15 9v3M19 9v3" /></svg>
);
export const IconLock = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><rect x="5" y="10.5" width="14" height="9.5" rx="1.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
);
export const IconMinus = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M5 12h14" /></svg>
);
export const IconPlus = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconTrash = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13" /></svg>
);
export const IconArrowRight = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M4 12h16M13 5l7 7-7 7" /></svg>
);
export const IconCamera = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z" /><circle cx="12" cy="13" r="3.2" /></svg>
);
export const IconPerson = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><circle cx="12" cy="6.5" r="2.8" /><path d="M12 9.5v6M12 15.5 8.5 21M12 15.5l3.5 5.5M7.5 12h9" /></svg>
);
export const IconMove = ({ size, className, style }: P) => (
  <svg {...S(size)} className={className} style={style}><path d="M12 2v20M2 12h20M12 2 9.5 4.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5M2 12l2.5-2.5M2 12l2.5 2.5M22 12l-2.5-2.5M22 12l-2.5 2.5" /></svg>
);
