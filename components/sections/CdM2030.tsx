import { useTranslations } from "next-intl";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { ButtonAnchor } from "@/components/ui/Button";

/**
 * "Tanger 2030" — World Cup host city as an investment accelerator.
 * All figures from the client strategy document (SBAI_Strategie_Digitale_2026).
 */
export default function CdM2030() {
  const t = useTranslations("home.cdm");

  return (
    <section className="bg-teal text-teal-on">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-32">
        <RevealOnScroll className="max-w-2xl">
          <p className="micro-label text-gold">{t("label")}</p>
          <h2 className="heading-display mt-3 text-2xl text-white md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-sm font-light leading-relaxed text-teal-on/85 md:text-base">
            {t("body")}
          </p>
        </RevealOnScroll>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {(["stadium", "investment", "hotels", "tgv"] as const).map((k, i) => (
            <RevealOnScroll key={k} delay={i * 0.1} as="div">
              <dd className="heading-display text-3xl text-gold md:text-4xl">
                {t(`stats.${k}.value`)}
              </dd>
              <dt className="micro-label mt-3 max-w-[22ch] text-[10px] leading-relaxed text-teal-on/80">
                {t(`stats.${k}.label`)}
              </dt>
            </RevealOnScroll>
          ))}
        </dl>

        <RevealOnScroll delay={0.2} className="mt-14">
          <ButtonAnchor href="#contact" variant="outline-light">
            {t("cta")}
          </ButtonAnchor>
        </RevealOnScroll>
      </div>
    </section>
  );
}
