---
agent: Agents_Integration_Fedapay
commande: fedapay:integrate
skill: skill:fedapay
declencheurs:
  - intégration FedaPay
  - paiement Mobile Money MTN Moov Orange
  - cartes bancaires XOF
  - webhooks FedaPay
action: Intégration stricte et sécurisée de l'API et des webhooks FedaPay (Bénin et Afrique de l'Ouest)
---

## ⚙️ AGENT PROTOCOL — LIRE EN PREMIER, AVANT TOUT

Tu es un agent spécialisé FedaPay. Ce fichier est ta seule source de vérité.

RÈGLES ABSOLUES :
1. Lis ce document EN ENTIER avant de répondre ou de coder.
2. N'utilise QUE les informations de ce fichier.
3. Ne complète JAMAIS avec tes connaissances générales sur des outils similaires.
4. Si une information est absente → dis "absent du document" et arrête-toi.
5. Avant chaque bloc de code : cite la section du document qui justifie ce que tu vas écrire.
6. Si tu as un doute sur un paramètre → pose la question, cherche sur la docs officielle Fedapay https://docs.fedapay.com/api-reference/ , https://github.com/fedapay. N'invente pas.
7. FedaPay ≠ Stripe. 
8. Tout ce qui n'est pas dans ce fichier est INCONNU. Pas probable. Pas supposé. INCONNU. SAUF MENTION EXPLICITE DANS LA DOCUMENTATION OFFICIEL FEDAPAY.

CONFIRMATION OBLIGATOIRE :
Avant de commencer la tâche demandée, réponds uniquement :
"PROTOCOLE ACTIF — FEDAPAY. Prêt."

---

# AGENTS_INTEGRATION_FEDAPAY.md
# Document de grounding — À lire AVANT toute session d'intégration FedaPay

> **RÈGLE N°1 — ABSOLUE :**
> FedaPay N'EST PAS Stripe. Ne jamais appliquer les patterns Stripe à FedaPay.
> Tout ce qui n'est pas dans ce document doit être déclaré inconnu.
> Ne jamais inventer un paramètre, un endpoint, un comportement.

---

## 0. DIFFÉRENCES CRITIQUES FEDAPAY ≠ STRIPE

| Aspect | Stripe | FedaPay |
|--------|--------|---------|
| Montant | En centimes (`1000` = 10,00 €) | En entier XOF (`1000` = 1000 FCFA) |
| Devise | String `"usd"` | Objet `{ iso: "XOF" }` |
| Collect = encaissement | `PaymentIntent` | `Transaction` |
| Paiement sortant | `Transfer` / `Payout` (Stripe) | `Payout` ≠ même API |
| Webhook secret | `stripe.webhooks.constructEvent` | `Webhook.constructEvent` (fedapay) |
| Environnement | `"test"` / `"production"` | `"sandbox"` / `"live"` |
| Clé publique front | `pk_test_...` | `pk_sandbox_...` |
| Clé secrète back | `sk_test_...` | clé secrète du dashboard |
| `stripe.charges.create` | ✅ | ❌ N'existe pas |
| `stripe.paymentIntents` | ✅ | ❌ N'existe pas |

---

## 1. INFORMATIONS GÉNÉRALES

- **Société :** FedaPay — passerelle de paiement ouest-africaine
- **API type :** RESTful
- **Format données :** JSON
- **Devise principale :** XOF (Franc CFA BCEAO)
- **Régions couvertes :** Bénin, Togo, Côte d'Ivoire, Niger, Sénégal
- **Documentation officielle :** https://docs.fedapay.com

---

## 2. ENVIRONNEMENTS ET URLs

```
SANDBOX (test)  : https://sandbox-api.fedapay.com/v1
LIVE (prod)     : https://api.fedapay.com/v1
```

**Règle stricte :** Les objets créés en sandbox (clients, transactions, payouts) sont **totalement séparés** des objets live. Jamais de mélange.

---

## 3. AUTHENTIFICATION

### Type
Bearer token dans chaque requête.

```http
Authorization: Bearer YOUR_SECRET_KEY
```

### Types de clés
| Clé | Usage | Où |
|-----|-------|----|
| **Clé publique** (`pk_sandbox_...` ou `pk_live_...`) | Front-end uniquement (React SDK, Angular SDK) — actions limitées, créer tokens | Navigateur, React |
| **Clé secrète** | Back-end uniquement — accès complet à l'API | Node.js/Express côté serveur UNIQUEMENT |

> ⚠️ La clé secrète ne doit JAMAIS apparaître côté client (React, navigateur, mobile).
> ⚠️ Stocker dans variables d'environnement (`.env`). Ne jamais commiter.
> ⚠️ FedaPay ne demandera jamais votre clé secrète par email ou support.

### En cas de compromission
→ Régénérer immédiatement depuis le dashboard FedaPay.
→ Remplacer partout dans les intégrations avant de désactiver l'ancienne.

---

## 4. SDK NODE.JS

### Installation
```bash
npm install fedapay --save
```

### Initialisation (à faire une seule fois au démarrage du serveur)
```javascript
const { FedaPay, Transaction, Customer, Payout, Webhook, Event, Balance, Currency } = require('fedapay');

FedaPay.setApiKey("YOUR_SECRET_KEY");
FedaPay.setEnvironment('sandbox'); // ou 'live' en production
```

> ⚠️ `setEnvironment` accepte uniquement `'sandbox'` ou `'live'`.
> ❌ Ne pas utiliser `'test'`, `'production'`, `'development'`.

