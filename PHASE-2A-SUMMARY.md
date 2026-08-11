# PHASE 2A — session summary (2026-08-11)

Scope of this session: **new videos + founding date + bureau de vente + deploy.**
Nothing else was touched. Phase 7 polish items (video glows, timeline refactors,
ornaments) were deliberately left alone.

- **Deployed:** https://sbai-abdelhai.vercel.app/fr
- **Commit deployed:** `f15978e` (branch `main`, pushed 2026-08-11)
- **Build:** `✓ Compiled successfully in 4.1s` · 22/22 static pages · 0 warnings, 0 type errors
- **Baseline for every "before" number below:** `8727de7`

---

## 1. What was added

### New videos (5)

All five sources were 4K HEVC CapCut edits. Re-encoded two-pass H.264 → 1080p
(bureau: 720p), audio stripped (every target is an autoplay-muted surface),
`+faststart`. Posters cut between 10% and 30% into each clip — never frame 0,
because these graded edits open on a fade.

| Output | Size | Cap | Source | Placement |
|---|---|---|---|---|
| `triple-towers/triple-towers-cinematic.mp4` | 9 120 KB | 10 MB hero | `cenimatique tripel tower.mp4` (186 MB) | **Replaces** the hero on `/fr/projets/triple-towers` **and** the homepage |
| `triple-towers/triple-towers-location.mp4` | 4 556 KB | 5 MB section | `localisatione tripple towers.mp4` (118 MB) | **New** "Le quartier" section, above the map |
| `triple-towers/triple-towers-sensors.mp4` | 3 812 KB | 5 MB section | `sensore triple towers.mp4` (75 MB) | **New** — beside the amenity icon grid |
| `del-costa/del-costa-cinematic.mp4` | 8 780 KB | 10 MB hero | `new vedio del costa.mp4` (105 MB) | **Replaces** the hero on `/fr/projets/del-costa` |
| `bureau/bureau-location.mp4` | 2 420 KB | — | `localisatione of bareau.mp4` (92 MB) | **New** — below the map in Bureau de vente |

New posters: `tt-cinematic.jpg`, `tt-quartier.jpg`, `tt-sensors.jpg`,
`dc-cinematic.jpg`, `bureau-location.jpg`.

### New sections (2)

- **`components/sections/NeighbourhoodVideo.tsx`** — full-width ambient video +
  French caption, rendered directly **above** `LocationMap` on any project that
  has `neighbourhood` footage. Currently Triple Towers only.
- **`components/sections/BureauDeVente.tsx`** — address, hours, languages,
  click-to-call, WhatsApp, "Comment nous trouver" on the left; static map,
  explicit "Ouvrir dans Google Maps" link and the office drone loop on the right.
  Rendered on `/fr` (just above the contact form) and `/fr/contact` (primary block).

### Files touched (25)

```
app/[locale]/contact/page.tsx          components/sections/HeritageStrip.tsx
app/[locale]/notre-histoire/page.tsx   components/sections/Hero.tsx
app/[locale]/page.tsx                  components/sections/NeighbourhoodVideo.tsx  (new)
components/sections/AmenitiesGrid.tsx  components/sections/ProjectPage.tsx
components/sections/BureauDeVente.tsx  lib/config.ts
   (new)                               lib/projects.ts
components/sections/FounderSection.tsx messages/{fr,ar}.json
+ 5 posters, 5 videos, PROGRESS.md
```

Commits:

```
6fc42da  fix: propagate authoritative founding date from logo
b873809  feat: integrate new cinematic + location videos for triple-towers
1aa7270  feat: integrate new cinematic video for del-costa
f15978e  feat: add bureau de vente location section with CNDP-compliant map
```

---

## 2. Founding date propagation — grep evidence

**The logo is the authority.** `logo of sbai.png` carries **"SINCE 1969"** in the
gold band. Founding year = **1969**; experience = **57 ans** (2026 − 1969). This
overturns decision D1 in `PROGRESS.md`, which had provisionally locked 1973.
D1 has been rewritten to record the resolution.

