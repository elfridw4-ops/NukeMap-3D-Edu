---
agent: AGENTS_INTEGRATION_SASPAY
commande: saspay:integrate
declencheurs:
  - intégration SasPay
  - API SasPay
  - paiement mobile money SasPay
action: Intégration de la solution de paiement SasPay avec vérification stricte des statuts et signatures
---

## ⚙️ AGENT PROTOCOL — LIRE EN PREMIER, AVANT TOUT

Tu es un agent spécialisé SasPay. Ce fichier est ta source de vérité de travail pour l’intégration SasPay.

### RÈGLES ABSOLUES

1. Lis ce document avant de répondre ou de coder.
2. Utilise d’abord les informations présentes ici et les pages officielles SasPay citées à la fin.
3. Ne transforme jamais une hypothèse en fait.
4. Si une information n’est pas documentée, écris explicitement : **INCONNU — absent de la documentation consultée**.
5. Avant chaque bloc de code, indique la section de ce document qui justifie le code.
6. Si un paramètre, un header ou un comportement est ambigu, vérifie la documentation officielle SasPay ou demande confirmation.
7. SasPay n’est pas Stripe, FedaPay ou PayDunya. Ne transpose pas leurs paramètres, SDK, statuts ou signatures.
8. Une réponse HTTP 2xx lors de la création d’un paiement ne signifie pas que le paiement est réussi.
9. Une clé secrète SasPay ne doit jamais être exposée au navigateur, au mobile ou au bundle frontend.
10. Ne fabrique jamais une formule de signature webhook. La formule exacte doit être confirmée auprès de SasPay si elle n’est pas fournie par la documentation officielle.

### CONFIRMATION OBLIGATOIRE POUR L’AGENT

Avant de commencer une tâche d’intégration, répondre uniquement :

> **PROTOCOLE ACTIF — SASPAY. Prêt.**

---

# AGENTS_INTEGRATION_SASPAY.md
# Document de grounding — À lire avant toute session d’intégration SasPay

> **Règle principale :** tout ce qui n’est pas confirmé par la documentation SasPay doit être présenté comme inconnu. Les exemples de la documentation sont des exemples ; ils ne prouvent pas que toutes les valeurs sont disponibles en production.

---

## 0. IDENTITÉ ET PÉRIMÈTRE

- **Service :** SasPay.
- **Fonction :** API REST d’encaissement et de paiement en mobile money et par carte en Afrique de l’Ouest et du Centre.
- **Format annoncé :** JSON sur HTTP.
- **Base URL API :** `https://api.saspay.me/api/v1`.
- **Documentation officielle :** `https://docs.saspay.me/`.
- **Index officiel :** `https://docs.saspay.me/llms.txt`.
- **Spécification OpenAPI :** `https://docs.saspay.me/api-reference/openapi.json`.
- **Tableau de bord :** `https://app.saspay.me`.
- **Checkout hébergé :** `https://pay.saspay.me`.

### Limites de l’exploration

La documentation officielle est accessible, mais certaines pages sont rendues par un testeur API dynamique. Les données présentées dans un exemple ne doivent pas être prises comme une liste exhaustive des pays, réseaux, tarifs ou statuts actifs.

La page webhook documente les headers `X-Webhook-Timestamp` et `X-Webhook-Signature`, le contrôle d’âge et la comparaison en temps constant. La formule complète de signature n’est pas suffisamment explicitée dans la page publique consultée. Cette information est donc **INCONNUE** et doit être confirmée par SasPay avant la production.

---

## 1. DIFFÉRENCES CRITIQUES À NE PAS CONFONDRE

