---
agent: AGENT-LP
commande: prompt:lp
role: agent-prompt-module
module: landing-pages
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - landing page lead gen lp-lead-gen
  - landing page produit saas lp-saas
  - landing page événement lp-event
  - page de vente et conversion
action: Module de prompts spécialisés pour concevoir et structurer des landing pages à fort taux de conversion
---

# MODULE — Landing Pages
> Charger AGENT-CORE.md avant ce module.
## 9. LANDING PAGES

---

### `lp-lead-gen` — Lead Generation

**Rôle :** Capturer un email en échange d'une valeur gratuite.
**Brief requis :** offre échangée contre l'email (ebook, démo, checklist, template)

**ÉTAPE 1 — Audit**
Analyser : offre gratuite proposée · formulaire existant · données collectées · intégrations email/CRM.
Déterminer : valeur reçue en échange · freins à l'inscription · profil exact du visiteur ciblé.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre axé sur le bénéfice de l'offre (pas sur le produit).
2. Sous-accroche qui lève le principal doute.
3. Description de ce que contient l'offre.
4. 3 à 5 bénéfices concrets.
5. Libellé bouton orienté valeur (pas "Envoyer").
6. Réassurance (vie privée, désabonnement).
7. FAQ courte de 5 questions sur les objections d'inscription.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · recommandations UX (champs, placement formulaire). Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : Hero → présentation de l'offre → formulaire court above the fold → preuve sociale → réassurance → FAQ → CTA répété en bas.
Règle : champ email seul si possible. Jamais plus de 3 champs.

---

### `lp-click-through` — Click-through

**Rôle :** Préparer le visiteur au clic vers une étape suivante (checkout, inscription).
**Brief requis :** page de destination finale + message de la source (pub, email)

**ÉTAPE 1 — Audit**
Analyser : page de destination finale · message de la source · preuves sociales disponibles.
Déterminer : action unique demandée · message-match source/page · distractions à supprimer · objections de dernière minute.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre prolongeant exactement le message de la source (message-match).
2. Sous-accroche confirmant la promesse.
3. 3 à 5 bénéfices en résultats concrets.
4. Libellé CTA unique, précis, orienté action.
5. Réassurance sous le CTA.
6. Bloc preuve sociale court.

**ÉTAPE 3 — Proposition**
Présenter : structure (courte par nature) · textes · éléments à supprimer. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : Hero → bénéfices clés → preuve sociale (courte) → UN seul CTA → réassurance.
Règles absolues : aucun menu de navigation → aucun lien sortant → header épuré ou supprimé.

---

### `lp-sales` — Sales Page

**Rôle :** Vente directe sans étape intermédiaire.
**Brief requis :** produit + prix + audience froide ou chaude

**ÉTAPE 1 — Audit**
Analyser : produit ou service vendu · prix · objections connues · preuves disponibles · concurrence.
Déterminer : profil psychologique de l'acheteur · problème principal et désir profond · raison de non-achat · déclencheurs de décision.

**ÉTAPE 2 — Rédaction (structure AIDA ou PAS)**
Produire :
1. Titre centré sur le problème ou la transformation.
2. Bloc problème : douleur décrite avec précision.
3. Bloc agitation : conséquences de ne rien faire.
4. Bloc solution : le produit comme réponse évidente.
5. Fonctionnalités traduites en bénéfices.
6. Preuves sociales (témoignages, chiffres, études de cas).
7. Offre avec justification du prix.
8. Garantie ou réassurance.
9. FAQ d'au moins 10 questions.
10. CTA final avec urgence si réelle (jamais inventée).

**ÉTAPE 3 — Proposition**
Présenter : structure longue complète · textes · placement CTA et preuves. Attendre validation.

**ÉTAPE 4 — Implémentation**
Page longue, plusieurs CTA répartis : Hero → problème → agitation → solution → bénéfices → preuves → offre + prix → garantie → FAQ → CTA final.

---

### `lp-squeeze` — Squeeze Page

**Rôle :** Capture d'email ultra-épurée, zéro distraction.

**ÉTAPE 1 — Audit**
Analyser : offre échangée · source du trafic · distractions présentes · taux de conversion si disponible.
Déterminer : promesse en une phrase · principal obstacle à l'inscription · ce qui peut être supprimé.

**ÉTAPE 2 — Rédaction**
Uniquement :
1. Titre choc < 10 mots.
2. Sous-accroche < 20 mots.
3. Libellé bouton < 5 mots.
4. Réassurance < 15 mots.

