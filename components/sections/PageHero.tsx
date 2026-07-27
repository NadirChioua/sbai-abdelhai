import Image from "next/image";

/**
 * Compact hero for internal pages: image + charcoal scrim, Marcellus title.
 * Sits below the fixed header (the layout spacer handles the offset).
 */
export default function PageHero({
  image,
  imageAlt,
  label,
  title,
  intro,
  children,
}: {
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[52svh] items-end bg-charcoal">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30"
      />
      <div className="relative mx-auto w-full max-w-screen-2xl px-4 py-16 md:px-8 md:py-20">
        <p className="eyebrow text-gold">{label}</p>
        <h1 className="heading-display mt-4 max-w-3xl text-display text-on-dark">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-body font-light text-on-dark-muted">
            {intro}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
