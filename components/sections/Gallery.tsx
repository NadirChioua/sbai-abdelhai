"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export type GalleryPhoto = { src: string; alt: string };

/** Masonry-ish gallery with an accessible lightbox (arrows + Escape). */
export default function Gallery({
  label,
  title,
  photos,
  closeLabel,
  prevLabel,
  nextLabel,
  openLabel,
}: {
  label: string;
  title: string;
  photos: GalleryPhoto[];
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  openLabel: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, go]);

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <RevealOnScroll>
          <p className="eyebrow text-gold-dark">{label}</p>
          <h2 className="heading-display mt-3 max-w-xl text-h2 text-foreground">
            {title}
          </h2>
        </RevealOnScroll>

        {/* CSS columns give true masonry: mixed aspect ratios flow without
            leaving holes, which a uniform grid cannot avoid. */}
        <div className="mt-12 columns-2 gap-3 md:columns-3 md:gap-4">
          {photos.map((p, i) => (
            <RevealOnScroll
              key={p.src}
              delay={(i % 3) * 0.08}
              className="mb-3 break-inside-avoid md:mb-4"
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${openLabel} — ${p.alt}`}
                className={`group relative block w-full overflow-hidden ${
                  i % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-gold"
                />
              </button>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: prefersReduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/95 p-4"
          >
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              autoFocus
              className="absolute top-5 z-10 p-2 text-on-dark transition-colors hover:text-gold ltr:right-5 rtl:left-5"
            >
              <X size={28} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={prevLabel}
              className="absolute z-10 p-3 text-on-dark transition-colors hover:text-gold ltr:left-3 rtl:right-3 md:ltr:left-8 md:rtl:right-8"
            >
              <ChevronLeft size={34} aria-hidden className="rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={nextLabel}
              className="absolute z-10 p-3 text-on-dark transition-colors hover:text-gold ltr:right-3 rtl:left-3 md:ltr:right-8 md:rtl:left-8"
            >
              <ChevronRight size={34} aria-hidden className="rtl:-scale-x-100" />
            </button>

            <figure className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center">
              <div className="relative h-[72vh] w-full">
                <Image
                  src={photos[index].src}
                  alt={photos[index].alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-5 max-w-2xl text-center text-caption font-light text-on-dark-muted">
                {photos[index].alt}
                <span className="eyebrow ms-3 text-muted">
                  {index + 1}/{photos.length}
                </span>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
