/**
 * Project registry — slugs, media manifests and amenity keys.
 * All localized copy lives in messages/{fr,ar}.json under `projects.items.*`.
 * Every video listed here is rendered by a <VideoPlayer /> on the project page.
 */
export type ProjectId = "tripleTowers" | "villasColline" | "delCosta";

export type ProjectStatus = "ongoing" | "delivered";

export type GalleryItem = { src: string; altKey: string };

export type ProjectVideo = {
  src: string;
  poster: string;
  /** i18n key under projects.items.<id>.videos */
  key: string;
  mode: "ambient" | "feature";
};

export type Project = {
  id: ProjectId;
  slug: string;
  status: ProjectStatus;
  hero: { video: string; poster: string };
  /** 6s silent loop (~150-200 KB) that autoplays inside the project cards. */
  cardPreview: string;
  /**
   * Still for the card, cut from ~30% into `cardPreview` itself. Without it the
   * card falls back to the hero poster, which is a different moment and makes
   * the card visibly jump when the loop starts.
   */
  cardPoster?: string;
  /**
   * Drone sequence of the surrounding district, rendered full-width just above
   * the map so the visitor sees the neighbourhood before reading coordinates.
   * Optional — only projects with location footage get the section.
   */
  neighbourhood?: { video: string; poster: string };
  /**
   * Short amenity proof shot shown beside the icon grid — an icon says
   * "ascenseurs", this shows them. Optional.
   */
  amenityVideo?: { video: string; poster: string };
  /** Secondary videos shown in the "découvrir" / amenities blocks */
  videos: ProjectVideo[];
  gallery: GalleryItem[];
  amenities: string[];
  facts: string[];
  faq: string[];
  /** Self-hosted static map image (built from OSM tiles at deploy time) */
  mapImage: string;
  /** Free-text query used only for the explicit "open in Google Maps" link */
  mapQuery: string;
};

