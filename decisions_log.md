# Registre des Décisions Architecturales (ADR)

## ADR-01 : Utilisation de Deck.gl v9 en mode Fonctions Accesseurs Pures

* **Date** : 2026-05-11
* **Contexte** : Durant le boot initial, l'application levait un bogue bloquant : `deck: initialization of ScatterplotLayer({id: 'thermal-layer'}): accessor "getRadius" is not a function`. Ceci s'explique par la nouvelle implémentation stricte des attributs et accesseurs de Deck.gl v9. Passer un scalaire non garanti (notamment `undefined` dans le cas de `radii.thermal`) conduit à une rupture d'initialisation de l'instance d'affichage de Deck.gl.
* **Décision** : Convertir tous les paramètres `getRadius` de l'ensemble des instances de `ScatterplotLayer` en fonctions anonymes de type `() => nominalValue`.
* **Alternatives envisagées** : Modifier les types globaux pour autoriser les variables indéfinies ou forcer des valeurs de repli statiques, mais cela masquerait les véritables anomalies géométriques.
* **Conséquences** :
  * Garantit que Deck.gl reçoit des fonctions d'accès régulières.
  * Offre une réactivité instantanée si la puissance de l'arme est éditée dynamiquement depuis le panneau latéral de contrôle.
  * Réduit à 0% le risque d'exceptions d'initialisation de couche.

---

## ADR-02 : Rendu Concentrique Empilé (Largest-First Layering)

* **Date** : 2026-05-11
* **Contexte** : Lors de la superposition d'ondes de choc, de dômes thermiques et de cratères, l'ordre d'affichage des couches détermine si elles s'occluent mutuellement ou si elles fusionnent de manière compréhensible pour l'utilisateur.
* **Décision** : Adopter un ordre hiérarchique décroissant en taille (du plus grand cercle d'irradiation thermique de 1er degré jusqu'à la boule de feu et au cratère central).
* **Alternatives envisagées** : Rendu aléatoire géré par l'ordre d'évaluation de l'arbre, mais cela provoquait des clignotements ou des masquages permanents des petits cercles internes sous un large cercle jaune/orange opaque.
* **Conséquences** :
  * La lisibilité est optimale : chaque zone de dégâts possède sa délimitation contrastée.
  * Les opacités se multiplient proprement de sorte à donner un aspect "noyau incandescent" vers la zone centrale de vaporisation.

---

## ADR-03 : Couplage de la Physique d'Amortissement avec les Données de Relief Réelles

* **Date** : 2026-05-11
* **Contexte** : L'utilisateur souhaite extraire automatiquement de la topographie réelle lors de la sélection d'une cible. Cette topographie doit avoir un impact physique direct et observable sur la simulation de l'explosion, et non pas simplement être affichée à titre informatif.
* **Décision** : Corréler le coefficient de rugosité topologique ou le relief ("flat", "hilly", "mountainous") avec le paramètre `terrainDamping` de la modulation d'onde de choc barométrique de manière automatique. Lors du calcul de l'écart type d'altitude sur les 5 points cardinaux prélevés via Open-Meteo DEM (rayon de 2km), nous calculons un coefficient de déviation locale servant à calibrer `terrainDamping` entre 1.0 (plaine parfaitement plane) et 1.8 (très montagneux / accidenté).
* **Alternatives envisagées** : Laisser l'altitude au sol comme une simple chaîne textuelle informative sans rétroaction fonctionnelle sur la propagation physique des surpressions.
* **Conséquences** :
  * Améliore grandement l'authenticité scientifique de la simulation.
  * L'utilisateur constate que dans les régions montagneuses (comme l'Himalaya ou les Alpes), l'étendue spatiale destructrice de l'onde de choc est amortie de manière plus agressive que dans les grandes plaines planes ou les bassins côtiers.
  * Automatise intelligemment l'expérience utilisateur en fournissant un préréglage optimal dès le clic géographique.

---

## ADR-04 : Volet d'Armement Omniprésent et Isolation des Fiches d'Analyse Cibles

* **Date** : 2026-05-11
* **Contexte** : Dans la version précédente, le panneau "Trajectoire & Lancement" et le sélecteur de "Vecteur de Livraison" (ex: ICBM, Quds-1) n'étaient visibles qu'en mode "balistique". Les utilisateurs de détonations "instantanées" (mode par défaut) perdaient de fait toute visibilité et accès sur les modes de vecteur d'armement. De surcroît, le volume massif d'indicateurs de l'Analyse de Cible Intégrée (altitudes, Overpass, tsunamis, vents) envahissait l'espace visuel immédiatement au clic d'une cible sans action explicite de repliement.
* **Décision** :
  1. Rendre le volet de configuration balistique et lanceurs visible en permanence pour toutes les configurations, permettant l'analyse des capacités et de la portée même en tirs instantanés,
  2. Forcer le pliage par défaut de l'Analyse de Cible Intégrée en montrant une bannière de repli élégante de résumé à l'initialisation, avec possibilité de déploiement d'un seul clic ou geste.
