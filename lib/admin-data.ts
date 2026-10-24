import { ensureSchema, sql } from "@/lib/db";

export const LEAD_STATUSES = ["nouveau", "contacté", "visite", "réservé", "vendu", "perdu"] as const;

export const RANGES = {
  "7j": { label: "7 jours", days: 7 },
  "30j": { label: "30 jours", days: 30 },
  "90j": { label: "90 jours", days: 90 },
  "12m": { label: "12 mois", days: 365 },
  "24m": { label: "24 mois", days: 730 },
} as const;
export type RangeKey = keyof typeof RANGES;

export function parseRange(v: string | string[] | undefined): RangeKey {
  return typeof v === "string" && v in RANGES ? (v as RangeKey) : "30j";
}

const TZ = "Africa/Casablanca";
const CONTACT_TYPES = ["whatsapp_click", "phone_click", "email_click"];

type Row = Record<string, unknown>;
const n = (v: unknown) => Number(v ?? 0);

export type Kpis = {
  visitors: number;
  newVisitors: number;
  sessions: number;
  pageviews: number;
  avgSessionSec: number;
  bounceRate: number;
  whatsapp: number;
  phone: number;
  email: number;
  catalogue: number;
  videos: number;
  leads: number;
  contactVisitors: number;
  conversion: number;
  abroadShare: number;
};

async function kpis(fromDays: number, toDays: number): Promise<Kpis> {
  const [ev] = (await sql.query(
    `with e as (
       select * from events
       where ts >= now() - ($1 || ' days')::interval and ts < now() - ($2 || ' days')::interval
     ),
     s as (
       select sid, count(*) filter (where type = 'pageview') pv,
              extract(epoch from max(ts) - min(ts)) dur
       from e group by sid
     ),
     firsts as (select vid, min(ts) first_ts from events group by vid)
     select
       (select count(distinct vid) from e) visitors,
       (select count(distinct e.vid) from e join firsts f using (vid)
          where f.first_ts >= now() - ($1 || ' days')::interval) new_visitors,
       (select count(*) from s) sessions,
       (select count(*) from e where type = 'pageview') pageviews,
       (select coalesce(avg(dur), 0) from s) avg_dur,
       (select coalesce(avg(case when pv <= 1 then 1 else 0 end), 0) from s) bounce,
       (select count(*) from e where type = 'whatsapp_click') whatsapp,
       (select count(*) from e where type = 'phone_click') phone,
       (select count(*) from e where type = 'email_click') email,
       (select count(*) from e where type = 'catalogue_download') catalogue,
       (select count(*) from e where type = 'video_play') videos,
       (select count(distinct vid) from (
          select vid from e where type = any($3)
          union
          select vid from leads where kind = 'contact' and vid is not null
            and ts >= now() - ($1 || ' days')::interval and ts < now() - ($2 || ' days')::interval
        ) c) contact_visitors,
       (select count(distinct vid) from e where country is not null and country <> 'MA') abroad,
       (select count(distinct vid) from e where country is not null) located`,
    [String(fromDays), String(toDays), CONTACT_TYPES],
  )) as Row[];
  const [ld] = (await sql.query(
    `select count(*) c from leads
     where kind = 'contact'
       and ts >= now() - ($1 || ' days')::interval and ts < now() - ($2 || ' days')::interval`,
    [String(fromDays), String(toDays)],
  )) as Row[];
  const visitors = n(ev.visitors);
  // A visitor "converted" if they clicked WhatsApp/phone/email or sent a form.
  const contactVisitors = n(ev.contact_visitors);
  return {
    visitors,
    newVisitors: n(ev.new_visitors),
    sessions: n(ev.sessions),
    pageviews: n(ev.pageviews),
    avgSessionSec: Math.round(n(ev.avg_dur)),
    bounceRate: n(ev.bounce),
    whatsapp: n(ev.whatsapp),
    phone: n(ev.phone),
    email: n(ev.email),
    catalogue: n(ev.catalogue),
    videos: n(ev.videos),
    leads: n(ld.c),
    contactVisitors,
    conversion: visitors ? Math.min(contactVisitors / visitors, 1) : 0,
    abroadShare: n(ev.located) ? n(ev.abroad) / n(ev.located) : 0,
  };
}

async function top(column: string, days: number, where = "type = 'pageview'", limit = 10) {
  const rows = (await sql.query(
    `select coalesce(${column}, 'Inconnu') k, count(distinct vid) v
     from events where ts >= now() - ($1 || ' days')::interval and ${where}
     group by 1 order by 2 desc limit ${limit}`,
    [String(days)],
  )) as Row[];
  return rows.map((r) => ({ key: String(r.k), value: n(r.v) }));
}

