/** Presentational pieces of the admin dashboard (server components, no JS). */

const countryNames = new Intl.DisplayNames(["fr"], { type: "region" });

export function countryName(code: string | null | undefined) {
  if (!code || code === "Inconnu") return "Inconnu";
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

const PAGE_NAMES: Record<string, string> = {
  "": "Accueil",
  "/projets": "Projets",
  "/projets/triple-towers": "Triple Towers",
  "/projets/del-costa-2": "Del Costa 2",
  "/projets/del-costa": "Résidence Del Costa",
  "/projets/les-villas-de-la-colline": "Villas de la Colline",
  "/notre-histoire": "Notre histoire",
  "/espace-mre": "Espace MRE",
  "/contact": "Contact",
  "/mentions-legales": "Mentions légales",
  "/guides": "Guides",
  "/guides/appartement-tanger-vue-mer": "Guide · Vue mer",
  "/guides/daam-sakane-tanger": "Guide · Daam Sakane",
  "/guides/acheter-appartement-neuf-tanger": "Guide · Acheter neuf",
  "/guides/residence-securisee-piscine-tanger": "Guide · Résidence piscine",
};

export function pageName(path: string | null | undefined) {
  if (!path) return "?";
  const m = path.match(/^\/(fr|ar)(\/.*)?$/);
  if (!m) return path;
  const name = PAGE_NAMES[(m[2] ?? "").replace(/\/$/, "")] ?? m[2];
  return `${name}${m[1] === "ar" ? " (AR)" : ""}`;
}

export const fmt = new Intl.NumberFormat("fr-FR");
export const pct = (v: number) =>
  `${(v * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
export function duration(sec: number) {
  if (!sec) return "0 s";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}
export function when(ts: unknown) {
  return new Date(String(ts)).toLocaleString("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Card({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-sand bg-white p-5 md:p-6 ${className}`}>
      <h2 className="eyebrow text-gold-dark">{title}</h2>
      {hint && <p className="mt-1 text-[13px] text-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Headline number with its change against the previous period of equal length. */
export function Kpi({
  label,
  value,
  previous,
  display,
  hint,
  invert = false,
}: {
  label: string;
  value: number;
  previous: number;
  display: string;
  hint?: string;
  /** For metrics where lower is better (bounce rate). */
  invert?: boolean;
}) {
  let delta: string | null = null;
  let good = true;
  if (previous > 0) {
    const d = (value - previous) / previous;
    delta = `${d >= 0 ? "▲" : "▼"} ${Math.abs(d * 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} %`;
    good = invert ? d <= 0 : d >= 0;
  } else if (value > 0) {
    delta = "nouveau";
  }
  return (
    <div className="rounded-lg border border-sand bg-white p-4">
      <p className="text-[13px] text-secondary">{label}</p>
      <p className="mt-1 font-display text-[28px] leading-tight text-foreground">{display}</p>
      <p className="mt-1 text-[12px] text-muted">
        {delta && (
          <span className={good ? "text-[#2f6b3f]" : "text-[#a33a2a]"}>{delta} </span>
        )}
        {hint ?? "vs période précédente"}
      </p>
    </div>
  );
}

/** Ranked horizontal bars: one hue, value labels in text ink. */
export function Bars({
  rows,
  format = (v: number) => fmt.format(v),
  label = (k: string) => k,
  empty = "Pas encore de données.",
}: {
  rows: { key: string; value: number }[];
  format?: (v: number) => string;
  label?: (k: string) => string;
  empty?: string;
}) {
  if (!rows.length) return <p className="text-caption text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key} title={`${label(r.key)} : ${format(r.value)}`}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate text-foreground">{label(r.key)}</span>
            <span className="shrink-0 tabular-nums text-secondary">{format(r.value)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-ivory-dark">
            <div
              className="h-2 rounded-full bg-teal"
              style={{ width: `${Math.max((r.value / max) * 100, 1.5)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Column chart over time, one series; native tooltips on each column. */
export function Columns({
  points,
  color = "var(--sbai-teal)",
  unit,
  height = 160,
  tickEvery,
}: {
  points: { label: string; value: number; tip: string }[];
  color?: string;
  unit: string;
  height?: number;
  tickEvery?: number;
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  const w = 1000;
  const gap = points.length > 60 ? 1 : 2;
  const bw = Math.max(w / points.length - gap, 1);
  const every = tickEvery ?? Math.ceil(points.length / 8);
  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${height + 24}`} className="h-auto w-full" role="img" aria-label={unit}>
        {[0.5, 1].map((g) => (
          <line
            key={g}
            x1={0}
            x2={w}
            y1={height - height * g}
            y2={height - height * g}
            stroke="var(--sbai-border)"
            strokeWidth={1}
          />
        ))}
        <text x={w} y={10} textAnchor="end" fontSize={20} fill="var(--sbai-text-muted)">
          {fmt.format(max)}
        </text>
        {points.map((p, i) => {
          const h = (p.value / max) * (height - 4);
          const x = i * (bw + gap);
          return (
            <g key={p.label}>
              <rect x={x} y={0} width={bw + gap} height={height} fill="transparent">
                <title>{p.tip}</title>
              </rect>
              {p.value > 0 && (
                <rect x={x} y={height - h} width={bw} height={h} rx={Math.min(3, bw / 2)} fill={color}>
                  <title>{p.tip}</title>
                </rect>
              )}
              {i % every === 0 && (
                <text x={x} y={height + 20} fontSize={18} fill="var(--sbai-text-muted)">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
        <line x1={0} x2={w} y1={height} y2={height} stroke="var(--sbai-text-muted)" strokeWidth={1} />
      </svg>
    </figure>
  );
}
