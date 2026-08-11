import RevealOnScroll from "@/components/motion/RevealOnScroll";
import VideoPlayer from "@/components/ui/VideoPlayer";

/**
 * Full-width drone sequence of the district around a project, placed directly
 * above <LocationMap /> — the visitor sees the neighbourhood before reading an
 * address. Ambient mode: muted, looping, pauses off-screen, and falls back to
 * poster + play button under prefers-reduced-motion (handled by VideoPlayer).
 *
 * The eyebrow sets `text-gold` explicitly: the shared `.eyebrow` class defaults
 * to gold-dark, which fails WCAG AA on charcoal (HANDOFF-ANALYSIS §9 BUG 2).
 */
export default function NeighbourhoodVideo({
  label,
  title,
  caption,
  video,
  poster,
  videoTitle,
}: {
  label: string;
  title: string;
  caption: string;
  video: string;
  poster: string;
  videoTitle: string;
}) {
  return (
    <section className="bg-charcoal">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <RevealOnScroll>
          <p className="eyebrow text-gold">{label}</p>
          <h2 className="heading-display mt-3 max-w-2xl text-h2 text-on-dark">
            {title}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <figure className="mt-10">
            <VideoPlayer
              mode="ambient"
              src={video}
              poster={poster}
              title={videoTitle}
              showMuteToggle={false}
              className="aspect-[16/9] w-full overflow-hidden rounded-lg"
            />
            <figcaption className="mx-auto mt-5 max-w-2xl text-body font-light text-on-dark-muted">
              {caption}
            </figcaption>
          </figure>
        </RevealOnScroll>
      </div>
    </section>
  );
}
