# PROGRESS — SBAI Immobilier Website

Suivi du chantier. Mis à jour après chaque jalon majeur.
Dernière mise à jour : 2026-07-27 (Phase 2 en cours).

---

## Décisions actées

| # | Sujet | Décision | Statut |
|---|-------|----------|--------|
| D1 | Date de fondation | **RÉSOLU 2026-08-11 — 1969 = FINAL.** Le logo fait foi (« SINCE 1969 »). Année de fondation = **1969**, expérience = **57 ans** (2026 − 1969). L'interview du fondateur évoque « la fin des années 60 / le début des années 70 », ce qui est cohérent avec 1969. Propagé partout : `messages/fr.json`, `messages/ar.json`, `lib/config.ts`, HeritageStrip, FounderSection, chronologie Notre Histoire, meta. La clé JSON `history.timeline.m1973` est **conservée telle quelle** (renommage = beaucoup de fichiers, zéro gain visuel) ; seule l'année affichée passe à 1969 — commentaire explicatif dans `app/[locale]/notre-histoire/page.tsx`. Le client sera informé à la réunion d'aujourd'hui. | ✅ FINAL |
| D2 | Interview fondateur (verticale 720×1280) | **FINAL — utilisée telle quelle** (sous-titres incrustés assumés, vignette douce sur le watermark, pas de rush demandé). Desktop : vidéo portrait max-w 420px, cadre or 1px, coins 8px, colonne gauche charcoal + titre Marcellus « 57 ans. Trois générations. Une seule promesse. » (53 → 57 suite à D1) Mobile : pleine largeur, fullscreen natif au play. Poster : frame t=32s (regard caméra, mi-mot), gradée chaud Portra. | ✅ FINAL |
| D6 | Citation fondateur | **Vraie citation extraite des sous-titres incrustés (t≈31-36s)** : « Le client est toujours satisfait par nos engagements, lesquels nous respectons à la lettre. » Transcription quasi complète de l'interview archivée ci-dessous. | ✅ |
| D7 | Coordonnées réelles | **Confirmées par le client via la bio Instagram @sbaimmobiliertanger (2026-07-27)** : fixe **05 39 94 31 12**, mobile/WhatsApp **06 61 74 85 47** (remplace le 06 61 37 37 38 de l'outro vidéo). Surchargeables par `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_MOBILE` / `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_EMAIL`. Email `contact@immobiliersbai.net` encore à confirmer. Copy réelle utilisable relevée dans la bio : « Depuis plus de 53 années, notre signature nous engage. » | ⚠️ email |
| D8 | Inventaire vidéo | **12 vidéos = FINAL, toutes conservées** (aucun doublon : le reel 25s et l'UGC 94s sont des contenus distincts). Voir tableau inventaire. | ✅ |
| D3 | Logo | Variante monochrome or/ivoire générée depuis le PNG existant, utilisée temporairement partout. Pas de redesign par nos soins. | ✅ |
| D4 | Résidence Amir | Retirée du site. | ✅ |
| D5 | Fonts | Marcellus (SIL OFL — Astigmatic via Google Fonts) + Jost (SIL OFL — indestructible type*) : **licences libres confirmées, usage commercial et self-hosting autorisés**. Arabe : Amiri (display, OFL) + Noto Sans Arabic (body, OFL). | ✅ |

## TODO client (bloquants légers — batch review fin de session)

1. **Logo refresh — commission proper redesign in Phase 2.** La variante or/ivoire actuelle est un dépannage généré depuis le PNG (pas un vrai redesign).
2. ~~**Confirmer D1** (1973/53 ans vs 1969/57 ans).~~ **RÉSOLU le 2026-08-11** : le logo fait foi → 1969 / 57 ans, propagé sur tout le site. Voir D1.
3. **Citation interview fondateur** : pas de transcription disponible (pas d'outil speech-to-text dans cet environnement). Citation placeholder marquée `TODO(client)` dans `messages/fr.json` — à remplacer par une vraie citation tirée de l'interview.
4. **Photos "client satisfait" Del Costa** : droits d'utilisation à confirmer avant mise en ligne des témoignages.
5. **Missing project — Résidence Amir** cited in strategy but no assets provided. Awaiting client input to either add assets or remove from all references.
6. **Photos archives watermarkées** : les **35 fichiers** de `image genrale/` (1.png → 35.png) portent tous le watermark de l'ancien logo SBAI en haut à droite. Demander les versions propres au client. Utilisées en l'état avec TODO en attendant.
7. **Contenu arabe** : traduction machine première passe — chaque chaîne de `messages/ar.json` est à faire relire (voir marqueur global `_translation_status`).
8. **Mentions légales** : structure en place, contenu juridique réel à fournir.
9. **Envoi des leads** : `/api/contact` valide et journalise les demandes côté serveur, mais **n'envoie encore aucun e-mail**. Fournir une clé Resend (ou SendGrid) + la boîte de réception de destination → branchement en 10 minutes. En attendant, le formulaire met WhatsApp en avant comme canal le plus rapide, donc aucune promesse n'est faite au visiteur.
10. **Adresse postale exacte** du bureau à Tanger (footer, page Contact, épingle Google Maps, schema.org LocalBusiness) — actuellement « Tanger, Maroc ». Variables prêtes : `NEXT_PUBLIC_ADDRESS`, `NEXT_PUBLIC_MAP_QUERY`.
11. **Prix des projets** : aucun prix n'est documenté, donc aucun n'est inventé — toutes les fiches affichent « Sur demande ». Fournir les grilles pour les afficher.
12. **Guide MRE en PDF** : le formulaire de capture existe et enregistre la demande, mais **le PDF n'existe pas encore**. Le message de confirmation annonce un envoi par e-mail — aucun téléchargement cassé n'est promis.
13. **Horaires d'ouverture** affichés sur la page Contact (lun-ven 9h-18h30, sam 9h-13h) : à confirmer.
14. **Photos d'équipe** : non fournies. La section « équipe » de Notre Histoire est volontairement omise plutôt que remplie d'images de banque.
15. **~~Carte Google~~ — RÉSOLU en Phase 7** : les iframes Google ont été supprimées pour non-conformité CNDP. Cartes désormais statiques et auto-hébergées (OpenStreetMap). Voir « Conformité & vie privée ».
16. **Numéro CNDP** : marqueur `[EN COURS D'ENREGISTREMENT]` dans les Mentions légales — à remplacer par le vrai numéro de déclaration.
17. **Adresses exactes pour les épingles de carte** : les cartes sont centrées au niveau du quartier (Malabata, Cap Spartel, Tanger sud, centre-ville). Fournir les adresses précises pour recentrer.

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

## Pièges techniques rencontrés (à connaître pour la suite)

- **Tailwind v4 — conflits d'utilitaires** : deux bugs réels causés par la même mécanique. (1) Les champs du formulaire s'affichaient en blanc sur charbon : `bg-transparent` passé en `className` perdait contre le `bg-white` de la primitive (Tailwind arbitre par ordre dans la feuille CSS, pas par ordre dans la chaîne de classes) → résolu par une prop `tone="light|dark"` sur `Input`/`Textarea`/`Select`. (2) Les libellés de stats débordaient sur mobile : `.micro-label` était du CSS **non layeré**, donc prioritaire sur *tous* les utilitaires Tailwind → `.heading-display` et `.micro-label` déplacés dans `@layer components`. **Règle : ne jamais surcharger une classe composant par un utilitaire sans vérifier le rendu.**
- **Posters vidéo** : quasiment toutes les vidéos sources sont sous-titrées en dur du début à la fin. Un script de détection (`bande basse : pixels très clairs / jaunes / verts + gradient`) a été écrit pour trouver les rares fenêtres propres. Timestamps retenus : TT drone 19,1 s · Villas 8,0 s · Del Costa 25,0 s · UGC 78,0 s · Fondateur 32,0 s.

## Phase 6 — revue post-Phase 5 : 3 problèmes corrigés

### Problème 1 — « la vidéo hero ne joue qu'en vue mobile »

**Diagnostic (mesuré, pas supposé).** La vidéo jouait déjà en desktop : `paused=false`,
`currentTime=3,78 s`, `readyState=4`. Elle était simplement **invisible** (`opacity: 0`).
Le fondu d'apparition dépendait de `onLoadedData` ; quand `loadeddata` se déclenche **avant
l'hydratation React**, l'événement est perdu et l'état `ready` ne bascule jamais. Ce n'est pas
une règle de viewport : l'émulation mobile rechargeait la page avec un timing qui gagnait la
course. Aucune des 7 causes classiques suspectées n'était en jeu (`muted` et `playsInline` bien
présents dans le HTML SSR, MIME `video/mp4`, statut 200).

**Correctif.** Lecture directe de `readyState` au montage + `onCanPlay` en second signal ;
`autoPlay` natif et `preload="auto"` en mode ambient ; `muted` forcé avant `play()` ; **bouton
de lecture ivoire de repli** si la promesse est refusée (Safari économie d'énergie, extensions) ;
suppression de `crossOrigin="anonymous"` (inutile en same-origin, force des requêtes CORS).

**Vérification.** Playwright : desktop `paused=false, currentTime=4,98 s, opacity=1`.
Capture `hero-video-playing-desktop.png` — plan à t≈5 s (gros plan de la tour), visuellement
distinct du poster (plan large de la baie à t=19,1 s).

### Problème 2 — vidéos non branchées

**Diagnostic.** 5 vidéos sur 12 référencées ; les 7 orphelines appartenaient toutes aux pages
projet, qui n'existaient pas encore.

**Correctif.** Les 12 vidéos sont rendues par `<VideoPlayer />`. Images de galerie extraites des
rushes eux-mêmes, filtrées par le détecteur de sous-titres incrustés.

**Vérification.** Audit automatisé → `context/screenshots/phase-6/video-inventory.md` :
12/12 utilisées, 0 orpheline, 0 MIME incorrect, 0 poster cassé.

### Problème 3 — navigation cassée / pages manquantes

**Diagnostic.** Cause (a) : seul `app/[locale]/page.tsx` existait. Les liens étaient corrects —
les préchargements en échec visaient déjà `/fr/projets`, donc `<Link>` next-intl fonctionnait ;
il manquait uniquement les pages.

**Correctif.** 8 pages construites (index projets + 3 fiches + Notre Histoire + Espace MRE +
Contact + Mentions légales), FR et AR.

**Vérification.** Crawler de liens : **18 pages, 0 cassée, 0 échec de ressource**. Parcours
testés individuellement : logo → accueil, carte projet, lien footer, CTA hero, menu mobile,
bascule de langue (`/fr/projets/triple-towers` → `/ar/projets/triple-towers`, page conservée),
barre CTA sticky visible. Débordement horizontal = 0 px sur les 8 pages.

## Conformité & vie privée (loi 09-08 / CNDP) — livrable juridique

**Risque identifié en Phase 7 et corrigé le 2026-07-27.** L'audit UX a révélé que l'iframe Google
Maps déclenchait **plus de 40 requêtes tierces** (dont `fonts.googleapis.com` et
`fonts.gstatic.com`) et déposait des identifiants Google **avant toute interaction du visiteur** —
en contradiction directe avec la page Mentions légales du site et avec la loi 09-08 relative à la
protection des données à caractère personnel (sanctions jusqu'à 300 000 MAD).

### Ce qui a été fait

| Mesure | État |
|---|---|
| Suppression de **toutes** les iframes Google Maps | ✅ |
| Cartes remplacées par des **images statiques auto-hébergées**, générées au build depuis les tuiles OpenStreetMap (`public/images/maps/`) | ✅ |
| Lien « Voir sur Google Maps » en nouvel onglet — le départ vers Google devient un **acte volontaire** de l'utilisateur | ✅ |
| Attribution « Fond de carte © OpenStreetMap » affichée (obligation ODbL) | ✅ |
| Polices auto-hébergées — **vérifié** : aucune requête vers `googleapis.com` / `gstatic.com` | ✅ |
| Aucune iframe YouTube / réseau social sur le site | ✅ |
| Bandeau de consentement, **« Accepter » et « Refuser » de poids visuel strictement identique** (160×44 px chacun), choix mémorisé en `localStorage` | ✅ |
| Garde `lib/consent.ts` : tout script tiers futur doit appeler `hasConsent()` — refus par défaut | ✅ |
| Section « Données personnelles » et « Cookies » des Mentions légales réécrites en contenu réel (responsable, finalité, droits, absence de tiers) | ✅ |
| Numéro de déclaration CNDP | ⚠️ `[EN COURS D'ENREGISTREMENT]` — à obtenir auprès du client |

### Vérification (Playwright, contexte vierge, 6 pages parcourues)

```
THIRD-PARTY REQUESTS: NONE
COOKIES SET: localhost NEXT_LOCALE
```

Le seul cookie déposé est **`NEXT_LOCALE`**, first-party et strictement nécessaire (il mémorise
la langue choisie). À ce titre il est exempté de consentement préalable, comme un cookie de
session — ce point est expliqué dans les Mentions légales.

### À faire côté client

1. Obtenir le **numéro de déclaration CNDP** et remplacer le marqueur.
2. Fournir la **durée de conservation** des demandes et le nom du **responsable de traitement**.
3. Si un outil de mesure d'audience est souhaité plus tard, il devra passer par `hasConsent()` —
   ne jamais l'insérer directement dans le layout.

## Journal

- **2026-07-27** — Phase 6 : correction des 3 problèmes ci-dessus + **8 pages complètes** FR/AR
  (443 clés de traduction à parité), galerie masonry CSS-columns avec lightbox accessible
  (flèches + Échap), accordéon FAQ, carte Google désaturée par filtre CSS, barre CTA sticky,
  formulaire de contact prérempli selon le projet.
- **2026-07-27** — Phase 5 : **homepage complète** — 8 sections dans l'ordre imposé (Hero vidéo drone ambient, Heritage 1973 + stats + archives, grille 3 projets, section fondateur cinématique, Espace MRE, CdM 2030, témoignages, formulaire). Contenu FR/AR intégral rédigé (aucun lorem ipsum, chiffres réels du document stratégie + interview). `/api/contact` avec validation Zod partagée client/serveur + honeypot. Formulaire testé de bout en bout (validation FR affichée, soumission → panneau succès). Zéro débordement horizontal sur les 4 viewports FR/AR desktop/mobile.
- **2026-07-27** — Phase 1 : lecture contexte complète, résumé exécutif validé par le client.
- **2026-07-27** — Phase 4 : **primitives UI** — `Button` (pill, 4 variantes + déclinaisons Link/Anchor), `ProjectCard`/`Card`, `Input`/`Textarea`/`Select` (RHF-ready, erreurs ARIA), **`VideoPlayer`** (modes ambient/feature, pause hors viewport, poster fade-in, contrôles custom, slot VTT, vignette coin watermark, reduced-motion → jamais d'autoplay), `StickyCTABar` (remonte le float WhatsApp via variable CSS), `RevealOnScroll` + `ParallaxWrapper`. **Sous-titres WebVTT réels FR/AR** de l'interview fondateur générés depuis la transcription (`public/subtitles/`).
- **2026-07-27** — Phase 3 : **layout shell complet** — TopBar utilitaire (collapse au scroll), Header fixe transparent→ivoire (seuil 80vh, crossfade logo duotone, zéro layout shift), MobileMenu plein écran (Marcellus 32px, stagger, scroll-lock, Échap, reduced-motion), Footer (newsletter, 4 colonnes, réseaux sociaux SVG inline, double switcher langue), WhatsAppFloat (pulse 4s, RTL-aware). Citation fondateur réelle extraite + transcription. Coordonnées réelles récupérées de la vidéo. 8 screenshots FR/AR desktop/mobile validés.
- **2026-07-27** — Phase 2 : npm cache → D:, ffmpeg portable sur D:, **12 vidéos compressées** (two-pass H.264, caps respectés) + 12 posters, scaffold Next.js 16.2 (Turbopack) + TS strict + Tailwind v4, deps installées, **fonts self-hostées** (Marcellus/Jost/Amiri/Noto AR — toutes SIL OFL), **tokens brand board** → thème Tailwind, **i18n FR/AR avec RTL** (next-intl 4.13 via proxy.ts Next 16), variantes logo duotone or/charbon/ivoire, build de production vert (`/fr` + `/ar` statiques). 3 commits.