export async function dashboard(range: RangeKey) {
  await ensureSchema();
  const days = RANGES[range].days;
  const bucket = days > 120 ? "week" : "day";

  const [current, previous, daily, pages, channels, countries, cities, devices, browsers, hours, projects, actionsByPage, leads, sessions] =
    await Promise.all([
      kpis(days, 0),
      kpis(days * 2, days),
      sql.query(
        `with d as (
           select generate_series(date_trunc($2, (now() at time zone '${TZ}') - ($1 || ' days')::interval),
                                  date_trunc($2, now() at time zone '${TZ}'), ('1 ' || $2)::interval) b
         ),
         e as (
           select date_trunc($2, ts at time zone '${TZ}') b,
                  count(distinct vid) visitors,
                  count(distinct vid) filter (where type = any($3)) contacts
           from events where ts >= now() - ($1 || ' days')::interval group by 1
         ),
         l as (
           select date_trunc($2, ts at time zone '${TZ}') b, count(*) leads
           from leads where kind = 'contact' and ts >= now() - ($1 || ' days')::interval group by 1
         )
         select to_char(d.b, 'YYYY-MM-DD') day, coalesce(e.visitors, 0) visitors,
                coalesce(e.contacts, 0) contacts, coalesce(l.leads, 0) leads
         from d left join e using (b) left join l using (b) order by d.b`,
        [String(days), bucket, CONTACT_TYPES],
      ) as Promise<Row[]>,
      top("path", days, "type = 'pageview'", 12),
      top("channel", days, "type = 'pageview' and channel is not null"),
      top("country", days),
      top("city", days, "type = 'pageview' and city is not null"),
      top("device", days),
      top("browser", days),
      sql.query(
        `select extract(hour from ts at time zone '${TZ}')::int h, count(distinct vid) v
         from events where type = 'pageview' and ts >= now() - ($1 || ' days')::interval
         group by 1 order by 1`,
        [String(days)],
      ) as Promise<Row[]>,
      sql.query(
        `select split_part(path, '/', 4) slug,
                count(distinct vid) visitors,
                count(*) views
         from events where type = 'pageview' and path ~ '^/(fr|ar)/projets/[^/]+'
           and ts >= now() - ($1 || ' days')::interval
         group by 1 order by 2 desc`,
        [String(days)],
      ) as Promise<Row[]>,
      sql.query(
        `select coalesce(path, '?') k, count(*) v from events
         where type = any($2) and ts >= now() - ($1 || ' days')::interval
         group by 1 order by 2 desc limit 8`,
        [String(days), CONTACT_TYPES],
      ) as Promise<Row[]>,
      sql.query(
        `select * from leads where ts >= now() - ($1 || ' days')::interval
         order by ts desc limit 200`,
        [String(days)],
      ) as Promise<Row[]>,
      sql.query(
        `select sid, vid, min(ts) started, max(ts) ended,
                count(*) filter (where type = 'pageview') pages,
                count(*) filter (where type = any($2)) contacts,
                max(country) country, max(city) city, max(device) device,
                max(channel) channel,
                (select count(distinct s2.sid) from events s2 where s2.vid = e.vid) visits
         from events e where ts >= now() - ($1 || ' days')::interval
         group by sid, vid order by started desc limit 40`,
        [String(days), CONTACT_TYPES],
      ) as Promise<Row[]>,
    ]);

  return {
    range,
    bucket,
    current,
    previous,
    daily: daily.map((r) => ({
      day: String(r.day),
      visitors: n(r.visitors),
      contacts: n(r.contacts),
      leads: n(r.leads),
    })),
    pages,
    channels,
    countries,
    cities,
    devices,
    browsers,
    hours: Array.from({ length: 24 }, (_, h) => ({
      key: `${String(h).padStart(2, "0")} h`,
      value: n(hours.find((r) => n(r.h) === h)?.v),
    })),
    projects: projects.map((r) => ({ key: String(r.slug), visitors: n(r.visitors), views: n(r.views) })),
    actionsByPage: actionsByPage.map((r) => ({ key: String(r.k), value: n(r.v) })),
    leads: leads as Row[],
    sessions: sessions as Row[],
  };
}

export async function visitorJourney(vid: string) {
  await ensureSchema();
  const [events, leads] = await Promise.all([
    sql`select * from events where vid = ${vid} order by ts asc limit 2000`,
    sql`select * from leads where vid = ${vid} order by ts asc`,
  ]);
  return { events: events as Row[], leads: leads as Row[] };
}

export async function exportRows(kind: "leads" | "events", days: number) {
  await ensureSchema();
  return (await sql.query(
    kind === "leads"
      ? `select id, ts, kind, status, name, phone, email, project, budget, message, page,
                channel, country, city, device, notes, vid
         from leads where ts >= now() - ($1 || ' days')::interval order by ts desc`
      : `select ts, type, path, channel, referrer, utm_source, utm_medium, utm_campaign,
                country, region, city, device, browser, os, target, duration_ms, vid, sid
         from events where ts >= now() - ($1 || ' days')::interval order by ts desc limit 200000`,
    [String(days)],
  )) as Row[];
}