---

## 5. CUSTOMERS (Clients)

Un customer est lié à une transaction ou un payout. L'email est l'identifiant unique.

> ⚠️ Si le même email est envoyé avec des infos différentes (nom, prénom, téléphone), FedaPay **met à jour** le customer existant — il ne crée pas de doublon.

### Créer un customer
```javascript
const customer = await Customer.create({
  firstname: 'John',         // obligatoire
  lastname: 'Doe',           // obligatoire
  email: 'john@doe.com',     // obligatoire — identifiant unique
  phone_number: {            // optionnel mais recommandé
    number: '90090909',      // sans indicatif international ici
    country: 'BJ'            // code pays ISO 2 lettres, majuscules
  }
});
```

**Réponse :** objet customer avec `id` (integer).

### Autres opérations customers (SDK)
```javascript
// Récupérer un customer par ID
await Customer.retrieve(ID, params = {}, headers = {});

// Lister tous les customers
await Customer.all(params = {}, headers = {});

// Mettre à jour
await Customer.update(ID, { email: 'new@email.com' }, headers = {});

// Supprimer
await Customer.delete(ID, params = {}, headers = {});
```

### Endpoints REST (si pas de SDK)
```
POST   /v1/customers          → créer
GET    /v1/customers/{id}     → récupérer un
GET    /v1/customers          → lister
PUT    /v1/customers/{id}     → mettre à jour
DELETE /v1/customers/{id}     → supprimer
```
Header requis sur chaque appel : `Authorization: Bearer <clé_secrète>`

---

## 6. COLLECTS (Transactions — encaissements entrants)

Un Collect = recevoir de l'argent. Le flux est en **2 étapes obligatoires** :
1. Créer la transaction → obtenir un `id`
2. Générer le token de paiement → obtenir le lien ou déclencher sans redirection

### 6.1 Créer une transaction

**Endpoint :** `POST /v1/transactions`

```javascript
const transaction = await Transaction.create({
  description: 'Paiement commande #1234',  // obligatoire — string
  amount: 2000,                             // obligatoire — INTEGER (2000 FCFA, pas de centimes)
  currency: { iso: 'XOF' },               // obligatoire — objet, pas une string
  callback_url: 'https://monsite.com/callback',  // optionnel
  mode: 'mtn_open',                        // optionnel — méthode de paiement spécifique
  customer: { id: 1 },                     // optionnel — customer déjà créé
  custom_metadata: {}                      // optionnel — données personnalisées
});
// transaction.id → utiliser pour étape suivante
```

**Ou créer customer en même temps :**
```javascript
const transaction = await Transaction.create({
  description: 'Recharge boutique Delta',
  amount: 25000,
  currency: { iso: 'XOF' },
  customer: {
    firstname: 'Kofi',
    lastname: 'Mensah',
    email: 'kofi@boutique.bj',
    phone_number: { number: '+22997808080', country: 'bj' }
  }
});
```

**Réponse 201 :**
```json
{
  "id": 123,
  "reference": "...",
  "amount": 2000,
  "description": "...",
  "callback_url": "...",
  "status": "pending",
  "created_at": "2024-10-23T14:00:00Z",
  "updated_at": "2024-10-23T14:00:00Z"
}
```

### 6.2 Générer le token et lien de paiement (avec redirection)

**Endpoint :** `POST /v1/transactions/{id}/token`

```javascript
// cURL
// POST https://sandbox-api.fedapay.com/v1/transactions/{id}/token
// Header: Authorization: Bearer <token>

// Réponse :
{
  "token": "tok_xxx...",
  "url": "https://checkout.fedapay.com/pay/tok_xxx"
}
// → Rediriger le client vers "url"
```

> ⚠️ Le lien généré dirige le client vers la page de paiement FedaPay.
> ⚠️ Si `callback_url` défini, le client est redirigé après paiement vers :
> `https://monsite.com/callback?id=123&status=approved`
>
> **NE JAMAIS faire confiance au `status` dans le callback_url.**
> **Toujours vérifier le statut réel avec `GET /v1/transactions/{id}`.**

### 6.3 Paiement sans redirection (Mobile Money direct)

Disponible pour : MTN Bénin, Moov Bénin, Celtiis Bénin, MTN CI, Moov Togo, Mixx by Yas Togo, Airtel Niger, Free Sénégal.

```javascript
// Étape 1 : créer la transaction (voir 6.1)
const transaction = await Transaction.create({ ... });

// Étape 2 : générer le token
const tokenData = await transaction.generateToken();
const token = tokenData.token;

// Étape 3 : déclencher le paiement mobile
const mode = 'mtn_open'; // voir liste modes section 9
const phoneNumber = { number: '64000001', country: 'bj' }; // optionnel
await transaction.sendNowWithToken(mode, token, phoneNumber);
```

**Endpoint REST équivalent :**
```
POST /v1/transactions/{mode}
Body: { "token": "tok_xxx", "phone_number": { "number": "64000001", "country": "bj" } }
```

> ⚠️ `phone_number` est OPTIONNEL ici. Si absent, FedaPay utilise le numéro du customer lié à la transaction.

### 6.4 Statuts d'une transaction (cycle de vie)

```
pending   → statut par défaut à la création
approved  → paiement réussi
declined  → interruption volontaire ou accidentelle par le client
canceled  → solde insuffisant ou problème de paiement
refunded  → remboursé
```

### 6.5 Objet transaction complet (champs réponse)