* **Alternatives envisagées** : Maintenir un masquage rigide basé exclusivement sur le mode actif, mais cela diminuait la richesse pédagogique des vecteurs existants.
* **Conséquences** :
  * Confort de navigation optimal, sans surcharge d'informations complexes au démarrage du ciblage.
  * L'utilisateur conserve et apprécie la configuration des lanceurs et vecteurs historiques (Ex: missiles Houthi au Yémen) de manière cohérente à l'écran.

---

## ADR-05 : Cycle de vie et Nettoyage de l'Animation de Vol Asynchrone

* **Date** : 2026-05-11
* **Contexte** : Lorsque l'utilisateur modifiait son point de ciblage, son origine, ou basculait de mode en plein vol du missile, la boucle de rendu d'arrière-plan (`requestAnimationFrame`) continuait de progresser sans interruption. Ce problème provoquait des détonations inattendues ultérieures et d'inutiles recalculs ("vols zombies"). L'usage du mode instantané engendrait également d'importants doublons de détonation si une origine était définie.
* **Décision** :
  1. Gérer une référence persistante de l'animation de lancement (`launchAnimRef = useRef<number | null>(null)`),
  2. Créer une fonction d'arrêt systématique, `cancelFlight()`, qui réinitialise `flightProgress` et invoque `cancelAnimationFrame(launchAnimRef.current)` s'il n'est pas nul,
  3. Appeler `cancelFlight()` durant toute modification géographique cliquée sur la carte, recherche Nominatim accomplie, ou permutation de mode de simulation balistique/instantané,
  4. Bypasser toute trame balistique asynchrone lors du clic sur le bouton de tir si le mode est configuré en détonation instantanée.
* **Alternatives envisagées** : Utiliser un hook de type `useEffect` auto-raccordé sur `flightProgress`, mais cela s'avérait complexe et sujet à des décalages d'état asynchrones (race conditions).
* **Conséquences** :
  * Élimination complète de la détonation fantôme ou doublée en arrière-plan.
  * Cycle de vie de l'application et rafraîchissement d'IHM extrêmement réactifs et prévisibles.
  * Zéro gaspillage CPU lié à des boucles asynchrones invisibles.

---

## ADR-06 : Résolution de la Limite d'Échappement JSX (&lt; Sign) dans l'IHM du Panneau Latéral

* **Date** : 2026-05-11
* **Contexte** : Pendant les ajustements d'IHM, l'utilisation du symbole d'inégalité mathématique inférieur brute (`<`) suivi de la valeur `10 min` a généré une erreur critique au cours du processus de transformeur Vite ESBuild : `/app/applet/src/components/Sidebar.tsx:1337:117: ERROR: Expected identifier but found "1"`. L'analyseur du parser JSX s'attendait à ce que `<` introduise une balise d'élément valide ou un identifiant de composant plutôt qu'un comparateur logique brut.
* **Décision** : Remplacer le caractère brut `<` par son entité HTML correspondante sécurisée `&lt;` afin d'isoler l'interprétation sémantique de l'affichage textuel vis-à-vis du parseur JSX de Vite, ou l'échapper sous forme d'expression de chaîne de caractères `{}`.
* **Alternatives envisagées** : Utiliser des guillemets d'expression `{"< 10 min"}` ou restructurer la phrase pour omettre le signe d'inégalité, mais `&lt;` reste la méthode de structuration HTML standard la plus lisible et légère.
* **Conséquences** :
  * Résolution définitive du blocage de chargement trans-compilateur Vite à l'exécution.
  * Maintien d'une clarté typographique impeccable de la fenêtre de réaction critique sans introduire de lourdeur syntaxique inutile.
  * Reprise de la compilation réussie du build de production de l'application.

---

## ADR-07 : Portail d'Onboarding et Présentation Découplée de la Console

* **Date** : 2026-06-15
* **Contexte** : Dans le but de clarifier la proposition de valeur et les cas d'usages sémantiques réels à destination du public éducatif et professionnel, sans alourdir le noyau de calcul et de rendu réactif Deck.gl, un portail de présentation centralisé était nécessaire.
* **Décision** : Créer un composant autonome `LandingPage.tsx` accueillant l'ensemble de la copy produit (problèmes, bénéfices, FAQ, cas concrets) et introduire une variable d'état `currentTab: 'landing' | 'simulator'` au niveau de `App.tsx` pour l'ordonnancement séquentiel des vues sans perte de mémoire de ciblage.
* **Alternatives envisagées** : Fusionner la présentation au sein d'une sidebar complexe dans le simulateur, mais cela aurait pollué l'interface scientifique, ralenti le premier rendu visuel et nui à la clarté pédagogique générale.
* **Conséquences** :
  * Onboarding utilisateur impeccable et captivant sous le thème Bunker Chic.
  * Autonomie complète de la console active qui conserve l'intégralité de ses coordonnées GPS, trajectoires de missiles, impacts et historiques même si l'utilisateur navigue vers le portail.
  * Zéro régression sur le framerate ou sur l'expérience cartographique pure.



