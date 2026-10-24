/**
 * Browser-side visitor identity for the first-party analytics (/api/e).
 *
 * - vid: random id kept in localStorage, so a returning visitor is recognised
 *   (no cookie, nothing personal; cleared with the site's data).
 * - sid: session id, renewed after 30 minutes without activity.
 */

const VID = "sbai-vid";
const SID = "sbai-sid";
const SESSION_IDLE_MS = 30 * 60 * 1000;

function rid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function store(kind: "local" | "session") {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

let memoryVid: string | null = null;

export function visitorId() {
  const s = store("local");
  let v = s?.getItem(VID) ?? memoryVid;
  if (!v) {
    v = rid();
    try {
      s?.setItem(VID, v);
    } catch {
      /* storage full or blocked */
    }
  }
  memoryVid = v;
  return v;
}

/** Returns the session id and whether this call started a new session. */
export function sessionId(): { sid: string; isNew: boolean } {
  const s = store("session");
  const now = Date.now();
  let isNew = false;
  let entry: { id: string; at: number } | null = null;
  try {
    entry = JSON.parse(s?.getItem(SID) ?? "null");
  } catch {
    entry = null;
  }
  if (!entry || now - entry.at > SESSION_IDLE_MS) {
    entry = { id: rid(), at: now };
    isNew = true;
  }
  entry.at = now;
  try {
    s?.setItem(SID, JSON.stringify(entry));
  } catch {
    /* ignore */
  }
  return { sid: entry.id, isNew };
}

export function send(url: string, payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(url, new Blob([body], { type: "text/plain" }))) return;
  } catch {
    /* fall through */
  }
  fetch(url, { method: "POST", body, keepalive: true }).catch(() => {});
}

export function track(type: string, extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const { sid } = sessionId();
  send("/api/e", { vid: visitorId(), sid, type, path: location.pathname, ...extra });
}