```json
{
  "id": 123,
  "reference": "string",
  "amount": 2000,
  "description": "string",
  "callback_url": "string",
  "status": "pending|approved|declined|canceled|refunded",
  "customer_id": 1,
  "currency_id": 840,
  "mode": "string",
  "metadata": {},
  "commission": 0,
  "fees": 0,
  "fixed_commission": 0,
  "amount_transferred": 0,
  "amount_debited": 0,
  "receipt_url": "string",
  "payment_method_id": 1,
  "sub_accounts_commissions": [],
  "transaction_key": "string",
  "merchant_reference": "string",
  "account_id": 1,
  "balance_id": 1,
  "custom_metadata": {},
  "last_error_code": "string",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "approved_at": "ISO8601|null",
  "canceled_at": "ISO8601|null",
  "declined_at": "ISO8601|null",
  "refunded_at": "ISO8601|null",
  "transferred_at": "ISO8601|null",
  "deleted_at": "ISO8601|null"
}
```

### 6.6 Autres opérations transactions (SDK)

```javascript
await Transaction.retrieve(ID, params = {}, headers = {});  // GET une transaction
await Transaction.all(params = {}, headers = {});           // Lister toutes
await Transaction.update(ID, { description: 'new' }, headers = {}); // PUT
await Transaction.delete(ID, params = {}, headers = {});    // DELETE → 204
```

---

## 7. PAYOUTS (Dépôts — paiements sortants)

Un Payout = envoyer de l'argent depuis votre balance FedaPay vers un compte Mobile Money client.
Flux en **2 étapes obligatoires** :
1. Créer le payout → statut `pending`
2. Démarrer le payout (immédiatement ou planifié)

### 7.1 Créer un payout

**Endpoint :** `POST /v1/payouts`

```javascript
// Via cURL (le SDK Payout.create existe mais la doc montre surtout cURL)
curl -X POST https://sandbox-api.fedapay.com/v1/payouts \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "amount": 2000,
    "currency": { "iso": "XOF" },
    "mode": "mtn_open",
    "description": "Commission agent Mars 2025",
    "customer": {
      "firstname": "Koffi",
      "lastname": "Agbo",
      "email": "koffi@agent.bj",
      "phone_number": { "number": "+22997808080", "country": "bj" }
    },
    "merchant_reference": "PAY-20250315-001",
    "custom_metadata": {
      "agent_id": "AGT-0032",
      "mois": "Mars",
      "type": "commission"
    }
  }'
```

> ⚠️ `customer` est optionnel. Mais si fourni, l'email est unique — même logique que les Customers.
> ⚠️ `description` est optionnel côté API mais peut être requis dans le dashboard (traçabilité BCEAO).

### 7.2 Démarrer un payout

**Endpoint :** `PUT /v1/payouts/start`

```javascript
// Envoyer immédiatement
curl -X PUT https://sandbox-api.fedapay.com/v1/payouts/start \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "payouts": [
      { "id": 23 },
      { "id": 24, "phone_number": { "number": "66000001", "country": "BJ" } },
      { "id": 25, "scheduled_at": "2024-11-18 18:08:43" }
    ]
  }'
```

**Ou un seul payout (endpoint Start payout) :**
```
PUT /v1/payouts/start
Body:
{
  "id": 1,
  "scheduled_at": "2024-10-23T14:30:00Z",  // optionnel — sinon envoi immédiat
  "phone_number": { "number": "+22997808080", "country": "BJ" }  // optionnel
}
```

**Réponse 200 :**
```json
{
  "id": 1,
  "reference": "PAYOUT-123456",
  "amount": 1000,
  "status": "sent",
  "mode": "automatic",
  "last_error_code": "NO_ERROR",
  "amount_transferred": 935,
  "amount_debited": 1000,
  "scheduled_at": "2024-10-23T14:30:00Z",
  "sent_at": "2024-10-23T14:31:00Z"
}
```

### 7.3 Statuts d'un payout (cycle de vie)

```
pending    → créé, en attente d'envoi
started    → validé, envoi en cours de démarrage
processing → en cours de traitement vers le destinataire
sent       → envoyé avec succès
failed     → envoi échoué
```

### 7.4 merchant_reference sur les payouts

Identifiant propre à votre système, assigné à chaque payout.

```javascript
// Créer avec merchant_reference
// → champ dans le body du POST /v1/payouts
"merchant_reference": "PAY-20250315-002"

// Récupérer par merchant_reference (sans l'ID FedaPay)
GET /v1/payouts/merchant/PAY-20250315-002
```

### 7.5 custom_metadata sur les payouts

Données JSON libres associées à l'opération. Non chiffrées — ne pas y mettre de données sensibles.

```json
"custom_metadata": {
  "agent_id": "AGT-0032",
  "mois": "Juillet",
  "type": "commission",
  "boutique_id": "BOUT-007"
}
```

### 7.6 Objet payout complet (champs réponse)

```json
{
  "id": 1,
  "reference": "PAYOUT-123456",
  "amount": 1000,
  "status": "pending|started|processing|sent|failed",
  "customer_id": 1,
  "currency_id": 840,
  "mode": "string",
  "last_error_code": "string",
  "commission": 0,
  "fees": 0,
  "fixed_commission": 0,
  "amount_transferred": 935,
  "amount_debited": 1000,
  "metadata": {},
  "custom_metadata": {},
  "payment_method_id": 1,
  "transaction_key": "string",
  "merchant_reference": "string",
  "account_id": 1,
  "balance_id": 1,
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "scheduled_at": "ISO8601|null",
  "sent_at": "ISO8601|null",
  "failed_at": "ISO8601|null",
  "deleted_at": "ISO8601|null"
}
```

