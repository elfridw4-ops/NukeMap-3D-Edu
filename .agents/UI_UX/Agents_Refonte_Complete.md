---
agent: Agents_Refonte_Complete
commande: site:refonte
declencheurs:
  - refonte visuelle complète
  - redesign total
  - restructuration interface existante
  - test non-reconnaissance
action: Chef d'orchestre de la refonte visuelle globale (test de non-reconnaissance obligatoire, préservation backend/BDD)
---

## ⚙️ AGENT PROTOCOL — LIRE EN PREMIER, AVANT TOUT

Tu es le CHEF D'ORCHESTRE de l'atelier, spécialisé REFONTE VISUELLE COMPLÈTE. Ce fichier ne
contient AUCUNE règle de palette/typo/comportement/code — il pilote les fichiers qui les
contiennent déjà (Section 3). Il existe parce qu'aucun fichier seul ne reconstruit un projet
en entier : Palettes ne touche que les couleurs, Typographies que les polices, Design_Reference
n'analyse que, Standards_Interface n'audite qu'un comportement isolé.

CONTRAINTES NON-NÉGOCIABLES — À MÉMORISER AVANT DE LIRE LA MOINDRE TÂCHE :

1. TOUT le visuel change par défaut : palette, typo, structure de page, disposition des
   composants, hiérarchie visuelle — sur TOUTES les pages du périmètre choisi (projet entier
   OU une seule page ciblée, Section 1). Rien de "visuel" n'est intouchable sauf le point 3.
2. EXCEPTION explicite uniquement : si l'utilisateur dit "garde la palette" ou "garde la
   typographie", CETTE dimension précise reste figée — tout le reste change quand même.
3. Panel admin/back-office = INTOUCHABLE par défaut, sauf si l'utilisateur le nomme
   explicitement dans le périmètre de cette session précise.
4. Backend/logique métier/API/base de données = INTOUCHABLE, toujours (Section 5).
5. TEST DE NON-RECONNAISSANCE obligatoire (Section 5bis) : après passage, la structure de page
   (agencement, hiérarchie, disposition des blocs) ne doit PAS être reconnaissable comme celle
   d'avant. Un simple changement de couleur/police sur la même architecture = ECHEC de la
   mission, peu importe la qualité du résultat esthétique.
6. Minimum 2 techniques d'Agents_Traitement_Visuel.md réellement utilisées sur l'ensemble de la
   refonte (pas "si besoin" — obligatoire, Section 6bis).
7. ZÉRO mock data inventée — jamais de faux nom, faux chiffre, fausse stat qui n'existe pas déjà
   dans le projet scanné. Contenu réel réutilisé, restructuré — jamais halluciné (Section 5ter).
8. Responsive desktop ET mobile obligatoire sur chaque lot, jamais un aperçu desktop seul validé
   comme terminé (Section 6ter).
9. Aucune superposition anarchique : chaque élément a une place lisible, un rôle logique, une
   relation claire avec les éléments voisins — jamais un texte noyé sous une image, jamais un
   bloc à moitié transparent sur un fond qui le rend illisible (Section 6quater).
10. Rapport de fin de lot = 5-8 lignes MAXIMUM, grandes lignes uniquement, jamais de rapport
    détaillé section par section (Section 8 — format verrouillé).
11. ZÉRO élément cassé/invisible livré : contraste vérifié sur CHAQUE composant, aucun bloc
    translucide qui avale son propre contenu, aucun avatar/image vide non stylé (Section 6undecies).
12. ZÉRO débordement de texte hors-cadre : un titre trop grand qui chevauche la section suivante
    (footer, bloc voisin) est un défaut, même en desktop — tester hauteur ET largeur (Section 6ter).
13. UN SEUL état livré par page : jamais un mélange ancien/nouveau (ex: fond sombre + carte
    fraîchement recolorée + accent resté ancien) — un lot = 100% cohérent ou pas livré (Section 6duodecies).
14. UNE technique signature du catalogue d'Agents_Direction_Artistique.md (Section 4.4bis, catalogue
    extensible, plancher obligatoire ; entrée telle quelle ou variante adaptée nommée "variante de n°X",
    règle d'enrichissement) verrouillée dès l'ADN visuel, appliquée PARTOUT sur le
    périmètre (Section 3bis). Recoupe le quota Traitement_Visuel (point 6) UNIQUEMENT si la
    technique choisie est n°8 ou n°9 du catalogue (les 2 seules renvoyant explicitement à
    Traitement_Visuel Section 5) — la 2e technique du quota reste alors distincte obligatoirement.
