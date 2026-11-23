---
agent: Agents_Deployment_Instructions
commande: deploy:instructions
declencheurs:
  - instructions de déploiement
  - générer deployment_guide.md
  - devops vercel supabase railway
  - configuration env déploiement
action: Analyse du stack et génération automatique d'un guide de déploiement sur-mesure (deployment_guide.md)
---

# AGENTS_DEPLOYMENT_INSTRUCTIONS.md
# Instructions pour agents IA — Génération automatique de deployment_guide.md

> **COMMENT EXÉCUTER CE FICHIER :**
> Quand l'utilisateur te dit "exécute ce fichier" ou "lis Agents_Deployment_Instructions.md" :
> 1. Lire ce fichier entièrement
> 2. Scanner les fichiers du projet (Section 1)
> 3. Générer `deployment_guide.md` à la racine du projet
> 4. Ne poser AUCUNE question sauf si une info est impossible à déduire du code
>
> **RÔLE :**
> Tu es un expert DevOps. Tu analyses le code du projet en autonomie.
> Tu génères un guide de déploiement complet, pré-rempli avec les vraies infos du projet.
> Ce fichier = INSTRUCTIONS (quoi faire) + BASE DE CONNAISSANCE (configs exactes).

---

## 0. RÈGLES ABSOLUES

```
❌ Ne jamais inventer une commande, un paramètre ou une config absents de ce document
❌ Ne jamais copier des configs d'une plateforme vers une autre (Vercel ≠ Railway ≠ Render)
❌ Ne jamais inclure des valeurs réelles de clés API ou mots de passe — uniquement des placeholders
❌ Ne jamais poser de questions si la réponse est lisible dans les fichiers du projet
❌ Ne jamais bloquer sur une info manquante — marquer [À RENSEIGNER] et continuer
✅ Scanner le code AVANT de générer quoi que ce soit (Section 1)
✅ Pré-remplir toutes les valeurs trouvées dans le code (scripts, dépendances, variables)
✅ Si une plateforme ou stack n'est pas dans ce document : le dire explicitement et s'arrêter
✅ Créer deployment_guide.md directement à la racine du projet — pas dans un sous-dossier
✅ Si .env présent : lire les NOMS des variables uniquement, ne jamais copier les valeurs
```


---

## 0.5. CHOIX DU DÉPLOIEMENT (pré-analyse)

> **Quand exécuter cette section :**
> - L'utilisateur dit "aide-moi à choisir ma plateforme" OU
> - Aucune plateforme n'est détectable dans le code (pas de vercel.json, railway.json, netlify.toml, Procfile)
>
> **Quand SAUTER cette section :**
> - La plateforme est déjà identifiée dans les fichiers du projet → aller directement à Section 1

---

### PROFIL DE L'UTILISATEUR (à garder en tête)

```
Niveau DevOps    : débutant à intermédiaire
Outil de dev     : peu importe (VS Code, AI Studio, Cursor, autre)
Priorité         : clé-en-main, zéro config serveur si possible
Types de projets : frontend statique / backend API / full-stack / SaaS / app mobile backend
Contraintes      : varient par projet (budget, scalabilité, simplicité, stack)
```

---

### MISSION DE L'AGENT EN MODE CHOIX

Tu agis comme un **architecte solution**. Tu ne donnes pas une réponse unique immédiate.
Tu guides l'utilisateur pour qu'il prenne la bonne décision selon ses contraintes réelles.

---

### ÉTAPE 1 — IDENTIFIER LA CONTRAINTE PRINCIPALE

Si ce n'est pas clair dans la description du projet, poser UNE seule question :

```
"Pour ce projet, quelle est ta priorité principale ?
A) Budget minimal (gratuit ou quasi-gratuit)
B) Scalabilité (le projet peut grossir vite)
C) Simplicité maximale (déployer en 5 minutes, pas de config)"
```

---

### ÉTAPE 2 — QUESTIONS SI INFOS MANQUANTES

Ne pas supposer. Poser ces questions si la description du projet ne les couvre pas :

```
- Stack technique ? (React, Next.js, Node.js, Python, PHP, autre)
- Base de données nécessaire ? (PostgreSQL, MongoDB, aucune)
- Appels à une API externe lourde ? (IA, paiement, streaming temps réel)
- Trafic attendu ? (projet perso / quelques utilisateurs / public large)
- Budget max/mois ? (0$ / <10$ / flexible)
- Besoin de backend long-running ? (ou serverless suffit)
- Besoin de tâches planifiées / cron jobs ?
- Besoin de stockage de fichiers ? (images, uploads)
```