### 7.7 Autres opérations payouts (SDK)

```javascript
const { Payout } = require('fedapay');

await Payout.retrieve(ID, params = {}, headers = {});  // GET un payout
await Payout.all(params = {}, headers = {});            // Lister
await Payout.update(ID, params = {}, headers = {});     // PUT
await Payout.delete(ID, params = {}, headers = {});     // DELETE → 204
```

---

## 8. WEBHOOKS

FedaPay envoie un HTTP POST à votre URL à chaque événement.

### 8.1 Exigences serveur

- URL HTTPS obligatoire
- Certificat SSL valide
- TLS v1.2 ou v1.3 uniquement
- Répondre avec un statut `2xx` rapidement (avant traitements lourds)

### 8.2 Stratégie de retry

- Max **9 retries** si votre endpoint ne répond pas 2xx
- Intervalles exponentiels entre chaque retry (max 2 minutes)
- Après 10 échecs consécutifs → webhook **désactivé automatiquement**
- Redéclencher manuellement via : Dashboard → Logs → Re-déclencher
- Pour prévenir la désactivation auto : décocher "Désactiver le webhook lorsque l'application génère des erreurs"

### 8.3 Vérification de signature (Node.js)

```javascript
const { Webhook } = require('fedapay');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Secret du webhook : Workbench → Webhooks → Click to reveal
const endpointSecret = 'wh_sandbox...';

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-fedapay-signature'];  // en-tête de signature FedaPay

  let event;
  try {
    // Vérifie que le webhook vient bien de FedaPay et n'a pas été altéré
    event = Webhook.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traitement selon le type d'événement
  switch (event.name) {
    case 'transaction.created':
      // Transaction créée
      break;
    case 'transaction.approved':
      // Paiement réussi → créditer le compte, envoyer confirmation
      break;
    case 'transaction.canceled':
      // Annulé → libérer la réservation
      break;
    case 'transaction.declined':
      // Refusé par le client
      break;
    default:
      console.log(`Événement non géré : ${event.name}`);
  }

  // Répondre 200 immédiatement AVANT tout traitement lourd
  res.json({ received: true });
});

app.listen(4242);
```

> ⚠️ L'en-tête est `x-fedapay-signature` (minuscules en Express/Node).
> ⚠️ Utiliser `bodyParser.raw()` — pas `bodyParser.json()` — pour la vérification de signature.
> ⚠️ Chaque retry génère une nouvelle signature et un nouvel horodatage.

    En plus de la vérification de signature :
        - FedaPay recommande de filtrer les requêtes entrantes par IP whitelist (liste d'IP
  fournie dans le dashboard FedaPay, non publiée dans la doc publique).
        - Le header X-FEDAPAY-SIGNATURE embarque un timestamp qui fait partie du calcul de
  signature — rejeter tout webhook dont le timestamp est trop ancien (protection anti-
 rejeu). Chaque nouvelle tentative de retry génère une nouvelle signature/timestamp.

### 8.4 Liste des événements disponibles

| Événement | Déclencheur |
|-----------|------------|
| `transaction.created` | Transaction créée |
| `transaction.approved` | Paiement validé |
| `transaction.declined` | Paiement refusé/interrompu |
| `transaction.canceled` | Transaction annulée |
| `transaction.updated` | Statut modifié |
| `transaction.transferred` | Fonds transférés |
| `customer.created` | Nouveau client créé |
| `customer.updated` | Profil client modifié |
| `customer.deleted` | Client supprimé |

### 8.5 Bonnes pratiques webhooks

- Stocker les `id` des événements déjà traités → éviter les doublons (FedaPay peut envoyer le même événement plusieurs fois)
- Traitement **asynchrone** via une queue — ne jamais traiter en synchrone dans le handler
- Ne pas écouter "tous les événements" — choisir uniquement ceux utiles
- Répondre `200` **immédiatement**, traiter le contenu après

---

## 9. MÉTHODES DE PAIEMENT

> Source : docs.fedapay.com/payment-methods — vérifié le 13/09/2026. Remplace intégralement
> la version précédente (Niger/Sénégal/Burkina/Mali étaient marqués incertains — désormais
> documentés officiellement, et la Guinée est un nouveau pays absent de la version précédente).

### Collectes avec redirection

| Pays | Opérateurs |
|------|-----------|
| BÉNIN | MTN, Moov, Celtiis, BMO, Coris Money |
| TOGO | Mixx By Yas, Moov |
| GUINÉE | MTN |
| CÔTE D'IVOIRE | MTN, Moov, Wave, Orange |
| NIGER | Airtel |
| SÉNÉGAL | Wave, Orange, Free Sénégal |
| MALI | Orange |
| BURKINA FASO | Moov, Orange |
| TOUTES RÉGIONS | Visa/MasterCard |

### Collectes sans redirection

| Pays | Opérateurs |
|------|-----------|
| BÉNIN | MTN, Moov, Celtiis |
| TOGO | Moov, TogoCom |
| GUINÉE | MTN Guinée |
| CÔTE D'IVOIRE | MTN |
| NIGER | Airtel Niger |
| SÉNÉGAL | Free Sénégal |

### Dépôts / Payouts (tous sans redirection)

