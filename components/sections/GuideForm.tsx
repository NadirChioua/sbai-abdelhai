"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { submitLead } from "@/lib/lead";

/**
 * Email capture for the MRE guide.
 * TODO(client): the PDF itself does not exist yet — the request is emailed to
 * the sales inbox and the confirmation says the guide will be sent by email,
 * so no broken download is ever promised.
 */
export default function GuideForm() {
  const t = useTranslations("mre.guide");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitLead({
        subject: `Demande du guide MRE : ${email}`,
        fields: { Demande: "Guide MRE (PDF)", "E-mail": email },
        replyTo: email,
      });
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-gold/40 p-8">
        <p className="heading-display text-h3 text-gold">{t("successTitle")}</p>
        <p className="mt-3 text-caption font-light text-on-dark-muted">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <Input
        label={t("emailLabel")}
        type="email"
        required
        dir="ltr"
        autoComplete="email"
        tone="dark"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" className="mt-5" disabled={status === "sending"}>
        {status === "sending" ? t("sending") : t("submit")}
      </Button>
      {status === "error" && (
        <p role="alert" className="mt-3 text-caption text-red-300">
          {t("error")}
        </p>
      )}
    </form>
  );
}
