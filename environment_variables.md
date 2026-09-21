# Variables d'Environnement — NUKEMAP EDU

Ce document recense l'ensemble des variables d'environnement utilisées par l'application, leur utilité, leur criticité, ainsi que la procédure sécurisée pour les configurer en local et en production.

---

## 1. Inventaire des Variables

| Variable | Type | Caractère | Description & Rôle | Valeur par défaut | Exemple |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | String (Secret) | Requis (si fonctionnalités IA actives) | Clé d'API Google Gemini AI pour les fonctionnalités intelligentes et analyses automatiques. | `""` | `AIzaSy...` |
| `APP_URL` | String (URL) | Requis en production | URL de l'instance hébergée (Cloud Run ou domaine public) pour les métadonnées et partages. | `http://localhost:3000` | `https://nukemap-edu.app` |
| `VITE_MAPBOX_TOKEN` | String (Public Token) | Optionnel | Token d'accès public Mapbox (`pk.eyJ...`). Active les styles vectoriels haute fidélité Mapbox HD (Dark v11, Light v11, Satellite Streets). Si omis, l'application bascule sur les fonds libres de droits CARTO et ESRI. | `""` (fonds libres CARTO/ESRI actifs) | `pk.eyJ1IjoibXl1c2VyIi...` |
| `VITE_MAPBOX_STYLE_DARK` | String (URI Style) | Optionnel | URI du style Mapbox pour le mode Nuit. | `mapbox://styles/mapbox/dark-v11` | `mapbox://styles/mapbox/dark-v11` |
| `VITE_MAPBOX_STYLE_DAY` | String (URI Style) | Optionnel | URI du style Mapbox pour le mode Jour. | `mapbox://styles/mapbox/light-v11` | `mapbox://styles/mapbox/light-v11` |
| `VITE_MAPBOX_STYLE_SATELLITE` | String (URI Style) | Optionnel | URI du style Mapbox pour le mode Satellite. | `mapbox://styles/mapbox/satellite-streets-v12` | `mapbox://styles/mapbox/satellite-streets-v12` |

---

## 2. Règles de Sécurité & Gestion des Secrets

- **Principe du Moindre Privilège** : Le token Mapbox utilisé côté client doit obligatoirement être un **Public Token** (`pk.*`), et **JAMAIS** un Secret Token (`sk.*`).
- **Restrictions de Domaine** : En production sur mapbox.com, configurez une restriction d'URL (URL restrictions) sur votre token Mapbox afin d'empêcher son utilisation en dehors de votre nom de domaine officiel.
- **Fichier `.env`** : Le fichier `.env` est exclu du contrôle de version via `.gitignore`. Ne jamais committer de clés secrètes ni de tokens de production dans le dépôt Git.
- **Fallback Automatique** : Si le token Mapbox expire, est erroné ou non défini, le moteur de rendu bascule automatiquement vers les fonds de carte raster libres (CARTO Dark/Light et ESRI Satellite), garantissant une disponibilité permanente de l'interface sans écran noir.
