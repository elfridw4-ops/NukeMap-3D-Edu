---
agent: AGENT-PAGES
commande: prompt:pages
role: agent-prompt-module
module: pages-types
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - page d'accueil page-home
  - tableau de bord page-dashboard
  - page profil utilisateur page-profile
  - page paramètres page-settings
  - page 404 page-404
  - page pricing page-pricing
action: Module de prompts spécialisés pour concevoir et rédiger les pages types complètes d'une application ou d'un site
---

# MODULE — Pages Types
> Charger AGENT-CORE.md avant ce module.
## 2. PAGES TYPES

---

### `page-home` — Page d'accueil

**Rôle :** Première impression, orientation multi-profil, conversion vers les sections clés.

**ÉTAPE 1 — Audit**
Analyser : proposition de valeur · profils de visiteurs et intentions · pages cibles par profil · preuves disponibles · actions souhaitées.
Déterminer : hiérarchie des messages · segments à adresser · sections indispensables vs optionnelles · CTA principal et secondaire.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre H1 — proposition de valeur claire.
2. Sous-accroche — bénéfice concret en 1 phrase.
3. Libellé CTA principal.
4. Libellé CTA secondaire.
5. Titres et introductions de chaque section.
6. Preuves sociales à mettre en avant.

**ÉTAPE 3 — Proposition**
Présenter : structure complète avec toutes les sections · textes de chaque bloc · hiérarchie visuelle. Attendre validation.

**ÉTAPE 4 — Implémentation**
Ordre : Hero → Logos confiance → Proposition de valeur (3 bénéfices) → Fonctionnalités → Preuve sociale → Sections par profil → CTA intermédiaire → FAQ courte → CTA final.

---

### `page-about` — Page À propos

**Rôle :** Humaniser la marque, établir la confiance, expliquer le pourquoi.

**ÉTAPE 1 — Audit**
Analyser : histoire de la marque · valeurs affichées vs incarnées · équipe disponible · jalons importants · ton de la marque.
Déterminer : angle narratif · preuves disponibles · pertinence section équipe · CTA de fin.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre narratif (pas "À propos").
2. Histoire en 3 actes : avant / déclencheur / maintenant.
3. Mission en une phrase.
4. Valeurs avec preuve concrète pour chacune.
5. Bios équipe si applicable (2 phrases max, axées valeur apportée).
6. Jalons clés (timeline).
7. CTA de fin.

**ÉTAPE 3 — Proposition**
Présenter : structure narrative · textes · recommandations visuelles. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : titre narratif → histoire → valeurs avec preuves → équipe → chiffres clés → timeline → CTA contact ou services.
Règle : ne jamais commencer par "Nous sommes une entreprise fondée en…"

---

### `page-contact` — Page Contact

**Rôle :** Réduire la friction de prise de contact, qualifier la demande, rassurer.

**ÉTAPE 1 — Audit**
Analyser : types de demandes reçues · canaux disponibles · formulaire existant et ses champs · délai de réponse pratiqué.
Déterminer : champs réellement nécessaires · besoin de formulaires multiples · informations à afficher directement · message de confirmation.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre (pas "Contact").
2. Introduction avec délai de réponse.
3. Libellés et placeholders des champs.
4. Libellé du bouton d'envoi.
5. Message de confirmation post-envoi.
6. Informations de contact directes si applicables.

**ÉTAPE 3 — Proposition**
Présenter : structure · champs avec justification · canaux alternatifs. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : titre + intro rassurante → formulaire minimal → confirmation post-envoi → canaux alternatifs → localisation si physique.
Règle : jamais demander plus que nécessaire au premier contact.

---

### `page-blog-list` — Page Blog / Liste d'articles

**Rôle :** Navigation dans le contenu éditorial, SEO, orientation vers les articles pertinents.

**ÉTAPE 1 — Audit**
Analyser : volume d'articles et catégorisation · métadonnées disponibles · filtres et recherche existants · pagination actuelle.
Déterminer : mise en page optimale · filtres pertinents · articles à mettre en avant · articles par page.

