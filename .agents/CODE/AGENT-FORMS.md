---
agent: AGENT-FORMS
commande: prompt:forms
role: agent-prompt-module
module: tableaux-formulaires
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - tableau de données table-data
  - formulaire multi-étapes form-stepper
  - formulaire de contact form-contact
  - filtres avancés et recherche table-filters
  - validation de formulaire
action: Module de prompts spécialisés pour la conception de tableaux de données riches et de formulaires interactifs complexes
---

# MODULE — Tableaux & Formulaires
> Charger AGENT-CORE.md avant ce module.
## 10. TABLEAUX DE DONNÉES

---

### `table-data` — Tableau de données

**Rôle :** Afficher, trier, filtrer et agir sur des données structurées.

**Variantes :** simple · avec filtres · avec tri · avec pagination · avec sélection multiple · avec actions · avec édition inline · avec export · tableau de dashboard

**Brief requis :** type de données affichées · actions disponibles sur les lignes · volume de données · besoins de filtrage et de tri

**ÉTAPE 1 — Audit**
Analyser : type de données (utilisateurs, commandes, produits, transactions, logs) · volume et fréquence de mise à jour · actions disponibles par ligne (voir, modifier, supprimer, exporter) · filtres et tri nécessaires · responsivité mobile requise.
Déterminer : colonnes à afficher et leur priorité · colonnes à masquer sur mobile · comportement au clic sur une ligne · sélection multiple si applicable · export si applicable.

**ÉTAPE 2 — Conception**
Produire :
1. Liste des colonnes : label, type de données, triable ou non.
2. Filtres disponibles (par colonne, global, ou les deux).
3. Actions disponibles par ligne (boutons inline, menu contextuel, ou les deux).
4. Comportement de sélection multiple et actions en masse si applicable.
5. Format d'export si applicable (CSV, Excel, PDF).
6. Comportement sur mobile (scroll horizontal, colonnes prioritaires, vue carte).
7. État vide (aucune donnée, aucun résultat de filtre).
8. État de chargement (skeleton au format de la grille finale).
9. Libellés des confirmations pour actions destructives (suppression, archivage).

**ÉTAPE 3 — Proposition**
Présenter : structure complète du tableau · colonnes retenues avec justification · variantes sélectionnées · comportement mobile. Attendre validation.

**ÉTAPE 4 — Implémentation**
Le tableau doit avoir :
- En-têtes cliquables pour le tri avec indicateur visuel de direction
- Filtres accessibles sans quitter la vue (sidebar, dropdown, ou chips)
- Pagination ou scroll selon le volume
- Sélection multiple avec barre d'actions en masse si applicable
- Actions par ligne au hover ou en menu contextuel
- Feedback pour chaque action (toast de confirmation)
- Scroll horizontal ou vue carte sur mobile
- État vide avec message et CTA
- Skeleton de chargement au format de la grille finale

Règle : ne jamais afficher plus de 8 colonnes sans permettre de les masquer.

---
---

## 11. FORMULAIRES

---

### `form-data` — Formulaire

**Rôle :** Collecter des données utilisateur avec le minimum de friction.

**Variantes :** contact · inscription · connexion · multi-étapes · upload fichier · recherche avancée · paramètres · paiement

**Brief requis :** objectif du formulaire · données à collecter · étapes si multi-étapes · validations requises

**ÉTAPE 1 — Audit**
Analyser : objectif du formulaire · champs actuels et leur nécessité réelle · taux d'abandon si disponible · validations existantes · messages d'erreur actuels · intégrations (CRM, paiement, stockage).
Déterminer : champs strictement nécessaires vs champs à reporter · ordre optimal · type de validation par champ (temps réel vs submit) · comportement post-soumission.

