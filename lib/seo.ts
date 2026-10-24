import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/config";
import { GUIDES } from "@/lib/guides";

/** Canonical origin. www is primary: the apex and the .ma domain redirect here. */
export const SITE_URL = "https://www.sbai-abdelhai.com";

/** Every indexable path, without the locale prefix. */
export const PAGES = [
  "",
  "/projets",
  "/projets/triple-towers",
  "/projets/les-villas-de-la-colline",
  "/projets/del-costa",
  "/projets/del-costa-2",
  "/notre-histoire",
  "/espace-mre",
  "/contact",
  "/mentions-legales",
  "/guides",
  ...GUIDES.map((g) => `/guides/${g.slug}`),
];

export type PagePath = string;

/** fr → /fr/contact, ar → /ar/contact, plus x-default on the French page. */
export function languageUrls(path: PagePath) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;
  return languages;
}

/**
 * Per-page canonical, hreflang alternates and Open Graph URL/locale.
 * Spread into each page's generateMetadata result.
 */
export function pageMeta(locale: string, path: PagePath): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    alternates: { canonical: url, languages: languageUrls(path) },
    openGraph: {
      url,
      locale: locale === "ar" ? "ar_MA" : "fr_MA",
      alternateLocale: locale === "ar" ? ["fr_MA"] : ["ar_MA"],
    },
  };
}

/** schema.org description of the company, rendered once in the layout. */
export function organizationJsonLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["RealEstateAgent", "Organization"],
        "@id": `${SITE_URL}/#organization`,
        name: site.name,
        alternateName: [site.legalName, "SBAI Abdelhai", "Groupe Abdelhai Sbai"],
        url: `${SITE_URL}/${locale}`,
        logo: `${SITE_URL}/logo/sbai-original.png`,
        image: `${SITE_URL}/images/posters/tt-morning.jpg`,
        description,
        foundingDate: String(site.foundingYear),
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "184 avenue Mohammed VI, Résidence Borj Khalij",
          addressLocality: "Tanger",
          addressCountry: "MA",
        },
        areaServed: { "@type": "City", name: "Tanger" },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: site.phone,
            contactType: "sales",
            availableLanguage: ["French", "Arabic", "Spanish", "English"],
          },
          {
            "@type": "ContactPoint",
            telephone: site.mobile,
            contactType: "customer service",
            availableLanguage: ["French", "Arabic"],
          },
        ],
        sameAs: [site.social.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: site.name,
        inLanguage: ["fr", "ar"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
