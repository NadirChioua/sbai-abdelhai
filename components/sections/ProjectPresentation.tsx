import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function ProjectPresentation({
  label,
  title,
  paragraphs,
  facts,
}: {
  label: string;
  title: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
}) {
  return (
    <section id="presentation" className="bg-ivory">
      <div className="mx-auto grid max-w-screen-2xl gap-12 px-4 py-24 md:px-8 md:py-28 lg:grid-cols-5">
        <RevealOnScroll className="lg:col-span-3">
          <p className="eyebrow text-gold-dark">{label}</p>
          <h2 className="heading-display mt-3 max-w-xl text-h2 text-foreground">
            {title}
          </h2>
          <div className="mt-6 space-y-5">
            {paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="max-w-2xl text-body font-light text-secondary"
              >
                {p}
              </p>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="lg:col-span-2">
          <dl className="divide-y divide-sand border-y border-sand">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-6 py-5"
              >
                <dt className="eyebrow text-secondary">{f.label}</dt>
                <dd className="font-display text-end text-body-lg text-foreground">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </div>
    </section>
  );
}
