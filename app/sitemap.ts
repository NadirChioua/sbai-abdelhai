import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PAGES, SITE_URL, languageUrls } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency: path.startsWith("/projets") || path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path.startsWith("/projets") ? 0.9 : 0.6,
      alternates: { languages: languageUrls(path) },
    })),
  );
}
