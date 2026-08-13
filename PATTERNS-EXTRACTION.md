# Reusable UI/UX Patterns — Extraction Handoff

**Purpose.** This document lets a Claude Code instance working in a *different* codebase
reproduce four interaction/composition patterns built and debugged in a Next.js marketing
site. It carries **behaviour and structure only**. Every brand decision — colours,
typefaces, tone, imagery, copy — is stripped out and replaced with generic CSS custom
properties. The receiving project keeps its own design system.

**How to read it.** Section 1 is the stack you need first. Sections 2–5 are the four
patterns: concept, real implementation (annotated), the failure modes actually hit and
fixed, and a copy-pasteable brand-neutral boilerplate. Section 6 is addressed to you, the
implementing agent.

**Provenance.** Every snippet is extracted from a production site (deployed,
Lighthouse-audited, Playwright-tested at 1440px / 375px / RTL). Source file paths and line
numbers are cited so a human can verify any claim. Nothing here is invented pseudo-code.
Values that could not be recovered verbatim are labelled **[reconstructed]** with the
evidence they were derived from.

**Token vocabulary.** Replace with your own equivalents:

| Placeholder | Means |
|---|---|
| `var(--accent)` | Your accent colour (links, active states, focus ring) |
| `var(--accent-strong)` | Darker accent — accent text on light backgrounds |
| `var(--surface)` / `--surface-alt` | Page background / alternating section background |
| `var(--surface-elevated)` | Card or panel background |
| `var(--surface-inverse)` | Darkest surface (video letterbox, lightbox scrim) |
| `var(--text-primary)` / `--text-secondary` / `--text-muted` | Body / de-emphasised / caption |
| `var(--text-on-media)` / `--text-on-media-muted` | Text over video or photography |
| `var(--border-subtle)` | Hairline borders |
| `var(--font-display)` / `--font-body` | Display / body family |
| `var(--ease-reveal)` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `var(--duration-reveal)` / `--duration-fade` | `700ms` / `500ms` |
| `var(--overlay-media)` | Gradient making text legible over media |