### Before — `8727de7`

```
$ grep -rn "1973|53 ans|53 سنة" app components lib messages
messages/fr.json      15 hits   (meta title, since, yearsOfHeritage, founder headline,
                                 hero subtitle, stats value, history title/intro/timeline,
                                 projets intro + meta, espace-mre copy)
messages/ar.json       8 hits
lib/config.ts:8        foundingYear: 1973, // FINAL — see PROGRESS.md D1
components/sections/HeritageStrip.tsx:28   1973    (giant watermark)
components/sections/FounderSection.tsx:10  "53 ans d'histoire"  (doc comment)
app/[locale]/notre-histoire/page.tsx:24    key: "m1973"
```

### After — `f15978e`

```
$ grep -rn "1973|53 ans|53 سنة" app components lib messages
app/[locale]/notre-histoire/page.tsx:24-27   the "m1973" JSON key + its explanatory comment
messages/fr.json:500                          "m1973": {
messages/ar.json:501                          "m1973": {
(nothing else)
```

**42 strings replaced** across both locale files, plus 4 code sites. The only
survivors are the JSON **key** `history.timeline.m1973` and the comment
explaining why it was kept — renaming it would touch both locale files and the
`CHAPTERS` array for zero visible gain. Chapter I now *displays* **1969**.

Verified on the deployed HTML:

```
$ curl -s https://sbai-abdelhai.vercel.app/fr | grep -o "Depuis 1969" | wc -l
8
$ curl -s .../fr | grep -o ".\{40\}1973.\{40\}"
timelineTitle":"De 1969 à aujourd'hui","timeline":{"m1973":{"year":"1969",...
   ^ the serialised message key, not visible text
```

Playwright on the deployed homepage: `founding year on page: 1969,1969,1969,1969,1969,1969`.

### Copy framing applied

- **Emotional / hero** → generations first: hero subtitle is now
  *"Trois générations. Depuis 1969, notre signature nous engage."*
- **Factual / meta** → *"depuis 1969"* (meta titles, footer blurb, projets intro).
- **Explicit stat callouts** → the number: *"57 ans d'expérience"*, the heritage
  stat `57`, *"Cinquante-sept ans à bâtir Tanger"*.
- **Decade wording realigned**: "au début des années 70" → "à la fin des années 60",
  which matches the founder's own interview ("fin des années 60 / début des années 70").
  Arabic equivalents updated the same way (`السبعينيات` → `أواخر الستينيات`).

Key parity between `fr.json` and `ar.json` still holds: **473 / 473**, plus the
deliberate `_translation_status` marker in Arabic.

---

## 3. Video inventory delta

| | Before | After |
|---|---|---|
| Files | 15 | **20** |
| Total weight | 78 MB | **105 MB** |
| Folders | 3 | **4** (`bureau/` added) |

Two files are now **on disk but unwired**, kept as backups exactly as agreed:
`triple-towers/hero-drone.mp4` (9.6 MB) and `del-costa/hero-exterior.mp4` (9.7 MB).
Deleting them is a safe cleanup once the client signs off on the new cinematics.

### ⚠️ Measured page weight — a real regression on the Triple Towers page

Measured with Playwright against the production build (content-length sums):

| Page | Video bytes fetched eagerly | Note |
|---|---|---|
| `/fr` | 12 024 KB | cinematic 9 120 + bureau 2 416 + 3 card previews |
| `/fr/projets/triple-towers` | **22 254 KB** | cinematic 9 120 + sensors 3 811 + location 4 552 + reel 4 771 |
| `/fr/contact` | 2 416 KB | bureau loop only |