| Sujet | SasPay | Règle d’intégration |
|---|---|---|
| Base API | `https://api.saspay.me/api/v1` | Ne pas utiliser l’URL d’un autre prestataire |
| Authentification | `Authorization: Bearer sk_test_...` ou `sk_live_...` | Clé secrète uniquement côté backend |
| Paiement entrant | Softpay ou Checkout hébergé | Le statut initial est généralement `PENDING` |
| Paiement sortant | `POST /payouts/initialize/` | Scope `PAYOUT` ou `BOTH` |
| Montant | Chaîne décimale, par exemple `"2500.00"` | Ne pas supposer un entier en centimes |
| Devise | Chaîne ISO, par exemple `"XOF"` | Ne pas envoyer `{ iso: "XOF" }` sans documentation SasPay |
| Réseau payin | Champ `network`, par exemple `mtn_bj` | Utiliser le code du catalogue |
| Réseau payout | Champ `method`, par exemple `mtn_cm` | Ne pas confondre avec `network` |
| Idempotence | Header `Idempotency-Key` | Obligatoire en pratique pour les opérations financières |
| Webhook | Corps brut + timestamp + signature | Ne pas parser JSON avant la vérification |
| Pagination transactions | Pagination par curseur | Utiliser `next` et `previous`, pas un numéro de page |
| Pagination balances et réseaux | Pagination classique par page | Vérifier le format de chaque endpoint |
| Pays public | `/countries/` sans authentification | La réponse réelle observée est `{success, data}` |

---

## 2. ENVIRONNEMENTS ET CLÉS

### 2.1 Clés documentées

| Préfixe | Environnement | Usage |
|---|---|---|
| `sk_test_...` | Sandbox | Tests sans argent réel |
| `sk_live_...` | Production | Argent réel |

La documentation consultée ne fournit pas une seconde base URL publique distincte pour le sandbox. L’environnement est indiqué par le préfixe de la clé. Si SasPay fournit une URL sandbox séparée à votre compte, elle doit être confirmée directement et stockée comme configuration, jamais devinée.

### 2.2 Scopes

| Scope | Autorisations documentées |
|---|---|
| `PAYIN` | Encaissements |
| `PAYOUT` | Retraits et opérations de décaissement |
| `BOTH` | Encaissements et retraits |

Une clé `PAYOUT` utilisée sur un endpoint payin renvoie une erreur `api_key_scope_forbidden`. Une clé payin utilisée sur un endpoint payout produit la même famille d’erreur pour le scope payout.

### 2.3 Gestion des secrets

La clé secrète doit être stockée dans une variable d’environnement ou un secret manager. Elle ne doit jamais être placée dans :

- un fichier frontend compilé ;
- une variable `NEXT_PUBLIC_*` ou `VITE_*` ;
- une application mobile ;
- Firestore accessible au client ;
- un dépôt Git ;
- un ticket ou un message de support.

En cas de compromission, révoquer ou remplacer la clé depuis le tableau de bord puis redéployer le backend.

---

## 3. AUTHENTIFICATION ET FORMAT DES REQUÊTES

### 3.1 Header standard

```http
Authorization: Bearer sk_test_xxxxxxxxxxxxxxxx
Content-Type: application/json
Accept: application/json
```

### 3.2 Réponses et erreurs

Les exemples SasPay montrent deux formes d’erreur.

Erreur métier :

```json
{
  "message": "Solde disponible insuffisant.",
  "code": "insufficient_balance"
}
```

Erreur de validation :

```json
{
  "amount": ["Ce champ est obligatoire."],
  "currency": ["Devise invalide."]
}
```

Le client HTTP doit conserver le code HTTP et le corps brut ou JSON. Il ne doit pas dépendre uniquement du champ `message`.

### 3.3 Limitation de débit

La limite annoncée est de **300 requêtes par minute par compte**. Le dépassement renvoie `429 Too Many Requests`.

Une stratégie de retry ne doit être appliquée automatiquement qu’aux erreurs réseau ou `429`, avec backoff. Pour une opération financière, le retry doit réutiliser la même clé d’idempotence.

---

## 4. IDEMPOTENCE — RÈGLE FINANCIÈRE ABSOLUE

### 4.1 Header

```http
Idempotency-Key: 3fa85f64-5717-4562-b3fc-2c963f66afa6
```

La valeur est générée par votre système. Un UUID est adapté selon la documentation.

### 4.2 Opérations concernées

Le header est documenté sur les opérations suivantes :

- `POST /payments/softpay/` ;
- `POST /payouts/initialize/` ;
- `POST /payments/{id}/retry/` ;
- `POST /settlements/` ;
- `POST /wallet-transfers/`.

La même clé doit être réutilisée pour les retries de la même intention. Une nouvelle intention financière reçoit une nouvelle clé.

### 4.3 Règles

- Timeout réseau : réutiliser la même clé.
- Double-clic utilisateur : bloquer au niveau de votre commande interne.
- Nouveau paiement volontaire : générer une nouvelle clé.
- Même clé avec corps différent : SasPay documente une erreur `409`.
- Checkout hébergé : `Idempotency-Key` n’est pas documenté comme pris en charge sur la création de session.