**ÉTAPE 2 — Conception**
Produire :
1. Structure de la page (hero, filtres, grille).
2. Informations sur chaque carte article.
3. Hiérarchie featured vs standard.
4. Système de filtres et recherche.
5. Pagination appropriée.
6. CTA newsletter si applicable.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · maquette des cartes · recommandations SEO. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : hero avec titre + description → filtres par catégorie/tag → grille d'articles (image, titre, résumé, date, temps de lecture) → article(s) mis en avant → pagination → CTA newsletter.

---

### `page-article` — Page Article unique

**Rôle :** Lisibilité maximale, rétention du lecteur, conversion post-lecture.

**ÉTAPE 1 — Audit**
Analyser : template d'article existant · éléments disponibles (auteur, date, temps de lecture, tags) · sidebar si présente · CTA existants · éléments post-article.
Déterminer : largeur optimale de colonne de lecture · éléments du header d'article · nécessité d'un sommaire · placement des CTA.

**ÉTAPE 2 — Conception**
Produire :
1. Structure header d'article.
2. Mise en page corps (largeur, taille police, interligne).
3. Sommaire flottant si article long (>1500 mots).
4. CTA inline dans le contenu.
5. Section post-article (auteur, articles liés, newsletter, commentaires).
6. Bouton partage et placement.

**ÉTAPE 3 — Proposition**
Présenter : structure template · recommandations lisibilité · placements CTA. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : header (titre H1, auteur, date, temps de lecture, catégorie, image) → corps (largeur optimale, hiérarchie typo) → sommaire si long → barre progression lecture → CTA contextuel milieu → section auteur → articles liés (max 3) → CTA newsletter → partage social.

---

### `page-category` — Page Catégorie

**Rôle :** Navigation dans un sous-ensemble de contenu ou produits, SEO longue traîne.

**ÉTAPE 1 — Audit**
Analyser : catégories existantes et volume · type de contenu · sous-catégories · structure d'URL.
Déterminer : pages dédiées vs filtres · contenu éditorial SEO · filtres au sein de la catégorie · pagination.

**ÉTAPE 2 — Conception**
Produire :
1. Structure (header éditorial + grille + filtres).
2. Texte d'introduction SEO.
3. Sous-catégories si applicables.
4. Filtres pertinents.
5. Pagination.

**ÉTAPE 3 — Proposition**
Présenter : template · textes d'introduction · recommandations SEO (H1 unique, meta, balisage). Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : H1 unique + introduction SEO (100–200 mots) → breadcrumb → filtres → grille → pagination → liens catégories adjacentes.

---

### `page-search` — Page Résultats de recherche

**Rôle :** Répondre à une intention précise, guider vers le bon contenu rapidement.

**ÉTAPE 1 — Audit**
Analyser : moteur de recherche interne · types de contenu indexé · résultats actuels et format · gestion du zéro résultat.
Déterminer : différenciation visuelle par type · filtres sur résultats · message zéro résultat · autocomplétion si applicable.

**ÉTAPE 2 — Conception**
Produire :
1. Structure de chaque carte résultat par type.
2. Système de filtres post-recherche.
3. Mise en évidence du terme recherché.
4. Message zéro résultat + alternatives.
5. Autocomplétion si applicable.

**ÉTAPE 3 — Proposition**
Présenter : template complet · gestion des cas limites · tri par défaut. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : rappel de la requête → nombre de résultats → filtres → résultats avec terme mis en évidence → pagination → page zéro résultat avec suggestions.
Règle : ne jamais afficher une page vide sans alternative.

---

### `page-profile` — Page Profil utilisateur

**Rôle :** Gestion des données personnelles, historique, paramètres de compte.

**ÉTAPE 1 — Audit**
Analyser : données utilisateur disponibles · actions possibles depuis le profil · visibilité (public / privé / semi-public) · liens avec commandes, abonnement, paramètres.
Déterminer : informations prioritaires · actions à mettre en avant · distinction profil public / paramètres privés · niveau de personnalisation.

