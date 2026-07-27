"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";

/**
 * Project card — full-bleed poster, charcoal gradient for legibility,
 * eyebrow location + Marcellus title. Whole card is one link.
 *
 * When `video` is supplied the clip autoplays, muted and looping, as soon as the
 * card scrolls into view — desktop and mobile alike — and pauses when it leaves.
 *
 * Weight is the whole design constraint here: `video` must be a small dedicated
 * loop (~150-200 KB), never a full hero file. `preload="none"` means nothing is
 * fetched until the card is actually approached. Playback is skipped entirely
 * under prefers-reduced-motion or when the browser signals Save-Data.
 */
export function ProjectCard({
  href,
  image,
  imageAlt,
  title,
  location,
  tagline,
  badge,
  video,
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
  video?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Decide once on the client whether this card may animate at all.
  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    setAllowed(Boolean(video) && !prefersReduced && !conn?.saveData);
  }, [video, prefersReduced]);

  // Autoplay while visible, pause when scrolled away.
  useEffect(() => {
    if (!allowed) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          v.muted = true;
          v.play()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { rootMargin: "200px", threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed]);

  const enabled = allowed;

  return (
    <Link
      ref={wrapRef}
      href={href}
      className={`group relative block overflow-hidden bg-charcoal ${className}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {enabled && (
        <video
          ref={videoRef}
          src={video}
          poster={image}
          muted
          loop
          autoPlay
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent"
      />
      {badge && (
        <span className="eyebrow absolute top-5 rounded-full border border-white/50 bg-charcoal/40 px-3 py-1.5 text-white backdrop-blur-sm ltr:left-5 rtl:right-5">
          {badge}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="eyebrow text-gold">{location}</p>
        <h3 className="heading-display mt-2 text-h3 text-on-dark">
          {title}
        </h3>
        {tagline && (
          <p className="mt-2 text-caption font-light text-on-dark-muted">{tagline}</p>
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
