# P-RAPPORTS.md — Format Unifié des Rapports
> Tous les rapports s'écrivent dans `/RAPPORT_AGENTS.md` à la racine du projet.
> Format : append-only — ne jamais écraser les rapports précédents.

---

## RÈGLE D'ÉCRITURE

```
RAPPORT_AGENTS.md est append-only.
Toujours ajouter à la fin du fichier, jamais écraser.
Chaque rapport commence par un séparateur : ---
```

---

## §RAPPORT-STANDARD — Rapport de Fin de Tâche

```markdown
---
## RAPPORT — [NOM_AGENT] — YYYY-MM-DDTHH:MM:SS+01:00

**Tâche :** [description de ce qui a été demandé]
**Agent(s) exécuté(s) :** [liste]
**Statut :** COMPLÉTÉ / BLOQUÉ / PARTIEL

### Fichiers modifiés
| Fichier | Lignes modifiées | Nature de la modification |
|---|---|---|
| `chemin/fichier.ext` | X-Y | [description] |

### Fichiers NON modifiés (périmètre respecté)
[liste ou "aucun hors périmètre"]

### Points de vigilance
[liste ou "aucun"]

### Prochaine étape recommandée
[ou "aucune — tâche terminée"]
```

---

## §RAPPORT-AUDIT — Rapport d'Audit

```markdown
---
## RAPPORT AUDIT — [TYPE] — YYYY-MM-DDTHH:MM:SS+01:00

**Périmètre audité :** [Frontend / Backend / Global / Admin]
**Score :** X/100 (si applicable)

### Findings classés par sévérité

#### CRITICAL
- `fichier:ligne` — [description] — [preuve]

#### HIGH
- `fichier:ligne` — [description] — [preuve]

#### MEDIUM
- [liste]

#### LOW / INFO
- [liste]

### Recommandations prioritaires
1. [P0 — action immédiate]
2. [P1 — à corriger avant livraison]
3. [P2 — à planifier]

### Statut
[ ] Corrections validées par l'utilisateur
[ ] En attente de validation
```

---

## §RAPPORT-FIXIT — Rapport Fix It

Voir format dans P-FIX-IT.md §FORMAT-RAPPORT

---

## §RAPPORT-PLAN — Rapport de Plan Généré

```markdown
---
## PLAN GÉNÉRÉ — YYYY-MM-DDTHH:MM:SS+01:00

**Fichier plan :** `/plans/PLAN_YYYY-MM-DD_nom.md`
**Tâche :** [description]
**Statut :** EN ATTENTE DE VALIDATION UTILISATEUR
```

---

## §RAPPORT-BLOCAGE — Rapport de Blocage (décision requise)

```markdown
---
## BLOCAGE — [RAISON] — YYYY-MM-DDTHH:MM:SS+01:00

**Règle déclenchée :** P-BLOQUANTS.md §[MODEL / PLAN / README / SECURITE / DONNEES / DEPS]
**Situation :** [description exacte]
**Options disponibles :**
  A. [option A] — risques : [...]
  B. [option B] — risques : [...]
**Décision requise :** validation explicite de l'utilisateur
**Action prise en attendant :** aucune modification
```
