---
agent: AGENTS_INTEGRATION_BICTORYS
commande: bictorys:integrate
declencheurs:
  - intégration Bictorys
  - paiement Bictorys API
  - passerelle fiat/crypto Afrique
action: Intégration de l'API de paiement Bictorys (Sandbox, webhooks, checkout et sécurisation)
---

## PROTOCOLE AGENT — À LIRE AVANT TOUT

Tu es un agent spécialisé dans l’intégration de l’API Bictorys.

RÈGLES ABSOLUES :

1. Lis ce document avant de répondre, concevoir une architecture ou écrire du code.
2. Utilise d’abord les informations de ce document et les références officielles Bictorys indiquées à la fin.
3. Bictorys n’est ni Stripe ni FedaPay. Ne transpose jamais automatiquement leurs noms d’objets, leurs statuts, leurs SDK ou leurs flux.
4. Si une information n’est pas documentée ici ou dans la documentation officielle Bictorys, écris **INCONNU** ou **ABSENT DE LA DOCUMENTATION**.
5. Ne fabrique jamais un endpoint, un champ, une signature, un statut, un opérateur ou une limite.
6. Avant chaque bloc de code, identifie la section de ce document qui justifie le code.
7. Ne place jamais une clé privée, un secret webhook ou un code secret marchand dans une application frontend ou mobile.
8. Une URL de redirection ne constitue jamais une preuve suffisante de paiement. La décision métier doit reposer sur un webhook validé et sur la vérification de la commande.
9. Si deux pages officielles se contredisent, signale la contradiction et recommande un test Sandbox avant la production.
10. N’utilise aucune clé réelle présente dans les anciens exemples de la documentation. Remplace toujours les secrets par des placeholders.

CONFIRMATION DE PROTOCOLE :

Avant toute tâche d’intégration, répondre uniquement :

> PROTOCOLE ACTIF — BICTORYS. Prêt.

---

# AGENTS_INTEGRATION_BICTORYS.md

# Document de grounding — À lire avant toute session d’intégration Bictorys

> **Règle principale :** Bictorys possède ses propres objets, ses propres noms de champs et ses propres flux. Toute information absente doit être déclarée inconnue plutôt que déduite d’un autre prestataire.

---

## 0. DIFFÉRENCES CRITIQUES À NE PAS CONFONDRE

| Sujet | Bictorys | À ne pas supposer |
|---|---|---|
| Encaissement | `Charge` via `/pay/v1/charges` | `PaymentIntent` Stripe ou `Transaction` FedaPay |
| Retrait | `Payout` via `/pay/v1/payouts` | Un transfert Stripe ou un payout FedaPay |
| Authentification | Header `X-Api-Key` ou `X-API-Key` | Bearer token par défaut |
| Devise du guide principal | `"XOF"` | Montant en centimes |
| Montant | Entier en FCFA dans le guide d’intégration | Décimales ou minor units Stripe |
| Checkout | Appel de `/charges` sans `payment_type`, puis redirection | Création en deux objets `PaymentIntent` + `Checkout Session` |
| Direct API | `/charges?payment_type={type}` | SDK frontend universel supposé |
| Confirmation | Webhook validé, avec contrôle montant/devise/référence | Confiance aveugle dans le callback |
| Secret webhook | Secret distinct, envoyé dans `X-Secret-Key` | Clé privée API automatiquement réutilisable |
| Payout | Clé privée + `Idempotency-Key` + code secret marchand | Clé publique suffisante |
| Carte en Direct API | Certification PCI-DSS indiquée par la documentation | Collecte de carte libre sans contrainte |

Cette table est une règle de protection contre les hallucinations. Elle ne doit pas être interprétée comme une comparaison exhaustive de tous les PSP.

---

## 1. INFORMATIONS GÉNÉRALES

- **Société :** Bictorys.
- **Type de service :** infrastructure de paiement pour cartes et Mobile Money.
- **API :** REST, JSON et documentation avec définition OpenAPI sur plusieurs pages de référence.
- **Cas d’usage documentés :** encaissements, Checkout hébergé, Direct API, payouts, remboursements, factures, liens de paiement, clients, produits et consultation de transactions.
- **Zone documentée :** plusieurs pays d’Afrique de l’Ouest, avec des opérateurs qui dépendent du pays et de l’activation du marchand.
- **Documentation officielle :** `https://docs.bictorys.com`.
- **Dashboard :** `https://dashboard.bictorys.com`.

La documentation indique qu’un paiement peut concerner une facture, un lien de paiement, une commande en ligne, un terminal ou une intégration personnalisée.

---

## 2. ENVIRONNEMENTS ET URLS

```text
TEST / SANDBOX : https://api.test.bictorys.com
PRODUCTION      : https://api.bictorys.com
```

Préfixes de clés indiqués dans le guide d’intégration :

```text
TEST       : test_public-... ou test_secret-...
PRODUCTION : public-... ou secret-...
```

### Règles d’isolement

Les clés, transactions, webhooks et comportements Sandbox ne doivent pas être mélangés avec la production. Une URL webhook configurée en Test n’est pas automatiquement active en Production.

Le document de test Mobile Money précise que le Sandbox utilise un simulateur. Les applications réelles Wave, Orange Money, MTN ou autres ne doivent pas être utilisées avec le simulateur.

---

## 3. AUTHENTIFICATION ET CLÉS

### 3.1 Header général

```http
X-Api-Key: <votre_clé>
Content-Type: application/json
```

Bictorys indique que `X-Api-Key` et `X-API-Key` fonctionnent. Utilise une seule forme dans ton projet afin d’éviter les incohérences.

### 3.2 Les secrets à distinguer

| Secret | Usage documenté | Exposition autorisée |
|---|---|---|
| Clé publique | Créer des charges et vérifier le statut d’une transaction | Backend ; ne pas l’exposer inutilement |
| Clé privée | Payouts et lecture des moyens activés | Backend uniquement |
| Secret webhook | Valider les appels entrants Bictorys | Backend uniquement |
| Code secret marchand | Champ `merchant.secretCode` pour les payouts | Backend uniquement |

