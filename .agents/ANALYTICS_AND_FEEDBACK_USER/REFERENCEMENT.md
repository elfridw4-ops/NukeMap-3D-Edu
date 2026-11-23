---
agent: REFERENCEMENT
commande: seo:audit
declencheurs:
  - référencement SEO
  - optimisation GEO
  - balises meta
  - sitemap.xml
  - robots.txt
  - schema.org
action: Protocole complet d'audit et implémentation SEO/GEO (données structurées, découvrabilité IA, performance Core Web Vitals)
---

# PROTOCOLE SEO &amp; GEO

**Objectif :** Définir et appliquer les standards impératifs de référencement (SEO), d'optimisation pour les moteurs IA (GEO) et de qualité technique.  
**Statut :** Le référencement n'est pas une couche de vernis ajoutée à la fin. **Chaque ligne de code, chaque route, et chaque composant a un impact sur la découvrabilité.**

---

## 0. PRÉREQUIS &amp; CONTEXTE (OBLIGATOIRE)

Avant toute action:

1. **Scanner le Stack :** Identifier le framework (Next.js, Nuxt, Astro, WP, Custom) et le mode de rendu (SSR, SSG, CSR).
2. **Localiser les Configs :** Trouver les fichiers de configuration SEO (ex: `next-seo.config`, `nuxt-seo`, plugins WP).
3. **Vérifier l'Environnement :** Distinguer `production` vs `staging`/`dev`.
  - *Règle d'or :* Les sitemaps et robots.txt de staging doivent bloquer l'indexation (`noindex`).

---

## 1. SEO TECHNIQUE &amp; ARCHITECTURE

### 1.1. Fichiers Racine &amp; Accès

- [ ] **robots.txt** : Présent, bloque les ressources sensibles (admin, API privées, staging), autorise les assets CSS/JS.
- [ ] **sitemap.xml** : Généré dynamiquement ou statique, contient uniquement les URL canoniques en 200, exclut les redirections et les `noindex`.
- [ ] **manifest.json** : Validé (pour PWA/Branding).
- [ ] **security.txt** : Présent dans `.well-known/` (contact sécurité).

### 1.2. URLs &amp; Redirections

