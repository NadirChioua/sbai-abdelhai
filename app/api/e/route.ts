import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConfigured, ensureSchema, pruneOld, sql } from "@/lib/db";
import { channel, device, geo, isBot } from "@/lib/visitor-context";

const TYPES = [
  "pageview",
  "page_leave",
  "whatsapp_click",
  "phone_click",
  "email_click",
  "catalogue_download",
  "video_play",
  "outbound_click",
] as const;

const short = (n: number) => z.string().max(n).nullish();

const schema = z.object({
  vid: z.string().min(8).max(64),
  sid: z.string().min(8).max(64),
  type: z.enum(TYPES),
  path: short(500),
  referrer: short(1000),
  utm_source: short(100),
  utm_medium: short(100),
  utm_campaign: short(200),
  target: short(500),
  duration_ms: z.number().int().min(0).max(6 * 3600 * 1000).nullish(),
});

/** First-party event collector (the site's tracker posts here with sendBeacon). */
export async function POST(request: Request) {
  if (!dbConfigured) return new NextResponse(null, { status: 204 });
  const ua = request.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new NextResponse(null, { status: 204 });

  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const e = parsed.data;

  const path = e.path ?? null;
  const locale = path?.match(/^\/(fr|ar)(\/|$)/)?.[1] ?? null;
  const { country, region, city } = geo(request.headers);
  const d = device(ua);
  const ch = e.type === "pageview" ? channel(e.referrer ?? null, e.utm_source ?? null, ua) : null;

  try {
    await ensureSchema();
    await sql`
      insert into events (vid, sid, type, path, locale, referrer, channel,
        utm_source, utm_medium, utm_campaign, country, region, city,
        device, browser, os, target, duration_ms)
      values (${e.vid}, ${e.sid}, ${e.type}, ${path}, ${locale}, ${e.referrer ?? null}, ${ch},
        ${e.utm_source ?? null}, ${e.utm_medium ?? null}, ${e.utm_campaign ?? null},
        ${country}, ${region}, ${city}, ${d.device}, ${d.browser}, ${d.os},
        ${e.target ?? null}, ${e.duration_ms ?? null})`;
    if (Math.random() < 0.005) await pruneOld();
  } catch (err) {
    console.error("[track] insert failed", err);
    return new NextResponse(null, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
