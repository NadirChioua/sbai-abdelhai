# Phase 3A — Client Copy Revisions Summary

Applied 2026-08-23, from M. Sbai's annotated PDF review (pages 1–19, up to the
Villas de la Colline gallery). Work done on branch
`content/client-revisions-phase-3a`, 6 commits, **not yet merged to `main` or
deployed** — see "Deployment" below.

## Modification tracking table

| Mod # | Description | Applied? | Files touched | Notes |
|---|---|---|---|---|
| 1 | Brand name — "Abdelhai" reinforcement | ✅ Yes | `messages/fr.json`, `messages/ar.json` | Single change per client's own flag resolution: MRE photo alt text only. `common.brand`, footer legal name left as-is (already correct / not to be renamed). |
| 2 | Bureau de vente real address | ✅ Yes | `lib/config.ts`, `components/sections/BureauDeVente.tsx`, `PROGRESS.md` | Address replaced. Coordinates, map image and "comment nous trouver" directions kept as placeholders — flagged, see below. |
| 3 | Founder citation passive voice | ✅ Yes | `messages/fr.json`, `messages/ar.json` | Applied at all 3 occurrences: `founder.quote`, `home.testimonials.quote1.text`, `history.values.trust.body`. |
| 4A | MRE countries list ("ou autres pays à l'étranger") | ✅ Yes | `messages/fr.json`, `messages/ar.json` | |
| 4B | MRE languages (+ espagnol, anglais) | ✅ Yes | `messages/fr.json`, `messages/ar.json` | |
| 4C | MRE photo alt (Abdelhai) | ✅ Yes | same as Mod 1 | Same single string as Mod 1. |
| 4D | MRE Point 1 financial figures | 🚩 Flagged, not applied | `components/sections/MRESection.tsx` (comment only) | See TODO list below. |
| 5 | CdM2030 Al Boraq TGV legend | ✅ Yes | `messages/fr.json`, `messages/ar.json`, `PROGRESS.md` | Layout risk flagged (new label ~3× longer than sibling stat cards). |
| 6 | Triple Towers building heights (21 & 25 étages) | ✅ Yes | `messages/fr.json`, `messages/ar.json` | Applied everywhere: description1, facts.floors, stickyDetail, tagline, metaDescription, FAQ q2, Notre Histoire chapter 2024 title (factual bleed-over only). |
| 7 | TT gallery photo 1 alt text | ✅ Yes | `messages/fr.json`, `messages/ar.json` | |
| 8 | TT "chantier" → "immeuble terminé" | ✅ Yes (conservative) | `messages/fr.json`, `messages/ar.json`, `lib/projects.ts` | Video title, hero alt ("en construction" removed). Delivery-status fact wording changed to a hedged "Livraison finale en cours" rather than "Livré" — flagged. |
| 9 | TT "Le Quartier" landmarks | ✅ Yes | `messages/fr.json`, `messages/ar.json` | Chose the legend-extension option over a new bullet list (see rationale below). |
| 10 | TT Emplacement paragraph addition | ✅ Yes | `messages/fr.json`, `messages/ar.json` | |
| 11 | TT FAQ q2/q3 edits | ✅ Yes | `messages/fr.json`, `messages/ar.json` | q5 explicitly **not** touched — flagged. |
| 12 | TT amenities list | ✅ Yes | `messages/fr.json`, `messages/ar.json`, `lib/projects.ts` | New shared keys added without removing old ones (still used by other projects). |
| 13 | Villas jardin/piscine communs (factual) | ✅ Yes | `messages/fr.json`, `messages/ar.json` | Propagated the pool-count fact to every on-page occurrence (tagline, stickyDetail, FAQ q2, Notre Histoire 2020 bleed-over) beyond the literally-listed two spots, to avoid leaving the page self-contradictory — style edits were not extrapolated. metaDescription intentionally left (SEO, out of scope). |
| 14 | Villas gallery alt texts (g4, g5) | ✅ Yes | `messages/fr.json`, `messages/ar.json` | |
| 15 | Villas video titles/legends | ✅ Yes | `messages/fr.json`, `messages/ar.json` | |

## Design/implementation choices worth noting

- **Mod 9 (Le Quartier landmarks):** extended the existing `neighbourhoodCaption`
  text rather than adding a new `<ul>` to `NeighbourhoodVideo.tsx`. That
  component is shared across projects and currently renders a single caption
  string with no list-item support; adding one would mean new props and JSX
  for a component adjacent to the HANDOFF §12 protected set. Text extension
  achieves the same visible outcome (Corniche de Tanger, proximité de la gare
  TGV both now named) with a content-only change.
