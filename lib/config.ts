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

  // Confirmed by client (Instagram bio @sbaimmobiliertanger, 2026-07-27):
  // fixed line 05 39 94 31 12, mobile/WhatsApp 06 61 74 85 47.
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+212539943112",
  phoneDisplay: "+212 5 39 94 31 12",
  mobile: process.env.NEXT_PUBLIC_MOBILE ?? "+212661748547",
  mobileDisplay: "+212 6 61 74 85 47",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212661748547",
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
