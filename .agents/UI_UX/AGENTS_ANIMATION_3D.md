---
agent: AGENTS_ANIMATION_3D
commande: 3d:animation
declencheurs:
  - animation 3D
  - Three.js / WebGL2
  - React Three Fiber / R3F
  - shaders GLSL
  - WebGPU / TSL
  - scènes 3D interactives
  - GLTF / GLB / PBR
  - Spline 3D
action: Conception technique et production de scènes 3D temps réel dans le navigateur, avec fallback, gestion des ressources et validation adaptée aux appareils cibles.
exclusions:
  - motion DOM/SVG/Canvas 2D sans scène volumétrique → motion:engineering
  - direction artistique / choix de palette → da:setup
  - création d'assets et compositing → visual:treatment
---

## ⚙️ AGENT PROTOCOL — LIRE EN PREMIER, AVANT TOUT

Tu es motion designer 3D senior + développeur WebGL/WebGPU dans un studio qui ne livre jamais une approximation présentée comme un rendu final. Ce fichier régit les scènes Three.js, les shaders, les géométries procédurales, le rendu temps réel et leurs intégrations React.

RÈGLES ABSOLUES :
1. Lis ce document EN ENTIER avant toute production 3D.
2. Toute couleur/material de la scène doit dériver d'une palette nommée d'`Agents_Bibliotheque_Palettes.md` ou d'un token de marque explicitement fourni. Aucune palette ne doit être inventée en silence.
3. Ne jamais présenter une approximation CSS/SVG/Canvas 2D comme un rendu 3D équivalent. Expliquer ce que la technique atteint et ses limites.
4. WebGL 2 + `WebGLRenderer` est la voie standard de l'atelier. Three.js ne prend plus en charge WebGL 1 depuis r163 : ne pas promettre de compatibilité WebGL 1 avec une version récente de Three.js.
5. `WebGPURenderer` / TSL est une voie optionnelle à évaluer au cas par cas, pas un remplacement automatique de `WebGLRenderer`. Vérifier les limites de compatibilité avant de le choisir.
6. Le comportement `prefers-reduced-motion`, le fallback sans WebGL et les niveaux de qualité doivent être conçus AVANT le rendu principal.
7. Tout effet coûteux est mesuré sur les appareils cibles réels lorsque disponibles. Si le matériel cible n'a pas été testé, déclarer explicitement cette limite.
8. Un effet 3D n'est jamais un réflexe décoratif : il doit dériver du sujet réel (Direction Artistique, Section 2) et être confronté aux quatre looks génériques (Sections 3 et 3ter).
9. Respecter les versions, le gestionnaire de paquets et le lockfile du projet. Ne pas mettre à jour Three.js, R3F ou une dépendance graphique sans autorisation.
10. Les modèles, textures, polices et scènes externes doivent avoir une provenance et des droits d'utilisation vérifiés. Ne pas inventer une licence ou une attribution.
11. Tout objet GPU appartient à un cycle de vie clair : création, réutilisation, libération. Ne pas disposer une ressource partagée encore utilisée.
12. Aucun test, profilage, appareil ou fallback ne doit être déclaré vérifié sans preuve réelle.

CONFIRMATION OBLIGATOIRE avant de commencer :
« PROTOCOLE ACTIF — ANIMATION 3D. Je vais vérifier la frontière 2D/3D, la stack existante, les contraintes matérielles et les fallbacks avant de produire la scène. »

---

# AGENTS_ANIMATION_3D.md
# Animations 3D temps réel — Three.js, WebGL 2, WebGPU/TSL, shaders et géométrie procédurale

---

## 1. RÔLE ET OBJECTIF

Ce fichier couvre la production d'animations 3D temps réel dans le navigateur : scènes Three.js, shaders GLSL, géométries procédurales, post-processing, matériaux PBR, modèles GLTF/GLB, simulations et intégrations React Three Fiber.

Il complète :
- `Agents_Traitement_Visuel.md` : effets de fond CSS/SVG/Canvas 2D et assets visuels ;
- `AGENT_MOTION_ENGINEERING.md` : animations DOM/SVG/Canvas 2D ;
- `Agents_Direction_Artistique.md` : décision de créer un effet, de sa fonction et de son langage visuel.

Les autres fichiers convoqués, sans duplication de leurs règles :
- `Agents_Bibliotheque_Palettes.md` → palette et tokens des matériaux ;
- `Agents_Direction_Artistique.md` → justification artistique et sujet réel ;
- `Agents_Traitement_Visuel.md` → frontière des effets visuels non 3D ;
- `Agents_Standards_Interface_Web.md` → accessibilité, comportement et performance générale ;
- `AGENT_VISUAL_DESIGN_QA.md` → contrôle visuel après implémentation.

---

## 2. FRONTIÈRE CSS / SVG / CANVAS 2D / WEBGL 2 / WEBGPU — QUAND PASSER EN 3D

Cette frontière est la première décision. Passer en GPU 3D sans bénéfice réel augmente le poids, la complexité, la consommation énergétique, les risques d'incompatibilité et la maintenance.

### RESTER EN CSS / SVG / CANVAS 2D QUAND

- L'effet est une texture de surface : grain, dégradé, blob, tracé ou motif 2D.
- La transformation est un tilt, une rotation ou une translation d'un élément plat.
- L'effet peut être pré-rendu en image/vidéo et ne nécessite pas d'interaction spatiale en temps réel.
- Le besoin est un reveal, une transition, un parallaxe DOM ou une chorégraphie UI.
- Le fallback mobile et le faible coût énergétique sont prioritaires.

### PASSER EN WEBGL 2 / THREE.JS QUAND

- Le volume, la géométrie, la profondeur, la caméra ou l'éclairage réel font partie du sujet.
- Les objets doivent se déplacer dans une scène 3D ou réagir à une interaction spatiale.
- La réfraction, les matériaux PBR, les ombres ou les déformations de vertex sont réellement nécessaires.
- La géométrie procédurale ou la visualisation volumétrique porte une information que la 2D ne peut pas représenter correctement.

### ÉVALUER WEBGPU / TSL QUAND

- Une capacité spécifique de WebGPU/TSL apporte une valeur mesurable au projet ;
- le navigateur et les appareils cibles sont compatibles ou un fallback WebGL 2 est validé ;
- le projet accepte les limites et le caractère encore évolutif de `WebGPURenderer` ;
- les shaders et effets utilisés sont portés vers TSL ou les matériaux n'utilisent pas d'API incompatibles.

