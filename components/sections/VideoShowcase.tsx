import VideoPlayer from "@/components/ui/VideoPlayer";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export type ShowcaseVideo = {
  src: string;
  poster: string;
  mode: "ambient" | "feature";
  title: string;
  caption: string;
};

/**
 * Documentary block for a project's secondary footage. One featured video
 * (large) plus the remainder in a row — every clip in the manifest is shown,
 * so no asset stays unused.
 */
export default function VideoShowcase({
  label,
  title,
  videos,
  className = "bg-charcoal text-on-dark",
}: {
  label: string;
  title: string;
  videos: ShowcaseVideo[];
  className?: string;
}) {
  if (videos.length === 0) return null;
  const [lead, ...rest] = videos;

  return (
    <section className={className}>
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <RevealOnScroll>
          <p className="eyebrow text-gold">{label}</p>
          <h2 className="heading-display mt-3 max-w-xl text-h2 text-on-dark">
            {title}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-lg">
            <VideoPlayer
              mode={lead.mode}
              src={lead.src}
              poster={lead.poster}
              title={lead.title}
              showMuteToggle
              className="aspect-video w-full"
            />
          </div>
          <p className="eyebrow mt-4 text-on-dark-muted">{lead.caption}</p>
        </RevealOnScroll>

        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {rest.map((v, i) => (
              <RevealOnScroll key={v.src} delay={0.1 + i * 0.1}>
                <div className="overflow-hidden rounded-lg">
                  <VideoPlayer
                    mode={v.mode}
                    src={v.src}
                    poster={v.poster}
                    title={v.title}
                    showMuteToggle
                    fullscreenOnMobilePlay
                    className="aspect-video w-full"
                  />
                </div>
                <p className="eyebrow mt-4 text-on-dark-muted">{v.caption}</p>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
