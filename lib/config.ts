/**
 * Site-wide constants. Values marked TODO(client) are placeholders
 * to be replaced via env vars before launch (see PROGRESS.md).
 */
export const site = {
  name: "SBAI Immobilier",
  legalName: "SBAI Abdelhai & Associés",
  foundingYear: 1973, // FINAL — see PROGRESS.md D1
  city: "Tanger",
  country: "MA",

  // Default numbers come from SBAI's own published founder video outro
  // (06 61 37 37 38). Override via env vars if the client provides others.
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+212661373738",
  phoneDisplay: "+212 6 61 37 37 38",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212661373738",
  // TODO(client): confirm email address before launch
  email: process.env.NEXT_PUBLIC_EMAIL ?? "contact@immobiliersbai.net",

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
