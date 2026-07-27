"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";

/**
 * Project card — full-bleed poster, charcoal gradient for legibility,
 * micro-label location + Marcellus title. Whole card is one link.
 *
 * When `video` is supplied, the clip plays muted on hover (and on keyboard
 * focus) over the poster. It is only fetched at that moment (`preload="none"`),
 * so the grid still costs three JPEGs on load. Touch devices and
 * prefers-reduced-motion keep the still image — autoplaying three heroes on a
 * phone would be both jarring and expensive on Moroccan mobile data.
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
  const [canHover, setCanHover] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const enabled = Boolean(video) && canHover && !prefersReduced;

  const start = useCallback(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [enabled]);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  }, []);

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden bg-charcoal ${className}`}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
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
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

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
