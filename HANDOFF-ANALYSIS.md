# HANDOFF-ANALYSIS.md — SBAI Immobilier website

**Written for a reader who has never seen this codebase and cannot access it.**
Every claim below is backed by a command output, a file path, or a measured number
taken from the repository at commit `4826a3f` on 2026-07-29.

> **Honesty note up front.** This project was in the middle of a 10-step polish phase when
> the analysis was requested. **Only 3 of those 10 steps are done.** There is **no live
> deployment**. Lighthouse performance is **45–76**, not the 85+ that was targeted. A CSS
> refactor completed two commits ago **introduced a colour-contrast accessibility
> regression** that is still present. Details in §8, §9 and §11.

---

## SECTION 1 — Project identity

**Client.** SBAI Abdelhai & Associés — a family-run real-estate developer in Tangier,
Morocco, founded 1973. Three generations; the company positions itself as "le fleuron de
l'immobilier" in northern Morocco. Source documents live in `context/`:
`SBAI Brand Board.html`, `SBAI_Strategie_Digitale_2026.pdf`,
`rapport-analyse-damacproperties-SBAI.md` (a competitor benchmark against DAMAC Properties).

**Purpose.** A bilingual French/Arabic showcase site for three residential projects
(Triple Towers, Les Villas de la Colline, Résidence Del Costa), designed to generate
qualified leads by phone/WhatsApp rather than online transactions.

**Target audiences.** (1) Local Tangier buyers; (2) **MRE** — *Marocains Résidant à
l'Étranger*, Moroccans living abroad who buy remotely, which is why there is a dedicated
`/espace-mre` page and heavy WhatsApp emphasis; (3) investors anticipating the 2030 FIFA
World Cup, for which Tangier is a host city.

**Live URL.** ❌ **None. The site has never been deployed.** There is no `vercel.json` and
no `.vercel/` directory in the repo. Every screenshot and metric in this document comes
from a local production server (`npx next start -p 3100`).

**GitHub repo.** `https://github.com/NadirChioua/sbai-abdelhai` — branch `main`.

**Phase completed.** Phases 1–6 complete. **Phase 7 (client-presentation polish) is 3/10
complete** — see §11.

**Last commit.** `4826a3f` — 2026-07-27 12:02:26 +0100.
**Total commits.** 18.
**Contributors.** A single author: `Nadir Chioua <chioua.nadir@ensi.ma>` (18/18 commits).

---

## SECTION 2 — Technical stack

### Actual outputs

```
$ node --version
v22.14.0

$ npm --version
10.9.2
```

`package.json`:

```json
{
  "name": "sbai-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.5.7",
    "framer-motion": "^12.42.2",
    "lucide-react": "^1.27.0",
    "next": "16.2.12",
    "next-intl": "^4.13.4",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.83.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.12",
    "playwright": "^1.62.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

`next.config.ts` — the entire file:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};

export default withNextIntl(nextConfig);
```

`postcss.config.mjs` — the entire file:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

**Tailwind is v4, CSS-configured.** There is **no `tailwind.config.ts`**. All theme tokens
are declared in `app/globals.css` inside an `@theme inline { … }` block, which imports raw
values from `styles/tokens.css`. A reader looking for the design system must open those two
files, not a JS config.

**i18n** is `next-intl` v4 using the **Next 16 proxy convention**: the middleware lives at
`proxy.ts` at project root (not `middleware.ts`). Config split across `i18n/routing.ts`
(locales), `i18n/request.ts` (message loading), `i18n/navigation.ts` (locale-aware `<Link>`).

**Deployment target.** Vercel was intended (the API route comment recommends Resend, a
Vercel-adjacent mail provider) but **nothing is configured or deployed**.

### En français — pourquoi cette stack, et où sont les risques

Le choix Next.js + Tailwind + next-intl est cohérent pour un site vitrine bilingue :
rendu statique (SSG) pour la vitesse et le SEO, et gestion RTL native pour l'arabe.

**Risques réels à connaître :**

1. **Next.js 16.2.12 est très récent.** Le fichier `AGENTS.md` du dépôt avertit
   explicitement : *« This is NOT the Next.js you know — read `node_modules/next/dist/docs/`
   before writing any code. »* Conséquence concrète déjà rencontrée : le middleware
   s'appelle `proxy.ts` et non `middleware.ts`. Un développeur qui applique ses réflexes
   Next 14/15 cassera la configuration i18n.
2. **Tailwind v4 sans fichier de config.** Beaucoup de tutoriels et de réponses en ligne
   supposent un `tailwind.config.js`. Ici il n'existe pas : toute modification de thème se
   fait en CSS.
3. **React 19.2.4** — les composants serveur ne peuvent pas passer de fonctions aux
   composants client. Cette erreur s'est déjà produite dans ce dépôt (voir le commentaire
   ligne 16 de `components/sections/StackingTimeline.tsx`).
4. **`lucide-react` en v1.27.0** : version majeure 1.x, très récente. À surveiller.
5. **Aucune dépendance dépréciée ou vulnérable détectée.** Aucune clé d'API, aucun secret
   dans les fichiers versionnés (scan effectué sur `app/`, `components/`, `lib/`, `i18n/`).

---

## SECTION 3 — File structure