La documentation conseille de conserver les clés dans des variables d’environnement. Les anciennes pages de démonstration contiennent des valeurs qui ressemblent à des clés publiques : elles ne doivent jamais être copiées dans un projet.

### 3.3 Erreurs d’authentification

- `401` : clé absente, invalide ou authentification refusée.
- `403` : droits insuffisants, notamment si une clé publique est utilisée pour un payout.
- `403` HTML : la documentation signale qu’un WAF ou une limitation peut retourner du HTML au lieu du JSON.

---

## 4. ARCHITECTURE RECOMMANDÉE POUR FIREBASE ET PWA

```text
[PWA React / application mobile]
              |
              | HTTPS : créer une commande et demander un Checkout
              v
[Cloud Function ou API backend]
              |
              | Clé Bictorys côté serveur
              v
[Bictorys API]
              |
              | Webhook HTTPS avec secret
              v
[Cloud Function webhook]
              |
              | vérification + idempotence + rapprochement
              v
[Firestore : orders, payments, webhook_events]
```

### Séparation des responsabilités

Le frontend doit afficher un formulaire, créer une commande locale et rediriger vers `redirectUrl`. Il ne doit pas décider qu’une commande est payée.

Le backend doit appeler Bictorys, enregistrer `transactionId` et `paymentReference`, valider les webhooks, comparer `amount` et `currency`, puis changer le statut métier.

Firestore doit conserver au minimum :

```text
orders/{orderId}
- amount
- currency
- paymentReference
- bictorysTransactionId
- status: pending | paid | failed | reversed
- createdAt
- paidAt

webhook_events/{bictorysEventOrTransactionId}
- receivedAt
- rawPayload
- status
- processed
```

La structure exacte de Firestore est une recommandation d’architecture et non un schéma imposé par Bictorys.

---

## 5. CHARGES — ENCAISSEMENTS ENTRANTS

Une charge sert à collecter un paiement par Mobile Money ou carte bancaire. La documentation distingue principalement deux modes.

### 5.1 Checkout hébergé

**Endpoint :**

```http
POST {BICTORYS_API_URL}/pay/v1/charges
```

Le paramètre `payment_type` n’est pas fourni. Bictorys renvoie une URL de paiement hébergée, puis le client choisit son moyen de paiement.

**Usage recommandé :** première version d’un SaaS, boutique en ligne, PWA ou application qui ne veut pas gérer directement les informations sensibles de paiement.

### 5.2 Direct API

**Endpoint :**

```http
POST {BICTORYS_API_URL}/pay/v1/charges?payment_type={type}
```

La Direct API est présentée comme adaptée aux applications mobiles, aux intégrations TPE/POS et aux parcours où le marchand veut contrôler davantage l’expérience.

La documentation précise que le paiement carte en Direct API requiert une certification PCI-DSS. La contrainte concerne le paiement par carte ; elle ne doit pas être ignorée.

### 5.3 Payment types documentés

| Valeur | Moyen indiqué |
|---|---|
| `wave_money` | Wave |
| `orange_money` | Orange Money |
| `mtn_money` | MTN Money |
| `moov` | Moov Money |
| `togocell` | Togocell |
| `mobicash` | Mobicash |
| `maxit` | Maxit, indiqué pour le Sénégal |
| `card` | Visa ou Mastercard |

La disponibilité réelle dépend du pays, du compte marchand et des moyens activés. Ne déduis pas qu’un opérateur est disponible uniquement parce que sa valeur existe dans la liste.

### 5.4 Corps JSON documenté

```json
{
  "amount": 5000,
  "currency": "XOF",
  "country": "SN",
  "paymentReference": "ORDER-ABC123",
  "successRedirectUrl": "https://example.com/payment/success",
  "ErrorRedirectUrl": "https://example.com/payment/error",
  "customerObject": {
    "name": "Amadou Fall",
    "phone": "+221771234567",
    "email": "amadou@example.com",
    "country": "SN"
  },
  "otp": "123456"
}
```

### 5.5 Champs

| Champ | Type | Requis selon le guide | Règle |
|---|---|---:|---|
| `amount` | entier | Oui | Montant en FCFA, sans décimales ; minimum indiqué : 100 |
| `currency` | chaîne | Oui | `XOF` dans le guide principal |
| `country` | chaîne | Oui | Codes tels que `SN`, `CI`, `BK`, `ML`, `TG`, `BJ` |
| `paymentReference` | chaîne | Oui | Référence unique de la commande |
| `successRedirectUrl` | chaîne | Oui | URL HTTPS de retour après succès présumé |
| `ErrorRedirectUrl` | chaîne | Oui dans le guide | URL de retour après échec ; la casse est incohérente selon les pages |
| `customerObject` | objet | Recommandé | Informations du client |
| `otp` | chaîne | Seulement selon le flux | OTP Orange Money CI/BF selon le guide complet |

### 5.6 Format du téléphone

Le guide complet demande un numéro international sans espaces :

```text
Correct : +221771234567
Correct : +2250701234567
Incorrect : 221771234567
Incorrect : 771234567
Incorrect : +221 77 123 45 67
```

Le format s’applique aux charges et aux payouts. Le téléphone peut être facultatif pour certains moyens au Sénégal, notamment Wave, Orange Money et Maxit, selon le guide d’intégration.

### 5.7 Réponse documentée

```json
{
  "transactionId": "33e1c83b-7cb0-437b-bc50-a7a58e5660ad",
  "redirectUrl": "https://pay.bictorys.com/checkout/33e1c83b-...",
  "link": "https://pay.bictorys.com/link/...",
  "qrCode": "data:image/png;base64,...",
  "message": "Composez *144*82# pour valider..."
}
```

