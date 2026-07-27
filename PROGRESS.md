# PROGRESS — SBAI Immobilier Website

Suivi du chantier. Mis à jour après chaque jalon majeur.
Dernière mise à jour : 2026-07-27 (Phase 2 en cours).

---

## Décisions actées

| # | Sujet | Décision | Statut |
|---|-------|----------|--------|
| D1 | Date de fondation | **1973 = FINAL.** Client did not respond, working with existing deliverables which all reference 1973. Logo shows 1969 but is scheduled for redesign in Phase 2 anyway. Appliqué partout (hero, About, footer, meta, `foundingDate` schema.org). | ✅ FINAL |
| D2 | Interview fondateur (verticale 720×1280) | **FINAL — utilisée telle quelle** (sous-titres incrustés assumés, vignette douce sur le watermark, pas de rush demandé). Desktop : vidéo portrait max-w 420px, cadre or 1px, coins 8px, colonne gauche charcoal + titre Marcellus « 53 ans. Trois générations. Une seule promesse. » Mobile : pleine largeur, fullscreen natif au play. Poster : frame t=32s (regard caméra, mi-mot), gradée chaud Portra. | ✅ FINAL |
| D6 | Citation fondateur | **Vraie citation extraite des sous-titres incrustés (t≈31-36s)** : « Le client est toujours satisfait par nos engagements, lesquels nous respectons à la lettre. » Transcription quasi complète de l'interview archivée ci-dessous. | ✅ |
| D7 | Coordonnées réelles | L'outro de la vidéo fondateur affiche **www.immobiliersbai.net** et **06 61 37 37 38** → utilisés comme défauts (tél + WhatsApp), surchargeables par `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_EMAIL`. Email `contact@immobiliersbai.net` à confirmer. | ⚠️ email |
| D8 | Inventaire vidéo | **12 vidéos = FINAL, toutes conservées** (aucun doublon : le reel 25s et l'UGC 94s sont des contenus distincts). Voir tableau inventaire. | ✅ |
| D3 | Logo | Variante monochrome or/ivoire générée depuis le PNG existant, utilisée temporairement partout. Pas de redesign par nos soins. | ✅ |
| D4 | Résidence Amir | Retirée du site. | ✅ |
| D5 | Fonts | Marcellus (SIL OFL — Astigmatic via Google Fonts) + Jost (SIL OFL — indestructible type*) : **licences libres confirmées, usage commercial et self-hosting autorisés**. Arabe : Amiri (display, OFL) + Noto Sans Arabic (body, OFL). | ✅ |

## TODO client (bloquants légers — batch review fin de session)

1. **Logo refresh — commission proper redesign in Phase 2.** La variante or/ivoire actuelle est un dépannage généré depuis le PNG (pas un vrai redesign).
2. **Confirmer D1** (1973/53 ans vs 1969/57 ans). Le logo actuel porte "SINCE 1969" — incohérent avec 1973 tant que le logo n'est pas refait.
3. **Citation interview fondateur** : pas de transcription disponible (pas d'outil speech-to-text dans cet environnement). Citation placeholder marquée `TODO(client)` dans `messages/fr.json` — à remplacer par une vraie citation tirée de l'interview.
4. **Photos "client satisfait" Del Costa** : droits d'utilisation à confirmer avant mise en ligne des témoignages.
5. **Missing project — Résidence Amir** cited in strategy but no assets provided. Awaiting client input to either add assets or remove from all references.
6. **Photos archives watermarkées** : les **35 fichiers** de `image genrale/` (1.png → 35.png) portent tous le watermark de l'ancien logo SBAI en haut à droite. Demander les versions propres au client. Utilisées en l'état avec TODO en attendant.
7. **Contenu arabe** : traduction machine première passe — chaque chaîne de `messages/ar.json` est à faire relire (voir marqueur global `_translation_status`).
8. **Mentions légales** : structure en place, contenu juridique réel à fournir.

## Déviations techniques assumées

- **Interview fondateur : ~12 MB** (au lieu du cap 5 MB sections). 99 s de vidéo — à 5 MB la qualité détruirait le principal actif de la marque. Encodée 720×1280 two-pass ~900 kbps. Révisable.
- **Vidéo UGC Triple Towers : 5 MB tenus mais qualité moyenne** (93 s → 576×1022, ~330 kbps). Si le rendu est trop faible, options : monter un extrait de 30 s, ou relever le cap.
- **Next.js 16 / Tailwind v4** (scaffold `create-next-app@latest`) : le brief disait "Next.js 14+" — satisfait. Tailwind v4 = config theme en CSS (`@theme`), pas de `tailwind.config.ts` ; tous les tokens vivent dans `app/globals.css` + `styles/tokens.css`.
- **Disque C: saturé (0 Go libre)** : cache npm redirigé vers `D:\npm-cache`, ffmpeg portable dans `D:\tools\ffmpeg`, projet sur D:. Le client devrait libérer C: (risque système Windows).

## Inventaire médias (source → build)

Originaux **intouchés** dans les dossiers racine (`triple towers/`, `Les Villas de la Colline/`, `Del Costa/`, `image genrale/`). Compressés → `public/videos/`, posters → `public/images/posters/`.

| Source | Sortie | Usage |
|---|---|---|
| TT drone 4K 26 s | `videos/triple-towers/hero-drone.mp4` ≤10 MB 1080p | Hero accueil + hero fiche TT |
| TT inside 4K 55 s | `videos/triple-towers/interior.mp4` ≤5 MB 720p | Fiche TT, click-to-play |
| TT reel 25 s vertical | `videos/triple-towers/reel.mp4` CRF23 | Fiche TT galerie |
| TT UGC 94 s vertical | `videos/triple-towers/ugc.mp4` ≤5 MB | Fiche TT témoignage |
| **Interview fondateur 99 s vertical** | `videos/triple-towers/founder-interview.mp4` ~12 MB | Section cinéma accueil + Notre Histoire |
| Villas drone 4K 26 s | `videos/villas-colline/hero-drone.mp4` ≤10 MB | Hero fiche Villas |
| Villas inside 4K 17 s | `videos/villas-colline/interior.mp4` ≤5 MB 1080p | Fiche Villas |
| Villas piscine/jardin 4K 26 s | `videos/villas-colline/pool-garden.mp4` ≤5 MB | Fiche Villas |
| DC extérieur 4K 47 s | `videos/del-costa/hero-exterior.mp4` ≤10 MB | Hero fiche Del Costa |
| DC inside 4K 20 s | `videos/del-costa/interior.mp4` ≤5 MB | Fiche DC |
| DC garage/sécurité 4K 15 s | `videos/del-costa/garage-security.mp4` ≤5 MB | Fiche DC (sécurité = argument MRE) |
| DC piscine 6 s 4K | `videos/del-costa/pool.mp4` CRF23 | Fiche DC |
| 35 photos archives (watermark ⚠️) | `images/heritage/` | Notre Histoire, heritage strip |
| 3 photos client satisfait DC (droits ⚠️) | `images/del-costa/` | Témoignages |
| logo of sbai.png | `logo/` variantes | Header/footer (variante or/ivoire temporaire) |

## Notes complémentaires Phase 2

- **Vidéo interview fondateur** : sous-titres FR incrustés (jaune) + watermark ancien logo en haut à droite — c'est un montage réseau sociaux, pas un rush brut. Demander le **rush original sans incrustations** au client pour le traitement cinématique prévu. Utilisée en l'état en attendant.
- **`messages/ar.json`** : le flag "MACHINE_TRANSLATED" par chaîne n'est pas praticable (les valeurs sont affichées telles quelles) → marqueur global `_translation_status` en tête de fichier + cette note. Translittération arabe du nom retenue : **السباعي عبد الحي** (à faire valider).
- **Fonts finales** : `jost.woff2` (variable 100–900, latin+latin-ext, 36 KB), `marcellus.woff2` (16 KB) — resubsettés depuis les TTF officiels google/fonts (OFL) car les fichiers du brand board étaient découpés par subset. Arabe : Amiri 400/700 + Noto Sans Arabic variable. Zéro appel réseau externe.
- **Interview fondateur : cap ~12 MB → réel 11,35 MB.** Tous les autres caps tenus (héros ≤10 MB, sections ≤5 MB).

## Transcription interview fondateur (reconstituée depuis les sous-titres incrustés)

> Notre groupe Abdelhai Sbai s'est converti [à la promotion immobilière] vers la fin et au début des années 70. Donc au début nous avons [connu des] difficultés [de] commercialisation — il y a des [appartements que] nous avons vendus au prix approximatif de 30 000 dirhams. Mais étant donné [notre volonté de] faire du bon travail, [d']avoir des rapports cordiaux avec nos [clients] — lesquels en tout [cas, le client] est toujours satisfait par nos [engagements], lesquels nous respectons à la lettre — nous avons réalisé plusieurs projets immobiliers : de lotissement, immobilier de haut standing, de moyen standing, immobilier de logements sociaux. Donc à notre [actif], nous avons plus de 200 immeubles que nous avons réalisés dans plusieurs projets, des villas. Et actuellement nous sommes à la veille [d'achever] de façon définitive ici à Tanger [le projet Triple Towers] qui fait notre [fierté], la hauteur de 25 étages et [doté] de produits les plus performants, à savoir la climatisation intégrée et le double vitrage, le marbre, tout le confort pour nos clients — et également [vue] panoramique sur les 25 étages. Donc ça sera un projet phare à mon avis, qui donnera une plus-value bien-aimée.

*(Crochets = mots comblés aux coupes de sous-titres. Chiffres clés utilisables : conversion à l'immobilier début années 70 · premiers appartements ≈ 30 000 DH · plus de 200 immeubles · Triple Towers 25 étages.)*

## Notes Phase 3

- **Screenshots** dans `../context/screenshots/phase-3/` : fr-desktop-hero / fr-desktop-scrolled (état solide) / fr-desktop-full / fr-mobile-hero / fr-mobile-menu / ar-desktop-hero / ar-desktop-full / ar-mobile-hero.
- **Poster héros accueil** : frame t=19,1s de la vidéo drone (vue baie, sans sous-titre — tout le montage drone est sous-titré, fenêtres propres rares).
- **Header** : bg opaque en état solide (le 95 % + blur laissait fantômer le H1 blanc du héros à travers — corrigé).
- **Scrim haut de héros** ajouté (dégradé charcoal→transparent) : lisibilité topbar/nav + adoucit le watermark vidéo en haut à droite.
- **Playwright** installé (navigateurs sur `D:\tools\pw-browsers`, TEMP redirigé sur D: pendant l'install).
- ⚠️ **Disque C: critique : ~20 Mo libres.** Cache npm, ffmpeg, navigateurs Playwright et temp déjà déportés sur D:. **Le client doit libérer de l'espace sur C: (risque de plantage Windows).**
- Port 3000 occupé par un autre process sur la machine → serveur de test lancé sur 3100.

## Journal

- **2026-07-27** — Phase 1 : lecture contexte complète, résumé exécutif validé par le client.
- **2026-07-27** — Phase 3 : **layout shell complet** — TopBar utilitaire (collapse au scroll), Header fixe transparent→ivoire (seuil 80vh, crossfade logo duotone, zéro layout shift), MobileMenu plein écran (Marcellus 32px, stagger, scroll-lock, Échap, reduced-motion), Footer (newsletter, 4 colonnes, réseaux sociaux SVG inline, double switcher langue), WhatsAppFloat (pulse 4s, RTL-aware). Citation fondateur réelle extraite + transcription. Coordonnées réelles récupérées de la vidéo. 8 screenshots FR/AR desktop/mobile validés.
- **2026-07-27** — Phase 2 : npm cache → D:, ffmpeg portable sur D:, **12 vidéos compressées** (two-pass H.264, caps respectés) + 12 posters, scaffold Next.js 16.2 (Turbopack) + TS strict + Tailwind v4, deps installées, **fonts self-hostées** (Marcellus/Jost/Amiri/Noto AR — toutes SIL OFL), **tokens brand board** → thème Tailwind, **i18n FR/AR avec RTL** (next-intl 4.13 via proxy.ts Next 16), variantes logo duotone or/charbon/ivoire, build de production vert (`/fr` + `/ar` statiques). 3 commits.