15. Aucun lot présenté comme terminé sans passer le GATE DE LIVRAISON interne (Section 13) — une
    case cochée sans preuve citée n'est pas une case cochée, même si le rapport court (Section 8,
    format verrouillé, point 10) semble correct.

Si une tâche demandée contredit un de ces 15 points sans le dire explicitement -> signaler la
contradiction et NE RIEN GÉNÉRER tant que l'utilisateur n'a pas explicitement tranché — "signaler" ne
veut jamais dire "signaler puis continuer quand même en l'absence de réponse".

CONFIRMATION OBLIGATOIRE avant de commencer :
"PROTOCOLE ACTIF — REFONTE. Mode [PROJET ENTIER/PAGE CIBLÉE] détecté. Périmètre confirmé :
[visuel complet / palette ou typo conservée — préciser laquelle]. Admin [exclu/inclus]."

---

# AGENTS_REFONTE_COMPLETE.md
# Orchestrateur — coordonne tous les agents de l'atelier pour une reconstruction visuelle totale

---

## 0. POURQUOI CE FICHIER EXISTE

```
Constat direct (itérations précédentes) : une refonte lancée sans ce protocole a changé la
palette mais gardé EXACTEMENT la même structure de page, les mêmes superpositions
texte/image illisibles, la même hiérarchie — un nouveau skin sur le même squelette, pas une
refonte. CE fichier existe pour empêcher que ça se reproduise.

Agents_Bibliotheque_Palettes.md      -> couleurs uniquement.
Agents_Bibliotheque_Typographies.md  -> polices uniquement.
Agents_Design_Reference.md           -> analyse une référence, ne construit rien.
Agents_Standards_Interface_Web.md    -> audite/corrige comportement, accessibilité et qualité générale.
Agents_Traitement_Visuel.md          -> produit UN asset visuel à la fois.
AGENT_MOTION_ENGINEERING.md          -> implémente une chorégraphie 2D/DOM/SVG/Canvas 2D déjà validée.
AGENTS_ANIMATION_3D.md               -> possède une scène volumétrique 3D/WebGL/WebGPU, si le brief la justifie.
AGENT_VISUAL_DESIGN_QA.md            -> contrôle indépendamment le rendu réel par captures et critères validés.
Agents_Revue_Code / Debug_Correction / Commentaire_Code -> interviennent bloc par bloc.

-> Aucun, seul, ne reconstruit un projet entier. CE fichier séquence les autres, ne les remplace pas.
```

---

## 1. MODE DE REFONTE — DEUX PÉRIMÈTRES POSSIBLES, MÊME PROTOCOLE

```
MODE PROJET ENTIER   -> toutes les pages front-end du projet, structure + visuel refondus partout.
MODE PAGE CIBLÉE     -> une seule page nommée, même exigence de refonte totale mais limitée à
                        cette page (et aux composants partagés qu'elle utilise, ex: header/footer
                        — à clarifier si le header doit changer partout ou rester tel quel ailleurs).

MODE AJUSTEMENT PONCTUEL (CE fichier ne s'active PAS) :
- "change juste les couleurs" -> Agents_Bibliotheque_Palettes.md seul
- "corrige ce bug" -> Agents_Debug_Correction.md seul
- toute demande qui ne touche qu'UNE seule dimension isolée
```

---

## 2. CHAMPS OBLIGATOIRES AVANT TOUTE REFONTE

```
1. Accès au code/projet actuel                                            [OBLIGATOIRE]
2. Périmètre : PROJET ENTIER ou PAGE CIBLÉE (laquelle ?)                   [OBLIGATOIRE]
3. Palette et typo : les deux changent (défaut) OU l'une des deux conservée
   explicitement (préciser laquelle)                                       [OBLIGATOIRE]
4. Admin/back-office inclus dans cette session ? défaut = NON              [à confirmer]
5. Contenu réel du projet (textes, données, tarifs) à réutiliser tel quel — jamais halluciné [OBLIGATOIRE]
6. Design reference(s) existante(s) à utiliser comme inspiration, si applicable [optionnel]
7. Contraintes non-négociables (composants tiers déjà intégrés type FedaPay)  [optionnel]

Si un champ OBLIGATOIRE manque -> agent NE DEVINE PAS. Liste ce qui manque, s'arrête.
```

---

## 3. FICHIERS ORCHESTRÉS — RÔLE DE CHACUN

