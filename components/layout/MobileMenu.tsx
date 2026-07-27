"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Phone, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { site, whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/icons";
import LocaleSwitcher from "./LocaleSwitcher";
import { NAV_ITEMS } from "./Header";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  // Scroll lock + initial focus + Escape to close
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Close when navigating
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const list = {
    hidden: {},
    show: {
      transition: prefersReduced
        ? undefined
        : { staggerChildren: 0.07, delayChildren: 0.15 },
    },
  };
  const item = {
    hidden: prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: prefersReduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col bg-charcoal text-on-dark"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.openMenu")}
        >
          <div className="flex h-[68px] items-center justify-between px-4 md:px-8">
            <p className="micro-label text-gold">{t("common.brand")}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("nav.closeMenu")}
              className="p-2 transition-colors hover:text-gold"
            >
              <X size={26} aria-hidden />
            </button>
          </div>

          <motion.nav
            variants={list}
            initial="hidden"
            animate="show"
            aria-label="Navigation principale"
            className="flex flex-1 flex-col justify-center px-8"
          >
            <ul className="space-y-5">
              {NAV_ITEMS.map(({ key, href }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <motion.li key={key} variants={item}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`heading-display block text-[32px] leading-tight transition-colors hover:text-gold md:text-4xl ${
                        active ? "text-gold" : "text-on-dark"
                      }`}
                    >
                      {t(`nav.${key}`)}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              variants={item}
              className="mt-12 flex flex-col gap-5 border-t border-on-dark/15 pt-8"
            >
              <a
                href={whatsappLink(t("common.whatsappMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                className="micro-label flex items-center gap-3 text-gold"
              >
                <WhatsAppIcon size={16} />
                {t("common.cta.whatsapp")}
              </a>
              <a
                href={`tel:${site.phone}`}
                className="micro-label flex items-center gap-3"
              >
                <Phone size={14} aria-hidden />
                <span dir="ltr">{site.phoneDisplay}</span>
              </a>
              <LocaleSwitcher className="text-gold" />
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
