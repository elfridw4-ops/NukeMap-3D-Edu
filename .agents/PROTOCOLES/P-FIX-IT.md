# P-FIX-IT.md — Protocole Fix It et Auto-Correction
> Lire en intégralité avant toute correction automatique.
> Ce fichier gouverne le comportement quand une erreur est détectée automatiquement
> ou quand l'utilisateur clique "Fix It" sans décrire le problème.

---

## SÉQUENCE FIX IT OBLIGATOIRE

```
ERREUR DÉTECTÉE (auto ou "Fix It")
         ↓
[1] Lire P-BLOQUANTS.md complet (si pas déjà fait dans cette session)
         ↓
[2] Identifier et classifier l'erreur → §CLASSIFICATION
         ↓
[3] Appliquer le protocole selon le niveau → §CRITICAL / §HIGH / §MEDIUM / §LOW
         ↓
[4] Écrire dans RAPPORT_AGENTS.md → §FORMAT-RAPPORT
```

---

## §CLASSIFICATION — Classifier l'Erreur Avant Tout

**Avant de corriger, classifier obligatoirement :**

| Niveau | Exemples concrets |
|---|---|
| CRITICAL | Changement de modèle IA requis ; secret exposé dans le bundle ; auth bypass ; suppression irréversible de données ; build de production cassé ; faille de sécurité exploitable |
| HIGH | Erreur serveur 500 répétée ; boucle infinie ; régression sur une feature critique ; problème d'authentification non-critique |
| MEDIUM | Bug isolé avec workaround ; erreur d'affichage non bloquante ; formulaire qui ne soumet pas dans un cas précis |
| LOW | Coquille dans un texte ; icône mal alignée ; console.log oublié ; typo dans un commentaire |

---

## §CRITICAL — Erreur Classée CRITICAL

**Action :** BLOQUER. Ne jamais corriger automatiquement.

```
1. NE RIEN MODIFIER dans le code
2. Identifier la cause racine (Evidence-First — preuve fichier:ligne)
3. Écrire dans RAPPORT_AGENTS.md :
   RAPPORT FIX-IT — [CRITICAL] — [horodatage]
   Erreur : [description exacte]
   Cause identifiée : [CONFIRMÉ / PROBABLE / NON VÉRIFIÉ] — [preuve]
   Fichiers impactés : [liste]
   Options de correction : [2-3 options avec risques]
   Action requise : validation utilisateur obligatoire
4. Informer l'utilisateur dans le chat
5. ATTENDRE validation explicite avant toute modification
```

**Cas particulier — Modèle IA :**
Si l'erreur est liée au modèle IA (quota atteint, provider indisponible, rate limit) :
→ Appliquer §MODEL de P-BLOQUANTS.md IMMÉDIATEMENT
→ NE PAS substituer un autre modèle
→ NE PAS changer le provider

---

## §HIGH — Erreur Classée HIGH

**Action :** Plan minimal obligatoire avant correction.

```
1. Identifier la cause racine (Evidence-First)
2. Générer /plans/PLAN_YYYY-MM-DD_fix-[description].md avec :
   - Cause racine (prouvée)
   - Périmètre de correction (fichiers exacts)
   - Fix proposé (minimal safe fix)
   - Impact sur le reste du projet
3. Informer l'utilisateur dans le chat
4. ATTENDRE feu vert
5. Appliquer le fix chirurgical uniquement
6. Écrire le rapport de fin dans RAPPORT_AGENTS.md
```

---

## §MEDIUM — Erreur Classée MEDIUM

**Action :** Fix chirurgical direct, rapport post-action.

```
1. Identifier la cause racine (Evidence-First)
2. Appliquer le fix minimal (uniquement les lignes nécessaires)
   → Jamais de refactoring opportuniste
   → Jamais de renommage non lié
   → Jamais de réorganisation de fichiers hors périmètre
3. Écrire dans RAPPORT_AGENTS.md :
   RAPPORT FIX-IT — [MEDIUM] — [horodatage]
   Erreur : [description]
   Cause : [preuve fichier:ligne]
   Fix appliqué : [description + fichiers modifiés]
   Lignes modifiées : [N]
```

---

## §LOW — Erreur Classée LOW

**Action :** Fix direct, mention dans le rapport en cours.

```
1. Corriger directement
2. Ajouter une ligne dans RAPPORT_AGENTS.md :
   [LOW] [horodatage] — [fichier:ligne] — [description du fix]
```

---

## §ANTI-PATTERNS — Ce Que Fix It Ne Doit Jamais Faire

- **Jamais** désactiver une validation ou un indicateur de sécurité pour faire disparaître une erreur
- **Jamais** insérer un `setTimeout` ou un délai arbitraire pour masquer une race condition
- **Jamais** changer le texte d'un message d'erreur pour "cacher" l'erreur applicative
- **Jamais** commenter du code avec `// TODO fix later` et considérer l'erreur résolue
- **Jamais** supprimer un test qui échoue plutôt que de corriger le code testé
- **Jamais** hardcoder une valeur qui contourne un système de configuration

---

## §FORMAT-RAPPORT — Format du Rapport Fix It dans RAPPORT_AGENTS.md

```markdown
## RAPPORT FIX-IT — [NIVEAU] — YYYY-MM-DDTHH:MM:SS+01:00

**Erreur détectée :** [description]
**Cause racine :** [CONFIRMÉ/PROBABLE/NON VÉRIFIÉ] — `fichier:ligne` — [extrait]
**Niveau :** CRITICAL / HIGH / MEDIUM / LOW
**Statut :** BLOQUÉ (attente validation) / CORRIGÉ / EN ATTENTE

**Fix appliqué (si corrigé) :**
- Fichier : `chemin/fichier.ext` — lignes X-Y
- Description : [ce qui a été changé et pourquoi]

**Fichiers NON modifiés :** [liste exhaustive]
```
