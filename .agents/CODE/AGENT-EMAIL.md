---
agent: AGENT-EMAIL
commande: prompt:email
role: agent-prompt-module
module: emails-transactionnels
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - email de bienvenue email-welcome
  - réinitialisation mot de passe email-reset
  - notification d'activité email-notif
  - confirmation de commande email-receipt
action: Module de prompts spécialisés pour la conception et rédaction de templates d'emails transactionnels orientés délivrabilité
---

# MODULE — Emails Transactionnels
> Charger AGENT-CORE.md avant ce module.
## 6. EMAILS TRANSACTIONNELS

---

### `email-welcome` — Email de bienvenue

**Rôle :** Première impression post-inscription, orientation vers le premier succès.

**ÉTAPE 1 — Audit**
Analyser : email existant · aha moment du produit · actions prioritaires post-inscription · ton de la marque.

**ÉTAPE 2 — Rédaction**
Produire : objet (<50 caractères) · pré-header distinct de l'objet · salutation personnalisée · message de bienvenue humain · 1 à 3 prochaines étapes concrètes · CTA principal · signature.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · textes · recommandations deliverability. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : envoi dans les 5 minutes → UN seul CTA → pas de vente ou upsell → personnalisation prénom → ratio texte/image favorable à la délivrabilité.

---

### `email-order` — Email confirmation de commande

**Rôle :** Rassurer immédiatement après l'achat, fournir les informations essentielles.

**ÉTAPE 1 — Audit**
Analyser : données disponibles à l'envoi · email existant · opportunités de cross-sell discrètes.

**ÉTAPE 2 — Rédaction**
Produire : objet avec numéro de commande · confirmation chaleureuse · récapitulatif produits · informations de livraison · prochaines étapes · contact SAV.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · données dynamiques à injecter · cross-sell si applicable. Attendre validation.

**ÉTAPE 4 — Implémentation**
Envoi immédiat · numéro de commande dans l'objet · récapitulatif produits avec images · délai de livraison estimé · lien de suivi.

---

### `email-reset` — Email réinitialisation mot de passe

**Rôle :** Sécurité, rapidité, clarté des instructions.

**ÉTAPE 1 — Audit**
Analyser : flux de récupération · durée de validité du lien · informations de sécurité à communiquer.

**ÉTAPE 2 — Rédaction**
Produire : objet rassurant · corps explicatif (tu as demandé / si ce n'est pas toi) · CTA bouton réinitialisation · durée d'expiration visible · contact en cas de problème.

**ÉTAPE 3 — Proposition**
Présenter : structure · traitement du cas "je n'ai pas demandé ça". Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : envoi en 2 minutes → lien à usage unique → durée d'expiration affichée → aucun autre CTA → mention contact sécurité si non demandé par l'utilisateur.

---

### `email-cart` — Email relance panier abandonné

**Rôle :** Récupérer un acheteur qui n'a pas finalisé, lever l'objection de dernière minute.

**ÉTAPE 1 — Audit**
Analyser : produits abandonnés et prix · délai depuis l'abandon · raisons probables · séquence existante.
Déterminer : nombre d'emails dans la séquence (1 à 3 max) · délai entre chaque (1h / 24h / 72h) · réduction applicable au 3e email uniquement.

**ÉTAPE 2 — Rédaction**
Pour chaque email de la séquence : objet + corps + CTA + ton progressif (rappel → urgence légère → offre).

**ÉTAPE 3 — Proposition**
Présenter : séquence complète avec timing · textes de chaque email · conditions de déclenchement. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : produits avec image → CTA direct vers panier → arrêt si commande finalisée → jamais offrir une réduction dès le premier email.

---

### `email-newsletter` — Newsletter

**Rôle :** Maintenir la relation, apporter de la valeur, déclencher des visites et conversions.

**ÉTAPE 1 — Audit**
Analyser : template existant · fréquence d'envoi · taux d'ouverture et de clic · type de contenu envoyé.

**ÉTAPE 2 — Conception**
Proposer : structure du template · contenu principal et secondaire · CTA · ratio valeur/promotion recommandé (80/20) · éléments de personnalisation.

**ÉTAPE 3 — Proposition**
Présenter : structure du template · sections récurrentes · recommandations deliverability. Attendre validation.

**ÉTAPE 4 — Implémentation**
Objet testé A/B · pré-header distinct · valeur éditoriale avant tout CTA commercial · lien de désabonnement visible · structure responsive.

---

### `email-invoice` — Email facture

**Rôle :** Document officiel, conformité légale, clarté comptable.

**ÉTAPE 1 — Audit**
Analyser : mentions légalement requises · format actuel · données dynamiques disponibles (client, produits, TVA, numéro séquentiel).

**ÉTAPE 2 — Conception**
Identifier : mentions légales obligatoires selon juridiction · structure du détail de facturation · format d'envoi (PDF en pièce jointe obligatoire).

**ÉTAPE 3 — Proposition**
Présenter : structure de l'email d'envoi + structure de la facture PDF · mentions légales identifiées. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : PDF en pièce jointe (jamais seulement en corps d'email) → toutes mentions légales obligatoires → numéro séquentiel → téléchargement disponible depuis l'espace client.

---
---

