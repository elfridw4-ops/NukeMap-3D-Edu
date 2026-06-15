# Fiche Portfolio Professionnelle : NUKEMAP EDU

---

## Nom du projet
**NUKEMAP EDU**

---

## Résumé en une phrase
Un simulateur scientifique 2D/3D interactif et outil pédagogique de pointe dédié à la modélisation physique, thermique, géographique et hydrodynamique des impacts d'armes nucléaires.

---

## Problème résolu
Le manque d'outils de sensibilisation et d'éducation publique à la fois scientifiquement rigoureux et visuellement appréhendables pour comprendre les conséquences physiques réelles des armes nucléaires. Les simulateurs historiques existants, souvent vieillissants et purement bidimensionnels, n'intègrent pas la complexe topographie locale, l'interaction avec la tropopause, la rugosité du terrain urbain et les risques hydrodynamiques côtiers secondaires (comme les tsunamis locaux induits par l'onde de choc et l'effet de shoaling côtier). NUKEMAP EDU comble ce vide en proposant des simulations dynamiques interpolant des données géographiques et physiques réelles n'importe où sur Terre.

---

## Public cible
*   **Enseignants, Étudiants et Chercheurs** en géopolitique, physique, environnement, et gestion des risques majeurs.
*   **Analystes de Défense Passive** et organisations de gestion de crise civile.
*   **Le Grand Public** souhaitant comprendre la réalité brute et non censurée des rayons d'impact et des bilans humains présumés à partir de données tangibles.

---

## Fonctionnalités principales
1.  **Sélecteur et Configuration d'Armes & Vecteurs** : Accès à des profils historiques réels répertoriés (Little Boy, Fat Man, Tsar Bomba, etc.) ou personnalisables (yield en kilotonnes, type de réaction : fission, fusion, ou bombe sale/dirty).
2.  **Simulation de Livraison Balistique** : Animation en temps réel et calcul de courbe parabolique pour des missiles balistiques (ICBM, IRBM, bombes à gravité, MRBM), calculant la trajectoire, l'apogée géométrique, la vitesse de rentrée et le temps de vol.
3.  **Cartographie Interactive d'Overpressure** : Déploiement en temps réel d'ondes barométriques (de 20 psi pour la destruction structurelle lourde à 1-2 psi pour le bris de vitres) et d'isothermes thermiques réglant les degrés de brûlure cutanée (1er, 2ème et 3ème degré).
4.  **Enrichissement Géographique Automatique (API)** : Interrogation synchrone d'API tiers (OpenStreetMap Overpass, Open-Meteo DEM) au point GPS sélectionné pour capturer l'altitude, la pente topographique moyenne, le profil de relief cardinal sur 5 points et comptabiliser les infrastructures critiques à portée (hôpitaux, écoles, voies de transport, zones industrielles).
5.  **Calculateur de Risque Hydrodynamique (Tsunamis)** : En cas d'impact maritime ou proche littoral, modélisation mathématique s'appuyant sur les lois de propagation d'Airy et de shoaling de Green pour estimer les hauteurs de vagues côtières, la vitesse de propagation et la portée d'inondation.

---

