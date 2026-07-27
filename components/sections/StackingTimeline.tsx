"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export type Chapter = {
  year: string;
  numeral: string;
  /** Pre-rendered "Chapitre I" label — server components cannot pass functions. */
  label: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
};

/** Subtle paper grain — inline so it costs no request. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")";

/**
 * One chapter of the heritage story.
 *
 * Each card is sticky at the top of the viewport, so the next card slides up
 * and covers it — the deck effect. As a card is covered it scales down and
 * dims, which is what reads as "receding into the past".
 */
function ChapterCard({
  chapter,
  index,
  total,
}: {
  chapter: Chapter;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const prefersReduced = useReducedMotion();

  // 0 while the card owns the screen → 1 once fully covered by the next one.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.55, 0.35]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -28]);

  const isLast = index === total - 1;

  return (
    <li
      ref={ref}
      className="sticky top-0 list-none"
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        style={
          prefersReduced || isLast ? undefined : { scale, opacity, y }
        }
        className={`relative flex min-h-[88svh] items-center overflow-hidden bg-ivory md:min-h-svh ${
          index === 0
            ? ""
            : "rounded-t-2xl border-t border-gold/25 shadow-[0_-28px_60px_-28px_rgba(34,39,31,0.45)]"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: NOISE }}
        />
        <div className="relative mx-auto grid w-full max-w-screen-2xl gap-8 px-4 py-16 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Year — the emotional anchor, sized to dominate */}
          <div className="lg:col-span-5">
            <p
              aria-hidden
              className="heading-display bg-gradient-to-b from-gold to-gold-dark bg-clip-text text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.82] tracking-[0.01em] text-transparent"
            >
              {chapter.year}
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow flex items-center gap-3">
              <span className="font-display not-italic">{chapter.numeral}</span>
              <span aria-hidden className="h-px w-8 bg-gold/60" />
              {chapter.label}
            </p>
            <h3 className="heading-display mt-4 text-h2 text-foreground">
              {chapter.title}
            </h3>
            <p className="mt-5 max-w-xl text-body font-light text-secondary">
              {chapter.body}
            </p>

            {chapter.image && (
              <div className="relative mt-8 aspect-[16/10] w-full max-w-xl overflow-hidden rounded-lg">
                <Image
                  src={chapter.image.src}
                  alt={chapter.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chapter divider, bottom-end corner */}
        <div
          aria-hidden
          className="absolute bottom-8 hidden items-center gap-3 text-gold/70 ltr:right-8 rtl:left-8 md:flex"
        >
          <span className="h-px w-14 bg-current" />
          <span className="font-display text-caption">{chapter.numeral}</span>
        </div>
      </motion.article>
    </li>
  );
}

export default function StackingTimeline({
  chapters,
  progressLabel,
}: {
  chapters: Chapter[];
  progressLabel: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActive(Math.min(chapters.length - 1, Math.floor(v * chapters.length)));
    });
  }, [scrollYProgress, chapters.length]);

  return (
    <div className="relative">
      {/* Progress rail — desktop only, decorative but announced for context */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 ltr:right-6 rtl:left-6 lg:flex"
      >
        <span className="font-display text-caption text-gold-dark">
          {chapters[active]?.numeral}
        </span>
        <span className="relative h-40 w-px bg-charcoal/15">
          <motion.span
            style={{ scaleY: prefersReduced ? 1 : fill }}
            className="absolute inset-0 origin-top bg-gold"
          />
        </span>
        <span className="sr-only">{progressLabel}</span>
      </div>

      <ol ref={listRef} className="relative">
        {chapters.map((c, i) => (
          <ChapterCard
            key={c.year}
            chapter={c}
            index={i}
            total={chapters.length}
          />
        ))}
      </ol>
    </div>
  );
}