- **Mod 8 (delivery status):** M. Sbai's note says "immeuble terminé," but the
  brief itself flags this as needing confirmation before switching the site's
  structural `status: "ongoing"` field or asserting "Livré." I moved the
  copy away from "chantier"/construction-site framing everywhere (video title,
  hero alt, gallery alt) but kept the delivery *fact* value as the hedged
  "Livraison finale en cours" and left `status` untouched — the conservative
  reading of an ambiguous instruction, per the ground rules.
- **Mod 13 scope:** the client's factual correction (one shared pool/garden,
  not one per villa) was applied beyond the two locations explicitly named in
  the brief (Paragraphe 2, Fiche Extérieurs) to every other place on the same
  page asserting the same now-wrong fact (tagline, sticky bar, FAQ answer) —
  otherwise the page would contradict itself within a single view. Style-only
  edits were not extended the same way.

## TODO(client-confirm-…) comments introduced

| Marker | Location | Why it needs client input |
|---|---|---|
| `TODO(coordinates)` | `lib/config.ts` (`office`), `components/sections/BureauDeVente.tsx` | The real street address (184 Borj Khalij, Tanger) is now live, but `lat`/`lng` and the map tile are still the old Tanger-centre placeholder. Guessing coordinates for a specific building risks placing a wrong pin on a real client-facing map — needs verified GPS coordinates from the client or a site visit. |
| `TODO(client-orientation)` | `messages/fr.json` `bureau.directions` (documented in `PROGRESS.md`, not re-marked in JSON since it already carries its own `[repère]` placeholder note) | Still reads "À 5 minutes du [repère]…" — the client's review didn't ask for this to change now, but it's still a placeholder. |
| `TODO(client-confirm-financial-figures)` | `components/sections/MRESection.tsx` | M. Sbai wrote "300 000" / "700 000 dh" next to Espace MRE Point 1 (accompagnement à distance). Could relate to Daam Sakane thresholds or an acquisition price range — intent unclear, nothing was changed. |
| `TODO(client-confirm-delivery-status)` | `lib/projects.ts` (`tripleTowers.status`) | "Immeuble terminé" pushed the copy away from construction-site framing, but whether the project is fully delivered (`status: "delivered"`) or in final finishing (`status: "ongoing"`, current) wasn't specified. |
| `TODO(client-clarify-Q5)` | `lib/projects.ts` (`tripleTowers.faq`) | M. Sbai marked "non" next to "Puis-je acheter depuis l'étranger ?" but the current "Oui" answer is consistent with the whole Espace MRE strategy. His mark is ambiguous (wrong answer vs. no change needed) — left as-is, flagged. |

## Deployment

**Not deployed.** All 6 commits are on `content/client-revisions-phase-3a`,
not merged into `main`. `origin/main` is what Vercel builds from, so merging
and pushing would trigger a production deploy — that's an outward-facing,
not-trivially-reversible action, so I stopped short of it pending your
go-ahead. `npm run build` passes cleanly (all 22 static routes prerendered,
`/fr` and `/ar` variants of every page, TypeScript clean) and `fr.json`/
`ar.json` key parity is verified (0 keys missing either direction).

- Latest commit on the branch: `b9b19aa` — "content: villas-colline factual
  corrections (jardin/piscine communs) and gallery alt texts"
- Once you confirm, the remaining steps are: merge to `main` (or open a PR),
  push, wait for the Vercel deploy, then verify live and capture the
  before/after screenshots the original brief asked for
  (`context/screenshots/phase-3a/client-revisions/`) — none of that has been
  done yet.

## Recommended follow-up questions for M. Sbai

1. **Espace MRE, Point 1** — what do "300 000" and "700 000 dh" refer to next
   to the "accompagnement 100 % à distance" bullet?
2. **Triple Towers FAQ Q5** ("Puis-je acheter depuis l'étranger ?") — your
   "non" mark: does it mean the current "Oui" answer is wrong, or that no
   change was needed?
3. **184 Borj Khalij, Tanger** — can you confirm exact GPS coordinates (or
   let us visit/geocode) so the map pin and static tile can be corrected?
4. **"Terrasse — non accessible"** on Triple Towers — should this amenity be
   removed from the site entirely (as done here) or just relabelled/clarified
   for a future terrace access policy?
5. **Triple Towers delivery status** — is the building fully delivered, or in
   a final finishing stage? This decides whether the site should say "Livré"
   or keep the current "Livraison finale en cours" / "En cours" status badge.
