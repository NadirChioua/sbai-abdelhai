import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConfigured, ensureSchema, sql } from "@/lib/db";
import { device, geo } from "@/lib/visitor-context";

const short = (n: number) => z.string().trim().max(n).nullish();

const schema = z.object({
  kind: z.enum(["contact", "guide", "newsletter"]),
  vid: short(64),
  sid: short(64),
  name: short(120),
  phone: short(40),
  email: short(200),
  project: short(60),
  budget: short(60),
  message: short(2000),
  page: short(500),
});

/**
 * Copy of every form lead into the admin database. The email itself still
 * goes through FormSubmit from the browser; this record is what the
 * dashboard lists, ties to the visitor's journey and lets the team follow up.
 */
export async function POST(request: Request) {
  if (!dbConfigured) return new NextResponse(null, { status: 204 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const l = parsed.data;
  const ua = request.headers.get("user-agent") ?? "";
  const { country, city } = geo(request.headers);

  try {
    await ensureSchema();
    // Channel = how this visitor first arrived, from their first pageview.
    const first = l.vid
      ? await sql`select channel from events where vid = ${l.vid} and type = 'pageview'
                  order by ts asc limit 1`
      : [];
    await sql`
      insert into leads (kind, vid, sid, name, phone, email, project, budget, message,
        page, channel, country, city, device)
      values (${l.kind}, ${l.vid ?? null}, ${l.sid ?? null}, ${l.name ?? null}, ${l.phone ?? null},
        ${l.email ?? null}, ${l.project ?? null}, ${l.budget ?? null}, ${l.message ?? null},
        ${l.page ?? null}, ${(first[0]?.channel as string | undefined) ?? null},
        ${country}, ${city}, ${device(ua).device})`;
  } catch (err) {
    console.error("[lead] insert failed", err);
    return new NextResponse(null, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