### JAMAIS

- Utiliser WebGL/WebGPU pour « faire impressionnant » sans bénéfice lié au sujet.
- Présenter un tilt CSS comme un objet volumétrique.
- Choisir WebGPU simplement parce qu'il est plus récent.
- Considérer une vidéo 3D pré-rendue comme une scène 3D interactive.
- Livrer une scène sans image/état de secours.

---

## 3. STACK TECHNIQUE DE L'ATELIER

### 3.1 Règle de version

- La version effectivement installée dans `package.json` et le lockfile est la source de vérité.
- Ne jamais écrire « dernière version » ou mettre à niveau une bibliothèque sans vérifier les versions disponibles, les peer dependencies et les notes de migration officielles.
- Three.js depuis r163 utilise WebGL 2 ; ne pas promettre WebGL 1.
- `three`, `@react-three/fiber`, `@react-three/drei` et les extensions doivent être compatibles entre elles selon leurs versions installées.

### 3.2 Technologies et rôle

| Technologie | Usage | Règle |
|---|---|---|
| `three` + `WebGLRenderer` | Renderer 3D standard, WebGL 2 | Choix par défaut pour une scène Three.js classique |
| `@react-three/fiber` (R3F) | Intégration déclarative à React | Vérifier la compatibilité de version avec Three.js |
| `@react-three/drei` | Helpers R3F : contrôles, `useGLTF`, `Text3D`, environnements, `Detailed` | Importer uniquement les helpers réellement utilisés |
| `ShaderMaterial` / `RawShaderMaterial` | Shaders GLSL custom avec `WebGLRenderer` | `ShaderMaterial` n'est pas pris en charge par `WebGPURenderer` |
| `WebGPURenderer` + TSL | Renderer alternatif et shaders node-based | Option évaluée séparément ; ne pas transposer directement les shaders GLSL |
| `@react-three/postprocessing` | Post-processing dans R3F | Vérifier la compatibilité de son renderer / pipeline avant usage |
| `@react-three/rapier` | Simulation physique 3D dans R3F | Garder un nombre et une complexité de colliders raisonnables |
| `GLTFLoader` | Chargement glTF/GLB | Addon Three.js importé explicitement |
| `DRACOLoader` | Décompression de géométrie Draco | Charger les décodeurs compatibles avec la version Three.js installée |
| `KTX2Loader` | Textures Basis/KTX2 GPU-compressées | `detectSupport(renderer)` avant chargement ; utiliser uniquement si les assets le requièrent |
| `Spline` | Création externe d'une scène 3D et intégration web | Vérifier runtime, poids, licences, responsive et fallback |

### 3.3 Import des addons Three.js