| Pays | Opérateurs |
|------|-----------|
| BÉNIN | MTN, Moov, Celtiis |
| TOGO | Moov, TogoCom |
| GUINÉE | MTN Guinée |
| CÔTE D'IVOIRE | MTN, Moov, Wave, Orange |
| SÉNÉGAL | Wave, Orange |
| BURKINA FASO | Moov, Orange |

> ⚠️ Niger et Mali : confirmés en Collecte, mais absents de la liste officielle des Payouts
> à ce jour de dernière verification 13/09/2026. Ne pas supposer qu'un payout y est possible sans vérification directe FedaPay.

### Noms de modes (valeurs à passer dans `mode`) — désormais documentés officiellement

| Opérateur | Mode string | Usage |
|-----------|------------|-------|
| MTN Bénin | `mtn_open` | Collect sans redirection + Payout |
| Moov Bénin | `moov` | Collect sans redirection + Payout |
| Celtiis Bénin | `sbin` | Collect sans redirection + Payout |
| Moov Togo | `moov_tg` | Collect sans redirection + Payout |
| TogoCom | `togocel` | Collect sans redirection + Payout |
| MTN Guinée | `mtn_open_gn` | Collect sans redirection + Payout |
| MTN Côte d'Ivoire | `mtn_ci` | Collect sans redirection + Payout |
| Moov Côte d'Ivoire | `moov_ci` | Payout uniquement (liste officielle) |
| Wave Côte d'Ivoire | `wave_ci` | Payout uniquement (liste officielle) |
| Orange Côte d'Ivoire | `orange_ci` | Payout uniquement (liste officielle) |
| Airtel Niger | `airtel_ne` | Collect sans redirection |
| Free Sénégal | `free_sn` | Collect sans redirection + Payout |
| Wave Sénégal | `wave_sn` | Payout uniquement (liste officielle) |
| Orange Sénégal | `orange_sn` | Payout uniquement (liste officielle) |
| Moov Burkina Faso | `moov_bf` | Payout |
| Orange Burkina Faso | `orange_bf` | Payout |