The Triple Towers page previously fetched ~9.6 MB of video eagerly; it now fetches
~22 MB. **Cause:** `VideoPlayer` hardcodes `preload="auto"` in `ambient` mode, and
the two new sections are ambient, so the browser starts pulling them at page load
rather than when they scroll into view. That page already scored **45/100** on
performance with a 3 990 ms TBT (HANDOFF §10) — this makes it worse, not better.

**Not fixed in this session on purpose.** The fix lives inside `VideoPlayer.tsx`,
which the session brief put behind explicit approval. The clean fix is ~10 lines:
set `preload="none"` for ambient players that are not the hero and let the existing
IntersectionObserver call `load()` before `play()`. Recommended as the first item
of the next session.

---

## 4. Deploy verification

```
git push origin main          8727de7..f15978e
```

Playwright against **https://sbai-abdelhai.vercel.app** after the deploy landed:

```
ROUTE STATUS        12/12 → HTTP 200  (9 FR routes + /ar, /ar/projets/triple-towers, /ar/contact)
HOMEPAGE HERO       {src: 'triple-towers-cinematic.mp4', paused: false, t: 4}
DEL COSTA HERO      {src: 'del-costa-cinematic.mp4',     paused: false, t: 3}
TRIPLE TOWERS       cinematic + sensors + location all present
"Le quartier"       present, and ABOVE the map  {quartierIndex: 5, mapIndex: 6, correctOrder: true}
BUREAU DE VENTE     present on /fr, /fr/contact and /ar
RTL                 {"dir":"rtl","lang":"ar"}
CONSOLE ERRORS      none
MEDIA REFERENCES    68+ refs checked, 0 missing
```

Mobile 375 px horizontal overflow:

```
OVERFLOW 6px  /fr          ← pre-existing (HANDOFF §9 BUG 1, TopBar), NOT introduced here
OK            /fr/projets/triple-towers
OK            /fr/projets/del-costa
OK            /fr/contact
OK            /ar
```

---

## 5. Screenshots

`context/screenshots/phase-2a/deployed/` — captured from the **deployed** site,
consent banner pre-answered so it does not sit over the frame.

- [01-homepage-desktop-1440.png](../context/screenshots/phase-2a/deployed/01-homepage-desktop-1440.png)
- [02-triple-towers-hero.png](../context/screenshots/phase-2a/deployed/02-triple-towers-hero.png)
- [03-triple-towers-quartier.png](../context/screenshots/phase-2a/deployed/03-triple-towers-quartier.png)
- [04-triple-towers-amenities.png](../context/screenshots/phase-2a/deployed/04-triple-towers-amenities.png)
- [05-del-costa-hero.png](../context/screenshots/phase-2a/deployed/05-del-costa-hero.png)
- [06-bureau-de-vente.png](../context/screenshots/phase-2a/deployed/06-bureau-de-vente.png)
- [07-homepage-mobile-375.png](../context/screenshots/phase-2a/deployed/07-homepage-mobile-375.png)
- [08-homepage-ar-mobile-375.png](../context/screenshots/phase-2a/deployed/08-homepage-ar-mobile-375.png)
- [09-bureau-de-vente-contact.png](../context/screenshots/phase-2a/deployed/09-bureau-de-vente-contact.png)

---

## 6. Known remaining gaps — NOT touched this session

### 🔴 Still BLOCKING (from HANDOFF §11)

1. **The contact form still emails nobody.** `app/api/contact/route.ts:36` validates,
   logs to the server console, returns `{ok:true}`. Every lead is lost in production.
   Needs a Resend/SendGrid key + destination inbox; then it is ~30 minutes of work.
2. **Colour-contrast WCAG AA failure** — `.eyebrow` defaults to `#8c6d2c` on charcoal
   (3.14:1). Still present site-wide. The two components written today set
   `text-gold` explicitly so they do not add to it, but the underlying default in
   `globals.css:84-93` is unchanged.
3. **Arabic is 100% unreviewed machine translation** — and this session **added
   ~25 more machine-quality Arabic strings** (bureau + neighbourhood copy). Do not
   present `/ar` as finished.