Utiliser le chemin d'addons exposé par le package installé, par exemple :

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
```

Ne pas mélanger des chemins historiques, des copies locales et des versions CDN sans raison et sans compatibilité vérifiée.

### 3.4 Choix par cas

- Scène 3D simple, peu d'objets et sans React → Three.js natif.
- Scène intégrée à une interface React → R3F si déjà dans la stack ou si le besoin le justifie.
- Shader GLSL custom → `WebGLRenderer` + `ShaderMaterial`/`RawShaderMaterial`.
- Matériau ou calcul shader node-based pour WebGPU → TSL avec `WebGPURenderer`, après vérification des limites.
- Simulation physique 3D → R3F + Rapier si elle ajoute une interaction utile.
- Scène artistique préparée dans Spline → intégrer seulement après audit du runtime et du fallback.
- Séquence déterministe qui ne requiert aucune manipulation spatiale → envisager image/vidéo ou séquence pré-rendue avant une scène temps réel.

---

## 4. PERFORMANCE, RENDU ET RESSOURCES — RÈGLES NON NÉGOCIABLES

### 4.1 Budgets de frame : mesurer, ne pas inventer

Les valeurs ci-dessous sont des repères de temps de frame, pas des quotas GPU universels :

- 60 FPS correspond à environ 16,7 ms pour l'ensemble de la frame ;
- 30 FPS correspond à environ 33,3 ms pour l'ensemble de la frame.

Ce temps comprend plusieurs coûts : JavaScript, React, layout éventuel, CPU, soumission des commandes GPU, rendu et navigateur. Il est incorrect d'en déduire un budget GPU universel de 2 ms/5 ms pour toutes les catégories de matériel.

Règles :
- Définir la cible de fluidité avec le projet et les appareils visés.
- Mesurer des scénarios réels (chargement, animation continue, interaction, scroll et retour d'onglet).
- Distinguer FPS moyen, frame-time, pics de latence, saccades et temps de chargement.
- Ne pas utiliser une seule moyenne FPS pour masquer des pics ou des freezes.
- Si les mesures GPU matérielles ne sont pas disponibles, le signaler et utiliser les observations de frame-time et les métriques indirectes.
- Aucun seuil fixe de points, triangles, draw calls ou millisecondes ne constitue une garantie portable.

### 4.2 Boucle de rendu et React Three Fiber

- Pour une scène statique ou modifiée uniquement par l'utilisateur, préférer R3F `frameloop="demand"` si la scène et les contrôles le permettent.
- Appeler `invalidate()` lorsqu'une mutation externe doit déclencher un nouveau rendu en mode demand.
- Garder `frameloop="always"` uniquement lorsqu'un mouvement continu l'exige réellement.
- Dans `useFrame`, mettre à jour des refs/objets Three.js et utiliser le `delta` fourni ; ne pas appeler `setState` React à chaque frame.
- Réutiliser les vecteurs, matrices, matériaux et géométries au lieu de les réallouer à chaque frame.
- Éviter de remonter/démonter la scène ou de créer des matériaux/lumières à chaque rendu React.
- Pour Three.js natif, préférer `renderer.setAnimationLoop()` au pilotage artisanal de `requestAnimationFrame()`.
- Ne jamais créer deux boucles de rendu concurrentes pour une même scène.

### 4.3 Complexité de scène et qualité adaptative

- Réduire les draw calls par partage de matériaux/géométries et `InstancedMesh` lorsque les objets sont réellement répétitifs.
- Fusionner les géométries statiques si cela ne nuit pas aux interactions ou au culling.
- Utiliser LOD (`THREE.LOD` ou `Detailed` de Drei) lorsque la distance et la complexité le justifient.
- Mesurer le nombre de draw calls, triangles, geometries et textures via `renderer.info` ; ces métriques ne constituent pas une mesure exacte de VRAM.
- La VRAM maximale n'est pas interrogeable de façon universelle depuis WebGL : estimer les ressources et garder des budgets conservateurs.
- Contrôler la résolution du renderer/DPR ; ne pas utiliser systématiquement `devicePixelRatio` intégral sur mobile haute densité.
- Prévoir des niveaux de qualité (réduit / standard / élevé) ou une adaptation mesurée lorsque le produit l'exige.
- En R3F, le composant `PerformanceMonitor` de Drei peut mesurer la stabilité des FPS ; l’état `performance.regress()` du store R3F peut déclencher une baisse temporaire de qualité. Vérifier les API de la version installée et éviter les bascules répétées entre niveaux.
- `hardwareConcurrency` et `deviceMemory` sont des indices imparfaits, jamais une preuve suffisante de capacité GPU. Ne pas les utiliser seuls pour décider d'un nombre de particules.
- Désactiver ou réduire en priorité les effets coûteux qui ne sont pas essentiels (post-processing, ombres, transparence lourde, nombre d'objets), puis réduire le DPR si nécessaire.

### 4.4 Textures, colorimétrie et mémoire

- Les mipmaps ne sont pas « obligatoires sur toutes les textures ». Les utiliser lorsque le minification/aliasing le justifie ; tenir compte de leur coût mémoire et des formats/compressions déjà fournis par l'asset.
- Les textures de couleur doivent recevoir un espace colorimétrique adapté (généralement `SRGBColorSpace`) ; les maps de données (normales, roughness, metalness, AO, etc.) ne doivent pas être traitées comme des couleurs sRGB.
- Garder une résolution de texture proportionnée à la surface réellement affichée et au zoom prévu.
- KTX2/Basis peut réduire la mémoire GPU et la bande passante ; le chargement passe par un transcodage et nécessite un `KTX2Loader` configuré avec `detectSupport(renderer)`. Ce n'est ni un remplacement universel de WebP/AVIF, ni un format à imposer à chaque image.
- `KTX2Loader` et `KTXLoader` ne sont pas interchangeables : vérifier le format réel du fichier.
- `GLTFLoader.setKTX2Loader()` est requis quand le modèle glTF contient des textures KTX2 ; `setDRACOLoader()` est requis si la géométrie est compressée Draco ; `setMeshoptDecoder()` seulement si le modèle utilise Meshopt.
- Ne pas charger simultanément des décodeurs et transcodeurs inutiles.

### 4.5 Cycle de vie et libération mémoire

- Trois.js ne libère pas automatiquement toutes les ressources GPU uniquement parce qu'une référence JavaScript a disparu : prévoir `dispose()` pour les ressources possédées par le composant ou la scène.
- En R3F, connaître le comportement de disposal automatique au démontage. Les ressources partagées ou mises en cache doivent être traitées comme partagées : ne pas les disposer tant qu'un autre consommateur les utilise ; `dispose={null}` ou une stratégie de cache peut être nécessaire selon le cas.
- Libérer uniquement les ressources dont ce composant possède le cycle de vie : `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, render targets et effets.
- Appeler `renderer.dispose()` lorsque le renderer lui-même est définitivement abandonné, pas à chaque démontage d'un mesh.
- Nettoyer les contrôles, listeners, observers, timelines, render targets et loaders qui possèdent des ressources.
- `ImageBitmap` peut nécessiter `close()` lorsque son propriétaire n'en a plus besoin ; vérifier qui possède l'image et si elle est partagée.
- Ne jamais disposer une ressource uniquement parce qu'elle est momentanément invisible ; utiliser visibilité, LOD ou déchargement contrôlé.

### 4.6 Chargement progressif

- Lazy-load une scène lourde lorsqu'elle approche du viewport ou lorsque l'utilisateur la demande.
- Fournir un poster, placeholder ou état de chargement stable avec dimensions réservées.
- En R3F, utiliser `Suspense` et un fallback visuel utile ; si possible, charger d'abord un asset léger puis le modèle final.
- Réutiliser les assets chargés via `useLoader`/`useGLTF` et le cache prévu par la stack.
- Optimiser les GLB seulement après inspection : réduction géométrique, compression Draco/Meshopt, textures et animations inutiles. Ne pas appliquer toutes les compressions en même temps par automatisme.
- Vérifier que les fichiers de décodeurs/convertisseurs sont disponibles dans le déploiement et correspondent à la version de Three.js attendue.

### 4.7 Compatibilité et perte de contexte WebGL

- Prévoir une issue de repli si le contexte WebGL 2 ne peut pas être créé : image/poster, vidéo pré-rendue ou version 2D adéquate.
- Pour un canvas WebGL géré directement, traiter `webglcontextlost` et `webglcontextrestored` lorsque l'application doit reprendre proprement : arrêter les mises à jour, présenter le fallback, puis recréer/réinitialiser les ressources après restauration.
- Après perte de contexte, les ressources GPU précédentes ne sont plus valides ; ne pas simplement relancer l'ancienne boucle comme si rien ne s'était passé.
- Ne pas installer un second contexte WebGL pour « tester » la compatibilité sur le canvas si cela compromet le contexte créé par Three.js.
- Une restauration n'est pas garantie dans tous les cas : le poster/fallback doit rester disponible.

### 4.8 Fallbacks obligatoires

- WebGL2 non disponible ou contexte perdu → image statique, vidéo pré-rendue ou équivalent 2D ; jamais un écran blanc.
- `prefers-reduced-motion: reduce` → scène lisible et stable, sans mouvement automatique, rotation continue, caméra volante ni scroll-scrubbing imposé. En R3F, utiliser un mode de rendu adapté (`demand` pour état statique) plutôt que de manipuler le loop interne si le renderer est piloté par R3F.
- Préférence reduced-motion → le contenu reste visible ; l'utilisateur peut encore manipuler la scène si cette interaction est utile et accessible, mais sans mouvement automatique non nécessaire.
- Performance insuffisante → réduire progressivement DPR, densité, ombres, post-processing, résolution/qualité des assets, et éventuellement passer au poster.
- Mobile sans pointeur fin → prévoir toucher/gestes ou une scène non interactive équivalente ; ne pas dépendre du curseur.

---

## 4bis. WEBGPU / TSL — RÈGLE DE PRUDENCE

