# Historique du Projet - NUKEMAP EDU

## Présentation du Projet
- **Nom du projet** : NUKEMAP EDU
- **Objectif** : Fournir un outil pédagogique et scientifique pour visualiser les effets physiques des explosions nucléaires.
- **Utilisateurs cibles** : Étudiants, enseignants, chercheurs en sécurité diplomatique et curieux.
- **Fonctionnalités principales** : Simulation 3D, calculs barométriques et thermiques (Glasstone & Dolan), modélisation de trajectoires balistiques, estimation de tsunamis.

## Architecture
- **Front-end** : React 18, TypeScript, Tailwind CSS.
- **Moteur Cartographique** : MapLibre GL JS, Deck.gl.
- **Persistance** : `localStorage` avec hooks personnalisés pour la résilience de session.
- **PWA** : Manifest, Service Worker et gestionnaire de versioning.

## Décisions Techniques
- **Deck.gl** : Choisi pour ses capacités de rendu 3D haute performance sur des volumes de données géospatiales.
- **Persistance Systématique** : Implémentée pour éviter la perte de paramètres complexes lors d'un rafraîchissement.
- **Design Brutaliste** : Adopté pour refléter le sérieux du sujet ("Bunker Chic").

## Historique des Modifications
### 2026-06-16
- Initialisation du projet.
- Implémentation du moteur de calcul Glasstone & Dolan.
- Ajout de la visualisation 3D.
### 2026-06-16 (Mise à jour)
- Mise en place de la résilience d'état via `usePersistedState`.
- Transformation en Progressive Web App (PWA).
- Ajout des métadonnées Open Graph et Twitter Cards.
### 2026-06-19
- Initialisation du système documentaire vivant (Protocole Architecte Documentaliste Senior).

### 2026-07-06
- Mise à jour majeure du système documentaire de NUKEMAP EDU.
- Activation et mise en conformité de la charte opérationnelle de l'agent IA (`AGENTS.md`) avec suppression des placeholders `⚠️ NON DÉFINI`.
- Rédaction complète de la Charte Graphique V2 "Bunker Chic" (`docs/charte_graphique.md`).
- Création du journal d'interactions brute (`docs/chat_history.md`) et de l'audit technique d'architecture des contextes (`docs/provider_audit.md`).
- Impact : Robustesse, alignement sémantique et traçabilité de niveau production pour la suite du projet.