**ÉTAPE 2 — Conception**
Produire :
1. Liste des champs : label, type (text/email/select/date/file…), requis ou optionnel, règles de validation.
2. Ordre optimal des champs (du plus simple au plus complexe).
3. Groupement en sections logiques si formulaire long.
4. Placeholders et textes d'aide par champ.
5. Messages d'erreur spécifiques par champ et par type d'erreur (pas un message générique unique).
6. Message de succès post-soumission.
7. Pour multi-étapes : contenu de chaque étape + titre + indicateur de progression.
8. Pour paiement : intégration provider (Stripe, PayDunya, etc.) + réassurance (SSL, icônes).
9. Pour upload : types de fichiers acceptés + taille max + prévisualisation.
10. Comportement mobile : taille des zones de touch, clavier adapté par type de champ.

**ÉTAPE 3 — Proposition**
Présenter : structure complète · champs avec justification · messages d'erreur et de succès · comportement post-soumission. Attendre validation.

**ÉTAPE 4 — Implémentation**
Le formulaire doit :
- Valider en temps réel au blur (quitter le champ), pas uniquement au submit
- Afficher les erreurs sous chaque champ concerné (pas uniquement en haut de page)
- Conserver les données saisies si le submit échoue (jamais réinitialiser)
- Supporter l'autofill navigateur sur les champs standards
- Afficher un indicateur de chargement sur le bouton de submit pendant la requête
- Désactiver le bouton de submit pendant l'envoi (anti-double soumission)
- Être accessible (labels liés aux inputs, erreurs via aria-describedby)
- Adapter le type de clavier mobile par type de champ (email, tel, numeric)
- Pour multi-étapes : sauvegarder la progression + permettre de revenir en arrière sans perdre les données

Règle absolue : ne jamais afficher un formulaire sans message de confirmation post-soumission.

---

*HG Prompt · v1.1 · 2026*
*75 prompts · 11 catégories · Protocole 5 étapes*

---
---

## 12. FORMULAIRES AVANCÉS

---

## RÈGLES ABSOLUES — Formulaires (toutes variantes)

Ces règles s'appliquent à TOUS les prompts de cette section. Elles ne sont pas négociables. Si une contrainte projet entre en conflit avec ces règles, signaler le conflit à l'utilisateur avant d'implémenter quoi que ce soit.

### JAMAIS
- Jamais créer un champ sans label HTML associé. Un placeholder seul ne remplace pas un label.
- Jamais afficher un message d'erreur générique unique pour tout le formulaire. Chaque champ a son propre message d'erreur spécifique.
- Jamais réinitialiser les champs saisis après un échec de soumission. L'utilisateur ne doit jamais ressaisir ce qu'il a déjà écrit.
- Jamais utiliser le rouge seul comme indicateur d'erreur. Toujours associer une icône ou un texte (accessibilité daltoniens).
- Jamais envoyer un formulaire sans protection anti-double-soumission. Le bouton est désactivé pendant la requête.
- Jamais laisser l'utilisateur deviner les règles de validation. Afficher les contraintes avant qu'il commence à saisir.
- Jamais demander la même information deux fois dans le même formulaire.
- Jamais masquer des champs obligatoires derrière un scroll sans indicateur de progression.
- Jamais afficher une confirmation modale sur une action non destructive.
- Jamais créer un formulaire sans message de confirmation post-soumission.
- Jamais utiliser le HTML natif `required` seul sans validation JavaScript associée.
- Jamais ignorer l'état de chargement sur le bouton de soumission.

### TOUJOURS
- Toujours valider au blur (quitter le champ), pas uniquement au submit.
- Toujours conserver les données saisies en cas d'échec de soumission.
- Toujours indiquer explicitement les champs obligatoires (pas seulement avec un astérisque seul).
- Toujours lier labels et inputs via `for`/`id` ou `aria-labelledby`.
- Toujours adapter le type de clavier mobile au type de champ (`type="email"`, `type="tel"`, `inputmode="numeric"`).
- Toujours afficher les erreurs sous chaque champ concerné avec `aria-describedby`.
- Toujours tester la navigation clavier complète avant de livrer.
- Toujours prévoir un état de soumission en cours (bouton désactivé + spinner).
- Toujours protéger les formulaires sensibles contre le spam (honeypot, rate limiting, ou CAPTCHA en dernier recours).
- Toujours logger les erreurs serveur côté backend même si l'utilisateur voit un message générique.

