import RevealOnScroll from "@/components/motion/RevealOnScroll";
import VideoPlayer from "@/components/ui/VideoPlayer";

export type Reel = { src: string; poster: string; title: string };

/** Three 9:16 clips side by side (stacked on mobile), each marked "Projection 3D du projet". */
export default function VerticalReels({
  label,
  title,
  reels,
  watermark,
}: {
  label: string;
  title: string;
  reels: Reel[];
  watermark: string;
}) {
  return (
    <section className="bg-charcoal">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8">
        <RevealOnScroll>
          <p className="eyebrow text-gold">{label}</p>
          <h2 className="heading-display mt-3 text-h2 text-on-dark">{title}</h2>
        </RevealOnScroll>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((r, i) => (
            <RevealOnScroll key={r.src} delay={i * 0.1}>
              <figure className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden bg-black">
                <VideoPlayer
                  src={r.src}
                  poster={r.poster}
                  mode="ambient"
                  title={r.title}
                  className="absolute inset-0 h-full w-full"
                  videoClassName="h-full w-full object-cover"
                />
                {/* top caption: the bottom-right corner carries the burned-in "Projection 3D du projet" */}
                <figcaption className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-charcoal/85 to-transparent p-4 pb-12">
                  <span className="heading-display text-lg text-on-dark">{r.title}</span>
                  <span className="sr-only"> — {watermark}</span>
                </figcaption>
              </figure>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