---

### ÉTAPE 3 — OPTIONS À PRÉSENTER (selon le profil)

Présenter uniquement les options pertinentes au cas. Ne pas lister toutes les plateformes.

#### Tableau de décision rapide

| Situation | Plateforme recommandée |
|-----------|----------------------|
| Frontend statique uniquement | Vercel ou Netlify |
| Full-stack Node.js + DB | Railway |
| Backend Python/Flask | Render ou Railway |
| Backend PHP/Laravel | OVH VPS ou Render |
| App avec appels API lourds (IA, streaming) | Railway ou Cloud Run |
| Budget zéro absolu + peu de trafic | Render (free tier) ou Netlify |
| Scalabilité future importante | Railway ou Cloud Run |
| Besoin de cron jobs | Railway (natif) ou OVH VPS |
| Besoin de stockage fichiers | OVH VPS ou AWS S3 + Vercel |
| Débutant DevOps absolu, zéro config | Vercel (si front) ou Railway (si full-stack) |
| Budget fixe mensuel + contrôle total | OVH VPS |

#### Infos vérifiables par plateforme (juillet 2026)

```
Vercel      → Free : 100 GB bandwidth/mois, fonctions serverless 10s timeout.
              Pas de base de données native. Idéal : front React/Next.js.
              Déploiement : git push → live en <1 min.

Railway     → Free : 5$/mois de crédit offert.
              PostgreSQL, MySQL, MongoDB, Redis disponibles en un clic.
              Détection auto Node.js/Python/PHP. Port via $PORT obligatoire.
              Idéal : full-stack avec base de données.

Render      → Free tier : sleep après 15 min d'inactivité (30s de réveil).
              PostgreSQL inclus. Starter 7$/mois pour no-sleep.
              Idéal : backend Node.js ou Python sans budget.

Netlify     → Free : 100 GB bandwidth, 300 min build/mois.
              Fonctions serverless 125k invocations/mois.
              Idéal : frontend statique ou JAMstack.

OVH VPS     → Budget fixe (ex: 3-6€/mois). Contrôle total.
              Nginx, PM2, Certbot à configurer manuellement.
              Idéal : projets long terme, stack PHP, bases de données auto-hébergées.

Cloud Run   → Serverless conteneurs Google. Paie à l'usage.
              Requiert un Dockerfile. Plus complexe pour débutant.
              Idéal : API avec fort pic de trafic ou streaming temps réel.

Fly.io      → Conteneurs distribués. Free tier très limité.
              Plus complexe que Railway. Non recommandé pour débutant absolu.
```

> ⚠️ Ne jamais inventer des limites ou des prix non listés ci-dessus.
> Si une plateforme demandée n'est pas dans cette liste → dire "info non disponible dans ce document".

---

### ÉTAPE 4 — PIÈGES COURANTS À SIGNALER

Toujours mentionner ces pièges avant la décision finale :

```
❌ Render free tier : l'app "dort" après 15 min. Premier chargement = 30s d'attente.
   Inacceptable pour un vrai client. → Passer à Starter ($7/mois).

❌ Vercel fonctions serverless : timeout 10s sur Hobby.
   Appels API lourds (IA, traitement fichiers) → timeout garanti.
   → Passer à Pro ou migrer vers Railway/Cloud Run.

❌ Railway $5/mois de crédit : si le projet dépasse ce crédit, l'app s'arrête net.
   → Surveiller la consommation dans le dashboard Railway.

❌ Netlify 300 min de build/mois : un projet avec des builds fréquents les épuise vite.
   → Limiter les déploiements ou passer à un plan payant.

❌ OVH VPS : pas de backup automatique sur les offres entrée de gamme.
   → Configurer un cron pg_dump/mongodump dès le départ (Section 9).

❌ Variables d'environnement avec clés API : jamais dans le code, jamais dans Git.
   → Toujours via les variables d'env de la plateforme choisie.

❌ Choisir une plateforme selon ce qu'on a vu dans un tutoriel sans vérifier
   la compatibilité avec sa stack réelle → lire Section 3 avant de décider.
```

---

### ÉTAPE 5 — RECOMMANDATION FINALE

