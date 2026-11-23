---
agent: Agents_Bibliotheque_Palettes
commande: palette:browse
declencheurs:
  - bibliothèque de palettes
  - choix de couleurs
  - 7 familles chromatiques
  - harmonie de couleurs
action: Répertoire central de palettes couleur anti-répétition réparties en 7 familles de tonalités
---

## ⚙️ AGENT PROTOCOL — LIRE EN PREMIER, AVANT TOUT

Tu es directeur artistique senior chargé de la gestion des palettes couleur de l'atelier. Ce fichier est ta seule source de vérité pour le choix de palette sur tout projet.

RÈGLES ABSOLUES :
1. Lis ce document EN ENTIER avant de choisir une palette pour un projet.
2. Une palette de cette bibliothèque = point de départ à adapter, jamais des HEX à copier-coller tels quels sans les confronter au sujet réel du brief.
3. Si aucune palette de la bibliothèque ne convient au sujet réel → générer une palette sur-mesure (Section 5), jamais forcer une palette existante qui ne correspond pas.
4. Croiser systématiquement le choix avec Agents_Direction_Artistique.md Section 3 (3 looks génériques IA) — une palette d'ici ne doit jamais reconstituer un des 3 looks proscrits.

CONFIRMATION OBLIGATOIRE avant de commencer :
"PROTOCOLE ACTIF — BIBLIOTHÈQUE PALETTES. Prêt."

---

# AGENTS_BIBLIOTHEQUE_PALETTES.md
# Bibliothèque centrale de palettes couleur — anti-répétition inter-projets

## 1. RÔLE ET OBJECTIF

Ce fichier est le stock de couleurs de l'atelier : une bibliothèque de palettes nommées, prêtes à être
adaptées, organisées par tonalité plutôt que par type de projet (même logique anti-silo que
Agents_Design_Reference.md Section 4quinquies — une palette "chaude & terreuse" convient aussi
bien à un SaaS qu'à un portfolio, selon le sujet réel).

## 2. RÈGLE ANTI-RÉPÉTITION

```
Si plusieurs projets appartiennent au MÊME client/à la MÊME marque (ex: site vitrine + dashboard
interne de la même entreprise) → la répétition est un choix assumé, pas un défaut. Le signaler
explicitement au client comme un choix voulu ("répétition volontaire — cohérence marque X").

Si le client ne précise rien → toujours partir du principe qu'il s'agit d'un projet distinct,
donc palette distincte.
```

## 3. FORMAT D'UNE ENTRÉE

```
### [Nom évocateur — 2 mots max, français]
Fond      : #HEX — [nom de la teinte]
Texte     : #HEX — [nom de la teinte]
Accent 1  : #HEX — [nom de la teinte]
Accent 2  : #HEX — [nom de la teinte] (optionnel)
Support   : #HEX — [nom de la teinte] (surfaces/cartes, optionnel)
Tonalité  : [1 ligne — ce que la palette évoque]
Penser à cette palette quand : [2-3 déclencheurs concrets — mot-clé client, secteur, matériau
  évoqué dans le brief, contrainte de marque proche — pas juste un mood abstrait]
```

---

## 4. BIBLIOTHÈQUE DE PALETTES

Organisée par tonalité (pas par type de projet — voir Section 1). Extensible : ajouter de nouvelles
entrées au fil des projets, jamais réécrire les existantes sauf correction.

### 4.1 SOMBRES & FEUTRÉES

#### Ardoise & Cuivre
Fond : #1B1E24 — anthracite bleuté
Texte : #EDEAE4 — blanc cassé chaud
Accent 1 : #B5652D — cuivre oxydé
Accent 2 : #5C6B73 — gris-bleu mat
Tonalité : sérieux, feutré, légèrement industriel — convient à un sujet technique qui doit rester chaleureux.
Penser à cette palette quand : client dit "sérieux mais pas froid" ; secteur ingénierie/BTP/manufacturing
qui veut éviter le bleu corporate plat ; brief mentionne métal, atelier, outillage.

#### Encre & Safran
Fond : #14151A — noir encre
Texte : #E8E6E0 — ivoire pâle
Accent 1 : #D8A03B — safran doux
Support : #23252C — carte sur fond noir
Tonalité : premium discret, contraste doux — évite l'effet "dark mode générique" grâce à l'accent chaud.
Penser à cette palette quand : client demande un dark mode mais craint le look "trop tech générique" ;
secteur éditorial/media premium, épices/gastronomie, produit haut de gamme qui veut un accent chaud sans tomber dans l'or clinquant.

#### Basalte & Menthe
Fond : #17191C — basalte
Texte : #E4E7E5 — blanc verdâtre pâle
Accent 1 : #4E9A82 — vert menthe éteint
Accent 2 : #8A8F8C — gris pierre
Tonalité : calme, presque clinique mais adouci par le vert — bon pour un sujet qui doit inspirer confiance sans froideur.
Penser à cette palette quand : secteur santé/bien-être/thérapie qui veut du sombre sans donner un
ton anxiogène ; client mentionne "apaisant" mais refuse le fond clair classique du secteur santé.

#### Nuit & Grenat
Fond : #1A1418 — brun-noir profond
Texte : #F1E9E9 — blanc rosé
Accent 1 : #7A2E36 — grenat sourd
Support : #2A2226 — carte
Tonalité : dramatique et feutré, sans tomber dans le rouge vif générique — pour un sujet qui doit intriguer.
Penser à cette palette quand : secteur culturel/événementiel/vin-gastronomie premium ; brief demande
"mystérieux" ou "intrigant" sans verser dans l'horreur/agressif.

#### Graphite & Laiton
Fond : #1C1C1E — graphite
Texte : #EAE7DD — blanc cassé
Accent 1 : #A9862F — laiton mat
Accent 2 : #3A3A3D — gris moyen
Tonalité : sobre et haut de gamme, plus retenu que l'or — pour un sujet institutionnel qui veut rester discret.
Penser à cette palette quand : secteur juridique/finance/conseil qui veut un signal premium sans
tape-à-l'œil ; client mentionne "doré" mais le brief est institutionnel donc l'or plein serait too much.

#### Suie & Jade
Fond : #191B18 — suie verdâtre
Texte : #E9EDE6 — blanc jade pâle
Accent 1 : #3D8168 — jade profond
Accent 2 : #4A4E46 — gris olive
Tonalité : sombre et précieux, plus organique que le vert menthe — évoque la pierre fine plutôt que le végétal.
Penser à cette palette quand : secteur joaillerie/artisanat de précision/botanique haut de gamme ;
brief évoque une matière précieuse (pierre, bois sombre) plutôt qu'un simple "vert nature".

#### Nuit & Miel
Fond : #16130F — brun-noir chaud
Texte : #F3EADD — blanc miel
Accent 1 : #C89A3E — miel doré
Support : #241F18 — carte
Tonalité : chaleureux et enveloppant, plus doux que l'or/laiton — évoque une matière comestible/naturelle.
Penser à cette palette quand : secteur food premium (miel, thé, spiritueux), bien-être naturel,
brief mentionne "doux", "réconfortant", veut du sombre sans froideur.

#### Ébène & Corail Sourd
Fond : #15161A — ébène bleuté
Texte : #E7E9EC — blanc froid pâle
Accent 1 : #B85A52 — corail sourd (désaturé, pas le corail vif générique)
Accent 2 : #3E4247 — gris ardoise
Tonalité : sombre et sophistiqué, un accent chaud discret qui réchauffe sans dominer.
Penser à cette palette quand : secteur mode/lifestyle premium qui veut un accent chaud mais
discret ; client aime le corail mais le brief est sombre/haut de gamme, pas estival/vif.

#### Basalte Émietté
Fond : #201F1E — basalte quasi-noir
Texte : #E9E7E3 — blanc cassé froid
Accent 1 : #6B6864 — gris pierre moyen
Accent 2 : #383633 — gris-brun sombre
Tonalité : minéral pur, mat et dense — sans accent coloré, tout repose sur les nuances de gris/noir.
Penser à cette palette quand : secteur industrie lourde/matériaux/BTP qui veut un sombre neutre
sans le moindre accent chaud ; client dit "brut, sans fioriture".

#### Cuivre Tissé
Fond : #1A1512 — brun-noir chaud
Texte : #F3E8DC — ivoire chaud
Accent 1 : #C97A4A — cuivre saturé (plus riche/dominant que l'accent discret d'Ardoise & Cuivre —
  ici le cuivre EST la surface, pas juste un accent)
Accent 2 : #8A4E2C — cuivre foncé
Tonalité : chaud et artisanal, le métal comme matière principale plutôt que comme simple touche.
Penser à cette palette quand : métallerie/orfèvrerie/architecture d'intérieur qui veut le cuivre
comme sujet central, pas comme détail ; à distinguer d'Ardoise & Cuivre (Section 4.1) où le cuivre
reste un accent discret sur un fond neutre.

#### Mousse Électrique
Fond : #131412 — noir humide
Texte : #EAEDE7 — blanc verdâtre
Accent 1 : #4FB83E — vert mousse vif (⚠️ garder mat/naturel, ne JAMAIS saturer au maximum — sinon
  reconstitue le look "Dark & Acid" proscrit, Direction Artistique Section 3)
Accent 2 : #2A2C28 — gris-vert sombre
Tonalité : contraste fort noir mouillé / vert vif, organique plutôt que technique.
Penser à cette palette quand : sujet botanique/nature sauvage qui veut un vrai contraste vif
justifié par la matière réelle (mousse, végétal), jamais pour un accent tech générique.

#### Collines & Ombre
Fond : #10160F — vert-noir profond
Texte : #E6EBE2 — blanc verdâtre pâle
Accent 1 : #3C6B3E — vert velouté moyen
Accent 2 : #7C9C6E — vert clair (élément isolé, à utiliser avec parcimonie)
Tonalité : dramatique et feutré, paysage plutôt que motif — un seul vert clair isolé sur un fond
de verts sombres crée un point focal naturel.
Penser à cette palette quand : agriculture/vignoble/nature préservée qui veut un sombre habité
plutôt que clinique ; sujet qui a un vrai "point unique" à mettre en valeur (produit, personne)
sur un fond profond.

