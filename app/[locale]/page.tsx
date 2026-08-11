import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Hero from "@/components/sections/Hero";
import HeritageStrip from "@/components/sections/HeritageStrip";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import FounderSection from "@/components/sections/FounderSection";
import MRESection from "@/components/sections/MRESection";
import CdM2030 from "@/components/sections/CdM2030";
import Testimonials from "@/components/sections/Testimonials";
import BureauDeVente from "@/components/sections/BureauDeVente";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <Hero />
      <HeritageStrip />
      <ProjectsGrid />
      <FounderSection />
      <MRESection />
      <CdM2030 />
      <Testimonials />
      <BureauDeVente />
      <ContactSection />
    </main>
  );
}