Format de recommandation à utiliser :

```
Recommandation : [PLATEFORME]
Raison principale : [1 phrase concrète]
Limites à surveiller : [1-2 points]
Prochaine étape : "dis-moi quand tu es prêt, je génère le deployment_guide.md"
```

---

> Après validation du choix par l'utilisateur → exécuter Section 1 (scanner le code + générer deployment_guide.md).

---

## 1. WORKFLOW DE L'AGENT — ANALYSE AUTOMATIQUE DU PROJET

**Tu as accès direct au code. Ne pose AUCUNE question. Lis les fichiers, déduis tout, génère.**

### Étape 1 — Lire ces fichiers en priorité (dans cet ordre)

```
1. package.json           → stack, scripts build/start, dépendances
2. app.json / expo.json   → si PWA ou app Expo
3. vercel.json            → si déjà configuré Vercel
4. railway.json           → si déjà configuré Railway
5. netlify.toml           → si déjà configuré Netlify
6. Procfile               → stack et commande de démarrage
7. requirements.txt       → projet Python
8. composer.json          → projet PHP/Laravel
9. .env.example           → variables d'environnement déjà listées
10. .env                  → si présent (NE PAS inclure les valeurs réelles dans le guide)
11. src/App.js ou main.jsx → confirmer React/Next.js
12. next.config.js        → confirmer Next.js + options SSR/SSG
13. public/manifest.json  → PWA active
14. public/sw.js          → service worker présent
15. .github/workflows/    → pipelines CI/CD déjà en place
16. README.md             → infos de déploiement déjà documentées
```

### Étape 2 — Ce que tu déduis de ces fichiers

| Info à détecter | Où la trouver |
|----------------|---------------|
| Framework/stack | `package.json` → dependencies (react, next, express, flask...) |
| Commande de build | `package.json` → scripts.build |
| Commande de start | `package.json` → scripts.start OU Procfile |
| Output directory | CRA → `build/`, Vite → `dist/`, Next.js → `.next/` |
| Base de données | `package.json` → pg, mongoose, prisma, sequelize |
| PWA activée | Présence de `manifest.json` + service worker |
| Variables d'env | `.env.example` ou `.env` (noms des clés uniquement) |
| CI/CD existant | `.github/workflows/*.yml` |
| Plateforme cible | `vercel.json`, `railway.json`, `netlify.toml`, `Procfile` |

### Étape 3 — Si une info est introuvable dans le code

→ Marquer `[À RENSEIGNER]` dans le guide généré.
→ Ne pas demander. Ne pas inventer. Juste marquer.

### Étape 4 — Générer deployment_guide.md

Utiliser :
- La section plateforme correspondante (Section 2)
- La section stack correspondante (Section 3)
- Les sections transversales pertinentes (Sections 4 à 11)
- Le format de sortie défini en Section 12

**Créer le fichier `deployment_guide.md` directement à la racine du projet.**

---

## 2. PLATEFORMES — CONFIGS EXACTES

---

### 2.1 VERCEL

**Idéal pour :** React SPA, Next.js, front-end statique, fonctions serverless.
**Pas idéal pour :** Backend Express long-running, bases de données directes.

#### Limites tier gratuit
- 100 GB bandwidth/mois
- Fonctions serverless : timeout 10s (Hobby), 60s (Pro)
- Pas de cron jobs sur Hobby

#### vercel.json — React SPA (CRA ou Vite)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### vercel.json — Next.js
```json
{}
```
> Next.js est détecté automatiquement par Vercel. Pas de config nécessaire.

#### vercel.json — Node.js API (fonctions serverless)
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

#### Paramètres tableau de bord Vercel à vérifier

| Paramètre | React SPA | Next.js | Node API |
|-----------|-----------|---------|----------|
| Framework Preset | Create React App | Next.js | Other |
| Build Command | `npm run build` | `npm run build` | `npm run build` |
| Output Directory | `build` | `.next` | `(laisser vide)` |
| Install Command | `npm install` | `npm install` | `npm install` |
| Root Directory | `.` (racine) | `.` | `.` |

#### Variables d'environnement Vercel
- Chemin : Project Settings → Environment Variables
- Trois scopes : Production / Preview / Development
- Jamais commiter le `.env` → utiliser uniquement le dashboard

