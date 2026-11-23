---
agent: AGENT-NAV
commande: prompt:nav
role: agent-prompt-module
module: navigation-structure
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - header et barre de navigation
  - sidebar et menu latéral
  - menu mobile et drawer
  - breadcrumb et fil d'ariane
  - méga menu
action: Module de prompts spécialisés pour concevoir et structurer la navigation globale (headers, sidebars, breadcrumbs, menus mobiles)
---

# MODULE — Navigation & Structure
> Charger AGENT-CORE.md avant ce module.
## 1. NAVIGATION & STRUCTURE

---

### `nav-header` — Header

**Rôle :** Point d'entrée de toute navigation. Premier élément vu par l'utilisateur.

**Variantes :** transparent · sticky · top bar · centré · split · méga menu · minimal · avec recherche

**Brief requis :** type de header voulu + contexte du site (landing page / SaaS / e-commerce / blog / portfolio)

**ÉTAPE 1 — Audit**
Analyser : structure de navigation existante · comportement scroll actuel · menu mobile associé · logo · CTA principal · type de site.
Déterminer : type de header adapté · liens essentiels vs secondaires · CTA unique · comportement mobile.

**ÉTAPE 2 — Conception**
Produire :
1. Liste des liens de navigation avec ordre de priorité.
2. Libellé du CTA principal.
3. Comportement au scroll (transparent→opaque / sticky / fixe).
4. Contenu top bar si pertinente.
5. Structure méga menu si applicable.
6. Comportement recherche si applicable.
7. Recommandations accessibilité (ARIA, skip link, focus visible).

**ÉTAPE 3 — Proposition**
Présenter : structure desktop + mobile · textes · comportements interactifs · éléments à supprimer. Attendre validation.

**ÉTAPE 4 — Implémentation**
Créer ou modifier le header : logo cliquable · navigation max 6 items · CTA bouton (pas lien texte) · menu mobile indépendant · comportement scroll défini.
Règle landing page : supprimer toute navigation, garder logo + CTA uniquement.

---

### `nav-mobile` — Menu Mobile

**Rôle :** Navigation tactile indépendante du menu desktop.

**Variantes :** hamburger + drawer · full screen overlay · bottom navigation bar · accordion · tab bar sticky

**Brief requis :** type de menu voulu · nombre de liens · présence de sous-menus

**ÉTAPE 1 — Audit**
Analyser : menu desktop et sa complexité · nombre de liens · sous-menus · type d'application · breakpoints actuels.
Déterminer : type de menu adapté · actions prioritaires à mettre en avant · gestion des sous-menus · logique touch-first.

**ÉTAPE 2 — Conception**
Produire :
1. Liens prioritaires pour mobile (peut différer du desktop).
2. Type de déclencheur (hamburger / icône / swipe).
3. Comportement d'ouverture (slide / fade / push).
4. Gestion des sous-menus (accordéon intégré).
5. Bouton de fermeture et placement.
6. CTA mobile visible sans ouvrir le menu.
7. Gestes tactiles supportés.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · animations · différences intentionnelles avec le desktop · accessibilité (focus trap, ARIA, Escape). Attendre validation.

**ÉTAPE 4 — Implémentation**
Zones de tap minimum 44px · fermeture au clic outside ou Escape · jamais bloquer le scroll arrière-plan · animation < 300ms · accessible clavier et lecteurs d'écran.

---

### `nav-breadcrumb` — Breadcrumb

**Rôle :** Orientation de l'utilisateur dans la hiérarchie + SEO rich results.

**Variantes :** simple · SEO JSON-LD · avec compteur · collapsible mobile

**Brief requis :** profondeur de navigation · besoin SEO (JSON-LD ou non)

**ÉTAPE 1 — Audit**
Analyser : structure de navigation et profondeur · pages nécessitant un breadcrumb · balisage JSON-LD existant · comportement mobile actuel.
Déterminer : niveaux à afficher · nécessité JSON-LD · gestion URLs longues mobile · séparateur visuel.

**ÉTAPE 2 — Conception**
Produire :
1. Structure des niveaux par type de page.
2. Séparateur visuel.
3. Comportement mobile (collapsible, troncature "…").
4. Balisage JSON-LD.
5. Style visuel (taille, couleur, lien vs texte courant).

**ÉTAPE 3 — Proposition**
Présenter : exemples pour les 3 types de pages les plus profondes · code JSON-LD · placement recommandé (avant le H1). Attendre validation.

**ÉTAPE 4 — Implémentation**
Toujours commencer par "Accueil" cliquable · dernier élément non cliquable · JSON-LD inclus · mobile propre · balise `<nav aria-label="breadcrumb">` · jamais afficher sur la page d'accueil.

---

### `nav-sidebar` — Sidebar

**Rôle :** Navigation secondaire, filtres, ou contenus contextuels.

**Variantes :** navigation · filtres · widgets · sticky · collapsible · contextuelle

**Brief requis :** type de sidebar · sticky ou non · collapsible ou non · type de page cible

**ÉTAPE 1 — Audit**
Analyser : type de page (blog / doc / e-commerce / dashboard) · contenu à afficher · comportement mobile actuel · interactions avec le contenu principal.
Déterminer : type adapté · éléments sticky vs scrollables · gestion mobile · priorités.

**ÉTAPE 2 — Conception**
Produire :
1. Éléments à intégrer avec priorité.
2. Comportement sticky (à partir de quel scroll).
3. Comportement collapsible (rail d'icônes ou masquage).
4. Gestion mobile (drawer, bouton filtre, accordéon).
5. Affichage filtres actifs si applicable.
6. Comportement contextuel si applicable.

**ÉTAPE 3 — Proposition**
Présenter : structure desktop + mobile · interactions · réorganisations. Attendre validation.

**ÉTAPE 4 — Implémentation**
Ne jamais masquer le contenu principal sur mobile · largeur fixe 240–300px desktop · accessible clavier · filtres actifs visibles · réinitialisation en un clic.

---

### `nav-pagination` — Pagination

**Rôle :** Navigation dans un ensemble de contenus ou produits.

**Variantes :** numérotée · infinite scroll · bouton "charger plus" · prev/next · par curseur

**Brief requis :** volume de données · type de contenu · contraintes SEO

**ÉTAPE 1 — Audit**
Analyser : type de contenu paginé · volume et rythme de croissance · contraintes SEO · performances actuelles · comportement utilisateur (browse vs search).
Déterminer : type adapté · éléments par page · gestion URL · comportement mobile.

**ÉTAPE 2 — Conception**
Produire :
1. Type de pagination et justification.
2. Nombre d'éléments par page.
3. Libellés boutons et liens.
4. État de chargement (skeleton / spinner).
5. Gestion des URLs (paramètre ?page= / hash / curseur).
6. Comportement au retour arrière.

**ÉTAPE 3 — Proposition**
Présenter : structure et comportement · implications SEO · recommandations performance. Attendre validation.

**ÉTAPE 4 — Implémentation**
Ne jamais bloquer l'accès au footer · conserver position scroll au retour arrière · indiquer page actuelle si numérotée · gérer états (chargement / erreur / fin) · accessible ARIA.
Règle : ne jamais utiliser infinite scroll si SEO des pages est prioritaire.

---
