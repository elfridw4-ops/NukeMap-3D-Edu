---
name: saas-pricing-strategy
description: Définition, audit et challenge des modèles de tarification SaaS (plans Freemium, Pro, Team, Enterprise). Encadre les 5 gates de décision pricing, le calcul des coûts marginaux, les quotas de consommation, l'ancrage psychologique et l'obligation d'une source unique de vérité JSON. Use when designing pricing tiers, reviewing subscription models, adding features to paid plans, or auditing SaaS revenue architecture.
argument-hint: "[action: audit|define|challenge|matrix]"
license: Proprietary
metadata:
  author: protocole-core
  version: "1.0.0"
---

# Skill : SaaS Pricing Strategy & Revenue Architecture

Ce skill structure et challenge toute décision relative aux plans d'abonnement, tarifications et quotas d'un projet SaaS.

> **Sources de référence principales :**
> - Dossier d'atelier complet : [pricing-skill/](../../FINANCIAL_SYSTEME/pricing-skill/)
> - Matrice décisionnelle : [MATRICE-PRICING.csv](../../FINANCIAL_SYSTEME/MATRICE-PRICING.csv)
> - Directives de gating : [00_SYSTEME_PRICING.md](../../FINANCIAL_SYSTEME/pricing-skill/00_SYSTEME_PRICING.md)

---

> ℹ️ **Note sur les valeurs chiffrées :** Les montants, noms de plans (Découverte, Pro, Équipe) et ratios cités dans ce skill sont des **exemples de calibrage et d'illustration stratégique**. Les valeurs réelles d'un projet doivent être pilotées exclusivement via le fichier de configuration central `pricing.config.json` sans aucune valeur codée en dur dans les composants.

---

## 🎯 LES 5 GATES DÉCISIONNELLES (Ordre Strict)

Avant de valider l'ajout d'une fonctionnalité dans un plan payant ou la modification d'un tarif :

```
[GATE 1 — VALEUR]
L'utilisateur paierait-il pour cette fonctionnalité seule ?
  → Si NON : la feature enrichit un plan existant sans créer de palier supplémentaire.

[GATE 2 — COÛT MARGINAL]
Quel est le coût d'usage unitaire (appels API LLM, stockage Cloud, bande passante) ?
  → Coût variable élevé = QUOTA STRICT OBLIGATOIRE. Jamais d'illimité sur les coûts variables.

[GATE 3 — POSITIONNEMENT]
Gratuit / Découverte / Pro (Cœur) / Team (Ancrage haut) ?
  → Consulter la matrice décisionnelle MATRICE-PRICING.csv.

[GATE 4 — RISQUE TECHNIQUE & JURIDIQUE]
Vérification des promesses marketing vs réalité du code.
  → Règle légale : toute feature annoncée sur la landing qui n'existe pas = pratique trompeuse.

[GATE 5 — MÉTRIQUES & CONVERSION]
Quel KPI surveille l'efficacité de la tarification ?
  → Taux de conversion Free-to-Paid (cible ~3-5%), churn mensuel (< 2%), ARPU.
```

---

## 📜 RÈGLES D'OR DU PRICING

1. **Pas d'illimité sur l'IA ou les coûts serveurs :** Une fonctionnalité à coût variable élevé doit toujours disposer d'un plafond mensuel chiffré.
2. **Le plan gratuit crée l'habitude :** Il résout une fraction du problème, génère de la friction positive et incite à l'upgrade sans frustration bloquante.
3. **3 tiers visibles maximum :** Découverte (0€), Pro (Le plan ciblé, ~60% des conversions), Team/Business (Ancrage psychologique haut) + 1 bouton "Enterprise / Contactez-nous".
4. **Source unique de vérité :** Aucun prix n'est codé en dur dans les composants UI, landing pages ou emails. Tous les écrans consomment `pricing.config.json`.
5. **Grandfathering :** En cas d'augmentation tarifaire, les utilisateurs existants conservent leur tarif d'origine pendant une période de grâce documentée.

---

## 🔍 PROTOCOLES D'AUDIT INCLUS

- **Audit technique :** Vérifier que les compteurs de quotas sont décrémentés de façon atomique côté serveur.
- **Challenge commercial :** S'assurer que le plan Pro est perçu comme 10x plus rentable que son prix mensuel.
- **Audit de cohérence :** Vérifier la stricte concordance entre Landing Page, Modals d'Upgrade, Dashboard et Webhooks de facturation.