#### .env.example React/Vercel
```env
# API
REACT_APP_API_URL=https://api.monapp.com
REACT_APP_ENV=production

# Analytics
REACT_APP_GA_ID=G-XXXXXXXXXX

# FedaPay (si intégré)
REACT_APP_FEDAPAY_PUBLIC_KEY=pk_live_XXXXXX
```
> ⚠️ Variables React : préfixe `REACT_APP_` obligatoire pour être exposées au front.
> ⚠️ Variables Vite : préfixe `VITE_` obligatoire.

#### Checklist pré-déploiement Vercel
```
□ vercel.json présent et valide (JSON valide — pas de trailing comma)
□ .gitignore contient .env, node_modules, build/
□ Variables d'env ajoutées dans le dashboard (pas dans le code)
□ Build locale réussie : npm run build (zéro erreur)
□ Pas de chemins absolus codés en dur (/home/user/... → utiliser des URLs relatives)
```

---

### 2.2 RAILWAY

**Idéal pour :** Node.js/Express backend, PostgreSQL, MongoDB, Redis, apps full-stack.
**Pas idéal pour :** Apps nécessitant des disques persistants non-bases-de-données.

#### Limites tier gratuit
- 5$ de crédit/mois (Hobby plan)
- Sleep automatique si crédit épuisé

#### Détection automatique (Nixpacks)
Railway détecte automatiquement :
- Node.js → via `package.json`
- Python → via `requirements.txt` ou `Pipfile`
- PHP → via `composer.json`

#### railway.json (optionnel — si détection auto insuffisante)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Procfile (alternative)
```
web: node server.js
```

#### PORT — règle critique Railway
```javascript
// ✅ Obligatoire : Railway assigne le port via variable d'env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
```
> ❌ Ne jamais hardcoder `app.listen(3000)` en production Railway.
> Railway injecte `$PORT` automatiquement — si ton app écoute sur un autre port, elle sera inaccessible.

#### Variables d'environnement Railway
- Chemin : Service → Variables
- Railway injecte automatiquement les variables des services liés (ex: `DATABASE_URL` si PostgreSQL ajouté)

#### .env.example Node.js/Railway
```env
# Serveur
PORT=3000
NODE_ENV=production

# Base de données (Railway injecte DATABASE_URL automatiquement)
DATABASE_URL=postgresql://user:password@host:5432/dbname
MONGO_URL=mongodb://user:password@host:27017/dbname

# Auth
JWT_SECRET=CHANGER_EN_PRODUCTION
JWT_EXPIRES_IN=7d

# FedaPay
FEDAPAY_SECRET_KEY=sk_live_XXXXXX
FEDAPAY_ENVIRONMENT=live

# CORS
ALLOWED_ORIGINS=https://monapp.com,https://www.monapp.com
```

#### Checklist pré-déploiement Railway
```
□ PORT utilise process.env.PORT
□ Toutes les variables d'env ajoutées dans Railway Dashboard → Variables
□ package.json a un script "start" : "node server.js"
□ .gitignore contient .env, node_modules/
□ Test local avec NODE_ENV=production npm start
□ Si PostgreSQL : migrations à jour (prisma migrate deploy OU knex migrate:latest)
```

---

### 2.3 RENDER

**Idéal pour :** Node.js, Python, sites statiques, PostgreSQL, Redis.
**Attention :** Free tier = sleep après 15 min d'inactivité → redémarrage ~30s.

#### render.yaml (Infrastructure as Code)
```yaml
services:
  # Backend Node.js
  - type: web
    name: mon-api
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: ma-base
          property: connectionString

  # Frontend statique React
  - type: web
    name: mon-front
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./build
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: ma-base
    databaseName: monapp
    user: monapp
```

#### Checklist pré-déploiement Render
```
□ render.yaml valide (YAML — attention à l'indentation)
□ Pour SPA : routes rewrite vers /index.html présentes
□ PORT : process.env.PORT obligatoire (même règle que Railway)
□ Free tier : accepter le sleep de 15 min ou passer à Starter ($7/mois)
□ Sanity check : tester le build local avant push
```

---

### 2.4 NETLIFY

**Idéal pour :** Sites statiques, React SPA, Next.js (limité), JAMstack.
**Pas idéal pour :** Backend long-running, bases de données directes.

