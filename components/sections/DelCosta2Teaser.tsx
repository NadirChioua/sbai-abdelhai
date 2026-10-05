import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { DC2_STILLS } from "@/lib/dc2-media";

/** Home-page band announcing Del Costa 2 (projection 3D of the project). */
export default function DelCosta2Teaser() {
  const t = useTranslations("delCosta2");
  return (
    <section className="relative isolate overflow-hidden bg-charcoal">
      <Image
        src={`${DC2_STILLS}/DC2_R01_Aerien_45.jpg`}
        alt={t("heroAlt")}
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-80"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/70 to-transparent" />
      <div className="mx-auto max-w-screen-2xl px-4 py-28 md:px-8 md:py-36">
        <RevealOnScroll className="max-w-xl">
          <p className="eyebrow text-gold">{t("teaserLabel")}</p>
          <h2 className="heading-display mt-3 text-display text-on-dark">{t("teaserTitle")}</h2>
          <p className="mt-5 text-body font-light text-on-dark-muted">{t("teaserBody")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/projets/del-costa-2" size="lg">
              {t("teaserCta")}
            </ButtonLink>
            <span className="border border-gold/60 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-gold">
              {t("watermark")}
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
