# 📋 Plan d'Action & Arbitrage : [TITRE DE LA TÂCHE]

> **Fichier :** `plans/PLAN_YYYY-MM-DD_[nom-de-la-tache].md`  
> **Date de génération :** YYYY-MM-DDTHH:MM:SS+01:00  
> **Statut :** `[ ] EN ATTENTE D'ARBITRAGE UTILISATEUR` / `[ ] APPROUVÉ` / `[ ] MODIFICATIONS SOUHAITÉES` / `[ ] REJETÉ`  
> **Auteur du plan :** Assistant IA  
> **Décideur :** Utilisateur / Donneur d'ordre  

---

## 1. 🎯 Contexte & Objectif

- **Demande initiale :** [Description concise de l'instruction utilisateur]
- **Objectif visé :** [Ce que le projet doit accomplir une fois la tâche terminée]
- **Périmètre strict :** [Ce qui est inclus et ce qui est explicitement exclu pour éviter le bruit]

---

## 2. 🔍 Diagnostic & Preuves (Evidence-First)

- **Fichiers inspectés :**
  - `chemin/du/fichier1.tsx:L123` : [Extrait ou description du comportement actuel constaté]
  - `chemin/du/fichier2.ts:L45` : [Extrait ou description]
- **Divergence constatée :** [Comportement observé vs Comportement attendu]

---

## 3. 🛠️ Plan d'Action Détaillé (Chirurgical)

### Étape 1 : [Nom de l'étape]
- **Fichier ciblé :** `chemin/du/fichier.ts`
- **Modifications envisagées :**
  ```typescript
  // Description des changements ou extrait de code prévu
  ```
- **Raison :** [Pourquoi cette modification précise]

### Étape 2 : [Nom de l'étape]
- **Fichier ciblé :** `chemin/du/fichier2.ts`
- **Modifications envisagées :**
  - ...

### Étape 3 : Script SQL Supabase (si modification de schéma)
- [ ] Aucun script SQL requis
- [ ] Script à exécuter dans l'éditeur SQL Supabase :
  ```sql
  -- Requête SQL si nécessaire
  ```

### Étape 4 : Variables d'environnement / Services tiers
- [ ] Aucune nouvelle variable d'environnement
- [ ] Variables à ajouter dans `.env.example` et sur Vercel/Supabase :
  - `VARIABLE_NAME` : description

---

## 4. 🛡️ Matrice d'Impacts, Risques & Rollback

| Risque potentiel | Probabilité | Impact | Stratégie d'atténuation / Rollback |
| :--- | :---: | :---: | :--- |
| [Risque 1] | Faible / Moyen / Élevé | Faible / Moyen / Élevé | [Solution de secours ou procédure d'annulation] |

- **Vérifications post-implémentation :**
  1. Compilation complète via `compile_applet`.
  2. Validation linting via `lint_applet`.
  3. Alignement immédiat du `README.md` (règle sacrée).

---

## 5. ✍️ ZONE D'ARBITRAGE & DÉCISION UTILISATEUR (À REMPLIR PAR L'UTILISATEUR)

> ⚠️ **Instructions pour l'utilisateur :**  
> Merci de relire ce plan. Vous pouvez cocher votre décision ci-dessous et consigner vos choix ou ajustements. Dès que vous avez terminé, confirmez dans le chat (ex: *« J'ai validé le plan, tu peux démarrer les modifs »*) pour lancer l'implémentation.

### Décision Globale :
- [ ] **APPROUVÉ EN L'ÉTAT** — L'assistant peut dérouler l'intégralité du plan ci-dessus.
- [ ] **APPROUVÉ AVEC AJUSTEMENTS** — Appliquer le plan en intégrant les remarques ci-dessous.
- [ ] **MODIFICATIONS DU PLAN REQUISES** — Proposer une nouvelle version du plan tenant compte des retours ci-dessous avant tout codage.
- [ ] **REJETÉ / ABANDONNÉ** — Ne pas exécuter cette tâche.

### Arbitrages Spécifiques (Choix à trancher) :
1. **Option A vs Option B :**
   - Votre choix : `[ ] Option A` / `[ ] Option B`
2. **Points d'attention particuliers :**
   - [Note ou consigne spécifique de l'utilisateur]

### Commentaires & Directives complémentaires de l'utilisateur :
```text
[Écrivez ici vos remarques, ajouts, contraintes ou refus éventuels...]
```

**Horodatage de la validation utilisateur :** `[ Date & Heure ]`  
**Signature / Accord :** `[ Prénom / Pseudo ]`