| Champ | Présence indiquée | Utilisation |
|---|---|---|
| `transactionId` | Toujours | Identifiant Bictorys à stocker |
| `redirectUrl` | Généralement | Redirection vers le Checkout |
| `link` | Selon l’opérateur | Deep link Wave ou page carte |
| `qrCode` | Selon l’opérateur | QR code Wave pour desktop/POS |
| `message` | Selon l’opérateur | Message USSD ou instruction de validation |

---

## 6. CHECKOUT — FLUX COMPLET

1. Créer une commande dans l’application avec le statut `pending`.
2. Appeler `POST /pay/v1/charges` sans `payment_type`.
3. Enregistrer `transactionId` et `paymentReference`.
4. Rediriger l’utilisateur vers `redirectUrl`.
5. Attendre le webhook Bictorys.
6. Vérifier l’identité de la commande, le montant et la devise.
7. Marquer la commande comme payée uniquement si le statut est `succeeded` ou le statut explicitement accepté par ton contrat métier.

La page Checkout ne permet pas, selon la documentation, une personnalisation complète de l’interface. Une intégration Iframe est mentionnée comme à venir dans une page ancienne ; sa disponibilité actuelle est **INCONNUE** et doit être vérifiée avant de la promettre.

### Filtrer la catégorie affichée

La page Checkout indique des paramètres pouvant être ajoutés à l’URL de redirection :

```text
&payment_category=card
&payment_category=mobile_money
```

Teste ces paramètres en Sandbox avant de les utiliser en production, car leur documentation est moins détaillée que celle de l’endpoint Charges.

---

## 7. DIRECT API ET CAS OPÉRATEURS

### 7.1 Wave

La réponse peut fournir un `link` pour ouvrir l’application Wave sur mobile. Sur desktop ou POS, elle peut fournir un `qrCode` à afficher pour scan.

### 7.2 Orange Money Côte d’Ivoire et Burkina Faso

Le guide complet décrit une étape OTP :

1. L’utilisateur compose `#144*82#` sur son téléphone.
2. Il reçoit un code OTP.
3. L’application envoie ce code dans le champ `otp`.
4. Bictorys renvoie un message USSD ou une instruction.
5. L’utilisateur valide sur son téléphone.
6. Le webhook confirme le statut final.

L’OTP expire rapidement selon le guide. L’interface doit permettre de régénérer le code sans obliger l’utilisateur à recommencer tout le formulaire.

### 7.3 Cartes bancaires

La carte est indiquée comme `card` et couvre Visa/Mastercard. La Direct API carte nécessite PCI-DSS selon la documentation. Pour une première version, privilégie le Checkout hébergé.

---

## 8. STATUTS ET CYCLE DE VIE

### 8.1 Statuts du guide d’intégration

| Statut | Signification | Action métier |
|---|---|---|
| `succeeded` | Paiement confirmé | Valider la commande après contrôles |
| `authorized` | Paiement autorisé, notamment carte | Traiter selon le contrat métier ; le guide recommande de l’assimiler à un succès |
| `pending` | Validation client attendue | Ne pas livrer |
| `processing` | Traitement en cours | Attendre le webhook final |
| `failed` | Paiement échoué | Marquer comme échoué |
| `cancelled` | Paiement annulé | Marquer comme échoué ou annulé |
| `reversed` | Paiement annulé ou remboursé après succès | Révoquer le bénéfice si nécessaire |

Une autre page de documentation utilise des libellés français tels que `initié`, `en attente`, `succès`, `échoué` et `expiré`, ainsi que l’événement `charge.successful`. Cette différence doit être considérée comme une incohérence de version ou de représentation. Le code doit normaliser les statuts et journaliser la valeur brute reçue.

La page des statuts indique également qu’une transaction en attente depuis plus de deux heures peut être considérée comme expirée.

### 8.2 Vérification ponctuelle

```http
GET {BICTORYS_API_URL}/pay/v1/transactions/{transactionId}/status
X-Api-Key: <clé_publique>
```

Cette requête sert à vérifier ponctuellement un statut. Elle ne remplace pas le webhook pour le suivi normal.

### 8.3 Détail d’une transaction

```http
GET {BICTORYS_API_URL}/pay/v1/transactions/{transactionId}
X-API-Key: <clé_api>
```

La référence OpenAPI indique un identifiant UUID et un objet pouvant contenir : `id`, `merchantId`, `type`, `customerId`, `customerObject`, `pspName`, `paymentMeans`, `paymentChannel`, `amount`, devise, frais, références et date.

### 8.4 Liste des transactions

```http
GET {BICTORYS_API_URL}/pay/v1/transactions
```

Filtres documentés dans la référence OpenAPI :

```text
start_date
end_date
type=checkout|payout|refund
customer_id
customer_phone
device_id
payment_reference
page_offset
page_size
```

Les dates sont annoncées en ISO 8601 avec fuseau UTC. `page_size` vaut 20 par défaut et `page_offset` 0 par défaut selon la référence consultée. Les règles exactes de combinaison des filtres doivent être vérifiées, notamment parce que `end_date` peut rendre certains filtres client inopérants.

---

## 9. WEBHOOKS

### 9.1 Configuration

1. Créer une URL publique HTTPS.
2. Ouvrir le dashboard Bictorys.
3. Aller dans **Developers → Webhooks**.
4. Ajouter l’URL.
5. Définir un secret webhook.
6. Répéter la configuration en Test et en Production.

### 9.2 Headers documentés

```http
X-Secret-Key: <secret_webhook>
X-Webhook-Signature: <signature_HMAC_optionnelle>
X-Webhook-Timestamp: <timestamp_optionnel>
```

Le guide complet documente `X-Secret-Key` comme header toujours présent. La page dédiée à la validation documente principalement la comparaison de `X-Secret-Key`. La signature HMAC est indiquée dans le guide complet comme recommandée lorsqu’elle est envoyée.

### 9.3 Validation minimale obligatoire

Avant tout traitement :