#### 4.1 SOMBRES & FEUTRÉES — nouvelles entrées du 26/09/26 du 26/09/26

Cendre & Étain Froid
Fond : #1A1C20 — gris-bleu quasi-noir froid
Texte : #E2E4E8 — blanc légèrement bleuté
Accent 1 : #7A8A96 — étain froid moyen
Accent 2 : #303840 — gris-bleu sombre (support/cartes)
Tonalité : minéral froid monochrome, sans chaleur d'aucune sorte — plus industriel et désaturé que Basalte Émietté (qui reste neutre/brun), ici la froideur est la matière elle-même.
Penser à cette palette quand : architecture brutaliste, infrastructures, industrie lourde froide (eau, traitement, énergie grise) ; brief dit "acier, béton, froid assumé" — à distinguer de Basalte Émietté (Section 4.1) qui reste brun/neutre, ici le bleu-gris est dominant.

Velours & Amande
Fond : #1C1714 — brun-noir velouté
Texte : #EEE6D8 — blanc amande chaud
Accent 1 : #A08060 — amande grillée (brun doré désaturé)
Accent 2 : #352C24 — brun-tabac support
Tonalité : doux et enveloppant, matière textile proche du velours brun — plus doux que Argile & Moutarde (moutarde dominante, plus affirmée), plus discret que Nuit & Miel (miel plus lumineux/doré).
Penser à cette palette quand : maroquinerie/intérieur textile/mobilier ; brief évoque le toucher, la douceur d'un matériau épais et chaud (velours, cuir patiné) plutôt qu'un métal ou une épice.

Brume Noire & Lilas
Fond : #17151C — noir légèrement violacé
Texte : #E8E3EE — blanc lilas très pâle
Accent 1 : #7A6A9A — lilas sourd profond
Accent 2 : #2E2838 — violet-gris sombre (cartes/support)
Tonalité : sombre et légèrement onirique, sans tomber dans le magenta — moins saturé que Nuit & Magenta Sourd (Section 4.5), plus feutré et intérieur.
Penser à cette palette quand : éditorial littéraire, parfumerie niche, secteur créatif qui veut un sombre violet sans éclat ; client veut "nocturne et doux" pas "festif et saturé".

Forêt Profonde & Or Discret
Fond : #111A12 — vert-noir forestier quasi total
Texte : #E4EBE2 — blanc verdâtre pâle
Accent 1 : #9A8040 — or forestier très sourd (feuille morte, pas métal clinquant)
Accent 2 : #2A3828 — vert sombre support
Tonalité : profond et organique, l'or comme lumière filtrée en sous-bois — différent de Suie & Jade (jade/pierre précieuse) et de Collines & Ombre (relief/paysage) ; ici l'or est végétal, pas minéral.
Penser à cette palette quand : secteur luxe naturel (cosmétique premium forêt, herboristerie haut de gamme, whisky single malt boisé) ; brief évoque une matière végétale précieuse, pas juste "vert nature".


### 4.2 CLAIRES & AÉRÉES

#### Craie & Cobalt
Fond : #F6F5F1 — blanc craie
Texte : #23262B — encre presque noire
Accent 1 : #2857A6 — bleu cobalt
Accent 2 : #C7C2B8 — beige gris clair
Tonalité : net, confiant, professionnel sans être froid — bon point de départ pour un sujet qui doit rassurer vite.
Penser à cette palette quand : SaaS B2B/fintech qui veut un bleu confiant mais pas corporate plat ;
client dit "je veux que ça inspire confiance" sans référence précise.