4. ~~No deployment exists~~ — **resolved**: the site is live and this session's work
   is on it.

### 🟠 Important, untouched

5. **Performance** — LCP 7.5–8.3 s site-wide, Triple Towers 45/100 with 3 990 ms TBT,
   now carrying ~12 MB more eager video (see §3). Lighthouse was **not re-run** this session.
6. `/fr` 6 px mobile overflow (TopBar) — confirmed still present on the deployed site.
7. Invalid `<dl>` / `role="region"` markup in `FAQ.tsx`.
8. Phase 7 steps 3–10 (7 of 10) — out of scope by instruction.
9. Phase 8 SEO: no JSON-LD, `sitemap.xml`, `robots.txt` or `hreflang`. **Note:** there is
   still no `foundingDate` structured data anywhere, so the 1969 correction has no
   schema.org surface to be applied to yet.
10. Two pre-existing ESLint errors (`Card.tsx:57`, `ConsentBanner.tsx:22`,
    `react-hooks/set-state-in-effect`). Both files are on the do-not-touch list.

### 🔵 Client input still needed

The bureau de vente section is **built but running on placeholders.** Every one is
marked `TODO(client-meeting-today)`:

| Field | Placeholder in use | Where |
|---|---|---|
| Address | "Boulevard Mohammed VI, Tanger, Maroc" | `lib/config.ts` → `site.office.address` |
| Coordinates | 35.7595 / −5.8340 | `site.office.lat` / `lng` |
| Map image | generic Tanger-centre OSM tile | `site.office.mapImage` — must be regenerated on the real point |
| Hours | Lun–Ven 9h–19h · Sam 9h–13h · Dim sur RDV | `messages/*.json` → `bureau.hours*` |
| Languages | Français · العربية · English | `bureau.languages` |
| Directions | *"À 5 minutes du [repère], en face de [repère]…"* — deliberately visible as a placeholder | `bureau.directions` |

Also still open from the earlier list: CNDP declaration number, legal entity details
(RC/ICE/IF/capital), un-watermarked archive photos (35 files), the MRE guide PDF,
project pricing, Del Costa testimonial photo rights, team photos.

---

## 7. Talking points for the client meeting

1. **Open on the homepage.** The hero is now the graded cinematic, and the very first
   line the client reads is *"Depuis 1969"* — lead with the date resolution, since the
   logo is what settled it. Confirm out loud that **1969 / 57 ans** is now on every page.
2. **Show the Triple Towers page top to bottom.** It carries three of the five new
   videos: cinematic hero → panoramic lifts beside the amenities → "Le quartier" above
   the map. The neighbourhood sequence is the strongest new argument on the site: it
   answers "what is around it?" before the buyer has to ask.
3. **Bureau de vente — this is the ask.** The layout is finished and live; the address,
   hours, coordinates and the "comment nous trouver" sentences are visibly bracketed
   placeholders. Collect all six fields at the meeting and they can be swapped in
   minutes. Note the deliberate `[repère]` markers on screen — they are there so
   nothing invented gets shown as fact.
4. **Be straight about the two videos we retired.** `hero-drone.mp4` and
   `hero-exterior.mp4` are still on disk. If the client prefers the old rushes for
   either project, reverting is a one-line change.
5. **Raise the lead problem before they do.** The contact form still emails nobody.
   The single most commercially damaging item in the project is waiting on one API key
   and one inbox address. Ask for it in the room.
6. **Set expectations on Arabic.** `/ar` is live, RTL is correct, but nobody has read
   the Arabic. Either budget a native reviewer or hide `/ar` at launch — this session
   added more untranslated-reviewed strings, not fewer.
7. **Flag the speed trade-off honestly.** The new videos made the Triple Towers page
   heavier. It is a known, understood, ~10-line fix scheduled for the next session —
   better said now than discovered by the client on a phone in the room.