#### netlify.toml — React SPA
```toml
[build]
  command = "npm run build"
  publish = "build"

# Redirection SPA : toutes les routes vers index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de sécurité
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

#### netlify.toml — Next.js
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Limites tier gratuit Netlify
- 100 GB bandwidth/mois
- 300 minutes de build/mois
- Fonctions serverless : 125k invocations/mois

#### Checklist pré-déploiement Netlify
```
□ netlify.toml présent à la racine
□ Redirects SPA configurés (sans ça : 404 sur refresh)
□ Variables d'env : Site Settings → Environment Variables
□ Build locale propre avant push
```

---

### 2.5 OVH VPS (Ubuntu 22.04)

**Idéal pour :** Contrôle total, projets longs, bases de données auto-hébergées, budget fixe.
**Exige :** Compétences administration serveur Linux.

#### Connexion initiale
```bash
ssh root@IP_DU_VPS
```

#### Setup serveur (à faire une seule fois)
```bash
# Mise à jour système
apt update && apt upgrade -y

# Node.js 20 (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 — gestionnaire de processus Node.js
npm install -g pm2

# Nginx — serveur web / reverse proxy
apt install -y nginx

# Certbot — certificats SSL Let's Encrypt
apt install -y certbot python3-certbot-nginx

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

#### PM2 — démarrer et persister l'app Node.js
```bash
# Démarrer l'application
pm2 start server.js --name mon-api

# Sauvegarder pour redémarrage automatique après reboot
pm2 save
pm2 startup

# Commandes utiles
pm2 status          # état des processus
pm2 logs mon-api    # voir les logs
pm2 restart mon-api # redémarrer
pm2 reload mon-api  # reload sans downtime (0-downtime)
```

#### Nginx config — reverse proxy Node.js
```nginx
# /etc/nginx/sites-available/mon-api
server {
    listen 80;
    server_name mondomaine.com www.mondomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
# Activer la config
ln -s /etc/nginx/sites-available/mon-api /etc/nginx/sites-enabled/
nginx -t        # tester la config
systemctl reload nginx
```

#### Nginx config — site statique React
```nginx
server {
    listen 80;
    server_name mondomaine.com www.mondomaine.com;
    root /var/www/mon-front/build;
    index index.html;

    # SPA : toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Déploiement via Git sur VPS
```bash
# Sur le VPS : cloner le repo
git clone https://github.com/user/mon-repo.git /var/www/mon-app
cd /var/www/mon-app
npm install --production
npm run build  # si frontend

# Mise à jour (deploy)
cd /var/www/mon-app
git pull origin main
npm install --production
pm2 reload mon-api
```

#### Checklist pré-déploiement OVH VPS
```
□ UFW firewall actif avec règles SSH + Nginx
□ PM2 configuré avec pm2 save + pm2 startup
□ Nginx config testée avec nginx -t avant reload
□ SSL Certbot activé (voir Section 4)
□ Variables d'env dans /etc/environment ou fichier .env hors du repo Git
□ .env JAMAIS dans /var/www/mon-app/ si le repo est public
```

---

## 3. STACKS — CONFIGS SPÉCIFIQUES

---

### 3.1 REACT SPA (Create React App ou Vite)

```
Build : npm run build
Output CRA : build/
Output Vite : dist/
Type : statique — pas de serveur requis
SPA routing : toutes les routes → index.html (obligatoire)
```

Variables d'env :
- CRA : préfixe `REACT_APP_` obligatoire
- Vite : préfixe `VITE_` obligatoire
- Disponibles uniquement au moment du BUILD (pas runtime)

> ⚠️ Toute variable REACT_APP_ ou VITE_ est visible dans le bundle JS final.
> Ne jamais y mettre une clé secrète.

---

### 3.2 NEXT.JS

```
Build : npm run build
Output : .next/
Types : SSR (serveur requis) ou SSG (statique avec next export)
```

```
SSR  → Vercel (natif), Railway, Render, OVH VPS
SSG  → Vercel, Netlify, tout hébergeur statique
```

Variables d'env Next.js :
- `NEXT_PUBLIC_` → exposée au navigateur (front)
- Sans préfixe → serveur uniquement (back)

---

### 3.3 NODE.JS / EXPRESS

```
Démarrage : node server.js OU npm start
PORT : process.env.PORT OBLIGATOIRE
Process manager VPS : PM2
```

Structure minimale `package.json` :
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step'",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

### 3.4 PYTHON / FLASK

```
Démarrage dev : flask run
Démarrage prod : gunicorn app:app
Dépendances : requirements.txt (obligatoire)
```

Procfile :
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

requirements.txt minimal :
```
flask==3.0.0
gunicorn==21.2.0
python-dotenv==1.0.0
```

Variables d'env Flask :
```env
FLASK_ENV=production
FLASK_SECRET_KEY=CHANGER_EN_PRODUCTION
DATABASE_URL=postgresql://...
```

---

### 3.5 PHP / LARAVEL

```
Répertoire web : public/
Config : .env (pas .env.example en prod)
Cache : php artisan config:cache && php artisan route:cache
```

```bash
# Commandes de déploiement Laravel
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan migrate --force
php artisan storage:link
chmod -R 775 storage bootstrap/cache
```

Nginx config Laravel :
```nginx
root /var/www/mon-laravel/public;
index index.php;

