import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHero from "@/components/sections/PageHero";
import Timeline, { type Milestone } from "@/components/sections/Timeline";
import FounderSection from "@/components/sections/FounderSection";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import ContactSection from "@/components/sections/ContactSection";
import { Card } from "@/components/ui/Card";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/notre-histoire">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "history" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const MILESTONE_KEYS = ["m1973", "m1980", "m1995", "m2010", "m2020", "m2026"] as const;

const MILESTONE_IMAGES: Partial<Record<(typeof MILESTONE_KEYS)[number], string>> = {
  m1973: "/images/heritage/building-1980s.jpg",
  m1980: "/images/heritage/corniche.jpg",
  m1995: "/images/heritage/towers-fountain.jpg",
  m2010: "/images/heritage/villas-bay.jpg",
  m2020: "/images/heritage/tower-centre.jpg",
  m2026: "/images/posters/tt-hero.jpg",
};

export default async function Page({
  params,
}: PageProps<"/[locale]/notre-histoire">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "history" });

  const milestones: Milestone[] = MILESTONE_KEYS.map((k) => ({
    year: t(`timeline.${k}.year`),
    title: t(`timeline.${k}.title`),
    body: t(`timeline.${k}.body`),
    image: MILESTONE_IMAGES[k]
      ? { src: MILESTONE_IMAGES[k]!, alt: t(`timeline.${k}.imageAlt`) }
      : undefined,
  }));

  return (
    <main className="flex-1">
      <PageHero
        image="/images/heritage/towers-fountain.jpg"
        imageAlt={t("heroImageAlt")}
        label={t("label")}
        title={t("title")}
        intro={t("intro")}
      />

      <Timeline
        label={t("timelineLabel")}
        title={t("timelineTitle")}
        milestones={milestones}
      />

      <FounderSection />

      <section className="bg-ivory-dark">
        <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
          <RevealOnScroll>
            <p className="micro-label text-gold-dark">{t("valuesLabel")}</p>
            <h2 className="heading-display mt-3 max-w-xl text-2xl text-foreground md:text-3xl">
              {t("valuesTitle")}
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(["heritage", "trust", "roots"] as const).map((k, i) => (
              <RevealOnScroll key={k} delay={i * 0.1}>
                <Card className="h-full p-8 md:p-10">
                  <p className="heading-display text-lg text-gold-dark">
                    {t(`values.${k}.title`)}
                  </p>
                  <p className="mt-4 text-sm font-light leading-relaxed text-secondary">
                    {t(`values.${k}.body`)}
                  </p>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
          {/* TODO(client): team photos not provided — section intentionally
              omitted rather than filled with stock imagery. */}
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
