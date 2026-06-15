# Guide de l'Architecture de NUKEMAP EDU

Ce guide s'adresse à la fois aux nouveaux développeurs rejoignant le projet et aux curieux désireux de comprendre comment s'articulent la physique des détonations et la cartographie interactive de l'application.

---

## 1. Vue d'Ensemble de l'Architecture

NUKEMAP EDU est structurée selon un modèle **uni-directionnel réactif** (Flux) :

```
                  [ Interaction Utilisateur (Carte / Sidebar) ]
                                       │
                                       ▼
                     [ Déclenchement d'Actions State ]
                                       │
                                       ▼
                       [ Moteur Math: nuclearMath.ts ] 
                       (Calcul des cercles, tsunami...)
                                       │
                                       ▼
                          [ Mise à Jour du React State ]
                                       │
                                       ▼
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
 [ Rendu Deck.gl & Maplibre ]                                  [ Sidebar Gauche ]
 (Tracé géométrique des couches)                             (Détails, Gauges, Graphes)
```

Toutes les données transitent par l'état central défini dans `App.tsx`, qui distribue ensuite les informations filtrées aux composants d'affichage.

---

## 2. Dossiers, Fichiers et Rôles Précis

### Dossier Racine `/`
*   `package.json`
    *   **Rôle et responsabilités** : Manifeste du projet définissant les scripts de développement et de build, ainsi que les versions de toutes les dépendances logicielles.
    *   **Pourquoi il existe** : Pour déclarer l'environnement d'exécution Node/Vite requis.
    *   **Ce qui casse s'il disparaît** : L'application ne peut plus démarrer, aucune dépendance ne s'installe.
    *   **Qui l'utilise** : Les gestionnaires de paquets (npm, yarn) et le serveur d'intégration continue.
*   `vite.config.ts` (ou équivalant implicite)
    *   **Rôle et responsabilités** : Configure le compilateur et bundler Vite pour parser le TypeScript et optimiser le code pour la production.
    *   **Pourquoi il existe** : Pour lier les plugins de build (comme React et Tailwind).
    *   **Ce qui casse s'il disparaît** : Vite ne peut plus transcrire le JSX, arrêt de la compilation.
    *   **Qui l'utilise** : Vite au moment du lancement local avec `npm run dev` ou du build d'assets avec `npm run build`.

---

### Dossier `/src`

#### `src/main.tsx`
*   **Rôle et responsabilités** : Point d'entrée de montage du React DOM.
*   **Pourquoi il existe** : Pour instancier l'application globale au sein de la balise HTML racine `<div id="root">`.
*   **Ce qui casse s'il disparaît** : L'écran reste totalement blanc.
*   **Qui l'utilise** : Le navigateur lors du décodage du fichier `index.html`.

#### `src/App.tsx`
*   **Rôle et responsabilités** : Cœur réactif central de l'application de simulation.
*   **Pourquoi il existe** : Il centralise la configuration de l'arme sélectionnée, les coordonnées géographiques géocodées, l'état de l'animation balistique et les données environnementales mères.
*   **Ce qui casse s'il disparaît** : L'entièreté de l'application s'effondre (perte de la sidebar, de la carte, des animations).
*   **Qui l'utilise** : L'ensemble de l'écosystème réactif de l'app.

#### `src/types.ts`
*   **Rôle et responsabilités** : Déclaration absolue et centralisée des structures et interfaces TypeScript.
*   **Pourquoi il existe** : Assure l'harmonisation de la transmission des types de données (comme `WeaponConfig`, `LaunchParams`, `BlastRadii`) entre la carte, le moteur physique et le panneau latéral.
*   **Ce qui casse s'il disparaît** : Erreurs de compilation TypeScript fatales sur la majorité des fichiers.
*   **Qui l'utilise** : Le compilateur TypeScript et l'éditeur de code (autocompression, intellisense).

#### `src/index.css`
*   **Rôle et responsabilités** : Feuille de style globale intégrant l'initialisation de Tailwind CSS.
*   **Pourquoi il existe** : Permet d'injecter et d'harmoniser les polices typographiques (`Inter`, `JetBrains Mono`) et de configurer les variables globales de thème.
*   **Ce qui casse s'il disparaît** : Plus aucune règle de style n'est lue, l'application s'affiche de manière désorganisée en texte brut.
*   **Qui l'utilise** : Le bundler CSS et le moteur de rendu graphique du navigateur.

---

### Dossier `/src/lib`

#### `src/lib/nuclearMath.ts`
*   **Rôle et responsabilités** : Le moteur physique de simulation de NUKEMAP EDU.
*   **Pourquoi il existe** : Il convertit les kt/Mt en mètres ou kilomètres de dégâts, implémente les équations de tsunami côtiers et détermine les structures de temps des chronologies d'impact.
*   **Ce qui casse s'il disparaît** : L'application n'affiche plus aucune jauge de dégâts ni zones de tsunami (calculs absents).
*   **Qui l'utilise** : `App.tsx`, `Sidebar.tsx` et `Map.tsx` pour dessiner les cercles concentriques.

