import { useTranslations } from "next-intl";
import VideoPlayer from "@/components/ui/VideoPlayer";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { Card } from "@/components/ui/Card";

/**
 * Social proof. The Triple Towers UGC video is a real client-side testimonial
 * asset; the two written slots quote the founder's own filmed words until
 * client testimonials are cleared.
 *
 * TODO(client): Del Costa "client satisfait" photos exist in the archive but
 * usage rights are unconfirmed (PROGRESS.md #4) — swap them in here once
 * cleared, replacing the second written card.
 */
export default function Testimonials() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="bg-ivory-dark">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-32">
        <RevealOnScroll>
          <p className="micro-label text-gold-dark">{t("label")}</p>
          <h2 className="heading-display mt-3 max-w-xl text-2xl text-foreground md:text-3xl">
            {t("title")}
          </h2>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <RevealOnScroll className="mx-auto w-full max-w-sm lg:mx-0">
            <div className="overflow-hidden rounded-lg">
              <VideoPlayer
                mode="feature"
                src="/videos/triple-towers/ugc.mp4"
                poster="/images/posters/tt-ugc.jpg"
                title={t("videoTitle")}
                fullscreenOnMobilePlay
                className="aspect-[9/16] w-full"
              />
            </div>
            <p className="micro-label mt-4 text-secondary">{t("videoCaption")}</p>
          </RevealOnScroll>

          <div className="flex flex-col gap-6 lg:col-span-2">
            {(["quote1", "quote2"] as const).map((k, i) => (
              <RevealOnScroll key={k} delay={0.1 + i * 0.1} className="flex-1">
                <Card className="flex h-full flex-col justify-center p-8 md:p-12">
                  <p className="font-display text-lg leading-relaxed text-foreground md:text-xl">
                    {`« ${t(`${k}.text`)} »`}
                  </p>
                  <footer className="mt-6">
                    <p className="text-sm font-medium">{t(`${k}.author`)}</p>
                    <p className="micro-label mt-1 text-[10px] text-muted">
                      {t(`${k}.context`)}
                    </p>
                  </footer>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
