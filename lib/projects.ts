/**
 * Project registry — slugs, media paths and i18n keys.
 * All localized copy lives in messages/{fr,ar}.json under `projects.items.*`.
 */
export type ProjectId = "tripleTowers" | "villasColline" | "delCosta";

export type Project = {
  id: ProjectId;
  slug: string;
  heroVideo: string;
  heroPoster: string;
};

export const projects: Project[] = [
  {
    id: "tripleTowers",
    slug: "triple-towers",
    heroVideo: "/videos/triple-towers/hero-drone.mp4",
    heroPoster: "/images/posters/tt-hero.jpg",
  },
  {
    id: "villasColline",
    slug: "les-villas-de-la-colline",
    heroVideo: "/videos/villas-colline/hero-drone.mp4",
    heroPoster: "/images/posters/vc-hero.jpg",
  },
  {
    id: "delCosta",
    slug: "del-costa",
    heroVideo: "/videos/del-costa/hero-exterior.mp4",
    heroPoster: "/images/posters/dc-hero.jpg",
  },
];

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
