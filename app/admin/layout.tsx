import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

const jost = localFont({
  src: "../../public/fonts/jost.woff2",
  weight: "100 900",
  variable: "--font-jost",
  display: "swap",
});

const marcellus = localFont({
  src: "../../public/fonts/marcellus.woff2",
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tableau de bord · SBAI Immobilier",
  robots: { index: false, follow: false },
};

/** Separate root layout: the admin area has no public header, footer or tracker. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jost.variable} ${marcellus.variable} h-full antialiased`}>
      <body className="min-h-full bg-ivory-dark font-sans text-foreground">{children}</body>
    </html>
  );
}
