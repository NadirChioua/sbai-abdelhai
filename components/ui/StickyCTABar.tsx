"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/config";

/**
 * Fixed bottom CTA bar for project pages (DAMAC pattern): project name +
 * Enquire + WhatsApp. Raises the floating WhatsApp button and pads the page
 * bottom so nothing is covered.
 */
export default function StickyCTABar({
  projectName,
  detail,
  enquireHref = "#contact",
}: {
  projectName: string;
  detail?: string;
  enquireHref?: string;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    document.body.style.setProperty("--sticky-cta-offset", "76px");
    document.body.style.paddingBottom = "76px";
    return () => {
      document.body.style.removeProperty("--sticky-cta-offset");
      document.body.style.paddingBottom = "";
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-ivory/97 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_14px_rgba(92,89,78,0.12)]">
      <div className="mx-auto flex h-[76px] max-w-screen-2xl items-center justify-between gap-4 px-4 md:px-8">
        <div className="min-w-0">
          <p className="heading-display truncate text-caption text-foreground">
            {projectName}
          </p>
          {detail && (
            <p className="eyebrow mt-0.5 hidden text-secondary sm:block">
              {detail}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <ButtonAnchor href={enquireHref} variant="primary">
            {t("cta.enquire")}
          </ButtonAnchor>
          <ButtonAnchor
            href={whatsappLink(t("whatsappProjectMessage", { project: projectName }))}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="max-sm:h-11 max-sm:w-11 max-sm:border-[#25D366] max-sm:p-0 max-sm:text-[#25D366]"
          >
            <WhatsAppIcon size={16} />
            <span className="max-sm:sr-only">{t("cta.whatsapp")}</span>
          </ButtonAnchor>
        </div>
      </div>
    </div>
  );
}