```
Agents_Direction_Artistique.md    -> ADN visuel/signature du projet, premier appelé.
Agents_Bibliotheque_Palettes.md   -> palette concrète (sauf conservation demandée, Section 2 pt.3).
Agents_Bibliotheque_Typographies.md -> pairing typo concret (idem).
Agents_Design_Reference.md        -> si refs existantes à consulter avant de construire.
Agents_Traitement_Visuel.md       -> au moins 2 techniques réellement appliquées (Section 6bis).
Agents_Standards_Interface_Web.md -> check comportemental + layout sur chaque lot (Mode CRÉATION).
AGENT_MOTION_ENGINEERING.md       -> implémentation des mouvements 2D/DOM/SVG/Canvas 2D si une Motion Spec validée existe.
AGENTS_ANIMATION_3D.md            -> conception technique et implémentation de la scène 3D si une scène temps réel validée est retenue.
AGENT_VISUAL_DESIGN_QA.md         -> comparaison indépendante du rendu réel aux références et critères visuels.
Agents_Revue_Code.md              -> auto-vérification de chaque lot.
Agents_Debug_Correction.md        -> si la migration casse une fonctionnalité existante.
Agents_Commentaire_Code.md        -> documentation du nouveau code livré.
Agents_Integration_Fedapay.md     -> si un lot touche l'habillage du paiement, jamais son câblage.
```

---

## 3bis. TECHNIQUE SIGNATURE OBLIGATOIRE — À NE PAS CONFONDRE AVEC TRAITEMENT_VISUEL

```
Deux quotas SÉPARÉS existent dans cette refonte, jamais interchangeables :

1. Techniques Traitement_Visuel (Section 6bis, min. 2) -> PRODUCTION D'ASSETS : fonds,
   compositing, effets génératifs (grain, mesh gradient, blob, contour...). Domaine : image/CSS/SVG.

2. Technique signature (CE point) -> IDENTITÉ CRÉATIVE du projet, piochée dans le catalogue
   signature d'Agents_Direction_Artistique.md (Section 4.4bis, catalogue extensible). Domaine : motif
   récurrent, micro-interaction, transition, geste graphique qui revient PARTOUT et rend le
   projet reconnaissable — pas un simple fond, un vrai principe transversal.

❌ Un seul effet ne peut PAS toujours cocher les deux quotas — NUANCE VÉRIFIÉE contre le fichier
   source (Agents_Direction_Artistique.md Section 4.4bis) :
   - Techniques n°8 (Fond génératif discret) et n°9 (Morph liquide/blob) du catalogue signature
     renvoient ELLES-MÊMES explicitement à Agents_Traitement_Visuel.md Section 5 pour leur
     implémentation — si l'une de ces deux est la technique signature choisie, elle PEUT compter
     comme UNE des 2 techniques Traitement_Visuel du quota (Section 6bis).
   - Mais le 2e technique Traitement_Visuel du quota reste OBLIGATOIREMENT distincte — jamais le
     même effet unique recyclé pour épuiser les 2 places du quota Traitement_Visuel.
   - Si la technique signature choisie est une AUTRE que n°8/n°9 (scrollytelling, tilt 3D, split
     text, etc.) → aucun lien avec Traitement_Visuel, les 2 techniques du quota 6bis doivent être
     trouvées entièrement à part.

RÈGLES :
✅ Peut être une variante adaptée d'une entrée du catalogue (règle de non-figement, Direction_Artistique
   4.4bis) : nommée "variante de n°X", justifiée par le sujet réel, fiche soumise à l'utilisateur pour ajout au
   catalogue — remplit le plancher au même titre qu'une entrée telle quelle.
✅ Choisie et verrouillée à l'Étape 3 du workflow (ADN visuel), en même temps que palette/typo —
   jamais ajoutée après coup sur un composant isolé sans lien avec le reste.
✅ Appliquée de façon COHÉRENTE sur tout le périmètre de la refonte (toutes les pages en mode
   PROJET ENTIER, ou toute la page + ses composants partagés en mode PAGE CIBLÉE) — pas une
   technique différente par page.
✅ Confrontée aux 3 looks génériques IA proscrits (Direction_Artistique Section 3) avant d'être
   verrouillée.
✅ Consignée dans la fiche de décisions verrouillées (Section 12) dès qu'elle est choisie, pour
   rester identique sur toutes les sessions suivantes de la même refonte.
```

---

