import Image from "next/image";
import { useTranslations } from "next-intl";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const ARCHIVE_PHOTOS = [
  // TODO(client): watermarked archive photos — clean versions requested (PROGRESS.md #6)
  { src: "/images/heritage/towers-fountain.jpg", altKey: "photo1Alt" },
  { src: "/images/heritage/corniche.jpg", altKey: "photo2Alt" },
  { src: "/images/heritage/villas-bay.jpg", altKey: "photo3Alt" },
] as const;

/**
 * Giant "1973" + signature line + heritage stats over ivory,
 * with a strip of archive photos from five decades of building Tanger.
 */
export default function HeritageStrip() {
  const t = useTranslations("home.heritage");

  return (
    <section id="heritage" className="overflow-hidden bg-ivory">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-32">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <RevealOnScroll>
            <p
              aria-hidden
              className="heading-display select-none text-[26vw] leading-[0.85] tracking-tight text-charcoal/[0.07] lg:text-[17rem]"
            >
              1973
            </p>
            <h2 className="heading-display -mt-6 max-w-xl text-h2 text-foreground lg:-mt-10">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-lg text-body font-light text-secondary">
              {t("body")}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <dl className="grid grid-cols-3 gap-4 border-s-2 border-gold ps-5 md:gap-6 md:ps-8">
              {(["years", "buildings", "generations"] as const).map((k) => (
                <div key={k}>
                  <dd className="heading-display text-h2 text-gold-dark">
                    {t(`stats.${k}.value`)}
                  </dd>
                  {/* Micro-label tracking is generous by design; it must relax
                      on narrow screens or the labels overflow their column. */}
                  <dt className="eyebrow mt-2 tracking-[0.12em] text-secondary md:tracking-[0.32em]">
                    {t(`stats.${k}.label`)}
                  </dt>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 md:gap-6">
          {ARCHIVE_PHOTOS.map(({ src, altKey }, i) => (
            <RevealOnScroll key={src} delay={i * 0.1}>
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[4/3]">
                <Image
                  src={src}
                  alt={t(altKey)}
                  fill
                  sizes="(max-width: 768px) 33vw, 30vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