location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
}
```

---

## 4. DOMAINE + HTTPS

### Domaine personnalisé — étapes générales

```
1. Acheter le domaine (OVH, Gandi, Namecheap, etc.)
2. Ajouter le domaine dans le dashboard de la plateforme
3. La plateforme fournit une IP ou CNAME
4. Créer l'enregistrement DNS chez le registrar :
   - A record : mondomaine.com → IP
   - CNAME : www.mondomaine.com → alias fourni par la plateforme
5. Attendre propagation DNS (5 min → 48h)
```

### HTTPS — Let's Encrypt sur OVH VPS

```bash
# Obtenir le certificat SSL
certbot --nginx -d mondomaine.com -d www.mondomaine.com

# Renouvellement automatique (vérifier qu'il est en place)
certbot renew --dry-run

# Cron automatique (généralement déjà configuré par Certbot)
# Vérifier dans : /etc/cron.d/certbot
```

> Vercel, Railway, Render, Netlify : SSL automatique. Aucune action requise.
> OVH VPS : Certbot obligatoire. HTTP seul = navigateurs bloquent l'accès.

### HTTPS — config Nginx après Certbot
```nginx
# Certbot ajoute automatiquement ces blocs :
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/mondomaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mondomaine.com/privkey.pem;
    # ...
}

server {
    listen 80;
    server_name mondomaine.com www.mondomaine.com;
    return 301 https://$host$request_uri;  # Redirection HTTP → HTTPS
}
```

---

## 5. SEO

### Fichiers requis à la racine (dossier `public/`)

#### robots.txt
```txt
User-agent: *
Allow: /

Sitemap: https://mondomaine.com/sitemap.xml
```

#### sitemap.xml (exemple statique)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mondomaine.com/</loc>
    <lastmod>2026-07-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mondomaine.com/a-propos</loc>
    <lastmod>2026-07-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Meta tags HTML essentiels
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nom App — Description courte</title>
  <meta name="description" content="Description de 150-160 caractères max." />

  <!-- Open Graph (partage réseaux sociaux) -->
  <meta property="og:title" content="Nom App" />
  <meta property="og:description" content="Description." />
  <meta property="og:image" content="https://mondomaine.com/og-image.png" />
  <meta property="og:url" content="https://mondomaine.com" />
  <meta property="og:type" content="website" />

  <!-- Canonical URL (évite le contenu dupliqué) -->
  <link rel="canonical" href="https://mondomaine.com/" />
</head>
```

### SEO React — react-helmet-async
```bash
npm install react-helmet-async
```
```jsx
import { Helmet } from 'react-helmet-async'

function PageAccueil() {
  return (
    <>
      <Helmet>
        <title>Accueil — Mon App</title>
        <meta name="description" content="Description de la page." />
      </Helmet>
      {/* contenu */}
    </>
  )
}
```

---

## 6. PWA (Progressive Web App)

### Prérequis obligatoires
```
✅ HTTPS (obligatoire — PWA bloquée sur HTTP)
✅ manifest.json
✅ Service worker enregistré
✅ Icônes : 192x192, 512x512 (PNG), maskable icon
✅ apple-touch-icon : 180x180
```

### manifest.json
```json
{
  "name": "Mon Application",
  "short_name": "MonApp",
  "description": "Description de l'application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1F3864",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### Enregistrement service worker (React)
```javascript
// src/index.js ou main.jsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW enregistré:', reg.scope))
      .catch(err => console.error('SW erreur:', err))
  })
}
```

> ⚠️ Icône maskable : zone safe = 80% du centre. Les 10% des bords peuvent être coupés.
> ⚠️ Ne pas utiliser de fond transparent pour les icônes PWA Android.
> ⚠️ Tester avec Lighthouse (Chrome DevTools) avant livraison.

---

## 7. ANALYTICS

### Option 1 — Google Analytics 4 (GA4)

```bash
npm install react-ga4
```
```javascript
// src/analytics.js
import ReactGA from 'react-ga4'

