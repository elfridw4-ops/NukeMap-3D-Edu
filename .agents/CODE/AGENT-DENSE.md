---
agent: AGENT-DENSE
commande: prompt:dense
role: agent-prompt-module
module: prompts-denses
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
note: Remplace la version courte du module correspondant pour les cas complexes ou production.
declencheurs:
  - prompts densifiés
  - production haute conversion
  - versions détaillées composants critiques
  - synthèse dense grande envergure
action: Versions densifiées et ultra-détaillées des prompts pour les projets en production critique ou à fort enjeu de conversion
---

# MODULE — Prompts Densifiés
> Charger AGENT-CORE.md avant ce module.
> Ces versions remplacent les versions courtes pour les projets en production ou à fort enjeu.
# PROMPTS DENSIFIÉS — Versions détaillées des éléments critiques

> Ces versions remplacent les versions courtes de la bibliothèque principale pour les cas complexes.
> Utiliser quand le projet est en production, quand l'enjeu conversion est élevé, ou quand le brief est complet.

---

## D1. `nav-header` — Header (version détaillée)

**Rôle :** Premier élément vu. Influe sur SEO (skip link), conversion (CTA), rétention (navigation claire), performance (render-blocking si mal implémenté).

**Variantes :** transparent · sticky · top bar · centré · split · méga menu · minimal · avec recherche

**Brief requis :** type de site · variante voulue · CTA principal · liens prioritaires · comportement mobile · présence d'un mega menu

**ÉTAPE 1 — Audit**

Lire et analyser sans exception :
- `package.json` ou équivalent → framework exact, version, librairies UI déjà présentes
- Fichier de config CSS/Tailwind/tokens → couleurs, breakpoints, espacements du design system
- Composant header existant (chemin complet) → structure actuelle, logique de scroll, menu mobile associé
- Routes du projet → quels liens de navigation existent réellement (pas supposer)
- Fichier de config du router (React Router, Next.js `app/`, Nuxt, etc.) → structure des routes
- Tout composant de menu mobile existant → état, animations, fermeture

Produire un rapport d'audit structuré avec :
| Élément | État actuel | Problème identifié | Décision requise |
|---|---|---|---|
| Liens de navigation | ... | ... | oui/non |
| CTA principal | ... | ... | oui/non |
| Comportement scroll | ... | ... | oui/non |
| Menu mobile | ... | ... | oui/non |
| Skip link accessibilité | ... | ... | oui/non |
| Performance (render-blocking) | ... | ... | oui/non |

Signaler explicitement :
- Si le header existant charge des fonts ou scripts bloquants
- Si le menu mobile est couplé au header (modifier l'un casse l'autre)
- Si un système de thème (dark mode, white-label) existe et doit être respecté

**ÉTAPE 2 — Conception**

Produire dans cet ordre :
1. Hiérarchie de navigation : liens primaires (max 6) vs secondaires → justification de chaque lien retenu ou écarté.
2. CTA principal : libellé exact + action déclenchée + couleur selon le design system (jamais une couleur inventée).
3. Comportement scroll : définir le seuil exact (ex: après 80px → header opaque, `position: sticky`, ombre portée).
4. Top bar : contenu, fermeture, cookie de mémorisation, hauteur fixe déclarée pour éviter le layout shift.
5. Méga menu : structure des colonnes, contenu de chaque colonne, déclencheur (hover + délai 150ms / clic), fermeture (click outside, Escape, focus out).
6. Recherche : overlay ou inline, déclencheur, raccourci clavier (Cmd+K standard), autocomplétion ou non.
7. Accessibilité : `skip link` vers `#main-content`, `aria-label` sur `<nav>`, `aria-current="page"` sur le lien actif, `aria-expanded` sur les dropdowns.
8. Performance : CSS du header en `<head>` (critique), JS en `defer`, fonts preloaded si utilisées dans le header.

**ÉTAPE 3 — Proposition**

Présenter :
- Maquette textuelle du header desktop (structure HTML commentée)
- Maquette textuelle du header mobile (structure HTML commentée)
- Tableau des décisions prises avec justification
- Liste des questions ouvertes nécessitant une réponse avant implémentation

Formuler : "Voici ma proposition. Réponds OUI pour que je procède à l'implémentation."

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- `<header>` avec `role="banner"` — jamais une `<div>` anonyme.
- Skip link en première position dans le DOM : `<a href="#main-content" class="sr-only focus:not-sr-only">Aller au contenu</a>`
- Navigation dans `<nav aria-label="Navigation principale">` — si plusieurs nav sur la page, chacune a un `aria-label` distinct.
- Lien actif : `aria-current="page"` sur l'élément courant — jamais détecter "l'actif" côté CSS uniquement.
- Dropdowns : `aria-expanded="false/true"` sur le bouton déclencheur, `aria-haspopup="true"`, fermeture sur Escape.
- Méga menu : focus trap pendant l'ouverture + fermeture sur click outside via event listener sur `document` (pas sur `window`).
- Comportement sticky : utiliser `position: sticky` + `top: 0` + `z-index` défini dans le design system (jamais `z-index: 9999`).
- Transparent → opaque au scroll : via `IntersectionObserver` sur un élément sentinelle — jamais via `scroll` event direct (performance).
- Mobile : le header ne doit pas recalculer sa hauteur à l'ouverture du menu. Hauteur fixe déclarée en variable CSS.
- CTA : `<button>` ou `<a>` selon que l'action navigue ou déclenche. Jamais un `<div onClick>`.
- Commit séparé par sous-fonctionnalité : header base / sticky behavior / méga menu / mobile.

---

## D2. `page-home` — Page d'accueil (version détaillée)

**Rôle :** Page la plus visitée, la plus scrutée par Google, la plus déterminante pour le taux de conversion. Chaque section a un rôle précis dans un tunnel de persuasion séquentiel.

**ÉTAPE 1 — Audit**

Lire et analyser :
- Code de la page d'accueil actuelle (structure des sections, composants, textes en dur ou CMS)
- Google Search Console si accessible → requêtes qui amènent sur la home, CTR, position moyenne
- Analytics si accessible → taux de rebond, scroll depth, heatmap si disponible
- Textes actuels → H1, sous-accroche, CTA, sections existantes
- Concurrents directs mentionnés par l'utilisateur → quelles sections ils utilisent
- Design system → couleurs primaires, typographie, espacements

