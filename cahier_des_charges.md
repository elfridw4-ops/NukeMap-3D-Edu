# Cahier des Charges - NUKEMAP EDU

## Invite initiale
Le projet vise à concevoir un simulateur nucléaire éducatif complet doté de fonctionnalités avancées :
1. Calculs scientifiques d'impacts barométriques, thermiques et radiologiques.
2. Trajectoires et cinématique de vecteurs balistiques.
3. Aléas côtiers et tsunami (calcul de bathymétrie, déferlement littoral).
4. Cartographie interactive haute performance et rendus 3D intégrés.

## Exigences fonctionnelles
* **Gestion d'Arsenal Évolué** : Sélection d'armes historiques de référence ou configuration d'une ogive personnalisée (yield modifiable de 0,1 kt à 100 Mt).
* **Cinématique de vol & Simulation en Temps Réel** : Animation de vol en cas de ciblage autonome. Le missile effectue une trajectoire parabolique réaliste surélevant la traînée de fumée en haute altitude.
* **Zones de Dégâts en Cercles Concentriques** :
  * Dôme de plasma / Boule de feu
  * Cratère rocheux (uniquement en cas de détonation au contact basique terrestre)
  * Onde de choc à 20 psi (Destruction absolue)
  * Onde de choc à 5 psi (Effondrement structural important)
  * Onde de choc à 1-2 psi (Bris de vitres, blessures superficielles par éclats)
  * Brûlures thermiques au 3ème degré (Nécrose profonde de la peau)
  * Brûlures thermiques au 2ème degré (Blistering important, cicatrices pérennes)
  * Brûlures thermiques au 1er degré (Érythème simple, douleur bénigne)
* **Simulation de Tsunami et Dispersion Marine** : Modélisation géophysique complète avec prise en compte du profil de profondeur du plan d'eau, de la pente des côtes et de la barrière continentale de friction (dureté du terrain).
* **Fiche géophysique des grandes villes** : Moteur de suggestions géocodées et fiches contextuelles précises intégrant les vents dominants, la bathymétrie locale et la hauteur moyenne de la troposphère.

## Exigences non fonctionnelles
* **Performances** : Le rafraîchissement cartographique doit se faire en douceur (> 45 FPS) sans gels de l'interface graphique lors des itérations animées de Deck.gl.
* **Sécurité** : L'intégration de la carte utilise des fonds de plan raster libres de droits, éliminant tout besoin d'exposer des clés d'API (comme Mapbox ou Google Maps) du côté client, minimisant ainsi les fuites de secrets.
* **Évolutivité** : L'application doit isoler son moteur d'équations physiques (`nuclearMath.ts`) de la couche de rendu visuel pour permettre d'autres intégrations (e.g. 3D immersive totale, réalité augmentée).

## Contraintes
* **Sandboxing IFrame** : L'ensemble de l'application est exécuté au sein d'une IFrame sécurisée, limitant l'utilisation d'alertes bloquantes (`window.alert`) au profit d'alertes textuelles douces intégrées au DOM.
* **Calculs client-side** : Pour conserver une latence nulle, la totalité des calculs balistiques et de propagation thermique est opérée en temps réel au sein du navigateur de l'utilisateur.

## Mises à jour & Extensions Récentes (Juin 2026)
* **Système de Navigation Double Flux (Portail / Console)** :
  * Intégration d'un portail pédagogique d'onboarding (Landing Page) exposant de façon limpide le problème physique résolu, la proposition de valeur, les cas d'usages académiques réels, la FAQ scientifique, et une fiche descriptive.
  * Maintien d'un bouton flottant de dérivation tactique (`[ Portail Présentation ]`) pour naviguer instantanément sans perte d'état.
* **Optimisations SEO & Directives Graphiques** :
  * Déploiement d'une stratégie SEO technique intégrant un balisage structuré pour un meilleur référencement et des mots-clés performants.
  * Définition d'un thème "Bunker Chic / Brutalisme Tactique" harmonisé avec des contrastes d'écrans sûrs et des typographies sans-serif de haute lisibilité.
