---
agent: AGENT-FOOTERS
commande: prompt:footer
role: agent-prompt-module
module: footers
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - footer minimaliste footer-minimal
  - footer multi-colonnes footer-columns
  - footer d'application ou SaaS
  - mentions légales et copyright footer
action: Module de prompts spécialisés pour la conception et la conformité des pieds de page (minimalistes ou multi-colonnes)
---

# MODULE — Footers
> Charger AGENT-CORE.md avant ce module.
## 8. FOOTERS

---

### `footer-minimal` — Footer Minimaliste

**Rôle :** Conformité légale, zéro distraction.
**Variantes :** texte seul · avec logo · avec sélecteur de langue
**Brief requis :** type de page hôte (landing page = toujours ce type)

**ÉTAPE 1 — Audit**
Analyser : type de page hôte · liens légaux obligatoires · menu de navigation global existant.
Déterminer : ce qui est légalement requis · ce qui crée de la distraction à supprimer.

**ÉTAPE 2 — Rédaction**
Produire : texte de copyright (année + nom de marque) · libellés des liens légaux (max 3) · rien d'autre.

**ÉTAPE 3 — Proposition**
Présenter : structure exacte · éléments supprimés vs existant · justification de chaque suppression. Attendre validation.

**ÉTAPE 4 — Implémentation**
UNIQUEMENT : copyright + liens légaux (CGU, Confidentialité, Mentions légales) + langue si multilingue.
Règle absolue : jamais de lien de navigation dans un footer de landing page.

---

### `footer-columns` — Footer Colonnes

**Rôle :** Navigation secondaire complète, SEO interne.
**Variantes :** 3 colonnes · 4 colonnes · 5 colonnes
**Brief requis :** nombre de colonnes + type de site

**ÉTAPE 1 — Audit**
Analyser : toutes les pages et sections du site · structure de navigation existante · pages les plus stratégiques · intégrations disponibles.
Déterminer : groupes de liens logiques · nombre de colonnes (3 à 5 max) · liens à prioriser par colonne.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titres de chaque colonne.
2. Libellés des liens par colonne (max 6 par colonne).
3. Texte de copyright.
4. Liens légaux.
5. Description de marque si colonne "À propos" justifiée (max 2 phrases).

**ÉTAPE 3 — Proposition**
Présenter : plan exact des colonnes · hiérarchie visuelle · recommandations SEO. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : logo ou nom de marque → colonnes groupées → réseaux sociaux discrets → copyright + légal.
Règle SEO : max 6 liens par colonne pour ne pas diluer le poids des liens.

---

### `footer-mega` — Footer Méga

**Rôle :** Navigation exhaustive avec visuels pour les grands sites.
**Brief requis :** confirmer que le volume du site justifie ce type

**ÉTAPE 1 — Audit**
Analyser : intégralité du contenu · visuels disponibles · contenus à mettre en avant · volumétrie du site.
Déterminer : si méga footer est réellement justifié · contenus featured avec visuels · grille de mise en page.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titres de section et sous-sections.
2. Descriptions courtes des contenus mis en avant.
3. Libellés de tous les liens.
4. Textes d'accompagnement si images intégrées.
5. Copyright et légal.

**ÉTAPE 3 — Proposition**
Présenter : grille complète · éléments visuels recommandés · justification de chaque bloc. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : logo + description courte → colonnes de liens → bloc featured (avec visuel) → newsletter si pertinente → réseaux sociaux → copyright + légal.
Règle : chaque bloc doit avoir une raison d'être. Ne jamais surcharger.

---

### `footer-newsletter` — Footer Newsletter

**Rôle :** Capture d'emails sur une audience qui a lu tout le contenu.
**Brief requis :** intégration email/CRM disponible · proposition de valeur de la newsletter

**ÉTAPE 1 — Audit**
Analyser : intégration email/CRM disponible · formulaires existants · proposition de valeur · ton de la marque.
Déterminer : ce que l'abonné reçoit concrètement · champs nécessaires · placement du formulaire.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre d'invitation (pas "Abonnez-vous à notre newsletter").
2. Sous-accroche décrivant ce que l'abonné reçoit.
3. Placeholder champ email.
4. Libellé bouton orienté valeur.
5. Message de réassurance (pas de spam, désabonnement facile).

