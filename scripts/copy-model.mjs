/**
 * Builds the content model for the client copy-review deliverable.
 *
 * Every user-visible French string of the site is mapped, exactly once, to a
 * (page → section → row) slot that mirrors the order in which it renders on the
 * live site. Text is never duplicated here: rows carry the *key path* into
 * messages/fr.json, so regenerating the deliverable after a copy change is a
 * matter of re-running the script.
 *
 * Rows may instead carry `text` for the handful of strings that live in code
 * (lib/config.ts constants, hardcoded project names in the footer).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export const fr = JSON.parse(
  readFileSync(join(root, "messages", "fr.json"), "utf8"),
);

/** Reads a dotted key path out of fr.json. Throws loudly on a typo. */
export function lookup(path) {
  const value = path
    .split(".")
    .reduce((acc, k) => (acc == null ? undefined : acc[k]), fr);
  if (value === undefined) throw new Error(`Clé introuvable dans fr.json : ${path}`);
  return value;
}

/** Every leaf string in fr.json, as dotted key paths — used for the coverage audit. */
export function allKeys(node = fr, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.push(path);
    else if (Array.isArray(v)) v.forEach((_, i) => out.push(`${path}.${i}`));
    else if (v && typeof v === "object") out.push(...allKeys(v, path));
  }
  return out;
}

// Row helpers ---------------------------------------------------------------

/** Short string: label, CTA, field name, stat — rendered in a compact table. */
const s = (el, key, note) => ({ el, key, long: false, note });
/** Long string: paragraph, FAQ answer, quote — rendered italic, full width. */
const p = (el, key, note) => ({ el, key, long: true, note });
/** String that lives in code rather than in fr.json. */
const lit = (el, text, note, long = false) => ({ el, text, long, note });

/** Expands every child key of an object node into rows. */
function each(prefix, make) {
  return Object.keys(lookup(prefix)).map((k) => make(k, `${prefix}.${k}`));
}

// FAQ blocks (question + answer pairs) --------------------------------------
function faqRows(prefix) {
  return Object.keys(lookup(prefix)).flatMap((k, i) => [
    s(`Question ${i + 1}`, `${prefix}.${k}.q`),
    p(`Réponse ${i + 1}`, `${prefix}.${k}.a`),
  ]);
}

// Project pages -------------------------------------------------------------
function projectPage(id, title, slug, opts = {}) {
  const base = `projects.items.${id}`;
  const sections = [];

  sections.push({
    name: "Hero (vidéo plein écran)",
    rows: [
      s("Nom du projet", `${base}.name`),
      s("Localisation", `${base}.location`),
      s("Texte alternatif (vidéo)", `${base}.heroAlt`),
    ],
  });

  sections.push({
    name: "Présentation du projet",
    rows: [
      s("Titre", `${base}.presentationTitle`),
      p("Paragraphe 1", `${base}.description1`),
      p("Paragraphe 2", `${base}.description2`),
      ...Object.keys(lookup(`${base}.facts`)).flatMap((k) => [
        s("Fiche — libellé", `${base}.facts.${k}.label`),
        s("Fiche — valeur", `${base}.facts.${k}.value`),
      ]),
    ],
  });

  if (opts.amenityVideo) {
    sections.push({
      name: "Prestations — vidéo d'illustration",
      rows: [
        s("Texte alternatif (vidéo)", `${base}.amenityVideoAlt`),
        p("Légende", `${base}.amenityVideoCaption`),
      ],
    });
  }

  sections.push({
    name: "Galerie photos — textes alternatifs",
    rows: each(`${base}.gallery`, (k, path) =>
      s(`Photo ${k.replace("g", "")}`, path),
    ),
  });

  sections.push({
    name: "En vidéo",
    rows: Object.keys(lookup(`${base}.videos`)).flatMap((k) => [
      s("Titre de la vidéo", `${base}.videos.${k}.title`),
      s("Légende", `${base}.videos.${k}.caption`),
    ]),
  });

  if (opts.neighbourhood) {
    sections.push({
      name: "Le quartier",
      rows: [
        s("Titre", `${base}.neighbourhoodTitle`),
        p("Légende", `${base}.neighbourhoodCaption`),
        s("Texte alternatif (vidéo)", `${base}.neighbourhoodAlt`),
      ],
    });
  }

  sections.push({
    name: "Emplacement",
    rows: [
      s("Titre", `${base}.locationTitle`),
      p("Paragraphe", `${base}.locationBody`),
    ],
  });

  sections.push({
    name: "Questions fréquentes",
    rows: faqRows(`${base}.faq`),
  });

  sections.push({
    name: "Barre d'appel à l'action (fixée en bas d'écran)",
    rows: [s("Détail affiché", `${base}.stickyDetail`)],
  });

  sections.push({
    name: "Carte du projet (page « Nos projets » et accueil)",
    rows: [p("Accroche de la carte", `${base}.tagline`)],
  });

  if (opts.common) sections.push(...opts.common);

  return { title, url: `/fr/projets/${slug}`, sections };
}

