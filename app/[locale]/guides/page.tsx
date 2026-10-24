import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/sections/PageHero";
import { GUIDES, GUIDE_UI } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides">): Promise<Metadata> {
  const { locale } = await params;
  const ui = GUIDE_UI[locale === "ar" ? "ar" : "fr"];
  return {
    title: ui.indexMetaTitle,
    description: ui.indexMetaDescription,
    ...pageMeta(locale, "/guides"),
  };
}

export default async function Page({ params }: PageProps<"/[locale]/guides">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "ar" ? "ar" : "fr";
  const ui = GUIDE_UI[lang];

  return (
    <main className="flex-1">
      <PageHero
        image="/images/heritage/corniche.jpg"
        imageAlt=""
        label={ui.label}
        title={ui.indexTitle}
        intro={ui.indexIntro}
      />
      <section className="bg-ivory">
        <ul className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-20 md:grid-cols-2 md:px-8 md:py-24">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="group block overflow-hidden rounded-lg border border-sand bg-white transition-shadow hover:shadow-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={g.image}
                    alt={g.imageAlt[lang]}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h2 className="heading-display text-h3 text-foreground">{g[lang].title}</h2>
                  <p className="mt-3 text-body font-light text-secondary">{g[lang].metaDescription}</p>
                  <span className="eyebrow mt-5 inline-flex items-center gap-2 text-gold-dark">
                    {ui.read}
                    <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
