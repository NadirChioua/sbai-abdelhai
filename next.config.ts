import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Does not restrict scripts or styles (Next inlines both); it blocks framing
// by other sites, plugins and <base> hijacking, and forces HTTPS subresources.
const csp = [
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self' https://wa.me",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// Media files are sometimes replaced under the same name, so a week rather
// than "immutable"; fonts never change.
const week = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/panos/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/models/:path*", headers: [{ key: "Cache-Control", value: week }] },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
