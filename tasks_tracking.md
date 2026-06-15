# Suivi des Tâches & Roadmap - NUKEMAP EDU

## Fonctionnalités implémentées
* [x] **Portail d'Onboarding (Landing Page Professionnelle)** : Intégration d'un portail pédagogique sous forme de Landing Page détaillant la proposition de valeur, les bénéfices, les cas concrets de modélisation académique, la FAQ scientifique, et un bouton d'action vers la console de crise, sous une esthétique Bunker Chic à haut contraste.
* [x] **Navigation Tabulaire Double Flux** : Routage d'IHM préservant intégralement l'état et l'historique cartographique de la console Deck.gl lors des vas et viens vers le portail de présentation.
* [x] **Spécifications SEO Techniques & Contenus** : Création d'un plan complet de métadonnées sémantiques, de microdonnées, d'optimisations Core Web Vitals, et de ciblage de mots-clés performants (`/seo.md`).
* [x] **Guide de Charte Graphique Brutaliste** : Conceptualisation du thème Bunker Chic, règles de contrastes colorimétriques, de marges (pas de 8px), d'icônes Lucide, et d'appariement typographique (Inter & JetBrains Mono) dans `/charte_graphique.md`.
* [x] **Relais Géocodage Inversé (GPS/Littoral)** : Estimation géophysique automatique des profils bathymétriques et de distance au rivage dès qu'un point est sélectionné sur la carte.
* [x] **Modèle Physique Glasstone** : Calcul des ondes barométriques découpées par seuils de pression (20 psi, 5 psi, 1-2 psi) et par isothermes thermiques de brûlures (1er, 2ème et 3ème degré).
* [x] **Calculateur de Tsunami & Shoaling** : Estimation géologique avec affichage dynamique du graphique d'inondation côtière.
* [x] **Indicateurs Géographiques Automatiques (Module `geoDataFetcher`)** : Récupération en temps réel des altitudes et pentes (Open-Meteo DEM), de la densité de population urbaine et comptage des hôpitaux, écoles, universités et zones industrielles à moins de 3km de l'impact (OpenStreetMap Overpass). Ajustement automatique de l'amortissement du terrain.

## Bogues corrigés
* [x] **Bogue Deck.gl `{id: 'thermal-layer'}`** : Correction de l'erreur `accessor "getRadius" is not a function` provoquée par la valeur indéfinie `radii.thermal`. Standardisation envers des fonctions accesseurs pures pour tous les cercles d'ondes barométriques et thermiques.
* [x] **Ajustement de l'Onde Thermique dans Sidebar** : Raccordement des indicateurs visuels du panneau latéral au `radii.thermal3rd` (brûlure de troisième degré) et utilisation de `radii.thermal1st` pour calibrer dynamiquement l'échelle horizontale des jauges d'impact.
* [x] **Typage Dynamique OSM Nominatim** : Résolution du problème d'accès aux clés d'adresse de l'API Nominatim sous TypeScript en instanciant proprement un cast dynamique safe (`as any`).
* [x] **Optimisation IHM Volet Latéral (Sidebar UI Refinement)** : Dissimulation par défaut de l'unification d'intelligence "Analyse de Cible Intégrée" avec interrupteur à bascule interactif. Raccordement perpétuel du volet "Trajectoire & Lancement" et des sélections de vecteurs aérodynamiques et spatiaux sur l'ensemble des modes de détonation (instantané v. balistique).
* [x] **Correction de la Chronologie & Boucle de Vol Zombie** : Résolution du phénomène de double détonation en mode instantané et suppression des animations fantômes asynchrones lors du reciblage cartographique en mettant en œuvre une référence d'annulation de boucle de trame active (`launchAnimRef`).
* [x] **Résolution de l'Erreur de Compilation du Transformeur Vite** : Correction du blocage du parser JSX généré par un caractère inférieur (`<`) brut lors de la formulation textuelle du seuil de réaction critique à la ligne 1337 de `Sidebar.tsx`. Remplacement par l'entité HTML sûre `&lt;`.


## Tâches en cours
* [ ] **Analyse des Vents en Haute Altitude** : Intégration de traînées de dispersion bêta-gamma ajustées tridimensionnellement en fonction du cisaillement des vents de la stratosphère.
* [ ] **Intégration d'Adresses Supplémentaires** : Étoffement du base de données d'ancres côtières historiques.