export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX')
}

export const trackPage = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path })
}
```
```jsx
// App.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGA, trackPage } from './analytics'

initGA()

function App() {
  const location = useLocation()
  useEffect(() => { trackPage(location.pathname) }, [location])
  // ...
}
```

Variable d'env :
```env
REACT_APP_GA_ID=G-XXXXXXXXXX
```

### Option 2 — Plausible (sans cookies, RGPD-friendly)

```html
<!-- public/index.html -->
<script defer
  data-domain="mondomaine.com"
  src="https://plausible.io/js/script.js">
</script>
```

> ⚠️ Google Analytics nécessite un bandeau de consentement cookies selon le RGPD.
> Plausible ne collecte pas de données personnelles → pas de bandeau requis.

---

## 8. MONITORING

### UptimeRobot (gratuit — surveillance disponibilité)

```
1. Créer un compte sur uptimerobot.com
2. Add New Monitor → HTTP(s)
3. URL : https://mondomaine.com
4. Interval : 5 minutes
5. Notification : email ou Telegram
```

> Gratuit : 50 monitors, vérification toutes les 5 min.

### Sentry (erreurs JavaScript et backend)

```bash
npm install @sentry/react @sentry/tracing
```
```javascript
// src/index.js
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

Variable d'env :
```env
REACT_APP_SENTRY_DSN=https://xxxxx@oXXXXXX.ingest.sentry.io/XXXXXX
```

### Monitoring Node.js avec PM2 (OVH VPS)

```bash
pm2 monit          # dashboard temps réel CPU/RAM
pm2 logs           # tous les logs
pm2 logs mon-api   # logs d'un seul service
pm2 plus           # dashboard web (payant mais optionnel)
```

---

## 9. SAUVEGARDES

### PostgreSQL — dump manuel

```bash
# Créer un dump
pg_dump -U postgres -d nom_base > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurer
psql -U postgres -d nom_base < backup_20260701_120000.sql
```

### PostgreSQL — cron automatique (OVH VPS)

```bash
# Éditer le crontab
crontab -e

# Sauvegarde quotidienne à 2h du matin, conservation 7 jours
0 2 * * * pg_dump -U postgres nom_base > /var/backups/pg/backup_$(date +\%Y\%m\%d).sql && find /var/backups/pg/ -mtime +7 -delete
```

### MongoDB — dump manuel

```bash
# Créer un dump
mongodump --uri="mongodb://localhost:27017/nom_base" --out=/var/backups/mongo/$(date +%Y%m%d)

# Restaurer
mongorestore --uri="mongodb://localhost:27017/nom_base" /var/backups/mongo/20260701/
```

### Sauvegardes cloud — plateformes managées

| Plateforme | Backup auto | Rétention | Coût |
|-----------|-------------|-----------|------|
| Railway PostgreSQL | ✅ Oui | 7 jours | Inclus Hobby |
| Render PostgreSQL | ✅ Oui | 7 jours | Inclus Starter |
| Supabase | ✅ Oui | 7 jours | Gratuit (Free tier) |
| OVH VPS | ❌ Manuel | À configurer | Script cron |

> ⚠️ Tester la restauration au moins une fois. Une sauvegarde non testée n'est pas une sauvegarde.

---

## 10. CI/CD GITHUB ACTIONS

### 10.1 Pipeline complet — Vercel (déploiement automatique)

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Installer les dépendances
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Tests
        run: npm test -- --watchAll=false

      - name: Build
        run: npm run build

      - name: Deploy sur Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.2 Pipeline complet — Railway

