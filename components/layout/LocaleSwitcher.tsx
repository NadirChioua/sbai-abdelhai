"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function LocaleSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "fr" ? "ar" : "fr";

  return (
    <Link
      href={pathname}
      locale={other}
      className={`micro-label transition-colors hover:text-gold ${className}`}
      // Announce the switch in the target language
      lang={other}
      dir={other === "ar" ? "rtl" : "ltr"}
    >
      {t("switchLocale")}
    </Link>
  );
}
