import Image from "next/image";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export type Milestone = {
  year: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
};

/** Vertical timeline: gold rail + year markers on desktop, stacked on mobile. */
export default function Timeline({
  label,
  title,
  milestones,
}: {
  label: string;
  title: string;
  milestones: Milestone[];
}) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <RevealOnScroll>
          <p className="eyebrow text-gold-dark">{label}</p>
          <h2 className="heading-display mt-3 max-w-2xl text-h2 text-foreground">
            {title}
          </h2>
        </RevealOnScroll>

        <ol className="relative mt-16 border-s border-sand ps-6 md:ps-12">
          {milestones.map((m, i) => (
            <RevealOnScroll as="li" key={m.year} delay={i * 0.06}>
              <div className="relative pb-16">
                <span
                  aria-hidden
                  className="absolute -start-[1.65rem] top-2 h-2.5 w-2.5 rounded-full bg-gold md:-start-[3.4rem]"
                />
                <div className="grid gap-6 md:grid-cols-3 md:gap-10">
                  <div className="md:col-span-2">
                    <p className="heading-display text-h2 text-gold-dark">
                      {m.year}
                    </p>
                    <h3 className="font-display mt-3 text-h3 text-foreground">
                      {m.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-body font-light text-secondary">
                      {m.body}
                    </p>
                  </div>
                  {m.image && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={m.image.src}
                        alt={m.image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}
