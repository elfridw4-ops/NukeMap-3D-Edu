# Historique de Projet - NUKEMAP EDU

## Présentation du projet
* **Nom du projet ** : NUKEMAP EDU
* **Objectif** : Fournir un outil pédagogique et interactif de simulation nucléaire pour comprendre les impacts physiques, thermiques et hydrodynamiques (tsunamis côtiers, ondes de choc) d'une détonation.
* **Utilisateurs cibles** : Étudiants, enseignants, chercheurs et toute personne s'intéressant à la physique des armes nucléaires et à la prévention des risques majeurs.
* **Fonctionnalités principales** :
  * Simulation d'armes historiques et contemporaines ou d'ogives personnalisées.
  * Simulation de vecteurs de livraison balistiques avec calcul et animation de trajectoire parabolique en haute altitude.
  * Modélisation d'ondes de choc barométriques (cratère, 20 psi, 5 psi, 1-2 psi) et de brûlures thermiques (dégradés au 1er, 2ème et 3ème degré).
  * Impact côtier et tsunami via un interpolateur bathymétrique et topographique (Graphe de profil et de shoaling de l'onde de choc).
  * Intégration de données topographiques et météorologiques de villes réelles de référence.

## Architecture
Le projet est développé sur une base d'application moderne réactive Single Page Application (SPA).
* **Interface Utilisateur** : React 19 et Vite avec Tailwind CSS 4 pour la composition esthétique.
* **Cartographie et Visualisations** : MapLibre GL avec un jeu de couches hautement optimisées et animées fournies par Deck.gl v9 en mode 2D/3D (nuage de points volumétrique en PointCloudLayer pour le champignon atomique).
* **Physique & Calculs** : Module d'équations physiques implémenté en TypeScript pur dans `nuclearMath.ts` selon les lois d'échelles de Glasstone & Dolan (1977).

## Décisions techniques
* **Calcul des distances côtières** : Utilisation d'un modèle d'ancres géographiques côtières de référence réparties mondialement pour estimer automatiquement (GPS) ou manuellement le relief et la distance d'amortissement continentale.
* **Gestion du nuage de points** : Un simulateur stochastique génère 8000 points volumétriques interpolant le chapeau et le tronc du champignon atomique pour un rendu tridimensionnel sans surcharger la mémoire.
* **Deck.gl v9 Accessors** : Fixation des accesseurs de rayons (`getRadius`) sous forme de fonctions accesseurs pures (`() => valeur`) pour être rétro-compatibles avec la gestion stricte des variables non définies de Deck.gl v9.

## Historique des modifications
* **2026-05-11 — Initialisation du projet**
  * Création des modules physiques fondamentaux et de l'intégration de la carte.
  * Impact : Base de l'application disponible.
* **2026-05-11 — Correction et stabilisation Deck.gl**
  * **Modification** : Résolution du crash critique `accessor "getRadius" is not a function` lié à la valeur `radii.thermal` indéfinie.
  * **Détail** : Remplacement de l'ancien accesseur scalaire par des fonctions accesseurs dynamiques pour chaque cercle concentrique de destruction (`fireball`, `crater`, `heavyBlast`, `moderateBlast`, `lightBlast`, `thermal3rd`, `thermal2nd`, `thermal1st`).
  * **Impact** : Rétablissement immédiat de la prévisualisation cartographique sans erreur d'initialisation de Deck.gl. Affichage complet et esthétique de l'ensemble des 8 cercles de dégâts physiques et de la plume de retombées radioactives.

* **2026-05-11 — Intégration de l'extraction automatisée des indicateurs géographiques (Module `geoDataFetcher.ts`)**
  * **Modification** : Couplage de l'application avec les APIs libres Open-Meteo DEM (altitudes) et OpenStreetMap Overpass (infrastructures critiques et données démographiques locales).
  * **Détail** :
    * Implémentation du module `geoDataFetcher.ts` gérant une double stratégie d'acquisition (Requête directe avec fallbacks déterministes sur heuristiques si restriction de quota/connexion).
    * Ajout d'indicateurs de population locale (moteurs WorldPop et ONU), de densité urbaine qualifiée par paliers, d'altitude de l'épicentre et de relief local (profil d'altitude visuel de 5 points cardinaux dans un rayon de 2km).
    * Ajout du comptage automatique des hôpitaux, universités/écoles et complexes industriels à moins de 3km du point d'impact.
    * Automatisateur physique : couplage du relief réel (coefficient de rugosité topographique calculé à partir de l'écart d'altitude local) avec le coefficient d'amortissement de l'onde de choc (`terrainDamping`).
  * **Impact** : L'expérience utilisateur passe d'une projection statique de quelques villes choisies à une analyse de défense passive de cible ultra-réaliste et dynamique pour n'importe quelle latitude et longitude sélectionnée sur la planète.

