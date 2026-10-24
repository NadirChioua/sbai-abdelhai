import { neon } from "@neondatabase/serverless";

/**
 * Postgres (Neon, via the Vercel integration) holding the site's own
 * analytics: every visit and action (`events`) and every form lead (`leads`).
 * Vercel Web Analytics stays on for the quick view; this store is what keeps
 * two years of history and the per-visitor detail behind /admin.
 *
 * Tables are created on first use, so a fresh database needs no migration step.
 */

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const dbConfigured = Boolean(url);

export const sql = neon(url ?? "postgresql://unset:unset@localhost/unset");

const SCHEMA = [
  `create table if not exists events (
     id bigserial primary key,
     ts timestamptz not null default now(),
     vid text not null,
     sid text not null,
     type text not null,
     path text,
     locale text,
     referrer text,
     channel text,
     utm_source text,
     utm_medium text,
     utm_campaign text,
     country text,
     region text,
     city text,
     device text,
     browser text,
     os text,
     target text,
     duration_ms integer
   )`,
  `create index if not exists events_ts on events (ts)`,
  `create index if not exists events_vid on events (vid, ts)`,
  `create index if not exists events_sid on events (sid)`,
  `create index if not exists events_type_ts on events (type, ts)`,
  `create table if not exists leads (
     id bigserial primary key,
     ts timestamptz not null default now(),
     kind text not null,
     vid text,
     sid text,
     name text,
     phone text,
     email text,
     project text,
     budget text,
     message text,
     page text,
     channel text,
     country text,
     city text,
     device text,
     status text not null default 'nouveau',
     notes text
   )`,
  `create index if not exists leads_ts on leads (ts)`,
  `create index if not exists leads_vid on leads (vid)`,
];

let ready: Promise<void> | null = null;

export function ensureSchema() {
  ready ??= (async () => {
    for (const stmt of SCHEMA) await sql.query(stmt);
  })().catch((err) => {
    ready = null; // retry on the next request
    throw err;
  });
  return ready;
}

/** Retention: events for 2 years (+1 month margin), leads for 3 years. */
export async function pruneOld() {
  await sql.query(`delete from events where ts < now() - interval '25 months'`);
  await sql.query(`delete from leads where ts < now() - interval '36 months'`);
}