**ÉTAPE 2 — Conception**
Produire :
1. Structure (header profil + sections).
2. Informations en-tête (avatar, nom, statut, badges).
3. Sections de gestion (infos, sécurité, préférences, historique).
4. Actions critiques et confirmations (suppression compte).
5. État vide pour sections sans données.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · distinction profil public vs paramètres privés · flux de modification. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : header (avatar, nom, statut) → sections séparées → modification inline ou modale → confirmation pour actions destructives → feedback visuel post-modification.
Règle : ne jamais mélanger profil public et paramètres de compte dans la même vue.

---

### `page-dashboard` — Dashboard

**Rôle :** Vue synthétique du système, déclenchement des actions principales.

**ÉTAPE 1 — Audit**
Analyser : données disponibles et fréquence de mise à jour · profils utilisateurs et leurs objectifs · KPIs prioritaires · actions déclenchables · widgets existants.
Déterminer : hiérarchie des informations above the fold · métriques primaires vs secondaires · types de visualisation · raccourcis d'actions.

**ÉTAPE 2 — Conception**
Produire :
1. KPIs à afficher avec priorité.
2. Type de visualisation par donnée (chiffre / graphique / tableau / barre).
3. Grille de layout (colonnes, ordre des widgets).
4. Filtres temporels (aujourd'hui / 7j / 30j / personnalisé).
5. Raccourcis actions principales.
6. Alertes et notifications critiques.

**ÉTAPE 3 — Proposition**
Présenter : maquette complète avec widgets · justification de chaque widget · état vide nouveau compte. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : métriques clés above the fold (max 4) → graphiques d'évolution → tableau données récentes → raccourcis actions fréquentes → alertes critiques en haut → filtres temporels → état vide.
Règle : jamais plus de 6 métriques primaires.

---

### `page-settings` — Page Paramètres

**Rôle :** Configuration du compte, préférences, gestion des intégrations.

**ÉTAPE 1 — Audit**
Analyser : toutes les options de configuration · organisation actuelle des sections · actions destructives présentes · intégrations tierces.
Déterminer : regroupement logique (compte / sécurité / notifications / facturation / intégrations) · paramètres nécessitant confirmation · paramètres critiques à mettre en évidence.

**ÉTAPE 2 — Conception**
Produire :
1. Navigation des paramètres (sidebar ou onglets).
2. Regroupement des options par section logique.
3. Comportement de sauvegarde (auto-save vs bouton explicite).
4. Confirmations pour actions sensibles.
5. États de chargement et de succès.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · navigation entre sections · flux de confirmation. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : navigation claire entre sections → feedback immédiat après modification → zone danger isolée visuellement → confirmation modale irréversible → indicateur d'état de sauvegarde.
Règle : ne jamais mélanger actions reversibles et irréversibles dans la même zone.

---

### `page-legal` — Pages légales

**Rôle :** Conformité légale, protection de la marque, transparence.

**ÉTAPE 1 — Audit**
Analyser : pages légales existantes · juridiction applicable · données collectées et leur traitement · date de dernière mise à jour.
Déterminer : pages obligatoires selon juridiction · informations manquantes ou obsolètes · format de présentation · nécessité d'une table des matières.

**ÉTAPE 2 — Conception**
Produire :
1. Liste des pages légales nécessaires.
2. Structure de chaque document.
3. Mise en page pour la lisibilité.
4. Date de mise à jour visible.
5. Lien de contact pour questions légales.

**ÉTAPE 3 — Proposition**
Présenter : pages à créer/mettre à jour · structure de chaque document · éléments manquants détectés. Attendre validation.

**ÉTAPE 4 — Implémentation**
Chaque page doit avoir : table des matières cliquable si longue → date de mise à jour en haut → titres hiérarchiques → contact légal → accessible depuis le footer.
Règle : ne jamais mettre du contenu légal en bloc de texte brut sans structure.

---
---