```
sbai-website/
├── AGENTS.md              # ⚠️ warns that Next 16 differs from training data
├── CLAUDE.md              # one line: @AGENTS.md
├── PROGRESS.md            # project journal, decisions, client TODO list
├── README.md
├── app/
│   ├── [locale]/          # all pages, locale-segmented (fr | ar)
│   ├── api/contact/       # POST handler for the lead form
│   ├── favicon.ico
│   └── globals.css        # ⭐ Tailwind v4 @theme — the design system lives here
├── components/
│   ├── layout/            # Header, Footer, TopBar, MobileMenu, LocaleSwitcher, ConsentBanner
│   ├── motion/            # RevealOnScroll, ParallaxWrapper
│   ├── sections/          # 19 page-section components
│   └── ui/                # Button, Card, Input, VideoPlayer, StickyCTABar, icons, WhatsAppFloat
├── i18n/                  # routing.ts, request.ts, navigation.ts
├── lib/                   # config.ts, consent.ts, contact-schema.ts, projects.ts
├── messages/              # fr.json, ar.json
├── proxy.ts               # ⚠️ Next 16 middleware (NOT middleware.ts)
├── public/
│   ├── fonts/             # 5 self-hosted woff2
│   ├── images/            # 48 files, 8 MB
│   ├── logo/
│   ├── subtitles/         # VTT for the founder interview
│   └── videos/            # 15 mp4, 78 MB
├── styles/tokens.css      # raw brand values consumed by globals.css
├── next.config.ts
└── package.json
```

### Annotations

- **`app/[locale]/`** — every page is under a locale segment. There is no un-localised route.
- **`lib/projects.ts`** (202 lines) is the **single source of truth** for the three projects:
  slugs, video manifests, gallery lists, amenity keys, map images. All display text lives in
  `messages/*.json` and is looked up by key. To add a project you edit this one file.
- **Unusual pattern:** `proxy.ts` at root instead of `middleware.ts`. This is correct for
  Next 16 but will look wrong to anyone expecting Next 14/15.

### Files that should not be there

- **`public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`,
  `public/window.svg`** — leftovers from `create-next-app`. Unused. Safe to delete.
- **No leaked secrets.** No `.env` file exists (and `.gitignore` line 34 is `.env*`).
- **No build artifacts committed** — `.gitignore` covers `/node_modules` and `/.next/`.

### Dead code

- **`components/motion/ParallaxWrapper.tsx` (41 lines) is imported by 0 files.** Verified by
  grepping every component name across `app/`, `components/`, `lib/`. It is the only unused
  component; the other 33 are each imported at least once.

---

## SECTION 4 — Design system: specified vs. actual

### Colours — every hex in the codebase, with counts

```
      3 #25d366   ← WhatsApp brand green (hard-coded in 3 places)
      2 #22271f   charcoal
      1 #ffffff   white
      1 #f4f1ea   ivory
      1 #eff4f5   text-on-teal
      1 #eaf2eb   text-on-heritage-green
      1 #e9e5db   ivory-dark
      1 #e9e4d6   on-dark-muted
      1 #e0dacb   sand (borders)
      1 #c9a24b   SBAI gold
      1 #8c6d2c   gold-dark
      1 #8a8676   text-muted
      1 #5c594e   text-secondary
      1 #46626b   Atlantic Teal
      1 #3a2e12   text-on-gold
      1 #2f6b3f   Heritage Green
```

**Verdict: the palette is clean.** 15 of the 16 values are declared once, in
`styles/tokens.css`, and consumed through CSS variables. There are **no stray colours**.

Two caveats a reader should know:

1. **`#25d366` is hard-coded three times** — it is the official WhatsApp green, deliberately
   outside the brand palette so the button is recognisable. Defensible, but undocumented.
2. **`#2f6b3f` (Heritage Green) is declared but effectively unused** as a surface colour.
   The system therefore *claims* two accents (green + teal) while shipping one and a half.
   A decision was pending on whether to delete it — **that decision was never made**.

### Typography

**Font families — 4, all self-hosted** in `public/fonts/` via `next/font/local`
(`app/[locale]/layout.tsx` lines 13–40):

| Font | Role | File |
|---|---|---|
| Marcellus 400 | Display/headlines (Latin) | `marcellus.woff2` |
| Jost 100–900 | Body/UI (Latin) | `jost.woff2` |
| Amiri 400/700 | Display (Arabic) | `amiri-arabic-*.woff2` |
| Noto Sans Arabic 100–900 | Body (Arabic) | `noto-sans-arabic.woff2` |

**Zero requests to `fonts.googleapis.com`** — verified at runtime (see §7 and §8).

**Type scale — the intent.** `app/globals.css` defines an 8-step fluid scale:

```css
--text-display:  clamp(2.5rem, 6vw, 4.5rem);
--text-h1:       clamp(2rem, 4.5vw, 3.5rem);
--text-h2:       clamp(1.625rem, 3vw, 2.5rem);
--text-h3:       clamp(1.25rem, 2vw, 1.75rem);
--text-body-lg:  1.125rem;
--text-body:     1rem;
--text-caption:  0.875rem;
--text-eyebrow:  0.75rem;
```

**Type scale — the reality. ⚠️ The consolidation is INCOMPLETE.** Seven off-scale sizes
survive. Grep output with exact locations:

```
app/[locale]/espace-mre/page.tsx:73        text-3xl
components/layout/Footer.tsx:31            text-xl
components/layout/MobileMenu.tsx:104       text-[32px] md:text-4xl
components/sections/CdM2030.tsx:28         text-3xl md:text-4xl
components/sections/FounderSection.tsx:27  text-3xl md:text-4xl
components/sections/HeritageStrip.tsx:26   text-[26vw] lg:text-[17rem]
```