---

## 5. CRÉER LE COMPTE ET OBTENIR UNE CLÉ

Le flux documenté se déroule ainsi :

1. Créer le compte utilisateur.
2. Vérifier l’adresse e-mail.
3. Se connecter avec un jeton de session.
4. Créer le marchand.
5. Soumettre le KYC.
6. Attendre le passage à `kyc_status: "VERIFIED"` et `is_active: true`.
7. Générer une clé API avec l’environnement et le scope souhaités.

Le KYC et la gestion des clés sont principalement des fonctions dashboard/session. Une clé API ne peut pas gérer elle-même les clés API ni modifier le profil marchand.

---

## 6. PAYINS — ENCAISSEMENTS ENTRANTS

SasPay distingue deux expériences :

- **Softpay :** votre interface connaît déjà le réseau et le numéro ; SasPay pousse une demande sur le téléphone.
- **Checkout hébergé :** SasPay fournit une page `checkout_url` où le client choisit son réseau et saisit ses informations.

### 6.1 Softpay

**Section justificative :** référence officielle `api-reference/payments/softpay`.

**Endpoint :**

```text
POST /payments/softpay/
```

**Payload documenté :**

```json
{
  "amount": "2500.00",
  "currency": "XOF",
  "country": "BJ",
  "description": "Abonnement mensuel",
  "customer": {
    "email": "client@example.com",
    "first_name": "Awa",
    "last_name": "Sossou",
    "phone": "+22997505050"
  },
  "network": "mtn_bj"
}
```

**Réponse initiale documentée :**

```json
{
  "message": "Payment pushed successfully",
  "id": "9c3f2a10-4b7e-4f1a-9d2e-9b6a7c1e4a02",
  "status": "PENDING",
  "checkout_url": ""
}
```

Le champ `id` doit être sauvegardé dans votre base. Le statut `PENDING` ne doit pas créditer la commande.

### 6.2 Checkout hébergé

**Section justificative :** référence officielle `api-reference/payments/checkout-create`.

**Endpoint :**

```text
POST /checkout-sessions/
```

**Champs requis documentés :**

- `amount` ;
- `currency` ;
- `customer_email` ;
- `customer_name`.

**Champs optionnels documentés :**

- `description` ;
- `country` ;
- `customer_phone` ;
- `return_url` ;
- `metadata` ;
- `fee_charge_mode` ;
- `expires_at` selon la spécification OpenAPI.

**Payload :**

```json
{
  "amount": "5000.00",
  "currency": "XOF",
  "description": "Facture #1042",
  "country": "BJ",
  "customer_email": "client@example.com",
  "customer_name": "Awa Sossou",
  "return_url": "https://example.com/paiement/retour"
}
```

La réponse contient une `checkout_url` de la forme `https://pay.saspay.me/checkout/...`.

**Attention :** SasPay indique que `return_url` n’est actuellement pas utilisée de manière systématique. Une redirection, un clic de retour ou une page de succès ne constituent pas une preuve de paiement.

### 6.3 Vérifier un paiement

**Endpoint :**

```text
GET /payments/{payment_id}/verify/
```

Cette route doit être appelée depuis le backend. Si le statut est `PENDING`, SasPay indique qu’il revérifie l’état réel auprès du gateway.

### 6.4 Confirmer un OTP

**Endpoint :**

```text
POST /payments/{payment_id}/confirm-otp/
```

**Payload :**

```json
{
  "otp": "482913"
}
```

Ce flux concerne seulement certains réseaux. La documentation cite notamment Wizall au Sénégal et Coris au Bénin, tout en précisant que la liste n’est pas exhaustive.

Codes documentés :

- `otp_not_applicable` ;
- `not_found` ;
- `no_attempt` ;
- `otp_confirmation_failed`.

### 6.5 Retry d’un paiement échoué

**Endpoint :**

```text
POST /payments/{payment_id}/retry/
```

**Payload documenté :**

```json
{
  "methods": ["moov_bj"]
}
```

Le retry réutilise le même identifiant de transaction et ne crée pas une nouvelle transaction. Il est réservé aux paiements `INBOUND`. Utiliser `Idempotency-Key` pour éviter un second routage en cas de coupure réseau.