**Contents:** [1 Framework](#1--technical-framework-requirements) ·
[2 Hero video](#2--pattern-1-hero-video-autoplay) ·
[3 Stacking timeline](#3--pattern-2-stacking-timeline) ·
[4 Content cards](#4--pattern-3-content-cards-with-video-preview) ·
[5 Gallery + section video](#5--pattern-4-gallery-and-in-section-video) ·
[6 Integration guidance](#6--integration-guidance-for-the-receiving-project)

---

# 1 — Technical framework requirements

## 1.1 What the source runs

| Package | Version | Role |
|---|---|---|
| `next` | **16.2.12** | App Router, `next/image` |
| `react` / `react-dom` | **19.2.4** | Required by Next 16 |
| `tailwindcss` | **4.3.3** | CSS-first config (`@theme`), **no `tailwind.config.js`** |
| `framer-motion` | **12.42.2** | Scroll-linked transforms, reveal, reduced-motion hook |
| `lucide-react` | **1.27.0** | Icons — freely swappable, not load-bearing |

> Reference: `package.json`, verified against installed `node_modules/*/package.json`.

The patterns depend on four of these: React, any utility CSS layer, Framer Motion, and the
native `IntersectionObserver`. Next.js matters only for `next/image` and the server/client
split; everything degrades to a plain React app with `<img>`.

## 1.2 Next.js App Router specifics

The source runs **Next 16**, which differs from 14/15 in three ways:

**a) `params` is a Promise**, and route prop types are generated:

```tsx
// Next 16
export default async function Page({ params }: PageProps<"/[locale]/programmes/[slug]">) {
  const { locale, slug } = await params;
}
// Synchronous component: unwrap with React.use()
import { use } from "react";
export default function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
}
```

> Reference: `app/[locale]/page.tsx:13-15`, `app/[locale]/projets/triple-towers/page.tsx:22-27`.

On 14/15 you type `params` yourself and it is a plain object. **Adapt, don't copy.**

**b) `proxy.ts` replaced `middleware.ts`.** Renaming it back — the instinct of anyone used
to 14/15 — breaks routing on 16. Irrelevant to these patterns unless you use middleware.

**c) Static params / locale pre-rendering.** Irrelevant unless you are multilingual.

**No pattern requires Next 16.** They require React 18+ with client components.

## 1.3 Server vs client split

Load-bearing and easy to get wrong:

- **Section components are server components** (no `"use client"`). They compose layout.
- **Only the interactive leaf is a client component**: video player, card with preview,
  lightbox, scroll-linked timeline, reveal wrapper.
- **Server components cannot pass functions to client components.** Where a client
  component needs a computed label, compute the *string* server-side and pass it as a prop.
  The timeline type carries a pre-rendered `label` for exactly this reason:

```ts
export type Chapter = {
  year: string;
  numeral: string;
  /** Pre-rendered label — server components cannot pass functions. */
  label: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
};
```

> Reference: `components/sections/StackingTimeline.tsx:13-21`.

Consequence for you: build item arrays on the server; pass plain serialisable data. Never
pass `t()`, formatters, or callbacks across the boundary.

## 1.4 Token architecture (Tailwind v4 here; the discipline is version-agnostic)

The source has **no `tailwind.config.js`** — the theme is declared in CSS:

```css
/* app/globals.css */
@import "tailwindcss";
@import "../styles/tokens.css";   /* raw token values live here */

@theme inline {
  /* `--color-x` generates bg-x / text-x / border-x utilities. */
  --color-accent:          var(--accent);
  --color-surface:         var(--surface);
  --color-surface-inverse: var(--surface-inverse);
  --color-foreground:      var(--text-primary);
  --color-secondary:       var(--text-secondary);
  --color-muted:           var(--text-muted);
  --color-on-media:        var(--text-on-media);

  --font-display: var(--font-display-stack), serif;
  --font-sans:    var(--font-body-stack), sans-serif;

  /* Fluid type scale: one value per ROLE, not one per breakpoint. */
  --text-display: clamp(2.5rem, 6vw, 4.5rem);   --text-display--line-height: 1.05;
  --text-h1:      clamp(2rem, 4.5vw, 3.5rem);   --text-h1--line-height: 1.1;
  --text-h2:      clamp(1.625rem, 3vw, 2.5rem); --text-h2--line-height: 1.15;
  --text-h3:      clamp(1.25rem, 2vw, 1.75rem); --text-h3--line-height: 1.25;
  --text-body:    1rem;                          --text-body--line-height: 1.7;
  --text-caption: 0.875rem;
  --text-eyebrow: 0.75rem;
}
```

> Reference: `app/globals.css:1-60`, `styles/tokens.css`.

**The transferable part is the two-file discipline**, independent of framework version:

1. `styles/tokens.css` — raw `:root` values, one source of truth, each commented with *why*
   it exists. Knows nothing about Tailwind.
2. `app/globals.css` — imports tokens and maps them into the framework's namespace.

On **Tailwind v3**, keep the same token file and reference it from the config:

```js
theme: { extend: {
  colors: { accent: "var(--accent)", surface: "var(--surface)", foreground: "var(--text-primary)" },
  fontFamily: { display: ["var(--font-display-stack)", "serif"] },
}}
```

**No snippet in this document requires Tailwind v4** — the `@theme` block above is the only
v4-specific syntax.

**Layer discipline (worth stealing).** Composite classes go inside `@layer components` so
utilities — a later layer — can override them per breakpoint. Unlayered CSS silently beats
utilities and produces "why won't `md:text-left` apply" bugs:

```css
@layer components {
  .heading-display { font-family: var(--font-display); letter-spacing: 0.12em; line-height: 1.15; }
  .eyebrow {
    font-family: var(--font-body); text-transform: uppercase; letter-spacing: 0.32em;
    font-weight: 500; font-size: var(--text-eyebrow); line-height: 1.4; color: var(--accent-strong);
  }
}
```

> Reference: `app/globals.css:71-113`.

## 1.5 Global CSS the patterns assume

```css
/* 1. Focus ring. The gallery lightbox and card grid are keyboard-navigable
      only because this exists. */
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

/* 2. Reduced-motion kill switch. Components ALSO check the preference in JS
      (§1.7); this catches everything driven purely by CSS. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important;
  }
}

/* 3. Legibility shadow for text over media. Applied to every hero string. */
.text-shadow-media { text-shadow: 0 2px 24px rgb(0 0 0 / 0.55); }

/* 4. Section rhythm — one padding scale, so sections don't each invent one. */
.section-y { padding-block: 3.5rem; }
@media (min-width: 768px)  { .section-y { padding-block: 5rem; } }
@media (min-width: 1024px) { .section-y { padding-block: 8rem; } }
```

> Reference: `app/globals.css:139-152, 180-206`.

## 1.6 IntersectionObserver — used raw

All viewport-driven behaviour uses the native API directly. No wrapper library. Two
observers, deliberately tuned differently:

| Where | `rootMargin` | `threshold` | Why |
|---|---|---|---|
| Hero / section video | `100px` | `0.15` | Start when a sliver shows; the element is large |
| Card video preview | `200px` | `0.25` | Start earlier (grids scroll fast), but require a quarter visible before spending bandwidth |

> Reference: `components/ui/VideoPlayer.tsx:105`, `components/ui/Card.tsx:79`.

## 1.7 Framer Motion — the three APIs actually used

1. **`useReducedMotion()`** — every animated component calls it and branches. The most
   reused API in the codebase.
2. **`useScroll({ target, offset })` + `useTransform()`** — scroll-linked values, used only
   by the stacking timeline.
3. **`motion.*` + `whileInView`** — one shared reveal wrapper, used by every section.

The reveal wrapper, in full — you will use it constantly:

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Fade + rise on viewport entry. Fires once. No motion under reduced-motion. */
export default function RevealOnScroll({
  children, delay = 0, y = 32, className = "", as = "div",
}: {
  children: ReactNode; delay?: number; y?: number; className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const prefersReduced = useReducedMotion();
  const Comp = motion[as];

  // Not "animate to the same value" — no motion component at all. Cheaper, and
  // guarantees content is in the DOM and visible for assistive tech and crawlers.
  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}
```

> Reference: `components/motion/RevealOnScroll.tsx` (complete, 42 lines).

**Stagger convention:** siblings delayed by index × a constant. In use: `0.06s` icon grids,
`0.08s` gallery items, `0.1s` large blocks, `0.12s` cards. Above ~0.15s reads as sluggish;
below 0.05s reads as simultaneous.

If you use a different animation library, `RevealOnScroll` is the only thing you must port
— the other patterns use Framer Motion for one thing each, with vanilla fallbacks noted.

## 1.8 Video: raw `<video>`, not `next/video`

**The source uses the native element everywhere.** No `next/video`, no player library, no
video service. Reasons in order of importance:

1. **Control over the autoplay handshake.** §2.2's fix requires reading
   `videoRef.current.readyState` at mount and calling `.play()` imperatively with a
   `.catch()`. Wrapper components hide both the element and the promise.
2. **Self-hosted, zero third-party requests.** Files served from the app's own origin out
   of `public/videos/`. No embed means no third-party cookies and no consent prerequisite
   before the hero can play.
3. **`preload` must be tunable per instance** — see §5.2. This is the difference between a
   2 MB page and a 22 MB page.
4. **Weight budget enforced at encode time** (§4.2). A hosted player negotiates quality at
   runtime and defeats the budget.

**When to use something else:** long-form video (a 20-minute open-day recording) should not
be self-hosted — bandwidth and adaptive bitrate become real problems. These patterns target
clips of **4–60 seconds**.

`crossOrigin="anonymous"` was **removed** during debugging: useless for same-origin media,
and it forces CORS preflights. Do not add it back. > Reference: `PROGRESS.md:111-113`.

## 1.9 `next.config.ts`

```ts
const nextConfig: NextConfig = {
  images: {
    // Posters and gallery images are JPEG on disk; Next negotiates modern formats
    // at request time. Without this, Lighthouse flags `modern-image-formats`.
    formats: ["image/avif", "image/webp"],
  },
};
```

**Known limitation to fix in your project from day one:** runtime conversion costs CPU on
every cold request. If your images are static, convert to AVIF/WebP **at build time**.

## 1.10 Minimum stack checklist

- [ ] **React 18+** with client components.
- [ ] **A CSS custom-property token layer** — one file of `:root` values, mapped into your
      utility framework separately. Patterns reference tokens, never literals.
- [ ] **Your type scale has a `display` step** larger than `h1` (Pattern #2 needs it).
- [ ] **Framer Motion 11+** *or* substitutes for `useReducedMotion`, one scroll-progress
      hook, one in-view reveal.
- [ ] **Global `:focus-visible` ring** (Patterns #3, #4 rely on it).
- [ ] **Global `prefers-reduced-motion` block.**
- [ ] **An image component** with `fill` + `sizes`, or accept plain `<img>`.
- [ ] **`ffmpeg` on PATH** for the card-preview pipeline — encode-time only.
- [ ] **A static media directory** served from your own origin.
- [ ] **A written weight budget.** The source enforces: hero ≤ 10 MB, section video ≤ 5 MB,
      card preview ≤ 250 KB. Write yours down before encoding anything.

---

# 2 — Pattern #1: Hero video autoplay

> Source: `components/sections/Hero.tsx` (64 lines), `components/ui/VideoPlayer.tsx` (325).

## 2.1 The architecture

```
<section>                      position: relative; min-height: 100svh; align-items: end
  ├── <div absolute inset-0>   video, object-cover, fills the section
  ├── <div absolute inset-0>   primary gradient (transparent → dark at the bottom)
  ├── <div absolute top-0>     top scrim (dark → transparent), h-44
  └── <div relative>           eyebrow · title · subtitle · CTAs · scroll cue
</section>
```

```tsx
// Server component — no "use client" needed at this level.
<section className="relative flex min-h-svh items-end">
  <div className="absolute inset-0">
    <MediaVideo mode="ambient" isHero src="/videos/hero.mp4"
                poster="/images/posters/hero.jpg"
                description="Descriptive sentence naming what is on screen"
                className="h-full w-full" />
  </div>
  <div aria-hidden className="pointer-events-none absolute inset-0"
       style={{ background: "var(--overlay-media)" }} />
  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44
                              bg-gradient-to-b from-black/70 to-transparent" />
  <div className="relative mx-auto w-full max-w-screen-2xl px-4 pb-20 text-center md:px-8 md:pb-24">
    {/* eyebrow / h1 / subtitle / CTAs / scroll cue */}
  </div>
</section>
```

> Reference: `components/sections/Hero.tsx:14-62`.

**Six decisions worth copying:**

1. **`min-h-svh`, not `100vh`.** `svh` is the *small* viewport height — it excludes mobile
   browser chrome that retracts on scroll. With `100vh` the CTA row sits under the iOS
   Safari URL bar.
2. **`items-end` + bottom padding, not vertical centring.** Text in the lower third leaves
   the top two thirds of footage visible; centred text sits where the subject usually is.
3. **Two gradients.** The bottom one serves the copy; the top scrim serves a transparent
   site header, which otherwise vanishes over bright footage. The primary gradient is a
   token: `linear-gradient(rgb(0 0 0 / 0) 40%, rgb(0 0 0 / 0.55) 100%)`. **The `40%` stop
   matters** — no darkening across the top 40% keeps the footage clean.
4. **`pointer-events-none` on both overlays**, or they swallow clicks meant for the
   fallback play button.
5. **`aria-hidden` on both overlays.** Decorative; they must not enter the a11y tree.
6. **The section is static — not `fixed`, not `sticky`.** A fixed hero fights scroll
   anchoring, holds a compositor layer for the whole session, and jitters on iOS. **If you
   want parallax, apply it to the video inside the section, never to the section.**

**Scroll cue is a real anchor**, so it works for keyboard and screen readers:

```tsx
<a href="#next-section" aria-label="Scroll to the next section"
   className="mt-12 inline-flex animate-bounce transition-colors motion-reduce:animate-none">
  <ChevronDown size={26} aria-hidden />
</a>
```

> Reference: `components/sections/Hero.tsx:54-60`. `motion-reduce:animate-none` kills the
> bounce in addition to the global CSS rule.

## 2.2 The hydration fix — the highest-value part of this document

### The bug as it presented

> *"The hero video only plays in mobile view."*

It did not. The video was **playing on desktop the whole time** — measured with Playwright:
`paused = false`, `currentTime = 3.78s`, `readyState = 4`. It was **invisible**:
`opacity: 0`. > Reference: `PROGRESS.md:100-118`.

### Why

The component fades the video in once the first frame decodes, gated on React state:

```tsx
const [ready, setReady] = useState(false);
<video onLoadedData={() => setReady(true)} className={ready ? "opacity-100" : "opacity-0"} />
```

This is a **race between the browser and React hydration**:

1. Server sends HTML containing `<video autoplay muted playsinline preload="auto">`.
2. The browser parses and starts fetching **immediately** — before any JS runs.
3. On a fast connection or warm cache, `loadeddata` fires *before* React hydrates.
4. React attaches `onLoadedData` **after** the event fired. The event is gone; there is no
   replay.
5. `ready` stays `false` for ever. The video plays, decoded, at `opacity: 0`.

Mobile emulation "worked" only because a throttled reload changed the timing so hydration
won. **It was never a viewport rule.** Seven plausible causes were eliminated first:
`muted` present in SSR HTML, `playsinline` present, correct MIME, HTTP 200, no
Content-Encoding issue, no CSP block, no autoplay-policy rejection.

### The fix

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

const videoRef = useRef<HTMLVideoElement>(null);
const [ready, setReady]     = useState(false);  // first frame decoded → fade in
const [started, setStarted] = useState(false);  // playback initiated
const [blocked, setBlocked] = useState(false);  // play() promise rejected

// ── PART 1: close the hydration race ───────────────────────────────────────
// `loadeddata` can fire before hydration attaches the React handler; the event
// is then lost and the fade gate never opens, leaving a playing-but-invisible
// video. readyState is STATE, not an event — it cannot be missed.
useEffect(() => {
  const v = videoRef.current;
  if (!v) return;
  if (v.readyState >= 2) setReady(true);   // HAVE_CURRENT_DATA or better
  if (!v.paused) setStarted(true);         // it may already be playing
}, []);

// ── PART 2: a second, later signal ─────────────────────────────────────────
<video onLoadedData={() => setReady(true)} onCanPlay={() => setReady(true)} />

// ── PART 3: enforce muted before play(), then handle the promise ───────────
const io = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    setStarted(true);
    v.muted = true;                        // imperative — see table below
    const p = v.play();
    if (p !== undefined) {                 // older browsers return void
      p.then(() => setBlocked(false))
       .catch(() => setBlocked(true));     // Safari Low Power Mode, extensions…
    }
  } else {
    v.pause();                             // give the decoder back off-screen
  }
}, { rootMargin: "100px", threshold: 0.15 });
```

> Reference: `components/ui/VideoPlayer.tsx:76-81` (readyState sync), `:84-109` (observer),
> `:169-170` (dual ready handlers).

**Why each line matters:**

| Line | Why it is not optional |
|---|---|
| `if (v.readyState >= 2) setReady(true)` | **The actual fix.** `readyState` is state, not an event, so it cannot be missed. `2` = `HAVE_CURRENT_DATA`: the current frame is decoded, which is all the fade needs. |
| `if (!v.paused) setStarted(true)` | Same class of bug for the play/pause icon — native `autoplay` may have started before hydration, so `onPlay` was also lost. |
| `onCanPlay` alongside `onLoadedData` | A second chance if hydration lands between the two events. Both setters are idempotent. |
| `v.muted = true` **before** `play()` | The React `muted` prop is applied by the DOM reconciler, which may not have flushed. Browsers check the **live DOM property** at the instant `play()` is called. **This is the most common cause of "autoplay works locally, fails in production".** |
| `if (p !== undefined)` | `play()` returned `void` before it returned a Promise. Guards against `TypeError` on old WebViews. |
| `.catch(…)` | Otherwise an unhandled rejection — and the user stares at a still poster with no way to start it. |
| `v.pause()` off-screen | A 1080p decode in a scrolled-past section costs real battery and main-thread time. |
| `autoPlay` attribute **kept** | Belt and braces: the browser starts before JS runs; the observer is the recovery path, not the primary one. |

**The fade gate requires both flags**, so nothing appears before playback is initiated:

```tsx
className={`… transition-opacity duration-500 ${ready && started ? "opacity-100" : "opacity-0"}`}
```

**Verification.** After the fix: `paused = false`, `currentTime = 4.98s`, `opacity = 1`,
and a screenshot at t≈5s visibly different from the poster. **Do this in your project too**
— "it looks fine when I reload" is exactly the observation that hid this bug.

## 2.3 The fallback poster strategy

**Two poster layers, deliberately** — the `poster` attribute *and* a CSS background layer:

```tsx
<video poster={poster} … />
<div aria-hidden
     className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500
                 ${showPoster ? "opacity-100" : "pointer-events-none opacity-0"}`}
     style={{ backgroundImage: `url(${poster})` }} />
```

> Reference: `components/ui/VideoPlayer.tsx:197-204`.

The native `poster` covers the window before any JS runs (no flash of black). The CSS layer
is what **cross-fades** — the native poster disappears instantly when the first frame
paints, which reads as a hard cut. Two layers give a controlled 500 ms dissolve.
`pointer-events-none` when hidden stops the invisible layer eating clicks.

**`preload`:** `"auto"` for the hero (it *will* play; fetching late means a visible
poster-hold), `"none"` for everything else. ⚠️ **The source hardcodes `"auto"` for every
ambient player and that is a measured mistake — see §5.2 for the corrected rule.**

**Poster frames are cut 10–30 % into the clip, never frame 0.** Graded footage opens on a
fade from black; frame 0 is a black rectangle.

```bash
ffmpeg -ss 6 -i hero.mp4 -frames:v 1 -q:v 3 public/images/posters/hero.jpg
```

> Reference: `PHASE-2A-SUMMARY.md:18-21`.

**Slow connections:** poster paints first (~50–200 KB), video streams behind it, cross-fade
fires at `readyState >= 2`. The layout never shifts because the section is sized by
`min-h-svh`, not by the media — **CLS stays 0** regardless of when the video arrives.

**Autoplay blocked** (Safari Low Power Mode, strict settings, extensions): the `.catch()`
sets `blocked`, which renders an explicit play button over the poster. Full markup in §2.5.

## 2.4 The accessibility layer

**`prefers-reduced-motion`** — the decisive line:

```tsx
const prefersReduced = useReducedMotion();
const ambientAuto = mode === "ambient" && !prefersReduced;
```

> Reference: `components/ui/VideoPlayer.tsx:64`.

`ambientAuto` gates the observer, the `autoPlay` attribute and `loop`. Under reduced motion
the hero is **a still poster with a play button** — not a muted autoplay, not a paused
video. The user can still watch it; nothing moves until they ask.

**Screen readers.** The video carries `aria-label={description}`, a **required** prop — a
real sentence naming what is on screen, not a filename. In a decorative role (card
previews, §4) the video instead gets `aria-hidden="true"` and `tabIndex={-1}`, because the
card's link text carries the meaning and an announced video is noise.

Every overlay, gradient and divider is `aria-hidden`. Icons inside labelled buttons are
`aria-hidden` too — the button's `aria-label` is the accessible name.

**Captions are supported** through a typed slot:

```tsx
export type Caption = { src: string; srcLang: string; label: string; default?: boolean };

<video …>
  {captions.map((c) => (
    <track key={c.srcLang} kind="captions" src={c.src}
           srcLang={c.srcLang} label={c.label} default={c.default} />
  ))}
</video>
```

> Reference: `components/ui/VideoPlayer.tsx:13-18, 185-194`.

**Honest status: the slot exists and no `.vtt` files were ever authored.** Ambient loops are
silent so captions are moot for them; the one speech video shipped without them. **For a
school site this is not acceptable** — any clip with speech needs captions, both for
accessibility and because most embedded playback is muted.

## 2.5 Boilerplate

The source's own architecture is **one video component for the whole site** — which is why
the hydration fix had to be made *once*. Reproduce that: a single `<MediaVideo />`
primitive, then thin composition wrappers. Dependencies: `react`, `framer-motion`
(`useReducedMotion` only), `lucide-react` (icon — swap freely).

### `<MediaVideo />` — the one primitive

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

export type MediaVideoProps = {
  src: string;
  /** Frame cut 10–30% into the clip — never frame 0. */
  poster: string;
  /** Sentence describing what is on screen. Required: it is the a11y name. */
  description: string;
  /** "ambient" = autoplay muted loop. "feature" = poster + play button, nothing preloaded. */
  mode?: "ambient" | "feature";
  /**
   * ONLY the above-the-fold hero should preload eagerly. Everything else fetches
   * when the observer fires — the difference between a 2 MB and a 22 MB page (§5.2).
   */
  isHero?: boolean;
  /** WebVTT tracks. Required if the clip contains speech. */
  captions?: { src: string; srcLang: string; label: string; default?: boolean }[];
  /** Aspect/size utilities. Hero: "h-full w-full". Section: "aspect-[16/9] w-full". */
  className?: string;
};

export default function MediaVideo({
  src, poster, description, mode = "ambient", isHero = false,
  captions = [], className = "",
}: MediaVideoProps) {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Autoplay is opt-out under reduced motion: poster + play button instead.
  const autoAllowed = mode === "ambient" && !prefersReduced;

  const [ready, setReady] = useState(false);      // first frame decoded → cross-fade
  const [started, setStarted] = useState(false);  // playback initiated
  const [blocked, setBlocked] = useState(false);  // play() promise rejected

  // ① Close the hydration race: `loadeddata` may fire before React attaches its
  //    handler. readyState is state, not an event, so it cannot be missed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 2) setReady(true);        // HAVE_CURRENT_DATA
    if (!v.paused) setStarted(true);
  }, []);

  // ② Play while visible, pause when scrolled away (battery + main thread).
  useEffect(() => {
    if (!autoAllowed) return;
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // preload="none" means nothing has been fetched yet — kick it off now.
          if (v.preload === "none" && v.readyState === 0) v.load();
          setStarted(true);
          v.muted = true;                          // ③ imperative: React may not have flushed
          const p = v.play();
          if (p !== undefined) {                   // ④ old browsers return void
            p.then(() => setBlocked(false)).catch(() => setBlocked(true));  // ⑤ never unhandled
          }
        } else {
          v.pause();
        }
      },
      { rootMargin: "100px", threshold: 0.15 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [autoAllowed]);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.muted = true;
    v.play().then(() => setBlocked(false)).catch(() => {});
  }, []);

  const showPoster = !(ready && started);

  return (
    <div ref={wrapRef} className={`group relative overflow-hidden ${className}`}
         style={{ background: "var(--surface-inverse)" }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        autoPlay={autoAllowed}     // native start, before any JS runs
        loop={mode === "ambient"}
        playsInline                // without this, iOS opens the fullscreen system player
        preload={isHero && autoAllowed ? "auto" : "none"}
        aria-label={description}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}   // second signal if hydration lands between events
        className="h-full w-full object-cover transition-opacity"
        style={{ opacity: ready && started ? 1 : 0,
                 transitionDuration: "var(--duration-fade, 500ms)" }}
      >
        {captions.map((c) => (
          <track key={c.srcLang} kind="captions" src={c.src}
                 srcLang={c.srcLang} label={c.label} default={c.default} />
        ))}
      </video>

      {/* Poster layer — cross-fades out; the native `poster` attribute cuts hard. */}
      <div aria-hidden className="absolute inset-0 bg-cover bg-center transition-opacity"
           style={{ backgroundImage: `url(${poster})`, opacity: showPoster ? 1 : 0,
                    pointerEvents: showPoster ? undefined : "none",
                    transitionDuration: "var(--duration-fade, 500ms)" }} />

      {/* Autoplay refused, reduced motion, or feature mode: an explicit play button. */}
      {(blocked || !autoAllowed) && !started && (
        <button type="button" onClick={play} aria-label={`Play — ${description}`}
                className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border
                           backdrop-blur-sm transition-transform duration-300 hover:scale-105
                           md:h-20 md:w-20"
                style={{ borderColor: "rgb(255 255 255 / 0.5)", background: "rgb(0 0 0 / 0.4)",
                         color: "var(--text-on-media)" }}>
            {/* ms-0.5 optically centres a triangle inside a circle */}
            <Play size={22} aria-hidden className="ms-0.5 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
```

### `<HeroVideo />` — layout + copy, composing the primitive

```tsx
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import MediaVideo from "@/components/ui/MediaVideo";

export type HeroVideoProps = {
  videoSrc: string;
  posterSrc: string;
  /** Required: becomes the video's accessible name. */
  videoDescription: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Where the legibility gradient darkens. Match your text placement. */
  overlayGradientDirection?: "to-bottom" | "to-top" | "to-inline-end";
  scrollCueHref?: string;
  scrollCueLabel?: string;
  captions?: { src: string; srcLang: string; label: string; default?: boolean }[];
};

/** Gradients live here so the component makes one visual decision, not many. */
const GRADIENTS = {
  "to-bottom":     "linear-gradient(rgb(0 0 0 / 0) 40%, rgb(0 0 0 / 0.55) 100%)",
  "to-top":        "linear-gradient(rgb(0 0 0 / 0.55) 0%, rgb(0 0 0 / 0) 60%)",
  "to-inline-end": "linear-gradient(90deg, rgb(0 0 0 / 0.6) 0%, rgb(0 0 0 / 0) 65%)",
} as const;

export default function HeroVideo({
  videoSrc, posterSrc, videoDescription, eyebrow, title, subtitle,
  ctaPrimary, ctaSecondary, overlayGradientDirection = "to-bottom",
  scrollCueHref, scrollCueLabel = "Scroll to the next section", captions = [],
}: HeroVideoProps) {
  return (
    // `svh` excludes retracting mobile chrome; `100vh` puts the CTAs under the URL bar.
    <section className="relative flex min-h-svh items-end overflow-hidden">
      <div className="absolute inset-0">
        <MediaVideo
          src={videoSrc} poster={posterSrc} description={videoDescription}
          mode="ambient"
          isHero                       // the ONLY place preload="auto" is correct
          captions={captions}
          className="h-full w-full"
        />
      </div>

      {/* Decorative → aria-hidden + pointer-events-none, or they eat clicks. */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
           style={{ background: GRADIENTS[overlayGradientDirection] }} />
      {/* Top scrim so a transparent site header stays readable over bright footage. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44"
           style={{ background: "linear-gradient(rgb(0 0 0 / 0.7), rgb(0 0 0 / 0))" }} />

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 pb-20 text-center md:px-8 md:pb-24">
        {eyebrow && (
          <p className="eyebrow text-shadow-media" style={{ color: "var(--accent)" }}>{eyebrow}</p>
        )}
        <h1 className="heading-display text-shadow-media mx-auto mt-5 max-w-4xl text-display"
            style={{ color: "var(--text-on-media)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-shadow-media mx-auto mt-5 max-w-xl text-body font-light"
             style={{ color: "var(--text-on-media)" }}>
            {subtitle}
          </p>
        )}

        {(ctaPrimary || ctaSecondary) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {ctaPrimary && <a href={ctaPrimary.href} className="btn btn-primary btn-lg">{ctaPrimary.label}</a>}
            {ctaSecondary && <a href={ctaSecondary.href} className="btn btn-outline-on-media btn-lg">{ctaSecondary.label}</a>}
          </div>
        )}

        {scrollCueHref && (
          <a href={scrollCueHref} aria-label={scrollCueLabel}   /* a real link — keyboard reachable */
             className="mt-12 inline-flex animate-bounce transition-colors motion-reduce:animate-none"
             style={{ color: "var(--text-on-media-muted)" }}>
            <ChevronDown size={26} aria-hidden />
          </a>
        )}
      </div>
    </section>
  );
}
```

```tsx
<HeroVideo
  videoSrc="/videos/campus-tour.mp4"
  posterSrc="/images/posters/campus-tour.jpg"
  videoDescription="Aerial view of the main courtyard between classes"
  eyebrow="Since 1954"
  title="A school where curiosity comes first"
  subtitle="Nursery through upper secondary, on one campus."
  ctaPrimary={{ label: "Book a visit", href: "/visit" }}
  ctaSecondary={{ label: "Our programmes", href: "/programmes" }}
  scrollCueHref="#intro"
/>
```

---

# 3 — Pattern #2: Stacking timeline

> Source: `components/sections/StackingTimeline.tsx` (187 lines), consumed by a history page
> that builds the item array server-side.

## 3.1 The concept — for a designer

Each milestone is a **full-height panel pinned to the top of the viewport**. As you scroll,
the next panel slides up from below and covers the current one, like dealing cards onto a
pile. The panel being covered simultaneously **shrinks slightly, drifts upward and dims**,
so it reads as receding into the background rather than being hidden. Because every panel
pins at the same offset, the effect is one continuous vertical motion with no scroll jumps
— the content changes while the frame stays still.

Two structural details make it legible rather than confusing:

- Every panel after the first has a **rounded top edge, a top hairline and an upward-cast
  shadow**, so its edge is visible against the panel underneath even when both share the
  same background. **Without this the effect is invisible on a monochrome palette.**
- The **last panel never transforms**, so the sequence settles on a clean final state
  instead of fading out at the bottom of the page.

## 3.2 The structure

**Data shape** — plain serialisable objects, built on the server:

```ts
export type TimelineItem = {
  /** Large display string. Not necessarily a number: "1954", "Today", "2030". */
  year: string;
  /** Short ordinal marker: "I", "02", "A". */
  numeral: string;
  /** Pre-rendered — server components cannot pass functions across the boundary. */
  label: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
};
```

```tsx
const MILESTONES = [
  { key: "founding",  numeral: "I",   image: "/images/history/1954.jpg" },
  { key: "expansion", numeral: "II",  image: "/images/history/1972.jpg" },
  { key: "today",     numeral: "III", image: undefined },
] as const;

const items: TimelineItem[] = MILESTONES.map((m, i) => ({
  year: t(`timeline.${m.key}.year`),
  numeral: m.numeral,
  label: t("chapter", { n: i + 1 }),         // computed on the server, passed as a string
  title: t(`timeline.${m.key}.title`),
  body: t(`timeline.${m.key}.body`),
  image: m.image ? { src: m.image, alt: t(`timeline.${m.key}.imageAlt`) } : undefined,
}));
```

> Reference: `components/sections/StackingTimeline.tsx:13-21`,
> `app/[locale]/notre-histoire/page.tsx:24-58` (structure; content strings replaced).

**DOM structure** — an ordered list, because it *is* a sequence:

```
<div position: relative>                  ← stacking context + progress rail anchor
  ├── <div fixed>                         ← progress rail (desktop only, aria-hidden)
  └── <ol>                                ← scroll target for overall progress
        ├── <li sticky; top: 0; z-index: 1>  <motion.article min-height: 100svh>
        ├── <li sticky; top: 0; z-index: 2>  <motion.article>
        └── <li sticky; top: 0; z-index: 3>  <motion.article>
```

**Three rules that make it work:**

1. **`position: sticky` on the `<li>`, not on the panel.** The list item is the sticky
   container; the panel inside is what animates. Transforming a sticky element directly
   creates a containing block and breaks stickiness.
2. **`z-index: index + 1`**, ascending, so later panels paint over earlier ones. Without an
   explicit z-index, DOM order gives the same result *only* until a transform creates a
   stacking context — then it breaks unpredictably.
3. **`min-height: 100svh` per panel**, so the sequence's scroll distance is `n × 100svh`.
   Panels shorter than the viewport make two visible at once and the effect collapses.

**Stacking depth.** In the source all panels are opaque and full-height, so **exactly one is
visible at a time** — depth is felt through the 28px drift and the incoming panel's rounded
edge, not by seeing several panels. For visible depth (2–3 receding edges peeking above),
increase the sticky offset with index instead of a constant `0`:

```tsx
style={{ top: `${stickyOffset + Math.min(index, stackDepth) * 12}px`, zIndex: index + 1 }}
```

That is the `stackDepth` prop in §3.5. `stackDepth = 0` reproduces the source exactly.

## 3.3 The animation logic

Framer Motion does **one thing**: map each panel's scroll progress to three transforms. No
timeline library, no ScrollTrigger, no manual scroll listener on the panels.

```tsx
const ref = useRef<HTMLLIElement>(null);

// 0 while this panel owns the screen → 1 once fully covered by the next.
//   "start start" = panel top meets viewport top    (progress 0)
//   "end start"   = panel bottom meets viewport top (progress 1)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

const scale   = useTransform(scrollYProgress, [0, 1],       [1, 0.94]);
const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.55, 0.35]);
const y       = useTransform(scrollYProgress, [0, 1],       [0, -28]);

// No transform under reduced motion, and never on the last panel.
<motion.article style={prefersReduced || isLast ? undefined : { scale, opacity, y }} />
```

> Reference: `components/sections/StackingTimeline.tsx:43-71`.

| Value | Reasoning |
|---|---|
| `scale 1 → 0.94` | 6 % is the largest reduction that still reads as "receding" rather than "shrinking". Past ~0.9 the panel edges become visibly inset and the illusion breaks. |
| `opacity 1 → 0.55 → 0.35` | **Three keyframes, not two.** Most of the dimming happens in the first 75 %, so the panel is backgrounded *before* it is covered. A linear fade reads as a crossfade instead of a recession. |
| `y 0 → -28px` | Small upward drift. With the scale it reads as depth — distant things move less and sit higher in perspective. Larger values open a visible gap at the panel bottom. |
| `offset: ["start start", "end start"]` | Progress is driven by the panel's own travel through the viewport, so the mapping is identical at any panel height or viewport size. |
| `isLast` exclusion | Otherwise the final panel dims to 0.35 with nothing covering it, and the page appears to fade out. |

**Easing: none, deliberately.** These are scroll-linked, so the user's scroll velocity *is*
the curve. Adding easing to a scroll-linked value produces the classic rubber-band lag where
content keeps moving after the user stops. Easing belongs on discrete reveals
(`RevealOnScroll`, §1.7).

**The progress rail** (optional, desktop only). Here a spring *is* right, because it tracks
aggregate progress rather than a physical position:

```tsx
const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });
const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

useEffect(() => {
  // Subscribe to the motion value — NOT a React state update per frame.
  // setActive only fires when the derived index actually changes.
  return scrollYProgress.on("change", (v) => {
    setActive(Math.min(items.length - 1, Math.floor(v * items.length)));
  });
}, [scrollYProgress, items.length]);

<motion.span style={{ scaleY: prefersReduced ? 1 : fill, background: "var(--accent)" }}
             className="absolute inset-0 origin-top" />
```

> Reference: `components/sections/StackingTimeline.tsx:136-173`. Note `scaleY` on a
> 1px-wide element rather than animating `height` — scale runs on the compositor, height
> relayouts every frame.

**Mobile: the same effect, and it works.** `position: sticky` is supported across mobile
browsers; the source measured **CLS 0.001** at 375px. Three concessions: panels are
`min-h-[88svh]` below `md` (the 12 % sliver of the next panel cues that scrolling
continues), the progress rail is `hidden lg:flex`, and the grid collapses to stacked blocks.

**No horizontal swipe fallback, deliberately.** A swipe carousel is a *different*
interaction with different affordances and a separate a11y contract. Reusing vertical
scroll keeps one mental model and one code path. **Do the same.**

**Vanilla fallback:** drop the transforms, keep the sticky stack — the effect degrades to
hard panel changes, less refined but coherent. Or, as progressive enhancement:

```css
@supports (animation-timeline: view()) {
  .timeline-panel {
    animation: recede linear both;
    animation-timeline: view();
    animation-range: exit-crossing 0% exit-crossing 100%;
  }
  @keyframes recede { to { transform: scale(0.94) translateY(-28px); opacity: 0.35; } }
}
```

## 3.4 Typography hierarchy

| Role | Size | Notes |
|---|---|---|
| **Year** | Your **display-XL** step — the largest thing on the page | Fluid clamp, never fixed px |
| **Label + numeral** | Eyebrow / overline, uppercase, wide tracking | Above the title |
| **Title** | Your **h2** step | Display family |
| **Body** | Body step, `max-w-xl` | Long-form, comfortable measure |

**The year must be a fluid clamp.** The source ships:

```css
font-size: clamp(3.5rem, 13vw, 9.5rem);
line-height: 0.82;
letter-spacing: 0.01em;
```

> Reference: `components/sections/StackingTimeline.tsx:83`.

`13vw` is what stops a four-glyph year (`2000`) overflowing its column at intermediate
widths; `9.5rem` caps it on ultra-wide screens; `3.5rem` keeps it dominant on mobile.
`line-height: 0.82` (sub-1) tightens the block so it reads as a graphic element rather than
a line of text. **In your project, express this as your own display-XL token.** If that is
`clamp(3rem, 11vw, 8rem)`, use that. Do not hardcode 240px.

**The year is `aria-hidden`** — it repeats the label ("Chapter I — 1954"), and a screen
reader announcing "one nine five four" as a heading is noise.

Desktop layout: a 12-column grid split **5 / gutter / 6** (`col-span-5` then
`col-span-6 col-start-7`), not 6/6 — the deliberate one-column gutter stops the year and
the prose crowding each other. > Reference: `components/sections/StackingTimeline.tsx:78-114`.

## 3.5 Boilerplate — `<StackingTimeline />`

Dependencies: `react`, `framer-motion`, `next/image` (swap for `<img>` if not on Next).

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export type TimelineItem = {
  year: string;      // "1954", "Today", "2030"
  numeral: string;   // "I", "02"
  label: string;     // pre-rendered on the server
  title: string;
  body: string;
  image?: { src: string; alt: string };
};

export type StackingTimelineProps = {
  items: TimelineItem[];
  /** Sticky offset for the FIRST panel. Set to your fixed header height. */
  stickyOffset?: number;
  /** How many panels may peek above the current one. 0 = one visible at a time. */
  stackDepth?: number;
  /** Scale + fade receding panels. false = they stay fully opaque behind. */
  dimOnRecede?: boolean;
  /** Screen-reader name for the progress rail. Omit the prop to omit the rail. */
  progressLabel?: string;
};

function TimelinePanel({
  item, index, total, stickyOffset, stackDepth, dimOnRecede,
}: {
  item: TimelineItem; index: number; total: number;
  stickyOffset: number; stackDepth: number; dimOnRecede: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const prefersReduced = useReducedMotion();

  // 0 while this panel owns the screen → 1 once fully covered by the next.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  // Three keyframes: most dimming happens early, so the panel is backgrounded
  // BEFORE it is covered. A linear fade reads as a crossfade.
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.55, 0.35]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -28]);

  const isLast = index === total - 1;
  // The last panel must never transform: nothing covers it, so a dimmed final
  // state reads as the page fading out.
  const animate = dimOnRecede && !prefersReduced && !isLast;

  return (
    <li
      ref={ref}
      className="sticky list-none"
      style={{
        // Constant offset = one panel at a time (source behaviour).
        // Increasing offset = a visible stack of receding panel edges.
        top: stickyOffset + Math.min(index, stackDepth) * 12,
        zIndex: index + 1,   // explicit: transforms create stacking contexts
      }}
    >
      <motion.article
        style={{ ...(animate ? { scale, opacity, y } : {}), background: "var(--surface)" }}
        className={[
          "relative flex min-h-[88svh] items-center overflow-hidden md:min-h-svh",
          // CRITICAL: without a visible top edge the stack is invisible when every
          // panel shares the same background colour.
          index === 0 ? "" : "rounded-t-2xl border-t shadow-[0_-28px_60px_-28px_rgb(0_0_0/0.45)]",
        ].join(" ")}
        data-stacked={index === 0 ? undefined : true}
      >
        <div className="relative mx-auto grid w-full max-w-screen-2xl gap-8 px-4 py-16
                        md:px-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Year — aria-hidden: the label already carries this information. */}
          <div className="lg:col-span-5">
            <p aria-hidden
               className="heading-display text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.82] tracking-[0.01em]"
               style={{ color: "var(--accent)" }}>
              {item.year}
            </p>
          </div>

          {/* col-start-7 against col-span-5 leaves a one-column gutter. */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow flex items-center gap-3">
              <span className="font-display not-italic">{item.numeral}</span>
              <span aria-hidden className="h-px w-8" style={{ background: "var(--border-subtle)" }} />
              {item.label}
            </p>
            <h3 className="heading-display mt-4 text-h2" style={{ color: "var(--text-primary)" }}>
              {item.title}
            </h3>
            <p className="mt-5 max-w-xl text-body font-light" style={{ color: "var(--text-secondary)" }}>
              {item.body}
            </p>

            {item.image && (
              <div className="relative mt-8 aspect-[16/10] w-full max-w-xl overflow-hidden rounded-lg">
                <Image src={item.image.src} alt={item.image.alt} fill
                       sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </li>
  );
}

export default function StackingTimeline({
  items, stickyOffset = 0, stackDepth = 0, dimOnRecede = true, progressLabel,
}: StackingTimelineProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    // Subscribe rather than re-render per frame: setActive fires only when the
    // derived index actually changes.
    return scrollYProgress.on("change", (v) => {
      setActive(Math.min(items.length - 1, Math.floor(v * items.length)));
    });
  }, [scrollYProgress, items.length]);

  return (
    <div className="relative">
      {progressLabel && (
        <div aria-hidden
             className="pointer-events-none fixed top-1/2 z-30 hidden -translate-y-1/2
                        flex-col items-center gap-4 ltr:right-6 rtl:left-6 lg:flex">
          <span className="text-caption" style={{ color: "var(--accent-strong)" }}>
            {items[active]?.numeral}
          </span>
          <span className="relative h-40 w-px" style={{ background: "var(--border-subtle)" }}>
            {/* scaleY runs on the compositor; animating height would relayout. */}
            <motion.span style={{ scaleY: prefersReduced ? 1 : fill, background: "var(--accent)" }}
                         className="absolute inset-0 origin-top" />
          </span>
          <span className="sr-only">{progressLabel}</span>
        </div>
      )}

      {/* <ol>: this IS an ordered sequence — the semantics come free. */}
      <ol ref={listRef} className="relative">
        {items.map((item, i) => (
          <TimelinePanel key={`${item.year}-${i}`} item={item} index={i} total={items.length}
                         stickyOffset={stickyOffset} stackDepth={stackDepth} dimOnRecede={dimOnRecede} />
        ))}
      </ol>
    </div>
  );
}
```

Add the stacked-panel border colour once, globally:

```css
[data-stacked] { border-color: color-mix(in srgb, var(--accent) 25%, transparent); }
```

```tsx
<StackingTimeline items={milestones} stickyOffset={72} stackDepth={0} dimOnRecede
                  progressLabel="Progress through the school's history" />
```

**Responsive recap:** `<768px` 88svh, single column, no rail · `768–1023` 100svh, single
column, no rail · `≥1024px` 12-column grid (5 / gutter / 6) with the rail.

---

# 4 — Pattern #3: Content cards with video preview

> Source: `components/ui/Card.tsx:21-145`, `components/sections/ProjectsGrid.tsx`,
> `lib/projects.ts`.

## 4.1 The composition

**Grid — deliberately simple.** One column below `md`, three from `md` up. No intermediate
2-column tier:

```tsx
<div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
  {items.map((item, i) => (
    <RevealOnScroll key={item.slug} delay={i * 0.12}>
      <ContentCard {...item} className="aspect-[4/5]" />
    </RevealOnScroll>
  ))}
</div>
```

> Reference: `components/sections/ProjectsGrid.tsx:27-42`.

A `sm` 2-column tier was rejected: **a 4:5 card at half of a 640px viewport is 320×400**, so
the overlay text block occupies most of the card and the image stops communicating.
One-then-three is more robust. With 4+ items, add `lg:grid-cols-4` rather than an `sm` tier.

**Section header** — title block and a "see all" action on the same baseline:

```tsx
<RevealOnScroll className="flex flex-wrap items-end justify-between gap-6">
  <div>
    <p className="eyebrow" style={{ color: "var(--accent-strong)" }}>{eyebrow}</p>
    <h2 className="heading-display mt-3 max-w-xl text-h2">{title}</h2>
  </div>
  <a href="/all" className="btn btn-outline">See all</a>
</RevealOnScroll>
```

`items-end` aligns the button with the heading's baseline, not its box — the detail that
separates a designed header from a flexbox default.

**Aspect ratio `4/5`, set via `className`, not baked in**, so the same component serves a
16:9 layout elsewhere. Portrait is chosen because the overlay stack (eyebrow + title +
description + affordance) needs vertical room.

**Overlay: everything bottom-aligned over the media.**

```
┌────────────────────────┐
│ [badge]                │  absolute top-start, optional
│                        │
│        media           │  object-cover, fills the card
│                        │
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │  gradient begins ~mid-card
│ EYEBROW                │
│ Title                  │  absolute bottom, p-6 (p-8 from md)
│ Description            │
│ (→)                    │
└────────────────────────┘
```

**The three-stop gradient is the important detail:**

```css
linear-gradient(to top, rgb(0 0 0 / 0.85) 0%, rgb(0 0 0 / 0.20) 50%, rgb(0 0 0 / 0) 100%)
```

Text sits on near-solid darkness, mid-card is lightly veiled, the top is untouched. A
two-stop gradient either washes out the whole image or leaves the first line illegible
against a bright frame. > Reference: `components/ui/Card.tsx:122-142`.

**The whole card is one link** — not "image links, title links, button links". One tab stop,
one large touch target, no duplicate links to the same destination announced by a screen
reader. The circular arrow is a `<span>`, purely visual.

## 4.2 The video-on-card system

**Problem:** three cards each wanting motion. Pointing them at the hero files means **~28 MB**
of video fetched to render a homepage grid.

**Solution:** a dedicated preview clip per card. Measured, from the shipped files:

| File | Size | Duration | Resolution | Audio |
|---|---|---|---|---|
| Card preview A | 195 887 B (191 KB) | 6.0 s | 640×274 | none |
| Card preview B | 174 659 B (171 KB) | 4.6 s | 640×274 | none |
| Card preview C | 192 370 B (188 KB) | 6.0 s | 640×274 | none |

**~550 KB replacing ~28 MB — a 50× reduction.**

> Reference: `HANDOFF-ANALYSIS.md:393-404`; re-verified with `ffprobe` at extraction time
> (H.264 High, level 3.0, `yuv420p`, 30 fps, ~257 kbit/s, no audio stream present).

**Five rules a card preview must satisfy:**

1. **Loop-safe.** It repeats while the card is on screen. Pick a segment whose last frame is
   close to its first — a continuous drift or slow pan, never a cut or a fade to black.
2. **4–6 seconds.** Long enough not to feel like a GIF, short enough to stay in budget.
3. **Under 250 KB.** The whole point. Three cards ≈ 600 KB, comparable to one photo.
4. **No audio track at all.** Not "muted" — the stream must be *absent* (`-an`). An unused
   AAC track is dead weight and some browsers still allocate a decoder.
5. **`+faststart`.** Moves the MP4 index (`moov` atom) to the front so playback can begin
   before the file has fully arrived. Without it a progressive MP4 waits for the whole file.

### The ffmpeg pipeline

**[reconstructed]** — the source records the encode *parameters* (`PHASE-2A-SUMMARY.md:18-21`:
two-pass H.264, audio stripped, `+faststart`, posters cut at 10–30 %) and the resulting
files, but not the shell history. These commands were derived from those notes plus
`ffprobe` output on the shipped files, and reproduce them. Copy-paste ready.

```bash
# ─────────────────────────────────────────────────────────────────────────────
# CARD PREVIEW — two-pass H.264, silent, loop-safe, ~200 KB
#   START  timestamp of a loop-safe segment (find one first — see below)
#   DUR    4–6 seconds
#   W      output width; -2 keeps the height even and the aspect intact
#   KBPS   250k @ 640px ≈ 190 KB for 6 s
# ─────────────────────────────────────────────────────────────────────────────
IN=source-master.mp4
OUT=public/videos/programme-a/card-preview.mp4
START=00:00:12; DUR=6; W=640; KBPS=250

# Pass 1 — analysis only, no output file.
ffmpeg -y -ss "$START" -t "$DUR" -i "$IN" \
  -vf "scale=${W}:-2,fps=30" \
  -c:v libx264 -profile:v high -level 3.0 -pix_fmt yuv420p \
  -b:v "${KBPS}k" -pass 1 -an -f null /dev/null

# Pass 2 — the real encode.
ffmpeg -ss "$START" -t "$DUR" -i "$IN" \
  -vf "scale=${W}:-2,fps=30" \
  -c:v libx264 -profile:v high -level 3.0 -pix_fmt yuv420p \
  -b:v "${KBPS}k" -pass 2 \
  -an \                      # strip audio entirely — not just silence it
  -movflags +faststart \     # moov atom first: playback starts before full download
  -g 60 \                    # keyframe every 2 s at 30 fps — clean loop restarts
  "$OUT"

rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
```

On Windows PowerShell use `NUL` instead of `/dev/null` and drop the `$` variable syntax.

```bash
# CARD POSTER — cut from ~30% INTO THE PREVIEW ITSELF, never the master, never frame 0.
# A poster from a different moment makes the card visibly jump when the loop starts.
ffmpeg -ss 1.8 -i public/videos/programme-a/card-preview.mp4 \
  -frames:v 1 -q:v 3 public/images/posters/programme-a-card.jpg

# FIND A LOOP-SAFE SEGMENT — one frame per second, then eyeball the contact sheet
# for a window whose first and last frames nearly match.
ffmpeg -i source-master.mp4 -vf fps=1,scale=320:-2 -q:v 5 /tmp/frames/f%03d.jpg

# VERIFY — expect exactly ONE stream, codec_type=video. Any audio → re-encode with -an.
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,bit_rate \
        -show_entries format=duration,size -of default=noprint_wrappers=1 \
        public/videos/programme-a/card-preview.mp4
```

Section and hero videos use the same two-pass approach with different caps — 1080p, ≤ 5 MB
section, ≤ 10 MB hero, audio stripped wherever the surface autoplays.

### The data schema

```ts
// lib/content-items.ts
export type ContentItem = {
  id: string;
  slug: string;
  status?: "current" | "archived";        // optional status chip on the card

  /** Full-weight media for the item's own page. */
  hero: { video: string; poster: string };

  /** 4–6s silent loop (<250 KB) that autoplays inside the card. */
  cardPreview?: string;

  /**
   * Still for the card, cut from ~30% into `cardPreview` ITSELF. Without it the
   * card falls back to the hero poster, which is a different moment and makes
   * the card visibly jump when the loop starts.
   */
  cardPoster?: string;
};
```

> Reference: `lib/projects.ts:20-54`. The `cardPoster` comment is quoted almost verbatim
> from the source — it documents a real visual bug, and it is what stops a future
> maintainer deleting the field.

Wiring, note the fallback chain:

```tsx
<ContentCard
  href={`/programmes/${item.slug}`}
  posterImage={item.cardPoster ?? item.hero.poster}   // fallback, never undefined
  previewVideo={item.cardPreview}
/>
```

> Reference: `components/sections/ProjectsGrid.tsx:32-34`.

### How the card switches between poster and video

**Not on hover. On viewport entry, desktop and mobile alike** — hover excludes touch
devices, where most traffic is.

```tsx
const [allowed, setAllowed] = useState(false);   // may this card animate at all?
const [playing, setPlaying] = useState(false);   // is it playing right now?

// Decide ONCE on the client. Three gates, all must pass.
useEffect(() => {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  setAllowed(Boolean(video) && !prefersReduced && !conn?.saveData);
}, [video, prefersReduced]);
```

> Reference: `components/ui/Card.tsx:52-83`.

**Three gates before a single byte is fetched:** the item has a preview; the user has not
asked for reduced motion; the browser is not signalling Save-Data. **The Save-Data check is
the most frequently omitted one in card-video implementations, and the one that matters
most on metered connections.**

`allowed` is computed in an effect, not during render, because `navigator.connection` does
not exist on the server — reading it during render is a hydration mismatch.

**The cross-fade.** Both layers stay mounted; only opacity changes, so there is no layout
shift and no re-decode. `preload="none"` here is deliberate and the opposite of the hero —
the observer's `play()` triggers the fetch, and the 200px `rootMargin` buys the head start.

⚠️ **Do this better than the source.** The shipped previews are **640×274 (2.33:1)** displayed
in a **4:5 portrait** card. With `object-cover` the browser crops the sides and upscales
heavily — a 400px-wide card needs ~1170px of video width to cover its height. **Encode the
preview at the ratio the card actually displays.** For a 4:5 card:

```bash
-vf "crop=ih*4/5:ih,scale=512:-2,fps=30"
```

## 4.3 Hover micro-interactions

Four coordinated changes, all driven by one `group` class on the card root:

| Change | Value | Why |
|---|---|---|
| Media zoom | `scale(1.04)` over `700ms ease-out` | 4 % is perceptible without visible resampling |
| Affordance border | transparent → `var(--accent)`, `300ms` | Faster than the zoom: the interactive element responds first |
| Affordance icon | inherit → `var(--accent)`, `300ms` | Same timing as its border |
| Elevation | optional shadow step | Use your existing elevation token |

**The critical structural rule: the card does not scale — its contents do, inside an
`overflow-hidden` wrapper.** Scaling the card would resample the **text**, shift
**neighbours** in the grid, and scale the **shadow**, producing a visible seam. Scaling only
the media inside `overflow-hidden` keeps the box, border and text perfectly stable while the
image breathes. **Both media layers get the same transform**, so hovering mid-cross-fade
does not desynchronise them.

**Timing:** `ease-out` for hover (fast start, gentle settle — responds instantly to input);
`cubic-bezier(0.22, 1, 0.36, 1)` for entrance reveals. **Never `ease-in` on hover** — it
feels laggy because nothing happens for the first 100 ms. Durations: `700ms` transforms,
`300ms` colour, `500ms` media cross-fades. Three values, applied consistently.

## 4.4 Accessibility

- **One anchor per card** → one tab stop, one target, one announcement.
- **Focus ring** comes from the global `:focus-visible` rule. **Test it:** tab through the
  grid; if the ring is invisible against dark media, add
  `focus-visible:outline-offset-[-3px]` so it draws *inside* the card.
- **Decorative video:** `aria-hidden="true"` **and** `tabIndex={-1}`. Without `tabIndex`
  some browsers put the video in the tab order and the user lands on an invisible control.
- **Alt text on the poster describes the image**, not the destination. The link's accessible
  name comes from the heading inside it.
- **Badges are real text**, never colour alone.
- **Reduced motion / Save-Data:** the video is never mounted; static poster only.
- **Touch:** because playback is viewport-driven, touch users get the same experience. Do
  not add a `:hover` fallback for touch.

## 4.5 Boilerplate — `<ContentCard />`

Dependencies: `react`, `framer-motion` (`useReducedMotion`), `next/image`, `lucide-react`.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";

export type ContentCardProps = {
  href: string;
  /** Still shown when idle. Pass cardPoster ?? heroPoster — never undefined. */
  posterImage: string;
  /** Describes the IMAGE, not the destination. */
  imageAlt: string;
  /** 4–6s silent loop under 250 KB. Omit for a static card. */
  previewVideo?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional status chip, top-start. Must be text — never colour alone. */
  badgeText?: string;
  sizes?: string;
  /** Aspect ratio and grid placement, e.g. "aspect-[4/5]". */
  className?: string;
  priority?: boolean;
};

export default function ContentCard({
  href, posterImage, imageAlt, previewVideo, eyebrow, title, description, badgeText,
  sizes = "(max-width: 768px) 100vw, 33vw", className = "", priority = false,
}: ContentCardProps) {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Decide ONCE on the client. In an effect, not during render: navigator.connection
  // is undefined on the server and reading it while rendering is a hydration mismatch.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setAllowed(Boolean(previewVideo) && !prefersReduced && !conn?.saveData);
  }, [previewVideo, prefersReduced]);

  // Autoplay while visible. Viewport-driven, NOT hover-driven: hover excludes
  // touch devices, where most traffic is.
  useEffect(() => {
    if (!allowed) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          v.muted = true;                 // imperative — React may not have flushed
          v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      // Start earlier than a hero (grids scroll fast) but require a quarter visible
      // before spending bandwidth.
      { rootMargin: "200px", threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed]);

  return (
    <a
      ref={wrapRef}
      href={href}
      // `group` drives every hover change. `overflow-hidden` clips the media zoom
      // so the CARD never scales — only its contents.
      className={`group relative block overflow-hidden ${className}`}
      style={{ background: "var(--surface-inverse)" }}
    >
      <Image src={posterImage} alt={imageAlt} fill sizes={sizes} priority={priority}
             className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]
                         ${playing ? "opacity-0" : "opacity-100"}`} />

      {allowed && previewVideo && (
        <video
          ref={videoRef}
          src={previewVideo}
          poster={posterImage}   /* same still → no flash if the loop is slow */
          muted loop autoPlay playsInline
          preload="none"         /* nothing fetched until the observer fires */
          aria-hidden="true"     /* decorative: the link text carries the meaning */
          tabIndex={-1}          /* and it must never become a tab stop */
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700
                      ease-out group-hover:scale-[1.04] ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Three stops: solid under the text, light mid-card, untouched at the top. */}
      <div aria-hidden className="absolute inset-0"
           style={{ background: "linear-gradient(to top, rgb(0 0 0 / 0.85) 0%, rgb(0 0 0 / 0.20) 50%, rgb(0 0 0 / 0) 100%)" }} />

      {badgeText && (
        <span className="eyebrow absolute top-5 rounded-full border px-3 py-1.5 backdrop-blur-sm
                         ltr:left-5 rtl:right-5"
              style={{ borderColor: "rgb(255 255 255 / 0.5)", background: "rgb(0 0 0 / 0.4)",
                       color: "var(--text-on-media)" }}>
          {badgeText}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        {eyebrow && <p className="eyebrow" style={{ color: "var(--accent)" }}>{eyebrow}</p>}
        <h3 className="heading-display mt-2 text-h3" style={{ color: "var(--text-on-media)" }}>
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-caption font-light" style={{ color: "var(--text-on-media-muted)" }}>
            {description}
          </p>
        )}
        {/* A span, not a button: the whole card is already the link. */}
        <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border
                         transition-colors duration-300 group-hover:border-[var(--accent)]
                         group-hover:text-[var(--accent)] rtl:-scale-x-100"
              style={{ borderColor: "rgb(255 255 255 / 0.4)", color: "var(--text-on-media)" }}>
          <ArrowUpRight size={18} aria-hidden />
        </span>
      </div>
    </a>
  );
}
```

---

# 5 — Pattern #4: Gallery and in-section video

> Source: `components/sections/Gallery.tsx` (159 lines),
> `components/sections/NeighbourhoodVideo.tsx`, `components/sections/AmenitiesGrid.tsx`,
> `components/sections/VideoShowcase.tsx`.

## 5.1 The gallery grid

**True masonry via CSS multi-columns**, not a grid:

```tsx
<div className="mt-12 columns-2 gap-3 md:columns-3 md:gap-4">
  {photos.map((p, i) => (
    <RevealOnScroll key={p.src} delay={(i % 3) * 0.08} className="mb-3 break-inside-avoid md:mb-4">
      <button type="button" onClick={() => setIndex(i)} aria-label={`Enlarge — ${p.alt}`}
              className={`group relative block w-full overflow-hidden
                          ${i % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 33vw"
               className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
        <span aria-hidden className="absolute inset-0 border border-transparent
                                     transition-colors duration-300 group-hover:border-[var(--accent)]" />
      </button>
    </RevealOnScroll>
  ))}
</div>
```

> Reference: `components/sections/Gallery.tsx:65-96`.

**Why columns, not grid:** mixed aspect ratios flow without leaving holes. CSS Grid with
`auto-rows` either forces a uniform ratio (cropping everything to one shape) or leaves gaps.
`break-inside-avoid` stops a photo being split across a column boundary.

**Rhythm without randomness:** `i % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"` — every fifth
item is portrait. Deterministic, so server and client agree (no hydration mismatch), and it
breaks the monotony of a uniform grid without needing per-image metadata.

**Stagger uses `(i % 3)`, not `i`**, so the delay resets each row. With plain `i` the twelfth
image waits ~1 s after entering the viewport and looks broken.

**Each item is a `<button>`**, because it opens a dialog — not a link, not a div with
onClick. Keyboard activation and screen-reader semantics come free.

### The lightbox

```tsx
const [index, setIndex] = useState<number | null>(null);

const close = useCallback(() => setIndex(null), []);
const go = useCallback(
  // Wraps in both directions without a branch.
  (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
  [photos.length],
);

useEffect(() => {
  if (index === null) return;

  // Save and restore the previous value — hardcoding "" on cleanup clobbers any
  // other lock (a modal, a mobile menu).
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape")     close();
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft")  go(-1);
  };
  window.addEventListener("keydown", onKey);

  return () => {
    document.body.style.overflow = prev;
    window.removeEventListener("keydown", onKey);
  };
}, [index, close, go]);
```

> Reference: `components/sections/Gallery.tsx:29-53`.

The overlay: `role="dialog"` + `aria-modal="true"` + `aria-label`; `autoFocus` on the close
button so focus enters the dialog and Escape/Tab work immediately; `object-contain` on the
image (**never crop in a lightbox**); and the counter (`3/9`) inside the `<figcaption>` with
the alt text, so it is announced:

```tsx
<figcaption className="mt-5 max-w-2xl text-center text-caption font-light"
            style={{ color: "var(--text-on-media-muted)" }}>
  {photos[index].alt}
  <span className="eyebrow ms-3" style={{ color: "var(--text-muted)" }}>
    {index + 1}/{photos.length}
  </span>
</figcaption>
```

Under reduced motion the overlay's fade starts at `opacity: 1` rather than animating.

> Reference: `components/sections/Gallery.tsx:99-156`.

⚠️ **Known gap to close in your implementation: there is no focus trap.** Tabbing past the
next button leaves the dialog while it is still open. `autoFocus` gets focus *in*; nothing
keeps it there. Add a trap (a focus-loop, or `inert` on the rest of the document) — a school
site should not ship this gap.

### Alt text discipline

**An alt text is a sentence describing what is in the frame, written by a human, in the
site's language.**

| ✅ | ❌ |
|---|---|
| "Students working at benches in the science lab" | "lab-1.jpg" |
| "The main courtyard seen from the library steps" | "Photo 3" |
| "Aerial view of the sports field and running track" | "" on a content image |

Alt texts are stored **with the content**, in the same file as the visible copy, so they are
reviewed and translated alongside it — not left in JSX where nobody proofreads them. In the
lightbox the alt text is **also displayed** as the caption, which makes bad alt text visible
to everyone. **Consider adopting that: it is the cheapest alt-text quality mechanism
available.**

## 5.2 The ambient video embed

An in-section video is the hero primitive with three changes: **contained aspect ratio,
rounded corners, a caption.**

```tsx
<figure className="mt-10">
  <MediaVideo src={video} poster={poster} description={videoDescription}
              mode="ambient" className="aspect-[16/9] w-full rounded-lg" />
  <figcaption className="mx-auto mt-5 max-w-2xl text-body font-light"
              style={{ color: "var(--text-muted)" }}>
    {caption}
  </figcaption>
</figure>
```

> Reference: `components/sections/NeighbourhoodVideo.tsx:38-52`.

**Ambient defaults:** `muted` (required for autoplay everywhere) · `loop` (it has no
beginning or end) · `autoPlay` · `playsInline` (without it, iOS opens the fullscreen system
player).

**Aspect ratio containment.** Always set an explicit `aspect-[x/y]` on the wrapper; the
video is `object-cover` inside it, so the box exists before the media loads and **CLS stays
0**. In use: `16/9` full-width, `4/3` beside a text column, `aspect-video` in showcase grids.

**Corner radius rule:**

| Surface | Corners |
|---|---|
| Full-bleed hero | **Sharp** — it touches the viewport edges; a radius shows background through the corners |
| In-section video | **Rounded** — it is a contained object on a page |
| Card media | Inherits the card's radius |
| Lightbox image | Sharp — `object-contain` on a dark scrim |

### ⚠️ The `preload` trade-off — a measured mistake, do not repeat it

The source's `VideoPlayer` hardcodes `preload="auto"` for **every** ambient player.
Measured consequence:

| Page | Video bytes fetched eagerly |
|---|---|
| Home | 12 024 KB |
| A page with three ambient sections | **22 254 KB** |

That page already scored **45/100** on Lighthouse performance with **3 990 ms** total
blocking time. Adding two ambient sections *below the fold* took eager fetching from ~9.6 MB
to ~22 MB, because the browser pulls `preload="auto"` sources at page load regardless of
position. > Reference: `PHASE-2A-SUMMARY.md:145-165`.

**The corrected rule — implement it from the start** (already in the §2.5 primitive):

```tsx
preload={isHero ? "auto" : "none"}
// …and in the observer, before play():
if (v.preload === "none" && v.readyState === 0) v.load();
```

The `100px`/`200px` `rootMargin` gives the fetch a head start, so the visible delay is
negligible. ~10 lines, and it is the difference between a 2 MB page and a 22 MB one.

**Second lesson from the same measurement:** several video instances on one page, each with
its own observer and decoder, contributed to the 3 990 ms TBT. **Budget at most 2–3
autoplaying videos per page**; beyond that, make the extras click-to-play.

## 5.3 The video-beneath-content pattern

Two placements, one idea: **video as proof, adjacent to the claim it proves.**

**(a) Full-width footage directly above a map.** The visitor sees the place before reading
its address: eyebrow → title → 16:9 rounded ambient video → caption in a `max-w-2xl`
measure, the whole block in `RevealOnScroll` with a `0.1s` delay so the heading lands first.
Then the map section. > Reference: `components/sections/NeighbourhoodVideo.tsx`, rendered
immediately before the map in `components/sections/ProjectPage.tsx:104-127`.

**(b) A video beside an icon grid.** The grid *asserts* a list of features; the clip *shows*
one. The strongest version of the pattern — a 3:2 column split:

```tsx
<div className={video ? "mt-12 grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-14" : "mt-12"}>
  <ul className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3
                  ${video ? "lg:col-span-3 lg:grid-cols-3" : "lg:grid-cols-4"}`}>
    {features.map((key, i) => (
      <RevealOnScroll as="li" key={key} delay={i * 0.06}>
        <span className="block" style={{ color: "var(--accent-strong)" }}>
          <Icon size={30} strokeWidth={1.5} aria-hidden />
        </span>
        <p className="eyebrow mt-4" style={{ color: "var(--text-secondary)" }}>{labelFor(key)}</p>
      </RevealOnScroll>
    ))}
  </ul>

  {video && (
    <RevealOnScroll delay={0.12} className="lg:col-span-2">
      <figure>
        <MediaVideo src={video.src} poster={video.poster} description={video.title}
                    mode="ambient" className="aspect-[4/3] w-full rounded-lg border" />
        <figcaption className="mt-3 text-caption font-light" style={{ color: "var(--text-muted)" }}>
          {video.caption}
        </figcaption>
      </figure>
    </RevealOnScroll>
  )}
</div>
```

> Reference: `components/sections/AmenitiesGrid.tsx:66-108`.

**The important idea: the layout reconfigures when the video is absent.** Without video the
icon grid goes 4-across full width; with video it goes 3-across in a 3/5 column and the video
takes 2/5. One component, two valid layouts, no empty slot. **Copy this conditional-layout
approach** — it is what stops optional media leaving holes.

**(c) Showcase: one lead video plus a grid of the rest.**

```tsx
if (videos.length === 0) return null;   // a section with no content must not render its heading
const [lead, ...rest] = videos;
// lead → full-width aspect-video (often click-to-play)
// rest → md:grid-cols-2, each aspect-video, ambient
```

> Reference: `components/sections/VideoShowcase.tsx:29-74`.

## 5.4 Boilerplate — `<AmbientVideoBlock />`

`<SectionVideo />` is just `<MediaVideo />` (§2.5) with `isHero` omitted and an aspect class
— no separate component needed. The composition worth having is the block:

```tsx
import type { ReactNode } from "react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import MediaVideo from "@/components/ui/MediaVideo";

export type AmbientVideoBlockProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  video: {
    src: string;
    poster: string;
    /** Describes what is on screen. Required — it is the a11y name. */
    description: string;
    /** Visible caption. May repeat the description; never a filename. */
    caption?: string;
  };
  /** "full" = video below the text. "beside" = side content left, video right on desktop. */
  layout?: "full" | "beside";
  aspectRatio?: string;
  /** Optional content (an icon grid, a list) rendered in the text column. */
  children?: ReactNode;
  className?: string;
};

export default function AmbientVideoBlock({
  eyebrow, title, body, video, layout = "full",
  aspectRatio = "aspect-[16/9]", children, className = "",
}: AmbientVideoBlockProps) {
  const beside = layout === "beside";

  return (
    <section className={className} style={{ background: "var(--surface-alt)" }}>
      <div className="section-y mx-auto max-w-screen-2xl px-4 md:px-8">
        <RevealOnScroll>
          {eyebrow && <p className="eyebrow" style={{ color: "var(--accent-strong)" }}>{eyebrow}</p>}
          <h2 className="heading-display mt-3 max-w-2xl text-h2" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
          {body && (
            <p className="mt-5 max-w-2xl text-body font-light" style={{ color: "var(--text-secondary)" }}>
              {body}
            </p>
          )}
        </RevealOnScroll>

        {/* The layout reconfigures around the presence of side content — no empty slots. */}
        <div className={beside ? "mt-12 grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-14" : "mt-10"}>
          {beside && children && <div className="lg:col-span-3">{children}</div>}

          <RevealOnScroll delay={0.1} className={beside ? "lg:col-span-2" : ""}>
            <figure>
              <MediaVideo
                src={video.src}
                poster={video.poster}
                description={video.description}
                mode="ambient"
                /* isHero omitted → preload="none" → fetched by the observer, not at page load */
                className={`${beside ? "aspect-[4/3]" : aspectRatio} w-full rounded-lg`}
              />
              {video.caption && (
                <figcaption className={`mt-4 text-caption font-light ${beside ? "" : "mx-auto max-w-2xl"}`}
                            style={{ color: "var(--text-muted)" }}>
                  {video.caption}
                </figcaption>
              )}
            </figure>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
```

**Alt/description requirements — enforce these:**

| Element | Requirement |
|---|---|
| `<video aria-label>` | Sentence describing what is on screen. Required prop; no default. |
| `<figcaption>` | Visible, human-facing. May repeat the description. Never a filename. |
| Decorative video (card preview) | `aria-hidden="true"` + `tabIndex={-1}`, no label |
| Gallery `<Image alt>` | Describes the frame, not the destination. Stored with the content. |
| Gradients, overlays, dividers | `aria-hidden` |
| Icon inside a labelled button | `aria-hidden` — the button's label is the name |

---

# 6 — Integration guidance for the receiving project

*Addressed to the Claude Code instance implementing these in a school website.*

## 6.1 How to adapt without copying the brand

**Rule 1 — Do not copy a single visual literal from this document.** No hex codes appear
here by design; the only colour literals are neutral black/white alphas used for scrims,
and even those should become your tokens. No font names appear. **If you catch yourself
writing a colour literal while implementing, stop and reach for a token.**

**Rule 2 — Every `var(--*)` here is a placeholder.** Map them to your existing tokens
*before* writing component code. Do the mapping once, in a table, and keep it:

```
--accent              → your primary/brand colour
--accent-strong       → its on-light variant (contrast ≥ 4.5:1 on your surface)
--surface / --surface-alt / --surface-elevated / --surface-inverse
--text-primary / --text-secondary / --text-muted
--text-on-media / --text-on-media-muted
--border-subtle · --font-display · --font-body
```

**Do not create new tokens** if your system already has equivalents under different names.
Rename the placeholder; do not add a parallel vocabulary.

**Rule 3 — Type sizes are roles, not pixel values.** The likeliest mistake in this handoff
is copying `clamp(3.5rem, 13vw, 9.5rem)` into the timeline. **Don't.** That number belongs
to another project's scale. The instruction is: *the year is your project's largest display
step*. If that is `clamp(3rem, 10vw, 7rem)`, use it. The only property worth copying
literally is `line-height: 0.82` — a sub-1 line height is what makes a large numeral read as
a graphic element, and it is scale-independent. Same for `text-h2`, `text-h3`, `text-body`,
`text-caption`, `text-eyebrow`: **role names**, map them to your steps.

**Rule 4 — Tone of voice is not transferable, and none is included.** All example copy is
placeholder. Write your own, in your school's register.

**Rule 5 — Keep the numbers that are physics, not taste.** These are tuned against human
perception and browser behaviour, and they transfer unchanged:

`scale 1 → 0.94` · `opacity 1 → 0.55 → 0.35` (the three-stop shape is the point) ·
`y 0 → -28px` · `scale(1.04)` card / `1.05` gallery hover · `700ms` transform / `300ms`
colour / `500ms` media fade · `cubic-bezier(0.22, 1, 0.36, 1)` · `rootMargin` 100px hero /
200px cards · `threshold` 0.15 / 0.25 · stagger 0.06–0.12s · `min-h-svh` not `vh` ·
`readyState >= 2`.

## 6.2 School-site adaptation hints

**Pattern #1 — Hero video** → a campus tour: an aerial pass over the grounds, a corridor at
change-over, a wide shot of the main hall.

- **Faces of minors.** Confirm photo/video consent before any recognisable pupil appears in
  a hero that autoplays to every visitor. Where consent is partial, choose footage shot from
  behind, at distance, or of spaces rather than people. This is a legal and safeguarding
  question — resolve it before encoding.
- **Silence is fine** — the hero is muted anyway. Do not pick footage that only works with
  its soundtrack.
- **Seasonality.** Bare trees in June date the site; prefer year-round footage or plan to
  re-encode termly.
- Eyebrow suits a founding year or accreditation; the two CTAs suit "Book a visit" and
  "Our programmes".

**Pattern #2 — Stacking timeline** → school history: founding, first purpose-built building,
a merger or move, a new wing, an anniversary, a forward-looking panel.

- **6–9 panels is the working range.** Each panel is one viewport of scrolling; twelve
  panels is twelve screens and readers abandon it.
- `year` takes any short string, so the final panel can be a statement of intent
  (`"2030"`, `"Next"`) rather than a date.
- **40–70 words per panel.** Longer and the panel scrolls internally, fighting the sticky
  mechanic.
- Archive photographs suit the optional `image` slot. Keep `stackDepth={0}` unless your
  panels have strongly contrasting backgrounds.

**Pattern #3 — Content cards** → programmes, key stages, specialisms, extracurricular
strands.

- `badgeText` maps well to "Ages 3–6", "New for 2026", "Open evening 14 March".
- A preview of a classroom in motion beats a posed still — but see the consent note above; a
  loop autoplaying across your homepage is the highest-exposure footage on your site.
- More than six programmes makes a long mobile column: group them, or add
  `lg:grid-cols-4` and shorten the descriptions.
- **Do not reuse this card for staff profiles** without thought — headshots in a 4:5 card
  under a dark gradient read oddly. People deserve a simpler, lighter card.

**Pattern #4 — Gallery + section video** → facilities, classroom footage, event highlights.

- The masonry grid handles mixed-format event photography well; that is exactly its job.
- "Video beside an icon grid" (§5.3b) maps directly onto a facilities list: icons for
  library / labs / sports hall / music rooms, with one clip showing the best of them.
- "Video above a map" (§5.3a) maps onto a "find us" page.
- **Captions on anything with speech.** A head teacher's welcome video needs a `.vtt`. The
  source shipped without one; do not inherit that.

## 6.3 What NOT to port

**Domain-specific commerce patterns.** The source is a property site. Its sticky bottom bar
pinning a "Book a viewing" CTA plus a messaging button to every page, its price and
availability rows, its "reserve" language, and its lead-qualification form with a budget
dropdown all fit a high-consideration purchase funnel. **A school's conversion is a visit or
an application, on a completely different timescale.** A persistent always-visible CTA bar
reads as pressure on a school site. If you want a persistent action, use one calm header
link ("Book an open day"), not a pinned bar.

**Messaging-app integration.** Deep links with pre-filled outbound message text are correct
for that market and business. For a school the equivalents are an email address, a phone
number and an enquiry form. Pre-filled messages into a personal messaging app are also a
poor fit for safeguarding-conscious institutions.

**The audience-specific section.** The source has a whole area addressed to overseas buyers
— remote viewings, notarised power of attorney, state purchase subsidies, currency transfer.
None of it has an analogue. If you need an audience-specific area (international families,
boarders), design it from that audience's actual questions, not from this structure.

**The legal/consent layer as-is.** The source implements one country's data-protection
regime: a consent banner, a declaration reference, and a legal-notices page structured
around that jurisdiction's disclosures. **Your school has its own legal context** — likely
including obligations the source never had (safeguarding policies, pupil-data handling,
different cookie rules). Get your own legal text.

**But port one piece of it exactly: the static-map pattern.** The source replaced an
embedded map iframe — which pulled 40+ third-party requests and set third-party cookies
before the visitor consented to anything — with a **flat image built from open map tiles at
deploy time, plus an explicit "Open in Maps" link** that opens in a new tab on user action.
Result: zero runtime third-party requests, no consent prerequisite, no cookie until the
visitor deliberately leaves. **A school site showing its location should do exactly this** —
it is faster, privacy-clean under any regime, and costs one image and one anchor.

```tsx
const external = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

<Image src={mapImage} alt={mapAlt} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
<p className="text-caption" style={{ color: "var(--text-muted)" }}>{attribution}</p>
<a href={external} target="_blank" rel="noopener noreferrer"
   className="mt-6 inline-flex min-h-11 items-center gap-2">
  {externalLabel} <ExternalLink size={14} aria-hidden />
</a>
```

> Reference: `components/sections/LocationMap.tsx:1-60`. Respect the tile provider's
> attribution requirement — it is a licence condition, not a courtesy.

**The i18n architecture, unless you need it.** The source is bilingual with RTL support,
which is why strings live in JSON, components take label props instead of hardcoded text,
and layout uses logical properties (`ms-`, `ps-`, `ltr:`/`rtl:`). **Keep the
logical-properties habit regardless** — it costs nothing and future-proofs you. The rest is
overhead if you are monolingual.

## 6.4 Files to create

```
styles/tokens.css                 ← your raw :root values (probably exists already)
app/globals.css                   ← imports tokens; maps to your framework; add
                                    :focus-visible, reduced-motion, .text-shadow-media, .section-y

components/
  motion/RevealOnScroll.tsx       ← §1.7, verbatim. Build FIRST — everything uses it.
  ui/MediaVideo.tsx               ← §2.5. The ONE video primitive. Build SECOND.
  ui/ContentCard.tsx              ← §4.5
  sections/HeroVideo.tsx          ← §2.5
  sections/StackingTimeline.tsx   ← §3.5
  sections/Gallery.tsx            ← §5.1 (+ the focus trap the source lacks)
  sections/AmbientVideoBlock.tsx  ← §5.4
  sections/ProgrammesGrid.tsx     ← composes ContentCard
  sections/LocationMap.tsx        ← §6.3 static-map pattern

lib/
  programmes.ts                   ← content registry: slug, hero, cardPreview, cardPoster (§4.2)
  milestones.ts                   ← timeline data (§3.2)

public/
  videos/<slug>/hero.mp4
  videos/<slug>/card-preview.mp4  ← ≤ 250 KB, silent, loop-safe
  images/posters/<slug>-hero.jpg
  images/posters/<slug>-card.jpg  ← cut from the PREVIEW, not the hero

scripts/encode-media.sh           ← wrap the §4.2 ffmpeg commands so encoding is
                                    reproducible and the budget is enforced
```

**Build order matters:** `RevealOnScroll` first, then `MediaVideo` (the hero, the ambient
block and the showcase all wrap it), then the rest in any order.

**Naming conventions worth keeping:**

- **Name sections after what they are, not where they sit** — `AmbientVideoBlock`, not
  `HomeSection3`. They get reused.
- **One primitive per media type.** One video component with a `mode`, not
  `HeroVideo`/`CardVideo`/`GalleryVideo` each re-solving autoplay. That is why the hydration
  fix had to be made **once**.
- **Content registries are plain typed arrays in `lib/`**, separate from the copy. Media
  paths and structure in `lib/`; the words in your content layer.
- **Comment the *why*, not the *what*.** The `cardPoster` comment ("without it the card
  visibly jumps") is what stops a future maintainer deleting the field.

## 6.5 Testing checklist

**Measure — do not eyeball.**

### Pattern #1 — Hero video

- [ ] **Desktop autoplay, cold cache.** Hard-reload with cache disabled; video visibly
      playing within ~2 s. In the console:
      `const v=document.querySelector('video'); ({paused:v.paused,t:v.currentTime,ready:v.readyState,op:getComputedStyle(v).opacity})`
      → expect `paused:false`, `t>0`, `ready:4`, `op:"1"`.
      **`paused:false` with `op:"0"` is the hydration bug — return to §2.2.**
- [ ] **Warm-cache reload ×5.** The race is timing-dependent; one reload proves nothing.
- [ ] **Slow 3G.** Poster immediate, video cross-fades in later, **no layout shift** (CLS 0).
- [ ] **iOS Safari, real device.** Plays inline, does not open the fullscreen player. Repeat
      in Low Power Mode → the fallback play button must appear and work.
- [ ] **Reduced motion on.** Poster + play button; nothing autoplays; the scroll cue stops
      bouncing.
- [ ] **Keyboard.** Tab reaches both CTAs and the scroll cue; ring visible against footage.
- [ ] **Screen reader.** The video announces its description; overlays announce nothing.

### Pattern #2 — Stacking timeline

- [ ] **Scroll smoothness.** DevTools → Performance, record a full scroll. **60 fps, no long
      tasks > 50 ms.** Purple layout bars mean something is animating a layout property.
- [ ] **CLS ≈ 0.00** (the source measured 0.001).
- [ ] **First and last panel.** First has no top border/shadow; last never dims — scroll to
      the very bottom and confirm full opacity.
- [ ] **Panel edges visible with your palette.** **If your panels share one background and
      you removed the radius/border/shadow, the effect is invisible** — the single most
      common way to break this pattern.
- [ ] **375px.** Readable, no horizontal scroll, no internal panel scrollbars (if a panel
      scrolls internally, the prose is too long).
- [ ] **Reduced motion.** Panels still stack (sticky is not motion) but do not scale or dim.
- [ ] **Longest year string** does not overflow its column at ~900px, where `vw` sizing peaks
      relative to column width.
- [ ] **Screen reader.** Announced as an ordered list; the large year is *not* announced;
      each title is a heading.

### Pattern #3 — Content cards

- [ ] **Desktop hover.** Media zooms; card box does not move; neighbours do not shift; text
      does not resample.
- [ ] **Mobile touch, real device.** Previews autoplay on scroll without a tap; pause and
      resume when scrolled past and back.
- [ ] **Network panel: three cards < 750 KB total preview bytes.** Megabytes means the
      encode is wrong — check `-an`, bitrate, resolution.
- [ ] **`preload="none"` proven.** With the grid below the fold, **no video request fires**
      until you scroll near it.
- [ ] **Save-Data on.** **No video requests at all**; posters only.
- [ ] **Reduced motion.** No video element in the DOM.
- [ ] **Loop seam.** Watch three full loops: no jump, no flash, no colour shift at restart.
- [ ] **cardPoster match.** If the image visibly jumps at the poster→video transition, recut
      the poster from the preview at ~30 %.
- [ ] **Keyboard.** One tab stop per card; ring visible over dark media; Enter navigates; the
      video is never focusable.
- [ ] **Contrast over the lightest frame of the loop** ≥ 4.5:1 behind the title. **A video
      changes the background over time** — the gradient must hold for every frame, not just
      the poster.

### Pattern #4 — Gallery and section video

- [ ] **Masonry integrity** with an odd count (7, 11): no split images, no large holes.
- [ ] **Lightbox keyboard.** Enter/Space opens from a focused thumbnail; `←`/`→` navigate and
      **wrap**; `Escape` closes; focus returns somewhere sensible.
- [ ] **Focus trap.** Tab repeatedly with the lightbox open — **focus must not escape to the
      page behind.** The source lacks this; add it and verify.
- [ ] **Scroll lock** holds while open and is restored on close, including via Escape.
- [ ] **Screen reader.** Announced as a dialog with a name; caption and `3/9` counter
      announced.
- [ ] **Preload budget.** On your heaviest page, sum video bytes on first load: **under
      3 MB.** 20 MB means you copied `preload="auto"` (§5.2).
- [ ] **≤ 2–3 autoplaying videos per page.** If Lighthouse TBT exceeds ~600 ms, make the
      extras click-to-play.
- [ ] **Aspect containment.** Every embed in an explicit aspect box; no reflow on load.
- [ ] **Captions.** Every clip with speech has a `.vtt`, and it displays.
- [ ] **Alt-text sweep.** Read every alt text aloud. Filenames, numbers, or empty strings on
      content images → fix.

### Cross-cutting

- [ ] **Lighthouse** on your three heaviest pages, recorded **before and after** adding these
      patterns, so a regression is attributable.
- [ ] **Third-party requests: expect zero** on a page with a hero video and a map. Anything
      else is a privacy and performance regression.
- [ ] **RTL** (if applicable): logical properties throughout; directional icons mirrored.
- [ ] **Real mid-range Android on a real network** — the most informative test available, and
      the one most often skipped.

---

## Appendix — source file index

| Pattern | Source files |
|---|---|
| Framework, tokens | `package.json`, `next.config.ts`, `styles/tokens.css`, `app/globals.css` |
| Reveal wrapper | `components/motion/RevealOnScroll.tsx` (42 lines, quoted in full in §1.7) |
| #1 Hero video | `components/sections/Hero.tsx` (64), `components/ui/VideoPlayer.tsx` (325) |
| #1 Hydration fix | `components/ui/VideoPlayer.tsx:76-81, 84-109, 152, 167-183, 295-322`; diagnosis in `PROGRESS.md:100-118` |
| #2 Stacking timeline | `components/sections/StackingTimeline.tsx` (187); consumer `app/[locale]/notre-histoire/page.tsx` |
| #3 Content cards | `components/ui/Card.tsx:21-145`, `components/sections/ProjectsGrid.tsx`, `lib/projects.ts` |
| #3 Preview encoding | `PHASE-2A-SUMMARY.md:14-32`, `HANDOFF-ANALYSIS.md:389-406`; verified with `ffprobe` |
| #4 Gallery | `components/sections/Gallery.tsx` (159) |
| #4 Section video | `components/sections/NeighbourhoodVideo.tsx`, `components/sections/AmenitiesGrid.tsx:66-108`, `components/sections/VideoShowcase.tsx` |
| #4 preload trade-off | `PHASE-2A-SUMMARY.md:145-165` |
| Static map | `components/sections/LocationMap.tsx` |

**Known gaps in the source, carried here as warnings rather than reproduced:**

1. `preload="auto"` on all ambient players → 22 MB page (§5.2). **Corrected rule given.**
2. No focus trap in the lightbox (§5.1). **Add one.**
3. Caption slot exists, no `.vtt` authored (§2.4). **Author them.**
4. Card previews encoded at 2.33:1 for a 4:5 card, causing heavy upscaling (§4.2).
   **Encode at the display ratio.**
5. Images converted to AVIF/WebP at request time, not build time (§1.9).

*End of handoff.*