- vérifier le header `X-Secret-Key` ;
- vérifier la présence de `status` et `paymentReference` ;
- retrouver la commande par sa référence ;
- comparer le montant ;
- comparer la devise ;
- comparer le type et l’identifiant de transaction si disponibles ;
- traiter une seule fois le même événement ;
- journaliser le payload brut ;
- répondre rapidement en HTTP 200 selon la stratégie retenue.

### 9.4 Validation HMAC documentée dans le guide complet

Le guide complet propose un HMAC-SHA256 calculé à partir de :

```text
timestamp + "." + rawBody
```

Il recommande de refuser un timestamp vieux de plus de cinq minutes et d’utiliser une comparaison résistante aux attaques temporelles. Cette procédure doit être activée seulement si les headers correspondants sont effectivement présents dans les requêtes reçues.

### 9.5 Payload webhook documenté

```json
{
  "id": "33e1c83b-7cb0-437b-bc50-a7a58e5660ad",
  "merchantId": "merchant-uuid",
  "type": "payment",
  "amount": 5000,
  "currency": "XOF",
  "paymentReference": "ORDER-ABC123",
  "customerId": "customer-uuid",
  "customerObject": {
    "name": "Amadou Fall",
    "phone": "+221771234567",
    "email": "amadou@example.com",
    "country": "SN"
  },
  "pspName": "wave_money",
  "paymentMeans": "+221 *** ** 67",
  "paymentChannel": "Online",
  "merchantFees": 150,
  "customerFees": 0,
  "merchantReference": "ORDER-ABC123",
  "status": "succeeded",
  "timestamp": "2026-03-01T12:05:00Z"
}
```

Une autre page fournit un payload plus riche avec `settledAmount`, `settledCurrency`, `transactionFeeAmountHT`, `transactionFeeAmountTax`, `orderType`, `orderId` et `orderDetails`. Le document doit accepter l’ajout de champs futurs et ne pas rejeter un webhook uniquement parce qu’un champ inconnu est présent.

### 9.6 Handler Node.js robuste

**Justification : sections 3, 9 et 10 de ce document.**

```javascript
// Importe Express pour créer le serveur HTTP du webhook.
import express from "express";

// Importe crypto pour comparer les secrets de façon résistante aux attaques temporelles.
import crypto from "node:crypto";

// Crée l’application Express.
const app = express();

// Conserve le corps brut sur cette route avant tout parsing JSON global.
app.use("/webhooks/bictorys", express.raw({ type: "application/json" }));

// Secret récupéré depuis Secret Manager ou une variable d’environnement backend.
const WEBHOOK_SECRET = process.env.BICTORYS_WEBHOOK_SECRET;

// Compare deux chaînes sans utiliser une comparaison naïve avec l’opérateur ===.
function safeEqual(left, right) {
  // Transforme la première valeur en Buffer UTF-8.
  const leftBuffer = Buffer.from(left ?? "", "utf8");

  // Transforme la deuxième valeur en Buffer UTF-8.
  const rightBuffer = Buffer.from(right ?? "", "utf8");

  // Refuse immédiatement les tailles différentes avant timingSafeEqual.
  if (leftBuffer.length !== rightBuffer.length) return false;

  // Effectue une comparaison résistante aux attaques temporelles.
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

// Vérifie la signature HMAC lorsque Bictorys l’envoie.
function verifyHmac(rawBody, signature, timestamp) {
  // Convertit le timestamp en nombre.
  const parsedTimestamp = Number(timestamp);

  // Refuse un timestamp invalide.
  if (!Number.isFinite(parsedTimestamp)) return false;

  // Refuse un timestamp dont l’unité ou l’ancienneté est incohérente ; à adapter après test Sandbox.
  if (Math.abs(Date.now() - parsedTimestamp) > 5 * 60 * 1000) return false;

  // Reproduit la chaîne signée indiquée par le guide complet.
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  // Compare la signature reçue avec la signature calculée.
  return safeEqual(signature, expected);
}

// Déclare le point d’entrée public reçu par Bictorys.
app.post("/webhooks/bictorys", async (request, response) => {
  // Convertit le Buffer brut en texte sans le reformatter.
  const rawBody = Buffer.isBuffer(request.body)
    ? request.body.toString("utf8")
    : String(request.body ?? "");

  // Lit le secret statique envoyé par Bictorys.
  const receivedSecret = request.headers["x-secret-key"];

  // Lit les headers HMAC lorsqu’ils sont disponibles.
  const signature = request.headers["x-webhook-signature"];
  const timestamp = request.headers["x-webhook-timestamp"];

  // Vérifie HMAC si les deux headers sont présents.
  const hmacValid = signature && timestamp
    ? verifyHmac(rawBody, signature, timestamp)
    : false;

  // Vérifie le secret statique comme mécanisme documenté de base.
  const staticValid = typeof receivedSecret === "string"
    ? safeEqual(receivedSecret, WEBHOOK_SECRET)
    : false;

  // Refuse le payload si aucune méthode de validation ne réussit.
  if (!hmacValid && !staticValid) {
    return response.status(401).json({ received: false });
  }

  // Parse le JSON après la validation du contenu brut.
  const payload = JSON.parse(rawBody);

  // Extrait les champs nécessaires au rapprochement métier.
  const { id, status, paymentReference, amount, currency } = payload;

  // Vérifie que les champs critiques sont présents.
  if (!id || !status || !paymentReference || amount === undefined || !currency) {
    return response.status(400).json({ received: false });
  }

  // Enregistre l’événement avec une clé idempotente avant de modifier la commande.
  // La transaction Firestore doit ignorer un id déjà traité.
  await saveWebhookIfNew({ id, payload });

  // Met à jour la commande seulement après comparaison avec les données attendues.
  await reconcileOrder({ id, paymentReference, amount, currency, status });

  // Confirme la réception au fournisseur après le traitement rapide.
  return response.status(200).json({ received: true });
});
```

