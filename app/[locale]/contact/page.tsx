import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Languages, Mail, MapPin, Phone } from "lucide-react";
import { routing } from "@/i18n/routing";
import ContactSection from "@/components/sections/ContactSection";
import LocationMap from "@/components/sections/LocationMap";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { site, whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/icons";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="flex-1">
      <section className="bg-ivory">
        <div className="mx-auto max-w-screen-2xl px-4 pb-6 pt-14 md:px-8 md:pt-20">
          <RevealOnScroll>
            <p className="micro-label text-gold-dark">{t("label")}</p>
            <h1 className="heading-display mt-3 max-w-2xl text-3xl text-foreground md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-secondary md:text-base">
              {t("intro")}
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid gap-8 border-y border-sand py-10 sm:grid-cols-2 lg:grid-cols-4">
            <RevealOnScroll>
              <p className="micro-label text-gold-dark">{t("addressLabel")}</p>
              <p className="mt-3 flex items-start gap-3 text-sm font-light text-foreground">
                <MapPin size={16} aria-hidden className="mt-0.5 shrink-0" />
                {site.address}
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.06}>
              <p className="micro-label text-gold-dark">{t("phoneLabel")}</p>
              <a
                href={`tel:${site.phone}`}
                className="mt-3 flex items-center gap-3 text-sm font-light transition-colors hover:text-gold-dark"
              >
                <Phone size={16} aria-hidden />
                <span dir="ltr">{site.phoneDisplay}</span>
              </a>
              <a
                href={whatsappLink(tc("whatsappMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-3 text-sm font-light transition-colors hover:text-gold-dark"
              >
                <WhatsAppIcon size={15} />
                <span dir="ltr">{site.mobileDisplay}</span>
              </a>
            </RevealOnScroll>
            <RevealOnScroll delay={0.12}>
              <p className="micro-label text-gold-dark">{t("emailLabel")}</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 flex items-center gap-3 text-sm font-light transition-colors hover:text-gold-dark"
              >
                <Mail size={16} aria-hidden />
                {site.email}
              </a>
            </RevealOnScroll>
            <RevealOnScroll delay={0.18}>
              <p className="micro-label text-gold-dark">{t("hoursLabel")}</p>
              <p className="mt-3 flex items-start gap-3 text-sm font-light text-foreground">
                <Clock size={16} aria-hidden className="mt-0.5 shrink-0" />
                {t("hours")}
              </p>
              <p className="mt-2 flex items-start gap-3 text-sm font-light text-secondary">
                <Languages size={16} aria-hidden className="mt-0.5 shrink-0" />
                {t("languages")}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <ContactSection />

      <LocationMap
        label={t("mapLabel")}
        title={t("mapTitle")}
        body={t("mapBody")}
        query={site.mapQuery}
        mapTitle={t("mapEmbedTitle")}
        address={site.address}
      />
    </main>
  );
}
