---
agent: AGENT-UI
commande: prompt:ui
role: agent-prompt-module
module: composants-ui
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - hero section ui-hero
  - modale et popup ui-modal
  - carte de contenu ui-card
  - bannières et toasts ui-banner
  - onglets et accordéons ui-tabs
action: Module de prompts spécialisés pour la conception et l'implémentation de composants UI riches et interactifs
---

# MODULE — Composants UI
> Charger AGENT-CORE.md avant ce module.
## 5. COMPOSANTS UI RÉUTILISABLES

---

### `ui-hero` — Hero Section

**Rôle :** Première impression, clarté du message, déclenchement de l'action principale.

**ÉTAPE 1 — Audit**
Analyser : contexte de la page · message principal · CTA attendu · visuels disponibles.

**ÉTAPE 2 — Rédaction**
Produire : titre H1 · sous-accroche · CTA principal · CTA secondaire si nécessaire · texte de réassurance si applicable.

**ÉTAPE 3 — Proposition**
Présenter : structure · textes · recommandations visuelles. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règle absolue : un seul message, une seule action principale. Titre + sous-accroche + CTA visible sans scroll + élément visuel fort.

---

### `ui-testimonials` — Section Témoignages

**Rôle :** Preuve sociale, réduction des objections, établissement de la confiance.

**ÉTAPE 1 — Audit**
Analyser : témoignages disponibles (texte, photo, nom, titre, résultat) · authenticité · pertinence par rapport aux objections cibles.

**ÉTAPE 2 — Sélection et mise en forme**
Sélectionner 3 à 6 témoignages les plus puissants. Pour chacun : problème avant → solution → résultat chiffré si possible. Rédiger un titre extrait du témoignage.

**ÉTAPE 3 — Proposition**
Présenter : structure (carousel / grille / masonry) · témoignages sélectionnés · mise en forme. Attendre validation.

**ÉTAPE 4 — Implémentation**
Format par témoignage : photo + nom + titre/rôle + témoignage structuré + résultat.
Règle : ne jamais afficher un témoignage sans nom réel ni contexte.

---

### `ui-faq` — Section FAQ

**Rôle :** Lever les objections, réduire le SAV, améliorer le SEO.

**ÉTAPE 1 — Audit**
Analyser : questions réelles posées (SAV, commentaires, reviews) · objections non traitées · questions existantes dans la FAQ.

**ÉTAPE 2 — Rédaction**
7 à 12 questions/réponses. Chaque réponse : directe, sans jargon, < 100 mots. Couvrir : prix, fonctionnement, sécurité, support, différences concurrents.

**ÉTAPE 3 — Proposition**
Présenter : questions triées par fréquence · format (accordéon / liste / catégorisé) · balisage FAQ Schema.org. Attendre validation.

**ÉTAPE 4 — Implémentation**
Accordéon + balisage JSON-LD FAQ Schema + barre de recherche si >10 questions + lien contact en bas.

---

### `ui-team` — Section Équipe

**Rôle :** Humaniser la marque, établir la crédibilité des personnes.

**ÉTAPE 1 — Audit**
Analyser : membres à présenter · données disponibles (photo, nom, rôle, expertise, LinkedIn) · pertinence de la section dans le contexte.

**ÉTAPE 2 — Rédaction**
Pour chaque membre : titre de rôle clair + bio 2 phrases max axée sur valeur apportée (pas un CV).

**ÉTAPE 3 — Proposition**
Présenter : structure (grille / carousel / liste) · informations par carte · recommandations photos. Attendre validation.

**ÉTAPE 4 — Implémentation**
Format : photo + nom + rôle + bio courte + LinkedIn si applicable.
Règle : ne jamais afficher une section équipe sans photos réelles.

---

### `ui-logos` — Section Partenaires / Logos

**Rôle :** Crédibilité par association, preuve sociale institutionnelle.

**ÉTAPE 1 — Audit**
Analyser : logos disponibles (clients, partenaires, presse, certifications) · qualité et cohérence visuelle · pertinence pour l'audience cible.