Produire un rapport d'audit :
| Section | Existe | Problème identifié | Priorité |
|---|---|---|---|
| Hero (H1 + CTA) | oui/non | ... | critique |
| Logos de confiance | oui/non | ... | haute |
| Proposition de valeur | oui/non | ... | critique |
| Fonctionnalités | oui/non | ... | haute |
| Preuve sociale | oui/non | ... | haute |
| CTA intermédiaire | oui/non | ... | moyenne |
| FAQ | oui/non | ... | moyenne |
| CTA final | oui/non | ... | haute |

Signaler : sections présentes mais avec du contenu placeholder, CTA sans action définie, images manquantes ou non optimisées.

**ÉTAPE 2 — Rédaction**

Pour chaque section, produire le contenu exact (pas des placeholders) :

**Hero**
- H1 : formule = [Verbe d'action] + [résultat obtenu] + [pour qui] + [en combien de temps si pertinent]. Max 10 mots.
- Sous-accroche : 1 phrase, max 20 mots, développe le H1 sans le répéter. Inclure le différenciateur principal.
- CTA principal : verbe à l'infinitif + objet. Pas de "Cliquez ici". Pas de "En savoir plus". Maximum 4 mots.
- CTA secondaire : action moins engageante (voir une démo, voir les tarifs). Max 4 mots. Style lien texte.
- Visuel hero : décrire exactement ce que doit montrer l'image/illustration (pas "image accrocheuse") : sujet, angle, émotion, format (16:9, carré, illustr.).

**Logos de confiance**
- Titre de section : 1 ligne, ancrage social ("Rejoignez X+ équipes qui font confiance à…" ou "Ils nous font confiance").
- Liste des logos à afficher avec leur ordre de priorité (les plus reconnus en premier).

**Proposition de valeur (3 bénéfices)**
- Titre de section.
- Pour chaque bénéfice : icône (type), titre (max 5 mots), description (max 2 phrases, résultat concret, chiffre si disponible).

**Fonctionnalités**
- Titre de section.
- Pour chaque fonctionnalité retenue (max 6) : titre-bénéfice (pas titre-feature), description courte, visuel associé si applicable.

**Preuve sociale**
- 2 à 3 témoignages : prénom + nom + rôle + entreprise + photo + texte + résultat chiffré.
- Métrique clé si disponible : "X clients" / "Y% de satisfaction" / "Z heures économisées".

**FAQ courte**
- 4 à 6 questions exactes que l'utilisateur cible pose avant d'acheter. Source : SAV, avis, conversations.

**CTA final**
- Titre de section différent du hero (reformuler l'urgence ou la facilité, pas répéter la promesse).
- CTA identique au hero ou légèrement différent selon contexte (ex : "Commencer gratuitement" → "Créer mon compte").

**ÉTAPE 3 — Proposition**

Présenter chaque section avec son contenu exact + structure HTML commentée.
Signaler les sections pour lesquelles des données manquent (photos, témoignages, métriques) et ce qui sera utilisé en attendant.
Attendre validation section par section si l'utilisateur le demande, ou validation globale.

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- H1 unique sur la page, dans le hero, visible sans scroll. Jamais dans le header.
- LCP (Largest Contentful Paint) : l'image hero a `loading="eager"` + `fetchpriority="high"`. Toutes les autres images en `loading="lazy"`.
- CTA principal : `<a>` si navigue, `<button>` si déclenche une action JS. Jamais `<div onClick>`.
- Logos : `<img alt="[Nom de l'entreprise]">` — jamais alt vide sur un logo de client (c'est du contenu).
- Témoignages : balisage `Schema.org Review` ou `AggregateRating` si métriques disponibles → Rich Results Google.
- FAQ : balisage `FAQPage` JSON-LD obligatoire → Rich Results Google (affichage étendu dans les résultats de recherche).
- Sections : chaque section dans `<section aria-labelledby="[id-du-titre-de-section]">`.
- Performance : pas de script bloquant above the fold. Analytics et chat widgets en `defer` ou `async`.
- Ordre des sections dans le DOM = ordre de priorité SEO. Ne jamais réordonner via `order` CSS uniquement pour des sections entières.
- Commit séparé par section : hero / logos / valeur / fonctionnalités / preuve / faq / cta-final.

---

## D3. `ecom-checkout` — Checkout (version détaillée)

**Rôle :** Page à plus fort enjeu financier du projet. Chaque friction = vente perdue. Taux d'abandon moyen : 70%. Chaque amélioration UX ici est directement mesurable en revenus.

**Brief requis :** moyens de paiement disponibles · options de livraison · mono-page ou multi-étapes · guest checkout autorisé · marché cible (mobile first ?)

**ÉTAPE 1 — Audit**

Lire et analyser :
- Composant checkout existant → structure actuelle, étapes, champs présents
- Intégrations paiement en place (FedaPay, Kkiapay, Stripe, PayDunya, Mobile Money) → SDK version, webhook configuré ou non
- Logs d'abandon si disponibles → à quelle étape les utilisateurs partent
- Champs du formulaire actuel → lesquels sont vraiment nécessaires vs collectés "au cas où"
- Comportement mobile actuel → le checkout passe-t-il sur un écran 375px ?
- Email de confirmation post-achat → existe-t-il, est-il déclenché côté serveur ou côté client ?

Produire un rapport d'audit avec score de friction par étape (1 = fluide, 5 = bloquant).

**ÉTAPE 2 — Conception**

Décider en premier : mono-page ou multi-étapes.
- Mono-page : recommandé si panier simple (< 3 produits, livraison standard, un moyen de paiement).
- Multi-étapes (3 max) : recommandé si livraison complexe, plusieurs adresses, ou configuration produit.

Produire :
1. Champs strictement nécessaires — appliquer la règle de Baymard : chaque champ supprimé augmente le taux de complétion de ~5%. Justifier chaque champ conservé.
2. Ordre des champs : email → prénom/nom → adresse → livraison → paiement. Jamais commencer par le paiement.
3. Guest checkout : obligatoire si non connecté. Proposition de compte après la commande, jamais avant.
4. Récapitulatif commande : sticky sur desktop (colonne droite), accordéon en haut sur mobile.
5. Moyens de paiement : ordre d'affichage basé sur le marché cible (Mobile Money en premier si Afrique de l'Ouest).
6. Indicateurs de confiance : logo SSL, icônes des moyens de paiement, politique de retour en 1 ligne.
7. Autofill : champs nommés selon la spec HTML autocomplete (`autocomplete="email"`, `autocomplete="shipping address-line1"`, etc.).
8. Erreurs de paiement : messages spécifiques par code d'erreur (pas "Une erreur s'est produite").

**ÉTAPE 3 — Proposition**

Présenter : structure exacte du checkout avec chaque champ listé et justifié · ordre des sections · moyens de paiement et leur ordre · gestion des erreurs.

Signaler les décisions que l'utilisateur doit prendre : guest checkout oui/non, création de compte forcée ou optionnelle, données à conserver après achat.

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- Supprimer la navigation principale (header réduit : logo seul + indicateur de progression + lien "Retour au panier").
- Récapitulatif sticky côté droit sur desktop (`position: sticky; top: 24px`), accordéon fermé par défaut sur mobile.
- Chaque champ de formulaire a `autocomplete` correct — ne jamais mettre `autocomplete="off"` sur des champs d'adresse.
- Validation en temps réel (blur) avec messages sous chaque champ via `aria-describedby`.
- Bouton de soumission : désactivé pendant la requête, label change en "Traitement en cours…", spinner visible.
- Protection anti-double clic : idempotency key générée côté serveur avant l'appel de paiement.
- Webhook de confirmation paiement côté serveur (jamais faire confiance au retour client-side du SDK de paiement).
- HTTPS obligatoire sur toute la page — vérifier via `window.location.protocol` et rediriger si HTTP.
- Données de carte bancaire : jamais toucher au DOM des champs de carte si le provider utilise des iframes (Stripe Elements, etc.).
- Sur mobile : `font-size` minimum 16px sur tous les inputs pour éviter le zoom automatique iOS.
- Erreurs de paiement : afficher le message d'erreur exact du provider traduit en langage humain. Jamais afficher le code technique brut.
- Session de checkout : expiration après 30 minutes d'inactivité avec message d'avertissement à 5 minutes.
- Commit séparé : structure formulaire / intégration paiement / récapitulatif sticky / validation / gestion erreurs.

---

## D4. `auth-onboarding` — Onboarding (version détaillée)

**Rôle :** Moment le plus critique pour la rétention. Les utilisateurs qui n'atteignent pas le "aha moment" dans les 5 premières minutes ne reviennent jamais. Chaque étape superflue = churn.

**Brief requis :** quel est le "aha moment" exact du produit · combien d'étapes max tolérées · données nécessaires pour personnaliser · action concrète à la fin de l'onboarding

**ÉTAPE 1 — Audit**

Lire et analyser :
- Flux d'onboarding actuel (si existant) → nombre d'étapes, taux de complétion par étape si disponible
- Produit lui-même → quelle est l'action qui déclenche la valeur perçue (créer un premier item, inviter quelqu'un, voir un résultat, configurer quelque chose)
- Données collectées pendant l'onboarding → lesquelles sont vraiment utilisées pour personnaliser l'expérience vs collectées "pour plus tard"
- Email de bienvenue existant → est-il déclenché avant ou après l'onboarding

Définir en premier : le aha moment. Sans le définir, l'onboarding n'a pas de destination. Demander à l'utilisateur si non évident dans le code.

**ÉTAPE 2 — Conception**

Règle de base : chaque étape doit rapprocher l'utilisateur du aha moment. Si une étape ne le fait pas → la supprimer.

Produire :
1. Le aha moment défini en une phrase ("L'utilisateur a atteint la valeur quand il voit X pour la première fois").
2. Le chemin minimal vers ce aha moment (2 à 5 étapes max).
3. Pour chaque étape : titre (max 5 mots) + instruction (max 2 phrases) + action unique demandée + ce qui se passe si l'utilisateur skip.
4. Questions de personnalisation : max 3, chacune avec justification (comment la réponse sera-t-elle utilisée dans le produit ?). Si la réponse ne change rien au produit → supprimer la question.
5. Indicateur de progression : type (barre, étapes numérotées, points), position, comportement si l'utilisateur revient en arrière.
6. Bouton skip : présent sur toutes les étapes optionnelles. Label précis ("Je ferai ça plus tard", pas juste "Passer").
7. État vide post-onboarding : si l'utilisateur a tout skipé, que voit-il ? Prévoir un état vide guidé avec une action principale évidente.
8. Email de suivi : si l'utilisateur n'a pas complété l'onboarding après 24h → email de rappel avec lien de reprise à l'étape où il s'est arrêté.

**ÉTAPE 3 — Proposition**

Présenter : flux complet avec chaque étape détaillée + textes exacts + comportements si skip + état final.
Signaler : données collectées et comment elles sont utilisées, email de reprise prévu ou non.

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- État de progression persisté : `sessionStorage` pendant la session, `DB` côté serveur pour reprendre après fermeture.
- Chaque étape a une URL propre (`/onboarding/step-1`, `/onboarding/step-2`) pour permettre le retour arrière via le bouton navigateur.
- Bouton "Retour" du navigateur : intercepté via `popstate` pour revenir à l'étape précédente (pas quitter l'onboarding).
- Animations entre étapes : transition CSS de max 250ms, `prefers-reduced-motion` respecté.
- Skip d'une étape : les données de cette étape sont nulles/undefined côté serveur, pas de valeur par défaut silencieuse.
- Complétion de l'onboarding : événement analytics déclenché (`onboarding_completed`) avec le nombre d'étapes complétées vs skippées.
- Abandon de l'onboarding : événement analytics déclenché à chaque fermeture (`onboarding_abandoned`, étape courante, temps passé).
- Post-onboarding : redirection vers le dashboard avec un état vide guidé si aucune donnée n'a été créée pendant l'onboarding.
- L'onboarding doit être relançable depuis les paramètres utilisateur (certains utilisateurs veulent recommencer).
- Commit séparé : structure wizard / persistance état / animations / analytics / email de reprise.

