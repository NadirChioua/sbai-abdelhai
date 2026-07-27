import { getTranslations } from "next-intl/server";
import type { Project } from "@/lib/projects";
import type { ContactPayload } from "@/lib/contact-schema";
import ProjectHero from "@/components/sections/ProjectHero";
import ProjectPresentation from "@/components/sections/ProjectPresentation";
import AmenitiesGrid from "@/components/sections/AmenitiesGrid";
import Gallery from "@/components/sections/Gallery";
import VideoShowcase from "@/components/sections/VideoShowcase";
import LocationMap from "@/components/sections/LocationMap";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import StickyCTABar from "@/components/ui/StickyCTABar";

/**
 * Shared layout for the three project pages. Section order mirrors the DAMAC
 * benchmark (hero → facts → amenities → gallery → video → map → FAQ → form)
 * with the sticky CTA bar pinned throughout.
 */
export default async function ProjectPage({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: `projects.items.${project.id}` });
  const tp = await getTranslations({ locale, namespace: "projectPage" });
  const ta = await getTranslations({ locale, namespace: "amenities" });

  const facts = project.facts.map((k) => ({
    label: t(`facts.${k}.label`),
    value: t(`facts.${k}.value`),
  }));

  const photos = project.gallery.map((g) => ({
    src: g.src,
    alt: t(`gallery.${g.altKey}`),
  }));

  const videos = project.videos.map((v) => ({
    src: v.src,
    poster: v.poster,
    mode: v.mode,
    title: t(`videos.${v.key}.title`),
    caption: t(`videos.${v.key}.caption`),
  }));

  const faqItems = project.faq.map((k) => ({
    question: t(`faq.${k}.q`),
    answer: t(`faq.${k}.a`),
  }));

  return (
    <main className="flex-1">
      <ProjectHero
        video={project.hero.video}
        poster={project.hero.poster}
        title={t("name")}
        location={t("location")}
        videoTitle={t("heroAlt")}
        scrollLabel={tp("scrollCue")}
        statusLabel={tp(`status.${project.status}`)}
      />

      <ProjectPresentation
        label={tp("presentationLabel")}
        title={t("presentationTitle")}
        paragraphs={[t("description1"), t("description2")]}
        facts={facts}
      />

      <AmenitiesGrid
        label={tp("amenitiesLabel")}
        title={tp("amenitiesTitle")}
        amenities={project.amenities}
        labelFor={(key) => ta(key)}
      />

      <Gallery
        label={tp("galleryLabel")}
        title={tp("galleryTitle")}
        photos={photos}
        openLabel={tp("galleryOpen")}
        closeLabel={tp("galleryClose")}
        prevLabel={tp("galleryPrev")}
        nextLabel={tp("galleryNext")}
      />

      <VideoShowcase
        label={tp("videosLabel")}
        title={tp("videosTitle")}
        videos={videos}
      />

      <LocationMap
        label={tp("locationLabel")}
        title={t("locationTitle")}
        body={t("locationBody")}
        mapImage={project.mapImage}
        mapQuery={project.mapQuery}
        mapAlt={tp("mapTitle", { project: t("name") })}
        address={t("location")}
        externalLabel={tp("openInMaps")}
        attribution={tp("mapAttribution")}
      />

      <FAQ label={tp("faqLabel")} title={tp("faqTitle")} items={faqItems} />

      <ContactSection defaultProject={project.slug as ContactPayload["project"]} />

      <StickyCTABar projectName={t("name")} detail={t("stickyDetail")} />
    </main>
  );
}
