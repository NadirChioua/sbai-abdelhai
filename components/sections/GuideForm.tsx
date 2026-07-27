"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/**
 * Email capture for the MRE guide.
 * TODO(client): the PDF itself does not exist yet — the endpoint records the
 * request and the confirmation says the guide will be sent by email, so no
 * broken download is ever promised.
 */
export default function GuideForm() {
  const t = useTranslations("mre.guide");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Demande guide MRE",
          phone: "+212000000000",
          email,
          project: "autre",
          budget: "nd",
          message: "[GUIDE MRE] Demande de réception du guide PDF",
          company: "",
        }),
      });
      if (!res.ok) throw new Error();
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