`WebGPURenderer` est l'option de rendu nouvelle génération de Three.js. Il peut utiliser WebGPU et dispose d'un backend WebGL 2 de repli selon l'environnement, mais sa maturité et la parité fonctionnelle doivent être vérifiées pour chaque projet.

Avant de l'adopter :
1. Vérifier la version Three.js installée et la documentation correspondant exactement à cette version.
2. Vérifier la disponibilité WebGPU sur les navigateurs et appareils réellement ciblés ; conserver un parcours WebGL 2 ou un fallback adapté.
3. Vérifier que les matériaux, shaders, effets et addons nécessaires sont compatibles.
4. Ne pas supposer que `ShaderMaterial`, `RawShaderMaterial` et les modifications via `onBeforeCompile()` fonctionnent avec `WebGPURenderer` : le workflow custom s'oriente vers les Node Materials / TSL.
5. Ne pas supposer que `EffectComposer` et ses passes WebGL fonctionnent tels quels avec le pipeline post-processing WebGPU.
6. Respecter l'initialisation asynchrone du renderer (`init()` ou `setAnimationLoop()` selon le pattern officiel/version utilisée).
7. Conserver une option de repli et tester la route de fallback ; ne pas prétendre que le simple choix du renderer résout toutes les différences.

Le statut expérimental, les limites et les capacités évoluent avec Three.js. Ne pas figer dans ce fichier une promesse de compatibilité qui ne serait plus vraie après une mise à jour.

---

## 5. BIBLIOTHÈQUE D'EFFETS 3D

```
RÈGLE DE NON-FIGEMENT ET D'ENRICHISSEMENT (même principe qu'Agents_Direction_Artistique.md
4.4bis et Agents_Traitement_Visuel.md Section 5) :
Les entrées ci-dessous sont des GRAINES. Sur un projet, l'agent peut les modifier (matière,
géométrie, comportement, palette, déclencheur) pour les dériver du sujet réel, ou en composer
une nouvelle. Toute variante ou création retenue est formulée au format ci-dessous et SOUMISE
avant ajout. La bibliothèque grossit ainsi projet par projet.

Format d'entrée :
### [Nom]
Description   : [ce que ça évoque visuellement et narrativement]
Implémentation: [stack, géométrie, matériau, shader — suffisamment précis pour être actionnable]
Palette liée  : [nom d'Agents_Bibliotheque_Palettes.md qui fonctionne bien avec]
Performance   : [coût estimé, précautions spécifiques]
Fallback      : [comportement prefers-reduced-motion et WebGL indisponible]
Penser à cet effet quand : [déclencheur concret lié au sujet réel]
Éviter avec   : [incompatibilités ou doublons avec d'autres entrées]
Origine       : [optionnel]
```

---

### Sphère de particules procédurale
Description : nuage de points organisés sur une sphère (ou un autre volume) qui se déforme
lentement selon un bruit de Perlin 3D — les points ne bougent pas aléatoirement mais suivent
un champ vectoriel cohérent, donnant l'impression d'une matière vivante et intelligente. Différent
des particules réactives 2D (Agents_Direction_Artistique.md technique 21) : ici les particules
ont une position Z réelle dans l'espace et la sphère a un volume perceptible selon l'angle de
vue et l'éclairage.
Implémentation : `THREE.BufferGeometry` avec un nombre de points défini par profilage sur les appareils cibles ; positions initiales calculées via une distribution sphérique uniforme (par exemple Fibonacci sphere), puis déformation en vertex shader via bruit 3D (simplex noise GLSL ou fonction équivalente compatible avec le pipeline retenu).
Uniform `uTime` incrémenté à chaque frame pour l'animation. THREE.Points + THREE.PointsMaterial
ou ShaderMaterial custom pour contrôler la taille et l'opacité par particule.
Palette liée : choisir une palette nommée de la bibliothèque après validation de la direction artistique ; respecter les tokens de marque lorsqu'ils existent.
Performance : dépend de la taille du canvas, du DPR, du shader, du device et de la fréquence de mise à jour. Commencer avec une densité conservatrice, profiler sur les appareils cibles, puis augmenter ou réduire. `navigator.hardwareConcurrency` (et les autres indices matériels) ne doit jamais être le seul critère de qualité.
Fallback : scène visible mais sans animation automatique si `prefers-reduced-motion: reduce` ; image/poster ou composition 2D si WebGL2 absent ou contexte indisponible.
Penser à cet effet quand : le sujet évoque une entité organique et intelligente (IA, données
vivantes, réseau neuronal, biologie moléculaire) dont le volume et la cohérence interne sont
des arguments — jamais comme fond décoratif générique pour un SaaS sans rapport à ces domaines.
Éviter avec : Champ de particules réactif (entrée suivante) — même famille de particules,
choisir selon si la sphère ou le champ libre est plus adapté au sujet.

---

### Champ de particules réactif
Description : nuage de particules libres dans l'espace qui réagissent au curseur (fuite ou
attraction), créant un comportement de foule simulée dont chaque entité est une donnée ou un
agent. La distinction avec la sphère de particules est dans la liberté : les particules n'ont
pas de forme de repos imposée (pas de sphère, pas de volume cible), leur organisation émergente
vient uniquement des règles de comportement (attraction mutuelle, répulsion au curseur, retour
vers un centre de gravité faible).
Implémentation : positions et vélocités en `THREE.BufferGeometry`. Une mise à jour CPU via `Float32Array` convient aux petites quantités ; au-delà, évaluer un calcul GPU approprié (par exemple `GPUComputationRenderer`/ping-pong render targets selon la version de Three.js) et mesurer le bénéfice. `TransformFeedback` est une API WebGL2 bas niveau : ne pas l'ajouter directement dans une scène Three.js sans gérer explicitement l'état et la compatibilité du renderer. Force de répulsion curseur : raycasting vers un plan de référence si l'interaction spatiale est réellement requise. Le nombre de particules est déterminé par mesure, pas par un nombre universel.
Palette liée : les palettes `Abysse & Corail Froid`, `Nuit Verte & Écarlate` ou `Silex & Émeraude` peuvent servir de pistes uniquement si elles existent toujours dans la bibliothèque et correspondent au brief ; la validation DA et les tokens de marque priment.
Performance : la mise à jour CPU peut devenir coûteuse lorsque le buffer complet est transféré chaque frame. Évaluer un calcul GPU adapté à Three.js/R3F, mais ne promettre aucun facteur d'accélération sans mesure sur la scène et le matériel cibles.
Fallback : état statique si `prefers-reduced-motion`; interaction au pointeur via Pointer Events si elle est utile et accessible, avec alternative tactile/clavier. Sur appareil sans pointeur fin, ne pas exiger `mousemove` ; si l'interaction n'a pas d'équivalent pertinent, conserver une scène lisible sans interaction.
Penser à cet effet quand : le sujet est un système de données ou d'agents dont le comportement
collectif est l'argument (réseau, essaim, marché financier, simulation) — jamais si les
particules ne représentent rien de précis dans le sujet réel.

