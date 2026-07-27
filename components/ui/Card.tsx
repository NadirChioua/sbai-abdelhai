import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Project card — full-bleed image, charcoal gradient for legibility,
 * micro-label location + Marcellus title. Whole card is one link.
 */
export function ProjectCard({
  href,
  image,
  imageAlt,
  title,
  location,
  tagline,
  badge,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "",
  priority = false,
}: {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  location: string;
  tagline?: string;
  badge?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden bg-charcoal ${className}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent"
      />
      {badge && (
        <span className="micro-label absolute top-5 rounded-full border border-white/50 bg-charcoal/40 px-3 py-1.5 text-[9px] text-white backdrop-blur-sm ltr:left-5 rtl:right-5">
          {badge}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="micro-label text-gold">{location}</p>
        <h3 className="heading-display mt-2 text-xl text-white md:text-2xl">
          {title}
        </h3>
        {tagline && (
          <p className="mt-2 text-sm font-light text-white/75">{tagline}</p>
        )}
        <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 group-hover:border-gold group-hover:text-gold rtl:-scale-x-100">
          <ArrowUpRight size={18} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** Plain surface card for stats, FAQ items, form containers. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-sand bg-white shadow-thin ${className}`}>
      {children}
    </div>
  );
}