* **2026-05-11 — Amélioration et Rafinement de l'IHM Latérale (Sidebar)**
  * **Modification** : Restructuration de la répartition des informations géospatiales et balistiques.
  * **Détail** :
    * Masquage par défaut de la boîte "Analyse de Cible Intégrée" (Fiche Scientifique) pour éviter l'encombrement cognitif au clic initial sur la carte, soutenue par un volet de repli repliable.
    * Maintien omniprésent de la section "Trajectoire & Lancement" et du sélecteur de "Vecteurs de Livraison" pour tous les types de simulation (instantanée et balistique), permettant le choix dynamique d'ogives fictives et réelles de l'arsenal.
  * **Impact** : Clarté d'utilisation inégalée des options de tirs stratégiques et réduction de la surcharge d'informations au premier niveau de lecture.

* **2026-05-11 — Résolution des Anomalies de Timing de Vol et d'Interface de Trajectoire**
  * **Modification** : Résolution du comportement asynchrone des threads d'animation du missile et du dôme d'impact.
  * **Détail** :
    * Correction du bug de « double détonation » : En mode instantané, tout tir d'armement doté d'une origine définie bypasse immédiatement la physique asynchrone de vol pour initier directement la détonation.
    * Correction du bug de « vol zombie » : Utilisation d'un crochet de référence `launchAnimRef` de React pour assurer l'annulation systématique (`cancelAnimationFrame`) de toute boucle de vol balistique antérieure lors d'un reciblage, d'une recherche géographique, ou d'une bascule de mode.
  * **Impact** : Cohérence parfaite et immédiate du simulateur de propagation d'ondes sans redondance d'impact ni débris visuel parasite d'anciens lancements en arrière-plan.

* **2026-05-11 — Amélioration de la physique de l'onde de choc et ergonomie de la carte**
  * **Modification** : Intégration de données environnementales complexes et affichage dynamique de l'onde de pression (PSI).
  * **Détail** :
    * Ajout d'une barre de statut dynamique (`currentPsi`) superposée à la carte affichant en temps réel la force d'overpressure du front de l'onde de choc balayant la cible.
    * Ajout d'une interface utilisateur (slider) pour piloter le coefficient de rugosité (Manning 'n') directement depuis la barre latérale.
    * Correction de la physique des cratères (surface burst) dans `calculateBlastRadii` pour intégrer ce proxy de dureté de sol (`manningN`), où des sols durs produisent des cratères plus petits.
    * Ajout d'une loi de comportement sur le champignon atomique, plafonnant celui-ci en cas de contact avec la tropopause (si Rdt < 1 Mt).
    * Amélioration ergonomique par l'ajout d'infobulles contextuelles expliquant l'impact de la vitesse et de la direction du vent sur le panache radioactif.
  * **Impact** : Renforcement du réalisme éducatif et du couplage terrain-physique, fournissant des retours visuels ultra-précis du simulateur au fur et à mesure que la détonation se déploie.