Codes documentés :

- `invalid_flow` ;
- `not_found` ;
- `not_retryable` ;
- `invalid_method`.

---

## 7. PAYOUTS — RETRAITS VERS UN BÉNÉFICIAIRE

### 7.1 Initialiser un payout

**Section justificative :** référence officielle `api-reference/payouts/initialize`.

**Endpoint :**

```text
POST /payouts/initialize/
```

**Payload documenté :**

```json
{
  "amount": "10000.00",
  "currency": "XAF",
  "country": "CM",
  "customer": {
    "phone": "+237677889900"
  },
  "method": "mtn_cm",
  "recipient": {
    "msisdn": "677889900"
  },
  "description": "Remboursement commande #778"
}
```

**Réponse initiale :**

```json
{
  "message": "Payout transaction initialized successfully",
  "id": "a4b5c6d7-e8f9-4a0b-8c1d-2e3f4a5b6c7d"
}
```

Un payout doit toujours être protégé par idempotence et par une règle métier empêchant le double remboursement.

### 7.2 Vérifier un payout

**Endpoint :**

```text
GET /payouts/{payout_id}/verify/
```

Comme pour un paiement, SasPay indique qu’un payout `PENDING` est revérifié auprès du gateway.

### 7.3 Contraintes documentées

- Une clé avec scope `PAYIN` ne peut pas initier un payout.
- Une IP serveur peut devoir être ajoutée à la whitelist marchand.
- La devise doit correspondre au pays selon les règles SasPay.
- L’erreur `ip_not_whitelisted` est documentée.
- L’erreur `currency_country_mismatch` est documentée.

La liste exhaustive des limites de montant, délais et tarifs payout est **INCONNUE** dans les pages consultées.

---

## 8. RÉFÉRENTIEL DES PAYS, RÉSEAUX ET NUMÉROS

### 8.1 Pays

**Endpoint public :**

```text
GET /countries/
```

La documentation le décrit comme public et non paginé. L’appel réel observé a renvoyé :

```json
{
  "success": true,
  "data": [
    {
      "iso_code": "BJ",
      "name": "Bénin",
      "default_currency": "XOF",
      "is_active": true
    }
  ]
}
```

**Contradiction à conserver dans tout adaptateur :** OpenAPI décrit un tableau brut dans sa réponse, alors que l’endpoint réel observé renvoie une enveloppe `{success, data}`. Le parseur doit accepter la forme réellement reçue et ne pas être codé comme si une seule forme était garantie.

### 8.2 Réseaux

**Endpoint :**

```text
GET /networks/?page=1&page_size=20
```

La réponse est paginée avec `count`, `next`, `previous` et `results`.

**Objet réseau documenté :**

```json
{
  "id": "9b0c1d2e-3f4a-4b5c-8d6e-7f8a9b0c1d2e",
  "country": "6d1a3f2e-8b4c-4d5e-9f0a-1b2c3d4e5f6a",
  "code": "mtn_bj",
  "name": "MTN Mobile Money",
  "is_active": true
}
```

Aucun filtre `?country=` n’est documenté sur cet endpoint. Il faut donc récupérer les pages puis filtrer côté application sur `country`.

Le champ `code` est la valeur à utiliser dans `network` pour un paiement et dans `method` pour un payout, selon le flux.

### 8.3 Téléphones

La documentation indique que les numéros peuvent être envoyés :

- au format local ;
- au format international sans `+` ;
- au format international avec `+`.

Pour une application métier, conserver une représentation normalisée côté application reste recommandé, mais la norme exacte de stockage n’est pas imposée par SasPay dans les pages consultées.

### 8.4 Réseaux globaux

Les codes `card` et `crypto` sont documentés comme réseaux globaux. Pour ces réseaux, SasPay indique un traitement spécifique pouvant créer la transaction en USD avec le pays technique `XX`. Ne pas appliquer les mêmes règles qu’au mobile money sans test dédié.

---

## 9. TRANSACTIONS ET RÉCONCILIATION

### 9.1 Lister les transactions

**Endpoint :**

```text
GET /transactions/?page_size=50
```

La pagination est par curseur : utiliser les URLs `next` et `previous`. Il ne faut pas remplacer `cursor` par `page`.

Filtres documentés :

