"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  checkPassword,
  isAdmin,
  newSessionToken,
} from "@/lib/admin-auth";
import { ensureSchema, sql } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/admin-data";

export async function login(_prev: string | null, form: FormData) {
  const password = String(form.get("password") ?? "");
  // Slow down guessing: every attempt costs a second.
  await new Promise((r) => setTimeout(r, 1000));
  if (!checkPassword(password)) return "Mot de passe incorrect.";
  const { token, maxAge } = newSessionToken();
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function updateLead(form: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = Number(form.get("id"));
  const status = String(form.get("status") ?? "");
  const notes = String(form.get("notes") ?? "").slice(0, 2000);
  if (!Number.isInteger(id) || !(LEAD_STATUSES as readonly string[]).includes(status)) return;
  await ensureSchema();
  await sql`update leads set status = ${status}, notes = ${notes} where id = ${id}`;
  revalidatePath("/admin");
}
