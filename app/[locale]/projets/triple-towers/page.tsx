import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { projectBySlug } from "@/lib/projects";
import ProjectPage from "@/components/sections/ProjectPage";

const SLUG = "triple-towers";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projets/triple-towers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.items.tripleTowers" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/projets/triple-towers">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectPage project={projectBySlug(SLUG)!} locale={locale} />;
}