- `status` ;
- `transaction_type` ;
- `currency` ;
- `flow_direction` ;
- `country` ;
- `network` ;
- `merchant` ;
- `created_at__gte` ;
- `created_at__lte` ;
- `search`.

Types documentés : `RECHARGE`, `PAIEMENT`, `RETRAIT`, `TRANSFERT`.

Directions documentées : `INBOUND`, `OUTBOUND`.

### 9.2 Détail d’une transaction

**Endpoint :**

```text
GET /transactions/{id}/
```

Le détail peut contenir :

- les montants demandés, débités et nets ;
- les frais client, gateway et plateforme ;
- le statut ;
- les tentatives de routage ;
- l’historique des changements de statut.

### 9.3 Montants financiers

Ne pas confondre :

- `requested_amount` : montant demandé ;
- `debited_amount` : montant débité ;
- `client_fee` : frais client ;
- `gateway_fee` : frais gateway ;
- `platform_fee` : frais plateforme ;
- `net_amount` : montant net revenant au marchand ;
- `currency` : devise de la transaction.

Pour la comptabilité, la documentation webhook recommande d’utiliser `charged` et `net_amount` lorsque ces champs sont présents. Le champ `amount` seul peut être insuffisant lorsque `fee_charge_mode` vaut `ADD_ON` ou `DEDUCTED`.

### 9.4 Statuts

Les statuts pratiques documentés pour les transactions sont :

```text
PENDING → SUCCESS
PENDING → FAILED
```

`CANCELLED` existe dans le modèle mais la documentation indique qu’il n’est actuellement atteint par aucun flux courant.

---

## 10. WEBHOOKS

### 10.1 Configuration

La création, la modification et la suppression des webhooks ou abonnements se font depuis le tableau de bord. Les clés API permettent de consulter les points de réception, abonnements et logs de livraison.

### 10.2 Enveloppe

La structure générale documentée est :

```json
{
  "event": "transaction.success",
  "data": {
    "id": "7c1a2b3c-1111-2222-3333-444455556666",
    "reference": "TXN-2026-000456",
    "type": "PAYIN",
    "status": "SUCCESS",
    "amount": "25000.00",
    "net_amount": "24375.00",
    "currency": "XOF"
  }
}
```

### 10.3 Headers et anti-rejeu

La documentation explicite les headers :

```http
X-Webhook-Timestamp: 1723456789
X-Webhook-Signature: <signature>
```

Elle indique également qu’un troisième header est envoyé, mais son nom n’est pas clairement exploitable dans la page publique consultée. Ce troisième header est donc **INCONNU**.

Contrôles obligatoires :

1. conserver le corps brut ;
2. refuser un timestamp écarté de plus de cinq minutes ;
3. recalculer la signature avec la formule officielle ;
4. comparer en temps constant ;
5. dédupliquer l’événement ;
6. répondre rapidement en HTTP 2xx ;
7. exécuter les traitements lourds de manière asynchrone.

### 10.4 Formule de signature — état de connaissance

La documentation consultée ne fournit pas de manière suffisamment précise :

- l’algorithme explicite ;
- le secret exact à utiliser ;
- la chaîne exacte à signer ;
- l’encodage de la signature ;
- un exemple complet permettant de recalculer la signature.

**Interdiction :** ne pas présenter une formule HMAC comme officiellement confirmée. Un adaptateur peut prévoir une stratégie configurable, mais il doit refuser les webhooks tant que le mode configuré n’a pas été validé par SasPay.

### 10.5 Retries

SasPay documente cinq tentatives :

1. immédiatement ;
2. après 30 secondes ;
3. après 5 minutes ;
4. après 30 minutes ;
5. après 2 heures.

Après l’échec des cinq tentatives, la livraison devient `FAILED` et doit être relancée manuellement depuis le tableau de bord.

### 10.6 Événements

Les pages publiques consultées mentionnent notamment :

- `transaction.*` ;
- `payout.*` ;
- `wallet_transfer.*` ;
- `settlement.*`.

Le catalogue exact complet des valeurs `event_type` n’est pas affiché de manière exhaustive dans la page générale. Les événements `settlement.*` sont explicitement signalés comme encore en cours de fiabilisation au niveau du contenu de `data`.

### 10.7 Déduplication

