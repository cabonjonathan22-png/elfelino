import type { Brand } from "@/lib/types";

// Mock brand content — editable without touching component code.
export const BRANDS: Brand[] = [
  {
    slug: "el-felino",
    name: "EL FELINO",
    shortName: "Felino",
    tagline: "Premium Sportswear — chic et félin",
    positioning: "La grâce à l'état pur",
    description:
      "EL FELINO habille le mouvement d'une élégance féline : des lignes fluides, une chute parfaite, une allure qui ne fait aucun bruit mais que l'on remarque toujours.",
    story: [
      "EL FELINO est née d'une idée simple : le sportswear peut être aussi silencieux qu'un félin et aussi précis qu'un métronome.",
      "Chaque pièce est pensée pour épouser le corps sans jamais le contraindre — une seconde peau taillée dans des matières nobles, pensée pour la ville comme pour l'effort.",
      "Ici, l'exigence technique se porte avec désinvolture. Le noir profond et le blanc pur deviennent une signature, jamais un uniforme.",
    ],
    values: [
      {
        title: "Grâce",
        description: "Des coupes fluides qui suivent le mouvement plutôt que de le contraindre.",
      },
      {
        title: "Précision",
        description: "Chaque finition est ajustée au millimètre, comme une démarche féline.",
      },
      {
        title: "Discrétion",
        description: "Un luxe qui se ressent avant de se voir — jamais criard, toujours présent.",
      },
    ],
    heroLabel: "Collection Signature",
  },
  {
    slug: "rshadow",
    name: "RSHADOW",
    shortName: "RShadow",
    tagline: "Premium Training & Lifestyle — performance",
    positioning: "L'ombre qui devance la lumière",
    description:
      "RSHADOW conçoit l'équipement de ceux qui s'entraînent avant que le monde ne se réveille. Une esthétique brute, technique, taillée pour l'intensité.",
    story: [
      "RSHADOW naît dans les salles vides à 5h du matin, dans le silence qui précède l'effort.",
      "La marque construit des pièces techniques, robustes, pensées pour l'entraînement intensif — sans jamais sacrifier l'allure urbaine qui les prolonge hors de la salle.",
      "Le noir y est une armure. Le blanc, une ligne de tension. Chaque détail sert la performance.",
    ],
    values: [
      {
        title: "Intensité",
        description: "Des matières techniques conçues pour l'effort maximal, séance après séance.",
      },
      {
        title: "Robustesse",
        description: "Des pièces construites pour durer, testées dans les conditions les plus dures.",
      },
      {
        title: "Attitude",
        description: "Une esthétique lifestyle qui prolonge la performance au-delà de la salle.",
      },
    ],
    heroLabel: "Training Division",
  },
  {
    slug: "tbe",
    name: "TBE",
    shortName: "TBE",
    tagline: "Train Best Ever — Performance sportswear",
    positioning: "Chaque séance compte",
    description:
      "TBE — Train Best Ever — est le manifeste de la discipline. Une ligne de performance épurée, pensée pour ceux qui visent la meilleure version d'eux-mêmes.",
    story: [
      "TBE porte une philosophie : il n'existe pas de petite séance, seulement des versions de soi que l'on dépasse.",
      "La ligne mise sur des essentiels techniques irréprochables — coupes nettes, matières respirantes, détails millimétrés.",
      "Minimaliste dans la forme, maximaliste dans l'exigence : TBE est fait pour s'effacer devant la performance.",
    ],
    values: [
      {
        title: "Discipline",
        description: "Des essentiels pensés pour l'entraînement quotidien, sans compromis.",
      },
      {
        title: "Performance",
        description: "Des matières techniques sélectionnées pour la respirabilité et la liberté de mouvement.",
      },
      {
        title: "Constance",
        description: "Une ligne intemporelle, conçue pour accompagner chaque progression.",
      },
    ],
    heroLabel: "Performance Line",
  },
];
