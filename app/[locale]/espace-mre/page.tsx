import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Globe2, Languages, ShieldCheck } from "lucide-react";
import { routing } from "@/i18n/routing";
import PageHero from "@/components/sections/PageHero";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import GuideForm from "@/components/sections/GuideForm";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/espace-mre">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mre" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const STEPS = ["s1", "s2", "s3", "s4", "s5"] as const;
const TRUST = [
  { key: "years", Icon: ShieldCheck },
  { key: "delivered", Icon: Globe2 },
  { key: "response", Icon: Clock },
  { key: "languages", Icon: Languages },
] as const;
const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default async function Page({ params }: PageProps<"/[locale]/espace-mre">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "mre" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="flex-1">
      <PageHero
        image="/images/heritage/villas-bay.jpg"
        imageAlt={t("heroImageAlt")}
        label={t("label")}
        title={t("title")}
        intro={t("intro")}
      >
        <ButtonAnchor
          href={whatsappLink(t("whatsappMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
        >
          <WhatsAppIcon size={16} />
          {t("whatsappCta")}
        </ButtonAnchor>
      </PageHero>

      {/* Process */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
          <RevealOnScroll>
            <p className="eyebrow text-gold-dark">{t("processLabel")}</p>
            <h2 className="heading-display mt-3 max-w-xl text-h2 text-foreground">
              {t("processTitle")}
            </h2>
          </RevealOnScroll>
          <ol className="mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
            {STEPS.map((k, i) => (
              <RevealOnScroll as="li" key={k} delay={i * 0.08}>
                <p className="heading-display text-3xl text-gold/50">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-3 text-body text-foreground">
                  {t(`process.${k}.title`)}
                </h3>
                <p className="mt-2 text-body font-light text-secondary">
                  {t(`process.${k}.body`)}
                </p>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-teal text-on-dark">
        <div className="mx-auto max-w-screen-2xl px-4 py-20 md:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {TRUST.map(({ key, Icon }, i) => (
              <RevealOnScroll as="div" key={key} delay={i * 0.08}>
                <span className="block text-gold">
                  <Icon size={26} strokeWidth={1.5} aria-hidden />
                </span>
                <dd className="heading-display mt-4 text-h2 text-on-dark">
                  {t(`trust.${key}.value`)}
                </dd>
                <dt className="eyebrow mt-2 text-on-dark-muted">
                  {t(`trust.${key}.label`)}
                </dt>
              </RevealOnScroll>
            ))}
          </dl>
        </div>
      </section>

      <FAQ
        label={t("faqLabel")}
        title={t("faqTitle")}
        items={FAQ_KEYS.map((k) => ({
          question: t(`faq.${k}.q`),
          answer: t(`faq.${k}.a`),
        }))}
      />

      {/* Guide PDF capture */}
      <section className="bg-charcoal text-on-dark">
        <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
          <RevealOnScroll>
            <p className="eyebrow text-gold">{t("guide.label")}</p>
            <h2 className="heading-display mt-3 text-h2 text-on-dark">
              {t("guide.title")}
            </h2>
            <p className="mt-4 max-w-md text-body font-light text-on-dark-muted">
              {t("guide.body")}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <GuideForm />
            <p className="mt-6 text-caption font-light text-on-dark-muted">
              {t("guide.note")}
            </p>
            <ButtonAnchor
              href={whatsappLink(tc("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-light"
              className="mt-6"
            >
              <WhatsAppIcon size={15} />
              {tc("cta.whatsapp")}
            </ButtonAnchor>
          </RevealOnScroll>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