**ÉTAPE 2 — Sélection**
Maximum 8 logos les plus reconnaissables par l'audience. Proposer un titre adapté au type (clients / partenaires / "Ils parlent de nous").

**ÉTAPE 3 — Proposition**
Présenter : titre · ordre des logos · traitement visuel (monochrome ou couleur, taille uniforme). Attendre validation.

**ÉTAPE 4 — Implémentation**
Taille uniforme · version monochrome préférée · carousel si >6 logos sur mobile.
Règle : jamais afficher un logo sans autorisation.

---

### `ui-stats` — Section Statistiques / Chiffres clés

**Rôle :** Impact immédiat par les chiffres, preuve de valeur et d'échelle.

**ÉTAPE 1 — Audit**
Analyser : chiffres disponibles et vérifiables · pertinence pour l'audience · date de dernière mise à jour.

**ÉTAPE 2 — Sélection et formulation**
Maximum 5 chiffres. Pour chacun : chiffre + description < 8 mots.
Règles : ne jamais arrondir de façon suspecte · ne jamais inventer.

**ÉTAPE 3 — Proposition**
Présenter : chiffres retenus avec formulation · format (compteur animé ou statique) · source si applicable. Attendre validation.

**ÉTAPE 4 — Implémentation**
3 à 5 métriques en grand + label court sur une ligne. Animation compteur si chiffre impactant. Source ou date si crédibilité l'exige.

---

### `ui-features` — Section Fonctionnalités

**Rôle :** Présenter ce que le produit fait, traduit en bénéfices concrets.

**ÉTAPE 1 — Audit**
Analyser : fonctionnalités du produit · bénéfices apportés · problèmes résolus pour l'utilisateur cible.

**ÉTAPE 2 — Rédaction**
Maximum 6 fonctionnalités. Pour chacune : icône ou visuel + titre en bénéfice (pas en technicité) + description 2 phrases max.

**ÉTAPE 3 — Proposition**
Présenter : fonctionnalités retenues · formulations · format (grille 3 col / liste avec visuels / tabs). Attendre validation.

**ÉTAPE 4 — Implémentation**
Titre de section + grille (icône + titre-bénéfice + description).
Règle : jamais une liste de caractéristiques techniques sans traduction en bénéfice.

---

### `ui-pricing` — Section Tarifs

**Rôle :** Comparer clairement les plans, orienter vers le plan optimal, lever les objections prix.

**ÉTAPE 1 — Audit**
Analyser : plans existants · fonctionnalités par plan · logique de pricing · objections fréquentes.

**ÉTAPE 2 — Rédaction**
Produire : titre de section (value-first, pas "Nos tarifs") · nom et description par plan · fonctionnalités par plan · CTA par plan · mise en avant du plan recommandé · bloc de réassurance.

**ÉTAPE 3 — Proposition**
Présenter : structure du tableau · hiérarchie visuelle · plan mis en avant · réassurances. Attendre validation.

**ÉTAPE 4 — Implémentation**
Toggle mensuel/annuel si applicable · plan recommandé visuellement mis en avant · CTA par plan · réassurance sous les plans (CB non requise, résiliation facile).

---

### `ui-blog-preview` — Section Blog Preview

**Rôle :** Montrer l'expertise éditoriale, orienter vers les articles, améliorer le SEO interne.

**ÉTAPE 1 — Audit**
Analyser : articles disponibles et métadonnées · pertinence par rapport à la page hôte.

**ÉTAPE 2 — Sélection**
3 articles : 1 récent + 1 populaire + 1 pertinent au contexte de la page. Rédiger titre de section + CTA vers le blog.

**ÉTAPE 3 — Proposition**
Présenter : 3 articles retenus · format de carte · CTA blog. Attendre validation.

**ÉTAPE 4 — Implémentation**
Titre + 3 cartes (image + catégorie + titre + date + lien) + CTA "Voir tous les articles".
Règle : ne jamais afficher des articles non pertinents pour la page en question.

---

### `ui-banner` — Bannière Promo / Annonce

**Rôle :** Communiquer une information urgente ou limitée dans le temps.

