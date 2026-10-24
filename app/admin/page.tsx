import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { dbConfigured } from "@/lib/db";
import { LEAD_STATUSES, RANGES, dashboard, parseRange } from "@/lib/admin-data";
import { logout, updateLead } from "./actions";
import {
  Bars,
  Card,
  Columns,
  Kpi,
  countryName,
  duration,
  fmt,
  pageName,
  pct,
  when,
} from "./ui";

export const dynamic = "force-dynamic";

const PROJECT_NAMES: Record<string, string> = {
  "triple-towers": "Triple Towers",
  "del-costa-2": "Del Costa 2",
  "del-costa": "Résidence Del Costa",
  "les-villas-de-la-colline": "Villas de la Colline",
};

const KIND_LABEL: Record<string, string> = {
  contact: "Demande de visite",
  guide: "Guide MRE",
  newsletter: "Newsletter",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const range = parseRange(sp.range);

  if (!dbConfigured) {
    return (
      <Shell range={range}>
        <Card title="Base de données">
          <p className="text-body text-secondary">
            La base de données n&apos;est pas encore reliée. Dans Vercel : Storage → Create
            Database → Neon, puis connectez-la au projet sbai-abdelhai et redéployez.
          </p>
        </Card>
      </Shell>
    );
  }

  const d = await dashboard(range);
  const c = d.current;
  const p = d.previous;
  const dayFmt = (day: string) =>
    new Date(`${day}T12:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <Shell range={range}>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <Kpi label="Visiteurs uniques" value={c.visitors} previous={p.visitors} display={fmt.format(c.visitors)} />
        <Kpi label="Nouveaux visiteurs" value={c.newVisitors} previous={p.newVisitors} display={fmt.format(c.newVisitors)} />
        <Kpi label="Visites (sessions)" value={c.sessions} previous={p.sessions} display={fmt.format(c.sessions)} />
        <Kpi label="Pages vues" value={c.pageviews} previous={p.pageviews} display={fmt.format(c.pageviews)} />
        <Kpi label="Durée moyenne d'une visite" value={c.avgSessionSec} previous={p.avgSessionSec} display={duration(c.avgSessionSec)} />
        <Kpi label="Taux de rebond" value={c.bounceRate} previous={p.bounceRate} display={pct(c.bounceRate)} invert hint="visites d'une seule page" />
        <Kpi label="Demandes (formulaire)" value={c.leads} previous={p.leads} display={fmt.format(c.leads)} />
        <Kpi label="Clics WhatsApp" value={c.whatsapp} previous={p.whatsapp} display={fmt.format(c.whatsapp)} />
        <Kpi label="Clics téléphone" value={c.phone} previous={p.phone} display={fmt.format(c.phone)} />
        <Kpi label="Taux de contact" value={c.conversion} previous={p.conversion} display={pct(c.conversion)} hint="visiteurs ayant contacté" />
        <Kpi label="Catalogues téléchargés" value={c.catalogue} previous={p.catalogue} display={fmt.format(c.catalogue)} />
        <Kpi label="Visiteurs de l'étranger" value={c.abroadShare} previous={p.abroadShare} display={pct(c.abroadShare)} hint="part hors Maroc (MRE)" />
      </div>

      {/* Over time */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Visiteurs" hint={d.bucket === "week" ? "par semaine" : "par jour"}>
          <Columns
            unit="Visiteurs"
            points={d.daily.map((r) => ({
              label: dayFmt(r.day),
              value: r.visitors,
              tip: `${dayFmt(r.day)} : ${fmt.format(r.visitors)} visiteurs`,
            }))}
          />
        </Card>
        <Card title="Contacts" hint="WhatsApp, téléphone, e-mail et formulaire, en visiteurs">
          <Columns
            unit="Contacts"
            color="var(--sbai-gold-dark)"
            points={d.daily.map((r) => ({
              label: dayFmt(r.day),
              value: r.contacts + r.leads,
              tip: `${dayFmt(r.day)} : ${r.contacts} visiteurs ont cliqué pour contacter, ${r.leads} formulaires`,
            }))}
          />
        </Card>
      </div>

      {/* Acquisition */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card title="D'où viennent les visiteurs" hint="source de la première page de la visite">
          <Bars rows={d.channels} />
        </Card>
        <Card title="Pays">
          <Bars rows={d.countries} label={countryName} />
        </Card>
        <Card title="Villes">
          <Bars rows={d.cities} />
        </Card>
        <Card title="Pages les plus vues" hint="en visiteurs uniques">
          <Bars rows={d.pages} label={pageName} />
        </Card>
        <Card title="Intérêt par projet" hint="visiteurs de chaque page projet">
          <Bars
            rows={d.projects.map((r) => ({ key: r.key, value: r.visitors }))}
            label={(k) => PROJECT_NAMES[k] ?? k}
          />
        </Card>
        <Card title="Pages d'où l'on contacte" hint="clics WhatsApp, téléphone, e-mail">
          <Bars rows={d.actionsByPage} label={pageName} />
        </Card>
        <Card title="Appareils">
          <Bars rows={d.devices} />
        </Card>
        <Card title="Navigateurs">
          <Bars rows={d.browsers} />
        </Card>
        <Card title="Heures de visite" hint="heure du Maroc">
          <Columns
            unit="Visiteurs par heure"
            height={120}
            tickEvery={6}
            points={d.hours.map((h) => ({ label: h.key, value: h.value, tip: `${h.key} : ${h.value} visiteurs` }))}
          />
        </Card>
      </div>

      {/* Leads (CRM) */}
      <Card title={`Demandes reçues (${fmt.format(d.leads.length)})`} hint="suivi commercial : statut et notes" className="mt-6">
        {d.leads.length === 0 ? (
          <p className="text-caption text-muted">Aucune demande sur la période.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto md:-mx-6">
            <table className="w-full min-w-[960px] text-left text-[13px]">
              <thead className="text-secondary">
                <tr className="border-b border-sand">
                  <th className="px-5 py-2 font-normal md:px-6">Date</th>
                  <th className="py-2 font-normal">Contact</th>
                  <th className="py-2 font-normal">Projet · budget</th>
                  <th className="py-2 font-normal">Origine</th>
                  <th className="py-2 font-normal">Suivi</th>
                </tr>
              </thead>
              <tbody>
                {d.leads.map((l) => (
                  <tr key={String(l.id)} className="border-b border-sand align-top last:border-0">
                    <td className="px-5 py-3 md:px-6">
                      {when(l.ts)}
                      <br />
                      <span className="text-muted">{KIND_LABEL[String(l.kind)] ?? String(l.kind)}</span>
                    </td>
                    <td className="py-3 pe-4">
                      <strong className="font-medium">{String(l.name ?? "—")}</strong>
                      {l.phone ? (
                        <>
                          <br />
                          <a className="text-gold-dark underline" href={`https://wa.me/${String(l.phone).replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                            {String(l.phone)}
                          </a>
                        </>
                      ) : null}
                      {l.email ? (
                        <>
                          <br />
                          <a className="text-secondary underline" href={`mailto:${String(l.email)}`}>{String(l.email)}</a>
                        </>
                      ) : null}
                      {l.message ? <p className="mt-1 max-w-xs text-secondary">{String(l.message)}</p> : null}
                    </td>
                    <td className="py-3 pe-4">
                      {String(l.project ?? "—")}
                      <br />
                      <span className="text-muted">{String(l.budget ?? "")}</span>
                    </td>
                    <td className="py-3 pe-4">
                      {String(l.channel ?? "—")}
                      <br />
                      <span className="text-muted">
                        {[l.city, countryName(l.country as string | null)].filter(Boolean).join(", ")} · {String(l.device ?? "")}
                      </span>
                      {l.vid ? (
                        <>
                          <br />
                          <Link className="text-gold-dark underline" href={`/admin/visiteur/${String(l.vid)}`}>
                            Voir son parcours
                          </Link>
                        </>
                      ) : null}
                    </td>
                    <td className="py-3 pe-5 md:pe-6">
                      <form action={updateLead} className="flex flex-col gap-2">
                        <input type="hidden" name="id" value={String(l.id)} />
                        <select
                          name="status"
                          defaultValue={String(l.status)}
                          className="h-9 rounded border border-sand bg-ivory px-2"
                          aria-label="Statut"
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <textarea
                          name="notes"
                          defaultValue={String(l.notes ?? "")}
                          rows={2}
                          placeholder="Notes"
                          aria-label="Notes"
                          className="min-w-48 rounded border border-sand bg-ivory px-2 py-1"
                        />
                        <button className="eyebrow h-8 rounded bg-charcoal text-ivory hover:bg-gold-dark">
                          Enregistrer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Live visits */}
      <Card title="Dernières visites" hint="cliquez sur une visite pour voir le parcours complet du visiteur" className="mt-6">
        {d.sessions.length === 0 ? (
          <p className="text-caption text-muted">Pas encore de visites enregistrées.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto md:-mx-6">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="text-secondary">
                <tr className="border-b border-sand">
                  <th className="px-5 py-2 font-normal md:px-6">Début</th>
                  <th className="py-2 font-normal">Lieu</th>
                  <th className="py-2 font-normal">Source</th>
                  <th className="py-2 font-normal">Appareil</th>
                  <th className="py-2 font-normal">Pages</th>
                  <th className="py-2 font-normal">Durée</th>
                  <th className="py-2 font-normal">Contact</th>
                  <th className="py-2 pe-5 font-normal md:pe-6">Visites</th>
                </tr>
              </thead>
              <tbody>
                {d.sessions.map((s) => {
                  const dur = (new Date(String(s.ended)).getTime() - new Date(String(s.started)).getTime()) / 1000;
                  return (
                    <tr key={String(s.sid)} className="border-b border-sand last:border-0 hover:bg-ivory">
                      <td className="px-5 py-2 md:px-6">
                        <Link className="underline decoration-sand hover:text-gold-dark" href={`/admin/visiteur/${String(s.vid)}`}>
                          {when(s.started)}
                        </Link>
                      </td>
                      <td className="py-2">{[s.city, countryName(s.country as string | null)].filter(Boolean).join(", ")}</td>
                      <td className="py-2">{String(s.channel ?? "—")}</td>
                      <td className="py-2">{String(s.device ?? "")}</td>
                      <td className="py-2 tabular-nums">{fmt.format(Number(s.pages))}</td>
                      <td className="py-2 tabular-nums">{duration(dur)}</td>
                      <td className="py-2">{Number(s.contacts) > 0 ? <span className="text-[#2f6b3f]">✔ {String(s.contacts)}</span> : "—"}</td>
                      <td className="py-2 pe-5 tabular-nums md:pe-6">
                        {Number(s.visits) > 1 ? `${s.visits}ᵉ visite` : "1ʳᵉ visite"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="mt-8 text-[12px] text-muted">
        Données conservées 24 mois (visites) et 36 mois (demandes). Aucune adresse IP n&apos;est enregistrée ; la localisation est
        déduite au niveau de la ville. Les robots et les outils de test sont exclus.
      </p>
    </Shell>
  );
}

function Shell({ range, children }: { range: keyof typeof RANGES; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-8 md:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-dark">SBAI Immobilier</p>
          <h1 className="heading-display mt-1 text-h3">Tableau de bord du site</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="Période" className="flex rounded border border-sand bg-white p-1">
            {Object.entries(RANGES).map(([k, r]) => (
              <Link
                key={k}
                href={`/admin?range=${k}`}
                aria-current={k === range ? "page" : undefined}
                className={`rounded px-3 py-1.5 text-[13px] ${
                  k === range ? "bg-charcoal text-ivory" : "text-secondary hover:text-foreground"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </nav>
          <a
            href={`/admin/export?kind=leads&range=${range}`}
            className="rounded border border-sand bg-white px-3 py-2 text-[13px] text-secondary hover:text-foreground"
          >
            Export demandes (CSV)
          </a>
          <a
            href={`/admin/export?kind=events&range=${range}`}
            className="rounded border border-sand bg-white px-3 py-2 text-[13px] text-secondary hover:text-foreground"
          >
            Export visites (CSV)
          </a>
          <form action={logout}>
            <button className="rounded px-3 py-2 text-[13px] text-secondary underline hover:text-foreground">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <div className="mt-6">{children}</div>
    </div>
  );
}
