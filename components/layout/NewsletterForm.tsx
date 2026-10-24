"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitLead } from "@/lib/lead";

/** Footer newsletter form; the sign-up is emailed to the sales inbox. */
export default function NewsletterForm() {
  const t = useTranslations("footer");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitLead({
        subject: `Inscription newsletter : ${email}`,
        fields: { Inscription: "Newsletter du site", "E-mail": email },
        replyTo: email,
        record: { kind: "newsletter", email },
      });
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="text-caption text-gold">
        {t("newsletterSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className="flex gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          {t("newsletterLabel")}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletterPlaceholder")}
          className="h-12 w-full border border-on-dark/20 bg-transparent px-4 text-caption font-light text-white placeholder:text-on-dark-muted focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="eyebrow h-12 shrink-0 bg-gold px-6 text-gold-on transition-colors hover:bg-gold-dark hover:text-ivory disabled:opacity-60"
        >
          {t("newsletterSubmit")}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-3 text-caption text-red-400">
          {t("newsletterError")}
        </p>
      )}
    </form>
  );
}