The `text-[26vw]` / `text-[17rem]` in `HeritageStrip.tsx` is the deliberate giant ghosted
"1973" watermark and is arguably legitimate. **The other five are simply un-migrated.**

So the honest count is **8 scale steps + 5 stragglers = 13 distinct sizes**, not 8.

### Spacing

Section padding is **not** on a single scale. Actual counts:

```
15× py-24   7× py-32   7× py-28   3× py-20   3× py-16   3× pt-20   3× pb-24 …
```

A `.section-y` utility **was created** in `globals.css` (56px / 80px / 128px responsive) but
is **used in only one place** — `app/[locale]/notre-histoire/page.tsx:86`. Every other
section still hard-codes `py-24` or `py-28`. **This migration was started and abandoned.**

Grid gaps are healthier — `gap-3`, `gap-4`, `gap-6` dominate (24 / 11 / 16 uses); no
arbitrary values like `gap-[27px]`.

### Component inventory (34 components, usage counts verified by grep)

| Component | Files importing it |
|---|---|
| RevealOnScroll | 17 |
| Button, icons | 9 |
| ContactSection, VideoPlayer | 6 |
| Card | 4 |
| FAQ, Header, LocaleSwitcher, ProjectPage | 3 |
| FounderSection, Input, LocationMap, PageHero | 2 |
| 19 others (Hero, Gallery, StackingTimeline, ConsentBanner, …) | 1 each |
| **ParallaxWrapper** | **0 — dead code** |

### The gap between brand board and code

| Brand board specified | Shipped | Verdict |
|---|---|---|
| Gold #C9A24B as sole accent | ✅ used consistently | Met |
| Marcellus display + Jost body | ✅ both self-hosted | Met |
| Heritage Green as a brand colour | Declared, effectively unused | **Unresolved** |
| Atlantic Teal | Used on 2 sections | Met, but coexists awkwardly with green |
| Consistent type scale | 8 defined, 5 stragglers remain | **Partially met** |
| Consistent section rhythm | `.section-y` built, used once | **Not met** |

---

## SECTION 5 — Pages inventory

All 9 routes × 2 locales = **18 pages, all returning HTTP 200** (verified by crawling a
running production server).

| File | URL (fr) | Status | Lines | Key components | Content source |
|---|---|---|---|---|---|
| `app/[locale]/page.tsx` | `/fr` | COMPLETE | — | Hero, HeritageStrip, ProjectsGrid, FounderSection, MRESection, CdM2030, Testimonials, ContactSection | Real |
| `app/[locale]/projets/page.tsx` | `/fr/projets` | COMPLETE | — | PageHero, ProjectsIndex | Real |
| `…/projets/triple-towers/page.tsx` | `/fr/projets/triple-towers` | COMPLETE | — | ProjectPage (114 l.) | Real |
| `…/projets/les-villas-de-la-colline/page.tsx` | `/fr/projets/les-villas-de-la-colline` | COMPLETE | — | ProjectPage | Real |
| `…/projets/del-costa/page.tsx` | `/fr/projets/del-costa` | COMPLETE | — | ProjectPage | Real |
| `app/[locale]/notre-histoire/page.tsx` | `/fr/notre-histoire` | COMPLETE | 115 | PageHero, **StackingTimeline**, FounderSection | Real, 9 chapters |
| `app/[locale]/espace-mre/page.tsx` | `/fr/espace-mre` | COMPLETE | — | MRESection, GuideForm, ContactSection | Real |
| `app/[locale]/contact/page.tsx` | `/fr/contact` | COMPLETE | 107 | ContactSection, LocationMap | Real |
| `app/[locale]/mentions-legales/page.tsx` | `/fr/mentions-legales` | **PARTIAL** | — | — | **Contains `[À compléter par le client]` placeholders** |
| `app/api/contact/route.ts` | `/api/contact` | **PARTIAL** | 45 | — | Validates + logs, **does not send email** |

**No page is BROKEN or STUB.** The two PARTIAL entries are documented, deliberate gaps
awaiting client data — not bugs.

**There is no lorem ipsum anywhere.** All French copy is real, written from the client's
strategy documents.

### Build output (`npm run build`, actual)

```
✓ Compiled successfully in 4.2s
✓ Generating static pages using 14 workers (22/22) in 1361ms

Route (app)
┌ ○ /_not-found
├ ● /[locale]                                  /fr, /ar
├ ● /[locale]/contact                          /fr/contact, /ar/contact
├ ● /[locale]/espace-mre                       /fr/espace-mre, /ar/espace-mre
├ ● /[locale]/mentions-legales                 /fr/mentions-legales, /ar/mentions-legales
├ ● /[locale]/notre-histoire                   /fr/notre-histoire, /ar/notre-histoire
├ ● /[locale]/projets                          /fr/projets, /ar/projets
├ ● /[locale]/projets/del-costa                /fr/…, /ar/…
├ ● /[locale]/projets/les-villas-de-la-colline /fr/…, /ar/…
├ ● /[locale]/projets/triple-towers            /fr/…, /ar/…
└ ƒ /api/contact

ƒ Proxy (Middleware)
```

**Zero warnings, zero errors, zero type errors.** All 9 routes are SSG-prerendered; only
the API route is dynamic.

---

## SECTION 6 — Media inventory

### Videos — 15 files, 78 MB total (`ffprobe` measured)