// The model -----------------------------------------------------------------

export const pages = [
  {
    title: "Éléments globaux",
    url: "Présents sur toutes les pages",
    intro:
      "Ces textes apparaissent à l'identique sur l'ensemble du site. Une modification ici se répercute partout.",
    sections: [
      {
        name: "Barre supérieure (bandeau fin, tout en haut)",
        rows: [
          s("Signature", "common.tagline"),
          s("Mention", "common.since"),
        ],
      },
      {
        name: "Navigation principale",
        rows: [
          s("Lien 1", "nav.home"),
          s("Lien 2", "nav.projects"),
          s("Lien 3", "nav.history"),
          s("Lien 4", "nav.mre"),
          s("Lien 5", "nav.contact"),
          s("Bouton (menu mobile)", "nav.openMenu"),
          s("Bouton (menu mobile)", "nav.closeMenu"),
          s("Recherche — libellé", "nav.search"),
          s("Recherche — infobulle", "nav.searchSoon"),
          s("Bascule de langue", "nav.switchLocale", "Bouton vers la version arabe"),
          s("Nom de la marque", "common.brand"),
          s("Raison sociale affichée", "common.brandFull", "Pied de page et texte alternatif du logo"),
        ],
      },
      {
        name: "Boutons et appels à l'action (réutilisés sur tout le site)",
        rows: [
          s("Bouton", "common.cta.enquire", "Hero, barre d'action des pages projet"),
          s("Bouton", "common.cta.whatsapp", "Barre supérieure, pied de page, menu, pages projet"),
          s("Bouton", "common.cta.viewAllProjects", "Hero, section « Nos réalisations », pied de page"),
          s("Bouton", "common.cta.learnMore", "Section Espace MRE de l'accueil"),
        ],
      },
      {
        name: "Messages WhatsApp pré-remplis (texte inséré automatiquement dans la conversation)",
        rows: [
          p("Message général", "common.whatsappMessage"),
          p("Message depuis une page projet", "common.whatsappProjectMessage", "« {project} » est remplacé automatiquement par le nom du projet"),
          s("Libellé d'accessibilité", "common.whatsappAria"),
        ],
      },
      {
        name: "Commandes du lecteur vidéo (infobulles et accessibilité)",
        rows: [
          s("Bouton", "common.cta.play"),
          s("Bouton", "common.cta.pause"),
          s("Bouton", "common.cta.mute"),
          s("Bouton", "common.cta.unmute"),
          s("Bouton", "common.cta.fullscreen"),
        ],
      },
      {
        name: "Pied de page — infolettre",
        rows: [
          s("Titre", "footer.newsletterTitle"),
          p("Sous-titre", "footer.newsletterHint"),
          s("Libellé du champ", "footer.newsletterLabel"),
          s("Texte d'aide dans le champ", "footer.newsletterPlaceholder"),
          s("Bouton", "footer.newsletterSubmit"),
        ],
      },
      {
        name: "Pied de page — colonnes de liens",
        rows: [
          p("Texte de présentation", "footer.blurb"),
          s("Titre de colonne", "footer.projects"),
          lit("Lien projet 1", "Triple Towers"),
          lit("Lien projet 2", "Les Villas de la Colline"),
          lit("Lien projet 3", "Résidence Del Costa"),
          s("Titre de colonne", "footer.company"),
          s("Titre de colonne", "footer.contact"),
          s("Ville affichée", "footer.address"),
        ],
      },
      {
        name: "Pied de page — bandeau bas",
        rows: [
          s("Mention de droits", "footer.rights", "Précédé de « © 2026 SBAI Abdelhai & Associés — »"),
          s("Lien", "footer.legal"),
          s("Lien", "footer.privacy"),
        ],
      },
      {
        name: "Coordonnées affichées (pied de page, contact, mentions légales)",
        rows: [
          lit("Téléphone fixe", "+212 5 39 94 31 12"),
          lit("Mobile / WhatsApp", "+212 6 61 74 85 47"),
          lit("E-mail", "contact@immobiliersbai.net", "À confirmer avant la mise en ligne"),
          lit("Adresse", "Tanger, Maroc", "Adresse postale exacte à fournir"),
          lit("Adresse du bureau de vente", "Boulevard Mohammed VI, Tanger, Maroc", "Adresse provisoire — à confirmer"),
        ],
      },
      {
        name: "Bandeau de consentement (cookies)",
        rows: [
          s("Sur-titre", "consent.title"),
          p("Texte", "consent.body"),
          s("Lien", "consent.readMore"),
          s("Bouton", "consent.accept"),
          s("Bouton", "consent.refuse"),
        ],
      },
    ],
  },

  {
    title: "Page d'accueil",
    url: "/fr",
    sections: [
      {
        name: "Hero (vidéo plein écran)",
        rows: [
          s("Sur-titre", "common.since"),
          s("Titre", "home.heroTitle"),
          p("Sous-titre", "home.heroSubtitle"),
          s("Texte alternatif (vidéo)", "home.heroAlt"),
          s("Invitation à faire défiler", "home.scrollCue"),
        ],
      },
      {
        name: "Trois générations (bandeau héritage)",
        rows: [
          s("Titre", "home.heritage.title"),
          p("Paragraphe", "home.heritage.body"),
          s("Chiffre 1", "home.heritage.stats.years.value"),
          s("Légende 1", "home.heritage.stats.years.label"),
          s("Chiffre 2", "home.heritage.stats.buildings.value"),
          s("Légende 2", "home.heritage.stats.buildings.label"),
          s("Chiffre 3", "home.heritage.stats.generations.value"),
          s("Légende 3", "home.heritage.stats.generations.label"),
          s("Texte alternatif (photo 1)", "home.heritage.photo1Alt"),
          s("Texte alternatif (photo 2)", "home.heritage.photo2Alt"),
          s("Texte alternatif (photo 3)", "home.heritage.photo3Alt"),
        ],
      },
      {
        name: "Nos réalisations (les trois cartes projet)",
        rows: [
          s("Sur-titre", "home.projects.label"),
          s("Titre", "home.projects.title"),
          lit(
            "Contenu des cartes",
            "Nom, localisation et accroche de chaque projet",
            "Voir les sections Triple Towers, Les Villas de la Colline et Résidence Del Costa",
          ),
        ],
      },
      {
        name: "Le fondateur (vidéo d'interview)",
        rows: [
          s("Sur-titre", "founder.sectionTitle"),
          s("Titre", "founder.headline"),
          p("Citation", "founder.quote"),
          s("Nom", "founder.name"),
          s("Fonction", "founder.role"),
          s("Titre de la vidéo", "founder.videoTitle"),
        ],
        note: "Cette section apparaît également sur la page « Notre histoire ».",
      },
      {
        name: "Espace MRE (aperçu)",
        rows: [
          s("Sur-titre", "home.mre.label"),
          s("Titre", "home.mre.title"),
          p("Paragraphe", "home.mre.body"),
          p("Point 1", "home.mre.points.remote"),
          p("Point 2", "home.mre.points.daam"),
          p("Point 3", "home.mre.points.hours"),
          p("Message WhatsApp pré-rempli", "home.mre.whatsappMessage"),
          s("Texte alternatif (photo)", "home.mre.imageAlt"),
        ],
      },
      {
        name: "Cap sur 2030 (Coupe du Monde)",
        rows: [
          s("Sur-titre", "home.cdm.label"),
          s("Titre", "home.cdm.title"),
          p("Paragraphe", "home.cdm.body"),
          s("Chiffre 1", "home.cdm.stats.stadium.value"),
          s("Légende 1", "home.cdm.stats.stadium.label"),
          s("Chiffre 2", "home.cdm.stats.investment.value"),
          s("Légende 2", "home.cdm.stats.investment.label"),
          s("Chiffre 3", "home.cdm.stats.hotels.value"),
          s("Légende 3", "home.cdm.stats.hotels.label"),
          s("Chiffre 4", "home.cdm.stats.tgv.value"),
          s("Légende 4", "home.cdm.stats.tgv.label"),
          s("Bouton", "home.cdm.cta"),
        ],
      },
      {
        name: "Témoignages",
        rows: [
          s("Sur-titre", "home.testimonials.label"),
          s("Titre", "home.testimonials.title"),
          s("Titre de la vidéo", "home.testimonials.videoTitle"),
          s("Légende de la vidéo", "home.testimonials.videoCaption"),
          p("Citation 1", "home.testimonials.quote1.text"),
          s("Auteur 1", "home.testimonials.quote1.author"),
          s("Contexte 1", "home.testimonials.quote1.context"),
          p("Citation 2", "home.testimonials.quote2.text"),
          s("Auteur 2", "home.testimonials.quote2.author"),
          s("Contexte 2", "home.testimonials.quote2.context"),
        ],
      },
      {
        name: "Bureau de vente",
        rows: [
          lit(
            "Section complète",
            "Venez nous rencontrer — adresse, horaires, langues, plan d'accès",
            "Détaillée dans la section « Bureau de vente » de ce document",
          ),
        ],
      },
      {
        name: "Formulaire de contact (bas de page)",
        rows: [
          lit(
            "Section complète",
            "Réservez une visite — formulaire et coordonnées",
            "Détaillée dans la section « Contact » de ce document",
          ),
        ],
      },
    ],
  },

  {
    title: "Nos projets",
    url: "/fr/projets",
    sections: [
      {
        name: "En-tête de page",
        rows: [
          s("Sur-titre", "projectsIndex.label"),
          s("Titre", "projectsIndex.title"),
          p("Introduction", "projectsIndex.intro"),
        ],
      },
      {
        name: "Filtres",
        rows: [
          s("Libellé d'accessibilité", "projectsIndex.filterLabel"),
          s("Filtre 1", "projectsIndex.filters.all"),
          s("Filtre 2", "projectsIndex.filters.ongoing"),
          s("Filtre 3", "projectsIndex.filters.delivered"),
          s("Compteur de résultats", "projectsIndex.count", "« {count} » est remplacé par le nombre de projets affichés"),
        ],
      },
      {
        name: "Étiquettes de statut sur les cartes",
        rows: [
          s("Statut 1", "projectPage.status.ongoing"),
          s("Statut 2", "projectPage.status.delivered"),
        ],
      },
    ],
  },

  projectPage("tripleTowers", "Triple Towers", "triple-towers", {
    amenityVideo: true,
    neighbourhood: true,
    common: [
      {
        name: "Libellés communs aux trois pages projet",
        note: "Ces intitulés structurent les pages Triple Towers, Les Villas de la Colline et Résidence Del Costa. Ils ne sont donc listés qu'une seule fois.",
        rows: [
          s("Invitation à faire défiler", "projectPage.scrollCue"),
          s("Sur-titre — présentation", "projectPage.presentationLabel"),
          s("Sur-titre — prestations", "projectPage.amenitiesLabel"),
          s("Titre — prestations", "projectPage.amenitiesTitle"),
          s("Sur-titre — galerie", "projectPage.galleryLabel"),
          s("Titre — galerie", "projectPage.galleryTitle"),
          s("Galerie — agrandir", "projectPage.galleryOpen"),
          s("Galerie — fermer", "projectPage.galleryClose"),
          s("Galerie — précédente", "projectPage.galleryPrev"),
          s("Galerie — suivante", "projectPage.galleryNext"),
          s("Sur-titre — vidéos", "projectPage.videosLabel"),
          s("Titre — vidéos", "projectPage.videosTitle"),
          s("Sur-titre — quartier", "projectPage.neighbourhoodLabel"),
          s("Sur-titre — emplacement", "projectPage.locationLabel"),
          s("Sur-titre — questions", "projectPage.faqLabel"),
          s("Titre — questions", "projectPage.faqTitle"),
          s("Texte alternatif (carte)", "projectPage.mapTitle", "« {project} » est remplacé par le nom du projet"),
          s("Lien", "projectPage.openInMaps"),
          s("Mention de la carte", "projectPage.mapAttribution"),
        ],
      },
      {
        name: "Prestations — libellés des icônes (communs aux trois projets)",
        note: "Chaque page projet en affiche huit, choisies parmi cette liste.",
        rows: each("amenities", (k, path) => s("Prestation", path)),
      },
    ],
  }),

  projectPage("villasColline", "Les Villas de la Colline", "les-villas-de-la-colline"),

  projectPage("delCosta", "Résidence Del Costa", "del-costa"),

  {
    title: "Notre histoire",
    url: "/fr/notre-histoire",
    sections: [
      {
        name: "En-tête de page",
        rows: [
          s("Sur-titre", "history.label"),
          s("Titre", "history.title"),
          p("Introduction", "history.intro"),
          s("Texte alternatif (photo)", "history.heroImageAlt"),
        ],
      },
      {
        name: "Introduction de la chronologie",
        rows: [
          s("Sur-titre", "history.timelineLabel"),
          s("Titre", "history.timelineTitle"),
          p("Paragraphe", "history.timelineIntro"),
          s("Numérotation des chapitres", "history.chapter", "« {n} » est remplacé par le numéro du chapitre"),
          s("Libellé d'accessibilité", "history.progressLabel"),
        ],
      },
      ...Object.keys(lookup("history.timeline")).map((k, i) => ({
        name: `Chronologie — chapitre ${i + 1}`,
        rows: [
          s("Année", `history.timeline.${k}.year`),
          s("Titre", `history.timeline.${k}.title`),
          p("Paragraphe", `history.timeline.${k}.body`),
          ...(lookup(`history.timeline.${k}.imageAlt`)
            ? [s("Texte alternatif (photo)", `history.timeline.${k}.imageAlt`)]
            : []),
        ],
      })),
      {
        name: "Le fondateur (vidéo d'interview)",
        rows: [
          lit(
            "Section complète",
            "L'homme derrière 57 ans d'histoire",
            "Textes identiques à ceux de la page d'accueil — voir la section « Page d'accueil »",
          ),
        ],
      },
      {
        name: "Nos valeurs",
        rows: [
          s("Sur-titre", "history.valuesLabel"),
          s("Titre", "history.valuesTitle"),
          s("Valeur 1 — titre", "history.values.heritage.title"),
          p("Valeur 1 — texte", "history.values.heritage.body"),
          s("Valeur 2 — titre", "history.values.trust.title"),
          p("Valeur 2 — texte", "history.values.trust.body"),
          s("Valeur 3 — titre", "history.values.roots.title"),
          p("Valeur 3 — texte", "history.values.roots.body"),
        ],
      },
    ],
  },

  {
    title: "Espace MRE",
    url: "/fr/espace-mre",
    sections: [
      {
        name: "En-tête de page",
        rows: [
          s("Sur-titre", "mre.label"),
          s("Titre", "mre.title"),
          p("Introduction", "mre.intro"),
          s("Texte alternatif (photo)", "mre.heroImageAlt"),
          s("Bouton", "mre.whatsappCta"),
          p("Message WhatsApp pré-rempli", "mre.whatsappMessage"),
        ],
      },
      {
        name: "Comment ça se passe (les cinq étapes)",
        rows: [
          s("Sur-titre", "mre.processLabel"),
          s("Titre", "mre.processTitle"),
          ...Object.keys(lookup("mre.process")).flatMap((k, i) => [
            s(`Étape ${i + 1} — titre`, `mre.process.${k}.title`),
            p(`Étape ${i + 1} — texte`, `mre.process.${k}.body`),
          ]),
        ],
      },
      {
        name: "Bandeau de réassurance (quatre chiffres)",
        rows: Object.keys(lookup("mre.trust")).flatMap((k, i) => [
          s(`Chiffre ${i + 1}`, `mre.trust.${k}.value`),
          s(`Légende ${i + 1}`, `mre.trust.${k}.label`),
        ]),
      },
      {
        name: "Questions fréquentes",
        rows: [
          s("Sur-titre", "mre.faqLabel"),
          s("Titre", "mre.faqTitle"),
          ...faqRows("mre.faq"),
        ],
      },
      {
        name: "Guide pratique MRE (formulaire de téléchargement)",
        rows: [
          s("Sur-titre", "mre.guide.label"),
          s("Titre", "mre.guide.title"),
          p("Paragraphe", "mre.guide.body"),
          s("Libellé du champ", "mre.guide.emailLabel"),
          s("Bouton", "mre.guide.submit"),
          s("Bouton pendant l'envoi", "mre.guide.sending"),
          s("Confirmation — titre", "mre.guide.successTitle"),
          p("Confirmation — texte", "mre.guide.successBody"),
          p("Message d'erreur", "mre.guide.error"),
          p("Mention de confidentialité", "mre.guide.note"),
        ],
      },
    ],
  },

  {
    title: "Bureau de vente",
    url: "Section présente sur la page d'accueil et sur la page Contact",
    intro:
      "Ce bloc est identique aux deux endroits où il apparaît : il n'est donc listé qu'une seule fois.",
    sections: [
      {
        name: "En-tête du bloc",
        rows: [
          s("Sur-titre", "bureau.label"),
          s("Titre", "bureau.title"),
          s("Titre — adresse", "bureau.addressTitle"),
        ],
      },
      {
        name: "Horaires et langues",
        rows: [
          s("Libellé", "bureau.hoursLabel"),
          s("Horaires — semaine", "bureau.hoursWeekdays"),
          s("Horaires — samedi", "bureau.hoursSaturday"),
          s("Horaires — dimanche", "bureau.hoursSunday"),
          s("Libellé", "bureau.languagesLabel"),
          s("Langues", "bureau.languages"),
          p("Message WhatsApp pré-rempli", "bureau.whatsappMessage"),
        ],
      },
      {
        name: "Comment nous trouver",
        rows: [
          s("Titre", "bureau.directionsTitle"),
          p("Texte d'orientation", "bureau.directions", "À REMPLACER — texte provisoire en attente de vos indications"),
          s("Texte alternatif (carte)", "bureau.mapAlt"),
          s("Mention de la carte", "bureau.mapAttribution"),
          s("Lien", "bureau.openInMaps"),
          s("Texte alternatif (vidéo)", "bureau.videoAlt"),
          s("Légende de la vidéo", "bureau.videoCaption"),
        ],
      },
    ],
  },

  {
    title: "Contact",
    url: "/fr/contact",
    sections: [
      {
        name: "En-tête de page",
        rows: [
          s("Sur-titre", "contactPage.label"),
          s("Titre", "contactPage.title"),
          p("Introduction", "contactPage.intro"),
        ],
      },
      {
        name: "Bandeau de coordonnées",
        rows: [
          s("Libellé", "contactPage.addressLabel"),
          s("Libellé", "contactPage.phoneLabel"),
          s("Libellé", "contactPage.emailLabel"),
          s("Libellé", "contactPage.hoursLabel"),
          s("Horaires", "contactPage.hours"),
          s("Langues", "contactPage.languages"),
        ],
      },
      {
        name: "Bureau de vente",
        rows: [
          lit(
            "Section complète",
            "Venez nous rencontrer",
            "Voir la section « Bureau de vente » de ce document",
          ),
        ],
      },
      {
        name: "Formulaire de contact — en-tête",
        note: "Ce formulaire est repris au bas de toutes les pages du site (accueil, projets, notre histoire, espace MRE, contact).",
        rows: [
          s("Sur-titre", "contactForm.label"),
          s("Titre", "contactForm.title"),
          p("Paragraphe", "contactForm.body"),
          s("Bouton", "contactForm.whatsappCta"),
          s("Mention", "contactForm.orCall"),
        ],
      },
      {
        name: "Formulaire de contact — champs",
        rows: [
          s("Champ 1", "contactForm.fields.name"),
          s("Champ 2", "contactForm.fields.phone"),
          s("Champ 3", "contactForm.fields.email"),
          s("Champ 4", "contactForm.fields.project"),
          s("Champ 5", "contactForm.fields.budget"),
          s("Champ 6", "contactForm.fields.message"),
          s("Choix — projet", "contactForm.projectOptions.autre", "Les trois autres choix reprennent les noms des projets"),
          s("Choix — budget 1", "contactForm.budgetOptions.nd"),
          s("Choix — budget 2", "contactForm.budgetOptions.lt1m"),
          s("Choix — budget 3", "contactForm.budgetOptions.m1m2"),
          s("Choix — budget 4", "contactForm.budgetOptions.m2m4"),
          s("Choix — budget 5", "contactForm.budgetOptions.gt4m"),
        ],
      },
      {
        name: "Formulaire de contact — envoi, erreurs et confirmation",
        rows: [
          s("Bouton", "contactForm.submit"),
          s("Bouton pendant l'envoi", "contactForm.sending"),
          s("Erreur — nom", "contactForm.errors.name"),
          s("Erreur — téléphone", "contactForm.errors.phone"),
          s("Erreur — e-mail", "contactForm.errors.email"),
          s("Erreur — message", "contactForm.errors.message"),
          s("Erreur — champ vide", "contactForm.errors.required"),
          s("Confirmation — titre", "contactForm.successTitle"),
          p("Confirmation — texte", "contactForm.successBody"),
          s("Bouton après envoi", "contactForm.sendAnother"),
          p("Message d'erreur d'envoi", "contactForm.errorBody"),
        ],
      },
    ],
  },

  {
    title: "Mentions légales",
    url: "/fr/mentions-legales",
    sections: [
      {
        name: "En-tête de page",
        rows: [
          s("Sur-titre", "legal.label"),
          s("Titre", "legal.title"),
          p("Introduction", "legal.intro"),
        ],
      },
      ...Object.keys(lookup("legal.sections")).map((k) => ({
        name: `Rubrique — ${lookup(`legal.sections.${k}.title`)}`,
        rows: [
          s("Titre", `legal.sections.${k}.title`),
          p("Texte", `legal.sections.${k}.body`),
          ...lookup(`legal.sections.${k}.fields`).map((_, i) =>
            s(`Information à fournir ${i + 1}`, `legal.sections.${k}.fields.${i}`),
          ),
        ],
      })),
      {
        name: "Mentions de bas de page",
        rows: [
          s("Marqueur des informations manquantes", "legal.todo"),
          s("Date de mise à jour", "legal.lastUpdate"),
        ],
      },
    ],
  },

  {
    title: "Métadonnées SEO",
    url: "Textes invisibles sur la page — affichés par Google et lors du partage d'un lien",
    intro:
      "Le « titre » est la ligne bleue cliquable dans les résultats Google ; la « description » est le paragraphe gris juste en dessous. Ils n'apparaissent pas sur le site lui-même mais déterminent la façon dont chaque page est présentée.",
    sections: [
      {
        name: "Site entier (valeur par défaut)",
        rows: [
          s("Titre", "metadata.title"),
          p("Description", "metadata.description"),
          lit("Gabarit des autres pages", "[Titre de la page] | SBAI Immobilier"),
        ],
      },
      {
        name: "Nos projets",
        rows: [
          s("Titre", "projectsIndex.metaTitle"),
          p("Description", "projectsIndex.metaDescription"),
        ],
      },
      {
        name: "Triple Towers",
        rows: [
          s("Titre", "projects.items.tripleTowers.metaTitle"),
          p("Description", "projects.items.tripleTowers.metaDescription"),
        ],
      },
      {
        name: "Les Villas de la Colline",
        rows: [
          s("Titre", "projects.items.villasColline.metaTitle"),
          p("Description", "projects.items.villasColline.metaDescription"),
        ],
      },
      {
        name: "Résidence Del Costa",
        rows: [
          s("Titre", "projects.items.delCosta.metaTitle"),
          p("Description", "projects.items.delCosta.metaDescription"),
        ],
      },
      {
        name: "Notre histoire",
        rows: [
          s("Titre", "history.metaTitle"),
          p("Description", "history.metaDescription"),
        ],
      },
      {
        name: "Espace MRE",
        rows: [
          s("Titre", "mre.metaTitle"),
          p("Description", "mre.metaDescription"),
        ],
      },
      {
        name: "Contact",
        rows: [
          s("Titre", "contactPage.metaTitle"),
          p("Description", "contactPage.metaDescription"),
        ],
      },
      {
        name: "Mentions légales",
        rows: [
          s("Titre", "legal.metaTitle"),
          p("Description", "legal.metaDescription"),
        ],
      },
    ],
  },

  {
    title: "Textes en réserve",
    url: "Rédigés mais non affichés à ce jour",
    intro:
      "Ces formulations existent dans le site mais aucune page ne les affiche actuellement. Elles sont soumises à votre relecture au même titre que les autres : elles serviront dès qu'un bouton ou un bloc en aura l'usage.",
    sections: [
      {
        name: "Boutons et mentions en réserve",
        rows: [
          s("Mention", "common.yearsOfHeritage"),
          s("Bouton", "common.cta.contact"),
          s("Bouton", "common.cta.call"),
          s("Bouton", "common.cta.discover"),
        ],
      },
      {
        name: "Bloc « Nous trouver » de la page Contact",
        note: "Ce bloc a été retiré de la page Contact au profit du bureau de vente, qui porte déjà sa propre carte.",
        rows: [
          s("Sur-titre", "contactPage.mapLabel"),
          s("Titre", "contactPage.mapTitle"),
          p("Paragraphe", "contactPage.mapBody"),
          s("Texte alternatif (carte)", "contactPage.mapEmbedTitle"),
          s("Lien", "contactPage.openInMaps"),
          s("Mention de la carte", "contactPage.mapAttribution"),
        ],
      },
    ],
  },
];

/** Resolves a row to its final French text. */
export function rowText(row) {
  return row.text !== undefined ? row.text : lookup(row.key);
}

/** Coverage audit: which fr.json keys made it into the document. */
export function coverage() {
  const used = new Set();
  for (const page of pages)
    for (const section of page.sections)
      for (const row of section.rows) if (row.key) used.add(row.key);

  const all = allKeys();
  return {
    total: all.length,
    used: used.size,
    missing: all.filter((k) => !used.has(k)),
    rows: pages.reduce(
      (n, p) => n + p.sections.reduce((m, s2) => m + s2.rows.length, 0),
      0,
    ),
  };
}