- [ ] **Canonical** : Absolue et auto-référencée (`<link rel="canonical" href="..." />`).
- [ ] **Structure** : "Slug" propre, pas d'IDs numériques, hiérarchie logique.
- [ ] **Trailing Slash** : Cohérence stricte (choisir avec ou sans, et rediriger l'autre en 301).
- [ ] **i18n (si multi-langue)** : Balises `hreflang` correctes et réciproques sur toutes les pages.

### 1.3. Performance &amp; Crawl Budget

- [ ] **Core Web Vitals** : LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1.
- [ ] **Images** : Formats Next-Gen (WebP/AVIF), `width`/`height` explicites (pour éviter le CLS), `loading="lazy"` (sauf LCP).
- [ ] **Rendu** : Préférendre le SSR/SSG pour le contenu public (critique pour les crawlers IA et Googlebot).
- [ ] **JavaScript** : Hydratation partielle ou différée si possible. Le contenu textuel doit être accessible sans JS si possible.

> **Lien Agentic Browsing :** deux audits de la catégorie « Agentic Browsing » de Lighthouse reposent directement sur ces indicateurs : l'**arbre d'accessibilité** (issu de la catégorie Accessibilité) et le **CLS** (issu de la catégorie Performance). Un site avec une accessibilité faible ou un CLS élevé ne peut pas atteindre le taux de réussite maximal en Agentic Browsing, même avec un `llms.txt` parfait. Ces points sont donc des prérequis du GEO, pas des options de confort.

**Accessibilité (WCAG 2.1/2.2 AA minimum) :**

- [ ] Navigation au clavier fonctionnelle (focus visible).
- [ ] Contrastes de couleurs suffisants.
- [ ] Formulaires : `<label>` liés aux `<input>`, messages d'erreur explicites (`aria-describedby`).
- [ ] Médias : Transcripts pour les vidéos, audio.
- [ ] **Arbre d'accessibilité bien formé** : les agents IA s'appuient sur l'arbre d'accessibilité comme modèle de données principal — tout problème d'a11y est aussi un problème d'agent browsing.

**PWA (Si applicable, sinon N/A) :**

- [ ] `manifest.json` valide, icônes fournies, Service Worker pour le cache hors-ligne.

---

## 2. SEO ON-PAGE &amp; SÉMANTIQUE

Chaque page doit respecter la structure "Entité - Attribut - Valeur" :

- [ ] **Title** : `<Mot-clé principal> | <Marque>` (Max 60 car). Unique.
- [ ] **Meta Description** : Incitative, contient le mot-clé, répond à l'intention (Max 160 car).
- [ ] **H1** : Unique, reflète le sujet principal, pas de "Bienvenue" générique.
- [ ] **HTML Sémantique** : Usage correct de `<main>`, `<article>`, `<section>`, `<aside>`, `<nav>`.
- [ ] **Maillage** : Liens internes avec ancres descriptives (pas de "cliquez ici").
- [ ] **Accessibilité (a11y)** : Contraste AA, `alt` descriptifs (pas de "image1.jpg"), labels sur les formulaires, navigation clavier.

**Contenu &amp; E-E-A-T (Experience, Expertise, Authoritativeness, Trust) :**

- [ ] Auteur identifié (balise ou section visible) pour les articles/blogs.
- [ ] Dates de publication et de dernière mise à jour visibles.
- [ ] Liens externes vers des sources faisant autorité.
- [ ] Images avec `alt` descriptif (pas de "image1.jpg" ou "sans titre").
- [ ] Maillage interne contextuel (pas de liens "cliquez ici").

---

## 3. GEO (OPTIMISATION POUR IA / LLM)

Le GEO vise à rendre le projet compréhensible, citable et utilisable par les IA (ChatGPT, Perplexity, Claude, etc.).

**A. Gestion des Crawlers IA (`robots.txt`) :**  
Définir explicitement les règles pour les bots IA. Par défaut, autoriser sauf contre-indication :

```text
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

*(Si le projet est privé/payant, utiliser `Disallow: /` pour ces bots).*

**B. Fichiers de contexte IA :**  
Maintenir à la racine du projet :

- `llms.txt` : Résumé du projet, liens vers la documentation, API, et fonctionnalités clés.
- `llms-full.txt` (optionnel) : Documentation exhaustive pour le contexte LLM.  
*Règle : Ces fichiers doivent être mis à jour à chaque changement majeur de l'API ou des fonctionnalités.*

**C. Découverte des fichiers de contexte (critique) :**  
Les agents et modèles de langage ne consultent pas spontanément `/llms.txt` à la racine du domaine. Lors d'un parcours agentique, ils commencent très souvent par la **page d'index du site**. Un `llms.txt` correctement rédigé mais non référencé reste donc invisible pour la plupart des agents.

- [ ] **Référencement depuis l'index** : le fichier `llms.txt` doit être explicitement référencé depuis la page d'index, au minimum via `<link rel="describedby" href="/llms.txt">` dans le `<head>`.
- [ ] **Lien visible** : ajouter aussi un lien vers `llms.txt` dans le pied de page ou une section ressources (certains agents lisent les liens du contenu, pas seulement le `<head>`).
- [ ] **Servage correct** : `https://exemple.com/llms.txt` doit être servi avec un `Content-Type` texte, sans redirection. Sinon, l'audit Lighthouse « llms.txt follows recommendations » passe en « Not applicable ».
- [ ] **Contenu conforme** : fichier Markdown avec au moins un H1, ni trop court, ni sans liens.

**D. Structuration du contenu pour l'extraction (Answer Engine Optimization) :**

- Formater les réponses aux questions fréquentes de manière directe (ex: "Qu'est-ce que X ? X est...").
- Utiliser des listes à puces et des tableaux pour les données comparatives (les IA les extraient plus facilement).
- Créer des définitions claires et isolées pour les entités propres au projet.
- **Entités Nommées** : Utiliser les noms complets des produits/personnes au moins une fois pour aider la désambiguïsation.

**E. WebMCP (interaction des agents avec le site) :**  
Le GEO ne s'arrête pas à la lisibilité : il couvre aussi la capacité des agents à **interagir** avec le site. Lighthouse audite ceci via la catégorie « Agentic Browsing » (pass ratio, pas de score pondéré 0-100). Objectif : tous les audits applicables réussis.

- [ ] **WebMCP form coverage** : les formulaires interactifs importants portent des annotations WebMCP (API déclarative en HTML ou impérative en JS), avec des descriptions claires (ce que l'outil fait, quand l'agent doit l'utiliser).
- [ ] **WebMCP tools registered** : les outils enregistrés sont listés et décrits de façon exploitable ; si les outils sont enregistrés en JavaScript, l'enregistrement doit se produire de façon déterministe avant la capture (sensibilité au timing des audits).
- [ ] **WebMCP schemas are valid** : aucun schéma invalide (erreurs ou avertissements du navigateur) en production.
- [ ] **Pas d'annotations artificielles** : si aucun outil WebMCP n'est détecté, les audits passent « Not applicable » et sortent du calcul — ne jamais créer d'annotations pour des fonctionnalités inexistantes juste pour le score.

- *Contrainte :* les audits WebMCP nécessitent une version récente de Chrome et, selon le contexte, une inscription à l'origin trial WebMCP.
- *Distinction :* Schema.org décrit **ce que la page contient** ; WebMCP permet aux agents d'**interagir avec ce que la page permet de faire**. Les deux sont complémentaires, pas interchangeables.

---

## 4. DONNÉES STRUCTURÉES (JSON-LD)

**Règle :** Un schema invalide est pire que pas de schema.  
**Règle stricte :** Le JSON-LD doit être la traduction exacte du contenu visible. Le spam de schémas entraîne des pénalités manuelles.  
**Validation :** Utiliser la syntaxe JSON-LD stricte.

- [ ] **Organization** : Logo, SameAs (liens sociaux), Contact.
- [ ] **WebSite** : Potentiel de recherche (SearchAction).
- [ ] **BreadcrumbList** : Obligatoire pour la navigation.
- [ ] **Article/BlogPosting** : Si applicable (Author, DatePublished, Image).
- [ ] **FAQPage** : *Uniquement* si la FAQ est visible à l'écran (sinon spam).
- [ ] **Product** : Prix, Disponibilité, Avis (si applicable).

- `speakable` (pour les sections de pages destinées à la lecture vocale/IA).

---

## 5. OPEN GRAPH &amp; SOCIAL

Vérifier la présence et la validité des balises pour le partage social :

- **OG :** `og:title`, `og:description`, `og:image` (ratio 1.91:1 recommandé), `og:url`, `og:type`, `og:locale`.
- **Twitter :** `twitter:card` (summary\_large\_image), `twitter:title`, `twitter:description`, `twitter:image`.

- [ ] **og:image** : Dimensions 1200x630px, &lt; 5MB, URL absolue.
- [ ] **og:title / og:description** : Adaptés au partage social (plus émotionnels/accrocheurs que le SEO pur).
- [ ] **Twitter Cards** : `summary_large_image`.

---

## 6. PROCÉDURE DE MAINTENANCE (WORKFLOW)

À chaque modification de code touchant le contenu ou la structure :

1. **Impact Analysis** : Le changement affecte-t-il une URL, un H1, ou une donnée structurée ?
2. **Sync `llms.txt`** : Si une nouvelle fonctionnalité ou page majeure est ajoutée, le fichier `llms.txt` doit être mis à jour.
3. **Sync WebMCP** : Si une nouvelle fonctionnalité interactive (formulaire, action) est ajoutée, évaluer si elle doit porter une annotation WebMCP.
4. **Sitemap Check** : Si nouvelle page -&gt; Vérifier qu'elle est éligible à l'indexation.
5. **Console Check** : Vérifier l'absence d'erreurs 404 ou JS bloquantes.

---

## 7. FORMAT DE RAPPORT D'AUDIT (OBLIGATOIRE)

Générer ce rapport après chaque audit ou modification majeure.

```markdown
# 📊 AUDIT SEO & GEO — [DATE]

## 1. SCORES & SANTÉ
| Métrique | Score | Statut | Commentaire |
| :--- | :---: | :---: | :--- |
| **SEO Technique** | /100 | 🟢/🟡/🔴 | (ex: Sitemap OK, mais Hreflang manquant) |
| **On-Page & Sémantique** | /100 | 🟢/🟡/🔴 | (ex: H1 manquants sur 2 pages) |
| **GEO (Readability)** | /100 | 🟢/🟡/🔴 | (ex: llms.txt à jour, contenu trop vague) |
| **Agentic Browsing** | X/Y pass ratio | 🟢/🟡/🔴 | (ex: llms.txt Not applicable, WebMCP absent) |
| **Accessibilité** | /100 | 🟢/🟡/🔴 | |
| **Perf (CWV)** | /100 | 🟢/🟡/🔴 | |

## 2. FICHIERS CRITIQUES
- [ ] `robots.txt` : [OK / À CORRIGER]
- [ ] `sitemap.xml` : [OK / À CORRIGER]
- [ ] `llms.txt` : [OK / À METTRE À JOUR / ABSENT]
- [ ] `llms.txt` référencé depuis l'index (`describedby`) : [OK / À CORRIGER]
- [ ] `manifest.json` : [OK / N/A]

## 3. AUDITS LIGHTHOUSE « AGENTIC BROWSING »
- [ ] llms.txt follows recommendations : [RÉUSSI / NON APPLICABLE / ÉCHEC]
- [ ] WebMCP form coverage : [RÉUSSI / NON APPLICABLE / ÉCHEC]
- [ ] WebMCP tools registered : [RÉUSSI / NON APPLICABLE / ÉCHEC]
- [ ] WebMCP schemas are valid : [RÉUSSI / NON APPLICABLE / ÉCHEC]
- [ ] Accessibility tree is well-formed : [RÉUSSI / ÉCHEC]
- [ ] Cumulative Layout Shift : [valeur + statut]

## 4. ACTIONS CORRECTIVES (CODE)
*Lister les snippets de code à implémenter pour corriger les erreurs.*
```

**Exemple de correction JSON-LD :**
```json
// Snippet à ajouter dans <head>
```

**Exemple de correction Meta :**
```html
<!-- Remplacer le title actuel par : -->
```
---

## 8. INTERDITS FORMELS

1. **NE JAMAIS** inventer une URL dans le sitemap.
2. **NE JAMAIS** ajouter un schema `FAQPage` si le HTML ne contient pas la FAQ visible.
3. **NE JAMAIS** laisser une image sans `alt` (l'attribut alt est obligatoire sur toute image ; vide seulement si décoratif).
4. **NE JAMAIS** indexer une page de staging/dev.
5. **NE JAMAIS** supprimer le `llms.txt` ou le vider sans justification.
6. **NE JAMAIS** créer une annotation ou un outil WebMCP pour une fonctionnalité qui n'existe pas dans le code.
7. **NE JAMAIS** livrer un schéma WebMCP non validé (erreurs ou avertissements navigateur).