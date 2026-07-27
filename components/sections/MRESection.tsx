import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Espace MRE preview — the diaspora audience is SBAI's biggest untapped
 * market (strategy §3): distance buying, Daam Sakane, European-hours support.
 */
export default function MRESection() {
  const t = useTranslations("home.mre");
  const tc = useTranslations("common");

  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-screen-2xl items-center gap-12 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-2">
        <RevealOnScroll className="relative order-last aspect-[4/3] overflow-hidden lg:order-first">
          <Image
            src="/images/heritage/pool-palms.jpg"
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p className="micro-label text-gold-dark">{t("label")}</p>
          <h2 className="heading-display mt-3 max-w-xl text-2xl text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-secondary md:text-base">
            {t("body")}
          </p>
          <ul className="mt-8 space-y-4">
            {(["remote", "daam", "hours"] as const).map((k) => (
              <li key={k} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <Check size={13} aria-hidden />
                </span>
                <span className="text-sm font-light leading-relaxed text-foreground">
                  {t(`points.${k}`)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/espace-mre">{tc("cta.learnMore")}</ButtonLink>
            <ButtonAnchor
              href={whatsappLink(t("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              <WhatsAppIcon size={15} />
              {tc("cta.whatsapp")}
            </ButtonAnchor>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
