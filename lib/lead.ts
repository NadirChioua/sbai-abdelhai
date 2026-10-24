import { site } from "@/lib/config";
import type { ContactPayload } from "@/lib/contact-schema";
import { send, sessionId, visitorId } from "@/lib/visitor";

/**
 * Lead delivery: every form on the site posts straight from the visitor's
 * browser to FormSubmit (formsubmit.co), which emails it to `site.leadEmail`.
 * Browser-side on purpose: FormSubmit refuses requests from server/datacenter
 * IPs such as Vercel's, so a server route cannot relay them.
 */

export const PROJECT_LABELS: Record<ContactPayload["project"], string> = {
  "triple-towers": "Triple Towers",
  "les-villas-de-la-colline": "Les Villas de la Colline",
  "del-costa": "Résidence Del Costa",
  "del-costa-2": "Del Costa 2",
  autre: "Autre / non précisé",
};

export const BUDGET_LABELS: Record<ContactPayload["budget"], string> = {
  lt1m: "Moins de 1 M DH",
  "1m-2m": "1 à 2 M DH",
  "2m-4m": "2 à 4 M DH",
  gt4m: "Plus de 4 M DH",
  nd: "Non précisé",
};

export type LeadRecord = {
  kind: "contact" | "guide" | "newsletter";
  name?: string;
  phone?: string;
  email?: string;
  project?: string;
  budget?: string;
  message?: string;
};

/**
 * Resolves when FormSubmit accepted the lead; throws otherwise. The lead is
 * also copied to the admin database (fire-and-forget, never blocks the form).
 */
export async function submitLead({
  subject,
  fields,
  replyTo,
  record,
}: {
  subject: string;
  /** Label → value, in display order. */
  fields: Record<string, string>;
  replyTo?: string;
  record: LeadRecord;
}) {
  send("/api/lead", {
    ...record,
    vid: visitorId(),
    sid: sessionId().sid,
    page: window.location.pathname,
  });

  const res = await fetch(`https://formsubmit.co/ajax/${site.leadEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...fields,
      Page: window.location.href,
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...(replyTo ? { _replyto: replyTo } : {}),
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
  if (!res.ok || String(data.success) !== "true") {
    throw new Error(`FormSubmit ${res.status}`);
  }
}

export function contactLeadFields(data: ContactPayload) {
  return {
    subject: `Nouveau contact site : ${data.name} · ${PROJECT_LABELS[data.project]}`,
    fields: {
      Nom: data.name,
      "Téléphone": data.phone,
      "E-mail": data.email || "non renseigné",
      Projet: PROJECT_LABELS[data.project],
      Budget: BUDGET_LABELS[data.budget],
      Message: data.message || "(aucun)",
      WhatsApp: `https://wa.me/${data.phone.replace(/[^0-9]/g, "")}`,
    },
    replyTo: data.email || undefined,
    record: {
      kind: "contact" as const,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      project: PROJECT_LABELS[data.project],
      budget: BUDGET_LABELS[data.budget],
      message: data.message || undefined,
    },
  };
}
