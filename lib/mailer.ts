/**
 * Lead delivery by email through Resend's HTTP API (no SDK needed).
 *
 * Configured on Vercel with environment variables, never in the repo:
 * - RESEND_API_KEY   the Resend API key
 * - LEAD_TO_EMAIL    inbox that receives the leads (comma-separated for several)
 * - LEAD_FROM_EMAIL  sender on a domain verified in Resend,
 *                    e.g. "Site SBAI <site@sbai-abdelhai.com>"
 */
export function mailerConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL);
}

export async function sendLeadEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!mailerConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "Site SBAI <site@sbai-abdelhai.com>",
        to: process.env.LEAD_TO_EMAIL!.split(",").map((s) => s.trim()),
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[lead-email] Resend ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lead-email] network error", err);
    return false;
  }
}