| File | Size | Duration | Resolution | Used in | Poster |
|---|---|---|---|---|---|
| `triple-towers/hero-drone.mp4` | 9 616 KB | 26.2 s | 1918×1080 | Homepage Hero + TT project hero | `tt-hero.jpg` |
| `triple-towers/founder-interview.mp4` | **11 624 KB** | 99.1 s | 720×1280 | FounderSection (homepage + Notre Histoire) | `founder.jpg` |
| `triple-towers/interior.mp4` | 4 920 KB | 55.4 s | 1278×720 | TT VideoShowcase | `tt-interior.jpg` |
| `triple-towers/ugc.mp4` | 4 964 KB | 93.6 s | 576×1022 | Testimonials + TT | `tt-ugc.jpg` |
| `triple-towers/reel.mp4` | 4 772 KB | 24.6 s | 720×1280 | TT VideoShowcase | `tt-reel.jpg` |
| `triple-towers/card-preview.mp4` | **172 KB** | 6.0 s | 640×274 | Project cards (autoplay) | `tt-hero.jpg` |
| `villas-colline/hero-drone.mp4` | 9 704 KB | 26.4 s | 1918×1080 | Villas project hero | `vc-hero.jpg` |
| `villas-colline/interior.mp4` | 4 892 KB | 17.1 s | 1918×1080 | Villas VideoShowcase | `vc-interior.jpg` |
| `villas-colline/pool-garden.mp4` | 4 968 KB | 25.8 s | 1918×1080 | Villas VideoShowcase | `vc-pool.jpg` |
| `villas-colline/card-preview.mp4` | **196 KB** | 6.0 s | 640×274 | Project cards | `vc-hero.jpg` |
| `del-costa/hero-exterior.mp4` | 9 744 KB | 46.6 s | 1918×1080 | Del Costa hero | `dc-hero.jpg` |
| `del-costa/interior.mp4` | 4 808 KB | 19.9 s | 1918×1080 | DC VideoShowcase | `dc-interior.jpg` |
| `del-costa/garage-security.mp4` | 4 776 KB | 14.7 s | 1918×1080 | DC VideoShowcase | `dc-garage.jpg` |
| `del-costa/pool.mp4` | 3 576 KB | 6.3 s | 1920×1080 | DC VideoShowcase | `dc-pool.jpg` |
| `del-costa/card-preview.mp4` | **124 KB** | 6.0 s | 640×274 | Project cards | `dc-hero.jpg` |

**Every video has a poster.** The three `card-preview.mp4` files are purpose-built 6-second
silent loops (492 KB combined) so the project cards can autoplay without streaming 28 MB of
hero footage.

### Images

- **48 files, 8 MB total** in `public/images/`.
- Largest: `heritage/towers-fountain.jpg` (384 KB), `heritage/villas-bay.jpg` (348 KB),
  `heritage/corniche.jpg` (344 KB). None is pathologically large, but Lighthouse still flags
  `modern-image-formats` and `uses-responsive-images` — the originals are JPEG and Next.js
  is asked to produce AVIF/WebP at runtime.

### Broken references — none

Automated check: extracted all 68 media paths referenced in `app/`, `components/`, `lib/`,
then tested each against the filesystem.

```
total refs: 68, missing: 0
```

**Also: every `<img>` on all 9 French pages has an `alt` attribute (0 missing).**

### ⚠️ Content caveat on the imagery

`PROGRESS.md` item #6 records that **all 35 archive photos in `image genrale/` carry a
watermark of the company's old logo** in the top-right corner. They are used as-is. On the
Notre Histoire timeline this reads as intentional (they look like archives), but on
`/images/posters/tt-hero.jpg` and the project cards the watermark is visible and is **not**
intentional. Clean versions have been requested from the client and never supplied.

---

## SECTION 7 — Internationalisation

- **Languages:** French (`fr`, default) and Arabic (`ar`). Configured in `i18n/routing.ts`.
- **Translation files:**
  - `messages/fr.json` — **478 strings, 4 517 words**
  - `messages/ar.json` — **479 strings, 3 379 words**
- **Key parity: perfect.** Programmatic diff of the two key trees:
  ```
  only in FR: 0  []
  only in AR: 1  ['._translation_status']
  ```
  The single extra Arabic key is a deliberate metadata marker (below).
- **Hardcoded strings: none found.** Grepped components for literal French UI words
  (`Découvrir`, `Contactez`, `Nos projets`, `En savoir`, `Envoyer`, `Accueil`, `Voir tous`)
  outside `t()` calls — zero hits.
- **RTL: implemented and verified.** At `/ar`, the runtime reports:
  ```json
  {"dir":"rtl","lang":"ar"}
  ```
  Logical CSS properties (`ps-`, `pe-`, `ltr:`/`rtl:` variants, `inset-inline-start`) are used
  throughout. `globals.css` line 120 zeroes the wide letter-spacing for RTL, because Arabic
  script breaks when letter-spaced.

### ⚠️ The single biggest content risk in the project

`messages/ar.json` carries this self-declared flag:

> `MACHINE_TRANSLATED — awaiting review. Toutes les chaînes de ce fichier sont une traduction
> machine première passe (FR → AR) à faire relire par un locuteur natif avant mise en
> production.`

**The entire Arabic half of the site — 479 strings — has never been reviewed by a human
Arabic speaker.** The word-count asymmetry (3 379 AR vs 4 517 FR) is normal for
French→Arabic, but it is not evidence of quality. **Do not present the Arabic site to the
client as finished.**

