---
agent: TEST-BILLING-FEDAPAY
commande: billing:test
commandes_secondaires:
  - fedapay:test
declencheurs:
  - plan de test facturation
  - test webhook fedapay
  - simulation double webhook
  - idempotence paiement
action: Matrice de scénarios de tests pour la facturation et les webhooks de paiement (idempotence, retours Sandbox)
---

# PLAN DE TEST BILLING — FedaPay / Kkiapay / Mobile Money (Bénin)

## SETUP (30 min)
1. Compte FedaPay en mode SANDBOX (jamais live pour les tests)
2. Vérifier que la clé API utilisée par l'app est bien la clé TEST
   (pk_test_/sk_test_ — une clé live en recette = argent réel perdu)
3. Endpoint webhook pointé vers l'environnement de test
4. Compte test dédié : test+[date]@domaine.com
5. [CRITIQUE] Vérifier la signature des webhooks FedaPay côté serveur.
   Sans vérification de signature, n'importe quelle requête POST peut
   s'auto-créditer un abonnement premium. Test : envoyer un faux webhook
   → l'app DOIT le rejeter.

## MATRICE DE SCÉNARIOS
| # | Scénario | Résultat attendu | ✅/❌ |
|1| Paiement MTN MoMo réussi | Webhook transaction.approved → accès débloqué ||
|2| Paiement Moov Money réussi | Idem — tester CHAQUE méthode séparément ||
|3| Paiement carte bancaire | Idem (frais différents — vérifier marge réelle, cf. Agents_Integration_Fedapay.md §18) ||
|4| Transaction expirée (client n'a jamais validé sur son tel) | Pas d'accès, pas de compte "fantôme" premium ||
|5| Webhook perdu (couper le endpoint) | Mécanisme de resync ou retry ? Sinon CRITIQUE ||
|6| Double webhook (FedaPay renvoie 2x) | Idempotence : accès créé UNE fois, pas de double crédit ||
|7| Renouvellement échoué (solde insuffisant) | Dunning : combien de relances avant coupure ? ||
|8| Downgrade de plan | Données conservées ? Période de grâce ? (cf. chemin de downgrade) ||
|9| Payout vers tiers (si marketplace) | Fonction Payout activée sur le compte ? — JAMAIS par défaut, activation sur demande support FedaPay ||

## RED FLAGS LOCAUX
- Prix affiché en FCFA mais frais FedaPay non déduits du calcul de marge
  (frais par méthode et palier → §18 du fichier d'intégration, jamais estimés)
- Pas de gestion du délai réseau Mobile Money : l'utilisateur valide sur son
  téléphone, le webhook arrive 2 min plus tard — que voit-il entre-temps ?
- Prix HT affiché à des non-assujettis (TVA 18%) — litige garanti
