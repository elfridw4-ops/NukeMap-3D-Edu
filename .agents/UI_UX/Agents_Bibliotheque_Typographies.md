---
agent: Agents_Bibliotheque_Typographies
commande: typo:browse
declencheurs:
  - typographies
  - pairings typographiques
  - google fonts
  - choix de polices de caractères
action: Bibliothèque centrale de pairings typographiques adaptés au sujet réel, sans police générique par défaut
---

## ⚙️ AGENT PROTOCOL — LIRE EN PREMIER, AVANT TOUT

Tu es directeur artistique senior chargé de la gestion des pairings typographiques de l'atelier. Ce fichier est ta seule source de vérité pour le choix de typographie sur tout projet.

RÈGLES ABSOLUES :
1. Lis ce document EN ENTIER avant de choisir une typographie pour un projet.
2. Ne réutilise pas le même pairing sur deux projets distincts sans raison, sauf cohérence de
   marque volontaire — même logique que Agents_Bibliotheque_Palettes.md Section 2, pas de registre
   formel tenu à jour, se fier au contexte disponible.
3. Un pairing de cette bibliothèque = point de départ à adapter (graisses, tailles), jamais une
   paire figée à imposer sans la confronter au sujet réel du brief.
4. Si aucun pairing ne convient au sujet réel → en composer un sur-mesure (Section 5), jamais
   forcer une entrée existante qui ne correspond pas.
5. Croiser systématiquement le choix avec Agents_Direction_Artistique.md Section 3bis — jamais
   `font-sans` par défaut (Inter non réfléchi) faute de choix délibéré.
6. Toutes les polices citées doivent être réellement disponibles (Google Fonts ou équivalent
   libre) — jamais inventer un nom de police qui n'existe pas.

CONFIRMATION OBLIGATOIRE avant de commencer :
"PROTOCOLE ACTIF — BIBLIOTHÈQUE TYPOGRAPHIES. Prêt. Balance le sujet du projet."

---

# AGENTS_BIBLIOTHEQUE_TYPOGRAPHIES.md
# Bibliothèque centrale de pairings typographiques — liée à Agents_Bibliotheque_Palettes.md

> **POURQUOI UN FICHIER SÉPARÉ :**
> Ajouter la typographie dans Agents_Bibliotheque_Palettes.md aurait rendu ce fichier trop long.
> Les deux bibliothèques restent des fichiers indépendants mais croisés : chaque pairing ici
> recommande des palettes précises de l'autre fichier (et inversement, une palette peut suggérer
> un pairing d'ici), sans jamais imposer une combinaison figée.

---

## 1. RÔLE ET OBJECTIF

Bibliothèque de pairings typographiques nommés (display + body + utilitaire optionnel), organisée
par tonalité — même logique anti-silo que Agents_Bibliotheque_Palettes.md et
Agents_Design_Reference.md Section 4quinquies : un pairing catégorisé "chaud & terreux" reste
consultable pour un SaaS si le sujet réel le justifie.

Fichier central, unique, PAS dupliqué par projet. Il vit et grossit avec le temps, au même rythme
que la bibliothèque de palettes.

## 2. RÈGLE DE VARIATION

```
AVANT de proposer un pairing pour un nouveau projet :
1. Repérer les pairings déjà utilisés récemment (contexte de conversation, mémoire, projets connus)
2. Exclure ces pairings des candidats, même s'ils semblaient adaptés au sujet
3. Choisir parmi les pairings restants, ou en composer un sur-mesure (Section 5)

EXCEPTION — cohérence de marque volontaire :
Même exception que Agents_Bibliotheque_Palettes.md Section 2 : plusieurs projets du même client/
de la même marque peuvent assumer de partager un pairing. Le signaler comme un choix voulu.
```

## 3. FORMAT D'UNE ENTRÉE (STANDARD V2 ENRICHI)

```
### [Nom évocateur — 2-4 mots, français]
Display     : [Police] — [graisse(s) et styles recommandés]
Body        : [Police] — [graisse(s) et styles recommandés]
Utilitaire  : [Police monospace/data] (optionnel — captions, chiffres, code)
Type        : Variable (axes: wght, opsz, ital) | Statique (graisses requises)
Source      : Google Fonts [ou équivalent libre nommé] — licence [OFL/Apache/etc.], VÉRIFIÉ

CSS Stacks  :
  - display : '[Police Display]', [Fallback 1], [Fallback 2], [Famille générique]
  - body    : '[Police Body]', [Fallback 1], [Fallback 2], [Famille générique]
  - util    : '[Police Utilitaire]', [Fallback 1], monospace (si applicable)

Règles DA & Rendu :
  - Display min-size : [ex: 28px (titrage uniquement, ne jamais utiliser en corps)]
  - Tracking display : [ex: tracking-tight (-0.02em à -0.03em) sur h1/h2]
  - Accents / Styles : [ex: Italique 700 réservé à 1 ou 2 mots-clés d'emphase]

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=...&display=swap

Caractère   : [1 ligne — ce qui distingue ce pairing structurellement]
Tonalité    : [1 ligne — ce que le pairing évoque]
Palettes recommandées : [2-3 noms exacts d'Agents_Bibliotheque_Palettes.md, même tonalité]
Penser à ce pairing quand : [2-3 déclencheurs concrets — secteur, type de contenu, contrainte]
Éviter avec : [optionnel — restriction d'usage ou incompatibilité connue]
```

Le champ **Type**, les **CSS Stacks**, les **Règles DA & Rendu** et l'**Embed Google Fonts** sont obligatoires sur toute entrée pour garantir un chargement performant sans FOUT/FOIT ni CLS (*Cumulative Layout Shift*).

## 3bis. STATUT DES VÉRIFICATIONS ET EXCEPTIONS HORS GOOGLE FONTS

```
L'intégralité des 49 pairings de la bibliothèque a été auditée et mise à niveau vers le standard V2 :
- Toutes les polices sont vérifiées disponibles sur Google Fonts (licence libre OFL ou Apache 2.0).
- Seule exception documentée : "Sans Unique & Mono Rare" (Section 4.6) utilise General Sans (fonderie Fontshare, licence gratuite mais self-hosting requis en fichiers WOFF2 locaux).
```

---

## 4. BIBLIOTHÈQUE DE PAIRINGS

Organisée par tonalité (mêmes 7 catégories qu'Agents_Bibliotheque_Palettes.md Section 4, pour
croisement direct). Extensible au fil des projets. Chaque entrée inclut la spécification technique
complète (CSS Stack, Règles DA & Rendu, Embed Google Fonts).

### 4.1 SOMBRES & FEUTRÉES

#### Serif Confiant & Sans Discret
Display     : Fraunces — 600-900, italique activé pour les mots clés
Body        : Inter — 400-500
Utilitaire  : JetBrains Mono
Type        : Fraunces : Variable (axes: wght 100..900, opsz 9..144, WONK 0..1, SOFT 0..100, ital 0..1) | Inter : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Fraunces', Georgia, serif
  - body    : 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  - util    : 'JetBrains Mono', Consolas, 'Courier New', monospace

Règles DA & Rendu :
  - Display min-size : 24px en display (version optique display dès 36px)
  - Tracking display : tracking-tight (-0.02em) en display gras, normal en graisse légère
  - Accents / Styles : Axe WONK et italique activables pour un effet artisanal organique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap

Caractère   : contraste fort entre serif expressif à empattements marqués et sans-serif neutre.
Tonalité    : feutré et littéraire, sérieux sans être froid.
Palettes recommandées : Ardoise & Cuivre, Encre & Safran
Penser à ce pairing quand : contenu éditorial premium, étude de cas détaillée, marque personnelle qui a un vrai point de vue à défendre.