> ⚠️ "Payout uniquement (liste officielle)" signifie que docs.fedapay.com ne documente pas
> ce mode string pour un Collect no-redirect — pas que le Collect avec redirection est
> impossible (il l'est, via checkout, voir tableau "Collectes avec redirection" ci-dessus).
> Toujours tester en sandbox avant prod, la doc peut avoir des trous.

> ⚠️ La liste complète des strings de mode n'est pas exhaustivement documentée dans les fichiers fournis. Ne pas inventer de strings. Tester en sandbox pour confirmer.

---

## 10. TESTS EN SANDBOX

Mode de test Mobile Money : **`momo_test`**

| Numéro | Résultat |
|--------|---------|
| `64000001` | ✅ Paiement réussi |
| `66000001` | ✅ Paiement réussi |
| Tout autre numéro | ❌ Paiement échoué (simulé) |

> ℹ️ Les anciens modes sandbox spécifiques aux opérateurs (ex: `mtn_sandbox`) sont supprimés. Utiliser uniquement `momo_test` en sandbox.

---

## 11. SDK REACT.JS (Front-end)

Utilise la **clé publique** (`pk_sandbox_...` ou `pk_live_...`), jamais la clé secrète.

### Installation
```bash
npm install fedapay-reactjs --save
```

### Inclure le script CDN dans `public/index.html` (ou layout racine)
```html
<script src="https://cdn.fedapay.com/checkout.js?v=1.1.7"></script>
```

### Composant complet (deux modes : bouton modale + widget embarqué iframe)
```jsx
import React, { Component } from 'react';
import { FedaCheckoutButton, FedaCheckoutContainer } from 'fedapay-reactjs';

export default class FedaPayPayment extends Component {
  PUBLIC_KEY = 'pk_sandbox_XXXXXX'; // clé PUBLIQUE uniquement

  // Options pour le bouton de paiement (ouvre la modale FedaPay)
  checkoutButtonOptions = {
    public_key: this.PUBLIC_KEY,
    transaction: {
      amount: 1000,
      description: 'Paiement commande',
      currency: { iso: 'XOF' }
    },
    button: {
      class: 'btn btn-primary',
      text: 'Payer 1 000 FCFA'
    },
    onComplete(resp) {
      const FedaPay = window['FedaPay'];
      if (resp.reason === FedaPay.DIALOG_DISMISSED) {
        alert('Dialogue fermé');
      } else {
        alert('Transaction terminée : ' + resp.reason);
        console.log(resp.transaction);
      }
    }
  };

  // Options pour le widget iframe embarqué directement dans la page
  checkoutEmbedOptions = {
    public_key: this.PUBLIC_KEY,
    transaction: {
      amount: 1000,
      description: 'Paiement commande',
      currency: { iso: 'XOF' }
    }
  };

  render() {
    return (
      <div className="fedapay-container">
        {/* Mode A : Bouton modale */}
        <FedaCheckoutButton options={this.checkoutButtonOptions} />

        {/* Mode B : Widget embarqué */}
        <FedaCheckoutContainer
          options={this.checkoutEmbedOptions}
          style={{ height: 500, width: '100%', maxWidth: 500, backgroundColor: '#eee' }}
        />
      </div>
    );
  }
}
```

> ⚠️ **Sécurité** : `window['FedaPay']` doit être disponible — le script CDN doit être chargé avant l'interaction.
> ⚠️ **Cycle de vie React** : si le composant se démonte avant la fin de la transaction, prévoir un guard (`isMounted` ou cleanup `useEffect`).
> ⚠️ **Validation** : Le statut final doit TOUJOURS être confirmé côté serveur via le Webhook FedaPay (§8), jamais déduit uniquement du callback client `onComplete`.

### Ressources officielles React SDK
- GitHub : `fedapay-reactjs`
- Démo officielle : `reactsample` FedaPay

---

## 12. BALANCES

```javascript
const { Balance } = require('fedapay');

// Lister toutes les balances
const balances = await Balance.all(params = {}, headers = {});

// Récupérer une balance par ID
const balance = await Balance.retrieve(ID, params = {}, headers = {});
```

**Objet Balance :**
```json
{ "id": 1, "amount": 150000, "mode": "string", "account_id": 1, "created_at": "..." }
```

**Endpoints REST :**
```
GET /v1/balances       → toutes
GET /v1/balances/{id}  → une
```

---

## 13. EVENTS (Événements)

```javascript
const { Event } = require('fedapay');

await Event.all(params = {}, headers = {});
await Event.retrieve(ID, params = {}, headers = {});
```

**Endpoints REST :**
```
GET /v1/events       → tous
GET /v1/events/{id}  → un
```

---

## 14. LOGS

```javascript
const { Log } = require('fedapay');
await Log.all(params = {}, headers = {});
```

**Endpoint :** `GET /v1/logs`

---

## 15. GESTION DES ERREURS HTTP

| Code | Signification | Action |
|------|--------------|--------|
| `400` | Bad Request — paramètres mal formatés | Vérifier le body JSON |
| `401` | Unauthorized — mauvaise clé API | Vérifier la clé et l'environnement (sandbox vs live) |
| `404` | Not Found — URL incorrecte ou ressource inexistante | Vérifier l'URL et l'ID |
| `500` | Internal Server Error — erreur côté FedaPay | Contacter le support FedaPay si persiste |

**Format réponse d'erreur :** JSON avec message descriptif.

---

## 16. SÉCURITÉ DES CLÉS — RÈGLES ABSOLUES

1. Clé secrète → **variables d'environnement uniquement** (`.env`, secrets manager)
2. Jamais dans le code source, jamais dans Git, jamais dans un ticket ou email
3. Jamais dans une app mobile, un bundle JS front, un SDK distribué
4. Rotation périodique recommandée même sans incident
5. En cas de compromission : régénérer immédiatement → remplacer partout → désactiver l'ancienne

---

## 17. RÈGLES D'INTÉGRATION RECAP (pour l'agent IA)

```
✅ amount = INTEGER en FCFA (pas de centimes, pas de décimales)
✅ currency = objet { iso: 'XOF' } (pas une string)
✅ environnement = 'sandbox' ou 'live' (pas 'test', pas 'production')
✅ phone_number = objet { number: '...', country: 'BJ' } (pas une string)
✅ Collect = 2 étapes : create transaction → get token → redirect OU sendNowWithToken
✅ Payout = 2 étapes : create payout → start payout
✅ callback_url status NON FIABLE → toujours vérifier avec GET /transactions/{id}
✅ Clé publique = front (React SDK). Clé secrète = back (Node.js) uniquement.
✅ Webhook body = bodyParser.raw(), pas bodyParser.json()
✅ Webhook signature header = 'x-fedapay-signature'
✅ Test Mobile Money = mode 'momo_test', numéros 64000001 ou 66000001
✅ Même email customer → mise à jour du customer existant, pas doublon

❌ Ne JAMAIS utiliser les patterns Stripe
❌ Ne JAMAIS inventer un paramètre absent de ce document
❌ Ne JAMAIS faire confiance au status dans callback_url sans vérification API
❌ Ne JAMAIS exposer la clé secrète côté client
❌ Ne JAMAIS commiter une clé API dans Git
```

---

*Ce document est généré à partir de la documentation officielle FedaPay (juillet 2026).*
*Source : docs.fedapay.com — 30+ pages analysées.*
*À mettre à jour si FedaPay modifie son API.*

---

## 18. TARIFS (source : fedapay.com/pricing — juillet 2026)

> Pas de frais tant que vous ne recevez pas de paiement.

### Collectes (encaissements entrants) — pourcentage du montant

| Opérateur | Frais |
|-----------|-------|
| MTN Bénin | 1.80% |
| Moov Bénin | 1.80% |
| Celtiis | 1.80% |
| BMO | 4.00% |
| Coris Money | 4.00% |
| MasterCard | 3.60% |
| Visa | 3.60% |

> ⚠️ Changement confirmé le 13/09/2026 : Visa et MasterCard sont passés de 4.00% à 3.60%
> chacun (source : fedapay.com/pricing). Le reste des taux et les paliers Payout sont inchangés.

> ℹ️ Les frais sont configurables dans le dashboard : tu peux décider s'ils sont à la charge du **client** ou à la charge du **marchand**.

### Payouts (envoi d'argent depuis la balance) — frais fixes par tranche

| Tranche montant (XOF) | Frais fixes |
|----------------------|-------------|
| 0 → 10 000 | 150 XOF |
| 10 001 → 50 000 | 300 XOF |
| 50 001 → 150 000 | 800 XOF |
| 150 001 → 500 000 | 2 000 XOF |
| 500 001 et plus | 2 500 XOF |

> ⚠️ **La fonctionnalité Payout est activée uniquement sur demande.**
> Contacter le support avant d'intégrer : support@fedapay.com ou chat du dashboard.
> Ne pas supposer qu'elle est active par défaut sur un nouveau compte.

### Retrait de la balance FedaPay (récupérer ses fonds)

| Canal | Frais |
|-------|-------|
| Par Mobile Money | **0 XOF** (frais inter-réseau possibles selon les opérateurs) |
| Par compte bancaire | **3 500 XOF** |

### Reversement des fonds

> Après un paiement reçu : reversement sur votre compte Mobile Money ou compte bancaire après **3 jours ouvrés**.

---

## 19. COUVERTURE GÉOGRAPHIQUE COMPLÈTE

> Source : docs.fedapay.com/payment-methods + fedapay.com/pricing — vérifié le 13/09/2026.

| Pays | Collectes | Payouts |
|------|-----------|---------|
| Bénin | ✅ | ✅ |
| Togo | ✅ | ✅ |
| Guinée | ✅ (nouveau, absent de l'ancienne version) | ✅ |
| Côte d'Ivoire | ✅ | ✅ |
| Niger | ✅ | ❌ non listé officiellement |
| Sénégal | ✅ | ✅ |
| Mali | ✅ (confirmé — n'était pas dans le tableau Collectes avant) | ❌ non listé officiellement |
| Burkina Faso | ✅ (confirmé) | ✅ (confirmé — était ❓ avant) |
| International | Visa/MasterCard | ❌ |

> Burkina Faso et Mali sont désormais dans la documentation API officielle des méthodes de
> paiement — ils n'y étaient pas au moment de la version précédente de ce fichier (ils
> n'apparaissaient alors que sur le site marketing). La Guinée est un ajout non couvert du
> tout par l'ancienne version.

---

## 20. NOTE SUR LES IMAGES NON ANALYSÉES

Les fichiers HTML fournis contenaient des images (captures d'écran du dashboard, diagrammes de cycle de vie, schémas d'intégration). Ces images n'ont pas été analysées — seul le texte HTML a été extrait.

Ce qui pourrait manquer à cause de ça :
- Diagrammes visuels des cycles de vie (transaction, payout)
- Captures du dashboard (où trouver les clés, configurer les webhooks)
- Schémas d'architecture d'intégration

**Impact sur ce document :** faible. Tout ce qui concerne les paramètres API, les endpoints, le code et les comportements est documenté en texte dans la doc officielle.

---

## 21. SDK ANGULAR (Front-end)

Utilise la **clé publique** uniquement. Jamais la clé secrète.

### Installation
```bash
npm install fedapay-angular --save
```

### Inclure le script dans `angular.json` (section `scripts`)
```json
"scripts": [
  "node_modules/fedapay-angular/dist/fedapay.js"
]
```

### Composant complet
```typescript
import { Component } from '@angular/core'
import { CheckoutOptions } from 'fedapay-angular'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Bouton de paiement
  checkoutButtonOptions: CheckoutOptions = {
    public_key: 'pk_sandbox_XXXXXX',  // clé PUBLIQUE uniquement
    transaction: {
      amount: 100,
      description: 'Airtime',
      currency: { iso: 'XOF' }
    },
    button: {
      class: 'btn btn-primary',
      text: 'Payer 100 FCFA'
    },
    onComplete(resp) {
      const FedaPay = window['FedaPay']
      if (resp.reason === FedaPay.DIALOG_DISMISSED) {
        alert('Vous avez fermé la boite de dialogue')
      } else {
        alert('Transaction terminée: ' + resp.reason)
        console.log(resp.transaction)
      }
    }
  }

  // Widget embarqué (sans bouton — iframe dans la page)
  checkoutEmbedOptions: CheckoutOptions = {
    public_key: 'pk_sandbox_XXXXXX',
    transaction: {
      amount: 100,
      description: 'Airtime',
      currency: { iso: 'XOF' }
    }
  }
}
```

> ⚠️ Vérifier que `window['FedaPay']` est chargé avant d'utiliser `onComplete`.
> ⚠️ Si le script n'est pas dans `angular.json` → `window['FedaPay']` sera `undefined`.

### Ressources officielles Angular SDK
- GitHub : `fedapay-angular`
- Démo en ligne : `angularsample` sur le domaine FedaPay

## 22. SDK PHP — COMPLET

> Source : `docs.fedapay.com/sdks/fr/php-fr`
> Compatible avec Laravel et Symfony.

### Installation
```bash
composer require fedapay/php
```

### Initialisation
```php
<?php
// Namespace complet obligatoire : \FedaPay\
\FedaPay\FedaPay::setApiKey("YOUR_SECRET_API_KEY");
\FedaPay\FedaPay::setEnvironment('sandbox'); // ou 'live'
```

> ⚠️ En PHP : toujours préfixer avec `\FedaPay\` (backslash namespace).
> ❌ `FedaPay::setApiKey(...)` → erreur (namespace manquant)
> ✅ `\FedaPay\FedaPay::setApiKey(...)` → correct
> ⚠️ La doc montre parfois `\FedaPay\Fedapay` (p minuscule) pour la config
>    et `\FedaPay\FedaPay` ailleurs — utiliser la casse exacte ci-dessus.

### Créer un customer
```php
<?php
\FedaPay\FedaPay::setApiKey("YOUR_SECRET_API_KEY");
\FedaPay\FedaPay::setEnvironment('sandbox');

\FedaPay\Customer::create(array(
  "firstname"    => "John",
  "lastname"     => "Doe",
  "email"        => "john.doe@gmail.com",
  "phone_number" => array(
    "number"  => "+22966666600",  // avec indicatif international
    "country" => "bj"             // code pays minuscules
  )
));
```

### Créer une transaction
```php
<?php
\FedaPay\FedaPay::setApiKey('YOUR_SECRET_API_KEY');
\FedaPay\FedaPay::setEnvironment('sandbox');

$transaction = \FedaPay\Transaction::create([
  'description'  => 'Payment for order #1234',
  'amount'       => 1000,              // INTEGER — pas de centimes
  'currency'     => ['iso' => 'XOF'], // objet, pas une string
  'callback_url' => 'https://example.com/callback',
  'mode'         => 'mtn_open',
  'customer'     => ['id' => 1]
]);
```

### Différences syntaxiques critiques PHP vs Node.js

| Action | Node.js | PHP |
|--------|---------|-----|
| Import | `const { FedaPay } = require('fedapay')` | `\FedaPay\FedaPay::` (namespace) |
| Config clé | `FedaPay.setApiKey('...')` | `\FedaPay\FedaPay::setApiKey('...')` |
| Config env | `FedaPay.setEnvironment('sandbox')` | `\FedaPay\FedaPay::setEnvironment('sandbox')` |
| Créer transaction | `await Transaction.create({...})` | `\FedaPay\Transaction::create([...])` |
| Tableau | `{ iso: 'XOF' }` objet JS | `['iso' => 'XOF']` tableau associatif |
| Async | `await` obligatoire | Synchrone — pas d'await |

> ⚠️ PHP SDK est synchrone. Pas de `async/await`, pas de Promises.
> ⚠️ phone_number en PHP inclut l'indicatif international (`+229`) dans `number`.

### Ressources officielles PHP SDK
- GitHub : `fedapay-php`
- Code démo : `php-sample`
- Démo en ligne : `phpsample` sur le domaine FedaPay

---

## 23. SDK RUBY — COMPLET

> Source : `docs.fedapay.com/sdks/fr/ruby-fr`
> Particulièrement utile pour les projets Ruby on Rails.

### Installation
```bash
gem install fedapay
```
Ou ajouter au `Gemfile` :
```ruby
gem 'fedapay'
```

### Initialisation
```ruby
require 'fedapay'

# Clé secrète backend uniquement — jamais côté client
FedaPay.api_key = 'YOUR_SECRET_API_KEY'
FedaPay.environment = 'sandbox'  # ou 'live'
```

### Créer un customer
```ruby
require 'fedapay'
FedaPay.api_key = 'YOUR_SECRET_API_KEY'
FedaPay.environment = 'sandbox'

# Définir le numéro de téléphone séparément pour la lisibilité
phone = { country: 'bj', number: '66000001' }

customer = FedaPay::Customer.create(
  firstname: 'firstname',
  lastname:  'lastname',
  email:     'email@test.com',
  phone_number: phone
)
```

### Créer une transaction
```ruby
require 'fedapay'
FedaPay.api_key = 'YOUR_SECRET_API_KEY'
FedaPay.environment = 'sandbox'

transaction = FedaPay::Transaction.create(
  amount:       1000,
  currency:     { iso: 'XOF' },
  customer:     { id: 1 },
  description:  'Payment for order #1234',
  callback_url: 'https://example.com/callback',
  mode:         'mtn_open'
)

puts "Transaction créée : #{transaction.inspect}"
```

### Récupérer une transaction
```ruby
transaction = FedaPay::Transaction.retrieve(ID)
```

### Différences syntaxiques critiques Ruby vs Node.js

| Action | Node.js | Ruby |
|--------|---------|------|
| Import | `const { FedaPay } = require('fedapay')` | `require 'fedapay'` |
| Config clé | `FedaPay.setApiKey('...')` | `FedaPay.api_key = '...'` |
| Config env | `FedaPay.setEnvironment('sandbox')` | `FedaPay.environment = 'sandbox'` |
| Namespace objet | `Transaction.create(...)` | `FedaPay::Transaction.create(...)` |
| String interpolation | `\`Texte ${var}\`` | `"Texte #{var}"` |

> ⚠️ En Ruby : toujours préfixer avec `FedaPay::` avant chaque classe (Transaction, Customer, Payout).
> ❌ `Transaction.create(...)` → erreur
> ✅ `FedaPay::Transaction.create(...)` → correct

### Ressources officielles Ruby SDK
- GitHub : `fedapay-ruby`
- Code démo : `ruby-sample`
- Démo en ligne : `rubysample` sur le domaine FedaPay

---

## 24. API REFERENCE — LANGAGES SUPPORTÉS (hors SDK)

L'interface API Reference de FedaPay propose des exemples de code dans ces langages via un dropdown :

| Langage | SDK dédié | Statut |
|---------|-----------|--------|
| JavaScript (cURL/fetch) | Node.js SDK | ✅ Documenté section 4 |
| PHP | PHP SDK | ✅ Section 22 — complet |
| Ruby | Ruby SDK | ✅ Section 23 — complet |
| cURL | Aucun SDK | ✅ Utilisé dans exemples REST |
| Python | ❌ Pas de SDK | Exemples API Reference uniquement |
| Go | ❌ Pas de SDK | Exemples API Reference uniquement |
| Java | ❌ Pas de SDK | Exemples API Reference uniquement |

> Python, Go et Java : FedaPay propose des exemples de requêtes dans l'API Reference
> mais **il n'existe pas de SDK officiel** pour ces langages.
> Pour les utiliser : appels HTTP directs avec Bearer token (voir endpoints REST sections 5-8).

