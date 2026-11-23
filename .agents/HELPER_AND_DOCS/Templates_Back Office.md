Je veux que tu analyses la structure du BACK-OFFICE actuellement présente dans ce projet afin d’en extraire un TEMPLATE DE BACK-OFFICE RÉUTILISABLE pour mes futurs projets.

IMPORTANT :

Je ne veux pas simplement reproduire visuellement le back-office actuel.

Je veux extraire son système structurel, son architecture d’interface et ses patterns réutilisables.

L’objectif est de pouvoir réutiliser le même socle de back-office sur différents projets tout en adaptant les modules métier, les données et le design system à chaque projet.

==================================================
PHASE 1 — AUDIT DU BACK-OFFICE EXISTANT

Ne modifie rien pendant cette phase.

Analyse précisément le back-office actuel.

1. STRUCTURE GLOBALE

Identifie :

- structure générale de l’application ;
- layout principal ;
- sidebar ;
- header ;
- zone de contenu ;
- footer éventuel ;
- navigation secondaire ;
- éléments persistants ;
- organisation générale des pages.

Détermine quels éléments appartiennent au shell global du back-office.

2. NAVIGATION

Analyse :

- navigation principale ;
- groupes de navigation ;
- sous-menus ;
- éléments actifs ;
- breadcrumbs ;
- navigation mobile ;
- comportement de la sidebar ;
- sidebar réduite/étendue si elle existe ;
- navigation clavier ;
- routes ;
- redirections ;
- contrôle d'accès éventuel.

Identifie ce qui est générique et ce qui est spécifique au projet.

3. STRUCTURE DES PAGES

Analyse les patterns utilisés pour les différentes pages.

Par exemple :

- page de liste ;
- page de détail ;
- page de création ;
- page d'édition ;
- page de configuration ;
- dashboard ;
- page de statistiques ;
- page de profil ;
- page de paramètres ;
- pages d'erreur ;
- pages vides.

Ne considère pas automatiquement tous ces types comme nécessaires.

Identifie ceux réellement présents et ceux qui constituent de bons patterns réutilisables.

4. DASHBOARD

Analyse la construction du dashboard :

- en-tête de page ;
- résumé/KPI ;
- cartes statistiques ;
- graphiques ;
- tableaux ;
- activités récentes ;
- alertes ;
- raccourcis ;
- widgets ;
- sections ;
- responsive.

Sépare la structure du dashboard des données métier affichées.

5. TABLEAUX ET LISTES

Analyse le pattern des interfaces de données :

- recherche ;
- filtres ;
- tri ;
- pagination ;
- sélection multiple ;
- actions individuelles ;
- actions groupées ;
- colonnes configurables ;
- affichage mobile ;
- états loading ;
- état vide ;
- état erreur ;
- confirmation avant suppression ;
- pagination ;
- export éventuel.

Détermine ce qui pourrait devenir un composant réutilisable.

6. FORMULAIRES

Analyse les patterns de formulaire :

- structure ;
- groupes de champs ;
- labels ;
- descriptions ;
- validation ;
- messages d'erreur ;
- champs obligatoires ;
- états disabled ;
- loading ;
- succès ;
- annulation ;
- sauvegarde ;
- modales ;
- étapes ;
- formulaires longs.

Identifie les composants réutilisables.

7. MODALES ET ACTIONS

Analyse :

- modales ;
- confirmations ;
- drawers ;
- menus d'actions ;
- popovers ;
- notifications ;
- toasts ;
- alertes ;
- messages de succès/erreur.

Détermine leurs comportements communs.

8. ÉTATS GLOBAUX

Identifie les patterns utilisés pour :

- chargement ;
- erreur ;
- vide ;
- succès ;
- absence de permission ;
- session expirée ;
- accès refusé ;
- suppression ;
- sauvegarde ;
- synchronisation.

Le template doit prévoir ces états de manière cohérente.

9. AUTHENTIFICATION ET AUTORISATIONS

Analyse comment le back-office gère :

