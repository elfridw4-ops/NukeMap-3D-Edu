# PLAN DE TEST BILLING — exécutable en ~2h

## SETUP (15 min)
1. Stripe Dashboard → mode TEST (jamais en live pour les tests)
2. Créer un Test Clock (Billing → Test clocks) → fige le temps
3. stripe listen --forward-to localhost:XXXX/webhook (Stripe CLI)
4. Compte test : test+[date]@tondomaine.com

## MATRICE DE SCÉNARIOS (chaque ligne = 1 test, cocher le résultat)
| # | Scénario | Carte test | Résultat attendu | ✅/❌ |
|1| Abonnement standard | 4242 4242 4242 4242 | Souscription + webhook invoice.paid + accès débloqué ||
|2| Échec de paiement au renouvellement | 4000 0000 0000 0341 | Dunning déclenché, compte pas coupé immédiatement ||
|3| Carte refusée au signup | 4000 0000 0000 0002 | Message d'erreur clair, PAS de compte créé ||
|4| Authentification 3DS | 4000 0025 0000 3155 | Challenge 3DS affiché puis activé ||
|5| Fin d'essai gratuit | 4242…+ avancer le Test Clock de 14j | Conversion payante OU downgrade propre ||
|6| Upgrade mid-cycle | — | Prorata calculé correctement ||
|7| Downgrade mid-cycle | — | Effet à la fin de période, pas immédiat ||
|8| Résiliation | — | Accès conservé jusqu'à fin de période + email confirmation ||
|9| Remboursement | — | Permissions retirées, statut compte cohérent ||
|10| Webhook perdu (simuler en coupant stripe listen) | — | Rattrapage : Stripe réessaie, ou job de resync ? ||

## RED FLAGS À CHERCHER (les classiques qui coûtent cher)
- L'accès premium dépend d'une redirection front-end et non du webhook →
  contournable en spoofant la redirection. CRITIQUE.
- Pas de vérification de signature sur les webhooks → n'importe qui peut
  s'offrir un abonnement avec une requête POST. CRITIQUE.
- customer.subscription.deleted non géré → utilisateurs payants sans accès
  au renouvellement raté. MAJEUR.
- Aucun dunning → échecs de paiement = churn involontaire silencieux
  (représente 20-40% du churn SaaS). MAJEUR.

## PAYPAL / FEDAPAY
Même matrice, via leurs sandboxes respectives. Vérifier en priorité :
l'IPN/webhook de confirmation et la gestion des devises (XOF pour Fedapay).