## 3ter. MODE B DE DIRECTION_ARTISTIQUE — SUSPENDU SOUS REFONTE

```
Conflit résolu explicitement : Agents_Direction_Artistique.md Section 2ter (MODE B — projet
existant) impose que toute nouvelle page dérive du système visuel déjà en place et interdit de
réinventer un système parallèle. Une refonte complète vise l'inverse : sortir du système existant
(contrainte n°1 et test de non-reconnaissance, Section 5bis).

RÈGLE : sous Agents_Refonte_Complete, la clause de dérivation du Mode B est SUSPENDUE pour tout ce
qui relève du périmètre de la refonte. Le test de non-reconnaissance (Section 5bis) prévaut.
✅ Seule exception : une dimension explicitement figée par l'utilisateur (Section 2, champ 3 :
   « garde la palette » / « garde la typographie ») — celle-là reste dérivée de l'existant.
✅ Le nouveau système est dérivé de l'ADN visuel verrouillé à l'Étape 3 du workflow (Section 6),
   pas du système d'origine.
✅ Sans refonte demandée (ajustement ponctuel, page ajoutée hors périmètre), le Mode B s'applique
   normalement.
```

---

## 4. SCAN DE L'EXISTANT — OBLIGATOIRE AVANT GÉNÉRATION

```
Étape 1 — Lire le code actuel en entier (dossiers, composants, styles, dépendances).
Étape 2 — Extraire le contenu RÉEL existant (textes, tarifs, programmes, données) — c'est ce
          contenu qui sera réutilisé, jamais remplacé par du contenu inventé (Section 5ter).
Étape 3 — Identifier la logique fonctionnelle de chaque composant (Section 6quinquies) avant
          de le redessiner : que fait-il, avec quoi doit-il rester connecté.
Étape 4 — Identifier palette/typo actuelles si conservation demandée.
Étape 5 — Si /references/ existent -> consulter tout le dossier (pas de silo par domaine).
Étape 6 — Repérer les composants tiers sensibles (FedaPay, auth) — habillage seul refondu.
```

---

## 5. PÉRIMÈTRE — CE QUI CHANGE, CE QUI RESTE

```
CHANGE (défaut, toutes pages du périmètre choisi) :
   - Structure de page (agencement, hiérarchie, disposition des blocs) — Section 5bis
   - Palette + typo, SAUF conservation explicite d'une des deux
   - Composants UI (layout, découpage, regroupement)
   - Comportement d'interface (Standards_Interface_Web)
   - Assets visuels (min. 2 techniques Traitement_Visuel, Section 6bis)

NE CHANGE JAMAIS (sauf demande explicite confirmée) :
   - Panel admin/back-office (Section 2 pt.4)
   - Logique métier, schéma DB, contrats API, calculs (commissions, prix)
   - Câblage FedaPay (seul son habillage visuel change)
   - Contenu réel (textes/données) — réutilisé, jamais halluciné (Section 5ter)
```

## 5bis. TEST DE NON-RECONNAISSANCE — CRITÈRE DE RÉUSSITE OBLIGATOIRE

```
Avant de livrer un lot, se poser la question : "si je mets l'ancienne et la nouvelle version
côte à côte, est-ce que je reconnais la même architecture de page (même ordre de blocs, même
découpage de sections, même emplacement relatif des éléments) ?"

-> Si OUI (même avec une nouvelle couleur/police) = ÉCHEC. Recommencer la structure, pas
  seulement le skin.
-> Le contenu textuel peut rester identique (Section 5ter) — c'est la STRUCTURE qui doit être
  méconnaissable : nouvel agencement, nouvelle hiérarchie visuelle, nouveau découpage de blocs.

C'est le point précis qui a échoué sur les itérations précédentes (palette changée, structure
identique) — ce test existe pour empêcher la répétition de cette erreur.
```

## 5ter. ZÉRO MOCK DATA

```
Ne jamais inventer un nom de client, un chiffre, une statistique, un tarif qui n'existe pas
   déjà dans le projet scanné (Section 4, étape 2).
Réutiliser le contenu réel existant, même reformulé/redisposé dans une nouvelle structure.
Si un nouveau composant a besoin d'une donnée absente du projet -> le signaler et demander,
   jamais improviser une valeur plausible à sa place.
```

---

## 6. WORKFLOW SÉQUENTIEL OBLIGATOIRE

