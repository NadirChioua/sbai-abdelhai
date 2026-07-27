"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { projects, type ProjectStatus } from "@/lib/projects";
import { ProjectCard } from "@/components/ui/Card";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

type Filter = "all" | ProjectStatus;
const FILTERS: Filter[] = ["all", "ongoing", "delivered"];

export default function ProjectsIndex() {
  const t = useTranslations();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = projects.filter(
    (p) => filter === "all" || p.status === filter,
  );

  return (
    <>
      <section className="bg-ivory">
        <div className="mx-auto max-w-screen-2xl px-4 pb-6 pt-14 md:px-8 md:pt-20">
          <p className="micro-label text-gold-dark">
            {t("projectsIndex.label")}
          </p>
          <h1 className="heading-display mt-3 max-w-2xl text-3xl text-foreground md:text-4xl">
            {t("projectsIndex.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-secondary md:text-base">
            {t("projectsIndex.intro")}
          </p>

          <div
            role="group"
            aria-label={t("projectsIndex.filterLabel")}
            className="mt-10 flex flex-wrap gap-3"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`micro-label h-10 rounded-full border px-5 transition-colors duration-300 ${
                    active
                      ? "border-gold bg-gold text-gold-on"
                      : "border-sand text-secondary hover:border-gold hover:text-gold-dark"
                  }`}
                >
                  {t(`projectsIndex.filters.${f}`)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-screen-2xl px-4 pb-24 md:px-8 md:pb-32">
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {visible.map((p, i) => (
              <RevealOnScroll key={p.slug} delay={i * 0.1}>
                <ProjectCard
                  href={`/projets/${p.slug}`}
                  image={p.hero.poster}
                  imageAlt={t(`projects.items.${p.id}.heroAlt`)}
                  video={p.cardPreview}
                  title={t(`projects.items.${p.id}.name`)}
                  location={t(`projects.items.${p.id}.location`)}
                  tagline={t(`projects.items.${p.id}.tagline`)}
                  badge={t(`projectPage.status.${p.status}`)}
                  className="aspect-[4/5]"
                  priority={i === 0}
                />
              </RevealOnScroll>
            ))}
          </div>
          <p aria-live="polite" className="sr-only">
            {t("projectsIndex.count", { count: visible.length })}
          </p>
        </div>
      </section>
    </>
  );
}