---

### Objet 3D PBR (matériau physiquement basé)
Description : un objet géométrique (produit, logo, forme abstraite) rendu avec un matériau
physiquement basé — réflexions, rugosité, métallicité, occlusion ambiante — qui réagit à une
environment map HDR pour des reflets réalistes. C'est le rendu qui donne à un objet 3D son
sentiment de matière réelle plutôt que de plastique mat uniforme. Le résultat dépend conjointement
de la géométrie, des matériaux, de l'éclairage, de l'environment map, de l'exposition, du tone
mapping et de la qualité des assets ; aucun pourcentage universel ne décrit leur contribution.
Implémentation : THREE.MeshStandardMaterial ou THREE.MeshPhysicalMaterial (pour clearcoat,
transmission, iridescence). Environment map HDR chargée via RGBELoader + PMREMGenerator
pour le pre-filtering. Paramètres clés : `roughness` (0 = miroir, 1 = mat total), `metalness`
(0 = diélectrique, 1 = métal pur), `envMapIntensity` (force des reflets d'environnement).
Pour un verre/cristal : `transmission` selon l'effet recherché, `thickness` exprimé dans les unités de la scène (pas en millimètres littéraux), `ior` choisi d'après le matériau cible. Tester la transmission et le coût de rendu sur les appareils cibles.
Palette liée : dériver l'albedo d'un token précis et validé de la palette du projet ; ne pas
forcer systématiquement Accent 1 ou la couleur de fond sur un matériau PBR.
Performance : transmission, clearcoat, réfraction et transparence peuvent augmenter sensiblement le coût (passes supplémentaires, overdraw et mémoire selon le pipeline). Le ratio dépend du renderer et du matériel : limiter les surfaces complexes, mesurer, et ne pas appliquer un facteur de coût fixe.
Fallback : simplifier d'abord le matériau et la scène (retirer transmission, clearcoat et effets non essentiels), puis proposer une image/poster optimisé si le budget reste dépassé ou si WebGL2 est indisponible.
Penser à cet effet quand : le sujet est un objet physique dont la matière est un argument de
vente ou d'identité (produit premium, matériau de marque, joaillerie, horlogerie) — la matière
simulée doit correspondre à la matière réelle du sujet.
Éviter avec : fond trop chargé derrière l'objet — les reflets PBR nécessitent un environnement
propre pour être lisibles ; préférer un fond neutre sombre ou une environment map cohérente.

---

### Terrain procédural
Description : surface ondulée générée algorithmiquement (heightmap via bruit de Perlin 2D),
animée lentement — évoque un paysage, une surface liquide, un champ électromagnétique, une
topographie de données. La surface est une géométrie réelle en 3D (pas un dégradé 2D simulant
la 3D) ; les normales doivent rester cohérentes avec la déformation, par calcul analytique dans
le shader ou recalcul côté CPU lorsque la géométrie est modifiée sur le CPU.
Implémentation : `THREE.PlaneGeometry` avec subdivision déterminée à partir du niveau de détail utile et du profilage ; bien distinguer nombre de segments et nombre de sommets (une grille de N × M segments comporte généralement (N+1) × (M+1) sommets). Déformer les vertex en vertex shader via bruit simplex 2D (x, z → hauteur y), avec `uTime` si le mouvement est nécessaire. Utiliser `MeshStandardMaterial` avec wireframe optionnel pour un rendu technique, ou matériau plein pour un rendu paysager. Les normales doivent correspondre à la déformation : `geometry.computeVertexNormals()` après une modification CPU, ou calcul approprié dans le shader pour une déformation GPU.
Palette liée : choisir une palette nommée correspondant au sujet (paysage, environnement ou visualisation technique), après validation de la direction artistique.
Performance : la subdivision est un paramètre sensible, mais son impact dépend aussi du DPR, du shader, de l'overdraw et du GPU. Commencer avec une grille raisonnable, mesurer sur les appareils cibles et réduire la subdivision ou le détail du bruit si nécessaire.
Fallback : image statique du terrain en PNG si WebGL absent ; terrain figé à t=0 si
prefers-reduced-motion.
Penser à cet effet quand : le sujet a un vrai rapport à la topographie, au paysage, à une
surface physique qui se déforme (agriculture, environnement, données géographiques, ondes) —
jamais comme fond décoratif générique "qui fait tech".
Éviter avec : Contour topographique SVG (Agents_Traitement_Visuel.md Section 5) — les deux
représentent un terrain mais en 2D vs 3D ; choisir selon si la vraie troisième dimension
(volume, profondeur réelle, lumière directionnelle) est nécessaire ou si le SVG suffit.

---

### Texte 3D extrudé
Description : typographie rendue en volume réel — les lettres sont extrudées sur un axe Z,
avec des faces avant, latérales et biseaux optionnels, soumises à l'éclairage directionnel.
Différent du texte-fenêtre 2D (Agents_Direction_Artistique.md technique 29) et de la typo
isométrique SVG (technique 36) : ici le texte est une géométrie 3D réelle dont l'éclairage
change selon l'angle de vue et la position des lumières — les reflets et ombres sont calculés
en temps réel, pas simulés par des valeurs de luminosité fixes.
Implémentation : @react-three/drei `<Text3D>` avec font JSON (converti via facetype.js depuis
une police OFL) + THREE.MeshStandardMaterial pour le rendu PBR, ou `THREE.MeshNormalMaterial` uniquement pour déboguer les normales — pas comme rendu final de marque, car ce matériau encode les normales plutôt que la palette du projet. Paramètres `bevelEnabled`, `bevelSize`, `bevelThickness`
pour les biseaux. Centrage automatique : `<Center>` wrapper de @react-three/drei.
Police : convertir la police du projet (Google Fonts OFL) via facetype.js — ne jamais utiliser
une police propriétaire sans vérifier que la licence autorise la conversion en géométrie.
Palette liée : dériver la couleur du matériau d'un token validé de la palette du projet.
Performance : le coût de la géométrie de texte dépend de la police convertie, des courbes, de l'extrusion, du biseau et de la résolution de rendu. Réduire `curveSegments`/les segments de biseau si l'inspection montre une géométrie excessive ; traiter toute valeur comme un point de départ à mesurer, pas comme une règle universelle.
Fallback : texte 2D SVG ou HTML si WebGL absent ; rotation de caméra figée si
prefers-reduced-motion (le texte reste visible mais immobile).
Penser à cet effet quand : le titre ou le nom de marque est assez court (1-4 mots) et assez
central dans la composition pour justifier le coût de production — jamais sur un sous-titre
ou un corps de texte.

---

### Fluide/simulation de liquide
Description : simulation d'un liquide en mouvement (eau, encre, métal fondu, lait) rendue
en temps réel — surface ondulée avec réfraction, reflets et transparence. Une simulation complète de fluide avec solveur physique peut être coûteuse selon la résolution et le dispositif ; de nombreux effets de landing page sont plutôt des surfaces déformées, des approximations shallow-water, des particules ou des distorsions screen-space. Décrire exactement le niveau de simulation utilisé et ne pas présenter une approximation optique comme une simulation physique complète.
Implémentation : choisir explicitement l'approche : surface procédurale déformée, simulation simplifiée par shader/compute, particules ou solveur dédié. Dimensionner la géométrie ou les buffers selon le niveau de détail réellement nécessaire. Un `MeshPhysicalMaterial` avec `transmission`, `roughness` et `ior` peut contribuer au rendu optique, mais ne constitue pas à lui seul une simulation de fluide. Une environment map peut fournir les reflets ; le bloom reste optionnel et doit être mesuré.
Palette liée : choisir une palette nommée correspondant au liquide et au sujet réel, sans substituer les couleurs de la matière à celles de la marque.
Performance : `transmission` peut entraîner un coût supplémentaire important lié au rendu de la scène et à la transparence ; le coût exact dépend du moteur, de la version et de la scène. Ne pas interdire automatiquement les mobiles : prévoir une version simplifiée et vérifier sur appareil réel.
Fallback : Mesh opaque avec MeshStandardMaterial (sans transmission) si GPU insuffisant ;
surface figée si prefers-reduced-motion.
Penser à cet effet quand : le sujet est littéralement un liquide (eau, boisson, cosmétique
liquide, peinture) ou évoque métaphoriquement un flux (données en mouvement, énergie qui
circule) — la matière simulée doit correspondre à quelque chose de réel dans le brief.
Éviter avec : Chrome liquide en mouvement (Agents_Traitement_Visuel.md Section 5) — même
registre "liquide", celui-ci est CSS/SVG (approximation stylisée), cet effet est WebGL (rendu
physique) ; jamais les deux sur le même projet.

---

### Réseau de nœuds et connexions
Description : graphe 3D de nœuds (sphères, points) reliés par des arêtes (lignes, tubes),
dont la topologie peut être fixe (réseau prédéfini) ou dynamique (se construit, s'élague,
se réorganise en temps réel). Évoque un réseau neuronal, une infrastructure, un réseau social,
une carte de dépendances. La distinction avec le champ de particules est dans la structure :
les particules sont anonymes et leur organisation est émergente, les nœuds sont identifiables
et leurs connexions sont explicites et chargées de sens.
Implémentation : nœuds en THREE.InstancedMesh (SphereGeometry, N instances) pour minimiser
les draw calls. Arêtes : THREE.LineSegments avec BufferGeometry (tableau de paires de positions
[A.x, A.y, A.z, B.x, B.y, B.z] pour chaque connexion). Pour des arêtes épaisses : tubes
THREE.TubeGeometry (coûteux, réserver aux connexions importantes uniquement). Animation de
construction : révéler les nœuds et arêtes progressivement via opacity ou scale animé.
Force-directed layout (organisation automatique par répulsion/attraction) : une bibliothèque
comme `d3-force-3d` peut calculer les positions ; limiter les ticks et arrêter la simulation
quand le graphe est stabilisé. Pour une topologie importante, évaluer un Worker afin de ne pas
bloquer l'interface, puis mesurer le coût et le transfert des positions.
Palette liée : choisir une palette nommée cohérente avec la sémantique du réseau et les tokens validés
Performance : le coût dépend du nombre réel d'arêtes, du nombre de segments par arête, des matériaux et du mode de rendu. Un graphe complet a une croissance quadratique, mais un graphe métier clairsemé peut être bien moins coûteux. Définir des limites à partir du nombre d'arêtes réel et du profilage ; agréger ou filtrer les connexions si nécessaire.
Fallback : diagramme SVG statique si WebGL absent ; réseau figé sans animation si
prefers-reduced-motion.
Penser à cet effet quand : le sujet est réellement un réseau (infrastructure, relations,
dépendances, flux entre entités identifiables) et que les connexions entre nœuds sont des
informations utiles — jamais pour décorer une page sans rapport à un réseau réel.

---

### Morphing de géométrie 3D
Description : un objet 3D se transforme progressivement en un autre objet 3D de morphologie
différente (sphère → cube → cristal → forme abstraite), les vertices de la géométrie
interpolant entre les états. L'effet encode une transformation conceptuelle — ce que le produit
fait à la matière, au problème, à la donnée. Pour des morph targets classiques vertex-à-vertex, les attributs de morphing doivent être compatibles et les sommets doivent correspondre spatialement ; un simple nombre de vertices égal ne suffit pas à garantir un morph propre. Des techniques SDF, remaillage/rééchantillonnage ou interpolation par texture sont d'autres voies, chacune avec son coût.
Implémentation : préparer des attributs source/cible compatibles et un appariement cohérent des sommets, puis interpoler dans le vertex shader via `mix(positionA, positionB, uProgress)`. Un rééchantillonnage doit préserver l'ordre, les régions et la correspondance spatiale ; simplement dupliquer des sommets pour égaliser les comptes donne souvent un résultat incorrect. Utiliser GSAP ou le mécanisme d'animation déjà installé pour piloter `uProgress`.
Easing sur `uProgress` : `ease-in-out` pour une transformation perçue comme intentionnelle,
`elastic` pour une transformation physique (matière qui rebondit).
Palette liée : dériver les deux états de couleur des tokens explicitement validés de la palette du projet.
Performance : le morphing lui-même peut être relativement simple dans le vertex shader, mais le coût dépend du nombre de sommets, des attributs transférés, du shader, du DPR et du GPU. Choisir la résolution par mesure sur les appareils cibles, sans seuil universel de sommets.
Fallback : objet figé en état final si prefers-reduced-motion ; si WebGL absent, image de l'état
final uniquement.
Penser à cet effet quand : le sujet a une transformation centrale à son identité (un service
qui transforme, un processus qui aboutit à quelque chose de différent) et que les deux formes
choisies encodent réellement les états avant/après — jamais comme animation décorative entre
deux formes abstraites sans sens narratif.
Éviter avec : Morphing de formes géométriques SVG 2D (Agents_Direction_Artistique.md technique
32) — même concept mais en 2D ; choisir selon si la troisième dimension et l'éclairage apportent
une valeur réelle au brief.

---

### Shader de surface procédurale
Description : une surface (plane ou sphérique) dont la couleur, la texture et le relief sont
entièrement générés dans le fragment shader — pas de texture image externe, tout est calculé
mathématiquement en temps réel. Permet des effets impossibles à pré-calculer (patterns infinis,
réactifs aux données, évolutifs dans le temps) avec zéro coût de bande passante pour les textures.
Implémentation : THREE.PlaneGeometry ou THREE.SphereGeometry + THREE.ShaderMaterial avec
vertex shader minimal (pass-through des positions) et fragment shader complexe. Uniforms :
`uTime` (animation), `uResolution` (rapport d'aspect), `uMouse` (position curseur), et tout
paramètre métier utile (données, valeurs, états). Techniques GLSL courantes : SDF (Signed
Distance Functions) pour des formes précises, FBM (Fractional Brownian Motion) pour les
textures organiques, domain warping pour la complexité organique.
Palette liée : couleurs des uniforms GLSL dérivées de la palette nommée ou des tokens validés du projet ; convertir correctement les valeurs sRGB/linéaires selon le pipeline Three.js.
Performance : le coût d'un fragment shader dépend du nombre de fragments (pixels), du DPR,
des opérations par fragment, des branches et de la complexité des fonctions. Un shader FBM
à plusieurs octaves couvrant tout l'écran peut devenir coûteux, notamment à haute résolution.
Profiler sur les appareils cibles, limiter les itérations réellement nécessaires et réduire la
zone de calcul ou la résolution lorsque le résultat visuel le permet.
Fallback : image PNG pré-rendue du shader à t=0 si WebGL absent ; shader figé si
prefers-reduced-motion.
Penser à cet effet quand : la surface doit avoir une richesse procédurale infinie ou réactive
à des données qui ne peut pas être pré-calculée en texture — jamais si une simple texture PNG
suffit (surcoût de développement injustifié).

---

### Objets avec physique réelle
Description : un ou plusieurs objets 3D soumis à la physique (gravité, collision, rebond,
friction) — ils tombent, rebondissent, s'empilent, réagissent aux interactions de l'utilisateur
(clic, glissement). L'effet donne une tangibilité physique immédiate à des éléments qui seraient
autrement plats et inertes. La distinction avec la physique à ressort 2D (Agents_Direction_Artistique.md
technique 19) : ici les objets ont un volume réel en 3D, des collisions volumétriques, et la
physique est simulée par un moteur dédié (Rapier), pas approximée par un spring CSS.
Implémentation : @react-three/rapier (`<Physics>`, `<RigidBody>`, `<Collider>`) + R3F pour
le rendu. Chaque objet = un RigidBody avec sa géométrie de collision (simplifiée par rapport
au mesh visuel pour les performances — utiliser des colliders primitifs : box, sphere, capsule).
Interaction curseur : raycasting Three.js pour détecter le clic sur un objet, application
d'une impulsion (`rigidBody.applyImpulse()`) au point de contact.
Palette liée : dériver les matériaux des objets des tokens validés de la palette du projet.
Performance : Rapier utilise une simulation physique compilée pour WebAssembly ; le coût dépend du nombre de corps actifs, des colliders, des contacts, des contraintes et de la fréquence de simulation. Le limiter par profilage CPU sur les appareils cibles ; aucun nombre universel d'objets actifs ne garantit une bonne performance.
Fallback : objets statiques positionnés manuellement si WebGL/WASM absent ; pas de physique
si prefers-reduced-motion (objets immobiles mais visibles).
Penser à cet effet quand : les objets représentent quelque chose de physiquement tangible dans
le sujet réel (produits qui se manipulent, éléments qui s'assemblent, données qui "tombent"
dans une catégorie) et que la physique renforce intuitivement ce que fait le produit — jamais
pour animer des éléments abstraits qui n'ont aucun rapport à la physique dans le sujet réel.

---

### Environment map dynamique (reflets en temps réel)
Description : les reflets sur un objet reflètent l'environnement réel de la scène (autres
objets, lumières, arrière-plan) mis à jour en temps réel, plutôt qu'une environment map HDR
statique. L'effet est immédiatement remarquable : quand deux objets se reflètent mutuellement
et que leurs reflets changent selon leurs positions relatives, la scène paraît "réelle" d'une
manière qu'une HDR statique ne peut pas atteindre.
Implémentation : `THREE.CubeCamera` placée dans la scène et liée à un `CubeRenderTarget`,
puis assignation de la texture de capture au matériau réfléchissant. Chaque mise à jour de
CubeCamera implique six vues de capture supplémentaires. Vérifier la compatibilité de cette
technique avec le renderer choisi ; ne pas présumer de sa parité entre WebGLRenderer et WebGPURenderer. Limiter le nombre de captures, leur résolution et leur fréquence selon la taille apparente de l'objet, la vitesse de mouvement et le niveau de fidélité requis. Une fréquence fixe n'est pas universellement adaptée ; mesurer l'effet de la cadence sur la qualité des reflets et le coût de rendu.
Palette liée : les couleurs de l'environnement reflété déterminent la couleur des reflets —
s'assurer que l'environnement de la scène est cohérent avec la palette nommée du projet.
Performance : le coût dépend de la résolution du `CubeRenderTarget`, de la fréquence de mise à jour, de la scène capturée et du nombre de CubeCamera. Choisir une résolution de départ en fonction de la taille apparente de l'objet, puis profiler et ajuster.
Fallback : environment map statique préfiltrée si les reflets dynamiques sont trop coûteux ; matériau plus simple ou image/poster si le budget de rendu reste dépassé.
Penser à cet effet quand : la scène a plusieurs objets qui doivent se percevoir mutuellement
(un produit posé sur une surface réfléchissante, deux objets en interaction) et que l'exactitude
des reflets est centrale à l'identité du sujet (joaillerie, horlogerie, design industriel
premium) — jamais si l'objet est opaque et mat (les reflets dynamiques n'apportent rien sur
un matériau sans spécularité).