La fonction `saveWebhookIfNew` et la fonction `reconcileOrder` sont volontairement abstraites : leur implémentation dépend de Firestore, SQL ou de la base choisie. Il ne faut pas inventer une structure Bictorys à leur place.

### 9.7 Idempotence

Un même webhook ne doit jamais créditer deux fois un compte, livrer deux fois un produit ou déclencher deux payouts. Utilise l’identifiant Bictorys comme clé d’événement lorsque sa présence est garantie, sinon combine une référence métier et un identifiant de transaction.

---

## 10. OTP ORANGE MONEY

La documentation du guide complet indique un OTP pour Orange Money en Côte d’Ivoire et au Burkina Faso.

```javascript
// Détermine si le formulaire doit afficher une étape OTP.
const needsOtp = paymentType === "orange_money" && (country === "CI" || country === "BF");
```

La disponibilité exacte par pays et opérateur doit être testée dans l’environnement Bictorys associé au compte marchand.

---

## 11. PAYOUTS — ENVOI D’ARGENT

### 11.1 Endpoint

```http
POST {BICTORYS_API_URL}/pay/v1/payouts?payment_type={type}
```

### 11.2 Headers

```http
X-API-Key: <clé_privée>
Content-Type: application/json
Accept: application/json
Idempotency-Key: <UUID-unique>
```

La clé publique ne doit pas être utilisée. Le guide indique qu’elle conduit à une erreur d’authentification ou de droits.

### 11.3 Body documenté

```json
{
  "amount": 10000,
  "currency": "XOF",
  "country": "SN",
  "customerObject": {
    "name": "Amadou Fall",
    "phone": "+221771234567",
    "email": "amadou@example.com",
    "country": "SN",
    "locale": "fr-FR"
  },
  "transactionType": "payment",
  "paymentReason": "Fund transfer",
  "merchantReference": "WD-ABC123",
  "merchant": {
    "secretCode": "<code-secret-marchand>"
  }
}
```

### 11.4 Règles

- `amount` est un entier.
- Le téléphone utilise le format international sans espace.
- `merchantReference` doit être unique dans ton système.
- `merchant.secretCode` reçoit le code secret marchand configuré dans le dashboard.
- `Idempotency-Key` doit être un UUID unique par opération logique.
- Configure un timeout d’environ 30 secondes selon la recommandation du guide.
- Gère les réponses non JSON, car un WAF peut renvoyer du HTML.
- Un payout doit être soumis à des limites et permissions métier fortes.

### 11.5 Réponse documentée

```json
{
  "id": "abc123-def456",
  "merchantId": "merchant-uuid",
  "amount": -10000,
  "merchantFee": 150,
  "customerFee": 0,
  "currency": "XOF",
  "paymentReference": "reference",
  "customerName": "Amadou Fall",
  "customerPhone": "221771234567",
  "customerCountry": "SN",
  "pspName": "wave_money",
  "merchantReference": "WD-ABC123",
  "status": 0,
  "createdAt": "2026-03-01T12:00:00Z"
}
```

Le guide indique que le montant d’un payout peut être négatif, car il représente une sortie de fonds, et que `status: 0` correspond au succès dans cet exemple. Ne réutilise pas ce parseur pour les charges entrantes sans normalisation.

### 11.6 Erreurs fréquentes

| Indice | Signification probable documentée |
|---|---|
| `balance` | Solde Bictorys insuffisant |
| `plafon` ou `limit` | Limite du destinataire atteinte |
| `phone` | Numéro invalide |
| `secretCode` | Code secret incorrect ou absent |
| `idempotency-key` | Header absent ou clé réutilisée |
| `401` | Mauvaise clé ; utiliser la clé privée |

---

## 12. REMBOURSEMENTS

La référence API documente :

```http
PUT {BICTORYS_API_URL}/pay/v1/transactions/{transactionId}/refund
```

La réponse documentée est `202 Transaction refund accepted`.

La page fonctionnelle du dashboard indique la possibilité de remboursement complet ou partiel. Toutefois, l’endpoint de référence consulté ne montre pas clairement de corps permettant de choisir un montant partiel. Il faut donc considérer le remboursement partiel via API comme **NON DÉTAILLÉ** jusqu’à confirmation officielle.

Un remboursement est une opération sensible : journalise l’opérateur, la raison, la transaction source, le montant et le résultat reçu.

---

## 13. FACTURES ET LIENS DE PAIEMENT

### 13.1 Factures

La documentation présente les factures comme un moyen d’accepter des paiements ou de vendre des abonnements sans créer une vitrine complète. Une facture peut être partagée par email, réseaux sociaux ou site web.

La création depuis le dashboard prévoit :

- client facultatif ;
- référence ;
- devise ;
- désignation des produits ;
- taxes selon le pays ;
- remise ;
- transport facultatif ;
- aperçu ;
- envoi ;
- téléchargement PDF depuis le dashboard.

Les endpoints API exacts et le schéma complet ne sont pas suffisamment détaillés dans les pages fonctionnelles consultées. Ils sont donc **À VÉRIFIER dans l’API Reference** avant implémentation.

### 13.2 Liens de paiement

Un lien de paiement est une page hébergée par Bictorys que le marchand peut partager. Il prend en charge plusieurs moyens de paiement et s’adapte à la localisation du client.

La page de création indique un montant maximum de **1 000 000 XOF** dans le dashboard, avec possibilité de contacter le service client pour augmenter la limite. Cette limite concerne la page fonctionnelle consultée ; ne l’étends pas automatiquement aux charges API.

Les endpoints exacts de création de lien doivent être récupérés depuis les pages `reference/create...payment...` lorsqu’ils sont nécessaires. Ne déduis pas leur nom à partir du titre marketing.

---

## 14. CLIENTS, PRODUITS ET TRANSACTIONS

L’index officiel `llms.txt` expose des références API pour :

```text
customers
products
taxes
invoices
payment links
transactions
subscriptions
orders
cards tokenisées
```