## Fonctionnalités avancées
1.  **Interpolateur Volumétrique Stochastique (PointCloud 3D)** : Génération tridimensionnelle hautes performances d'un nuage de 8 000 points volumétriques interpolant dynamiquement le tronc et le chapeau du champignon atomique, recalculé selon l'énergie de l'arme.
2.  **Couplage Organique Terre-Atmosphère** :
    *   *Rugosité de Manning (n)* : Ajustement automatique du coefficient en fonction de la densité de population modélisant l'amortissement du souffle par le tissu urbain (`terrainDamping`).
    *   *Limite de la Tropopause* : Algorithme latitudinal ajustant la hauteur maximale physique du champignon (allant de 8 km aux pôles à 17 km à l'équateur), forçant l'étalement horizontal du nuage radioactif dès l'impact de la barrière stratosphérique si l'énergie thermique est suffisante.
3.  **Propagation Angulaire du Vent (Fallout 2D/3D)** : Panache elliptique dynamique de retombées radioactives généré en direct à partir de la vitesse et de la direction locales du vent réel obtenues par requête d'API météorologique.

---

## Mon rôle
En tant que **Lead Technique & Architecte Logiciel**, j'ai conçu et implémenté l'ensemble de l'architecture logicielle, des formules physiques de simulation aux couches cartographiques vectorielles complexes. 
*   **Ingénierie Physique** : Traduction des équations empiriques du guide de référence officiel *"The Effects of Nuclear Weapons"* (Glasstone & Dolan, 1977) en TypeScript pur et performant.
*   **Intégration et API** : Écriture du connecteur géographique asynchrone `geoDataFetcher.ts` gérant la cartographie OSM et Open-Meteo avec fallbacks robustes en cas d'erreur réseau ou de limite de quota.
*   **Visualisation Cartographique 3D** : Configuration des calques réactifs Deck.gl v9 et codage des accesseurs de rayons rétro-compatibles de MapLibre GL dans un environnement Single Page Application fluide.
*   **Design UX/UI** : Établissement de l'interface et de la charte graphique sous la thématique "Bunker Chic / Brutalisme Tactique", en priorisant la lisibilité, l'ergonomie mobile, et la compacité des données de la sidebar d'analyse.

---

## Technologies utilisées

### Frontend
*   **React 19 & TypeScript** : Structuration de l'application, hooks personnalisés pour la chronologie d’animation de l'onde de choc et la synchronisation spatiale (useMemo pour la mise en cache des calculs de rayons).
*   **Tailwind CSS 4** : Conception d'une interface responsive et optimisée aux critères d'accessibilité.
*   **Deck.gl v9 & MapLibre GL** : Moteur cartographique vectoriel 2D/3D gérant les couches animées et le nuage de points volumétriques.

### Backend & Serveur
*   **Vite dev-server** : Environnement d'exécution client-side haute vélocité avec compilation instantanée des modules ES.

### Base de données & Fichiers de Données
*   **Base de Données Géophysiques Locale (JSON)** : Fichier `cities.json` contenant les métadonnées de bathymétrie, climatologie, et géographie de villes stratégiques réelles mondiales servant de référence haute fidélité.

### APIs
*   **OpenStreetMap Overpass API** : Interrogation spatiale en temps réel des infrastructures critiques environnantes en fonction des coordonnées GPS du point d'impact.
*   **Open-Meteo Elevation API** : Extraction dynamique des données altimétriques locales pour calculer la rugosité de terrain réelle.
*   **OSM Nominatim API** : Géocodage inversé de la cible pour l'obtention du nom de ville et de pays réel.

### IA Utilisée
*   **Modèles Gemini 3.5 & 3.1** : Intégration théorique pour optimiser et valider la structuration des algorithmes physiques et la génération rationnelle des indicateurs météorologiques via des invites de raisonnement.

---

## Défis rencontrés
1.  **Dépassement des limites mémoire lors de la modélisation 3D** : Rendre un nuage de points tridimensionnels représentatif de l'explosion nucléaire sans ralentir l'exécution du navigateur (notamment sur téléphones portables).
2.  **Incompatibilités d'API Deck.gl v9** : Les versions récentes de Deck.gl appliquent des contraintes de typage strictes sur les accesseurs de calques circulaires (`getRadius`), provoquant des crashs d'initialisation invisibles en mode statique lorsque certaines valeurs d'impact étaient temporairement indéfinies.
3.  **Variabilité et latence des API Distantes** : Les services OSM Overpass et Open-Meteo subissent parfois des blocages ou des temps de réponse supérieurs à 3 secondes, risquant de geler l'interface au moment de l'impact virtuel.

---

## Solutions apportées
1.  **Génération Stochastique Légère** : Remplacement des maillages 3D polygonaux complexes par un modèle stochastique à 8 000 points volumétriques légers contrôlé par un `PointCloudLayer` à coordonnées calculées à la volée, maintenant un framerate constant de 60fps stable.
2.  **Standardisation des Accesseurs Pures** : Réécriture systématique des propriétés géométriques sous forme de fonctions accesseurs JavaScript sûres `() => radii.moderateBlast` au lieu de scalaires directs, immunisant l'application contre les comportements imprévus ou asynchrones.
3.  **Double Stratégie Fonctionnelle (Fallbacks)** : Intégration d'un algorithme de repli physique intelligent dans le module `geoDataFetcher.ts`. Si l'API Overpass échoue ou dépasse 2,5 secondes d'attente, l'application génère un profil de densité cohérent modélisé à partir de coordonnées mathématiques et de la base de données statique interne de 15 villes emblématiques du monde.

---

## Valeur ajoutée
NUKEMAP EDU offre un niveau de précision éducatif inégalé par rapport aux applications similaires. La simulation ne se contente pas de tracer des cercles théoriques : elle confronte l'impact nucléaire à la réalité géographique du monde réel (effet des montagnes, direction des vents locaux en direct, présence d'écoles ou d'hôpitaux locaux à portée immédiate). Cela permet de démystifier les modèles physiques conceptuels en les transposant dans un contexte concret, apportant une dimension hautement pédagogique face au risque existentiel représenté par ce type d'armement.

---

## Cas d'utilisation
1.  **Enseignement Académique (Histoire/Géographie/Géopolitique)** : Un professeur de lycée ou d'une école d'ingénieurs illustre l'impact des frappes historiques de 1945 (Hiroshima et Nagasaki) en comparant l'effet d'entonnoir de la baie de Nagasaki face au relief de plaine de Hiroshima sur la propagation de l'onde thermique.
2.  **Simulation Institutionnelle de Défense Civile** : Un analyste en urbanisme utilise l'application pour tester fictivement l'impact de détonations d'ogives tactiques et quantifier le taux de destruction d'hôpitaux ou de blocage d'infrastructures de transport majeures pour orienter la résilience infrastructurelle civile.
3.  **Module Éducatif Interactif Personnel** : Un utilisateur curieux évalue le rayon de fallout pour sa région de résidence, en observant comment les vents du jour (chargés via l'API en temps réel) influenceraient le sens de déplacement des débris et des radiations dans son environnement immédiat.

---

## Ce qui différencie ce projet
*   **Approche Holistique de la Bathymétrie et de la Météorologie** : C'est le seul simulateur léger intégrant nativement un calculateur hydrodynamique de haut-fond de tsunami associé à un interpolateur de rugosité de Manning s'adaptant à la zone simulée.
*   **Identité Visuelle Forte "Bunker Chic"** : Le design se démarque des interfaces "grand public" colorées en adoptant un design monochrome de console d'état-major austère, ce qui favorise la concentration sur les faits techniques bruts.
*   **Indépendance Vis-à-Vis des Frameworks Lourds** : Tout le cœur géophysique et balistique est calculé côté client, rendant l'application extrêmement légère, fluide, et facile à déployer de manière autonome.

---

## Compétences démontrées
*   **Mathématiques de Simulation Moléculaire & Physique** : Implémentation d'équations intégrales et de fonctions exponentielles non linéaires appliquées à la physique atomique de Glasstone.
*   **Développement Full-Stack Réactif** : Maîtrise avancée des technologies réactives modernes (Vite, React 19, Tailwind 4) et de la cartographie haute performance WebGL (Deck.gl, MapLibre GL).
*   **Ingénierie des Données & Consommation d’API Extérieures** : Nettoyage, normalisation de réponses JSON disparates de multiples APIs distantes complexes, et gestion asynchrone sécurisée avec filet de sécurité.
*   **Architecture Documentaire Rigoireuse** : Maintien et structuration d'un historique de modifications d'ingénierie (style ADR) assurant l'alignement immédiat d'une équipe technique pluridisciplinaire.

---

## Captures recommandées
1.  **Vue Globale de la Console d'Impact** : La console de contrôle noire "Bunker Chic" à gauche contrastant avec les cercles translucides rouge, jaune, et orange d'overpressure projetés sur le fond noir de la carte.
2.  **La Jauge d'Impact et l'Analyse de Cible Intégrée** : Gros plan sur les indicateurs de population cumulée détruite, compteurs d'écoles/hôpitaux détruits et l'onde elliptique de vent réel propageant son panache de cendres.
3.  **La Trajectoire Balistique d'ICBM** : Visualisation 3D en perspective latérale montrant l'arc de parabole orange s'élevant très haut dans le ciel avant la retombée finale de l'ogive de lancement.
4.  **Le Graphique Hydrodynamique Côtière** : Fenêtre affichant le profil de shoaling avec l'onde de tsunami augmentant en altitude à l'approche de la grève.

---

## Description courte pour portfolio
> Conçu dans une esthétique "Bunker Chic", NUKEMAP EDU est un simulateur scientifique 2D/3D et outil pédagogique de modélisation des impacts nucléaires. L’application calcule en temps réel les ondes de surpression, les brûlures thermiques, la trajectoire balistique ainsi que les tsunamis de haut-fond côtiers à partir de données réelles géographiques et météorologiques (APIs).

---

## Description moyenne pour portfolio
> NUKEMAP EDU est un simulateur scientifique 2D/3D d'impacts d'armes nucléaires développé en React 19, TypeScript et Deck.gl, adoptant une esthétique minimaliste "Bunker Chic" inspirée des consoles de commandement radar. 
> 
> En combinant les équations physiques empiriques de Glasstone & Dolan à une récupération de données géographiques en temps réel (OpenStreetMap & Open-Meteo API), l'application affiche avec précision les rayons de ravage barométrique, thermique et le panache de retombées radioactives au vent réel. L'outil intègre un simulateur balistique de trajectoire 3D et un calculateur hydrodynamique évaluant en direct le comportement de tsunami local et de shoaling côtier. Conçu comme une console d'analyse scientifique, NUKEMAP EDU résout le problème du manque d'outils rigoureux d'aide à la compréhension des menaces militaires non conventionnelles actuelles.

---

## Description longue pour étude de cas
> ### Introduction & Vision Générale
> NUKEMAP EDU est une console interactive de vulgarisation scientifique et d’aide à la formation sur les risques physiques majeurs liés aux armements nucléaires stratégiques et tactiques. Face à un climat géopolitique complexe, l'outil propose une approche pragmatique, directe et scientifiquement rigoureuse pour comprendre d'une manière visuelle la dévastation immédiate causée par ces armes.
> 
> ### Problématique & Défis d'Ingénierie
> Les solutions de cartographie nuclear-blast historiques exploitent des approximations déconnectées des réalités du lieu cliqué. Le premier défi a consisté à concevoir un modèle capable de coupler la physique de l'overpressure et du rayonnement thermique à l'environnement géomorphologique réel. Le terrain urbain dense freine le vent barométrique ; la hauteur de la troposphère à la latitude cible délimite l'expansion verticale du champignon atomique ; l'impact littoral génère des déplacements maritimes secondaires qui ne pouvaient jusqu'ici être calculés.
> 
> Un second défi concernait la performance applicative : comment afficher une trajectoire balistique parabolique ou un nuage de 8000 débris radioactifs tridimensionnels sans surcharger les microprocesseurs mobiles, tout en garantissant une rétro-compatibilité totale avec les moteurs WebGL stricts de Deck.gl v9 ?
> 
> ### Solutions Techniques Apportées
> L'architecture s'appuie sur une structure d'application Single Page Application ultra-performante basée sur Vite, React 19 et Tailwind CSS 4.
> 1.  **L’Intelligence Géomorphologique (Connecteur `geoDataFetcher.ts`)** : Au clic, l’application orchestre des requêtes simultanées vers des APIs mondiales externes. Elle extrait le volume d’habitants au km² (WorldPop/ONU), l’altitude de l’épicentre (DEM) et le décompte d’infrastructures sensibles adjacentes d'OpenStreetMap. L'écart d'altitude local calcule à la volée une rugosité de terrain corrélée à un coefficient d'amortissement (`terrainDamping`) appliqué à la force de propagation de l'onde de choc.
> 2.  **Moteur Physique Résilient** : Tous les calculs de diffraction d'onde de souffle de Glasstone (20 psi à 1 psi) et les isothermes de brûlure cutanée ont été développés en TypeScript pur optimisé. Pour contrer les instabilités d’initiation cartographique, les accesseurs de calcul de Deck.gl ont été encapsulés dans des fonctions dynamiques pures, filtrant les valeurs non initialisées et prévenant les fuites mémoire.
> 3.  **Modélisation Éléments Volumétriques Légers** : Le champignon atomique 3D est rendu par un moteur stochastique générant des micro-vecteurs simulés par une couche `PointCloudLayer` calculée par coordonnées mathématiques, préservant 60 images par seconde y compris sur mobile. Un algorithme latitudinal vient modifier la hauteur maximale en interpolant la hauteur de la tropopause réelle de la cible cliquée.
> 
> ### Synthèse de Valeur Ajoutée & Impact
> NUKEMAP EDU élimine l'abstraction théorique. En plaçant l'utilisateur au centre d'une interface de centre de crise militaire, il propose une expérience où l'éducation se fait par l'analyse statistique brute. C’est un allié exceptionnel pour l'enseignement stratégique contemporain, démontrant de solides compétences en calculs mathématiques appliqués, intégration d'interfaces géolocalisées complexes et visualisation de données graphiques hautes performances.

---

## Mots-clés
*   **SEO & Web** : Simulateur Nucléaire 3D, NukeMap Pédagogique, Simulation Onde de Choc, Calculateur d'Overpressure, Impact Brûlure Thermique, Propagation Retombées Radioactives, Trajectoire Balistique Balayage Vent, Calcul Shoaling Tsunami Côtier, Deck.gl MapLibre Mapbox React 19.
*   **Portfolio** : Ingénieur R&D Physique, Développeur Cartographie WebGL, Lead Developer React TypeScript, UI Bunker Chic, Modélisation Mathématique Appliquée, Développeur Algorithmique Géotechnique, Visualisation Spatiale de Crise.
