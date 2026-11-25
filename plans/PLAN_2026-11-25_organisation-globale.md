# Plan d'Action & Arbitrage : Organisation globale du dépôt

> **Fichier :** `plans/PLAN_2026-11-25_organisation-globale.md`
> **Date de génération :** 2026-11-25T03:09:33+01:00
> **Statut :** `[ ] EN ATTENTE D'ARBITRAGE UTILISATEUR`
> **Auteur du plan :** Assistant IA
> **Décideur :** Utilisateur

## 1. Contexte & Objectif

- **Demande initiale :** « arranger un peu le dépôt »
- **Objectif visé :** rendre la racine lisible, séparer la documentation opérationnelle du code, retirer les artefacts obsolètes explicitement identifiés et standardiser les fichiers de verrouillage des dépendances.
- **Périmètre strict :**
  - nettoyage de la racine ;
  - création d'une arborescence `docs/` ;
  - déplacements de documentation et d'artefacts uniquement ;
  - mise à jour des liens internes directement impactés ;
  - exclusions : `src/`, `public/`, `.agents/`, `.github/`, `node_modules/`, `dist/`, dépendances applicatives, suppression des suppressions/modifications Git déjà présentes.

## 2. Diagnostic & Preuves

- **État Git avant intervention :**
  - 11 images suivies supprimées dans `public/assets/aistudio/`;
  - `public/robots.txt` et `public/sitemap.xml` modifiés ;
  - aucune modification hors de ces chemins n'est actuellement prise en compte.
- **Problèmes observés :**
  - la racine contient à la fois les fichiers de lancement, 15 documents Markdown et plusieurs fichiers temporaires ;
  - `untitled.tsx` est un fichier vide de 0 octet ;
  - `buildlog.txt` et `lintlog.txt` sont des sorties de validation à la racine ;
  - `move_section.cjs` n'a aucune occurrence dans le code, les scripts ou les manifests ;
  - `base1.json` n'est référencé nulle part dans le périmètre applicatif ;
  - `bun.lock` coexiste avec `package-lock.json`, alors que les scripts utilisent npm par défaut ;
  - aucun dossier `docs/` n'existe ; la documentation active est dispersée à la racine.

## 3. Plan d'Action Détaillé

### Étape 1 : Créer une arborescence documentaire lisible

- **Fichiers ciblés :** fichiers Markdown actuellement à la racine.
- **Modifications envisagées :**
  - créer `docs/`;
  - déplacer vers `docs/` :
    - `architecture.md`
    - `decisions_log.md`
    - `tasks_tracking.md`
    - `historique_projet.md`
    - `charte_graphique.md`
    - `seo.md`
    - `environment_variables.md`
    - `audit_pwa.md`
    - `cahier_des_charges.md`
    - `chat_history.md`
    - `Audit_des_dépendances_—_NukeMap-3D-Edu.md`
  - ajouter `docs/README.md` comme index court ;
  - conserver `README.md`, `AGENTS.md`, `package.json`, `package-lock.json`, `bun.lock` pour décision explicite sur la racine.

### Étape 2 : Centraliser les sorties temporaires

- **Fichiers ciblés :** `buildlog.txt`, `lintlog.txt`
- **Modifications envisagées :**
  - créer `docs/reports/`;
  - déplacer les deux logs vers `docs/reports/`;
  - ajouter `/buildlog.txt` et `/lintlog.txt` au `.gitignore` afin d'empêcher leur retour à la racine.
- **Raison :** préserver l'historique utile sans laisser les sorties de validation polluer la racine.

### Étape 3 : Retirer les artefacts sans référence

- **Fichiers ciblés :** `untitled.tsx`, `move_section.cjs`, `base1.json`
- **Modifications envisagées :**
  - supprimer uniquement ces trois fichiers après validation ;
  - ne pas supprimer les autres fichiers présents à la racine.
- **Raison :** aucun usage vérifié dans le code ou les scripts.

### Étape 4 : Unifier les fichiers de dépendances

- **Fichiers ciblés :** `bun.lock`, `package-lock.json`, `package.json`
- **Modifications envisagées :**
  - conserver `package-lock.json` comme source unique ;
  - supprimer `bun.lock` ;
  - n'ajouter ni modifier aucune dépendance.
- **Raison :** le dépôt utilise des scripts npm et contient déjà un lockfile npm.

### Étape 5 : Actualiser les liens directement impactés

- **Fichiers ciblés :** `README.md` et les documents déplacés
- **Modifications envisagées :**
  - remplacer uniquement les liens internes cassés par les nouveaux chemins `docs/...`;
  - ne pas réécrire le contenu éditorial hors liens.

### Étape 6 : Vérifier sans modifier l'application

- [ ] exécutrer `npm run lint`;
- [ ] exécutrer `npm test`;
- [ ] exécutrer `npm run build`;
- [ ] vérifier `git diff --stat` et `git status --short`;
- [ ] confirmer qu'aucun fichier applicatif suivi hors du périmètre n'a été touché.

## 4. Matrice d'Impacts, Risques & Rollback

| Risque potentiel | Probabilité | Impact | Stratégie d'atténuation / Rollback |
| :--- | :---: | :---: | :--- |
| Déplacement cassant un lien vers un document | Faible | Moyen | rechercher toutes les références avant déplacement ; `git revert` du lot si nécessaire |
| Suppression d'un fichier devenu utile hors des chemins actuellement recherchés | Faible | Moyen | supprimer seulement les trois fichiers sans référence vérifiée ; sauvegarde Git disponible |
| Suppression du mauvais lockfile | Faible | Élevé | conserver `package-lock.json` et ne toucher à aucune dépendance |
| Ecrasement des modifications Git déjà présentes | Nulle | Élevé | exclure tous les fichiers de `public/` déjà modifiés ou supprimés |
| Build ou tests préexistants en échec | Moyenne | Faible | distinguer les erreurs préexistantes des régressions liées aux seuls changements organisationnels |

## 5. Zone d'Arbitrage & Décision Utilisateur

### Décision Globale :
- [ ] **APPROUVÉ EN L'ÉTAT** — Exécuter intégralement le plan ci-dessus.
- [ ] **APPROUVÉ AVEC AJUSTEMENTS** — Appliquer les ajustements ci-dessous.
- [ ] **MODIFICATIONS DU PLAN REQUISES** — Revoir le périmètre avant toute modification.
- [ ] **REJETÉ / ABANDONNÉ** — Ne pas exécuter cette organisation.

### Arbitrages Spécifiques :
1. **Suppression des trois artefacts sans référence** :
   - [X] Autoriser la suppression de `untitled.tsx`, `move_section.cjs`, `base1.json`
   - [ ] Conserver tous les fichiers sans suppression
2. **Lockfile** :
   - [ ] Autoriser la suppression de `bun.lock` en conservant `package-lock.json`
   - [X] Conserver les deux lockfiles
3. **Logs** :
   - [ ] Déplacer les logs dans `docs/reports/`
   - [ ] Les laisser à la racine
   - [X] Supprimer les logs

### Commentaires & Directives complémentaires :
```text
[Ajouts ou contraintes supplémentaires]
```