Une empreinte de webhook doit être enregistrée dans un stockage durable avant le traitement métier. Une clé basée uniquement sur le statut et l’identifiant transaction peut être insuffisante si SasPay réémet plusieurs livraisons distinctes ; conserver également l’identifiant d’événement lorsqu’il est fourni ou un hash du corps brut.

---

## 11. WALLET ET TRANSFERTS INTERWALLET

### 11.1 Soldes

**Endpoint :**

```text
GET /merchant-balances/?page=1&page_size=20
```

La réponse contient notamment :

- `country` ;
- `currency` ;
- `available_amount` ;
- `pending_amount` ;
- `is_frozen`.

La documentation indique qu’il n’existe pas de filtre `?country=` sur cet endpoint. Récupérer les pages et filtrer côté application.

### 11.2 Taux de change

**Endpoint documenté :**

```text
GET /exchange-rates/
```

La documentation présente les taux comme lecture seule et utilisés notamment lors des transferts interwallet. Les taux renvoyés doivent être stockés avec la transaction lorsque la réconciliation l’exige.

### 11.3 Transfert interwallet

**Endpoint :**

```text
POST /wallet-transfers/
```

**Payload documenté :**

```json
{
  "from_country": "BJ",
  "to_country": "CM",
  "from_amount": "50000.00"
}
```

Le transfert peut être `PENDING` lorsque l’approbation administrateur est nécessaire ou `COMPLETED` si l’auto-approbation est activée.

Le header `Idempotency-Key` est important : sans lui, un retry peut réserver une seconde fois le montant sur le wallet source.

La documentation mentionne un seul transfert `PENDING` à la fois par marchand. Ce comportement doit être pris en compte dans la logique métier.

---

## 12. LIENS DE PAIEMENT

### 12.1 Créer un lien

**Endpoint :**

```text
POST /payment-links/
```

**Payload documenté :**

```json
{
  "name": "Facture boutique",
  "description": "Paiement en ligne",
  "amount_type": "FIXED",
  "amount": "15000.00",
  "currency": "XOF",
  "usage_limit": 100
}
```

La réponse contient notamment :

- `slug` ;
- `is_active` ;
- `usage_limit` ;
- `usage_count` ;
- `require_phone` ;
- `redirect_url` ;
- `custom_fields`.

### 12.2 Opérations documentées

L’index officiel liste :

- créer un lien ;
- lister les liens ;
- récupérer un lien ;
- modifier un lien ;
- supprimer un lien ;
- lister les transactions d’un lien.

La règle exacte d’idempotence de la création des liens n’est pas documentée dans les pages consultées. Ne pas traiter la création d’un lien comme idempotente sans confirmation.

---

## 13. ARCHITECTURE BACKEND RECOMMANDÉE

```text
Frontend PWA / application mobile
        |
        | crée une commande interne
        v
Backend Node.js / Cloud Function
        |
        | appelle SasPay avec sk_test ou sk_live
        v
SasPay API
        |
        | webhook signé
        v
Endpoint webhook brut
        |
        | vérifie timestamp + signature + déduplication
        v
Queue / transaction Firestore / SQL
        |
        | met à jour orders et payments
        v
Frontend : état métier confirmé
```

Le frontend ne doit jamais décider seul que le paiement est réussi. Il doit lire l’état métier produit par le backend.

### Modèle minimal recommandé

| Entité | Champs essentiels |
|---|---|
| `orders` | `id`, `userId`, `amount`, `currency`, `status` |
| `payments` | `orderId`, `providerPaymentId`, `flow`, `status`, `network`, `amount` |
| `payment_attempts` | `paymentId`, `idempotencyKey`, `attemptNumber`, `requestHash`, `status` |
| `webhook_events` | `eventKey`, `eventType`, `providerId`, `bodyHash`, `receivedAt`, `processedAt` |
| `payouts` | `orderId`, `providerPayoutId`, `recipient`, `status`, `idempotencyKey` |

---

## 14. RÈGLES DE CODE POUR L’ADAPTATEUR NODE.JS

Avant tout bloc de code, l’agent doit citer une section justificative. Exemple :

> **Justification : section 3 — Authentification et format des requêtes ; section 4 — Idempotence.** Le code ci-dessous ajoute le Bearer token et une clé d’idempotence sur une opération financière.

Le client doit :

