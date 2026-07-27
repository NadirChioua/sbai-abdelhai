import { useTranslations } from "next-intl";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function ProjectsGrid() {
  const t = useTranslations();

  return (
    <section className="bg-ivory-dark">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-32">
        <RevealOnScroll className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="micro-label text-gold-dark">
              {t("home.projects.label")}
            </p>
            <h2 className="heading-display mt-3 max-w-xl text-2xl text-foreground md:text-3xl">
              {t("home.projects.title")}
            </h2>
          </div>
          <ButtonLink href="/projets" variant="outline">
            {t("common.cta.viewAllProjects")}
          </ButtonLink>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {projects.map((p, i) => (
            <RevealOnScroll key={p.slug} delay={i * 0.12}>
              <ProjectCard
                href={`/projets/${p.slug}`}
                image={p.hero.poster}
                imageAlt={t(`projects.items.${p.id}.heroAlt`)}
                video={p.hero.video}
                title={t(`projects.items.${p.id}.name`)}
                location={t(`projects.items.${p.id}.location`)}
                tagline={t(`projects.items.${p.id}.tagline`)}
                className="aspect-[4/5]"
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
