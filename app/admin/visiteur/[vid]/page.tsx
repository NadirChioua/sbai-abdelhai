import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { visitorJourney } from "@/lib/admin-data";
import { Card, countryName, duration, pageName, when } from "../../ui";

export const dynamic = "force-dynamic";

const ACTION: Record<string, string> = {
  pageview: "Page vue",
  page_leave: "Temps passé",
  whatsapp_click: "Clic WhatsApp",
  phone_click: "Clic téléphone",
  email_click: "Clic e-mail",
  catalogue_download: "Catalogue téléchargé",
  video_play: "Vidéo lancée",
  outbound_click: "Lien externe",
};

export default async function VisitorPage({ params }: PageProps<"/admin/visiteur/[vid]">) {
  await requireAdmin();
  const { vid } = await params;
  if (!/^[\w-]{8,64}$/.test(vid)) notFound();
  const { events, leads } = await visitorJourney(vid);
  if (!events.length && !leads.length) notFound();

  const first = events[0];
  const sessions = new Map<string, typeof events>();
  for (const e of events) {
    const k = String(e.sid);
    if (!sessions.has(k)) sessions.set(k, []);
    sessions.get(k)!.push(e);
  }
  const pages = events.filter((e) => e.type === "pageview").length;
  const timeSpent = events
    .filter((e) => e.type === "page_leave")
    .reduce((s, e) => s + Number(e.duration_ms ?? 0), 0);
  const contacts = events.filter((e) => ["whatsapp_click", "phone_click", "email_click"].includes(String(e.type))).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
      <Link href="/admin" className="text-[13px] text-secondary underline">
        ← Tableau de bord
      </Link>
      <h1 className="heading-display mt-3 text-h3">Parcours du visiteur</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Première visite", first ? when(first.ts) : "—"],
          ["Visites", String(sessions.size)],
          ["Pages vues", String(pages)],
          ["Temps total", duration(timeSpent / 1000)],
          ["Lieu", [first?.city, countryName(first?.country as string | null)].filter(Boolean).join(", ") || "—"],
          ["Appareil", `${first?.device ?? "—"} · ${first?.os ?? ""}`],
          ["Arrivé par", String(events.find((e) => e.channel)?.channel ?? "—")],
          ["Contacts", String(contacts + leads.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-sand bg-white p-4">
            <p className="text-[13px] text-secondary">{k}</p>
            <p className="mt-1 text-body">{v}</p>
          </div>
        ))}
      </div>

      {leads.length > 0 && (
        <Card title="Demandes envoyées" className="mt-6">
          <ul className="space-y-3 text-[14px]">
            {leads.map((l) => (
              <li key={String(l.id)}>
                <strong className="font-medium">{when(l.ts)}</strong> · {String(l.name ?? l.email ?? "")}{" "}
                {l.phone ? `· ${l.phone}` : ""} · {String(l.project ?? "")} · statut : {String(l.status)}
                {l.message ? <p className="text-secondary">{String(l.message)}</p> : null}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {[...sessions.entries()].reverse().map(([sid, evs], i) => (
        <Card
          key={sid}
          title={`Visite ${sessions.size - i} · ${when(evs[0].ts)}`}
          hint={`${String(evs.find((e) => e.channel)?.channel ?? "Source inconnue")} · ${[evs[0].city, countryName(evs[0].country as string | null)].filter(Boolean).join(", ")}`}
          className="mt-6"
        >
          <ol className="space-y-1.5 text-[14px]">
            {evs.map((e) => {
              const t = String(e.type);
              if (t === "page_leave") return null;
              const highlight = t !== "pageview";
              const leave = evs.find(
                (x) => x.type === "page_leave" && x.path === e.path && new Date(String(x.ts)) >= new Date(String(e.ts)),
              );
              return (
                <li key={String(e.id)} className="flex gap-3">
                  <span className="w-14 shrink-0 tabular-nums text-muted">
                    {new Date(String(e.ts)).toLocaleTimeString("fr-FR", { timeZone: "Africa/Casablanca", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={highlight ? "font-medium text-gold-dark" : ""}>
                    {ACTION[t] ?? t} · {pageName(e.path as string | null)}
                    {e.target && t !== "pageview" ? <span className="text-secondary"> · {String(e.target).slice(0, 80)}</span> : null}
                    {t === "pageview" && leave ? (
                      <span className="text-muted"> · {duration(Number(leave.duration_ms) / 1000)}</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      ))}
    </div>
  );
}