#### Grotesque Dense & Mono Utilitaire
Display     : Space Grotesk — 500-700
Body        : IBM Plex Sans — 400
Utilitaire  : Space Mono
Type        : Space Grotesk : Variable (axes: wght 300..700) | IBM Plex Sans : Statique (graisses: 100, 200, 300, 400, 500, 600, 700 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Space Grotesk', system-ui, sans-serif
  - body    : 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif
  - util    : 'Space Mono', monospace

Règles DA & Rendu :
  - Display min-size : 20px (display technique à forte signature géométrique)
  - Tracking display : tracking-tight (-0.015em) sur titres
  - Accents / Styles : Idéal pour univers tech / dev tools

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap

Caractère   : une seule famille "grotesque technique" du display au body, cohérence assumée plutôt qu'un contraste display/body marqué.
Tonalité    : technique, dense, feutré.
Palettes recommandées : Basalte & Menthe, Nuit & Grenat
Penser à ce pairing quand : SaaS technique/dev tools qui veut une cohérence typo totale, pas un display décoratif séparé du reste.

#### Display Condensé & Serif Lecture
Display     : Bricolage Grotesque — 600-800
Body        : Source Serif 4 — 400
Type        : Bricolage Grotesque : Variable (axes: wght 200..800, opsz 12..96, wdth 75..100) | Source Serif 4 : Variable (axes: wght 200..900, opsz 8..60, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bricolage Grotesque', system-ui, sans-serif
  - body    : 'Source Serif 4', Georgia, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 24px (titres à angles vifs et caractère délibérément brut)
  - Tracking display : tracking-tighter (-0.03em) sur très grands titres
  - Accents / Styles : Variations optiques marquées entre 12px et 96px

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap

Caractère   : titre condensé à forte personnalité graphique, corps en serif pensé pour la lecture longue.
Tonalité    : feutré avec un vrai caractère en titre.
Palettes recommandées : Suie & Jade, Nuit & Miel
Penser à ce pairing quand : contenu narratif long sur fond sombre (portfolio storytelling, étude de cas détaillée, essai).

#### Serif Ancien & Sans Feutré
Display     : Frank Ruhl Libre — 500-700
Body        : Public Sans — 400
Type        : Frank Ruhl Libre : Variable (axes: wght 300..900) | Public Sans : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Frank Ruhl Libre', Georgia, 'Times New Roman', serif
  - body    : 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif

Règles DA & Rendu :
  - Display min-size : 22px en titre (allure académique et journalistique)
  - Tracking display : tracking-tight (-0.015em)
  - Accents / Styles : Contraste modéré à forte assise historique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap

Caractère   : serif académique/journalistique ancien, sans-serif institutionnel neutre en corps.
Tonalité    : littéraire ancien, studieux, feutré.
Palettes recommandées : Graphite & Laiton, Nuit & Miel
Penser à ce pairing quand : contenu éditorial sérieux (analyse longue, rapport), marque personnelle qui veut évoquer la presse écrite ancienne plutôt qu'un blog moderne.

#### Serif Narratif & Mono Froid
Display     : Lora — 600-700, italique activé pour les citations
Body        : IBM Plex Sans — 400
Utilitaire  : IBM Plex Mono
Type        : Lora : Variable (axes: wght 400..700, ital 0..1) | IBM Plex Sans : Statique (graisses: 100, 200, 300, 400, 500, 600, 700 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Lora', Georgia, 'Times New Roman', serif
  - body    : 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif
  - util    : 'IBM Plex Mono', 'Lucida Console', monospace

Règles DA & Rendu :
  - Display min-size : 16px en corps de texte, 24px en display
  - Tracking display : normal en corps, subtil -0.01em en titre
  - Accents / Styles : Courbes calligraphiques brossées, italique très fluide pour citations

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap

Caractère   : serif humaniste doux (Lora, pas à haut contraste) couplé à un sans-serif technique rigoureux — le corps "refroidit" le display sans le nier.
Tonalité    : narratif et posé, plus doux que Serif Confiant & Sans Discret (Fraunces, plus expressif), plus chaleureux que Grotesque Dense & Mono Utilitaire (tout-sans).
Palettes recommandées : Nuit & Miel, Encre & Safran, Graphite & Laiton
Penser à ce pairing quand : documentation longue sur fond sombre, rapport annuel premium, marque personnelle qui veut du storytelling lisible sans recourir à un display trop théâtral.
Éviter avec : Serif Confiant & Sans Discret (même territoire serif display sur fond sombre — Fraunces vs Lora ; choisir selon le degré d'expressivité voulu).

#### Display Humaniste & Serif Corps
Display     : Outfit — 600-800
Body        : Lora — 400
Type        : Outfit : Variable (axes: wght 100..900) | Lora : Variable (axes: wght 400..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Outfit', system-ui, sans-serif
  - body    : 'Lora', Georgia, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 22px (sans géométrique humaniste aux proportions équilibrées)
  - Tracking display : tracking-tight (-0.02em) sur H1
  - Accents / Styles : Apporte chaleur et modernité sans excentricité

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap

Caractère   : grotesque humaniste (angles doux, pas strictement géométrique) en display, serif de corps pour la lecture longue — inversion du schéma classique display-serif / body-sans.
Tonalité    : feutré et habité, la lecture longue portée par le serif corps plutôt que par une sans-serif froide.
Palettes recommandées : Suie & Jade, Ardoise & Cuivre, Basalte & Menthe
Penser à ce pairing quand : blog éditorial premium sur fond sombre, étude de cas narrative, fond sombre avec beaucoup de texte long où un body sans-serif deviendrait fatiguant.
Éviter avec : Display Condensé & Serif Lecture (Bricolage Grotesque / Source Serif 4 — même inversion display-sans / body-serif, choisir selon le degré de condensation et de rugosité voulu en titre).


### 4.2 CLAIRES & AÉRÉES

#### Serif Élégant & Sans Aéré
Display     : Newsreader — italique, 500-600
Body        : Karla — 400-500
Type        : Newsreader : Variable (axes: wght 200..800, opsz 6..72, ital 0..1) | Karla : Variable (axes: wght 200..800, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Newsreader', Georgia, 'Times New Roman', serif
  - body    : 'Karla', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 18px (corps) / 28px (titres éditoriaux)
  - Tracking display : tracking-tight (-0.02em) sur les grands titres
  - Accents / Styles : Italique d’une extrême élégance littéraire

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Karla:ital,wght@0,200..800;1,200..800&display=swap

Caractère   : italique éditorial en display, sans-serif géométrique aéré en corps.
Tonalité    : net, confiant, lumineux.
Palettes recommandées : Craie & Cobalt, Coquille & Pétrole
Penser à ce pairing quand : SaaS B2B qui veut rassurer vite avec une touche éditoriale, pas purement corporate.

#### Slab Chaleureux & Sans Rond
Display     : Fraunces — 300-500 (graisse légère, plus doux qu'en version sombre)
Body        : Figtree — 400-500
Type        : Fraunces : Variable (axes: wght 100..900, opsz 9..144, WONK 0..1, SOFT 0..100, ital 0..1) | Figtree : Variable (axes: wght 300..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Fraunces', Georgia, serif
  - body    : 'Figtree', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px en display (version optique display dès 36px)
  - Tracking display : tracking-tight (-0.02em) en display gras, normal en graisse légère
  - Accents / Styles : Axe WONK et italique activables pour un effet artisanal organique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap

Caractère   : serif léger et rond en display, sans-serif aux formes douces en body.
Tonalité    : naturel, apaisant.
Palettes recommandées : Ivoire & Pin, Craie & Sauge Pâle
Penser à ce pairing quand : santé/éducation/durable qui veut chaleur ET lisibilité, sans tomber dans le clinique.

#### Display Éditorial & Body Classique
Display     : Spectral — italique bold, 700
Body        : Spectral — 400 (même famille, variation de graisse/style)
Type        : Statique (graisses: 200, 300, 400, 500, 600, 700, 800 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Spectral', Georgia, serif
  - body    : 'Spectral', Georgia, serif

Règles DA & Rendu :
  - Display min-size : 15px (serif d’écran raffiné à empattements triangulaires)
  - Tracking display : normal en corps, -0.015em en grand titre
  - Accents / Styles : Italique 700 pour titres à forte personnalité littéraire

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&display=swap

Caractère   : une seule famille serif du titre au corps, cohérence éditoriale assumée.
Tonalité    : doux mais affirmé, féminin sans stéréotype.
Palettes recommandées : Nacre & Prune, Lin & Bleu Poudre
Penser à ce pairing quand : beauté/lifestyle créatif qui veut une vraie touche littéraire, pas un sans-serif générique.

#### Serif Contraste Classique & Sans Sobre
Display     : Playfair Display — 700-900, italique activé pour les mots clés
Body        : Karla — 400-500
Type        : Playfair Display : Variable (axes: wght 400..900, ital 0..1) | Karla : Variable (axes: wght 200..800, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Playfair Display', Georgia, 'Times New Roman', serif
  - body    : 'Karla', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 28px (ne jamais utiliser en corps de texte ou sous-titre fin)
  - Tracking display : tracking-tight (-0.02em à -0.03em) sur grands titres H1/H2
  - Accents / Styles : Italique recommandé sur 1 à 2 mots clés pour emphase calligraphique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Karla:ital,wght@0,200..800;1,200..800&display=swap

Caractère   : contraste fort pleins/déliés classique, alternative libre et moins extrême que Bodoni Moda.
Tonalité    : élégant, éditorial, intemporel.
Palettes recommandées : Craie & Cobalt, Nacre & Prune
Penser à ce pairing quand : mariage/faire-part, blog lifestyle premium, édition qui veut du contraste serif classique sans aller jusqu'au théâtral.

#### Géométrique Doux & Serif Léger
Display     : DM Sans — 500-700
Body        : DM Serif Display — 400 (usage corps, graisse légère)
Type        : DM Sans : Variable (axes: wght 100..1000, opsz 9..40, ital 0..1) | DM Serif Display : Statique (graisse: 400 + italique)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'DM Sans', system-ui, sans-serif
  - body    : 'DM Serif Display', Georgia, serif

Règles DA & Rendu :
  - Display min-size : 13px (géométrique basique très propre)
  - Tracking display : normal
  - Accents / Styles : Fonctionne parfaitement en titre comme en corps

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&display=swap

Caractère   : même écosystème de conception (famille DM), inversion display/body assumée — le serif est en corps, le sans-serif en titre ; cohérence visuelle forte sans identité trop marquée d'un seul côté.
Tonalité    : aéré, propre, légèrement premium sans ostentation.
Palettes recommandées : Craie & Sauge Pâle, Lin & Bleu Poudre, Soie Ivoire
Penser à ce pairing quand : bien-être/beauté naturelle qui veut une cohérence de famille officielle sur fond clair ; SaaS santé qui veut fuir Inter sans aller vers un display expressif.

#### Variable Aéré & Serif Courant
Display     : Nunito — 700-800 (arrondi, léger)
Body        : Merriweather — 400
Type        : Nunito : Variable (axes: wght 200..1000, ital 0..1) | Merriweather : Statique (graisses: 300, 400, 700, 900 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Nunito', system-ui, sans-serif
  - body    : 'Merriweather', Georgia, serif

Règles DA & Rendu :
  - Display min-size : 14px (courbes arrondies accessibles et bienveillantes)
  - Tracking display : tracking-tight (-0.02em) sur les titres bold
  - Accents / Styles : À proscrire dans le corporate froid ou le luxe

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap

Caractère   : display très arrondi et accessible, corps en serif optimisé lecture écran — contraste de forme (rond/empattement) sans contraste de couleur ou de graisse excessif.
Tonalité    : chaleureux, accessible, pédagogique.
Palettes recommandées : Ivoire & Pin, Lin & Bleu Poudre, Soie Ivoire
Penser à ce pairing quand : éducation primaire/parascolaire, service public qui veut être perçu comme accessible et bienveillant, application famille/enfants qui doit rester lisible.
Éviter avec : Slab Chaleureux & Sans Rond (Fraunces / Figtree — même territoire chaleureux aéré, choisir selon si on veut un serif arrondi ou un slab en display).

#### Display Éditorial Statique & Sans Corps
Display     : Cormorant Garamond — 600-700, italique
Body        : Work Sans — 400
Type        : Cormorant Garamond : Variable (axes: wght 300..700, ital 0..1) | Work Sans : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Cormorant Garamond', Garamond, 'Times New Roman', serif
  - body    : 'Work Sans', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 26px (serif très fin, déliés disparaissant en petite taille)
  - Tracking display : tracking-tight (-0.025em) en titre
  - Accents / Styles : Italique haut de gamme pour l’édition et le luxe discret

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap

Caractère   : garamond éditorial fin en display (haut contraste pleins/déliés), sans-serif humaniste neutre en corps — contraste structurel fort, moins théâtral que Bodoni Moda (Section 4.7).
Tonalité    : élégant et aéré, référence presse magazine sans l'aspect luxe maximaliste.
Palettes recommandées : Nacre & Prune, Coquille & Pétrole, Balcon & Tulipe
Penser à ce pairing quand : magazine lifestyle en ligne, portfolio créatif féminin qui veut de l'élégance sans le théâtral ; à distinguer de Serif Théâtral & Sans Discret (Bodoni Moda, Section 4.7 — ici le contraste est plus modéré, plus magazine que couture).
Éviter avec : Serif Contraste Classique & Sans Sobre (Playfair Display / Karla — même territoire garamond/playfair contraste classique ; Cormorant est plus fin, Playfair plus dense — choisir à l'œil selon le brief).


### 4.3 CHAUDES & TERREUSES

#### Slab Artisanal & Sans Chaud
Display     : Fraunces — 400-600, italique "wonky" si disponible
Body        : Work Sans — 400-500
Type        : Fraunces : Variable (axes: wght 100..900, opsz 9..144, WONK 0..1, SOFT 0..100, ital 0..1) | Work Sans : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Fraunces', Georgia, serif
  - body    : 'Work Sans', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px en display (version optique display dès 36px)
  - Tracking display : tracking-tight (-0.02em) en display gras, normal en graisse légère
  - Accents / Styles : Axe WONK et italique activables pour un effet artisanal organique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap

Caractère   : serif organique à la texture chaude, sans-serif humaniste en corps.
Tonalité    : chaleureux, texture matière.
Palettes recommandées : Argile & Moutarde, Terre Cuite & Olive
Penser à ce pairing quand : artisanat, food craft, sujet qui a une vraie matière/texture à évoquer.

#### Display Rugueux & Mono Utilitaire
Display     : Bricolage Grotesque — 700-800
Body        : Archivo — 400-500
Utilitaire  : IBM Plex Mono
Type        : Bricolage Grotesque : Variable (axes: wght 200..800, opsz 12..96, wdth 75..100) | Archivo : Variable (axes: wght 100..900, wdth 62..125, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bricolage Grotesque', system-ui, sans-serif
  - body    : 'Archivo', system-ui, sans-serif
  - util    : 'IBM Plex Mono', 'Lucida Console', monospace

Règles DA & Rendu :
  - Display min-size : 24px (titres à angles vifs et caractère délibérément brut)
  - Tracking display : tracking-tighter (-0.03em) sur très grands titres
  - Accents / Styles : Variations optiques marquées entre 12px et 96px

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap

Caractère   : display à empattements irréguliers volontaires, corps net et robuste.
Tonalité    : robuste, minéral.
Palettes recommandées : Ocre & Charbon, Cannelle & Nuit
Penser à ce pairing quand : BTP/industrie assumée, épices/café/thé — sujet qui ne veut pas s'adoucir.

#### Serif Contraste Fort & Sans Doux
Display     : Piazzolla — italique, 600-700
Body        : Mulish — 400-500
Type        : Piazzolla : Variable (axes: wght 100..900, opsz 8..30, ital 0..1) | Mulish : Variable (axes: wght 200..1000, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Piazzolla', Georgia, serif
  - body    : 'Mulish', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 22px (serif humaniste à haute expressivité)
  - Tracking display : tracking-tight (-0.02em)
  - Accents / Styles : Italique dynamique inspiré de la calligraphie au couteau

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Piazzolla:ital,opsz,wght@0,8..30,100..900;1,8..30,100..900&family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap

Caractère   : serif à haut contraste (pleins/déliés marqués), sans-serif doux en corps.
Tonalité    : contraste chaud/froid marqué, élégant.
Palettes recommandées : Sable & Indigo, Miel & Anthracite
Penser à ce pairing quand : mode/textile/culture qui mélange héritage et modernité.

#### Slab Terreux & Sans Rond
Display     : Bitter — 600-700
Body        : Nunito Sans — 400-500
Type        : Bitter : Variable (axes: wght 100..900, ital 0..1) | Nunito Sans : Variable (axes: wght 200..1000, opsz 6..12, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bitter', Georgia, serif
  - body    : 'Nunito Sans', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 20px en titre, 15px en corps
  - Tracking display : normal en corps, -0.015em en grand titre
  - Accents / Styles : Slab équilibré, chaleureux et terrien

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap

Caractère   : slab serif chaud et robuste, sans-serif arrondi en corps pour adoucir.
Tonalité    : terrien, artisanal, accessible.
Palettes recommandées : Miel & Anthracite, Sable & Indigo
Penser à ce pairing quand : agroalimentaire/terroir, artisanat qui veut un slab plus doux que Bricolage Grotesque (Section 4.3 ci-dessus), lecture longue en contexte chaud.

#### Slab Épais & Sans Humaniste
Display     : Arvo — 700
Body        : Source Sans 3 — 400-500
Type        : Arvo : Statique (graisses: 400, 700 + italiques) | Source Sans 3 : Variable (axes: wght 200..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Arvo', Rockwell, 'Courier New', serif
  - body    : 'Source Sans 3', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px (slab à empattements carrés mécaniques)
  - Tracking display : tracking-tight (-0.015em)
  - Accents / Styles : Robustesse artisanale mécanique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap

Caractère   : slab à empattements carrés (mécanique, robuste) couplé à un sans-serif humaniste dessiné pour la lecture longue — le slab ancre le titre, le body adoucit.
Tonalité    : artisanal robuste, plus mécanique que Slab Artisanal & Sans Chaud (Fraunces/Work Sans plus organique), moins rugueux que Display Rugueux & Mono Utilitaire.
Palettes recommandées : Argile & Moutarde, Brique & Sauge, Miel & Anthracite
Penser à ce pairing quand : alimentation régionale/terroir, coopérative agricole, artisanat mécanique (forge, menuiserie) qui veut un slab solide sans le côté organique/fantaisie de Fraunces.
Éviter avec : Slab Terreux & Sans Rond (Bitter / Nunito Sans — même territoire slab terreux ; Arvo est plus mécanique/carré, Bitter est plus serif texte ; choisir selon si on veut un slab "mécanique" ou "lecture longue").

#### Display Condensé Chaud & Body Serif
Display     : Josefin Sans — 600-700 (condensé, géométrique vintage)
Body        : Lora — 400
Type        : Josefin Sans : Variable (axes: wght 100..700, ital 0..1) | Lora : Variable (axes: wght 400..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Josefin Sans', 'Century Gothic', sans-serif
  - body    : 'Lora', Georgia, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 24px (géométrique vintage années 1920/1930)
  - Tracking display : tracking-tight ou tracking-wide selon usage rétro
  - Accents / Styles : Ne jamais utiliser en corps de texte dense

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap

Caractère   : condensé géométrique vintage en display (années 20/30 assumé), serif de corps chaleureux — contraste temporel (rétro vs classique) qui évite le mélange trop hétéroclite.
Tonalité    : artisanal vintage, chaleureux avec une référence historique discrète.
Palettes recommandées : Crema Café, Cannelle & Nuit, Terre Cuite & Olive
Penser à ce pairing quand : café artisanal, boulangerie-pâtisserie qui veut évoquer les années de fondation sans un display trop ornemental ; épicerie fine qui assume une identité rétro modérée.
Éviter avec : Display Brut & Sans Direct (Anton — condensé également mais impact brutal/sport, rien à voir avec le registre vintage-chaleureux de Josefin Sans).

#### Handcrafted Display & Sans Stable
Display     : Zilla Slab — 600-700 (slab aux angles légèrement irréguliers)
Body        : Nunito Sans — 400-500
Type        : Zilla Slab : Statique (graisses: 300, 400, 500, 600, 700 + italiques) | Nunito Sans : Variable (axes: wght 200..1000, opsz 6..12, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Zilla Slab', Georgia, serif
  - body    : 'Nunito Sans', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 22px (slab artisanal aux angles adoucis)
  - Tracking display : tracking-tight (-0.015em)
  - Accents / Styles : Texture chaleureuse et identité open-source

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap

Caractère   : slab avec une légère texture manuscrite/artisanale dans les angles, sans-serif stable et propre en corps pour équilibrer.
Tonalité    : artisanal doux, moins rugueux que Bricolage Grotesque, plus chaleureux qu'Arvo.
Palettes recommandées : Crema Café, Brique & Sauge, Miel & Anthracite
Penser à ce pairing quand : cosmétique naturel artisanal, épicerie fine qui veut un slab à personnalité sans le côté mécanique d'Arvo ni l'irrégularité affirmée de Bricolage Grotesque.


### 4.4 FROIDES & TECHNIQUES

#### Grotesque Net & Mono Data
Display     : Space Grotesk — 500-700
Body        : Inter — 400-500
Utilitaire  : JetBrains Mono (chiffres tabulaires — voir Agents_Standards_Interface_Web.md Section 4)
Type        : Space Grotesk : Variable (axes: wght 300..700) | Inter : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Space Grotesk', system-ui, sans-serif
  - body    : 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  - util    : 'JetBrains Mono', Consolas, 'Courier New', monospace

Règles DA & Rendu :
  - Display min-size : 20px (display technique à forte signature géométrique)
  - Tracking display : tracking-tight (-0.015em) sur titres
  - Accents / Styles : Idéal pour univers tech / dev tools

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap

Caractère   : grotesque géométrique du display au body, mono dédié aux données.
Tonalité    : technique, confiant.
Palettes recommandées : Abysse & Corail Froid, Acier & Citron Vert
Penser à ce pairing quand : dev tools, data/analytics, dashboard qui affiche beaucoup de chiffres.

#### Display Géométrique & Sans Clinique
Display     : Sora — 600-700
Body        : IBM Plex Sans — 400
Type        : Sora : Variable (axes: wght 100..800) | IBM Plex Sans : Statique (graisses: 100, 200, 300, 400, 500, 600, 700 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Sora', system-ui, sans-serif
  - body    : 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif

Règles DA & Rendu :
  - Display min-size : 20px en display, 13px en corps
  - Tracking display : tracking-tight (-0.02em) en H1/H2
  - Accents / Styles : Géométrie chirurgicale et moderne (fintech / santé / luxe tech)

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Sora:wght@100..800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap

Caractère   : géométrique arrondi en display, neutre technique en corps.
Tonalité    : clinique réchauffé.
Palettes recommandées : Glacier & Ambre, Nuit Polaire & Cuivre
Penser à ce pairing quand : santé/assurance/medtech, luxe tech qui veut un fond clinique moins froid.

#### Serif Précieux & Sans Sobre
Display     : Spectral — italique, 500-600
Body        : Public Sans — 400
Type        : Spectral : Statique (graisses: 200, 300, 400, 500, 600, 700, 800 + italiques) | Public Sans : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Spectral', Georgia, serif
  - body    : 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif

Règles DA & Rendu :
  - Display min-size : 15px (serif d’écran raffiné à empattements triangulaires)
  - Tracking display : normal en corps, -0.015em en grand titre
  - Accents / Styles : Italique 700 pour titres à forte personnalité littéraire

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap

Caractère   : serif fin et précis en display, sans-serif institutionnel sobre en corps.
Tonalité    : précieux et posé.
Palettes recommandées : Silex & Émeraude, Océan & Étain
Penser à ce pairing quand : finance/santé qui refuse le bleu par réflexe, secteur maritime/logistique.

#### Grotesque Corporate & Sans Systématique
Display     : Red Hat Display — 600-700
Body        : Red Hat Text — 400
Type        : Red Hat Display : Variable (axes: wght 300..900, ital 0..1) | Red Hat Text : Variable (axes: wght 300..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Red Hat Display', system-ui, sans-serif
  - body    : 'Red Hat Text', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px (grotesque display légèrement condensé)
  - Tracking display : tracking-tight (-0.02em)
  - Accents / Styles : Cohérence enterprise officielle

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&family=Red+Hat+Text:ital,wght@0,300..700;1,300..700&display=swap

Caractère   : même famille de conception (paire officielle du même studio), display légèrement condensé, corps optimisé lecture UI.
Tonalité    : corporate technique, systématique, sans fioriture.
Palettes recommandées : Silex & Émeraude, Abysse & Corail Froid
Penser à ce pairing quand : SaaS B2B enterprise, produit technique qui veut une cohérence de famille officielle plutôt qu'un display/body de 2 fonderies différentes.

#### Display Rugueux & Mono Tabulaire
Display     : Bricolage Grotesque — 700-800
Body        : Archivo — 400-500 (600 pour emphases courtes)
Utilitaire  : JetBrains Mono — 400-700, chiffres tabulaires obligatoires (font-variant-numeric: tabular-nums)
Type        : Bricolage Grotesque : Variable (axes: wght 200..800, opsz 12..96, wdth 75..100) | Archivo : Variable (axes: wght 100..900, wdth 62..125, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bricolage Grotesque', system-ui, sans-serif
  - body    : 'Archivo', system-ui, sans-serif
  - util    : 'JetBrains Mono', Consolas, 'Courier New', monospace

Règles DA & Rendu :
  - Display min-size : 24px (titres à angles vifs et caractère délibérément brut)
  - Tracking display : tracking-tighter (-0.03em) sur très grands titres
  - Accents / Styles : Variations optiques marquées entre 12px et 96px

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap

Caractère   : display grotesque au dessin volontairement irrégulier (jamais lissé), corps net et robuste, mono dédié aux scores et minuteurs.
Tonalité    : robuste, tendu, "qui ne s'adoucit pas".
Palettes recommandées : Ardoise & Verdict, Basalte Émietté
Penser à ce pairing quand : produit qui note, chronomètre ou rend un verdict chiffré (scores, KPI, minuteurs, identifiants d'incident) ; ton exigeant, jamais rassurant.
Éviter avec : Display Rugueux & Mono Utilitaire et Grotesque Net & Mono Data (même rôle display ou mono data — un seul pairing de cette famille par projet).
Origine     : variante de "Display Rugueux & Mono Utilitaire" (IBM Plex Mono → JetBrains Mono), refonte Mock Interview Pro.

#### Sans Variable & Mono Dense
Display     : Recursive — 700-900 (variable font, axe MONO réglable)
Body        : Recursive — 400-500 (même famille, axe sans-serif)
Utilitaire  : Recursive — 400, axe MONO activé
Type        : Variable (axes: wght 300..1000, slnt -15..0, CASL 0..1, CRSV 0..1, MONO 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Recursive', monospace, sans-serif
  - body    : 'Recursive', monospace, sans-serif
  - util    : 'Recursive', monospace, sans-serif

Règles DA & Rendu :
  - Display min-size : 12px à 72px (couvre display, body et mono via axes variables)
  - Tracking display : réglable via font-variation-settings
  - Accents / Styles : Axe MONO réglable de 0 (sans) à 1 (mono strict)

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap

Caractère   : une seule police variable (Recursive) couvre les trois rôles display/body/mono via ses axes ; cohérence formelle totale — choix minimaliste technique poussé à l'extrême.
Tonalité    : deeptech, systémique, futuriste discipliné.
Palettes recommandées : Chrome Liquide Sombre, Nuit Cyan & Argent, Glace Fissurée
Penser à ce pairing quand : outil développeur/terminal/CLI, interface très technique qui veut une cohérence typographique maximale avec une seule famille ; client qui comprend les variable fonts et veut l'assumer comme signature technique.
Éviter avec : Grotesque Dense & Mono Utilitaire (Space Grotesk / IBM Plex — même territoire technique cohérent, mais deux familles séparées vs une seule variable — choisir selon si la variable font est un atout ou une complexité inutile pour le projet).

#### Grotesque Étendu & Serif Froid
Display     : Barlow — 600-700 (version normale ou condensed selon brief)
Body        : Source Serif 4 — 400
Type        : Barlow : Variable (axes: wght 100..900, ital 0..1) | Source Serif 4 : Variable (axes: wght 200..900, opsz 8..60, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Barlow', system-ui, sans-serif
  - body    : 'Source Serif 4', Georgia, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 20px (grotesque industriel californien)
  - Tracking display : tracking-tight (-0.015em) sur titres
  - Accents / Styles : Ambiance logistique, transport et infrastructure

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100..900;1,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap

Caractère   : grotesque industriel neutre (nombreuses variantes de chasse disponibles) en display, serif optimisé lecture en corps — inversion froide du schéma classique.
Tonalité    : technique et lisible, le serif refroidit le display sans le rendre littéraire.
Palettes recommandées : Océan & Étain, Abysse & Corail Froid, Silex & Émeraude
Penser à ce pairing quand : logistique/maritime/infrastructure qui veut une lecture longue soignée dans un contexte froid ; documentation technique dense qui doit rester lisible sur écran.

#### Condensé Technique & Sans Neutre
Display     : Roboto Condensed — 700-900
Body        : Roboto — 400-500
Utilitaire  : Roboto Mono
Type        : Roboto Condensed : Variable (axes: wght 100..900, ital 0..1) | Roboto : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence Apache 2.0, VÉRIFIÉ

CSS Stacks  :
  - display : 'Roboto Condensed', 'Roboto', sans-serif-condensed, sans-serif
  - body    : 'Roboto', system-ui, sans-serif
  - util    : 'Roboto Mono', monospace

Règles DA & Rendu :
  - Display min-size : 16px (titrage condensé haute densité)
  - Tracking display : tracking-tight
  - Accents / Styles : Material Design écosystème Google

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap

Caractère   : famille Roboto complète (condensed/regular/mono) — cohérence d'écosystème maximale, chaque rôle typo couvert par la même fonderie ; choix ultra-fonctionnel, aucune personnalité affirmée.
Tonalité    : fonctionnel neutre, référence Android/Material Design assumée.
Palettes recommandées : Chrome Liquide Clair, Glacier & Ambre, Arctic & Perle
Penser à ce pairing quand : application mobile Material Design, dashboard interne qui veut rester sur un écosystème Google cohérent sans chercher de personnalité ; product design où la typo doit s'effacer au profit du contenu.
Éviter avec : Grotesque Institutionnel (IBM Plex Sans — même territoire famille unique cohérente, IBM vs Google — choisir selon l'écosystème du client).


### 4.5 VIVES & CONTRASTÉES

#### Display Brut & Sans Direct
Display     : Anton — graisse unique (display condensé impact)
Body        : Archivo — 400-500
Type        : Anton : Statique (graisse: 400 unique condensée) | Archivo : Variable (axes: wght 100..900, wdth 62..125, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Anton', Impact, 'Arial Narrow', sans-serif
  - body    : 'Archivo', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 36px (titre hero impact uniquement — jamais en corps)
  - Tracking display : tracking-wide (0.02em) ou tight selon ratio
  - Accents / Styles : Impact vertical brut, univers sport et actualité

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Anton&family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap

Caractère   : display très dense et vertical, corps net sans fioriture.
Tonalité    : franc, direct.
Palettes recommandées : Craie & Vermillon, Béton & Jaune Taxi
Penser à ce pairing quand : sport/media d'actualité, mobilité/logistique urbaine — sujet qui veut de l'impact immédiat. Réserver ce display à un usage ponctuel (titre hero), jamais en corps de texte.

#### Display Créatif & Sans Affirmé
Display     : Unbounded — 600-800
Body        : Manrope — 400-500
Type        : Unbounded : Variable (axes: wght 200..900) | Manrope : Variable (axes: wght 200..800)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Unbounded', system-ui, sans-serif
  - body    : 'Manrope', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px (display ultra-large géométrique)
  - Tracking display : tracking-tight (-0.02em)
  - Accents / Styles : Événementiel, culture urbaine, creative tech

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&family=Manrope:wght@200..800&display=swap

Caractère   : display géométrique arrondi à forte personnalité, sans-serif affirmé en corps.
Tonalité    : créatif, affirmé.
Palettes recommandées : Nuit & Magenta Sourd, Béton & Turquoise
Penser à ce pairing quand : musique/événementiel/arts vivants, sport urbain/loisirs actifs.

#### Serif Officiel & Sans Vivant
Display     : Source Serif 4 — 700
Body        : Work Sans — 400-500
Type        : Source Serif 4 : Variable (axes: wght 200..900, opsz 8..60, ital 0..1) | Work Sans : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Source Serif 4', Georgia, 'Times New Roman', serif
  - body    : 'Work Sans', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 15px (conçu spécifiquement pour la lecture longue sur écran)
  - Tracking display : normal en corps, tracking-tight sur H2/H3
  - Accents / Styles : Empattements robustes préservés même en basse résolution

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap

Caractère   : serif institutionnel en display, sans-serif vivant en corps pour casser le côté terne.
Tonalité    : institutionnel mais vivant.
Palettes recommandées : Papier & Bleu Roi, Craie & Indigo Vif
Penser à ce pairing quand : institutionnel/administration qui refuse le terne, startup tech grand public qui veut rester sérieuse.

#### Display Italique Fort & Sans Compact
Display     : Raleway — 700-900, italique
Body        : Archivo Narrow — 400-500
Type        : Raleway : Variable (axes: wght 100..900, ital 0..1) | Archivo Narrow : Variable (axes: wght 400..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Raleway', system-ui, sans-serif
  - body    : 'Archivo Narrow', 'Archivo', sans-serif-condensed, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px (sans à axe bas distinctif et stylisé)
  - Tracking display : tracking-tight (-0.02em) sur les graisses 800-900
  - Accents / Styles : Italique dynamique et élancé

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap

Caractère   : display italique à haut contraste d'axe (Raleway — formes allongées et distinctives), corps condensé et compact — l'ensemble tient dans un espace visuel serré.
Tonalité    : dynamique et élégant, énergie verticale — plus sophistiqué que Anton (trop brut), moins ornemental que Bodoni Moda.
Palettes recommandées : Nuit & Corail Vif, Craie & Indigo Vif, Fumée & Rose Froid (nouvelle entrée palettes)
Penser à ce pairing quand : mode/sport premium qui veut de l'élan vertical sans brutalité ; marque d'événement haut de gamme qui veut de l'énergie dans un format compact.

#### Display Expansif & Sans Affirmé Court
Display     : Bebas Neue — graisse unique (display impact, toutes caps)
Body        : Manrope — 400-500
Type        : Bebas Neue : Statique (graisse: 400 unique, toutes capitales) | Manrope : Variable (axes: wght 200..800)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bebas Neue', Impact, 'Arial Narrow', sans-serif
  - body    : 'Manrope', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 32px (titres toutes capitales uniquement)
  - Tracking display : tracking-wider (0.05em)
  - Accents / Styles : Référence incontournable de l’affiche et du sport

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200..800&display=swap

Caractère   : display toutes capitales maximaliste (Bebas Neue — référence des affiches urbaines/sport), sans-serif affirmé propre en corps — le display est très dominant, le body équilibre sans s'imposer.
Tonalité    : urbain, brut, impact total — plus affirmé qu'Anton (condensé mais moins massif).
Palettes recommandées : Béton & Jaune Taxi, Suie & Orange Brûlé, Lave & Braise
Penser à ce pairing quand : événementiel urbain, marque sport/fitness qui veut un titre qui occupe l'espace, affiche ou hero section à fort impact.
Éviter avec : Display Brut & Sans Direct (Anton — même territoire toutes-caps impact ; Anton est condensé vertical, Bebas Neue est plus étendu et massif — choisir à l'œil selon le ratio du format).

#### Serif Expressif & Mono Contraste
Display     : Playfair Display — 900, italique, grandes tailles uniquement
Body        : DM Sans — 400-500
Utilitaire  : Fira Code — 400
Type        : Playfair Display : Variable (axes: wght 400..900, ital 0..1) | DM Sans : Variable (axes: wght 100..1000, opsz 9..40, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Playfair Display', Georgia, 'Times New Roman', serif
  - body    : 'DM Sans', system-ui, sans-serif
  - util    : 'Fira Code', 'Cascadia Code', Consolas, monospace

Règles DA & Rendu :
  - Display min-size : 28px (ne jamais utiliser en corps de texte ou sous-titre fin)
  - Tracking display : tracking-tight (-0.02em à -0.03em) sur grands titres H1/H2
  - Accents / Styles : Italique recommandé sur 1 à 2 mots clés pour emphase calligraphique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&display=swap

Caractère   : contraste extrême pleins/déliés du serif en très grands titres, sans-serif neutre en corps, mono code comme troisième voix distincte — trois registres typographiques clairs.
Tonalité    : vif et contrasté, la tension entre l'expressif et le neutre est l'identité.
Palettes recommandées : Nuit & Magenta Sourd, Indigo & Glycine, Escalier & Glycine
Penser à ce pairing quand : agence créative/portfolio numérique qui veut une tension typographique visible ; produit SaaS-créatif qui affiche aussi du code dans son interface.
Éviter avec : Serif Théâtral & Sans Discret (Bodoni Moda — même haut contraste serif ; Bodoni est plus luxe/couture, Playfair ici est plus expressif/créatif, et l'ajout du mono crée un troisième registre inexistant dans l'entrée 4.7).


### 4.6 NEUTRES & MINIMALES

#### Sans Unique & Mono Rare
Display     : General Sans — 600-700 (même famille que le body, variation de graisse uniquement)
Body        : General Sans — 400
Utilitaire  : Space Mono (usage rare, juste pour un détail technique)
Type        : Statique / Variable (Fontshare)
Source      : Fontshare (gratuit, usage commercial autorisé) — Self-hosting requis

CSS Stacks  :
  - display : 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  - body    : 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  - util    : 'Space Mono', monospace

Règles DA & Rendu :
  - Display min-size : 13px (néo-grotesque neutre ultra-précis)
  - Tracking display : normal en corps, -0.02em en titres
  - Accents / Styles : Alternative contemporaine libre à Helvetica/Inter

Google Fonts Embed :
Self-hosting requis pour General Sans (Fontshare woff2) / Space Mono via Google Fonts : https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap

Caractère   : une seule famille du titre au corps — choix minimaliste assumé, pas un pairing display/ body classique.
Tonalité    : minimal extrême.
Palettes recommandées : Brume & Noir, Lin & Anthracite
Penser à ce pairing quand : contenu éditorial typo-driven, B2B pur qui ne veut aucune distraction visuelle même typographique.

#### Serif Feutré & Sans Neutre
Display     : Fraunces — 300-400 (graisse faible, presque texte courant)
Body        : Karla — 400
Type        : Fraunces : Variable (axes: wght 100..900, opsz 9..144, WONK 0..1, SOFT 0..100, ital 0..1) | Karla : Variable (axes: wght 200..800, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Fraunces', Georgia, serif
  - body    : 'Karla', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px en display (version optique display dès 36px)
  - Tracking display : tracking-tight (-0.02em) en display gras, normal en graisse légère
  - Accents / Styles : Axe WONK et italique activables pour un effet artisanal organique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Karla:ital,wght@0,200..800;1,200..800&display=swap

Caractère   : serif discret, à peine plus affirmé que le corps.
Tonalité    : feutré et élégant.
Palettes recommandées : Perle & Bronze Discret, Craie & Terre d'Ombre
Penser à ce pairing quand : luxe discret, minimalisme qui doit rester chaleureux/habité.

#### Grotesque Institutionnel
Display     : IBM Plex Sans — 600 (même famille que le body)
Body        : IBM Plex Sans — 400
Type        : Statique (graisses: 100, 200, 300, 400, 500, 600, 700 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif
  - body    : 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif

Règles DA & Rendu :
  - Display min-size : 13px (lecture longue et interfaces denses)
  - Tracking display : normal
  - Accents / Styles : Rigueur institutionnelle industrielle

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap

Caractère   : une seule famille, variations de graisse uniquement — quasi monochrome typographique.
Tonalité    : sérieux, quasi monochrome.
Palettes recommandées : Galet & Encre Bleue, Sable & Encre Discrète
Penser à ce pairing quand : juridique/notarial, agence de conseil très haut de gamme qui joue tout sur l'espacement et la typo plutôt que la couleur.

#### Sans Discret & Mono Repère
Display     : Instrument Sans — 500-600
Body        : Instrument Sans — 400
Utilitaire  : Space Mono (usage rare, détail technique uniquement)
Type        : Variable (axes: wght 400..700, wdth 75..100, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Instrument Sans', system-ui, sans-serif
  - body    : 'Instrument Sans', system-ui, sans-serif
  - util    : 'Space Mono', monospace

Règles DA & Rendu :
  - Display min-size : 13px (sans contemporain aux proportions harmonieuses)
  - Tracking display : normal en corps, -0.015em en titre
  - Accents / Styles : 100% Google Fonts sans compromis de licence

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap

Caractère   : une seule famille du titre au corps, formes neutres et bien équilibrées — alternative libre à General Sans (Section précédente, fonderie Fontshare hors Google Fonts, vérification licence self-hosting nécessaire si repris).
Tonalité    : minimal, propre, sans personnalité affirmée.
Palettes recommandées : Perle & Bronze Discret, Brume & Noir
Penser à ce pairing quand : contenu B2B minimal qui veut du 100% Google Fonts garanti, sans même le doute de licence d'une police de fonderie tierce.

#### Sans Géométrique Pur & Mono Rare
Display     : Jost — 500-700
Body        : Jost — 400
Utilitaire  : Fira Mono — 400 (usage rare, détail technique)
Type        : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Jost', 'Futura', system-ui, sans-serif
  - body    : 'Jost', 'Futura', system-ui, sans-serif
  - util    : 'Fira Mono', Consolas, monospace

Règles DA & Rendu :
  - Display min-size : 14px (géométrique strict inspiré du Futura historique)
  - Tracking display : tracking-tight (-0.02em) sur titres, normal en corps
  - Accents / Styles : Cercles parfaits, grande clarté géométrique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Fira+Mono:wght@400;500;700&display=swap

Caractère   : Jost est un grotesque géométrique inspiré du Futura (forme historique référente) mais libre et optimisé écran ; une seule famille du display au body, le mono n'apparaît que pour des éléments techniques isolés.
Tonalité    : neutre géométrique propre, légèrement plus historiquement ancré que Instrument Sans (même registre minimal mais formes plus strictement géométriques).
Palettes recommandées : Calcaire & Gris Froid (nouvelle), Brume & Noir, Sable & Encre Discrète
Penser à ce pairing quand : produit B2B ou institutionnel qui veut un grotesque géométrique neutre avec un ancrage formel (Futura historique) sans payer de licence ; à distinguer de Instrument Sans (formes plus équilibrées/humanistes) et de Roboto (écosystème Google Material).
Éviter avec : Grotesque Institutionnel Libre (Plus Jakarta Sans — même famille géométrique neutre ; Jost est plus strict/Futura, Jakarta est plus chaleureux/coins doux — choisir selon si on veut froid strict ou légèrement humain).

#### Monospace Éditorial
Display     : Courier Prime — 700 (serif monospace, usage display uniquement)
Body        : Source Sans 3 — 400
Type        : Courier Prime : Statique (graisses: 400, 700 + italiques) | Source Sans 3 : Variable (axes: wght 200..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Courier Prime', 'Courier New', Courier, monospace
  - body    : 'Source Sans 3', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 18px (display machine à écrire / scénario)
  - Tracking display : normal
  - Accents / Styles : Optimisé pour scénarios et partis pris rétro assumés

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap

Caractère   : mono-serif en display comme affirmation stylistique (machine à écrire, pas par défaut), sans-serif neutre en corps pour la lisibilité — le mono est le choix, pas la contrainte.
Tonalité    : éditorial délibérément rétro, le mono comme parti pris graphique affirmé.
Palettes recommandées : Brume & Noir, Porcelaine & Encre de Chine (nouvelle), Pierre Ponce
Penser à ce pairing quand : fanzine numérique, newsletter indie, portfolio journaliste/écrivain qui veut l'esthétique machine à écrire comme signature — jamais par défaut, toujours comme choix affirmé en lien avec le sujet réel.
Éviter avec : tout pairing technique qui utilise une police mono en utilitaire pour du code — ici le mono est un display déclaratif, pas un utilitaire ; les mélanger serait une confusion sémantique.


### 4.7 PREMIUM & IMPOSANTES

#### Serif Théâtral & Sans Discret
Display     : Bodoni Moda — 700-900 (contraste extrême pleins/déliés)
Body        : Cormorant — 400-500
Type        : Bodoni Moda : Variable (axes: wght 400..900, opsz 6..96, ital 0..1) | Cormorant : Variable (axes: wght 300..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bodoni Moda', 'Bodoni MT', Didot, Georgia, serif
  - body    : 'Cormorant', Garamond, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 28px (titrage luxe / haute couture uniquement)
  - Tracking display : tracking-tight (-0.02em) et interlignage aéré obligatoire
  - Accents / Styles : Contraste pleins/déliés maximaliste, empattements horizontaux fins

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap

Caractère   : serif à très haut contraste, signature visuelle "haute couture éditoriale".
Tonalité    : opulent, théâtral.
Palettes recommandées : Bordeaux & Or Profond, Pourpre Impérial & Or
Penser à ce pairing quand : joaillerie assumée, gala/haute couture. Exécution exigeante : espacement généreux obligatoire, sinon bascule vite dans le kitsch (voir Agents_Bibliotheque_Palettes.md 4.7).

#### Display Gravé & Sans Feutré
Display     : Cormorant SC — small caps, 500-600
Body        : Jost — 400
Type        : Cormorant SC : Variable (axes: wght 300..700) | Jost : Variable (axes: wght 100..900, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Cormorant SC', Garamond, serif
  - body    : 'Jost', 'Futura', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 16px (petites capitales gravées)
  - Tracking display : tracking-widest (0.1em à 0.15em) obligatoire en titrage
  - Accents / Styles : Signature minérale et bijouterie

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@300..700&family=Jost:ital,wght@0,100..900;1,100..900&display=swap

Caractère   : petites capitales gravées en display, géométrique doux en corps.
Tonalité    : minéral et cher.
Palettes recommandées : Marbre Noir & Or, Saphir & Argent
Penser à ce pairing quand : immobilier de luxe, horlogerie technique haut de gamme.

#### Serif Massif & Sans Précis
Display     : Fraunces — 900, non-italique
Body        : Sora — 400
Type        : Fraunces : Variable (axes: wght 100..900, opsz 9..144, WONK 0..1, SOFT 0..100, ital 0..1) | Sora : Variable (axes: wght 100..800)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Fraunces', Georgia, serif
  - body    : 'Sora', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 24px en display (version optique display dès 36px)
  - Tracking display : tracking-tight (-0.02em) en display gras, normal en graisse légère
  - Accents / Styles : Axe WONK et italique activables pour un effet artisanal organique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Sora:wght@100..800&display=swap

Caractère   : serif très épais et affirmé, sans-serif géométrique précis en corps pour contrebalancer.
Tonalité    : précieux et affirmé.
Palettes recommandées : Émeraude & Or Massif
Penser à ce pairing quand : joaillerie/horlogerie, resort 5 étoiles qui assume une vraie opulence.

#### Gravure Romaine Libre
Display     : Cinzel — 600-900, majuscules
Body        : Cormorant — 400-500
Type        : Cinzel : Variable (axes: wght 400..900) | Cormorant : Variable (axes: wght 300..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Cinzel', 'Times New Roman', Georgia, serif
  - body    : 'Cormorant', Garamond, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 20px (gravure lapidaire romaine, majuscules recommandées)
  - Tracking display : tracking-wider (0.05em à 0.1em)
  - Accents / Styles : Inscriptions solennelles, cérémonies, prestige classique

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap

Caractère   : capitales gravées façon inscription romaine, alternative libre à Trajan Pro (non libre, non disponible sur Google Fonts).
Tonalité    : institutionnel, antique, gravé.
Palettes recommandées : Marbre Noir & Or, Bordeaux & Or Profond
Penser à ce pairing quand : cérémonie/intronisation, institution qui veut un registre gravé/ historique sans dépendre d'une police propriétaire.

#### Ornemental Cérémoniel Libre
Display     : Cinzel Decorative — 700-900, réservé aux titres courts
Body        : Cormorant — 400-500
Type        : Cinzel Decorative : Statique (graisses: 400, 700, 900) | Cormorant : Variable (axes: wght 300..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Cinzel Decorative', 'Cinzel', serif
  - body    : 'Cormorant', Garamond, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 28px (titres très courts — 2-4 mots max, jamais de corps)
  - Tracking display : tracking-wide (0.03em)
  - Accents / Styles : Empattements ornementaux dramatiques

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap

Caractère   : empattements décoratifs élaborés, très marqué — jamais en corps de texte, titre uniquement (2-4 mots max).
Tonalité    : cérémoniel, ornemental, solennel.
Palettes recommandées : Nuit & Grenat, Pourpre Impérial & Or
Penser à ce pairing quand : flyer événementiel/église/cérémonie officielle qui veut un titre gravé/orné plutôt qu'un display bold générique.

#### Nouvelle entrée typo — Grotesque Institutionnel Libre
Display     : Plus Jakarta Sans — 600-800
Body        : Plus Jakarta Sans — 400-500
Type        : Variable (axes: wght 200..800, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Plus Jakarta Sans', system-ui, sans-serif
  - body    : 'Plus Jakarta Sans', system-ui, sans-serif

Règles DA & Rendu :
  - Display min-size : 13px (géométrique humaniste aux angles subtilement adoucis)
  - Tracking display : normal en corps, -0.02em en grands titres H1/H2
  - Accents / Styles : Moderne, institutionnel chaleureux et polyvalent

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap

Caractère   : géométrique humaniste, une seule famille du display au body — variante libre/gratuite d'un grotesque institutionnel. Conçue par Gumitra Rahayu (Tokotype) pour l'identité de la ville de Jakarta (2020) — origine institutionnelle réelle, pas un nom marketing vide.
Tonalité    : moderne, propre, légèrement chaleureux pour un géométrique (coins doux).
Palettes recommandées : Craie & Cobalt, Coquille & Pétrole
Penser à ce pairing quand : SaaS/institutionnel qui veut un grotesque géométrique propre sans payer de licence, alternative crédible à Inter/Sora quand il faut un peu plus de personnalité géométrique sans sortir du gratuit.

#### Display Antiqua & Sans Précis
Display     : EB Garamond — 700-900, italique
Body        : IBM Plex Sans — 400
Type        : EB Garamond : Variable (axes: wght 400..800, ital 0..1) | IBM Plex Sans : Statique (graisses: 100, 200, 300, 400, 500, 600, 700 + italiques)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'EB Garamond', Garamond, 'Times New Roman', serif
  - body    : 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif

Règles DA & Rendu :
  - Display min-size : 18px (corps érudit) / 28px (display humaniste XVIe)
  - Tracking display : normal en corps, -0.015em en grand titre
  - Accents / Styles : Italique magnifique et historique pour éditions d’art et maisons de prestige

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap

Caractère   : garamond historique à haut contraste en display (EB Garamond — réf : fonte du XVIe siècle), sans-serif technique rigoureux en corps — tension temporelle maximale (Renaissance vs technique contemporain).
Tonalité    : opulent et érudit, plus studieux/académique que Gravure Romaine Libre (Cinzel — plus monumental/inscriptions), moins délicat que Cormorant Garamond (Section 4.2 — moins de contraste).
Palettes recommandées : Marbre Noir & Or, Bordeaux & Or Profond, Poussière d'Or & Ombre (nouvelle)
Penser à ce pairing quand : maison d'édition/presses universitaires premium, musée/institution culturelle qui assume une référence typographique historique réelle (pas juste l'esthétique du vieux).
Éviter avec : Gravure Romaine Libre (Cinzel — même territoire historique premium ; Cinzel est monumental/inscriptions romaines, EB Garamond est éditorial/manuscrit renaissant — choisir selon la nature du sujet).

#### Serif Moderne Froid & Mono Précis
Display     : Bodoni Moda — 500-600 (graisse modérée — moins théâtral que la version 4.7 Série Théâtral)
Body        : JetBrains Mono — 400
Type        : Bodoni Moda : Variable (axes: wght 400..900, opsz 6..96, ital 0..1) | JetBrains Mono : Variable (axes: wght 100..800, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Bodoni Moda', 'Bodoni MT', Didot, Georgia, serif
  - body    : 'JetBrains Mono', Consolas, 'Courier New', monospace

Règles DA & Rendu :
  - Display min-size : 28px (titrage luxe / haute couture uniquement)
  - Tracking display : tracking-tight (-0.02em) et interlignage aéré obligatoire
  - Accents / Styles : Contraste pleins/déliés maximaliste, empattements horizontaux fins

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap

Caractère   : Bodoni en graisse modérée (pas 900) change totalement de registre — le contraste pleins/déliés reste présent mais sans dominer ; le mono en corps crée une tension précision/élégance inédite.
Tonalité    : luxe technique, horlogerie de précision — l'élégance du Bodoni au service de la rigueur, pas du théâtral.
Palettes recommandées : Saphir & Argent, Onyx & Platine (nouvelle), Nuit Polaire & Cuivre
Penser à ce pairing quand : horlogerie haute gamme qui veut une référence typographique précieuse sans l'opulence théâtrale ; instrument de mesure/analyse premium qui veut du luxe froid.
Éviter avec : Serif Théâtral & Sans Discret (Bodoni Moda 700-900 — même police, intention opposée ; la différence est dans la graisse et le body, pas dans la police elle-même — noter explicitement ce choix dans le brief pour éviter la confusion).

#### Capitales Monumentales & Serif Fins
Display     : Big Shoulders Display — 800-900
Body        : Cormorant — 400
Type        : Big Shoulders Display : Variable (axes: wght 100..900) | Cormorant : Variable (axes: wght 300..700, ital 0..1)
Source      : Google Fonts — licence OFL, VÉRIFIÉ

CSS Stacks  :
  - display : 'Big Shoulders Display', Impact, 'Arial Black', sans-serif
  - body    : 'Cormorant', Garamond, 'Times New Roman', serif

Règles DA & Rendu :
  - Display min-size : 36px (ultra-condensé monumental architectural)
  - Tracking display : tracking-tight (-0.02em) à normal
  - Accents / Styles : Occupation maximale de l’espace vertical sur hero headers

Google Fonts Embed :
https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@100..900&family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap

Caractère   : display ultra-condensé monumental (Big Shoulders — référence architecture industrielle de Chicago) couplé à un serif très fin en corps — contraste de chasse extrême (très condensé vs proportions classiques).
Tonalité    : imposant et architecturé, le titre prend l'espace vertical, le corps s'inscrit dans un registre différent.
Palettes recommandées : Marbre Vert Impérial, Émeraude & Or Massif, Laque Rouge & Or Brûlé (nouvelle)
Penser à ce pairing quand : architecture de prestige, hôtel de luxe qui assume un titre monumental ancré dans une référence urbaine/architecturale ; marque premium qui veut de la hauteur et de la verticalité plutôt que de la largeur.
Éviter avec : Display Brut & Sans Direct (Anton — même condensé impact ; Anton est brut/sport, Big Shoulders est architectural/premium — deux registres opposés malgré la ressemblance formelle des displays condensés). --- ``` Si le sujet réel du projet (Agents_Direction_Artistique.md Section 2) a une identité typographique propre à trouver — pas seulement une couleur — composer un pairing original plutôt que de forcer une entrée existante. Méthode : 1. Choisir UN display qui porte une vraie personnalité, cohérente avec la signature du projet (Agents_Direction_Artistique.md Section 5, Passe 1 — SIGNATURE) 2. Choisir un body complémentaire — jamais la même famille par réflexe, sauf choix minimaliste assumé (voir 4.6 comme exemple de ce choix volontaire) 3. Vérifier contre Agents_Direction_Artistique.md Section 3bis — jamais Inter/système par défaut sans avoir consciemment écarté d'autres options 4. Ajouter le nouveau pairing à la bibliothèque (Section 4) une fois validé ```

---

## 5. COMPOSITION D'UN PAIRING SUR-MESURE (si la bibliothèque ne convient pas)

```
Si le sujet réel du projet (Agents_Direction_Artistique.md Section 2) a une identité typographique
propre à trouver — pas seulement une couleur — composer un pairing original plutôt que de forcer
une entrée existante.

Méthode :
1. Choisir UN display qui porte une vraie personnalité, cohérente avec la signature du projet
   (Agents_Direction_Artistique.md Section 5, Passe 1 — SIGNATURE)
2. Choisir un body complémentaire — jamais la même famille par réflexe, sauf choix minimaliste
   assumé (voir 4.6 comme exemple de ce choix volontaire)
3. Vérifier contre Agents_Direction_Artistique.md Section 3bis — jamais Inter/système par défaut
   sans avoir consciemment écarté d'autres options
4. Ajouter le nouveau pairing à la bibliothèque (Section 4) une fois validé
```

---

## 6. LIEN AVEC LES AUTRES FICHIERS

```
Agents_Direction_Artistique.md Section 5, Passe 1 (TYPO) → piocher ici en premier, sinon composer
sur-mesure (Section 5 de ce fichier).

Agents_Bibliotheque_Palettes.md → chaque pairing recommande des palettes précises de la même
tonalité (Section 4). Une palette peut aussi suggérer un pairing d'ici — croisement dans les deux
sens, jamais une combinaison imposée sans confrontation au sujet réel.

Agents_Design_Reference.md Section 4 (typographie d'une réf analysée) → une réf donne un PRINCIPE
de pairing (contraste, graisse, ambiance), jamais le nom de police exact à copier systématiquement
— cette bibliothèque-ci donne des polices réelles prêtes à l'emploi, toujours à confronter au sujet.

Agents_Standards_Interface_Web.md Section 4 (Contenu) → chiffres tabulaires, guillemets
typographiques, ellipse réelle : ces règles s'appliquent quel que soit le pairing choisi ici.
```

---

## 7. CHECKLIST AVANT D'ASSIGNER UN PAIRING À UN PROJET

```
□ Pairing candidat pas déjà utilisé sur un projet récent (à l'appréciation du contexte disponible)
□ Si répétition : exception cohérence de marque explicitement validée par le client
□ Pairing confronté au sujet réel du brief — pas choisi au hasard dans la liste
□ Vérifié contre Agents_Direction_Artistique.md Section 3bis — pas de défaut Tailwind/système non réfléchi
□ Palette(s) recommandée(s) cohérente(s) avec le choix fait dans Agents_Bibliotheque_Palettes.md
□ Si aucune entrée ne convient : pairing sur-mesure composé (Section 5) plutôt que forcé
□ Toutes les polices citées vérifiées comme réellement disponibles (Google Fonts ou équivalent libre)
□ CSS Fallback Stacks intégrées pour neutraliser tout CLS (Cumulative Layout Shift)
□ Directives de performance respectées : display=swap, preconnect Google Fonts, ou Variable Fonts
□ Contraintes d'échelle respectées : min-size respecté pour les displays à fort contraste
```
