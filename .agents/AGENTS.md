# AGENTS.md — Charte Opérationnelle Interne
> Environnement : fallback .agents/ pour IDE détectant ce dossier

## SÉQUENCE OBLIGATOIRE — AVANT TOUTE ACTION

```
[1] Lire intégralement : .agents/PROTOCOLES/P-BLOQUANTS.md
[2] Identifier l'intention → consulter : .agents/NOYAU.md §ROUTAGE
[3] Si tâche complexe → P-BLOQUANTS.md §PLAN → ARRÊT
[4] Si Fix It / erreur → P-FIX-IT.md → ARRÊT si CRITICAL
[5] Si autoagent:go → P-AUTOAGENT.md
[6] Exécuter l'agent (section §TAG uniquement)
[7] Mise à jour documentaire chirurgicale (docs/ + README.md selon Documentation_Architect.md)
[8] Rapport dans RAPPORT_AGENTS.md
```

---

## INTERDICTIONS ABSOLUES

| Interdiction | Protocole |
|---|---|
| Modifier modèle IA | `P-BLOQUANTS.md §MODEL` → BLOQUER |
| Coder sans plan | `P-BLOQUANTS.md §PLAN` → /plans/ → ARRÊT |
| README désync | `P-BLOQUANTS.md §README` → CRITICAL |
| Supprimer données | `P-BLOQUANTS.md §DONNEES` → BLOQUER |
| Dépendance critique | `P-BLOQUANTS.md §DEPS` → BLOQUER |
| Fix CRITICAL sans plan | `P-FIX-IT.md §CRITICAL` → BLOQUER |

---

## PRINCIPES (non-négociables)

1. **Evidence-First** : preuve `fichier:ligne` — CONFIRMÉ / PROBABLE / NON VÉRIFIÉ
2. **Minimal Safe Fix** : zéro refactoring hors périmètre
3. **Trace-The-Flow** : `ACTION → UI → HANDLER → STATE → API → DB → RÉPONSE`
4. **Sécurité > Architecture > Fonctionnel > Cohérence**
5. **Zéro donnée fictive en production**
6. **Code commenté en français** sur les parties névralgiques

---

## PROTOCOLES DE GESTION DES MODÈLES IA

Les modèles IA sont des dépendances critiques d'architecture.

**Interdictions sans validation :**
- Remplacer automatiquement un modèle
- Changer de provider (Google → OpenAI → Anthropic)
- Modifier paramètres critiques, quotas, stratégies de fallback

**Procédure si erreur modèle IA :**
```
1. NE PAS corriger automatiquement
2. Identifier la cause (quota / indisponibilité / config / réseau)
3. Rapport dans RAPPORT_AGENTS.md (§BLOCAGE)
4. Attendre validation
```

**Scan des références modèle :** `python .agents/tools/check_model_refs.py`

---

## PROTOCOLES SPÉCIAUX

### Rebranding
```
1. Analyser tous les fichiers impactés (interface, SEO, PWA, doc, juridique)
2. Classer : A=mettre à jour / B=conserver historique / C=migrer avec traçabilité
3. Rapport → attendre validation → appliquer → mettre à jour README + docs
```

### Optimisation Mobile (mode scopé)
- Modifier UNIQUEMENT styles/composants/navigation mobile
- Desktop considéré validé — aucune modification desktop
- Rapport : problèmes, composants, impact, corrections, garantie desktop intact

### Qualité des Données
- Zéro mock data / fake analytics / fake users / fake revenue en production
- États vides → afficher état vide professionnel
- Premier accès utilisateur : aucune donnée de développement visible

### Audit des Données de Développement
- NE modifier aucun fichier durant l'audit
- Rapport : données test détectées + fichiers + niveau de risque + corrections recommandées
- Attendre validation avant toute correction

---

## SKILLS DISPONIBLES (244)

Ce protocole inclut **244 skills actifs** dans `.agents/skills/` :

| Catégorie | Exemples de skills | Activation |
|---|---|---|
| 🔐 **Sécurité applicative web/mobile** (93) | Développement sécurisé, audits OWASP web/API/mobile, authentification, DevSecOps | Nommer la tâche ou `skill:[nom]` |
| 💳 **Paiement & Monétisation** (2) | `fedapay-integration`, `saas-pricing-strategy` | `skill:fedapay`, `skill:pricing` |
| 🎨 **Design Web** (4) | `design`, `design-system`, `banner-design`, `palette-and-typography-picker` | `design:system` ou nommer la tâche |
| 📣 **Vidéo/Marketing** (3) | `brag`, `brand`, `slides` | `/brag`, `/brand`, `/slides` |

> Index complet : `.agents/skills/README.md`
