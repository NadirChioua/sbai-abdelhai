/**
 * Consent gate (loi 09-08 / CNDP).
 *
 * The site sets NO cookie: fonts are self-hosted, maps are static local
 * images, videos are served from our own origin. Vercel Web Analytics runs
 * for every visitor because it is cookieless and stores no personal
 * identifier (disclosed in the privacy notice). Anything that would set a
 * cookie or load a third-party embed must call `hasConsent()` first.
 */
export const CONSENT_KEY = "sbai-consent-v1";

export type ConsentValue = "granted" | "denied";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null; // private mode / storage disabled
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable — treat as denied for this session */
  }
  window.dispatchEvent(new CustomEvent("sbai:consent", { detail: value }));
}

/** Guard for any future third-party script. Denies unless explicitly granted. */
export function hasConsent(): boolean {
  return readConsent() === "granted";
}
