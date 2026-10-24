/**
 * Buying guides: long-form pages written for search ("appartement Tanger vue
 * mer", "Daam Sakane Tanger"...). Prose lives here rather than in
 * messages/*.json because it is article copy, not UI strings.
 *
 * Facts only: project facts mirror messages/fr.json; Daam Sakane figures come
 * from the ministry page (matnuhpv.gov.ma, programme d'aide directe au
 * logement 2024-2028), checked 2026-10-24. No prices: SBAI gives them on request.
 */

export type GuideSection = { h: string; p?: string[]; list?: string[] };
export type GuideFaq = { q: string; a: string };
export type GuideText = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  whatsapp: string;
};
export type Guide = {
  slug: string;
  image: string;
  imageAlt: { fr: string; ar: string };
  /** Project pages linked at the end of the guide. */
  related: string[];
  fr: GuideText;
  ar: GuideText;
};

const DC2 = "/images/del-costa-2/2bd6c39f";

export const GUIDES: Guide[] = [
  {
    slug: "appartement-tanger-vue-mer",
    image: "/images/posters/tt-morning.jpg",
    imageAlt: {
      fr: "Les Triple Towers face à la baie de Tanger",
      ar: "الأبراج الثلاثة المطلة على خليج طنجة",
    },
    related: ["/projets/triple-towers", "/projets/del-costa-2", "/projets/les-villas-de-la-colline"],
    fr: {
      metaTitle: "Appartement à Tanger vue mer : le guide pour bien choisir",
      metaDescription:
        "Acheter un appartement avec vue mer à Tanger : Méditerranée ou Atlantique, étage, orientation, ce qu'il faut vérifier avant de signer, et les résidences SBAI face à la mer.",
      title: "Appartement à Tanger avec vue mer",
      intro:
        "Tanger est l'une des rares villes au monde à regarder deux mers. Une vraie vue mer se vérifie pourtant pièce par pièce, étage par étage. Voici ce que nous conseillons à nos clients depuis 1969.",
      sections: [
        {
          h: "Méditerranée ou Atlantique : deux façons de vivre la mer",
          p: [
            "Côté baie, la ville fait face à la Méditerranée et au détroit : lumière du matin, port, corniche et côtes espagnoles par temps clair. Côté ouest, vers Achakkar et le Cap Spartel, c'est l'océan Atlantique, ses plages ouvertes et ses couchers de soleil.",
            "Le choix dépend de votre usage : résidence principale en ville, proche des écoles et des services, ou cadre plus calme pour les week-ends et l'été.",
          ],
        },
        {
          h: "Ce qui fait une vraie vue mer",
          list: [
            "La vue depuis le séjour, pas seulement depuis un coin de balcon.",
            "L'étage : plus on monte, plus la vue est dégagée et durable.",
            "Ce qui peut se construire devant : renseignez-vous sur les terrains voisins et le plan d'aménagement.",
            "L'orientation : elle décide de la lumière et de la chaleur dans l'appartement.",
            "Le double vitrage et l'isolation : face à la mer, le vent d'est peut souffler fort.",
          ],
        },
        {
          h: "Nos résidences face à la mer",
          p: [
            "Triple Towers : des tours de 21 et 25 étages face à la Méditerranée, avec des appartements de 2 à 4 pièces, la climatisation intégrée, le double vitrage, le marbre et une vue panoramique sur la baie.",
            "Del Costa 2 : notre nouvelle résidence à Achakkar, côté Atlantique, à côté de la Résidence Del Costa déjà livrée et habitée. Huit blocs autour d'une cour plantée et de deux piscines.",
            "Les Villas de la Colline : des villas avec piscine et jardins sur les hauteurs qui dominent la baie de Tanger.",
          ],
        },
        {
          h: "Avant de signer",
          list: [
            "Visitez à plusieurs heures de la journée pour voir la lumière et entendre le bruit.",
            "Demandez le plan de l'appartement et son orientation exacte.",
            "Vérifiez le stationnement, l'ascenseur et les charges de copropriété.",
            "Pour un logement neuf, demandez où en est le permis d'habiter.",
          ],
        },
      ],
      faq: [
        {
          q: "Combien coûte un appartement vue mer à Tanger ?",
          a: "Le prix dépend du quartier, de l'étage, de la surface et de la vue. Pour nos résidences, nous communiquons les prix et les disponibilités sur demande, par téléphone ou WhatsApp.",
        },
        {
          q: "Puis-je visiter à distance ?",
          a: "Oui. Un conseiller fait la visite en direct en visioconférence et vous montre la vue depuis l'appartement. C'est ce que font la plupart de nos clients qui vivent à l'étranger.",
        },
        {
          q: "La vue mer est-elle garantie dans le temps ?",
          a: "Personne ne peut garantir ce qui sera construit sur un terrain voisin. C'est pourquoi l'étage et la position de l'immeuble comptent autant : un étage élevé face à la mer protège mieux la vue.",
        },
      ],
      whatsapp: "Bonjour, je cherche un appartement avec vue mer à Tanger. Pouvez-vous m'envoyer les disponibilités ?",
    },
    ar: {
      metaTitle: "شقة في طنجة مطلة على البحر: دليل الاختيار",
      metaDescription:
        "شراء شقة مطلة على البحر في طنجة: المتوسط أو الأطلسي، الطابق، الاتجاه، ما يجب التحقق منه قبل التوقيع، وإقامات سباعي العقارية المطلة على البحر.",
      title: "شقة في طنجة مطلة على البحر",
      intro:
        "طنجة من المدن القليلة في العالم التي تطل على بحرين. لكن الإطلالة الحقيقية على البحر تُتحقَّق منها غرفةً غرفة وطابقاً طابقاً. هذه نصائحنا لزبنائنا منذ 1969.",
      sections: [
        {
          h: "المتوسط أو الأطلسي: طريقتان للعيش قرب البحر",
          p: [
            "من جهة الخليج تطل المدينة على البحر الأبيض المتوسط والمضيق: ضوء الصباح، الميناء، الكورنيش، والسواحل الإسبانية حين يصفو الجو. ومن جهة الغرب، نحو أشقار ورأس سبارطيل، يمتد المحيط الأطلسي بشواطئه المفتوحة وغروب شمسه.",
            "يتوقف الاختيار على استعمالك: سكن رئيسي داخل المدينة قرب المدارس والخدمات، أو مكان أهدأ لعطل نهاية الأسبوع والصيف.",
          ],
        },
        {
          h: "ما الذي يصنع إطلالة حقيقية على البحر",
          list: [
            "الإطلالة من الصالون، لا من زاوية في الشرفة فقط.",
            "الطابق: كلما ارتفعت كانت الإطلالة أوسع وأدوم.",
            "ما يمكن أن يُبنى أمام العمارة: استفسر عن الأراضي المجاورة وتصميم التهيئة.",
            "الاتجاه: هو الذي يحدد الضوء والحرارة داخل الشقة.",
            "الزجاج المزدوج والعزل: أمام البحر قد تهب الرياح الشرقية بقوة.",
          ],
        },
        {
          h: "إقاماتنا المطلة على البحر",
          p: [
            "الأبراج الثلاثة: أبراج من 21 و25 طابقاً أمام البحر الأبيض المتوسط، بشقق من غرفتين إلى أربع غرف، مع تكييف مدمج وزجاج مزدوج ورخام وإطلالة بانورامية على الخليج.",
            "دل كوستا 2: إقامتنا الجديدة في أشقار، من جهة الأطلسي، بجانب إقامة ديل كوستا المسلَّمة والمأهولة. ثماني عمارات حول ساحة مشجرة ومسبحين.",
            "فيلات الهضبة: فيلات بمسبح وحدائق في المرتفعات المطلة على خليج طنجة.",
          ],
        },
        {
          h: "قبل التوقيع",
          list: [
            "زر الشقة في أوقات مختلفة من اليوم لترى الضوء وتسمع الضجيج.",
            "اطلب تصميم الشقة واتجاهها بالضبط.",
            "تحقق من موقف السيارات والمصعد وتكاليف الملكية المشتركة.",
            "في السكن الجديد، اسأل عن مرحلة رخصة السكن.",
          ],
        },
      ],
      faq: [
        {
          q: "كم ثمن شقة مطلة على البحر في طنجة؟",
          a: "يتوقف الثمن على الحي والطابق والمساحة والإطلالة. بالنسبة لإقاماتنا، نقدم الأثمنة والشقق المتوفرة عند الطلب، بالهاتف أو عبر واتساب.",
        },
        {
          q: "هل يمكنني الزيارة عن بعد؟",
          a: "نعم. يقوم مستشار بالزيارة مباشرة عبر مكالمة فيديو ويريك الإطلالة من داخل الشقة. هكذا يفعل أغلب زبنائنا المقيمين في الخارج.",
        },
        {
          q: "هل الإطلالة على البحر مضمونة مع الوقت؟",
          a: "لا أحد يستطيع أن يضمن ما سيُبنى على أرض مجاورة. لذلك يهم الطابق وموقع العمارة: الطابق العالي المواجه للبحر يحمي الإطلالة أكثر.",
        },
      ],
      whatsapp: "السلام عليكم، أبحث عن شقة مطلة على البحر في طنجة. هل يمكنكم إرسال الشقق المتوفرة؟",
    },
  },
  {
    slug: "daam-sakane-tanger",
    image: "/images/heritage/villas-bay.jpg",
    imageAlt: {
      fr: "Résidences SBAI sur la baie de Tanger",
      ar: "إقامات سباعي العقارية على خليج طنجة",
    },
    related: ["/espace-mre", "/projets/del-costa-2", "/contact"],
    fr: {
      metaTitle: "Daam Sakane à Tanger : montants, conditions et démarches",
      metaDescription:
        "Aide directe au logement Daam Sakane : 100 000 DH ou 70 000 DH selon le prix, conditions d'éligibilité (MRE compris), étapes sur daamsakane.ma et rôle du notaire. Le guide pour acheter à Tanger.",
      title: "Daam Sakane : l'aide de l'État pour acheter à Tanger",
      intro:
        "Le programme d'aide directe au logement, appelé Daam Sakane, verse une aide de l'État aux Marocains qui achètent leur premier logement, au Maroc comme à l'étranger. Il court sur la période 2024-2028. Voici l'essentiel, d'après le ministère de l'Habitat.",
      sections: [
        {
          h: "Combien ?",
          list: [
            "100 000 DH pour un logement dont le prix de vente est inférieur ou égal à 300 000 DH TTC.",
            "70 000 DH pour un logement dont le prix est supérieur à 300 000 DH et inférieur ou égal à 700 000 DH TTC.",
          ],
          p: ["L'aide est versée directement au notaire, au moment de l'achat."],
        },
        {
          h: "Qui y a droit ?",
          list: [
            "Les personnes de nationalité marocaine, résidant au Maroc ou à l'étranger (MRE).",
            "Ne pas être propriétaire d'un logement au Maroc à la date de l'achat.",
            "Ne jamais avoir bénéficié d'une aide au logement de l'État.",
          ],
        },
        {
          h: "Quels logements ?",
          list: [
            "Un logement neuf, vendu pour la première fois.",
            "Au moins deux pièces.",
            "Un permis d'habiter daté du 1er janvier 2023 ou après.",
            "Un prix de vente qui ne dépasse pas 700 000 DH TTC.",
          ],
        },
        {
          h: "Les démarches, étape par étape",
          list: [
            "Inscription et demande en ligne sur daamsakane.ma : la procédure est entièrement numérique.",
            "Accord préalable sous 7 jours.",
            "Le notaire dépose le compromis de vente et la copie du permis d'habiter.",
            "Accord définitif et virement de l'aide au notaire sous 15 jours.",
            "Signature de l'acte de vente définitif. Un décret de 2026 a porté ce délai de 30 à 60 jours après la réception des fonds par le notaire.",
          ],
        },
        {
          h: "Vos engagements",
          p: [
            "Le logement doit être votre résidence principale pendant cinq ans à compter de l'acte définitif. Une hypothèque au profit de l'État garantit cet engagement : en cas de vente avant cinq ans, l'aide doit être remboursée en totalité.",
          ],
        },
        {
          h: "Et chez SBAI ?",
          p: [
            "L'éligibilité dépend de chaque logement : son prix, sa typologie et la date de son permis d'habiter. Dites-nous votre budget et votre situation : nous vous indiquons quels logements peuvent en bénéficier et nous préparons le dossier avec le notaire.",
          ],
        },
      ],
      faq: [
        {
          q: "Les MRE peuvent-ils bénéficier de Daam Sakane ?",
          a: "Oui. Le programme vise les Marocains résidant au Maroc ou à l'étranger, aux mêmes conditions : premier logement au Maroc et aucune aide au logement reçue auparavant.",
        },
        {
          q: "Peut-on cumuler Daam Sakane avec un crédit immobilier ?",
          a: "Oui, l'aide réduit la somme à payer ; le reste peut être financé par un crédit bancaire. Votre banque vous confirmera le montant qu'elle peut prêter.",
        },
        {
          q: "Que se passe-t-il si je revends avant cinq ans ?",
          a: "L'aide doit être remboursée en totalité. Le logement doit rester votre résidence principale pendant cinq ans après l'acte définitif.",
        },
        {
          q: "Où vérifier les conditions à jour ?",
          a: "Sur la plateforme officielle daamsakane.ma et sur le site du ministère de l'Habitat. Les règles peuvent évoluer avec la loi de finances : nous vérifions toujours le dossier avec le notaire.",
        },
      ],
      whatsapp: "Bonjour, je souhaite savoir quels logements SBAI sont éligibles à Daam Sakane.",
    },
    ar: {
      metaTitle: "دعم السكن في طنجة: المبالغ والشروط والخطوات",
      metaDescription:
        "برنامج الدعم المباشر للسكن (دعم سكن): 100 ألف أو 70 ألف درهم حسب الثمن، شروط الاستفادة بما فيها مغاربة العالم، الخطوات على daamsakane.ma ودور الموثق.",
      title: "دعم السكن: مساعدة الدولة لشراء سكنك في طنجة",
      intro:
        "برنامج الدعم المباشر للسكن، المعروف بـ«دعم سكن»، يمنح مساعدة من الدولة للمغاربة الذين يشترون سكنهم الأول، داخل المغرب أو خارجه. يمتد البرنامج على الفترة 2024-2028. هذا هو الأساسي حسب وزارة الإسكان.",
      sections: [
        {
          h: "كم المبلغ؟",
          list: [
            "100.000 درهم لسكن لا يتجاوز ثمنه 300.000 درهم مع احتساب الرسوم.",
            "70.000 درهم لسكن يفوق ثمنه 300.000 درهم ولا يتجاوز 700.000 درهم مع احتساب الرسوم.",
          ],
          p: ["يُدفع الدعم مباشرة إلى الموثق عند الشراء."],
        },
        {
          h: "من يستفيد؟",
          list: [
            "حاملو الجنسية المغربية، المقيمون في المغرب أو في الخارج (مغاربة العالم).",
            "ألا يكون المستفيد مالكاً لسكن في المغرب عند تاريخ الشراء.",
            "ألا يكون قد استفاد من قبل من دعم للسكن من الدولة.",
          ],
        },
        {
          h: "أي سكن؟",
          list: [
            "سكن جديد يُباع لأول مرة.",
            "غرفتان على الأقل.",
            "رخصة سكن مؤرخة في 1 يناير 2023 أو بعده.",
            "ثمن بيع لا يتجاوز 700.000 درهم مع احتساب الرسوم.",
          ],
        },
        {
          h: "الخطوات واحدة بواحدة",
          list: [
            "التسجيل وتقديم الطلب عبر الإنترنت على daamsakane.ma: المسطرة رقمية بالكامل.",
            "موافقة أولية خلال 7 أيام.",
            "يرفع الموثق وعد البيع ونسخة من رخصة السكن.",
            "موافقة نهائية وتحويل الدعم إلى الموثق خلال 15 يوماً.",
            "توقيع عقد البيع النهائي. مرسوم صدر سنة 2026 رفع هذه المدة من 30 إلى 60 يوماً بعد توصل الموثق بالمبلغ.",
          ],
        },
        {
          h: "التزاماتك",
          p: [
            "يجب أن يكون السكن مسكنك الرئيسي لمدة خمس سنوات ابتداءً من العقد النهائي. ويضمن هذا الالتزام رهنٌ لفائدة الدولة: في حال البيع قبل خمس سنوات يجب إرجاع الدعم كاملاً.",
          ],
        },
        {
          h: "وعند سباعي؟",
          p: [
            "الاستفادة تتوقف على كل سكن: ثمنه ونوعه وتاريخ رخصة سكنه. أخبرنا بميزانيتك ووضعيتك: نحدد لك المساكن التي يمكن أن تستفيد من الدعم ونهيئ الملف مع الموثق.",
          ],
        },
      ],
      faq: [
        {
          q: "هل يمكن لمغاربة العالم الاستفادة من دعم السكن؟",
          a: "نعم. البرنامج موجه للمغاربة المقيمين في المغرب أو في الخارج بنفس الشروط: أول سكن في المغرب وعدم الاستفادة من أي دعم للسكن من قبل.",
        },
        {
          q: "هل يمكن الجمع بين دعم السكن وقرض بنكي؟",
          a: "نعم، الدعم يخفض المبلغ الذي تؤديه، ويمكن تمويل الباقي بقرض بنكي. البنك هو الذي يؤكد لك المبلغ الذي يمكنه إقراضه.",
        },
        {
          q: "ماذا يحدث إذا بعت قبل خمس سنوات؟",
          a: "يجب إرجاع الدعم كاملاً. يجب أن يبقى السكن مسكنك الرئيسي لمدة خمس سنوات بعد العقد النهائي.",
        },
        {
          q: "أين أتحقق من الشروط المحينة؟",
          a: "على المنصة الرسمية daamsakane.ma وعلى موقع وزارة الإسكان. قد تتغير القواعد مع قانون المالية، لذلك نتحقق دائماً من الملف مع الموثق.",
        },
      ],
      whatsapp: "السلام عليكم، أريد أن أعرف مساكن سباعي التي يمكن أن تستفيد من دعم السكن.",
    },
  },
  {
    slug: "acheter-appartement-neuf-tanger",
    image: "/images/heritage/towers-fountain.jpg",
    imageAlt: {
      fr: "Immeuble SBAI face aux fontaines à Tanger",
      ar: "عمارة سباعي أمام النافورات في طنجة",
    },
    related: ["/projets", "/espace-mre", "/contact"],
    fr: {
      metaTitle: "Acheter un appartement neuf à Tanger : étapes et frais",
      metaDescription:
        "Les étapes pour acheter un appartement neuf à Tanger : budget, financement, réservation, vente sur plan, notaire, titre foncier, frais d'achat et aides comme Daam Sakane.",
      title: "Acheter un appartement neuf à Tanger, étape par étape",
      intro:
        "Acheter dans le neuf, c'est un logement aux normes actuelles, sans travaux, avec un titre foncier à votre nom. C'est aussi un parcours précis. Voici comment il se déroule avec un promoteur, de la première visite à la remise des clés.",
      sections: [
        {
          h: "1. Fixer son budget",
          p: [
            "Comptez le prix du logement, les frais d'achat et, si vous empruntez, l'apport demandé par la banque. Une simulation de crédit auprès de votre banque avant les visites vous fait gagner du temps et du pouvoir de négociation.",
          ],
        },
        {
          h: "2. Choisir le projet et le promoteur",
          list: [
            "Regardez les résidences que le promoteur a déjà livrées, et allez les voir : c'est la meilleure preuve.",
            "Vérifiez les autorisations du projet et le calendrier annoncé.",
            "Comparez les plans, l'orientation, les espaces communs et le stationnement.",
          ],
        },
        {
          h: "3. Réserver",
          p: [
            "La réservation bloque le logement choisi. Le promoteur vous remet le plan, la surface et le plan de paiement. Lisez tout avant de verser quoi que ce soit, et gardez une trace écrite.",
          ],
        },
        {
          h: "4. Vente sur plan ou logement achevé",
          p: [
            "Si le logement est encore en construction, la vente se fait en l'état futur d'achèvement, encadrée par la loi 44-00 : le contrat fixe le prix, la description du logement, le délai de livraison et l'échéancier des paiements, qui suivent l'avancement des travaux.",
            "Si le logement est achevé, vous signez directement l'acte de vente chez le notaire, une fois le permis d'habiter délivré.",
          ],
        },
        {
          h: "5. Le notaire et le titre foncier",
          p: [
            "Le notaire rédige l'acte, encaisse le prix, paie les droits et inscrit la vente à la Conservation foncière. Vous recevez ensuite le certificat de propriété à votre nom.",
          ],
        },
        {
          h: "6. Les frais d'achat",
          p: [
            "Prévoyez des frais en plus du prix : droits d'enregistrement, inscription à la Conservation foncière, honoraires du notaire et frais de dossier. Ensemble, ils représentent souvent autour de 6 à 7 % du prix. Ce sont des ordres de grandeur : votre notaire vous donnera le décompte exact.",
          ],
        },
        {
          h: "7. Les aides",
          p: [
            "Si c'est votre premier logement au Maroc et que son prix ne dépasse pas 700 000 DH, l'aide Daam Sakane peut réduire votre facture de 70 000 à 100 000 DH. Lisez notre guide dédié.",
          ],
        },
      ],
      faq: [
        {
          q: "Peut-on acheter sur plan en toute sécurité ?",
          a: "Oui, si le contrat respecte la loi sur la vente en l'état futur d'achèvement et si le promoteur a un historique de livraisons. Chez SBAI, vous pouvez visiter nos résidences déjà livrées et habitées, comme Del Costa et Les Villas de la Colline.",
        },
        {
          q: "Combien de temps entre la réservation et les clés ?",
          a: "Pour un logement achevé, quelques semaines, le temps de réunir le financement et de signer chez le notaire. Pour une vente sur plan, cela dépend de l'avancement du chantier : la date de livraison figure dans le contrat.",
        },
        {
          q: "Je vis à l'étranger : dois-je venir pour signer ?",
          a: "Non. Vous pouvez donner une procuration notariale à une personne de confiance. Notre Espace MRE explique tout le parcours à distance.",
        },
      ],
      whatsapp: "Bonjour, je souhaite acheter un appartement neuf à Tanger. Pouvez-vous m'accompagner ?",
    },
    ar: {
      metaTitle: "شراء شقة جديدة في طنجة: الخطوات والمصاريف",
      metaDescription:
        "خطوات شراء شقة جديدة في طنجة: الميزانية، التمويل، الحجز، البيع في طور الإنجاز، الموثق، الرسم العقاري، مصاريف الشراء والدعم مثل دعم السكن.",
      title: "شراء شقة جديدة في طنجة، خطوة بخطوة",
      intro:
        "الشراء في الجديد يعني سكناً بمعايير اليوم، بلا أشغال، ورسماً عقارياً باسمك. وهو أيضاً مسار دقيق. هكذا يجري مع منعش عقاري، من الزيارة الأولى إلى تسلم المفاتيح.",
      sections: [
        {
          h: "1. تحديد الميزانية",
          p: [
            "احسب ثمن السكن ومصاريف الشراء، وإن كنت ستقترض، المساهمة الشخصية التي يطلبها البنك. محاكاة القرض مع بنكك قبل الزيارات توفر عليك الوقت وتقوي موقفك في التفاوض.",
          ],
        },
        {
          h: "2. اختيار المشروع والمنعش العقاري",
          list: [
            "انظر إلى الإقامات التي سلمها المنعش من قبل، واذهب لرؤيتها: هذا أفضل دليل.",
            "تحقق من تراخيص المشروع ومن الآجال المعلنة.",
            "قارن التصاميم والاتجاه والمرافق المشتركة وموقف السيارات.",
          ],
        },
        {
          h: "3. الحجز",
          p: [
            "الحجز يثبت السكن الذي اخترته. يسلمك المنعش التصميم والمساحة وجدول الأداء. اقرأ كل شيء قبل أداء أي مبلغ، واحتفظ بأثر مكتوب.",
          ],
        },
        {
          h: "4. البيع في طور الإنجاز أو سكن جاهز",
          p: [
            "إذا كان السكن ما يزال في طور البناء، يتم البيع في إطار بيع العقار في طور الإنجاز الذي ينظمه القانون 44.00: يحدد العقد الثمن ووصف السكن وأجل التسليم وجدول الأداءات المرتبط بتقدم الأشغال.",
            "إذا كان السكن جاهزاً، توقع مباشرة عقد البيع عند الموثق بعد الحصول على رخصة السكن.",
          ],
        },
        {
          h: "5. الموثق والرسم العقاري",
          p: [
            "يحرر الموثق العقد، ويتسلم الثمن، ويؤدي الرسوم، ويقيد البيع في المحافظة العقارية. بعد ذلك تتسلم شهادة الملكية باسمك.",
          ],
        },
        {
          h: "6. مصاريف الشراء",
          p: [
            "خصص مصاريف زائدة على الثمن: رسوم التسجيل، التقييد في المحافظة العقارية، أتعاب الموثق ومصاريف الملف. مجموعها في الغالب حوالي 6 إلى 7 في المائة من الثمن. هذه تقديرات تقريبية: الموثق هو من يعطيك الحساب الدقيق.",
          ],
        },
        {
          h: "7. الدعم",
          p: [
            "إذا كان هذا أول سكن لك في المغرب ولا يتجاوز ثمنه 700.000 درهم، قد يخفض دعم السكن ما تؤديه بـ70.000 إلى 100.000 درهم. اقرأ دليلنا الخاص بالموضوع.",
          ],
        },
      ],
      faq: [
        {
          q: "هل الشراء في طور الإنجاز آمن؟",
          a: "نعم، إذا احترم العقد قانون بيع العقار في طور الإنجاز وكان للمنعش تاريخ في التسليم. عند سباعي يمكنك زيارة إقاماتنا المسلمة والمأهولة، مثل ديل كوستا وفيلات الهضبة.",
        },
        {
          q: "كم من الوقت بين الحجز والمفاتيح؟",
          a: "بالنسبة لسكن جاهز، بضعة أسابيع، وهو الوقت اللازم لتوفير التمويل والتوقيع عند الموثق. أما في البيع في طور الإنجاز، فيتوقف ذلك على تقدم الأشغال: تاريخ التسليم مذكور في العقد.",
        },
        {
          q: "أقيم في الخارج: هل يجب أن آتي للتوقيع؟",
          a: "لا. يمكنك منح وكالة موثقة لشخص تثق به. فضاء مغاربة العالم يشرح المسار كاملاً عن بعد.",
        },
      ],
      whatsapp: "السلام عليكم، أريد شراء شقة جديدة في طنجة. هل يمكنكم مرافقتي؟",
    },
  },
  {
    slug: "residence-securisee-piscine-tanger",
    image: `${DC2}/DC2_R02_Aerien_Piscines.jpg`,
    imageAlt: {
      fr: "Les deux piscines de Del Costa 2 vues du ciel (image non contractuelle)",
      ar: "مسبحا دل كوستا 2 من السماء (صورة غير تعاقدية)",
    },
    related: ["/projets/del-costa-2", "/projets/del-costa", "/projets/les-villas-de-la-colline"],
    fr: {
      metaTitle: "Résidence sécurisée avec piscine à Tanger : que vérifier",
      metaDescription:
        "Appartement en résidence fermée avec piscine à Tanger : contrôle d'accès, espaces communs, syndic et charges. Del Costa, Del Costa 2 à Achakkar et Les Villas de la Colline par SBAI.",
      title: "Vivre en résidence sécurisée avec piscine à Tanger",
      intro:
        "Une résidence fermée avec piscine, c'est la tranquillité pour les familles et un vrai été à la maison. Mais d'une résidence à l'autre, la qualité de vie dépend de détails à vérifier avant d'acheter.",
      sections: [
        {
          h: "Ce qu'on attend d'une résidence fermée",
          list: [
            "Un accès contrôlé : gardiennage, portail, interphone.",
            "Un stationnement sûr, idéalement en sous-sol ou en garage privé.",
            "Des espaces communs pensés pour les enfants : jardins, aire de jeux.",
            "Une piscine bien placée, au soleil et à l'abri du vent.",
          ],
        },
        {
          h: "Les questions à poser avant d'acheter",
          list: [
            "Qui gère la résidence (syndic) et comment sont fixées les charges ?",
            "Qui entretient la piscine et les jardins, et en quelle saison la piscine est-elle ouverte ?",
            "Combien de logements partagent les espaces communs ?",
            "Le promoteur a-t-il déjà livré une résidence de ce type ? Allez la voir.",
          ],
        },
        {
          h: "Résidence Del Costa : livrée et habitée",
          p: [
            "Une résidence sécurisée avec piscine, jardins, garage privé, contrôle d'accès et aire de jeux. Elle est livrée et habitée : vous pouvez la visiter et parler à ceux qui y vivent.",
          ],
        },
        {
          h: "Del Costa 2 : la nouvelle résidence à Achakkar",
          p: [
            "Dans le même secteur, Del Costa 2 prolonge Del Costa avec le même promoteur et le même architecte. Huit blocs en R+2 avec un étage en retrait se referment autour d'une cour de 22 mètres plantée de palmiers, avec deux piscines au centre, deux cours-jardins avec fontaine et un café-restaurant de 335 m² ouvert sur la cour. Le stationnement est prévu en sous-sol et en extérieur.",
          ],
        },
        {
          h: "Les Villas de la Colline",
          p: [
            "Pour ceux qui préfèrent une maison : des villas individuelles avec jardin et piscine communs, sur les hauteurs qui dominent la baie de Tanger. Le projet est livré et habité.",
          ],
        },
      ],
      faq: [
        {
          q: "Les charges de copropriété sont-elles élevées dans une résidence avec piscine ?",
          a: "Elles sont plus élevées que dans un immeuble sans espaces communs, car elles couvrent le gardiennage et l'entretien de la piscine et des jardins. Demandez toujours le montant estimé avant de réserver.",
        },
        {
          q: "Del Costa 2 est-il déjà construit ?",
          a: "Del Costa 2 est notre nouveau projet. Les images publiées sont des projections non contractuelles. Contactez-nous pour connaître l'avancement, les typologies et le calendrier.",
        },
        {
          q: "Peut-on visiter une résidence déjà livrée ?",
          a: "Oui. Nous organisons des visites de la Résidence Del Costa et des Villas de la Colline, sur rendez-vous au bureau de vente ou par WhatsApp.",
        },
      ],
      whatsapp: "Bonjour, je cherche un appartement en résidence sécurisée avec piscine à Tanger.",
    },
    ar: {
      metaTitle: "إقامة مغلقة بمسبح في طنجة: ما يجب التحقق منه",
      metaDescription:
        "شقة في إقامة مغلقة بمسبح في طنجة: مراقبة الدخول، المرافق المشتركة، وكيل الاتحاد والتكاليف. ديل كوستا، دل كوستا 2 في أشقار وفيلات الهضبة من سباعي.",
      title: "العيش في إقامة آمنة بمسبح في طنجة",
      intro:
        "الإقامة المغلقة بمسبح تعني الطمأنينة للعائلات وصيفاً حقيقياً في البيت. لكن جودة العيش تختلف من إقامة لأخرى حسب تفاصيل يجب التحقق منها قبل الشراء.",
      sections: [
        {
          h: "ما ننتظره من إقامة مغلقة",
          list: [
            "دخول مراقب: حراسة، بوابة، أنترفون.",
            "موقف آمن للسيارات، والأفضل أن يكون تحت أرضي أو مرآباً خاصاً.",
            "مرافق مشتركة مفكر فيها للأطفال: حدائق وفضاء للعب.",
            "مسبح في مكان جيد، مشمس ومحمي من الريح.",
          ],
        },
        {
          h: "الأسئلة التي تُطرح قبل الشراء",
          list: [
            "من يسير الإقامة (وكيل الاتحاد) وكيف تحدد التكاليف؟",
            "من يعتني بالمسبح والحدائق، وفي أي موسم يكون المسبح مفتوحاً؟",
            "كم عدد المساكن التي تتقاسم المرافق المشتركة؟",
            "هل سلم المنعش إقامة من هذا النوع من قبل؟ اذهب لرؤيتها.",
          ],
        },
        {
          h: "إقامة ديل كوستا: مسلمة ومأهولة",
          p: [
            "إقامة آمنة بمسبح وحدائق ومرآب خاص ومراقبة الدخول وفضاء للعب. وهي مسلمة ومأهولة: يمكنك زيارتها والحديث مع سكانها.",
          ],
        },
        {
          h: "دل كوستا 2: الإقامة الجديدة في أشقار",
          p: [
            "في نفس المنطقة، تمتد دل كوستا 2 في استمرارية ديل كوستا مع نفس المنعش ونفس المهندس المعماري. ثماني عمارات من طابق أرضي وطابقين مع طابق متراجع تلتف حول ساحة بعرض 22 متراً مشجرة بالنخيل، وفي وسطها مسبحان، مع ساحتين-حديقتين بنافورة ومقهى-مطعم بمساحة 335 متراً مربعاً مفتوح على الساحة. موقف السيارات مبرمج تحت الأرض وفي الخارج.",
          ],
        },
        {
          h: "فيلات الهضبة",
          p: [
            "لمن يفضل منزلاً مستقلاً: فيلات فردية بحديقة ومسبح مشتركين، في المرتفعات المطلة على خليج طنجة. المشروع مسلم ومأهول.",
          ],
        },
      ],
      faq: [
        {
          q: "هل تكاليف الملكية المشتركة مرتفعة في إقامة بمسبح؟",
          a: "هي أعلى منها في عمارة بلا مرافق مشتركة، لأنها تغطي الحراسة وصيانة المسبح والحدائق. اطلب دائماً المبلغ التقديري قبل الحجز.",
        },
        {
          q: "هل دل كوستا 2 مبنية الآن؟",
          a: "دل كوستا 2 هو مشروعنا الجديد. الصور المنشورة تصورات غير تعاقدية. تواصل معنا لمعرفة تقدم الأشغال وأنواع الشقق والآجال.",
        },
        {
          q: "هل يمكن زيارة إقامة مسلمة؟",
          a: "نعم. ننظم زيارات لإقامة ديل كوستا وفيلات الهضبة، بموعد في مكتب البيع أو عبر واتساب.",
        },
      ],
      whatsapp: "السلام عليكم، أبحث عن شقة في إقامة آمنة بمسبح في طنجة.",
    },
  },
];

