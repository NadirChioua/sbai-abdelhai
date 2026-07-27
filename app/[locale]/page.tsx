import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";

/**
 * Phase 3 placeholder homepage — a real full-viewport hero surface so the
 * transparent→solid header behavior is exercised. The actual hero video +
 * sections land in Phase 5.
 */
export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();

  return (
    <main className="flex-1">
      <section className="relative flex min-h-svh items-end">
        <Image
          src="/images/posters/tt-hero.jpg"
          alt={t("home.heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "var(--overlay-hero)" }}
        />
        {/* Top scrim: keeps transparent header + watermark corner legible */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/70 to-transparent"
        />
        <div className="relative mx-auto w-full max-w-screen-2xl px-4 pb-24 text-center md:px-8">
          <p className="micro-label text-gold">{t("common.since")}</p>
          <h1 className="heading-display text-shadow-hero mx-auto mt-5 max-w-3xl text-3xl text-white md:text-5xl">
            {t("home.heroPlaceholder")}
          </h1>
        </div>
      </section>

      {/* Phase 5: HeritageStrip, ProjectsGrid, FounderInterview, MRESection,
          CdM2030, Testimonials, ContactForm land here. */}
      <section className="mx-auto max-w-screen-2xl px-4 py-28 text-center md:px-8">
        <p className="micro-label text-muted">{t("home.sectionsComing")}</p>
      </section>
    </main>
  );
}
