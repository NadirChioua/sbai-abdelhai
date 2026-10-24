import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-sand bg-white p-8 shadow-card">
        <p className="eyebrow text-gold-dark">SBAI Immobilier</p>
        <h1 className="heading-display mt-2 text-h3">Tableau de bord</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 text-caption text-secondary">
            Accès non configuré : ajoutez la variable ADMIN_PASSWORD dans Vercel.
          </p>
        )}
      </div>
    </main>
  );
}
