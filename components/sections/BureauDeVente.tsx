import Image from "next/image";
import { useTranslations } from "next-intl";
import { Clock, ExternalLink, Languages, MapPin, Phone } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, whatsappLink } from "@/lib/config";

/**
 * "Venez nous rencontrer" — the sales office as a place, not a form.
 *
 * Map handling follows the CNDP pattern established in LocationMap.tsx: a
 * self-hosted static image, zero third-party requests at runtime, and a Google
 * Maps link that only fires on an explicit click in a new tab. Do not swap this
 * for an embedded iframe (see HANDOFF-ANALYSIS §12).
 *
 * TODO(client-meeting-today): address, coordinates, hours, languages and the
 * orientation sentences are placeholders — see lib/config.ts `office`.
 */
export default function BureauDeVente() {
  const t = useTranslations("bureau");
  const tc = useTranslations("common");

  // Coordinates rather than a text query: the pin lands exactly where the
  // office is, and the visitor consents to the Google load by clicking.
  const external = `https://www.google.com/maps/search/?api=1&query=${site.office.lat},${site.office.lng}`;

  return (
    <section id="bureau-de-vente" className="bg-ivory">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <RevealOnScroll>
          <p className="eyebrow text-gold-dark">{t("label")}</p>
          <h2 className="heading-display mt-3 max-w-2xl text-h2 text-foreground">
            {t("title")}
          </h2>
        </RevealOnScroll>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — the practical detail, in reading order of a visit */}
          <RevealOnScroll>
            <h3 className="heading-display text-h3 text-foreground">
              {t("addressTitle")}
            </h3>
            <p className="mt-3 flex items-start gap-3 text-body-lg font-light text-secondary">
              <MapPin size={18} aria-hidden className="mt-1 shrink-0 text-gold-dark" />
              {site.office.address}
            </p>

            <dl className="mt-8 space-y-6 border-t border-sand pt-8">
              <div>
                <dt className="eyebrow text-gold-dark">{t("hoursLabel")}</dt>
                <dd className="mt-3 space-y-1 text-body font-light text-foreground">
                  <p className="flex items-start gap-3">
                    <Clock size={16} aria-hidden className="mt-1 shrink-0 text-muted" />
                    {t("hoursWeekdays")}
                  </p>
                  <p className="ps-7">{t("hoursSaturday")}</p>
                  <p className="ps-7 text-caption text-muted">{t("hoursSunday")}</p>
                </dd>
              </div>

              <div>
                <dt className="eyebrow text-gold-dark">{t("languagesLabel")}</dt>
                <dd className="mt-3 flex items-start gap-3 text-body font-light text-foreground">
                  <Languages size={16} aria-hidden className="mt-1 shrink-0 text-muted" />
                  {t("languages")}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonAnchor href={`tel:${site.phone}`} size="md">
                <Phone size={16} aria-hidden />
                <span dir="ltr">{site.phoneDisplay}</span>
              </ButtonAnchor>
              <ButtonAnchor
                href={whatsappLink(t("whatsappMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
                aria-label={tc("whatsappAria")}
              >
                <WhatsAppIcon size={16} />
                {tc("cta.whatsapp")}
              </ButtonAnchor>
            </div>

            <div className="mt-10 border-s-2 border-gold ps-5">
              <h3 className="heading-display text-h3 text-foreground">
                {t("directionsTitle")}
              </h3>
              <p className="mt-3 max-w-md text-body font-light text-secondary">
                {t("directions")}
              </p>
            </div>
          </RevealOnScroll>

          {/* Right — where it is, then what it looks like */}
          <RevealOnScroll delay={0.12}>
            <figure>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-sand">
                <Image
                  src={site.office.mapImage}
                  alt={t("mapAlt")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-gold text-gold-on shadow-card"
                >
                  <MapPin size={17} strokeWidth={2} />
                </span>
              </div>
              <figcaption className="mt-2 text-end text-caption font-light text-muted">
                {t("mapAttribution")}
              </figcaption>
            </figure>

            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-4 inline-flex min-h-11 items-center gap-2 text-caption text-gold-dark"
            >
              {t("openInMaps")}
              <ExternalLink size={14} aria-hidden />
            </a>

            <figure className="mt-8">
              <VideoPlayer
                mode="ambient"
                src={site.office.video}
                poster={site.office.videoPoster}
                title={t("videoAlt")}
                showMuteToggle={false}
                className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-sand"
              />
              <figcaption className="mt-3 text-caption font-light text-muted">
                {t("videoCaption")}
              </figcaption>
            </figure>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
