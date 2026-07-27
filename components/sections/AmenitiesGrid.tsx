import {
  ArrowUpDown,
  Baby,
  Building2,
  Car,
  ConciergeBell,
  Gem,
  Layers,
  Leaf,
  MountainSnow,
  ParkingCircle,
  ShieldCheck,
  Snowflake,
  Sun,
  Umbrella,
  Waves,
} from "lucide-react";
import type { ComponentType } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

/** Amenity key → Lucide icon. Stroke 1.5, gold accent (brand board). */
const ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  airConditioning: Snowflake,
  doubleGlazing: Layers,
  marble: Gem,
  seaView: Waves,
  elevator: ArrowUpDown,
  parking: ParkingCircle,
  security: ShieldCheck,
  terrace: Sun,
  pool: Umbrella,
  garden: Leaf,
  quiet: MountainSnow,
  nearCity: Building2,
  privateGarage: Car,
  playground: Baby,
  concierge: ConciergeBell,
  nearBeach: Waves,
};

export default function AmenitiesGrid({
  label,
  title,
  amenities,
  labelFor,
}: {
  label: string;
  title: string;
  amenities: string[];
  labelFor: (key: string) => string;
}) {
  return (
    <section className="bg-ivory-dark">
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <RevealOnScroll>
          <p className="micro-label text-gold-dark">{label}</p>
          <h2 className="heading-display mt-3 max-w-xl text-2xl text-foreground md:text-3xl">
            {title}
          </h2>
        </RevealOnScroll>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {amenities.map((key, i) => {
            const Icon = ICONS[key] ?? ShieldCheck;
            return (
              <RevealOnScroll as="li" key={key} delay={i * 0.06}>
                <span className="block text-gold-dark">
                  <Icon size={30} strokeWidth={1.5} aria-hidden />
                </span>
                <p className="micro-label mt-4 text-secondary">
                  {labelFor(key)}
                </p>
              </RevealOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