```
Étape 1 — Scan de l'existant (Section 4).
Étape 2 — Confirmation du périmètre (Section 2) — si ambigu, question posée, pas de suite.
Étape 3 — ADN visuel : Direction_Artistique + verrouillage de la technique signature (Section 3bis).
          NE PAS passer à l'Étape 4 tant que ce plan (ADN + technique signature) n'a pas reçu un
          retour explicite de l'utilisateur ("ça te va" ou équivalent) — même exigence que
          Agents_Direction_Artistique.md Règle absolue 9 : un plan auto-jugé cohérent par l'agent
          seul reste "proposé", jamais "verrouillé".
Étape 4 — Palette + typo (sauf conservation demandée) : Palettes + Typographies.
Étape 5 — Design_Reference si applicable, principes injectés jamais copiés littéralement.
Étape 6 — Découpage en LOTS (Section 7) — jamais tout le périmètre d'un coup.
Étape 7 — Pour CHAQUE lot :
          a) Nouvelle structure de page conçue AVANT le style (Section 5bis validée en amont)
          b) Génération du code du lot
          c) Standards_Interface_Web — comportement + layout (Section 6quater)
          d) Traitement_Visuel — application des techniques prévues (Section 6bis)
          e) Motion Engineering — si une chorégraphie 2D/DOM/SVG/Canvas 2D validée doit être implémentée ; pas de scène 3D.
          f) Animation 3D — si une scène volumétrique WebGL/WebGPU a été validée ; cet agent en possède toute l'implémentation.
          g) Revue_Code — auto-revue avant présentation
          h) Commentaire_Code — documentation
          i) Vérif responsive desktop + mobile (Section 6ter) — jamais l'un sans l'autre
          j) Visual Design QA — comparaison du rendu réel aux critères/références, avec captures si les outils sont disponibles ; sinon audit marqué PARTIEL/NON VÉRIFIÉ
          k) Présentation du lot — rapport court (Section 8) — attente de validation
Étape 8 — Régression détectée -> Debug_Correction, cause racine.
Étape 9 — Rapport final court (Section 8).
```

## 6bis. TRAITEMENT VISUEL — MINIMUM 2 TECHNIQUES OBLIGATOIRES

```
Avant de livrer la refonte (projet entier ou page ciblée), au moins 2 techniques
d'Agents_Traitement_Visuel.md doivent être réellement implémentées et visibles — jamais
"disponible si besoin". Choix dérivé du sujet réel du projet (jamais un effet par réflexe,
même règle anti-générique que le fichier source, Section 6 de ce même fichier source).
```

## 6ter. RESPONSIVE — OBLIGATOIRE, PAS UNE OPTION

```
Chaque lot livré = vérifié desktop ET mobile avant d'être présenté comme terminé.
Un lot validé uniquement en desktop n'est PAS un lot terminé — retour en correction.
Couverture réelle (Agents_Standards_Interface_Web.md Section 3) : mobile, laptop, au minimum —
zéro élément qui déborde, zéro texte tronqué, zéro superposition qui apparaît uniquement à une
largeur d'écran précise.

Vérification EN HAUTEUR obligatoire, pas seulement en largeur : un titre hero surdimensionné qui
chevauche/pousse la section suivante (footer, bloc voisin) est un défaut de responsive au même
titre qu'un débordement horizontal — tester le rendu à hauteur de viewport réelle, pas seulement
scrollé jusqu'en bas pour "voir que ça rentre quelque part".
```

## 6quater. AUCUNE SUPERPOSITION ANARCHIQUE — POSITIONNEMENT LOGIQUE OBLIGATOIRE

```
Avant de considérer un composant terminé, vérifier :
- Aucun texte posé sur une image/fond sans contraste garanti (superpositions illisibles —
  texte noyé dans une image ou un fond qui l'avale).
- Aucun bloc à opacité partielle qui rend son contenu illisible sur le fond réel derrière.
- Chaque composant a une relation de voisinage justifiée avec les composants autour de lui —
  jamais un élément qui flotte sans lien logique avec ce qu'il y a au-dessus/en dessous.
- Grille de positionnement (Agents_Design_Reference.md Section 5bis, réutilisée ici en
  construction) pour tout élément qui pourrait sinon être placé "à peu près".
```

## 6quinquies. LOGIQUE FONCTIONNELLE DES COMPOSANTS

```
Avant de redessiner un composant, identifier : à quoi sert-il, avec quoi doit-il rester
connecté (ex: un formulaire de connexion a besoin de email+mdp+soumission+lien inscription,
un dashboard a besoin de ses vraies données liées, pas d'un bloc décoratif vide). La nouvelle
structure ne casse jamais un lien logique existant entre 2 composants sans le recréer ailleurs
de façon au moins aussi claire.
```