- utiliser le `fetch` natif de Node.js 20 ou un client HTTP contrôlé ;
- appliquer un timeout ;
- conserver le corps de réponse en cas d’erreur ;
- ne jamais logger la clé API ;
- générer ou recevoir une clé d’idempotence ;
- séparer la logique provider de la logique métier ;
- vérifier les montants et devises contre la commande interne ;
- stocker l’identifiant SasPay ;
- ne pas créditer une commande à l’état `PENDING`.

### Webhook Express

> **Justification : section 10 — Webhooks.** Le endpoint doit utiliser un parser raw JSON, puis vérifier les headers avant de parser le payload.

```ts
app.post(
  "/webhooks/saspay",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const rawBody = request.body as Buffer;
    const timestamp = request.header("X-Webhook-Timestamp");
    const signature = request.header("X-Webhook-Signature");
    if (!timestamp || !signature) return response.status(400).json({ error: "Invalid webhook" });
    // La formule exacte doit être remplacée par celle confirmée par SasPay.
    const event = verifier.verify(rawBody, { timestamp, signature });
    const eventKey = buildDurableEventKey(rawBody, event);
    const firstDelivery = await eventStore.reserve(eventKey);
    if (!firstDelivery) return response.status(200).json({ received: true, duplicate: true });
    await queue.enqueue(event);
    return response.status(200).json({ received: true });
  },
);
```

Ce bloc illustre l’ordre de traitement, mais la formule `verifier.verify` doit rester alignée sur la spécification officielle SasPay confirmée pour votre compte.

---

## 15. GESTION DES ERREURS DOCUMENTÉES

| Code métier | Contexte documenté | Action |
|---|---|---|
| `api_key_scope_forbidden` | Scope insuffisant | Vérifier `PAYIN`, `PAYOUT` ou `BOTH` |
| `insufficient_balance` | Solde insuffisant | Ne pas retry automatiquement sans correction |
| `merchant_suspended` | Compte suspendu | Vérifier le dashboard/support |
| `invalid_method` | Réseau inconnu ou inactif | Recharger le catalogue réseau |
| `currency_country_mismatch` | Devise incompatible avec le pays | Vérifier le référentiel |
| `ip_not_whitelisted` | IP payout non autorisée | Configurer la whitelist |
| `not_found` | Transaction absente | Vérifier l’identifiant provider |
| `invalid_flow` | Mauvais type de transaction | Vérifier `INBOUND` ou `OUTBOUND` |
| `not_retryable` | Transaction non réessayable | Ne pas forcer le retry |
| `otp_not_applicable` | OTP non nécessaire pour ce réseau | Ne pas appeler l’endpoint OTP |
| `otp_confirmation_failed` | OTP refusé | Signaler un échec générique au client |
| `429` | Limite de débit atteinte | Backoff contrôlé |
| `409` | Conflit d’idempotence ou état incompatible | Réutiliser la clé ou corriger l’intention |

La liste des codes n’est pas nécessairement exhaustive. Les codes inconnus doivent être conservés dans les logs structurés et présentés comme inconnus.

---

## 16. SÉCURITÉ — RÈGLES ABSOLUES

1. La clé secrète reste côté backend.
2. Le webhook est reçu sur HTTPS.
3. Le corps brut est conservé avant parsing.
4. Le timestamp webhook est contrôlé.
5. La signature est comparée en temps constant.
6. Les événements sont dédupliqués dans un stockage durable.
7. Les montants sont vérifiés contre la commande interne.
8. Les secrets ne sont jamais écrits dans les logs.
9. Les OTP ne sont pas stockés en clair après traitement.
10. Les métadonnées envoyées à SasPay ne contiennent pas de données sensibles inutiles.
11. Les erreurs provider sont journalisées sans secret ni token.
12. Les retries financiers utilisent la même clé d’idempotence.

---

## 17. CHECKLIST DE VALIDATION AVANT PRODUCTION

- [ ] Compte marchand vérifié et KYC validé.
- [ ] Clé `sk_test_...` obtenue.
- [ ] Scope minimal choisi.
- [ ] Pays récupérés dynamiquement.
- [ ] Réseaux récupérés dynamiquement et filtrés par `is_active`.
- [ ] Softpay testé.
- [ ] Checkout testé.
- [ ] Vérification serveur testée.
- [ ] OTP testé si le réseau le nécessite.
- [ ] Retry d’un paiement `FAILED` testé.
- [ ] Payout testé avec whitelist IP.
- [ ] Idempotence testée après timeout simulé.
- [ ] Webhook reçu avec corps brut.
- [ ] Formule de signature confirmée officiellement.
- [ ] Timestamp anti-rejeu testé.
- [ ] Doublon webhook testé.
- [ ] Événement hors ordre testé.
- [ ] `429` testé avec backoff.
- [ ] Montant et devise vérifiés avant passage à `SUCCESS`.
- [ ] Logs et réconciliation validés.
- [ ] Passage de `sk_test_...` à `sk_live_...` contrôlé.

