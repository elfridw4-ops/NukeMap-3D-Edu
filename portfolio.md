# NUKEMAP EDU : Simulateur Scientifique Nucléaire 3D

## Résumé
NUKEMAP EDU est un simulateur pédagogique interactif 3D qui modélise avec précision les effets physiques dévastateurs d'explosions nucléaires en utilisant les lois d'échelle de Glasstone & Dolan et une visualisation cartographique avancée.

## Problème résolu
Il résout le manque d'outils pédagogiques accessibles et rigoureux pour visualiser les conséquences réelles (thermiques, barométriques, tsunamis) d'événements nucléaires à différentes échelles sans compromettre la précision scientifique des calculs.

## Public cible
- Étudiants en physique et géographie.
- Enseignants souhaitant illustrer les effets d'armes stratégiques/tactiques.
- Analystes de défense passive curieux des impacts géophysiques.

## Fonctionnalités principales
- **Modélisation Glasstone & Dolan** : Calculs des seuils de pression (psi) et des brûlures thermiques basés sur le rendement réel.
- **Réalisme cartographique** : Intégration OSM avec géocodage inversé pour estimer les distances aux côtes et profils bathymétriques.
- **Simulation balistique** : Modélisation 3D des trajectoires ICBM, SLBM, bombardiers et missiles de croisière.
- **Calculateur de Tsunami** : Estimation hydrodynamique des effets de *shoaling* et d'inondation côtière.
- **Gestion double flux** : Interface séparant l'onboarding pédagogique de la console de simulation active.

## Fonctionnalités avancées
- **Moteur de rendu Deck.gl** : Visualisation 3D haute performance.
- **Persistance des états** : Sauvegarde locale automatique de toute la configuration de simulation et de navigation pour une résilience totale lors des rechargements.
- **Esthétique "Bunker Chic"** : Interface de contrôle minimaliste, sobre, brutaliste pour soutenir l'aspect grave du sujet.

## Mon rôle
Architecte principal et développeur full-stack, responsable de la conception de l'architecture de calcul physique, de l'optimisation du rendu cartographique, de la stratégie SEO/Accessibilité et de la mise en place des règles de résilience systémique.

## Technologies utilisées
- **Frontend** : React 18, TypeScript, Tailwind CSS, Vite.
- **Moteur cartographique** : MapLibre, Deck.gl.
- **IA** : Gemini SDK pour les fonctionnalités intelligentes (non exposées au client).
- **Architecture** : SPA réactive, persistance via `localStorage`.

## Défis rencontrés
- **Performance de rendu** : Maintenir un framerate élevé avec des couches cartographiques WebGL complexes.
- **Complexité physique** : Traduire des formules barométriques complexes en retour visuel temps réel précis.
- **Persistance des données** : Garantir aux utilisateurs aucune perte de leur paramétrage lors de rafraîchissements du navigateur.

## Solutions apportées
- Hooks de persistance sur mesure (`usePersistedState`) pour tout le contexte applicatif.
- Optimisation des calculs physiques en *memoized* hooks.
- Séparation rigoureuse entre le moteur de rendu 3D et le portail pédagogique pour maximiser la réactivité.

## Valeur ajoutée
Permet une compréhension intuitive, visuelle et scientifiquement rigoureuse de phénomènes complexes, souvent mal interprétés, au sein d'une interface professionnelle et accessible.

## Cas d'utilisation
- **Cours de géographie** : Étude de l'impact d'une frappe théorique sur une métropole côtière.
- **Recherche en sécurité** : Analyse préalable de portée de vecteur sur des actifs d'infrastructure réelle.
- **Simulation de crise** : Exercice tactique de évaluation des dommages (surpression/thermique).

## Ce qui différencie ce projet
Son approche "zéro compromis" entre rigueur scientifique (équations de Glasstone & Dolan) et esthétique interface-homme-machine de type "Bunker Chic", couplée à une robustesse de persistance des données.

## Compétences démontrées
- Génie logiciel (State management complexe).
- Data science / Physique computationnelle.
- Architecture d'application (React/Vite performant).
- SEO technique et stratégie de contenu scientifique.
- Design UI/UX (Brutalisme tactique).

## Captures recommandées
1. **Console Active** : Montrant les rayons d'impact superposés sur la carte.
2. **Dashboard de Chronologie** : Hud temporel détaille la succession des événements physiques (T+0, T+80s, etc.).
3. **Portail Onboarding** : Landing page pédagogique présentant la proposition de valeur.

## Description courte
Simulateur 3D interactif et rigoureux des impacts nucléaires basé sur des lois physiques réelles. Interface brutaliste, haut rendement, et persistance totale des données pour une analyse éducative et stratégique.

## Description moyenne
NUKEMAP EDU est un simulateur pédagogique et professionnel modélisant les effets thermiques, barométriques et hydrodynamiques d'explosions nucléaires. Couplant une rigueur scientifique absolue (Glasstone & Dolan) à une visualisation cartographique avancée (Deck.gl), il offre aux étudiants et analystes un outil de précision pour visualiser l'impact des vecteurs balistiques. Son architecture robuste garantit une persistance totale des sessions et une navigation ergonomique entre onboarding pédagogique et console tactique.

## Mots-clés
Simulateur nucléaire, physique nucléaire, visualisation 3D, Deck.gl, éducation scientifique, NUKEMAP, persistance état React, bunker chic, data science, géophysique, modélisation impacts.
