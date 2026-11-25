# Stratégie SEO & Référencement : NUKEMAP EDU

---

## 1. Optimisations Techniques SEO

### Balisage HTML & Structure Sémantique
Pour maximiser l'indexabilité par les robots des moteurs de recherche (Google, Bing), le code source respecte une hiérarchie stricte des balises sémantiques :
- **Un seul titre principal `<h1>`** par vue (Landing Page vs Console).
- **Emploi systématique de `<section>`**, `<article>`, `<header>` et `<footer>` pour segmenter la structure logique.
- **Microdonnées & Schémas JSON-LD** : Insertion d'un schéma d'application éducative/scientifique pour favoriser l'obtention de *Rich Snippets* dans les résultats de recherche.

### Métadonnées Réactives (Open Graph & Twitter Cards)
Afin de garantir un taux de clic élevé lors des partages sur les réseaux sociaux (X/Twitter, LinkedIn, Discord), les balises suivantes sont injectées dans `<head>` (via notre fichier `/index.html` et via routage d'injection dynamique) :
```html
<meta name="description" content="Simulateur scientifique interactif 2D/3D d'impacts nucléaires terrestres. Modélisation de surpression, dispersion météorologique et calculateur de tsunami côtiers." />

<!-- Open Graph -->
<meta property="og:title" content="NUKEMAP EDU : Simulateur Scientifique & Pédagogique 3D" />
<meta property="og:description" content="Visualisez en direct l'impact d'ondes de choc barométriques et de propagation balistique couplé aux métadonnées géographiques et météo locales de la cible cliquée." />
<meta property="og:image" content="/icon.png" />
<meta property="og:type" content="website" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="NUKEMAP EDU : Simulateur Physique Direct" />
<meta name="twitter:description" content="Observez d'une façon transparente et rigoureuse les rayonnements de chaleur et tsunamis côtiers avec calcul d'indices de peuplements OSM réels." />
<meta name="twitter:image" content="/icon.png" />
```

### Critères de Performance Web (Core Web Vitals)
- **Time to First Byte (TTFB)** : Ultra-faible grâce à un hébergement optimisé sur Cloud Run avec Nginx et compression Gzip/Brotli active.
- **Largest Contentful Paint (LCP)** : Amélioré par le chargement asynchrone progressif du moteur de rendu cartographique Deck.gl et MapLibre, évitant le gel de la première peinture de pixels.
- **Cumulative Layout Shift (CLS)** : Prévu à `0` grâce à des conteneurs cartographiques et des panneaux latéraux à hauteurs et largeurs d'affichages rigides pré-calculées.

---

## 2. Recherche et Ciblage de Mots-clés

### Mots-clés Principaux (Cœur de cible)
*   *simulateur nucleaire en ligne gratuit*
*   *calculer rayon explosion bombe atomique*
*   *simulateur nuke 3d*
*   *impact arme tactique carte interactif*
*   *retombées radioactives vents réels*

### Mots-clés Secondaires (Longue Traîne Académique)
*   *couteau de survie effets physiques nucléaires*
*   *équations de Glasstone et Dolan gratuites*
*   *hauteur tropopause champignons atomique calcul*
*   *effet de shoaling tsunami souffle nucléaire*
*   *comptage d'écoles detruites portée surpression*

---

## 3. Structure de Pages Optimisée

L'application est structurée sous forme de Single Page Application réactive avec deux hubs sémantiques majeurs permettant d'optimiser le jus de liens internes (*PageRank*) :

1.  **Le Portail d'Onboarding (Landing Page)** :
    *   **Objectif** : Attirer et éduquer l'utilisateur de passage, rassurer les enseignants sur la décence et la pertinence académique de l'outil, et optimiser les taux de conversion vers l'outil.
    *   **Densité sémantique** : Haute. Présente les cas pratiques, la FAQ et détaille la validité des équations physiques.
2.  **La Console de Crise / Simulateur Actif** :
    *   **Objectif** : Offrir l'outil de calcul le plus réactif du marché.
    *   **Densité sémantique** : Moyenne (centrée sur les métadonnées de simulation locales interactives de la cible OSM en direct).

---

## 4. Exemples de Balises Clés rédigées

### Page d'Accueil (Landing Page)
*   **Meta Title** : `NUKEMAP EDU : Simulateur Scientifique & Physique Nucléaire 3D`
*   **Meta Description** : `Simulez gratuitement et avec rigueur les impacts de surpressions thermonuclear, les trajectoires de missiles ICBM et les tsunamis de plateaux côtiers.`
*   **Titres de Structure** :
    *   `H1` : NUKEMAP EDU : VECTEURS & PROPAGATION 3D
    *   `H2` : La réalité physique et hydrodynamique des impacts nucléaires sur simulateur 2D/3D
    *   `H2` : Technologie de Modélisation Avancée (Modules de Calcul)
    *   `H2` : Cas Pratiques & Champs d'Applications Professionnels

### Vue Tableur / Écran d'Analyse Drone (Console active)
*   **Meta Title** : `Console de Commandement Tactique - NUKEMAP EDU`
*   **Meta Description** : `Calculateur d'overpressure barométrique active et d'isothermes thermiques au point GPS de coordonnées cliquées. Analyse des infrastructures OSM exposées.`

---

## 5. Pratiques SEO à Long Terme (Maintenance Vivante)

1.  **Suivi de l'indexation de la console cartographique** : S'assurer que les robots ne se bloquent pas sur les couches WebGL de MapLibre en maintenant des alternatives textuelles enrichies (notamment la table de données de villes `cities.json` référencée en clair).
2.  **Mise à jour régulière de l'API cartographique** : Garder des temps de latence DNS faibles pour ne pas pénaliser le crawl des pages interactives.
3.  **Stratégie de Netlinking** : Favoriser des partenariats organiques et des citations dans les bulletins de géographie, d'histoire ou de sciences physiques de l'Éducation Nationale pour obtenir des liens entrants en `.edu` ou `.gouv` de grande valeur.
