# Cahier des Charges - NUKEMAP EDU

## Invite Initiale
Créer un simulateur nucléaire 3D interactif et pédagogique utilisant des modèles physiques réels.

## Exigences Fonctionnelles
- Choix du rendement de l'arme (kt/Mt).
- Sélection de la cible sur une carte mondiale interactive.
- Affichage des rayons d'effet (Boule de feu, radiation, surpression, thermique).
- Modélisation de la retombée (fallout) et des ondes de choc.
- Simulation de trajectoires de vecteurs (Missiles, Bombardiers).

## Exigences Non Fonctionnelles
- **Réactivité** : Rendu fluide des graphiques Deck.gl.
- **Persistance** : Aucune donnée perdue au rafraîchissement.
- **Installabilité** : PWA complète.

## Contraintes
- Utilisation exclusive de MapLibre/Deck.gl pour la carte.
- Respect strict des constantes physiques de Glasstone & Dolan.
