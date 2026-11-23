# AGENTS.md — Protocole d'Entrée Universel
> Environnement : Cursor / Windsurf / VS Code / Google AI Studio / tout IDE non-Gemini non-Claude
> Si tu lis GEMINI.md ou CLAUDE.md : ce fichier est le fallback — même protocole.

---

## SÉQUENCE OBLIGATOIRE — AVANT TOUTE ACTION

```
[1] Lire intégralement : .agents/PROTOCOLES/P-BLOQUANTS.md
[2] Identifier l'intention → consulter : .agents/NOYAU.md §ROUTAGE
[3] Si tâche complexe/structurante → .agents/PROTOCOLES/P-BLOQUANTS.md §PLAN → ARRÊT
[4] Si erreur auto / "Fix It" → .agents/PROTOCOLES/P-FIX-IT.md → ARRÊT si CRITICAL
[5] Si commande autoagent:go → .agents/PROTOCOLES/P-AUTOAGENT.md
[6] Exécuter l'agent désigné (section balisée uniquement)
[7] Mise à jour documentaire chirurgicale (docs/ + README.md selon Documentation_Architect.md)
[8] Écrire le rapport de fin dans : RAPPORT_AGENTS.md
```

**Cette séquence s'applique à CHAQUE message, y compris les demandes banales.**

---

## INTERDICTIONS ABSOLUES

| Interdiction | Protocole applicable |
|---|---|
| Modifier le modèle IA utilisé | `.agents/PROTOCOLES/P-BLOQUANTS.md §MODEL` → BLOQUER |
| Coder avant plan sur tâche complexe | `.agents/PROTOCOLES/P-BLOQUANTS.md §PLAN` → /plans/ → ARRÊT |
| README désynchronisé du code | `.agents/PROTOCOLES/P-BLOQUANTS.md §README` → CRITICAL |
| Supprimer des données sans validation | `.agents/PROTOCOLES/P-BLOQUANTS.md §DONNEES` → BLOQUER |
| Ajouter dépendance critique sans validation | `.agents/PROTOCOLES/P-BLOQUANTS.md §DEPS` → BLOQUER |
| Fix CRITICAL/HIGH sans plan | `.agents/PROTOCOLES/P-FIX-IT.md §CRITICAL` → BLOQUER |

---

## FICHIERS DE RÉFÉRENCE

| Besoin | Fichier |
|---|---|
| Routage + index agents | `.agents/NOYAU.md §ROUTAGE` |
| Chaînes d'agents | `.agents/NOYAU.md §CHAINES` |
| Commandes directes | `.agents/NOYAU.md §COMMANDES` |
| Règles non-négociables | `.agents/PROTOCOLES/P-BLOQUANTS.md` |
| Fix It / auto-correction | `.agents/PROTOCOLES/P-FIX-IT.md` |
| Mode autonome | `.agents/PROTOCOLES/P-AUTOAGENT.md` |
| Format rapports | `.agents/PROTOCOLES/P-RAPPORTS.md` |
| Index des 244 skills actifs | `.agents/skills/README.md` |
| Instructions Google AI Studio | `AISTUDIO.md` |

---

## CONTEXTE PROJET

- **Fuseau horaire** : WAT — UTC+1 (`Africa/Porto-Novo`) — format : `YYYY-MM-DDTHH:MM:SS+01:00`
- **Paiement Afrique** : FedaPay → `.agents/FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md`
- **Paiement Occident** : Stripe — si ambiguïté → demander avant d'intégrer
- **Rapports** : `/RAPPORT_AGENTS.md` (racine projet)
- **Plans** : `/plans/PLAN_YYYY-MM-DD_nom.md`

---

## PRINCIPES FONDAMENTAUX (non-négociables)

1. **Evidence-First** : Tout finding prouvé par `fichier:ligne` — CONFIRMÉ / PROBABLE / NON VÉRIFIÉ
2. **Minimal Safe Fix** : Modifier uniquement les lignes nécessaires — zéro refactoring opportuniste
3. **Trace-The-Flow** : `ACTION → UI → HANDLER → STATE → API → DB → RÉPONSE`
4. **Sécurité > Architecture > Fonctionnel > Cohérence**
5. **Zéro donnée fictive en production** — états vides professionnels obligatoires
6. **Qualité du code** : lisible, robuste, commenté en français sur les parties névralgiques

---

## SKILLS DISPONIBLES (104)

Ce protocole inclut **244 skills actifs** dans `.agents/skills/` :

| Catégorie | Exemples de skills | Activation |
|---|---|---|
| 💳 **Paiement & Monétisation** (2) | `fedapay-integration`, `saas-pricing-strategy` | `skill:fedapay`, `skill:pricing` |
| 🎨 **Design Web & Typo** (4) | `palette-and-typography-picker`, `design`, `design-system`, `banner-design` | `design:system`, `skill:palette` |
| 📣 **Vidéo/Marketing** (3) | `brag`, `brand`, `slides` | `/brag`, `/brand`, `/slides` |
| 🔐 **Sécurité applicative web/mobile** (93) | Développement sécurisé, audits OWASP web/API/mobile, authentification, DevSecOps | Nommer la tâche ou `skill:[nom]` |

> Index complet : `.agents/skills/README.md`