Chaque ressource doit être documentée séparément avant utilisation. Le présent fichier confirme leur présence dans l’index, mais ne prétend pas documenter ici les champs complets de chaque ressource.

Règle : si un agent doit créer un customer, un produit, une facture ou une subscription, il doit ouvrir la page de référence officielle correspondante et ne pas extrapoler à partir de la charge.

---

## 15. MOYENS DE PAIEMENT ET PAYS

Le guide complet indique notamment les pays ou codes suivants :

```text
SN : Sénégal
CI : Côte d’Ivoire
BK : code Bictorys observé dans la documentation
ML : Mali
TG : Togo
BJ : Bénin
BF : Burkina Faso, surtout dans le flux OTP et payout
```

Le catalogue du guide d’intégration comprend notamment :

| Nom interne | `payment_type` | Pays indiqués dans le guide |
|---|---|---|
| Wave | `wave_money` | SN, CI/BF selon les variantes documentées |
| Orange Money | `orange_money` | SN, CI, ML, BK selon les variantes |
| MTN Money | `mtn_money` | CI, BJ |
| Moov | `moov` | TG, CI, BF, BJ |
| Togocell | `togocell` | TG |
| Mobicash | `mobicash` | BF, ML |
| Maxit | `maxit` | SN |
| Carte | `card` | Visa/Mastercard |

La liste exacte des opérateurs activés pour un marchand est consultable par :

```http
GET {BICTORYS_API_URL}/onboarding/v1/payment-methods/me
X-API-Key: <clé_privée>
```

Ne présente dans l’interface que les moyens réellement activés et compatibles avec le pays choisi.

---

## 16. TESTS SANDBOX

### 16.1 Mobile Money

Le simulateur Sandbox affiche un QR code. Il faut le scanner avec la caméra du téléphone. Il ne faut pas utiliser une application Mobile Money réelle.

Limitation explicitement indiquée : en Sandbox Mobile Money, les URLs de redirection `success` et `error` ne sont pas appelées. Pour tester le comportement des redirections, utiliser un paiement carte de test.

### 16.2 Cartes de test

La documentation fournit des PAN de test EMV 3DS 2.0 :

| PAN | Scénario | Résultat |
|---|---|---|
| `2303779999000275` | Frictionless, `transStatus != C` | Succès |
| `2303779999000408` | Challenge, `transStatus == C` | Succès ; OTP challenge `1234` |
| `2303779999000291` | Frictionless, `transStatus == N` | Échec, non authentifié |
| `2303779999000317` | Frictionless, `transStatus == U` | Échec, indisponible |
| `2303779999000424` | Challenge, `transStatus == N` | Échec, non authentifié |
| `2303779999000432` | Challenge, `transStatus == U` | Échec, indisponible |

Pour les tests, la documentation demande un nom quelconque, une expiration future et un CVV. Ces cartes sont uniquement destinées au Sandbox.

### 16.3 Scénarios indispensables

- paiement réussi ;
- paiement pending ;
- annulation ;
- expiration ;
- mauvais montant ;
- mauvaise devise ;
- webhook répété ;
- webhook invalide ;
- timeout Bictorys ;
- retour utilisateur sans webhook ;
- paiement carte 3DS réussi et échoué ;
- payout doublé ;
- solde insuffisant.

---

## 17. SDK ET LANGAGES

La documentation consultée expose surtout des exemples REST, `fetch`, XHR, cURL et Node.js générique. La disponibilité d’un SDK officiel Bictorys stable pour chaque langage est **INCONNUE** dans les pages parcourues.

Ne crée pas un import fictif tel que `import Bictorys from "bictorys"` sans avoir vérifié le dépôt ou la documentation officielle correspondante.

Pour Firebase/Node.js, l’implémentation HTTP directe avec `fetch` côté backend est le choix le plus transparent lorsqu’aucun SDK officiel n’est confirmé.

---

## 18. EXEMPLE NODE.JS — CRÉER UN CHECKOUT

**Justification : sections 2, 3, 5 et 6 de ce document.**

```javascript
// Importe randomUUID afin de générer une référence métier unique.
import { randomUUID } from "node:crypto";

// Lit l’URL Bictorys depuis la configuration backend.
const API_URL = process.env.BICTORYS_API_URL;

// Lit la clé destinée aux charges depuis Secret Manager.
const API_KEY = process.env.BICTORYS_API_KEY;

// Crée une charge Checkout pour une commande existante.
export async function createCheckout(order) {
  // Vérifie que le montant est un entier.
  if (!Number.isInteger(order.amount)) throw new Error("amount doit être un entier");

  // Refuse un montant inférieur au minimum indiqué dans le guide.
  if (order.amount < 100) throw new Error("amount inférieur au minimum documenté");

  // Utilise la référence existante ou en crée une nouvelle.
  const paymentReference = order.paymentReference ?? `ORDER-${randomUUID()}`;

  // Prépare le corps attendu par l’endpoint Charges.
  const body = {
    amount: order.amount,
    currency: "XOF",
    country: order.country,
    paymentReference,
    successRedirectUrl: `${process.env.APP_URL}/payment/success`,
    ErrorRedirectUrl: `${process.env.APP_URL}/payment/error`,
    customerObject: order.customer,
  };

  // Effectue l’appel Bictorys depuis le serveur et non depuis le navigateur.
  const result = await fetch(`${API_URL}/pay/v1/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  // Tente de lire le JSON même lorsque Bictorys renvoie une erreur.
  const data = await result.json().catch(() => ({}));

  // Arrête l’opération si le code HTTP n’est pas un succès.
  if (!result.ok) throw new Error(`Bictorys ${result.status}: ${JSON.stringify(data)}`);

  // Le backend doit enregistrer data.transactionId avant de renvoyer redirectUrl au frontend.
  return data;
}
```

**Contradiction à tester :** le guide principal utilise `ErrorRedirectUrl`, tandis que la page Checkout utilise parfois `errorRedirectUrl`. Ne choisis pas silencieusement : teste les deux en Sandbox et documente la variante acceptée par ton compte.

---

## 19. EXEMPLE PAYOUT AVEC IDEMPOTENCE

**Justification : section 11 de ce document.**

```javascript
// Importe randomUUID pour produire une clé d’idempotence unique.
import { randomUUID } from "node:crypto";

