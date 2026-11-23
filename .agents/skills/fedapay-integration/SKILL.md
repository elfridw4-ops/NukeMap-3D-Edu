---
name: fedapay-integration
description: Intégration et audit des paiements FedaPay (Bénin, Togo, Côte d'Ivoire, Niger, Sénégal) via Mobile Money (MTN, Moov, Orange) et cartes bancaires. Gestion des transactions, vérification stricte de signature webhook, idempotence et encaissement en devises locales (XOF). Use when integrating or debugging FedaPay payments, webhooks, mobile money transactions, or African payment gateways.
argument-hint: "[action: setup|transaction|webhook|verify]"
license: Proprietary
metadata:
  author: protocole-core
  version: "1.0.0"
---

# Skill : FedaPay Payment Gateway Integration

Ce skill régit l'intégration, la sécurisation et le débogage de la passerelle de paiement ouest-africaine **FedaPay**.

> **Source de référence principale :**  
> Consulter le document d'atelier complet : [Agents_Integration_Fedapay.md](../../FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md).

---

## ⚡ DIFFÉRENCES CRITIQUES : FEDAPAY ≠ STRIPE

| Aspect | FedaPay | Stripe | Erreur courante à proscrire |
|---|---|---|---|
| **Montant** | En entier direct (`1000` = 1 000 FCFA) | En centimes (`1000` = 10,00 €) | Diviser ou multiplier par 100 |
| **Devise** | Objet `{ iso: "XOF" }` | Chaîne `"xof"` ou `"eur"` | Passer une simple string |
| **Encaissement** | `Transaction` | `PaymentIntent` | Utiliser des méthodes Stripe inexistantes |
| **Environnement** | `"sandbox"` ou `"live"` | `"test"` ou `"production"` | Utiliser `test` ou `prod` |
| **Clé publique** | `pk_sandbox_...` ou `pk_live_...` | `pk_test_...` | Confondre les préfixes |
| **Clé secrète** | Clé secrète du dashboard | `sk_test_...` | Exposer la clé secrète au frontend |

---

## 🛠️ FLUX TECHNIQUE STANDARD (MODÈLE D'INTÉGRATION)

> ⚠️ **Note sur les données d'exemple :** Les montants, numéros et adresses ci-dessous sont des **exemples illustratifs de test**. En production, aucune valeur métier ou secret ne doit être codé en dur : utiliser obligatoirement les variables d'environnement (`.env`) et les entrées dynamiques validées de l'utilisateur.

### 1. Initialisation Node.js / TypeScript
```javascript
const { FedaPay, Transaction } = require('fedapay');

// Les clés DOIVENT provenir des variables d'environnement (jamais en dur)
FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(process.env.NODE_ENV === 'production' ? 'live' : 'sandbox');
```

### 2. Création de Transaction
```javascript
async function createFedaPayPayment({ amount, description, customerEmail, customerPhone, customerCountry }) {
  // Montant en entier XOF (ex: 5000 pour 5000 FCFA — pas de centimes)
  const transaction = await Transaction.create({
    description: description,
    amount: Math.round(amount),
    currency: { iso: 'XOF' },
    callback_url: `${process.env.APP_URL}/api/payments/fedapay/callback`,
    customer: {
      email: customerEmail,
      phone_number: {
        number: customerPhone, // Ex. de test sandbox FedaPay Bénin : "90000001"
        country: customerCountry || 'bj' // Codes ISO : 'bj' (Bénin), 'ci' (Côte d'Ivoire), 'tg' (Togo), etc.
      }
    }
  });

  const token = await transaction.generateToken();
  return {
    transactionId: transaction.id,
    paymentUrl: token.url
  };
}
```

### 3. Traitement Sécurisé des Webhooks (Obligatoire)
> **RÈGLE DE SÉCURITÉ :** Ne JAMAIS faire confiance au statut reçu sans vérifier la signature HMAC ou re-vérifier la transaction directement auprès de l'API FedaPay (`Transaction.retrieve(id)`).

```javascript
const crypto = require('crypto');

function verifyFedaPayWebhook(req, endpointSecret) {
  const signature = req.headers['x-fedapay-signature'];
  if (!signature) {
    throw new Error('Signature FedaPay manquante');
  }

  // Calcul du HMAC SHA-256 sur le body brut (raw body Buffer/String)
  const hmac = crypto.createHmac('sha256', endpointSecret);
  const calculated = hmac.update(req.rawBody).digest('hex');

  if (calculated !== signature) {
    throw new Error('Signature webhook FedaPay invalide');
  }
}
```

### 4. Idempotence & TOCTOU
1. Vérifier si `transaction.id` a déjà été traité en base de données.
2. Utiliser une transaction SQL / opération atomique pour créditer le client une seule fois.
3. Toujours répondre `HTTP 200` rapidement à FedaPay pour acquitter la réception.

---

## 🧪 OUTILLAGE DU PROTOCOLE

- **Script de simulation webhook :** `.agents/tools/fedapay_test_webhook.js`
- **Plan de test facturation :** [TEST-BILLING-FEDAPAY.md](../../FINANCIAL_SYSTEME/TEST-BILLING-FEDAPAY.md)
