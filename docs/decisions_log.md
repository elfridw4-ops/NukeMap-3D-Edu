# Log des Décisions (ADR) - NUKEMAP EDU

## 2026-06-16 : Choix du Stockage Local
- **Contexte** : Nécessité de conserver les paramètres de simulation complexes.
- **Décision** : Utilisation de `localStorage` couplé à un hook React personnalisé.
- **Alternative** : IndexedDB (rejeté car trop complexe pour des volumes de données simples).
- **Conséquence** : Accès rapide et synchrone aux données au démarrage.

## 2026-06-16 : Architecture PWA "Standalone"
- **Contexte** : L'utilisateur doit pouvoir utiliser l'application comme un outil natif.
- **Décision** : Configuration du manifest en mode `standalone`.
- **Conséquence** : Suppression de la barre d'adresse du navigateur pour une immersion maximale.
