import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";

// Phase 2 placeholder — replaced by the full homepage sections in Phase 5.
export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();

  return (
    <main className="flex flex-1 items-center justify-center bg-charcoal px-6">
      <div className="text-center">
        <p className="micro-label text-gold">{t("common.since")}</p>
        <h1 className="heading-display mt-6 text-4xl text-on-dark md:text-5xl">
          {t("common.brandFull")}
        </h1>
        <p className="mt-6 font-light tracking-wide text-muted">
          {t("home.heroPlaceholder")}
        </p>
      </div>
    </main>
  );
}