#### Balcon & Tulipe
Fond : #EDE8DE — ivoire tuile clair
Texte : #2D3A18 — brun-vert profond (contraste WCAG AAA sur fond #EDE8DE)
Accent 1 : #E8A9B7 — rose tulipe pastel
Accent 2 : #70C0FC — bleu ciel/jacinthe désaturé
Support : #C3875A — terracotta de pot, très désaturé — ⚠️ modérément proche du terracotta
proscrit ( #D97757) : à garder STRICTEMENT en touche mineure (bordure, détail), jamais
en accent principal ni couplé seul au fond ivoire (recréerait directement le Look 1 proscrit)
Tonalité : lumineux, printanier, pastel multicolore — la force est dans le cumul de 2 accents
doux qui cohabitent, pas dans un accent unique.
Penser à cette palette quand : fleuriste/jardinerie/bien-être qui veut une vraie fraîcheur
printanière multi-teintes ; se distingue d'Ivoire & Pin (un seul accent vert) et de Craie &
Sauge Pâle (un seul accent sauge) par ce cumul rose+bleu.
Éviter avec : ne jamais isoler Fond + Support seuls sans les accents 1/2 — ce duo seul recrée le
Look 1 (Cream & Terracotta), Direction_Artistique Section 3.

#### Lin & Rouille
Fond : #F1ECE2 — lin naturel
Texte : #2E2A24 — brun très sombre
Accent 1 : #A85A32 — rouille — ⚠️ rester à distance du terracotta générique (#D97757), teinte plus brune/sombre ici
Support : #E4DCCB — carte lin foncé
Tonalité : artisanal, tactile — attention à ne pas glisser vers le look "Cream & Terracotta" proscrit (Direction Artistique Section 3) : garder ce brun-rouille plus sourd, jamais l'orange corail vif.
Penser à cette palette quand : secteur artisanat/textile/céramique ; brief évoque une matière
naturelle tissée/tannée ; client aime le terracotta mais faut s'en distinguer du look IA générique.

#### Ivoire & Pin
Fond : #F7F5EF — ivoire
Texte : #262A24 — vert-noir
Accent 1 : #3F5B44 — vert pin profond
Accent 2 : #B8AE95 — beige doux
Tonalité : naturel, apaisant, sérieux sans être austère — bon pour un sujet lié à la santé, l'éducation, le durable.
Penser à cette palette quand : secteur santé/éducation/écologie ; client mentionne "naturel",
"durable", "sain" ; brief a un vrai ancrage forêt/nature (pas juste "vert" décoratif).

#### Nacre & Prune
Fond : #F5F2F5 — blanc nacré
Texte : #2A2430 — aubergine presque noire
Accent 1 : #6B3F63 — prune
Accent 2 : #D8D2D8 — gris lavande clair
Tonalité : doux mais affirmé, féminin sans être un stéréotype rose — utile pour un sujet créatif ou lifestyle.
Penser à cette palette quand : secteur beauté/lifestyle/créatif qui veut du doux sans tomber dans
le rose bébé cliché ; client demande "féminin mais pas cliché".

#### Coquille & Pétrole
Fond : #F3F0EA — coquille d'œuf
Texte : #1E2A2C — noir bleuté
Accent 1 : #1F5C63 — bleu pétrole
Support : #E1DCCF — carte
Tonalité : frais et posé, plus original qu'un bleu marine classique — bon pour la finance/tech qui veut éviter le bleu corporate générique.
Penser à cette palette quand : fintech/assurance/légal qui veut un bleu mais refuse le bleu marine
"corporate template" ; client dit "sérieux mais pas ennuyeux".

#### Craie & Sauge Pâle
Fond : #F5F3ED — craie chaude
Texte : #24261F — vert-noir profond
Accent 1 : #7C8A6A — sauge pâle
Accent 2 : #C9C2AC — beige sable
Tonalité : léger, calme, presque botanique sans être criard — plus doux que le vert menthe clinique.
Penser à cette palette quand : secteur bien-être/spa/thérapie douce ; brief demande "apaisant"
mais évite le vert menthe déjà très vu en santé digitale.

#### Lin & Bleu Poudre
Fond : #F2EEE6 — lin clair
Texte : #24272C — bleu-noir
Accent 1 : #6E8DA6 — bleu poudré
Accent 2 : #D3CBB8 — beige lin foncé
Tonalité : doux et posé, un bleu jamais criard — bon compromis entre chaleur (fond) et sérieux (accent).
Penser à cette palette quand : secteur éducation/famille/services publics qui veut rassurer sans
être froid ; client refuse le bleu vif institutionnel classique.

#### Soie Ivoire
Fond : #F2ECDD — ivoire soyeux
Texte : #2A2519 — brun très sombre
Accent 1 : #C9B98A — doré pâle (reflet de la soie)
Support : #E8DFC8 — carte ivoire foncé
Tonalité : luxueux et doux, lumineux sans être froid — la matière (soie) porte toute la sophistication.
Penser à cette palette quand : secteur mode/mariage/textile haut de gamme qui veut un blanc chaud
plutôt qu'un blanc clinique ; brief évoque une matière soyeuse/fluide.

#### 4.2 CLAIRES & AÉRÉES — nouvelles  du 26/09/26

Albâtre & Terracotta Distant
Fond : #F8F5F0 — blanc albâtre très pur
Texte : #28221C — brun-noir
Accent 1 : #6A8A7A — vert sauge bleuté (accent principal dominant)
Accent 2 : #A85A3C — terracotta repoussé en position très secondaire (⚠️ jamais en accent principal — risque Look 1 proscrit ; réservé à un détail isolé : icône, trait de séparation)
Tonalité : aéré et propre, le vert sauge bleuté étant l'accent réel — le terracotta n'est là qu'en clin d'œil discret justifié par un élément concret du brief (brique, argile réelle), jamais comme couleur de marque.
Penser à cette palette quand : architecture/intérieur qui mêle végétal et matières chaudes ; client dit "naturel et lumineux" mais veut un fond plus pur qu'un fond lin/ivoire déjà utilisé.
Éviter avec : Lin & Rouille, Balcon & Tulipe (fond ivoire similaire — varier les fonds entre projets proches).

Givre & Azur
Fond : #F0F4F7 — blanc givre légèrement bleuté
Texte : #1C2630 — bleu-noir
Accent 1 : #4A8CC4 — azur moyen (plus chaud/lumineux que le bleu cobalt de Craie & Cobalt, moins froid que le bleu glacier de Glacier & Ambre)
Accent 2 : #B8CAD6 — gris-bleu clair (surfaces secondaires)
Tonalité : aéré et clair, fond légèrement bleuté plutôt que neutre — le fond participe à la couleur, pas juste le texte/accent.
Penser à cette palette quand : secteur médical/assurance/santé digitale qui veut un fond clair légèrement coloré plutôt que blanc pur neutre ; brief implique un vrai rapport à l'eau/la propreté/le froid maîtrisé.
Éviter avec : Glacier & Ambre (même territoire fond clair/bleu — choisir selon si on veut un accent chaud ambre ou un accent azur froid).

Porcelaine & Encre de Chine
Fond : #F6F4F1 — blanc porcelaine très légèrement chaud
Texte : #181614 — noir encre de Chine (presque pur)
Accent 1 : #1A1614 — noir (utilisé en aplat graphique, même valeur que le texte — minimalisme total)
Support : #EAE6E0 — carte porcelaine foncée
Tonalité : bichromie pure, fond porcelaine + encre — la matière de la céramique portée dans le digital ; différent de Brume & Noir (fond plus froid, gris) et de Lin & Anthracite (fond lin chaud, accent gris moyen), ici quasi-bichromie absolue warm.
Penser à cette palette quand : céramique/poterie artisanale, éditorial luxe sans couleur assumé, portfolio typographique qui veut une bichromie chaude et non froide.

Fleur de Sel & Ardoise
Fond : #F2F1EE — blanc fleur de sel (quasi-neutre, très légèrement chaud)
Texte : #2C2E34 — ardoise sombre
Accent 1 : #6B7280 — gris ardoise moyen
Accent 2 : #C4A87A — sable doré discret (option gastronomie seulement, omissible)
Tonalité : neutre habité et propre, entre le minimalisme et la gastronomie — le gris ardoise comme accent principal, tout en discrétion.
Penser à cette palette quand : gastronomie fine/restaurant étoilé qui veut un blanc propre sans froideur clinique ; chef/traiteur qui refuse les palettes "chaleureuses/terreuses" déjà très associées au secteur food artisanal.

### 4.3 CHAUDES & TERREUSES

#### Argile & Moutarde
Fond : #2B211B — brun argile sombre
Texte : #F2E9DA — crème chaud
Accent 1 : #C08A2E — moutarde
Accent 2 : #7A5B45 — brun cuir
Tonalité : chaleureux et affirmé, texture "matière" — pour un sujet artisanal, food, ou culturel.
Penser à cette palette quand : secteur artisanat/cuir/food craft ; brief évoque le fait-main,
l'atelier, une matière brute travaillée à la main.

#### Brique & Sauge
Fond : #F4EDE4 — beige clair
Texte : #2C2620 — brun très sombre
Accent 1 : #A34E3A — brique
Accent 2 : #7C8A6E — sauge
Tonalité : équilibre chaud/froid, terrien mais pas triste — bon pour hospitalité, artisanat, agriculture.
Penser à cette palette quand : secteur hôtellerie/agriculture/gîte rural ; client veut "terrien"
et "accueillant" sans tomber dans le look rustique cliché (bois brut + serif décoratif).

#### Terracotta Sourd & Encre
Fond : #221D1A — brun-noir
Texte : #ECE4D8 — blanc chaud
Accent 1 : #8C4A34 — terracotta sourd — ⚠️ plus sombre/désaturé que le #D97757 générique, à vérifier à l'œil qu'on s'en distingue clairement
Support : #33291F — carte
Tonalité : chaud et enveloppant sans être le corail Claude — utile si le client aime le terracotta mais qu'il faut s'en distinguer visuellement.
Penser à cette palette quand : client demande explicitement du terracotta/orange chaud — sert
d'alternative crédible qui s'en distingue visuellement plutôt que de refuser le brief.

#### Sable & Indigo
Fond : #EFE7D8 — sable
Texte : #23222E — indigo presque noir
Accent 1 : #33366B — indigo profond
Accent 2 : #B8A77E — beige doré
Tonalité : contraste chaud/froid marqué, élégant — pour un sujet qui mélange tradition et modernité.
Penser à cette palette quand : secteur mode/textile/culture qui mélange héritage et modernité ;
brief mentionne artisanat traditionnel réinterprété pour un public contemporain.

#### Ocre & Charbon
Fond : #1D1B18 — charbon chaud
Texte : #F0E6D2 — crème
Accent 1 : #C97D2E — ocre
Accent 2 : #4A463D — brun-gris
Tonalité : robuste, presque minéral — pour un sujet artisanat, BTP, industrie assumée.
Penser à cette palette quand : secteur BTP/industrie/outillage qui assume son côté brut plutôt
que de l'adoucir ; client dit "robuste", "solide", "sans chichi".

#### Terre Cuite & Olive
Fond : #F3E9DC — beige terre cuite clair
Texte : #2A241C — brun-noir
Accent 1 : #6E7A4E — olive profond
Accent 2 : #B36B45 — terre cuite (plus orangée que la rouille, distincte du terracotta générique)
Tonalité : méditerranéen, chaleureux et vivant — évoque l'huile d'olive et la céramique plutôt que le désert.
Penser à cette palette quand : secteur gastronomie méditerranéenne/huile d'olive/céramique ;
brief évoque le sud de l'Europe ou un terroir précis (pas une chaleur générique).

#### Cannelle & Nuit
Fond : #1E1712 — brun-noir chaud
Texte : #F1E6D6 — crème chaud
Accent 1 : #B06B3A — cannelle
Accent 2 : #4A3B2C — brun tabac
Tonalité : épicé et enveloppant, plus feutré que l'ocre — évoque une matière comestible chaude.
Penser à cette palette quand : secteur épices/café/thé/gastronomie chaude ; client veut un
sombre chaleureux avec une vraie identité olfactive/gustative évoquée.

#### Miel & Anthracite
Fond : #F3EAD9 — miel très clair
Texte : #232420 — anthracite chaud
Accent 1 : #C9932E — miel doré
Accent 2 : #5A5347 — brun-gris
Tonalité : lumineux et doux, plus doré que l'ocre — pour un sujet qui veut de la chaleur sans le brun sombre dominant.
Penser à cette palette quand : secteur bien-être/naturel/cosmétique bio ; brief veut un fond
clair chaud avec un accent doré, pas un fond sombre type "Argile & Moutarde".

#### Dune & Ciel
Fond : #E8C48A — sable doré
Texte : #2A2016 — brun très sombre
Accent 1 : #1C6FB0 — bleu ciel profond (contraste net, pas un accent chaud)
Accent 2 : #B9884F — grès/pierre du désert
Tonalité : contraste chaud/froid très net et lumineux — le sable comme fond, le ciel comme respiration.
Penser à cette palette quand : voyage/tourisme désertique réel, architecture méditerranéenne ou
moyen-orientale ; client veut un contraste chaud-froid franc plutôt qu'une palette mono-température.
Éviter avec : ne pas confondre avec Sable & Indigo (indigo = violet-bleu sombre ; ici bleu ciel
vif et clair — deux intentions différentes, ne pas les substituer l'une à l'autre).

#### Marché aux Épices
Fond : #241A12 — brun-noir chaud
Texte : #F3E6D2 — crème chaud
Accent 1 : #D6461F — piment/paprika
Accent 2 : #E8A722 — curcuma doré
Support : #6E3420 — brun-rouge épice
Tonalité : vivant et gourmand, plusieurs accents chauds qui cohabitent — plus riche qu'un simple
duo fond/accent classique.
Penser à cette palette quand : gastronomie épicée, marché/artisanat alimentaire, marque qui assume
une richesse chromatique à plusieurs accents plutôt qu'un accent unique.
Éviter avec : Argile & Moutarde (même famille chaude épicée — choisir l'un ou l'autre selon si un
seul accent ou plusieurs accents cohabitants sont voulus).

#### Crema Café
Fond : #E4CFAE — crème café clair
Texte : #2E2015 — brun très sombre
Accent 1 : #8A5A34 — brun torréfié
Accent 2 : #C9A876 — mousse café doré
Tonalité : doux et gourmand, tourbillon chaud plutôt qu'un simple marron plat.
Penser à cette palette quand : café/thé/pâtisserie artisanale ; brief veut une chaleur douce et
enveloppante, pas épicée/intense comme Marché aux Épices.

#### Moutarde & Pétrole Sombre
Fond : #0F282F — bleu-pétrole quasi-noir
Texte : #EDE7D6 — ivoire chaud
Accent 1 : #D4C757 — moutarde
Accent 2 : #CD4A2C — orange-brique
Support : #094058 — bleu pétrole moyen
Tonalité : contraste chaud/froid net sur fond sombre — moutarde et brique contre un bleu-pétrole
profond, différent de Dune & Ciel (fond clair) et de Marché aux Épices (fond brun, pas bleu).
Penser à cette palette quand : sujet qui doit tenir chaud ET froid en équilibre sur fond sombre —
gastronomie premium, artisanat technique, torréfaction/café haut de gamme avec identité sombre.

#### Récif & Terre Cuite
Fond : #064947 — teal très profond
Texte : #EEF0E2 — blanc verdâtre pâle chaud
Accent 1 : #00A393 — teal vif
Accent 2 : #DD7940 — terre cuite
Support : #788A3A — olive
Tonalité : tropical/maritime chaud-froid, teal dominant + une touche terre.
Penser à cette palette quand : voyage/hôtellerie tropicale réelle, brief avec un vrai ancrage
plage/récif — pas un bleu décoratif générique.

#### Brûlé & Ciel Pâle
Fond : #2B0E03 — brun quasi-noir
Texte : #DAE9F3 — bleu pâle glacé (observé comme texte/fond alterné dans la source)
Accent 1 : #EB6C37 — orange vif
Accent 2 : #337EA7 — bleu moyen
Tonalité : contraste brun sombre / bleu pâle / orange — plus froid dans l'ensemble que les
familles terracotta existantes grâce au duo bleu.
Penser à cette palette quand : sujet qui mélange chaleur ponctuelle (accent) et froideur générale
(fond+texte) — photographie/éditorial, marque qui veut un seul accent chaud maîtrisé.

#### 4.3 CHAUDES & TERREUSES — nouvelles entrées du 26/09/26
Poussière d'Or & Ombre
Fond : #2A2018 — brun très sombre, ocre résiduel
Texte : #F0E8D6 — crème légèrement ocré
Accent 1 : #D4A84B — or poussiéreux (mat et légèrement désaturé — pas l'or clinquant, pas le miel)
Accent 2 : #6A5438 — brun cuir sombre
Tonalité : ancien, archéologique — l'or comme patine sur fond sombre dense, plus lourd et mat que Graphite & Laiton (fond neutre gris) et que Bordeaux & Or Profond (plus opulent/théâtral).
Penser à cette palette quand : musées/archéologie/patrimoine culturel ; brief évoque l'antique, le fouillé, le vieilli précieux — pas le luxe neuf ni la modernité.

Lichen & Sève
Fond : #F0E8D0 — crème végétal clair (légèrement jaunâtre)
Texte : #2A2416 — brun-vert très sombre
Accent 1 : #6B7A34 — vert lichen (jaune-vert, pas un vert menthe ni un vert forêt)
Accent 2 : #A08028 — jaune sève doré
Tonalité : végétal et lumineux, le jaune-vert de la jeune pousse — plus cru et biologique que Ivoire & Pin (vert forêt profond/sombre) et plus spécifique que Craie & Sauge Pâle (sauge désaturée/apaisante).
Penser à cette palette quand : agriculture biologique, brasserie artisanale (houblon/orge), maraîchage premium ; brief a un vrai rapport à la jeune pousse, à la fermentation, à la plante vivante plutôt qu'à la forêt.

Sienna & Craie Chaude
Fond : #EDE3D4 — craie chaude sableuse
Texte : #291C12 — brun-noir
Accent 1 : #9C4A28 — sienna brûlé (plus rougeâtre/saturé que la rouille de Lin & Rouille, moins sombre que le terracotta sourd de Section 4.3)
Accent 2 : #C8A882 — sable clair (surfaces secondaires/cartes)
Tonalité : méditerranéen lumineux, fond clair sableux + accent sienna — plus lumineux que Brique & Sauge (fond beige + accent brique sur fond clair, oui, mais sauge en second accent qui tempère ; ici pas de vert pour contrebalancer).
Penser à cette palette quand : poterie/artisanat méditerranéen, tourisme intérieur (Andalousie, Toscane, Provence) qui veut un chaud direct et lumineux sans accent de couleur froide pour le contrebalancer.

Ambre & Résine
Fond : #3A2208 — brun-noir très riche, résine sombre
Texte : #F4E4C0 — blanc ambre clair
Accent 1 : #E8A030 — ambre vif translucide (lumière dans la résine)
Accent 2 : #7A4410 — brun-roux profond
Tonalité : chaud et profond, la lumière dans la matière — différent de Nuit & Miel (miel plus doux/alimentaire) et de Ocre & Charbon (ocre mat/minéral) ; ici la lumière traverse la matière, résine ou ambre fossile.
Penser à cette palette quand : joaillerie naturelle (ambre, résine), cosmétique à base de résines/huiles rares, craft spirits (whisky/rhum boisé) qui veut évoquer la profondeur de la barrique plutôt que la chaleur de l'épice.

### 4.4 FROIDES & TECHNIQUES

#### Abysse & Corail Froid
Fond : #10161C — bleu-noir profond
Texte : #E4EBEF — blanc bleuté
Accent 1 : #3E8FA6 — cyan éteint
Accent 2 : #E0625A — corail froid (désaturé, pas le corail chaud générique)
Tonalité : technique mais vivant, contraste froid/chaud maîtrisé — bon pour tech/data qui veut éviter le bleu corporate plat.
Penser à cette palette quand : secteur data/analytics/dev tools qui veut un accent chaud discret
pour casser le tout-bleu ; client dit "technique mais pas froid/impersonnel".

#### Marine Profonde & Corail Vif
Fond : #031B2B — navy quasi-noir
Texte : #E7EDF1 — blanc bleuté froid
Accent 1 : #11BACA — teal vif
Accent 2 : #FFA24D — orange chaud
Support : #A60E35 — cramoisi profond (réservé alertes/CTA critiques vu la saturation)
Tonalité : plus saturé et vif qu'Abysse & Corail Froid (même famille structurelle : fond marine +
accent froid + accent chaud), mais 4 tons pleinement assumés plutôt qu'un accent discret.
Penser à cette palette quand : secteur tech/data qui veut un impact visuel fort et coloré, pas
discret — plus proche d'un dashboard grand public que d'un outil B2B sobre.
Éviter avec : Abysse & Corail Froid (même famille, celle-ci est la version "volume sonore élevé").