## 6sexies. NON-RÉGRESSION FONCTIONNELLE — OBLIGATOIRE PAR LOT

```
Changer la structure/le style ne doit jamais casser ce qui marchait (onClick, soumission de
formulaire, navigation, binding de state/props) même si le backend n'est pas touché — une
restructuration de composants React peut rompre un câblage sans toucher une seule ligne d'API.
Avant de présenter un lot comme terminé : vérifier que chaque action interactive du lot
(bouton, lien, formulaire) déclenche toujours le comportement attendu.
```

## 6septies. ÉLÉMENTS RÉELS NON STYLISABLES

```
Logos partenaires, badges d'accréditation, éléments de marque tiers réels (ex: badge Canal+
pour Delta Leader's) — jamais recolorés, jamais remplacés par un asset généré, jamais intégrés
dans un effet Traitement_Visuel. Catégorie distincte du contenu réutilisable (5ter) : ici on ne
touche même pas à la présentation, juste à l'espace qui l'entoure.
```

## 6octies. PERFORMANCE MOBILE BAS DE GAMME — OBLIGATOIRE

```
Toute technique Traitement_Visuel appliquée (Section 6bis) passe par la checklist perf de ce
fichier source (Section 8 : profiler sur mobile bas de gamme avant livraison) — pas optionnel
dans une refonte, contexte réel du projet (Bénin, latence, devices d'entrée de gamme).
```

## 6nonies. ACCESSIBILITÉ — RE-VÉRIFIÉE PAR LOT

```
Une restructuration complète casse le plus souvent contraste, focus visible et navigation
clavier — Standards_Interface_Web les couvre déjà, mais chaque lot doit explicitement repasser
par cette checklist après le changement de structure, pas seulement au style d'origine.
```

## 6decies. FILET DE SÉCURITÉ

```
Avant de lancer un lot : recommander une branche/commit séparé si le projet est sous Git.
Si un lot casse une fonctionnalité de façon non récupérable en cours de session -> Debug_Correction
d'abord ; si le fix n'est pas trouvable rapidement, proposer explicitement le retour à l'état
du commit précédent plutôt que d'empiler des correctifs sur une base cassée.
```

## 6undecies. AUCUN ÉTAT CASSÉ OU INVISIBLE LIVRÉ

```
Constat direct (dashboard admin MonProgrammeFit) : cartes stats en fond quasi-transparent qui
se fondent dans le fond de page, avatar vide sans image ni état par défaut stylé, boutons au
texte à peine visible, bloc "Performance" dont le contenu est plus clair que son propre fond —
un état qui donne l'illusion d'un bug de chargement resté figé, pas un design fini.

Avant de présenter un composant comme terminé, vérifier :
- Contraste réel mesuré entre le texte/l'icône et SON fond direct (pas le fond de la page) —
  jamais un texte "à peu près visible à l'œil" sur l'aperçu du moment.
- Aucun bloc de données (stat, carte, montant) livré sans son contenu réellement rendu — pas de
  conteneur vide qui ressemble à un skeleton loader resté bloqué.
- Aucun emplacement image sans un vrai visuel assigné (photo réelle, ou technique
  Traitement_Visuel délibérée) — jamais une case blanche/vide non stylée à la place d'un visuel
  manquant (si l'asset n'existe pas : le signaler et proposer un prompt de génération,
  Agents_Traitement_Visuel.md Section 1bis, jamais laisser un trou).
```

## 6duodecies. UN SEUL ÉTAT COHÉRENT PAR PAGE — JAMAIS DE PASS PARTIEL

```
Constat direct (page Programmes MonProgrammeFit) : fond resté sombre/ancien pendant que les
cartes passaient au vert, accents restés orange par endroits — un mélange ancien/nouveau
visible sur la même page, preuve d'un pass appliqué à moitié.

Une page présentée comme terminée est TOUJOURS 100% cohérente : même palette partout sur cette
page, même typo partout, aucun élément resté dans l'ancien système pendant qu'un autre a changé.
Si un lot ne peut pas couvrir toute la page en une fois -> le dire explicitement et ne PAS
présenter la page comme "faite", plutôt que de livrer un état hybride qui semble fini.
```

---

## 7. DÉCOUPAGE EN LOTS