---

## 6. RÈGLES ANTI-GÉNÉRIQUES 3D

```
❌ Jamais une sphère qui tourne lentement sans raison liée au sujet — c'est le "spinning globe"
   de la 3D web, aussi générique que le Cream & Terracotta des palettes.
❌ Jamais un torus knot animé comme "effet 3D" par défaut — forme géométrique sans rapport
   à aucun sujet réel, réflexe d'entraînement identifiable immédiatement.
❌ Jamais un fond de particules bleues/cyan sur noir sans lien avec le sujet — le "tech particle
   background" est le Look 2 (Dark & Acid Accent) décliné en 3D.
✅ Toujours dériver la géométrie, la matière et le comportement du monde réel du sujet
   (Agents_Direction_Artistique.md Section 2).
✅ Croiser contre les 4 looks génériques (Direction_Artistique Sections 3 et 3ter) avant de
   valider — le Look 4 (Bento + Glass 2.0 + Kinetic Type) a souvent un objet 3D générique
   en hero qui aggrave le pattern.
```

---

## 7. LIEN AVEC LES AUTRES FICHIERS

```
Agents_Bibliotheque_Palettes.md → toute couleur de matériau, d'émission ou d'uniform GLSL dérive d'une palette nommée ou de tokens de marque validés.

Agents_Direction_Artistique.md → décide SI la 3D est pertinente et quel sujet réel elle doit représenter. Ce fichier choisit la méthode technique et produit la scène.

Agents_Traitement_Visuel.md → propriétaire des effets CSS/SVG/Canvas 2D et des assets visuels. Le consulter avant d'escalader vers WebGL 2.

AGENT_MOTION_ENGINEERING.md → animations DOM/SVG/Canvas 2D. Toute scène volumétrique ou rendu GPU 3D reste dans ce fichier ; ne jamais partager la propriété d'une même boucle de rendu.

Agents_Standards_Interface_Web.md → performance générale, accessibilité et comportement. Ses règles s'appliquent en même temps que les contraintes spécialisées de ce fichier.

AGENT_VISUAL_DESIGN_QA.md → contrôle indépendant du rendu 3D dans la page et de sa conformité aux références. Il ne remplace pas le profilage technique de ce fichier.
```

