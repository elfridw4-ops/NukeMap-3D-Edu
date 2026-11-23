# 📋 Registre des Plans d'Action & Arbitrages Utilisateur — `/plans`

> **Règle Opérationnelle Souveraine :**  
> Dès qu'une tâche complexe, structurante ou nécessitant un plan est demandée par l'utilisateur, **l'assistant IA ne doit JAMAIS commencer à modifier le code directement**.  
> Il doit obligatoirement générer un fichier de plan `.md` dans ce dossier, le soumettre à la relecture de l'utilisateur avec des zones dédiées à ses décisions, et **attendre son feu vert explicite** avant de démarrer toute implémentation.

---

## 📁 Convention de Nommage des Fichiers

Chaque plan généré dans ce dossier suit strictement le format :
```text
plans/PLAN_YYYY-MM-DD_nom-de-la-tache.md
```
*Exemple :* `plans/PLAN_2026-09-26_refonte-moteur-recherche.md`

---

## 🏗️ Structure Obligatoire d'un Fichier de Plan

Chaque fichier de plan généré doit contenir les 5 sections suivantes :

1. **Contexte & Objectif** : Pourquoi cette tâche est demandée, ce qu'elle apporte et son périmètre exact.
2. **Diagnostic & Preuves (Evidence-First)** : Preuves issues du code source (`chemin/fichier.ts:ligne`), état actuel et points de divergence identifiés.
3. **Plan d'Action Pas-à-Pas** :
   - Fichiers à créer / modifier / supprimer.
   - Détail exact des modifications de code envisagées.
   - Impacts base de données (scripts SQL Supabase si applicable).
   - Impacts API & Contrats.
4. **Matrice des Risques, Tests & Rollback** :
   - Risques d'effets de bord identifiés et mitigations.
   - Vérifications post-implémentation (`compile_applet`, `lint_applet`, tests fonctionnels).
   - Procédure de retour arrière en cas d'imprévu.
5. **Zone d'Arbitrage & Décision Utilisateur (Human-in-the-Loop)** :
   - Espace réservé à l'utilisateur avec cases à cocher et champs de décision explicites.
   - L'utilisateur y consigne ses choix, valide, amende ou refuse le plan avant exécution.

---

## 🔄 Protocole d'Exécution

```text
[1. DEMANDE UTILISATEUR]
         │
         ▼
[2. ANALYSE & RÉDACTION DU PLAN] ──► Fichier plans/PLAN_YYYY-MM-DD_...md
         │
         ▼
[3. ARRÊT & NOTIFICATION DANS LE CHAT] ──► L'IA s'arrête et présente le plan
         │
         ▼
[4. RELECTURE & ARBITRAGE UTILISATEUR] ──► L'utilisateur remplit sa décision
         │
         ▼
[5. FEU VERT UTILISATEUR DANS LE CHAT]
         │
         ▼
[6. APPLICATION CHIRURGICALE DU CODE] ──► Exécution du plan validé
         │
         ▼
[7. VÉRIFICATION & LIVRAISON] ──► Compilation, tests, mise à jour README & docs
```