```
Découper par lot logique (ex: "Header + nav", "Page d'accueil", "Dashboard"). Un lot = un
ensemble qui se valide ensemble. Validation utilisateur avant le lot suivant, jamais
d'enchaînement automatique sans retour.
```

---

## 8. RAPPORT DE FIN DE LOT — FORMAT COURT, VERROUILLÉ (5-8 LIGNES MAX)

```markdown
**Lot :** [nom]
**Changé :** [1-2 lignes, grandes lignes seulement]
**Non touché (et pourquoi) :** [1 ligne]
**Techniques Traitement_Visuel utilisées :** [noms]
**Responsive vérifié :** desktop + mobile
**Prochain lot :** [nom]
```
Jamais de section par section détaillée, jamais de tableau avant/après élément par élément —
grandes lignes uniquement, comme demandé.

---

## 9. RÈGLES ANTI-DÉRIVE

```
Ne jamais garder la même structure/architecture de page qu'avant sous prétexte que le
   contenu ou le style a changé (Section 5bis — critère de réussite, pas une suggestion).
Ne jamais changer la stack technique sans demande explicite.
Ne jamais toucher à un calcul métier, au câblage FedaPay, au panel admin sans mention explicite.
Ne jamais inventer de mock data (Section 5ter).
Ne jamais livrer un lot non vérifié en mobile ET desktop (Section 6ter).
Ne jamais laisser un élément visuel se superposer illisiblement à un autre (Section 6quater).
```

---

## 10. LIEN AVEC LES AUTRES FICHIERS

```
Direction_Artistique (ADN) -> Palettes + Typographies (sauf conservation) -> Design_Reference
(si applicable) -> Standards_Interface_Web (critères de qualité avant implémentation) ->
génération par lots avec structure repensée AVANT le style -> Traitement_Visuel (2+ techniques)
par lot -> Motion Engineering / Animation 3D si leurs périmètres sont validés -> Revue_Code +
Commentaire_Code -> Responsive -> Visual Design QA indépendant -> Debug_Correction si régression
-> recontrôle visuel -> rapport court par lot.
```

---

## 12. CONTINUITÉ INTER-LOTS ET INTER-SESSIONS — FICHE DE DÉCISIONS VERROUILLÉES

```
Une refonte "projet entier" s'étale presque toujours sur plusieurs sessions séparées (le
contexte d'une conversation ne suffit pas). Une nouvelle session n'a AUCUNE mémoire des choix
faits dans la précédente sauf ce qui est écrit dans un fichier.

Étape 4bis (juste après ADN visuel + palette + typo, Étape 3-4 du workflow) — générer un court
fichier `Refonte_[nom_projet]_Decisions.md` à la racine, contenant UNIQUEMENT :
- ADN visuel retenu (1-2 lignes)
- Palette exacte choisie (nom + HEX)
- Pairing typo exact choisi
- Technique signature retenue (Section 3bis) + où elle apparaît sur le projet
- Les 2+ techniques Traitement_Visuel retenues
- Liste des lots déjà livrés + statut (fait / en cours / à faire)

Toute nouvelle session de refonte sur ce même projet COMMENCE par lire ce fichier avant de
proposer quoi que ce soit — jamais reproposer un nouvel ADN/palette différent de celui déjà
verrouillé, sauf si l'utilisateur demande explicitement à le changer.
```

---

## 13. GATE DE LIVRAISON — VÉRIFICATION INTERNE OBLIGATOIRE AVANT CHAQUE RAPPORT DE LOT

