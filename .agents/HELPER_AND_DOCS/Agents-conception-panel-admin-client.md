---
agent: Agents-conception-panel-admin-client
commande: admin:conception
declencheurs:
  - conception panel admin
  - back-office client non-développeur
  - dashboard administration
  - interface de gestion
action: Conception d'un panel d'administration sur-mesure pour utilisateur non-développeur en 4 étapes cadrées (cadrage, spécification modulaire, design tokens, plan de livraison)
---

# AGENTS — Conception Panel Admin Client (non-développeur)

> Usage : un agent ayant accès au repo du projet (Claude Code, Cursor, Antigravity, etc.)

---

## CONTEXTE
Tu conçois le panel d'administration de **[PROJET]** pour un propriétaire **non-développeur**. Cette personne devra gérer le contenu/l'activité de la plateforme **au quotidien, seule, sans jamais toucher au code**. Le panel doit être au niveau d'usabilité d'un back-office WordPress : intuitif, sans jargon technique, sans risque de casser le site en cliquant au mauvais endroit.

Tu ne codes RIEN avant validation explicite à chaque étape.

---

## ÉTAPE 1 — CADRAGE
Confirme avant tout :
- Type d'application : `[TYPE_APP]`
- Combien de personnes utiliseront le panel côté client (1 personne, ou plusieurs avec des rôles différents — ex: rédacteur vs rédacteur en chef) ?
- Fréquence d'usage attendue (quotidienne, hebdo, ponctuelle) — ça change le niveau de friction tolérable.
- **Stack technique et hébergement du projet** : backend (ou absence de backend — site statique), solution de stockage de fichiers (bucket S3/Cloudinary/local/aucune), présence ou non de tâches planifiées (cron), support des webhooks côté hébergeur. C'est déterminant : plusieurs fonctionnalités du panel (upload vidéo, publication programmée, déblocage automatique après paiement) ne sont possibles QUE si l'infrastructure le permet.

➡️ Tu à clarifier et attends ma confirmation sur ces 5 points avant de spécifier quoi que ce soit.

## ÉTAPE 2 — SPÉCIFICATION DU PANEL (modulaire)

