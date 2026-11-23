Je veux que tu analyses le système actuel de pages légales de ce projet et que tu en extraies un TEMPLATE DE PAGES LÉGALES RÉUTILISABLE pour mes futurs projets.

OBJECTIF

Je ne veux pas simplement copier visuellement les pages actuelles.

Je veux identifier et isoler leur :

- structure ;
- architecture de contenu ;
- organisation de navigation ;
- logique d'affichage ;
- expérience utilisateur ;
- comportements interactifs ;
- responsive design ;
- fonctionnalités associées aux documents légaux.

L'objectif final est de créer un système réutilisable sur différents projets.

Sur chaque nouveau projet, je dois pouvoir conserver le même fonctionnement et la même structure générale, tout en adaptant :

- les couleurs ;
- les typographies ;
- le logo ;
- les contenus ;
- les éléments graphiques ;
- les variables du design system du projet.

---

PHASE 1 — AUDIT DU SYSTÈME EXISTANT

Commence par analyser précisément les pages légales actuellement présentes dans le projet.

Ne modifie absolument rien pendant cette phase.

Identifie notamment :

1. Point d'accès

Analyse :

- où les liens vers les pages légales sont placés ;
- comment ils sont regroupés ;
- leur hiérarchie ;
- leur position dans le footer ou ailleurs ;
- leur comportement au survol ;
- leur comportement sur mobile ;
- les éventuels regroupements ou catégories.

2. Navigation

Analyse comment l'utilisateur passe :

- du site vers une page légale ;
- d'une page légale à une autre ;
- d'une page légale vers une section précise ;
- d'une page légale vers le site principal.

Identifie également les éventuels :

- breadcrumbs ;
- menus secondaires ;
- liens internes ;
- ancres ;
- boutons précédent/suivant ;
- liens de retour.

3. Structure de la page

Analyse la structure exacte de la page indépendamment de son style visuel.

Par exemple :

- header ;
- titre du document ;
- date de mise à jour ;
- introduction ;
- sommaire ;
- sections ;
- sous-sections ;
- blocs d'information ;
- notes ;
- tableaux éventuels ;
- informations de contact ;
- footer ;
- actions disponibles.

Ne te limite pas aux éléments actuellement présents : identifie également leur rôle fonctionnel.

4. Expérience de consultation

Analyse ce qui se passe lorsque l'utilisateur consulte longuement le document.

Vérifie notamment :

- comportement du scroll ;
- navigation par ancres ;
- positionnement du sommaire ;
- éventuel sommaire sticky ;
- retour en haut ;
- liens internes ;
- indication de la section actuelle ;
- comportement du header ;
- comportement sur petits écrans.

5. Actions disponibles

Identifie toutes les actions proposées à l'utilisateur.

Par exemple :

- imprimer ;
- télécharger ;
- partager ;
- copier un lien ;
- revenir au site ;
- changer de document ;
- revenir au début ;
- naviguer entre les sections.

Ne suppose pas qu'une fonctionnalité existe : vérifie réellement le code et le comportement de l'application.

6. Responsive

Analyse séparément :

- desktop ;
- tablette ;
- mobile.

Identifie les adaptations structurelles et non simplement les changements de taille.

---

PHASE 2 — SÉPARER STRUCTURE ET DESIGN

C'est une étape essentielle.

Je veux que tu distingues clairement :

A. Ce qui doit appartenir au TEMPLATE

Tout ce qui concerne :

- structure ;
- layout ;
- architecture des pages ;
- navigation ;
- composants ;
- comportements ;
- interactions ;
- responsive ;
- accessibilité ;
- impression ;
- système d'ancres ;
- sommaire ;
- navigation entre documents ;
- organisation du contenu.

B. Ce qui doit rester propre au PROJET

Tout ce qui concerne :

- palette ;
- typographie ;
- logo ;
- identité visuelle ;
- illustrations ;
- icônes spécifiques à la marque ;
- contenu juridique ;
- coordonnées ;
- nom de l'entreprise ;
- URLs ;
- informations légales.

