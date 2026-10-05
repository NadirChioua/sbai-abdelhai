import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHero from "@/components/sections/PageHero";
import ProjectPresentation from "@/components/sections/ProjectPresentation";
import Gallery from "@/components/sections/Gallery";
import ContactSection from "@/components/sections/ContactSection";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { ButtonAnchor } from "@/components/ui/Button";
import DelCosta2Interactive from "@/components/sections/DelCosta2Interactive";
import VerticalReels from "@/components/sections/VerticalReels";
import LocationMap from "@/components/sections/LocationMap";
import { DC2_MEDIA as MEDIA, DC2_STILLS as STILLS } from "@/lib/dc2-media";

/**
 * Del Costa 2 — every image, video, panorama and the 3D model on this page is
 * extracted from ONE model built from the permit drawings (del-costa-2/src).
 * Each visual carries the "Projection 3D du projet" marking.
 */
const GALLERY = [
  ["DC2_R01_Aerien_45", "aerien"],
  ["DC2_R02_Aerien_Piscines", "piscines"],
  ["DC2_R03_Entree", "entree"],
  ["DC2_R04_Rue_244", "rue"],
  ["DC2_R05_Piscine", "piscine"],
  ["DC2_R06_Cour_Jardin", "cour"],
  ["DC2_R07_Terrasse", "terrasse"],
  ["DC2_R08_Cafe", "cafe"],
  ["DC2_R09_Nuit_Facade", "nuitFacade"],
  ["DC2_R10_Nuit_Piscine", "nuitPiscine"],
  ["DC2_R11_Aerien_Angle_FG", "angle"],
] as const;
const PANOS = ["entree", "piscine", "cour_jardin", "terrasse_retrait"] as const;
const BLOCKS = [
  "Bloc_A", "Bloc_B", "Bloc_C", "Bloc_D", "Bloc_E", "Bloc_F", "Bloc_G", "Bloc_H",
  "Cafe_Restaurant", "Piscines",
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projets/del-costa-2">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "delCosta2" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: { images: [`${STILLS}/DC2_R01_Aerien_45.jpg`] },
  };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/projets/del-costa-2">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "delCosta2" });
  const tp = await getTranslations({ locale, namespace: "projectPage" });

  const facts = (t.raw("facts") as { label: string; value: string }[]).map((f) => f);
  const photos = GALLERY.map(([file, key]) => ({
    src: `${STILLS}/${file}.jpg`,
    alt: `${t(`gallery.${key}`)} — ${t("watermark")}`,
  }));
  const views = PANOS.map((id) => ({ id, label: t(`views.${id}`), src: `/panos/del-costa-2/pano_${id}.jpg` }));
  const blocks = BLOCKS.map((id) => ({
    id,
    label: t(`blocks.${id}.label`),
    desc: t(`blocks.${id}.desc`),
  }));
  const legend = t.raw("planLegend") as string[];

  return (
    <main className="flex-1">
      <PageHero
        image={`${STILLS}/DC2_R01_Aerien_45.jpg`}
        imageAlt={t("heroAlt")}
        label={t("label")}
        title={t("title")}
        intro={t("intro")}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonAnchor href="#contact" size="lg">
            {t("ctaVisit")}
          </ButtonAnchor>
          <ButtonAnchor href="/docs/del-costa-2-catalogue.pdf" variant="outline-light" size="lg" download>
            {t("ctaCatalogue")}
          </ButtonAnchor>
          <span className="border border-gold/60 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-gold">
            {t("watermark")}
          </span>
        </div>
      </PageHero>

      {/* Film */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-screen-2xl px-4 py-20 md:px-8">
          <p className="eyebrow text-gold">{t("filmLabel")}</p>
          <h2 className="heading-display mt-3 text-h2 text-on-dark">{t("filmHeading")}</h2>
          <VideoPlayer
            className="mt-10"
            src="/videos/del-costa-2/del-costa-2-film.mp4"
            poster={`${MEDIA}/DC2_film_poster.jpg`}
            mode="feature"
            title={t("filmTitle")}
          />
        </div>
      </section>

      <ProjectPresentation
        label={t("presentationLabel")}
        title={t("presentationTitle")}
        paragraphs={[t("p1"), t("p2")]}
        facts={facts}
      />

      <Gallery
        label={t("galleryLabel")}
        title={t("galleryTitle")}
        photos={photos}
        openLabel={tp("galleryOpen")}
        closeLabel={tp("galleryClose")}
        prevLabel={tp("galleryPrev")}
        nextLabel={tp("galleryNext")}
      />

      <VerticalReels
        label={t("reelsLabel")}
        title={t("reelsTitle")}
        watermark={t("watermark")}
        reels={(["piscine", "facade", "cafe"] as const).map((k) => ({
          src: `/videos/del-costa-2/reel_${k}.mp4`,
          poster: `${MEDIA}/reel_${k}_poster.jpg`,
          title: t(`reels.${k}`),
        }))}
      />

      {/* Plan d'ensemble */}
      <section className="bg-ivory-dark">
        <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 py-24 md:px-8 lg:grid-cols-3">
          <div>
            <p className="eyebrow text-gold-dark">{t("planLabel")}</p>
            <h2 className="heading-display mt-3 text-h2 text-foreground">{t("planTitle")}</h2>
            <ul className="mt-8 space-y-3 text-body text-secondary">
              {legend.map((l) => (
                <li key={l} className="border-l-2 border-gold pl-4">
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden lg:col-span-2">
            <Image
              src={`${STILLS}/DC2_R12_Plan_Masse.jpg`}
              alt={t("planAlt")}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <DelCosta2Interactive
        views={views}
        blocks={blocks}
        text={{
          watermark: t("watermark"),
          visitLabel: t("visitLabel"),
          visitTitle: t("visitTitle"),
          visitHint: t("visitHint"),
          visitLoad: t("visitLoad"),
          modelLabel: t("modelLabel"),
          modelTitle: t("modelTitle"),
          modelHint: t("modelHint"),
          modelLoad: t("modelLoad"),
          modelReset: t("modelReset"),
        }}
      />

      <LocationMap
        label={t("locationLabel")}
        title={t("locationTitle")}
        body={t("locationBody")}
        mapImage="/images/maps/achakkar-del-costa-2.jpg"
        mapQuery="35.7618,-5.9272"
        mapAlt={t("mapAlt")}
        address={t("locationAddress")}
        externalLabel={tp("openInMaps")}
        attribution={tp("mapAttribution")}
      />

      {/* Catalogue */}
      <section className="bg-heritage text-heritage-on">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-start gap-6 px-4 py-20 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">{t("catalogueLabel")}</p>
            <h2 className="heading-display mt-3 text-h2">{t("catalogueTitle")}</h2>
            <p className="mt-4 text-body font-light">{t("catalogueBody")}</p>
          </div>
          <ButtonAnchor href="/docs/del-costa-2-catalogue.pdf" size="lg" download>
            {t("ctaCatalogue")}
          </ButtonAnchor>
        </div>
      </section>

      <p className="bg-ivory px-4 py-6 text-center text-caption text-muted md:px-8">{t("disclaimer")}</p>

      <ContactSection defaultProject="del-costa-2" />
    </main>
  );
}
