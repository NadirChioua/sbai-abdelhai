import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp button — bottom-end corner (RTL-aware), above the
 * mobile safe area. Pulse ring every 4s, disabled by the global
 * prefers-reduced-motion kill switch in globals.css.
 */
export default function WhatsAppFloat() {
  const t = useTranslations("common");

  return (
    <a
      href={whatsappLink(t("whatsappMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappAria")}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:scale-105 ltr:right-5 rtl:left-5 md:h-[60px] md:w-[60px] whatsapp-pulse"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
