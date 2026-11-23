Je veux que tu analyses le système de FEEDBACK actuellement présent dans ce projet et que tu en extraies un TEMPLATE DE SYSTÈME DE FEEDBACK RÉUTILISABLE pour mes futurs projets.

IMPORTANT :

Je ne veux pas simplement copier le formulaire ou son apparence.

Je veux identifier et isoler le système complet :

- point d'accès au feedback ;
- interface ;
- formulaire ;
- validation ;
- états ;
- interactions ;
- stockage ;
- traitement des données ;
- confirmation ;
- gestion des erreurs ;
- administration éventuelle ;
- responsive ;
- accessibilité ;
- sécurité ;
- anti-spam ;
- notifications éventuelles.

L'objectif est de créer un système générique que je pourrai réutiliser sur différents projets.

Sur chaque nouveau projet, je veux pouvoir conserver le même fonctionnement général tout en adaptant :

- couleurs ;
- typographies ;
- logo ;
- identité visuelle ;
- textes ;
- champs nécessaires ;
- système de données propre au projet.

---

PHASE 1 — AUDIT DU SYSTÈME ACTUEL

Ne modifie rien au début.

Analyse précisément le système de feedback existant.

Identifie :

1. Point d'accès

Analyse comment l'utilisateur accède au feedback :

- bouton ;
- lien ;
- footer ;
- menu ;
- widget ;
- section dédiée ;
- modal ;
- autre mécanisme.

Analyse également :

- position ;
- comportement ;
- état au survol ;
- comportement mobile ;
- visibilité ;
- accessibilité.

2. Interface

Analyse la structure exacte du système :

- bouton d'accès ;
- modal ou page ;
- titre ;
- description ;
- champs ;
- sélection éventuelle d'une catégorie ;
- notation éventuelle ;
- zone de commentaire ;
- pièces jointes éventuelles ;
- consentement ;
- bouton d'envoi ;
- bouton d'annulation ;
- message de confirmation.

Ne te contente pas d'observer visuellement.

Analyse également la logique derrière chaque élément.

3. Types de feedback

Identifie précisément quels types de feedback le système permet de collecter.

Par exemple :

- avis ;
- suggestion ;
- bug ;
- problème ;
- demande de fonctionnalité ;
- satisfaction ;
- commentaire général.

Ne suppose rien : vérifie ce qui existe réellement dans le code.

4. Validation

Analyse :

- champs obligatoires ;
- champs optionnels ;
- longueur minimale/maximale ;
- formats acceptés ;
- messages d'erreur ;
- validation côté client ;
- validation côté serveur ;
- comportement lorsque les données sont invalides.

5. États du système

Identifie tous les états possibles :

idle
↓
formulaire
↓
validation
↓
envoi
↓
succès
ou
erreur

Identifie également :

- état de chargement ;
- double soumission ;
- perte de connexion ;
- erreur serveur ;
- fermeture du formulaire ;
- réouverture ;
- réinitialisation.

6. Données

Analyse précisément quelles données sont collectées.

Pour chaque donnée, indique :

- nom ;
- type ;
- obligatoire ou non ;
- utilité ;
- emplacement de stockage ;
- durée de conservation si identifiable ;
- éventuelles données personnelles.

7. Stockage

Identifie exactement comment les feedbacks sont stockés.

Analyse :

- base de données ;
- collection/table ;
- structure d'un feedback ;
- identifiant ;
- timestamp ;
- utilisateur éventuel ;
- statut ;
- métadonnées ;
- relations éventuelles.

Vérifie également si le système dépend directement de données ou collections spécifiques au projet actuel.

8. Administration

Si le projet possède une interface d'administration, analyse :

- affichage des feedbacks ;
- filtres ;
- recherche ;
- statut ;
- lecture ;
- traitement ;
- archivage ;
- suppression ;
- export ;
- réponse éventuelle.

Si aucune administration n'existe, indique-le clairement.

9. Notifications

Analyse si le système déclenche :

- notification utilisateur ;
- notification administrateur ;
- email ;
- notification interne ;
- webhook ;
- autre mécanisme.

Ne suppose pas qu'une notification existe : vérifie le code.

---

PHASE 2 — SÉPARER LE GÉNÉRIQUE DU SPÉCIFIQUE

Sépare clairement :

A. CE QUI DOIT APPARTENIR AU TEMPLATE

Par exemple :

- architecture du formulaire ;
- composants ;
- états ;
- validation ;
- gestion des erreurs ;
- logique de soumission ;
- modèle de données générique ;
- système de statut ;
- accessibilité ;
- responsive ;
- sécurité ;
- anti-spam ;
- administration générique si elle est réellement réutilisable.

B. CE QUI DOIT RESTER SPÉCIFIQUE AU PROJET

Par exemple :

- couleurs ;
- typographies ;
- logo ;
- textes ;
- nom du projet ;
- champs particuliers ;
- catégories spécifiques ;
- règles métier spécifiques ;
- base de données spécifique ;
- emails spécifiques.

---

PHASE 3 — CONCEPTION DU TEMPLATE

Transforme le système actuel en un système générique et configurable.