### 2.0 Socle commun (TOUJOURS inclus, quel que soit le type d'app)
- **Authentification simple** : connexion email/mot de passe, réinitialisation de mot de passe en autonomie (sans appeler le développeur).
- **Dashboard d'accueil** : vue d'ensemble en langage humain, pas des métriques techniques.
- **Gestion de contenu CRUD** : créer/modifier/supprimer avec confirmation explicite avant suppression définitive (pas de suppression accidentelle en un clic).
- **Bibliothèque média** : upload image/vidéo par glisser-déposer, compression/optimisation automatique côté serveur (le client ne doit jamais avoir à redimensionner une image lui-même).
- **Aperçu avant publication** : voir le rendu final avant que ce soit visible publiquement.
- **Historique / annulation** : pouvoir revenir à la version précédente d'un contenu en cas d'erreur, sans intervention technique.
- **Responsive admin** : le panel doit être utilisable depuis un téléphone (le client postera souvent depuis son mobile, pas un ordinateur).
- **Gestion des rôles** (si plusieurs utilisateurs identifiés à l'étape 1) : qui peut publier directement vs qui doit soumettre pour validation. Inspiré des patterns clients WordPress : donner à chaque rôle un menu simplifié montrant uniquement ce qui le concerne (pas le menu complet caché en CSS — vraiment absent pour ce rôle), avec un vocabulaire renommé selon le métier du client (ex: "Posts" devient "Articles", "Products" devient "Produits").
- **Message d'accueil sur le dashboard** avec un contact support visible.
- **Hygiène accessibilité de base** (à coût quasi nul si prévu dès le départ, coûteux à corriger après coup — pas un audit WCAG complet, juste les réflexes de base) :
  - Champ "texte alternatif" obligatoire à l'upload de chaque image (utile aussi pour le SEO du module presse/blog).
  - Contraste texte/fond suffisant dans l'UI du panel (éviter le gris clair sur blanc).
  - Panel utilisable au clavier (tab, entrée) sans piège de focus, sans dépendre uniquement de la souris.
  - Ces trois points ne déclenchent pas une conformité WCAG complète — à réserver pour un client avec un besoin explicite (institution publique, contrainte légale connue, utilisateur en situation de handicap identifié).

### 2.0bis Règles de disposition et de hiérarchie visuelle (à respecter dans TOUTE conception, tous modules confondus)
- **Navigation latérale fixe** : icône + libellé métier, item actif clairement distinct (couleur pleine, pas un simple soulignement discret qu'on peut manquer).
- **Dashboard d'accueil orienté tâche, pas décoratif** : salutation personnalisée + 3-4 indicateurs chiffrés en langage humain + une section "Que voulez-vous faire ?" avec 2-3 actions numérotées menant directement à la tâche la plus fréquente. Un dashboard qui n'affiche que des métriques sans proposer d'action est incomplet.
- **Regroupement par onglets thématiques** pour tout écran de réglages avec plus de 6-8 champs — jamais un formulaire unique interminable à faire défiler.
- **États vides explicites** : jamais un tableau ou une liste vide sans explication.
- **Isolement visuel des actions destructrices** : couleur d'alerte distincte ET position éloignée des actions courantes/fréquentes — ne jamais placer un bouton de suppression ou de réinitialisation au même niveau visuel que la navigation entre sections ou à côté d'un bouton utilisé souvent (risque de clic accidentel). Confirmation obligatoire avant exécution, sans exception.
- **Identité visuelle du CLIENT, pas celle du développeur** : couleurs/typographie du panel doivent respecter la charte du client si elle existe, pas les préférences esthétiques par défaut du développeur.


- **Gestion produits** : ajout/modif avec variantes (taille, couleur, poids), prix, description, photos multiples avec ordre d'affichage réorganisable, produits liés/suggérés
- **Gestion stock** : alerte rupture de stock, mise à jour quantité, seuil d'alerte configurable, historique des mouvements de stock
- **Gestion commandes** : statuts (en attente/confirmée/expédiée/livrée/annulée), export liste commandes (CSV), impression bon de livraison, notes internes par commande
- **Paiements** : suivi des transactions Mobile Money/Kkiapay/FedaPay, statut de paiement visible par commande, pas de saisie manuelle de montants par le client (risque d'erreur/fraude), rapprochement automatique commande↔paiement
- **Livraison** : zones de livraison avec frais associés, délai estimé affiché au client final
- **Promotions** : codes promo, soldes temporaires avec dates de début/fin automatiques, réductions par catégorie ou produit
- **Avis clients** : modération avant publication (approuver/rejeter), réponse du vendeur visible
- **Rapports simples** : produits les plus vendus, chiffre d'affaires par période — en graphiques lisibles, pas en tableaux bruts

### 2.2 Module spécifique — PRESSE / BLOG (si `[TYPE_APP] = presse_blog`)
- **Éditeur de texte riche** (type WYSIWYG, pas de markdown si le client n'est pas technique), insertion d'images/vidéos intégrée à l'éditeur
- **Statuts éditoriaux** : brouillon / en relecture / publié / archivé, avec workflow de validation si plusieurs rôles (rédacteur → rédacteur en chef)
- **Planification de publication** (programmer un article pour une date/heure future), calendrier éditorial visuel
- **Catégories et tags** pour organiser le contenu, avec suggestion automatique de tags existants pour éviter les doublons
- **Gestion multi-auteurs** avec attribution claire, page profil auteur simple
- **Modération des commentaires** si activés (approuver/rejeter/bannir), filtre anti-spam basique
- **SEO basique par article** : titre, méta-description, image de partage — avec valeurs par défaut intelligentes si le client ne remplit rien
- **Newsletter** (si applicable) : liste d'abonnés visible, envoi manuel d'une sélection d'articles, désabonnement en un clic côté lecteur
- **Statistiques simples de lecture** : articles les plus lus sur les 7/30 derniers jours, en langage clair

### 2.3 Module spécifique — PORTFOLIO (si `[TYPE_APP] = portfolio`)
- **Édition de sections statiques** (à propos, services, contact) en remplissant des champs simples, pas en éditant du HTML
- **Galerie de projets** : ajout/réorganisation par glisser-déposer, catégorisation par type de projet
- **Formulaire de contact** : le client doit voir les messages reçus directement dans le panel (pas seulement par email, au cas où il perd l'email), marquage lu/non lu
- **Témoignages clients** : ajout/suppression, réorganisation de l'ordre d'affichage
- **CV / expériences** (si portfolio personnel) : ajout d'entrées chronologiques sans toucher au code

### 2.4 Module spécifique — RÉSERVATION / RENDEZ-VOUS (si `[TYPE_APP] = reservation`)
*Services, consulting, santé, salon de coiffure, etc.*
- **Calendrier de disponibilités** : créneaux ouverts/fermés par jour, blocage rapide d'une plage (congé, imprévu) en 2 clics
- **Gestion des réservations** : liste chronologique claire (aujourd'hui en premier), statuts (confirmée/en attente/annulée), coordonnées du client visibles immédiatement
- **Confirmation automatique** : notification au client (SMS/WhatsApp/email) à la réservation et rappel avant le rendez-vous — configuration du délai de rappel sans toucher au code
- **Gestion des services proposés** : durée, prix, description par prestation, activation/désactivation rapide d'un service
- **Annulation/report** : le propriétaire peut annuler ou reporter un RDV avec notification automatique au client, motif optionnel
- **Vue par praticien/collaborateur** (si plusieurs personnes prennent des RDV) : chacun ne voit que son propre agenda sauf le propriétaire qui voit tout

### 2.5 Module spécifique — ÉVÉNEMENTIEL / BILLETTERIE (si `[TYPE_APP] = evenementiel`)
*Concerts, circuits touristiques, conférences, ateliers*
- **Gestion d'événements** : création avec date, lieu, description, image, capacité maximale
- **Billetterie** : types de billets (standard/VIP/groupe) avec prix et quantité disponible, vente en ligne liée aux moyens de paiement locaux (Mobile Money/Kkiapay/FedaPay)
- **Suivi des ventes en temps réel** : nombre de places restantes visible immédiatement, alerte à l'approche de la capacité max
- **Liste des participants** : export pour contrôle d'accès le jour J (nom, type de billet, statut payé/non payé)
- **Programme/planning** : ajout de sessions ou d'étapes (utile pour un circuit touristique avec plusieurs lieux) modifiable sans redéploiement
- **Communication** : envoi d'un message groupé aux inscrits (rappel, changement de lieu, annulation)

### 2.6 Module spécifique — IMMOBILIER / ANNONCES (si `[TYPE_APP] = immobilier`)
- **Gestion des annonces** : ajout/modif avec photos multiples, prix, superficie, statut (disponible/réservé/vendu-loué), champs spécifiques par type de bien (terrain/maison/appartement)
- **Géolocalisation** : ville/quartier avec carte si possible, pour que le client n'ait pas à décrire l'emplacement en texte libre uniquement
- **Statut de disponibilité en un clic** : marquer un bien comme réservé/vendu retire immédiatement l'annonce des résultats publics, sans suppression définitive (historique conservé)
- **Demandes de contact** : centralisation des demandes reçues par annonce, avec l'annonce concernée clairement identifiée
- **Mise en avant** : possibilité d'épingler une annonce en haut de liste (bien à vendre en priorité) sans notion technique de "featured" ou "priority order"

### 2.7 Module spécifique — FORMATION EN LIGNE (si `[TYPE_APP] = formation_en_ligne`)
*Cours, vidéos, élèves*
- **Gestion des cours** : structure en modules/leçons, réorganisation par glisser-déposer, statut brouillon/publié par leçon
- **Upload de contenu** : vidéo, PDF, quiz — avec indication claire de la taille/durée acceptée pour éviter les erreurs d'upload frustrantes
- **Gestion des élèves** : liste des inscrits par cours, suivi de progression en pourcentage simple (pas de jargon LMS type "completion rate")
- **Quiz/évaluations** : création de questions à choix simple sans écrire de code, correction automatique si QCM
- **Certificats** (si applicable) : génération automatique à la fin du cours, téléchargeable par l'élève
- **Paiement à l'inscription** : accès au cours débloqué automatiquement après paiement confirmé (Mobile Money/Kkiapay/FedaPay), pas de déblocage manuel par le propriétaire

➡️ Tu m'envoies la liste complète des fonctionnalités du panel pour validation, module par module. J'approuve, je retire, ou j'ajoute avant que tu codes quoi que ce soit.

### 2.8 Vérification de faisabilité (OBLIGATOIRE avant de présenter la spec)
Pour CHAQUE fonctionnalité listée ci-dessus, avant de me la présenter, vérifie qu'elle est réellement réalisable avec le stack et l'hébergement confirmés à l'étape 1. N'annonce jamais une fonctionnalité comme acquise si elle dépend d'une infrastructure absente. Ajoute une colonne "Faisabilité" à la spec : `✅ Faisable tel quel` / `⚠️ Faisable avec alternative` / `❌ Non faisable sans changement d'infra`.

Cas fréquents où la faisabilité doit être vérifiée en priorité (liste non exhaustive, à titre de repères) :
| Fonctionnalité annoncée | Dépend de | Si absent, alternative à proposer |
|---|---|---|
| Upload direct de vidéo dans le panel | Stockage serveur avec espace suffisant (bucket S3/Cloudinary/Bunny.net, pas juste un hébergement statique) | Upload vers un service tiers gratuit/payant avec clé API, ou lien vers vidéo hébergée ailleurs (YouTube non-listé, Vimeo) saisi manuellement |
| Compression/optimisation automatique d'image | Traitement serveur (ex: `sharp` en Node.js) ou service tiers | Limite de taille/format imposée à l'upload + compression manuelle recommandée au client, ou service externe (Cloudinary, imgix) |
| Publication programmée (date/heure future) | Tâche planifiée (cron) côté serveur, ou service de jobs | Rappel manuel au client (notification à l'heure prévue plutôt que publication réellement automatique), ou service de cron externe (ex: cron-job.org, GitHub Actions programmé) |
| Notifications SMS/WhatsApp automatiques | Intégration API tierce payante (Twilio, WhatsApp Business API) | Notification par email uniquement en V1, SMS/WhatsApp en V2 si budget client le permet |
| Déblocage automatique après paiement (formation, billetterie) | Webhook du fournisseur de paiement (Kkiapay/FedaPay) supporté par l'hébergeur | Vérification manuelle des paiements avec déblocage par le propriétaire en attendant, ou changement d'hébergeur si le webhook est bloqué |
| Génération de PDF (certificats, factures) | Librairie serveur ou service de génération PDF | Généralement faisable même sans backend lourd — mais vérifier les limites de taille/temps d'exécution sur hébergement serverless |

Si une fonctionnalité tombe en `❌ Non faisable sans changement d'infra`, ne la retire pas silencieusement de la spec — présente-la quand même avec son alternative, pour que je décide (changer d'infra, accepter l'alternative, ou abandonner la fonctionnalité pour ce projet).

## ÉTAPE 3 — CONSTRUCTION
Une fois la spec validée :
- Implémente module par module, pas en bloc.
- Chaque fonctionnalité livrée doit être accompagnée d'un test manuel décrit (étapes précises pour vérifier qu'elle marche).

## ÉTAPE 4 — TEST D'USABILITÉ NON-DÉVELOPPEUR (obligatoire avant livraison)
Simule un utilisateur non-technique effectuant les tâches quotidiennes types selon le module concerné (ex : publier un article avec image, ajouter un produit, modifier une section du portfolio, bloquer un créneau de RDV, créer un événement avec billetterie, publier une annonce immobilière, ajouter une leçon à un cours). Pour chaque tâche :
- Nombre de clics nécessaires (seuil indicatif : plus de 7 clics pour une tâche quotidienne = friction à corriger)
- Y a-t-il un point où l'action n'est pas évidente sans explication ?
- Y a-t-il un risque de casser quelque chose de façon irréversible par erreur ?

Évalue aussi chaque module contre les 10 heuristiques d'utilisabilité de Nielsen (référence standard en UX, Nielsen Norman Group) :
1. **Visibilité de l'état du système** — le client sait-il toujours ce qui se passe (chargement, succès, échec) ?
2. **Adéquation avec le monde réel** — vocabulaire métier du client, pas de jargon technique.
3. **Contrôle et liberté** — peut-il annuler une action, revenir en arrière sans conséquence ?
4. **Cohérence et standards** — un même type de bouton se comporte toujours pareil dans tout le panel.
5. **Prévention des erreurs** — confirmation avant action destructive, champs qui empêchent la saisie invalide plutôt que de la corriger après coup.
6. **Reconnaissance plutôt que rappel** — les options visibles à l'écran, pas à mémoriser d'une session à l'autre.
7. **Flexibilité et efficacité d'usage** — raccourcis utiles à un usage répété (ex: dupliquer un article) sans complexifier l'usage basique.
8. **Design minimaliste** — le dashboard n'affiche que l'essentiel, pas 30 métriques sans hiérarchie.
9. **Aide à la reconnaissance et récupération des erreurs** — messages d'erreur en langage clair avec solution proposée, jamais un code d'erreur brut.
10. **Aide et documentation** — accessible en contexte, courte, orientée tâche (relié au mini-guide de l'étape 5).

Documente chaque friction trouvée (heuristique violée + description + correction proposée) dans un tableau. Limite-toi aux 15 frictions les plus importantes si la liste est plus longue — priorise par impact sur l'usage quotidien. Ne déclare jamais le panel "prêt" sans avoir fait ce test explicitement.
---

## RÈGLES TRANSVERSALES
- Aucun terme technique visible dans l'UI du panel (pas de "slug", "payload", "endpoint" — utilise le vocabulaire métier du client).
- Toute action destructrice (suppression, désactivation) doit avoir une confirmation explicite.
- Le panel doit fonctionner même si le client ne comprend rien au code — c'est le seul critère de réussite qui compte, pas l'élégance technique.
