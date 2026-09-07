# Suivi des Tâches - NUKEMAP EDU

## Fonctionnalités Implémentées
- [x] Moteur de rendu Deck.gl/MapLibre.
- [x] Calculateur Glasstone & Dolan.
- [x] Système de persistance `usePersistedState`.
- [x] Manifest PWA et Service Worker.
- [x] Simulation de tsunamis (shoaling).
- [x] Système de documentation complet et vivant (ADR, historique, charte graphique, audit de providers, etc.).

## Tâches en Cours
- [ ] Audit d'accessibilité au clavier de l'interface NUKEMAP EDU.
- [ ] Audit final de l'installabilité PWA.

## Tâches Futures
- [ ] Graphiques de dommages vs Distance (Recharts).
- [ ] Mode multi-frappes avancé.
- [ ] Export de rapport de simulation en PDF.

## Bugs Connus
- Certains navigateurs mobiles limitent le cache WebGL.
- Latence occasionnelle lors du géocodage inversé haute fréquence.

## Historique récent — 2026-09-07
- [x] Amélioration mobile : panoramique tactile DeckGL explicitement activé, avec déplacement vertical/horizontal et gestes de zoom conservés.
- [x] Correction mobile : statut d'impact séparé des contrôles supérieurs et bouton de chronologie positionné au-dessus du bottom sheet.
- [x] Accessibilité mobile : poignée et bouton de réduction du panneau rendus utilisables au clavier avec `aria-label` et `aria-expanded`.
- [x] Contrôles tactiles : zones d'interaction agrandies pour les sliders, modes de simulation et boutons de fond cartographique.