---

## SECTION 8 — Honest quality assessment

Scores are anchored to measurements, not impressions.

### Visual polish — **6/10**
The hero, founder section and the new stacking timeline are genuinely good. But Phase 7
identified 10 concrete weaknesses and **fixed only 3**. Still open and visible: two-column
sections with empty left columns (FAQ, Location), three consecutive charcoal blocks at the
bottom of `/espace-mre`, and no visual rhythm between sections. The `.rule-diamond` and
`.drop-cap` primitives exist in `globals.css` but are used on exactly one page.

### Typography hierarchy — **6/10**
The 8-step fluid scale is well designed. It is **not fully applied** — 5 off-scale
utilities survive in `Footer.tsx:31`, `CdM2030.tsx:28`, `FounderSection.tsx:27`,
`MobileMenu.tsx:104`, `espace-mre/page.tsx:73`. A half-migrated scale is arguably worse than
no scale, because the next developer cannot tell which is canonical.

### Colour consistency — **8/10**
Earned: 16 unique hex values, 15 declared exactly once in `styles/tokens.css`, zero strays.
Docked two points for the unresolved Heritage Green (declared, unused) and the WhatsApp
green hard-coded in 3 files.

### Animation quality — **8/10**
Framer Motion used correctly: transform/opacity only (compositor-friendly), `useReducedMotion`
honoured in `StackingTimeline.tsx:44`, `Card.tsx`, `ConsentBanner.tsx`. Measured CLS on
Notre Histoire is **0.001**, which is exceptional for a scroll-driven page. Docked for the
project page's **3 990 ms Total Blocking Time** — too much JS work on the main thread.

### Responsive behaviour — **7/10**
8 of 9 French pages have **exactly 0 px** horizontal overflow at 375 px. One does not:
**`/fr` overflows by 6 px**, traced to the `TopBar` (see §9). Touch targets were audited and
several fall below 44 px; **the fix was scheduled as Phase 7 Step 7 and never executed**.

### Accessibility — **7/10**
Lighthouse: **97 / 93 / 97**. Strong: 0 images without alt, visible 2 px focus outlines on
every tabbed element (verified over 8 tab stops), correct `dir`/`lang`, reduced-motion
respected. Three real failures remain, all listed in §9 — including **a contrast regression
introduced by this project's own CSS refactor two commits ago**.

### Performance — **4/10**
This is the weakest dimension and the numbers are not close to target.

| Page | Performance | LCP | CLS | TBT |
|---|---|---|---|---|
| `/fr` | **74** | 8.3 s | 0.064 | 90 ms |
| `/fr/projets/triple-towers` | **45** | 7.7 s | 0.047 | **3 990 ms** |
| `/fr/notre-histoire` | **76** | 7.5 s | 0.001 | 50 ms |

Target was 85+. **LCP of 7.5–8.3 s is roughly 3× the 2.5 s "good" threshold.** The project
page ships **12 804 KiB** — `hero-drone.mp4` alone is 7.3 MB and `reel.mp4` another 4.2 MB,
both fetched eagerly. CLS is the one bright spot (all three under 0.1).

### SEO — **9/10**
Lighthouse **100/100 on all three pages tested**. All 18 pages are statically prerendered,
metadata is generated per-locale via `generateMetadata`. Docked one point because
structured data (JSON-LD), `sitemap.xml`, `robots.txt` and `hreflang` tags were scheduled as
"Phase 8" and **do not exist yet**.

### Code quality — **8/10**
TypeScript strict, build clean with zero warnings, single source of truth in
`lib/projects.ts`, comments explain *why* rather than *what*. Zod validation shared between
client and server (`lib/contact-schema.ts`). Docked for 1 dead component, 5 un-migrated type
utilities, and a `.section-y` abstraction that was created then used once.

### Legal compliance (CNDP / loi 09-08) — **9/10**
The strongest area, and it was a genuine save. An audit found the Google Maps embed was
firing **40+ third-party requests including `fonts.googleapis.com`** and setting Google
identifiers **before any user interaction** — contradicting the site's own privacy page and
exposing the client to fines up to 300 000 MAD. Now measured across 6 pages in a clean
browser context:

```
THIRD-PARTY REQUESTS: NONE
COOKIES SET: localhost NEXT_LOCALE
```

Maps are self-hosted static images built from OpenStreetMap tiles. The consent banner has
`Accepter` and `Refuser` at **identical 160×44 px** (CNDP requires refusal be no harder than
acceptance). `lib/consent.ts` gates any future third-party script. Docked one point: the
**CNDP declaration number is still a placeholder** `[EN COURS D'ENREGISTREMENT]`.

---

## SECTION 9 — What is actually broken

Tested against a local production build with Playwright driving a real Chromium.

### ✅ What is NOT broken (measured, so the receiver does not waste time re-checking)

```
ROUTE STATUS:        13/13 routes → HTTP 200
INTERNAL LINKS:      20 unique links crawled, 0 broken
CONSOLE ERRORS:      none
UNCAUGHT PAGE ERRORS none
HYDRATION WARNINGS:  none
IMAGES MISSING ALT:  0
CONTACT FORM:        success message shown → true
RTL:                 {"dir":"rtl","lang":"ar"}
HERO VIDEO AUTOPLAY: {"src":"triple-towers/hero-drone.mp4","paused":false,"t":3}
```

Keyboard focus over the first 8 tab stops — every element reported `outline: solid 2px`:

