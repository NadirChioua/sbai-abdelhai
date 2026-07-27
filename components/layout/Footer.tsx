import Image from "next/image";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site, whatsappLink } from "@/lib/config";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/ui/icons";
import LocaleSwitcher from "./LocaleSwitcher";

const PROJECT_LINKS = [
  { label: "Triple Towers", href: "/projets/triple-towers" },
  { label: "Les Villas de la Colline", href: "/projets/les-villas-de-la-colline" },
  { label: "Résidence Del Costa", href: "/projets/del-costa" },
] as const;

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-on-dark">
      {/* Newsletter */}
      <div className="border-b border-on-dark/10">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center md:px-8">
          <div>
            <h2 className="heading-display text-xl text-white">
              {t("footer.newsletterTitle")}
            </h2>
            <p className="mt-2 text-sm font-light text-on-dark/70">
              {t("footer.newsletterHint")}
            </p>
          </div>
          {/* TODO(phase-8): wire submission to /api/newsletter */}
          <form className="flex w-full max-w-md gap-3" action="#" method="post">
            <label htmlFor="newsletter-email" className="sr-only">
              {t("footer.newsletterLabel")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("footer.newsletterPlaceholder")}
              className="h-12 w-full border border-on-dark/20 bg-transparent px-4 text-sm font-light text-white placeholder:text-on-dark/50 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="micro-label h-12 shrink-0 bg-gold px-6 text-gold-on transition-colors hover:bg-gold-dark hover:text-ivory"
            >
              {t("footer.newsletterSubmit")}
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image
            src="/logo/sbai-mono-ivory.png"
            alt={t("common.brandFull")}
            width={180}
            height={45}
            className="h-auto w-44"
          />
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-on-dark/70">
            {t("footer.blurb")}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-gold"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-gold"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="transition-colors hover:text-gold"
            >
              <TikTokIcon size={18} />
            </a>
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="transition-colors hover:text-gold"
            >
              <YouTubeIcon size={18} />
            </a>
          </div>
        </div>

        <nav aria-label={t("footer.projects")}>
          <h3 className="micro-label text-gold">{t("footer.projects")}</h3>
          <ul className="mt-5 space-y-3 text-sm font-light">
            {PROJECT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/projets"
                className="transition-colors hover:text-gold"
              >
                {t("common.cta.viewAllProjects")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("footer.company")}>
          <h3 className="micro-label text-gold">{t("footer.company")}</h3>
          <ul className="mt-5 space-y-3 text-sm font-light">
            <li>
              <Link
                href="/notre-histoire"
                className="transition-colors hover:text-gold"
              >
                {t("nav.history")}
              </Link>
            </li>
            <li>
              <Link
                href="/espace-mre"
                className="transition-colors hover:text-gold"
              >
                {t("nav.mre")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-gold"
              >
                {t("nav.contact")}
              </Link>
            </li>
            <li>
              <Link
                href="/mentions-legales"
                className="transition-colors hover:text-gold"
              >
                {t("footer.legal")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="micro-label text-gold">{t("footer.contact")}</h3>
          <ul className="mt-5 space-y-3 text-sm font-light">
            <li>
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Phone size={14} aria-hidden />
                <span dir="ltr">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Mail size={14} aria-hidden />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(t("common.whatsappMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <WhatsAppIcon size={14} />
                {t("common.cta.whatsapp")}
              </a>
            </li>
            <li className="flex items-center gap-3 text-on-dark/70">
              <MapPin size={14} aria-hidden />
              {t("footer.address")}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-on-dark/10">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-4 py-6 text-[11px] font-light text-on-dark/60 md:flex-row md:px-8">
          <p>
            © {year} {t("common.brandFull")} — {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-gold"
            >
              {t("footer.legal")}
            </Link>
            <Link
              href="/mentions-legales#confidentialite"
              className="transition-colors hover:text-gold"
            >
              {t("footer.privacy")}
            </Link>
            <LocaleSwitcher className="text-[10px] text-on-dark/60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