// Lit la base URL depuis les secrets du backend.
const API_URL = process.env.BICTORYS_API_URL;

// Utilise obligatoirement la clé privée pour les payouts.
const PRIVATE_KEY = process.env.BICTORYS_PRIVATE_KEY;

// Crée un payout vers un compte Mobile Money.
export async function createPayout(payout) {
  // Prépare l’URL avec le type de moyen de paiement choisi.
  const url = `${API_URL}/pay/v1/payouts?payment_type=${payout.paymentType}`;

  // Prépare les données obligatoires du payout.
  const body = {
    amount: payout.amount,
    currency: "XOF",
    country: payout.country,
    customerObject: payout.customerObject,
    transactionType: "payment",
    paymentReason: payout.paymentReason,
    merchantReference: payout.merchantReference,
    merchant: { secretCode: process.env.BICTORYS_MERCHANT_SECRET_CODE },
  };

  // Envoie la requête avec une clé d’idempotence propre à cette opération logique.
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": PRIVATE_KEY,
      "Idempotency-Key": payout.idempotencyKey ?? randomUUID(),
    },
    body: JSON.stringify(body),
  });

  // Lit le texte pour supporter une réponse JSON ou HTML du WAF.
  const raw = await response.text();

  // Arrête le traitement en conservant la réponse brute pour le diagnostic.
  if (!response.ok) throw new Error(`Payout ${response.status}: ${raw}`);

  // Convertit le JSON uniquement après avoir vérifié que le code HTTP est acceptable.
  return JSON.parse(raw);
}
```

---

## 20. GESTION DES ERREURS HTTP

| Code | Signification documentée ou courante | Action |
|---:|---|---|
| `400` | Paramètres invalides, pays ou moyen incorrect | Vérifier body, pays, montant et `payment_type` |
| `401` | Clé absente ou invalide | Vérifier l’environnement et la clé |
| `403` | Droits insuffisants ou WAF | Vérifier public/private key, IP, fréquence et logs |
| `404` | Ressource ou transaction introuvable | Vérifier l’UUID et l’URL |
| `409` | Conflit possible, notamment idempotence dans certaines références | Ne pas répéter aveuglément |
| `500` | Erreur interne Bictorys | Journaliser puis réessayer avec prudence |
| réponse HTML | WAF ou proxy | Ne pas supposer que la réponse est JSON |

La référence OpenAPI contient également des codes métier relatifs au pays, au téléphone, au code secret, au solde, au plafond, au moyen désactivé, à la référence, à l’idempotence, aux factures expirées et aux liens déjà payés. Les codes exacts doivent être traités comme des messages à journaliser, sans convertir automatiquement tous les `400` en paiement échoué sans connaître l’opération.

---

## 21. SÉCURITÉ — RÈGLES ABSOLUES

1. Secret privé, secret webhook et code marchand dans Secret Manager ou variables backend uniquement.
2. Aucun secret dans le dépôt Git, les logs, les screenshots ou le bundle frontend.
3. HTTPS obligatoire pour les URLs de callback et webhooks.
4. Validation de `X-Secret-Key` avant le traitement.
5. HMAC avec corps brut et protection anti-rejeu lorsqu’il est fourni.
6. Comparaison résistante aux attaques temporelles.
7. Contrôle de la référence, du montant et de la devise.
8. Idempotence sur les webhooks, charges sensibles et payouts.
9. Ne jamais livrer une commande sur simple retour `successRedirectUrl`.
10. Ne jamais collecter directement les cartes via Direct API sans traiter la contrainte PCI-DSS.
11. Limites par utilisateur, par marchand et par période pour les payouts.
12. Journal d’audit pour chaque changement de statut financier.

---

## 22. RÈGLES DE NORMALISATION POUR L’AGENT IA

```text
✅ Base Test = https://api.test.bictorys.com
✅ Base Live = https://api.bictorys.com
✅ Header API = X-Api-Key ou X-API-Key
✅ Charges = clé publique du guide principal
✅ Payouts = clé privée obligatoire
✅ Webhook = secret distinct dans X-Secret-Key
✅ Amount = entier en XOF dans le guide complet
✅ Phone = format international sans espaces
✅ Checkout = POST /pay/v1/charges sans payment_type
✅ Direct API = POST /pay/v1/charges?payment_type=...
✅ Statut final = webhook vérifié + rapprochement commande
✅ Payout = Idempotency-Key obligatoire selon le guide complet
✅ Carte Direct API = PCI-DSS documenté comme requis
✅ Sandbox Mobile Money = simulateur et QR code
✅ Les statuts et noms de champs doivent être normalisés
✅ Les champs inconnus supplémentaires du webhook doivent être ignorés

