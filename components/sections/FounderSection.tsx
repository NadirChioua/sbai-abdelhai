import { useLocale, useTranslations } from "next-intl";
import VideoPlayer from "@/components/ui/VideoPlayer";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/** Subtle film-grain texture (inline SVG, no asset request). */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

/**
 * "L'homme derrière 53 ans d'histoire" — the client-approved cinematic
 * treatment for the vertical founder interview: charcoal + grain, Marcellus
 * headline and real quote left, portrait video (max 420px, hairline gold
 * frame) right. Mobile: headline above, full-width video, native fullscreen.
 */
export default function FounderSection() {
  const t = useTranslations("founder");
  const locale = useLocale();

  return (
    <section
      className="relative overflow-hidden bg-charcoal text-on-dark"
      style={{ backgroundImage: NOISE }}
    >
      <div className="mx-auto grid max-w-screen-2xl items-center gap-14 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-2 lg:gap-10">
        <RevealOnScroll>
          <p className="micro-label text-gold">{t("sectionTitle")}</p>
          <h2 className="heading-display mt-6 max-w-xl text-3xl leading-tight text-white md:text-4xl">
            {t("headline")}
          </h2>
          <blockquote className="mt-10 border-s-2 border-gold ps-6">
            <p className="font-display max-w-md text-lg leading-relaxed text-on-dark md:text-xl">
              {`« ${t("quote")} »`}
            </p>
            <footer className="mt-6">
              <p className="text-sm font-medium text-white">{t("name")}</p>
              <p className="micro-label mt-1 text-[10px] text-muted">
                {t("role")}
              </p>
            </footer>
          </blockquote>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15} className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px] overflow-hidden rounded-lg border border-gold/80">
            <VideoPlayer
              mode="feature"
              src="/videos/triple-towers/founder-interview.mp4"
              poster="/images/posters/founder.jpg"
              title={t("videoTitle")}
              cornerVignette="top-right"
              fullscreenOnMobilePlay
              className="aspect-[9/16] w-full"
              captions={[
                {
                  src: "/subtitles/founder-fr.vtt",
                  srcLang: "fr",
                  label: "Français",
                  default: locale === "fr",
                },
                {
                  src: "/subtitles/founder-ar.vtt",
                  srcLang: "ar",
                  label: "العربية",
                  default: locale === "ar",
                },
              ]}
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