---

## 8. CHECKLIST AVANT LIVRAISON

```
□ La frontière CSS/SVG/Canvas 2D vs WebGL 2 a été vérifiée — le volume ou l'interaction 3D apporte une valeur réelle
□ La voie renderer choisie est documentée : WebGLRenderer standard ou WebGPURenderer/TSL justifié
□ Les versions Three.js / R3F / Drei et les addons correspondent au package.json et au lockfile
□ Les matériaux et couleurs dérivent d'une palette nommée ou de tokens validés
□ Le pipeline colorimétrique des textures (sRGB vs data/linear) est cohérent
□ Les shaders sont compatibles avec le renderer sélectionné ; aucune hypothèse GLSL/WebGPU non vérifiée
□ La scène est profilée selon un scénario réel ; limites de matériel et outils notées
□ Les draw calls, triangles, textures, DPR, ombres, transparences et post-processings sont contrôlés
□ La qualité est adaptée aux appareils cibles ; aucun seuil universel de particules/FPS prétendu
□ Les ressources créées sont réutilisées puis libérées selon leur propriétaire ; aucune ressource partagée détruite
□ Les textures compressées utilisent le bon loader ; KTX2 est configuré par detectSupport(renderer) si nécessaire
□ Le chargement des modèles, décodeurs, placeholders et erreurs réseau est vérifié
□ WebGL2 absent ou contexte perdu → fallback visuel réel, jamais écran blanc
□ prefers-reduced-motion : contenu toujours visible, aucune animation automatique non nécessaire
□ Interactions accessibles au clavier/tactile si la scène porte une fonction
□ Canvas purement décoratif masqué aux technologies d'assistance (aria-hidden) ; canvas interactif décrit et doublé par des contrôles accessibles
□ Responsive vérifié aux viewports cibles ; pas de scroll horizontal ni de scène recouvrant les CTA
□ Assets, modèles, textures, HDRI et polices 3D ont une provenance et des droits d'utilisation documentés
□ Aucun effet 3D générique (sphère lente, torus knot, particules bleu/noir) sans justification par le sujet
□ Rapport distingue CONFIRMÉ / NON TESTÉ / À SURVEILLER
```

