"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-caption text-secondary">Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 h-12 w-full rounded border border-sand bg-ivory px-4 focus:border-gold focus:outline-none"
        />
      </label>
      {error && (
        <p role="alert" className="text-caption text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="eyebrow h-12 w-full rounded bg-charcoal text-ivory transition-colors hover:bg-gold-dark disabled:opacity-60"
      >
        {pending ? "Vérification…" : "Se connecter"}
      </button>
    </form>
  );
}