- authentification ;
- rôles ;
- permissions ;
- accès aux pages ;
- accès aux actions ;
- restrictions de certaines opérations ;
- redirection vers login ;
- session expirée.

Sépare soigneusement le mécanisme générique d'autorisation des rôles propres au projet actuel.

10. RESPONSIVE

Analyse séparément :

- desktop ;
- tablette ;
- mobile.

Ne te limite pas aux dimensions.

Observe les changements de structure :

- sidebar transformée en menu ;
- tableaux transformés ;
- actions déplacées ;
- navigation différente ;
- modales adaptées ;
- formulaires réorganisés.

11. ACCESSIBILITÉ

Analyse :

- navigation clavier ;
- focus ;
- titres ;
- labels ;
- boutons ;
- navigation de la sidebar ;
- modales ;
- lecteurs d'écran ;
- messages d'erreur ;
- contrastes ;
- zones interactives.

==================================================
PHASE 2 — SÉPARER LE SOCLE ET LE MÉTIER

C'est l'étape la plus importante.

Sépare précisément :

A. SOCLE RÉUTILISABLE

Peut appartenir au template :

- AppShell ;
- sidebar ;
- header ;
- navigation ;
- breadcrumbs ;
- système de routes ;
- layouts de pages ;
- système de permissions générique ;
- composants de tableaux ;
- composants de formulaires ;
- modales ;
- notifications ;
- états loading/error/empty ;
- responsive ;
- accessibilité ;
- patterns CRUD ;
- pagination ;
- filtres ;
- recherche ;
- composants de dashboard génériques.

B. SPÉCIFIQUE AU PROJET

Ne doit pas être intégré directement au template :

- modules métier ;
- données métier ;
- règles métier ;
- noms des menus ;
- KPIs spécifiques ;
- champs propres au métier ;
- collections/tables spécifiques ;
- workflows spécifiques ;
- permissions propres à l'organisation ;
- logique métier.

==================================================
PHASE 3 — EXTRAIRE LES PATTERNS

Pour chaque pattern réutilisable identifié, documente :

1. son rôle ;
2. sa structure ;
3. ses variantes ;
4. ses états ;
5. ses propriétés/configurations ;
6. ses dépendances ;
7. ses limites ;
8. les parties spécifiques au projet actuel.

Exemple :

DATA TABLE

Structure générique :

PageHeader
Search
Filters
Table
Pagination
EmptyState
LoadingState
ErrorState

La structure doit être générique.

Le nom des colonnes, les données et les règles métier doivent venir du projet.

==================================================
PHASE 4 — ARCHITECTURE DU TEMPLATE

Propose une architecture modulaire.

Par exemple, conceptuellement :

BackOffice/
├── AppShell/
├── Sidebar/
├── Header/
├── Navigation/
├── Breadcrumbs/
├── PageLayout/
├── Dashboard/
├── DataTable/
├── Filters/
├── Search/
├── Pagination/
├── Forms/
├── Modal/
├── Drawer/
├── Toast/
├── EmptyState/
├── LoadingState/
├── ErrorState/
├── AccessControl/
├── permissions/
├── types/
├── config/
└── documentation/

Cette structure est indicative.

Adapte-la au framework et à l'architecture réelle du projet.

Ne crée pas artificiellement des composants inutiles.

==================================================
PHASE 5 — CONFIGURATION

Le template doit être configurable.

Le nouveau projet doit pouvoir définir au minimum :

- nom du produit ;
- logo ;
- navigation ;
- routes ;
- rôles ;
- permissions ;
- modules activés ;
- design system ;
- informations utilisateur ;
- préférences d'affichage.

Conceptuellement :

backOfficeConfig = {
  navigation: [...],
  modules: [...],
  roles: [...],
  permissions: [...],
  theme: {...}
}

Adapte évidemment cette structure au projet réel.

==================================================
PHASE 6 — INDÉPENDANCE VIS-À-VIS DU MÉTIER

Le template doit pouvoir fonctionner avec différents types de projets :