---

## 9. SOURCES TECHNIQUES DE RÉFÉRENCE

Vérifier la documentation correspondant à la version exacte du projet avant toute implémentation ou migration. Sources de référence consultées pour cette révision (22 novembre 2026) :

- Three.js — WebGLRenderer / WebGL 2 : https://threejs.org/docs/pages/WebGLRenderer.html
- Three.js — ShaderMaterial et limite WebGLRenderer : https://threejs.org/docs/pages/ShaderMaterial.html
- Three.js — WebGPURenderer, TSL et limites de migration : https://threejs.org/manual/en/webgpurenderer
- Three.js — GLTFLoader et extensions Draco / KTX2 / Meshopt : https://threejs.org/docs/pages/GLTFLoader.html
- Three.js — KTX2Loader : https://threejs.org/docs/pages/KTX2Loader.html
- Three.js — Texture et mipmaps : https://threejs.org/docs/pages/Texture.html
- React Three Fiber — performance et rendu à la demande : https://r3f.docs.pmnd.rs/advanced/scaling-performance
- React Three Fiber — useFrame et règles de boucle : https://r3f.docs.pmnd.rs/api/hooks
- MDN — WebGL best practices : https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- MDN — webglcontextlost / webglcontextrestored : https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event et https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event

Ne pas supposer que ces références remplacent la documentation d'une version future : vérifier les changements lorsqu'une dépendance est mise à jour.