**ÉTAPE 3 — Proposition**
Présenter : maquette textuelle ultra-épurée · éléments à supprimer · positionnement formulaire. Attendre validation.

**ÉTAPE 4 — Implémentation**
UNIQUEMENT : titre + sous-accroche + champ email + bouton CTA + réassurance 1 ligne.
Règles absolues : aucun menu · aucun footer · aucun lien sortant · aucune image non indispensable.

---

### `lp-splash` — Splash Page

**Rôle :** Interception avant le site — annonce, choix, alerte.
**Brief requis :** contexte (lancement / langue / âge / annonce)

**ÉTAPE 1 — Audit**
Analyser : contexte d'affichage · message principal · comportement attendu · identité visuelle.
Déterminer : si la splash page est réellement justifiée · action unique demandée · temps maximum acceptable.

**ÉTAPE 2 — Rédaction**
Produire : message principal < 8 mots · sous-message < 15 mots si nécessaire · libellés CTA · lien de fermeture ("Passer").

**ÉTAPE 3 — Proposition**
Présenter : structure · justification · recommandations (durée, cookie "ne plus afficher"). Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : premier chargement uniquement → visuellement impactante mais non bloquante → texte minimum → accès rapide au site → non indexée par les moteurs.

---

### `lp-webinar` — Webinar / Event

**Rôle :** Inscription à un événement avec urgence et programme.
**Brief requis :** date + heure + intervenants + programme

**ÉTAPE 1 — Audit**
Analyser : type d'événement · date, heure, fuseau · intervenants · programme · outils d'inscription.
Déterminer : argument principal pour s'inscrire · obstacles à l'inscription · urgence réelle.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre orienté résultat ou transformation.
2. Sous-accroche posant le problème résolu.
3. Ce que l'utilisateur saura faire après l'événement.
4. Présentation de chaque intervenant (autorité + crédibilité).
5. Programme session par session.
6. Informations pratiques (date, heure, durée, plateforme).
7. Bloc urgence si justifié (réel, jamais inventé).
8. FAQ de 5 à 7 questions.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · recommandations compte à rebours. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : Hero (titre + date + CTA) → compte à rebours → ce que tu vas apprendre → intervenants → programme → infos pratiques → urgence → formulaire → FAQ.

---

### `lp-thank-you` — Thank You Page

**Rôle :** Confirmation post-action + prochaine étape + upsell.

**ÉTAPE 1 — Audit**
Analyser : action venant d'être complétée · prochaine étape dans le tunnel · opportunités d'upsell · ton de la marque.
Déterminer : ressenti de l'utilisateur à cet instant · prochaine action logique · upsell approprié.

**ÉTAPE 2 — Rédaction**
Produire :
1. Message de confirmation chaleureux et humain.
2. Confirmation claire de ce qui se passe ensuite.
3. Invitation à une prochaine action.
4. CTA secondaire.
5. Réassurance si paiement impliqué.

**ÉTAPE 3 — Proposition**
Présenter : structure · textes · upsell recommandé. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : confirmation humaine → récapitulatif de ce qui a été obtenu → prochaine étape concrète → upsell ou contenu bonus → CTA secondaire → liens réseaux ou communauté.
Règle : ne jamais traiter cette page comme une simple confirmation vide.

---

### `lp-launch` — Product Launch

**Rôle :** Lancement produit avec waitlist, hype et exclusivité.
**Brief requis :** date de lancement + mécanisme de waitlist + éléments de rareté réels