```
1. A "+212 5 39 94 31 12"   outline: solid 2px
2. A "WhatsApp"             outline: solid 2px
3. A "العربية"               outline: solid 2px
…
8. A "Espace MRE"           outline: solid 2px
```

### ❌ BUG 1 — 6 px horizontal overflow on the mobile homepage

Only `/fr` is affected; the other 8 pages measure 0 px.

```
=== MOBILE 375px HORIZONTAL OVERFLOW ===
  OVERFLOW 6px  /fr
  OK   /fr/projets
  OK   /fr/projets/triple-towers
  … (all others OK)
```

Culprit chain isolated at runtime — `documentElement.scrollWidth` is 381 at a 375 viewport,
and the innermost offender is the TopBar flex row:

```json
{"tag":"DIV","cls":"mx-auto flex h-9 max-w-screen-2xl items-center justify-between gap-4 p…",
 "left":0,"right":381,"overflowBy":6,"text":"Le Fleuron de l'immobilier · D"}
```

**Cause.** `components/layout/TopBar.tsx:16-38`. At 375 px the tagline is hidden
(`hidden sm:block`, line 17) but the right-hand group still contains three items —
phone number, WhatsApp label, locale switcher — joined by `gap-5`, each styled `.eyebrow`
with `letter-spacing: 0.32em`. The tracking makes `+212 5 39 94 31 12` and `WHATSAPP` wide
enough to exceed 375 px by 6.

**Suggested fix (not applied):** hide the WhatsApp text label below `sm` (keep the icon), or
reduce `--tracking-label` on the TopBar at mobile widths.

### ❌ BUG 2 — colour-contrast failure (a REGRESSION from commit `73b9521`)

Fails on **all three pages tested**. Lighthouse detail:

```
Element has insufficient color contrast of 3.14
(foreground #8c6d2c, background #22271f, font size 9.0pt (12px), font weight normal)
node: <span dir="ltr">   → the phone number in the TopBar
node: <a href="https://wa.me/212661748547?…">
```

