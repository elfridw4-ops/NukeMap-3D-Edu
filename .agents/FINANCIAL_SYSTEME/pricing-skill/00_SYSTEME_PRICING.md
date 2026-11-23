# SYSTÈME DE DÉCISION PRICING — v1.0
> Objectif : transformer chaque décision de pricing en processus répétable,
> chiffré et challengé. Aucune feature ne passe en production sans avoir
> traversé les 5 gates ci-dessous.

## LES 5 GATES (dans l'ordre, non négociable)

GATE 1 — VALEUR : L'utilisateur paierait-il pour ça seul ?
  → Si non : la feature renforce un plan existant, elle ne crée pas de tier.

GATE 2 — COÛT : Coût marginal par utilisateur (infra, support, maintenance) ?
  → Coût variable élevé (IA, stockage, API tierces) = QUOTA OBLIGATOIRE, jamais illimité.

GATE 3 — POSITIONNEMENT : Gratuit / Gratuit limité / Premium / Tier supérieur ?
  → Appliquer la MATRICE DE DÉCISION (fichier 05).

GATE 4 — RISQUE : Technique, juridique, UX, commercial (grille directive 1).

GATE 5 — MESURE : Quel KPI prouve que le pricing fonctionne ? (fichier 06)

## RÈGLES D'OR (non négociables)
R1. Une feature à coût variable élevé n'est JAMAIS illimitée. Jamais.

R2. Le plan gratuit doit créer l'habitude, pas satisfaire le besoin complet.

R3. 3 plans maximum visibles + 1 plan Enterprise "nous contacter".

R4. Tout prix affiché existe en UNE SEULE source de vérité (pricing.config.json).

R5. Chaque changement de prix = migration des abonnés existants documentée
    (grandfathering par défaut).

R6. Une feature annoncée sur la landing qui n'existe pas = risque juridique
    (pratique commerciale trompeuse, art. L121-2 Code conso FR).