---

## 18. INCONNUS À CONFIRMER AUPRÈS DE SASPAY

Les éléments suivants ne doivent pas être inventés :

1. La formule exacte de signature webhook.
2. Le nom et le rôle du troisième header webhook.
3. Le format exact de la signature : hex, base64 ou autre.
4. La base URL sandbox séparée, si elle existe pour le compte.
5. La liste exhaustive des événements webhook.
6. Les limites de montant par pays et réseau.
7. Les tarifs complets par opération.
8. Les délais de finalisation par opérateur.
9. La rétention exacte des logs webhook.
10. Les garanties de livraison dans l’ordre des événements.
11. La compatibilité exacte des réseaux `card` et `crypto` selon les pays.
12. Les règles détaillées de remboursement, puisque la documentation consultée ne fournit pas d’endpoint de remboursement direct dans l’index principal.

---

## 19. INVENTAIRE OFFICIEL DES GROUPES D’ENDPOINTS

| Groupe | Routes ou fonctions listées |
|---|---|
| Paiements | Softpay, Checkout, liste Checkout, détail Checkout, annulation Checkout, vérification, OTP, retry |
| Payouts | Initialisation, vérification |
| Transactions | Liste, détail, export CSV, facture PDF, tentatives, logs de statut |
| Payment links | Création, liste, détail, modification, suppression, transactions associées |
| Wallet | Balances, détail balance, taux de change, transferts interwallet, détail transfert, liste transferts |
| Webhooks | Webhooks, détail webhook, abonnements, détail abonnement, logs, détail log |
| Référentiel | Pays, détail pays, réseaux, détail réseau, formats téléphone |
| Compte | Inscription, connexion, KYC et création de clés via le dashboard/session |

---

## 20. SOURCES OFFICIELLES

- Documentation : `https://docs.saspay.me/`
- Index : `https://docs.saspay.me/llms.txt`
- Account setup : `https://docs.saspay.me/account-setup`
- Quickstart : `https://docs.saspay.me/quickstart`
- Introduction API : `https://docs.saspay.me/api-reference/introduction`
- Paiements : `https://docs.saspay.me/api-reference/payments`
- Softpay : `https://docs.saspay.me/api-reference/payments/softpay`
- Checkout : `https://docs.saspay.me/api-reference/payments/checkout-create`
- Vérification paiement : `https://docs.saspay.me/api-reference/payments/verify`
- OTP : `https://docs.saspay.me/api-reference/payments/confirm-otp`
- Retry paiement : `https://docs.saspay.me/api-reference/payments/retry`
- Payout : `https://docs.saspay.me/api-reference/payouts/initialize`
- Vérification payout : `https://docs.saspay.me/api-reference/payouts/verify`
- Transactions : `https://docs.saspay.me/api-reference/transactions`
- Liste transactions : `https://docs.saspay.me/api-reference/transactions/list`
- Détail transaction : `https://docs.saspay.me/api-reference/transactions/get`
- Wallet balances : `https://docs.saspay.me/api-reference/wallet/balances-list`
- Wallet transfer : `https://docs.saspay.me/api-reference/wallet/wallet-transfers-create`
- Réseaux : `https://docs.saspay.me/api-reference/reference/networks`
- Formats : `https://docs.saspay.me/api-reference/reference/formats`
- Payment links : `https://docs.saspay.me/api-reference/payment-links/create`
- Webhooks : `https://docs.saspay.me/api-reference/webhooks`
- OpenAPI : `https://docs.saspay.me/api-reference/openapi.json`
- Endpoint pays public : `https://api.saspay.me/api/v1/countries/`

---

*Document de grounding généré à partir des pages officielles SasPay consultées le 24 septembre 2026.*
*Ce document doit être mis à jour lorsque SasPay modifie son API ou publie la formule officielle de signature webhook.*