Le template ne doit donc pas être dépendant de l'identité visuelle actuelle du projet.

---

PHASE 3 — CONCEPTION DU TEMPLATE

À partir de ton analyse, crée un véritable système réutilisable nommé :

"LegalPagesTemplate"

ou un nom plus pertinent si l'architecture actuelle du projet impose une autre convention.

Le système doit être suffisamment générique pour être utilisé dans plusieurs projets.

Il doit permettre de définir les documents à afficher à partir d'une configuration.

Par exemple, conceptuellement :

legalDocuments = [
  {
    id: "legal-notice",
    title: "...",
    slug: "...",
    lastUpdated: "...",
    sections: [...]
  },
  {
    id: "privacy-policy",
    title: "...",
    slug: "...",
    lastUpdated: "...",
    sections: [...]
  }
]

Adapte évidemment cette structure au langage, framework et architecture réellement utilisés dans ce projet.

---

PHASE 4 — CONFIGURATION ET PERSONNALISATION

Le template doit séparer clairement :

Structure

du

Contenu

et du

Design system.

Je veux pouvoir réutiliser le même système sur un autre projet sans devoir reconstruire les pages.

Le nouveau projet doit essentiellement pouvoir fournir :

- ses documents ;
- ses titres ;
- ses sections ;
- ses dates ;
- ses métadonnées ;
- son identité visuelle ;
- ses variables de design.

---

PHASE 5 — FONCTIONNALITÉS

Conserve les fonctionnalités réellement présentes dans le système actuel lorsqu'elles sont pertinentes.

Mais ne reproduis pas aveuglément une fonctionnalité simplement parce qu'elle existe.

Pour chaque fonctionnalité, indique :

1. son utilité ;
2. sa dépendance éventuelle ;
3. si elle doit être obligatoire ou optionnelle ;
4. si elle doit être configurable.

Exemple :

Table des matières
→ configurable

Impression
→ optionnelle

Navigation entre documents
→ configurable

Date de mise à jour
→ configurable

Bouton retour au site
→ configurable

---

PHASE 6 — ARCHITECTURE TECHNIQUE

Avant de modifier le projet, propose l'architecture du système.

Identifie :

- les composants nécessaires ;
- les fichiers concernés ;
- les données nécessaires ;
- les props/configurations ;
- les éventuels hooks ;
- les utilitaires ;
- les styles ;
- les dépendances ;
- les éventuels changements de routing.

Privilégie une architecture modulaire.

Évite absolument de créer un composant monolithique contenant toute la logique.

---

PHASE 7 — RÉUTILISABILITÉ

Le résultat doit être pensé comme un véritable composant produit réutilisable.

Je veux pouvoir avoir, conceptuellement :

LegalPages/
├── LegalLayout
├── LegalNavigation
├── LegalTableOfContents
├── LegalDocument
├── LegalSection
├── LegalActions
├── LegalFooter
└── configuration

Adapte cette architecture à la structure réelle du projet.

Ne crée pas artificiellement tous ces fichiers si certains ne sont pas nécessaires.

---

PHASE 8 — ACCESSIBILITÉ

Vérifie également :

- navigation clavier ;
- focus visible ;
- structure sémantique des titres ;
- liens accessibles ;
- boutons correctement identifiés ;
- compatibilité avec lecteurs d'écran ;
- contraste dépendant du design system ;
- impression accessible.

---

PHASE 9 — IMPRESSION

La fonction d'impression doit être traitée comme une fonctionnalité à part entière.

Lors de l'impression :

- supprimer les éléments inutiles ;
- conserver le contenu juridique ;
- conserver une hiérarchie claire ;
- éviter les coupures absurdes entre sections ;
- adapter le layout au papier ;
- éviter d'imprimer les contrôles de navigation inutiles.

Utilise les mécanismes appropriés du framework et du CSS d'impression plutôt qu'une solution bricolée.

---

