import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import ConsentBanner from "@/components/layout/ConsentBanner";
import "../globals.css";

const marcellus = localFont({
  src: "../../public/fonts/marcellus.woff2",
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const jost = localFont({
  src: "../../public/fonts/jost.woff2",
  weight: "100 900",
  variable: "--font-jost",
  display: "swap",
});

const amiri = localFont({
  src: [
    { path: "../../public/fonts/amiri-arabic-400.woff2", weight: "400" },
    { path: "../../public/fonts/amiri-arabic-700.woff2", weight: "700" },
  ],
  variable: "--font-amiri",
  display: "swap",
});

const notoArabic = localFont({
  src: "../../public/fonts/noto-sans-arabic.woff2",
  weight: "100 900",
  variable: "--font-noto-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: {
      default: t("title"),
      template: `%s | SBAI Immobilier`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${marcellus.variable} ${jost.variable} ${amiri.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
