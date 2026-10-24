import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Single-admin auth for /admin. The password lives only in the Vercel
 * environment variable ADMIN_PASSWORD. A successful login sets an httpOnly
 * cookie holding an expiry signed with HMAC (key derived from the password,
 * so changing the password logs every session out).
 */

export const ADMIN_COOKIE = "sbai_admin";
const SESSION_DAYS = 7;

function key() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", "sbai-admin-session").update(pw).digest();
}

function sign(payload: string) {
  const k = key();
  if (!k) return null;
  return createHmac("sha256", k).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  // Compare HMACs so the comparison is constant-time whatever the lengths.
  const h = (v: string) => createHmac("sha256", "cmp").update(v).digest("hex");
  return safeEqual(h(input), h(pw));
}

export function newSessionToken() {
  const exp = String(Date.now() + SESSION_DAYS * 86400_000);
  return { token: `${exp}.${sign(exp)}`, maxAge: SESSION_DAYS * 86400 };
}

export function verifyToken(token: string | undefined) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  const expected = exp ? sign(exp) : null;
  if (!exp || !sig || !expected || !safeEqual(sig, expected)) return false;
  return Number(exp) > Date.now();
}

/** For admin pages and routes: redirects to the login page when not signed in. */
export async function requireAdmin() {
  const jar = await cookies();
  if (!verifyToken(jar.get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}