**Cause and honest attribution.** Commit `73b9521` ("consolidate to 8 type sizes and 5 text
colours") added a default colour to the shared eyebrow class in `app/globals.css:84-93`:

```css
.eyebrow,
.micro-label {
  …
  color: var(--sbai-gold-dark);   /* #8c6d2c */
}
```

Before that change, each usage set its own colour. Now every `.eyebrow` **on a charcoal
background** inherits `#8c6d2c` on `#22271f` = **3.14:1**, below the 4.5:1 WCAG AA minimum
for small text. **This refactor made accessibility worse, and it shipped.**

Sites affected — `.eyebrow` used with no colour override:
```
components/layout/MobileMenu.tsx:130
components/sections/LocationMap.tsx:43
components/sections/StackingTimeline.tsx:90
app/[locale]/notre-histoire/page.tsx:65
app/[locale]/notre-histoire/page.tsx:88
```
(Only the ones on dark grounds actually fail; on ivory, `#8c6d2c` passes.)

**Suggested fix:** remove the default `color` from `.eyebrow` and set it explicitly per
context, or use `--sbai-gold` (`#c9a24b`, ~6.9:1 on charcoal) on dark surfaces.

### ❌ BUG 3 — invalid `<dl>` markup in the FAQ

On `/fr/projets/triple-towers`, two Lighthouse audits fail on the same element:

```
aria-allowed-role: <dd id="faq-panel-0" role="region" aria-labelledby="faq-trigger-0" …>
                   → ARIA role region is not allowed for given element
definition-list:   <dl class="lg:col-span-2">
                   → dl element has direct children that are not allowed: div > [role=region]
```

`components/sections/FAQ.tsx` puts `role="region"` on a `<dd>`, which the HTML spec does not
permit. This is why the project page scores **93** on accessibility while the other two score 97.

### ❌ BUG 4 — the contact form does not email anyone

`app/api/contact/route.ts:36-41` validates the payload, drops honeypot hits, then:

```ts
// TODO(client): replace with Resend/SendGrid dispatch:
console.log(`[contact-lead] ${new Date().toISOString()} project=… name=… phone=…`);
return NextResponse.json({ ok: true });
```

**The visitor sees a success message; the lead is written to the server console and nowhere
else.** This is deliberate and documented (an API key was never provided), but it means
**every lead is lost in production.** The UI mitigates by pushing WhatsApp as the primary
channel. This is the single most commercially dangerous item in the repository.

### Not a bug — clarification

The project-card videos report `paused: true, t: 0` immediately after load. That is correct:
they sit below the fold and their IntersectionObserver has not fired. They start when
scrolled into view (verified separately).

---

## SECTION 10 — Metrics

### Lighthouse (Lighthouse 12, headless Chromium, local production server)

| Page | Perf | A11y | Best Practices | SEO |
|---|---|---|---|---|
| `/fr` | **74** | **97** | **100** | **100** |
| `/fr/projets/triple-towers` | **45** | **93** | **100** | **100** |
| `/fr/notre-histoire` | **76** | **97** | **100** | **100** |

### Core Web Vitals

| Page | LCP | CLS | TBT | FCP | Speed Index | TTI |
|---|---|---|---|---|---|---|
| `/fr` | 8.3 s | 0.064 | 90 ms | 1.0 s | 2.3 s | 8.3 s |
| `/fr/projets/triple-towers` | 7.7 s | 0.047 | **3 990 ms** | 1.0 s | 3.4 s | 11.5 s |
| `/fr/notre-histoire` | 7.5 s | 0.001 | 50 ms | 1.0 s | 2.0 s | 7.6 s |

**Read this honestly:** CLS passes everywhere (< 0.1). FCP is excellent (1.0 s). **LCP fails
badly everywhere** and TBT on the project page is catastrophic. The cause is video weight,
confirmed by the `total-byte-weight` audit:

```
/fr                     total 7 847 KiB   (hero-drone.mp4 = 5 701 970 B)
/fr/projets/triple-towers total 12 804 KiB (hero-drone.mp4 = 7 340 370 B, reel.mp4 = 4 194 642 B)
```

### Recurring Lighthouse failures across all three pages

`render-blocking-resources`, `unused-javascript`, `legacy-javascript`, `offscreen-images`,
`modern-image-formats`, `uses-responsive-images`, `largest-contentful-paint-element`,
`color-contrast`.

### Asset weights

| Asset class | Size |
|---|---|
| JavaScript (`.next/static`, all chunks) | **1.48 MB** |
| CSS | **0.05 MB** |
| `public/videos` | **78 MB** |
| `public/images` | **8 MB** |
| `public/fonts` | **1 MB** |
| `public/subtitles` | < 1 MB |

**Caveat on interpreting these scores.** They were measured against `localhost`, which has
no network latency — a real CDN would change absolute timings. But `total-byte-weight` and
TBT are network-independent, and both are genuinely bad. Do not assume deployment fixes this.

---

## SECTION 11 — What is undone

### Phase 7 was 3/10 complete when work stopped

A 10-step polish plan was agreed. Actual state:

| Step | Description | Status |
|---|---|---|
| 0 | CNDP compliance (maps, consent banner) | ✅ **Done**, verified |
| 1 | Typography + colour consolidation | ⚠️ **Partial** — 5 off-scale utilities remain |
| 2 | Notre Histoire stacking timeline | ✅ **Done**, verified at 1440/375/RTL |
| 3 | Video treatment (glow, corners, loading shimmer) | ❌ **Not started** |
| 4 | `/espace-mre` rhythm (break 3 charcoal walls, 3 email asks → 1) | ❌ **Not started** |
| 5 | Ornaments (dividers, roman numerals, drop caps site-wide) | ❌ **Not started** (primitives exist, used once) |
| 6 | Micro-interactions | ❌ **Not started** |
| 7 | Touch targets → 44 px | ❌ **Not started** |
| 8 | Section rhythm | ❌ **Not started** |
| 9 | Resolve Heritage Green | ❌ **Not started** |
| 10 | Responsive audit + screenshots | ❌ **Not started** |

**Phase 7 deliverables that were requested and never produced:**
`context/screenshots/phase-7/before-after/` (5 pairs) and
`context/screenshots/phase-7/responsive/` (every page at 375 px and 1440 px) **do not exist**.
Only `ux-audit.md`, `notre-histoire-scroll.md` and the Notre Histoire captures were produced.

**Phase 8 (SEO: JSON-LD, sitemap, robots.txt, hreflang, OpenGraph) was never started.**

### Code markers found by grep

```
app/api/contact/route.ts:7      TODO(client): plug an email provider
app/api/contact/route.ts:36     TODO(client): replace with Resend/SendGrid dispatch
app/[locale]/notre-histoire/page.tsx:107  TODO(client): team photos not provided
components/layout/Footer.tsx:38 TODO(phase-8): wire submission to /api/newsletter
components/layout/Header.tsx:130 TODO(phase-later): search modal — placeholder trigger only
components/sections/GuideForm.tsx:10  TODO(client): the PDF itself does not exist yet
components/sections/HeritageStrip.tsx:6 TODO(client): watermarked archive photos
components/sections/Testimonials.tsx:11 TODO(client): Del Costa photo rights
lib/config.ts:19,21,30          TODO(client): email / street address / social URLs
messages/ar.json                MACHINE_TRANSLATED — awaiting review
app/[locale]/mentions-legales/  6 blocks of "[À compléter par le client]"
```

### Categorised

**🔴 BLOCKING — must fix before showing the client**
1. **Contact form emails nobody** (`route.ts:36`). Every lead is lost.
2. **Colour-contrast regression** — WCAG AA failure on all pages, self-inflicted two commits ago.
3. **Arabic is 100 % unreviewed machine translation** — do not present the `/ar` site as done.
4. **No deployment exists.** There is nothing to show on a screen that is not a localhost.

**🟠 IMPORTANT — next phase**
5. Performance: LCP 7.5–8.3 s, project page 45/100, TBT 3 990 ms.
6. `/fr` 6 px mobile overflow (TopBar).
7. Invalid `<dl>`/`role="region"` markup in `FAQ.tsx`.
8. Phase 7 Steps 3–10 (7 of 10 steps).
9. Phase 8 SEO artifacts: JSON-LD, `sitemap.xml`, `robots.txt`, `hreflang`.
10. Finish the type-scale migration (5 files) and the `.section-y` migration.

**🟢 NICE-TO-HAVE**
11. Delete `ParallaxWrapper.tsx` (dead) and the 5 `create-next-app` SVGs.
12. Extract WhatsApp green `#25d366` into a token.
13. Search modal behind the header icon (currently non-functional).
14. Newsletter form in the footer (currently non-functional).

**🔵 CLIENT-INPUT-NEEDED — not developer work**
15. CNDP declaration number (placeholder in mentions légales).
16. Exact street address (currently "Tanger, Maroc") — affects footer, contact, map pins, schema.org.
17. Legal entity details: RC, ICE, IF, capital social, patente, director of publication.
18. Un-watermarked archive photos (35 files).
19. Email provider API key + destination inbox.
20. The MRE guide PDF (form captures emails for a document that does not exist).
21. Project pricing (all currently "Sur demande").
22. Confirmation of the founding date — **the logo says "SINCE 1969" while the entire site says 1973**.
23. Photo rights for the Del Costa testimonial images.
24. Team photos (section deliberately omitted rather than filled with stock).

---

## SECTION 12 — Recommended next steps

### Top 3 priorities

**Priority 1 — Make the site presentable and safe to show (≈ 4–6 h)**
- Fix the contrast regression: remove `color` from `.eyebrow` in `globals.css:92`, set it per
  usage, verify with Lighthouse (~1 h).
- Fix the 6 px TopBar overflow in `TopBar.tsx:16-38` (~30 min).
- Fix `FAQ.tsx` `<dl>`/`role="region"` markup (~1 h).
- Deploy to Vercel and get a real URL (~1–2 h including a first-run config).
- Re-run Lighthouse on the deployed URL to get honest, non-localhost numbers (~30 min).

**Priority 2 — Rescue the leads (≈ 2–3 h, blocked on the client)**
- Wire Resend into `app/api/contact/route.ts:36`. The integration point is already marked and
  the Zod schema is shared. **This is 30 minutes of code once an API key exists** — the rest
  is waiting on the client. Until then, every submission is lost. If the key will not arrive
  soon, consider changing the success message to direct users to WhatsApp explicitly.

**Priority 3 — Performance (≈ 6–8 h)**
- The project page is 12.8 MB. Do not load `hero-drone.mp4` (7.3 MB) *and* `reel.mp4` (4.2 MB)
  eagerly. Apply the `card-preview` technique already proven in this repo (28 MB → 492 KB) to
  the secondary videos, and gate the hero behind a poster until interaction.
- Convert `public/images` to AVIF/WebP at build time rather than at request time.
- Investigate the 3 990 ms TBT on the project page — likely multiple `VideoPlayer` instances
  each registering observers.

### Questions the human must answer first

1. **Is the founding date 1973 or 1969?** The site says 1973 everywhere; the logo file says
   "SINCE 1969". One of them is wrong and it is on every page.
2. **Who reviews the Arabic?** 479 machine-translated strings need a native speaker. Is there
   a budget for this, or should `/ar` be hidden at launch?
3. **Heritage Green: delete it or give it a job?** It is declared in the token file and used
   nowhere. Leaving it is the worst option.
4. **Is there an email provider account?** Without it, Priority 2 cannot ship.
5. **Should the watermarked archive photos be used at launch,** or should the site wait for
   clean files?
6. **Where do you want the Google Maps link to point** given the exact address is unknown?
   Map pins currently sit at district centres (Malabata, Cap Spartel, Tanger sud).

### ⚠️ Do NOT touch these — they work and were expensive to get right

1. **`lib/consent.ts` + `ConsentBanner.tsx` + `LocationMap.tsx`.** The CNDP compliance work is
   verified (zero third-party requests, zero tracking cookies). Re-introducing a Google Maps
   iframe would recreate a legal exposure of up to 300 000 MAD. If you need a richer map, keep
   the static-image + explicit-click pattern.
2. **`components/sections/StackingTimeline.tsx`.** Freshly built, verified at 1440 px, 375 px
   and RTL, CLS 0.001. In particular do **not** remove the `rounded-t-2xl` + shadow on
   `index !== 0` (line 67-71) — without it the stacking effect is invisible against the
   identical ivory background — and do **not** un-clamp the year font size (line 83), which
   is what stops "2000" from clipping its column.
3. **The `card-preview.mp4` system** (`lib/projects.ts` `cardPreview` field + `ui/Card.tsx`).
   492 KB replacing 28 MB. Do not point the project cards back at the hero files.
4. **`i18n/` + `proxy.ts`.** Correct for Next 16. Renaming `proxy.ts` to `middleware.ts` — the
   instinct of anyone used to Next 14/15 — will break all routing.
5. **The hero video autoplay path** (`Hero.tsx` + `VideoPlayer.tsx`). A hydration race that
   made the hero invisible on desktop was fixed in commit `569175d`. It currently works
   (`paused: false` at t=3 s). Tread carefully.

---

## Appendix — how to reproduce every measurement here

```bash
cd sbai-website
npm install
npm run build                      # expect: 22/22 static pages, 0 warnings
npx next start -p 3100

# Lighthouse (needs a Chrome binary on CHROME_PATH)
npx lighthouse@12 http://localhost:3100/fr \
  --chrome-flags="--headless=new --no-sandbox" \
  --output=json --output-path=lh-home.json

# Media reference integrity
grep -rhoE '"/(images|videos|fonts|subtitles|logo)/[^"]+"' app components lib \
  | tr -d '"' | sort -u | while read r; do [ -f "public$r" ] || echo "MISSING: $r"; done

# Unused components
for f in $(find components -name "*.tsx" | sed 's|.*/||; s|\.tsx$||'); do
  echo "$f $(grep -rl "\b$f\b" --include="*.tsx" app components lib | grep -v "/$f\.tsx$" | wc -l)"
done
```

---

*Analysis performed 2026-07-29 against commit `4826a3f`. Every number above was measured, not
estimated. Where something was not verified, it says so.*
