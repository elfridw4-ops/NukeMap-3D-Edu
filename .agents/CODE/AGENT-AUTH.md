---
agent: AGENT-AUTH
commande: prompt:auth
role: agent-prompt-module
module: authentification
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - page de connexion auth-login
  - page d'inscription auth-register
  - mot de passe oublié auth-forgot
  - vérification email auth-verify
  - flux oauth et sso
action: Module de prompts spécialisés pour concevoir et implémenter les flux d'authentification et de gestion de compte sécurisés
---

# MODULE — Authentification
> Charger AGENT-CORE.md avant ce module.
## 4. AUTHENTIFICATION

---

### `auth-login` — Page Connexion

**Rôle :** Accès rapide au compte, réduction de la friction, récupération en cas d'oubli.

**ÉTAPE 1 — Audit**
Analyser : méthodes de connexion disponibles (email/password, SSO, magic link, OAuth) · erreurs fréquentes · page de redirection post-connexion · lien de récupération.
Déterminer : méthodes à prioriser · message d'erreur (sans révéler si email existe) · redirection vers page précédente.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre de la page.
2. Libellés des champs et placeholders.
3. Libellé du bouton de connexion.
4. Lien "Mot de passe oublié".
5. Lien vers l'inscription.
6. Libellés des méthodes OAuth si applicables.
7. Messages d'erreur (jamais révéler l'existence d'un compte).

**ÉTAPE 3 — Proposition**
Présenter : structure complète · méthodes d'authentification et ordre · messages d'erreur. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : OAuth en priorité si disponible → lien mot de passe oublié visible → jamais révéler si email enregistré dans les erreurs → autofill navigateur supporté → toggle visibilité mot de passe.

---

### `auth-register` — Page Inscription

**Rôle :** Créer un compte avec le minimum de friction, poser les bases de la rétention.

**ÉTAPE 1 — Audit**
Analyser : champs demandés et leur nécessité réelle · méthodes disponibles · taux d'abandon si disponible · flux post-inscription.
Déterminer : champs strictement nécessaires · champs à reporter après la première connexion · méthode à privilégier · flux post-inscription.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre de la page.
2. Sous-accroche rappelant la valeur du produit.
3. Libellés des champs et contraintes de validation.
4. Libellé du bouton de création.
5. Texte de consentement (CGU, newsletter).
6. Lien vers la connexion.
7. Message post-inscription.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · champs retenus avec justification · flux post-inscription. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : minimum de champs (email + mot de passe = suffisant) → validation temps réel → règles mot de passe progressives → consentement CGU non pré-coché → redirection onboarding ou dashboard.

---

### `auth-forgot` — Page Mot de passe oublié

**Rôle :** Récupération rapide sans frustration, sécurité sans friction excessive.

**ÉTAPE 1 — Audit**
Analyser : flux de récupération actuel · étapes complètes · messages affichés · délai d'expiration du lien.
Déterminer : message si l'email n'existe pas (ne jamais le révéler) · instructions claires par étape · comportement si lien expiré.

**ÉTAPE 2 — Rédaction**
Produire :
1. Titre et instruction de la page initiale.
2. Message de confirmation d'envoi (même si email n'existe pas).
3. Objet et contenu de l'email de récupération.
4. Titre et instructions de la page nouveau mot de passe.
5. Message de succès après réinitialisation.
6. Message si lien expiré.

**ÉTAPE 3 — Proposition**
Présenter : flux complet en 4 étapes · textes de chaque étape · cas limites. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : même message que l'email existe ou non → lien à usage unique → durée d'expiration affichée clairement → redirection vers connexion après réinitialisation → bouton "Renvoyer" si lien expiré.

---

### `auth-verify` — Page Vérification email

**Rôle :** Valider l'adresse email, débloquer l'accès, réduire la frustration d'attente.

**ÉTAPE 1 — Audit**
Analyser : flux de vérification actuel · accès avant/après vérification · délai d'expiration · gestion des renvois.
Déterminer : accès limité vs bloqué total avant vérification · nombre maximum de renvois · message pour les spams.

**ÉTAPE 2 — Rédaction**
Produire :
1. Message d'attente post-inscription.
2. Instructions pour trouver l'email (spam, alias).
3. Libellé du bouton de renvoi.
4. Message de confirmation après clic sur le lien.
5. Message si lien expiré.

**ÉTAPE 3 — Proposition**
Présenter : structure de la page d'attente · messages par état · recommandations pour maximiser le taux de vérification. Attendre validation.

**ÉTAPE 4 — Implémentation**
Contenu : adresse email rappelée → instructions spams → renvoi avec délai anti-spam → confirmation claire post-vérification → redirection onboarding.

---

### `auth-onboarding` — Onboarding

**Rôle :** Amener l'utilisateur au premier succès le plus vite possible.

**ÉTAPE 1 — Audit**
Analyser : aha moment du produit · étapes actuelles de l'onboarding · données nécessaires pour personnaliser · taux de complétion si disponible · points de friction.
Déterminer : nombre minimal d'étapes pour atteindre le aha moment · questions de personnalisation (max 3) · ce qui peut être reporté · type de progression.

**ÉTAPE 2 — Conception**
Produire :
1. Étapes de l'onboarding dans l'ordre optimal.
2. Questions à poser et leur ordre.
3. Aha moment cible et chemin pour y mener.
4. Message de bienvenue personnalisé.
5. Possibilité de passer certaines étapes (skip).
6. Résumé ou confirmation de fin.

**ÉTAPE 3 — Proposition**
Présenter : flux complet étape par étape · textes de chaque étape · recommandations pour réduire l'abandon. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : maximum 5 étapes (idéalement 3) → progression visible → étapes optionnelles skippables → première action concrète et visible → jamais bloquer l'accès indéfiniment → relançable depuis les paramètres.

---
---