---

## D5. `page-dashboard` — Dashboard (version détaillée)

**Rôle :** Page la plus utilisée après connexion. Doit répondre en < 3 secondes à la question implicite de l'utilisateur : "Où en suis-je et que dois-je faire maintenant ?"

**Brief requis :** qui utilise ce dashboard (rôles) · KPIs disponibles en DB · actions les plus fréquentes · fréquence d'usage (quotidienne = mémorisation possible, hebdo = chaque visite comme une redécouverte)

**ÉTAPE 1 — Audit**

Lire et analyser :
- Schéma de DB ou modèles → quelles données sont réellement disponibles (pas supposer)
- API endpoints existants → temps de réponse moyen, pagination ou non
- Rôles utilisateurs définis dans le code → admin, manager, opérateur, viewer — chaque rôle voit-il le même dashboard ?
- Dashboard actuel si existant → widgets présents, données affichées, requêtes DB sous-jacentes
- Bibliothèque de graphiques déjà installée dans `package.json` → ne pas en ajouter une seconde

Produire un inventaire des données disponibles :
| Métrique | Source (table/API) | Temps de calcul estimé | Mise à jour (temps réel / cache) |
|---|---|---|---|
| ... | ... | ... | ... |

**ÉTAPE 2 — Conception**

Décider en premier : quelles métriques sont primaires (visible sans scroll, max 4) vs secondaires (accessible en scrollant ou en filtrant).