**ÉTAPE 3 — Proposition**
Présenter : structure avec formulaire intégré · textes · placement recommandé. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : bloc newsletter (titre + sous-accroche + champ + bouton + réassurance) → colonnes de liens si nécessaires → copyright + légal.
Le formulaire doit être connecté à l'intégration email existante.

---

### `footer-sitemap` — Footer Sitemap

**Rôle :** Liste exhaustive des pages pour le SEO.
**Brief requis :** confirmer la volumétrie (justifié uniquement sur sites denses)

**ÉTAPE 1 — Audit**
Analyser : intégralité des pages et hiérarchie · pages orphelines · arborescence · volume total.
Déterminer : pages à inclure (indexables uniquement) · pages à exclure (admin, confirmation, légales) · hiérarchie parent/enfant.

**ÉTAPE 2 — Rédaction**
Produire : libellés de toutes les pages à lister · titres de groupe · copyright et légal.

**ÉTAPE 3 — Proposition**
Présenter : liste exhaustive organisée · justification SEO de chaque groupe. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : pages groupées par thème → hiérarchie visuelle claire (parent > enfant) → copyright + légal.
Règle : ne jamais lister des pages non indexables.

---

### `footer-sticky` — Footer Sticky

**Rôle :** CTA permanent visible pendant tout le scroll.
**Brief requis :** action unique à promouvoir

**ÉTAPE 1 — Audit**
Analyser : action principale que le site cherche à déclencher · éléments déjà visibles en permanence · comportement mobile vs desktop · risques de chevauchement.
Déterminer : unique action dans le sticky · permanent ou apparaît après un certain scroll · option de fermeture nécessaire.

**ÉTAPE 2 — Rédaction**
Produire :
1. Libellé du CTA unique.
2. Micro-texte d'accompagnement < 10 mots si nécessaire.
3. Texte de réassurance si achat.

**ÉTAPE 3 — Proposition**
Présenter : structure · comportement scroll · règles mobile vs desktop. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : visible pendant tout le scroll → UN seul CTA → discret mais lisible → option fermeture si nécessaire → optimisé mobile en priorité.

---

### `footer-cta` — Footer CTA

**Rôle :** Dernière chance de conversion avant que le visiteur parte.
**Brief requis :** action souhaitée + argument de dernier recours

**ÉTAPE 1 — Audit**
Analyser : action principale du site · CTA déjà présents sur la page · profil du visiteur qui atteint le bas · ton de la marque.
Déterminer : si CTA du footer identique ou différent du hero · argument de dernier recours · offre spéciale applicable.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre percutant (dernière chance de convaincre).
2. Sous-accroche synthétisant la proposition de valeur.
3. Libellé CTA principal.
4. Libellé CTA secondaire si pertinent.
5. Élément de réassurance.

**ÉTAPE 3 — Proposition**
Présenter : structure · textes · relation avec les autres CTA de la page. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : titre fort → sous-accroche → CTA principal (bouton visible) → CTA secondaire (lien texte) → réassurance → bas de footer standard (copyright + légal).

---

### `footer-social` — Footer Social-first

**Rôle :** Orienter vers la communauté sociale de la marque.
**Brief requis :** liste des réseaux actifs avec URLs

**ÉTAPE 1 — Audit**
Analyser : réseaux actifs et leur engagement · volumes de publications · ton de la marque · réseaux inactifs à ne pas mettre en avant.
Déterminer : 2 à 4 réseaux à vraiment mettre en avant · nécessité d'un message d'invitation · style des icônes.

**ÉTAPE 2 — Rédaction**
Produire :
1. Texte d'invitation si applicable (court).
2. Libellés d'accessibilité de chaque icône.
3. Copyright et légal.

**ÉTAPE 3 — Proposition**
Présenter : réseaux retenus et exclus avec justification · structure · recommandations visuelles. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : icônes réseaux actifs uniquement → texte d'invitation si pertinent → copyright + légal.
Règle : ne jamais afficher un réseau inactif ou peu engagé.

---
---