export const GUIDE_UI = {
  fr: {
    label: "Guides",
    indexTitle: "Guides pour acheter à Tanger",
    indexIntro:
      "Vue mer, aide Daam Sakane, achat dans le neuf, résidence avec piscine : ce que 57 ans de promotion immobilière à Tanger nous ont appris, expliqué simplement.",
    indexMetaTitle: "Guides immobiliers : acheter à Tanger",
    indexMetaDescription:
      "Les guides de SBAI Immobilier pour acheter à Tanger : appartement vue mer, Daam Sakane, achat d'un appartement neuf, résidence sécurisée avec piscine.",
    read: "Lire le guide",
    related: "Nos projets",
    faq: "Questions fréquentes",
    ctaTitle: "Une question sur votre projet ?",
    ctaBody: "Un conseiller vous répond en français, en arabe ou en darija.",
    whatsapp: "Écrire sur WhatsApp",
    call: "Appeler",
    projectNames: {
      "/projets": "Tous nos projets",
      "/projets/triple-towers": "Triple Towers",
      "/projets/del-costa-2": "Del Costa 2",
      "/projets/del-costa": "Résidence Del Costa",
      "/projets/les-villas-de-la-colline": "Les Villas de la Colline",
      "/espace-mre": "Espace MRE",
      "/contact": "Contact et bureau de vente",
    } as Record<string, string>,
  },
  ar: {
    label: "أدلة",
    indexTitle: "أدلة الشراء في طنجة",
    indexIntro:
      "الإطلالة على البحر، دعم السكن، الشراء في الجديد، الإقامة بمسبح: ما تعلمناه في 57 سنة من الإنعاش العقاري في طنجة، بشرح بسيط.",
    indexMetaTitle: "أدلة عقارية: الشراء في طنجة",
    indexMetaDescription:
      "أدلة سباعي للعقار للشراء في طنجة: شقة مطلة على البحر، دعم السكن، شراء شقة جديدة، إقامة آمنة بمسبح.",
    read: "اقرأ الدليل",
    related: "مشاريعنا",
    faq: "أسئلة متكررة",
    ctaTitle: "عندك سؤال حول مشروعك؟",
    ctaBody: "يجيبك مستشار بالعربية أو الدارجة أو الفرنسية.",
    whatsapp: "راسلنا على واتساب",
    call: "اتصل بنا",
    projectNames: {
      "/projets": "كل مشاريعنا",
      "/projets/triple-towers": "الأبراج الثلاثة",
      "/projets/del-costa-2": "دل كوستا 2",
      "/projets/del-costa": "إقامة ديل كوستا",
      "/projets/les-villas-de-la-colline": "فيلات الهضبة",
      "/espace-mre": "فضاء مغاربة العالم",
      "/contact": "الاتصال ومكتب البيع",
    } as Record<string, string>,
  },
} as const;

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
