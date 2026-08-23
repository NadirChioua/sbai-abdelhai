/**
 * Site-wide constants. Values marked TODO(client) are placeholders
 * to be replaced via env vars before launch (see PROGRESS.md).
 */
export const site = {
  name: "SBAI Immobilier",
  legalName: "SBAI Abdelhai & Associés",
  // FINAL — the "SINCE 1969" mark on the logo is the authoritative source (PROGRESS.md D1).
  foundingYear: 1969,
  city: "Tanger",
  country: "MA",

  // Confirmed by client (Instagram bio @sbaimmobiliertanger, 2026-07-27):
  // fixed line 05 39 94 31 12, mobile/WhatsApp 06 61 74 85 47.
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+212539943112",
  phoneDisplay: "+212 5 39 94 31 12",
  mobile: process.env.NEXT_PUBLIC_MOBILE ?? "+212661748547",
  mobileDisplay: "+212 6 61 74 85 47",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212661748547",
  // TODO(client): confirm email address before launch
  email: process.env.NEXT_PUBLIC_EMAIL ?? "contact@immobiliersbai.net",
  // TODO(client): exact street address needed for the footer, contact page,
  // map pin and schema.org LocalBusiness.
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "Tanger, Maroc",
  mapQuery: process.env.NEXT_PUBLIC_MAP_QUERY ?? "SBAI Immobilier, Tanger, Maroc",
  mapImage: "/images/maps/tanger-centre.jpg",

  /**
   * Sales office ("bureau de vente") — the physical place a visitor can walk into.
   *
   * `address` confirmed by client review, 2026-08-23 (annotated copy PDF, Mod 2):
   * real address replaces the Boulevard Mohammed VI placeholder.
   *
   * TODO(coordinates): `lat`/`lng` and `mapImage` are still the old
   * Tanger-centre placeholder — we don't have verified coordinates for
   * "184 Borj Khalij, Tanger" yet. Do not guess; get them from the client or
   * geocode the confirmed address, then regenerate `mapImage` from OpenStreetMap
   * tiles centred on the real point. Opening hours, spoken languages and the
   * "comment nous trouver" directions live in messages/{fr,ar}.json under
   * `bureau.*` — the directions string there still has [repère] placeholders,
   * see TODO(client-orientation) in that file's neighbourhood.
   */
  office: {
    address: "184 Borj Khalij, Tanger",
    lat: 35.7595,
    lng: -5.834,
    mapImage: "/images/maps/tanger-centre.jpg",
    video: "/videos/bureau/bureau-location.mp4",
    videoPoster: "/images/posters/bureau-location.jpg",
  },

  social: {
    instagram: "https://www.instagram.com/sbaimmobiliertanger",
    tiktok: "https://www.tiktok.com/@sbaiimmobilier",
    // TODO(client): confirm Facebook / YouTube page URLs
    facebook: "https://www.facebook.com/sbaimmobiliertanger",
    youtube: "https://www.youtube.com/@sbaiimmobilier",
  },
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
