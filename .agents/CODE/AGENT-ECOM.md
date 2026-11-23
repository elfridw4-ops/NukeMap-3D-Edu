---
agent: AGENT-ECOM
commande: prompt:ecom
role: agent-prompt-module
module: ecommerce
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - page produit ecom-product
  - catalogue et listing ecom-catalog
  - panier et checkout ecom-checkout
  - réassurance e-commerce
action: Module de prompts spécialisés pour concevoir et structurer les flux e-commerce (produits, variantes, paniers, checkout)
---

# MODULE — E-commerce
> Charger AGENT-CORE.md avant ce module.
## 3. E-COMMERCE

---

### `ecom-product` — Page produit

**Rôle :** Convaincre et déclencher l'achat, répondre à toutes les objections.

**ÉTAPE 1 — Audit**
Analyser : données produit (images, description, variantes, prix, stock) · avis clients · questions fréquentes · produits liés · éléments de confiance (garantie, retour, livraison).
Déterminer : images prioritaires · objections à lever · variantes à afficher · CTA principal et réassurances associées.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre produit H1 optimisé.
2. Description courte above the fold.
3. Description longue (bénéfices + caractéristiques).
4. Libellés des variantes.
5. Libellé CTA principal.
6. Éléments de réassurance (livraison, retour, garantie).
7. FAQ produit (5–7 questions).

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · recommandations galerie et mise en page. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : galerie images (zoom, angles multiples) → titre + prix + variantes above the fold → CTA "Ajouter au panier" toujours visible → réassurance → description courte puis longue → avis clients → FAQ → produits liés → sticky CTA mobile.

---

### `ecom-catalog` — Page catégorie produits

**Rôle :** Navigation et filtrage du catalogue, SEO, orientation vers le bon produit.

**ÉTAPE 1 — Audit**
Analyser : catalogue et attributs (prix, taille, couleur, marque, note) · sous-catégories · filtres actuels · tri disponible · cartes produit existantes.
Déterminer : filtres les plus utilisés · produits par page · informations sur chaque carte · comportement filtre mobile.

**ÉTAPE 2 — Conception**
Produire :
1. Filtres prioritaires et ordre.
2. Options de tri.
3. Contenu de chaque carte produit.
4. Mise en page grille (2 col mobile, 3–4 desktop).
5. Introduction SEO de la catégorie.
6. Gestion des produits en rupture.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · logique de filtrage · recommandations SEO. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : H1 + intro SEO → filtres (sidebar desktop / drawer mobile) → tri actif visible → grille (image, nom, prix, note, CTA rapide) → nombre de résultats → pagination → ruptures en bas de liste.

---

### `ecom-cart` — Page panier

**Rôle :** Récapitulatif, réassurance finale, réduction de l'abandon.

**ÉTAPE 1 — Audit**
Analyser : éléments affichés actuellement · taux d'abandon si disponible · codes promo et leur gestion · upsells / cross-sells disponibles · frais de livraison.
Déterminer : objections à lever avant checkout · produits à suggérer · seuil de livraison gratuite · réassurances à afficher.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre de la page.
2. Libellés des actions (modifier, supprimer, continuer).
3. Texte de progression vers livraison gratuite si applicable.
4. Éléments de réassurance.
5. Libellé CTA checkout.
6. Textes upsells si applicables.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · upsells recommandés · réassurances et placement. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : liste produits (image, nom, variante, prix, quantité modifiable) → total détaillé (sous-total, livraison, réduction, total) → code promo → barre progression livraison gratuite → upsells discrets → réassurance → CTA checkout → bouton continuer les achats.

---

### `ecom-checkout` — Page Checkout

**Rôle :** Finaliser l'achat avec le minimum de friction possible.

**ÉTAPE 1 — Audit**
Analyser : étapes du checkout actuel · moyens de paiement disponibles · options de livraison · champs du formulaire · éléments de réassurance présents.
Déterminer : checkout mono-page ou multi-étapes · champs nécessaires · moyens de paiement prioritaires · éléments de confiance indispensables.

**ÉTAPE 2 — Conception**
Produire :
1. Structure du checkout (étapes ou mono-page).
2. Champs formulaire strictement nécessaires.
3. Ordre des sections (livraison → paiement → récapitulatif).
4. Moyens de paiement et ordre d'affichage.
5. Récapitulatif commande visible en permanence.
6. Éléments de réassurance (SSL, paiement sécurisé).

