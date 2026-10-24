import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Phone } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/sections/PageHero";
import FAQ from "@/components/sections/FAQ";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, whatsappLink } from "@/lib/config";
import { GUIDES, GUIDE_UI, getGuide } from "@/lib/guides";
import { SITE_URL, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    GUIDES.map((g) => ({ locale, slug: g.slug })),
  );
}

function pick(locale: string) {
  return locale === "ar" ? "ar" : "fr";
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const text = guide[pick(locale)];
  const meta = pageMeta(locale, `/guides/${slug}`);
  return {
    title: text.metaTitle,
    description: text.metaDescription,
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", images: [guide.image] },
  };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/guides/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getGuide(slug);
  if (!guide) notFound();
  const lang = pick(locale);
  const text = guide[lang];
  const ui = GUIDE_UI[lang];
  const url = `${SITE_URL}/${locale}/guides/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: text.title,
        description: text.metaDescription,
        image: `${SITE_URL}${guide.image}`,
        inLanguage: locale,
        mainEntityOfPage: url,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: text.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "SBAI Immobilier", item: `${SITE_URL}/${locale}` },
          { "@type": "ListItem", position: 2, name: ui.label, item: `${SITE_URL}/${locale}/guides` },
          { "@type": "ListItem", position: 3, name: text.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        image={guide.image}
        imageAlt={guide.imageAlt[lang]}
        label={ui.label}
        title={text.title}
        intro={text.intro}
      />

      <article className="bg-ivory">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-24">
          {text.sections.map((s) => (
            <section key={s.h} className="mt-12 first:mt-0">
              <h2 className="heading-display text-h3 text-foreground">{s.h}</h2>
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 ps-5 text-body font-light leading-relaxed text-secondary marker:text-gold-dark">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
              {s.p?.map((para) => (
                <p key={para} className="mt-4 text-body font-light leading-relaxed text-secondary">
                  {para}
                </p>
              ))}
            </section>
          ))}

          <nav aria-label={ui.related} className="mt-16 border-t border-sand pt-10">
            <p className="eyebrow text-gold-dark">{ui.related}</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {guide.related.map((href) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center rounded-full border border-sand px-5 text-caption text-foreground transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    {ui.projectNames[href]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </article>

      <FAQ
        label={ui.faq}
        title={text.title}
        className="bg-ivory-dark"
        items={text.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <section className="bg-charcoal text-on-dark">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-start gap-6 px-4 py-20 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 className="heading-display text-h2 text-on-dark">{ui.ctaTitle}</h2>
            <p className="mt-3 text-body font-light text-on-dark-muted">{ui.ctaBody}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <ButtonAnchor
              href={whatsappLink(text.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              <WhatsAppIcon size={16} />
              {ui.whatsapp}
            </ButtonAnchor>
            <ButtonAnchor href={`tel:${site.phone}`} variant="outline-light" size="lg">
              <Phone size={16} aria-hidden />
              {ui.call}
            </ButtonAnchor>
          </div>
        </div>
      </section>
    </main>
  );
}