#### Acier & Citron Vert
Fond : #14181B — acier sombre
Texte : #E7EBE8 — blanc froid
Accent 1 : #8FBF3F — vert citron mat (pas fluo)
Support : #202529 — carte
Tonalité : énergique mais discipliné — pour un sujet fintech/productivité qui veut un accent vif sans tomber dans le "Dark & Acid" générique proscrit (rester mat, jamais saturé au max).
Penser à cette palette quand : secteur productivité/fintech qui veut un accent vert vif mais
mat, pas façon "growth hacker néon" — attention à ne jamais saturer au max (Direction Artistique Section 3).

#### Glacier & Ambre
Fond : #EDF1F2 — blanc glacier
Texte : #1B2226 — bleu-noir
Accent 1 : #2E6E7A — bleu glacier profond
Accent 2 : #C9862F — ambre
Tonalité : clinique mais réchauffé par l'ambre — pour santé/assurance qui veut éviter le bleu-blanc trop froid.
Penser à cette palette quand : secteur santé/assurance/medtech qui veut un fond clair clinique
mais craint le "bleu-blanc hôpital" trop froid ; client demande un accent chaud discret sur fond clair.

#### Nuit Polaire & Cuivre
Fond : #12181D — bleu-nuit très sombre
Texte : #E6ECEF — blanc froid
Accent 1 : #B5652D — cuivre (même famille qu'Ardoise & Cuivre mais fond plus froid — NE PAS utiliser les deux sur des projets proches)
Accent 2 : #3A4A54 — gris-bleu
Tonalité : premium et froid, réchauffé par un seul accent — pour un sujet luxe/tech haut de gamme.
Penser à cette palette quand : secteur tech/luxe premium qui veut un dark mode haut de gamme
avec un seul accent métallique chaud ; éviter si Ardoise & Cuivre déjà utilisée récemment.

#### Silex & Émeraude
Fond : #16181A — silex sombre
Texte : #E8ECE9 — blanc vert pâle
Accent 1 : #1F7A5C — émeraude profonde
Accent 2 : #4A4E4C — gris pierre
Tonalité : précieux et posé, plus original que le vert menthe ou le vert néon — pour finance/santé qui veut se démarquer du bleu par défaut.
Penser à cette palette quand : secteur finance/santé qui refuse le bleu par réflexe ; client
veut un vert "précieux" (émeraude) plutôt qu'un vert menthe/santé déjà très vu.

#### Océan & Étain
Fond : #0F1A1E — bleu-noir profond
Texte : #E5EDEE — blanc bleuté pâle
Accent 1 : #4A9DA8 — bleu océan éteint
Accent 2 : #8B9195 — étain mat
Tonalité : profond et posé, plus maritime que technique pur — un bleu qui évoque l'eau, pas le corporate.
Penser à cette palette quand : secteur maritime/logistique portuaire/voyage ; brief a un vrai
ancrage eau/mer (pas juste "bleu" décoratif sans lien au sujet).

#### Arctic & Perle
Fond : #0E7490 — teal profond
Texte : #F2F5F7 — perle froide
Accent 1 : #E8A24A — ambre clair
Support : #F2F5F7 — perle froide (peut aussi servir de fond clair alterné)
Tonalité : froid et net, plus vif que le bleu pétrole d'Océan & Étain / Coquille & Pétrole —
teal franc plutôt que bleu-vert sourd, réchauffé par un seul accent ambre.
Penser à cette palette quand : secteur tech/data qui veut un teal affirmé et propre plutôt que
sourd — à distinguer explicitement de Coquille & Pétrole (Section 4.2, teinte plus assourdie) et
Océan & Étain (Section 4.4, plus sombre/maritime) — ne pas confondre les trois.
Éviter avec : Coquille & Pétrole, Océan & Étain (même famille teal/bleu-vert, choisir UNE seule
direction par projet).

#### Nuit Cyan & Argent
Fond : #10151A — bleu-nuit quasi noir
Texte : #E8EEEF — blanc froid
Accent 1 : #4FB8C4 — cyan clair mat
Accent 2 : #9CA3A8 — argent mat
Tonalité : futuriste mais discipliné, cyan tenu en respect (pas néon) — pour un sujet tech qui veut un accent frais sans tomber dans le générique "Dark & Acid".
Penser à cette palette quand : secteur IA/deeptech/robotique qui veut un accent cyan mais
mat et sobre ; attention à ne jamais le saturer façon néon (Direction Artistique Section 3).

#### Chrome Liquide Clair
Fond : #EDEDED — gris-blanc neutre
Texte : #1A1A1C — noir
Accent 1 : #B7B9BC — argent liquide
Accent 2 : #8E9093 — gris métal moyen
Tonalité : futuriste et froid, monochrome quasi total — aucun accent coloré, tout repose sur les
nuances de gris/argent.
Penser à cette palette quand : deeptech/IA/robotique qui veut un futurisme épuré sans AUCUN accent
couleur, product design haut de gamme (matériaux réels, pas décoratif).
Éviter avec : à utiliser seule — cette palette ne fonctionne pas bien en accent secondaire d'un
projet qui a déjà une identité couleur forte ailleurs.

