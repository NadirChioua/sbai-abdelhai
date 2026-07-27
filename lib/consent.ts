/**
 * Consent gate (loi 09-08 / CNDP).
 *
 * The site currently loads NO third-party resource and sets NO measurement
 * cookie: fonts are self-hosted, maps are static local images, videos are
 * served from our own origin. This module exists so that stays true by
 * construction — any future analytics or embed must call `hasConsent()`
 * before it is allowed to load, rather than being dropped in at the top of
 * the layout where it would fire before the visitor ever sees the banner.
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