#### `src/lib/citiesData.ts`
*   **Rôle et responsabilités** : Base de données statique intégrée de villes de référence mondiales.
*   **Pourquoi il existe** : Fournit des données réelles sur les pentes littorales de Brest, à la faille bathymétrique de Tokyo ou aux vents dominants de Paris pour des simulations éducatives ancrées dans la réalité géographique.
*   **Ce qui casse s'il disparaît** : Le sélecteur de villes stratégiques de référence dans la sidebar est dysfonctionnel ou vide.
*   **Qui l'utilise** : `Sidebar.tsx` pour l'affichage de la fiche scientifique et topographique.

#### `src/lib/utils.ts`
*   **Rôle et responsabilités** : Fonctions d'aide utilitaires (e.g. fusion de classes CSS Tailwind `cn()`).
*   **Pourquoi il existe** : Facilite la construction conditionnelle de chaînes de classes complexes sans alourdir le code.
*   **Ce qui casse s'il disparaît** : Les composants stylistiques dynamiques lèvent des exceptions de rendu.
*   **Qui l'utilise** : `Sidebar.tsx` et d'autres composants de structure.

---

### Dossier `/src/components`

#### `src/components/Map.tsx`
*   **Rôle et responsabilités** : Composant d'affichage géographique 2D/3D lourd.
*   **Pourquoi il existe** : Il instancie MapLibre GL, insère le fond de carte sombre Carto Basemaps, et empile les couches de géométrie Deck.gl (`ScatterplotLayer` pour les ondes thermiques/chocs, `PolygonLayer` pour les retombées, `PointCloudLayer` pour le champignon 3D).
*   **Ce qui casse s'il disparaît** : Plus aucun élément géographique ne s'affiche (perte de la carte visuelle).
*   **Qui l'utilise** : `App.tsx` pour contenir la moitié de l'écran principal.

#### `src/components/LandingPage.tsx`
*   **Rôle et responsabilités** : Portail éducatif d'onboarding et de présentation.
*   **Pourquoi il existe** : Présente la proposition de valeur de NUKEMAP EDU v2, expose les bénéfices académiques, détaille le fonctionnement de la modélisation à double flux et héberge la FAQ scientifique (équations de Glasstone, tsunami de Green).
*   **Ce qui casse s'il disparaît** : L'utilisateur n'a plus d'entrée pédagogique guidée sur l'application et tombe directement sur la console brute.
*   **Qui l'utilise** : `App.tsx` au lancement pour offrir une immersion produit initiale impeccable.

#### `src/components/Sidebar.tsx`
*   **Rôle et responsabilités** : Panneau latéral d'interactivité et de pilotage scientifique.
*   **Pourquoi il existe** : Gère la recherche textuelle (geocoding reverse Nominatim), le choix de l'arsenal, le déclenchement de la trajectoire balistique ainsi que les indicateurs numériques d'impacts.
*   **Ce qui casse s'il disparaît** : L'utilisateur ne peut plus interagir avec l'application, configurer les vents ou comprendre les bilans de crise.
*   **Qui l'utilise** : `App.tsx` pour la restitution ergonomique.

---

## 3. Conventions de Développement
*   **Nommage TypeScript** : Conventions PascalCase pour les types/interfaces (`BlastRadii`), camelCase pour les méthodes (`calculateTsunamiMetrics`).
*   **Composants React** : Approche orientée composants purs, les styles sont gérés à 100% via Tailwind utility classes (sans feuilles de style isolées).
*   **Deck.gl Accessors** : Tous les arguments de type radius ou color doivent impérativement être passés sous la structure de fonctions accesseurs (e.g., `getRadius: () => radii.fireball`) pour empêcher les suspensions d'initialisation de couche.

---

## 4. Points Critiques et Améliorations Possibles
*   **Points à surveiller (Fichiers sensibles)** :
    *   `src/lib/nuclearMath.ts` : Toute modification des puissances d'exposant (comme `Math.pow(yield, 0.33)`) modifie exponentiellement les bilans d'onde de choc terrestres.
    *   `src/components/Map.tsx` : L'instanciation de Deck.gl peut être ralentie si le volume de points du champignon volumétrique (`mushroomCloudData`) dépasse les 25 000 points sur les cartes graphiques d'entrée de gamme.
*   **Pistes d'amélioration** :
    *   *Optimisation du tracé balistique* : Remplacer l'approximation linéaire des lignes de vol par une vraie formule géodésique de grand cercle tridimensionnelle pour les trajets longue distance (e.g. transcontinentaux).
    *   *Mise en cache cartographique* : Sauvegarder les relevés de bathymétrie Nominatim localement dans le `localStorage` pour économiser la bande passante lors de vols d'essais répétés sur une même cible.
