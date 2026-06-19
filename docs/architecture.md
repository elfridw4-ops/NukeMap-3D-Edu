# Architecture Détaillée - NUKEMAP EDU

Ce document sert de guide d'onboarding pour comprendre la structure et les responsabilités de chaque module du projet.

## Structure des Dossiers et Fichiers

### `/` (Racine)
- `index.html` : Point d'entrée HTML, contient les métadonnées SEO et Open Graph.
- `metadata.json` : Configuration plateforme (nom, description).
- `public/` : Ressources statiques (icônes, manifest, service worker).

### `/src`
- `main.tsx` : Point d'entrée React, enregistre le Service Worker.
- `App.tsx` : Composant racine gérant l'état global persistant et le routage interne.
- `types.ts` : (À créer si absent) Définitions des interfaces Weapon, Strike, et LaunchParams.

### `/src/components`
- `LandingPage.tsx` : Portail pédagogique d'introduction.
- `Map.tsx` : Moteur de rendu Deck.gl / MapLibre.
- `PWAController.tsx` : Gestion de l'installation et des mises à jour.
- `Sidebar.tsx` : Panneau de contrôle et de paramétrage.

### `/src/lib`
- `hooks.ts` : Hooks personnalisés, notamment `usePersistedState` pour la résilience.
- `nuclearMath.ts` : Moteur physique (Lois de Glasstone & Dolan).
- `geoDataFetcher.ts` : Utilitaires de récupération de données géographiques (bathymétrie, distance côtes).
- `version.ts` : Source unique de vérité pour la version de l'app.

## Flux Applicatifs
1. **Initialisation** : Chargement de l'état depuis `localStorage`.
2. **Simulation** : L'utilisateur définit une cible -> Calcul des rayons physiques -> Mise à jour des couches Deck.gl.
3. **Persistance** : Chaque changement d'état est synchronisé avec le stockage local.

## Zones Critiques
- **Moteur de calcul** : `nuclearMath.ts` doit rester pur pour garantir la testabilité des seuils psi.
- **Rendu Carte** : Les composants React doivent minimiser les re-renders lors des mises à jour de vue de la carte.