**ÉTAPE 1 — Audit**
Analyser : produit lancé (fonctionnalités, positionnement, différenciation) · date prévue · mécanisme de waitlist · audience cible · concurrents.
Déterminer : promesse centrale · ce que l'utilisateur perd s'il n'est pas parmi les premiers · éléments de rareté réels (jamais inventés).

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre annonçant la transformation (pas le nom du produit).
2. Sous-accroche décrivant le problème résolu.
3. Problème actuel vécu par la cible.
4. Solution présentée comme révélation.
5. 4 à 6 fonctionnalités clés traduites en bénéfices.
6. Offre de lancement + avantages exclusifs.
7. Mécanisme de waitlist (ce que l'inscription donne concrètement).
8. FAQ de 7 à 10 questions.
9. Compte à rebours si date fixée.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · recommandations mécanique d'urgence. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : Hero + CTA waitlist → compte à rebours → problème → solution → fonctionnalités → offre de lancement → formulaire waitlist → témoignages bêta si disponibles → FAQ → CTA final.

---

### `lp-pricing` — Pricing Page

**Rôle :** Conversion vers un plan d'abonnement ou d'achat.
**Brief requis :** plans disponibles + fonctionnalités par plan

**ÉTAPE 1 — Audit**
Analyser : plans et tarifs existants · fonctionnalités par plan · concurrents · objections liées au prix.
Déterminer : plan à mettre en avant (plus rentable) · freins psychologiques · positionnement du plan gratuit ou essai · ancrage de prix.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre value-first (pas "Nos tarifs").
2. Sous-titre expliquant la logique de prix.
3. Noms et descriptions de chaque plan.
4. Libellé CTA pour chaque plan.
5. Justification du plan recommandé.
6. FAQ de 7 à 10 questions (prix, engagements, remboursements).
7. Bloc de réassurance.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes de chaque plan · hiérarchie visuelle. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : titre + sous-titre → toggle mensuel/annuel si applicable → tableau de plans → plan recommandé mis en avant → CTA par plan → réassurance → FAQ → preuves sociales.

---

### `lp-portfolio` — Portfolio / Crédibilité

**Rôle :** Établir la confiance et l'expertise, déclencher le contact.

**ÉTAPE 1 — Audit**
Analyser : profil de la personne ou agence · réalisations disponibles · témoignages · services proposés · canal d'acquisition.
Déterminer : promesse implicite · preuves les plus convaincantes · ce que le visiteur doit ressentir · action souhaitée.

**ÉTAPE 2 — Rédaction**
Produire :
1. Accroche personnelle forte (pas un titre générique).
2. Bio courte axée sur valeur apportée (pas parcours chronologique).
3. Domaines d'expertise avec preuves concrètes chiffrées.
4. 3 à 5 études de cas avec résultats mesurables.
5. Témoignages (problème → solution → résultat).
6. Services proposés avec leur valeur.
7. CTA de contact clair.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · recommandations visuelles. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : Hero personnel → bio value-first → réalisations et études de cas → témoignages → services → logos clients → CTA contact.

---

### `lp-404` — Page 404

**Rôle :** Récupérer le visiteur perdu, suggestions utiles, ton de marque.

**ÉTAPE 1 — Audit**
Analyser : ton de la marque · pages importantes du site · présence d'un moteur de recherche interne · raisons probables d'arriver sur une 404.
Déterminer : si le ton peut intégrer de l'humour · 3 à 5 pages de secours · besoin d'une barre de recherche.

**ÉTAPE 2 — Rédaction**
Produire :
1. Message d'erreur humanisé (jamais "404 - Page non trouvée").
2. Explication simple de ce qui s'est passé.
3. Suggestions de pages utiles avec libellés.
4. CTA principal (retour accueil ou page clé).
5. Message de marque cohérent avec le ton.

**ÉTAPE 3 — Proposition**
Présenter : structure · textes · recommandations design. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : message humanisé → explication courte → 3 à 5 liens vers pages importantes → barre de recherche si disponible → CTA retour accueil → visuel cohérent.
Règle : retourner HTTP 404 · ne jamais afficher uniquement le code d'erreur brut.

---

### `lp-mod-short` — ⚡ Modificateur Short-form

⚠️ Ce n'est pas un type autonome — c'est un modificateur. Ajouter ces contraintes avant l'ÉTAPE 4 de n'importe quel prompt landing page.

**Contraintes :** max 3 sections above the fold · un seul CTA visible sans scroll · supprimer toute section non indispensable · aucune FAQ si pas strictement nécessaire · titres < 10 mots, blocs < 50 mots · temps de lecture cible < 90 secondes.

**Cible :** audience chaude, produit simple, décision rapide.
**Ne pas utiliser sur :** audience froide, produit complexe ou cher.

---

### `lp-mod-long` — 📜 Modificateur Long-form

⚠️ Ce n'est pas un type autonome — c'est un modificateur. Ajouter ces contraintes avant l'ÉTAPE 4 de n'importe quel prompt landing page.

**Contraintes :** minimum 7 sections distinctes · CTA répété tous les 2 à 3 blocs · traiter chaque objection possible · preuves multiples (témoignages, chiffres, études de cas) · chaque bénéfice développé avec exemple concret · temps de lecture cible : 5 à 10 minutes.

**Cible :** audience froide, produit complexe ou cher, première interaction.
**Ne pas utiliser sur :** audience déjà décidée, produit simple à bas prix.

---
---