#### Chrome Liquide Sombre
Fond : #101112 — noir quasi total
Texte : #E9EAEA — blanc froid
Accent 1 : #C4C6C8 — argent lumineux
Accent 2 : #4A4C4E — gris anthracite
Tonalité : version sombre de Chrome Liquide Clair — même principe monochrome, inversé.
Penser à cette palette quand : même contexte que Chrome Liquide Clair mais pour un dark mode ;
ne jamais combiner les deux versions sur le même projet, choisir une seule direction (clair OU sombre).

#### Glace Fissurée
Fond : #0F1E2C — bleu-nuit glacé
Texte : #E4EEF3 — blanc glacé
Accent 1 : #4A8FB8 — bleu glace cristallin
Accent 2 : #2C4E63 — bleu profond secondaire
Tonalité : froid et cristallin, sans accent chaud — pur, presque clinique mais texturé par nature.
Penser à cette palette quand : sujet qui a un vrai rapport au froid/glace/cristal (grande
distribution froid alimentaire, sport hivernal, science des matériaux) ; se distingue de Glacier &
Ambre (Section 4.4) par l'absence totale d'accent chaud — ici tout reste dans le bleu-blanc.

#### Nuit Verte & Écarlate
Fond : #0E1610 — vert-noir quasi total (duotone)
Texte : #EAF0EA — blanc verdâtre pâle
Accent 1 : #D6262A — rouge écarlate vif (réservé à UN SEUL élément, jamais généralisé)
Accent 2 : #2A3A2C — vert sourd secondaire
Tonalité : monochrome vert dominant + un accent rouge isolé unique — proche structurellement de
Nuit & Corail Vif (Section 4.5) mais en vert au lieu de bleu-noir, et
l'accent y est encore plus radicalement isolé (1 seul élément, jamais répété ailleurs dans la
composition).
Penser à cette palette quand : sujet tech/biométrie/scan/sécurité qui veut un monochrome vert
mat + un point rouge unique de haute intensité — jamais pour un accent rouge répété plusieurs
fois (perdrait l'effet d'isolement qui fait la force du principe).
Éviter avec : Nuit & Corail Vif (même famille structurelle, bleu au lieu de vert — choisir une
seule direction par projet, ne pas les combiner).
Statut : HEX estimés depuis une capture, jamais mesurés par pipette — à valider à l'œil avant
usage réel, comme toute palette extraite d'une réf (Agents_Design_Reference.md Section 3).

#### Prune Vif & Blanc
Fond : #F7F4F8 — blanc légèrement violacé
Texte : #211C28 — aubergine presque noir
Accent 1 : #7A3FA0 — violet-prune saturé (nettement plus vif que le prune sourd de Nacre & Prune,
Accent 2 : #3D1F52 — violet profond secondaire (CTA/logo)
Support : #E4D8EC — carte lavande claire
Tonalité : univers monochrome violet à plusieurs intensités (du très clair au très saturé),
plus affirmé/commercial que Nacre & Prune qui reste doux et discret — celle-ci assume la
saturation pour un rendu e-commerce/marque grand public.
Penser à cette palette quand : mode/beauté/lifestyle qui veut un violet pleinement assumé comme
couleur de marque (pas juste une touche discrète) ; brief demande "féminin mais affirmé", pas
"doux et discret" (dans ce cas → Nacre & Prune, Section 4.2, reste le bon choix).
Éviter avec : Nacre & Prune (même famille violette — l'une est douce/discrète, l'autre saturée/
affirmée ; choisir selon ce que dit vraiment le client, jamais les deux sur le même projet).
Statut : HEX estimés depuis une capture — à valider avant usage réel.