PHASE 10 — CE QUI NE DOIT PAS ÊTRE MODIFIÉ

Le système actuel fonctionne déjà.

Tu ne dois donc :

- casser aucune fonctionnalité existante ;
- modifier aucune donnée existante ;
- modifier aucune logique métier sans nécessité ;
- changer aucune route existante sans justification ;
- supprimer aucun composant utilisé ailleurs ;
- remplacer aucune fonctionnalité simplement pour simplifier ton implémentation.

Avant toute modification, identifie précisément l'impact.

Si une modification risque d'affecter une autre partie du projet, signale-le avant de l'effectuer.

---

PHASE 11 — PLAN AVANT IMPLÉMENTATION

NE CODE PAS IMMÉDIATEMENT.

Commence par me présenter :

1. Audit du système actuel

Ce que tu as trouvé.

2. Structure à extraire

Ce qui devient réutilisable.

3. Ce qui restera spécifique au projet

Ce qui ne doit pas être inclus dans le template.

4. Architecture proposée

Composants + données + configuration + routing.

5. Fonctionnalités

Fonctionnalités obligatoires et optionnelles.

6. Risques

Tout ce qui pourrait casser l'existant.

7. Plan d'implémentation

Étapes petites et contrôlables.

Puis ARRÊTE-TOI.

Attends ma validation avant de modifier le code.

Après validation, procède étape par étape et vérifie le fonctionnement après chaque étape importante.

IMPORTANT :

Le résultat final doit être un système de pages légales réutilisable, et non une simple copie de la page actuelle.

L'objectif est :

MÊME STRUCTURE + MÊME EXPÉRIENCE + MÊMES COMPORTEMENTS

mais

CONTENU + IDENTITÉ VISUELLE + DESIGN SYSTEM ADAPTABLES À CHAQUE PROJET.

Une fois l'implémentation validée et terminée, je veux que tu prepares le système de pages légales comme un TEMPLATE AUTONOME ET RÉUTILISABLE.

Ne me demande pas de récupérer les fichiers un par un.

OBJECTIF

Je veux pouvoir récupérer l'ensemble du template et le réutiliser dans un autre projet sans devoir reconstruire manuellement chaque fichier.

LIVRABLE

Prépare un dossier autonome contenant uniquement les éléments nécessaires au fonctionnement du système de pages légales :

- composants ;
- logique ;
- types ;
- configuration ;
- styles nécessaires ;
- utilitaires ;
- documentation ;
- exemple d'utilisation.

Sépare clairement :

1. le code générique du template ;
2. la configuration spécifique au projet actuel ;
3. les données/contenus juridiques spécifiques au projet actuel.

Le template ne doit contenir aucune donnée spécifique qui empêcherait sa réutilisation dans un autre projet.

DOCUMENTATION

Crée également un README expliquant :

- la structure du template ;
- les fichiers importants ;
- comment l'intégrer dans un nouveau projet ;
- les dépendances nécessaires ;
- les paramètres à configurer ;
- comment ajouter un nouveau document juridique ;
- comment modifier les fonctionnalités optionnelles ;
- comment adapter le design system ;
- comment configurer les routes ;
- comment activer/configurer l'impression.

EXPORT

Prépare l'ensemble sous forme d'un package/dossier exportable.

Si ton environnement permet de générer une archive, crée également un fichier ZIP contenant le template complet.

Le ZIP ne doit pas contenir :

- node_modules ;
- fichiers temporaires ;
- données sensibles ;
- secrets ;
- clés API ;
- fichiers propres au projet actuel qui ne sont pas nécessaires au template.

Avant de générer l'export final, vérifie que le template est réellement autonome et qu'il ne dépend pas accidentellement d'un fichier spécifique du projet actuel.

À la fin, donne-moi :

1. le nom du package ;
2. sa structure ;
3. les dépendances nécessaires ;
4. les instructions d'installation ;
5. les instructions d'utilisation dans un nouveau projet ;
6. le fichier ZIP exporté si ton environnement permet de le générer.