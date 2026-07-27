"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { readConsent, writeConsent } from "@/lib/consent";
import { Button } from "@/components/ui/Button";

/**
 * Consent banner. "Refuser" and "Accepter" carry identical visual weight —
 * CNDP requires that refusing be no harder than accepting, so no dark pattern
 * (no greyed-out secondary, no tiny "continue without accepting" link).
 */
export default function ConsentBanner() {
  const t = useTranslations("consent");
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only render once we know the stored answer — avoids a flash on repeat visits.
    if (readConsent() === null) setOpen(true);
  }, []);

  function decide(value: "granted" | "denied") {
    writeConsent(value);
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t("title")}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-lg border border-gold/30 bg-charcoal/98 p-5 text-on-dark shadow-card backdrop-blur-sm md:inset-x-6 md:bottom-6 md:p-6"
        >
          <p className="eyebrow text-gold">{t("title")}</p>
          <p className="mt-3 text-caption leading-relaxed text-on-dark-muted">
            {t("body")}{" "}
            <Link href="/mentions-legales" className="link-underline text-gold">
              {t("readMore")}
            </Link>
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => decide("granted")} className="sm:min-w-40">
              {t("accept")}
            </Button>
            <Button
              variant="outline-light"
              onClick={() => decide("denied")}
              className="sm:min-w-40"
            >
              {t("refuse")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
