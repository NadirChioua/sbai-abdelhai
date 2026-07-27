import { ChevronDown } from "lucide-react";
import VideoPlayer from "@/components/ui/VideoPlayer";

export default function ProjectHero({
  video,
  poster,
  title,
  location,
  videoTitle,
  scrollLabel,
  statusLabel,
}: {
  video: string;
  poster: string;
  title: string;
  location: string;
  videoTitle: string;
  scrollLabel: string;
  statusLabel: string;
}) {
  return (
    <section className="relative flex min-h-[85svh] items-end">
      <div className="absolute inset-0">
        <VideoPlayer
          mode="ambient"
          src={video}
          poster={poster}
          title={videoTitle}
          showMuteToggle={false}
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--overlay-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/70 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 pb-20 text-center md:px-8 md:pb-24">
        <p className="eyebrow text-shadow-hero text-gold">{statusLabel}</p>
        <h1 className="heading-display text-shadow-hero mx-auto mt-5 max-w-4xl text-display text-on-dark">
          {title}
        </h1>
        <p className="text-shadow-hero mt-4 text-body-lg font-light tracking-wide text-on-dark">
          {location}
        </p>
        <a
          href="#presentation"
          aria-label={scrollLabel}
          className="mt-10 inline-flex animate-bounce text-on-dark-muted transition-colors hover:text-gold motion-reduce:animate-none"
        >
          <ChevronDown size={26} aria-hidden />
        </a>
      </div>
    </section>
  );
}