### RÈGLES TECHNIQUES OBLIGATOIRES
- Validation côté client : pour l'UX uniquement. Ne jamais s'y fier pour la sécurité.
- Validation côté serveur : obligatoire sur tous les champs, même si la validation client a déjà tourné.
- Données sensibles (mot de passe, carte bancaire) : jamais loguées, jamais en localStorage, jamais en URL.
- Formulaires de paiement : jamais hébergés sur un domaine différent du site principal sans HTTPS et certificat valide.
- Formulaires multi-étapes : état persisté en sessionStorage (pas localStorage) — perdu à la fermeture de l'onglet est acceptable.

---

### `form-conditional` — Formulaire conditionnel

**Rôle :** Adapter dynamiquement les champs affichés selon les réponses de l'utilisateur.

**Cas d'usage typiques :** formulaire de devis (le prix dépend des options choisies) · formulaire d'éligibilité (certaines questions s'affichent selon le profil) · onboarding dynamique · questionnaire de diagnostic.

**Brief requis :** liste des champs avec leurs conditions d'affichage · logique de branchement (si A alors montrer B et C, si non-A alors montrer D) · champs toujours visibles vs champs conditionnels.

**ÉTAPE 1 — Audit**
Analyser : tous les champs existants et leurs dépendances · logique de branchement actuelle (ou souhaitée) · champs dont la visibilité, l'obligation ou la validation dépend d'autres champs · profils utilisateurs qui déclenchent des branches différentes.
Déterminer : champs racines (ceux qui déclenchent les conditions) · arborescence complète des dépendances · cas où plusieurs conditions s'enchaînent · état initial du formulaire (ce qui est visible sans aucune interaction).

**ÉTAPE 2 — Conception**
Produire :
1. Cartographie complète des conditions : champ source → valeur déclenchante → champs affichés/masqués/rendus obligatoires.
2. État initial du formulaire (champs visibles au chargement).
3. Comportement des champs masqués : leurs valeurs sont-elles réinitialisées quand ils disparaissent ? (Oui par défaut — ne jamais envoyer des données de champs cachés.)
4. Validation conditionnelle : un champ visible conditionnel est obligatoire · un champ masqué conditionnel ne doit jamais bloquer la soumission.
5. Résumé récapitulatif si le formulaire est long (afficher uniquement les champs remplis pertinents).
6. Message d'aide contextuel par branche si la logique est complexe.
7. Comportement si JavaScript est désactivé (fallback ou message d'erreur clair).

**ÉTAPE 3 — Proposition**
Présenter : cartographie des conditions sous forme de tableau ou arbre · état initial · comportement des champs masqués · logique de validation conditionnelle. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- La logique de condition est déclarative (configuration JSON ou objet de règles) — jamais hardcodée dans le HTML avec des `if` en cascade non maintenables.
- Les champs masqués ont `aria-hidden="true"` et `disabled` pour ne pas être soumis ni atteints au clavier.
- Quand un champ redevient visible, sa valeur précédente peut être restaurée uniquement si elle est encore pertinente.
- Les animations d'affichage/masquage sont < 200ms et respectent `prefers-reduced-motion`.
- Tester tous les chemins de branchement avant livraison. Documenter les chemins testés dans un commentaire.
- Jamais envoyer au serveur les données de champs masqués au moment de la soumission.

---

### `form-wizard` — Formulaire Wizard / Configurateur

**Rôle :** Décomposer un formulaire complexe en étapes séquentielles avec logique de branchement et résumé final.

**Cas d'usage typiques :** inscription complète en plusieurs étapes · configurateur de produit · devis étape par étape · processus d'éligibilité · onboarding utilisateur avancé.

**Brief requis :** nombre d'étapes · contenu de chaque étape · logique de branchement entre étapes si applicable · si le résumé final est obligatoire.

**ÉTAPE 1 — Audit**
Analyser : complexité totale du formulaire et justification du wizard · étapes actuelles si wizard existant · taux de complétion par étape si disponible · points d'abandon identifiés · données nécessaires à chaque étape pour valider le passage à la suivante.
Déterminer : découpage optimal des étapes (pas trop, pas trop peu — 3 à 7 max) · étapes obligatoires vs optionnelles · logique de branchement entre étapes · si un retour en arrière est permis (toujours oui par défaut).

**ÉTAPE 2 — Conception**
Produire :
1. Titre et objectif de chaque étape.
2. Champs de chaque étape avec validations.
3. Indicateur de progression (barre, numéros, titre d'étape).
4. Logique de branchement si une étape mène à des chemins différents.
5. Résumé récapitulatif avant soumission finale (obligatoire si le formulaire collecte des données importantes).
6. Comportement du bouton "Retour" : revenir à l'étape précédente sans perdre les données.
7. Comportement si l'utilisateur rafraîchit la page (sessionStorage ou perte acceptée — à spécifier).
8. Message de succès final avec récapitulatif de ce qui a été soumis.

**ÉTAPE 3 — Proposition**
Présenter : structure complète étape par étape · logique de branchement · comportement navigation · récapitulatif final. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- L'état de progression est persisté en sessionStorage à chaque changement d'étape — jamais en localStorage.
- Le bouton "Suivant" est désactivé tant que l'étape courante n'est pas valide.
- Le bouton "Retour" est toujours actif sauf si l'étape est la première.
- La navigation par onglets ou raccourcis clavier vers une étape passée est autorisée mais pas vers une étape future non encore atteinte.
- L'indicateur de progression est mis à jour en temps réel.
- Le résumé final affiche uniquement les données saisies, jamais les données par défaut non modifiées par l'utilisateur.
- La soumission finale déclenche une protection anti-double-soumission stricte.
- En cas d'erreur serveur à la soumission finale, revenir à l'étape de résumé avec le message d'erreur — jamais réinitialiser tout le wizard.
- Documenter les transitions entre étapes dans un commentaire au-dessus de la logique de navigation.

---

### `form-survey` — Questionnaire / Survey

**Rôle :** Collecter des réponses structurées sur un sujet avec plusieurs types de questions.

**Cas d'usage typiques :** NPS (Net Promoter Score) · satisfaction client · questionnaire de qualification · sondage interne · formulaire de feedback produit · quiz.

**Brief requis :** types de questions utilisés · logique de saut si applicable · si les résultats sont affichés à l'utilisateur après soumission.

**ÉTAPE 1 — Audit**
Analyser : types de questions existants ou souhaités (choix unique, choix multiple, échelle, texte libre, NPS, ranking, upload) · logique de saut entre questions · longueur totale estimée et risque d'abandon · résultats attendus (analytics, affichage immédiat, rapport).
Déterminer : ordre optimal des questions (du plus facile au plus complexe) · questions obligatoires vs optionnelles · logique de saut · format de réponse optimal par type de question · comportement en cas d'abandon (sauvegarder la progression ou non).

**ÉTAPE 2 — Conception**
Produire :
1. Liste de toutes les questions avec : type, options si applicable, obligatoire ou non.
2. Logique de saut : si réponse X à question N alors aller à question M.
3. Textes d'aide ou d'exemples par question si nécessaire.
4. Indicateur de progression (numéro de question, barre).
5. Page de résultats si affichage immédiat (score, benchmark, recommandation).
6. Message de fin (remercier, indiquer ce qui va se passer avec les réponses).
7. Gestion de l'abandon partiel (reprendre où on s'était arrêté si identifié).

**ÉTAPE 3 — Proposition**
Présenter : liste des questions avec type et logique · structure de la page de résultats si applicable · gestion de l'abandon. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- Une seule question ou un bloc de questions par vue — jamais tout le questionnaire sur une seule page longue.
- Les échelles de notation ont des labels textuels aux deux extrémités (ex: "Pas du tout satisfait" — "Très satisfait").
- Les boutons de choix unique utilisent des `radio` natifs (pas des divs cliquables) pour l'accessibilité.
- Les choix multiples utilisent des `checkbox` natifs.
- La logique de saut est déclarative et documentée — jamais hardcodée.
- Les réponses partielles sont sauvegardées toutes les 30 secondes si l'utilisateur est identifié.
- Jamais pré-remplir les options de réponse avec la valeur la plus favorable (biais de confirmation).
- Les réponses sont anonymisées si le brief le demande — vérifier avant d'implémenter.
- Le score NPS est calculé côté serveur, pas côté client (manipulation possible).

---

### `form-reservation` — Formulaire de réservation

**Rôle :** Sélectionner une date, un horaire et des options, puis confirmer une réservation avec vérification de disponibilité en temps réel.

**Cas d'usage typiques :** réservation de rendez-vous · réservation de table · réservation de salle · booking de service · réservation de créneau de livraison.

**Brief requis :** type de réservation · durée des créneaux · règles de disponibilité · délai minimum de réservation · politique d'annulation.

**ÉTAPE 1 — Audit**
Analyser : système de disponibilité existant (API, calendrier, base de données) · règles métier (délai minimum, durée des créneaux, jours fermés, capacité par créneau) · flux actuel de réservation · confirmation et rappels envoyés.
Déterminer : comment les disponibilités sont récupérées (temps réel ou cache) · comportement si un créneau est pris pendant que l'utilisateur remplit le formulaire · politique d'annulation et de modification · données minimum nécessaires pour réserver.

**ÉTAPE 2 — Conception**
Produire :
1. Étapes du formulaire de réservation (sélection date → sélection horaire → informations → confirmation).
2. Comportement du calendrier (jours désactivés, créneaux indisponibles, délai minimum).
3. Affichage des créneaux disponibles par jour sélectionné.
4. Données à collecter (nom, email, téléphone, options, message).
5. Page de récapitulatif avant confirmation.
6. Confirmation post-réservation (email automatique + affichage immédiat).
7. Politique d'annulation affichée avant soumission.
8. Gestion du conflit de réservation (créneau pris entre la sélection et la soumission).

**ÉTAPE 3 — Proposition**
Présenter : flux complet de réservation · comportement du calendrier · gestion des conflits · confirmation. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- Les disponibilités sont vérifiées en temps réel à la sélection du créneau ET au moment de la soumission — deux vérifications obligatoires.
- Si un créneau est pris entre la sélection et la soumission, afficher une erreur explicite et proposer les créneaux alternatifs les plus proches.
- Le créneau n'est jamais réservé définitivement tant que la soumission n'a pas reçu de confirmation serveur (200 OK).
- Un verrou temporaire (hold de 5 à 10 minutes) peut être appliqué lors de la saisie des informations — le signaler clairement à l'utilisateur avec un compte à rebours.
- Jamais afficher un créneau "disponible" sans vérification serveur récente (max 60 secondes).
- Les données de contact sont validées avant envoi (email format, téléphone format local).
- L'email de confirmation est envoyé uniquement après confirmation serveur de la réservation.
- Prévoir la gestion des fuseaux horaires si le service est accessible internationalement.
- L'annulation doit être possible depuis le lien dans l'email de confirmation sans connexion requise (token unique dans l'URL).

---

### `form-import` — Import de données

**Rôle :** Permettre à l'utilisateur d'importer un fichier de données, valider son contenu, mapper les colonnes et déclencher l'import.

**Cas d'usage typiques :** import de contacts CSV · import de produits Excel · import de commandes · migration de données · import en masse d'utilisateurs.

**Brief requis :** format(s) de fichier acceptés · colonnes attendues · règles de validation par colonne · comportement en cas d'erreurs partielles (stopper ou continuer).

**ÉTAPE 1 — Audit**
Analyser : format de fichier attendu (CSV, Excel, JSON) · colonnes requises et optionnelles · règles de validation par colonne (type, format, unicité, relations) · volume maximum de lignes · comportement en cas d'erreur partielle · historique des imports si disponible.
Déterminer : si un template de fichier doit être fourni à télécharger · si le mapping de colonnes est automatique ou manuel · si un import partiel (lignes valides uniquement) est autorisé ou si tout-ou-rien.

**ÉTAPE 2 — Conception**
Produire :
1. Étapes de l'import : upload → prévisualisation + mapping → validation → import → résultat.
2. Template de fichier à télécharger avec exemple de données.
3. Interface de mapping des colonnes (si les noms de colonnes du fichier peuvent différer des colonnes attendues).
4. Règles de validation affichées clairement avant l'upload.
5. Rapport de validation : nombre de lignes valides, nombre d'erreurs, détail des erreurs par ligne.
6. Comportement choisi (tout-ou-rien ou import partiel) avec justification.
7. Rapport post-import : lignes importées, lignes en erreur, lignes ignorées.
8. Option d'annulation de l'import (rollback) si applicable.

**ÉTAPE 3 — Proposition**
Présenter : flux complet des 5 étapes · template proposé · logique de validation · comportement sur erreur partielle. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- La validation du fichier se fait côté client en premier (format, taille max, extension) — le fichier n'est jamais envoyé au serveur s'il échoue la validation client.
- La validation du contenu (lignes, colonnes, valeurs) se fait côté serveur — jamais se fier uniquement à la validation client pour les données métier.
- La taille maximum du fichier est affichée clairement avant l'upload et vérifiée côté client avant envoi.
- Les fichiers CSV sont lus avec détection automatique de l'encodage (UTF-8, ISO-8859-1) et du séparateur (, ; |).
- Pour les gros volumes (>1000 lignes), l'import est asynchrone avec une barre de progression et un email de confirmation à la fin.
- Les données importées sont loguées (qui a importé quoi, quand, combien de lignes) pour l'audit.
- Un aperçu des 5 premières lignes est affiché avant de lancer l'import.
- En cas d'erreur partielle, le rapport d'erreurs est téléchargeable (CSV des lignes en erreur avec la raison).
- Jamais supprimer le fichier uploadé avant que l'import soit confirmé côté serveur.
- Les imports dupliqués (même fichier, même hash) sont détectés et signalés.

---

### `form-admin` — Formulaire d'administration CRUD

**Rôle :** Créer, lire, modifier et supprimer des entités avec des champs complexes dans un contexte d'administration.

**Cas d'usage typiques :** panel d'administration de contenu · gestion d'utilisateurs · gestion de produits · backoffice de commandes · éditeur d'articles.

**Brief requis :** entité gérée · liste de tous les champs avec type et validation · permissions par rôle (qui peut créer / modifier / supprimer) · audit log requis ou non.

**ÉTAPE 1 — Audit**
Analyser : entité à gérer et ses attributs · relations avec d'autres entités (one-to-many, many-to-many) · types de champs complexes nécessaires (rich text, tags, fichiers, relations, JSON, couleur, coordonnées) · permissions par rôle existantes · audit log existant.
Déterminer : champs modifiables vs champs en lecture seule · champs calculés automatiquement · règles de validation métier complexes · comportement en cas de modification concurrente (deux admins modifient le même enregistrement).

**ÉTAPE 2 — Conception**
Produire :
1. Liste complète des champs : label, type de composant, validation, permissions par rôle.
2. Organisation en sections ou onglets si le formulaire est dense (> 10 champs).
3. Champs complexes spécifiés : rich text editor choisi, tags (freesearch ou liste fermée), relations (select ou autocomplete), upload fichier (taille, format, compression).
4. Actions disponibles : Sauvegarder, Sauvegarder et continuer, Sauvegarder et créer un nouveau, Dupliquer, Archiver, Supprimer.
5. Confirmation obligatoire avant suppression (avec le nom de l'entité dans le message de confirmation pour éviter les erreurs).
6. Gestion de la modification concurrente (warning si l'enregistrement a été modifié pendant l'édition).
7. Audit log : quelles actions sont loguées, quelles données sont tracées (avant/après), qui y a accès.
8. Raccourcis clavier pour les actions fréquentes (Ctrl+S pour sauvegarder).

**ÉTAPE 3 — Proposition**
Présenter : structure du formulaire admin · champs avec type de composant · actions disponibles · gestion concurrence · audit log. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- Les champs en lecture seule ont `disabled` ET `readonly` — jamais envoyés au serveur via le formulaire (relire depuis la BDD côté serveur).
- Les permissions sont vérifiées côté serveur à chaque opération CRUD — la vérification côté client est uniquement pour l'UX.
- La suppression déclenche une confirmation avec le nom exact de l'entité tapé dans un champ texte si l'action est irréversible.
- Les modifications sont sauvegardées avec un diff avant/après dans l'audit log.
- Le rich text editor n'accepte que les balises HTML autorisées (whitelist stricte) — jamais de scripts.
- Les fichiers uploadés sont validés côté serveur (type MIME réel, pas seulement l'extension).
- La gestion de concurrence utilise un système d'optimistic locking (version ou timestamp) — si conflit, afficher un diff des changements et laisser l'admin choisir.
- Les actions en masse (supprimer X éléments sélectionnés) demandent une confirmation avec le nombre exact.
- Jamais exposer les IDs techniques internes dans les messages d'erreur utilisateur.
- L'autosave optionnel (brouillon) est disponible sur les formulaires longs.

---

### `form-signature` — Signature électronique

**Rôle :** Collecter une signature manuscrite ou tapée avec valeur probante pour des documents légaux ou contractuels.

**Cas d'usage typiques :** signature de contrat · bon de commande · accord de confidentialité (NDA) · consentement éclairé · procuration.

**Brief requis :** valeur légale requise (simple vs avancée vs qualifiée selon eIDAS) · type de signature acceptée (dessinée, tapée, ou les deux) · document à signer.

**ÉTAPE 1 — Audit**
Analyser : niveau de valeur légale requis selon la juridiction et le type de document · infrastructure de signature existante (prestataire tiers ou solution maison) · document à faire signer (PDF statique ou généré dynamiquement) · données à collecter avec la signature (identité, date, IP, consentement explicite).
Déterminer : type de signature adapté au niveau légal requis · prestataire à utiliser si signature avancée ou qualifiée (DocuSign, YouSign, Yousign, Adobe Sign) · données d'audit à conserver · format de stockage de la signature.

**ÉTAPE 2 — Conception**
Produire :
1. Présentation du document à signer (prévisualisation obligatoire avant signature).
2. Type de zone de signature : canvas dessiné · champ texte pour nom tapé · ou les deux au choix.
3. Données collectées avec la signature : date/heure, IP, user agent, email signataire, consentement explicite.
4. Message de consentement clair avant la signature ("En signant, je confirme avoir lu et accepté…").
5. Bouton d'effacement de la zone de dessin si signature manuscrite.
6. Confirmation après signature avec récapitulatif de ce qui a été signé.
7. Envoi du document signé par email au signataire.
8. Stockage sécurisé : emplacement, format, durée de conservation.

**ÉTAPE 3 — Proposition**
Présenter : flux complet (document → lecture → signature → confirmation → envoi) · données d'audit collectées · recommandation sur le niveau légal. Attendre validation.

**ÉTAPE 4 — Implémentation**

Règles techniques strictes :
- La prévisualisation du document est obligatoire et doit être scrollée entièrement avant de débloquer la signature (ou une checkbox "J'ai lu le document" explicite).
- Les données d'audit (timestamp UTC, IP, user agent, hash du document) sont générées côté serveur — jamais côté client.
- Le hash du document signé est calculé et stocké pour garantir l'intégrité (SHA-256 minimum).
- La signature est stockée chiffrée. Jamais en texte clair en base de données.
- Le PDF final signé est généré côté serveur avec signature intégrée — jamais côté client.
- La zone de dessin canvas respecte les ratios d'écran (devicePixelRatio) pour une qualité correcte sur mobile.
- Une signature vide (simple clic ou trait minimal < 5 pixels) est rejetée avec un message d'erreur.
- L'email de confirmation contient le document signé en pièce jointe et les métadonnées de signature.
- Pour la valeur légale avancée ou qualifiée, utiliser obligatoirement un prestataire certifié — ne jamais implémenter soi-même.
- Jamais conserver la signature image brute sans le contexte légal associé (date, document, signataire).

---

---
---