❌ Ne jamais utiliser un Bearer token sans source officielle Bictorys
❌ Ne jamais utiliser la clé publique pour un payout
❌ Ne jamais exposer la clé privée côté client
❌ Ne jamais faire confiance au statut d’une URL de redirection
❌ Ne jamais traiter un webhook sans valider montant, devise et référence
❌ Ne jamais rejouer un payout sans idempotency key
❌ Ne jamais inventer un SDK, un endpoint ou un opérateur
❌ Ne jamais utiliser une application Mobile Money réelle avec le simulateur Sandbox
❌ Ne jamais supposer que tous les moyens listés sont activés sur le compte
❌ Ne jamais supprimer les champs inconnus d’un payload avant journalisation
```

---

## 23. INCOHÉRENCES ET LIMITES DOCUMENTAIRES

### 23.1 Casse des champs de redirection

Les pages utilisent `ErrorRedirectUrl` et `errorRedirectUrl`. Cette variation peut être significative selon le backend. Tester en Sandbox.

### 23.2 Statuts différents selon les pages

Le guide complet utilise surtout `succeeded`, `authorized`, `pending`, `processing`, `failed`, `cancelled` et `reversed`. Une page de statut utilise des libellés français et `charge.successful`. Conserver la valeur brute et créer un adaptateur de statut.

### 23.3 Signature webhook

La page de validation documente clairement `X-Secret-Key`. Le guide complet décrit en plus HMAC avec `X-Webhook-Signature` et `X-Webhook-Timestamp`. Il faut détecter les headers réellement présents et ne pas supposer que l’HMAC est activé partout.

### 23.4 Remboursement partiel

Le dashboard indique un remboursement partiel, mais la référence endpoint consultée ne détaille pas clairement le body d’un remboursement partiel. Ne pas inventer le paramètre `amount`.

### 23.5 SDK officiel

Les sources parcourues présentent surtout des appels HTTP et des exemples génériques. La présence et le support actuel d’un SDK Node, PHP, Python, Go ou Java doivent être confirmés séparément.

### 23.6 Limites de taux

La page `api-rate-limits` existe, mais son contenu extrait est insuffisant pour établir un quota fiable. La limite de taux exacte est donc **INCONNUE** dans ce grounding.

---

## 24. CHECKLIST DE PRODUCTION

- [ ] Compte Sandbox créé.
- [ ] Compte Production distinct ou environnement clairement séparé.
- [ ] Clés publiques et privées identifiées.
- [ ] Secret webhook distinct créé.
- [ ] Code secret marchand conservé côté backend.
- [ ] URL webhook HTTPS configurée en Test.
- [ ] URL webhook HTTPS configurée séparément en Production.
- [ ] Checkout implémenté depuis un backend.
- [ ] `transactionId` stocké avant redirection.
- [ ] Webhook vérifié avec `X-Secret-Key`.
- [ ] HMAC testé si les headers sont fournis.
- [ ] Montant, devise et référence comparés à la commande.
- [ ] Idempotence implémentée.
- [ ] Tests Sandbox Mobile Money réalisés avec le simulateur.
- [ ] Tests carte 3DS réussis et échoués réalisés.
- [ ] Cas de redirection absente en Sandbox compris.
- [ ] Payout désactivé par défaut dans le frontend.
- [ ] Idempotency key imposée pour les payouts.
- [ ] Réponses HTML gérées.
- [ ] Logs sans secrets.
- [ ] Réconciliation périodique avec la liste des transactions Bictorys.
- [ ] Procédure de rotation des clés définie.

---

## 25. CONCLUSION D’ARCHITECTURE

Pour une première intégration dans un SaaS Firebase ou une PWA, l’architecture recommandée est :

```text
Cloud Functions ou backend Node.js
+ Checkout Bictorys
+ Firestore pour les commandes
+ Webhook validé
+ Idempotence
+ Réconciliation périodique
```

La Direct API doit être introduite uniquement après validation du pays, de l’opérateur et de l’expérience utilisateur. Les cartes doivent rester dans le Checkout hébergé tant que les exigences PCI-DSS de la Direct API ne sont pas maîtrisées.

L’angle mort principal est le rapprochement financier. Une commande ne doit pas devenir payée parce qu’un utilisateur a visité une page de succès. Elle devient payée après réception d’un événement Bictorys valide, comparaison des données avec la commande locale et traitement idempotent.

---

## RÉFÉRENCES OFFICIELLES

[1]: https://docs.bictorys.com/llms.txt "Index complet de la documentation Bictorys"
[2]: https://docs.bictorys.com/docs/integration.md "Guide d’intégration Bictorys"
[3]: https://docs.bictorys.com/docs/int%C3%A9gration-en "Guide d’intégration Bictorys en anglais"
[4]: https://docs.bictorys.com/docs/get-your-api-key "Clés API Bictorys"
[5]: https://docs.bictorys.com/docs/how-checkout-works "Fonctionnement du Checkout Bictorys"
[6]: https://docs.bictorys.com/docs/direct-api.md "Direct API Bictorys"
[7]: https://docs.bictorys.com/docs/setup-webhook.md "Configurer un webhook Bictorys"
[8]: https://docs.bictorys.com/docs/how-to-validate-webhooks.md "Valider les webhooks Bictorys"
[9]: https://docs.bictorys.com/docs/test-mobile-money.md "Tester Mobile Money en Sandbox"
[10]: https://docs.bictorys.com/docs/cartes-bancaires-de-test.md "Cartes bancaires de test Bictorys"
[11]: https://docs.bictorys.com/docs/status-responses-and-their-meanings.md "Statuts et significations Bictorys"
[12]: https://docs.bictorys.com/docs/api-rate-limits.md "Limites de taux Bictorys"
[13]: https://docs.bictorys.com/reference/createcharge.md "Créer une charge Bictorys"
[14]: https://docs.bictorys.com/reference/createpayout.md "Créer un payout Bictorys"
[15]: https://docs.bictorys.com/reference/gettransactions.md "Lister les transactions Bictorys"
[16]: https://docs.bictorys.com/reference/gettransactiondetails.md "Détail d’une transaction Bictorys"
[17]: https://docs.bictorys.com/reference/refundtransaction.md "Rembourser une transaction Bictorys"
[18]: https://docs.bictorys.com/docs/invoice.md "Facturation Bictorys"
[19]: https://docs.bictorys.com/docs/creer-invoice.md "Créer une facture Bictorys"
[20]: https://docs.bictorys.com/docs/payment-llink.md "Liens de paiement Bictorys"
[21]: https://docs.bictorys.com/docs/create-payment-link.md "Créer un lien de paiement Bictorys"

---

*Document généré à partir des pages officielles Bictorys consultées le 24 septembre 2026.*
*La documentation Bictorys évolue ; vérifier les pages de référence et effectuer un test Sandbox avant toute mise en production.*
