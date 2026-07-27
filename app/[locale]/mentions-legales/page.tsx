import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/mentions-legales">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  };
}

/** Blocks whose body is legal text the client must supply verbatim. */
const TODO_BLOCKS = ["company", "publication", "hosting", "ip", "data", "cookies"] as const;

export default async function Page({
  params,
}: PageProps<"/[locale]/mentions-legales">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <main className="flex-1 bg-ivory">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <p className="eyebrow text-gold-dark">{t("label")}</p>
        <h1 className="heading-display mt-3 text-h1 text-foreground">
          {t("title")}
        </h1>
        <p className="mt-5 text-body font-light text-secondary">
          {t("intro")}
        </p>

        <div className="mt-14 space-y-12">
          {TODO_BLOCKS.map((k) => (
            <section key={k}>
              <h2 className="heading-display text-h3 text-foreground">
                {t(`sections.${k}.title`)}
              </h2>
              <p className="mt-4 text-body font-light text-secondary">
                {t(`sections.${k}.body`)}
              </p>
              <ul className="mt-4 space-y-1.5 text-caption font-light text-secondary">
                {t.raw(`sections.${k}.fields`)?.length > 0 &&
                  (t.raw(`sections.${k}.fields`) as string[]).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-gold-dark">·</span>
                      <span>
                        {f} —{" "}
                        <span className="italic text-muted">{t("todo")}</span>
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}

          <section id="confidentialite">
            <h2 className="heading-display text-h3 text-foreground">
              {t("sections.contact.title")}
            </h2>
            <p className="mt-4 text-body font-light text-secondary">
              {t("sections.contact.body")}
            </p>
            <p className="mt-3 text-caption font-light text-foreground">
              <a href={`mailto:${site.email}`} className="hover:text-gold-dark">
                {site.email}
              </a>
              {" · "}
              <a href={`tel:${site.phone}`} dir="ltr" className="hover:text-gold-dark">
                {site.phoneDisplay}
              </a>
            </p>
          </section>
        </div>

        <p className="mt-16 border-t border-sand pt-6 text-caption font-light text-muted">
          {t("lastUpdate")}
        </p>
      </div>
    </main>
  );
}