Règle des 4 métriques primaires : choisir celles qui répondent à "est-ce que mon activité va bien ?" en un coup d'œil. Pas celles qui sont "intéressantes à avoir".

Produire :
1. Layout : définir le grid (ex: 4 colonnes sur desktop, 2 sur tablette, 1 sur mobile). Nommer chaque zone.
2. Widgets primaires (max 4) : métrique, unité, comparaison (vs hier/semaine dernière/objectif), couleur de tendance.
3. Graphiques : type (ligne = évolution temporelle, barre = comparaison, donut = répartition), données source, période par défaut, filtres temporels disponibles.
4. Tableau de données récentes : entité affichée, colonnes, tri par défaut, limite de lignes, lien "Voir tout".
5. Raccourcis d'actions : les 2 à 3 actions les plus fréquentes accessibles en 1 clic depuis le dashboard.
6. Alertes/notifications : critères de déclenchement, position (bannière en haut, badge sur icône), niveau de gravité.
7. Filtres temporels : options proposées (aujourd'hui, 7j, 30j, 90j, personnalisé), comportement au changement (rechargement partiel ou complet).
8. État vide (nouveau compte) : message d'orientation + action principale + illustration si budget design le permet.
9. Cache : quelle donnée est temps réel (stock, alertes) vs mise en cache (métriques globales, graphiques).

**ÉTAPE 3 — Proposition**

Présenter : layout annoté avec chaque widget identifié · données source de chaque widget · stratégie de cache proposée · état vide.
Signaler : métriques demandées qui ne peuvent pas être calculées sans modifier la DB ou les API.

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- Appels API parallèles pour les widgets indépendants (`Promise.all`) — jamais séquentiels.
- Skeleton loaders sur chaque widget pendant le chargement — jamais spinner global bloquant toute la page.
- Données en cache : TTL défini par type de donnée. Métriques globales : 5 min. Alertes : 30 sec. Graphiques historiques : 1h.
- Invalidation du cache sur action utilisateur (ex: création d'une commande → invalider le widget "Nouvelles commandes").
- Graphiques : ne jamais charger la librairie graphique en bloquant. `dynamic import()` ou `<Suspense>` si React.
- Filtres temporels : persistés dans l'URL (`?period=30d`) pour que l'utilisateur puisse partager ou retrouver sa vue.
- Métriques avec tendance : calculer la comparaison côté serveur, pas côté client (données sensibles).
- Responsive : sur mobile, les widgets se stackent en colonne. Le tableau de données devient une liste de cartes. Les graphiques ont une hauteur fixe réduite.
- Accessibilité graphiques : chaque graphique a un `<table>` de données équivalent caché mais accessible aux lecteurs d'écran (`aria-hidden="true"` sur le canvas, table avec `sr-only`).
- Permissions : le dashboard ne doit jamais faire de requête DB pour des données que le rôle de l'utilisateur n'est pas autorisé à voir. Vérification côté serveur sur chaque endpoint.
- Commit séparé : layout grid / widgets métriques / graphiques / tableau récent / raccourcis / alertes / état vide.

---

## D6. `lp-sales` — Sales Page (version détaillée)

**Rôle :** Page de vente longue. Structure une argumentation complète de la prise de conscience du problème jusqu'à l'achat. Chaque section a un rôle psychologique précis dans le cycle de décision.

**Brief requis :** produit exact + prix + audience (froide/tiède/chaude) + objections connues + preuves disponibles + urgence réelle si applicable

**ÉTAPE 1 — Audit**

Lire et analyser :
- Page de vente existante si elle existe → structure, textes actuels, CTA, preuves
- Avis clients existants (site, réseaux, SAV) → formulations exactes utilisées par les clients (pas paraphraser)
- Prix et conditions actuels → remboursement, engagement, durée
- Concurrents directs → ce qu'ils proposent, leur angle de vente, leurs garanties
- Analytics si disponibles → taux de rebond, scroll depth, clics sur les CTA

**ÉTAPE 2 — Rédaction**

Structure obligatoire dans cet ordre (chaque section a un rôle psychologique précis) :

**1. Hero — Identification**
L'utilisateur doit se reconnaître dans le titre. Pas de promesse miraculeuse. Décrire la situation actuelle du prospect, pas le produit.
- Titre H1 : situation actuelle + frustration implicite. Ex: "Vous perdez X heures par semaine à faire [tâche] manuellement."
- Sous-titre : amplifier le problème + segmenter l'audience ("Si vous êtes [profil], cette page est pour vous").
- CTA : ancre vers le bloc tarif en bas. Label = résultat final. Pas d'achat immédiat ici.

**2. Problème — Agitation**
Décrire le problème avec précision clinique. Utiliser les mots exacts des clients (collectés dans l'audit). Objectif : l'utilisateur pense "c'est exactement ça".
- 3 à 5 symptômes concrets du problème (pas des généralités).
- Conséquences de ne rien faire : ce que ça coûte (temps, argent, opportunités) si le problème n'est pas résolu.

**3. Solution — Révélation**
Introduire le produit comme la réponse logique et inévitable aux problèmes listés. Pas encore vendre, juste positionner.
- "Il existe une autre façon de…"
- Mécanisme unique : ce qui différencie fondamentalement ce produit des alternatives.

**4. Preuve — Crédibilité**
Preuves présentées avant les fonctionnalités. L'ordre compte : la crédibilité précède l'argumentation.
- Logos clients ou partenaires reconnaissables.
- Témoignages : format obligatoire = prénom + nom + rôle + entreprise + photo + problème qu'il avait + résultat obtenu (chiffre précis si disponible). Minimum 3.
- Métriques : chiffres vérifiables et précis (pas "des milliers de clients" → "2 847 clients actifs").

**5. Fonctionnalités → Bénéfices**
Chaque fonctionnalité présentée en bénéfice. Format : "Grâce à [fonctionnalité], vous pouvez [bénéfice], ce qui signifie [résultat concret]."
Maximum 6. Au-delà → fatigue de lecture.

**6. Objections — FAQ**
Minimum 10 questions. Sources : SAV, conversations commerciales, avis 3 étoiles (pas les 5 étoiles ni les 1 étoile). Format question directe + réponse franche (pas de langue de bois).
Questions obligatoires : prix (pourquoi ce prix), remboursement (conditions exactes), durée d'engagement, différence avec concurrent principal, pour qui ce n'est PAS adapté.

**7. Offre — Présentation**
Détailler l'offre complète : ce que l'utilisateur obtient exactement, le prix, les conditions.
- Stacking : lister tout ce qui est inclus avec la valeur individuelle de chaque élément si applicable.
- Garantie : conditions exactes, délai, procédure. Pas "satisfait ou remboursé" sans préciser le délai et la procédure.
- Urgence/rareté : uniquement si réelle (stock limité, prix qui augmente à une date précise). Jamais inventer.

**8. CTA final — Décision**
Reformuler la transformation (pas le produit) + CTA + réassurance immédiate sous le bouton (pas de carte de crédit requise, accès immédiat, annulation facile).

**ÉTAPE 3 — Proposition**

Présenter chaque section avec le texte exact proposé (pas des placeholders). Si des données manquent (témoignages, métriques), le signaler avec ce qui sera utilisé temporairement.

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- H1 unique, dans le hero. Aucune autre balise H1 sur la page.
- Hiérarchie Hn stricte : H1 → H2 (titres de section) → H3 (sous-sections). Jamais sauter un niveau.
- CTA répétés tous les 2 à 3 sections. Tous pointent vers la même destination (ancre vers le bloc tarif ou page checkout).
- Témoignages : balisage `Schema.org Review` ou `AggregateRating` → Rich Results Google.
- FAQ : balisage `FAQPage` JSON-LD → Rich Results Google.
- Images : toutes en `loading="lazy"` sauf l'image hero (`loading="eager"` + `fetchpriority="high"`).
- Videos si présentes : `preload="none"` avec thumbnail statique + play on click. Jamais autoplay.
- Performance : pas de widget tiers (chat, pop-up, compteur) qui se charge de façon synchrone et bloque le rendu.
- Mobile : CTA sticky en bas de l'écran sur mobile (barre fixe avec le bouton principal) — la sales page est longue, l'utilisateur ne doit jamais avoir à scroller pour trouver où acheter.
- Compteur d'urgence : si utilisé, généré côté serveur avec une expiration réelle stockée en session. Jamais un compteur JS qui repart à zéro au refresh.
- Commit séparé : hero / problème-solution / preuves / fonctionnalités / FAQ / offre / CTA sticky mobile.

---

---

## D7. `ecom-product` — Page produit (version détaillée)

**Rôle :** Page à plus fort potentiel de conversion après le checkout. Chaque élément manquant (image, variante, réassurance) = abandon avant même l'ajout au panier. C'est la page où l'utilisateur prend sa décision d'achat — pas au checkout.

**Brief requis :** type de produit (physique / numérique / service) · variantes disponibles (taille, couleur, format) · preuves disponibles (avis, certifications, garantie) · marché cible (B2C local, B2B, export)

**ÉTAPE 1 — Audit**

Lire et analyser sans exception :
- Composant page produit existant → structure actuelle, galerie, CTA, variantes
- Schéma DB ou API produit → quels attributs sont réellement disponibles (pas supposer)
- Avis clients existants → volume, note moyenne, distribution des notes
- `package.json` → librairie de galerie existante (ne pas en ajouter une nouvelle si une est déjà là)
- Analytics si disponibles → taux d'ajout au panier, scroll depth, clics sur les images
- Pages produits concurrentes mentionnées → quels éléments de réassurance ils utilisent

Produire un rapport d'audit :
| Élément | État actuel | Problème identifié | Priorité |
|---|---|---|---|
| Galerie images | ... | ... | critique |
| Prix + variantes above the fold | ... | ... | critique |
| CTA "Ajouter au panier" | ... | ... | critique |
| Éléments de réassurance | ... | ... | haute |
| Description courte | ... | ... | haute |
| Description longue | ... | ... | moyenne |
| Avis clients | ... | ... | haute |
| FAQ produit | ... | ... | moyenne |
| Produits liés | ... | ... | faible |
| Sticky CTA mobile | ... | ... | critique |

Signaler explicitement :
- Si les images produit ne sont pas optimisées (format, taille, alt manquants)
- Si le stock n'est pas affiché (crée de l'urgence si faible, rassure si disponible)
- Si le CTA disparaît au scroll sur mobile (le problème le plus fréquent)

**ÉTAPE 2 — Rédaction**

Produire le contenu exact pour chaque zone, dans cet ordre :

**Zone above the fold (visible sans scroll)**
- Titre H1 : nom exact du produit + différenciateur principal. Max 10 mots. Inclure le mot-clé principal (SEO).
- Prix : format local (FCFA, €, $), prix barré si promotion (jamais inventer un prix barré fictif), mention TVA si applicable.
- Variantes : libellés exacts de chaque option, ordre logique (taille XS→XL, couleur par ordre de popularité si connu).
- CTA principal : "Ajouter au panier" ou "Acheter maintenant" selon le flux checkout. Jamais les deux au même niveau.
- Stock : "En stock", "Plus que X en stock" si faible (urgence réelle), "Rupture de stock" avec option de notification.
- Réassurance sous le CTA : 3 éléments max (livraison gratuite à partir de X / retour 30 jours / paiement sécurisé).

**Description courte (above the fold)**
- 2 à 3 phrases. Bénéfice principal → différenciateur → public cible. Pas une liste de caractéristiques.

**Description longue (sous le fold)**
- Structure : bénéfices (pourquoi l'acheter) → caractéristiques techniques (quoi exactement) → cas d'usage (pour qui, dans quel contexte).
- Jamais commencer par les caractéristiques techniques.

**Avis clients**
- Afficher la note globale et la distribution (combien de 5 étoiles, 4 étoiles, etc.) avant les avis individuels.
- Trier par défaut : les plus récents avec photo en premier.
- Chaque avis : note + titre + texte + prénom + date + mention "Achat vérifié" si applicable.

**FAQ produit**
- 5 à 7 questions issues du SAV réel ou des questions posées sur la fiche produit.
- Format : question directe + réponse < 80 mots. Inclure balisage JSON-LD `FAQPage`.

**ÉTAPE 3 — Proposition**

Présenter :
- Layout desktop (2 colonnes : galerie gauche, infos droite) avec contenu exact de chaque zone
- Layout mobile (colonne unique, ordre des blocs)
- Textes exacts de chaque section (pas de placeholders)
- Liste des médias manquants (images, vidéo, certifications)

Formuler : "Voici ma proposition. Réponds OUI pour que je procède à l'implémentation."

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- Image principale : `loading="eager"` + `fetchpriority="high"`. Images de la galerie : `loading="lazy"`.
- Attribut `alt` sur chaque image : "[Nom du produit] — [angle ou couleur]". Jamais vide, jamais juste le nom du fichier.
- Galerie : navigation clavier (flèches gauche/droite), zoom au clic sur desktop, swipe sur mobile.
- Variantes : chaque option sélectionnable change l'image principale sans rechargement de page.
- Stock : jamais cacher le stock — afficher "Disponible" au minimum, "X en stock" si < 10.
- CTA sticky sur mobile : `position: fixed; bottom: 0` avec hauteur définie en CSS variable. Ne jamais couvrir le contenu scrollable derrière sans zone de padding compensatoire.
- Prix barré : balise `<del>` sur l'ancien prix pour l'accessibilité et le SEO.
- Balisage Schema.org `Product` obligatoire : name, description, image, sku, brand, offers (price, priceCurrency, availability), aggregateRating si avis disponibles → Rich Results Google.
- Avis : balisage `Review` + `AggregateRating` imbriqués dans `Product`.
- FAQ : balisage `FAQPage` JSON-LD séparé.
- Produits liés : chargement en `defer` ou lazy — jamais bloquer le rendu de la page principale pour les suggestions.
- Commit séparé : galerie / zone above-the-fold / descriptions / avis / FAQ / sticky-mobile.

---

## D8. `auth-login` + `auth-register` — Connexion & Inscription (version détaillée)

**Rôle :** Pages les plus abandonnées d'un produit. Un flux auth raté = utilisateur perdu avant même d'avoir vu la valeur du produit. Les deux pages sont densifiées ensemble car elles partagent l'état, les erreurs, et souvent le même composant.

**Brief requis :** méthodes d'auth disponibles (email/password, OAuth, magic link, SSO) · flux post-auth (onboarding, dashboard, page précédente) · guest checkout autorisé si e-commerce · politique mot de passe

**ÉTAPE 1 — Audit**

Lire et analyser :
- Composants login + register existants → structure, champs, validations, messages d'erreur actuels
- Fichier de config auth (Passport.js, NextAuth, Supabase Auth, Firebase Auth, custom) → méthodes configurées
- Routes protégées → quelles pages redirigent vers le login (pour configurer le `redirect_url` post-auth)
- Logs d'erreur si disponibles → quelles erreurs les utilisateurs rencontrent le plus souvent
- `package.json` → librairies de validation de formulaire déjà présentes (Zod, Yup, etc.)

Produire un rapport d'audit :
| Point | Login | Register | Problème | Décision requise |
|---|---|---|---|---|
| Méthodes disponibles | ... | ... | ... | oui/non |
| Messages d'erreur | ... | ... | ... | oui/non |
| Redirection post-auth | ... | ... | ... | oui/non |
| Validation temps réel | ... | ... | ... | oui/non |
| Autofill supporté | ... | ... | ... | oui/non |
| Accessibilité (label/input) | ... | ... | ... | oui/non |

**ÉTAPE 2 — Conception**

**Page Connexion**

Produire :
1. Ordre des méthodes d'auth : OAuth en premier si disponible (1 clic vs formulaire), email/password en second.
2. Libellés exacts des champs : "Adresse e-mail" (pas "Email"), "Mot de passe" (pas "Password").
3. Placeholder : jamais le label. Utiliser un exemple de format : "nom@exemple.com".
4. Lien "Mot de passe oublié" : juste sous le champ mot de passe, pas en bas de page.
5. Messages d'erreur par cas :
   - Identifiants incorrects : "Adresse e-mail ou mot de passe incorrect." — jamais préciser lequel (énumération).
   - Compte inexistant : même message que ci-dessus (énumération d'utilisateurs).
   - Compte bloqué : "Votre compte est temporairement bloqué. Réessayez dans X minutes."
   - Erreur réseau : "Connexion impossible. Vérifiez votre connexion et réessayez."
6. Redirection post-login : vers la page précédente si redirect_url en paramètre, sinon dashboard.

**Page Inscription**

Produire :
1. Champs minimum : email + mot de passe. Prénom optionnel si personnalisation prévue immédiatement. Jamais demander : nom de famille, téléphone, date de naissance à l'inscription (reporter après).
2. Règles mot de passe : afficher les critères visuellement (✓ / ✗) en temps réel pendant la saisie. Jamais bloquer avec une liste de règles avant que l'utilisateur commence à taper.
3. Confirmation de mot de passe : optionnel si l'interface a un toggle de visibilité. Obligatoire si pas de toggle.
4. Consentement CGU : checkbox non pré-cochée + lien vers les CGU en nouvelle fenêtre. Jamais bloquer l'inscription si l'utilisateur ne coche pas la newsletter (deux checkboxes séparées : CGU obligatoire, newsletter optionnelle).
5. Message post-inscription selon le flux :
   - Avec vérification email : "Un e-mail de confirmation a été envoyé à [email]. Cliquez sur le lien pour activer votre compte."
   - Sans vérification : redirection directe vers l'onboarding.

**ÉTAPE 3 — Proposition**

Présenter les deux pages ensemble avec :
- Structure et textes exacts de chaque page
- Comportement des erreurs par cas
- Flux de navigation entre les deux pages (lien "Déjà un compte ?" / "Créer un compte")
- Décisions à prendre : vérification email oui/non, OAuth providers à activer

Formuler : "Voici ma proposition. Réponds OUI pour que je procède à l'implémentation."

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :

**Sécurité (non négociable, priorité absolue) :**
- Jamais révéler si un email est enregistré dans les messages d'erreur (énumération d'utilisateurs).
- Rate limiting côté serveur sur les endpoints `/login` et `/register` — pas seulement côté client.
- Tokens CSRF si formulaire classique (pas API). Vérifier côté serveur, pas seulement générer côté client.
- Mot de passe : jamais logué, jamais en URL, jamais en localStorage. Uniquement en POST body HTTPS.
- Tentatives échouées : bloquer le compte après N échecs (configurable), avec délai progressif (pas juste un message).

**Accessibilité :**
- Chaque `<input>` a un `<label>` associé via `for`/`id`. Jamais de placeholder seul.
- Messages d'erreur liés au champ via `aria-describedby`.
- `autocomplete` correct : `autocomplete="email"` sur le champ email, `autocomplete="current-password"` sur le mot de passe au login, `autocomplete="new-password"` sur le mot de passe au register.
- Focus automatique sur le premier champ au chargement de la page.

**Performance :**
- Le formulaire est rendu côté serveur (SSR) ou statique — jamais dépendant d'un JS qui charge pour afficher les champs (les crawlers et les utilisateurs à connexion lente voient le formulaire immédiatement).
- OAuth : les boutons sont des liens `<a>` vers la route d'auth, pas des boutons JS (fonctionnent sans JS).

**UX :**
- Toggle visibilité mot de passe : icône œil, accessible au clavier, `aria-label` qui change ("Afficher le mot de passe" / "Masquer le mot de passe").
- Bouton de soumission : `disabled` pendant la requête + spinner + label change ("Connexion en cours…").
- Erreur réseau : jamais laisser le bouton en état de chargement indéfini. Timeout à 10 secondes maximum, puis message d'erreur.
- Commit séparé : formulaire login / formulaire register / messages d'erreur / OAuth buttons / accessibilité.

---

## D9. `form-wizard` — Formulaire Wizard (version détaillée)

**Rôle :** Le wizard est utilisé quand un formulaire unique serait trop long ou cognitif pour l'utilisateur. Chaque étape doit avoir un objectif précis et une progression mesurable. Un wizard mal conçu = taux d'abandon supérieur à un formulaire long bien conçu.

**Brief requis :** nombre d'étapes · logique de branchement entre étapes · données collectées par étape · si un résumé final est obligatoire · comportement si l'utilisateur ferme le navigateur en cours de route

**ÉTAPE 1 — Audit**

Lire et analyser :
- Wizard existant si applicable → nombre d'étapes, validations, persistance de l'état
- Données collectées → lesquelles sont vraiment nécessaires à chaque étape vs lesquelles peuvent attendre
- `package.json` → librairie de formulaire existante (React Hook Form, Formik, etc.) — ne pas en ajouter une autre
- Taux d'abandon par étape si disponibles → identifier où les utilisateurs quittent
- Cas d'usage métier → qu'est-ce qui est fait avec les données à la soumission finale (API appelée, email envoyé, DB écrite)

Produire un rapport d'audit d'étapes :
| Étape N | Données collectées | Validation requise | Dépend de l'étape | Optionnelle |
|---|---|---|---|---|
| 1 | ... | ... | — | non |
| 2 | ... | ... | étape 1 | ... |

Signaler explicitement :
- Si l'état n'est pas persisté (fermeture de navigateur = tout perdu)
- Si des étapes collectent des données jamais utilisées côté serveur
- Si le bouton "Retour" n'est pas implémenté (erreur fréquente)

**ÉTAPE 2 — Conception**

Règle fondamentale : chaque étape doit tenir dans un écran mobile sans scroll. Si une étape dépasse, la découper.

Produire :
1. **Cartographie des étapes :**
   - Étape N : titre (max 5 mots) + objectif en 1 phrase + champs exacts + condition d'avancement (quels champs doivent être valides pour passer à la suite)
   - Logique de branchement : si réponse X à l'étape 2 → sauter l'étape 3 et aller directement à l'étape 4
   - Étapes obligatoires vs optionnelles (avec bouton "Passer cette étape")

2. **Indicateur de progression :**
   - Barre linéaire si nombre d'étapes fixe et connu
   - Étapes numérotées si < 5 étapes
   - Jamais afficher un % de progression si la logique de branchement peut modifier le nombre total d'étapes (l'utilisateur verrait "60%" puis "40%" si une étape s'ajoute)

3. **Résumé final :**
   - Obligatoire si le wizard collecte des données importantes (devis, inscription longue, configuration)
   - Afficher uniquement les données saisies, organisées par étape, avec lien "Modifier" par section
   - Jamais afficher les valeurs par défaut non modifiées par l'utilisateur

4. **Comportement de navigation :**
   - Bouton "Suivant" : désactivé tant que l'étape n'est pas valide. Ne jamais afficher un message d'erreur au clic sur un bouton désactivé — valider en temps réel pendant la saisie.
   - Bouton "Retour" : toujours actif, jamais désactivé, revient à l'étape précédente sans perdre les données.
   - Lien de fermeture : si le wizard est dans une modal, prévoir une confirmation "Êtes-vous sûr ? Vos données ne seront pas sauvegardées."

5. **Persistance :**
   - Session active : `sessionStorage` par défaut (perdu à la fermeture = acceptable pour la plupart des cas)
   - Si données importantes : sauvegarde en DB à chaque changement d'étape (brouillon), avec reprise possible

**ÉTAPE 3 — Proposition**

Présenter :
- Cartographie complète des étapes avec titre, champs et conditions de validation
- Logique de branchement sous forme d'arbre (texte, pas de schéma)
- Structure du résumé final
- Stratégie de persistance choisie avec justification

Formuler : "Voici ma proposition. Réponds OUI pour que je procède à l'implémentation."

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- L'état du wizard est une source de vérité unique (Redux slice, Zustand store, ou React Context) — jamais éparpillé dans des states locaux par étape.
- Chaque étape a une URL propre (`/wizard/step-1`, `/wizard/step-2`) pour que le bouton retour du navigateur fonctionne via `popstate`. Sans ça, retour arrière = quitter le wizard.
- Validation : déclenchée au `blur` de chaque champ, et à nouveau au clic sur "Suivant". Jamais seulement à la soumission finale.
- Champs masqués par logique de branchement : `disabled` + `aria-hidden="true"` + valeur réinitialisée à `null` (jamais envoyer une donnée de champ masqué).
- Animation entre étapes : transition CSS `transform: translateX()` (pas `display: none` → layout shift). Max 250ms. `prefers-reduced-motion` : pas d'animation.
- Soumission finale : idempotency key générée avant l'envoi — double clic ou double soumission ne crée pas deux enregistrements.
- En cas d'erreur serveur à la soumission finale : revenir à l'étape de résumé avec le message d'erreur. Jamais réinitialiser le wizard entier.
- Tests obligatoires avant livraison : tester tous les chemins de branchement (pas seulement le chemin "happy path"), tester le bouton retour navigateur, tester la reprise après fermeture si persistance active.
- Commit séparé : state management / navigation étapes / validation / résumé / persistance / animations.

---

## D10. `lp-lead-gen` — Lead Generation (version détaillée)

**Rôle :** Page la plus utilisée en acquisition. Son seul objectif : convertir un visiteur anonyme en contact qualifié en échange d'une valeur. Chaque élément qui ne sert pas cet objectif unique est une distraction à supprimer.

**Brief requis :** offre exacte échangée contre l'email (ebook, démo, checklist, template, accès anticipé) · source du trafic (pub froide, organique, retargeting) · intégration email/CRM cible · nombre de champs maximum toléré

**ÉTAPE 1 — Audit**

Lire et analyser :
- Page existante si applicable → structure, formulaire, textes, taux de conversion si disponible
- Source du trafic → pub froide = audience qui ne connaît pas le produit (besoin d'éduquer) vs retargeting = audience qui connaît déjà (aller directement à la valeur)
- Intégration email/CRM disponible dans le code (Mailchimp, Brevo, ConvertKit, MailerLite, Resend) → ne pas proposer une intégration absente
- Offre proposée → existe-t-elle réellement (fichier, démo, système de démo) ou est-elle encore à créer ?
- Analytics si disponibles → d'où vient le trafic actuel, quel device (mobile dominant = formulaire encore plus court)

Signaler explicitement :
- Si l'offre n'existe pas encore → la page ne peut pas être livrée avant que l'offre existe
- Si l'intégration CRM n'est pas configurée → le formulaire ne servira à rien
- Si la source de trafic est inconnue → impossible de calibrer la longueur et le ton

**ÉTAPE 2 — Rédaction**

Règle fondamentale : chaque mot doit justifier sa présence. Si supprimer un élément ne réduit pas le taux de conversion, le supprimer.

**Hero (above the fold — seule zone visible sans scroll sur mobile)**

Produire dans cet ordre exact :
1. Titre H1 : formule = [Ce que l'utilisateur obtient] + [résultat concret] + [délai si possible]. Max 10 mots. Pas de jeu de mots, pas de titre "malin" — clarté > créativité.
   - Bon : "Téléchargez le guide pour doubler votre taux d'ouverture d'emails en 7 jours"
   - Mauvais : "Libérez le potentiel de votre stratégie email"
2. Sous-accroche : lève le principal doute ("Pas besoin de compte", "Gratuit, sans carte bancaire", "Résultats dès la première semaine"). Max 20 mots. Une seule phrase.
3. Formulaire : champ email (prénom si personnalisation immédiate dans le premier email). Jamais plus de 2 champs sans justification métier forte.
4. Bouton CTA : jamais "Envoyer" ou "S'abonner". Toujours orienté valeur et bénéfice : "Télécharger le guide", "Accéder gratuitement", "Recevoir ma checklist". Max 5 mots.
5. Réassurance sous le bouton : 1 ligne max. "Pas de spam. Désabonnement en 1 clic." Jamais plus long.

**Section présentation de l'offre (sous le fold)**

Produire :
- Visuel de l'offre (mockup du PDF, capture d'écran de la démo, aperçu de la checklist) — jamais une image stock générique.
- "Ce que tu vas obtenir" : liste de 3 à 5 bénéfices concrets. Format : verbe d'action + résultat mesurable. Ex: "Identifier les 3 erreurs qui tuent votre taux d'ouverture" pas "Améliorer votre email marketing".
- Qui a créé ça (crédibilité de la source) : 1 phrase + photo si applicable.

**Preuve sociale (si disponible)**

- Nombre d'abonnés ou de téléchargements si > 100 : "Rejoignez 2 340 marketeurs qui reçoivent déjà nos guides."
- 1 à 2 témoignages de personnes ayant utilisé le contenu : format = prénom + rôle + résultat obtenu. Jamais un témoignage générique ("Super contenu !").

**FAQ courte (si la source est froide)**

- 3 à 5 questions autour des objections à l'inscription : "C'est vraiment gratuit ?", "Que faites-vous de mon email ?", "Quand vais-je recevoir le guide ?".
- Ajouter balisage JSON-LD `FAQPage`.

**ÉTAPE 3 — Proposition**

Présenter :
- Structure exacte above the fold avec textes définitifs (pas de placeholders)
- Structure sous le fold avec textes définitifs
- Recommandations sur le formulaire (nombre de champs, libellés, bouton)
- Variante A/B suggérée si applicable (2 titres H1 à tester)
- Ce qui est absent et bloque l'implémentation (offre non créée, CRM non configuré, etc.)

Formuler : "Voici ma proposition. Réponds OUI pour que je procède à l'implémentation."

**ÉTAPE 4 — Implémentation**

Règles techniques non négociables :
- Supprimer la navigation principale : header = logo uniquement, footer = liens légaux uniquement. Tout lien sortant = fuite du tunnel.
- Formulaire above the fold : sur mobile, le formulaire doit être entièrement visible sans scroll. Si le titre est trop long → raccourcir le titre, pas déplacer le formulaire.
- `autocomplete="email"` sur le champ email — obligatoire pour la compatibilité des gestionnaires de mots de passe et le remplissage automatique mobile.
- Soumission du formulaire : requête asynchrone (jamais rechargement de page). État de succès inline (pas une redirection vers une nouvelle page — sauf si la thank you page est voulue pour le tracking de conversion).
- Si thank you page : pixel de conversion à déclencher sur cette page (Google Ads, Meta Pixel) — prévoir un `<script>` conditionnel côté serveur, jamais côté client seul (adblockers).
- Double opt-in : si applicable (RGPD), l'email de confirmation doit être envoyé dans les 30 secondes. Afficher un message clair : "Vérifiez votre boîte mail pour confirmer votre inscription."
- Performance page : First Contentful Paint < 1.5s. Pas de fonts bloquantes. Pas de scripts tiers (analytics, chat) qui retardent le rendu above the fold.
- H1 : un seul sur la page. Balisage `og:title`, `og:description`, `og:image` remplis (la page peut être partagée).
- Lien légal "Politique de confidentialité" obligatoire à proximité du formulaire (pas seulement dans le footer).
- Commit séparé : structure HTML / textes / formulaire + intégration CRM / tracking / optimisation mobile.

---

*HG Prompt · v1.3 · 2026*
*Prompts densifiés : nav-header, page-home, ecom-checkout, auth-onboarding, page-dashboard, lp-sales, ecom-product, auth-login+register, form-wizard, lp-lead-gen*