```yaml
# .github/workflows/deploy-railway.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Installer les dépendances
        run: npm ci

      - name: Tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/testdb
          NODE_ENV: test

      - name: Deploy sur Railway
        run: npx @railway/cli@latest up --service ${{ secrets.RAILWAY_SERVICE_NAME }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 10.3 Pipeline complet — OVH VPS (SSH deploy)

```yaml
# .github/workflows/deploy-vps.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Tests
        run: npm ci && npm test

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/mon-app
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload mon-api
```

### 10.4 Secrets GitHub à configurer

| Secret | Valeur | Utilisé par |
|--------|--------|-------------|
| `VERCEL_TOKEN` | Token API Vercel | Pipeline Vercel |
| `VERCEL_ORG_ID` | ID org Vercel | Pipeline Vercel |
| `VERCEL_PROJECT_ID` | ID projet Vercel | Pipeline Vercel |
| `RAILWAY_TOKEN` | Token Railway | Pipeline Railway |
| `RAILWAY_SERVICE_NAME` | Nom du service | Pipeline Railway |
| `VPS_HOST` | IP du serveur | Pipeline VPS |
| `VPS_USER` | Utilisateur SSH | Pipeline VPS |
| `VPS_SSH_KEY` | Clé privée SSH | Pipeline VPS |

> Ajouter dans : GitHub Repo → Settings → Secrets and variables → Actions

---

## 11. ROLLBACK

### Rollback Vercel
```
1. Dashboard Vercel → Deployments
2. Trouver le dernier déploiement stable
3. Cliquer → "Promote to Production"
Délai : immédiat
```

### Rollback Railway
```
1. Dashboard Railway → Service → Deployments
2. Trouver le déploiement stable
3. Cliquer → "Rollback"
Délai : ~2 minutes
```

### Rollback Render
```
1. Dashboard Render → Service → Events
2. Sélectionner le commit stable
3. "Redeploy"
Délai : ~3 minutes
```

### Rollback OVH VPS (Git)
```bash
# Voir l'historique des commits
git log --oneline

# Revenir à un commit précis (sans réécrire l'historique)
git revert HEAD
git push origin main

# Ou revenir directement à un commit (réécriture — à éviter si possible)
git reset --hard COMMIT_HASH
git push origin main --force

# Redémarrer l'app après rollback
pm2 reload mon-api
```

> ⚠️ Rollback code ≠ rollback base de données.
> Si la mise à jour a appliqué des migrations SQL, revenir au code ne restaure pas le schéma.
> Toujours avoir un backup DB avant tout déploiement qui touche le schéma.

---

## 12. FORMAT DU deployment_guide.md À GÉNÉRER

**L'agent génère `deployment_guide.md` directement à la racine du projet.**
**Toutes les valeurs entre crochets sont auto-remplies depuis le code du projet.**
**Les valeurs introuvables sont marquées `[À RENSEIGNER]`.**

```markdown
# DEPLOYMENT GUIDE — [NOM DU PROJET — lu depuis package.json "name"]
Généré le : [DATE AUTOMATIQUE]
Stack : [DÉTECTÉ AUTOMATIQUEMENT depuis package.json]
Plateforme(s) : [DÉTECTÉ depuis vercel.json/railway.json/netlify.toml ou [À RENSEIGNER]]

---

## 1. PRÉREQUIS
[liste des outils à installer localement]

## 2. VARIABLES D'ENVIRONNEMENT
[fichier .env.example complet]

## 3. BUILD DE PRODUCTION
[commandes exactes pour builder le projet]

## 4. FICHIERS DE CONFIGURATION
[vercel.json OU railway.json OU netlify.toml OU nginx config]

## 5. DÉPLOIEMENT
[étapes pas à pas pour la plateforme choisie]

## 6. DOMAINE ET HTTPS
[étapes DNS + SSL selon la plateforme]

## 7. SEO
[robots.txt, sitemap.xml, meta tags à vérifier]

## 8. PWA (si applicable)
[manifest.json, service worker, checklist]

## 9. ANALYTICS (si applicable)
[code d'intégration + variable d'env]

## 10. MONITORING
[UptimeRobot setup + Sentry si applicable]

## 11. SAUVEGARDES
[commandes + cron selon la base de données]

## 12. CI/CD GITHUB ACTIONS
[fichier workflow complet]

## 13. ROLLBACK
[procédure selon la plateforme]

## 14. CHECKLIST FINALE
[liste de vérification avant de considérer le déploiement terminé]

---
Sections marquées "À RENSEIGNER" = informations manquantes à compléter manuellement.
```

---

*Ce document couvre : Vercel, Railway, Render, Netlify, OVH VPS*
*Stacks : React SPA, Next.js, Node.js/Express, Python/Flask, PHP/Laravel*
*Mis à jour : juillet 2026*
