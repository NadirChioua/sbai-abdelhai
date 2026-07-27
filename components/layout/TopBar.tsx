import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/icons";
import LocaleSwitcher from "./LocaleSwitcher";

/**
 * Utility bar above the header (DAMAC pattern). Collapses on scroll —
 * the collapse itself is orchestrated by Header via CSS grid rows.
 */
export default function TopBar() {
  const t = useTranslations();

  return (
    <div className="bg-charcoal text-on-dark">
      <div className="mx-auto flex h-9 max-w-screen-2xl items-center justify-between gap-4 px-4 md:px-8">
        <p className="micro-label hidden text-[10px] text-gold sm:block">
          {t("common.tagline")} · {t("common.since")}
        </p>
        <div className="flex items-center gap-5">
          <a
            href={`tel:${site.phone}`}
            className="micro-label flex items-center gap-2 text-[10px] transition-colors hover:text-gold"
          >
            <Phone size={12} aria-hidden />
            <span dir="ltr">{site.phoneDisplay}</span>
          </a>
          <a
            href={whatsappLink(t("common.whatsappMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-label flex items-center gap-2 text-[10px] transition-colors hover:text-gold"
          >
            <WhatsAppIcon size={12} />
            {t("common.cta.whatsapp")}
          </a>
          <LocaleSwitcher className="text-[10px]" />
        </div>
      </div>
    </div>
  );
}