export const projects: Project[] = [
  {
    id: "tripleTowers",
    slug: "triple-towers",
    status: "ongoing",
    // Graded CapCut cinematic (2026-08) replaces the raw drone rush; the old
    // hero-drone.mp4 stays on disk as a backup but is no longer referenced.
    hero: {
      video: "/videos/triple-towers/triple-towers-cinematic.mp4",
      poster: "/images/posters/tt-cinematic.jpg",
    },
    cardPreview: "/videos/triple-towers/card-preview.mp4",
    cardPoster: "/images/posters/tt-card.jpg",
    neighbourhood: {
      video: "/videos/triple-towers/triple-towers-location.mp4",
      poster: "/images/posters/tt-quartier.jpg",
    },
    amenityVideo: {
      video: "/videos/triple-towers/triple-towers-sensors.mp4",
      poster: "/images/posters/tt-sensors.jpg",
    },
    videos: [
      {
        key: "interior",
        src: "/videos/triple-towers/interior.mp4",
        poster: "/images/posters/tt-interior.jpg",
        mode: "feature",
      },
      {
        key: "reel",
        src: "/videos/triple-towers/reel.mp4",
        poster: "/images/posters/tt-reel.jpg",
        mode: "ambient",
      },
      {
        key: "ugc",
        src: "/videos/triple-towers/ugc.mp4",
        poster: "/images/posters/tt-ugc.jpg",
        mode: "feature",
      },
    ],
    // The three exterior stills below replace drone-1.jpg, drone-2.jpg and
    // reel-1.jpg, which all showed the towers in shell state (bare concrete,
    // crane, no glazing). Those files stay on disk, simply unreferenced.
    gallery: [
      { src: "/images/triple-towers/gallery-cinematic-1.jpg", altKey: "g1" },
      { src: "/images/triple-towers/gallery-cinematic-2.jpg", altKey: "g2" },
      { src: "/images/triple-towers/interieur-1.jpg", altKey: "g3" },
      { src: "/images/triple-towers/interieur-2.jpg", altKey: "g4" },
      { src: "/images/triple-towers/interieur-3.jpg", altKey: "g5" },
      { src: "/images/triple-towers/interieur-4.jpg", altKey: "g6" },
      { src: "/images/triple-towers/gallery-location-1.jpg", altKey: "g7" },
      { src: "/images/triple-towers/reel-2.jpg", altKey: "g8" },
    ],
    amenities: [
      "airConditioning",
      "doubleGlazing",
      "marble",
      "seaView",
      "elevator",
      "parking",
      "security",
      "terrace",
    ],
    facts: ["floors", "typologies", "delivery", "price"],
    faq: ["q1", "q2", "q3", "q4", "q5", "q6"],
    mapImage: "/images/maps/malabata.jpg",
    mapQuery: "Malabata, Tanger, Maroc",
  },
  {
    id: "villasColline",
    slug: "les-villas-de-la-colline",
    status: "delivered",
    hero: {
      video: "/videos/villas-colline/hero-drone.mp4",
      poster: "/images/posters/vc-hero.jpg",
    },
    cardPreview: "/videos/villas-colline/card-preview.mp4",
    cardPoster: "/images/posters/vc-card.jpg",
    videos: [
      {
        key: "interior",
        src: "/videos/villas-colline/interior.mp4",
        poster: "/images/posters/vc-interior.jpg",
        mode: "feature",
      },
      {
        key: "poolGarden",
        src: "/videos/villas-colline/pool-garden.mp4",
        poster: "/images/posters/vc-pool.jpg",
        mode: "ambient",
      },
    ],
    gallery: [
      { src: "/images/villas-colline/drone-1.jpg", altKey: "g1" },
      { src: "/images/villas-colline/drone-2.jpg", altKey: "g2" },
      { src: "/images/villas-colline/drone-3.jpg", altKey: "g3" },
      { src: "/images/villas-colline/piscine-1.jpg", altKey: "g4" },
      { src: "/images/villas-colline/piscine-2.jpg", altKey: "g5" },
      { src: "/images/villas-colline/piscine-3.jpg", altKey: "g6" },
      { src: "/images/villas-colline/interieur-1.jpg", altKey: "g7" },
      { src: "/images/villas-colline/interieur-2.jpg", altKey: "g8" },
      { src: "/images/villas-colline/interieur-3.jpg", altKey: "g9" },
    ],
    amenities: [
      "pool",
      "garden",
      "seaView",
      "security",
      "parking",
      "terrace",
      "quiet",
      "nearCity",
    ],
    facts: ["typology", "surface", "status", "price"],
    faq: ["q1", "q2", "q3", "q4", "q5", "q6"],
    mapImage: "/images/maps/cap-spartel.jpg",
    mapQuery: "Cap Spartel, Tanger, Maroc",
  },
  {
    id: "delCosta",
    slug: "del-costa",
    status: "delivered",
    // Graded CapCut cinematic (2026-08); hero-exterior.mp4 kept on disk unwired.
    hero: {
      video: "/videos/del-costa/del-costa-cinematic.mp4",
      poster: "/images/posters/dc-cinematic.jpg",
    },
    cardPreview: "/videos/del-costa/card-preview.mp4",
    cardPoster: "/images/posters/dc-card.jpg",
    videos: [
      {
        key: "interior",
        src: "/videos/del-costa/interior.mp4",
        poster: "/images/posters/dc-interior.jpg",
        mode: "feature",
      },
      {
        key: "pool",
        src: "/videos/del-costa/pool.mp4",
        poster: "/images/posters/dc-pool.jpg",
        mode: "ambient",
      },
      {
        key: "security",
        src: "/videos/del-costa/garage-security.mp4",
        poster: "/images/posters/dc-garage.jpg",
        mode: "feature",
      },
    ],
    gallery: [
      { src: "/images/del-costa/exterieur-1.jpg", altKey: "g1" },
      { src: "/images/del-costa/exterieur-2.jpg", altKey: "g2" },
      { src: "/images/del-costa/exterieur-3.jpg", altKey: "g3" },
      { src: "/images/del-costa/piscine-1.jpg", altKey: "g4" },
      { src: "/images/del-costa/interieur-1.jpg", altKey: "g5" },
      { src: "/images/del-costa/interieur-2.jpg", altKey: "g6" },
      { src: "/images/del-costa/interieur-3.jpg", altKey: "g7" },
      { src: "/images/del-costa/securite-1.jpg", altKey: "g8" },
      { src: "/images/del-costa/securite-2.jpg", altKey: "g9" },
    ],
    amenities: [
      "pool",
      "garden",
      "privateGarage",
      "security",
      "playground",
      "elevator",
      "concierge",
      "nearBeach",
    ],
    facts: ["typology", "surface", "status", "price"],
    faq: ["q1", "q2", "q3", "q4", "q5", "q6"],
    mapImage: "/images/maps/tanger-sud.jpg",
    mapQuery: "Route de Rabat, Tanger, Maroc",
  },
];

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
