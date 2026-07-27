import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHero from "@/components/sections/PageHero";
import StackingTimeline, { type Chapter } from "@/components/sections/StackingTimeline";
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

const CHAPTERS = [
  { key: "m1973", numeral: "I", image: "/images/heritage/building-1980s.jpg" },
  { key: "m1980", numeral: "II", image: "/images/heritage/corniche.jpg" },
  { key: "m1990", numeral: "III", image: "/images/heritage/towers-fountain.jpg" },
  { key: "m2000", numeral: "IV", image: "/images/heritage/tower-centre.jpg" },
  { key: "m2010", numeral: "V", image: "/images/del-costa/exterieur-1.jpg" },
  { key: "m2020", numeral: "VI", image: "/images/villas-colline/drone-2.jpg" },
  { key: "m2024", numeral: "VII", image: "/images/posters/tt-hero.jpg" },
  { key: "m2026", numeral: "VIII", image: "/images/heritage/villas-bay.jpg" },
  { key: "vision", numeral: "IX", image: undefined },
] as const;

export default async function Page({
  params,
}: PageProps<"/[locale]/notre-histoire">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "history" });

  const chapters: Chapter[] = CHAPTERS.map((c, i) => ({
    year: t(`timeline.${c.key}.year`),
    numeral: c.numeral,
    label: t("chapter", { n: i + 1 }),
    title: t(`timeline.${c.key}.title`),
    body: t(`timeline.${c.key}.body`),
    image: c.image
      ? { src: c.image, alt: t(`timeline.${c.key}.imageAlt`) }
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

      <section className="bg-ivory">
        <div className="mx-auto max-w-screen-2xl px-4 pt-20 text-center md:px-8 md:pt-28">
          <p className="eyebrow">{t("timelineLabel")}</p>
          <h2 className="heading-display mx-auto mt-4 max-w-2xl text-h2 text-foreground">
            {t("timelineTitle")}
          </h2>
          <p className="drop-cap mx-auto mt-8 max-w-2xl text-start text-body font-light text-secondary">
            {t("timelineIntro")}
          </p>
          <div aria-hidden className="rule-diamond mt-14">
            <span className="text-caption">◆</span>
          </div>
        </div>
      </section>

      <StackingTimeline
        chapters={chapters}
        progressLabel={t("progressLabel")}
      />

      <FounderSection />

      <section className="bg-ivory-dark">
        <div className="section-y mx-auto max-w-screen-2xl px-4 md:px-8">
          <RevealOnScroll>
            <p className="eyebrow">{t("valuesLabel")}</p>
            <h2 className="heading-display mt-3 max-w-xl text-h2 text-foreground">
              {t("valuesTitle")}
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(["heritage", "trust", "roots"] as const).map((k, i) => (
              <RevealOnScroll key={k} delay={i * 0.1}>
                <Card className="h-full p-8 md:p-10">
                  <p className="heading-display text-h3 text-gold-dark">
                    {t(`values.${k}.title`)}
                  </p>
                  <p className="mt-4 text-body font-light text-secondary">
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
