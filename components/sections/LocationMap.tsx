import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Location block with a fully self-hosted map.
 *
 * The Google Maps iframe this replaces pulled 40+ third-party requests —
 * including fonts.googleapis.com — and set Google cookies before the visitor
 * had consented to anything, which contradicts the privacy notice and Moroccan
 * loi 09-08 (CNDP). Here the map is a flat image built at deploy time from
 * OpenStreetMap tiles: zero runtime third-party requests. Opening Google Maps
 * is an explicit, user-initiated click in a new tab.
 */
export default function LocationMap({
  label,
  title,
  body,
  mapImage,
  mapQuery,
  mapAlt,
  address,
  externalLabel,
  attribution,
}: {
  label: string;
  title: string;
  body: string;
  mapImage: string;
  mapQuery: string;
  mapAlt: string;
  address: string;
  externalLabel: string;
  attribution: string;
}) {
  const external = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <section className="bg-ivory-dark">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-center">
          <RevealOnScroll>
            <p className="eyebrow">{label}</p>
            <h2 className="heading-display mt-3 text-h2 text-foreground">
              {title}
            </h2>
            <p className="mt-5 text-body text-secondary">{body}</p>
            <p className="mt-6 flex items-start gap-3 text-body text-foreground">
              <MapPin size={16} aria-hidden className="mt-1 shrink-0 text-gold-dark" />
              {address}
            </p>
            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-6 inline-flex min-h-11 items-center gap-2 text-caption text-gold-dark"
            >
              {externalLabel}
              <ExternalLink size={14} aria-hidden />
            </a>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="lg:col-span-2">
            <figure className="relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-sand">
                <Image
                  src={mapImage}
                  alt={mapAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
                {/* Pin sits at the district centre; exact street address pending */}
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-gold text-gold-on shadow-card"
                >
                  <MapPin size={17} strokeWidth={2} />
                </span>
              </div>
              <figcaption className="mt-2 text-right text-caption font-light text-muted">
                {attribution}
              </figcaption>
            </figure>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