Le système doit idéalement permettre de configurer :

- les champs ;
- les types de feedback ;
- les labels ;
- les placeholders ;
- les champs obligatoires ;
- les catégories ;
- les messages ;
- les statuts ;
- les fonctionnalités activées.

Exemple conceptuel :

feedbackConfig = {
  types: [...],
  fields: [...],
  requireAuthentication: false,
  allowAttachments: false,
  allowRating: true,
  enableAdminPanel: true
}

Adapte évidemment cette structure au framework et à l'architecture réellement utilisés.

Ne crée pas artificiellement cette structure si elle ne correspond pas au projet.

---

PHASE 4 — ARCHITECTURE

Propose une architecture modulaire.

Par exemple, conceptuellement :

Feedback/
├── FeedbackTrigger
├── FeedbackModal
├── FeedbackForm
├── FeedbackField
├── FeedbackRating
├── FeedbackSuccess
├── FeedbackError
├── FeedbackAdmin
├── FeedbackFilters
├── FeedbackService
├── FeedbackValidation
├── FeedbackTypes
└── configuration

Cette liste est indicative.

Utilise uniquement les composants réellement nécessaires.

Évite absolument un composant monolithique contenant toute la logique.

---

PHASE 5 — SÉCURITÉ

Analyse spécifiquement les risques du système de feedback.

Vérifie notamment :

- spam ;
- abus de formulaire ;
- injections ;
- XSS ;
- données utilisateur non fiables ;
- validation côté serveur ;
- contrôle d'accès ;
- exposition de données ;
- accès à l'administration ;
- rate limiting ;
- CAPTCHA ou mécanisme équivalent si pertinent ;
- pièces jointes si elles existent.

Ne considère jamais la validation frontend comme suffisante.

---

PHASE 6 — DONNÉES PERSONNELLES

Identifie les données potentiellement personnelles.

Par exemple :

- nom ;
- email ;
- identifiant utilisateur ;
- adresse IP ;
- informations techniques ;
- pièces jointes.

Explique pour chaque donnée si elle est réellement nécessaire au fonctionnement du système.

Ne collecte pas automatiquement des données simplement parce qu'elles sont disponibles.

---

PHASE 7 — RESPONSIVE ET ACCESSIBILITÉ

Vérifie le comportement sur :

- desktop ;
- tablette ;
- mobile.

Vérifie également :

- navigation clavier ;
- focus ;
- labels ;
- messages d'erreur accessibles ;
- lecteurs d'écran ;
- fermeture des modales ;
- focus trap si nécessaire ;
- contraste ;
- taille des zones interactives.

---

PHASE 8 — RÉUTILISABILITÉ

Le système final doit pouvoir être intégré dans un autre projet sans dépendre accidentellement du projet actuel.

Il doit être possible de remplacer :

- design system ;
- contenu ;
- configuration ;
- stockage ;
- authentification ;
- notifications.

sans devoir réécrire entièrement le système.

Si certaines parties ne peuvent raisonnablement pas être généralisées, identifie-les clairement.

---

PHASE 9 — DOCUMENTATION

Le template devra disposer d'un README expliquant :

- son architecture ;
- ses composants ;
- sa configuration ;
- ses dépendances ;
- son installation ;
- son intégration ;
- sa configuration des champs ;
- sa configuration du stockage ;
- sa configuration de l'administration ;
- sa configuration de la sécurité ;
- son fonctionnement ;
- les éléments spécifiques à adapter dans un nouveau projet.

Ajoute un exemple minimal d'utilisation.

---

PHASE 10 — EXPORT

À la fin de l'implémentation validée, prépare le système comme un TEMPLATE AUTONOME ET EXPORTABLE.

Je ne veux pas récupérer les fichiers un par un.

Prépare un dossier contenant uniquement les éléments nécessaires :

feedback-system-template/
├── components/
├── services/
├── validation/
├── types/
├── config/
├── styles/
├── README.md
└── example/

Adapte cette structure au projet réel.

Sépare complètement :

1. le code générique ;
2. la configuration ;
3. les données propres au projet actuel.

Si ton environnement permet de créer une archive, génère également :

"feedback-system-template.zip"

Le ZIP ne doit contenir :

- node_modules ;
- fichiers temporaires ;
- secrets ;
- clés API ;
- données personnelles réelles ;
- données propres au projet qui ne sont pas nécessaires au fonctionnement générique.

---

PHASE 11 — NE PAS MODIFIER AVANT VALIDATION

Avant toute modification :

1. réalise l'audit ;
2. présente ce qui existe ;
3. identifie ce qui peut être généralisé ;
4. propose l'architecture ;
5. identifie les risques ;
6. présente le plan d'extraction ;
7. attends ma validation.

Ne modifie pas le code avant mon approbation.

Après validation, travaille étape par étape.

À chaque étape importante, vérifie que les fonctionnalités existantes continuent de fonctionner.

OBJECTIF FINAL :

Créer un système de feedback réutilisable sur mes futurs projets.

Même architecture générale.
Même logique.
Même expérience utilisateur.

Mais :

Contenu + identité visuelle + configuration + données + règles métier = adaptables à chaque projet.