import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";

/**
 * Full-viewport drone-video hero. Ambient autoplay (muted, loops, pauses
 * off-screen); text sits in the lower third per the brand board video spec.
 */
export default function Hero() {
  const t = useTranslations();

  return (
    <section className="relative flex min-h-svh items-end">
      <div className="absolute inset-0">
        <VideoPlayer
          mode="ambient"
          src="/videos/triple-towers/hero-drone.mp4"
          poster="/images/posters/tt-hero.jpg"
          title={t("home.heroAlt")}
          showMuteToggle={false}
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--overlay-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/70 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 pb-20 text-center md:px-8 md:pb-24">
        <p className="micro-label text-shadow-hero text-gold">
          {t("common.since")}
        </p>
        <h1 className="heading-display text-shadow-hero mx-auto mt-5 max-w-4xl text-3xl text-white md:text-5xl">
          {t("home.heroTitle")}
        </h1>
        <p className="text-shadow-hero mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-white/85 md:text-base">
          {t("home.heroSubtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/projets" size="lg">
            {t("common.cta.viewAllProjects")}
          </ButtonLink>
          <ButtonAnchor href="#contact" variant="outline-light" size="lg">
            {t("common.cta.enquire")}
          </ButtonAnchor>
        </div>
        <a
          href="#heritage"
          aria-label={t("home.scrollCue")}
          className="mt-12 inline-flex animate-bounce text-white/70 transition-colors hover:text-gold motion-reduce:animate-none"
        >
          <ChevronDown size={26} aria-hidden />
        </a>
      </div>
    </section>
  );
}
