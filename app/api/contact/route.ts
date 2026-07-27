import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

/**
 * Contact form handler.
 *
 * TODO(client): plug an email provider (Resend recommended on Vercel) once
 * an API key + destination inbox are provided — see the marked block below.
 * Until then submissions are validated and logged server-side so nothing
 * fake is promised to the visitor (the UI presents WhatsApp as the fastest
 * channel).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot tripped — pretend success, drop silently.
  if (parsed.data.company !== undefined && parsed.data.company !== "") {
    return NextResponse.json({ ok: true });
  }

  const { name, phone, email, project, budget, message } = parsed.data;

  // TODO(client): replace with Resend/SendGrid dispatch:
  //   await resend.emails.send({ to: site.email, subject: `Lead ${project}`, ... })
  console.log(
    `[contact-lead] ${new Date().toISOString()} project=${project} budget=${budget} name=${name} phone=${phone} email=${email || "-"} message=${(message || "").slice(0, 200)}`,
  );

  return NextResponse.json({ ok: true });
}
