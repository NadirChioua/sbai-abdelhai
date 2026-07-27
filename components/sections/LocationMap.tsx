import { MapPin } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/**
 * Google Maps embed, desaturated with a CSS filter to match the brand's
 * quiet palette (the keyless embed API accepts no custom map style, and a
 * Cloud-styled map would require a billed API key — see PROGRESS.md).
 */
export default function LocationMap({
  label,
  title,
  body,
  query,
  mapTitle,
  address,
}: {
  label: string;
  title: string;
  body: string;
  query: string;
  mapTitle: string;
  address: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=fr`;

  return (
    <section className="bg-ivory-dark">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-center">
          <RevealOnScroll>
            <p className="micro-label text-gold-dark">{label}</p>
            <h2 className="heading-display mt-3 text-2xl text-foreground md:text-3xl">
              {title}
            </h2>
            <p className="mt-5 text-sm font-light leading-relaxed text-secondary">
              {body}
            </p>
            <p className="mt-6 flex items-start gap-3 text-sm text-foreground">
              <MapPin size={16} aria-hidden className="mt-0.5 text-gold-dark" />
              {address}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="lg:col-span-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-sand">
              <iframe
                src={src}
                title={mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full grayscale-[0.75] sepia-[0.12] contrast-[0.95]"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
