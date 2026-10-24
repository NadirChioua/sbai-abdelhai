import { site } from "@/lib/config";

/**
 * Lead delivery by email.
 *
 * Default: FormSubmit (formsubmit.co), which forwards each submission to
 * `site.leadEmail` with no account and no DNS setup. The inbox owner clicked
 * its one-time "Activate Form" link.
 *
 * Optional: Resend, used instead when these Vercel environment variables are
 * set (never in the repo): RESEND_API_KEY, LEAD_TO_EMAIL (comma-separated),
 * LEAD_FROM_EMAIL (sender on a domain verified in Resend).
 */
function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL);
}

export function mailerConfigured() {
  return resendConfigured() || Boolean(site.leadEmail);
}

export async function sendLeadEmail({
  subject,
  fields,
  replyTo,
}: {
  subject: string;
  /** Label → value, in display order. */
  fields: Record<string, string>;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const res = resendConfigured()
      ? await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.LEAD_FROM_EMAIL ?? "Site SBAI <onboarding@resend.dev>",
            to: process.env.LEAD_TO_EMAIL!.split(",").map((s) => s.trim()),
            subject,
            text: Object.entries(fields)
              .map(([k, v]) => `${k} : ${v}`)
              .join("\n"),
            ...(replyTo ? { reply_to: replyTo } : {}),
          }),
        })
      : await fetch(`https://formsubmit.co/ajax/${site.leadEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: "https://www.sbai-abdelhai.com",
            Referer: "https://www.sbai-abdelhai.com/",
          },
          body: JSON.stringify({
            ...fields,
            _subject: subject,
            _template: "table",
            _captcha: "false",
            ...(replyTo ? { _replyto: replyTo } : {}),
          }),
        });

    const raw = await res.text();
    // FormSubmit answers 200 with {"success":"false"} when it refuses.
    if (!res.ok || raw.includes('"success":"false"') || raw.includes('"success":false')) {
      console.error(`[lead-email] ${res.status}: ${raw.slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lead-email] network error", err);
    return false;
  }
}
