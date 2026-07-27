import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { projectBySlug } from "@/lib/projects";
import ProjectPage from "@/components/sections/ProjectPage";

const SLUG = "del-costa";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projets/del-costa">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.items.delCosta" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/projets/del-costa">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectPage project={projectBySlug(SLUG)!} locale={locale} />;
}