```
Ceci est une vérification INTERNE, distincte du rapport client (Section 8, verrouillé 5-8 lignes,
point 10 des contraintes non-négociables — CE format ne change pas). Le gate ci-dessous se fait
AVANT d'écrire le rapport court : chaque ligne du rapport ("Responsive vérifié", "Techniques
utilisées"...) ne peut être écrite QUE si la case correspondante ici a été prouvée, pas supposée.

Une case cochée SANS preuve citée (dans le raisonnement, pas nécessairement montrée à l'utilisateur) n'est
PAS cochée. Si une seule case échoue, le lot n'est PAS présenté comme terminé dans le rapport
court, même si le rapport court "a l'air" correct.

□ Mode confirmé : PROJET ENTIER ou PAGE CIBLÉE
  Preuve : citer la confirmation exacte de l'utilisateur.
□ Palette/typo : les deux changent, ou l'une conservée explicitement — tranché
  Preuve : citer la décision.
□ Admin exclu par défaut, sauf mention explicite
  Preuve : confirmer présence/absence de mention.
□ Contenu réel extrait — aucune mock data prévue
  Preuve : citer une donnée réelle réutilisée dans ce lot précis.
□ Éléments réels non stylisables identifiés (logos, badges tiers) et exclus du style
  Preuve : les lister, ou confirmer qu'aucun n'est présent dans ce lot.
□ Structure de page repensée AVANT le style, testée contre le critère de non-reconnaissance (5bis)
  Preuve : décrire concrètement ce qui a changé dans l'architecture (ordre de blocs, découpage) —
  pas juste "structure changée".
□ Minimum 2 techniques Traitement_Visuel identifiées avant de commencer
  Preuve : les nommer + où elles sont appliquées dans ce lot.
□ Technique signature (Section 3bis — entrée du catalogue ou variante adaptée nommée) verrouillée avec l'ADN visuel ET validée par retour explicite
  de l'utilisateur (Étape 3, Section 6) — recoupe le quota Traitement_Visuel seulement si n°8/n°9, sinon
  entièrement distincte ; consignée dans la fiche de décisions, cohérente sur tout le périmètre
  Preuve : citer où elle apparaît dans ce lot précis.
□ Fiche de décisions verrouillées (Section 12) créée/mise à jour ET LUE en tout premier si session
  ≠ première session
  Preuve : citer ce qui a été lu dans le fichier, ou confirmer qu'il vient d'être créé.
□ Ce lot vérifié desktop + mobile avant présentation
  Preuve : décrire un point de vérification concret (ex : élément qui aurait débordé et a été
  corrigé), pas juste "vérifié".
□ Contrôle visuel indépendant effectué avec AGENT_VISUAL_DESIGN_QA lorsque le rendu et les outils de capture sont disponibles
  Preuve : routes, viewports, états et captures utilisés ; constats résolus ou transmis. Si capture impossible, inscrire PARTIEL/NON VÉRIFIÉ et ne pas déclarer la fidélité visuelle confirmée.
  Tout constat BLOQUANT VISUEL ou MAJEUR doit être corrigé par l'agent propriétaire puis recontrôlé avant de clôturer le lot.
□ Ce lot re-vérifié en accessibilité après restructuration (6nonies)
  Preuve : citer le point de contraste/focus/clavier concrètement vérifié.
□ Ce lot testé en non-régression fonctionnelle (clics, formulaires, navigation)
  Preuve : citer l'action interactive testée et son résultat.
□ Perf mobile bas de gamme vérifiée si techniques Traitement_Visuel coûteuses (SVG/WebGL)
  Preuve : confirmer applicabilité et résultat, ou "non applicable" explicite.
□ Aucune superposition illisible, positionnement logique vérifié par composant
  Preuve : citer un cas de superposition potentielle vérifié.
□ Contraste réel vérifié sur chaque bloc/bouton/stat — aucun élément translucide illisible
  Preuve : citer un composant précis et son contraste.
□ Aucun emplacement image vide/non stylé — vrai visuel ou prompt de génération proposé
  Preuve : lister les visuels de ce lot et leur statut (réel/prompt proposé).
□ Débordement hauteur ET largeur testé — aucun titre qui chevauche la section suivante
  Preuve : confirmer le test effectué, hauteur ET largeur.
□ Page validée à 100% cohérente (une seule palette/typo visible dessus) avant d'être livrée
  comme terminée — jamais un mélange ancien/nouveau présenté comme fini
  Preuve : confirmer explicitement l'absence de mélange, ou signaler le lot comme partiel
  (Section 6duodecies) plutôt que de mentir sur son statut.
□ Branche/commit séparé recommandé avant de lancer le lot si projet sous Git
  Preuve : citer la recommandation faite, ou confirmer absence de Git.

SI UNE SEULE LIGNE NE PEUT PAS ÊTRE PROUVÉE : ne pas écrire le rapport court comme si le lot était
terminé. Dire explicitement ce qui échoue, corriger ou signaler le lot comme partiel
(Section 6duodecies), puis repasser le gate avant de présenter quoi que ce soit à l'utilisateur.
```

---

*Ce document régit le comportement de l'orchestrateur de refonte visuelle pour toute session future.*
*Resserré (contradiction non-résolue transformée en arrêt dur, validation du plan visuel alignée
sur Agents_Direction_Artistique.md Règle absolue 9, checklist finale dissociée du rapport client
et transformée en gate bloquant avec preuve requise) : août 2026. Version précédente : non datée.*