**ÉTAPE 3 — Proposition**
Présenter : structure complète · champs avec justification · recommandations performance (autofill, validation temps réel). Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : supprimer la navigation principale → récapitulatif sticky desktop → validation champs temps réel → autofill navigateur supporté → logos moyens de paiement → étapes et progression visibles → jamais obliger la création de compte pour finaliser.

---

### `ecom-confirmation` — Page confirmation de commande

**Rôle :** Rassurer, récapituler, déclencher la prochaine action.

**ÉTAPE 1 — Audit**
Analyser : informations affichées actuellement · actions proposées post-achat · opportunités d'upsell disponibles · ton de la marque.
Déterminer : informations de confirmation indispensables · opportunité d'upsell pertinente · prochaine action logique.

**ÉTAPE 2 — Rédaction**
Produire :
1. Message de confirmation chaleureux et humain.
2. Récapitulatif de la commande.
3. Prochaines étapes claires.
4. Texte de l'upsell si applicable.
5. CTA de suivi de commande.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · opportunité d'upsell recommandée. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : confirmation avec numéro de commande → récapitulatif produits → informations de livraison → délai estimé → lien de suivi → upsell discret si applicable → CTA vers compte ou boutique.
Règle : ne jamais afficher une page de confirmation froide et vide.

---

### `ecom-tracking` — Page suivi de commande

**Rôle :** Réduire les contacts SAV, rassurer l'acheteur sur l'avancement.

**ÉTAPE 1 — Audit**
Analyser : données de suivi disponibles (statuts, transporteur, tracking) · intégration transporteur · statuts utilisés · formulaire d'accès (numéro + email).
Déterminer : étapes de suivi à afficher · niveau de détail par étape · actions disponibles (retour, contact SAV, modification adresse).

**ÉTAPE 2 — Conception**
Produire :
1. Timeline de suivi avec étapes et libellés.
2. Informations affichées à chaque étape.
3. Lien de tracking transporteur.
4. Actions disponibles selon le statut.
5. Notifications proactives si applicable.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · états de la timeline · actions par statut. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : timeline visuelle (statut actuel mis en évidence) → détails commande → tracking cliquable → date estimée → actions contextuelles → contact SAV accessible.

---

### `ecom-wishlist` — Page Wishlist

**Rôle :** Sauvegarder des produits, déclencher l'achat différé, partage social.

**ÉTAPE 1 — Audit**
Analyser : système existant · gestion disponibilité et changements de prix · options de partage · wishlist multiples si applicable.
Déterminer : actions disponibles par produit · notifications de prix/stock · pertinence du partage.

**ÉTAPE 2 — Conception**
Produire :
1. Structure de chaque carte produit.
2. Alertes disponibilité et prix.
3. Options de partage.
4. CTA "Tout ajouter au panier" si pertinent.
5. État vide avec suggestions.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · actions et placement · gestion états (vide, indisponible, prix changé). Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : produits sauvegardés (image, nom, prix actuel) → indication changement prix/stock → CTA ajouter au panier → supprimer → partage si applicable → état vide avec suggestions.

---

### `ecom-compare` — Page comparaison produits

**Rôle :** Aider la décision d'achat par une comparaison claire et honnête.

**ÉTAPE 1 — Audit**
Analyser : attributs disponibles par produit · nombre maximum de produits comparables · attributs importants pour la décision · gestion des attributs manquants.
Déterminer : attributs à afficher en priorité · format de comparaison · mise en évidence du produit recommandé · limite de produits.

**ÉTAPE 2 — Conception**
Produire :
1. Liste des attributs comparés et ordre.
2. Mise en évidence du "meilleur choix".
3. Gestion des valeurs manquantes (—).
4. CTA par produit.
5. Comportement mobile (scroll horizontal ou vue réduite).

**ÉTAPE 3 — Proposition**
Présenter : structure tableau · attributs retenus avec justification · gestion mobile. Attendre validation.

**ÉTAPE 4 — Implémentation**
Maximum 4 produits côte à côte · mise en évidence des différences (couleur sur cellules distinctives) · CTA "Ajouter au panier" par colonne · possibilité de remplacer un produit · scroll horizontal mobile.

---
---