- SaaS ;
- ERP ;
- e-commerce ;
- CRM ;
- plateforme de réservation ;
- outil interne ;
- autre application métier.

Ne code donc pas les modules métier actuels directement dans le socle.

Lorsqu'une fonctionnalité est propre au projet actuel, indique clairement qu'elle doit rester hors du template.

==================================================
PHASE 7 — DESIGN SYSTEM

Le template doit conserver :

- structure ;
- hiérarchie ;
- spacing logique ;
- comportements ;
- responsive ;
- patterns d'interaction.

Mais permettre de remplacer :

- couleurs ;
- typographies ;
- radius ;
- ombres ;
- icônes ;
- logo ;
- style visuel.

Le template ne doit pas être prisonnier de l'identité visuelle actuelle.

==================================================
PHASE 8 — SÉCURITÉ

Analyse les risques liés au back-office :

- contrôle d'accès côté frontend ;
- contrôle d'accès côté backend ;
- exposition de données ;
- routes protégées ;
- actions sensibles ;
- suppression ;
- modification ;
- élévation de privilèges ;
- gestion des sessions ;
- accès direct à une route ;
- données sensibles.

IMPORTANT :

Ne considère jamais la simple dissimulation d'un bouton comme un système d'autorisation suffisant.

Identifie ce qui doit impérativement être vérifié côté serveur/backend.

==================================================
PHASE 9 — RÉUTILISABILITÉ

Le système final doit pouvoir être extrait comme un template autonome.

Je veux pouvoir conserver :

MÊME SOCLE
+
MÊMES PATTERNS
+
MÊME LOGIQUE D'INTERFACE

mais remplacer :

MODULES
+
DONNÉES
+
RÈGLES MÉTIER
+
DESIGN SYSTEM

selon chaque projet.

==================================================
PHASE 10 — DOCUMENTATION

Crée un README expliquant :

- architecture ;
- composants ;
- configuration ;
- installation ;
- dépendances ;
- routing ;
- permissions ;
- ajout d'un module ;
- création d'une page ;
- utilisation d'un tableau ;
- utilisation d'un formulaire ;
- utilisation des états ;
- personnalisation du thème ;
- responsive ;
- bonnes pratiques ;
- limites du template.

Ajoute un exemple minimal de projet utilisant le template.

==================================================
PHASE 11 — EXPORT

Après validation et implémentation, prépare le résultat comme un TEMPLATE AUTONOME ET EXPORTABLE.

Je ne veux pas récupérer les fichiers un par un.

Prépare un dossier du type :

backoffice-template/
├── components/
├── layouts/
├── navigation/
├── auth/
├── permissions/
├── tables/
├── forms/
├── feedback/
├── states/
├── types/
├── config/
├── styles/
├── example/
└── README.md

Adapte cette structure à l'architecture réelle.

Sépare impérativement :

1. le code générique ;
2. la configuration ;
3. les données ;
4. les modules métier propres au projet actuel.

Si ton environnement permet de générer une archive, crée également :

"backoffice-template.zip"

Le package ne doit contenir :

- node_modules ;
- fichiers temporaires ;
- secrets ;
- clés API ;
- données personnelles ;
- données métier réelles ;
- fichiers spécifiques inutiles à la réutilisation.

==================================================
PHASE 12 — VALIDATION AVANT MODIFICATION

NE MODIFIE PAS LE PROJET IMMÉDIATEMENT.

Commence par me présenter :

1. l'audit du back-office actuel ;
2. le shell global identifié ;
3. les patterns réutilisables ;
4. ce qui est spécifique au métier ;
5. l'architecture proposée ;
6. la stratégie de configuration ;
7. les dépendances ;
8. les risques ;
9. le plan d'extraction.

Puis ARRÊTE-TOI.

Attends ma validation.

Après validation, implémente progressivement et vérifie que les fonctionnalités existantes continuent de fonctionner.

OBJECTIF FINAL :

Créer un SOCLE DE BACK-OFFICE RÉUTILISABLE, et non une copie du back-office actuel.