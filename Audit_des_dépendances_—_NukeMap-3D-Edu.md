# Audit des dépendances — NukeMap-3D-Edu

**Projet analysé :** [elfridw4-ops/NukeMap-3D-Edu](https://github.com/elfridw4-ops/NukeMap-3D-Edu)  
**Déploiement public vérifié :** [nukemap-3d.vercel.app](https://nukemap-3d.vercel.app)  
**Date de l’audit :** 21 septembre 2026  
**Périmètre :** `package.json`, `package-lock.json`, imports TypeScript/TSX, configuration Vite, tests, build de production et installation npm propre.

## I. Conclusion exécutive

Le projet est actuellement **déployé et accessible sur Vercel**, mais son état de dépendances n’est pas suffisamment fiable pour une maintenance professionnelle ou un déploiement reproductible.

Le problème le plus important est le **lockfile désynchronisé**. Une installation propre avec `npm ci` échoue, car `package-lock.json` ne contient pas toutes les dépendances attendues par `package.json`. La régénération du lockfile produit environ **2 114 lignes ajoutées et 223 lignes supprimées** par rapport au fichier versionné. Un pipeline CI strict ou une configuration Vercel utilisant `npm ci` peut donc échouer, tandis qu’une installation tolérante peut produire un arbre de dépendances différent.

Le second problème est l’**incohérence des imports**. Le code importe `framer-motion` dans `src/components/Map.tsx`, alors que seul `motion` est déclaré directement. Le package `motion` fournit actuellement `framer-motion` de manière transitive, mais le code ne doit pas dépendre d’un package transitive non déclaré. Le même principe concerne `@deck.gl/react` et `@deck.gl/layers`, importés directement alors que seul `deck.gl` est déclaré au niveau racine.

L’audit de sécurité sur l’arbre installé depuis `package.json` remonte **20 vulnérabilités : 1 faible, 7 modérées et 12 élevées**. La majorité est concentrée dans la chaîne Deck.gl / Loaders.gl / Luma.gl. Le correctif automatique proposé par npm rétrograde `deck.gl` vers `9.1.0`, ce qui est une modification majeure et ne doit pas être appliqué aveuglément.

Enfin, plusieurs dépendances semblent inutilisées dans le code applicatif actuel, notamment `@google/genai`, `dotenv`, `express`, `@types/express`, `tsx` et probablement `autoprefixer`. Elles augmentent la surface d’attaque, le temps d’installation et la complexité sans bénéfice observable dans cette application Vite côté client.

## II. Résultats de validation

| Vérification | Résultat | Interprétation |
|---|---:|---|
| Réponse du déploiement Vercel | HTTP 200 | Le site public est accessible au moment de l’audit. |
| `npm ci --ignore-scripts` | Échec | Le lockfile n’est pas cohérent avec le manifeste. |
| `npm install --no-package-lock` | Réussi | L’arbre peut être installé depuis `package.json`, mais il n’est pas verrouillé. |
| `npm run lint` | Échec | Deux erreurs TypeScript sur `import.meta.env` dans `Map.tsx`. |
| `npm test` | Réussi | 1 fichier de test et 3 tests passent. |
| `npm run build` | Réussi avec avertissements | Les chunks `map` et `deck` dépassent 1 Mo après minification. |
| `npm audit` sur l’arbre installé | 20 vulnérabilités | 12 élevées, 7 modérées et 1 faible. |

Le build réussi ne prouve donc pas que le projet est sain. Il prouve seulement que Vite peut produire un bundle avec un arbre de dépendances installé de manière non reproductible.

## III. Dépendances déclarées et usages observés

### A. Dépendances effectivement utilisées

Les usages suivants sont observés dans le code source :

| Dépendance ou famille | Usage observé | Évaluation |
|---|---|---|
| `react`, `react-dom` | Interface React et rendu DOM | Nécessaires |
| `motion` | Animations via `motion/react` | Nécessaire, mais l’import `framer-motion` doit être harmonisé |
| `lucide-react` | Icônes de l’interface | Nécessaire |
| `maplibre-gl` | Moteur cartographique et feuille de style | Nécessaire |
| `react-map-gl` | Composants React autour de MapLibre | Nécessaire |
| `deck.gl` | Visualisation WebGL ; imports internes `@deck.gl/react` et `@deck.gl/layers` | Nécessaire, mais les sous-packages importés doivent être traités explicitement |
| `@tailwindcss/vite`, `tailwindcss` | Intégration Tailwind avec Vite | Nécessaires |
| `@vitejs/plugin-react`, `vite` | Build et transformation React | Nécessaires |
| `typescript`, `vitest` | Vérification TypeScript et tests | Nécessaires au développement |
| `tailwind-merge`, `clsx` | Utilitaires de classes ; à conserver si les imports sont confirmés dans `src/lib/utils.ts` | À confirmer précisément |

### B. Dépendances non observées dans les imports applicatifs

| Dépendance | Constat | Recommandation |
|---|---|---|
| `@google/genai` | Aucun import applicatif trouvé ; seule la variable `GEMINI_API_KEY` apparaît dans la configuration et la documentation | Supprimer si Gemini n’est plus utilisé, ou implémenter un appel serveur sécurisé. |
| `dotenv` | Aucun import trouvé ; Vite charge déjà les variables d’environnement nécessaires | Supprimer du client. |
| `express` | Aucun serveur Express trouvé dans le dépôt | Supprimer, ainsi que `@types/express`, sauf projet serveur prévu séparément. |
| `tsx` | Aucun script npm ne l’utilise actuellement | Supprimer si aucun script local ne le requiert. |
| `autoprefixer` | Aucun fichier PostCSS ni script ne l’utilise explicitement ; Tailwind v4 avec le plugin Vite n’en a généralement pas besoin dans cette configuration | Vérifier puis supprimer s’il n’est pas requis par une intégration externe. |

La suppression doit être faite après vérification fonctionnelle, puis suivie d’une régénération propre du lockfile.

## IV. Incohérences techniques prioritaires

### A. Lockfile non reproductible — criticité élevée

`npm ci` échoue avec de nombreux paquets absents du lockfile, notamment des dépendances de Deck.gl, de la cartographie et de bibliothèques auxiliaires. Le dépôt versionne donc un lockfile qui ne décrit pas complètement l’arbre nécessaire au manifeste actuel.

**Impact :** un nouveau clone peut échouer en CI, sur une autre machine ou lors d’un changement de version Node/npm. Une installation avec `npm install` peut également résoudre des versions différentes de celles utilisées lors du déploiement précédent.

**Correction recommandée :** choisir la version Node cible, supprimer `node_modules`, exécuter `npm install`, vérifier le build et les tests, puis committer le nouveau `package-lock.json`. Il ne faut pas appliquer `npm audit fix --force` avant cette étape, car cela peut introduire des changements majeurs non contrôlés.

### B. Import direct d’un package seulement transitif — criticité élevée

`src/components/Map.tsx` contient :

```ts
import { motion, AnimatePresence } from 'framer-motion';
```

Le manifeste déclare `motion`, pas `framer-motion`. L’installation actuelle permet cet import uniquement parce que `motion` installe `framer-motion` dans son arbre interne.

**Correction recommandée :** remplacer cet import par `motion/react`, comme dans les autres composants, ou déclarer `framer-motion` comme dépendance directe. La première option est préférable si l’objectif est d’utiliser une seule famille de packages Motion.

### C. Sous-packages Deck.gl importés implicitement — criticité moyenne à élevée

Le code importe directement `@deck.gl/react` et `@deck.gl/layers`, tandis que le manifeste ne déclare que `deck.gl`. Le package agrégateur les fournit actuellement, mais cette relation ne doit pas être supposée stable pour un projet qui importe directement ces modules.

**Correction recommandée :** soit importer via l’API publique documentée de `deck.gl` si elle couvre exactement le besoin, soit déclarer explicitement `@deck.gl/react` et `@deck.gl/layers` aux versions compatibles. Après modification, régénérer et tester le lockfile.

### D. Erreurs TypeScript sur `import.meta.env` — criticité moyenne

Le lint échoue sur les lignes 444 et 453 de `src/components/Map.tsx`, car le type de `ImportMeta` ne connaît pas `env`.

**Correction recommandée :** ajouter un fichier `src/vite-env.d.ts` contenant la référence aux types Vite et les variables d’environnement autorisées, par exemple `/// <reference types="vite/client" />`, puis déclarer les propriétés personnalisées si nécessaire. Il faut aussi éviter de dupliquer la logique entre `process.env` injecté par `vite.config.ts` et `import.meta.env` utilisé dans le code.

### E. Exposition potentielle d’une clé Gemini — criticité élevée si la fonctionnalité est activée

`vite.config.ts` injecte `GEMINI_API_KEY` dans le bundle via `define`. Toute clé injectée dans une application Vite cliente devient récupérable par un utilisateur depuis les fichiers JavaScript livrés au navigateur.

**Correction recommandée :** ne jamais exposer une clé Gemini privée dans le bundle public. Déplacer l’appel vers une fonction serveur ou une API protégée, appliquer des limites et utiliser uniquement une variable `VITE_` pour les valeurs qui sont réellement publiques. Si Gemini n’est plus utilisé, supprimer la variable et la dépendance.

## V. Analyse des vulnérabilités

L’audit npm de l’arbre installé depuis `package.json` donne le résultat suivant :

| Niveau | Nombre | Origine principale |
|---|---:|---|
| Critique | 0 | Aucune vulnérabilité critique détectée |
| Élevée | 12 | Principalement Deck.gl, Loaders.gl, Luma.gl, `protobufjs`, `image-size`, `ws` et Browserslist |
| Modérée | 7 | `fflate`, `qs`, `body-parser`, Browserslist et modules associés |
| Faible | 1 | `esbuild` dans un contexte de serveur de développement Windows |

Le groupe le plus important est lié à `deck.gl@9.4.0`. npm propose un correctif qui entraîne l’installation de `deck.gl@9.1.0`, identifié comme changement majeur par npm. Cette proposition ne doit pas être considérée comme une correction sûre : elle peut résoudre certains avis tout en régressant des API ou des comportements utilisés par l’application.

La priorité réaliste est de vérifier les avis de sécurité dans un environnement de développement, de tester une mise à jour contrôlée de Deck.gl et de ses sous-packages, puis de comparer visuellement la carte, les couches WebGL, les infobulles et les performances. Pour une application uniquement cliente, les vulnérabilités concernant des parseurs de fichiers ou des serveurs de développement sont moins directement exposées en production, mais elles restent importantes dans la chaîne de build et dans les environnements de développement partagés.

## VI. Performance et poids des bundles

Le build produit notamment les tailles gzip suivantes :

| Chunk | Taille minifiée | Taille gzip | Observation |
|---|---:|---:|---|
| `map` | environ 1 058 kB | environ 284 kB | Chunk principal cartographique trop lourd |
| `deck` | environ 828 kB | environ 230 kB | Poids important lié à Deck.gl et ses dépendances |
| `index` | environ 310 kB | environ 66 kB | Acceptable mais améliorable |
| `motion` | environ 133 kB | environ 44 kB | Cohérent, à surveiller |
| `react` | environ 236 kB | environ 75 kB | Normal pour l’application actuelle |

La configuration augmente `chunkSizeWarningLimit` à 1 000 kB, mais cela masque seulement l’avertissement ; cela ne réduit pas le bundle.

**Recommandations :** charger la vue cartographique avec `React.lazy`, charger Deck.gl uniquement lorsque l’utilisateur ouvre le simulateur, éviter d’importer des couches inutilisées, vérifier si `PointCloudLayer` et d’autres modules sont réellement nécessaires, puis mesurer avec une analyse de bundle. Le fractionnement manuel ne doit pas être utilisé pour masquer une dépendance inutile.

## VII. Plan de correction priorisé

### Priorité 0 — rendre l’installation fiable

1. Choisir et documenter une version Node LTS, idéalement via `.nvmrc` ou `engines`.
2. Supprimer `node_modules` et régénérer `package-lock.json` depuis `package.json`.
3. Exécuter `npm ci`, `npm run lint`, `npm test` et `npm run build` sur un clone propre.
4. Commiter le lockfile régénéré avec le changement correspondant.

### Priorité 1 — corriger les incohérences de dépendances

1. Remplacer l’import `framer-motion` par `motion/react`, ou déclarer explicitement `framer-motion`.
2. Décider si `@deck.gl/react` et `@deck.gl/layers` doivent être des dépendances directes.
3. Supprimer les paquets réellement inutilisés après recherche finale des imports.
4. Ajouter les types Vite pour corriger `import.meta.env`.

### Priorité 2 — traiter la sécurité

1. Retirer toute clé Gemini du bundle public.
2. Tester une mise à niveau contrôlée de Deck.gl et des paquets Loaders.gl associés.
3. Exécuter `npm audit` après chaque groupe de mises à jour.
4. Ajouter une vérification automatisée dans GitHub Actions, sans bloquer immédiatement les builds sur les vulnérabilités de développement non exploitables en production.

### Priorité 3 — améliorer le poids et la robustesse

1. Mettre la carte et Deck.gl derrière un chargement différé.
2. Réduire les imports de couches inutilisés.
3. Définir des budgets de taille de bundle.
4. Tester la mise à jour du service worker, car sa stratégie de cache peut conserver d’anciens bundles après un déploiement.

## VIII. Ce qu’un expert ferait à ta place

Un expert ne commencerait pas par exécuter `npm audit fix --force`. Il commencerait par rétablir la reproductibilité, car un audit de sécurité sur un arbre qui ne peut pas être réinstallé proprement n’est pas une base stable. Ensuite, il réduirait le manifeste à ce que l’application utilise réellement, corrigerait les imports transitoires et mettrait en place une validation automatique sur chaque push.

Il vérifierait également la configuration réelle du projet Vercel — commande d’installation, version Node, commande de build, répertoire de sortie et variables d’environnement — car le dépôt ne contient pas de `vercel.json` et le connecteur Vercel de cette session n’est pas activé. Le site public répond bien, mais cela ne suffit pas à prouver que sa configuration interne correspond exactement au dépôt GitHub actuel.

## IX. Contre-arguments et angles morts

Le fait que Vercel serve actuellement une page HTTP 200 ne signifie pas que le pipeline est sain. Le déploiement peut fonctionner grâce à un cache, à une installation permissive ou à une configuration Vercel différente de celle attendue dans le dépôt.

De même, le fait que les tests unitaires passent ne valide presque pas la partie cartographique. Les tests couvrent les fonctions mathématiques nucléaires, mais pas le rendu MapLibre, les couches Deck.gl, les variables d’environnement, le service worker, les performances WebGL ou le comportement hors ligne.

Enfin, supprimer `express` et `@google/genai` est probablement correct d’après les imports actuels, mais ce choix doit être confirmé si une fonction serveur est gérée en dehors de ce dépôt ou si une branche de déploiement utilise une fonctionnalité non présente dans `main`.


## Références

[1]: https://github.com/elfridw4-ops/NukeMap-3D-Edu "Dépôt GitHub officiel de NukeMap-3D-Edu"

[2]: https://nukemap-3d.vercel.app "Déploiement public Vercel de NukeMap-3D-Edu"

[3]: https://docs.npmjs.com/cli/v10/commands/npm-ci "Documentation npm ci"

[4]: https://docs.npmjs.com/cli/v10/commands/npm-audit "Documentation npm audit"

[5]: https://vite.dev/guide/env-and-mode "Variables d’environnement et modes dans Vite"

[6]: https://deck.gl/docs/get-started/using-with-react "Utilisation de Deck.gl avec React"

[7]: https://vercel.com/docs/deployments/configure-a-build "Configuration d’un build Vercel"

[8]: https://github.com/motiondivision/motion "Dépôt officiel de Motion"

---

**Auteur :** Manus AI  

**Statut :** audit statique et validation locale ; aucune modification poussée vers GitHub ou Vercel.
