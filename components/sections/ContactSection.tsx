"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { contactSchema, type ContactPayload } from "@/lib/contact-schema";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button, ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, whatsappLink } from "@/lib/config";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

type Status = "idle" | "sending" | "sent" | "error";

/** "Réservez une visite" — the qualifying lead form (strategy Pilier 2). */
export default function ContactSection({
  defaultProject = "autre",
}: {
  /** Preselects the project dropdown when embedded on a project page. */
  defaultProject?: ContactPayload["project"];
} = {}) {
  const t = useTranslations("contactForm");
  const tc = useTranslations("common");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { project: defaultProject, budget: "nd", email: "", message: "" },
  });

  async function onSubmit(data: ContactPayload) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-charcoal text-on-dark">
      <div className="mx-auto grid max-w-screen-2xl gap-14 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-5">
        <RevealOnScroll className="lg:col-span-2">
          <p className="micro-label text-gold">{t("label")}</p>
          <h2 className="heading-display mt-3 text-2xl text-white md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-on-dark/75">
            {t("body")}
          </p>
          <div className="mt-10 space-y-4">
            <ButtonAnchor
              href={whatsappLink(tc("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="w-full sm:w-auto"
            >
              <WhatsAppIcon size={15} />
              {t("whatsappCta")}
            </ButtonAnchor>
            <p className="text-xs font-light text-on-dark/60">{t("orCall")}</p>
            <a
              href={`tel:${site.phone}`}
              className="flex items-center gap-3 text-sm text-on-dark transition-colors hover:text-gold"
            >
              <Phone size={15} aria-hidden />
              <span dir="ltr">{site.phoneDisplay}</span>
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="lg:col-span-3">
          {status === "sent" ? (
            <div
              role="status"
              className="flex h-full min-h-72 flex-col items-center justify-center border border-gold/40 p-10 text-center"
            >
              <p className="heading-display text-xl text-gold">
                {t("successTitle")}
              </p>
              <p className="mt-4 max-w-sm text-sm font-light text-on-dark/80">
                {t("successBody")}
              </p>
              <Button
                variant="outline-light"
                className="mt-8"
                onClick={() => setStatus("idle")}
              >
                {t("sendAnother")}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="grid gap-6 [&_label]:text-on-dark/70 sm:grid-cols-2"
            >
              <Input
                label={t("fields.name")}
                autoComplete="name"
                error={errors.name && t("errors.name")}
                tone="dark"
                {...register("name")}
              />
              <Input
                label={t("fields.phone")}
                type="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="+212 6 XX XX XX XX"
                error={errors.phone && t("errors.phone")}
                tone="dark"
                {...register("phone")}
              />
              <Input
                label={t("fields.email")}
                type="email"
                autoComplete="email"
                dir="ltr"
                error={errors.email && t("errors.email")}
                tone="dark"
                {...register("email")}
              />
              <Select
                label={t("fields.project")}
                error={errors.project && t("errors.required")}
                tone="dark"
                {...register("project")}
              >
                <option value="autre">{t("projectOptions.autre")}</option>
                <option value="triple-towers">Triple Towers</option>
                <option value="les-villas-de-la-colline">
                  Les Villas de la Colline
                </option>
                <option value="del-costa">Résidence Del Costa</option>
              </Select>
              <Select
                label={t("fields.budget")}
                error={errors.budget && t("errors.required")}
                tone="dark"
                {...register("budget")}
              >
                <option value="nd">{t("budgetOptions.nd")}</option>
                <option value="lt1m">{t("budgetOptions.lt1m")}</option>
                <option value="1m-2m">{t("budgetOptions.m1m2")}</option>
                <option value="2m-4m">{t("budgetOptions.m2m4")}</option>
                <option value="gt4m">{t("budgetOptions.gt4m")}</option>
              </Select>
              <div className="sm:col-span-2">
                <Textarea
                  label={t("fields.message")}
                  rows={4}
                  error={errors.message && t("errors.message")}
                  tone="dark"
                  {...register("message")}
                />
              </div>
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
                {...register("company")}
              />
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto"
                >
                  {status === "sending" ? t("sending") : t("submit")}
                </Button>
                {status === "error" && (
                  <p role="alert" className="mt-4 text-sm text-red-400">
                    {t("errorBody")}
                  </p>
                )}
              </div>
            </form>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
