"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";

export type Caption = {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
};

type Mode = "ambient" | "feature";

/**
 * The one video component for the whole site.
 *
 * - `ambient`: autoplay muted loop (heroes, section backgrounds). Pauses when
 *   off-screen, never autoplays under prefers-reduced-motion (poster + play
 *   button instead). Optional mute toggle.
 * - `feature`: poster + large ivory play button, custom controls
 *   (play/pause, scrubber, mute, fullscreen), lazy `preload="none"`.
 *
 * Always: poster required, fade-in on first frame, WebVTT captions slot.
 */
export default function VideoPlayer({
  src,
  poster,
  mode = "feature",
  captions = [],
  className = "",
  videoClassName = "",
  title,
  showMuteToggle = mode === "ambient",
  cornerVignette,
  fullscreenOnMobilePlay = false,
}: {
  src: string;
  poster: string;
  mode?: Mode;
  captions?: Caption[];
  className?: string;
  videoClassName?: string;
  /** Accessible name for the play button / video region. */
  title: string;
  showMuteToggle?: boolean;
  /** Softens a burned-in watermark corner (see PROGRESS.md). */
  cornerVignette?: "top-right" | "top-left";
  /** Feature mode on small screens: entering play opens native fullscreen. */
  fullscreenOnMobilePlay?: boolean;
}) {
  const t = useTranslations("common.cta");
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const ambientAuto = mode === "ambient" && !prefersReduced;
  const [started, setStarted] = useState(false); // user or auto initiated
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false); // first frame decoded → fade in
  const [progress, setProgress] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Sync readiness from the DOM on mount.
  // `loadeddata` can fire before hydration attaches the React handler — the
  // event is then lost and the fade-in gate would never open, leaving a
  // playing-but-invisible video. Reading readyState directly closes that race.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) setReady(true);
    if (!video.paused) setPlaying(true);
  }, []);

  // Ambient: play/pause with viewport visibility
  useEffect(() => {
    if (!ambientAuto) return;
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          video.muted = true; // enforce before play() — autoplay policy
          const p = video.play();
          if (p !== undefined) {
            p.then(() => setAutoplayBlocked(false)).catch(() => {
              // Safari Low Power Mode, strict policies, extensions…
              setAutoplayBlocked(true);
            });
          }
        } else {
          video.pause();
        }
      },
      { rootMargin: "100px", threshold: 0.15 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [ambientAuto]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setStarted(true);
      if (mode === "feature") setMuted(false);
      video.play().catch(() => {});
      if (
        fullscreenOnMobilePlay &&
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches
      ) {
        const v = video as HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        };
        if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
        else v.webkitEnterFullscreen?.();
      }
    } else {
      video.pause();
    }
  }, [mode, fullscreenOnMobilePlay]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const onFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    // iOS Safari
    else (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      .webkitEnterFullscreen?.();
  }, []);

  const onSeek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = (value / 100) * video.duration;
    setProgress(value);
  }, []);

  const showPoster = mode === "feature" ? !started : !ready;

  return (
    <div
      ref={wrapRef}
      className={`group relative overflow-hidden bg-charcoal ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        autoPlay={ambientAuto}
        loop={mode === "ambient"}
        playsInline
        preload={mode === "ambient" ? "auto" : "none"}
        aria-label={title}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onPlay={() => {
          setPlaying(true);
          setAutoplayBlocked(false);
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        onClick={mode === "feature" && started ? togglePlay : undefined}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          ready && started ? "opacity-100" : "opacity-0"
        } ${videoClassName}`}
      >
        {captions.map((c) => (
          <track
            key={c.srcLang}
            kind="captions"
            src={c.src}
            srcLang={c.srcLang}
            label={c.label}
            default={c.default}
          />
        ))}
      </video>

      {/* Poster layer (fades out once video paints) */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          showPoster ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ backgroundImage: `url(${poster})` }}
      />

      {cornerVignette && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            cornerVignette === "top-right"
              ? "bg-[radial-gradient(38%_22%_at_100%_0%,rgba(34,39,31,0.65),transparent_70%)]"
              : "bg-[radial-gradient(38%_22%_at_0%_0%,rgba(34,39,31,0.65),transparent_70%)]"
          }`}
        />
      )}

      {/* Feature: big ivory play button */}
      {mode === "feature" && !started && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`${t("play")} — ${title}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-transparent bg-ivory text-charcoal shadow-card transition-all duration-300 group-hover:border-gold group-hover:shadow-glow-gold md:h-24 md:w-24">
            <Play size={30} aria-hidden className="ms-1 fill-current" />
          </span>
        </button>
      )}

      {/* Feature: custom control bar */}
      {mode === "feature" && started && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-charcoal/80 to-transparent px-4 pb-3 pt-8 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? t("pause") : t("play")}
            className="text-white transition-colors hover:text-gold"
          >
            {playing ? (
              <Pause size={18} aria-hidden />
            ) : (
              <Play size={18} aria-hidden />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label={title}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 accent-[var(--sbai-gold)]"
          />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? t("unmute") : t("mute")}
            className="text-white transition-colors hover:text-gold"
          >
            {muted ? (
              <VolumeX size={18} aria-hidden />
            ) : (
              <Volume2 size={18} aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={onFullscreen}
            aria-label={t("fullscreen")}
            className="text-white transition-colors hover:text-gold"
          >
            <Maximize size={18} aria-hidden />
          </button>
        </div>
      )}

      {/* Ambient: mute toggle */}
      {mode === "ambient" && showMuteToggle && started && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? t("unmute") : t("mute")}
          className="absolute bottom-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold ltr:right-5 rtl:left-5"
        >
          {muted ? (
            <VolumeX size={17} aria-hidden />
          ) : (
            <Volume2 size={17} aria-hidden />
          )}
        </button>
      )}

      {/* Autoplay refused despite muted (Safari Low Power Mode, strict
          policies, extensions): offer an explicit branded play button. */}
      {mode === "ambient" && ambientAuto && autoplayBlocked && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`${t("play")} — ${title}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ivory text-gold-dark shadow-card transition-transform duration-300 hover:scale-105 md:h-24 md:w-24">
            <Play size={28} aria-hidden className="ms-1 fill-current" />
          </span>
        </button>
      )}

      {/* Reduced motion / ambient not started: dignified play affordance */}
      {mode === "ambient" && !ambientAuto && !started && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`${t("play")} — ${title}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-charcoal/40 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold">
            <Play size={22} aria-hidden className="ms-0.5 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