* **2026-05-11 — Géophysique Globale Temps-Réel & Intégration Avancée**
  * **Modification** : Refonte du parseur géophysique (`fetchAutomaticGeoData`) pour calculer ou extraire en temps réel n'importe quelle composante partout dans le monde, intégrant virtuellement l'entièreté de la colossale base de données (> 150 pays / villes) fournie au système.
  * **Détail** : 
    * Intégration dynamique et synchrone d'Open-Meteo pour récupérer la biométrie des vents (vitesse & direction en direct).
    * Algorithme latitudinal pour la hauteur de la **Tropopause** (allant de 17km à l'équateur à 8km aux pôles), agissant organiquement en bouclier réducteur du champignon atomique.
    * Synthèse intelligente du **Coefficient de Roughness de Manning (n)** à partir de la densité de population extraite via proxy (permettant une différenciation entre mer, plaines, et métropoles ultra-denses).
  * **Impact** : Le moteur de simulation produit des résultats sur-mesure pour chaque lieu cliqué, intégrant nativement la topographie, la météorologie et la socio-densité pour des frappes plus proches de la "réalité", plutôt que de figer les valeurs en configurations statiques infinies.

* **2026-05-13 — Intégration Dynamique du Bilan Humain et Infrastructures**
  * **Modification** : Couplage direct des données géographiques d'OSM avec les équations de bilan de victimes civiles et matérielles raccordées dynamiquement à la console de commande.
  * **Détail** :
    * Les coordonnées d'impact et la densité locale calculent à présent l'exposition structurelle et humaine précise (mortalité directe, blessures graves, exposition radioactive).
    * Modélisation de la destruction en cascade du tissu d'infrastructure civile environnant (comptabilisation d'impact immédiat d'écoles, universités et hôpitaux rattachés à la zone géographique OSM).
  * **Impact** : La simulation éducative franchit un cap de réalisme majeur, présentant de manière transparente et objective les conséquences sociétales immédiates d'une détonation nucléaire.

* **2026-06-01 — Création des Métadonnées PWA et de la Griffe Graphique**
  * **Modification** : Création du logo et du fichier manifest de configuration progressive pour une distribution et une autonomie accrues.
  * **Détail** :
    * Génération et installation du logo vectoriel d'identité rouge-graphite à l'adresse `/public/icon.png`.
    * Implémentation du manifeste `/public/manifest.json` avec adaptation des couleurs de thème au style "Bunker Chic".
  * **Impact** : Disponibilité d'une signature graphique propre raccordée au fichier `/index.html` facilitant l'accès sur supports mobiles et tablettes complexes.

* **2026-06-15 — Audit du Projet & Production de la Fiche Portfolio**
  * **Modification** : Analyse profonde de l'application et rédaction d'un rapport portfolio technique pour mettre à l'honneur les accomplissements techniques et d'ingénierie physique.
  * **Détail** :
    * Rédaction de la fiche dans `/portfolio_fiche.md`.
  * **Impact** : Mémoire technique et valorisation de l'architecture "Bunker Chic" exploitable par l'écosystème institutionnel et technologique.

* **2026-06-15 — Intégration du Portail d'Onboarding Pédagogique, Guide Graphique & Indexation SEO**
  * **Modification** : Création d'une Landing Page scientifique immersive (`/src/components/LandingPage.tsx`) et spécification des politiques SEO et graphiques.
  * **Détail** :
    * Conception d'un portail de présentation élégant détaillant le problème physique résolu, la proposition de valeur éducative, les bénéfices, la FAQ technique, et des cas concrets d'utilisation.
    * Implémentation du routeur réactif interne sous `App.tsx` via l'état `currentTab`, découplant l'onboarding de la simulation cartographique lourde Deck.gl pour un premier chargement instantané sans perte d'état.
    * Ajout de boutons d'action d'immersion et de repli tactique (`[ Portail Présentation ]`) pour naviguer librement.
    * Rédaction des règles SEO complètes (`/seo.md`) et de la charte de Style "Bunker Chic / Brutalisme" (`/charte_graphique.md`).
  * **Impact** : La console de commande devient un produit fini, accessible et séduisant pour une double audience : de l'étudiant curieux à l'analyste de défense passive confirmé.