#### Ardoise & Verdict
Fond : #14161C — ardoise-anthracite froid
Texte : #E9EAEE — blanc froid cassé
Texte 2 : #8A8F9C — gris-bleu moyen (métadonnées)
Accent 1 : #4F46E5 — indigo noble (couleur de marque, imposée par le logo du projet d'origine)
Accent 2 : #A8342A — grenat verdict (alerte/échec uniquement)
Support : #1C1F27 — carte sur ardoise
Sémantiques : #2F7A5C sauge verdict (validation) · #B8862E ambre sourd (attention modérée)
Tonalité : sombre, tendu, sans complaisance — un éclat froid isolé (indigo) sur une base minérale ;
trois sémantiques désaturés (grenat/sauge/ambre) à la place du trio rouge/vert/ambre Tailwind générique.
Penser à cette palette quand : produit qui évalue/note/juge (simulateur d'entretien, audit, scoring,
jury, coaching exigeant) ; dashboard où alerte/validation/attention doivent se lire sans retomber sur
les sémantiques Tailwind par défaut ; client dont l'accent de marque est un indigo/bleu froid imposé.
Éviter avec : Ébène & Corail Sourd, Abysse & Corail Froid, Nuit Polaire & Cuivre (même famille fond
froid quasi-noir — une seule direction par projet). Grenat jamais généralisé au-delà de l'alerte (un
accent de rupture perd son effet s'il est répété — cf. Nuit Verte & Écarlate). Fond + un accent sur
aplat nu recrée le Look 2 (Direction_Artistique Section 3) : garder les deux familles d'accents
distinctes + une texture (grain, grille discrète).
Contraste (mesuré sur fond #14161C) : indigo 2,9:1, grenat 2,8:1, sauge 3,5:1 → aplats/badges avec
texte clair uniquement, jamais du texte fin ; ambre 5,6:1 et Texte 2 5,6:1 lisibles en texte.
Note d'origine : #4F46E5 = indigo-600 de Tailwind par défaut (Direction_Artistique 3bis) ; ici imposé
par un logo client. Sans accent imposé, dériver l'accent du sujet — l'entrée sert surtout de
STRUCTURE (fond froid + accent de marque + trio sémantique désaturé).
Origine : refonte Mock Interview Pro — palette sur-mesure, HEX conçus (non extraits d'une capture).

#### 4.4 FROIDES & TECHNIQUES — nouvelles entrées du 26/09/26
Mercure & Néon Froid
Fond : #111318 — noir bleuté très sombre
Texte : #DEE4E8 — blanc froid bleuté
Accent 1 : #00B4D8 — cyan mercure (vif mais non néon — garder légèrement désaturé, cf. règle Mousse Électrique)
Accent 2 : #1E3040 — bleu-nuit support
Tonalité : futuriste et propre, le cyan comme lumière froide maîtrisée — structurellement proche de Nuit Cyan & Argent (Section 4.4) mais sans l'accent argent ; ici le cyan est seul et plus vif, l'argent est absent.
Penser à cette palette quand : produit deeptech/IA qui veut un seul accent cyan franc sans la neutralité argent ; secteur propulsion/énergie froide/cryogénie qui a un vrai rapport au liquide cryogénique ou au plasma.
Éviter avec : Nuit Cyan & Argent (même famille — choisir selon si l'accent argent est pertinent ou non pour le sujet).

Béton Poli & Rouge Signal
Fond : #DDDBD6 — béton poli clair (plus froid et lisse que Béton & Jaune Taxi)
Texte : #1C1C1C — noir quasi pur
Accent 1 : #CC2200 — rouge signal (sécurité, alerte industrielle — jamais décoratif)
Accent 2 : #8A8880 — gris béton moyen
Tonalité : signalétique industrielle stricte, le rouge uniquement comme signal d'alerte/danger — pas une couleur d'ambiance.
Penser à cette palette quand : sécurité industrielle, procédures d'urgence, dashboard de monitoring critique ; client travaille dans un secteur réglementé où le rouge = danger réel (jamais esthétique).
Éviter avec : Craie & Vermillon, Suie & Orange Brûlé (le rouge y est esthétique/expressif — ici il est sémantique/fonctionnel uniquement).

Givre Polaire & Cuivre Pâle
Fond : #EEF2F5 — blanc givre très froid
Texte : #1A2430 — bleu-noir glacé
Accent 1 : #B87A4A — cuivre pâle (désaturé, reflet cuivré sur neige — très différent du cuivre chaud des palettes terreuses)
Accent 2 : #C8D4DC — gris-bleu très clair (surfaces)
Tonalité : le seul point chaud dans un environnement totalement froid — le cuivre comme anomalie précieuse sur fond glacé, pas comme matière principale.
Penser à cette palette quand : secteur outdoor/sport hivernal premium, horlogerie technique qui vend en environnement arctique réel ; brief a un seul élément chaud à faire ressortir sur un fond froid dominant.

Spectre & Noir
Fond : #0C0E10 — noir quasi total
Texte : #E0E8EC — blanc froid
Accent 1 : #6A4FBF — violet spectre (entre indigo et violet, jamais magenta)
Accent 2 : #24202E — violet-noir support
Tonalité : sombre et mystérieux, violet profond comme seul accent — différent de Ardoise & Verdict (indigo Tailwind imposé, usage structurel) et de Prune Vif & Blanc (violet saturé sur fond clair) ; ici le violet est froid et isolé sur noir quasi total.
Penser à cette palette quand : secteur science/physique quantique/spectroscopie, événementiel scientifique premium, musique électronique sobre (pas synthwave/rétro — plutôt ambient techno) ; brief évoque le spectre lumineux ou le quantique.

### 4.5 VIVES & CONTRASTÉES

#### Craie & Vermillon
Fond : #F5F3EE — blanc craie
Texte : #201C18 — brun-noir
Accent 1 : #C23B2E — vermillon
Accent 2 : #262421 — quasi-noir
Tonalité : franc, direct, un peu brut — pour un sujet qui veut de l'énergie sans passer par le néon.
Penser à cette palette quand : client dit "franc", "direct", "sans détour" ; secteur sport/media
d'actualité qui veut un rouge fort mais pas criard.

#### Béton & Jaune Taxi
Fond : #E9E7E2 — béton clair
Texte : #1D1C1A — noir chaud
Accent 1 : #E0A527 — jaune taxi désaturé (pas jaune pur)
Support : #D6D2C8 — carte
Tonalité : urbain, brut, signalétique — pour un sujet logistique, mobilité, industriel assumé.
Penser à cette palette quand : secteur mobilité/logistique/transport urbain ; brief évoque
la ville, la signalétique, le chantier — pas un sujet doux ou luxueux.

#### Nuit & Magenta Sourd
Fond : #17141A — noir violacé
Texte : #ECE6EC — blanc lilas
Accent 1 : #A5386F — magenta sourd (pas fluo)
Accent 2 : #4A3F4A — gris violacé
Tonalité : créatif et affirmé sans être criard — pour un sujet culturel, événementiel, musique.
Penser à cette palette quand : secteur musique/événementiel/arts vivants ; client veut "créatif
et affirmé" mais refuse le violet/magenta fluo générique des apps créatives.

#### Papier & Bleu Roi
Fond : #F2F0E9 — papier
Texte : #1A1C24 — bleu-noir
Accent 1 : #1E3A8F — bleu roi
Accent 2 : #C0392B — rouge brique en second accent (rare, réservé aux alertes/CTA critiques)
Tonalité : institutionnel mais vivant grâce au contraste franc — pour un sujet officiel qui ne veut pas être terne.
Penser à cette palette quand : secteur institutionnel/administration/organisation officielle qui
veut rester sérieux sans être terne ; client refuse le bleu pâle plat habituel du secteur public.

#### Suie & Orange Brûlé
Fond : #181614 — suie
Texte : #F0EAE0 — blanc chaud
Accent 1 : #D9642E — orange brûlé (plus saturé/rouge que le terracotta générique #D97757, à garder bien distinct)
Accent 2 : #35302A — brun sombre
Tonalité : intense, chaleureux, presque combustible — pour un sujet food/énergie qui veut un accent fort et assumé.
Penser à cette palette quand : secteur énergie/food intense (grill, épices fortes, sport
d'endurance) ; brief demande un orange fort et assumé, pas un terracotta discret.

#### Craie & Indigo Vif
Fond : #F4F2EC — craie
Texte : #1E1E2C — indigo-noir
Accent 1 : #3538A8 — indigo vif (plus saturé que Sable & Indigo)
Accent 2 : #24211A — quasi-noir chaud
Tonalité : net et énergique, un indigo franc qui tranche sur fond clair — plus affirmé qu'un bleu cobalt classique.
Penser à cette palette quand : secteur startup/tech grand public qui veut un bleu-violet
énergique et mémorable, pas le bleu cobalt déjà très utilisé en SaaS.

#### Nuit & Corail Vif
Fond : #16181C — bleu-noir
Texte : #EDEFEE — blanc froid
Accent 1 : #E8543F — corail vif saturé (chaud, à l'inverse du "corail froid" d'Abysse & Corail Froid)
Accent 2 : #3A3E42 — gris ardoise
Tonalité : contraste franc chaud/sombre, énergique et direct — pour un sujet qui veut un accent qui claque.
Penser à cette palette quand : secteur sport/fitness/media dynamique ; client veut un accent
rouge-orangé qui "claque" sur fond sombre, plus vif que les options sourdes de la bibliothèque.

#### Indigo & Glycine
Fond : #2D4275 — indigo profond
Texte : #D6C6F7 — glycine pâle
Accent 1 : #E0935C — corail doux
Support : #D6C6F7 — glycine pâle (fond clair alterné)
Tonalité : contraste froid-doux marqué, indigo profond + lavande claire, réchauffé par un accent
corail discret — absent du reste de la bibliothèque (Sable & Indigo a un indigo similaire mais
jamais couplé à une lavande claire).
Penser à cette palette quand : secteur créatif/tech premium qui veut un violet-bleu affirmé sans
tomber dans le magenta fluo (voir Nuit & Magenta Sourd, autre registre) ; brief mentionne
crépuscule, nuit, ou une identité "profonde mais douce".
Éviter avec : Sable & Indigo (même indigo de base — vérifier qu'on ne recrée pas un doublon si
les deux sont utilisées sur des projets proches).

#### Béton & Turquoise
Fond : #EAE8E3 — béton clair
Texte : #1C2422 — noir verdâtre
Accent 1 : #1F9C8E — turquoise franc
Support : #D8D4CC — carte
Tonalité : urbain mais rafraîchi par un accent vif — plus surprenant qu'un turquoise pastel classique.
Penser à cette palette quand : secteur sport urbain/loisirs actifs/appli mobile grand public ;
brief veut un accent vif et frais sur fond neutre urbain, pas sur fond blanc classique.

#### Escalier & Glycine
Fond : #012C6A — bleu profond
Texte : #F0EEF5 — blanc lavande pâle
Accent 1 : #8E9AFA — periwinkle clair
Accent 2 : #C791AE — rose poudré/mauve
Support : #0150BE — bleu vif
Tonalité : bleu dominant avec une touche rose poudrée inattendue — distinct du reste de la
bibliothèque (aucune entrée bleu+rose de ce type).
Penser à cette palette quand : sujet architecture/urbain qui veut un contraste doux plutôt qu'un
accent chaud classique.

#### Vice Nocturne (synthwave) — 
Fond : #0B0F2B — bleu-nuit profond
Texte : blanc/blanc cassé (non fourni explicitement mais standard sur ce type de fond)
Accent 1 : #FF5CA8 — rose néon
Accent 2 : #00F0FF — cyan néon
Support 1 : #BC6CFF — violet néon
Support 2 : #FFB86B — pêche
Tonalité : rétro-futuriste 80s/Miami, néon saturé assumé — genre entier reconnaissable
(synthwave/vaporwave), pas une simple teinte discrète.
Penser à cette palette quand : le sujet RÉEL est rétro 80s, arcade, synthwave musical —
JAMAIS par défaut pour "faire vif/moderne", ce serait un cliché de genre mal placé.
Éviter avec : toute palette froide/technique sobre de la bibliothèque — incompatible par nature.

#### Jaune Pâle & Magenta Sombre — 
Fond : #201E1F — quasi-noir
Texte : #FEE17D — jaune pâle (assez clair pour servir de texte sur fond sombre)
Accent 1 : #BC33D5 — magenta vif
Accent 2 : #990134 — rouge sombre profond
Tonalité : festif et intense, mais le magenta vif rapproche cette palette du territoire "gradient
générique IA/startup" — à confronter OBLIGATOIREMENT contre Agents_Direction_Artistique.md
Section 3 (3 looks génériques proscrits) avant tout usage, je n'ai pas ce fichier sous les yeux
pour trancher avec certitude.
Penser à cette palette quand : événementiel/festival qui assume un magenta fort — jamais pour un
SaaS/tech par défaut.
Statut : à valider contre Direction Artistique avant ajout définitif — pas encore confirmé sûr.

#### Lave & Braise
Fond : #17110F — basalte quasi-noir chaud
Texte : #F2E7DD — blanc chaud
Accent 1 : #E8511E — orange-braise vif (fissures nettes, pas un simple accent diffus)
Accent 2 : #2A211D — brun-noir support
Tonalité : intense et minéral, la matière qui couve — plus graphique et dramatique que Suie &
Orange Brûlé (Section 4.5), qui reste un accent chaud diffus plutôt qu'une fissure nette.
Penser à cette palette quand : énergie/géothermie, sujet qui a un vrai rapport à la chaleur
intense/la matière en fusion ; marque qui veut un impact visuel fort et minéral.
Éviter avec : Suie & Orange Brûlé (même famille chaude sombre — ne pas utiliser les deux sur des
projets proches).

#### Soie Orange Vive
Fond : #D8511E — orange satiné saturé
Texte : #2A1408 — brun très sombre
Accent 1 : #F2A03C — orange clair lumineux (reflet du satin)
Accent 2 : #8A2E0C — orange brûlé profond
Tonalité : vif et luxueux à la fois — l'orange comme surface dominante plutôt que comme accent,
porté par la brillance du satin.
Penser à cette palette quand : mode/textile premium qui veut un orange pleinement assumé comme
couleur de marque, pas discret ; se distingue de toute la famille terracotta/rouille de la
bibliothèque par sa saturation et sa brillance pleinement revendiquées.

#### 4.5 VIVES & CONTRASTÉES — nouvelles entrées du 26/09/26
Nuit & Vert Acide Maîtrisé
Fond : #141614 — noir verdâtre dense
Texte : #E8F0E4 — blanc verdâtre pâle
Accent 1 : #78C840 — vert acide maîtrisé (⚠️ jamais pousser la saturation au maximum — même règle que Mousse Électrique et Acier & Citron Vert ; ici entre les deux : plus vif que Acier & Citron Vert, moins brut que Mousse Électrique)
Accent 2 : #2C3828 — vert sombre support
Tonalité : organique et vif, la lumière verte comme énergie principale — à distinguer de Acier & Citron Vert (fond acier froid/bleuté, vert citron) et de Mousse Électrique (fond noir humide, vert mousse brut) ; ici le fond participe au vert, toute la palette est dans la même famille chromatique.
Penser à cette palette quand : marque d'énergie renouvelable qui assume un vert vif (pas apaisé/pastoral) ; sport/tech qui a un vrai rapport au végétal vivant et vif, pas juste "vert = nature".
Éviter avec : Mousse Électrique, Acier & Citron Vert (trois entrées vert vif/sombre — choisir selon la température de fond et l'intensité voulue, jamais deux sur projets proches).

Craie & Safran Vif
Fond : #F5F2EB — craie chaude
Texte : #1E1A10 — brun-noir
Accent 1 : #E0A010 — safran vif (plus saturé/chaud que la moutarde de Béton & Jaune Taxi, moins désaturé — un safran réel, pas un jaune signal)
Accent 2 : #2A2216 — quasi-noir chaud
Tonalité : lumineux et chaleureux, le jaune comme affirmation positive sur fond clair — différent de Béton & Jaune Taxi (fond béton urbain, jaune désaturé signalétique) ; ici fond ivoire chaud, le safran évoque une épice chaude et vivante.
Penser à cette palette quand : gastronomie indienne/moyen-orientale sur fond clair, marque d'épices sur fond lumineux, startup qui veut un jaune-or affirmé sur fond clair sans passer par le doré discret.

Fumée & Rose Froid
Fond : #2A2430 — gris-violet très sombre
Texte : #EDE6F0 — blanc lilas pâle
Accent 1 : #C45880 — rose froid saturé (plus froid que le corail, moins criard que le magenta fluo — un rose précis, entre les deux)
Accent 2 : #483A54 — violet-gris support
Tonalité : dramatique et sexué, un rose froid affirmé sur fond sombre violet — absent de la bibliothèque (Nuit & Magenta Sourd est un magenta plus violet ; Nacre & Prune est un prune doux sur fond clair ; ici le rose est froid et central sur fond sombre).
Penser à cette palette quand : mode/beauté premium qui veut un rose froid et affirmé sans fond clair ; secteur musical/culture queer qui veut un rose froid sans l'esthétique synthwave rétro.

Bleu Électrique & Ambre Net
Fond : #F3F1EC — craie neutre
Texte : #14182A — bleu-noir
Accent 1 : #1B4FE8 — bleu électrique vif (plus saturé que Craie & Cobalt #2857A6, moins violet que Craie & Indigo Vif #3538A8 — un bleu pur primaire)
Accent 2 : #D48A20 — ambre net (contraste complémentaire direct avec le bleu)
Tonalité : contraste complémentaire bleu/ambre sur fond clair — énergique et structuré, les deux accents s'opposent et se tiennent mutuellement.
Penser à cette palette quand : startup éducation/civic tech qui veut un bleu vif sans le cliché corporate + un second accent chaud qui ancre ; brief demande "dynamique et rigoureux en même temps".
Éviter avec : Craie & Cobalt (même famille fond clair/bleu — ici le bleu est nettement plus saturé et le second accent chaud est structurel, pas optionnel).

### 4.6 NEUTRES & MINIMALES

#### Brume & Noir
Fond : #EDEDEC — gris brume
Texte : #17181A — noir
Accent 1 : #17181A — noir (même teinte que le texte, utilisé en aplat pour CTA)
Support : #DEDEDB — carte
Tonalité : minimal extrême, laisse toute la place à la typo — pour un sujet où le contenu doit primer sur la couleur.
Penser à cette palette quand : contenu éditorial/portfolio typo-driven ; client dit "je ne veux
pas de couleur qui distraie", brief centré sur le texte/la typographie elle-même.

#### Lin & Anthracite
Fond : #F0EEE9 — lin très clair
Texte : #26262A — anthracite
Accent 1 : #5A5A60 — gris moyen (seul accent, pas de couleur vive)
Tonalité : neutre absolu, sobre — pour un sujet B2B sérieux qui ne veut aucune couleur qui distraie.
Penser à cette palette quand : secteur B2B pur (audit, conseil, legal tech) ; client insiste sur
"pro et sérieux avant tout", aucune couleur d'accent explicitement demandée.

#### Perle & Bronze Discret
Fond : #F4F2EE — perle
Texte : #201F1C — noir chaud
Accent 1 : #8C7355 — bronze très désaturé
Support : #E6E2D9 — carte
Tonalité : feutré et élégant, un seul accent à peine perceptible — pour un sujet luxe discret, pas tape-à-l'œil.
Penser à cette palette quand : secteur luxe discret (joaillerie minimaliste, hôtellerie 5 étoiles
qui refuse le doré voyant) ; client dit "élégant mais jamais ostentatoire".

#### Galet & Encre Bleue
Fond : #EDECEA — gris galet
Texte : #1D2024 — bleu-noir
Accent 1 : #2A3A52 — bleu encre profond (utilisé avec parcimonie)
Tonalité : quasi monochrome, un seul accent froid discret — pour un sujet institutionnel/juridique.
Penser à cette palette quand : secteur juridique/notarial/institution publique sérieuse ; brief
veut un monochrome quasi total, un seul accent utilisé avec parcimonie (liens, CTA).

#### Craie & Terre d'Ombre
Fond : #F1EFE9 — craie
Texte : #201C17 — terre d'ombre brûlée
Accent 1 : #6B5C4A — brun taupe
Tonalité : minimal chaud, presque sans couleur — pour un sujet qui veut une neutralité qui reste habitée.
Penser à cette palette quand : sujet minimaliste qui doit quand même paraître chaleureux/habité
(pas clinique) ; client veut "épuré" mais craint le minimalisme froid type Brume & Noir.

#### Sable & Encre Discrète
Fond : #F2EEE5 — sable clair
Texte : #201E19 — brun-noir
Accent 1 : #4A4640 — brun-gris discret (accent quasi neutre, presque un ton sur ton)
Support : #E5E0D3 — carte
Tonalité : minimal chaud, encore plus discret que Craie & Terre d'Ombre — l'accent se voit à peine.
Penser à cette palette quand : sujet où même un accent coloré serait "trop" — signature, agence
de conseil très haut de gamme qui joue tout sur la typo/l'espacement, pas la couleur.

#### Perle & Vert Sauge Discret
Fond : #F3F1EC — perle chaude
Texte : #1F211C — vert-noir
Accent 1 : #7E8A72 — vert sauge très désaturé (accent à peine perceptible)
Support : #E4E1D6 — carte
Tonalité : neutre habité par une touche végétale discrète — plus doux qu'un simple gris.
Penser à cette palette quand : secteur bien-être/naturel qui veut un neutre plutôt qu'un vert
franc ; client aime le vert mais le brief est minimaliste, pas botanique appuyé.

#### Pierre Ponce
Fond : #E6E1D9 — grège pierre clair
Texte : #2A2622 — brun-gris sombre
Accent 1 : #8A8177 — taupe moyen
Support : #D6D0C4 — carte
Tonalité : minéral et texturé, neutre chaud plutôt que froid — la matière poreuse comme identité.
Penser à cette palette quand : cosmétique/spa minéral, architecture brute qui veut un neutre
texturé plutôt qu'un blanc/gris lisse et froid.

#### Mur de Pierre Noire
Fond : #1B1B1C — noir pierre mat
Texte : #E8E7E4 — blanc cassé
Accent 1 : #4A4A4B — gris pierre moyen
Support : #262627 — carte
Tonalité : minimal extrême et minéral — encore plus neutre que Brume & Noir (Section 4.6), texture
en plus de la couleur.
Penser à cette palette quand : architecture/matériaux bruts qui veut un noir texturé plutôt qu'un
noir plat digital ; contenu où la matière doit se sentir même en neutre absolu.

#### 4.6 NEUTRES & MINIMALES — nouvelles entrées du 26/09/26
Cire & Ombre Douce
Fond : #F1EDE4 — blanc cire légèrement ambré
Texte : #22201A — brun-noir
Accent 1 : #9A8C70 — brun-sable moyen (plus chaud que le taupe de Pierre Ponce, plus désaturé que le bronze de Perle & Bronze Discret)
Support : #E2D8C8 — carte cire foncée
Tonalité : neutre chaud organique, la matière de la cire d'abeille — entre la neutralité de Sable & Encre Discrète et la chaleur légèrement plus affirmée de Craie & Terre d'Ombre.
Penser à cette palette quand : cosmétique naturel minimaliste qui veut un fond légèrement ambré plutôt qu'un fond lin/ivoire déjà très utilisé dans le secteur ; artisanat cireux (bougies, cire à cacheter, apiculture packaging haut de gamme).

Calcaire & Gris Froid
Fond : #EDECEA — blanc-gris calcaire (très légèrement chaud-froid en même temps)
Texte : #202226 — gris-noir froid
Accent 1 : #707A84 — gris-bleu froid moyen
Support : #DCDBD8 — carte
Tonalité : neutre sans température claire — ni vraiment chaud ni vraiment froid, l'ambiguïté comme matière.
Penser à cette palette quand : institution publique/administration/service civique qui veut un neutre absolu qui ne prenne pas parti ; architecture/design industriel où la neutralité de température est une contrainte du brief.

Brume Matinale
Fond : #EEF0EE — blanc verdâtre légèrement brumeux
Texte : #1E2420 — vert-noir
Accent 1 : #8A9E8C — vert brumeux moyen
Support : #E0E4E0 — carte
Tonalité : neutre végétal quasi imperceptible, la couleur comme atmosphère plus que comme affirmation — différent de Perle & Vert Sauge Discret (fond porcelaine chaud ; ici fond légèrement verdâtre, la brume est dans le fond lui-même, pas juste dans l'accent).
Penser à cette palette quand : secteur méditation/pleine conscience/retraite contemplative qui veut un vert si discret qu'il devient une atmosphère ; brief demande "on ne voit presque pas la couleur mais on la ressent".

### 4.7 PREMIUM & IMPOSANTES (luxe maximaliste, assumé)

```
Différence avec le luxe DISCRET (4.1 Ardoise & Cuivre / Nuit Polaire & Cuivre, 4.6 Perle & Bronze
Discret, Graphite & Laiton) : ces palettes-ci sont faites pour être VUES et reconnues comme
premium fort, pas pour se faire oublier. À piocher quand le client dit explicitement "je veux que
ça respire le luxe", "imposant", "je veux qu'on le remarque" — pas "élégant et discret".
Jamais mélanger une entrée de cette section avec une entrée discrète sur le même projet : choisir
un camp selon ce que dit vraiment le client, pas les deux à la fois.
```

#### Bordeaux & Or Profond
Fond : #2B0F14 — bordeaux très sombre
Texte : #F3E6D8 — ivoire chaud
Accent 1 : #C9A227 — or profond (plus saturé/riche que le laiton mat de Graphite & Laiton)
Accent 2 : #6E1423 — bordeaux vif secondaire
Support : #3D171D — carte
Tonalité : opulent et théâtral, fait pour marquer — l'inverse assumé du luxe discret.
Penser à cette palette quand : joaillerie haut de gamme assumée, cave à vin/spiritueux prestige,
hôtel palace, marque qui veut "respirer le luxe" sans retenue.
Éviter avec : ne jamais combiner avec Perle & Bronze Discret sur des projets proches (même famille
dorée, intentions opposées).

#### Émeraude & Or Massif
Fond : #0B2A22 — vert émeraude très sombre
Texte : #F2EAD8 — ivoire chaud
Accent 1 : #D4AF37 — or classique saturé (plus franc que l'or veiné de Marbre Noir & Or)
Accent 2 : #145C3E — émeraude vif
Support : #123328 — carte
Tonalité : précieux et affirmé, pierre fine + métal noble sans retenue.
Penser à cette palette quand : joaillerie/horlogerie haut de gamme, resort 5 étoiles qui assume
l'opulence, parfumerie de luxe qui veut un vert riche plutôt que discret.

#### Marbre Noir & Or
Fond : #17161A — noir profond neutre (évoque le marbre noir)
Texte : #F0EDE4 — blanc cassé
Accent 1 : #B8934A — or veiné, plus terne/naturel que l'or massif (évoque le veinage du marbre)
Accent 2 : #2A2830 — anthracite (texture marbre)
Support : #201F24 — carte
Tonalité : minéral et cher, évoque littéralement la pierre veinée d'or.
Penser à cette palette quand : immobilier de luxe, architecture d'intérieur haut de gamme, marque
qui veut évoquer une matière noble (pierre) plutôt qu'un métal seul.

#### Saphir & Argent
Fond : #0D1B3D — bleu saphir très profond
Texte : #EDEFF5 — blanc froid
Accent 1 : #C7CDD9 — argent mat lumineux
Accent 2 : #2C4A8C — saphir vif
Support : #16244A — carte
Tonalité : froid, précieux, aristocratique — alternative au duo or/noir pour un luxe plus technique.
Penser à cette palette quand : horlogerie technique haut de gamme, automobile/yacht premium,
marque qui veut un luxe froid plutôt que chaud/doré.

#### Pourpre Impérial & Or
Fond : #2A1030 — pourpre très sombre
Texte : #F3E8ED — blanc rosé
Accent 1 : #C9A227 — or (même famille que Bordeaux & Or Profond)
Accent 2 : #5C1F52 — pourpre vif
Support : #351640 — carte
Tonalité : royal, théâtral, référence historique assumée — la plus maximaliste des 5.
Penser à cette palette quand : événementiel de gala, haute couture, produit culturel/patrimonial
qui assume une référence royale explicite. La plus risquée : exécution typo doit rester fine et
sobre, sinon bascule vite dans le kitsch — pas de dorure décorative en plus de l'accent couleur.

#### Marbre Vert Impérial
Fond : #0E2B24 — vert marbré très sombre
Texte : #F0EAD8 — ivoire chaud
Accent 1 : #C9A227 — or veiné (même famille que les autres entrées premium)
Accent 2 : #1B4A3C — vert profond secondaire
Tonalité : minéral et précieux, veiné d'or — variante marbre du vert, texturée plutôt que pleine.
Penser à cette palette quand : architecture/hôtellerie de prestige qui veut une pierre spécifique
(marbre vert) plutôt qu'un vert plein de bijouterie.
Éviter avec : Émeraude & Or Massif (même famille verte+or — l'une évoque le marbre veiné/texturé,
l'autre la pierre fine plane ; choisir selon la matière réelle évoquée par le brief).

#### Marbre Rouge Veiné
Fond : #3D0F12 — marbre rouge très sombre
Texte : #F2E4E2 — blanc rosé
Accent 1 : #C9A227 — or (cohérent avec le reste de la famille premium)
Accent 2 : #E8E2DC — veinage blanc (utilisé en fin trait, jamais en aplat)
Tonalité : dramatique et minéral, le veinage blanc contraste fort avec le rouge profond.
Penser à cette palette quand : hôtellerie/gastronomie de prestige qui veut une pierre rouge
spécifique plutôt qu'un simple bordeaux uni ; se distingue de Bordeaux & Or Profond par la texture
veinée plutôt que par une surface plane.

#### 4.7 PREMIUM & IMPOSANTES — nouvelles entrées du 26/09/26
Onyx & Platine
Fond : #0E0E10 — noir onyx quasi total (plus froid que Marbre Noir & Or)
Texte : #E8EAED — blanc platine froid
Accent 1 : #B0B4BA — platine mat (moins lumineux que l'argent de Saphir & Argent — le platine est plus sourd, plus rare)
Accent 2 : #303236 — gris-onyx support
Tonalité : le luxe le plus froid et le plus sobre de la section — ni or, ni émeraude, ni bordeaux ; le platine comme métal rare en mode discret maximum, mais sur fond premium.
Penser à cette palette quand : horlogerie ultra-haute gamme (boîtier platine), automobile sportive de prestige (noir mat + platine), marque qui veut le luxe le plus dépouillé — "l'absence de couleur est la couleur".
Éviter avec : Saphir & Argent (argent plus lumineux et froid avec fond bleu marine — ici le fond est noir neutre et le métal est sourd ; deux intentions de luxe froid différentes).

Laque Rouge & Or Brûlé
Fond : #1E0804 — rouge-noir quasi total (laque sombre)
Texte : #F5E8D8 — blanc ivoire chaud
Accent 1 : #C07828 — or brûlé (moins jaune/lumineux que l'or classique — or patiné comme les laques asiatiques)
Accent 2 : #501010 — rouge laque vif secondaire (pour éléments graphiques isolés)
Tonalité : extrême-orient assumé — laque, or patiné — plus précis culturellement que Bordeaux & Or Profond (européen/opulent) ; convient uniquement si le sujet a un ancrage asiatique/laque réel.
Penser à cette palette quand : gastronomie japonaise/coréenne haut de gamme, arts asiatiques, maison de thé premium qui assume un ancrage asiatique explicite — jamais comme substitut générique à Bordeaux & Or.

Améthyste & Or Rose
Fond : #1C0E24 — violet-noir profond (pierre sombre)
Texte : #F3EAEE — blanc légèrement rosé
Accent 1 : #C8848A — or rose (plus rosé que l'or classique — métal contemporain)
Accent 2 : #4A1A5A — améthyste vif
Support : #2C1438 — carte violet sombre
Tonalité : joaillerie contemporaine — l'or rose comme métal moderne, pas l'or traditionnel ; différent de Pourpre Impérial & Or (or jaune/historique + pourpre royale) et de Émeraude & Or Massif (vert + or classique) ; ici le violet est féminin et contemporain, l'or rose l'ancre dans la joaillerie actuelle.
Penser à cette palette quand : joaillerie contemporaine femme, cosmétique luxe qui assume un violet + or rose comme signature de marque ; secteur qui veut le luxe sans les références historiques.

---

## 5. GÉNÉRATION D'UNE PALETTE SUR-MESURE (si la bibliothèque ne convient pas)

```
Si le sujet réel du projet (Agents_Direction_Artistique.md Section 2) a un vocabulaire matériel
propre — matériaux, lumières, artefacts caractéristiques de CE monde précis — en tirer une palette
originale plutôt que de forcer une entrée existante.

Méthode :
1. Nommer 3-5 éléments concrets du monde réel du sujet (pas génériques)
2. En extraire les teintes dominantes et les nommer (jamais "couleur 1")
3. Vérifier contre Agents_Direction_Artistique.md Section 3 (3 looks génériques) — écarter
   toute combinaison qui reconstitue un des 3 looks proscrits
4. Ajouter la nouvelle palette à la bibliothèque (Section 4) une fois validée — la bibliothèque
   grossit à chaque projet qui en génère une nouvelle
```
Ces 2 couleurs sont des ancres "vocabulaire matériel" au sens de la méthode sur-mesure —
pas des palettes prêtes, juste des teintes extraites d'un matériau réel, à combiner avec un
fond/accent complémentaire selon le sujet du projet.

- **Verdigris Copper** #3C6057 — vert-de-gris/patine de bronze oxydé. Penser à cette teinte quand
  le sujet a un vrai rapport à l'ancien/l'horlogerie/le métal oxydé (voir aussi famille Ardoise &
  Cuivre pour le pairing cuivre déjà en bibliothèque, mais celui-ci est la patine, pas le métal brut).
- **Arctic Glacier Cyan** #7ED6E6 — cyan pâle glacé, plus clair et plus doux que l'accent de
  Glace Fissurée (#4A8FB8). Penser à cette teinte pour un accent clair sur fond sombre froid,
  sujet glace/polaire/fraîcheur réelle (pas un cyan tech générique).
---

## 6. LIEN AVEC LES AUTRES FICHIERS

```
Agents_Direction_Artistique.md Section 5, Passe 1 (COULEUR) → piocher ici en premier,
sinon générer sur-mesure (Section 5 de ce fichier)

Agents_Design_Reference.md Section 3 (palette d'une réf analysée) → une réf donne un PRINCIPE
de palette (ratio, température), jamais les HEX exacts à copier — cette bibliothèque-ci, elle,
donne des HEX réels et validés, prêts à l'emploi, mais toujours à confronter au sujet réel avant usage
```

---

## 7. CHECKLIST AVANT D'ASSIGNER UNE PALETTE À UN PROJET

```
□ Si répétition : exception cohérence de marque explicitement validée par le client
□ Palette confrontée au sujet réel du brief — pas choisie au hasard dans la liste
□ Vérifiée contre les 3 looks génériques IA (Direction Artistique Section 3) — aucune coïncidence
□ Si aucune entrée ne convient : palette sur-mesure générée (Section 5) plutôt que forcée
```
