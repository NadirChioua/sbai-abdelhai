import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { mailerConfigured, sendLeadEmail } from "@/lib/mailer";

const PROJECTS: Record<string, string> = {
  "triple-towers": "Triple Towers",
  "les-villas-de-la-colline": "Les Villas de la Colline",
  "del-costa": "Résidence Del Costa",
  "del-costa-2": "Del Costa 2",
  autre: "Autre / non précisé",
};

const BUDGETS: Record<string, string> = {
  lt1m: "Moins de 1 M DH",
  "1m-2m": "1 à 2 M DH",
  "2m-4m": "2 à 4 M DH",
  gt4m: "Plus de 4 M DH",
  nd: "Non précisé",
};

/**
 * Contact form handler: emails each lead to the sales inbox (lib/mailer.ts).
 *
 * If email delivery is not configured or fails, it answers 503 so the form
 * shows its error message, which points the visitor to WhatsApp. A lead is
 * never acknowledged unless it was actually delivered.
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
  const isGuide = (message ?? "").startsWith("[GUIDE MRE]");

  const subject = isGuide
    ? `Demande du guide MRE : ${email}`
    : `Nouveau contact site : ${name} · ${PROJECTS[project]}`;
  const fields: Record<string, string> = isGuide
    ? { Demande: "Guide MRE (PDF)", "E-mail": email || "-" }
    : {
        Nom: name,
        "Téléphone": phone,
        "E-mail": email || "non renseigné",
        Projet: PROJECTS[project],
        Budget: BUDGETS[budget],
        Message: message || "(aucun)",
        WhatsApp: `https://wa.me/${phone.replace(/[^0-9]/g, "")}`,
      };

  if (!mailerConfigured()) {
    console.error(`[contact-lead] email not configured, lead not delivered: ${subject}`);
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const sent = await sendLeadEmail({ subject, fields, replyTo: email || undefined });
  if (!sent) return NextResponse.json({ ok: false }, { status: 503 });
  return NextResponse.json({ ok: true });
}