**ÉTAPE 1 — Audit**
Analyser : message à communiquer · durée d'affichage · urgence réelle · pages cibles.

**ÉTAPE 2 — Rédaction**
Message principal < 15 mots + CTA si applicable < 5 mots + lien de fermeture.

**ÉTAPE 3 — Proposition**
Présenter : texte · design (top bar / sticky / inline) · durée d'affichage. Attendre validation.

**ÉTAPE 4 — Implémentation**
Fermable · ne pas réapparaître après fermeture (cookie) · accessible (contraste suffisant) · lien si elle mène quelque part.

---

### `ui-modal` — Pop-up / Modal

**Rôle :** Capturer l'attention sur une action spécifique sans quitter la page.

**Brief requis :** déclencheur (exit intent / délai / scroll / clic) · objectif (lead gen / annonce / confirmation / cookie)

**ÉTAPE 1 — Audit**
Analyser : contexte d'apparition · objectif · données à collecter · fréquence d'affichage.
Déterminer : déclencheur approprié · si le pop-up est réellement justifié · fréquence (jamais à chaque visite).

**ÉTAPE 2 — Rédaction**
Produire : titre + sous-accroche + contenu formulaire ou message + CTA principal + lien de fermeture ("Non merci, je ne veux pas…").

**ÉTAPE 3 — Proposition**
Présenter : structure · déclencheur · fréquence et règles d'affichage. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : croix de fermeture visible → ne pas réapparaître pendant X jours après fermeture → overlay sombre → responsive mobile → ne jamais masquer le contenu principal sur mobile.

---

### `ui-toast` — Toast / Notifications

**Rôle :** Feedback immédiat sur une action sans interrompre le flux.

**ÉTAPE 1 — Audit**
Analyser : actions nécessitant un feedback · toasts existants et cohérence.

**ÉTAPE 2 — Conception**
4 types (succès / erreur / avertissement / info) · durée d'affichage · position (haut droite standard) · libellés des cas fréquents.

**ÉTAPE 3 — Proposition**
Présenter : types · libellés · durée · comportement (auto-dismiss / fermeture manuelle). Attendre validation.

**ÉTAPE 4 — Implémentation**
4 variantes visuelles distinctes · auto-dismiss 4–5s (sauf erreur critique) · empilables · accessibles (role="alert", aria-live) · ne jamais bloquer le contenu principal.

---

### `ui-cookie` — Cookie Banner

**Rôle :** Conformité RGPD, collecte du consentement, maintien de la confiance.

**ÉTAPE 1 — Audit**
Analyser : cookies utilisés (essentiels / analytique / marketing / personnalisation) · juridiction applicable · banner existant.
Déterminer : catégories à distinguer · nécessité d'un consentement granulaire · texte légalement conforme.

**ÉTAPE 2 — Rédaction**
Message principal + libellé "Accepter tout" + libellé "Refuser" ou "Continuer sans accepter" + libellé "Personnaliser" + texte du panneau de personnalisation.

**ÉTAPE 3 — Proposition**
Présenter : structure · options proposées · conformité légale. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles RGPD : "Accepter" ET "Refuser" avec même visibilité → cookies non essentiels non pré-cochés → choix mémorisé 6–12 mois → modification possible depuis les paramètres → ne pas bloquer l'accès total au site avant le choix.

---

### `ui-chat` — Chat Widget

**Rôle :** Support accessible, réduction de la friction de contact.

**ÉTAPE 1 — Audit**
Analyser : type de chat (live / bot / hybrid) · cas d'usage · horaires de disponibilité · comportement actuel.
Déterminer : déclencheur (automatique vs manuel) · questions de pré-qualification · comportement hors horaires.

**ÉTAPE 2 — Conception**
Produire : message d'accueil · questions de pré-qualification si applicable · message hors horaires · règles d'affichage du bouton.

**ÉTAPE 3 — Proposition**
Présenter : structure · messages proposés · règles d'affichage. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : ne jamais s'ouvrir automatiquement sans interaction → croix de fermeture visible → indiquer clairement bot ou humain → gérer les indisponibilités → ne pas masquer le CTA principal sur mobile.

---
---

