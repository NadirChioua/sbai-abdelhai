import { NextResponse } from "next/server";
import { z } from "zod";
import { mailerConfigured, sendLeadEmail } from "@/lib/mailer";

const schema = z.object({
  email: z.string().trim().email().max(200),
  // Honeypot — humans never fill this
  company: z.literal("").optional(),
});

/** Footer newsletter sign-up: emails the address to the sales inbox. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });
  if (parsed.data.company) return NextResponse.json({ ok: true });

  if (!mailerConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const sent = await sendLeadEmail({
    subject: `Inscription newsletter : ${parsed.data.email}`,
    fields: { Inscription: "Newsletter du site", "E-mail": parsed.data.email },
    replyTo: parsed.data.email,
  });
  return NextResponse.json({ ok: sent }, { status: sent ? 200 : 503 });
}
