# Guide de Déploiement - NUKEMAP EDU

## Build Production
L'application est construite via `npm run build`. Le résultat se trouve dans le dossier `dist/`.

## Hébergement
- Compatible avec tout service de fichiers statiques (Netlify, Vercel, Firebase Hosting, Cloud Run).
- Assurer le support HTTPS pour le fonctionnement du Service Worker.

## PWA & Mise à jour
À chaque déploiement, le Service Worker détecte les changements et propose une mise à jour via le `PWAController`.
